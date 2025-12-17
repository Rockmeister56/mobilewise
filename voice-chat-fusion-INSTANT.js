// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATION
// Smart Button + Lead Capture + EmailJS + Banner System
// ===================================================

// ===================================================
// 📱 MOBILE PERMISSION BRIDGE SYSTEM - FIXED VERSION
// ===================================================

console.log('=== BRIDGE SYSTEM STARTING ===');

// Check parameters
const urlParams = new URLSearchParams(window.location.search);
const shouldAutoStart = urlParams.get('autoStartVoice') === 'true';
const hasPermission = urlParams.get('micPermissionGranted') === 'true';
const hasGesture = urlParams.get('gestureInitiated') === 'true';

console.log('Bridge Parameters:', { shouldAutoStart, hasPermission, hasGesture });

// 🆕 CRITICAL FIX: Clear Bridge flags if no parameters
if (!shouldAutoStart && window.externalPreGrantedPermission) {
    console.log('🔄 Clearing stale Bridge flags (no URL parameters)');
    window.externalPreGrantedPermission = false;
    window.bridgeShouldAutoStart = false;
    // Don't clear micPermissionGranted - user might have granted it
}

if (shouldAutoStart && hasPermission && hasGesture) {
    console.log('🚀🚀🚀 BRIDGE: AUTO-START CONDITIONS MET! 🚀🚀🚀');
    
    // Set flag IMMEDIATELY
    window.externalPreGrantedPermission = true;
    window.bridgeShouldAutoStart = true;
    window.micPermissionGranted = true;
    window.isAudioMode = true;
    
    console.log('✅ Bridge flags set');
    
    // Wait for DOM and then trigger activation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bridgeAutoStart);
    } else {
        bridgeAutoStart();
    }
    
    function bridgeAutoStart() {
        console.log('🎯 Bridge: Triggering activateMicrophone');
        
        // Hide initial UI
        const centerMic = document.getElementById('centerMicActivation');
        if (centerMic) centerMic.style.display = 'none';
        
        // Set conversation state
        window.conversationState = 'getting_first_name';
        window.waitingForName = true;
        
        // Initialize lead data
        if (typeof leadData === 'undefined' || !leadData) {
            window.leadData = { firstName: '' };
        }
        
        console.log('⏩ Bridge: Using activateMicrophone for introduction');
        
        // Call activateMicrophone after a delay
        setTimeout(() => {
            if (typeof activateMicrophone === 'function') {
                activateMicrophone();
            } else {
                console.error('❌ activateMicrophone function not found!');
            }
        }, 1000);
    }
    
} else {
    console.log('🔗 Bridge: Normal mode (no auto-start)');
}

console.log('=== BRIDGE SYSTEM COMPLETE ===');

// ===========================================
// ELEVENLABS CONFIGURATION
// ===========================================
const ELEVENLABS_API_KEY = 'sk_145cc0fe5aeb1c2ae4ebf3193dcee721ae8a4f755ed9e5d8';
const VOICE_ID = 'WZlYpi1yf6zJhNWXih74';

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
let microphonePermissionGranted = false;
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

// 🔊 Missing function from earlier error
function playReadyBeep() {
    console.log('🔊 Ready beep (placeholder)');
    return Promise.resolve();
}

// 🎨 UI functions that might be called
function hideVoiceOverlay() {
    console.log('🎨 Hiding voice overlay');
    // Your actual overlay hiding code
}

function updateVoiceTranscription(text) {
    console.log('📝 Updating transcription:', text);
    // Your actual transcription update code
}

// ===================================================
// 🚀 GLOBAL SPEECH ENGINE SETUP
// ===================================================
let recognitionPreWarmed = false;
let preWarmAttempted = false; // 🆕 Track if we've tried already

// 🔥 PRE-WARM ENGINE (OPTIMIZED - SAFE & SILENT)
function preWarmSpeechEngine() {
    // 🛡️ SAFETY CHECK 1: Don't re-run if already attempted
    if (preWarmAttempted) {
        console.log('🔄 Pre-warm already attempted, skipping');
        return;
    }
    preWarmAttempted = true;
    
    // 🛡️ SAFETY CHECK 2: Skip if browser doesn't support speech
    if (!checkSpeechSupport()) {
        console.log('❌ Speech not supported, skipping pre-warm');
        return;
    }
    
    console.log('🔥 Pre-warming speech engine (silent mode)...');
    
    try {
        // 🎯 STEP 1: Create instance ONLY if it doesn't exist
        if (!recognition) {
            console.log('🆕 Creating new recognition instance');
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            
            // 🚫 CRITICAL: Set properties BEFORE any event handlers
            recognition.continuous = false;
            recognition.interimResults = false; // 🆕 FALSE for pre-warm (silent)
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;
            
            // 🚫 CRITICAL: Disable ALL audio/event feedback
            recognition.onsoundstart = function() {
                console.log('🔇 Pre-warm: Sound start silenced');
            };
            recognition.onaudiostart = function() {
                console.log('🔇 Pre-warm: Audio start silenced');
            };
            recognition.onstart = function() {
                console.log('🔇 Pre-warm: Engine start silenced');
            };
            recognition.onend = null;
            recognition.onerror = null;
            recognition.onresult = null;
            
            console.log('✅ Recognition instance created (silent config)');
        } else {
            console.log('📦 Using existing recognition instance');
        }
        
        recognitionPreWarmed = true;
        console.log('🎯 Speech engine pre-warmed successfully');
        
        // 🆕 OPTIONAL: Verify it works with a silent test
        if (recognition && typeof recognition.start === 'function') {
            console.log('🧪 Silent test: Engine API is accessible');
        }
        
    } catch (error) {
        console.log('⚠️ Pre-warm failed (non-critical):', error.message);
        // Don't throw - this is just optimization
    }
}

// ===================================================
// 🎯 STRATEGIC PRE-WARM TRIGGERS
// ===================================================

// Trigger 1: On first user interaction (anywhere)
document.addEventListener('click', function firstClickPreWarm() {
    if (!preWarmAttempted) {
        console.log('👆 First click detected - pre-warming engine');
        setTimeout(preWarmSpeechEngine, 100); // Small delay
    }
    document.removeEventListener('click', firstClickPreWarm);
}, { once: true });

// Trigger 2: When audio button is clicked
const enableAudioBtn = document.getElementById('enableAudioBtn');
if (enableAudioBtn) {
    enableAudioBtn.addEventListener('click', function() {
        if (!preWarmAttempted) {
            console.log('🎵 Audio button clicked - pre-warming engine');
            preWarmSpeechEngine();
        }
    });
}

// Trigger 3: When page becomes visible (tab switch)
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && !preWarmAttempted) {
        console.log('👀 Page visible - pre-warming engine');
        setTimeout(preWarmSpeechEngine, 500);
    }
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
})(); // <-- THIS CLOSES THE IIFE (Immediately Invoked Function Expression)

// 🆕 EXPORT FUNCTIONS FOR ACTION SYSTEM INTEGRATION
// These allow the action-system-unified-FINAL.js to integrate with voice chat

// Export addAIMessage
if (typeof addAIMessage === 'function') {
    window.addAIMessage = addAIMessage;
}

// Export speakText/speakResponse (use whichever function name you have)
if (typeof speakResponse === 'function') {
    window.speakText = speakResponse;
} else if (typeof speakMessage === 'function') {
    window.speakText = speakMessage;
}

// Export listening restart function
if (typeof startRealtimeListening === 'function') {
    window.startRealtimeListening = startRealtimeListening;
}

// Export banner system (if available)
if (typeof showUniversalBanner === 'function') {
    window.showUniversalBanner = showUniversalBanner;
}

console.log('✅ Voice chat functions exported for Action System integration');

// ===================================================
// 🎤 COMPLETE START LISTENING FUNCTION (FIXED)
// ===================================================

let recognitionHandlersSet = false;

async function startListening() {
    console.log('🎤 startListening() called');
    
    // 1. CHECK PERMISSION FIRST
    if (!await ensureMicrophonePermission()) {
        console.log('❌ Cannot start - microphone permission denied');
        return;
    }
    
    // 2. CHECK SPEECH SUPPORT
    if (!checkSpeechSupport()) {
        console.log('❌ Speech recognition not supported');
        return;
    }
    
    // 3. CHECK STATE CONFLICTS
    if (isListening) {
        console.log('🔄 Already listening - skipping');
        return;
    }
    
    if (isSpeaking) {
        console.log('🔇 AI is speaking - cannot listen now');
        return;
    }
    
    // Smart button gate-keeper (from original - important!)
    const smartButton = document.getElementById('smartButton');
    if (smartButton && smartButton.style.display !== 'none') {
        console.log('🚫 Smart button active - BLOCKING startListening()');
        return;
    }
    
    // 4. INITIALIZE RECOGNITION ENGINE
    if (!recognition) {
        console.log('🔄 Initializing speech recognition...');
        if (!initializeSpeechRecognition()) {
            console.log('❌ Failed to initialize speech recognition');
            return;
        }
    }
    
    // 5. SET HANDLERS (ONLY ONCE)
    if (!recognitionHandlersSet) {
        console.log('✅ Setting up recognition handlers...');
        setupRecognitionHandlers();
        recognitionHandlersSet = true;
    }
    
    // 6. START LISTENING
    try {
        console.log('🎤 Starting speech recognition...');
        recognition.start();
        isListening = true;
        window.isCurrentlyListening = true;
        console.log('✅ Listening started successfully');
    } catch (error) {
        console.error('❌ Error starting recognition:', error);
        isListening = false;
        window.isCurrentlyListening = false;
        
        // Handle specific errors
        if (error.name === 'NotAllowedError') {
            console.log('🔒 Microphone permission denied');
            addAIMessage("Please allow microphone access to use voice chat.");
        } else if (error.name === 'NotFoundError') {
            console.log('🎤 No microphone found');
            addAIMessage("No microphone detected. Please check your audio device.");
        } else if (error.name === 'InvalidStateError') {
            console.log('🔄 Recognition in invalid state - will retry');
            setTimeout(() => {
                startListening();
            }, 1000);
        }
    }
}

// ===================================================
// 🔧 UPDATED SUPPORT FUNCTIONS (WITH CRITICAL FEATURES)
// ===================================================

async function ensureMicrophonePermission() {
    console.log('🔍 Checking microphone permission...');
    
    // Check if permission already granted via Bridge
    if (window.externalPreGrantedPermission) {
        console.log('✅ Permission already granted via Bridge System');
        window.micPermissionGranted = true;
        return true;
    }
    
    // Check if permission already granted normally
    if (window.micPermissionGranted) {
        console.log('✅ Permission already granted');
        return true;
    }
    
    // 🆕 ADD THIS: Check if permission is already granted by browser
    try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        console.log('🔍 Current browser permission state:', permissionStatus.state);
        
        if (permissionStatus.state === 'granted') {
            console.log('✅ Browser already has microphone permission');
            window.micPermissionGranted = true;
            return true;
        }
    } catch (error) {
        console.log('🔍 Cannot query permission state:', error.message);
        // Continue to request permission
    }
    
    // Request permission (only if not already granted)
    console.log('🎤 Requesting microphone access...');
    try {
        if (typeof requestMicrophoneAccess === 'function') {
            const granted = await requestMicrophoneAccess();
            if (granted) {
                window.micPermissionGranted = true;
                return true;
            }
        } else {
            // Fallback: Direct getUserMedia call
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            stream.getTracks().forEach(track => track.stop());
            window.micPermissionGranted = true;
            return true;
        }
    } catch (error) {
        console.error('❌ Permission request failed:', error);
        return false;
    }
    
    return false;
}

function setupRecognitionHandlers() {
    if (!recognition) {
        console.error('❌ Cannot setup handlers - recognition not initialized');
        return;
    }
    
    // ONRESULT: Handle speech transcription (COMPLETE VERSION)
    recognition.onresult = function(event) {
        console.log('🎯 ONRESULT FIRED');
        console.log('  - Results count:', event.results.length);
        console.log('  - Result index:', event.resultIndex);

        // Extract transcript
        let transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
            .replace(/\.+$/, '');
        
        console.log('✅ Transcript captured:', transcript);
        
        // 🆕 CRITICAL: Update banner text
        const transcriptText = document.getElementById('transcriptText');
        if (transcriptText) {
            transcriptText.textContent = transcript || 'Speak Now';
        }
        
        // 🆕 CRITICAL: Update voice transcription
        if (window.updateVoiceTranscription) {
            window.updateVoiceTranscription(transcript);
            console.log('🧪 Called updateVoiceTranscription with:', transcript);
        }
        
        console.log('  - Length:', transcript.length);
        console.log('  - Is final:', event.results[event.results.length - 1]?.isFinal);
        
        // Update input field
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.value = transcript;
            console.log('✅ Updated userInput field:', userInput.value);
            
            // Store for backup
            window.lastCapturedTranscript = transcript;
            window.lastCapturedTime = Date.now();
            console.log('✅ Stored in window.lastCapturedTranscript');
        } else {
            console.error('❌ userInput field NOT FOUND!');
        }
        
        // 🆕 CRITICAL: Cancel timeouts when speech is detected
        if (transcript.trim().length > 0 && window.directSpeakNowTimeout) {
            console.log('🎯 Speech detected - CANCELLING directSpeakNow timeout');
            clearTimeout(window.directSpeakNowTimeout);
            window.directSpeakNowTimeout = null;
        }
        
        if (transcript.trim().length > 0 && window.speakNowTimeout) {
            console.log('🎯 Speech detected - cancelling nuclear timeout');
            clearTimeout(window.speakNowTimeout);
            window.speakNowTimeout = null;
        }
        
        // 🆕 CRITICAL: Lead capture auto-send (from original)
        if (isInLeadCapture) {
            clearTimeout(window.leadCaptureTimeout);
            window.leadCaptureTimeout = setTimeout(() => {
                if (transcript.trim().length > 1 && userInput && userInput.value === transcript) {
                    console.log('🎯 Lead capture auto-send:', transcript);
                    sendMessage();
                }
            }, 5000);
        }
    };
    
    // ONEND: Handle recognition end (COMPLETE VERSION)
    recognition.onend = function() {
        console.log('🔚 Recognition ended');
        isListening = false;
        window.isCurrentlyListening = false;
        
        // Hide overlay if available
        if (window.hideVoiceOverlay) {
            window.hideVoiceOverlay();
        }
        
        // Get final transcript from multiple sources
        let finalTranscript = '';
        const userInput = document.getElementById('userInput');
        
        // Source 1: Input field
        if (userInput && userInput.value.trim().length > 0) {
            finalTranscript = userInput.value.trim();
            console.log('🔍 SOURCE (input field):', finalTranscript);
        }
        
        // Source 2: Global backup
        if (!finalTranscript && window.lastCapturedTranscript) {
            finalTranscript = window.lastCapturedTranscript;
            console.log('🔍 SOURCE (global backup):', finalTranscript);
        }
        
        console.log('📄 FINAL transcript:', finalTranscript);
        
        if (finalTranscript && finalTranscript.trim().length > 0) {
            const currentMessage = finalTranscript.trim();
            const now = Date.now();
            const timeSinceLastMessage = now - (window.lastMessageTime || 0);
            
            if (!window.lastProcessedMessage || 
                window.lastProcessedMessage !== currentMessage || 
                timeSinceLastMessage > 3000) {
                
                console.log('✅ Sending message:', currentMessage);
                
                // 🆕 CRITICAL: Call processUserResponse
                if (typeof processUserResponse === 'function') {
                    processUserResponse(finalTranscript);
                }
                
                // Cancel timeouts
                if (window.speakNowTimeout) {
                    clearTimeout(window.speakNowTimeout);
                    window.speakNowTimeout = null;
                }
                
                // Stop any TTS
                if (window.speechSynthesis && window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                }
                
                // Close banners
                if (typeof speakSequenceActive !== 'undefined' && speakSequenceActive) {
                    console.log('🎯 Closing Speak Now banner');
                    window.playingSorryMessage = false;
                    
                    if (typeof cleanupSpeakSequence === 'function') {
                        cleanupSpeakSequence();
                    }
                }
                
                // 🆕 CRITICAL: Send the message
                window.lastMessageTime = now;
                window.lastProcessedMessage = currentMessage;
                
                if (typeof sendMessage === 'function') {
                    sendMessage(currentMessage);
                }
            }
        } else {
            console.log('🔄 No speech detected');
            
            // Show try again overlay
            if (!isSpeaking && typeof showAvatarSorryMessage === 'function') {
                setTimeout(() => {
                    showAvatarSorryMessage();
                }, 2000);
            }
        }
    };
    
    // ONERROR: Handle errors (COMPLETE VERSION)
    recognition.onerror = function(event) {
        console.error('🔊 Recognition error:', event.error);
        isListening = false;
        window.isCurrentlyListening = false;
        
        // Cancel timers
        if (window.speakSequenceCleanupTimer) {
            clearTimeout(window.speakSequenceCleanupTimer);
            window.speakSequenceCleanupTimer = null;
        }
        
        // Use error handler if available
        if (typeof handleSpeechRecognitionError === 'function') {
            handleSpeechRecognitionError(event.error);
            return;
        }
        
        // Default error handling
        switch (event.error) {
            case 'no-speech':
                console.log('🔇 No speech detected');
                // Mobile visual feedback
                if (window.innerWidth <= 768) {
                    const transcriptText = document.getElementById('transcriptText');
                    if (transcriptText) {
                        transcriptText.textContent = "I didn't hear anything...";
                        transcriptText.style.color = '#ff6b6b';
                        
                        setTimeout(() => {
                            transcriptText.textContent = 'Please speak now';
                            transcriptText.style.color = '#ffffff';
                        }, 1500);
                    }
                }
                break;
                
            case 'audio-capture':
                console.log('🎤 No microphone detected');
                addAIMessage("I can't detect your microphone. Please check your audio settings.");
                break;
                
            case 'not-allowed':
                console.log('🔒 Permission denied');
                addAIMessage("Microphone permission was denied. Please allow microphone access to continue.");
                window.micPermissionGranted = false;
                window.externalPreGrantedPermission = false;
                break;
                
            default:
                console.log('⚠️ Unknown error:', event.error);
                addAIMessage("There was an error with voice recognition. Please try again.");
        }
    };
}

// ===================================================
// 🎤 FORCE START LISTENING - CLEAN VERSION
// ===================================================

async function forceStartListening() {
    console.log('🎤 Force starting listening...');
    
    // 1. CHECK IF ALREADY STARTED
    if (recognition && recognition.state === 'started') {
        console.log('🔄 Recognition already started - stopping first');
        
        try {
            recognition.stop();
            isListening = false;
            window.isCurrentlyListening = false;
            
            // Wait for stop to complete, then restart
            setTimeout(async () => {
                console.log('🔄 Restarting after stop...');
                await startListening();
            }, 500);
            
        } catch (stopError) {
            console.error('❌ Error stopping recognition:', stopError);
            // Try to start fresh
            await startListening();
        }
        
        return;
    }
    
    // 2. CHECK IF RECOGNITION EXISTS
    if (!recognition) {
        console.log('🔄 No recognition instance - creating new one');
        if (!initializeSpeechRecognition()) {
            console.log('❌ Failed to initialize recognition');
            return;
        }
    }
    
    // 3. CHECK PERMISSION
    if (!window.micPermissionGranted && !window.externalPreGrantedPermission) {
        console.log('🎤 No permission - requesting...');
        const granted = await ensureMicrophonePermission();
        if (!granted) {
            console.log('❌ Permission denied - cannot force start');
            return;
        }
    }
    
    // 4. FORCE START
    try {
        console.log('🎤 Force starting recognition...');
        recognition.start();
        isListening = true;
        window.isCurrentlyListening = true;
        console.log('✅ Force start successful');
    } catch (error) {
        console.error('❌ Force start failed:', error);
        
        // Handle specific errors
        if (error.name === 'InvalidStateError') {
            console.log('🔄 Invalid state - recognition may be in wrong state');
            // Try resetting and starting fresh
            recognition = null;
            setTimeout(() => {
                startListening();
            }, 1000);
        } else if (error.name === 'NotAllowedError') {
            console.log('🔒 Permission error - resetting permission flag');
            window.micPermissionGranted = false;
            window.externalPreGrantedPermission = false;
        }
    }
}

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
    console.log('🎤 Requesting microphone access...');
    
    // 1. Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('❌ getUserMedia not supported');
        showPermissionError('getUserMedia is not supported in this browser');
        return false;
    }
    
    // 2. Request permission
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        
        console.log('✅ Microphone access granted');
        
        // 3. Clean up stream (we just needed permission)
        const tracks = stream.getTracks();
        tracks.forEach(track => {
            track.stop();
            stream.removeTrack(track);
        });
        
        // 4. Set global flag
        window.micPermissionGranted = true;
        
        // 5. Show success
        showMicActivatedStatus();
        
        return true;
        
    } catch (error) {
        console.error('❌ Microphone access denied:', error);
        
        // Handle specific errors
        let errorMessage = 'Microphone access was denied.';
        if (error.name === 'NotAllowedError') {
            errorMessage = 'Microphone permission was denied. Please allow access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
            errorMessage = 'No microphone found. Please check your audio device.';
        }
        
        showPermissionError(errorMessage);
        return false;
    }
}

// Helper function for error display
function showPermissionError(message) {
    console.error('🔒 Permission error:', message);
    
    // Try to show in permissionStatus element if it exists
    const permissionStatus = document.getElementById('permissionStatus');
    if (permissionStatus) {
        permissionStatus.innerHTML = `<div class="permission-deny">${message}</div>`;
    }
    
    // Also show in chat if possible
    if (typeof addAIMessage === 'function') {
        addAIMessage(message);
    }
}

function showMicActivatedStatus() {
    console.log('🎤 Microphone activated');
    
    // Update UI if elements exist
    const micStatus = document.getElementById('micStatus');
    if (micStatus) {
        micStatus.style.display = 'block';
        setTimeout(() => {
            micStatus.style.display = 'none';
        }, 3000);
    }
    
    // Update mic button if it exists
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.classList.add('listening');
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
    console.log('🔄 Initializing speech recognition...');
    
    if (!checkSpeechSupport()) {
        return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Basic configuration
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    console.log('✅ Speech recognition initialized');
    return true;
}

function configureMobileSpeech() {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (!isMobile) return;
    
    const rec = window.recognition || recognition;
    if (!rec) {
        console.warn('⚠️ Cannot configure mobile speech: recognition not available');
        return;
    }
    
    console.log('📱 Applying mobile speech optimization...');
    
    // MOBILE SETTINGS
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 5;
    
    console.log('   ⚙️ Settings: continuous=true, interimResults=true, maxAlternatives=5');
    
    // LONGER TIMEOUT FOR MOBILE
    if (window.directSpeakNowTimeout) {
        clearTimeout(window.directSpeakNowTimeout);
    }
    window.directSpeakNowTimeout = setTimeout(() => {
        if (rec && rec.stop) {
            console.log('📱 Mobile timeout (15s) - stopping');
            rec.stop();
        }
    }, 15000);
    
    console.log('   ⏱️ Timeout: 15 seconds (mobile extended)');
    
    // SAVE ORIGINAL HANDLERS
    const originalOnResult = rec.onresult;
    const originalOnError = rec.onerror;
    
    // MOBILE RESULT HANDLER
    rec.onresult = function(event) {
        console.log('📱 MOBILE SPEECH DETECTED');
        
        // Call original handler first
        if (originalOnResult && typeof originalOnResult === 'function') {
            try {
                originalOnResult.call(this, event);
            } catch (e) {
                console.log('⚠️ Original handler error:', e.message);
            }
        }
        
        if (!event.results || event.results.length === 0) {
            console.log('📱 No mobile results');
            return;
        }
        
        // Process results
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i] && event.results[i][0]) {
                const result = event.results[i][0];
                
                if (event.results[i].isFinal) {
                    finalTranscript += result.transcript + ' ';
                    console.log(`📱 Final: "${result.transcript}"`);
                } else {
                    interimTranscript += result.transcript + ' ';
                    console.log(`📱 Interim: "${result.transcript}"`);
                }
            }
        }
        
        // Store final transcript
        if (finalTranscript.trim().length > 0) {
            console.log('📱 FINAL:', finalTranscript.trim());
            window.lastCapturedTranscript = finalTranscript.trim();
            window.lastCapturedTime = Date.now();
            
            // Check for cutoff
            const wordCount = finalTranscript.trim().split(/\s+/).length;
            console.log(`   📊 Word count: ${wordCount}`);
        }
        
        // Log interim
        if (interimTranscript.trim().length > 0 && !finalTranscript) {
            console.log('📱 Still listening:', interimTranscript.trim());
        }
        
        // Auto-extend timeout
        if ((finalTranscript || interimTranscript) && window.directSpeakNowTimeout) {
            console.log('🔄 Speech detected - extending timeout...');
            clearTimeout(window.directSpeakNowTimeout);
            window.directSpeakNowTimeout = setTimeout(() => {
                if (rec && rec.stop) {
                    console.log('📱 Extended timeout reached - stopping');
                    rec.stop();
                }
            }, 5000);
        }
    };
    
    // MOBILE ERROR HANDLER
    rec.onerror = function(event) {
        console.log('📱 MOBILE ERROR:', event.error);
        
        if (event.error === 'no-speech') {
            console.log('💡 Mobile: No speech detected');
            console.log('   - Try speaking louder');
            console.log('   - Ensure microphone is not blocked');
        }
        
        if (originalOnError && typeof originalOnError === 'function') {
            originalOnError.call(this, event);
        }
    };
    
    console.log('✅ Mobile speech optimized');
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
    let activateCallCount = 0;
const originalActivateMicrophone = window.activateMicrophone;

window.activateMicrophone = function(...args) {
    activateCallCount++;
    console.log(`🎤 activateMicrophone() called #${activateCallCount} at ${Date.now()}`);
    console.trace('Stack trace for activateMicrophone');
    
    if (activateCallCount > 1) {
        console.log('🚨 DUPLICATE CALL DETECTED! Blocking...');
        return Promise.resolve(true);
    }
    
    return originalActivateMicrophone.apply(this, args);
};

console.log('✅ activateMicrophone debug installed');
 // 🛡️ MINIMAL FIX - Add only these 4 lines
    if (window._activatingMicrophone) return false;
    window._activatingMicrophone = true;
    setTimeout(() => { window._activatingMicrophone = false; }, 2000);


    console.log('🎤 activateMicrophone() called');
    
    // 🆕 BETTER BRIDGE CHECK: Check URL parameters too
    const urlParams = new URLSearchParams(window.location.search);
    const isBridgeMode = window.externalPreGrantedPermission && 
                        urlParams.get('autoStartVoice') === 'true';
    
    console.log('Bridge status:', {
        flag: window.externalPreGrantedPermission,
        urlParam: urlParams.get('autoStartVoice'),
        isBridgeMode: isBridgeMode
    });
    
    if (isBridgeMode) {
        console.log('✅ Bridge mode ACTIVE - using pre-granted permission');
        window.micPermissionGranted = true;
        isAudioMode = true;
    } else {
        // Normal permission flow
        console.log('🔐 Normal permission flow');
        
        if (!window.isSecureContext) {
            addAIMessage("Microphone access requires HTTPS.");
            return;
        }

        try {
            const permissionGranted = await requestMicrophoneAccess();
            if (!permissionGranted) return;
            
            window.micPermissionGranted = true;
            isAudioMode = true;
        } catch (error) {
            console.log('❌ Microphone access failed:', error);
            return;
        }
    }
    
    // 🎯 COMMON SETUP (both modes)
    console.log('🎛️ Setting up audio UI...');
    
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.classList.add('listening');
    }
    
    initializeSpeechRecognition();
    
    const quickButtons = document.getElementById('quickButtonsContainer');
    if (quickButtons) {
        quickButtons.style.display = 'block';
    }
    
    // 🎯 ONLY DO INTRODUCTION IF NOT IN ACTIVE BRIDGE MODE
    if (!isBridgeMode) {
        console.log('💬 Starting normal conversation...');
        setTimeout(() => {
            window.conversationState = 'getting_first_name';
            window.waitingForName = true;
            
            if (typeof leadData === 'undefined' || !leadData) {
                window.leadData = { firstName: '' };
            }
            
            const greeting = "Hi there! I'm Boteemia your personal AI Voice assistant, may I get your first name please?";
            addAIMessage(greeting);
            
            setTimeout(() => {
                speakResponse(greeting);
            }, 800);
        }, 1400);
    } else {
        console.log('✅ Bridge will handle introduction with proper timing');
        // Bridge will handle introduction in bridgeAutoStart()
    }
    
    return true;
}

// ===================================================
// 💭 MESSAGE HANDLING SYSTEM
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
    
    // TRY FORCING WIDTH
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
    provider: 'elevenlabs',  // 'british' | 'elevenlabs' | 'browser'
    
    // ELEVENLABS CONFIG (when enabled)
    elevenlabs: {
        enabled: true,  // ← SET TO TRUE when you have credits
        apiKey: ELEVENLABS_API_KEY,  // Reference the constant
        voiceId: VOICE_ID,           // Reference the constant
        model: 'eleven_turbo_v2'
    },
    
    // BRITISH VOICE CONFIG
    british: {
        enabled: false,   // ← FREE, always available
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
    
    // 🎯 ADD THIS CHECK: Block banner during confirmation dialog
    if (window.isInConfirmationDialog) {
        console.log('🛑 BLOCKING BANNER - Confirmation dialog active');
        return; // STOP HERE - don't trigger banner
    }
    
    // 🆕🎯 CRITICAL FIX: ADD ONLY THIS COOLDOWN RESET BLOCK
    console.log('🎯 RESET: Clearing all banner cooldowns after AI speech');
    window.directSpeakNowCooldown = false;
    if (window.bannerCooldownTimer) {
        clearTimeout(window.bannerCooldownTimer);
        window.bannerCooldownTimer = null;
    }
    // 🆕 END OF COOLDOWN RESET BLOCK
    
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

         window.userFirstName = formattedName;
        window.lastCapturedName = formattedName; // 🆕 BACKUP
        
        // 🎯 STORE FOR FUTURE USE
        window.userFirstName = formattedName;
        
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

// =============================================================================
// 🎯 GOLD STANDARD getAIResponse - 4-STEP SALES PROCESS
// =============================================================================

async function getAIResponse(userMessage, conversationHistory = []) {
    console.log('🎯 GOLD STANDARD getAIResponse called:', userMessage);   

    // 🎯 STEP 0: CHECK FOR CONCERNS FIRST - NEW INTEGRATION
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
    } else {
        console.error('❌ triggerLeadActionCenter not found - urgent system broken');
    }
}, 1000);

return "I understand this is urgent! Let me bring up all the ways to connect with Bruce, the founder and CEO of NCI immediately.";
}

// Check for APPOINTMENT second
if (appointmentPatterns.some(pattern => lowerMessage.includes(pattern))) {
    console.log('🎯 APPOINTMENT INTENT DETECTED - Triggering Action Center');
    
   setTimeout(() => {
    if (window.triggerLeadActionCenter) {
        window.triggerLeadActionCenter(); // ✅ SILENT VERSION
        console.log('✅ SILENT Action Center triggered for appointment request');
    } else {
        console.error('❌ triggerLeadActionCenter not found - appointment system broken');
        }
    }, 1000);
    
    return "Perfect! I'd love to help you schedule that. Let me bring up all the ways to connect with Bruce,the founder and CEO of NCI for your appointment.";
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
        //speakWithElevenLabs(preCloseResponse, false);
        
        if (preCloseResponse.includes("Perfect! Let me get you connected")) {
    // User said YES - trigger SILENT Communication Relay Center
    window.salesAI.state = 'lead_capture';
    console.log('✅ User said YES - triggering SILENT Communication Relay Center');
    
    setTimeout(() => {
        if (window.triggerLeadActionCenter) {
            window.triggerLeadActionCenter(); // ✅ SILENT VERSION
            console.log('✅ SILENT Action Center triggered for pre-close YES response');
        } else {
            console.error('❌ triggerLeadActionCenter not found - pre-close system broken');
        }
    }, 1000);

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
    const fallbackResponse = "I appreciate your message! That's something Bruce,the founder and CEO of NCI would be perfect to help with. Would you like me to connect you with him for a free consultation?";

    // 🎯 BRUCE PRE-CLOSE QUESTION SET: 
window.lastPreCloseQuestion = fallbackResponse;
window.lastPreCloseIntent = 'bruce_consultation';
window.conversationState = 'qualification';
console.log('🎯 BRUCE PRE-CLOSE QUESTION SET:', fallbackResponse);

// 🚫 REMOVE THIS BANNER TRIGGER - Let the wrapper handle it
// setTimeout(() => {
//     if (typeof showUniversalBanner === 'function') {
//         showUniversalBanner('setAppointment');
//         console.log('✅ Free Consultation Banner triggered');
//     }
// }, 50);
return fallbackResponse;
}
}

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
    return "Great! I can make that painless with my assistance after clicking one of our communication relay buttons on your screen";
}

return originalGetAIResponse.apply(this, arguments);
};

/// 🎯 CONCERN DETECTION SYSTEM - FIXED VERSION
// =============================================================================

// 🎯 CONCERN DETECTION: Check for objections/negative sentiment
function detectConcernOrObjection(userText) {
    const text = userText.toLowerCase().trim();
    
    // 🎯 CRITICAL FIX: EXCLUDE appointment/consultation intent words
    const appointmentKeywords = [
        'appointment', 'meeting', 'schedule', 'book', 'reserve', 'set up',
        'consult', 'consultation', 'call', 'talk to bruce', 'meet with bruce',
        'free consultation', 'free consult', 'book a meeting'
    ];
    
    // Check if this is actually an appointment request (NOT a concern)
    const hasAppointmentIntent = appointmentKeywords.some(keyword => 
        text.includes(keyword)
    );
    
    if (hasAppointmentIntent) {
        console.log('🔄 Appointment intent detected - skipping concern detection');
        return false; // This is NOT a concern - it's a positive action request
    }
    
    // Price objections
    const priceKeywords = [
        'expensive', 'too much', 'cost', 'afford', 'price', 
        'budget', 'cheap', 'fee', 'charge', 'payment'
    ];
    
    // Time objections (EXCLUDE appointment words - they're already handled above)
    const timeKeywords = [
        'busy', 'no time', 'later', 'not now', 'rush', 'hurry',
        'timing', 'too long', 'wait'
        // REMOVED: 'schedule', 'appointment' - these are positive actions
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
            
            // 🎯 CRITICAL: SET THE CONCERN TYPE
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
// 🚨 UPDATED handleConcernWithTestimonial FUNCTION - MINIMAL CHANGES
window.handleConcernWithTestimonial = function(userText, concernType) {
    console.log(`🎯 handleConcernWithTestimonial called: "${userText}" (${concernType})`);
    
    // 🛑 BLOCK SPEAK SEQUENCE IMMEDIATELY
    window.concernBannerActive = true;
    window.isInTestimonialMode = true; // 🆕 ADD THIS ONE LINE
    
   // 🛑 STOP ACTIVE LISTENING & CLOSE BANNERS - USING CORRECT FUNCTIONS!
    if (window.stopListening) window.stopListening();
    if (window.hideSpeakNowBanner) window.hideSpeakNowBanner(); // 🆕 CORRECT FUNCTION!
    if (window.cleanupSpeakSequence) window.cleanupSpeakSequence(); // 🆕 DIRECT CLEANUP!
    
    // 🎯 TRIGGER UNIVERSAL BANNER ENGINE (TOP BANNER)
    if (window.showUniversalBanner) {
        window.showUniversalBanner('testimonialSelector');
    }
    
    // 🎯 USE THE PASSED CONCERN TYPE OR DETECT IT
    const finalConcernType = concernType || window.detectedConcernType || 'general';
    
    console.log(`🎯 Handling ${finalConcernType} concern - showing testimonial response`);
    
    // [YOUR ACKNOWLEDGMENT LOGIC]
    let acknowledgment = '';
    switch(finalConcernType) {
        case 'price':
            acknowledgment = `I completely understand your concern regarding pricing. Many of our clients felt the same way initially. If you'd like to hear what they experienced, click a review below. Or click Skip to continue our conversation.`;
            break;
        case 'time':
            acknowledgment = `I hear you on the timing. Several of our clients had similar thoughts before working with Bruce, the founder and CEO of NCI. Feel free to click a review to hear their experience, or hit Skip and we'll keep talking.`;
            break;
        case 'trust':
            acknowledgment = `That's a fair concern. You're not alone - other practice owners felt the same way at first. You're welcome to check out their reviews below, or click Skip to move forward.`;
            break;
        case 'general':
            acknowledgment = `I appreciate you sharing that. Some of valued clients of Bruce, the founder and CEO of NCI started with similar hesitations. If you're curious what happened for them, click a review. Otherwise, click Skip and let's continue.`;
            break;
    }
    
    // 🎯 CRITICAL FIX: SHOW TESTIMONIALS IMMEDIATELY (BEFORE/AFTER VOICE)
    
    // 1. Add AI message to chat FIRST
    if (window.addAIMessage && typeof window.addAIMessage === 'function') {
        window.addAIMessage(acknowledgment);
        console.log('✅ AI message added to chat');
    }
    
    // 2. SHOW TESTIMONIALS IMMEDIATELY (NO WAITING!)
    setTimeout(() => {
        if (window.showTestimonialSplashScreen && typeof window.showTestimonialSplashScreen === 'function') {
            window.showTestimonialSplashScreen();
            console.log('✅ Testimonial splash screen launched IMMEDIATELY');
        } else {
            console.error('❌ showTestimonialSplashScreen not available');
        }
    }, 100); // Small delay to ensure chat message appears first
    
    // 3. START SPEAKING (testimonials are already visible)
    if (window.speakText && typeof window.speakText === 'function') {
        // Small delay to let testimonials render first
        setTimeout(() => {
            window.speakText(acknowledgment);
            console.log('✅ AI speaking acknowledgment (testimonials already visible)');
        }, 300);
    }
    
    // Store the concern
    window.lastDetectedConcern = {
        text: userText,
        type: finalConcernType,
        timestamp: Date.now()
    };
};


// 🎯 ENHANCED CONCERN HANDLER - USING TESTIMONIAL DATA (YOUR EXISTING)
function handleConcernWithTestimonial(userText) {
    // ... your existing enhanced code ...
}

// 🎯 ADD THIS RIGHT AFTER YOUR EXISTING FUNCTION:
function getResumeMessageForConcern(concernType) {
    const messages = {
        price: "As you can see, many clients found the investment well worth it. The ROI typically pays for itself within the first month. Would you like me to show you how we can achieve similar results for you?",
        time: "Like those clients, we understand you're busy. That's why Bruce has streamlined the process to deliver fast results without taking much of your time. Ready to see how quickly we can help you?",
        trust: "I understand the skepticism - many successful clients felt the same way initially. But as you can see, Bruce's results speak for themselves. Would you like me to show you exactly how this works?",
        general: "Many clients had similar concerns initially, but were thrilled once they saw Bruce's results. Would you like me to show you how we can address your specific situation?"
    };
    
    return messages[concernType] || messages.general;
}

// 🎯 SIMPLE BANNER QUEUE PROCESSOR (if needed)
function processBannerQueue() {
    // This is a placeholder - your Universal Engine handles its own queue
    console.log('🔄 Banner queue processing (if needed)');
}

// 🎯 HELPER: GET RELEVANT TESTIMONIALS FOR CONCERN TYPE
function getTestimonialsForConcern(concernType) {
    // Check if testimonial data is available
    if (typeof window.testimonialVideos === 'undefined') {
        console.error('❌ testimonial-data.js not loaded - using fallback');
        return getFallbackTestimonials(concernType);
    }
    
    // Get testimonials for this specific concern
    const testimonials = window.testimonialVideos[concernType];
    
    if (!testimonials) {
        console.warn(`❌ No testimonials found for ${concernType} - using skeptical as fallback`);
        return window.testimonialVideos['skeptical'] || getFallbackTestimonials(concernType);
    }
    
    return testimonials;
}

// 🎯 FALLBACK IF TESTIMONIAL DATA NOT AVAILABLE
function getFallbackTestimonials(concernType) {
    const fallbackTestimonials = {
        'price': {
            title: "Proving the Value",
            videos: [
                {name: "Fallback Client", url: "fallback-price.mp4", duration: 12000}
            ]
        },
        'time': {
            title: "Time Well Spent", 
            videos: [
                {name: "Fallback Client", url: "fallback-time.mp4", duration: 12000}
            ]
        },
        'trust': {
            title: "Building Trust",
            videos: [
                {name: "Fallback Client", url: "fallback-trust.mp4", duration: 12000}
            ]
        },
        'general': {
            title: "Success Stories",
            videos: [
                {name: "Fallback Client", url: "fallback-general.mp4", duration: 12000}
            ]
        }
    };
    
    return fallbackTestimonials[concernType] || fallbackTestimonials['general'];
}

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
            valueProp: "Bruce,the founder and CEO of NCI has helped thousands of accountants successfully exit their practices while maximizing value.",
            timeFrame: "3 months or less", 
            result: "get your practice sold for 20-30% more than going alone",
            offer: "free valuation consultation with Bruce,the founder and CEO of NCI"
        },
        'buy-practice': {
            investigationQuestion: "What type of practice are you looking to acquire?",
            valueProp: "Bruce,the founder and CEO of NCI has exclusive off-market opportunities that most buyers never see.",
            timeFrame: "60-90 days",
            result: "find you the perfect practice match", 
            offer: "free buying consultation with Bruce,the founder and CEO of NCI"
        },
        'pre-qualification': {
    investigationQuestion: "What's motivating you to explore practice ownership right now?",
    valueProp: "Most first-time buyers are surprised by how achievable practice ownership can be.",
    timeFrame: "immediately", 
    result: "help you understand exactly what you qualify for",
    offer: "Submit a no-obligation pre-qualification to Bruce, the founder and CEO of NCI"
        }
    }
};

// ✅ KEEP YOUR EXISTING detectStrongIntent FUNCTION - IT'S BETTER!
function detectStrongIntent(userMessage) {
    console.log('🔍 detectStrongIntent analyzing:', userMessage);
    const lowerMsg = userMessage.toLowerCase();
    
    // Strong selling indicators
   const strongPreQualifYIndicators = [
    'pre qualification', 'prequalification', 'pre qual', 'prequal',
    'get pre qualified', 'pre qualified', 'pre-qualified',
    'qualify for a practice', 'pre approval', 'pre-approval',
    'get qualified to buy', 'buying qualification', 'purchase qualification',
    'financial qualification', 'ready to buy a practice', 'qualify to purchase',
    'pre qualification for', 'prequalification for', 'want to get qualified'

    ];
    
    // Strong buying indicators
    const strongBuyingIndicators = [
        'i want to buy', 'i need to buy', 'looking to buy', 'want to buy', 'need to buy',
        'buy a practice', 'buy a firm', 'acquire a practice', 'purchase a practice',
        'looking to acquire', 'want to acquire'
    ];

    const strongSellingIndicators = [
        'i want to sell', 'i need to sell', 'looking to sell', 'want to sell', 'need to sell',
        'selling my practice', 'sell my practice', 'sell my firm', 'selling my firm',
        'exit my practice', 'retire from practice', 'transition out'    
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
    
    for (const indicator of strongPreQualifYIndicators) {
        if (lowerMsg.includes(indicator)) {
            console.log('🎯 STRONG PREQUALIFY INTENT DETECTED');
            return { type: 'pre-qualification', strength: 'strong' };
        }
    }
// 🚨 FIX THIS: If we're already in a trust-building flow, keep the CURRENT intent!
if (salesAI.state.includes('building_trust') || salesAI.state.includes('understanding_timing')) {
    console.log('🎯 CONTINUING EXISTING TRUST-BUILDING FLOW');
    
    // Determine current intent from state
    if (salesAI.state.includes('prequal')) {
        return { type: 'pre-qualification', strength: 'strong' };
    } else if (salesAI.state.includes('buy')) {
        return { type: 'buy-practice', strength: 'strong' };
    } else {
        return { type: 'sell-practice', strength: 'strong' };
    }
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
            
        case 'pre-qualification':
            return handlePreQualifyIntent(message, userFirstName);
            
        case 'general-question':
            return handleGeneralQuestion(message, userFirstName);
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion(intent);
    }
}

// ✅ ADD PRE-QUALIFICATION INTENT HANDLER
function handlePreQualifyIntent(message, userName) {
    switch(salesAI.state) {
        case 'investigation':
            salesAI.state = 'building_trust_prequal';
            return `${userName}, getting properly pre-qualified is such an important first step in practice ownership. What's motivating you to explore practice ownership right now?`;
            
        case 'building_trust_prequal':
            salesAI.state = 'understanding_prequal_goals';
            return `That's a great starting point. Are you looking for your first practice, or are you thinking about expanding your current operations with an additional location?`;
            
        case 'understanding_prequal_goals':
            salesAI.state = 'pre_close';
            return `If we could help you get pre-qualified and show you exactly what practice options fit your budget and goals, would you be interested in a free pre-qualification consultation with Bruce?`;
            
        default:
            salesAI.state = 'pre_close';
            return getPreCloseQuestion({type: 'pre-qualification'});
    }
}

// BOTH FILES HAVE buildRapportResponse - USING FILE 1'S VERSION (IT'S MORE PERSONAL)
function buildRapportResponse(intentType, userName = '') {
    const namePart = userName ? `${userName}, ` : '';
    
    const responses = {
        'sell-practice': `${namePart}I completely understand your interest in selling your practice. Many practitioners reach a point where they're ready for their next chapter. Bruce,the founder and CEO of NCI actually helped me transition my own practice 5 years ago before I joined him here. His approach is truly different - he focuses on finding the right cultural fit, not just the highest bidder. What got you thinking about selling at this particular time?`,
        
        'buy-practice': `${namePart}That's exciting that you're looking to acquire a practice! Growth through acquisition can be incredibly rewarding. Bruce,the founder and CEO of NCI has an amazing track record of matching buyers with practices that align with their vision. He actually helped me find my current practice when I was in your position. What specific type of practice are you hoping to find?`,
        
        'pre-qualification': `${namePart}Getting properly pre-qualified is so important for practice ownership. Many first-time buyers are surprised to learn how achievable their dream practice can be. Bruce, the founder and CEO of NCI, has a unique approach that looks beyond just the numbers - he considers your goals, growth potential, and the right practice fit for you. He helped me understand the real opportunities in practice ownership. What's motivating your interest in getting pre-qualified right now?`
    };
    
    return responses[intentType] || `${namePart}I'd love to help you with that. Could you tell me more about what you're looking to accomplish?`;
}

// FILE 2 HAS buildPreCloseQuestion - ADDING IT (IT WAS MISSING FROM FILE 1)
function buildPreCloseQuestion(intentType, userName = '') {
    const name = userName ? `${userName}, ` : '';
    const path = NCI_CONFIG.salesPaths[intentType];

    if (!path) return `${name}Would you be interested in a free consultation with Bruce,the founder and CEO of NCI?`;

    return `${name}If we could ${path.result} in ${path.timeFrame}, would you be interested in a ${path.offer}?`;
}

function handlePreCloseResponse(userResponse, intentType) {
    const lowerResponse = userResponse.toLowerCase();
    
    // YES responses
    const yesPatterns = ['yes', 'yeah', 'sure', 'okay', 'ok', 'absolutely', 'definitely', 'let\'s do it', 'ready', 'go ahead'];
    
    // NO responses  
    const noPatterns = ['no', 'not yet', 'maybe later', 'not now', 'no thanks', 'nah', 'wait', 'hold on'];

    if (yesPatterns.some(pattern => lowerResponse.includes(pattern))) {
        // 🎯 CRITICAL FIX: Trigger Action Center IMMEDIATELY, then speak instructions
        console.log('🎯 BRUCE CONSULTATION ACCEPTED - Triggering Action Center immediately');
        
        // Trigger Action Center RIGHT AWAY
        if (window.triggerLeadActionCenter) {
            window.triggerLeadActionCenter(); // ✅ SILENT VERSION
            console.log('✅ Action Center triggered immediately');
        } else {
            console.error('❌ triggerLeadActionCenter not found');
        }
        
        // This speech will play AFTER Action Center appears
        return "Simply click the book consultation button or whatever you prefer and I'll help you set up a consultation with Bruce";
    }
    
    if (noPatterns.some(pattern => lowerResponse.includes(pattern))) {
        return "I completely understand wanting to take your time with such an important decision. What specific questions or concerns would be most helpful for you to have answered right now?";
    }
    
    // Ambiguous response
    return "Thanks for sharing that. To make sure I connect you with the right resources, would now be a good time for Bruce,the founder and CEO of NCI to give you a quick call, or would you prefer to get some initial information first?";
}

// FILE 2 HAS BANNER_MAPPING AND triggerBanner - ADDING THEM (THEY WERE MISSING FROM FILE 1)
const BANNER_MAPPING = {
    'urgent': 'urgent',
    'sell-practice': { investigation: 'expertise', preClose: 'freeIncentive', yesResponse: 'setAppointment' },
    'buy-practice': { investigation: 'expertise', preClose: 'freeIncentive', yesResponse: 'setAppointment' },
    'pre-qualification': { investigation: 'expertise', preClose: 'freeIncentive', yesResponse: 'setAppointment' },
    'appointment': 'setAppointment',
    'consultation': 'setAppointment',
    'pre-qualifier': 'preQualifier',
    'time': 'testimonialSelector', 
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
    const concernDetected = detectConcernOrObjection(userText);
    if (concernDetected) {
        console.log('🚨 Concern detected - handling with testimonial');
        
        // 🎯 CRITICAL FIX: PASS THE CONCERN TYPE!
        // Get the concern type that was detected
        let concernType = window.detectedConcernType || 'general';
        
        // If concern type wasn't set, detect it from text
        if (!window.detectedConcernType) {
            if (userText.toLowerCase().includes('expensive') || userText.toLowerCase().includes('cost') || userText.toLowerCase().includes('price')) {
                concernType = 'price';
            } else if (userText.toLowerCase().includes('time') || userText.toLowerCase().includes('long') || userText.toLowerCase().includes('soon')) {
                concernType = 'time';
            } else if (userText.toLowerCase().includes('trust') || userText.toLowerCase().includes('believe') || userText.toLowerCase().includes('sure')) {
                concernType = 'trust';
            }
        }
        
        console.log(`🎯 Calling handleConcernWithTestimonial with type: ${concernType}`);
        handleConcernWithTestimonial(userText, window.detectedConcernType);
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

function getPreCloseQuestion(intent) {
    const userName = salesAI.userData.firstName || '';
    const namePart = userName ? `${userName}, ` : '';
    
    switch(intent.type) {
        case 'sell-practice':
            return `${namePart}If we could get your practice sold for 20-30% more than going alone in 3 months or less, would you be interested in a valuation consultation with Bruce,the founder and CEO of NCI?`;
            
        case 'buy-practice':
            return `${namePart}If we could help you find the perfect practice to acquire with financing options, would you be interested in a free acquisition consultation?`;
            
        case 'pre-qualification':  // ← ADD THIS CASE
            return `${namePart}If we could help you get pre-qualified and find the right practice opportunity that fits your goals and budget, would you be interested in a free pre-qualification consultation with Bruce, the founder and CEO of NCI?`;
            
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

    // 🎨 CREATE OVERLAY (but don't show "Speak Now" immediately)
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
            <!-- CHANGED: Show "Preparing..." first -->
            <div class="speak-now-text">🎤 Preparing...</div>
            <div class="live-transcription">Initializing microphone...</div>
        </div>
    `;
    document.body.appendChild(voiceOverlay);
    addBlackOverlayStyles();

    // 🎤 CRITICAL: START LISTENING FIRST, THEN UPDATE UI
    window.lastRecognitionResult = null;
    
    // PHASE 1: Initialize listening
    let listeningReady = false;
    
    // 🔄 Use Promise to ensure listening is ready before showing "Speak Now"
    const listeningPromise = new Promise((resolve) => {
        if (typeof startMobileListening === 'function') {
            // Pass a callback that fires when listening is ACTUALLY ready
            startMobileListening(() => {
                listeningReady = true;
                resolve();
            });
        } else {
            startNormalInterviewListening();
            // Assume ready after short delay for normal listening
            setTimeout(() => {
                listeningReady = true;
                resolve();
            }, 300);
        }
    });

    // PHASE 2: Update UI when ready
    listeningPromise.then(() => {
        if (!listeningReady) return;
        
        // 🔊 Play the "ready to speak" beep
        playReadyBeep();
        
        // 🎨 Update UI to show "Speak Now" AFTER listening is ready
        const speakNowText = voiceOverlay.querySelector('.speak-now-text');
        const transcription = voiceOverlay.querySelector('.live-transcription');
        
        if (speakNowText) speakNowText.textContent = '🎤 Speak Now';
        if (transcription) transcription.textContent = 'Listening...';
        
        console.log('✅ Listening ACTIVE - User can speak now');
        
        // 🆕 START TIMEOUT ONLY AFTER LISTENING IS READY
        if (!window.disableDirectTimeout) {
            const listeningTimeout = window.isInLeadCapture ? 20000 : 7000;
            
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
        }
    }).catch((error) => {
        console.error('❌ Listening initialization failed:', error);
        // Fallback: Show error state
        const speakNowText = voiceOverlay.querySelector('.speak-now-text');
        const transcription = voiceOverlay.querySelector('.live-transcription');
        
        if (speakNowText) speakNowText.textContent = '⚠️ Microphone Error';
        if (transcription) transcription.textContent = 'Please allow microphone access';
    });

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
// 🛡️ PERMANENT COOLDOWN BYPASS SYSTEM - FIXED (NO SPAM)
// ===================================================
if (!window.bannerCooldownBypassInstalled) {
    console.log('💣 INSTALLING PERMANENT COOLDOWN BYPASS...');

    // 1. THE WINNING FIX: Permanently disable bannerCooldown (SILENT VERSION)
    Object.defineProperty(window, 'bannerCooldown', {
        get: function() { 
            // 🚫 REMOVED: console.log('🛡️ COOLDOWN BYPASS: Always returning false');
            return false; 
        },
        set: function(value) { 
            // Optional: keep this for debugging if needed
            // console.log('🛡️ COOLDOWN BLOCKED: Attempt to set to', value);
            return false;
        }
    });

    // 2. Also block speakSequenceBlocked permanently (SILENT VERSION)
    Object.defineProperty(window, 'speakSequenceBlocked', {
        get: function() { 
            // 🚫 REMOVED: console.log('🛡️ SEQUENCE BLOCKED: Always returning false');
            return false; 
        },
        set: function(value) { 
            // Optional: keep this for debugging if needed
            // console.log('🛡️ SEQUENCE BLOCKED: Attempt to set to', value);
            return false;
        }
    });

    window.bannerCooldownBypassInstalled = true;
    console.log('✅ PERMANENT COOLDOWN BYPASS INSTALLED!');
} else {
    // 🚫 REMOVED: console.log('✅ Cooldown bypass already active - skipping reinstallation');
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

console.log('✅ Voice chat functions exported for Action System integration');

console.log('🎯 ALL SYSTEMS INITIALIZED AND READY');
