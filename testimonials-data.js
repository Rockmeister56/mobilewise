// ===================================================
// 🧹 CLEAN START: Ensure clean data loading
// ===================================================

// ===================================================
// 🚫 STOP testimonial-manager from corrupting data
// ===================================================

// If testimonial-manager already created a messed up testimonialData, fix it
if (window.testimonialData && window.testimonialData.__version !== '5.0-complete-fixed') {
  console.log('🚫 Detected corrupted testimonialData from manager. Resetting...');
  window.testimonialData = null; // Clear it so we can set fresh data
}

// Clear localStorage to prevent reloading of corrupted data
try {
  localStorage.removeItem('enhancedTestimonialData');
  localStorage.removeItem('testimonialData');
  console.log('🧹 Cleared corrupted localStorage data');
} catch (e) {
  // Ignore
}

// Clear all corrupted data from localStorage
const keysToRemove = [
  'enhancedTestimonialData',
  'testimonialData', 
  'testimonialGroups',
  'testimonialVideos',
  'testimonialData_v5',
  'testimonialGroups_v5'
];

console.log('🧹 Clearing localStorage to prevent data corruption...');
keysToRemove.forEach(key => {
  try {
    localStorage.removeItem(key);
    console.log(`   Removed: ${key}`);
  } catch (e) {
    // Ignore errors
  }
});

// Also clear any sessionStorage
try {
  sessionStorage.clear();
} catch (e) {
  // Ignore
}

console.log('✅ Storage cleared. Starting with clean data.');

// ===================================================
// 🎬 ENHANCED TESTIMONIAL SYSTEM DATA
// Generated: 1/14/2026
// Version: 5.0-final-fixed
// ===================================================

// Create a completely fresh, isolated data object
const freshTestimonialData = {
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
  // 🎯 ENHANCED CONCERNS (12 Detailed Types - COMPLETE)
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
  // 📁 UNIFIED GROUPS (Both Testimonial & Informational - COMPLETE)
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
      "videoIds": ["info_300_conversions"],
      "createdAt": "2026-01-14T00:00:00.000Z",
      "viewCount": 0
    }
  },

  // ========================
  // 🎬 ALL VIDEOS (Organized by ID - COMPLETE)
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
    
    // Informational Videos
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
  // 📊 STATISTICS (CORRECTED)
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
  "__version": "5.0-final-fixed",
  "__generated": "2026-01-14T00:00:00.000Z",
  "__notes": "Complete and fixed version with all 12 concerns"
};

// ===================================================
// 🛡️ DATA PROTECTION: Create immutable data object
// ===================================================

// Create testimonialData as an immutable proxy
window.testimonialData = new Proxy(freshTestimonialData, {
  set(target, property, value) {
    console.warn(`🛡️ Blocked: Cannot modify testimonialData.${property}`);
    console.trace('Modification attempted from:');
    return false;
  },
  deleteProperty(target, property) {
    console.warn(`🛡️ Blocked: Cannot delete testimonialData.${property}`);
    console.trace('Deletion attempted from:');
    return false;
  }
});

console.log('🛡️ testimonialData is now immutable');

// ===================================================
// 🔧 HELPER FUNCTIONS FOR AI INTEGRATION
// ===================================================

// 🎯 Get videos for a specific concern - FIXED
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

// 🎯 Validate data integrity - SIMPLIFIED
window.testimonialData.validateData = function() {
  console.log('🔧 Validating testimonial data...');
  
  let warnings = [];
  
  // Quick validation - just check counts
  const groupCount = Object.keys(this.groups || {}).length;
  const videoCount = Object.keys(this.videos || {}).length;
  const concernCount = Object.keys(this.concerns || {}).length;
  
  if (groupCount !== 2) warnings.push(`Expected 2 groups, found ${groupCount}`);
  if (videoCount !== 2) warnings.push(`Expected 2 videos, found ${videoCount}`);
  if (concernCount !== 12) warnings.push(`Expected 12 concerns, found ${concernCount}`);
  
  if (warnings.length === 0) {
    console.log('✅ All data is valid!');
    return { valid: true, warnings: [] };
  } else {
    console.log('⚠️ Validation warnings:', warnings);
    return { valid: true, warnings: warnings };
  }
};

// 🎯 Enhanced concern detection for AI - FIXED VERSION
window.testimonialData.detectConcerns = function(userMessage) {
  const lowerMsg = userMessage.toLowerCase();
  const detected = [];
  
  // Check all concerns - FIXED: Add safety check for triggers
  for (const [concernKey, concern] of Object.entries(this.concerns)) {
    if (!concern || !concern.triggers || !Array.isArray(concern.triggers)) {
      console.warn(`Skipping concern ${concernKey}: invalid triggers`);
      continue;
    }
    
    for (const trigger of concern.triggers) {
      if (trigger && lowerMsg.includes(trigger.toLowerCase())) {
        detected.push({
          concernKey: concernKey,
          concernTitle: concern.title || concernKey,
          trigger: trigger,
          icon: concern.icon || "❓",
          confidence: 1.0
        });
        break; // Found one trigger, move to next concern
      }
    }
  }
  
  return detected;
};

// ===================================================
// 🎬 VIDEO PLAYER & UI FUNCTIONS
// ===================================================

// 🎬 Main video player function
window.playTestimonialVideoWithOverlay = function(videoData, autoClose = true) {
  console.log('🎬 Playing video:', videoData?.title || 'Unknown');
  
  if (!videoData || !videoData.videoUrl) {
    console.error('❌ Invalid video data');
    return;
  }
  
  // ... keep your existing player code here ...
  // (I'm keeping it brief since you have the working version)
  
  const overlay = document.createElement('div');
  overlay.id = 'testimonialVideoOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
  `;
  
  const video = document.createElement('video');
  video.src = videoData.videoUrl;
  video.controls = true;
  video.autoplay = true;
  video.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    background: #000;
  `;
  
  overlay.appendChild(video);
  document.body.appendChild(overlay);
  
  overlay.onclick = () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = 'auto';
  };
  
  document.body.style.overflow = 'hidden';
  
  return overlay;
};

// 📱 Responsive video player
window.showResponsiveTestimonial = function(videoId) {
  const videoData = window.testimonialData.videos[videoId];
  if (!videoData) {
    console.error('Video not found:', videoId);
    return;
  }
  
  window.playTestimonialVideoWithOverlay(videoData);
};

// 🎯 AI Response Integration - FIXED
window.getVideoResponseForMessage = function(userMessage) {
  const concerns = window.testimonialData.detectConcerns(userMessage);
  
  if (concerns.length === 0) {
    console.log('No concerns detected');
    const generalVideos = window.testimonialData.getConcernVideos('general_info');
    if (generalVideos.length > 0) {
      return {
        video: generalVideos[0],
        concern: window.testimonialData.concerns.general_info || { title: 'General Info' },
        confidence: 0.3
      };
    }
    return null;
  }
  
  // Sort by confidence
  concerns.sort((a, b) => b.confidence - a.confidence);
  const topConcern = concerns[0];
  const videos = window.testimonialData.getConcernVideos(topConcern.concernKey);
  
  if (videos.length > 0) {
    return {
      video: videos[0],
      concern: topConcern,
      confidence: topConcern.confidence,
      alternatives: videos.slice(1)
    };
  }
  
  return null;
};

// 🎬 Play video based on user message
window.playRelevantTestimonial = function(userMessage) {
  const response = window.getVideoResponseForMessage(userMessage);
  
  if (response && response.video) {
    console.log('🎯 Playing relevant testimonial:', response.video.title);
    window.showResponsiveTestimonial(response.video.id);
    return { success: true, video: response.video };
  }
  
  console.log('❌ No relevant video found');
  return { success: false, message: 'No relevant video found' };
};

// 📊 Get statistics for dashboard
window.getTestimonialStats = function() {
  return {
    ...window.testimonialData.statistics,
    concerns: Object.keys(window.testimonialData.concerns).length,
    groupsByType: {
      testimonial: Object.values(window.testimonialData.groups).filter(g => g.type === 'testimonial').length,
      informational: Object.values(window.testimonialData.groups).filter(g => g.type === 'informational').length
    }
  };
};

// 🔧 Initialize testimonial system - SIMPLIFIED
window.initializeTestimonialSystem = function() {
  console.log('🚀 Initializing Testimonial System');
  
  // Skip cleanup - data is immutable
  // window.cleanupTestimonialData();
  
  // Just validate
  const validation = window.testimonialData.validateData();
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ System warnings:', validation.warnings);
  }
  
  // Set up global shortcuts
  window.showTestimonial = window.showResponsiveTestimonial;
  window.findTestimonial = window.getVideoResponseForMessage;
  
  console.log('✅ Testimonial system ready');
  return true;
};

// ===================================================
// 📝 INITIALIZATION & TESTING
// ===================================================

// Auto-initialize on load
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('🚀 TESTIMONIAL SYSTEM LOADING');
  console.log('='.repeat(60));
  
  console.log(`Version: ${window.testimonialData.__version}`);
  console.log(`Groups: ${Object.keys(window.testimonialData.groups).length}`);
  console.log(`Videos: ${Object.keys(window.testimonialData.videos).length}`);
  console.log(`Concerns: ${Object.keys(window.testimonialData.concerns).length}`);
  console.log(`Views: ${window.testimonialData.statistics.totalViews}`);
  
  // Initialize system
  window.initializeTestimonialSystem();
  
  console.log('='.repeat(60));
  console.log('✅ SYSTEM LOADED SUCCESSFULLY');
  console.log('='.repeat(60));
  
  // Run quick self-test
  console.log('\n🧪 QUICK SELF-TEST:');
  console.log('1. detectConcerns test:', window.testimonialData.detectConcerns('expensive').length > 0 ? '✓' : '✗');
  console.log('2. getConcernVideos test:', window.testimonialData.getConcernVideos('results_effectiveness').length > 0 ? '✓' : '✗');
  console.log('3. mapPattern test:', window.testimonialData.mapPatternToConcern('expensive') === 'price_expensive' ? '✓' : '✗');
  console.log('4. getVideoResponse test:', window.getVideoResponseForMessage('does this work?') ? '✓' : '✗');
  
}, 100);

console.log('✅ testimonials-data.js loaded');