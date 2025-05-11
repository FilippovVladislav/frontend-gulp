import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { globby } from 'globby';
import * as cheerio from 'cheerio';

// Пути к директориям
const srcHtmlDir = 'src/html';
const distHtmlDir = 'dist';

// Задача для копирования HTML файлов с подстановками
export function copyHtml() {
    return gulp.src(`${srcHtmlDir}/*.html`)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file',  // Убедитесь, что пути корректны
        }))
        .pipe(gulp.dest(distHtmlDir)); // Перезаписать файлы в dist
}

// Задача для замены <img> на <picture> с поддержкой WebP
export function htmlWebpReplaceTask(done) {
    (async () => {
        try {
            const files = await globby(['**/*.html'], { cwd: distHtmlDir, absolute: true });

            for (const file of files) {
                const html = await readFile(file, 'utf-8');
                const $ = cheerio.load(html);

                // Заменяем обычные изображения на <picture> с WebP
                $('img').each((_, img) => {
                    const $img = $(img);
                    let src = $img.attr('src');

                    if (src && /\.(jpe?g|png)$/i.test(src)) {
                        const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');  // Меняем на .webp
                        const fileName = path.basename(src, path.extname(src));
                        const alt = $img.attr('alt') || fileName;

                        const classAttr = $img.attr('class');
                        const width = $img.attr('width');
                        const height = $img.attr('height');

                        const classText = classAttr ? ` class="${classAttr}"` : '';
                        const widthText = width ? ` width="${width}"` : '';
                        const heightText = height ? ` height="${height}"` : '';

                        const picture = `
<picture>
  <source data-srcset="${webpSrc}" type="image/webp">
  <img data-src="${src}" alt="${alt}" class="lazy-img"${classText}${widthText}${heightText} loading="lazy">
</picture>`;

                        $img.replaceWith(picture);
                    }
                });

                // Заменяем фоновое изображение с .jpg/.png на data-bg и загружаем через JS
                $('[style]').each((_, el) => {
                    const $el = $(el);
                    let style = $el.attr('style');

                    // Поиск background-image с .jpg, .jpeg или .png
                    const regex = /background-image\s*:\s*url\(["']?(.*?)\.(jpe?g|png)["']?\)/gi;

                    style = style.replace(regex, (match, urlBase, ext) => {
                        // Меняем на .webp для всех форматов .jpg/.png
                        const bgImages = `${urlBase}.webp, ${urlBase}-mobile.webp`; // Мобильный вариант добавлен
                        $el.attr('data-bg', bgImages); // Заменяем на data-bg с .webp
                        return style; // Оставляем оригинальный стиль без background-image
                    });

                    // Обновляем стиль
                    $el.attr('style', style);
                });

                await writeFile(file, $.html(), 'utf-8');
            }

            done(); // Завершаем задачу после всех операций
        } catch (err) {
            console.error('Error in htmlWebpReplaceTask:', err);
            done(err); // Завершаем задачу с ошибкой
        }
    })();
}




// Задача для добавления предзагрузки изображений
export function addPreloadToLCP(done) {
    (async () => {
        try {
            const files = await globby(['**/*.html'], { cwd: distHtmlDir, absolute: true });

            for (const file of files) {
                const html = await readFile(file, 'utf-8');
                const $ = cheerio.load(html);

                // Ищем изображения для предзагрузки
                $('img').each((_, img) => {
                    const $img = $(img);
                    const src = $img.attr('src');

                    if (src && /\.(jpe?g|png)$/i.test(src)) {
                        const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');

                        // Добавляем тег <link rel="preload"> для предзагрузки
                        $('head').append(`<link rel="preload" href="${webpSrc}" as="image" type="image/webp" crossorigin="anonymous">`);
                        $('head').append(`<link rel="preload" href="${src}" as="image" type="image/jpeg" crossorigin="anonymous">`);
                    }
                });

                await writeFile(file, $.html(), 'utf-8');
            }

            done(); // Завершаем задачу
        } catch (err) {
            console.error('Error in addPreloadToLCP:', err);
            done(err); // Завершаем задачу с ошибкой
        }
    })();
}

// Задача для добавления предзагрузки шрифтов
export function addPreloadFonts(done) {
    (async () => {
        try {
            // Путь к папке с шрифтами
            const fontsDir = path.join(distHtmlDir, 'fonts');

            // Получаем все файлы шрифтов в папке dist/fonts
            const fontFiles = await globby(['**/*.{woff,woff2,ttf,otf}'], { cwd: fontsDir });

            // Получаем все HTML файлы в папке dist
            const files = await globby(['**/*.html'], { cwd: distHtmlDir, absolute: true });

            for (const file of files) {
                const html = await readFile(file, 'utf-8');
                const $ = cheerio.load(html);

                // Для каждого шрифта из папки dist/fonts добавляем тег <link rel="preload">
                fontFiles.forEach(fontFile => {
                    const fontUrl = `fonts/${fontFile}`;
                    const fontType = path.extname(fontFile).toLowerCase();

                    // Добавляем тег <link rel="preload"> для предзагрузки шрифта
                    $('head').append(`<link rel="preload" href="${fontUrl}" as="font" type="font/${fontType}" crossorigin="anonymous">`);
                });

                // Перезаписываем изменённый файл HTML
                await writeFile(file, $.html(), 'utf-8');
            }

            done(); // Завершаем задачу
        } catch (err) {
            console.error('Error in addPreloadFonts:', err);
            done(err); // Завершаем задачу с ошибкой
        }
    })();
}

// Задача для добавления критичных стилей прямо в head
export function addCriticalCssToHead(done) {
    (async () => {
        try {
            const files = await globby(['**/*.html'], { cwd: distHtmlDir, absolute: true });
            const criticalCssPath = path.join('dist', 'css', 'critical.css');  // Путь к скомпилированному critical.css
            let criticalCss = await readFile(criticalCssPath, 'utf-8');  // Чтение содержимого CSS

            // Удаляем пути с "../"
            criticalCss = criticalCss.replace(/url\(["']?\.\.\/[^"']+["']?\)/g, match => {
                return match.replace('../', ''); // Убираем "../" из пути
            });

            for (const file of files) {
                const html = await readFile(file, 'utf-8');
                const $ = cheerio.load(html);

                $('link[href="css/critical.css"]').remove();

                // Вставляем критичные стили в head
                $('head').append(`<style>${criticalCss}</style>`);

                await writeFile(file, $.html(), 'utf-8');
            }

            done(); // Завершаем задачу
        } catch (err) {
            console.error('Error in addCriticalCssToHead:', err);
            done(err); // Завершаем задачу с ошибкой
        }
    })();
}

// Основная Gulp задача для всех этапов
export const build = gulp.series(
    copyHtml,
    htmlWebpReplaceTask,
    addPreloadToLCP,
    addPreloadFonts,
    addCriticalCssToHead
);
