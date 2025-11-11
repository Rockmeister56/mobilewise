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

// ===================================================
// 🎯 PROPER BRIDGE FOR VOICE CHAT INTEGRATION
// ===================================================

// Bridge function that works with direct voice chat calls
function handleVoiceChatTestimonialCall(testimonialType, duration = 12000) {
    console.log('🎯 BRIDGE: Voice chat calling testimonial:', testimonialType);
    
    // Create mock concern data for direct calls
    const mockConcernData = {
        type: testimonialType,
        title: 'Client Testimonials',
        icon: '🎬',
        reviews: [
            {
                text: "This product completely changed my business!",
                author: "Sarah Johnson", 
                videoType: testimonialType
            },
            {
                text: "I was skeptical at first but now I'm a believer!",
                author: "Mike Chen",
                videoType: testimonialType
            }
        ]
    };
    
    // Set the concern data so the video player works
    window.concernData = mockConcernData;
    
    // Call the appropriate function based on what we want
    if (testimonialType === 'banner' || testimonialType === 'reviews') {
        // Show banner with reviews
        showTestimonialBanner();
    } else {
        // Show video directly
        showTestimonialVideo(testimonialType);
    }
}

// Make it globally available
window.handleVoiceChatTestimonialCall = handleVoiceChatTestimonialCall;

// 2. MAIN VIDEO PLAYER FUNCTION
function play16x9TestimonialVideo(testimonialType, duration = 12000) {
    console.log(`🎬 Playing ${testimonialType} testimonial - 16:9 format`);
    
    // 🚫 PREVENT DOUBLE CALLS
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Video already playing - skipping duplicate');
        return;
    }
    
    window.avatarCurrentlyPlaying = true;
    
    // Use concernData from the concern handler (set by handleConcernWithTestimonial)
    if (!window.concernData) {
        console.error('❌ concernData not found - make sure concern handler is working');
        window.avatarCurrentlyPlaying = false;
        return;
    }
    
    const isMobile = window.innerWidth <= 768;
    const videoUrl = TESTIMONIAL_VIDEOS[testimonialType] || TESTIMONIAL_VIDEOS.skeptical;

    console.log('🎯 Using 16:9 video format (854x480)');
    
    // Create and display the banner with actual concern data
    createTestimonialBanner(window.concernData);
}

// 3. CREATE TESTIMONIAL BANNER WITH REVIEWS
function createTestimonialBanner(concernData) {
    console.log('🎨 Creating testimonial banner with reviews from concernData');
    
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

    // Create premium banner HTML with your Supabase background
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
        
        // Set banner as active
        window.testimonialBannerActive = true;
        window.concernBannerActive = true;
        
        console.log('✅ Premium testimonial banner displayed');
    } else {
        console.error('❌ Chat container not found');
        window.testimonialBannerActive = false;
    }
}

// 5. SHOW TESTIMONIAL VIDEO PLAYER - FIXED VERSION
function showTestimonialVideo(testimonialType) {
    console.log('🎬 Playing testimonial video:', testimonialType);
    
    const videoUrl = TESTIMONIAL_VIDEOS[testimonialType] || TESTIMONIAL_VIDEOS.skeptical;
    
    // 🚫 PREVENT DOUBLE CALLS
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Video already playing - skipping duplicate');
        return;
    }
    window.avatarCurrentlyPlaying = true;
    
    // Remove any existing overlay
    const existingOverlay = document.getElementById('testimonial-video-overlay');
    if (existingOverlay) existingOverlay.remove();
    
    // Create video overlay with proper transparent background
    const videoOverlay = document.createElement('div');
    videoOverlay.id = 'testimonial-video-overlay';
    videoOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85); /* More transparent */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Segoe UI', system-ui, sans-serif;
        backdrop-filter: blur(5px); /* Added blur effect */
    `;

    // Video container with proper styling
    videoOverlay.innerHTML = `
        <div style="width: 90%; max-width: 854px; position: relative;">
            <!-- Close Button - Top Right -->
            <button onclick="close16x9TestimonialVideo()" style="
                position: absolute;
                top: -50px;
                right: 0;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                border-radius: 8px;
                padding: 10px 16px;
                cursor: pointer;
                font-size: 14px;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                z-index: 10001;
            " onmouseover="this.style.background='rgba(255,255,255,0.2)';" 
               onmouseout="this.style.background='rgba(255,255,255,0.1)';">
                ✕ Close
            </button>
            
            <!-- Video Player -->
            <video id="testimonial-video" controls autoplay style="
                width: 100%; 
                border-radius: 12px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            ">
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;

    document.body.appendChild(videoOverlay);
    console.log('✅ Fixed video overlay created');

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
}

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

// ===================================================
// 🎯 MAKE FUNCTIONS GLOBALLY AVAILABLE
// ===================================================
window.showTestimonialBanner = showTestimonialBanner;
window.play16x9TestimonialVideo = play16x9TestimonialVideo;
window.close16x9TestimonialVideo = close16x9TestimonialVideo;
window.playTestimonialFromBanner = window.playTestimonialFromBanner;
window.skipTestimonialBanner = window.skipTestimonialBanner;
window.resumeAfterTestimonial = resumeAfterTestimonial;
window.createTestimonialBanner = createTestimonialBanner;

// Initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialPlayer);
} else {
    initTestimonialPlayer();
}

console.log('✅ Testimonials Player Loaded - Ready for concerns!');