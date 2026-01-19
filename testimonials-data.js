// ===================================================
// 🎬 DUAL VIDEO SYSTEM DATA - v3.0 TEMPLATE
// Template Version: 3.0-dual-system
// Last Updated: ${new Date().toLocaleDateString()}
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

  // ========================
  // ⭐ TESTIMONIALS ONLY (Social Proof)
  // ========================
  "testimonialGroups": {},

  // ========================
  // 📚 INFORMATIONAL VIDEOS ONLY (Educational)
  // ========================
  "informationalGroups": {},

  "statistics": {
    "totalTestimonialGroups": 0,
    "totalInformationalGroups": 0,
    "totalTestimonials": 0,
    "totalInformationalVideos": 0
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

  "__version": "3.0-dual-system",
  "__generated": "${new Date().toISOString()}",
  "__notes": "Separated testimonials (social proof) from informational videos (educational)"
};

// ========================
// 🛠️ MANAGER FUNCTIONS
// ========================

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

// Auto-save trigger for manager
window.testimonialData.triggerAutoSave = function() {
    console.log('🔔 Auto-save triggered by manager');
    if (window.autoSaveToFile && typeof window.autoSaveToFile === 'function') {
        window.autoSaveToFile();
    }
};

console.log('✅ TESTIMONIAL SYSTEM TEMPLATE v3.0 LOADED');
console.log('📝 NOTE: This is a template. Add groups via the manager.');
console.log('💾 Data will be saved to browser memory (localStorage)');