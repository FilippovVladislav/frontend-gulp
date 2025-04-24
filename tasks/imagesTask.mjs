import gulp from "gulp";
import { globby } from 'globby';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcDir = path.resolve(__dirname, '../src/images');
const distDir = path.resolve(__dirname, '../dist/images');

export async function optimizeImages() {
    const files = await globby(['**/*.{jpg,jpeg,png,svg}'], {
        cwd: srcDir,
        absolute: true,
    });

    const optimizePromises = files.map(async (file) => {
        const buffer = await readFile(file);
        const ext = path.extname(file).toLowerCase().slice(1);
        const relPath = path.relative(srcDir, file);
        const outputPath = path.join(distDir, relPath);

        const plugins = [];

        if (['jpg', 'jpeg'].includes(ext)) {
            plugins.push(imageminMozjpeg({ quality: 80 }));
        }
        if (ext === 'png') {
            plugins.push(imageminPngquant({ quality: [0.6, 0.8] }));
        }
        if (ext === 'svg') {
            plugins.push(imageminSvgo({
                plugins: [
                    {
                        name: 'removeViewBox',
                        active: false
                    }
                ]
            }));
        }

        const result = await imagemin.buffer(buffer, {
            plugins,
        });

        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, result);
    });

    await Promise.all(optimizePromises); // Ждем завершения всех операций
}

export async function convertToWebp() {
    const files = await globby(['**/*.{jpg,jpeg,png}'], {
        cwd: srcDir,
        absolute: true,
    });

    const convertPromises = files.map(async (file) => {
        const buffer = await readFile(file);
        const relPath = path.relative(srcDir, file);
        const webpRelPath = relPath.replace(/\.(jpe?g|png)$/i, '.webp');
        const outputPath = path.join(distDir, webpRelPath);

        const result = await imagemin.buffer(buffer, {
            plugins: [imageminWebp({ quality: 80 })],
        });

        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, result);
    });

    await Promise.all(convertPromises); // Ждем завершения всех операций
}

export function copyImages() {
    return gulp.src('src/images/**/*.{jpg,jpeg,png,svg,gif,ico}')
        .pipe(gulp.dest('dist/images'));
}
