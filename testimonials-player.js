// ===================================================
// 🎬 COMPLETE TESTIMONIAL SYSTEM (SPLASH + VIDEO PLAYERS)
// ===================================================

// Video URLs - UPDATE THESE WITH YOUR ACTUAL VIDEO LINKS
const TESTIMONIAL_VIDEOS = {
    skeptical: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4',
    speed: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4',
    convinced: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1763530566773.mp4',
    excited: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1763531028258.mp4'
};

// Video durations in milliseconds
const VIDEO_DURATIONS = {
    skeptical: 22000,
    speed: 18000, 
    convinced: 25000,
    excited: 20000
};

window.avatarCurrentlyPlaying = false;

// ================================
// 🎬 DYNAMIC SPLASH SCREEN - FIXED VERSION
// ================================
function showTestimonialSplashScreen() {
    console.log('🎬 TESTIMONIAL SPLASH: Loading complete system');

    // 🛡️ SET PROTECTION FLAG - BLOCK SPEAK NOW
    window.testimonialSessionActive = true;
    console.log('🛡️ Testimonial protection activated - Speak Now blocked');
    
    // Stop any current listening first
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    const splashScreen = document.createElement('div');
    splashScreen.id = 'testimonial-splash-screen';
    splashScreen.style.animation = 'fadeInSplash 0.5s ease-in';
    
    // Check if we have testimonialData
    if (!window.testimonialData || !window.testimonialData.groups) {
        console.error('❌ testimonialData not found! Using fallback buttons.');
        createFallbackSplashScreen(splashScreen);
    } else {
        createDynamicSplashScreen(splashScreen);
    }
    
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        splashScreen.style.marginTop = '20px';
        splashScreen.style.marginBottom = '20px';
        chatContainer.appendChild(splashScreen);
        splashScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// CREATE DYNAMIC BUTTONS FROM TESTIMONIAL DATA
function createDynamicSplashScreen(splashScreen) {
    console.log('🔄 Creating dynamic buttons from testimonialData');
    
    const groups = window.testimonialData.groups;
    console.log('📊 Available groups:', Object.keys(groups));
    
    // Create buttons HTML dynamically
    let buttonsHTML = '';
    let buttonCount = 0;
    
    // Get all testimonials across all groups
    const allTestimonials = [];
    
    Object.keys(groups).forEach(groupKey => {
        const group = groups[groupKey];
        console.log(`📦 Group: ${groupKey}`, group.name, 'has', group.testimonials.length, 'testimonials');
        
        group.testimonials.forEach((testimonial, index) => {
            if (buttonCount < 4) { // Show max 4 buttons
                const buttonId = `${groupKey}_${index}`;
                const buttonName = testimonial.name || group.name;
                const buttonEmoji = testimonial.emoji || getEmojiForGroup(groupKey);
                const videoKey = getVideoKeyForTestimonial(groupKey, index);
                
                buttonsHTML += `
                    <button onclick="handleTestimonialButton('${videoKey}')" style="
                        display: flex; align-items: center; gap: 12px;
                        background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
                        color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
                        font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
                        backdrop-filter: blur(10px); width: 100%; height: 84px;
                    " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                    onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                        <div style="font-size: 28px;">${buttonEmoji}</div>
                        <span style="flex: 1;">${buttonName}</span>
                    </button>
                `;
                
                // Store mapping for video playback
                if (!window.testimonialVideoMap) window.testimonialVideoMap = {};
                window.testimonialVideoMap[videoKey] = {
                    group: groupKey,
                    index: index,
                    testimonial: testimonial
                };
                
                buttonCount++;
            }
        });
    });
    
    // If no buttons were created, use fallback
    if (buttonCount === 0) {
        console.log('⚠️ No testimonials found, using fallback');
        createFallbackSplashScreen(splashScreen);
        return;
    }
    
    // Determine grid layout (2x2 or 1x4)
    const gridColumns = buttonCount <= 2 ? '1fr' : '1fr 1fr';
    
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
    ">
    
    <!-- HEADER -->
    <div style="display: flex; align-items: center; margin-bottom: 5px; gap: 15px; margin-top: 5px;">
        <video autoplay loop muted playsinline style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
            <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1764614255102.mp4" type="video/mp4">
        </video>
        <div>
            <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600; color: white;">Client Testimonials</h3>
            <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300; letter-spacing: 0.5px;">Real stories from satisfied clients</p>
        </div>
    </div>

    <!-- DYNAMIC TESTIMONIAL BUTTONS GRID -->
    <div style="display: grid; grid-template-columns: ${gridColumns}; gap: 12px; margin-bottom: 15px;">
        ${buttonsHTML}
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
    
    console.log(`✅ Created ${buttonCount} dynamic testimonial buttons`);
}

// FALLBACK FOR WHEN TESTIMONIAL DATA ISN'T AVAILABLE
function createFallbackSplashScreen(splashScreen) {
    console.log('🔄 Creating fallback buttons');
    
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
    ">
    
    <!-- HEADER -->
    <div style="display: flex; align-items: center; margin-bottom: 5px; gap: 15px; margin-top: 5px;">
        <video autoplay loop muted playsinline style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
            <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1764614255102.mp4" type="video/mp4">
        </video>
        <div>
            <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600; color: white;">Client Testimonials</h3>
            <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300; letter-spacing: 0.5px;">Real stories from satisfied clients</p>
        </div>
    </div>

    <!-- FALLBACK TESTIMONIAL BUTTONS -->
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

        <!-- Convinced Client -->
        <button onclick="handleTestimonialButton('convinced')" style="
            display: flex; align-items: center; gap: 12px;
            background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
            color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
            font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
            backdrop-filter: blur(10px); width: 100%; height: 84px;
        " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
        onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
            <div style="font-size: 28px;">😊</div>
            <span style="flex: 1;">Convinced Client</span>
        </button>

        <!-- Excited Results -->
        <button onclick="handleTestimonialButton('excited')" style="
            display: flex; align-items: center; gap: 12px;
            background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
            color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
            font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
            backdrop-filter: blur(10px); width: 100%; height: 84px;
        " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
        onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
            <div style="font-size: 28px;">🎉</div>
            <span style="flex: 1;">Excited Results</span>
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
}

// HELPER FUNCTIONS
function getEmojiForGroup(groupKey) {
    const emojiMap = {
        price: '💰',
        quality: '⭐',
        trust: '🤝',
        results: '📈',
        process: '⚙️',
        time: '⏰',
        skeptic: '🤔',
        default: '🎬'
    };
    return emojiMap[groupKey] || emojiMap.default;
}

function getVideoKeyForTestimonial(groupKey, index) {
    // Map testimonial to available videos
    const videoMap = {
        'price_0': 'skeptical',
        'price_1': 'speed',
        'quality_0': 'convinced',
        'quality_1': 'excited',
        'trust_0': 'skeptical',
        'trust_1': 'convinced',
        'results_0': 'speed',
        'results_1': 'excited'
    };
    
    const key = `${groupKey}_${index}`;
    return videoMap[key] || 'skeptical'; // Default to skeptical video
}

// ================================
// 🎬 CONTINUE WITH THE REST OF YOUR FILE...
// ================================
// [KEEP ALL YOUR EXISTING FUNCTIONS BELOW - closeTestimonialVideo, showTestimonialSpinner, etc.]
// ================================

// [I'll continue with the rest of your file, keeping all existing functionality]

function closeTestimonialVideo() {
    console.log('🎬 Closing testimonial video - showing navigation options');

    // 🛑 CRITICAL: Reset playing flags
    window.avatarCurrentlyPlaying = false;
    if (window.testimonialVideoActive !== undefined) {
        window.testimonialVideoActive = false;
    }
    
    // 🛡️ KEEP PROTECTION ACTIVE
    window.testimonialSessionActive = true;
    window.testimonialProtectionActive = true;
    
    // 🎯 SIMPLY REMOVE THE VIDEO PLAYER - NO NEW CREATION!
    const videoPlayer = document.getElementById('testimonial-video-player');
    if (videoPlayer) {
        // Stop any playing video first
        const video = videoPlayer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        // Remove the player
        videoPlayer.remove();
        console.log('✅ Video player removed');
    }
    
    // 🎯 SHOW NAVIGATION OPTIONS
    showTestimonialNavigationOptions();
    console.log('✅ Navigation options shown');
}

// [CONTINUE WITH THE REST OF YOUR ORIGINAL FILE...]
// ================================

// REMOVE THE DUPLICATE FUNCTION AT THE BOTTOM
// Comment out or remove this duplicate function:
// function emergencyStopAllSpeech() { ... } // This appears twice

// KEEP YOUR ORIGINAL GLOBAL EXPORTS BUT ADD NEW FUNCTIONS:

// ================================
// GLOBAL EXPORTS - TESTIMONIAL SYSTEM
// ================================

// 1. CORE TESTIMONIAL FUNCTIONS (ADD THE NEW ONES)
window.handleTestimonialButton = handleTestimonialButton;
window.showTestimonialSplashScreen = showTestimonialSplashScreen;
window.playTestimonialVideo = playTestimonialVideo; 
window.handleTestimonialSkip = handleTestimonialSkip;
window.hideTestimonialSplash = hideTestimonialSplash;
window.showTestimonialSpinner = showTestimonialSpinner;
window.hideTestimonialSpinner = hideTestimonialSpinner;
window.showTestimonialNavigationOptions = showTestimonialNavigationOptions;

// ADD THE NEW DYNAMIC FUNCTIONS
window.createDynamicSplashScreen = createDynamicSplashScreen;
window.createFallbackSplashScreen = createFallbackSplashScreen;
window.getEmojiForGroup = getEmojiForGroup;
window.getVideoKeyForTestimonial = getVideoKeyForTestimonial;

// 2. CLOSING/NAVIGATION FUNCTIONS
window.closeTestimonialVideo = closeTestimonialVideo;
window.closeTestimonialNav = closeTestimonialNav;
window.returnToVoiceChat = returnToVoiceChat;

// 3. STATE FLAGS
window.avatarCurrentlyPlaying = false;
window.consultationOfferActive = false;

// ✅ INITIALIZE
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTestimonialSystem);
} else {
    initializeTestimonialSystem();
}

console.log('✅ DYNAMIC Testimonials Player Loaded - Ready for concerns!');