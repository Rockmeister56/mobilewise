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
// 🎬 SPLASH SCREEN (YOUR BEAUTIFUL CSS)
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
    
    <!-- USE THE EXACT SAME HEADER STRUCTURE AS YOUR ACTION BUTTONS -->
    <div style="display: flex; align-items: center; margin-bottom: 5px; gap: 15px; margin-top: 5px;">
        <video autoplay loop muted playsinline style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
            <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1764614255102.mp4" type="video/mp4">
        </video>
        <div>
            <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600; color: white;">Client Testimonials</h3>
            <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300; letter-spacing: 0.5px;">Real stories from satisfied clients</p>
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
    
   const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
if (chatContainer) {
    // Use the same positioning as action buttons - NO padding-top
    splashScreen.style.marginTop = '20px'; // Natural spacing like action buttons
    splashScreen.style.marginBottom = '20px';
    chatContainer.appendChild(splashScreen);
    splashScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
}

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

// ================================
// 🌀 UNIVERSAL TESTIMONIAL SPINNER
// ================================
function showTestimonialSpinner() {
    // Remove any existing spinner first
    const existingSpinner = document.getElementById('testimonial-spinner');
    if (existingSpinner) {
        existingSpinner.remove();
    }
    
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
        <div style="
            text-align: center;
            color: white;
        ">
            <div style="
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                border-top-color: #007AFF;
                animation: testimonial-spin 1s linear infinite;
                margin: 0 auto 20px;
            "></div>
            <div style="
                font-size: 18px;
                font-weight: 500;
                opacity: 0.9;
            ">Loading testimonial...</div>
        </div>
    `;
    
    document.body.appendChild(spinner);
    
    // Add CSS animation if not already present
    if (!document.getElementById('testimonial-spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'testimonial-spinner-styles';
        style.textContent = `
            @keyframes testimonial-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideTestimonialSpinner() {
    const spinner = document.getElementById('testimonial-spinner');
    if (spinner) {
        // Add fade out animation
        spinner.style.opacity = '0';
        spinner.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            if (spinner.parentNode) {
                spinner.remove();
            }
        }, 300);
    }
}

function playTestimonialVideo(testimonialType) {
    console.log(`🎬 Playing ${testimonialType} testimonial`);

    // 🌀 SHOW SPINNER IMMEDIATELY
    showTestimonialSpinner();
    
    // 🛡️ ULTRA-STRONG PROTECTION: Block ALL voice system timeouts
    window.testimonialSessionActive = true;
    window.testimonialProtectionActive = true;
    window.disableSpeakNowBanner = true;
    
    // 🚫 CANCEL VOICE SYSTEM TIMERS
    if (window.directSpeakNowTimeout) {
        clearTimeout(window.directSpeakNowTimeout);
        console.log('✅ Cancelled directSpeakNow timeout');
    }
    if (window.speakSequenceTimeout) {
        clearTimeout(window.speakSequenceTimeout);
        console.log('✅ Cancelled speakSequence timeout');
    }
    
    // 🚫 BLOCK BANNER SYSTEM
    if (window.bannerCooldown !== undefined) {
        window.bannerCooldown = true; // Force banner cooldown
        console.log('✅ Forced banner cooldown active');
    }
    
    // 🚫 PREVENT DOUBLE CALLS
    if (window.avatarCurrentlyPlaying) {
        console.log('🚫 Video already playing - skipping');
        return;
    }
    
    window.avatarCurrentlyPlaying = true;
    
    const videoUrl = TESTIMONIAL_VIDEOS[testimonialType];
    if (!videoUrl) {
        console.error('❌ Video URL not found for:', testimonialType);
        window.avatarCurrentlyPlaying = false;
        hideTestimonialSpinner(); // Hide spinner on error
        return;
    }
    
    const videoDuration = VIDEO_DURATIONS[testimonialType] || 20000;
    
    // Remove splash screen first
    const splashScreen = document.getElementById('testimonial-splash-screen');
    if (splashScreen) {
        splashScreen.remove();
    }
    
// Create the video container WITH OVERLAY HEADER
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
    
   const testimonialTitles = {
    skeptical: 'Skeptical Client Testimonial',
    speed: 'Speed Results Testimonial', 
    convinced: 'Convinced Client Testimonial',
    excited: 'Excited Results Testimonial'
};

videoOverlay.innerHTML = `
    <!-- YOUR EXACT HEADER FROM SPLASH SCREEN -->
    <div style="
        background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                    url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1762038349654_action-bg.jpg');
        background-size: cover;
        background-position: center;
        background-blend-mode: overlay;
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 20px 25px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        color: white;
        font-family: 'Segoe UI', system-ui, sans-serif;
        max-width: 854px;
        width: 100%;
    ">
        <div style="display: flex; align-items: center; margin-bottom: 5px; gap: 15px; margin-top: 5px;">
            <video autoplay loop muted playsinline style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1764614255102.mp4" type="video/mp4">
            </video>
            <div>
                <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600; color: white;">${testimonialTitles[testimonialType] || 'Client Testimonial'}</h3>
                <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300; letter-spacing: 0.5px;">Real story from a satisfied client</p>
            </div>
        </div>
    </div>
    
    <!-- VIDEO PLAYER -->
    <div style="
        position: relative;
        width: 854px;
        height: 480px;
        background: #000;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: slideInFromBottom 0.5s ease-out;
    ">
        <video id="testimonialVideo" autoplay style="
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
        ">
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        
        <!-- Close Button -->
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
        " 
        onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateX(-50%) translateY(-2px)';" 
        onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateX(-50%) translateY(0)';">
            ✕ Close & Continue
        </button>
    </div>
`;
    
    document.body.appendChild(videoOverlay);

     // 🌀 HIDE SPINNER when video is loaded
    setTimeout(() => {
        hideTestimonialSpinner();
        
        // Start video playback
        const video = document.getElementById('testimonialVideo');
        if (video) {
            video.play().catch(e => {
                console.error('❌ Video play failed:', e);
                hideTestimonialSpinner();
            });
        }
    }, 100);
    
    // ✅ SAFE EVENT LISTENERS - PREVENT DOUBLE CALLS
    setTimeout(() => {
        const video = document.getElementById('testimonialVideo');
        if (video) {
            let videoEnded = false; // LOCAL FLAG to prevent double calls

          // ✅ FIXED VERSION - Add this to show navigation when video ends
// ✅ FIXED VERSION - Add this to show navigation when video ends
video.addEventListener('ended', function() {
    if (!videoEnded) {
        videoEnded = true;
        console.log('✅ Video ended naturally - showing navigation');
        window.avatarCurrentlyPlaying = false; // RESET FLAG
        
        // 🎯 FIRST: Remove the video player
        const videoPlayer = document.getElementById('testimonial-video-player');
        if (videoPlayer) {
            // Stop the video first
            const video = videoPlayer.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            // Remove the player
            videoPlayer.remove();
            console.log('✅ Video player removed after natural end');
        }
        
        // 🎯 THEN: Show navigation options
        showTestimonialNavigationOptions();
    }
});

            // Handle video errors
            video.addEventListener('error', function(e) {
                if (!videoEnded) {
                    videoEnded = true;
                    console.error('❌ Video error - safe close:', e);
                    window.avatarCurrentlyPlaying = false; // RESET FLAG
                    hideTestimonialSpinner(); // 🌀 HIDE SPINNER ON ERROR
                }
            });
        } else {
            console.error('❌ Video element not found for event listeners');
        }
    }, 100);

    // Click outside to close - WITH PROTECTION
    let overlayClicked = false;
    videoOverlay.addEventListener('click', function(e) {
        if (e.target === videoOverlay && !overlayClicked) {
            overlayClicked = true;
            console.log('✅ Overlay clicked - safe close');
        }
    });

    // Auto-close after video duration - WITH PROTECTION  
    let timeoutFired = false;
    setTimeout(() => {
        if (document.getElementById('testimonial-video-player') && !timeoutFired) {
            timeoutFired = true;
            console.log('✅ Safety timeout - safe close');
        }
    }, videoDuration);
}

function handleCloseTestimonial() {
    console.log('🎯🎯🎯 HANDLE CLOSE TESTIMONIAL EXECUTING 🎯🎯🎯');
    
    // 1. Stop all speech immediately
    if (window.stopAllSpeech) {
        window.stopAllSpeech();
    }
    
    // 2. Remove testimonial protection
    window.testimonialPlaying = false;
    window.consultationOfferActive = true;
    
    // 3. Remove ALL testimonial elements from DOM
    const elementsToRemove = [
        'testimonial-navigation-overlay',
        'testimonial-splash', 
        'testimonial-video-container',
        'testimonial-player'
    ];
    
    elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
            console.log('✅ Removed:', id);
        }
    });
    
    // 4. Clear any overlay that might block clicks
    const overlays = document.querySelectorAll('.testimonial-overlay, .video-overlay');
    overlays.forEach(overlay => {
        overlay.remove();
    });
    
    // 5. Show chat interface
    const chatContainer = document.querySelector('.chat-container');
    const inputArea = document.querySelector('.input-area');
    if (chatContainer) chatContainer.style.display = 'block';
    if (inputArea) inputArea.style.display = 'block';
    
    // In your consultation offer code, use LONGER delay:
setTimeout(() => {
    console.log('🗣️ Playing consultation offer...');
    
    const consultationText = "If we can get you the same results as our previous customers, would you be interested in that consultation?";
    
    if (window.addAIMessage) {
        window.addAIMessage(consultationText);
    }
    
    if (window.speakText) {
        window.speakText(consultationText);
        
        // 🆕 MUCH LONGER DELAY - let ALL automatic systems settle
        setTimeout(() => {
            console.log('🎯 10-second delay complete - manually triggering banner');
            
            // Add timeout hack
            const wasInLeadCapture = window.isInLeadCapture;
            window.isInLeadCapture = true; // 20-second timeout
            
            // Show banner
            setTimeout(() => {
                if (typeof showDirectSpeakNow === 'function') {
                    showDirectSpeakNow();
                    console.log('✅ Manual banner shown after long delay');
                }
                
                // Restore timeout
                setTimeout(() => {
                    window.isInLeadCapture = wasInLeadCapture;
                    console.log('🔄 Timeout restored');
                }, 25000);
            }, 1000); // Extra buffer
            
        }, 10000); // ⚠️ INCREASED TO 10 SECONDS! Let everything settle
    }
}, 500);
    
    console.log('✅ TESTIMONIAL FULLY CLOSED - BACK TO CHAT');
}

// ================================
// 🎬 BUTTON HANDLERS - ADD THESE BACK
// ================================
function handleTestimonialButton(testimonialType) {
    console.log(`🎬 Button clicked: ${testimonialType}`);
    playTestimonialVideo(testimonialType);

    }

        // 🛡️ Ensure buttons can be clicked
    if (window.avatarCurrentlyPlaying) {
        console.log('🔄 Force-resetting avatarCurrentlyPlaying flag');
        window.avatarCurrentlyPlaying = false;
}

function handleTestimonialSkip() {
    console.log('⏭️ Skipping testimonials - using returnToVoiceChat flow');
    
    // Just use the same function that already works!
    returnToVoiceChat();
}

function showTestimonialNavigationOptions() {
    console.log('🎯 Showing testimonial navigation options');
    
    // Create or show navigation options screen
    let navScreen = document.getElementById('testimonial-nav-options');
    
    if (!navScreen) {
        navScreen = document.createElement('div');
        navScreen.id = 'testimonial-nav-options';
        navScreen.innerHTML = `
            <div class="testimonial-nav-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                font-family: Arial, sans-serif;
                color: white;
            ">
                <div class="nav-content" style="
                    text-align: center;
                    background: linear-gradient(135deg, #001885ff 0%, #764ba2 100%);
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                    max-width: 500px;
                    width: 90%;
                ">
                    <h2 style="margin-bottom: 30px; font-size: 28px;">🎬 What would you like to do?</h2>
                    
                    <div class="nav-buttons" style="display: flex; flex-direction: column; gap: 15px;">
                        <button onclick="showMoreTestimonials()" class="nav-btn" style="
                            background: linear-gradient(135deg, #0f6bd4ff 0%, #04b3eeff 100%);
                            color: white;
                            border: none;
                            padding: 15px 30px;
                            border-radius: 10px;
                            font-size: 18px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            📺 Watch More Testimonials
                        </button>
                        
                        <button onclick="returnToVoiceChat()" class="nav-btn" style="
                            background: linear-gradient(135deg, #7700ffff 0%, #001effff 100%);
                            color: white;
                            border: none;
                            padding: 15px 30px;
                            border-radius: 10px;
                            font-size: 18px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            🎤 Return to Voice Chat
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(navScreen);
    }
    
    navScreen.style.display = 'flex';
    
    // Add hover effects
    setTimeout(() => {
        const buttons = navScreen.querySelectorAll('.nav-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }, 100);
}

function returnToVoiceChat() {
    console.log('🎯🎯🎯 RETURN TO VOICE CHAT CLICKED 🎯🎯🎯');

    // 1. STOP ALL SPEECH FIRST
    if (window.stopAllSpeech) {
        window.stopAllSpeech();
        console.log('✅ All speech stopped');
    }
    
    // 2. 🎯 SET THE EXACT SAME STATE AS NORMAL CONSULTATION FLOW
    if (window.salesAI) {
        window.salesAI.state = 'qualification'; // This triggers emergency Bruce detection
        console.log('✅ Sales AI state set to qualification');
    }
    
    // Also set the global conversation state
    if (window.conversationState !== undefined) {
        window.conversationState = 'qualification';
        console.log('✅ Global conversation state set to qualification');
    }
    
    // 3. Clear the OLD transcript that causes testimonials to re-appear
    window.lastCapturedTranscript = '';
    window.lastCapturedTime = 0;
    
    // Also clear any input fields
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = '';
    }
    
    console.log('🛑 Cleared old transcript to prevent testimonial re-trigger');
    
    // 4. Set consultation flag
    window.consultationOfferActive = true;
    console.log('🎯 Consultation offer active - emergency Bruce detection enabled');
    
    // 5. 🚨🚨🚨 CRITICAL: CLEAR ALL TESTIMONIAL FLAGS 🚨🚨🚨
    console.log('🧹 CLEARING ALL TESTIMONIAL FLAGS:');
    const testimonialFlags = [
        'testimonialSessionActive',
        'isInTestimonialMode', 
        'concernBannerActive',
        'isTestimonialActive',
        'testimonialMode',
        'testimonialsPlaying',
        'testimonialActive',
        'testimonialVideoActive',
        'avatarCurrentlyPlaying',
        'testimonialProtectionActive',
        'disableSpeakNowBanner'
    ];
    
    testimonialFlags.forEach(flag => {
        window[flag] = false;
        console.log(`  ✅ ${flag} = false`);
    });
    
    console.log('🛡️🛡️ DOUBLE Testimonial protection deactivated');
    
    // 6. REMOVE ALL testimonial elements
    const elementsToRemove = [
        'testimonial-nav-options',
        'testimonial-video-overlay', 
        'testimonial-splash-screen',
        'testimonial-splash',
        'testimonial-video-container'
    ];
    
    elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
            console.log('✅ Removed:', id);
        }
    });
    
    // 7. Clear any cooldowns that might block voice chat
    if (window.cooldownActive !== undefined) {
        window.cooldownActive = false;
        console.log('🛡️ Cooldown cleared for voice chat');
    }
    
    // 8. PLAY THE CONSULTATION OFFER PROPERLY
    setTimeout(() => {
        console.log('🗣️ Playing consultation offer...');
        
        const consultationText = "If we can get you the same results as our previous customers, would you be interested in that consultation?";
        
        // A. FIRST add message to chat bubble (VISIBLE)
        if (window.addAIMessage && typeof window.addAIMessage === 'function') {
            window.addAIMessage(consultationText);
            console.log('✅ AI message added to chat bubble');
        }
        
        // B. THEN speak it (AUDIBLE)
        if (window.speakText) {
            window.speakText(consultationText);
            
            // C. WAIT FOR SPEECH TO COMPLETE (5-6 seconds for that sentence)
            const speechDuration = 6000; // 6 seconds buffer
            
            setTimeout(() => {
                console.log('🎯 Speech should be complete - Starting listening');
                
                // Clear any partial transcript from during speech
                if (window.lastCapturedTranscript) {
                    window.lastCapturedTranscript = '';
                    console.log('🧹 Cleared transcript captured during speech');
                }
                
                if (window.startListening) {
                    window.startListening();
                    
                    // Show banner AFTER listening starts
                    setTimeout(() => {
                        console.log('🎤 Calling showDirectSpeakNow()...');
                        if (typeof showDirectSpeakNow === 'function') {
                            showDirectSpeakNow();
                            console.log('✅ Speak now banner shown AFTER speech complete');
                        }
                    }, 800);
                }
            }, speechDuration);
        }
    }, 500);
    
    console.log('✅ SUCCESSFULLY RETURNED TO VOICE CHAT');
}

function showMoreTestimonials() {
    console.log('🎯 User chose: Watch more testimonials');

    // 🛡️ CRITICAL: Cancel any pending decision panel timeouts
    if (window.decisionPanelTimeout) {
        clearTimeout(window.decisionPanelTimeout);
        console.log('✅ Cancelled decision panel timeout');
    }
    
    // 🛡️ CRITICAL: Reset playing flags
    window.avatarCurrentlyPlaying = false;
    
    // 🛡️ STRONG PROTECTION: Keep testimonial mode active
    window.testimonialSessionActive = true;
    window.testimonialProtectionActive = true;
    window.disableSpeakNowBanner = true;
    
    // Hide navigation screen
    const navScreen = document.getElementById('testimonial-nav-options');
    if (navScreen) {
        navScreen.style.display = 'none';
    }
    
    // Wait a moment, then show splash screen
    setTimeout(() => {
        // Show the testimonial splash screen again
        showTestimonialSplashScreen();
    }, 200);
}

// Make sure it's exported globally
window.showMoreTestimonials = showMoreTestimonials;

function triggerPostTestimonialSpeech() {
    console.log('🗣️ Playing post-testimonial speech');
    
    const speechText = "If we can get you the same results as our previous customers, would you be interested in that consultation?";
    
    // Use whichever speech method your system uses:
    if (window.playVoiceResponse) {
        window.playVoiceResponse(speechText);
    } else if (window.speakResponse) {
        window.speakResponse(speechText);
    } else if (window.ttsPlay) {
        window.ttsPlay(speechText);
    } else {
        // Fallback: use browser TTS
        const utterance = new SpeechSynthesisUtterance(speechText);
        speechSynthesis.speak(utterance);
    }
    
    console.log('💬 Said: "If we can get you the same results as our previous customers, would you be interested in that consultation?"');
    
    // 🎯 Set the consultation context
    window.currentQuestionContext = 'consultation_offer';
    window.expectingPositiveResponse = true;
}

// Add this function to handle consultation responses
function handleConsultationResponse(userInput) {
    console.log('🎯 Checking consultation response:', userInput);
    
    const positiveResponses = [
        'yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'absolutely', 'definitely',
        'of course', 'why not', 'let\'s do it', 'i\'m interested', 'interested',
        'yes please', 'please', 'go ahead', 'continue', 'proceed'
    ];
    
    const userInputLower = userInput.toLowerCase().trim();
    
    // Check if this is a positive response to consultation offer
    if (window.expectingConsultationResponse && positiveResponses.some(response => 
        userInputLower.includes(response) || userInputLower === response)) {
        
        console.log('🎯 POSITIVE CONSULTATION RESPONSE DETECTED - Triggering action panel');
        
        // Reset the flag
        window.expectingConsultationResponse = false;
        window.consultationQuestionActive = false;
        
        // Trigger action panel
        setTimeout(() => {
            if (window.showActionPanel) {
                window.showActionPanel();
            } else if (window.triggerActionCenter) {
                window.triggerActionCenter();
            } else if (window.universalBannerEngine) {
                window.universalBannerEngine.showBanner('set_appointment');
            }
            console.log('✅ Action panel triggered for consultation response');
        }, 1000);
        
        return true; // Handled
    }
    
    return false; // Not a consultation response
}

function activateVoiceChatSystem() {
    console.log('🎯 Activating voice chat system');
    
    // Reset any banner sequences that might interfere
    if (window.currentBannerSequence) {
        console.log('🔄 Resetting banner sequence');
        window.currentBannerSequence = null;
    }
    
    // Ensure the speak now functionality is available
    if (window.activateVoiceChat) {
        window.activateVoiceChat();
    } else if (window.startListening) {
        // Use startListening instead of initializeVoiceRecognition
        console.log('🎤 Starting voice listening');
        window.startListening();
    } else {
        // Fallback activation
        showMainInterface();
        console.log('⚠️ No voice chat system found - showing main interface only');
    }
    
    // Make sure the black overlay is gone
    const blackOverlay = document.querySelector('.black-transparent-overlay');
    if (blackOverlay) {
        blackOverlay.style.display = 'none';
    }
}

function showMainInterface() {
    console.log('🔄 Showing main interface - CLEAN STATE');
    
    // Hide any testimonial elements
    const testimonialElements = document.querySelectorAll('[id*="testimonial"], [class*="testimonial"]');
    testimonialElements.forEach(el => {
        if (el.id !== 'testimonial-nav-options') { // Keep nav options for now
            el.style.display = 'none';
        }
    });
    
    // Show your main chat interface
    const mainInterface = document.getElementById('voice-chat-interface') || 
                         document.getElementById('universal-banner') ||
                         document.querySelector('.speak-now-container');
    
    if (mainInterface) {
        mainInterface.style.display = 'block';
    }
    
    // Trigger your banner system in a clean way
    setTimeout(() => {
        if (window.triggerCleanBannerSequence) {
            window.triggerCleanBannerSequence();
        }
    }, 500);
}

function closeTestimonialNav() {
    console.log('🎯 User chose: Skip all testimonials');
    
    // Completely close everything
    const navScreen = document.getElementById('testimonial-nav-options');
    if (navScreen) {
        navScreen.style.display = 'none';
    }
    
    // Close any remaining testimonial elements
    const videoOverlay = document.getElementById('testimonial-video-overlay');
    const splashScreen = document.getElementById('testimonial-splash-screen');
    
    if (videoOverlay) videoOverlay.style.display = 'none';
    if (splashScreen) splashScreen.style.display = 'none';
    
    // Ensure voice chat is available
    window.testimonialSessionActive = false;
    console.log('🛡️ Testimonial session completely closed');
}

// Helper function to show main interface
function showMainInterface() {
    console.log('🔄 Showing main interface');
    // Add your main interface showing logic here
    // This might include showing the universal banner, action center, etc.
}


// ================================
// 🎬 INITIALIZE THE SYSTEM
// ================================
// Call this function to start the testimonial system
function initializeTestimonialSystem() {
    // Make sure global state is reset
    window.avatarCurrentlyPlaying = false;
    window.testimonialSessionActive = false;

     // Add CSS animations
    addTestimonialAnimations();
    
    console.log('✅ Testimonial system initialized with protection');
    
    // Add CSS animations if not already present
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
        `;
        document.head.appendChild(style);
    }
    
    console.log('✅ Testimonial system initialized');
}

// 🚨 EMERGENCY SPEECH STOPPER - Add this function
function emergencyStopAllSpeech() {
    console.log('🔇 EMERGENCY STOP - Killing all speech for testimonial');
    
    // 1. Cancel all browser speech synthesis
    if (window.speechSynthesis) {
        speechSynthesis.cancel();
        console.log('✅ Browser TTS stopped');
    }
    
    // 2. Stop any custom TTS systems
    const stopFunctions = [
        'stopAllSpeech', 'stopCurrentSpeech', 'stopVoiceResponse', 
        'stopElevenLabsSpeech', 'stopBritishSpeech', 'stopTTS'
    ];
    
    stopFunctions.forEach(funcName => {
        if (window[funcName] && typeof window[funcName] === 'function') {
            try {
                window[funcName]();
                console.log(`✅ ${funcName} stopped`);
            } catch (e) {
                // Function doesn't exist - that's fine
            }
        }
    });
    
    // 3. Pause all audio/video elements (except testimonials)
    document.querySelectorAll('audio, video').forEach(media => {
        if (!media.paused && !media.closest('#testimonial-video-player')) {
            media.pause();
        }
    });
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
            /* ============ TESTIMONIALS MOBILE CSS ============ */
@media (max-width: 768px) {
    #testimonial-splash-screen > div {
        max-width: 100% !important;
        padding: 15px 12px !important;
        margin: 15px 0 !important;
        min-height: auto !important;
        border-radius: 15px !important;
        width: 98% !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    /* Fix testimonial header */
    #testimonial-splash-screen > div > div:first-child {
        display: flex !important;
        align-items: flex-start !important;
        text-align: left !important;
        gap: 12px !important;
        margin-bottom: 15px !important;
        margin-top: 0 !important;
    }

    #testimonial-splash-screen video {
        width: 45px !important;
        height: 45px !important;
        margin-top: 0 !important;
        flex-shrink: 0 !important;
    }

    #testimonial-splash-screen h3 {
        font-size: 16px !important;
        margin: 0 0 2px 0 !important;
        line-height: 1.1 !important;
        padding-top: 2px !important;
    }

    #testimonial-splash-screen p {
        font-size: 11px !important;
        margin: 0 !important;
        line-height: 1.1 !important;
    }

    /* Slimmer testimonial buttons */
    #testimonial-splash-screen button {
        height: 55px !important;
        min-width: auto !important;
        padding: 8px 12px !important;
        font-size: 14px !important;
        margin: 0 !important;
    }

    /* Single column for testimonials */
    #testimonial-splash-screen > div > div:nth-child(2) {
        grid-template-columns: 1fr !important;
        gap: 8px !important;
        margin-top: 20px !important;
    }

    /* Smaller emojis */
    #testimonial-splash-screen button div {
        font-size: 24px !important;
    }

    /* Slimmer skip button */
    #testimonial-splash-screen > div > button:last-child {
        height: 45px !important;
        padding: 8px 15px !important;
        font-size: 13px !important;
        margin-top: 8px !important;
    }
}    
        `;
        document.head.appendChild(style);
    }
    console.log('✅ Testimonial system initialized');
}

// 🚨 EMERGENCY SPEECH STOPPER - Add this to the VERY BOTTOM of your file
function emergencyStopAllSpeech() {
    console.log('🔇 EMERGENCY STOP - Killing all speech for testimonial');
    
    // 1. Cancel all browser speech synthesis
    if (window.speechSynthesis) {
        speechSynthesis.cancel();
        console.log('✅ Browser TTS stopped');
    }
    
    // 2. Stop any custom TTS systems
    const stopFunctions = [
        'stopAllSpeech', 'stopCurrentSpeech', 'stopVoiceResponse', 
        'stopElevenLabsSpeech', 'stopBritishSpeech', 'stopTTS'
    ];
    
    stopFunctions.forEach(funcName => {
        if (window[funcName] && typeof window[funcName] === 'function') {
            try {
                window[funcName]();
                console.log(`✅ ${funcName} stopped`);
            } catch (e) {
                // Function doesn't exist - that's fine
            }
        }
    });
    
    // 3. Pause all audio/video elements (except testimonials)
    document.querySelectorAll('audio, video').forEach(media => {
        if (!media.paused && !media.closest('#testimonial-video-player')) {
            media.pause();
        }
    });
}

// 🎯 AUTO-STOP AI SPEECH WHEN TESTIMONIAL STARTS - CLEAN VERSION
const originalHandleTestimonialButton = window.handleTestimonialButton;
window.handleTestimonialButton = function(testimonialType) {
    console.log(`🎬🛑 AUTO-STOP: Stopping AI speech for ${testimonialType} testimonial`);
    emergencyStopAllSpeech();
    
    // Wait a tiny moment to ensure speech is fully stopped, then play video
    setTimeout(() => {
        window.avatarCurrentlyPlaying = false; // Reset flag
        originalHandleTestimonialButton(testimonialType);
    }, 50);
};

console.log('✅ AUTO-SPEECH-STOPPER installed - testimonials will automatically stop AI narration');

// ================================
// GLOBAL EXPORTS - TESTIMONIAL SYSTEM
// ================================
window.handleTestimonialButton = handleTestimonialButton;
window.showTestimonialSplashScreen = showTestimonialSplashScreen;
window.playTestimonialVideo = playTestimonialVideo; 
window.handleTestimonialSkip = handleTestimonialSkip;
window.hideTestimonialSplash = hideTestimonialSplash;
window.showTestimonialSpinner = showTestimonialSpinner;
window.hideTestimonialSpinner = hideTestimonialSpinner;
window.avatarCurrentlyPlaying = false;

// ✅ USE THIS - It's the safest approach:
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTestimonialSystem);
} else {
    initializeTestimonialSystem();
}

document.addEventListener('click', function(e) {
    const closeBtn = e.target.closest('.testimonial-close-btn');
    if (closeBtn) {
        console.log('🔍 Close button clicked - checking context...');
        
        // 🚫 MULTIPLE PROTECTIONS:
        // 1. Check if we're in conversation mode
        if (window.consultationOfferActive) {
            console.log('🛑 BLOCKED: In consultation conversation');
            return;
        }
        
        // 2. Check if action center is active  
        if (window.actionCenterActive) {
            console.log('🛑 BLOCKED: Action center is active');
            return;
        }
        
        // 3. Check if video is actually visible
        const videoPlayer = document.getElementById('testimonial-video-player');
        if (!videoPlayer || window.getComputedStyle(videoPlayer).display === 'none') {
            console.log('🛑 BLOCKED: No video player visible');
            return;
        }
        
        // 4. Only proceed if we're actually in a testimonial session
        if (!window.testimonialSessionActive) {
            console.log('🛑 BLOCKED: Not in active testimonial session');
            return;
        }
        
        console.log('✅ Safe to close testimonial video');
        closeTestimonialVideo();
    }
});

console.log('✅ Testimonials Player Loaded - Ready for concerns!');