import os
from flask import Flask
from sqlalchemy import text
from app import db, create_app

app = create_app()

with app.app_context():
    try:
        # Check if column exists first
        check_sql = text("SELECT column_name FROM information_schema.columns WHERE table_name='resultados' AND column_name='prueba_id';")
        result = db.session.execute(check_sql).fetchone()
        
        if not result:
            print("Adding prueba_id column to resultados table...")
            # Add column
            add_column_sql = text("ALTER TABLE resultados ADD COLUMN prueba_id INTEGER REFERENCES pruebas(id);")
            db.session.execute(add_column_sql)
            db.session.commit()
            print("SUCCESS: Column prueba_id added.")
        else:
            print("INFO: Column prueba_id already exists.")
            
    except Exception as e:
        print(f"ERROR: {e}")
        db.session.rollback()
