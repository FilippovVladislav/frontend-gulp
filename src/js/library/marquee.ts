export function initMarquee() {
    const marquee = document.querySelector('.marquee') as HTMLElement;

    // Клонируем все элементы внутри .marquee, чтобы создать эффект бесконечности
    const items = marquee.children;
    for (let i = 0; i < items.length; i++) {
        const clone = items[i].cloneNode(true);
        marquee.appendChild(clone); // Добавляем дубликаты в конец
    }
}
