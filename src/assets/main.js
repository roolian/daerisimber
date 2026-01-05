import "./styles/main.css";
import.meta.glob("../blocks/**/*.css", { eager: true });

import theme from "./../../theme.json";

import Alpine from "alpinejs";
import SwiperModule from "./js/SwiperModule/SwiperModule";
import AjaxFactory from "./js/AjaxFactoryModule/AjaxFactoryModule";
import ScrollTo from "./js/ScrollToModule/ScrollToModule";
import Paralax from "./js/ParalaxModule/ParalaxModule";

window.Alpine = Alpine;
/* 
SwiperModule.init();
AjaxFactory.init();
ScrollTo.init();
Paralax.init();
 */

if (window.acf) {
    window.acf.add_filter("color_picker_args", (args, field) => {
        args.palettes = theme.settings.color.palette.map((color) => color.color);
        return args;
    });
}

import.meta.glob("../blocks/**/*.js", { eager: true });

Alpine.start();
