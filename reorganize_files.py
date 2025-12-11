
import os
import shutil

# Configuración de carpetas destino
FOLDERS = {
    'scripts': [
        'actualizar_precios_supabase.py',
        'actualizar_precios_y_orina.py',
        'actualizar_precios_y_orina_supabase.py',
        'arreglar_base_datos.py',
        'create_admin.py',
        'eliminar_precios_rapido.py',
        'eliminar_precios_supabase.py',
        'eliminar_todas_pruebas.py',
        'fix_database.py',
        'fix_numero_orden_constraint.py',
        'inspeccionar_base_datos.py',
        'inspeccionar_supabase.py',
        'limpiar_pruebas_viejas.py', 
        'migrar_archivos.py',
        'migrate_add_column.py',
        'migrate_social.py',
        'poblar_galeria.py',
        'poblar_pruebas.py',
        'poblar_pruebas_con_imagenes.py',
        'renumerar_ids_pruebas.py',
        'setup_60_pruebas.py',
        'setup_completo_imagenes.py',
        'setup_con_pexels.py',
        'setup_inteligente_pexels.py',
        'setup_rapido_sin_imagenes.py',
        'setup_siguientes_60_SEGURO.py',
        'setup_ultimas_pruebas_ULTRA_SEGURO.py',
        'ver_estructura_db.py',
        'verificar_supabase.py'
    ],
    'docs': [
        'CAMBIOS_COMPLETADOS.md',
        'COMANDOS_SIMPLES.md',
        'COMO_USAR_PEXELS.md',
        'CONFIGURACION_SUPABASE.md',
        'GUIA_INSTALACION_PEREZ.md',
        'INFO_LABORATORIO_PEREZ.md',
        'INSTRUCCIONES_ARREGLAR_BD.md',
        'INSTRUCCIONES_IMAGENES.md',
        'INSTRUCCIONES_SEGURIDAD.md',
        'LEER_PRIMERO.md',
        'README.md'
    ],
    'sql': [
        'supabase_setup.sql'
    ]
}

def reorganize():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    print(f"Reorganizando archivos en: {base_dir}")
    
    for folder, files in FOLDERS.items():
        target_dir = os.path.join(base_dir, folder)
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
            print(f"Creada carpeta: {target_dir}")
            
        for file in files:
            src = os.path.join(base_dir, file)
            dst = os.path.join(target_dir, file)
            
            if os.path.exists(src):
                try:
                    shutil.move(src, dst)
                    print(f"Movido: {file} -> {folder}/")
                except Exception as e:
                    print(f"Error moviendo {file}: {e}")
            else:
                pass # El archivo no existe, ignorar
                
    print("Reorganización completada.")

if __name__ == "__main__":
    reorganize()
