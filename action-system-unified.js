// ================================
// ACTION SYSTEM UNIFIED - FINAL VERSION
// 5-Button Corporate Design with 3 Lead Capture Flows
// CLEANED VERSION - No restore code for old buttons
// ================================

console.log('🎯 ACTION SYSTEM UNIFIED - Loading (FINAL CLEANED VERSION)...');

// ================================
// EMAILJS CONFIGURATION
// ================================
const EMAILJS_CONFIG = {
    serviceId: 'service_b9bppgb',
    publicKey: '7-9oxa3UC3uKxtqGM',
    templates: {
        consultation: 'template_8i0k6hr',  // Request A Call
        clickToCall: 'template_8i0k6hr',   // Same as consultation
        freeBook: 'template_uix9cyx'        // Free Book
    }
};

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('✅ EmailJS initialized with public key');
})();

// ================================
// GLOBAL LEAD CAPTURE STATE
// ================================
window.isInLeadCapture = false;
window.currentLeadData = null;
window.currentCaptureType = null;

// ================================
// FORM VALIDATION
// ================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

function formatEmailFromSpeech(speechText) {
    let formattedEmail = speechText.toLowerCase().trim();
    formattedEmail = formattedEmail
        .replace(/\s*at\s+/g, '@')
        .replace(/\s*dot\s+/g, '.')
        .replace(/\s+/g, '')
        .replace(/,/g, '');
    console.log('📧 Email conversion:', speechText, '→', formattedEmail);
    return formattedEmail;
}

// ================================
// COMMUNICATION ACTION CENTER - 5 BUTTON LAYOUT
// ================================
function showCommunicationActionCenter(context = 'consultation') {
    console.log('🎯 Showing Communication Action Center (5-BUTTON) - Context:', context);
    
    // Check if already exists
    if (document.getElementById('communication-action-center')) {
        console.log('⚠️ Action Center already exists');
        return;
    }
    
    // 🆕 HIDE OLD ACTION BUTTONS (but don't track them for restore)
    console.log('🧹 Hiding old action buttons...');
    
    // Hide all old action buttons by class
    const oldButtons = document.querySelectorAll('.action-button-dynamic, .quick-btn');
    oldButtons.forEach(button => {
        // Don't hide if it's part of the new Action Center
        if (!button.closest('#communication-action-center')) {
            button.style.display = 'none';
            console.log('👻 Hidden old button:', button.id || button.textContent);
        }
    });
    
    // Hide specific button IDs if they exist
    const buttonIds = ['cta1', 'cta2', 'cta3', 'smartButton'];
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.style.display = 'none';
            console.log('👻 Hidden button by ID:', id);
        }
    });
    
    // Hide button containers
    const containers = document.querySelectorAll('.action-buttons-container, .quick-questions, .quick-buttons');
    containers.forEach(container => {
        // Don't hide if it contains the new Action Center
        if (!container.querySelector('#communication-action-center')) {
            const oldStyleDisplay = container.style.display;
            container.style.display = 'none';
            console.log('👻 Hidden container:', container.className, '(was:', oldStyleDisplay, ')');
        }
    });
    
    console.log('✅ Old action buttons hidden');
    
    const chatContainer = document.getElementById('chatMessages') || 
                         document.querySelector('.chat-messages') || 
                         document.querySelector('#messages') ||
                         document.querySelector('.messages-container');
    
    if (!chatContainer) {
        console.error('❌ Could not find chat container');
        return;
    }
    
    const actionCenter = document.createElement('div');
    actionCenter.id = 'communication-action-center';
    actionCenter.className = 'action-center-inline';
    
    actionCenter.innerHTML = `
        <div class="frosted-container" style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 30px;
            margin: 20px auto;
            max-width: 650px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
        ">
            <!-- Header with Avatar -->
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 24px;
            ">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1755209453856_avatar%20right.png" 
                     alt="Assistant Avatar" 
                     style="
                         width: 60px;
                         height: 60px;
                         border-radius: 50%;
                         margin-right: 16px;
                         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                     ">
                <h3 style="
                    color: #2c3e50;
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                ">Communication Action Center</h3>
            </div>
            
            <!-- Action Buttons - 5 Button Layout -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Row 1: Click-to-Call & URGENT CALL -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <button class="action-btn royal-blue-btn" onclick="handleActionButton('click-to-call')" style="
                        background: #4169e1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 20px;
                        font-size: 17px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
                        text-align: center;
                    ">
                        Click-to-Call
                    </button>
                    
                    <button class="action-btn urgent-btn" onclick="handleActionButton('urgent-call')" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 20px;
                        font-size: 17px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
                        text-align: center;
                    ">
                        URGENT CALL
                    </button>
                </div>
                
                <!-- Row 2: FREE Consultation & FREE BOOK -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <button class="action-btn royal-blue-btn" onclick="handleActionButton('free-consultation')" style="
                        background: #4169e1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 20px;
                        font-size: 17px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
                        text-align: center;
                    ">
                        FREE Consultation
                    </button>
                    
                    <button class="action-btn royal-blue-btn" onclick="handleActionButton('free-book')" style="
                        background: #4169e1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 20px;
                        font-size: 17px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
                        text-align: center;
                    ">
                        FREE BOOK
                    </button>
                </div>
                
                <!-- Row 3: Skip for Now (Full Width) -->
                <button class="action-btn skip-btn" onclick="handleActionButton('skip')" style="
                    background: #95a5a6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 20px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(149, 165, 166, 0.3);
                    text-align: center;
                    width: 100%;
                ">
                    Skip for Now
                </button>
            </div>
        </div>
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .action-center-inline {
            width: 100%;
            animation: slideInFromBottom 0.4s ease-out;
        }
        
        @keyframes slideInFromBottom {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .royal-blue-btn:hover {
            background: #3557c7 !important;
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 25px rgba(65, 105, 225, 0.4) !important;
        }
        
        .royal-blue-btn:active {
            transform: translateY(-1px) scale(0.98);
        }
        
        .urgent-btn:hover {
            background: #c0392b !important;
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4) !important;
        }
        
        .urgent-btn:active {
            transform: translateY(-1px) scale(0.98);
        }
        
        .skip-btn:hover {
            background: #7f8c8d !important;
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 25px rgba(149, 165, 166, 0.4) !important;
        }
        
        .skip-btn:active {
            transform: translateY(-1px) scale(0.98);
        }
    `;
    document.head.appendChild(styleElement);
    
    chatContainer.appendChild(actionCenter);
    
    setTimeout(() => {
        actionCenter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    console.log('✅ Communication Action Center displayed (5-BUTTON LAYOUT)');
}

// ================================
// HIDE ACTION CENTER - CLEANED VERSION
// No restore code - old buttons stay hidden
// ================================
function hideCommunicationActionCenter() {
    const actionCenter = document.getElementById('communication-action-center');
    if (actionCenter) {
        actionCenter.style.animation = 'slideOutToBottom 0.3s ease-in';
        setTimeout(() => {
            actionCenter.remove();
            console.log('✅ Communication Action Center removed');
            // 🎯 NO RESTORE CODE - Old buttons stay hidden permanently
        }, 300);
    }
}

// ================================
// ACTION BUTTON ROUTER
// ================================
function handleActionButton(action) {
    console.log('🎯 Action button clicked:', action);
    
    hideCommunicationActionCenter();
    
    switch(action) {
        case 'click-to-call':
            initializeClickToCallCapture();
            break;
        case 'urgent-call':
            initiateUrgentCall();
            break;
        case 'free-consultation':
            initializeConsultationCapture();
            break;
        case 'free-book':
            initializeFreeBookCapture();
            break;
        case 'skip':
            console.log('User chose to skip');
            if (window.addSystemMessage) {
                window.addSystemMessage("No problem! Feel free to ask me anything else about your practice.");
            }
            break;
    }
}

// ================================
// URGENT CALL - DIRECT DIAL
// ================================
function initiateUrgentCall() {
    console.log('📞 Initiating urgent call to Bruce...');
    
    // Show message
    if (window.addAIMessage) {
        window.addAIMessage("Connecting you to Bruce right now at 856-304-1035...");
    }
    
    // Initiate call
    window.location.href = 'tel:+1-856-304-1035';
    
    // Show follow-up message after brief delay
    setTimeout(() => {
        if (window.addAIMessage) {
            window.addAIMessage("Is there anything else I can help you with while you wait?");
        }
    }, 2000);
}

// ================================
// LEAD CAPTURE 1: FREE CONSULTATION
// ================================
function initializeConsultationCapture() {
    console.log('🚀 Starting FREE Consultation capture...');
    
    if (window.isInLeadCapture) return;
    
    window.isInLeadCapture = true;
    window.currentCaptureType = 'consultation';
    window.currentLeadData = {
        name: '',
        phone: '',
        email: '',
        contactTime: '',
        captureType: 'consultation',
        step: 0,
        tempAnswer: '',
        questions: [
            "Perfect. Let's start with your full name, please.",
            "What's the best phone number to reach you?",
            "What's your email address?",
            "When would be the best time for our specialist to contact you?"
        ]
    };
    
    setTimeout(() => {
        askLeadQuestion();
    }, 500);
}

// ================================
// LEAD CAPTURE 2: CLICK-TO-CALL
// ================================
function initializeClickToCallCapture() {
    console.log('🚀 Starting Click-to-Call capture...');
    
    if (window.isInLeadCapture) return;
    
    window.isInLeadCapture = true;
    window.currentCaptureType = 'clickToCall';
    window.currentLeadData = {
        name: '',
        phone: '',
        reason: '',
        captureType: 'clickToCall',
        step: 0,
        tempAnswer: '',
        questions: [
            "What's your full name?",
            "What's the best phone number to reach you?",
            "What's this regarding - are you looking to buy, sell, or evaluate a practice?"
        ]
    };
    
    setTimeout(() => {
        askLeadQuestion();
    }, 500);
}

// ================================
// LEAD CAPTURE 3: FREE BOOK
// ================================
function initializeFreeBookCapture() {
    console.log('🚀 Starting FREE BOOK capture...');
    
    if (window.isInLeadCapture) return;
    
    window.isInLeadCapture = true;
    window.currentCaptureType = 'freeBook';
    window.currentLeadData = {
        name: '',
        email: '',
        phone: '',
        wantsEvaluation: null,
        captureType: 'freeBook',
        step: 0,
        tempAnswer: '',
        questions: [
            "What's your full name?",
            "What email should I send Bruce's '7 Secrets to Selling Your Practice' book to?",
            "Would you be interested in a practice evaluation meeting?"
        ]
    };
    
    setTimeout(() => {
        askLeadQuestion();
    }, 500);
}

// ================================
// UNIVERSAL LEAD QUESTION ASKER
// ================================
function askLeadQuestion() {
    if (!window.isInLeadCapture || !window.currentLeadData) return;
    
    const data = window.currentLeadData;
    
    console.log('🎯 Asking question for step:', data.step);
    
    if (data.step < data.questions.length) {
        const question = data.questions[data.step];
        console.log('🎯 Question:', question);
        
        if (window.addAIMessage) {
            window.addAIMessage(question);
        }
        
        if (window.speakText) {
    window.speakText(question);
    
    // 🆕 MANUALLY START LISTENING AFTER AI SPEAKS
    setTimeout(() => {
        if (window.startRealtimeListening) {
            console.log('🎤 Lead Capture: Manually starting listening for user answer');
            window.startRealtimeListening();
        }
    }, 4000); // ⏰ Wait 4 seconds for speech to finish
}
} else {
    completeLeadCapture();
}
}

// ================================
// PROCESS USER RESPONSE
// ================================
function processLeadResponse(userInput) {
    if (!window.isInLeadCapture || !window.currentLeadData) return false;
    
    console.log('🎯 Processing lead response:', userInput);
    
    const data = window.currentLeadData;
    let processedInput = userInput;
    
    // Format email if on email question
    if (data.captureType === 'consultation' && data.step === 2) {
        processedInput = formatEmailFromSpeech(userInput);
    } else if (data.captureType === 'freeBook' && data.step === 1) {
        processedInput = formatEmailFromSpeech(userInput);
    }
    
    // Handle yes/no for evaluation question in FREE BOOK flow
    if (data.captureType === 'freeBook' && data.step === 2) {
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes('yes') || lowerInput.includes('yeah') || lowerInput.includes('sure')) {
            data.wantsEvaluation = true;
            processedInput = 'Yes';
        } else if (lowerInput.includes('no') || lowerInput.includes('nope') || lowerInput.includes('not')) {
            data.wantsEvaluation = false;
            processedInput = 'No';
        }
    }
    
    data.tempAnswer = processedInput;
    showConfirmationButtons(processedInput);
    
    return true;
}

// ================================
// CONFIRMATION BUTTONS
// ================================
function showConfirmationButtons(answer) {
    const chatMessages = document.getElementById('chatMessages') ||
                         document.querySelector('.chat-messages');
    
    if (!chatMessages) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'confirmation-buttons';
    buttonContainer.innerHTML = `
        <div style="
            text-align: center; 
            margin: 15px 0; 
            padding: 20px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 15px;
            border: 2px solid rgba(255,255,255,0.2);
        ">
            <div style="
                margin-bottom: 15px; 
                color: white; 
                font-size: 18px;
                font-weight: bold;
            ">
                "${answer}"
            </div>
            <div style="margin-bottom: 20px; color: #ccc; font-size: 14px;">
                Is this correct?
            </div>
            <div style="
                display: flex; 
                justify-content: center; 
                gap: 20px;
                flex-wrap: wrap;
            ">
                <button onclick="confirmAnswer(true)" style="
                    background: linear-gradient(135deg, #4CAF50, #8BC34A);
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    border-radius: 25px; 
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                    min-width: 120px;
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                ">
                    ✅ Correct
                </button>
                <button onclick="confirmAnswer(false)" style="
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    border-radius: 25px; 
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                    min-width: 120px;
                    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                ">
                    🔄 Redo
                </button>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(buttonContainer);
    
    if (chatMessages.scrollTop !== undefined) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function removeLastUserMessage() {
    const chatMessages = document.getElementById('chatMessages') ||
                         document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const userMessages = chatMessages.querySelectorAll('.user-message');
    if (userMessages.length > 0) {
        userMessages[userMessages.length - 1].remove();
    }
}

function confirmAnswer(isCorrect) {
    console.log('🎯 User clicked:', isCorrect ? 'Correct' : 'Redo');
    
    const buttonContainer = document.querySelector('.confirmation-buttons');
    if (buttonContainer) {
        buttonContainer.remove();
    }
    
    if (isCorrect) {
        saveConfirmedAnswer();
        window.currentLeadData.step++;
        
        // Special handling for FREE BOOK flow
        if (window.currentCaptureType === 'freeBook' && window.currentLeadData.step === 3) {
            if (window.currentLeadData.wantsEvaluation === false) {
                // Skip phone question, go straight to completion
                completeLeadCapture();
                return;
            } else if (window.currentLeadData.wantsEvaluation === true) {
                // Add phone question
                window.currentLeadData.questions.push("What's your phone number to coordinate?");
            }
        }
        
        if (window.currentLeadData.step < window.currentLeadData.questions.length) {
            setTimeout(() => {
                askLeadQuestion();
            }, 800);
        } else {
            completeLeadCapture();
        }
        
    } else {
        // Redo
        removeLastUserMessage();
        window.currentLeadData.tempAnswer = '';
        
        setTimeout(() => {
            if (window.startRealtimeListening) {
                window.startRealtimeListening();
            }
        }, 100);
    }
}

function saveConfirmedAnswer() {
    const data = window.currentLeadData;
    const step = data.step;
    
    if (data.captureType === 'consultation') {
        const fields = ['name', 'phone', 'email', 'contactTime'];
        data[fields[step]] = data.tempAnswer;
    } else if (data.captureType === 'clickToCall') {
        const fields = ['name', 'phone', 'reason'];
        data[fields[step]] = data.tempAnswer;
    } else if (data.captureType === 'freeBook') {
        if (step === 0) data.name = data.tempAnswer;
        else if (step === 1) data.email = data.tempAnswer;
        else if (step === 2) {} // Already handled wantsEvaluation
        else if (step === 3) data.phone = data.tempAnswer;
    }
    
    console.log('✅ Saved answer:', data.tempAnswer);
}

// Make globally accessible
window.confirmAnswer = confirmAnswer;
window.processLeadResponse = processLeadResponse;

// ================================
// COMPLETE LEAD CAPTURE & SEND EMAIL
// ================================
function completeLeadCapture() {
    console.log('🎯 Completing lead capture...');
    
    const data = window.currentLeadData;
    const type = window.currentCaptureType;
    
    // Prepare email parameters based on capture type
    let templateId = '';
    let templateParams = {};
    
    if (type === 'consultation') {
        templateId = EMAILJS_CONFIG.templates.consultation;
        templateParams = {
            to_email: 'bruce@newclientsinc.com',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            contact_time: data.contactTime,
            message: `FREE CONSULTATION REQUEST\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nBest Time: ${data.contactTime}`,
            timestamp: new Date().toLocaleString()
        };
    } else if (type === 'clickToCall') {
        templateId = EMAILJS_CONFIG.templates.clickToCall;
        templateParams = {
            to_email: 'bruce@newclientsinc.com',
            from_name: data.name,
            phone: data.phone,
            message: `CLICK-TO-CALL REQUEST\n\nName: ${data.name}\nPhone: ${data.phone}\nReason: ${data.reason}`,
            timestamp: new Date().toLocaleString()
        };
    } else if (type === 'freeBook') {
        templateId = EMAILJS_CONFIG.templates.freeBook;
        templateParams = {
            to_email: data.email,
            from_name: data.name,
            book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG',
            message: `Here's your free copy of "7 Secrets to Selling Your Practice"!${data.wantsEvaluation ? '\n\nInterested in evaluation - Phone: ' + data.phone : ''}`,
            timestamp: new Date().toLocaleString()
        };
    }
    
    console.log('📧 Sending email with template:', templateId);
    console.log('📧 Parameters:', templateParams);
    
    // Send email
    emailjs.send(EMAILJS_CONFIG.serviceId, templateId, templateParams)
        .then(function(response) {
            console.log('✅ EMAIL SENT!', response.status, response.text);
            
            // Reset capture state
            window.isInLeadCapture = false;
            window.currentLeadData = null;
            window.currentCaptureType = null;
            
            // Show success message
            let successMessage = '';
            if (type === 'consultation') {
                successMessage = `Perfect ${data.name}! Our specialist will contact you at ${data.contactTime}. Is there anything else I can help you with?`;
            } else if (type === 'clickToCall') {
                successMessage = `Great ${data.name}! Bruce will call you at ${data.phone} shortly. Anything else I can help with?`;
            } else if (type === 'freeBook') {
                successMessage = `Excellent ${data.name}! I've sent Bruce's book to ${data.email}. Check your inbox!${data.wantsEvaluation ? ' Someone will contact you about the evaluation.' : ''}`;
            }
            
            if (window.addAIMessage) {
                window.addAIMessage(successMessage);
            }
            if (window.speakText) {
                window.speakText(successMessage);
            }
            
            // Show success banner if available
            if (window.showUniversalBanner) {
                window.showUniversalBanner('emailSent');
            }
            
        }, function(error) {
            console.error('❌ EMAIL FAILED:', error);
            
            if (window.addAIMessage) {
                window.addAIMessage("I'm sorry, there was an issue. Please try again or call Bruce directly at 856-304-1035.");
            }
            
            window.isInLeadCapture = false;
        });
}

// ================================
// GLOBAL EXPORTS
// ================================
window.showCommunicationActionCenter = showCommunicationActionCenter;
window.hideCommunicationActionCenter = hideCommunicationActionCenter;
window.handleActionButton = handleActionButton;
window.initializeConsultationCapture = initializeConsultationCapture;
window.initializeClickToCallCapture = initializeClickToCallCapture;
window.initializeFreeBookCapture = initializeFreeBookCapture;
window.initiateUrgentCall = initiateUrgentCall;

console.log('✅ ACTION SYSTEM UNIFIED - Loaded successfully (FINAL CLEANED VERSION - No restore code)');
