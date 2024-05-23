from dagster import ScheduleDefinition
from ..jobs import latest_stock_price_job

latest_stock_update_schedule = ScheduleDefinition(
    job=latest_stock_price_job,
    cron_schedule="0 22 * * 1-5", # every week day at 5pm ESTs
)
