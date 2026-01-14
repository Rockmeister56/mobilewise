// ===================================================
// 🎬 ENHANCED TESTIMONIAL SYSTEM DATA
// Generated: 1/14/2026
// Version: 5.0-enhanced-concerns-complete-fixed
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
  "__version": "5.0-enhanced-concerns-complete-fixed",
  "__generated": "2026-01-14T00:00:00.000Z",
  "__notes": "Enhanced concerns system with complete functionality"
};

// ===================================================
// 🎯 IMMEDIATE CLEANUP: REMOVE "TEST" GROUP IF IT EXISTS
// ===================================================

// Remove any lingering "test" group immediately
if (window.testimonialData.groups && window.testimonialData.groups.test) {
  console.log('🧹 Removing lingering "test" group from data...');
  delete window.testimonialData.groups.test;
  
  // Update statistics
  window.testimonialData.statistics.totalGroups = Object.keys(window.testimonialData.groups).length;
  const testimonialGroups = Object.values(window.testimonialData.groups).filter(g => g.type === 'testimonial').length;
  const informationalGroups = Object.values(window.testimonialData.groups).filter(g => g.type === 'informational').length;
  window.testimonialData.statistics.totalTestimonialGroups = testimonialGroups;
  window.testimonialData.statistics.totalInformationalGroups = informationalGroups;
  
  console.log('✅ "test" group removed. Updated stats:', {
    totalGroups: window.testimonialData.statistics.totalGroups,
    testimonialGroups: window.testimonialData.statistics.totalTestimonialGroups,
    informationalGroups: window.testimonialData.statistics.totalInformationalGroups
  });
}

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

// 🎯 Validate data integrity - FIXED VERSION
window.testimonialData.validateData = function() {
  console.log('🔧 Validating enhanced testimonial data...');
  
  let errors = [];
  let warnings = [];
  
  // Check groups - FIXED: Properly check for undefined/null/empty string
  for (const [id, group] of Object.entries(this.groups)) {
    if (!group.name || group.name === 'undefined' || group.name.trim() === '') {
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
  
  // Check for the problematic group "test" and remove it if it exists
  if (this.groups.test) {
    console.warn('⚠️ Found invalid group "test" with name "undefined". Removing it...');
    delete this.groups.test;
    warnings.push('Removed invalid group: "test"');
    
    // Update statistics
    this.statistics.totalGroups = Object.keys(this.groups).length;
    this.statistics.totalTestimonialGroups = Object.values(this.groups).filter(g => g.type === 'testimonial').length;
    this.statistics.totalInformationalGroups = Object.values(this.groups).filter(g => g.type === 'informational').length;
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
// 🎬 VIDEO PLAYER & UI FUNCTIONS (From Original File)
// ===================================================

// 🎬 Main video player function
window.playTestimonialVideoWithOverlay = function(videoData, autoClose = true) {
  console.log('🎬 Playing video:', videoData.title);
  
  // Check if video exists
  if (!videoData || !videoData.videoUrl) {
    console.error('❌ Invalid video data provided');
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
  
  // Increment view count
  if (videoData.id) {
    const videoEntry = window.testimonialData.videos[videoData.id];
    if (videoEntry) {
      videoEntry.views = (videoEntry.views || 0) + 1;
      // Also update group view count
      const group = window.testimonialData.groups[videoEntry.groupId];
      if (group) {
        group.viewCount = (group.viewCount || 0) + 1;
      }
      // Update statistics
      window.testimonialData.statistics.totalViews += 1;
    }
  }
  
  // Escape key to close
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeVideo();
      document.removeEventListener('keydown', escHandler);
    }
  });
};

// 📱 Responsive video player
window.showResponsiveTestimonial = function(videoId) {
  const videoData = window.testimonialData.videos[videoId];
  if (!videoData) {
    console.error('Video not found:', videoId);
    return;
  }
  
  const isMobile = window.innerWidth <= 768;
  const config = window.testimonialData.playerConfig;
  
  if (isMobile && config.mobile.fullscreen) {
    // Use fullscreen mobile player
    const video = document.createElement('video');
    video.src = videoData.videoUrl;
    video.controls = true;
    video.autoplay = true;
    video.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      background: #000;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 28px;
      z-index: 1000000;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      background: #000;
    `;
    
    container.appendChild(video);
    container.appendChild(closeBtn);
    document.body.appendChild(container);
    
    closeBtn.onclick = () => document.body.removeChild(container);
    document.body.style.overflow = 'hidden';
    
  } else {
    // Use overlay player for desktop
    window.playTestimonialVideoWithOverlay(videoData);
  }
};

// 🎯 AI Response Integration
window.getVideoResponseForMessage = function(userMessage) {
  const concerns = window.testimonialData.detectConcerns(userMessage);
  
  if (concerns.length === 0) {
    console.log('No concerns detected, showing general info');
    return {
      video: window.testimonialData.getConcernVideos('general_info')[0],
      concern: window.testimonialData.concerns.general_info,
      confidence: 0.3
    };
  }
  
  // Sort by confidence (all are 1.0 but we might add scoring later)
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
  
  // Fallback to informational video if no testimonial found
  const infoVideos = Object.values(window.testimonialData.videos)
    .filter(v => v.type === 'informational');
    
  if (infoVideos.length > 0) {
    return {
      video: infoVideos[0],
      concern: topConcern,
      confidence: 0.5,
      isFallback: true
    };
  }
  
  return null;
};

// 🎬 Play video based on user message
window.playRelevantTestimonial = function(userMessage) {
  const response = window.getVideoResponseForMessage(userMessage);
  
  if (response && response.video) {
    console.log('🎯 Playing relevant testimonial:', {
      concern: response.concern.concernTitle,
      video: response.video.title,
      confidence: response.confidence
    });
    
    window.showResponsiveTestimonial(response.video.id);
    
    return {
      success: true,
      concern: response.concern,
      video: response.video,
      confidence: response.confidence
    };
  }
  
  console.log('❌ No relevant video found for message:', userMessage);
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
    },
    mostViewed: Object.values(window.testimonialData.videos)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
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

// 🔧 Initialize testimonial system - FIXED VERSION
window.initializeTestimonialSystem = function() {
  console.log('🚀 Initializing Enhanced Testimonial System v5.0');
  
  // Validate data - but don't fail on warnings
  const validation = window.testimonialData.validateData();
  
  if (validation.errors.length > 0) {
    console.error('❌ Testimonial system initialization failed due to data errors:', validation.errors);
    
    // Try to auto-fix common errors
    if (validation.errors.some(err => err.includes('has invalid name'))) {
      console.warn('⚠️ Attempting to fix invalid groups...');
      // Remove groups with invalid names
      for (const [id, group] of Object.entries(window.testimonialData.groups)) {
        if (!group.name || group.name === 'undefined' || group.name.trim() === '') {
          console.warn(`Removing group "${id}" with invalid name: "${group.name}"`);
          delete window.testimonialData.groups[id];
        }
      }
      // Re-run validation
      const fixedValidation = window.testimonialData.validateData();
      if (fixedValidation.errors.length === 0) {
        console.log('✅ Auto-fix successful! System initialized.');
        return true;
      }
    }
    
    return false;
  }
  
  // Warnings are okay, just log them
  if (validation.warnings.length > 0) {
    console.warn('⚠️ System initialized with warnings:', validation.warnings);
  }
  
  // Set up global shortcut (if needed)
  window.showTestimonial = window.showResponsiveTestimonial;
  window.findTestimonial = window.getVideoResponseForMessage;
  
  console.log('✅ Testimonial system initialized successfully');
  console.log('   Available concerns:', Object.keys(window.testimonialData.concerns).length);
  console.log('   Available videos:', window.testimonialData.statistics.totalVideos);
  console.log('   Total views:', window.testimonialData.statistics.totalViews);
  
  return true;
};

// ===================================================
// 📝 INITIALIZATION & LOGGING
// ===================================================

// Auto-initialize on load
setTimeout(() => {
  console.log('🚀 ENHANCED TESTIMONIAL SYSTEM LOADING...');
  console.log(`   Version: ${window.testimonialData.__version}`);
  console.log(`   Groups: ${window.testimonialData.statistics.totalGroups} (${window.testimonialData.statistics.totalTestimonialGroups} testimonial, ${window.testimonialData.statistics.totalInformationalGroups} informational)`);
  console.log(`   Videos: ${window.testimonialData.statistics.totalVideos} (${window.testimonialData.statistics.totalTestimonials} testimonials, ${window.testimonialData.statistics.totalInformationalVideos} informational)`);
  console.log(`   Views: ${window.testimonialData.statistics.totalViews}`);
  console.log(`   Enhanced Concerns: ${Object.keys(window.testimonialData.concerns).length} detailed types`);
  
  // Initialize system
  const initialized = window.initializeTestimonialSystem();
  
  if (initialized) {
    console.log('✅ Enhanced Testimonial System loaded successfully!');
  } else {
    console.error('❌ Enhanced Testimonial System failed to initialize!');
  }
}, 100);

// ===================================================
// 📋 EXPORT FOR MODULE SYSTEMS
// ===================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.testimonialData;
}

console.log('✅ Enhanced testimonial-data.js loaded successfully with complete functionality!');