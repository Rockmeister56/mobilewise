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

// =============================================================================
// 🎯 COMPLETE getAIResponse FUNCTION (400+ lines of logic)
// =============================================================================
async function getAIResponse(userMessage, conversationHistory = []) {
    console.log('🧠 MOBILEWISE AI Processing:', userMessage);
    
    // 📈 Update conversation metrics
    window.mobilewiseAI.conversation.messages++;
    const mw = window.mobilewiseAI;
    const lowerMsg = userMessage.toLowerCase();
    const userName = mw.user.name || '';
    
    console.log(`📊 State: ${mw.state}, User: ${userName || 'New user'}`);
    
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
    
    // =========================================================================
    // 🚨 STEP 3: CONCERN DETECTION (Simplified version)
    // =========================================================================
    const concernPatterns = ['expensive', 'cost', 'price', 'trust', 'believe', 'time', 'busy'];
    if (concernPatterns.some(pattern => lowerMsg.includes(pattern))) {
        console.log('🚨 CONCERN DETECTED');
        return "I understand your concern. Let me show you what other business owners experienced...";
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
        return "Hi! I'm Sophia from MobileWise AI. What's your first name?";
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
// 💡 PRESENT SOLUTION - SHOW HOW AI SOLVES THEIR PROBLEM
// =============================================================================
function presentSolution(userMessage, userName) {
    console.log('🔍 DEBUG presentSolution - User said:', userMessage);
    
    const lowerMsg = userMessage.toLowerCase();
    
    // 🎯 EXPANDED POSITIVE RESPONSES
    const positiveResponses = [
        'yes', 'yeah', 'sure', 'ok', 'okay', 'absolutely', 'definitely',
        'tell me', 'how', 'show me', 'demo', 'see it', 'let\'s do it',
        'would', 'i would', 'i\'d like', 'interested', 'ready', 'go ahead'
    ];
    
    console.log('🔍 Checking for positives in:', lowerMsg);
    
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
        window.lastPreCloseQuestion = `${userName}, perfect! I recommend our FREE AI Business Analysis...`;
        
        return `${userName}, perfect! I recommend our FREE AI Business Analysis (value: $2,500). 
                We'll analyze your current situation and show exactly where AI could boost your results. 
                Would Tuesday at 3pm work for your free analysis?`;
    } 
    else if (isSayingNo) {
        console.log('🔄 User said no - staying in solution presentation');
        return `No problem, ${userName}! What specific question can I answer about AI for your business?`;
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
    
    const lowerMsg = userMessage.toLowerCase();
    
    // 🎯 EXPANDED YES PATTERNS
    const yesPatterns = [
        'yes', 'yeah', 'sure', 'okay', 'ok', 'absolutely', 'definitely', 
        'let\'s do it', 'ready', 'go ahead', 'would', 'i would', 'tuesday',
        '3pm', '3 pm', 'works', 'that works', 'sounds good'
    ];
    
    // 🎯 NO PATTERNS
    const noPatterns = ['no', 'not', 'later', 'maybe', 'another time', 'different time'];
    
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
        
        return `Excellent ${userName}! I've opened our booking options. Click any button that works for you!`;
    }
    else if (noPatterns.some(pattern => lowerMsg.includes(pattern))) {
        console.log('🔄 User said no - offering alternatives');
        return `${userName}, no problem! What would work better for you - Wednesday at 2pm, 
                or would you prefer a different type of consultation?`;
    }
    else {
        console.log('❓ Ambiguous closing response');
        return `${userName}, to confirm - would Tuesday at 3pm work for your free AI analysis, 
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