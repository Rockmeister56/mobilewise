// ===================================================
// 🎬 COMPLETE TESTIMONIAL SYSTEM (SPLASH + VIDEO PLAYERS)
// ===================================================

window.avatarCurrentlyPlaying = false;

// FALLBACK VIDEO URLs (in case your data has empty URLs)
const FALLBACK_VIDEO_URLS = {
    skeptical: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4',
    speed: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4',
    convinced: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1763530566773.mp4',
    excited: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1763531028258.mp4'
};

// ================================
// 🎬 DYNAMIC SPLASH SCREEN - WITH FALLBACK SUPPORT
// ================================
function showTestimonialSplashScreen() {
    console.log('🎬 TESTIMONIAL SPLASH: Loading complete system');

    window.testimonialSessionActive = true;
    console.log('🛡️ Testimonial protection activated');
    
    if (window.stopListening && typeof window.stopListening === 'function') {
        window.stopListening();
    }
    
    const splashScreen = document.createElement('div');
    splashScreen.id = 'testimonial-splash-screen';
    splashScreen.style.animation = 'fadeInSplash 0.5s ease-in';
    
    // Get testimonials from your data
    const testimonials = extractTestimonials();
    
    if (testimonials.length > 0) {
        createDynamicSplashScreen(splashScreen, testimonials);
    } else {
        console.log('🔄 Using fallback buttons (no testimonials found)');
        createFallbackSplashScreen(splashScreen);
    }
    
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        splashScreen.style.marginTop = '20px';
        splashScreen.style.marginBottom = '20px';
        chatContainer.appendChild(splashScreen);
        splashScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// SIMPLIFIED EXTRACTION FUNCTION
function extractTestimonials() {
    console.log('🔍 Extracting testimonials...');
    
    if (!window.testimonialData) {
        console.log('❌ No testimonialData found');
        return [];
    }
    
    const data = window.testimonialData;
    let testimonials = [];
    
    // Try to get testimonials from testimonialGroups
    if (data.testimonialGroups) {
        Object.keys(data.testimonialGroups).forEach(groupKey => {
            const group = data.testimonialGroups[groupKey];
            
            if (group.testimonials && Array.isArray(group.testimonials)) {
                group.testimonials.forEach((testimonial, index) => {
                    testimonials.push({
                        id: `${groupKey}_${index}`,
                        name: testimonial.name || group.name || 'Client Story',
                        emoji: testimonial.emoji || getEmojiForGroup(groupKey),
                        group: groupKey,
                        index: index,
                        data: testimonial
                    });
                });
            }
        });
    }
    
    console.log(`✅ Found ${testimonials.length} testimonials`);
    return testimonials;
}

// SIMPLIFIED DYNAMIC SPLASH CREATION
function createDynamicSplashScreen(splashScreen, testimonials) {
    console.log('🔄 Creating dynamic buttons from', testimonials.length, 'testimonials');
    
    // Take max 4 testimonials
    const displayTestimonials = testimonials.slice(0, 4);
    let buttonsHTML = '';
    
    displayTestimonials.forEach(testimonial => {
        const videoKey = getVideoKeyForTestimonial(testimonial.group, testimonial.index);
        
        buttonsHTML += `
            <button onclick="handleTestimonialButton('${videoKey}')" style="
                display: flex; align-items: center; gap: 12px;
                background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2);
                color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
                font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
                backdrop-filter: blur(10px); width: 100%; height: 84px;
            " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
            onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                <div style="font-size: 28px;">${testimonial.emoji}</div>
                <span style="flex: 1;">${testimonial.name}</span>
            </button>
        `;
    });
    
    // Grid layout
    const gridColumns = displayTestimonials.length <= 2 ? '1fr' : '1fr 1fr';
    
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

    <!-- BUTTONS GRID -->
    <div style="display: grid; grid-template-columns: ${gridColumns}; gap: 12px; margin-bottom: 15px;">
        ${buttonsHTML}
    </div>

    <!-- SKIP BUTTON -->
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
    
    console.log(`✅ Created ${displayTestimonials.length} testimonial buttons`);
}

// FALLBACK SPLASH (original 4 buttons)
function createFallbackSplashScreen(splashScreen) {
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

    <!-- FALLBACK BUTTONS -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
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

    <!-- SKIP BUTTON -->
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

// SIMPLE EMOJI HELPER
function getEmojiForGroup(groupKey) {
    const key = groupKey.toLowerCase();
    if (key.includes('price') || key.includes('cost')) return '💰';
    if (key.includes('time') || key.includes('speed')) return '⏰';
    if (key.includes('trust')) return '🤝';
    if (key.includes('result') || key.includes('success')) return '📈';
    if (key.includes('conversion')) return '🚀';
    if (key.includes('web')) return '🌐';
    if (key.includes('form')) return '📝';
    return '🎬';
}

// SIMPLE VIDEO KEY MAPPING
function getVideoKeyForTestimonial(groupKey, index) {
    // Simple rotation through 4 video types
    const videos = ['skeptical', 'speed', 'convinced', 'excited'];
    const videoIndex = (groupKey.length + index) % 4;
    return videos[videoIndex];
}

// UPDATED PLAY FUNCTION WITH FALLBACK SUPPORT
function playTestimonialVideo(videoKey) {
    console.log(`🎬 Playing ${videoKey} testimonial`);
    
    // Get video URL - first try your data, then fallback
    let videoUrl = '';
    
    if (window.testimonialData && 
        window.testimonialData.videoUrls && 
        window.testimonialData.videoUrls[videoKey]) {
        
        videoUrl = window.testimonialData.videoUrls[videoKey];
        console.log('🎬 Using URL from testimonialData:', videoUrl);
    }
    
    // If URL is empty, use fallback
    if (!videoUrl || videoUrl.trim() === '') {
        console.log('🔄 Using fallback URL');
        videoUrl = FALLBACK_VIDEO_URLS[videoKey];
    }
    
    if (!videoUrl) {
        console.error('❌ No video URL found for:', videoKey);
        return;
    }
    
    console.log('✅ Final video URL:', videoUrl);
    
    // 🚨 IMPORTANT: Now call your ORIGINAL playTestimonialVideo function
    // But pass it the correct video URL
    window.avatarCurrentlyPlaying = true;
    
    // You'll need to update your original function to accept a URL parameter
    // OR we can create a wrapper
    playVideoWithUrl(videoKey, videoUrl);
}

// NEW FUNCTION TO PLAY VIDEO WITH SPECIFIC URL
function playVideoWithUrl(videoKey, videoUrl) {
    console.log(`🎬 Playing video: ${videoKey}`, videoUrl);
    
    // 🌀 SHOW SPINNER
    showTestimonialSpinner();
    
    // 🛡️ PROTECTION FLAGS
    window.testimonialSessionActive = true;
    window.testimonialProtectionActive = true;
    
    // Remove splash screen
    const splashScreen = document.getElementById('testimonial-splash-screen');
    if (splashScreen) splashScreen.remove();
    
    // CREATE VIDEO PLAYER (simplified version)
    const videoOverlay = document.createElement('div');
    videoOverlay.id = 'testimonial-video-player';
    videoOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
        animation: fadeInSplash 0.5s ease-in;
        padding: 20px;
    `;
    
    videoOverlay.innerHTML = `
        <!-- VIDEO PLAYER SIMPLIFIED -->
        <div style="position: relative; width: 854px; height: 480px; background: #000; border-radius: 20px; overflow: hidden;">
            <video id="testimonialVideo" autoplay style="width: 100%; height: 100%; object-fit: contain;">
                <source src="${videoUrl}" type="video/mp4">
            </video>
            <button onclick="closeTestimonialVideo()" style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 32px;
                background: rgba(0, 0, 0, 0.6);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                z-index: 10001;
            " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)';" 
            onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)';">
                ✕ Close & Continue
            </button>
        </div>
    `;
    
    document.body.appendChild(videoOverlay);
    
    // Hide spinner and play
    setTimeout(() => {
        hideTestimonialSpinner();
        const video = document.getElementById('testimonialVideo');
        if (video) video.play();
    }, 100);
}

// ================================
// 🎬 MISSING FUNCTIONS THAT CAUSED THE ERROR
// ================================

// SKIP TESTIMONIALS FUNCTION
function handleTestimonialSkip() {
    console.log('⏭️ Skipping testimonials');
    
    // Remove splash screen
    const splashScreen = document.getElementById('testimonial-splash-screen');
    if (splashScreen) {
        splashScreen.remove();
        console.log('✅ Removed testimonial splash screen');
    }
    
    // Reset flags
    window.testimonialSessionActive = false;
    window.avatarCurrentlyPlaying = false;
    
    // Return to voice chat
    if (typeof returnToVoiceChat === 'function') {
        returnToVoiceChat();
    } else {
        console.log('🎤 Returning to main chat interface');
        // Add your logic to return to main chat here
    }
}

// SPINNER FUNCTIONS
function showTestimonialSpinner() {
    console.log('🌀 Showing spinner');
    
    // Remove existing spinner
    const existingSpinner = document.getElementById('testimonial-spinner');
    if (existingSpinner) existingSpinner.remove();
    
    const spinner = document.createElement('div');
    spinner.id = 'testimonial-spinner';
    spinner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    spinner.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="width: 60px; height: 60px; border: 4px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%; border-top-color: #007AFF;
                animation: testimonial-spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <div style="font-size: 18px; font-weight: 500; opacity: 0.9;">Loading testimonial...</div>
        </div>
    `;
    
    document.body.appendChild(spinner);
}

function hideTestimonialSpinner() {
    const spinner = document.getElementById('testimonial-spinner');
    if (spinner) {
        spinner.style.opacity = '0';
        spinner.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            if (spinner.parentNode) spinner.remove();
        }, 300);
    }
}

// CLOSE VIDEO FUNCTION
function closeTestimonialVideo() {
    console.log('🎬 Closing testimonial video');
    
    window.avatarCurrentlyPlaying = false;
    
    const videoPlayer = document.getElementById('testimonial-video-player');
    if (videoPlayer) {
        const video = videoPlayer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        videoPlayer.remove();
        console.log('✅ Video player removed');
    }
    
    // Show navigation or return to chat
    if (typeof showTestimonialNavigationOptions === 'function') {
        showTestimonialNavigationOptions();
    } else {
        handleTestimonialSkip(); // Just skip if no navigation
    }
}

// RETURN TO VOICE CHAT (SIMPLIFIED VERSION)
function returnToVoiceChat() {
    console.log('🎤 Returning to voice chat');
    
    // Reset flags
    window.testimonialSessionActive = false;
    window.avatarCurrentlyPlaying = false;
    
    // Remove any remaining testimonial elements
    ['testimonial-splash-screen', 'testimonial-video-player', 'testimonial-nav-options'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.remove();
    });
    
    console.log('✅ Ready for voice chat');
}

// ================================
// 🎬 GLOBAL EXPORTS
// ================================

window.showTestimonialSplashScreen = showTestimonialSplashScreen;
window.handleTestimonialButton = playTestimonialVideo;
window.handleTestimonialSkip = handleTestimonialSkip;
window.closeTestimonialVideo = closeTestimonialVideo;
window.returnToVoiceChat = returnToVoiceChat;
window.showTestimonialSpinner = showTestimonialSpinner;
window.hideTestimonialSpinner = hideTestimonialSpinner;

console.log('✅ Testimonials Player Loaded with Fallback Support');