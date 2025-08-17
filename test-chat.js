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
// WAIT FOR DOM TO BE READY
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
    
    // Wait a bit more to ensure all elements are rendered
    setTimeout(() => {
        initializeSpeechRecognition();
        bindEventListeners();
        console.log('✅ NCI Business Chat Interface Ready!');
    }, 100);
}

function bindEventListeners() {
    console.log('🔧 Binding event listeners...');
    
    // Check if elements exist before binding
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
    } else {
        console.log('❌ Activate mic button not found');
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
// SPEECH RECOGNITION SETUP
// ===========================================
function initializeSpeechRecognition() {
    console.log('🎤 Initializing speech recognition...');
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('🎤 Speech recognition started');
            isListening = true;
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.trim();
            console.log('🎤 Voice input received:', transcript);
            
            if (transcript && transcript.length > 0) {
                handleVoiceInput(transcript);
            }
        };

        recognition.onend = function() {
            console.log('🎤 Speech recognition ended');
            isListening = false;
            
            if (isAudioMode && !currentAudio) {
                setTimeout(() => {
                    startListening();
                }, 2000);
            }
        };

        recognition.onerror = function(event) {
            console.log('🚫 Speech recognition error:', event.error);
            isListening = false;
            
            if (event.error === 'no-speech' && isAudioMode) {
                setTimeout(() => {
                    if (isAudioMode && !currentAudio) {
                        startListening();
                    }
                }, 3000);
            }
        };
        
        console.log('✅ Speech recognition initialized');
    } else {
        console.log('❌ Speech recognition not supported');
    }
}

// ===========================================
// MICROPHONE ACTIVATION
// ===========================================
async function activateMicrophone() {
    console.log('🎤 Activating microphone...');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Microphone permission granted');
        
        stream.getTracks().forEach(track => track.stop());
        micPermissionGranted = true;
        
        const splashScreen = document.getElementById('splashScreen');
        const chatInterface = document.getElementById('chatInterface');
        
        if (splashScreen) splashScreen.style.display = 'none';
        if (chatInterface) chatInterface.style.display = 'flex';
        
        console.log('✅ Interface switched to chat mode');
        
        isAudioMode = true;
        showAudioMode();
        showVoiceBanner();
        
        setTimeout(() => {
            startListening();
        }, 1000);
        
        setTimeout(() => {
            const greeting = "What can I help you with?";
            addAIMessage(greeting);
            speakResponse(greeting);
        }, 1500);
        
    } catch (error) {
        console.log('❌ Microphone permission denied:', error);
        alert('Microphone access is required for voice chat. Please allow microphone access and try again.');
    }
}

function startListening() {
    if (!recognition || isListening) {
        console.log('🚫 Cannot start listening - recognition not available or already listening');
        return;
    }
    
    // Only check micPermissionGranted, don't require new permission
    if (!micPermissionGranted) {
        console.log('🚫 Microphone permission not granted yet');
        return;
    }
    
    try {
        console.log('🎤 Starting speech recognition...');
        recognition.start();
    } catch (error) {
        console.log('❌ Error starting recognition:', error);
        // Don't retry if it's a permission error
        if (error.name !== 'NotAllowedError') {
            setTimeout(() => {
                if (isAudioMode && !isListening) {
                    startListening();
                }
            }, 2000);
        }
    }
}

function stopListening() {
    if (recognition && isListening) {
        console.log('🛑 Stopping speech recognition...');
        recognition.stop();
        isListening = false;
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
    stopListening();
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
    
    setTimeout(() => {
        startListening();
    }, 500);
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
// GLOBAL FUNCTIONS (for onclick handlers)
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
// ELEVENLABS VOICE SYNTHESIS
// ===========================================
async function speakResponse(message) {
    console.log('🎵 Speaking response:', message);
    
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: message,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
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
        const audio = new Audio(audioUrl);
        audio.volume = 0.9;
        
        currentAudio = audio;
        
        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
            console.log('✅ ElevenLabs audio completed');
            
            if (isAudioMode && !isListening) {
                setTimeout(() => {
                    startListening();
                }, 1000);
            }
        };
        
        audio.onerror = (error) => {
            console.log('❌ Audio playback error:', error);
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
            fallbackSpeech(message);
        };
        
        await audio.play();
        console.log('🎵 ElevenLabs audio playing...');
        
    } catch (error) {
        console.log('❌ ElevenLabs failed:', error);
        fallbackSpeech(message);
    }
}

function fallbackSpeech(message) {
    console.log('🔄 Using browser speech fallback');
    
    if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        currentAudio = utterance;
        
        utterance.onend = () => {
            currentAudio = null;
            console.log('✅ Browser speech completed');
            
            if (isAudioMode && !isListening) {
                setTimeout(() => {
                    startListening();
                }, 1000);
            }
        };
        
        window.speechSynthesis.speak(utterance);
    }
}

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

console.log('📁 NCI Business Chat JavaScript Loaded!');