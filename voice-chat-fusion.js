// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATION
// Smart Button + Lead Capture + EmailJS + Banner System
// ===================================================

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
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
                
                if (isMobile) {
                    console.log('📱 Mobile: Using visual apology + pre-warm restart');
                    
                    if (transcriptText) {
                        const originalText = transcriptText.textContent;
                        transcriptText.textContent = 'Please speak again...';
                        
                        setTimeout(() => {
                            if (transcriptText) {
                               showHybridReadySequence();
                            }
                            
                            if (isAudioMode && !isSpeaking) {
                                console.log('🔄 Mobile: Pre-warmed restart');
                                isListening = false;
                                
                                setTimeout(() => {
                                    startListening(); // Will use pre-warmed engine
                                }, 500);
                            }
                        }, 2000);
                    }
                    
                } else {
                    console.log('🖥️ Desktop: Using voice apology');
                    
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
            }
        };

       recognition.onend = function() {
    // Keep your existing onend logic - it's perfect
    hideSpeakNow();
    
    // CLEAR THE SLOT when recognition ends - this is what we're adding!
    const speakNowSlot = document.getElementById('speakNowSlot');
    if (speakNowSlot) {
        speakNowSlot.innerHTML = ''; // This just empties the slot content
    }
    
    console.log('🔚 Recognition ended');
    
    const userInput = document.getElementById('userInput');
    
    if (userInput && userInput.value.trim().length > 0) {
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
        if (isAudioMode && !isSpeaking && isListening && !lastMessageWasApology) {
            console.log('🔄 No speech detected via onend - restarting');
            setTimeout(() => {
                try {
                    if (recognition) {
                        startListening();
                    }
                } catch (error) {
                    console.log('Restart error:', error);
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
        
        setTimeout(() => {
            console.log('🎤 Starting speech recognition...');
            recognition.start();
            isListening = true;
            
            showSpeakNow();
            console.log('✅ Speech recognition started successfully');
        }, delay);

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
                const greeting = "Hi! I'm Bruce's assistant. How can I help you?";
                addAIMessage(greeting);
                speakResponse(greeting);
            }, 1300);

        } else {
            throw new Error('Microphone permission denied');
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
                showThankYouBanner(); // Final goodbye banner
                conversationState = 'ended';
                stopListening();
                window.lastProcessedMessage = null;
            }, 2000);
            
            return;
        }
        
        // If unclear, ask again
        addAIMessage("Is there anything else I can help you with today?");
        speakResponse("Is there anything else I can help you with today?");
        setTimeout(() => {
            startListening();
            window.lastProcessedMessage = null;
        }, 1000);
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
// 🚀 MOBILE-WISE AI HYBRID READY SEQUENCE - SLOT VERSION
// ===================================================
function showHybridReadySequence() {
    console.log('🚀 Showing instant speech ready UI');
    
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
    
    // ADD CLICK HANDLER - This is what was missing!
    transcriptElement.addEventListener('click', function() {
        if (!isListening) {
            startListening();
            const transcriptText = document.getElementById('transcriptText');
            if (transcriptText) {
                transcriptText.textContent = 'Listening...';
                transcriptText.style.color = '#ff4444';
                transcriptText.style.textShadow = '0 0 15px rgba(255, 68, 68, 0.8)';
            }
        }
    });
    
    // INSERT into the slot inside the container
    const speakNowSlot = document.getElementById('speakNowSlot');
    if (speakNowSlot) {
        speakNowSlot.innerHTML = ''; // Clear any existing content
        speakNowSlot.appendChild(transcriptElement);
        speakNowSlot.style.display = 'block'; // Show the slot
        console.log('✅ Transcript element added to container slot');
    } else {
        console.error('❌ speakNowSlot not found');
        return;
    }
    
    // PRE-WARM ENGINE
    preWarmSpeechEngine();
    
    // PHASE 2: Switch to "Speak Now" after engine is warm
    setTimeout(() => {
        const transcriptText = document.getElementById('transcriptText');
        if (transcriptText) {
            transcriptText.textContent = '🎤 Speak Now';
            transcriptText.style.color = '#00ff88';
            transcriptText.style.textShadow = '0 0 15px rgba(0, 255, 136, 0.8)';
            
            transcriptElement.style.border = '2px solid rgba(0, 255, 136, 0.5)';
            transcriptElement.style.boxShadow = '0 0 25px rgba(0, 255, 136, 0.6)';
            
            console.log('✅ Ready for user to click and speak');
        }
    }, 800);
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
// 🎯 MOBILE-WISE AI UNIVERSAL BANNER ENGINE - COMPLETE ARSENAL
// ===================================================================
window.showUniversalBanner = function(bannerType, customContent = null, options = {}) {
    console.log(`🎯 Deploying Universal Banner: ${bannerType}`);
    
    // COMPLETE BANNER LIBRARY - All 7 Banner Types
    const bannerLibrary = {
        // 1. BRANDING HEADER
        branding: {
            content: `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px;">
                    <div style="display: flex; align-items: center;">
                        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758507868460_logo.png" 
                             style="width: 50px; height: 50px; margin-right: 10px;">
                        <span style="color: white; font-size: 16px; font-weight: bold;">Mobile-Wise AI</span>
                    </div>
                    <div>
                        <span style="color: #87CEEB; font-size: 14px; font-weight: 600;">AI VOICE CHAT</span>
                    </div>
                </div>
            `,
            background: 'rgba(255, 255, 255, 0.1)',
            duration: 0
        },
        
        // 2. SMART BUTTON (Free Consultation)
        smartButton: {
            content: `
                <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: white;">
                        🎯 FREE Consultation Available
                    </div>
                    <button onclick="startConsultationProcess()" style="
                        background: var(--cta-gradient);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 16px;
                        animation: pulse-attention 1.5s infinite;
                        box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
                    ">
                        Get Started Now
                    </button>
                </div>
            `,
            background: 'var(--cta-gradient)',
            duration: 0
        },
        
        // 3. EMAIL SENT CONFIRMATION
        emailSent: {
            content: `
                <div style="text-align: center; padding: 15px; color: white;">
                    <div style="font-size: 16px; font-weight: bold;">
                        ✅ <strong>Confirmation Email Sent!</strong>
                    </div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">
                        Please check your email for the book link
                    </div>
                </div>
            `,
            background: 'rgba(76, 175, 80, 0.2)',
            duration: 4000
        },
        
        // 4. FREE BOOK OFFER
        freeBook: {
            content: `
                <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 16px; font-weight: bold; color: white; margin-bottom: 10px;">
                        📚 FREE Book for You!
                    </div>
                    <div style="font-size: 14px; color: #ccc; margin-bottom: 10px;">
                        "7 Secrets to Selling Your Practice"
                    </div>
                    <button onclick="requestFreeBook()" style="
                        background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-weight: bold;
                    ">
                        Get Free Book
                    </button>
                </div>
            `,
            background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
            duration: 0
        },
        
        // 5. CONSULTATION CONFIRMED
        consultationConfirmed: {
            content: `
                <div style="text-align: center; padding: 15px; color: white;">
                    <div style="font-size: 16px; font-weight: bold;">
                        🎉 Consultation Confirmed!
                    </div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">
                        Bruce will reach out within 24 hours for your FREE practice valuation
                    </div>
                </div>
            `,
            background: 'rgba(33, 150, 243, 0.2)',
            duration: 5000
        },
        
        // 6. CLICK-TO-CALL BANNER
        clickToCall: {
            content: `
                <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 16px; font-weight: bold; color: white; margin-bottom: 10px;">
                        📞 Talk to Bruce Now
                    </div>
                    <button onclick="callBruce()" style="
                        background: linear-gradient(135deg, #4CAF50, #8BC34A);
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-weight: bold;
                        animation: pulse-attention 2s infinite;
                    ">
                        📞 Call Now
                    </button>
                </div>
            `,
            background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
            duration: 0
        },
        
        // 7. LEAD CAPTURE ACTIVE
        leadCapture: {
            content: `
                <div style="text-align: center; padding: 15px; color: white;">
                    <div style="font-size: 16px; font-weight: bold;">
                        📋 Collecting Your Information...
                    </div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">
                        Please provide your details for the consultation
                    </div>
                </div>
            `,
            background: 'rgba(255, 193, 7, 0.2)',
            duration: 0
        }
    };
    
    // Remove existing banner
    const existing = document.getElementById('universalBanner');
    if (existing) existing.remove();
    
    // Get banner config
    const bannerConfig = bannerLibrary[bannerType];
    if (!bannerConfig && !customContent) {
        console.error(`❌ Banner type "${bannerType}" not found in library`);
        return null;
    }
    
    // Find container
    const container = document.querySelector('.container') || 
                     document.querySelector('.chat-container') || 
                     document.querySelector('#chatContainer') ||
                     document.body;
    
    // Create banner
    const banner = document.createElement('div');
    banner.id = 'universalBanner';
    banner.className = `universal-banner ${bannerType}-banner`;
    banner.innerHTML = customContent || bannerConfig.content;
    
    // Apply styling
    banner.style.cssText = `
        position: absolute !important;
        top: 10px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 9999 !important;
        width: calc(100% - 20px) !important;
        max-width: 400px !important;
        background: ${bannerConfig?.background || 'rgba(255, 255, 255, 0.1)'};
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        margin: 0 !important;
        box-sizing: border-box !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    
    // Deploy banner
    container.insertBefore(banner, container.firstChild);
    
    // Auto-remove if duration set
    const duration = options.duration || bannerConfig?.duration;
    if (duration && duration > 0) {
        setTimeout(() => {
            const bannerToRemove = document.getElementById('universalBanner');
            if (bannerToRemove) bannerToRemove.remove();
        }, duration);
    }
    
    console.log(`✅ Universal Banner "${bannerType}" deployed successfully`);
    return banner;
};

// Universal Banner Removal
window.removeAllBanners = function() {
    const existingBanner = document.getElementById('universalBanner');
    if (existingBanner) {
        existingBanner.remove();
        console.log('🗑️ Banner removed');
    }
};

// Enhanced removeLeadCaptureBanner for compatibility
window.removeLeadCaptureBanner = function() {
    removeAllBanners();
    console.log('🎯 Lead capture banner removal (Universal system)');
};

console.log('🎖️ Complete Universal Banner Engine loaded - 7 banner types ready!');

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
    
    if (conversationState === 'initial') {
        if (userText.includes('buy') || userText.includes('purchase') || userText.includes('buying') || userText.includes('acquire')) {
            responseText = "Excellent! Bruce has some fantastic opportunities available. Let me learn more about what you're looking for. What's your budget range for acquiring a practice?";
            conversationState = 'buying_budget_question';
            shouldShowSmartButton = false;
            
        } else if (userText.includes('sell') || userText.includes('selling')) {
            responseText = "I'd love to help you with selling your practice! Let me ask you a few quick questions to better understand your situation - how many clients do you currently serve?";
            conversationState = 'selling_size_question';
            shouldShowSmartButton = false;
            
        } else if (userText.includes('value') || userText.includes('worth') || userText.includes('valuation') || userText.includes('evaluate')) {
            responseText = "I'd be happy to help with a practice valuation! To give you the most accurate assessment, what's your practice's approximate annual revenue?";
            conversationState = 'valuation_revenue_question';
            shouldShowSmartButton = false;
            
        } else {
            responseText = "Welcome! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. What brings you here today?";
        }
        
    } else if (conversationState === 'selling_size_question') {
        responseText = "That's helpful information! And what's your practice's approximate annual revenue range? This helps Bruce understand the scope and value.";
        conversationState = 'selling_revenue_question';
        
    } else if (conversationState === 'selling_revenue_question') {
        responseText = "Perfect! One more question - what's driving your decision to sell? Retirement, new opportunities, or something else? Understanding your motivation helps Bruce tailor the best approach.";
        conversationState = 'selling_motivation_question';
        
    } else if (conversationState === 'selling_motivation_question') {
        responseText = "Thank you for sharing that with me! Based on what you've told me, Bruce can definitely help you get maximum value for your practice. The market is very strong right now. Would you like to schedule a FREE consultation with Bruce to discuss your selling strategy?";
        conversationState = 'asking_selling_consultation';
        
    } else if (conversationState === 'asking_selling_consultation') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
            responseText = "Fantastic! Please click the button above and we'll get your information over to Bruce immediately. He'll reach out within 24 hours for your FREE practice valuation.";
            shouldShowSmartButton = true;
            smartButtonText = '📞 Free Valuation';
            smartButtonAction = 'valuation';
            conversationState = 'button_activated_selling';
        } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
            responseText = "No problem at all! If you change your mind, I'm here to help. Is there anything else about selling your practice that you'd like to know?";
            conversationState = 'initial';
        } else {
            responseText = "I want to make sure I understand - would you like Bruce to call you for a free consultation about selling your practice? Just say yes or no.";
        }
        
    } else if (conversationState === 'buying_budget_question') {
        responseText = "Great! And are you specifically looking for a CPA practice, or would a general accounting practice work for you as well?";
        conversationState = 'buying_type_question';
        
    } else if (conversationState === 'buying_type_question') {
        responseText = "Perfect! One more important question - how soon are you looking to complete a purchase? This helps Bruce prioritize which opportunities to show you first.";
        conversationState = 'buying_timeline_question';
        
    } else if (conversationState === 'buying_timeline_question') {
        responseText = "Excellent! Bruce has exclusive off-market opportunities that aren't advertised anywhere else. Based on your criteria, he definitely has some practices that would interest you. Would you like Bruce to show you the available practices that match what you're looking for?";
        conversationState = 'asking_buying_consultation';
        
    } else if (conversationState === 'asking_buying_consultation') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
            responseText = "Outstanding! Please click the button above and Bruce will reach out with current opportunities that match your criteria. Many of these deals move fast!";
            shouldShowSmartButton = true;
            smartButtonText = '🏢 View Available Practices';
            smartButtonAction = 'buying';
            conversationState = 'button_activated_buying';
        } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
            responseText = "That's perfectly fine! When you're ready to see what's available, just let me know. Anything else about buying a practice I can help with?";
            conversationState = 'initial';
        } else {
            responseText = "Would you like Bruce to show you the practices he has available? Just let me know yes or no.";
        }
        
    } else if (conversationState === 'valuation_revenue_question') {
        responseText = "Thank you! And how many years have you been in practice? The longevity and stability really impact the valuation.";
        conversationState = 'valuation_years_question';
        
    } else if (conversationState === 'valuation_years_question') {
        responseText = "Perfect! Your practice sounds well-established. Bruce can provide you with a comprehensive FREE valuation that shows you exactly what your practice is worth in today's market. Would you like to schedule that free valuation consultation with Bruce?";
        conversationState = 'asking_valuation_consultation';
        
    } else if (conversationState === 'asking_valuation_consultation') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || userText.includes('definitely') || userText.includes('absolutely')) {
            responseText = "Wonderful! Please click the button above and we'll get you connected with Bruce for your FREE practice valuation. You might be surprised at what your practice is worth!";
            shouldShowSmartButton = true;
            smartButtonText = '📈 Get Practice Valuation';
            smartButtonAction = 'valuation';
            conversationState = 'button_activated_valuation';
        } else if (userText.includes('no') || userText.includes('not now') || userText.includes('maybe later')) {
            responseText = "No worries! The valuation offer stands whenever you're ready. Is there anything else about practice valuations I can explain?";
            conversationState = 'initial';
        } else {
            responseText = "Would you like Bruce to provide you with a free practice valuation? Just say yes or no and I'll take care of the rest.";
        }
        
    } else if (conversationState === 'button_activated_selling' || conversationState === 'button_activated_buying' || conversationState === 'button_activated_valuation') {
        responseText = "Perfect! I see you're ready to connect with Bruce. Just click that button above and we'll get everything set up for you right away!";
        
    } else if (conversationState === 'asking_anything_else') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('help')) {
            responseText = "I'm here to help! What else can I assist you with regarding your practice?";
            conversationState = 'initial'; // Back to normal conversation
        } else {
            endConversation();
            return ""; // Don't return text, endConversation handles it
        }
        
    } else {
        // ✅ FIXED THE PROBLEMATIC ELSE CLAUSE
        if (conversationState !== 'ended') {
            responseText = "Thanks for your message! Is there anything else about buying, selling, or valuing a CPA practice that I can help you with?";
            conversationState = 'initial';
            shouldShowSmartButton = false;
        } else {
            responseText = "Thank you for visiting! Have a great day.";
        }
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

// ===================================================
// 🎨 SMART BANNER - AGGRESSIVE TOP POSITIONING
// ===================================================
function updateSmartButton(shouldShow, buttonText, action) {
    const existingBanner = document.getElementById('smartButton');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    if (shouldShow) {
        const smartBanner = document.createElement('div');
        smartBanner.id = 'smartButton';
        
        smartBanner.style.cssText = `
            position: fixed;
            top: 70;
            left: 10px;
            right: 10px;
            width: calc(100% - 20px);
            height: 60px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            animation: shimmerGlow 2.5s ease-in-out infinite;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0 25px;
            z-index: 1000;
            box-sizing: border-box;
        `;
        
        // 📅 LEFT SIDE - Free Consultation
        const leftSection = document.createElement('div');
        leftSection.style.cssText = `
            color: white;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
        `;
        leftSection.innerHTML = `📅 Free Consultation`;
        
        // 🎯 RIGHT SIDE - CLICK NOW
        const rightSection = document.createElement('div');
        rightSection.style.cssText = `
            color: white;
            font-weight: bold;
            font-size: 16px;
            padding: 10px 20px;
            background: rgba(34, 197, 94, 0.3);
            border-radius: 20px;
            border: 1px solid rgba(34, 197, 94, 0.5);
            display: flex;
            align-items: center;
        `;
        rightSection.innerHTML = `CLICK NOW`;
        
        // Click handler
        smartBanner.addEventListener('click', () => {
            handleSmartButtonClick(action);
        });
        
        // Hover effects
        smartBanner.addEventListener('mouseenter', () => {
            smartBanner.style.background = 'rgba(255, 255, 255, 0.25)';
            rightSection.style.background = 'rgba(34, 197, 94, 0.5)';
        });
        
        smartBanner.addEventListener('mouseleave', () => {
            smartBanner.style.background = 'rgba(255, 255, 255, 0.15)';
            rightSection.style.background = 'rgba(34, 197, 94, 0.3)';
        });
        
        // Build the banner
        smartBanner.appendChild(leftSection);
        smartBanner.appendChild(rightSection);
        
        // 🎯 FORCE INSERT AT TOP OF BODY - NO MORE GUESSING!
        document.body.appendChild(smartBanner);
        
        // 🎯 PUSH MAIN CONTENT DOWN TO AVOID OVERLAP
        const container = document.querySelector('.container');
        if (container) {
            container.style.paddingTop = '80px'; // Make room for fixed banner
            container.style.transition = 'padding-top 0.3s ease';
        }
        
        console.log('🎯 Smart button FORCED to top with fixed positioning');
        
    } else {
        const smartButton = document.getElementById('smartButton');
        if (smartButton) {
            smartButton.remove();
        }
        
        // 🎯 RESTORE NORMAL PADDING
        const container = document.querySelector('.container');
        if (container) {
            container.style.paddingTop = '0';
        }
    }
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
// 🚀 FIXED SMART BUTTON CLICK HANDLER + BANNER
// ===================================================
function handleSmartButtonClick(buttonType) {
    console.log(`🚨 Smart button clicked: ${buttonType}`);
    
    // Fix buttonType if it's an event object
    if (typeof buttonType === 'object') {
        buttonType = 'valuation';
    }

    // 1. HIDE THE SMART BUTTON IMMEDIATELY
    const smartButton = document.getElementById('smartButton');
    if (smartButton) {
        smartButton.style.display = 'none';
    }
    
    // 2. CREATE AND SHOW THE PROFESSIONAL BANNER
    createLeadCaptureBanner();
    
    // 3. STOP SPEECH RECOGNITION COMPLETELY - NO LISTENING YET!
    if (recognition) {
        try {
            recognition.stop();
            isListening = false;
            console.log('🔇 Speech recognition stopped for lead capture');
        } catch (error) {
            console.log('Speech already stopped');
        }
    }
    
    // 4. HIDE THE GREEN "SPEAK NOW" BANNER - DON'T SHOW IT YET!
    const liveTranscript = document.getElementById('liveTranscript');
    if (liveTranscript) {
        liveTranscript.style.display = 'none'; // ← CRITICAL: Hide it!
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
    initializeLeadCapture(buttonType);
}

// ===================================================
// 🎨 CREATE PROFESSIONAL BANNER SYSTEM - FIXED POSITION
// ===================================================
function createLeadCaptureBanner() {
    // Remove any existing banner
    const existingBanner = document.getElementById('leadCaptureBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    // Create new banner
    const banner = document.createElement('div');
    banner.id = 'leadCaptureBanner';
    banner.style.cssText = `
        position: fixed;
        top: 20px;
        left: 0px;
        right: 0px;
        width: calc(100% - 20px);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 15px;
        padding: 20px 30px;
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        color: white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: bannerSlideIn 0.5s ease-out;
        z-index: 999;
        box-sizing: border-box;
    `;
    banner.innerHTML = '📝 YOUR CONTACT INFO';
    
    // Add animation keyframes
    if (!document.getElementById('leadBannerAnimation')) {
        const style = document.createElement('style');
        style.id = 'leadBannerAnimation';
        style.textContent = `
            @keyframes bannerSlideIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 🎯 FORCE INSERT INTO BODY - NO MORE CONTAINER PUSHING!
    document.body.appendChild(banner);
    
    // 🎯 ADD EXTRA PADDING TO MAIN CONTENT FOR LEAD CAPTURE
    const container = document.querySelector('.container');
    if (container) {
        const currentPadding = parseInt(container.style.paddingTop) || 0;
        container.style.paddingTop = (currentPadding + 70) + 'px'; // Add space for lead banner
        container.style.transition = 'padding-top 0.3s ease';
    }
    
    console.log('🎨 Fixed position lead capture banner created');
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
            console.log('🔊 AI started speaking - hiding Speak Now');
            // Hide the green banner while AI speaks
            const liveTranscript = document.getElementById('liveTranscript');
            if (liveTranscript) {
                liveTranscript.style.display = 'none';
            }
        };

        utterance.onend = function() {
            console.log('🔊 AI finished speaking');
            // Add any completion logic here if needed
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
        // 🔄 REDO - Skip AI speech, go straight to listening
        console.log('🔄 Redo - clearing field and starting listening immediately');
        
        // Clear temp answer and text field
        leadData.tempAnswer = '';
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.value = '';
        }
        
        // ✅ NO AI SPEECH - Go straight to "Speak Now"
        setTimeout(() => {
            const liveTranscript = document.getElementById('liveTranscript');
            const transcriptText = document.getElementById('transcriptText');
            
            if (liveTranscript && transcriptText) {
    showHybridReadySequence();
}
        }, 300);
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
// 📧 FOLLOW-UP EMAIL - WITH ALL YOUR CURRENT LOGIC
// ===================================================
function sendFollowUpEmail() {
    console.log('📧 DEBUG: leadData at function start:', leadData);
    
    if (!leadData || !leadData.email) {
        console.error('❌ CRITICAL: leadData or email is missing!');
        showThankYouBanner();
        return;
    }
    
    // ✅ SUPER CLEAN EMAIL - Remove any hidden characters
    const cleanEmail = String(leadData.email).trim().replace(/[^\w@.-]/g, '');
    
    console.log('📧 DEBUG: Original email:', leadData.email);
    console.log('📧 DEBUG: Cleaned email:', cleanEmail);
    console.log('📧 DEBUG: Email length:', cleanEmail.length);
    
    const confirmationParams = {
        to_email: cleanEmail,        // ✅ Matches {{to_email}}
        name: leadData.name,         // ✅ Matches {{name}}
        email: cleanEmail,           // ✅ Matches {{email}} (Reply To)
        phone: leadData.phone,
        contactTime: leadData.contactTime,
        inquiryType: 'CONFIRMATION EMAIL WITH BOOK LINK',
        transcript: `CONFIRMATION: Appointment scheduled for ${leadData.contactTime}\n\nFree Book: "7 Secrets to Selling Your Practice"\nDownload Link: https://bruces-book-link.com/download\n\nThank you for choosing New Clients Inc!`,
        timestamp: new Date().toLocaleString()
    };
    
    console.log('📧 DEBUG: to_email specifically:', confirmationParams.to_email);
    
    // ✅ YOUR EXACT EMAIL LOGIC
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_b9bppgb', 'template_8kx812d', confirmationParams)
            .then(function(response) {
                console.log('✅ CONFIRMATION EMAIL SENT!');
            
                
                // ✅ HIDE SMART BUTTON PERMANENTLY
                const smartButton = document.getElementById('smartButton');
                if (smartButton) {
                    smartButton.style.display = 'none !important';
                }
                
                // ✅ NO MORE TEXT - JUST THE THANK YOU BANNER

                // ✅ REPLACE BRUCE'S BANNER WITH THANK YOU BANNER
                   showThankYouBanner();
                
            }, function(error) {
                console.error('❌ EMAIL FAILED:', error);
                showThankYouBanner();
                const smartButton = document.getElementById('smartButton');
                if (smartButton) {
                    smartButton.style.display = 'none !important';
                }
            });
    } else {
        showThankYouBanner();
        const smartButton = document.getElementById('smartButton');
        if (smartButton) {
            smartButton.style.display = 'none !important';
        }
    }
}

// ===================================================
// 🔘 QUICK QUESTIONS SYSTEM
// ===================================================
function askQuickQuestion(questionText) {
    console.log('📋 Quick question clicked:', questionText);
    
    if (isSpeaking) {
        console.log('Ignoring quick question - system busy');
        return;
    }
    
    addUserMessage(questionText);
    
    setTimeout(() => {
        const response = getAIResponse(questionText);
        lastAIResponse = response;
        addAIMessage(response);
        speakResponse(response);
        
        updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
    }, 800);
}

function resetLeadCaptureSystem() {
    console.log('🔄 Resetting lead capture system...');
    
    // Remove banner
    const banner = document.getElementById('leadCaptureBanner');
    if (banner) {
        removeLeadCaptureBanner();
    }
    
    // Reset variables
    isInLeadCapture = false;
    leadData = null;
    
    // 🆕 ENHANCED: Clear any confirmation buttons that might be hanging around
    const confirmButtons = document.querySelector('.confirmation-buttons');
    if (confirmButtons) {
        confirmButtons.remove();
    }
    
    // ✅ SET THE STATE FOR FINAL QUESTION
    conversationState = 'final_question';
    
    // ✅ ASK THE FINAL QUESTION
    const finalMessage = "Is there anything else I can help you with today?";
    addAIMessage(finalMessage);
    speakResponse(finalMessage);
    
    // 🆕 IMPROVED: Better speech restart logic
    setTimeout(() => {
        if (isAudioMode && recognition && !isListening && !isSpeaking) {
            startListening();
        }
    }, 2000);
}

function showConsultationConfirmedBanner() {
    console.log('🎯 Showing Consultation Confirmed Banner - DUAL SECTION');
    
   // Remove ALL existing banners (Same cleanup as your working version)
const existingBruce = document.getElementById('bruceBookBanner');
const existingConfirm = document.getElementById('emailConfirmationBanner');

if (existingBruce) existingBruce.remove();
removeLeadCaptureBanner(); // Standardized lead capture removal
if (existingConfirm) existingConfirm.remove

    // Hide smart button
    const smartButton = document.getElementById('smartButton');
    if (smartButton) {
        smartButton.style.display = 'none !important';
    }
    
    // Create DUAL-SECTION banner (keeping your exact styling)
    const confirmationBanner = document.createElement('div');
    confirmationBanner.id = 'consultationConfirmedBanner';
    confirmationBanner.style.cssText = `
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 12px 16px;
        margin: 8px 0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    `;
    
    confirmationBanner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px;">
            
            <!-- LEFT SECTION: Consultation Confirmed -->
            <div style="color: white; text-align: left; flex: 1;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">🎯 Free Consultation Confirmed!</div>
                <div style="font-size: 11px; opacity: 0.9; line-height: 1.3;">Your information has been submitted</div>
            </div>
            
            <!-- RIGHT SECTION: Book (Your exact working code) -->
            <div style="display: flex; align-items: center; gap: 12px;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758088515492_nci-book.png" 
                     style="width: 60px; height: auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);" 
                     alt="Bruce's Book">
                <div style="color: white; text-align: left;">
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">📚 FREE Book for ${leadData.name}!</div>
                    <div style="font-size: 11px; opacity: 0.9; line-height: 1.3;">"7 Secrets to Selling Your Practice"</div>
                </div>
            </div>
            
        </div>
    `;
    
    // Insert using your exact working method
    const container = document.querySelector('.container');
    const header = container.querySelector('header');
    
    if (header && header.nextSibling) {
        container.insertBefore(confirmationBanner, header.nextSibling);
    } else {
        container.insertBefore(confirmationBanner, container.firstChild);
    }
    
    console.log('🎯 Consultation confirmed banner displayed successfully');
}

function showThankYouBanner() {
    console.log('🙏 Showing Thank You Banner with Audio');
    
  // Remove any existing banners
const existingBruce = document.getElementById('bruceBookBanner');
const existingThankYou = document.getElementById('thankYouBanner');
const existingEmailConfirmation = document.querySelector('.email-confirmation-banner');
const existingSuccess = document.querySelector('.success-banner');

if (existingThankYou) existingThankYou.remove();
removeLeadCaptureBanner(); // Standardized lead capture removal
if (existingEmailConfirmation) existingEmailConfirmation.remove();
if (existingSuccess) existingSuccess.remove();
    
    // Hide smart button
    const smartButton = document.getElementById('smartButton');
    if (smartButton) {
        smartButton.style.display = 'none !important';
    }
    
    // Create fancy thank you banner
    const thankYouBanner = document.createElement('div');
    thankYouBanner.id = 'thankYouBanner';
    thankYouBanner.style.cssText = `
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 50%, #2E7D32 100%);
        border: 3px solid rgba(255, 255, 255, 0.4);
        border-radius: 25px;
        padding: 30px;
        margin: 15px 0;
        text-align: center;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
        position: relative;
        overflow: hidden;
        animation: thankYouGlow 2s ease-in-out infinite alternate;
    `;
    
    thankYouBanner.innerHTML = `
        <div style="position: relative; z-index: 2;">
            <div style="font-size: 48px; margin-bottom: 15px;">🙏</div>
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 28px; font-weight: bold; text-shadow: 0 3px 6px rgba(0,0,0,0.4);">
                Thank You for Visiting!
            </h2>
            <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; line-height: 1.6;">
                We appreciate your time and interest.<br>
                <em style="font-size: 16px; opacity: 0.9;">Have a wonderful day!</em>
            </p>
            <div style="margin-top: 15px; color: rgba(255,255,255,0.8); font-size: 14px;">
                🎵 <em>Playing farewell message...</em>
            </div>
        </div>
        <div style="position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); pointer-events: none;"></div>
    `;
    
    // Add glow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes thankYouGlow {
            from { box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(76, 175, 80, 0.3); }
            to { box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 0 30px rgba(76, 175, 80, 0.6); }
        }
    `;
    document.head.appendChild(style);
    
    // Insert into container
    const container = document.querySelector('.container');
    const header = container.querySelector('header');
    
    if (header && header.nextSibling) {
        container.insertBefore(thankYouBanner, header.nextSibling);
    } else {
        container.insertBefore(thankYouBanner, container.firstChild);
    }
    
    // 🎵 PLAY YOUR THANK YOU AUDIO MESSAGE
    setTimeout(() => {
        const thankYouAudio = new Audio('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1758148837523.mp3');
        thankYouAudio.volume = 0.8;
        thankYouAudio.preload = 'auto';
        
        thankYouAudio.play().then(() => {
            console.log('🎵 Thank You audio playing successfully');
        }).catch(error => {
            console.log('🎵 Thank you audio failed to play:', error);
        });
        
        // Optional: Fade out banner after audio completes
        thankYouAudio.onended = function() {
            console.log('🎵 Thank you audio completed');
            // Banner stays visible - user can see the thank you message
        };
        
    }, 500); // Small delay to ensure banner is visible first
    
    console.log('🙏 Thank You Banner with Audio displayed successfully');
}

function showEmailConfirmationBanner() {
    // Remove ALL existing banners
    const existingBruce = document.getElementById('bruceBookBanner');
    const existingConfirm = document.getElementById('emailConfirmationBanner');

    removeLeadCaptureBanner(); // Use standardized removal function
    if (existingConfirm) existingConfirm.remove();
    
   showUniversalBanner('emailSent');

    setTimeout(() => {
     removeAllBanners(); // Use Universal Banner removal
    }, 4000);
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
