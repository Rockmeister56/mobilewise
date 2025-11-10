// ===================================================
// 🎬 MOBILE-WISE AI TESTIMONIALS PLAYER
// Video testimonial player with controls and resume logic
// Banner display with play buttons for individual reviews
// ===================================================
const TESTIMONIAL_VIDEOS = {
    skeptical: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4",
    speed: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4"
};

// 2. MAIN VIDEO PLAYER FUNCTION
function play16x9TestimonialVideo(testimonialType, duration = 12000) {
    console.log(`🎬 Playing ${testimonialType} testimonial - 16:9 format`);
    
    // 🚫 PREVENT DOUBLE CALLS
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Video already playing - skipping duplicate');
        return;
    }
    
    window.avatarCurrentlyPlaying = true;
    
   // 🆕 DEFINE isMobile
const isMobile = window.innerWidth <= 768;
const videoUrl = TESTIMONIAL_VIDEOS[testimonialType] || TESTIMONIAL_VIDEOS.skeptical;

console.log('🎯 Using 16:9 video format (854x480)');

// Create overlay container
const avatarOverlay = document.createElement('div');
avatarOverlay.id = 'testimonial-overlay';

// Create review items with premium play buttons
const reviewItems = concernData.reviews.map((review, index) => `
    <div style="
        padding: 10px 0;
        ${index > 0 ? 'border-top: 1px solid rgba(255, 255, 255, 0.2);' : ''}
    ">
        <p style="
            color: rgba(255, 255, 255, 0.9);
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 12px 0;
            font-style: italic;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        ">"${review.text}"</p>
        
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <p style="
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                margin: 0;
                font-weight: 500;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            ">— ${review.author}</p>
            
            <button onclick="playTestimonialFromBanner('${review.videoType}')" style="
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(0, 0, 0, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 10px 16px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                min-width: 100px;
            " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
               onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                <span style="font-size: 16px;">▶</span>
                <span>Play Video</span>
            </button>
        </div>
    </div>
`).join('');

// Create premium banner HTML
const bannerHTML = `
    <div id="testimonial-review-banner" style="
        background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                    url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1762038349654_action-bg.jpg');
        background-size: cover;
        background-position: center;
        background-blend-mode: overlay;
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 15px 20px;
        margin: 20px 0;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        color: white;
        font-family: 'Segoe UI', system-ui, sans-serif;
        max-width: 750px;
        animation: slideInBanner 0.5s ease-out;
        position: relative;
        z-index: 998;
    ">
        <!-- Header with Icon -->
        <div style="
            display: flex;
            align-items: center;
           margin-bottom: 15px;
            gap: 15px;
        ">
            <div style="
                width: 50px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <span style="font-size: 24px;">${concernData.icon}</span>
            </div>
            <div>
                <h3 style="
                    margin: 0 0 5px 0;
                    font-size: 22px;
                    font-weight: 600;
                    color: white;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                ">${concernData.title}</h3>
                <p style="
                    margin: 0;
                    opacity: 0.8;
                    font-size: 13px;
                    font-weight: 300;
                    letter-spacing: 0.5px;
                ">Client Video Testimonials</p>
            </div>
        </div>
        
        <!-- Review Items with Play Buttons -->
        <div style="margin-bottom: 25px;">
            ${reviewItems}
        </div>
        
        <!-- Skip Button - Premium Style -->
        <button onclick="skipTestimonialBanner()" style="
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(0, 0, 0, 0.6);
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 15px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            width: 100%;
            justify-content: center;
            backdrop-filter: blur(10px);
        " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.color='white';" 
           onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.color='rgba(255, 255, 255, 0.8)';">
            <span style="font-size: 16px;">⏭️</span>
            <span>Skip Reviews & Continue</span>
        </button>
    </div>
    
    <style>
        @keyframes slideInBanner {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
`;

// Insert banner into chat
const chatContainer = document.getElementById('chatMessages');
if (chatContainer) {
    const bannerElement = document.createElement('div');
    bannerElement.innerHTML = bannerHTML;
    chatContainer.appendChild(bannerElement);
    
    // Scroll to show the banner
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    console.log('✅ Premium testimonial banner displayed');
} else {
    console.error('❌ Chat container not found');
    window.testimonialBannerActive = false;
}

// 🆕 ADD MISSING BRIDGE FUNCTION
function playTestimonialFromBanner(videoType) {
    console.log(`🎬 Playing testimonial from banner: ${videoType}`);
    if (typeof window.play16x9TestimonialVideo === 'function') {
        window.play16x9TestimonialVideo(videoType);
        
        // Remove the banner when playing a video
        const banner = document.getElementById('testimonial-review-banner');
        if (banner && banner.parentNode) {
            banner.remove();
            window.testimonialBannerActive = false;
        }
    } else {
        console.error('❌ play16x9TestimonialVideo function not found');
    }
}

// 🆕 ENSURE REQUIRED VARIABLES EXIST
if (typeof window.TESTIMONIAL_VIDEOS === 'undefined') {
    window.TESTIMONIAL_VIDEOS = {
        skeptical: '/videos/skeptical.mp4',
        // ... other video types
    };
}

if (typeof window.testimonialBannerActive === 'undefined') {
    window.testimonialBannerActive = true;
}
}

// ===================================================
// PLAY TESTIMONIAL VIDEO FROM BANNER
// ===================================================
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
            
            // DON'T resume here - video will handle it
        }, 300);
    }
    
    // Small delay before showing video
    setTimeout(() => {
        showTestimonialVideo(videoType);
    }, 400);
};

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

// Add slideOut animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideOutBanner {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-30px); }
    }
`;
document.head.appendChild(styleSheet);

// 3. BANNER FUNCTION
function showTestimonialBanner(concernType = 'reputation') {
    console.log('🎬 Showing testimonial banner for concern:', concernType);
    
    // Wait for chat bubble to appear first
    setTimeout(() => {
        play16x9TestimonialVideo('skeptical', 12000);
    }, 1000);
    
    console.log('✅ Testimonial banner triggered - delayed video start');
}

// 4. CLOSE VIDEO FUNCTION
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

// ===================================================
// CLOSE TESTIMONIAL BANNER (Skip Reviews)
// ===================================================
function closeTestimonialBanner() {
    console.log('🗑️ Closing testimonial banner');
    
    // Remove banner from DOM
    const banner = document.getElementById('testimonial-review-banner');
    if (banner) {
        banner.remove();
        console.log('✅ Banner removed from DOM');
    }
    
    // 🔓 CLEAR BLOCKING FLAG
    window.concernBannerActive = false;
    console.log('✅ FLAG CLEARED: concernBannerActive = false');
    
    // Resume normal conversation flow
    resumeAfterTestimonial();
}

// ===================================================
// RESUME AI CONVERSATION AFTER VIDEO
// ===================================================
function resumeAfterTestimonial() {
    console.log('💬 Resuming conversation after testimonial');
    
    const resumeMessage = window.testimonialData.playerConfig.resumeMessage;
    
    // Add AI message
    if (typeof addAIMessage === 'function') {
        addAIMessage(resumeMessage);
    }
    
    // Speak the message
    setTimeout(() => {
        if (typeof speakResponse === 'function') {
            speakResponse(resumeMessage);
        } else if (typeof speakText === 'function') {
            speakText(resumeMessage);
        }
        
        // After speaking, start listening for YES/NO
        setTimeout(() => {
            if (typeof startListening === 'function' && window.isAudioMode) {
                startListening();
            }
            
            // Set conversation state to capture consultation response
            window.conversationState = 'asking_consultation_after_testimonial';
            console.log('🎯 Waiting for consultation response (YES/NO)');
        }, 2000);
    }, 800);
}

// ===================================================
// 🎯 MAKE FUNCTIONS GLOBALLY AVAILABLE
// ===================================================
window.showTestimonialBanner = showTestimonialBanner;
window.play16x9TestimonialVideo = play16x9TestimonialVideo;
window.close16x9TestimonialVideo = close16x9TestimonialVideo;
window.closeTestimonialBanner = closeTestimonialBanner;
window.resumeAfterTestimonial = resumeAfterTestimonial;

console.log('✅ Testimonials Player Loaded - Ready for concerns!');