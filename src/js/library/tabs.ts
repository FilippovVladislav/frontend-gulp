// Функция для инициализации вкладок на странице
export function initializeTabs(): void {
    // Находим все контейнеры с вкладками
    const tabsContainers = document.querySelectorAll('.tabs');

    // Проходим по каждому контейнеру вкладок
    tabsContainers.forEach((tabs: Element) => {
        const tabsNav = tabs.querySelector('.tabs__nav') as HTMLElement;
        const tabsItems = tabs.querySelectorAll('.tabs__tab') as NodeListOf<HTMLElement>;
        const tabsPanels = tabs.querySelectorAll('.tabs__panel') as NodeListOf<HTMLElement>;

        tabsItems.forEach((tab: HTMLElement) => {
            tab.addEventListener('click', () => {
                const targetTab = (tab as HTMLElement).dataset.tab;

                // Убираем активный класс у всех вкладок и панелей
                tabsItems.forEach(item => item.classList.remove('active'));
                tabsPanels.forEach(panel => panel.classList.remove('active'));

                // Добавляем активный класс к текущей вкладке и контенту
                tab.classList.add('active');
                const targetPanel = tabs.querySelector(`#${targetTab}`) as HTMLElement;
                targetPanel.classList.add('active');
            });
        });

        // Устанавливаем активную вкладку по умолчанию (первую)
        if (tabsItems.length > 0) {
            tabsItems[0].classList.add('active');
            tabsPanels[0].classList.add('active');
        }
    });
}
