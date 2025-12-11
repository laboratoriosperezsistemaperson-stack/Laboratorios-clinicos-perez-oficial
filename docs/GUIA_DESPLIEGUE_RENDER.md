# 🚀 Guía de Despliegue en Render

Sigue estos pasos exactos para poner tu sistema en línea.

## Paso 1: Crear el Servicio
1. En tu dashboard de Render, selecciona la opción **"Web Services"** (Servicios Web).
2. Haz clic en **"New Web Service"**.
3. Selecciona **"Build and deploy from a Git repository"**.
4. Conecta tu cuenta de GitHub (si no lo has hecho) y selecciona el repositorio: `Laboratorios-clinicos-perez-oficial`.

## Paso 2: Configuración del Servicio
Llena el formulario con estos datos EXACTOS:

| Campo | Valor |
|-------|-------|
| **Name** | `laboratorio-perez` (o el nombre que prefieras) |
| **Region** | `Oregon (US West)` o la más cercana |
| **Branch** | `main` |
| **Root Directory** | (Déjalo vacío) |
| **Runtime** | `Python 3` |
| **Build Command** | `./render_config/build.sh` |
| **Start Command** | `gunicorn -c render_config/gunicorn_config.py run:app` |
| **Instance Type** | `Free` (para empezar) |

## Paso 3: Variables de Entorno (IMPORTANTE)
Busca la sección **"Environment Variables"** (o "Advanced") y agrega las claves que tienes en tu archivo `.env` local.
**Tus claves están en tu archivo `.env` en tu computadora.**

Debes agregar una por una:

1. **Key**: `DATABASE_URL`
   **Value**: (Tu URL larga de Supabase que empieza con `postgresql://...`)

2. **Key**: `SECRET_KEY`
   **Value**: (Tu clave secreta, invéntate una larga si quieres)

3. **Key**: `SUPABASE_URL`
   **Value**: (La URL de tu proyecto Supabase)

4. **Key**: `SUPABASE_KEY`
   **Value**: (Tu API Key de Supabase)

5. **Key**: `PYTHON_VERSION`
   **Value**: `3.9.0` (Opcional, pero recomendado)

## Paso 4: ¡Desplegar!
Haz clic en **"Create Web Service"**.

Render empezará a instalar todo. Puedes ver el progreso en la consola negra que aparece.
Si todo sale bien, verás un mensaje de **"Live"** en verde y te darán una URL (ej: `https://laboratorio-perez.onrender.com`).

---

## 💡 Solución de Problemas Comunes

- **Error "Permission denied"**: Si dice que no puede ejecutar `build.sh`, es posible que los permisos se perdieran. Yo ya intenté arreglarlo en el último paso.
- **Error de Base de Datos**: Verifica que pegaste la `DATABASE_URL` correctamente. Recuerda que en Render debe empezar con `postgresql://`, si la tuya dice `postgres://`, Render la entenderá igual, pero `postgresql://` es el estándar moderno.

## 🌐 Paso Extra: Configurar un Dominio Propio (.com)

Para quitar el `.onrender.com` y tener algo como `www.laboratorioperez.com`:

1.  **Comprar el dominio**: En GoDaddy, Namecheap, etc.
2.  **En Render**:
    *   Ve a **Settings** > **Custom Domains**.
    *   Clic en **Add Custom Domain**.
    *   Escribe tu dominio (ej: `www.laboratorioperez.com`).
3.  **Configurar DNS** (En donde compraste el dominio):
    *   Crea un registro **CNAME**.
    *   Host/Name: `www`
    *   Target/Value: `laboratorios-clinicos-perez-oficial.onrender.com`
    *   Render verificará la conexión y emitirá un certificado SSL (candadito verde) automáticamente.
