import gulp from 'gulp';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const gulpEsbuild = require('gulp-esbuild');
import fs from 'fs';
import path from 'path';

// Функция для создания папки, если она не существует
function createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

export async function jsTask() {
    const outputDir = 'dist/js';

    // Убедимся, что папка dist/js существует
    createFolderIfNotExists(outputDir);

    return gulp.src(['src/js/start.ts', 'src/js/main.ts'])
        .pipe(gulpEsbuild({
            loader: { '.ts': 'ts' },
            bundle: true,
            minify: true,  // Включаем минификацию
            sourcemap: true, // Включаем исходные карты для отладки
            target: ['es2017'],
            entryNames: '[name]',  // Используем исходное имя для файлов
            outdir: '',  // Указываем конкретную папку для вывода
        }).on('error', function (err) {
            console.error('Esbuild error:', err.message);  // Выводим ошибки esbuild в консоль
            this.emit('end');  // Завершаем задачу, даже если есть ошибка
        }))
        .pipe(gulp.dest(outputDir)); // Записываем в папку dist/js
}
