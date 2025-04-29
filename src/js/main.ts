import { lazyLoadMedia } from './utils/lazyload';
import { initSwiper } from './library/swiper';
import { initFancybox } from './library/fancybox';
import { initNotyf } from './library/notification';
import { initializeTabs } from './library/tabs';
import { initTooltip } from './library/typpy';
import { initMarquee } from './library/marquee';
import { modal } from './library/modal';
import { initAccordion } from './library/accordion';

document.addEventListener('DOMContentLoaded', () => {
    lazyLoadMedia();
    //initAccordion();
    // initSwiper();
    // initFancybox();
    // initNotyf();
    // initializeTabs();
    // initTooltip();
    // initMarquee();
    // modal;
});

