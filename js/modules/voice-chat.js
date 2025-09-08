// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATED SYSTEM
// Combining working bubble system + your business logic
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


function startListening() {
    console.log('🎯 startListening() called - starting speech recognition');
    
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return; // Don't start listening if AI is speaking

    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        createRealtimeBubble();
        isListening = true;

        // 🎯 MAGIC BUBBLE ANIMATION SYSTEM
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
                    const bubbleElement = currentBubble.querySelector('.bubble-text');
                    if (bubbleElement) {
                        bubbleElement.textContent = displayText;
                    }

                    // 🎯 MAGIC ANIMATION STATES
                    if (interimTranscript) {
                        currentBubble.classList.add('listening-animation');
                        currentBubble.classList.remove('speech-complete');
                    } else if (finalTranscript) {
                        currentBubble.classList.remove('listening-animation');
                        currentBubble.classList.add('speech-complete'); // ← SOLID STATE!
                    }

                    scrollToBottom();
                }
            }

            // Process final transcript
            if (finalTranscript) {
                setTimeout(() => {
                    processUserResponse(finalTranscript);
                }, 500);
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            console.log(`❌ Error: ${event.error}`);
            stopListening();
        };

        recognition.onend = function() {
            if (isListening) {
                console.log("Recognition ended, but we're still in listening mode");
            }
        };

        recognition.start();
        console.log('🎤 Speech recognition started successfully');

    } catch (error) {
        console.error('Error starting speech recognition:', error);
        console.log('❌ Failed to start speech recognition');
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

    } // ← ADD THIS CLOSING BRACKET HERE!

function createRealtimeBubble() {
    // SAFETY CHECK: Prevent multiple bubbles
    const existingBubble = document.getElementById('currentUserBubble');
    if (existingBubble) {
        console.log('🛡️ Bubble already exists - not creating duplicate');
        return;
    }

    const chatArea = document.getElementById('chatMessages'); // ← Your container ID
    const userBubble = document.createElement('div');
    userBubble.className = 'message user-message'; // ← Your CSS classes
    userBubble.id = 'currentUserBubble';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    const bubbleText = document.createElement('div');
    bubbleText.className = 'bubble-text';
    bubbleText.textContent = 'Listening...';
    
    messageBubble.appendChild(bubbleText);
    userBubble.appendChild(messageBubble);
    
    // ADD THE MISSING ANIMATION CLASSES
    userBubble.classList.add('listening-animation');
    bubbleText.classList.add('listening-dots');
    
    chatArea.appendChild(userBubble);
    scrollToBottom();
    
    console.log('✅ Realtime bubble created successfully');
}

function scrollToBottom() {
    const chatArea = document.getElementById('chatMessages');
    chatArea.scrollTop = chatArea.scrollHeight;
}

function updateConversationInfo() {
    console.log('Conversation State:', conversationState);
    console.log('Last Response:', lastAIResponse.substring(0, 50) + (lastAIResponse.length > 50 ? '...' : ''));
}

function resetConversation() {
    const chatArea = document.getElementById('chatMessages');
    chatArea.innerHTML = `
        <div class="ai-bubble">
            <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png" class="ai-avatar">
            <div>👋 Conversation reset! How can I help you with your CPA practice today?</div>
        </div>
    `;
    
    conversationState = 'initial';
    lastAIResponse = '';
    userResponseCount = 0;
    
    updateConversationInfo();
    console.log('Click microphone to start conversation'); 
    
    if (isListening) {
        stopListening();
    }
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
    const chatArea = document.querySelector('.chatMessages');
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
    const chatArea = document.querySelector('.chatMessages');
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

    // SAFE DOM HANDLING
    const chatArea = document.getElementById('chatMessages');
    if (chatArea) { 
        const aiBubble = document.createElement('div');
        aiBubble.className = 'ai-bubble';

        const aiAvatar = document.createElement('img');
        aiAvatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png';
        aiAvatar.className = 'ai-avatar';
        aiBubble.appendChild(aiAvatar);

        const bubbleContent = document.createElement('div');
        bubbleContent.textContent = responseText;
        aiBubble.appendChild(bubbleContent);
        
        chatArea.appendChild(aiBubble);
        
        if (typeof scrollToBottom === 'function') {
            scrollToBottom();
        }
    }

    // Safe function calls
    if (typeof updateSmartButton === 'function') {
        updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
    }
    
    if (typeof updateConversationInfo === 'function') {
        updateConversationInfo();
    }

    // Safe status update
    const statusInfo = document.getElementById('statusInfo');
    if (statusInfo) {
        const speakTime = Math.max(2000, responseText.length * 50);
        statusInfo.innerHTML = '🤖 AI is responding...';

        setTimeout(() => {
            statusInfo.innerHTML = '🎯 Returning to listening mode...';
            setTimeout(() => {
                if (typeof createRealtimeBubble === 'function') {
                    createRealtimeBubble();
                }
                if (typeof startListening === 'function') {
                    startListening();
                }
            }, 1000);
        }, speakTime);
    }

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
    const chatArea = document.querySelector('.chatMessages');
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
    console.log('🎤 Speaking response:', message);
    
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    utterance.rate = voiceSpeed; // ← KEEP: Your voice speed control
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = function() {
        isSpeaking = true;
        console.log('✅ AI started speaking');
    };
    
    utterance.onend = function() {
        isSpeaking = false;
        console.log('✅ AI finished speaking');
        
        // Clear bubble reference
        currentUserBubble = null;
        
        // ONLY restart if conditions are perfect
        if (isAudioMode && !isListening && !recognition) {
            setTimeout(() => {
                try {
                    console.log('🔄 Restarting listening after speech');
                    createRealtimeBubble(); // ← ADD: Ensure bubble is created
                    startListening();
                } catch (error) {
                    console.log('❌ Recognition restart error:', error);
                }
            }, 800); // ← REDUCED: From 1500ms to 800ms for faster flow
        }
    };
    
    utterance.onerror = function(event) {
        console.log('❌ Speech error:', event.error);
        isSpeaking = false;
        currentUserBubble = null; // ← ADD: Clear bubble on error too
    };
    
    window.speechSynthesis.speak(utterance);
    currentAudio = utterance; // ← KEEP: Your audio reference system
}

// ← KEEP: Your stopCurrentAudio function is perfect!
function stopCurrentAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    currentAudio = null;
    isSpeaking = false;
    currentUserBubble = null; // ← ADD: Clear bubble when stopping
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
        
        // Add greeting
        setTimeout(() => {
            const greeting = "Welcome! I'm Bruce Clark's AI assistant. What can I help you with today?";
            addAIMessage(greeting);
        }, 500);
        
        // Start listening after greeting
        setTimeout(() => {
            if (recognition && !isListening) {
                createRealtimeBubble();
                startListening();
            }
        }, 1500);
        
    } catch (error) {
        console.log('❌ Microphone access denied:', error);
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
