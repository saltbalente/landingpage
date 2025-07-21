#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración
const BLOG_DIR = path.join(__dirname, 'blog');
const CSS_REFERENCE_ABSOLUTE = '<link rel="stylesheet" href="https://amarredeamorfuertes.com/styles.css">';
const CSS_REFERENCE_RELATIVE = '<link rel="stylesheet" href="../styles.css">';
const CSS_REFERENCE_RELATIVE_DEEP = '<link rel="stylesheet" href="../../styles.css">';

// Función para obtener todos los archivos HTML recursivamente
function getAllHtmlFiles(dir, relativePath = '') {
    const files = [];
    
    function scanDirectory(currentDir, currentRelativePath) {
        try {
            const items = fs.readdirSync(currentDir);
            
            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stats = fs.statSync(fullPath);
                
                if (stats.isDirectory()) {
                    const newRelativePath = currentRelativePath ? `${currentRelativePath}/${item}` : item;
                    scanDirectory(fullPath, newRelativePath);
                } else if (item.endsWith('.html')) {
                    const fileName = currentRelativePath ? `${currentRelativePath}/${item}` : item;
                    files.push({
                        fullPath,
                        relativePath: fileName,
                        depth: calculateDepth(fileName)
                    });
                }
            });
        } catch (error) {
            console.error(`Error leyendo directorio ${currentDir}:`, error);
        }
    }
    
    scanDirectory(dir, relativePath);
    return files;
}

// Función para determinar la ruta CSS correcta según la profundidad
function getCssReference(depth) {
    if (depth === 1) {
        return '<link rel="stylesheet" href="../styles.css">';
    } else if (depth === 2) {
        return '<link rel="stylesheet" href="../../styles.css">';
    } else {
        // Para mayor profundidad, agregar más ../ según sea necesario
        const relativePath = '../'.repeat(depth);
        return `<link rel="stylesheet" href="${relativePath}styles.css">`;
    }
}

// Función para calcular la profundidad correcta
function calculateDepth(relativePath) {
    if (!relativePath.includes('/')) {
        return 1; // Archivo en /blog/
    }
    return (relativePath.match(/\//g) || []).length + 1;
}

// Función para agregar referencia CSS si no existe
function addCssReference(content, cssReference) {
    // Buscar si ya existe alguna referencia a styles.css
    const hasStylesReference = content.includes('styles.css');
    
    if (!hasStylesReference) {
        // Buscar el final del </script> del Schema.org
        const scriptEndMatch = content.match(/<\/script>\s*$/m);
        if (scriptEndMatch) {
            const insertPosition = scriptEndMatch.index + scriptEndMatch[0].length;
            return content.slice(0, insertPosition) + '\n  ' + cssReference + content.slice(insertPosition);
        }
        
        // Si no encuentra </script>, buscar antes de <style>
        const styleMatch = content.match(/<style>/i);
        if (styleMatch) {
            const insertPosition = styleMatch.index;
            return content.slice(0, insertPosition) + '  ' + cssReference + '\n    ' + content.slice(insertPosition);
        }
        
        // Si no encuentra <style>, buscar antes de </head>
        const headEndMatch = content.match(/<\/head>/i);
        if (headEndMatch) {
            const insertPosition = headEndMatch.index;
            return content.slice(0, insertPosition) + '  ' + cssReference + '\n' + content.slice(insertPosition);
        }
    }
    
    return content;
}

// Función para actualizar referencias CSS
function updateCssReferences(content, correctReference) {
    // Reemplazar referencias absolutas
    content = content.replace(
        /<link rel="stylesheet" href="https:\/\/amarredeamorfuertes\.com\/styles\.css">/g,
        correctReference
    );
    
    // Reemplazar referencias relativas incorrectas
    content = content.replace(
        /<link rel="stylesheet" href="\.\.?\/+styles\.css">/g,
        correctReference
    );
    
    return content;
}

// Función principal
function fixCssReferences() {
    console.log('🔧 Corrigiendo referencias CSS en archivos del blog...');
    
    const htmlFiles = getAllHtmlFiles(BLOG_DIR);
    let updatedFiles = 0;
    let addedReferences = 0;
    
    htmlFiles.forEach(file => {
        try {
            let content = fs.readFileSync(file.fullPath, 'utf8');
            const originalContent = content;
            
            // Determinar la referencia CSS correcta según la profundidad
            const correctReference = getCssReference(file.depth);
            
            // Actualizar referencias existentes
            content = updateCssReferences(content, correctReference);
            
            // Agregar referencia si no existe
            content = addCssReference(content, correctReference);
            
            // Escribir archivo solo si hubo cambios
            if (content !== originalContent) {
                fs.writeFileSync(file.fullPath, content, 'utf8');
                updatedFiles++;
                
                // Verificar si se agregó una nueva referencia
                if (!originalContent.includes('styles.css') && content.includes('styles.css')) {
                    addedReferences++;
                    console.log(`✅ Agregada referencia CSS: ${file.relativePath}`);
                } else {
                    console.log(`🔄 Actualizada referencia CSS: ${file.relativePath}`);
                }
            }
            
        } catch (error) {
            console.error(`❌ Error procesando ${file.relativePath}:`, error);
        }
    });
    
    console.log('\n📊 Resumen:');
    console.log(`   - Archivos procesados: ${htmlFiles.length}`);
    console.log(`   - Archivos actualizados: ${updatedFiles}`);
    console.log(`   - Referencias agregadas: ${addedReferences}`);
    console.log(`   - Referencias corregidas: ${updatedFiles - addedReferences}`);
    
    if (updatedFiles > 0) {
        console.log('\n✅ Referencias CSS corregidas exitosamente!');
        console.log('\n📝 Próximos pasos:');
        console.log('   1. Verificar que styles.css existe en la raíz del proyecto');
        console.log('   2. Probar la carga de estilos en desarrollo local');
        console.log('   3. Verificar que las rutas funcionen en producción');
    } else {
        console.log('\n✅ Todas las referencias CSS ya están correctas.');
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    fixCssReferences();
}

module.exports = { fixCssReferences, getAllHtmlFiles };