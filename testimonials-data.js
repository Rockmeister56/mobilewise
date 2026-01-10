// ===================================================
// 🎬 TESTIMONIALS DATA - GENERATED
// Generated: 1/10/2026, 8:13:40 AM
// Total Groups: 2
// Total Videos: 1
// ===================================================

window.testimonialData = {
  "videoUrls": {
    "skeptical": "",
    "speed": "",
    "convinced": "",
    "excited": ""
  },
  "videoDurations": {
    "skeptical": 20000,
    "speed": 20000,
    "convinced": 20000,
    "excited": 20000
  },
  "concerns": {
    "price": {
      "title": "Price Concerns",
      "icon": "💰",
      "videoType": "skeptical"
    },
    "time": {
      "title": "Time/Speed",
      "icon": "⏰",
      "videoType": "speed"
    },
    "trust": {
      "title": "Trust/Reliability",
      "icon": "🤝",
      "videoType": "skeptical"
    },
    "results": {
      "title": "Results/Effectiveness",
      "icon": "📈",
      "videoType": "convinced"
    },
    "general": {
      "title": "General Feedback",
      "icon": "⭐",
      "videoType": "skeptical"
    }
  },
  "testimonialGroups": {
    "group_conversion_boost_1767901787532": {
      "id": "group_conversion_boost_1767901787532",
      "name": "PPC Conversion Boost",
      "slug": "conversion-boost",
      "icon": "📁",
      "description": "AI smart voice chat increases average conversion 300% and more for professional organizations and the like",
      "concerns": [
        "time",
        "trust",
        "general",
        "results"
      ],
      "testimonials": [
        {
          "id": "testimonial_1767902304439",
          "title": "312% conversion increase from a form",
          "concernType": "results",
          "videoUrl": "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/sign/video-testimonials/legal-personal-injury.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjg4MGUyOC0zMDRhLTQ5NzItYmNiMS1iY2U5YjNkOWU1YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby10ZXN0aW1vbmlhbHMvbGVnYWwtcGVyc29uYWwtaW5qdXJ5Lm1wNCIsImlhdCI6MTc2NzkwMjA3NywiZXhwIjoxNzk5NDM4MDc3fQ.mEn-TmcfRJhFZfGsqSELw63etf1txlZESZaG7KQcic0",
          "author": "Ted Johnson, Esq",
          "text": "",
          "addedAt": "2026-01-08T19:58:24.439Z",
          "views": 10
        }
      ],
      "createdAt": "2026-01-08T19:49:47.532Z",
      "viewCount": 10
    },
    "group_web_form_aternative_1767919446882": {
      "id": "group_web_form_aternative_1767919446882",
      "name": "Form  Abandonment Alternative",
      "slug": "web-form-aternative",
      "icon": "📁",
      "description": "Illustrates how AI interviews boost conversion when compared to a web form",
      "concerns": [
        "time",
        "trust",
        "general",
        "results"
      ],
      "testimonials": [],
      "createdAt": "2026-01-09T00:44:06.883Z",
      "viewCount": 0
    }
  },
  "statistics": {
    "totalGroups": 2,
    "totalVideos": 1,
    "totalViews": 10
  },
  "playerConfig": {
    "desktop": {
      "width": 854,
      "height": 480,
      "top": "50%",
      "left": "50%",
      "borderRadius": "12px"
    },
    "mobile": {
      "fullscreen": true
    },
    "overlay": {
      "background": "rgba(0, 0, 0, 0.5)"
    },
    "resumeMessage": "I'm sure you can appreciate what our clients have to say. So let's get back on track with helping you sell your practice. Would you like a free consultation with Bruce that can analyze your particular situation?"
  },
  "__version": "2.0-groups-system",
  "__generated": "2026-01-10T16:13:40.650Z",
  "__notes": "COMPLETELY CLEAN - No video URLs, no testimonials, no groups"
};

console.log('✅ Testimonials Data Loaded:', 
  Object.keys(window.testimonialData.testimonialGroups).length, 'groups');
console.log('🎬 Videos:', window.testimonialData.statistics?.totalVideos || 0);

// ===================================================
// PLAYER INTEGRATION FUNCTIONS (ADDED BY MANAGER)
// ===================================================

// Get testimonials for a specific concern
window.testimonialData.getConcernTestimonials = function(concernKey) {
    const results = [];
    
    if (!this.testimonialGroups) return results;
    
    for (const [groupId, group] of Object.entries(this.testimonialGroups)) {
        if (group.concerns && group.concerns.includes(concernKey)) {
            if (group.testimonials) {
                results.push(...group.testimonials.map(t => ({
                    ...t,
                    groupName: group.name,
                    groupIcon: group.icon
                })));
            }
        }
    }
    
    return results;
};

// Get all available concerns for button display
window.testimonialData.getAvailableConcerns = function() {
    const concerns = [];
    for (const [key, data] of Object.entries(this.concerns)) {
        concerns.push({
            key: key,
            title: data.buttonText || data.title,
            icon: data.icon,
            videoType: data.videoType
        });
    }
    return concerns;
};

// ===================================================
// 🎬 VIDEO PLAYER WITH CLOSE BUTTON (ADDED TO DATA FILE)
// ===================================================

// Function to play testimonial video WITH proper close button
// ===================================================
// 🎬 VIDEO PLAYER WITH PROPER SIZE & VISIBLE CLOSE BUTTON
// ===================================================

window.playTestimonialVideoWithOverlay = function(testimonial) {
    console.log('🎬 Playing video with proper size:', testimonial.title);
    
    if (!testimonial.videoUrl) {
        console.error('❌ No video URL');
        return;
    }
    
    // 🛡️ Set protection flags
    window.avatarCurrentlyPlaying = true;
    window.testimonialSessionActive = true;
    
    // Remove any existing overlay first
    const existingOverlay = document.getElementById('testimonial-video-overlay');
    if (existingOverlay) existingOverlay.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'testimonial-video-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
        animation: fadeIn 0.3s ease;
    `;
    
    // Create MAIN CONTAINER (properly sized)
    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        width: 350px;                 /* Mobile-like width */
        max-width: 90vw;              /* Responsive */
        background: rgba(20,20,30,0.9);
        border-radius: 20px;
        padding: 25px;
        box-shadow: 0 30px 80px rgba(0,0,0,0.8);
        border: 1px solid rgba(255,255,255,0.15);
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;
    
    // Create HEADER with title
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
        color: white;
        font-family: 'Segoe UI', sans-serif;
    `;
    
    header.innerHTML = `
        <div style="
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
        ">🎬</div>
        <div>
            <h3 style="margin: 0 0 5px 0; font-size: 18px; font-weight: 600;">
                ${testimonial.title || 'Client Testimonial'}
            </h3>
            <p style="margin: 0; opacity: 0.7; font-size: 13px;">
                Real story from a satisfied client
            </p>
        </div>
    `;
    
    // Create VIDEO CONTAINER (proper aspect ratio)
    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = `
        position: relative;
        width: 100%;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.1);
    `;
    
    // Create VIDEO element
    const video = document.createElement('video');
    video.style.cssText = `
        width: 100%;
        height: auto;
        display: block;
        border-radius: 10px;
    `;
    video.controls = true;
    video.autoplay = true;
    
    const source = document.createElement('source');
    source.src = testimonial.videoUrl;
    source.type = 'video/mp4';
    video.appendChild(source);
    
    // Create CLOSE BUTTON (VISIBLE - outside video container)
    const closeButton = document.createElement('button');
    closeButton.innerHTML = `
        <span style="font-size: 16px; margin-right: 8px;">✕</span>
        Close & Choose Next Step
    `;
    closeButton.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
    `;
    
    // Add hover effects
    closeButton.onmouseenter = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
        this.style.opacity = '0.95';
    };
    
    closeButton.onmouseleave = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
        this.style.opacity = '1';
    };
    
    // 🎯 CLOSE BUTTON ACTION
    closeButton.onclick = function() {
        console.log('🎯 Close button clicked');
        
        // Stop video
        video.pause();
        video.currentTime = 0;
        
        // Remove overlay
        overlay.remove();
        
        // Show decision panel
        if (window.showTestimonialNavigationOptions) {
            setTimeout(() => {
                window.showTestimonialNavigationOptions();
            }, 300);
        } else {
            console.log('❌ Navigation function not found');
            // Reset flags and return to chat
            window.avatarCurrentlyPlaying = false;
            window.testimonialSessionActive = false;
        }
    };
    
    // Assemble everything
    videoContainer.appendChild(video);
    container.appendChild(header);
    container.appendChild(videoContainer);
    container.appendChild(closeButton);
    overlay.appendChild(container);
    
    // Add to page
    document.body.appendChild(overlay);
    
    // Handle video end
    video.addEventListener('ended', function() {
        console.log('✅ Video ended');
        setTimeout(() => {
            closeButton.click(); // Trigger close button
        }, 1000);
    });
    
    console.log('✅ Video player created with proper size and visible button');
};

// ===================================================
// 🎤 POST-TESTIMONIAL SPEECH FUNCTION
// ===================================================

window.triggerPostTestimonialSpeech = function() {
    console.log('🎤 Post-testimonial speech triggered');
    
    // Reset flags first
    window.avatarCurrentlyPlaying = false;
    window.testimonialSessionActive = false;
    
    // Delay a bit for smooth transition
    setTimeout(() => {
        // Check if we have voice system available
        if (window.speakText) {
            // Generic call-to-action message
            const message = "Based on what you've seen from our clients' results, would you like to connect and get more information about how this could work for you?";
            
            console.log('💬 Post-testimonial CTA:', message);
            
            // Speak the message
            window.speakText(message);
            
            // If you have a specific consultation offer, you could use:
            // const message = "I'm sure you can appreciate what our clients have to say. So let's get back on track with helping you sell your practice. Would you like a free consultation with Bruce that can analyze your particular situation?";
            
        } else {
            console.log('❌ Voice system not available');
            // Fallback to showing banner
            if (window.showDirectSpeakNow) {
                window.showDirectSpeakNow();
            }
        }
    }, 800);
};

// ===================================================
// 🎯 DIRECT LEAD CAPTURE FOR POST-TESTIMONIAL
// ===================================================

window.handlePostTestimonialResponse = function(userResponse) {
    console.log('🎯 Handling post-testimonial response:', userResponse);
    
    // Convert response to lowercase for easier matching
    const response = userResponse.toLowerCase().trim();
    
    // Positive responses that should trigger lead capture
    const positiveResponses = [
        'yes', 'yes please', 'yes i would', 'sure', 'absolutely',
        'that sounds good', 'i\'m interested', 'let\'s do it',
        'i\'d like that', 'please', 'ok', 'okay', 'yeah', 'yep',
        'connect', 'more information', 'tell me more'
    ];
    
    // Negative responses
    const negativeResponses = [
        'no', 'no thanks', 'not now', 'maybe later', 'i\'m not interested',
        'not really', 'pass', 'skip', 'later'
    ];
    
    // Check if it's a positive response
    const isPositive = positiveResponses.some(positive => 
        response.includes(positive) || positive.includes(response)
    );
    
    // Check if it's a negative response  
    const isNegative = negativeResponses.some(negative =>
        response.includes(negative) || negative.includes(response)
    );
    
    if (isPositive) {
        console.log('✅ Positive response - triggering lead capture');
        
        // Trigger your action system
        if (window.showActionCenter) {
            window.showActionCenter();
        } else if (window.showContactOptions) {
            window.showContactOptions();
        } else if (window.initiateLeadCapture) {
            window.initiateLeadCapture();
        } else {
            console.error('❌ No lead capture function found');
            // Fallback - ask for name
            if (window.speakText) {
                window.speakText("Great! Could I get your first name to get you started?");
            }
        }
        
    } else if (isNegative) {
        console.log('❌ Negative response - continuing conversation');
        
        if (window.speakText) {
            window.speakText("No problem. Is there anything else you'd like to know about our services?");
        }
        
    } else {
        console.log('❓ Unclear response - asking for clarification');
        
        if (window.speakText) {
            window.speakText("I'm not sure I understood. Would you like to connect for more information, or should we continue our conversation?");
        }
    }
};

// ===================================================
// 🧪 TEST FUNCTION - CHECK FLOW CONNECTION
// ===================================================

window.testTestimonialFlow = function() {
    console.log('🔍 TESTING TESTIMONIAL FLOW');
    
    // 1. Check if we have testimonial data
    if (!window.testimonialData || !window.testimonialData.testimonialGroups) {
        console.error('❌ No testimonial data');
        return;
    }
    
    // 2. Get first testimonial
    const groups = window.testimonialData.testimonialGroups;
    const firstGroupKey = Object.keys(groups)[0];
    const firstGroup = groups[firstGroupKey];
    
    if (!firstGroup.testimonials || firstGroup.testimonials.length === 0) {
        console.error('❌ No testimonials in first group');
        return;
    }
    
    const firstTestimonial = firstGroup.testimonials[0];
    
    console.log('📊 Testimonial found:', {
        title: firstTestimonial.title,
        videoUrl: firstTestimonial.videoUrl ? '✅ Has URL' : '❌ No URL',
        videoUrlLength: firstTestimonial.videoUrl?.length || 0
    });
    
    // 3. Test if our function exists
    console.log('🔧 Function check:', {
        playTestimonialVideoWithOverlay: typeof window.playTestimonialVideoWithOverlay,
        handleTestimonialButton: typeof window.handleTestimonialButton
    });
    
    // 4. DIRECT TEST: Call our function with the testimonial
    if (typeof window.playTestimonialVideoWithOverlay === 'function') {
        console.log('🎬 DIRECT TEST: Calling playTestimonialVideoWithOverlay()');
        
        // Show a confirmation before playing
        if (confirm('Test the video player? This will play: ' + firstTestimonial.title)) {
            window.playTestimonialVideoWithOverlay(firstTestimonial);
        }
    } else {
        console.error('❌ playTestimonialVideoWithOverlay function not found!');
    }
};

console.log('✅ Test function added: testTestimonialFlow() is available');

// Make it globally available
console.log('✅ Added playTestimonialVideoWithOverlay to testimonial data file');

console.log('🎬 Testimonial Player Integration Ready');
console.log('💰 Available concerns:', window.testimonialData.getAvailableConcerns().length);
