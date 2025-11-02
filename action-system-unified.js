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
        consultation: 'template_yf09xm5',
        clickToCall: 'template_8i0k6hr', 
        preQualifier: 'template_uix9cyx'  // Your new template
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
            
            // 🆕 MANUALLY START LISTENING AFTER AI SPEAKS
            setTimeout(() => {
                if (window.startRealtimeListening) {
                    console.log('🎤 Lead Capture: Manually starting listening for user answer');
                    window.startRealtimeListening();
                }
            }, 5000); // Wait 2 seconds for speech to finish
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
// COMPLETE LEAD CAPTURE & SEND EMAIL
// ================================
function completeLeadCapture() {
    console.log('🎯 Completing lead capture...');
    
    const data = window.currentLeadData;
    const type = window.currentCaptureType;
    
    // Prepare email parameters based on capture type
    let templateId = '';
    let templateParams = {};
    let qualificationLevel = ''; // 🆕 Make this accessible for success message

    if (type === 'consultation') {
        templateId = EMAILJS_CONFIG.templates.consultation;
        templateParams = {
            to_email: 'bizboost.expert@gmail.com',
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
            to_email: 'bizboost.expert@gmail.com',
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
    } else if (type === 'preQualifier') {
        templateId = 'template_uix9cyx'; // 🎯 USING FREE BOOK TEMPLATE FOR PRE-QUALIFIER
        
        // Calculate qualification score
        let qualificationScore = 0;
        let qualifications = [];
        
        // Experience scoring
        if (parseInt(data.experienceYears) >= 3) {
            qualificationScore += 25;
            qualifications.push(`${data.experienceYears} years experience`);
        }
        
        // License scoring
        if (data.licenseStatus && data.licenseStatus.toLowerCase().includes('cpa')) {
            qualificationScore += 25;
            qualifications.push('CPA licensed');
        }
        
        // Timeline scoring (serious buyers)
        if (data.acquisitionTimeline && 
            (data.acquisitionTimeline.toLowerCase().includes('immediate') || 
             data.acquisitionTimeline.toLowerCase().includes('3 month') ||
             data.acquisitionTimeline.toLowerCase().includes('6 month'))) {
            qualificationScore += 25;
            qualifications.push('Ready for acquisition');
        }
        
        // Budget scoring
        if (data.budgetRange) {
            qualificationScore += 25;
            qualifications.push(`Budget: ${data.budgetRange}`);
        }
        
        qualificationLevel = qualificationScore >= 75 ? 'HIGH' : 
                            qualificationScore >= 50 ? 'MEDIUM' : 'BASIC';
        
        templateParams = {
            to_email: 'bizboost.expert@gmail.com',
            from_name: data.name || 'Not provided',
            from_email: data.email || 'Not provided',
            phone: data.phone || 'Not provided',
            qualification_score: qualificationScore,
            qualification_level: qualificationLevel,
            qualifications: qualifications,
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
    
    console.log('📧 Sending email with template:', templateId);
    console.log('📧 Parameters:', templateParams);

    console.log('🔍 DEBUG - Template Parameters Being Sent:');
Object.keys(templateParams).forEach(key => {
    console.log(`  ${key}:`, templateParams[key]);
});

// Also check what the template expects
console.log('📧 Template ID:', templateId);
    
    // 🎯 KEEP THIS - IT'S THE ACTUAL EMAIL SENDING CODE
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
            } else if (type === 'preQualifier') {
                successMessage = `Thank you ${data.name}! Your pre-qualification is complete. Based on your profile, you're a ${qualificationLevel} priority candidate. Bruce will contact you within 24 hours to discuss next steps.`;
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
} // 🎯 END OF FUNCTION - NO MORE CODE AFTER THIS!

// ================================
// LEAD CAPTURE 4: PRE-QUALIFIER INTERVIEW
// ================================
function initializePreQualifierCapture() {
    console.log('🚀 Starting PRE-QUALIFIER capture...');
    
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

console.log('✅ ACTION SYSTEM UNIFIED - Loaded successfully (FINAL CLEANED VERSION - No restore code)');
