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
            <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1762037335280.mp4" type="video/mp4">
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

// ================================
// 🎬 VIDEO PLAYER (16:9 CONTAINER) - FIXED VERSION
// ================================
function playTestimonialVideo(testimonialType) {
    console.log(`🎬 Playing ${testimonialType} testimonial`);
    
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
        return;
    }
    
    const videoDuration = VIDEO_DURATIONS[testimonialType] || 20000;
    
    // Remove splash screen first
    const splashScreen = document.getElementById('testimonial-splash-screen');
    if (splashScreen) {
        splashScreen.remove();
    }
    
    // Create the 16:9 video container (MATCHES YOUR SPLASH SCREEN STYLING)
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
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
        animation: fadeInSplash 0.5s ease-in;
    `;
    
    videoOverlay.innerHTML = `
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
            
            <!-- Close Button - Matches Your Splash Screen Styling -->
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
    
    // ✅ FIX: Wait for video element to be in DOM, then add event listeners
    setTimeout(() => {
        const video = document.getElementById('testimonialVideo');
        if (video) {
            // Handle video end
            video.addEventListener('ended', function() {
                console.log('✅ Video ended naturally');
                closeTestimonialVideo();
                
                // Resume conversation after video ends
                if (typeof window.handleTestimonialComplete === 'function') {
                    window.handleTestimonialComplete();
                }
            });

            // Handle video errors
            video.addEventListener('error', function(e) {
                console.error('❌ Video error:', e);
                closeTestimonialVideo();
            });
        } else {
            console.error('❌ Video element not found for event listeners');
        }
    }, 100);
    
    // Click outside to close
    videoOverlay.addEventListener('click', function(e) {
        if (e.target === videoOverlay) {
            closeTestimonialVideo();
        }
    });
    
    // Auto-close after video duration
    setTimeout(() => {
        if (document.getElementById('testimonial-video-player')) {
            closeTestimonialVideo();
        }
    }, videoDuration);
}

// ================================
// 🎬 BUTTON HANDLERS - ADD THESE BACK
// ================================
function handleTestimonialButton(testimonialType) {
    console.log(`🎬 Button clicked: ${testimonialType}`);
    playTestimonialVideo(testimonialType);
}

function handleTestimonialSkip() {
    console.log('⏭️ Skipping testimonials');
    const splashScreen = document.getElementById('testimonial-splash-screen');
    if (splashScreen) {
        splashScreen.remove();
    }

     // 🛡️ CLEAR PROTECTION FLAG
    window.testimonialSessionActive = false;
    console.log('🛡️ Testimonial protection deactivated');
    
    // Continue with conversation
    if (typeof window.handleTestimonialComplete === 'function') {
        window.handleTestimonialComplete();
    }
}

// NEW CODE - Replace the close functionality:
function closeTestimonialVideo() {
    console.log('🎬 Closing testimonial video - showing navigation options');
    
    // First, hide the video player
    const videoPlayer = document.getElementById('testimonial-video-player');
    const videoOverlay = document.getElementById('testimonial-video-overlay');
    
    if (videoPlayer) {
        videoPlayer.style.display = 'none';
        // Stop the video
        const video = videoPlayer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }
    
    if (videoOverlay) {
        videoOverlay.style.display = 'none';
    }
    
    // 🛡️ COMPLETE Deactivation of testimonial protection
    window.testimonialSessionActive = false;
    window.testimonialProtectionActive = false; // Add this
    console.log('🛡️🛡️ DOUBLE Testimonial protection deactivated');
    
    // 🎯 SHOW NAVIGATION OPTIONS SCREEN instead of closing everything
    showTestimonialNavigationOptions();
}

function showMoreTestimonials() {
    console.log('🎯 User chose: Watch more testimonials');
    
    // Hide navigation screen
    const navScreen = document.getElementById('testimonial-nav-options');
    if (navScreen) {
        navScreen.style.display = 'none';
    }
    
    // COMPLETELY deactivate protection temporarily
    window.testimonialSessionActive = false;
    window.testimonialProtectionActive = false;
    
    // Wait a moment, then show splash screen
    setTimeout(() => {
        // Show the testimonial splash screen again
        showTestimonialSplashScreen();
        
        // Reactivate protection for the new session
        setTimeout(() => {
            window.testimonialSessionActive = true;
            window.testimonialProtectionActive = true;
        }, 100);
    }, 200);
}

// ✅ FIXED: Use event delegation for dynamically created close button
document.addEventListener('click', function(e) {
    // Check if the clicked element OR any of its parents have the close button class
    if (e.target.closest('.testimonial-close-btn') || 
        e.target.closest('.close-testimonial') ||
        e.target.closest('.video-close-btn')) {
        closeTestimonialVideo();
    }
});

// Also add this to handle the close button when the video player is created
function setupTestimonialCloseButton() {
    const closeBtn = document.querySelector('.testimonial-close-btn, .close-testimonial, .video-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTestimonialVideo);
    }
}

// Call this whenever you create a new video player
// Add this to your playTestimonialVideo function:
function playTestimonialVideo(testimonialType) {
    // Your existing video creation code...
    
    // AFTER creating the video player, set up the close button
    setTimeout(setupTestimonialCloseButton, 100);
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
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                    max-width: 500px;
                    width: 90%;
                ">
                    <h2 style="margin-bottom: 30px; font-size: 28px;">🎬 What would you like to do?</h2>
                    
                    <div class="nav-buttons" style="display: flex; flex-direction: column; gap: 15px;">
                        <button onclick="showMoreTestimonials()" class="nav-btn" style="
                            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
                            background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
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
                        
                        <button onclick="closeTestimonialNav()" class="nav-btn" style="
                            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                            color: white;
                            border: none;
                            padding: 15px 30px;
                            border-radius: 10px;
                            font-size: 18px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            ❌ Skip All Testimonials
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
    console.log('🎯 User chose: Return to voice chat');
    
    // COMPLETELY deactivate testimonial protection
    window.testimonialSessionActive = false;
    window.testimonialProtectionActive = false; // Add this line
    
    console.log('🛡️🛡️ DOUBLE Testimonial protection deactivated');
    
    // Hide navigation screen
    const navScreen = document.getElementById('testimonial-nav-options');
    if (navScreen) {
        navScreen.style.display = 'none';
    }
    
    // Hide any remaining testimonial elements
    const videoOverlay = document.getElementById('testimonial-video-overlay');
    const splashScreen = document.getElementById('testimonial-splash-screen');
    
    if (videoOverlay) videoOverlay.style.display = 'none';
    if (splashScreen) splashScreen.style.display = 'none';
    
    // IMPORTANT: Clear any cooldowns that might block voice chat
    if (window.cooldownActive !== undefined) {
        window.cooldownActive = false;
        console.log('🛡️ Cooldown cleared for voice chat');
    }
    
    // Wait a moment for DOM to update, then trigger voice chat
    setTimeout(() => {
        console.log('🎤 Activating voice chat system...');
        
        // Trigger the specific speech
        triggerPostTestimonialSpeech();
        
        // Ensure voice chat system is fully activated
        activateVoiceChatSystem();
        
    }, 300);
}

function triggerPostTestimonialSpeech() {
    console.log('🗣️ Playing post-testimonial speech');
    
    // Use your existing speech system to say the specific phrase
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
    } else {
        // Fallback activation
        showMainInterface();
        initializeVoiceRecognition();
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
    console.log('✅ Testimonial system initialized');
}

// ================================
// GLOBAL EXPORTS - TESTIMONIAL SYSTEM
// ================================
window.handleTestimonialButton = handleTestimonialButton;
window.showTestimonialSplashScreen = showTestimonialSplashScreen;
window.handleTestimonialSkip = handleTestimonialSkip;
window.hideTestimonialSplash = hideTestimonialSplash;
window.avatarCurrentlyPlaying = false;

// ✅ USE THIS - It's the safest approach:
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTestimonialSystem);
} else {
    initializeTestimonialSystem();
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.testimonial-close-btn')) {
        closeTestimonialVideo();
    }
});

console.log('✅ Testimonials Player Loaded - Ready for concerns!');