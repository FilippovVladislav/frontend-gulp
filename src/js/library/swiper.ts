import Swiper from 'swiper';

window.Swiper = Swiper;



export function initSwiper() {
    // Общие параметры для всех слайдеров
    const commonOptions = {
        loop: true,
        autoplay: {
            delay: 3000,
        },
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    };

    // Инициализация всех слайдеров с базовыми параметрами
    const sliders = document.querySelectorAll('.swiper-container');

    sliders.forEach((slider) => {
        // Проверка типа элемента и приведение к HTMLElement
        if (slider instanceof HTMLElement) {
            // Уникальные параметры для каждого слайдера через класс
            let uniqueOptions = { ...commonOptions };

            if (slider.classList.contains('slider-1')) {
                // Настройки для slider-1
                uniqueOptions = {
                    ...uniqueOptions,
                };
            }

            // Инициализируем слайдер с уникальными параметрами
            new Swiper(slider, uniqueOptions);
        }
    });
}

