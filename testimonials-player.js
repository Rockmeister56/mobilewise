// ===================================================
// 🎬 MOBILE-WISE AI TESTIMONIALS PLAYER
// Video testimonial player with controls and resume logic
// Banner display with play buttons for individual reviews
// ===================================================

// ===================================================
// SHOW TESTIMONIAL BANNER WITH PLAY BUTTONS
// ===================================================
function showTestimonialBanner(concernType) {
    console.log(`🎬 Showing testimonial banner for: ${concernType}`);
    
    // Prevent double banners
    if (window.testimonialBannerActive) {
        console.log('🚫 Banner already showing - skipping duplicate');
        return;
    }
    
    window.testimonialBannerActive = true;
    
    // Get testimonial data for this concern type
    const concernData = window.testimonialData.concerns[concernType];
    if (!concernData) {
        console.error('❌ Concern type not found:', concernType);
        window.testimonialBannerActive = false;
        return;
    }
    
    // Remove any existing banner
    const existingBanner = document.getElementById('testimonial-review-banner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    // Create review items with play buttons
    const reviewItems = concernData.reviews.map((review, index) => `
        <div style="
            padding: 15px 0;
            ${index > 0 ? 'border-top: 1px solid rgba(255, 255, 255, 0.2);' : ''}
        ">
            <p style="
                color: #333;
                font-size: 15px;
                line-height: 1.6;
                margin: 0 0 10px 0;
                font-style: italic;
            ">"${review.text}"</p>
            
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <p style="
                    color: #666;
                    font-size: 14px;
                    margin: 0;
                    font-weight: 500;
                ">— ${review.author}</p>
                
                <button onclick="playTestimonialFromBanner('${review.videoType}')" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.5)'"
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(102, 126, 234, 0.3)'">
                    <span style="font-size: 16px;">▶</span>
                    <span>Play</span>
                </button>
            </div>
        </div>
    `).join('');
    
    // Create banner HTML
const bannerHTML = `
    <div id="testimonial-review-banner" style="
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 24px;
        margin: 20px auto;
        max-width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: slideInBanner 0.5s ease-out;
        position: relative;
        z-index: 998;
    ">
        <!-- Header -->
        <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.4);
        ">
            <span style="font-size: 32px;">${concernData.icon}</span>
            <h3 style="
                color: #ffffff;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                margin: 0;
                font-size: 20px;
                font-weight: 600;
            ">${concernData.title}</h3>
        </div>
            
            <!-- Review Items with Play Buttons -->
            <div style="margin-bottom: 20px;">
                ${reviewItems}
            </div>
            
            <!-- Skip Button -->
            <button onclick="skipTestimonialBanner()" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(102, 126, 234, 0.5)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)'">
                Skip Reviews →
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
        
        console.log('✅ Testimonial banner displayed');
    } else {
        console.error('❌ Chat container not found');
        window.testimonialBannerActive = false;
    }
}

// ===================================================
// PLAY TESTIMONIAL VIDEO FROM BANNER
// ===================================================
window.playTestimonialFromBanner = function(videoType) {
    console.log(`🎬 Playing video from banner: ${videoType}`);
    
    // Close banner first
    skipTestimonialBanner();
    
    // Small delay before showing video
    setTimeout(() => {
        showTestimonialVideo(videoType);
    }, 300);
};

// ===================================================
// SKIP TESTIMONIAL BANNER
// ===================================================
window.skipTestimonialBanner = function() {
    console.log('⏭️ Skipping testimonial banner');
    
    const banner = document.getElementById('testimonial-review-banner');
    if (banner) {
        banner.style.animation = 'slideOutBanner 0.3s ease-out';
        
        setTimeout(() => {
            banner.remove();
            window.testimonialBannerActive = false;
            console.log('✅ Banner removed');
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

// ===================================================
// PLAY VIDEO TESTIMONIAL
// ===================================================
function showTestimonialVideo(testimonialType, duration = null) {
    console.log(`🎬 Playing ${testimonialType} testimonial`);
    
    // Prevent double calls
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Video already playing - skipping duplicate call');
        return;
    }
    
    window.avatarCurrentlyPlaying = true;
    
    // Get video data
    const videoData = window.testimonialData.videos[testimonialType];
    if (!videoData) {
        console.error('❌ Video type not found:', testimonialType);
        window.avatarCurrentlyPlaying = false;
        return;
    }
    
    const videoUrl = videoData.url;
    const videoDuration = duration || videoData.duration;
    const isMobile = window.innerWidth <= 768;
    const config = window.testimonialData.playerConfig;
    
    // Create overlay container
    const avatarOverlay = document.createElement('div');
    avatarOverlay.id = 'testimonial-overlay';
    
    if (isMobile) {
        // Mobile: Full screen
        avatarOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${config.overlay.background};
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        `;
        
        avatarOverlay.innerHTML = `
            <video id="testimonialVideo" autoplay playsinline webkit-playsinline="true" style="
                width: 100%;
                height: 100%;
                object-fit: contain;
            ">
                <source src="${videoUrl}" type="video/mp4">
            </video>
            
            <button onclick="closeTestimonialVideo()" style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 30px;
                background: white;
                color: #333;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
            ">Close & Continue</button>
        `;
    } else {
        // Desktop: Centered floating player with CSS variables
        avatarOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${config.overlay.background};
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        avatarOverlay.innerHTML = `
            <div style="
                position: relative;
                width: ${config.desktop.width}px;
                height: ${config.desktop.height}px;
                top: var(--video-top, ${config.desktop.top});
                left: var(--video-left, ${config.desktop.left});
                transform: translate(-50%, -50%);
                background: #000;
                border-radius: ${config.desktop.borderRadius};
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            ">
                <video id="testimonialVideo" autoplay style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                ">
                    <source src="${videoUrl}" type="video/mp4">
                </video>
                
                <button onclick="closeTestimonialVideo()" style="
                    position: absolute;
                    bottom: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 12px 24px;
                    background: white;
                    color: #333;
                    border: none;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                    z-index: 10001;
                " onmouseover="this.style.transform='translateX(-50%) translateY(-2px)'"
                   onmouseout="this.style.transform='translateX(-50%) translateY(0)'">
                    Close & Continue
                </button>
            </div>
        `;
    }
    
    // Add to page
    document.body.appendChild(avatarOverlay);
    
    // Auto-close after duration
    setTimeout(() => {
        if (document.getElementById('testimonial-overlay')) {
            closeTestimonialVideo();
        }
    }, videoDuration);
    
    console.log('✅ Video testimonial playing');
}

// ===================================================
// CLOSE VIDEO AND RESUME CONVERSATION
// ===================================================
function closeTestimonialVideo() {
    console.log('🎬 Closing testimonial video');
    
    // Remove overlay
    const overlay = document.getElementById('testimonial-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Reset playing flag
    window.avatarCurrentlyPlaying = false;
    
    // Resume AI conversation
    setTimeout(() => {
        resumeAfterTestimonial();
    }, 500);
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

console.log('✅ Testimonials Player Loaded');