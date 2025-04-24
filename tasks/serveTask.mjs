import browserSync from 'browser-sync';

const server = browserSync.create();

// Задача запуска сервера
export function serveTask(done) {
    server.init({
        server: {
            baseDir: 'dist',
        },
        notify: false,
        open: false,
    });
    done(); // вызываем колбэк — обязательно
}

// Задача перезагрузки браузера
export async function reloadBrowser() {
    return new Promise((resolve) => {
        server.reload();
        resolve();
    });
}