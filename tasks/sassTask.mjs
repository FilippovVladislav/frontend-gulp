import gulpSass from 'gulp-sass'; // Импортируем gulp-sass
import dartSass from 'sass'; // Импортируем dart-sass
import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import pxtorem from 'postcss-pxtorem';
import { reloadBrowser } from './serveTask.mjs'; // Импортируем reloadBrowser

// Создаем связку для использования dart-sass через gulp-sass
const sass = gulpSass(dartSass); // Передаем dartSass в gulp-sass
const { src, dest } = gulp;

const paths = {
    critical: 'src/scss/critical.scss',
    async: 'src/scss/async.scss',
    output: 'dist/css',
    html: 'src/html/**/*.html',
    js: 'src/js/**/*.ts'
};

const postcssPlugins = [
    pxtorem({
        rootValue: 16,         // базовый размер шрифта
        propList: ['*'],       // преобразовывать все свойства
        mediaQuery: false,     // не преобразовывать внутри @media
        minPixelValue: 1       // минимальное значение для преобразования
    })
];

export function sassTask() {
    const compileCritical = () => {
        return src(paths.critical)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError)) // Компиляция Sass с выводом ошибок
            .pipe(postcss(postcssPlugins))
            .pipe(cleanCSS())
            .pipe(rename('critical.css'))
            .pipe(sourcemaps.write('.'))
            .pipe(dest(paths.output));
    };


    const compileAsync = () => {
        return src(paths.async)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError)) // Компиляция Sass с выводом ошибок
            .pipe(postcss(postcssPlugins))
            .pipe(cleanCSS())
            .pipe(rename('async.css'))
            .pipe(sourcemaps.write('.'))
            .pipe(dest(paths.output));
    };

    return Promise.all([compileCritical(), compileAsync()])
        .then(() => {
            reloadBrowser(); // Перезагружаем браузер после компиляции
        });
}
