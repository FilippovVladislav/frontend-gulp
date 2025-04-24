import { Fancybox } from "@fancyapps/ui";

export function initFancybox() {
    // Инициализация Fancybox
    Fancybox.bind("[data-fancybox='gallery']", {
        // Здесь можно добавить настройки Fancybox, если нужно
        infinite: true,
        loop: true,
        buttons: ["zoom", "close"], // Кнопки в интерфейсе
    });
}