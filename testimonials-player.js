// ===================================================
// 🎬 MINIMAL WORKING TESTIMONIAL PLAYER
// ===================================================

window.avatarCurrentlyPlaying = false;

// SIMPLE TESTIMONIAL PLAYER THAT WORKS
function showTestimonialSplashScreen() {
    console.log('🎬 Creating testimonial splash screen...');
    
    // Check if we have testimonial data
    if (!window.testimonialData || !window.testimonialData.testimonialGroups) {
        console.error('❌ No testimonial data found');
        return;
    }
    
    const groups = window.testimonialData.testimonialGroups;
    console.log('📊 Found groups:', Object.keys(groups));
    
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
                <button onclick="playTestimonialVideo('${buttonId}')" 
                        data-video-url="${testimonial.videoUrl || ''}"
                        style="
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2);
                    color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer;
                    font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease;
                    backdrop-filter: blur(10px); width: 100%; height: 84px;
                ">
                    <div style="font-size: 28px;">${emoji}</div>
                    <span style="flex: 1;">${buttonName}</span>
                </button>
            `;
            
            // Store video data
            if (!window.testimonialVideos) window.testimonialVideos = {};
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
                <div style="display: flex; align-items: center; margin-bottom: 20px; gap: 15px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: #007AFF; 
                                display: flex; align-items: center; justify-content: center; font-size: 28px;">
                        🎬
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; font-size: 22px;">Client Testimonials</h3>
                        <p style="margin: 0; opacity: 0.8; font-size: 13px;">Real stories from satisfied clients</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: ${gridColumns}; gap: 12px; margin-bottom: 15px;">
                    ${buttonsHTML}
                </div>
                
                <button onclick="skipTestimonials()" style="
                    display: flex; align-items: center; gap: 10px;
                    background: rgba(0,0,0,0.6); color: rgba(255,255,255,0.8);
                    border: 1px solid rgba(255,255,255,0.2); padding: 15px 20px;
                    border-radius: 10px; cursor: pointer; font-size: 16px; width: 100%;
                    justify-content: center; margin-top: 5px;
                ">
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

// SIMPLE VIDEO PLAYER
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
        alert('No video available for this testimonial');
        return;
    }
    
    console.log('🎬 Video URL:', videoUrl);
    
    // Set playing flag
    window.avatarCurrentlyPlaying = true;
    
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
        justify-content: center;
        align-items: center;
    `;
    
    overlay.innerHTML = `
        <div style="position: relative; max-width: 800px; width: 90%;">
            <video id="testimonial-video" controls autoplay style="width: 100%; border-radius: 10px;">
                <source src="${videoUrl}" type="video/mp4">
            </video>
            <button onclick="closeTestimonialVideo()" style="
                position: absolute; top: 10px; right: 10px;
                background: rgba(0,0,0,0.7); color: white;
                border: none; border-radius: 50%; width: 40px; height: 40px;
                font-size: 20px; cursor: pointer;
            ">✕</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Play video
    setTimeout(() => {
        const video = document.getElementById('testimonial-video');
        if (video) video.play().catch(e => {
            console.error('❌ Video play failed:', e);
            alert('Could not play video. Please check the URL.');
        });
    }, 100);
}

// CLOSE VIDEO
function closeTestimonialVideo() {
    console.log('🎬 Closing video');
    
    window.avatarCurrentlyPlaying = false;
    
    const overlay = document.getElementById('testimonial-video-overlay');
    if (overlay) {
        const video = overlay.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        overlay.remove();
    }
}

// SKIP TESTIMONIALS
function skipTestimonials() {
    console.log('⏭️ Skipping testimonials');
    
    const splash = document.getElementById('testimonial-splash-screen');
    if (splash) splash.remove();
    
    window.avatarCurrentlyPlaying = false;
    
    // Return to voice chat
    console.log('🎤 Returning to voice chat...');
}

// EMOJI HELPER
function getEmojiForTestimonial(testimonial) {
    const concern = testimonial.concernType || '';
    if (concern.includes('price') || concern.includes('cost')) return '💰';
    if (concern.includes('time') || concern.includes('speed')) return '⏰';
    if (concern.includes('trust')) return '🤝';
    if (concern.includes('result')) return '📈';
    if (concern.includes('conversion')) return '🚀';
    return '🎬';
}

// MAKE FUNCTIONS GLOBAL
window.showTestimonialSplashScreen = showTestimonialSplashScreen;
window.playTestimonialVideo = playTestimonialVideo;
window.closeTestimonialVideo = closeTestimonialVideo;
window.skipTestimonials = skipTestimonials;

console.log('✅ MINIMAL Testimonial Player Loaded!');