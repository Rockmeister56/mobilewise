// =============================================================================
// ⚡ MOBILEWISE TRIGGERS - PHASE 1 (Minimal)
// =============================================================================
// 🎯 Basic trigger system for Phase 1 testing
// =============================================================================

console.log('⚡ MOBILEWISE TRIGGERS LOADING - Phase 1');

// =============================================================================
// 🎯 BASIC TRIGGER DETECTION
// =============================================================================

/**
 * 🚨 DETECT URGENT REQUESTS
 */
function detectUrgentRequest(message) {
    const lowerMsg = message.toLowerCase();
    const urgentWords = ['urgent', 'emergency', 'asap', 'right now', 'immediately', '911'];
    return urgentWords.some(word => lowerMsg.includes(word));
}

/**
 * 💰 DETECT PRICE CONCERNS
 */
function detectPriceConcern(message) {
    const lowerMsg = message.toLowerCase();
    const priceWords = ['expensive', 'cost', 'price', 'money', 'afford', 'budget'];
    return priceWords.some(word => lowerMsg.includes(word));
}

// =============================================================================
// 🎯 ACTION CENTER INTEGRATION
// =============================================================================

/**
 * 🎯 TRIGGER ACTION CENTER (Minimal version)
 */
function triggerMobileWiseActionCenter(intentType = 'general') {
    console.log(`🎯 Triggering Action Center for: ${intentType}`);
    
    if (window.triggerLeadActionCenter) {
        window.triggerLeadActionCenter();
        console.log('✅ Action Center triggered');
        return true;
    }
    
    console.error('❌ triggerLeadActionCenter not found');
    return false;
}

// =============================================================================
// 🎯 BANNER INTEGRATION (Placeholder)
// =============================================================================

/**
 * 🎪 SHOW RELEVANT BANNER
 */
function showRelevantBanner(triggerType) {
    console.log(`🎪 Would show banner for: ${triggerType}`);
    
    // Use your existing banner system if available
    if (window.showUniversalBanner) {
        const bannerMap = {
            'urgent': 'urgent',
            'demo': 'setAppointment',
            'concern': 'testimonialSelector'
        };
        
        const bannerType = bannerMap[triggerType] || 'expertise';
        window.showUniversalBanner(bannerType);
        return true;
    }
    
    return false;
}

console.log('✅ TRIGGERS LOADED - Basic functionality ready');