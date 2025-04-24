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
    return gulp.src(`${srcHtmlDir}/**/*.html`)
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

                $('img').each((_, img) => {
                    const $img = $(img);
                    const src = $img.attr('src');

                    if (src && /\.(jpe?g|png)$/i.test(src)) {
                        const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');
                        const fileName = path.basename(src, path.extname(src));
                        const alt = $img.attr('alt') || fileName;

                        const classAttr = $img.attr('class');
                        const width = $img.attr('width');
                        const height = $img.attr('height');

                        const classText = classAttr ? ` class="${classAttr}"` : '';
                        const widthText = width ? ` width="${width}"` : '';
                        const heightText = height ? ` height="${height}"` : '';

                        const picture = `
<picture ${widthText}${heightText}>
  <source data-srcset="${webpSrc}" type="image/webp">
  <img data-src="${src}" alt="${alt}" class="lazy-img"${classText}${widthText}${heightText}>
</picture>`;

                        $img.replaceWith(picture);
                    }
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

// Основная Gulp задача для всех этапов
export const build = gulp.series(
    copyHtml,
    htmlWebpReplaceTask,
    addPreloadToLCP
);
