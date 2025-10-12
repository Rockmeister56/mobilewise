// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - CLEANED VERSION
// Duplicates removed, dead wood eliminated, optimized for performance
// ===================================================

// GLOBAL DATA INITIALIZATION
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

if (typeof window.conversationState === 'undefined') {
    window.conversationState = 'initial';
}

// ===================================================
// 🏗️ ESSENTIAL GLOBAL VARIABLES
// ===================================================
let recognition = null;
let isListening = false;
let isSpeaking = false;
let isAudioMode = false;
let currentAudio = null;
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
let leadData = window.leadData;
let speakSequenceActive = false;
let speakSequenceButton = null;
let speakSequenceCleanupTimer = null;

// ===================================================
// 🎬 TESTIMONIAL VIDEO SYSTEM (CAPTAIN'S NEW ADDITION)
// ===================================================
function showTestimonialVideo(testimonialType, duration = 12000) {
    console.log(`🎬 Playing ${testimonialType} testimonial for ${duration}ms`);
    
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Avatar already playing - skipping duplicate testimonial call');
        return;
    }
    
    window.avatarCurrentlyPlaying = true;
    const isMobile = window.innerWidth <= 768;
    
    const testimonialVideos = {
        skeptical: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4",
        speed: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4"
    };
    
    const videoUrl = testimonialVideos[testimonialType] || testimonialVideos.skeptical;
    const avatarOverlay = document.createElement('div');
    
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
    
    function cleanup() {
        console.log(`🎬 Testimonial ${testimonialType} complete - continuing conversation`);
        if (avatarOverlay.parentNode) {
            avatarOverlay.remove();
        }
        window.avatarCurrentlyPlaying = false;
        setTimeout(() => {
            console.log('✅ Testimonial removed - conversation continues naturally');
        }, 1000);
    }
    
    setTimeout(cleanup, duration);
}

function detectConsultativeResponse(userText) {
    const text = userText.toLowerCase().trim();
    
    const valueConcerns = [
        'concern', 'worried', 'afraid', 'nervous', 'anxious',
        'worth', 'value', 'fair price', 'market value', 'low ball',
        'undervalue', 'undersell', 'getting what', 'full value',
        'what it\'s worth', 'fair deal', 'ripped off', 'enough money'
    ];
    
    const speedConcerns = [
        'how long', 'timeline', 'time', 'quick', 'fast', 'speed',
        'when', 'soon', 'quickly', 'process time', 'sell fast',
        'too fast', 'rushed', 'patient', 'wait', 'takes forever'
    ];
    
    const credibilityConcerns = [
        'experience', 'credibility', 'trust', 'legitimate', 'proven',
        'track record', 'skeptical', 'doubt', 'reliable', 'reputation',
        'references', 'testimonials', 'reviews', 'who are you', 'can you really'
    ];
    
    for (let concern of valueConcerns) {
        if (text.includes(concern)) {
            console.log(`🎯 VALUE CONCERN detected: "${concern}"`);
            return 'value';
        }
    }
    
    for (let concern of speedConcerns) {
        if (text.includes(concern)) {
            console.log(`🎯 SPEED CONCERN detected: "${concern}"`);
            return 'speed';
        }
    }
    
    for (let concern of credibilityConcerns) {
        if (text.includes(concern)) {
            console.log(`🎯 CREDIBILITY CONCERN detected: "${concern}"`);
            return 'credibility';
        }
    }
    
    return null;
}

// ===================================================
// 🎯 MOBILE DETECTION (CLEANED VERSION)
// ===================================================
const isDefinitelyMobile = window.innerWidth <= 768 || window.innerHeight <= 1024;

if (isDefinitelyMobile) {
    console.log('📱 MOBILE DETECTED: Using visual feedback system');
}

function isMobileDevice() {
    const userAgent = navigator.userAgent;
    
    const isEdgeDesktop = /Edg\/\d+/.test(userAgent) && !/Mobile/.test(userAgent);
    const isChromeDesktop = /Chrome\/\d+/.test(userAgent) && !/Mobile/.test(userAgent);
    const isFirefoxDesktop = /Firefox\/\d+/.test(userAgent) && !/Mobile/.test(userAgent);
    
    if (isEdgeDesktop || isChromeDesktop || isFirefoxDesktop) {
        return false;
    }
    
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userAgent);
    const isTablet = /iPad|Tablet|KFAPWI|Silk/i.test(userAgent);
    const hasTouch = 'ontouchstart' in window;
    const isSmallScreen = window.innerWidth < 768;
    
    return isMobileUserAgent || isTablet || (hasTouch && isSmallScreen);
}

console.log('🔍 Mobile Detection:', {
    userAgent: navigator.userAgent,
    isMobileDevice: isMobileDevice(),
    hasTouch: 'ontouchstart' in window,
    screenWidth: window.innerWidth,
    isDefinitelyMobile: isDefinitelyMobile
});

// ===================================================
// 🎤 CONSOLIDATED VOICE SYSTEM
// ===================================================
const VOICE_CONFIG = {
    provider: 'british',
    elevenlabs: {
        enabled: false,
        apiKey: 'sk_9e7fa2741be74e8cc4af95744fe078712c1e8201cdcada93',
        voiceId: 'zGjIP4SZlMnY9m93k97r',
        model: 'eleven_turbo_v2'
    },
    british: {
        enabled: true,
        priority: ['Google UK English Female', 'Google UK English Male', 'Microsoft Hazel - English (Great Britain)', 'Kate', 'Serena']
    },
    browser: {
        enabled: true,
        rate: 1.1,
        pitch: 1.0,
        volume: 0.8
    },
    debug: true,
    autoFallback: true
};

let voiceSystem = {
    isSpeaking: false,
    currentProvider: null,
    selectedBritishVoice: null,
    isInitialized: false
};

class MobileWiseVoiceSystem {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        
        console.log("🎤 Mobile-Wise Consolidated Voice System initializing...");
        this.initializeSystem();
    }
    
    async initializeSystem() {
        await this.initializeBrowserVoices();
        
        if (VOICE_CONFIG.british.enabled) {
            this.selectBritishVoice();
        }
        
        voiceSystem.isInitialized = true;
        voiceSystem.currentProvider = VOICE_CONFIG.provider;
        
        console.log(`✅ Consolidated Mobile-Wise Voice System loaded! (SMART BUTTON BLOCKING REMOVED)`);
        console.log(`🎯 Commands: switchToBritish(), switchToElevenLabs(), getVoiceStatus(), stopAllSpeech()`);
        console.log(`🎤 Current provider: ${VOICE_CONFIG.provider}`);
        console.log(`🚀 ElevenLabs Banner Logic: PERMANENTLY INTEGRATED`);
        console.log(`🎯 Smart Button Blocking: PERMANENTLY REMOVED`);
        
        this.logSystemStatus();
    }
    
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
    
    selectBritishVoice() {
        console.log("🇬🇧 Enhanced British voice search...");
        
        const britishVoicePriority = [
            'Google UK English Female',
            'Google UK English Male',
            'Microsoft Hazel - English (Great Britain)',
            'Microsoft Susan - English (Great Britain)',
            'Daniel', 'Kate', 'Serena', 'Oliver',
            'British English Female', 'British English Male',
            'English (United Kingdom)', 'English (UK)'
        ];
        
        for (const priorityName of britishVoicePriority) {
            const exactMatch = this.voices.find(voice => voice.name === priorityName);
            if (exactMatch) {
                voiceSystem.selectedBritishVoice = exactMatch;
                console.log(`🇬🇧 EXACT MATCH: ${exactMatch.name}`);
                return;
            }
        }
        
        const fallbackBritish = this.voices.find(voice => 
            voice.lang.includes('en-GB') || 
            voice.name.toLowerCase().includes('british') ||
            voice.name.toLowerCase().includes('uk')
        );
        
        if (fallbackBritish) {
            voiceSystem.selectedBritishVoice = fallbackBritish;
            console.log(`🇬🇧 FALLBACK MATCH: ${fallbackBritish.name}`);
        } else {
            console.log('❌ No British voice found - using browser default');
        }
    }
    
    async speak(text, options = {}) {
        if (!text || text.trim() === '') return;
        
        voiceSystem.isSpeaking = true;
        this.stopAllSpeech();
        
        try {
            switch (VOICE_CONFIG.provider) {
                case 'british':
                    await this.speakWithBritish(text, options);
                    break;
                case 'elevenlabs':
                    if (VOICE_CONFIG.elevenlabs.enabled) {
                        await this.speakWithElevenLabs(text, options);
                    } else {
                        console.log('🔄 ElevenLabs disabled - falling back to British');
                        await this.speakWithBritish(text, options);
                    }
                    break;
                case 'browser':
                default:
                    await this.speakWithBrowser(text, options);
                    break;
            }
        } catch (error) {
            console.error('❌ Speech error:', error);
            if (VOICE_CONFIG.autoFallback) {
                console.log('🔄 Attempting fallback to browser voice...');
                await this.speakWithBrowser(text, options);
            }
        }
    }
    
    speakWithBritish(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!voiceSystem.selectedBritishVoice) {
                console.log('❌ No British voice available - using browser default');
                return this.speakWithBrowser(text, options);
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voiceSystem.selectedBritishVoice;
            utterance.rate = options.rate || VOICE_CONFIG.browser.rate;
            utterance.pitch = options.pitch || VOICE_CONFIG.browser.pitch;
            utterance.volume = options.volume || VOICE_CONFIG.browser.volume;
            
            utterance.onend = () => {
                voiceSystem.isSpeaking = false;
                if (options.onComplete) options.onComplete();
                resolve();
            };
            
            utterance.onerror = (error) => {
                voiceSystem.isSpeaking = false;
                console.error('❌ British voice error:', error);
                reject(error);
            };
            
            this.synthesis.speak(utterance);
        });
    }
    
    speakWithBrowser(text, options = {}) {
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = options.rate || VOICE_CONFIG.browser.rate;
            utterance.pitch = options.pitch || VOICE_CONFIG.browser.pitch;
            utterance.volume = options.volume || VOICE_CONFIG.browser.volume;
            
            utterance.onend = () => {
                voiceSystem.isSpeaking = false;
                if (options.onComplete) options.onComplete();
                resolve();
            };
            
            utterance.onerror = (error) => {
                voiceSystem.isSpeaking = false;
                console.error('❌ Browser voice error:', error);
                reject(error);
            };
            
            this.synthesis.speak(utterance);
        });
    }
    
    stopAllSpeech() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        voiceSystem.isSpeaking = false;
    }
    
    logSystemStatus() {
        console.log(`🎤 Voice System Status:`);
        console.log(`  Provider: ${VOICE_CONFIG.provider}`);
        console.log(`  British Voice: ${voiceSystem.selectedBritishVoice ? voiceSystem.selectedBritishVoice.name : 'Not available'}`);
        console.log(`  ElevenLabs: ${VOICE_CONFIG.elevenlabs.enabled ? 'Enabled' : 'Disabled'}`);
        console.log(`  Total Voices: ${this.voices.length}`);
        console.log(`  ElevenLabs Banner Logic: ✅ INTEGRATED`);
        console.log(`  Smart Button Blocking: ❌ REMOVED (for banner functionality)`);
    }
}

// Initialize voice system
const mobileWiseVoice = new MobileWiseVoiceSystem();

// Global voice functions
function speakResponse(text, options = {}) {
    return mobileWiseVoice.speak(text, options);
}

function stopAllSpeech() {
    mobileWiseVoice.stopAllSpeech();
}

function switchToBritish() {
    VOICE_CONFIG.provider = 'british';
    voiceSystem.currentProvider = 'british';
    console.log('🇬🇧 Switched to British voice');
}

function switchToElevenLabs() {
    if (VOICE_CONFIG.elevenlabs.enabled) {
        VOICE_CONFIG.provider = 'elevenlabs';
        voiceSystem.currentProvider = 'elevenlabs';
        console.log('🎙️ Switched to ElevenLabs voice');
    } else {
        console.log('❌ ElevenLabs not available - staying with current provider');
    }
}

function getVoiceStatus() {
    mobileWiseVoice.logSystemStatus();
}

console.log('✅ Voice system ready - Provider: british');

// ===================================================
// 🎖️ UNIVERSAL BANNER SYSTEM
// ===================================================
const BANNER_TEMPLATES = {
    branding: {
        title: "Mobile-Wise AI",
        subtitle: "Powered by Advanced Voice Recognition",
        bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textColor: "#ffffff",
        duration: 0
    },
    freeBookWithConsultation: {
        title: "🎁 FREE Book + Consultation",
        subtitle: "Get Bruce's insider strategies delivered to your inbox",
        bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        textColor: "#ffffff",
        duration: 0,
        showButton: true,
        buttonText: "Get Free Book Now"
    },
    smartButton: {
        title: "🧠 AI Smart Recommendations",
        subtitle: "Let our AI analyze your situation and provide personalized guidance",
        bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        textColor: "#ffffff",
        duration: 0,
        showButton: true,
        buttonText: "Get Smart Recommendations"
    },
    thankYou: {
        title: "✅ Thank You!",
        subtitle: "We'll be in touch soon with your consultation details",
        bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        textColor: "#333333",
        duration: 5000
    }
};

class UniversalBannerEngine {
    constructor() {
        this.activeBanners = new Map();
        this.bannerId = 0;
        console.log('🎖️ Complete Universal Banner Engine loaded - 9 banner types ready (Clean Container Edition)!');
    }
    
    deployBanner(bannerType, customConfig = {}) {
        console.log(`🎯 Deploying Universal Banner: ${bannerType}`);
        
        const template = BANNER_TEMPLATES[bannerType];
        if (!template) {
            console.log(`❌ Banner type "${bannerType}" not found`);
            return;
        }
        
        const config = { ...template, ...customConfig };
        const bannerId = `banner_${this.bannerId++}`;
        
        let container = document.getElementById('bannerContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'bannerContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 500px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        const bannerElement = document.createElement('div');
        bannerElement.id = bannerId;
        bannerElement.style.cssText = `
            background: ${config.bgColor};
            color: ${config.textColor};
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            margin-bottom: 10px;
            text-align: center;
            pointer-events: auto;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        let bannerHTML = `
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">
                ${config.title}
            </div>
            <div style="font-size: 14px; opacity: 0.9;">
                ${config.subtitle}
            </div>
        `;
        
        if (config.showButton) {
            bannerHTML += `
                <div style="margin-top: 10px;">
                    <button onclick="handleConsultationClick('${bannerType}')" style="
                        background: rgba(255,255,255,0.2);
                        color: ${config.textColor};
                        border: 2px solid rgba(255,255,255,0.3);
                        padding: 8px 16px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                       onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        ${config.buttonText}
                    </button>
                </div>
            `;
        }
        
        bannerElement.innerHTML = bannerHTML;
        container.appendChild(bannerElement);
        
        requestAnimationFrame(() => {
            bannerElement.style.opacity = '1';
            bannerElement.style.transform = 'translateY(0)';
        });
        
        this.activeBanners.set(bannerId, bannerElement);
        
        if (config.duration > 0) {
            setTimeout(() => {
                this.removeBanner(bannerId);
            }, config.duration);
        }
        
        console.log(`✅ Container-based banner "${bannerType}" deployed (Clean positioning)`);
        return bannerId;
    }
    
    removeBanner(bannerId) {
        const banner = this.activeBanners.get(bannerId);
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
                this.activeBanners.delete(bannerId);
            }, 300);
        }
    }
    
    removeAllBanners() {
        this.activeBanners.forEach((banner, bannerId) => {
            this.removeBanner(bannerId);
        });
    }
}

const universalBanner = new UniversalBannerEngine();

function showUniversalBanner(type, config = {}) {
    return universalBanner.deployBanner(type, config);
}

console.log('🎖️ Universal Master Banner Trigger System loaded - Ready for any industry!');

// Auto-deploy branding banner
setTimeout(() => {
    console.log('🏆 Auto-deploying Mobile-Wise AI branding banner...');
    showUniversalBanner('branding');
}, 1000);

// ===================================================
// 📧 EMAIL SYSTEM
// ===================================================
console.log('📧 EMAIL FIX: Setting up EmailJS configuration...');

(function() {
    emailjs.init("OQfiuCsNKWXfovT0A");
})();

console.log('✅ EmailJS initialized successfully');

// CLEANED - Single version only
function formatEmailFromSpeech(speechText) {
    let formattedEmail = speechText.toLowerCase().trim();
    
    formattedEmail = formattedEmail
        .replace(/\s*at\s+/g, '@')
        .replace(/\s*dot\s+/g, '.')
        .replace(/\s+/g, '')
        .replace(/,/g, '')
        .replace(/\.+$/, '');

    console.log('📧 Email conversion:', speechText, '→', formattedEmail);
    return formattedEmail;
}

// ===================================================
// 🎤 SPEECH RECOGNITION SYSTEM (CLEANED)
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

    recognition.onsoundstart = null;
    recognition.onaudiostart = null;
    recognition.onstart = null;

    console.log('✅ Speech recognition initialized');
    return true;
}

// ===================================================
// 🎯 DIRECT SPEAK NOW FUNCTION
// ===================================================
function showDirectSpeakNow() {
    console.log('🎯 DIRECT Speak Now function called');
    
    if (conversationState === 'ended') {
        console.log('🚫 Conversation ended - not showing Speak Now');
        return;
    }
    
    const quickButtonsContainer = document.querySelector('.quick-questions') || 
                                  document.querySelector('.quick-buttons') || 
                                  document.getElementById('quickButtonsContainer');
    
    if (!quickButtonsContainer) {
        console.log('❌ Quick buttons container not found');
        return;
    }
    
    const existingSpeakBtn = document.getElementById('speak-sequence-button');
    if (existingSpeakBtn) {
        existingSpeakBtn.remove();
    }
    
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
    
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        speakSequenceButton.style.cssText += `
            position: relative !important;
            z-index: 1000 !important;
            min-height: 50px !important;
            padding: 18px !important;
        `;
    }
    
    quickButtonsContainer.appendChild(speakSequenceButton);
    console.log('✅ Direct Speak Now button created');
    
    setTimeout(() => {
        if (typeof recognition !== 'undefined' && recognition) {
            try {
                recognition.start();
                console.log('✅ Direct recognition started');
            } catch (e) {
                console.log('❌ Recognition start failed:', e);
            }
        }
    }, 100);
}

console.log('🎯 DIRECT Speak Now function loaded - No Get Ready phase!');

// ===================================================
// 🎯 NUCLEAR SHUTDOWN SPEAK SEQUENCE
// ===================================================
function cleanupSpeakSequence() {
    console.log('🎯 NUCLEAR SHUTDOWN: Cleaning up speak sequence');
    
    speakSequenceActive = false;
    
    const existingSpeakBtn = document.getElementById('speak-sequence-button');
    if (existingSpeakBtn) {
        existingSpeakBtn.remove();
        console.log('🧹 Removed speak sequence button');
    }
    
    if (speakSequenceCleanupTimer) {
        clearTimeout(speakSequenceCleanupTimer);
        speakSequenceCleanupTimer = null;
        console.log('⏰ Cleared cleanup timer');
    }
    
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
        console.log('🎤 Stopped recognition');
    }
    
    console.log('✅ Speak sequence cleanup complete');
}

console.log('🎯 NUCLEAR SHUTDOWN Mobile-Wise AI Speak Sequence loaded - Avatar-proof!');

// ===================================================
// 🚀 MAIN INITIALIZATION
// ===================================================
function initializeMobileWiseFormviser() {
    console.log('🚀 Initializing Mobile-Wise AI Formviser - Complete Integration...');
    
    initializeChatInterface();
    console.log('✅ Chat interface initialized');
}

function initializeChatInterface() {
    // Basic chat interface setup
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
}

// Initialize the system
initializeMobileWiseFormviser();

// ===================================================
// 🎯 CLEANED HELPER FUNCTIONS (SINGLE VERSIONS ONLY)
// ===================================================

// CLEANED - Single version only
function shouldTriggerLeadCapture(userInput) {
    const input = userInput.toLowerCase().trim();
    
    const recentAI = conversationHistory
        .slice(-3)
        .filter(msg => msg.role === 'assistant')
        .map(msg => msg.content.toLowerCase())
        .join(' ');
    
    const aiOfferedConsultation = recentAI.includes('consultation') || 
                                recentAI.includes('schedule') ||
                                recentAI.includes('contact you') ||
                                recentAI.includes('would you like');
    
    const yesResponses = [
        'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'absolutely', 
        'definitely', 'of course', 'let\'s do it', 'sounds good',
        'i would', 'i\'d like that', 'that sounds great', 'let\'s go'
    ];
    
    return yesResponses.includes(input) && aiOfferedConsultation;
}

// CLEANED - Single version only  
function switchToTextMode() {
    console.log('🔄 Switching to text mode');
    
    isAudioMode = false;
    isListening = false;
    
    if (recognition) {
        recognition.stop();
    }
    
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.classList.remove('listening');
    }
    
    const textInputContainer = document.getElementById('textInputContainer');
    if (textInputContainer) {
        textInputContainer.style.display = 'block';
    }
    
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.focus();
    }
}

// ===================================================
// 🎯 CONVERSATION STATE LOGIC (PLACEHOLDER)
// ===================================================
// Note: Your conversation state logic would go here
// This is where you'd add the SHORT consultative conversation flow

function getAIResponse(userText) {
    // Placeholder - replace with your actual conversation logic
    return "I understand. Let me help you with that.";
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

function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
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
// 🎯 GLOBAL FUNCTIONS FOR EXTERNAL CALLS
// ===================================================
function handleConsultationClick(type) {
    console.log(`🎯 Consultation click: ${type}`);
    // Add your consultation handling logic here
}

// Test functions for testimonials
function testValueConcern() {
    console.log('🧪 Testing: "I\'m worried about getting what it\'s worth"');
    const result = detectConsultativeResponse("I'm worried about getting what it's worth");
    console.log('Result:', result);
    if (result === 'value') {
        showTestimonialVideo('skeptical', 8000);
    }
}

function testSpeedConcern() {
    console.log('🧪 Testing: "How long does this take?"');
    const result = detectConsultativeResponse("How long does this take?");
    console.log('Result:', result);
    if (result === 'speed') {
        showTestimonialVideo('speed', 8000);
    }
}

function testCredibilityConcern() {
    console.log('🧪 Testing: "What\'s your experience with this?"');
    const result = detectConsultativeResponse("What's your experience with this?");
    console.log('Result:', result);
    if (result === 'credibility') {
        showTestimonialVideo('skeptical', 8000);
    }
}

console.log('🎯 Cleaned Mobile-Wise Voice System loaded!');
console.log('📊 Key functions: showTestimonialVideo(), detectConsultativeResponse()');
console.log('💡 Test functions: testValueConcern(), testSpeedConcern(), testCredibilityConcern()');

// ===================================================
// 🎯 END OF CLEANED FILE
// ===================================================