// ===================================================
// 🎯 MOBILE-WISE AI VOICE CHAT - COMPLETE INTEGRATION
// Smart Button + Lead Capture + EmailJS + Banner System + TESTIMONIALS
// NEW CONVERSATION: CPA Practice Sales (Boateamia)
// ===================================================

// ===================================================
// 🎯 KNOWLEDGE BASE DATA - NEW CPA CONVERSATION
// ===================================================
// ===================================================
// 🎯 KNOWLEDGE BASE DATA - PRE-LOADED FOR ZERO LATENCY
// ===================================================
// This file contains all conversation data as a JavaScript object
// NO async loading, NO fetch delays - INSTANT ACCESS
// Date: October 15, 2025
// Captain: Mobile-Wise AI Empire
// UPDATED: Testimonials now use CONSENT-BASED OFFERS instead of auto-play
// ===================================================

window.knowledgeBaseData = {
  "industry_name": "CPA Practice Sales & Acquisitions",
  "industry_type": "accounting_practice_brokerage",
  "version": "2.0",
  "client_name": "New Clients, Inc. / Bruce Clark",
  "greeting": {
    "initial": "Hi there! I'm Boateamia your personal AI Voice assistant, may I get your first name please?",
    "with_name": "Great to meet you {firstName}! What brings you to New Clients Inc today?"
  },
  "conversation_states": {
    "initial": {
      "state_id": "initial",
      "description": "First interaction - capture name or detect intent",
      "triggers": {
        "name_request": {
          "keywords": [],
          "response": "Before we dive in, what's your first name?",
          "next_state": "getting_first_name",
          "condition": "!leadData.firstName && no business keywords"
        },
        "buy_intent": {
          "keywords": [
            "buy",
            "buying",
            "purchase",
            "acquire"
          ],
          "response": "Excellent! Bruce has exclusive off-market opportunities available. What's your budget range?",
          "response_with_name": "Excellent, {firstName}! Bruce has exclusive off-market deals available. What's your budget range?",
          "next_state": "buying_budget_question",
          "trigger_banner": "freeBookWithConsultation"
        },
        "sell_intent": {
          "keywords": [
            "sell",
            "selling"
          ],
          "response": "Great! Selling is a big decision. How many clients are you currently serving?",
          "response_with_name": "Wow {firstName}! That's a huge decision. How many clients are you serving?",
          "next_state": "selling_size_question",
          "trigger_banner": "freeBookWithConsultation"
        },
        "value_intent": {
          "keywords": [
            "value",
            "worth",
            "valuation",
            "evaluate"
          ],
          "response": "Happy to help with a valuation! Most owners are surprised at their practice's value. What's your approximate annual revenue?",
          "response_with_name": "{firstName}, I'd be happy to help! Most owners are shocked at their practice's actual value. What's your approximate annual revenue?",
          "next_state": "valuation_revenue_question",
          "trigger_banner": "freeBookWithConsultation"
        }
      }
    },
    "getting_first_name": {
      "state_id": "getting_first_name",
      "description": "Capture and store user's first name",
      "response_success": "Great to meet you {firstName}! Now, what brings you here - buy, sell, or valuation?",
      "response_retry": "I didn't catch your name. Could you tell me your first name?",
      "next_state": "initial",
      "action": "extract_first_name"
    },
    "selling_size_question": {
      "state_id": "selling_size_question",
      "description": "Ask about client count",
      "response": "Incredible! {number} clients - that's fantastic! With that client base, what's your approximate annual revenue?",
      "response_no_name": "Wow! {number} clients - impressive! What's your annual revenue range?",
      "next_state": "selling_revenue_question",
      "action": "extract_number"
    },
    "selling_revenue_question": {
      "state_id": "selling_revenue_question",
      "description": "Ask about revenue",
      "response": "Excellent! {revenue} in revenue - you've built something valuable. What's driving your decision to sell? Retirement, new opportunities, or something else?",
      "response_no_name": "Excellent! {revenue} - solid practice! What's driving your decision to sell?",
      "next_state": "selling_motivation_question",
      "action": "extract_revenue"
    },
    "selling_motivation_question": {
      "state_id": "selling_motivation_question",
      "description": "Understand motivation and check for objections",
      "objection_check": true,
      "objection_response": "Great question, {firstName}! Let me show you what one of our recent clients said about that...",
      "objection_response_no_name": "Great question! Let me show you what a recent client said...",
      "objection_testimonial": "skeptical",
      "response": "Thank you for sharing! Based on your client base and revenue, Bruce can help you get top dollar. The market is strong right now. Would you like a FREE consultation with Bruce?",
      "response_with_name": "Thanks {firstName}! Based on everything you've told me, Bruce can get you top dollar. Market's on fire. Ready for a FREE consultation?",
      "next_state": "asking_selling_consultation",
      "trigger_banner": "freeBookWithConsultation"
    },
    "asking_selling_consultation": {
      "state_id": "asking_selling_consultation",
      "description": "Close for consultation",
      "yes_triggers": [
        "yes",
        "sure",
        "okay",
        "definitely",
        "absolutely"
      ],
      "no_triggers": [
        "no",
        "not now",
        "maybe later"
      ],
      "yes_action": "start_lead_capture",
      "no_response": "No problem! The offer stands whenever you're ready. Anything else about selling?",
      "no_response_with_name": "No problem {firstName}! Offer stands. Anything else about selling?",
      "no_next_state": "initial",
      "no_trigger_banner": "smartButton",
      "clarify_response": "Just to clarify - would you like Bruce to call you for a free consultation? Yes or no?",
      "clarify_response_with_name": "{firstName}, want Bruce to call you for free consultation? Yes or no?"
    },
    "buying_budget_question": {
      "state_id": "buying_budget_question",
      "description": "Ask about budget range",
      "response": "Great! {budget} opens up excellent opportunities. Looking specifically for CPA practice, or would accounting work too?",
      "response_with_name": "Great {firstName}! {budget} - nice opportunities in that range. CPA practice specifically, or general accounting?",
      "next_state": "buying_type_question",
      "action": "extract_budget"
    },
    "buying_type_question": {
      "state_id": "buying_type_question",
      "description": "Ask about practice type preference",
      "response": "Perfect! That gives us more options. How soon are you looking to complete a purchase?",
      "response_with_name": "Perfect {firstName}! More options to work with. How soon for purchase?",
      "next_state": "buying_timeline_question"
    },
    "buying_timeline_question": {
      "state_id": "buying_timeline_question",
      "description": "Ask about timeline",
      "response": "Excellent! Bruce has exclusive off-market opportunities you can't find online. Based on your criteria, he has perfect matches. Want to see them?",
      "response_with_name": "Excellent {firstName}! Bruce has exclusive off-market deals - not advertised anywhere. Perfect matches for your criteria. Want to see?",
      "next_state": "asking_buying_consultation",
      "trigger_banner": "freeBookWithConsultation"
    },
    "asking_buying_consultation": {
      "state_id": "asking_buying_consultation",
      "description": "Close for showing practices",
      "yes_triggers": [
        "yes",
        "sure",
        "okay",
        "definitely",
        "absolutely"
      ],
      "no_triggers": [
        "no",
        "not now",
        "maybe later"
      ],
      "yes_action": "start_lead_capture",
      "no_response": "That's fine! When ready, let me know. These opportunities move fast. Anything else about buying?",
      "no_response_with_name": "Fine {firstName}! Just let me know when ready. Opportunities don't last long. Anything else?",
      "no_next_state": "initial",
      "no_trigger_banner": "smartButton",
      "clarify_response": "Would you like Bruce to show you available practices? Yes or no?",
      "clarify_response_with_name": "{firstName}, want Bruce to show you available practices? Yes or no?"
    },
    "valuation_revenue_question": {
      "state_id": "valuation_revenue_question",
      "description": "Ask about revenue for valuation",
      "response": "Thank you! {revenue} - solid! How many years have you been in practice? Longevity really impacts valuation.",
      "response_with_name": "Thanks {firstName}! {revenue} - solid! How many years in practice? Longevity impacts value.",
      "next_state": "valuation_years_question",
      "action": "extract_revenue"
    },
    "valuation_years_question": {
      "state_id": "valuation_years_question",
      "description": "Ask about years in practice",
      "response": "Perfect! {years} years - well-established! Bruce can provide a comprehensive FREE valuation. You might be surprised at the value. Want to schedule it?",
      "response_with_name": "Perfect {firstName}! {years} years - incredibly well-established! Bruce can provide FREE valuation. Might surprise you. Ready to schedule?",
      "next_state": "asking_valuation_consultation",
      "trigger_banner": "freeBookWithConsultation",
      "action": "extract_years"
    },
    "asking_valuation_consultation": {
      "state_id": "asking_valuation_consultation",
      "description": "Close for valuation consultation",
      "yes_triggers": [
        "yes",
        "sure",
        "okay",
        "definitely",
        "absolutely"
      ],
      "no_triggers": [
        "no",
        "not now",
        "maybe later"
      ],
      "yes_action": "start_lead_capture",
      "no_response": "No worries! Offer stands whenever you're ready. Anything else about valuations?",
      "no_response_with_name": "No worries {firstName}! Offer stands. Anything else about valuations?",
      "no_next_state": "initial",
      "no_trigger_banner": "smartButton",
      "clarify_response": "Would you like Bruce to provide a free valuation? Yes or no?",
      "clarify_response_with_name": "{firstName}, want Bruce to provide free valuation? Yes or no?"
    },
    "asking_if_more_help": {
      "state_id": "asking_if_more_help",
      "description": "Check if user needs more help before ending",
      "no_triggers": [
        "no",
        "nothing",
        "done",
        "that's all",
        "nope",
        "thanks"
      ],
      "yes_response": "Absolutely! What else about buying, selling, or valuing practices?",
      "yes_response_with_name": "Absolutely {firstName}! What else would you like to know?",
      "yes_next_state": "initial",
      "no_response": "Thank you so much for visiting! Have a wonderful day! 🌟",
      "no_response_with_name": "Thank you {firstName}! It's been great talking with you. Have a wonderful day! 🌟",
      "no_next_state": "ended",
      "no_trigger_banner": "thankYou"
    }
  },
  "objection_handling": {
    "description": "Detect objections and OFFER testimonials (user consent required)",
    "objections": [
      {
        "type": "timeline_concern",
        "keywords": [
          "how long",
          "time",
          "timeline",
          "duration",
          "when",
          "fast",
          "quick"
        ],
        "testimonialOffer": "speed",
        "response": "Great question! We've worked with clients who had the same timeline concerns. Would you like to hear what one of them experienced?",
        "response_with_name": "Great question {firstName}! We've had clients with the same concern. Want to hear their experience?"
      },
      {
        "type": "trust_concern",
        "keywords": [
          "guarantee",
          "sure",
          "trust",
          "promise",
          "really",
          "certain",
          "proof"
        ],
        "testimonialOffer": "skeptical",
        "response": "I completely understand! We've had clients who felt the same way initially. Would you like to hear what they said after working with Bruce?",
        "response_with_name": "{firstName}, I understand! Want to hear what a skeptical client said after working with us?"
      },
      {
        "type": "value_concern",
        "keywords": [
          "worth",
          "value",
          "price",
          "fair",
          "market",
          "competitive"
        ],
        "testimonialOffer": "skeptical",
        "response": "That's important! We have clients who were concerned about value too. Would you like to hear their experience?",
        "response_with_name": "{firstName}, that's important! Want to hear what other clients said about the value they received?"
      }
    ]
  },
  "testimonials": {
    "skeptical": {
      "id": "skeptical",
      "title": "Skeptical, Then Exceeded Expectations",
      "video_url": "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4",
      "duration": 12000,
      "trigger_contexts": [
        "trust",
        "value",
        "credibility",
        "guarantee"
      ]
    },
    "speed": {
      "id": "speed",
      "title": "Surprised by the Speed of the Sale",
      "video_url": "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4",
      "duration": 12000,
      "trigger_contexts": [
        "timeline",
        "how long",
        "fast",
        "quick"
      ]
    }
  },
  "general_questions": [
    {
      "id": "selling_timeline",
      "triggers": [
        "how long to sell",
        "time to sell",
        "sell timeline",
        "selling duration",
        "how fast can I sell"
      ],
      "keywords": [
        "sell",
        "time",
        "how long",
        "duration",
        "timeline",
        "fast"
      ],
      "response": "Most practices sell within 2-6 months. Strong financials and good client retention? Even faster. Want to discuss your situation?",
      "category": "selling",
      "triggerAction": "request_selling_consultation",
      "testimonialOffer": "speed"
    },
    {
      "id": "buying_timeline",
      "triggers": [
        "how long to buy",
        "time to buy",
        "buying timeline",
        "purchase duration"
      ],
      "keywords": [
        "buy",
        "purchase",
        "time",
        "how long",
        "acquire"
      ],
      "response": "Most buyers find and close within 2-6 months. Pre-approved financing speeds things up. Want to hear about available practices?",
      "category": "buying",
      "triggerAction": "request_buying_consultation"
    },
    {
      "id": "practice_valuation",
      "triggers": [
        "what is my practice worth",
        "practice value",
        "how much is it worth",
        "valuation",
        "appraisal"
      ],
      "keywords": [
        "worth",
        "value",
        "price",
        "valuation",
        "appraisal",
        "how much"
      ],
      "response": "Most CPA practices sell for 100-150% of annual billing. Multiple depends on profit margins, client retention, and growth. Want a professional valuation?",
      "category": "valuation",
      "triggerAction": "request_valuation"
    },
    {
      "id": "practice_pricing",
      "triggers": [
        "how much does a practice cost",
        "practice price",
        "cost to buy"
      ],
      "keywords": [
        "cost",
        "price",
        "buy",
        "purchase",
        "how much",
        "afford"
      ],
      "response": "Typically 100-150% of annual billing, around 125% average. Example: $500K billing = ~$625K price. What's your budget range?",
      "category": "buying",
      "triggerAction": "request_buying_consultation"
    },
    {
      "id": "financing_options",
      "triggers": [
        "financing",
        "loan",
        "funding",
        "can I finance",
        "money"
      ],
      "keywords": [
        "financing",
        "loan",
        "money",
        "funding",
        "bank",
        "finance"
      ],
      "response": "Financing available for qualified buyers - typically 70-90% of purchase price. Good credit and cash flow needed. Some sellers offer financing. Want details?",
      "category": "buying",
      "triggerAction": "request_financing_consultation"
    },
    {
      "id": "sale_guarantees",
      "triggers": [
        "guarantee",
        "protection",
        "refund",
        "what if clients leave"
      ],
      "keywords": [
        "guarantee",
        "protection",
        "refund",
        "assurance",
        "risk",
        "clients leave"
      ],
      "response": "Most sales include client retention guarantees - typically one year. If collected fees don't meet agreement, you may get refund/adjustment. Want details?",
      "category": "buying",
      "triggerAction": "request_guarantee_details",
      "testimonialOffer": "skeptical"
    },
    {
      "id": "seller_fees",
      "triggers": [
        "what do you charge",
        "commission",
        "fees",
        "cost to sell"
      ],
      "keywords": [
        "charge",
        "commission",
        "fee",
        "cost",
        "price",
        "how much"
      ],
      "response": "Commission structures vary by transaction size - typically 10-15%. Some flat fees for smaller practices. Want to discuss your specific practice?",
      "category": "selling",
      "triggerAction": "request_fee_consultation"
    },
    {
      "id": "confidentiality",
      "triggers": [
        "confidential",
        "secret",
        "discreet",
        "privacy",
        "who will know"
      ],
      "keywords": [
        "confidential",
        "secret",
        "discreet",
        "privacy",
        "anonymous"
      ],
      "response": "Confidentiality is critical. We use NDAs, anonymous listings, controlled disclosure. Clients/staff don't know until you're ready. Want to discuss our process?",
      "category": "general",
      "triggerAction": "request_confidentiality_consultation"
    },
    {
      "id": "what_services",
      "triggers": [
        "what do you do",
        "services",
        "how can you help",
        "what help"
      ],
      "keywords": [
        "what",
        "do",
        "services",
        "help",
        "offer"
      ],
      "response": "We handle: practice sales, buyer matching, valuations, succession planning, transaction support. Marketing, screening, negotiations, closing - all covered. How can we help?",
      "category": "general",
      "triggerAction": "request_services_consultation"
    },
    {
      "id": "due_diligence",
      "triggers": [
        "due diligence",
        "what documents",
        "paperwork",
        "information needed"
      ],
      "keywords": [
        "due diligence",
        "documents",
        "paperwork",
        "information",
        "need",
        "required"
      ],
      "response": "Typical due diligence: 3 years tax returns, financials, client lists with revenue, fee structures, staff info. We help prepare everything. Want to know what you'll need?",
      "category": "general",
      "triggerAction": "request_due_diligence_help"
    }
  ],
  "fallback_responses": {
    "no_match": "That's a great question! A specialist can provide detailed information. Would you like to schedule a consultation?",
    "no_match_with_name": "{firstName}, that's a great question! Let me connect you with our team. Ready for a consultation?",
    "conversation_ended": "Thank you for visiting! Have a great day.",
    "conversation_ended_with_name": "Thank you {firstName}! Have a great day."
  },
  "lead_capture_triggers": [
    "consultation",
    "call me",
    "speak to someone",
    "more information",
    "contact",
    "schedule",
    "interested",
    "yes"
  ]
};

console.log('✅ Knowledge Base Data loaded - Zero latency mode!');
console.log('📊 KB Stats:', {
    conversationStates: Object.keys(window.knowledgeBaseData.conversation_states).length,
    generalQuestions: window.knowledgeBaseData.general_questions.length,
    testimonials: Object.keys(window.knowledgeBaseData.testimonials).length
});

// ===================================================
// 🔄 REST OF VOICE CHAT SYSTEM (keeping all upgrades)
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
// 🎯 TESTIMONIAL SYSTEM GLOBALS (for future use)
// ===================================================
let pendingTestimonialType = null;
let currentObjection = null;

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

// 🚨 NUCLEAR MOBILE DETECTION - SCREEN SIZE ONLY
const isDefinitelyMobile = window.innerWidth <= 768 || window.innerHeight <= 1024;

// 🚨 FIX: Check if event exists before accessing event.error
if (isDefinitelyMobile || (event && event.error === 'no-speech')) {
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
    }, 100);
    
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
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    
    try {
        // 🎯 MOBILE-SPECIFIC PRE-WARMING
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        
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
        const transcriptText = document.getElementById('transcriptText');recognition.onerror

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
        
        // 🎯 MOBILE TIMING DELAY
        const delay = isMobile ? 100 : 0; // Only delay on mobile
        
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
// 🔍 FORCE START LISTENING
// ===================================================

// 🎯 ADD THIS TO YOUR forceStartListening() FUNCTION - REPLACE THE EXISTING ONE:
function forceStartListening() {
    console.log('🎤 TEST 8: forceStartListening() CALLED at:', Date.now());
    console.log('🎤 TEST 9: isSpeaking:', isSpeaking);
    console.log('🎤 TEST 10: recognition exists:', !!recognition);
    console.log('🔄 FORCE starting speech recognition (mobile reset)');
    
    if (!checkSpeechSupport()) return;
    if (isSpeaking) return;
    
    try {
        if (!recognition) {
            initializeSpeechRecognition();
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
    
    const greeting = window.knowledgeBaseData ? window.knowledgeBaseData.greeting.initial : "Hi there! I'm Boateamia your personal AI Voice assistant, may I get your first name please?";
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

// 🎯 NEW: Direct consultation trigger - NO AI fluff!

// Default AI response handler
setTimeout(() => {
    const responseText = getAIResponse(userText);

    console.log('🎯 USER SAID:', userText);
    console.log('🎯 AI RESPONSE:', responseText);
    
    addAIMessage(responseText);
    setAIResponse(responseText);
    speakResponse(responseText);
    
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

// Auto-show status after initialization
setTimeout(() => {
    if (VOICE_CONFIG.debug && voiceSystem.isInitialized) {
        window.getVoiceStatus();
    }
}, 3000);

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
// 🤖 NEW AI RESPONSE SYSTEM - POWERED BY KB DATA
// ===================================================
// ===================================================
// 🧠 AI RESPONSE SYSTEM
// ===================================================

function getAIResponse(userInput) {
    console.log('🎯 getAIResponse called with:', userInput);
    console.log('📍 Current state:', conversationState);
    console.log('👤 First name:', leadData.firstName);
    
    const input = userInput.toLowerCase().trim();
    const kb = window.knowledgeBaseData;
    
    // ===================================================
    // 🎯 OBJECTION DETECTION - Check for objections first
    // ===================================================
    if (kb.objection_handling && kb.objection_handling.objections) {
        for (const objection of kb.objection_handling.objections) {
            const hasObjectionKeyword = objection.keywords.some(keyword => 
                input.includes(keyword.toLowerCase())
            );
            
            if (hasObjectionKeyword) {
                console.log('🚨 OBJECTION DETECTED:', objection.type);
                console.log('🎬 Testimonial to offer:', objection.testimonialOffer);
                
                // Store testimonial type for offer
                pendingTestimonialType = objection.testimonialOffer;
                currentObjection = objection.type;
                
                // Return objection response with testimonial offer
                const response = leadData.firstName && objection.response_with_name
                    ? objection.response_with_name.replace('{firstName}', leadData.firstName)
                    : objection.response;
                
                // Show testimonial offer banner
                setTimeout(() => {
                    showTestimonialOffer(objection.testimonialOffer);
                }, 500);
                
                return response;
            }
        }
    }
    
    // ===================================================
    // 🎯 STATE: getting_first_name
    // ===================================================
    if (conversationState === 'getting_first_name') {
        const nameMatch = userInput.match(/\b([A-Z][a-z]+)\b/);
        
        if (nameMatch && nameMatch[1].length > 1) {
            leadData.firstName = nameMatch[1];
            console.log('✅ Name captured:', leadData.firstName);
            
            conversationState = 'initial';
            
            return kb.greeting.with_name.replace('{firstName}', leadData.firstName);
        } else {
            return kb.conversation_states.getting_first_name.response_retry;
        }
    }
    
    // ===================================================
    // 🎯 STATE: initial (detect buy/sell/value intent)
    // ===================================================
    if (conversationState === 'initial') {
        const state = kb.conversation_states.initial;
        
        // Check for BUY intent
        if (state.triggers.buy_intent.keywords.some(kw => input.includes(kw))) {
            conversationState = state.triggers.buy_intent.next_state;
            
            const response = leadData.firstName && state.triggers.buy_intent.response_with_name
                ? state.triggers.buy_intent.response_with_name.replace('{firstName}', leadData.firstName)
                : state.triggers.buy_intent.response;
            
            if (state.triggers.buy_intent.trigger_banner) {
                triggerBanner(state.triggers.buy_intent.trigger_banner);
            }
            
            return response;
        }
        
        // Check for SELL intent
        if (state.triggers.sell_intent.keywords.some(kw => input.includes(kw))) {
            conversationState = state.triggers.sell_intent.next_state;
            
            const response = leadData.firstName && state.triggers.sell_intent.response_with_name
                ? state.triggers.sell_intent.response_with_name.replace('{firstName}', leadData.firstName)
                : state.triggers.sell_intent.response;
            
            if (state.triggers.sell_intent.trigger_banner) {
                triggerBanner(state.triggers.sell_intent.trigger_banner);
            }
            
            return response;
        }
        
        // Check for VALUE intent
        if (state.triggers.value_intent.keywords.some(kw => input.includes(kw))) {
            conversationState = state.triggers.value_intent.next_state;
            
            const response = leadData.firstName && state.triggers.value_intent.response_with_name
                ? state.triggers.value_intent.response_with_name.replace('{firstName}', leadData.firstName)
                : state.triggers.value_intent.response;
            
            if (state.triggers.value_intent.trigger_banner) {
                triggerBanner(state.triggers.value_intent.trigger_banner);
            }
            
            return response;
        }
        
        // No intent detected - ask for name if we don't have it
        if (!leadData.firstName) {
            conversationState = 'getting_first_name';
            return state.triggers.name_request.response;
        }
        
        // Have name but no intent - fallback
        return kb.fallback_responses.no_match_with_name.replace('{firstName}', leadData.firstName);
    }
    
    // ===================================================
    // 🎯 SELLING PATH STATES
    // ===================================================
    
    if (conversationState === 'selling_size_question') {
        const numberMatch = input.match(/\b\d+\b/);
        const number = numberMatch ? numberMatch[0] : 'those';
        
        conversationState = 'selling_revenue_question';
        
        const response = leadData.firstName
            ? kb.conversation_states.selling_size_question.response.replace('{firstName}', leadData.firstName).replace('{number}', number)
            : kb.conversation_states.selling_size_question.response_no_name.replace('{number}', number);
        
        return response;
    }
    
    if (conversationState === 'selling_revenue_question') {
        const revenue = extractRevenue(input);
        
        conversationState = 'selling_motivation_question';
        
        const response = leadData.firstName
            ? kb.conversation_states.selling_revenue_question.response.replace('{firstName}', leadData.firstName).replace('{revenue}', revenue)
            : kb.conversation_states.selling_revenue_question.response_no_name.replace('{revenue}', revenue);
        
        return response;
    }
    
    if (conversationState === 'selling_motivation_question') {
        conversationState = 'asking_selling_consultation';
        
        const response = leadData.firstName
            ? kb.conversation_states.selling_motivation_question.response_with_name.replace('{firstName}', leadData.firstName)
            : kb.conversation_states.selling_motivation_question.response;
        
        if (kb.conversation_states.selling_motivation_question.trigger_banner) {
            triggerBanner(kb.conversation_states.selling_motivation_question.trigger_banner);
        }
        
        return response;
    }
    
    if (conversationState === 'asking_selling_consultation') {
        const state = kb.conversation_states.asking_selling_consultation;
        
        // Check for YES
        if (state.yes_triggers.some(trigger => input.includes(trigger))) {
            if (state.yes_action === 'start_lead_capture') {
                startLeadCapture();
                return ''; // Lead capture takes over
            }
        }
        
        // Check for NO
        if (state.no_triggers.some(trigger => input.includes(trigger))) {
            conversationState = state.no_next_state;
            
            const response = leadData.firstName && state.no_response_with_name
                ? state.no_response_with_name.replace('{firstName}', leadData.firstName)
                : state.no_response;
            
            if (state.no_trigger_banner) {
                triggerBanner(state.no_trigger_banner);
            }
            
            return response;
        }
        
        // Unclear response - clarify
        return leadData.firstName && state.clarify_response_with_name
            ? state.clarify_response_with_name.replace('{firstName}', leadData.firstName)
            : state.clarify_response;
    }
    
    // ===================================================
    // 🎯 BUYING PATH STATES
    // ===================================================
    
    if (conversationState === 'buying_budget_question') {
        const budget = extractBudget(input);
        
        conversationState = 'buying_type_question';
        
        const response = leadData.firstName
            ? kb.conversation_states.buying_budget_question.response_with_name.replace('{firstName}', leadData.firstName).replace('{budget}', budget)
            : kb.conversation_states.buying_budget_question.response.replace('{budget}', budget);
        
        return response;
    }
    
    if (conversationState === 'buying_type_question') {
        conversationState = 'buying_timeline_question';
        
        const response = leadData.firstName
            ? kb.conversation_states.buying_type_question.response_with_name.replace('{firstName}', leadData.firstName)
            : kb.conversation_states.buying_type_question.response;
        
        return response;
    }
    
    if (conversationState === 'buying_timeline_question') {
        conversationState = 'asking_buying_consultation';
        
        const response = leadData.firstName
            ? kb.conversation_states.buying_timeline_question.response_with_name.replace('{firstName}', leadData.firstName)
            : kb.conversation_states.buying_timeline_question.response;
        
        if (kb.conversation_states.buying_timeline_question.trigger_banner) {
            triggerBanner(kb.conversation_states.buying_timeline_question.trigger_banner);
        }
        
        return response;
    }
    
    if (conversationState === 'asking_buying_consultation') {
        const state = kb.conversation_states.asking_buying_consultation;
        
        // Check for YES
        if (state.yes_triggers.some(trigger => input.includes(trigger))) {
            if (state.yes_action === 'start_lead_capture') {
                startLeadCapture();
                return '';
            }
        }
        
        // Check for NO
        if (state.no_triggers.some(trigger => input.includes(trigger))) {
            conversationState = state.no_next_state;
            
            const response = leadData.firstName && state.no_response_with_name
                ? state.no_response_with_name.replace('{firstName}', leadData.firstName)
                : state.no_response;
            
            if (state.no_trigger_banner) {
                triggerBanner(state.no_trigger_banner);
            }
            
            return response;
        }
        
        // Unclear - clarify
        return leadData.firstName && state.clarify_response_with_name
            ? state.clarify_response_with_name.replace('{firstName}', leadData.firstName)
            : state.clarify_response;
    }
    
    // ===================================================
    // 🎯 VALUATION PATH STATES
    // ===================================================
    
    if (conversationState === 'valuation_revenue_question') {
        const revenue = extractRevenue(input);
        
        conversationState = 'valuation_years_question';
        
        const response = leadData.firstName
            ? kb.conversation_states.valuation_revenue_question.response_with_name.replace('{firstName}', leadData.firstName).replace('{revenue}', revenue)
            : kb.conversation_states.valuation_revenue_question.response.replace('{revenue}', revenue);
        
        return response;
    }
    
    if (conversationState === 'valuation_years_question') {
        const years = extractYears(input);
        
        conversationState = 'asking_valuation_consultation';
        
        const response = leadData.firstName
            ? kb.conversation_states.valuation_years_question.response_with_name.replace('{firstName}', leadData.firstName).replace('{years}', years)
            : kb.conversation_states.valuation_years_question.response.replace('{years}', years);
        
        if (kb.conversation_states.valuation_years_question.trigger_banner) {
            triggerBanner(kb.conversation_states.valuation_years_question.trigger_banner);
        }
        
        return response;
    }
    
    if (conversationState === 'asking_valuation_consultation') {
        const state = kb.conversation_states.asking_valuation_consultation;
        
        // Check for YES
        if (state.yes_triggers.some(trigger => input.includes(trigger))) {
            if (state.yes_action === 'start_lead_capture') {
                startLeadCapture();
                return '';
            }
        }
        
        // Check for NO
        if (state.no_triggers.some(trigger => input.includes(trigger))) {
            conversationState = state.no_next_state;
            
            const response = leadData.firstName && state.no_response_with_name
                ? state.no_response_with_name.replace('{firstName}', leadData.firstName)
                : state.no_response;
            
            if (state.no_trigger_banner) {
                triggerBanner(state.no_trigger_banner);
            }
            
            return response;
        }
        
        // Unclear - clarify
        return leadData.firstName && state.clarify_response_with_name
            ? state.clarify_response_with_name.replace('{firstName}', leadData.firstName)
            : state.clarify_response;
    }
    
    // ===================================================
    // 🎯 GENERAL QUESTIONS MATCHING
    // ===================================================
    if (kb.general_questions) {
        for (const question of kb.general_questions) {
            const hasKeyword = question.keywords.some(keyword => 
                input.includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                console.log('✅ General question matched:', question.id);
                
                // Trigger testimonial offer if specified
                if (question.testimonialOffer) {
                    pendingTestimonialType = question.testimonialOffer;
                    setTimeout(() => {
                        showTestimonialOffer(question.testimonialOffer);
                    }, 500);
                }
                
                return question.response;
            }
        }
    }
    
    // ===================================================
    // 🎯 FALLBACK RESPONSE
    // ===================================================
    return leadData.firstName
        ? kb.fallback_responses.no_match_with_name.replace('{firstName}', leadData.firstName)
        : kb.fallback_responses.no_match;
}

// ===================================================
// 🎯 HELPER FUNCTIONS FOR DATA EXTRACTION
// ===================================================

function extractRevenue(input) {
    const input_lower = input.toLowerCase();
    
    // Look for patterns like "500k", "1 million", "$250,000"
    if (input_lower.includes('million')) {
        const match = input.match(/(\d+(?:\.\d+)?)\s*million/i);
        if (match) return `$${match[1]}M`;
    }
    
    if (input_lower.includes('k')) {
        const match = input.match(/(\d+)\s*k/i);
        if (match) return `$${match[1]}K`;
    }
    
    const dollarMatch = input.match(/\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (dollarMatch) return `$${dollarMatch[1]}`;
    
    const numberMatch = input.match(/\b(\d{4,})\b/);
    if (numberMatch) {
        const num = parseInt(numberMatch[1]);
        if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `$${(num / 1000)}K`;
        return `$${num}`;
    }
    
    return 'that amount';
}

function extractBudget(input) {
    return extractRevenue(input); // Same logic as revenue
}

function extractYears(input) {
    const match = input.match(/\b(\d+)\b/);
    return match ? match[1] : 'several';
}

function triggerBanner(bannerType) {
    console.log('🎯 Banner triggered:', bannerType);
    // Your existing banner triggering code will handle this
    if (bannerType === 'freeBookWithConsultation') {
        shouldShowSmartButton = true;
        smartButtonText = 'Get Your Free Book & Consultation';
        smartButtonAction = 'bookConsultation';
    } else if (bannerType === 'smartButton') {
        shouldShowSmartButton = true;
        smartButtonAction = 'default';
    } else if (bannerType === 'thankYou') {
        shouldShowSmartButton = false;
    }
}

