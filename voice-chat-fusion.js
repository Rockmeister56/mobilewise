// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - FUSION SYSTEM
// Combining mobile-assist2 voice functionality + voice-chat business logic
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
// 📱 MOBILE DEVICE DETECTION
// ===================================================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===================================================
// 🎤 MICROPHONE PERMISSION SYSTEM (FROM mobile-assist2)
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
        
        // Show microphone activated status
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
// 🎵 MOBILE-WISE AI INTRO JINGLE PLAYER
// ===================================================
function playIntroJingle() {
    const introAudio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1757573121859.mp3');
    
    // Set audio properties
    introAudio.volume = 0.7; // 70% volume - adjust as needed
    introAudio.preload = 'auto';
    
    // Play the jingle
    introAudio.play().catch(error => {
        console.log('Intro jingle failed to play:', error);
        // Fail silently - don't break the experience
    });
    
    // Optional: Fade out after a few seconds if AI speaks
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
    }, 3000); // Start fade after 3 seconds
}


// ===================================================
// 🎤 SPEECH RECOGNITION SYSTEM (MOBILE-OPTIMIZED)
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
    
    // MOBILE-OPTIMIZED SETTINGS (FROM mobile-assist2)
    recognition.continuous = false;  // Better for mobile
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    console.log('✅ Speech recognition initialized');
    return true;
}

// ===================================================
// 🚨 APOLOGY RESPONSE SYSTEM (FOR NO-SPEECH ERRORS)
// ===================================================
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
    // ONLY block if actively collecting lead info
    if (isInLeadCapture && document.querySelector('.lead-input-container')) {
        console.log('Lead input active - speech paused');
        return;
    }
    console.log('🎯 startListening() called');
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    try {
        if (!recognition) {
            initializeSpeechRecognition();
        }

        // MOBILE-OPTIMIZED RESULT HANDLER (FIXED)
        recognition.onresult = function(event) {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            // 🎯 FIXED: Keep green button saying "Speak Now" - DON'T update with transcript
            const transcriptText = document.getElementById('transcriptText');
            const userInput = document.getElementById('userInput');
            
            if (transcriptText) {
                transcriptText.textContent = 'Speak Now'; // 🚀 ALWAYS "Speak Now" - never transcript
            }
            
            if (userInput) {
                userInput.value = transcript; // ✅ ONLY the text field gets your words
            }
        };

recognition.onerror = function(event) {
    console.log('🔊 Speech error:', event.error);
    
    if (event.error === 'no-speech') {
        const transcriptText = document.getElementById('transcriptText');
        
        // 🆕 MOBILE: Simple text change approach
        if (isMobileDevice()) {
            console.log('📱 Mobile: Using visual apology');
            
            if (transcriptText) {
                // Store original text and change to apology
                const originalText = transcriptText.textContent;
                transcriptText.textContent = 'Please speak again...';
                
                // Revert after delay and restart listening
                setTimeout(() => {
                    if (transcriptText) {
                        transcriptText.textContent = originalText;
                    }
                    if (isAudioMode && !isListening && !isSpeaking) {
                        startListening();
                    }
                }, 2000);
            }
            
        } else {
            // DESKTOP: Use voice apology (original code)
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
        // ADD YOUR ONEND HANDLER HERE
       recognition.onend = function() {
    console.log('🔚 Recognition ended');
    
    const userInput = document.getElementById('userInput');
    
    // Auto-send if we have text
    if (userInput && userInput.value.trim().length > 0) {
        sendMessage();
    } else {
        // 🆕 ONLY restart if NOT in apology flow
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
        isListening = true; // ← CRITICAL: Set listening flag
        
        // Show live transcript area
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
} // ← THIS CLOSING BRACE WAS MISSING

function stopListening() {
    if (recognition) {
        recognition.stop();
        // 🚫 DO NOT remove handlers - keep them alive for error handling!
    }

    // Update UI
    const micButton = document.getElementById('micButton');
    const liveTranscript = document.getElementById('liveTranscript');
    
    if (micButton) micButton.classList.remove('listening');
    if (liveTranscript) liveTranscript.style.display = 'none';

    isListening = false;
}

function restartListening() {
    if (isAudioMode && !isListening) {
        setTimeout(() => {
            try {
                if (recognition) {
                    startListening(); // This already sets isListening = true internally!
                    console.log('🔄 Listening restarted');
                    
                    // Keep UI in listening state
                    const micButton = document.getElementById('micButton');
                    const liveTranscript = document.getElementById('liveTranscript');
                    if (micButton) micButton.classList.add('listening');
                    if (liveTranscript) liveTranscript.style.display = 'flex';
                }
            } catch (error) {
                console.log('Restart error:', error);
            }
        }, 1000);
    }
}

// ===================================================
// 🎯 CLEAN ACTIVATION SYSTEM - NO STOP BUTTON
// ===================================================
document.getElementById('mainMicButton').addEventListener('click', async function() {
     playIntroJingle();
    // Hide center activation
    document.getElementById('centerMicActivation').style.display = 'none';
    
    // Activate microphone - pure and simple
    await activateMicrophone();
    
    // Just update the original button text (no stop functionality)
    const originalMicButton = document.getElementById('micButton');
    if (originalMicButton) {
        // Keep original mic button functionality intact
    }
});

// ===================================================
// 🎤 MICROPHONE ACTIVATION SYSTEM - COMPLETE & FIXED
// ===================================================
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    // Check basic requirements
    if (!window.isSecureContext) {
        addAIMessage("Microphone access requires HTTPS. Please ensure you're on a secure connection.");
        return;
    }

    try {
        // Use mobile-assist2 method for permission
        const permissionGranted = await requestMicrophoneAccess();
        
        if (permissionGranted) {
            micPermissionGranted = true;
            isAudioMode = true;

            // Update UI - ADD BUTTON TEXT CHANGE
            const micButton = document.getElementById('micButton');
            if (micButton) {
                micButton.classList.add('listening');
            }
            
            // Initialize speech recognition
            initializeSpeechRecognition();

            // AI greeting - UPDATED MESSAGE
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
// 💭 MESSAGE HANDLING SYSTEM (FROM voice-chat.html)
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
// 💬 TEXT INPUT SYSTEM (FROM mobile-assist2)
// ===================================================
function sendMessage() {
    const userInput = document.getElementById('userInput');
    if (!userInput) return;
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Hide live transcript area when sending
    const liveTranscript = document.getElementById('liveTranscript');
    if (liveTranscript) {
        liveTranscript.style.display = 'none';
    }
    
    addUserMessage(message);
    userInput.value = '';
    
    // Process the message
    processUserResponse(message);
}

function processUserResponse(userText) {
    userResponseCount++;
    
    // Stop listening while AI responds
    stopListening();
    
    // Add AI response
    setTimeout(() => {
        const responseText = getAIResponse(userText);
        lastAIResponse = responseText;

              // 🔍 DEBUG: Add this line to see what's happening
        console.log('🎯 USER SAID:', userText);
        console.log('🎯 AI RESPONSE:', responseText);
        
        addAIMessage(responseText);
        speakResponse(responseText);
        
        // Update smart button (FROM voice-chat.html)
        updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
    }, 800);
}

// ===================================================
// 🎯 CREATE ELEGANT ACTION BUTTONS (REPLACES STOP BUTTON)
// ===================================================
function createElegantActionButtons() {
    const quickButtonsContainer = document.querySelector('.quick-buttons') || 
                                 document.querySelector('[class*="quick"]');
    
    if (quickButtonsContainer) {
        // Create button container
        const actionContainer = document.createElement('div');
        actionContainer.style = `
            display: flex;
            gap: 10px;
            margin-top: 15px;
            width: 100%;
        `;
        
        // TEXT ONLY BUTTON
        const textOnlyBtn = document.createElement('button');
        textOnlyBtn.innerHTML = '📝 Switch to Text';
        textOnlyBtn.style = `
            flex: 1;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 12px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            backdrop-filter: blur(10px);
            font-size: 14px;
        `;
        
        // EXIT BUTTON
        const exitBtn = document.createElement('button');
        exitBtn.innerHTML = '🎁 Free Book';
        exitBtn.style = `
            flex: 1;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 12px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            backdrop-filter: blur(10px);
            font-size: 14px;
        `;
        
        // CLICK HANDLERS
        textOnlyBtn.onclick = () => switchToTextMode();
        exitBtn.onclick = () => showFreeBookOffer();
        
        // ADD TO CONTAINER
        actionContainer.appendChild(textOnlyBtn);
        actionContainer.appendChild(exitBtn);
        
        // INSERT AFTER QUICK BUTTONS
        quickButtonsContainer.parentNode.insertBefore(actionContainer, quickButtonsContainer.nextSibling);
    }
}

// ===================================================
// 🎁 FREE BOOK OFFER FUNCTION
// ===================================================
function showFreeBookOffer() {
    // Create overlay with form
    const offerOverlay = document.createElement('div');
    offerOverlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.8); z-index: 9999; 
                    display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 15px; 
                        max-width: 400px; text-align: center;">
                <h2>🎁 FREE CPA Practice Guide!</h2>
                <p>Get Bruce's exclusive guide to maximizing your practice value!</p>
                <input type="email" placeholder="Enter your email" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
                <br>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #00ff88; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 5px;">
                    Get My Free Guide!
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #ccc; color: black; padding: 10px 20px; border: none; border-radius: 5px; margin: 5px;">
                    Maybe Later
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(offerOverlay);
}

// ===================================================
// 🔊 VOICE SYNTHESIS SYSTEM (MOBILE-OPTIMIZED)
// ===================================================
function speakResponse(message) {
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Mobile-optimized handling
    if (isMobileDevice()) {
        // 🆕 MOBILE: Extra delay and complete audio reset
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(message);
            
            // Mobile-optimized settings
            utterance.rate = 0.9; // Slower for mobile clarity
            utterance.pitch = 1.0;
            utterance.volume = 0.95; // Slightly louder for mobile
            
            utterance.onstart = function() {
                isSpeaking = true;
                console.log('🔊 AI started speaking (mobile)');

                 // 🆕 Ensure mic UI is reset on mobile while speaking
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
                
                // Start listening after speaking ends (if in audio mode)
                if (isAudioMode && !isListening && !lastMessageWasApology) {
                    setTimeout(() => {
                        startListening();
                    }, 1200); // Longer delay for mobile
                }
            };
            
            utterance.onerror = function(event) {
                console.log('❌ Speech error:', event.error);
                isSpeaking = false;
            };
            
            window.speechSynthesis.speak(utterance);
            currentAudio = utterance;
        }, 500); // Longer initial delay for mobile
    } else {
        // DESKTOP VERSION (original code)
        const utterance = new SpeechSynthesisUtterance(message);
        
        // Desktop settings
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
            
            // Start listening after speaking ends (if in audio mode)
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

// ===================================================
// 🧠 AI RESPONSE SYSTEM WITH CELEBRATION INTEGRATION
// ===================================================
function getAIResponse(userInput) {
    const userText = userInput.toLowerCase();
    let responseText = '';
    
    if (conversationState === 'initial') {
        // 🏢 BUYING FIRST (most specific keywords)
        if (userText.includes('buy') || userText.includes('purchase') || userText.includes('buying') || userText.includes('acquire')) {
            responseText = "Excellent! Bruce has some fantastic opportunities available. Let me learn more about what you're looking for. What's your budget range for acquiring a practice?";
            conversationState = 'buying_budget_question';
            shouldShowSmartButton = false;
            
        // 💰 SELLING SECOND (removed "practice" keyword)
        } else if (userText.includes('sell') || userText.includes('selling')) {
            responseText = "I'd love to help you with selling your practice! Let me ask you a few quick questions to better understand your situation. How large is your practice - how many clients do you currently serve?";
            conversationState = 'selling_size_question';
            shouldShowSmartButton = false;
            
        // 📊 VALUATION THIRD
        } else if (userText.includes('value') || userText.includes('worth') || userText.includes('valuation') || userText.includes('evaluate')) {
            responseText = "I'd be happy to help with a practice valuation! To give you the most accurate assessment, what's your practice's approximate annual revenue?";
            conversationState = 'valuation_revenue_question';
            shouldShowSmartButton = false;
            
        } else {
            responseText = "Welcome! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. What brings you here today?";
        }
        
    // ===================================================
    // 💰 SELLING PRACTICE FLOW
    // ===================================================
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
        
    // ===================================================
    // 🏢 BUYING PRACTICE FLOW  
    // ===================================================
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
        
    // ===================================================
    // 📊 VALUATION FLOW
    // ===================================================
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
        
    // ===================================================
    // 🎯 BUTTON ACTIVATED STATES
    // ===================================================
    } else if (conversationState === 'button_activated_selling' || conversationState === 'button_activated_buying' || conversationState === 'button_activated_valuation') {
        responseText = "Perfect! I see you're ready to connect with Bruce. Just click that button above and we'll get everything set up for you right away!";
        
    } else {
        // Fallback
        responseText = "Thanks for your message! Is there anything else about buying, selling, or valuing a CPA practice that I can help you with?";
        conversationState = 'initial';
        shouldShowSmartButton = false;
    }
    
    return responseText;
}

function handleSmartButtonClick(buttonType) {
    console.log(`Smart button clicked: ${buttonType}`);
    
    // IMMEDIATELY stop speech recognition
    if (recognition) {
        try {
            recognition.stop();
            isListening = false;
            
            // Update mic button visual
            const micButton = document.querySelector('.mic-button');
            if (micButton) {
                micButton.innerHTML = '📋'; // Form mode
                micButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
            }
            
            console.log('Speech stopped for lead capture');
        } catch (error) {
            console.log('Speech already stopped');
        }
    }
    
    // Start lead capture
    initializeLeadCapture(buttonType);
}

// COMPLETELY SEPARATE LEAD CAPTURE SYSTEM
function initializeLeadCapture(buttonType) {
    // Only activate when specifically called
    if (isInLeadCapture) return; // Prevent double activation
    
    // Create isolated lead capture object
    leadData = {
        name: '', phone: '', email: '', contactTime: '', 
        inquiryType: currentState,
        transcript: conversationHistory.map(msg => `${msg.type}: ${msg.text}`).join('\n'),
        step: 0,
        questions: [
            "What's your name?",
            "What's the best phone number to reach you?", 
            "What's your email address?",
            "When would be the best time for our specialist to contact you?"
        ]
    };
    
    isInLeadCapture = true;
    
    // Add transition message
    addMessage(`Excellent! Now I need to collect a few quick details to get you connected with Bruce.`, 'ai');
    
    // Start lead questions after delay
    setTimeout(() => {
        askLeadQuestion();
    }, 1500);
}

function askLeadQuestion() {
    if (!isInLeadCapture || !leadData) return;
    
    if (leadData.step < leadData.questions.length) {
        addMessage(leadData.questions[leadData.step], 'ai');
        createLeadInput();
    } else {
        completeLeadCollection();
    }
}

function createLeadInput() {
    // Remove existing input
    const existing = document.querySelector('.lead-input-container');
    if (existing) existing.remove();
    
    const container = document.createElement('div');
    container.className = 'lead-input-container';
    container.innerHTML = `
        <div style="padding: 15px; background: rgba(255,255,255,0.1); border-radius: 15px; margin: 10px 0;">
            <input type="text" id="leadResponseInput" placeholder="Type here..." 
                   style="width: 100%; padding: 12px; border: none; border-radius: 8px; 
                          background: white; font-size: 16px; margin-bottom: 10px;">
            <button onclick="submitLeadAnswer()" 
                    style="width: 100%; padding: 12px; background: #667eea; color: white; 
                           border: none; border-radius: 8px; cursor: pointer;">Submit</button>
        </div>
    `;
    
    document.getElementById('messages').appendChild(container);
}

function submitLeadAnswer() {
    const input = document.getElementById('leadResponseInput');
    const answer = input.value.trim();
    
    if (!answer) return;
    
    // Store answer
    switch(leadData.step) {
        case 0: leadData.name = answer; break;
        case 1: leadData.phone = answer; break;
        case 2: leadData.email = answer; break;
        case 3: leadData.contactTime = answer; break;
    }
    
    // Show user response
    addMessage(answer, 'user');
    
    // Remove input
    document.querySelector('.lead-input-container').remove();
    
    // Next question
    leadData.step++;
    setTimeout(askLeadQuestion, 1000);
}

function completeLeadCollection() {
    addMessage(`Perfect ${leadData.name}! Our specialist will contact you at ${leadData.phone} during your preferred ${leadData.contactTime} time.`, 'ai');
    
    console.log('Lead Captured:', leadData);
    
    // Reset system
    setTimeout(() => {
        isInLeadCapture = false;
        leadData = null;
        addMessage("Anything else I can help you with?", 'ai');
    }, 3000);
}


// ===================================================
// 🎉 THANK YOU BANNER FUNCTION
// ===================================================
function showThankYouBanner() {
    const thankYouBanner = document.createElement('div');
    thankYouBanner.innerHTML = `
        <div style="text-align: center; padding: 15px; margin: 10px;
                    background: linear-gradient(45deg, #00ff88, #00ccff);
                    border-radius: 15px; color: white; font-weight: bold;
                    box-shadow: 0 4px 15px rgba(0,255,136,0.3);
                    animation: slideIn 0.5s ease-out;">
            🎉 Thank You for Visiting! Bruce Will Be In Touch Soon! 🎉
        </div>
    `;
    
    // Add to top of chat
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.insertBefore(thankYouBanner, chatContainer.firstChild);
    }
}

// ===================================================
// 🛑 STOP LISTENING PROCESS
// ===================================================
function stopListeningProcess() {
    // Stop speech recognition
    if (window.recognition) {
        window.recognition.stop();
        window.recognition.abort();
    }
    
    // Stop any listening indicators
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.classList.remove('listening');
    }
    
    // Set flags to prevent restart
    isAudioMode = false;
    conversationState = 'ended';
}

// ===================================================
// 🔵 SMART BUTTON SYSTEM (FROM voice-chat.html)
// ===================================================
function updateSmartButton(show, text, action) {
    const smartButton = document.getElementById('smartButton');
    if (!smartButton) return;
    
    if (show) {
        smartButton.textContent = text;
        smartButton.style.display = 'block';
        smartButton.onclick = () => handleSmartButtonClick(action);
        
        // 🚀 PHASE 1: STOP SPEECH LOOP WHEN BUTTON APPEARS
        console.log('🎯 Button activated - pausing speech recognition');
        stopListening();
        isAudioMode = false; // Prevent auto-restart
        
        // Hide live transcript area
        const liveTranscript = document.getElementById('liveTranscript');
        if (liveTranscript) {
            liveTranscript.style.display = 'none';
        }
        
        // Update transcript text to show paused state
        const transcriptText = document.getElementById('transcriptText');
        if (transcriptText) {
            transcriptText.textContent = 'Click button above to continue';
            transcriptText.style.color = '#FFA500'; // Orange color to show paused
        }
        
    } else {
        smartButton.style.display = 'none';
    }
}

// ===================================================
// 🎯 SMART BUTTON CLICK HANDLER - PHASE 1
// ===================================================
function handleSmartButtonClick(action) {
    console.log('🚀 Smart button clicked, action:', action);
    
    // Hide the current button
    const smartButton = document.getElementById('smartButton');
    if (smartButton) {
        smartButton.style.display = 'none';
    }
    
    // Add system message
    addAIMessage("Excellent! Now I need to collect a few quick details to get you connected with Bruce. What's your first name?");
    
    // Start the information collection flow
    conversationState = 'collecting_name';
    
    // Re-enable speech recognition for info collection
    setTimeout(() => {
        isAudioMode = true;
        startListening();
    }, 1000);
}

function simulateUserMessage(message) {
    console.log('Simulating user message:', message);
    
    addUserMessage(message);
    
    // Process the message
    processUserResponse(message);
}

// ===================================================
// 🔘 QUICK QUESTIONS SYSTEM (FROM voice-chat.html)
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
        
        // Update smart button
        updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
    }, 800);
}

// ===================================================
// 📝 TEXT MODE SWITCHER
// ===================================================
function switchToTextMode() {
    console.log('🔄 Switching to text mode');
    
    // Stop any ongoing audio
    stopCurrentAudio();
    
    // Stop listening if active
    stopListening();
    
    // Close microphone stream if open
    if (persistentMicStream) {
        persistentMicStream.getTracks().forEach(track => track.stop());
        persistentMicStream = null;
    }
    
    // Update mode flag
    isAudioMode = false;
    micPermissionGranted = false;
    
    // Update UI
    const micButton = document.getElementById('micButton');
    const liveTranscript = document.getElementById('liveTranscript');
    
    if (micButton) micButton.classList.remove('listening');
    if (liveTranscript) liveTranscript.style.display = 'none';
    
    // Add message about switching to text mode
    addAIMessage("Switched to text mode. Type your message in the text box below.");
    
    console.log('✅ Switched to text mode successfully');
}

// ===================================================
// 🎨 THEME SWITCHER (FOR CLIENT CUSTOMIZATION)
// ===================================================
function setClientTheme(themeName) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('law-firm-theme', 'medical-theme', 'financial-theme');
    
    // Add new theme class
    if (themeName && themeName !== 'default') {
        body.classList.add(themeName + '-theme');
    }
    
    console.log('🎨 Theme switched to:', themeName);
}

// ===================================================
// 📱 MOBILE OPTIMIZATIONS
// ===================================================
function optimizeForMobile() {
    if (isMobileDevice()) {
        console.log('📱 Applying mobile optimizations');
        
        // Add mobile-specific CSS
        const style = document.createElement('style');
        style.textContent = `
            .mic-btn, .smart-button, .quick-btn {
                min-height: 44px;
                min-width: 44px;
            }
            .message {
                font-size: 16px;
            }
            input {
                font-size: 16px; /* Prevents zoom on iOS */
            }
        `;
        document.head.appendChild(style);
    }
}

// ===================================================
// 🚀 INITIALIZATION SYSTEM
// ===================================================
function initializeChatInterface() {
    // Clear loading message
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    // Add welcome message
    // addAIMessage("Welcome to Voice Chat! Please allow microphone access to use voice features.");
    
    // Set up event listeners
    const micButton = document.getElementById('micButton');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const smartButton = document.getElementById('smartButton');
    
    if (micButton) {
        micButton.addEventListener('click', function() {
            if (!isAudioMode) {
                activateMicrophone();
            } else if (!isListening) {
                startListening();
            } else {
                stopListening();
            }
        });
    }
    
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
    
    if (smartButton) {
        smartButton.addEventListener('click', handleSmartButtonClick);
    }
    
    console.log('✅ Chat interface initialized');
}

// ===================================================
// 🌍 GLOBAL FUNCTIONS (FOR ONCLICK ATTRIBUTES)
// ===================================================
window.askQuickQuestion = askQuickQuestion;
window.handleSmartButtonClick = handleSmartButtonClick;
window.setClientTheme = setClientTheme;

// ===================================================
// 🚀 INITIALIZE THE APPLICATION
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Mobile-Wise AI Formviser...');
    
    optimizeForMobile();
    initializeChatInterface();
    createElegantActionButtons();
    
    // 🎯 CLEAN PAGE LOAD - NO BUBBLES
    const micButton = document.getElementById('micButton');
    if (micButton) {

    }
    
    // Clear any auto-bubbles
    const chatContainer = document.querySelector('.chat-messages') || document.querySelector('#chatContainer');
    if (chatContainer) {
        chatContainer.innerHTML = '';
    }
    
    // 🚫 REMOVE AUTO-ACTIVATE - USER MUST CLICK FIRST
    // setTimeout(() => {
    //     activateMicrophone();
    // }, 1000);
});

/* ===================================================
   🌟 GLASS SMART BAR FUNCTIONALITY
   ================================================== */

// Module activation handler
function activateModule(moduleType) {
    console.log(`🚀 Activating module: ${moduleType}`);
    
    switch(moduleType) {
        case 'voice-chat':
            // Already in voice chat - maybe restart or focus
            if (!isListening) {
                toggleListening();
            }
            addMessage('ai', 'Voice chat is ready! How can I assist you today?');
            break;
            
        case 'ai-interview':
            addMessage('ai', 'AI Interview module coming soon! For now, I can help you with practice valuations and consultations.');
            showSmartButton('🎬 Schedule AI Interview', 'Great! I\'d like to schedule an AI interview to capture your success story.');
            break;
            
        case 'schedule-call':
            addMessage('ai', 'I\'d be happy to help you schedule a call with Bruce! What\'s the best phone number to reach you?');
            currentConversationFlow = 'schedule-call';
            break;
            
        case 'offers':
            addMessage('ai', 'Let me show you our current offers and opportunities!');
            showSmartButton('🎁 View Special Offers', 'I\'d like to learn about your current offers and opportunities.');
            break;
            
        default:
            console.log('Unknown module:', moduleType);
    }
    
    // Scroll to show new message
    scrollToBottom();
}

// Optional: Auto-hide smart bar during active conversation
function toggleSmartBarVisibility(show = true) {
    const smartBar = document.getElementById('glassSmartBar');
    if (smartBar) {
        if (show) {
            smartBar.classList.remove('hidden');
        } else {
            smartBar.classList.add('hidden');
        }
    }
}

// Optional: Highlight active module
function highlightActiveModule(moduleType) {
    // Remove all active states
    document.querySelectorAll('.smart-bar-btn').forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    // Add active state to current module
    const activeBtn = document.querySelector(`[onclick="activateModule('${moduleType}')"]`);
    if (activeBtn) {
        activeBtn.style.background = 'rgba(255, 255, 255, 0.4)';
    }
}

// Initialize smart bar on page load
document.addEventListener('DOMContentLoaded', function() {
    // Highlight voice chat as default active module
    highlightActiveModule('voice-chat');
    
    console.log('🌟 Glass Smart Bar initialized');
});
