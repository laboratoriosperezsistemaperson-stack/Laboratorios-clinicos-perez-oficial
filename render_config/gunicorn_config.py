import multiprocessing
import os

# ============ CONFIGURACIÓN GUNICORN OPTIMIZADA PARA RENDER ============

# Workers: Cantidad de procesos que manejan peticiones
# Render recomienda: (2 x CPUs) + 1. En free tier asumimos 1-2 vCPUs.
# Usamos 4 workers para asegurar disponibilidad sin saturar RAM.
workers = 4

# Threads: Hilos por worker
# Ayuda a manejar peticiones bloqueantes (como subir archivos pesados)
threads = 2

# Timeout: Tiempo máximo que un worker puede tardar en responder
# Aumentado a 120s para permitir subidas de archivos lentas
timeout = 120

# Keepalive: Mantiene la conexión abierta
keepalive = 5

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Bind
bind = "0.0.0.0:10000"

# Preload app: Carga la app antes de hacer fork de los workers
# Ahorra RAM y acelera el inicio
preload_app = True
