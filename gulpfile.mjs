import { watch, series, parallel } from 'gulp';
import { sassTask } from './tasks/sassTask.mjs';
import { copyHtml, htmlWebpReplaceTask, addPreloadToLCP } from './tasks/htmlTask.mjs';
import { serveTask, reloadBrowser } from './tasks/serveTask.mjs';
import { fontsTask } from './tasks/fontsTask.mjs';
import { cleanTask } from './tasks/cleanTask.mjs';
import { optimizeImages, convertToWebp, copyImages } from './tasks/imagesTask.mjs';
import { jsTask } from './tasks/jsTask.mjs';
import { svgSpriteTask } from './tasks/svgSpriteTask.mjs';  // Импортируем задачу svgSpriteTask

// Функция для отслеживания изменений в файлах
function watchFiles() {
    watch('src/scss/**/*.scss', series(sassTask, reloadBrowser));
    watch('src/html/**/*.html', series(copyHtml, htmlWebpReplaceTask, addPreloadToLCP, reloadBrowser)); // Добавили все задачи для HTML
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif,ico}', series(copyImages, reloadBrowser));
    watch('src/images/icon/**/*.svg', svgSpriteTask); // Наблюдаем за SVG-иконками для спрайта
    watch(['src/js/**/*.ts', 'src/js/**/*.tsx'], series(jsTask, reloadBrowser));
}

// Задача для разработки
export const dev = series(
    cleanTask,
    fontsTask,
    parallel(
        sassTask,
        copyHtml,
        jsTask,
        async () => {
            await optimizeImages();
            await convertToWebp();
        },
        svgSpriteTask // Добавляем задачу для генерации спрайта
    ),
    serveTask,
    watchFiles
);

// Задача для сборки
export const build = series(
    cleanTask,
    fontsTask,
    parallel(
        sassTask,
        copyHtml,
        jsTask,
        async () => {
            await optimizeImages();
            await convertToWebp();
        },
        svgSpriteTask // Добавляем задачу для генерации спрайта
    ),
    htmlWebpReplaceTask, // Заменяем изображения на <picture> после обработки
    addPreloadToLCP // Добавляем предзагрузку для LCP-элементов
);
