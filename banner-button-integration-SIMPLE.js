/**
 * MOBILE-WISE AI FORMVISER
 * Banner-Button Integration Layer - UPDATED WITH CONCERN DETECTION
 * 
 * Auto-switches action buttons when banners appear
 * Hooks into banner engine's onBannerChange event
 * 
 * Updated: 2025-10-25 - Added testimonialSelector and freeIncentive mappings
 */

(function() {
    'use strict';

    // Mapping: Banner Type → Button Mode
    const BANNER_TO_BUTTON_MAP = {
        // Branding banner → Quick Questions
        'branding': 'quick',
        
        // CTA banners → Call-to-Action buttons
        'appointment': 'cta',
        'freeIncentive': 'cta',  // 🎯 NEW: Free consultation offer
        'smartButton': 'cta',
        'leadMagnet': 'cta',
        'thankYou': 'cta',
        'clickToCall': 'cta',
        'setAppointment': 'cta',
        'requestCallback': 'cta',
        'expertise': 'quick', 
        
        // Testimonial banners → Review buttons
        'testimonialSelector': 'reviews',  // 🎯 NEW: Main testimonial banner
        'testimonial1': 'reviews',
        'testimonial2': 'reviews',
        'testimonial3': 'reviews',
        
        // Practice-specific banners → Quick Questions
        'sellingPractice': 'quick',
        'buyingPractice': 'quick',
        'valuationHelp': 'quick',
        
        // Email confirmations → No change (keep current mode)
        'emailSent': null,
        'consultationConfirmed': null
    };

    /**
     * Initialize integration
     */
    function initializeIntegration() {
        // Wait for banner engine to be ready
        if (typeof window.onBannerChange !== 'function') {
            console.warn('⏳ Banner engine not ready, retrying...');
            setTimeout(initializeIntegration, 500);
            return;
        }

        // Wait for button system to be ready
        if (typeof window.switchActionButtonMode !== 'function') {
            console.warn('⏳ Button system not ready, retrying...');
            setTimeout(initializeIntegration, 500);
            return;
        }

        // Register banner change listener
        window.onBannerChange(handleBannerChange);

        console.log('✅ Banner-Button Integration active');
        console.log(`📋 Mapped banner types: ${Object.keys(BANNER_TO_BUTTON_MAP).length}`);
        console.log('🎯 Testimonial banners will trigger reviews mode');
        console.log('🎯 CTA banners will trigger call-to-action mode');
    }

    /**
     * Handle banner change event
     */
    function handleBannerChange(bannerType) {
        console.log(`🎯 Banner shown: ${bannerType}`);

        // Look up button mode for this banner
        const buttonMode = BANNER_TO_BUTTON_MAP[bannerType];

        if (buttonMode) {
            console.log(`🔄 Auto-switching buttons to: ${buttonMode}`);
            window.switchActionButtonMode(buttonMode);
        } else if (buttonMode === null) {
            console.log(`ℹ️ No mode change for banner: ${bannerType} (keeping current mode)`);
        } else {
            console.log(`ℹ️ No button mode mapped for banner: ${bannerType}`);
        }
    }

    /**
     * Manually trigger button switch (for testing or manual control)
     */
    function triggerButtonSwitch(bannerType) {
        const buttonMode = BANNER_TO_BUTTON_MAP[bannerType];
        if (buttonMode && typeof window.switchActionButtonMode === 'function') {
            window.switchActionButtonMode(buttonMode);
        } else {
            console.warn(`Cannot switch buttons for banner type: ${bannerType}`);
        }
    }

    // Export manual trigger function
    window.triggerButtonSwitch = triggerButtonSwitch;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIntegration);
    } else {
        initializeIntegration();
    }

    console.log('✅ Banner-Button Integration Layer loaded (Updated with Concern Detection)');
})();
