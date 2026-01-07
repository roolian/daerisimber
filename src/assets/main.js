import "./styles/main.css";
import.meta.glob("../blocks/**/*.css", { eager: true });


import Alpine from "alpinejs";

/* 
import SwiperModule from "./js/SwiperModule/SwiperModule";
import AjaxFactory from "./js/AjaxFactoryModule/AjaxFactoryModule";
import ScrollTo from "./js/ScrollToModule/ScrollToModule";
import Paralax from "./js/ParalaxModule/ParalaxModule"; 
*/

window.Alpine = Alpine;

/* 
SwiperModule.init();
AjaxFactory.init();
ScrollTo.init();
Paralax.init();
 */


import.meta.glob("../blocks/**/*.js", { eager: true });

Alpine.start();
