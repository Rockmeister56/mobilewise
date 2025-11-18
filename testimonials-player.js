// ===================================================
// 🎬 MOBILE-WISE AI TESTIMONIALS PLAYER
// Video testimonial player with controls and resume logic
// Banner display with play buttons for individual reviews
// ===================================================

// 1. TESTIMONIAL VIDEO DATA
const TESTIMONIAL_VIDEOS = {
    skeptical: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4",
    speed: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4"
};

// ================================
// 🎬 ENHANCED TESTIMONIAL SPLASH SCREEN WITH BETTER TIMING
// ================================
function showTestimonialSplashScreen() {
    console.log('🎬 TESTIMONIAL SPLASH: Loading from TESTIMONIALS-PLAYER.js');
    console.log('🎬 Deploying testimonial splash screen...');
    
    // Stop any current listening first
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    const splashScreen = document.createElement('div');
    splashScreen.id = 'testimonial-splash-screen';
    splashScreen.style.animation = 'fadeInSplash 0.5s ease-in';
    
    splashScreen.innerHTML = `
        <div style="
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                        url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1762038349654_action-bg.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px 25px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: white;
            font-family: 'Segoe UI', system-ui, sans-serif;
            max-width: 750px;
            animation: slideInFromBottom 0.5s ease-out;
        ">
            <!-- Header with Video Avatar -->
            <div style="display: flex; align-items: center; margin-bottom: 25px; gap: 15px;">
                <video autoplay loop muted playsinline style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.2);">
                    <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1762037335280.mp4" type="video/mp4">
                </video>
                <div>
                    <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600;">Client Testimonials</h3>
                    <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300;">Real stories from satisfied clients</p>
                </div>
            </div>

            <!-- Testimonial Buttons Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                <!-- Skeptical Client -->
                <button onclick="handleTestimonialButton('skeptical')" style="
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
                    font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
                    backdrop-filter: blur(10px); width: 100%; height: 84px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px;">🤔</div>
                    <span style="flex: 1;">Skeptical Client</span>
                </button>

                <!-- Speed Results -->
                <button onclick="handleTestimonialButton('speed')" style="
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
                    font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
                    backdrop-filter: blur(10px); width: 100%; height: 84px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px;">⚡</div>
                    <span style="flex: 1;">Speed Results</span>
                </button>
            </div>

            <!-- Skip Button -->
            <button onclick="handleTestimonialSkip()" style="
                display: flex; align-items: center; gap: 10px;
                background: rgba(0, 0, 0, 0.6); color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.2); padding: 15px 20px;
                border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 500;
                transition: all 0.3s ease; width: 100%; justify-content: center; margin-top: 5px;
            " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.color='white';" 
               onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.color='rgba(255, 255, 255, 0.8)';">
                <span>⏭️ Skip Testimonials</span>
            </button>
        </div>
    `;
    
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(splashScreen);
        splashScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ================================
// 🎬 NEW: HANDLE TESTIMONIAL SKIP
// ================================
function handleTestimonialSkip() {
    console.log('🎬 User skipped testimonials');
    hideTestimonialSplash();
    
    // Wait for splash to hide, then restart conversation
    setTimeout(() => {
        restartConversation();
    }, 400);
}

// ================================
// 🎬 UPDATED HIDE TESTIMONIAL SPLASH
// ================================
function hideTestimonialSplash() {
    const splash = document.getElementById('testimonial-splash-screen');
    if (splash) {
        splash.style.animation = 'slideOutToBottom 0.3s ease-in';
        setTimeout(() => {
            if (splash.parentNode) {
                splash.remove();
                console.log('✅ Testimonial splash screen removed');
            }
        }, 300);
    }
}

// Add these CSS animations if not already present
function addTestimonialAnimations() {
    if (!document.getElementById('testimonial-animations')) {
        const style = document.createElement('style');
        style.id = 'testimonial-animations';
        style.textContent = `
            @keyframes fadeInSplash {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInFromBottom {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOutToBottom {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(30px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}


    // Handle video end
    const video = document.getElementById('testimonial-video');
    video.addEventListener('ended', function() {
        console.log('✅ Video ended naturally');
        close16x9TestimonialVideo();
        
        // Resume conversation after video ends
        if (typeof window.handleTestimonialComplete === 'function') {
            window.handleTestimonialComplete();
        }
    });

    // Handle video errors
    video.addEventListener('error', function() {
        console.error('❌ Video loading error');
        close16x9TestimonialVideo();
    });

// 6. PLAY FROM BANNER FUNCTION
window.playTestimonialFromBanner = function(videoType) {
    console.log(`🎬 Playing video from banner: ${videoType}`);
    
    // Close banner WITHOUT resuming conversation
    const banner = document.getElementById('testimonial-review-banner');
    if (banner) {
        banner.style.animation = 'slideOutBanner 0.3s ease-out';
        
        setTimeout(() => {
            banner.remove();
            window.testimonialBannerActive = false;
            console.log('✅ Banner removed (video will play)');
            
            // Show video after banner removal
            setTimeout(() => {
                showTestimonialVideo(videoType);
            }, 300);
        }, 300);
    }
};

// 7. SKIP BANNER FUNCTION
window.skipTestimonialBanner = function() {
    console.log('⏭️ Skipping testimonial banner');
    
    const banner = document.getElementById('testimonial-review-banner');
    if (banner) {
        banner.style.animation = 'slideOutBanner 0.3s ease-out';
        
        setTimeout(() => {
            banner.remove();
            window.testimonialBannerActive = false;
            console.log('✅ Banner removed');
            
            // 🔓 CLEAR BLOCKING FLAG
            window.concernBannerActive = false;
            console.log('✅ FLAG CLEARED: concernBannerActive = false');
            
            // 🔄 RESUME CONVERSATION
            resumeAfterTestimonial();
        }, 300);
    }
};

// 8. CLOSE VIDEO FUNCTION
function close16x9TestimonialVideo() {
    console.log('🎬 Closing 16:9 testimonial video manually');
    
    const overlay = document.getElementById('testimonial-video-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    window.avatarCurrentlyPlaying = false;
    
    // Call completion handler for manual close too
    if (typeof window.handleTestimonialComplete === 'function') {
        console.log('🎯 Calling handleTestimonialComplete for manual close');
        window.handleTestimonialComplete();
    }
}

// In testimonials-player.js - UPDATE THIS FUNCTION:
function resumeAfterTestimonial() {
    console.log('💬 Resuming conversation after testimonial');
    
    // 🎯 USE THE CONCERN-SPECIFIC RESUME MESSAGE
    const concernType = window.detectedConcernType || 'general';
    const resumeMessage = getResumeMessageForConcern(concernType);
    
    // Add AI message
    if (typeof addAIMessage === 'function') {
        addAIMessage(resumeMessage);
    }
    
    // Speak the message
    setTimeout(() => {
        if (typeof speakResponse === 'function') {
            speakResponse(resumeMessage);
        }
        
        // After speaking, start listening for YES/NO
        setTimeout(() => {
            if (typeof startListening === 'function' && window.isAudioMode) {
                startListening();
            }
            
            window.conversationState = 'asking_consultation_after_testimonial';
            console.log('🎯 Waiting for consultation response (YES/NO)');
        }, 2000);
    }, 800);
}

// 10. BANNER TRIGGER FUNCTION
function showTestimonialBanner(concernType = 'reputation') {
    console.log('🎬 Showing testimonial banner for concern:', concernType);
    
    // Use the main function to display banner with videos
    play16x9TestimonialVideo('skeptical', 12000);
    
    console.log('✅ Testimonial banner triggered');
}

// 11. INITIALIZATION
function initTestimonialPlayer() {
    // Ensure required global variables exist
    if (typeof window.TESTIMONIAL_VIDEOS === 'undefined') {
        window.TESTIMONIAL_VIDEOS = TESTIMONIAL_VIDEOS;
    }
    
    if (typeof window.testimonialBannerActive === 'undefined') {
        window.testimonialBannerActive = false;
    }
    
    if (typeof window.avatarCurrentlyPlaying === 'undefined') {
        window.avatarCurrentlyPlaying = false;
    }
    
    if (typeof window.concernBannerActive === 'undefined') {
        window.concernBannerActive = false;
    }
    
    // Add CSS animations
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideOutBanner {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-30px); }
        }
        @keyframes slideInBanner {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    console.log('✅ Testimonials Player Initialized');
}

// ================================
// GLOBAL EXPORTS - TESTIMONIAL SYSTEM
// ================================
window.handleTestimonialButton = handleTestimonialButton;
window.showTestimonialSplashScreen = showTestimonialSplashScreen;
window.handleTestimonialSkip = handleTestimonialSkip;
window.hideTestimonialSplash = hideTestimonialSplash;

// Initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialPlayer);
} else {
    initTestimonialPlayer();
}

console.log('✅ Testimonials Player Loaded - Ready for concerns!');