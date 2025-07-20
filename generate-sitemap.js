#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración del sitio
const SITE_URL = 'https://amarredeamorfuertes.com';
const BLOG_DIR = path.join(__dirname, 'blog');
const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');

// Función para obtener la fecha actual en formato ISO
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

// Función para obtener todos los archivos HTML del blog (recursiva)
function getBlogFiles() {
    const files = [];
    
    function scanDirectory(dir, relativePath = '') {
        try {
            const items = fs.readdirSync(dir);
            
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stats = fs.statSync(fullPath);
                
                if (stats.isDirectory()) {
                    // Escanear subdirectorio recursivamente
                    const newRelativePath = relativePath ? `${relativePath}/${item}` : item;
                    scanDirectory(fullPath, newRelativePath);
                } else if (item.endsWith('.html')) {
                    // Agregar archivo HTML
                    const fileName = relativePath ? `${relativePath}/${item}` : item;
                    files.push({
                        name: fileName,
                        lastModified: stats.mtime.toISOString().split('T')[0]
                    });
                }
            });
        } catch (error) {
            console.error(`Error leyendo directorio ${dir}:`, error);
        }
    }
    
    scanDirectory(BLOG_DIR);
    return files.sort((a, b) => a.name.localeCompare(b.name));
}

// Función para generar el sitemap XML
function generateSitemap() {
    const blogFiles = getBlogFiles();
    const currentDate = getCurrentDate();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Página Principal -->
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Secciones Principales -->
    <url>
        <loc>${SITE_URL}/#maestro</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${SITE_URL}/#hero</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${SITE_URL}/#testimonios</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${SITE_URL}/#blog</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${SITE_URL}/#faq</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${SITE_URL}/#contacto</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Artículos del Blog (Generados Dinámicamente) -->`;
    
    // Agregar cada archivo del blog
    blogFiles.forEach(file => {
        sitemap += `
    <url>
        <loc>${SITE_URL}/blog/${file.name}</loc>
        <lastmod>${file.lastModified}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
    });
    
    sitemap += `
</urlset>`;
    
    return sitemap;
}

// Función principal
function main() {
    try {
        console.log('Generando sitemap dinámico...');
        
        const sitemapContent = generateSitemap();
        
        // Escribir el sitemap
        fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
        
        console.log('✅ Sitemap generado exitosamente en:', SITEMAP_PATH);
        
        // Mostrar estadísticas
        const blogFiles = getBlogFiles();
        console.log(`📊 Estadísticas:`);
        console.log(`   - Artículos del blog: ${blogFiles.length}`);
        console.log(`   - Fecha de actualización: ${getCurrentDate()}`);
        console.log(`   - URL base: ${SITE_URL}`);
        
        // Mostrar archivos incluidos
        if (blogFiles.length > 0) {
            console.log(`\n📝 Artículos incluidos:`);
            blogFiles.forEach(file => {
                console.log(`   - ${file.name} (modificado: ${file.lastModified})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error generando sitemap:', error);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { generateSitemap, getBlogFiles };