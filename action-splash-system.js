/**
 * 🎯 MOBILE-WISE AI FORMVISER - ACTION SPLASH SCREEN SYSTEM
 * Dynamic Lead Capture with AI Interviews & Email Integration
 * Version: 1.0.0 - Captain's Special Edition
 */

// ============================================================================
// 📋 LEAD CAPTURE CONFIGURATIONS
// ============================================================================

const LEAD_CAPTURE_CONFIGS = {
    'request-call': {
        fields: [
            { key: 'name', question: "What's your name?", type: 'text' },
            { key: 'phone', question: "What's your phone number?", type: 'phone' },
            { key: 'reason', question: "What's the reason for your call?", type: 'text' }
        ],
        emailSubject: 'Request a Call',
        splashTitle: '📞 Request a Call',
        splashSubtitle: 'Get a call within 5 minutes',
        glowColor: '#00ff88',
        urgencyFlag: false
    },
    
    'free-consultation': {
        routeTo: 'existingFullLeadCapture', // Routes to your existing system
        splashTitle: '💼 Get a Free Consultation',
        splashSubtitle: 'Complete consultation booking'
    },
    
    'urgent-call': {
        fields: [
            { key: 'name', question: "What's your name?", type: 'text' },
            { key: 'phone', question: "What's your phone number?", type: 'phone' },
            { key: 'reason', question: "What's the urgent reason for your call?", type: 'text' }
        ],
        emailSubject: '🚨 URGENT Call Requested',
        splashTitle: '🚨 Get an Immediate Call',
        splashSubtitle: 'URGENT - Priority response within 2 minutes',
        glowColor: '#ff4444',
        urgencyFlag: true
    },
    
    'pre-qualify': {
        fields: [
            { key: 'name', question: "What's your name?", type: 'text' },
            { key: 'email', question: "What's your email address?", type: 'email' },
            { key: 'phone', question: "What's your phone number?", type: 'phone' },
            { key: 'isCPA', question: "Are you a CPA or Accountant?", type: 'boolean' },
            { key: 'businessName', question: "What's your business or practice name?", type: 'text' }
        ],
        emailSubject: 'Pre-Qualification Request',
        splashTitle: '✅ Get Pre-Qualified',
        splashSubtitle: 'Answer a few simple questions',
        glowColor: '#00ff88',
        urgencyFlag: false
    },
    
    'free-book': {
        fields: [
            { key: 'name', question: "What's your name?", type: 'text' },
            { key: 'email', question: "What's your email address?", type: 'email' },
            { key: 'phone', question: "What's your phone number?", type: 'phone' },
            { key: 'isCPA', question: "Are you a CPA or Accountant?", type: 'boolean' },
            { key: 'businessName', question: "What's your business or practice name?", type: 'text' }
        ],
        emailSubject: '📚 Free Book Request - 7 Secrets',
        splashTitle: '📚 Free Book: 7 Secrets for Selling Your Practice',
        splashSubtitle: 'Get your free eBook instantly',
        glowColor: '#00ff88',
        urgencyFlag: false
    }
};

// ============================================================================
// 🎨 SPLASH SCREEN CREATOR
// ============================================================================

class ActionSplashScreen {
    constructor(actionType, config) {
        this.actionType = actionType;
        this.config = config;
        this.currentFieldIndex = 0;
        this.collectedData = {};
        this.splashElement = null;
        this.isInterviewComplete = false;
    }

    /**
     * 🚀 Show the splash screen with green glow
     */
    show() {
        // Check if routing to existing system
        if (this.config.routeTo === 'existingFullLeadCapture') {
            this.routeToExistingSystem();
            return;
        }

        // Create splash overlay
        this.splashElement = this.createSplashElement();
        document.body.appendChild(this.splashElement);

        // Trigger entrance animation
        setTimeout(() => {
            this.splashElement.classList.add('active');
        }, 50);

        // Start AI interview
        this.startAIInterview();
    }

    /**
     * 🎨 Create splash HTML element
     */
    createSplashElement() {
        const splash = document.createElement('div');
        splash.className = 'action-splash-overlay';
        splash.innerHTML = `
            <div class="action-splash-container">
                <div class="splash-glow-effect"></div>
                
                <div class="splash-content">
                    <h2 class="splash-title">${this.config.splashTitle}</h2>
                    <p class="splash-subtitle">${this.config.splashSubtitle}</p>
                    
                    <div class="ai-interview-area">
                        <div class="ai-avatar">
                            <div class="ai-pulse"></div>
                            🤖
                        </div>
                        <div class="interview-messages" id="interview-messages"></div>
                        <div class="interview-input-container" id="interview-input-container">
                            <input 
                                type="text" 
                                id="interview-input" 
                                placeholder="Type your answer..."
                                autocomplete="off"
                            />
                            <button id="interview-submit" class="submit-btn">Send</button>
                        </div>
                    </div>
                    
                    <button class="splash-close-btn hidden" id="splash-close-btn">
                        Close & Continue →
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        setTimeout(() => {
            const input = splash.querySelector('#interview-input');
            const submitBtn = splash.querySelector('#interview-submit');
            const closeBtn = splash.querySelector('#splash-close-btn');

            submitBtn.addEventListener('click', () => this.handleUserResponse());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserResponse();
            });
            closeBtn.addEventListener('click', () => this.close());
        }, 100);

        return splash;
    }

    /**
     * 🎤 Start AI Interview Process
     */
    startAIInterview() {
        setTimeout(() => {
            this.askNextQuestion();
        }, 800);
    }

    /**
     * ❓ Ask the next question in the interview
     */
    askNextQuestion() {
        if (this.currentFieldIndex >= this.config.fields.length) {
            this.completeInterview();
            return;
        }

        const field = this.config.fields[this.currentFieldIndex];
        this.addAIMessage(field.question);

        // Focus input
        const input = document.getElementById('interview-input');
        if (input) input.focus();
    }

    /**
     * 💬 Add AI message to chat
     */
    addAIMessage(message) {
        const messagesContainer = document.getElementById('interview-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        messageDiv.innerHTML = `
            <div class="message-bubble ai-bubble">
                ${message}
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * 💬 Add user message to chat
     */
    addUserMessage(message) {
        const messagesContainer = document.getElementById('interview-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `
            <div class="message-bubble user-bubble">
                ${message}
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * 📝 Handle user response
     */
    handleUserResponse() {
        const input = document.getElementById('interview-input');
        const response = input.value.trim();

        if (!response) return;

        // Add user message
        this.addUserMessage(response);

        // Store response
        const field = this.config.fields[this.currentFieldIndex];
        this.collectedData[field.key] = response;

        // Clear input
        input.value = '';

        // Move to next question
        this.currentFieldIndex++;
        
        setTimeout(() => {
            this.askNextQuestion();
        }, 600);
    }

    /**
     * ✅ Complete the interview
     */
    async completeInterview() {
        this.isInterviewComplete = true;

        // Hide input area
        const inputContainer = document.getElementById('interview-input-container');
        if (inputContainer) inputContainer.style.display = 'none';

        // Show completion message
        this.addAIMessage("Perfect! I've got everything. Sending your information now... ✨");

        // Send email
        await this.sendEmail();

        // Show close button
        setTimeout(() => {
            const closeBtn = document.getElementById('splash-close-btn');
            if (closeBtn) closeBtn.classList.remove('hidden');
            
            this.addAIMessage("All done! You can close this window now. 👍");
        }, 1500);
    }

    /**
     * 📧 Send email via EmailJS
     */
    async sendEmail() {
        try {
            // Format collected data for email
            const emailData = {
                subject: this.config.emailSubject,
                actionType: this.actionType,
                urgency: this.config.urgencyFlag ? 'URGENT' : 'Normal',
                timestamp: new Date().toLocaleString(),
                ...this.collectedData
            };

            // Build email body
            let emailBody = `
<h2>${this.config.emailSubject}</h2>
<p><strong>Timestamp:</strong> ${emailData.timestamp}</p>
<p><strong>Priority:</strong> ${emailData.urgency}</p>
<hr>
`;

            // Add all collected fields
            this.config.fields.forEach(field => {
                const value = this.collectedData[field.key] || 'Not provided';
                const label = field.question.replace('?', '');
                emailBody += `<p><strong>${label}:</strong> ${value}</p>`;
            });

            // EmailJS parameters (replace with your actual IDs)
            const emailParams = {
                to_email: 'client@example.com', // Replace with client email
                subject: this.config.emailSubject,
                message: emailBody,
                from_name: this.collectedData.name || 'Website Visitor'
            };

            // Send via EmailJS (you'll need to configure this)
            // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailParams);

            console.log('📧 Email sent:', emailParams);
            
            return true;
        } catch (error) {
            console.error('❌ Email error:', error);
            return false;
        }
    }

    /**
     * 🔀 Route to existing full lead capture system
     */
    routeToExistingSystem() {
        // Call your existing full consultation booking system
        // This is where you'd integrate with your current "Get a Free Consultation" flow
        console.log('🔀 Routing to existing full lead capture system...');
        
        // Example: window.showFullConsultationFlow();
        // Or: document.getElementById('consultation-modal').classList.add('active');
    }

    /**
     * ❌ Close splash screen
     */
    close() {
        if (this.splashElement) {
            this.splashElement.classList.remove('active');
            setTimeout(() => {
                this.splashElement.remove();
            }, 300);
        }
    }
}

// ============================================================================
// 🎯 MAIN ACTION HANDLER
// ============================================================================

/**
 * Show action splash screen
 * @param {string} actionType - Type of action (request-call, urgent-call, etc.)
 */
function showActionSplash(actionType) {
    const config = LEAD_CAPTURE_CONFIGS[actionType];
    
    if (!config) {
        console.error(`❌ Unknown action type: ${actionType}`);
        return;
    }

    const splash = new ActionSplashScreen(actionType, config);
    splash.show();
}

// ============================================================================
// 🎨 CSS STYLES (Include in your stylesheet)
// ============================================================================

const ACTION_SPLASH_STYLES = `
/* Action Splash Overlay */
.action-splash-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.action-splash-overlay.active {
    opacity: 1;
}

/* Splash Container */
.action-splash-container {
    position: relative;
    width: 90%;
    max-width: 600px;
    max-height: 85vh;
    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 40px 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.action-splash-overlay.active .action-splash-container {
    transform: scale(1);
}

/* Green Glow Effect */
.splash-glow-effect {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%);
    animation: pulseGlow 3s ease-in-out infinite;
    pointer-events: none;
    z-index: -1;
}

@keyframes pulseGlow {
    0%, 100% {
        opacity: 0.4;
        transform: scale(0.95);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.05);
    }
}

/* Urgent red glow variant */
.action-splash-container[data-urgent="true"] .splash-glow-effect {
    background: radial-gradient(circle, rgba(255, 68, 68, 0.3) 0%, transparent 70%);
}

/* Splash Content */
.splash-content {
    position: relative;
    z-index: 1;
}

.splash-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 10px 0;
    text-align: center;
}

.splash-subtitle {
    font-size: 16px;
    color: #444;
    margin: 0 0 30px 0;
    text-align: center;
}

/* AI Interview Area */
.ai-interview-area {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
}

.ai-avatar {
    text-align: center;
    font-size: 48px;
    margin-bottom: 20px;
    position: relative;
}

.ai-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(0, 255, 136, 0.3);
    animation: aiPulse 2s ease-in-out infinite;
    z-index: -1;
}

@keyframes aiPulse {
    0%, 100% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0.5;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.8;
    }
}

/* Interview Messages */
.interview-messages {
    min-height: 200px;
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 15px;
    padding: 10px;
}

.ai-message, .user-message {
    margin-bottom: 12px;
    animation: messageSlideIn 0.3s ease;
}

@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message-bubble {
    display: inline-block;
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 80%;
    word-wrap: break-word;
}

.ai-bubble {
    background: rgba(0, 255, 136, 0.2);
    color: #1a1a1a;
    border: 1px solid rgba(0, 255, 136, 0.3);
}

.user-bubble {
    background: rgba(68, 68, 68, 0.2);
    color: #1a1a1a;
    float: right;
    border: 1px solid rgba(68, 68, 68, 0.3);
}

.user-message {
    text-align: right;
    clear: both;
}

/* Interview Input */
.interview-input-container {
    display: flex;
    gap: 10px;
}

#interview-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid rgba(0, 255, 136, 0.3);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    outline: none;
    transition: all 0.3s ease;
}

#interview-input:focus {
    border-color: rgba(0, 255, 136, 0.6);
    box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
}

.submit-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
}

/* Close Button */
.splash-close-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 20px;
}

.splash-close-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 136, 0.5);
}

.splash-close-btn.hidden {
    display: none;
}

/* Responsive */
@media (max-width: 768px) {
    .action-splash-container {
        width: 95%;
        padding: 30px 20px;
    }
    
    .splash-title {
        font-size: 24px;
    }
    
    .splash-subtitle {
        font-size: 14px;
    }
}
`;

// ============================================================================
// 📤 EXPORT
// ============================================================================

// Make available globally
window.showActionSplash = showActionSplash;
window.LEAD_CAPTURE_CONFIGS = LEAD_CAPTURE_CONFIGS;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showActionSplash, LEAD_CAPTURE_CONFIGS, ACTION_SPLASH_STYLES };
}
