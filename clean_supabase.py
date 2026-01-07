"""
Script para limpiar datos antiguos del bucket de Supabase
y sincronizar con la base de datos actual
"""
from app import create_app, db
from app.models import Paciente, Resultado
from app.pdf_manager import FileManager

app = create_app()

with app.app_context():
    fm = FileManager()
    
    if not fm.supabase:
        print("❌ Error: No se encontró conexión a Supabase")
        exit(1)
    
    print("=" * 60)
    print("🧹 LIMPIEZA DE DATOS EN SUPABASE STORAGE")
    print("=" * 60)
    
    # 1. Obtener pacientes actuales en la base de datos
    pacientes_db = Paciente.query.all()
    print(f"\n📊 Pacientes en la base de datos: {len(pacientes_db)}")
    for p in pacientes_db:
        print(f"   - {p.ci}_{p.nombre}")
    
    # 2. Listar carpetas en el bucket
    print(f"\n📁 Listando carpetas en bucket 'resultados/pacientes/'...")
    try:
        carpetas = fm.supabase.storage.from_('resultados').list('pacientes')
        print(f"   Carpetas encontradas: {len(carpetas)}")
        for c in carpetas:
            print(f"   - {c['name']}")
    except Exception as e:
        print(f"❌ Error listando carpetas: {e}")
        carpetas = []
    
    # 3. Eliminar todas las carpetas antiguas
    print(f"\n🗑️ Eliminando carpetas antiguas del bucket...")
    for carpeta in carpetas:
        carpeta_nombre = carpeta['name']
        carpeta_path = f"pacientes/{carpeta_nombre}"
        
        try:
            # Listar archivos dentro de la carpeta
            archivos = fm.supabase.storage.from_('resultados').list(carpeta_path)
            
            if archivos:
                # Eliminar cada archivo
                for archivo in archivos:
                    archivo_path = f"{carpeta_path}/{archivo['name']}"
                    fm.supabase.storage.from_('resultados').remove([archivo_path])
                    print(f"   ✓ Eliminado: {archivo_path}")
            
            print(f"   ✓ Carpeta procesada: {carpeta_nombre}")
        except Exception as e:
            print(f"   ⚠ Error con carpeta {carpeta_nombre}: {e}")
    
    # 4. Eliminar la carpeta 2025 si existe
    print(f"\n🗑️ Limpiando carpeta '2025' si existe...")
    try:
        archivos_2025 = fm.supabase.storage.from_('resultados').list('2025')
        if archivos_2025:
            for mes_folder in archivos_2025:
                mes_path = f"2025/{mes_folder['name']}"
                archivos_mes = fm.supabase.storage.from_('resultados').list(mes_path)
                if archivos_mes:
                    for archivo in archivos_mes:
                        archivo_path = f"{mes_path}/{archivo['name']}"
                        fm.supabase.storage.from_('resultados').remove([archivo_path])
                        print(f"   ✓ Eliminado: {archivo_path}")
    except Exception as e:
        print(f"   ⚠ Carpeta 2025 no existe o está vacía: {e}")
    
    # 5. Limpiar papelera
    print(f"\n🗑️ Limpiando papelera...")
    try:
        papelera = fm.supabase.storage.from_('resultados').list('papelera')
        if papelera:
            for item in papelera:
                item_path = f"papelera/{item['name']}"
                # Si es carpeta, limpiar contenido
                try:
                    subitems = fm.supabase.storage.from_('resultados').list(item_path)
                    if subitems:
                        for subitem in subitems:
                            subpath = f"{item_path}/{subitem['name']}"
                            fm.supabase.storage.from_('resultados').remove([subpath])
                            print(f"   ✓ Eliminado de papelera: {subpath}")
                except:
                    fm.supabase.storage.from_('resultados').remove([item_path])
                    print(f"   ✓ Eliminado: {item_path}")
    except Exception as e:
        print(f"   ⚠ Error limpiando papelera: {e}")
    
    # 6. Limpiar resultados de la base de datos
    print(f"\n🗄️ Limpiando resultados de la base de datos...")
    resultados_count = Resultado.query.count()
    if resultados_count > 0:
        Resultado.query.delete()
        db.session.commit()
        print(f"   ✓ Eliminados {resultados_count} resultados")
    else:
        print("   ✓ No hay resultados que eliminar")
    
    print("\n" + "=" * 60)
    print("✅ LIMPIEZA COMPLETADA")
    print("=" * 60)
    print(f"\n📊 Estado actual:")
    print(f"   - Pacientes en BD: {Paciente.query.count()}")
    print(f"   - Resultados en BD: {Resultado.query.count()}")
    print(f"\n💡 Ahora puedes subir nuevos PDFs desde el panel de administración")
