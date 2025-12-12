import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Agregar el directorio raíz al path para poder importar 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import Publicacion, FotoGaleria, Prueba, ConfiguracionLab

# Cargar variables de entorno
load_dotenv()

# Configuración
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
BUCKET_NAME = "imagenes"

if not url or not key:
    print("❌ Error: No se encontraron credenciales de Supabase")
    sys.exit(1)

supabase: Client = create_client(url, key)
app = create_app()

def get_public_url(path):
    """Obtiene URL pública de Supabase dado un path"""
    return supabase.storage.from_(BUCKET_NAME).get_public_url(path)

def update_db():
    print("🚀 Iniciando actualización de base de datos...")
    
    with app.app_context():
        # 1. PUBLICACIONES (uploads/social/...)
        print("\n--- Actualizando Publicaciones ---")
        pubs = Publicacion.query.all()
        for p in pubs:
            if p.imagen and 'uploads/social/' in p.imagen and 'supabase' not in p.imagen:
                # Extraer filename: uploads/social/foto.jpg -> social/foto.jpg
                filename = p.imagen.split('/')[-1]
                storage_path = f"social/{filename}"
                new_url = get_public_url(storage_path)
                
                print(f"🔄 {p.titulo[:20]}...: {p.imagen} -> {new_url}")
                p.imagen = new_url
        
        # 2. GALERÍA (uploads/social/...)
        print("\n--- Actualizando Galería ---")
        fotos = FotoGaleria.query.all()
        for f in fotos:
            if f.imagen and 'uploads/social/' in f.imagen and 'supabase' not in f.imagen:
                filename = f.imagen.split('/')[-1]
                storage_path = f"social/{filename}"
                new_url = get_public_url(storage_path)
                
                print(f"🔄 {f.titulo[:20]}...: {f.imagen} -> {new_url}")
                f.imagen = new_url

        # 3. PRUEBAS (uploads/pruebas/...)
        print("\n--- Actualizando Pruebas ---")
        pruebas = Prueba.query.all()
        for p in pruebas:
            if p.imagen and 'uploads/pruebas' not in p.imagen and 'supabase' not in p.imagen:
                # A veces guardaba solo el filename "123123_foto.jpg"
                # Ojo: admin_pruebas guardaba en PRUEBAS_UPLOAD_DIR
                pass 
                # El problema es que antes guardaba solo el filename o path relativo?
                # Revisando routes.py antiguo: imagen.save(...); prueba.imagen = imagen_filename
                # Entonces en BD solo está "filename.jpg".
                # Supabase path: pruebas/filename.jpg
                
            if p.imagen and 'supabase' not in p.imagen:
                 # Asumimos que si no es URL, es filename antiguo
                 filename = p.imagen.split('/')[-1] # por si acaso tiene path
                 storage_path = f"pruebas/{filename}"
                 new_url = get_public_url(storage_path)
                 print(f"🔄 Prueba {p.nombre[:20]}...: {p.imagen} -> {new_url}")
                 p.imagen = new_url

        # 4. CONFIGURACIÓN (uploads/social/...)
        print("\n--- Actualizando Configuración (Perfil/Portada) ---")
        configs = ConfiguracionLab.query.filter(ConfiguracionLab.clave.in_(['foto_perfil', 'foto_portada'])).all()
        for c in configs:
            if c.valor and 'uploads/social/' in c.valor and 'supabase' not in c.valor:
                filename = c.valor.split('/')[-1]
                # Perfil/Portada se guardaba en social
                if 'perfil' in filename: 
                     storage_path = f"perfil/{filename}" # Espera, en migrate_images puse social
                     # migrate_images sube todo social/* a social/*
                     # routes.py antiguo guardaba perfil/portada en SOCIAL_UPLOAD_DIR
                     # migrate_images movio TODO social/* a bucket/social/
                     pass
                else:
                     pass
                
                # REVISIÓN: admin/redes_sociales guardaba en SOCIAL_UPLOAD_DIR
                # Entonces migrate_images lo subió a "social/filename.jpg".
                # EXCEPTO si yo cambié la lógica en routes.py nuevo para usar 'perfil' y 'portada'.
                # Mi nuevo codigo usa 'perfil' y 'portada' folders.
                # Pero migrate_images usó 'social' para todo lo que estaba en static/uploads/social.
                # ASI QUE: Los archivos viejos están en 'social/'. 
                # Mi script de DB debe apuntar a 'social/' para los viejos.
                
                storage_path = f"social/{filename}"
                new_url = get_public_url(storage_path)
                print(f"🔄 Config {c.clave}: {c.valor} -> {new_url}")
                c.valor = new_url

        db.session.commit()
        print("\n✅ Base de datos actualizada correctamente.")

if __name__ == "__main__":
    update_db()
