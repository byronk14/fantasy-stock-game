from dagster import Definitions, load_assets_from_modules
from . import resources
from .jobs import latest_stock_price_job
from .schedules import latest_stock_update_schedule

from . import assets

all_assets = load_assets_from_modules([assets])
all_jobs = [latest_stock_price_job]
all_schedules = [latest_stock_update_schedule]

defs = Definitions(
    assets=all_assets,
    resources={
        "mysql_database": resources.mysql_resource
    },
    jobs=all_jobs,
    schedules=all_schedules
)
