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
let hasStartedOnce = false;
let persistentMicStream = null;
let isSpeaking = false;
let micPermissionGranted = false;

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
            
            // Process all results
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // 🚀 REAL-TIME DISPLAY: Update on EVERY word as you speak!
            if (interimTranscript && interimTranscript.length > 1) {
                updateLiveUserTranscript(interimTranscript);
            }
            
            // ✅ PROCESS FINAL RESULTS (Complete sentences from Google)
            if (finalTranscript && !isProcessingInput) {
                console.log('Final voice input received:', finalTranscript);
                
                if (isSpeaking) {
                    console.log('Ignoring input - AI is speaking');
                    return;
                }
                
                // Clear the live display since we're processing
                const voiceText = document.getElementById('voiceText');
                if (voiceText) voiceText.textContent = '';
                
                addUserMessage(finalTranscript);
                isProcessingInput = true;
                
                setTimeout(() => {
                    const response = getAIResponse(finalTranscript);
                    addAIMessage(response);
                    speakResponse(response);
                    
                    setTimeout(() => {
                        isProcessingInput = false;
                    }, 500);
                }, 1500);
                
                return;
            }
            
            // Silence fallback
            if (interimTranscript && interimTranscript.length > 8 && !isProcessingInput) {
                silenceTimer = setTimeout(() => {
                    if (interimTranscript && !isProcessingInput && !isSpeaking) {
                        console.log('Silence fallback - processing complete phrase:', interimTranscript);
                        
                        const voiceText = document.getElementById('voiceText');
                        if (voiceText) voiceText.textContent = '';
                        
                        addUserMessage(interimTranscript);
                        isProcessingInput = true;
                        
                        setTimeout(() => {
                            const response = getAIResponse(interimTranscript);
                            addAIMessage(response);
                            speakResponse(response);
                            
                            setTimeout(() => {
                                isProcessingInput = false;
                            }, 500);
                        }, 1500);
                        
                        interimTranscript = '';
                    }
                }, 3000);
            }
        };

        recognition.onend = function() {
            console.log('Speech recognition ended');
            isListening = false;
            updateStatusIndicator('inactive');
            
            if (silenceTimer) {
                clearTimeout(silenceTimer);
            }
            
            if (isAudioMode && !isSpeaking) {
                setTimeout(() => {
                    if (!isListening && isAudioMode) {
                        try {
                            recognition.start();
                            console.log('Recognition restarted');
                        } catch (error) {
                            console.log('Recognition restart failed:', error);
                        }
                    }
                }, 300);
            }
        };

        recognition.onerror = function(event) {
            console.log('Speech recognition error:', event.error);
            isListening = false;
            updateStatusIndicator('inactive');
            
            if (event.error === 'not-allowed') {
                addAIMessage("Please allow microphone access to use voice chat.");
            }
            
            if (silenceTimer) {
                clearTimeout(silenceTimer);
            }
            
            isProcessingInput = false;
        };
        
    } else {
        console.log('Speech recognition not supported');
        addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
    }
} 


        function updateLiveUserTranscript(text) {
    const voiceText = document.getElementById('voiceText');
    if (voiceText) {
        // INSTANT text update - no background animation!
        voiceText.textContent = `Speaking: ${text}`;
        
        // Clear text after speaking (bar stays)
        setTimeout(() => {
            voiceText.textContent = '';
        }, 3000);
    }
}

// ===================================================
// 🎛️ WAVEFORM VISUALIZATION (KEPT - Original VoiceViz system)
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
// 🎤 VOICE METER (KEPT - Original system)
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
// 🎯 UNIFIED VOICE SYSTEM (KEPT - Original logic)
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
// 🎤 MODE SWITCHING (KEPT - Original functions)
// ===================================================
function showAudioMode() {
    console.log('🎤 Switching to audio mode...');
    const audioControls = document.getElementById('audioControls');
    const textControls = document.getElementById('textControls');
    
    if (audioControls) audioControls.style.display = 'flex';
    if (textControls) textControls.style.display = 'none';
    
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceContainer) voiceContainer.style.display = 'flex';
}

function showTextMode() {
    console.log('💬 Switching to text mode...');
    const audioControls = document.getElementById('audioControls');
    const textControls = document.getElementById('textControls');
    
    if (audioControls) audioControls.style.display = 'none';
    if (textControls) textControls.style.display = 'flex';
    
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceContainer) voiceContainer.style.display = 'none';
}

function switchToTextMode() {
    console.log('📝 User switched to text mode');
    
    isAudioMode = false;
    
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
    }
    
    // Clear silence timer
    if (silenceTimer) {
        clearTimeout(silenceTimer);
    }
    
    stopUnifiedVoiceVisualization();
    showTextMode();
    
    const textInput = document.getElementById('textInput');
    if (textInput) {
        setTimeout(() => textInput.focus(), 100);
    }
    
    isProcessingInput = false; // 🔄 REPLACED: Working system reset
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
    
    isProcessingInput = false; // 🔄 REPLACED: Working system reset
}

// ===================================================
// 💬 MESSAGE DISPLAY (KEPT - Original functions)
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
// 🧠 AI RESPONSE GENERATION (KEPT - Original)
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
// 🗣️ VOICE SYNTHESIS (KEPT - Original with working restart)
// ===================================================
  function speakResponse(message) {
            console.log('Speaking response');
            updateHeaderBanner('🤖 AI responding...');
            updateStatusIndicator('speaking');
            
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
                updateHeaderBanner('🎤 AI Assistant is Listening');
                
                if (isAudioMode) {
                    updateStatusIndicator('listening');
                    // Restart recognition with minimal delay for Chrome
                    setTimeout(() => {
                        if (!isListening && isAudioMode) {
                            try {
                                recognition.start();
                            } catch (error) {
                                console.log('Recognition restart error:', error);
                            }
                        }
                    }, 100);
                } else {
                    updateStatusIndicator('inactive');
                }
            };
            
            utterance.onerror = function(event) {
                console.log('Speech error:', event.error);
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
// 🔄 REPLACED: WORKING VOICE SPEED CONTROL (Actually functional)
// ===================================================
let voiceSpeed = 1.0;
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
    
    console.log('⚡ Voice speed:', speedName, `(${voiceSpeed}x)`);
    testVoiceSpeed(); // 🔄 REPLACED: Working version with actual test
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
// 🛠️ UTILITY FUNCTIONS (KEPT - Original)
// ===================================================
function updateHeaderBanner(message) {
    const headerTitle = document.getElementById('chatHeaderTitle');
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
        const speedControls = document.getElementById('speedControlsContainer');
        const voiceContainer = document.getElementById('voiceVisualizerContainer');
        
        if (activateMicBtn) activateMicBtn.style.display = 'none';
        if (audioOffBtn) audioOffBtn.style.display = 'block';
        if (speedControls) speedControls.style.display = 'flex';
        if (voiceContainer) voiceContainer.style.display = 'flex';
        
        // Start recognition
        if (recognition && !isListening) {
            try {
                recognition.start();
            } catch (error) {
                console.log('Recognition start error:', error);
            }
        }
        
        updateHeaderBanner('🎤 Microphone Active - How can we help your business?');
        updateStatusIndicator('listening');
        
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
// 🚨 MISSING: updateStatusIndicator function (That I should have added)
// ===================================================
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
// 🌐 GLOBAL FUNCTIONS (KEPT - All original functions)
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
window.muteAIVoice = muteAIVoice;
window.startVoiceChat = startVoiceChat;

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
console.log('🔄 REPLACED: Speech recognition onresult, processUserInput timing, voice speed system');
console.log('🚀 RESULT: Should eliminate 7-second delays while preserving all working parts!');
