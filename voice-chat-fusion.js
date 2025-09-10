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

function startListening() {
    console.log('🎯 startListening() called');
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;

    try {
        if (!recognition) {
            initializeSpeechRecognition();
        }

        // MOBILE-OPTIMIZED RESULT HANDLER (FROM mobile-assist2)
        recognition.onresult = function(event) {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            // Show live transcript in the designated area
            const transcriptText = document.getElementById('transcriptText');
            const userInput = document.getElementById('userInput');
            
            if (transcriptText) {
                transcriptText.textContent = transcript || 'Listening...';
            }
            
            if (userInput) {
                userInput.value = transcript;
            }
        };

        // MOBILE-OPTIMIZED END HANDLER (FROM mobile-assist2) 
        recognition.onend = function() {
            console.log('🔚 Recognition ended');
            
            const userInput = document.getElementById('userInput');
            
            // Auto-send if we have text (MOBILE-ASSIST2 METHOD)
            if (userInput && userInput.value.trim().length > 0) {
                sendMessage();
            }
            
            // Reset listening state
            stopListening();
        };

        recognition.onerror = function(event) {
            console.error('❌ Speech recognition error:', event.error);
            stopListening();
            
            let errorMessage = "Sorry, there was an error with speech recognition: " + event.error;
            if (event.error === 'no-speech') {
                errorMessage = "No speech detected. Please try speaking again.";
            }
            addAIMessage(errorMessage);
        };

        console.log('🎤 Starting speech recognition...');
        recognition.start();
        isListening = true;
        
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
}

function stopListening() {
    if (recognition) {
        recognition.stop();
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
    }

    // Update UI
    const micButton = document.getElementById('micButton');
    const liveTranscript = document.getElementById('liveTranscript');
    
    if (micButton) micButton.classList.remove('listening');
    if (liveTranscript) liveTranscript.style.display = 'none';

    isListening = false;
}

// ===================================================
// 🎤 MICROPHONE ACTIVATION SYSTEM - FIXED
// ===================================================
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
                micButton.textContent = 'Microphone activated'; // ADD THIS LINE
            }
            
            // Initialize speech recognition
            initializeSpeechRecognition();

            // AI greeting - UPDATED MESSAGE
            setTimeout(() => {
                const greeting = "Hi! I'm Bruce's assistant. How can I help you?";
                addAIMessage(greeting);
                speakResponse(greeting);
            }, 100);

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
        
        addAIMessage(responseText);
        speakResponse(responseText);
        
        // Update smart button (FROM voice-chat.html)
        updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
    }, 800);
}

// ===================================================
// 🔊 VOICE SYNTHESIS SYSTEM (FROM voice-chat.html)
// ===================================================
function speakResponse(message) {
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Add slight delay for mobile to prevent clipping
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(message);
        
        // Mobile-optimized settings
        utterance.rate = isMobileDevice() ? 0.9 : 1.0;
        utterance.pitch = 1.0;
        utterance.volume = isMobileDevice() ? 0.95 : 0.9;
        
        utterance.onstart = function() {
            isSpeaking = true;
            console.log('🔊 AI started speaking');
        };
        
        utterance.onend = function() {
            isSpeaking = false;
            console.log('🔊 AI finished speaking');
            
            // Start listening after speaking ends (if in audio mode)
            if (isAudioMode && !isListening) {
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
    }, isMobileDevice() ? 300 : 0);
}

function stopCurrentAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    currentAudio = null;
    isSpeaking = false;
}

// ===================================================
// 🧠 AI RESPONSE SYSTEM WITH CELEBRATION INTEGRATION
// ===================================================
function getAIResponse(userInput) {
    const userText = userInput.toLowerCase();
    let responseText = '';
    
    if (conversationState === 'initial') {
        if (userText.includes('sell') || userText.includes('practice') || userText.includes('selling')) {
            responseText = "EXCELLENT timing for selling your accounting practice! The market is very strong right now. Should Bruce call you today or tomorrow for your FREE practice valuation?";
            conversationState = 'selling_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Free Valuation';
            smartButtonAction = 'valuation';
        } else if (userText.includes('buy') || userText.includes('purchase') || userText.includes('buying') || userText.includes('acquire')) {
            responseText = "Looking to BUY a CPA firm? Perfect! Bruce has exclusive off-market opportunities available RIGHT NOW. Should Bruce show you available practices today or tomorrow?";
            conversationState = 'buying_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'View Available Practices';
            smartButtonAction = 'buying';
        } else if (userText.includes('value') || userText.includes('worth') || userText.includes('valuation') || userText.includes('evaluate')) {
            responseText = "Your accounting practice could be worth MORE than you think! Bruce offers a FREE consultation to evaluate your practice. Are you interested in a valuation today?";
            conversationState = 'valuation_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'Get Practice Valuation';
            smartButtonAction = 'valuation';
        } else {
            responseText = "I specialize in CPA firm transactions - buying, selling, and valuations. What specifically are you interested in learning more about?";
        }
    } else if (conversationState === 'selling_inquiry') {
        if (userText.includes('today') || userText.includes('now') || userText.includes('asap') || 
            userText.includes('immediately') || userText.includes('this afternoon') || 
            (userText.includes('yes') && !userText.includes('tomorrow'))) {
            responseText = "Great! Bruce will call you today. What's the best phone number to reach you, and what time works best?";
            conversationState = 'contact_today';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Today';
            smartButtonAction = 'schedule_today';
        } else if (userText.includes('tomorrow') || userText.includes('next day') || 
                   userText.includes('morning') || userText.includes('later')) {
            responseText = "Perfect! Bruce will call you tomorrow. What's the best phone number to reach you, and what time works best?";
            conversationState = 'contact_tomorrow';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Tomorrow';
            smartButtonAction = 'schedule_tomorrow';
        } else if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || 
                   userText.includes('schedule') || userText.includes('free') || userText.includes('consultation') ||
                   userText.includes('call') || userText.includes('contact') || userText.includes('talk')) {
            responseText = "Excellent! Should Bruce call you today or tomorrow for your FREE practice valuation?";
            conversationState = 'selling_inquiry';
        } else {
            responseText = "I didn't quite catch that. Should Bruce call you today or tomorrow for your FREE practice valuation?";
        }
    } else if (conversationState === 'buying_inquiry') {
        if (userText.includes('today') || userText.includes('now') || userText.includes('asap') || 
            userText.includes('immediately') || userText.includes('this afternoon') ||
            (userText.includes('yes') && !userText.includes('tomorrow'))) {
            responseText = "Excellent! Bruce will contact you today to discuss available practices. What's the best phone number to reach you?";
            conversationState = 'contact_today';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect Today';
            smartButtonAction = 'contact_today';
        } else if (userText.includes('tomorrow') || userText.includes('next day') || 
                   userText.includes('morning') || userText.includes('later')) {
            responseText = "Great! Bruce will contact you tomorrow to discuss available practices. What's the best phone number to reach you?";
            conversationState = 'contact_tomorrow';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect Tomorrow';
            smartButtonAction = 'contact_tomorrow';
        } else if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || 
                   userText.includes('show') || userText.includes('available') || userText.includes('practices') ||
                   userText.includes('view') || userText.includes('see') || userText.includes('interested')) {
            responseText = "Perfect! Should Bruce contact you today or tomorrow about available practices?";
            conversationState = 'buying_inquiry';
        } else {
            responseText = "I didn't quite catch that. Should Bruce contact you today or tomorrow about available practices?";
        }
    } else if (conversationState === 'valuation_inquiry') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('interested') || 
            userText.includes('okay') || userText.includes('please') || userText.includes('free') ||
            userText.includes('consultation') || userText.includes('valuation') || userText.includes('evaluate')) {
            responseText = "Great! Bruce will contact you to set up your FREE valuation. What's the best phone number to reach you, and should he call today or tomorrow?";
            conversationState = 'contact_valuation';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect with Bruce';
            smartButtonAction = 'connect_bruce';
        } else if (userText.includes('no') || userText.includes('not') || userText.includes('maybe')) {
            responseText = "No problem! Is there anything else I can help you with regarding your CPA practice?";
            conversationState = 'initial';
        } else {
            responseText = "I want to make sure I understand - are you interested in a FREE practice valuation?";
            conversationState = 'valuation_inquiry';
        }
    } else if (conversationState === 'contact_today' || conversationState === 'contact_tomorrow' || conversationState === 'contact_valuation') {
        const phoneMatch = userText.match(/\b(\d{3}[-.]?\d{3}[-.]?\d{4})\b/);
        if (phoneMatch) {
            responseText = "Perfect! Bruce will call you at " + phoneMatch[0] + ". Thank you for choosing our services!";
            conversationState = 'completed';
            shouldShowSmartButton = false;
            
            // 🎉 TRIGGER VICTORY SEQUENCE AFTER AI SPEAKS
            setTimeout(() => {
                triggerConversionComplete();
            }, 3000); // Give time for AI to finish speaking
            
        } else if (userText.includes('phone') || userText.includes('number') || userText.includes('call') ||
                   userText.includes('contact') || userText.includes('reach')) {
            responseText = "Great! What's the best phone number for Bruce to reach you? Please say the 10-digit number clearly.";
        } else {
            responseText = "Thanks! What's the best phone number for Bruce to reach you?";
        }
    } else if (conversationState === 'completed') {
        responseText = "Thank you! Bruce will be in touch soon. Have a great day!";
        shouldShowSmartButton = false;
    } else {
        responseText = "Thanks for your message. Is there anything else I can help you with regarding your CPA practice?";
        conversationState = 'initial';
        shouldShowSmartButton = false;
    }

    return responseText;
}

// 🎉 CELEBRATION FUNCTION (ADD THIS TO YOUR SCRIPT)
function triggerConversionComplete() {
    // Create celebration overlay
    const celebrationOverlay = document.createElement('div');
    celebrationOverlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4); 
                    z-index: 9999; display: flex; align-items: center; justify-content: center;
                    animation: fadeIn 0.5s ease-in;">
            <div style="text-align: center; color: white; font-size: 2em; font-weight: bold;">
                🎉 CONVERSION COMPLETE! 🎉<br>
                <div style="font-size: 1.2em; margin-top: 20px;">Lead Captured Successfully!</div>
            </div>
        </div>
    `;
    document.body.appendChild(celebrationOverlay);
    
    // Remove after 3 seconds
    setTimeout(() => {
        celebrationOverlay.remove();
    }, 3000);
}


// ===================================================
// 🔵 SMART BUTTON SYSTEM (FROM voice-chat.html)
// ===================================================
function updateSmartButton(shouldShow, buttonText, actionType) {
    const smartButton = document.getElementById('smartButton');
    
    if (!smartButton) return;
    
    if (shouldShow) {
        smartButton.style.display = 'block';
        smartButton.textContent = buttonText;
        smartButton.setAttribute('data-action', actionType);
    } else {
        smartButton.style.display = 'none';
        smartButton.textContent = 'AI Smart Button';
        smartButton.removeAttribute('data-action');
    }
}

function handleSmartButtonClick() {
    const smartButton = document.getElementById('smartButton');
    const actionType = smartButton ? smartButton.getAttribute('data-action') : 'default';
    
    console.log('Smart button clicked, action:', actionType);
    
    switch(actionType) {
        case 'valuation':
            simulateUserMessage("Yes, I'm interested in a valuation");
            break;
            
        case 'buying':
            simulateUserMessage("Yes, show me available practices");
            break;
            
        case 'schedule_today':
            simulateUserMessage("Today works for me");
            break;
            
        case 'schedule_tomorrow':
            simulateUserMessage("Tomorrow works better");
            break;
            
        case 'contact_today':
            simulateUserMessage("Today works for me");
            break;
            
        case 'contact_tomorrow':
            simulateUserMessage("Tomorrow works better");
            break;
            
        case 'connect_bruce':
            simulateUserMessage("I'd like to connect with Bruce");
            break;
            
        default:
            console.log('Smart button clicked - no specific action defined');
            simulateUserMessage("I need help with my practice");
    }
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
    
    // 🎯 CLEAN PAGE LOAD - NO BUBBLES
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.textContent = 'Please click mic access below';
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

