import through2 from 'through2';
import * as cheerio from 'cheerio';

/**
 * Gulp-плагин для ленивой загрузки <img> и <video>
 */
export function lazyTransform() {
    return through2.obj(function (file, _enc, cb) {
        if (file.isBuffer()) {
            const $ = cheerio.load(file.contents.toString());

            // Обработка <img>
            $('img').each((_, el) => {
                const $el = $(el);
                const src = $el.attr('src');

                // Применяем ленивую загрузку только если src не содержит placeholder
                if (src && !src.includes('placeholder') && !src.includes('data-src')) {
                    // Для ленивой загрузки
                    $el.attr('data-src', src); // Заменяем реальный путь на data-src
                    $el.attr('src', 'images/placeholder.jpg'); // Используем placeholder
                    $el.attr('loading', 'lazy');
                }
            });

            // Обработка <picture>
            $('picture').each((_, el) => {
                const $el = $(el);
                $el.find('img').each((_, imgEl) => {
                    const $img = $(imgEl);
                    const src = $img.attr('src');
                    if (src && !src.includes('placeholder')) {
                        $img.attr('data-src', src); // Заменяем реальный путь на data-src
                        $img.attr('src', 'images/placeholder.jpg'); // Используем placeholder
                        $img.attr('loading', 'lazy');
                    }
                });
            });

            // Обработка <video>
            $('video').each((_, el) => {
                const $el = $(el);
                const src = $el.attr('src');
                if (src) {
                    $el.attr('data-src', src);
                    $el.removeAttr('src');
                    $el.attr('preload', 'none');
                }
            });

            file.contents = Buffer.from($.html());
        }

        cb(null, file);
    });
}
