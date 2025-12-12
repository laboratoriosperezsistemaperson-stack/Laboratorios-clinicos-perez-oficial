import os
import secrets
from datetime import datetime
from werkzeug.utils import secure_filename
from supabase import create_client, Client

class FileManager:
    def __init__(self, upload_folder=None):
        # Inicializar Supabase
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        if url and key:
            self.supabase: Client = create_client(url, key)
            self.buckets = {
                "pdf": "resultados",
                "img": "imagenes"
            }
        else:
            print("⚠️ ADVERTENCIA: No se encontraron credenciales de Supabase")
            self.supabase = None
    
    def allowed_file(self, filename, allowed_extensions):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
    
    def generate_filename(self, prefix, original_filename):
        safe_name = secure_filename(original_filename)
        name_without_ext = safe_name.rsplit('.', 1)[0] if '.' in safe_name else safe_name
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = secrets.token_hex(4)
        return f"{prefix}_{name_without_ext}_{timestamp}_{unique_id}"
    
    def save_pdf(self, file, numero_orden, paciente=None):
        """
        Sube el PDF a Supabase Storage (Bucket: resultados).
        Organiza archivos en carpetas por paciente: 'pacientes/CI_Nombre/filename.pdf'
        """
        if not file or file.filename == '':
            return False, None, "No se seleccionó ningún archivo"
        if not self.allowed_file(file.filename, {'pdf'}):
            return False, None, "El archivo debe ser PDF"
        
        if not self.supabase:
            return False, None, "Error de configuración: Supabase no conectado"

        try:
            filename = self.generate_filename(numero_orden, file.filename) + ".pdf"
            
            # Definir carpeta de destino
            if paciente:
                folder_name = secure_filename(f"{paciente.ci}_{paciente.nombre}")
                storage_path = f"pacientes/{folder_name}/{filename}"
            else:
                folder = datetime.now().strftime('%Y/%m')
                storage_path = f"{folder}/{filename}"
            
            # Subir a Supabase
            file_content = file.read()
            self.supabase.storage.from_(self.buckets['pdf']).upload(
                path=storage_path,
                file=file_content,
                file_options={"content-type": "application/pdf"}
            )
            file.seek(0)
            
            return True, storage_path, None
        except Exception as e:
            return False, None, f"Error al guardar PDF en Supabase: {str(e)}"

    def save_image(self, file, folder_path):
        """
        Sube una imagen a Supabase Storage (Bucket: imagenes).
        Extensions: png, jpg, jpeg, gif, webp
        folder_path: 'social', 'pruebas', etc.
        """
        if not file or file.filename == '':
            return False, None, "No se seleccionó ningún archivo"
        
        ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        if not self.allowed_file(file.filename, ALLOWED_EXTENSIONS):
            return False, None, "Formato de imagen no permitido"

        if not self.supabase:
            return False, None, "Error de configuración: Supabase no conectado"

        try:
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = self.generate_filename("img", file.filename) + f".{ext}"
            storage_path = f"{folder_path}/{filename}"
            
            # Detectar content/type rudimentario
            mime_type = f"image/{ext}" if ext != 'jpg' else 'image/jpeg'
            
            file_content = file.read()
            self.supabase.storage.from_(self.buckets['img']).upload(
                path=storage_path,
                file=file_content,
                file_options={"content-type": mime_type}
            )
            file.seek(0)
            
            return True, storage_path, None
        except Exception as e:
            return False, None, f"Error al guardar imagen en Supabase: {str(e)}"

    def get_public_url(self, storage_path, bucket_type='pdf'):
        """Obtiene la URL pública del archivo. bucket_type: 'pdf' o 'img'"""
        if not self.supabase or not storage_path:
            return None
        try:
            bucket = self.buckets.get(bucket_type, 'resultados')
            # Detectar bucket basado en extensión si no se especifica bien (fallback)
            if bucket_type == 'pdf' and not storage_path.endswith('.pdf'):
                 bucket = self.buckets['img'] # Asumir imagen si no es pdf
                 
            return self.supabase.storage.from_(bucket).get_public_url(storage_path)
        except:
            return None

    def delete_file(self, storage_path, bucket_type='pdf'):
        """Elimina el archivo de Supabase"""
        if not self.supabase or not storage_path:
            return False
        try:
            bucket = self.buckets.get(bucket_type, 'resultados')
             # Auto-detect bucket fallback
            if bucket_type == 'pdf' and not storage_path.endswith('.pdf'):
                 bucket = self.buckets['img']

            self.supabase.storage.from_(bucket).remove([storage_path])
            return True
        except:
            return False

    # Alias para compatibilidad hacia atrás durante refactor
    def delete_pdf(self, path): return self.delete_file(path, 'pdf')
    
    def move_to_trash(self, storage_path, bucket_type='pdf'):
        if not self.supabase or not storage_path:
            return False
        try:
            bucket = self.buckets.get(bucket_type, 'resultados')
            new_path = f"papelera/{storage_path}"
            self.supabase.storage.from_(bucket).move(storage_path, new_path)
            return True, new_path
        except Exception as e:
            print(f"Error moviendo a papelera: {e}")
            return False, storage_path

    def restore_from_trash(self, storage_path, bucket_type='pdf'):
        if not self.supabase or not storage_path:
            return False, storage_path
        try:
            bucket = self.buckets.get(bucket_type, 'resultados')
            # Asumiendo que storage_path ya incluye 'papelera/'
            new_path = storage_path.replace('papelera/', '', 1)
            self.supabase.storage.from_(bucket).move(storage_path, new_path)
            return True, new_path
        except:
            return False, storage_path
