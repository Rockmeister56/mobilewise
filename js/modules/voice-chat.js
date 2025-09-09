// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATED SYSTEM
// Combining working bubble system + your business logic
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
let currentUserBubble = null;
let micPermissionGranted = false;
let isCreatingBubble = false;
let responseText = '';
let shouldShowSmartButton = false;
let smartButtonText = 'AI Smart Button';
let smartButtonAction = 'default';

// Conversation state tracking (from working bubble system)
let conversationState = 'initial';
let lastAIResponse = '';
let userResponseCount = 0;

// Voice settings
let voiceSpeed = 1.0;

// Processing flags
let isProcessingInput = false;

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
    
    // ✅ ADD THIS LINE to also activate the microphone
    activateMicrophone();
}

// ===================================================
// 🎤 MICROPHONE PERMISSION SYSTEM
// ===================================================
async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('✅ Microphone permission granted');
        return true;
    } catch (error) {
        console.log('❌ Microphone permission denied:', error);
        return false;
    }
}

function setupMobileRetry() {
    if (isMobileDevice()) {
        const retryBtn = document.createElement('button');
        retryBtn.textContent = '🎤 Tap to Retry Listening';
        retryBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            z-index: 1000;
            display: none;
        `;
        retryBtn.id = 'mobileRetryBtn';
        retryBtn.onclick = function() {
            if (isAudioMode && !isListening) {
                startListening();
            }
        };
        document.body.appendChild(retryBtn);
    }
}

// Call this in your initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat();
    optimizeForMobile();
    setupMobileRetry(); // ✅ ADD THIS
});

// ===================================================
// 🎤 SPEECH RECOGNITION ENHANCEMENTS
// ===================================================

function startListening() {
    console.log('🎯 startListening() called - starting speech recognition');
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;

    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        // ✅ MOBILE-SPECIFIC OPTIMIZATIONS
if (isMobileDevice()) {
    console.log('📱 Applying mobile speech recognition settings');
    
    // Mobile-specific settings
    recognition.maxAlternatives = 1;
    
    // Clear any existing timeouts
    if (window.mobileRecognitionTimeout) {
        clearTimeout(window.mobileRecognitionTimeout);
    }
    
    // Set timeout to restart recognition (mobile devices often need this)
    window.mobileRecognitionTimeout = setTimeout(() => {
        if (isListening && recognition) {
            console.log('📱 Mobile safety timeout - restarting recognition');
            try {
                recognition.stop();
                setTimeout(() => {
                    if (isAudioMode && !isListening) {
                        startListening();
                    }
                }, 500);
            } catch (e) {
                console.log('📱 Timeout restart error:', e);
            }
        }
    }, 8000); // 8 seconds for mobile
}
        
        // ✅ ADD THESE OPTIONS FOR BETTER MOBILE COMPATIBILITY
        recognition.maxAlternatives = 3; // Get more potential matches
        recognition.onaudiostart = function() {
            console.log('🔊 Audio capture started');
        };
        
        recognition.onaudioend = function() {
            console.log('🔊 Audio capture ended');
        };
        
        recognition.onsoundstart = function() {
            console.log('🔊 Sound detected');
        };
        
        recognition.onsoundend = function() {
            console.log('🔊 Sound ended');
        };
        
        recognition.onspeechstart = function() {
            console.log('🎤 Speech started');
        };
        
        recognition.onspeechend = function() {
            console.log('🎤 Speech ended');
        };
        
        recognition.onnomatch = function() {
            console.log('❌ No speech recognition match');
            // Add visual feedback for no speech detected
            const currentBubble = document.getElementById('currentUserBubble');
            if (currentBubble) {
                currentBubble.querySelector('.bubble-text').textContent = 'No speech detected. Try again.';
                currentBubble.style.opacity = '0.6';
                
                // Auto-restart after a brief pause
                setTimeout(() => {
                    if (isAudioMode && !isListening) {
                        console.log('🔄 Restarting listening after no match');
                        startListening();
                    }
                }, 1500);
            }
        }; // ← ADDED MISSING ); HERE

        recognition.onresult = function(event) {
            console.log('🎤 Speech recognition result received');
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                console.log('📝 Transcript:', transcript, 'Confidence:', event.results[i][0].confidence);
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            const currentBubble = document.getElementById('currentUserBubble');
            if (currentBubble) {
                const displayText = finalTranscript + interimTranscript;
                if (displayText.trim()) {
                    const bubbleElement = currentBubble.querySelector('.bubble-text');
                    if (bubbleElement) {
                        bubbleElement.textContent = displayText;
                    }

                    // 🎯 PROPER ANIMATION STATES
                    if (interimTranscript) {
                        currentBubble.classList.add('listening-animation');
                        currentBubble.classList.remove('speech-complete');
                        bubbleElement.classList.add('listening-dots');
                    } else if (finalTranscript) {
                        currentBubble.classList.remove('listening-animation');
                        currentBubble.classList.add('speech-complete');
                        bubbleElement.classList.remove('listening-dots');
                    }

                    scrollToBottom();
                }
            }

            // Process final transcript
            if (finalTranscript) {
                console.log('✅ Final transcript:', finalTranscript);
                setTimeout(() => {
                    processUserResponse(finalTranscript);
                }, 500);
            }
        };

        // ✅ ENHANCED onerror FOR MOBILE
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            
            // Special handling for mobile
            if (isMobileDevice()) {
                console.log('📱 Mobile error handling');
                
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    // Mobile-specific recovery
                    const currentBubble = document.getElementById('currentUserBubble');
                    if (currentBubble) {
                        currentBubble.querySelector('.bubble-text').textContent = 'Tap to try again...';
                        currentBubble.style.opacity = '0.6';
                        currentBubble.onclick = function() {
                            if (isAudioMode && !isListening) {
                                startListening();
                            }
                        };
                    }
                    
                    // Auto-restart with longer delay for mobile
                    setTimeout(() => {
                        if (isAudioMode && !isListening) {
                            console.log('📱 Mobile auto-restart after error');
                            startListening();
                        }
                    }, 2000);
                    return;
                }
            }
            
            stopListening();
        };

        recognition.onend = function() {
            console.log('🔚 Recognition ended');
            if (isListening && isAudioMode) {
                console.log("🔄 Recognition ended but we're still in listening mode - restarting");
                // Auto-restart for continuous listening
                setTimeout(() => {
                    if (isAudioMode && !isListening) {
                        startListening();
                    }
                }, 100);
            }
        };

        recognition.start();
        isListening = true; 
        console.log('🎤 Speech recognition started successfully');
        
        playStartSound();

    } catch (error) {
        console.error('Error starting speech recognition:', error);
        
        // Mobile-specific fallback
        if (isMobileDevice()) {
            addAIMessage("Mobile speech recognition issue. Please try tapping the microphone button again.");
            switchToTextMode();
        }
    }
} // ← MAKE SURE THIS CLOSING BRACE IS HERE

// ===================================================
// 📱 MOBILE AUDIO FIXES
// ===================================================

// Add this function to handle mobile audio context issues
function ensureAudioContext() {
    if (isMobileDevice()) {
        try {
            // Create and immediately close an audio context to "warm up" the audio system
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                console.log('📱 Audio context suspended - attempting to resume');
                // Add a user gesture requirement for iOS
                const resumeButton = document.createElement('button');
                resumeButton.textContent = 'Tap to Enable Audio';
                resumeButton.style.cssText = `
                    position: fixed;
                    bottom: 120px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ff9800;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    z-index: 1000;
                `;
                resumeButton.onclick = function() {
                    audioContext.resume().then(() => {
                        console.log('✅ Audio context resumed after user gesture');
                        document.body.removeChild(resumeButton);
                        startListening(); // Restart listening
                    });
                };
                document.body.appendChild(resumeButton);
            }
            // Don't keep the context open - just warm it up
            setTimeout(() => {
                if (audioContext && typeof audioContext.close === 'function') {
                    audioContext.close();
                }
            }, 1000);
        } catch (error) {
            console.log('📱 Audio context warmup failed:', error);
        }
    }
}

// Call this right after microphone activation
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    // ✅ Call this for mobile audio fix
    if (isMobileDevice()) {
        ensureAudioContext();
    }
    
    // ... rest of your existing activateMicrophone code ...
}

// ===================================================
// 🔊 AUDIO FEEDBACK FUNCTIONS
// ===================================================

function playStartSound() {
    // DON'T play any sound before AI speaks on mobile
    if (isMobileDevice()) {
        console.log('📱 Skipping start sound on mobile to prevent audio clipping');
        return; // Exit early on mobile
    }
    
    try {
        // Desktop only - use Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Check if audio context is suspended (common on mobile)
        if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log('✅ Audio context resumed');
            });
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); // Lower volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Shorter duration
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        
    } catch (error) {
        console.log('Audio context error:', error);
    }
}

// ===================================================
// 📱 MOBILE-SPECIFIC ENHANCEMENTS
// ===================================================

function optimizeForMobile() {
    if (isMobileDevice()) {
        console.log('📱 Applying mobile optimizations');
        
        // Add touch-friendly styles
        const style = document.createElement('style');
        style.textContent = `
            .activate-mic-btn, #smartButton {
                min-height: 44px;
                min-width: 44px;
            }
            .message-bubble {
                font-size: 16px; /* Larger text for mobile */
            }
        `;
        document.head.appendChild(style);
    }
}

// Call this in your initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat();
    optimizeForMobile(); // ✅ ADD THIS LINE
    
    if (isMobileDevice()) {
        console.log('📱 Mobile device detected');
    }
});

// ===================================================
// 🔍 MICROPHONE DEBUG DIAGNOSTICS
// ===================================================
async function debugMicrophoneAccess() {
    console.log('🔍 Starting microphone debug...');
    
    // Check if we're even in a secure context (HTTPS required)
    console.log('🔒 Secure context:', window.isSecureContext);
    console.log('🌐 Protocol:', window.location.protocol);
    
    // Check permissions API if available
    if (navigator.permissions) {
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
            console.log('🎤 Microphone permission state:', permissionStatus.state);
        } catch (e) {
            console.log('❌ Permissions API error:', e);
        }
    }
    
    // Try to list devices (this often triggers permission)
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        console.log('📱 Available audio devices:', audioInputs);
    } catch (e) {
        console.log('❌ Device enumeration failed:', e);
    }
    
    // Try the actual getUserMedia
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ SUCCESS: Got microphone access!');
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.log('❌ FAILED: Microphone access error:', error);
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
        return false;
    }
}

// ===================================================
// 📱 MOBILE MICROPHONE PERMISSION HANDLER
// ===================================================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

async function requestMobileMicrophonePermission() {
    return new Promise((resolve) => {
        // Create a mobile-friendly permission request dialog
        const mobilePermissionDialog = document.createElement('div');
        mobilePermissionDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
            max-width: 300px;
        `;
        
        mobilePermissionDialog.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">🎤 Microphone Access</h3>
            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
                Please allow microphone access to use voice features. Tap "Allow" when prompted by your browser.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="handleMobilePermission(true)" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Continue
                </button>
                <button onclick="handleMobilePermission(false)" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        `;
        
        document.body.appendChild(mobilePermissionDialog);
        
        // Handle the permission response
        window.handleMobilePermission = function(granted) {
            document.body.removeChild(mobilePermissionDialog);
            
            if (granted) {
                // User clicked Continue - now trigger the actual permission prompt
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        stream.getTracks().forEach(track => track.stop());
                        resolve(true);
                    })
                    .catch(error => {
                        console.log('❌ Mobile microphone permission denied after prompt');
                        resolve(false);
                    });
            } else {
                resolve(false);
            }
        };
    });
}

// ===================================================
// 📱 MOBILE DEVICE DETECTION
// ===================================================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===================================================
// 📱 MOBILE MICROPHONE GUIDE
// ===================================================
function showMobileMicrophoneGuide() {
    const guideHtml = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: white; padding: 25px; border-radius: 15px; max-width: 400px; text-align: center;">
                <h3 style="color: #d32f2f; margin-bottom: 20px;">🎤 Microphone Access Required</h3>
                <p style="margin-bottom: 15px; color: #333;">To use voice features on mobile:</p>
                <ol style="text-align: left; color: #555; margin-bottom: 20px;">
                    <li>Tap the <strong>lock icon 🔒</strong> in your address bar</li>
                    <li>Select <strong>"Site settings"</strong> or <strong>"Permissions"</strong></li>
                    <li>Change <strong>Microphone</strong> to <strong>"Allow"</strong></li>
                    <li>Refresh this page and try again</li>
                </ol>
                <button onclick="closeMicrophoneGuide()" style="padding: 12px 24px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                    I've enabled microphone access
                </button>
                <button onclick="switchToTextMode(); closeMicrophoneGuide()" style="padding: 12px 24px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-left: 10px;">
                    Use text chat instead
                </button>
            </div>
        </div>
    `;
    
    const guideElement = document.createElement('div');
    guideElement.innerHTML = guideHtml;
    guideElement.id = 'microphoneGuide';
    document.body.appendChild(guideElement);
}

function closeMicrophoneGuide() {
    const guide = document.getElementById('microphoneGuide');
    if (guide) guide.remove();
}

// ===================================================
// 📝 TEXT MODE SWITCHER
// ===================================================
function switchToTextMode() {
    console.log('🔄 Switching to text mode');
    
    // Stop any ongoing audio
    stopCurrentAudio();
    
    // Stop listening if active
    if (isListening) {
        stopListening();
    }
    
    // Close microphone stream if open
    if (persistentMicStream) {
        persistentMicStream.getTracks().forEach(track => track.stop());
        persistentMicStream = null;
    }
    
    // Update mode flag
    isAudioMode = false;
    micPermissionGranted = false;
    
    // Update UI
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    const voiceContainer = document.getElementById('voiceVisualizerContainer');
    const textInputContainer = document.getElementById('textInputContainer');
    
    if (activateMicBtn) activateMicBtn.style.display = 'block';
    if (audioOffBtn) audioOffBtn.style.display = 'none';
    if (voiceContainer) voiceContainer.style.display = 'none';
    if (textInputContainer) textInputContainer.style.display = 'flex';
    
    // Add message about switching to text mode
    addAIMessage("Switched to text mode. Type your message in the text box below.");
    
    console.log('✅ Switched to text mode successfully');
}

async function activateMicrophone() {
    console.log('🎤 Activating microphone...');

    // Instead, just check if we're on HTTPS and have basic support
    if (!window.isSecureContext) {
        addAIMessage("Microphone access requires HTTPS. Please ensure you're on a secure connection.");
        return;
    }

    // ✅ ADD THE SPLASH SCREEN AND CHAT INTERFACE CODE HERE
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

    // Use the fallback method directly
    try {
        const stream = await requestMicrophoneWithFallback();
        persistentMicStream = stream;
        micPermissionGranted = true;

        isAudioMode = true;

        // Show appropriate UI
        const activateMicBtn = document.getElementById('activateMicBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');
        const voiceContainer = document.getElementById('voiceVisualizerContainer');

        if (activateMicBtn) activateMicBtn.style.display = 'none';
        if (audioOffBtn) audioOffBtn.style.display = 'block';
        if (voiceContainer) voiceContainer.style.display = 'flex';

        // Initialize speech recognition
        initializeSpeechRecognition();

        // ✅ ADD THIS BACK - AI GREETING!
        setTimeout(() => {
            const greeting = "Welcome! I'm Bruce Clark's AI assistant. What can I help you with today?";
            addAIMessage(greeting);
            speakResponse(greeting);
        }, 500);

    } catch (error) {
        console.log('❌ Microphone access denied:', error);
        console.log('🔍 Error name:', error.name);
        console.log('🔍 Error message:', error.message);

        // Show detailed error message
        let errorMessage = "Microphone access was denied. ";

        if (error.name === 'NotAllowedError') {
            errorMessage += "Please check your browser permissions and allow microphone access.";
        } else if (error.name === 'PermissionDismissedError') {
            errorMessage += "The permission prompt was dismissed. Please try again and click 'Allow'.";
        } else if (error.name === 'NotFoundError') {
            errorMessage += "No microphone found. Please check your device settings.";
        }

        addAIMessage(errorMessage);
        switchToTextMode();
    }
} // ← MAKE SURE THIS CLOSING BRACE IS HERE!

async function requestMicrophoneWithFallback() {
    try {
        // First try the standard way
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return stream;
    } catch (error) {
        console.log('Standard permission failed, trying fallback...');
        
        // Create a temporary audio element to trigger permission differently
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoAAAC';
        audio.volume = 0;
        
        return new Promise((resolve, reject) => {
            audio.oncanplay = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    resolve(stream);
                } catch (error2) {
                    reject(error2);
                }
            };
            
            audio.onerror = () => reject(error);
            audio.play().catch(reject);
        });
    }
}

// ===================================================
// 🎯 SPEECH RECOGNITION SYSTEM (From working bubble system)
// ===================================================
function checkSpeechSupport() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('❌ Speech recognition not supported in this browser');
        return false;
    }
    return true;
}

function initializeSpeechRecognition() {
    if (!checkSpeechSupport()) {
        addAIMessage("Your browser doesn't support speech recognition. Please use Chrome or Edge.");
        return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    console.log('✅ Speech recognition initialized');
    return true;
}

function stopListening() {
    if (recognition) {
        recognition.stop();
        // ✅ ADD THESE LINES TO PROPERLY RESET THE RECOGNITION OBJECT
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition = null; // ← This should now work properly
    }

    const currentBubble = document.getElementById('currentUserBubble');
    if (currentBubble) {
        currentBubble.classList.remove('typing');
        if (!currentBubble.querySelector('.bubble-text').textContent.trim()) {
            currentBubble.querySelector('.bubble-text').textContent = 'No speech detected';
            currentBubble.style.opacity = '0.6';
        }
        currentBubble.removeAttribute('id');
    }

    // Update UI
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    if (activateMicBtn) activateMicBtn.style.display = 'block';
    if (audioOffBtn) audioOffBtn.style.display = 'none';

    isListening = false;
}

function processUserResponse(userText) {
    userResponseCount++;
    
    // Update UI
    const currentBubble = document.getElementById('currentUserBubble');
    if (currentBubble) {
        currentBubble.classList.remove('typing');
        currentBubble.removeAttribute('id');
    }
    
    // Stop listening while AI responds
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    
    isListening = false;
    
    // Update UI buttons
    const activateMicBtn = document.getElementById('activateMicBtn');
    const audioOffBtn = document.getElementById('audioOffBtn');
    if (activateMicBtn) activateMicBtn.style.display = 'block';
    if (audioOffBtn) audioOffBtn.style.display = 'none';
    
    // Add AI response
    setTimeout(() => {
        addAIResponse(userText);
    }, 800);
}

function addAIResponse(userText) {
    // Generate AI response
    const responseText = getAIResponse(userText);
    lastAIResponse = responseText;
    
    // Add AI message to chat
    addAIMessage(responseText);
    
    // Speak the response  
    speakResponse(responseText);
    
    // Update conversation info if available
    updateConversationInfo();
    
    // Update smart button based on response logic
    updateSmartButton(shouldShowSmartButton, smartButtonText, smartButtonAction);
}

function scrollToBottom() {
    const chatArea = document.getElementById('chatMessages');
    chatArea.scrollTop = chatArea.scrollHeight;
}

function updateConversationInfo() {
    console.log('Conversation State:', conversationState);
    console.log('Last Response:', lastAIResponse.substring(0, 50) + (lastAIResponse.length > 50 ? '...' : ''));
}

function resetConversation() {
    const chatArea = document.getElementById('chatMessages');
    chatArea.innerHTML = `
        <div class="ai-bubble">
            <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png" class="ai-avatar">
            <div>👋 Conversation reset! How can I help you with your CPA practice today?</div>
        </div>
    `;
    
    conversationState = 'initial';
    lastAIResponse = '';
    userResponseCount = 0;
    
    updateConversationInfo();
    console.log('Click microphone to start conversation'); 
    
    if (isListening) {
        stopListening();
    }
}

// Smart Button Management System
function updateSmartButton(shouldShow, buttonText, actionType) {
    const smartButton = document.getElementById('smartButton');
    
    if (!smartButton) {
        console.warn('Smart button element not found');
        return;
    }
    
    if (shouldShow) {
        smartButton.style.display = 'block';
        smartButton.textContent = buttonText;
        smartButton.setAttribute('data-action', actionType);
        
        // Add visual emphasis for important CTAs
        if (actionType === 'interview' || actionType === 'connect_bruce') {
            smartButton.classList.add('pulse-animation');
        } else {
            smartButton.classList.remove('pulse-animation');
        }
    } else {
        smartButton.style.display = 'none';
        smartButton.textContent = 'AI Smart Button';
        smartButton.removeAttribute('data-action');
        smartButton.classList.remove('pulse-animation');
    }
}

// Smart Button Click Handler
function handleSmartButtonClick() {
    const smartButton = document.getElementById('smartButton');
    const actionType = smartButton.getAttribute('data-action');
    
    switch(actionType) {
        case 'valuation':
        case 'buying':
        case 'schedule_today':
        case 'schedule_tomorrow':
        case 'contact_today':
        case 'contact_tomorrow':
        case 'connect_bruce':
            // Trigger conversation continuation
            simulateUserMessage("I'm interested in connecting with Bruce");
            break;
            
        case 'interview':
            // Load interview interface in iframe
            loadInterviewInterface();
            break;
            
        default:
            console.log('Smart button clicked - default action');
    }
}

// Interview Interface Loader (Splash Screen for now)
function loadInterviewInterface() {
    const chatArea = document.querySelector('.chatMessages');
    const splashScreen = document.createElement('div');
    splashScreen.className = 'interview-splash';
    splashScreen.innerHTML = `
        <div class="splash-content">
            <h3>🚀 AI Business Analyst Interview</h3>
            <p>Connecting you with our advanced interviewer system...</p>
            <div class="loading-animation">●●●</div>
            <p><em>This feature is coming soon!</em></p>
            <button onclick="closeSplashScreen()" class="close-splash">Return to Chat</button>
        </div>
    `;
    
    chatArea.appendChild(splashScreen);
}

// Close Splash Screen
function closeSplashScreen() {
    const splashScreen = document.querySelector('.interview-splash');
    if (splashScreen) {
        splashScreen.remove();
    }
}

// Simulate User Message (for button interactions)
function simulateUserMessage(message) {
    const chatArea = document.querySelector('.chatMessages');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-bubble';
    userBubble.innerHTML = `<div class="bubble-content">${message}</div>`;
    
    chatArea.appendChild(userBubble);
    scrollToBottom();
    
    // Process this as if user spoke it
    setTimeout(() => {
        processUserInput(message);
    }, 500);
}

function getAIResponse(userInput) {
    const userText = userInput.toLowerCase();
    
    if (conversationState === 'initial') {
        if (userText.includes('sell') || userText.includes('practice') || userText.includes('selling')) {
            responseText = "EXCELLENT timing for selling your accounting practice! The market is very strong right now. Should Bruce call you today or tomorrow for your FREE practice valuation?";
            conversationState = 'selling_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Free Valuation';
            smartButtonAction = 'valuation';
        } else if (userText.includes('buy') || userText.includes('purchase') || userText.includes('buying') || userText.includes('acquire')) {
            responseText = "Looking to BUY a CPA firm? Perfect! Bruce has exclusive off-market opportunities available RIGHT NOW. Should Bruce show you available practices today or tomorrow?";
            conversationState = 'buying_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'View Available Practices';
            smartButtonAction = 'buying';
        } else if (userText.includes('value') || userText.includes('worth') || userText.includes('valuation') || userText.includes('evaluate')) {
            responseText = "Your accounting practice could be worth MORE than you think! Bruce offers a FREE consultation to evaluate your practice. Are you interested in a valuation today?";
            conversationState = 'valuation_inquiry';
            shouldShowSmartButton = true;
            smartButtonText = 'Get Practice Valuation';
            smartButtonAction = 'valuation';
        } else {
            responseText = "I specialize in CPA firm transactions - buying, selling, and valuations. What specifically are you interested in learning more about?";
        }
    } else if (conversationState === 'selling_inquiry') {
        if (userText.includes('today') || userText.includes('now') || userText.includes('asap') || 
            userText.includes('immediately') || userText.includes('this afternoon') || 
            (userText.includes('yes') && !userText.includes('tomorrow'))) {
            responseText = "Great! Bruce will call you today. What's the best phone number to reach you, and what time works best?";
            conversationState = 'contact_today';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Today';
            smartButtonAction = 'schedule_today';
        } else if (userText.includes('tomorrow') || userText.includes('next day') || 
                   userText.includes('morning') || userText.includes('later')) {
            responseText = "Perfect! Bruce will call you tomorrow. What's the best phone number to reach you, and what time works best?";
            conversationState = 'contact_tomorrow';
            shouldShowSmartButton = true;
            smartButtonText = 'Schedule Tomorrow';
            smartButtonAction = 'schedule_tomorrow';
        } else if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || 
                   userText.includes('schedule') || userText.includes('free') || userText.includes('consultation') ||
                   userText.includes('call') || userText.includes('contact') || userText.includes('talk')) {
            responseText = "Excellent! Should Bruce call you today or tomorrow for your FREE practice valuation?";
            conversationState = 'selling_inquiry';
        } else {
            responseText = "I didn't quite catch that. Should Bruce call you today or tomorrow for your FREE practice valuation?";
        }
    } else if (conversationState === 'buying_inquiry') {
        if (userText.includes('today') || userText.includes('now') || userText.includes('asap') || 
            userText.includes('immediately') || userText.includes('this afternoon') ||
            (userText.includes('yes') && !userText.includes('tomorrow'))) {
            responseText = "Excellent! Bruce will contact you today to discuss available practices. What's the best phone number to reach you?";
            conversationState = 'contact_today';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect Today';
            smartButtonAction = 'contact_today';
        } else if (userText.includes('tomorrow') || userText.includes('next day') || 
                   userText.includes('morning') || userText.includes('later')) {
            responseText = "Great! Bruce will contact you tomorrow to discuss available practices. What's the best phone number to reach you?";
            conversationState = 'contact_tomorrow';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect Tomorrow';
            smartButtonAction = 'contact_tomorrow';
        } else if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') || 
                   userText.includes('show') || userText.includes('available') || userText.includes('practices') ||
                   userText.includes('view') || userText.includes('see') || userText.includes('interested')) {
            responseText = "Perfect! Should Bruce contact you today or tomorrow about available practices?";
            conversationState = 'buying_inquiry';
        } else {
            responseText = "I didn't quite catch that. Should Bruce contact you today or tomorrow about available practices?";
        }
    } else if (conversationState === 'valuation_inquiry') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('interested') || 
            userText.includes('okay') || userText.includes('please') || userText.includes('free') ||
            userText.includes('consultation') || userText.includes('valuation') || userText.includes('evaluate')) {
            responseText = "Great! Bruce will contact you to set up your FREE valuation. What's the best phone number to reach you, and should he call today or tomorrow?";
            conversationState = 'contact_valuation';
            shouldShowSmartButton = true;
            smartButtonText = 'Connect with Bruce';
            smartButtonAction = 'connect_bruce';
        } else if (userText.includes('no') || userText.includes('not') || userText.includes('maybe')) {
            responseText = "No problem! Is there anything else I can help you with regarding your CPA practice?";
            conversationState = 'initial';
        } else {
            responseText = "I want to make sure I understand - are you interested in a FREE practice valuation?";
            conversationState = 'valuation_inquiry';
        }
    } else if (conversationState === 'contact_today' || conversationState === 'contact_tomorrow' || conversationState === 'contact_valuation') {
        const phoneMatch = userText.match(/\b(\d{3}[-.]?\d{3}[-.]?\d{4})\b/);
        if (phoneMatch) {
            responseText = "Perfect! Bruce will call you at " + phoneMatch[0] + ". Is there anything else I can help you with today?";
            conversationState = 'completed';
            shouldShowSmartButton = true;
            smartButtonText = 'Start Interview';
            smartButtonAction = 'interview';
        } else if (userText.includes('phone') || userText.includes('number') || userText.includes('call') ||
                   userText.includes('contact') || userText.includes('reach')) {
            responseText = "Great! What's the best phone number for Bruce to reach you? Please say the 10-digit number clearly.";
        } else {
            responseText = "Thanks! What's the best phone number for Bruce to reach you?";
        }
    } else if (conversationState === 'completed') {
        if (userText.includes('yes') || userText.includes('sure') || userText.includes('okay') ||
            userText.includes('interview') || userText.includes('start') || userText.includes('continue')) {
            responseText = "Excellent! Bruce will be in touch soon, and we'll get your interview process started. Thank you for your interest!";
        } else {
            responseText = "Thank you! Bruce will be in touch soon. Have a great day!";
        }
    } else {
        responseText = "Thanks for your message. Is there anything else I can help you with regarding your CPA practice?";
        conversationState = 'initial';
    }

 return responseText;
}

function handleSmartButtonClick() {
    const smartButton = document.getElementById('smartButton');
    const actionType = smartButton ? smartButton.getAttribute('data-action') : 'default';
    
    console.log('Smart button clicked, action:', actionType);
    
    switch(actionType) {
        case 'valuation':
            simulateUserMessage("Yes, I'm interested in a valuation");
            break;
            
        case 'buying':
            simulateUserMessage("Yes, show me available practices");
            break;
            
        case 'schedule_today':
            simulateUserMessage("Today works for me");
            break;
            
        case 'schedule_tomorrow':
            simulateUserMessage("Tomorrow works better");
            break;
            
        case 'contact_today':
        case 'contact_tomorrow':
        case 'connect_bruce':
            simulateUserMessage("I'd like to connect with Bruce");
            break;
            
        case 'interview':
            loadInterviewInterface();
            break;
            
        default:
            console.log('Smart button clicked - no specific action defined');
            simulateUserMessage("I need help with my practice");
    }
}

// Simulate User Message (for button interactions)
function simulateUserMessage(message) {
    console.log('Simulating user message:', message);
    
    // Create user bubble
    const chatArea = document.querySelector('.chatMessages');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-bubble';
    userBubble.innerHTML = `<div class="bubble-content">${message}</div>`;
    
    chatArea.appendChild(userBubble);
    scrollToBottom();
}

// ===================================================
// 💬 MESSAGE HANDLING SYSTEM
// ===================================================
function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    messageBubble.textContent = message;
    
    messageElement.appendChild(messageBubble);
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
}

function addAIMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    const aiAvatar = document.createElement('img');
    aiAvatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png';
    aiAvatar.className = 'ai-avatar';
    
    const messageText = document.createElement('div');
    messageText.textContent = message;
    
    messageBubble.appendChild(aiAvatar);
    messageBubble.appendChild(messageText);
    messageElement.appendChild(messageBubble);
    
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
// 🗣️ VOICE SYNTHESIS SYSTEM
// ===================================================
function speakResponse(message) {
    console.log('🎤 Speaking response:', message);
    
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // ✅ MOBILE FIX: Add slight delay for mobile to prevent clipping
    if (isMobileDevice()) {
        setTimeout(() => {
            createAndSpeakUtterance(message);
        }, 300);
    } else {
        createAndSpeakUtterance(message);
    }
}

// ✅ Extract utterance creation to separate function
function createAndSpeakUtterance(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    
    // ✅ SLOWER RATE FOR MOBILE - prevents word clipping
    utterance.rate = isMobileDevice() ? 0.9 : voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = isMobileDevice() ? 0.95 : 0.9; // Slightly louder on mobile
    
    utterance.onstart = function() {
        isSpeaking = true;
        console.log('✅ AI started speaking');
    };
    
    utterance.onend = function() {
        isSpeaking = false;
        console.log('✅ AI finished speaking');
        console.log('🔍 Debug - isAudioMode:', isAudioMode, 'isListening:', isListening);
        
        // Clear bubble reference
        currentUserBubble = null;
        
        // START LISTENING AFTER SPEAKING ENDS
        if (isAudioMode && !isListening) {
            setTimeout(() => {
                try {
                    console.log('🔄 Starting listening after speech completed');
                    if (typeof createRealtimeBubble === 'function') {
                        createRealtimeBubble();
                    }
                    startListening();
                } catch (error) {
                    console.log('❌ Recognition restart error:', error);
                }
            }, 1500);
        }
    };

    // ✅ ADD A FALLBACK TIMER in case onend doesn't fire
    setTimeout(() => {
        if (isSpeaking) {
            console.log('🔄 Fallback timer - forcing speech end');
            isSpeaking = false;
            currentUserBubble = null;
            
            if (isAudioMode && !isListening) {
                console.log('🔄 Fallback - starting listening');
                createRealtimeBubble();
                startListening();
            }
        }
    }, 15000); // 15 second fallback
    
    utterance.onerror = function(event) {
        console.log('❌ Speech error:', event.error);
        isSpeaking = false;
        currentUserBubble = null;
    };
    
    window.speechSynthesis.speak(utterance);
    currentAudio = utterance;
}

// ✅ Extract utterance creation to separate function
function createAndSpeakUtterance(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    
    // ✅ SLOWER RATE FOR MOBILE - prevents word clipping
    utterance.rate = isMobileDevice() ? 0.9 : 1.0;
    utterance.pitch = 1.0;
    utterance.volume = isMobileDevice() ? 0.95 : 0.9; // Slightly louder on mobile
    
utterance.onend = function() {
    isSpeaking = false;
    console.log('✅ AI finished speaking');
    console.log('🔍 Debug - isAudioMode:', isAudioMode, 'isListening:', isListening);
    console.log('🔍 Debug - recognition object:', recognition);
    console.log('🔍 Debug - recognition state:', recognition ? recognition.state : 'null');
    
    // Clear bubble reference
    currentUserBubble = null;
    
    // START LISTENING AFTER SPEAKING ENDS
    if (isAudioMode && !isListening) {  // ← REMOVED the !recognition check!
        setTimeout(() => {
            try {
                console.log('🔄 Starting listening after speech completed');
                if (typeof createRealtimeBubble === 'function') {
                    createRealtimeBubble();
                }
                startListening();
            } catch (error) {
                console.log('❌ Recognition restart error:', error);
            }
        }, 1500);
    }
};

// ✅ ADD A FALLBACK TIMER in case onend doesn't fire
setTimeout(() => {
    if (isSpeaking) {
        console.log('🔄 Fallback timer - forcing speech end');
        isSpeaking = false;
        currentUserBubble = null;
        
        if (isAudioMode && !isListening) {
            console.log('🔄 Fallback - starting listening');
            createRealtimeBubble();
            startListening();
        }
    }
}, 15000); // 5 second fallback
    
    utterance.onerror = function(event) {
        console.log('❌ Speech error:', event.error);
        isSpeaking = false;
        currentUserBubble = null; // ← ADD: Clear bubble on error too
    };
    
    window.speechSynthesis.speak(utterance);
    currentAudio = utterance; // ← KEEP: Your audio reference system
}

// ← KEEP: Your stopCurrentAudio function is perfect!
function stopCurrentAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    currentAudio = null;
    isSpeaking = false;
    currentUserBubble = null; // ← ADD: Clear bubble when stopping

    setTimeout(() => {
    if (isSpeaking) {
        console.log('🔄 Fallback timer - forcing speech end');
        isSpeaking = false;
        currentUserBubble = null;
        
        if (isAudioMode && !isListening) {  // ← REMOVED: && !recognition
            console.log('🔄 Fallback - starting listening');
            createRealtimeBubble();
            startListening();
        }
    }
}, 10000); // 10 second fallback
}

// ===================================================
// 📱 TEXT INPUT SYSTEM
// ===================================================
function sendTextMessage() {
    const textInput = document.getElementById('textInput');
    if (!textInput) return;
    
    const message = textInput.value.trim();
    if (!message) return;
    
    addUserMessage(message);
    textInput.value = '';
    
    setTimeout(() => {
        const response = getAIResponse(message);
        addAIMessage(response);
        speakResponse(response);
    }, 300);
}

function createRealtimeBubble() {
    // SAFETY CHECK: Prevent multiple bubbles
    if (isSpeaking) {
        console.log('🛡️ AI is speaking - delaying bubble creation');
        return;
    }
    const existingBubble = document.getElementById('currentUserBubble');
    if (existingBubble) {
        console.log('🛡️ Bubble already exists - not creating duplicate');
        return;
    }

    console.log('🔄 Creating new listening bubble...');
    playStartSound(); // Play start sound

    const chatArea = document.getElementById('chatMessages');
    const userBubble = document.createElement('div');
    userBubble.className = 'message user-message';
    userBubble.id = 'currentUserBubble';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    const bubbleText = document.createElement('div');
    bubbleText.className = 'bubble-text';
    bubbleText.textContent = 'Listening...';
    bubbleText.innerHTML = 'Listening... <span class="pulsating-dot"></span>';
    
    // Add mobile-optimized styles
    const style = document.createElement('style');
    style.textContent = `
        .pulsating-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #4CAF50;
            border-radius: 50%;
            margin-left: 8px;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        .listening-animation .message-bubble {
            animation: listening-pulse 2s infinite;
        }
        
        @keyframes listening-pulse {
            0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
            100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
    `;
    document.head.appendChild(style);
    
    messageBubble.appendChild(bubbleText);
    userBubble.appendChild(messageBubble);
    
    userBubble.classList.add('listening-animation');
    
    chatArea.appendChild(userBubble);
    scrollToBottom();
    
    console.log('✅ Realtime bubble created successfully');
}

function scrollToBottom() {
    const chatArea = document.getElementById('chatMessages');
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Make it globally available
window.createRealtimeBubble = createRealtimeBubble;


// ===================================================
// ⚡ QUICK QUESTIONS SYSTEM
// ===================================================
function askQuickQuestion(questionText) {
    console.log('🎯 Quick question clicked:', questionText);
    
    if (isSpeaking || isProcessingInput) {
        console.log('Ignoring quick question - system busy');
        return;
    }
    
    addUserMessage(questionText);
    isProcessingInput = true;
    
    setTimeout(() => {
        const response = getAIResponse(questionText);
        addAIMessage(response);
        speakResponse(response);
        
        setTimeout(() => {
            isProcessingInput = false;
        }, 500);
    }, 800);
}

// ===================================================
// 🎤 VOICE LOADING SYSTEM
// ===================================================
function getVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
            resolve(voices);
        } else {
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
// 🌐 GLOBAL FUNCTIONS
// ===================================================
window.askQuickQuestion = function(question) {
    askQuickQuestion(question);
};

// ===================================================
// 🚀 INITIALIZATION SYSTEM
// ===================================================
function initializeVoiceChat() {
    console.log('🚀 Initializing Voice Chat Module...');
    
    initializeSpeechRecognition();
    preloadVoices();
    
    console.log('✅ Voice Chat Module Ready!');
}

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceChat(); // ← INITIALIZE THE SYSTEM
    
    // 📱 Check if mobile and log it
    if (isMobileDevice()) {
        console.log('📱 Mobile device detected - microphone will require explicit permission');
    }
});

console.log('🎯 Mobile-Wise AI Voice Chat - COMPLETE INTEGRATED SYSTEM LOADED!');
