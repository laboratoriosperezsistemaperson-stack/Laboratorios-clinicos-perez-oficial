import os
import sys
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client
from pathlib import Path

# Cargar variables de entorno
load_dotenv()

# Configuración de Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
BUCKET_NAME = "imagenes"

if not url or not key:
    print("❌ Error: No se encontraron las credenciales de Supabase en .env")
    sys.exit(1)

supabase: Client = create_client(url, key)

def get_mime_type(filename):
    ext = filename.lower().split('.')[-1]
    if ext in ['jpg', 'jpeg']: return 'image/jpeg'
    if ext == 'png': return 'image/png'
    if ext == 'gif': return 'image/gif'
    if ext == 'webp': return 'image/webp'
    return 'application/octet-stream'

def migrate_images():
    print("🚀 Iniciando migración de imágenes...")
    
    # 1. Asegurar que el bucket existe
    try:
        buckets = supabase.storage.list_buckets()
        bucket_exists = any(b.name == BUCKET_NAME for b in buckets)
        
        if not bucket_exists:
            print(f"📦 Creando bucket '{BUCKET_NAME}'...")
            supabase.storage.create_bucket(BUCKET_NAME, options={"public": True})
        else:
            print(f"✅ Bucket '{BUCKET_NAME}' detectado.")
    except Exception as e:
        print(f"⚠️ Error verificando bucket (puede que ya exista): {e}")

    # 2. Rutas a migrar
    base_dir = Path("app/static/uploads")
    folders_to_migrate = {
        "social": base_dir / "social",
        "pruebas": base_dir / "pruebas" # Asumiendo que esta carpeta existe si se usa
    }

    total_uploaded = 0
    errors = 0

    for folder_name, folder_path in folders_to_migrate.items():
        if not folder_path.exists():
            print(f"ℹ️ Carpeta local no encontrada: {folder_path} (Saltando)")
            continue
            
        print(f"\n📂 Procesando carpeta: {folder_name}")
        
        for file_path in folder_path.rglob("*"):
            if file_path.is_file():
                filename = file_path.name
                # Evitar archivos ocultos o no imagenes
                if filename.startswith('.') or filename.lower().split('.')[-1] not in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                    continue
                
                # Ruta destino en Supabase: social/filename.jpg
                storage_path = f"{folder_name}/{filename}"
                
                print(f"   ⬆️ Subiendo: {filename} -> {storage_path}")
                
                try:
                    with open(file_path, "rb") as f:
                        file_content = f.read()
                        mime_type = get_mime_type(filename)
                        
                        supabase.storage.from_(BUCKET_NAME).upload(
                            path=storage_path,
                            file=file_content,
                            file_options={"content-type": mime_type, "upsert": "true"}
                        )
                    total_uploaded += 1
                except Exception as e:
                    print(f"   ❌ Error subiendo {filename}: {e}")
                    errors += 1

    print("\n" + "="*50)
    print(f"🎉 Migración finalizada.")
    print(f"✅ Subidos: {total_uploaded}")
    print(f"❌ Errores: {errors}")
    print("="*50)

if __name__ == "__main__":
    migrate_images()
