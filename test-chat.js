// ===========================================
// ELEVENLABS CONFIGURATION
// ===========================================
const ELEVENLABS_API_KEY = 'sk_9e7fa2741be74e8cc4af95744fe078712c1e8201cdcada93';
const VOICE_ID = 'zGjIP4SZlMnY9m93k97r';

// ===========================================
// GLOBAL VARIABLES
// ===========================================
let recognition = null;
let isListening = false;
let isAudioMode = false;
let currentAudio = null;
let hasStartedOnce = false; // 🔥 NEW: Track if we've started recognition
let persistentMicStream = null; // Holds the microphone permission
let isSpeaking = false; // Prevent recognition restarts during speech
let audioContext = null;
let analyser = null;
let microphone = null;
let voiceMeterActive = false;
let dataArray = null;
let animationId = null;
let canvas = null;
let canvasCtx = null;
let voiceSpeed = 0.9; // Default professional speed

// ===========================================
// BUSINESS RESPONSES DATABASE
// ===========================================
const businessResponses = {
    "business growth": "We help businesses grow through strategic marketing, lead generation, social media management, and comprehensive accounting services. What specific area interests you most?",
    "marketing services": "Our marketing services include: Social media management, Google Ads, SEO, content creation, email marketing, and brand development. We create custom strategies for each client!",
    "accounting": "Yes! We handle full bookkeeping, tax preparation, payroll processing, financial reporting, and business consulting. We make sure your finances are always in order.",
    "bookkeeping": "Absolutely! We provide monthly bookkeeping, expense tracking, invoice management, bank reconciliation, and detailed financial reports so you can focus on growing your business.",
    "pricing": "Our packages start at $297/month for basic accounting, and $497/month for marketing services. We also offer combined packages. Would you like a custom quote?",
    "taxes": "Yes, we handle all business tax preparation, quarterly filings, tax planning, and make sure you get every deduction you deserve!",
    "social media": "We manage Facebook, Instagram, LinkedIn, and Twitter. This includes content creation, posting schedules, engagement, and monthly analytics reports.",
    "seo": "Our SEO services include keyword research, on-page optimization, content strategy, local SEO, and monthly ranking reports to get you found on Google!",
    "google ads": "We create and manage Google Ads campaigns, including keyword research, ad creation, bid management, and detailed performance reporting.",
    "payroll": "Yes! We handle complete payroll processing, tax withholdings, direct deposits, quarterly reports, and year-end tax documents.",
    "financial reports": "We provide monthly profit & loss statements, balance sheets, cash flow reports, and custom dashboards so you always know where your business stands.",
    "hello": "Hello! How can I help grow your business today? I can assist with accounting, marketing, or any business questions!",
    "hi": "Hi there! What business challenges can I help you solve today?",
    "help": "I can help with accounting services, marketing strategies, business growth, pricing questions, and more. What would you like to know?",
    "cost": "Our services are very affordable! Basic accounting starts at $297/month, marketing at $497/month. Combined packages offer great savings. Want a custom quote?",
    "package": "We have Basic Accounting ($297/month), Full Marketing ($497/month), and Combined packages ($797/month). Each includes different services - which interests you most?"
};

// ===========================================
// 🔥 HOLD MIC OPEN (NO POPUPS)
// ===========================================
async function initializeMicrophonePermission() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('🎤 Mic permission GRANTED and HELD OPEN');
        micPermissionGranted = true;
        
        micStream.getTracks().forEach(track => {
            track.onended = () => {
                console.error('🚨 MIC TRACK ENDED!');
            };
        });
    } catch (error) {
        console.log('❌ Mic permission denied:', error);
        micPermissionGranted = false;
    }
}

// ===========================================
// INITIALIZATION
// ===========================================
function initializeWhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
}

function initialize() {
    console.log('🚀 Initializing NCI Business Chat...');
    
    setTimeout(() => {
        initializeSpeechRecognition();
        bindEventListeners();
        console.log('✅ NCI Business Chat Interface Ready!');
    }, 100);
}

function bindEventListeners() {
    console.log('🔧 Binding event listeners...');
    
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    const reinitiateAudioBtn = document.getElementById('reinitiateAudioBtn');
    const sendBtn = document.getElementById('sendBtn');
    const textInput = document.getElementById('textInput');
    
    console.log('🔍 Elements found:', {
        activateMicBtn: !!activateMicBtn,
        audioOffBtn: !!audioOffBtn,
        reinitiateAudioBtn: !!reinitiateAudioBtn,
        sendBtn: !!sendBtn,
        textInput: !!textInput
    });
    
    if (activateMicBtn) {
        activateMicBtn.addEventListener('click', activateMicrophone);
        console.log('✅ Activate mic button bound');
    }
    
    if (audioOffBtn) {
        audioOffBtn.addEventListener('click', switchToTextMode);
        console.log('✅ Audio off button bound');
    }
    
    if (reinitiateAudioBtn) {
        reinitiateAudioBtn.addEventListener('click', switchToAudioMode);
        console.log('✅ Reinitiate audio button bound');
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendTextMessage);
        console.log('✅ Send button bound');
    }
    
    if (textInput) {
        textInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendTextMessage();
            }
        });
        console.log('✅ Text input enter key bound');
    }
}

// ===========================================
// VOICE PRELOADER SYSTEM
// ===========================================
let voicesLoaded = false;
let voiceLoadPromise = null;

// Preload voices when page loads
function preloadVoices() {
    if (voiceLoadPromise) {
        return voiceLoadPromise; // Return existing promise
    }
    
    voiceLoadPromise = new Promise((resolve) => {
        console.log('🎵 Preloading voices...');
        
        function checkVoices() {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                voicesLoaded = true;
                console.log('✅ Voices loaded:', voices.length, 'available');
                resolve(voices);
                return true;
            }
            return false;
        }
        
        // Check immediately
        if (checkVoices()) return;
        
        // Listen for voices to load
        const voicesChangedHandler = () => {
            if (checkVoices()) {
                window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
            }
        };
        
        window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
        
        // Fallback timeout
        setTimeout(() => {
            const voices = window.speechSynthesis.getVoices();
            voicesLoaded = true;
            console.log('⚠️ Voice loading timeout - using available voices:', voices.length);
            resolve(voices);
        }, 2000);
    });
    
    return voiceLoadPromise;
}

// Enhanced speakWithVoice function with preloader check
async function speakWithVoice(message, voices) {
    console.log('🎵 speakWithVoice called with:', message);
    
    // Ensure voices are loaded
    if (!voicesLoaded) {
        console.log('⏳ Voices not loaded yet, waiting...');
        voices = await preloadVoices();
    }
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Find best voice
    let bestVoice = findBestVoice(voices);
    if (bestVoice) {
        utterance.voice = bestVoice;
        console.log('✅ Selected voice:', bestVoice.name);
    }
    
    // Use dynamic speed
    utterance.rate = voiceSpeed || 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Set speaking flags
    utterance.onstart = () => {
        isSpeaking = true;
        console.log('🎵 Speech started at speed:', utterance.rate);
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        currentAudio = null;
        console.log('✅ Speech finished');
        updateHeaderBanner('🔊 AI is listening...');
    };
    
    currentAudio = utterance;
    window.speechSynthesis.speak(utterance);
}

// Initialize voices when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing voice system...');
    preloadVoices();
});

// ===========================================
// 🔥 FIXED SPEECH RECOGNITION - NO MORE POPUPS
// ===========================================
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
            if (event.results.length > 0 && event.results[event.results.length - 1].isFinal) {
                const transcript = event.results[event.results.length - 1][0].transcript.trim();
                console.log('🎤 FINAL Voice input received:', transcript);
                
                // 🔥 DON'T STOP - JUST IGNORE WHILE AI IS SPEAKING
                if (isSpeaking) {
                    console.log('🚫 Ignoring input - AI is speaking');
                    return;
                }
                
                if (transcript && transcript.length > 0) {
                    handleVoiceInput(transcript);
                }
            }
        };

        recognition.onend = function() {
    console.log('🎤 Speech recognition ended unexpectedly');
    isListening = false;
    
    // 🔥 GENTLE RESTART - Only after AI finishes speaking
    if (isAudioMode && micPermissionGranted && !isSpeaking) {
        console.log('🔄 Gentle restart - waiting for AI to finish...');
        setTimeout(() => {
            if (!isListening && !isSpeaking && isAudioMode) {
                try {
                    recognition.start();
                    console.log('✅ Recognition gently restarted');
                } catch (error) {
                    console.log('⚠️ Gentle restart failed:', error.message);
                }
            }
        }, 1000); // Conservative 1-second delay
    }
};

        recognition.onerror = function(event) {
            console.log('🚫 Speech recognition error:', event.error);
            isListening = false;
            
            if (event.error === 'not-allowed') {
                console.log('❌ Microphone permission denied');
                micPermissionGranted = false;
                return;
            }
            
            // Restart on any other error
            if (isAudioMode && micPermissionGranted) {
                setTimeout(() => {
                    if (!isListening) {
                        recognition.start();
                    }
                }, 1000);
            }
        };
        
        console.log('✅ Speech recognition initialized with continuous mode');
    } else {
        console.log('❌ Speech recognition not supported');
    }
}

// ===================================================
// 🎛️ VOICE WAVEFORM VISUALIZATION SYSTEM
// ===================================================
function initializeWaveform() {
    canvas = document.getElementById('voiceWaveform');
    if (!canvas) return;
    
    canvasCtx = canvas.getContext('2d');
    console.log('🎛️ Waveform canvas initialized');
}

// Start the live waveform visualization
async function startWaveformVisualization() {
    try {
        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        // Configure analyser
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        microphone.connect(analyser);
        
        // Setup data array
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        console.log('🎛️ Waveform audio context started');
        
        // Show waveform, hide text
        document.getElementById('voiceVisualizerContainer').classList.add('waveform-active');
        
        // Start animation
        animateWaveform();
        
    } catch (error) {
        console.error('❌ Waveform initialization failed:', error);
    }
}

// Animate the waveform bars
function animateWaveform() {
    if (!analyser || !canvasCtx) return;
    
    animationId = requestAnimationFrame(animateWaveform);
    
    // Get frequency data
    analyser.getByteFrequencyData(dataArray);
    
    // Clear canvas
    canvasCtx.fillStyle = 'rgba(0,0,0,0.1)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw waveform bars
    const barWidth = canvas.width / dataArray.length * 2;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Create gradient based on intensity
        const intensity = dataArray[i] / 255;
        let color;
        
        if (intensity < 0.3) {
            color = `rgba(102, 255, 102, ${intensity + 0.3})`; // Green
        } else if (intensity < 0.7) {
            color = `rgba(255, 255, 102, ${intensity + 0.3})`; // Yellow
        } else {
            color = `rgba(255, 102, 102, ${intensity + 0.3})`; // Red
        }
        
        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}

// Stop waveform visualization
function stopWaveformVisualization() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
    }
    
    // Hide waveform, show text
    document.getElementById('voiceVisualizerContainer').classList.remove('waveform-active');
    
    console.log('🎛️ Waveform visualization stopped');
}


// ===========================================
// 🎤 SHARED VOICE METER SYSTEM
// ===========================================
async function initializeVoiceMeter() {
    // DON'T request new mic stream - use the one speech recognition already has
    try {
        // Wait for speech recognition to get permission first
        if (!persistentMicStream) {
            console.log('⏳ Waiting for speech recognition to get mic access...');
            return false;
        }
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(persistentMicStream);
        
        analyser.fftSize = 256;
        microphone.connect(analyser);
        
        console.log('🎤 Voice meter using SHARED mic stream - no extra permission!');
        return true;
    } catch (error) {
        console.log('❌ Voice meter failed:', error);
        return false;
    }
}

function startVoiceMeter() {
    if (!analyser || voiceMeterActive) return;
    
    voiceMeterActive = true;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function updateMeter() {
        if (!voiceMeterActive) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const volume = Math.min(100, (average / 255) * 100);
        
        // Update the voice meter visual
        updateVoiceMeterDisplay(volume);
        
        requestAnimationFrame(updateMeter);
    }
    
    updateMeter();
}

function updateVoiceMeterDisplay(volume) {
    const banner = document.querySelector('.voice-banner');
    if (!banner) return;
    
    if (volume > 5) { // Speaking detected
        // Create voice meter bars
        const bars = Math.floor(volume / 10);
        const meterHTML = '🎤 ' + '█'.repeat(Math.max(1, bars)) + '░'.repeat(10 - bars);
        banner.innerHTML = `<span class="listening-text">${meterHTML} Speaking...</span>`;
    } else {
        // Static listening state
        banner.innerHTML = '<span class="listening-text">🎤 Listening... What can I help you with?</span>';
    }
}

function stopVoiceMeter() {
    voiceMeterActive = false;
}

// ===========================================
// VOICE BANNER CONTROL
// ===========================================
function showVoiceBanner() {
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceContainer) {
        voiceContainer.style.display = 'flex';
        console.log('✅ Voice visualizer container shown');
    } else {
        console.log('❌ Voice visualizer container not found');
    }
}

// ===========================================
// MICROPHONE ACTIVATION
// ===========================================
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    // 🎛️ START WAVEFORM VISUALIZATION FIRST
    await startWaveformVisualization();
    
    // 🔥 START RECOGNITION FIRST - BEFORE ANY PERMISSION REQUESTS!
    isAudioMode = true;
    if (recognition && !isListening) {
        console.log('🎤 Starting recognition BEFORE any permission requests...');
        try {
            recognition.start(); // This will ask for permission once
        } catch (error) {
            console.log('❌ Recognition start failed:', error);
        }
    }
    
    // Switch interface immediately
    const splashScreen = document.getElementById('splashScreen');
    const chatInterface = document.getElementById('chatInterface');
    
    if (splashScreen) splashScreen.style.display = 'none';
    if (chatInterface) chatInterface.style.display = 'flex';
    
    console.log('✅ Interface switched to chat mode');
    
    // Set audio mode UI
    showAudioMode();
    updateHeaderBanner('🎤 Microphone Active - How can we help your business?');
    showVoiceBanner(); // This will show your new waveform container
    
    // Mark permission as granted (recognition.start() already asked for it)
    micPermissionGranted = true;
    
    // Add greeting
    setTimeout(() => {
        const greeting = "What can I help you with?";
        addAIMessage(greeting);
        speakResponse(greeting);
    }, 1000);
}

function stopPersistentMicrophone() {
    if (persistentMicStream) {
        persistentMicStream.getTracks().forEach(track => track.stop());
        persistentMicStream = null;
        console.log('🛑 Persistent microphone stream stopped');
    }
    
    // 🎛️ STOP WAVEFORM VISUALIZATION
    stopWaveformVisualization();
}

// ===========================================
// MODE SWITCHING
// ===========================================
function showAudioMode() {
    console.log('🔊 Switching to audio mode...');
    const audioControls = document.getElementById('audioControls');
    const textControls = document.getElementById('textControls');
    
    if (audioControls) audioControls.style.display = 'flex';
    if (textControls) textControls.style.display = 'none';
}

function showTextMode() {
    console.log('⌨️ Switching to text mode...');
    const audioControls = document.getElementById('audioControls');
    const textControls = document.getElementById('textControls');
    
    if (audioControls) audioControls.style.display = 'none';
    if (textControls) textControls.style.display = 'flex';
}

function switchToTextMode() {
    console.log('Switching to text mode...');
    currentMode = 'text';
    
    // Stop any current audio first
    stopCurrentAudio();
    
    // Hide speed controls when switching to text mode
    const speedControls = document.querySelector('.speed-controls');
    if (speedControls) {
        speedControls.style.display = 'none';
        console.log('🔇 Speed controls hidden');
    }
    
    // Hide voice banner and reset header
    hideVoiceBanner();
    
    // Reset header text to original state
    const headerTitle = document.querySelector('.header-title');
    const headerSubtitle = document.querySelector('.header-subtitle');
    
    if (headerTitle) {
        headerTitle.textContent = 'Mobile-Wise AI Assistant';
    }
    if (headerSubtitle) {
        headerSubtitle.textContent = 'Your intelligent form builder companion';
    }
    
    // Update send button for text mode
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendButton.onclick = sendMessage;
    }
    
    // Reset speaking flags
    isSpeaking = false;
    currentAudio = null;
    
    // Update header banner to indicate text mode
    updateHeaderBanner('💬 Text Chat Mode');
    
    console.log('✅ Switched to text mode - speed controls hidden, audio stopped');
}

function switchToAudioMode() {
    console.log('🎤 User switched back to audio mode');
    isAudioMode = true;
    showAudioMode();
    showVoiceBanner();

    // ===================================================
// 🎤 VOICE BANNER DISPLAY FUNCTIONS
// ===================================================
function showVoiceBanner() {
    console.log('🎤 Showing voice banner...');
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceContainer) {
        voiceContainer.style.display = 'flex';
        console.log('✅ Voice visualizer container shown');
    } else {
        console.log('❌ Voice visualizer container not found');
    }
}

function hideVoiceBanner() {
    console.log('🔽 Hiding voice banner...');
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceContainer) {
        voiceContainer.style.display = 'none';
        console.log('✅ Voice visualizer container hidden');
    }
}
    
    const textInput = document.getElementById('textInput');
    if (textInput) textInput.value = '';
    
    // ❌ COMMENTED OUT - THIS WAS CAUSING THE SECOND PERMISSION POPUP:
    // Only start if not already listening
    // if (micPermissionGranted && !isListening) {
    //     setTimeout(() => {
    //         startRecognitionOnce();
    //     }, 1000);
    // }
}


// ===========================================
// MESSAGE HANDLING
// ===========================================
function handleVoiceInput(transcript) {
    console.log('🗣️ Processing voice input:', transcript);
    addUserMessage(transcript);
    processUserInput(transcript);
}

function sendTextMessage() {
    const textInput = document.getElementById('textInput');
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
        console.log('🤖 AI Response:', response);
        addAIMessage(response);
        speakResponse(response);
    }, 800);
}

// ===========================================
// GLOBAL FUNCTIONS
// ===========================================
window.askQuickQuestion = function(question) {
    console.log('⚡ Quick question asked:', question);
    addUserMessage(question);
    processUserInput(question);
};

window.sendTextMessage = sendTextMessage;

// ===========================================
// MESSAGE DISPLAY
// ===========================================
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
    console.log('✅ User message added:', message);
}

function hideVoiceBanner() {
    console.log('Hiding voice banner...');
    const voiceVisualizerContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceVisualizerContainer) {
        voiceVisualizerContainer.style.display = 'none';
    }
}

function showVoiceBanner() {
    console.log('Showing voice banner...');
    const voiceVisualizerContainer = document.getElementById('voiceVisualizerContainer');
    if (voiceVisualizerContainer) {
        voiceVisualizerContainer.style.display = 'flex';
    }
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
    console.log('✅ AI message added:', message);
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ===========================================
// VOICE VISUALIZATION SYSTEM - RESTORE
// ===========================================

function createVoiceBars() {
    const container = document.getElementById('voiceVisualizerContainer');
    if (container) {
        container.innerHTML = `
            <div class="voice-bar" id="bar1"></div>
            <div class="voice-bar" id="bar2"></div>
            <div class="voice-bar" id="bar3"></div>
            <div class="voice-bar" id="bar4"></div>
            <div class="voice-bar" id="bar5"></div>
        `;
        container.style.display = 'flex';
        console.log('✅ Voice bars recreated!');
    }
}

function visualizeVoiceInput(audioLevel) {
    const bars = document.querySelectorAll('.voice-bar');
    const normalizedLevel = Math.min(audioLevel * 2, 1); // Amplify the visual
    
    bars.forEach((bar, index) => {
        const threshold = (index + 1) * 0.2; // Each bar has different threshold
        if (normalizedLevel > threshold) {
            bar.style.height = `${20 + (normalizedLevel * 30)}px`;
            bar.style.opacity = '1';
            bar.style.backgroundColor = '#4CAF50'; // Green when active
        } else {
            bar.style.height = '8px';
            bar.style.opacity = '0.3';
            bar.style.backgroundColor = '#666'; // Gray when inactive
        }
    });
}

function updateVoiceVisualizer() {
    // Animate bars even when not actively listening
    const bars = document.querySelectorAll('.voice-bar');
    bars.forEach((bar, index) => {
        const randomHeight = 8 + Math.random() * 15;
        bar.style.height = `${randomHeight}px`;
        bar.style.transition = 'all 0.3s ease';
    });
}

// Initialize voice bars
createVoiceBars();

// Start visualization loop
setInterval(updateVoiceVisualizer, 200);

// ===========================================
// AI RESPONSE GENERATION
// ===========================================
function getAIResponse(message) {
    const msg = message.toLowerCase();
    
    for (const [key, value] of Object.entries(businessResponses)) {
        if (msg.includes(key)) {
            return value;
        }
    }
    
    return "Great question! I can help with accounting services, marketing strategies, business growth, pricing, and more. What specific area would you like to explore?";
}

// ===========================================
// IMPROVED BROWSER VOICE SYNTHESIS
// ===========================================
async function speakResponse(message) {
    console.log('🎵 Speaking response:', message);
    updateHeaderBanner('👩‍💼 AI responding...');
    
    // Use browser voice synthesis
    await fallbackSpeech(message);
}

async function fallbackSpeech(message) {
    console.log('🔄 Using improved browser speech');
    
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    // Wait for voices to be loaded with preloader
    const voices = await preloadVoices();
    
    // Now safely call speakWithVoice
    await speakWithVoice(message, voices);
}

// Promise-based voice loading
function getVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            resolve(voices);
            return;
        }
        
        // Wait for voices to load
        const voicesChangedHandler = () => {
            voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
                resolve(voices);
            }
        };
        
        window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
        
        // Fallback timeout
        setTimeout(() => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
        }, 1000);
    });
}

// NEW SIMPLE SYSTEM - replaces both functions above
voiceSpeed = 1.0; // Start at normal speed
const speedLevels = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
const speedNames = ['Very Slow', 'Slow', 'Relaxed', 'Normal', 'Fast', 'Faster', 'Very Fast'];
let currentSpeedIndex = 3; // Start at "Normal" (1.0)

function adjustVoiceSpeed(direction) {
    if (direction === 'faster' && currentSpeedIndex < speedLevels.length - 1) {
        currentSpeedIndex++;
    } else if (direction === 'slower' && currentSpeedIndex > 0) {
        currentSpeedIndex--;
    }
    
    voiceSpeed = speedLevels[currentSpeedIndex];
    const speedName = speedNames[currentSpeedIndex];
    
    // Update display
    document.getElementById('speedDisplay').textContent = speedName;
    
    console.log('🎵 Voice speed:', speedName, `(${voiceSpeed}x)`);
    
    // Optional: Test the new speed
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

function findBestVoice(voices) {
    const preferredVoices = [
        'Microsoft Libby Online (Natural) - English (United Kingdom)', // 🇬🇧 POSH BRITISH!
        'Microsoft Aria Online (Natural) - English (United States)',   // 🇺🇸 Professional backup
        'Microsoft Heather Online - English (Canada)',                 // 🍁 Canadian elegance
        'Microsoft Zira - English (United States)'                     // 🇺🇸 Classic backup
    ];
    
    for (const preferredName of preferredVoices) {
        const voice = voices.find(v => v.name === preferredName);
        if (voice) {
            console.log('✅ Selected voice:', voice.name);
            return voice;
        }
    }
    
    return voices[0];
}

// ❌ COMMENT OUT THIS ENTIRE FUNCTION - IT'S CAUSING THE POPUP:
/*
function restartRecognition() {
    if (isSpeaking) {
        console.log('⏸️ Skipping recognition restart - AI is speaking');
        return;
    }
    
    console.log('🔄 Restarting speech recognition...');
    if (recognition && micPermissionGranted) {
        try {
            recognition.start();  // ← THIS IS THE POPUP TRIGGER!
        } catch (error) {
            console.log('Recognition restart error:', error);
        }
    }
}
*/


// ===================================================
// 🎯 TOP BANNER DYNAMIC TEXT SYSTEM
// ===================================================
function updateHeaderBanner(message) {
    const headerTitle = document.getElementById('chatHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = message;
        console.log('📝 Header banner updated:', message);
    } else {
        console.log('❌ Header banner element not found');
    }
}


function stopCurrentAudio() {
    if (currentAudio) {
        if (currentAudio instanceof Audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        } else if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        currentAudio = null;
        console.log('🛑 Audio stopped');
    }
}

// ADD this enhanced mute function that USES your existing logic
function muteAIVoice() {
    console.log('🔇 MUTING AI Voice...');
    
    // Use your existing audio stopping logic
    stopCurrentAudio();
    
    // Reset speaking flags
    isSpeaking = false;
    
    // Update UI
    updateHeaderBanner('🔇 AI Voice Muted');
    
    // Optional: Switch to text mode UI
    switchToTextMode();
    
    console.log('✅ AI Voice MUTED using existing audio control!');
}

// ===========================================
// INITIALIZE WHEN READY
// ===========================================
initializeWhenReady();

console.log('📁 NCI Business Chat JavaScript Loaded - ULTIMATE MIC FIX!');