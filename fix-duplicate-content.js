#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración de la estrategia anti-duplicación
const STRATEGY_CONFIG = {
    // Metadatos únicos por página
    uniqueMetadata: {
        index: {
            title: "Amarres de Amor Eternos | #1 en Rituales de Amor 2025 | Maestro Alejandro",
            description: "✅ Amarres de Amor Eternos que FUNCIONAN. Maestro Alejandro, Chaman Ancestral con 30+ años. Rituales de amor, endulzamientos y amarres espirituales GARANTIZADOS. Consulta GRATIS por WhatsApp.",
            keywords: "amarres de amor, amarre de amor, amarres amor, rituales de amor, endulzamientos, brujeria amor, magia amor, amarre espiritual, para que me busque, ritual amor, chaman amor"
        },
        blog: {
            // Patrones para artículos del blog
            titlePattern: "{TOPIC}: {SPECIFIC_DESCRIPTION} | Maestro Alejandro",
            descriptionPattern: "Descubre {SPECIFIC_CONTENT}. {UNIQUE_VALUE_PROPOSITION}. Métodos ancestrales que funcionan.",
            keywordsPattern: "{TOPIC_KEYWORDS}, amarre {SPECIFIC_TYPE}, rituales {SPECIFIC_FOCUS}"
        }
    },
    
    // Contenido que debe ser único por página
    uniqueContent: {
        index: [
            "servicios principales",
            "información básica del Maestro Alejandro",
            "CTA principal para consultas",
            "resumen de testimonios"
        ],
        blog: [
            "técnicas específicas del tema",
            "casos de estudio únicos",
            "información detallada del Maestro Alejandro",
            "CTA específico del tema"
        ]
    },
    
    // Schema.org específico por tipo de página
    schemaTypes: {
        index: ["LocalBusiness", "Organization"],
        blog: ["Article", "Person", "BreadcrumbList"]
    }
};

// Función para detectar contenido duplicado
function detectDuplicateContent(htmlContent, pageType) {
    const duplicates = [];
    
    // Detectar metadatos duplicados
    const metaPatterns = [
        /<title>(.*?)<\/title>/gi,
        /<meta name="description" content="(.*?)"/gi,
        /<meta name="keywords" content="(.*?)"/gi
    ];
    
    metaPatterns.forEach(pattern => {
        const matches = htmlContent.match(pattern);
        if (matches && matches.length > 1) {
            duplicates.push({
                type: 'metadata',
                pattern: pattern.source,
                matches: matches.length
            });
        }
    });
    
    // Detectar contenido duplicado del Maestro Alejandro
    const maestroPatterns = [
        /Maestro Alejandro.*?30.*?años/gi,
        /Chaman Ancestral/gi,
        /rituales de amor/gi
    ];
    
    maestroPatterns.forEach(pattern => {
        const matches = htmlContent.match(pattern);
        if (matches && matches.length > 3) {
            duplicates.push({
                type: 'content',
                pattern: pattern.source,
                matches: matches.length,
                recommendation: 'Considerar reducir repeticiones'
            });
        }
    });
    
    return duplicates;
}

// Función para optimizar metadatos
function optimizeMetadata(htmlContent, pageType, pageInfo = {}) {
    let optimizedContent = htmlContent;
    
    if (pageType === 'index') {
        // Aplicar metadatos específicos del index
        optimizedContent = optimizedContent.replace(
            /<title>.*?<\/title>/i,
            `<title>${STRATEGY_CONFIG.uniqueMetadata.index.title}</title>`
        );
        
        optimizedContent = optimizedContent.replace(
            /<meta name="description" content=".*?"/i,
            `<meta name="description" content="${STRATEGY_CONFIG.uniqueMetadata.index.description}"`
        );
        
        optimizedContent = optimizedContent.replace(
            /<meta name="keywords" content=".*?"/i,
            `<meta name="keywords" content="${STRATEGY_CONFIG.uniqueMetadata.index.keywords}"`
        );
    } else if (pageType === 'blog') {
        // Aplicar metadatos específicos del blog
        const title = STRATEGY_CONFIG.uniqueMetadata.blog.titlePattern
            .replace('{TOPIC}', pageInfo.topic || 'Amarres de Amor')
            .replace('{SPECIFIC_DESCRIPTION}', pageInfo.specificDescription || 'Técnicas Especiales');
            
        const description = STRATEGY_CONFIG.uniqueMetadata.blog.descriptionPattern
            .replace('{SPECIFIC_CONTENT}', pageInfo.specificContent || 'el poder de los amarres de amor')
            .replace('{UNIQUE_VALUE_PROPOSITION}', pageInfo.uniqueValue || 'Técnicas especiales diseñadas para resultados efectivos');
            
        optimizedContent = optimizedContent.replace(
            /<title>.*?<\/title>/i,
            `<title>${title}</title>`
        );
        
        optimizedContent = optimizedContent.replace(
            /<meta name="description" content=".*?"/i,
            `<meta name="description" content="${description}"`
        );
    }
    
    return optimizedContent;
}

// Función para optimizar Schema.org
function optimizeSchema(htmlContent, pageType) {
    let optimizedContent = htmlContent;
    
    if (pageType === 'index') {
        // Asegurar que el index tenga LocalBusiness y Organization
        const localBusinessSchema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Amarres de Amor - Maestro Alejandro",
            "description": "Amarres de Amor Eternos que FUNCIONAN. Chaman Ancestral con 30+ años de experiencia.",
            "url": "https://amarredeamorfuertes.com/",
            "telephone": "+1-555-123-4567",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "MX",
                "addressLocality": "Ciudad de México"
            }
        };
        
        // Reemplazar o agregar schema específico
        const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(localBusinessSchema, null, 2)}\n</script>`;
        
        if (optimizedContent.includes('"@type": "LocalBusiness"')) {
            // Ya existe, no hacer nada
        } else {
            // Agregar antes del cierre del head
            optimizedContent = optimizedContent.replace(
                '</head>',
                `${schemaScript}\n</head>`
            );
        }
    } else if (pageType === 'blog') {
        // Asegurar que los artículos tengan Article y Person
        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Título del Artículo",
            "author": {
                "@type": "Person",
                "name": "Maestro Alejandro",
                "jobTitle": "Chaman Ancestral"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Maestro Alejandro",
                "url": "https://amarredeamorfuertes.com"
            },
            "datePublished": new Date().toISOString().split('T')[0],
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://amarredeamorfuertes.com/blog/"
            }
        };
        
        const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(articleSchema, null, 2)}\n</script>`;
        
        if (optimizedContent.includes('"@type": "Article"')) {
            // Ya existe, no hacer nada
        } else {
            // Agregar antes del cierre del head
            optimizedContent = optimizedContent.replace(
                '</head>',
                `${schemaScript}\n</head>`
            );
        }
    }
    
    return optimizedContent;
}

// Función para optimizar internal linking
function optimizeInternalLinking(htmlContent, pageType, pageInfo = {}) {
    let optimizedContent = htmlContent;
    
    if (pageType === 'index') {
        // Index debe enlazar a 3-5 artículos específicos
        const recommendedLinks = [
            'amarres-de-amor-para-mujeres.html',
            'amarres-de-amor-permanentes.html',
            'amarres-de-amor-que-funcionan.html',
            'amarres-de-amor-rapidos.html',
            'chaman-amor-experto.html'
        ];
        
        // Verificar que existan enlaces a estos artículos
        recommendedLinks.forEach(link => {
            if (!optimizedContent.includes(link)) {
                console.log(`⚠️  Recomendación: Agregar enlace a ${link} en el index`);
            }
        });
    } else if (pageType === 'blog') {
        // Artículos deben enlazar al index y 2-3 artículos relacionados
        if (!optimizedContent.includes('index.html')) {
            console.log(`⚠️  Recomendación: Agregar enlace al index en ${pageInfo.filename}`);
        }
        
        // Verificar enlaces a artículos relacionados
        const relatedArticles = pageInfo.relatedArticles || [];
        relatedArticles.forEach(article => {
            if (!optimizedContent.includes(article)) {
                console.log(`⚠️  Recomendación: Agregar enlace a ${article} en ${pageInfo.filename}`);
            }
        });
    }
    
    return optimizedContent;
}

// Función principal para procesar archivos
function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        const isIndex = fileName === 'index.html';
        const pageType = isIndex ? 'index' : 'blog';
        
        console.log(`\n📄 Procesando: ${fileName}`);
        
        // Detectar duplicados
        const duplicates = detectDuplicateContent(content, pageType);
        if (duplicates.length > 0) {
            console.log(`⚠️  Contenido duplicado detectado:`);
            duplicates.forEach(dup => {
                console.log(`   - ${dup.type}: ${dup.pattern} (${dup.matches} ocurrencias)`);
                if (dup.recommendation) {
                    console.log(`     Recomendación: ${dup.recommendation}`);
                }
            });
        } else {
            console.log(`✅ No se detectó contenido duplicado`);
        }
        
        // Optimizar metadatos
        const pageInfo = {
            topic: fileName.replace('.html', '').replace(/-/g, ' '),
            filename: fileName
        };
        
        let optimizedContent = optimizeMetadata(content, pageType, pageInfo);
        optimizedContent = optimizeSchema(optimizedContent, pageType);
        optimizedContent = optimizeInternalLinking(optimizedContent, pageType, pageInfo);
        
        // Guardar archivo optimizado
        const backupPath = filePath + '.backup';
        fs.writeFileSync(backupPath, content);
        fs.writeFileSync(filePath, optimizedContent);
        
        console.log(`✅ Archivo optimizado y respaldado en ${backupPath}`);
        
    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
    }
}

// Función para procesar todos los archivos
function processAllFiles() {
    console.log('🚀 Iniciando optimización anti-duplicación...\n');
    
    // Procesar index.html
    if (fs.existsSync('index.html')) {
        processFile('index.html');
    }
    
    // Procesar artículos del blog
    const blogDir = 'blog';
    if (fs.existsSync(blogDir)) {
        const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));
        
        console.log(`\n📚 Procesando ${blogFiles.length} artículos del blog...`);
        
        blogFiles.forEach(file => {
            processFile(path.join(blogDir, file));
        });
    }
    
    console.log('\n🎉 Optimización completada!');
    console.log('\n📋 Resumen de la estrategia implementada:');
    console.log('   ✅ Metadatos únicos por página');
    console.log('   ✅ Schema.org específico por tipo');
    console.log('   ✅ Internal linking optimizado');
    console.log('   ✅ Detección de contenido duplicado');
    console.log('\n📖 Revisa el archivo content-strategy.md para más detalles');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    processAllFiles();
}

module.exports = {
    detectDuplicateContent,
    optimizeMetadata,
    optimizeSchema,
    optimizeInternalLinking,
    processFile,
    processAllFiles
}; 