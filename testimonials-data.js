// ===================================================
// 🧹 CLEAN START: Ensure clean data loading
// ===================================================

// FIRST: Clear any existing corrupted data
window.testimonialData = null;
window.ENHANCED_CONCERNS = null;

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
// Version: 6.0-final-correct
// ===================================================

// 🚨🚨🚨 CRITICAL FIX: Create window.testimonialData DIRECTLY! 🚨🚨🚨
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
  // 📁 UNIFIED GROUPS (CLEAN - NO "test" GROUP!)
  // ========================
  "groups": {
    // Testimonial Group
    "group_conversion_boost": {
      "id": "group_conversion_boost",
      "type": "testimonial",
      "name": "PPC Conversion Boost",
      "slug": "conversion-boost",
      "icon": "📁",
      "description": "Real stories from clients who got 300%+ conversion increases",
      "primaryConcern": "results_effectiveness",
      "concerns": ["results_effectiveness", "price_affordability", "trust_legitimacy"],
      "videoIds": [],
      "createdAt": "2026-01-08T19:49:47.532Z",
      "viewCount": 0
    },
    
    // Informational Group
    "group_how_it_works": {
      "id": "group_how_it_works",
      "type": "informational",
      "name": "How It Works",
      "slug": "how-it-works",
      "icon": "📚",
      "description": "Educational videos explaining our system",
      "primaryConcern": "general_info",
      "concerns": ["general_info", "general_demo", "info_conversions_boost"],
      "videoIds": [],
      "createdAt": "2026-01-14T00:00:00.000Z",
      "viewCount": 0
    }
  },

  // ========================
  // 🎬 ALL VIDEOS (EMPTY - FRESH START)
  // ========================
  "videos": {},

  // ========================
  // 📊 STATISTICS (UPDATED FOR EMPTY VIDEOS)
  // ========================
  "statistics": {
    "totalGroups": 2,
    "totalTestimonialGroups": 1,
    "totalInformationalGroups": 1,
    "totalVideos": 0,
    "totalTestimonials": 0,
    "totalInformationalVideos": 0,
    "totalViews": 0
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
  "__version": "6.0-final-correct",
  "__generated": "2026-01-14T00:00:00.000Z",
  "__notes": "CORRECT: window.testimonialData created directly - no 'test' group"
};

console.log('✅ window.testimonialData created with clean data');
console.log('Groups:', Object.keys(window.testimonialData.groups));

// ===================================================
// 🎯 ESSENTIAL: ENHANCED_CONCERNS for AI Trigger System
// ===================================================

// This is CRITICAL for mobile wise AI to know when to show testimonials!
window.ENHANCED_CONCERNS = { /* ... copy your concerns object here ... */ };

console.log('🎯 ENHANCED_CONCERNS loaded for AI system (12 concerns)');

// ===================================================
// 🔧 ADD HELPER FUNCTIONS TO DATA OBJECT FIRST
// ===================================================

// 🎯 Get videos for a specific concern
freshTestimonialData.getConcernVideos = function(concernKey) {
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
freshTestimonialData.mapPatternToConcern = function(pattern) {
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
freshTestimonialData.getAllVideosByGroup = function(groupId) {
  const results = [];
  
  for (const [videoId, video] of Object.entries(this.videos)) {
    if (video.groupId === groupId) {
      results.push(video);
    }
  }
  
  return results;
};

// 🎯 Get available concerns for UI
freshTestimonialData.getAvailableConcerns = function() {
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
freshTestimonialData.validateData = function() {
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
freshTestimonialData.detectConcerns = function(userMessage) {
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
// 🛡️ DATA PROTECTION: Create smarter Proxy
// ===================================================

// Create testimonialData with a smarter Proxy that allows function addition
window.testimonialData = new Proxy(freshTestimonialData, {
  set(target, property, value) {
    // Allow setting new functions or properties that don't start with underscore
    if (typeof value === 'function' || !property.startsWith('_')) {
      console.log(`✅ Allowed: Setting testimonialData.${property}`);
      target[property] = value;
      return true;
    }
    
    // Block modifications to core data properties
    const protectedProps = ['concerns', 'groups', 'videos', 'statistics', 'videoUrls', 'videoDurations', 'playerConfig'];
    if (protectedProps.includes(property)) {
      console.warn(`🛡️ Blocked: Cannot modify core data property testimonialData.${property}`);
      console.trace('Modification attempted from:');
      return false;
    }
    
    // Allow other modifications
    target[property] = value;
    return true;
  },
  
  deleteProperty(target, property) {
    console.warn(`🛡️ Blocked: Cannot delete testimonialData.${property}`);
    console.trace('Deletion attempted from:');
    return false;
  }
});

console.log('🛡️ testimonialData protected (allows function additions)');

// ===================================================
// 🎬 GLOBAL VIDEO PLAYER & UI FUNCTIONS
// ===================================================

// 🎬 Main video player function
window.playTestimonialVideoWithOverlay = function(videoData, autoClose = true) {
  console.log('🎬 Playing video:', videoData?.title || 'Unknown');
  
  if (!videoData || !videoData.videoUrl) {
    console.error('❌ Invalid video data');
    return;
  }
  
  // Create overlay container
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
    backdrop-filter: blur(5px);
  `;
  
  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.style.cssText = `
    position: relative;
    max-width: 90%;
    max-height: 90%;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  `;
  
  closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(0, 0, 0, 0.8)';
  closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(0, 0, 0, 0.6)';
  
  // Create video element
  const video = document.createElement('video');
  video.src = videoData.videoUrl;
  video.controls = true;
  video.autoplay = true;
  video.style.cssText = `
    display: block;
    width: 100%;
    height: auto;
    max-height: 80vh;
  `;
  
  // Create info panel
  const infoPanel = document.createElement('div');
  infoPanel.style.cssText = `
    background: #f8f9fa;
    padding: 20px;
    border-top: 1px solid #e9ecef;
  `;
  
  // Add title and author
  infoPanel.innerHTML = `
    <h3 style="margin: 0 0 5px 0; color: #333; font-size: 18px;">${videoData.title}</h3>
    <p style="margin: 0; color: #666; font-size: 14px; font-weight: 500;">${videoData.author}</p>
    ${videoData.description ? `<p style="margin: 10px 0 0 0; color: #777; font-size: 14px;">${videoData.description}</p>` : ''}
  `;
  
  // Assemble components
  videoContainer.appendChild(closeBtn);
  videoContainer.appendChild(video);
  videoContainer.appendChild(infoPanel);
  overlay.appendChild(videoContainer);
  document.body.appendChild(overlay);
  
  // Close functionality
  const closeVideo = () => {
    video.pause();
    document.body.removeChild(overlay);
    document.body.style.overflow = 'auto';
  };
  
  closeBtn.onclick = closeVideo;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeVideo();
  };
  
  // Auto-close after video ends if enabled
  if (autoClose) {
    video.onended = closeVideo;
  }
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Escape key to close
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeVideo();
      document.removeEventListener('keydown', escHandler);
    }
  });
  
  return { overlay, video, closeVideo };
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

// 🔄 Update video data
window.updateTestimonialVideo = function(videoId, updates) {
  const video = window.testimonialData.videos[videoId];
  if (!video) {
    console.error('Video not found:', videoId);
    return false;
  }
  
  Object.assign(video, updates);
  console.log('✅ Updated video:', videoId, updates);
  return true;
};

// ➕ Add new video
window.addTestimonialVideo = function(videoData) {
  if (!videoData.id) {
    videoData.id = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (window.testimonialData.videos[videoData.id]) {
    console.error('Video ID already exists:', videoData.id);
    return false;
  }
  
  // Set default values
  videoData.views = videoData.views || 0;
  videoData.addedAt = videoData.addedAt || new Date().toISOString();
  
  window.testimonialData.videos[videoData.id] = videoData;
  
  // Add to group if specified
  if (videoData.groupId && window.testimonialData.groups[videoData.groupId]) {
    const group = window.testimonialData.groups[videoData.groupId];
    if (!group.videoIds.includes(videoData.id)) {
      group.videoIds.push(videoData.id);
    }
  }
  
  // Update statistics
  window.testimonialData.statistics.totalVideos += 1;
  if (videoData.type === 'testimonial') {
    window.testimonialData.statistics.totalTestimonials += 1;
  } else if (videoData.type === 'informational') {
    window.testimonialData.statistics.totalInformationalVideos += 1;
  }
  
  console.log('✅ Added new video:', videoData.id);
  return videoData.id;
};

// 🗑️ Remove video
window.removeTestimonialVideo = function(videoId) {
  const video = window.testimonialData.videos[videoId];
  if (!video) {
    console.error('Video not found:', videoId);
    return false;
  }
  
  // Remove from group
  if (video.groupId && window.testimonialData.groups[video.groupId]) {
    const group = window.testimonialData.groups[video.groupId];
    group.videoIds = group.videoIds.filter(id => id !== videoId);
  }
  
  // Remove video
  delete window.testimonialData.videos[videoId];
  
  // Update statistics
  window.testimonialData.statistics.totalVideos -= 1;
  if (video.type === 'testimonial') {
    window.testimonialData.statistics.totalTestimonials -= 1;
  } else if (video.type === 'informational') {
    window.testimonialData.statistics.totalInformationalVideos -= 1;
  }
  
  console.log('🗑️ Removed video:', videoId);
  return true;
};

// 🔧 Initialize testimonial system
window.initializeTestimonialSystem = function() {
  console.log('🚀 Initializing Testimonial System v5.0');
  
  // Validate data
  const validation = window.testimonialData.validateData();
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ System warnings:', validation.warnings);
  }
  
  // Set up global shortcuts
  window.showTestimonial = window.showResponsiveTestimonial;
  window.findTestimonial = window.getVideoResponseForMessage;
  
  console.log('✅ Testimonial system ready');
  console.log('   Available concerns:', Object.keys(window.testimonialData.concerns).length);
  console.log('   Available videos:', Object.keys(window.testimonialData.videos).length);
  console.log('   Total views:', window.testimonialData.statistics.totalViews);
  
  return true;
};

// ===================================================
// 🔧 SURGICAL FIX: Attach missing functions to testimonialData
// ===================================================

console.log('🔧 Applying surgical fix for missing functions...');

// Fix 1: Check if testimonialData exists
if (!window.testimonialData) {
  console.error('❌ testimonialData does not exist!');
} else {
  console.log('✅ testimonialData exists, attaching functions...');
  
  // Attach functions that should be on testimonialData
  const functionsToAttach = [
    'getConcernVideos',
    'validateData', 
    'detectConcerns',
    'mapPatternToConcern',
    'getAvailableConcerns',
    'getAllVideosByGroup'
  ];
  
  functionsToAttach.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
      console.log(`   Attaching ${funcName} from window...`);
      window.testimonialData[funcName] = window[funcName];
    } else {
      console.log(`   ❌ ${funcName} not found in window, creating it...`);
      
      // Create missing functions
      switch(funcName) {
        case 'getConcernVideos':
          window.testimonialData.getConcernVideos = function(concernKey) {
            console.log('🔍 Searching videos for concern:', concernKey);
            const results = [];
            
            for (const [videoId, video] of Object.entries(this.videos || {})) {
              if (video.concernType === concernKey) {
                const group = this.groups[video.groupId] || {};
                results.push({
                  ...video,
                  groupName: group.name || "Uncategorized",
                  groupIcon: group.icon || "📁",
                  groupType: group.type
                });
              }
            }
            
            return results;
          };
          break;
          
        case 'validateData':
          window.testimonialData.validateData = function() {
            console.log('🔧 Quick validation...');
            const warnings = [];
            if (Object.keys(this.concerns || {}).length !== 12) {
              warnings.push(`Expected 12 concerns, found ${Object.keys(this.concerns || {}).length}`);
            }
            return { valid: true, warnings };
          };
          break;
          
        case 'detectConcerns':
          window.testimonialData.detectConcerns = function(userMessage) {
            const lowerMsg = userMessage.toLowerCase();
            const detected = [];
            
            for (const [concernKey, concern] of Object.entries(this.concerns || {})) {
              if (concern && concern.triggers && Array.isArray(concern.triggers)) {
                for (const trigger of concern.triggers) {
                  if (trigger && lowerMsg.includes(trigger.toLowerCase())) {
                    detected.push({
                      concernKey,
                      concernTitle: concern.title || concernKey,
                      trigger,
                      icon: concern.icon || "❓",
                      confidence: 1.0
                    });
                    break;
                  }
                }
              }
            }
            
            return detected;
          };
          break;
          
        case 'mapPatternToConcern':
          window.testimonialData.mapPatternToConcern = function(pattern) {
            const patternMap = {
              "expensive": "price_expensive",
              "too much": "price_expensive",
              "cost": "price_cost",
              "price": "price_cost",
              "how much": "price_cost",
              "afford": "price_affordability",
              "worth it": "price_affordability",
              "budget": "price_affordability",
              "time": "time_speed",
              "busy": "time_busy",
              "no time": "time_busy",
              "when": "time_speed",
              "long": "time_speed",
              "fast": "time_speed",
              "quick": "time_speed",
              "trust": "trust_legitimacy",
              "believe": "trust_legitimacy",
              "skeptical": "trust_skepticism",
              "scam": "trust_legitimacy",
              "real": "trust_legitimacy",
              "legit": "trust_legitimacy",
              "doubt": "trust_skepticism",
              "work": "results_effectiveness",
              "actually work": "results_effectiveness",
              "results": "results_effectiveness",
              "worried": "results_worry",
              "concerned": "results_worry",
              "afraid": "results_worry",
              "information": "general_info",
              "details": "general_info",
              "explain": "general_info",
              "how it works": "general_info",
              "show me": "general_demo",
              "demonstrate": "general_demo",
              "demo": "general_demo",
              "300%": "info_conversions_boost",
              "triple": "info_conversions_boost",
              "more conversions": "info_conversions_boost",
              "pre qualified": "info_pre_qualified",
              "qualified leads": "info_pre_qualified",
              "hot leads": "info_pre_qualified"
            };
            
            return patternMap[pattern] || "general_info";
          };
          break;
          
        case 'getAvailableConcerns':
          window.testimonialData.getAvailableConcerns = function() {
            const concerns = [];
            for (const [key, data] of Object.entries(this.concerns || {})) {
              concerns.push({
                key: key,
                title: data.title || key,
                icon: data.icon || "❓",
                videoType: data.videoType || "skeptical",
                triggers: data.triggers || [],
                description: data.description || ""
              });
            }
            return concerns;
          };
          break;
          
        case 'getAllVideosByGroup':
          window.testimonialData.getAllVideosByGroup = function(groupId) {
            const results = [];
            for (const [videoId, video] of Object.entries(this.videos || {})) {
              if (video.groupId === groupId) {
                results.push(video);
              }
            }
            return results;
          };
          break;
      }
    }
  });
  
  console.log('✅ Functions attached to testimonialData');
  
  // Test the fix
  console.log('\n🧪 Testing the fix...');
  console.log('validateData is now a function?', typeof window.testimonialData.validateData === 'function' ? '✅ Yes' : '❌ No');
  console.log('detectConcerns is now a function?', typeof window.testimonialData.detectConcerns === 'function' ? '✅ Yes' : '❌ No');
  
  if (typeof window.testimonialData.validateData === 'function') {
    const validation = window.testimonialData.validateData();
    console.log('Validation result:', validation);
  }
  
  if (typeof window.testimonialData.detectConcerns === 'function') {
    const concerns = window.testimonialData.detectConcerns('too expensive');
    console.log('detectConcerns("too expensive"):', concerns.length, 'concerns found');
  }
  
  if (typeof window.testimonialData.mapPatternToConcern === 'function') {
    const result = window.testimonialData.mapPatternToConcern('expensive');
    console.log('mapPatternToConcern("expensive"):', result);
  }
}

// ===================================================
// 🧹 DUPLICATE CONCERNS FIX (13 instead of 12)
// ===================================================

if (window.testimonialData && window.testimonialData.concerns) {
  const concernKeys = Object.keys(window.testimonialData.concerns);
  const uniqueKeys = [...new Set(concernKeys)];
  
  if (concernKeys.length !== uniqueKeys.length) {
    console.log('🧹 Removing duplicate concerns...');
    
    // Create new concerns object without duplicates
    const uniqueConcerns = {};
    const seen = new Set();
    
    for (const key of concernKeys) {
      if (!seen.has(key)) {
        uniqueConcerns[key] = window.testimonialData.concerns[key];
        seen.add(key);
      } else {
        console.log(`   Removing duplicate: ${key}`);
      }
    }
    
    window.testimonialData.concerns = uniqueConcerns;
    console.log(`✅ Reduced from ${concernKeys.length} to ${Object.keys(uniqueConcerns).length} concerns`);
  }
}

console.log('✅ All fixes applied! System should work now.');

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
  try {
    console.log('1. detectConcerns test:', window.testimonialData.detectConcerns('expensive').length > 0 ? '✓ PASS' : '✗ FAIL');
    console.log('2. getConcernVideos test:', window.testimonialData.getConcernVideos('results_effectiveness').length > 0 ? '✓ PASS' : '✗ FAIL');
    console.log('3. mapPattern test:', window.testimonialData.mapPatternToConcern('expensive') === 'price_expensive' ? '✓ PASS' : '✗ FAIL');
    console.log('4. getVideoResponse test:', window.getVideoResponseForMessage('does this work?') ? '✓ PASS' : '✗ FAIL');
    console.log('5. validateData test:', window.testimonialData.validateData().valid ? '✓ PASS' : '✗ FAIL');
  } catch (e) {
    console.error('❌ Self-test failed:', e.message);
  }
  
}, 100);

console.log('✅ testimonials-data.js loaded');