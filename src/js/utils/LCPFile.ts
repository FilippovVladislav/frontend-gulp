// Функция для добавления предзагрузки для LCP элемента
export function addPreloadToLCP(): void {
    const lcpElements: (HTMLImageElement | HTMLVideoElement | HTMLPictureElement | HTMLElement)[] = [
        ...document.querySelectorAll('img, video, picture, .lcp-text')  // Добавляем изображения, видео, picture и текстовые элементы с классом .lcp-text
    ];

    let lcpElement: HTMLElement | null = null;

    // Ищем первый видимый элемент на странице (LCP)
    lcpElements.forEach((element) => {
        const rect = element.getBoundingClientRect();

        // Учитываем только те элементы, которые видны в области экрана
        if (rect.top >= 0 && rect.top < window.innerHeight) {
            // Для изображений и видео: проверяем по высоте
            if (element instanceof HTMLImageElement || element instanceof HTMLVideoElement) {
                if (!lcpElement || rect.height > lcpElement.clientHeight) {
                    lcpElement = element;
                }
            }

            // Для элемента <picture> мы будем учитывать самые большие изображения в источниках
            if (element instanceof HTMLPictureElement) {
                const sources = element.querySelectorAll('source');
                sources.forEach((source) => {
                    const srcset = source instanceof HTMLSourceElement ? source.dataset.srcset || source.srcset : '';
                    const type = source.type;

                    if (srcset) {
                        const image = new Image();
                        image.srcset = srcset;
                        image.onload = () => {
                            const width = image.width;
                            const height = image.height;
                            if (!lcpElement || (height * width > lcpElement.clientWidth * lcpElement.clientHeight)) {
                                lcpElement = element;
                            }
                        };

                        // Если это webp, добавляем предзагрузку с типом image/webp
                        if (type === 'image/webp') {
                            const preloadLink = document.createElement('link');
                            preloadLink.rel = 'preload';
                            preloadLink.as = 'image';
                            preloadLink.href = srcset;
                            preloadLink.type = 'image/webp';
                            document.head.appendChild(preloadLink);
                        }
                    }
                });
            }

            // Для текстовых элементов (например, заголовков или абзацев) можно рассматривать их размер
            if (element.classList.contains('lcp-text')) {
                const height = rect.height;
                if (!lcpElement || height > lcpElement.clientHeight) {
                    lcpElement = element;
                }
            }
        }
    });

    // Если LCP элемент найден, добавляем его в предзагрузку
    if (lcpElement) {
        let preloadLink: HTMLLinkElement | null = null;

        // Для изображений
        if (lcpElement instanceof HTMLImageElement) {
            preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = lcpElement.src;
        } else if (lcpElement instanceof HTMLVideoElement) {
            // Для видео, предзагружаем его источник
            const videoSource = lcpElement.querySelector('source');
            if (videoSource instanceof HTMLSourceElement) {
                preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'video';
                preloadLink.href = videoSource.src;
            }
        } else if (lcpElement instanceof HTMLPictureElement) {
            // Для picture, предзагружаем источник
            const pictureSource = lcpElement.querySelector('source');
            if (pictureSource instanceof HTMLSourceElement) {
                preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = pictureSource.srcset || pictureSource.dataset.srcset;

                // Если это webp, добавляем дополнительную предзагрузку
                if (pictureSource.type === 'image/webp') {
                    preloadLink.type = 'image/webp';
                }
            }
        } else if (lcpElement.classList.contains('lcp-text')) {
            // Для текстовых элементов, возможно, не нужно добавлять в preload, но можно обработать по-своему
            console.log("LCP элемент - текст:", lcpElement);
        }

        // Если link был создан, добавляем его в head для предзагрузки
        if (preloadLink) {
            document.head.appendChild(preloadLink);
        }
    }
}
