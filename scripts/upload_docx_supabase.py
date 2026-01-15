"""
Script para subir el documento DOCX de ADN a Supabase Storage
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# Configuración
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
DOCX_PATH = os.path.join(BASE_DIR, 'app', 'static', 'uploads', 'docs', 'pruebas_adn_perez.docx')

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
BUCKET_NAME = "labos2026"  # Main bucket for Laboratorios Perez

def upload_docx():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Error: Faltan credenciales de Supabase en .env")
        return None
    
    if not os.path.exists(DOCX_PATH):
        print(f"❌ Error: Archivo no encontrado: {DOCX_PATH}")
        return None
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("📤 Subiendo documento DOCX a Supabase Storage...")
    print(f"📂 Archivo local: {DOCX_PATH}")
    
    try:
        # Leer el archivo
        with open(DOCX_PATH, 'rb') as f:
            file_content = f.read()
        
        # Ruta en el bucket
        storage_path = "docs/pruebas_adn_perez.docx"
        
        # Subir a Supabase
        supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=file_content,
            file_options={
                "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "upsert": "true"
            }
        )
        
        # Obtener URL pública
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
        
        print(f"✅ Documento subido exitosamente!")
        print(f"🔗 URL pública: {public_url}")
        
        return public_url
        
    except Exception as e:
        if "Duplicate" in str(e) or "already exists" in str(e).lower():
            # Si ya existe, obtener la URL
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url("docs/pruebas_adn_perez.docx")
            print(f"ℹ️ Archivo ya existe en Supabase")
            print(f"🔗 URL pública: {public_url}")
            return public_url
        else:
            print(f"❌ Error subiendo archivo: {e}")
            return None

if __name__ == "__main__":
    url = upload_docx()
    if url:
        print("\n" + "="*50)
        print("SIGUIENTE PASO:")
        print("="*50)
        print("Actualiza el enlace de descarga en servicios.html con esta URL:")
        print(url)
