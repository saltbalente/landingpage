#!/usr/bin/env node

// Script para actualizar todas las páginas del blog para usar simple-indexing.js

const fs = require('fs');
const path = require('path');

// Configuración
const BLOG_DIR = './blog';

// Función para procesar un archivo HTML
function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Reemplazar auto-indexing.js con simple-indexing.js
        if (content.includes('auto-indexing.js')) {
            content = content.replace(
                /<!-- Auto-Indexing Script -->\s*<script src="[^"]*auto-indexing\.js" defer><\/script>/g,
                '<!-- Simple Indexing Script (Recomendado) -->\n    <script src="../simple-indexing.js" defer></script>'
            );
            
            content = content.replace(
                /<script src="[^"]*auto-indexing\.js"[^>]*><\/script>/g,
                '<script src="../simple-indexing.js" defer></script>'
            );
            
            updated = true;
        }
        
        // Si no tiene ningún script de indexación, agregarlo
        if (!content.includes('simple-indexing.js') && !content.includes('auto-indexing.js')) {
            // Buscar donde agregar el script
            const analyticsIndex = content.indexOf('analytics.js');
            if (analyticsIndex !== -1) {
                // Agregar después de analytics.js
                const afterAnalytics = content.indexOf('</script>', analyticsIndex) + '</script>'.length;
                content = content.substring(0, afterAnalytics) + 
                         '\n    \n    <!-- Simple Indexing Script (Recomendado) -->\n    <script src="../simple-indexing.js" defer></script>' +
                         content.substring(afterAnalytics);
                updated = true;
            }
        }
        
        if (updated) {
            // Escribir el archivo actualizado
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${path.basename(filePath)} actualizado a simple-indexing.js`);
        } else {
            console.log(`ℹ️  ${path.basename(filePath)} ya está actualizado`);
        }
        
    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
    }
}

// Función principal
function updateAllToSimpleIndexing() {
    console.log('🔄 Actualizando todas las páginas a simple-indexing.js...');
    
    // Verificar que existe el directorio blog
    if (!fs.existsSync(BLOG_DIR)) {
        console.error(`❌ El directorio ${BLOG_DIR} no existe`);
        return;
    }
    
    // Obtener todos los archivos HTML del blog
    function getHtmlFiles(dir) {
        let htmlFiles = [];
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Recursivo para subdirectorios
                htmlFiles = htmlFiles.concat(getHtmlFiles(fullPath));
            } else if (item.endsWith('.html')) {
                htmlFiles.push(fullPath);
            }
        }
        
        return htmlFiles;
    }
    
    const htmlFiles = getHtmlFiles(BLOG_DIR);
    console.log(`📄 Encontrados ${htmlFiles.length} archivos HTML`);
    
    // Procesar cada archivo
    htmlFiles.forEach(updateHtmlFile);
    
    console.log('\n✨ Actualización completada!');
    console.log('\n📋 Beneficios del nuevo script:');
    console.log('✅ No requiere configuración de APIs');
    console.log('✅ Métodos probados que realmente funcionan');
    console.log('✅ Ping automático de sitemaps');
    console.log('✅ Optimización SEO automática');
    console.log('✅ Enlaces internos automáticos');
    console.log('\n🚀 El script ya está funcionando en todas las páginas!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    updateAllToSimpleIndexing();
}

module.exports = { updateAllToSimpleIndexing, updateHtmlFile };