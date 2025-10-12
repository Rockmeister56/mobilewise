// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - KNOWLEDGE BASE INTEGRATED COMPLETE
// Smart Button + Lead Capture + EmailJS + Banner System + Knowledge Base
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

// ===================================================
// 🏗️ GLOBAL VARIABLES - UPDATED FOR KNOWLEDGE BASE
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
let conversationHistory = []; // Track conversation for lead capture logic

// 🎯 NEW KNOWLEDGE BASE STATE MANAGEMENT
let currentConversationMode = 'greeting'; // greeting -> name_collection -> qa_mode -> lead_capture
let isKnowledgeBaseReady = false;
let hasCollectedName = false;

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
        
        // 🚫 CRITICAL: DISABLE BROWSER BEEP
        this.recognition.onsoundstart = null;
        this.recognition.onaudiostart = null;
        this.recognition.onstart = null;
        
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

// 🚨 NUCLEAR MOBILE DETECTION - SCREEN SIZE ONLY
const isDefinitelyMobile = window.innerWidth <= 768 || window.innerHeight <= 1024;

// 🚨 FIX: Check if event exists before accessing event.error
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
    if (currentConversationMode === 'ended') {
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
            console.log('✅ Using Speech Engine Manager');
        }

        // Keep ALL your existing event handlers - they're perfect
        recognition.onresult = function(event) {
            let transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            transcript = transcript.replace(/\.+$/, '');
            
            const transcriptText = document.getElementById('transcriptText');
            const userInput = document.getElementById('userInput');
            
            if (transcriptText) {
                transcriptText.textContent = 'Speak Now';
            }
            
            if (userInput) {
                userInput.value = transcript;
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
        // No speech detected - show simple overlay instead of complex restart
        console.log('🔄 No speech detected via onend - showing try again overlay');

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
        
        // 🎯 DIAGNOSTIC: Add detailed event logging
        recognition.onstart = function() {
            console.log('✅ DIAGNOSTIC: Recognition STARTED successfully');
        };
        
        recognition.onerror = function(event) {
    console.log('🔊 Speech error:', event.error);

    if (event.error === 'no-speech') {
        const transcriptText = document.getElementById('transcriptText');

        console.log('🔍 MOBILE DEBUG:', {
            userAgent: navigator.userAgent,
            isMobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent),
            isTouch: ('ontouchstart' in window || navigator.maxTouchPoints > 0)
        });

        // 🚨 NUCLEAR MOBILE DETECTION - REPLACE THE OLD CHECK
        const isDefinitelyMobile = window.innerWidth <= 768 || window.innerHeight <= 1024;

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
                        }, 500);
                    }
                },  1000);
            }

        } else {
            console.log('🖥️ Desktop: Using voice apology system');

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
    console.log('  💭 conversationMode:', currentConversationMode);
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
// 🎤 MICROPHONE ACTIVATION SYSTEM - WITH KNOWLEDGE BASE GREETING
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

           setTimeout(async () => {
    // 🎯 INITIALIZE KNOWLEDGE BASE CONVERSATION SYSTEM
    currentConversationMode = 'greeting';
    hasCollectedName = false;
    
    // Initialize leadData if it doesn't exist
    if (typeof leadData === 'undefined' || !leadData) {
        window.leadData = { firstName: '' };
        leadData = window.leadData;
    }
    
    // 🧠 GET INDUSTRY-SPECIFIC GREETING
    let greeting = "Hi there! I'm here to help you today. Before we start, may I get your first name?";
    
    try {
        if (typeof window.mobileWiseKB !== 'undefined') {
            const industryInfo = await window.mobileWiseKB.getIndustryInfo();
            greeting = industryInfo.greeting + " Before we dive in, may I get your first name?";
            isKnowledgeBaseReady = true;
            console.log('🧠 Knowledge base ready, using industry greeting');
        } else {
            console.log('⚠️ Knowledge base not loaded, using default greeting');
        }
    } catch (error) {
        console.log('⚠️ Error loading industry greeting, using default:', error);
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

// ===================================================
// 🧠 KNOWLEDGE BASE INTEGRATED RESPONSE PROCESSOR
// ===================================================
async function processUserResponse(userText) {
    userResponseCount++;
    stopListening();
    
    console.log('🧠 Processing user response with Knowledge Base:', userText);
    console.log('🔍 Current conversation mode:', currentConversationMode);
    
    // 🎯 HANDLE NAME COLLECTION FIRST
    if (currentConversationMode === 'greeting' && !hasCollectedName) {
        const name = userText.trim();
        
        // Store the name
        leadData.firstName = name;
        window.leadData.firstName = name;
        hasCollectedName = true;
        currentConversationMode = 'qa_mode';
        
        // Respond with personalized greeting and invitation to ask questions
        const personalizedGreeting = `Nice to meet you, ${name}! I'm here to help with any questions you have about CPA firm transactions, practice valuations, buying or selling. What would you like to know?`;
        
        addAIMessage(personalizedGreeting);
        speakResponse(personalizedGreeting);
        
        setTimeout(() => {
            startListening();
            window.lastProcessedMessage = null;
        }, 800);
        return;
    }
    
    // 🎯 HANDLE EMAIL PERMISSION REQUEST
    if (currentConversationMode === 'asking_for_email_permission') {
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
            currentConversationMode = 'final_question';
            
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
    
    // 🎯 HANDLE FINAL QUESTION STATE
    if (currentConversationMode === 'final_question') {
        const response = userText.toLowerCase().trim();
        
        if (response.includes('no') || response.includes('nope') || response.includes("i'm good") || response.includes('nothing')) {
            const goodbye = "Thank you for visiting us today. Have a great day!";
            addAIMessage(goodbye);
            speakResponse(goodbye);
            
            setTimeout(() => {
                // Continue conversation instead of ending abruptly
                addAIMessage("Is there anything else I can help you with today?");
                currentConversationMode = 'asking_if_more_help';
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
    
    // 🎯 CHECK IF LEAD CAPTURE SHOULD HANDLE THIS FIRST
    if (processLeadResponse(userText)) {
        setTimeout(() => {
            window.lastProcessedMessage = null;
        }, 2000);
        return;
    }

    // 🎯 CHECK FOR DIRECT CONSULTATION TRIGGER
    if (shouldTriggerLeadCapture(userText)) {
        console.log('🎯 BYPASSING AI - Direct to lead capture!');
        setTimeout(() => {
            initializeLeadCapture();
        }, 300);
        return; // Exit early!
    }
    
    // 🧠 MAIN KNOWLEDGE BASE PROCESSING (QA MODE)
    if (currentConversationMode === 'qa_mode' && isKnowledgeBaseReady) {
        try {
            console.log('🧠 Searching knowledge base for:', userText);
            const knowledgeAnswer = await window.findKnowledgeAnswer(userText);
            
            if (knowledgeAnswer) {
                console.log('✅ Knowledge base answer found');
                
                // Use the knowledge base answer
                addAIMessage(knowledgeAnswer.answer);
                speakResponse(knowledgeAnswer.answer);
                
                // 🎯 CHECK FOR TESTIMONIAL TRIGGER
                if (knowledgeAnswer.testimonial_trigger && knowledgeAnswer.testimonial_type) {
                    console.log('🎬 Testimonial triggered:', knowledgeAnswer.testimonial_type);
                    
                    setTimeout(async () => {
                        try {
                            const testimonial = await window.mobileWiseKB.getTestimonial(knowledgeAnswer.testimonial_type);
                            if (testimonial && testimonial.video_url) {
                                displayTestimonialVideo(testimonial);
                            }
                        } catch (error) {
                            console.log('❌ Error loading testimonial:', error);
                        }
                    }, 2000);
                }
                
                // 🎯 HANDLE FOLLOW UP
                if (knowledgeAnswer.follow_up) {
                    setTimeout(() => {
                        addAIMessage(knowledgeAnswer.follow_up);
                        speakResponse(knowledgeAnswer.follow_up);
                        
                        setTimeout(() => {
                            startListening();
                            window.lastProcessedMessage = null;
                        }, 1000);
                    }, 1500);
                } else {
                    setTimeout(() => {
                        startListening();
                        window.lastProcessedMessage = null;
                    }, 1000);
                }
                
                return;
            } else {
                console.log('❓ No knowledge base match found, using fallback');
                
                // Use knowledge base fallback response
                const fallbackResponse = await window.mobileWiseKB.getFallbackResponse();
                addAIMessage(fallbackResponse);
                speakResponse(fallbackResponse);
                
                // Trigger lead capture after fallback
                setTimeout(() => {
                    initializeLeadCapture();
                }, 1000);
                
                return;
            }
            
        } catch (error) {
            console.log('❌ Knowledge base error:', error);
            // Fall through to default AI system
        }
    }

    // 🎯 FALLBACK TO LEGACY AI RESPONSE SYSTEM
    setTimeout(() => {
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

// 🎯 TESTIMONIAL DISPLAY FUNCTION
function displayTestimonialVideo(testimonial) {
    console.log('🎬 Displaying testimonial video:', testimonial);
    
    // Create testimonial overlay
    const overlay = document.createElement('div');
    overlay.id = 'testimonial-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 20px;
        max-width: 600px;
        width: 100%;
        position: relative;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✖';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ff4757;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 16px;
    `;
    
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
    };
    
    const title = document.createElement('h3');
    title.textContent = testimonial.title || 'Client Success Story';
    title.style.cssText = 'margin-top: 0; color: #333;';
    
    const video = document.createElement('video');
    video.src = testimonial.video_url;
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = 'width: 100%; border-radius: 8px;';
    
    const description = document.createElement('p');
    description.textContent = testimonial.description || '';
    description.style.cssText = 'color: #666; margin-bottom: 0;';
    
    videoContainer.appendChild(closeButton);
    videoContainer.appendChild(title);
    videoContainer.appendChild(video);
    if (testimonial.description) {
        videoContainer.appendChild(description);
    }
    
    overlay.appendChild(videoContainer);
    document.body.appendChild(overlay);
    
    // Auto-close after video ends
    video.onended = () => {
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 3000);
    };
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
            utterance.rate = 0.85;
            utterance.pitch = 1.05;
            utterance.volume = 0.85;
            
            utterance.onend = () => {
                this.handleSpeechComplete();
                resolve();
            };
            
            utterance.onerror = (error) => {
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
        const conversationMode = currentConversationMode; // Use knowledge base conversation mode
        const thankYouSplashVisible = document.querySelector('.thank-you-splash:not([style*="display: none"])');
        
        if (VOICE_CONFIG.debug) {
            console.log(`🐛 DEBUG: ElevenLabs blocking conditions check (SMART BUTTON BYPASSED):
                - Time since click mention: ${timeSinceClickMention}ms (block if < 3000ms)
                - Conversation mode: ${conversationMode} (block if 'speaking')
                - Thank you splash visible: ${!!thankYouSplashVisible}
                - Smart Button Check: PERMANENTLY BYPASSED ✅`);
        }
        
        // Apply exact ElevenLabs blocking logic
        if (timeSinceClickMention < 3000) {
            console.log('🚫 BLOCKED: Recent click mention detected (ElevenLabs logic)');
            return;
        }
        
        if (conversationMode === 'speaking') {
            console.log('🚫 BLOCKED: System still in speaking state (ElevenLabs logic)');
            return;
        }
        
        if (thankYouSplashVisible) {
            console.log('🚫 BLOCKED: Thank you splash currently visible (ElevenLabs logic)');
            return;
        }
        
        // Block if conversation ended (keep this check)
        if (conversationMode === 'ended' || conversationMode === 'splash_screen_active') {
            console.log('🚫 BLOCKED: Conversation ended');
            return;
        }
        
        // *** SMART BUTTON CHECK PERMANENTLY REMOVED ***
        // This was preventing banner triggers in your system
        
        // ============================================================
        // NO BLOCKS - TRIGGER BANNER (EXACT ELEVENLABS BEHAVIOR)
        // ============================================================
        if (VOICE_CONFIG.debug) {
            console.log('🐛 DEBUG: No blocking conditions - calling showHybridReadySequence() (Smart Button permanently bypassed)');
        }
        
        setTimeout(() => {
            if (typeof showHybridReadySequence === 'function') {
                try {
                    showHybridReadySequence();
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

// 🎯 KNOWLEDGE BASE SYSTEM INTEGRATION COMPLETE
console.log('🧠 Mobile-Wise AI Voice Chat - Knowledge Base Integration Complete!');
console.log('🎯 Conversation Modes: greeting -> name_collection -> qa_mode -> lead_capture');
console.log('🎤 Voice System: British Female with ElevenLabs Banner Logic');
console.log('📚 Knowledge Base: Ready for industry-specific Q&A');
console.log('🎬 Testimonials: Auto-trigger based on question type');