// =============================================================================
// 🧠 MOBILEWISE AI CORE - COMPLETE PHASE 1
// =============================================================================
// 🎯 Includes: Introduction, Rapport Building, Need Detection, Personalization
// =============================================================================

console.log('🧠 MOBILEWISE AI CORE LOADING - Complete Phase 1');

// =============================================================================
// 🎯 GLOBAL AI STATE
// =============================================================================
window.mobilewiseAI = window.mobilewiseAI || {
    state: 'introduction',
    user: {
        name: '',
        need: '',
        urgency: 'medium',
        businessType: '',
        challenge: '',
        interestLevel: 1
    },
    conversation: {
        messages: 0,
        startedAt: Date.now(),
        rapportLevel: 0
    }
};

// Add this at the TOP of your mobilewise-ai-core.js file:
(function() {
    console.log('🔧 Installing global speech blocker');
    
    const originalSpeakText = window.speakText;
    if (originalSpeakText) {
        window.speakText = function(text) {
            // Block if testimonials are active
            if (window.speechBlockedForTestimonials || window.testimonialActive) {
                console.log('🔇 BLOCKED speech during testimonials:', text.substring(0, 50) + '...');
                return Promise.resolve(); // Return empty promise
            }
            
            // Otherwise, proceed normally
            return originalSpeakText.apply(this, arguments);
        };
        console.log('✅ Global speech blocker installed');
    }
})();

// Instead of: testimonialData.getCompleteTestimonial(userMessage)
// Use: testimonialData.getTestimonialsByConcern(detectedConcern)

function handleUserConcern(concernKey) {
    // Get ALL testimonials for this concern from ALL groups
    const testimonials = window.testimonialData.getTestimonialsByConcern(concernKey);
    
    if (testimonials.length === 0) {
        // Fallback
        return testimonialData.getFallbackTestimonial();
    }
    
    // Show selection UI with all testimonials
    showTestimonialSelection(concernKey, testimonials);
}

// =============================================================================
// 🧠 MOBILEWISE AI CORE - COMPLETE PHASE 1 - FIXED VERSION
// =============================================================================
// 🎯 Includes: Introduction, Rapport Building, Need Detection, Personalization
// =============================================================================

console.log('🧠 MOBILEWISE AI CORE LOADING - Complete Phase 1');

// =============================================================================
// 🎯 GLOBAL AI STATE - FIXED VERSION
// =============================================================================

// 🚨 CRITICAL FIX: Initialize conversation data FIRST
if (!window.conversationData) {
    window.conversationData = {
        state: 'introduction',
        userName: null,
        messages: []
    };
    console.log('✅ Initialized global conversation data');
}

window.mobilewiseAI = window.mobilewiseAI || {
    state: 'introduction',
    user: {
        name: '',
        need: '',
        urgency: 'medium',
        businessType: '',
        challenge: '',
        interestLevel: 1
    },
    conversation: {
        messages: 0,
        startedAt: Date.now(),
        rapportLevel: 0
    }
};

// =============================================================================
// 🎯 COMPLETE getAIResponse FUNCTION - FIXED VERSION
// =============================================================================
function getAIResponse(userMessage, conversationHistory = []) {
    console.log('🧠 MOBILEWISE AI Processing:', userMessage);

    // 🚨 DOUBLE-SAFETY: Ensure conversation data exists
    if (!window.conversationData) {
        window.conversationData = {
            state: 'introduction',
            userName: null,
            messages: []
        };
        console.log('✅ Emergency initialization of conversation data');
    }
    
    if (!Array.isArray(window.conversationData.messages)) {
        window.conversationData.messages = [];
    }

    // 🎯 ENHANCED POST-TESTIMONIAL RESPONSE HANDLER
    if (window.lastQuestionContext === 'post-testimonial' || 
        window.postTestimonialActive === true) {
        
        console.log('🎯 POST-TESTIMONIAL RESPONSE DETECTED!');
        console.log('   Context:', window.lastQuestionContext);
        console.log('   Active:', window.postTestimonialActive);
        
        // Clear ALL context flags
        window.lastQuestionContext = null;
        window.postTestimonialActive = false;
        
        if (window.handlePostTestimonialResponse) {
            console.log('✅ Calling response handler with:', userMessage);
            window.handlePostTestimonialResponse(userMessage);
            return; // STOP - don't process with normal AI
        } else {
            console.error('❌ Response handler not found!');
            // Continue with normal AI processing
        }
    }
    
    // 📈 Update conversation metrics
    window.mobilewiseAI.conversation.messages++;
    const mw = window.mobilewiseAI;
    const lowerMsg = userMessage.toLowerCase();
    const userName = mw.user.name || '';
    
    console.log(`📊 State: ${mw.state}, User: ${userName || 'New user'}`);

    // 🎯 Testimonial integration
    if (window.testimonialData && window.testimonialData.findRelevantTestimonial) {
        const testimonial = window.testimonialData.findRelevantTestimonial(userMessage);
        if (testimonial) {
            // Incorporate testimonial into your response
            return `I understand your concern about ${testimonial.concern.toLowerCase()}. Here's what others have said: "${testimonial.review}" - ${testimonial.author}`;
        }
    }

    // 🎯 Handle "yes/no" in QUALIFICATION state
    if (mw.state === 'qualification') {
        console.log('🎯 User is responding to qualification question');
        
        if (lowerMsg.includes('yes') || lowerMsg === 'yeah' || lowerMsg === 'yep') {
            console.log('✅ User said YES to qualification');
            mw.state = 'getting_contact_info';
            return "Perfect! Let's get your consultation scheduled. What's the best phone number to reach you?";
        }
        
        if (lowerMsg.includes('no') || lowerMsg === 'nah' || lowerMsg === 'nope') {
            console.log('⚠️ User said NO to qualification');
            mw.state = 'general_help';
            return "I understand. What other questions can I help you with today?";
        }
    }
    
    // 🎯 SIMPLE FIX: Check CURRENT STATE first
    // ----------------------------------------------------------
    // Are we asking about consultation? (Check state OR content)
    const isConsultationOffer = mw.state === 'consultation_offer' || 
                               mw.state === 'consultation_offer_response' ||
                               (conversationHistory.length > 0 && 
                                conversationHistory[conversationHistory.length - 1]?.content?.includes('consultation'));
    
    if (isConsultationOffer) {
        // Handle YES to consultation
        if (lowerMsg.includes('yes') || lowerMsg.includes('yeah') || lowerMsg.includes('sure')) {
            console.log('✅ User wants consultation!');
            mw.state = 'getting_contact_info';
            return "Perfect! Let's get you scheduled. What's your phone number?";
        }
        
        // Handle NO to consultation  
        if (lowerMsg.includes('no') || lowerMsg.includes('nah') || lowerMsg.includes('not now')) {
            console.log('⚠️ User declined consultation');
            mw.state = 'general_help';
            return "No problem. What other questions can I help you with?";
        }
    }
    // ----------------------------------------------------------
    
    // 🎯 THEN check if we just had testimonials
    if (window.testimonialActive === true) {
        console.log('🔄 Processing response after testimonials');
        
        // Handle YES after testimonials
        if (lowerMsg.includes('yes') || lowerMsg.includes('yeah') || lowerMsg.includes('sure')) {
            console.log('✅ User confirmed after testimonials!');
            mw.state = 'getting_contact_info';
            window.testimonialActive = false;
            return "Great! Let's schedule your consultation. What's your phone number?";
        }
        
        // Handle NO after testimonials
        if (lowerMsg.includes('no') || lowerMsg.includes('nah') || lowerMsg.includes('not now')) {
            console.log('⚠️ User declined after testimonials');
            mw.state = 'general_help';
            window.testimonialActive = false;
            
            return `I understand. Is there anything else I can help you with today? Feel free to ask any questions about our services.`;
        }
    }
    // ----------------------------------------------------------
    
    // 🎯 ALSO: Check if we should be in consultation offer mode
    // (This handles the normal flow when NOT coming from testimonials)
    if (mw.state === 'consultation_offer_response' || 
        (mw.user.name && lowerMsg.includes('consultation') || lowerMsg.includes('free'))) {
        
        // Handle YES to consultation offer (normal flow)
        const yesWords = ['yes', 'yeah', 'yep', 'sure', 'absolutely'];
        if (yesWords.some(word => lowerMsg.includes(word))) {
            console.log('✅ User wants consultation!');
            mw.state = 'getting_contact_info';
            
            return `Great! Let's get you scheduled. What's your phone number so our team can contact you?`;
        }
        
        // Handle NO to consultation offer
        const noWords = ['no', 'nah', 'nope', 'not now'];
        if (noWords.some(word => lowerMsg.includes(word))) {
            console.log('⚠️ User declined consultation');
            mw.state = 'general_help';
            
            return `No problem at all. What other questions can I help you with today?`;
        }
    }
    
    // =========================================================================
    // 🎯 NAME GREETING FIX: Check if we're getting the user's name
    // =========================================================================
    if ((mw.state === 'introduction' || !mw.user.name) && userMessage.trim()) {
        const name = userMessage.trim();
        const isLikelyName = /^[A-Z][a-z]{2,15}$/.test(name) || 
                            (name.length >= 2 && name.length <= 20);
        
        if (isLikelyName) {
            // Format and store the name
            const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            mw.user.name = formattedName;
            window.conversationData.userName = formattedName;
            
            // Update state
            mw.state = 'rapport_building';
            window.conversationData.state = 'rapport_building';
            
            console.log(`✅ Name captured: ${formattedName}`);
            console.log(`✅ State: introduction → rapport_building`);
            
            // Return personalized greeting
            return `Hello ${formattedName}! How can I help you today?`;
        }
    }
    
    // =========================================================================
    // 🚨 STEP 1: URGENT/EMERGENCY DETECTION (From your original)
    // =========================================================================
    const urgentPatterns = ['urgent', 'asap', 'right now', 'immediately', 'emergency', 'call me now'];
    if (urgentPatterns.some(pattern => lowerMsg.includes(pattern))) {
        console.log('🚨 URGENT REQUEST DETECTED');
        setTimeout(() => {
            if (window.triggerLeadActionCenter) {
                window.triggerLeadActionCenter();
            }
        }, 1000);
        return "I understand this is urgent! I've opened our immediate connection options.";
    }
    
    // =========================================================================
    // 🚨 STEP 2: APPOINTMENT/DEMO DETECTION (From your original)
    // =========================================================================
    const demoPatterns = ['demo', 'show me', 'see it', 'how it works', 'appointment', 'meeting', 'schedule'];
    if (demoPatterns.some(pattern => lowerMsg.includes(pattern))) {
        console.log('🎯 DEMO REQUEST DETECTED');
        setTimeout(() => {
            if (window.triggerLeadActionCenter) {
                window.triggerLeadActionCenter();
            }
        }, 1000);
        return "Perfect timing! I've opened our AI demo scheduling options.";
    }
    
// =============================================================================
// 🎯 ENHANCED CONCERN DETECTION WITH TESTIMONIALS
// =============================================================================

// Add this near the top with other concern patterns
const testimonialConcernPatterns = [
    // PRICE CONCERNS
    {pattern: 'expensive', type: 'price', response: "I understand your concern about the cost."},
    {pattern: 'cost', type: 'price', response: "I hear you on the pricing question."},
    {pattern: 'price', type: 'price', response: "I appreciate you mentioning the price."},
    {pattern: 'afford', type: 'price', response: "I understand your affordability concern."},
    
    // TIME CONCERNS  
    {pattern: 'time', type: 'time', response: "I understand your concern about time."},
    {pattern: 'busy', type: 'time', response: "I hear you're busy and don't have extra time."},
    {pattern: 'when', type: 'time', response: "I understand your question about timing."},
    
    // TRUST CONCERNS
    {pattern: 'trust', type: 'trust', response: "I appreciate your honesty about trust."},
    {pattern: 'believe', type: 'trust', response: "I understand you're wondering if you can believe in this."},
    {pattern: 'skeptical', type: 'trust', response: "I get that you're feeling skeptical."},
    {pattern: 'scam', type: 'trust', response: "I appreciate you sharing that concern about legitimacy."},
    
    // EFFECTIVENESS CONCERNS
    {pattern: 'work', type: 'general', response: "I understand your question about whether this will work."},
    {pattern: 'results', type: 'general', response: "I understand your concern about getting results."},
    {pattern: 'worried', type: 'general', response: "I hear you're worried about this."}
];

// Replace or enhance the concern detection section
for (const concern of testimonialConcernPatterns) {
    if (lowerMsg.includes(concern.pattern)) {
        console.log(`🚨 CONCERN DETECTED: ${concern.type} (pattern: "${concern.pattern}")`);
        
        // Store the concern type
        window.detectedConcernType = concern.type;
        
        // 🎯 NEW: Check for specific industry testimonials
        if (window.checkTestimonialTriggers) {
            const testimonialMatch = window.checkTestimonialTriggers(userMessage);
            if (testimonialMatch && testimonialMatch.videos.length > 0) {
                console.log('✅ Found matching testimonials!');
                
                // Call your existing testimonial handler
                if (typeof handleConcernWithTestimonial === 'function') {
                    // Pass both the message and matched testimonials
                    const enhancedMessage = `${concern.response} Let me show you what other business owners experienced...`;
                    
                    // Store the matched testimonials
                    window.matchedTestimonials = testimonialMatch.videos;
                    window.currentTestimonialConcern = testimonialMatch.concern;
                    
                    handleConcernWithTestimonial(userMessage);
                    
                    // Return the enhanced message
                    return enhancedMessage;
                }
            }
        }
        
        // Fallback to original concern handling
        if (typeof handleConcernWithTestimonial === 'function') {
            handleConcernWithTestimonial(userMessage);
            return `${concern.response} Let me show you what other business owners experienced...`;
        }
        
        return `${concern.response} Many clients had similar thoughts initially...`;
    }
}

// =========================================================================
// 🚨 STEP 3: ENHANCED CONCERN DETECTION WITH SPECIFIC RESPONSES
// =========================================================================
const concernPatterns = [
    // PRICE CONCERNS
    {pattern: 'expensive', type: 'price', response: "I understand your concern about the cost."},
    {pattern: 'cost', type: 'price', response: "I hear you on the pricing question."},
    {pattern: 'price', type: 'price', response: "I appreciate you mentioning the price."},
    {pattern: 'afford', type: 'price', response: "I understand your affordability concern."},
    {pattern: 'worth it', type: 'price', response: "I get why you're wondering if it's worth the investment."},
    
    // TIME CONCERNS  
    {pattern: 'time', type: 'time', response: "I understand your concern about time."},
    {pattern: 'busy', type: 'time', response: "I hear you're busy and don't have extra time."},
    {pattern: 'when', type: 'time', response: "I understand your question about timing."},
    {pattern: 'long', type: 'time', response: "I get that you're concerned about how long this takes."},
    
    // TRUST CONCERNS
    {pattern: 'trust', type: 'trust', response: "I appreciate your honesty about trust."},
    {pattern: 'believe', type: 'trust', response: "I understand you're wondering if you can believe in this."},
    {pattern: 'skeptical', type: 'trust', response: "I get that you're feeling skeptical."},
    {pattern: 'not sure', type: 'trust', response: "I understand you're not sure about this."},
    {pattern: 'scam', type: 'trust', response: "I appreciate you sharing that concern about legitimacy."},
    {pattern: 'real', type: 'trust', response: "I understand you're wondering if this is real."},
    
    // EFFECTIVENESS CONCERNS
    {pattern: 'work', type: 'general', response: "I understand your question about whether this will work."},
    {pattern: 'actually work', type: 'general', response: "I get that you're wondering if this actually works."},
    {pattern: 'results', type: 'general', response: "I understand your concern about getting results."},
    {pattern: 'good thing', type: 'general', response: "I appreciate you sharing your thoughts about whether AI is good."},
    {pattern: 'bad', type: 'general', response: "I understand your concern that AI might not be good."},
    {pattern: 'worried', type: 'general', response: "I hear you're worried about this."},
    {pattern: 'concerned', type: 'general', response: "I appreciate you sharing your concern."}
];

for (const concern of concernPatterns) {
    if (lowerMsg.includes(concern.pattern)) {
        console.log(`🚨 CONCERN DETECTED: ${concern.type} (pattern: "${concern.pattern}")`);
        
        // Store the concern type for testimonial system
        window.detectedConcernType = concern.type;
        console.log(`📝 Stored concern type: ${window.detectedConcernType}`);
        
        // 🎯 NEW: Check for specific industry testimonials BEFORE calling handleConcernWithTestimonial
        if (window.checkTestimonialTriggers && window.testimonialData) {
            const testimonialMatch = window.checkTestimonialTriggers(userMessage);
            if (testimonialMatch && testimonialMatch.videos.length > 0) {
                console.log(`✅ Found ${testimonialMatch.videos.length} matching testimonials`);
                window.matchedTestimonials = testimonialMatch.videos;
                window.currentTestimonialConcern = testimonialMatch.concern;
            }
        }
        
        // Call testimonial system if available
        if (typeof handleConcernWithTestimonial === 'function') {
            console.log(`✅ Calling handleConcernWithTestimonial with user message`);
            
            // Pass the user's exact message so testimonial system can analyze it
            handleConcernWithTestimonial(userMessage);
            
            // Return a placeholder response (will be replaced by testimonial system)
            return `${concern.response} Let me show you what other business owners experienced...`;
        } else {
            console.error('❌ handleConcernWithTestimonial function not found!');
            return `${concern.response} Many clients had similar thoughts initially...`;
        }
    }
}

// 🆕 ADD THIS DETECTION FUNCTION (add it near other detection functions)
function detectInformationalVideoRequest(transcript) {
    console.log('🎓 Checking for informational video request:', transcript);
    
    const informationalTriggers = [
        // Conversion & Results
        '300%', 'triple', 'more conversions', 'increase conversion', 'boost sales',
        'higher conversion', 'better results', 'improve roi', 'more sales',
        
        // Leads & Quality
        'pre qualified', 'qualified leads', 'hot leads', 'sales ready', 
        'better leads', 'quality leads', 'stop wasting time', 'tire kickers',
        
        // Testimonials & Trust
        'testimonials', 'social proof', 'trust', 'social validation', 
        'proof', 'evidence', 'case studies', 'success stories',
        
        // Implementation & Ease
        'setup', 'implement', 'install', 'add to website', 'integration',
        'easy', 'simple', 'technical', 'skills', 'difficult', 'hard',
        '5 minutes', 'quick', 'fast', 'time', 'effort',
        
        // How It Works
        'how does it work', 'process', 'step by step', 'explain', 'show me',
        'demonstrate', 'walk through', 'guide', 'tutorial',
        
        // Podcast Specific
        'podcast', 'listeners', 'audience', 'episode', 'show',
        'monetize', 'make money', 'income', 'revenue', 'profit',
        
        // Business Types
        'service business', 'consultant', 'agency', 'freelancer', 'b2b',
        'ecommerce', 'online store', 'shopify', 'woocommerce', 'cart',
        
        // General Info
        'information', 'details', 'more about', 'learn more',
        'understand better', 'see how', 'watch demo', 'demo'
    ];
    
    const transcriptLower = transcript.toLowerCase().trim();
    
    return informationalTriggers.some(trigger => 
        transcriptLower.includes(trigger.toLowerCase())
    );
}

// 🆕 ADD THIS CHECK in your main processing function
// Find where you process user voice input (look for something like):
// function processVoiceInput(transcript) { ... }
// OR
// function handleUserMessage(message) { ... }

// INSIDE THAT FUNCTION, ADD THIS AT THE BEGINNING:
const safeTranscript = transcript || window.lastTranscript || '';
if (detectInformationalVideoRequest(safeTranscript)) {
    console.log('🎬 Informational video request detected!');
    if (typeof window.showInformationalVideos === 'function') {
        window.showInformationalVideos();
        return true; // Stop further processing
    }
}

// It should look like this:
function processUserVoiceInput(transcript) {
    // 🆕 NEW CHECK - ADD THIS FIRST
    if (detectInformationalVideoRequest(transcript)) {
        console.log('🎬 Triggering informational videos...');
        if (typeof window.showInformationalVideos === 'function') {
            window.showInformationalVideos();
            return true;
        }
    }
    
    // ... your EXISTING testimonial detection code ...
    if (detectTestimonialNeed(transcript)) {
        console.log('🎬 Triggering testimonials...');
        if (typeof window.showTestimonialSplashScreen === 'function') {
            window.showTestimonialSplashScreen();
            return true;
        }
    }
    
    // ... rest of your existing code ...
}

// 🎯 CORRECTED VERSION - Remove duplicate
function handleConcernWithTestimonial(userText) {
    window.testimonialActive = true;

    // 🛑 PREVENT DUPLICATE SPLASH SCREENS
    const existingSplash = document.getElementById('testimonial-splash-screen');
    if (existingSplash) {
        console.log('⚠️ Splash screen already exists - removing duplicate');
        existingSplash.remove();
    }
    
    // 🛑 CHECK IF ALREADY PLAYING
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Video already playing - skipping new splash screen');
        return;
    }

    console.log(`🎯 handleConcernWithTestimonial called with: "${userText}"`);
    
    // 🎯 DETECT CONCERN TYPE FROM USER TEXT
    const concernType = detectConcernTypeFromText(userText);
    console.log(`🎯 Detected concern type: ${concernType}`);
    
    // 🎯 GENERATE CONCERN-ECHO ACKNOWLEDGMENT
    const acknowledgment = generateConcernEchoResponse(userText, concernType);
    
    // 🎯 TRIGGER UNIVERSAL BANNER ENGINE (TOP BANNER)
    if (window.showUniversalBanner) {
        window.showUniversalBanner('testimonialSelector');
    }
    
    console.log(`🎯 Handling ${concernType} concern - showing testimonial response`);
    console.log(`🎯 Echo response: "${acknowledgment}"`);

    // 1. STOP ANY CURRENT SPEECH IMMEDIATELY
    if (window.stopSpeaking && typeof window.stopSpeaking === 'function') {
        window.stopSpeaking();
        console.log('🔇 Stopped any current speech');
    }

    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
        console.log('🔇 Stopped any current listening');
    }

    // 2. Add AI message to chat (SILENTLY - no speech yet)
    if (window.addAIMessage && typeof window.addAIMessage === 'function') {
        window.addAIMessage(acknowledgment);
        console.log('✅ AI message added to chat (silent)');
    }

    // 🛑 CRITICAL FIX: Block ALL speech during testimonials
    window.speechBlockedForTestimonials = true;

    // Set timeout to re-enable speech after testimonials
    setTimeout(() => {
        window.speechBlockedForTestimonials = false;
        console.log('🔓 Speech block released');
    }, 15000); // 15 seconds

    // 3. SHOW TESTIMONIALS IMMEDIATELY - THEY CONTROL THE FLOW NOW
    setTimeout(() => {
        if (window.showTestimonialSplashScreen && typeof window.showTestimonialSplashScreen === 'function') {
            // Set flag that testimonials are active
            window.testimonialActive = true;
            console.log('🎬 Setting testimonialActive = true');
            
            window.showTestimonialSplashScreen();
            console.log('✅ Testimonial splash screen launched - THEY control speech flow');
        } else {
            console.error('❌ showTestimonialSplashScreen not available');
            // Fallback: speak after delay
            setTimeout(() => {
                if (window.speakText) window.speakText(acknowledgment);
            }, 1000);
        }
    }, 100);

    // 5. Store the concern
    window.lastDetectedConcern = {
        text: userText,
        type: concernType,
        timestamp: Date.now(),
        echoResponse: acknowledgment,
        testimonialTriggered: true  // Add this flag
    };
}

// 🎯 DETECT CONCERN TYPE FROM TEXT
function detectConcernTypeFromText(userText) {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('expensive') || lowerText.includes('cost') || lowerText.includes('price') || lowerText.includes('afford')) {
        return 'price';
    }
    if (lowerText.includes('time') || lowerText.includes('busy') || lowerText.includes('when') || lowerText.includes('long')) {
        return 'time';
    }
    if (lowerText.includes('trust') || lowerText.includes('believe') || lowerText.includes('skeptical') || lowerText.includes('scam') || lowerText.includes('real')) {
        return 'trust';
    }
    if (lowerText.includes('work') || lowerText.includes('results') || lowerText.includes('good thing') || lowerText.includes('bad') || lowerText.includes('worried')) {
        return 'general';
    }
    
    return window.detectedConcernType || 'general';
}

// 🎯 GENERATE CONCERN-ECHO RESPONSE
function generateConcernEchoResponse(userText, concernType) {
    const lowerText = userText.toLowerCase();
    
    // Extract the specific concern phrase
    let specificConcern = '';
    if (lowerText.includes('expensive')) specificConcern = "it's too expensive";
    else if (lowerText.includes('cost')) specificConcern = "the cost";
    else if (lowerText.includes('price')) specificConcern = "the price";
    else if (lowerText.includes('afford')) specificConcern = "affordability";
    else if (lowerText.includes('time')) specificConcern = "the time commitment";
    else if (lowerText.includes('busy')) specificConcern = "being too busy";
    else if (lowerText.includes('trust')) specificConcern = "trusting this";
    else if (lowerText.includes('believe')) specificConcern = "believing in this";
    else if (lowerText.includes('skeptical')) specificConcern = "feeling skeptical";
    else if (lowerText.includes('work')) specificConcern = "whether this will work";
    else if (lowerText.includes('good thing')) specificConcern = "whether AI is a good thing";
    else specificConcern = "that";
    
    // Generate response based on concern type
    const responses = {
        price: `I completely understand your concern about ${specificConcern}. Many of our clients felt the same way initially. If you'd like to hear what they experienced, click a review below. Or click Skip to continue our conversation.`,
        time: `I hear you on ${specificConcern}. Several of our clients had similar thoughts before working with us. Feel free to click a review to hear their experience, or hit Skip and we'll keep talking.`,
        trust: `That's a fair concern about ${specificConcern}. You're not alone - other business owners felt the same way at first. You're welcome to check out their reviews below, or click Skip to move forward.`,
        general: `I appreciate you sharing ${specificConcern}. Some of our valued clients started with similar hesitations. If you're curious what happened for them, click a review. Otherwise, click Skip and let's continue.`
    };
    
    return responses[concernType] || responses.general;
}
    
    // =========================================================================
    // 🎯 STEP 4: MAIN CONVERSATION FLOW
    // =========================================================================
    
    // PHASE 1: INTRODUCTION - NAME CAPTURE
    if (mw.state === 'introduction') {
        console.log('👋 Handling introduction phase');
        return handleIntroduction(userMessage);
    }
    
    // PHASE 2: RAPPORT BUILDING
    if (mw.state === 'rapport_building') {
        console.log('🤝 Building rapport with', userName);
        return handleRapportBuilding(userMessage, userName);
    }
    
    // PHASE 3: NEEDS DISCOVERY
    if (mw.state === 'needs_discovery') {
        console.log('🔍 Discovering needs for', userName);
        return handleNeedsDiscovery(userMessage, userName);
    }
    
    // PHASE 4: SOLUTION PRESENTATION
    if (mw.state === 'solution_presentation') {
        console.log('💡 Presenting solution to', userName);
        return presentSolution(userMessage, userName);
    }
    
    // PHASE 5: CLOSING
    if (mw.state === 'closing') {
        console.log('🎯 Closing conversation with', userName);
        return handleClosing(userMessage, userName);
    }
    
    // Fallback response
    return `Thanks for sharing that${userName ? ', ' + userName : ''}! I'd love to help you explore AI solutions. What's on your mind?`;
}

// =============================================================================
// 👋 HANDLE INTRODUCTION - COMPLETE WITH WELCOME SPLASH
// =============================================================================
function handleIntroduction(userMessage) {
    const name = extractName(userMessage);
    
    if (!name || name.length < 2) {
        return "Hi! I'm Boteemia from MobileWise AI. What's your first name?";
    }
    
    // 🎯 CAPTURE AND FORMAT NAME
    const formattedName = formatName(name);
    window.mobilewiseAI.user.name = formattedName;
    window.mobilewiseAI.state = 'rapport_building';
    window.mobilewiseAI.conversation.rapportLevel = 10;
    
    console.log(`✅ Name captured: ${formattedName}`);
    console.log(`✅ State: introduction → rapport_building`);
    
    // 🎉 TRIGGER WELCOME SPLASH (From your original code)
    if (!window.welcomeSplashShown && window.showWelcomeSplash) {
        console.log('🎉 Triggering welcome splash for:', formattedName);
        setTimeout(() => {
            window.showWelcomeSplash(formattedName);
        }, 100);
    }
    
    // 🎯 PERSONALIZED WELCOME (Need-focused approach)
    return `Nice to meet you ${formattedName}! I'm Sophia, your AI assistant from MobileWise AI. 
            We help businesses with AI that actually closes deals. 
            What's the #1 challenge you're facing in your business right now?`;
}

// =============================================================================
// 🤝 HANDLE RAPPORT BUILDING - COMPLETE WITH NEED DETECTION
// =============================================================================
function handleRapportBuilding(userMessage, userName) {
    const lowerMsg = userMessage.toLowerCase();
    
    // 📈 Increase rapport
    window.mobilewiseAI.conversation.rapportLevel = Math.min(
        window.mobilewiseAI.conversation.rapportLevel + 5,
        100
    );
    
    console.log(`📈 Rapport: ${window.mobilewiseAI.conversation.rapportLevel}/100`);
    
    // 🎯 DETECT BUSINESS NEEDS
    const detectedNeeds = detectBusinessNeeds(lowerMsg);
    
    if (detectedNeeds.length > 0) {
        // CAPTURE PRIMARY NEED
        window.mobilewiseAI.user.need = detectedNeeds[0].type;
        window.mobilewiseAI.user.challenge = userMessage;
        window.mobilewiseAI.state = 'needs_discovery';
        
        console.log(`✅ Need identified: ${detectedNeeds[0].type}`);
        console.log(`✅ State: rapport_building → needs_discovery`);
        
        // PERSONALIZED RESPONSE BASED ON NEED
        return generateNeedResponse(userName, detectedNeeds[0], userMessage);
    }
    
    // 🎯 CONTINUE RAPPORT BUILDING
    return continueRapportBuilding(userName, userMessage);
}

// =============================================================================
// 🔍 HANDLE NEEDS DISCOVERY - DIG DEEPER INTO THEIR PAIN
// =============================================================================
function handleNeedsDiscovery(userMessage, userName) {
    const lowerMsg = userMessage.toLowerCase();
    
    // 🎯 CAPTURE SPECIFIC DETAILS ABOUT THEIR CHALLENGE
    if (lowerMsg.includes('website') || lowerMsg.includes('online') || lowerMsg.includes('visitor')) {
        window.mobilewiseAI.user.challenge = 'website_conversions';
    } else if (lowerMsg.includes('call') || lowerMsg.includes('phone') || lowerMsg.includes('missed')) {
        window.mobilewiseAI.user.challenge = 'missed_calls';
    } else if (lowerMsg.includes('time') || lowerMsg.includes('busy') || lowerMsg.includes('overwhelm')) {
        window.mobilewiseAI.user.challenge = 'time_constraints';
    }
    
    window.mobilewiseAI.state = 'solution_presentation';
    console.log(`✅ Challenge identified: ${window.mobilewiseAI.user.challenge}`);
    console.log(`✅ State: needs_discovery → solution_presentation`);
    
    return `Thanks for sharing that detail, ${userName}. I understand exactly what you're dealing with. 
            Based on what you've told me, here's how our AI could help... Want to see specific examples?`;
}

// =============================================================================
// 🏢 COMPANY PROFILE LOADER (Add at top of mobilewise-ai-core.js)
// =============================================================================

// Default MobileWise profile (used if no custom profile)
const DEFAULT_COMPANY_PROFILE = {
    identity: {
        companyName: "MobileWise AI",
        website: "mobilewiseai.com"
    },
    leadership: {
        founderName: "Brett Duncan",
        founderTitle: "The ROI Revolutionary",
        founderExperience: "25 years of marketing experience"
    },
    offers: {
        freeOffer: "FREE AI Business Analysis (value: $2,500)",
        demoOffer: "15-minute demo of our deal-closing AI",
        freeEbook: "Free copy of 'The AI-Powered Business' ebook"
    }
};

// Load company profile (custom or default)
window.MOBILEWISE_COMPANY = window.MOBILEWISE_COMPANY || DEFAULT_COMPANY_PROFILE;
console.log('🏢 Company Profile:', window.MOBILEWISE_COMPANY.identity.companyName);

// =============================================================================
// 💡 PRESENT SOLUTION - SHOW HOW AI SOLVES THEIR PROBLEM
// =============================================================================
function presentSolution(userMessage, userName) {
    console.log('🔍 DEBUG presentSolution - User said:', userMessage);
    
    // 🏢 GET COMPANY PROFILE (if available)
    const company = window.MOBILEWISE_COMPANY || {};
    const founderName = company.leadership?.founderName || "Brett Duncan";
    const freeOffer = company.offers?.freeOffer || "FREE AI Business Analysis (value: $2,500)";
    const demoOffer = company.offers?.demoOffer || "15-minute demo of our deal-closing AI";
    
    const lowerMsg = userMessage.toLowerCase();
    
    // 🎯 EXPANDED POSITIVE RESPONSES
    const positiveResponses = [
        'yes', 'yeah', 'sure', 'ok', 'okay', 'absolutely', 'definitely',
        'tell me', 'how', 'show me', 'demo', 'see it', 'let\'s do it',
        'would', 'i would', 'i\'d like', 'interested', 'ready', 'go ahead'
    ];
    
    console.log('🔍 Checking for positives in:', lowerMsg);
    console.log('🏢 Using company offer:', freeOffer);
    
    // 🎯 CHECK IF USER IS SAYING YES
    const isPositiveResponse = positiveResponses.some(r => lowerMsg.includes(r));
    const isSayingNo = lowerMsg.includes('no') || lowerMsg.includes('not') || lowerMsg.includes('later');
    
    if (isPositiveResponse && !isSayingNo) {
        console.log('✅ POSITIVE RESPONSE DETECTED!');
        window.mobilewiseAI.state = 'closing';
        window.mobilewiseAI.user.interestLevel = Math.min(window.mobilewiseAI.user.interestLevel + 2, 10);
        
        console.log(`📈 Interest level: ${window.mobilewiseAI.user.interestLevel}/10`);
        console.log(`🔄 State: solution_presentation → closing`);
        
        // 🎯 SET UP ACTION CENTER TRIGGER
        window.lastPreCloseIntent = 'mobilewise_demo';
        window.lastPreCloseQuestion = `${userName}, perfect! I recommend our ${freeOffer}`;
        
        // 🎯 COMPANY-AWARE RESPONSE
        return `${userName}, perfect! I recommend our ${freeOffer}. 
                We'll analyze your current situation and show exactly where AI could boost your results. 
                Would Tuesday at 3pm work for your free analysis with ${founderName}?`;
    } 
    else if (isSayingNo) {
        console.log('🔄 User said no - staying in solution presentation');
        
        // 🎯 OFFER ALTERNATIVE BASED ON COMPANY PROFILE
        const alternativeOffer = company.offers?.freeEbook || "Free copy of 'The AI-Powered Business' ebook";
        return `No problem, ${userName}! Would you prefer ${alternativeOffer} first, 
                or what specific question can I answer about AI for your business?`;
    }
    else if (lowerMsg.includes('demo') || lowerMsg.includes('show me') || lowerMsg.includes('see it')) {
        // 🎯 DIRECT DEMO REQUEST
        console.log('🎯 Direct demo request detected');
        window.mobilewiseAI.state = 'closing';
        
        return `${userName}, excellent! I'd love to show you ${demoOffer} with ${founderName}. 
                Would tomorrow at 2pm work for a quick walkthrough?`;
    }
    else {
        // 🎯 USER SAID SOMETHING ELSE - ASK FOR CLARIFICATION
        console.log('❓ Ambiguous response - asking for clarification');
        return `${userName}, to make sure I understand - are you interested in seeing how our AI 
                could help with your challenge, or would you prefer more information first?`;
    }
}

// =============================================================================
// 🎯 HANDLE CLOSING - TRIGGER ACTION CENTER ON "YES"
// =============================================================================
function handleClosing(userMessage, userName) {
    console.log('🔍 DEBUG handleClosing - User said:', userMessage);
    
    // 🏢 GET COMPANY PROFILE
    const company = window.MOBILEWISE_COMPANY || {};
    const founderName = company.leadership?.founderName || "our AI specialist";
    const companyName = company.identity?.companyName || "MobileWise AI";
    
    const lowerMsg = userMessage.toLowerCase();
    
    // 🎯 EXPANDED YES PATTERNS
    const yesPatterns = [
        'yes', 'yeah', 'sure', 'okay', 'ok', 'absolutely', 'definitely', 
        'let\'s do it', 'ready', 'go ahead', 'would', 'i would', 'tuesday',
        '3pm', '3 pm', 'works', 'that works', 'sounds good', 'perfect'
    ];
    
    // 🎯 NO PATTERNS
    const noPatterns = ['no', 'not', 'later', 'maybe', 'another time', 'different time'];
    
    // 🎯 SCHEDULING PATTERNS
    const schedulingPatterns = [
        'tuesday', 'wednesday', 'thursday', 'friday', 'monday', 'tomorrow',
        'next week', 'morning', 'afternoon', 'evening', '10am', '2pm', '4pm'
    ];
    
    console.log('🔍 Checking for yes in:', lowerMsg);
    
    if (yesPatterns.some(pattern => lowerMsg.includes(pattern)) && 
        !noPatterns.some(pattern => lowerMsg.includes(pattern))) {
        
        // 🚀 TRIGGER ACTION CENTER
        console.log('🎯 USER SAID YES - Triggering Action Center');
        
        setTimeout(() => {
            if (window.triggerLeadActionCenter) {
                window.triggerLeadActionCenter();
                console.log('✅ Action Center triggered');
            } else {
                console.error('❌ triggerLeadActionCenter not found');
            }
        }, 300);
        
        return `Excellent ${userName}! I've opened our booking options. 
                Click any button to schedule with ${founderName}'s team!`;
    }
    else if (schedulingPatterns.some(pattern => lowerMsg.includes(pattern))) {
        console.log('🗓️ SCHEDULING MENTION DETECTED');
        
        // 🎯 TRIGGER ACTION CENTER FOR SCHEDULING
        setTimeout(() => {
            if (window.triggerLeadActionCenter) {
                window.triggerLeadActionCenter();
                console.log('✅ Action Center triggered for scheduling');
            }
        }, 300);
        
        return `${userName}, perfect timing! I've opened ${companyName}'s calendar. 
                Click any option to confirm with ${founderName}'s team.`;
    }
    else if (noPatterns.some(pattern => lowerMsg.includes(pattern))) {
        console.log('🔄 User said no - offering alternatives');
        
        const alternatives = [
            `I understand, ${userName}. Would a ${company.offers?.freeEbook || "free AI guide"} be helpful first?`,
            `No problem, ${userName}! What specific information would help you feel comfortable?`,
            `Thanks for your honesty, ${userName}. Many ${companyName} clients started with similar questions. 
             Would you like to see their experience first?`
        ];
        
        return alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    else {
        console.log('❓ Ambiguous closing response');
        return `${userName}, to confirm - would Tuesday at 3pm work for your free analysis with ${founderName}, 
                or should we look at a different time?`;
    }
}

// =============================================================================
// 🛠️ UTILITY FUNCTIONS (From your original, adapted)
// =============================================================================

function extractName(message) {
    const words = message.trim().split(' ');
    if (words.length > 0 && words[0].length > 1) {
        const name = words[0];
        // Filter out common words
        const commonWords = ['hi', 'hello', 'hey', 'ok', 'yes', 'no', 'maybe', 'well'];
        if (!commonWords.includes(name.toLowerCase())) {
            return name;
        }
    }
    return '';
}

function formatName(name) {
    if (!name || name.length === 0) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function detectBusinessNeeds(message) {
    const needs = [];
    
    // 🎯 LEAD GENERATION
    if (message.includes('lead') || message.includes('customer') || message.includes('client')) {
        needs.push({ type: 'more_leads', priority: 'high' });
    }
    
    // 🎯 CONVERSIONS
    if (message.includes('convert') || message.includes('sale') || message.includes('close')) {
        needs.push({ type: 'better_conversions', priority: 'high' });
    }
    
    // 🎯 TIME SAVINGS
    if (message.includes('time') || message.includes('busy') || message.includes('overwhelm')) {
        needs.push({ type: 'save_time', priority: 'medium' });
    }
    
    // 🎯 COST REDUCTION
    if (message.includes('cost') || message.includes('money') || message.includes('expensive')) {
        needs.push({ type: 'reduce_costs', priority: 'medium' });
    }
    
    // 🎯 CUSTOMER SERVICE
    if (message.includes('service') || message.includes('support') || message.includes('answer')) {
        needs.push({ type: 'better_service', priority: 'medium' });
    }
    
    // Sort by priority
    return needs.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

function generateNeedResponse(userName, need, originalMessage) {
    const responses = {
        'more_leads': `${userName}, getting more quality leads is EXACTLY what our AI excels at! 
                      We increase lead capture by 40-60% for businesses. Tell me more about your 
                      current lead generation efforts.`,
        
        'better_conversions': `${userName}, conversion leaks are profit killers! Our AI guides 
                              website visitors to become customers - increasing conversions by 23%+. 
                              What's your current conversion rate like?`,
        
        'save_time': `${userName}, time is your most valuable asset! Our AI automates repetitive 
                      tasks, saving businesses 15+ hours weekly. What task takes most of your time?`,
        
        'reduce_costs': `${userName}, controlling costs is smart business! Our AI reduces 
                        customer support costs by 30% while improving service. What's your 
                        biggest expense right now?`,
        
        'better_service': `${userName}, customer service should build loyalty! Our AI handles 
                          70%+ of inquiries instantly, 24/7. How many support requests do you get daily?`
    };
    
    return responses[need.type] || `${userName}, thanks for sharing that! I'd love to show you 
                                    how AI could help. What specific results are you looking for?`;
}

function continueRapportBuilding(userName, userMessage) {
    const responses = [
        `${userName}, thanks for sharing that. Tell me more about your business goals.`,
        `I appreciate you opening up about that, ${userName}. What would solving that 
         challenge mean for your business?`,
        `${userName}, that's really helpful context. What's your ideal outcome here?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// =============================================================================
// 🎯 INITIALIZATION
// =============================================================================
console.log('✅ MOBILEWISE AI CORE LOADED - Complete Phase 1');
console.log('🎯 Conversation States: introduction → rapport_building → needs_discovery → solution_presentation → closing');
console.log('👤 Will capture name, build rapport, identify needs, present solution');
console.log('🚀 Ready to revolutionize sales at $0.40/day!');

// =============================================================================
// 🎯 TESTIMONIAL TRIGGER CHECKER
// =============================================================================

// This function helps find industry-specific testimonials
window.checkTestimonialTriggers = function(userMessage) {
    console.log('🔍 checkTestimonialTriggers called for:', userMessage);
    
    // Check if testimonial data is available
    if (!window.testimonialData || !window.testimonialData.industries) {
        console.log('❌ No testimonial data available');
        return null;
    }
    
    const currentIndustrySlug = window.testimonialData.currentIndustry;
    const industry = window.testimonialData.industries[currentIndustrySlug];
    
    if (!industry || !industry.concerns) {
        console.log('❌ No industry data or concerns found');
        return null;
    }
    
    const lowerMsg = userMessage.toLowerCase();
    
    // Check each industry concern against the user's message
    for (const concern of industry.concerns) {
        if (lowerMsg.includes(concern.toLowerCase())) {
            console.log(`✅ Found matching concern: "${concern}"`);
            
            // Find videos related to this concern
            const matchingVideos = [];
            if (industry.videos) {
                Object.entries(industry.videos).forEach(([videoId, video]) => {
                    const videoText = (video.title + ' ' + (video.tags || []).join(' ')).toLowerCase();
                    if (videoText.includes(concern.toLowerCase())) {
                        matchingVideos.push({
                            id: videoId,
                            ...video,
                            industry: currentIndustrySlug,
                            concern: concern
                        });
                    }
                });
            }
            
            return {
                industry: currentIndustrySlug,
                concern: concern,
                videos: matchingVideos,
                message: `I understand your concern about ${concern}. Here's what other clients experienced:`
            };
        }
    }
    
    console.log('❌ No industry concern match found');
    return null;
};

console.log('✅ checkTestimonialTriggers function added to mobilewise-ai-core.js');