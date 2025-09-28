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
let lastAIResponse = '';
let userResponseCount = 0;
let shouldShowSmartButton = false;
let smartButtonText = 'AI Smart Button';
let smartButtonAction = 'default';
let restartTimeout = null;
let lastMessageWasApology = false;
let isInLeadCapture = false;
let leadData = null;

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

// ===================================================
// 📧 EMAILJS INITIALIZATION (FROM YOUR WORKING SYSTEM)
// ===================================================
(function(){
    if (typeof emailjs !== 'undefined') {
        emailjs.init("7-9oxa3UC3uKxtqGM"); // Your public key
        console.log("📧 EmailJS initialized successfully");
    } else {
        console.log("📧 EmailJS not loaded yet - will initialize when available");
        
        // Load EmailJS if not already loaded
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = () => {
            emailjs.init("7-9oxa3UC3uKxtqGM");
            console.log("📧 EmailJS loaded and initialized");
        };
        document.head.appendChild(script);
    }
})();

// ===================================================
// 📱 MOBILE DEVICE DETECTION
// ===================================================
function isMobileDevice() {
    // Force mobile detection for testing - remove this later
    return true;
    
    /* Original detection (keep this for later)
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
    */
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
// 🎵 INTRO JINGLE PLAYER
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

function getApologyResponse() {
    const sorryMessages = [
        "I'm sorry, I didn't catch that. Can you repeat your answer?",
        "Sorry, I didn't hear you. Please say that again.", 
        "I didn't get that. Could you repeat it?",
        "Let me try listening again. Please speak your answer now."
    ];
    
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
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    
    try {
        // 🎯 MOBILE-SPECIFIC PRE-WARMING
        const isMobile = isMobileDevice();
        
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

        // Keep your existing onerror and onend handlers exactly as they are
    recognition.onerror = function(event) {
    console.log('🔊 Speech error:', event.error);

    if (event.error === 'no-speech') {
        const transcriptText = document.getElementById('transcriptText');

        if (isMobileDevice()) {
            console.log('📱 Mobile: Using visual feedback system');

            // Clear any existing timeouts to prevent conflicts
            if (window.noSpeechTimeout) {
                clearTimeout(window.noSpeechTimeout);
            }

            // Show immediate visual feedback
            if (transcriptText) {
                transcriptText.textContent = 'I didn\'t hear anything...';
                transcriptText.style.color = '#ff6b6b';

                // Wait a moment, then reset to listening state
                window.noSpeechTimeout = setTimeout(() => {
                    if (transcriptText) {
                        transcriptText.textContent = 'Please speak now';
                        transcriptText.style.color = '#ffffff';
                    }

                    // Restart listening with hybrid system
                    if (isAudioMode && !isSpeaking) {
                        console.log('🔄 Mobile: Restarting via hybrid system');
                        isListening = false;

                        // Use the hybrid system instead of direct restart
                        setTimeout(() => {
                            showHybridReadySequence();
                        }, 800);
                    }
                }, 1500);
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
                }, 3000);
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
    console.log('🔚 Recognition ended');
    
    // DON'T clear the slot here - let the hybrid system manage it
    // (This was causing premature clearing)
    
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
            window.lastProcessedMessage = currentMessage;
            window.lastMessageTime = now;
            sendMessage();
        } else {
            console.log('🚫 Prevented duplicate message (within 3 seconds):', currentMessage);
            userInput.value = '';
        }
    } else {
        // No speech detected - restart with hybrid system
        if (isAudioMode && !isSpeaking && !lastMessageWasApology) {
            console.log('🔄 No speech detected via onend - restarting with hybrid system');
            
            // Clear listening state and restart properly
            isListening = false;
            
            // Use hybrid system for restart (not direct startListening)
            setTimeout(() => {
                if (!isSpeaking && isAudioMode) {
                    showHybridReadySequence();
                }
            }, 1000);
        }
    }
};
        
        // 🎯 MOBILE TIMING DELAY
        const delay = isMobile ? 800 : 0; // Only delay on mobile
        
        if (delay > 0) {
            console.log(`⏱️ Adding ${delay}ms mobile delay`);
        }

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
// 🔄 FORCE START LISTENING (BYPASSES GATE-KEEPER)
// ===================================================
function forceStartListening() {
    console.log('🔄 FORCE starting speech recognition (mobile reset)');
    
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    
    try {
        if (!recognition) {
            initializeSpeechRecognition();
        }
        
        console.log('🎤 Force starting speech recognition...');
        recognition.start();
        isListening = true;
        
       showSpeakNow();
        
        console.log('✅ Force speech recognition started successfully');
        
    } catch (error) {
        console.error('❌ Error force starting speech recognition:', error);
    }
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
    
    const greeting = "Hi there! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. Before we dive in, what's your first name?";
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
    
    // Default AI response handler
    setTimeout(() => {
        const responseText = getAIResponse(userText);
        lastAIResponse = responseText;

        console.log('🎯 USER SAID:', userText);
        console.log('🎯 AI RESPONSE:', responseText);
        
        addAIMessage(responseText);
        speakResponse(responseText);
        
        updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
        
        setTimeout(() => {
            window.lastProcessedMessage = null;
        }, 3000);
    }, 800);
}

// =================================================== 
// 🔊 MOBILE-WISE AI CUSTOM BEEP SYSTEM
// =================================================== 
function playGetReadyBeep() {
    // Soft "get ready" tone
    createBeep(440, 0.2, 0.3); // A note, 0.2 seconds, medium volume
}

function playListeningBeep() {
    // Professional "ready to listen" double-beep
    createBeep(660, 0.15, 0.4);
    setTimeout(() => createBeep(880, 0.15, 0.4), 200);
}

function createBeep(frequency, duration, volume) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

// ===================================================
// 🚀 ENHANCED HYBRID READY SEQUENCE WITH RESTART HANDLING
// ===================================================
function showHybridReadySequence() {
    // ✅ DON'T SHOW "Speak Now" if Smart Button is active
    if (typeof BannerOrchestrator !== 'undefined' && 
        BannerOrchestrator.currentBanner === 'smartButton') {
        console.log('🔇 HYBRID BLOCKED: Smart Button active');
        return;
    }
    
    // ✅ DON'T SHOW "Speak Now" if Thank You Splash Screen exists
    if (document.getElementById('thankYouSplash')) {
        console.log('🔇 HYBRID BLOCKED: Thank you splash screen active');
        return;
    }
    
    // ✅ DON'T SHOW "Speak Now" if conversation is ended
    if (conversationState === 'ended' || conversationState === 'splash_screen_active') {
        console.log('🔇 HYBRID BLOCKED: Conversation ended');
        return;
    }
    
    // ✅ NEW - DON'T SHOW "Speak Now" if Smart Button is visible on page
    if (document.querySelector('[onclick*="handleConsultationClick"]')) {
        console.log('🔇 HYBRID BLOCKED: Smart Button visible - user should click button');
        return;
    }
    
    console.log('🚀 Showing hybrid ready sequence');
    
    // CLEAR ANY EXISTING TIMEOUTS to prevent conflicts
    if (window.hybridTimeout) {
        clearTimeout(window.hybridTimeout);
        window.hybridTimeout = null;
    }
    
    // Clear any existing content first
    const speakNowSlot = document.getElementById('speakNowSlot');
    if (speakNowSlot) {
        speakNowSlot.innerHTML = '';
    } else {
        console.error('❌ speakNowSlot not found');
        return;
    }
    
    // CREATE the transcript element dynamically
    const transcriptElement = document.createElement('div');
    transcriptElement.id = 'liveTranscript';
    transcriptElement.innerHTML = '<div id="transcriptText">Get Ready to Speak</div>';
    
    // Style it with JavaScript
    transcriptElement.style.cssText = `
        width: 340px;
        height: 30px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(15px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 25px;
        color: white;
        font-weight: 600;
        font-size: 16px;
        text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px auto;
        cursor: pointer;
    `;
    
    // INSERT into the slot
    speakNowSlot.appendChild(transcriptElement);
    speakNowSlot.style.display = 'block';
    
    // PRE-WARM ENGINE
    preWarmSpeechEngine();
    
    // PHASE 2: Switch to "LISTENING" and start recognition
    window.hybridTimeout = setTimeout(() => {
        const transcriptText = document.getElementById('transcriptText');
        if (transcriptText) {
            transcriptText.textContent = 'Listening...';
            transcriptText.style.color = '#00ff88';
            transcriptText.style.textShadow = '0 0 15px rgba(0, 255, 136, 0.8)';
        }
        
        // AUTO-START listening - with proper restart handling
        if (!isListening && !isSpeaking && isAudioMode) {
            console.log('🎯 Hybrid system starting recognition');
            isListening = false; // Reset state first
            startListening();
        }
    }, 1000);
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

// ===================================================
// 🔊 VOICE SYNTHESIS SYSTEM
// ===================================================
function speakResponse(message) {
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    window.speechSynthesis.cancel();
    
    if (isMobileDevice()) {
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(message);
            
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.95;
            
            utterance.onstart = function() {
                isSpeaking = true;
                console.log('🔊 AI started speaking (mobile)');

                if (isMobileDevice()) {
                    const micButton = document.getElementById('micButton');
                    const liveTranscript = document.getElementById('liveTranscript');
                    if (micButton) micButton.classList.remove('listening');
                    if (liveTranscript) liveTranscript.style.display = 'none';
                }
            };
            
              utterance.onend = function() {
    isSpeaking = false;
    console.log('🔊 AI finished speaking (mobile)');
    
    // 🚫 DON'T TRIGGER "Speak Now" if Smart Button is specifically active
    if (typeof BannerOrchestrator !== 'undefined' && 
        BannerOrchestrator.currentBanner === 'smartButton') {
        console.log('🔇 SPEAK NOW BLOCKED: Smart Button active - no speech restart');
        return; // Don't call showHybridReadySequence()
    }
    
    // 🚫 DON'T TRIGGER "Speak Now" if Thank You Splash Screen exists
    if (document.getElementById('thankYouSplash')) {
        console.log('🔇 SPEAK NOW BLOCKED: Thank you splash screen active - no speech restart');
        return; // Don't call showHybridReadySequence()
    }
    
    // 🚫 DON'T TRIGGER "Speak Now" if conversation is specifically ended
    if (conversationState === 'ended' || conversationState === 'splash_screen_active') {
        console.log('🔇 SPEAK NOW BLOCKED: Conversation ended - no speech restart');
        return; // Don't call showHybridReadySequence()
    }
    // ✅ BACK TO SIMPLE - let showHybridReadySequence() handle the blocking
    showHybridReadySequence();
};
       
            
utterance.onerror = function(event) {
    console.log('❌ Speech error:', event.error);
    isSpeaking = false;
};

window.speechSynthesis.speak(utterance);
currentAudio = utterance;
}, 500);
} else {
    const utterance = new SpeechSynthesisUtterance(message);
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = function() {
        isSpeaking = true;
        console.log('🔊 AI started speaking');
    };
    
    utterance.onend = function() {
        isSpeaking = false;
        console.log('🔊 AI finished speaking');
        
        showHybridReadySequence();
    };
    
    utterance.onerror = function(event) {
        console.log('❌ Speech error:', event.error);
        isSpeaking = false;
    };
    
    window.speechSynthesis.speak(utterance);
    currentAudio = utterance;
}

function addUserMessage(message) {
    console.log('🎯 DEBUG: addUserMessage called with:', message);
    console.trace(); // This shows the call stack - WHO called this function
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = message;
    
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
}

}

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
        <div style="display: flex; align-items: center; height: 100%; padding: 0 20px;">
            <!-- LEFT: Mobile-Wise AI Logo -->
            <div style="position: absolute; left: 30px; top: 17;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758507868460_logo.png" 
                     style="width: 65px; height: 65px;">
            </div>
            
            <!-- COMPANY NAME: Controllable positioning -->
            <div style="position: absolute; left: 85px; top: 45px;">
                <div style="color: white; font-size: 14px; font-weight: bold; letter-spacing: 1.5px;">
                    Mobile-Wise AI
                </div>
            </div>
            
            <!-- RIGHT: SLOGAN -->
            <div style="position: absolute; right: 40px; top: 5px;">
                <div style="color: #87CEEB; font-size: 14px; font-weight: 600; text-transform: uppercase;">
                   &check; SMART  <br> &check; HELPFUL <br> &check; AI VOICE CHAT
                </div>
            </div>
        </div>
    `,
    background: 'transparent',
    duration: 0
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
smartButton: {
    content: `
        <div style="width: ${742}px; max-width: ${742}px; margin: 0 auto; height: 58px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; border-radius: 6px; background: rgba(255, 255, 255, 0.1);">
            <div style="color: white; font-weight: 600; font-size: 16px;">
                📅 FREE Consultation Available
            </div>
            <button onclick="handleConsultationClick('valuation')" style="
                background: rgba(34, 197, 94, 0.3);
                color: white;
                border: 1px solid rgba(34, 197, 94, 0.5);
                padding: 8px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                transition: all 0.3s ease;
                pointer-events: auto !important;
            " onmouseover="this.style.background='rgba(34, 197, 94, 0.5)'" 
               onmouseout="this.style.background='rgba(34, 197, 94, 0.3)'">
                CLICK NOW
            </button>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 752, // 🚀 WHITE LAYER WIDTH CONTROL
    customHeight: 65, // 🚀 WHITE LAYER HEIGHT CONTROL
    duration: 0
},

// 3. EMAIL SENT CONFIRMATION (Already standardized - keeping as reference)
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

// 4. FREE BOOK OFFER 1
freeBookSimple: {
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
        <div style="width: 742px; max-width: 742px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #0f5ef0ff, #000000ff); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            
            <!-- LEFT: Book Image -->
            <div style="display: flex; align-items: center;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758088515492_nci-book.png" 
                     style="width: 60px; height: 70px; border-radius: 8px; margin-right: 15px; box-shadow: 0 0px 0px rgba(0,0,0,0.3);">
                
                <!-- Book Info -->
                <div style="color: white; text-align: left;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                        📚 FREE Consultation
                    </div>
                    <div style="font-size: 13px; color: #fff; opacity: 0.95;">
                        "7 Secrets to Selling Your Practice" Book Included
                    </div>
                </div>
            </div>
        </div>
    `,
    background: 'rgba(255, 255, 255, 0.15)',
    containerWidth: 762,
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

// 6. CLICK-TO-CALL BANNER
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

// 7. MORE QUESTIONS BANNER
moreQuestions: {
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
function getAIResponse(userInput) {

 // ✅ STOP PROCESSING IF CONVERSATION IS ENDED
    if (conversationState === 'ended') {
        return "Thank you for visiting! Have a great day.";
    }
    
const userText = userInput.toLowerCase();
let responseText = '';
let firstName = leadData.firstName || ''; // Store first name from lead capture

if (conversationState === 'initial') {
    // 🎯 FIRST NAME CAPTURE - Always ask for name first unless they jump straight to business
    if (!leadData.firstName && !userText.includes('buy') && !userText.includes('sell') && !userText.includes('value') && !userText.includes('purchase') && !userText.includes('acquire')) {
        responseText = "Hi there! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. Before we dive in, what's your first name?";
        conversationState = 'getting_first_name';
        return responseText;
    }
    
    if (userText.includes('buy') || userText.includes('purchase') || userText.includes('buying') || userText.includes('acquire')) {
        responseText = firstName ? 
            `Excellent, ${firstName}! Bruce has some fantastic opportunities available right now - some exclusive off-market deals that would blow you away. Tell me, what's your budget range for acquiring a practice?` :
            "Excellent! Bruce has some fantastic opportunities available - some exclusive off-market deals that would blow you away. What's your budget range for acquiring a practice?";
        conversationState = 'buying_budget_question';
        shouldShowSmartButton = false;
        
    } else if (userText.includes('sell') || userText.includes('selling')) {
        responseText = firstName ? 
            `${firstName}, I'd love to help you with selling your practice! That's a huge decision - you've probably poured your heart and soul into building something special there. Tell me, how many clients are you currently serving?` :
            "I'd love to help you with selling your practice! That's a big decision - you've probably built something really special. How many clients are you currently serving?";
        conversationState = 'selling_size_question';
        shouldShowSmartButton = false;
        
    } else if (userText.includes('value') || userText.includes('worth') || userText.includes('valuation') || userText.includes('evaluate')) {
        responseText = firstName ?
            `${firstName}, I'd be happy to help with a practice valuation! You know, most practice owners are shocked when they find out what their practice is actually worth in today's market. To give you the most accurate assessment, what's your practice's approximate annual revenue?` :
            "I'd be happy to help with a practice valuation! Most owners are surprised at what their practice is worth. What's your practice's approximate annual revenue?";
        conversationState = 'valuation_revenue_question';
        shouldShowSmartButton = false;
        
    } else {
        responseText = firstName ?
            `${firstName}, I'm here to help with CPA firm transactions - buying, selling, and practice valuations. Bruce has been doing this for years and has some incredible opportunities right now. What brings you here today?` :
            "Hi there! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. Bruce has been doing this for years and has some incredible opportunities right now. What brings you here today?";
    }

} else if (conversationState === 'getting_first_name') {
    // 🎯 EXTRACT AND STORE FIRST NAME
    const words = userInput.trim().split(' ');
    const extractedName = words[0].replace(/[^a-zA-Z]/g, ''); // Remove any punctuation
    if (extractedName.length > 0) {
        leadData.firstName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
        firstName = leadData.firstName;
        
        responseText = `Great to meet you, ${firstName}! Now, what brings you here today - are you looking to buy a practice, sell your practice, or get a practice valuation?`;
        conversationState = 'initial';
    } else {
        responseText = "I didn't catch your name. Could you tell me your first name?";
    }
    
} else if (conversationState === 'selling_size_question') {
    const clientCount = userText.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    const number = clientCount ? clientCount[0] : 'that many';
    
    responseText = firstName ?
        `Wow, ${firstName}! ${number} clients - that's fantastic! You've clearly built something substantial there. I bet Bruce would be really excited to hear about your practice. With that kind of client base, you're probably generating some solid revenue too. What's your approximate annual revenue range?` :
        `Wow! ${number} clients - that's impressive! You've built something substantial. With that client base, what's your approximate annual revenue range?`;
    conversationState = 'selling_revenue_question';
    
} else if (conversationState === 'selling_revenue_question') {
    const revenueMatch = userText.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    const revenue = revenueMatch ? revenueMatch[0] : 'that kind of revenue';
    
    responseText = firstName ?
        `That's excellent, ${firstName}! ${revenue} in revenue - you've definitely built a valuable practice there. Bruce is going to love working with you on this. Now, I'm curious - what's driving your decision to sell? Is it retirement, new opportunities, or maybe you're just ready for the next chapter? Understanding your motivation helps Bruce create the perfect exit strategy for you.` :
        `Excellent! ${revenue} in revenue - that's a solid practice! What's driving your decision to sell? Retirement, new opportunities, or something else? This helps Bruce tailor the perfect approach.`;
    conversationState = 'selling_motivation_question';
    
} else if (conversationState === 'selling_motivation_question') {
    responseText = firstName ?
        `Thank you for sharing that with me, ${firstName}! You know what? Based on everything you've told me - your client base, revenue, and your goals - Bruce can definitely help you get top dollar for your practice. The market is absolutely on fire right now for practices like yours. Honestly, ${firstName}, this could be perfect timing for you. Would you like to schedule a FREE consultation with Bruce to discuss your selling strategy?` :
        "Thank you for sharing that! Based on what you've told me, Bruce can definitely help you maximize your practice value. The market is incredibly strong right now. Would you like a FREE consultation with Bruce?";
    conversationState = 'asking_selling_consultation';
    
} else if (conversationState === 'asking_selling_consultation') {
    if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
        responseText = firstName ?
            `Fantastic, ${firstName}! I'm so excited for you - Bruce is going to have some great ideas for maximizing your practice value. Just click the button above and we'll get your information over to Bruce immediately. He'll reach out within 24 hours with your FREE practice valuation and selling strategy. This is going to be great!` :
            "Fantastic! Bruce is going to be excited to work with you. Click the button above and he'll reach out within 24 hours for your FREE practice valuation!";
        shouldShowSmartButton = true;
        smartButtonText = '📞 Free Valuation';
        smartButtonAction = 'valuation';
        conversationState = 'button_activated_selling';
        
        // 🎯 TRIGGER: Consultation banner for selling
        triggerBanner('consultation_offer', { type: 'selling' });
        
    } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
        responseText = firstName ?
            `No problem at all, ${firstName}! I totally understand - selling a practice is a big decision and you want to think it through. The offer stands whenever you're ready. Is there anything else about selling your practice that you'd like to know?` :
            "No problem! It's a big decision. The offer stands whenever you're ready. Anything else about selling you'd like to know?";
        conversationState = 'initial';
        
        // 🎯 TRIGGER: Free offer banner when consultation declined
        triggerBanner('free_offer');
        
    } else {
        responseText = firstName ?
            `${firstName}, I want to make sure I understand - would you like Bruce to call you for a free consultation about selling your practice? Just say yes or no and I'll take care of everything.` :
            "Just to clarify - would you like Bruce to call you for a free consultation? Yes or no?";
    }
    
} else if (conversationState === 'buying_budget_question') {
    const budgetMatch = userText.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    const budget = budgetMatch ? budgetMatch[0] : 'that range';
    
    responseText = firstName ?
        `Great, ${firstName}! ${budget} - that opens up some really nice opportunities. Bruce has several practices in that range right now. Are you specifically looking for a CPA practice, or would a general accounting practice work for you as well?` :
        `Great! ${budget} opens up some excellent opportunities. Are you looking specifically for a CPA practice, or would accounting work too?`;
    conversationState = 'buying_type_question';
    
} else if (conversationState === 'buying_type_question') {
    responseText = firstName ?
        `Perfect, ${firstName}! That gives Bruce more options to work with. Now, here's an important question - how soon are you looking to complete a purchase? Bruce has some deals that are moving really fast, so timing matters.` :
        "Perfect! That gives us more options. How soon are you looking to complete a purchase? Some opportunities move quickly.";
    conversationState = 'buying_timeline_question';
    
} else if (conversationState === 'buying_timeline_question') {
    responseText = firstName ?
        `Excellent, ${firstName}! You know what's exciting? Bruce has exclusive off-market opportunities that aren't advertised anywhere else - practices that you literally can't find online. Based on your budget and timeline, he definitely has some practices that would be perfect for you. Would you like Bruce to show you the available practices that match exactly what you're looking for?` :
        "Excellent! Bruce has exclusive off-market opportunities you can't find anywhere else. Based on your criteria, he has practices that would be perfect. Want to see them?";
    conversationState = 'asking_buying_consultation';
    
} else if (conversationState === 'asking_buying_consultation') {
    if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
        responseText = firstName ?
            `Outstanding, ${firstName}! I'm really excited for you - Bruce has some incredible opportunities that I think you're going to love. Click the button above and Bruce will reach out with current practices that match your criteria perfectly. Fair warning though - many of these deals move fast, so don't wait too long!` :
            "Outstanding! Bruce has incredible opportunities you'll love. Click above and he'll reach out with matching practices. These deals move fast!";
        shouldShowSmartButton = true;
        smartButtonText = '🏢 View Available Practices';
        smartButtonAction = 'buying';
        conversationState = 'button_activated_buying';
        
        // 🎯 TRIGGER: Consultation banner for buying
        triggerBanner('consultation_offer', { type: 'buying' });
        
    } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
        responseText = firstName ?
            `That's perfectly fine, ${firstName}! When you're ready to see what's available, just let me know. These opportunities don't stay on the market long, but I understand you want to think it through. Anything else about buying a practice I can help with?` :
            "That's fine! When ready, let me know. These opportunities move quickly. Anything else about buying I can help with?";
        conversationState = 'initial';
        
        // 🎯 TRIGGER: Free offer banner when consultation declined
        triggerBanner('free_offer');
        
    } else {
        responseText = firstName ?
            `${firstName}, would you like Bruce to show you the practices he has available that match your criteria? Just let me know yes or no.` :
            "Would you like Bruce to show you available practices? Yes or no?";
    }
    
} else if (conversationState === 'valuation_revenue_question') {
    const revenueMatch = userText.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
    const revenue = revenueMatch ? revenueMatch[0] : 'that revenue level';
    
    responseText = firstName ?
        `Thank you, ${firstName}! ${revenue} in revenue - that's solid! Now, how many years have you been in practice? The longevity and stability really impact the valuation, and I have a feeling your practice is worth more than you think.` :
        `Thank you! ${revenue} - that's solid! How many years have you been in practice? Longevity really impacts valuation.`;
    conversationState = 'valuation_years_question';
    
} else if (conversationState === 'valuation_years_question') {
    const yearsMatch = userText.match(/(\d+)/);
    const years = yearsMatch ? yearsMatch[0] : 'that many';
    
    responseText = firstName ?
        `Perfect, ${firstName}! ${years} years - your practice sounds incredibly well-established. You know what? Bruce can provide you with a comprehensive FREE valuation that shows you exactly what your practice is worth in today's red-hot market. I think you might be pleasantly surprised by the number. Would you like to schedule that free valuation consultation with Bruce?` :
        `Perfect! ${years} years - well-established! Bruce can provide a comprehensive FREE valuation. You might be surprised at the value. Want to schedule it?`;
    conversationState = 'asking_valuation_consultation';
    
} else if (conversationState === 'asking_valuation_consultation') {
    if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
        responseText = firstName ?
            `Wonderful, ${firstName}! I'm so excited for you to see what your practice is actually worth. Click the button above and we'll get you connected with Bruce for your FREE practice valuation. Honestly, ${firstName}, you might be shocked at what your practice is worth in today's market!` :
            "Wonderful! Click above for your FREE valuation with Bruce. You might be shocked at what your practice is worth!";
        shouldShowSmartButton = true;
        smartButtonText = '📈 Get Practice Valuation';
        smartButtonAction = 'valuation';
        conversationState = 'button_activated_valuation';
        
        // 🎯 TRIGGER: Consultation banner for valuation
        triggerBanner('consultation_offer', { type: 'valuation' });
        
    } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
        responseText = firstName ?
            `No worries, ${firstName}! The valuation offer stands whenever you're ready - Bruce isn't going anywhere. Is there anything else about practice valuations I can explain for you?` :
            "No worries! The offer stands whenever you're ready. Anything else about valuations I can explain?";
        conversationState = 'initial';
        
        // 🎯 TRIGGER: Free offer banner when consultation declined
        triggerBanner('free_offer');
        
    } else {
        responseText = firstName ?
            `${firstName}, would you like Bruce to provide you with a free practice valuation? Just say yes or no and I'll take care of the rest.` :
            "Would you like Bruce to provide a free valuation? Yes or no?";
    }
    
} else if (conversationState === 'button_activated_selling' || conversationState === 'button_activated_buying' || conversationState === 'button_activated_valuation') {
    responseText = firstName ?
        `Perfect, ${firstName}! I can see you're ready to connect with Bruce. Just click that button above and we'll get everything set up for you right away!` :
        "Perfect! Ready to connect with Bruce? Click that button above!";

} else if (conversationState === 'asking_if_more_help') {
    if (userText.includes('no') || userText.includes('nothing') || userText.includes('done') || 
        userText.includes('that\'s all') || userText.includes('nope') || userText.includes('thanks')) {
        
        responseText = firstName ?
            `Thank you so much for visiting, ${firstName}! It's been great talking with you. Have a wonderful day! 🌟` :
            "Thank you so much for visiting! Have a wonderful day! 🌟";
        conversationState = 'ended';
        
        // 🎯 TRIGGER: Thank you banner when conversation ends
        triggerBanner('more_questions');
        
    } else {
        conversationState = 'initial';
        responseText = firstName ?
            `Absolutely, ${firstName}! What else would you like to know about buying, selling, or valuing a CPA practice?` :
            "Absolutely! What else about buying, selling, or valuing practices?";
    }
    
} else if (conversationState === 'asking_anything_else') {
    if (userText.includes('yes') || userText.includes('sure') || userText.includes('help')) {
        responseText = firstName ?
            `I'm here to help, ${firstName}! What else can I assist you with regarding your practice?` :
            "I'm here to help! What else about your practice?";
        conversationState = 'initial';
    } else {
        conversationState = 'asking_if_more_help';
        responseText = firstName ?
            `Perfect, ${firstName}! Is there anything else I can help you with today?` :
            "Perfect! Anything else I can help with today?";
    }
    
} else {
    if (conversationState !== 'ended') {
        responseText = firstName ?
            `Thanks for your message, ${firstName}! Is there anything else about buying, selling, or valuing a CPA practice that I can help you with?` :
            "Thanks! Anything else about buying, selling, or valuing practices?";
        conversationState = 'initial';
        shouldShowSmartButton = false;
    } else {
        responseText = firstName ?
            `Thank you for visiting, ${firstName}! Have a great day.` :
            "Thank you for visiting! Have a great day.";
    }
}

// 🎯 EMAIL FOLLOW-UP HANDLER CHECK
if (window.emailFollowUpHandler && window.emailFollowUpHandler(userInput)) {
    return; // Handler took care of it
}

return responseText;
}

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
                }, 800);
            }
        };
        
        window.speechSynthesis.speak(utterance);
    }
}



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
    // Redo - LIGHTER cleanup approach
    console.log('🔄 Redo - clearing field and restarting speak sequence');
    
    // ✅ KEEP the main fix - remove wrong answer FIRST
    removeLastUserMessage();
    
    // ✅ KEEP basic cleanup
    leadData.tempAnswer = '';
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = '';
    }
    
    // ❌ REMOVE the aggressive cleanupSpeakSequence() 
    // ❌ This might be over-cleaning and interfering with normal flow
    
    // ✅ KEEP the restart but maybe shorter timeout
    setTimeout(() => {
        showHybridReadySequence(); // Restart the full red -> green sequence
    }, 50); // Reduced from 100ms - less aggressive
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
                    }, 4000); // Slightly longer to account for longer message
                }, 1000);
                
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
                }, 3000);
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

// NEW FUNCTION: Ask quick question (from buttons)
function askQuickQuestion(question) {
    addUserMessage(question);
    processUserResponse(question);
}

// Global flag to prevent multiple instances
let speakSequenceActive = false;
let speakSequenceButton = null;
let speakSequenceCleanupTimer = null;

function showHybridReadySequence() {
    // Prevent multiple instances running
    if (speakSequenceActive) {
        console.log('🛑 Speak sequence already active, ignoring duplicate call');
        return;
    }
    
    console.log('🎬 Starting speak sequence...');
    speakSequenceActive = true;
    
    // 🎯 DETECT CONTACT INTERVIEW MODE
    const isContactInterview = checkContactInterviewMode();
    console.log('📧 Contact interview mode:', isContactInterview);
    
    // Find the quick buttons container
    const quickButtonsContainer = document.querySelector('.quick-questions') || 
                                  document.querySelector('.quick-buttons') || 
                                  document.getElementById('quickButtonsContainer');
    
    if (!quickButtonsContainer) {
        console.log('❌ Quick buttons container not found');
        speakSequenceActive = false;
        return;
    }
    
    // Hide existing quick buttons
    const existingButtons = quickButtonsContainer.querySelectorAll('.quick-btn');
    existingButtons.forEach(btn => btn.style.display = 'none');
    
    // Remove any existing speak button
    const existingSpeakBtn = document.getElementById('speak-sequence-button');
    if (existingSpeakBtn) {
        existingSpeakBtn.remove();
    }
    
    // Add styles ONCE
    if (!document.getElementById('speak-sequence-styles')) {
        const style = document.createElement('style');
        style.id = 'speak-sequence-styles';
        style.textContent = `
            .red-dot-blink {
                animation: redDotBlink 0.8s infinite;
            }
            @keyframes redDotBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.2; }
            }
            
            .green-dot-blink {
                animation: greenDotBlink 0.8s infinite;
            }
            @keyframes greenDotBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.2; }
            }
            
            .green-button-glow {
                animation: greenGlow 1.5s infinite !important;
            }
            @keyframes greenGlow {
                0%, 100% { 
                    background: rgba(34, 197, 94, 0.4) !important;
                    border-color: rgba(34, 197, 94, 0.8) !important;
                    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6) !important;
                }
                50% { 
                    background: rgba(34, 197, 94, 0.6) !important;
                    border-color: rgba(34, 197, 94, 1) !important;
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.9) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 🚀 IMMEDIATE BUTTON CREATION
    speakSequenceButton = document.createElement('button');
    speakSequenceButton.id = 'speak-sequence-button';
    speakSequenceButton.className = 'quick-btn';
    
    // STAGE 1: Red "Get Ready to Speak" - APPEARS IMMEDIATELY
    speakSequenceButton.innerHTML = '<span class="red-dot-blink">🔴</span> Get Ready to Speak';
    speakSequenceButton.style.cssText = `
        width: 100% !important;
        background: rgba(255, 68, 68, 0.4) !important;
        color: #ffffff !important;
        border: 2px solid rgba(255, 68, 68, 0.8) !important;
        padding: 15px !important;
        min-height: 45px !important;
        font-weight: bold !important;
        border-radius: 20px !important;
    `;
    
    // 🚀 ADD TO DOM IMMEDIATELY
    quickButtonsContainer.appendChild(speakSequenceButton);
    console.log('🔴 Red stage active IMMEDIATELY');
    
    // START LISTENING DURING RED STAGE
    setTimeout(() => {
        console.log('🎤 Starting listening during RED stage...');
        if (isContactInterview) {
            startContactInterviewListening();
        } else {
            startNormalInterviewListening();
        }
    }, 800);
    
    // AI speaking detection
    let speechWatcher = setInterval(() => {
        if (typeof isSpeaking !== 'undefined' && isSpeaking && speakSequenceActive) {
            console.log('🔊 AI started speaking - auto-cleaning up speak sequence');
            clearInterval(speechWatcher);
            cleanupSpeakSequence();
        }
    }, 100);
    
    // STAGE 2: After 1.5 seconds, switch to green
    const greenTransition = setTimeout(() => {
        if (speakSequenceButton && speakSequenceActive) {
            console.log('🟢 Switching to green stage (listening already active)');
            
            speakSequenceButton.innerHTML = '<span class="green-dot-blink">🟢</span> Speak Now';
            speakSequenceButton.style.cssText = `
                width: 100% !important;
                background: rgba(34, 197, 94, 0.4) !important;
                color: #ffffff !important;
                border: 2px solid rgba(34, 197, 94, 0.8) !important;
                padding: 15px !important;
                min-height: 45px !important;
                font-weight: bold !important;
                border-radius: 20px !important;
            `;
            speakSequenceButton.className = 'quick-btn green-button-glow';
            
            console.log('✅ Visual changed to green - listening was already started');
        }
    }, 1500);
    
    // Extended cleanup timer 
    speakSequenceCleanupTimer = setTimeout(() => {
        console.log('⏰ Extended listening time reached - cleaning up');
        if (speechWatcher) clearInterval(speechWatcher);
        cleanupSpeakSequence();
    }, 25000);
}

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
    console.log('🧹 Cleaning up speak sequence');
    speakSequenceActive = false;
    
    if (speakSequenceCleanupTimer) {
        clearTimeout(speakSequenceCleanupTimer);
        speakSequenceCleanupTimer = null;
    }
    
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
