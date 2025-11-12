// ================================
// BANNER-BUTTON INTEGRATION SIMPLE
// Updated for Communication Relay Center
// ================================

console.log('✅ Banner-Button Integration Layer loaded (Updated with Concern Detection)');

// Banner to button mode mapping
const BANNER_TO_BUTTON_MODE = {
    // Quick mode banners
    'branding': 'quick',
    'emailSent': 'quick', 
    'expertise': 'quick',
    'setAppointment': 'quick',
    
    // Reviews mode banners  
    'testimonialSelector': 'reviews',
    'testimonialSplash': 'reviews',
    
    // CTA mode banners (disabled - handled by Communication Action Center)
    'clickToCall': 'quick', // Fallback to quick
    'freeBook': 'quick',    // Fallback to quick  
    'urgent': 'quick',      // Fallback to quick
    'preQualifier': 'quick' // Fallback to quick
};

// Initialize integration
function initializeIntegration() {
    // 🆕 CHECK FOR OUR NEW COMMUNICATION RELAY SYSTEM
    if (typeof window.initializeCommRelayButton === 'function') {
        console.log('✅ Communication Relay Center system found - integration ready');
        window.initializeCommRelayButton(); // Initialize our button system
    } else {
        console.log('⏳ Communication Relay Center system not ready, retrying...');
        setTimeout(initializeIntegration, 500);
    }
}

// Handle banner shown events
function handleBannerShown(bannerType) {
    console.log('🎯 Banner shown:', bannerType);
    
    const targetMode = BANNER_TO_BUTTON_MODE[bannerType];
    
    if (targetMode) {
        console.log('🔄 Auto-switching buttons to:', targetMode);
        
        // For our new system, we only have one button mode
        // But we can handle different behaviors if needed
        if (targetMode === 'reviews') {
            console.log('🎬 Testimonial banner - keeping Communication Relay Center button');
            // Keep the relay center button as-is for testimonials
        } else {
            console.log('🚀 Quick/CTA banner - ensuring Communication Relay Center button is visible');
            // Ensure our relay center button is properly displayed
        }
    } else {
        console.log('⚡ No button mode mapping for:', bannerType);
    }
}

// Handle banner hidden events  
function handleBannerHidden(bannerType) {
    console.log('🎯 Banner hidden:', bannerType);
    // With single button system, no need to change modes on hide
}

// Listen for banner events
function setupBannerListeners() {
    // Listen for universal banner engine events
    if (typeof window.showUniversalBanner !== 'undefined') {
        // Override or listen to banner events if needed
        console.log('🎯 Banner-Button Integration active');
        console.log('📋 Mapped banner types: ' + Object.keys(BANNER_TO_BUTTON_MODE).length);
        console.log('🎯 Testimonial banners will trigger reviews mode');
        console.log('🎯 CTA banners will trigger call-to-action mode');
    }
}

// Initialize
setupBannerListeners();

// Start integration check
setTimeout(initializeIntegration, 1000);

// Export functions for universal banner engine
window.handleBannerShown = handleBannerShown;
window.handleBannerHidden = handleBannerHidden;

console.log('✅ Banner-Button Integration Layer loaded (Updated for Communication Relay Center)');
