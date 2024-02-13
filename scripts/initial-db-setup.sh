#!/bin/bash

database_url="${DATABASE_URL:-postgresql://postgres:password@localhost:54321/postgres}"

echo "Running initial DB Setup for => ${database_url}"

psql $database_url -AXqtc "$(cat ./scripts/sql/initial-sql.sql)"

echo "Setup Done!"

echo "Migration Started!"

bash ./scripts/migrate.sh
