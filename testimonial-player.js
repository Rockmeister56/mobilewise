// ===================================================
// 🎬 COMPLETE TESTIMONIAL SYSTEM WITH NEW FORMAT + OLD FUNCTIONALITY
// ===================================================

window.avatarCurrentlyPlaying = false;
window.testimonialSessionActive = false;
window.testimonialVideos = {};
window.consultationOfferActive = false;
window.expectingConsultationResponse = false;
window.consultationQuestionActive = false;
window.consultationResponseProcessed = false;

// ================================
// 🎬 SPLASH SCREEN (WORKING VERSION)
// ================================
function showTestimonialSplashScreen() {
    console.log('🎬 Creating testimonial splash screen...');
    
    // Check if we have testimonial data
    if (!window.testimonialData || !window.testimonialData.testimonialGroups) {
        console.error('❌ No testimonial data found');
        return;
    }
    
    const groups = window.testimonialData.testimonialGroups;
    console.log('📊 Found groups:', Object.keys(groups));
    
    // 🛡️ SET PROTECTION FLAG - BLOCK SPEAK NOW
    window.testimonialSessionActive = true;
    console.log('🛡️ Testimonial protection activated - Speak Now blocked');
    
    // 🚫 CANCEL VOICE SYSTEM TIMERS (FROM OLD CODE)
    if (window.directSpeakNowTimeout) {
        clearTimeout(window.directSpeakNowTimeout);
        console.log('✅ Cancelled directSpeakNow timeout');
    }
    if (window.speakSequenceTimeout) {
        clearTimeout(window.speakSequenceTimeout);
        console.log('✅ Cancelled speakSequence timeout');
    }
    
    // 🚫 BLOCK BANNER SYSTEM (FROM OLD CODE)
    if (window.bannerCooldown !== undefined) {
        window.bannerCooldown = true; // Force banner cooldown
        console.log('✅ Forced banner cooldown active');
    }
    
    // Create container
    const splashScreen = document.createElement('div');
    splashScreen.id = 'testimonial-splash-screen';
    splashScreen.style.cssText = `
        margin: 20px 0;
        animation: fadeInSplash 0.5s ease-in;
    `;
    
    // Get testimonials from first group that has them
    let testimonials = [];
    Object.keys(groups).forEach(groupKey => {
        const group = groups[groupKey];
        if (group.testimonials && Array.isArray(group.testimonials) && group.testimonials.length > 0) {
            testimonials = testimonials.concat(group.testimonials.map((t, index) => ({
                ...t,
                groupKey: groupKey,
                index: index
            })));
        }
    });
    
    console.log(`✅ Found ${testimonials.length} testimonials total`);
    
    // If no testimonials, show message
    if (testimonials.length === 0) {
        splashScreen.innerHTML = `
            <div style="
                background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9));
                border-radius: 20px;
                padding: 30px;
                color: white;
                font-family: 'Segoe UI', sans-serif;
                max-width: 750px;
            ">
                <h3 style="margin: 0 0 10px 0;">No Testimonials Available</h3>
                <p>Check your testimonial data configuration.</p>
            </div>
        `;
    } else {
        // Create buttons from testimonials (max 4)
        const displayTestimonials = testimonials.slice(0, 4);
        let buttonsHTML = '';
        
        displayTestimonials.forEach((testimonial, index) => {
            const buttonId = `testimonial_${index}`;
            const buttonName = testimonial.title || testimonial.author || `Testimonial ${index + 1}`;
            const emoji = getEmojiForTestimonial(testimonial);
            
            buttonsHTML += `
                <button onclick="handleTestimonialButton('${buttonId}')" 
                        data-video-url="${testimonial.videoUrl || ''}"
                        style="
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2);
                    color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
                    font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
                    backdrop-filter: blur(10px); width: 100%; height: 84px;
                " onmouseover="this.style.background='rgba(0,0,0,0.8)'; this.style.borderColor='rgba(255,255,255,0.3)'; this.style.transform='translateY(-2px)';" 
                onmouseout="this.style.background='rgba(0,0,0,0.6)'; this.style.borderColor='rgba(255,255,255,0.2)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px;">${emoji}</div>
                    <span style="flex: 1;">${buttonName}</span>
                </button>
            `;
            
            // Store video data
            window.testimonialVideos[buttonId] = testimonial;
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
                <!-- Header matching action buttons style -->
                <div style="display: flex; align-items: center; margin-bottom: 5px; gap: 15px; margin-top: 5px;">
                    <video autoplay loop muted playsinline style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                        <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1764614255102.mp4" type="video/mp4">
                    </video>
                    <div>
                        <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600; color: white;">Client Testimonials</h3>
                        <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300; letter-spacing: 0.5px;">Real stories from satisfied clients</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: ${gridColumns}; gap: 12px; margin-bottom: 15px;">
                    ${buttonsHTML}
                </div>
                
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
    
    // Add to chat
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        // Use the same positioning as action buttons - NO padding-top
        splashScreen.style.marginTop = '20px'; // Natural spacing like action buttons
        splashScreen.style.marginBottom = '20px';
        chatContainer.appendChild(splashScreen);
        splashScreen.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        console.log('✅ Splash screen added to chat');
    } else {
        console.log('❌ Chat container not found, adding to body');
        document.body.appendChild(splashScreen);
    }
}

// ================================
// 🚨 EMERGENCY SPEECH STOPPER (FROM OLD CODE)
// ================================
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
        if (!media.paused && !media.closest('#testimonial-video-player') && !media.closest('#testimonial-video-overlay')) {
            media.pause();
        }
    });
}

// 🎯 AUTO-STOP AI SPEECH WHEN TESTIMONIAL STARTS - CLEAN VERSION (FROM OLD CODE)
const originalHandleTestimonialButton = window.handleTestimonialButton;
window.handleTestimonialButton = function(buttonId) {
    console.log(`🎬🛑 AUTO-STOP: Stopping AI speech for testimonial`);
    emergencyStopAllSpeech();
    
    // Wait a tiny moment to ensure speech is fully stopped, then play video
    setTimeout(() => {
        window.avatarCurrentlyPlaying = false; // Reset flag
        originalHandleTestimonialButton(buttonId);
    }, 50);
};

// ================================
// 🎯 NEW FUNCTION: Close Video & Show Navigation
// ================================
function closeVideoAndShowNavigation() {
    console.log('🎬 Closing video and showing navigation options');
    
    // 🛑 CRITICAL: Reset playing flag
    window.avatarCurrentlyPlaying = false;
    
    // Remove video overlay
    const overlay = document.getElementById('testimonial-video-overlay');
    if (overlay) {
        const video = overlay.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        overlay.remove();
        console.log('✅ Video player removed');
    }
    
    // Also check for old video player ID
    const oldVideoPlayer = document.getElementById('testimonial-video-player');
    if (oldVideoPlayer) {
        const video = oldVideoPlayer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        oldVideoPlayer.remove();
        console.log('✅ Old video player removed');
    }
    
    // 🎯 SHOW NAVIGATION/DECISION PANEL
    showTestimonialNavigationOptions();
}

// ================================
// 🎯 UPDATED NAVIGATION OPTIONS (DECISION PANEL)
// ================================
function showTestimonialNavigationOptions() {
    console.log('🎯 Showing testimonial decision panel');
    
    // 🛡️ CRITICAL: Cancel any pending decision panel timeouts (FROM OLD CODE)
    if (window.decisionPanelTimeout) {
        clearTimeout(window.decisionPanelTimeout);
        console.log('✅ Cancelled decision panel timeout');
    }
    
    // 🛡️ STRONG PROTECTION: Keep testimonial mode active (FROM OLD CODE)
    window.testimonialSessionActive = true;
    window.testimonialProtectionActive = true;
    window.disableSpeakNowBanner = true;
    
    // Create decision panel
    const navScreen = document.createElement('div');
    navScreen.id = 'testimonial-nav-options';
    navScreen.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
        animation: fadeInSplash 0.3s ease-in;
    `;
    
    navScreen.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #001885ff 0%, #764ba2 100%);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 20px 60px rgba(0,0,0,0.7);
            color: white;
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h2 style="margin-bottom: 30px; font-size: 28px; font-weight: 600;">
                🎬 What would you like to do?
            </h2>
            
            <p style="margin-bottom: 30px; opacity: 0.9; font-size: 16px; line-height: 1.5;">
                Would you like to watch more testimonials or return to the conversation?
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <!-- Continue Watching Button -->
                <button onclick="showMoreTestimonials()" style="
                    background: linear-gradient(135deg, #0f6bd4ff 0%, #04b3eeff 100%);
                    color: white; border: none; padding: 18px 30px;
                    border-radius: 12px; font-size: 18px; font-weight: 600;
                    cursor: pointer; transition: all 0.3s ease;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                ">
                    <span style="font-size: 24px;">📺</span>
                    <span>Continue Watching Testimonials</span>
                </button>
                
                <!-- Return to Chat Button -->
                <button onclick="returnToVoiceChat()" style="
                    background: linear-gradient(135deg, #7700ffff 0%, #001effff 100%);
                    color: white; border: none; padding: 18px 30px;
                    border-radius: 12px; font-size: 18px; font-weight: 600;
                    cursor: pointer; transition: all 0.3s ease;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                ">
                    <span style="font-size: 24px;">🎤</span>
                    <span>Return to Voice Chat</span>
                </button>
            </div>
        </div>
    `;
    
    // Remove any existing nav screen
    const existingNav = document.getElementById('testimonial-nav-options');
    if (existingNav) existingNav.remove();
    
    document.body.appendChild(navScreen);
    
    // Add hover effects
    setTimeout(() => {
        const buttons = navScreen.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.onmouseenter = function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4)';
            };
            btn.onmouseleave = function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            };
        });
    }, 100);
}

// ================================
// 🌀 UNIVERSAL TESTIMONIAL SPINNER
// ================================
function showTestimonialSpinner() {
    const existingSpinner = document.getElementById('testimonial-spinner');
    if (existingSpinner) existingSpinner.remove();
    
    const spinner = document.createElement('div');
    spinner.id = 'testimonial-spinner';
    spinner.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    spinner.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.2);
                        border-radius: 50%; border-top-color: #007AFF;
                        animation: testimonial-spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <div style="font-size: 18px; font-weight: 500; opacity: 0.9;">Loading testimonial...</div>
        </div>
    `;
    
    document.body.appendChild(spinner);
    
    if (!document.getElementById('testimonial-spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'testimonial-spinner-styles';
        style.textContent = `@keyframes testimonial-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
}

function hideTestimonialSpinner() {
    const spinner = document.getElementById('testimonial-spinner');
    if (spinner) {
        spinner.style.opacity = '0';
        spinner.style.transition = 'opacity 0.3s ease';
        setTimeout(() => spinner.remove(), 300);
    }
}

// ================================
// 🎬 VIDEO PLAYER (ENHANCED)
// ================================
function playTestimonialVideo(buttonId) {
    console.log(`🎬 Playing testimonial: ${buttonId}`);
    
    if (!window.testimonialVideos || !window.testimonialVideos[buttonId]) {
        console.error('❌ Video data not found for:', buttonId);
        return;
    }
    
    const testimonial = window.testimonialVideos[buttonId];
    const videoUrl = testimonial.videoUrl;
    
    if (!videoUrl) {
        console.error('❌ No video URL for testimonial');
        return;
    }

    // Line 23-26 FIRST (check):
if (window.avatarCurrentlyPlaying) {
    console.log('🚫 Video already playing - skipping');
    return;
}
    
    // 🛡️ ULTRA-STRONG PROTECTION (FROM OLD CODE)
    window.testimonialSessionActive = true;
    window.testimonialProtectionActive = true;
    window.disableSpeakNowBanner = true;
    window.avatarCurrentlyPlaying = true;
    
    // 🌀 SHOW SPINNER
    showTestimonialSpinner();
    
    // Remove splash screen
    const splashScreen = document.getElementById('testimonial-splash-screen');
    if (splashScreen) splashScreen.remove();
    
    // Create video overlay - USE BOTH IDs FOR COMPATIBILITY
    const overlay = document.createElement('div');
    overlay.id = 'testimonial-video-overlay';
    overlay.className = 'testimonial-video-player'; // Also add class for old code compatibility
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
        animation: fadeInSplash 0.5s ease-in;
    `;
    
    const testimonialTitles = {
        skeptical: 'Skeptical Client Testimonial',
        speed: 'Speed Results Testimonial', 
        convinced: 'Convinced Client Testimonial',
        excited: 'Excited Results Testimonial'
    };
    
    const title = testimonial.title || testimonialTitles[testimonial.concernType] || 'Client Testimonial';
    
    overlay.innerHTML = `
        <!-- Header -->
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
                    <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600; color: white;">${title}</h3>
                    <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300; letter-spacing: 0.5px;">Real story from a satisfied client</p>
                </div>
            </div>
        </div>
        
        <!-- Video Player -->
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
            max-width: 90%;
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
            <button onclick="emergencyStopAllSpeech(); closeTestimonialVideo()" class="testimonial-close-btn" style="
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
    
    document.body.appendChild(overlay);
    
    // 🌀 HIDE SPINNER when video is loaded
    setTimeout(() => {
        hideTestimonialSpinner();
        const video = document.getElementById('testimonialVideo');
        if (video) {
            video.play().catch(e => {
                console.error('❌ Video play failed:', e);
                hideTestimonialSpinner();
            });
            
            // ✅ SAFE EVENT LISTENERS - PREVENT DOUBLE CALLS (FROM OLD CODE)
            let videoEnded = false;
            
            video.addEventListener('ended', function() {
                if (!videoEnded) {
                    videoEnded = true;
                    console.log('✅ Video ended naturally - showing navigation');
                    window.avatarCurrentlyPlaying = false;
                    closeTestimonialVideo();
                }
            });
            
            video.addEventListener('error', function(e) {
                if (!videoEnded) {
                    videoEnded = true;
                    console.error('❌ Video error - safe close:', e);
                    window.avatarCurrentlyPlaying = false;
                    hideTestimonialSpinner();
                }
            });
        }
    }, 100);
}

// ================================
// 🎬 BUTTON HANDLERS
// ================================
function handleTestimonialButton(buttonId) {
    console.log(`🎬 Button clicked: ${buttonId}`);
    
    // Reset flags
    window.avatarCurrentlyPlaying = false;
    
    // Get testimonial data
    const testimonial = window.testimonialVideos[buttonId];
    if (!testimonial) {
        console.error('❌ No testimonial data for:', buttonId);
        console.log('Available testimonials:', window.testimonialVideos);
        return;
    }
    
    console.log('📊 Testimonial data:', {
        title: testimonial.title,
        hasVideoUrl: !!testimonial.videoUrl,
        videoUrl: testimonial.videoUrl ? testimonial.videoUrl.substring(0, 50) + '...' : 'none'
    });
    
    // 🎯 USE OUR NEW FUNCTION
    if (typeof window.playTestimonialVideoWithOverlay === 'function') {
        console.log('✅ Calling playTestimonialVideoWithOverlay()');
        window.playTestimonialVideoWithOverlay(testimonial);
    } else {
        console.log('Using built-in player...');
        playTestimonialVideo(buttonId);
    }
}

function handleTestimonialSkip() {
    console.log('⏭️ Skipping testimonials - returning to voice chat');
    returnToVoiceChat();
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
    
    // 🎯 REMOVE THE VIDEO PLAYER
    const videoOverlay = document.getElementById('testimonial-video-overlay');
    if (videoOverlay) {
        // Stop any playing video first
        const video = videoOverlay.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        // Remove the overlay
        videoOverlay.remove();
        console.log('✅ Video player removed');
    }
    
    // Also check for any other video player IDs
    const videoPlayer = document.getElementById('testimonial-video-player');
    if (videoPlayer) {
        const video = videoPlayer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        videoPlayer.remove();
        console.log('✅ Alternative video player removed');
    }
    
    // Hide spinner if it's showing
    hideTestimonialSpinner();
    
    // 🎯 SHOW NAVIGATION/DECISION PANEL
    showTestimonialNavigationOptions();
    console.log('✅ Navigation options shown');
}

// ================================
// 🎯 RETURN TO VOICE CHAT (OPTION B - NATURAL FLOW)
// ================================
function returnToVoiceChat() {
    console.log('🎯🎯🎯 RETURN TO VOICE CHAT CLICKED 🎯🎯🎯');

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    console.log(`📱 Device: ${isMobile ? 'Mobile' : 'Desktop'}`);

    // 1. STOP ALL SPEECH FIRST
    emergencyStopAllSpeech();
    console.log('✅ All speech stopped');

    // 2. Play the "Fantastic!" message
    const fantasticMessage = "Fantastic! Let's return to voice chat where we can continue our conversation seamlessly.";
    console.log(`🔊 Playing message: "${fantasticMessage}"`);
    
    // Speak the message
    window.speakText(fantasticMessage).then(() => {
        console.log('✅ "Fantastic!" message completed');
    }).catch(error => {
        console.error('❌ Error playing message:', error);
    });

    // 3. Wait 2 seconds, then open Action Center WHILE message is still playing
    setTimeout(() => {
        console.log('⏰ 2 seconds passed - opening Action Center');
        const opened = window.showCommunicationActionCenter('consultation');
        if (opened) {
            console.log('✅ Action Center opened successfully');
        } else {
            console.log('❌ Action Center failed to open');
        }
    }, 2000);

    // 4. Wait 5 more seconds for demonstration
    setTimeout(() => {
        console.log('✅ Voice chat return flow complete');
    }, 7000);
}

function showMoreTestimonials() {
    console.log('🎯 User chose: Watch more testimonials');
    
    // Hide navigation screen
    const navScreen = document.getElementById('testimonial-nav-options');
    if (navScreen) navScreen.style.display = 'none';
    
    // Reset playing flag
    window.avatarCurrentlyPlaying = false;
    
    // Wait a moment, then show splash screen again
    setTimeout(() => {
        showTestimonialSplashScreen();
    }, 200);
}

// ================================
// 🎬 EMOJI HELPER
// ================================
function getEmojiForTestimonial(testimonial) {
    const concern = testimonial.concernType || '';
    const title = testimonial.title || '';
    const text = concern + title;
    
    if (text.includes('price') || text.includes('cost') || text.includes('expensive')) return '💰';
    if (text.includes('time') || text.includes('speed') || text.includes('fast') || text.includes('quick')) return '⚡';
    if (text.includes('trust') || text.includes('skeptical') || text.includes('doubt')) return '🤔';
    if (text.includes('result') || text.includes('success') || text.includes('improve')) return '📈';
    if (text.includes('conversion') || text.includes('increase') || text.includes('growth')) return '🚀';
    if (text.includes('happy') || text.includes('satisfied') || text.includes('love')) return '😊';
    if (text.includes('excited') || text.includes('amazing') || text.includes('wow')) return '🎉';
    return '🎬';
}

// ============================================
// 🎓 INFORMATIONAL VIDEO SYSTEM
// ============================================

// 🆕 ADD THIS FUNCTION
function showInformationalVideos() {
    console.log('🎓 Loading informational videos...');
    
    // 🛡️ PROTECTION: Block voice system during videos
    window.testimonialSessionActive = true;
    
    // Check if we have informational videos
    if (!window.testimonialData || !window.testimonialData.testimonialGroups || 
        !window.testimonialData.testimonialGroups.informational) {
        console.error('❌ No informational videos found in data');
        // Fallback to regular testimonials
        showTestimonialSplashScreen();
        return;
    }
    
    const infoGroup = window.testimonialData.testimonialGroups.informational;
    console.log('📚 Found informational group:', infoGroup.title, 'with', infoGroup.videos.length, 'videos');
    
    // Store original data temporarily
    if (!window.originalTestimonialData) {
        window.originalTestimonialData = window.testimonialData;
    }
    
    // Create filtered data with ONLY informational videos
    const filteredData = {
        testimonialGroups: {
            informational: infoGroup
        }
    };
    
    // Temporarily replace global data
    window.tempTestimonialData = window.testimonialData;
    window.testimonialData = filteredData;
    window.currentVideoMode = 'informational';
    
    // Show the splash screen
    showTestimonialSplashScreen(true);
    
    // Restore original data after video session ends
    setTimeout(() => {
        if (window.tempTestimonialData) {
            window.testimonialData = window.tempTestimonialData;
            delete window.tempTestimonialData;
            console.log('✅ Restored original testimonial data');
        }
    }, 5000);
}

// 🆕 ADD THIS FUNCTION (for styling)
function applyInformationalStyling() {
    const splashScreen = document.getElementById('testimonial-splash-screen');
    if (!splashScreen) return;
    
    // Update header
    const header = splashScreen.querySelector('h3');
    const subheader = splashScreen.querySelector('p');
    
    if (header) {
        header.textContent = '📚 How It Works';
        header.style.color = '#4FC3F7';
    }
    
    if (subheader) {
        subheader.textContent = 'Watch our explainer videos';
    }
    
    // Update buttons with durations
    const buttons = splashScreen.querySelectorAll('button[id^="testimonial_"]');
    buttons.forEach((button, index) => {
        const infoGroup = window.testimonialData?.testimonialGroups?.informational;
        if (infoGroup && infoGroup.videos && infoGroup.videos[index]) {
            const video = infoGroup.videos[index];
            const emoji = video.emoji || '📹';
            const duration = video.duration ? ` (${video.duration})` : '';
            
            button.innerHTML = `
                <div style="font-size: 28px;">${emoji}</div>
                <div style="flex: 1; text-align: left;">
                    <div style="font-weight: 600; font-size: 17px;">${video.title}</div>
                    <div style="font-size: 13px; opacity: 0.8; margin-top: 2px;">${video.description}${duration}</div>
                </div>
            `;
        }
    });
}

// 🆕 MODIFY THE SPLASH SCREEN FUNCTION
// Find the existing showTestimonialSplashScreen function and ADD this at the beginning:
window.originalShowTestimonialSplashScreen = window.showTestimonialSplashScreen;

window.showTestimonialSplashScreen = function(isInformational = false) {
    console.log('🎬 Showing video selection (mode:', isInformational ? 'Informational' : 'Testimonial', ')');
    
    window.currentVideoMode = isInformational ? 'informational' : 'testimonial';
    window.originalShowTestimonialSplashScreen();
    
    if (isInformational) {
        setTimeout(() => {
            applyInformationalStyling();
        }, 100);
    }
};

// ================================
// 🎬 INITIALIZE THE SYSTEM
// ================================
function initializeTestimonialSystem() {
    console.log('✅ Testimonial system initialized');
    
    // Add CSS animations if not already present
    if (!document.getElementById('testimonial-animations')) {
        const style = document.createElement('style');
        style.id = 'testimonial-animations';
        style.textContent = `
            @keyframes fadeIn {
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
}

// ================================
// 🎯 CONSULTATION RESPONSE HANDLER (ADD THIS TO YOUR testimonialplayer.js)
// ================================
function handleConsultationResponse(userInput) {
    // 🛡️ PROTECTION: Don't handle if we're already processing
    if (window.consultationResponseProcessed) {
        console.log('🛡️ Consultation response already processed - skipping');
        return false;
    }
    
    console.log('🎯 Checking consultation response:', userInput);
    
    const positiveResponses = [
        'yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'absolutely', 'definitely',
        'of course', 'why not', 'let\'s do it', 'i\'m interested', 'interested',
        'yes please', 'please', 'go ahead', 'continue', 'proceed', 'do it'
    ];
    
    const userInputLower = userInput.toLowerCase().trim();
    
    // Check if this is a positive response to consultation offer
    const isConsultationContext = window.expectingConsultationResponse || window.consultationQuestionActive;
    
    if (isConsultationContext) {
        // Clean the text: remove punctuation, keep words
        const cleanText = userInputLower
            .replace(/[^\w\s]/g, ' ')  // Replace punctuation with spaces
            .replace(/\s+/g, ' ')      // Collapse multiple spaces
            .trim();                   // Trim edges
        
        console.log('🧹 Cleaned text:', cleanText);
        
        // Split into individual words
        const words = cleanText.split(' ');
        
        // Check EACH WORD against positive responses
        let hasPositiveResponse = false;
        
        for (const word of words) {
            for (const response of positiveResponses) {
                // Check if response matches or contains the word
                if (word === response || 
                    response.includes(word) || 
                    word.includes(response)) {
                    hasPositiveResponse = true;
                    console.log(`✅ Word "${word}" matches response "${response}"`);
                    break;
                }
            }
            if (hasPositiveResponse) break;
        }
        
        // Also check multi-word responses
        if (!hasPositiveResponse) {
            for (const response of positiveResponses) {
                if (cleanText.includes(response)) {
                    hasPositiveResponse = true;
                    console.log(`✅ Multi-word match: "${response}" in "${cleanText}"`);
                    break;
                }
            }
        }
        
        if (hasPositiveResponse) {
            console.log('🎯 POSITIVE CONSULTATION RESPONSE DETECTED - Triggering action panel');
            
            // Reset the flags
            window.expectingConsultationResponse = false;
            window.consultationQuestionActive = false;
            
            // 🚨 CRITICAL: Clear testimonial flags so we don't loop back
            window.testimonialSessionActive = false;
            window.isInTestimonialMode = false;
            
            // Trigger action panel
            setTimeout(() => {
                console.log('🎯 Triggering Communication Center...');
                
                // DIRECT METHOD: Use the function we KNOW works
                if (typeof window.showCommunicationRelayCenter === 'function') {
                    window.showCommunicationRelayCenter();
                    console.log('✅ showCommunicationRelayCenter() called directly');
                    return;
                }
                
                console.error('❌ No action center function found');
            }, 500);
            
            return true; // Handled
        }
    }
    
    return false; // Not a consultation response
}

// ================================
// GLOBAL EXPORTS - COMPLETE SET
// ================================

// 1. CORE TESTIMONIAL FUNCTIONS
window.showTestimonialSplashScreen = showTestimonialSplashScreen;
window.closeVideoAndShowNavigation = closeVideoAndShowNavigation;
window.playTestimonialVideo = playTestimonialVideo;
window.handleTestimonialButton = handleTestimonialButton;
window.handleTestimonialSkip = handleTestimonialSkip;
window.closeTestimonialVideo = closeTestimonialVideo;
window.skipTestimonials = handleTestimonialSkip; // Alias for compatibility

// 2. NAVIGATION FUNCTIONS (MISSING IN MINIMAL VERSION)
window.showTestimonialNavigationOptions = showTestimonialNavigationOptions;
window.returnToVoiceChat = returnToVoiceChat;
window.showMoreTestimonials = showMoreTestimonials;

// 3. UTILITY FUNCTIONS
window.getEmojiForTestimonial = getEmojiForTestimonial;
window.showTestimonialSpinner = showTestimonialSpinner;
window.hideTestimonialSpinner = hideTestimonialSpinner;
window.handleConsultationResponse = handleConsultationResponse;

// 4. STATE FLAGS
window.avatarCurrentlyPlaying = false;
window.testimonialSessionActive = false;

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTestimonialSystem);
} else {
    initializeTestimonialSystem();
}

console.log('✅ COMPLETE Testimonial Player Loaded - All functions restored!');