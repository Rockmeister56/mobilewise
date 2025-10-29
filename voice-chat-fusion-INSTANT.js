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
                    }, 1500);
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
        switchToTextMode();
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
    }
    
        // Initialize leadData if it doesn't exist
    if (typeof leadData === 'undefined' || !leadData) {
        window.leadData = { firstName: '' };
    }
    
    const greeting = "Hi there! I'm Botimia your personal AI Voice assistant, may I get your first name please?";
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
        switchToTextMode();
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
    
    processUserResponse(message);
}

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

/**
 * ===================================================================
 * 🎯 FIXED processUserResponse() - ASYNC/AWAIT CORRECTED
 * ===================================================================
 * 
 * CHANGES MADE:
 * 1. Added 'async' to function declaration
 * 2. Added 'async' to setTimeout callback
 * 3. Added 'await' to getAIResponse() call
 * 
 * ALL OTHER LOGIC PRESERVED - NO FUNCTIONALITY REMOVED
 * 
 * Fixed: 2025-10-29
 */

async function processUserResponse(userText) {  // ✅ CHANGE #1: Added 'async'
    // ... all your lead capture checks ...
    
    // 🎯 NEW: Direct consultation trigger - NO AI fluff!
    if (shouldTriggerLeadCapture(userText)) {
        console.log('🎯 BYPASSING AI - Direct to lead capture!');
        setTimeout(() => {
            initializeLeadCapture();
        }, 300);
        return; // Exit early!
    }

    // 🚨 CHECK FOR CONCERNS/OBJECTIONS BEFORE AI RESPONSE
    if (detectConcernOrObjection(userText)) {
        handleConcernWithTestimonial(userText);
        return; // Exit - don't proceed to generic AI
    }

    // ✅ DEFAULT AI RESPONSE HANDLER - NOW WITH PROPER ASYNC/AWAIT!
    setTimeout(async () => {  // ✅ CHANGE #2: Added 'async' to callback
        const responseText = await getAIResponse(userText);  // ✅ CHANGE #3: Added 'await'

        console.log('🎯 USER SAID:', userText);
        console.log('🎯 AI RESPONSE:', responseText);
        
        addAIMessage(responseText);
        setAIResponse(responseText);
        speakWithElevenLabs(responseText);
        
        function setAIResponse(response) {
            currentAIResponse = response;
            
            // Track when we mention clicking
            if (response && (response.includes('click') || response.includes('button above'))) {
                window.lastClickMentionTime = Date.now();
                console.log('⏰ Click mention detected - setting blocking window');
            }
        }
    }, 800);
} // ✅ END OF processUserResponse() function


// ✅ SEPARATE HELPER FUNCTION - OUTSIDE processUserResponse()
function shouldTriggerLeadCapture(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // Direct affirmative responses that suggest user wants consultation
    const yesResponses = [
        'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'absolutely', 
        'definitely', 'of course', 'let\'s do it', 'sounds good',
        'i would', 'i\'d like that', 'that sounds great', 'let\'s go',
        'sign me up', 'i\'m interested', 'book it', 'schedule it'
    ];
    
    // Only trigger if it's a clear yes (removed conversationHistory dependency)
    return yesResponses.includes(input);
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
        
        if (VOICE_CONFIG.debug) {
            console.log(`🐛 DEBUG: ElevenLabs blocking conditions check (SMART BUTTON BYPASSED):
                - Time since click mention: ${timeSinceClickMention}ms (block if < 3000ms)
                - Conversation state: ${conversationState} (block if 'speaking')
                - Thank you splash visible: ${!!thankYouSplashVisible}
                - Smart Button Check: PERMANENTLY BYPASSED ✅`);
        }
        
        // Apply exact ElevenLabs blocking logic
        if (timeSinceClickMention < 3000) {
            console.log('🚫 BLOCKED: Recent click mention detected (ElevenLabs logic)');
            return;
        }
        
        if (conversationState === 'speaking') {
            console.log('🚫 BLOCKED: System still in speaking state (ElevenLabs logic)');
            return;
        }
        
        if (thankYouSplashVisible) {
            console.log('🚫 BLOCKED: Thank you splash currently visible (ElevenLabs logic)');
            return;
        }
        
        // Block if conversation ended (keep this check)
        if (conversationState === 'ended' || conversationState === 'splash_screen_active') {
            console.log('🚫 BLOCKED: Conversation ended');
            return;
        }
        
        // *** SMART BUTTON CHECK PERMANENTLY REMOVED ***
        // This was preventing banner triggers in your system
        
        // ============================================================
        // NO BLOCKS - TRIGGER BANNER (EXACT ELEVENLABS BEHAVIOR)
        // ============================================================
        if (VOICE_CONFIG.debug) {
            console.log('🐛 DEBUG: No blocking conditions - calling startRealtimeListening() (Smart Button permanently bypassed)');
        }
        
        setTimeout(() => {
            if (typeof showHybridReadySequence === 'function') {
                try {
                    startRealtimeListening();
                    if (VOICE_CONFIG.debug) {
                        console.log("✅ SUCCESS: Banner sequence triggered successfully (Smart Button permanently bypassed)");
                    }
                } catch (error) {
                    console.error('❌ ERROR: Failed to trigger banner sequence:', error);
                }
            } else if (typeof showPostSorryListening === 'function') {
                try {
                    showPostSorryListening();
                    if (VOICE_CONFIG.debug) {
                        console.log("✅ SUCCESS: Post-Sorry listening triggered (fallback)");
                    }
                } catch (error) {
                    console.error('❌ ERROR: Failed to trigger post-sorry listening:', error);
                }
            } else {
                console.warn("⚠️ WARNING: No banner trigger functions available (showHybridReadySequence, showPostSorryListening)");
            }
        }, 500); // Optimal delay for mobile
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

/**
 * =============================================================================
 * UPDATED CONSULTATIVE RESPONSE DETECTOR
 * =============================================================================
 * Detects user intent to contact and returns appropriate action type
 * Now maps to new consolidated action system
 * =============================================================================
 */

function detectConsultativeResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Urgent/immediate help patterns
    const urgentPatterns = [
        'urgent', 'asap', 'right now', 'immediately', 'emergency',
        'call me now', 'need help now', 'right away'
    ];
    
    // Callback request patterns
    const callbackPatterns = [
        'call me back', 'callback', 'call back', 'phone me',
        'give me a call', 'ring me'
    ];
    
    // Meeting/consultation patterns
    const meetingPatterns = [
        'book a meeting', 'schedule', 'consultation', 'appointment',
        'meet with', 'talk to someone', 'speak with', 'speak to bruce',
        'i\'d rather speak', 'discuss', 'chat with'
    ];
    
    // Pre-qualify patterns
    const prequalifyPatterns = [
        'pre-qualify', 'prequalify', 'am i qualified', 'do i qualify',
        'see if', 'good fit', 'right for me'
    ];
    
    // Free book patterns
    const bookPatterns = [
        'free book', 'send me the book', 'download', 'guide',
        'ebook', 'pdf'
    ];
    
    // Generic contact patterns (show all options)
    const genericContactPatterns = [
        'contact', 'get in touch', 'reach out', 'talk to you',
        'speak to you', 'help me', 'more info', 'tell me more'
    ];
    
    
    // Check patterns in priority order (most specific first)
    
    if (urgentPatterns.some(pattern => message.includes(pattern))) {
        return {
            intent: 'contact_request',
            action: 'urgent',  // Maps to 'immediate-call'
            confidence: 'high',
            bannerMessage: 'Let me connect you right away...'
        };
    }
    
    if (callbackPatterns.some(pattern => message.includes(pattern))) {
        return {
            intent: 'contact_request',
            action: 'requestCall',  // Maps to 'request-callback'
            confidence: 'high',
            bannerMessage: 'I\'ll set up that callback for you...'
        };
    }
    
    if (prequalifyPatterns.some(pattern => message.includes(pattern))) {
        return {
            intent: 'contact_request',
            action: 'preQualify',  // Maps to 'pre-qualify'
            confidence: 'high',
            bannerMessage: 'Let\'s see if we\'re a good fit...'
        };
    }
    
    if (bookPatterns.some(pattern => message.includes(pattern))) {
        return {
            intent: 'contact_request',
            action: 'freeBook',  // Maps to 'free-book'
            confidence: 'high',
            bannerMessage: 'I\'ll get that book to you...'
        };
    }
    
    if (meetingPatterns.some(pattern => message.includes(pattern))) {
        return {
            intent: 'contact_request',
            action: 'bookMeeting',  // Maps to 'free-consultation'
            confidence: 'high',
            bannerMessage: 'Let me schedule that for you...'
        };
    }
    
    if (genericContactPatterns.some(pattern => message.includes(pattern))) {
        return {
            intent: 'contact_request',
            action: 'showAll',  // Shows Communication Action Center with all options
            confidence: 'medium',
            bannerMessage: 'Here are all the ways I can help...'
        };
    }
    
    // No contact intent detected
    return null;
}

/**
 * ===================================================================
 * 🎯 COMPLETE AI RESPONSE HANDLER - WITH PROPER RETURN VALUES
 * ===================================================================
 * 
 * FIXES APPLIED:
 * 1. ✅ Returns response text in ALL branches (fixes "undefined" issue)
 * 2. ✅ Removes Speak Now banner on intent detection
 * 3. ✅ Triggers expertise banner (500ms delay)
 * 4. ✅ Triggers setAppointment banner (3000ms delay)
 * 5. ✅ Attaches click handler to setAppointment banner
 * 6. ✅ Click triggers Communication Action Center
 * 7. ✅ Corrected wording ("on your screen" not "below")
 * 8. ✅ Enhanced error diagnostics
 * 
 * Created: 2025-10-29
 */

async function getAIResponse(userMessage, conversationHistory = []) {
    console.log('🎯 getAIResponse called with:', userMessage);
    
    // Check if we're waiting for name
    if (window.waitingForName) {
        console.log('✅ Name captured:', userMessage);
        window.userName = userMessage;
        window.waitingForName = false;
        
        const response = `Nice to meet you, ${userMessage}! What brings you to New Clients Inc today?`;
        
        speakWithElevenLabs(response, false);
        
        // Mark that we're now waiting for their intent
        window.waitingForIntent = true;
        return response;  // ✅ RETURN THE RESPONSE
    }
    
    // Check if we're waiting for their intent (sell/buy/value/help)
    if (window.waitingForIntent) {
        console.log('🎯 Checking for consultative intent in:', userMessage);
        
        const lowerMessage = userMessage.toLowerCase();
        let detectedIntent = null;
        
        // Detect selling intent
        if (lowerMessage.includes('sell') || lowerMessage.includes('selling')) {
            detectedIntent = 'sell your practice';
            console.log('✅ SELL intent detected');
        }
        // Detect buying intent
        else if (lowerMessage.includes('buy') || lowerMessage.includes('buying') || lowerMessage.includes('purchase')) {
            detectedIntent = 'buy a practice';
            console.log('✅ BUY intent detected');
        }
        // Detect valuation intent
        else if (lowerMessage.includes('value') || lowerMessage.includes('valuation') || lowerMessage.includes('worth')) {
            detectedIntent = 'get your practice valued';
            console.log('✅ VALUE intent detected');
        }
        // Detect general help intent
        else if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support')) {
            detectedIntent = 'with your practice needs';
            console.log('✅ HELP intent detected');
        }
        
        if (detectedIntent) {
            window.waitingForIntent = false;
            window.userIntent = detectedIntent;
            
            // 🔥 FIX #1: REMOVE SPEAK NOW BANNER IMMEDIATELY
            const speakNowBanner = document.querySelector('.speak-now-banner');
            if (speakNowBanner) {
                speakNowBanner.remove();
                console.log('✅ Removed Speak Now banner - consultative flow active');
            }
            
            // Echo their intent back with enthusiasm
            const response = `That's fantastic that you want to ${detectedIntent}, ${window.userName}! I'd love to help you reach your goals by sending you Bruce's free book "7 Secrets to Selling Your Practice" and setting up a consultation. Simply click the Free Book and Consultation banner on your screen!`;
            
            console.log('🎤 Speaking consultative response:', response);
            speakWithElevenLabs(response, false);
            
            // 🎯 Trigger expertise banner (500ms delay)
            setTimeout(() => {
                if (typeof showUniversalBanner === 'function') {
                    showUniversalBanner('expertise');
                    console.log('✅ Expertise banner triggered for ' + detectedIntent);
                } else {
                    console.error('❌ showUniversalBanner function not found for expertise banner');
                }
            }, 500);
            
            // 🎯 Trigger setAppointment banner (3000ms delay - mid-sentence)
            setTimeout(() => {
                console.log('🎯 Attempting to show setAppointment banner...');
                
                if (typeof showUniversalBanner === 'function') {
                    showUniversalBanner('setAppointment');
                    console.log('✅ setAppointment banner triggered!');
                    
                    // 🔥 FIX #4: ATTACH CLICK HANDLER TO BANNER
                    // Wait for banner to fully render in DOM
                    setTimeout(() => {
                        const bannerContainer = document.getElementById('bannerHeaderContainer');
                        
                        if (bannerContainer) {
                            console.log('✅ Found bannerHeaderContainer, attaching click handler...');
                            
                            // Remove any existing click handlers to avoid duplicates
                            const newBannerContainer = bannerContainer.cloneNode(true);
                            bannerContainer.parentNode.replaceChild(newBannerContainer, bannerContainer);
                            
                            // Attach fresh click handler
                            newBannerContainer.addEventListener('click', function(event) {
                                console.log('🎯 setAppointment banner CLICKED!');
                                console.log('Click event:', event);
                                
                                // Trigger Communication Action Center
                                console.log('🎯 Attempting to trigger Communication Action Center...');
                                console.log('Checking prerequisites:', {
                                    functionExists: typeof showCommunicationActionCenter === 'function',
                                    scriptLoaded: !!document.querySelector('script[src*="action-system-unified"]'),
                                    cssLoaded: !!document.querySelector('link[href*="communication-action-center.css"]')
                                });
                                
                                if (typeof showCommunicationActionCenter === 'function') {
                                    try {
                                        showCommunicationActionCenter();
                                        console.log('✅ Communication Action Center triggered successfully!');
                                    } catch (error) {
                                        console.error('❌ Action Center error:', error);
                                        console.error('Error stack:', error.stack);
                                        console.error('Error name:', error.name);
                                        console.error('Error message:', error.message);
                                    }
                                } else {
                                    console.error('❌ showCommunicationActionCenter function not found!');
                                    console.error('Available functions:', Object.keys(window).filter(key => key.toLowerCase().includes('action')));
                                }
                            });
                            
                            console.log('✅ Click handler attached to setAppointment banner!');
                        } else {
                            console.error('❌ Could not find bannerHeaderContainer after 800ms');
                            console.log('Available banner elements:', {
                                bannerHeaderContainer: !!document.getElementById('bannerHeaderContainer'),
                                universalBanner: !!document.getElementById('universal-banner'),
                                bannerByClass: !!document.querySelector('.universal-banner')
                            });
                        }
                    }, 800); // Wait 800ms for banner to fully render
                    
                } else {
                    console.error('❌ showUniversalBanner function not found for setAppointment banner');
                }
            }, 3000);
            
            // Mark that we're waiting for book response (yes/no)
            window.waitingForBookResponse = true;
            return response;  // ✅ RETURN THE RESPONSE
        }
        
        // If no intent detected, continue to OpenAI
        console.log('⚠️ No consultative intent detected, continuing to OpenAI...');
    }
    
    // Check if we're waiting for book response (yes/no)
    if (window.waitingForBookResponse) {
        console.log('📚 Checking book response:', userMessage);
        
        const lowerMessage = userMessage.toLowerCase();
        
        // Handle YES response
        if (lowerMessage.includes('yes') || lowerMessage.includes('yeah') || 
            lowerMessage.includes('sure') || lowerMessage.includes('okay') || 
            lowerMessage.includes('ok') || lowerMessage.includes('absolutely')) {
            
            console.log('✅ User said YES to book offer');
            window.waitingForBookResponse = false;
            
            const response = `Perfect! I've got that ready for you. Just click the banner to choose how you'd like to proceed!`;
            
            speakWithElevenLabs(response, false);
            
            return response;  // ✅ RETURN THE RESPONSE
        }
        
        // Handle NO response
        if (lowerMessage.includes('no') || lowerMessage.includes('nah') || 
            lowerMessage.includes('not now') || lowerMessage.includes('maybe later')) {
            
            console.log('❌ User declined book offer, continuing with questions');
            window.waitingForBookResponse = false;
            
            const response = `No problem! Let me ask you a few questions to better understand your needs. What type of practice do you have?`;
            
            speakWithElevenLabs(response, false);
            
            return response;  // ✅ RETURN THE RESPONSE
        }
        
        // If ambiguous, ask for clarification
        console.log('⚠️ Ambiguous book response, asking for clarification');
        
        const response = `I'm not sure I caught that. Would you like me to send you Bruce's free book and set up a consultation?`;
        
        speakWithElevenLabs(response, false);
        
        return response;  // ✅ RETURN THE RESPONSE
    }
    
    // Continue with regular OpenAI conversation
    try {
        conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: window.AI_SYSTEM_PROMPT || 'You are a helpful assistant for New Clients Inc, specializing in practice sales and acquisitions.'
                    },
                    ...conversationHistory
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });

        console.log('✅ OpenAI Response:', aiResponse);
        
        // Speak the response
        speakWithElevenLabs(aiResponse, false);
        
        return aiResponse;  // ✅ RETURN THE RESPONSE

    } catch (error) {
        console.error('❌ Error in getAIResponse:', error);
        
        const errorResponse = "I apologize, I'm having trouble processing that right now. Could you try again?";
        
        speakWithElevenLabs(errorResponse, false);
        
        return errorResponse;  // ✅ RETURN THE ERROR RESPONSE
    }
}

console.log('✅ getAIResponse function with proper returns loaded');


function handleTestimonialComplete() {
    console.log('🎯 Testimonial finished - triggering comeback');
    
    const firstName = leadData.firstName || '';
    const comebackText = firstName ?
        `${firstName}, if we could get results like this for you, would you be interested in a FREE consultation with Bruce?` :
        "If we could get results like this for you, would you be interested in a FREE consultation?";
    
    // Speak the comeback
    speakText(comebackText);
    
    // 🎨 BANNER: Show free incentive
    // 🔘 BUTTONS: Switch to CTA mode (green)
    setTimeout(() => {
        triggerBanner('setAppointment');
    }, 2000);
    
    // Change state
    conversationState = 'post_testimonial_consultation_offer';
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
// 🎤 HYBRID SPEAK NOW SYSTEM - MOBILE-WISE AI
// ===================================================

function showSpeakNow() {
    // Use new hybrid system instead of old button
    startRealtimeListening();
}

function hideSpeakNow() {
    // Hide transcript display
    const liveTranscript = document.getElementById('liveTranscript');
    const transcriptText = document.getElementById('transcriptText');
    
    if (liveTranscript) {
        liveTranscript.style.display = 'none';
        restoreQuickButtons(); // Show quick buttons again
    }
    if (transcriptText) {
        transcriptText.style.display = 'none';
    }
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
        if (leadData.subStep === 'ask') {
            const question = leadData.questions[leadData.step];
            addAIMessage(question);
            speakMessage(question);
            
        } else if (leadData.subStep === 'confirm') {
            const confirmPrompt = leadData.confirmationPrompts[leadData.step]
                .replace('{answer}', leadData.tempAnswer);
            
            addAIMessage(confirmPrompt);
            speakMessage(confirmPrompt);
        }
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
    
    // ❌ FALLBACK: Your exact current code (unchanged)
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.13;
        utterance.pitch = 1.05;
        utterance.volume = 0.85;
        
        utterance.onstart = function() {
            isSpeaking = true;
            console.log('🔊 AI started speaking - hiding Speak Now');
            const liveTranscript = document.getElementById('liveTranscript');
            if (liveTranscript) {
                liveTranscript.style.display = 'none';
                restoreQuickButtons(); // Show quick buttons again
            }
        };

        utterance.onend = function() {
            isSpeaking = false;
            console.log('🔊 AI finished speaking for lead capture');
            
            if (isInLeadCapture) {
                setTimeout(() => {
                    if (typeof showHybridReadySequence === 'function') {
                        startRealtimeListening();
                    }
                }, 1300);
            }
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
// 🎬 CINEMATIC THANK YOU SPLASH SCREEN WITH EXIT BUTTON
// ===================================================
function showThankYouSplashScreen() {
    console.log('🎬 Deploying cinematic thank you splash screen with exit button...');
    
    // ✅ NUCLEAR OPTION - KILL ALL SPEECH SYSTEMS
    if (window.speechRecognition) {
        try {
            window.speechRecognition.stop();
            window.speechRecognition.abort();
            window.speechRecognition = null;
        } catch (e) {
            console.log('Speech recognition cleanup:', e);
        }
    }
    
    // ✅ STOP ALL LISTENING FLAGS
    window.isListening = false;
    window.isRecording = false;
    
    // ✅ CLEAR ALL TIMEOUTS
    if (window.speechTimeout) clearTimeout(window.speechTimeout);
    if (window.restartTimeout) clearTimeout(window.restartTimeout);
    
    // ✅ SET FINAL STATE
    conversationState = 'splash_screen_active';
    
    const splashOverlay = document.createElement('div');
    splashOverlay.id = 'thankYouSplash';
    splashOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #4a90e2 50%, #2a5298 75%, #1e3c72 100%);
        z-index: 99999; display: flex; align-items: center; justify-content: center;
        animation: fadeInSplash 0.8s ease-in;
        box-shadow: inset 0 0 100px rgba(74, 144, 226, 0.3);
    `;
    
    splashOverlay.innerHTML = `
        <div style="text-align: center; color: white; animation: slideInContent 1s ease-out 0.3s both; position: relative;">
            <div style="margin-bottom: 30px;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758507868460_logo.png" 
                     style="width: 80px; height: 80px; filter: drop-shadow(0 0 20px rgba(255,255,255,0.3));">
            </div>
            <div style="font-size: 48px; margin-bottom: 20px; text-shadow: 0 0 30px rgba(255,255,255,0.5);">🙏</div>
            <h1 style="font-size: 42px; margin-bottom: 15px; font-weight: 300; letter-spacing: 2px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">Thank You for Visiting!</h1>
            <p style="font-size: 20px; opacity: 0.9; margin-bottom: 10px; font-weight: 300;">We appreciate your time and interest.</p>
            <p style="font-size: 18px; margin-top: 20px; opacity: 0.8; font-weight: 300;">Have a wonderful day!</p>
            <div style="margin-top: 40px; font-size: 16px; opacity: 0.7; letter-spacing: 1px;">Mobile-Wise AI</div>
            
            <!-- BIG EXIT BUTTON -->
            <button onclick="exitApplication()" style="
                position: absolute;
                bottom: -80px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #ff4757, #ff3742);
                color: white;
                border: none;
                padding: 18px 40px;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
                transition: all 0.3s ease;
                min-width: 140px;
                animation: slideInButton 1s ease-out 1s both;
            " onmouseover="this.style.transform='translateX(-50%) scale(1.05)'; this.style.boxShadow='0 12px 35px rgba(255, 71, 87, 0.6)'" 
               onmouseout="this.style.transform='translateX(-50%) scale(1)'; this.style.boxShadow='0 8px 25px rgba(255, 71, 87, 0.4)'">
                🚪 EXIT
            </button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInSplash { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideInContent { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInButton { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(splashOverlay);
    
    // ✅ PLAY OUTRO AUDIO
    setTimeout(() => {
        const audio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1758148837523.mp3');
        audio.volume = 0.8;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }, 500);
    
    // ✅ AUTO-DISMISS AFTER 20 SECONDS (instead of 8)
    setTimeout(() => {
        if (document.getElementById('thankYouSplash')) {
            exitApplication();
        }
    }, 20000);
}

// ===================================================
// 🚪 EXIT APPLICATION FUNCTION
// ===================================================
function exitApplication() {
    console.log('🚪 Exiting application...');
    
    const splash = document.getElementById('thankYouSplash');
    if (splash) {
        splash.style.animation = 'fadeInSplash 0.5s ease-out reverse';
        setTimeout(() => {
            splash.remove();
            // Close the window/tab or redirect back to original site
            if (window.opener) {
                window.close(); // If opened in popup
            } else {
                window.history.back(); // Go back to previous page
            }
        }, 500);
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
        
     //showSpeakNow();
   
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
function showDirectSpeakNow() {
    console.log('🎯 DIRECT Speak Now - skipping Get Ready phase completely');
    
    // Quick safety check
    if (window.speakSequenceBlocked) {
        console.log('🔇 DIRECT: Another session running - clearing first');
        window.speakSequenceBlocked = false;
        speakSequenceActive = false;
    }
    
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
    }, 15000);
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
    setTimeout(() => {
        if (!speakSequenceActive) return;
        
        console.log('⏰ DIRECT: 4-second listening window ended - no speech detected');
        
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
        
        console.log('🎬 DIRECT: Triggering avatar after timeout');
        if (typeof showAvatarSorryMessage === 'function') {
            showAvatarSorryMessage();
        }
        
    }, 7000);
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
                    if (isInLeadCapture) {
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
    console.log('✅ Instant bubble CSS injected');
})();
