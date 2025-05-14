import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import rename from 'gulp-rename';
import { reloadBrowser } from './serveTask.mjs';

const fontsDir = path.resolve('src/fonts');
const distFontsDir = path.resolve('dist/fonts');
const scssFile = path.resolve('src/scss/base/_fonts.scss');

function createFontsDir() {
    if (!fs.existsSync(distFontsDir)) {
        fs.mkdirSync(distFontsDir, { recursive: true });
        console.log('✅ Папка dist/fonts создана');
    }
}

function createScssFile() {
    fs.writeFileSync(scssFile, '', 'utf8'); // всегда перезаписываем
    console.log('✅ Файл _fonts.scss очищен/создан');
}

function getFontWeight(fontName) {
    const name = fontName.toLowerCase();
    if (name.includes('extrabold') || name.includes('heavy')) return 800;
    if (name.includes('black')) return 900;
    if (name.includes('semibold') || name.includes('demibold')) return 600;
    if (name.includes('bold')) return 700;

    if (name.includes('medium')) return 500;
    if (name.includes('regular') || name.includes('normal')) return 400;
    if (name.includes('light')) return 300;
    if (name.includes('extralight') || name.includes('ultralight')) return 200;
    if (name.includes('thin')) return 100;
    return 400; // default
}

function getBaseFontName(fullName) {
    return fullName.split('-')[0]; // Roboto-Bold → Roboto
}

function removeTTFfromDist() {
    const files = fs.readdirSync(distFontsDir);
    for (const file of files) {
        if (file.endsWith('.ttf')) {
            fs.unlinkSync(path.join(distFontsDir, file));
            console.log(`🗑 Удалён лишний файл: ${file}`);
        }
    }
}

export async function fontsTask() {
    createFontsDir();
    createScssFile();

    const files = fs.readdirSync(fontsDir);
    const fontFiles = files.filter(file => file.endsWith('.ttf'));

    if (fontFiles.length === 0) {
        console.log('⚠️ Нет TTF файлов для обработки.');
        return;
    }

    let scssContent = '';
    const addedFonts = new Set(); // Для отслеживания уникальных шрифтов

    const ttf2woff2 = (await import('ttf2woff2')).default;

    const copyFontPromises = fontFiles.map((file) => {
        const fontPath = path.join(fontsDir, file);
        const fontName = path.basename(file, path.extname(file));
        const baseFontName = getBaseFontName(fontName);
        const fontWeight = getFontWeight(fontName);

        // Проверка на уникальность шрифта
        const fontKey = `${baseFontName}-${fontWeight}-${path.extname(file)}`;
        if (addedFonts.has(fontKey)) {
            console.log(`⚠️ Шрифт ${baseFontName} с весом ${fontWeight} и расширением ${path.extname(file)} уже добавлен. Пропускаем.`);
            return Promise.resolve(); // Пропускаем обработку этого шрифта
        }

        addedFonts.add(fontKey); // Добавляем шрифт в набор с расширением

        console.log(`🔧 Обрабатываем: ${fontName} → ${baseFontName}, вес: ${fontWeight}, формат: TTF`);

        return new Promise((resolve, reject) => {
            // Копируем .ttf файл
            gulp.src(fontPath)
                .pipe(gulp.dest(distFontsDir))
                .on('end', () => {
                    console.log(`✅ Шрифт ${fontName}.ttf скопирован`);

                    // Конвертируем .ttf в .woff
                    gulp.src(fontPath)
                        .pipe(rename({ extname: '.woff' }))
                        .pipe(gulp.dest(distFontsDir))
                        .on('end', () => {
                            console.log(`✅ Шрифт ${fontName}.woff скопирован`);

                            // Конвертируем .ttf в .woff2
                            const woff2Buffer = ttf2woff2(fs.readFileSync(fontPath));
                            fs.writeFileSync(path.join(distFontsDir, `${fontName}.woff2`), woff2Buffer);
                            console.log(`✅ Шрифт ${fontName}.woff2 скопирован`);

                            resolve();
                        })
                        .on('error', (err) => {
                            console.error(`Ошибка при конвертации ${fontName}.woff:`, err);
                            reject(err);
                        });
                })
                .on('error', (err) => {
                    console.error(`Ошибка при конвертации ${fontName}.ttf:`, err);
                    reject(err);
                });
        }).then(() => {
            // SCSS
            const fontFace = `@font-face {\n` +
                `  font-family: '${baseFontName}';\n` +
                `  src: url('../fonts/${fontName}.woff2') format('woff2'),\n` +
                `       url('../fonts/${fontName}.woff') format('woff');\n` +
                `  font-weight: ${fontWeight};\n` +
                `  font-style: normal;\n` +
                `  font-display: swap;\n` +
                `}\n\n`;

            // Проверяем, добавлен ли уже такой же @font-face
            if (!scssContent.includes(fontFace)) {
                scssContent += fontFace;
            }
        });
    });

    // Ждем завершения всех операций копирования
    await Promise.all(copyFontPromises);

    // Записываем SCSS в файл
    fs.writeFileSync(scssFile, scssContent, 'utf8');
    removeTTFfromDist();

    console.log('✅ Шрифты сконвертированы и SCSS файл обновлён');
    reloadBrowser(); // Перезагружаем браузер после обработки
}
