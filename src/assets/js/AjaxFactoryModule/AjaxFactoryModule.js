/**
 * AjaxFactory object - Initializes and manages AJAX actions throughout the website
 */
let AjaxFactory = {
    /**
     * Initialize the AjaxFactory
     * Finds all elements with data-ajax-action attribute and creates an AjaxAction instance for each
     */
    init: function () {
        let main = this;
        document.querySelectorAll("[data-ajax-action]").forEach(this.createAction.bind(this));
    },

    /**
     * Creates a new AjaxAction instance for an element
     * @param {HTMLElement} element - The DOM element to create an action for
     * @param {number} index - Index of the element in the collection
     */
    createAction: function (element, index) {
        new AjaxAction(element);
    },
};

/**
 * AjaxAction class - Handles individual AJAX interactions
 * This class manages form data collection, validation, submission and response handling
 */
class AjaxAction {
    /**
     * Default options for AJAX requests
     * @type {Object}
     */
    options = {
        type: "POST",
    };

    /**
     * Object to store form field values
     * @type {Object}
     */
    formValues = {};

    /**
     * Constructor - Sets up the AjaxAction instance
     * @param {HTMLElement} element - The DOM element to attach action to
     */
    constructor(element) {
        // Store the actual DOM element
        this.ajaxUrl = siteData.ajaxUrl; // Global variable defined in the theme

        // Store the actual DOM element
        this.element = element;

        // Get root element from data attribute or use the element itself
        // If rootElement is a string selector, resolve it to an actual DOM element
        this.rootElement = element.dataset.rootElement || element;
        if (typeof this.rootElement === "string") {
            this.rootElement = document.querySelector(this.rootElement);
        }


        // Get the AJAX action name from data attribute
        this.action = element.dataset.ajaxAction;

        // WIP - Loader configuration
        this.loader = element.dataset.ajaxLoader || false;

        // Animation effect to use when updating content
        this.animation = element.dataset.ajaxAnimation;

        // How to inject HTML response: append, prepend, or replace (default)
        this.injection = element.dataset.ajaxInjection;

        // Validation mode: client or server
        this.validation = element.dataset.ajaxValidation || "client";

        // Additional JSON data to be sent with the request
        this.jsonValues = element.dataset.ajaxJson ? JSON.parse(element.dataset.ajaxJson) : {};

        /**
         * Live validation options:
         * - false: No live validation (default)
         * - light: Validate required fields as user types
         * - medium: Validate required fields as user types and disable submit button until all fields are valid
         */
        this.liveValidation = element.dataset.ajaxLiveValidation || false;

        // Whether to display validation errors as they occur
        this.showErrors = element.dataset.ajaxShowErrors || false;

        // Element selector where to update/inject the AJAX response HTML
        this.targetElementSelector = element.dataset.ajaxUpdate || null;

        // Element selector to use as submit trigger (default is the form's submit event)
        this.triggerElementSelector = element.dataset.ajaxTrigger || "submit";

        // Form element selector related to this AJAX action
        this.formElementSelector = element.dataset.ajaxForm;

        // Find the target element where AJAX results will be injected
        this.targetElement = this.targetElementSelector == "this" ? this.element : this.rootElement ? this.rootElement.querySelector(this.targetElementSelector) : null;

        // Find the trigger element that will initiate the AJAX request
        this.triggerElement = this.triggerElementSelector == "this" ? this.element : this.rootElement ? this.rootElement.querySelector(this.triggerElementSelector) : null;

        // Find the form element containing the data to be sent
        this.formElement = this.formElementSelector == "this" ? this.element : this.rootElement ? this.rootElement.querySelector(this.formElementSelector) : null;

        // If the trigger is a form submit and form element exists
        if (this.triggerElementSelector == "submit" && this.formElement) {
            // Add submit event listener to the form
            this.formElement.addEventListener("submit", this.processRequest.bind(this));

            // If showErrors is enabled, add blur validation for all form fields
            if (this.showErrors) {
                this.formElement.querySelectorAll("input, select, textarea").forEach((element) => {
                    element.addEventListener("blur", () => this.validateInput(element));
                });
            }

            // If live validation is enabled
            if (this.liveValidation) {
                // Add input event listeners to form fields
                this.formElement.querySelectorAll("input,textarea,select").forEach((element) => {
                    element.addEventListener("input", this.liveValidateForm.bind(this));
                });

                // Listen for any change events on the entire form
                this.formElement.addEventListener("change", this.liveValidateForm.bind(this));

                // For medium validation level, disable submit button until validation passes
                if (this.liveValidation == "medium") {
                    const submitBtn = this.formElement.querySelector('input[type="submit"]');
                    if (submitBtn) submitBtn.disabled = true;
                }
            }

            // Add click handler to form reset button if it exists
            const resetBtn = this.formElement.querySelector(".form-reset");
            if (resetBtn) resetBtn.addEventListener("click", this.resetForm.bind(this));
        } else if (this.triggerElement) {
            // If trigger is not a form submit, use click event on trigger element
            this.triggerElement.addEventListener("click", this.processRequest.bind(this));
        }
    }

    /**
     * Reset the form to its initial state
     * @param {Event} e - The click event object
     */
    resetForm(e) {
        if (!this.formElement) return;

        // Reset native form fields
        this.formElement.reset();

        // Clear any tom-select dropdown elements
        this.formElement.querySelectorAll("select.tom-select").forEach((select) => {
            if (select.tomSelect) select.tomSelect.clear();
        });

        // Update form CSS classes
        this.formElement.classList.add("form-clear");
        this.formElement.classList.add("form-empty");
        this.formElement.classList.remove("form-filled");

        // Reset validation classes on all field containers
        this.formElement.querySelectorAll(".field").forEach((field) => {
            field.classList.remove("is-invalid");
            field.classList.remove("is-valid");
        });
    }

    /**
     * Set up input field events for erasable inputs
     * @param {Event} e - The event object
     */
    launchEvent(e) {
        // Setup events for focus and filled states on erasable inputs
        var inputs = document.querySelectorAll("input.input-erasable");
        for (var i = 0; i < inputs.length; i++) {
            // Add input event to manage filled state
            inputs[i].addEventListener("input", (e) => {
                e.target.parentNode.classList.remove("filled");
                if (e.target.value != "") {
                    e.target.parentNode.parentNode.classList.remove("is-invalid");
                    e.target.parentNode.classList.add("filled");
                }
            });

            // Add focus event
            inputs[i].addEventListener("focus", (e) => {
                e.target.parentNode.classList.add("focus");
            });
        }

        // Setup events for clear buttons
        var closeButtons = document.querySelectorAll(".close-button");
        for (var i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener("click", (e) => {
                // Clear the field value and update styling
                e.target.parentNode.parentNode.classList.remove("filled");
                e.target.parentNode.parentNode.querySelector("input.input-erasable").value = "";
                e.target.parentNode.parentNode.querySelector("input.input-erasable").focus();
            });
        }
    }

    /**
     * Validate form in real-time as user inputs data
     * @param {Event} e - The input or change event object
     */
    liveValidateForm(e) {
        if (!this.formElement) return;

        // Mark form as "dirty" (user has interacted with it)
        this.formElement.classList.add("form-dirty");

        // Add appropriate class based on whether any field is filled
        if (this.checkFormFill(this.formElement)) {
            this.formElement.classList.add("form-filled");
            this.formElement.classList.remove("form-empty");
        } else {
            this.formElement.classList.add("form-empty");
            this.formElement.classList.remove("form-filled");
        }

        // Validate all form fields
        let validation = this.validateForm(this.formElement, false);

        // For medium validation mode, enable/disable submit button based on validation result
        if (this.liveValidation == "medium") {
            const submitBtn = this.formElement.querySelector('input[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = !validation;
            }
        }
    }

    /**
     * Process the AJAX request
     * @param {Event} event - The submit or click event
     * @returns {boolean} False to prevent default form submission
     */
    processRequest(event) {
        // Prevent default form submission
        event.preventDefault();

        // Perform client-side validation if enabled
        if (this.validation == "client") {
            if (!this.validateForm(this.formElement)) {
                return false;
            }
        }
        // if(!this.checkFormCorrectData(this.formElement)) {
        //     return false;
        // }

        const that = this;

        // Convert form data to object
        this.formValues = this.formToObject(this.formElement);

        if (!this.formElement.hasAttribute("no-captcha")) {
            grecaptcha.enterprise.ready(() => {
                grecaptcha.enterprise.execute(googleRecaptchaKey, { action: "submit" }).then((token) => {
                    fetch(this.ajaxUrl, {
                        method: this.options.type,
                        body: {
                            action: this.action,
                            data: this.encodeFormData({
                                formValues: this.formValues,
                                jsonValues: this.jsonValues,
                                token: token,
                            }),
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => this.done(data))
                        .catch((error) => console.error("Error:", error));
                });
            });
        } else {
            fetch(this.ajaxUrl + "?action=" + this.action, {
                method: this.options.type,
                body: this.encodeFormData({
                    data: {
                        formValues: this.formValues,
                        jsonValues: this.jsonValues,
                    },
                }),
            })
                .then((response) => response.json())
                .then((data) => this.done(data))
                .catch((error) => console.error("Error:", error));
        }

        return false;
    }

    /**
     * Encode form data for URL-encoded form submission
     * @param {Object} data - The data object to encode
     * @returns {string} URL-encoded string representation of the data
     */
    encodeFormData(data) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (typeof value === "object") {
                // Convert objects to JSON strings
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });
        return formData;
    }

    /**
     * Handle successful AJAX response
     * @param {Object} response - The JSON response from the server
     */
    done(response) {
        // Update form values if provided in the response
        if (response.formValues) {
            this.formValues = { ...this.formValues, ...response.formValues };
            this.objectToForm(this.formElement, response.formValues);
        }


        // Inject HTML response if provided and injection is enabled
        if (response.html && this.injection != "none" && this.injection != "false") {
            this.injectionFromResponse(response);
        }

        // Execute any JavaScript provided in the response
        if (response.script) {
            eval(response.script);
        }

        // Handle validation errors from server
        if (response.errors && this.validation == "server") {
            this.injectErrorsFromResponse(response, true);
        }

        // Process any commands in the response
        this.commandFromResponse(response);
    }

    /**
     * Process special commands in the AJAX response
     * @param {Object} response - The response object from the server
     */
    commandFromResponse(response) {
        // Handle command to hide the trigger element
        if (response.hideTriggerElement && this.triggerElement) {
            // Fade out effect implementation
            const fadeEffect = setInterval(() => {
                if (!this.triggerElement.style.opacity) {
                    this.triggerElement.style.opacity = 1;
                }
                if (this.triggerElement.style.opacity > 0) {
                    this.triggerElement.style.opacity -= 0.1;
                } else {
                    clearInterval(fadeEffect);
                    this.triggerElement.style.display = "none";
                }
            }, 25);
        }
    }

    /**
     * Display validation errors from server response
     * @param {Object} response - The response object containing errors
     * @param {boolean} clean - Whether to clear existing errors first
     */
    injectErrorsFromResponse(response, clean) {
        if (!this.formElement) return;

        // Remove old errors if clean is true
        if (clean) {
            this.formElement.querySelectorAll(".field").forEach((field) => {
                field.classList.remove("is-invalid");
                field.classList.add("is-valid");
            });
        }

        for (var key in response.errors) {
            let value;

            //Correct the key if it contains point
            if (typeof response.errors[key] == "object") {
                var keys = Object.keys(response.errors[key]);
                value = response.errors[key][keys[0]];

                if (keys.length > 0) {
                    key += "." + keys[0];
                }
            } else {
                value = response.errors[key];
            }

            const input = this.formElement.querySelector(`[name='${key}']`);
            if (!input) continue;

            const field = this.getClosestParent(input, ".field");
            if (!field) continue;

            field.classList.remove("is-valid");
            field.classList.add("is-invalid");

            const errorElement = field.querySelector(".field-error");
            if (errorElement) {
                errorElement.innerHTML = value;
            }
        }
    }

    // Fonction utilitaire pour remplacer closest() de jQuery
    /**
     * Find the closest parent element matching a selector
     * @param {HTMLElement} element - The starting element
     * @param {string} selector - CSS selector to match against parents
     * @returns {HTMLElement|null} The matching parent element or null if not found
     */
    getClosestParent(element, selector) {
        let parent = element.parentElement;
        while (parent) {
            if (parent.matches(selector)) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    /**
     * Inject HTML content from AJAX response into target element
     * @param {Object} response - The response object containing HTML
     */
    injectionFromResponse(response) {

        
        if (!response.html) return;

        const targetElement = response.selector ? this.rootElement.querySelector(response.selector) : this.targetElement || this.rootElement;

        // Create temporary container for HTML parsing
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = response.html;
        const htmlElements = Array.from(tempDiv.children);

        // Hide elements before injection for fade-in effect
        htmlElements.forEach((element) => {
            element.style.opacity = "0";
            element.style.display = "none";
        });

        // Inject elements according to specified injection mode
        switch (this.injection) {
            case "append":
                // Add elements to the end of target
                htmlElements.forEach((element) => targetElement.appendChild(element));
                break;

            case "prepend":
                // Add elements to the beginning of target (reverse to maintain order)
                htmlElements.reverse().forEach((element) => targetElement.insertBefore(element, targetElement.firstChild));
                break;

            default:
                // Replace all content (default behavior)
                targetElement.innerHTML = "";
                htmlElements.forEach((element) => targetElement.appendChild(element));
        }

        // Fade-in animation
        htmlElements.forEach((element) => {
            element.style.display = "";
            let opacity = 0;
            element.style.opacity = opacity;

            const fadeIn = setInterval(() => {
                opacity += 0.1;
                element.style.opacity = opacity;

                if (opacity >= 1) {
                    clearInterval(fadeIn);
                }
            }, 30);
        });
    }
    // Check valid data for Contact form
    /**
     * Perform specific data validation for contact form fields
     * @param {HTMLElement} input - The input element to validate
     * @returns {Object} Object containing any validation errors found
     */
    checkInputCorrectData(input) {
        let response = [];
        response["errors"] = [];

        let val = input.value;
        let name = input.getAttribute("name");

        if (name) {
            if (name === "nom" || name === "prenom") {
                // Name fields should contain only letters and specific punctuation
                if (val.match(/^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$/) === null) {
                    response["errors"][name] = "Attention caractère non autorisé";
                }
            } else if (name === "telephone") {
                // Phone number must be exactly 10 digits
                if (val.length != 10) {
                    response["errors"][name] = "Attention le champ téléphone doit contenir 10 chiffres";
                }
            } else if (name === "email") {
                // Email must match a valid email format
                if (!this.validateEmail(val)) {
                    response["errors"][name] = "Attention le format de l'e-mail est incorrect";
                }
            } else if (name === "code_postal") {
                // Postal code must be exactly 5 digits
                if (val.length != 5) {
                    response["errors"][name] = "Attention le champ code postal doit contenir 5 chiffres";
                }
            }
        }

        return response;
    }

    /**
     * Check if any field in the form has a non-empty value
     * @param {HTMLFormElement} form - The form to check
     * @returns {boolean} True if at least one field has a value, false otherwise
     */
    checkFormFill(form) {
        let check = false;
        let data = this.formToObject(form);

        Object.values(data).forEach((value) => {
            check = value !== "" ? true : check;
        });

        return check;
    }

    /**
     * Validate all fields in a form
     * @param {HTMLFormElement} form - The form to validate
     * @param {boolean} changeClass - Whether to update CSS classes on validation
     * @returns {boolean} True if all fields are valid, false otherwise
     */
    validateForm(form, changeClass = true) {
        if (!form) return false;

        let validation = true;
        form.querySelectorAll("input, select, textarea").forEach((element) => {
            let inputValidation = this.validateInput(element, changeClass);
            validation = !inputValidation ? false : validation;
        });

        return validation;
    }

    /**
     * Validate a single form input field
     * @param {HTMLElement} input - The input field to validate
     * @param {boolean} changeClass - Whether to update CSS classes on validation
     * @returns {boolean} True if field is valid, false otherwise
     */
    validateInput(input, changeClass = true) {
        let validation = true;
        let response = [];
        response["errors"] = [];
        let val = input.value;

        // Find parent field container
        const fieldParent = this.getClosestParent(input, ".field");

        // Reset invalid state if needed
        if (changeClass && fieldParent) {
            fieldParent.classList.remove("is-invalid");
        }

        if (fieldParent) {
            if (!val) {
                fieldParent.classList.remove("is-filled");
            } else {
                fieldParent.classList.add("is-filled");
            }
        }

        if (input.hasAttribute("required")) {
            validation = !this.validateEmpty(val) ? false : validation;

            if (input.getAttribute("type") == "checkbox") {
                validation = !input.checked ? false : validation;
            }
        }

        if (input.hasAttribute("maxlength")) {
            const maxlength = input.getAttribute("maxlength");
            let counterDiv = input.nextElementSibling;

            if (!counterDiv || !counterDiv.classList.contains("counter")) {
                counterDiv = document.createElement("div");
                counterDiv.classList.add("counter", "mt-1", "float-right", "text-xs", "text-gray-999");
                input.parentNode.insertBefore(counterDiv, input.nextSibling);
            }

            if (val.length > maxlength) {
                counterDiv.classList.add("text-warning");
            } else {
                counterDiv.classList.remove("text-warning");
            }

            let counter = val.length + "/" + maxlength;
            counterDiv.innerHTML = counter;
        }

        // if (changeClass && this.validateEmpty(val)) {
        //     if (input.getAttribute("type") == "email") {
        //         validation = !this.validateEmail(val) ? false : validation;
        //     }
        // }
        if (validation == true) {
            response = this.checkInputCorrectData(input);

            if (Object.keys(response["errors"]).length > 0) {
                validation = false;
            }
        }
        this.toggleInputState(input, validation, response, changeClass);

        return validation;
    }

    /**
     * Check if a value is not empty
     * @param {*} value - The value to check
     * @returns {boolean} True if the value is not empty
     */
    validateEmpty(value) {
        if (typeof value === "string") {
            return value.trim().length > 0;
        }
        return true;
    }

    /**
     * Validate an email address format
     * @param {string} email - The email address to validate
     * @returns {boolean} True if the email format is valid
     */
    validateEmail(email) {
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegexp.test(email);
    }

    /**
     * Update the visual state of an input field based on validation state
     * @param {HTMLElement} input - The input field to update
     * @param {boolean} state - Whether the field is valid
     * @param {Object} response - Error response object
     * @param {boolean} changeClass - Whether to update CSS classes
     */
    toggleInputState(input, state, response, changeClass = true) {
        if (changeClass) {
            const fieldParent = this.getClosestParent(input, ".field");
            if (!fieldParent) return;

            if (state) {
                // Valid field: remove invalid class and add valid class
                fieldParent.classList.remove("is-invalid");
                fieldParent.classList.add("is-valid");
            } else {
                // Invalid field: inject errors and update classes
                this.injectErrorsFromResponse(response, false);
                fieldParent.classList.remove("is-valid");
                fieldParent.classList.add("is-invalid");
            }
        }
    }

    /**
     * Convert a form's field values to a JavaScript object
     * @param {HTMLFormElement} form - The form to convert
     * @returns {Object} Object containing form values
     */
    formToObject(form) {
        if (!form) return {};

        const formData = new FormData(form);
        const values = {};

        for (const [name, value] of formData.entries()) {
            if (values[name]) {
                // If field name already exists, convert to array or add to existing array
                if (!Array.isArray(values[name])) {
                    values[name] = [values[name]];
                }
                values[name].push(value || "");
            } else {
                // First occurrence of this field name
                values[name] = value || "";
            }
        }

        return values;
    }

    /**
     * Apply values from an object to form fields
     * @param {HTMLFormElement} form - The form to update
     * @param {Object} values - Object containing values to set
     */
    objectToForm(form, values) {
        if (!form) return;

        for (const key in values) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = values[key];
            }
        }
    }
}

/**
 * Export AjaxFactory as the module's default export
 */
export default AjaxFactory;
