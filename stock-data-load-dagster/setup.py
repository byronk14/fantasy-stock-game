from setuptools import find_packages, setup

setup(
    name="stock_data_load_dagster",
    packages=find_packages(exclude=["stock_data_load_dagster_tests"]),
    install_requires=[
        "dagster",
        "dagster-cloud",
        "alpaca-py",
        "mysql-connector-python",
        "python-dotenv"
    ],
    extras_require={"dev": ["dagster-webserver", "pytest"]},
)
