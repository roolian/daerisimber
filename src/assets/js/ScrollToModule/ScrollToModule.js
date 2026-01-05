import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollTo module - Handles smooth scrolling to elements and sticky navigation animations
 */
const ScrollTo = {
    /**
     * Check if there are any scroll-to elements on the page
     * @returns {boolean} True if scroll-to elements exist
     */
    activate: function () {
        return true;
    },

    /**
     * Initialize the scroll-to functionality and sticky navigation animations
     */
    init: function () {
        if (!this.activate()) return;

        this.initScrollToElements();
        this.initBackToTopButton();
        this.initMainStickyNav();
    },

    initScrollToElements: function () {
        document.querySelectorAll('[href^="#"]').forEach((element) => {
            element.addEventListener("click", function (e) {
                e.preventDefault();
                const page = this.getAttribute("href");
                const decal = this.dataset.y ? parseInt(this.dataset.y) : 100;

                const targetElement = document.querySelector(page);

                if (targetElement) {
                    const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - decal;

                    // Smooth scroll animation
                    window.scrollTo({
                        top: targetTop,
                        behavior: "smooth",
                    });
                }
                return false;
            });
        });
    },

    initBackToTopButton: function () {
        const backToTopElement = document.getElementById("back-to-top");
        const mainFooter = document.getElementById("main-footer");
        const backToTopContainer = document.getElementById("back-to-top-container");

        if (!backToTopElement || !backToTopContainer || !mainFooter) {
            console.warn("ScrollToModule: missing elements with id 'back-to-top', 'main-footer', or 'back-to-top-container'");
            return;
        }

        backToTopElement.addEventListener("click", function (e) {
            e.preventDefault();
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });

        // Back to top button fade-in animation
        gsap.fromTo(
            "#back-to-top",
            {
                autoAlpha: 0,
                y: 20,
            },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    start: 100,
                    end: 200,
                    scrub: 1,
                    //markers: true,
                },
            }
        );

        ScrollTrigger.create({
            trigger: "#main-footer",
            start: "top+=32 bottom-=32",
            end: "top+=32 bottom-=32",
            //markers: true,
            onEnter: () => {
                const footerHeight = mainFooter.offsetHeight;
                const buttonHeight = backToTopElement.offsetHeight;

                backToTopContainer.style.position = "absolute";
                backToTopContainer.style.bottom = footerHeight - buttonHeight / 2 + "px";
            },
            onLeaveBack: () => {
                backToTopContainer.style.position = "fixed";
                backToTopContainer.style.bottom = "";
            },
        });
    },

    

    /**
     * Initialize main sticky navigation animation and synchronization
     */
    initMainStickyNav: function () {
        const mainNavSticky = document.getElementById("main-nav-sticky");
        if (!mainNavSticky) return;

        const anim = this.createMainNavAnimation();
        const { faqNavAnimSynchroMain, pricingNavAnimSynchroMain } = this.createSynchronizedAnimations(mainNavSticky);

        this.handleStickyElements();
        this.setupMainNavScrollTrigger(anim, faqNavAnimSynchroMain, pricingNavAnimSynchroMain);
    },

    /**
     * Create main navigation animation
     * @returns {gsap.core.Timeline} The GSAP animation timeline
     */
    createMainNavAnimation: function () {
        return gsap.fromTo(
            "#main-nav-sticky",
            {
                autoAlpha: 0,
                y: "-100%",
            },
            {
                autoAlpha: 1,
                y: 0,
                paused: true,
                reversed: true,
                duration: 0.3,
            }
        );
    },

    /**
     * Create synchronized animations for FAQ and pricing navs
     * @param {HTMLElement} mainNavSticky - The main navigation sticky element
     * @returns {Object} Object containing synchronized animations
     */
    createSynchronizedAnimations: function (mainNavSticky) {
        const faqNavSticky = document.getElementById("faq-nav-sticky");
        const pricingElements = document.querySelectorAll(".pricing");

        let faqNavAnimSynchroMain = false;
        if (faqNavSticky) {
            faqNavAnimSynchroMain = gsap.to("#faq-nav-sticky", {
                top: () => mainNavSticky.offsetHeight,
                paused: true,
                reversed: true,
                duration: 0.3,
                delay: 0,
            });
        }

        let pricingNavAnimSynchroMain = false;
        if (pricingElements.length > 0) {
            pricingNavAnimSynchroMain = gsap.to(".pricing .to-stick", {
                top: "+=" + mainNavSticky.offsetHeight,
                paused: true,
                reversed: true,
                duration: 0.3,
                delay: 0,
            });
        }

        return { faqNavAnimSynchroMain, pricingNavAnimSynchroMain };
    },

    /**
     * Handle sticky elements positioning
     */
    handleStickyElements: function () {
        document.querySelectorAll(".to-stick").forEach((element, index) => {
            //const observer = new IntersectionObserver(([e]) => e.target.classList.toggle("sticked", e.intersectionRatio < 0.99  ), { threshold: [1] });

            //observer.observe(element);

            //console.log(element.offsetTop);

            element.classList.toggle("sticked", element.offsetTop > 0);
        });
    },

    /**
     * Setup scroll trigger for main navigation with velocity-based show/hide
     * @param {gsap.core.Timeline} anim - Main navigation animation
     * @param {gsap.core.Timeline|boolean} faqNavAnimSynchroMain - FAQ nav sync animation
     * @param {gsap.core.Timeline|boolean} pricingNavAnimSynchroMain - Pricing nav sync animation
     */
    setupMainNavScrollTrigger: function (anim, faqNavAnimSynchroMain, pricingNavAnimSynchroMain) {
        ScrollTrigger.create({
            trigger: "body",
            //markers: true,
            //onEnter: () => anim.play(),
            onUpdate: (self) => {
                //console.log(self.scroller.scrollY);
                //console.log(self.getVelocity());
                if (self.scroller.scrollY > 400) {
                    if (self.direction === -1) {
                        if (Math.abs(self.getVelocity()) > 500) {
                            anim.play();
                            faqNavAnimSynchroMain && faqNavAnimSynchroMain.play();
                            pricingNavAnimSynchroMain && pricingNavAnimSynchroMain.play();
                        }
                    } else {
                        anim.reverse();
                        faqNavAnimSynchroMain && faqNavAnimSynchroMain.reverse();
                        pricingNavAnimSynchroMain && pricingNavAnimSynchroMain.reverse();
                    }
                } else {
                    anim.reverse();
                    faqNavAnimSynchroMain && faqNavAnimSynchroMain.reverse();
                    pricingNavAnimSynchroMain && pricingNavAnimSynchroMain.reverse();
                }
            },
            //onLeave: () => anim.reverse(),
            //onLeaveBack: () => anim.reverse(),
        });
    },

};


export default ScrollTo;
