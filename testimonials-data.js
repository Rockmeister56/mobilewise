// ===================================================
// 🎬 CLEAN DUAL VIDEO SYSTEM DATA - FRESH START
// Generated: 1/12/2026
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
  "testimonialGroups": {
    // EMPTY - READY FOR YOU TO ADD NEW GROUPS
    // Example structure when you add groups:
    // "group_unique_id_here": {
    //   "id": "group_unique_id_here",
    //   "type": "testimonial",
    //   "name": "Your Group Name",
    //   "slug": "your-group-slug",
    //   "icon": "📁",
    //   "description": "Description of this testimonial group",
    //   "concerns": ["results", "trust"], // Which concerns this group addresses
    //   "testimonials": [], // Empty array - will be filled with testimonials
    //   "createdAt": "2026-01-12T00:00:00.000Z",
    //   "viewCount": 0
    // }
  },

  // ========================
  // 📚 INFORMATIONAL VIDEOS ONLY (Educational)
  // ========================
  "informationalGroups": {
    // EMPTY - READY FOR YOU TO ADD NEW GROUPS
    // Example structure when you add groups:
    // "group_info_unique_id": {
    //   "id": "group_info_unique_id",
    //   "type": "informational",
    //   "name": "📚 Your Info Group Name",
    //   "slug": "info-group-slug",
    //   "icon": "📚",
    //   "description": "Description of this informational group",
    //   "concerns": ["general", "results"],
    //   "videos": [], // Empty array - will be filled with informational videos
    //   "createdAt": "2026-01-12T00:00:00.000Z",
    //   "viewCount": 0
    // }
  },

  "statistics": {
    "totalTestimonialGroups": 0, // Start from zero
    "totalInformationalGroups": 0, // Start from zero
    "totalTestimonials": 0, // Start from zero
    "totalInformationalVideos": 0 // Start from zero
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

  "__version": "3.0-dual-system-clean",
  "__generated": "2026-01-12T00:00:00.000Z",
  "__notes": "Fresh clean slate - no hardcoded groups or testimonials"
};

// ===================================================
// INITIALIZATION FOR FRESH START
// ===================================================

console.log('✅ CLEAN DUAL VIDEO SYSTEM LOADED:');
console.log('   📊 Starting fresh with empty groups');
console.log('   ⭐ Ready for you to create new testimonial groups');
console.log('   📚 Ready for you to create new informational groups');

// ===================================================
// HELPER FUNCTIONS FOR NEW SYSTEM
// ===================================================

// Initialize empty structure if needed
window.initializeFreshTestimonialData = function() {
  console.log('🔄 Initializing fresh testimonial data structure...');
  
  if (!window.testimonialData.testimonialGroups) {
    window.testimonialData.testimonialGroups = {};
  }
  
  if (!window.testimonialData.informationalGroups) {
    window.testimonialData.informationalGroups = {};
  }
  
  if (!window.testimonialData.statistics) {
    window.testimonialData.statistics = {
      totalTestimonialGroups: 0,
      totalInformationalGroups: 0,
      totalTestimonials: 0,
      totalInformationalVideos: 0
    };
  }
  
  console.log('✅ Fresh data structure initialized');
  return window.testimonialData;
};

// Generate unique ID for new groups
window.generateGroupId = function(type = 'testimonial') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${type === 'informational' ? 'info' : 'group'}_${timestamp}_${random}`;
};

// Generate unique ID for new testimonials/videos
window.generateTestimonialId = function(type = 'testimonial') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${type === 'informational' ? 'info' : 'testimonial'}_${timestamp}_${random}`;
};

// Create a new testimonial group
window.createNewTestimonialGroup = function(name, description, icon = '📁', concerns = []) {
  const groupId = generateGroupId('testimonial');
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const newGroup = {
    id: groupId,
    type: 'testimonial',
    name: name,
    slug: slug,
    icon: icon,
    description: description || `Testimonials about ${name}`,
    concerns: concerns.length > 0 ? concerns : ['general'],
    testimonials: [], // Empty array - ready for testimonials
    createdAt: new Date().toISOString(),
    viewCount: 0
  };
  
  window.testimonialData.testimonialGroups[groupId] = newGroup;
  window.testimonialData.statistics.totalTestimonialGroups++;
  
  console.log(`✅ Created new testimonial group: "${name}" (${groupId})`);
  return newGroup;
};

// Create a new informational group
window.createNewInformationalGroup = function(name, description, icon = '📚', concerns = []) {
  const groupId = generateGroupId('informational');
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const newGroup = {
    id: groupId,
    type: 'informational',
    name: name,
    slug: slug,
    icon: icon,
    description: description || `Informational videos about ${name}`,
    concerns: concerns.length > 0 ? concerns : ['general'],
    videos: [], // Empty array - ready for videos
    createdAt: new Date().toISOString(),
    viewCount: 0
  };
  
  window.testimonialData.informationalGroups[groupId] = newGroup;
  window.testimonialData.statistics.totalInformationalGroups++;
  
  console.log(`✅ Created new informational group: "${name}" (${groupId})`);
  return newGroup;
};

// Add a testimonial to a group
window.addTestimonialToGroup = function(groupId, title, videoUrl, author, concernType = 'general', text = '') {
  const group = window.testimonialData.testimonialGroups[groupId];
  if (!group) {
    console.error(`❌ Group not found: ${groupId}`);
    return null;
  }
  
  const testimonialId = generateTestimonialId('testimonial');
  
  const newTestimonial = {
    id: testimonialId,
    title: title,
    concernType: concernType,
    videoUrl: videoUrl,
    author: author,
    text: text || '',
    addedAt: new Date().toISOString(),
    views: 0
  };
  
  group.testimonials.push(newTestimonial);
  window.testimonialData.statistics.totalTestimonials++;
  
  console.log(`✅ Added testimonial "${title}" to group "${group.name}"`);
  return newTestimonial;
};

// Add an informational video to a group
window.addInformationalVideoToGroup = function(groupId, title, videoUrl, description, concernType = 'general') {
  const group = window.testimonialData.informationalGroups[groupId];
  if (!group) {
    console.error(`❌ Informational group not found: ${groupId}`);
    return null;
  }
  
  const videoId = generateTestimonialId('informational');
  
  const newVideo = {
    id: videoId,
    title: title,
    concernType: concernType,
    videoUrl: videoUrl,
    author: 'System Explanation',
    description: description || '',
    addedAt: new Date().toISOString(),
    views: 0
  };
  
  group.videos.push(newVideo);
  window.testimonialData.statistics.totalInformationalVideos++;
  
  console.log(`✅ Added informational video "${title}" to group "${group.name}"`);
  return newVideo;
};

// Get sample group data for testing
window.getSampleGroupData = function() {
  return {
    testimonial: {
      name: "Client Success Stories",
      description: "Real stories from satisfied clients",
      icon: "⭐",
      concerns: ["results", "trust", "general"]
    },
    informational: {
      name: "📚 How It Works",
      description: "Educational videos explaining our system",
      icon: "📚",
      concerns: ["general", "results", "time"]
    }
  };
};

// ===================================================
// PLAYER FUNCTIONS (KEEP THESE - THEY WORK)
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
// READY TO USE
// ===================================================

console.log('\n🚀 SYSTEM READY FOR FRESH START');
console.log('================================');
console.log('Available functions:');
console.log('• initializeFreshTestimonialData() - Ensures clean structure');
console.log('• createNewTestimonialGroup(name, description, icon, concerns)');
console.log('• createNewInformationalGroup(name, description, icon, concerns)');
console.log('• addTestimonialToGroup(groupId, title, videoUrl, author, concernType, text)');
console.log('• addInformationalVideoToGroup(groupId, title, videoUrl, description, concernType)');
console.log('• getSampleGroupData() - Returns sample data for testing');
console.log('\n📊 Current stats:');
console.log(`   Testimonial Groups: ${window.testimonialData.statistics.totalTestimonialGroups}`);
console.log(`   Informational Groups: ${window.testimonialData.statistics.totalInformationalGroups}`);
console.log(`   Total Testimonials: ${window.testimonialData.statistics.totalTestimonials}`);
console.log(`   Total Informational Videos: ${window.testimonialData.statistics.totalInformationalVideos}`);

// Auto-initialize
window.initializeFreshTestimonialData();