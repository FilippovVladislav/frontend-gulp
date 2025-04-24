import tippy from 'tippy.js';

export function initTooltip() {
    // Инициализация подсказок на элементах с атрибутом `data-tippy-content`
    tippy('[data-tippy-content]', {
        placement: 'top', // Местоположение подсказки (можно 'top', 'bottom', 'left', 'right')
        arrow: true, // Добавить стрелку
        animation: 'scale', // Анимация появления подсказки
        theme: 'light-border', // Тема подсказки (можно изменить на 'dark', 'light', и т.д.)
    });
}