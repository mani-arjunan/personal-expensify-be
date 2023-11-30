database_url="${DATABASE_URL:-postgresql://postgres:password@localhost:54321/postgres}"

# migration_details insert query
insert_into_migration_details () {
  migration_file=$1

  psql $database_url -AXqtc "INSERT INTO migration_details(migration_file, created_at) VALUES ('$migration_file', 'now()')" 
}

# Array Contains method
contains () {
  local list=$1
  local search_element=$2

  for elem in $list
  do
    if [ "$elem" == "${search_element}" ]; then
      return 0
    fi
  done

  return 1
}

echo "Running initial DB Setup for => ${database_url}"

migrated_files=$(psql $database_url -AXqtc "SELECT migration_file FROM migration_details")

for file_to_migrate in $(ls ./scripts/sql/migrations)
do
  if ! contains $migrated_files $file_to_migrate; then
    psql $database_url -AXqtc "$(cat ./scripts/sql/migrations/$file_to_migrate)"
    insert_into_migration_details $file_to_migrate
    echo "Migration Done for file $file_to_migrate"
  fi
done

echo "Migration Completed"
