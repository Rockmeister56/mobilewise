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
// window.adjustVoiceSpeed = adjustVoiceSpeed;
window.activateMicrophone = activateMicrophone;
window.switchToAudioMode = switchToAudioMode;
window.muteAIVoice = muteAIVoice;
window.sendTextMessage = sendTextMessage;

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
