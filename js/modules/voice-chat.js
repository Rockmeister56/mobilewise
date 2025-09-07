// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATED SYSTEM
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
let currentUserBubble = null;
let micPermissionGranted = false;
let isCreatingBubble = false;
let responseText = '';
let shouldShowSmartButton = false;
let smartButtonText = 'AI Smart Button';
let smartButtonAction = 'default';

// Conversation state tracking
let conversationState = 'initial';
let lastAIResponse = '';
let userResponseCount = 0;
let voiceSpeed = 1.0;
let isProcessingInput = false;

// ===================================================
// 🎤 SPEECH RECOGNITION SYSTEM
// ===================================================
function checkSpeechSupport() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('❌ Speech recognition not supported in this browser');
        return false;
    }
    return true;
}

function startListening() {
    console.log('🎯 startListening() called - starting speech recognition');
    
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;

    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        createRealtimeBubble();
        isListening = true;

        // Update UI
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const statusInfo = document.getElementById('statusInfo');
        
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'block';
        if (statusInfo) statusInfo.innerHTML = '🎤 Listening... Speak now!';

        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            const currentBubble = document.getElementById('currentUserBubble');
            if (currentBubble) {
                const displayText = finalTranscript + interimTranscript;
                if (displayText.trim()) {
                    const bubbleElement = currentBubble.querySelector('.message-bubble') || 
                                       currentBubble.querySelector('.bubble-text') || 
                                       currentBubble;
                    
                    bubbleElement.textContent = displayText;

                    if (interimTranscript) {
                        currentBubble.classList.add('typing');
                    } else {
                        currentBubble.classList.remove('typing');
                    }

                    scrollToBottom();
                }
            }

            if (finalTranscript) {
                setTimeout(() => {
                    processUserResponse(finalTranscript);
                }, 1500);
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            const statusInfo = document.getElementById('statusInfo');
            if (statusInfo) statusInfo.innerHTML = `❌ Error: ${event.error}`;
            stopListening();
        };

        recognition.onend = function() {
            console.log("Recognition ended");
        };

        recognition.start();
        console.log('🎤 Speech recognition started successfully');

    } catch (error) {
        console.error('Error starting speech recognition:', error);
        const statusInfo = document.getElementById('statusInfo');
        if (statusInfo) statusInfo.innerHTML = '❌ Failed to start speech recognition';
    }
}

function stopListening() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }

    const currentBubble = document.getElementById('currentUserBubble');
    if (currentBubble) {
        currentBubble.classList.remove('typing');
        currentBubble.removeAttribute('id');
    }

    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (startBtn) startBtn.style.display = 'block';
    if (stopBtn) stopBtn.style.display = 'none';

    isListening = false;
    console.log('🛑 Listening stopped');
}

function createRealtimeBubble() {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;
    
    const userBubble = document.createElement('div');
    userBubble.className = 'bubble user-bubble typing';
    userBubble.id = 'currentUserBubble';
    
    const bubbleText = document.createElement('div');
    bubbleText.className = 'bubble-text';
    bubbleText.textContent = 'Listening...';
    userBubble.appendChild(bubbleText);
    
    chatArea.appendChild(userBubble);
    scrollToBottom();
}

function processUserResponse(userText) {
    userResponseCount++;
    
    const currentBubble = document.getElementById('currentUserBubble');
    if (currentBubble) {
        currentBubble.classList.remove('typing');
        currentBubble.removeAttribute('id');
    }
    
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    
    isListening = false;
    
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusInfo = document.getElementById('statusInfo');
    
    if (startBtn) startBtn.style.display = 'block';
    if (stopBtn) stopBtn.style.display = 'none';
    if (statusInfo) statusInfo.innerHTML = '🤖 AI is responding...';
    
    setTimeout(() => {
        addAIResponse(userText);
    }, 800);
}

// ===================================================
// 🤖 AI RESPONSE SYSTEM
// ===================================================
function getAIResponse(userInput) {
    const userText = userInput.toLowerCase();
    let responseText = '';
    let shouldShowSmartButton = false;
    let smartButtonText = '';
    let smartButtonAction = '';
    
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
            responseText = "Perfect! Bruce will call you at " + phoneMatch[0] + ". Is there anything else I can help you with today?";
            conversationState = 'completed';
            shouldShowSmartButton = true;
            smartButtonText = 'Start Interview';
            smartButtonAction = 'interview';
        } else if (userText.includes('phone') || userText.includes('number') || userText.includes('call') ||
                   userText.includes('contact') || userText.includes('reach')) {
            responseText = "Great! What's the best phone number for Bruce to reach you? Please say the 10-digit number clearly.";
        } else {
            responseText = "Thanks! What's the best phone number for Bruce to reach you?";
        }
    } else if (conversationState === 'completed') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') ||
            userText.includes('interview') || userText.includes('start') || userText.includes('continue')) {
            responseText = "Excellent! Bruce will be in touch soon, and we'll get your interview process started. Thank you for your interest!";
        } else {
            responseText = "Thank you! Bruce will be in touch soon. Have a great day!";
        }
    } else {
        responseText = "Thanks for your message. Is there anything else I can help you with regarding your CPA practice?";
        conversationState = 'initial';
    }

    updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
    updateConversationInfo();

    return responseText;
}

function addAIResponse(userText) {
    const responseText = getAIResponse(userText);
    lastAIResponse = responseText;
    
    addAIMessage(responseText);
    speakResponse(responseText);
    
    setTimeout(() => {
        const statusInfo = document.getElementById('statusInfo');
        if (statusInfo) statusInfo.innerHTML = '🎯 Returning to listening mode...';
        
        setTimeout(() => {
            if (isAudioMode && !isListening && !isSpeaking) {
                createRealtimeBubble();
                startListening();
            }
        }, 1000);
    }, Math.max(2000, responseText.length * 50));
}

// ===================================================
// 💬 MESSAGE HANDLING
// ===================================================
function addAIMessage(message) {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;
    
    const aiBubble = document.createElement('div');
    aiBubble.className = 'ai-bubble';

    const aiAvatar = document.createElement('img');
    aiAvatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png';
    aiAvatar.className = 'ai-avatar';
    aiBubble.appendChild(aiAvatar);

    const bubbleContent = document.createElement('div');
    bubbleContent.textContent = message;
    aiBubble.appendChild(bubbleContent);
    
    chatArea.appendChild(aiBubble);
    scrollToBottom();
}

function scrollToBottom() {
    const chatArea = document.getElementById('chatArea');
    if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

// ===================================================
// 🎤 VOICE SYSTEM
// ===================================================
function speakResponse(message) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = () => { isSpeaking = true; };
    utterance.onend = () => { isSpeaking = false; };
    utterance.onerror = () => { isSpeaking = false; };
    
    window.speechSynthesis.speak(utterance);
}

// ===================================================
// 🔧 UTILITY FUNCTIONS
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
    }
}

function updateConversationInfo() {
    const stateElement = document.getElementById('conversationState');
    const responseElement = document.getElementById('lastResponse');
    
    if (stateElement) stateElement.textContent = conversationState;
    if (responseElement) {
        responseElement.textContent = lastAIResponse.substring(0, 50) + (lastAIResponse.length > 50 ? '...' : '');
    }
}

// ===================================================
// 🚀 INITIALIZATION
// ===================================================
async function activateMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        persistentMicStream = stream;
        micPermissionGranted = true;
        isAudioMode = true;
        
        const greeting = "Welcome! I'm Bruce Clark's AI assistant. What can I help you with today?";
        addAIMessage(greeting);
        
        setTimeout(() => {
            if (!isListening) {
                createRealtimeBubble();
                startListening();
            }
        }, 1000);
        
    } catch (error) {
        console.log('Microphone access denied:', error);
        addAIMessage("Microphone access was denied. You can still use text chat.");
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Mobile-Wise AI Voice Chat - SYSTEM LOADED!');
});
