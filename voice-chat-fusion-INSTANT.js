// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATION
// Smart Button + Lead Capture + EmailJS + Banner System
// ===================================================

// TEST FUNCTION: Check if banner triggers
window.testBannerTrigger = function() {
    console.log('🧪 Testing banner trigger...');
    
    // Simulate speech completion
    window.isSpeaking = false;
    
    // Clear any blocking states for test
    window.lastClickMentionTime = 0;
    window.concernBannerActive = false;
    window.isInTestimonialMode = false;
    window.isInConfirmationDialog = false;
    window.isInLeadCapture = false;
    
    console.log('Triggering showDirectSpeakNow...');
    if (typeof showDirectSpeakNow === 'function') {
        showDirectSpeakNow();
        console.log('✅ showDirectSpeakNow called successfully');
    } else {
        console.error('❌ showDirectSpeakNow not found!');
    }
};

// Run test: testBannerTrigger()

// ===========================================
// GLOBAL SPEECH CONTROL FUNCTION - UPDATED
// ===========================================

function stopAllSpeech() {
    console.log('🛑 stopAllSpeech() called');
    
    // 1. Stop browser speech synthesis
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('✅ Browser speech stopped');
    }
    
    // 2. Stop any ElevenLabs audio
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    
    // 🆕 3. Also stop any ongoing listening
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    // 🆕 4. Also hide speak now banner if visible
    if (window.hideSpeakNowBanner && typeof window.hideSpeakNowBanner === 'function') {
        window.hideSpeakNowBanner();
    }
    
    // 5. Reset speaking state
    window.isSpeaking = false;
    
    console.log('✅ All speech and listening stopped');
    return true;
}

// Make it globally available
window.stopAllSpeech = stopAllSpeech;

// Add this at the VERY TOP of your JavaScript file (like line 1)
if (typeof window.leadData === 'undefined' || !window.leadData) {
    window.leadData = { 
        firstName: '', 
        step: 0,
        tempAnswer: '',
        name: '',
        phone: '',
        email: '',
        contactTime: '',
        inquiryType: ''
    };
}

// Also initialize conversationState globally
if (typeof window.conversationState === 'undefined') {
    window.conversationState = 'initial';
}

// ===================================================
// 🏗️ GLOBAL VARIABLES
// ===================================================
let recognition = null;
let isListening = false;
let isSpeaking = false;
let isAudioMode = false;
let currentAudio = null;
let persistentMicStream = null;
let micPermissionGranted = false;
let userResponseCount = 0;
let shouldShowSmartButton = false;
let smartButtonText = 'AI Smart Button';
let smartButtonAction = 'default';
let restartTimeout = null;
let lastMessageWasApology = false;
let isInLeadCapture = false;
let speechDetected = false;
let lastProcessedTranscript = null;
let currentAIResponse = '';
window.leadData = window.leadData || {
    firstName: '',
    step: 0,
    tempAnswer: '',
    name: '',
    phone: '',
    email: '',
    contactTime: '',
    inquiryType: ''
};
let leadData = window.leadData;

// Global flag to prevent multiple instances
let speakSequenceActive = false;
let speakSequenceButton = null;
let speakSequenceCleanupTimer = null;

// Lead capture state for Action System integration
window.isInLeadCapture = false;
window.currentLeadData = null;
window.currentCaptureType = null;

// Lead data storage
if (!window.leadData) {
    window.leadData = {
        firstName: '',
        email: '',
        phone: ''
    };
}

// Conversation state
if (typeof conversationState === 'undefined') {
    var conversationState = 'initial';
}

// ===== CONFLICT PREVENTION VARIABLES =====
// Add this around line 50-100 where other window variables are set
if (typeof window.isCurrentlyListening === 'undefined') {
    window.isCurrentlyListening = false;
}
if (typeof window.isSpeaking === 'undefined') {
    window.isSpeaking = false;
}

// ═══════════════════════════════════════════════════════════
// MOBILE STABILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════


// ===================================================
// ⚡ INSTANT VOICE BUBBLE SYSTEM - AUTO-RESTART
// Bypasses hybrid sequence for instant listening
// ===================================================

// Auto-restart configuration
const AUTO_RESTART_DELAY = 500; // 1.5 seconds after AI response
let isAutoRestartEnabled = true;
// restartTimeout already declared at line 39 - reusing existing variable
let countdownInterval = null;

// ===== NUCLEAR AUDIO SHUTDOWN =====
function nuclearAudioShutdown() {
    console.log('💣 NUCLEAR: Shutting down all audio sources');
    
    // Stop all HTML5 media elements
    document.querySelectorAll('video, audio').forEach(media => {
        media.pause();
        media.currentTime = 0;
        media.muted = true;
    });
    
    // Stop speech synthesis
    window.speechSynthesis.cancel();
    
    console.log('✅ Audio channels cleared for instant recognition');
}

// ===== CLEAR RESTART TIMERS =====
function clearRestartTimers() {
    if (restartTimeout) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    // Clear countdown display if it exists
    const countdownEl = document.getElementById('restartCountdown');
    if (countdownEl) {
        countdownEl.textContent = '';
    }
}

// ===== CREATE INSTANT LISTENING BUBBLE =====
// ❌ DEPRECATED - Using showDirectSpeakNow() instead
function createInstantBubble() {
    console.log('⚡ INSTANT: Creating listening bubble immediately');
    
    // 🎯 CONFIGURATION: Banner position offset from top (adjust this value as needed)
    const BANNER_TOP_OFFSET = '20px'; // Change this to move banner up/down
    
    // 🔍 Find quick buttons container
    const quickButtonsContainer = document.querySelector('.quick-questions') || 
                                  document.querySelector('.quick-buttons') || 
                                  document.getElementById('quickButtonsContainer');
    
    // 👻 Hide existing quick buttons (so banner replaces them)
    if (quickButtonsContainer) {
        const existingButtons = quickButtonsContainer.querySelectorAll('.quick-btn');
        existingButtons.forEach(btn => btn.style.display = 'none');
        console.log('👻 INSTANT: Hid', existingButtons.length, 'quick buttons');
    }
    
    // Find or create live transcript element
    let liveTranscript = document.getElementById('liveTranscript');
    if (!liveTranscript) {
        liveTranscript = document.createElement('div');
        liveTranscript.id = 'liveTranscript';
        liveTranscript.className = 'live-transcript realtime-bubble';
        
        // 🎯 INSERT INTO QUICK BUTTONS CONTAINER (replaces them visually)
        if (quickButtonsContainer) {
            quickButtonsContainer.appendChild(liveTranscript);
            console.log('📍 INSTANT: Banner added to quick buttons container');
        } else {
            // Fallback: insert after chat messages
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.parentNode.insertBefore(liveTranscript, chatMessages.nextSibling);
            }
        }
    }
    
    liveTranscript.style.display = 'block';
    liveTranscript.style.position = 'relative';
    liveTranscript.style.top = BANNER_TOP_OFFSET; // Apply configurable offset
    liveTranscript.innerHTML = `
        <style>
            @keyframes pulse-left {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            @keyframes pulse-right {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }
            .arrow-left {
                animation: pulse-left 1.5s ease-in-out infinite;
                display: inline-block;
                margin-right: 12px;
            }
            .arrow-right {
                animation: pulse-right 1.5s ease-in-out infinite;
                display: inline-block;
                margin-left: 12px;
            }
        </style>
        <div style="text-align: center; padding: 15px; color: #10b981;">
            <div style="font-size: 20px; font-weight: bold;">
                <span class="arrow-left">&lt;&lt;&lt;</span>
                <span>Please speak now</span>
                <span class="arrow-right">&gt;&gt;&gt;</span>
            </div>
            <div id="transcriptText" style="font-weight: bold; margin-top: 8px; font-size: 16px;">Listening...</div>
        </div>
    `;
    
    return liveTranscript;
}

// ❌ DEPRECATED - Using showDirectSpeakNow() instead
// ===== UPDATE REALTIME BUBBLE WITH SPEECH =====
function updateRealtimeBubble(text) {
    const transcriptText = document.getElementById('transcriptText');
    if (transcriptText && text.trim()) {
        transcriptText.textContent = text;
    }
}

// ❌ DEPRECATED - showDirectSpeakNow() handles button management
// ===== RESTORE QUICK BUTTONS (when banner is hidden) =====
function restoreQuickButtons() {
    const quickButtonsContainer = document.querySelector('.quick-questions') || 
                                  document.querySelector('.quick-buttons') || 
                                  document.getElementById('quickButtonsContainer');
    
    if (quickButtonsContainer) {
        const hiddenButtons = quickButtonsContainer.querySelectorAll('.quick-btn');
        hiddenButtons.forEach(btn => btn.style.display = '');
        console.log('🔄 INSTANT: Restored', hiddenButtons.length, 'quick buttons');
    }
}

// ===== START INSTANT REALTIME LISTENING =====
function startRealtimeListening() {
    console.log('⚡⚡⚡ REDIRECTING TO showDirectSpeakNow() ⚡⚡⚡');
    
    // 🎯 USE THE PERFECT "SPEAK NOW!" BANNER INSTEAD OF TRANSPARENT BUBBLE
    // This is the banner with animated waveform bars that Captain loves
    showDirectSpeakNow();
}

// ===== SCHEDULE AUTO-RESTART AFTER AI SPEAKS =====
function scheduleAutoRestart() {
    console.log('🔄 AUTO-RESTART: Scheduling restart in', AUTO_RESTART_DELAY, 'ms');
    clearRestartTimers();
    
    // Actually restart after delay
    restartTimeout = setTimeout(() => {
        console.log('🔄 AUTO-RESTART: Executing automatic restart');
        
        if (!isListening && isAutoRestartEnabled && conversationState !== 'ended') {
            startRealtimeListening();
        }
    }, AUTO_RESTART_DELAY);
}

// ===== HOOK: Call after AI voice completes =====
function onAIVoiceComplete() {
    console.log('🎤 AI VOICE COMPLETE - Triggering auto-restart');
    
    if (isAutoRestartEnabled) {
        scheduleAutoRestart();
    }
}

console.log('✅ INSTANT VOICE BUBBLE SYSTEM LOADED');


function applyMobileStability() {
    console.log('📱 Applying mobile stability enhancements...');
    
    // Prevent unwanted zoom on focus
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Enhanced touch event prevention for mobile
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Force layout stability
    document.body.style.webkitTransform = 'translateZ(0)';
    document.body.style.transform = 'translateZ(0)';
}

function setupMobileTouchEvents() {
    console.log('📱 Setting up mobile touch events...');
    
    // Prevent pull-to-refresh
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const touchYDelta = touchY - touchStartY;
        
        // Prevent pull-to-refresh if scrolled to top
        if (touchYDelta > 0 && window.scrollY === 0) {
            e.preventDefault();
        }
    }, { passive: false });
}

// ===================================================
// 🎯 SPEECH RECOGNITION PRE-WARMING SYSTEM  
// ===================================================
class SpeechEngineManager {
    constructor() {
        this.recognition = null;
        this.isWarmedUp = false;
        this.isPrepping = false;
        console.log('🎯 Speech Engine Manager created');
    }
    
    async initializeEngine() {
        if (this.recognition) {
            console.log('🔥 Engine already exists');
            return true;
        }
        
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('❌ Speech not supported');
            return false;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        
        console.log('🎯 Speech engine created successfully');
        return true;
    }
    
    getEngine() {
        return this.recognition;
    }
    
    isReady() {
        return this.recognition !== null;
    }
}

// Create global engine manager
const speechEngine = new SpeechEngineManager();
console.log('🚀 Speech Engine Manager initialized');

function quickMobileAudioFix() {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        const originalPlay = HTMLAudioElement.prototype.play;
        HTMLAudioElement.prototype.play = function() {
            if (isListening) {
                console.log('🔇 Mobile: Blocked audio during speech session');
                return Promise.reject(new DOMException('Audio blocked during speech'));
            }
            return originalPlay.call(this);
        };
        console.log('✅ Mobile audio gate installed');
    }
}

// Call it immediately - runs once when file loads
quickMobileAudioFix();

// 🚨 NUCLEAR MOBILE DETECTION - SCREEN SIZE ONLY
const isDefinitelyMobile = window.innerWidth <= 768 || window.innerHeight <= 1024;

// 🚨 FIX: Check if event exists before accessing event.error
if (isDefinitelyMobile || (event && event.error === 'no-speech')) {
    console.log('📱 NUCLEAR MOBILE DETECTED: Using visual feedback system');
}

// 🎯 COMPLETE REVISED showPostSorryListening() FUNCTION
function showPostSorryListening() {
     // 🛑 PREVENT INTERRUPTION IF CONCERN BANNER IS ACTIVE
    if (window.concernBannerActive) {
        console.log('⏸️ Concern banner active - blocking "Get Ready to Speak"');
        return; // Exit immediately
    }
    
    console.log('🎯🎯🎯 POST-SORRY FUNCTION ACTUALLY CALLED! 🎯🎯🎯');
    console.log('🔄 Starting POST-SORRY direct listening');
    
    // 🎯 NUCLEAR: Clear ALL possible cleanup timers
    if (speakSequenceCleanupTimer) {
        clearTimeout(speakSequenceCleanupTimer);
        speakSequenceCleanupTimer = null;
        console.log('🕐 POST-SORRY: Cancelled speakSequenceCleanupTimer');
    }
    
    // 🎯 NUCLEAR: Clear any other possible timers that might be running
    if (window.hybridCleanupTimer) {
        clearTimeout(window.hybridCleanupTimer);
        window.hybridCleanupTimer = null;
        console.log('🕐 POST-SORRY: Cancelled hybridCleanupTimer');
    }
    
    if (window.sequenceTimer) {
        clearTimeout(window.sequenceTimer);
        window.sequenceTimer = null;
        console.log('🕐 POST-SORRY: Cancelled sequenceTimer');
    }
    
    // ✅ Basic checks only
    if (conversationState === 'ended') {
        console.log('🚫 POST-SORRY: Conversation ended - blocking');
        return;
    }
    
    speakSequenceActive = true;
    console.log('✅ POST-SORRY: Set speakSequenceActive = true');
    
    // ✅ Find container  
    const quickButtonsContainer = document.querySelector('.quick-questions') || 
                                  document.querySelector('.quick-buttons') || 
                                  document.getElementById('quickButtonsContainer');
    
    if (!quickButtonsContainer) {
        console.log('❌ POST-SORRY: Quick buttons container not found');
        speakSequenceActive = false;
        return;
    }
    
    // ✅ Clean up existing button
    const existingSpeakBtn = document.getElementById('speak-sequence-button');
    if (existingSpeakBtn) {
        existingSpeakBtn.remove();
        console.log('🧹 POST-SORRY: Removed existing speak button');
    }
    
    // ✅ Create DIRECT "Speak Now" button
    speakSequenceButton = document.createElement('button');
    speakSequenceButton.id = 'speak-sequence-button';
    speakSequenceButton.className = 'quick-btn green-button-glow';
    
    speakSequenceButton.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <div style="margin-bottom: 6px;">
                <span class="green-dot-blink">🟢</span> Speak Now!
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: 100%; background: linear-gradient(90deg, #4caf50, #2e7d32);"></div>
            </div>
        </div>
    `;
    
    speakSequenceButton.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(34, 197, 94, 0.9) !important;
    color: #ffffff !important;
    border: 2px solid rgba(34, 197, 94, 0.8) !important;
    padding: 15px !important;
    font-weight: bold !important;
    font-size: 18px !important;
    border-radius: 20px !important;
    z-index: 1000 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
`;
    
    // ✅ Enhanced mobile stability (if needed)
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        speakSequenceButton.style.cssText += `
            position: relative !important;
            z-index: 1000 !important;
            min-height: 50px !important;
            padding: 18px !important;
        `;
        console.log('📱 POST-SORRY: Mobile enhancements applied');
    }
    
    quickButtonsContainer.appendChild(speakSequenceButton);
    console.log('✅ POST-SORRY: Direct "Speak Now" button created and added to DOM');
    
    // ✅ Start listening immediately (no delays, no preparation)
    setTimeout(() => {
        console.log('🎤 POST-SORRY: Starting DIRECT recognition');
        
        // Clear any previous result flag
        window.lastRecognitionResult = null;
        
        if (typeof recognition !== 'undefined' && recognition) {
            try {
                recognition.start();
                console.log('✅ POST-SORRY: Direct recognition started successfully');
            } catch (e) {
                console.log('❌ POST-SORRY: Recognition start failed:', e);
                // Fallback: try again after a short delay
                setTimeout(() => {
                    try {
                        recognition.start();
                        console.log('✅ POST-SORRY: Fallback recognition started');
                    } catch (e2) {
                        console.log('❌ POST-SORRY: Fallback also failed:', e2);
                    }
                }, 300);
            }
        } else {
            console.log('❌ POST-SORRY: Recognition object not found');
        }
    }, 100);
    
    // 🚫 NO CLEANUP TIMER - Let it run until user speaks or session naturally ends!
    console.log('✅ POST-SORRY: Function completed - no cleanup timer set');
}

// ===================================================
// 🎤 MICROPHONE PERMISSION SYSTEM
// ===================================================
async function requestMicrophoneAccess() {
    const permissionStatus = document.getElementById('permissionStatus');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (permissionStatus) {
            permissionStatus.innerHTML = '<div class="permission-deny">Error: getUserMedia is not supported in this browser</div>';
        }
        return false;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Success - clean up stream immediately
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        
        showMicActivatedStatus();
        return true;
    } catch (err) {
        console.error("Microphone access denied:", err);
        if (permissionStatus) {
            permissionStatus.innerHTML = '<div class="permission-deny">Microphone access denied. Please check your browser permissions and try again.</div>';
        }
        return false;
    }
}

function showMicActivatedStatus() {
    const micStatus = document.getElementById('micStatus');
    if (micStatus) {
        micStatus.style.display = 'block';
        setTimeout(() => {
            micStatus.style.display = 'none';
        }, 3000);
    }
}

// ===================================================
// 🎵 INTRO JINGLE PLAYER (YOUR EXISTING CODE - KEEP AS-IS)
// ===================================================
function playIntroJingle() {
    const introAudio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1757573121859.mp3');
    
    introAudio.volume = 0.7;
    introAudio.preload = 'auto';
    
    introAudio.play().catch(error => {
        console.log('Intro jingle failed to play:', error);
    });
    
    setTimeout(() => {
        if (!introAudio.ended) {
            let fadeOutInterval = setInterval(() => {
                if (introAudio.volume > 0.1) {
                    introAudio.volume -= 0.1;
                } else {
                    introAudio.pause();
                    clearInterval(fadeOutInterval);
                }
            }, 100);
        }
    }, 3000);
}

// ===================================================
// 🔊 DESKTOP BEEP WITH COOLDOWN PROTECTION
// ===================================================

let lastBeepTime = 0;
const BEEP_COOLDOWN = 3000; // 3 seconds between beeps

// Desktop Get Ready + Speak Now beep (with cooldown)
function playGetReadyAndSpeakNowSound() {
    const now = Date.now();
    
    // Check if enough time has passed since last beep
    if (now - lastBeepTime < BEEP_COOLDOWN) {
        console.log('🔊 Beep skipped - too soon after previous beep');
        return;
    }
    
    const getReadyAudio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1760038807240.mp3');
    getReadyAudio.volume = 0.6;
    getReadyAudio.preload = 'auto';
    
    getReadyAudio.play().catch(error => {
        console.log('Get Ready + Speak Now sound failed to play:', error);
    });
    
    // Update last beep time
    lastBeepTime = now;
    console.log('🔊 Get Ready + Speak Now sound played with cooldown protection');
}

// Desktop Listening Stops beep (no cooldown needed - only plays once at end)
function playListeningStopsSound() {
    const stopsAudio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1760038921880.mp3');
    stopsAudio.volume = 0.5;
    stopsAudio.preload = 'auto';
    
    stopsAudio.play().catch(error => {
        console.log('Listening Stops sound failed to play:', error);
    });
    
    console.log('🔊 Listening Stops sound played');
}

// ===================================================
// 🎤 SPEECH RECOGNITION SYSTEM
// ===================================================
function checkSpeechSupport() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('❌ Speech recognition not supported in this browser');
        addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
        return false;
    }
    return true;
}

function initializeSpeechRecognition() {
    if (!checkSpeechSupport()) return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // 🚫 CRITICAL: DISABLE BROWSER BEEP
    recognition.onsoundstart = null;
    recognition.onaudiostart = null;
    recognition.onstart = null;

    console.log('✅ Speech recognition initialized');
    
    // ✅ CALL BEFORE RETURN
    suppressBrowserBeeps();
    
    return true;
}

function getApologyResponse() {
    const sorryMessages = [
        "I'm sorry, I didn't catch that. Can you repeat your answer?",
        "Sorry, I didn't hear you. Please say that again.", 
        "I didn't get that. Could you repeat it?",
        "Let me try listening again. Please speak your answer now."
    ];

        // 🎯 RESET THE CLEANUP TIMER WHEN SORRY MESSAGE STARTS
    if (window.lastSequenceStart) {
        console.log('⏰ Resetting cleanup timer for sorry message');
        window.lastSequenceStart = Date.now();
    }
    
    lastMessageWasApology = true;
    setTimeout(() => { lastMessageWasApology = false; }, 5000);
    
    return sorryMessages[Math.floor(Math.random() * sorryMessages.length)];
}

function suppressBrowserBeeps() {
    if (!recognition) return;
    
    recognition.onsoundstart = function() { /* SILENCE */ };
    recognition.onaudiostart = function() { /* SILENCE */ };
    recognition.onspeechstart = function() { /* SILENCE */ };
}
    
// ===================================================
// 🎤 START LISTENING new function
// ===================================================
async function startListening() {
    window.isCurrentlyListening = true;
    // ✅ PREVENT MULTIPLE STARTS
    if (recognition && recognition.state === 'started') {
        console.log('🚫 Recognition already running - skipping start');
        return;
    }
    
    // Smart button gate-keeper (keep this)
    const smartButton = document.getElementById('smartButton');
    if (smartButton && smartButton.style.display !== 'none') {
        console.log('🚫 Smart button active - BLOCKING startListening()');
        return;
    }
    
    console.log('🎯 startListening() called');
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    
    try {
        // 🎯 MOBILE-SPECIFIC PRE-WARMING
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        
        if (isMobile && !speechEngine.isReady()) {
            console.log('📱 Mobile detected - pre-warming engine...');
            await speechEngine.initializeEngine();
        }
        
        if (!recognition) {
            if (isMobile && speechEngine.isReady()) {
                recognition = speechEngine.getEngine();
                console.log('📱 Using pre-warmed mobile engine');
            } else {
                initializeSpeechRecognition();
            }
        }

        // 🔥 CRITICAL: ONLY SET HANDLERS IF RECOGNITION EXISTS
        if (recognition && recognition !== null) {
            console.log('✅ Recognition exists - setting up handlers...');
            
// 🔥 SET ONRESULT HANDLER - COMPLETE FIXED VERSION
recognition.onresult = function(event) {
    console.log('🎯 ONRESULT FIRED');
    console.log('  - Results count:', event.results.length);
    console.log('  - Result index:', event.resultIndex);

    // 🆕 FIXED: DECLARE transcript FIRST before using it!
    let transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    transcript = transcript.replace(/\.+$/, '');
    
    console.log('✅ Transcript captured:', transcript);
    
    // 🆕 FIXED: NOW call updateVoiceTranscription AFTER transcript is declared
    if (window.updateVoiceTranscription) {
        window.updateVoiceTranscription(transcript);
        console.log('🧪 DEBUG: Called updateVoiceTranscription with:', transcript);
    } else {
        console.log('🧪 DEBUG: updateVoiceTranscription not available yet');
    }
    
    console.log('  - Length:', transcript.length);
    console.log('  - Is final:', event.results[event.results.length - 1]?.isFinal);
    
    const transcriptText = document.getElementById('transcriptText');
    const userInput = document.getElementById('userInput');
    
    if (transcriptText) {
        transcriptText.textContent = 'Speak Now';
    }
    
    if (userInput) {
        userInput.value = transcript;
        console.log('✅ Updated userInput field:', userInput.value);
        
        // 🔥 Store transcript globally as backup
        window.lastCapturedTranscript = transcript;
        window.lastCapturedTime = Date.now();
        console.log('✅ Stored in window.lastCapturedTranscript');
    } else {
        console.error('❌ userInput field NOT FOUND!');
    }
    
    // 🔥🚨🚨🚨 CRITICAL MISSING FIX: CANCEL THE DIRECT SPEAK NOW TIMEOUT 🚨🚨🚨
    if (transcript.trim().length > 0 && window.directSpeakNowTimeout) {
        console.log('🎯 Speech detected - CANCELLING directSpeakNow timeout');
        clearTimeout(window.directSpeakNowTimeout);
        window.directSpeakNowTimeout = null;
    }
    
    // 🔥 Cancel the 4-second timeout immediately when speech is detected
    if (transcript.trim().length > 0 && window.speakNowTimeout) {
        console.log('🎯 Speech detected - cancelling nuclear timeout preemptively');
        clearTimeout(window.speakNowTimeout);
        window.speakNowTimeout = null;
    }
    
    if (isInLeadCapture) {
        clearTimeout(window.leadCaptureTimeout);
        window.leadCaptureTimeout = setTimeout(() => {
            if (transcript.trim().length > 1 && userInput.value === transcript) {
                console.log('🎯 Lead capture auto-send:', transcript);
                sendMessage();
            }
        }, 5000);
    }
};

           // 🔥 SET ONEND HANDLER - COMPLETE FIXED VERSION
recognition.onend = function() {
    console.log('🎯🎯🎯 WHICH ONEND IS RUNNING? 🎯🎯🎯');
    console.log('🔚 Recognition ended');
    
    // 🧪 DEBUG: Check overlay cleanup
    console.log('🧪 ONEND TEST 1: hideVoiceOverlay available:', typeof window.hideVoiceOverlay === 'function' ? '✅' : '❌');
    if (window.hideVoiceOverlay) {
        console.log('🧪 ONEND TEST 1.1: Calling hideVoiceOverlay ✅');
        window.hideVoiceOverlay();
    } else {
        console.log('🧪 ONEND TEST 1.1: hideVoiceOverlay not available ❌');
    }
    
    // 🔥🚨🚨🚨 CRITICAL MISSING FIX: CANCEL THE DIRECT SPEAK NOW TIMEOUT 🚨🚨🚨
    if (window.directSpeakNowTimeout) {
        console.log('🎯 Recognition ended - CANCELLING directSpeakNow timeout');
        clearTimeout(window.directSpeakNowTimeout);
        window.directSpeakNowTimeout = null;
    }
    
    console.log('🔍 DEBUG: playingSorryMessage =', window.playingSorryMessage);
    console.log('🔍 DEBUG: isSpeaking =', isSpeaking);
    console.log('🔍 DEBUG: speakSequenceActive =', speakSequenceActive);

    // 🧪 DEBUG: Manual overlay cleanup as backup
    console.log('🧪 ONEND TEST 2: Manual overlay cleanup');
    hideVoiceOverlay();
    
    // 🔥 TRIPLE-SOURCE TRANSCRIPT CAPTURE
    let finalTranscript = '';
    const userInput = document.getElementById('userInput');
    
    console.log('🧪 ONEND TEST 3: User input element:', userInput ? '✅ Found' : '❌ Not found');
    if (userInput) {
        console.log('🧪 ONEND TEST 3.1: Input value:', userInput.value);
    }

    // SOURCE 1: Check recognition.results
    console.log('🧪 ONEND TEST 4: Checking recognition.results');
    if (recognition.results && recognition.results.length > 0) {
        console.log('🧪 ONEND TEST 4.1: Results available, count:', recognition.results.length);
        for (let i = recognition.resultIndex; i < recognition.results.length; i++) {
            if (recognition.results[i].isFinal) {
                finalTranscript += recognition.results[i][0].transcript;
                console.log('🧪 ONEND TEST 4.2: Final result at index', i, ':', recognition.results[i][0].transcript);
            } else {
                finalTranscript += recognition.results[i][0].transcript;
                console.log('🧪 ONEND TEST 4.3: Interim result at index', i, ':', recognition.results[i][0].transcript);
            }
        }
        console.log('🔍 SOURCE 1 (recognition.results):', finalTranscript || 'EMPTY');
    } else {
        console.log('🧪 ONEND TEST 4.1: No recognition results available ❌');
    }

    // SOURCE 2: Check input field
    console.log('🧪 ONEND TEST 5: Checking input field');
    if (!finalTranscript && userInput && userInput.value.trim().length > 0) {
        finalTranscript = userInput.value.trim();
        console.log('🔍 SOURCE 2 (input field):', finalTranscript);
    } else {
        console.log('🧪 ONEND TEST 5.1: Input field empty or not available');
    }

    // SOURCE 3: Check global backup
    console.log('🧪 ONEND TEST 6: Checking global backup');
    console.log('🧪 ONEND TEST 6.1: lastCapturedTranscript:', window.lastCapturedTranscript || 'NOT SET');
    console.log('🧪 ONEND TEST 6.2: lastCapturedTime:', window.lastCapturedTime || 'NOT SET');
    
    if (!finalTranscript && window.lastCapturedTranscript) {
        const timeSinceCapture = Date.now() - (window.lastCapturedTime || 0);
        console.log('🧪 ONEND TEST 6.3: Time since capture:', timeSinceCapture + 'ms');
        if (timeSinceCapture < 5000) {
            finalTranscript = window.lastCapturedTranscript;
            console.log('🔍 SOURCE 3 (global backup):', finalTranscript);
        } else {
            console.log('🧪 ONEND TEST 6.3: Global backup too old (>5000ms)');
            finalTranscript = window.lastCapturedTranscript;
            console.log('🔍 SOURCE 3 (global backup):', finalTranscript);
        }
    }

    console.log('🔍 FINAL transcript to use:', finalTranscript);
    
    if (finalTranscript && finalTranscript.trim().length > 0) {
        const currentMessage = finalTranscript.trim();
        const now = Date.now();
        const timeSinceLastMessage = now - (window.lastMessageTime || 0);
        
        if (!window.lastProcessedMessage || 
            window.lastProcessedMessage !== currentMessage || 
            timeSinceLastMessage > 3000) {
            
            console.log('✅ Sending new message:', currentMessage);

            // 🎯 ADD THIS RIGHT AFTER LINE 853
            console.log('🎯 Calling processUserResponse with:', finalTranscript);
            if (typeof processUserResponse === 'function') {
                processUserResponse(finalTranscript);
            }

            if (window.speakNowTimeout) {
                clearTimeout(window.speakNowTimeout);
                window.speakNowTimeout = null;
                console.log('✅ Cancelled 4-second timeout - speech was captured');
            }

            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                console.log('✅ Stopped any pending TTS');
            }

            if (typeof speakSequenceActive !== 'undefined' && speakSequenceActive) {
                console.log('🎯 Closing Speak Now banner - message sent');
                window.playingSorryMessage = false;
                
                if (speakSequenceCleanupTimer) {
                    clearTimeout(speakSequenceCleanupTimer);
                    speakSequenceCleanupTimer = null;
                }
                
                cleanupSpeakSequence();
            }
            
            window.lastMessageTime = now;
            window.lastProcessedMessage = currentMessage;
            sendMessage(currentMessage);
        }
    } else {
        console.log('🔄 No speech detected via onend - showing try again overlay');

        setTimeout(() => {
            window.playingSorryMessage = false;
            console.log('🔓 Cleared playingSorryMessage after no-speech timeout');
        }, 3000);

        if (speakSequenceCleanupTimer) {
            clearTimeout(speakSequenceCleanupTimer);
            speakSequenceCleanupTimer = null;
            console.log('🕐 CANCELLED cleanup timer - preventing session kill');
        }
        
        if (!isSpeaking) {
            setTimeout(() => {
                console.log('🎯 DEBUG: About to show try again overlay');
                showAvatarSorryMessage();
                console.log('🎯 DEBUG: Try again overlay shown');
            }, 7000);
        } else {
            console.log('🚫 DEBUG: BLOCKED - AI is speaking');
        }
    }
};

            // 🔥 SET ONERROR HANDLER
            recognition.onerror = function(event) {
                console.log('🔊 Speech error:', event.error);

                if (speakSequenceCleanupTimer) {
                    clearTimeout(speakSequenceCleanupTimer);
                    speakSequenceCleanupTimer = null;
                    console.log('🕐 CANCELLED cleanup timer in error handler');
                }

                if (typeof handleSpeechRecognitionError === 'function') {
                    console.log('🎯 CALLING handleSpeechRecognitionError for:', event.error);
                    handleSpeechRecognitionError(event.error);
                    return;
                } else {
                    console.log('❌ handleSpeechRecognitionError function not found - using fallback');
                }

                if (event.error === 'no-speech') {
                    const transcriptText = document.getElementById('transcriptText');
                    const isDefinitelyMobile = window.innerWidth <= 768 || window.innerHeight <= 1024;

                    if (isDefinitelyMobile) {
                        console.log('📱📱📱 MOBILE: Using visual feedback system');

                        if (window.noSpeechTimeout) {
                            clearTimeout(window.noSpeechTimeout);
                        }

                        if (transcriptText) {
                            transcriptText.textContent = 'I didn\'t hear anything...';
                            transcriptText.style.color = '#ff6b6b';

                            window.noSpeechTimeout = setTimeout(() => {
                                if (transcriptText) {
                                    transcriptText.textContent = 'Please speak now';
                                    transcriptText.style.color = '#ffffff';
                                }

                                if (isAudioMode && !isSpeaking) {
                                    console.log('🔄 Mobile: Restarting via hybrid system');
                                    isListening = false;
                                    setTimeout(() => {
                                        startRealtimeListening();
                                    }, 800);
                                }
                            }, 1500);
                        }
                    }
                } else if (event.error === 'audio-capture') {
                    console.log('🎤 No microphone detected');
                    addAIMessage("I can't detect your microphone. Please check your audio settings.");
                } else if (event.error === 'not-allowed') {
                    console.log('🔒 Permission denied');
                    addAIMessage("Microphone permission was denied. Please allow microphone access to continue.");
                }
            };
            
            console.log('✅ All recognition handlers installed successfully');
        } else {
            console.error('❌ Recognition object is null - cannot set handlers');
            return;
        }

        // Continue with the rest of startListening...
        recognition.start();
        isListening = true;

    } catch (error) {
        console.error('❌ Error starting speech recognition:', error);
        addAIMessage("Woops, I missed that please try again.");
        //switchToTextMode(); // 🚨 REMOVE THIS LINE
    }
}

// ===================================================
// 🔍 FORCE START LISTENING - FIXED (DUPLICATE HANDLER REMOVED)
// ===================================================

function forceStartListening() {
    console.log('🎤 TEST 8: forceStartListening() CALLED at:', Date.now());
    console.log('🎤 TEST 9: isSpeaking:', isSpeaking);
    console.log('🎤 TEST 10: recognition exists:', !!recognition);
    console.log('🔄 FORCE starting speech recognition (mobile reset)');
    
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    
    try {
        if (!recognition) {
            initializeSpeechRecognition();
        }
        
        // 🎯 DIAGNOSTIC: Check recognition state BEFORE starting
        console.log('🔍 DIAGNOSTIC: Recognition state before start:', recognition.state || 'undefined');
        
        // 🎯 DIAGNOSTIC: Add detailed event logging
        recognition.onstart = function() {
            console.log('✅ DIAGNOSTIC: Recognition STARTED successfully');
        };
        
        // ✅ DUPLICATE recognition.onerror REMOVED - Using the one from startListening()
        
        console.log('🎤 Force starting speech recognition...');
        recognition.start();
        isListening = true;
        
        // 🎯 DIAGNOSTIC: Check state AFTER starting
        setTimeout(() => {
            console.log('🔍 DIAGNOSTIC: Recognition state after start:', recognition.state || 'undefined');
        }, 100);
        
        console.log('✅ Force speech recognition started successfully');
        
    } catch (error) {
        console.error('❌ DIAGNOSTIC: Error in forceStartListening:', error);
        console.log('🔍 DIAGNOSTIC: Error name:', error.name);
        console.log('🔍 DIAGNOSTIC: Error message:', error.message);
    }
};

// 🎯 ADD THIS HELPER FUNCTION TO CHECK WHAT'S BLOCKING:
function diagnoseBlocing() {
    console.log('🔍 BLOCKING DIAGNOSIS:');
    console.log('  🎤 isSpeaking:', isSpeaking);
    console.log('  🔊 playingSorryMessage:', window.playingSorryMessage);
    console.log('  🎬 speakSequenceActive:', speakSequenceActive);
    console.log('  🔄 recognition state:', recognition ? recognition.state : 'no recognition');
    console.log('  💭 conversationState:', conversationState);
    console.log('  ⏰ lastSequenceStart:', window.lastSequenceStart);
    console.log('  🎯 current time:', Date.now());
    
    // Check for any timers
    console.log('  ⏰ speakSequenceCleanupTimer:', !!speakSequenceCleanupTimer);
    console.log('  ⏰ restartTimeout:', !!restartTimeout);
    
    // Check DOM elements
    const speakNowButton = document.querySelector('[data-speak-now]') || document.getElementById('speakSequenceButton');
    console.log('  🎯 Speak Now button exists:', !!speakNowButton);
    console.log('  🎯 Speak Now button visible:', speakNowButton ? speakNowButton.style.display !== 'none' : false);
}

// 🎯 CALL THIS FUNCTION WHEN SECOND SPEAK NOW APPEARS:
// Add this line right after the second "Speak Now" banner shows:
// diagnoseBlocing();

// ===================================================
// 📧 EMAIL FORMATTING FUNCTION - FIXED
// ===================================================
function formatEmailFromSpeech(speechText) {
    let formattedEmail = speechText.toLowerCase().trim();
    
    // Replace common speech patterns with email format
    formattedEmail = formattedEmail
        .replace(/\s*at\s+/g, '@')           // "at" becomes @
        .replace(/\s*dot\s+/g, '.')          // "dot" becomes .
        .replace(/\s+/g, '')                 // Remove all spaces
        .replace(/,/g, '')                   // Remove commas
        .replace(/\.+$/, '');                // ✅ Remove trailing periods!

            console.log('📧 Email conversion DEBUG:', {
        original: speechText,
        cleaned: formattedEmail,
        hasTrailingPeriod: /\.$/.test(speechText)
    });
    
    console.log('📧 Email conversion:', speechText, '→', formattedEmail);
    return formattedEmail;
}

// ===================================================
// 🎯 CLEAN ACTIVATION SYSTEM
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    const mainMicButton = document.getElementById('mainMicButton');
    if (mainMicButton) {
        mainMicButton.addEventListener('click', async function() {
            playIntroJingle();
            
            document.getElementById('centerMicActivation').style.display = 'none';
            
            await activateMicrophone();
        });
    }
});

// ===================================================
// 🎤 MICROPHONE ACTIVATION SYSTEM
// ===================================================
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    if (!window.isSecureContext) {
        addAIMessage("Microphone access requires HTTPS. Please ensure you're on a secure connection.");
        return;
    }

    try {
        const permissionGranted = await requestMicrophoneAccess();
        
        if (permissionGranted) {
            micPermissionGranted = true;
            isAudioMode = true;

            const micButton = document.getElementById('micButton');
            if (micButton) {
                micButton.classList.add('listening');
            }
            
            initializeSpeechRecognition();

            document.getElementById('quickButtonsContainer').style.display = 'block';

           setTimeout(() => {
    // Initialize conversation system - BULLETPROOF VERSION
    if (typeof conversationState === 'undefined') {
        window.conversationState = 'getting_first_name';
    } else {
        conversationState = 'getting_first_name';
        window.waitingForName = true;
    }
    
        // Initialize leadData if it doesn't exist
    if (typeof leadData === 'undefined' || !leadData) {
        window.leadData = { firstName: '' };
    }
    
    const greeting = "Hi there! I'm Boteemia your personal AI Voice assistant, may I get your first name please?";
    addAIMessage(greeting);
    
    // Add delay before speaking to ensure audio system is ready
    setTimeout(() => {
        speakResponse(greeting);
    }, 800); // 800ms delay ensures everything is initialized
    
}, 1400);
        }

    } catch (error) {
        console.log('❌ Microphone access failed:', error);
        
        let errorMessage = "Microphone access was denied. ";
        if (error.name === 'NotAllowedError') {
            errorMessage += "Please check your browser permissions and allow microphone access.";
        } else if (error.name === 'NotFoundError') {
            errorMessage += "No microphone found. Please check your device settings.";
        } else {
            errorMessage += "Please try again or use text input.";
        }

        addAIMessage(errorMessage);
        //switchToTextMode(); // 🚨 REMOVE THIS LINE
    }
}

// ===================================================
// 💭 MESSAGE HANDLING SYSTEM - USE THIS VERSION
// ===================================================
function addUserMessage(message) {
    console.log('🔍 DEBUG: addUserMessage called with:', message);
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
}

function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    // DEBUG: Check container widths
    console.log('Chat messages width:', chatMessages.offsetWidth);
    console.log('Chat messages parent width:', chatMessages.parentElement.offsetWidth);
    
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message ai-message';
    
    const avatar = document.createElement('img');
    avatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1764374269507_avatar%20right.png';
    avatar.alt = 'AI Assistant';
    avatar.className = 'ai-avatar';
    
    const messageText = document.createElement('div');
    messageText.textContent = message;
    
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageText);
    chatMessages.appendChild(messageContainer);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ===========================================
// 🛑 STOP LISTENING FUNCTION - IMPROVED
// ===========================================
function stopListening() {
    console.log('🛑 stopListening() called - comprehensive cleanup');
    
    // Set all listening states to false
    window.isCurrentlyListening = false;
    window.isListening = false;
    window.isRecording = false;
    
    // Stop speech recognition if active
    if (window.speechRecognition) {
        try {
            window.speechRecognition.stop();
            window.speechRecognition.abort();
            console.log('✅ Speech recognition stopped');
        } catch (e) {
            console.log('Speech recognition stop error (expected if not running):', e.message);
        }
    }
    
    // 🆕 ALSO STOP ANY SPEECH PLAYBACK
    if (window.isSpeaking) {
        console.log('🛑 Also stopping speech playback');
        if (window.stopAllSpeech && typeof window.stopAllSpeech === 'function') {
            window.stopAllSpeech();
        }
    }
    
    // 🆕 HIDE SPEAK NOW BANNER IF VISIBLE
    if (window.hideSpeakNowBanner && typeof window.hideSpeakNowBanner === 'function') {
        window.hideSpeakNowBanner();
    }
    
    // 🆕 RESET CONVERSATION STATE IF NEEDED
    if (window.conversationState === 'listening') {
        window.conversationState = 'ready';
    }
}

// Make globally accessible
window.stopListening = stopListening;

// ===========================================
// 🎨 CLEAN EMOJIS FROM SPEECH - IMPROVED
// ===========================================
function cleanEmojisFromSpeech(text) {
    if (!text || typeof text !== 'string') return text || '';
    
    console.log('🎨 Cleaning emojis from text:', text.substring(0, 50) + '...');
    
    // EXTENSIVE EMOJI PATTERNS - Remove ALL emojis, not just specific ones
    const emojiPatterns = [
        // Common UI/status emojis
        /✅/g, /❌/g, /⚠️/g, /🚨/g, /🔔/g, /📢/g,
        // Communication emojis
        /📧/g, /📞/g, /📱/g, /💬/g, /🗨️/g,
        // Time/date emojis
        /📅/g, /⏰/g, /⏱️/g, /⏳/g, /⌛/g,
        // Action emojis
        /⏭️/g, /🔄/g, /🎬/g, /🚀/g, /🛡️/g,
        // People/gesture emojis
        /🙏/g, /👋/g, /👍/g, /👌/g, /🤝/g,
        // Object emojis
        /🎤/g, /🎯/g, /🏠/g, /🆕/g, /🔑/g,
        // Arrows
        /⬅️/g, /➡️/g, /⬆️/g, /⬇️/g, /↔️/g,
        // General emoji ranges (catches ALL emojis)
        /[\u{1F600}-\u{1F64F}]/gu, // Emoticons
        /[\u{1F300}-\u{1F5FF}]/gu, // Misc Symbols and Pictographs
        /[\u{1F680}-\u{1F6FF}]/gu, // Transport and Map Symbols
        /[\u{2600}-\u{26FF}]/gu,   // Misc Symbols
        /[\u{2700}-\u{27BF}]/gu    // Dingbats
    ];
    
    let cleanedText = text;
    
    // Remove all emoji patterns
    emojiPatterns.forEach(pattern => {
        cleanedText = cleanedText.replace(pattern, '');
    });
    
    // Clean up formatting artifacts
    cleanedText = cleanedText
        .replace(/\s+/g, ' ')           // Multiple spaces to single space
        .replace(/^\s+|\s+$/g, '')      // Trim start/end
        .replace(/,\s*,/g, ',')         // Remove duplicate commas
        .replace(/\.\s*\./g, '.')       // Remove duplicate periods
        .replace(/\s*,\s*/g, ', ')      // Normalize comma spacing
        .replace(/\s*\.\s*/g, '. ')     // Normalize period spacing
        .trim();
    
    // Log if changes were made
    if (cleanedText !== text) {
        console.log('🎨 Cleaned emojis from speech:', 
                   'Original:', text.substring(0, 30) + '...',
                   'Cleaned:', cleanedText.substring(0, 30) + '...');
    }
    
    return cleanedText;
}

// Make globally accessible
window.cleanEmojisFromSpeech = cleanEmojisFromSpeech;


// ===================================================
// 💬 TEXT INPUT SYSTEM
// ===================================================
function sendMessage() {
    const userInput = document.getElementById('userInput');
    if (!userInput) return;
    
    const message = userInput.value.trim();
    if (!message) return;
    
    const liveTranscript = document.getElementById('liveTranscript');
    if (liveTranscript) {
        liveTranscript.style.display = 'none';
        restoreQuickButtons(); // Show quick buttons again
    }
    
    addUserMessage(message);
    userInput.value = '';
    
}

// ===================================================
// 🔥 PRE-WARM ENGINE (SILENT - NO BEEP)
// ===================================================
function preWarmSpeechEngine() {
    console.log('🔥 Pre-warming speech engine...');
    
    if (!recognition) {
        initializeSpeechRecognition();
    }
    
    // Mobile-specific optimizations
    if (isMobileDevice()) {
        try {
            // 🚫 CRITICAL: Turn off browser beep by removing event handlers
            recognition.onsoundstart = null;
            recognition.onaudiostart = null;
            recognition.onstart = null;
            
            recognition.start();
            
            // Stop immediately - just warming the engine
            setTimeout(() => {
                if (recognition && isListening) {
                    recognition.stop();
                    isListening = false;
                    console.log('✅ Speech engine pre-warmed');
                }
            }, 100);
        } catch (error) {
            console.log('🔧 Engine already warming:', error.message);
        }
    }
}

// This is what your banner calls:
function handleConsultationClick(type) {
    console.log(`🎯 Bridge: ${type}`);
    // Call the existing working function:
    handleSmartButtonClick(type);
}

// 🎯 ADD THIS MISSING FUNCTION - ROOT CAUSE FIX
function isMobileDevice() {
    const userAgent = navigator.userAgent;
    
    // 🦊 CRITICAL: Edge desktop should return FALSE
    const isEdgeDesktop = /Edg\/\d+/.test(userAgent) && !/Mobile/.test(userAgent);
    const isChromeDesktop = /Chrome\/\d+/.test(userAgent) && !/Mobile/.test(userAgent);
    const isFirefoxDesktop = /Firefox\/\d+/.test(userAgent) && !/Mobile/.test(userAgent);
    
    // 🎯 DESKTOP BROWSERS - DEFINITELY NOT MOBILE
    if (isEdgeDesktop || isChromeDesktop || isFirefoxDesktop) {
        return false;
    }
    
    // 🎯 TRUE MOBILE DETECTION
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userAgent);
    const isTablet = /iPad|Tablet|KFAPWI|Silk/i.test(userAgent);
    const hasTouch = 'ontouchstart' in window;
    const isSmallScreen = window.innerWidth < 768;
    
    return isMobileUserAgent || isTablet || (hasTouch && isSmallScreen);
}

// 🎯 KEEP THE DEBUG TO VERIFY IT'S WORKING
console.log('🔍 ROOT CAUSE DEBUG - isMobileDevice FIXED:', {
    userAgent: navigator.userAgent,
    isMobileDevice: isMobileDevice(),
    hasTouch: 'ontouchstart' in window,
    screenWidth: window.innerWidth,
    isEdge: /Edg\/\d+/.test(navigator.userAgent),
    isMobileInUA: /Mobile/.test(navigator.userAgent)
});

// ===========================================
// ELEVENLABS CONFIG
// ===========================================
const ELEVENLABS_API_KEY = 'sk_9e7fa2741be74e8cc4af95744fe078712c1e8201cdcada93';
const VOICE_ID = 'zGjIP4SZlMnY9m93k97r';

// ===========================================
// ORIGINAL ELEVENLABS FUNCTION WITH MOBILE FIX
// ===========================================
async function speakWithElevenLabs(message) {
    try {
        console.log('🎤 ElevenLabs: Starting speech synthesis...');
        window.isSpeaking = true;
        
        // 🎯 CRITICAL MOBILE FIX: REINITIALIZE audio context for EVERY speech
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            console.log('📱 Mobile: Ensuring audio context before EACH speech...');
            try {
                // Create NEW silent audio for EVERY speech
                const silentAudio = new Audio();
                silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
                silentAudio.volume = 0;
                
                // Play it immediately
                await silentAudio.play();
                
                // Mark context as initialized
                window.audioContextInitialized = true;
                console.log('✅ Mobile audio context refreshed for this speech');
                
                // 🆕 CRITICAL: Add a small delay for mobile
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (e) {
                console.log('⚠️ Could not refresh audio context:', e.message);
                // Try to continue anyway
            }
        }
        
        // 🎯 ALSO ADD: User interaction context for mobile
        if (isMobile) {
            // Store that user has interacted (speech is user-initiated via conversation)
            window.lastUserInteractionTime = Date.now();
            console.log('📱 Mobile user interaction timestamp updated');
        }
        
        // Start API call
        const audioPromise = fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: message,
                model_id: 'eleven_turbo_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });

        console.log('🔄 ElevenLabs: Processing audio...');
        
        const response = await audioPromise;
        
        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Preload audio
        const audio = new Audio();
        audio.preload = 'auto';
        
        // 🎯 MOBILE: Add playsinline for mobile video
        if (isMobile) {
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', '');
        }
        
        // Set up event handlers BEFORE setting src
        audio.oncanplaythrough = function() {
            console.log('🎤 ElevenLabs: Audio ready - starting playback');
            audio.play();
        };
        
        // 🎯 KEEP ALL YOUR ORIGINAL BLOCKING LOGIC
        audio.onended = function() {
    console.log('🔍 ElevenLabs: Speech complete handler');
    window.isSpeaking = false;
    
    // 🎯 BLOCKING CONDITIONS
    if (window.isInConfirmationDialog) {
        console.log('🛑 BLOCKING BANNER - Confirmation dialog active');
        URL.revokeObjectURL(audioUrl);
        return;
    }
    
    // Click mention blocking
    const clickMentionTime = window.lastClickMentionTime || 0;
    const timeSinceClickMention = Date.now() - clickMentionTime;
    if (timeSinceClickMention < 10000) {
        console.log('🔇 SPEAK NOW BLOCKED: Recent click mention');
        return;
    }
    
    // Thank you splash blocking
    if (document.getElementById('thankYouSplash')) {
        console.log('🔇 SPEAK NOW BLOCKED: Thank you splash screen active');
        return;
    }
    
    // Conversation ended blocking
    const conversationState = window.conversationState || 'ready';
    if (conversationState === 'ended' || conversationState === 'splash_screen_active') {
        console.log('🔇 SPEAK NOW BLOCKED: Conversation ended');
        return;
    }
    
    // 🆕 ACTION CENTER & LEAD CAPTURE BLOCKING
    const actionCenterElement = document.getElementById('communication-action-center');
    const actionCenterVisible = actionCenterElement && 
                               actionCenterElement.style.display !== 'none' && 
                               actionCenterElement.offsetWidth > 0 && 
                               actionCenterElement.offsetHeight > 0;
    const leadCaptureActive = window.isInLeadCapture === true;
    const actionCenterShowing = !leadCaptureActive && !!actionCenterVisible;
    
    if (actionCenterShowing || leadCaptureActive) {
        console.log('🚫 ROOT BLOCK: Action Center or Lead Capture active');
        return;
    }
    
    // 🆕 CONCERN/TESTIMONIAL BLOCKING
    if (window.concernBannerActive || window.isInTestimonialMode) {
        console.log('🔇 SPEAK NOW BLOCKED: Concern/Testimonial mode active');
        return;
    }
    
    console.log('✅ No blocking conditions - calling showDirectSpeakNow()');
    
    // 🎯 CRITICAL: CALL THE BANNER FUNCTION
    if (typeof showDirectSpeakNow === 'function') {
        setTimeout(() => {
            showDirectSpeakNow();
        }, 300); // Small delay for better UX
    } else {
        console.warn('⚠️ showDirectSpeakNow not found');
        if (window.startRealtimeListening) {
            setTimeout(() => {
                window.startRealtimeListening();
            }, 800);
        }
    }
    
    // Clean up
    URL.revokeObjectURL(audioUrl);
};
        
        audio.onerror = function(error) {
            console.error('🚫 ElevenLabs: Audio playback error:', error);
            window.isSpeaking = false;
            
            // Fallback to British voice
            if (window.speakWithBritish) {
                console.log('🔄 Falling back to British voice');
                window.speakWithBritish(message);
            }
        };
        
        // Set source (triggers loading)
        audio.src = audioUrl;
        
    } catch (error) {
        console.error('🚫 ElevenLabs: Speech synthesis error:', error);
        window.isSpeaking = false;
        
        // Fallback to British voice
        if (window.speakWithBritish) {
            window.speakWithBritish(message);
        }
    }
}

// ===========================================
// BRITISH VOICE FALLBACK (KEEP GOOD VERSION)
// ===========================================
window.speakWithBritish = function(text) {
    return new Promise((resolve, reject) => {
        try {
            window.isSpeaking = true;
            
            // Cancel any ongoing speech
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // 🎯 REPLACE JUST THIS ARRAY:
            const britishVoicePriority = [
                // Microsoft Premium Online Voices (you have these!)
                'Microsoft Libby Online (Natural) - English (United Kingdom)',
                'Microsoft Ryan Online (Natural) - English (United Kingdom)', 
                'Microsoft Sonia Online (Natural) - English (United Kingdom)',
                'Microsoft Thomas Online (Natural) - English (United Kingdom)',
                
                // Standard Microsoft Voices
                'Microsoft Hazel - English (Great Britain)',
                'Microsoft Susan - English (Great Britain)',
                
                // Google Voices
                'Google UK English Female',
                'Google UK English Male',
                
                // MacOS Voices
                'Daniel', 'Kate', 'Serena', 'Oliver'
            ];
            
            // Find best voice - KEEP THIS CODE AS IS
            const voices = window.speechSynthesis.getVoices();
            for (const voiceName of britishVoicePriority) {
                const voice = voices.find(v => v.name === voiceName);
                if (voice) {
                    utterance.voice = voice;
                    break;
                }
            }
            
            utterance.rate = 1.0;
            utterance.pitch = 1.05;
            utterance.volume = 0.85;
            
            utterance.onend = () => {
    window.isSpeaking = false;
    console.log('✅ British voice: Speech complete');
    
    // 🎯 SAME BLOCKING LOGIC AS ABOVE
    if (!window.concernBannerActive && !window.isInTestimonialMode) {
        // Check all blocking conditions
        const clickMentionTime = window.lastClickMentionTime || 0;
        const timeSinceClickMention = Date.now() - clickMentionTime;
        const thankYouSplash = document.getElementById('thankYouSplash');
        const conversationState = window.conversationState || 'ready';
        const actionCenterElement = document.getElementById('communication-action-center');
        const actionCenterVisible = actionCenterElement && 
                                   actionCenterElement.style.display !== 'none' && 
                                   actionCenterElement.offsetWidth > 0 && 
                                   actionCenterElement.offsetHeight > 0;
        const leadCaptureActive = window.isInLeadCapture === true;
        const actionCenterShowing = !leadCaptureActive && !!actionCenterVisible;
        
        if (timeSinceClickMention < 10000) {
            console.log('🔇 SPEAK NOW BLOCKED: Recent click mention');
            resolve();
            return;
        }
        if (thankYouSplash) {
            console.log('🔇 SPEAK NOW BLOCKED: Thank you splash active');
            resolve();
            return;
        }
        if (conversationState === 'ended' || conversationState === 'splash_screen_active') {
            console.log('🔇 SPEAK NOW BLOCKED: Conversation ended');
            resolve();
            return;
        }
        if (window.isInConfirmationDialog) {
            console.log('🛑 BLOCKING BANNER - Confirmation dialog active');
            resolve();
            return;
        }
        if (actionCenterShowing || leadCaptureActive) {
            console.log('🚫 ROOT BLOCK: Action Center or Lead Capture active');
            resolve();
            return;
        }
        
        // 🎯 TRIGGER BANNER
        setTimeout(() => {
            if (typeof showDirectSpeakNow === 'function') {
                showDirectSpeakNow();
            }
        }, 300);
    }
    
    resolve();
};
            
            utterance.onerror = (error) => {
                if (error.error === 'interrupted') {
                    console.log('🔇 British voice interrupted');
                    resolve(); // Clean interruption
                } else {
                    console.error('🚫 British voice error:', error);
                    reject(error);
                }
                window.isSpeaking = false;
            };
            
            window.speechSynthesis.speak(utterance);
            
        } catch (error) {
            console.error('🚫 British voice initialization error:', error);
            window.isSpeaking = false;
            reject(error);
        }
    });
};

// ===========================================
// MAIN SPEAK FUNCTION - USE THIS EVERYWHERE
// ===========================================
window.speakText = async function(text) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log(`🔊 speakText called: "${text.substring(0, 30)}..."`);
    console.log(`   Platform: ${isMobile ? '📱 MOBILE' : '🖥️ DESKTOP'}`);
    
    // Clean emojis before speaking
    const cleanText = cleanEmojisFromSpeech ? cleanEmojisFromSpeech(text) : text;
    
    // 🎯 MOBILE PRE-WARM: Ensure audio context exists
    if (isMobile) {
        console.log('📱 Mobile: Pre-warming audio context...');
        try {
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
            silentAudio.volume = 0;
            await silentAudio.play();
            console.log('✅ Mobile audio context pre-warmed');
        } catch (e) {
            console.log('⚠️ Mobile pre-warm failed (may need user interaction):', e.message);
        }
    }
    
    // Always try ElevenLabs first
    try {
        await speakWithElevenLabs(cleanText);
    } catch (error) {
        console.log('🔄 ElevenLabs failed, falling back to British');
        
        // 🎯 MOBILE: Re-warm for British fallback
        if (isMobile) {
            try {
                const silentAudio = new Audio();
                silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
                silentAudio.volume = 0;
                await silentAudio.play();
            } catch (e) {
                console.log('⚠️ Could not re-warm for British fallback');
            }
        }
        
        await window.speakWithBritish(cleanText);
    }
};

// ===========================================
// BACKWARD COMPATIBILITY
// ===========================================
window.speakResponse = window.speakText;
window.speakResponseOriginal = window.speakText;

// ===========================================
// STOP FUNCTION
// ===========================================
window.stopAllSpeech = function() {
    console.log('🛑 Stopping all speech');
    
    // Stop any audio elements
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    
    // Stop speech synthesis
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    window.isSpeaking = false;
};

// ===========================================
// INITIALIZATION
// ===========================================
// Load voices when page loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        // Load speech synthesis voices
        if ('speechSynthesis' in window) {
            setTimeout(() => {
                window.speechSynthesis.getVoices();
            }, 100);
        }
        
        console.log('✅ Clean Voice System loaded');
        console.log('📱 Mobile:', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Yes' : 'No');
    });
}

// ===========================================
// 📧 EMAIL CONFIGURATION FIX
// ===========================================

// EmailJS configuration fix
window.emailJSFix = function() {
    console.log("📧 EMAIL FIX: Setting up EmailJS configuration...");
    
    // Check if EmailJS is loaded
    if (typeof emailjs !== 'undefined') {
        // Initialize EmailJS with public key (you need to get this from dashboard)
        try {
            emailjs.init("7-9oxa3UC3uKxtqGM"); // ← CAPTAIN: Replace with your public key
            console.log("✅ EmailJS initialized successfully");
        } catch (error) {
            console.error("❌ EmailJS initialization failed:", error);
            console.log("🔧 SOLUTION: Get your public key from https://dashboard.emailjs.com/admin/account");
        }
    } else {
        console.error("❌ EmailJS not loaded");
        console.log("🔧 SOLUTION: Make sure EmailJS script is included in your HTML");
    }
};

// Auto-run email fix
setTimeout(() => {
    window.emailJSFix();
}, 1000);

// ===================================================================
// 🎯 BANNER TRIGGER SYSTEM - MATCHES CAPTAIN'S 11 TEMPLATES
// ===================================================================
// 
// TRIGGER NAMES -> TEMPLATE IDENTIFIERS (exact match)
// ===================================================================

const bannerTriggers = {
    
    // BRANDING BANNER
    branding: {
        bannerType: 'branding',
        delay: 500,
        duration: 0,  // Persistent
        conditions: ['page_ready']
    },
    
    // EMAIL CONFIRMATION
    email_sent: {
        bannerType: 'emailSent',
        delay: 0,
        duration: 4000,  // Auto-hide after 4 seconds
        conditions: ['email_success']
    },
    
    // TESTIMONIAL REVIEWS
    show_testimonials: {
        bannerType: 'testimonialSelector',
        delay: 500,
        duration: 0,  // Persistent
        conditions: ['testimonial_ready']
    },
    
    // CLICK TO CALL
    click_to_call: {
        bannerType: 'clickToCall',
        delay: 0,
        duration: 0,  // Persistent
        conditions: ['call_ready']
    },
    
    // FREE INCENTIVE OFFER
    expertise: {
        bannerType: 'expertise',
        delay: 0,
        duration: 0,  // Persistent
        conditions: ['expertise_ready']
    },
    
    // FREE INCENTIVE
    freeIncentive: {
        bannerType: 'freeIncentive',
        delay: 0,
        duration: 0,  // Persistent
        conditions: ['incentive_ready']
    },
    
    // URGENT REQUEST
    urgent_message: {
        bannerType: 'urgent',
        delay: 0,
        duration: 0,  // Persistent
        conditions: ['urgent_ready']
    },
    
    // SCHEDULE APPOINTMENT
    schedule_appointment: {
        bannerType: 'setAppointment',
        delay: 0,
        duration: 0,  // Persistent
        conditions: ['scheduling_ready']
    },
    
    // PRE-QUALIFICATION
    pre_qualify: {
        bannerType: 'preQualifier',
        delay: 0,
        duration: 0,  // Persistent
        conditions: ['prequalify_ready']
    },
    
    // MEETING CONFIRMED
    meeting_confirmed: {
        bannerType: 'consultationConfirmed',
        delay: 0,
        duration: 5000,  // Auto-hide after 5 seconds
        conditions: ['booking_success']
    }
};

// Banner callback notification system
if (typeof window._bannerChangeCallbacks === 'undefined') {
    window._bannerChangeCallbacks = [];
}

window.onBannerChange = function(callback) {
    if (typeof callback === 'function') {
        window._bannerChangeCallbacks.push(callback);
        console.log('✅ Banner callback registered');
    }
};

// ===================================================================
// TRIGGER FUNCTION - Call from your voice chat system
// ===================================================================

function triggerBanner(triggerName) {
    console.log('🎖️ Triggering banner:', triggerName);
    
    const trigger = bannerTriggers[triggerName];
    
    if (!trigger) {
        console.warn(`❌ Unknown trigger: ${triggerName}`);
        return;
    }
    
    setTimeout(() => {
        if (typeof window.showUniversalBanner === 'function') {
            window.showUniversalBanner(trigger.bannerType);  // ✅ Use bannerType
        } else {
            console.error('❌ Banner engine not loaded');
        }
    }, trigger.delay);
}

// ===================================================
// 🎖️ UNIVERSAL MASTER BANNER TRIGGER SYSTEM
// ===================================================
window.triggerBanner = function(bannerType, options = {}) {
    console.log(`🎖️ Triggering banner: ${bannerType}`);
    
    const bannerMap = {
        'smart_button': 'smartButton',
        'consultation_offer': 'smartButton',  // ← ADD THIS LINE!
        'email_sent': 'emailSent', 
        'free_book': 'freeBook',
        'consultation_confirmed': 'consultationConfirmed',
        'thank_you': 'thankYou',
        'lead_capture': 'leadCapture'
    };
    
    const actualBannerType = bannerMap[bannerType] || bannerType;
    showUniversalBanner(actualBannerType, null, options);
};

// Condition checker (COMPLETE with all your logic)
function checkTriggerConditions(conditions, data) {
    return conditions.every(condition => {
        if (condition === 'email_success') return data.emailSuccess === true;
        if (condition === 'has_lead_magnet') return getActiveLeadMagnet() !== null;
        if (condition === 'booking_success') return data.bookingSuccess === true;
        if (condition === 'consultation_ready') return true; // Always allow consultation offers
        if (condition === 'consultation_declined') return true; // Always allow fallback offers
        if (condition === 'conversation_ended') return true; // Always allow thank you
        if (condition.startsWith('conversation_state:')) {
            const state = condition.split(':')[1];
            return conversationState === state;
        }
        return true;
    });
}

// ===================================================
// 🔇 SPEECH PAUSE HELPER
// ===================================================
function pauseSpeechForBannerInteraction() {
    console.log('🔇 Speech paused for banner interaction');
}

console.log('🎖️ Universal Master Banner Trigger System loaded - Ready for any industry!');

// ===================================================
// 🎯 BANNER SYSTEM 2.0 - WITH LEAD MAGNET INTEGRATION
// ===================================================

// 🚀 LEAD MAGNET CONFIGURATION (Dashboard Configurable)
const leadMagnetConfig = {
    active: true,
    title: "7 Secrets to Selling Your Practice",
    description: "Get Bruce's exclusive guide delivered instantly!",
    downloadLink: "https://bruces-book-link.com/download",
    emailText: "FREE BONUS: Your copy of '7 Secrets to Selling Your Practice' is included below:",
    includeInEmail: true,
    showInBanner: true,
    deliveryMethod: "both" // "email", "banner", or "both"
};

// 🎯 GET ACTIVE LEAD MAGNET (Called by Email System)
function getActiveLeadMagnet() {
    return leadMagnetConfig.active ? leadMagnetConfig : null;
}

// 🚀 DELIVER LEAD MAGNET (Called After Email Success)
function deliverLeadMagnet(leadMagnet, userEmail) {
    if (!leadMagnet) return;
    
    console.log('🎁 DELIVERING LEAD MAGNET:', leadMagnet.title);
    
    if (leadMagnet.showInBanner && leadMagnet.deliveryMethod !== "email") {
        setTimeout(() => {
            showUniversalBanner('leadMagnet');
        }, 3000); // Show lead magnet banner after 3 seconds
    }
}

function detectAndStoreUserName(message) {
    console.log('🔍 DEBUG: detectAndStoreUserName called with:', message);
    
    const namePatterns = [
        /my name is (\w+)/i,
        /i'm (\w+)/i,
        /call me (\w+)/i,
        /^(\w+)$/i,
        /this is (\w+)/i,
        /it's (\w+)/i,
        /you can call me (\w+)/i
    ];
    
    for (let pattern of namePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            const userName = match[1].trim();
            const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
            
            console.log('🎉 NAME CAPTURED FROM BUBBLE:', formattedName);
            
            // 🎯 STORE FOR FUTURE USE
            window.userFirstName = formattedName;
            
            // 🎯 SHOW WELCOME SPLASH SCREEN
            showWelcomeSplashScreen(formattedName);
            
            // 🎯 HIGHLIGHT THE NAME BUBBLE
            highlightNameBubble(formattedName);
            
            break;
        }
    }
}

function pauseSession() {
    console.log('⏸️ PAUSE SESSION clicked');
    
    // Stop any current speech
    if (typeof stopAllSpeech === 'function') {
        stopAllSpeech();
    }
    
    // If you have a specific pause function
    if (typeof pauseVoiceSession === 'function') {
        pauseVoiceSession();
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'pause-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create overlay content
    overlay.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a2a6c, #2c3e50);
            border: 2px solid #00ff1e;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            max-width: 400px;
            width: 90%;
            animation: slideIn 0.3s ease;
        ">
            <h3 style="color: #00ff1e; margin-bottom: 10px; font-size: 24px;">⏸️ Session Paused</h3>
            <p style="color: white; margin-bottom: 30px; opacity: 0.8;">Your session has been paused. Ready to continue?</p>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button onclick="resumeSession()" style="
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #00ff1e, #00cc00);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    min-width: 150px;
                ">▶️ RESUME SESSION</button>
                
                <button onclick="exitSession()" style="
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #ff4757, #ff3742);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    min-width: 150px;
                ">⏹️ EXIT SESSION</button>
            </div>
        </div>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { 
                    opacity: 0; 
                    transform: translateY(-30px) scale(0.9);
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1);
                }
            }
        </style>
    `;
    
    document.body.appendChild(overlay);
    
    // Add click outside to close
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            resumeSession();
        }
    });
}

// Resume Session Function - Exact same flow as initial experience
function resumeSession() {
    console.log('▶️ RESUME SESSION clicked');
    
    // Remove overlay
    const overlay = document.getElementById('pause-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Add AI welcome back message to chat
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        const welcomeBackMessage = document.createElement('div');
        welcomeBackMessage.className = 'ai-message';
        welcomeBackMessage.innerHTML = `
            <div style="padding: 15px; border-radius: 20px; background: rgba(255,255,255,0.1); margin: 10px 0;">
                <strong>Good to see you again! 👋</strong><br><br>
                Is there anything else I can answer for you about practice valuation, buying, or selling?<br><br>
                Or would you prefer a <strong>free consultation</strong> with one of our specialists?
            </div>
        `;
        chatMessages.appendChild(welcomeBackMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Speak the welcome message and THEN show Speak Now banner
    if (typeof speakText === 'function') {
        // Store original onSpeechEnd function if it exists
        const originalOnSpeechEnd = window.onSpeechEnd;
        
        // Override to show Speak Now banner when speech ends
        window.onSpeechEnd = function() {
            console.log('✅ AI finished speaking - showing Speak Now banner');
            
            // Show the Speak Now banner (just like initial flow)
            const speakNowButton = document.getElementById('speakNowButton');
            if (speakNowButton) {
                speakNowButton.style.display = 'flex';
            }
            
            // Restore original function if it existed
            if (originalOnSpeechEnd) {
                window.onSpeechEnd = originalOnSpeechEnd;
            }
            
            // Restart voice recognition
            if (typeof startVoiceRecognition === 'function') {
                startVoiceRecognition();
            } else if (typeof activateMicrophone === 'function') {
                activateMicrophone();
            }
        };
        
        // Speak the welcome message
        speakText("Good to see you again! Is there anything else I can answer for you about practice valuation, buying, or selling? Or would you prefer a free consultation with one of our specialists?");
        
    } else {
        // Fallback: Show Speak Now banner immediately
        const speakNowButton = document.getElementById('speakNowButton');
        if (speakNowButton) {
            speakNowButton.style.display = 'flex';
        }
        
        // Restart voice system
        if (typeof startVoiceRecognition === 'function') {
            startVoiceRecognition();
        } else if (typeof activateMicrophone === 'function') {
            activateMicrophone();
        }
    }
    
    console.log('✅ Session resumed - AI speaking welcome message');
}

// Exit Session Function
function exitSession() {
    console.log('⏹️ EXIT SESSION clicked');
    
    // Remove overlay
    const overlay = document.getElementById('pause-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Use your existing exit function
    if (typeof exitToMainSite === 'function') {
        exitToMainSite();
    }
}

// ===================================================
// 🎯 FIXED BRIDGE - NO NAMING CONFLICTS!
// ===================================================

function bridgeShowTestimonialVideo(testimonialType, duration = 12000) {
    console.log('🎯 BRIDGE: Video path → Testimonial Player');
    // Call the DIRECT video function from testimonials-player.js
    if (typeof window.showTestimonialVideo === 'function') {
        window.showTestimonialVideo(testimonialType);
    }
}

function bridgeShowReviewsBanner() {
    console.log('🎯 BRIDGE: Banner path → Universal Banner Engine');
    // Call the UNIVERSAL BANNER ENGINE for testimonial banner
    if (typeof window.showUniversalBanner === 'function') {
        window.showUniversalBanner('testimonialSelector');
    }
}

// ===================================================
// 🎯 STEP 1: RETROFITTED handleSmartButtonClick()
// ===================================================
function handleSmartButtonClick(buttonType) {
    console.log(`🚨 Smart button clicked: ${buttonType}`);

  // 1. REMOVE THE CONSULTATION BANNER IMMEDIATELY
const existingContainer = document.getElementById('bannerHeaderContainer');
if (existingContainer) {
    existingContainer.remove();
    console.log('🗑️ Consultation banner removed');
}

// 2. IMMEDIATELY restore branding banner
setTimeout(() => {
    console.log('🎯 Button clicked - immediately restoring branding');
    window.restoreBrandingBanner();
}, 200);
    
    // Fix buttonType if it's an event object
    if (typeof buttonType === 'object') {
        buttonType = 'valuation';
    }

    // 1. HIDE THE SMART BUTTON IMMEDIATELY
    const smartButton = document.getElementById('smartButton');
    if (smartButton) {
        smartButton.style.display = 'none';
    }
    
    // 4. HIDE THE GREEN "SPEAK NOW" BANNER - DON'T SHOW IT YET!
    const liveTranscript = document.getElementById('liveTranscript');
    if (liveTranscript) {
        liveTranscript.style.display = 'none';
        restoreQuickButtons(); // Show quick buttons again
    }
    
    // 5. UPDATE UI ELEMENTS
    const transcriptText = document.getElementById('transcriptText');
    if (transcriptText) {
        transcriptText.textContent = '';
        transcriptText.style.display = 'none';
    }
    
    const micButton = document.querySelector('.mic-btn');
    if (micButton) {
        micButton.innerHTML = '📋';
        micButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
    }
    
    console.log('🎯 Starting lead capture for:', buttonType);
    
    // 6. START LEAD CAPTURE SYSTEM (BUT NO LISTENING YET!)
    if (typeof initializeLeadCapture === 'function') {
        initializeLeadCapture(buttonType);
    }
}

// ===================================================  
// 🎯 STEP 2: CLEAN updateSmartButton()
// ===================================================
function updateSmartButton(shouldShow, buttonText, action) {
    if (shouldShow) {
        triggerBanner('smart_button', {
            trigger: 'system_call',
            buttonText: buttonText,
            action: action
        });
    }
    
}

// =============================================================================
// 🎯 CRITICAL: AUTO-INITIALIZE SalesAI ON PAGE LOAD
// =============================================================================
window.salesAI = window.salesAI || {
    state: 'introduction',
    userData: { firstName: '', intent: null },
    getInvestigationQuestion: function() {
        const questions = {
            'sell-practice': "How long have you been thinking about selling your practice?",
            'buy-practice': "What type of practice are you looking to acquire?",
            'pre-qualification': "What's driving your interest for a pre-qualification right now?"
        };
        return questions[this.userData.intent] || "What specifically are you looking to accomplish?";
    }
};
console.log('🔄 SalesAI auto-initialized on page load:', window.salesAI);

// =============================================
// 🚨 ADD THESE MISSING FUNCTIONS RIGHT AFTER getPreCloseQuestion
// =============================================

function handleStrongIntentWithTrustBuilding(intent, message) {
    const userFirstName = salesAI.userData.firstName || 'there';
    console.log(`🏠 TRUST-BUILDING: Handling ${intent.type} for ${userFirstName}, state: ${salesAI.state}`);
    
    switch(intent.type) {
        case 'sell-practice':
            return handleSellPracticeIntent(message, userFirstName);
            
        case 'buy-practice':
            return handleBuyPracticeIntent(message, userFirstName);
            
        case 'pre-qualification':
            return handlePreQualifyIntent(message, userFirstName);
            
        case 'general-question':
            return handleGeneralQuestion(message, userFirstName);
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion(intent);
    }
}

function handleSellPracticeIntent(message, userName) {
    console.log(`🏠 SELL PRACTICE TRUST-BUILDING: state=${salesAI.state}, user=${userName}, message=${message}`);
    
    switch(salesAI.state) {
        case 'investigation':
            // 🎯 STEP 1: Build rapport & understand motivation
            salesAI.state = 'building_trust_sell';
            return `${userName}, that's a significant decision. Selling a practice isn't just about the price - it's about your legacy and ensuring your clients are in good hands. How long have you been considering this move?`;
            
        case 'building_trust_sell':
            // 🎯 STEP 2: Understand timing & urgency - WITH PERSONALIZATION!
            salesAI.state = 'understanding_timing_sell';
            
            // Extract number of years from the message for personalization
            const yearMatch = message.match(/\d+/);
            if (yearMatch) {
                const years = yearMatch[0];
                return `${userName}, ${years} years is definitely a substantial time to build a practice. What's your ideal timeline for the transition? Are you looking to sell in the next few months, or taking a more measured approach?`;
            } else {
                return `I appreciate you sharing that ${userName}. What's your ideal timeline for the transition? Are you looking to sell in the next few months, or taking a more measured approach?`;
            }
            
        case 'understanding_timing_sell':
            // 🎯 STEP 3: Custom close based on their timing - WITH PERSONALIZATION!
            salesAI.state = 'pre_close';
            
            const wantsQuickSale = message.toLowerCase().includes('soon') || 
                                 message.toLowerCase().includes('quick') || 
                                 message.toLowerCase().includes('asap') ||
                                 message.toLowerCase().includes('month') ||
                                 message.toLowerCase().includes('immediately') ||
                                 message.toLowerCase().includes('right away');
            
            if (wantsQuickSale) {
                return `If we could help you sell 20-30% faster than going it alone while maximizing your sale price, would you be open to a valuation consultation with Bruce,the founder and CEO of NCI?`;
            } else {
                return `If we could secure you 20-30% more for your practice than selling independently, would you be interested in a valuation consultation with Bruce,the founder and CEO of NCI?`;
            }
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion({type: 'sell-practice'});
    }
}

function handleBuyPracticeIntent(message, userName) {
    console.log(`🏠 BUY PRACTICE TRUST-BUILDING: state=${salesAI.state}, user=${userName}, message=${message}`);
    
    switch(salesAI.state) {
        case 'investigation':
            // 🎯 STEP 1: Understand their buying motivation
            salesAI.state = 'building_trust_buy';
            return `${userName}, acquiring a practice is an exciting growth opportunity! Are you looking to expand your current operations, or is this your first practice purchase?`;
            
        case 'building_trust_buy':
            // 🎯 STEP 2: Understand their criteria - WITH PERSONALIZATION!
            salesAI.state = 'understanding_criteria_buy';
            
            // Personalize based on their response
            if (message.toLowerCase().includes('first') || message.toLowerCase().includes('new')) {
                return `That's fantastic, ${userName}! Starting with an established practice is a smart move. What type of practice are you ideally looking for? Any specific size, location, or specialty you're targeting?`;
            } else if (message.toLowerCase().includes('expand') || message.toLowerCase().includes('grow')) {
                return `Excellent strategy, ${userName}! Expanding through acquisition can really accelerate your growth. What type of practice would complement your current operations?`;
            } else {
                return `Thanks for sharing that, ${userName}. What type of practice are you ideally looking for? Any specific size, location, or specialty you're targeting?`;
            }
            
        case 'understanding_criteria_buy':
            // 🎯 STEP 3: Custom close for buyers - WITH PERSONALIZATION!
            salesAI.state = 'pre_close';
            
            // Extract key criteria for personalization
            let criteria = '';
            if (message.toLowerCase().includes('location')) {
                criteria = 'in your preferred location';
            } else if (message.toLowerCase().includes('size') || message.toLowerCase().includes('revenue')) {
                criteria = 'that matches your size requirements';
            } else if (message.toLowerCase().includes('specialty') || message.toLowerCase().includes('niche')) {
                criteria = 'in your specialty area';
            } else {
                criteria = 'that fits your criteria';
            }
            
            return `${userName}, if we could help you find practices ${criteria} and provide financing guidance, would you be interested in a free acquisition consultation?`;
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion({type: 'buy-practice'});
    }
}

function handlePreQualifyIntent(message, userName) {
    console.log(`🏠 PRE-QUALIFICATION TRUST-BUILDING: state=${salesAI.state}, user=${userName}, message=${message}`);
    
    switch(salesAI.state) {
        case 'investigation':
            // 🎯 STEP 1: Understand pre-qualification motivation
            salesAI.state = 'building_trust_prequal';
            return `${userName}, Getting properly pre-qualified is such an important first step whether you're looking to buy your first practice, expand to multiple locations, or just understand what's financially possible. What's motivating you to explore practice ownership right now?`;
            
        case 'building_trust_prequal':
            // 🎯 STEP 2: Understand goals context - WITH PERSONALIZATION!
            salesAI.state = 'understanding_prequal_goals';
            
            // Personalize based on their motivation
            if (message.toLowerCase().includes('first') || message.toLowerCase().includes('new') || message.toLowerCase().includes('start')) {
                return `That's exciting, ${userName}! Buying your first practice is a huge milestone. Are you looking for a specific type of practice, or are you open to exploring different opportunities?`;
            } else if (message.toLowerCase().includes('expand') || message.toLowerCase().includes('grow') || message.toLowerCase().includes('additional')) {
                return `Smart thinking, ${userName}! Expanding with additional locations is a great growth strategy. Are you looking to add to your current operations, or explore new markets?`;
            } else if (message.toLowerCase().includes('retire') || message.toLowerCase().includes('succession') || message.toLowerCase().includes('transition')) {
                return `Very prudent, ${userName}. Planning for ownership transition is so important. Are you considering this as a long-term succession plan, or more immediate transition?`;
            } else {
                return `That's very insightful, ${userName}. Are you looking for your first practice ownership opportunity, or thinking about expanding your current operations?`;
            }
            
        case 'understanding_prequal_goals':
            // 🎯 STEP 3: Custom close for pre-qualification - WITH PERSONALIZATION!
            salesAI.state = 'pre_close';
            
            const isFirstTime = message.toLowerCase().includes('first') || 
                               message.toLowerCase().includes('new') || 
                               message.toLowerCase().includes('start');
            
            if (isFirstTime) {
                return `${userName}, if we could help you get pre-qualified and find the perfect first practice that fits your goals and budget, would you be interested in a free pre-qualification consultation with Bruce?`;
            } else {
                return `${userName}, if we could help you get pre-qualified and identify expansion opportunities that align with your growth strategy, would you be interested in a free pre-qualification consultation with Bruce?`;
            }
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion({type: 'pre-qualification'});
    }
}

function handleGeneralQuestion(message, userName) {
    console.log(`🏠 GENERAL QUESTION: state=${salesAI.state}, user=${userName}, message=${message}`);
    
    // For general questions, we can be more direct but still personalized
    if (salesAI.state === 'investigation') {
        salesAI.state = 'pre_close_general';
        
        // Acknowledge their specific question type
        if (message.toLowerCase().includes('how') || message.toLowerCase().includes('what') || message.toLowerCase().includes('can')) {
            return `I understand you have some questions about how this works, ${userName}. If we could provide you with clear answers and help you explore your options, would you be open to a quick consultation with one of our specialists?`;
        } else if (message.toLowerCase().includes('cost') || message.toLowerCase().includes('price') || message.toLowerCase().includes('fee')) {
            return `Those are important questions about investment, ${userName}. If we could provide you with transparent pricing and show you the potential return, would you be interested in a free consultation to discuss the numbers?`;
        } else {
            return `I understand you have some questions, ${userName}. If we could provide you with clear answers and help you explore your options, would you be open to a quick consultation with one of our specialists?`;
        }
    }
    
    salesAI.state = 'pre_close';
    return `Would you like to schedule a quick call with one of our specialists to discuss this further?`;
}

// ADD THIS FUNCTION RIGHT BEFORE getAIResponse
function detectConcernOrObjection(userText) {
    console.log('🔍 Checking for concerns in:', userText);
    
    // Common sales objections/concerns
    const concerns = [
        { pattern: /\b(expensive|price|cost|too much|how much)\b/i, type: 'price' },
        { pattern: /\b(scam|trust|legitimate|real|fake)\b/i, type: 'trust' },
        { pattern: /\b(time|busy|not now|later)\b/i, type: 'time' },
        { pattern: /\b(complicated|hard|difficult|complex)\b/i, type: 'complexity' },
        { pattern: /\b(work|effective|results|does it work)\b/i, type: 'effectiveness' }
    ];
    
    const lowerText = userText.toLowerCase();
    
    for (const concern of concerns) {
        if (concern.pattern.test(lowerText)) {
            console.log(`🚨 Concern detected: ${concern.type}`);
            window.detectedConcernType = concern.type;
            return true;
        }
    }
    
    window.detectedConcernType = null;
    return false;
}

// ALSO ADD detectStrongIntent RIGHT AFTER IT
function detectStrongIntent(userText) {
    console.log('🎯 detectStrongIntent checking:', userText);
    
    // Define strong intents that should trigger immediate actions
    const strongIntents = [
        { pattern: /\b(buy|purchase|order|get started)\b/i, type: 'buying_intent' },
        { pattern: /\b(call me|contact me|schedule|meeting)\b/i, type: 'contact_intent' },
        { pattern: /\b(how much|price|pricing|cost)\b/i, type: 'pricing_intent' },
        { pattern: /\b(features|what does it do|capabilities)\b/i, type: 'features_intent' }
    ];
    
    const lowerText = userText.toLowerCase().trim();
    
    for (const intent of strongIntents) {
        if (intent.pattern.test(lowerText)) {
            console.log(`🎯 STRONG INTENT DETECTED: ${intent.type}`);
            return { detected: true, type: intent.type };
        }
    }
    
    return { detected: false, type: null };
}

// THEN YOUR EXISTING getAIResponse FUNCTION CONTINUES...
async function getAIResponse(userMessage) {
    // This function calls detectConcernOrObjection and detectStrongIntent
    // ... rest of your code ...
}

// DEFINE THE MISSING detectStrongIntent FUNCTION
function detectStrongIntent(userText) {
    console.log('🎯 detectStrongIntent checking:', userText);
    
    // Define strong intents that should trigger immediate actions
    const strongIntents = [
        // Buying/sales intents
        { 
            pattern: /\b(buy|purchase|order|get started|sign up|subscribe|take my money|ready to buy)\b/i, 
            type: 'buying_intent',
            action: 'handleBuyingIntent'
        },
        // Contact/scheduling intents
        { 
            pattern: /\b(call me|contact me|schedule|meeting|appointment|demo|talk to someone)\b/i, 
            type: 'contact_intent',
            action: 'handleContactIntent'
        },
        // Pricing intents
        { 
            pattern: /\b(how much|price|pricing|cost|quote|rates|fee|subscription cost)\b/i, 
            type: 'pricing_intent',
            action: 'handlePricingIntent'
        },
        // Feature inquiries
        { 
            pattern: /\b(features|what does it do|capabilities|how it works|show me)\b/i, 
            type: 'features_intent',
            action: 'handleFeaturesIntent'
        }
    ];
    
    const lowerText = userText.toLowerCase().trim();
    
    for (const intent of strongIntents) {
        if (intent.pattern.test(lowerText)) {
            console.log(`🎯 STRONG INTENT DETECTED: ${intent.type}`);
            return {
                detected: true,
                type: intent.type,
                action: intent.action
            };
        }
    }
    
    return { detected: false, type: null, action: null };
}

// Also define the handler functions if they don't exist
if (typeof window.handleBuyingIntent === 'undefined') {
    window.handleBuyingIntent = function(userText, intentType) {
        console.log(`🛒 Handling buying intent: ${userText}`);
        // For now, return a response - you can customize this
        return "I can help you with that! Let me connect you with our sales team, or would you like to proceed with our self-service checkout?";
    };
}

if (typeof window.handleContactIntent === 'undefined') {
    window.handleContactIntent = function(userText, intentType) {
        console.log(`📞 Handling contact intent: ${userText}`);
        return "I'd be happy to schedule a call! What's the best time for you, and could you share your email or phone number?";
    };
}

if (typeof window.handlePricingIntent === 'undefined') {
    window.handlePricingIntent = function(userText, intentType) {
        console.log(`💰 Handling pricing intent: ${userText}`);
        return "Our pricing starts at $97/month for the basic plan. What's your budget range, and how many team members will be using it?";
    };
}

if (typeof window.handleFeaturesIntent === 'undefined') {
    window.handleFeaturesIntent = function(userText, intentType) {
        console.log(`⚡ Handling features intent: ${userText}`);
        return "Our platform includes AI-powered lead generation, automated follow-ups, CRM integration, and analytics dashboard. Which features are you most interested in?";
    };
}

console.log('✅ detectStrongIntent and handlers defined!');

// =============================================================================
// 🎯 GOLD STANDARD getAIResponse - 4-STEP SALES PROCESS - CLEAN VERSION
// =============================================================================
async function getAIResponse(userMessage, conversationHistory = []) {
    console.log('🎯 GOLD STANDARD getAIResponse called:', userMessage);   

    // 🎯 STEP 0: CHECK FOR CONCERNS FIRST
    if (detectConcernOrObjection(userMessage)) {
        console.log('🚨 Concern detected - handling with testimonial');
        const concernType = window.detectedConcernType || 'general';
        console.log(`🎯 Calling handleConcernWithTestimonial with type: ${concernType}`);
        handleConcernWithTestimonial(userMessage, concernType);
        return; // Stop the sales process for concerns
    }

    // Initialize Sales AI if not exists
    if (!window.salesAI) {
        window.salesAI = {
            state: 'introduction',
            userData: { firstName: '', intent: null },
            getInvestigationQuestion: function() {
                const questions = {
                    'sell-practice': "How long have you been thinking about selling your practice?",
                    'buy-practice': "What type of practice are you looking to acquire?",
                    'pre-qualification': "What's driving your interest in a pre-qualification right now?"
                };
                return questions[this.userData.intent] || "What specifically are you looking to accomplish?";
            }
        };
        console.log('🔄 SalesAI initialized');
    }

    const lowerMessage = userMessage.toLowerCase();

    // Close Speak Now banner when AI responds
    const speakNowBanner = document.querySelector('.speak-now-banner');
    if (speakNowBanner) {
        speakNowBanner.remove();
        console.log('✅ Speak Now banner removed - AI responding');
    }
    
    // 🎯 MACARONI BUNDLE: Urgent + Appointment Intents - HIGH PRIORITY
    const urgentPatterns = ['urgent', 'asap', 'right now', 'immediately', 'emergency', 'call me now', 'need help now'];
    const appointmentPatterns = [
        'appointment', 'meeting', 'schedule', 'book', 'reserve', 'set up',
        'consult', 'consultation', 'call', 'talk to bruce', 'meet with bruce',
        'free consultation', 'free consult', 'book a meeting'
    ];

    // Check for URGENT first (highest priority)
    if (urgentPatterns.some(pattern => lowerMessage.includes(pattern))) {
        console.log('🚨 URGENT INTENT DETECTED - FAST TRACKING TO BRUCE');
        
        // 🎯 TRIGGER ACTION CENTER IMMEDIATELY
        setTimeout(() => {
            if (window.triggerLeadActionCenter) {
                window.triggerLeadActionCenter(); // ✅ SILENT VERSION
                console.log('✅ SILENT Communication Relay Center triggered for urgent request');
            }
        }, 1000);

        const response = "I understand this is urgent! Let me bring up all the ways to connect with Bruce, the founder and CEO of NCI immediately.";
        
        // 🎯 SPEAK THE RESPONSE
        if (window.speakText) {
            window.speakText(response);
        }
        
        return response;
    }

    // Check for APPOINTMENT second
    if (appointmentPatterns.some(pattern => lowerMessage.includes(pattern))) {
        console.log('🎯 APPOINTMENT INTENT DETECTED - Triggering Action Center');
        
        setTimeout(() => {
            if (window.triggerLeadActionCenter) {
                window.triggerLeadActionCenter(); // ✅ SILENT VERSION
                console.log('✅ SILENT Action Center triggered for appointment request');
            }
        }, 1000);
        
        const response = "Perfect! I'd love to help you schedule that. Let me bring up all the ways to connect with Bruce,the founder and CEO of NCI for your appointment.";
        
        // 🎯 SPEAK THE RESPONSE
        if (window.speakText) {
            window.speakText(response);
        }
        
        return response;
    }
    
    // 🎯 STEP 2: STRONG INTENT DETECTION & 4-STEP SALES PROCESS
    const strongIntent = detectStrongIntent(userMessage);
    if (strongIntent) {
        console.log('🎯 STRONG INTENT DETECTED:', strongIntent);
        const response = handleStrongIntentWithTrustBuilding(strongIntent, userMessage);
        
        // 🎯 SPEAK THE RESPONSE
        if (window.speakText) {
            window.speakText(response);
        }
        
        return response;
    }
    
    // 🎯 STEP 3: PRE-CLOSE HANDLING
    if (window.salesAI.state === 'pre_close') {
        console.log('🎯 Processing pre-close response...');
        const response = handlePreCloseResponse(userMessage, window.salesAI.userData.intent);
        
        // 🎯 SPEAK THE RESPONSE
        if (window.speakText) {
            window.speakText(response);
        }
        
        if (response.includes("Simply click the book consultation button")) {
            // User said YES - trigger SILENT Communication Relay Center
            window.salesAI.state = 'lead_capture';
            console.log('✅ User said YES - triggering SILENT Communication Relay Center');
            
            setTimeout(() => {
                if (window.triggerLeadActionCenter) {
                    window.triggerLeadActionCenter(); // ✅ SILENT VERSION
                    console.log('✅ SILENT Action Center triggered for pre-close YES response');
                }
            }, 1000);

        } else {
            // User said SKIP - return to investigation
            window.salesAI.state = 'investigation';
            console.log('🔄 User said SKIP - returning to investigation');
        }
        
        return response;
    }

    // 🎯 INTRODUCTION HANDLING - NAME CAPTURE
    if (window.salesAI.state === 'introduction') {
        console.log('🎯 Handling introduction - capturing name...');
        
        // Simple name handling
        if (!window.salesAI.userData.firstName) {
            const name = userMessage.split(' ')[0];
            if (name && name.length > 1) {
                window.salesAI.userData.firstName = name;
                window.salesAI.state = 'investigation';

                // 🎉 Trigger welcome splash for user
                const userName = window.salesAI?.userData?.firstName;
                if (userName && userName.length > 0 && !window.welcomeSplashShown) {
                    console.log('🎉 Triggering welcome splash for:', userName);
                    setTimeout(() => {
                        if (window.showWelcomeSplash) {
                            window.showWelcomeSplash(userName);
                        }
                    }, 100);
                }
                
                const response = `Nice to meet you ${name}! What brings you to New Clients Inc today?`;
                
                // 🎯 SPEAK THE RESPONSE
                if (window.speakText) {
                    window.speakText(response);
                }
                
                return response;
            } else {
                const response = "Hi! I'm your practice transition assistant. What's your first name?";
                
                // 🎯 SPEAK THE RESPONSE
                if (window.speakText) {
                    window.speakText(response);
                }
                
                return response;
            }
        }
    }

    console.log('🔄 No strong intent - using original system logic');
    
    // 🧠 STEP 5: FALLBACK TO ORIGINAL LOGIC
    if (typeof getOpenAIResponse === 'function') {
        const response = await getOpenAIResponse(userMessage, conversationHistory);
        
        // 🎯 SPEAK THE RESPONSE
        if (window.speakText) {
            window.speakText(response);
        }
        
        return response;
    } else {
        const response = "I appreciate your message! That's something Bruce,the founder and CEO of NCI would be perfect to help with. Would you like me to connect you with him for a free consultation?";

        // 🎯 BRUCE PRE-CLOSE QUESTION SET: 
        window.lastPreCloseQuestion = response;
        window.lastPreCloseIntent = 'bruce_consultation';
        window.conversationState = 'qualification';
        console.log('🎯 BRUCE PRE-CLOSE QUESTION SET');

        // 🚀 CRITICAL FIX: Show Free Consultation Banner
        setTimeout(() => {
            // 1. TRIGGER FREE CONSULTATION BANNER
            if (typeof showUniversalBanner === 'function') {
                showUniversalBanner('setAppointment');
                console.log('✅ Free Consultation Banner triggered');
            }
        }, 50);
        
        // 🎯 SPEAK THE RESPONSE
        if (window.speakText) {
            window.speakText(response);
        }
        
        return response;
    }
}

// =============================================================================
// 🎯 EMERGENCY BRUCE DETECTION - Keep this separate function
// =============================================================================

// Add this emergency Bruce detection in getAIResponse
const originalGetAIResponse = window.getAIResponse;
window.getAIResponse = function(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 🎯 EMERGENCY BRUCE DETECTION
    if ((lowerMessage.includes('yes') || lowerMessage.includes('yeah') || lowerMessage.includes('sure')) &&
        window.lastPreCloseIntent === 'bruce_consultation') {
        
        console.log('🎯 EMERGENCY BRUCE YES DETECTED - Triggering Action Center IMMEDIATELY');
        
        // Clear the context
        window.lastPreCloseIntent = null;
        window.lastPreCloseQuestion = null;
        
        // 🚀 CRITICAL: Trigger Action Center IMMEDIATELY (no delays)
        if (window.triggerLeadActionCenter) {
            window.triggerLeadActionCenter();
            console.log('✅ Action Center triggered IMMEDIATELY via emergency detection');
        }
        
        // Return instruction speech that plays AFTER Action Center is visible
        const response = "Great! I can make that painless with my assistance after clicking one of our communication relay buttons on your screen";
        
        // 🎯 SPEAK THE RESPONSE
        if (window.speakText) {
            window.speakText(response);
        }
        
        return response;
    }

    return originalGetAIResponse.apply(this, arguments);
};
// ===================================================
// 🎨 WHOLE BUTTON COLOR GLOW ANIMATION - UPDATED
// ===================================================
if (!document.getElementById('speakNowWholeButtonGlowAnimation')) {
    const speakNowGlowStyle = document.createElement('style');
    speakNowGlowStyle.id = 'speakNowWholeButtonGlowAnimation';
    speakNowGlowStyle.textContent = `
        @keyframes speakNowWholeButtonGlow {
            0%, 100% { 
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.3);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
            }
            50% { 
                background: rgba(20, 209, 89, 0.74);
                border-color: rgba(34, 197, 94, 0.6);
                box-shadow: 0 8px 30px rgba(34, 197, 94, 0.3);
            }
        }
    `;
    document.head.appendChild(speakNowGlowStyle);
}

// 🎨 HEADER SLIDE ANIMATION
const headerBannerStyle = document.createElement('style');
headerBannerStyle.textContent = `
    @keyframes slideDownHeader {
        from { 
            transform: translateY(-20px);
            opacity: 0;
        }
        to { 
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(headerBannerStyle);

// ===================================================
// 🎨 ELECTRIC BLUE GLOW ANIMATION FOR SMART BANNER
// ===================================================
if (!document.getElementById('bannerGlowAnimation')) {
    const bannerGlowStyle = document.createElement('style');
    bannerGlowStyle.id = 'bannerGlowAnimation';
    bannerGlowStyle.textContent = `
        @keyframes shimmerGlow {
    0%, 100% { 
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    50% { 
        background: rgba(0, 255, 55, 0.65);
        box-shadow: 0 4px 15px rgba(0, 255, 98, 0.4);
            }
        }
    `;
    document.head.appendChild(bannerGlowStyle);
}

// 🎯 AUTO-SCROLL CHAT WHEN BANNER APPEARS
function adjustChatForBanner(bannerHeight = 80) {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        // Calculate new height to accommodate banner
        const currentHeight = chatMessages.offsetHeight;
        const newHeight = currentHeight - bannerHeight;
        
        // Adjust chat area height
        chatMessages.style.height = newHeight + 'px';
        chatMessages.style.maxHeight = newHeight + 'px';
        
        // Force scroll to bottom to show latest messages
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
        
        console.log(`📊 Chat adjusted: ${currentHeight}px → ${newHeight}px`);
    }
}

// 🎯 RESTORE CHAT WHEN BANNER DISAPPEARS
function restoreChatHeight() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        // Restore original height
        chatMessages.style.height = '45vh'; // Or whatever your original height was
        chatMessages.style.maxHeight = '45vh';
        
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
}

// ===================================================
// 🎯 REMOVE LEAD CAPTURE BANNER
// ===================================================
function removeLeadCaptureBanner() {
    const existingBanner = document.getElementById('leadCaptureBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    // 🎯 RESTORE ORIGINAL PADDING
    const container = document.querySelector('.container');
    if (container) {
        const currentPadding = parseInt(container.style.paddingTop) || 0;
        container.style.paddingTop = Math.max(0, currentPadding - 70) + 'px';
    }
    
    console.log('🎨 Lead capture banner removed and padding restored');
}

// ===================================================
// 🔄 COMPLETE LEAD CAPTURE WITH EMAIL INTEGRATION
// ===================================================
function initializeLeadCapture(buttonType = 'valuation') {
    console.log('🚀 Starting complete lead capture system...');
    
    if (isInLeadCapture) return;
    
    leadData = {
        name: '', 
        phone: '', 
        email: '', 
        contactTime: '', 
        inquiryType: buttonType,
        transcript: '',
        step: 0,
        subStep: 'ask',
        tempAnswer: '',
        questions: [
            "Perfect. Let's start with your full name, please.",  // ← YOUR PREFERRED WORDING
            "What's the best phone number to reach you?", 
            "What's your email address?",
            "When would be the best time for our specialist to contact you?"
        ],
        confirmationPrompts: [
            "I heard {answer}, is that correct?",
            "So that's {answer}, is that right?",
            "Let me confirm - {answer}, correct?",
            "Your preferred time is {answer}, is that accurate?"
        ]
    };
    
    isInLeadCapture = true;
    
    // ✅ REMOVED the extra message - go straight to the question
    setTimeout(() => {
        askLeadQuestion(); // This will say "Perfect. Let's start with your full name, please."
    }, 500); // Shorter delay since no intro message
}

function askLeadQuestion() {
    if (!isInLeadCapture || !leadData) return;
    
    if (leadData.step < leadData.questions.length) {
        const question = leadData.questions[leadData.step];
        addAIMessage(question);
        
        console.log('🎤 Lead Capture: Speaking question...');
        
        // Stop any existing listening
        if (window.stopListening) window.stopListening();
        
        // Speak the question
        speakMessage(question);
        
        // 🎯 SIMPLE: Wait for speech to finish, then listen immediately
        const checkSpeech = setInterval(() => {
            if (!window.isSpeaking) {
                clearInterval(checkSpeech);
                console.log('✅ AI finished - starting listening NOW');
                if (isInLeadCapture && window.startRealtimeListening) {
                    window.startRealtimeListening();
                }
            }
        }, 100);
        
        // Safety timeout
        setTimeout(() => {
            clearInterval(checkSpeech);
            if (isInLeadCapture && window.startRealtimeListening) {
                console.log('⏰ Safety timeout - starting listening');
                window.startRealtimeListening();
            }
        }, 10000);
    } else {
        completeLeadCollection();
    }
}

function speakMessage(message) {
    console.log('🎤 Lead capture speaking:', message);
    
    // Try to use main speakText (has British voice)
    if (typeof window.speakText === 'function') {
        window.speakText(message);
        return; // ✅ DONE - Let main system handle everything
    }
    
    // ❌ FALLBACK: SIMPLIFIED - No timing logic
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.13;
        utterance.pitch = 1.05;
        utterance.volume = 0.85;
        
        utterance.onstart = function() {
            window.isSpeaking = true; // Use global flag
            console.log('🔊 AI started speaking');
        };

        utterance.onend = function() {
            window.isSpeaking = false; // Use global flag
            console.log('🔊 AI finished speaking - timing handled by lead capture');
            // 🎯 NO TIMING LOGIC HERE - let askLeadQuestion handle it
        };
        
        window.speechSynthesis.speak(utterance);
    }
}

// ===================================================
// 🚀 QUICK LEAD CAPTURE (3 Questions)
// ===================================================
function initializeQuickLeadCapture(captureType = 'requestCall') {
    console.log(`🚀 Starting quick lead capture: ${captureType}`);
    
    isInLeadCapture = true;
    
    // Initialize quick lead data
    window.quickLeadData = {
        firstName: window.leadData.firstName || '',
        phone: '',
        reason: '',
        captureType: captureType, // 'requestCall' or 'urgent'
        step: 0,
        questions: [
            "What's your name?",
            "What's the best phone number to reach you?",
            `What's the reason for ${captureType === 'urgent' ? 'this urgent request' : 'the callback'}?`
        ]
    };
    
    // Start asking questions
    askQuickLeadQuestion();
}

function askQuickLeadQuestion() {
    const data = window.quickLeadData;
    
    if (data.step < data.questions.length) {
        const question = data.questions[data.step];
        console.log(`🎯 Quick question for step: ${data.step}`);
        console.log(`🎯 Question: ${question}`);
        
        speakMessage(question);
    } else {
        // All questions answered - send email immediately
        sendQuickLeadEmail();
    }
}

function processQuickLeadResponse(userInput) {
    const data = window.quickLeadData;
    
    console.log(`🎯 Processing quick lead response: ${userInput}`);
    
    if (data.step === 0) {
        // Name
        const words = userInput.trim().split(' ');
        const extractedName = words[0].replace(/[^a-zA-Z]/g, '');
        data.firstName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
        window.leadData.firstName = data.firstName;
        
        console.log(`✅ Quick captured name: ${data.firstName}`);
        data.step++;
        askQuickLeadQuestion();
        
    } else if (data.step === 1) {
        // Phone
        data.phone = userInput.trim();
        console.log(`✅ Quick captured phone: ${data.phone}`);
        data.step++;
        askQuickLeadQuestion();
        
    } else if (data.step === 2) {
        // Reason
        data.reason = userInput.trim();
        console.log(`✅ Quick captured reason: ${data.reason}`);
        data.step++;
        askQuickLeadQuestion(); // This will trigger email send
    }
}

function sendQuickLeadEmail() {
    const data = window.quickLeadData;
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    const subjectLine = data.captureType === 'urgent' 
        ? `URGENT REQUEST - ${data.firstName}`
        : `CALL NOW - ${data.firstName}`;
    
    console.log('📧 Sending quick lead email...');
    
    const emailParams = {
        to_email: 'bruce@newclientsinc.com',
        from_name: data.firstName,
        subject: subjectLine,
        message: `
NEW QUICK LEAD REQUEST

Name: ${data.firstName}
Phone: ${data.phone}
Reason: ${data.reason}
Type: ${data.captureType === 'urgent' ? 'URGENT REQUEST' : 'Call Back Request'}
Timestamp: ${timestamp}
        `.trim()
    };
    
    console.log('📧 Email parameters:', emailParams);
    
    emailjs.send('service_btav9yj', 'template_5vf2yuh', emailParams)
        .then(function(response) {
            console.log('✅ QUICK EMAIL SENT!', response.status, response.text);
            
            // Clear quick lead data
            isInLeadCapture = false;
            window.quickLeadData = null;
            
            // AI response
            const responseText = `Perfect ${data.firstName}! Bruce,the founder and CEO of NCI will ${data.captureType === 'urgent' ? 'prioritize your urgent request' : 'call you shortly'}. Is there anything else I can help you with?`;
            
            speakText(responseText);
            conversationState = 'asking_if_more_help';
            
        }, function(error) {
            console.log('❌ QUICK EMAIL FAILED:', error);
        });
}

// Make globally accessible
window.initializeQuickLeadCapture = initializeQuickLeadCapture;
window.processQuickLeadResponse = processQuickLeadResponse;

// ===================================================
// 📧 EMAIL FORMATTING FUNCTION
// ===================================================
function formatEmailFromSpeech(speechText) {
    let formattedEmail = speechText.toLowerCase().trim();
    
    // Replace common speech patterns with email format
    formattedEmail = formattedEmail
        .replace(/\s*at\s+/g, '@')           // "at" becomes @
        .replace(/\s*dot\s+/g, '.')          // "dot" becomes .
        .replace(/\s+/g, '')                 // Remove all spaces
        .replace(/,/g, '');                  // Remove commas
    
    console.log('📧 Email conversion:', speechText, '→', formattedEmail);
    return formattedEmail;
}

// ===================================================
// 🔄 FIXED PROCESS LEAD RESPONSE WITH EMAIL FORMATTING
// ===================================================
function processLeadResponse(userInput) {
    if (!isInLeadCapture || !leadData) return false;
    
    console.log('🎯 Processing lead response:', userInput);
    
    let processedInput = userInput;
    
    // ✅ NEW: Format email addresses when asking for email (step 2)
    if (leadData.step === 2) {
        processedInput = formatEmailFromSpeech(userInput);
        console.log('📧 Formatted email:', processedInput);
    }
    
    // Store the processed input
    leadData.tempAnswer = processedInput;
    
    // Show visual confirmation buttons
    showConfirmationButtons(processedInput);
    
    return true;
}

function showConfirmationButtons(answer) {
    const chatMessages = document.getElementById('chatMessages');
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'confirmation-buttons';
    buttonContainer.innerHTML = `
        <div style="
            text-align: center; 
            margin: 15px 0; 
            padding: 20px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 15px;
            border: 2px solid rgba(255,255,255,0.2);
        ">
            <div style="
                margin-bottom: 15px; 
                color: white; 
                font-size: 18px;
                font-weight: bold;
            ">
                "${answer}"
            </div>
            <div style="margin-bottom: 20px; color: #ccc; font-size: 14px;">
                Is this correct?
            </div>
            <div style="
                display: flex; 
                justify-content: center; 
                gap: 20px;
                flex-wrap: wrap;
            ">
                <button onclick="confirmAnswer(true)" style="
                    background: linear-gradient(135deg, #4CAF50, #8BC34A);
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    border-radius: 25px; 
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                    min-width: 120px;
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                ">
                    ✅ Correct
                </button>
                <button onclick="confirmAnswer(false)" style="
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    border-radius: 25px; 
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                    min-width: 120px;
                    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                ">
                    🔄 Redo
                </button>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(buttonContainer);
    scrollChatToBottom();
}

function removeLastUserMessage() {
    const chatMessages = document.getElementById('chatMessages');
    const userMessages = chatMessages.querySelectorAll('.user-message');
    if (userMessages.length > 0) {
        userMessages[userMessages.length - 1].remove();
    }
}

function confirmAnswer(isCorrect) {
    console.log('🎯 User clicked:', isCorrect ? 'Correct' : 'Redo');
    
    // Remove the confirmation buttons
    const buttonContainer = document.querySelector('.confirmation-buttons');
    if (buttonContainer) {
        buttonContainer.remove();
    }
    
    if (isCorrect) {
        // ✅ CORRECT - Save and move on
        const fields = ['name', 'phone', 'email', 'contactTime'];
        const field = fields[leadData.step];
        leadData[field] = leadData.tempAnswer;
        
        console.log(`✅ Confirmed ${field}: ${leadData.tempAnswer}`);
        
        leadData.step++;
        
        if (leadData.step < leadData.questions.length) {
            // More questions to ask
            setTimeout(() => {
                askSimpleLeadQuestion();
            }, 800);
        } else {
            // ✅ FINAL STEP - SHOW BRUCE BANNER IMMEDIATELY!
            setTimeout(() => {
                console.log('🎯 Final confirmation completed - showing Bruce banner!');
                
                // Remove the lead capture banner
                const banner = document.getElementById('leadCaptureBanner');
                if (banner) {
                    removeLeadCaptureBanner();
                }
                
                // ✅ SHOW BRUCE'S BANNER IMMEDIATELY!
                showConsultationConfirmedBanner()
                
                // Send email silently in background
                setTimeout(() => {
                    sendLeadEmail(leadData);
                }, 1000);
                
                // Clean up lead capture
                isInLeadCapture = false;
                conversationState = 'final_question';
                
            }, 800);
        }
        
} else {
    // Redo - LIGHTER cleanup approach with FORCE STOP
    console.log('🔄 Redo - clearing field and restarting speak sequence');
    
    // 🎯 FORCE BYPASS - Reset the timing check for user-initiated redo
    window.lastSequenceStart = 0; // Reset timing so blocking allows restart
    speakSequenceActive = false; // Force reset the flag
    
    // 🎯 FORCE STOP the active sequence first
    isInSpeakSequence = false; // Reset the flag that's blocking us
    if (window.recognition) {
        window.recognition.stop(); // Stop any active recognition
    }
    
    // ✅ KEEP the main fix - remove wrong answer FIRST
    removeLastUserMessage();
    
    // ✅ KEEP basic cleanup
    window.leadData.tempAnswer = ''; // Use window.leadData for consistency
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = '';
    }
    
    // ✅ KEEP the restart with slightly longer timeout for cleanup
    setTimeout(() => {
        startRealtimeListening(); // Restart the full red -> green sequence
    }, 100); // Back to 100ms to allow force stop to complete
}
}

function askSimpleLeadQuestion() {
    if (!isInLeadCapture || !leadData) return;
    
    console.log('🎯 Asking question for step:', leadData.step);
    
    if (leadData.step < leadData.questions.length) {
        const question = leadData.questions[leadData.step];
        console.log('🎯 Next question:', question);
        
        addAIMessage(question);
        speakMessage(question);
    } else {
        console.log('🎯 All questions complete - finishing lead capture');
        completeLeadCollection();
    }
}

// Make it global so HTML buttons can call it
window.confirmAnswer = confirmAnswer;

function saveConfirmedAnswer() {
    const fields = ['name', 'phone', 'email', 'contactTime'];
    const field = fields[leadData.step];
    leadData[field] = leadData.tempAnswer;
    console.log(`✅ Saved ${field}: ${leadData.tempAnswer}`);
}

function moveToNextQuestion() {
    leadData.step++;
    leadData.subStep = 'ask';
    leadData.tempAnswer = '';
    
    if (leadData.step < leadData.questions.length) {
        addAIMessage("Perfect!");
        setTimeout(() => {
            askLeadQuestion();
        }, 1000);
    } else {
        completeLeadCollection();
    }
}

// ===================================================
// 📧 EMAILJS INTEGRATION - STREAMLINED SYSTEM
// ===================================================
function sendLeadEmail(data) {
    console.log('📧 Preparing to send email with lead data...');
    
    // Prepare conversation transcript
    const messages = document.querySelectorAll('.message');
    let transcript = 'MOBILE-WISE AI CONVERSATION TRANSCRIPT:\n\n';
    messages.forEach(msg => {
        const type = msg.classList.contains('ai-message') ? 'AI' : 'USER';
        transcript += `${type}: ${msg.textContent}\n`;
    });
    
    // Email template parameters with enhanced data validation
    const templateParams = {
        name: data.name || 'No name provided',
        phone: data.phone || 'No phone provided',
        email: data.email || 'No email provided',
        to_email: data.email || 'No email provided',
        contactTime: data.contactTime || 'No preference specified',
        inquiryType: (data.inquiryType || 'general').toUpperCase(),
        transcript: transcript,
        timestamp: new Date().toLocaleString(),
        // 🆕 ADDED: Additional context for the specialist
        source: 'Mobile-Wise AI Formviser',
        urgency: data.inquiryType === 'buying' ? 'HIGH - Buyer Ready' : 'NORMAL'
    };
    
    console.log('📧 Sending email with parameters:', templateParams);
    
    // Send email with enhanced error handling
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_b9bppgb', 'template_yf09xm5', templateParams)
            .then(function(response) {
                console.log('✅ EMAIL SENT SUCCESSFULLY!', response.status, response.text);
                
                // ✅ ENHANCED CONVERSATION FLOW
                setTimeout(() => {
                    // Remove the "LEAD CAPTURED" banner
                    const leadBanner = document.getElementById('leadCaptureBanner');
                    if (leadBanner) leadBanner.remove();
                    
                    // 🆕 IMPROVED: More personalized messaging based on inquiry type
                    let askEmailMessage = `Excellent ${data.name}! I have all your information. Our specialist will contact you at your preferred ${data.contactTime} timeframe.`;
                    
                    // Add inquiry-specific messaging
                    if (data.inquiryType === 'buying') {
                        askEmailMessage += ` Bruce,the founder and CEO of NCI will share some exclusive opportunities that match your criteria.`;
                    } else if (data.inquiryType === 'valuation') {
                        askEmailMessage += ` You'll receive a comprehensive practice valuation analysis.`;
                    }
                    
                    askEmailMessage += ` May I send you Bruce's book "7 Secrets to Selling Your Practice" and a confirmation email now?`;
                    
                    addAIMessage(askEmailMessage);
                    speakResponse(askEmailMessage);
                    
                    // Set conversation state to handle the response
                    conversationState = 'asking_for_email_permission';
                    
                    // 🆕 IMPROVED: Better timing for user response
                    setTimeout(() => {
                        if (!isSpeaking && isAudioMode) {
                            startListening();
                        }
                    }, 500); // Slightly longer to account for longer message
                }, 100);
                
            }, function(error) {
                console.error('❌ EMAIL FAILED:', error);
                
                // 🆕 ENHANCED: Better error recovery
                const errorMessage = `I'm sorry ${data.name}, there was an issue sending your request. Let me try a different approach - what's the best way to reach you directly?`;
                addAIMessage(errorMessage);
                speakResponse(errorMessage);
                
                // 🆕 ADDED: Graceful fallback instead of hard reset
                conversationState = 'email_fallback';
                
                setTimeout(() => {
                    if (!isSpeaking && isAudioMode) {
                        startListening();
                    }
                }, 500);
            });
    } else {
        console.error('❌ EmailJS not available');
        // 🆕 ENHANCED: Better fallback messaging
        addAIMessage(`${data.name}, our email system is temporarily down. Please call us directly at [YOUR_PHONE] or visit our website. I have your information saved.`);
        
        // Still transition to email permission question as backup
        setTimeout(() => {
            conversationState = 'asking_for_email_permission';
        }, 2000);
    }
}

// ===================================================
// 📧 FOLLOW-UP EMAIL WITH BUILT-IN THANK YOU FLOW - FINAL VERSION
// ===================================================
function sendFollowUpEmail() {
    console.log('📧 DEBUG: leadData at function start:', leadData);
    
    if (!leadData || !leadData.email) {
        console.error('❌ CRITICAL: leadData or email is missing!');
        
        // Try to continue conversation even with missing data
        addAIMessage("Is there anything else I can help you with today?", 'ai');
        speakResponse("Is there anything else I can help you with today?");
        conversationState = 'asking_if_more_help';
        return;
    }
    
    // ✅ SUPER CLEAN EMAIL - Remove any hidden characters
    const cleanEmail = String(leadData.email).trim().replace(/[^\w@.-]/g, '');
    
    console.log('📧 DEBUG: Original email:', leadData.email);
    console.log('📧 DEBUG: Cleaned email:', cleanEmail);
    console.log('📧 DEBUG: Email length:', cleanEmail.length);
    
    // 🚀 GET LEAD MAGNET FROM BANNER SYSTEM
    const leadMagnet = getActiveLeadMagnet(); // Calls banner system
    
    // ✅ DYNAMIC EMAIL TRANSCRIPT
    let emailTranscript = `CONFIRMATION: Appointment scheduled for ${leadData.contactTime}\n\nThank you for choosing New Clients Inc! We'll be in touch within 24 hours.`;
    
    // 🎯 ADD LEAD MAGNET IF CONFIGURED
    if (leadMagnet && leadMagnet.includeInEmail) {
        emailTranscript += `\n\n${leadMagnet.emailText}\n${leadMagnet.downloadLink}`;
    }
    
    emailTranscript += `\n\nBest regards,\nBruce`;
    
    const confirmationParams = {
        to_email: cleanEmail,        // ✅ Matches {{to_email}}
        name: leadData.name,         // ✅ Matches {{name}}
        email: cleanEmail,           // ✅ Matches {{email}} (Reply To)
        phone: leadData.phone,
        contactTime: leadData.contactTime,
        inquiryType: 'CONFIRMATION EMAIL',
        transcript: emailTranscript, // ✅ Dynamic transcript
        timestamp: new Date().toLocaleString()
    };
    
    console.log('📧 DEBUG: to_email specifically:', confirmationParams.to_email);
    
    // ✅ COMPLETE EMAIL SENDING WITH BUILT-IN THANK YOU FLOW
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_b9bppgb', 'template_8kx812d', confirmationParams)
            .then(function(response) {
                console.log('✅ CONFIRMATION EMAIL SENT!');
                
                // ✅ NEW BANNER SYSTEM ONLY
                showUniversalBanner('emailSent');
                
                // ✅ COMPLETE CONVERSATION FLOW WITH BUILT-IN RESPONSE HANDLING
                conversationState = 'asking_if_more_help';
                const finalMessage = "Perfect! Your confirmation email is on its way to " + cleanEmail + ". Is there anything else I can help you with today?";
                addAIMessage(finalMessage, 'ai');
                speakResponse(finalMessage);
                
                // ✅ SET UP DIRECT RESPONSE HANDLER FOR "NO" WITH KILL SWITCHES
                window.emailFollowUpHandler = function(userInput) {
                    const userText = userInput.toLowerCase();
                    
                    if (userText.includes('no') || userText.includes('nothing') || userText.includes('done') || 
                        userText.includes('that\'s all') || userText.includes('nope') || userText.includes('thanks')) {
                        
                        console.log('🛑 User said no - killing all speech systems and showing splash');
                        
                        // ✅ KILL ALL SPEECH RECOGNITION SYSTEMS
                        if (window.speechRecognition) {
                            window.speechRecognition.stop();
                            window.speechRecognition.abort();
                        }
                        
                        // ✅ STOP ANY LISTENING LOOPS
                        if (window.isListening) {
                            window.isListening = false;
                        }
                        
                        // ✅ CLEAR ALL SPEECH TIMEOUTS
                        if (window.speechTimeout) {
                            clearTimeout(window.speechTimeout);
                        }
                        
                        // ✅ SET FINAL CONVERSATION STATE
                        conversationState = 'ended';
                        
                        // ✅ SHOW SPLASH SCREEN AFTER BRIEF DELAY
                        setTimeout(() => {
                            showThankYouSplashScreen();
                        }, 500);
                        
                        return true; // Signal that we handled this response
                    }
                    
                    // If not "no", continue normal conversation
                    conversationState = 'initial';
                    return false; // Let normal conversation flow handle it
                };
                
            }, function(error) {
                console.error('❌ EMAIL FAILED:', error);
                
                // Still continue conversation even if email fails
                conversationState = 'asking_if_more_help';
                const errorMessage = "Is there anything else I can help you with today?";
                addAIMessage(errorMessage, 'ai');
                speakResponse(errorMessage);
                
                const smartButton = document.getElementById('smartButton');
                if (smartButton) {
                    smartButton.style.display = 'none !important';
                }
            });
    } else {
        // Continue conversation even if emailjs not available
        conversationState = 'asking_if_more_help';
        const fallbackMessage = "Is there anything else I can help you with today?";
        addAIMessage(fallbackMessage, 'api');
        speakResponse(fallbackMessage);
        
        const smartButton = document.getElementById('smartButton');
        if (smartButton) {
            smartButton.style.display = 'none !important';
        }
    }
}

// ===================================================
// 🎯 CONSULTATION CONFIRMED BANNER - CLEAN VERSION
// ===================================================
function showConsultationConfirmedBanner() {
    console.log('🎯 Showing Consultation Confirmed Banner - Clean Version');
    
    // ✅ SIMPLE TRIGGER - MATCHES NEW SYSTEM
    triggerBanner('consultationConfirmed');
}

// ===================================================
// 📧 EMAIL CONFIRMATION - CLEAN VERSION
// ===================================================
function showEmailConfirmationBanner() {
    console.log('📧 Showing Email Confirmation Banner - Clean Version');
    
    // 🚀 DIRECT TRIGGER - NO BRIDGE NEEDED
    triggerBanner('email_sent', {
        type: 'confirmation',
        duration: 4000,
        autoRemove: true,
        cleanup: ['bruceBookBanner', 'leadCapture'],
        callback: (result) => {
            console.log('📧 Email confirmation banner deployed:', result);
        }
    });
}

// ===================================================
// 🛡️ LEGACY FALLBACK FUNCTIONS (Internal Use Only)
// ===================================================
function _createLegacyConsultationBanner() {
    // Simplified legacy version - only if Orchestrator fails
    console.warn('⚠️ Using legacy consultation banner fallback');
    
    // Your original banner creation code here (simplified)
    const banner = document.createElement('div');
    banner.id = 'consultationConfirmedBanner';
    // ... minimal styling and content
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(banner, container.firstChild);
    }
}

function _createLegacyThankYouBanner() {
    // Simplified legacy version - only if Orchestrator fails
    console.warn('⚠️ Using legacy thank you banner fallback');
    
    // Your original banner creation code here (simplified)
    const banner = document.createElement('div');
    banner.id = 'thankYouBanner';
    // ... minimal styling and content
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(banner, container.firstChild);
    }
}

function forceScrollToBottom() {
    setTimeout(() => {
        // Multiple scroll attempts for stubborn mobile
        const scrollTargets = [
            document.getElementById('chatContainer'),
            document.querySelector('.chat-container'),
            document.querySelector('.messages-container'),
            document.body,
            document.documentElement
        ];
        
        scrollTargets.forEach(target => {
            if (target) {
                target.scrollTop = target.scrollHeight;
            }
        });
        
        // Force window scroll
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
   
    }, 100);
}

function endConversation() {
    const goodbye = "Thank you for visiting us today. Have a great day!";
    addAIMessage(goodbye);
    speakResponse(goodbye);
    
    setTimeout(() => {
        replaceBannerWithThankYou();
        conversationState = 'ended';
        stopListening();
    }, 2000);
}

function startFollowUpSequence() {
    conversationState = 'asking_followup_email';

    // 🆕 CLEANUP LEAD CAPTURE STATE
window.isInLeadCapture = false;
window.currentLeadData = null;
window.currentCaptureType = null;

console.log('✅ Lead capture state cleaned up');
    
    // ✅ ENHANCED: Combined personalized message with follow-up question
    const combinedMessage = `Excellent ${leadData.name}! I have all your information. Our specialist will contact you at ${leadData.phone} during your preferred ${leadData.contactTime} timeframe. May I follow up with a confirmation email and a link to Bruce's new book "7 Secrets to Selling Your Practice"?`;
    
    addAIMessage(combinedMessage);
    speakResponse(combinedMessage);
    
    // Remove the lead capture banner
    const banner = document.getElementById('leadCaptureBanner');
    if (banner) {
        removeLeadCaptureBanner();
    }
    
    isInLeadCapture = false;
}

// ===================================================
// 📝 TEXT MODE SWITCHER
// ===================================================
function switchToTextMode() {
    console.log('🔄 Switching to text mode');
    
    if (currentAudio) {
        window.speechSynthesis.cancel();
    }
    
    stopListening();
    
    if (persistentMicStream) {
        persistentMicStream.getTracks().forEach(track => track.stop());
        persistentMicStream = null;
    }
    
    isAudioMode = false;
    micPermissionGranted = false;
    
    const micButton = document.getElementById('micButton');
    const liveTranscript = document.getElementById('liveTranscript');
    
    if (micButton) micButton.classList.remove('listening');
    if (liveTranscript) {
        liveTranscript.style.display = 'none';
        restoreQuickButtons(); // Show quick buttons again
    }
    
    addAIMessage("Switched to text mode. Type your message in the text box below.");
    
    console.log('✅ Switched to text mode successfully');
}

// ===================================================
// 🚀 INITIALIZATION SYSTEM
// ===================================================
function initializeChatInterface() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    const micButton = document.getElementById('micButton');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    console.log('✅ Chat interface initialized');
}

// ===================================================
// 🌍 GLOBAL FUNCTIONS
// ===================================================
window.handleSmartButtonClick = handleSmartButtonClick;

// ===================================================
// 🚀 INITIALIZE THE APPLICATION
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Mobile-Wise AI Formviser - Complete Integration...');
    
    initializeChatInterface();
    
    const chatContainer = document.querySelector('.chat-messages') || document.querySelector('#chatContainer');
    if (chatContainer) {
        chatContainer.innerHTML = '';
    }
});

// ===================================================
// 🎯 CAPTAIN'S MISSING EMPIRE FUNCTIONS
// ===================================================

// NEW FUNCTION: Send text message from empire text input
function sendTextMessage() {
    const textInput = document.getElementById('empireTextInput') || document.getElementById('textInput');
    const message = textInput?.value.trim();
    
    if (message) {
        addUserMessage(message);
        processUserResponse(message);
        textInput.value = '';
    }
}

// NEW FUNCTION: Switch to text mode
function switchToTextMode() {
    isAudioMode = false;
    stopListening();
    
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.classList.remove('listening');
    }
    
    addAIMessage("Switched to text mode. You can type your questions below.");
}

// 🚨 NEW FUNCTION: Exit to main website
function exitToMainSite() {
    // Clear chat state
    isAudioMode = false;
    micPermissionGranted = false;
    stopListening();
    
    // Navigate back to main website
    window.location.href = '/'; // Or whatever your main site URL is
    
    // Alternative: Close chat overlay if it's a modal
    // document.querySelector('.chat-container').style.display = 'none';
}

// NEW FUNCTION: Contact Bruce (functional)
function contactBruce() {
    const contactMessage = "I'd like to speak directly with Bruce about my practice.";
    addUserMessage(contactMessage);
    addAIMessage("I'll connect you with Bruce right away! He'll be in touch within 24 hours. Is there anything specific you'd like me to tell him?");
}

function setupMobileTouchEvents() {
    console.log('📱 Setting up mobile touch events...');
    
    // Enhanced touch handling for speak sequence button
    document.addEventListener('touchstart', function(e) {
        if (e.target && e.target.id === 'speak-sequence-button') {
            e.preventDefault();
            e.target.style.transform = 'scale(0.98)';
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (e.target && e.target.id === 'speak-sequence-button') {
            e.preventDefault();
            e.target.style.transform = 'scale(1)';
        }
    }, { passive: false });
    
    // Prevent ghost clicks
    document.addEventListener('touchmove', function(e) {
        if (e.target && e.target.id === 'speak-sequence-button') {
            e.preventDefault();
        }
    }, { passive: false });
}

function playMobileErrorBeep() {
    try {
        // Create audio context for mobile-compatible beep
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 300;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        console.log('📱 Mobile error beep played');
    } catch (error) {
        console.log('📱 Mobile beep failed, using fallback:', error);
        // Fallback: try using a simple beep if Web Audio API fails
        try {
            const beep = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
            beep.volume = 0.1;
            beep.play();
        } catch (fallbackError) {
            console.log('📱 Fallback beep also failed');
        }
    }
}

function showAvatarSorryMessage(duration = 6000) {
    console.log(`🎬 Showing avatar for ${duration}ms - WILL restart recognition when done`);
    
    // 🚫 PREVENT DOUBLE CALLS - BULLETPROOF
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Avatar already playing - skipping duplicate call');
        return;
    }
    
    window.avatarCurrentlyPlaying = true;
    
    const isMobile = window.innerWidth <= 768;
    
    // Device-specific video URLs (PRESERVED FROM ORIGINAL)
    const mobileVideoUrl = "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759940889574.mp4";
    const desktopVideoUrl = "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759966365834.mp4";
    
    const videoUrl = isMobile ? mobileVideoUrl : desktopVideoUrl;
    
    const avatarOverlay = document.createElement('div');
    
    // ORIGINAL STYLING PRESERVED - Mobile vs Desktop
    if (isMobile) {
        avatarOverlay.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            background: #000; z-index: 9999;
            display: flex; justify-content: center; align-items: center;
        `;
        
        avatarOverlay.innerHTML = `
            <video id="avatarVideo" autoplay playsinline webkit-playsinline="true" style="
                width: 100%; height: 100%; object-fit: cover;
            ">
                <source src="${videoUrl}" type="video/mp4">
            </video>
        `;
    } else {
        avatarOverlay.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 833px; height: 433px;
            background: #000; z-index: 9999;
            border-radius: 12px; overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;
        
        avatarOverlay.innerHTML = `
            <video id="avatarVideo" autoplay style="
                width: 100%; height: 100%; object-fit: cover;
            ">
                <source src="${videoUrl}" type="video/mp4">
            </video>
        `;
    }
    
    document.body.appendChild(avatarOverlay);
    
    // 🎯 ONE SIMPLE CLEANUP FUNCTION - NO COMPLEXITY
    function cleanup() {
        console.log(`🎬 Avatar duration (${duration}ms) complete - removing and letting banner reappear`);
        
        // Remove the overlay
        if (avatarOverlay.parentNode) {
            avatarOverlay.remove();
        }
        
        // Reset the flag IMMEDIATELY to allow future calls
        window.avatarCurrentlyPlaying = false;
        
        // Go back to Speak Now after brief delay
        setTimeout(() => {
            console.log('✅ Avatar removed - going DIRECT to Speak Now');
            showDirectSpeakNow();
        }, 1000);
    }
    
    // 🎯 ONE TIMER ONLY - SIMPLE AND CLEAN
    setTimeout(cleanup, duration);
}

// Ensure global availability
window.showAvatarSorryMessage = showAvatarSorryMessage;

// 🧹 CLEANUP FUNCTION
function hideVoiceOverlay() {
    const existing = document.querySelector('.black-voice-overlay');
    if (existing) {
        existing.style.opacity = '0';
        setTimeout(() => {
            if (existing.parentNode) existing.remove();
        }, 300);
    }
}

// 🎨 BLACK TRANSPARENT CSS
function addBlackOverlayStyles() {
    if (document.getElementById('black-voice-overlay-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'black-voice-overlay-styles';
    styles.textContent = `
        .black-voice-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5) !important;
            display: flex; align-items: center; justify-content: center;
            z-index: 10000; pointer-events: none;
        }
        .voice-overlay-card {
            text-align: center; background: rgba(0, 0, 0, 0.8);
            border-radius: 20px; padding: 30px 25px;
            box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5),
                       0 0 20px rgba(59, 130, 246, 0.6),
                       0 0 40px rgba(59, 130, 246, 0.3);
            border: 2px solid rgba(59, 130, 246, 0.8);
            backdrop-filter: blur(10px); min-width: 280px;
            pointer-events: auto; animation: glowPulse 2s ease-in-out infinite;
        }
        @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5); }
        }
        .voice-animation {
            display: flex; justify-content: center; align-items: center;
            gap: 4px; margin-bottom: 15px; height: 35px;
        }
        .sound-wave-bar {
            width: 4px; height: 20px;
            background: linear-gradient(135deg, #3b82f6, #60a5fa);
            border-radius: 2px; animation: soundWave 1.2s ease-in-out infinite;
        }
        .sound-wave-bar:nth-child(1) { animation-delay: 0s; }
        .sound-wave-bar:nth-child(2) { animation-delay: 0.1s; }
        .sound-wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .sound-wave-bar:nth-child(4) { animation-delay: 0.3s; }
        .sound-wave-bar:nth-child(5) { animation-delay: 0.4s; }
        @keyframes soundWave {
            0%, 100% { height: 8px; opacity: 0.5; }
            50% { height: 22px; opacity: 1; }
        }
        .speak-now-text {
            font-size: 22px; font-weight: bold;
            background: linear-gradient(135deg, #60a5fa, #93c5fd);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text; margin-bottom: 12px;
        }
        .live-transcription {
            color: #e5e7eb; font-size: 15px; font-weight: 500;
            min-height: 22px; padding: 10px 15px;
            background: rgba(55, 65, 81, 0.6); border-radius: 10px;
            border: 1px solid rgba(75, 85, 99, 0.8);
        }
    `;
    document.head.appendChild(styles);
}

// 🎤 GLOBAL TRANSCRIPTION
window.updateVoiceTranscription = function(text) {
    const transcription = document.querySelector('.live-transcription');
    if (transcription) {
        transcription.textContent = text || 'Listening...';
        transcription.style.color = text ? '#ffffff' : '#9ca3af';
    }
};

async function showDirectSpeakNow() {
    console.log('🎯 DIRECT Speak Now - Black Transparent Overlay');
    
    // 🎯 COORDINATION: Block Speak Now when Action Center is about to appear
    if (window.actionCenterPending) {
        console.log('🚫 Speak Now blocked - Action Center pending');
        return;
    }
    
    if (window.disableSpeakNowBanner) return;

    // 🎨 CREATE OVERLAY
    hideVoiceOverlay();
    
    const voiceOverlay = document.createElement('div');
    voiceOverlay.className = 'black-voice-overlay';
    voiceOverlay.innerHTML = `
        <div class="voice-overlay-card">
            <div class="voice-animation">
                <div class="sound-wave-bar"></div><div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div><div class="sound-wave-bar"></div>
                <div class="sound-wave-bar"></div>
            </div>
            <div class="speak-now-text">🎤 Speak Now</div>
            <div class="live-transcription">Listening...</div>
        </div>
    `;
    document.body.appendChild(voiceOverlay);
    addBlackOverlayStyles();

    // 🎤 START LISTENING
    window.lastRecognitionResult = null;
    
    if (typeof startMobileListening === 'function') {
        startMobileListening();
    } else {
        startNormalInterviewListening();
    }

    // 🆕 TIMEOUT WITH CANCELLATION
    if (!window.disableDirectTimeout) {
        const listeningTimeout = window.isInLeadCapture ? 20000 : 7000;
        
        // 🆕 STORE TIMEOUT FOR CANCELLATION
        window.directSpeakNowTimeout = setTimeout(() => {
            if (!speakSequenceActive) return;
            window.clearBulletproofTimer();
            directCleanup();
            
            if (window.isInLeadCapture) {
                startRealtimeListening();
                return;
            }
            
            if (typeof showAvatarSorryMessage === 'function') {
                showAvatarSorryMessage();
            }
        }, listeningTimeout);
    
    // 🆕 MAKE GLOBAL
    window.hideVoiceOverlay = hideVoiceOverlay;
}

// 🆕 GLOBAL TRANSCRIPTION FUNCTION
window.updateVoiceTranscription = function(text) {
    const transcription = document.querySelector('.live-transcription');
    if (transcription) {
        transcription.textContent = text || 'Listening...';
        transcription.style.color = text ? '#ffffff' : '#9ca3af';
    }
};

function directCleanup() {
    console.log('🧹 DIRECT CLEANUP: Emergency cleanup');
    window.speakSequenceBlocked = false;
    window.speakSequenceActive = false;
    window.playingSorryMessage = false;
    if (window.currentBulletproofTimer) {
        clearTimeout(window.currentBulletproofTimer);
        window.currentBulletproofTimer = null;
    }
    if (window.closeSpeakNowBanner) {
        window.closeSpeakNowBanner();
    }
}

// ===================================================
// 🛡️ PERMANENT COOLDOWN BYPASS SYSTEM
// ===================================================
if (!window.bannerCooldownBypassInstalled) {
    console.log('💣 INSTALLING PERMANENT COOLDOWN BYPASS...');

    // 1. THE WINNING FIX: Permanently disable bannerCooldown
     Object.defineProperty(window, 'bannerCooldown', {
        get: function() { 
            console.log('🛡️ COOLDOWN BYPASS: Always returning false');
            return false; 
        },
        set: function(value) { 
            console.log('🛡️ COOLDOWN BLOCKED: Attempt to set to', value);
            return false;
        }
    });

    // 2. Also block speakSequenceBlocked permanently
    Object.defineProperty(window, 'speakSequenceBlocked', {
        get: function() { 
            console.log('🛡️ SEQUENCE BLOCKED: Always returning false');
            return false; 
        },
        set: function(value) { 
            console.log('🛡️ SEQUENCE BLOCKED: Attempt to set to', value);
            return false;
        }
    });

    window.bannerCooldownBypassInstalled = true;
    console.log('✅ PERMANENT COOLDOWN BYPASS INSTALLED!');
} else {
    console.log('✅ Cooldown bypass already active - skipping reinstallation');
}

window.lastBannerAction = 0;
window.bannerCooldownTime = 1000;
window.currentBulletproofTimer = null;

window.clearBulletproofTimer = function() {
    if (window.currentBulletproofTimer) {
        clearTimeout(window.currentBulletproofTimer);
        window.currentBulletproofTimer = null;
        console.log('🧹 DIRECT: Safety timer cleared (normal operation)');
    }
};

console.log('✅ PERMANENT COOLDOWN BYPASS INSTALLED!');
// 🛡️ PERMANENT COOLDOWN BYPASS SYSTEM
// ===================================================
console.log('💣 INSTALLING PERMANENT COOLDOWN BYPASS...');

// SIMPLE APPROACH - Just set them to false and override any setters
window.bannerCooldown = false;
window.speakSequenceBlocked = false;

// Prevent any other code from changing these values
window.setBannerCooldown = function() { 
    console.log('🛡️ COOLDOWN BLOCKED: Attempt to set banner cooldown');
    return false;
};

window.setSpeakSequenceBlocked = function() { 
    console.log('🛡️ SEQUENCE BLOCKED: Attempt to set sequence blocked');
    return false;
};

console.log('✅ PERMANENT COOLDOWN BYPASS INSTALLED SUCCESSFULLY!');

window.clearBulletproofTimer = function() {
    if (window.currentBulletproofTimer) {
        clearTimeout(window.currentBulletproofTimer);
        window.currentBulletproofTimer = null;
        console.log('🧹 DIRECT: Safety timer cleared (normal operation)');
    }
};

// ===================================================
// 🔊 CLOSE SPEAK NOW BANNER - COMPLETE VERSION
// ===================================================
function closeSpeakNowBanner() {
    console.log('🎯 CLOSE SPEAK NOW BANNER: Starting cleanup...'); 
    
     // 🎉 FIXED: Check salesAI for the name
    const userName = window.salesAI?.userData?.firstName;
    if (userName && userName.length > 0 && !window.welcomeSplashShown) {
        console.log('🎉 Triggering welcome splash for:', userName);
        setTimeout(() => {
            if (window.showWelcomeSplash) {
                window.showWelcomeSplash(userName);
            }
        }, 100);
    }
    // Clear the safety timer when closing normally
    window.clearBulletproofTimer();
    
    // Update cooldown state
    window.bannerCooldown = true;
    window.lastBannerAction = Date.now();
    
    // Close ALL banner variations
    const banners = [
        document.getElementById('speak-sequence-button'),
        document.querySelector('.speak-now-banner'),
        document.querySelector('.speak-now-container'),
        document.querySelector('[class*="speak-now"]'),
        document.querySelector('.universal-banner')
    ];
    
    banners.forEach(banner => {
        if (banner && banner.parentNode) {
            console.log('✅ Removing banner:', banner.className || banner.id);
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (banner.parentNode) banner.remove();
            }, 300);
        }
    });
    
    // Reset ALL global states
    window.speakSequenceActive = false;
    window.isListening = false;
    window.isRecording = false;
    
    // Clear any pending timeouts
    if (window.speakSequenceCleanupTimer) {
        clearTimeout(window.speakSequenceCleanupTimer);
        window.speakSequenceCleanupTimer = null;
    }
    
    // Reset cooldown after delay
    setTimeout(() => {
        console.log('🔄 Banner cooldown reset');
    }, window.bannerCooldownTime);
    
    console.log('✅ SPEAK NOW BANNER: Fully closed and reset');
}

// Make it globally accessible
window.closeSpeakNowBanner = closeSpeakNowBanner;

// ===================================================
// 🧹 CLEANUP SPEAK SEQUENCE - COMPLETE VERSION (FIXED)
// ===================================================
function cleanupSpeakSequence() {
    console.log('🧹 CLEANUP SPEAK SEQUENCE: Starting...');
    
    // SMART CLEANUP - Handle sorry messages differently
    if (window.playingSorryMessage) {
        console.log('🛡️ Sorry message in progress - minimal cleanup');
        
        // Reset flags but keep visual
        window.speakSequenceActive = false;
        
        if (window.speakSequenceCleanupTimer) {
            clearTimeout(window.speakSequenceCleanupTimer);
            window.speakSequenceCleanupTimer = null;
        }
        
        console.log('🔓 Hybrid blocking reset (during sorry message)');
        return;
    }
    
    // FULL CLEANUP - Normal case
    window.speakSequenceActive = false;
    window.isListening = false;
    window.isRecording = false;
    
    // 🎯 ONLY CLOSE SPEAK-NOW BANNERS, NOT BRANDING BANNERS
    const speakNowBanner = document.querySelector('.speak-now-banner, .speak-now-container, #universal-banner[data-banner-type="speak-now"]');
    const brandingBanner = document.querySelector('#universal-banner[data-banner-type="branding"]');
    
    if (speakNowBanner && !brandingBanner && window.closeSpeakNowBanner) {
        console.log('🎯 Closing speak-now banner only');
        window.closeSpeakNowBanner();
    } else if (brandingBanner) {
        console.log('🛡️ Preserving branding banner - only cleaning up speak sequence flags');
    } else {
        console.log('🔍 No banners to close or close function not available');
    }
    
    console.log('✅ Speak sequence fully cleaned up');
}

window.cleanupSpeakSequence = cleanupSpeakSequence;

// ===================================================
// 🔄 STATE SYNCHRONIZATION GUARD - COMPLETE VERSION
// ===================================================
function syncBannerState() {
    const now = Date.now();
    
    // Check if cooldown has expired
    if (window.bannerCooldown && (now - window.lastBannerAction > window.bannerCooldownTime)) {
        console.log('🔄 SYNC: Cooldown expired - banner system unlocked');
    }
    
    // SAFETY CHECK: If banner has been open too long
    const bannerElements = document.querySelectorAll('.speak-now-banner, .speak-now-container');
    if (bannerElements.length > 0 && window.currentBulletproofTimer) {
        const timeSinceBanner = now - window.lastBannerAction;
        if (timeSinceBanner > 25000) {
            console.log('⚠️ SAFETY WARNING: Banner open for 25+ seconds');
        }
    }
    
// 🚨 REMOVED: Banner closure during AI speech - KEEP banner open for continuous voice conversations
// if (window.isSpeaking && !window.bannerCooldown) {
//     console.log('🔄 SYNC: AI Speaking - Force closing banner');
//     if (window.closeSpeakNowBanner) {
//         window.closeSpeakNowBanner();
//     }
//     window.speakSequenceActive = false;
//     window.bannerCooldown = true;
//     window.lastBannerAction = now;
// }
    
    // EMERGENCY: If listening stopped but banner is active (respect cooldown)
    if (!window.isListening && window.speakSequenceActive && (now - window.lastBannerAction > 2000) && !window.bannerCooldown) {
        console.log('🔄 SYNC: Listening stopped - Cleaning up stuck banner');
        if (window.closeSpeakNowBanner) {
            window.closeSpeakNowBanner();
        }
        window.speakSequenceActive = false;
        window.bannerCooldown = true;
        window.lastBannerAction = now;
    }
    
    // EMERGENCY: If banner should be closed but isn't (respect cooldown)
    if (bannerElements.length > 0 && !window.speakSequenceActive && !window.isListening && !window.bannerCooldown) {
        console.log('🔄 SYNC: Stray banner detected - Emergency cleanup');
        if (window.closeSpeakNowBanner) {
            window.closeSpeakNowBanner();
        }
        window.bannerCooldown = true;
        window.lastBannerAction = now;
    }
    
    // EMERGENCY: If multiple banners exist (always fix this)
    if (bannerElements.length > 1) {
        console.log('🔄 SYNC: Multiple banners detected - Emergency cleanup');
        for (let i = 1; i < bannerElements.length; i++) {
            bannerElements[i].remove();
        }
    }
}

// Start synchronization (but only if not already running)
if (!window.bannerSyncInterval) {
    window.bannerSyncInterval = setInterval(syncBannerState, 500);
    console.log('✅ Banner state synchronization started with safety timer');
}

// ULTRA-MINIMAL WELCOME WITH LOGO & FONT SIZE CONTROLS
window.showWelcomeSplash = function(userName) {
    console.log('🎉 ULTRA-MINIMAL WELCOME: Showing for', userName);
    
    // 🎨 SIZE CONTROLS - CHANGE THESE:
    const logoHeight = '65px';   // Change logo size: '60px', '100px', '120px'
    const fontSize = '22px';     // Change text size: '20px', '28px', '32px'
    
    const existingWelcome = document.getElementById('minimal-welcome');
    if (existingWelcome) existingWelcome.remove();
    
    const welcomeContainer = document.createElement('div');
    welcomeContainer.id = 'minimal-welcome';
    welcomeContainer.style.cssText = `
        position: fixed;
        top:  7px;
        right: 20px;
        color: #024082ff;
        font-family: cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: ${fontSize};
        font-weight: 600;
        z-index: 10001;
        transition: opacity 0.7s ease;
        opacity: 0;
        display: flex;
        align-items: center;
        gap: 7px;
        background: transparent;
}
    `;

    welcomeContainer.innerHTML = `
        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1763241555499_pngegg%20(13).png" 
             alt="Welcome" 
             style="height: ${logoHeight}; border-radius: 2px;"
             onerror="this.style.display='none'">
        <span style="margin-left: 7px;">${userName}!</span>
    `;
    
    document.body.appendChild(welcomeContainer);
    
        // Fade in
    setTimeout(() => welcomeContainer.style.opacity = '1', 10);
    
    // Fade out and remove after 10 seconds (was 30)
    setTimeout(() => {
        welcomeContainer.style.opacity = '0';
        setTimeout(() => {
            if (welcomeContainer.parentElement) {
                welcomeContainer.remove();
            }
        }, 500);
    }, 10000); // Changed from 30000 to 10000 (10 seconds)
    
    window.welcomeSplashShown = true;
    console.log('✅ Ultra-minimal welcome shown');
};

// ===================================================
// 🎯 INTEGRATION WITH EXISTING SHOW BANNER FUNCTION
// ===================================================
// Wrap the existing showDirectSpeakNow to respect cooldown
if (typeof window.showDirectSpeakNow === 'function') {
    const originalShowDirectSpeakNow = window.showDirectSpeakNow;
    window.showDirectSpeakNow = function() {
        const now = Date.now();
        
        // CHECK COOLDOWN FIRST
        if (window.bannerCooldown) {
            console.log('🛑 BANNER COOLDOWN: Skipping banner show - system cooling down');
            return;
        }
        
        // CHECK IF BANNER ALREADY EXISTS
        const existingBanners = document.querySelectorAll('.speak-now-banner, .speak-now-container');
        if (existingBanners.length > 0) {
            console.log('🛑 BANNER EXISTS: Skipping duplicate banner');
            return;
        }
        
        console.log('✅ COOLDOWN CHECK PASSED: Showing banner');
        window.bannerCooldown = true;
        window.lastBannerAction = now;
        
        // SET SAFETY TIMER (30 seconds)
        if (window.currentBulletproofTimer) {
            clearTimeout(window.currentBulletproofTimer);
        }
        
        // Create named function for the safety timeout
        const createSafetyTimeout = () => {
            // 🚀 PROTECT ALL KEY SALES BANNERS
            const protectedBannerTypes = [
                'setAppointment',           // Consultation
                'preQualifier',            // Pre-qualification  
                'urgent',                  // Urgent call
                'clickToCall',             // Call now
                'freeBookWithConsultation' // Free book offer
            ];
            
            const hasProtectedBanner = protectedBannerTypes.some(bannerType => 
                document.querySelector(`[data-banner-type="${bannerType}"]`)
            );
            
            const actionCenterVisible = document.querySelector('.communication-relay-center') || 
                                       window.actionCenterVisible ||
                                       document.querySelector('#action-center-overlay');
            
            const universalBanner = document.getElementById('universal-banner');
            const hasVisibleUniversalBanner = universalBanner && universalBanner.style.display !== 'none';
            
            if (actionCenterVisible || hasProtectedBanner || hasVisibleUniversalBanner) {
                const activeBanner = protectedBannerTypes.find(type => 
                    document.querySelector(`[data-banner-type="${type}"]`)
                ) || 'universal-banner';
                console.log('🔒 Safety timeout BYPASSED - Action Center or sales banner active:', activeBanner);
                // Reset the timer to check again in 30 seconds
                window.currentBulletproofTimer = setTimeout(createSafetyTimeout, 30000);
            } else {
                console.log('🕐 SAFETY TIMEOUT: Generic banner stuck - emergency cleanup');
                directCleanup();
            }
        };
        
        window.currentBulletproofTimer = setTimeout(createSafetyTimeout, 30000);
        
        // Call original function
        originalShowDirectSpeakNow.call(this);
        
        // Reset cooldown after delay
        setTimeout(() => {
            console.log('🔄 Show banner cooldown reset');
        }, window.bannerCooldownTime);
    };
    console.log('✅ showDirectSpeakNow wrapped with cooldown protection');
}

// ===================================================
// ✅ INITIALIZATION COMPLETE
// ===================================================
console.log('=== COMPLETE BANNER SYSTEM LOADED ===');
console.log('• closeSpeakNowBanner: ✅ Loaded');
console.log('• cleanupSpeakSequence: ✅ Loaded'); 
console.log('• syncBannerState: ✅ Active every 500ms');
console.log('• directCleanup: ✅ Safety net ready');
console.log('• bannerCooldown: ✅ Global lock active');
console.log('• Safety Timer: ✅ 30-second protection');
console.log('🎯 ALL MISSING FUNCTIONS RESTORED AND SYNCHRONIZED!');

// ===================================================
// 🧹 CLEANUP SPEAK SEQUENCE - ENHANCED VERSION
// ===================================================
function cleanupSpeakSequence() {
    console.log('🧹 CLEANUP SPEAK SEQUENCE: Starting...');
    
    // 🎯 SMART CLEANUP - Handle sorry messages differently
    if (window.playingSorryMessage) {
        console.log('🛡️ Sorry message in progress - minimal cleanup');
        
        // Reset flags but keep visual
        window.speakSequenceActive = false;
        
        if (window.speakSequenceCleanupTimer) {
            clearTimeout(window.speakSequenceCleanupTimer);
            window.speakSequenceCleanupTimer = null;
        }
        
        console.log('🔓 Hybrid blocking reset (during sorry message)');
        return;
    }
    
    // 🎯 FULL CLEANUP - Normal case
    window.speakSequenceActive = false;
    window.isListening = false;
    window.isRecording = false;
    
    // Close the banner
    if (window.closeSpeakNowBanner) {
        window.closeSpeakNowBanner();
    }
    
    console.log('✅ Speak sequence fully cleaned up');
}

window.cleanupSpeakSequence = cleanupSpeakSequence;
        

    // Success handler for direct speak now
    window.handleSpeechSuccess = function(transcript) {
        console.log('✅ DIRECT: Speech detected:', transcript);
        
        window.clearBulletproofTimer();
        
        if (speakSequenceButton) {
            speakSequenceButton.remove();
        }
        
        existingButtons.forEach(btn => {
            if (btn.id !== 'speak-sequence-button') {
                btn.style.display = 'block';
            }
        });
        
        directCleanup();
        
        console.log('🧹 DIRECT: Speech sequence completed successfully');
    };
}

console.log('🎯 DIRECT Speak Now function loaded - No Get Ready phase!');

// 🎯 DETECT CONTACT INTERVIEW MODE
function checkContactInterviewMode() {
    const indicators = [
        typeof isInLeadCapture !== 'undefined' && isInLeadCapture,
        typeof currentConversationState !== 'undefined' && 
            (currentConversationState.includes('email') || 
             currentConversationState.includes('contact') ||
             currentConversationState.includes('lead')),
        document.querySelector('[id*="email"]') !== null,
        document.querySelector('[id*="contact"]') !== null,
        document.querySelector('[id*="lead"]') !== null
    ];
    
    return indicators.some(indicator => indicator === true);
}

// 🎯 NORMAL INTERVIEW LISTENING 
function startNormalInterviewListening() {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = '';
        console.log('🧹 Cleared userInput field (normal mode)');
    }
    
    setTimeout(() => {
        if (typeof startListening === 'function') {
            try {
                startListening();
                console.log('✅ Normal startListening() called successfully');
            } catch (error) {
                console.error('❌ Normal startListening() error:', error);
            }
        }
    }, 50);
    
    setTimeout(() => {
        if (typeof forceStartListening === 'function' && !isListening) {
            try {
                console.log('🔄 Normal backup: calling forceStartListening()');
                forceStartListening();
            } catch (error) {
                console.error('❌ Normal forceStartListening() error:', error);
            }
        }
    }, 150);
}

// 🎯 CONTACT INTERVIEW LISTENING 
function startContactInterviewListening() {
    console.log('📧 === CONTACT INTERVIEW SPEECH SETUP ===');
    
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = '';
        console.log('🧹 Cleared userInput field (contact mode)');
    }
    
    setTimeout(() => {
        if (typeof startListening === 'function') {
            try {
                console.log('📧 Contact mode: calling startListening()');
                startListening();
                console.log('✅ Contact startListening() called successfully');
            } catch (error) {
                console.error('❌ Contact startListening() error:', error);
            }
        }
    }, 50);
    
    setTimeout(() => {
        if (typeof forceStartListening === 'function' && !isListening) {
            try {
                console.log('📧 Contact mode backup: calling forceStartListening()');
                forceStartListening();
            } catch (error) {
                console.error('❌ Contact forceStartListening() error:', error);
            }
        }
    }, 200);
    
    setTimeout(() => {
        if (typeof recognition !== 'undefined' && recognition && !isListening) {
            try {
                console.log('📧 Contact mode final try: direct recognition.start()');
                recognition.start();
                isListening = true;
            } catch (error) {
                console.error('❌ Contact direct recognition error:', error);
            }
        }
    }, 350);
    
    console.log('📧 === END CONTACT INTERVIEW SETUP ===');
}

// Enhanced cleanup function
function cleanupSpeakSequence() {
    // 🎯 ALLOW CLEANUP DURING SORRY MESSAGES, BUT BE SMART ABOUT IT
    if (window.playingSorryMessage) {
        console.log('🛡️ Sorry message in progress - doing minimal cleanup');
        
        // 🎯 STILL CLEAN UP TIMERS AND FLAGS, BUT KEEP THE VISUAL
        speakSequenceActive = false;
        
        if (speakSequenceCleanupTimer) {
            clearTimeout(speakSequenceCleanupTimer);
            speakSequenceCleanupTimer = null;
        }

        console.log('🔓 Hybrid blocking reset (during sorry message)');

      //  window.playingSorryMessage = false;

        // 🚨 IMMEDIATE DIAGNOSTIC TEST
     // console.log('🔍🔍🔍 POST-SORRY MESSAGE BLOCKING CHECK:');

return; // ←←← Now the diagnostic runs BEFORE this return

}
    
    // 🛑 CRITICAL: RE-ENABLE FUTURE SESSIONS
    speakSequenceActive = false;
    
    console.log('🧹 Cleaning up speak sequence');
    
    if (speakSequenceButton) {
        speakSequenceButton.remove();
        speakSequenceButton = null;
    }
    
    // Restore original buttons
    const quickButtonsContainer = document.querySelector('.quick-questions') || 
                                  document.querySelector('.quick-buttons') || 
                                  document.getElementById('quickButtonsContainer');
    if (quickButtonsContainer) {
        const buttons = quickButtonsContainer.querySelectorAll('.quick-btn');
        buttons.forEach(btn => btn.style.display = '');
    }
}

// Updated hide function
function hideSpeakNowBanner() {
    cleanupSpeakSequence();
}

// ENHANCED: Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for the empire text input
    setTimeout(() => {
        const textInput = document.getElementById('empireTextInput') || document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendTextMessage();
                }
            });
        }
    }, 1000);
});


// ===== INJECT INSTANT BUBBLE CSS =====
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .realtime-bubble {
            border: 2px solid #10b981 !important;
            animation: pulseBorder 1.5s infinite;
            background: rgba(16, 185, 129, 0.1) !important;
        }
        
        @keyframes pulseBorder {
            0%, 100% { border-color: #10b981; }
            50% { border-color: #34d399; }
        }
        
        .typing-indicator::after {
            content: '...';
            animation: blink 1.5s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);
// 🆕 EXPORT FUNCTIONS FOR ACTION SYSTEM INTEGRATION
// These allow the action-system-unified-FINAL.js to integrate with voice chat

// Export addAIMessage
window.addAIMessage = addAIMessage;

// Export speakText/speakResponse (use whichever function name you have)
if (typeof speakResponse === 'function') {
    window.speakText = speakResponse;
} else if (typeof speakMessage === 'function') {
    window.speakText = speakMessage;
}

// Export listening restart function
window.startRealtimeListening = startRealtimeListening;

// Export banner system (if available)
if (typeof showUniversalBanner === 'function') {
    window.showUniversalBanner = showUniversalBanner;
}

console.log('✅ Voice chat functions exported for Action System integration');

    console.log('✅ Instant bubble CSS injected');
})();
