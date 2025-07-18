const fs = require('fs');
const path = require('path');

// Función para restaurar todos los artículos desde sus backups
function restoreAllArticles() {
    const blogDir = path.join(__dirname, 'blog');
    
    // Leer todos los archivos de backup
    const backupFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.backup'));
    
    console.log(`🔄 Restaurando ${backupFiles.length} artículos desde backups...`);
    
    let restoredCount = 0;
    let errorCount = 0;
    
    backupFiles.forEach(backupFile => {
        try {
            // Obtener el nombre del archivo original (sin .backup)
            const originalFile = backupFile.replace('.backup', '');
            const backupPath = path.join(blogDir, backupFile);
            const originalPath = path.join(blogDir, originalFile);
            
            console.log(`🔄 Restaurando: ${originalFile}`);
            
            // Leer el contenido del backup
            const backupContent = fs.readFileSync(backupPath, 'utf8');
            
            // Escribir el contenido al archivo original
            fs.writeFileSync(originalPath, backupContent);
            
            console.log(`✅ ${originalFile} - Restaurado exitosamente`);
            restoredCount++;
            
        } catch (error) {
            console.error(`❌ Error restaurando ${backupFile}:`, error.message);
            errorCount++;
        }
    });
    
    console.log('\n📊 Resumen de Restauración:');
    console.log(`✅ Artículos restaurados: ${restoredCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📁 Total procesados: ${backupFiles.length}`);
    
    if (errorCount === 0) {
        console.log('\n🎉 ¡Todos los artículos han sido restaurados exitosamente!');
        console.log('💾 Los archivos de backup se mantienen por seguridad');
    } else {
        console.log('\n⚠️ Algunos archivos tuvieron errores durante la restauración.');
    }
}

// Ejecutar el script
if (require.main === module) {
    restoreAllArticles();
}

module.exports = { restoreAllArticles }; 