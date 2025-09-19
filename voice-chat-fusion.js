// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATION
// Smart Button + Lead Capture + EmailJS + Banner System
// ===================================================

// ===================================================
// 🏗️ GLOBAL VARIABLES
// ===================================================
let recognition = null;
let isListening = false;
let isSpeaking = false;
let isAudioMode = false;
let currentAudio = null;
let persistentMicStream = null;
let micPermissionGranted = false;
let conversationState = 'initial';
let lastAIResponse = '';
let userResponseCount = 0;
let shouldShowSmartButton = false;
let smartButtonText = 'AI Smart Button';
let smartButtonAction = 'default';
let restartTimeout = null;
let lastMessageWasApology = false;
let isInLeadCapture = false;
let leadData = null;

// ===================================================
// 📧 EMAILJS INITIALIZATION (FROM YOUR WORKING SYSTEM)
// ===================================================
(function(){
    if (typeof emailjs !== 'undefined') {
        emailjs.init("7-9oxa3UC3uKxtqGM"); // Your public key
        console.log("📧 EmailJS initialized successfully");
    } else {
        console.log("📧 EmailJS not loaded yet - will initialize when available");
        
        // Load EmailJS if not already loaded
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = () => {
            emailjs.init("7-9oxa3UC3uKxtqGM");
            console.log("📧 EmailJS loaded and initialized");
        };
        document.head.appendChild(script);
    }
})();

// ===================================================
// 📱 MOBILE DEVICE DETECTION
// ===================================================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===================================================
// 🎤 MICROPHONE PERMISSION SYSTEM
// ===================================================
async function requestMicrophoneAccess() {
    const permissionStatus = document.getElementById('permissionStatus');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (permissionStatus) {
            permissionStatus.innerHTML = '<div class="permission-deny">Error: getUserMedia is not supported in this browser</div>';
        }
        return false;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Success - clean up stream immediately
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        
        showMicActivatedStatus();
        return true;
    } catch (err) {
        console.error("Microphone access denied:", err);
        if (permissionStatus) {
            permissionStatus.innerHTML = '<div class="permission-deny">Microphone access denied. Please check your browser permissions and try again.</div>';
        }
        return false;
    }
}

function showMicActivatedStatus() {
    const micStatus = document.getElementById('micStatus');
    if (micStatus) {
        micStatus.style.display = 'block';
        setTimeout(() => {
            micStatus.style.display = 'none';
        }, 3000);
    }
}

// ===================================================
// 🎵 INTRO JINGLE PLAYER
// ===================================================
function playIntroJingle() {
    const introAudio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1757573121859.mp3');
    
    introAudio.volume = 0.7;
    introAudio.preload = 'auto';
    
    introAudio.play().catch(error => {
        console.log('Intro jingle failed to play:', error);
    });
    
    setTimeout(() => {
        if (!introAudio.ended) {
            let fadeOutInterval = setInterval(() => {
                if (introAudio.volume > 0.1) {
                    introAudio.volume -= 0.1;
                } else {
                    introAudio.pause();
                    clearInterval(fadeOutInterval);
                }
            }, 100);
        }
    }, 3000);
}

// ===================================================
// 🎤 SPEECH RECOGNITION SYSTEM
// ===================================================
function checkSpeechSupport() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('❌ Speech recognition not supported in this browser');
        addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
        return false;
    }
    return true;
}

function initializeSpeechRecognition() {
    if (!checkSpeechSupport()) return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    console.log('✅ Speech recognition initialized');
    return true;
}

function getApologyResponse() {
    const sorryMessages = [
        "I'm sorry, I didn't catch that. Can you repeat your answer?",
        "Sorry, I didn't hear you. Please say that again.", 
        "I didn't get that. Could you repeat it?",
        "Let me try listening again. Please speak your answer now."
    ];
    
    lastMessageWasApology = true;
    setTimeout(() => { lastMessageWasApology = false; }, 5000);
    
    return sorryMessages[Math.floor(Math.random() * sorryMessages.length)];
}
    
  function startListening() {
    // ✅ NEW: Smart button gate-keeper - BLOCK listening if smart button is active!
    const smartButton = document.getElementById('smartButton');
    if (smartButton && smartButton.style.display !== 'none') {
        console.log('🚫 Smart button active - BLOCKING startListening()');
        return; // EXIT IMMEDIATELY!
    }
    
    // ✅ REMOVED THE LEAD CAPTURE BLOCKING - Allow speech during lead capture!
    console.log('🎯 startListening() called');
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    
    try {
        if (!recognition) {
            initializeSpeechRecognition();
        }

        recognition.onresult = function(event) {
            let transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

                  // ✅ REMOVE TRAILING PERIODS FROM SPEECH RECOGNITION - FIXED
             transcript = transcript.replace(/\.+$/, '');  // ← Now this WORKS!
            
            const transcriptText = document.getElementById('transcriptText');
            const userInput = document.getElementById('userInput');
            
            if (transcriptText) {
                transcriptText.textContent = 'Speak Now'; // ✅ KEEP EXACTLY AS IS
            }
            
            if (userInput) {
                userInput.value = transcript; // ✅ KEEP EXACTLY AS IS
            }
            
            // ✅ ONLY ADDITION: Special handling for lead capture timing
            if (isInLeadCapture) {
                // Give a tiny bit more time for complete names/phone numbers
                clearTimeout(window.leadCaptureTimeout);
                window.leadCaptureTimeout = setTimeout(() => {
                    if (transcript.trim().length > 1 && userInput.value === transcript) {
                        console.log('🎯 Lead capture auto-send:', transcript);
                        sendMessage();
                    }
                }, 1500); // Slightly longer delay for lead capture
            }
        };

        recognition.onerror = function(event) {
    console.log('🔊 Speech error:', event.error);
    
    if (event.error === 'no-speech') {
        const transcriptText = document.getElementById('transcriptText');
        
        if (isMobileDevice()) {
            console.log('📱 Mobile: Using visual apology');
            
            if (transcriptText) {
                const originalText = transcriptText.textContent;
                transcriptText.textContent = 'Please speak again...';
                
                setTimeout(() => {
                    if (transcriptText) {
                        transcriptText.textContent = 'Speak Now'; // ← Reset to "Speak Now"
                    }
                    
                    // ✅ FORCE RESTART - Bypass gate-keeper for mobile reset!
                    if (isAudioMode && !isSpeaking) {
                        console.log('🔄 Mobile: Force restarting speech recognition');
                        isListening = false; // Reset listening state
                        
                        // Direct restart without gate-keeper check
                        setTimeout(() => {
                            forceStartListening(); // ← New function!
                        }, 500);
                    }
                }, 2000);
            }
            
        } else {
            console.log('🖥️ Desktop: Using voice apology');
            
            lastMessageWasApology = true;
            const apologyResponse = getApologyResponse();
            
            stopListening();
            
            setTimeout(() => {
                addAIMessage(apologyResponse);
                speakResponse(apologyResponse);
                
                if (restartTimeout) clearTimeout(restartTimeout);
                
                restartTimeout = setTimeout(() => {
                    if (isAudioMode && !isListening && !isSpeaking) {
                        startListening();
                    }
                    lastMessageWasApology = false;
                }, 3000);
            }, 500);
        }
    }
};


      recognition.onend = function() {
    console.log('🔚 Recognition ended');
    
    const userInput = document.getElementById('userInput');
    
    if (userInput && userInput.value.trim().length > 0) {
        const currentMessage = userInput.value.trim();
        
        // ✅ IMPROVED DUPLICATE PREVENTION - Allow same message after 3 seconds
        const now = Date.now();
        const timeSinceLastMessage = now - (window.lastMessageTime || 0);
        
        if (!window.lastProcessedMessage || 
            window.lastProcessedMessage !== currentMessage || 
            timeSinceLastMessage > 3000) { // 3 second cooldown
            
            console.log('✅ Sending new message:', currentMessage);
            window.lastProcessedMessage = currentMessage;
            window.lastMessageTime = now;
            sendMessage();
        } else {
            console.log('🚫 Prevented duplicate message (within 3 seconds):', currentMessage);
            userInput.value = '';
        }
    } else {
        // Restart listening logic (keep existing)
        if (isAudioMode && !isSpeaking && isListening && !lastMessageWasApology) {
            console.log('🔄 No speech detected via onend - restarting');
            setTimeout(() => {
                try {
                    if (recognition) {
                        startListening();
                    }
                } catch (error) {
                    console.log('Restart error:', error);
                }
            }, 1000);
        }
    }
};
        
        console.log('🎤 Starting speech recognition...');
        recognition.start();
        isListening = true;
        
        // ✅ SHOW THE GREEN "SPEAK NOW" BANNER
        const liveTranscript = document.getElementById('liveTranscript');
        if (liveTranscript) {
            liveTranscript.style.display = 'flex';
        }

        console.log('✅ Speech recognition started successfully');

    } catch (error) {
        console.error('❌ Error starting speech recognition:', error);
        addAIMessage("Speech recognition failed. Please try again or use text input.");
        switchToTextMode();
    }
}

function stopListening() {
    if (recognition) {
        recognition.stop();
    }

    const micButton = document.getElementById('micButton');
    const liveTranscript = document.getElementById('liveTranscript');
    
    if (micButton) micButton.classList.remove('listening');
    if (liveTranscript) liveTranscript.style.display = 'none';

    isListening = false;
}

// ===================================================
// 🔄 FORCE START LISTENING (BYPASSES GATE-KEEPER)
// ===================================================
function forceStartListening() {
    console.log('🔄 FORCE starting speech recognition (mobile reset)');
    
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    
    try {
        if (!recognition) {
            initializeSpeechRecognition();
        }
        
        console.log('🎤 Force starting speech recognition...');
        recognition.start();
        isListening = true;
        
        // Show the green "SPEAK NOW" banner
        const liveTranscript = document.getElementById('liveTranscript');
        if (liveTranscript) {
            liveTranscript.style.display = 'flex';
        }
        
        console.log('✅ Force speech recognition started successfully');
        
    } catch (error) {
        console.error('❌ Error force starting speech recognition:', error);
    }
}

// ===================================================
// 📧 EMAIL FORMATTING FUNCTION - FIXED
// ===================================================
function formatEmailFromSpeech(speechText) {
    let formattedEmail = speechText.toLowerCase().trim();
    
    // Replace common speech patterns with email format
    formattedEmail = formattedEmail
        .replace(/\s*at\s+/g, '@')           // "at" becomes @
        .replace(/\s*dot\s+/g, '.')          // "dot" becomes .
        .replace(/\s+/g, '')                 // Remove all spaces
        .replace(/,/g, '')                   // Remove commas
        .replace(/\.+$/, '');                // ✅ Remove trailing periods!

            console.log('📧 Email conversion DEBUG:', {
        original: speechText,
        cleaned: formattedEmail,
        hasTrailingPeriod: /\.$/.test(speechText)
    });
    
    console.log('📧 Email conversion:', speechText, '→', formattedEmail);
    return formattedEmail;
}

// ===================================================
// 🎯 CLEAN ACTIVATION SYSTEM
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    const mainMicButton = document.getElementById('mainMicButton');
    if (mainMicButton) {
        mainMicButton.addEventListener('click', async function() {
            playIntroJingle();
            
            document.getElementById('centerMicActivation').style.display = 'none';
            
            await activateMicrophone();
        });
    }
});

// ===================================================
// 🎤 MICROPHONE ACTIVATION SYSTEM
// ===================================================
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    if (!window.isSecureContext) {
        addAIMessage("Microphone access requires HTTPS. Please ensure you're on a secure connection.");
        return;
    }

    try {
        const permissionGranted = await requestMicrophoneAccess();
        
        if (permissionGranted) {
            micPermissionGranted = true;
            isAudioMode = true;

            const micButton = document.getElementById('micButton');
            if (micButton) {
                micButton.classList.add('listening');
            }
            
            initializeSpeechRecognition();

            setTimeout(() => {
                const greeting = "Hi! I'm Bruce's assistant. How can I help you?";
                addAIMessage(greeting);
                speakResponse(greeting);
            }, 1300);

        } else {
            throw new Error('Microphone permission denied');
        }

    } catch (error) {
        console.log('❌ Microphone access failed:', error);
        
        let errorMessage = "Microphone access was denied. ";
        if (error.name === 'NotAllowedError') {
            errorMessage += "Please check your browser permissions and allow microphone access.";
        } else if (error.name === 'NotFoundError') {
            errorMessage += "No microphone found. Please check your device settings.";
        } else {
            errorMessage += "Please try again or use text input.";
        }

        addAIMessage(errorMessage);
        switchToTextMode();
    }
}

// ===================================================
// 💭 MESSAGE HANDLING SYSTEM
// ===================================================
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
}

function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ===================================================
// 💬 TEXT INPUT SYSTEM
// ===================================================
function sendMessage() {
    const userInput = document.getElementById('userInput');
    if (!userInput) return;
    
    const message = userInput.value.trim();
    if (!message) return;
    
    const liveTranscript = document.getElementById('liveTranscript');
    if (liveTranscript) {
        liveTranscript.style.display = 'none';
    }
    
    addUserMessage(message);
    userInput.value = '';
    
    processUserResponse(message);
}

function processUserResponse(userText) {
    userResponseCount++;
    
    stopListening();
    
    // ✅ CHECK FINAL QUESTION STATE FIRST (BEFORE LEAD CAPTURE!)
    if (conversationState === 'final_question') {
        const response = userText.toLowerCase().trim();
        
        if (response.includes('no') || response.includes('nope') || response.includes("i'm good") || response.includes('nothing')) {
            const goodbye = "Thank you for visiting us today. Have a great day!";
            addAIMessage(goodbye);
            speakResponse(goodbye);
            
            setTimeout(() => {
                showThankYouBanner(); // Final goodbye banner
                conversationState = 'ended';
                stopListening();
                window.lastProcessedMessage = null;
            }, 2000);
            
            return;
        }
        
        // If unclear, ask again
        addAIMessage("Is there anything else I can help you with today?");
        speakResponse("Is there anything else I can help you with today?");
        setTimeout(() => {
            startListening();
            window.lastProcessedMessage = null;
        }, 1000);
        return;
    }
    
    // 🆕 SINGLE EMAIL PERMISSION HANDLER - NO DUPLICATES
    if (conversationState === 'asking_for_email_permission') {
        const response = userText.toLowerCase().trim();
        
        if (response.includes('yes') || response.includes('sure') || response.includes('okay') || response.includes('send')) {
            // Send confirmation email - this will handle the flow internally
            sendFollowUpEmail();
            
            // Clear duplicate prevention
            setTimeout(() => {
                window.lastProcessedMessage = null;
            }, 2000);
            return;
            
        } else if (response.includes('no') || response.includes('skip') || response.includes("don't")) {
            // Skip email, go to final question
            const skipMessage = "No problem! Is there anything else I can help you with today?";
            addAIMessage(skipMessage);
            speakResponse(skipMessage);
            conversationState = 'final_question';
            
            setTimeout(() => {
                startListening();
                window.lastProcessedMessage = null;
            }, 1000);
            return;
            
        } else {
            // Clarify
            const clarifyMessage = "Would you like me to send you the book and confirmation email? Just say yes or no.";
            addAIMessage(clarifyMessage);
            speakResponse(clarifyMessage);
            
            setTimeout(() => {
                startListening();
                window.lastProcessedMessage = null;
            }, 1000);
            return;
        }
    }
    
    // 🆕 CHECK IF LEAD CAPTURE SHOULD HANDLE THIS FIRST
    if (processLeadResponse(userText)) {
        setTimeout(() => {
            window.lastProcessedMessage = null;
        }, 2000);
        return;
    }
    
    // Default AI response handler
    setTimeout(() => {
        const responseText = getAIResponse(userText);
        lastAIResponse = responseText;

        console.log('🎯 USER SAID:', userText);
        console.log('🎯 AI RESPONSE:', responseText);
        
        addAIMessage(responseText);
        speakResponse(responseText);
        
        setTimeout(() => {
            window.lastProcessedMessage = null;
        }, 3000);
    }, 800);
}

// ===================================================
// 🔊 VOICE SYNTHESIS SYSTEM
// ===================================================
function speakResponse(message) {
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    window.speechSynthesis.cancel();
    
    if (isMobileDevice()) {
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(message);
            
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.95;
            
            utterance.onstart = function() {
                isSpeaking = true;
                console.log('🔊 AI started speaking (mobile)');

                if (isMobileDevice()) {
                    const micButton = document.getElementById('micButton');
                    const liveTranscript = document.getElementById('liveTranscript');
                    if (micButton) micButton.classList.remove('listening');
                    if (liveTranscript) liveTranscript.style.display = 'none';
                }
            };
            
            utterance.onend = function() {
                isSpeaking = false;
                console.log('🔊 AI finished speaking (mobile)');
                
                if (isAudioMode && !isListening && !lastMessageWasApology) {
                    setTimeout(() => {
                        startListening();
                    }, 1200);
                }
            };
            
            utterance.onerror = function(event) {
                console.log('❌ Speech error:', event.error);
                isSpeaking = false;
            };
            
            window.speechSynthesis.speak(utterance);
            currentAudio = utterance;
        }, 500);
    } else {
        const utterance = new SpeechSynthesisUtterance(message);
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        
        utterance.onstart = function() {
            isSpeaking = true;
            console.log('🔊 AI started speaking');
        };
        
        utterance.onend = function() {
            isSpeaking = false;
            console.log('🔊 AI finished speaking');
            
            if (isAudioMode && !isListening && !lastMessageWasApology) {
                setTimeout(() => {
                    startListening();
                }, 800);
            }
        };
        
        utterance.onerror = function(event) {
            console.log('❌ Speech error:', event.error);
            isSpeaking = false;
        };
        
        window.speechSynthesis.speak(utterance);
        currentAudio = utterance;
    }
}

function addUserMessage(message) {
    console.log('🎯 DEBUG: addUserMessage called with:', message);
    console.trace(); // This shows the call stack - WHO called this function
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
}

// ===================================================
// 🧠 AI RESPONSE SYSTEM
// ===================================================
function getAIResponse(userInput) {

 // ✅ STOP PROCESSING IF CONVERSATION IS ENDED
    if (conversationState === 'ended') {
        return "Thank you for visiting! Have a great day.";
    }
    
    const userText = userInput.toLowerCase();
    let responseText = '';
    
   // ===== BUYING PATH =====
if (conversationState === 'buying_budget_question') {
    responseText = "Great budget range! Are you looking specifically for a CPA practice or would a general accounting practice work?";
    conversationState = 'buying_type_question';
    
} else if (conversationState === 'buying_type_question') {
    responseText = "Perfect choice! How soon are you looking to purchase?";
    conversationState = 'buying_timeline_question';
    
} else if (conversationState === 'buying_timeline_question') {
    responseText = "Thank you for sharing that with me.";
    // 🎁 BANNER TRIGGER HERE
    showBuyingBanner(); 
    setTimeout(() => {
        responseText = "Bruce has exclusive off-market opportunities. Want to see what matches your criteria?";
        conversationState = 'buying_close';
    }, 2000);

// ===== SELLING PATH =====  
} else if (conversationState === 'selling_size_question') {
    // ADD COMPLIMENT BASED ON SIZE
    const compliment = userText.includes('thousand') || userText.match(/\d{4,}/) ? "Wow, that's impressive! " : "Nice solid practice! ";
    responseText = compliment + "What's your approximate annual revenue?";
    conversationState = 'selling_revenue_question';
    
} else if (conversationState === 'selling_revenue_question') {
    responseText = "Excellent numbers! What's driving your decision to sell?";
    conversationState = 'selling_motivation_question';
    
} else if (conversationState === 'selling_motivation_question') {
    responseText = "Thank you for sharing that with me.";
    // 🎁 BANNER TRIGGER HERE  
    showSellingBanner();
    setTimeout(() => {
        responseText = "Your practice has great value in today's market. Ready for Bruce's selling strategy consultation?";
        conversationState = 'selling_close';
    }, 2000);

// ===== VALUATION PATH =====
} else if (conversationState === 'valuation_revenue_question') {
    responseText = "Strong revenue! How many years have you been in practice?";
    conversationState = 'valuation_years_question';
    
} else if (conversationState === 'valuation_years_question') {
    const compliment = parseInt(userText) >= 10 ? "Well-established! " : "Great foundation! ";
    responseText = "Thank you for sharing that with me.";
    // 🎁 BANNER TRIGGER HERE
    showValuationBanner();
    setTimeout(() => {
        responseText = compliment + "Want Bruce's professional valuation of what your practice is worth?";
        conversationState = 'valuation_close';
    }, 2000);
        }
    }

// ===================================================
// 🚀 SMART BANNER BUTTON - COMPLETE SYSTEM
// ===================================================

// 1. MAIN FUNCTION - Creates the clickable banner
function createSmartBannerButton(consultationType = 'valuation', customMessage = null) {
    // Remove any existing banner first
    const existingBanner = document.getElementById('smartBannerButton');
    if (existingBanner) {
        existingBanner.remove();
    }

    const banner = document.createElement('div');
    banner.id = 'smartBannerButton';
    banner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 1000;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: slideUp 0.5s ease-out;
        max-width: 90%;
        text-align: center;
    `;

    // Dynamic content based on consultation type
    const bannerContent = getBannerContent(consultationType, customMessage);
    banner.innerHTML = bannerContent;

    // THE MAGIC CLICK HANDLER
    banner.addEventListener('click', () => {
        console.log(`🚨 Smart Banner clicked: ${consultationType}`);
        handleSmartBannerClick(consultationType);
    });

    // Hover effects
    banner.addEventListener('mouseenter', () => {
        banner.style.transform = 'translateX(-50%) translateY(-5px)';
        banner.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
    });

    banner.addEventListener('mouseleave', () => {
        banner.style.transform = 'translateX(-50%) translateY(0)';
        banner.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
    });

    document.body.appendChild(banner);
    console.log(`✅ Smart Banner Button created for: ${consultationType}`);
}

// 2. BANNER CONTENT GENERATOR
function getBannerContent(type, customMessage) {
    if (customMessage) {
        return `<div style="font-size: 16px; font-weight: 600;">${customMessage}</div>`;
    }

    const messages = {
        buying: `
            <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                🏢 Exclusive Off-Market Opportunities!
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                Click to see practices that match your criteria →
            </div>
        `,
        selling: `
            <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                💰 Maximize Your Practice Value!
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                Ready for Bruce's expert consultation? →
            </div>
        `,
        valuation: `
            <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                🎁 FREE Practice Valuation Worth $2,500!
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                Click for Bruce's professional assessment →
            </div>
        `
    };

    return messages[type] || messages.valuation;
}

// 3. CLICK HANDLER - Uses your existing smart button logic
function handleSmartBannerClick(consultationType) {
    // Hide the banner immediately
    const banner = document.getElementById('smartBannerButton');
    if (banner) {
        banner.style.display = 'none';
    }

    // Use your existing handleSmartButtonClick function
    handleSmartButtonClick(consultationType);
}

// 4. HIDE BANNER FUNCTION
function hideSmartBannerButton() {
    const banner = document.getElementById('smartBannerButton');
    if (banner) {
        banner.remove();
    }
}

// ===================================================
// 🎨 CREATE PROFESSIONAL BANNER SYSTEM
// ===================================================
function createLeadCaptureBanner() {
    // Remove any existing banner
    const existingBanner = document.getElementById('leadCaptureBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    // Create new banner
    const banner = document.createElement('div');
    banner.id = 'leadCaptureBanner';
    banner.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 15px;
        padding: 15px 20px;
        margin: 10px 0 20px 0;
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        color: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: bannerSlideIn 0.5s ease-out;
    `;
    banner.innerHTML = '📝 YOUR CONTACT INFO';
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bannerSlideIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Insert banner at the top of the container, after the header
    const container = document.querySelector('.container');
    const header = container.querySelector('header');
    
    if (header && header.nextSibling) {
        container.insertBefore(banner, header.nextSibling);
    } else {
        container.insertBefore(banner, container.firstChild);
    }
    
    console.log('🎨 Professional banner created and displayed');
}

// ===================================================
// 🔄 COMPLETE LEAD CAPTURE WITH EMAIL INTEGRATION
// ===================================================
function initializeLeadCapture(buttonType = 'valuation') {
    console.log('🚀 Starting complete lead capture system...');
    
    if (isInLeadCapture) return;
    
    leadData = {
        name: '', 
        phone: '', 
        email: '', 
        contactTime: '', 
        inquiryType: buttonType,
        transcript: '',
        step: 0,
        subStep: 'ask',
        tempAnswer: '',
        questions: [
            "Perfect. Let's start with your full name, please.",  // ← YOUR PREFERRED WORDING
            "What's the best phone number to reach you?", 
            "What's your email address?",
            "When would be the best time for our specialist to contact you?"
        ],
        confirmationPrompts: [
            "I heard {answer}, is that correct?",
            "So that's {answer}, is that right?",
            "Let me confirm - {answer}, correct?",
            "Your preferred time is {answer}, is that accurate?"
        ]
    };
    
    isInLeadCapture = true;
    
    // ✅ REMOVED the extra message - go straight to the question
    setTimeout(() => {
        askLeadQuestion(); // This will say "Perfect. Let's start with your full name, please."
    }, 500); // Shorter delay since no intro message
}

function askLeadQuestion() {
    if (!isInLeadCapture || !leadData) return;
    
    if (leadData.step < leadData.questions.length) {
        if (leadData.subStep === 'ask') {
            const question = leadData.questions[leadData.step];
            addAIMessage(question);
            speakMessage(question);
            
        } else if (leadData.subStep === 'confirm') {
            const confirmPrompt = leadData.confirmationPrompts[leadData.step]
                .replace('{answer}', leadData.tempAnswer);
            
            addAIMessage(confirmPrompt);
            speakMessage(confirmPrompt);
        }
    } else {
        completeLeadCollection();
    }
}

function speakMessage(message) {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        utterance.onstart = function() {
            console.log('🔊 AI started speaking - hiding Speak Now');
            // Hide the green banner while AI speaks
            const liveTranscript = document.getElementById('liveTranscript');
            if (liveTranscript) {
                liveTranscript.style.display = 'none';
            }
        };
        
        utterance.onend = function() {
            console.log('🔊 AI finished speaking - showing Speak Now after delay');
            // ✅ PERFECT TIMING: Show "Speak Now" after short delay
            setTimeout(() => {
                if (isInLeadCapture) {
                    const liveTranscript = document.getElementById('liveTranscript');
                    const transcriptText = document.getElementById('transcriptText');
                    
                    if (liveTranscript && transcriptText) {
                        transcriptText.textContent = 'Speak Now...'; // ✅ ADD TEXT!
                        transcriptText.style.display = 'block';
                        liveTranscript.style.display = 'flex';
                    }
                    
                    if (recognition && !isListening) {
                        startListening();
                    }
                }
            }, 300); // ✅ HALF SECOND DELAY - Perfect timing!
        };
        
        window.speechSynthesis.speak(utterance);
    }
}

// ===================================================
// 📧 EMAIL FORMATTING FUNCTION
// ===================================================
function formatEmailFromSpeech(speechText) {
    let formattedEmail = speechText.toLowerCase().trim();
    
    // Replace common speech patterns with email format
    formattedEmail = formattedEmail
        .replace(/\s*at\s+/g, '@')           // "at" becomes @
        .replace(/\s*dot\s+/g, '.')          // "dot" becomes .
        .replace(/\s+/g, '')                 // Remove all spaces
        .replace(/,/g, '');                  // Remove commas
    
    console.log('📧 Email conversion:', speechText, '→', formattedEmail);
    return formattedEmail;
}

// ===================================================
// 🔄 FIXED PROCESS LEAD RESPONSE WITH EMAIL FORMATTING
// ===================================================
function processLeadResponse(userInput) {
    if (!isInLeadCapture || !leadData) return false;
    
    console.log('🎯 Processing lead response:', userInput);
    
    let processedInput = userInput;
    
    // ✅ NEW: Format email addresses when asking for email (step 2)
    if (leadData.step === 2) {
        processedInput = formatEmailFromSpeech(userInput);
        console.log('📧 Formatted email:', processedInput);
    }
    
    // Store the processed input
    leadData.tempAnswer = processedInput;
    
    // Show visual confirmation buttons
    showConfirmationButtons(processedInput);
    
    return true;
}

function showConfirmationButtons(answer) {
    const chatMessages = document.getElementById('chatMessages');
    
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
    scrollChatToBottom();
}

function confirmAnswer(isCorrect) {
    console.log('🎯 User clicked:', isCorrect ? 'Correct' : 'Redo');
    
    // Remove the confirmation buttons
    const buttonContainer = document.querySelector('.confirmation-buttons');
    if (buttonContainer) {
        buttonContainer.remove();
    }
    
    if (isCorrect) {
        // ✅ CORRECT - Save and move on
        const fields = ['name', 'phone', 'email', 'contactTime'];
        const field = fields[leadData.step];
        leadData[field] = leadData.tempAnswer;
        
        console.log(`✅ Confirmed ${field}: ${leadData.tempAnswer}`);
        
        leadData.step++;
        
        if (leadData.step < leadData.questions.length) {
            // More questions to ask
            setTimeout(() => {
                askSimpleLeadQuestion();
            }, 800);
        } else {
            // ✅ FINAL STEP - SHOW BRUCE BANNER IMMEDIATELY!
            setTimeout(() => {
                console.log('🎯 Final confirmation completed - showing Bruce banner!');
                
                // Remove the lead capture banner
                const banner = document.getElementById('leadCaptureBanner');
                if (banner) {
                    banner.remove();
                }
                
                // ✅ SHOW BRUCE'S BANNER IMMEDIATELY!
                showConsultationConfirmedBanner()
                
                // Send email silently in background
                setTimeout(() => {
                    sendLeadEmail(leadData);
                }, 1000);
                
                // Clean up lead capture
                isInLeadCapture = false;
                conversationState = 'final_question';
                
            }, 800);
        }
        
    } else {
        // 🔄 REDO - Skip AI speech, go straight to listening
        console.log('🔄 Redo - clearing field and starting listening immediately');
        
        // Clear temp answer and text field
        leadData.tempAnswer = '';
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.value = '';
        }
        
        // ✅ NO AI SPEECH - Go straight to "Speak Now"
        setTimeout(() => {
            const liveTranscript = document.getElementById('liveTranscript');
            const transcriptText = document.getElementById('transcriptText');
            
            if (liveTranscript && transcriptText) {
                transcriptText.textContent = 'Speak Now...';
                transcriptText.style.display = 'block';
                liveTranscript.style.display = 'flex';
            }
            
            if (recognition && !isListening) {
                startListening();
            }
        }, 300);
    }
}

function askSimpleLeadQuestion() {
    if (!isInLeadCapture || !leadData) return;
    
    console.log('🎯 Asking question for step:', leadData.step);
    
    if (leadData.step < leadData.questions.length) {
        const question = leadData.questions[leadData.step];
        console.log('🎯 Next question:', question);
        
        addAIMessage(question);
        speakMessage(question);
    } else {
        console.log('🎯 All questions complete - finishing lead capture');
        completeLeadCollection();
    }
}

// Make it global so HTML buttons can call it
window.confirmAnswer = confirmAnswer;

function saveConfirmedAnswer() {
    const fields = ['name', 'phone', 'email', 'contactTime'];
    const field = fields[leadData.step];
    leadData[field] = leadData.tempAnswer;
    console.log(`✅ Saved ${field}: ${leadData.tempAnswer}`);
}

function moveToNextQuestion() {
    leadData.step++;
    leadData.subStep = 'ask';
    leadData.tempAnswer = '';
    
    if (leadData.step < leadData.questions.length) {
        addAIMessage("Perfect!");
        setTimeout(() => {
            askLeadQuestion();
        }, 1000);
    } else {
        completeLeadCollection();
    }
}

// ===================================================
// 📧 EMAILJS INTEGRATION - STREAMLINED SYSTEM
// ===================================================
function sendLeadEmail(data) {
    console.log('📧 Preparing to send email with lead data...');
    
    // Prepare conversation transcript
    const messages = document.querySelectorAll('.message');
    let transcript = 'MOBILE-WISE AI CONVERSATION TRANSCRIPT:\n\n';
    messages.forEach(msg => {
        const type = msg.classList.contains('ai-message') ? 'AI' : 'USER';
        transcript += `${type}: ${msg.textContent}\n`;
    });
    
    // Email template parameters with enhanced data validation
    const templateParams = {
        name: data.name || 'No name provided',
        phone: data.phone || 'No phone provided',
        email: data.email || 'No email provided',
        to_email: data.email || 'No email provided',
        contactTime: data.contactTime || 'No preference specified',
        inquiryType: (data.inquiryType || 'general').toUpperCase(),
        transcript: transcript,
        timestamp: new Date().toLocaleString(),
        // 🆕 ADDED: Additional context for the specialist
        source: 'Mobile-Wise AI Formviser',
        urgency: data.inquiryType === 'buying' ? 'HIGH - Buyer Ready' : 'NORMAL'
    };
    
    console.log('📧 Sending email with parameters:', templateParams);
    
    // Send email with enhanced error handling
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_b9bppgb', 'template_yf09xm5', templateParams)
            .then(function(response) {
                console.log('✅ EMAIL SENT SUCCESSFULLY!', response.status, response.text);
                
                // ✅ ENHANCED CONVERSATION FLOW
                setTimeout(() => {
                    // Remove the "LEAD CAPTURED" banner
                    const leadBanner = document.getElementById('leadCaptureBanner');
                    if (leadBanner) leadBanner.remove();
                    
                    // 🆕 IMPROVED: More personalized messaging based on inquiry type
                    let askEmailMessage = `Excellent ${data.name}! I have all your information. Our specialist will contact you at your preferred ${data.contactTime} timeframe.`;
                    
                    // Add inquiry-specific messaging
                    if (data.inquiryType === 'buying') {
                        askEmailMessage += ` Bruce will share some exclusive opportunities that match your criteria.`;
                    } else if (data.inquiryType === 'valuation') {
                        askEmailMessage += ` You'll receive a comprehensive practice valuation analysis.`;
                    }
                    
                    askEmailMessage += ` May I send you Bruce's book "7 Secrets to Selling Your Practice" and a confirmation email now?`;
                    
                    addAIMessage(askEmailMessage);
                    speakResponse(askEmailMessage);
                    
                    // Set conversation state to handle the response
                    conversationState = 'asking_for_email_permission';
                    
                    // 🆕 IMPROVED: Better timing for user response
                    setTimeout(() => {
                        if (!isSpeaking && isAudioMode) {
                            startListening();
                        }
                    }, 4000); // Slightly longer to account for longer message
                }, 1000);
                
            }, function(error) {
                console.error('❌ EMAIL FAILED:', error);
                
                // 🆕 ENHANCED: Better error recovery
                const errorMessage = `I'm sorry ${data.name}, there was an issue sending your request. Let me try a different approach - what's the best way to reach you directly?`;
                addAIMessage(errorMessage);
                speakResponse(errorMessage);
                
                // 🆕 ADDED: Graceful fallback instead of hard reset
                conversationState = 'email_fallback';
                
                setTimeout(() => {
                    if (!isSpeaking && isAudioMode) {
                        startListening();
                    }
                }, 3000);
            });
    } else {
        console.error('❌ EmailJS not available');
        // 🆕 ENHANCED: Better fallback messaging
        addAIMessage(`${data.name}, our email system is temporarily down. Please call us directly at [YOUR_PHONE] or visit our website. I have your information saved.`);
        
        // Still transition to email permission question as backup
        setTimeout(() => {
            conversationState = 'asking_for_email_permission';
        }, 2000);
    }
}

// ===================================================
// 📧 FOLLOW-UP EMAIL - WITH ALL YOUR CURRENT LOGIC
// ===================================================
function sendFollowUpEmail() {
    console.log('📧 DEBUG: leadData at function start:', leadData);
    
    if (!leadData || !leadData.email) {
        console.error('❌ CRITICAL: leadData or email is missing!');
        showThankYouBanner();
        return;
    }
    
    // ✅ SUPER CLEAN EMAIL - Remove any hidden characters
    const cleanEmail = String(leadData.email).trim().replace(/[^\w@.-]/g, '');
    
    console.log('📧 DEBUG: Original email:', leadData.email);
    console.log('📧 DEBUG: Cleaned email:', cleanEmail);
    console.log('📧 DEBUG: Email length:', cleanEmail.length);
    
    const confirmationParams = {
        to_email: cleanEmail,        // ✅ Matches {{to_email}}
        name: leadData.name,         // ✅ Matches {{name}}
        email: cleanEmail,           // ✅ Matches {{email}} (Reply To)
        phone: leadData.phone,
        contactTime: leadData.contactTime,
        inquiryType: 'CONFIRMATION EMAIL WITH BOOK LINK',
        transcript: `CONFIRMATION: Appointment scheduled for ${leadData.contactTime}\n\nFree Book: "7 Secrets to Selling Your Practice"\nDownload Link: https://bruces-book-link.com/download\n\nThank you for choosing New Clients Inc!`,
        timestamp: new Date().toLocaleString()
    };
    
    console.log('📧 DEBUG: to_email specifically:', confirmationParams.to_email);
    
    // ✅ YOUR EXACT EMAIL LOGIC
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_b9bppgb', 'template_8kx812d', confirmationParams)
            .then(function(response) {
                console.log('✅ CONFIRMATION EMAIL SENT!');
                
                // ✅ NO MORE TEXT - JUST THE THANK YOU BANNER

                // ✅ REPLACE BRUCE'S BANNER WITH THANK YOU BANNER
                   showThankYouBanner();
                
            }, function(error) {
                console.error('❌ EMAIL FAILED:', error);
                showThankYouBanner();
                const smartButton = document.getElementById('smartButton');
                if (smartButton) {
                    smartButton.style.display = 'none !important';
                }
            });
    } else {
        showThankYouBanner();
        const smartButton = document.getElementById('smartButton');
        if (smartButton) {
            smartButton.style.display = 'none !important';
        }
    }
}

// ===================================================
// 🔘 QUICK QUESTIONS SYSTEM
// ===================================================
function askQuickQuestion(questionText) {
    console.log('📋 Quick question clicked:', questionText);
    
    if (isSpeaking) {
        console.log('Ignoring quick question - system busy');
        return;
    }
    
    addUserMessage(questionText);
    
    setTimeout(() => {
        const response = getAIResponse(questionText);
        lastAIResponse = response;
        addAIMessage(response);
        speakResponse(response);

    }, 800);
}

function resetLeadCaptureSystem() {
    console.log('🔄 Resetting lead capture system...');
    
    // Remove banner
    const banner = document.getElementById('leadCaptureBanner');
    if (banner) {
        banner.remove();
    }
    
    // Reset variables
    isInLeadCapture = false;
    leadData = null;
    
    // 🆕 ENHANCED: Clear any confirmation buttons that might be hanging around
    const confirmButtons = document.querySelector('.confirmation-buttons');
    if (confirmButtons) {
        confirmButtons.remove();
    }
    
    // ✅ SET THE STATE FOR FINAL QUESTION
    conversationState = 'final_question';
    
    // ✅ ASK THE FINAL QUESTION
    const finalMessage = "Is there anything else I can help you with today?";
    addAIMessage(finalMessage);
    speakResponse(finalMessage);
    
    // 🆕 IMPROVED: Better speech restart logic
    setTimeout(() => {
        if (isAudioMode && recognition && !isListening && !isSpeaking) {
            startListening();
        }
    }, 2000);
}

function showConsultationConfirmedBanner() {
    console.log('🎯 Showing Consultation Confirmed Banner - DUAL SECTION');
    
    // Remove ALL existing banners (Same cleanup as your working version)
    const existingBruce = document.getElementById('bruceBookBanner');
    const existingLead = document.getElementById('leadCaptureBanner');
    const existingConfirm = document.getElementById('emailConfirmationBanner');
    
    if (existingBruce) existingBruce.remove();
    if (existingLead) existingLead.remove();
    if (existingConfirm) existingConfirm.remove();
    
    // Hide smart button
    const smartButton = document.getElementById('smartButton');
    if (smartButton) {
        smartButton.style.display = 'none !important';
    }
    
    // Create DUAL-SECTION banner (keeping your exact styling)
    const confirmationBanner = document.createElement('div');
    confirmationBanner.id = 'consultationConfirmedBanner';
    confirmationBanner.style.cssText = `
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 12px 16px;
        margin: 8px 0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    `;
    
    confirmationBanner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px;">
            
            <!-- LEFT SECTION: Consultation Confirmed -->
            <div style="color: white; text-align: left; flex: 1;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">🎯 Free Consultation Confirmed!</div>
                <div style="font-size: 11px; opacity: 0.9; line-height: 1.3;">Your information has been submitted</div>
            </div>
            
            <!-- RIGHT SECTION: Book (Your exact working code) -->
            <div style="display: flex; align-items: center; gap: 12px;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758088515492_nci-book.png" 
                     style="width: 60px; height: auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);" 
                     alt="Bruce's Book">
                <div style="color: white; text-align: left;">
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">📚 FREE Book for ${leadData.name}!</div>
                    <div style="font-size: 11px; opacity: 0.9; line-height: 1.3;">"7 Secrets to Selling Your Practice"</div>
                </div>
            </div>
            
        </div>
    `;
    
    // Insert using your exact working method
    const container = document.querySelector('.container');
    const header = container.querySelector('header');
    
    if (header && header.nextSibling) {
        container.insertBefore(confirmationBanner, header.nextSibling);
    } else {
        container.insertBefore(confirmationBanner, container.firstChild);
    }
    
    console.log('🎯 Consultation confirmed banner displayed successfully');
}

function showThankYouBanner() {
    console.log('🙏 Showing Thank You Banner with Audio');
    
    // Remove any existing banners
    const existingBruce = document.getElementById('bruceBookBanner');
    const existingThankYou = document.getElementById('thankYouBanner');
    const existingLeadCapture = document.getElementById('leadCaptureBanner');
    const existingEmailConfirmation = document.querySelector('.email-confirmation-banner');
    const existingSuccess = document.querySelector('.success-banner');
    
    if (existingThankYou) existingThankYou.remove();
    if (existingLeadCapture) existingLeadCapture.remove();
    if (existingEmailConfirmation) existingEmailConfirmation.remove();
    if (existingSuccess) existingSuccess.remove();
    
    // Create fancy thank you banner
    const thankYouBanner = document.createElement('div');
    thankYouBanner.id = 'thankYouBanner';
    thankYouBanner.style.cssText = `
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 50%, #2E7D32 100%);
        border: 3px solid rgba(255, 255, 255, 0.4);
        border-radius: 25px;
        padding: 30px;
        margin: 15px 0;
        text-align: center;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
        position: relative;
        overflow: hidden;
        animation: thankYouGlow 2s ease-in-out infinite alternate;
    `;
    
    thankYouBanner.innerHTML = `
        <div style="position: relative; z-index: 2;">
            <div style="font-size: 48px; margin-bottom: 15px;">🙏</div>
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 28px; font-weight: bold; text-shadow: 0 3px 6px rgba(0,0,0,0.4);">
                Thank You for Visiting!
            </h2>
            <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; line-height: 1.6;">
                We appreciate your time and interest.<br>
                <em style="font-size: 16px; opacity: 0.9;">Have a wonderful day!</em>
            </p>
            <div style="margin-top: 15px; color: rgba(255,255,255,0.8); font-size: 14px;">
                🎵 <em>Playing farewell message...</em>
            </div>
        </div>
        <div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); pointer-events: none;"></div>
    `;
    
    // Add glow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes thankYouGlow {
            from { box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(76, 175, 80, 0.3); }
            to { box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 0 30px rgba(76, 175, 80, 0.6); }
        }
    `;
    document.head.appendChild(style);
    
    // Insert into container
    const container = document.querySelector('.container');
    const header = container.querySelector('header');
    
    if (header && header.nextSibling) {
        container.insertBefore(thankYouBanner, header.nextSibling);
    } else {
        container.insertBefore(thankYouBanner, container.firstChild);
    }
    
    // 🎵 PLAY YOUR THANK YOU AUDIO MESSAGE
    setTimeout(() => {
        const thankYouAudio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1758148837523.mp3');
        thankYouAudio.volume = 0.8;
        thankYouAudio.preload = 'auto';
        
        thankYouAudio.play().then(() => {
            console.log('🎵 Thank You audio playing successfully');
        }).catch(error => {
            console.log('🎵 Thank you audio failed to play:', error);
        });
        
        // Optional: Fade out banner after audio completes
        thankYouAudio.onended = function() {
            console.log('🎵 Thank you audio completed');
            // Banner stays visible - user can see the thank you message
        };
        
    }, 500); // Small delay to ensure banner is visible first
    
    console.log('🙏 Thank You Banner with Audio displayed successfully');
}

function showEmailConfirmationBanner() {
    // Remove ALL existing banners
    const existingBruce = document.getElementById('bruceBookBanner');
    const existingLead = document.getElementById('leadCaptureBanner');
    const existingConfirm = document.getElementById('emailConfirmationBanner');
    
    if (existingLead) existingLead.remove(); // Remove "LEAD CAPTURED" banner
    if (existingConfirm) existingConfirm.remove();
    
    const confirmationBanner = document.createElement('div');
    confirmationBanner.id = 'emailConfirmationBanner';
    confirmationBanner.style.cssText = `
        background: rgba(76, 175, 80, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(76, 175, 80, 0.3);
        border-radius: 12px;
        padding: 12px 16px;
        margin: 8px 0;
        text-align: center;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    `;
    
    confirmationBanner.innerHTML = `
        <div style="color: white; font-size: 14px;">
            ✅ <strong>Confirmation Email Sent!</strong><br>
            <span style="font-size: 12px; opacity: 0.9;">Please check your email for the book link</span>
        </div>
    `;
    
    // Insert into container
    const container = document.querySelector('.container');
    const header = container.querySelector('header');
    
    if (header && header.nextSibling) {
        container.insertBefore(confirmationBanner, header.nextSibling);
    } else {
        container.insertBefore(confirmationBanner, container.firstChild);
    }

    setTimeout(() => {
    confirmationBanner.remove();
    // Don't call any other banner - just remove this one
    // The conversation continues to final question
}, 4000);
}

function forceScrollToBottom() {
    setTimeout(() => {
        // Multiple scroll attempts for stubborn mobile
        const scrollTargets = [
            document.getElementById('chatContainer'),
            document.querySelector('.chat-container'),
            document.querySelector('.messages-container'),
            document.body,
            document.documentElement
        ];
        
        scrollTargets.forEach(target => {
            if (target) {
                target.scrollTop = target.scrollHeight;
            }
        });
        
        // Force window scroll
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        
        // ✅ MOBILE SPECIFIC - ENSURE SPEAK NOW IS VISIBLE
        const speakButton = document.getElementById('speakNowButton');
        if (speakButton) {
            speakButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

function endConversation() {
    const goodbye = "Thank you for visiting us today. Have a great day!";
    addAIMessage(goodbye);
    speakResponse(goodbye);
    
    setTimeout(() => {
        replaceBannerWithThankYou();
        conversationState = 'ended';
        stopListening();
    }, 2000);
}

function startFollowUpSequence() {
    conversationState = 'asking_followup_email';
    
    // ✅ ENHANCED: Combined personalized message with follow-up question
    const combinedMessage = `Excellent ${leadData.name}! I have all your information. Our specialist will contact you at ${leadData.phone} during your preferred ${leadData.contactTime} timeframe. May I follow up with a confirmation email and a link to Bruce's new book "7 Secrets to Selling Your Practice"?`;
    
    addAIMessage(combinedMessage);
    speakResponse(combinedMessage);
    
    // Remove the lead capture banner
    const banner = document.getElementById('leadCaptureBanner');
    if (banner) {
        banner.remove();
    }
    
    isInLeadCapture = false;
}

// ===================================================
// 📝 TEXT MODE SWITCHER
// ===================================================
function switchToTextMode() {
    console.log('🔄 Switching to text mode');
    
    if (currentAudio) {
        window.speechSynthesis.cancel();
    }
    
    stopListening();
    
    if (persistentMicStream) {
        persistentMicStream.getTracks().forEach(track => track.stop());
        persistentMicStream = null;
    }
    
    isAudioMode = false;
    micPermissionGranted = false;
    
    const micButton = document.getElementById('micButton');
    const liveTranscript = document.getElementById('liveTranscript');
    
    if (micButton) micButton.classList.remove('listening');
    if (liveTranscript) liveTranscript.style.display = 'none';
    
    addAIMessage("Switched to text mode. Type your message in the text box below.");
    
    console.log('✅ Switched to text mode successfully');
}

// ===================================================
// 🚀 INITIALIZATION SYSTEM
// ===================================================
function initializeChatInterface() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    const micButton = document.getElementById('micButton');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    console.log('✅ Chat interface initialized');
}

// ===================================================
// 🌍 GLOBAL FUNCTIONS
// ===================================================
window.askQuickQuestion = askQuickQuestion;
window.handleSmartButtonClick = handleSmartBannerClick; // ← New function name!

// ===================================================
// 🚀 INITIALIZE THE APPLICATION
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Mobile-Wise AI Formviser - Complete Integration...');
    
    initializeChatInterface();
    
    const chatContainer = document.querySelector('.chat-messages') || document.querySelector('#chatContainer');
    if (chatContainer) {
        chatContainer.innerHTML = '';
    }
});
