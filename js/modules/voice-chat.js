// ===================================================
// 🎯 MOBILE-WISE AI FORMVISER - VOICE CHAT MODULE
// HYBRID VERSION - INSTANT RESPONSE + ALL FUNCTIONS
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

// ===================================================
// 🎤 MICROPHONE ACTIVATION (MOVED UP TO FIX REFERENCE ERROR)
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
        
        showSpeedControls();
        
    } catch (error) {
        console.log('❌ Microphone access denied:', error);
        if (activateBtn) {
            activateBtn.textContent = '🎤 Activate Microphone';
            activateBtn.disabled = false;
        }
        addAIMessage("No problem! You can still chat with me using text. What can I help you with?");
        return;
    }
    
    await startUnifiedVoiceVisualization();
    isAudioMode = true;
    
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
    
    setTimeout(() => {
        const greeting = "Perfect! Voice chat is now active, what can I help you with today?";
        addAIMessage(greeting);
        speakResponse(greeting);
    }, 800);
}


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
// 📚 KNOWLEDGE BASE INTEGRATION
// ===================================================
function initializeKnowledgeBase() {
    if (typeof practiceKnowledge !== 'undefined') {
        console.log('📚 Knowledge base loaded successfully');
    } else {
        console.log('⚠️ Knowledge base files not loaded');
    }
}

// ===================================================
// 🎤 SPEECH RECOGNITION - ZERO DELAY VERSION
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
                }, 500); // REDUCED from 1000ms
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
                }, 1000);
            }
        };
    } else {
        console.log('❌ Speech recognition not supported in this browser');
    }
}

// ===================================================
// 🎛️ WAVEFORM VISUALIZATION (CONTINUED)
// ===================================================
function animateWaveform() {
    if (!VoiceViz.waveformActive || !VoiceViz.analyser) return;
    
    VoiceViz.animationId = requestAnimationFrame(animateWaveform);
    VoiceViz.analyser.getByteFrequencyData(VoiceViz.dataArray);
    
    VoiceViz.canvasCtx.fillStyle = '#1a1a1a';
    VoiceViz.canvasCtx.fillRect(0, 0, VoiceViz.canvas.width, VoiceViz.canvas.height);
    
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
// 🎤 VOICE METER (CONTINUED)
// ===================================================
function updateVoiceMeterDisplay(volume) {
    const staticText = document.getElementById('staticListeningText');
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
// 🎯 UNIFIED VOICE SYSTEM (CONTINUED)
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
        
        const waveformContainer = document.getElementById('voiceVisualizerContainer');
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
    
    const waveformContainer = document.getElementById('voiceVisualizerContainer');
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
// 🌐 GLOBAL FUNCTIONS (CONTINUED)
// ===================================================
function startVoiceChat() {
    console.log('🎤 startVoiceChat() called from splash screen');
    
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.style.display = 'none';
    }
    
    const chatInterface = document.getElementById('chatInterface');
    if (chatInterface) {
        chatInterface.style.display = 'flex';
    }
    
    activateMicrophone();
}

window.startVoiceChat = startVoiceChat;
window.askQuickQuestion = function(question) {
    console.log('⚡ Quick question asked:', question);
    addUserMessage(question);
    processUserInput(question);
};
// window.switchToTextMode = switchToTextMode;
window.adjustVoiceSpeed = adjustVoiceSpeed;
window.activateMicrophone = activateMicrophone;
window.switchToAudioMode = switchToAudioMode;
window.muteAIVoice = muteAIVoice;
// window.sendTextMessage = sendTextMessage;

// Missing function stubs to prevent errors
function showSpeedControls() {
    const speedContainer = document.getElementById('speedControlsContainer');
    if (speedContainer) speedContainer.style.display = 'flex';
}

function showAudioMode() {
    const audioControls = document.getElementById('audioControls');
    const textControls = document.getElementById('textControls');
    
    if (audioControls) audioControls.style.display = 'flex';
    if (textControls) textControls.style.display = 'none';
}

function updateHeaderBanner(message) {
    const headerTitle = document.getElementById('chatHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = message;
    }
}

// ===================================================
// 🎛️ WAVEFORM VISUALIZATION SYSTEM
// ===================================================
function initializeWaveform() {
    VoiceViz.canvas = document.getElementById('voiceWaveform');
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
    
    // Clear canvas with dark background
    VoiceViz.canvasCtx.fillStyle = '#1a1a1a';
    VoiceViz.canvasCtx.fillRect(0, 0, VoiceViz.canvas.width, VoiceViz.canvas.height);
    
    // Draw waveform bars
    const barWidth = (VoiceViz.canvas.width / VoiceViz.dataArray.length) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < VoiceViz.dataArray.length; i++) {
        barHeight = (VoiceViz.dataArray[i] / 255) * VoiceViz.canvas.height;
        
        // Create gradient effect
        const gradient = VoiceViz.canvasCtx.createLinearGradient(0, VoiceViz.canvas.height - barHeight, 0, VoiceViz.canvas.height);
        gradient.addColorStop(0, '#00ff88');
        gradient.addColorStop(1, '#0066cc');
        
        VoiceViz.canvasCtx.fillStyle = gradient;
        VoiceViz.canvasCtx.fillRect(x, VoiceViz.canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}

// ===================================================
// 🎯 UNIFIED VOICE VISUALIZATION SYSTEM
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
        
        const waveformContainer = document.getElementById('voiceVisualizerContainer');
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
    
    const waveformContainer = document.getElementById('voiceVisualizerContainer');
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
// 🎤 VOICE METER FUNCTIONS
// ===================================================
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

function updateVoiceMeterDisplay(volume) {
    const staticText = document.getElementById('staticListeningText');
    if (!staticText) return;
    
    if (volume > 5) {
        const bars = Math.floor(volume / 10);
        const meterHTML = '🎤 ' + '█'.repeat(Math.max(1, bars)) + '░'.repeat(10 - bars);
        staticText.innerHTML = `${meterHTML} Speaking...`;
    } else {
        staticText.innerHTML = '🎤 Listening... What can I help you with?';
    }
}

// ===================================================
// 🇬🇧 SPECIALIZED BRITISH VOICE EMPIRE SYSTEM
// ===================================================
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
        (voice.name.includes('English') || voice.name.includes('US') || 
         voice.name.includes('UK') || voice.name.includes('Aria') || 
         voice.name.includes('Zira') || voice.name.includes('Libby'))
    );
    
    console.log(`✅ Filtered to ${englishVoices.length} English voices (from ${allVoices.length} total)`);
    return englishVoices.slice(0, 10); // Max 10 English voices
}

// 🇬🇧 BRITISH FEMALE PRIORITY VOICE SELECTOR - EMPIRE GRADE!
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

// 🇬🇧 BRITISH VOICE DEBUGGING SYSTEM
function logBritishVoices(voices) {
    console.log('🔍 SEARCHING FOR BRITISH VOICES...');
    voices.forEach(voice => {
        if (voice.lang.includes('GB') || voice.name.toLowerCase().includes('british') || 
            voice.name.toLowerCase().includes('hazel') || voice.name.toLowerCase().includes('susan')) {
            console.log('🇬🇧 BRITISH VOICE FOUND:', voice.name, '-', voice.lang);
        }
    });
}


// ===================================================
// 🎤 MODE SWITCHING FUNCTIONS
// ===================================================
function switchToAudioMode() {
    console.log('🎤 User switched back to audio mode');
    
    isAudioMode = true;
    showSpeedControls();
    showAudioMode();
    
    // Show voice visualizer container
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceContainer) voiceContainer.style.display = 'flex';
    
    // Start voice visualization
    startUnifiedVoiceVisualization();
    
    updateHeaderBanner('🎤 Voice Chat Restored - AI is listening...');
    
    // AI greeting and restart recognition
    setTimeout(() => {
        const greeting = "What can I help you with?";
        addAIMessage(greeting);
        speakResponse(greeting);
        
        // Restart speech recognition
        if (recognition && !isListening) {
            try {
                recognition.start();
                isListening = true;
                console.log('🔄 Recognition restarted');
            } catch (error) {
                console.log('⚠️ Recognition restart failed:', error);
            }
        }
    }, 500);
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
    
    // Hide speed controls
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
    
    updateHeaderBanner('💬 Text Chat Mode - Type your message below');
}

function showTextMode() {
    const audioControls = document.getElementById('audioControls');
    const textControls = document.getElementById('textControls');
    
    if (audioControls) audioControls.style.display = 'none';
    if (textControls) textControls.style.display = 'flex';
}

function hideSpeedControls() {
    const speedContainer = document.getElementById('speedControlsContainer');
    if (speedContainer) speedContainer.style.display = 'none';
}

// ===================================================
// 🔇 MUTE/AUDIO CONTROL FUNCTIONS
// ===================================================
function muteAIVoice() {
    console.log('🔇 MUTING AI Voice...');
    
    // Stop any current speech
    stopCurrentAudio();
    
    // Reset speaking flags
    isSpeaking = false;
    
    // Update header
    updateHeaderBanner('🔇 AI Voice Muted');
    
    // Switch to text mode automatically
    switchToTextMode();
    
    console.log('✅ AI Voice MUTED - switched to text mode');
}

function stopCurrentAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('🛑 Speech synthesis stopped');
    }
    
    if (currentAudio) {
        currentAudio = null;
        console.log('🛑 Current audio cleared');
    }
    
    isSpeaking = false;
}

// ===================================================
// ⚡ VOICE SPEED CONTROL
// ===================================================
function adjustVoiceSpeed(direction) {
    if (direction === 'faster' && currentSpeedIndex < speedLevels.length - 1) {
        currentSpeedIndex++;
    } else if (direction === 'slower' && currentSpeedIndex > 0) {
        currentSpeedIndex--;
    }
    
    voiceSpeed = speedLevels[currentSpeedIndex];
    const speedName = speedNames[currentSpeedIndex];
    
    // Update display
    const speedDisplay = document.getElementById('speedDisplay');
    if (speedDisplay) {
        speedDisplay.textContent = speedName;
    }
    
    console.log('⚡ Voice speed:', speedName, `(${voiceSpeed}x)`);
    
    // Test the new speed
    testVoiceSpeed();
}

function testVoiceSpeed() {
    const testMessage = `Speed set to ${speedNames[currentSpeedIndex]}`;
    const voices = window.speechSynthesis.getVoices();
    
    const utterance = new SpeechSynthesisUtterance(testMessage);
    utterance.rate = voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    window.speechSynthesis.speak(utterance);
}


// ===================================================
// 🚀 MODULE INITIALIZATION (FINAL)
// ===================================================
function initializeVoiceChat() {
    console.log('🚀 Initializing Voice Chat Module...');
    
    setTimeout(() => {
        initializeSpeechRecognition();
        initializeWaveform();
        preloadVoices();
        initializeKnowledgeBase();
        
        const chatInterface = document.getElementById('chatInterface');
        if (chatInterface) chatInterface.style.display = 'flex';
        
        const activateBtn = document.getElementById('activateMicButton');
        if (activateBtn) {
            activateBtn.style.display = 'block';
            activateBtn.disabled = false;
            activateBtn.textContent = '🎤 Activate Microphone';
        }
        
        const audioControls = document.getElementById('audioControls');
        if (audioControls) audioControls.style.display = 'flex';
        
        hideSpeedControls();
        
        const stopBtn = document.getElementById('audioOffBtn');
        if (stopBtn) stopBtn.style.display = 'none';
        
        addAIMessage("Welcome! Click 'Activate Microphone' below to enable voice chat.");
        
        console.log('✅ Voice Chat Module Ready - WAITING for user interaction');
        
    }, 100);
}

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat();
});

console.log('🎯 Mobile-Wise AI Formviser Voice Chat Module Loaded - HYBRID COMPLETE!');
