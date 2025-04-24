import { src, dest } from 'gulp';
import esbuild from 'gulp-esbuild';

const scriptsTask = () => {
    return src('src/js/**/*.{js,ts}')  // Путь к JS и TS файлам
        .pipe(esbuild({
            bundle: true,
            minify: true,
            target: 'es2015',
        }))
        .pipe(dest('dist/js'));  // Вывод в папку dist/js
};

export default scriptsTask;