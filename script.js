/**
 * NCI AI VOICE BOT - JAVASCRIPT FUNCTIONALITY
 * Professional Template System
 * 
 * This file contains all the interactive functionality
 * for the NCI AI Voice Bot template system.
 */

// ===========================================
// GLOBAL VARIABLES AND CONFIGURATION
// ===========================================

// ===========================================
// ELEVENLABS CONFIGURATION - ADD THIS FIRST
// ===========================================
const ELEVENLABS_API_KEY = 'sk_9e7fa2741be74e8cc4af95744fe078712c1e8201cdcada93';
const VOICE_ID = 'zGjIP4SZlMnY9m93k97r'; // Hope voice

// CHAT SYSTEM VARIABLES - ADD THESE TOO
let recognition = null;
let isListening = false;
let isVoiceChatMode = false;

const VoiceBot = {
    // Configuration
    config: {
        voiceEnabled: false,
        currentSlide: 'voice-chat',
        mobileBreakpoint: 768,
        avatarVideoPlayed: false,
        
        // Client Customization Variables
        clientName: 'New Clients Inc',
        primaryColor: '#2196F3',
        secondaryColor: '#4CAF50',
        
        // API Endpoints (to be configured per client)
        apiEndpoints: {
            vapi: 'https://na-vg-edge.moeaymandev.workers.dev',
            twilio: '+1 949 881 6456',
            workspace: 'vg_RBYIuhZPlUniit68ypYz'
        }
    },

    // DOM Elements
    elements: {
        hamburger: null,
        sidebar: null,
        mainArea: null,
        slideContent: null,
        menuItems: null,
        avatarVideo: null,
        staticAvatar: null
    },

    // Initialize the voice bot
    init() {
        console.log('🚀 NCI Voice Bot Initializing...');
        this.cacheDOMElements();
        this.bindEvents();
        this.setupResponsive();
        this.setupAvatarVideo();
        this.loadSlide('voice-chat');
        console.log('✅ NCI Voice Bot Ready!');
    },

    // Cache DOM elements for performance
    cacheDOMElements() {
        this.elements.hamburger = document.getElementById('hamburger');
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.mainArea = document.getElementById('mainArea');
        this.elements.slideContent = document.getElementById('slideContent');
        this.elements.menuItems = document.querySelectorAll('.menu-item');
        this.elements.avatarVideo = document.getElementById('avatarVideo');
        this.elements.staticAvatar = document.getElementById('staticAvatar');
        // Force avatar video to be ready for click
if (this.elements.avatarVideo) {
    this.elements.avatarVideo.style.display = 'block';
    this.elements.avatarVideo.style.cursor = 'pointer';
    this.elements.avatarVideo.muted = true; // Helps with autoplay policies
    this.elements.avatarVideo.load(); // Preload the video
}
    }
};

// ===========================================
// AVATAR VIDEO FUNCTIONALITY
// ===========================================

VoiceBot.setupAvatarVideo = function() {
    if (this.elements.avatarVideo) {
        // Play video on load
        this.elements.avatarVideo.play().catch(error => {
            console.log('Auto-play blocked, showing static avatar');
            showStaticAvatar();
        });

        // Handle video end
        this.elements.avatarVideo.addEventListener('ended', () => {
            this.showStaticAvatar();
        });

        // Handle video error
        this.elements.avatarVideo.addEventListener('ended', () => {
    showStaticAvatar(); // ✅ CALLS GLOBAL FUNCTION
});
    }
};

// ===========================================
// SPEECH RECOGNITION SETUP - ADD THIS ENTIRE SECTION
// ===========================================
VoiceBot.initializeSpeechRecognition = function() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.trim();
            console.log('🎤 Speech recognized:', transcript);
            
            if (isVoiceChatMode) {
                handleVoiceChatInput(transcript);
            }
        };

        recognition.onend = function() {
            isListening = false;
            updateListenButton();
        };

        recognition.onerror = function(event) {
            console.log('Speech recognition error:', event.error);
            isListening = false;
            updateListenButton();
        };
    }
};

// Global function for video onended (called from HTML)
function showStaticAvatar() {
    // VoiceBot.showStaticAvatar(); // Method doesn't exist yet
console.log('Video ended - static avatar should show');
}

// Comment out these lines that force static avatar:
// if (this.elements.avatarVideo && this.elements.staticAvatar) {
//     this.elements.avatarVideo.style.display = 'none';
//     this.elements.staticAvatar.style.display = 'block';
//     this.isAvatarVideoPlayed = true;
//     console.log('🔄 Switched to static avatar');
// }

// ===========================================
// EVENT BINDING AND HANDLERS
// ===========================================

VoiceBot.bindEvents = function() {
    // Hamburger menu toggle
    if (this.elements.hamburger) {
        this.elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Menu item clicks
    this.elements.menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const slideType = item.dataset.slide;
            
            // 🚀 NEW: If it's AI Voice Chat, open chat interface!
            if (slideType === 'voice-chat') {
                this.startQuestionChat();
            } else {
                this.loadSlide(slideType);
            }
            
            this.setActiveMenuItem(item);
            this.closeMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!this.elements.sidebar.contains(e.target) && 
            !this.elements.hamburger.contains(e.target)) {
            this.closeMobileMenu();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
};

// ===========================================
// ELEVENLABS VOICE FUNCTION - ADD THIS
// ===========================================
async function speakWithElevenLabs(message) {
    try {
        console.log('🎤 Generating ElevenLabs voice for:', message);
        
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
        
        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            console.log('✅ ElevenLabs voice completed');
        };
        
        await audio.play();
        console.log('🎵 ElevenLabs audio playing...');
        
    } catch (error) {
        console.log('ElevenLabs failed:', error);
        // Fallback to browser speech if needed
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.speak(utterance);
        }
    }
}

// ===========================================
// CHAT INTERFACE SYSTEM - ADD THIS ENTIRE SECTION
// ===========================================
VoiceBot.startQuestionChat = function() {
    this.closeAllAIInterfaces();
    this.createEnhancedChatInterface();
    
    setTimeout(() => {
        this.addAIMessage("Hi! I'm your mortgage expert with a headset ready to help! You can type questions or click the microphone to speak with me! 🎤");
        this.addAIMessage("I can help with: Loan types, qualification, down payments, interest rates, and more!");
        this.showMortgageQuickOptions(); // ← YOUR QUICK BUTTONS!
        speakWithElevenLabs("Hi! I'm your mortgage expert ready to help! You can type questions or click the microphone to speak with me!");
    }, 500);
};

VoiceBot.createEnhancedChatInterface = function() {
    const chatHTML = `
        <div id="aiChatInterface" style="
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 90%; max-width: 500px; height: 600px; background: white; 
            border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000; display: flex; flex-direction: column;
        ">
            <!-- Enhanced Header with Avatar -->
            <div style="
                background: linear-gradient(135deg, #2196F3, #1976D2); color: white; 
                padding: 15px; border-radius: 15px 15px 0 0; position: relative;
                display: flex; align-items: center; justify-content: space-between;
            ">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png" 
                         style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid white;">
                    <h3 style="margin: 0; font-size: 18px;">🎤 AI Voice-Bot</h3>
                </div>
                
                <button onclick="VoiceBot.closeAllAIInterfaces()" style="
                    background: none; border: none; color: white; font-size: 20px; cursor: pointer;
                ">❌</button>
            </div>
            
            <!-- Chat Messages -->
            <div id="chatMessages" style="
                flex: 1; padding: 15px; overflow-y: auto; background: #f8f9fa;
            "></div>
            
            <!-- Voice Indicator -->
            <div id="voiceIndicator" style="
                display: none; padding: 10px; background: #e8f5e8; border-top: 1px solid #ddd;
                text-align: center; color: #4CAF50; font-weight: bold;
            ">
                🎤 Listening... (speak now)
            </div>
            
            <!-- Enhanced Input Area with Custom Mic -->
            <div style="padding: 15px; border-top: 1px solid #eee; background: white; border-radius: 0 0 15px 15px;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" id="userChatInput" placeholder="Ask about mortgages or click mic to speak..." 
                           style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 20px; font-size: 14px;"
                           onkeypress="if(event.key==='Enter') VoiceBot.sendChatMessage()">
                    
                    <!-- Custom Mic Button -->
                    <button id="voiceChatButton" onclick="VoiceBot.toggleVoiceChat()" style="
                        background: none; border: none; cursor: pointer; padding: 5px;
                        transition: all 0.3s; border-radius: 50%;
                    " title="Click to speak">
                        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1754909837912_mic4.PNG" 
                             style="width: 50px; height: 50px;" id="micIcon">
                    </button>
                    
                    <button onclick="VoiceBot.sendChatMessage()" style="
                        background: #2196F3; color: white; border: none; border-radius: 50%;
                        width: 45px; height: 45px; cursor: pointer; font-size: 16px;
                    ">➤</button>
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #666; text-align: center;">
                    💡 Tip: Click the microphone and speak your question!
                </div>
            </div>
        </div>
        
        <div id="aiBackdrop" onclick="VoiceBot.closeAllAIInterfaces()" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 9999;
        "></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    isVoiceChatMode = true;
    document.getElementById('userChatInput').focus();
};

// ===========================================
// CHAT MESSAGING FUNCTIONS - ADD THIS
// ===========================================
VoiceBot.sendChatMessage = function() {
    const input = document.getElementById('userChatInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    this.addUserMessage(message);
    input.value = '';
    
    setTimeout(() => {
        const response = this.getSmartAIResponse(message);
        this.addAIMessage(response);
        speakWithElevenLabs(response); // Use ElevenLabs for responses
    }, 800);
};

VoiceBot.addAIMessage = function(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.insertAdjacentHTML('beforeend', `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png" 
                     style="width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;">
                <div style="
                    background: #e8f5e8; padding: 12px 16px; border-radius: 15px 15px 15px 5px;
                    max-width: 75%; font-size: 14px; line-height: 1.4; word-wrap: break-word;
                ">${message}</div>
            </div>
        </div>
    `);
    this.scrollChatToBottom();
};

VoiceBot.addUserMessage = function(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.insertAdjacentHTML('beforeend', `
        <div style="margin-bottom: 15px; text-align: right;">
            <div style="display: flex; align-items: flex-start; gap: 10px; justify-content: flex-end;">
                <div style="
                    background: #2196f3; color: white; padding: 12px 16px; 
                    border-radius: 15px 15px 5px 15px; max-width: 75%; 
                    font-size: 14px; line-height: 1.4; word-wrap: break-word;
                ">${message}</div>
                <div style="
                    background: #2196f3; color: white; border-radius: 50%; 
                    width: 30px; height: 30px; display: flex; align-items: center; 
                    justify-content: center; font-size: 14px; flex-shrink: 0;
                ">👤</div>
            </div>
        </div>
    `);
    this.scrollChatToBottom();
};

// ===========================================
// QUICK TOPIC BUTTONS - YOUR REQUESTED FEATURE!
// ===========================================
VoiceBot.showMortgageQuickOptions = function() {
    const options = `
        <div style="margin: 15px 0;">
            <p style="font-size: 12px; color: #666; margin-bottom: 8px;">Quick topics:</p>
            <button onclick="VoiceBot.askQuickQuestion('What credit score do I need?')" class="chat-quick-btn">📊 Credit Score</button>
            <button onclick="VoiceBot.askQuickQuestion('What loan types are available?')" class="chat-quick-btn">🏠 Loan Types</button>
            <button onclick="VoiceBot.askQuickQuestion('How much down payment?')" class="chat-quick-btn">💰 Down Payment</button>
            <button onclick="VoiceBot.askQuickQuestion('What are current rates?')" class="chat-quick-btn">📈 Interest Rates</button>
        </div>
        
        <style>
            .chat-quick-btn {
                background: #e3f2fd; border: 1px solid #2196f3; border-radius: 20px;
                padding: 6px 12px; margin: 2px; font-size: 11px; cursor: pointer;
                color: #1976d2; transition: all 0.3s;
            }
            .chat-quick-btn:hover {
                background: #2196f3; color: white; transform: scale(1.05);
            }
        </style>
    `;
    
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.insertAdjacentHTML('beforeend', options);
        this.scrollChatToBottom();
    }
};

VoiceBot.askQuickQuestion = function(question) {
    this.addUserMessage(question);
    setTimeout(() => {
        const response = this.getSmartAIResponse(question);
        this.addAIMessage(response);
        speakWithElevenLabs(response);
    }, 800);
};

// ===========================================
// VOICE CHAT FUNCTIONS - ADD THIS
// ===========================================
VoiceBot.toggleVoiceChat = function() {
    if (isListening) {
        this.stopVoiceChatListening();
    } else {
        this.startVoiceChatListening();
    }
};

VoiceBot.startVoiceChatListening = function() {
    if (!recognition) {
        this.addAIMessage("Sorry, voice recognition isn't supported in your browser. Please type your question instead.");
        return;
    }
    
    isListening = true;
    const indicator = document.getElementById('voiceIndicator');
    const micIcon = document.getElementById('micIcon');
    
    if (indicator) indicator.style.display = 'block';
    if (micIcon) {
        micIcon.style.filter = 'brightness(0.7) sepia(1) hue-rotate(340deg) saturate(2)';
    }
    
    try {
        recognition.start();
        console.log('✅ Speech recognition started');
    } catch (error) {
        console.log('Recognition start error:', error);
        this.stopVoiceChatListening();
    }
};

VoiceBot.stopVoiceChatListening = function() {
    isListening = false;
    if (recognition) {
        try {
            recognition.stop();
        } catch (error) {
            console.log('Recognition stop error:', error);
        }
    }
    updateListenButton();
};

// Global functions needed for speech recognition
function updateListenButton() {
    const indicator = document.getElementById('voiceIndicator');
    const micIcon = document.getElementById('micIcon');
    
    if (indicator) indicator.style.display = 'none';
    if (micIcon) {
        micIcon.style.filter = 'none';
    }
}

function handleVoiceChatInput(transcript) {
    VoiceBot.addUserMessage(transcript);
    
    setTimeout(() => {
        const response = VoiceBot.getSmartAIResponse(transcript);
        VoiceBot.addAIMessage(response);
        speakWithElevenLabs(response);
    }, 800);
    
    VoiceBot.stopVoiceChatListening();
}

// ===========================================
// AI RESPONSE SYSTEM - ADD THIS
// ===========================================
VoiceBot.getSmartAIResponse = function(message) {
    const msg = message.toLowerCase();
    
    const responses = {
        "hello": "Hello! How can I help with your mortgage questions today?",
        "hi": "Hi there! What mortgage questions can I answer for you?",
        "rate": "Current rates for a 30-year fixed mortgage start at 6.25%. Would you like me to check your specific rate?",
        "document": "Based on your application, we need your W-2, recent pay stubs, and bank statements. Is there a specific document you're asking about?",
        "closing": "Your closing is scheduled for March 15th. All required documents should be submitted by March 10th.",
        "payment": "Your estimated monthly payment is $1,850 including principal, interest, taxes, and insurance.",
        "qualification": "You need good credit, stable income, acceptable debt-to-income ratio, and down payment. Most programs require 580+ credit score.",
        "credit score": "Credit requirements: Conventional (620+), FHA (580+), VA (no minimum), USDA (640+). Higher scores get better rates!",
        "down payment": "Down payments range from 0-20%. FHA needs just 3.5%, conventional starts at 3%, VA and USDA can be 0%.",
        "loan types": "Main types are: Conventional (3% down, 620+ credit), FHA (3.5% down, 580+ credit), VA (0% down for veterans), and USDA (0% down, rural areas)."
    };
    
    for (const [key, value] of Object.entries(responses)) {
        if (msg.includes(key)) {
            return value;
        }
    }
    
    return "Great question! I'm here to help with mortgages, loan types, qualification, rates, and home buying. Could you be more specific? For example, ask me 'What credit score do I need?' or 'What are current rates?'";
};

// ===========================================
// UTILITY FUNCTIONS - ADD THIS
// ===========================================
VoiceBot.scrollChatToBottom = function() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
};

VoiceBot.closeAllAIInterfaces = function() {
    const interfaces = ['aiChatInterface', 'aiBackdrop'];
    interfaces.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.remove();
    });
    
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    isListening = false;
    isVoiceChatMode = false;
};

// ===========================================
// MOBILE MENU FUNCTIONALITY
// ===========================================

VoiceBot.toggleMobileMenu = function() {
    this.elements.sidebar.classList.toggle('active');
    this.elements.hamburger.classList.toggle('active');
};

VoiceBot.closeMobileMenu = function() {
    this.elements.sidebar.classList.remove('active');
    this.elements.hamburger.classList.remove('active');
};

VoiceBot.openMobileMenu = function() {
    this.elements.sidebar.classList.add('active');
    this.elements.hamburger.classList.add('active');
};

// ===========================================
// SLIDE MANAGEMENT SYSTEM
// ===========================================

VoiceBot.loadSlide = function(slideType) {
    console.log(`📄 Loading slide: ${slideType}`);
    this.config.currentSlide = slideType;
    
    // Add fade out effect
    this.elements.slideContent.style.opacity = '0';
    
    setTimeout(() => {
        // Generate slide content based on type
        const slideHTML = this.generateSlideContent(slideType);
        this.elements.slideContent.innerHTML = slideHTML;
        
        // Add fade in effect
        this.elements.slideContent.style.opacity = '1';
        
        // Bind new event listeners for the loaded slide
        this.bindSlideEvents(slideType);
        
    }, 200);
};

VoiceBot.generateSlideContent = function(slideType) {
    const slides = {
        'voice-chat': this.generateVoiceChatSlide(),
        'request-call': this.generateRequestCallSlide(),
        'send-message': this.generateSendMessageSlide(),
        'leave-review': this.generateLeaveReviewSlide()
    };
    
    return slides[slideType] || slides['voice-chat'];
};

VoiceBot.generateVoiceChatSlide = function() {
    return `
        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1755253677674_slide1-graphic.PNG" 
             alt="Voice Activation" 
             class="slide-graphic glow"
             onclick="VoiceBot.activateVoice()"
             style="cursor: pointer;">
        
        <p class="instruction-text">
            Click the microphone to start<br>
            your AI voice conversation
        </p>
    `;
};

VoiceBot.generateRequestCallSlide = function() {
    return `
        <div style="text-align: center; width: 100%;">
            <h2 style="color: white; margin-bottom: 30px; font-size: 24px;">📞 Request a Call</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; max-width: 400px; margin: 0 auto;">
                <form id="requestCallForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="text" placeholder="Your Name" required 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <input type="tel" placeholder="Phone # to Call" required 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <input type="text" placeholder="Best time to call?" 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <button type="submit" 
                            style="background: linear-gradient(45deg, #2196F3, #4CAF50); color: white; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                        REQUEST A CALL
                    </button>
                </form>
            </div>
        </div>
    `;
};

VoiceBot.generateSendMessageSlide = function() {
    return `
        <div style="text-align: center; width: 100%;">
            <h2 style="color: white; margin-bottom: 30px; font-size: 24px;">💬 Send Message</h2>
            <div style="display: flex; flex-direction: column; gap: 20px; max-width: 400px; margin: 0 auto;">
                <button onclick="VoiceBot.selectMessageType('general')" 
                        style="background: linear-gradient(45deg, #2196F3, #1976D2); color: white; border: none; padding: 20px; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.3s ease;">
                    📝 Select for General Messages
                </button>
                <button onclick="VoiceBot.selectMessageType('business')" 
                        style="background: linear-gradient(45deg, #4CAF50, #388E3C); color: white; border: none; padding: 20px; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.3s ease;">
                    💼 Select for Business Interview
                </button>
            </div>
        </div>
    `;
};

VoiceBot.generateLeaveReviewSlide = function() {
    return `
        <div style="text-align: center; width: 100%;">
            <h2 style="color: white; margin-bottom: 30px; font-size: 24px;">⭐ Leave a Review</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; max-width: 450px; margin: 0 auto;">
                <p style="color: white; margin-bottom: 20px; font-size: 16px;">Share your experience with our services</p>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button onclick="VoiceBot.startVideoReview(1)" 
                            style="background: #2196F3; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                        📹 Q-1 START
                    </button>
                    <p style="color: #ccc; font-size: 14px; margin: 0;">What business challenges were you facing?</p>
                    
                    <button onclick="VoiceBot.stopRecording()" 
                            style="background: #f44336; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                        ⏹️ STOP
                    </button>
                    
                    <button onclick="VoiceBot.finishReview()" 
                            style="background: #4CAF50; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                        ✅ All Done!
                    </button>
                </div>
            </div>
        </div>
    `;
};

// ===========================================
// MENU MANAGEMENT
// ===========================================

VoiceBot.setActiveMenuItem = function(activeItem) {
    // Remove active class from all items
    this.elements.menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected item
    activeItem.classList.add('active');
};

// ===========================================
// VOICE FUNCTIONALITY (PLACEHOLDER FOR NOW)
// ===========================================

VoiceBot.activateMicrophone = function() {
    console.log('🎤 Microphone activation - functionality to be added');
    alert('Voice functionality will be added in the next phase!');
};

// ===========================================
// VOICE ACTIVATION FUNCTIONALITY
// ===========================================

VoiceBot.activateVoice = function() {
    console.log('🎤 Voice activation clicked!');
    
    const avatarVideo = document.getElementById('avatarVideo');
    if (avatarVideo) {
        // Show and play the avatar
        avatarVideo.style.visibility = 'visible'; // Make it visible
        avatarVideo.style.display = 'block';
        avatarVideo.currentTime = 0;
        avatarVideo.muted = false; // Enable sound
        avatarVideo.loop = false; // No looping
        avatarVideo.play().then(() => {
            console.log('✅ Avatar now visible and playing with sound!');
        }).catch(error => {
            console.log('❌ Avatar play failed:', error);
        });
    }
    
    // Enable voice in config
    this.config.voiceEnabled = true;
};

VoiceBot.init

VoiceBot.updateVoiceStatus = function(active) {
    const instruction = document.querySelector('.instruction-text');
    if (instruction && active) {
        instruction.innerHTML = 'Voice activated! 🎤<br>Listening for your input...';
        instruction.style.color = '#4CAF50';
    }
};

VoiceBot.playAvatar = function() {
    console.log('🎤 Microphone clicked - Playing avatar video');
    
    const avatarVideo = document.getElementById('avatarVideo');
    if (avatarVideo) {
        avatarVideo.currentTime = 0; // Start from beginning
        avatarVideo.play().then(() => {
            console.log('✅ Avatar video playing');
        }).catch(error => {
            console.log('❌ Video play error:', error);
        });
    }
};

// ===========================================
// FORM HANDLING
// ===========================================

VoiceBot.bindSlideEvents = function(slideType) {
    switch (slideType) {
        case 'request-call':
            const callForm = document.getElementById('requestCallForm');
            if (callForm) {
                callForm.addEventListener('submit', (e) => this.handleCallRequest(e));
            }
            break;
    }
};

VoiceBot.handleCallRequest = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('📞 Call request submitted:', data);
    
    // TODO: Integration with VAPI/Twilio
    alert('Call request submitted! We will contact you soon.');
    
    // Reset form
    e.target.reset();
};

VoiceBot.selectMessageType = function(type) {
    console.log('💬 Message type selected:', type);
    
    if (type === 'general') {
        this.loadGeneralMessageForm();
    } else if (type === 'business') {
        this.loadBusinessInterviewForm();
    }
};

VoiceBot.loadGeneralMessageForm = function() {
    const content = `
        <div style="text-align: center; width: 100%;">
            <h2 style="color: white; margin-bottom: 30px; font-size: 24px;">📝 General Message</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; max-width: 450px; margin: 0 auto;">
                <form id="generalMessageForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <textarea placeholder="Share your thoughts, questions, or feedback..." required 
                              style="padding: 15px; border: none; border-radius: 8px; font-size: 14px; resize: vertical; min-height: 120px; font-family: inherit;"></textarea>
                    <input type="text" placeholder="Your Name" required 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <input type="email" placeholder="Your email address" required 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <button type="submit" 
                            style="background: linear-gradient(45deg, #4CAF50, #388E3C); color: white; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                        SEND MESSAGE
                    </button>
                </form>
            </div>
        </div>
    `;
    
    this.elements.slideContent.innerHTML = content;
    
    // Bind form submission
    setTimeout(() => {
        const form = document.getElementById('generalMessageForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleGeneralMessage(e));
        }
    }, 100);
};

VoiceBot.loadBusinessInterviewForm = function() {
    // Business interview functionality
    alert('Business interview functionality will be added in next phase!');
};

VoiceBot.handleGeneralMessage = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('📧 General message submitted:', data);
    alert('Message sent successfully! We will get back to you soon.');
    
    e.target.reset();
};

// ===========================================
// VIDEO TESTIMONIAL FUNCTIONALITY
// ===========================================

VoiceBot.startVideoReview = function(questionNumber) {
    console.log(`📹 Starting video review for question ${questionNumber}`);
    alert(`Starting video recording for question ${questionNumber}. (Video functionality will be implemented in next phase)`);
};

VoiceBot.stopRecording = function() {
    console.log('⏹️ Stopping video recording');
    alert('Video recording stopped.');
};

VoiceBot.finishReview = function() {
    console.log('✅ Finishing video review');
    alert('Thank you for your review! Your videos will be processed shortly.');
};

// ===========================================
// RESPONSIVE AND UTILITY FUNCTIONS
// ===========================================

VoiceBot.setupResponsive = function() {
    // Handle window resize
    window.addEventListener('resize', () => {
        this.handleResize();
    });
    
    // Initial responsive setup
    this.handleResize();
};

VoiceBot.handleResize = function() {
    const width = window.innerWidth;
    
    if (width <= this.config.mobileBreakpoint) {
        // Mobile mode
        this.closeMobileMenu();
    } else {
        // Desktop mode
        this.elements.sidebar.classList.remove('active');
        this.elements.hamburger.classList.remove('active');
    }
};

VoiceBot.handleKeyboardShortcuts = function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        this.closeMobileMenu();
    }
};

// ===========================================
// CLIENT CUSTOMIZATION FUNCTIONS
// ===========================================

VoiceBot.customizeForClient = function(clientConfig) {
    // Update client-specific configuration
    if (clientConfig.name) this.config.clientName = clientConfig.name;
    if (clientConfig.primaryColor) this.config.primaryColor = clientConfig.primaryColor;
    if (clientConfig.secondaryColor) this.config.secondaryColor = clientConfig.secondaryColor;
    if (clientConfig.logo) this.updateLogo(clientConfig.logo);
    if (clientConfig.avatar) this.updateAvatar(clientConfig.avatar);
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--primary-color', this.config.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', this.config.secondaryColor);
    
    console.log('🎨 Client customization applied:', clientConfig);
};


VoiceBot.updateLogo = function(logoUrl) {
    const logo = document.querySelector('.nci-logo');
    if (logo) {
        logo.src = logoUrl;
    }
};

VoiceBot.updateAvatar = function(avatarUrl) {
    const avatar = document.querySelector('.avatar-img');
    if (avatar) {
        avatar.src = avatarUrl;
    }
};

// ===========================================
// INITIALIZATION
// ===========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    VoiceBot.init();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', VoiceBot.init.bind(VoiceBot));
} else {
    VoiceBot.init();
}

// Export for global access (if needed)
window.VoiceBot = VoiceBot;

console.log('📁 NCI Voice Bot JavaScript Loaded Successfully!');