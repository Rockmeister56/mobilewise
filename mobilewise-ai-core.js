// =============================================================================
// 🧠 MOBILEWISE AI CORE - PHASE 1
// =============================================================================
// 🎯 Need-Focused | Name-Personalized | Always Building Rapport
// =============================================================================

console.log('🧠 MOBILEWISE AI CORE LOADING - Phase 1');

// =============================================================================
// 🎯 GLOBAL AI STATE
// =============================================================================
window.mobilewiseAI = window.mobilewiseAI || {
    // 🏁 CONVERSATION STATE
    state: 'introduction',
    
    // 👤 USER PROFILE
    user: {
        name: '',
        need: '',
        urgency: 'medium',
        businessType: '',
        challenge: ''
    },
    
    // 📊 CONVERSATION TRACKING
    conversation: {
        messages: 0,
        startedAt: Date.now(),
        rapportLevel: 0 // 0-100
    }
};

// =============================================================================
// 🎯 MAIN AI PROCESSING FUNCTION
// =============================================================================
async function getAIResponse(userMessage, conversationHistory = []) {
    console.log('🧠 AI Processing:', userMessage.substring(0, 30) + '...');
    
    // 📈 Track conversation
    window.mobilewiseAI.conversation.messages++;
    
    const mw = window.mobilewiseAI;
    const lowerMsg = userMessage.toLowerCase();
    const userName = mw.user.name || '';
    
    console.log(`🧠 State: ${mw.state}, User: ${userName || 'No name yet'}`);
    
    // =========================================================================
    // 🎯 PHASE 1: INTRODUCTION & NAME CAPTURE
    // =========================================================================
    if (mw.state === 'introduction') {
        return handleIntroduction(userMessage);
    }
    
    // =========================================================================
    // 🎯 PHASE 2: RAPPORT BUILDING & NEED DISCOVERY
    // =========================================================================
    if (mw.state === 'rapport_building') {
        return handleRapportBuilding(userMessage, userName);
    }
    
    // =========================================================================
    // 🎯 PHASE 3: SOLUTION PRESENTATION (Future)
    // =========================================================================
    if (mw.state === 'solution_presentation') {
        return handleSolutionPresentation(userMessage, userName);
    }
    
    // Fallback (should never reach here)
    return `Thanks for sharing that${userName ? ', ' + userName : ''}! I'd love to help you explore AI solutions. What's on your mind?`;
}

// =============================================================================
// 👋 PHASE 1: INTRODUCTION - CAPTURE NAME
// =============================================================================
function handleIntroduction(userMessage) {
    console.log('👋 Handling introduction phase');
    
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
    console.log(`✅ State changed: introduction → rapport_building`);
    console.log(`✅ Rapport level: 10/100`);
    
    // 🎉 Trigger welcome effect if available
    if (!window.welcomeSplashShown && window.showWelcomeSplash) {
        console.log('🎉 Triggering welcome splash');
        setTimeout(() => {
            window.showWelcomeSplash(formattedName);
        }, 100);
    }
    
    // 🎯 PERSONALIZED WELCOME MESSAGE
    return `Nice to meet you ${formattedName}! I'm Sophia, your AI assistant from MobileWise AI. 
            We build AI that actually closes deals and grows businesses. 
            What's the #1 challenge you're facing in your business right now?`;
}

// =============================================================================
// 🤝 PHASE 2: RAPPORT BUILDING - DISCOVER NEEDS
// =============================================================================
function handleRapportBuilding(userMessage, userName) {
    console.log('🤝 Building rapport with', userName);
    
    const lowerMsg = userMessage.toLowerCase();
    
    // 📈 Increase rapport with each interaction
    window.mobilewiseAI.conversation.rapportLevel = Math.min(
        window.mobilewiseAI.conversation.rapportLevel + 5,
        100
    );
    
    console.log(`📈 Rapport increased to: ${window.mobilewiseAI.conversation.rapportLevel}/100`);
    
    // 🎯 DETECT SPECIFIC NEEDS (Not industries!)
    const needs = detectBusinessNeed(lowerMsg);
    
    if (needs.length > 0) {
        // 🎯 CAPTURE THEIR PRIMARY NEED
        window.mobilewiseAI.user.need = needs[0];
        window.mobilewiseAI.state = 'solution_presentation';
        
        console.log(`✅ Need identified: ${needs[0]}`);
        console.log(`✅ State changed: rapport_building → solution_presentation`);
        
        return generateNeedResponse(userName, needs[0], userMessage);
    }
    
    // 🎯 NO SPECIFIC NEED DETECTED - CONTINUE RAPPORT BUILDING
    return continueRapportBuilding(userName, userMessage);
}

// =============================================================================
// 🛠️ UTILITY FUNCTIONS
// =============================================================================

/**
 * 📛 EXTRACT NAME FROM MESSAGE
 */
function extractName(message) {
    const words = message.trim().split(' ');
    
    if (words.length === 0) return '';
    
    // Take first word as name
    const potentialName = words[0];
    
    // Basic validation: at least 2 chars, not a common word
    const commonWords = ['hi', 'hello', 'hey', 'ok', 'yes', 'no', 'maybe'];
    if (potentialName.length < 2 || commonWords.includes(potentialName.toLowerCase())) {
        return '';
    }
    
    return potentialName;
}

/**
 * 🎨 FORMAT NAME NICELY
 */
function formatName(name) {
    if (!name || name.length === 0) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * 🔍 DETECT BUSINESS NEEDS (Not industries!)
 */
function detectBusinessNeed(message) {
    const needs = [];
    
    // 🎯 LEAD GENERATION NEEDS
    if (message.includes('lead') || message.includes('customer') || message.includes('client')) {
        needs.push('more_leads');
    }
    
    // 🎯 CONVERSION NEEDS
    if (message.includes('convert') || message.includes('sale') || message.includes('close')) {
        needs.push('better_conversions');
    }
    
    // 🎯 TIME NEEDS
    if (message.includes('time') || message.includes('busy') || message.includes('overwhelm')) {
        needs.push('save_time');
    }
    
    // 🎯 COST NEEDS
    if (message.includes('cost') || message.includes('money') || message.includes('expensive')) {
        needs.push('reduce_costs');
    }
    
    // 🎯 SERVICE NEEDS
    if (message.includes('service') || message.includes('support') || message.includes('answer')) {
        needs.push('better_service');
    }
    
    // 🎯 GROWTH NEEDS
    if (message.includes('grow') || message.includes('scale') || message.includes('expand')) {
        needs.push('business_growth');
    }
    
    return needs;
}

/**
 * 💬 GENERATE NEED-SPECIFIC RESPONSE
 */
function generateNeedResponse(userName, need, originalMessage) {
    const responses = {
        'more_leads': `${userName}, getting more quality leads is EXACTLY what our AI excels at! 
                      We increase lead capture by 40-60% for businesses just like yours. 
                      Tell me more about your current lead generation efforts.`,
        
        'better_conversions': `${userName}, conversion leaks are profit killers! 
                              Our AI guides website visitors to become customers - increasing 
                              conversions by 23%+ on average. What's your current conversion rate like?`,
        
        'save_time': `${userName}, time is your most valuable asset! Our AI automates repetitive 
                      tasks, saving businesses 15+ hours weekly. What task takes most of your time?`,
        
        'reduce_costs': `${userName}, controlling costs is smart business! Our AI reduces 
                        customer support costs by 30% while improving service. What's your 
                        biggest expense right now?`,
        
        'better_service': `${userName}, customer service should build loyalty, not eat your time! 
                          Our AI handles 70%+ of inquiries instantly, 24/7. How many support 
                          requests do you get daily?`,
        
        'business_growth': `${userName}, scaling your business is exciting! Our AI grows with you - 
                           handling unlimited inquiries simultaneously. What's your growth goal 
                           for this year?`
    };
    
    return responses[need] || `${userName}, thanks for sharing that! I'd love to show you how 
                              AI could help. What specific results are you looking for?`;
}

/**
 * 🤝 CONTINUE RAPPORT BUILDING
 */
function continueRapportBuilding(userName, userMessage) {
    const rapportResponses = [
        `${userName}, thanks for sharing that. Tell me more about your business goals.`,
        `I appreciate you opening up about that, ${userName}. What would solving that 
         challenge mean for your business?`,
        `${userName}, that's really helpful context. What's your ideal outcome here?`
    ];
    
    return rapportResponses[Math.floor(Math.random() * rapportResponses.length)];
}

// =============================================================================
// 🎯 FUTURE PHASES (Placeholders for now)
// =============================================================================
function handleSolutionPresentation(userMessage, userName) {
    return `${userName}, based on what you've shared, I think our AI could really help! 
            Brett Duncan (our founder with 25 years experience) has helped similar businesses. 
            Would you like to see a quick demo?`;
}

console.log('✅ AI CORE LOADED - Phase 1 Complete');
console.log('🎯 States: introduction → rapport_building → solution_presentation');
console.log('👤 Will capture name and build need-focused rapport');