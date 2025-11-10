// 1. VIDEO URLS at the TOP
const TESTIMONIAL_VIDEOS = {
    skeptical: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4",
    speed: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4"
};
const isMobile = window.innerWidth <= 768;

// 2. MAIN VIDEO PLAYER FUNCTION
function play16x9TestimonialVideo(testimonialType, duration = 12000) {
    const isMobile = window.innerWidth <= 768;
    // Your video player code
}

// 3. BANNER FUNCTION (NEW - ADD THIS HERE)
function showTestimonialBanner(concernType = 'reputation') {
    console.log('🎬 Showing testimonial banner for concern:', concernType);
    
    // Wait for chat bubble to appear first
    setTimeout(() => {
        showTestimonialVideo('skeptical', 12000);
    }, 1000);
    
    console.log('✅ Testimonial banner triggered - delayed video start');
}

// 5. MAKE FUNCTIONS GLOBAL
window.showTestimonialBanner = showTestimonialBanner;

// CLOSE FUNCTION
function close16x9TestimonialVideo() {
    // [Your close code here]
}
    
    // Create overlay container
    const videoOverlay = document.createElement('div');
    videoOverlay.id = 'testimonial-video-overlay';
    
    if (isMobile) {
        // MOBILE: Full screen with top-right close button
        videoOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        videoOverlay.innerHTML = `
            <video id="testimonialVideo" autoplay playsinline webkit-playsinline="true" style="
                width: 100%;
                height: 100%;
                object-fit: contain;
            ">
                <source src="${videoUrl}" type="video/mp4">
            </video>
            <button onclick="close16x9TestimonialVideo()" style="
                position: absolute;
                top: 20px;
                right: 20px;
                width: 44px;
                height: 44px;
                background: rgba(255, 0, 0, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            ">✕</button>
        `;
    } else {
        // DESKTOP: Centered 16:9 player with 50% transparent background
        videoOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        videoOverlay.innerHTML = `
            <div style="
                position: relative;
                width: 854px;
                height: 480px;
                background: #000;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.7);
            ">
                <video id="testimonialVideo" autoplay style="
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                ">
                    <source src="${videoUrl}" type="video/mp4">
                </video>
                
                <button onclick="close16x9TestimonialVideo()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 0, 0, 0.8);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255, 0, 0, 1)'; this.style.transform='scale(1.1)'"
                   onmouseout="this.style.background='rgba(255, 0, 0, 0.8)'; this.style.transform='scale(1)'">✕</button>
            </div>
        `;
    }
    
    // Add to page
    document.body.appendChild(videoOverlay);
    
    // Enhanced cleanup function
    function enhancedCleanup() {
        console.log(`🎬 Testimonial ${testimonialType} complete`);
        
        const overlay = document.getElementById('testimonial-video-overlay');
        if (overlay && overlay.parentNode) {
            overlay.remove();
        }
        
        window.avatarCurrentlyPlaying = false;
        
        // Call completion handler
        if (typeof window.handleTestimonialComplete === 'function') {
            console.log('🎯 Calling handleTestimonialComplete callback');
            window.handleTestimonialComplete();
        }
    }
    
    // Auto-close after duration
    setTimeout(() => {
        if (document.getElementById('testimonial-video-overlay')) {
            enhancedCleanup();
        }
    }, duration);
    
    console.log('✅ 16:9 testimonial video playing');
    

// ===================================================
// CLOSE VIDEO FUNCTION
// ===================================================
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
// 🚨 NUCLEAR OVERRIDE - REPLACE ANY OLD VERSIONS
// ===================================================
console.log('🚨 testimonials-player.js: DUAL BRIDGE SYSTEM ACTIVATED');

// Make all functions globally available
window.showTestimonialVideo = showTestimonialVideo;
window.showTestimonialVideos = showTestimonialVideos;
window.play16x9TestimonialVideo = play16x9TestimonialVideo;
window.close16x9TestimonialVideo = close16x9TestimonialVideo;

console.log('✅ DUAL BRIDGE SYSTEM READY:');
console.log('   🎯 Bridge 1: showTestimonialVideo() -> for voice-chat-fusion-clean.js');
console.log('   🎯 Bridge 2: showTestimonialVideos() -> for voice-chat-fusion-instant.js');
console.log('   🎬 Main: play16x9TestimonialVideo() -> actual 16:9 player');