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

console.log('🎬 Testimonial Player Integration Ready');
console.log('💰 Available concerns:', window.testimonialData.getAvailableConcerns().length);
