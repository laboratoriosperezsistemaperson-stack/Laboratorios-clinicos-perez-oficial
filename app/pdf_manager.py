import os
import secrets
from datetime import datetime
from werkzeug.utils import secure_filename
from supabase import create_client, Client

class PDFManager:
    def __init__(self, upload_folder=None):
        # Inicializar Supabase
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        if url and key:
            self.supabase: Client = create_client(url, key)
            self.bucket_name = "resultados"
        else:
            print("⚠️ ADVERTENCIA: No se encontraron credenciales de Supabase")
            self.supabase = None
    
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'
    
    def generate_filename(self, numero_orden, original_filename):
        safe_name = secure_filename(original_filename)
        name_without_ext = safe_name.rsplit('.', 1)[0] if '.' in safe_name else safe_name
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = secrets.token_hex(4)
        return f"{numero_orden}_{name_without_ext}_{timestamp}_{unique_id}.pdf"
    
    def save_pdf(self, file, numero_orden, paciente=None):
        """
        Sube el PDF a Supabase Storage.
        Organiza archivos en carpetas por paciente: 'pacientes/CI_Nombre/filename.pdf'
        """
        if not file or file.filename == '':
            return False, None, "No se seleccionó ningún archivo"
        if not self.allowed_file(file.filename):
            return False, None, "El archivo debe ser PDF"
        
        if not self.supabase:
            return False, None, "Error de configuración: Supabase no conectado"

        try:
            filename = self.generate_filename(numero_orden, file.filename)
            
            # Definir carpeta de destino
            if paciente:
                folder_name = secure_filename(f"{paciente.ci}_{paciente.nombre}")
                storage_path = f"pacientes/{folder_name}/{filename}"
            else:
                # Fallback si no hay paciente (no debería pasar normalmente)
                folder = datetime.now().strftime('%Y/%m')
                storage_path = f"{folder}/{filename}"
            
            # Leer contenido del archivo
            file_content = file.read()
            
            # Subir a Supabase
            res = self.supabase.storage.from_(self.bucket_name).upload(
                path=storage_path,
                file=file_content,
                file_options={"content-type": "application/pdf"}
            )
            
            # Resetear puntero del archivo por si se usa después
            file.seek(0)
            
            return True, storage_path, None
        except Exception as e:
            return False, None, f"Error al guardar en Supabase: {str(e)}"
    
    def get_public_url(self, storage_path):
        """Obtiene la URL pública del archivo"""
        if not self.supabase or not storage_path:
            return None
        try:
            return self.supabase.storage.from_(self.bucket_name).get_public_url(storage_path)
        except:
            return None

    def delete_pdf(self, storage_path):
        """Elimina el archivo de Supabase"""
        if not self.supabase or not storage_path:
            return False
        try:
            self.supabase.storage.from_(self.bucket_name).remove([storage_path])
            return True
        except:
            return False
            
    # Compatibilidad con código anterior (soft delete simulado moviendo a carpeta 'papelera')
    # En Storage, 'mover' es copiar y borrar.
    def move_to_trash(self, storage_path):
        if not self.supabase or not storage_path:
            return False
        try:
            new_path = f"papelera/{storage_path}"
            self.supabase.storage.from_(self.bucket_name).move(storage_path, new_path)
            return True, new_path
        except Exception as e:
            print(f"Error moviendo a papelera: {e}")
            return False, storage_path

    def restore_from_trash(self, storage_path):
        if not self.supabase or not storage_path:
            return False
        try:
            # Asumiendo que storage_path ya incluye 'papelera/'
            new_path = storage_path.replace('papelera/', '', 1)
            self.supabase.storage.from_(self.bucket_name).move(storage_path, new_path)
            return True, new_path
        except:
            return False, storage_path
