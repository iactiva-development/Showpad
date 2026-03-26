/**
 * SHOWPAD OFFLINE WEB - Build Script
 * Genera el ZIP final para Showpad
 * 
 * Uso: npm run build
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Configuración
const config = {
    outputDir: 'dist',
    outputName: 'product.zip',
    sourceDir: process.cwd(),
    include: [
        'index.html',
        'assets/**/*',
        'data/**/*',
        'pages/**/*'
    ],
    exclude: [
        'node_modules',
        'scripts',
        'dist',
        'package.json',
        'package-lock.json',
        '.git',
        '.gitignore',
        'README.md',
        '*.log',
        '.DS_Store',
        'Thumbs.db'
    ]
};

/**
 * Crea el directorio de salida si no existe
 */
function ensureOutputDir() {
    const outputPath = path.join(config.sourceDir, config.outputDir);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
        console.log(`📁 Creado directorio: ${config.outputDir}/`);
    }
}

/**
 * Verifica que index.html existe en la raíz
 */
function verifyIndexHtml() {
    const indexPath = path.join(config.sourceDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
        throw new Error('❌ ERROR: index.html no encontrado en la raíz del proyecto');
    }
    console.log('✅ index.html verificado en la raíz');
}

/**
 * Verifica que no hay dependencias externas
 */
function checkExternalDependencies() {
    const filesToCheck = [
        'index.html',
        ...glob('assets/css/*.css'),
        ...glob('assets/js/*.js')
    ];

    const externalPatterns = [
        /https?:\/\//gi,
        /cdn\./gi,
        /googleapis\.com/gi,
        /cloudflare/gi,
        /unpkg\.com/gi,
        /jsdelivr/gi
    ];

    let hasExternal = false;

    filesToCheck.forEach(file => {
        const filePath = path.join(config.sourceDir, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');

            externalPatterns.forEach(pattern => {
                if (pattern.test(content)) {
                    console.warn(`⚠️  Posible dependencia externa en: ${file}`);
                    hasExternal = true;
                }
            });
        }
    });

    if (!hasExternal) {
        console.log('✅ Sin dependencias externas detectadas');
    }

    return !hasExternal;
}

/**
 * Simple glob implementation
 */
function glob(pattern) {
    const files = [];
    const dir = path.dirname(pattern);
    const ext = path.extname(pattern);
    const dirPath = path.join(config.sourceDir, dir);

    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(file => {
            if (ext === '.*' || file.endsWith(ext.replace('*', ''))) {
                files.push(path.join(dir, file));
            }
        });
    }

    return files;
}

/**
 * Crea el archivo ZIP
 */
async function createZip() {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(config.sourceDir, config.outputDir, config.outputName);
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
            console.log(`\n📦 ZIP creado: ${config.outputDir}/${config.outputName}`);
            console.log(`📊 Tamaño: ${sizeMB} MB`);

            if (parseFloat(sizeMB) > 200) {
                console.warn('⚠️  ADVERTENCIA: El ZIP supera 200 MB');
            }

            resolve(outputPath);
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        // Añadir index.html (DEBE estar en la raíz)
        archive.file(path.join(config.sourceDir, 'index.html'), { name: 'index.html' });

        // Añadir directorios
        const directories = ['assets', 'data', 'pages'];
        directories.forEach(dir => {
            const dirPath = path.join(config.sourceDir, dir);
            if (fs.existsSync(dirPath)) {
                archive.directory(dirPath, dir);
            }
        });

        archive.finalize();
    });
}

/**
 * Lista el contenido del ZIP
 */
function listZipContents() {
    console.log('\n📋 Contenido del ZIP:');
    console.log('   index.html (raíz)');

    const directories = ['assets', 'data', 'pages'];
    directories.forEach(dir => {
        const dirPath = path.join(config.sourceDir, dir);
        if (fs.existsSync(dirPath)) {
            console.log(`   ${dir}/`);
            countFiles(dirPath, dir);
        }
    });
}

/**
 * Cuenta archivos recursivamente
 */
function countFiles(dirPath, prefix) {
    let count = 0;

    function walk(dir) {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            if (stat.isDirectory()) {
                walk(itemPath);
            } else {
                count++;
            }
        });
    }

    walk(dirPath);
    console.log(`      └── ${count} archivos`);
}

/**
 * Función principal
 */
async function build() {
    console.log('🚀 SHOWPAD OFFLINE WEB - Build Script\n');
    console.log('━'.repeat(40));

    try {
        // Paso 1: Verificaciones
        console.log('\n📋 Verificando proyecto...\n');
        verifyIndexHtml();
        checkExternalDependencies();

        // Paso 2: Preparar directorio
        ensureOutputDir();

        // Paso 3: Crear ZIP
        console.log('\n📦 Creando ZIP...');
        await createZip();

        // Paso 4: Resumen
        listZipContents();

        console.log('\n━'.repeat(40));
        console.log('✅ Build completado exitosamente');
        console.log(`\n📄 Archivo listo: ${config.outputDir}/${config.outputName}`);
        console.log('📱 Subir a Showpad con index.html en la raíz');
        console.log('━'.repeat(40));

    } catch (error) {
        console.error('\n❌ Error durante el build:', error.message);
        process.exit(1);
    }
}

// Ejecutar
build();
