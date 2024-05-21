from dagster import asset, AssetIn
import alpaca
import mysql.connector
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockLatestQuoteRequest
from dotenv import load_dotenv
import os


@asset()
def valid_ticker_data():
    """
    Retrieve valid stock tickers that the app currently supports.
    """
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
def latest_stock_data(valid_ticker_data):
    """
    Retrieve latest stock data for the specified subset of tickers.
    """
    TICKER_LIST = valid_ticker_data

    client = StockHistoricalDataClient(os.getenv('APCA-API-KEY-ID'), os.getenv('APCA-API-SECRET-KEY'))
    
    multisymbol_request_params = StockLatestQuoteRequest(symbol_or_symbols=TICKER_LIST)

    latest_multisymbol_quotes = client.get_stock_latest_quote(multisymbol_request_params)

