"""
Script para crear las tablas de Redes Sociales
Ejecutar: python migrate_social.py
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import Publicacion, FotoGaleria, ConfiguracionLab

app = create_app()

with app.app_context():
    # Crear las tablas nuevas
    db.create_all()
    print("✅ Tablas creadas exitosamente")
    
    # Insertar configuración inicial si no existe
    configs = [
        ('telefono', '67619188', 'Teléfono principal'),
        ('whatsapp', '+591 67619188', 'Número WhatsApp'),
        ('email', 'laboratorios.perez@gmail.com', 'Email de contacto'),
        ('direccion', 'La Paz entre Matos y Hoyos 1137, Potosí', 'Dirección física'),
        ('referencia', 'A una cuadra de la Plaza 10 de Noviembre', 'Punto de referencia'),
        ('horario_semana', '7:00 AM - 7:00 PM', 'Horario Lunes a Viernes'),
        ('horario_sabado', '7:00 AM - 1:00 PM', 'Horario Sábado'),
        ('horario_domingo', 'Cerrado', 'Horario Domingo'),
        ('experiencia', 'Más de 10 años brindando análisis clínicos de calidad en Potosí.', 'Años de experiencia'),
        ('certificacion', 'Personal y equipos certificados para resultados precisos.', 'Info de certificación'),
        ('rating', '4.9', 'Calificación de reseñas'),
        ('resenas', '120+', 'Cantidad de reseñas')
    ]
    
    for clave, valor, descripcion in configs:
        existe = ConfiguracionLab.query.filter_by(clave=clave).first()
        if not existe:
            db.session.add(ConfiguracionLab(clave=clave, valor=valor, descripcion=descripcion))
            print(f"  + Configuración '{clave}' agregada")
    
    db.session.commit()
    print("✅ Configuración inicial creada")
    
    # Mostrar estadísticas
    print(f"\n📊 Estadísticas:")
    print(f"   Publicaciones: {Publicacion.query.count()}")
    print(f"   Fotos Galería: {FotoGaleria.query.count()}")
    print(f"   Configuraciones: {ConfiguracionLab.query.count()}")
