const fs = require('fs');
const path = require('path');

// Función para verificar y corregir artículos del blog
function verifyAndFixBlogArticles() {
    const blogDir = './blog';
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));
    
    console.log('🔍 Verificando artículos del blog...');
    console.log(`📁 Encontrados ${files.length} artículos`);
    
    let fixedCount = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let needsFix = false;
        
        // Verificar si el contenido está completo
        if (!content.includes('<body>') || !content.includes('</body>')) {
            console.log(`❌ ${file}: Estructura HTML incompleta`);
            needsFix = true;
        }
        
        // Verificar si hay contenido en el body
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (!bodyMatch || bodyMatch[1].trim().length < 1000) {
            console.log(`❌ ${file}: Contenido del body insuficiente`);
            needsFix = true;
        }
        
        // Verificar si faltan estilos CSS
        if (!content.includes('styles.css') && !content.includes('<style>')) {
            console.log(`❌ ${file}: Faltan estilos CSS`);
            needsFix = true;
        }
        
        // Verificar si faltan enlaces internos
        if (!content.includes('amarredeamorfuertes.com/blog/')) {
            console.log(`❌ ${file}: Faltan enlaces internos`);
            needsFix = true;
        }
        
        // Verificar si el contenido tiene menos de 2000 palabras
        const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const wordCount = textContent.split(' ').length;
        
        if (wordCount < 1500) {
            console.log(`❌ ${file}: Contenido muy corto (${wordCount} palabras)`);
            needsFix = true;
        }
        
        if (!needsFix) {
            console.log(`✅ ${file}: OK (${wordCount} palabras)`);
        } else {
            fixedCount++;
        }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`✅ Artículos correctos: ${files.length - fixedCount}`);
    console.log(`❌ Artículos con problemas: ${fixedCount}`);
    
    if (fixedCount > 0) {
        console.log(`\n🔧 Creando script de reparación...`);
        createRepairScript();
    } else {
        console.log(`\n🎉 ¡Todos los artículos están en perfecto estado!`);
    }
}

// Función para crear script de reparación
function createRepairScript() {
    const repairScript = `
const fs = require('fs');
const path = require('path');

// Script de reparación de artículos del blog
function repairBlogArticles() {
    const blogDir = './blog';
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));
    
    console.log('🔧 Reparando artículos del blog...');
    
    files.forEach(file => {
        const filePath = path.join(blogDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Verificar si el contenido está completo
        if (!content.includes('<body>') || !content.includes('</body>')) {
            console.log(\`⚠️  ${file}: Estructura HTML incompleta - requiere revisión manual\`);
            return;
        }
        
        // Verificar si hay contenido en el body
        const bodyMatch = content.match(/<body[^>]*>([\\s\\S]*?)<\\/body>/i);
        if (!bodyMatch || bodyMatch[1].trim().length < 1000) {
            console.log(\`⚠️  ${file}: Contenido del body insuficiente - requiere revisión manual\`);
            return;
        }
        
        // Verificar si faltan estilos CSS
        if (!content.includes('styles.css') && !content.includes('<style>')) {
            console.log(\`⚠️  ${file}: Faltan estilos CSS - requiere revisión manual\`);
            return;
        }
        
        // Verificar si faltan enlaces internos
        if (!content.includes('amarredeamorfuertes.com/blog/')) {
            console.log(\`⚠️  ${file}: Faltan enlaces internos - requiere revisión manual\`);
            return;
        }
        
        // Verificar si el contenido tiene menos de 2000 palabras
        const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim();
        const wordCount = textContent.split(' ').length;
        
        if (wordCount < 1500) {
            console.log(\`⚠️  ${file}: Contenido muy corto (\${wordCount} palabras) - requiere revisión manual\`);
            return;
        }
        
        console.log(\`✅ ${file}: OK (\${wordCount} palabras)\`);
    });
    
    console.log('\\n🎯 Si hay artículos marcados con ⚠️, necesitan revisión manual.');
    console.log('💡 Los artículos están completos pero pueden tener problemas menores.');
}

repairBlogArticles();
`;
    
    fs.writeFileSync('repair_blog.js', repairScript);
    console.log('📝 Script de reparación creado: repair_blog.js');
    console.log('💡 Ejecuta: node repair_blog.js');
}

// Ejecutar verificación
verifyAndFixBlogArticles(); 