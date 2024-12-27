document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('submissionModal');
    const modalContent = document.getElementById('submissionDetails');
    const closeButtons = document.querySelectorAll('.close-button, .modal-close');
    
    // Initialize form validator
    const validator = new FormValidator(form);

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const { isValid, data } = validator.validateForm();
        
        if (isValid) {
            try {
                // Simulate API call
                await submitForm(data);
                
                // Show success modal
                showModal(data);
                
                // Reset form
                validator.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                alert('An error occurred while submitting the form. Please try again.');
            }
        }
    });

    // Reset form handler
    form.addEventListener('reset', () => {
        setTimeout(() => validator.reset(), 0);
    });

    // Modal close handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Simulate form submission
    async function submitForm(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate API call
        // In a real application, this would be a fetch call to your backend
        console.log('Form submitted with data:', data);
        
        // Simulate possible error (1 in 10 chance)
        if (Math.random() < 0.1) {
            throw new Error('Random submission error');
        }
        
        return { success: true };
    }

    // Show modal with form data
    function showModal(data) {
        const formattedData = Object.entries(data)
            .filter(([key]) => key !== 'consent')
            .map(([key, value]) => `
                <div class="submission-item">
                    <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                    <span>${value}</span>
                </div>
            `).join('');

        modalContent.innerHTML = `
            <div class="submission-details">
                ${formattedData}
            </div>
        `;
        
        modal.style.display = 'block';
    }

    // Save form data to localStorage
    function saveFormData() {
        const formData = {};
        form.querySelectorAll('input, textarea, select').forEach(field => {
            if (field.type !== 'checkbox') {
                formData[field.name] = field.value;
            }
        });
        localStorage.setItem('formData', JSON.stringify(formData));
    }

    // Load form data from localStorage
    function loadFormData() {
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            Object.entries(formData).forEach(([name, value]) => {
                const field = form.querySelector(`[name="${name}"]`);
                if (field) {
                    field.value = value;
                    validator.validateField(field);
                }
            });
        }
    }

    // Auto-save form data when inputs change
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('change', () => {
            if (field.type !== 'checkbox') {
                saveFormData();
            }
        });
    });

    // Load saved form data on page load
    loadFormData();
});

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
