import gulp from 'gulp';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { mkdir } from 'fs/promises';
import { globby } from 'globby';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Папка исходников и папка для выходных файлов
const srcDir = path.resolve(__dirname, '../src/video');  // Теперь явно указываем src/video
const distDir = path.resolve(__dirname, '../dist/video');  // И dist/video

// Функция для сжатия видео
async function compressVideo(file, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(file)
            .output(outputPath)
            .videoCodec('libx264') // Кодек H.264
            .audioCodec('aac') // Кодек для аудио
            .on('start', (commandLine) => {
                console.log('FFmpeg командная строка: ', commandLine);
            })
            .on('end', () => {
                console.log(`Видео сжато: ${outputPath}`);
                resolve();
            })
            .on('error', (err) => {
                console.error('Ошибка при сжатии видео: ', err.message);
                reject(err); // Если ошибка, отклоняем промис
            })
            .run();
    });
}

// Задача для сжатия видео или копирования файла
async function processVideoFile(file) {
    const relPath = path.relative(srcDir, file);  // Относительный путь
    const outputPath = path.join(distDir, relPath);  // Полный путь в dist/video

    console.log('Обрабатываем видео: ', file);  // Логируем, какой файл обрабатываем

    try {
        // Создаем директорию для выходных файлов, если ее нет
        await mkdir(path.dirname(outputPath), { recursive: true });

        // Попробуем сжать видео
        await compressVideo(file, outputPath);
    } catch (error) {
        // Если не удалось сжать, просто копируем файл
        console.log('Ошибка сжатия видео, копирование файла вместо сжатия...');
        fs.copyFile(file, outputPath, (err) => {
            if (err) {
                console.error('Ошибка при копировании файла: ', err);
            } else {
                console.log(`Файл скопирован: ${outputPath}`);
            }
        });
    }
}

// Задача для обработки всех видео
async function compressAndCopyVideos() {
    // Логируем, что процесс начался
    console.log('Начинаем обработку видео файлов...');

    const videoFiles = await globby(['**/*.mp4'], { cwd: srcDir, absolute: true });

    console.log('Найдено видео файлов: ', videoFiles.length);  // Логируем количество найденных видео

    for (const file of videoFiles) {
        await processVideoFile(file);  // Обрабатываем каждый файл
    }
}

// Задача для отслеживания изменений в видео
function watchVideos() {
    console.log('Наблюдение за изменениями видео файлов...');
    gulp.watch('src/video/**/*.mp4', compressAndCopyVideos);  // Наблюдаем за видеофайлами
}

// Экспортируем задачу
export { compressAndCopyVideos, watchVideos };
