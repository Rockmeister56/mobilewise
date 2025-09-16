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
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
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
        // ✅ PREVENT DUPLICATES - Check if we already sent this message
        const currentMessage = userInput.value.trim();
        
        if (!window.lastProcessedMessage || window.lastProcessedMessage !== currentMessage) {
            console.log('✅ Sending new message:', currentMessage);
            window.lastProcessedMessage = currentMessage;
            sendMessage();
        } else {
            console.log('🚫 Prevented duplicate message:', currentMessage);
            // Clear the input since we already processed this
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
    
    // 🆕 CHECK IF LEAD CAPTURE SHOULD HANDLE THIS FIRST
    if (processLeadResponse(userText)) {
        return;
    }
    
    setTimeout(() => {
        const responseText = getAIResponse(userText);
        lastAIResponse = responseText;

        console.log('🎯 USER SAID:', userText);
        console.log('🎯 AI RESPONSE:', responseText);
        
        addAIMessage(responseText);
        speakResponse(responseText);
        
        updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
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
    const userText = userInput.toLowerCase();
    let responseText = '';
    
    if (conversationState === 'initial') {
        if (userText.includes('buy') || userText.includes('purchase') || userText.includes('buying') || userText.includes('acquire')) {
            responseText = "Excellent! Bruce has some fantastic opportunities available. Let me learn more about what you're looking for. What's your budget range for acquiring a practice?";
            conversationState = 'buying_budget_question';
            shouldShowSmartButton = false;
            
        } else if (userText.includes('sell') || userText.includes('selling')) {
            responseText = "I'd love to help you with selling your practice! Let me ask you a few quick questions to better understand your situation. How large is your practice - how many clients do you currently serve?";
            conversationState = 'selling_size_question';
            shouldShowSmartButton = false;
            
        } else if (userText.includes('value') || userText.includes('worth') || userText.includes('valuation') || userText.includes('evaluate')) {
            responseText = "I'd be happy to help with a practice valuation! To give you the most accurate assessment, what's your practice's approximate annual revenue?";
            conversationState = 'valuation_revenue_question';
            shouldShowSmartButton = false;
            
        } else {
            responseText = "Welcome! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. What brings you here today?";
        }
        
    } else if (conversationState === 'selling_size_question') {
        responseText = "That's helpful information! And what's your practice's approximate annual revenue range? This helps Bruce understand the scope and value.";
        conversationState = 'selling_revenue_question';
        
    } else if (conversationState === 'selling_revenue_question') {
        responseText = "Perfect! One more question - what's driving your decision to sell? Retirement, new opportunities, or something else? Understanding your motivation helps Bruce tailor the best approach.";
        conversationState = 'selling_motivation_question';
        
    } else if (conversationState === 'selling_motivation_question') {
        responseText = "Thank you for sharing that with me! Based on what you've told me, Bruce can definitely help you get maximum value for your practice. The market is very strong right now. Would you like to schedule a FREE consultation with Bruce to discuss your selling strategy?";
        conversationState = 'asking_selling_consultation';
        
    } else if (conversationState === 'asking_selling_consultation') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
            responseText = "Fantastic! Please click the button above and we'll get your information over to Bruce immediately. He'll reach out within 24 hours for your FREE practice valuation.";
            shouldShowSmartButton = true;
            smartButtonText = '📞 Schedule Free Valuation';
            smartButtonAction = 'valuation';
            conversationState = 'button_activated_selling';
        } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
            responseText = "No problem at all! If you change your mind, I'm here to help. Is there anything else about selling your practice that you'd like to know?";
            conversationState = 'initial';
        } else {
            responseText = "I want to make sure I understand - would you like Bruce to call you for a free consultation about selling your practice? Just say yes or no.";
        }
        
    } else if (conversationState === 'buying_budget_question') {
        responseText = "Great! And are you specifically looking for a CPA practice, or would a general accounting practice work for you as well?";
        conversationState = 'buying_type_question';
        
    } else if (conversationState === 'buying_type_question') {
        responseText = "Perfect! One more important question - how soon are you looking to complete a purchase? This helps Bruce prioritize which opportunities to show you first.";
        conversationState = 'buying_timeline_question';
        
    } else if (conversationState === 'buying_timeline_question') {
        responseText = "Excellent! Bruce has exclusive off-market opportunities that aren't advertised anywhere else. Based on your criteria, he definitely has some practices that would interest you. Would you like Bruce to show you the available practices that match what you're looking for?";
        conversationState = 'asking_buying_consultation';
        
    } else if (conversationState === 'asking_buying_consultation') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
            responseText = "Outstanding! Please click the button above and Bruce will reach out with current opportunities that match your criteria. Many of these deals move fast!";
            shouldShowSmartButton = true;
            smartButtonText = '🏢 View Available Practices';
            smartButtonAction = 'buying';
            conversationState = 'button_activated_buying';
        } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
            responseText = "That's perfectly fine! When you're ready to see what's available, just let me know. Anything else about buying a practice I can help with?";
            conversationState = 'initial';
        } else {
            responseText = "Would you like Bruce to show you the practices he has available? Just let me know yes or no.";
        }
        
    } else if (conversationState === 'valuation_revenue_question') {
        responseText = "Thank you! And how many years have you been in practice? The longevity and stability really impact the valuation.";
        conversationState = 'valuation_years_question';
        
    } else if (conversationState === 'valuation_years_question') {
        responseText = "Perfect! Your practice sounds well-established. Bruce can provide you with a comprehensive FREE valuation that shows you exactly what your practice is worth in today's market. Would you like to schedule that free valuation consultation with Bruce?";
        conversationState = 'asking_valuation_consultation';
        
    } else if (conversationState === 'asking_valuation_consultation') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
            responseText = "Wonderful! Please click the button above and we'll get you connected with Bruce for your FREE practice valuation. You might be surprised at what your practice is worth!";
            shouldShowSmartButton = true;
            smartButtonText = '📈 Get Practice Valuation';
            smartButtonAction = 'valuation';
            conversationState = 'button_activated_valuation';
        } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
            responseText = "No worries! The valuation offer stands whenever you're ready. Is there anything else about practice valuations I can explain?";
            conversationState = 'initial';
        } else {
            responseText = "Would you like Bruce to provide you with a free practice valuation? Just say yes or no and I'll take care of the rest.";
        }
        
    } else if (conversationState === 'button_activated_selling' || conversationState === 'button_activated_buying' || conversationState === 'button_activated_valuation') {
        responseText = "Perfect! I see you're ready to connect with Bruce. Just click that button above and we'll get everything set up for you right away!";
        
    } else if (conversationState === 'asking_anything_else') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('help')) {
            responseText = "I'm here to help! What else can I assist you with regarding your practice?";
            conversationState = 'initial'; // Back to normal conversation
        } else {
            endConversation();
            return ""; // Don't return text, endConversation handles it
        }
        
    } else {
        responseText = "Thanks for your message! Is there anything else about buying, selling, or valuing a CPA practice that I can help you with?";
        conversationState = 'initial';
        shouldShowSmartButton = false;
    }
    
    return responseText;
}


// ===================================================
// 🎯 SMART BUTTON SYSTEM WITH BANNER
// ===================================================
function updateSmartButton(shouldShow, buttonText, action) {
    const smartButton = document.getElementById('smartButton');
    if (!smartButton) return;
    
    if (shouldShow) {
        smartButton.textContent = buttonText;
        smartButton.style.display = 'block';
        smartButton.onclick = () => handleSmartButtonClick(action);
    } else {
        smartButton.style.display = 'none';
    }
}

// ===================================================
// 🚀 FIXED SMART BUTTON CLICK HANDLER + BANNER
// ===================================================
function handleSmartButtonClick(buttonType) {
    console.log(`🚨 Smart button clicked: ${buttonType}`);
    
    // Fix buttonType if it's an event object
    if (typeof buttonType === 'object') {
        buttonType = 'valuation';
    }

    // 1. HIDE THE SMART BUTTON IMMEDIATELY
    const smartButton = document.getElementById('smartButton');
    if (smartButton) {
        smartButton.style.display = 'none';
    }
    
    // 2. CREATE AND SHOW THE PROFESSIONAL BANNER
    createLeadCaptureBanner();
    
    // 3. STOP SPEECH RECOGNITION COMPLETELY - NO LISTENING YET!
    if (recognition) {
        try {
            recognition.stop();
            isListening = false;
            console.log('🔇 Speech recognition stopped for lead capture');
        } catch (error) {
            console.log('Speech already stopped');
        }
    }
    
    // 4. HIDE THE GREEN "SPEAK NOW" BANNER - DON'T SHOW IT YET!
    const liveTranscript = document.getElementById('liveTranscript');
    if (liveTranscript) {
        liveTranscript.style.display = 'none'; // ← CRITICAL: Hide it!
    }
    
    // 5. UPDATE UI ELEMENTS
    const transcriptText = document.getElementById('transcriptText');
    if (transcriptText) {
        transcriptText.textContent = '';
        transcriptText.style.display = 'none';
    }
    
    const micButton = document.querySelector('.mic-btn');
    if (micButton) {
        micButton.innerHTML = '📋';
        micButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
    }
    
    console.log('🎯 Starting lead capture for:', buttonType);
    
    // 6. START LEAD CAPTURE SYSTEM (BUT NO LISTENING YET!)
    initializeLeadCapture(buttonType);
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
            setTimeout(() => {
                askSimpleLeadQuestion();
            }, 800);
        } else {
            setTimeout(() => {
                completeLeadCollection();
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

function completeLeadCollection() {
    
    // Update banner to show email sending
    const banner = document.getElementById('leadCaptureBanner');
    if (banner) {
        banner.innerHTML = '📧 SENDING EMAIL TO CONSUMER AWARENESS FOUNDATION...';
        banner.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
    }
    
    // Send email via EmailJS
    setTimeout(() => {
        sendLeadEmail(leadData);
    }, 2000);
}

// ===================================================
// 📧 EMAILJS INTEGRATION - COMPLETE SYSTEM
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
    
    // Email template parameters
    const templateParams = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        contactTime: data.contactTime,
        inquiryType: data.inquiryType.toUpperCase(),
        transcript: transcript,
        timestamp: new Date().toLocaleString()
    };
    
    console.log('📧 Sending email with parameters:', templateParams);
    
    // Send email with your actual credentials
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_b9bppgb', 'template_yf09xm5', templateParams)
            .then(function(response) {
                console.log('✅ EMAIL SENT SUCCESSFULLY!', response.status, response.text);
                
                // ✅ NEW: Call our enhanced success handler
                handleEmailSuccess();
                
            }, function(error) {
                console.error('❌ EMAIL FAILED:', error);
                
                // Error feedback
                const banner = document.getElementById('leadCaptureBanner');
                if (banner) {
                    banner.innerHTML = '❌ EMAIL SENDING FAILED - PLEASE TRY AGAIN';
                    banner.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                }
                
                addAIMessage("I'm sorry, there was an issue sending your request. Please try again or contact us directly.");
                
                setTimeout(() => {
                    resetLeadCaptureSystem();
                }, 5000);
            });
    } else {
        console.error('EmailJS not available');
        addAIMessage("Email service temporarily unavailable. Please contact us directly.");
        setTimeout(() => {
            resetLeadCaptureSystem();
        }, 3000);
    }
}

// ✅ KEEP YOUR EXISTING resetLeadCaptureSystem() function - don't change it
function resetLeadCaptureSystem() {
    // Remove banner
    const banner = document.getElementById('leadCaptureBanner');
    if (banner) {
        banner.remove();
    }
    
    // Reset variables
    isInLeadCapture = false;
    leadData = null;
    
    // Return to normal conversation
    addAIMessage("Is there anything else I can help you with today?");
    
    // Restart normal speech recognition if in audio mode
    if (isAudioMode && recognition && !isListening) {
        setTimeout(() => {
            startListening();
        }, 1000);
    }
}

// ===================================================
// 📚 BRUCE'S BOOK BANNER SYSTEM
// ===================================================
function showBruceBookBanner() {
    // Remove any existing banners
    const existingBanner = document.getElementById('bruceBookBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    // Create Bruce's book banner
    const bookBanner = document.createElement('div');
    bookBanner.id = 'bruceBookBanner';
    bookBanner.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 20px;
        margin: 15px 0;
        text-align: center;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        animation: bookBannerSlideIn 0.6s ease-out;
        position: relative;
        overflow: hidden;
    `;
    
    bookBanner.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        ">
            <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1757997800109_book-banner.png" 
                 style="
                     width: 120px;
                     height: auto;
                     border-radius: 10px;
                     box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                 " 
                 alt="Bruce's Book">
            <div style="
                color: white;
                text-align: left;
                flex: 1;
                min-width: 200px;
            ">
                <h3 style="
                    margin: 0 0 10px 0;
                    font-size: 18px;
                    font-weight: bold;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                    📚 FREE Book for ${leadData.name}!
                </h3>
                <p style="
                    margin: 0;
                    font-size: 14px;
                    opacity: 0.9;
                    line-height: 1.4;
                ">
                    "7 Secrets to Selling Your Practice"<br>
                    <em>Exclusive access just for you!</em>
                </p>
            </div>
        </div>
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bookBannerSlideIn {
            from { 
                opacity: 0; 
                transform: translateY(-30px) scale(0.9); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
    `;
    document.head.appendChild(style);
    
    // Insert banner at the top of the container
    const container = document.querySelector('.container');
    const header = container.querySelector('header');
    
    if (header && header.nextSibling) {
        container.insertBefore(bookBanner, header.nextSibling);
    } else {
        container.insertBefore(bookBanner, container.firstChild);
    }
    
    console.log('📚 Bruce\'s book banner displayed with personalization');
}

// ===================================================
// 🎯 STREAMLINED POST-CAPTURE FOLLOW-UP SYSTEM
// ===================================================
function handleEmailSuccess() {
    const banner = document.getElementById('leadCaptureBanner');
    if (banner) {
        banner.innerHTML = '🎉 LEAD CAPTURED & EMAIL SENT!';
        banner.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
    }
    
    // ✅ REMOVED: "Perfect! Your consultation request has been sent to our team."
    // Go straight to the combined message
    setTimeout(() => {
        startFollowUpSequence();
    }, 2000);
}

function startFollowUpSequence() {
    conversationState = 'asking_followup_email';
    
    // ✅ ENHANCED: Combined personalized message with follow-up question
    const combinedMessage = `Excellent ${leadData.name}! I have all your information. Our specialist will contact you at ${leadData.phone} during your preferred ${leadData.contactTime} timeframe. May I follow up with a confirmation email and a link to Bruce's new book "7 Secrets to Selling Your Practice"?`;
    
    addAIMessage(combinedMessage);
    speakResponse(combinedMessage);
    
    // ✅ NEW: Show Bruce's Book Banner instead of smart button
    showBruceBookBanner();
    
    // Remove the lead capture banner
    const banner = document.getElementById('leadCaptureBanner');
    if (banner) {
        banner.remove();
    }
    
    isInLeadCapture = false;
}

function sendConfirmationEmail() {
    console.log('📧 Sending confirmation email...');
    
    const confirmationParams = {
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        contactTime: leadData.contactTime,
        inquiryType: 'CONFIRMATION EMAIL WITH BOOK LINK',
        transcript: `CONFIRMATION: Appointment scheduled for ${leadData.contactTime}\n\nFree Book: "7 Secrets to Selling Your Practice"\nDownload Link: https://bruces-book-link.com/download\n\nThank you for choosing New Clients Inc!`,
        timestamp: new Date().toLocaleString()
    };
    
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_b9bppgb', 'template_8kx812d', confirmationParams)
            .then(function(response) {
                console.log('✅ CONFIRMATION EMAIL SENT!');
                
                // ✅ REPLACE BRUCE'S BANNER WITH THANK YOU BANNER
                replaceBannerWithThankYou();
                
                // ✅ HIDE SMART BUTTON PERMANENTLY
                const smartButton = document.getElementById('smartButton');
                if (smartButton) {
                    smartButton.style.display = 'none !important';
                }
                
                // ✅ NO MORE TEXT - JUST THE THANK YOU BANNER
                
            }, function(error) {
                console.error('❌ EMAIL FAILED:', error);
                replaceBannerWithThankYou();
                const smartButton = document.getElementById('smartButton');
                if (smartButton) {
                    smartButton.style.display = 'none !important';
                }
            });
    } else {
        replaceBannerWithThankYou();
        const smartButton = document.getElementById('smartButton');
        if (smartButton) {
            smartButton.style.display = 'none !important';
        }
    }
}

function replaceBannerWithThankYou() {
    // ✅ FIND THE BRUCE BANNER AND REPLACE IT
    const existingBanner = document.querySelector('.book-banner');
    if (existingBanner) {
        // ✅ CREATE THANK YOU BANNER
        const thankYouBanner = document.createElement('div');
        thankYouBanner.className = 'thank-you-banner';
        thankYouBanner.style.cssText = `
            width: 100%;
            height: 120px;
            background-image: url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758008231877_thanks2.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 16px;
            margin: 12px 8px;
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        // ✅ REPLACE THE BRUCE BANNER
        existingBanner.parentNode.replaceChild(thankYouBanner, existingBanner);
        
        // ✅ MAKE IT CLICKABLE TO CLOSE
        thankYouBanner.onclick = () => {
            window.close();
        };
    }
}

// ✅ MODIFY THE BANNER CREATION TO PREVENT SMART BUTTON
function createBruceBanner() {
    // Your existing banner creation code here
    // BUT ADD THIS AT THE END:
    
    // ✅ FORCE HIDE SMART BUTTON WHEN BANNER APPEARS
    setTimeout(() => {
        const smartButton = document.getElementById('smartButton');
        if (smartButton) {
            smartButton.style.display = 'none !important';
            smartButton.style.visibility = 'hidden !important';
        }
    }, 100);
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
        
        updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
    }, 800);
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
window.handleSmartButtonClick = handleSmartButtonClick;

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
