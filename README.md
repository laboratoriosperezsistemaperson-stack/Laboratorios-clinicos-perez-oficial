# 🧪 Sistema de Gestión de Laboratorio Pérez

Sistema web completo para gestión de laboratorio clínico desarrollado con Flask y Supabase (PostgreSQL).

## 🌟 Características

- ✅ Gestión de pacientes
- ✅ Registro de resultados de laboratorio
- ✅ Generación de PDFs
- ✅ Sistema de credenciales (PDF y Word)
- ✅ Portal público para consulta de resultados
- ✅ Base de datos en la nube (Supabase)
- ✅ Autenticación de usuarios

## 🛠️ Tecnologías

- **Backend**: Flask (Python)
- **Base de datos**: PostgreSQL (Supabase)
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Generación de documentos**: ReportLab, python-docx

## 📦 Instalación y Despliegue Local

### 1. Clonar el repositorio
Elige una de las siguientes opciones según tu terminal:

**Opción A: Usando CMD (Símbolo del sistema)**
```cmd
cd C:\
git clone https://github.com/laboratoriosperezsistemaperson-stack/Laboratorios-clinicos-perez-oficial.git
cd Laboratorios-clinicos-perez-oficial
```

**Opción B: Usando PowerShell**
```powershell
Set-Location C:\
git clone https://github.com/laboratoriosperezsistemaperson-stack/Laboratorios-clinicos-perez-oficial.git
Set-Location Laboratorios-clinicos-perez-oficial
```

### 2. Configurar entorno
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
.\venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Ejecutar
```bash
python run.py
```

## 🔑 Variables de Entorno

Crear archivo `.env`:
```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_key_de_supabase
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
SECRET_KEY=tu_clave_secreta
```

## 👨‍💻 Autor

**Luis** - [Luiscc445](https://github.com/Luiscc445)

## 📄 Licencia

Este proyecto es privado y de uso personal.
