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
let micPermissionGranted = false;
let micStream = null;
let hasStartedOnce = false; // 🔥 NEW: Track if we've started recognition
let persistentMicStream = null; // Holds the microphone permission
let isSpeaking = false; // Prevent recognition restarts during speech
let recognitionStarting = false; // Prevent multiple simultaneous starts

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
                
                if (transcript && transcript.length > 0) {
                    handleVoiceInput(transcript);
                }
            }
        };

        recognition.onend = function() {
            console.log('🎤 Speech recognition ended unexpectedly');
            isListening = false;
            
            // Don't restart if AI is speaking
            if (isSpeaking) {
                console.log('⏸️ Not restarting - AI is speaking');
                return;
            }
            
            // Only restart if still in audio mode
            if (isAudioMode && micPermissionGranted) {
                console.log('⚠️ Restarting recognition due to unexpected end...');
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (error) {
                        console.log('Recognition restart error:', error);
                    }
                }, 1000);
            }
        };

        recognition.onerror = function(event) {
            console.log('🚫 Speech recognition error:', event.error);
            isListening = false;
            
            // Don't restart on permission errors
            if (event.error === 'not-allowed') {
                console.log('❌ Microphone permission denied');
                micPermissionGranted = false;
                return;
            }
            
            // Only restart for network errors
            if (event.error === 'network' || event.error === 'service-not-allowed') {
                if (isAudioMode && micPermissionGranted && !isSpeaking) {
                    setTimeout(() => {
                        try {
                            recognition.start();
                        } catch (error) {
                            console.log('Error recovery failed:', error);
                        }
                    }, 3000);
                }
            }
        };
        
        console.log('✅ Speech recognition initialized with continuous mode');
    } else {
        console.log('❌ Speech recognition not supported');
    }
}

// ===========================================
// 🔥 START RECOGNITION WITH CALL LOCK
// ===========================================
async function startRecognitionOnce() {
    console.log('🎤 startRecognitionOnce called, isListening:', isListening, 'recognitionStarting:', recognitionStarting);
    
    // Prevent multiple simultaneous calls
    if (recognitionStarting) {
        console.log('🚫 Recognition already starting - skipping this call');
        return;
    }
    
    // Don't start if already listening or no permission
    if (isListening || !recognition || !micPermissionGranted || !isAudioMode) {
        console.log('🚫 Cannot start recognition - requirements not met');
        return;
    }

    recognitionStarting = true; // Lock to prevent other calls
    
    try {
        console.log('🎤 Starting continuous speech recognition...');
        recognition.start();
        isListening = true;
    } catch (error) {
        console.log('❌ Error starting recognition:', error);
        
        // If it's already started, that's actually fine
        if (error.message && error.message.includes('already started')) {
            console.log('✅ Recognition already running - this is fine');
            isListening = true;
        } else {
            isListening = false;
        }
    } finally {
        recognitionStarting = false; // Unlock after attempt
    }
}

// ===========================================
// MICROPHONE ACTIVATION
// ===========================================
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    try {
        // Get persistent microphone permission
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('🎤 Mic permission GRANTED and HELD OPEN');
        micPermissionGranted = true;
        
        // Store the persistent stream
        persistentMicStream = micStream;
        
        // Switch to audio mode
        switchToAudioMode();
        
        // Start recognition with existing permission
        setTimeout(() => {
            startRecognitionOnce();
        }, 1000);
        
    } catch (error) {
        console.log('❌ Microphone access denied:', error);
        alert('Microphone access was denied. You can still type messages!');
    }
}

function stopPersistentMicrophone() {
    if (persistentMicStream) {
        persistentMicStream.getTracks().forEach(track => track.stop());
        persistentMicStream = null;
        console.log('🛑 Persistent microphone stream stopped');
    }
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
    console.log('📝 User switched to text mode');
    isAudioMode = false;
    
    // Stop recognition when switching to text mode
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
    }
    
    hideVoiceBanner();
    showTextMode();
    
    const textInput = document.getElementById('textInput');
    if (textInput) {
        setTimeout(() => textInput.focus(), 100);
    }
}

function switchToAudioMode() {
    console.log('🎤 User switched back to audio mode');
    isAudioMode = true;
    showAudioMode();
    showVoiceBanner();
    
    const textInput = document.getElementById('textInput');
    if (textInput) textInput.value = '';
    
    // Only start if not already listening
    if (micPermissionGranted && !isListening) {
        setTimeout(() => {
            startRecognitionOnce();
        }, 1000);
    }
}

// ===========================================
// VOICE BANNER CONTROL
// ===========================================
function showVoiceBanner() {
    const banner = document.getElementById('voiceBanner');
    if (banner) {
        banner.style.display = 'block';
        console.log('✅ Voice banner shown');
    }
}

function hideVoiceBanner() {
    const banner = document.getElementById('voiceBanner');
    if (banner) {
        banner.style.display = 'none';
        console.log('✅ Voice banner hidden');
    }
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
    
    // Use browser voice synthesis
    await fallbackSpeech(message);
}

async function fallbackSpeech(message) {
    console.log('🔄 Using improved browser speech');
    
    if (!window.speechSynthesis) {
        console.log('❌ Speech synthesis not supported');
        return;
    }

    // Wait for voices to be loaded
    const voices = await getVoices();
    speakWithVoice(message, voices);
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

function speakWithVoice(message, voices) {
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Your existing voice selection code...
    let bestVoice = findBestVoice(voices);
    if (bestVoice) {
        utterance.voice = bestVoice;
        console.log('🎵 Selected voice:', bestVoice.name, bestVoice.lang);
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // 🔥 SET THE isSpeaking FLAG
    utterance.onstart = () => {
        isSpeaking = true;
        console.log('🎵 Speech started - blocking mic restarts');
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        currentAudio = null;
        console.log('✅ Speech finished - mic restarts allowed');
    };
    
    utterance.onerror = (event) => {
        isSpeaking = false; // Reset on error
        console.log('❌ Speech error:', event.error);
    };
    
    currentAudio = utterance;
    window.speechSynthesis.speak(utterance);
}

function restartRecognition() {
    if (isSpeaking) {
        console.log('⏸️ Skipping recognition restart - AI is speaking');
        return;
    }
    
    console.log('🔄 Restarting speech recognition...');
    if (recognition && micPermissionGranted) {
        try {
            recognition.start();
        } catch (error) {
            console.log('Recognition restart error:', error);
        }
    }
}

function findBestVoice(voices) {
    // Priority order for voice selection
    const voicePreferences = [
        // High-quality voices (varies by OS)
        { keywords: ['Google'], lang: 'en-US' },
        { keywords: ['Microsoft', 'Zira'], lang: 'en-US' },
        { keywords: ['Samantha'], lang: 'en-US' },
        { keywords: ['Karen'], lang: 'en-AU' },
        { keywords: ['Alex'], lang: 'en-US' },
        { keywords: ['Victoria'], lang: 'en-US' },
        // Fallback to any English voice
        { keywords: [], lang: 'en' }
    ];
    
    for (const preference of voicePreferences) {
        const voice = voices.find(v => {
            const matchesLang = v.lang.startsWith(preference.lang);
            const matchesKeywords = preference.keywords.length === 0 || 
                preference.keywords.some(keyword => v.name.includes(keyword));
            return matchesLang && matchesKeywords;
        });
        
        if (voice) {
            return voice;
        }
    }
    
    return null;
}

function stopCurrentAudio() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        console.log('🛑 Speech stopped');
    }
    currentAudio = null;
}

// Preload voices on page load
function preloadVoices() {
    getVoices().then(voices => {
        console.log('🎵 Voices preloaded:', voices.length);
    });
}

// Call this during initialization
document.addEventListener('DOMContentLoaded', preloadVoices);


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

// ===========================================
// INITIALIZE WHEN READY
// ===========================================
initializeWhenReady();

console.log('📁 NCI Business Chat JavaScript Loaded - ULTIMATE MIC FIX!');