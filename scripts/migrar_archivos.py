import os
import shutil
from werkzeug.utils import secure_filename
from app import create_app,db
from app.models import Resultado, Paciente

app = create_app()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, 'app', 'static', 'uploads')

def migrar_archivos():
    """
    Migra archivos existentes a la nueva estructura de carpetas por paciente.
    Limpia archivos basura que no estén en la base de datos.
    """
    print("Iniciando migración y limpieza de archivos...")
    
    with app.app_context():
        resultados = Resultado.query.all()
        archivos_bd = set()
        
        # 1. Migrar archivos válidos
        for r in resultados:
            if not r.archivo_pdf:
                continue
                
            # Identificar ruta actual
            ruta_actual = None
            filename = os.path.basename(r.archivo_pdf)
            
            # Caso 1: Estaba en la raíz de uploads (formato antiguo)
            path_raiz = os.path.join(UPLOAD_DIR, filename)
            
            # Caso 2: Ya tiene ruta relativa nueva en BD?
            path_relativo = os.path.join(UPLOAD_DIR, r.archivo_pdf)
            
            if os.path.exists(path_relativo) and os.path.isfile(path_relativo):
                 # Ya está en su lugar o ruta correcta, pero verifiquemos si está en carpeta paciente
                 ruta_actual = path_relativo
            elif os.path.exists(path_raiz) and os.path.isfile(path_raiz):
                 ruta_actual = path_raiz
            
            if ruta_actual:
                # Crear carpeta destino
                nombre_carpeta = secure_filename(f"{r.paciente_ci}_{r.paciente_nombre}")
                carpeta_paciente = os.path.join(UPLOAD_DIR, 'pacientes', nombre_carpeta)
                os.makedirs(carpeta_paciente, exist_ok=True)
                
                ruta_destino = os.path.join(carpeta_paciente, filename)
                
                # Mover si no está en el destino
                if os.path.abspath(ruta_actual) != os.path.abspath(ruta_destino):
                    try:
                        shutil.move(ruta_actual, ruta_destino)
                        print(f"MOVIDO: {filename} -> {nombre_carpeta}/")
                        
                        # Actualizar BD con nueva ruta relativa
                        nuevo_path_relativo = f"pacientes/{nombre_carpeta}/{filename}"
                        r.archivo_pdf = nuevo_path_relativo
                        archivos_bd.add(os.path.abspath(ruta_destino))
                    except Exception as e:
                        print(f"ERROR moviendo {filename}: {e}")
                else:
                    # Ya estaba en el lugar correcto
                     archivos_bd.add(os.path.abspath(ruta_destino))
            else:
                print(f"PERDIDO: No se encuentra archivo físico para ID {r.id}: {r.archivo_pdf}")

        db.session.commit()
        
        # 2. Limpieza de basura (archivos en root uploads que no están en BD)
        # Solo limpiar archivos PDF en la raiz de uploads, no tocar carpetas 'pacientes', 'backups', 'papelera'
        print("\nLimpiando archivos basura en raíz de uploads...")
        for item in os.listdir(UPLOAD_DIR):
            item_path = os.path.join(UPLOAD_DIR, item)
            
            # No tocar carpetas protegidas
            if item in ['pacientes', 'backups', 'papelera', 'pruebas']:
                continue
                
            if os.path.isfile(item_path):
                # Si es un archivo y no lo acabamos de procesar/mover, es basura
                # Nota: Los archivos procesados ahora están en subcarpetas, así que 
                # cualquier archivo suelto en UPLOAD_DIR que sean PDFs antiguos debería borrarse?
                # Ojo: Verificar si es algo importante.
                if item.lower().endswith('.pdf'):
                     print(f"BASURA IDENTIFICADA: {item}")
                     try:
                         # Mover a una carpeta 'basura_recuperable' por seguridad antes de borrar
                         trash_dir = os.path.join(UPLOAD_DIR, 'basura_segura')
                         os.makedirs(trash_dir, exist_ok=True)
                         shutil.move(item_path, os.path.join(trash_dir, item))
                         print(f" -> Movido a basura_segura/")
                     except Exception as e:
                         print(f" Error moviendo basura: {e}")

    print("\nProceso finalizado.")

if __name__ == '__main__':
    migrar_archivos()
