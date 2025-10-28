/**
 * =============================================================================
 * MOBILE-WISE AI FORMVISER - UNIFIED ACTION SYSTEM
 * =============================================================================
 * Consolidates ALL action button functionality into ONE file:
 * - Communication Action Center overlay (teal gradient with frosted buttons)
 * - Lead capture interview system (AI-powered question flow)
 * - Email integration
 * - All 5 action configurations
 * 
 * Uses YOUR existing CSS: action-buttons-frosted-style.css
 * Version: 1.0.0 - Final Consolidated Edition
 * Author: Captain - Mobile-Wise AI Empire
 * =============================================================================
 */

(function() {
    'use strict';

    console.log('🚀 Mobile-Wise Action System - Loading Unified System...');

    // =========================================================================
    // SECTION 1: LEAD CAPTURE CONFIGURATIONS
    // =========================================================================

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

    // =========================================================================
    // SECTION 2: ACTION BUTTON CONFIGURATIONS
    // =========================================================================

    const ACTION_BUTTONS = [
        {
            id: 'request-call',
            title: 'Request a Call',
            description: 'Receive a call within 5 minutes',
            icon: '📞',
            cssClass: 'request-call',
            urgent: false
        },
        {
            id: 'free-consultation',
            title: 'Get a Free Consultation',
            description: 'Complete consultation booking with expert advisor',
            icon: '💼',
            cssClass: 'free-consultation',
            urgent: false
        },
        {
            id: 'urgent-call',
            title: '🚨 Get an Immediate Call',
            description: 'Priority response - Call back within 2 minutes',
            icon: '🚨',
            cssClass: 'urgent-call',
            urgent: true
        },
        {
            id: 'pre-qualify',
            title: 'Get Pre-Qualified',
            description: 'Quick qualification - Answer a few simple questions',
            icon: '✅',
            cssClass: 'pre-qualify',
            urgent: false
        },
        {
            id: 'free-book',
            title: 'Free Book: Get 7 Secrets',
            description: 'Download your free guide for selling your practice',
            icon: '📚',
            cssClass: 'free-book',
            urgent: false
        }
    ];

    // =========================================================================
    // SECTION 3: COMMUNICATION ACTION CENTER (OVERLAY)
    // =========================================================================

    /**
     * Shows the Communication Action Center overlay
     * Displays 5 frosted glass buttons using YOUR CSS classes
     */
    function showCommunicationActionCenter() {
        console.log('🎯 Showing Communication Action Center');
        
        // Remove any existing overlay
        const existing = document.getElementById('action-center-overlay');
        if (existing) {
            existing.remove();
        }
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'action-center-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 128, 128, 0.95), rgba(0, 96, 96, 0.95));
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Create buttons container using YOUR CSS classes
        const buttonsHTML = ACTION_BUTTONS.map(button => `
            <div class="action-btn-frosted ${button.cssClass}" 
                 onclick="handleActionButtonClick('${button.id}')">
                <div class="action-btn-content">
                    <div class="action-btn-title">${button.title}</div>
                    <div class="action-btn-description">${button.description}</div>
                </div>
                <div class="action-btn-icon">${button.icon}</div>
            </div>
        `).join('');
        
        // Create container content
        overlay.innerHTML = `
            <div class="action-buttons-container" style="
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 40px;
                max-width: 800px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <h2 style="
                    text-align: center;
                    color: #008080;
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 30px 0;
                ">Communication Action Center</h2>
                ${buttonsHTML}
            </div>
        `;
        
        // Close on overlay click (not container)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeCommunicationActionCenter();
            }
        });
        
        // Add to page and fade in
        document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.style.opacity = '1';
            const container = overlay.querySelector('.action-buttons-container');
            if (container) container.style.transform = 'scale(1)';
        }, 10);
        
        console.log('✅ Communication Action Center displayed');
    }

    /**
     * Closes the Communication Action Center overlay
     */
    function closeCommunicationActionCenter() {
        const overlay = document.getElementById('action-center-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }

    /**
     * Handles action button clicks from the overlay
     */
    function handleActionButtonClick(actionId) {
        console.log(`🎯 Action button clicked: ${actionId}`);
        
        // Close action center
        closeCommunicationActionCenter();
        
        // Wait for close animation, then show lead capture
        setTimeout(() => {
            showActionSplash(actionId);
        }, 300);
    }

    // =========================================================================
    // SECTION 4: AI LEAD CAPTURE INTERVIEW SYSTEM
    // =========================================================================

    /**
     * Action Splash Screen Class
     * Handles AI-powered interview flow and email submission
     */
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
         * Show the splash screen
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
         * Create splash HTML element
         */
        createSplashElement() {
            const splash = document.createElement('div');
            splash.className = 'action-splash-overlay';
            splash.innerHTML = `
                <div class="action-splash-container" ${this.config.urgencyFlag ? 'data-urgent="true"' : ''}>
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

            // Add inline styles for splash screen
            this.injectSplashStyles();

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
         * Inject splash screen styles
         */
        injectSplashStyles() {
            if (document.getElementById('action-splash-styles')) return;

            const styleEl = document.createElement('style');
            styleEl.id = 'action-splash-styles';
            styleEl.textContent = `
                .action-splash-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .action-splash-overlay.active {
                    opacity: 1;
                }

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

                .action-splash-container[data-urgent="true"] .splash-glow-effect {
                    background: radial-gradient(circle, rgba(255, 68, 68, 0.3) 0%, transparent 70%);
                }

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
            document.head.appendChild(styleEl);
        }

        /**
         * Start AI Interview Process
         */
        startAIInterview() {
            setTimeout(() => {
                this.askNextQuestion();
            }, 800);
        }

        /**
         * Ask the next question
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
         * Add AI message to chat
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
         * Add user message to chat
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
         * Handle user response
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
         * Complete the interview
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
         * Send email
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

                // Log email (replace with actual email service)
                console.log('📧 Email Data:', emailData);
                console.log('📧 Email Body:', emailBody);

                // TODO: Replace with your actual email service
                // Example: emailjs.send('SERVICE_ID', 'TEMPLATE_ID', emailData);
                
                return true;
            } catch (error) {
                console.error('❌ Email error:', error);
                return false;
            }
        }

        /**
         * Route to existing full lead capture system
         */
        routeToExistingSystem() {
            console.log('🔀 Routing to existing full lead capture system...');
            
            // Call your existing initializeLeadCapture function
            if (typeof window.initializeLeadCapture === 'function') {
                window.initializeLeadCapture();
            } else {
                console.error('❌ initializeLeadCapture function not found');
            }
        }

        /**
         * Close splash screen
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

    /**
     * Show action splash screen
     * Main entry point for lead capture
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

    // =========================================================================
    // SECTION 5: GLOBAL EXPORTS
    // =========================================================================

    // Make functions available globally
    window.showCommunicationActionCenter = showCommunicationActionCenter;
    window.closeCommunicationActionCenter = closeCommunicationActionCenter;
    window.handleActionButtonClick = handleActionButtonClick;
    window.showActionSplash = showActionSplash;
    window.LEAD_CAPTURE_CONFIGS = LEAD_CAPTURE_CONFIGS;
    window.ACTION_BUTTONS = ACTION_BUTTONS;

    console.log('✅ Mobile-Wise Action System - Unified System Loaded');
    console.log('📦 Available functions:', {
        showCommunicationActionCenter: typeof showCommunicationActionCenter,
        showActionSplash: typeof showActionSplash,
        LEAD_CAPTURE_CONFIGS: Object.keys(LEAD_CAPTURE_CONFIGS),
        ACTION_BUTTONS: ACTION_BUTTONS.length
    });

})();
