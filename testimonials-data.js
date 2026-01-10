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
window.playTestimonialVideoWithOverlay = function(testimonial) {
    console.log('🎬 Playing video from data file:', testimonial.title);
    
    if (!testimonial.videoUrl) {
        console.error('❌ No video URL');
        return;
    }
    
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
    `;
    
    // Create video container with 9:16 aspect ratio
    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = `
        position: relative;
        width: 360px;   /* 9:16 aspect ratio */
        height: 640px;
        background: #000;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        border: 1px solid rgba(255,255,255,0.1);
    `;
    
    // Create video element
    const video = document.createElement('video');
    video.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
    `;
    video.controls = true;
    video.autoplay = true;
    
    const source = document.createElement('source');
    source.src = testimonial.videoUrl;
    source.type = 'video/mp4';
    video.appendChild(source);
    
    // Create CLOSE BUTTON with navigation to decision panel
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕ Close & Choose Next Step';
    closeButton.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 32px;
        background: rgba(0,0,0,0.7);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        backdrop-filter: blur(10px);
        z-index: 10001;
        transition: all 0.3s ease;
    `;
    
    // Add hover effects
    closeButton.onmouseenter = function() {
        this.style.background = 'rgba(0,0,0,0.9)';
        this.style.borderColor = 'rgba(255,255,255,0.5)';
        this.style.transform = 'translateX(-50%) translateY(-2px)';
    };
    
    closeButton.onmouseleave = function() {
        this.style.background = 'rgba(0,0,0,0.7)';
        this.style.borderColor = 'rgba(255,255,255,0.3)';
        this.style.transform = 'translateX(-50%) translateY(0)';
    };
    
    // 🎯 CRITICAL: Close button shows decision panel
    closeButton.onclick = function() {
        console.log('🎯 Close button clicked - showing decision panel');
        
        // Remove video overlay
        overlay.remove();
        
        // Show decision panel (from testimonial-player.js)
        if (window.showTestimonialNavigationOptions) {
            window.showTestimonialNavigationOptions();
        } else {
            console.error('❌ Decision panel function not found!');
            // Fallback: Return to voice chat
            if (window.returnToVoiceChat) {
                window.returnToVoiceChat();
            }
        }
    };
    
    // Assemble everything
    videoContainer.appendChild(video);
    videoContainer.appendChild(closeButton);
    overlay.appendChild(videoContainer);
    document.body.appendChild(overlay);
    
    // Handle video end - also show decision panel
    video.addEventListener('ended', function() {
        console.log('✅ Video ended - showing decision panel');
        closeButton.click(); // Trigger the close button logic
    });
    
    console.log('✅ Video player created with close button');
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
