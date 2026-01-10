// ===================================================
// 🎬 COMPLETE TESTIMONIAL SYSTEM WITH NEW FORMAT
// ===================================================

window.avatarCurrentlyPlaying = false;
window.testimonialSessionActive = false;
window.testimonialVideos = {};

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
    
    // Create container
    const splashScreen = document.createElement('div');
    splashScreen.id = 'testimonial-splash-screen';
    splashScreen.style.cssText = `
        margin: 20px 0;
        animation: fadeIn 0.5s ease-in;
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
                background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9));
                border-radius: 20px;
                padding: 30px 25px;
                color: white;
                font-family: 'Segoe UI', sans-serif;
                max-width: 750px;
            ">
                <!-- Header matching action buttons style -->
                <div style="display: flex; align-items: center; margin-bottom: 20px; gap: 15px;">
                    <video autoplay loop muted playsinline style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2);">
                        <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1764614255102.mp4" type="video/mp4">
                    </video>
                    <div>
                        <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600;">Client Testimonials</h3>
                        <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300;">Real stories from satisfied clients</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: ${gridColumns}; gap: 12px; margin-bottom: 15px;">
                    ${buttonsHTML}
                </div>
                
                <button onclick="handleTestimonialSkip()" style="
                    display: flex; align-items: center; gap: 10px;
                    background: rgba(0,0,0,0.6); color: rgba(255,255,255,0.8);
                    border: 1px solid rgba(255,255,255,0.2); padding: 15px 20px;
                    border-radius: 10px; cursor: pointer; font-size: 16px; width: 100%;
                    justify-content: center; margin-top: 5px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(0,0,0,0.8)'; this.style.color='white';" 
                onmouseout="this.style.background='rgba(0,0,0,0.6)'; this.style.color='rgba(255,255,255,0.8)';">
                    <span>⏭️ Skip Testimonials</span>
                </button>
            </div>
        `;
    }
    
    // Add to chat
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(splashScreen);
        splashScreen.scrollIntoView({ behavior: 'smooth' });
        console.log('✅ Splash screen added to chat');
    } else {
        console.log('❌ Chat container not found, adding to body');
        document.body.appendChild(splashScreen);
    }
}

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
    
    // 🎯 SHOW NAVIGATION/DECISION PANEL
    showTestimonialNavigationOptions();
}

// ================================
// 🎯 UPDATED NAVIGATION OPTIONS (DECISION PANEL)
// ================================
function showTestimonialNavigationOptions() {
    console.log('🎯 Showing testimonial decision panel');
    
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
        animation: fadeIn 0.3s ease-in;
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
    
    // 🛡️ ULTRA-STRONG PROTECTION
    window.testimonialSessionActive = true;
    window.avatarCurrentlyPlaying = true;
    
    // 🌀 SHOW SPINNER
    showTestimonialSpinner();
    
    // Remove splash screen
    const splashScreen = document.getElementById('testimonial-splash-screen');
    if (splashScreen) splashScreen.remove();
    
    // Create video overlay
    const overlay = document.createElement('div');
    overlay.id = 'testimonial-video-overlay';
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
        animation: fadeIn 0.5s ease-in;
    `;
    
    overlay.innerHTML = `
        <!-- Header -->
        <div style="
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9));
            border-radius: 20px;
            padding: 20px 25px;
            margin-bottom: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            color: white;
            font-family: 'Segoe UI', sans-serif;
            max-width: 854px;
            width: 100%;
        ">
            <div style="display: flex; align-items: center; gap: 15px;">
                <video autoplay loop muted playsinline style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2);">
                    <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1764614255102.mp4" type="video/mp4">
                </video>
                <div>
                    <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600;">${testimonial.title || 'Client Testimonial'}</h3>
                    <p style="margin: 0; opacity: 0.8; font-size: 13px;">Real story from a satisfied client</p>
                </div>
            </div>
        </div>
        
        <!-- Video Player -->
        <div style="position: relative; width: 854px; max-width: 90%;">
            <video id="testimonial-video" controls autoplay style="width: 100%; border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,0.7);">
                <source src="${videoUrl}" type="video/mp4">
            </video>
            
            <!-- Close Button -->
            <button onclick="closeTestimonialVideo()" style="
                position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
                padding: 12px 32px; background: rgba(0,0,0,0.6); color: white;
                border: 1px solid rgba(255,255,255,0.2); border-radius: 25px;
                font-size: 14px; font-weight: 600; cursor: pointer; backdrop-filter: blur(10px);
                transition: all 0.3s ease; z-index: 10001;
            " onmouseover="this.style.background='rgba(0,0,0,0.8)'; this.style.borderColor='rgba(255,255,255,0.3)';" 
            onmouseout="this.style.background='rgba(0,0,0,0.6)'; this.style.borderColor='rgba(255,255,255,0.2)';">
                ✕ Close & Continue
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 🌀 HIDE SPINNER when video loads
    setTimeout(() => {
        hideTestimonialSpinner();
        const video = document.getElementById('testimonial-video');
        if (video) video.play().catch(e => {
            console.error('❌ Video play failed:', e);
            hideTestimonialSpinner();
        });
    }, 100);
    
    // Handle video end
    setTimeout(() => {
        const video = document.getElementById('testimonial-video');
        if (video) {
            video.addEventListener('ended', function() {
                console.log('✅ Video ended - showing navigation');
                closeTestimonialVideo();
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
        console.error('❌ playTestimonialVideoWithOverlay not available');
        console.log('Falling back to old player...');
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
// 🎯 NAVIGATION OPTIONS (MISSING FROM MINIMAL VERSION)
// ================================
function showTestimonialNavigationOptions() {
    console.log('🎯 Showing testimonial navigation options');
    
    // Create navigation screen
    const navScreen = document.createElement('div');
    navScreen.id = 'testimonial-nav-options';
    navScreen.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    navScreen.innerHTML = `
        <div style="
            background: linear-gradient(135deg, rgba(0,24,133,0.9) 0%, rgba(118,75,162,0.9) 100%);
            padding: 30px;
            border-radius: 15px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            color: white;
            max-width: 500px;
            width: 90%;
        ">
            <h2 style="margin-bottom: 25px; font-size: 24px; text-align: center;">🎬 What would you like to do next?</h2>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button onclick="showMoreTestimonials()" style="
                    background: linear-gradient(135deg, rgba(15,107,212,0.9) 0%, rgba(4,179,238,0.9) 100%);
                    color: white; border: none; padding: 15px; border-radius: 10px;
                    font-size: 16px; cursor: pointer; transition: all 0.3s ease;
                    font-weight: 500;
                ">
                    📺 Watch More Testimonials
                </button>
                
                <button onclick="returnToVoiceChat()" style="
                    background: linear-gradient(135deg, rgba(119,0,255,0.9) 0%, rgba(0,30,255,0.9) 100%);
                    color: white; border: none; padding: 15px; border-radius: 10px;
                    font-size: 16px; cursor: pointer; transition: all 0.3s ease;
                    font-weight: 500;
                ">
                    🎤 Return to Voice Chat
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
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
            };
            btn.onmouseleave = function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            };
        });
    }, 100);
}

function returnToVoiceChat() {
    console.log('🎯🎯🎯 RETURN TO VOICE CHAT 🎯🎯🎯');
    
    // Remove all testimonial elements
    const elementsToRemove = [
        'testimonial-nav-options',
        'testimonial-splash-screen',
        'testimonial-video-overlay'
    ];
    
    elementsToRemove.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.remove();
    });
    
    // Reset flags
    window.avatarCurrentlyPlaying = false;
    window.testimonialSessionActive = false;
    
    console.log('✅ Testimonial system closed - ready for voice chat');
    
   // Trigger consultation offer or return to main flow
setTimeout(() => {
    console.log('🔄 Looking for post-testimonial function...');
    
    // Try our new function first
    if (typeof window.triggerPostTestimonialSpeech === 'function') {
        console.log('✅ Found triggerPostTestimonialSpeech');
        window.triggerPostTestimonialSpeech();
    }
    // Try AI system continuation
    else if (typeof window.continueConversation === 'function') {
        console.log('✅ Found continueConversation');
        window.continueConversation();
    }
    // Try MobileWise AI specific function
    else if (typeof window.mobilewiseContinueAfterTestimonial === 'function') {
        console.log('✅ Found mobilewiseContinueAfterTestimonial');
        window.mobilewiseContinueAfterTestimonial();
    }
    // Last resort: show banner
    else {
        console.log('⚠️ No post-testimonial function found - showing banner');
        if (typeof window.showDirectSpeakNow === 'function') {
            window.showDirectSpeakNow();
        } else {
            console.error('❌ No fallback available');
        }
    }
}, 500);
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