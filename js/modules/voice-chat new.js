// ===================================================
// 🎯 MOBILE-WISE AI FORMVISER - VOICE CHAT MODULE
// OPTIMIZED FOR INSTANT RESPONSE - NO DELAYS
// ===================================================

// ===================================================
// 🏗️ GLOBAL VARIABLES
// ===================================================
let recognition = null;
let isListening = false;
let isAudioMode = false;
let currentAudio = null;
let hasStartedOnce = false;
let persistentMicStream = null;
let isSpeaking = false;
let micPermissionGranted = false;
let lastProcessedInput = '';
let lastProcessedTime = 0;
let isProcessingResponse = false;
let optimizedVoices = []; // Pre-loaded voices

// ===================================================
// 🎯 UNIFIED VOICE VISUALIZATION SYSTEM
// ===================================================
const VoiceViz = {
    audioContext: null,
    analyser: null,
    microphone: null,
    canvas: null,
    canvasCtx: null,
    dataArray: null,
    animationId: null,
    meterActive: false,
    waveformActive: false
};

// ===================================================
// 📊 ENHANCED KNOWLEDGE BASE SYSTEM
// ===================================================
const initialResponses = {
    welcome: "Perfect! Voice chat is now active. Are you looking to BUY or SELL an accounting practice today?",
    buyOrSell: {
        buy: "Excellent! Bruce has 23 accounting practices available RIGHT NOW, including exclusive off-market opportunities. What size practice are you looking for - solo practitioner, small firm, or larger operation?",
        sell: "Perfect timing! The market for accounting practices is RED HOT right now - firms are selling 15-20% ABOVE asking price! Bruce just closed 4 deals last month, each one above asking. What type of practice do you have - CPA firm, bookkeeping, or tax preparation?"
    }
};

// ===================================================
// 📊 BUSINESS RESPONSES DATABASE
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
// 🎤 SPEECH RECOGNITION (Optimized)
// ===================================================
function initializeSpeechRecognition() {
    console.log('🎤 Initializing speech recognition...');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('🎤 Speech recognition started');
            isListening = true;
            hasStartedOnce = true;
        };

        recognition.onresult = function(event) {
            if (event.results.length > 0) {
                const latestResult = event.results[event.results.length - 1];
                const transcript = latestResult[0].transcript.trim();

                // 🎯 BALANCED DETECTION
                const shouldProcess = (
                    latestResult.isFinal && 
                    transcript.length > 3 &&
                    (
                        latestResult[0].confidence > 0.6 ||
                        transcript.toLowerCase().includes('tax') ||
                        transcript.toLowerCase().includes('sell') ||
                        transcript.toLowerCase().includes('buy') ||
                        transcript.toLowerCase().includes('practice') ||
                        transcript.toLowerCase().includes('accounting') ||
                        transcript.toLowerCase().includes('help') ||
                        transcript.toLowerCase().includes('business') ||
                        transcript.split(' ').length >= 2
                    )
                );

                if (shouldProcess) {
                    console.log('🎤 Processing voice input:', transcript);
                    
                    if (isSpeaking) {
                        console.log('🚫 Ignoring - AI is speaking');
                        return;
                    }
                    
                    handleVoiceInput(transcript);
                } else if (latestResult.isFinal) {
                    console.log('⏳ Too short, waiting for more:', transcript);
                }
            }
        };

        recognition.onend = function() {
            console.log('🎤 Speech recognition ended');
            isListening = false;
            
            if (isSpeaking) {
                console.log('🤖 AI is speaking - speakResponse will handle restart');
                return;
            }
            
            if (isAudioMode && micPermissionGranted && !isSpeaking) {
                setTimeout(() => {
                    if (!isListening && !isSpeaking && isAudioMode) {
                        try {
                            recognition.start();
                            console.log('🔄 Recognition gently restarted');
                        } catch (error) {
                            console.log('⚠️ Gentle restart failed:', error.message);
                        }
                    }
                }, 1000);
            }
        };

        recognition.onerror = function(event) {
            console.log('❌ Speech recognition error:', event.error);
            isListening = false;
            
            if (event.error === 'not-allowed') {
                console.log('🚫 Microphone permission denied');
                micPermissionGranted = false;
                return;
            }
            
            if (event.error === 'no-speech') {
                console.log('⏳ Chrome timeout - this is NORMAL behavior');
                return;
            }
            
            if (isAudioMode && micPermissionGranted && !isSpeaking) {
                setTimeout(() => {
                    if (!isListening && !isSpeaking && isAudioMode) {
                        try {
                            recognition.start();
                            console.log('🔄 Recognition restarted after error');
                        } catch (error) {
                            console.log('⚠️ Restart failed:', error.message);
                        }
                    }
                }, 2000);
            }
        };
    } else {
        console.log('❌ Speech recognition not supported in this browser');
    }
}

// ===================================================
// 🎤 VOICE SYNTHESIS - OPTIMIZED FOR SPEED
// ===================================================
let voiceSpeed = 1.0;
let currentSpeedIndex = 3;
let bestVoice = null;

// Pre-load voices immediately
function preloadVoices() {
    console.log('🔍 Pre-loading voices...');
    
    // Get voices immediately if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        optimizedVoices = filterToEnglishVoices(voices);
        bestVoice = findUniversalBestVoice(optimizedVoices);
        console.log('✅ Voices pre-loaded:', optimizedVoices.length);
        return;
    }
    
    // Wait for voices if not available yet
    window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        optimizedVoices = filterToEnglishVoices(voices);
        bestVoice = findUniversalBestVoice(optimizedVoices);
        console.log('✅ Voices loaded after event:', optimizedVoices.length);
    };
}

// Simple voice filter
function filterToEnglishVoices(allVoices) {
    return allVoices.filter(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('English') || voice.name.includes('US') || 
         voice.name.includes('UK') || voice.name.includes('Aria') || 
         voice.name.includes('Zira') || voice.name.includes('Libby'))
    );
}

// Fast voice selection
function findUniversalBestVoice(voices) {
    // Priority 1: British Female
    const britishFemale = voices.find(v => 
        v.name.includes('UK English Female') || 
        v.name.includes('Google UK English Female')
    );
    if (britishFemale) return britishFemale;
    
    // Priority 2: British Male
    const britishMale = voices.find(v => 
        v.name.includes('UK English Male') || 
        v.name.includes('Google UK English Male')
    );
    if (britishMale) return britishMale;
    
    // Priority 3: Microsoft British
    const microsoftLibby = voices.find(v => 
        v.name.includes('Libby') && v.name.includes('United Kingdom')
    );
    if (microsoftLibby) return microsoftLibby;
    
    // Fallback to first available voice
    return voices[0] || null;
}

// ===================================================
// 🚀 INSTANT RESPONSE SYSTEM - NO DELAYS
// ===================================================
function processUserInput(message) {
    console.log('🔥 Processing user input:', message);
    
    if (isProcessingResponse) {
        console.log('🚫 Already processing, ignoring');
        return;
    }
    
    isProcessingResponse = true;
    
    // Stop any current audio immediately
    if (currentAudio) stopCurrentAudio();
    
    // INSTANT AI response - NO DELAYS!
    const response = getAIResponse(message);
    addAIMessage(response);
    speakResponse(response);
    
    // Reset flag
    setTimeout(() => { isProcessingResponse = false; }, 100);
}

function handleVoiceInput(transcript) {
    const now = Date.now();
    
    // Simple duplicate prevention
    if (transcript === lastProcessedInput && (now - lastProcessedTime) < 1500) {
        console.log('🚫 Duplicate input ignored:', transcript);
        return;
    }
    
    if (transcript.length < 2) {
        console.log('⏳ Too short, waiting for more:', transcript);
        return;
    }
    
    lastProcessedInput = transcript;
    lastProcessedTime = now;
    
    console.log('🗣️ Processing complete voice input:', transcript);
    
    addUserMessage(transcript);
    
    // Stop any current speech immediately
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    currentAudio = null;
    isSpeaking = false;
    
    // Process immediately
    processUserInput(transcript);
}

// ===================================================
// ⚡ OPTIMIZED SPEECH FUNCTION - NO DELAYS
// ===================================================
function speakResponse(message) {
    console.log('🗣️ Speaking response...');
    
    // Pause recognition gently
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
        console.log('⏸️ Speech recognition PAUSED for AI response');
    }
    
    // Stop any current speech immediately
    window.speechSynthesis.cancel();
    currentAudio = null;
    
    updateHeaderBanner('🤖 AI responding...');
    
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        restartRecognition();
        return;
    }

    // Use pre-loaded voice (no waiting)
    const utterance = new SpeechSynthesisUtterance(message);
    
    if (bestVoice) {
        utterance.voice = bestVoice;
        console.log('🎤 Using pre-loaded voice:', bestVoice.name);
    }
    
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = () => {
        isSpeaking = true;
        console.log('🗣️ Speech started');
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        currentAudio = null;
        console.log('✅ Speech finished');
        updateHeaderBanner('🎤 AI is listening...');
        restartRecognition();
    };
    
    utterance.onerror = (event) => {
        console.log('❌ Speech error:', event.error);
        isSpeaking = false;
        currentAudio = null;
        restartRecognition();
    };
    
    currentAudio = utterance;
    window.speechSynthesis.speak(utterance);
}

function restartRecognition() {
    // Immediate restart with no delay
    if (isAudioMode && !isListening) {
        try {
            recognition.start();
            isListening = true;
            console.log('🔄 Speech recognition IMMEDIATELY restarted');
        } catch (error) {
            console.log('⚠️ Recognition restart failed:', error);
            // Try again after short delay if failed
            setTimeout(restartRecognition, 500);
        }
    }
}

// ===================================================
// 🧠 AI RESPONSE - FAST
// ===================================================
function getAIResponse(message) {
    const msg = message.toLowerCase();
    
    // Check for buy/sell intent FIRST
    if (msg.includes('buy') || msg.includes('buying') || msg.includes('purchase')) {
        return initialResponses.buyOrSell.buy;
    }
    
    if (msg.includes('sell') || msg.includes('selling') || msg.includes('sale')) {
        return initialResponses.buyOrSell.sell;
    }
    
    // Fall back to existing business responses
    for (const [key, value] of Object.entries(businessResponses)) {
        if (msg.includes(key)) {
            return value;
        }
    }
    
    // Default response
    return "I can help you with buying or selling accounting practices, valuation, financing, and more. Are you looking to BUY or SELL a practice?";
}

// ===================================================
// 💬 MESSAGE DISPLAY
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
    console.log('👤 User message added:', message);
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
    console.log('🤖 AI message added');
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ===================================================
// 🎤 MICROPHONE ACTIVATION
// ===================================================
async function activateMicrophone() {
    console.log('🎤 User clicked ACTIVATE MICROPHONE button...');

    const activateBtn = document.getElementById('activateMicButton');
    if (activateBtn) {
        activateBtn.textContent = '🎤 Requesting permission...';
        activateBtn.disabled = true;
    }

    try {
        persistentMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('🎤 Microphone access granted!');
        micPermissionGranted = true;
        
        if (activateBtn) activateBtn.style.display = 'none';
        
        const stopBtn = document.getElementById('audioOffBtn');
        if (stopBtn) {
            stopBtn.style.display = 'block';
            stopBtn.textContent = '🛑 Stop Audio';
        }
        
    } catch (error) {
        console.log('❌ Microphone access denied:', error);
        if (activateBtn) {
            activateBtn.textContent = '🎤 Activate Microphone';
            activateBtn.disabled = false;
        }
        addAIMessage("No problem! You can still chat with me using text. What can I help you with?");
        return;
    }
    
    isAudioMode = true;
    
    if (recognition && !isListening) {
        try {
            recognition.start();
            console.log('🎤 Speech recognition started');
        } catch (error) {
            console.log('⚠️ Recognition start failed:', error);
        }
    }
    
    updateHeaderBanner('🎤 Microphone Active - How can we help your business?');
    
    // Immediate response with no delay
    const greeting = "Perfect! Voice chat is now active, what can I help you with today?";
    addAIMessage(greeting);
    speakResponse(greeting);
}

// ===================================================
// 🛠️ UTILITY FUNCTIONS
// ===================================================
function stopCurrentAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('🛑 Speech stopped');
    }
    currentAudio = null;
    isSpeaking = false;
}

function updateHeaderBanner(message) {
    const headerTitle = document.getElementById('chatHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = message;
    }
}

// ===================================================
// 🚀 MODULE INITIALIZATION
// ===================================================
function initializeVoiceChat() {
    console.log('🚀 Initializing Voice Chat Module...');
    
    initializeSpeechRecognition();
    preloadVoices(); // Pre-load voices immediately
    
    console.log('✅ Voice Chat Module Ready - WAITING for user interaction');
}

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat();
});

console.log('🎯 Mobile-Wise AI Formviser Voice Chat Module Loaded - OPTIMIZED FOR SPEED!');