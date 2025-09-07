// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATED SYSTEM
// Combining working bubble system + your business logic
// ===================================================

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
                    const bubbleElement = currentBubble.querySelector('.message-bubble');
                    if (bubbleElement) {
                        bubbleElement.textContent = displayText;
                    }
                    scrollChatToBottom();
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
            stopListening();
        };

        recognition.onend = function() {
            console.log("Recognition ended");
        };

        recognition.start();
        console.log('🎤 Speech recognition started successfully');

    } catch (error) {
        console.error('Error starting speech recognition:', error);
    }
}

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


// Conversation state tracking (from working bubble system)
let conversationState = 'initial';
let lastAIResponse = '';
let userResponseCount = 0;

// Voice settings
let voiceSpeed = 1.0;

// Processing flags
let isProcessingInput = false;

// ===================================================
// 🎤 MICROPHONE PERMISSION SYSTEM
// ===================================================
async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('✅ Microphone permission granted');
        return true;
    } catch (error) {
        console.log('❌ Microphone permission denied:', error);
        return false;
    }
}

// ===================================================
// 🎯 SPEECH RECOGNITION SYSTEM (From working bubble system)
// ===================================================
function checkSpeechSupport() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('❌ Speech recognition not supported in this browser');
        return false;
    }
    return true;
}

function initializeSpeechRecognition() {
    if (!checkSpeechSupport()) {
        addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    console.log('✅ Speech recognition initialized');
    return true;
}

function stopListening() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }

    const currentBubble = document.getElementById('currentUserBubble');
    if (currentBubble) {
        currentBubble.classList.remove('typing');
        if (!currentBubble.querySelector('.bubble-text').textContent.trim()) {
            currentBubble.querySelector('.bubble-text').textContent = 'No speech detected';
            currentBubble.style.opacity = '0.6';
        }
        currentBubble.removeAttribute('id');
    }

    // Update UI
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    if (activateMicBtn) activateMicBtn.style.display = 'block';
    if (audioOffBtn) audioOffBtn.style.display = 'none';

    isListening = false;
}

function processUserResponse(userText) {
    userResponseCount++;
    
    // Update UI
    const currentBubble = document.getElementById('currentUserBubble');
    if (currentBubble) {
        currentBubble.classList.remove('typing');
        currentBubble.removeAttribute('id');
    }
    
    // Stop listening while AI responds
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    
    isListening = false;
    
    // Update UI buttons
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    if (activateMicBtn) activateMicBtn.style.display = 'block';
    if (audioOffBtn) audioOffBtn.style.display = 'none';
    
    // Add AI response
    setTimeout(() => {
        addAIResponse(userText);
    }, 800);
}

function addAIResponse(userText) {
    // Generate AI response
    const responseText = getAIResponse(userText);
    lastAIResponse = responseText;
    
    // Add AI message to chat
    addAIMessage(responseText);
    
    // Speak the response
    speakResponse(responseText);
    
    // Update conversation info if available
    updateConversationInfo();
    
    // After AI speaks, automatically start listening again if in audio mode
    setTimeout(() => {
        if (isAudioMode && !isListening && !isSpeaking) {
            createRealtimeBubble();
            startListening();
        }
    }, 3000); // Fixed 3-second delay
}
function createRealtimeBubble() {
    if (isCreatingBubble) {
        console.log('⚠️ Already creating bubble, skipping...');
        return;
    }
    
    isCreatingBubble = true;
    
    const existingBubble = document.getElementById('currentUserBubble');
    if (existingBubble) {
        existingBubble.remove();
        console.log('🧹 Removed existing listening bubble');
    }
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.log('❌ chatMessages container not found');
        isCreatingBubble = false;
        return;
    }
    
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.id = 'currentUserBubble';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    // ANIMATED LISTENING TEXT (like bubble-test4)
    messageBubble.innerHTML = '<span class="listening-animation listening-dots">Listening</span>';
    
    userMessage.appendChild(messageBubble);
    chatMessages.appendChild(userMessage);
    
    scrollChatToBottom();
    console.log('👤 Fresh listening bubble created with animation');
    
    setTimeout(() => {
        isCreatingBubble = false;
    }, 100);
}

function updateConversationInfo() {
    const stateElement = document.getElementById('conversationState');
    const responseElement = document.getElementById('lastResponse');
    
    if (stateElement) stateElement.textContent = conversationState;
    if (responseElement) {
        responseElement.textContent = lastAIResponse.substring(0, 50) + (lastAIResponse.length > 50 ? '...' : '');
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
        
        // Safe check for message bubble
        const bubbleElement = currentBubble.querySelector('.message-bubble');
        if (bubbleElement && !bubbleElement.textContent.trim()) {
            bubbleElement.textContent = 'No speech detected';
            currentBubble.style.opacity = '0.6';
        }
        currentBubble.removeAttribute('id');
    }

    // Update UI buttons
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    if (activateMicBtn) activateMicBtn.style.display = 'block';
    if (audioOffBtn) audioOffBtn.style.display = 'none';

    isListening = false;
    console.log('🛑 Listening stopped');
}

// Smart Button Management System
function updateSmartButton(shouldShow, buttonText, actionType) {
    const smartButton = document.getElementById('smartButton');
    
    if (!smartButton) {
        console.warn('Smart button element not found');
        return;
    }
    
    if (shouldShow) {
        smartButton.style.display = 'block';
        smartButton.textContent = buttonText;
        smartButton.setAttribute('data-action', actionType);
        
        // Add visual emphasis for important CTAs
        if (actionType === 'interview' || actionType === 'connect_bruce') {
            smartButton.classList.add('pulse-animation');
        } else {
            smartButton.classList.remove('pulse-animation');
        }
    } else {
        smartButton.style.display = 'none';
        smartButton.textContent = 'AI Smart Button';
        smartButton.removeAttribute('data-action');
        smartButton.classList.remove('pulse-animation');
    }
}

// Smart Button Click Handler
function handleSmartButtonClick() {
    const smartButton = document.getElementById('smartButton');
    const actionType = smartButton.getAttribute('data-action');
    
    switch(actionType) {
        case 'valuation':
        case 'buying':
        case 'schedule_today':
        case 'schedule_tomorrow':
        case 'contact_today':
        case 'contact_tomorrow':
        case 'connect_bruce':
            // Trigger conversation continuation
            simulateUserMessage("I'm interested in connecting with Bruce");
            break;
            
        case 'interview':
            // Load interview interface in iframe
            loadInterviewInterface();
            break;
            
        default:
            console.log('Smart button clicked - default action');
    }
}

// Interview Interface Loader (Splash Screen for now)
function loadInterviewInterface() {
    const chatArea = document.querySelector('.chat-area');
    const splashScreen = document.createElement('div');
    splashScreen.className = 'interview-splash';
    splashScreen.innerHTML = `
        <div class="splash-content">
            <h3>🚀 AI Business Analyst Interview</h3>
            <p>Connecting you with our advanced interviewer system...</p>
            <div class="loading-animation">●●●</div>
            <p><em>This feature is coming soon!</em></p>
            <button onclick="closeSplashScreen()" class="close-splash">Return to Chat</button>
        </div>
    `;
    
    chatArea.appendChild(splashScreen);
}

// Close Splash Screen
function closeSplashScreen() {
    const splashScreen = document.querySelector('.interview-splash');
    if (splashScreen) {
        splashScreen.remove();
    }
}

// Simulate User Message (for button interactions)
function simulateUserMessage(message) {
    const chatArea = document.querySelector('.chat-area');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-bubble';
    userBubble.innerHTML = `<div class="bubble-content">${message}</div>`;
    
    chatArea.appendChild(userBubble);
    scrollToBottom();
    
    // Process this as if user spoke it
    setTimeout(() => {
        processUserInput(message);
    }, 500);
}

// ===================================================
// 🤖 AI RESPONSE SYSTEM (Fixed & Clean)
// ===================================================
const chatArea = document.getElementById('chatArea');
const aiBubble = document.createElement('div');
aiBubble.className = 'ai-bubble';

const aiAvatar = document.createElement('img');
aiAvatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png';
aiAvatar.className = 'ai-avatar';
aiBubble.appendChild(aiAvatar);

const bubbleContent = document.createElement('div');
aiBubble.appendChild(bubbleContent);

function getAIResponse(userInput) {
    const userText = userInput.toLowerCase();
    let responseText = '';
    let shouldShowSmartButton = false;
    let smartButtonText = '';
    let smartButtonAction = '';
    
    if (conversationState === 'initial') {
        if (userText.includes('sell') || userText.includes('practice')) {
            responseText = "EXCELLENT timing for selling your accounting practice! The market is very strong right now. Should Bruce call you today or tomorrow for your FREE practice valuation?";
            conversationState = 'selling_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Free Valuation';
            smartButtonAction = 'valuation';
        } else if (userText.includes('buy') || userText.includes('purchase')) {
            responseText = "Looking to BUY a CPA firm? Perfect! Bruce has exclusive off-market opportunities available RIGHT NOW. Should Bruce show you available practices today or tomorrow?";
            conversationState = 'buying_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'View Available Practices';
            smartButtonAction = 'buying';
        } else if (userText.includes('value') || userText.includes('worth')) {
            responseText = "Your accounting practice could be worth MORE than you think! Bruce offers a FREE consultation to evaluate your practice. Are you interested in a valuation today?";
            conversationState = 'valuation_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'Get Practice Valuation';
            smartButtonAction = 'valuation';
        } else {
            responseText = "I specialize in CPA firm transactions - buying, selling, and valuations. What specifically are you interested in learning more about?";
        }
    } else if (conversationState === 'selling_inquiry') {
        if (userText.includes('today') || userText.includes('now')) {
            responseText = "Great! Bruce will call you today. What's the best phone number to reach you, and what time works best?";
            conversationState = 'contact_today';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Today';
            smartButtonAction = 'schedule_today';
        } else if (userText.includes('tomorrow')) {
            responseText = "Perfect! Bruce will call you tomorrow. What's the best phone number to reach you, and what time works best?";
            conversationState = 'contact_tomorrow';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Tomorrow';
            smartButtonAction = 'schedule_tomorrow';
        } else {
            responseText = "I didn't quite catch that. Should Bruce call you today or tomorrow for your FREE practice valuation?";
        }
    } else if (conversationState === 'buying_inquiry') {
        if (userText.includes('today') || userText.includes('now')) {
            responseText = "Excellent! Bruce will contact you today to discuss available practices. What's the best phone number to reach you?";
            conversationState = 'contact_today';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect Today';
            smartButtonAction = 'contact_today';
        } else if (userText.includes('tomorrow')) {
            responseText = "Great! Bruce will contact you tomorrow to discuss available practices. What's the best phone number to reach you?";
            conversationState = 'contact_tomorrow';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect Tomorrow';
            smartButtonAction = 'contact_tomorrow';
        } else {
            responseText = "I didn't quite catch that. Should Bruce contact you today or tomorrow about available practices?";
        }
    } else if (conversationState === 'valuation_inquiry') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('interested')) {
            responseText = "Great! Bruce will contact you to set up your FREE valuation. What's the best phone number to reach you, and should he call today or tomorrow?";
            conversationState = 'contact_valuation';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect with Bruce';
            smartButtonAction = 'connect_bruce';
        } else {
            responseText = "No problem! Is there anything else I can help you with regarding your CPA practice?";
            conversationState = 'initial';
        }
    } else if (conversationState.startsWith('contact_')) {
        const phoneMatch = userText.match(/\b(\d{3}[-.]?\d{3}[-.]?\d{4})\b/);
        if (phoneMatch) {
            responseText = "Thank you! Bruce will call you at the number you provided. Is there anything else I can help you with today?";
            conversationState = 'completed';
            shouldShowSmartButton = true;
            smartButtonText = 'Start Interview';
            smartButtonAction = 'interview';
        } else {
            responseText = "Thanks! What's the best phone number for Bruce to reach you?";
        }
    } else {
        responseText = "Thanks for your message. Is there anything else I can help you with regarding your CPA practice?";
        conversationState = 'initial';
    }

    // Update the smart button
    updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);

    // Update UI elements
    lastAIResponse = responseText;
    bubbleContent.textContent = responseText;
    chatArea.appendChild(aiBubble);
    scrollToBottom();
    updateConversationInfo();

    // Simulate AI speaking time
    const speakTime = Math.max(2000, responseText.length * 50);
    document.getElementById('statusInfo').innerHTML = '🤖 AI is responding...';

    // Return to listening mode
    setTimeout(() => {
        document.getElementById('statusInfo').innerHTML = '🎯 Returning to listening mode...';
        setTimeout(() => {
            createRealtimeBubble();
            startListening();
        }, 1000);
    }, speakTime);

    return responseText;
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
        case 'contact_tomorrow':
        case 'connect_bruce':
            simulateUserMessage("I'd like to connect with Bruce");
            break;
            
        case 'interview':
            loadInterviewInterface();
            break;
            
        default:
            console.log('Smart button clicked - no specific action defined');
            simulateUserMessage("I need help with my practice");
    }
}

// Simulate User Message (for button interactions)
function simulateUserMessage(message) {
    console.log('Simulating user message:', message);
    
    // Create user bubble
    const chatArea = document.querySelector('.chat-area');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-bubble';
    userBubble.innerHTML = `<div class="bubble-content">${message}</div>`;
    
    chatArea.appendChild(userBubble);
    scrollToBottom();
    
    // Process this message through your AI system
    setTimeout(() => {
        addAIResponse(message);
    }, 500);
}

// ===================================================
// 💬 MESSAGE HANDLING SYSTEM
// ===================================================
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    messageBubble.textContent = message;
    
    messageElement.appendChild(messageBubble);
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
}

function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    const aiAvatar = document.createElement('img');
    aiAvatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png';
    aiAvatar.className = 'ai-avatar';
    
    const messageText = document.createElement('div');
    messageText.textContent = message;
    
    messageBubble.appendChild(aiAvatar);
    messageBubble.appendChild(messageText);
    messageElement.appendChild(messageBubble);
    
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
// 🗣️ VOICE SYNTHESIS SYSTEM
// ===================================================
function speakResponse(message) {
    console.log('Speaking response');
    
    if (!window.speechSynthesis) {
        console.log('Speech synthesis not supported');
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = function() {
        isSpeaking = true;
        console.log('Speech started');
    };
    
    utterance.onend = function() {
    isSpeaking = false;
    console.log('Speech finished');
    
    // Clear bubble reference
    currentUserBubble = null;
    
    // ONLY restart if conditions are perfect
    if (isAudioMode && !isListening && !recognition) {
        setTimeout(() => {
            try {
                console.log('🔄 Restarting listening after speech');
                startListening(); // This will create bubble safely
            } catch (error) {
                console.log('Recognition restart error:', error);
            }
        }, 1500); // Longer delay to prevent conflicts
    }
};
    utterance.onerror = function(event) {
        console.log('Speech error:', event.error);
        isSpeaking = false;
    };
    
    window.speechSynthesis.speak(utterance);
    currentAudio = utterance;
}

function stopCurrentAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    currentAudio = null;
    isSpeaking = false;
}

// ===================================================
// 📱 TEXT INPUT SYSTEM
// ===================================================
function sendTextMessage() {
    const textInput = document.getElementById('textInput');
    if (!textInput) return;
    
    const message = textInput.value.trim();
    if (!message) return;
    
    addUserMessage(message);
    textInput.value = '';
    
    setTimeout(() => {
        const response = getAIResponse(message);
        addAIMessage(response);
        speakResponse(response);
    }, 300);
}

// ===================================================
// 🚀 SPLASH SCREEN SYSTEM (Your working system)
// ===================================================
function startVoiceChat() {
    console.log('🎤 startVoiceChat() called from splash screen');
    
    // Hide splash screen
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.style.display = 'none';
        console.log('✅ Splash screen hidden');
    }
    
    // Show chat interface
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.style.display = 'flex';
        console.log('✅ Chat interface shown');
    }
    
    // Call activation
    activateMicrophone();
}

async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    // Hide splash screen
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.style.display = 'none';
    }
    
    // Show chat interface
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.style.display = 'flex';
    }
    
    try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        persistentMicStream = stream;
        micPermissionGranted = true;
        
        isAudioMode = true;
        
        // Show appropriate UI
        const activateMicBtn = document.getElementById('activateMicBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');
        const voiceContainer = document.getElementById('voiceVisualizerContainer');
        
        if (activateMicBtn) activateMicBtn.style.display = 'none';
        if (audioOffBtn) audioOffBtn.style.display = 'block';
        if (voiceContainer) voiceContainer.style.display = 'flex';
        
        // Initialize speech recognition
        initializeSpeechRecognition();
        
        // Add greeting and start listening - FIXED TIMING
        setTimeout(() => {
            const greeting = "Welcome! I'm Bruce Clark's AI assistant. What can I help you with today?";
            addAIMessage(greeting);
            
            // Start listening after greeting is added
            setTimeout(() => {
                if (recognition && !isListening) {
                    createRealtimeBubble();
                    startListening();
                }
            }, 1000);
        }, 500);
        
    } catch (error) {
        console.log('Microphone access denied:', error);
        addAIMessage("Microphone access was denied. You can still use text chat.");
        switchToTextMode();
    }
}

function switchToTextMode() {
    isAudioMode = false;
    
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    
    if (activateMicBtn) activateMicBtn.style.display = 'block';
    if (audioOffBtn) audioOffBtn.style.display = 'none';
    if (voiceContainer) voiceContainer.style.display = 'none';
}

// ===================================================
// ⚡ QUICK QUESTIONS SYSTEM
// ===================================================
function askQuickQuestion(questionText) {
    console.log('🎯 Quick question clicked:', questionText);
    
    if (isSpeaking || isProcessingInput) {
        console.log('Ignoring quick question - system busy');
        return;
    }
    
    addUserMessage(questionText);
    isProcessingInput = true;
    
    setTimeout(() => {
        const response = getAIResponse(questionText);
        addAIMessage(response);
        speakResponse(response);
        
        setTimeout(() => {
            isProcessingInput = false;
        }, 500);
    }, 800);
}

// ===================================================
// 🎤 VOICE LOADING SYSTEM
// ===================================================
function getVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            resolve(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                resolve(voices);
            };
        }
    });
}

function preloadVoices() {
    getVoices().then(voices => {
        console.log('🎤 Voices preloaded:', voices.length);
    });
}

// ===================================================
// 🌐 GLOBAL FUNCTIONS
// ===================================================
window.askQuickQuestion = function(question) {
    askQuickQuestion(question);
};

// ===================================================
// 🚀 INITIALIZATION SYSTEM
// ===================================================
function initializeVoiceChat() {
    console.log('🚀 Initializing Voice Chat Module...');
    
    initializeSpeechRecognition();
    preloadVoices();
    
    console.log('✅ Voice Chat Module Ready!');
}

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat();
});

console.log('🎯 Mobile-Wise AI Voice Chat - COMPLETE INTEGRATED SYSTEM LOADED!');
