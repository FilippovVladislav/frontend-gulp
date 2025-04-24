import { Notyf } from 'notyf';

window.Notyf = Notyf;

const notification = new Notyf({
    duration: 3000,  // Продолжительность показа уведомления (в миллисекундах)
});

export function initNotyf() {
    // Инициализация Notyf
    const notyf = new Notyf();
    window.notyf = notyf; // Добавляем в глобальный объект
}