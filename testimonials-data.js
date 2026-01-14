// ===================================================
// 🎬 ENHANCED TESTIMONIAL SYSTEM DATA
// Generated: 1/14/2026
// Version: 5.0-enhanced-concerns
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

  // ========================
  // 🎯 ENHANCED CONCERNS (12 Detailed Types)
  // ========================
  "concerns": {
    // 💰 PRICE CONCERNS
    "price_expensive": {
      "title": "Expensive",
      "icon": "💰",
      "videoType": "skeptical",
      "triggers": ["expensive", "too much", "high price", "overpriced"],
      "description": "When users say it's too expensive"
    },
    "price_cost": {
      "title": "Cost/Price",
      "icon": "💰",
      "videoType": "skeptical",
      "triggers": ["cost", "price", "pricing", "how much"],
      "description": "When users ask about cost or pricing"
    },
    "price_affordability": {
      "title": "Affordability",
      "icon": "💰",
      "videoType": "skeptical",
      "triggers": ["afford", "budget", "money", "worth it"],
      "description": "When users worry about affordability"
    },
    
    // ⏰ TIME CONCERNS
    "time_busy": {
      "title": "Too Busy",
      "icon": "⏰",
      "videoType": "speed",
      "triggers": ["busy", "no time", "hectic", "overwhelmed"],
      "description": "When users say they're too busy"
    },
    "time_speed": {
      "title": "Speed/Timing",
      "icon": "⏰",
      "videoType": "speed",
      "triggers": ["time", "when", "long", "fast", "quick"],
      "description": "When users ask about timing or speed"
    },
    
    // 🤝 TRUST CONCERNS
    "trust_skepticism": {
      "title": "Skepticism",
      "icon": "🤝",
      "videoType": "skeptical",
      "triggers": ["skeptical", "not sure", "doubt", "unsure"],
      "description": "When users express skepticism or doubt"
    },
    "trust_legitimacy": {
      "title": "Legitimacy",
      "icon": "🤝",
      "videoType": "skeptical",
      "triggers": ["scam", "real", "legit", "trust", "believe"],
      "description": "When users question legitimacy or trust"
    },
    
    // 📈 RESULTS CONCERNS
    "results_effectiveness": {
      "title": "Effectiveness",
      "icon": "📈",
      "videoType": "convinced",
      "triggers": ["work", "actually work", "results", "effective"],
      "description": "When users ask if it works or gets results"
    },
    "results_worry": {
      "title": "Worry/Concern",
      "icon": "📈",
      "videoType": "convinced",
      "triggers": ["worried", "concerned", "afraid", "nervous"],
      "description": "When users express worry or concern"
    },
    
    // ⭐ GENERAL CONCERNS
    "general_info": {
      "title": "General Information",
      "icon": "⭐",
      "videoType": "skeptical",
      "triggers": ["information", "details", "explain", "how it works", "what is"],
      "description": "When users ask for general information"
    },
    "general_demo": {
      "title": "Demo Request",
      "icon": "⭐",
      "videoType": "skeptical",
      "triggers": ["show me", "demonstrate", "demo", "see it", "watch"],
      "description": "When users ask to see a demo"
    },
    
    // 📚 INFORMATIONAL CONCERNS
    "info_conversions_boost": {
      "title": "Conversion Boost",
      "icon": "📈",
      "videoType": "convinced",
      "triggers": ["300%", "triple", "more conversions", "boost sales"],
      "description": "How to get 300% more conversions",
      "isInformational": true
    },
    "info_pre_qualified": {
      "title": "Pre-Qualified Leads",
      "icon": "🔥",
      "videoType": "convinced",
      "triggers": ["pre qualified", "qualified leads", "hot leads", "sales ready"],
      "description": "How to get pre-qualified hot leads",
      "isInformational": true
    }
  },

  // ========================
  // 📁 UNIFIED GROUPS (Both Testimonial & Informational)
  // ========================
  "groups": {
    // EXAMPLE: Testimonial Group
    "group_conversion_boost": {
      "id": "group_conversion_boost",
      "type": "testimonial",
      "name": "PPC Conversion Boost",
      "slug": "conversion-boost",
      "icon": "📁",
      "description": "Real stories from clients who got 300%+ conversion increases",
      "primaryConcern": "results_effectiveness",
      "concerns": ["results_effectiveness", "price_affordability", "trust_legitimacy"],
      "videoIds": ["testimonial_1767902304439"],
      "createdAt": "2026-01-08T19:49:47.532Z",
      "viewCount": 11
    },
    
    // EXAMPLE: Informational Group
    "group_how_it_works": {
      "id": "group_how_it_works",
      "type": "informational",
      "name": "How It Works",
      "slug": "how-it-works",
      "icon": "📚",
      "description": "Educational videos explaining our system",
      "primaryConcern": "general_info",
      "concerns": ["general_info", "general_demo", "info_conversions_boost"],
      "videoIds": [], // Will be populated when videos are added
      "createdAt": "2026-01-14T00:00:00.000Z",
      "viewCount": 0
    }
  },

  // ========================
  // 🎬 ALL VIDEOS (Organized by ID)
  // ========================
  "videos": {
    // Testimonial Video
    "testimonial_1767902304439": {
      "id": "testimonial_1767902304439",
      "groupId": "group_conversion_boost",
      "type": "testimonial",
      "title": "312% conversion increase from a form",
      "videoUrl": "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/sign/video-testimonials/legal-personal-injury.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNjg4MGUyOC0zMDRhLTQ5NzItYmNiMS1iY2U5YjNkOWU1YTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlby10ZXN0aW1vbmlhbHMvbGVnYWwtcGVyc29uYWwtaW5qdXJ5Lm1wNCIsImlhdCI6MTc2NzkwMjA3NywiZXhwIjoxNzk5NDM4MDc3fQ.mEn-TmcfRJhFZfGsqSELw63etf1txlZESZaG7KQcic0",
      "author": "Ted Johnson, Esq",
      "text": "",
      "concernType": "results_effectiveness",
      "addedAt": "2026-01-08T19:58:24.439Z",
      "views": 11
    },
    
    // Informational Videos (Example - will be added by manager)
    "info_300_conversions": {
      "id": "info_300_conversions",
      "groupId": "group_how_it_works",
      "type": "informational",
      "title": "300% More Conversions",
      "videoUrl": "", // Will be populated by manager
      "author": "System Explanation",
      "description": "How AI transforms your conversion rates overnight",
      "concernType": "info_conversions_boost",
      "subType": "explanation",
      "addedAt": "2026-01-14T00:00:00.000Z",
      "views": 0
    }
  },

  // ========================
  // 📊 STATISTICS
  // ========================
  "statistics": {
    "totalGroups": 2,
    "totalTestimonialGroups": 1,
    "totalInformationalGroups": 1,
    "totalVideos": 2,
    "totalTestimonials": 1,
    "totalInformationalVideos": 1,
    "totalViews": 11
  },

  // ========================
  // ⚙️ PLAYER CONFIGURATION
  // ========================
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

  // ========================
  // 🛠️ HELPER FUNCTIONS
  // ========================
  "__version": "5.0-enhanced-concerns",
  "__generated": "2026-01-14T00:00:00.000Z",
  "__notes": "Enhanced concerns system with 12 detailed types"
};

// ===================================================
// 🔧 HELPER FUNCTIONS FOR AI INTEGRATION
// ===================================================

// 🎯 Get videos for a specific concern
window.testimonialData.getConcernVideos = function(concernKey) {
  console.log('🔍 Searching videos for concern:', concernKey);
  const results = [];
  
  if (!this.videos) {
    console.error('❌ No videos found in data');
    return results;
  }
  
  // Search through all videos
  for (const [videoId, video] of Object.entries(this.videos)) {
    if (video.concernType === concernKey) {
      // Get group info
      const group = this.groups[video.groupId] || {};
      
      results.push({
        ...video,
        groupName: group.name || "Uncategorized",
        groupIcon: group.icon || (video.type === 'testimonial' ? '⭐' : '📚'),
        groupType: group.type
      });
    }
  }
  
  console.log(`✅ Found ${results.length} videos for "${concernKey}"`);
  return results;
};

// 🎯 Map AI patterns to concern keys
window.testimonialData.mapPatternToConcern = function(pattern) {
  const patternMap = {
    // Price patterns
    "expensive": "price_expensive",
    "too much": "price_expensive",
    "cost": "price_cost",
    "price": "price_cost",
    "how much": "price_cost",
    "afford": "price_affordability",
    "worth it": "price_affordability",
    "budget": "price_affordability",
    
    // Time patterns
    "time": "time_speed",
    "busy": "time_busy",
    "no time": "time_busy",
    "when": "time_speed",
    "long": "time_speed",
    "fast": "time_speed",
    "quick": "time_speed",
    
    // Trust patterns
    "trust": "trust_legitimacy",
    "believe": "trust_legitimacy",
    "skeptical": "trust_skepticism",
    "scam": "trust_legitimacy",
    "real": "trust_legitimacy",
    "legit": "trust_legitimacy",
    "doubt": "trust_skepticism",
    
    // Results patterns
    "work": "results_effectiveness",
    "actually work": "results_effectiveness",
    "results": "results_effectiveness",
    "worried": "results_worry",
    "concerned": "results_worry",
    "afraid": "results_worry",
    
    // General patterns
    "information": "general_info",
    "details": "general_info",
    "explain": "general_info",
    "how it works": "general_info",
    "show me": "general_demo",
    "demonstrate": "general_demo",
    "demo": "general_demo",
    
    // Informational patterns
    "300%": "info_conversions_boost",
    "triple": "info_conversions_boost",
    "more conversions": "info_conversions_boost",
    "pre qualified": "info_pre_qualified",
    "qualified leads": "info_pre_qualified",
    "hot leads": "info_pre_qualified"
  };
  
  const concernKey = patternMap[pattern] || "general_info";
  console.log(`🗺️ Mapping pattern "${pattern}" → "${concernKey}"`);
  return concernKey;
};

// 🎯 Get all videos for AI detection
window.testimonialData.getAllVideosByGroup = function(groupId) {
  const results = [];
  
  for (const [videoId, video] of Object.entries(this.videos)) {
    if (video.groupId === groupId) {
      results.push(video);
    }
  }
  
  return results;
};

// 🎯 Get available concerns for UI
window.testimonialData.getAvailableConcerns = function() {
  const concerns = [];
  for (const [key, data] of Object.entries(this.concerns)) {
    concerns.push({
      key: key,
      title: data.title,
      icon: data.icon,
      videoType: data.videoType,
      triggers: data.triggers || [],
      description: data.description || ""
    });
  }
  return concerns;
};

// 🎯 Validate data integrity
window.testimonialData.validateData = function() {
  console.log('🔧 Validating enhanced testimonial data...');
  
  let errors = [];
  let warnings = [];
  
  // Check groups
  for (const [id, group] of Object.entries(this.groups)) {
    if (!group.name || group.name === 'undefined') {
      errors.push(`Group "${id}" has invalid name: "${group.name}"`);
    }
    if (!group.type || !['testimonial', 'informational'].includes(group.type)) {
      errors.push(`Group "${id}" has invalid type: "${group.type}"`);
    }
  }
  
  // Check videos
  for (const [id, video] of Object.entries(this.videos)) {
    if (!video.title) {
      warnings.push(`Video "${id}" missing title`);
    }
    if (!video.concernType) {
      warnings.push(`Video "${id}" missing concernType`);
    }
    if (!this.groups[video.groupId]) {
      warnings.push(`Video "${id}" references non-existent group: "${video.groupId}"`);
    }
  }
  
  // Check concerns exist
  for (const [id, video] of Object.entries(this.videos)) {
    if (video.concernType && !this.concerns[video.concernType]) {
      warnings.push(`Video "${id}" uses undefined concern: "${video.concernType}"`);
    }
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All data is valid!');
    return { valid: true, errors: [], warnings: [] };
  } else {
    console.log('⚠️ Data validation results:', { errors, warnings });
    return { valid: errors.length === 0, errors, warnings };
  }
};

// 🎯 Enhanced concern detection for AI
window.testimonialData.detectConcerns = function(userMessage) {
  const lowerMsg = userMessage.toLowerCase();
  const detected = [];
  
  // Check all concerns
  for (const [concernKey, concern] of Object.entries(this.concerns)) {
    for (const trigger of concern.triggers) {
      if (lowerMsg.includes(trigger.toLowerCase())) {
        detected.push({
          concernKey: concernKey,
          concernTitle: concern.title,
          trigger: trigger,
          icon: concern.icon,
          confidence: 1.0
        });
        break; // Found one trigger, move to next concern
      }
    }
  }
  
  return detected;
};

// ===================================================
// 📝 INITIALIZATION & LOGGING
// ===================================================

// Auto-validate on load
setTimeout(() => {
  console.log('🚀 ENHANCED TESTIMONIAL SYSTEM LOADED');
  console.log(`   Version: ${this.__version}`);
  console.log(`   Groups: ${this.statistics.totalGroups} (${this.statistics.totalTestimonialGroups} testimonial, ${this.statistics.totalInformationalGroups} informational)`);
  console.log(`   Videos: ${this.statistics.totalVideos} (${this.statistics.totalTestimonials} testimonials, ${this.statistics.totalInformationalVideos} informational)`);
  console.log(`   Views: ${this.statistics.totalViews}`);
  console.log(`   Enhanced Concerns: ${Object.keys(this.concerns).length} detailed types`);
  
  // Run validation
  const validation = this.validateData();
  if (!validation.valid) {
    console.error('❌ Data validation failed!', validation.errors);
  }
}, 100);

// ===================================================
// 🎬 VIDEO PLAYER FUNCTION (From your existing file)
// ===================================================

window.playTestimonialVideoWithOverlay = function(testimonial) {
  // Keep your existing video player function here
  // (It should remain exactly as in your current file)
  console.log('🎬 Playing video:', testimonial.title);
  // ... rest of your existing function ...
};

console.log('✅ Enhanced testimonial-data.js loaded successfully!');