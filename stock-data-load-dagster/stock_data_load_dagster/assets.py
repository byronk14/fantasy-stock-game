from dagster import asset, AssetIn, MetadataValue, MaterializeResult
import alpaca
import mysql.connector
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockLatestBarRequest
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
    
    multisymbol_request_params = StockLatestBarRequest(symbol_or_symbols=TICKER_LIST)

    latest_multisymbol_quotes = client.get_stock_latest_bar(multisymbol_request_params)

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
            values.close,
            values.high,
            values.low,
            values.open,
            values.trade_count,
            values.volume,
            values.vwap,
            values.timestamp
        ])

    query = """
            INSERT INTO latest_stock_quotes (
                symbol, 
                stock_close,
                stock_high,
                stock_low,
                stock_open,
                stock_trade_count,
                stock_volume,
                stock_vwap,
                stock_timestamp
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

    cursor.executemany(query, (data_insert))
    
    connection.commit()

    cursor.close()
    connection.close()