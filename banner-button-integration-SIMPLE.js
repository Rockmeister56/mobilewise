/**
 * MOBILE-WISE AI FORMVISER
 * Banner-Button Integration Layer - UPDATED FOR COMMUNICATION RELAY CENTER
 * 
 * Preserves banner listening functionality while integrating with new Relay Center
 * Auto-triggers appropriate modes when banners appear
 * 
 * Updated: 2025-10-31 - Integrated with Communication Relay Center
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
        'urgent': 'cta',  // 🚨 ADD THIS LINE - URGENT BANNER TRIGGERS CTA BUTTONS!
        
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
     * Initialize integration with Communication Relay Center
     */
    function initializeIntegration() {
        // 🆕 CHECK FOR OUR NEW COMMUNICATION RELAY SYSTEM
        if (typeof window.initializeCommRelayButton === 'function') {
            console.log('✅ Communication Relay Center system found - integration ready');
            window.initializeCommRelayButton(); // Initialize our button system
            
            // ✅ PRESERVE BANNER LISTENING FUNCTIONALITY
            setupBannerListeners();
            
        } else {
            console.log('⏳ Communication Relay Center system not ready, retrying...');
            setTimeout(initializeIntegration, 500);
        }
    }

    /**
     * Set up banner listening (PRESERVED FROM ORIGINAL)
     */
    function setupBannerListeners() {
        // Listen for universal banner engine events
        if (typeof window.showUniversalBanner !== 'undefined') {
            // Check if the banner engine has event system
            if (typeof window.onBannerChange === 'function') {
                window.onBannerChange(handleBannerChange);
                console.log('🎯 Registered with banner engine event system');
            } else {
                // Fallback: Monitor for banner changes
                console.log('🎯 Banner engine events not available - using fallback monitoring');
                startBannerMonitoring();
            }
        }
        
        console.log('✅ Banner-Button Integration active');
        console.log(`📋 Mapped banner types: ${Object.keys(BANNER_TO_BUTTON_MAP).length}`);
        console.log('🎯 Testimonial banners will trigger reviews mode');
        console.log('🎯 CTA banners will trigger call-to-action mode');
    }

    /**
     * Handle banner change event (PRESERVED FROM ORIGINAL)
     */
    function handleBannerChange(bannerType) {
        console.log(`🎯 Banner shown: ${bannerType}`);

        // Look up button mode for this banner
        const buttonMode = BANNER_TO_BUTTON_MAP[bannerType];

        if (buttonMode) {
            console.log(`🔄 Auto-switching buttons to: ${buttonMode}`);
            
            // 🆕 ADAPTED FOR COMMUNICATION RELAY CENTER:
            // Since we only have one button now, we handle banner-specific behaviors
            handleBannerSpecificBehavior(bannerType, buttonMode);
            
        } else if (buttonMode === null) {
            console.log(`ℹ️ No mode change for banner: ${bannerType} (keeping current mode)`);
        } else {
            console.log(`ℹ️ No button mode mapped for banner: ${bannerType}`);
        }
    }

    /**
     * 🆕 NEW: Handle banner-specific behaviors for Communication Relay Center
     */
    function handleBannerSpecificBehavior(bannerType, buttonMode) {
        // For our single-button system, we can handle different banner behaviors:
        
        switch(buttonMode) {
            case 'reviews':
                console.log('🎬 Testimonial banner detected - keeping Communication Relay Center button');
                // Our single button stays as Communication Relay Center
                break;
                
            case 'cta':
                console.log('🚀 CTA banner detected - Communication Relay Center button is perfect for this!');
                // Communication Relay Center is ideal for CTAs
                break;
                
            case 'quick':
                console.log('💬 Quick questions banner - Communication Relay Center handles all inquiries');
                // Single button handles all quick questions through relay center
                break;
                
            default:
                console.log('⚡ Default banner behavior');
        }
        
        // 🎯 SPECIAL CASE: If testimonial banner, we might want special handling
        if (bannerType === 'testimonialSelector') {
            console.log('🎯 Main testimonial selector banner - ready for user selection');
        }
    }

    /**
     * Fallback banner monitoring (PRESERVED FROM ORIGINAL)
     */
    function startBannerMonitoring() {
        // Simple polling to check for banner changes
        let lastBanner = '';
        
        setInterval(() => {
            const currentBanner = getCurrentBanner();
            if (currentBanner && currentBanner !== lastBanner) {
                lastBanner = currentBanner;
                handleBannerChange(currentBanner);
            }
        }, 1000);
    }

    /**
     * Detect current banner (simplified)
     */
    function getCurrentBanner() {
        // This would need to be adapted to your actual banner detection
        const bannerElements = document.querySelectorAll('[class*="banner"], [id*="banner"]');
        for (let element of bannerElements) {
            if (element.offsetParent !== null) { // Element is visible
                const classes = element.className.toLowerCase();
                if (classes.includes('testimonial')) return 'testimonialSelector';
                if (classes.includes('cta')) return 'cta';
                if (classes.includes('branding')) return 'branding';
            }
        }
        return null;
    }

    /**
     * Manually trigger button switch (for testing or manual control)
     */
    function triggerButtonSwitch(bannerType) {
        const buttonMode = BANNER_TO_BUTTON_MAP[bannerType];
        if (buttonMode) {
            console.log(`🔄 Manual button switch for: ${bannerType} → ${buttonMode}`);
            handleBannerSpecificBehavior(bannerType, buttonMode);
        } else {
            console.warn(`Cannot switch buttons for banner type: ${bannerType}`);
        }
    }

    // Export functions globally
    window.triggerButtonSwitch = triggerButtonSwitch;
    window.handleBannerShown = handleBannerChange; // For universal banner engine

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIntegration);
    } else {
        setTimeout(initializeIntegration, 1000);
    }

    console.log('✅ Banner-Button Integration Layer loaded (Updated for Communication Relay Center)');
})();
