// import Swiper JS
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
// import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const SwiperModule = {
    init: () => {
        if (window.acf) {
            window.acf.addAction("render_block_preview", (block) => {
                SwiperModule.initDom();
            });
        }
        SwiperModule.initDom();
    },
    initDom: () => {
        if (document.querySelectorAll(".swiper").length) {

            document.querySelectorAll(".swiper.autoplay").forEach((swiper) => {
                SwiperModule.customAutoPlay(swiper);
            });

            document.querySelectorAll(".swiper").forEach((swiper) => {
                const twigOptions = JSON.parse(swiper.dataset.swiperOptions || "{}");
                const options = {
                    ...{
                        modules: [Navigation, Pagination, Autoplay, FreeMode],
                        slidesPerView: 1,
                        spaceBetween: 32,
                        loop: false,
                        pagination: {
                            el: ".swiper-pagination",
                            type: "progressbar",
                        },
                        navigation: {
                            nextEl: ".swiper-next",
                            prevEl: ".swiper-prev",
                        },
                        on: {
                            init: (sInstance) => {
                                swiper.classList.remove("front:invisible");
                                swiper.dispatchEvent(
                                    new CustomEvent("swiper:initialized", {
                                        detail: { swiper: sInstance },
                                    })
                                );
                            },
                        },
                    },
                    ...twigOptions,
                };
                const swiperInstance = new Swiper(swiper, options);

                //emit custom event on dom element
            });
        }
    },
    customAutoPlay: (swiperElmt) => {
        swiperElmt.addEventListener("swiper:initialized", (event) => {
            let duration;
            let distanceRatio;
            let startTimer;
            let isPlaying = true;

            const swiperInstance = event.detail.swiper;

            const enter = (e) => {
                // pause animation on mouse enter
                e.stopPropagation();
                if (isPlaying) {
                    if (startTimer) clearTimeout(startTimer);
                    const index = swiperInstance.previousIndex > swiperInstance.activeIndex ? swiperInstance.previousIndex : swiperInstance.activeIndex;

                    // Stop slide at current translate.
                    swiperInstance.setTranslate(swiperInstance.getTranslate());

                    // Calculating the distance between current slide and next slide.
                    // 0.3 is equal to 30% distance to the next slide.
                    const unitStyles = window.getComputedStyle(swiperInstance.slides[1]);
                    distanceRatio = Math.abs(swiperInstance.getTranslate() + index * (swiperInstance.slides[1].offsetWidth + parseInt(unitStyles.marginRight))) / swiperInstance.slides[1].offsetWidth;

                    // The duration that playing to the next slide
                    duration = swiperInstance.params.speed * distanceRatio;
                    isPlaying = false;
                    swiperInstance.autoplay.stop();
                }
            };

            const leave = () => {
                console.log("leave", isPlaying, duration, distanceRatio);
                // pause animation on mouse leave
                if (!isPlaying) {
                    const index = swiperInstance.previousIndex > swiperInstance.activeIndex ? swiperInstance.previousIndex : swiperInstance.activeIndex;

                    swiperInstance.slideTo(index, duration);

                    if (startTimer) clearTimeout(startTimer);

                    startTimer = setTimeout(() => {
                        swiperInstance.autoplay.start();
                    }, duration);
                    isPlaying = true;
                }
            };

            swiperElmt.addEventListener("mouseenter", enter);
            swiperElmt.addEventListener("mouseleave", leave);

            
        });
    },
};

export default SwiperModule;
