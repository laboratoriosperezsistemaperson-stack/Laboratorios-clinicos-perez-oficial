# 🌐 Guía Paso a Paso: Tu Propio Dominio (.com)

Sigue estos pasos para que tu laboratorio tenga una dirección profesional como `www.laboratorioperez.com`.

## Parte 1: Comprar el Dominio (Ejemplo con Namecheap)
Recomiendo **Namecheap** o **GoDaddy** porque son fáciles de usar.

1.  Ve a [www.namecheap.com](https://www.namecheap.com) (o tu proveedor favorito).
2.  En el buscador grande, escribe el nombre que quieres (ej: `laboratoriosperez`).
3.  Si está disponible, verás el precio (aprox $10/año).
4.  Dale a **"Add to Cart"** y paga como cualquier compra online.

## Parte 2: Decirle a Render tu nuevo nombre
1.  Vuelve a tu panel de **Render**.
2.  Ve a tu servicio -> **Settings** -> **Custom Domains**.
3.  Haz clic en **Add Custom Domain**.
4.  Escribe el nombre COMPLETO: `www.laboratorioperez.com` (cambia "laboratorioperez" por el que compraste).
5.  Dale a **Save**.
6.  Render te mostrará un mensaje de "DNS verification needed" y te dará unos valores. **No cierres esta pestaña.**

## Parte 3: Conectar los cables (Configurar DNS)
Aquí es donde haces la magia. Tienes que ir a donde compraste el dominio.

1.  En Namecheap/GoDaddy, busca el botón **"Manage"** (Administrar) al lado de tu dominio.
2.  Busca la opción **"Advanced DNS"** o **"Administrar DNS"**.
3.  Necesitas crear un registro **CNAME** (si hay otros registros "parking", bórralos).

**Agrega un Nuevo Registro (Record):**

| Tipo (Type) | Host / Nombre | Valor (Target / Value) |
| :--- | :--- | :--- |
| **CNAME Record** | `www` | `laboratorios-clinicos-perez-oficial.onrender.com` |

4.  Guarda los cambios (suele ser un check verde ✅).

## Parte 4: Esperar
1.  Vuelve a Render.
2.  Render intentará verificar la conexión cada pocos minutos.
3.  Primero dirá "Pending", luego emitirá un certificado (TLS) y finalmente el punto se pondrá **Verde**.
4.  ¡Listo! Ahora entra a `www.laboratorioperez.com` y verás tu sistema.

---
**Nota:** A veces los cambios de DNS tardan desde 5 minutos hasta 24 horas en propagarse por el mundo. Ten paciencia si no funciona al instante.
