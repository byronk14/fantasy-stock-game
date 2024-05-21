import mysql.connector
from dotenv import load_dotenv
import os
from dagster import resource

load_dotenv()  # Load the .env file

# database_resource = MySQLResource(
#     config={
#         'username': os.getenv('MYSQL_USERNAME'),
#         'password': os.getenv('MYSQL_PASSWORD'),
#         'host': os.getenv('MYSQL_HOST'),
#         'port': os.getenv('MYSQL_PORT'),
#         'database': os.getenv('MYSQL_DATABASE'),
#     }
# )

@resource(
    config_schema={
        "host": str,
        "user": str,
        "password": str,
        "port": int,
        "database": str,
    }
)
def mysql_resource(init_context):
    host = init_context.resource_config["host"]
    user = init_context.resource_config["user"]
    password = init_context.resource_config["password"]
    database = init_context.resource_config["database"]
    port = init_context.resource_config["port"]

    connection = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        port=port
    )
    return connection