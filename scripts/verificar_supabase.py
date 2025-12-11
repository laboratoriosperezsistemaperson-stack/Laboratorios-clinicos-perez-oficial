"""
Script para verificar conexión a Supabase
"""
from app import create_app, db
from app.models import Resultado, Paciente, Prueba

app = create_app()

with app.app_context():
    print('=' * 40)
    print('   VERIFICACIÓN DE SUPABASE')
    print('=' * 40)
    
    try:
        resultados_count = Resultado.query.count()
        pacientes_count = Paciente.query.count()
        pruebas_count = Prueba.query.count()
        
        print(f'\n📊 Resultados en la base de datos: {resultados_count}')
        print(f'👥 Pacientes registrados: {pacientes_count}')
        print(f'🧪 Pruebas de laboratorio: {pruebas_count}')
        
        print('\n' + '=' * 40)
        print('   ✅ CONEXIÓN EXITOSA A SUPABASE')
        print('=' * 40)
        
        # Mostrar últimos 5 resultados
        print('\n📋 Últimos 5 resultados:')
        ultimos = Resultado.query.order_by(Resultado.id.desc()).limit(5).all()
        for r in ultimos:
            print(f'   - ID:{r.id} | {r.paciente_nombre} | {r.numero_orden}')
            
    except Exception as e:
        print(f'\n❌ ERROR: {str(e)}')
        print('   Verifica la configuración de DATABASE_URL en .env')
