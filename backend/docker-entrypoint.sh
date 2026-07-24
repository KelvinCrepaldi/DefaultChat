#!/bin/sh
set -e

echo "Waiting for database..."
until nc -z "$DB_HOST" "${PGPORT:-5432}"; do
  sleep 1
done

echo "Running migrations..."
npx typeorm-ts-node-commonjs -d ./src/data-source.ts migration:run

echo "Starting API..."
exec node dist/app.js
