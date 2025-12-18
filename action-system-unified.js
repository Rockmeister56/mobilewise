// ================================
// ACTION SYSTEM UNIFIED - FINAL VERSION
// 5-Button Corporate Design with 3 Lead Capture Flows
// CLEANED VERSION - No restore code for old buttons
// ================================

// 🎯 GLOBAL AUDIO COOLDOWN
let lastAudioStopTime = 0;
const AUDIO_COOLDOWN_MS = 1200; // 1.2 seconds

function safeSpeakWithCooldown(text) {
    const now = Date.now();
    const timeSinceLastStop = now - lastAudioStopTime;
    
    if (timeSinceLastStop < AUDIO_COOLDOWN_MS) {
        const waitTime = AUDIO_COOLDOWN_MS - timeSinceLastStop;
        console.log(`⏳ Audio cooldown: Waiting ${waitTime}ms before speaking`);
        
        setTimeout(() => {
            if (window.speakText) {
                window.speakText(text);
            }
        }, waitTime);
    } else {
        if (window.speakText) {
            window.speakText(text);
        }
    }
}

// Update when audio is stopped
function recordAudioStop() {
    lastAudioStopTime = Date.now();
    console.log('📝 Audio stop recorded:', lastAudioStopTime);
}

// ============================================
// 🔗 BRIDGE TO VOICE-CHAT-FUSION AUDIO STOPPER
// ============================================

// This function tries multiple ways to stop audio from voice-chat-fusion
window.stopCurrentSpeech = function() {
    console.log('🔗 BRIDGE: Trying to stop voice-chat-fusion audio...');
    
    // METHOD 1: Try calling the voice-chat-fusion function directly
    if (window.stopCurrentSpeechFromVoiceChat) {
        console.log('🔗 Calling stopCurrentSpeechFromVoiceChat()');
        return window.stopCurrentSpeechFromVoiceChat();
    }
    
    // METHOD 2: Dispatch event that voice-chat-fusion listens for
    console.log('🔗 Dispatching stop-ai-audio event');
    document.dispatchEvent(new CustomEvent('stop-ai-audio'));
    
    // METHOD 3: Direct audio kill as last resort
    setTimeout(() => {
        const allAudios = document.querySelectorAll('audio');
        console.log(`🔗 Direct kill: Found ${allAudios.length} audio elements`);
        
        allAudios.forEach(audio => {
            if (!audio.paused) {
                console.log('🔗 Directly stopping audio element');
                audio.pause();
                audio.currentTime = 0;
            }
        });
        
        if (window.speechSynthesis) {
            speechSynthesis.cancel();
        }
        
        window.isSpeaking = false;
    }, 50);
    
    return true;
};

console.log('✅ Bridge function loaded in action-system-unified.js');

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
window.lastCapturedName = null;

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
    
    }
    
    // Add to page
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(actionCenter);
    }
    
    console.log('✅ Enhanced Action Center displayed - Mode:', mode);
}

// ================================
// LEAD CAPTURE TRACKING
// ================================
window.trackLeadCaptureStart = function() {
    console.log('🎯 LEAD CAPTURE: Starting lead capture process');
};

window.trackLeadCaptureComplete = function() {
    console.log('🎯 LEAD CAPTURE: Lead capture completed');
};

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
    
    // 🛑 1. STOP CURRENT AUDIO
    if (window.stopAIAudioFromVoiceChat) {
        console.log('🔇 Stopping current AI audio');
        window.stopAIAudioFromVoiceChat();
    }
    
    // ⏳ 2. WAIT 800ms for audio to fully stop
    setTimeout(() => {
        console.log('✅ Audio cleared, processing button action');

    }
  
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
    console.log('🎯 User chose to skip - BLOCKING avatar auto-restart');
    
    // 🚨 CRITICAL: Prevent avatar from auto-restarting Speak Now
    window.suppressAvatarAutoRestart = true;
    
    const skipMessage = "I appreciate you're not ready to get immediate help from our expert. What else can I help you with to meet your objectives?";
    
    // Show message
    if (window.addSystemMessage) {
        window.addSystemMessage(skipMessage);
    } else if (window.addAIMessage) {
        window.addAIMessage(skipMessage);
    }
    
    // Use the same pattern as other cases - wait for AI speech completion
    if (window.speakText) {
        window.speakText(skipMessage);
        
        const checkSpeech = setInterval(() => {
            if (!window.isSpeaking) {
                clearInterval(checkSpeech);
                console.log('✅ AI finished speaking - starting listening NOW');
                
                // 🎯 TRACKED BANNER SHOW
                console.log('🎤 SKIP: Triggering Speak Now banner');
                if (window.showDirectSpeakNow && typeof window.showDirectSpeakNow === 'function') {
                    window.showDirectSpeakNow();
                }
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkSpeech);
        }, 10000);
    }
    
    // Re-enable avatar auto-restart after reasonable time
    setTimeout(() => {
        window.suppressAvatarAutoRestart = false;
        console.log('✅ Avatar auto-restart re-enabled');
    }, 15000);
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
// LEAD CAPTURE 2: URGENT CALL
// ================================
function initializeUrgentCallCapture() {
    console.log('🚀 Starting URGENT CALL capture...');
    
    if (window.isInLeadCapture) return;
    
    window.isInLeadCapture = true;
    window.currentCaptureType = 'urgentCall';
    window.currentLeadData = {
        name: window.userFirstName || '', // 🆕 USE THE ALREADY CAPTURED NAME!
        phone: '',
        reason: '',
        captureType: 'urgentCall',
        step: window.userFirstName ? 1 : 0, // 🆕 SKIP NAME QUESTION IF WE HAVE IT
        tempAnswer: '',
        questions: [
            // 🆕 ONLY ASK NAME IF WE DON'T ALREADY HAVE IT
            ...(window.userFirstName ? [] : ["What's your full name?"]),
            "What's the best phone number to reach you?",
            "What's this regarding - are you looking to buy, sell, or evaluate a practice?"
        ]
    };
    
    // 🆕 CRITICAL: MANUALLY SAVE THE NAME IF WE HAVE IT
    if (window.userFirstName) {
        console.log('✅ Pre-saving captured name:', window.userFirstName);
        // Force the name to be saved in the correct field
        window.currentLeadData.name = window.userFirstName;
    }
    
    console.log('🆕 Urgent Call initialized with name:', window.currentLeadData.name);
    
    setTimeout(() => {
        askLeadQuestion();
    }, 500);
}

// ================================
// LEAD CAPTURE: REQUEST A CALL (NEW)
// ================================
function initializeRequestCallCapture() {
    console.log('🚀 Starting REQUEST A CALL capture...');
    
    if (window.isInLeadCapture) return;
    
    window.isInLeadCapture = true;
    window.currentCaptureType = 'clickToCall'; // Uses clickToCall template
    window.currentLeadData = {
        name: '',
        phone: '',
        reason: '',
        captureType: 'clickToCall', // Uses clickToCall template
        step: 0,
        tempAnswer: '',
        questions: [
            "Terrific, can I get your full name please?",
            "What's the best phone number to reach you?",
            "May I ask what this regarding?",
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
    window.trackLeadCaptureStart(); // 🎯 TRACK THIS!
    
    window.lastProcessedTranscript = null;
    if (!window.isInLeadCapture || !window.currentLeadData) return;
    
    const data = window.currentLeadData;
    console.log('🎯 Asking question for step:', data.step);
    
    if (data.step < data.questions.length) {
        const question = data.questions[data.step]; // This defines 'question'
        console.log('🎯 Question:', question);
        
        if (window.addAIMessage) {
            window.addAIMessage(question);
        }
        
        // ⬇️⬇️⬇️ USE safeSpeakWithCooldown HERE ⬇️⬇️⬇️
        if (window.safeSpeakWithCooldown) {
            window.safeSpeakWithCooldown(question); // Now 'question' is defined!
        } else if (window.speakText) {
            // Fallback if safe function doesn't exist
            window.speakText(question);
        }
        
        const checkSpeech = setInterval(() => {
            if (!window.isSpeaking) {
                clearInterval(checkSpeech);
                console.log('✅ AI finished speaking - starting listening NOW');
                
                console.log('🎤 LEAD CAPTURE: Triggering Speak Now banner for step', data.step);
                if (window.showDirectSpeakNow && typeof window.showDirectSpeakNow === 'function') {
                    window.showDirectSpeakNow();
                }
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkSpeech);
        }, 10000);
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
        // ✅ KEEP THIS for URGENT CALL - 3 fields (no email)
        const fields = ['name', 'phone', 'reason'];
        data[fields[step]] = data.tempAnswer;
    } else if (data.captureType === 'requestCall') {
        // ✅ ADD THIS for REQUEST A CALL - 4 fields (WITH email)
        const fields = ['name', 'phone', 'reason', 'email'];
        data[fields[step]] = data.tempAnswer;
    } else if (data.captureType === 'freeBook') {
        if (step === 0) data.name = data.tempAnswer;
        else if (step === 1) data.email = data.tempAnswer;
        else if (step === 2) {} // Already handled wantsEvaluation
        else if (step === 3) data.phone = data.tempAnswer;
    } else if (data.captureType === 'preQualifier') {
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
    const emailPermissionMessage = `Perfect! Should I send a confirmation email to ${data.email} confirming all your details?`;
    
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
                    showEmailConfirmationButtons(data, window.currentCaptureType);
                }
            }, 100);
            
            // Safety timeout
            setTimeout(() => {
                clearInterval(checkSpeech);
                showEmailConfirmationButtons(data, window.currentCaptureType);
            }, 10000);
        } else {
            // No speech system - just show buttons
            showEmailConfirmationButtons(data, window.currentCaptureType);
        }
    }, 500);
}

function sendInternalNotification(leadData, captureType) {
    // 🎯 GENERIC: Don't mention specific names
    console.log('📧 Sending internal notification to team...');
    
    let internalTemplateId = '';
    let internalTemplateParams = {};
    let toEmail = ''; // Should come from config
    
    // Get email from config or use default
    if (window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.internalEmail) {
        toEmail = window.EMAILJS_CONFIG.internalEmail;
    } else {
        toEmail = 'team@example.com'; // Generic fallback
    }
    
    if (captureType === 'consultation') {
        // Book Consultation
        internalTemplateId = EMAILJS_CONFIG.templates.consultation;
        internalTemplateParams = {
            to_email: toEmail,
            name: leadData.name,
            phone: leadData.phone,
            email: leadData.email,
            contactTime: leadData.contactTime,
            inquiryType: 'CONSULTATION_REQUEST',
            message: `New Consultation Request\n\nName: ${leadData.name}\nPhone: ${leadData.phone}\nEmail: ${leadData.email}\nBest Time: ${leadData.contactTime}`,
            timestamp: new Date().toLocaleString()
        };
    } else if (captureType === 'clickToCall') {
        // Request A Call
        internalTemplateId = EMAILJS_CONFIG.templates.clickToCall; 
        internalTemplateParams = {
            to_email: toEmail,
            name: leadData.name,
            phone: leadData.phone,
            reason: leadData.reason,
            inquiryType: 'CALLBACK_REQUEST',
            message: `📞 Callback Request\n\nName: ${leadData.name}\nPhone: ${leadData.phone}\nReason: ${leadData.reason}\n\nPlease follow up within 24 hours.`,
            timestamp: new Date().toLocaleString()
        };
    } else if (captureType === 'preQualifier') {
        internalTemplateId = EMAILJS_CONFIG.templates.preQualifier;
        
        // Qualification scoring logic
        let qualificationScore = 0;
        let qualifications = [];
        
        const experienceYears = parseInt(leadData.experienceYears) || 0;
        if (experienceYears >= 3) {
            qualificationScore += 25;
            qualifications.push(`${experienceYears} years experience`);
        }
        
        if (leadData.licenseStatus && leadData.licenseStatus.toLowerCase().includes('cpa')) {
            qualificationScore += 25;
            qualifications.push('CPA licensed');
        }
        
        if (leadData.acquisitionTimeline) {
            const timeline = leadData.acquisitionTimeline.toLowerCase();
            if (timeline.includes('immediate') || timeline.includes('3 month') || timeline.includes('6 month')) {
                qualificationScore += 25;
                qualifications.push('Ready for acquisition');
            }
        }
        
        if (leadData.budgetRange && leadData.budgetRange.trim() !== '') {
            qualificationScore += 25;
            qualifications.push(`Budget: ${leadData.budgetRange}`);
        }
        
        const qualificationLevel = qualificationScore >= 75 ? 'HIGH' : 
                                  qualificationScore >= 50 ? 'MEDIUM' : 'BASIC';
        
        internalTemplateParams = {
            to_email: toEmail,
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            contactTime: 'Within 24 hours',
            inquiryType: 'PRE_QUALIFIER_REQUEST',
            transcript: `Pre-qualification score: ${qualificationScore} (${qualificationLevel})`,
            qualification_score: qualificationScore.toString(),
            qualification_level: qualificationLevel,  
            qualifications: qualifications.join(', '),
            experience_years: leadData.experienceYears || 'Not specified',
            license_status: leadData.licenseStatus || 'Not specified',
            acquisition_timeline: leadData.acquisitionTimeline || 'Not specified',
            budget_range: leadData.budgetRange || 'Not specified',
            geographic_preference: leadData.geographicPreference || 'Not specified',
            practice_size: leadData.practiceSize || 'Not specified',
            specialization_interest: leadData.specializationInterest || 'Not specified',
            financing_needed: leadData.financingNeeded || 'Not specified',
            recommended_action: qualificationLevel === 'HIGH' ? 'Contact within 4 hours' : 
                               qualificationLevel === 'MEDIUM' ? 'Contact within 24 hours' : 'Contact within 48 hours',
            timestamp: new Date().toLocaleString()
        };
    }
    
    // Only send if we have a template
    if (internalTemplateId) {
        emailjs.send(EMAILJS_CONFIG.serviceId, internalTemplateId, internalTemplateParams)
            .then(function(response) {
                console.log('✅ Internal notification email sent for:', captureType);
            })
            .catch(function(error) {
                console.error('❌ Internal notification email failed:', error);
            });
    } else {
        console.log('❌ No email template for captureType:', captureType);
    }
}

// ================================
// UNIVERSAL CLOSE SEQUENCE (WITH DECISION PANEL)
// ================================
function universalCloseSequence(serviceType) {
    console.log('🎯 Universal close sequence for:', serviceType);
    
    const messages = {
        requestCall: "Perfect! I've got your call request and our specialist will contact you shortly.",
        consultation: "Your consultation has been scheduled and confirmation details are on the way.", 
        preQualifier: "Your pre-qualification assessment is complete and we'll be in touch.",
        freeBook: "Your free book request has been processed and download details are on the way.",
        clickToCall: "Thank you! Our team will call you right away.",
        default: "I've completed your request."
    };
    
    const closeMessage = `${messages[serviceType] || messages.default}`;
    
    // 1. Add completion message to chat
    if (window.addAIMessage) {
        window.addAIMessage(closeMessage);
    }
    
    // 2. Send internal notification (for all relevant types)
    if (serviceType === 'requestCall' || serviceType === 'clickToCall' || 
        serviceType === 'consultation' || serviceType === 'preQualifier') {
        sendInternalNotification(window.currentLeadData, serviceType);
    }
    
    // 3. Speak completion message
    if (window.speakText) {
        window.speakText(closeMessage);
    }
    
    // 🎯 TIMER 1: Wait for completion message to be spoken (~3 seconds)
    setTimeout(() => {
        // 4. Add follow-up question to chat
        const followUpQuestion = "Is there anything else I can help you with?";
        if (window.addAIMessage) {
            window.addAIMessage(followUpQuestion);
        }
        
        // 5. Speak the follow-up question
        if (window.speakText) {
            window.speakText(followUpQuestion);
        }
        
        // 🎯 TIMER 2: Wait for question to be spoken (~3 seconds)
        setTimeout(() => {
            // 6. Show decision panel
            showDecisionPanel({
                question: followUpQuestion,
                yesText: "Yes, I have more questions",
                skipText: "No, I'm all done", 
                onYes: function() {
                    console.log("User wants to continue conversation");
                    
                    // 🛑 CRITICAL: Exit lead capture mode!
                    window.isInLeadCapture = false;
                    window.currentLeadData = null;
                    window.quickLeadData = null;
                    
                    console.log('✅ LEAD CAPTURE EXITED - Returning to normal AI conversation');
                    
                    // Trigger Speak Now banner
                    if (window.showDirectSpeakNow) {
                        setTimeout(() => {
                            window.showDirectSpeakNow();
                        }, 500);
                    }
                },
                onSkip: function() {
                    console.log("User is done with conversation");
                    if (window.showThankYouSplash) window.showThankYouSplash();
                    
                    // Reset the capture system
                    window.isInLeadCapture = false;
                    window.currentLeadData = null;
                    window.quickLeadData = null;
                }
            });
        }, 3000); // Wait for question to be spoken
        
    }, 3000); // Wait for completion message to be spoken
    
    console.log('✅ Universal close sequence initiated');
}

// ================================
// EMAIL CONFIRMATION BUTTONS - SIMPLE VERSION
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
        
        // 🚀 AFTER EMAIL SENT - WAIT FOR AI TO SPEAK FIRST
        setTimeout(() => {
            console.log('📧 Email sent - waiting for AI to ask if more help needed');
            
            // Let AI speak FIRST: "Is there anything else I can help you with?"
            
            // 🕒 INCREASED TO 8 SECONDS to ensure AI finishes speaking AND auto-listening times out
            setTimeout(() => {
                console.log('🎯 AI finished speaking AND auto-listening timed out - showing decision panel');
                
                // 🚫 STOP any listening that might have started
                if (window.stopListening) {
                    window.stopListening();
                }
                
                // 🚫 STOP any pending Speak Now banners
                if (window.closeSpeakNowBanner) {
                    window.closeSpeakNowBanner();
                }
                
                 showDecisionPanel({
                    question: "Is that everything I can help you with today?",
                    yesText: "Yes, I Have More Questions",
                    skipText: "No, I'm All Done",
                    onYes: function() {
                        console.log('🎸 USER CONTINUING - APPLYING EMERGENCY FIX');
                        emergencySpeechFix();
                        
                        setTimeout(() => {
                            const continueMessage = "Great! What else can I help you with?";
                            speakWithElevenLabs(continueMessage, false);
                        }, 1000);
                    },
                    onSkip: function() {
                        console.log('🛑 USER FINISHED - COMPLETE SYSTEM SHUTDOWN');
                        
                        // 🚨 COMPLETE SHUTDOWN - NO MORE AI LOOPS!
                        completeSystemShutdown();
                    }
                });
                
            }, 8000); // 🕒 INCREASED TO 8 SECONDS - ensures AI finishes + auto-listening times out
        }, 1000); // Wait for email send to complete
        
    } else {
        // Skip email - just continue conversation
        if (window.addAIMessage) {
            window.addAIMessage("No problem! Bruce will still contact you directly. Is there anything else I can help with?");
        }
        
        // Clear lead data
        window.isInLeadCapture = false;
        window.currentCaptureType = null;
        window.currentLeadData = null;
        window.suppressSpeakNowBanner = false; // Reset suppression
        
        // Wait then show Speak Now banner
        setTimeout(() => {
            if (window.showDirectSpeakNow) {
                window.showDirectSpeakNow();
            }
        }, 2000);
    }
}

// 🚨 COMPLETE SYSTEM SHUTDOWN FUNCTION
function completeSystemShutdown() {
    console.log('🛑 COMPLETE SYSTEM SHUTDOWN - Stopping all AI activity');
    
    // 1. STOP ALL AI SPEECH IMMEDIATELY
    if (window.stopAllSpeech && typeof window.stopAllSpeech === 'function') {
        window.stopAllSpeech();
    }
    
    // 2. STOP ALL LISTENING
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    // 3. REMOVE ALL BANNERS
    const banners = document.querySelectorAll('.speak-now-banner, [class*="speakNow"], #speakNowBanner');
    banners.forEach(banner => banner.remove());
    
    // 4. RESET ALL CONVERSATION FLAGS
    window.isInLeadCapture = false;
    window.currentCaptureType = null;
    window.currentLeadData = null;
    window.bannerCooldown = false;
    window.suppressSpeakNowBanner = true; // 🚫 PREVENT FUTURE BANNERS
    
    // 5. CLEAR ANY PENDING TIMEOUTS
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
    
    // 6. SHOW THANK YOU SCREEN
    if (typeof showThankYouSplash === 'function') {
        showThankYouSplash();
    }
    
    console.log('✅ SYSTEM COMPLETELY SHUT DOWN - No more AI loops');
}

function showUniversalConfirmation(options) {
    console.log("🎯 UNIVERSAL CONFIRMATION: Showing", options);
    
    // Close any existing banners first
    if (window.closeSpeakNowBanner) {
        window.closeSpeakNowBanner();
    }
    
    const config = {
        type: options.type || 'decision', // 'email' or 'decision'
        title: options.title || "🎉 Success!",
        message: options.message || "Your request has been processed.",
        question: options.question || "What would you like to do next?",
        primaryText: options.primaryText || "Continue",
        secondaryText: options.secondaryText || "Finish",
        onPrimary: options.onPrimary || function() { 
            console.log("Primary action clicked");
            if (window.showDirectSpeakNow) window.showDirectSpeakNow();
        },
        onSecondary: options.onSecondary || function() { 
            console.log("Secondary action clicked");
            if (window.showThankYouSplash) window.showThankYouSplash();
        },
        data: options.data || {} // For thank you screen
    };
    
    let confirmationHTML = '';
    
    if (config.type === 'email') {
        // EMAIL CONFIRMATION STYLE
        confirmationHTML = `
            <div id="universal-confirmation" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                min-width: 400px;
                color: white;
                border: 4px solid #fff;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">📧</div>
                <h3 style="margin: 0 0 15px 0; font-size: 28px;">${config.title}</h3>
                <p style="margin: 0 0 10px 0; font-size: 16px; line-height: 1.5; opacity: 0.9;">
                    ${config.message}
                </p>
                <p style="margin: 0 0 30px 0; font-size: 18px; line-height: 1.5; font-weight: bold; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                    ${config.question}
                </p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="window.handleUniversalPrimary()" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: 2px solid white;
                        padding: 15px 30px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        flex: 1;
                        backdrop-filter: blur(10px);
                    ">${config.primaryText}</button>
                    <button onclick="window.handleUniversalSecondary()" style="
                        background: white;
                        color: #667eea;
                        border: 2px solid white;
                        padding: 15px 30px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        flex: 1;
                    ">${config.secondaryText}</button>
                </div>
            </div>
        `;
    } else {
        // DECISION PANEL STYLE
        confirmationHTML = `
            <div id="universal-confirmation" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                min-width: 400px;
                border: 4px solid #2ecc71;
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">🎯</div>
                <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 28px;">${config.title}</h3>
                ${config.message ? `<p style="margin: 0 0 10px 0; color: #555; line-height: 1.5; font-size: 16px;">${config.message}</p>` : ''}
                <p style="margin: 0 0 25px 0; color: #2c3e50; line-height: 1.5; font-size: 18px; font-weight: bold;">
                    ${config.question}
                </p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="window.handleUniversalPrimary()" style="
                        background: #2ecc71;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        flex: 1;
                    ">${config.primaryText}</button>
                    <button onclick="window.handleUniversalSecondary()" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        flex: 1;
                    ">${config.secondaryText}</button>
                </div>
            </div>
        `;
    }
    
    // Add overlay
    confirmationHTML += `
        <div id="universal-confirmation-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
        "></div>
    `;
    
    // Add to page
    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    
    // Store callbacks globally
    window.handleUniversalPrimary = function() {
        cleanupUniversalConfirmation();
        config.onPrimary();
    };
    
    window.handleUniversalSecondary = function() {
        cleanupUniversalConfirmation();
        config.onSecondary();
    };
    
    console.log("✅ UNIVERSAL CONFIRMATION: Displayed successfully");
}

function cleanupUniversalConfirmation() {
    const confirmation = document.getElementById('universal-confirmation');
    const overlay = document.getElementById('universal-confirmation-overlay');
    if (confirmation) confirmation.remove();
    if (overlay) overlay.remove();
}

// Make globally available
window.showUniversalConfirmation = showUniversalConfirmation;
window.cleanupUniversalConfirmation = cleanupUniversalConfirmation;

// 🚨 EMERGENCY FIX - REMOVE COOLDOWN INTERFERENCE
function emergencySpeechFix() {
    console.log('🚨 EMERGENCY SPEECH FIX - Removing cooldown interference');
    
    // COMPLETELY DISABLE COOLDOWN SYSTEM
    window.bannerCooldown = false;
    window.suppressSpeakNowBanner = false;
    window.isInLeadCapture = false;
    
    // STOP ALL ACTIVE LISTENING FIRST
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    // REMOVE ANY ACTIVE BANNERS
    const banners = document.querySelectorAll('.speak-now-banner, [class*="speakNow"], #speakNowBanner');
    banners.forEach(banner => banner.remove());
    
    // WAIT 500ms FOR CLEAN RESET
    setTimeout(() => {
        // START FRESH LISTENING SESSION
        if (window.startListening && typeof window.startListening === 'function') {
            window.startListening();
        }
    }, 500);
    
    console.log('✅ Emergency speech fix applied - voice should capture instantly now');
}

function completeLeadCapture() {
    if (!window.currentLeadData) {
        console.error('❌ currentLeadData is null in completeLeadCapture');
        return;
    }
    
    const data = window.currentLeadData;
    const captureType = data.captureType;
    
    console.log('✅ Completing lead capture for:', captureType);
    
    // 1. SEND INTERNAL NOTIFICATION (for all capture types)
    sendInternalNotification(data, captureType);
    
    // 2. HANDLE CLIENT EMAILS (only for types that collect email)
    if (captureType === 'consultation' || captureType === 'freeBook' || captureType === 'preQualifier') {
        // These flows collect email, so send client confirmation
        sendClientConfirmationEmail(data, captureType);
    } else if (captureType === 'requestCall' || captureType === 'clickToCall') {
        // These flows DON'T collect email, so use universal close
        universalCloseSequence(captureType);
    } else {
        // Fallback for any other types
        universalCloseSequence(captureType);
    }
    
    // 3. TRACK THE SUCCESSFUL CAPTURE
    console.log('🎯 Lead capture completed successfully:', {
        type: captureType,
        name: data.name,
        phone: data.phone,
        hasEmail: !!data.email
    });
    
    // Note: Don't reset currentLeadData here - let universalCloseSequence handle that
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
// UNIVERSAL DECISION PANEL (WORKS FOR ALL LEAD TYPES)
// ================================
function showDecisionPanel(options) {
    console.log("🎯 UNIVERSAL DECISION PANEL: Showing for all lead types");
    
    // 🚫 CRITICAL: Stop listening and speaking FIRST
    if (window.stopAllSpeech) {
        window.stopAllSpeech();
    }
    if (window.stopListening) {
        window.stopListening();
    }
    if (window.closeSpeakNowBanner) {
        window.closeSpeakNowBanner();
    }
    
    // Remove any existing decision panel first
    cleanupDecisionPanel();
    
    const config = {
        question: options.question || "What would you like to do next?",
        yesText: options.yesText || "Continue", 
        skipText: options.skipText || "Finish",
        onYes: options.onYes || function() { 
            console.log("Continue clicked");
            if (window.showDirectSpeakNow) window.showDirectSpeakNow();
        },
        onSkip: options.onSkip || function() { 
            console.log("Finish clicked");
            
            // ✅ UNIVERSAL: Get name from ANY source and pass to thank you
            const userName = window.currentLeadData?.name || window.userFirstName || '';
            const captureType = window.currentLeadData?.captureType || 'default';
            
            if (window.showThankYouSplash) {
                window.showThankYouSplash(userName, captureType);
            }
            
            // Reset system
            window.isInLeadCapture = false;
            window.currentLeadData = null;
        }
    };
    
    // Create decision panel that MATCHES your email confirmation EXACTLY
    const decisionHTML = `
        <div class="email-confirmation-buttons decision-panel" style="
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
                ${config.question}
            </div>
            <div style="
                display: flex; 
                justify-content: center; 
                gap: 20px;
                flex-wrap: wrap;
            ">
                <button onclick="window.handleDecisionYes()" style="
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
                    ${config.yesText}
                </button>
                <button onclick="window.handleDecisionSkip()" style="
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
                    ${config.skipText}
                </button>
            </div>
        </div>
    `;
    
    // Add to the SAME container as email confirmation
    const chatContainer = document.getElementById('chatMessages') || 
                         document.querySelector('.chat-messages') ||
                         document.querySelector('.chat-container') ||
                         document.body;
    
    chatContainer.insertAdjacentHTML('beforeend', decisionHTML);
    
    // Auto-scroll to show the buttons (EXACTLY like email confirmation)
    setTimeout(() => {
        const panel = document.querySelector('.decision-panel');
        if (panel) {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
    
    // Store callbacks globally
    window.handleDecisionYes = function() {
        cleanupDecisionPanel();
        config.onYes();
    };
    
    window.handleDecisionSkip = function() {
        cleanupDecisionPanel();
        config.onSkip();
    };
    
    console.log("✅ UNIVERSAL DECISION PANEL: Ready for all lead types");
}

// ================================
// SHARED UTILITY FUNCTIONS (Both panels use these)
// ================================
function cleanupDecisionPanel() {
    const panels = document.querySelectorAll('.decision-panel');
    panels.forEach(panel => panel.remove());
}

// Make ALL functions globally available
window.showEmailDecisionPanel = showEmailDecisionPanel;
window.showDecisionPanel = showDecisionPanel;
window.cleanupDecisionPanel = cleanupDecisionPanel;

// ================================
// EMAIL DECISION PANEL (For email confirmations)
// ================================
function showEmailDecisionPanel() {
    console.log("📧 EMAIL DECISION PANEL: Showing email confirmation");
    
    // 🚫 Stop listening and speaking FIRST
    if (window.stopAllSpeech) window.stopAllSpeech();
    if (window.stopListening) window.stopListening();
    if (window.closeSpeakNowBanner) window.closeSpeakNowBanner();
    
    // Remove any existing decision panel first
    cleanupDecisionPanel();
    
    const decisionHTML = `
        <div class="email-confirmation-buttons decision-panel" style="
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
                Would you like me to send a confirmation email?
            </div>
            <div style="
                display: flex; 
                justify-content: center; 
                gap: 20px;
                flex-wrap: wrap;
            ">
                <button onclick="window.handleEmailYes()" style="
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
                    Send Email
                </button>
                <button onclick="window.handleEmailNo()" style="
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
                    No Thanks
                </button>
            </div>
        </div>
    `;
    
    const chatContainer = document.getElementById('chatMessages') || 
                         document.querySelector('.chat-messages') ||
                         document.querySelector('.chat-container') ||
                         document.body;
    
    chatContainer.insertAdjacentHTML('beforeend', decisionHTML);
    
    // Auto-scroll to show the buttons
    setTimeout(() => {
        const panel = document.querySelector('.decision-panel');
        if (panel) {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
    
    // Store callbacks globally
    window.handleEmailYes = function() {
        cleanupDecisionPanel();
        console.log("✅ Email confirmation: YES - sending email");
        // Trigger email sending logic here
        if (window.sendConfirmationEmail) {
            window.sendConfirmationEmail();
        }
    };
    
    window.handleEmailNo = function() {
        cleanupDecisionPanel();
        console.log("❌ Email confirmation: NO - skipping email");
        // Continue to position panel or next step
        if (window.showDirectSpeakNow) {
            window.showDirectSpeakNow();
        }
    };
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

    // STANDARDIZE PARAMETER NAMES ACROSS ALL TEMPLATES
    if (type === 'consultation') {
        internalTemplateId = EMAILJS_CONFIG.templates.consultation;
        internalTemplateParams = {
            to_email: 'duncansfury@gmail.com',
            name: data.name,           // CHANGED from from_name
            email: data.email,         // CHANGED from from_email  
            phone: data.phone,
            contactTime: data.contactTime, // CHANGED from contact_time
            inquiryType: 'CONSULTATION_REQUEST',
            transcript: `Consultation request for ${data.contactTime}`,
            message: `FREE CONSULTATION REQUEST\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nBest Time: ${data.contactTime}`,
            timestamp: new Date().toLocaleString()
        };
    } else if (type === 'clickToCall') {
        internalTemplateId = EMAILJS_CONFIG.templates.clickToCall;
        internalTemplateParams = {
            to_email: 'duncansfury@gmail.com',
            name: data.name,           // CHANGED from from_name
            phone: data.phone,
            email: data.email || 'Not provided', // ADDED missing field
            contactTime: 'ASAP',                // ADDED missing field
            inquiryType: 'CALL_REQUEST',
            transcript: data.reason || 'Call request',
            message: `CLICK-TO-CALL REQUEST\n\nName: ${data.name}\nPhone: ${data.phone}\nReason: ${data.reason}`,
            timestamp: new Date().toLocaleString()
        };
    } else if (type === 'freeBook') {
        internalTemplateId = EMAILJS_CONFIG.templates.freeBook;
        internalTemplateParams = {
            to_email: data.email,
            name: data.name,
            phone: data.phone || 'Not provided',     // ADDED missing field
            email: data.email,
            contactTime: 'N/A',                     // ADDED missing field
            inquiryType: 'FREE_BOOK_REQUEST',
            transcript: `Free book request${data.wantsEvaluation ? ' + evaluation' : ''}`,
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
            to_email: 'duncansfury@gmail.com',
            name: data.name || 'Not provided',
            email: data.email || 'Not provided',
            phone: data.phone || 'Not provided',
            contactTime: 'Within 24 hours',           // ADDED missing field
            inquiryType: 'PRE_QUALIFICATION_REQUEST',
            transcript: `Pre-qualification score: ${qualificationScore} (${qualificationLevel})`,
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
            console.log('✅ INTERNAL NOTIFICATION SENT TO BRUCE!', internalTemplateParams);
            
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
    let confirmationParams = {}; // 🎯 MOVE THIS OUTSIDE SWITCH
    
    switch(captureType) {
        case 'preQualifier':
            inquiryType = 'PRE-QUALIFICATION CONFIRMATION';
            emailSubject = 'Pre-Qualification Confirmed + Free Book - New Clients Inc';
            
            // 🎯 PRE-QUAL SCORING LOGIC
            let qualificationScore = 0;
            let qualifications = [];
            
            const experienceYears = parseInt(leadData.experienceYears) || 0;
            if (experienceYears >= 3) {
                qualificationScore += 25;
                qualifications.push(`${experienceYears} years experience`);
            }
            
            if (leadData.licenseStatus && leadData.licenseStatus.toLowerCase().includes('cpa')) {
                qualificationScore += 25;
                qualifications.push('CPA licensed');
            }
            
            if (leadData.acquisitionTimeline) {
                const timeline = leadData.acquisitionTimeline.toLowerCase();
                if (timeline.includes('immediate') || timeline.includes('3 month') || timeline.includes('6 month')) {
                    qualificationScore += 25;
                    qualifications.push('Ready for acquisition');
                }
            }
            
            if (leadData.budgetRange && leadData.budgetRange.trim() !== '') {
                qualificationScore += 25;
                qualifications.push(`Budget: ${leadData.budgetRange}`);
            }
            
            const qualificationLevel = qualificationScore >= 75 ? 'HIGH' : 
                                      qualificationScore >= 50 ? 'MEDIUM' : 'BASIC';
            
            confirmationParams = {
                to_email: cleanEmail,
                name: leadData.name,
                email: cleanEmail,
                phone: leadData.phone || 'Not provided',
                contactTime: leadData.contactTime || 'Within 24 hours',
                inquiryType: inquiryType,
                subject: emailSubject,
                book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG',
                
                // 🎯 PRE-QUAL SPECIFIC PARAMS
                qualification_score: qualificationScore.toString(),
                qualification_level: qualificationLevel,
                recommended_action: qualificationLevel === 'HIGH' ? 'Contact within 4 hours' : 
                                   qualificationLevel === 'MEDIUM' ? 'Contact within 24 hours' : 'Contact within 48 hours',
                qualifications: qualifications.join(', '),
                experience_years: leadData.experienceYears || 'Not specified',
                license_status: leadData.licenseStatus || 'Not specified',
                acquisition_timeline: leadData.acquisitionTimeline || 'Not specified',
                budget_range: leadData.budgetRange || 'Not specified',
                geographic_preference: leadData.geographicPreference || 'Not specified',
                practice_size: leadData.practiceSize || 'Not specified',
                specialization_interest: leadData.specializationInterest || 'Not specified',
                financing_needed: leadData.financingNeeded || 'Not specified',
                timestamp: new Date().toLocaleString(),
                title: ''
            };
            break;
            
        case 'consultation':
            inquiryType = 'CONSULTATION BOOKING CONFIRMATION';
            emailSubject = 'Consultation Booked + Free Book - New Clients Inc';
            confirmationParams = {
                to_email: cleanEmail,
                name: leadData.name,
                email: cleanEmail,
                phone: leadData.phone || 'Not provided',
                contactTime: leadData.contactTime || 'Within 24 hours',
                inquiryType: inquiryType,
                subject: emailSubject,
                book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG'
            };
            break;
            
        case 'freeBook':
            inquiryType = 'FREE BOOK CONFIRMATION';
            emailSubject = 'Your Free Book - New Clients Inc';
            confirmationParams = {
                to_email: cleanEmail,
                name: leadData.name,
                email: cleanEmail,
                phone: leadData.phone || 'Not provided',
                contactTime: leadData.contactTime || 'Within 24 hours',
                inquiryType: inquiryType,
                subject: emailSubject,
                book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG'
            };
            break;
            
        case 'clickToCall':
            inquiryType = 'URGENT CALL CONFIRMATION';
            emailSubject = 'Urgent Call Request - New Clients Inc';
            confirmationParams = {
                to_email: cleanEmail,
                name: leadData.name,
                email: cleanEmail,
                phone: leadData.phone || 'Not provided',
                contactTime: leadData.contactTime || 'Within 24 hours',
                inquiryType: inquiryType,
                subject: emailSubject,
                book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG'
            };
            break;
            
        case 'requestCall':
            inquiryType = 'CALL REQUEST CONFIRMATION';
            emailSubject = 'Call Request Confirmed + Free Book - New Clients Inc';
            confirmationParams = {
                to_email: cleanEmail,
                name: leadData.name,
                email: cleanEmail,
                phone: leadData.phone || 'Not provided',
                contactTime: leadData.contactTime || 'Within 24 hours',
                inquiryType: inquiryType,
                subject: emailSubject,
                book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG'
            };
            break;
            
        default:
            inquiryType = 'REQUEST CONFIRMATION';
            emailSubject = 'Confirmation - New Clients Inc';
            confirmationParams = {
                to_email: cleanEmail,
                name: leadData.name,
                email: cleanEmail,
                phone: leadData.phone || 'Not provided',
                contactTime: leadData.contactTime || 'Within 24 hours',
                inquiryType: inquiryType,
                subject: emailSubject,
                book_image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761797944987_book-promo.PNG'
            };
    }
    
    // 🎯 ADD DEBUG LOG TO SEE WHAT'S BEING SENT
    console.log('🔍 CLIENT EMAIL PARAMS FOR', captureType, ':', confirmationParams);
    
    // Send CLIENT confirmation using the confirmation template
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templates.clientConfirmation, confirmationParams)
        .then(function(response) {
            console.log('✅ CLIENT CONFIRMATION EMAIL SENT!');

            // 🎯 ADD THIS ONE LINE: Block banner during confirmation question
            window.isInConfirmationDialog = true;
            
            if (window.showUniversalBanner) {
                window.showUniversalBanner('emailSent');
            }
            
            let successMessage = `Confirmation email sent to ${cleanEmail}! Is there anything else I can help you with?`;

            if (window.addAIMessage) {
                window.addAIMessage(successMessage);
            }

            // Clear lead data
            window.isInLeadCapture = false;
            window.currentCaptureType = null;
            window.currentLeadData = null;

            if (window.speakText) {
                window.speakText(successMessage);
                
                // Wait for speech then show DECISION PANEL
                const checkSpeech = setInterval(() => {
                    if (!window.isSpeaking) {
                        clearInterval(checkSpeech);
                        setTimeout(() => {
                            // 🎯 SHOW DECISION PANEL INSTEAD OF EMPTY CALL
                            if (window.showDecisionPanel) {
                                window.showDecisionPanel({
                                    question: "Is there anything else I can help you with?",
                                    yesText: "Yes, Continue", 
                                    skipText: "No, Finish",
                                    onYes: function() { 
                                        console.log("User wants to continue - show position panel");
                                        if (window.showPositionPanel) {
                                            window.showPositionPanel();
                                        } else if (window.showDirectSpeakNow) {
                                            window.showDirectSpeakNow();
                                        }
                                    },
                                    onSkip: function() { 
                                        console.log("User is finished");
                                        const userName = window.userFirstName || '';
                                        if (window.showThankYouSplash) {
                                            window.showThankYouSplash(userName, 'consultation');
                                        }
                                    }
                                });
                            }
                        }, 1000);
                    }
                }, 100);
            } else {
                setTimeout(() => {
                    // 🎯 SHOW DECISION PANEL IN FALLBACK CASE TOO
                    if (window.showDecisionPanel) {
                        window.showDecisionPanel({
                            question: "Is there anything else I can help you with?",
                            yesText: "Yes, Continue", 
                            skipText: "No, Finish",
                            onYes: function() { 
                                console.log("User wants to continue");
                                if (window.showPositionPanel) {
                                    window.showPositionPanel();
                                } else if (window.showDirectSpeakNow) {
                                    window.showDirectSpeakNow();
                                }
                            },
                            onSkip: function() { 
                                console.log("User is finished");
                                const userName = window.userFirstName || '';
                                if (window.showThankYouSplash) {
                                    window.showThankYouSplash(userName, 'consultation');
                                }
                            }
                        });
                    }
                }, 3000);
            }
        }, function(error) {
            console.error('❌ CLIENT CONFIRMATION EMAIL FAILED:', error);
            
            // 🎯 Handle email failure with decision panel too
            let failureMessage = "The confirmation email couldn't be sent, but Bruce will still contact you directly! Is there anything else I can help with?";
            
            if (window.addAIMessage) {
                window.addAIMessage(failureMessage);
            }
            
            // Clear lead data
            window.isInLeadCapture = false;
            window.currentCaptureType = null;
            window.currentLeadData = null;
            
            setTimeout(() => {
                if (window.showDecisionPanel) {
                    window.showDecisionPanel({
                        question: "Is there anything else I can help you with?",
                        yesText: "Yes, Continue", 
                        skipText: "No, Finish",
                        onYes: function() { 
                            console.log("User wants to continue");
                            if (window.showDirectSpeakNow) window.showDirectSpeakNow();
                        },
                        onSkip: function() { 
                            console.log("User is finished");
                            const userName = window.userFirstName || '';
                            if (window.showThankYouSplash) {
                                window.showThankYouSplash(userName, captureType);
                            }
                        }
                    });
                }
            }, 2000);
        });
}

// Make functions globally accessible
window.handleEmailConfirmation = handleEmailConfirmation;
window.sendOriginalLeadEmail = sendOriginalLeadEmail;

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

    // ✅ BULLETPROOF NAME HANDLING
    let displayName = name;
    // Try all possible name sources
    if (!displayName && window.currentLeadData?.name) {
        displayName = window.currentLeadData.name;
    }
    if (!displayName && window.userFirstName) {
        displayName = window.userFirstName;
    }
    // If still no name, use empty string
    displayName = displayName || '';
    
    console.log('🔍 FINAL NAME FOR THANK YOU:', displayName);
    
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
            <h1 style="font-size: 32px; margin-bottom: 15px; font-weight: 300; letter-spacing: 1px; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                ${displayName ? `Thank You, ${displayName}!` : 'Thank You!'}
            </h1>
            <p style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 300;">Thank you for visiting!</p>
            <p style="font-size: 16px; margin-top: 15px; opacity: 0.8; font-weight: 300;">Have a wonderful day!</p>
            <div style="margin-top: 25px; font-size: 14px; opacity: 0.7; letter-spacing: 1px;">Mobile-Wise AI</div>
            
            <!-- CLOSE CHAT BUTTON -->
            <button onclick="closeChatCompletely()" style="
                margin-top: 30px;
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                color: white;
                border: none;
                padding: 15px 35px;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
                transition: all 0.3s ease;
                min-width: 180px;
                animation: slideInButton 1s ease-out 1s both;
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 10px 30px rgba(255, 107, 107, 0.6)'" 
               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 6px 20px rgba(255, 107, 107, 0.4)'">
                ❌ CLOSE CHAT & EXIT
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
    
   // ✅ PLAY OUTRO AUDIO (Mobile & Desktop Compatible)
setTimeout(() => {
    const audio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1758148837523.mp3');
    audio.volume = 0.8;
    
    // Mobile-friendly audio play with user interaction context
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(e => {
            console.log('Audio play failed (mobile restriction):', e);
            // On mobile, try to play after a user interaction
            document.addEventListener('click', function tryPlayOnce() {
                audio.play().catch(e => console.log('Mobile audio still blocked'));
                document.removeEventListener('click', tryPlayOnce);
            }, { once: true });
        });
    }
}, 500);
    
    // ✅ AUTO-DISMISS AFTER 20 SECONDS
    setTimeout(() => {
        if (document.getElementById('thankYouSplash')) {
            restartConversation();
        }
    }, 30000);
}

function closeChatCompletely() {
    console.log('🚪 IMMEDIATE redirect to newclientsinc.com');
    // ✅ IMMEDIATE REDIRECT - No delays, no animations
    window.location.href = 'https://newclientsinc.com';
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
    
    // 🚀 DELAY SPEAK NOW OVERLAY UNTIL AFTER AI SPEECH COMPLETES
    setTimeout(() => {
        if (typeof showDirectSpeakNow === 'function' && !window.disableSpeakNowBanner) {
            // Wait for AI speech to complete first
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                const speechEndHandler = function() {
                    window.speechSynthesis.removeEventListener('end', speechEndHandler);
                    setTimeout(() => {
                        console.log('🎤 Speak Now overlay triggered AFTER AI speech completed');
                        showDirectSpeakNow();
                    }, 500);
                };
                window.speechSynthesis.addEventListener('end', speechEndHandler);
                
                // 🗑️ DELETE THIS SAFETY TIMEOUT - IT'S CAUSING THE PROBLEM!
                // Safety timeout
                // setTimeout(() => {
                //     window.speechSynthesis.removeEventListener('end', speechEndHandler);
                //     console.log('🎤 Speak Now overlay triggered via safety timeout');
                // }, 5000);
                
            } else {
                console.log('🎤 Speak Now overlay triggered (no AI speech detected)');
                // showDirectSpeakNow();
            }
        }
    }, 2000);
}

// Keep the OLD function name for existing buttons
function initializeClickToCallCapture() {
    // Just call the NEW requestCall function (since requestCall now uses clickToCall template)
    initializeRequestCallCapture();
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
window.stopAIAudioFromVoiceChat = stopAIAudioFromVoiceChat;

// ================================
// GLOBAL EXPORTS
// ================================
window.showCommunicationActionCenter = showCommunicationActionCenter;
window.hideCommunicationActionCenter = hideCommunicationActionCenter;
window.handleActionButton = handleActionButton;
window.initializeConsultationCapture = initializeConsultationCapture;
window.initializeClickToCallCapture = initializeClickToCallCapture;
window.initializeUrgentCallCapture = initializeUrgentCallCapture;
window.initializeRequestCallCapture = initializeRequestCallCapture;
window.initializeFreeBookCapture = initializeFreeBookCapture;
window.initiateUrgentCall = initiateUrgentCall;
window.initializePreQualifierCapture = initializePreQualifierCapture; // 🎯 NOW THIS WILL BE GOLD!


console.log('✅ ACTION SYSTEM UNIFIED - Loaded successfully (FINAL CLEANED VERSION - No restore code)');
