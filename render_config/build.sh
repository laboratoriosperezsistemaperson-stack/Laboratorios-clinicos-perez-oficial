#!/usr/bin/env bash
# exit on error
set -o errexit

echo "🚀 Iniciando Build para Render..."

echo "📦 Instalando dependencias..."
pip install -r requirements.txt

echo "🔄 Ejecutando migraciones (si es necesario)..."
# python scripts/migrate_add_column.py # Ejemplo si necesitamos correr scripts
# flask db upgrade # Si usaras flask-migrate

echo "✅ Build finalizado exitosamente."
