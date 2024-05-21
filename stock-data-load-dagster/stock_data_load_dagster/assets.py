from dagster import asset, AssetIn, MetadataValue, MaterializeResult
import alpaca
import mysql.connector
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockLatestQuoteRequest
from dotenv import load_dotenv
import os



@asset()
def valid_ticker_data(context):
    """
    Retrieve valid stock tickers that the app currently supports.
    """

    load_dotenv("./stock_data_load_dagster/.env")

    connection = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        user=os.getenv('MYSQL_USERNAME'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE'),
    )

    cursor = connection.cursor()
    
    query = """
            SELECT
                stock_ticker
            FROM
                ref_supported_stocks;
            """

    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()

    return results

@asset(
        ins = {"valid_ticker_data": AssetIn("valid_ticker_data")}
        )
def latest_stock_data(context, valid_ticker_data):
    """
    Retrieve latest stock data for the specified subset of tickers.
    """
    context.log.info(valid_ticker_data)

    load_dotenv("./stock_data_load_dagster/.env")

    TICKER_LIST = [tick[0] for tick in valid_ticker_data]

    client = StockHistoricalDataClient(os.getenv('APCA_API_KEY_ID'), os.getenv('APCA_API_SECRET_KEY'))
    
    multisymbol_request_params = StockLatestQuoteRequest(symbol_or_symbols=TICKER_LIST)

    latest_multisymbol_quotes = client.get_stock_latest_quote(multisymbol_request_params)

    context.log.info(latest_multisymbol_quotes)

    connection = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        user=os.getenv('MYSQL_USERNAME'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE'),
    )

    cursor = connection.cursor()
    
    data_insert = []

    for _, values in latest_multisymbol_quotes.items():
        data_insert.append([
            values.symbol,
            values.ask_exchange,
            values.ask_price,
            values.ask_size,
            values.bid_exchange,
            values.bid_price,
            values.bid_size,
            ','.join(values.conditions), 
            values.tape,
            values.timestamp
        ])

    query = """
            INSERT INTO latest_stock_quotes (
                symbol, 
                ask_exchange, 
                ask_price, 
                ask_size, 
                bid_exchange, 
                bid_price, 
                bid_size, 
                conditions, 
                tape, 
                timestamp
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

    cursor.executemany(query, (data_insert))
    
    connection.commit()

    cursor.close()
    connection.close()