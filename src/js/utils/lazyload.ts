export function lazyLoadMedia() {
    const lazyImages = document.querySelectorAll<HTMLImageElement>("img.lazy-img");
    const lazySources = document.querySelectorAll<HTMLSourceElement>("source[data-srcset]");
    const lazyVideos = document.querySelectorAll<HTMLVideoElement>("video.lazy-video");
    const lcpElement = document.querySelector<HTMLElement>('.lcp-element');  // Добавляем поиск LCP-элемента

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const picture = entry.target.closest("picture");
                    if (picture) {
                        const img = picture.querySelector("img.lazy-img") as HTMLImageElement;
                        const sources = picture.querySelectorAll("source[data-srcset]");

                        sources.forEach((source) => {
                            // Приводим source к типу HTMLSourceElement
                            const htmlSource = source as HTMLSourceElement;
                            htmlSource.srcset = htmlSource.dataset.srcset || "";
                            htmlSource.removeAttribute("data-srcset");
                        });

                        if (img?.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute("data-src");
                            img.classList.remove("lazy-img");
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
                }
            });
        });

        // Наблюдение за изображениями
        lazyImages.forEach(img => observer.observe(img));

        // Наблюдение за видео
        lazyVideos.forEach(video => observer.observe(video));

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
            // Приводим source к типу HTMLSourceElement
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
