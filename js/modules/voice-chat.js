// ===================================================
// 🎯 MOBILE-WISE AI FORMVISER - VOICE CHAT MODULE
// HTML-MATCHED | PRESERVES ALL 3-HOUR FIXES
// ===================================================

// ===================================================
// 🏗️ GLOBAL VARIABLES (All preserved from our session)
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

// ===================================================
// 🎯 UNIFIED VOICE VISUALIZATION SYSTEM (Preserved)
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
// 📊 BUSINESS RESPONSES DATABASE (Required for getAIResponse)
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
// 📚 KNOWLEDGE BASE INTEGRATION SYSTEM
// ===================================================
function initializeKnowledgeBase() {
    // This will be called after external knowledge base files load
    if (typeof practiceKnowledge !== 'undefined') {
        console.log('📚 Knowledge base loaded successfully');
    } else {
        console.log('⚠️ Knowledge base files not loaded');
    }
}

// Call this in your initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat();
    initializeKnowledgeBase(); // Add this line
});

const practiceKnowledge = {
    // Your knowledge base will load here from external files
    // This integrates with the knowledge-base files you mentioned
};

function startVoiceChat() {
    console.log('🎤 startVoiceChat() called from splash screen');
    
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
    
    // Call the existing activation function
    activateMicrophone();
}

// MAKE IT GLOBALLY AVAILABLE
window.startVoiceChat = startVoiceChat;

// ==========================================
// 🎯 ENHANCED INITIALIZE VOICE CHAT
// ==========================================
function initializeVoiceChat() {
    console.log('🚀 Initializing Voice Chat Module...');
    
    setTimeout(() => {
        initializeSpeechRecognition(); // Setup only, don't start
        initializeWaveform();
        preloadVoices();
        
        // SHOW INTERFACE - NO AUTOMATIC ACTIVATION
        const chatInterface = document.getElementById('chatInterface');
        if (chatInterface) chatInterface.style.display = 'flex';
        
        // SHOW ACTIVATE BUTTON ONLY
        const activateBtn = document.getElementById('activateMicButton');
        if (activateBtn) {
            activateBtn.style.display = 'block';
            activateBtn.disabled = false;
            activateBtn.textContent = '🎤 Activate Microphone';
            
            // ADD SPLASH REMOVAL TO CLICK HANDLER
            activateBtn.addEventListener('click', () => {
                removeSplashScreen(); // Remove splash when user clicks
            });
        }
        
        const audioControls = document.getElementById('audioControls');
        if (audioControls) audioControls.style.display = 'flex';
        
        // HIDE EVERYTHING ELSE
        const speedContainer = document.getElementById('speedControlsContainer');
        if (speedContainer) speedContainer.style.display = 'none';
        
        const stopBtn = document.getElementById('audioOffBtn');
        if (stopBtn) stopBtn.style.display = 'none';
        
        // WELCOME MESSAGE ONLY
        addAIMessage("Welcome! Click 'Activate Microphone' below to enable voice chat.");
        
        console.log('✅ Voice Chat Module Ready - WAITING for user click');
        
        // ✅ CONFIRMED REMOVED - NO AUTO-ACTIVATION GHOSTS:
        // startUnifiedVoiceVisualization();
        // swapToStopButton();
        // navigator.mediaDevices.getUserMedia();
        // recognition.start();
        
    }, 100);
}


function showActivateMicButton() {
    const activateBtn = document.getElementById('activateMicButton');
    const audioControls = document.getElementById('audioControls');
    
    if (activateBtn) activateBtn.style.display = 'block';
    if (audioControls) audioControls.style.display = 'flex';
    
    console.log('✅ Activate Microphone button shown');
}

function hideSpeedControls() {
    const speedContainer = document.getElementById('speedControlsContainer');
    if (speedContainer) speedContainer.style.display = 'none';
    console.log('✅ Speed controls hidden');
}

function hideStopButton() {
    const stopBtn = document.getElementById('audioOffBtn');
    if (stopBtn) stopBtn.style.display = 'none';
    console.log('✅ Stop button hidden');
}

// ===================================================
// 🎤 SPEECH RECOGNITION (All fixes preserved)
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
    const lastResult = event.results[event.results.length - 1];
    
    if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim();
        console.log('🗣️ FINAL Voice input:', transcript);
        
        if (isSpeaking) {
            console.log('⏸️ Ignoring - AI is speaking');
            return;
        }
        
        if (transcript && transcript.length > 2) {
            // 🚀 INSTANT MESSAGE DISPLAY - RIGHT HERE IN SPEECH RECOGNITION!
            addUserMessage(transcript);
            
            // 🔥 STOP ALL AUDIO IMMEDIATELY
            window.speechSynthesis.cancel();
            currentAudio = null;
            isSpeaking = false;
            
            // Process AI response after brief delay
            setTimeout(() => {
                processUserInput(transcript);
            }, 300);
        }
    }
};
        recognition.onend = function() {
            console.log('🎤 Speech recognition ended');
            isListening = false;
            
            // Gentle restart (preserved from our 3-hour session)
            if (isAudioMode && micPermissionGranted && !isSpeaking) {
                setTimeout(() => {
                    if (!isListening && !isSpeaking && isAudioMode) {
                        try {
                            // Line 238 - COMMENT OUT:
// recognition.start();
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
            
            if (isAudioMode && micPermissionGranted) {
                setTimeout(() => {
                    if (!isListening) {
                        try {
                            // Line 262 - COMMENT OUT:
// recognition.start();
                        } catch (error) {
                            console.log('⚠️ Recognition restart failed:', error);
                        }
                    }
                }, 1000);
            }
        };
        
        console.log('✅ Speech recognition initialized');
    } else {
        console.log('❌ Speech recognition not supported');
    }
}

// ===================================================
// 🎛️ WAVEFORM VISUALIZATION (Preserved from our work)
// ===================================================
function initializeWaveform() {
    VoiceViz.canvas = document.getElementById('voiceWaveform'); // MATCHES YOUR HTML!
    if (!VoiceViz.canvas) {
        console.log('⚠️ Waveform canvas not found');
        return false;
    }
    
    VoiceViz.canvasCtx = VoiceViz.canvas.getContext('2d');
    console.log('🎛️ Waveform canvas initialized');
    return true;
}

function animateWaveform() {
    if (!VoiceViz.waveformActive || !VoiceViz.analyser) return;
    
    VoiceViz.animationId = requestAnimationFrame(animateWaveform);
    
    VoiceViz.analyser.getByteFrequencyData(VoiceViz.dataArray);
    
    // Clear canvas
    VoiceViz.canvasCtx.fillStyle = '#1a1a1a';
    VoiceViz.canvasCtx.fillRect(0, 0, VoiceViz.canvas.width, VoiceViz.canvas.height);
    
    // Draw waveform (preserved styling)
    const barWidth = (VoiceViz.canvas.width / VoiceViz.dataArray.length) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < VoiceViz.dataArray.length; i++) {
        barHeight = (VoiceViz.dataArray[i] / 255) * VoiceViz.canvas.height;
        
        const gradient = VoiceViz.canvasCtx.createLinearGradient(0, VoiceViz.canvas.height - barHeight, 0, VoiceViz.canvas.height);
        gradient.addColorStop(0, '#00ff88');
        gradient.addColorStop(1, '#0066cc');
        
        VoiceViz.canvasCtx.fillStyle = gradient;
        VoiceViz.canvasCtx.fillRect(x, VoiceViz.canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}

// ===================================================
// 🎤 VOICE METER (Fixed to match your HTML structure)
// ===================================================
function updateVoiceMeterDisplay(volume) {
    const staticText = document.getElementById('staticListeningText'); // MATCHES YOUR HTML!
    if (!staticText) return;
    
    if (volume > 5) {
        const bars = Math.floor(volume / 10);
        const meterHTML = '🎤 ' + '█'.repeat(Math.max(1, bars)) + '░'.repeat(10 - bars);
        staticText.innerHTML = `${meterHTML} Speaking...`;
    } else {
        staticText.innerHTML = '🎤 Listening... What can I help you with?';
    }
}

function startVoiceMeter() {
    if (!VoiceViz.analyser || VoiceViz.meterActive) return;
    
    VoiceViz.meterActive = true;
    const bufferLength = VoiceViz.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function updateMeter() {
        if (!VoiceViz.meterActive) return;
        
        VoiceViz.analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const volume = Math.min(100, (average / 255) * 100);
        
        updateVoiceMeterDisplay(volume);
        requestAnimationFrame(updateMeter);
    }
    
    updateMeter();
}

function stopVoiceMeter() {
    VoiceViz.meterActive = false;
}

// ===================================================
// 🎯 UNIFIED VOICE SYSTEM (Preserved logic)
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
        
        console.log('🎯 Unified voice visualization initialized!');
        return true;
        
    } catch (error) {
        console.error('❌ Voice visualization failed:', error);
        return false;
    }
}

async function startUnifiedVoiceVisualization() {
    const initialized = await initializeUnifiedVoiceVisualization();
    if (!initialized) return false;
    
    startVoiceMeter();
    
    if (initializeWaveform()) {
        VoiceViz.waveformActive = true;
        
        const waveformContainer = document.getElementById('voiceVisualizerContainer'); // MATCHES YOUR HTML!
        if (waveformContainer) {
            waveformContainer.classList.add('waveform-active');
        }
        
        animateWaveform();
        console.log('🎛️ Waveform visualization started');
    }
    
    console.log('🚀 Unified voice visualization ACTIVE!');
    return true;
}

function stopUnifiedVoiceVisualization() {
    stopVoiceMeter();
    
    VoiceViz.waveformActive = false;
    if (VoiceViz.animationId) {
        cancelAnimationFrame(VoiceViz.animationId);
        VoiceViz.animationId = null;
    }
    
    const waveformContainer = document.getElementById('voiceVisualizerContainer'); // MATCHES YOUR HTML!
    if (waveformContainer) {
        waveformContainer.classList.remove('waveform-active');
    }
    
    if (VoiceViz.audioContext && VoiceViz.audioContext.state !== 'closed') {
        VoiceViz.audioContext.close();
        VoiceViz.audioContext = null;
    }
    
    console.log('🛑 Unified voice visualization stopped');
}

// ===================================================
// 🎯 PROCESS USER INPUT - INSTANT RESPONSE SYSTEM
// ===================================================
function processUserInput(message) {
    console.log('🔥 Processing user input:', message);
    
    // 🔥 PREVENT DOUBLE PROCESSING
    if (isProcessingResponse) {
        console.log('🚫 Already processing response, ignoring');
        return;
    }
    
    isProcessingResponse = true;
    
    // Stop any current audio
    if (currentAudio) {
        stopCurrentAudio();
    }
    
    // 🚀 INSTANT AI RESPONSE GENERATION
    const response = getAIResponse(message);
    console.log('🤖 AI Response generated instantly');
    
    // 🚀 IMMEDIATE MESSAGE DISPLAY - NO DELAY!
    addAIMessage(response);
    
    // Only delay the SPEECH slightly for natural flow
    setTimeout(() => {
        speakResponse(response);
    }, 200); // Minimal delay just for natural timing
    
    // Reset processing flag
    setTimeout(() => {
        isProcessingResponse = false;
    }, 500);
}

// ===================================================
// 💬 ENHANCED MESSAGE HANDLING (Echo Prevention)
// ===================================================
function handleVoiceInput(transcript) {
    const now = Date.now();
    
    // 🔥 PREVENT DUPLICATES: Ignore if same input within 2 seconds
    if (transcript === lastProcessedInput && (now - lastProcessedTime) < 2000) {
        console.log('🚫 Duplicate input ignored:', transcript);
        return;
    }
    
    lastProcessedInput = transcript;
    lastProcessedTime = now;
    
    console.log('🗣️ Processing unique voice input:', transcript);
    
    // 🚀 IMMEDIATE MESSAGE DISPLAY - No delays!
    addUserMessage(transcript);
    
    // 🔥 FORCE STOP ALL AUDIO
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    currentAudio = null;
    isSpeaking = false;
    
    // Process with minimal delay
    setTimeout(() => {
        processUserInput(transcript);
    }, 200);
}

function sendTextMessage() {
    const textInput = document.getElementById('textInput'); // MATCHES YOUR HTML!
    if (!textInput) return;
    
    const message = textInput.value.trim();
    console.log('💬 Processing text input:', message);
    
    if (!message) return;
    
    addUserMessage(message);
    textInput.value = '';
    processUserInput(message);
}

function processUserInput(message) {
    // 🔥 PREVENT DOUBLE PROCESSING
    if (isProcessingResponse) {
        console.log('🚫 Already processing response, ignoring');
        return;
    }
    
    isProcessingResponse = true;
    
    if (currentAudio) {
        stopCurrentAudio();
    }
    
    setTimeout(() => {
        const response = getAIResponse(message);
        console.log('🤖 AI Response generated');
        addAIMessage(response);
        speakResponse(response);
        
        // Reset flag after processing
        setTimeout(() => {
            isProcessingResponse = false;
        }, 1000);
    }, 800);
}

// ===================================================
// 🎤 MODE SWITCHING (Fixed to match your HTML)
// ===================================================
function showAudioMode() {
    console.log('🎤 Switching to audio mode...');
    const audioControls = document.getElementById('audioControls'); // MATCHES YOUR HTML!
    const textControls = document.getElementById('textControls');   // MATCHES YOUR HTML!
    
    if (audioControls) audioControls.style.display = 'flex';
    if (textControls) textControls.style.display = 'none';
    
    const voiceContainer = document.getElementById('voiceVisualizerContainer'); // MATCHES YOUR HTML!
    if (voiceContainer) voiceContainer.style.display = 'flex';
}

function showTextMode() {
    console.log('💬 Switching to text mode...');
    const audioControls = document.getElementById('audioControls'); // MATCHES YOUR HTML!
    const textControls = document.getElementById('textControls');   // MATCHES YOUR HTML!
    
    if (audioControls) audioControls.style.display = 'none';
    if (textControls) textControls.style.display = 'flex';
    
    const voiceContainer = document.getElementById('voiceVisualizerContainer'); // MATCHES YOUR HTML!
    if (voiceContainer) voiceContainer.style.display = 'none';
}

function switchToTextMode() {
    console.log('📝 User switched to text mode');
    
    isAudioMode = false;
    
    // Stop recognition
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
    }
    
    // Stop all voice visualization
    stopUnifiedVoiceVisualization();
    
    // Hide speed controls - THIS WAS MISSING!
    hideSpeedControls();
    
    // Show text interface
    showTextMode();
    
    // Hide voice visualizer container
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceContainer) voiceContainer.style.display = 'none';
    
    // Focus text input
    const textInput = document.getElementById('textInput');
    if (textInput) {
        setTimeout(() => textInput.focus(), 100);
    }
    
    // Update header
    updateHeaderBanner('💬 Text Chat Mode - Type your message below');
}

function switchToAudioMode() {
    console.log('🎤 User switched back to audio mode');
    
    isAudioMode = true;
    
    // Show speed controls - THIS WAS MISSING!
    showSpeedControls();
    
    // Show audio interface
    showAudioMode();
    
    // Show voice visualizer container
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceContainer) voiceContainer.style.display = 'flex';
    
    // Start voice visualization
    startUnifiedVoiceVisualization();
    
    // Update header
    updateHeaderBanner('🎤 Voice Chat Restored - AI is listening...');
    
    // AI greeting and restart recognition
    setTimeout(() => {
        const greeting = "What can I help you with?";
        addAIMessage(greeting);
        speakResponse(greeting);
        
        // Restart speech recognition
        if (recognition && !isListening) {
            try {
                // Line 645 - COMMENT OUT:
// recognition.start();
                console.log('🔄 Recognition restarted');
            } catch (error) {
                console.log('⚠️ Recognition restart failed:', error);
            }
        }
    }, 500);
}

// ===================================================
// 💬 MESSAGE DISPLAY (Fixed to match your HTML)
// ===================================================
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages'); // MATCHES YOUR HTML!
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
    const chatMessages = document.getElementById('chatMessages'); // MATCHES YOUR HTML!
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
    const chatMessages = document.getElementById('chatMessages'); // MATCHES YOUR HTML!
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ===================================================
// 🧠 AI RESPONSE Enhanced
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
// 🎤 UNIVERSAL VOICE SYSTEM - BRITISH FEMALE PRIORITY
// ===================================================

// Voice speed control variables (DO NOT REMOVE!)
let voiceSpeed = 1.0;
const speedLevels = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
const speedNames = ['Very Slow', 'Slow', 'Relaxed', 'Normal', 'Fast', 'Faster', 'Very Fast'];
let currentSpeedIndex = 3; // Start at "Normal" (1.0)

// 🚀 OPTIMIZED VOICE LOADING (No more 350 voices!)
function getOptimizedVoices() {
    return new Promise((resolve) => {
        console.log('🔍 Loading optimized voices...');
        
        let voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            const filteredVoices = filterToEnglishVoices(voices);
            resolve(filteredVoices);
            return;
        }
        
        // Wait for voices to load (but with timeout)
        const voicesChangedHandler = () => {
            voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
                const filteredVoices = filterToEnglishVoices(voices);
                resolve(filteredVoices);
            }
        };
        
        window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
        
        // Timeout after 3 seconds
        setTimeout(() => {
            voices = window.speechSynthesis.getVoices();
            const filteredVoices = filterToEnglishVoices(voices);
            resolve(filteredVoices);
        }, 3000);
    });
}

// 🎯 SMART VOICE FILTERING (Only English voices!)
function filterToEnglishVoices(allVoices) {
    const englishVoices = allVoices.filter(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('English') || voice.name.includes('US') || voice.name.includes('UK') || voice.name.includes('Aria') || voice.name.includes('Zira') || voice.name.includes('Libby'))
    );
    
    console.log(`✅ Filtered to ${englishVoices.length} English voices (from ${allVoices.length} total)`);
    return englishVoices.slice(0, 10); // Max 10 English voices
}

// 🇬🇧 BRITISH FEMALE PRIORITY VOICE SELECTOR
function findUniversalBestVoice(voices) {
    console.log('🔍 Searching for best voice...');
    
    // 🎯 PRIORITY 1: British Female (Your preferred choice!)
    const britishFemale = voices.find(v => 
        v.name.includes('UK English Female') || 
        v.name.includes('Google UK English Female')
    );
    if (britishFemale) {
        console.log('🇬🇧 BRITISH FEMALE SELECTED:', britishFemale.name);
        return britishFemale;
    }
    
    // 🎯 PRIORITY 2: British Male (backup)
    const britishMale = voices.find(v => 
        v.name.includes('UK English Male') || 
        v.name.includes('Google UK English Male')
    );
    if (britishMale) {
        console.log('🇬🇧 BRITISH MALE SELECTED:', britishMale.name);
        return britishMale;
    }
    
    // 🎯 PRIORITY 3: Microsoft British voices
    const microsoftLibby = voices.find(v => 
        v.name.includes('Libby') && v.name.includes('United Kingdom')
    );
    if (microsoftLibby) {
        console.log('🇬🇧 MICROSOFT LIBBY SELECTED:', microsoftLibby.name);
        return microsoftLibby;
    }
    
    // 🎯 PRIORITY 4: High-quality US voices (fallback)
    const preferredUSVoices = [
        'Microsoft Aria Online (Natural) - English (United States)',
        'Microsoft Jenny Online (Natural) - English (United States)',
        'Microsoft Zira - English (United States)',
        'Google US English'
    ];
    
    for (const preferredName of preferredUSVoices) {
        const voice = voices.find(v => v.name === preferredName);
        if (voice) {
            console.log('🇺🇸 US VOICE SELECTED:', voice.name);
            return voice;
        }
    }
    
    // Final fallback
    console.log('⚠️ Using fallback voice:', voices[0]?.name || 'default');
    return voices[0];
}

// 🚀 MAIN SPEECH FUNCTION
async function speakResponse(message) {
    console.log('🗣️ Speaking response...');
    
    // 🔥 NUCLEAR OPTION - Kill everything first!
    window.speechSynthesis.cancel();
    currentAudio = null;
    
    // Brief pause to ensure cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
    
    updateHeaderBanner('🤖 AI responding...');
    
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    const voices = await getOptimizedVoices();
    
    // 🎯 SINGLE VOICE EXECUTION
    const utterance = new SpeechSynthesisUtterance(message);
    
    let bestVoice = findUniversalBestVoice(voices);
    if (bestVoice) {
        utterance.voice = bestVoice;
        console.log('🎤 SINGLE VOICE SELECTED:', bestVoice.name);
    }
    
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = () => {
        isSpeaking = true;
        console.log('🗣️ SINGLE speech started');
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        currentAudio = null;
        console.log('✅ SINGLE speech finished');
        updateHeaderBanner('🎤 AI is listening...');
    };
    
    utterance.onerror = (event) => {
        console.log('❌ Speech error:', event.error);
        isSpeaking = false;
        currentAudio = null;
    };
    
    currentAudio = utterance;
    window.speechSynthesis.speak(utterance);
}

// 🎤 VOICE SYNTHESIS WITH BRITISH PRIORITY
function speakWithVoice(message, voices) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    let bestVoice = findUniversalBestVoice(voices);
    if (bestVoice) {
        utterance.voice = bestVoice;
        console.log('🎤 Using voice:', bestVoice.name);
    }
    
    // Optimized settings for British female voice
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.9; // Slightly louder for clarity
    
    utterance.onstart = () => {
        isSpeaking = true;
        console.log('🗣️ Speech started');
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        currentAudio = null;
        console.log('✅ Speech finished');
        updateHeaderBanner('🎤 AI is listening...');
    };
    
    utterance.onerror = (event) => {
        console.log('❌ Speech error:', event.error);
        isSpeaking = false;
        currentAudio = null;
    };
    
    currentAudio = utterance;
    window.speechSynthesis.speak(utterance);
}

// ===================================================
// ⚡ VOICE SPEED CONTROL SYSTEM (Preserved)
// ===================================================
function adjustVoiceSpeed(direction) {
    if (direction === 'faster' && currentSpeedIndex < speedLevels.length - 1) {
        currentSpeedIndex++;
    } else if (direction === 'slower' && currentSpeedIndex > 0) {
        currentSpeedIndex--;
    }
    
    voiceSpeed = speedLevels[currentSpeedIndex];
    const speedName = speedNames[currentSpeedIndex];
    
    const speedDisplay = document.getElementById('speedDisplay');
    if (speedDisplay) {
        speedDisplay.textContent = speedName;
    }
    
    console.log('⚡ Voice speed:', speedName, `(${voiceSpeed}x)`);
    testVoiceSpeed();
}

function testVoiceSpeed() {
    const testMessage = `Speed set to ${speedNames[currentSpeedIndex]}`;
    const voices = window.speechSynthesis.getVoices();
    const voice = findUniversalBestVoice(voices);
    
    const utterance = new SpeechSynthesisUtterance(testMessage);
    if (voice) utterance.voice = voice;
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    window.speechSynthesis.speak(utterance);
}

// ===================================================
// 🛠️ UTILITY FUNCTIONS (Preserved)
// ===================================================
function stopCurrentAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('🛑 Speech stopped');
    }
    currentAudio = null;
    isSpeaking = false;
}

function muteAIVoice() {
    console.log('🔇 MUTING AI Voice...');
    stopCurrentAudio();
    isSpeaking = false;
    updateHeaderBanner('🔇 AI Voice Muted');
    switchToTextMode();
    console.log('✅ AI Voice MUTED');
}

function preloadVoices() {
    getOptimizedVoices().then(voices => {
        console.log('🎤 Optimized voices loaded:', voices.length);
        console.log('🇬🇧 AVAILABLE BRITISH VOICES:');
        
        const britishVoices = voices.filter(v => 
            v.name.includes('UK') || 
            v.name.includes('British') || 
            v.name.includes('Libby')
        );
        
        britishVoices.forEach((voice, i) => {
            console.log(`👑 ${voice.name} (${voice.lang})`);
        });
        
        if (britishVoices.length === 0) {
            console.log('⚠️ No British voices found - using US voices');
        }
    });
}

// 🎯 VOICE TESTER FUNCTION (Now properly defined!)
async function testAllVoices() {
    console.log('🎤 STARTING VOICE TESTER...');
    
    const voices = await getOptimizedVoices();
    console.log(`🔍 Testing ${voices.length} voices:`);
    
    for (let i = 0; i < Math.min(voices.length, 5); i++) {
        const voice = voices[i];
        console.log(`${i + 1}. 🎤 ${voice.name} (${voice.lang})`);
        
        const testMessage = `Voice ${i + 1}: Hello, I'm ${voice.name.split(' ')[0]}. How do I sound?`;
        const utterance = new SpeechSynthesisUtterance(testMessage);
        utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.volume = 0.9;
        
        window.speechSynthesis.speak(utterance);
        
        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 4000));
    }
    
    console.log('✅ Voice testing complete!');
}

// Make it globally available
window.testAllVoices = testAllVoices;


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

function muteAIVoice() {
    console.log('🔇 MUTING AI Voice...');
    stopCurrentAudio();
    isSpeaking = false;
    updateHeaderBanner('🔇 AI Voice Muted');
    switchToTextMode();
    console.log('✅ AI Voice MUTED');
}

function preloadVoices() {
    getOptimizedVoices().then(voices => {
        console.log('🎤 Optimized voices loaded:', voices.length);
        console.log('🇬🇧 AVAILABLE BRITISH VOICES:');
        
        const britishVoices = voices.filter(v => 
            v.name.includes('UK') || 
            v.name.includes('British') || 
            v.name.includes('Libby')
        );
        
        britishVoices.forEach((voice, i) => {
            console.log(`👑 ${voice.name} (${voice.lang})`);
        });
        
        if (britishVoices.length === 0) {
            console.log('⚠️ No British voices found - using US voices');
        }
    });
}

function debugBritishVoices() {
    const voices = window.speechSynthesis.getVoices();
    const britishVoices = voices.filter(v => 
        v.lang.includes('GB') || 
        v.name.toLowerCase().includes('uk') ||
        v.name.toLowerCase().includes('british') ||
        v.name.toLowerCase().includes('libby')
    );
    
    console.log('🇬🇧 AVAILABLE BRITISH VOICES:');
    britishVoices.forEach((voice, index) => {
        console.log(`👑 ${voice.name} (${voice.lang})`);
    });
    
    if (britishVoices.length === 0) {
        console.log('❌ No British voices found - check system voices');
    }
}


// ===================================================
// 🎯 UTILITY FUNCTIONS (Fixed for your HTML)
// ===================================================
function updateHeaderBanner(message) {
    const headerTitle = document.getElementById('chatHeaderTitle'); // MATCHES YOUR HTML!
    if (headerTitle) {
        headerTitle.textContent = message;
        console.log('📱 Header banner updated:', message);
    }
}

function hideSpeedControls() {
    const slowerBtn = document.querySelector('[onclick*="slower"]');
    const normalBtn = document.querySelector('[onclick*="normal"]'); 
    const fasterBtn = document.querySelector('[onclick*="faster"]');
    
    if (slowerBtn) slowerBtn.style.display = 'none';
    if (normalBtn) normalBtn.style.display = 'none';
    if (fasterBtn) fasterBtn.style.display = 'none';
    
    console.log('⚡ Speed buttons hidden');
}

// ===================================================
// 🎤 MICROPHONE ACTIVATION (With Button Swap Logic!)
// ===================================================
async function activateMicrophone() {
    console.log('🎤 User clicked ACTIVATE MICROPHONE button...');

    // STEP 1: Show loading state on activate button
    const activateBtn = document.getElementById('activateMicButton');
    if (activateBtn) {
        activateBtn.textContent = '🎤 Requesting permission...';
        activateBtn.disabled = true;
    }

    try {
        persistentMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('🎤 Microphone access granted!');
        micPermissionGranted = true;
        
        // STEP 2: SWAP BUTTONS AND SHOW SPEED CONTROLS
        swapToActiveMode(); // Updated function name
        
    } catch (error) {
        console.log('❌ Microphone access denied:', error);
        
        // STEP 3: Reset button on error
        if (activateBtn) {
            activateBtn.textContent = '🎤 Activate Microphone';
            activateBtn.disabled = false;
        }
        
        // Show fallback message
        addAIMessage("No problem! You can still chat with me using text. What can I help you with?");
        return;
    }
    
    // // Hide splash screen if it exists
// const splashScreen = document.getElementById('splashScreen');
// if (splashScreen) splashScreen.style.display = 'none';
    
    // Show chat interface
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) chatInterface.style.display = 'flex';
    
    await startUnifiedVoiceVisualization();
    
    isAudioMode = true;
    micPermissionGranted = true;
    
    if (recognition && !isListening) {
        try {
            // Line 1165 - COMMENT OUT:
// recognition.start();
            console.log('🎤 Speech recognition started');
        } catch (error) {
            console.log('⚠️ Recognition start failed:', error);
        }
    }
    
    showAudioMode();
    updateHeaderBanner('🎤 Microphone Active - How can we help your business?');
    
    // AI introduces system
    setTimeout(() => {
        const greeting = "Perfect! Voice chat is now active, what can I help you with today?";
        addAIMessage(greeting);
        speakResponse(greeting);
        console.log('👋 AI introduction delivered');
    }, 1000);
}

// UPDATED FUNCTION: Complete mode swap with speed controls
function swapToActiveMode() {
    // Hide activate button
    const activateBtn = document.getElementById('activateMicButton');
    if (activateBtn) activateBtn.style.display = 'none';
    
    // Show stop button
    const stopBtn = document.getElementById('audioOffBtn');
    if (stopBtn) {
        stopBtn.style.display = 'block';
        stopBtn.textContent = '🛑 Stop';
    }
    
    // SHOW SPEED CONTROLS (This was missing!)
    const speedContainer = document.getElementById('speedControlsContainer');
    if (speedContainer) {
        speedContainer.style.display = 'flex';
        console.log('✅ Speed controls now visible');
    }
    
    console.log('🔄 Complete swap: Activate → Stop + Speed Controls');
}

function hideSpeedControls() {
    const speedContainer = document.getElementById('speedControlsContainer');
    if (speedContainer) {
        speedContainer.style.display = 'none';
        console.log('✅ Speed controls hidden');
    }
}

function showSpeedControls() {
    const speedContainer = document.getElementById('speedControlsContainer');
    if (speedContainer) {
        speedContainer.style.display = 'flex';
        console.log('✅ Speed controls shown');
    }
}

function swapToActiveMode() {
    // Hide activate button
    const activateBtn = document.getElementById('activateMicButton');
    if (activateBtn) activateBtn.style.display = 'none';
    
    // Show stop button
    const stopBtn = document.getElementById('audioOffBtn');
    if (stopBtn) {
        stopBtn.style.display = 'block';
        stopBtn.textContent = '🛑 Stop Audio';
    }
    
    // SHOW SPEED CONTROLS
    const speedContainer = document.getElementById('speedControlsContainer');
    if (speedContainer) {
        speedContainer.style.display = 'flex';
        console.log('✅ Speed controls now visible');
    }
    
    console.log('🔄 Complete swap: Activate → Stop + Speed Controls');
}


// INITIAL SETUP FUNCTIONS (add these if missing)
function hideSpeedControls() {
    const speedContainer = document.getElementById('speedControlsContainer');
    if (speedContainer) {
        speedContainer.style.display = 'none';
        console.log('✅ Speed controls hidden initially');
    }
}

function showActivateMicButton() {
    const activateBtn = document.getElementById('activateMicButton');
    const audioControls = document.getElementById('audioControls');
    
    if (activateBtn) activateBtn.style.display = 'block';
    if (audioControls) audioControls.style.display = 'flex';
    
    console.log('✅ Activate Microphone button shown');
}

function reinitiateAudio() {
    console.log('🔄 User requested audio reinitiation');
    activateMicrophone();
}
// ===================================================
// 🌐 GLOBAL FUNCTIONS (All preserved)
// ===================================================
window.askQuickQuestion = function(question) {
    console.log('⚡ Quick question asked:', question);
    addUserMessage(question);
    processUserInput(question);
};

window.sendTextMessage = sendTextMessage;
window.switchToTextMode = switchToTextMode;
window.adjustVoiceSpeed = adjustVoiceSpeed;
window.activateMicrophone = activateMicrophone;
window.reinitiateAudio = switchToAudioMode;
window.muteAIVoice = muteAIVoice;
window.switchToAudioMode = switchToAudioMode;

// ===================================================
// 🚀 MODULE INITIALIZATION (Auto-start, no splash!)
// ===================================================
function initializeVoiceChat() {
    console.log('🚀 Initializing Voice Chat Module...');
    
    setTimeout(() => {
        initializeSpeechRecognition();
        initializeWaveform();
        preloadVoices();
        
     // ✅ WAIT for user to click "Activate Microphone" button
console.log('✅ Voice Chat Module Ready - WAITING for user interaction');
        
        console.log('✅ Voice Chat Module Ready!');
    }, 100);
}

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat();
});

console.log('🎯 Mobile-Wise AI Formviser Voice Chat Module Loaded - HTML MATCHED!');
