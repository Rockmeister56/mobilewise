/**
 * ===================================================================
 * 🎯 MOBILE-WISE AI UNIVERSAL BANNER ENGINE v4 - CAPTAIN'S TEMPLATES
 * ===================================================================
 * 
 * CORRECTLY BUILT WITH CAPTAIN'S ORIGINAL TEMPLATES
 * 
 * FIXES APPLIED:
 * - Using Captain's exact banner templates (NCI branding, etc.)
 * - Selective CSS animations (highlighter only on CTA banners)
 * - Contained highlighter (no full-screen sweep)
 * - Proper mobile sizing
 * - Branding banner protection in hideBanner()
 * - Error boundaries for missing functions
 * - RequestAnimationFrame for reliable fade-in
 * 
 * Created: 2025-10-24
 * Fixed: 2025-10-24 (with correct templates)
 */

(function() {
    'use strict';

    console.log('🚀 Loading Universal Banner Engine v4 - CAPTAIN\'S TEMPLATES EDITION...');

    // ===================================================================
    // 🎨 BANNER CONFIGURATION - CAPTAIN'S ORIGINAL TEMPLATES
    // ===================================================================
    
    const BANNER_CONFIG = {
    
    // 1. BRANDING HEADER (NCI Logo - White background with blue glow)
    branding: {
        content: `
            <div class="banner-glow-container branding-banner" style="width: 782px; max-width: 782px; margin: 0 auto; height: 77px; display: flex; justify-content: center; align-items: center; padding: 0 10px; border-radius: 10px; background: white; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);">
                <!-- CENTER: NCI Logo -->
                <div style="display: flex; align-items: center; justify-content: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1759148392591_nci.PNG" 
                         style="width: 280px; height: auto; border-radius: 8px; box-shadow: 0 0px 8px rgba(255, 255, 255, 1);">
                </div>
            </div>
        `,
        duration: 0,
        colorLeft: '#0080ff',
        colorCenter: '#0080ff',
        colorRight: '#0080ff'
    },
    
    // 2. EMAIL SENT CONFIRMATION
    emailSent: {
        content: `
            <div class="banner-glow-container" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761252751340_email-sent.png" 
                         class="book-white-glow"
                         style="width: 70px; height: 70px; border-radius: 0px; margin-right: 20px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">
                            EMAIL on its way!
                        </div>
                        <div style="font-size: 14px; opacity: 0.95;">
                            Please check your inbox or spam folder
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 4000,
        colorLeft: '#1e40af',
        colorCenter: '#3b82f6',
        colorRight: '#1e40af'
    },
    
    // 3. GENUINE CLIENT REVIEWS (Testimonials)
    testimonialSelector: {
        content: `
            <div class="banner-glow-container banner-testimonial" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
    
    <!-- LEFT: 5-STAR ICON (Stationary, no glow) -->
    <div style="flex-shrink: 0;">
        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761252676241_5starpng.png" 
             style="width: 130px; height: 95px; border-radius: 0px; margin-right: -10px;">
    </div>
    
    <!-- CENTER/RIGHT: Reviews icon + Text -->
    <div style="display: flex; align-items: center; flex-grow: 1; justify-content: center;">
        <!-- REVIEWS ICON (keeps glow) -->
        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761252832996_reviews.png" 
             class="book-white-glow"
             style="width: 70px; height: 70px; border-radius: 0px; margin-right: 80px;">
        
        <!-- TEXT -->
        <div style="color: white; text-align: left;">
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px; margin-right: 80px;">
        ">
                GENUINE client reviews
            </div>
            <div style="font-size: 14px; opacity: 0.95;">
                Click buttons below to view video reviews
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 0,
        colorLeft: '#1e3a8a',
        colorCenter: '#3b82f6',
        colorRight: '#1e40af'
    },
    
    // 4. CLICK TO CALL (CTA with highlighter)
    clickToCall: {
        content: `
            <div class="banner-glow-container banner-cta-full" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #6b21a8 0%, #7c3aed 50%, #6b21a8 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761252700290_click%20to%20call.png" 
                         class="book-white-glow"
                         style="width: 70px; height: 70px; border-radius: 0px; margin-right: 20px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">
                            CLICK to call
                        </div>
                        <div style="font-size: 14px; opacity: 0.95;">
                            Click icon to connect
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 0,
        colorLeft: '#6b21a8',
        colorCenter: '#7c3aed',
        colorRight: '#6b21a8'
    },
    
    // 5. Specializing in
    expertise: {
        content: `
            <div class="banner-glow-container banner-cta-full" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #6b21a8 0%, #7c3aed 50%, #6b21a8 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761335872173_expertise.png" 
                         class="book-white-glow"
                         style="width: 70px; height: 70px; border-radius: 0px; margin-right: 20px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">
                            <span class="free-glow">OUR EXPERTISE</span> practice buying and selling
                        </div>
                        <div style="font-size: 14px; opacity: 0.95;">
                            We've got you covered with experience
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 0,
        colorLeft: '#6b21a8',
        colorCenter: '#7c3aed',
        colorRight: '#6b21a8'
    },
    
    // 6.FREE INCENTIVE (CTA with highlighter)
    freeIncentive: {
        content: `
            <div class="banner-glow-container banner-cta-full" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #0f5ef0ff 0%, #000000ff 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758088515492_nci-book.png" 
                         class="book-white-glow"
                         style="width: 60px; height: 70px; border-radius: 0px; margin-right: 20px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">
                            📚 <span class="free-glow">FREE</span> Consultation & Book
                        </div>
                        <div style="font-size: 14px; color: #00ffb3ff; opacity: 0.95;">
                            "7 Secrets to Selling Your Practice" FREE!
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 0,
        colorLeft: '#0f5ef0ff',
        colorCenter: '#000000ff',
        colorRight: '#0f5ef0ff'
    },
    
    // 7. URGENT REQUEST (CTA with highlighter)
    urgent: {
        content: `
            <div class="banner-glow-container banner-cta-full" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #991b1b 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761254023327_urgent.png" 
                         class="book-white-glow"
                         style="width: 70px; height: 70px; border-radius: 0px; margin-right: 20px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">
                            🔴 <span class="free-glow">URGENT</span> request
                        </div>
                        <div style="font-size: 14px; color: #00ffb3ff; opacity: 0.95;">
                            Your message will be sent as URGENT!
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 0,
        colorLeft: '#991b1b',
        colorCenter: '#dc2626',
        colorRight: '#991b1b'
    },
    
    // 8. SCHEDULE APPOINTMENT (CTA with highlighter)
    setAppointment: {
        content: `
            <div class="banner-glow-container banner-cta-full" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #065f46 0%, #059669 50%, #065f46 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761253794926_calendar.png" 
                         class="book-white-glow"
                         style="width: 70px; height: 70px; border-radius: 0px; margin-right: 20px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">
                            📅 SCHEDULE appointment
                        </div>
                        <div style="font-size: 14px; opacity: 0.95;">
                            What is the best time & date for you?
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 0,
        colorLeft: '#065f46',
        colorCenter: '#059669',
        colorRight: '#065f46'
    },
    
    // 9. GET PRE-QUALIFIED (CTA with highlighter)
    preQualifier: {
        content: `
            <div class="banner-glow-container banner-cta-full" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #6b21a8 0%, #7c3aed 50%, #6b21a8 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761253934863_prequalify.png" 
                         class="book-white-glow"
                         style="width: 70px; height: 70px; border-radius: 0px; margin-right: 20px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">
                            GET- pre-qualified
                        </div>
                        <div style="font-size: 14px; opacity: 0.95;">
                            No forms! Just answer a few simple questions
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 0,
        colorLeft: '#6b21a8',
        colorCenter: '#7c3aed',
        colorRight: '#6b21a8'
    },
    
    // 10. MEETING CONFIRMED
    consultationConfirmed: {
        content: `
            <div class="banner-glow-container" style="width: 760px; max-width: 760px; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0c4a6e 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center;">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1761254101125_meeting.png" 
                         class="book-white-glow"
                         style="width: 70px; height: 70px; border-radius: 0px; margin-right: 20px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">
                            🎉 MEETING confirmed
                        </div>
                        <div style="font-size: 14px; opacity: 0.95;">
                            Your meeting request has been sent
                        </div>
                    </div>
                </div>
            </div>
        `,
        duration: 5000,
        colorLeft: '#0c4a6e',
        colorCenter: '#0284c7',
        colorRight: '#0c4a6e'
    }
};

// ===================================================================
// 🎨 CSS STYLES - 2-LAYER SYSTEM WITH GLOW LAYER
// ===================================================================

const BANNER_STYLES = `
<style>
/* ===== GLOW LAYER (::before pseudo-element) ===== */
.banner-glow-container {
    position: relative;
}

.banner-glow-container::before {
    content: '';
    position: absolute;
    width: calc(100% + 50px);
    height: calc(100% + 20px);
    top: -10px;
    left: -25px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    z-index: -1;
    animation: glowLayerPulse 2s ease-in-out infinite;
}

@keyframes glowLayerPulse {
    0%, 100% { 
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
    }
    50% { 
        box-shadow: 0 0 30px rgba(0, 217, 255, 0.8);
    }
}

/* ===== BRANDING BANNER SPECIAL GLOW (Blue) ===== */
.branding-banner::before {
    animation: brandingGlowPulse 2s ease-in-out infinite;
}

@keyframes brandingGlowPulse {
    0%, 100% { 
        box-shadow: 0 0 15px rgba(0, 128, 255, 0.6);
    }
    50% { 
        box-shadow: 0 0 30px rgba(0, 128, 255, 1);
    }
}

/* ===== CTA BANNERS - HIGHLIGHTER SWEEP (::after) ===== */
.banner-cta-full::after {
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
    animation: highlighterSweep 7s ease-in-out infinite;
    z-index: 1;
    border-radius: 8px;
    pointer-events: none;
}

@keyframes highlighterSweep {
    0%, 85% { left: -100%; opacity: 0; }     
    86% { left: -100%; opacity: 1; }         
    97% { left: 100%; opacity: 1; }
    98% { left: 100%; opacity: 0; }
    100% { left: -100%; opacity: 0; }        
}

/* ===== TESTIMONIAL BANNER - NO HIGHLIGHTER ===== */
.banner-testimonial::after {
    display: none;
}

/* ===== ICON GLOW EFFECT ===== */
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

/* ===== FREE TEXT GLOW ===== */
.free-glow {
    text-shadow: 0 0 8px rgba(255,255,255,0.8);
    animation: freeTextGlow 2.5s ease-in-out infinite;
}

@keyframes freeTextGlow {
    0%, 100% { text-shadow: 0 0 8px rgba(255,255,255,0.8); }
    50% { text-shadow: 0 0 12px rgba(255,255,255,1); }
}

/* ===== MOBILE RESPONSIVENESS ===== */
@media (max-width: 850px) {
    .banner-glow-container {
        width: 95vw !important;
        max-width: 95vw !important;
        height: auto !important;
        min-height: 70px !important;
        padding: 15px 10px !important;
    }
    
    .banner-glow-container::before {
        width: calc(100% + 30px);
        left: -15px;
    }
    
    .banner-glow-container img {
        width: 50px !important;
        height: auto !important;
    }
    
    .banner-glow-container div[style*="font-size: 20px"] {
        font-size: 16px !important;
    }
    
    .banner-glow-container div[style*="font-size: 14px"] {
        font-size: 12px !important;
    }
}
</style>
    `;

    // ===================================================================
    // 📦 CALLBACK SYSTEM
    // ===================================================================
    
    window._bannerChangeCallbacks = window._bannerChangeCallbacks || [];
    
    window.onBannerChange = function(callback) {
        if (typeof callback === 'function') {
            window._bannerChangeCallbacks.push(callback);
            console.log('✅ Banner change listener registered');
        } else {
            console.warn('⚠️ onBannerChange requires a function');
        }
    };
    
    function notifyBannerChange(bannerType) {
        console.log(`🔔 Notifying ${window._bannerChangeCallbacks.length} listener(s) about banner: ${bannerType}`);
        window._bannerChangeCallbacks.forEach(callback => {
            try {
                callback(bannerType);
            } catch (error) {
                console.error('❌ Banner callback error:', error);
            }
        });
    }

    // ===================================================================
    // 🎯 MAIN BANNER FUNCTIONS
    // ===================================================================
    
    /**
     * Hide existing banner with protection for branding banner
     */
    function hideBanner() {
        const existingBanner = document.getElementById('bannerHeaderContainer');
        
        // 🛡️ PROTECTION: Don't remove branding banner
        if (existingBanner) {
            const bannerContent = existingBanner.querySelector('.universal-banner');
            if (bannerContent && bannerContent.classList.contains('branding-banner')) {
                console.log('🛡️ Branding banner protected - not hiding');
                return;
            }
        }
        
        if (existingBanner) {
            existingBanner.style.opacity = '0';
            setTimeout(() => {
                if (existingBanner.parentNode) {
                    existingBanner.remove();
                    console.log('🧹 Previous banner removed');
                }
            }, 300);
        }
    }
    
    /**
     * Remove all banners with optional branding restoration
     */
    window.removeAllBanners = function(restoreBranding = true) {
        const allBanners = document.querySelectorAll('#bannerHeaderContainer');
        let removedCount = 0;
        
        allBanners.forEach(banner => {
            const content = banner.querySelector('.universal-banner');
            
            // Skip branding banner
            if (content && content.classList.contains('branding-banner')) {
                console.log('🛡️ Branding banner protected');
                return;
            }
            
            banner.remove();
            removedCount++;
        });
        
        console.log(`🧹 Removed ${removedCount} banner(s)`);
        
        // Restore branding if requested
        if (restoreBranding && removedCount > 0) {
            setTimeout(() => {
                if (typeof window.showUniversalBanner === 'function') {
                    window.showUniversalBanner('branding');
                }
            }, 300);
        }
    };
    
    /**
     * Main banner display function
     */
    window.showUniversalBanner = function(bannerType, options = {}) {
        console.log(`🎯 Deploying Banner: ${bannerType}`);
        
        // Validate banner type
        if (!BANNER_CONFIG[bannerType]) {
            console.error(`❌ Unknown banner type: ${bannerType}`);
            return null;
        }
        
        const config = BANNER_CONFIG[bannerType];
        
        // Hide existing banner (with protection)
        hideBanner();
        
        // Create outer container
        const headerContainer = document.createElement('div');
        headerContainer.id = 'bannerHeaderContainer';
        headerContainer.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 95%;
            max-width: 800px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        
        // Create inner banner
        const banner = document.createElement('div');
        banner.id = 'universal-banner';
        banner.className = 'universal-banner';
        if (config.cssClass) {
            banner.classList.add(config.cssClass);
        }
        
        banner.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${config.background};
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        // Inject content and styles
        banner.innerHTML = BANNER_STYLES + config.content;
        headerContainer.appendChild(banner);
        
        // Find container and attach
        const mainContainer = document.querySelector('.container') || 
                             document.querySelector('#voice-chat-container') || 
                             document.querySelector('.voice-chat-wrapper') || 
                             document.body;
        
        if (!mainContainer) {
            console.error('❌ No container found to attach banner');
            return null;
        }
        
        mainContainer.insertBefore(headerContainer, mainContainer.firstChild);
        
        // Fade in using requestAnimationFrame for reliability
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                headerContainer.style.opacity = '1';
                console.log('🎨 Banner faded in to opacity: 1');
            });
        });
        
        // Auto-hide if duration specified
        if (config.duration && config.duration > 0) {
            setTimeout(() => {
                hideBanner();
            }, config.duration);
        }
        
        console.log(`✅ Banner "${bannerType}" deployed`);
        
        // Notify listeners
        notifyBannerChange(bannerType);
        
        return headerContainer;
    };

    // ===================================================================
    // ✅ SYSTEM READY
    // ===================================================================
    
    console.log('✅ Universal Banner Engine v4 - CAPTAIN\'S TEMPLATES EDITION loaded');
    console.log('📊 Available banners:', Object.keys(BANNER_CONFIG).length);
    console.log('   - Branding (NCI logo - minimal glow)');
    console.log('   - Email Sent (confirmation)');
    console.log('   - Testimonial Selector (genuine reviews)');
    console.log('   - Click To Call (CTA with highlighter)');
    console.log('   - Free Book With Consultation (CTA with highlighter)');
    console.log('   - Urgent (CTA with highlighter)');
    console.log('   - Set Appointment (CTA with highlighter)');
    console.log('   - Pre-Qualifier (CTA with highlighter)');
    console.log('   - Consultation Confirmed (minimal)');

})();

// ===================================================================
// 🏆 AUTO-DEPLOY BRANDING BANNER ON PAGE LOAD
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🏆 Auto-deploying NCI branding banner...');
        if (typeof window.showUniversalBanner === 'function') {
            window.showUniversalBanner('branding');
        } else {
            console.error('❌ showUniversalBanner not available for auto-deploy');
        }
    }, 500);
});

// BACKUP: If DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        console.log('🏆 Backup NCI branding banner deployment...');
        if (typeof window.showUniversalBanner === 'function') {
            window.showUniversalBanner('branding');
        }
    }, 100);
}
