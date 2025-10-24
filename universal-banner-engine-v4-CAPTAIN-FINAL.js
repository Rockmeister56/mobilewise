/**
 * ===================================================================
 * 🎯 MOBILE-WISE AI UNIVERSAL BANNER ENGINE v4 - CAPTAIN'S FINAL EDITION
 * ===================================================================
 * 
 * FIXED VERSION - 2025-10-24
 * 
 * FIXES APPLIED:
 * - Selective CSS animations (highlighter only on CTA banners)
 * - Contained highlighter (no full-screen sweep)
 * - Proper mobile sizing
 * - Branding banner protection in hideBanner()
 * - Error boundaries for missing functions
 * 
 * ALL 9 BANNERS WITH SELECTIVE EFFECTS:
 * - Branding: Minimal (no highlighter)
 * - CTAs: Full effects (highlighter + glows)
 * - Confirmations: Minimal (no highlighter)
 * - Testimonials: Glow only (no highlighter)
 * 
 * DROP-IN REPLACEMENT - Uses same function name: window.showUniversalBanner()
 * 
 * Created: 2025-10-24
 */

(function() {
    'use strict';

    console.log('🚀 Loading Universal Banner Engine v4 - CAPTAIN\'S FINAL EDITION (FIXED)...');

    // ===================================================================
    // 🎨 BANNER CONFIGURATION - ALL 9 BANNERS
    // ===================================================================
    
    const BANNER_CONFIG = {
        
        // ===== BRANDING BANNER (Minimal - No Highlighter) =====
        branding: {
            content: `
                <div class="banner-minimal" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_c6cafaa3-7088-4eb5-ba42-f4e8c7e9d8de_1729789913945_new-clients-inc-ai-logo.png" 
                         style="height: 60px; margin-right: 15px;">
                    <div style="color: white; font-size: 24px; font-weight: bold;">
                        Mobile-Wise AI
                    </div>
                </div>
            `,
            background: 'rgba(30, 58, 138, 0.15)',
            containerWidth: 795,
            customHeight: 90,
            duration: 0,
            cssClass: 'branding-banner'
        },
        
        // ===== AVATAR BANNER (Glow Only - No Highlighter) =====
        avatar: {
            content: `
                <div class="banner-testimonial" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: white; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                        🤖
                    </div>
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 20px; font-weight: bold;">Boateamia</div>
                        <div style="font-size: 14px; opacity: 0.9;">Your AI Assistant</div>
                    </div>
                </div>
            `,
            background: 'rgba(5, 150, 105, 0.15)',
            containerWidth: 795,
            customHeight: 90,
            duration: 0
        },
        
        // ===== EMAIL SENT CONFIRMATION (Minimal - No Highlighter) =====
        emailSent: {
            content: `
                <div class="banner-minimal" style="width: 740px; max-width: 95%; margin: 0 auto; height: 55px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #0d9488, #14b8a6); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size: 24px; margin-right: 10px;">✅</span>
                    <div style="color: white; font-size: 18px; font-weight: bold;">
                        Email Sent Successfully!
                    </div>
                </div>
            `,
            background: 'rgba(13, 148, 136, 0.15)',
            containerWidth: 752,
            customHeight: 65,
            duration: 4000
        },
        
        // ===== FREE BOOK SIMPLE CTA (Full Effects with Highlighter) =====
        freeBookSimple: {
            content: `
                <div class="banner-cta-full" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #dc2626, #0d9488); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758088515492_nci-book.png" 
                         class="book-white-glow"
                         style="width: 60px; height: 70px; border-radius: 0px; margin-right: 15px;">
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                            📚 <span class="free-glow">FREE</span> Book Offer
                        </div>
                        <div style="font-size: 13px; color: #00ffb3ff; opacity: 0.95;">
                            "7 Secrets to Selling Your Practice"
                        </div>
                    </div>
                </div>
            `,
            background: 'rgba(220, 38, 38, 0.15)',
            containerWidth: 752,
            customHeight: 65,
            duration: 0
        },
        
        // ===== FREE BOOK WITH CONSULTATION CTA (Full Effects with Highlighter) =====
        freeBookWithConsultation: {
            content: `
                <div class="banner-cta-full" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #0f5ef0ff, #000000ff); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <div style="display: flex; align-items: center;">
                        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1758088515492_nci-book.png" 
                             class="book-white-glow"
                             style="width: 60px; height: 70px; border-radius: 0px; margin-right: 15px;">
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
            `,
            background: 'rgba(15, 94, 240, 0.15)',
            containerWidth: 770,
            customHeight: 90,
            duration: 0
        },
        
        // ===== CONSULTATION CONFIRMED (Minimal - No Highlighter) =====
        consultationConfirmed: {
            content: `
                <div class="banner-minimal" style="width: 740px; max-width: 95%; margin: 0 auto; height: 55px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #2563eb, #3b82f6); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size: 24px; margin-right: 10px;">🎉</span>
                    <div style="color: white; font-size: 18px; font-weight: bold;">
                        Consultation Booked Successfully!
                    </div>
                </div>
            `,
            background: 'rgba(37, 99, 235, 0.15)',
            containerWidth: 752,
            customHeight: 65,
            duration: 5000
        },
        
        // ===== CLICK TO CALL CTA (Full Effects with Highlighter) =====
        clickToCall: {
            content: `
                <div class="banner-cta-full" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #1e40af, #1e3a8a); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size: 32px; margin-right: 15px;">📞</span>
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                            Talk to Bruce Now
                        </div>
                        <div style="font-size: 13px; opacity: 0.9;">
                            Click to schedule your free consultation
                        </div>
                    </div>
                </div>
            `,
            background: 'rgba(30, 64, 175, 0.15)',
            containerWidth: 752,
            customHeight: 65,
            duration: 0
        },
        
        // ===== MORE QUESTIONS CTA (Full Effects with Highlighter) =====
        moreQuestions: {
            content: `
                <div class="banner-cta-full" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #7c3aed, #6d28d9); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size: 32px; margin-right: 15px;">💬</span>
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                            Have More Questions?
                        </div>
                        <div style="font-size: 13px; opacity: 0.9;">
                            I'm here to help - just ask!
                        </div>
                    </div>
                </div>
            `,
            background: 'rgba(124, 58, 237, 0.15)',
            containerWidth: 752,
            customHeight: 65,
            duration: 0
        },
        
        // ===== PRE-QUALIFIER CTA (Full Effects with Highlighter) =====
        preQualifier: {
            content: `
                <div class="banner-cta-full" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size: 32px; margin-right: 15px;">📋</span>
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                            Let's Get Started
                        </div>
                        <div style="font-size: 13px; opacity: 0.9;">
                            Tell me about your practice
                        </div>
                    </div>
                </div>
            `,
            background: 'rgba(5, 150, 105, 0.15)',
            containerWidth: 752,
            customHeight: 65,
            duration: 0
        },
        
        // ===== SET APPOINTMENT CTA (Full Effects with Highlighter) =====
        setAppointment: {
            content: `
                <div class="banner-cta-full" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size: 32px; margin-right: 15px;">📅</span>
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                            Schedule Your Consultation
                        </div>
                        <div style="font-size: 13px; opacity: 0.9;">
                            Pick a time that works for you
                        </div>
                    </div>
                </div>
            `,
            background: 'rgba(5, 150, 105, 0.15)',
            containerWidth: 752,
            customHeight: 65,
            duration: 0
        },
        
        // ===== REQUEST CALLBACK CTA (Full Effects with Highlighter) =====
        requestCallback: {
            content: `
                <div class="banner-cta-full" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #7c3aed, #6d28d9); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size: 32px; margin-right: 15px;">☎️</span>
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                            Request a Callback
                        </div>
                        <div style="font-size: 13px; opacity: 0.9;">
                            We'll reach out within 24 hours
                        </div>
                    </div>
                </div>
            `,
            background: 'rgba(124, 58, 237, 0.15)',
            duration: 0
        },
        
        // ===== TESTIMONIAL SELECTOR (Glow Only - No Highlighter) =====
        testimonialSelector: {
            content: `
                <div class="banner-testimonial" style="width: 760px; max-width: 95%; margin: 0 auto; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 20px; border-radius: 8px; background: linear-gradient(135deg, #a855f7, #9333ea); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size: 32px; margin-right: 15px;">⭐</span>
                    <div style="color: white; text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 3px;">
                            Client Success Stories
                        </div>
                        <div style="font-size: 13px; opacity: 0.9;">
                            See what our clients are saying
                        </div>
                    </div>
                </div>
            `,
            background: 'rgba(168, 85, 247, 0.15)',
            duration: 0
        }
    };

    // ===================================================================
    // 🎨 CSS ANIMATIONS - SELECTIVE EFFECTS
    // ===================================================================
    
    const BANNER_STYLES = `
        <style>
        /* ===== SHARED BASE STYLES ===== */
        .banner-minimal,
        .banner-cta-full,
        .banner-testimonial {
            position: relative;
            overflow: hidden;
        }
        
        /* ===== MINIMAL BANNER (Branding, Confirmations) ===== */
        .banner-minimal {
            animation: minimalGlow 3s ease-in-out infinite;
        }
        
        @keyframes minimalGlow {
            0%, 100% { 
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            50% { 
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
        }
        
        /* ===== CTA BANNER (Full Effects Including Highlighter) ===== */
        .banner-cta-full {
            animation: ctaPulseGlow 2s ease-in-out infinite;
        }
        
        /* Glow Layer (::before) */
        .banner-cta-full::before {
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
            pointer-events: none;
        }
        
        /* Highlighter Sweep (::after) - ONLY ON CTA BANNERS */
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
        
        @keyframes glowLayerPulse {
            0%, 100% { 
                box-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
            }
            50% { 
                box-shadow: 0 0 30px rgba(0, 217, 255, 0.8);
            }
        }
        
        @keyframes ctaPulseGlow {
            0%, 100% { 
                box-shadow: 0 10px 10px rgba(0,0,7,0.0), 0 0 10px rgba(0, 255, 0, 1);
            }
            50% { 
                box-shadow: 0 20px 10px rgba(0,0,9,0.0), 0 0 25px rgba(0, 217, 255, 1);
            }
        }
        
        /* Book Glow Effect */
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
        
        /* FREE Text Glow */
        .free-glow {
            text-shadow: 0 0 8px rgba(255,255,255,0.8);
            animation: freeTextGlow 2.5s ease-in-out infinite;
        }
        
        @keyframes freeTextGlow {
            0%, 100% { text-shadow: 0 0 8px rgba(255,255,255,0.8); }
            50% { text-shadow: 0 0 12px rgba(255,255,255,1); }
        }
        
        /* ===== TESTIMONIAL BANNER (Glow Only, No Highlighter) ===== */
        .banner-testimonial {
            animation: testimonialGlow 2s ease-in-out infinite;
        }
        
        @keyframes testimonialGlow {
            0%, 100% { 
                box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
            }
            50% { 
                box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
            }
        }
        
        /* ===== MOBILE RESPONSIVENESS ===== */
        @media (max-width: 850px) {
            .banner-minimal,
            .banner-cta-full,
            .banner-testimonial {
                width: 95vw !important;
                max-width: 95vw !important;
                font-size: 0.9rem !important;
                padding: 15px 10px !important;
                height: auto !important;
                min-height: 70px !important;
            }
            
            .banner-minimal img,
            .banner-cta-full img,
            .banner-testimonial img {
                width: 50px !important;
                height: auto !important;
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
        
        // Fade in
        setTimeout(() => {
            headerContainer.style.opacity = '1';
        }, 50);
        
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
    
    /**
     * Trigger banner (alias for showUniversalBanner)
     */
    window.triggerBanner = function(bannerType, options) {
        return window.showUniversalBanner(bannerType, options);
    };

    // ===================================================================
    // 🎨 INJECT GLOBAL BANNER ANIMATION STYLES
    // ===================================================================
    
    console.log('✅ Banner animation styles loaded');

    // ===================================================================
    // ✅ SYSTEM READY
    // ===================================================================
    
    console.log('✅ Universal Banner Engine v4 - CAPTAIN\'S FINAL EDITION (FIXED) loaded');
    console.log('📊 Available banners:', Object.keys(BANNER_CONFIG).length);
    console.log('   - Branding (minimal)');
    console.log('   - Avatar (testimonial glow)');
    console.log('   - Email Sent (minimal)');
    console.log('   - Free Book Simple (CTA full)');
    console.log('   - Free Book With Consultation (CTA full)');
    console.log('   - Consultation Confirmed (minimal)');
    console.log('   - Click To Call (CTA full)');
    console.log('   - More Questions (CTA full)');
    console.log('   - Pre-Qualifier (CTA full)');
    console.log('   - Set Appointment (CTA full)');
    console.log('   - Request Callback (CTA full)');
    console.log('   - Testimonial Selector (testimonial glow)');

})();
