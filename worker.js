// Cloudflare Worker para manejar redirecciones www

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const hostname = url.hostname
  
  // Redirigir www a dominio principal
  if (hostname.startsWith('www.')) {
    const newUrl = new URL(request.url)
    newUrl.hostname = hostname.replace('www.', '')
    
    return Response.redirect(newUrl.toString(), 301)
  }
  
  // Forzar HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:'
    return Response.redirect(url.toString(), 301)
  }
  
  // Continuar con la solicitud normal
  return fetch(request)
}

// Función para manejar errores 522
function handleError522() {
  const errorPage = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sitio en Mantenimiento - Amarre de Amor Fuertes</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 600px; margin: 0 auto; }
            .error { color: #e74c3c; }
            .redirect { color: #27ae60; margin-top: 20px; }
        </style>
        <script>
            // Redirección automática después de 3 segundos
            setTimeout(() => {
                window.location.href = 'https://amarredeamorfuertes.com';
            }, 3000);
        </script>
    </head>
    <body>
        <div class="container">
            <h1 class="error">Sitio Temporalmente No Disponible</h1>
            <p>Estamos trabajando para resolver este problema.</p>
            <div class="redirect">
                <p>Serás redirigido automáticamente en 3 segundos...</p>
                <p><a href="https://amarredeamorfuertes.com">O haz clic aquí para continuar</a></p>
            </div>
        </div>
    </body>
    </html>
  `
  
  return new Response(errorPage, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  })
}