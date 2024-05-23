from dagster import AssetSelection, define_asset_job

latest_stock_price_job = define_asset_job(
    name="latest_stock_price_job",
    selection=AssetSelection.all()
)
