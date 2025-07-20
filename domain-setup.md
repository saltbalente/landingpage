# Configuración de Dominio - Solución Error 522

## 🚨 Problema Identificado
El error 522 "Connection timed out" en `https://www.amarredeamorfuertes.com/` indica un problema de configuración entre Cloudflare y el servidor de origen.

## ✅ Soluciones Implementadas

### 1. Redirecciones Automáticas
Se han configurado múltiples niveles de redirección para que `www` redirija automáticamente al dominio principal:

#### Archivos Configurados:
- **`.htaccess`** - Redirecciones a nivel de servidor Apache
- **`_redirects`** - Redirecciones para Netlify
- **`_headers`** - Headers de redirección
- **`netlify.toml`** - Configuración completa de Netlify
- **`wrangler.toml`** - Configuración de Cloudflare Workers
- **`worker.js`** - Worker de Cloudflare para redirecciones inteligentes

### 2. Configuración DNS Recomendada

#### En Cloudflare:
```
Tipo    Nombre    Contenido                    Proxy
A       @         [IP_DEL_SERVIDOR]           ✅ Proxied
CNAME   www       amarredeamorfuertes.com     ✅ Proxied
```

#### Configuración de Page Rules en Cloudflare:
1. **Regla 1**: `www.amarredeamorfuertes.com/*`
   - Setting: Forwarding URL (301 - Permanent Redirect)
   - Destination: `https://amarredeamorfuertes.com/$1`

2. **Regla 2**: `http://amarredeamorfuertes.com/*`
   - Setting: Always Use HTTPS

### 3. Verificación de SSL/TLS

#### En Cloudflare Dashboard:
1. **SSL/TLS** → **Overview**
   - Encryption mode: **Full (strict)**

2. **SSL/TLS** → **Edge Certificates**
   - ✅ Always Use HTTPS: ON
   - ✅ HTTP Strict Transport Security (HSTS): ON
   - ✅ Minimum TLS Version: 1.2

### 4. Configuración de Origin Server

#### Verificar que el servidor de origen:
- ✅ Responde en el puerto 443 (HTTPS)
- ✅ Tiene certificado SSL válido
- ✅ No bloquea las IPs de Cloudflare
- ✅ Timeout configurado correctamente (>30 segundos)

## 🔧 Pasos de Implementación

### Paso 1: Configurar DNS
```bash
# Verificar configuración DNS actual
nslookup www.amarredeamorfuertes.com
nslookup amarredeamorfuertes.com
```

### Paso 2: Implementar Page Rules
1. Ir a Cloudflare Dashboard
2. Seleccionar el dominio `amarredeamorfuertes.com`
3. Ir a **Rules** → **Page Rules**
4. Crear las reglas mencionadas arriba

### Paso 3: Verificar SSL
```bash
# Verificar certificado SSL
openssl s_client -connect amarredeamorfuertes.com:443 -servername amarredeamorfuertes.com
```

### Paso 4: Probar Redirecciones
```bash
# Probar redirección www
curl -I https://www.amarredeamorfuertes.com/

# Debe devolver:
# HTTP/1.1 301 Moved Permanently
# Location: https://amarredeamorfuertes.com/
```

## 🚀 Despliegue de Workers (Opcional)

Si usas Cloudflare Workers:

```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Autenticar
wrangler auth

# Desplegar worker
wrangler deploy worker.js
```

## 📊 Monitoreo y Verificación

### Herramientas de Verificación:
1. **GTmetrix**: https://gtmetrix.com/
2. **SSL Labs**: https://www.ssllabs.com/ssltest/
3. **Cloudflare Analytics**: Dashboard → Analytics

### Comandos de Verificación:
```bash
# Verificar redirección
curl -L -I https://www.amarredeamorfuertes.com/

# Verificar headers de seguridad
curl -I https://amarredeamorfuertes.com/

# Verificar tiempo de respuesta
curl -w "@curl-format.txt" -o /dev/null -s https://amarredeamorfuertes.com/
```

## 🔍 Troubleshooting

### Si persiste el Error 522:

1. **Verificar Origin Server**:
   - Revisar logs del servidor
   - Verificar que no esté sobrecargado
   - Comprobar configuración de firewall

2. **Configuración de Cloudflare**:
   - Pausar Cloudflare temporalmente
   - Verificar que las IPs de origen sean correctas
   - Revisar configuración de SSL/TLS

3. **Contactar Hosting Provider**:
   - Verificar que permitan conexiones de Cloudflare
   - Revisar configuración de timeout
   - Comprobar recursos del servidor

## 📞 Soporte Adicional

Si el problema persiste después de implementar estas soluciones:

1. **Cloudflare Support**: https://support.cloudflare.com/
2. **Hosting Provider**: Contactar soporte técnico
3. **Logs del Servidor**: Revisar logs de error detallados

---

**Nota**: Estos cambios pueden tardar hasta 24-48 horas en propagarse completamente por DNS global.