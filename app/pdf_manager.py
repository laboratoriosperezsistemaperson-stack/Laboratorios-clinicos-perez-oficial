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
            # BUCKET PRINCIPAL: labos2026 para PDFs y datos de pacientes
            self.buckets = {
                "pdf": "labos2026",  # Bucket principal para resultados de pacientes
                "img": "imagenes"     # Bucket para imágenes de redes sociales
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

    def save_video(self, file, folder_path):
        """
        Sube un video a Supabase Storage (Bucket: imagenes).
        Extensions: mp4, webm, mov
        folder_path: 'social', 'videos', etc.
        """
        if not file or file.filename == '':
            return False, None, "No se seleccionó ningún archivo"
        
        ALLOWED_EXTENSIONS = {'mp4', 'webm', 'mov'}
        if not self.allowed_file(file.filename, ALLOWED_EXTENSIONS):
            return False, None, "Formato de video no permitido (solo MP4, WebM, MOV)"

        if not self.supabase:
            return False, None, "Error de configuración: Supabase no conectado"

        try:
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = self.generate_filename("vid", file.filename) + f".{ext}"
            storage_path = f"{folder_path}/{filename}"
            
            # MIME types para videos
            mime_types = {
                'mp4': 'video/mp4',
                'webm': 'video/webm',
                'mov': 'video/quicktime'
            }
            mime_type = mime_types.get(ext, 'video/mp4')
            
            file_content = file.read()
            self.supabase.storage.from_(self.buckets['img']).upload(
                path=storage_path,
                file=file_content,
                file_options={"content-type": mime_type}
            )
            file.seek(0)
            
            return True, storage_path, None
        except Exception as e:
            return False, None, f"Error al guardar video en Supabase: {str(e)}"

    def get_public_url(self, storage_path, bucket_type='pdf'):
        """Obtiene la URL pública del archivo. bucket_type: 'pdf' o 'img'"""
        if not self.supabase or not storage_path:
            return None
        try:
            bucket = self.buckets.get(bucket_type, 'labos2026')
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
            bucket = self.buckets.get(bucket_type, 'labos2026')
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

    def rename_patient_folder(self, old_ci, old_nombre, new_ci, new_nombre):
        """
        Renombra la carpeta de un paciente en Supabase Storage.
        Mueve todos los archivos de la carpeta antigua a la nueva ubicación.
        Retorna: (success, list_of_updated_paths, error_message)
        """
        if not self.supabase:
            return False, [], "Supabase no conectado"
        
        try:
            old_folder_name = secure_filename(f"{old_ci}_{old_nombre}")
            new_folder_name = secure_filename(f"{new_ci}_{new_nombre}")
            
            if old_folder_name == new_folder_name:
                return True, [], None  # No hay cambios
            
            old_prefix = f"pacientes/{old_folder_name}/"
            new_prefix = f"pacientes/{new_folder_name}/"
            
            bucket = self.buckets['pdf']
            
            # Listar todos los archivos en la carpeta antigua
            try:
                files_list = self.supabase.storage.from_(bucket).list(f"pacientes/{old_folder_name}")
            except Exception as e:
                print(f"⚠️ No se encontró carpeta antigua o está vacía: {e}")
                return True, [], None  # No hay archivos que mover
            
            if not files_list:
                return True, [], None  # Carpeta vacía
            
            updated_paths = []
            
            for file_info in files_list:
                if file_info.get('name'):
                    old_path = f"{old_prefix}{file_info['name']}"
                    new_path = f"{new_prefix}{file_info['name']}"
                    
                    try:
                        # Mover archivo a nueva ubicación
                        self.supabase.storage.from_(bucket).move(old_path, new_path)
                        updated_paths.append({
                            'old': old_path,
                            'new': new_path
                        })
                        print(f"✓ Movido: {old_path} → {new_path}")
                    except Exception as move_error:
                        print(f"⚠️ Error moviendo {old_path}: {move_error}")
            
            print(f"✅ Carpeta renombrada: {old_folder_name} → {new_folder_name}")
            return True, updated_paths, None
            
        except Exception as e:
            error_msg = f"Error al renombrar carpeta en Supabase: {str(e)}"
            print(f"❌ {error_msg}")
            return False, [], error_msg
