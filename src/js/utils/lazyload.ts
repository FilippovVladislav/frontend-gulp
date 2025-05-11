export function lazyLoadMedia() {
    const lazyImages = document.querySelectorAll<HTMLImageElement>("img.lazy-img");
    const lazySources = document.querySelectorAll<HTMLSourceElement>("source[data-srcset]");
    const lazyVideos = document.querySelectorAll<HTMLVideoElement>("video.lazy-video");
    const lazyBackgrounds = document.querySelectorAll<HTMLElement>("[data-bg]"); // Добавляем поиск элементов с data-bg
    const lcpElement = document.querySelector<HTMLElement>('.lcp-element');  // Добавляем поиск LCP-элемента

    // Функция для выбора правильного изображения из массива
    const getBgImage = (dataBg: string) => {
        const bgImages = dataBg.split(',').map(image => image.trim());  // Разбиваем строку на массив путей
        const windowWidth = window.innerWidth;
        // Если ширина экрана меньше 991px, выбираем мобильное изображение
        return windowWidth < 991 ? bgImages[1] : bgImages[0];
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Обработка изображений
                    const picture = entry.target.closest("picture");
                    if (picture) {
                        const img = picture.querySelector("img.lazy-img") as HTMLImageElement;
                        const sources = picture.querySelectorAll("source[data-srcset]");

                        sources.forEach((source) => {
                            const htmlSource = source as HTMLSourceElement;
                            htmlSource.srcset = htmlSource.dataset.srcset || "";
                            htmlSource.removeAttribute("data-srcset");
                        });

                        if (img?.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute("data-src");
                            img.classList.remove("lazy-img");
                            img.onload = () => {
                                img.style.opacity = '1';  // Устанавливаем opacity после загрузки
                            };
                        }

                        if (img) observer.unobserve(img);
                    }

                    // Обработка видео
                    const video = entry.target as HTMLVideoElement;
                    if (video && video.dataset.src) {
                        const sources = video.querySelectorAll("source[data-src]");
                        sources.forEach(source => {
                            source.src = source.dataset.src || "";
                            source.removeAttribute("data-src");
                        });

                        video.load();  // Перезагружаем видео для загрузки источников

                        video.src = video.dataset.src;
                        video.removeAttribute("data-src");
                        video.classList.remove("lazy-video");
                        observer.unobserve(video);
                    }

                    // Обработка фонов (data-bg)
                    const bgElement = entry.target as HTMLElement;
                    if (bgElement && bgElement.dataset.bg) {
                        const bgImage = getBgImage(bgElement.dataset.bg);  // Получаем правильное изображение для фона
                        bgElement.style.backgroundImage = `url(${bgImage})`;
                        bgElement.removeAttribute("data-bg");
                        observer.unobserve(bgElement);
                    }
                }
            });
        });

        // Наблюдение за изображениями
        lazyImages.forEach(img => observer.observe(img));

        // Наблюдение за видео
        lazyVideos.forEach(video => observer.observe(video));

        // Наблюдение за фоновыми изображениями
        lazyBackgrounds.forEach(el => observer.observe(el));

        // Предзагрузка LCP элемента, если он найден
        if (lcpElement && lcpElement.tagName === 'IMG') {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = (lcpElement as HTMLImageElement).src;
            document.head.appendChild(preloadLink);
        } else if (lcpElement && lcpElement.tagName === 'VIDEO') {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'video';
            preloadLink.href = (lcpElement as HTMLVideoElement).src;
            document.head.appendChild(preloadLink);
        }

    } else {
        // Fallback для старых браузеров
        lazyImages.forEach(img => {
            img.src = img.dataset.src || "";
            img.removeAttribute("data-src");
            img.classList.remove("lazy-img");
        });

        lazySources.forEach((source) => {
            const htmlSource = source as HTMLSourceElement;
            htmlSource.srcset = htmlSource.dataset.srcset || "";
            htmlSource.removeAttribute("data-srcset");
        });

        lazyVideos.forEach(video => {
            video.src = video.dataset.src || "";
            video.removeAttribute("data-src");
            video.classList.remove("lazy-video");

            const sources = video.querySelectorAll("source[data-src]");
            sources.forEach(source => {
                source.src = source.dataset.src || "";
                source.removeAttribute("data-src");
            });

            video.load();
        });

        // Предзагрузка LCP элемента для старых браузеров
        if (lcpElement && lcpElement.tagName === 'IMG') {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = (lcpElement as HTMLImageElement).src;
            document.head.appendChild(preloadLink);
        } else if (lcpElement && lcpElement.tagName === 'VIDEO') {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'video';
            preloadLink.href = (lcpElement as HTMLVideoElement).src;
            document.head.appendChild(preloadLink);
        }
    }
}
