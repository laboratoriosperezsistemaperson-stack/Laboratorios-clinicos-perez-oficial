"""
Script para poblar la galería de fotos con las imágenes existentes
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import FotoGaleria, Publicacion

app = create_app()

# Fotos con descripciones alentadoras para pacientes
fotos_data = [
    ("img/analisis_especializados.jpg", "Análisis Especializados", "Tecnología de punta para resultados precisos y confiables"),
    ("img/resultados_rapidos_maglumi.jpg", "Resultados Rápidos MAGLUMI", "Equipos de última generación para tu tranquilidad"),
    ("img/horario_atencion.jpg", "Horario de Atención", "Siempre listos para cuidar de tu salud"),
    ("img/fertilidad_antimulleriana.jpg", "Pruebas de Fertilidad", "Acompañándote en tu camino hacia la maternidad"),
    ("img/pruebas_adn.jpg", "Pruebas de ADN", "Resultados 100% confiables y confidenciales"),
    ("img/pruebas_paternidad.jpg", "Pruebas de Paternidad", "La verdad que tu familia merece conocer"),
    ("img/pruebas_embarazo.jpg", "Pruebas de Embarazo", "Detectamos la llegada de tu bebé con precisión"),
    ("img/resultados_diabeticos.jpg", "Control de Diabetes", "Tu salud bajo control con monitoreo constante"),
    ("img/diabetes_sintomas.png", "Síntomas de Diabetes", "Información importante para tu bienestar"),
    ("img/hemoglobina_glicosilada.png", "Hemoglobina Glicosilada", "El mejor indicador para control diabético"),
    ("img/tips_glucosa.jpg", "Tips para Glucosa", "Consejos saludables para tu día a día"),
    ("img/ubicacion_mapa.jpg", "Nuestra Ubicación", "Fácil acceso en el corazón de Potosí"),
    ("img/pruebas_alergias.jpg", "Pruebas de Alergias", "Descubre qué te afecta para vivir mejor"),
    ("img/prueba_pcr_virus.jpg", "Pruebas PCR", "Detección temprana para tu protección"),
    ("img/nutricion_hemoglobina.jpg", "Nutrición y Hemoglobina", "Cuida tu alimentación, cuida tu vida"),
    ("img/acido_urico_gota.png", "Ácido Úrico", "Prevención y control para tu bienestar"),
    ("img/depuracion_creatinina.png", "Función Renal", "Mantén tus riñones saludables"),
    ("img/fsh_fertilidad.png", "Hormona FSH", "Análisis hormonal completo y preciso"),
    ("img/hidratacion.png", "Hidratación", "La base de una buena salud"),
    ("img/proteccion_piel_uv.png", "Protección Solar", "Cuida tu piel del sol potosino"),
    ("img/logo_perez.png", "Laboratorio Pérez", "Tu laboratorio de confianza en Potosí"),
]

# Publicaciones con mensajes motivadores
publicaciones_data = [
    ("Análisis Especializados", "fa-microscope", 
     "¡Tu salud es nuestra prioridad! 💚 Contamos con tecnología de última generación para brindarte los resultados más precisos y confiables. Nuestro equipo está capacitado para realizar análisis clínicos de alta complejidad.",
     "img/analisis_especializados.jpg"),
    
    ("Pruebas de ADN y Paternidad", "fa-dna",
     "Realizamos pruebas con la máxima confidencialidad y precisión. ✅ Resultados en tiempo récord ✅ 100% Confidencial ✅ Aceptamos casos legales. Tu tranquilidad es nuestro compromiso.",
     "img/pruebas_adn.jpg"),
    
    ("Pruebas de Embarazo", "fa-baby",
     "¡Acompañamos tu camino hacia la maternidad! 💕 Detección temprana y precisa de embarazo con pruebas de alta sensibilidad. Tu salud y la de tu bebé es nuestra prioridad.",
     "img/pruebas_embarazo.jpg"),
    
    ("Control de Diabetes", "fa-heartbeat",
     "¡Mantén tu diabetes bajo control! 📊 Monitoreo integral con pruebas de glucosa, hemoglobina glicosilada y perfiles metabólicos completos. Resultados precisos para una vida más saludable.",
     "img/hemoglobina_glicosilada.png"),
    
    ("Resultados Rápidos con MAGLUMI", "fa-bolt",
     "🚀 ¡Tecnología de punta para tu salud! Contamos con el sistema MAGLUMI, tecnología de última generación para análisis de inmunología y química clínica. Resultados confiables en menor tiempo.",
     "img/resultados_rapidos_maglumi.jpg"),
]

with app.app_context():
    # Limpiar datos existentes
    FotoGaleria.query.delete()
    Publicacion.query.delete()
    db.session.commit()
    print("✅ Datos anteriores eliminados")
    
    # Insertar fotos
    for i, (imagen, titulo, descripcion) in enumerate(fotos_data):
        foto = FotoGaleria(
            titulo=titulo,
            descripcion=descripcion,
            imagen=imagen,
            orden=i,
            activo=True
        )
        db.session.add(foto)
    
    print(f"✅ {len(fotos_data)} fotos agregadas a la galería")
    
    # Insertar publicaciones
    for i, (titulo, icono, contenido, imagen) in enumerate(publicaciones_data):
        pub = Publicacion(
            titulo=titulo,
            icono=icono,
            contenido=contenido,
            imagen=imagen,
            categoria="Servicios",
            orden=i,
            activo=True
        )
        db.session.add(pub)
    
    print(f"✅ {len(publicaciones_data)} publicaciones creadas")
    
    db.session.commit()
    
    print("\n📊 Resumen:")
    print(f"   Fotos en galería: {FotoGaleria.query.count()}")
    print(f"   Publicaciones: {Publicacion.query.count()}")
    print("\n✅ ¡Listo! Reinicia el servidor y visita /servicios para ver los cambios")
