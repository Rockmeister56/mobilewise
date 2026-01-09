// ===================================================
// 🎬 COMPLETE TESTIMONIAL SYSTEM (SPLASH + VIDEO PLAYERS)
// ===================================================

window.avatarCurrentlyPlaying = false;

// ================================
// 🎬 UPDATED: DYNAMIC SPLASH SCREEN FOR YOUR ACTUAL DATA STRUCTURE
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
    
    // Try to get testimonials from your actual structure
    const testimonials = extractTestimonialsFromYourData();
    
    if (testimonials.length > 0) {
        createDynamicSplashScreen(splashScreen, testimonials);
    } else {
        console.error('❌ No testimonials found! Using fallback buttons.');
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

// EXTRACT TESTIMONIALS FROM YOUR ACTUAL DATA STRUCTURE
function extractTestimonialsFromYourData() {
    console.log('🔍 Extracting testimonials from your data structure...');
    
    if (!window.testimonialData) {
        console.log('❌ No testimonialData found');
        return [];
    }
    
    const data = window.testimonialData;
    let testimonials = [];
    
    // YOUR STRUCTURE: data.testimonialGroups contains the groups
    if (data.testimonialGroups && typeof data.testimonialGroups === 'object') {
        console.log('📊 Found testimonialData.testimonialGroups');
        
        Object.keys(data.testimonialGroups).forEach(groupKey => {
            const group = data.testimonialGroups[groupKey];
            console.log(`📦 Group ${groupKey}:`, group);
            
            // Check if group has testimonials
            if (group.testimonials && Array.isArray(group.testimonials)) {
                console.log(`   Found ${group.testimonials.length} testimonials in group`);
                
                group.testimonials.forEach((testimonial, index) => {
                    testimonials.push({
                        id: `${groupKey}_${index}`,
                        name: testimonial.name || group.name || groupKey,
                        emoji: testimonial.emoji || getEmojiForGroup(groupKey),
                        group: groupKey,
                        index: index,
                        data: testimonial
                    });
                });
            } else {
                console.log(`   No testimonials array found in group ${groupKey}`);
            }
        });
    }
    
    // If no testimonials found in groups, try using the concerns
    if (testimonials.length === 0 && data.concerns) {
        console.log('📊 Trying concerns structure...');
        Object.keys(data.concerns).forEach(concernKey => {
            const concern = data.concerns[concernKey];
            console.log(`   Concern: ${concernKey}`, concern);
            
            // You might need to call getConcernTestimonials function
            if (typeof data.getConcernTestimonials === 'function') {
                console.log(`   Getting testimonials for concern: ${concernKey}`);
                const concernTestimonials = data.getConcernTestimonials(concernKey);
                if (concernTestimonials && Array.isArray(concernTestimonials)) {
                    concernTestimonials.forEach((testimonial, index) => {
                        testimonials.push({
                            id: `${concernKey}_${index}`,
                            name: testimonial.name || concern.name || concernKey,
                            emoji: testimonial.emoji || getEmojiForGroup(concernKey),
                            group: concernKey,
                            index: index,
                            data: testimonial
                        });
                    });
                }
            }
        });
    }
    
    console.log(`✅ Extracted ${testimonials.length} testimonials`);
    return testimonials;
}

// CREATE DYNAMIC SPLASH SCREEN (SAME AS BEFORE BUT FIXED)
function createDynamicSplashScreen(splashScreen, testimonials) {
    console.log('🔄 Creating dynamic buttons from', testimonials.length, 'testimonials');
    
    // Create buttons HTML dynamically
    let buttonsHTML = '';
    let buttonCount = 0;
    
    // Take up to 4 testimonials
    const displayTestimonials = testimonials.slice(0, 4);
    
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
        
        // Store mapping for video playback
        if (!window.testimonialVideoMap) window.testimonialVideoMap = {};
        window.testimonialVideoMap[videoKey] = testimonial;
        
        buttonCount++;
    });
    
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

// GET EMOJI BASED ON GROUP/CONCERN KEY
function getEmojiForGroup(groupKey) {
    const emojiMap = {
        price: '💰',
        time: '⏰',
        trust: '🤝',
        results: '📈',
        general: '🎯',
        conversion: '🚀',
        web: '🌐',
        form: '📝',
        alternative: '🔄',
        default: '🎬'
    };
    
    // Check for keywords in the group key
    const key = groupKey.toLowerCase();
    if (key.includes('price') || key.includes('cost')) return '💰';
    if (key.includes('time') || key.includes('speed')) return '⏰';
    if (key.includes('trust')) return '🤝';
    if (key.includes('result') || key.includes('success')) return '📈';
    if (key.includes('conversion')) return '🚀';
    if (key.includes('web')) return '🌐';
    if (key.includes('form')) return '📝';
    if (key.includes('alternative')) return '🔄';
    
    return emojiMap[groupKey] || emojiMap.default;
}

// GET VIDEO KEY FOR TESTIMONIAL
function getVideoKeyForTestimonial(groupKey, index) {
    // Map testimonial to available videos
    const videoMap = {
        'price_0': 'skeptical',
        'price_1': 'speed',
        'time_0': 'speed',
        'time_1': 'excited',
        'trust_0': 'skeptical',
        'trust_1': 'convinced',
        'results_0': 'convinced',
        'results_1': 'excited',
        'general_0': 'skeptical',
        'general_1': 'convinced',
        // Your specific groups
        'group_conversion_boost_1767901787532_0': 'skeptical',
        'group_conversion_boost_1767901787532_1': 'convinced',
        'group_web_form_aternative_1767919446882_0': 'speed',
        'group_web_form_aternative_1767919446882_1': 'excited'
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