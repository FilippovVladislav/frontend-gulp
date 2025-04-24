import gulp from 'gulp';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import svgSprite from 'gulp-svg-sprite';
import path from 'path';

const config = {
    mode: {
        symbol: {
            sprite: '../sprite.svg',
            example: false,
        },
    },
    shape: {
        transform: [], // без SVGO, потому что svgmin + cheerio сами справятся
        id: {
            generator: 'icon-%s',
        },
    },
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false,
        rootAttributes: {
            style: 'display: none;',
        },
    },
};

export function svgSpriteTask() {
    return gulp
        .src('src/images/icon/*.svg')
        .pipe(svgmin({
            plugins: [
                {
                    name: 'removeAttrs',
                    params: {
                        attrs: ['width', 'height', 'fill', 'stroke'],
                    },
                },
                {
                    name: 'removeStyleElement',
                },
            ],
        }))
        .pipe(cheerio({
            run: ($) => {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true },
        }))
        .pipe(svgSprite(config))
        .pipe(gulp.dest('dist/images'));
}
