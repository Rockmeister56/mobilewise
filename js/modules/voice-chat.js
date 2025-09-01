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

// Voice speed control (Preserved from our work)
let voiceSpeed = 1.0;
const speedLevels = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
const speedNames = ['Very Slow', 'Slow', 'Relaxed', 'Normal', 'Fast', 'Faster', 'Very Fast'];
let currentSpeedIndex = 3; // Start at "Normal" (1.0)

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
// 📊 BUSINESS RESPONSES DATABASE (Preserved)
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
        
        // ❌ REMOVE ANY OF THESE IF THEY EXIST:
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
            if (event.results.length > 0) {
                const latestResult = event.results[event.results.length - 1];
                const transcript = latestResult[0].transcript.trim();
                
                if (latestResult.isFinal || latestResult[0].confidence > 0.7) {
                    console.log('🗣️ Voice input received:', transcript);
                    
                    if (isSpeaking) {
                        console.log('⏸️ Ignoring input - AI is speaking');
                        return;
                    }
                    
                    if (transcript && transcript.length > 0) {
                        handleVoiceInput(transcript);
                    }
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
            
            if (isAudioMode && micPermissionGranted) {
                setTimeout(() => {
                    if (!isListening) {
                        try {
                            recognition.start();
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
// 💬 MESSAGE HANDLING (Fixed to match your HTML)
// ===================================================
function handleVoiceInput(transcript) {
    console.log('🗣️ Processing voice input:', transcript);
    addUserMessage(transcript);
    processUserInput(transcript);
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
    if (currentAudio) {
        stopCurrentAudio();
    }
    
    setTimeout(() => {
        const response = getAIResponse(message);
        console.log('🤖 AI Response generated');
        addAIMessage(response);
        speakResponse(response);
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
    
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
    }
    
    stopUnifiedVoiceVisualization();
    showTextMode();
    
    const textInput = document.getElementById('textInput'); // MATCHES YOUR HTML!
    if (textInput) {
        setTimeout(() => textInput.focus(), 100);
    }
}

function switchToAudioMode() {
    console.log('🎤 User switched back to audio mode');
    
    isAudioMode = true;
    showAudioMode();
    startUnifiedVoiceVisualization();
    
    setTimeout(() => {
        addAIMessage("What can I help you with?");
        speakResponse("What can I help you with?");
        
        if (recognition && !isListening) {
            try {
                recognition.start();
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
// 🧠 AI RESPONSE GENERATION (Preserved)
// ===================================================
function getAIResponse(message) {
    const msg = message.toLowerCase();
    
    for (const [key, value] of Object.entries(businessResponses)) {
        if (msg.includes(key)) {
            return value;
        }
    }
    
    return "Great question! I can help with accounting services, marketing strategies, business growth, pricing, and more. What specific area would you like to explore?";
}

// ===================================================
// 🗣️ VOICE SYNTHESIS (All speed control preserved)
// ===================================================
async function speakResponse(message) {
    console.log('🗣️ Speaking response...');
    updateHeaderBanner('🤖 AI responding...');
    
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    const voices = await getVoices();
    speakWithVoice(message, voices);
}

function getVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            resolve(voices);
            return;
        }
        
        const voicesChangedHandler = () => {
            voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
                resolve(voices);
            }
        };
        
        window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
        
        setTimeout(() => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
        }, 1000);
    });
}

function speakWithVoice(message, voices) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    let bestVoice = findBestVoice(voices);
    if (bestVoice) {
        utterance.voice = bestVoice;
        console.log('🎤 Selected voice:', bestVoice.name);
    }
    
    utterance.rate = voiceSpeed; // Preserved speed control
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
        isSpeaking = true;
        console.log('🗣️ Speech started - blocking mic restarts');
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        currentAudio = null;
        console.log('✅ Speech finished - mic restarts allowed');
        updateHeaderBanner('🎤 AI is listening...');
    };
    
    currentAudio = utterance;
    window.speechSynthesis.speak(utterance);
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
// ⚡ SPEED CONTROL (All preserved from our session)
// ===================================================
function adjustVoiceSpeed(direction) {
    if (direction === 'faster' && currentSpeedIndex < speedLevels.length - 1) {
        currentSpeedIndex++;
    } else if (direction === 'slower' && currentSpeedIndex > 0) {
        currentSpeedIndex--;
    }
    
    voiceSpeed = speedLevels[currentSpeedIndex];
    const speedName = speedNames[currentSpeedIndex];
    
    const speedDisplay = document.getElementById('speedDisplay'); // MATCHES YOUR HTML!
    if (speedDisplay) {
        speedDisplay.textContent = speedName;
    }
    
    console.log('⚡ Voice speed:', speedName, `(${voiceSpeed}x)`);
    testVoiceSpeed();
}

function testVoiceSpeed() {
    const testMessage = `Speed set to ${speedNames[currentSpeedIndex]}`;
    const voices = window.speechSynthesis.getVoices();
    const voice = findBestVoice(voices);
    
    const utterance = new SpeechSynthesisUtterance(testMessage);
    if (voice) utterance.voice = voice;
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    window.speechSynthesis.speak(utterance);
}

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
    getVoices().then(voices => {
        console.log('🎤 Voices preloaded:', voices.length);
    });
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
    
    // Hide splash screen if it exists
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) splashScreen.style.display = 'none';
    
    // Show chat interface
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) chatInterface.style.display = 'flex';
    
    await startUnifiedVoiceVisualization();
    
    isAudioMode = true;
    micPermissionGranted = true;
    
    if (recognition && !isListening) {
        try {
            recognition.start();
            console.log('🎤 Speech recognition started');
        } catch (error) {
            console.log('⚠️ Recognition start failed:', error);
        }
    }
    
    showAudioMode();
    updateHeaderBanner('🎤 Microphone Active - How can we help your business?');
    
    // AI introduces system
    setTimeout(() => {
        const greeting = "Great! Voice chat is now active. I can help with accounting services, marketing strategies, and business growth. What can I help you with?";
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
window.reinitiateAudio = reinitiateAudio;
window.muteAIVoice = muteAIVoice;

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
