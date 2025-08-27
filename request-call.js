// ===========================================
// MODULE 2: REQUEST A CALL
// Mobile-Wise AI Formviser
// ===========================================

const RequestCallModule = {
    
    // API Configuration
    config: {
        apiEndpoint: 'https://na-vg-edge.moeaymandev.workers.dev',
        workspaceSecret: 'vg_RBYIuhZPlUniit68ypYz',
        twilioPhone: '+1 949 881 6456',
        region: 'NA'
    },

    // Initialize Module
    init: function() {
        console.log('🚀 Initializing Request a Call Module...');
        this.bindEventListeners();
        this.setupFormValidation();
        console.log('✅ Request a Call Module Ready!');
    },

    // Bind Event Listeners
    bindEventListeners: function() {
        const form = document.getElementById('callRequestForm');
        const requestBtn = document.getElementById('requestCallBtn');
        
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Phone number formatting
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhoneNumber);
        }
        
        console.log('✅ Request Call event listeners bound');
    },

    // Setup Real-time Form Validation
    setupFormValidation: function() {
        const inputs = ['userName', 'phoneNumber', 'bestTime'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('blur', () => this.validateField(inputId));
                input.addEventListener('input', () => this.clearFieldError(inputId));
            }
        });
    },

    // Format Phone Number
    formatPhoneNumber: function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0,3)}) ${value.slice(3)}`;
        }
        e.target.value = value;
    },

    // Validate Individual Field
    validateField: function(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(fieldId) {
            case 'userName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Please enter your full name';
                }
                break;
                
            case 'phoneNumber':
                const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
                if (!phoneRegex.test(value) && value.length > 0) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'bestTime':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select your preferred time';
                }
                break;
        }

        this.showFieldValidation(fieldId, isValid, errorMessage);
        return isValid;
    },

    // Show Field Validation
    showFieldValidation: function(fieldId, isValid, errorMessage) {
        const field = document.getElementById(fieldId);
        
        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid && errorMessage) {
            field.style.borderColor = '#f44336';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #f44336; font-size: 12px; margin-top: 4px;';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.style.borderColor = isValid ? '#4CAF50' : '#555';
        }
    },

    // Clear Field Error
    clearFieldError: function(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '#555';
    },

    // Handle Form Submission
    handleFormSubmit: function(e) {
        e.preventDefault();
        console.log('📞 Processing call request...');

        // Validate all fields
        const isValid = this.validateAllFields();
        if (!isValid) {
            console.log('❌ Form validation failed');
            return;
        }

        // Show loading state
        this.showLoadingState(true);

        // Get form data
        const formData = this.getFormData();
        
        // Submit to API
        this.submitCallRequest(formData);
    },

    // Validate All Fields
    validateAllFields: function() {
        const fields = ['userName', 'phoneNumber', 'bestTime'];
        let allValid = true;

        fields.forEach(fieldId => {
            const isValid = this.validateField(fieldId);
            if (!isValid) allValid = false;
        });

        return allValid;
    },

    // Get Form Data
    getFormData: function() {
        return {
            name: document.getElementById('userName').value.trim(),
            phone: document.getElementById('phoneNumber').value.trim(),
            bestTime: document.getElementById('bestTime').value,
            timestamp: new Date().toISOString(),
            source: 'Request a Call Module'
        };
    },

    // Show Loading State
    showLoadingState: function(loading) {
        const btn = document.getElementById('requestCallBtn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');

        if (loading) {
            btn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            btn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    },

    // Submit Call Request to API
    submitCallRequest: async function(formData) {
        try {
            console.log('🚀 Submitting to VAPI:', formData);

            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.workspaceSecret}`,
                    'X-API-Key': this.config.workspaceSecret
                },
                body: JSON.stringify({
                    phone: formData.phone.replace(/\D/g, ''), // Clean phone number
                    name: formData.name,
                    preferredTime: formData.bestTime,
                    message: `Call request from ${formData.name}. Best time: ${formData.bestTime}`,
                    twilioNumber: this.config.twilioPhone,
                    timestamp: formData.timestamp
                })
            });

            if (formData.bestTime === 'call-now') {
    // Trigger immediate VAPI call
    payload.assistant.firstMessage = `Hello ${formData.fullName}! This is NCI calling immediately as requested. How can we help you right now?`;
}

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Call request successful:', result);
                this.showSuccessMessage(formData);
            } else {
                throw new Error(`API Error: ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Call request failed:', error);
            this.showErrorMessage(error.message);
        } finally {
            this.showLoadingState(false);
        }
    },

    // Show Success Message
    showSuccessMessage: function(formData) {
        const form = document.getElementById('callRequestForm');
        const successMessage = document.getElementById('successMessage');
        const confirmedPhone = document.getElementById('confirmedPhone');

        form.style.display = 'none';
        confirmedPhone.textContent = formData.phone;
        successMessage.style.display = 'flex';

        console.log('✅ Call request submitted successfully');
    },

    // Show Error Message
    showErrorMessage: function(errorMsg) {
        alert(`Request failed: ${errorMsg}\n\nPlease try again or contact support.`);
    },

    // Switch to Call Request Interface
    switchToCallRequest: function() {
        console.log('🔄 Switching to Request a Call interface...');
        
        // Hide chat interface
        document.getElementById('chatInterface').style.display = 'none';
        document.getElementById('splashScreen').style.display = 'none';
        
        // Show call request interface
        document.getElementById('callRequestInterface').style.display = 'flex';
        
        // Change background image
        const bgImg = document.querySelector('.background-interface img');
        if (bgImg) {
            bgImg.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1755854854384_slide3-graphic.png';
        }
        
        console.log('✅ Switched to Request a Call interface');
    },

    // Switch Back to Chat
    switchToChat: function() {
        console.log('🔄 Switching back to chat...');
        
        // Hide call request interface
        document.getElementById('callRequestInterface').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('callRequestForm').style.display = 'flex';
        
        // Show chat interface
        document.getElementById('chatInterface').style.display = 'flex';
        
        // Change background back
        const bgImg = document.querySelector('.background-interface img');
        if (bgImg) {
            bgImg.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1755410028254_interface%20with%20chat%20area.PNG';
        }
        
        // Reset form
        document.getElementById('callRequestForm').reset();
        this.clearAllFieldErrors();
        
        console.log('✅ Switched back to chat');
    },

    // Clear All Field Errors
    clearAllFieldErrors: function() {
        const fields = ['userName', 'phoneNumber', 'bestTime'];
        fields.forEach(fieldId => this.clearFieldError(fieldId));
    }
};

// Global Functions for HTML onclick events
function switchToCallRequest() {
    RequestCallModule.switchToCallRequest();
}

function switchToChat() {
    RequestCallModule.switchToChat();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    RequestCallModule.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RequestCallModule;
}