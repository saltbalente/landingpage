# Generador de Sitemap Dinámico

Este proyecto incluye un generador automático de sitemap que mantiene el archivo `sitemap.xml` actualizado con el contenido actual del sitio web.

## 🚀 Uso Rápido

### Generar sitemap automáticamente:
```bash
node generate-sitemap.js
```

## 📋 Características

- **Dinámico**: Escanea automáticamente el directorio `blog/` para incluir todos los archivos HTML
- **Fechas actualizadas**: Usa las fechas de modificación reales de los archivos
- **Prioridades SEO**: Asigna prioridades optimizadas para SEO
- **Estructura completa**: Incluye página principal, secciones y artículos del blog

## 🔧 Configuración

El script está configurado para:
- **URL base**: `https://amarredeamorfuertes.com`
- **Directorio del blog**: `./blog/`
- **Archivo de salida**: `./sitemap.xml`

### Modificar configuración:
Edita las constantes al inicio de `generate-sitemap.js`:
```javascript
const SITE_URL = 'https://amarredeamorfuertes.com';
const BLOG_DIR = path.join(__dirname, 'blog');
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');
```

## 📊 Prioridades SEO

| Tipo de página | Prioridad | Frecuencia de cambio |
|----------------|-----------|---------------------|
| Página principal | 1.0 | daily |
| Secciones principales | 0.9 | weekly |
| Artículos del blog | 0.9 | weekly |
| Testimonios | 0.8 | weekly |
| Blog (sección) | 0.8 | daily |
| Contacto | 0.8 | monthly |
| FAQ | 0.7 | monthly |

## 🔄 Automatización

### Para actualizar automáticamente después de cambios:
1. Ejecuta el script después de agregar/modificar artículos
2. Considera agregar el comando a tu proceso de build/deploy
3. Programa ejecuciones periódicas si es necesario

### Ejemplo de integración en package.json:
```json
{
  "scripts": {
    "sitemap": "node generate-sitemap.js",
    "build": "npm run sitemap && echo 'Build complete'"
  }
}
```

## 📝 Salida del Script

El script muestra:
- ✅ Confirmación de generación exitosa
- 📊 Estadísticas (número de artículos, fecha de actualización)
- 📝 Lista de archivos incluidos con sus fechas de modificación

## 🛠️ Mantenimiento

- El script es autónomo y no requiere dependencias externas
- Funciona con Node.js estándar
- Maneja errores automáticamente
- Ordena los archivos alfabéticamente para consistencia

## 📁 Estructura del Sitemap Generado

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Página Principal -->
    <!-- Secciones Principales -->
    <!-- Artículos del Blog (Generados Dinámicamente) -->
</urlset>
```

---

**Nota**: Este generador mantiene el sitemap siempre actualizado con el contenido real del sitio, eliminando URLs rotas y asegurando que los motores de búsqueda indexen correctamente todas las páginas disponibles.