// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATION WITH KNOWLEDGE BASE
// Smart Button + Lead Capture + EmailJS + Banner System + Knowledge Base
// ===================================================

// ===================================================
// 🧠 KNOWLEDGE BASE SYSTEM
// ===================================================
class KnowledgeBaseSystem {
    constructor() {
        this.knowledgeBases = new Map();
        this.currentIndustry = null;
        this.conversationHistory = [];
        this.userProfile = {
            firstName: '',
            interests: [],
            inquiryType: null
        };
        console.log('🧠 Knowledge Base System initialized');
    }

    // Load embedded CPA knowledge base
    async loadKnowledgeBase(industry) {
        if (this.knowledgeBases.has(industry)) {
            return this.knowledgeBases.get(industry);
        }

        // Embedded CPA knowledge base
        const knowledgeBase = {
            industry: "CPA Practice Sales",
            greeting: "Hi! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. What's your first name?",
            questions: [
                {
                    patterns: ["buy", "buying", "purchase", "acquire"],
                    keywords: ["practice", "firm"],
                    response: "Excellent! Bruce has some fantastic opportunities available right now - some exclusive off-market deals. What's your budget range for acquiring a practice?",
                    followUp: "Would you like to see some available practices?",
                    triggerBanner: "freeBookWithConsultation"
                },
                {
                    patterns: ["sell", "selling"],
                    keywords: ["practice", "firm", "business"],
                    response: "That's fantastic! You've probably built something really special. Do you have any concerns about selling that I can help address?",
                    followUp: "Would you like a FREE consultation to discuss your strategy?",
                    triggerBanner: "freeBookWithConsultation"
                },
                {
                    patterns: ["value", "worth", "valuation", "evaluate"],
                    keywords: ["practice", "firm"],
                    response: "Perfect! Bruce can provide a FREE valuation. Most owners are shocked at what their practice is worth. What's your approximate annual revenue?",
                    followUp: "Would you like Bruce to provide a detailed analysis?",
                    triggerBanner: "freeBookWithConsultation"
                },
                {
                    patterns: ["how long", "timeline", "time"],
                    keywords: ["sell", "sale", "process"],
                    response: "Great question! Bruce's proven system usually gets practices sold within 3-6 months. Some sell even faster with the right positioning.",
                    followUp: "Would you like to learn about Bruce's accelerated process?"
                },
                {
                    patterns: ["price", "cost", "fee", "commission"],
                    keywords: ["sell", "buy"],
                    response: "Bruce works on a success-fee basis - you only pay when your practice sells. His fees are competitive and he guarantees results.",
                    followUp: "Would you like to discuss the fee structure with Bruce?"
                },
                {
                    patterns: ["experience", "background", "credentials", "who is bruce"],
                    keywords: ["bruce", "broker"],
                    response: "Bruce has over 20 years of experience exclusively in CPA practice sales. He's helped hundreds of practice owners achieve successful transitions.",
                    followUp: "Would you like to hear what his recent clients have said?",
                    triggerTestimonial: "credibility"
                },
                {
                    patterns: ["concerned", "worried", "afraid", "not sure"],
                    keywords: ["selling", "value", "price"],
                    response: "I totally understand those concerns. Let me show you what one of Bruce's recent clients said about that exact situation...",
                    triggerTestimonial: "skeptical"
                }
            ],
            leadCaptureTriggers: ["consultation", "help", "information", "schedule", "call", "contact"]
        };
        
        this.knowledgeBases.set(industry, knowledgeBase);
        return knowledgeBase;
    }

    // Auto-detect industry from user input
    detectIndustry(userInput) {
        return 'cpa-practice-sales'; // Default for now
    }

    // Find best matching response
    findBestResponse(userInput, knowledgeBase) {
        const input = userInput.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;
        
        for (const question of knowledgeBase.questions) {
            let score = 0;
            
            for (const pattern of question.patterns) {
                if (input.includes(pattern.toLowerCase())) {
                    score += 3;
                }
            }
            
            if (question.keywords) {
                for (const keyword of question.keywords) {
                    if (input.includes(keyword.toLowerCase())) {
                        score += 1;
                    }
                }
            }
            
            if (score > highestScore) {
                highestScore = score;
                bestMatch = question;
            }
        }
        
        return bestMatch;
    }

    // Process conversation with knowledge base
    async processConversation(userInput, currentState) {
        // Auto-detect industry if not set
        if (!this.currentIndustry) {
            this.currentIndustry = this.detectIndustry(userInput);
            console.log(`🔍 Using industry: ${this.currentIndustry}`);
        }

        // Load knowledge base
        const knowledgeBase = await this.loadKnowledgeBase(this.currentIndustry);
        
        // Handle name collection
        if (currentState === 'getting_first_name') {
            const words = userInput.trim().split(' ');
            const extractedName = words[0].replace(/[^a-zA-Z]/g, '');
            if (extractedName.length > 0) {
                this.userProfile.firstName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
                window.leadData.firstName = this.userProfile.firstName;
                
                return {
                    response: `Great to meet you ${this.userProfile.firstName}! How can I help you today - are you looking to buy a practice, sell your practice, or get a practice valuation?`,
                    newState: 'conversational',
                    triggerBanner: null
                };
            } else {
                return {
                    response: "I didn't catch your name. What should I call you?",
                    newState: 'getting_first_name',
                    triggerBanner: null
                };
            }
        }

        // Initial greeting
        if (currentState === 'initial' && !this.userProfile.firstName) {
            return {
                response: knowledgeBase.greeting,
                newState: 'getting_first_name',
                triggerBanner: null
            };
        }

        // Find best response from knowledge base
        const matchedQuestion = this.findBestResponse(userInput, knowledgeBase);
        
        if (matchedQuestion) {
            let response = matchedQuestion.response;
            
            // Personalize with first name if available
            if (this.userProfile.firstName) {
                response = response.replace(/Excellent!/, `Excellent ${this.userProfile.firstName}!`);
                response = response.replace(/Perfect!/, `Perfect ${this.userProfile.firstName}!`);
                response = response.replace(/That's fantastic!/, `That's fantastic ${this.userProfile.firstName}!`);
                response = response.replace(/Great question!/, `Great question ${this.userProfile.firstName}!`);
            }
            
            return {
                response: response,
                newState: 'conversational',
                followUp: matchedQuestion.followUp || null,
                triggerBanner: matchedQuestion.triggerBanner || null,
                triggerTestimonial: matchedQuestion.triggerTestimonial || null
            };
        }

        // Fallback response
        const fallbackResponse = this.userProfile.firstName ? 
            `${this.userProfile.firstName}, that's a great question! Let me connect you with Bruce who can provide detailed information about that. Would you like to schedule a FREE consultation?` :
            "That's a great question! Let me connect you with Bruce who can provide detailed information. Would you like to schedule a consultation?";
            
        return {
            response: fallbackResponse,
            newState: 'conversational',
            triggerBanner: 'consultation'
        };
    }
}

// Initialize global knowledge base system
window.knowledgeBase = new KnowledgeBaseSystem();

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
if (isDefinitelyMobile || (typeof event !== 'undefined' && event && event.error === 'no-speech')) {
    console.log('📱 NUCLEAR MOBILE DETECTED: Using visual feedback system');
}

// ===================================================
// 🧠 NEW KNOWLEDGE BASE POWERED getAIResponse FUNCTION
// ===================================================
async function getAIResponse(userInput) {
    // ✅ STOP PROCESSING IF CONVERSATION IS ENDED
    if (conversationState === 'ended') {
        return "Thank you for visiting! Have a great day.";
    }
    
    console.log('🧠 Processing with Knowledge Base:', userInput);
    
    try {
        // Use knowledge base system to process conversation
        const result = await window.knowledgeBase.processConversation(userInput, conversationState);
        
        // Update conversation state
        if (result.newState) {
            conversationState = result.newState;
        }
        
        // Trigger banners if specified
        if (result.triggerBanner) {
            setTimeout(() => {
                if (result.triggerBanner === 'freeBookWithConsultation') {
                    showUniversalBanner('freeBookWithConsultation');
                } else if (result.triggerBanner === 'consultation') {
                    showUniversalBanner('avatar');
                }
            }, 2000);
        }
        
        // Trigger testimonials if specified
        if (result.triggerTestimonial) {
            setTimeout(() => {
                if (typeof showTestimonialVideo === 'function') {
                    showTestimonialVideo(result.triggerTestimonial, 12000);
                    console.log(`🎙️ Showing ${result.triggerTestimonial} testimonial`);
                }
            }, 2000);
        }
        
        return result.response;
        
    } catch (error) {
        console.error('❌ Knowledge Base Error:', error);
        
        // Fallback to simple response
        const firstName = window.leadData.firstName || '';
        const fallbackResponse = firstName ? 
            `${firstName}, that's a great question! Let me connect you with Bruce who can provide detailed information about that. Would you like to schedule a FREE consultation?` :
            "That's a great question! Let me connect you with Bruce who can provide detailed information. Would you like to schedule a consultation?";
        
        // Show consultation banner as fallback
        setTimeout(() => {
            showUniversalBanner('avatar');
        }, 2000);
        
        return fallbackResponse;
    }
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
}
        completeLeadCollection();

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
            
        }, 7000);
        
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
});// ===================================================================
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
