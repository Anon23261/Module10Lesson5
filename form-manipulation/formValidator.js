class FormValidator {
    constructor(form) {
        this.form = form;
        this.validators = {
            required: (value) => value.trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^\(\d{3}\) \d{3}-\d{4}$/.test(value),
            minLength: (value, length) => value.trim().length >= parseInt(length)
        };
        
        this.errorMessages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number',
            minLength: (length) => `Minimum ${length} characters required`
        };

        this.setupValidation();
    }

    setupValidation() {
        // Add input event listeners
        this.form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Phone number formatting
        const phoneInput = this.form.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }

        // Character count for message
        const messageInput = this.form.querySelector('textarea[name="message"]');
        if (messageInput) {
            messageInput.addEventListener('input', (e) => this.updateCharacterCount(e));
        }
    }

    validateField(field) {
        const validations = field.dataset.validation;
        if (!validations) return true;

        const validationRules = validations.split('|');
        let isValid = true;
        let errorMessage = '';

        for (const rule of validationRules) {
            const [validationType, param] = rule.split(':');
            const value = field.value;

            if (this.validators[validationType]) {
                const validatorResult = this.validators[validationType](value, param);
                if (!validatorResult) {
                    isValid = false;
                    errorMessage = param ? 
                        this.errorMessages[validationType](param) :
                        this.errorMessages[validationType];
                    break;
                }
            }
        }

        this.updateFieldStatus(field, isValid, errorMessage);
        return isValid;
    }

    validateForm() {
        let isValid = true;
        const formData = new FormData(this.form);
        const data = {};

        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
            if (field.type !== 'checkbox') {
                data[field.name] = field.value;
            } else {
                data[field.name] = field.checked;
            }
        });

        return { isValid, data };
    }

    updateFieldStatus(field, isValid, errorMessage) {
        const wrapper = field.closest('.input-wrapper') || field.parentElement;
        const errorElement = wrapper.nextElementSibling;

        wrapper.classList.remove('valid', 'invalid');
        wrapper.classList.add(isValid ? 'valid' : 'invalid');

        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = isValid ? '' : errorMessage;
        }
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    }

    updateCharacterCount(e) {
        const maxLength = 500;
        const currentLength = e.target.value.length;
        const countDisplay = e.target.parentElement.nextElementSibling.nextElementSibling;
        
        countDisplay.textContent = `${currentLength}/${maxLength}`;
        if (currentLength > maxLength) {
            e.target.value = e.target.value.slice(0, maxLength);
            countDisplay.textContent = `${maxLength}/${maxLength}`;
        }
    }

    reset() {
        this.form.reset();
        this.form.querySelectorAll('.input-wrapper').forEach(wrapper => {
            wrapper.classList.remove('valid', 'invalid');
        });
        this.form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
        this.form.querySelector('.character-count').textContent = '0/500';
    }
}
