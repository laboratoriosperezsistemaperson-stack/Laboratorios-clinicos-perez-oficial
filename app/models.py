from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

class Usuario(UserMixin, db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    ci = db.Column(db.String(20), unique=True, nullable=False)
    telefono = db.Column(db.String(20))
    email = db.Column(db.String(120))
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    resultados = db.relationship('Resultado', backref='paciente', lazy=True, cascade='all, delete-orphan')

class Resultado(db.Model):
    __tablename__ = 'resultados'
    id = db.Column(db.Integer, primary_key=True)
    numero_orden = db.Column(db.String(50), nullable=False)  # Removido unique=True para permitir múltiples resultados
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=True)
    paciente_nombre = db.Column(db.String(200), nullable=False)
    paciente_ci = db.Column(db.String(20), nullable=False)
    fecha_muestra = db.Column(db.Date)
    archivo_pdf = db.Column(db.String(200))
    codigo_acceso = db.Column(db.String(20), nullable=True)  # Deprecado - ya no se usa, acceso solo con CI
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con Prueba (Nuevo campo para Tipo de Laboratorio)
    prueba_id = db.Column(db.Integer, db.ForeignKey('pruebas.id'), nullable=True)
    prueba = db.relationship('Prueba', backref='resultados')
    
    # Campos para soft-delete (papelera de reciclaje)
    # Esto garantiza que los resultados se mantengan consultables indefinidamente
    # hasta que se eliminen permanentemente
    eliminado = db.Column(db.Boolean, default=False, nullable=False)
    fecha_eliminacion = db.Column(db.DateTime, nullable=True)
    eliminado_por = db.Column(db.String(100), nullable=True)

class Prueba(db.Model):
    __tablename__ = 'pruebas'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(100))
    descripcion = db.Column(db.Text)
    precio = db.Column(db.Float, default=0.0)
    imagen = db.Column(db.String(200))
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================
# MODELOS PARA REDES SOCIALES / PÁGINA PÚBLICA
# ============================================

class Publicacion(db.Model):
    """Publicaciones para la página Nuestros Servicios (estilo Facebook)"""
    __tablename__ = 'publicaciones'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    imagen = db.Column(db.String(300))  # Ruta de la imagen
    video = db.Column(db.String(300))   # Ruta del video (MP4, WebM, MOV)
    icono = db.Column(db.String(50), default='fa-microscope')  # Icono FontAwesome
    categoria = db.Column(db.String(100), default='General')
    activo = db.Column(db.Boolean, default=True)
    fecha_publicacion = db.Column(db.DateTime, default=datetime.utcnow)
    orden = db.Column(db.Integer, default=0)  # Para ordenar manualmente

class FotoGaleria(db.Model):
    """Fotos para la galería pública"""
    __tablename__ = 'fotos_galeria'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.String(500))
    imagen = db.Column(db.String(300), nullable=False)
    activo = db.Column(db.Boolean, default=True)
    fecha_subida = db.Column(db.DateTime, default=datetime.utcnow)
    orden = db.Column(db.Integer, default=0)

class ConfiguracionLab(db.Model):
    """Configuración del laboratorio (teléfono, email, horarios, etc.)"""
    __tablename__ = 'configuracion_lab'
    id = db.Column(db.Integer, primary_key=True)
    clave = db.Column(db.String(100), unique=True, nullable=False)
    valor = db.Column(db.Text, nullable=False)
    descripcion = db.Column(db.String(200))
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
