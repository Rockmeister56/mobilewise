// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATION
// Smart Button + Lead Capture + EmailJS + Banner System
// ===================================================

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
const AUTO_RESTART_DELAY = 1500; // 1.5 seconds after AI response
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
        width: 100% !important;
        background: rgba(34, 197, 94, 0.4) !important;
        color: #ffffff !important;
        border: 2px solid rgba(34, 197, 94, 0.8) !important;
        padding: 15px !important;
        min-height: 45px !important;
        font-weight: bold !important;
        font-size: 18px !important;
        border-radius: 20px !important;
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
            
            // 🔥 SET ONRESULT HANDLER
            recognition.onresult = function(event) {
                console.log('🎯 ONRESULT FIRED');
                console.log('  - Results count:', event.results.length);
                console.log('  - Result index:', event.resultIndex);
                
                let transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');

                transcript = transcript.replace(/\.+$/, '');
                
                console.log('✅ Transcript captured:', transcript);
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

            // 🔥 SET ONEND HANDLER
            recognition.onend = function() {
                console.log('🎯🎯🎯 WHICH ONEND IS RUNNING? 🎯🎯🎯');
                console.log('🔚 Recognition ended');
                console.log('🔍 DEBUG: playingSorryMessage =', window.playingSorryMessage);
                console.log('🔍 DEBUG: isSpeaking =', isSpeaking);
                console.log('🔍 DEBUG: speakSequenceActive =', speakSequenceActive);
                
                // 🔥 TRIPLE-SOURCE TRANSCRIPT CAPTURE
                let finalTranscript = '';
                const userInput = document.getElementById('userInput');

                // SOURCE 1: Check recognition.results
                if (recognition.results && recognition.results.length > 0) {
                    for (let i = recognition.resultIndex; i < recognition.results.length; i++) {
                        if (recognition.results[i].isFinal) {
                            finalTranscript += recognition.results[i][0].transcript;
                        } else {
                            finalTranscript += recognition.results[i][0].transcript;
                        }
                    }
                    console.log('🔍 SOURCE 1 (recognition.results):', finalTranscript);
                }

                // SOURCE 2: Check input field
                if (!finalTranscript && userInput && userInput.value.trim().length > 0) {
                    finalTranscript = userInput.value.trim();
                    console.log('🔍 SOURCE 2 (input field):', finalTranscript);
                }

                // SOURCE 3: Check global backup
                if (!finalTranscript && window.lastCapturedTranscript) {
                    const timeSinceCapture = Date.now() - (window.lastCapturedTime || 0);
                    if (timeSinceCapture < 5000) {
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
        addAIMessage("Speech recognition failed. Please try again or use text input.");
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
// 💭 MESSAGE HANDLING SYSTEM
// ===================================================
function addUserMessage(message) {
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
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ================================
// 🛑 STOP LISTENING FUNCTION (MISSING!)
// ================================
function stopListening() {
    window.isCurrentlyListening = false;
    console.log('🛑 stopListening() called');
    
    if (window.speechRecognition) {
        try {
            window.speechRecognition.stop();
            window.speechRecognition.abort();
            console.log('✅ Speech recognition stopped');
        } catch (e) {
            console.log('Speech recognition stop error:', e);
        }
    }
    
    window.isListening = false;
    window.isRecording = false;
}

// Make globally accessible
window.stopListening = stopListening;

// Add this function to clean emojis from speech text
function cleanEmojisFromSpeech(text) {
    if (!text) return text;
    
    // Remove common emojis that might appear in text but shouldn't be spoken
    const emojiPatterns = [
        /✅/g, /📧/g, /📞/g, /📅/g, /🚨/g, /⏭️/g, /🔄/g, /🙏/g,
        /🎯/g, /🚀/g, /🛡️/g, /🎤/g, /🎬/g, /🆕/g
    ];
    
    let cleanedText = text;
    emojiPatterns.forEach(pattern => {
        cleanedText = cleanedText.replace(pattern, '');
    });
    
    // Clean up any double spaces caused by emoji removal
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    if (cleanedText !== text) {
        console.log('🎨 Cleaned emojis from speech:', text, '→', cleanedText);
    }
    
    return cleanedText;
}

// Make it globally accessible
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
// VOICE SYSTEM CONFIGURATION
// ===========================================
const VOICE_CONFIG = {
    // MAIN CONTROL - Change this to switch voice systems
    provider: 'british',  // 'british' | 'elevenlabs' | 'browser'
    
    // ELEVENLABS CONFIG (when enabled)
    elevenlabs: {
        enabled: false,  // ← SET TO TRUE when you have credits
        apiKey: 'sk_9e7fa2741be74e8cc4af95744fe078712c1e8201cdcada93',
        voiceId: 'zGjIP4SZlMnY9m93k97r',
        model: 'eleven_turbo_v2'
    },
    
    // BRITISH VOICE CONFIG
    british: {
        enabled: true,   // ← FREE, always available
        priority: ['Microsoft Hazel - English (Great Britain)', 'Kate', 'Serena', 'Google UK English Female']
    },
    
    // FALLBACK BROWSER CONFIG
    browser: {
        enabled: true,   // ← Basic fallback
        rate: 0.9,
        pitch: 1.0,
        volume: 0.8
    },
    
    // DEBUG & CONTROL
    debug: true,
    autoFallback: true  // Automatically fallback if primary fails
};

// ===========================================
// GLOBAL VOICE STATE
// ===========================================
let voiceSystem = {
    isSpeaking: false,
    currentProvider: null,
    selectedBritishVoice: null,
    isInitialized: false
};

// ===========================================
// CONSOLIDATED VOICE SYSTEM CLASS
// ===========================================
class MobileWiseVoiceSystem {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        
        if (VOICE_CONFIG.debug) {
            console.log("🎤 Mobile-Wise Consolidated Voice System initializing...");
        }
        
        this.initializeSystem();
    }
    
    // Initialize all voice systems
    async initializeSystem() {
        // Initialize browser voices first
        await this.initializeBrowserVoices();
        
        // Select best British voice if enabled
        if (VOICE_CONFIG.british.enabled) {
            this.selectBritishVoice();
        }
        
        voiceSystem.isInitialized = true;
        voiceSystem.currentProvider = VOICE_CONFIG.provider;
        
        if (VOICE_CONFIG.debug) {
            console.log(`✅ Voice system ready - Provider: ${VOICE_CONFIG.provider}`);
            this.logSystemStatus();
        }
    }
    
    // Initialize browser voices with proper loading
    initializeBrowserVoices() {
        return new Promise((resolve) => {
            const loadVoices = () => {
                this.voices = this.synthesis.getVoices();
                if (this.voices.length > 0) {
                    resolve();
                } else {
                    setTimeout(loadVoices, 100);
                }
            };
            
            this.synthesis.addEventListener('voiceschanged', loadVoices);
            loadVoices();
        });
    }
    
    // Select best British voice
    selectBritishVoice() {
    console.log("🇬🇧 Enhanced British voice search...");
    
    // UPDATED PRIORITY - Google UK voices first!
    const britishVoicePriority = [
        // MOBILE/DESKTOP GOOGLE BRITISH VOICES (highest priority)
        'Google UK English Female',        // ← Your mobile has this!
        'Google UK English Male',          // ← Your mobile has this!
        
        // DESKTOP MICROSOFT BRITISH VOICES
        'Microsoft Hazel - English (Great Britain)',
        'Microsoft Susan - English (Great Britain)',
        
        // MACOS BRITISH VOICES
        'Daniel', 'Kate', 'Serena', 'Oliver',
        
        // OTHER BRITISH PATTERNS
        'British English Female', 'British English Male',
        'English (United Kingdom)', 'English (UK)'
    ];
    
    // STEP 1: Look for exact name matches first
    for (const voiceName of britishVoicePriority) {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) {
            voiceSystem.selectedBritishVoice = voice;
            console.log(`🇬🇧 EXACT MATCH: ${voice.name} (${voice.lang})`);
            return;
        }
    }
    
    // STEP 2: Look for partial name matches with GB language
    for (const voiceName of britishVoicePriority) {
        const voice = this.voices.find(v => 
            v.name.includes(voiceName) && 
            (v.lang.includes('gb') || v.lang.includes('uk') || v.lang === 'en-GB')
        );
        if (voice) {
            voiceSystem.selectedBritishVoice = voice;
            console.log(`🇬🇧 PARTIAL MATCH: ${voice.name} (${voice.lang})`);
            return;
        }
    }
    
    // STEP 3: Any voice with GB/UK language code
    const gbVoice = this.voices.find(v => 
        v.lang === 'en-GB' || v.lang.includes('gb') || v.lang.includes('uk')
    );
    
    if (gbVoice) {
        voiceSystem.selectedBritishVoice = gbVoice;
        console.log(`🇬🇧 LANGUAGE MATCH: ${gbVoice.name} (${gbVoice.lang})`);
        return;
    }
    
    // STEP 4: Premium American female voices (fallback)
    const premiumFemaleVoices = [
        'Microsoft Zira - English (United States)',
        'Google US English',
        'Samantha', 'Victoria'
    ];
    
    for (const voiceName of premiumFemaleVoices) {
        const voice = this.voices.find(v => v.name.includes(voiceName));
        if (voice) {
            voiceSystem.selectedBritishVoice = voice;
            console.log(`🔄 PREMIUM FALLBACK: ${voice.name} (${voice.lang})`);
            return;
        }
    }
    
    // STEP 5: Any English voice
    const anyEnglish = this.voices.find(v => v.lang.startsWith('en'));
    if (anyEnglish) {
        voiceSystem.selectedBritishVoice = anyEnglish;
        console.log(`⚠️ FALLBACK: ${anyEnglish.name} (${anyEnglish.lang})`);
    }
}
    
    // ===========================================
    // MASTER SPEAK FUNCTION - Replaces ALL others
    // ===========================================
    async speak(text, options = {}) {
        if (!text || text.trim() === '') {
            console.warn("⚠️ Empty text provided to voice system");
            return;
        }
        
        // Set speaking state
        voiceSystem.isSpeaking = true;
        window.isSpeaking = true; // For backward compatibility
        
        if (VOICE_CONFIG.debug) {
            console.log(`🎤 Speaking with ${VOICE_CONFIG.provider}: "${text.substring(0, 50)}..."`);
        }
        
        try {
            // Route to correct voice provider
            switch (VOICE_CONFIG.provider) {
                case 'elevenlabs':
                    if (VOICE_CONFIG.elevenlabs.enabled) {
                        await this.speakWithElevenLabs(text);
                    } else {
                        console.warn("⚠️ ElevenLabs disabled, falling back to British");
                        await this.speakWithBritish(text);
                    }
                    break;
                    
                case 'british':
                    await this.speakWithBritish(text);
                    break;
                    
                case 'browser':
                default:
                    await this.speakWithBrowser(text);
                    break;
            }
            
        } catch (error) {
            console.error(`❌ ${VOICE_CONFIG.provider} voice failed:`, error);
            
            // Auto-fallback if enabled
            if (VOICE_CONFIG.autoFallback && VOICE_CONFIG.provider !== 'browser') {
                console.log("🔄 Auto-fallback to browser voice");
                await this.speakWithBrowser(text);
            }
        }
    }
    
    // ===========================================
    // ELEVENLABS VOICE PROVIDER
    // ===========================================
    async speakWithElevenLabs(text) {
        if (!VOICE_CONFIG.elevenlabs.enabled) {
            throw new Error("ElevenLabs not enabled");
        }

        window.isSpeaking = true;
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_CONFIG.elevenlabs.voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': VOICE_CONFIG.elevenlabs.apiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: VOICE_CONFIG.elevenlabs.model,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`);
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.preload = 'auto';
            
            audio.oncanplaythrough = () => {
                audio.play();
            };
            
            audio.onended = () => {
                this.handleSpeechComplete();
                URL.revokeObjectURL(audioUrl);
                resolve();
            };
            
            audio.onerror = (error) => {
                console.error('🚫 ElevenLabs audio error:', error);
                reject(error);
            };
            
            audio.src = audioUrl;
        });
    }
    
    // ===========================================
    // BRITISH VOICE PROVIDER
    // ===========================================
    async speakWithBritish(text) {
        if (!voiceSystem.selectedBritishVoice) {
            throw new Error("No British voice available");
        }

        window.isSpeaking = true; 
        
        this.synthesis.cancel();
        
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voiceSystem.selectedBritishVoice;
            
            // Optimized settings for British voice
            utterance.rate = 1.0;    // ✅ Increased from 0.85 (15% faster)
            utterance.pitch = 1.05;  // Kept same
            utterance.volume = 0.85; // Kept same
            
            utterance.onend = () => {
                this.handleSpeechComplete();
                resolve();
            };
            
           utterance.onerror = (error) => {
    // Suppress "interrupted" errors - they're expected when user clicks buttons
    if (error.error === 'interrupted') {
        console.log('🔇 Speech interrupted (user action)');
        resolve(); // Resolve instead of reject for clean interruption
        return;
    }
    console.error('🚫 British voice error:', error);
    reject(error);
};
            
            this.synthesis.speak(utterance);
            
            // Mobile wake-up fix
            setTimeout(() => {
                if (this.synthesis.paused) this.synthesis.resume();
            }, 100);
        });
    }
    
    // ===========================================
    // BROWSER VOICE PROVIDER (FALLBACK)
    // ===========================================
    async speakWithBrowser(text) {
        this.synthesis.cancel();
        
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Use best available voice or default
            if (this.voices.length > 0) {
                const englishVoice = this.voices.find(v => v.lang.startsWith('en'));
                if (englishVoice) utterance.voice = englishVoice;
            }
            
            utterance.rate = VOICE_CONFIG.browser.rate;
            utterance.pitch = VOICE_CONFIG.browser.pitch;
            utterance.volume = VOICE_CONFIG.browser.volume;
            
            utterance.onend = () => {
                this.handleSpeechComplete();
                resolve();
            };
            
            utterance.onerror = (error) => {
                console.error('🚫 Browser voice error:', error);
                reject(error);
            };
            
            this.synthesis.speak(utterance);
        });
    }
    
    // ============================================================
    // 🎯 SPEECH COMPLETION HANDLER - WITH ELEVENLABS BANNER LOGIC
    // ✅ SMART BUTTON BLOCKING REMOVED FOR BANNER FUNCTIONALITY
    // ============================================================
    handleSpeechComplete() {
        voiceSystem.isSpeaking = false;
        window.isSpeaking = false; // Backward compatibility
        
        if (VOICE_CONFIG.debug) {
            console.log("🔍 PERMANENT HANDLER: Speech completed - checking ElevenLabs banner logic (NO SMART BUTTON BLOCK)");
        }
// ============================================================
// EXACT ELEVENLABS BLOCKING CONDITIONS CHECK
// ============================================================
const now = Date.now();
const clickMentionTime = window.lastClickMentionTime || 0;
const timeSinceClickMention = now - clickMentionTime;
const conversationState = window.conversationState || 'ready';
const thankYouSplashVisible = document.querySelector('.thank-you-splash:not([style*="display: none"])');

// 🆕 CHECK IF COMMUNICATION ACTION CENTER IS VISIBLE
const actionCenterElement = document.getElementById('communication-action-center');
const actionCenterVisible = actionCenterElement && 
                           actionCenterElement.style.display !== 'none' && 
                           actionCenterElement.offsetWidth > 0 && 
                           actionCenterElement.offsetHeight > 0;

// 🐛 DEBUG: ElevenLabs blocking conditions check
if (VOICE_CONFIG.debug) {
    console.log('🐛 DEBUG: ElevenLabs blocking conditions check (SMART BUTTON BYPASSED):');
    console.log(`                - Time since click mention: ${timeSinceClickMention}ms (block if < 3000ms)`);
    console.log(`                - Conversation state: ${conversationState} (block if 'speaking')`);
    console.log('                - Thank you splash visible:', !!thankYouSplashVisible);
    console.log('                - Smart Button Check: PERMANENTLY BYPASSED ✅');
    console.log('                - Lead Capture Active:', !!window.isInLeadCapture);
    console.log('                - Action Center Visible:', !!actionCenterVisible);
}

// Original blocking conditions
const tooSoonAfterClick = timeSinceClickMention < 3000;
const conversationEnded = conversationState === 'speaking';
const thankYouActive = !!thankYouSplashVisible;

// 🆕 NEW BLOCKING CONDITIONS
const leadCaptureActive = window.isInLeadCapture === true;

// 🎯 ONLY CHECK ACTION CENTER IF NOT IN LEAD CAPTURE
const actionCenterShowing = !leadCaptureActive && !!actionCenterVisible;

// Check blocking conditions (removed state check - banner appears after EVERY question)
if (actionCenterShowing || leadCaptureActive) {
    if (VOICE_CONFIG.debug) {
        console.log('🚫 ROOT BLOCK: Action Center or Lead Capture active - no banner allowed');
    }
    return; // STOP HERE - Don't show banner
}

// Then keep your original blocking conditions
if (tooSoonAfterClick || conversationEnded || thankYouActive) {
    console.log('🚫 BLOCKED: One or more blocking conditions active');
    return;
}

if (VOICE_CONFIG.debug) {
    console.log('🎯 CLEAN CHAIN BYPASS: Triggering banner sequence only');
}

// CLEAN APPROACH: Let showDirectSpeakNow handle everything
// It already contains the listening start logic internally
if (typeof showDirectSpeakNow === 'function') {
    showDirectSpeakNow();
    if (VOICE_CONFIG.debug) {
        console.log('✅ Banner triggered - listening will start via internal banner logic');
    }
} else {
    console.warn('⚠️ showDirectSpeakNow not found - using fallback chain');
    startRealtimeListening();
}

// NO setTimeout, NO duplicate startListening calls
return; // Stop the original execution chain
    }
    
    // Stop all speech
    stop() {
        this.synthesis.cancel();
        voiceSystem.isSpeaking = false;
        window.isSpeaking = false;
        if (VOICE_CONFIG.debug) {
            console.log("🛑 All speech stopped");
        }
    }
    
    // Log current system status
    logSystemStatus() {
        console.log("🎤 Voice System Status:");
        console.log(`  Provider: ${VOICE_CONFIG.provider}`);
        console.log(`  British Voice: ${voiceSystem.selectedBritishVoice?.name || 'None'}`);
        console.log(`  ElevenLabs: ${VOICE_CONFIG.elevenlabs.enabled ? 'Enabled' : 'Disabled'}`);
        console.log(`  Total Voices: ${this.voices.length}`);
        console.log(`  ElevenLabs Banner Logic: ✅ INTEGRATED`);
        console.log(`  Smart Button Blocking: ❌ REMOVED (for banner functionality)`);
    }
}

// ===========================================
// INITIALIZE SYSTEM
// ===========================================
window.mobileWiseVoice = new MobileWiseVoiceSystem();

// ===========================================
// CONSOLIDATED API - Replaces ALL existing voice functions
// ===========================================

// MAIN FUNCTION - Use this everywhere
window.speakText = async function(text) {
    // 🎯 CLEAN EMOJIS BEFORE SPEAKING
    const cleanText = cleanEmojisFromSpeech(text);
    return window.mobileWiseVoice.speak(text);
};

// BACKWARD COMPATIBILITY - Replace your existing functions
window.speakResponse = window.speakText;
window.speakResponseOriginal = window.speakText;
window.speakWithElevenLabs = window.speakText;

// CONTROL FUNCTIONS
window.switchToElevenLabs = function() {
    VOICE_CONFIG.provider = 'elevenlabs';
    VOICE_CONFIG.elevenlabs.enabled = true;
    console.log("✅ Switched to ElevenLabs Premium");
    window.speakText("I'm now using premium ElevenLabs voices.");
};

window.switchToBritish = function() {
    VOICE_CONFIG.provider = 'british';
    console.log("✅ Switched to British Female Voice");
    window.speakText("Good day! I'm now using the British female voice system.");
};

window.switchToBrowser = function() {
    VOICE_CONFIG.provider = 'browser';
    console.log("✅ Switched to Browser Voice");
    window.speakText("I'm now using the standard browser voice system.");
};

window.stopAllSpeech = function() {
    window.mobileWiseVoice.stop();
};

window.getVoiceStatus = function() {
    window.mobileWiseVoice.logSystemStatus();
};

// ===========================================
// AUTO-INITIALIZATION
// ===========================================
if (VOICE_CONFIG.debug) {
    console.log("✅ Consolidated Mobile-Wise Voice System loaded! (SMART BUTTON BLOCKING REMOVED)");
    console.log("🎯 Commands: switchToBritish(), switchToElevenLabs(), getVoiceStatus(), stopAllSpeech()");
    console.log(`🎤 Current provider: ${VOICE_CONFIG.provider}`);
    console.log("🚀 ElevenLabs Banner Logic: PERMANENTLY INTEGRATED");
    console.log("🎯 Smart Button Blocking: PERMANENTLY REMOVED");
}

// Auto-show status after initialization
setTimeout(() => {
    if (VOICE_CONFIG.debug && voiceSystem.isInitialized) {
        window.getVoiceStatus();
    }
}, 3000);

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
// 🔇 SPEECH PAUSE HELPER
// ===================================================
function pauseSpeechForBannerInteraction() {
    console.log('🔇 Speech paused for banner interaction');
    // Add any speech pausing logic here if needed
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
            'practice-valuation': "What's driving your interest in a valuation right now?"
        };
        return questions[this.userData.intent] || "What specifically are you looking to accomplish?";
    }
};
console.log('🔄 SalesAI auto-initialized on page load:', window.salesAI);

// =============================================
// 🎯 MISSING getPreCloseQuestion FUNCTION 
// =============================================

function getPreCloseQuestion(intent) {
    const userName = salesAI.userData.firstName || '';
    const namePart = userName ? `${userName}, ` : '';
    
    switch(intent.type) {
        case 'sell-practice':
            return `${namePart}If we could get your practice sold for 20-30% more than going alone in 3 months or less, would you be interested in a free valuation consultation with Bruce?`;
            
        case 'buy-practice':
            return `${namePart}If we could help you find the perfect practice to acquire with financing options, would you be interested in a free acquisition consultation?`;
            
        case 'marketing-help':
            return `${namePart}If we could help you get 5-10 new qualified clients in the next 90 days, would you be interested in a free marketing strategy session?`;
            
        case 'growth-help':
            return `${namePart}If we could help you increase your practice revenue by 25-50% in the next year, would you be interested in a free growth consultation?`;
            
        case 'general-question':
            return `${namePart}Would you like to schedule a quick call with one of our specialists to discuss this further?`;
            
        default:
            return `${namePart}Would you be interested in a free consultation to explore how we can help you?`;
    }
}

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
            
        case 'practice-valuation':
            return handleValuationIntent(message, userFirstName);
            
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
                return `I appreciate you sharing that, ${userName}. What's your ideal timeline for the transition? Are you looking to sell in the next few months, or taking a more measured approach?`;
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
                return `If we could help you sell 20-30% faster than going it alone while maximizing your sale price, would you be open to a free valuation consultation with Bruce?`;
            } else {
                return `If we could secure you 20-30% more for your practice than selling independently, would you be interested in a free valuation consultation with Bruce?`;
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

function handleValuationIntent(message, userName) {
    console.log(`🏠 VALUATION TRUST-BUILDING: state=${salesAI.state}, user=${userName}, message=${message}`);
    
    switch(salesAI.state) {
        case 'investigation':
            // 🎯 STEP 1: Understand valuation motivation
            salesAI.state = 'building_trust_valuation';
            return `${userName}, understanding your practice's true value is so important whether you're planning to sell, grow, or just understand your options. What's motivating you to get a valuation right now?`;
            
        case 'building_trust_valuation':
            // 🎯 STEP 2: Understand timing context - WITH PERSONALIZATION!
            salesAI.state = 'understanding_valuation_timing';
            
            // Personalize based on their motivation
            if (message.toLowerCase().includes('sell') || message.toLowerCase().includes('exit')) {
                return `That makes perfect sense, ${userName}. Knowing your practice's true worth is crucial before entering negotiations. Are you thinking about selling in the near future, or is this more about understanding your position?`;
            } else if (message.toLowerCase().includes('grow') || message.toLowerCase().includes('expand')) {
                return `Smart thinking, ${userName}! A solid valuation gives you the foundation for strategic growth planning. Are you looking to expand soon, or just building your long-term strategy?`;
            } else if (message.toLowerCase().includes('plan') || message.toLowerCase().includes('future')) {
                return `Very prudent, ${userName}. Having accurate numbers really helps with retirement or succession planning. What timeframe are you considering for your planning?`;
            } else {
                return `That's very insightful, ${userName}. Are you thinking about this more for near-term decisions, or longer-term strategic planning?`;
            }
            
        case 'understanding_valuation_timing':
            // 🎯 STEP 3: Custom close for valuation - WITH PERSONALIZATION!
            salesAI.state = 'pre_close';
            
            const isNearTerm = message.toLowerCase().includes('soon') || 
                              message.toLowerCase().includes('near') || 
                              message.toLowerCase().includes('quick') ||
                              message.toLowerCase().includes('month');
            
            if (isNearTerm) {
                return `${userName}, if we could provide you with a comprehensive valuation quickly so you can move forward with confidence, would you be interested in a free valuation consultation?`;
            } else {
                return `${userName}, if we could provide you with a detailed valuation that shows you exactly what your practice is worth and how to maximize its value over time, would you be interested in a free valuation session?`;
            }
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion({type: 'practice-valuation'});
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

// =============================================================================
// 🎯 GOLD STANDARD getAIResponse - 4-STEP SALES PROCESS
// =============================================================================

async function getAIResponse(userMessage, conversationHistory = []) {
    console.log('🎯 GOLD STANDARD getAIResponse called:', userMessage);   

    // 🎯 STEP 0: CHECK FOR CONCERNS FIRST - NEW INTEGRATION
    if (detectConcernOrObjection(userMessage)) {
        console.log('🚨 Concern detected - handling with testimonial');
        handleConcernWithTestimonial(userMessage);
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
                    'practice-valuation': "What's driving your interest in a valuation right now?"
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
    
    // 🎯 STEP 1: URGENT REQUESTS - FAST TRACK TO BRUCE
    const urgentPatterns = ['urgent', 'asap', 'right now', 'immediately', 'emergency', 'call me now'];
    if (urgentPatterns.some(pattern => lowerMessage.includes(pattern))) {
        console.log('🚨 URGENT INTENT DETECTED - FAST TRACKING TO BRUCE');
        triggerBanner('urgent');
        return "I understand this is urgent! Let me connect you with Bruce immediately.";
    }
    
    // 🎯 STEP 2: STRONG INTENT DETECTION & 4-STEP SALES PROCESS
const strongIntent = detectStrongIntent(userMessage);
if (strongIntent) {
    console.log('🎯 STRONG INTENT DETECTED:', strongIntent);
    return handleStrongIntentWithTrustBuilding(strongIntent, userMessage);
}
    
    // 🎯 STEP 3: PRE-CLOSE HANDLING
    if (window.salesAI.state === 'pre_close') {
        console.log('🎯 Processing pre-close response...');
        const preCloseResponse = handlePreCloseResponse(userMessage, window.salesAI.userData.intent);
        speakWithElevenLabs(preCloseResponse, false);
        
        if (preCloseResponse.includes("Perfect! Let me get you connected")) {
    // User said YES - trigger appointment banner
    window.salesAI.state = 'lead_capture';
    console.log('✅ User said YES - triggering appointment banner');
    triggerBanner('setAppointment');

        } else {
            // User said SKIP - return to investigation
            window.salesAI.state = 'investigation';
            console.log('🔄 User said SKIP - returning to investigation');
        }
        
        return preCloseResponse;
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
            const response = `Nice to meet you ${name}! What brings you to New Clients Inc today?`;
            console.log('✅ Name captured, moving to investigation state');
            return response;
        } else {
            return "Hi! I'm your practice transition assistant. What's your first name?";
        }
    }
}

console.log('🔄 No strong intent - using original system logic');
    
    // 🧠 STEP 5: FALLBACK TO ORIGINAL LOGIC
    console.log('🔄 No strong intent - using original system logic');
    if (typeof getOpenAIResponse === 'function') {
        return await getOpenAIResponse(userMessage, conversationHistory);
    } else {
        const fallbackResponse = "I appreciate your message! That's something Bruce would be perfect to help with. Would you like me to connect you with him for a free consultation?";
        speakWithElevenLabs(fallbackResponse, false);
        return fallbackResponse;
    }
}

// =============================================================================
// 🎯 CONCERN DETECTION SYSTEM - NEW INTEGRATION
// =============================================================================

// 🎯 CONCERN DETECTION: Check for objections/negative sentiment
function detectConcernOrObjection(userText) {
    const text = userText.toLowerCase().trim();
    
    // Price objections
    const priceKeywords = [
        'expensive', 'too much', 'cost', 'afford', 'price', 'money',
        'budget', 'cheap', 'fee', 'charge', 'payment'
    ];
    
    // Time objections
    const timeKeywords = [
        'busy', 'no time', 'later', 'not now', 'rush', 'hurry',
        'schedule', 'appointment', 'timing'
    ];
    
    // Trust/skepticism objections
    const trustKeywords = [
        'not sure', 'doubt', 'skeptical', 'risky', 'uncertain',
        'hesitant', 'worried', 'concerned', 'afraid', 'nervous',
        'scam', 'legit', 'trust', 'guarantee'
    ];
    
    // General negative sentiment
    const negativeKeywords = [
        'don\'t want', 'not interested', 'no thanks', 'maybe later',
        'think about it', 'need to consider', 'sounds too good',
        'hard to believe', 'complicated', 'difficult'
    ];
    
    // Check if any negative keywords present
    const allKeywords = [...priceKeywords, ...timeKeywords, ...trustKeywords, ...negativeKeywords];
    
    for (let keyword of allKeywords) {
        if (text.includes(keyword)) {
            console.log(`🚨 CONCERN DETECTED: "${keyword}" in user input`);
            
            // Determine concern type
            if (priceKeywords.some(k => text.includes(k))) {
                window.detectedConcernType = 'price';
            } else if (timeKeywords.some(k => text.includes(k))) {
                window.detectedConcernType = 'time';
            } else if (trustKeywords.some(k => text.includes(k))) {
                window.detectedConcernType = 'trust';
            } else {
                window.detectedConcernType = 'general';
            }
            
            return true;
        }
    }
    
    return false;
}

// 🎯 HANDLE CONCERN WITH TESTIMONIAL - WITH USER TEXT ECHO
function handleConcernWithTestimonial(userText) {
    // 🛑 BLOCK SPEAK SEQUENCE IMMEDIATELY
    window.concernBannerActive = true;
    console.log('🚫 FLAG SET: concernBannerActive = true');
    
    const concernType = window.detectedConcernType || 'general';
    
    console.log(`🎯 Handling ${concernType} concern - triggering testimonial banner`);
    
    // Empathetic acknowledgment that INCLUDES the user's exact words
    let acknowledgment = '';
    
    switch(concernType) {
        case 'price':
            acknowledgment = `I completely understand your concern regarding "${userText}". Many of our clients felt the same way initially. If you'd like to hear what they experienced, click a review below. Or click Skip to continue our conversation.`;
            break;
            
        case 'time':
            acknowledgment = `I hear you on "${userText}". Several of our clients had similar thoughts before working with Bruce. Feel free to click a review to hear their experience, or hit Skip and we'll keep talking.`;
            break;
            
        case 'trust':
            acknowledgment = `That's a fair concern about "${userText}". You're not alone - other practice owners felt the same way at first. You're welcome to check out their reviews below, or click Skip to move forward.`;
            break;
            
        case 'general':
            acknowledgment = `I appreciate you sharing that about "${userText}". Some of Bruce's clients started with similar hesitations. If you're curious what happened for them, click a review. Otherwise, click Skip and let's continue.`;
            break;
    }
    
    // Add AI message
    addAIMessage(acknowledgment);
    
    // Speak the acknowledgment
    setTimeout(() => {
        if (typeof speakResponse === 'function') {
            speakResponse(acknowledgment);
        }
    }, 100);
    
    // Show testimonial banner after speaking
    setTimeout(() => {
        console.log('🎯 Triggering testimonial banner');
        if (typeof showTestimonialBanner === 'function') {
            showTestimonialBanner(concernType);
        } else {
            console.error('❌ showTestimonialBanner function not found');
        }
    }, 3000);
    
    // Store the concern
    window.lastDetectedConcern = {
        text: userText,
        type: concernType,
        timestamp: Date.now()
    };
}

console.log('✅ COMPLETE GOLD STANDARD getAIResponse WITH 4-STEP SALES PROCESS & CONCERN DETECTION LOADED!');

// =============================================================================
// 🛠️ NOW ADDING ALL SUPPORTING FUNCTIONS FROM BOTH FILES
// =============================================================================

// FILE 2 HAS BETTER CONFIG - ADDING IT
const NCI_CONFIG = {
    companyName: "New Clients Inc",
    expertName: "Bruce", 
    serviceType: "CPA practice transitions",

    salesPaths: {
        'sell-practice': {
            investigationQuestion: "How long have you been thinking about selling your practice?",
            valueProp: "Bruce has helped thousands of accountants successfully exit their practices while maximizing value.",
            timeFrame: "3 months or less", 
            result: "get your practice sold for 20-30% more than going alone",
            offer: "free valuation consultation with Bruce"
        },
        'buy-practice': {
            investigationQuestion: "What type of practice are you looking to acquire?",
            valueProp: "Bruce has exclusive off-market opportunities that most buyers never see.",
            timeFrame: "60-90 days",
            result: "find you the perfect practice match", 
            offer: "free buying consultation with Bruce"
        },
        'practice-valuation': {
            investigationQuestion: "What's driving your interest in a valuation right now?",
            valueProp: "Most owners are surprised by their practice's true market worth.",
            timeFrame: "immediately",
            result: "show you exactly what your practice is worth",
            offer: "free valuation from Bruce"
        }
    }
};

// ✅ KEEP YOUR EXISTING detectStrongIntent FUNCTION - IT'S BETTER!
function detectStrongIntent(userMessage) {
    console.log('🔍 detectStrongIntent analyzing:', userMessage);
    const lowerMsg = userMessage.toLowerCase();
    
    // Strong selling indicators
    const strongSellingIndicators = [
        'i want to sell', 'i need to sell', 'looking to sell', 'want to sell', 'need to sell',
        'selling my practice', 'sell my practice', 'sell my firm', 'selling my firm',
        'exit my practice', 'retire from practice', 'transition out'
    ];
    
    // Strong buying indicators
    const strongBuyingIndicators = [
        'i want to buy', 'i need to buy', 'looking to buy', 'want to buy', 'need to buy',
        'buy a practice', 'buy a firm', 'acquire a practice', 'purchase a practice',
        'looking to acquire', 'want to acquire'
    ];
    
    // Strong valuation indicators
    const strongValuationIndicators = [
        'i need a valuation', 'want a valuation', 'get a valuation', 'value my practice',
        'how much is my practice worth', 'what is my practice worth', 'practice worth',
        'valuation of my practice'
    ];
    
    // Check strong intents
    for (const indicator of strongSellingIndicators) {
        if (lowerMsg.includes(indicator)) {
            console.log('🎯 STRONG SELL INTENT DETECTED');
            return { type: 'sell-practice', strength: 'strong' };
        }
    }
    
    for (const indicator of strongBuyingIndicators) {
        if (lowerMsg.includes(indicator)) {
            console.log('🎯 STRONG BUY INTENT DETECTED');
            return { type: 'buy-practice', strength: 'strong' };
        }
    }
    
    for (const indicator of strongValuationIndicators) {
        if (lowerMsg.includes(indicator)) {
            console.log('🎯 STRONG VALUATION INTENT DETECTED');
            return { type: 'practice-valuation', strength: 'strong' };
        }
    }

      // 🚨 ADD THIS: If we're already in a trust-building flow, keep the intent!
    if (salesAI.state.includes('building_trust') || salesAI.state.includes('understanding_timing')) {
        console.log('🎯 CONTINUING EXISTING TRUST-BUILDING FLOW');
        return { type: 'sell-practice', strength: 'strong' };
    }
    
    console.log('🔍 No strong intent detected');
    return null;
}

// ✅ ADD THE MISSING getPreCloseQuestion FUNCTION
function getPreCloseQuestion(intent) {
    const userName = salesAI.userData.firstName || '';
    const namePart = userName ? `${userName}, ` : '';
    
    switch(intent.type) {
        case 'sell-practice':
            return `${namePart}If we could get your practice sold for 20-30% more than going alone in 3 months or less, would you be interested in a free valuation consultation with Bruce?`;
            
        case 'buy-practice':
            return `${namePart}If we could help you find the perfect practice to acquire with financing options, would you be interested in a free acquisition consultation?`;
            
        case 'practice-valuation':
            return `${namePart}If we could provide you with a comprehensive practice valuation and show you how to maximize your practice's worth, would you be interested in a free valuation session?`;
            
        case 'marketing-help':
            return `${namePart}If we could help you get 5-10 new qualified clients in the next 90 days, would you be interested in a free marketing strategy session?`;
            
        case 'growth-help':
            return `${namePart}If we could help you increase your practice revenue by 25-50% in the next year, would you be interested in a free growth consultation?`;
            
        case 'general-question':
            return `${namePart}Would you like to schedule a quick call with one of our specialists to discuss this further?`;
            
        default:
            return `${namePart}Would you be interested in a free consultation to explore how we can help you?`;
    }
}

// ✅ UPDATE handleStrongIntentWithTrustBuilding TO INCLUDE VALUATION
function handleStrongIntentWithTrustBuilding(intent, message) {
    const userFirstName = salesAI.userData.firstName || 'there';
    console.log(`🏠 TRUST-BUILDING: Handling ${intent.type} for ${userFirstName}, state: ${salesAI.state}`);
    
    switch(intent.type) {
        case 'sell-practice':
            return handleSellPracticeIntent(message, userFirstName);
            
        case 'buy-practice':
            return handleBuyPracticeIntent(message, userFirstName);
            
        case 'practice-valuation':
            return handleValuationIntent(message, userFirstName);
            
        case 'general-question':
            return handleGeneralQuestion(message, userFirstName);
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion(intent);
    }
}

// ✅ ADD VALUATION INTENT HANDLER
function handleValuationIntent(message, userName) {
    switch(salesAI.state) {
        case 'investigation':
            salesAI.state = 'building_trust_valuation';
            return `${userName}, understanding your practice's true value is so important whether you're planning to sell, grow, or just understand your options. What's motivating you to get a valuation right now?`;
            
        case 'building_trust_valuation':
            salesAI.state = 'understanding_valuation_timing';
            return `That makes sense. Are you thinking about selling in the near future, or is this more about understanding your practice's current position for growth planning?`;
            
        case 'understanding_valuation_timing':
            salesAI.state = 'pre_close';
            return `If we could provide you with a comprehensive valuation that shows you exactly what your practice is worth and how to maximize its value, would you be interested in a free valuation consultation?`;
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion({type: 'practice-valuation'});
    }
}

// BOTH FILES HAVE buildRapportResponse - USING FILE 1'S VERSION (IT'S MORE PERSONAL)
function buildRapportResponse(intentType, userName = '') {
    const namePart = userName ? `${userName}, ` : '';
    
    const responses = {
        'sell-practice': `${namePart}I completely understand your interest in selling your practice. Many practitioners reach a point where they're ready for their next chapter. Bruce actually helped me transition my own practice 5 years ago before I joined him here. His approach is truly different - he focuses on finding the right cultural fit, not just the highest bidder. What got you thinking about selling at this particular time?`,
        
        'buy-practice': `${namePart}That's exciting that you're looking to acquire a practice! Growth through acquisition can be incredibly rewarding. Bruce has an amazing track record of matching buyers with practices that align with their vision. He actually helped me find my current practice when I was in your position. What specific type of practice are you hoping to find?`,
        
        'practice-valuation': `${namePart}Getting a proper valuation is so important. Many practitioners are surprised to learn what their life's work is truly worth. Bruce has a unique methodology that looks beyond just the numbers - he considers strategic value, growth potential, and market positioning. He helped me understand the real value drivers in my own practice. What's motivating your interest in a valuation right now?`
    };
    
    return responses[intentType] || `${namePart}I'd love to help you with that. Could you tell me more about what you're looking to accomplish?`;
}

// FILE 2 HAS buildPreCloseQuestion - ADDING IT (IT WAS MISSING FROM FILE 1)
function buildPreCloseQuestion(intentType, userName = '') {
    const name = userName ? `${userName}, ` : '';
    const path = NCI_CONFIG.salesPaths[intentType];

    if (!path) return `${name}Would you be interested in a free consultation with Bruce?`;

    return `${name}If we could ${path.result} in ${path.timeFrame}, would you be interested in a ${path.offer}?`;
}

// BOTH FILES HAVE handlePreCloseResponse - USING FILE 1'S VERSION (IT'S MORE COMPLETE)
function handlePreCloseResponse(userResponse, intentType) {
    const lowerResponse = userResponse.toLowerCase();
    
    // YES responses
    const yesPatterns = ['yes', 'yeah', 'sure', 'okay', 'ok', 'absolutely', 'definitely', 'let\'s do it', 'ready', 'go ahead'];
    
    // NO responses  
    const noPatterns = ['no', 'not yet', 'maybe later', 'not now', 'no thanks', 'nah', 'wait', 'hold on'];
    
    if (yesPatterns.some(pattern => lowerResponse.includes(pattern))) {
        return "Perfect! Let me get you connected with Bruce directly. He's the expert who can give you personalized guidance based on your specific situation. He should be available for a quick call within the next few minutes.";
    }
    
    if (noPatterns.some(pattern => lowerResponse.includes(pattern))) {
        return "I completely understand wanting to take your time with such an important decision. What specific questions or concerns would be most helpful for you to have answered right now?";
    }
    
    // Ambiguous response
    return "Thanks for sharing that. To make sure I connect you with the right resources, would now be a good time for Bruce to give you a quick call, or would you prefer to get some initial information first?";
}

// FILE 2 HAS BANNER_MAPPING AND triggerBanner - ADDING THEM (THEY WERE MISSING FROM FILE 1)
const BANNER_MAPPING = {
    'urgent': 'urgent',
    'sell-practice': { investigation: 'expertise', preClose: 'freeIncentive', yesResponse: 'setAppointment' },
    'buy-practice': { investigation: 'expertise', preClose: 'freeIncentive', yesResponse: 'setAppointment' },
    'practice-valuation': { investigation: 'expertise', preClose: 'freeIncentive', yesResponse: 'setAppointment' },
    'appointment': 'setAppointment',
    'consultation': 'setAppointment',
    'pre-qualifier': 'preQualifier',
    'time': 'testimonialSelector',
    'money': 'testimonialSelector', 
    'trust': 'testimonialSelector',
    'complexity': 'testimonialSelector',
    'about-nci': 'expertise',
    'services': 'freeIncentive',
    'process': 'freeIncentive'
};

function triggerBanner(intentType, step = 'default') {
    const mapping = BANNER_MAPPING[intentType];
    if (!mapping) {
        console.log('❌ No banner mapping for:', intentType);
        return;
    }

    let bannerType = mapping;
    if (typeof mapping === 'object') {
        if (step === 'investigation' && mapping.investigation) {
            bannerType = mapping.investigation;
        } else if (step === 'preClose' && mapping.preClose) {
            bannerType = mapping.preClose;
        } else if (step === 'yesResponse' && mapping.yesResponse) {
            bannerType = mapping.yesResponse;
        }
    }

    console.log(`🎯 Triggering banner: ${bannerType} for ${intentType} at step: ${step}`);

    setTimeout(() => {
        if (typeof showUniversalBanner === 'function') {
            showUniversalBanner(bannerType);
        }
    }, 1000);
}

console.log('✅ COMPLETE GOLD STANDARD getAIResponse WITH 4-STEP SALES PROCESS & AUTO-ADVANCE LOADED!');

function processUserResponse(userText) {
    console.log('🎯 processUserResponse called with:', userText);
    
    // 🚨 CHECK IF ACTION SYSTEM IS IN LEAD CAPTURE MODE
    if (window.isInLeadCapture && window.processLeadResponse) {
        console.log('🎯 Lead capture active - routing to Action System');
        const handled = window.processLeadResponse(userText);
        if (handled) {
            console.log('✅ Lead capture handled - not processing as normal chat');
            return; // Exit early - don't process as conversation
        }
    }
    
    // 🎯 STEP 0: CHECK FOR CONCERNS FIRST
    if (detectConcernOrObjection(userText)) {
        console.log('🚨 Concern detected - handling with testimonial');
        handleConcernWithTestimonial(userText);
        return; // Stop the sales process for concerns
    }

    // Process through getAIResponse
    setTimeout(async () => {
        const responseText = await getAIResponse(userText);
        
        console.log('🎯 AI RESPONSE:', responseText);
        
        // Add AI message to chat
        addAIMessage(responseText);
        
        // Speak the response
        if (typeof speakWithElevenLabs === 'function') {
            speakWithElevenLabs(responseText);
        }
    }, 800);
}

// =============================================
// 🎯 MISSING getPreCloseQuestion FUNCTION 
// =============================================

function getPreCloseQuestion(intent) {
    const userName = salesAI.userData.firstName || '';
    const namePart = userName ? `${userName}, ` : '';
    
    switch(intent.type) {
        case 'sell-practice':
            return `${namePart}If we could get your practice sold for 20-30% more than going alone in 3 months or less, would you be interested in a free valuation consultation with Bruce?`;
            
        case 'buy-practice':
            return `${namePart}If we could help you find the perfect practice to acquire with financing options, would you be interested in a free acquisition consultation?`;
            
        case 'marketing-help':
            return `${namePart}If we could help you get 5-10 new qualified clients in the next 90 days, would you be interested in a free marketing strategy session?`;
            
        case 'growth-help':
            return `${namePart}If we could help you increase your practice revenue by 25-50% in the next year, would you be interested in a free growth consultation?`;
            
        case 'general-question':
            return `${namePart}Would you like to schedule a quick call with one of our specialists to discuss this further?`;
            
        default:
            return `${namePart}Would you be interested in a free consultation to explore how we can help you?`;
    }
}

function askQuickQuestion(questionText) {
    console.log('🎯 Quick button clicked:', questionText);
    
    // 🎨 ADD USER MESSAGE TO CHAT (this was missing!)
    if (typeof addUserMessage === 'function') {
        addUserMessage(questionText);
    }
    
    // 1️⃣ STOP ALL SPEECH IMMEDIATELY
    if (typeof stopAllSpeech === 'function') {
        stopAllSpeech();
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    // 2️⃣ DETECT WHICH BUTTON WAS CLICKED
    let buttonIntent = null;
    let acknowledgment = null;
    let targetState = null;
    let scriptResponse = null;
    
    const buttonText = questionText.toLowerCase();
    
    if (buttonText.includes('valuation') || buttonText.includes('worth')) {
        // PRACTICE VALUATION BUTTON
        buttonIntent = 'valuation';
        acknowledgment = "Fantastic! You want to know what your practice is worth.";
        targetState = 'asking_valuation_consultation';
        
        scriptResponse = window.leadData && window.leadData.firstName ?
            `Perfect ${window.leadData.firstName}! Bruce can provide a FREE valuation. Most owners are surprised by the value. Interested?` :
            "Perfect! Bruce can provide a FREE valuation. Most owners are surprised. Interested?";
            
    } else if (buttonText.includes('sell')) {
        // SELLING OPTIONS BUTTON
        buttonIntent = 'selling';
        acknowledgment = "Fantastic! You want to sell your practice.";
        targetState = 'selling_size_question';
        
        scriptResponse = window.leadData && window.leadData.firstName ?
            `Wow ${window.leadData.firstName}! That's a huge decision. How many clients are you serving?` :
            "Wow! That's a huge decision. How many clients are you serving?";
            
    } else if (buttonText.includes('buy')) {
        // BUYING OPTIONS BUTTON
        buttonIntent = 'buying';
        acknowledgment = "Fantastic! You want to buy a practice.";
        targetState = 'buying_budget_question';
        
        scriptResponse = window.leadData && window.leadData.firstName ?
            `Excellent, ${window.leadData.firstName}! Bruce has some fantastic opportunities available right now. Tell me, what's your budget range for acquiring a practice?` :
            "Excellent! Bruce has some fantastic opportunities available. What's your budget range for acquiring a practice?";
    }
    
    // 3️⃣ CHECK IF WE HAVE THEIR NAME
    const firstName = window.leadData ? window.leadData.firstName : null;
    
    if (firstName) {
        // ✅ HAS NAME - Jump directly to the conversation flow
        console.log(`✅ Name exists (${firstName}) - jumping to ${targetState}`);
        
        conversationState = targetState;
        
        // 🎨 ADD AI MESSAGE TO CHAT
        if (typeof addAIMessage === 'function') {
            addAIMessage(scriptResponse);
        }
        
        // Speak the response
        setTimeout(() => {
            speakText(scriptResponse);
        }, 100);
        
        // Trigger expertise banner
        setTimeout(() => {
            if (typeof showUniversalBanner === 'function') {
                showUniversalBanner('expertise');
            }
        }, 1500);
        
    } else {
        // ❌ NO NAME YET - Acknowledge intent + Ask for name
        console.log(`❌ No name yet - storing pendingIntent: ${buttonIntent}`);
        
        // Store the pending intent so we can resume after name capture
        window.pendingIntent = buttonIntent;
        window.pendingIntentState = targetState;
        window.pendingIntentResponse = scriptResponse;
        
        // Set state to capture name
        conversationState = 'getting_first_name';
        
        // Build full response
        const fullResponse = acknowledgment + " Can I get your name first, please?";
        
        // 🎨 ADD AI MESSAGE TO CHAT
        if (typeof addAIMessage === 'function') {
            addAIMessage(fullResponse);
        }
        
        // Speak acknowledgment + name request
        setTimeout(() => {
            speakText(fullResponse);
        }, 100);
        
        // ✅ RESTART VOICE LISTENING AFTER SPEECH
        setTimeout(() => {
            if (typeof startListening === 'function') {
                startListening();
            }
        }, 2000);
        
        // Show expertise banner immediately
        setTimeout(() => {
            if (typeof showUniversalBanner === 'function') {
                showUniversalBanner('expertise');
            }
        }, 1500);
    }
}

// ===================================================
// 🎯 NAME CAPTURE HANDLER - RESUME PENDING INTENT
// ===================================================

// Add this to your name capture logic (inside processUserResponse or wherever you handle name collection)
function resumePendingIntent() {
    if (window.pendingIntent) {
        console.log('🎯 Resuming pendingIntent:', window.pendingIntent);
        
        const intent = window.pendingIntent;
        window.pendingIntent = null; // Clear it
        
        // Create appropriate message based on intent
        let message = '';
        switch(intent) {
            case 'selling':
                message = 'I want to sell my practice';
                break;
            case 'buying':
                message = 'I want to buy a practice';
                break;
            case 'valuation':
                message = 'How much is my practice worth?';
                break;
        }
        
        // Process the intent
        processQuickIntent(intent, message);
    }
}


// Make globally accessible
// window.handleCTAButtonClick = handleCTAButtonClick; // Function handled by action-button-system-CAPTAIN.js

// 🎯 ADD THIS FUNCTION AT THE END OF YOUR FILE:
function shouldTriggerLeadCapture(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // User's affirmative responses
    const yesResponses = [
        'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'absolutely', 
        'definitely', 'of course', 'let\'s do it', 'sounds good',
        'i would', 'i\'d like that', 'that sounds great', 'let\'s go'
    ];
    
    // Check if we're in a consultation asking state
    const consultationStates = [
        'asking_selling_consultation',
        'asking_buying_consultation', 
        'asking_valuation_consultation'
    ];
    
    return yesResponses.includes(input) && consultationStates.includes(conversationState);
}

// 🎯 ADD THIS FUNCTION AT THE END OF YOUR FILE:
function shouldTriggerLeadCapture(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // User's affirmative responses
    const yesResponses = [
        'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'absolutely', 
        'definitely', 'of course', 'let\'s do it', 'sounds good',
        'i would', 'i\'d like that', 'that sounds great', 'let\'s go'
    ];
    
    // Check if we're in a consultation asking state
    const consultationStates = [
        'asking_selling_consultation',
        'asking_buying_consultation', 
        'asking_valuation_consultation'
    ];
    
    return yesResponses.includes(input) && consultationStates.includes(conversationState);
}

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
            const responseText = `Perfect ${data.firstName}! Bruce will ${data.captureType === 'urgent' ? 'prioritize your urgent request' : 'call you shortly'}. Is there anything else I can help you with?`;
            
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
                        askEmailMessage += ` Bruce will share some exclusive opportunities that match your criteria.`;
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
window.askQuickQuestion = askQuickQuestion;
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

function showTestimonialVideo(testimonialType, duration = 12000) {
    console.log(`🎬 Playing ${testimonialType} testimonial for ${duration}ms`);
    
    // 🚫 PREVENT DOUBLE CALLS - BULLETPROOF (same as your original)
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Avatar already playing - skipping duplicate testimonial call');
        return;
    }
    
    window.avatarCurrentlyPlaying = true;
    
    const isMobile = window.innerWidth <= 768;
    
    // 🎯 BRUCE'S TESTIMONIAL VIDEO URLS (from your browser optimization file)
    const testimonialVideos = {
        skeptical: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4", // Skeptical, Then Exceeded Expectations
        speed: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4"      // Surprised by the Speed of the Sale
    };
    
    const videoUrl = testimonialVideos[testimonialType] || testimonialVideos.skeptical;
    
    const avatarOverlay = document.createElement('div');
    
    // EXACT SAME STYLING AS YOUR ORIGINAL AVATAR FUNCTION
    if (isMobile) {
        avatarOverlay.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            background: #000; z-index: 9999;
            display: flex; justify-content: center; align-items: center;
        `;
        
        avatarOverlay.innerHTML = `
            <video id="testimonialVideo" autoplay playsinline webkit-playsinline="true" style="
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
            <video id="testimonialVideo" autoplay style="
                width: 100%; height: 100%; object-fit: cover;
            ">
                <source src="${videoUrl}" type="video/mp4">
            </video>
        `;
    }
    
    document.body.appendChild(avatarOverlay);

    function getAIResponse(userInput) {
    const userText = userInput.toLowerCase().trim();
    const firstName = window.leadData.firstName || '';
    let responseText = '';

     }

    // 🎯 CLEANUP - CONTINUES CONVERSATION (KEY DIFFERENCE FROM SORRY MESSAGE)
function cleanup() {
    console.log(`🎬 Testimonial ${testimonialType} complete - continuing conversation`);
    
    if (avatarOverlay.parentNode) {
        avatarOverlay.remove();
    }
    
    window.avatarCurrentlyPlaying = false;
    
    // ✅ NEW: Trigger testimonial completion callback
    if (typeof handleTestimonialComplete === 'function') {
        console.log('🎯 Calling handleTestimonialComplete callback');
        handleTestimonialComplete();
    }
    
    // 🎯 NO "Speak Now" - let conversation continue naturally
    setTimeout(() => {
        console.log('✅ Testimonial removed - conversation continues naturally');
        // Conversation flows naturally without interruption
    }, 1000);
}
    
    setTimeout(cleanup, duration);
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

// Keep your existing showDirectSpeakNow function exactly as is
async function showDirectSpeakNow() {
    // If NOT in lead capture, wait for Action Center to appear
    if (!window.isInLeadCapture) {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Check if Action Center appeared
    const actionCenter = document.getElementById('communication-action-center');
    if (actionCenter && actionCenter.style.display !== 'none') {
        console.log('🚫 BLOCKED: Communication Action Center is visible - waiting for user selection');
        return;
        }
    }
    
    // If we got here, show the banner
    console.log('🎯 DIRECT Speak Now - skipping Get Ready phase completely');
    
    window.speakSequenceBlocked = true;
    speakSequenceActive = true;
    console.log('🔒 DIRECT: Sequence locked for Speak Now only');
    
    function directCleanup() {
        console.log('🧹 DIRECT: Running cleanup');
        window.speakSequenceBlocked = false;
        speakSequenceActive = false;
        window.playingSorryMessage = false;
        if (window.currentBulletproofTimer) {
            clearTimeout(window.currentBulletproofTimer);
            window.currentBulletproofTimer = null;
        }
        console.log('🔓 DIRECT: All locks released');
    }
    
    // Set up timer for this sequence
    let directTimer = setTimeout(() => {
        console.log('🕐 DIRECT: Safety timeout after 15 seconds');
        directCleanup();
    }, 30000);
    window.currentBulletproofTimer = directTimer;
    
    window.clearBulletproofTimer = function() {
        if (window.currentBulletproofTimer) {
            clearTimeout(window.currentBulletproofTimer);
            window.currentBulletproofTimer = null;
            console.log('🧹 DIRECT: Timer cleared');
        }
    };

    const isContactInterview = checkContactInterviewMode();
    console.log('📧 DIRECT Contact interview mode:', isContactInterview);

    const quickButtonsContainer = document.querySelector('.quick-questions') || 
                                  document.querySelector('.quick-buttons') || 
                                  document.getElementById('quickButtonsContainer');

    if (!quickButtonsContainer) {
        console.log('❌ DIRECT: Quick buttons container not found');
        directCleanup();
        return;
    }

    const existingButtons = quickButtonsContainer.querySelectorAll('.quick-btn');
    existingButtons.forEach(btn => btn.style.display = 'none');

    const existingSpeakBtn = document.getElementById('speak-sequence-button');
    if (existingSpeakBtn) {
        existingSpeakBtn.remove();
        console.log('🗑️ DIRECT: Removed existing speak button');
    }
    
    // Make sure styles exist
    if (!document.getElementById('mobile-wise-speak-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-wise-speak-styles';
        style.textContent = `
            .mobile-wise-banner {
                width: 100% !important;
                padding: 18px !important;
                min-height: 50px !important;
                font-weight: bold !important;
                font-size: 18px !important;
                border-radius: 20px !important;
                border: 2px solid !important;
                position: relative !important;
                overflow: hidden !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 15px !important;
            }
            
            .speak-now-state {
                background: rgba(34, 197, 94, 0.4) !important;
                border-color: rgba(34, 197, 94, 0.8) !important;
                color: #ffffff !important;
                animation: speak-now-pulse 2s infinite;
            }
            
            @keyframes speak-now-pulse {
                0%, 100% { 
                    box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 25px rgba(34, 197, 94, 0.9);
                    transform: scale(1.02);
                }
            }
            
            .sound-waves {
                display: flex;
                gap: 3px;
                align-items: center;
            }
            
            .wave-bar {
                width: 3px;
                background: #4ade80;
                border-radius: 2px;
                animation: sound-wave 1.2s infinite ease-in-out;
            }
            
            .wave-bar:nth-child(1) { height: 15px; animation-delay: 0s; }
            .wave-bar:nth-child(2) { height: 25px; animation-delay: 0.1s; }
            .wave-bar:nth-child(3) { height: 20px; animation-delay: 0.2s; }
            .wave-bar:nth-child(4) { height: 30px; animation-delay: 0.3s; }
            .wave-bar:nth-child(5) { height: 18px; animation-delay: 0.4s; }
            
            @keyframes sound-wave {
                0%, 100% { transform: scaleY(0.3); opacity: 0.7; }
                50% { transform: scaleY(1); opacity: 1; }
            }
            
            .green-dot-blink {
                animation: green-blink 1.5s infinite;
            }
            
            @keyframes green-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // CREATE SPEAK NOW BANNER DIRECTLY - NO GET READY!
    speakSequenceButton = document.createElement('button');
    speakSequenceButton.id = 'speak-sequence-button';
    speakSequenceButton.className = 'quick-btn mobile-wise-banner speak-now-state';
    
    speakSequenceButton.innerHTML = `
        <div class="sound-waves">
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
        </div>
        <span class="green-dot-blink">🟢</span>
        <div>Speak Now!</div>
    `;
    
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        speakSequenceButton.style.cssText += `
            position: relative !important;
            z-index: 1000 !important;
            min-height: 50px !important;
            padding: 18px !important;
        `;
    }
    
    quickButtonsContainer.appendChild(speakSequenceButton);
    console.log('🟢 DIRECT Speak Now state active - starting listening immediately');
    
    // Use the SAME pattern as normal questions
console.log('🎤 DIRECT: Starting listening after Speak Now banner');
window.lastRecognitionResult = null;

// Call startListening first (like normal questions)
if (typeof startMobileListening === 'function') {
    startMobileListening();
} else {
    startNormalInterviewListening();
}

// ❌ REMOVED: forceStartListening() backup call - causes "already started" error
// Recognition is already started by startNormalInterviewListening() above
// setTimeout(() => {
//     console.log('🔄 DIRECT backup: calling forceStartListening()');
//     forceStartListening();
// }, 100);
        
        // 🔥 FIXED: Check disableDirectTimeout flag before setting timeout
if (!window.disableDirectTimeout) {
    // 🎯 LEAD CAPTURE: Extended timeout for interview questions
    const listeningTimeout = window.isInLeadCapture ? 20000 : 7000;
    console.log(`⏰ DIRECT: Starting ${listeningTimeout/1000}-second listening window ${window.isInLeadCapture ? '(LEAD CAPTURE MODE)' : '(NORMAL MODE)'}`);
    
    setTimeout(() => {
        if (!speakSequenceActive) return;
        
        console.log(`⏰ DIRECT: ${listeningTimeout/1000}-second listening window ended - no speech detected`);
        
        // Clean up and trigger avatar again
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
        
        // ===== 🛡️ LEAD CAPTURE PROTECTION: NO AVATAR INTERRUPTION =====
        if (window.isInLeadCapture) {
            console.log('🛡️ LEAD CAPTURE ACTIVE: Skipping avatar, restarting Speak Now sequence');
            // Just restart the speak sequence without avatar interruption
            startRealtimeListening();
            return;
        }
        
        console.log('🎬 DIRECT: Triggering avatar after timeout');
        if (typeof showAvatarSorryMessage === 'function') {
            showAvatarSorryMessage();
        }
        
    }, listeningTimeout);  // ← Changed from hardcoded 7000
} else {
    console.log('🚫 DIRECT: Timeout disabled - banner will stay until speech detected');
}
        
    
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

function showHybridReadySequence() {
    // 🛑 PREVENT INTERRUPTION IF CONCERN BANNER IS ACTIVE
    if (window.concernBannerActive) {
        console.log('⏸️ Concern banner active - blocking hybrid sequence');
        return;
    }
    console.log('🎯 Starting Mobile-Wise AI speak sequence...');
    
    // ===== BULLETPROOF BLOCKING =====
    if (window.speakSequenceBlocked) {
        console.log('🔇 BULLETPROOF BLOCK: Another session already running - HARD STOP');
        return;
    }
    
    window.speakSequenceBlocked = true;
    console.log('🛡️ BULLETPROOF: Block activated immediately');
    
    if (speakSequenceActive) {
        console.log('🛑 BULLETPROOF: Sequence already active - BLOCKING completely');
        window.speakSequenceBlocked = false;
        return;
    }
    
    speakSequenceActive = true;
    window.lastSequenceStart = Date.now();
    console.log('🔒 BULLETPROOF: Sequence locked and active');
    
    function bulletproofCleanup() {
        console.log('🧹 BULLETPROOF: Running complete cleanup');
        window.speakSequenceBlocked = false;
        speakSequenceActive = false;
        window.playingSorryMessage = false;
        
        // CLEAR THE TIMER TOO
        if (window.currentBulletproofTimer) {
            clearTimeout(window.currentBulletproofTimer);
            window.currentBulletproofTimer = null;
        }
        
        console.log('🔓 BULLETPROOF: All locks released');
    }
    
   // TEMPORARILY DISABLED BULLETPROOF TIMER FOR DEBUGGING
console.log('🛡️ BULLETPROOF: Timer temporarily disabled for debugging');
let bulletproofTimer = null; // Disabled

// Still keep the clear function
window.clearBulletproofTimer = function() {
    console.log('🧹 BULLETPROOF: Timer clear called (timer disabled)');
};

    // Store timer reference for cleanup
    window.currentBulletproofTimer = bulletproofTimer;

    // Clear timer function for successful completions
    window.clearBulletproofTimer = function() {
        if (window.currentBulletproofTimer) {
            clearTimeout(window.currentBulletproofTimer);
            window.currentBulletproofTimer = null;
            console.log('🧹 BULLETPROOF: Timer cleared - normal completion');
        }
    };
    
    if (typeof recognition !== 'undefined' && recognition) {
        try {
            recognition.stop();
            console.log('🔇 Stopped any existing recognition session');
        } catch (e) {
            console.log('🔇 Recognition cleanup completed');
        }
    }

    applyMobileStability();
    setupMobileTouchEvents();
    
    if (typeof BannerOrchestrator !== 'undefined' && 
        BannerOrchestrator.currentBanner === 'smartButton') {
        console.log('🔇 BLOCKED: Smart Button active');
        bulletproofCleanup();
        return;
    }
    
    if (document.getElementById('thankYouSplash')) {
        console.log('🔇 BLOCKED: Thank you splash screen active');
        bulletproofCleanup();
        return;
    }
    
    if (conversationState === 'ended' || conversationState === 'splash_screen_active') {
        console.log('🔇 BLOCKED: Conversation ended');
        bulletproofCleanup();
        return;
    }

    if (!window.playingSorryMessage) {
        window.playingSorryMessage = true;
        console.log('🔒 Setting playingSorryMessage protection (first time)');
    } else {
        console.log('🔄 playingSorryMessage already set - keeping existing protection');
    }

    const isContactInterview = checkContactInterviewMode();
    console.log('📧 Contact interview mode:', isContactInterview);

    const quickButtonsContainer = document.querySelector('.quick-questions') || 
                                  document.querySelector('.quick-buttons') || 
                                  document.getElementById('quickButtonsContainer');

    if (!quickButtonsContainer) {
        console.log('❌ Quick buttons container not found');
        bulletproofCleanup();
        return;
    }

    const existingButtons = quickButtonsContainer.querySelectorAll('.quick-btn');
    existingButtons.forEach(btn => btn.style.display = 'none');

    const existingSpeakBtn = document.getElementById('speak-sequence-button');
    if (existingSpeakBtn) {
        existingSpeakBtn.remove();
        console.log('🗑️ Removed existing speak button');
    }

    const existingPrompt = document.getElementById('click-button-prompt');
    if (existingPrompt) {
        existingPrompt.remove();
    }
    
    // ===== BEAUTIFUL STYLES =====
    if (!document.getElementById('mobile-wise-speak-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-wise-speak-styles';
        style.textContent = `
            .mobile-wise-banner {
                width: 100% !important;
                padding: 18px !important;
                min-height: 50px !important;
                font-weight: bold !important;
                font-size: 18px !important;
                border-radius: 20px !important;
                border: 2px solid !important;
                position: relative !important;
                overflow: hidden !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 15px !important;
            }
            
            .get-ready-state {
                background: rgba(79, 195, 247, 0.2) !important;
                border-color: rgba(79, 195, 247, 0.8) !important;
                color: #ffffff !important;
            }
            
            .get-ready-fill {
                position: absolute;
                top: 0;
                left: 0;
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, rgba(79, 195, 247, 0.6), rgba(25, 118, 210, 0.8));
                transition: width 3s ease;
                z-index: 1;
            }
            
            .get-ready-content {
                position: relative;
                z-index: 2;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .get-ready-spinner {
                width: 24px;
                height: 24px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top: 3px solid #ffffff;
                border-radius: 50%;
                animation: spinner-spin 1s linear infinite;
            }
            
            @keyframes spinner-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .speak-now-state {
                background: rgba(34, 197, 94, 0.4) !important;
                border-color: rgba(34, 197, 94, 0.8) !important;
                color: #ffffff !important;
                animation: speak-now-pulse 2s infinite;
            }
            
            @keyframes speak-now-pulse {
                0%, 100% { 
                    box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 25px rgba(34, 197, 94, 0.9);
                    transform: scale(1.02);
                }
            }
            
            .sound-waves {
                display: flex;
                gap: 3px;
                align-items: center;
            }
            
            .wave-bar {
                width: 3px;
                background: #4ade80;
                border-radius: 2px;
                animation: sound-wave 1.2s infinite ease-in-out;
            }
            
            .wave-bar:nth-child(1) { height: 15px; animation-delay: 0s; }
            .wave-bar:nth-child(2) { height: 25px; animation-delay: 0.1s; }
            .wave-bar:nth-child(3) { height: 20px; animation-delay: 0.2s; }
            .wave-bar:nth-child(4) { height: 30px; animation-delay: 0.3s; }
            .wave-bar:nth-child(5) { height: 18px; animation-delay: 0.4s; }
            
            @keyframes sound-wave {
                0%, 100% { transform: scaleY(0.3); opacity: 0.7; }
                50% { transform: scaleY(1); opacity: 1; }
            }
            
            .green-dot-blink {
                animation: green-blink 1.5s infinite;
            }
            
            @keyframes green-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== CREATE GET READY BANNER =====
    speakSequenceButton = document.createElement('button');
    speakSequenceButton.id = 'speak-sequence-button';
    speakSequenceButton.className = 'quick-btn mobile-wise-banner get-ready-state';
    
    speakSequenceButton.innerHTML = `
        <div class="get-ready-fill" id="getReadyFill"></div>
        <div class="get-ready-content">
            <div class="get-ready-spinner"></div>
            <div>Get Ready to Speak...</div>
        </div>
    `;
    
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        speakSequenceButton.style.cssText += `
            position: relative !important;
            z-index: 1000 !important;
            min-height: 50px !important;
            padding: 18px !important;
        `;
        console.log('📱 Full mobile enhancements applied');
    }
    
    quickButtonsContainer.appendChild(speakSequenceButton);
    console.log('🔵 Get Ready state active - starting 3-second sequence');
    
    setTimeout(() => {
        const fillElement = document.getElementById('getReadyFill');
        if (fillElement && speakSequenceActive) {
            fillElement.style.width = '100%';
        }
    }, 100);
    
   // Play sound on ALL devices, not just desktop
playGetReadyAndSpeakNowSound();
    
    // ===== TRANSITION TO SPEAK NOW (after 3 seconds) =====
    setTimeout(() => {
        if (!speakSequenceButton || !speakSequenceActive || !window.speakSequenceBlocked) {
            console.log('🛑 BULLETPROOF: Sequence interrupted - aborting transition');
            return;
        }
        
        console.log('🟢 Transitioning to Speak Now state');
        
        speakSequenceButton.className = 'quick-btn mobile-wise-banner speak-now-state';
        speakSequenceButton.innerHTML = `
            <div class="sound-waves">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
            </div>
            <span class="green-dot-blink">🟢</span>
            <div>Speak Now!</div>
        `;
        
        console.log('🎤 Starting speech recognition...');
        
        setTimeout(() => {
            if (!speakSequenceActive) return;
            
            console.log('🎤 Starting listening AFTER Speak Now visual...');
            window.lastRecognitionResult = null;
            
            if (isContactInterview) {
                startContactInterviewListening();
            } else {
                if (typeof startMobileListening === 'function') {
                    startMobileListening();
                } else {
                    startNormalInterviewListening();
                }
            }
        }, 200);
        
        // ===== LISTENING TIMEOUT WITH NUCLEAR SHUTDOWN =====
        setTimeout(() => {
            if (!speakSequenceActive) return;
            
            console.log('⏰ 4-second listening window ended - no speech detected');
            
            // ===== 💣 NUCLEAR SHUTDOWN BEFORE AVATAR =====
            console.log('💣 NUCLEAR SHUTDOWN: Completely stopping all speech recognition before avatar');
            
            if (typeof recognition !== 'undefined' && recognition) {
                try {
                    // NUKE ALL HANDLERS FIRST
                    recognition.onresult = null;
                    recognition.onerror = null;
                    recognition.onend = null;
                    recognition.onstart = null;
                    
                    // STOP RECOGNITION
                    recognition.stop();
                    
                    // ABORT IF POSSIBLE
                    if (typeof recognition.abort === 'function') {
                        recognition.abort();
                    }
                    
                    console.log('💣 NUCLEAR: All recognition handlers nuked and stopped');
                } catch (e) {
                    console.log('💣 NUCLEAR: Recognition nuked with errors (expected)');
                }
                
                // WAIT A MOMENT FOR CLEANUP
                setTimeout(() => {
                    console.log('💣 NUCLEAR: Cleanup complete - safe to play avatar');
                    
                    // CLEAR THE BULLETPROOF TIMER - SEQUENCE ENDING NORMALLY
                    window.clearBulletproofTimer();
                    
                    // Clean up banner
                    if (speakSequenceButton) {
                        speakSequenceButton.remove();
                    }
                    
                    // Restore existing buttons
                    existingButtons.forEach(btn => {
                        if (btn.id !== 'speak-sequence-button') {
                            btn.style.display = 'block';
                        }
                    });
                    
                    // BULLETPROOF CLEANUP before avatar
                    bulletproofCleanup();
                    
                   // ===== 🛡️ LEAD CAPTURE PROTECTION: NO AVATAR INTERRUPTION =====
if (window.isInLeadCapture) {  // ← Added "window."
    console.log('🛡️ LEAD CAPTURE ACTIVE: Skipping avatar, restarting Speak Now sequence');
    // Just restart the speak sequence without avatar interruption
    startRealtimeListening();
    return;
}
                    
                    // NOW SAFE TO TRIGGER AVATAR
                    console.log('🎬 Triggering avatar sorry message (after nuclear shutdown)...');
                    if (typeof showAvatarSorryMessage === 'function') {
                        showAvatarSorryMessage();
                    } else {
                        console.log('❌ showAvatarSorryMessage function not found');
                    }
                    
                }, 100); // Brief delay for complete cleanup
            } else {
                // No recognition to clean up
                window.clearBulletproofTimer();
                
                if (speakSequenceButton) {
                    speakSequenceButton.remove();
                }
                
                existingButtons.forEach(btn => {
                    if (btn.id !== 'speak-sequence-button') {
                        btn.style.display = 'block';
                    }
                });
                
                bulletproofCleanup();
                
                // ===== 🛡️ LEAD CAPTURE PROTECTION: NO AVATAR INTERRUPTION =====
                if (isInLeadCapture) {
                    console.log('🛡️ LEAD CAPTURE ACTIVE: Skipping avatar, restarting Speak Now sequence');
                    // Just restart the speak sequence without avatar interruption
                    startRealtimeListening();
                    return;
                }
                
                console.log('🎬 Triggering avatar sorry message (no recognition to clean)...');
                if (typeof showAvatarSorryMessage === 'function') {
                    showAvatarSorryMessage();
                } else {
                    console.log('❌ showAvatarSorryMessage function not found');
                }
            }
            
        }, 7000);
        
    }, 2800);
    
    // ===== SUCCESS HANDLER =====
    window.handleSpeechSuccess = function(transcript) {
        console.log('✅ Speech detected:', transcript);
        
        // CLEAR THE BULLETPROOF TIMER - SUCCESS!
        window.clearBulletproofTimer();
        
        if (speakSequenceButton) {
            speakSequenceButton.remove();
        }
        
        existingButtons.forEach(btn => {
            if (btn.id !== 'speak-sequence-button') {
                btn.style.display = 'block';
            }
        });
        
        bulletproofCleanup();
        
        if (window.innerWidth > 768) {
            playListeningStopsSound();
        }
        
        console.log('🧹 Speech sequence completed successfully');
    };
}

console.log('🎯 NUCLEAR SHUTDOWN Mobile-Wise AI Speak Sequence loaded - Avatar-proof!');

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
        window.speakSequenceBlocked = false;
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
    window.speakSequenceBlocked = false;
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
