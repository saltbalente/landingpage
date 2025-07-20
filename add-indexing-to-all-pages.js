#!/usr/bin/env node

// Script para agregar los scripts de analytics e indexación automática a todas las páginas del blog

const fs = require('fs');
const path = require('path');

// Configuración
const BLOG_DIR = './blog';
const ANALYTICS_SCRIPT = `    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script src="../analytics.js"></script>
    
    <!-- Auto-Indexing Script -->
    <script src="../auto-indexing.js" defer></script>`;

// Función para procesar un archivo HTML
function processHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si ya tiene los scripts
        if (content.includes('analytics.js') || content.includes('auto-indexing.js')) {
            console.log(`✓ ${path.basename(filePath)} ya tiene los scripts`);
            return;
        }
        
        // Buscar el último script tag antes de </body>
        const bodyCloseIndex = content.lastIndexOf('</body>');
        if (bodyCloseIndex === -1) {
            console.log(`⚠️  ${path.basename(filePath)} no tiene tag </body>`);
            return;
        }
        
        // Buscar el último script tag antes de </body>
        const beforeBodyClose = content.substring(0, bodyCloseIndex);
        const lastScriptIndex = beforeBodyClose.lastIndexOf('<script>');
        
        if (lastScriptIndex === -1) {
            // No hay scripts, agregar antes de </body>
            content = content.replace('</body>', `${ANALYTICS_SCRIPT}\n</body>`);
        } else {
            // Hay scripts, agregar después del último script
            const afterLastScript = content.substring(lastScriptIndex);
            const scriptEndIndex = afterLastScript.indexOf('</script>') + '</script>'.length;
            const insertPosition = lastScriptIndex + scriptEndIndex;
            
            content = content.substring(0, insertPosition) + 
                     '\n\n' + ANALYTICS_SCRIPT + 
                     content.substring(insertPosition);
        }
        
        // Escribir el archivo actualizado
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${path.basename(filePath)} actualizado`);
        
    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
    }
}

// Función principal
function addIndexingToAllPages() {
    console.log('🚀 Agregando scripts de indexación automática a todas las páginas del blog...');
    
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
    htmlFiles.forEach(processHtmlFile);
    
    console.log('\n✨ Proceso completado!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Configura tu clave IndexNow en auto-indexing.js');
    console.log('2. Reemplaza G-XXXXXXXXXX con tu ID real de Google Analytics');
    console.log('3. Verifica que analytics.js y auto-indexing.js estén en la raíz');
    console.log('4. Prueba una página para confirmar que funciona');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    addIndexingToAllPages();
}

module.exports = { addIndexingToAllPages, processHtmlFile };