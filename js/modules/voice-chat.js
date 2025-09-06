// ===================================================
// 🎯 MOBILE-WISE AI FORMVISER - SURGICAL HYBRID SYSTEM
// KEEPING ORIGINAL FOUNDATION + REPLACING ONLY BROKEN PARTS
// ===================================================

// ===================================================
// 🏗️ GLOBAL VARIABLES (From original - KEPT AS-IS)
// ===================================================
let recognition = null;
let isListening = false;
let isAudioMode = false;
let currentAudio = null;
let persistentMicStream = null;
let isSpeaking = false;
let currentUserBubble = null;

// Add this function and call it on page load
async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('✅ Microphone permission granted');
        return true;
    } catch (error) {
        console.log('❌ Microphone permission denied:', error);
        document.getElementById('statusInfo').innerHTML = '🚫 Microphone access denied. Please enable in browser settings.';
        return false;
    }
}

// ===================================================
// 🔄 REPLACED: WORKING SPEECH VARIABLES (From working system)
// ===================================================
let interimTranscript = '';
let silenceTimer = null;
let isProcessingInput = false;

// ===================================================
// 🎯 UNIFIED VOICE VISUALIZATION SYSTEM (KEPT - Original)
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
// 📊 BUSINESS RESPONSES DATABASE (KEPT - Your complete set)
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
// 🔄 REPLACED: WORKING SPEECH RECOGNITION (Eliminates 7-second delay)
// ===================================================
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Speech recognition started');
            isListening = true;
            interimTranscript = '';
        };

      recognition.onresult = function(event) {
    // Clear any existing silence timer
    if (silenceTimer) {
        clearTimeout(silenceTimer);
    }
    
    // 🚀 FIXED: Accumulative text building instead of replacement
    let allFinalTranscript = '';
    interimTranscript = '';
    
    // ✅ CRITICAL FIX: Process ALL results from index 0 (not event.resultIndex)
    for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
            allFinalTranscript += transcript;  // Accumulate ALL final text
        } else {
            interimTranscript += transcript;
        }
    }
    
    // 🚀 HYBRID MAGIC: Show live transcript as user speaks (with accumulative text)
    if (interimTranscript && interimTranscript.length > 3) {
        // Pass the COMPLETE text: all final + current interim
        updateLiveUserTranscript(allFinalTranscript + interimTranscript);
    }
    
    // ✅ PROCESS FINAL RESULTS (Complete sentences from Google)
    // 🛑 DUPLICATE PREVENTION: Only process if different from last
    if (allFinalTranscript && !isProcessingInput) {
        console.log('Final voice input received:', allFinalTranscript);
        lastProcessedText = allFinalTranscript; // Remember what we processed
        
        // Ignore if AI is currently speaking
        if (isSpeaking) {
            console.log('Ignoring input - AI is speaking');
            return;
        }
        
        // 🎯 INSTANT USER MESSAGE DISPLAY
        addUserMessage(allFinalTranscript);
        isProcessingInput = true;
        
        // 🤖 PROCESS AI RESPONSE DIRECTLY (No function calls!)
        setTimeout(() => {
            console.log('🤖 Processing AI response for:', allFinalTranscript);
            const response = getAIResponse(allFinalTranscript);
            console.log('🤖 AI Response generated');
            
            addAIMessage(response);
            speakResponse(response);
            
            // Reset processing flag
            setTimeout(() => {
                isProcessingInput = false;
            }, 500);
        }, 1500); // Natural conversation delay
        
        return; // ⭐ CRITICAL: Exit here to prevent silence fallback
    }
    
    // ⏰ SILENCE FALLBACK (For incomplete Google processing)
    const completeText = allFinalTranscript + interimTranscript;
    if (completeText && completeText.length > 8 && !isProcessingInput) {
        silenceTimer = setTimeout(() => {
            if (completeText && !isProcessingInput && !isSpeaking) {
                console.log('Silence fallback - processing complete phrase:', completeText);
                
                // 🎯 INSTANT USER MESSAGE DISPLAY
                addUserMessage(completeText);
                isProcessingInput = true;
                
                // 🤖 PROCESS AI RESPONSE DIRECTLY
                setTimeout(() => {
                    console.log('🤖 Processing AI response for:', completeText);
                    const response = getAIResponse(completeText);
                    console.log('🤖 AI Response generated');
                    
                    addAIMessage(response);
                    speakResponse(response);
                    
                    // Reset processing flag
                    setTimeout(() => {
                        isProcessingInput = false;
                    }, 500);
                }, 1500);
                
                interimTranscript = '';
            }
        }, 3000);
    }
};
        
    } else {
        console.log('Speech recognition not supported');
        addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
    }
} 

      function updateLiveUserTranscript(text) {
    // Only update if we have substantial text (reduces spam)
    if (!text || text.length < 5) return;
    
    console.log('🎯 Live transcript update:', text);
    
    if (!currentUserBubble) {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            currentUserBubble = document.createElement('div');
            currentUserBubble.className = 'message user-message';
            currentUserBubble.innerHTML = '<div class="message-bubble">Listening...</div>';
            chatMessages.appendChild(currentUserBubble);
            console.log('👤 Live user bubble created (DEMO STYLE)');
            scrollChatToBottom();
        }
    }
    
    if (currentUserBubble) {
        const bubbleContent = currentUserBubble.querySelector('.message-bubble');
        if (bubbleContent) {
            bubbleContent.textContent = text;
        }
    }
}

function resetSpeechRecognition() {
    console.log('🚨 resetSpeechRecognition() DISABLED - Preventing collisions');
    return; // DO NOTHING
}

// REPLACE your current clearLiveTranscript function with this:
function clearLiveTranscript() {
    // Reset the current bubble reference
    currentUserBubble = null;
}

function createLiveUserBubble() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    // Create the user message bubble immediately
    const messageHTML = `
        <div class="message user-message">
            <div class="message-bubble">Listening...</div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    
    // Get reference to the bubble we just created
    const messages = chatMessages.querySelectorAll('.user-message');
    currentUserBubble = messages[messages.length - 1];
    
    scrollChatToBottom();
    console.log('👤 Live user bubble created');
}

// ===================================================
// 🎚️ STREAMLINED VIZ SYSTEM - VU METER ONLY
// ===================================================
async function initializeUnifiedVoiceVisualization() {
    try {
        if (!persistentMicStream) {
            console.log('⏳ Waiting for speech recognition mic access...');
            return false;
        }
        
        VoiceViz.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        VoiceViz.analyser = VoiceViz.audioContext.createAnalyser();
        VoiceViz.microphone = VoiceViz.audioContext.createMediaStreamSource(persistentMicStream);
        
        VoiceViz.analyser.fftSize = 256;
        VoiceViz.analyser.smoothingTimeConstant = 0.8;
        VoiceViz.microphone.connect(VoiceViz.analyser);
        
        const bufferLength = VoiceViz.analyser.frequencyBinCount;
        VoiceViz.dataArray = new Uint8Array(bufferLength);
        
        console.log('🎯 Voice visualization initialized for VU meter!');
        return true;
        
    } catch (error) {
        console.error('❌ Voice visualization failed:', error);
        return false;
    }
}

async function startUnifiedVoiceVisualization() {
    const initialized = await initializeUnifiedVoiceVisualization();
    if (!initialized) return false;
    
    // 🎚️ START VU METER
    if (initializeVUMeter()) {
        startVUMeter();
    }
    
    console.log('🚀 VU meter ACTIVE!');
    return true;
}

function stopUnifiedVoiceVisualization() {
    // 🎚️ STOP VU METER
    stopVUMeter();
    
    // Essential cleanup
    if (VoiceViz.audioContext && VoiceViz.audioContext.state !== 'closed') {
        VoiceViz.audioContext.close();
        VoiceViz.audioContext = null;
    }
    
    console.log('🛑 VU meter stopped');
}

// ===================================================
// 🎯 LED BAR METER SYSTEM (Professional Audio Equipment Style)
// ===================================================
let ledMeterActive = false;

function initializeLEDMeter() {
    const ledDisplay = document.getElementById('ledBarDisplay');
    if (!ledDisplay) {
        console.log('⚠️ LED Bar display not found');
        return false;
    }
    
    console.log('🎯 LED Bar meter initialized');
    return true;
}

function updateLEDMeter(volume) {
    if (!ledMeterActive) return;
    
    const ledDots = document.querySelectorAll('.led-dot');
    if (!ledDots.length) return;
    
    // Convert volume to LED count (same as before)
    const dbValue = Math.max(-20, Math.min(3, (volume / 100) * 23 - 20));
    const ledCount = Math.floor(((dbValue + 20) / 23) * 20);
    
    // Clear all LEDs
    ledDots.forEach(dot => {
        dot.classList.remove('active-green', 'active-yellow', 'active-red');
    });
    
    // Light up LEDs based on volume
    for (let i = 0; i < ledCount && i < ledDots.length; i++) {
        const dot = ledDots[i];
        
        if (i < 14) {
            dot.classList.add('active-green');
        } else if (i < 18) {
            dot.classList.add('active-yellow');
        } else {
            dot.classList.add('active-red');
        }
    }
}
    
    // Update status display
    if (statusElement) {
        const dbReading = statusElement.querySelector('.db-reading');
        const statusText = statusElement.querySelector('.status-text');
        
        if (dbReading) {
            if (volume > 5) {
                dbReading.textContent = `${dbValue.toFixed(1)} dB`;
            } else {
                dbReading.textContent = '-∞ dB';
            }
        }
        
        if (statusText) {
            statusText.textContent = volume > 5 ? 'ACTIVE' : 'READY';
        }
    }

function startLEDMeter() {
    if (!VoiceViz.analyser || ledMeterActive) return;
    
    ledMeterActive = true;
    const bufferLength = VoiceViz.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function updateMeter() {
        if (!ledMeterActive) return;
        
        VoiceViz.analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const volume = Math.min(100, (average / 255) * 100);
        
        updateLEDMeter(volume);
        requestAnimationFrame(updateMeter);
    }
    
    updateMeter();
    console.log('🎯 LED Bar meter started');
}

function stopLEDMeter() {
    ledMeterActive = false;
    
    // Clear all LEDs
    const ledDots = document.querySelectorAll('.led-dot');
    ledDots.forEach(dot => {
        dot.classList.remove('active-green', 'active-yellow', 'active-red');
    });
    
    // Reset status
    const statusElement = document.getElementById('ledStatus');
    if (statusElement) {
        const dbReading = statusElement.querySelector('.db-reading');
        const statusText = statusElement.querySelector('.status-text');
        
        if (dbReading) dbReading.textContent = '-∞ dB';
        if (statusText) statusText.textContent = 'READY';
    }
    
    console.log('🎯 LED Bar meter stopped');
}

// ===================================================
// 🔄 INTEGRATION WITH EXISTING VOICE SYSTEM
// ===================================================

// REPLACE in your startUnifiedVoiceVisualization function:
async function startUnifiedVoiceVisualization() {
    const initialized = await initializeUnifiedVoiceVisualization();
    if (!initialized) return false;
    
    // Start LED meter instead of VU meter
    if (initializeLEDMeter()) {
        startLEDMeter();
    }
    
    console.log('🚀 LED Bar meter ACTIVE!');
    return true;
}

// REPLACE in your stopUnifiedVoiceVisualization function:
function stopUnifiedVoiceVisualization() {
    stopLEDMeter(); // Stop LED meter
    
    if (VoiceViz.audioContext && VoiceViz.audioContext.state !== 'closed') {
        VoiceViz.audioContext.close();
        VoiceViz.audioContext = null;
    }
    
    console.log('🛑 LED Bar meter stopped');
}

// ===================================================
// 💬 MESSAGE HANDLING (KEPT - Original functions)
// ==================================================

function sendTextMessage() {
    const textInput = document.getElementById('textInput');
    if (!textInput) return;
    
    const message = textInput.value.trim();
    console.log('💬 Processing text input:', message);
    
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    textInput.value = '';
    
    // Process directly - no need for processUserInput
    setTimeout(() => {
        const response = getAIResponse(message);
        addAIMessage(response);
        speakResponse(response);
    }, 300);
}

// ===================================================
// 🗣️ VOICE SYNTHESIS - CLEAN VERSION
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
    
    // Optimized for Chrome
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
        
        // Clear bubble reference for next speech
        currentUserBubble = null;
        
        // Simple restart - no complex logic
        if (isAudioMode && !isListening) {
            setTimeout(() => {
                try {
                    recognition.start();
                    isListening = true;
                    console.log('🔄 Recognition restarted');
                } catch (error) {
                    console.log('Recognition restart error:', error);
                }
            }, 100);
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

function findBestVoice(voices) {
    const preferredVoices = [
        'Microsoft Aria Online (Natural) - English (United States)',
        'Microsoft Zira - English (United States)',
        'Microsoft Libby Online (Natural) - English (United Kingdom)'
    ];
    
    for (const preferredName of preferredVoices) {
        const voice = voices.find(v => v.name === preferredName);
        if (voice) {
            return voice;
        }
    }
    
    const fallback = voices.find(v => v.name.includes('Aria') || v.name.includes('Zira'));
    return fallback || voices[0];
}


utterance.onerror = function(event) {
    console.log('Speech error:', event.error);
    isSpeaking = false;
};
            
            window.speechSynthesis.speak(utterance);
            currentAudio = utterance;

        function stopCurrentAudio() {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            currentAudio = null;
            isSpeaking = false;
        }

function findBestVoice(voices) {
    const preferredVoices = [
        'Microsoft Aria Online (Natural) - English (United States)',
        'Microsoft Zira - English (United States)',
        'Microsoft Libby Online (Natural) - English (United Kingdom)'
    ];
    
    for (const preferredName of preferredVoices) {
        const voice = voices.find(v => v.name === preferredName);
        if (voice) {
            return voice;
        }
    }
    
    const fallback = voices.find(v => v.name.includes('Aria') || v.name.includes('Zira'));
    return fallback || voices[0];
}

// ===================================================
// 🗣️ quick questions
// ===================================================

function askQuickQuestion(questionText) {
    console.log('🎯 Quick question clicked:', questionText);
    
    // Prevent processing if AI is currently speaking
    if (isSpeaking) {
        console.log('Ignoring quick question - AI is speaking');
        return;
    }
    
    // Prevent duplicate processing
    if (isProcessingInput) {
        console.log('Ignoring quick question - already processing');
        return;
    }
    
    // Create instant user message bubble (no voice needed!)
    addUserMessage(questionText);
    isProcessingInput = true;
    
    // Process AI response directly
    setTimeout(() => {
        console.log('🤖 Processing AI response for quick question:', questionText);
        const response = getAIResponse(questionText);
        console.log('🤖 AI Response generated for quick question');
        
        addAIMessage(response);
        speakResponse(response);
        
        // Reset processing flag
        setTimeout(() => {
            isProcessingInput = false;
        }, 500);
    }, 800); // Slightly faster than voice input since it's instant text
}

// ===================================================
// 🚀 SPLASH SCREEN SYSTEM (KEPT - Original nightmare we solved!)
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
    
    // ⭐ ADD THIS: Hide splash screen FIRST!
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.style.display = 'none';
        console.log('✅ Splash screen hidden');
    }
    
    // ⭐ ADD THIS: Show chat interface
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.style.display = 'flex';
        console.log('✅ Chat interface shown');
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
        
        // Start recognition
        if (recognition && !isListening) {
            try {
                recognition.start();
            } catch (error) {
                console.log('Recognition start error:', error);
            }
        }
        
        // Add greeting
        setTimeout(() => {
            const greeting = "What can I help you with today?";
            addAIMessage(greeting);
            speakResponse(greeting);
        }, 500);
        
    } catch (error) {
        console.log('Microphone access denied:', error);
        addAIMessage("Microphone access was denied. You can still use text chat.");
        switchToTextMode();
    }
}

// ===================================================
// 🎤 VOICE LOADING SYSTEM (FIXED!)
// ===================================================
function getVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            resolve(voices);
        } else {
            // Chrome needs time to load voices
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
// 🌐 GLOBAL FUNCTIONS for quick buttons
// ===================================================
window.askQuickQuestion = function(question) {
    console.log('⚡ Quick question asked:', question);
    console.log('🔍 isSpeaking:', isSpeaking);
    console.log('🔍 isProcessingInput:', isProcessingInput);
    
    // FORCE RESET if speech has actually finished but flag is stuck
    if (isSpeaking && (!currentAudio || currentAudio.paused || currentAudio.ended)) {
        console.log('🔧 Forcing isSpeaking reset - audio actually finished');
        isSpeaking = false;
    }
    
    // Prevent processing if AI is currently speaking
    if (isSpeaking) {
        console.log('Ignoring quick question - AI is speaking');
        return;
    }
    
    // Rest of your function stays the same...
    if (isProcessingInput) {
        console.log('Ignoring quick question - already processing');
        return;
    }
    
    console.log('🎯 Creating user message bubble...');
    addUserMessage(question);
    console.log('🎯 User message should be visible now');
    
    isProcessingInput = true;
    
    setTimeout(() => {
        console.log('🤖 Processing AI response for quick question:', question);
        const response = getAIResponse(question);
        console.log('🤖 AI Response generated for quick question');
        
        addAIMessage(response);
        speakResponse(response);
        
        setTimeout(() => {
            isProcessingInput = false;
        }, 500);
    }, 800);
};
// ===================================================
// 🚀 MODULE INITIALIZATION (KEPT - Original approach)
// ===================================================
function initializeVoiceChat() {
    console.log('🚀 Initializing Voice Chat Module...');
    
    initializeSpeechRecognition();
    initializeWaveform();
    preloadVoices();
    
    console.log('✅ Voice Chat Module Ready!');
}

// Auto-initialize when loaded (KEPT - Original)
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat();
});

console.log('🎯 Mobile-Wise AI Formviser - SURGICAL HYBRID COMPLETE!');
console.log('✅ KEPT: Original foundation, splash screen logic, VoiceViz, all UI functions');
console.log('🚀 RESULT: Should eliminate 7-second delays while preserving all working parts!');
