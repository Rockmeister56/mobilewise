// ================================
// ACTION SYSTEM UNIFIED - FINAL VERSION
// 5-Button Corporate Design with 3 Lead Capture Flows
// CLEANED VERSION - No restore code for old buttons
// ================================

// ================================
// 🛡️ GLOBAL ACTION CENTER CONFLICT RESOLUTION
// ================================
console.log('🛡️ Loading Global Action Center Conflict Resolution...');

// Global state management
window.actionCenterState = {
    activeSystem: null, // 'original', 'cloned', null
    isProcessing: false,
    lastActionTime: 0,
    cooldownPeriod: 2000 // 2 seconds
};

// Global lock function
window.acquireActionCenterLock = function(systemType) {
    const now = Date.now();
    
    // 🚨 Check if we're in cooldown period
    if (now - window.actionCenterState.lastActionTime < window.actionCenterState.cooldownPeriod) {
        console.log('🛡️ COOLDOWN: Action center locked - too soon since last action');
        return false;
    }
    
    // 🚨 Check if another system is active
    if (window.actionCenterState.activeSystem && window.actionCenterState.activeSystem !== systemType) {
        console.log(`🛡️ BLOCKED: ${systemType} cannot start - ${window.actionCenterState.activeSystem} is active`);
        return false;
    }
    
    // 🚨 Check if already processing
    if (window.actionCenterState.isProcessing) {
        console.log('🛡️ BLOCKED: Action already in progress');
        return false;
    }
    
    // ✅ ACQUIRE LOCK
    window.actionCenterState.activeSystem = systemType;
    window.actionCenterState.isProcessing = true;
    window.actionCenterState.lastActionTime = now;
    
    console.log(`🛡️ LOCK ACQUIRED: ${systemType} can proceed`);
    return true;
};

// Global release function
window.releaseActionCenterLock = function() {
    console.log('🛡️ LOCK RELEASED');
    window.actionCenterState.activeSystem = null;
    window.actionCenterState.isProcessing = false;
};

// Auto-release safety timeout
setInterval(() => {
    if (window.actionCenterState.isProcessing && 
        (Date.now() - window.actionCenterState.lastActionTime > 10000)) { // 10 second timeout
        console.log('🛡️ SAFETY TIMEOUT: Forcing lock release');
        window.releaseActionCenterLock();
    }
}, 5000);

console.log('🎯 ACTION SYSTEM UNIFIED - Loading (FINAL CLEANED VERSION)...');

const EMAILJS_CONFIG = {
    serviceId: 'service_b9bppgb',
    publicKey: '7-9oxa3UC3uKxtqGM',
    templates: {
        consultation: 'template_yf09xm5',        // Internal notification for consultation
        clickToCall: 'template_8i0k6hr',         // Internal notification for call requests
        preQualifier: 'template_uix9cyx',        // Internal notification for pre-qualifier
        clientConfirmation: 'template_8kx812d'   // NEW: Client confirmation email with free book
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
// ENHANCED ORIGINAL ACTION CENTER
// ================================
function showCommunicationActionCenter(mode = 'default') {
    console.log('🎯 Showing Enhanced Action Center - Mode:', mode);
    
    // Remove any existing action center
    hideCommunicationActionCenter();
    
    const actionCenter = document.createElement('div');
    actionCenter.id = 'communication-action-center';
    
    // 🎯 DIFFERENT MODES, SAME CONTAINER
    if (mode === 'avatar') {
        // Your talking avatar version
        actionCenter.innerHTML = `
            <div style="...avatar styling...">
                <!-- Your avatar video -->
                <video autoplay loop muted playsinline>
                    <source src="your-avatar-video.mp4" type="video/mp4">
                </video>
                <!-- Avatar-specific buttons -->
                ${getAvatarButtons()}
            </div>
        `;
    } else if (mode === 'corporate') {
        // Original 5-button corporate design
        actionCenter.innerHTML = `
            <div style="...corporate styling...">
                <!-- Corporate header -->
                ${getCorporateButtons()}
            </div>
        `;
    } else {
        // Default mode
        actionCenter.innerHTML = `
            <div style="...default styling...">
                ${getDefaultButtons()}
            </div>
        `;
    }
    
    // Add to page
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(actionCenter);
    }
    
    console.log('✅ Enhanced Action Center displayed - Mode:', mode);
}

// 🎯 DIFFERENT BUTTON SETS FOR DIFFERENT MODES
function getAvatarButtons() {
    return `
        <!-- Your specific avatar buttons -->
        <button onclick="handleAvatarAction('consultation')">📅 Book with Avatar</button>
        <button onclick="handleAvatarAction('urgent')">🚨 Avatar Urgent</button>
    `;
}

function getCorporateButtons() {
    return `
        <!-- Original 5-button layout -->
        <button onclick="handleActionButton('click-to-call')">📞 Request A Call</button>
        <button onclick="handleActionButton('urgent-call')">🚨 URGENT CALL</button>
        <button onclick="handleActionButton('free-consultation')">📅 BOOK Consultation</button>
        <button onclick="handleActionButton('pre-qualifier')">✅ Pre-Qualification</button>
        <button onclick="handleActionButton('skip')">⏭️ Skip for Now</button>
    `;
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

function handleActionButton(action) {
    console.log('🎯 Action button clicked:', action);
    
    // 🛑 CHECK IF WE'RE ALREADY PROCESSING
    if (window.isProcessingAction) {
        console.log('🛑 Action already in progress - skipping');
        return;
    }
    
    window.isProcessingAction = true;
    
    hideCommunicationActionCenter();
    
    // 🆕 CALL COMPLETION HANDLER
    if (typeof handleActionCenterCompletion === 'function') {
        handleActionCenterCompletion();
    }
    
    switch(action) {
        case 'click-to-call':
            // 🆕 SHOW CLICK TO CALL BANNER (with anti-loop protection)
            if (typeof showUniversalBanner === 'function') {
                showUniversalBanner('clickToCall', { autoTriggerActionCenter: false });
            }
            initializeClickToCallCapture();
            break;
            
        case 'urgent-call':
            if (typeof showUniversalBanner === 'function') {
                showUniversalBanner('urgent', { autoTriggerActionCenter: false });
            }
            initiateUrgentCall();
            break;
            
        case 'free-consultation':
            if (typeof showUniversalBanner === 'function') {
                showUniversalBanner('setAppointment', { autoTriggerActionCenter: false });
            }
            initializeConsultationCapture();
            break;
            
        case 'pre-qualifier':
            if (typeof showUniversalBanner === 'function') {
                showUniversalBanner('preQualifier', { autoTriggerActionCenter: false });
            }
            initializePreQualifierCapture();
            break;
            
        case 'skip':
            console.log('User chose to skip');
            if (window.addSystemMessage) {
                window.addSystemMessage("No problem! Feel free to ask me anything else about your practice.");
            }
            break;
    }
    
    // Reset processing flag after a delay
    setTimeout(() => {
        window.isProcessingAction = false;
    }, 1000);
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
// 🆕 AVOID AVATAR INTERRUPTIONS DURING LEAD CAPTURE
// ================================
function disableAvatarDuringLeadCapture() {
    // Override the avatar function during lead capture
    if (window.showAvatarSorryMessage) {
        const originalShowAvatar = window.showAvatarSorryMessage;
        window.showAvatarSorryMessage = function() {
            if (window.isInLeadCapture || window.isInEmailPermissionPhase) {
                console.log('🛡️ Lead capture active - avatar disabled');
                return; // Skip avatar during lead capture
            }
            return originalShowAvatar.apply(this, arguments);
        };
        console.log('✅ Avatar interruptions disabled during lead capture');
    }
}

// ================================
// UNIVERSAL LEAD QUESTION ASKER
// ================================
function askLeadQuestion() {
    window.lastProcessedTranscript = null; // 🔄 Reset for new question
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
            
            // 🎯 SMART TIMING: Wait for speech to actually finish BEFORE showing banner
            const checkSpeech = setInterval(() => {
                if (!window.isSpeaking) {
                    clearInterval(checkSpeech);
                    console.log('✅ AI finished speaking - starting listening NOW');
                    
                    // 🎤 NOW SHOW SPEAK NOW BANNER (after speech finishes)
                    console.log('🎤 LEAD CAPTURE: Triggering Speak Now banner for step', data.step);
                    if (window.showDirectSpeakNow && typeof window.showDirectSpeakNow === 'function') {
                        window.showDirectSpeakNow();
                        console.log('✅ Speak Now banner triggered via showDirectSpeakNow()');
                    }
                    
                    // 🚀 NOW WITH CONFLICT PROTECTION
                    if (isInLeadCapture && window.startRealtimeListening && !window.isCurrentlyListening) {
                        window.startRealtimeListening();
                    }
                }
            }, 100);

            // Safety timeout (10 seconds max)
            setTimeout(() => {
                clearInterval(checkSpeech);
                if (isInLeadCapture && window.startRealtimeListening && !window.isCurrentlyListening) {
                    console.log('⏰ Safety timeout - starting listening');
                    window.startRealtimeListening();
                }
            }, 10000);
        }
    } else {
        completeLeadCapture();
    }
}
// ================================
// PROCESS USER RESPONSE - FIXED VERSION
// ================================
function processLeadResponse(userInput) {
    if (!window.isInLeadCapture || !window.currentLeadData) return false;
    
    console.log('🎯 Processing lead response:', userInput);

     // 🎯 CRITICAL FIX: CLOSE BANNER WHEN PROCESSING RESPONSE
    if (typeof closeSpeakNowBanner === 'function') {
        console.log('🎯 LEAD CAPTURE: Closing banner before processing');
        closeSpeakNowBanner();
    }
    
    const data = window.currentLeadData;
    let processedInput = userInput;
    
    // Format email if on email question
    if (data.captureType === 'consultation' && data.step === 2) {
        processedInput = formatEmailFromSpeech(userInput);
    } else if (data.captureType === 'freeBook' && data.step === 1) {
        processedInput = formatEmailFromSpeech(userInput);
    }
    
    // 🆕 CRITICAL FIX: Only handle "NO" as conversation-ender for the FINAL question
    // For pre-qualifier flow, check if this is the LAST question (step 10)
    if (data.captureType === 'preQualifier' && data.step === 10) {
        // This is the FINAL question - "Will you need financing assistance for this acquisition?"
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes('no') || lowerInput.includes('nope') || lowerInput.includes('not')) {
            // This is the FINAL "no" that should end the conversation
            console.log('🎯 Final "NO" detected - ending pre-qualification flow');
            data.tempAnswer = 'No';
            showConfirmationButtons('No');
            return true;
        }
    }
    
    // 🆕 Handle yes/no for evaluation question in FREE BOOK flow (step 2)
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
    
    // 🆕 Handle CPA license question in PRE-QUALIFIER (step 4) - "NO" should continue flow
    if (data.captureType === 'preQualifier' && data.step === 4) {
        // This is the CPA license question - "NO" should NOT end conversation
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes('yes') || lowerInput.includes('licensed') || lowerInput.includes('cpa')) {
            processedInput = 'Yes';
        } else if (lowerInput.includes('no') || lowerInput.includes('not') || lowerInput.includes('pursuing')) {
            processedInput = 'No'; // This continues to next question
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

// ================================
// 🎯 UPDATED CONFIRM ANSWER FUNCTION (MERGED FROM confirmAnswer2.txt)
// ================================
function confirmAnswer(isCorrect) {
    console.log('🎯 User clicked:', isCorrect ? 'Correct' : 'Redo');

        // 🎯 CRITICAL FIX: CLOSE BANNER ON CONFIRMATION
    if (typeof closeSpeakNowBanner === 'function') {
        console.log('🎯 CONFIRMATION: Closing banner');
        closeSpeakNowBanner();
    }
    
    // Remove the confirmation buttons
    const buttonContainer = document.querySelector('.confirmation-buttons');
    if (buttonContainer) {
        buttonContainer.remove();
    }
    
    if (isCorrect) {
        // ✅ CORRECT - Save and move on
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
            // More questions to ask
            setTimeout(() => {
                askLeadQuestion();
            }, 800);
        } else {
            // ✅ FINAL STEP - COMPLETE LEAD CAPTURE
            setTimeout(() => {
                console.log('🎯 Final confirmation completed - completing lead capture!');
                completeLeadCapture();
            }, 800);
        }
        
    } else {
        // 🔄 REDO - LIGHTER cleanup approach with FORCE STOP
        console.log('🔄 Redo - clearing field and restarting speak sequence');
        
        // 🎯 FORCE BYPASS - Reset the timing check for user-initiated redo
        if (window.lastSequenceStart) window.lastSequenceStart = 0; // Reset timing so blocking allows restart
        if (window.speakSequenceActive) window.speakSequenceActive = false; // Force reset the flag
        
        // 🎯 FORCE STOP the active sequence first
        if (window.isInSpeakSequence) window.isInSpeakSequence = false; // Reset the flag that's blocking us
        if (window.recognition) {
            window.recognition.stop(); // Stop any active recognition
        }
        
        // ✅ KEEP the main fix - remove wrong answer FIRST
        removeLastUserMessage();
        
        // ✅ KEEP basic cleanup
        window.currentLeadData.tempAnswer = '';
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.value = '';
        }
        
        // ✅ KEEP the restart with slightly longer timeout for cleanup
        setTimeout(() => {
            if (window.showDirectSpeakNow) {
                window.showDirectSpeakNow(); // Restart the full red -> green sequence
            }
        }, 100); // Back to 100ms to allow force stop to complete
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
    } else if (data.captureType === 'preQualifier') {
        // 🆕 PRE-QUALIFIER DATA SAVING
        const fields = [
            'name', 'email', 'phone', 'experienceYears', 'licenseStatus',
            'acquisitionTimeline', 'budgetRange', 'geographicPreference',
            'practiceSize', 'specializationInterest', 'financingNeeded'
        ];
        data[fields[step]] = data.tempAnswer;
    }
    
    console.log('✅ Saved answer:', data.tempAnswer);
}

// Make globally accessible
window.confirmAnswer = confirmAnswer;
window.processLeadResponse = processLeadResponse;

// ================================
// COMPLETE LEAD CAPTURE & REQUEST EMAIL PERMISSION - FIXED VERSION
// ================================
function completeLeadCapture() {
    console.log('🎯 Completing lead capture...');

    // 🆕 NEW: EMERGENCY CLEANUP FIRST THING
    if (typeof emergencyStuckBannerFix === 'function') {
        emergencyStuckBannerFix();
    }
    
    const data = window.currentLeadData;
    const type = window.currentCaptureType;
    
    // 🎯 CRITICAL FIX: CLOSE ANY STUCK SPEAK NOW BANNER FIRST
    console.log('🧹 Closing any stuck Speak Now banner before email confirmation...');
    if (window.closeSpeakNowBanner && typeof window.closeSpeakNowBanner === 'function') {
        window.closeSpeakNowBanner();
    }
    
    // Also try the direct cleanup method
    const speakNowBanner = document.querySelector('.speak-now-banner, [class*="speakNow"], #speakNowBanner');
    if (speakNowBanner) {
        speakNowBanner.remove();
        console.log('✅ Removed stuck Speak Now banner');
    }
    
    // Stop any active listening
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    // Mark transition to email permission phase
    window.isInEmailPermissionPhase = true;
    
    // 🆕 NEW: Ask for email confirmation permission instead of sending immediately
    const emailPermissionMessage = `Perfect! Should I send a confirmation email to ${data.email} with all your details and next steps?`;
    
    if (window.addAIMessage) {
        window.addAIMessage(emailPermissionMessage);
    }
    
    // 🎯 CRITICAL: Wait a moment for the message to appear BEFORE speaking
    setTimeout(() => {
        if (window.speakText) {
            window.speakText(emailPermissionMessage);
            
            // Wait for speech to complete before showing buttons
            const checkSpeech = setInterval(() => {
                if (!window.isSpeaking) {
                    clearInterval(checkSpeech);
                    console.log('✅ AI finished speaking email question - showing buttons');
                    
                    // 🆕 NEW: Show confirmation buttons for email permission
                    showEmailConfirmationButtons(data, type);
                }
            }, 100);
            
            // Safety timeout
            setTimeout(() => {
                clearInterval(checkSpeech);
                showEmailConfirmationButtons(data, type);
            }, 10000);
        } else {
            // No speech system - just show buttons
            showEmailConfirmationButtons(data, type);
        }
    }, 500);
}

// ================================
// 🆕 EMERGENCY STUCK BANNER 
// ================================
function emergencyStuckBannerFix() {
    console.log('🚨 EMERGENCY: Fixing stuck banner...');
    
    // Stop listening
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    // Clear timeouts
    if (window.directSafetyTimeout) {
        clearTimeout(window.directSafetyTimeout);
        window.directSafetyTimeout = null;
    }
    
    // Remove banner
    const banners = document.querySelectorAll('.speak-now-banner, [class*="speakNow"], #speakNowBanner');
    banners.forEach(banner => banner.remove());
    
    // Reset states
    window.isListening = false;
    window.isRecording = false;
    window.speakSequenceActive = false;
    
    console.log('✅ Emergency cleanup complete');
}

// Make it globally accessible
window.emergencyStuckBannerFix = emergencyStuckBannerFix;

// ================================
// 🆕 EMERGENCY BANNER  
// ================================
function emergencyBannerCleanup() {
    console.log('🚨 EMERGENCY: Cleaning up all stuck banners...');
    
    // Close Speak Now banner
    if (window.closeSpeakNowBanner && typeof window.closeSpeakNowBanner === 'function') {
        window.closeSpeakNowBanner();
    }
    
    // Remove any Speak Now banner elements
    const stuckBanners = document.querySelectorAll('.speak-now-banner, [class*="speakNow"], #speakNowBanner, .speak-now-container');
    stuckBanners.forEach(banner => {
        banner.remove();
        console.log('✅ Removed stuck banner:', banner.className || banner.id);
    });
    
    // Remove confirmation buttons if any
    const confirmationButtons = document.querySelectorAll('.confirmation-buttons, .email-confirmation-buttons');
    confirmationButtons.forEach(buttons => {
        buttons.remove();
        console.log('✅ Removed old confirmation buttons');
    });
    
    // Stop any listening
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    // Reset states
    window.isListening = false;
    window.isRecording = false;
    window.speakSequenceActive = false;
}

// Make it globally accessible
window.emergencyBannerCleanup = emergencyBannerCleanup;

// ================================
// EMAIL CONFIRMATION BUTTONS - SIMPLE VERSION
// ================================
function showEmailConfirmationButtons(leadData, captureType) {
    const chatMessages = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (!chatMessages) return;

     // 🎯 CRITICAL: Emergency cleanup first
    emergencyBannerCleanup();
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'email-confirmation-buttons';
    buttonContainer.innerHTML = `
        <div style="text-align: center; margin: 20px 0; padding: 25px; background: rgba(255,255,255,0.1); border-radius: 15px; border: 2px solid rgba(255,255,255,0.2);">
            <div style="margin-bottom: 20px; color: white; font-size: 18px; font-weight: bold;">
                Send confirmation email to:<br>
                <span style="color: #4CAF50; font-size: 16px;">${leadData.email}</span>
            </div>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                <button onclick="handleEmailConfirmation(true, '${captureType}')" style="background: linear-gradient(135deg, #4CAF50, #8BC34A); color: white; border: none; padding: 15px 30px; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 16px; min-width: 140px;">
                    ✅ Yes, Send Email
                </button>
                <button onclick="handleEmailConfirmation(false, '${captureType}')" style="background: linear-gradient(135deg, #757575, #9E9E9E); color: white; border: none; padding: 15px 30px; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 16px; min-width: 140px;">
                    ⏭️ Skip Email
                </button>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(buttonContainer);
    buttonContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ================================
// HANDLE EMAIL CONFIRMATION - SIMPLE VERSION
// ================================
function handleEmailConfirmation(sendEmail, captureType) {
    console.log('🎯 Email confirmation:', sendEmail ? 'SENDING' : 'SKIPPING');
    
    // Remove confirmation buttons
    const buttonContainer = document.querySelector('.email-confirmation-buttons');
    if (buttonContainer) buttonContainer.remove();
    
    const data = window.currentLeadData;
    
    if (sendEmail) {
        // Send email
        if (window.addAIMessage) {
            window.addAIMessage("📧 Sending your confirmation email now...");
        }
        sendOriginalLeadEmail(data, captureType);
    } else {
        // Skip email - just continue conversation
        if (window.addAIMessage) {
            window.addAIMessage("No problem! Bruce will still contact you directly. Is there anything else I can help with?");
        }
        
        // Clear lead data
        window.isInLeadCapture = false;
        window.currentCaptureType = null;
        window.currentLeadData = null;
        
        // Wait then show Speak Now banner
        setTimeout(() => {
            if (window.showDirectSpeakNow) {
                window.showDirectSpeakNow();
            }
        }, 2000);
    }
}

// ================================
// COMPLETE LEAD CAPTURE & REQUEST EMAIL PERMISSION - FIXED VERSION
// ================================
function completeLeadCapture() {
    console.log('🎯 Completing lead capture...');

    // 🆕 NEW: EMERGENCY CLEANUP FIRST THING
    if (typeof emergencyStuckBannerFix === 'function') {
        emergencyStuckBannerFix();
    }
    
    const data = window.currentLeadData;
    const type = window.currentCaptureType;
    
    // 🎯 CRITICAL FIX: CLOSE ANY STUCK SPEAK NOW BANNER FIRST
    console.log('🧹 Closing any stuck Speak Now banner before email confirmation...');
    if (window.closeSpeakNowBanner && typeof window.closeSpeakNowBanner === 'function') {
        window.closeSpeakNowBanner();
    }
    
    // Also try the direct cleanup method
    const speakNowBanner = document.querySelector('.speak-now-banner, [class*="speakNow"], #speakNowBanner');
    if (speakNowBanner) {
        speakNowBanner.remove();
        console.log('✅ Removed stuck Speak Now banner');
    }
    
    // Stop any active listening
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    // Mark transition to email permission phase
    window.isInEmailPermissionPhase = true;
    
    // 🆕 NEW: Ask for email confirmation permission instead of sending immediately
    const emailPermissionMessage = `Perfect! Should I send a confirmation email to ${data.email} with all your details and next steps?`;
    
    if (window.addAIMessage) {
        window.addAIMessage(emailPermissionMessage);
    }
    
    // 🎯 CRITICAL: Wait a moment for the message to appear BEFORE speaking
    setTimeout(() => {
        if (window.speakText) {
            window.speakText(emailPermissionMessage);
            
            // Wait for speech to complete before showing buttons
            const checkSpeech = setInterval(() => {
                if (!window.isSpeaking) {
                    clearInterval(checkSpeech);
                    console.log('✅ AI finished speaking email question - showing buttons');
                    
                    // 🆕 NEW: Show confirmation buttons for email permission
                    showEmailConfirmationButtons(data, type);
                }
            }, 100);
            
            // Safety timeout
            setTimeout(() => {
                clearInterval(checkSpeech);
                showEmailConfirmationButtons(data, type);
            }, 10000);
        } else {
            // No speech system - just show buttons
            showEmailConfirmationButtons(data, type);
        }
    }, 500);
}

function startCompleteLeadCapture() {
    console.log('🎯 Starting complete lead capture...');
    // Trigger the pre-qualifier button click
    const preQualButton = document.querySelector('[data-action="pre-qualifier"]');
    if (preQualButton) {
        preQualButton.click();
    }
}

// ================================
// 🆕 NEW: EMAIL CONFIRMATION BUTTONS
// ================================
function showEmailConfirmationButtons(leadData, captureType) {
    const chatMessages = document.getElementById('chatMessages') ||
                         document.querySelector('.chat-messages');
    
    if (!chatMessages) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'email-confirmation-buttons';
    buttonContainer.innerHTML = `
        <div style="
            text-align: center; 
            margin: 20px 0; 
            padding: 25px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 15px;
            border: 2px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
        ">
            <div style="
                margin-bottom: 20px; 
                color: white; 
                font-size: 18px;
                font-weight: bold;
            ">
                Send confirmation email to:<br>
                <span style="color: #4CAF50; font-size: 16px;">${leadData.email}</span>
            </div>
            <div style="
                display: flex; 
                justify-content: center; 
                gap: 20px;
                flex-wrap: wrap;
            ">
                <button onclick="handleEmailConfirmation(true, '${captureType}')" style="
                    background: linear-gradient(135deg, #4CAF50, #8BC34A);
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    border-radius: 25px; 
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                    min-width: 140px;
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(76, 175, 80, 0.4)';" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(76, 175, 80, 0.3)';">
                    ✅ Yes, Send Email
                </button>
                <button onclick="handleEmailConfirmation(false, '${captureType}')" style="
                    background: linear-gradient(135deg, #757575, #9E9E9E);
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    border-radius: 25px; 
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                    min-width: 140px;
                    box-shadow: 0 4px 15px rgba(117, 117, 117, 0.3);
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(117, 117, 117, 0.4)';" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(117, 117, 117, 0.3)';">
                    ⏭️ Skip Email
                </button>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(buttonContainer);
    
    // Auto-scroll to show the buttons
    setTimeout(() => {
        buttonContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// ================================
// 🆕 NEW: HANDLE EMAIL CONFIRMATION RESPONSE
// ================================
function handleEmailConfirmation(sendEmail, captureType) {
    console.log('🎯 Email confirmation:', sendEmail ? 'SENDING' : 'SKIPPING');
    
    // 🆕 RE-ENABLE AVATAR
    enableAvatarAfterLeadCapture();
    
    // Remove confirmation buttons
    const buttonContainer = document.querySelector('.email-confirmation-buttons');
    if (buttonContainer) {
        buttonContainer.remove();
    }
    
    const data = window.currentLeadData;
    
    if (sendEmail) {
        // User wants email - send it using your ORIGINAL email logic
        sendOriginalLeadEmail(data, captureType);
    } else {
        // User skipped email - show thank you splash directly
        if (window.addAIMessage) {
            window.addAIMessage("No problem! Bruce will still contact you directly. Is there anything else I can help with?");
        }
        
        // Show thank you splash after brief delay
        setTimeout(() => {
            showThankYouSplash(data.name, captureType);
        }, 1500);
        
        // Clear the lead data
        window.currentLeadData = null;
    }
}

// 🆕 ADD THIS FUNCTION TOO:
function enableAvatarAfterLeadCapture() {
    if (window.originalShowAvatar) {
        window.showAvatarSorryMessage = window.originalShowAvatar;
        console.log('✅ Avatar re-enabled after lead capture');
    }
}

function sendOriginalLeadEmail(data, type) {
    console.log('📧 Sending ORIGINAL lead email (internal notification)...');
    
    // 1. FIRST: Send INTERNAL notification to Bruce using your existing templates
    let internalTemplateId = '';
    let internalTemplateParams = {};
    let qualificationLevel = '';

    // Your existing internal email logic here...
    if (type === 'consultation') {
        internalTemplateId = EMAILJS_CONFIG.templates.consultation;
        internalTemplateParams = {
            to_email: 'bizboost.expert@gmail.com',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            contact_time: data.contactTime,
            message: `FREE CONSULTATION REQUEST\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nBest Time: ${data.contactTime}`,
            timestamp: new Date().toLocaleString()
        };
    } else if (type === 'clickToCall') {
        internalTemplateId = EMAILJS_CONFIG.templates.clickToCall;
        internalTemplateParams = {
            to_email: 'bizboost.expert@gmail.com',
            from_name: data.name,
            phone: data.phone,
            message: `CLICK-TO-CALL REQUEST\n\nName: ${data.name}\nPhone: ${data.phone}\nReason: ${data.reason}`,
            timestamp: new Date().toLocaleString()
        };
    } else if (type === 'freeBook') {
        internalTemplateId = EMAILJS_CONFIG.templates.freeBook;
        internalTemplateParams = {
            to_email: data.email,
            from_name: data.name,
            book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG',
            message: `Here's your free copy of "7 Secrets to Selling Your Practice"!${data.wantsEvaluation ? '\n\nInterested in evaluation - Phone: ' + data.phone : ''}`,
            timestamp: new Date().toLocaleString()
        };
    } else if (type === 'preQualifier') {
        internalTemplateId = EMAILJS_CONFIG.templates.preQualifier;
        
        // Qualification scoring logic
        let qualificationScore = 0;
        let qualifications = [];
        
        const experienceYears = parseInt(data.experienceYears) || 0;
        if (experienceYears >= 3) {
            qualificationScore += 25;
            qualifications.push(`${experienceYears} years experience`);
        }
        
        if (data.licenseStatus && data.licenseStatus.toLowerCase().includes('cpa')) {
            qualificationScore += 25;
            qualifications.push('CPA licensed');
        }
        
        if (data.acquisitionTimeline) {
            const timeline = data.acquisitionTimeline.toLowerCase();
            if (timeline.includes('immediate') || timeline.includes('3 month') || timeline.includes('6 month')) {
                qualificationScore += 25;
                qualifications.push('Ready for acquisition');
            }
        }
        
        if (data.budgetRange && data.budgetRange.trim() !== '') {
            qualificationScore += 25;
            qualifications.push(`Budget: ${data.budgetRange}`);
        }
        
        qualificationLevel = qualificationScore >= 75 ? 'HIGH' : 
                            qualificationScore >= 50 ? 'MEDIUM' : 'BASIC';
        
        internalTemplateParams = {
            to_email: 'bizboost.expert@gmail.com',
            name: data.name || 'Not provided',
            email: data.email || 'Not provided',
            phone: data.phone || 'Not provided',
            qualification_score: qualificationScore.toString(),
            qualification_level: qualificationLevel,  
            qualifications: qualifications.join(', '),
            experience_years: data.experienceYears || 'Not specified',
            license_status: data.licenseStatus || 'Not specified',
            acquisition_timeline: data.acquisitionTimeline || 'Not specified',
            budget_range: data.budgetRange || 'Not specified',
            geographic_preference: data.geographicPreference || 'Not specified',
            practice_size: data.practiceSize || 'Not specified',
            specialization_interest: data.specializationInterest || 'Not specified',
            financing_needed: data.financingNeeded || 'Not specified',
            recommended_action: qualificationLevel === 'HIGH' ? 'Contact within 4 hours' : 
                               qualificationLevel === 'MEDIUM' ? 'Contact within 24 hours' : 'Contact within 48 hours',
            timestamp: new Date().toLocaleString()
        };
    }
    
    // Send internal notification
    emailjs.send(EMAILJS_CONFIG.serviceId, internalTemplateId, internalTemplateParams)
        .then(function(response) {
            console.log('✅ INTERNAL NOTIFICATION SENT TO BRUCE!');
            
            // 2. SECOND: Send CLIENT confirmation email
            sendClientConfirmationEmail(data, type);
            
        }, function(error) {
            console.error('❌ INTERNAL EMAIL FAILED:', error);
            // Still try to send client confirmation even if internal fails
            sendClientConfirmationEmail(data, type);
        });
}

// NEW: Separate function for CLIENT confirmation email
function sendClientConfirmationEmail(leadData, captureType) {
    console.log('📧 Sending CLIENT confirmation email...');
    
    const cleanEmail = String(leadData.email).trim().replace(/[^\w@.-]/g, '');
    
    let inquiryType = '';
    let emailSubject = '';
    
    switch(captureType) {
        case 'preQualifier':
            inquiryType = 'PRE-QUALIFICATION CONFIRMATION';
            emailSubject = 'Pre-Qualification Confirmed + Free Book - New Clients Inc';
            break;
        case 'consultation':
            inquiryType = 'CONSULTATION BOOKING CONFIRMATION';
            emailSubject = 'Consultation Booked + Free Book - New Clients Inc';
            break;
        case 'freeBook':
            inquiryType = 'FREE BOOK CONFIRMATION';
            emailSubject = 'Your Free Book - New Clients Inc';
            break;
        case 'clickToCall':
            inquiryType = 'CALL REQUEST CONFIRMATION';
            emailSubject = 'Call Request Confirmed + Free Book - New Clients Inc';
            break;
        default:
            inquiryType = 'REQUEST CONFIRMATION';
            emailSubject = 'Confirmation - New Clients Inc';
    }
    
    const confirmationParams = {
        to_email: cleanEmail,
        name: leadData.name,
        email: cleanEmail,
        phone: leadData.phone || 'Not provided',
        contactTime: leadData.contactTime || 'Within 24 hours',
        inquiryType: inquiryType,
        subject: emailSubject,
        timestamp: new Date().toLocaleString(),
        book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG'
    };
    
    // Send CLIENT confirmation using the confirmation template
emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templates.clientConfirmation, confirmationParams)
        .then(function(response) {
            console.log('✅ CLIENT CONFIRMATION EMAIL SENT!');
            
            if (window.showUniversalBanner) {
                window.showUniversalBanner('emailSent');
            }
            
            let successMessage = `Confirmation email sent to ${cleanEmail}! Bruce will contact you soon. Is there anything else I can help you with?`;
            
            if (window.addAIMessage) {
                window.addAIMessage(successMessage);
            }
            
            // Clear lead data
            window.isInLeadCapture = false;
            window.currentCaptureType = null;
            window.currentLeadData = null;
            
            if (window.speakText) {
                window.speakText(successMessage);
                
                // Wait for speech then show banner
                const checkSpeech = setInterval(() => {
                    if (!window.isSpeaking) {
                        clearInterval(checkSpeech);
                        setTimeout(() => {
                            if (window.showDirectSpeakNow) {
                                window.showDirectSpeakNow();
                            }
                        }, 1000);
                    }
                }, 100);
            } else {
                setTimeout(() => {
                    if (window.showDirectSpeakNow) {
                        window.showDirectSpeakNow();
                    }
                }, 3000);
            }
            
        }, function(error) {
            console.error('❌ CLIENT CONFIRMATION EMAIL FAILED:', error);
            
            // Simple error handling
            let failureMessage = "The confirmation email couldn't be sent, but Bruce will still contact you directly! Is there anything else I can help with?";
            
            if (window.addAIMessage) {
                window.addAIMessage(failureMessage);
            }
            
            // Clear lead data
            window.isInLeadCapture = false;
            window.currentCaptureType = null;
            window.currentLeadData = null;
            
            if (window.speakText) {
                window.speakText(failureMessage);
                setTimeout(() => {
                    if (window.showDirectSpeakNow) {
                        window.showDirectSpeakNow();
                    }
                }, 3000);
            } else {
                setTimeout(() => {
                    if (window.showDirectSpeakNow) {
                        window.showDirectSpeakNow();
                    }
                }, 2000);
            }
        });
}
    
// Make functions globally accessible
window.handleEmailConfirmation = handleEmailConfirmation;
window.sendOriginalLeadEmail = sendOriginalLeadEmail; // 🎯 END OF FUNCTION - NO MORE CODE AFTER THIS! 

// ================================
// LEAD CAPTURE 4: PRE-QUALIFIER INTERVIEW
// ================================
function initializePreQualifierCapture() {
    console.log('🚀 Starting PRE-QUALIFIER capture...');
    
    if (window.directSafetyTimeout) {
        clearTimeout(window.directSafetyTimeout);
        console.log('🛡️ Lead capture: Safety timeout cleared');
    }
    
    if (window.isInLeadCapture) return;
    
    window.isInLeadCapture = true;
    window.currentCaptureType = 'preQualifier';
    window.currentLeadData = {
        name: '',
        email: '',
        phone: '',
        experienceYears: '',
        licenseStatus: '',
        acquisitionTimeline: '',
        budgetRange: '',
        geographicPreference: '',
        practiceSize: '',
        specializationInterest: '',
        financingNeeded: '',
        captureType: 'preQualifier',
        step: 0,
        tempAnswer: '',
        questions: [
            "Let's start with your full name, please.",
            "What's the best email to send your pre-qualification results to?",
            "What's your phone number for follow-up?",
            "How many years of accounting experience do you have?",
            "Are you currently CPA-licensed or pursuing certification?",
            "What's your ideal timeline for acquiring a practice?",
            "What's your target budget range for this acquisition?",
            "Which geographic areas are you considering for the practice?",
            "What size practice are you looking for in terms of annual revenue?",
            "Do you have a preference for any specific accounting specialties?",
            "Will you need financing assistance for this acquisition?"
        ]
    };
    
    setTimeout(() => {
        askLeadQuestion();
    }, 500);
}

// ================================
// 🎬 CINEMATIC THANK YOU SPLASH SCREEN WITH RESTART BUTTON
// ================================
function showThankYouSplash(name, captureType) {
    console.log('🎬 Deploying cinematic thank you splash screen with restart button...');
    
    // ✅ NUCLEAR OPTION - KILL ALL SPEECH SYSTEMS
    if (window.speechRecognition) {
        try {
            window.speechRecognition.stop();
            window.speechRecognition.abort();
            window.speechRecognition = null;
        } catch (e) {
            console.log('Speech recognition cleanup:', e);
        }
    }
    
    // ✅ STOP ALL LISTENING FLAGS
    window.isListening = false;
    window.isRecording = false;
    
    // ✅ CLEAR ALL TIMEOUTS
    if (window.speechTimeout) clearTimeout(window.speechTimeout);
    if (window.restartTimeout) clearTimeout(window.restartTimeout);
    
    // ✅ SET FINAL STATE
    conversationState = 'splash_screen_active';
    
    const splashOverlay = document.createElement('div');
    splashOverlay.id = 'thankYouSplash';
    splashOverlay.style.cssText = `
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%);
        width: 90%; 
        max-width: 600px;
        height: auto;
        min-height: 500px;
        background: linear-gradient(135deg, #000428 0%, #004e92 50%, #000428 100%);
        z-index: 99999; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        animation: fadeInSplash 0.8s ease-in;
        border-radius: 20px;
        box-shadow: 0 0 50px rgba(0, 78, 146, 0.6), inset 0 0 50px rgba(0, 78, 146, 0.3);
        border: 2px solid rgba(74, 144, 226, 0.5);
        overflow: hidden;
    `;
    
    splashOverlay.innerHTML = `
        <div style="text-align: center; color: white; animation: slideInContent 1s ease-out 0.3s both; position: relative; padding: 40px 30px; width: 100%;">
            <!-- Goodbye Avatar Video -->
            <div style="margin-bottom: 20px;">
                <video autoplay loop muted playsinline style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3);">
                    <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1762224530592.mp4" type="video/mp4">
                </video>
            </div>
            
            <div style="font-size: 48px; margin-bottom: 15px; text-shadow: 0 0 20px rgba(255,255,255,0.4);">🙏</div>
            <h1 style="font-size: 32px; margin-bottom: 15px; font-weight: 300; letter-spacing: 1px; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">Thank You, ${name}!</h1>
            <p style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 300;">Your consultation has been confirmed!</p>
            <p style="font-size: 16px; margin-top: 15px; opacity: 0.8; font-weight: 300;">Bruce will contact you within 24 hours.</p>
            <div style="margin-top: 25px; font-size: 14px; opacity: 0.7; letter-spacing: 1px;">Mobile-Wise AI</div>
            
            <!-- RESTART BUTTON -->
            <button onclick="restartConversation()" style="
                margin-top: 30px;
                background: linear-gradient(135deg, #00b4db, #0083b0);
                color: white;
                border: none;
                padding: 15px 35px;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 6px 20px rgba(0, 180, 219, 0.4);
                transition: all 0.3s ease;
                min-width: 180px;
                animation: slideInButton 1s ease-out 1s both;
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 10px 30px rgba(0, 180, 219, 0.6)'" 
               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 6px 20px rgba(0, 180, 219, 0.4)'">
                🔄 BACK TO AI CHAT
            </button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInSplash { from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        @keyframes slideInContent { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInButton { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(splashOverlay);
    
    // ✅ PLAY OUTRO AUDIO
    setTimeout(() => {
        const audio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1758148837523.mp3');
        audio.volume = 0.8;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }, 500);
    
    // ✅ AUTO-DISMISS AFTER 20 SECONDS
    setTimeout(() => {
        if (document.getElementById('thankYouSplash')) {
            restartConversation();
        }
    }, 20000);
}

// ================================
// 🔄 RESTART CONVERSATION FUNCTION
// ================================
function restartConversation() {
    console.log('🔄 Restarting conversation...');
    
    // Remove splash screen
    const splash = document.getElementById('thankYouSplash');
    if (splash) splash.remove();
    
    // Reset conversation state
    conversationState = 'initial';
    window.waitingForName = false;
    window.waitingForIntent = false;
    window.waitingForBookResponse = false;
    window.waitingForConsultationResponse = false;
    window.qualificationState = '';
    window.userName = '';
    window.userIntent = '';
    window.isInLeadCapture = false; // 🆕 ADD THIS!
    window.currentLeadData = null; // 🆕 ADD THIS!
    
    // Show branding banner
    if (typeof showUniversalBanner === 'function') {
        showUniversalBanner('branding');
    }
    
    // Reset action buttons to quick mode
    if (typeof window.actionButtonSystem === 'object') {
        window.actionButtonSystem.renderButtons('quick');
    }
    
    // Start fresh conversation
    setTimeout(() => {
        const greeting = "What else can I help you with today?";
        speakWithElevenLabs(greeting, false);
        
        // Show speak now banner after greeting - FIXED VERSION
        setTimeout(() => {
            if (typeof showDirectSpeakNow === 'function') {
                console.log('🎤 Restart: Showing Direct Speak Now banner');
                showDirectSpeakNow();
            } else if (typeof startRealtimeListening === 'function') {
                console.log('🎤 Restart: Starting listening directly');
                startRealtimeListening();
            } else if (typeof showUniversalBanner === 'function') {
                console.log('🎤 Restart: Falling back to branding banner');
                showUniversalBanner('branding');
            }
        }, 2000);
    }, 1000);
}

/**
 * HANDLE ACTION CENTER COMPLETION
 * Re-enables Speak Now banner when user makes a selection or closes
 */
function handleActionCenterCompletion() {
    console.log('✅ Action Center completed - re-enabling Speak Now banner');
    
    // Re-enable Speak Now banner
    window.disableSpeakNowBanner = false;
    
    // Optional: Auto-show Speak Now banner after selection
    setTimeout(() => {
        if (typeof showDirectSpeakNow === 'function' && !window.disableSpeakNowBanner) {
            console.log('🔄 Auto-showing Speak Now banner after Action Center');
            showDirectSpeakNow();
        }
    }, 2000);
}

// ================================
// 🎬 UPDATED TESTIMONIAL HANDLER - SPLASH SCREEN CONTROLS VIDEO PLAYBACK
// ================================
function handleTestimonialButton(testimonialType) {
    console.log('🎬 Testimonial selected:', testimonialType);
    
    // First hide the splash screen
    hideTestimonialSplash();
    
    // Wait for splash to fully hide, THEN show video
    setTimeout(() => {
        // Call the video player - NOW CONTROLLED BY SPLASH SCREEN
        if (typeof window.showTestimonialVideo === 'function') {
            window.showTestimonialVideo(testimonialType);
        } else {
            console.error('❌ Video player function not found');
            // Fallback: restart conversation if video fails
            restartConversation();
        }
    }, 400); // Matches the 300ms hide animation + 100ms buffer
}

// ================================
// 🎬 ENHANCED TESTIMONIAL SPLASH SCREEN WITH BETTER TIMING
// ================================
function showTestimonialSplashScreen() {
    console.log('🎬 Deploying testimonial splash screen...');
    
    // Stop any current listening first
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    const splashScreen = document.createElement('div');
    splashScreen.id = 'testimonial-splash-screen';
    splashScreen.style.animation = 'fadeInSplash 0.5s ease-in';
    
    splashScreen.innerHTML = `
        <div style="
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                        url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1762038349654_action-bg.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px 25px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: white;
            font-family: 'Segoe UI', system-ui, sans-serif;
            max-width: 750px;
            animation: slideInFromBottom 0.5s ease-out;
        ">
            <!-- Header with Video Avatar -->
            <div style="display: flex; align-items: center; margin-bottom: 25px; gap: 15px;">
                <video autoplay loop muted playsinline style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.2);">
                    <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1762037335280.mp4" type="video/mp4">
                </video>
                <div>
                    <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600;">Client Testimonials</h3>
                    <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300;">Real stories from satisfied clients</p>
                </div>
            </div>

            <!-- Testimonial Buttons Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                <!-- Skeptical Client -->
                <button onclick="handleTestimonialButton('skeptical')" style="
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
                    font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
                    backdrop-filter: blur(10px); width: 100%; height: 84px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px;">🤔</div>
                    <span style="flex: 1;">Skeptical Client</span>
                </button>

                <!-- Speed Results -->
                <button onclick="handleTestimonialButton('speed')" style="
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
                    font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
                    backdrop-filter: blur(10px); width: 100%; height: 84px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px;">⚡</div>
                    <span style="flex: 1;">Speed Results</span>
                </button>
            </div>

            <!-- Skip Button -->
            <button onclick="handleTestimonialSkip()" style="
                display: flex; align-items: center; gap: 10px;
                background: rgba(0, 0, 0, 0.6); color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.2); padding: 15px 20px;
                border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 500;
                transition: all 0.3s ease; width: 100%; justify-content: center; margin-top: 5px;
            " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.color='white';" 
               onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.color='rgba(255, 255, 255, 0.8)';">
                <span>⏭️ Skip Testimonials</span>
            </button>
        </div>
    `;
    
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(splashScreen);
        splashScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ================================
// 🎬 NEW: HANDLE TESTIMONIAL SKIP
// ================================
function handleTestimonialSkip() {
    console.log('🎬 User skipped testimonials');
    hideTestimonialSplash();
    
    // Wait for splash to hide, then restart conversation
    setTimeout(() => {
        restartConversation();
    }, 400);
}

// ================================
// 🎬 UPDATED HIDE TESTIMONIAL SPLASH
// ================================
function hideTestimonialSplash() {
    const splash = document.getElementById('testimonial-splash-screen');
    if (splash) {
        splash.style.animation = 'slideOutToBottom 0.3s ease-in';
        setTimeout(() => {
            if (splash.parentNode) {
                splash.remove();
                console.log('✅ Testimonial splash screen removed');
            }
        }, 300);
    }
}

// Add these CSS animations if not already present
function addTestimonialAnimations() {
    if (!document.getElementById('testimonial-animations')) {
        const style = document.createElement('style');
        style.id = 'testimonial-animations';
        style.textContent = `
            @keyframes fadeInSplash {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInFromBottom {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOutToBottom {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(30px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ================================
// 🎬 CLOSE THANK YOU SPLASH FUNCTION
// ================================
function closeThankYouSplash() {
    const splash = document.getElementById('thank-you-splash');
    if (splash) {
        splash.style.animation = 'fadeOutScale 0.5s ease-in';
        setTimeout(() => {
            splash.remove();
            console.log('✅ Thank you splash closed');
        }, 500);
    }
}

// Make sure this CSS animation exists
function ensureSplashAnimations() {
    if (!document.getElementById('splash-animations')) {
        const style = document.createElement('style');
        style.id = 'splash-animations';
        style.textContent = `
            @keyframes fadeOutScale {
                from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Call this when your script loads
ensureSplashAnimations();

// Initialize animations when the script loads
addTestimonialAnimations();

// Make globally accessible
window.showThankYouSplash = showThankYouSplash;
window.closeThankYouSplash = closeThankYouSplash;

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
window.initializePreQualifierCapture = initializePreQualifierCapture; // 🎯 NOW THIS WILL BE GOLD!
window.askQuickQuestion = askQuickQuestion;

function askQuickQuestion(questionText) {
    console.log('🔄 REDIRECTING: askQuickQuestion → Communication Relay Center');
    console.log('   Original question:', questionText);
    
    // Redirect to our new Communication Relay Center
    if (typeof openCommRelayCenter === 'function') {
        openCommRelayCenter();
    } else {
        console.error('❌ openCommRelayCenter not available');
        // Fallback to original action center
        if (typeof showCommunicationActionCenter === 'function') {
            showCommunicationActionCenter();
        }
    }
}

console.log('✅ ACTION SYSTEM UNIFIED - Loaded successfully (FINAL CLEANED VERSION - No restore code)');
