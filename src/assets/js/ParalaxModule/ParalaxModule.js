import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Paralax module - Handles parallax animations using GSAP and ScrollTrigger
 * This module initializes parallax effects on elements with the class "paralax"
 * and allows for configuration via data attributes on the elements.
 * HTML structure should include elements with the class "paralax-section"
 * Example usage:
 * <div class="paralax-section" data-st-start="top top" data-st-end="bottom top" data-st-scrub="1" data-st-pin="true">
 *   <div class="paralax" ></div>
 * </div>
 */
let Paralax = {
    /**
     * Check if there are any parallax elements on the page
     * @returns {boolean} True if parallax elements exist
     */
    activate: function () {
        return document.querySelectorAll("[data-st-movements]").length > 0 && document.querySelectorAll("[data-st-section]").length > 0 && document.querySelectorAll(".editor-visual-editor").length <= 0;
    },

    /**
     * Initialize parallax animations for all parallax sections
     */
    init: function () {
        if (!this.activate()) return;

        // Process each parallax section
        gsap.utils.toArray("[data-st-section]").forEach((layer, index) => {
            this.setupParallaxSection(layer);
        });

        // Process each autoconfig parallax sections
        gsap.utils.toArray(".st-section").forEach((layer, index) => {
            this.setupAutoSection(layer);
        });
    },

    /**
     * Setup configuration for auto sections
     * @param {HTMLElement} layer - The section element to configure
     * This function sets up a default ScrollTrigger configuration for sections
     * that do not have specific data attributes for parallax effects.
     * It creates a ScrollTrigger timeline with default settings.
     */
    setupAutoSection: function (layer) {
        const sectionId = layer.id || `section-${Math.random().toString(36).substr(2, 9)}`;
        // Default configuration for auto sections
        const sectionConfig = {
            start: "top center+=20%",
            end: "bottom center+=20%",
            scrub: 3,
            pin: false,
            //markers: true,
            id: sectionId,
        };
        const timeline = this.createSectionTimeline(layer, sectionConfig);
        const elementsToAnimate = [
            {
                selector: "h2",
                movements: {
                    y: "100",
                    x: "0",
                    duration: 1,
                    ease: "power2.out",
                },
            },
            {
                selector: ".subtitle, .pretitle",
                movements: {
                    y: "-50",
                    x: "0",
                    autoAlpha: 0,
                    duration: 1,
                    ease: "power2.out",
                },
            },
        ];

        elementsToAnimate.forEach(({ selector, movements }) => {
            const elements = layer.querySelectorAll(selector);
            elements.forEach((element) => {
                timeline.from(element, movements);
            });
        });
    },

    /**
     * Setup parallax animation for a specific section
     * @param {HTMLElement} layer - The parallax section element
     */
    setupParallaxSection: function (layer) {
        const sectionConfig = this.getSectionConfiguration(layer);
        const timeline = this.createSectionTimeline(layer, sectionConfig);

        this.processParallaxElements(layer, timeline);
    },

    /**
     * Get configuration for a parallax section
     * @param {HTMLElement} layer - The parallax section element
     * @returns {Object} Configuration object for the section
     */
    getSectionConfiguration: function (layer) {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = layer.getBoundingClientRect();
        const offset = elemRect.top - bodyRect.top;

        let scrub = 1;
        if (layer.dataset.stScrub) {
            if (layer.dataset.stScrub === "false") {
                scrub = false;
            } else {
                scrub = parseFloat(layer.dataset.stScrub);
            }
        }

        const config = {
            start: layer.dataset.stStart || (offset > window.innerHeight ? "top bottom-=100" : "top top"),
            end: layer.dataset.stEnd || (offset > window.innerHeight ? "bottom center" : "bottom top"),
            markers: layer.dataset.stMarkers || false,
            scrub,
            id: layer.id,
        };

        //pin
        if (layer.dataset.stPin) {
            config.pin = layer.dataset.stPin === "true" ? true : layer.dataset.stPin;
        }

        if (layer.dataset.stToggleActions) {
            const actions = layer.dataset.stToggleActions.split(" ");
            if (actions.length === 4) {
                config.toggleActions = layer.dataset.stToggleActions;
            } else {
                console.warn("Invalid toggleActions format. Expected 4 actions.");
            }
        }

        return config;
    },

    /**
     * Create GSAP timeline for a parallax section
     * @param {HTMLElement} layer - The parallax section element
     * @param {Object} config - Configuration object for the section
     * @returns {gsap.core.Timeline} The created timeline
     */
    createSectionTimeline: function (layer, config) {
        return gsap.timeline({
            scrollTrigger: {
                ...{ trigger: layer },
                ...config,
            },
        });
    },

    /**
     * Process all parallax elements within a section
     * @param {HTMLElement} layer - The parallax section element
     * @param {gsap.core.Timeline} timeline - The timeline to add animations to
     */
    processParallaxElements: function (layer, timeline) {
        // Get all parallax elements within this section
        const parallaxElements = layer.querySelectorAll("[data-st-movements]");

        parallaxElements.forEach((element) => {
            this.addElementAnimation(element, timeline, layer);
        });
    },

    /**
     * Add animation for a specific parallax element
     * @param {HTMLElement} element - The parallax element
     * @param {gsap.core.Timeline} timeline - The timeline to add animation to
     * @param {HTMLElement} section - The parent section element
     */
    addElementAnimation: function (element, timeline, section) {
        const elementConfig = this.getElementConfiguration(element, section);

        if (!elementConfig.shouldAnimate) return;

        const movements = this.buildMovementsObject(element, elementConfig);

        // Add animation to timeline based on function type
        switch (elementConfig.animationFunction) {
            case "from":
                timeline.from(element, movements, elementConfig.timelinePosition);
                break;
            case "to":
                timeline.to(element, movements, elementConfig.timelinePosition);
                break;
            default:
                timeline.from(element, movements, elementConfig.timelinePosition);
                break;
        }
    },

    /**
     * Get configuration for a parallax element
     * @param {HTMLElement} element - The parallax element
     * @param {HTMLElement} section - The parent section element
     * @returns {Object} Configuration object for the element
     */
    getElementConfiguration: function (element, section) {
        const sectionId = element.dataset.stId || false;
        const ease = element.dataset.stEase || "linear";
        const animationFunction = element.dataset.stFunction || "from";
        const timelinePosition = element.dataset.stTimelinePosition || 0;

        // Check if element should be animated (no section ID specified or matches current section)
        const shouldAnimate = !sectionId || sectionId === section.id;
        return {
            sectionId,
            ease,
            animationFunction,
            shouldAnimate,
            timelinePosition,
        };
    },

    /**
     * Build the movements object for GSAP animation
     * @param {HTMLElement} element - The parallax element
     * @param {Object} config - Element configuration
     * @returns {Object} Movements object for GSAP
     */
    buildMovementsObject: function (element, config) {
        const movements = {
            ease: config.ease,
        };

        // Parse movement data from dataset
        if (element.dataset.stMovements) {
            try {
                const dataMovements = JSON.parse(element.dataset.stMovements);

                // Copy all movement properties
                for (const key in dataMovements) {
                    if (dataMovements.hasOwnProperty(key)) {
                        const value = dataMovements[key];

                        // Check if value contains responsive breakpoints
                        if (typeof value === "string" && this.hasResponsiveValue(value)) {
                            movements[key] = this.createResponsiveValue(value);
                        } else {
                            movements[key] = value;
                        }
                    }
                }
            } catch (error) {
                console.error("Error parsing parallax movements data:", error);
            }
        }

        return movements;
    },

    /**
     * Check if a value contains responsive breakpoints
     * @param {string} value - The value to check
     * @returns {boolean} True if value contains responsive syntax
     */
    hasResponsiveValue: function (value) {
        return /\b(sm|md|lg|xl):/.test(value);
    },

    /**
     * Create a GSAP function-based value for responsive breakpoints
     * @param {string} value - The responsive value string (e.g., "100 lg:200")
     * @returns {Function} GSAP function that returns the appropriate value based on screen size
     */
    createResponsiveValue: function (value) {
        const breakpoints = this.getBreakpoints();

        // Return GSAP function-based value with index, target, targets parameters
        return (index, target, targets) => {
            // Check if we already parsed this value for this target
            if (!target._responsiveValues) {
                target._responsiveValues = {};
            }

            if (!target._responsiveValues[value]) {
                target._responsiveValues[value] = this.parseResponsiveValue(value);
            }

            const responsiveValues = target._responsiveValues[value];
            const screenWidth = window.innerWidth;

            // Find the appropriate value based on current screen width
            let currentValue = responsiveValues.default;

            // Check breakpoints in order (smallest to largest)
            for (const [breakpoint, minWidth] of Object.entries(breakpoints)) {
                if (screenWidth >= minWidth && responsiveValues[breakpoint] !== undefined) {
                    currentValue = responsiveValues[breakpoint];
                }
            }

            return currentValue;
        };
    },

    /**
     * Get Tailwind CSS breakpoints
     * @returns {Object} Object containing breakpoint names and their pixel values
     */
    getBreakpoints: function () {
        return {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        };
    },

    /**
     * Parse a responsive value string into an object
     * @param {string} value - The responsive value string (e.g., "100 lg:200 xl:300")
     * @returns {Object} Object containing default and breakpoint-specific values
     */
    parseResponsiveValue: function (value) {
        const parts = value.trim().split(/\s+/);
        const result = {};

        for (const part of parts) {
            if (part.includes(":")) {
                // Breakpoint-specific value (e.g., "lg:200")
                const [breakpoint, val] = part.split(":");
                result[breakpoint] = this.parseNumericValue(val);
            } else {
                // Default value
                result.default = this.parseNumericValue(part);
            }
        }

        return result;
    },

    /**
     * Parse numeric value, handling units and string numbers
     * @param {string} value - The value to parse
     * @returns {string|number} Parsed value
     */
    parseNumericValue: function (value) {
        // If it's a pure number, convert to number
        if (/^-?\d+(\.\d+)?$/.test(value)) {
            return parseFloat(value);
        }

        // If it has units (px, %, em, etc.) or other string values, keep as string
        return value;
    },
};

export default Paralax;
