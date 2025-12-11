import os
import sys

# Agregar el directorio raíz al path para poder importar 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import Resultado
from supabase import create_client
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Configuración
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'app', 'static', 'uploads')
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
BUCKET_NAME = "resultados"

def migrate():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Error: Faltan credenciales de Supabase en .env")
        return

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    app = create_app()

    print("🚀 Iniciando migración de archivos a Supabase Storage...")
    print(f"📂 Carpeta local de uploads: {UPLOAD_FOLDER}")

    # Intentar crear bucket
    try:
        print(f"📦 Verificando bucket '{BUCKET_NAME}'...")
        buckets = supabase.storage.list_buckets()
        bucket_exists = any(b.name == BUCKET_NAME for b in buckets)
        if not bucket_exists:
            print(f"   ⚠️ Bucket '{BUCKET_NAME}' no existe. Intentando crear (Público)...")
            supabase.storage.create_bucket(BUCKET_NAME, options={"public": True})
            print(f"   ✅ Bucket '{BUCKET_NAME}' creado exitosamente.")
        else:
            print(f"   ✅ Bucket '{BUCKET_NAME}' ya existe.")
    except Exception as e:
        print(f"   ⚠️ No se pudo verificar/crear bucket automáticmente: {e}")
        print("   ⚠️ Asegúrese de que el bucket 'resultados' exista y sea PÚBLICO en el dashboard de Supabase.")

    with app.app_context():
        resultados = Resultado.query.all()
        print(f"📊 Total de resultados en BD: {len(resultados)}")
        
        exitos = 0
        fallos = 0
        no_encontrados = 0

        for res in resultados:
            if not res.archivo_pdf:
                continue

            # La ruta en BD puede ser relativa 'pacientes/...' o absoluta vieja
            rel_path = res.archivo_pdf.replace('\\', '/')
            
            # Construir ruta absoluta local
            # Intentar varias combinaciones
            possible_paths = [
                os.path.join(UPLOAD_FOLDER, rel_path),
                os.path.join(UPLOAD_FOLDER, 'pacientes', rel_path) if not rel_path.startswith('pacientes') else None,
            ]
            
            file_found = False
            local_path = None
            
            for p in possible_paths:
                if p and os.path.exists(p):
                    local_path = p
                    file_found = True
                    break
            
            if not file_found:
                # print(f"⚠️ Archivo no encontrado localmente: {rel_path}")
                no_encontrados += 1
                continue

            # Subir a Supabase
            try:
                # Usar el mismo path relativo para mantener consistencia con la BD
                # Asegurar que sea forward slashes
                storage_path = rel_path
                
                # Leer archivo
                with open(local_path, 'rb') as f:
                    file_content = f.read()

                # Subir
                # upsert=True para sobrescribir si ya existe
                supabase.storage.from_(BUCKET_NAME).upload(
                    path=storage_path,
                    file=file_content,
                    file_options={"content-type": "application/pdf", "upsert": "true"}
                )
                
                print(f"✅ Subido: {storage_path}")
                exitos += 1

            except Exception as e:
                if "Duplicate" in str(e) or "The object already exists" in str(e):
                     print(f"ℹ️ Ya existe en nube: {storage_path}")
                     exitos += 1
                else:
                    print(f"❌ Error subiendo {rel_path}: {e}")
                    fallos += 1

        print("\n" + "="*30)
        print("RESUMEN DE MIGRACIÓN")
        print("="*30)
        print(f"✅ Exitosos: {exitos}")
        print(f"❌ Fallidos: {fallos}")
        print(f"⚠️ No encontrados localmente: {no_encontrados}")
        print("="*30)

if __name__ == "__main__":
    migrate()
