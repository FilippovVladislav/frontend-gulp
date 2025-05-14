import gulp from 'gulp';
import path from 'path';
import { reloadBrowser } from './serveTask.mjs'; // если нужна перезагрузка

const srcFilesDir = path.resolve('src/files');
const distFilesDir = path.resolve('dist/files');

export function copyFilesTask() {
    return gulp.src(`${srcFilesDir}/**/*`, { base: 'src' }) // сохраняем структуру
        .pipe(gulp.dest('dist'))
        .on('end', () => {
            console.log('✅ Папка files скопирована в dist');
            reloadBrowser(); // если используешь livereload/bs
        });
}