# Guía del Panel de Publicación — CoopBienestar

Panel de autogestión para publicar **noticias** y **fotos de galería** en el sitio web de CoopBienestar sin tocar código.

---

## ¿Cómo funciona?

1. El editor entra a `/admin` en el sitio (ej. `https://coopbienestar.net/admin`)
2. Inicia sesión con su cuenta de GitHub
3. Llena el formulario (título, fecha, categoría, foto, texto)
4. Pulsa **Publicar**
5. En 1–2 minutos, el contenido aparece en el sitio

---

## Configuración inicial (solo una vez, la hace el administrador técnico)

### Paso 1 — Crear el GitHub OAuth App

1. Ve a **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Rellena así:
   - **Application name:** `CoopBienestar CMS`
   - **Homepage URL:** `https://coopbienestar.net`
   - **Authorization callback URL:** `https://coopbienestar-auth.TU_CUENTA.workers.dev/callback`
     *(ajusta la URL después de crear el Worker en el paso 2)*
3. Clic en **Register application**
4. Copia el **Client ID** y genera un **Client Secret** — guárdalos, los necesitas en el paso 2

### Paso 2 — Desplegar el relay de autenticación en Cloudflare Workers

Este Worker actúa como puente seguro entre el panel y GitHub para el inicio de sesión.

1. Ve a **dash.cloudflare.com → Workers & Pages → Create application → Create Worker**
2. Nómbralo `coopbienestar-auth`
3. Reemplaza todo el código del editor con el siguiente script:

```javascript
const CLIENT_ID     = 'TU_GITHUB_CLIENT_ID';      // ← pega aquí el Client ID
const CLIENT_SECRET = 'TU_GITHUB_CLIENT_SECRET';  // ← pega aquí el Client Secret
const ALLOWED_ORIGINS = ['https://coopbienestar.net', 'http://localhost:8080'];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Inicio: redirige a GitHub para autorizar
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        scope: 'repo,user',
        state: crypto.randomUUID(),
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
      );
    }

    // Callback: GitHub devuelve el código, lo intercambiamos por token
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Código faltante', { status: 400 });

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
      });
      const { access_token, error } = await tokenRes.json();

      if (error || !access_token) {
        return new Response(`Error de autenticación: ${error}`, { status: 400 });
      }

      // Devuelve la página que cierra el popup y envía el token al CMS
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><script>
        (function() {
          function receiveMessage(e) {
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token: '${access_token}', provider: 'github' })}',
              e.origin
            );
          }
          window.addEventListener('message', receiveMessage, false);
          window.opener.postMessage('authorizing:github', '*');
        })();
      <\/script></body></html>`;

      return new Response(html.replace("'${access_token}'", JSON.stringify(access_token)), {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      });
    }

    return new Response('No encontrado', { status: 404 });
  },
};
```

4. Clic en **Save and Deploy**
5. Copia la URL del Worker (ej. `https://coopbienestar-auth.TU_CUENTA.workers.dev`)
6. Vuelve al OAuth App de GitHub y actualiza el **Authorization callback URL** con esta URL + `/callback`

### Paso 3 — Actualizar admin/config.yml

Abre `admin/config.yml` y reemplaza:
- `TU_USUARIO/coopbienestar` → tu usuario y nombre real del repo en GitHub
- `https://TU_WORKER.workers.dev` → la URL del Worker del paso 2

```yaml
backend:
  name: github
  repo: miusuario/coopbienestar          # ← ejemplo real
  branch: main
  base_url: https://coopbienestar-auth.miusuario.workers.dev  # ← ejemplo real
```

### Paso 4 — Hacer commit y push

Sube los cambios al repo. DigitalOcean redesplegará el sitio en ~1 minuto y el panel estará disponible en `/admin`.

---

## Cómo agregar editores

Un editor es cualquier persona con cuenta de GitHub a quien le das acceso al repositorio.

1. Ve al repo en GitHub → **Settings → Collaborators → Add people**
2. Escribe el usuario o correo de GitHub del editor
3. Selecciona rol **Write** y envía la invitación
4. El editor acepta la invitación desde su correo o desde GitHub
5. Listo — ya puede entrar a `/admin` e iniciar sesión

> **Nota:** El editor solo necesita hacer esto una vez. El navegador recuerda la sesión.

---

## Cómo publicar una noticia (paso a paso para el editor)

1. Entra a `https://coopbienestar.net/admin`
2. Clic en **Entrar con GitHub** → autoriza si es la primera vez
3. En el menú izquierdo, clic en **Noticias**
4. Clic en **Todas las noticias** → luego en el botón **＋ Agregar ítem**
5. Completa los campos:
   - **Título:** nombre de la noticia
   - **Fecha:** selecciona la fecha del evento o publicación
   - **Categoría:** elige la que corresponde (Institución, Servicios, etc.)
   - **Foto principal:** arrastra una foto o clic para seleccionar (JPG/PNG)
   - **Resumen:** una o dos frases que aparecen en la tarjeta
   - **Cuerpo:** opcional — texto completo de la noticia
6. Clic en **Guardar** (arriba a la derecha)
7. Clic en **Publicar cambios**
8. ¡Listo! En 1–2 minutos la noticia aparece en el sitio

---

## Cómo agregar una foto a la galería

1. Entra a `https://coopbienestar.net/admin`
2. Inicia sesión con GitHub si hace falta
3. En el menú, clic en **Galería**
4. Clic en **Todas las fotos** → luego en **＋ Agregar ítem**
5. Completa:
   - **Foto:** arrastra la imagen o búscala en tu computadora
   - **Descripción:** el texto que aparece al pasar el cursor (ej. "Premiación 2025")
6. Clic en **Guardar** → luego **Publicar cambios**
7. En 1–2 minutos la foto aparece en la galería del sitio

---

## Cómo eliminar o editar contenido existente

- Para **editar** una noticia o foto: entra al panel → sección correspondiente → busca el ítem → modifica y guarda
- Para **eliminar**: abre el ítem → busca el ícono de papelera o usa el botón de eliminar dentro del elemento de la lista
- Después de cualquier cambio, siempre pulsa **Publicar cambios** para que se actualice el sitio

---

## Preguntas frecuentes

**¿Por qué tarda 1–2 minutos en verse?**
Cada publicación guarda los datos en GitHub y DigitalOcean vuelve a construir el sitio automáticamente. Es normal.

**¿Se puede deshacer un error?**
Sí. Todo queda guardado en el historial de GitHub. Si publicas algo por error, avisa al administrador técnico para que revierta el cambio.

**¿Las fotos tienen límite de tamaño?**
No hay un límite estricto, pero se recomienda no subir fotos de más de 5 MB para que el sitio cargue rápido.

**¿Qué pasa si el panel dice "Error de autenticación"?**
Cierra la pestaña, vuelve a `/admin` e intenta de nuevo. Si persiste, avisa al administrador técnico.

---

## Estructura de archivos relevantes

```
sitio/
├── admin/
│   ├── index.html        ← carga el panel de publicación
│   └── config.yml        ← configuración del CMS (repo, colecciones)
├── content/
│   ├── noticias.json     ← datos de todas las noticias
│   └── galeria.json      ← datos de todas las fotos
├── img/
│   └── uploads/          ← fotos subidas desde el panel
├── noticias.html         ← página pública (lee content/noticias.json)
└── galeria.html          ← página pública (lee content/galeria.json)
```
