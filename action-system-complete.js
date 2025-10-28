/**
 * =============================================================================
 * MOBILE-WISE AI FORMVISER - UNIFIED ACTION SYSTEM
 * =============================================================================
 * Consolidates: action-buttons-system.js, communication-action-center.js, 
 *               action-splash-system.js
 * Purpose: Single source of truth for all action buttons, overlays, and 
 *          AI-powered lead capture interviews
 * Author: Captain - Mobile-Wise AI Empire
 * =============================================================================
 */

// =============================================================================
// SECTION 1: LEAD CAPTURE INTERVIEW CONFIGURATIONS
// =============================================================================

const LEAD_CAPTURE_CONFIGS = {
    'request-callback': {
        fields: [
            { type: 'text', name: 'name', label: 'Your Name', required: true },
            { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
            { type: 'email', name: 'email', label: 'Email Address', required: true },
            { 
                type: 'select', 
                name: 'preferredTime', 
                label: 'Preferred Time',
                options: ['Morning (9am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-8pm)'],
                required: true 
            }
        ],
        successMessage: "Thanks! We'll call you back at your preferred time.",
        trackingEvent: 'callback_requested'
    },
    
    'free-consultation': {
        fields: [
            { type: 'text', name: 'name', label: 'Your Name', required: true },
            { type: 'email', name: 'email', label: 'Email Address', required: true },
            { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
            { 
                type: 'select', 
                name: 'businessType', 
                label: 'Business Type',
                options: ['New Business', 'Existing Business', 'Franchise', 'Other'],
                required: true 
            },
            { 
                type: 'textarea', 
                name: 'goals', 
                label: 'What are your main goals?',
                required: false 
            }
        ],
        successMessage: "Consultation booked! Check your email for details.",
        trackingEvent: 'consultation_booked'
    },
    
    'immediate-call': {
        fields: [
            { type: 'text', name: 'name', label: 'Your Name', required: true },
            { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
            { 
                type: 'select', 
                name: 'urgency', 
                label: 'How soon do you need help?',
                options: ['Right Now', 'Within 1 Hour', 'Within 2 Hours', 'Today'],
                required: true 
            }
        ],
        successMessage: "Got it! We're calling you shortly.",
        trackingEvent: 'immediate_call_requested'
    },
    
    'pre-qualify': {
        fields: [
            { type: 'text', name: 'name', label: 'Your Name', required: true },
            { type: 'email', name: 'email', label: 'Email Address', required: true },
            { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
            { 
                type: 'select', 
                name: 'budget', 
                label: 'Monthly Marketing Budget',
                options: ['Under $1,000', '$1,000-$2,500', '$2,500-$5,000', '$5,000+'],
                required: true 
            },
            { 
                type: 'select', 
                name: 'timeline', 
                label: 'When do you want to start?',
                options: ['This Week', 'This Month', 'Next Month', 'Just Exploring'],
                required: true 
            }
        ],
        successMessage: "Thanks! We'll review your info and get back to you.",
        trackingEvent: 'pre_qualification_submitted'
    },
    
    'free-book': {
        fields: [
            { type: 'text', name: 'name', label: 'Your Name', required: true },
            { type: 'email', name: 'email', label: 'Email Address', required: true },
            { 
                type: 'select', 
                name: 'format', 
                label: 'Preferred Format',
                options: ['PDF Download', 'Physical Book (Mailed)', 'Both'],
                required: true 
            },
            { 
                type: 'text', 
                name: 'address', 
                label: 'Mailing Address (if physical)',
                required: false,
                condition: { field: 'format', values: ['Physical Book (Mailed)', 'Both'] }
            }
        ],
        successMessage: "Book on its way! Check your email.",
        trackingEvent: 'book_requested'
    }
};

// =============================================================================
// SECTION 2: BUTTON CONFIGURATIONS
// =============================================================================

const ACTION_BUTTON_CONFIGS = [
    {
        id: 'request-callback',
        label: '📞 Request Call',
        description: 'We\'ll call you at your convenience',
        action: 'showLeadCapture',
        priority: 1,
        color: 'teal'
    },
    {
        id: 'free-consultation',
        label: '💼 Free Consultation',
        description: '30-minute strategy session',
        action: 'showLeadCapture',
        priority: 2,
        color: 'blue'
    },
    {
        id: 'immediate-call',
        label: '🚨 Call Me Now',
        description: 'Urgent? We\'ll call within minutes',
        action: 'showLeadCapture',
        priority: 3,
        color: 'red'
    },
    {
        id: 'pre-qualify',
        label: '✅ Pre-Qualify',
        description: 'See if we\'re a good fit',
        action: 'showLeadCapture',
        priority: 4,
        color: 'green'
    },
    {
        id: 'free-book',
        label: '📚 Free Book',
        description: 'Get our marketing guide',
        action: 'showLeadCapture',
        priority: 5,
        color: 'purple'
    }
];

// =============================================================================
// SECTION 3: COMMUNICATION ACTION CENTER (OVERLAY)
// =============================================================================

/**
 * Shows the Communication Action Center overlay with all action buttons
 * Called when user expresses intent to contact (e.g., "I'd rather speak to Bruce")
 */
function showCommunicationActionCenter() {
    // Remove any existing overlay
    const existing = document.getElementById('communication-action-center');
    if (existing) {
        existing.remove();
    }

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'communication-action-center';
    overlay.className = 'action-overlay';
    
    // Build overlay content
    overlay.innerHTML = `
        <div class="action-center-content">
            <div class="action-center-header">
                <h2>How Can We Help You Today?</h2>
                <button class="action-close-btn" onclick="closeActionCenter()">✕</button>
            </div>
            <div class="action-buttons-grid">
                ${ACTION_BUTTON_CONFIGS.map(btn => `
                    <button class="action-btn action-btn-${btn.color}" 
                            onclick="handleActionButtonClick('${btn.id}')"
                            data-action="${btn.action}">
                        <div class="action-btn-label">${btn.label}</div>
                        <div class="action-btn-description">${btn.description}</div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Fade in animation
    setTimeout(() => overlay.classList.add('active'), 10);
    
    // Track display event
    if (window.gtag) {
        gtag('event', 'action_center_displayed', {
            'event_category': 'Communication',
            'event_label': 'Action Center Opened'
        });
    }
}

/**
 * Closes the Communication Action Center overlay
 */
function closeActionCenter() {
    const overlay = document.getElementById('communication-action-center');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

/**
 * Handles clicks on action buttons in the Communication Action Center
 * @param {string} buttonId - ID of the clicked button
 */
function handleActionButtonClick(buttonId) {
    const config = ACTION_BUTTON_CONFIGS.find(btn => btn.id === buttonId);
    if (!config) return;
    
    // Close action center
    closeActionCenter();
    
    // Show lead capture interview
    setTimeout(() => {
        showLeadCapture(buttonId);
    }, 300);
    
    // Track button click
    if (window.gtag) {
        gtag('event', 'action_button_clicked', {
            'event_category': 'Communication',
            'event_label': buttonId
        });
    }
}

// =============================================================================
// SECTION 4: AI LEAD CAPTURE INTERVIEW SYSTEM
// =============================================================================

let currentInterviewStep = 0;
let interviewData = {};

/**
 * Initiates an AI-powered lead capture interview
 * @param {string} actionType - Type of action (maps to LEAD_CAPTURE_CONFIGS key)
 */
function showLeadCapture(actionType) {
    const config = LEAD_CAPTURE_CONFIGS[actionType];
    if (!config) {
        console.error(`No lead capture config found for: ${actionType}`);
        return;
    }
    
    // Reset interview state
    currentInterviewStep = 0;
    interviewData = { actionType };
    
    // Remove any existing splash
    const existing = document.getElementById('action-splash-overlay');
    if (existing) {
        existing.remove();
    }
    
    // Create splash overlay
    const splash = document.createElement('div');
    splash.id = 'action-splash-overlay';
    splash.className = 'action-splash';
    
    splash.innerHTML = `
        <div class="action-splash-content">
            <div class="action-splash-header">
                <h2 id="splash-question">Let's get started!</h2>
                <button class="action-splash-close" onclick="closeLeadCapture()">✕</button>
            </div>
            <div class="action-splash-body">
                <div id="splash-input-container"></div>
                <div class="action-splash-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <div class="progress-text">
                        <span id="progress-current">1</span> of <span id="progress-total">${config.fields.length}</span>
                    </div>
                </div>
            </div>
            <div class="action-splash-footer">
                <button class="action-btn-secondary" onclick="previousQuestion()" id="btn-previous" disabled>
                    ← Back
                </button>
                <button class="action-btn-primary" onclick="nextQuestion()" id="btn-next">
                    Next →
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(splash);
    setTimeout(() => splash.classList.add('active'), 10);
    
    // Show first question
    showInterviewQuestion();
}

/**
 * Displays the current interview question
 */
function showInterviewQuestion() {
    const config = LEAD_CAPTURE_CONFIGS[interviewData.actionType];
    const field = config.fields[currentInterviewStep];
    
    if (!field) {
        // All questions answered - submit
        submitLeadCapture();
        return;
    }
    
    // Check conditional display
    if (field.condition) {
        const conditionMet = field.condition.values.includes(interviewData[field.condition.field]);
        if (!conditionMet) {
            // Skip this question
            currentInterviewStep++;
            showInterviewQuestion();
            return;
        }
    }
    
    // Update question text
    document.getElementById('splash-question').textContent = field.label;
    
    // Update progress
    const progress = ((currentInterviewStep + 1) / config.fields.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-current').textContent = currentInterviewStep + 1;
    
    // Build input field
    const container = document.getElementById('splash-input-container');
    container.innerHTML = '';
    
    let inputElement;
    
    if (field.type === 'select') {
        inputElement = document.createElement('select');
        inputElement.className = 'splash-input splash-select';
        inputElement.innerHTML = `
            <option value="">-- Select --</option>
            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        `;
    } else if (field.type === 'textarea') {
        inputElement = document.createElement('textarea');
        inputElement.className = 'splash-input splash-textarea';
        inputElement.rows = 4;
    } else {
        inputElement = document.createElement('input');
        inputElement.type = field.type;
        inputElement.className = 'splash-input';
    }
    
    inputElement.id = 'current-input';
    inputElement.name = field.name;
    inputElement.placeholder = field.label;
    if (field.required) inputElement.required = true;
    
    // Pre-fill if data exists
    if (interviewData[field.name]) {
        inputElement.value = interviewData[field.name];
    }
    
    // Enter key handler
    inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && field.type !== 'textarea') {
            e.preventDefault();
            nextQuestion();
        }
    });
    
    container.appendChild(inputElement);
    inputElement.focus();
    
    // Update button states
    document.getElementById('btn-previous').disabled = currentInterviewStep === 0;
    document.getElementById('btn-next').textContent = 
        currentInterviewStep === config.fields.length - 1 ? 'Submit ✓' : 'Next →';
}

/**
 * Advances to next interview question
 */
function nextQuestion() {
    const config = LEAD_CAPTURE_CONFIGS[interviewData.actionType];
    const field = config.fields[currentInterviewStep];
    const input = document.getElementById('current-input');
    
    // Validate required fields
    if (field.required && !input.value.trim()) {
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 500);
        return;
    }
    
    // Save answer
    interviewData[field.name] = input.value.trim();
    
    // Move to next question
    currentInterviewStep++;
    showInterviewQuestion();
}

/**
 * Goes back to previous interview question
 */
function previousQuestion() {
    if (currentInterviewStep > 0) {
        currentInterviewStep--;
        showInterviewQuestion();
    }
}

/**
 * Submits the completed lead capture interview
 */
function submitLeadCapture() {
    const config = LEAD_CAPTURE_CONFIGS[interviewData.actionType];
    
    // Show success message
    const splash = document.getElementById('action-splash-overlay');
    if (splash) {
        splash.querySelector('.action-splash-content').innerHTML = `
            <div class="action-splash-success">
                <div class="success-icon">✓</div>
                <h2>Perfect!</h2>
                <p>${config.successMessage}</p>
                <button class="action-btn-primary" onclick="closeLeadCapture()">
                    Done
                </button>
            </div>
        `;
    }
    
    // Track conversion
    if (window.gtag) {
        gtag('event', config.trackingEvent, {
            'event_category': 'Lead Capture',
            'event_label': interviewData.actionType,
            'value': 1
        });
    }
    
    // Send to backend (implement your endpoint)
    submitToBackend(interviewData);
}

/**
 * Sends lead data to backend
 * @param {Object} data - Lead capture data
 */
function submitToBackend(data) {
    // IMPLEMENTATION NEEDED: Replace with your actual endpoint
    fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Lead submitted successfully:', result);
    })
    .catch(error => {
        console.error('Lead submission error:', error);
        // Could show error UI here
    });
}

/**
 * Closes the lead capture splash screen
 */
function closeLeadCapture() {
    const splash = document.getElementById('action-splash-overlay');
    if (splash) {
        splash.classList.remove('active');
        setTimeout(() => splash.remove(), 300);
    }
    
    // Reset state
    currentInterviewStep = 0;
    interviewData = {};
}

// =============================================================================
// SECTION 5: PAGE LOAD INITIALIZATION
// =============================================================================

/**
 * Injects action buttons into the page on load
 * Looks for element with id="action-buttons-container" or creates floating button
 */
function initializeActionButtons() {
    const container = document.getElementById('action-buttons-container');
    
    if (container) {
        // Inject buttons into existing container
        container.innerHTML = ACTION_BUTTON_CONFIGS.map(btn => `
            <button class="inline-action-btn" 
                    onclick="handleActionButtonClick('${btn.id}')"
                    data-priority="${btn.priority}">
                ${btn.label}
            </button>
        `).join('');
    } else {
        // Create floating "Contact Us" button that opens action center
        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'floating-contact-btn';
        floatingBtn.className = 'floating-action-btn';
        floatingBtn.innerHTML = '💬 Contact Us';
        floatingBtn.onclick = showCommunicationActionCenter;
        document.body.appendChild(floatingBtn);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActionButtons);
} else {
    initializeActionButtons();
}

// =============================================================================
// SECTION 6: GLOBAL EXPORTS
// =============================================================================

// Make functions available globally for inline onclick handlers
window.showCommunicationActionCenter = showCommunicationActionCenter;
window.closeActionCenter = closeActionCenter;
window.handleActionButtonClick = handleActionButtonClick;
window.showLeadCapture = showLeadCapture;
window.closeLeadCapture = closeLeadCapture;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;

// Export config for external access if needed
window.ACTION_SYSTEM = {
    configs: LEAD_CAPTURE_CONFIGS,
    buttons: ACTION_BUTTON_CONFIGS,
    showActionCenter: showCommunicationActionCenter,
    showLeadCapture: showLeadCapture
};

console.log('✅ Mobile-Wise AI Action System Initialized');
