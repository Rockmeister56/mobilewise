// ===================================================
// 🎯 MOBILE-WISE AI FORMVISER - HYBRID WORKING SYSTEM
// WORKING COMPONENTS + BUSINESS LOGIC
// ===================================================

// ===================================================
// 🏗️ CLEAN GLOBAL VARIABLES (From working system)
// ===================================================
let recognition = null;
let isListening = false;
let isAudioMode = false;
let currentAudio = null;
let isSpeaking = false;
let voiceSpeed = 1.0;
let interimTranscript = '';
let silenceTimer = null;
let isProcessingInput = false;

// ===================================================
// 📊 BUSINESS RESPONSES DATABASE (Your complete set)
// ===================================================
const businessResponses = {
    "practice": "Looking to sell your CPA firm or accounting practice? You've found the RIGHT expert! Bruce specializes exclusively in CPA firm transactions and has helped over 4000 accounting professionals maximize their practice value. The market for accounting practices is incredibly strong right now - firms are selling 15-20% above asking price! Time is critical in this market. Should Bruce call you today or tomorrow for your FREE practice valuation?",
    "sell": "EXCELLENT timing for selling your accounting practice! Bruce just closed 4 CPA firm deals last month - each one ABOVE asking price. Here's what most CPAs don't realize: waiting even 60 days in this market can cost you $75,000+ in lost value. Tax season creates urgency, and buyers are paying premium prices RIGHT NOW. The consultation is completely FREE. Should Bruce call you today at 2pm or tomorrow at 10am to discuss your exit strategy?",
    "cpa": "CPA firm transactions are Bruce's specialty! He understands the unique challenges of selling accounting practices - client retention, seasonal revenue, staff transitions, and regulatory compliance. Bruce has helped CPAs from solo practices to 50-person firms achieve maximum value. The market is HOT for quality CPA firms. Should Bruce review your practice value today or tomorrow?",
    "accounting": "Accounting practice sales require specialized expertise, and Bruce has it! He knows how to properly value recurring client bases, handle staff transitions, and structure deals that protect both buyer and seller. Bruce just helped a 10-person CPA firm sell for $2.1M - that's 1.8x annual revenue! The consultation costs nothing, but the insights could add $100K+ to your sale. When should Bruce call - today or tomorrow?",
    "value": "Your accounting practice could be worth MORE than you think! Bruce recently helped a CPA sell his practice for $1.4M - that's $250K above his original estimate! Here's the key with CPA firms: proper client base analysis + strategic timing + expert negotiation = MAXIMUM profit. Bruce offers a FREE consultation, and I guarantee you'll learn something that adds significant value to your sale. Should Bruce call you today or tomorrow?",
    "buy": "Looking to BUY a CPA firm or accounting practice? Perfect! Bruce has 23 accounting practices available RIGHT NOW, including exclusive off-market opportunities. Here's what smart buyers know: the best CPA firms never hit the public market - they're sold privately through Bruce's network. Should Bruce show you his exclusive inventory today or tomorrow?",
    "financing": "CPA firm financing? Bruce has the connections you need! He's arranged over $150M in accounting practice loans with specialized lenders who understand recurring revenue models. Rates as low as 5.2% for qualified buyers. Here's the insider advantage: pre-approval gives you MASSIVE negotiating power in this competitive market. Should Bruce get your financing pre-approval started today or tomorrow?",
    "broker": "You're talking to the RIGHT team! Bruce is the premier CPA firm broker with over 15 years specializing EXCLUSIVELY in accounting practice transactions. He understands the unique aspects of CPA firms - from client confidentiality to seasonal cash flow patterns. Bruce has closed over $75M in CPA firm deals. Ready to discuss your accounting practice goals? Should Bruce call today or tomorrow?"
};

// ===================================================
// 🚀 IMMEDIATE INITIALIZATION (Working system approach)
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    bindEventListeners();
    initializeWaveform();
    console.log('✅ Mobile-Wise AI Voice Chat - WORKING VERSION LOADED!');
});

function bindEventListeners() {
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    const sendBtn = document.getElementById('sendBtn');
    const textInput = document.getElementById('textInput');
    
    if (activateMicBtn) {
        activateMicBtn.addEventListener('click', activateMicrophone);
    }
    
    if (audioOffBtn) {
        audioOffBtn.addEventListener('click', switchToTextMode);
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendTextMessage);
    }
    
    if (textInput) {
        textInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendTextMessage();
            }
        });
    }
}

// ===================================================
// 🎤 WORKING SPEECH RECOGNITION (No 7-second delays!)
// ===================================================
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        
        recognition.continuous = true;
        recognition.interimResults = true;  // CRITICAL for complete sentences
        recognition.maxAlternatives = 1;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('🎤 Speech recognition started');
            isListening = true;
            updateStatusIndicator('listening');
            interimTranscript = '';
        };

        recognition.onresult = function(event) {
            // Clear any existing silence timer
            if (silenceTimer) {
                clearTimeout(silenceTimer);
            }
            
            let finalTranscript = '';
            interimTranscript = '';
            
            // Process both interim and final results
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Process final results - ONLY when we have a complete sentence
            if (finalTranscript && !isProcessingInput) {
                console.log('🎤 Final voice input received:', finalTranscript);
                
                if (isSpeaking) {
                    console.log('⏸️ Ignoring input - AI is speaking');
                    return;
                }
                
                if (finalTranscript && finalTranscript.length > 0) {
                    isProcessingInput = true;
                    handleVoiceInput(finalTranscript);
                }
            }
            
            // Set a timer to detect when user stops speaking
            // Only use this as a fallback if Chrome doesn't send final results
            if (interimTranscript && interimTranscript.length > 3) {
                silenceTimer = setTimeout(() => {
                    if (interimTranscript && !isProcessingInput && !isSpeaking) {
                        console.log('⏳ Silence fallback - processing:', interimTranscript);
                        isProcessingInput = true;
                        handleVoiceInput(interimTranscript);
                        interimTranscript = '';
                    }
                }, 1200); // 1200ms for natural pause detection
            }
        };

        recognition.onend = function() {
            console.log('🎤 Speech recognition ended');
            isListening = false;
            updateStatusIndicator('inactive');
            
            // Clear silence timer
            if (silenceTimer) {
                clearTimeout(silenceTimer);
            }
            
            // Chrome-friendly restart - NO COMPLEX LOGIC!
            if (isAudioMode && !isSpeaking) {
                setTimeout(() => {
                    if (!isListening && isAudioMode) {
                        try {
                            recognition.start();
                            console.log('🔄 Recognition restarted');
                        } catch (error) {
                            console.log('⚠️ Recognition restart failed:', error);
                        }
                    }
                }, 300); // ONLY 300ms delay!
            }
        };

        recognition.onerror = function(event) {
            console.log('❌ Speech recognition error:', event.error);
            isListening = false;
            updateStatusIndicator('inactive');
            
            if (event.error === 'not-allowed') {
                addAIMessage("Please allow microphone access to use voice chat.");
            }
            
            // Clear silence timer
            if (silenceTimer) {
                clearTimeout(silenceTimer);
            }
            
            isProcessingInput = false;
        };
        
        console.log('✅ Working speech recognition initialized');
    } else {
        console.log('❌ Speech recognition not supported');
        addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
    }
}

// ===================================================
// 🚀 COMPLETE startVoiceChat FUNCTION - SPLASH SCREEN REMOVAL
// ===================================================
function startVoiceChat() {
    console.log('🎤 startVoiceChat() called from splash screen');
    
    // HIDE SPLASH SCREEN - This was missing!
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.style.display = 'none';
        console.log('✅ Splash screen hidden');
    }
    
    // SHOW CHAT INTERFACE
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.style.display = 'flex';
        console.log('✅ Chat interface shown');
    }
    
    // ACTIVATE MICROPHONE IMMEDIATELY
    activateMicrophone();
}

// ===================================================
// 🎯 ENHANCED activateMicrophone - SPLASH SCREEN AWARE
// ===================================================
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    // ENSURE SPLASH SCREEN IS HIDDEN (backup check)
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.style.display = 'none';
    }
    
    // ENSURE CHAT INTERFACE IS SHOWN (backup check)
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.style.display = 'flex';
    }
    
    try {
        // Request microphone permission - SIMPLE approach
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        isAudioMode = true;
        
        // Show appropriate UI
        const activateMicBtn = document.getElementById('activateMicBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');
        const speedContainer = document.getElementById('speedControlsContainer');
        const voiceContainer = document.getElementById('voiceVisualizerContainer');
        
        if (activateMicBtn) activateMicBtn.style.display = 'none';
        if (audioOffBtn) audioOffBtn.style.display = 'block';
        if (speedContainer) speedContainer.style.display = 'flex';
        if (voiceContainer) voiceContainer.style.display = 'flex';
        
        // Start recognition - IMMEDIATE!
        if (recognition && !isListening) {
            try {
                recognition.start();
            } catch (error) {
                console.log('⚠️ Recognition start error:', error);
            }
        }
        
        updateHeaderBanner('🎤 Microphone Active - How can we help your business?');
        updateStatusIndicator('listening');
        
        // Add greeting - FAST!
        setTimeout(() => {
            const greeting = "What can I help you with today?";
            addAIMessage(greeting);
            speakResponse(greeting);
        }, 500);
        
    } catch (error) {
        console.log('❌ Microphone access denied:', error);
        addAIMessage("Microphone access was denied. You can still use text chat.");
        switchToTextMode();
    }
}

// MAKE BOTH FUNCTIONS GLOBALLY AVAILABLE
window.startVoiceChat = startVoiceChat;
window.activateMicrophone = activateMicrophone;


// ===================================================
// 🎤 MICROPHONE ACTIVATION (Working system approach)
// ===================================================
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    try {
        // Request microphone permission - SIMPLE approach
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        isAudioMode = true;
        
        // Show appropriate UI
        const activateMicBtn = document.getElementById('activateMicBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');
        const speedContainer = document.getElementById('speedControlsContainer');
        const voiceContainer = document.getElementById('voiceVisualizerContainer');
        
        if (activateMicBtn) activateMicBtn.style.display = 'none';
        if (audioOffBtn) audioOffBtn.style.display = 'block';
        if (speedContainer) speedContainer.style.display = 'flex';
        if (voiceContainer) voiceContainer.style.display = 'flex';
        
        // Start recognition - IMMEDIATE!
        if (recognition && !isListening) {
            try {
                recognition.start();
            } catch (error) {
                console.log('⚠️ Recognition start error:', error);
            }
        }
        
        updateHeaderBanner('🎤 Microphone Active - How can we help your business?');
        updateStatusIndicator('listening');
        
        // Add greeting - FAST!
        setTimeout(() => {
            const greeting = "What can I help you with today?";
            addAIMessage(greeting);
            speakResponse(greeting);
        }, 500);
        
    } catch (error) {
        console.log('❌ Microphone access denied:', error);
        addAIMessage("Microphone access was denied. You can still use text chat.");
        switchToTextMode();
    }
}

// ===================================================
// 🔄 MODE SWITCHING (Working system)
// ===================================================
function switchToTextMode() {
    console.log('📝 Switching to text mode');
    isAudioMode = false;
    
    // Stop recognition
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
    }
    
    // Clear any silence timer
    if (silenceTimer) {
        clearTimeout(silenceTimer);
    }
    
    // Update UI
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    const speedContainer = document.getElementById('speedControlsContainer');
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    const textControls = document.getElementById('textControls');
    
    if (activateMicBtn) activateMicBtn.style.display = 'block';
    if (audioOffBtn) audioOffBtn.style.display = 'none';
    if (speedContainer) speedContainer.style.display = 'none';
    if (voiceContainer) voiceContainer.style.display = 'none';
    if (textControls) textControls.style.display = 'flex';
    
    updateHeaderBanner('💬 Text Mode - Type your message below');
    updateStatusIndicator('inactive');
    
    const textInput = document.getElementById('textInput');
    if (textInput) {
        setTimeout(() => textInput.focus(), 100);
    }
    
    isProcessingInput = false;
}

function switchToAudioMode() {
    console.log('🎤 Switching to audio mode');
    isAudioMode = true;
    
    // Update UI
    const textControls = document.getElementById('textControls');
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    const speedContainer = document.getElementById('speedControlsContainer');
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    
    if (textControls) textControls.style.display = 'none';
    if (activateMicBtn) activateMicBtn.style.display = 'none';
    if (audioOffBtn) audioOffBtn.style.display = 'block';
    if (speedContainer) speedContainer.style.display = 'flex';
    if (voiceContainer) voiceContainer.style.display = 'flex';
    
    // Start recognition if not already listening
    if (recognition && !isListening) {
        try {
            recognition.start();
        } catch (error) {
            console.log('⚠️ Recognition start error:', error);
        }
    }
    
    updateHeaderBanner('🎤 Voice Mode - Speak now');
    updateStatusIndicator('listening');
    
    // Add greeting
    setTimeout(() => {
        const greeting = "What can I help you with?";
        addAIMessage(greeting);
        speakResponse(greeting);
    }, 500);
    
    isProcessingInput = false;
}

// ===================================================
// 💬 MESSAGE HANDLING (Working system - FAST!)
// ===================================================
function handleVoiceInput(transcript) {
    console.log('🗣️ Processing voice input:', transcript);
    addUserMessage(transcript);
    processUserInput(transcript);
}

function sendTextMessage() {
    const textInput = document.getElementById('textInput');
    if (!textInput) return;
    
    const message = textInput.value.trim();
    if (!message) return;
    
    console.log('💬 Processing text input:', message);
    addUserMessage(message);
    textInput.value = '';
    processUserInput(message);
}

function processUserInput(message) {
    if (currentAudio) {
        stopCurrentAudio();
    }
    
    // Clear any silence timer
    if (silenceTimer) {
        clearTimeout(silenceTimer);
    }
    
    // WORKING SYSTEM TIMING - Only 300ms delay!
    setTimeout(() => {
        const response = getAIResponse(message);
        addAIMessage(response);
        speakResponse(response);
        
        // Reset processing flag after short delay
        setTimeout(() => {
            isProcessingInput = false;
        }, 500);
    }, 300); // ONLY 300ms - NO MORE 7-SECOND DELAYS!
}

function getAIResponse(message) {
    const msg = message.toLowerCase();
    
    // Check business responses
    for (const [key, value] of Object.entries(businessResponses)) {
        if (msg.includes(key)) {
            return value;
        }
    }
    
    // Default response
    return "I can help with accounting practice sales, valuations, financing, and more. Are you looking to buy or sell a practice?";
}

// ===================================================
// 💬 MESSAGE DISPLAY (Your HTML structure)
// ===================================================
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageHTML = `
        <div class="message user-message">
            <div class="message-bubble">${message}</div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    scrollChatToBottom();
}

function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageHTML = `
        <div class="message ai-message">
            <div class="message-bubble">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png" class="ai-avatar">
                <div>${message}</div>
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ===================================================
// 🗣️ SPEECH SYNTHESIS (Working system - FAST!)
// ===================================================
function speakResponse(message) {
    console.log('🗣️ Speaking response');
    updateHeaderBanner('🤖 AI responding...');
    updateStatusIndicator('speaking');
    
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Optimized for Chrome - WORKING SYSTEM SETTINGS
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = function() {
        isSpeaking = true;
        console.log('🗣️ Speech started');
    };
    
    utterance.onend = function() {
        isSpeaking = false;
        console.log('✅ Speech finished');
        updateHeaderBanner('🎤 Ready for your question');
        
        if (isAudioMode) {
            updateStatusIndicator('listening');
            // Restart recognition with MINIMAL delay - Working system approach
            setTimeout(() => {
                if (!isListening && isAudioMode) {
                    try {
                        recognition.start();
                    } catch (error) {
                        console.log('⚠️ Recognition restart error:', error);
                    }
                }
            }, 100); // ONLY 100ms delay!
        } else {
            updateStatusIndicator('inactive');
        }
    };
    
    utterance.onerror = function(event) {
        console.log('❌ Speech error:', event.error);
        isSpeaking = false;
        updateStatusIndicator('inactive');
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
// ⚡ VOICE SPEED CONTROL (Your preserved system)
// ===================================================
const speedLevels = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
const speedNames = ['Very Slow', 'Slow', 'Relaxed', 'Normal', 'Fast', 'Faster', 'Very Fast'];
let currentSpeedIndex = 3;

function adjustVoiceSpeed(direction) {
    if (direction === 'faster' && currentSpeedIndex < speedLevels.length - 1) {
        currentSpeedIndex++;
    } else if (direction === 'slower' && currentSpeedIndex > 0) {
        currentSpeedIndex--;
    } else if (direction === 'normal') {
        currentSpeedIndex = 3;
    }
    
    voiceSpeed = speedLevels[currentSpeedIndex];
    const speedName = speedNames[currentSpeedIndex];
    
    const speedDisplay = document.getElementById('speedDisplay');
    if (speedDisplay) {
        speedDisplay.textContent = speedName;
    }
    
    console.log('⚡ Voice speed set to:', speedName);
}

// ===================================================
// 🎛️ WAVEFORM VISUALIZATION (Working system)
// ===================================================
function initializeWaveform() {
    const canvas = document.getElementById('voiceWaveform');
    if (!canvas) return;
    
    const canvasCtx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Simple animation for demo purposes
    let animationId = null;
    let step = 0;
    
    function animate() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!isListening && !isSpeaking) {
            canvasCtx.fillStyle = '#333';
            canvasCtx.font = "12px Arial";
            canvasCtx.textAlign = "center";
            canvasCtx.fillText("Microphone inactive", canvas.width/2, canvas.height/2);
            return;
        }
        
        canvasCtx.fillStyle = isSpeaking ? '#dc3545' : '#28a745';
        
        for (let i = 0; i < canvas.width; i += 5) {
            const height = Math.sin(i/20 + step) * 15 + 
                          Math.sin(i/10 + step*1.5) * 5 + 
                          (isSpeaking ? 20 : 10);
            canvasCtx.fillRect(i, canvas.height/2 - height/2, 3, height);
        }
        
        step += 0.1;
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// ===================================================
// 🛠️ UI UTILITY FUNCTIONS (Working system)
// ===================================================
function updateHeaderBanner(message) {
    const headerTitle = document.getElementById('chatHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = message;
    }
}

function updateStatusIndicator(status) {
    const indicator = document.getElementById('statusIndicator');
    if (!indicator) return;
    
    indicator.className = 'status-indicator';
    
    switch(status) {
        case 'listening':
            indicator.classList.add('status-listening');
            break;
        case 'speaking':
            indicator.classList.add('status-speaking');
            break;
        default:
            indicator.classList.add('status-inactive');
            break;
    }
}

// ===================================================
// 🌐 GLOBAL FUNCTIONS (Your requirements)
// ===================================================
function askQuickQuestion(question) {
    console.log('⚡ Quick question:', question);
    addUserMessage(question);
    processUserInput(question);
}

function muteAIVoice() {
    console.log('🔇 MUTING AI Voice...');
    stopCurrentAudio();
    isSpeaking = false;
    updateHeaderBanner('🔇 AI Voice Muted');
    switchToTextMode();
    console.log('✅ AI Voice MUTED');
}

// Make functions available globally
window.askQuickQuestion = askQuickQuestion;
window.adjustVoiceSpeed = adjustVoiceSpeed;
window.switchToTextMode = switchToTextMode;
window.switchToAudioMode = switchToAudioMode;
window.activateMicrophone = activateMicrophone;
window.muteAIVoice = muteAIVoice;

console.log('🚀 Mobile-Wise AI Formviser - HYBRID WORKING SYSTEM LOADED!');
console.log('✅ NO MORE 7-SECOND DELAYS - INSTANT RESPONSES!');
