"""Script para ver el estado actual del sistema"""
from app import create_app, db
from app.models import Paciente, Resultado
from app.pdf_manager import FileManager

app = create_app()
with app.app_context():
    fm = FileManager()
    
    print("=" * 60)
    print("PACIENTES REGISTRADOS EN LA BASE DE DATOS")
    print("=" * 60)
    
    pacientes = Paciente.query.order_by(Paciente.nombre).all()
    print(f"Total: {len(pacientes)} pacientes\n")
    for p in pacientes:
        print(f"  ID: {p.id} | CI: {p.ci}")
        print(f"     Nombre: {p.nombre}")
        print(f"     Telefono: {p.telefono or '-'}")
        print(f"     Email: {p.email or '-'}")
        print()
    
    print("=" * 60)
    print("RESULTADOS / PDFs SUBIDOS")
    print("=" * 60)
    
    resultados = Resultado.query.filter_by(eliminado=False).all()
    print(f"Total: {len(resultados)} resultados\n")
    for r in resultados:
        print(f"  Orden: {r.numero_orden}")
        print(f"  Paciente: {r.paciente_nombre} (CI: {r.paciente_ci})")
        print(f"  Prueba: {r.prueba.nombre if r.prueba else 'General'}")
        print(f"  Fecha Muestra: {r.fecha_muestra}")
        print(f"  Archivo: {r.archivo_pdf}")
        url = fm.get_public_url(r.archivo_pdf, 'pdf')
        if url:
            print(f"  URL: {url[:100]}...")
        print()
    
    print("=" * 60)
    print("ARCHIVOS EN BUCKET labos2026")
    print("=" * 60)
    
    try:
        carpetas = fm.supabase.storage.from_('labos2026').list('pacientes')
        print(f"Carpetas encontradas: {len(carpetas)}")
        for c in carpetas:
            print(f"  📁 {c['name']}")
            try:
                archivos = fm.supabase.storage.from_('labos2026').list(f"pacientes/{c['name']}")
                for a in archivos:
                    print(f"      📄 {a['name']}")
            except:
                pass
    except Exception as e:
        print(f"Error: {e}")
