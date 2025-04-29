export function initAccordion() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach((accordion) => {
        const items = accordion.querySelectorAll<HTMLElement>('.accordion__item');

        items.forEach((item) => {
            const head = item.querySelector<HTMLButtonElement>('.accordion__head');
            const content = item.querySelector<HTMLElement>('.accordion__content');

            if (!head || !content) return;

            head.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                if (isOpen) {
                    // Закрытие
                    content.style.maxHeight = content.scrollHeight + 'px'; // Чтобы "поймать" высоту перед закрытием
                    requestAnimationFrame(() => {
                        content.style.maxHeight = '0px';
                    });
                    item.classList.remove('open');
                } else {
                    // Открытие
                    content.style.maxHeight = content.scrollHeight + 'px';
                    item.classList.add('open');

                    // Удалим max-height после окончания анимации, чтобы контент адаптировался
                    const onTransitionEnd = () => {
                        content.style.maxHeight = 'none';
                        content.removeEventListener('transitionend', onTransitionEnd);
                    };
                    content.addEventListener('transitionend', onTransitionEnd);
                }
            });
        });
    });
}