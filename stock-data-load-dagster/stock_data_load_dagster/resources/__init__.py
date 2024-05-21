from dagster import resource
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

load_dotenv("./stock_data_load_dagster/.env") # Load the .env file

@resource(config_schema={
    'host': str,
    'port': int,
    'user': str,
    'password': str,
    'database': str,
})
def mysql_resource(init_context):
    config = init_context.resource_config
    try:
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            port=os.getenv('MYSQL_PORT'),
            user=os.getenv('MYSQL_USERNAME'),
            password=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE')
        )
        if connection.is_connected():
            init_context.log.info("Successfully connected to MySQL database")
            return connection
    except Error as e:
        init_context.log.error(f"Error connecting to MySQL: {e}")
        raise
