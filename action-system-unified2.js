// ================================
// ACTION SYSTEM UNIFIED - FINAL VERSION
// 5-Button Corporate Design with 3 Lead Capture Flows
// CLEANED VERSION - No restore code for old buttons
// ================================

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
// COMMUNICATION ACTION CENTER - 5 BUTTON LAYOUT
// ================================
function showCommunicationActionCenter() {
    const actionCenter = document.createElement('div');
    actionCenter.id = 'communication-action-center';
    actionCenter.innerHTML = `
        <div style="
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                        url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1762038349654_action-bg.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px 25px 30px 25px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: white;
            font-family: 'Segoe UI', system-ui, sans-serif;
            max-width: 750px;
            min-height: 450px;
        ">
            <!-- Header with Video Avatar -->
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                gap: 15px;
                margin-top: 5px;
            ">
                <video autoplay loop muted playsinline style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                ">
                    <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1762037335280.mp4" type="video/mp4">
                </video>
                <div>
                    <h3 style="
                        margin: 0 0 5px 0;
                        font-size: 22px;
                        font-weight: 600;
                        color: white;
                    ">Communication Action Center</h3>
                    <p style="
                        margin: 0;
                        opacity: 0.8;
                        font-size: 13px;
                        font-weight: 300;
                        letter-spacing: 0.5px;
                    ">AI-Powered Solutions</p>
                </div>
            </div>

            <!-- 2x2 Grid Layout - EXACTLY like your current design -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                <!-- Request A Call -->
                <button onclick="handleActionButton('click-to-call')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <!-- Phone Icon - Using data URI to avoid CORS -->
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">📞</span>
                    </div>
                    <span style="flex: 1;">Request A Call</span>
                </button>

                <!-- URGENT CALL -->
                <button onclick="handleActionButton('urgent-call')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px;">🚨</div>
                    <span style="flex: 1;">URGENT CALL</span>
                </button>

                <!-- BOOK Consultation -->
                <button onclick="handleActionButton('free-consultation')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <!-- Calendar Icon -->
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">📅</span>
                    </div>
                    <span style="flex: 1;">BOOK Consultation</span>
                </button>

                <!-- Pre-Qualifier -->
                <button onclick="handleActionButton('pre-qualifier')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <!-- Checkmark Icon -->
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">✅</span>
                    </div>
                    <span style="flex: 1;">Pre-Qualification</span>
                </button>
            </div>

            <!-- Skip for Now - Full Width -->
            <button onclick="handleActionButton('skip')" style="
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 15px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.3s ease;
                width: 100%;
                justify-content: center;
                margin-top: 5px;
            " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.color='white';" 
               onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.color='rgba(255, 255, 255, 0.8)';">
                <!-- Skip Icon -->
                <div style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 16px;">⏭️</span>
                </div>
                <span>Skip for Now</span>
            </button>
        </div>
    `;
    
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(actionCenter);
        
        // Auto-scroll to show the action center
        setTimeout(() => {
            actionCenter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    console.log('✅ Communication Action Center displayed with emojis');
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
            case 'pre-qualifier':
            initializePreQualifierCapture();
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

// ================================
// 🎯 UPDATED CONFIRM ANSWER FUNCTION (MERGED FROM confirmAnswer2.txt)
// ================================
function confirmAnswer(isCorrect) {
    console.log('🎯 User clicked:', isCorrect ? 'Correct' : 'Redo');
    
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
            <div style="display: flex; justify-content: