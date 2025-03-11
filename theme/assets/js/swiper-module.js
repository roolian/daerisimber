// import Swiper JS
import Swiper from "swiper";
// import Swiper styles
import "swiper/css";

if (window.acf) {
    window.acf.addAction("render_block_preview", (block) => {
        initSwiper();
    });
}

const initSwiper = () => {
    if (document.querySelectorAll(".swiper").length) {
        document.querySelectorAll(".swiper").forEach((swiper) => {
            const twigOptions = JSON.parse(swiper.dataset.swiperOptions);
            const options = {
                ...{ slidesPerView: 1, spaceBetween: 32, loop: true },
                ...twigOptions,
            };
            const swiperInstance = new Swiper(swiper, options);
        });
    }
};

initSwiper();
