// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - KB INTEGRATED VERSION
// ===================================================
// CHANGES FROM PREVIOUS VERSION:
// ✅ REMOVED: Hardcoded first name prompt in 'initial' state (line ~5001)
// ✅ REMOVED: Hardcoded 'getting_first_name' response block (line ~5024)
// 🎯 RESULT: All name capture now handled by KB Loader
//           Uses greeting.with_name from CPA JSON with {firstName} substitution
// 
// Date: October 15, 2025
// Captain: Mobile-Wise AI Empire
// ===================================================

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
let conversationState = 'initial';
let userResponseCount = 0;
let shouldShowSmartButton = false;
let smartButtonText = 'AI Smart Button';
let smartButtonAction = 'default';
let restartTimeout = null;
let lastMessageWasApology = false;
let isInLeadCapture = false;
let speechDetected = false;
let currentAIResponse = '';
let conversationHistory = []; // Track conversation for lead capture logic
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
            console.log('❌ Speech recognition not supported in this browser');
            if (typeof addAIMessage === 'function') {
                addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
            }
            return false;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;
        
        // ✅ PROPER: Set up audio detection handlers
        this.recognition.onsoundstart = () => {
            console.log('🎤 🎤 🎤 SOUND DETECTED by recognition engine!');
            speechDetected = true;
        };
        this.recognition.onaudiostart = () => {
            console.log('🎤 🎤 🎤 AUDIO INPUT STARTED!');
        };
        this.recognition.onspeechstart = () => {
            console.log('🗣️ 🗣️ 🗣️ SPEECH DETECTED!');
            speechDetected = true;
        };
        this.recognition.onspeechend = () => {
            console.log('🗣️ Speech ended');
        };
        
        // 🎯 SET UP CORE HANDLERS ONCE - Don't overwrite these!
        this.setupCoreHandlers();
        
        console.log('🎯 Speech engine created successfully');
        return true;
    }
    
    setupCoreHandlers() {
        console.log('🎯 Setting up CORE recognition handlers (ONE TIME ONLY)');
        
        // 🎯 ONRESULT - This is the most important handler!
        this.recognition.onresult = function(event) {
            console.log('🎯 🎯 🎯 ONRESULT FIRED! Got transcript!');
            let transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            transcript = transcript.replace(/\.+$/, '');
            console.log('🎤 Transcript:', transcript);
            
            const transcriptText = document.getElementById('transcriptText');
            const userInput = document.getElementById('userInput');
            
            if (transcriptText) {
                transcriptText.textContent = 'Speak Now';
            }
            
            if (userInput) {
                userInput.value = transcript;
                console.log('✅ Transcript saved to userInput:', transcript);
            }
            
            // Auto-send in lead capture mode
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
        
        // 🎯 ONERROR - Handle speech recognition errors
        this.recognition.onerror = function(event) {
            console.log('🔊 Speech error from CORE handler:', event.error);
            
            if (event.error === 'no-speech') {
                console.log('⚠️ No speech detected - will be handled by onend');
                // Don't do anything here - let onend handle it
                return;
            }
            
            if (event.error === 'audio-capture') {
                console.log('🎤 No microphone detected');
                if (typeof addAIMessage === 'function') {
                    addAIMessage("I can't detect your microphone. Please check your audio settings.");
                }
            }
            
            if (event.error === 'not-allowed') {
                console.log('🔒 Permission denied');
                if (typeof addAIMessage === 'function') {
                    addAIMessage("Microphone permission was denied. Please allow microphone access to continue.");
                }
            }
            
            if (event.error === 'aborted') {
                console.log('🛑 Recognition aborted - normal for quick restarts');
            }
        };
        
        // 🎯 ONSTART - Log when recognition starts
        this.recognition.onstart = function() {
            console.log('✅ Recognition STARTED (from CORE handler)');
        };
        
        console.log('✅ CORE HANDLERS installed in SpeechEngineManager');
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

// 🚨 NUCLEAR MOBILE DETECTION - SCREEN SIZE ONLY
const isDefinitelyMobile = window.innerWidth <= 768 || window.innerHeight <= 1024;

if (isDefinitelyMobile) {
    console.log('📱 NUCLEAR MOBILE DETECTED: Using visual feedback system');
}

// 🎯 COMPLETE REVISED showPostSorryListening() FUNCTION
function showPostSorryListening() {
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
    }, 25); // INSTANT: 25ms instead of 100ms
    
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
// 🎤 SPEECH RECOGNITION SYSTEM - DISABLED (Using SpeechEngineManager)
// ===================================================
/*
function checkSpeechSupport() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('❌ Speech recognition not supported in this browser');
        addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
        return false;
    }
    return true;
}

function initializeSpeechRecognization() {
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
    return true;
}
*/

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
    if (isSpeaking) return;
    
    try {
        // 🎯 ALWAYS USE SPEECH ENGINE MANAGER (mobile + desktop)
        if (!speechEngine.isReady()) {
            console.log('🎯 Initializing speech engine...');
            const initialized = await speechEngine.initializeEngine();
            if (!initialized) {
                console.log('❌ Speech engine initialization failed');
                return;
            }
        }
        
        if (!recognition) {
            recognition = speechEngine.getEngine();
            console.log('✅ Using Speech Engine Manager (handlers already set)');
        }

        // 🚫 DON'T re-assign onresult - it's already set in SpeechEngineManager!
        // The core handlers (onresult, onsoundstart, etc.) are set ONCE during engine initialization

    recognition.onerror = function(event) {
    console.log('🔊 Speech error:', event.error);

    // 🎯 ADD TIMER CANCELLATION HERE
    if (speakSequenceCleanupTimer) {
        clearTimeout(speakSequenceCleanupTimer);
        speakSequenceCleanupTimer = null;
        console.log('🕐 CANCELLED cleanup timer in error handler');
    }

    // 🎯 CALL YOUR NEW DESKTOP ERROR HANDLER FIRST
    if (typeof handleSpeechRecognitionError === 'function') {
        console.log('🎯 CALLING handleSpeechRecognitionError for:', event.error);
        handleSpeechRecognitionError(event.error);
        return; // Exit here - let your handler manage everything
    } else {
        console.log('❌ handleSpeechRecognitionError function not found - using fallback');
    }

    // 🎯 FALLBACK SYSTEM (only if handleSpeechRecognitionError doesn't exist)
    if (event.error === 'no-speech') {
        const transcriptText = document.getElementById('transcriptText');

        console.log('🔍 MOBILE DEBUG:', {
            userAgent: navigator.userAgent,
            isMobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent),
            isTouch: ('ontouchstart' in window || navigator.maxTouchPoints > 0)
        });

        // 🚨 NUCLEAR MOBILE DETECTION - SCREEN SIZE ONLY
        const isDefinitelyMobile = window.innerWidth <= 768 || window.innerHeight <= 1024;

        console.log('🔍 NUCLEAR MOBILE DEBUG:', {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            isDefinitelyMobile: isDefinitelyMobile
        });

        if (isDefinitelyMobile) {
            console.log('📱📱📱 NUCLEAR MOBILE DETECTED: Using visual feedback system');

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
                            showHybridReadySequence();
                        }, 800);
                    }
                }, 1500);
            }

        } else {
            console.log('🖥️ FALLBACK: Using old desktop system');

            lastMessageWasApology = true;
            const apologyResponse = getApologyResponse();

            stopListening();

            setTimeout(() => {
                addAIMessage(apologyResponse);
                speakResponse(apologyResponse);

                if (restartTimeout) clearTimeout(restartTimeout);

                restartTimeout = setTimeout(() => {
                    if (isAudioMode && !isListening && !isSpeaking) {
                        startListening();
                    }
                    lastMessageWasApology = false;
                }, 500);
            }, 500);
        }
    } else if (event.error === 'audio-capture') {
        console.log('🎤 No microphone detected');
        addAIMessage("I can't detect your microphone. Please check your audio settings.");
    } else if (event.error === 'not-allowed') {
        console.log('🔒 Permission denied');
        addAIMessage("Microphone permission was denied. Please allow microphone access to continue.");
    }
};

  recognition.onend = function() {
    console.log('🎯🎯🎯 WHICH ONEND IS RUNNING? 🎯🎯🎯');
    console.log('🔚 Recognition ended');
    console.log('🔍 DEBUG: playingSorryMessage =', window.playingSorryMessage);
    console.log('🔍 DEBUG: isSpeaking =', isSpeaking);
    console.log('🔍 DEBUG: speakSequenceActive =', speakSequenceActive);
    
    const userInput = document.getElementById('userInput');
    
    if (userInput && userInput.value.trim().length > 0) {
        // User said something - process the message
        const currentMessage = userInput.value.trim();
        const now = Date.now();
        const timeSinceLastMessage = now - (window.lastMessageTime || 0);
        
        if (!window.lastProcessedMessage || 
            window.lastProcessedMessage !== currentMessage || 
            timeSinceLastMessage > 3000) {
            
            console.log('✅ Sending new message:', currentMessage);

            // 🎯 ADD BANNER CLEANUP HERE - RIGHT AFTER MESSAGE IS SENT
            if (typeof speakSequenceActive !== 'undefined' && speakSequenceActive) {
                console.log('🎯 Closing Speak Now banner - message sent');
                
                // 🎯 RESET SORRY MESSAGE PROTECTION
                window.playingSorryMessage = false;
                
                // Cancel cleanup timer
                if (speakSequenceCleanupTimer) {
                    clearTimeout(speakSequenceCleanupTimer);
                    speakSequenceCleanupTimer = null;
                }
                
                // Close banner immediately
                cleanupSpeakSequence();
            }
            
            // Process the user message
            window.lastMessageTime = now;
            window.lastProcessedMessage = currentMessage;
            sendMessage(currentMessage);
        }
    } else {
        // No transcript captured - check if speech was detected
        if (speechDetected) {
            console.log('⚠️ Speech detected but no transcript captured - unclear speech');
            console.log('🎯 speechDetected flag was:', speechDetected);
            // Reset flag for next attempt
            speechDetected = false;
        } else {
            console.log('🔄 No speech detected at all via onend - showing try again overlay');
        }

        // 🔓 CLEAR THE BLOCKING FLAG AFTER NO SPEECH
        setTimeout(() => {
            window.playingSorryMessage = false;
            console.log('🔓 Cleared playingSorryMessage after no-speech timeout');
        }, 3000);

        // 🎯 ADD TIMER CANCELLATION RIGHT HERE!
        if (speakSequenceCleanupTimer) {
            clearTimeout(speakSequenceCleanupTimer);
            speakSequenceCleanupTimer = null;
            console.log('🕐 CANCELLED cleanup timer - preventing session kill');
        }
        
        // ✅ NEW SIMPLE APPROACH: Just show overlay, keep microphone active
        if (!isSpeaking) {
            setTimeout(() => {
                console.log('🎯 DEBUG: About to show try again overlay');
                showAvatarSorryMessage(); // ← SIMPLE OVERLAY INSTEAD OF COMPLEX RESTART
                console.log('🎯 DEBUG: Try again overlay shown');
            }, 7000); // 2 second delay before showing overlay

        } else {
            console.log('🚫 DEBUG: BLOCKED - AI is speaking');
        }
    }
};
        
        // 🎯 MOBILE TIMING DELAY - REMOVED FOR FASTER RESPONSE
        const delay = 0; // No delays - instant response
        
        console.log('⚡ Instant response mode - no delays');

    } catch (error) {
        console.error('❌ Error starting speech recognition:', error);
        addAIMessage("Speech recognition failed. Please try again or use text input.");
        switchToTextMode();
    }
}

function stopListening() {
    if (recognition) {
        recognition.stop();
    }

    const micButton = document.getElementById('micButton');
    const liveTranscript = document.getElementById('liveTranscript');
    
    if (micButton) micButton.classList.remove('listening');
    if (liveTranscript) liveTranscript.style.display = 'none';

    isListening = false;
}

// ===================================================
// 🔍 FORCE START LISTENING
// ===================================================

// 🎯 ADD THIS TO YOUR forceStartListening() FUNCTION - REPLACE THE EXISTING ONE:
async function forceStartListening() {
    console.log('🎤 TEST 8: forceStartListening() CALLED at:', Date.now());
    console.log('🎤 TEST 9: isSpeaking:', isSpeaking);
    console.log('🎤 TEST 10: recognition exists:', !!recognition);
    console.log('🔄 FORCE starting speech recognition (mobile reset)');
    
    if (isSpeaking) return;
    
    try {
        // 🎯 USE SPEECH ENGINE MANAGER ONLY
        if (!speechEngine.isReady()) {
            const initialized = await speechEngine.initializeEngine();
            if (!initialized) return;
        }
        
        if (!recognition) {
            recognition = speechEngine.getEngine();
        }
        
        // 🎯 DIAGNOSTIC: Check recognition state BEFORE starting
        console.log('🔍 DIAGNOSTIC: Recognition state before start:', recognition.state || 'undefined');
        
        // 🚫 DON'T OVERWRITE HANDLERS! They're already set in SpeechEngineManager
        // The handlers (onresult, onerror, onstart) are configured during initialization
        console.log('✅ Using existing handlers from SpeechEngineManager (not overwriting)');
        
        console.log('🎤 Force starting speech recognition...');
        recognition.start();
        isListening = true;
        
        // 🎯 DIAGNOSTIC: Check state AFTER starting
        setTimeout(() => {
            console.log('🔍 DIAGNOSTIC: Recognition state after start:', recognition.state || 'undefined');
        }, 100);
        
        showSpeakNow();
        
        console.log('✅ Force speech recognition started successfully');
        
    } catch (error) {
        console.error('❌ DIAGNOSTIC: Error in forceStartListening:', error);
        console.log('🔍 DIAGNOSTIC: Error name:', error.name);
        console.log('🔍 DIAGNOSTIC: Error message:', error.message);
    }
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
            
            // Initialize speech engine
            await speechEngine.initializeEngine();
            recognition = speechEngine.getEngine();

            document.getElementById('quickButtonsContainer').style.display = 'block';

           setTimeout(() => {
    // Initialize conversation system - BULLETPROOF VERSION
    if (typeof conversationState === 'undefined') {
        window.conversationState = 'initial';
    } else {
        conversationState = 'initial';
    }
    
    // Initialize leadData if it doesn't exist
    if (typeof leadData === 'undefined' || !leadData) {
        window.leadData = { firstName: '' };
    }
    
    // 🎯 KB-POWERED GREETING - Use KB system if loaded
    let greeting;
    
    // Check if KB system is loaded and has greeting
    if (window.conversationKB && window.conversationKB.kb && window.conversationKB.kb.greeting) {
        greeting = window.conversationKB.kb.greeting.initial;
        console.log('✅ Using KB greeting:', greeting);
    } else {
        // Fallback to simple greeting if KB not loaded yet
        greeting = "Hi there! I'm Boatimia, your personal AI Voice assistant. May I get your first name please?";
        console.log('⚠️ KB not loaded yet - using fallback greeting');
    }
    
    // 🎯 CRITICAL: SYNC STATE - We just asked for name, so set engine to expect name response
    if (window.conversationEngine) {
        window.conversationEngine.currentState = 'getting_first_name';
        console.log('🎯 Synced ConversationEngine state to: getting_first_name');
    }
    
    addAIMessage(greeting);
    speakResponse(greeting);
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
    
    // Track in conversation history
    conversationHistory.push({ role: 'user', content: message });
    
    scrollChatToBottom();
}

function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    
    // Track in conversation history
    conversationHistory.push({ role: 'assistant', content: message });
    
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
    }
    
    addUserMessage(message);
    userInput.value = '';
    
    processUserResponse(message);
}

function processUserResponse(userText) {
    userResponseCount++;
    
    stopListening();
    
    // ✅ CHECK FINAL QUESTION STATE FIRST (BEFORE LEAD CAPTURE!)
    if (conversationState === 'final_question') {
        const response = userText.toLowerCase().trim();
        
        if (response.includes('no') || response.includes('nope') || response.includes("i'm good") || response.includes('nothing')) {
            const goodbye = "Thank you for visiting us today. Have a great day!";
            addAIMessage(goodbye);
            speakResponse(goodbye);
            
            
            setTimeout(() => {
    // Continue conversation instead of ending abruptly
    addAIMessage("Is there anything else I can help you with today?", 'ai');
    conversationState = 'asking_if_more_help';
    stopListening();
    window.lastProcessedMessage = null;
     }, 1500);
            
            return;
        }
        
        // If unclear, ask again
        addAIMessage("Is there anything else I can help you with today?");
        speakResponse("Is there anything else I can help you with today?");
        setTimeout(() => {
            startListening();
            window.lastProcessedMessage = null;
        }, 800);
        return;
    }
    
    // 🆕 SINGLE EMAIL PERMISSION HANDLER - NO DUPLICATES
    if (conversationState === 'asking_for_email_permission') {
        const response = userText.toLowerCase().trim();
        
        if (response.includes('yes') || response.includes('sure') || response.includes('okay') || response.includes('send')) {
            // Send confirmation email - this will handle the flow internally
            sendFollowUpEmail();
            
            // Clear duplicate prevention
            setTimeout(() => {
                window.lastProcessedMessage = null;
            }, 2000);
            return;
            
        } else if (response.includes('no') || response.includes('skip') || response.includes("don't")) {
            // Skip email, go to final question
            const skipMessage = "No problem! Is there anything else I can help you with today?";
            addAIMessage(skipMessage);
            speakResponse(skipMessage);
            conversationState = 'final_question';
            
            setTimeout(() => {
                startListening();
                window.lastProcessedMessage = null;
            }, 1000);
            return;
            
        } else {
            // Clarify
            const clarifyMessage = "Would you like me to send you the book and confirmation email? Just say yes or no.";
            addAIMessage(clarifyMessage);
            speakResponse(clarifyMessage);
            
            setTimeout(() => {
                startListening();
                window.lastProcessedMessage = null;
            }, 1000);
            return;
        }
    }
    
  // 🆕 CHECK IF LEAD CAPTURE SHOULD HANDLE THIS FIRST
if (processLeadResponse(userText)) {
    setTimeout(() => {
        window.lastProcessedMessage = null;
    }, 2000);
    return;
}

// 🎯 NEW: Direct consultation trigger - NO AI fluff!
if (shouldTriggerLeadCapture(userText)) {
    console.log('🎯 BYPASSING AI - Direct to lead capture!');
    setTimeout(() => {
        initializeLeadCapture();
    }, 300);
    return; // Exit early!
}

// Default AI response handler
setTimeout(async () => {
    const responseText = getAIResponse(userText);

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
    
    updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
    
    setTimeout(() => {
        window.lastProcessedMessage = null;
    }, 3000);
}, 800);
}

function shouldTriggerLeadCapture(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // Get recent AI messages to check context
    const recentAI = conversationHistory
        .slice(-3)
        .filter(msg => msg.role === 'assistant')
        .map(msg => msg.content.toLowerCase())
        .join(' ');
    
    // Check if recent AI mentioned consultation/scheduling
    const aiOfferedConsultation = recentAI.includes('consultation') || 
                                recentAI.includes('schedule') ||
                                recentAI.includes('contact you') ||
                                recentAI.includes('would you like');
    
    // User's affirmative responses
    const yesResponses = [
        'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'absolutely', 
        'definitely', 'of course', 'let\'s do it', 'sounds good',
        'i would', 'i\'d like that', 'that sounds great', 'let\'s go'
    ];
    
    return yesResponses.includes(input) && aiOfferedConsultation;
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
// LEAN VOICE SYSTEM CONFIG - FINAL
// ===========================================
const VOICE_CONFIG = {
    provider: 'us_energetic',  // Google US English - ENERGETIC!
    debug: true
};

// ===========================================
// STREAMLINED VOICE SYSTEM - FINAL
// ===========================================
class MobileWiseVoiceSystem {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
        this.isSpeaking = false;
        
        console.log('🎤 Lean Voice System initializing...');
        this.initializeVoices();
    }
    
    // Initialize voices once
    async initializeVoices() {
        await new Promise((resolve) => {
            const loadVoices = () => {
                this.voices = this.synthesis.getVoices();
                if (this.voices.length > 0) {
                    this.selectBestVoice();
                    resolve();
                } else {
                    setTimeout(loadVoices, 100);
                }
            };
            this.synthesis.addEventListener('voiceschanged', loadVoices);
            loadVoices();
        });
    }
    
    // Simple voice selection - GOOGLE US ENGLISH
    selectBestVoice() {
        // 🎯 PRIORITY: Google US English - Captain's approved voice!
        const voicePriority = [
            'Google US English',              // ← Captain's choice - PERFECT!
            'Microsoft Zira - English (United States)',
            'Microsoft David - English (United States)',
            'Google UK English Female',
            'Google UK English Male'
        ];
        
        for (const voiceName of voicePriority) {
            const voice = this.voices.find(v => v.name === voiceName);
            if (voice) {
                this.selectedVoice = voice;
                if (VOICE_CONFIG.debug) {
                    console.log(`🎤 Selected voice: ${voice.name} (${voice.lang})`);
                    console.log(`✅ Using Google US English - Energetic & Professional!`);
                }
                return;
            }
        }
        
        // Fallback
        this.selectedVoice = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }
    
    // MAIN SPEAK FUNCTION
    async speak(text) {
        if (!text?.trim()) return;
        
        this.synthesis.cancel();
        this.isSpeaking = true;
        window.isSpeaking = true;
        
        if (VOICE_CONFIG.debug) {
            console.log(`🎤 Speaking: "${text.substring(0, 50)}..."`);
        }
        
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }
            
            // 🎯 CAPTAIN'S APPROVED SETTINGS
            utterance.rate = 1.0;     // Normal speed
            utterance.pitch = 1.1;    // Energetic
            utterance.volume = 0.9;   // Strong
            
            utterance.onend = utterance.onerror = () => {
                this.handleSpeechComplete();
                resolve();
            };
            
            this.synthesis.speak(utterance);
            
            setTimeout(() => {
                if (this.synthesis.paused) this.synthesis.resume();
            }, 100);
        });
    }
    
    // COMPLETION HANDLER WITH TESTIMONIAL BLOCKING
    handleSpeechComplete() {
        this.isSpeaking = false;
        window.isSpeaking = false;
        
        if (VOICE_CONFIG.debug) {
            console.log('🔍 Speech completed - checking for blocks');
        }
        
        // 🚫 TESTIMONIAL BLOCKING
        if (window.testimonialBlocking) {
            if (VOICE_CONFIG.debug) {
                console.log('🚫 BLOCKED: Testimonial playing - skipping banner');
            }
            return;
        }
        
        const conversationState = window.conversationState || 'ready';
        const thankYouSplashVisible = document.querySelector('.thank-you-splash:not([style*="display: none"])');
        
        if (conversationState === 'speaking') {
            if (VOICE_CONFIG.debug) console.log('🚫 BLOCKED: Still speaking');
            return;
        }
        
        if (conversationState === 'ended' || conversationState === 'splash_screen_active') {
            if (VOICE_CONFIG.debug) console.log('🚫 BLOCKED: Ended');
            return;
        }
        
        if (thankYouSplashVisible) {
            if (VOICE_CONFIG.debug) console.log('🚫 BLOCKED: Splash visible');
            return;
        }
        
        if (VOICE_CONFIG.debug) {
            console.log('✅ Triggering banner');
        }
        
        setTimeout(() => {
            if (typeof showHybridReadySequence === 'function') {
                try {
                    showHybridReadySequence();
                    if (VOICE_CONFIG.debug) console.log('✅ Banner triggered');
                } catch (error) {
                    console.error('❌ Banner error:', error);
                }
            }
        }, 500);
    }
    
    stop() {
        this.synthesis.cancel();
        this.isSpeaking = false;
        window.isSpeaking = false;
        if (VOICE_CONFIG.debug) console.log('🛑 Stopped');
    }
}

// INITIALIZE
window.mobileWiseVoice = new MobileWiseVoiceSystem();
window.speakText = (text) => window.mobileWiseVoice.speak(text);
window.stopAllSpeech = () => window.mobileWiseVoice.stop();
window.speakResponse = window.speakText;
window.speakResponseOriginal = window.speakText;

if (VOICE_CONFIG.debug) {
    console.log('✅ Lean Voice System loaded!');
    console.log('🎤 Voice: Google US English');
    console.log('✅ Rate: 1.0 (Normal)');
    console.log('🚀 Pitch: 1.1 (Energetic)');
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
// 🎯 MOBILE-WISE AI UNIVERSAL BANNER ENGINE - CLEAN CONTAINER EDITION
// ===================================================================
window.showUniversalBanner = function(bannerType, customContent = null, options = {}) {
    console.log(`🎯 Deploying Universal Banner: ${bannerType}`);
    
    // COMPLETE BANNER LIBRARY - All 9 Banner Types
    const bannerLibrary = {
        // 1. BRANDING HEADER (🚀 UPDATED LAYOUT)
        branding: {
    content: `
        <div class="banner-glow-container" style="width: 782px; max-width: 782px; margin: 0 auto; height: 77px; display: flex; justify-content: center; align-items: center; padding: 0 10px; border-radius: 10px; background: white; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);">
            
            <!-- CENTER: NCI Logo -->
            <div style="display: flex; align-items: center; justify-content: center;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1759148392591_nci.PNG" 
                     style="width: 280px; height: auto; border-radius: 8px; box-shadow: 0 0px 8px rgba(255, 255, 255, 1);">
            </div>
        </div>
        
        <style>
        /* Blue PULSING GLOW AROUND BANNER */
        .banner-glow-container {
            position: relative;
            animation: redPulseGlow 2s ease-in-out infinite;
        }
        
        @keyframes redPulseGlow {
            0%, 100% { 
                box-shadow: 0 10px 10px rgba(0,0,9,0.0), 0 0 10px rgba(0, 128, 255, 1);
            }
            50% { 
                box-shadow: 0 20px 10px rgba(0,0,9,0.0), 0 0 25px rgba(0, 0, 255, 1);
            }
        }
        </style>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 795,
    customHeight: 90,
},
        
        // 3. EMAIL SENT CONFIRMATION
        emailSent: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; background: rgba(32, 178, 170, 0.8); border-radius: 6px; height: 58px; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; color: white;">
                <div style="font-size: 14px; font-weight: bold;">
                    ✅ <strong>Confirmation Email Sent!</strong>
                </div>
                <div style="font-size: 11px; opacity: 0.9; margin-top: 3px;">
                    Please check your email for the book link
                </div>
            </div>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.2)', // 🎯 WHITE LAYER
    containerWidth: 752, // 🚀 WHITE LAYER WIDTH CONTROL
    customHeight: 65, // 🚀 WHITE LAYER HEIGHT CONTROL
    duration: 4000
},
  
// 2. SMART BUTTON (Free Consultation)
avatar: {
   content: `
        <div class="banner-glow-container" style="width: 785px; max-width: 785px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #000c24ff, #011030ff); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            
            <!-- LEFT: Avatar Image -->
            <div style="display: flex; align-items: center;">
               <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1759960502123_AI-banner2.png" 
                     class="avatar-shape-glow"
                     style="width: 275px; height: 80px; border-radius: 0px; margin-right: 15px; margin-top: 12px;"
                    </div>
                </div>
            </div>
        </div>
        
        <style>
        /* No animation on banner container */
        .banner-glow-container {
            position: relative;
        }
             .banner-glow-container::before {
    content: '';
    position: absolute;
    width: calc(100% + 50px);  /* <-- CHANGE 50px to make wider/narrower */
    height: calc(100% + 20px);
    top: -10px;
    left: -25px;               /* <-- Keep this half of the width addition */
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    z-index: -1;
    animation: glowLayerPulse 8s ease-in-out infinite;
        }
    .banner-glow-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    animation: highlighterSweep 7s ease-in-out infinite;  /* <-- 7s total cycle */
    z-index: 1;
    border-radius: 8px;
}

@keyframes highlighterSweep {
    0%, 85% { left: -100%; opacity: 0; }     
    86% { left: -100%; opacity: 1; }         
    97% { left: 100%; opacity: 1; }          /* <-- Changed from 94% to 97% */
    98% { left: 100%; opacity: 0; }          /* <-- Adjust this too */
    100% { left: -100%; opacity: 0; }        
}
        
        /* ✨ AVATAR SHAPE GLOW - Follows the actual avatar outline, not a box! */
        .avatar-shape-glow {
            filter: drop-shadow(0 0 2px rgba(0, 140, 255, 0.8));
            animation: avatarGlowPulse 2.5s ease-in-out infinite;
        }
        
        @keyframes avatarGlowPulse {
            0%, 100% { 
                filter: drop-shadow(0 0 6px rgba(15, 197, 217, 0.81));
            }
            35% { 
                filter: drop-shadow(0 0 10px rgba(0, 0, 0, 1));
            }
        }
        
        /* ✨ FREE TEXT GLOW */
        .free-glow {
            text-shadow: 0 0 8px rgba(255,255,255,0.8);
            animation: freeTextGlow 2.5s ease-in-out infinite;
        }
        
        @keyframes freeTextGlow {
            0%, 100% { text-shadow: 0 0 8px rgba(255,255,255,0.8); }
            50% { text-shadow: 0 0 12px rgba(255,255,255,1); }
        }
        </style>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 795,
    customHeight: 90,
    duration: 0
},

// 3. EMAIL SENT CONFIRMATION (Already standardized - keeping as reference)
emailConfirmationSent: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; background: rgba(32, 178, 170, 0.8); border-radius: 6px; height: 58px; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; color: white;">
                <div style="font-size: 14px; font-weight: bold;">
                    ✅ <strong>Confirmation Email Sent!</strong>
                </div>
                <div style="font-size: 11px; opacity: 0.9; margin-top: 3px;">
                    Please check your email for the book link
                </div>
            </div>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.2)', // 🎯 WHITE LAYER
    containerWidth: 752, // 🚀 WHITE LAYER WIDTH CONTROL
    customHeight: 65, // 🚀 WHITE LAYER HEIGHT CONTROL
    duration: 4000
},

// 4. FREE INCENTIVE OFFER 1
clicktoCall: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; height: 58px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; border-radius: 6px; background: linear-gradient(135deg, #FF6B6B, #4ECDC4);">
            <div style="color: white;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 2px;">
                    📚 FREE Book for You!
                </div>
                <div style="font-size: 12px; color: #fff; opacity: 0.9;">
                    "7 Secrets to Selling Your Practice"
                </div>
            </div>
            <button onclick="requestFreeBook()" style="
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 8px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
            ">
                Get Free Book
            </button>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 752, // 🚀 WHITE LAYER WIDTH CONTROL
    customHeight: 65, // 🚀 WHITE LAYER HEIGHT CONTROL
    duration: 0
},

// 5. FREE BOOK OFFER 2
freeBookWithConsultation: {
    content: `
        <div class="banner-glow-container" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #0f5ef0ff, #000000ff); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            
            <!-- LEFT: Book Image -->
            <div style="display: flex; align-items: center;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758088515492_nci-book.png" 
                     class="book-white-glow"
                     style="width: 60px; height: 70px; border-radius: 0px; margin-right: 15px;">
                
                <!-- Book Info -->
                <div style="color: white; text-align: left;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                        📚 <span class="free-glow">FREE</span> Consultation & Book
                    </div>
                    <div style="font-size: 13px; color: #00ffb3ff; opacity: 0.95;">
                        "7 Secrets to Selling Your Practice" FREE!
                    </div>
                </div>
            </div>
        </div>
        
        <style>
        .banner-glow-container::before {
    content: '';
    position: absolute;
    width: calc(100% + 50px);  /* <-- CHANGE 50px to make wider/narrower */
    height: calc(100% + 20px);
    top: -10px;
    left: -25px;               /* <-- Keep this half of the width addition */
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    z-index: -1;
    animation: glowLayerPulse 2s ease-in-out infinite;
        }
    .banner-glow-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    animation: highlighterSweep 7s ease-in-out infinite;  /* <-- 7s total cycle */
    z-index: 1;
    border-radius: 8px;
}

@keyframes highlighterSweep {
    0%, 85% { left: -100%; opacity: 0; }     
    86% { left: -100%; opacity: 1; }         
    97% { left: 100%; opacity: 1; }          /* <-- Changed from 94% to 97% */
    98% { left: 100%; opacity: 0; }          /* <-- Adjust this too */
    100% { left: -100%; opacity: 0; }        
}
        
        @keyframes glowLayerPulse {
            0%, 100% { 
                box-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
            }
            50% { 
                box-shadow: 0 0 30px rgba(0, 217, 255, 0.8);
            }
        }
        
        /* Blue PULSING GLOW AROUND BANNER */
        .banner-glow-container {
            position: relative;
            animation: redPulseGlow 2s ease-in-out infinite;
        }
        
        @keyframes redPulseGlow {
            0%, 100% { 
                box-shadow: 0 10px 10px rgba(0,0,7,0.0), 0 0 10px rgba(0, 255, 0, 1);
            }
            50% { 
                box-shadow: 0 20px 10px rgba(0,0,9,0.0), 0 0 25px rgba(0, 217, 255, 1);
            }
        }
        
        /* 📚 WHITE GLOW BEHIND BOOK */
        .book-white-glow {
            animation: bookWhiteGlow 3s ease-in-out infinite;
        }
        
        @keyframes bookWhiteGlow {
            0%, 100% { 
                box-shadow: 0 0 0px rgba(255,255,255,0.5);
                transform: scale(1.2);
            }
            50% { 
                box-shadow: 0 0 0px rgba(255,255,255,0.9);
                transform: scale(1.03);
            }
        }
        
        /* ✨ FREE TEXT GLOW */
        .free-glow {
            text-shadow: 0 0 8px rgba(255,255,255,0.8);
            animation: freeTextGlow 2.5s ease-in-out infinite;
        }
        
        @keyframes freeTextGlow {
            0%, 100% { text-shadow: 0 0 8px rgba(255,255,255,0.8); }
            50% { text-shadow: 0 0 12px rgba(255,255,255,1); }
        }
        </style>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 770,
    customHeight: 90,
    duration: 0
},


// 5. CONSULTATION CONFIRMED
consultationConfirmed: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; height: 58px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(33, 150, 243, 0.8);">
            <div style="text-align: center; color: white;">
                <div style="font-size: 16px; font-weight: bold;">
                    🎉 Consultation Confirmed!
                </div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">
                    Bruce will reach out within 24 hours for your FREE practice valuation
                </div>
            </div>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.2)',
    containerWidth: 752, // 🚀 WHITE LAYER WIDTH CONTROL
    customHeight: 65, // 🚀 WHITE LAYER HEIGHT CONTROL
    duration: 5000
},

// 6. CLICK-TO-CALL 
clickToCall: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; height: 58px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; border-radius: 6px; background: linear-gradient(135deg, #0044ffff, #0a0b50ff);">
            <div style="color: white; font-weight: 600; font-size: 16px;">
                📞 Talk to Bruce Now
            </div>
            <button onclick="callBruce()" style="
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 8px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                animation: pulse-attention 2s infinite;
            ">
                📞 Call Now
            </button>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 752, // 🚀 WHITE LAYER WIDTH CONTROL
    customHeight: 65, // 🚀 WHITE LAYER HEIGHT CONTROL
    duration: 0
},

// 7. CONTACT INFORMATION
 contactInformation: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="color: white;">
                <div style="font-size: 16px; font-weight: bold;">
                    ❓ Still Have Questions?
                </div>
                <div style="font-size: 12px; color: #fff; opacity: 0.9;">
                    I'm here to help with anything else!
                </div>
            </div>
            <button onclick="restartConversation()" style="
                background: white;
                color: #667eea;
                border: none;
                padding: 8px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
            ">
                Ask Another Question
            </button>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 752, // 🚀 WHITE LAYER WIDTH CONTROL
    customHeight: 65, // 🚀 WHITE LAYER HEIGHT CONTROL
    duration: 0
},

// 8. LEAD MAGNET BANNER
leadMagnet: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; height: 58px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; border-radius: 6px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
            <div style="color: white;">
                <div style="font-size: 16px; font-weight: bold;">
                    🎁 Your Free Gift is Ready!
                </div>
                <div style="font-size: 12px; color: #fff; opacity: 0.9;">
                    Download your exclusive guide now
                </div>
            </div>
            <button onclick="window.open(getActiveLeadMagnet().downloadLink, '_blank')" style="
                background: white;
                color: #28a745;
                border: none;
                padding: 8px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
            ">
                📥 Download Now
            </button>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 752, // 🚀 WHITE LAYER WIDTH CONTROL
    customHeight: 65, // 🚀 WHITE LAYER HEIGHT CONTROL
    duration: 0
}, // 🚨 THIS COMMA WAS MISSING!

// 9. LEAD CAPTURE ACTIVE
leadCapture: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; height: 58px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="text-align: center; color: white;">
                <div style="font-size: 16px; font-weight: bold;">
                    📋 YOUR CONTACT INFO
                </div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">
                    Please provide your details for the consultation
                </div>
            </div>
        </div>
            `,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            duration: 0
        }
    };
    
     // 🎯 REMOVE EXISTING BANNERS AND CONTAINERS
    const existingBanner = document.getElementById('universalBanner');
    if (existingBanner) existingBanner.remove();
    
    const existingContainer = document.getElementById('bannerHeaderContainer');
    if (existingContainer) existingContainer.remove();
    
    // Get banner config
    const bannerConfig = bannerLibrary[bannerType];
    if (!bannerConfig && !customContent) {
        console.error(`❌ Banner type "${bannerType}" not found in library`);
        return null;
    }
    
    // 🚀 CREATE HEADER CONTAINER (INSIDE MAIN CONTAINER - CLEAN!)
    const headerContainer = document.createElement('div');
    headerContainer.id = 'bannerHeaderContainer';
    const bannerHeight = bannerConfig?.customHeight || 85;
    const bannerWidth = bannerConfig?.customWidth || 830; // 🚀 NEW WIDTH CONTROL
    headerContainer.style.cssText = `
        position: absolute !important;
        top: 10px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 100% !important;
        height: ${bannerHeight}px !important;
        max-width: ${bannerWidth}px !important;
        z-index: 9999 !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        pointer-events: none !important;
        margin: 0 !important;
    `;
    
    // 🚀 CREATE BANNER WITHIN CONTAINER
    const banner = document.createElement('div');
    banner.id = 'universalBanner';
    banner.className = `universal-banner ${bannerType}-banner`;
    banner.innerHTML = customContent || bannerConfig.content;
    
    // 🚀 DUAL-LAYER CONTROL (PROPERLY INTEGRATED!)
    if (bannerConfig?.containerWidth) {
        headerContainer.style.maxWidth = `${bannerConfig.containerWidth}px`;
        banner.style.width = `${bannerConfig.containerWidth}px`;
        banner.style.maxWidth = `${bannerConfig.containerWidth}px`;
        banner.style.margin = '0 auto';
    }
    
    // 🎯 BANNER STYLING (FITS WITHIN CONTAINER)
    if (bannerType === 'branding') {
        banner.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: transparent !important;
            border: none !important;
            backdrop-filter: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: none !important;
        `;
    } else {
        banner.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: ${bannerConfig?.background || 'rgba(255, 255, 255, 0.1)'};
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
    }
    
    // 🎯 MOBILE RESPONSIVE ADJUSTMENT
    if (window.innerWidth <= 850) {
        headerContainer.style.width = 'calc(100vw - 20px)';
        headerContainer.style.maxWidth = '830px';
        headerContainer.style.height = '70px';
    }
    
    // 🚀 DEPLOY INSIDE MAIN CONTAINER (THE KEY CHANGE!)
    const mainContainer = document.querySelector('.container') || 
                          document.querySelector('#main-container') || 
                          document.querySelector('#container') || 
                          document.querySelector('#app') ||
                          document.body;
    
    headerContainer.appendChild(banner);
    mainContainer.insertBefore(headerContainer, mainContainer.firstChild);
    
    // 🚀 AUTO-REMOVE WITH BRANDING RESTORE (FIXED!)
    const duration = options.duration || bannerConfig?.duration;
    if (duration && duration > 0) {
        setTimeout(() => {
            removeAllBanners(); // ← CHANGED: Now uses the auto-restore system!
        }, duration);
    }
    
    console.log(`✅ Container-based banner "${bannerType}" deployed (Clean positioning)`);
    return banner;
};

// 🚀 AUTO-RESTORE BRANDING SYSTEM
window.restoreBrandingBanner = function() {
    const existingContainer = document.getElementById('bannerHeaderContainer');
    if (!existingContainer) {
        console.log('🔄 Restoring default branding banner...');
        window.showUniversalBanner('branding');
    }
};

// 🚀 ENHANCED REMOVE WITH AUTO-RESTORE
window.removeAllBanners = function(restoreBranding = true) {
    const existingContainer = document.getElementById('bannerHeaderContainer');
    if (existingContainer) {
        existingContainer.remove();
        console.log('🗑️ Header banner container removed');
        
        if (restoreBranding) {
            setTimeout(() => {
                window.restoreBrandingBanner();
            }, 300);
        }
    }
    
    const existingBanner = document.getElementById('universalBanner');
    if (existingBanner) {
        existingBanner.remove();
        console.log('🗑️ Universal banner removed');
    }
};

// ✅ KEEP: Backward compatibility wrapper
window.removeLeadCaptureBanner = function() {
    removeAllBanners();
    console.log('🎯 Lead capture banner removal (Universal system)');
};

console.log('🎖️ Complete Universal Banner Engine loaded - 9 banner types ready (Clean Container Edition)!');

// ===================================================
// 🏆 AUTO-DEPLOY BRANDING BANNER ON PAGE LOAD
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment for page to fully load, then deploy branding
    setTimeout(() => {
        console.log('🏆 Auto-deploying Mobile-Wise AI branding banner...');
        showUniversalBanner('branding');
    }, 500); // Half second delay to ensure everything is loaded
});

// BACKUP: If DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        console.log('🏆 Backup branding banner deployment...');
        showUniversalBanner('branding');
    }, 100);
}

// ===================================================================
// 🎯 UNIVERSAL MASTER BANNER TRIGGER SYSTEM - ALL INDUSTRIES
// ===================================================================

// Universal trigger configuration (easily customizable per industry)
const bannerTriggers = {
    // CONSULTATION/SERVICE TRIGGERS
    consultation_offer: {
        bannerType: 'smartButton',
        content: {
            selling: '📞 FREE Practice Valuation - Connect with Bruce Now',
            buying: '🏢 View Available Practices - Connect with Bruce', 
            valuation: '📈 Get Your FREE Practice Valuation - Talk to Bruce',
            default: '📅 FREE Consultation Available'
        },
        delay: 500,
        duration: 0,
        conditions: ['consultation_ready']
    },
    
    // EMAIL CONFIRMATION
    email_sent: {
        bannerType: 'emailSent',
        content: '✅ Information Sent! We\'ll contact you within 24 hours',
        delay: 0,
        duration: 4000,
        conditions: ['email_success']
    },
    
    // FREE OFFER (Book, Guide, Calculator, etc.)
    free_offer: {
        bannerType: 'freeBook',
        content: '📚 FREE Book: "7 Secrets to Selling Your Practice"',
        delay: 2000,
        duration: 0,
        conditions: ['consultation_declined']
    },
    
    // THANK YOU / MORE QUESTIONS
    more_questions: {
        bannerType: 'moreQuestions', 
        content: '🙏 Thank you for visiting! Have a wonderful day!',
        delay: 1000,
        duration: 0,
        conditions: ['conversation_ended']
    },
    
    // LEAD MAGNET
    lead_magnet: {
        bannerType: 'leadMagnet',
        content: '🎁 Your Free Gift is Ready!',
        delay: 3000,
        duration: 0,
        conditions: ['has_lead_magnet']
    },
    
    // CONSULTATION CONFIRMED
    consultation_confirmed: {
        bannerType: 'consultationConfirmed',
        content: '🎉 Consultation Confirmed!',
        delay: 0,
        duration: 5000,
        conditions: ['booking_success']
    },

     pre_valuation_scheduling: {
        bannerType: 'preValuationScheduling',
        delay: 0,
        duration: 0,  // <-- 0 = PERSISTENT (stays until manually changed)
        conditions: ['valuation_interview_active']
    },
    
    meeting_request_sent: {
        bannerType: 'meetingRequestSent', 
        delay: 0,
        duration: 3000,  // <-- Brief 3-second display
        conditions: ['booking_success']
    },
    
    free_book_offer: {
        bannerType: 'freeBookOffer',
        delay: 0,
        duration: 0,  // <-- PERSISTENT until user interacts
        conditions: ['lead_captured']
    }
};

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
    // ✅ REMOVE THE ELSE BLOCK ENTIRELY!
    // Let your Universal Banner 2.0 system handle all removal/restoration
}

// ===================================================
// 🧠 AI RESPONSE SYSTEM
// ===================================================
// ===================================================
// 🎤 HYBRID SPEAK NOW SYSTEM - MOBILE-WISE AI
// ===================================================

function showSpeakNow() {
    // Use new hybrid system instead of old button
    showHybridReadySequence();
}

function hideSpeakNow() {
    // Hide transcript display
    const liveTranscript = document.getElementById('liveTranscript');
    const transcriptText = document.getElementById('transcriptText');
    
    if (liveTranscript) {
        liveTranscript.style.display = 'none';
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
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        utterance.onstart = function() {
            isSpeaking = true; // Add this for proper state management
            console.log('🔊 AI started speaking - hiding Speak Now');
            // Hide the green banner while AI speaks
            const liveTranscript = document.getElementById('liveTranscript');
            if (liveTranscript) {
                liveTranscript.style.display = 'none';
            }
        };

        utterance.onend = function() {
            isSpeaking = false; // Add this for proper state management
            console.log('🔊 AI finished speaking for lead capture');
            
            // ✅ THE FIX: Show hybrid sequence for lead capture questions
            if (isInLeadCapture) {
                setTimeout(() => {
                    showHybridReadySequence(); // This shows "Get Ready to Speak" → "Listening"
                }, 1300);
            }
        };
        
        window.speechSynthesis.speak(utterance);
    }
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
        showHybridReadySequence(); // Restart the full red -> green sequence
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
    
    // 🚀 DIRECT TRIGGER - NO BRIDGE NEEDED
    triggerBanner('consultation_confirmed', {
        type: 'dualSection',
        sections: {
            left: {
                title: '🎯 Free Consultation Confirmed!',
                subtitle: 'Your information has been submitted'
            },
            right: {
                title: `📚 FREE Book for ${leadData.name}!`,
                subtitle: '"7 Secrets to Selling Your Practice"',
                image: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758088515492_nci-book.png'
            }
        },
        cleanup: ['bruceBookBanner', 'emailConfirmationBanner', 'leadCapture'],
        hideSmartButton: true,
        transition: 'smooth',
        callback: (result) => {
            console.log('🎯 Consultation confirmed banner deployed:', result);
        }
    });
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
    if (liveTranscript) liveTranscript.style.display = 'none';
    
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

// NEW FUNCTION: Ask quick question (from buttons)
function askQuickQuestion(question) {
    addUserMessage(question);
    processUserResponse(question);
}

// Global flag to prevent multiple instances
let speakSequenceActive = false;
let speakSequenceButton = null;
let speakSequenceCleanupTimer = null;



// ✅ MOBILE STABILITY FUNCTIONS - ADD THESE
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

    // 🎯 CONSULTATIVE CONCERN DETECTION SYSTEM
function detectConsultativeResponse(userText) {
    const text = userText.toLowerCase().trim();
    
    // 🎯 VALUE/WORTH CONCERNS
    const valueConcerns = [
        'concern', 'worried', 'afraid', 'nervous', 'anxious',
        'worth', 'value', 'fair price', 'market value', 'low ball',
        'undervalue', 'undersell', 'getting what', 'full value',
        'what it\'s worth', 'fair deal', 'ripped off', 'enough money'
    ];
    
    // 🎯 SPEED/TIMELINE CONCERNS  
    const speedConcerns = [
        'how long', 'timeline', 'time', 'quick', 'fast', 'speed',
        'when', 'soon', 'quickly', 'process time', 'sell fast',
        'too fast', 'rushed', 'patient', 'wait', 'takes forever'
    ];
    
    // 🎯 CREDIBILITY/TRUST CONCERNS
    const credibilityConcerns = [
        'experience', 'credibility', 'trust', 'legitimate', 'proven',
        'track record', 'skeptical', 'doubt', 'reliable', 'reputation',
        'references', 'testimonials', 'reviews', 'who are you', 'can you really'
    ];
    
    // Check for value concerns → Show "skeptical then exceeded" testimonial
    for (let concern of valueConcerns) {
        if (text.includes(concern)) {
            console.log(`🎯 VALUE CONCERN detected: "${concern}" - will show value testimonial`);
            return 'value';
        }
    }
    
    // Check for speed concerns → Show "speed of sale" testimonial
    for (let concern of speedConcerns) {
        if (text.includes(concern)) {
            console.log(`🎯 SPEED CONCERN detected: "${concern}" - will show speed testimonial`);
            return 'speed';
        }
    }
    
    // Check for credibility concerns → Show "skeptical then exceeded" testimonial
    for (let concern of credibilityConcerns) {
        if (text.includes(concern)) {
            console.log(`🎯 CREDIBILITY CONCERN detected: "${concern}" - will show credibility testimonial`);
            return 'credibility';
        }
    }
    
    return null; // No concern detected
}
    
    // 🎯 CLEANUP - CONTINUES CONVERSATION (KEY DIFFERENCE FROM SORRY MESSAGE)
    function cleanup() {
        console.log(`🎬 Testimonial ${testimonialType} complete - continuing conversation`);
        
        if (avatarOverlay.parentNode) {
            avatarOverlay.remove();
        }
        
        window.avatarCurrentlyPlaying = false;
        
        // 🎯 NO "Speak Now" - let conversation continue naturally
        setTimeout(() => {
            console.log('✅ Testimonial removed - conversation continues naturally');
            window.testimonialBlocking = false;  // ✅ CLEAR blocking flag
            console.log("✅ UNBLOCKED: \"Speak Now\" banner can now show for next response");
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

// Then call forceStartListening as backup (THE KEY!)
setTimeout(() => {
    console.log('🔄 DIRECT backup: calling forceStartListening()');
    forceStartListening();
}, 100); // Same delay as normal questions
        
        // 🔥 FIXED: Check disableDirectTimeout flag before setting timeout
if (!window.disableDirectTimeout) {
    setTimeout(() => {
        if (!speakSequenceActive) return;
        
        console.log('⏰ DIRECT: 12-second listening window ended - no speech detected');
        
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
        
    }, 12000);
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
                transition: width 3s ease; // PROPER TIMING: 3 seconds
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
    
    // ===== TRANSITION TO SPEAK NOW (FASTER - 1.5 seconds) =====
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
        }, 50); // INSTANT: 50ms instead of 200ms
        
        // ===== LISTENING TIMEOUT WITH NUCLEAR SHUTDOWN =====
        setTimeout(() => {
            if (!speakSequenceActive) return;
            
            console.log('⏰ 12-second listening window ended - no speech detected');
            
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
                
                console.log('🎬 Triggering avatar sorry message (no recognition to clean)...');
                if (typeof showAvatarSorryMessage === 'function') {
                    showAvatarSorryMessage();
                } else {
                    console.log('❌ showAvatarSorryMessage function not found');
                }
            }
            
        }, 12000);
        
    }, 3000); // PROPER TIMING: 3 seconds for voice setup
    
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

function getAIResponse(userInput) {
    // ✅ STOP PROCESSING IF CONVERSATION IS ENDED
    if (conversationState === 'ended') {
        return "Thank you for visiting! Have a great day.";
    }
    
    const userText = userInput.toLowerCase();
    let responseText = '';
    let firstName = leadData.firstName || '';

    // 🚀 ZERO-LATENCY CONVERSATION ENGINE
    try {
        const kbResponse = window.conversationEngine.getResponse(userInput, firstName);
        
        if (kbResponse) {
            responseText = kbResponse.response;
            
            // 🎯 Sync state with conversation engine
            if (kbResponse.newState) {
                conversationState = kbResponse.newState;
                // Keep engine in sync
                window.conversationEngine.currentState = kbResponse.newState;
                console.log('🔄 State synced to:', kbResponse.newState);
            }
            
            // Handle data extraction
            if (kbResponse.extractedData) {
                Object.assign(leadData, kbResponse.extractedData);
                console.log('💾 Extracted data:', kbResponse.extractedData);
            }
            
            // 🎯 TESTIMONIAL HANDLING - Trigger testimonial videos from objections/questions
            if (kbResponse.triggerTestimonial) {
                window.testimonialBlocking = true;  // 🚫 BLOCK "Speak Now" banner while testimonial plays
                console.log("🚫 BLOCKING: Testimonial will show - preventing \"Speak Now\" banner");
                const testimonialId = kbResponse.triggerTestimonial;
                console.log('🎬 Triggering testimonial video:', testimonialId);
                
                // Map testimonial IDs to video URLs
                if (testimonialId === 'speed') {
                    showUniversalBanner('testimonial', {
                        videoUrl: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4',
                        caption: 'Surprised by the Speed of the Sale',
                        ctaText: 'Get Your Fast Sale',
                        ctaAction: () => {
                            showUniversalBanner('consultationForm');
                        }
                    });
                } else if (testimonialId === 'skeptical') {
                    showUniversalBanner('testimonial', {
                        videoUrl: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4',
                        caption: 'Skeptical, Then Exceeded Expectations',
                        ctaText: 'See How We Can Help You',
                        ctaAction: () => {
                            showUniversalBanner('consultationForm');
                        }
                    });
                } else {
                    console.warn('⚠️ Unknown testimonial ID:', testimonialId);
                }
            }
            
            // 🎯 BANNER HANDLING - Trigger banners from KB responses
            if (kbResponse.triggerBanner) {
                const bannerId = kbResponse.triggerBanner;
                console.log('🎯 Triggering banner:', bannerId);
                
                // Map banner IDs to showUniversalBanner calls
                switch(bannerId) {
                    case 'branding':
                        showUniversalBanner('branding');
                        break;
                    case 'consultation':
                    case 'consultationForm':
                        showUniversalBanner('consultationForm');
                        break;
                    case 'valuation':
                    case 'valuationForm':
                        showUniversalBanner('valuationForm');
                        break;
                    case 'contactInformation':
                        showUniversalBanner('contactInformation');
                        break;
                    default:
                        if (typeof showUniversalBanner === 'function') {
                            showUniversalBanner(bannerId);
                        }
                }
            }
            
            // Legacy action handling (if still present in some responses)
            if (kbResponse.action) {
                const action = kbResponse.action;
                
                // Handle testimonial actions
                if (action.type === 'show_testimonial') {
                    if (action.testimonialId === 'skeptical') {
                        showUniversalBanner('testimonial', {
                            videoUrl: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4',
                            caption: 'Skeptical, Then Exceeded Expectations',
                            ctaText: 'See How We Can Help You',
                            ctaAction: () => {
                                showUniversalBanner('consultationForm');
                            }
                        });
                    } else if (action.testimonialId === 'speed') {
                        showUniversalBanner('testimonial', {
                            videoUrl: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4',
                            caption: 'Surprised by the Speed of the Sale',
                            ctaText: 'Get Your Fast Sale',
                            ctaAction: () => {
                                showUniversalBanner('consultationForm');
                            }
                        });
                    }
                }
                
                // Handle banner actions
                else if (action.type === 'show_banner') {
                    switch(action.bannerId) {
                        case 'branding':
                            showUniversalBanner('branding');
                            break;
                        case 'emailSent':
                            showUniversalBanner('emailSent');
                            break;
                        case 'emailConfirmationSent':
                            showUniversalBanner('emailConfirmationSent');
                            break;
                        case 'leadMagnet':
                            showUniversalBanner('leadMagnet');
                            break;
                        case 'clickToCall':
                            showUniversalBanner('clickToCall');
                            break;
                        case 'consultationConfirmed':
                            showUniversalBanner('consultationConfirmed');
                            break;
                        case 'contactInformation':
                            showUniversalBanner('contactInformation');
                            break;
                        case 'consultationForm':
                            showUniversalBanner('consultationForm');
                            break;
                        case 'consultation':
                            showUniversalBanner('consultation');
                            break;
                        case 'valuationForm':
                            showUniversalBanner('valuationForm');
                            break;
                        case 'valuationSuccess':
                            showUniversalBanner('valuationSuccess');
                            break;
                        case 'scheduleCall':
                            showUniversalBanner('scheduleCall');
                            break;
                        case 'thankYou':
                            showUniversalBanner('thankYou');
                            break;
                        case 'errorMessage':
                            showUniversalBanner('errorMessage', action.params);
                            break;
                        case 'pricing':
                            showUniversalBanner('pricing');
                            break;
                        case 'process':
                            showUniversalBanner('process');
                            break;
                        default:
                            console.warn('Unknown banner type:', action.bannerId);
                    }
                }
            }
            
            return responseText;
        }
    } catch (error) {
        console.error('KB System Error:', error);
        // Fallback to basic response
        responseText = "I'm here to help with CPA firm transactions. Could you tell me more about what you're looking for?";
    }

    // 🎯 FALLBACK: Basic conversation handling if KB doesn't match
    if (conversationState === 'initial') {
        // 🎯 REMOVED: Hardcoded first name prompt - now handled by KB Loader
        
        // Basic routing
        if (userText.includes('buy') || userText.includes('purchase') || userText.includes('buying')) {
            responseText = firstName ? 
                `Great to meet you, ${firstName}! Let's explore CPA practices available for purchase. What's your budget range?` :
                "Great! Let's explore CPA practices for sale. What's your budget range?";
            conversationState = 'buying_budget_question';
        } else if (userText.includes('sell') || userText.includes('selling')) {
            responseText = firstName ?
                `Thanks ${firstName}! I can help you sell your CPA practice. How many clients do you currently serve?` :
                "I can help you sell your CPA practice. How many clients do you currently serve?";
            conversationState = 'selling_size_question';
        } else if (userText.includes('value') || userText.includes('valuation') || userText.includes('worth')) {
            responseText = firstName ?
                `${firstName}, I can provide a professional valuation. How many clients does your practice serve?` :
                "I can provide a professional valuation. How many clients does your practice serve?";
            conversationState = 'valuation_size_question';
        }
    }
    
    // 🎯 FALLBACK: Only run if KB didn't provide a response
    if (!responseText || responseText === '') {
        // 🎯 REMOVED: Hardcoded 'getting_first_name' handler - now handled by KB Loader

    }

    return responseText;
}
