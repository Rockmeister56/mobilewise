// ===================================================
// TESTIMONIAL MANAGER JS - GROUPS SYSTEM
// ===================================================

// ===================================================
// 🧩 COMPATIBILITY LAYER FOR TESTIMONIAL MANAGER
// Add this to the TOP of testimonial-manager.js
// ===================================================

console.log('🔄 Loading compatibility layer...');

// 1. BACKWARD COMPATIBILITY: Convert old format to new format if needed
function ensureCompatibleStructure(existingData) {
    console.log('🔄 Checking data compatibility...');
    
    if (!existingData) {
        console.log('✅ No existing data, using new structure');
        return {
            concerns: {},  // Will be populated by ENHANCED_CONCERNS
            groups: {},    // New unified groups structure
            videos: {},    // Separate videos collection
            statistics: {
                totalGroups: 0,
                totalTestimonialGroups: 0,
                totalInformationalGroups: 0,
                totalVideos: 0,
                totalTestimonials: 0,
                totalInformationalVideos: 0,
                totalViews: 0
            }
        };
    }
    
    // Check if this is OLD format (concerns have .reviews)
    const isOldFormat = Object.values(existingData.concerns || {}).some(
        concern => concern.reviews && Array.isArray(concern.reviews)
    );
    
    if (!isOldFormat) {
        console.log('✅ Data is already in new format');
        return existingData;
    }
    
    console.log('🔄 Converting old format to new format...');
    
    // Convert OLD → NEW format
    const convertedData = {
        concerns: {},
        groups: {},
        videos: {},
        statistics: existingData.statistics || {
            totalGroups: 0,
            totalVideos: 0,
            totalViews: 0
        }
    };
    
    // Convert concerns (old simple → new enhanced)
    Object.entries(existingData.concerns || {}).forEach(([key, oldConcern]) => {
        const newKey = convertConcernKey(key); // e.g., "price" → "price_cost"
        
        convertedData.concerns[newKey] = {
            title: oldConcern.title || key,
            icon: oldConcern.icon || '❓',
            type: 'testimonial', // Default
            triggers: oldConcern.phrases || [],
            description: oldConcern.description || oldConcern.title || key
        };
        
        // Convert old reviews to videos
        if (oldConcern.reviews && Array.isArray(oldConcern.reviews)) {
            oldConcern.reviews.forEach((review, index) => {
                const videoId = `video_${newKey}_${index}`;
                
                convertedData.videos[videoId] = {
                    id: videoId,
                    title: `Testimonial: ${oldConcern.title}`,
                    author: review.author || 'Anonymous',
                    text: review.text || '',
                    type: 'testimonial',
                    concernType: newKey,
                    videoType: oldConcern.videoType || 'skeptical',
                    groupId: 'legacy_group', // Put in a legacy group
                    views: 0,
                    addedAt: new Date().toISOString()
                };
            });
        }
    });
    
    // Create a legacy group to hold converted videos
    convertedData.groups.legacy_group = {
        id: 'legacy_group',
        type: 'testimonial',
        name: 'Legacy Testimonials',
        slug: 'legacy-testimonials',
        icon: '📼',
        description: 'Converted from old testimonial system',
        primaryConcern: 'general_info',
        concerns: Object.keys(convertedData.concerns),
        videoIds: Object.keys(convertedData.videos),
        createdAt: new Date().toISOString(),
        viewCount: 0
    };
    
    // Update statistics
    convertedData.statistics.totalGroups = 1;
    convertedData.statistics.totalTestimonialGroups = 1;
    convertedData.statistics.totalVideos = Object.keys(convertedData.videos).length;
    convertedData.statistics.totalTestimonials = Object.keys(convertedData.videos).length;
    
    console.log(`✅ Converted: ${Object.keys(existingData.concerns).length} concerns → ${Object.keys(convertedData.concerns).length} concerns`);
    const oldReviewCount = Object.values(existingData.concerns || {}).reduce(
    (total, concern) => total + (concern.reviews?.length || 0), 
    0
);
console.log(`✅ Converted: ${oldReviewCount} reviews → ${Object.keys(convertedData.videos).length} videos`);
    
    return convertedData;
}


// Helper: Convert old concern keys to new ones
function convertConcernKey(oldKey) {
    const mapping = {
        'price': 'price_cost',
        'time': 'time_speed', 
        'trust': 'trust_legitimacy',
        'general': 'general_info',
        'results': 'results_effectiveness'
    };
    return mapping[oldKey] || oldKey;
}

// Add to the top of your compatibility layer
function ensureConcernTypes() {
    console.log('🔧 Ensuring concern types...');
    
    if (!window.testimonialData?.concerns) return;
    
    Object.values(window.testimonialData.concerns).forEach(concern => {
        // Add 'type' property if missing
        if (!concern.type) {
            concern.type = concern.isInformational ? 'informational' : 'testimonial';
        }
        
        // Also ensure triggers exist
        if (!concern.triggers) {
            concern.triggers = concern.phrases || [];
        }
    });
    
    console.log('✅ Concern types updated');
}

// ===========================================
// FIX FOR TRIGGER CONTAINER ERRORS
// Add this to your testimonial-manager.js or in a separate script tag
// ===========================================

(function() {
    console.log('🔧 Applying trigger container fix...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFix);
    } else {
        applyFix();
    }
    
    function applyFix() {
        // Patch updateTriggerSections if it exists
        if (window.updateTriggerSections) {
            const originalUpdate = window.updateTriggerSections;
            window.updateTriggerSections = function() {
                console.log('🔄 updateTriggerSections called (patched)');
                
                // Look for the containers in the new structure
                const testimonialContainer = document.getElementById('testimonialTriggersCheckboxes');
                const informationalContainer = document.getElementById('informationalTriggersCheckboxes');
                
                if (testimonialContainer || informationalContainer) {
                    console.log('✅ Found trigger containers in new structure');
                    return true;
                }
                
                // Fall back to original function
                return originalUpdate.apply(this, arguments);
            };
        }
        
        // Patch populateTriggersSections if it exists
        if (window.populateTriggersSections) {
            const originalPopulate = window.populateTriggersSections;
            window.populateTriggersSections = function() {
                console.log('🔄 populateTriggersSections called (patched)');
                
                // Check if we have the new structure
                const container = document.getElementById('concernsCheckboxContainer');
                if (container) {
                    console.log('✅ Using new trigger container structure');
                    // The triggers are already hardcoded in HTML, so just return success
                    return true;
                }
                
                // Fall back to original function
                return originalPopulate.apply(this, arguments);
            };
        }
        
        console.log('✅ Trigger container fix applied');
    }
})();

// Helper: Convert old concern keys to new ones
function convertConcernKey(oldKey) {
    const mapping = {
        'price': 'price_cost',
        'time': 'time_speed', 
        'trust': 'trust_legitimacy',
        'general': 'general_info',
        'results': 'results_effectiveness'
    };
    return mapping[oldKey] || oldKey;
}

// Add to the top of your compatibility layer
function ensureConcernTypes() {
    console.log('🔧 Ensuring concern types...');
    
    if (!window.testimonialData?.concerns) return;
    
    Object.values(window.testimonialData.concerns).forEach(concern => {
        // Add 'type' property if missing
        if (!concern.type) {
            concern.type = concern.isInformational ? 'informational' : 'testimonial';
        }
        
        // Also ensure triggers exist
        if (!concern.triggers) {
            concern.triggers = concern.phrases || [];
        }
    });
    
    console.log('✅ Concern types updated');
}

// 2. INTEGRATE WITH MANAGER'S initializeTestimonialData()
const originalInitializeTestimonialData = window.initializeTestimonialData;
window.initializeTestimonialData = function() {
    console.log('🚀 Initializing with compatibility layer...');
    
    // First, apply compatibility fix
    if (window.testimonialData) {
        window.testimonialData = ensureCompatibleStructure(window.testimonialData);
    }
    
    // Then run the original initialization
    if (typeof originalInitializeTestimonialData === 'function') {
        return originalInitializeTestimonialData();
    }
    
    // Fallback if original doesn't exist
    console.log('⚠️ Using compatibility layer fallback initialization');
    
    // Ensure ENHANCED_CONCERNS exists
    if (!window.ENHANCED_CONCERNS) {
        window.ENHANCED_CONCERNS = window.testimonialData?.concerns || {};
    }
    
    // Merge concerns (ENHANCED_CONCERNS takes priority)
    if (window.testimonialData) {
        window.testimonialData.concerns = {
            ...window.testimonialData.concerns,
            ...window.ENHANCED_CONCERNS
        };
    }
    
    return window.testimonialData;
};

console.log('✅ Compatibility layer loaded');

// ===================================================
// 🩹 MINIMAL DATA STRUCTURE PATCH
// (Add this to the TOP of your existing file)
// ===================================================

// Fix: Always use unified 'groups' structure
window.fixTestimonialData = function() {
    console.log('🔧 Applying minimal data fixes...');
    
    if (!window.testimonialData) {
        window.testimonialData = {};
    }
    
    const data = window.testimonialData;
    
    // 1. Ensure groups exists
    if (!data.groups) {
        data.groups = {};
    }
    
    // 2. Migrate testimonialGroups if exists
    if (data.testimonialGroups) {
        Object.entries(data.testimonialGroups).forEach(([id, group]) => {
            if (!data.groups[id]) {
                data.groups[id] = {
                    ...group,
                    type: group.type || 'testimonial',
                    videoIds: group.videoIds || group.testimonials || []
                };
            }
        });
        console.log('✅ Migrated testimonialGroups to unified groups');
    }
    
    // 3. Migrate informationalGroups if exists
    if (data.informationalGroups) {
        Object.entries(data.informationalGroups).forEach(([id, group]) => {
            if (!data.groups[id]) {
                data.groups[id] = {
                    ...group,
                    type: 'informational',
                    videoIds: group.videoIds || group.testimonials || []
                };
            }
        });
        console.log('✅ Migrated informationalGroups to unified groups');
    }
    
    // 4. Clean up any group with old structure
    Object.values(data.groups).forEach(group => {
        // Fix: testimonials → videoIds
        if (group.testimonials && !group.videoIds) {
            group.videoIds = group.testimonials;
            delete group.testimonials;
        }
        
        // Fix: title → name
        if (group.title && !group.name) {
            group.name = group.title;
        }
        
        // Ensure type
        if (!group.type) {
            group.type = 'testimonial';
        }
    });
    
    console.log('✅ Data structure fixed. Total groups:', Object.keys(data.groups).length);
    return data;
};

// Run on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(window.fixTestimonialData, 100);
});

// Global variables
let currentSelectedGroupId = null;
let testimonialData = window.testimonialData || {};

// ===================================================
// 🎯 IMPROVED SURGICAL FIX - ALLOWS FUNCTIONS, BLOCKS CORRUPTION
// ===================================================

console.log('🛡️ Loading IMPROVED surgical fix...');

// 1. SAVE original data
const originalGroupsData = window.testimonialData ? 
    JSON.parse(JSON.stringify(window.testimonialData.groups || {})) : {};

// 2. INTERCEPT ONLY data corruption, NOT function definitions
const originalDefineProperty = Object.defineProperty;
Object.defineProperty = function(obj, prop, descriptor) {
    // ONLY block attempts to LOCK testimonialData (not define functions on it)
    if (obj === window && prop === 'testimonialData') {
        // Check if this is trying to make testimonialData READ-ONLY
        if (descriptor && (descriptor.get || !descriptor.writable)) {
            console.warn('🛡️ Blocked: Attempt to lock testimonialData as read-only');
            console.log('   Allowing normal property definition instead...');
            
            // Allow normal property assignment instead
            if (descriptor.value) {
                window.testimonialData = descriptor.value;
            }
            return window;
        }
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
};

// 3. PROTECT groups from being set to empty
if (window.testimonialData) {
    const originalGroups = window.testimonialData.groups;
    
    // Store original data safely
    const safeGroups = originalGroups || originalGroupsData;
    
    Object.defineProperty(window.testimonialData, 'groups', {
        get() {
            return this._groups || safeGroups;
        },
        set(newGroups) {
            console.log('🛡️ Groups assignment attempt detected');
            
            // ALLOW normal assignments (adding/removing groups)
            if (newGroups && typeof newGroups === 'object') {
                // BLOCK: Setting to empty when we have data
                if (Object.keys(newGroups).length === 0 && 
                    safeGroups && Object.keys(safeGroups).length > 0) {
                    console.error('🛡️ CRITICAL: Blocked groups from being set to empty!');
                    console.log('   Keeping original', Object.keys(safeGroups).length, 'groups');
                    this._groups = safeGroups;
                    return safeGroups;
                }
                
                // BLOCK: Adding "test" group
                if (newGroups.test) {
                    console.error('🛡️ CRITICAL: Blocked "test" group creation!');
                    delete newGroups.test;
                }
                
                console.log('✅ Allowing groups update:', Object.keys(newGroups).length, 'groups');
                this._groups = newGroups;
                return newGroups;
            }
            
            // Fallback
            this._groups = newGroups;
            return newGroups;
        },
        enumerable: true,
        configurable: true
    });
    
    // Initialize
    window.testimonialData._groups = safeGroups;
}

// 4. MONITOR for "test" group (safety net)
setInterval(() => {
    if (window.testimonialData?.groups?.test) {
        console.error('🚨 EMERGENCY: "test" group found! Removing...');
        delete window.testimonialData.groups.test;
    }
}, 2000);

console.log('✅ Improved surgical fix active');
console.log('   Protecting', Object.keys(originalGroupsData).length, 'groups');
console.log('   ALLOWING function definitions');

// ===================================================
// 🔧 SIMPLE BUTTON FIX
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
    // Fix the "Add Video Group" button
    const addGroupBtn = document.getElementById('addTestimonialGroupBtn');
    if (addGroupBtn) {
        // Remove any existing onclick
        addGroupBtn.onclick = null;
        addGroupBtn.removeAttribute('onclick');
        
        // Add simple click handler
        addGroupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎬 Opening group creator');
            
            // Use our fixed clearGroupForm function
            if (typeof clearGroupForm === 'function') {
                clearGroupForm();
            } else {
                // Fallback
                const modal = document.getElementById('addTestimonialGroupModal');
                if (modal) modal.style.display = 'flex';
            }
        });
        
        console.log('✅ Fixed Add Video Group button');
    }
});

// ===================================================
// 🚀 COMPLETE GROUP CREATOR FIX (UPDATED)
// ===================================================

// 1. Make functions global - BUT DON'T DEFINE showAddTestimonialGroupModal HERE
// It will be defined properly later in the file

// Keep clearGroupForm - it just calls showAddTestimonialGroupModal
window.clearGroupForm = function() {
    console.log('🧹 Clearing form');
    if (typeof window.showAddTestimonialGroupModal === 'function') {
        return window.showAddTestimonialGroupModal();
    }
    console.error('❌ showAddTestimonialGroupModal not found');
    return false;
};

// Keep addNewTestimonialGroup
window.addNewTestimonialGroup = function() {
    console.log('🏗️ Creating group (simple)');
    
    const name = document.getElementById('newGroupName')?.value.trim();
    if (!name) {
        alert('Enter group name');
        return;
    }
    
    const group = {
        id: 'group_' + Date.now(),
        name: name,
        type: document.getElementById('newGroupType')?.value || 'testimonial',
        videos: []
    };
    
    if (!window.testimonialData.groups) window.testimonialData.groups = {};
    window.testimonialData.groups[group.id] = group;
    
    alert(`✅ Group "${name}" created!`);
    document.getElementById('addTestimonialGroupModal').style.display = 'none';
    
    return group;
};

// 2. Fix GroupCreator - but make it use the enhanced version
window.GroupCreator = class GroupCreator {
    show() { 
        if (typeof window.showAddTestimonialGroupModal === 'function') {
            return window.showAddTestimonialGroupModal();
        }
        console.error('❌ showAddTestimonialGroupModal not found');
        return false;
    }
    hide() { 
        const modal = document.getElementById('addTestimonialGroupModal');
        if (modal) modal.style.display = 'none';
    }
};

// 3. Fix button - defer to when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('addTestimonialGroupBtn');
    if (btn) {
        btn.onclick = function() { 
            if (typeof window.showAddTestimonialGroupModal === 'function') {
                window.showAddTestimonialGroupModal();
            } else {
                console.error('❌ showAddTestimonialGroupModal not available');
            }
        };
    }
    
    console.log('✅ Group creator system ready');
    console.log('💡 Click "Add Video Group" or run: showAddTestimonialGroupModal()');
});

// ===================================================
// 🎯 MINIMAL GROUP CREATOR (Fixes line 1115 error) - REMOVED (duplicate)
// ===================================================
/*
if (typeof GroupCreator === 'undefined') {
    class GroupCreator {
        constructor() {
            console.log('🔧 GroupCreator defined');
        }
        
        show() {
            console.log('🎬 GroupCreator.show() called');
            return clearGroupForm(); // Use our fixed function
        }
        
        hide() {
            if (typeof hideAddTestimonialGroupModal === 'function') {
                return hideAddTestimonialGroupModal();
            }
            return false;
        }
    }
    
    window.GroupCreator = GroupCreator;
    console.log('✅ GroupCreator now defined');
}
*/

// Fix only the problematic elements
function fixSpecificElements() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) return;
    
    // 1. Fix the container background (rgb(249, 250, 251))
    const containers = modal.querySelectorAll('.concerns-checkbox-container');
    containers.forEach(el => {
        el.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        console.log('Fixed container');
    });
    
    // 2. Fix checkbox items (background: white)
    const checkboxItems = modal.querySelectorAll('.concern-checkbox-item');
    checkboxItems.forEach(el => {
        el.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        el.style.color = 'white';
        console.log('Fixed checkbox item');
    });
    
    // 3. Fix subgroup backgrounds (rgba(0, 0, 0, 0.03))
    const subgroups = modal.querySelectorAll('.concern-subgroup');
    subgroups.forEach(el => {
        el.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
        console.log('Fixed subgroup');
    });
    
    // 4. Fix dark text colors (rgb(55, 65, 81) and rgb(107, 114, 128))
    const darkTexts = modal.querySelectorAll('.concern-subgroup-title, .concern-keywords, .concern-checkbox-label');
    darkTexts.forEach(el => {
        if (window.getComputedStyle(el).color.includes('55, 65, 81') || 
            window.getComputedStyle(el).color.includes('107, 114, 128')) {
            el.style.color = 'rgba(255, 255, 255, 0.8)';
            console.log('Fixed text color on:', el.className);
        }
    });
    
    console.log('✅ All specific elements fixed');
}

// Run it
fixSpecificElements();

// ===================================================
// 🎯 DATA INTEGRITY CHECK (Run on load)
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Surgical fix: DOM loaded, checking data...');
    
    // Final check
    if (window.testimonialData?.groups?.test) {
        console.error('🚨 FINAL CHECK: "test" group still exists! Removing...');
        delete window.testimonialData.groups.test;
    }
    
    console.log('✅ Surgical fix ready');
    console.log('   Groups:', Object.keys(window.testimonialData?.groups || {}));
});

// ===================================================
// END IMPROVED SURGICAL FIX
// ===================================================

// ===================================================
// INITIALIZATION
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Testimonial Manager Initializing...');
    
    // Initialize data structure
    initializeTestimonialData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load and display data
    loadAndDisplayData();
    
    // Update code output
    updateCodeOutput();
    
    console.log('✅ Testimonial Manager Ready');
});

// ===================================================
// 🎯 ENHANCED CONCERNS DATA (MUST BE AT TOP OF FILE)
// ===================================================

const ENHANCED_CONCERNS = {
    // TESTIMONIAL CONCERNS
    "price_expensive": {
        title: "Expensive",
        icon: "💰",
        type: "testimonial",
        triggers: ["expensive", "too much", "high price", "overpriced"],
        description: "See what others say about expensive concerns"
    },
    "price_cost": {
        title: "Cost/Price",
        icon: "💰",
        type: "testimonial",
        triggers: ["cost", "price", "pricing", "how much"],
        description: "Hear from clients about pricing questions"
    },
    "price_affordability": {
        title: "Affordability",
        icon: "💰",
        type: "testimonial",
        triggers: ["afford", "budget", "money", "worth it"],
        description: "Hear from clients about affordability"
    },
    "time_busy": {
        title: "Too Busy",
        icon: "⏰",
        type: "testimonial",
        triggers: ["busy", "no time", "hectic", "overwhelmed"],
        description: "Hear from busy professionals"
    },
    "time_speed": {
        title: "Speed/Timing",
        icon: "⏰",
        type: "testimonial",
        triggers: ["time", "when", "long", "fast", "quick"],
        description: "Hear about time-saving experiences"
    },
    "trust_skepticism": {
        title: "Skepticism",
        icon: "🤝",
        type: "testimonial",
        triggers: ["skeptical", "not sure", "doubt", "unsure"],
        description: "Real stories from former skeptics"
    },
    "trust_legitimacy": {
        title: "Legitimacy",
        icon: "🤝",
        type: "testimonial",
        triggers: ["scam", "real", "legit", "trust", "believe"],
        description: "Real client trust experiences"
    },
    "results_effectiveness": {
        title: "Effectiveness",
        icon: "📈",
        type: "testimonial",
        triggers: ["work", "actually work", "results", "effective"],
        description: "See the results others got"
    },
    "results_worry": {
        title: "Worry/Concern",
        icon: "📈",
        type: "testimonial",
        triggers: ["worried", "concerned", "afraid", "nervous"],
        description: "How others overcame concerns"
    },
    "general_info": {
        title: "General Information",
        icon: "⭐",
        type: "testimonial",
        triggers: ["information", "details", "explain", "how it works", "what is"],
        description: "What our clients say generally"
    },
    "general_demo": {
        title: "Demo Request",
        icon: "⭐",
        type: "testimonial",
        triggers: ["show me", "demonstrate", "demo", "see it", "watch"],
        description: "Client demo experiences"
    },
    
    // INFORMATIONAL CONCERNS (Add at least 2 for testing)
    "info_conversions_boost": {
        title: "Conversion Boost",
        icon: "📈",
        type: "informational",
        triggers: ["300%", "triple", "more conversions", "boost sales"],
        description: "How to get 300% more conversions"
    },
    "info_pre_qualified": {
        title: "Pre-Qualified Leads",
        icon: "🔥",
        type: "informational",
        triggers: ["pre qualified", "qualified leads", "hot leads"],
        description: "How to get pre-qualified hot leads"
    }
};

// ===================================================
// 🎯 UNIFIED TRIGGER SYSTEM (ADD THIS AFTER ENHANCED_CONCERNS)
// ===================================================

window.triggerSystem = {
  // These will be populated from your ENHANCED_CONCERNS
  testimonialTriggers: {},
  informationalTriggers: {},
  
  // METHODS
  getTriggersByType: function(type) {
    return type === 'testimonial' ? this.testimonialTriggers : this.informationalTriggers;
  },
  
  initialize: function() {
    console.log('🎯 Initializing trigger system...');
    
    // First ensure ENHANCED_CONCERNS exists
    ensureCleanConcerns();
    
    // Then populate triggers
    this.populateFromEnhancedConcerns();
    
    console.log(`✅ Trigger system ready: ${Object.keys(this.testimonialTriggers).length} testimonial, ${Object.keys(this.informationalTriggers).length} informational triggers`);
  },
  
  populateFromEnhancedConcerns: function() {
    console.log('📥 Loading triggers from ENHANCED_CONCERNS...');
    
    // Clear existing
    this.testimonialTriggers = {};
    this.informationalTriggers = {};
    
    // Get concerns from ENHANCED_CONCERNS
    const concerns = window.ENHANCED_CONCERNS || window.testimonialData?.concerns || {};
    
    for (const [key, concern] of Object.entries(concerns)) {
      // Determine type
      const isInformational = concern.type === 'informational' || key.startsWith('info_');
      
      const triggerData = {
        label: `${concern.icon || (isInformational ? '📚' : '🎬')} ${concern.title}`,
        keywords: concern.triggers || [],
        emoji: concern.icon || (isInformational ? '📚' : '🎬'),
        type: isInformational ? 'informational' : 'testimonial',
        description: concern.description || ''
      };
      
      // Add to appropriate category
      if (isInformational) {
        this.informationalTriggers[key] = triggerData;
      } else {
        this.testimonialTriggers[key] = triggerData;
      }
    }
    
    // Also add MobileWise AI triggers (if not already in ENHANCED_CONCERNS)
    this.addMobileWiseTriggers();
  },
  
  addMobileWiseTriggers: function() {
    // Add informational triggers from MobileWise AI that might not be in ENHANCED_CONCERNS
    const additionalTriggers = {
      // Conversion & Results
      "how_it_works": {
        label: "⚙️ How It Works",
        keywords: ["how does it work", "process", "step by step", "explain", "show me"],
        emoji: "⚙️",
        type: 'informational'
      },
      "podcast": {
        label: "🎙️ Podcast/Audience",
        keywords: ["podcast", "listeners", "audience", "episode", "show"],
        emoji: "🎙️",
        type: 'informational'
      },
      "service_business": {
        label: "🏢 Service Business",
        keywords: ["service business", "consultant", "agency", "freelancer", "b2b"],
        emoji: "🏢",
        type: 'informational'
      },
      "ecommerce": {
        label: "🛒 E-commerce",
        keywords: ["ecommerce", "online store", "shopify", "woocommerce", "cart"],
        emoji: "🛒",
        type: 'informational'
      },
      "setup_easy": {
        label: "🚀 Easy Setup",
        keywords: ["setup", "implement", "install", "add to website", "easy", "simple", "5 minutes"],
        emoji: "🚀",
        type: 'informational'
      }
    };
    
    // Merge with existing (don't overwrite)
    for (const [key, trigger] of Object.entries(additionalTriggers)) {
      if (!this.informationalTriggers[key]) {
        this.informationalTriggers[key] = trigger;
      }
    }
  },
  
  // Detect which triggers match a message
  detectTriggers: function(message) {
    const lowerMsg = message.toLowerCase();
    const matches = [];
    
    // Check all triggers
    const allTriggers = {
      ...this.testimonialTriggers,
      ...this.informationalTriggers
    };
    
    for (const [key, trigger] of Object.entries(allTriggers)) {
      if (trigger.keywords.some(keyword => 
        keyword && lowerMsg.includes(keyword.toLowerCase())
      )) {
        matches.push({
          key: key,
          label: trigger.label,
          type: trigger.type,
          emoji: trigger.emoji
        });
      }
    }
    
    return matches;
  },
  
  // Get all triggers for display (grouped by type)
  getAllTriggersForDisplay: function() {
    return {
      testimonial: this.testimonialTriggers,
      informational: this.informationalTriggers
    };
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  if (window.triggerSystem) {
    window.triggerSystem.initialize();
  }
});

// ===================================================
// 🎨 ENHANCED GROUP CREATOR CLASS (FIXED LAYOUT)
// ===================================================

class EnhancedGroupCreator {
    constructor() {
        this.selectedTriggers = [];
        this.currentType = 'testimonial';
        this.groupName = '';
    }
    
    show() {
        // Remove any existing overlay
        this.hide();
        
        const html = this.generateHTML();
        document.body.insertAdjacentHTML('beforeend', html);
        this.bindEvents();
        
        // Focus on name input
        setTimeout(() => {
            const nameInput = document.getElementById('group-name-input');
            if (nameInput) nameInput.focus();
        }, 100);
    }
    
    hide() {
        const existing = document.getElementById('enhanced-group-creator-overlay');
        if (existing) existing.remove();
    }
    
    generateHTML() {
        const triggers = window.triggerSystem?.getAllTriggersForDisplay?.() || {};
        const currentTriggers = triggers[this.currentType] || {};
        
        return `
        <div class="group-creator-overlay" id="enhanced-group-creator-overlay">
            <div class="overlay-backdrop"></div>
            <div class="overlay-content" style="max-width: 800px;">
                <div class="overlay-header">
                    <h2><span class="header-emoji">🎬</span> Create Video Group</h2>
                    <button class="close-btn" aria-label="Close">&times;</button>
                </div>

                <div class="form-sections">
                    <!-- GROUP NAME -->
                    <div class="form-section">
                        <label for="group-name-input" class="form-label">
                            <span class="label-emoji">📝</span> Group Name
                        </label>
                        <input type="text" 
                               id="group-name-input" 
                               class="form-input"
                               placeholder="e.g., Price Concerns or Conversion Boost"
                               value="${this.groupName}">
                        <p class="helper-text">What should this group be called?</p>
                    </div>

                    <!-- VIDEO TYPE SELECTOR -->
                    <div class="form-section">
                        <label class="form-label">
                            <span class="label-emoji">🎯</span> Video Type
                        </label>
                        <div class="type-selector">
                            <button class="type-btn ${this.currentType === 'testimonial' ? 'active' : ''}" 
                                    data-type="testimonial">
                                <span class="btn-emoji">🎬</span>
                                <div class="btn-content">
                                    <strong>Testimonial Videos</strong>
                                    <small>Real client stories addressing concerns</small>
                                </div>
                            </button>
                            <button class="type-btn ${this.currentType === 'informational' ? 'active' : ''}" 
                                    data-type="informational">
                                <span class="btn-emoji">📚</span>
                                <div class="btn-content">
                                    <strong>Informational Videos</strong>
                                    <small>How-to & educational content</small>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- TRIGGER SELECTION -->
                    <div class="form-section">
                        <label class="form-label">
                            <span class="label-emoji">🔔</span> When to Show These Videos
                        </label>
                        <p class="helper-text">Click triggers to select (choose multiple)</p>
                        
                        <div class="enhanced-triggers-container">
                            ${this.generateEnhancedTriggerSections(currentTriggers)}
                        </div>

                        <!-- SELECTED TRIGGERS PREVIEW -->
                        <div class="selected-triggers-section ${this.selectedTriggers.length > 0 ? 'has-selection' : ''}" 
                             id="selected-triggers">
                            <h4><span class="label-emoji">✅</span> Selected Triggers:</h4>
                            <div class="selected-tags-container" id="selected-tags">
                                ${this.generateSelectedTags(currentTriggers)}
                            </div>
                            ${this.selectedTriggers.length === 0 ? 
                                '<p class="empty-message">No triggers selected yet</p>' : ''}
                        </div>
                    </div>
                </div>

                <!-- BUTTONS -->
                <div class="form-buttons">
                    <button class="btn btn-secondary cancel-btn">
                        <span class="btn-emoji">❌</span> Cancel
                    </button>
                    <button class="btn btn-primary create-btn" ${this.selectedTriggers.length === 0 ? 'disabled' : ''}>
                        <span class="btn-emoji">✅</span> Create Group
                    </button>
                </div>
            </div>
        </div>`;
    }
    
    generateEnhancedTriggerSections(triggers) {
        if (!triggers || Object.keys(triggers).length === 0) {
            return '<div class="no-triggers">No triggers available for this type</div>';
        }
        
        // Group triggers by category (using the HTML structure as reference)
        const categories = {
            '💰 Price Concerns': ['expensive', 'cost', 'affordability'],
            '⏰ Time Concerns': ['busy', 'speed'],
            '🤝 Trust Concerns': ['skepticism', 'legitimacy'],
            '📈 Results Concerns': ['effectiveness', 'worry'],
            '⭐ General Feedback': ['info', 'demo']
        };
        
        if (this.currentType === 'informational') {
            // Different categories for informational videos
            Object.keys(categories).forEach(key => delete categories[key]);
            
            categories['📊 Conversion & Results'] = ['conversions_boost', 'roi_improvement'];
            categories['🔥 Leads & Quality'] = ['pre_qualified', 'lead_quality'];
            categories['⚡ Implementation & Setup'] = ['easy_setup', 'integration'];
            categories['🎙️ Podcast & Content'] = ['podcast_leads', 'content_monetization'];
            categories['❓ How It Works'] = ['process_explanation', 'testimonial_leverage'];
        }
        
        let html = '';
        
        for (const [categoryName, triggerKeys] of Object.entries(categories)) {
            const categoryTriggers = triggerKeys
                .map(key => ({ key, trigger: triggers[key] }))
                .filter(item => item.trigger);
            
            if (categoryTriggers.length === 0) continue;
            
            html += `
                <div class="concern-subgroup">
                    <div class="concern-subgroup-title">${categoryName}</div>
                    <div class="concern-checkbox-group">`;
            
            categoryTriggers.forEach(({ key, trigger }) => {
                const isSelected = this.selectedTriggers.includes(key);
                html += `
                    <div class="concern-checkbox-item">
                        <input type="checkbox" 
                               id="trigger_${key}" 
                               class="concern-checkbox" 
                               value="${key}"
                               ${isSelected ? 'checked' : ''}>
                        <label for="trigger_${key}" class="concern-checkbox-label">
                            <span class="trigger-emoji">${trigger.emoji}</span>
                            <span class="trigger-label">${trigger.label.replace(trigger.emoji, '').trim()}</span>
                        </label>
                        <div class="concern-keywords">Triggers: ${trigger.triggers?.join(', ') || 'Various keywords'}</div>
                    </div>`;
            });
            
            html += `</div></div>`;
        }
        
        return html;
    }
    
    generateSelectedTags(triggers) {
        if (this.selectedTriggers.length === 0) return '';
        
        let html = '';
        for (const triggerKey of this.selectedTriggers) {
            const trigger = triggers[triggerKey];
            if (trigger) {
                html += `
                    <span class="tag">
                        <span class="tag-emoji">${trigger.emoji}</span>
                        <span class="tag-text">${trigger.label.replace(trigger.emoji, '').trim()}</span>
                        <button class="remove-tag" data-trigger="${triggerKey}" aria-label="Remove">
                            &times;
                        </button>
                    </span>`;
            }
        }
        return html;
    }
    
    bindEvents() {
        const overlay = document.getElementById('enhanced-group-creator-overlay');
        if (!overlay) return;
        
        // Close buttons
        overlay.querySelector('.close-btn').addEventListener('click', () => this.hide());
        overlay.querySelector('.overlay-backdrop').addEventListener('click', () => this.hide());
        overlay.querySelector('.cancel-btn').addEventListener('click', () => this.hide());
        
        // Type selector
        overlay.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.currentType = type;
                this.selectedTriggers = []; // Reset selection when type changes
                this.show(); // Re-render with new type
            });
        });
        
        // Checkbox changes
        overlay.addEventListener('change', (e) => {
            if (e.target.classList.contains('concern-checkbox')) {
                this.toggleTrigger(e.target.value, e.target.checked);
            }
        });
        
        // Remove tag buttons
        overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-tag')) {
                const triggerKey = e.target.dataset.trigger;
                this.toggleTrigger(triggerKey, false);
            }
        });
        
        // Create button
        overlay.querySelector('.create-btn').addEventListener('click', () => {
            this.createGroup();
        });
        
        // Name input
        const nameInput = overlay.querySelector('#group-name-input');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.groupName = e.target.value;
                this.updateCreateButton();
            });
        }
    }
    
    toggleTrigger(triggerKey, isSelected) {
        if (isSelected) {
            if (!this.selectedTriggers.includes(triggerKey)) {
                this.selectedTriggers.push(triggerKey);
            }
        } else {
            this.selectedTriggers = this.selectedTriggers.filter(t => t !== triggerKey);
        }
        this.updateSelectedTags();
        this.updateCreateButton();
    }
    
    updateSelectedTags() {
        const overlay = document.getElementById('enhanced-group-creator-overlay');
        if (!overlay) return;
        
        const triggers = window.triggerSystem?.getAllTriggersForDisplay?.() || {};
        const currentTriggers = triggers[this.currentType] || {};
        const tagsContainer = overlay.querySelector('#selected-tags');
        const selectedSection = overlay.querySelector('#selected-triggers');
        
        if (tagsContainer) {
            tagsContainer.innerHTML = this.generateSelectedTags(currentTriggers);
        }
        
        if (selectedSection) {
            if (this.selectedTriggers.length > 0) {
                selectedSection.classList.add('has-selection');
                const emptyMsg = selectedSection.querySelector('.empty-message');
                if (emptyMsg) emptyMsg.remove();
            } else {
                selectedSection.classList.remove('has-selection');
                if (!selectedSection.querySelector('.empty-message')) {
                    selectedSection.querySelector('.selected-tags-container').insertAdjacentHTML('afterend', 
                        '<p class="empty-message">No triggers selected yet</p>');
                }
            }
        }
    }
    
    updateCreateButton() {
        const overlay = document.getElementById('enhanced-group-creator-overlay');
        if (!overlay) return;
        
        const createBtn = overlay.querySelector('.create-btn');
        const isValid = this.groupName.trim() && this.selectedTriggers.length > 0;
        
        createBtn.disabled = !isValid;
        createBtn.style.opacity = isValid ? '1' : '0.6';
        createBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }
    
    createGroup() {
        if (!this.groupName.trim() || this.selectedTriggers.length === 0) {
            alert('Please enter a group name and select at least one trigger.');
            return;
        }
        
        const groupData = {
            name: this.groupName.trim(),
            type: this.currentType,
            triggers: [...this.selectedTriggers],
            slug: this.groupName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            icon: this.currentType === 'testimonial' ? '🎬' : '📚',
            description: '',
            createdAt: new Date().toISOString()
        };
        
        console.log('Creating group:', groupData);
        
        // Here you would integrate with your actual group creation logic
        // Example: window.testimonialManager.createGroup(groupData);
        
        this.hide();
        alert(`Group "${groupData.name}" created successfully with ${groupData.triggers.length} triggers!`);
    }
}

// ====================================================
// 🎯 GROUP CREATOR DEFINITION (REPLACE lines around 1115)
// ====================================================

// First, define the GroupCreator class
class GroupCreator {
    constructor() {
        console.log('🔧 GroupCreator initialized');
        this.selectedTriggers = [];
        this.currentType = 'testimonial';
        this.groupName = '';
    }
    
    show() {
        console.log('🎬 GroupCreator.show() - Opening group creator');
        
        // Method 1: Use existing function
        if (typeof showAddTestimonialGroupModal === 'function') {
            console.log('✅ Using showAddTestimonialGroupModal()');
            showAddTestimonialGroupModal();
            return;
        }
        
        // Method 2: Show modal directly
        const modal = document.getElementById('addTestimonialGroupModal');
        if (modal) {
            console.log('✅ Showing modal directly');
            modal.style.display = 'flex';
            
            // Clear form
            if (typeof clearGroupForm === 'function') {
                clearGroupForm();
            }
            
            // Focus on name input
            setTimeout(() => {
                const nameInput = modal.querySelector('#newGroupName');
                if (nameInput) nameInput.focus();
            }, 100);
        } else {
            console.error('❌ No modal found');
            alert('Group creator modal not found. Please refresh the page.');
        }
    }
    
    hide() {
        console.log('👋 GroupCreator.hide()');
        
        // Method 1: Use existing function
        if (typeof hideAddTestimonialGroupModal === 'function') {
            hideAddTestimonialGroupModal();
            return;
        }
        
        // Method 2: Hide modal directly
        const modal = document.getElementById('addTestimonialGroupModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // These methods might be called by other parts of your code
    toggleTrigger(triggerKey, isSelected) {
        console.log(`🔔 Toggle trigger: ${triggerKey} = ${isSelected}`);
    }
    
    createGroup() {
        console.log('🏗️ GroupCreator.createGroup()');
        if (typeof addNewTestimonialGroup === 'function') {
            addNewTestimonialGroup();
        }
    }
    
    updateSelectedTags() {
        console.log('🏷️ GroupCreator.updateSelectedTags()');
    }
    
    updateCreateButton() {
        console.log('🔄 GroupCreator.updateCreateButton()');
    }
}

// NOW make it globally available
window.GroupCreator = GroupCreator;

// Also create an instance for convenience
window.groupCreator = new GroupCreator();
console.log('✅ GroupCreator defined and available globally');

// ===================================================
// 🚨 CRITICAL FIX: ADD MISSING bindEvents METHOD
// ===================================================

console.log('🔧 Adding missing bindEvents method to GroupCreator...');

// Check if GroupCreator exists and is missing bindEvents
if (window.GroupCreator && !window.GroupCreator.prototype.bindEvents) {
    
    // Add the missing bindEvents method
    window.GroupCreator.prototype.bindEvents = function() {
        console.log('🔗 bindEvents called - setting up event handlers');
        const overlay = document.getElementById('group-creator-overlay');
        if (!overlay) {
            console.error('❌ No overlay found for bindEvents');
            return;
        }
        
        console.log('✅ Overlay found, binding events...');
        
        // 1. Type selection buttons
        const typeButtons = overlay.querySelectorAll('.type-btn');
        typeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('🎯 Type button clicked:', e.target.dataset.type);
                
                // Update active state
                typeButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Update current type
                this.currentType = e.currentTarget.dataset.type;
                this.selectedTriggers = []; // Clear selection
                
                // Refresh display
                this.refreshTriggerDisplay();
            });
        });
        
        // 2. Trigger buttons
        overlay.addEventListener('click', (e) => {
            const triggerBtn = e.target.closest('.trigger-btn');
            if (triggerBtn) {
                const triggerKey = triggerBtn.dataset.trigger;
                console.log('🔔 Trigger clicked:', triggerKey);
                
                // Toggle selection
                this.toggleTrigger(triggerKey);
            }
            
            // Remove tag buttons
            const removeBtn = e.target.closest('.remove-tag');
            if (removeBtn) {
                const triggerKey = removeBtn.dataset.trigger;
                console.log('🗑️ Removing tag:', triggerKey);
                this.removeTrigger(triggerKey);
            }
        });
        
        // 3. Close buttons
        const closeBtn = overlay.querySelector('.close-btn');
        const cancelBtn = overlay.querySelector('.cancel-btn');
        const backdrop = overlay.querySelector('.overlay-backdrop');
        
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());
        if (backdrop) backdrop.addEventListener('click', () => this.close());
        
        // 4. Create button
        const createBtn = overlay.querySelector('.create-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                console.log('🏗️ Create button clicked');
                this.createGroup();
            });
        }
        
        // 5. Form input
        const nameInput = overlay.querySelector('#group-name-input');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.groupName = e.target.value;
            });
        }
        
        console.log('✅ All events bound successfully');
    };
    
    // Also add other missing methods
    window.GroupCreator.prototype.toggleTrigger = function(triggerKey) {
        console.log('🔔 toggleTrigger called for:', triggerKey);
        const index = this.selectedTriggers.indexOf(triggerKey);
        if (index === -1) {
            this.selectedTriggers.push(triggerKey);
            console.log('✅ Added trigger:', triggerKey);
        } else {
            this.selectedTriggers.splice(index, 1);
            console.log('❌ Removed trigger:', triggerKey);
        }
        this.refreshTriggerDisplay();
    };
    
    window.GroupCreator.prototype.removeTrigger = function(triggerKey) {
        console.log('🗑️ removeTrigger called for:', triggerKey);
        this.selectedTriggers = this.selectedTriggers.filter(t => t !== triggerKey);
        this.refreshTriggerDisplay();
    };
    
    window.GroupCreator.prototype.refreshTriggerDisplay = function() {
        console.log('🔄 refreshTriggerDisplay called');
        const overlay = document.getElementById('group-creator-overlay');
        if (!overlay) return;
        
        // Get current triggers
        const triggers = window.triggerSystem?.getTriggersByType(this.currentType) || {};
        
        // Update trigger button states
        const triggerButtons = overlay.querySelectorAll('.trigger-btn');
        triggerButtons.forEach(btn => {
            const triggerKey = btn.dataset.trigger;
            if (this.selectedTriggers.includes(triggerKey)) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
        
        // Update selected tags
        const tagsContainer = overlay.querySelector('.selected-tags');
        if (tagsContainer) {
            if (this.selectedTriggers.length === 0) {
                tagsContainer.innerHTML = '<span class="empty-tag">No triggers selected</span>';
            } else {
                let tagsHTML = '';
                this.selectedTriggers.forEach(triggerKey => {
                    const trigger = triggers[triggerKey];
                    if (trigger) {
                        tagsHTML += `
                            <span class="tag" data-trigger="${triggerKey}">
                                ${trigger.emoji || '🎯'} ${trigger.label || triggerKey}
                                <button class="remove-tag" data-trigger="${triggerKey}">&times;</button>
                            </span>`;
                    }
                });
                tagsContainer.innerHTML = tagsHTML;
            }
        }
        
        console.log('📋 Current selection:', this.selectedTriggers);
    };
    
    window.GroupCreator.prototype.createGroup = function() {
        console.log('🏗️ createGroup called');
        const nameInput = document.getElementById('group-name-input');
        const name = nameInput ? nameInput.value.trim() : '';
        
        if (!name) {
            alert('Please enter a group name');
            return;
        }
        
        if (this.selectedTriggers.length === 0) {
            alert('Please select at least one trigger');
            return;
        }
        
        console.log('✅ Creating group:', {
            name: name,
            type: this.currentType,
            triggers: this.selectedTriggers
        });
        
        // Create group object
        const group = {
            id: this.generateSlug(name),
            name: name,
            type: this.currentType,
            triggers: [...this.selectedTriggers],
            videos: [],
            createdAt: new Date().toISOString()
        };
        
        // Save to testimonialData
        if (!window.testimonialData.groups) {
            window.testimonialData.groups = {};
        }
        
        window.testimonialData.groups[group.id] = group;
        console.log('💾 Group saved:', group);
        
        // Update UI
        this.updateSidebar(group);
        
        // Close
        this.close();
        
        alert(`✅ Group "${name}" created!`);
    };
    
    window.GroupCreator.prototype.generateSlug = function(name) {
        return name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    };
    
    window.GroupCreator.prototype.updateSidebar = function(group) {
        console.log('📌 Updating sidebar with group:', group.name);
        // Your existing sidebar update logic here
    };
    
    window.GroupCreator.prototype.close = function() {
        console.log('👋 Closing group creator');
        const overlay = document.getElementById('group-creator-overlay');
        if (overlay) {
            overlay.remove();
            console.log('✅ Overlay removed');
        }
    };
    
    console.log('✅ All missing methods added to GroupCreator');
}

// At the top of testimonial-manager.js, after ENHANCED_CONCERNS is defined:
function ensureCleanConcerns() {
    if (!window.ENHANCED_CONCERNS || Object.keys(window.ENHANCED_CONCERNS).length === 0) {
        console.log('⚠️ ENHANCED_CONCERNS is empty, using concerns from testimonialData');
        window.ENHANCED_CONCERNS = window.testimonialData?.concerns || {};
    }
    
    // Log concern counts for debugging
    const testimonialCount = Object.values(window.ENHANCED_CONCERNS).filter(c => 
        c.type === 'testimonial' || !c.type
    ).length;
    const infoCount = Object.values(window.ENHANCED_CONCERNS).filter(c => 
        c.type === 'informational'
    ).length;
    
    console.log(`📊 Concerns: ${testimonialCount} testimonial, ${infoCount} informational`);
}

// Call it when DOM loads
document.addEventListener('DOMContentLoaded', ensureCleanConcerns);

// ===================================================
// 🔧 AUTO-FIX FOR testimonials-data.js
// ===================================================
function fixTestimonialDataStructure() {
    console.log('🔧 Fixing testimonial data structure...');
    
    // Ensure basic structure exists
    if (!window.testimonialData) {
        window.testimonialData = {};
        console.log('✅ Created testimonialData object');
    }
    
    // Add statistics if missing
    if (!testimonialData.statistics) {
        testimonialData.statistics = {
            totalGroups: 0,
            totalTestimonialGroups: 0,
            totalInformationalGroups: 0,
            totalVideos: 0,
            totalTestimonials: 0,
            totalInformationalVideos: 0,
            totalViews: 0
        };
        console.log('✅ Added statistics object');
    }
    
    // Add version if missing
    if (!testimonialData.__version) {
        testimonialData.__version = "5.0-enhanced-concerns";
        console.log('✅ Added version');
    }
    
    // Ensure groups structure exists
    if (!testimonialData.groups) {
        testimonialData.groups = {};
        console.log('✅ Created unified groups object');
    }
    
    // Migrate old structure if it exists
    if ((testimonialData.testimonialGroups || testimonialData.informationalGroups) && Object.keys(testimonialData.groups).length === 0) {
        console.log('🔄 Migrating old structure to unified groups...');
        
        if (testimonialData.testimonialGroups) {
            Object.entries(testimonialData.testimonialGroups).forEach(([id, group]) => {
                testimonialData.groups[id] = {
                    ...group,
                    type: group.type || 'testimonial',
                    videoIds: group.videoIds || []
                };
            });
        }
        
        if (testimonialData.informationalGroups) {
            Object.entries(testimonialData.informationalGroups).forEach(([id, group]) => {
                testimonialData.groups[id] = {
                    ...group,
                    type: group.type || 'informational',
                    videoIds: group.videoIds || []
                };
            });
        }
        
        console.log(`✅ Migrated ${Object.keys(testimonialData.groups).length} groups`);
    }
    
    // Update statistics with actual counts
    const totalGroups = Object.keys(testimonialData.groups).length;
    const totalTestimonialGroups = Object.values(testimonialData.groups).filter(g => g.type === 'testimonial').length;
    const totalInformationalGroups = Object.values(testimonialData.groups).filter(g => g.type === 'informational').length;
    const totalVideos = Object.keys(testimonialData.videos).length;
    
    testimonialData.statistics.totalGroups = totalGroups;
    testimonialData.statistics.totalTestimonialGroups = totalTestimonialGroups;
    testimonialData.statistics.totalInformationalGroups = totalInformationalGroups;
    testimonialData.statistics.totalVideos = totalVideos;
    
    console.log('📊 Statistics updated:', testimonialData.statistics);
    console.log('✅ Data structure fixed!');
    
    return testimonialData;
}

// Run the fix on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        fixTestimonialDataStructure();
    }, 500);
});

// ===================================================
// DATA INITIALIZATION (FIXED - PRESERVES EXISTING DATA)
// ===================================================
function initializeTestimonialData() {
    console.log('🚀 Initializing testimonial data (PRESERVING existing data)...');
    
    // 1. Ensure testimonialData exists
    if (!window.testimonialData) {
        window.testimonialData = {};
    }
    
    // Use existing testimonialData
    testimonialData = window.testimonialData;
    
    // 2. Set concerns ONLY if they don't exist
    if (!testimonialData.concerns || Object.keys(testimonialData.concerns).length === 0) {
        if (window.ENHANCED_CONCERNS) {
            testimonialData.concerns = window.ENHANCED_CONCERNS;
            console.log('✅ Set concerns from ENHANCED_CONCERNS');
        } else {
            // Fallback to basic concerns
            testimonialData.concerns = {
                price_expensive: { title: 'Expensive', icon: '💰', videoType: 'skeptical', type: 'testimonial' },
                price_cost: { title: 'Cost/Price', icon: '💰', videoType: 'skeptical', type: 'testimonial' },
                time_busy: { title: 'Too Busy', icon: '⏰', videoType: 'speed', type: 'testimonial' }
            };
            console.log('⚠️ Created fallback concerns');
        }
    } else {
        console.log('✅ Using existing concerns:', Object.keys(testimonialData.concerns).length);
    }
    
    // 3. Ensure groups structure (DON'T overwrite if exists!)
    if (!testimonialData.groups) {
        testimonialData.groups = {};
        console.log('✅ Created empty groups object');
    } else {
        console.log('✅ Using existing groups:', Object.keys(testimonialData.groups).length);
        
        // Remove "test" group if it exists
        if (testimonialData.groups.test) {
            console.log('🧹 Removing "test" group');
            delete testimonialData.groups.test;
        }
    }
    
    // 4. Ensure videos structure (DON'T overwrite!)
    if (!testimonialData.videos) {
        testimonialData.videos = {};
        console.log('✅ Created empty videos object');
    } else {
        console.log('✅ Using existing videos:', Object.keys(testimonialData.videos).length);
    }
    
    // 5. Ensure statistics structure (DON'T overwrite!)
    if (!testimonialData.statistics) {
        testimonialData.statistics = {
            totalGroups: 0,
            totalTestimonialGroups: 0,
            totalInformationalGroups: 0,
            totalVideos: 0,
            totalTestimonials: 0,
            totalInformationalVideos: 0,
            totalViews: 0
        };
        console.log('✅ Created statistics object');
    } else {
        console.log('✅ Using existing statistics');
    }
    
    // 6. Load from localStorage (MERGE, don't overwrite!)
    const savedData = localStorage.getItem('testimonialManagerData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            
            // MERGE videos (only if we don't have them)
            if (parsedData.videos && (!testimonialData.videos || Object.keys(testimonialData.videos).length === 0)) {
                testimonialData.videos = parsedData.videos;
                console.log('📂 Loaded videos from localStorage');
            }
            
            // MERGE statistics (update counts)
            if (parsedData.statistics) {
                // Update with saved statistics, but keep existing if they're better
                testimonialData.statistics = {
                    ...testimonialData.statistics,
                    ...parsedData.statistics
                };
                console.log('📂 Merged statistics from localStorage');
            }
            
            console.log('📂 Loaded manager data from localStorage (safely merged)');
        } catch (e) {
            console.error('❌ Error loading from localStorage:', e);
        }
    }
    
    // 7. Final check
    console.log('✅ Initialization complete:');
    console.log('   Groups:', Object.keys(testimonialData.groups || {}).length);
    console.log('   Videos:', Object.keys(testimonialData.videos || {}).length);
    console.log('   Concerns:', Object.keys(testimonialData.concerns || {}).length);
    
    // 8. Update UI
    setTimeout(() => { 
        if (window.refreshGroupUI) refreshGroupUI(); 
        if (window.populateConcernsCheckboxes) populateConcernsCheckboxes();
    }, 100);
}

// Helper: Migrate old structure to unified groups
function migrateToUnifiedGroups(oldData) {
    const unifiedGroups = {};
    
    // Migrate testimonial groups
    if (oldData.testimonialGroups) {
        Object.entries(oldData.testimonialGroups).forEach(([id, group]) => {
            unifiedGroups[id] = {
                ...group,
                type: group.type || 'testimonial'
            };
        });
    }
    
    // Migrate informational groups
    if (oldData.informationalGroups) {
        Object.entries(oldData.informationalGroups).forEach(([id, group]) => {
            unifiedGroups[id] = {
                ...group,
                type: group.type || 'informational',
                videoIds: group.videoIds || []
            };
        });
    }
    
    console.log(`🔄 Migrated ${Object.keys(unifiedGroups).length} groups to unified structure`);
    return unifiedGroups;
}

// Populate concerns checkboxes
// Populate concerns checkboxes (ENHANCED VERSION)
function populateConcernsCheckboxes() {
    console.log('🎯 Populating ENHANCED concerns checkboxes...');
    
    const concerns = window.testimonialData?.concerns || {};
    const testimonialGrid = document.querySelector('#testimonialTriggers .concerns-grid');
    const informationalGrid = document.querySelector('#informationalTriggers .concerns-grid');
    
    if (!testimonialGrid || !informationalGrid) {
        console.log('⚠️ Trigger grids not found - using fallback checkboxes');
        return;
    }
    
    // Clear existing
    testimonialGrid.innerHTML = '';
    informationalGrid.innerHTML = '';
    
    // Separate testimonial and informational concerns
    const testimonialConcerns = {};
    const informationalConcerns = {};
    
    Object.entries(concerns).forEach(([key, concern]) => {
        if (concern.type === 'informational' || concern.isInformational) {
            informationalConcerns[key] = concern;
        } else {
            testimonialConcerns[key] = concern;
        }
    });
    
    // Populate testimonial concerns
    Object.entries(testimonialConcerns).forEach(([key, concern]) => {
        const checkboxId = `concern_${key}`;
        const triggersText = concern.triggers ? `(${concern.triggers.slice(0, 2).join(', ')})` : '';
        
        testimonialGrid.innerHTML += `
            <div class="concern-checkbox-item">
                <input type="checkbox" id="${checkboxId}" class="concern-checkbox" value="${key}">
                <label for="${checkboxId}" class="concern-checkbox-label">
                    ${concern.icon} ${concern.title} 
                    <span class="concern-subtext">${triggersText}</span>
                </label>
                ${concern.triggers ? `<div class="concern-keywords">Triggers: ${concern.triggers.join(', ')}</div>` : ''}
            </div>
        `;
    });
    
    // Populate informational concerns
    Object.entries(informationalConcerns).forEach(([key, concern]) => {
        const checkboxId = `concern_${key}`;
        const triggersText = concern.triggers ? `(${concern.triggers.slice(0, 2).join(', ')})` : '';
        
        informationalGrid.innerHTML += `
            <div class="concern-checkbox-item">
                <input type="checkbox" id="${checkboxId}" class="concern-checkbox" value="${key}">
                <label for="${checkboxId}" class="concern-checkbox-label">
                    ${concern.icon} ${concern.title} 
                    <span class="concern-subtext">${triggersText}</span>
                </label>
                ${concern.triggers ? `<div class="concern-keywords">Triggers: ${concern.triggers.join(', ')}</div>` : ''}
            </div>
        `;
    });
    
    console.log(`✅ Added ${Object.keys(testimonialConcerns).length} testimonial and ${Object.keys(informationalConcerns).length} informational concerns`);
}

function populateTriggersSections() {
    console.log('🔧 Populating triggers sections...');
    
    const testimonialContainer = document.querySelector('#testimonialTriggers .concerns-grid');
    const informationalContainer = document.querySelector('#informationalTriggers .concerns-grid');
    
    if (!testimonialContainer || !informationalContainer) {
        console.error('❌ Triggers containers not found');
        return;
    }
    
    // Clear existing content
    testimonialContainer.innerHTML = '';
    informationalContainer.innerHTML = '';
    
    // Check if testimonialData exists
    if (window.testimonialData && testimonialData.concerns) {
        // Convert object to array
        const concernsArray = Object.values(testimonialData.concerns);
        console.log(`✅ Adding ${concernsArray.length} concerns`);
        
        // Create checkboxes for each concern - SIMPLE version
        concernsArray.forEach(concern => {
            // Simple checkbox without complex classes
            const checkboxHtml = `
                <div class="concern-item">
                    <input type="checkbox" 
                           id="concern_${concern.id}" 
                           name="concerns" 
                           value="${concern.id}"
                           class="concern-checkbox">
                    <label for="concern_${concern.id}" class="concern-label">
                        <span class="concern-emoji">${concern.emoji}</span>
                        <span class="concern-name">${concern.name}</span>
                        ${concern.description ? `<small class="concern-desc">${concern.description}</small>` : ''}
                    </label>
                </div>
            `;
            
            // Add to both sections
            testimonialContainer.innerHTML += checkboxHtml;
            informationalContainer.innerHTML += checkboxHtml;
        });
    } else {
        testimonialContainer.innerHTML = '<p class="text-muted">No concerns loaded</p>';
        informationalContainer.innerHTML = '<p class="text-muted">No concerns loaded</p>';
    }
}

// ===================================================
// 🧹 FIXED clearGroupForm FUNCTION (REPLACEMENT)
// ===================================================

function clearGroupForm() {
    console.log('🎬 Opening group creator (fixed clearGroupForm)');
    
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) {
        console.error('❌ Modal not found');
        alert('Group creator not available. Please refresh.');
        return false;
    }
    
    // Show the modal
    modal.style.display = 'flex';
    
    // Reset form to defaults
    const nameInput = document.getElementById('newGroupName');
    const slugInput = document.getElementById('newGroupSlug');
    const typeSelect = document.getElementById('newGroupType');
    const descInput = document.getElementById('newGroupDescription');
    const iconInput = document.getElementById('newGroupIcon');
    
    if (nameInput) nameInput.value = '';
    if (slugInput) slugInput.value = '';
    if (typeSelect) typeSelect.value = 'testimonial';
    if (descInput) descInput.value = '';
    if (iconInput) iconInput.value = '🎬';
    
    // Our new trigger selector will handle the rest automatically
    // when the modal opens (it watches for display changes)
    
    // Focus on name field
    setTimeout(() => {
        if (nameInput) nameInput.focus();
    }, 100);
    
    console.log('✅ Modal shown and form cleared');
    return true;
}

// Make it globally available
window.clearGroupForm = clearGroupForm;

// ===================================================
// COMPLETE ENHANCED EVENT LISTENERS SETUP
// ===================================================
function setupEventListeners() {
    console.log('🔧 Setting up COMPLETE enhanced event listeners...');
    
    // ============================================
    // 1. GROUP CREATION FORM LISTENERS (MISSING!)
    // ============================================
    
    // A. Group Type Selector in Modal (THIS IS CRITICAL!)
    const newGroupTypeSelect = document.getElementById('newGroupType');
    if (newGroupTypeSelect) {
        newGroupTypeSelect.addEventListener('change', updateTriggerSections);
        console.log('✅ Added listener for newGroupType');
        
        // Set initial state
        setTimeout(() => {
            updateTriggerSections();
            console.log('✅ Initial trigger sections updated');
        }, 100);
    }
    
    // B. Auto-generate slug from name
    const newGroupNameInput = document.getElementById('newGroupName');
    const newGroupSlugInput = document.getElementById('newGroupSlug');
    if (newGroupNameInput && newGroupSlugInput) {
        newGroupNameInput.addEventListener('blur', function() {
            if (!newGroupSlugInput.value && this.value.trim()) {
                const slug = this.value.trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                newGroupSlugInput.value = slug;
                console.log(`🔗 Auto-generated slug: ${slug}`);
            }
        });
        console.log('✅ Added auto-slug generation');
    }

    // PERMANENT FIX: Complete modal initialization
function initializeTestimonialGroupModal() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) return;
    
    // Fix 1: Apply color fixes on modal open
    modal.addEventListener('show.bs.modal', function() {
        console.log('🔄 Applying permanent color fixes...');
        applyModalColorFixes();
    });
    
    // Fix 2: Initialize checkbox listeners
    const checkboxes = modal.querySelectorAll('input.concern-checkbox');
    checkboxes.forEach(checkbox => {
        // Remove any existing listeners first
        checkbox.removeEventListener('change', handleCheckboxChange);
        
        // Add proper listener
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    // Fix 3: Initialize group name input listener
    const nameInput = modal.querySelector('#newGroupName');
    if (nameInput) {
        nameInput.removeEventListener('input', handleGroupNameInput);
        nameInput.addEventListener('input', handleGroupNameInput);
    }
}

// Helper function: Apply color fixes
function applyModalColorFixes() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) return;
    
    // Force apply all color fixes
    const elementsToFix = {
        'modal-header h2': '#8ab4f8',
        'modal-body': 'rgba(0, 0, 0, 0.7)',
        '.concern-label': '#e8eaed',
        '.no-triggers': '#9aa0a6'
    };
    
    Object.entries(elementsToFix).forEach(([selector, color]) => {
        const elements = modal.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.color = color;
        });
    });
}

// Helper function: Handle checkbox changes
function handleCheckboxChange(e) {
    updateSelectedTriggers();
    updateSubmitButtonState();
}

// Helper function: Handle group name input
function handleGroupNameInput(e) {
    updateSubmitButtonState();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeTestimonialGroupModal();
    
    // Also initialize when modal might be dynamically added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (document.getElementById('addTestimonialGroupModal')) {
                initializeTestimonialGroupModal();
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});
    
    // ============================================
// 🔧 SIMPLE BUTTON FIX (Replace the deleted section)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Fix the "Add Video Group" button
    const addGroupBtn = document.getElementById('addTestimonialGroupBtn');
    if (addGroupBtn) {
        // Remove any existing onclick
        addGroupBtn.onclick = null;
        addGroupBtn.removeAttribute('onclick');
        
        // Add simple click handler
        addGroupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎬 Opening group creator');
            
            // Use our fixed clearGroupForm function
            if (typeof clearGroupForm === 'function') {
                clearGroupForm();
            } else {
                // Fallback
                const modal = document.getElementById('addTestimonialGroupModal');
                if (modal) modal.style.display = 'flex';
            }
        });
        
        console.log('✅ Fixed Add Video Group button');
    }
});
    
    // ============================================
    // 3. NEW: Video Addition Form Listeners
    // ============================================
    
    // A. "Add Video to Group" button
    const addVideoBtn = document.getElementById('addVideoToGroupBtn');
    if (addVideoBtn) {
        addVideoBtn.addEventListener('click', function() {
            console.log('🎬 Add video button clicked');
            if (typeof addVideoToGroup === 'function') {
                addVideoToGroup();
            } else {
                console.error('❌ addVideoToGroup function not found!');
            }
        });
        console.log('✅ Added listener for addVideoToGroupBtn');
    }
    
    // B. "Test URL" button
    const testUrlBtn = document.getElementById('testVideoUrlBtn');
    if (testUrlBtn) {
        testUrlBtn.addEventListener('click', function() {
            console.log('🔗 Test URL button clicked');
            if (typeof testVideoUrl === 'function') {
                testVideoUrl();
            }
        });
        console.log('✅ Added listener for testVideoUrlBtn');
    }
    
    // C. Video URL input change (for auto-detection)
    const videoUrlInput = document.getElementById('video-url-input');
    if (videoUrlInput) {
        videoUrlInput.addEventListener('input', function() {
            if (this.value.includes('supabase.co')) {
                console.log('✅ Supabase URL detected');
                // Auto-enable test button
                if (testUrlBtn) testUrlBtn.disabled = false;
            }
        });
    }
    
    console.log('✅ COMPLETE enhanced event listeners setup complete');
}

// NEW: Update video form based on type (testimonial vs informational)
function updateVideoFormForType(videoType) {
    console.log('🎬 Updating video form for type:', videoType);
    
    // Show/hide appropriate fields
    const authorField = document.getElementById('author-field');
    const descriptionField = document.getElementById('description-field');
    const textField = document.getElementById('text-field');
    
    if (videoType === 'informational') {
        // Informational videos: Show description, hide text
        if (descriptionField) descriptionField.style.display = 'block';
        if (textField) textField.style.display = 'none';
        
        // Auto-set author if empty
        const authorInput = document.getElementById('author-input');
        if (authorInput && !authorInput.value) {
            authorInput.value = 'System Explanation';
        }
    } else {
        // Testimonial videos: Show text, hide description
        if (descriptionField) descriptionField.style.display = 'none';
        if (textField) textField.style.display = 'block';
    }
}

// NEW: Update selected group info in video manager
function updateSelectedGroupInfo(groupId) {
    console.log('📁 Selected group:', groupId);
    
    const group = testimonialData.groups[groupId];
    if (group) {
        // Update the "selected group" display
        const selectedGroupInfo = document.getElementById('selectedGroupInfo');
        if (selectedGroupInfo) {
            selectedGroupInfo.innerHTML = `
                Adding to: <strong>${group.name}</strong> (${group.type === 'informational' ? '📚 Informational' : '🎬 Testimonial'})
            `;
        }
        
        // Auto-set video type based on group
        const videoTypeSelect = document.getElementById('video-type-selector');
        if (videoTypeSelect) {
            videoTypeSelect.value = group.type;
            updateVideoFormForType(group.type);
        }
    }
}

// FIX: Display group names, not IDs
function displayGroupsInUI() {
    const groups = window.testimonialData?.groups || {};
    const container = document.getElementById('groupsContainer');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.values(groups).forEach(group => {
        // USE group.name NOT group.id for display!
        const button = document.createElement('button');
        button.textContent = group.name || group.id; // Prefer name
        button.title = group.description || '';
        button.dataset.groupId = group.id;
        
        // Add button to container
        container.appendChild(button);
    });
}

// ✅ ENHANCED VERSION - Replace lines 2155-2170 with this:

function showAddTestimonialGroupModal() {
    console.log('🎬 Opening group creator (ENHANCED)');
    const modal = document.getElementById('addTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // 🎯 FIX: Setup checkbox listeners
        setTimeout(() => {
            setupCheckboxListenersForModal();
        }, 100);
        
        return true;
    }
    console.error('❌ Modal not found');
    return false;
}

// 🎯 ADD THESE HELPER FUNCTIONS RIGHT AFTER showAddTestimonialGroupModal:

function setupCheckboxListenersForModal() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) {
        console.log('❌ Modal not found in setup');
        return;
    }
    
    console.log('🔧 Setting up checkbox listeners...');
    
    const checkboxes = modal.querySelectorAll('input.concern-checkbox');
    const preview = document.getElementById('selectedTriggersPreview');
    
    if (!preview) {
        console.log('❌ selectedTriggersPreview not found');
        return;
    }
    
    console.log(`Found ${checkboxes.length} checkboxes`);
    
    // Remove old listeners and add new ones
    checkboxes.forEach(checkbox => {
        // Clone to remove existing listeners
        const newCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
        
        newCheckbox.addEventListener('change', updateSelectedDisplay);
    });
    
    // Also listen to name input
    const nameInput = modal.querySelector('#newGroupName');
    if (nameInput) {
        nameInput.addEventListener('input', updateSelectedDisplay);
        console.log('✅ Added listener to name input');
    }
    
    // Initial update
    updateSelectedDisplay();
    console.log('✅ Checkbox listeners setup complete');
}

// Make sure this is at the TOP LEVEL (not inside another function)
function updateSelectedDisplay() {
    console.log('🔄 updateSelectedDisplay called');
    
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) return;
    
    const checkboxes = modal.querySelectorAll('input.concern-checkbox:checked');
    const preview = document.getElementById('selectedTriggersPreview');
    const nameInput = modal.querySelector('#newGroupName');
    const submitBtn = modal.querySelector('button[type="submit"]');
    
    if (!preview) return;
    
    // Update preview display
    if (checkboxes.length > 0) {
        const selected = Array.from(checkboxes).map(cb => {
            const label = modal.querySelector(`label[for="${cb.id}"]`);
            return label ? label.textContent.trim() : cb.value;
        });
        
      preview.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: 600; color: #3b82f6;">
        ✅ Selected (${selected.length}):
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${selected.map(item => 
            `<span style="
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                border: 2px solid #60a5fa;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            ">${item}</span>`
        ).join('')}
    </div>
`;
    } else {
        preview.innerHTML = `
            <p style="margin: 0; color: #9ca3af; font-style: italic;">
                No triggers selected yet. Click checkboxes above to select.
            </p>
        `;
    }
    
    // Update submit button
    if (submitBtn && nameInput) {
        const hasSelection = checkboxes.length > 0;
        const hasName = nameInput.value.trim().length > 0;
        submitBtn.disabled = !(hasSelection && hasName);
        submitBtn.style.opacity = (hasSelection && hasName) ? '1' : '0.5';
        submitBtn.style.cursor = (hasSelection && hasName) ? 'pointer' : 'not-allowed';
    }
}

// 🎯 FIX: Checkbox event listeners for selectedTriggersPreview
function setupCheckboxListenersForModal() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) {
        console.log('❌ Modal not found in setup');
        return;
    }
    
    console.log('🔧 Setting up checkbox listeners...');
    
    const checkboxes = modal.querySelectorAll('input.concern-checkbox');
    const preview = document.getElementById('selectedTriggersPreview');
    
    if (!preview) {
        console.log('❌ selectedTriggersPreview not found');
        return;
    }
    
    console.log(`Found ${checkboxes.length} checkboxes`);
    
    // Remove old listeners and add new ones
    checkboxes.forEach(checkbox => {
        // Clone to remove existing listeners
        const newCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
        
        newCheckbox.addEventListener('change', updateSelectedPreview);
    });
    
    // Also listen to name input
    const nameInput = modal.querySelector('#newGroupName');
    if (nameInput) {
        nameInput.addEventListener('input', updateSelectedPreview);
        console.log('✅ Added listener to name input');
    }
    
    // Initial update
    updateSelectedPreview();
    console.log('✅ Checkbox listeners setup complete');
}

function updateSelectedPreview() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) return;
    
    const checkboxes = modal.querySelectorAll('input.concern-checkbox:checked');
    const preview = document.getElementById('selectedTriggersPreview');
    const nameInput = modal.querySelector('#newGroupName');
    const submitBtn = modal.querySelector('button[type="submit"]');
    
    if (!preview) return;
    
    // Update preview display
    if (checkboxes.length > 0) {
        const selected = Array.from(checkboxes).map(cb => {
            const label = modal.querySelector(`label[for="${cb.id}"]`);
            return label ? label.textContent.trim() : cb.value;
        });
        
        preview.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: 600; color: #8ab4f8;">
                ✅ Selected (${selected.length}):
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${selected.map(item => 
                    `<span style="
                        background: rgba(33, 150, 243, 0.2);
                        color: white;
                        padding: 6px 12px;
                        border-radius: 20px;
                        border: 1px solid rgba(33, 150, 243, 0.3);
                        font-size: 14px;
                    ">${item}</span>`
                ).join('')}
            </div>
        `;
    } else {
        preview.innerHTML = `
            <p style="margin: 0; color: #004ed5ff; font-style: italic;">
                No triggers selected yet. Click checkboxes above to select.
            </p>
        `;
    }
    
    // Update submit button
    if (submitBtn && nameInput) {
        const hasSelection = checkboxes.length > 0;
        const hasName = nameInput.value.trim().length > 0;
        submitBtn.disabled = !(hasSelection && hasName);
        submitBtn.style.opacity = (hasSelection && hasName) ? '1' : '0.5';
        submitBtn.style.cursor = (hasSelection && hasName) ? 'pointer' : 'not-allowed';
        
        console.log(`🎯 Submit button: hasName=${hasName}, hasSelection=${hasSelection}, disabled=${submitBtn.disabled}`);
    }
}

function hideAddTestimonialGroupModal() {
    console.log('👋 Hiding group creator modal');
    
    const modal = document.getElementById('addTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'none';
        
        // ✅ Optional: Clear form (but our trigger selector handles this)
        // document.getElementById('newGroupName').value = '';
        // document.getElementById('newGroupSlug').value = '';
        // document.getElementById('newGroupIcon').value = '🎬';
        // document.getElementById('newGroupDescription').value = '';
    }
    
    return true;
}

function updateGroupDropdown() {
    const dropdown = document.getElementById('selectGroupDropdown');
    if (!dropdown) return;
    
    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    // ❌ OLD: window.testimonialData.testimonialGroups
    // ✅ NEW: window.testimonialData.groups
    if (!window.testimonialData || !window.testimonialData.groups) {
        console.log('ℹ️ No groups found for dropdown');
        return;
    }
    
    // Sort groups: Informational first, then Testimonial
    const groups = Object.entries(window.testimonialData.groups);
    groups.sort(([keyA, groupA], [keyB, groupB]) => {
        const typeA = groupA.type || 'testimonial';
        const typeB = groupB.type || 'testimonial';
        if (typeA === 'informational' && typeB !== 'informational') return -1;
        if (typeA !== 'informational' && typeB === 'informational') return 1;
        return 0;
    });
    
    // Add options with type badges
    groups.forEach(([groupId, group]) => {
        const option = document.createElement('option');
        option.value = groupId;
        
        const videoType = group.type || 'testimonial';
        const typeBadge = videoType === 'informational' ? '📚' : '🎬';
        const typeText = videoType === 'informational' ? ' (Informational)' : ' (Testimonial)';
        
        option.textContent = `${typeBadge} ${group.name || groupId}${typeText}`; // Changed: group.title → group.name
        option.title = group.description || `Type: ${videoType} videos`;
        
        // Add data attribute for type
        option.setAttribute('data-type', videoType);
        
        dropdown.appendChild(option);
    });
    
    console.log(`✅ Updated dropdown with ${groups.length} groups`);
}

// ===================================================
// UI UPDATES
// ===================================================
function loadAndDisplayData() {
    updateGroupsDisplay();
    updateGroupDropdown(); // NEW LINE - Initialize dropdown
    updateStatisticsDisplay();
}

function updateGroupsDisplay() {
    const container = document.getElementById('testimonialGroupsContainer');
    const noGroupsMessage = document.getElementById('noGroupsMessage');
    
    if (!container) return;
    
    // GET ALL GROUPS FROM BOTH COLLECTIONS
    const allGroups = [];
    
    // 1. Get testimonial groups (ORIGINAL LOGIC)
    if (testimonialData.testimonialGroups) {
        Object.entries(testimonialData.testimonialGroups).forEach(([groupId, group]) => {
            allGroups.push({
                id: groupId,
                type: 'testimonial',
                name: group.name || group.title || groupId,
                title: group.title || group.name || groupId,
                icon: group.icon || '📁', // PRESERVE ORIGINAL ICON LOGIC
                description: group.description || '',
                count: group.testimonials ? group.testimonials.length : 0,
                isActive: currentSelectedGroupId === groupId,
                data: group // Keep original group data
            });
        });
    }
    
    // 2. Get informational groups (NEW - THIS IS WHAT WAS MISSING!)
    if (testimonialData.informationalGroups) {
        Object.entries(testimonialData.informationalGroups).forEach(([groupId, group]) => {
            allGroups.push({
                id: groupId,
                type: 'informational',
                name: group.name || group.title || groupId,
                title: group.title || group.name || groupId,
                icon: group.icon || '📁', // USE SAME LOGIC AS ORIGINAL
                description: group.description || '',
                count: group.videos ? group.videos.length : 0, // Different property name
                isActive: currentSelectedGroupId === groupId,
                data: group // Keep original group data
            });
        });
    }
    
    if (allGroups.length === 0) {
        if (noGroupsMessage) noGroupsMessage.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    
    if (noGroupsMessage) noGroupsMessage.style.display = 'none';
    
    // Create group buttons - USING ORIGINAL TEMPLATE LOGIC
    container.innerHTML = allGroups.map(group => {
        const isActive = group.isActive;
        
        // Escape description for HTML safety (ORIGINAL LOGIC)
        const safeDescription = (group.description || 'No description provided')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // Truncate long names for display (ORIGINAL LOGIC)
        const groupName = group.name || '';
        const displayName = groupName.length > 20 
            ? groupName.substring(0, 18) + '...' 
            : groupName;
        
        // ORIGINAL TEMPLATE - just added data-group-type attribute
        return `
            <div class="testimonial-group-btn ${isActive ? 'active' : ''}" 
                 onclick="selectGroup('${group.id}', true)"
                 data-description="${safeDescription}"
                 data-group-type="${group.type}">
                <div class="group-info">
                    <span class="group-icon">${group.icon}</span>
                    <span class="group-name" title="${group.name}">${displayName}</span>
                </div>
                <div class="group-actions">
                    <span class="group-count">${group.count}</span>
                    <button class="btn-edit-group" onclick="editGroup('${group.id}', event)">
                        ✏️
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // AFTER rendering, add badges and delete buttons if those functions exist
    // This keeps the original HTML clean and adds features separately
    
    // Add type badges if function exists
    if (typeof addTypeBadgesToGroups === 'function') {
        setTimeout(() => addTypeBadgesToGroups(), 50);
    }
    
    // Add delete buttons if function exists
    if (typeof addDeleteButtonsToGroups === 'function') {
        setTimeout(() => addDeleteButtonsToGroups(), 100);
    }
}

function editGroup(groupId, event) {
    // Stop the click from triggering the group button click
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    const group = testimonialData.testimonialGroups[groupId];
    if (!group) {
        showError('Group not found');
        return;
    }
    
    // Populate the edit modal with group data
    document.getElementById('editGroupId').value = groupId;
    document.getElementById('editGroupName').value = group.name;
    document.getElementById('editGroupSlug').value = group.slug;
    document.getElementById('editGroupIcon').value = group.icon || '📁';
    document.getElementById('editGroupDescription').value = group.description || '';
    
    // Populate concern checkboxes
    const concernsContainer = document.getElementById('editConcernsCheckboxContainer');
    if (concernsContainer) {
        const concerns = {
            'price': '💰 See What Others Say About Value',
            'time': '⏰ Hear From Busy Professionals',
            'trust': '🤝 Real Client Experiences',
            'general': '⭐ What Our Clients Say',
            'results': '📈 See The Results Others Got'
        };
        
        concernsContainer.innerHTML = '';
        
        for (const [key, label] of Object.entries(concerns)) {
            const isChecked = group.concerns && group.concerns.includes(key);
            const checkboxId = `edit_concern_${key}`;
            
            concernsContainer.innerHTML += `
                <div class="concern-checkbox-item">
                    <input type="checkbox" 
                           id="${checkboxId}" 
                           class="concern-checkbox" 
                           value="${key}"
                           ${isChecked ? 'checked' : ''}>
                    <label for="${checkboxId}" class="concern-checkbox-label">
                        ${label}
                    </label>
                </div>
            `;
        }
    }
    
    // Show the edit modal
    document.getElementById('editTestimonialGroupModal').style.display = 'flex';
    
    console.log('Editing group:', group.name);
}

// ADD THIS FUNCTION to your testimonial-manager.js (anywhere near the top)
function showNotification(message, type = 'success') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    // Style it
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// ADD DELETE BUTTON TO EDIT MODAL
// ============================================

// Add retry counter to prevent infinite loops
let deleteButtonSetupAttempts = 0;
const MAX_SETUP_ATTEMPTS = 5;

// Wait for modal to be in DOM, then add delete button
function setupDeleteButtonInModal() {
    const modal = document.getElementById('editTestimonialGroupModal');
    
    // Stop retrying after max attempts
    deleteButtonSetupAttempts++;
    if (deleteButtonSetupAttempts > MAX_SETUP_ATTEMPTS) {
        console.log('❌ Could not find edit modal after', MAX_SETUP_ATTEMPTS, 'attempts. Giving up.');
        return;
    }
    
    if (!modal) {
        console.log('⚠️ Edit modal not found (attempt', deleteButtonSetupAttempts, 'of', MAX_SETUP_ATTEMPTS, '), will retry');
        setTimeout(setupDeleteButtonInModal, 500);
        return;
    }
    
    // Check if delete button already exists
    if (modal.querySelector('.btn-delete-group-in-modal')) {
        return; // Already set up
    }
    
    // Find the modal footer or actions area
    const modalFooter = modal.querySelector('.modal-footer, .modal-actions');
    const form = modal.querySelector('form');
    
    let container = modalFooter;
    if (!container && form) {
        // Create footer if it doesn't exist
        container = document.createElement('div');
        container.className = 'modal-footer';
        form.appendChild(container);
    }
    
    if (!container) {
        // Last resort: add to end of modal
        container = document.createElement('div');
        container.className = 'modal-footer';
        modal.appendChild(container);
    }
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button'; // Important: not submit type!
    deleteBtn.className = 'btn-delete-group-in-modal';
    deleteBtn.textContent = 'Delete Group';
    deleteBtn.style.cssText = `
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        margin-top: 10px;
        width: 100%;
        font-size: 14px;
    `;
    
    deleteBtn.onclick = function() {
        const groupIdInput = document.getElementById('editGroupId');
        const groupId = groupIdInput ? groupIdInput.value : null;
        
        if (!groupId) {
            alert('Cannot delete: Group ID not found');
            return;
        }
        
        const group = window.testimonialData?.testimonialGroups?.[groupId] || 
                     window.testimonialManagerData?.testimonialGroups?.[groupId];
        const groupName = group?.title || 'this group';
        
        if (confirm(`⚠️ DELETE CONFIRMATION\n\nAre you sure you want to delete "${groupName}"?\n\nThis will delete ALL testimonials in this group permanently.`)) {
            if (window.deleteGroup) {
                window.deleteGroup(groupId);
                // Close the modal
                if (window.hideEditGroupModal) {
                    window.hideEditGroupModal();
                } else {
                    modal.style.display = 'none';
                }
            } else {
                alert('Delete function not available');
            }
        }
    };
    
    // Add delete button to container
    container.appendChild(deleteBtn);
    console.log('✅ Delete button added to edit modal');
}

// Set it up when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDeleteButtonInModal);
} else {
    setupDeleteButtonInModal();
}

// Also set up whenever editGroup is called (in case modal is recreated)
const originalEditGroup = window.editGroup;
if (originalEditGroup) {
    window.editGroup = function(groupId, event) {
        const result = originalEditGroup.apply(this, arguments);
        
        // Add delete button after modal is shown
        setTimeout(setupDeleteButtonInModal, 100);
        
        return result;
    };
}

function saveGroupEdit() {
    const groupId = document.getElementById('editGroupId').value;
    const name = document.getElementById('editGroupName').value.trim();
    const slug = document.getElementById('editGroupSlug').value.trim();
    const icon = document.getElementById('editGroupIcon').value.trim() || '📁';
    const description = document.getElementById('editGroupDescription').value.trim();
    
    if (!name) {
        showError('Please enter a group name');
        return;
    }
    
    if (!slug) {
        showError('Please enter a group slug');
        return;
    }
    
    const group = testimonialData.testimonialGroups[groupId];
    if (!group) {
        showError('Group not found');
        return;
    }
    
    // Get selected concerns
    const selectedConcerns = [];
    const checkboxes = document.querySelectorAll('#editConcernsCheckboxContainer .concern-checkbox:checked');
    checkboxes.forEach(cb => selectedConcerns.push(cb.value));
    
    // Update group
    group.name = name;
    group.slug = slug;
    group.icon = icon;
    group.description = description;
    group.concerns = selectedConcerns;
    group.updatedAt = new Date().toISOString();
    
    // Save and update UI
    saveToLocalStorage();
    updateGroupsDisplay();
    updateGroupDropdown();
    
    // Close modal
    hideEditGroupModal();
    
    showSuccess(`✅ Group "${name}" updated successfully!`);
}

function hideEditGroupModal() {
    const modal = document.getElementById('editTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// And export it
window.hideEditGroupModal = hideEditGroupModal;

function selectGroup(groupId, scroll = false, source = 'sidebar') {
    console.log('🎬 Selecting group:', groupId, 'from:', source);
    
    window.selectedGroupId = groupId;
    
    // GET mainContent ONCE at the start - BUT ALSO CHECK FOR MANAGER CONTEXT
    const mainContent = document.getElementById('mainContent');
    const isInManagerContext = document.querySelector('.sidebar-right, #testimonialManager, .manager-container, .testimonial-manager') !== null;
    
    if (!groupId) {
        // Clear the main content area IF IT EXISTS
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📁</div>
                    <h3>No Group Selected</h3>
                    <p>Select a group from the dropdown or sidebar to view and manage testimonials.</p>
                </div>
            `;
        } else {
            console.log('⚠️ mainContent not found, cannot show empty state');
        }
        return;
    }
    
    // ✅ CORRECTED: Use groups, not testimonialGroups
    const group = window.testimonialData.groups[groupId];
    if (!group) {
        console.error('❌ Group not found:', groupId);
        return;
    }
    
    // Update dropdown selection
    const dropdown = document.getElementById('selectGroupDropdown');
    if (dropdown) {
        dropdown.value = groupId;
    }
    
    // Update main content header with type badge - ONLY IF mainContent EXISTS
    if (mainContent) {
        const videoType = group.type || 'testimonial';
        const typeBadge = videoType === 'informational' ? 
            '<span class="type-badge informational" title="Informational Videos">📚 Informational</span>' : 
            '<span class="type-badge testimonial" title="Testimonial Videos">🎬 Testimonial</span>';
        
        // ✅ CORRECTED: Use group.name, not group.title
        mainContent.innerHTML = `
            <div class="content-header">
                <h2>
                    <span class="group-icon">${group.icon || '📁'}</span>
                    ${group.name || groupId} <!-- Changed: title → name -->
                    ${typeBadge}
                </h2>
                <div class="header-actions">
                    <button class="btn btn-primary btn-sm" onclick="showAddTestimonialModal('${groupId}')">
                        <span class="btn-icon">➕</span> Add Video
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editGroup('${groupId}')">
                        <span class="btn-icon">✏️</span> Edit Group
                    </button>
                    <!-- 🆕 DELETE BUTTON -->
                    <button class="btn btn-danger btn-sm" onclick="deleteGroup('${groupId}')" 
                            title="Delete this group and all its videos">
                        <span class="btn-icon">🗑️</span> Delete Group
                    </button>
                </div>
            </div>
            <div class="content-body">
                <p class="group-description">${group.description || 'No description provided.'}</p>
                
                <!-- Video Type Info -->
                <div class="alert alert-info">
                    <strong>📋 Group Type:</strong> ${videoType === 'informational' ? 
                        '📚 <strong>Informational Videos</strong> - How-to, explainer, and educational content' : 
                        '🎬 <strong>Testimonial Videos</strong> - Real client stories and social proof'}
                </div>
                
                <!-- Videos/Testimonials will be rendered here -->
                <div id="groupContentContainer"></div>
            </div>
        `;
        
        if (scroll) {
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (isInManagerContext) {
        // 🆕 MANAGER MODE: Just update manager UI, don't trigger modals
        console.log('✅ Manager mode: Group selected for testimonial addition');
        console.log('   Group:', group.name || groupId); // Changed: title → name
        console.log('   Type:', group.type || 'testimonial');
        
        // Update manager header if it exists
        const managerHeader = document.querySelector('.manager-header, .selected-group-header');
        if (managerHeader) {
            managerHeader.innerHTML = `
                <h3>${group.icon || '📁'} ${group.name || groupId}</h3> <!-- Changed: title → name -->
                <p class="text-muted">${group.description || 'Ready to add testimonials'}</p>
            `;
        }
    } else {
        console.log('⚠️ mainContent element not found, skipping UI update');
        // 🆕 CRITICAL: Don't trigger any modals here!
    }
    
    // Display group content (testimonials/videos)
    displayGroupTestimonials(groupId);

   // ============================================
    // FIXED: Use existing functions instead of non-existent ones
    // ============================================
    const videoType = group.type || 'testimonial';
    
    // Update current group display (if function exists)
    if (typeof updateCurrentGroupDisplay === 'function') {
        updateCurrentGroupDisplay(group);
    }
    
    // 🚨 CRITICAL FIX: Check SOURCE parameter
    // If called from manager, DON'T show testimonials modal!
    if (source === 'manager') {
        console.log('🛑 Manager source detected: Skipping showTestimonialsForGroup()');
        // Still call addTypeBadgesToGroups
        if (typeof addTypeBadgesToGroups === 'function') {
            addTypeBadgesToGroups();
        }
        return; // This is now OK - inside selectGroup function
    }
    
    // Show testimonials for the group (ONLY for sidebar source)
    if (typeof showTestimonialsForGroup === 'function') {
        showTestimonialsForGroup(groupId);
    } else if (typeof displayGroupTestimonials === 'function') {
        displayGroupTestimonials(group);
    } else {
        console.log('⚠️ No function found to display group testimonials');
    }
    
    // Add type badges to sidebar groups
    addTypeBadgesToGroups();
    
}

function showTestimonialOverlay(groupId) {
    const group = testimonialData.testimonialGroups[groupId];
    if (!group) return;
    
    // 1. Update overlay header
    document.getElementById('overlayGroupName').textContent = group.name;
    document.getElementById('overlayGroupDescription').textContent = 
        group.description || 'Click a testimonial to play';
    
    // 2. Load testimonials grid
    const container = document.getElementById('overlayTestimonialsGrid');
    
    if (!group.testimonials || group.testimonials.length === 0) {
        // 3. Show empty state
        container.innerHTML = `
            <div class="no-testimonials-message">
                <div class="no-testimonials-icon">🎬</div>
                <h3>No testimonials yet</h3>
                <p>Add testimonials to this group to see them here</p>
            </div>
        `;
    } else {
        // 4. Create all testimonial cards
        container.innerHTML = group.testimonials.map(testimonial => `
            <div class="testimonial-selection-card" onclick="playTestimonialVideo('${testimonial.id}')">
                <div class="testimonial-card-header">
                    <span class="testimonial-card-icon">
                        ${testimonial.concernType === 'price' ? '💰' : 
                          testimonial.concernType === 'time' ? '⏰' :
                          testimonial.concernType === 'trust' ? '🤝' :
                          testimonial.concernType === 'results' ? '📈' : '⭐'}
                    </span>
                    <span class="testimonial-card-concern">
                        ${testimonial.concernType === 'price' ? 'Price Concern' :
                          testimonial.concernType === 'time' ? 'Time/Speed' :
                          testimonial.concernType === 'trust' ? 'Trust/Reliability' :
                          testimonial.concernType === 'results' ? 'Results' : 'General Feedback'}
                    </span>
                </div>
                <h4 class="testimonial-card-title">${testimonial.title || 'Untitled Testimonial'}</h4>
                <p class="testimonial-card-author">👤 ${testimonial.author || 'Anonymous'}</p>
                ${testimonial.text ? `
                    <p class="testimonial-card-excerpt">
                        ${testimonial.text.substring(0, 100)}${testimonial.text.length > 100 ? '...' : ''}
                    </p>
                ` : ''}
                <div class="testimonial-card-footer">
                    <button class="btn-play-testimonial">
                        ▶️ Play Video
                    </button>
                    <span class="testimonial-views">👁️ ${testimonial.views || 0} views</span>
                </div>
            </div>
        `).join('');
    }
    
    // 5. Show overlay
    document.getElementById('testimonialOverlay').style.display = 'flex';
}

function hideTestimonialOverlay() {
    const overlay = document.getElementById('testimonialOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        console.log('✅ Hiding testimonial overlay');
    }
}

function updateCurrentGroupDisplay(group) {
    const display = document.getElementById('currentGroupName');
    if (display) {
        if (group) {
            display.textContent = group.name;
            display.style.color = '#2196F3'; // Primary color
        } else {
            display.textContent = 'None selected';
            display.style.color = '#888';
        }
    }
}

function displayGroupTestimonials(group) {
    // This will display testimonials in the main content area
    // We'll add this after the form or in a separate section
    updateCodeOutput(); // For now, update the code output
}

// ===================================================
// 🎯 SIMPLIFIED TRIGGER HELPER FUNCTION
// ===================================================

function getAllVideoTriggers() {
    console.log('🔍 Getting all video triggers...');
    
    const triggers = new Set(); // Use Set to automatically deduplicate
    
    // Check if data exists
    if (!window.testimonialData || !window.testimonialData.groups) {
        console.log('⚠️ No groups data found');
        return [];
    }
    
    // Loop through all groups
    Object.values(window.testimonialData.groups).forEach(group => {
        // Check triggers on the group itself
        if (group.triggers && Array.isArray(group.triggers)) {
            group.triggers.forEach(trigger => triggers.add(trigger));
        }
        
        // Check videos in the group (standardized property)
        if (group.videos && Array.isArray(group.videos)) {
            group.videos.forEach(video => {
                if (video.tags && Array.isArray(video.tags)) {
                    video.tags.forEach(tag => triggers.add(tag));
                }
                if (video.concernType) {
                    triggers.add(video.concernType);
                }
            });
        }
        
        // Also check old property name for compatibility
        if (group.testimonials && Array.isArray(group.testimonials)) {
            group.testimonials.forEach(testimonial => {
                if (testimonial.tags && Array.isArray(testimonial.tags)) {
                    testimonial.tags.forEach(tag => triggers.add(tag));
                }
                if (testimonial.concernType) {
                    triggers.add(testimonial.concernType);
                }
            });
        }
    });
    
    const result = Array.from(triggers);
    console.log(`✅ Found ${result.length} unique triggers`);
    return result;
}

// Export it
window.getAllVideoTriggers = getAllVideoTriggers;

// ===================================================
// TESTIMONIAL MANAGEMENT
// ===================================================
function addVideoTestimonial() {
    // Use dropdown value instead of currentSelectedGroupId
    const dropdown = document.getElementById('selectGroupDropdown');
    const groupId = dropdown ? dropdown.value : currentSelectedGroupId;
    
    if (!groupId) {
        showError('Please select a group from the dropdown first');
        return;
    }
    
    // Get form values
    const title = document.getElementById('testimonialTitle').value.trim();
    const concernType = document.getElementById('concernType').value;
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const author = document.getElementById('authorName').value.trim();
    const text = document.getElementById('testimonialText').value.trim();
    
    // Validation
    if (!title) {
        showError('Please enter a testimonial title');
        return;
    }
    
    if (!videoUrl) {
        showError('Please enter a video URL');
        return;
    }
    
    if (!author) {
        showError('Please enter an author name');
        return;
    }
    
    // Get selected group
    const group = testimonialData.testimonialGroups[groupId];
    if (!group) {
        showError('Selected group not found');
        return;
    }
    
    // Create testimonial object
    const testimonial = {
        id: 'testimonial_' + Date.now(),
        title: title,
        concernType: concernType,
        videoUrl: videoUrl,
        author: author,
        text: text,
        addedAt: new Date().toISOString(),
        views: 0
    };
    
    // Add to group
    if (!group.testimonials) group.testimonials = [];
    group.testimonials.push(testimonial);
    
    // Update statistics
    updateStatistics();
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update ALL UI components
    updateGroupsDisplay();
    updateCodeOutput();
    
    // Clear form
    document.getElementById('testimonialTitle').value = '';
    document.getElementById('videoUrl').value = '';
    document.getElementById('authorName').value = '';
    document.getElementById('testimonialText').value = '';
    
    // Hide video preview
    const videoPreview = document.getElementById('videoPreview');
    if (videoPreview) videoPreview.style.display = 'none';
    
    showSuccess(`✅ Video testimonial added to "${group.name}"!`);
    console.log('Added testimonial to group:', group.name, testimonial);
}

function addTextTestimonial() {
// Use dropdown value instead of currentSelectedGroupId
    const dropdown = document.getElementById('selectGroupDropdown');
    const groupId = dropdown ? dropdown.value : currentSelectedGroupId;
    
    if (!groupId) {
        showError('Please select a group from the dropdown first');
        return;
    }

    if (!currentSelectedGroupId) {
        showError('Please select a group first');
        return;
    }
    
    // Get form values
    const title = document.getElementById('testimonialTitle').value.trim();
    const concernType = document.getElementById('concernType').value;
    const author = document.getElementById('authorName').value.trim();
    const text = document.getElementById('testimonialText').value.trim();
    
    // Validation
    if (!title) {
        showError('Please enter a testimonial title');
        return;
    }
    
    if (!text) {
        showError('Please enter testimonial text');
        return;
    }
    
    if (!author) {
        showError('Please enter an author name');
        return;
    }
    
    // Get current group
    const group = testimonialData.testimonialGroups[currentSelectedGroupId];
    if (!group) return;
    
    // Create testimonial object
    const testimonial = {
        id: 'testimonial_' + Date.now(),
        title: title,
        concernType: concernType,
        author: author,
        text: text,
        addedAt: new Date().toISOString(),
        views: 0
    };
    
    // Add to group
    if (!group.testimonials) group.testimonials = [];
    group.testimonials.push(testimonial);
    
    // Update statistics
    updateStatistics();
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update UI
    updateGroupsDisplay();
    updateCodeOutput();
    
    // Clear form
    document.getElementById('testimonialTitle').value = '';
    document.getElementById('authorName').value = '';
    document.getElementById('testimonialText').value = '';
    
    showSuccess('✅ Text testimonial added!');
    console.log('Added text testimonial:', testimonial);
}

// Add this to your testimonial-manager.js file:

// Function to toggle trigger sections based on video type - ENHANCED VERSION
function updateTriggerSections() {
    console.log('🔄 Updating trigger sections...');
    
    const videoType = document.getElementById('newGroupType').value;
    const testimonialSection = document.getElementById('testimonialTriggers');
    const informationalSection = document.getElementById('informationalTriggers');
    const iconField = document.getElementById('newGroupIcon');
    
    // Validate elements exist
    if (!videoType || !testimonialSection || !informationalSection || !iconField) {
        console.error('❌ Required elements not found for updateTriggerSections');
        return;
    }
    
    console.log(`🎯 Showing ${videoType} triggers`);
    
    // Show/hide sections
    if (videoType === 'testimonial') {
        testimonialSection.style.display = 'block';
        informationalSection.style.display = 'none';
        // Set default icon for testimonials
        iconField.value = '🎬';
        console.log('✅ Set testimonial mode (icon: 🎬)');
    } else {
        testimonialSection.style.display = 'none';
        informationalSection.style.display = 'block';
        // Set default icon for informational
        iconField.value = '📚';
        console.log('✅ Set informational mode (icon: 📚)');
    }
    
    // 🆕 ENHANCEMENT: Update form placeholders based on type
    const groupNameInput = document.getElementById('newGroupName');
    const groupDescription = document.getElementById('newGroupDescription');
    
    if (groupNameInput) {
        groupNameInput.placeholder = videoType === 'informational' 
            ? 'e.g., How It Works, Setup Guide' 
            : 'e.g., Price Concerns, Client Results';
    }
    
    if (groupDescription) {
        groupDescription.placeholder = videoType === 'informational'
            ? 'Describe what these educational videos cover...'
            : 'Describe what these client stories are about...';
    }
    
    // Uncheck all checkboxes when switching types
    const checkboxes = document.querySelectorAll('.concern-checkbox');
    let uncheckedCount = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.checked = false;
            uncheckedCount++;
        }
    });
    
    console.log(`🗑️ Cleared ${uncheckedCount} checked checkboxes`);
    
    // 🆕 ENHANCEMENT: Also update the section titles for clarity
    const testimonialTitle = testimonialSection.querySelector('h4');
    const informationalTitle = informationalSection.querySelector('h4');
    
    if (testimonialTitle) {
        testimonialTitle.textContent = videoType === 'testimonial' 
            ? '🎯 When to Show These Testimonials' 
            : '🎯 Testimonial Triggers (for testimonial groups)';
    }
    
    if (informationalTitle) {
        informationalTitle.textContent = videoType === 'informational'
            ? '📚 When to Show These Educational Videos'
            : '📚 Informational Triggers (for educational groups)';
    }
}

// ===================================================
// 🎯 SIMPLIFIED GROUP CREATION FUNCTION
// ===================================================
function addNewTestimonialGroup() {
    console.log('🎯 Creating testimonial group...');
    
    // 1. GET FORM VALUES
    const groupName = document.getElementById('newGroupName')?.value.trim();
    const groupSlug = document.getElementById('newGroupSlug')?.value.trim() || 
                     groupName?.toLowerCase().replace(/\s+/g, '-');
    const videoType = document.getElementById('newGroupType')?.value || 'testimonial';
    const groupIcon = document.getElementById('newGroupIcon')?.value || '🎬';
    const groupDescription = document.getElementById('newGroupDescription')?.value.trim() || '';
    
    // 2. VALIDATION
    if (!groupName) {
        alert('❌ Please enter a group name');
        document.getElementById('newGroupName')?.focus();
        return;
    }
    
    // 3. GET SELECTED TRIGGERS (from our new trigger selector)
    const selectedTriggers = [];
    
    // Method 1: Use our new trigger selector if available
    if (window.triggerSelector && window.triggerSelector.selectedTriggers) {
        selectedTriggers.push(...window.triggerSelector.selectedTriggers);
        console.log(`🔍 Got ${selectedTriggers.length} triggers from triggerSelector`);
    }
    
    // Method 2: Fallback to checkboxes
    if (selectedTriggers.length === 0) {
        const checkboxes = document.querySelectorAll('.concern-checkbox:checked');
        checkboxes.forEach(cb => {
            if (cb.value) selectedTriggers.push(cb.value);
        });
        console.log(`🔍 Got ${selectedTriggers.length} triggers from checkboxes`);
    }
    
    if (selectedTriggers.length === 0) {
        if (!confirm('⚠️ No triggers selected. Create group anyway?')) {
            return;
        }
    }
    
    // 4. CREATE GROUP OBJECT (CLEAN VERSION)
    const groupId = 'group_' + groupSlug.replace(/[^a-z0-9-_]/gi, '_');
    
    const newGroup = {
        id: groupId,
        name: groupName,
        slug: groupSlug,
        type: videoType,
        icon: videoType === 'informational' ? '📚' : '🎬',
        description: groupDescription,
        triggers: selectedTriggers, // ✅ Simple triggers array
        videos: [], // ✅ Empty videos array
        createdAt: new Date().toISOString(),
        viewCount: 0
    };
    
    console.log('📝 New group created:', newGroup);
    
    // 5. SAVE TO DATA STRUCTURE
    // ✅ CORRECTED: Ensure groups property exists
    if (!window.testimonialData) {
        window.testimonialData = { groups: {}, videos: {}, statistics: {} };
    }
    
    if (!window.testimonialData.groups) {
        window.testimonialData.groups = {};
    }
    
    // Check if group already exists
    if (window.testimonialData.groups[groupId]) {
        alert('❌ Group with this name already exists');
        return;
    }
    
    // Save the group
    window.testimonialData.groups[groupId] = newGroup;
    console.log('💾 Group saved to testimonialData.groups');
    
    // 6. UPDATE STATISTICS
    if (!window.testimonialData.statistics) {
        window.testimonialData.statistics = {
            totalGroups: 0,
            totalTestimonialGroups: 0,
            totalInformationalGroups: 0,
            totalVideos: 0
        };
    }
    
    window.testimonialData.statistics.totalGroups = Object.keys(window.testimonialData.groups).length;
    
    if (videoType === 'testimonial') {
        window.testimonialData.statistics.totalTestimonialGroups++;
    } else {
        window.testimonialData.statistics.totalInformationalGroups++;
    }
    
    console.log(`📊 Statistics: ${window.testimonialData.statistics.totalGroups} groups total`);
    
    // 7. CLEAR FORM
    const nameInput = document.getElementById('newGroupName');
    const typeSelect = document.getElementById('newGroupType');
    const iconInput = document.getElementById('newGroupIcon');
    const descInput = document.getElementById('newGroupDescription');
    
    if (nameInput) nameInput.value = '';
    if (typeSelect) typeSelect.value = 'testimonial';
    if (iconInput) iconInput.value = '🎬';
    if (descInput) descInput.value = '';
    
    // Clear triggers in our selector if it exists
    if (window.triggerSelector) {
        window.triggerSelector.selectedTriggers = [];
        window.triggerSelector.updateSelectedTags();
    }
    
    // 8. CLOSE MODAL
    const modal = document.getElementById('addTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // 9. UPDATE UI
    setTimeout(() => {
        // Update dropdown
        if (typeof updateGroupDropdown === 'function') {
            updateGroupDropdown();
        }
        
        // Update sidebar
        if (typeof addTypeBadgesToGroups === 'function') {
            addTypeBadgesToGroups();
        }
        
        // Show in console for debugging
        console.log('✅ Group created successfully!');
        console.log('   Name:', groupName);
        console.log('   Type:', videoType);
        console.log('   Triggers:', selectedTriggers.length);
        console.log('   All groups:', Object.keys(window.testimonialData.groups));
    }, 100);
    
    // 10. SHOW SUCCESS
    alert(`✅ ${videoType === 'informational' ? '📚 Informational' : '🎬 Testimonial'} group "${groupName}" created!`);
    
    return newGroup;
}

// ===================================================
// 🆕 INITIALIZATION: Set up event listeners
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing enhanced group creation...');
    
    const videoTypeSelect = document.getElementById('newGroupType');
    if (videoTypeSelect) {
        videoTypeSelect.addEventListener('change', updateTriggerSections);
        
        // Set initial state
        setTimeout(() => {
            updateTriggerSections();
            console.log('✅ Trigger sections initialized');
        }, 100);
    }
    
    // 🆕 Auto-generate slug from name
    const groupNameInput = document.getElementById('newGroupName');
    const groupSlugInput = document.getElementById('newGroupSlug');
    
    if (groupNameInput && groupSlugInput) {
        groupNameInput.addEventListener('blur', function() {
            if (!groupSlugInput.value && this.value) {
                const slug = this.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                groupSlugInput.value = slug;
                console.log(`🔗 Auto-generated slug: ${slug}`);
            }
        });
    }
});

// ===================================================
// TESTIMONIAL DISPLAY (CARD VIEW)
// ===================================================
function showTestimonialsForGroup(groupId) {
    const group = testimonialData.testimonialGroups[groupId];
    if (!group) return;
    
    // Create testimonials grid
    const container = document.getElementById('allTestimonialsContent');
    if (!container) return;
    
    if (!group.testimonials || group.testimonials.length === 0) {
        container.innerHTML = `
            <div class="empty-testimonials">
                <div class="empty-icon">🎬</div>
                <h3>No testimonials yet</h3>
                <p>Add testimonials to this group to see them here</p>
            </div>
        `;
        return;
    }
    
    // Create testimonials grid
    container.innerHTML = `
        <div class="testimonials-grid">
            ${group.testimonials.map(testimonial => createTestimonialCard(testimonial)).join('')}
        </div>
    `;
    
    // Show modal
    document.getElementById('allTestimonialsModal').style.display = 'flex';
    document.getElementById('totalTestimonialsCount').textContent = group.testimonials.length;
}

function createTestimonialCard(testimonial) {
    const concernIcons = {
        'price': '💰',
        'time': '⏰',
        'trust': '🤝',
        'results': '📈',
        'general': '⭐'
    };
    
    const concernLabels = {
        'price': 'Price Concern',
        'time': 'Time/Speed',
        'trust': 'Trust/Reliability',
        'results': 'Results',
        'general': 'General Feedback'
    };
    
    const icon = concernIcons[testimonial.concernType] || '⭐';
    const label = concernLabels[testimonial.concernType] || 'Testimonial';
    
    return `
        <div class="testimonial-card" onclick="playTestimonialVideo('${testimonial.id}')">
            <div class="testimonial-card-header">
                <span class="testimonial-concern-icon">${icon}</span>
                <span class="testimonial-concern-label">${label}</span>
            </div>
            <div class="testimonial-card-body">
                <h4 class="testimonial-title">${testimonial.title || 'Untitled Testimonial'}</h4>
                <p class="testimonial-author">👤 ${testimonial.author || 'Anonymous'}</p>
                ${testimonial.text ? `<p class="testimonial-text">${testimonial.text}</p>` : ''}
            </div>
            <div class="testimonial-card-footer">
                <button class="btn btn-primary btn-play">
                    <span class="btn-icon">▶️</span>
                    Play Video
                </button>
                <span class="testimonial-views">👁️ ${testimonial.views || 0} views</span>
            </div>
        </div>
    `;
}

function playTestimonialVideo(testimonialId) {
    console.log('🎬 Attempting to play testimonial:', testimonialId);
    
    // Search for testimonial in ALL groups (since overlay might show testimonials from any group)
    let foundTestimonial = null;
    let foundGroup = null;
    
    // First, check current selected group
    if (currentSelectedGroupId && testimonialData.testimonialGroups[currentSelectedGroupId]) {
        const group = testimonialData.testimonialGroups[currentSelectedGroupId];
        if (group.testimonials) {
            foundTestimonial = group.testimonials.find(t => t.id === testimonialId);
            if (foundTestimonial) foundGroup = group;
        }
    }
    
    // If not found, search all groups
    if (!foundTestimonial) {
        for (const [groupId, group] of Object.entries(testimonialData.testimonialGroups)) {
            if (group.testimonials) {
                const testimonial = group.testimonials.find(t => t.id === testimonialId);
                if (testimonial) {
                    foundTestimonial = testimonial;
                    foundGroup = group;
                    break;
                }
            }
        }
    }
    
    if (!foundTestimonial) {
        console.error('❌ Testimonial not found:', testimonialId);
        showError('Testimonial not found');
        return;
    }
    
    if (!foundTestimonial.videoUrl) {
        console.error('❌ No video URL for testimonial:', testimonialId);
        showError('No video available for this testimonial');
        return;
    }
    
    console.log('✅ Found testimonial:', foundTestimonial.title);
    console.log('✅ Video URL:', foundTestimonial.videoUrl);
    
    // Increment view count
    foundTestimonial.views = (foundTestimonial.views || 0) + 1;
    if (foundGroup) {
        foundGroup.viewCount = (foundGroup.viewCount || 0) + 1;
    }
    
    // Update statistics
    updateStatistics();
    saveToLocalStorage();
    
    // Get video player elements
    const videoPlayer = document.getElementById('testimonialVideoPlayer');
    const videoTitle = document.getElementById('videoPlayerTitle');
    const videoInfo = document.getElementById('videoPlayerInfo');
    
    if (!videoPlayer) {
        console.error('❌ Video player element not found!');
        showError('Video player not available');
        return;
    }
    
    // Set video source
    videoPlayer.src = foundTestimonial.videoUrl;
    videoPlayer.load();
    
    // Update video info
    if (videoTitle) {
        videoTitle.textContent = foundTestimonial.title || 'Video Testimonial';
    }
    
    if (videoInfo) {
        videoInfo.innerHTML = `
            <div class="video-info-item">
                <strong>Author:</strong> ${foundTestimonial.author || 'Unknown'}
            </div>
            <div class="video-info-item">
                <strong>Concern:</strong> ${foundTestimonial.concernType || 'General'}
            </div>
            ${foundTestimonial.text ? `
            <div class="video-info-item">
                <strong>Testimonial:</strong> ${foundTestimonial.text}
            </div>` : ''}
            ${foundGroup ? `
            <div class="video-info-item">
                <strong>Group:</strong> ${foundGroup.name}
            </div>` : ''}
        `;
    }
    
    // Hide overlay if it's open
    const overlay = document.getElementById('testimonialOverlay');
    if (overlay && overlay.style.display === 'flex') {
        hideTestimonialOverlay();
    }
    
    // Show video modal
    const videoModal = document.getElementById('videoPlayerModal');
    if (videoModal) {
        videoModal.style.display = 'flex';
        
        // Auto-play when modal is shown (optional)
        setTimeout(() => {
            videoPlayer.play().catch(e => {
                console.log('Note: Autoplay prevented by browser. User must click play.');
            });
        }, 500);
    }
    
    console.log('✅ Video player launched');
}

// Also add a helper function to close video player
function hideVideoPlayerModal() {
    const videoPlayer = document.getElementById('testimonialVideoPlayer');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
    }
    const videoModal = document.getElementById('videoPlayerModal');
    if (videoModal) {
        videoModal.style.display = 'none';
    }
}

// Add this to your testimonial-manager.js file
function addDeleteButtonsToGroups() {
    console.log('🗑️ Adding delete buttons to groups...');
    
    // Find all group buttons
    const groupButtons = document.querySelectorAll('.testimonial-group-btn');
    
    groupButtons.forEach(groupBtn => {
        // Get the group ID from the onclick attribute
        const onclickAttr = groupBtn.getAttribute('onclick');
        const groupIdMatch = onclickAttr?.match(/selectGroup\('([^']+)'/);
        const groupId = groupIdMatch ? groupIdMatch[1] : null;
        
        if (!groupId) return;
        
        // Check if delete button already exists
        const actionsDiv = groupBtn.querySelector('.group-actions');
        if (!actionsDiv || actionsDiv.querySelector('.btn-delete-group')) return;
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete-group';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete this group and all its videos';
        deleteBtn.setAttribute('data-group-id', groupId);
        
        // Add click handler
        deleteBtn.onclick = function(e) {
            e.stopPropagation(); // Prevent triggering group selection
            deleteGroup(groupId);
        };
        
        // Add to actions div (after edit button)
        actionsDiv.appendChild(deleteBtn);
    });
}

function saveGroupChanges(groupId = null) {
    // Your existing code to get form values...
    
    // 🆕 ADD THIS: Get video type
    const videoType = document.getElementById('editGroupType')?.value || 'testimonial';
    
    // Create/update group object
    const groupData = {
        id: groupId || newGroupId,
        title: groupName,
        type: videoType, // 🆕 SAVE THE TYPE
        description: groupDescription,
        icon: groupIcon,
        // ... other existing properties
    };
    
    // ✅ CORRECTED: Use groups, not testimonialGroups
    if (!window.testimonialData.groups) {
        window.testimonialData.groups = {};
    }
    window.testimonialData.groups[groupId || newGroupId] = groupData;
    
    // Update UI
    updateGroupDropdown();
    
    // Show appropriate message
    const typeText = videoType === 'informational' ? 'Informational video' : 'Testimonial';
    showNotification(`✅ ${typeText} group ${groupId ? 'updated' : 'created'} successfully`);
    
    return groupData;
}

function addTypeBadgesToGroups() {
    const groupElements = document.querySelectorAll('.testimonial-group-btn, [id*="group-btn"]');
    
    groupElements.forEach(element => {
        // Extract group ID
        const onclickAttr = element.getAttribute('onclick');
        const match = onclickAttr?.match(/selectGroup\('([^']+)'/);
        const groupId = match ? match[1] : null;
        
        // ✅ CORRECTED: Use groups, not testimonialGroups
        if (!groupId || !window.testimonialData?.groups?.[groupId]) return;
        
        const group = window.testimonialData.groups[groupId];
        const videoType = group.type || 'testimonial';
        
        // Check if badge already exists
        if (element.querySelector('.type-badge')) return;
        
        // Create and add badge
        const badge = document.createElement('span');
        badge.className = `type-badge ${videoType}`;
        badge.innerHTML = videoType === 'informational' ? '📚' : '🎬';
        badge.title = videoType === 'informational' ? 'Informational Videos' : 'Testimonial Videos';
        badge.style.cssText = `
            margin-left: 8px;
            font-size: 12px;
            vertical-align: middle;
        `;
        
        const groupName = element.querySelector('.group-name, [class*="name"]');
        if (groupName) {
            groupName.appendChild(badge);
        }
    });
}

// Function to delete a group
function deleteGroup(groupId) {
    // ✅ CORRECTED: Use groups, not testimonialGroups
    if (!groupId || !window.testimonialData?.groups?.[groupId]) {
        console.error('❌ Cannot delete: Group not found');
        return;
    }
    
    const group = window.testimonialData.groups[groupId];
    const videoType = group.type || 'testimonial';
    const videoCount = group.videos?.length || 0; // ✅ Simplified
    
    const confirmation = confirm(`🗑️ DELETE "${group.name || groupId}" GROUP?\n\n` + // ✅ Changed: group.title → group.name
                               `Type: ${videoType === 'informational' ? 'Informational Videos' : 'Testimonial Videos'}\n` +
                               `Videos: ${videoCount}\n\n` +
                               `This will permanently delete the group and all ${videoCount} videos inside it.\n` +
                               `This action cannot be undone!`);
    
    if (!confirmation) return;
    
    console.log(`🗑️ Deleting ${videoType} group "${groupId}" with ${videoCount} videos`);
    
    // ✅ CORRECTED: Remove from groups, not testimonialGroups
    delete window.testimonialData.groups[groupId];
    
    // Clear selection if this was the selected group
    if (window.selectedGroupId === groupId) {
        window.selectedGroupId = null;
    }
    
    // Update UI
    if (typeof updateGroupDropdown === 'function') {
        updateGroupDropdown();
    }
    
    if (typeof selectGroup === 'function') {
        selectGroup(null); // Clear the main content
    }
    
    // If you have a sidebar render function, update it too
    if (typeof renderGroups === 'function') {
        renderGroups();
    }
    
    // Save changes
    if (typeof saveAllData === 'function') {
        saveAllData();
    }
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification(`✅ ${videoType === 'informational' ? 'Informational' : 'Testimonial'} group deleted successfully`, 'success');
    }
}

// 🔧 CORRECTED renderGroups() FUNCTION
function renderGroups() {
    console.log('🎨 RENDERING GROUPS TO SIDEBAR');
    
    // 1. Find sidebar container - use the specific ID from your HTML
    const sidebar = document.getElementById('testimonialGroupsContainer');
    if (!sidebar) {
        console.error('❌ Sidebar container not found! Looking for #testimonialGroupsContainer');
        return;
    }
    
    // 2. Clear existing group buttons
    const existingGroups = sidebar.querySelectorAll('.testimonial-group-btn');
    existingGroups.forEach(group => group.remove());
    
    // 3. Get groups - ONLY from testimonialGroups
    const groups = window.testimonialData?.groups || {};
    if (!groups) {
        console.log('📭 No groups data found');
        // Show empty state message if it exists
        const noGroupsMessage = document.getElementById('noGroupsMessage');
        if (noGroupsMessage) noGroupsMessage.style.display = 'block';
        return;
    }
    
    console.log(`📊 Found ${Object.keys(groups).length} groups to render`);
    
    // 4. Convert to array and sort
    const groupsArray = Object.entries(groups).map(([id, group]) => ({
        id: id,
        title: group.title || id,
        icon: group.icon || '📁',
        type: group.type || 'testimonial',
        description: group.description || '',
        videoCount: group.videoIds?.length || 0
    }));
    
    groupsArray.sort((a, b) => a.title.localeCompare(b.title));
    
    // 5. Hide empty state message
    const noGroupsMessage = document.getElementById('noGroupsMessage');
    if (noGroupsMessage) noGroupsMessage.style.display = 'none';
    
    // 6. Render each group as a button
    groupsArray.forEach(group => {
        const button = document.createElement('button');
        button.className = 'testimonial-group-btn';
        button.setAttribute('onclick', `selectGroup('${group.id}')`);
        button.setAttribute('title', group.description || group.title);
        
        // Create badge HTML
        const badgeIcon = group.type === 'informational' ? '📚' : '🎬';
        const badgeTitle = group.type === 'informational' ? 'Informational Videos' : 'Testimonial Videos';
        
        button.innerHTML = `
            <div class="group-content">
                <div class="group-left">
                    <span class="group-icon">${group.icon}</span>
                    <span class="group-title">${group.title}</span>
                </div>
                <div class="group-right">
                    <span class="type-badge" title="${badgeTitle}">${badgeIcon}</span>
                    <span class="group-count">${group.videoCount}</span>
                </div>
            </div>
        `;
        
        sidebar.appendChild(button);
    });
    
    // 7. Update dropdown if function exists
    if (typeof updateGroupDropdown === 'function') {
        updateGroupDropdown();
    }
    
    console.log(`✅ Rendered ${groupsArray.length} groups in sidebar`);
}

// CORRECTED updateGroupDropdown() - Shows BOTH types
function updateGroupDropdown() {
    console.log('🔄 Updating group dropdown from UNIFIED groups...');
    
    const dropdown = document.getElementById('selectGroupDropdown');
    if (!dropdown) return;
    
    const currentValue = dropdown.value;
    
    // Clear except first option
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    const allGroups = [];
    
    // ✅ FIXED: Get from UNIFIED groups (not testimonialGroups/informationalGroups)
    if (window.testimonialData?.groups) {
        Object.entries(window.testimonialData.groups).forEach(([id, group]) => {
            allGroups.push({
                id: id,
                title: group.name || group.title || id,  // ✅ Use group.name
                type: group.type || 'testimonial'
            });
        });
    }
    
    console.log(`📋 Found ${allGroups.length} total groups for dropdown`);
    
    // Sort and add options
    allGroups.sort((a, b) => a.title.localeCompare(b.title));
    
    allGroups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = `${group.type === 'informational' ? '📚' : '🎬'} ${group.title}`;
        dropdown.appendChild(option);
    });
    
    // Restore selection
    if (currentValue && allGroups.some(g => g.id === currentValue)) {
        dropdown.value = currentValue;
    }
    
    console.log(`✅ Dropdown updated with ${allGroups.length} groups`);
}

     // Add delete buttons
    setTimeout(addDeleteButtonsToGroups, 100);

// ===================================================
// 🏷️ SIMPLE TYPE BADGES FUNCTION
// ===================================================

function addTypeBadgesToGroups() {
    console.log('🎯 Adding video type badges...');
    
    // Check if data is available
    if (!window.testimonialData || !window.testimonialData.groups) {
        console.log('⏳ Data not loaded yet');
        return;
    }
    
    const groupButtons = document.querySelectorAll('.testimonial-group-btn, .group-btn, [onclick*="selectGroup"]');
    
    if (groupButtons.length === 0) {
        console.log('ℹ️ No group buttons found');
        return;
    }
    
    groupButtons.forEach(button => {
        // Get group ID from onclick attribute
        const onclick = button.getAttribute('onclick') || '';
        const match = onclick.match(/selectGroup\('([^']+)'/);
        const groupId = match ? match[1] : null;
        
        if (!groupId) return;
        
        // Get group data
        const group = window.testimonialData.groups[groupId];
        if (!group) return;
        
        const videoType = group.type || 'testimonial';
        
        // Remove existing badge if any
        const existingBadge = button.querySelector('.type-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Create new badge
        const badge = document.createElement('span');
        badge.className = 'type-badge';
        badge.innerHTML = videoType === 'informational' ? '📚' : '🎬';
        badge.title = videoType === 'informational' ? 'Informational Videos' : 'Testimonial Videos';
        badge.style.cssText = `
            margin-left: 8px;
            font-size: 12px;
            opacity: 0.8;
            vertical-align: middle;
        `;
        
        // Add to button
        button.appendChild(badge);
    });
    
    console.log(`✅ Added badges to ${groupButtons.length} group buttons`);
}

// Run when data changes or page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addTypeBadgesToGroups, 1000);
});

// Update your existing group rendering to include type
function updateGroupRendering() {
    // Your existing render code...
    
    // Add type badges
    setTimeout(addTypeBadgesToGroups, 100);
}

// ===================================================
// STATISTICS & DATA MANAGEMENT
// ===================================================
function updateStatistics() {
    const groups = testimonialData.testimonialGroups;
    let totalGroups = 0;
    let totalVideos = 0;
    let totalViews = 0;
    
    for (const [groupId, group] of Object.entries(groups)) {
        totalGroups++;
        totalVideos += group.testimonials ? group.testimonials.length : 0;
        totalViews += group.viewCount || 0;
    }
    
    testimonialData.statistics = {
        totalGroups,
        totalVideos,
        totalViews
    };
    
    updateStatisticsDisplay();
}

function updateStatisticsDisplay() {
    const stats = testimonialData.statistics;
    
    if (document.getElementById('statTotalGroups')) {
        document.getElementById('statTotalGroups').textContent = stats.totalGroups || 0;
    }
    if (document.getElementById('statTotalVideos')) {
        document.getElementById('statTotalVideos').textContent = stats.totalVideos || 0;
    }
    if (document.getElementById('statTotalViews')) {
        document.getElementById('statTotalViews').textContent = stats.totalViews || 0;
    }
}

function saveToLocalStorage() {
    try {
        const dataToSave = {
            testimonialGroups: testimonialData.testimonialGroups,
            statistics: testimonialData.statistics,
            savedAt: new Date().toISOString()
        };
        
        // Only save if data is valid
if (window.testimonialData && window.testimonialData.__version === '5.0-complete-fixed') {
  localStorage.setItem('enhancedTestimonialData', JSON.stringify(window.testimonialData));
}
        console.log('💾 Data saved to localStorage');
    } catch (e) {
        console.error('❌ Error saving to localStorage:', e);
    }
}

function saveAllData() {
    saveToLocalStorage();
    showSuccess('✅ All data saved successfully!');
}

// ===================================================
// CODE GENERATOR & DOWNLOAD
// ===================================================
function updateCodeOutput() {
    const codeOutput = document.getElementById('codeOutput');
    if (!codeOutput) return;
    
    // Create formatted data structure
    const formattedData = {
        ...testimonialData,
        __generated: new Date().toISOString(),
        __version: "2.0-groups-system"
    };
    
    const jsonString = JSON.stringify(formattedData, null, 2);
    
    // ✅ CORRECTED: Use groups, not testimonialGroups
    const totalGroups = Object.keys(formattedData.groups || {}).length;
    
    codeOutput.textContent = `// ===================================================\n` +
                             `// 🎬 TESTIMONIALS DATA - GENERATED\n` +
                             `// Generated: ${new Date().toLocaleString()}\n` +
                             `// Total Groups: ${totalGroups}\n` + // ✅ Fixed
                             `// Total Videos: ${formattedData.statistics?.totalVideos || 0}\n` +
                             `// ===================================================\n\n` +
                             `window.testimonialData = ${jsonString};\n\n` +
                             `console.log('✅ Testimonials Data Loaded:', \n` +
                             `  ${totalGroups}, 'groups');\n` + // ✅ Fixed
                             `console.log('🎬 Videos:', window.testimonialData.statistics?.totalVideos || 0);`;
}

function copyCode() {
    const code = document.getElementById('codeOutput').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showSuccess('✅ Code copied to clipboard!');
    }).catch(err => {
        showError('❌ Failed to copy: ' + err);
    });
}

function downloadJSFile() {
    updateCodeOutput();
    let code = document.getElementById('codeOutput').textContent;
    
    // Add player integration functions to the downloaded file
    const playerIntegrationCode = `

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
`;
    
    const fullCode = code + playerIntegrationCode;
    
    const blob = new Blob([fullCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testimonials-data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess('✅ JS file downloaded with player integration!');
}

function loadSampleData() {
    if (confirm('Load sample data? This will replace your current groups.')) {
        initializeSampleGroups();
        updateGroupsDisplay();
        updateCodeOutput();
        showSuccess('✅ Sample data loaded!');
    }
}

// In testimonials-data.js, add these functions:

// Get testimonials for a concern FROM ALL GROUPS
window.testimonialData.getTestimonialsByConcern = function(concernKey) {
    const allTestimonials = [];
    
    for (const [groupId, group] of Object.entries(this.testimonialGroups)) {
        if (group.concerns && group.concerns.includes(concernKey)) {
            if (group.testimonials) {
                // Add group info to each testimonial
                const groupTestimonials = group.testimonials.map(t => ({
                    ...t,
                    groupId: group.id,
                    groupName: group.name,
                    groupIcon: group.icon
                }));
                allTestimonials.push(...groupTestimonials);
            }
        }
    }
    
    return allTestimonials;
};

// Get all unique concerns from all groups
window.testimonialData.getAllUniqueConcerns = function() {
    const concernsSet = new Set();
    
    for (const [groupId, group] of Object.entries(this.testimonialGroups)) {
        if (group.concerns) {
            group.concerns.forEach(concern => concernsSet.add(concern));
        }
    }
    
    return Array.from(concernsSet).map(concernKey => ({
        key: concernKey,
        title: this.concerns[concernKey]?.title || concernKey,
        icon: this.concerns[concernKey]?.icon || '⭐',
        videoType: this.concerns[concernKey]?.videoType || 'skeptical',
        count: this.getTestimonialsByConcern(concernKey).length
    }));
};

function initializeSampleGroups() {
    console.log('📊 Initializing ENHANCED sample groups...');
    
    testimonialData.groups = {
        "group_price": {
            id: "group_price",
            type: "testimonial",
            name: "Price Concerns",
            slug: "price-concerns",
            icon: "💰",
            description: "Testimonials about pricing and value",
            primaryConcern: "price_cost",
            concerns: ["price_cost", "price_expensive", "price_affordability"],
            videoIds: [],
            createdAt: new Date().toISOString(),
            viewCount: 0
        },
        "group_how_it_works": {
            id: "group_how_it_works",
            type: "informational",
            name: "How It Works",
            slug: "how-it-works",
            icon: "📚",
            description: "Educational videos explaining our system",
            primaryConcern: "general_info",
            concerns: ["general_info", "general_demo"],
            videoIds: [],
            createdAt: new Date().toISOString(),
            viewCount: 0
        }
    };
    
    // Initialize empty videos object
    testimonialData.videos = {};
    
    updateStatistics();
    console.log('✅ Enhanced sample groups initialized');
}

// NEW: Get selected concerns from checkboxes
function getSelectedConcernKeys() {
    const selected = [];
    const activeSection = document.querySelector('.triggers-section[style*="block"]');
    
    if (activeSection) {
        const checkboxes = activeSection.querySelectorAll('.concern-checkbox:checked');
        checkboxes.forEach(cb => {
            selected.push(cb.value);
        });
    }
    
    console.log('🔍 Selected concerns:', selected);
    return selected;
}

// ===================================================
// UTILITY FUNCTIONS
// ===================================================
function showSuccess(message) {
    const el = document.getElementById('successMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 3000);
    }
}

function showError(message) {
    const el = document.getElementById('errorMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 3000);
    }
}

function showWarning(message) {
    const el = document.getElementById('warningMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 3000);
    }
}

function hideAllTestimonialsModal() {
    const modal = document.getElementById('allTestimonialsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===================================================
// 🚀 TEMPORARY FIX: Override broken functions
// ===================================================
setTimeout(() => {
    console.log('🔧 Applying temporary fixes for broken functions...');
    
    // FIX renderGroups
    if (window.renderGroups) {
        const originalRenderGroups = window.renderGroups;
        window.renderGroups = function() {
            console.log('🔧 TEMP FIX: renderGroups() using unified groups');
            
            const sidebar = document.getElementById('testimonialGroupsContainer');
            if (!sidebar) return originalRenderGroups();
            
            const groups = window.testimonialData?.groups || {};
            const groupIds = Object.keys(groups);
            
            if (groupIds.length === 0) {
                console.log('⚠️ No groups found to render');
                return originalRenderGroups();
            }
            
            console.log(`🔧 Rendering ${groupIds.length} groups temporarily`);
            
            // Simple rendering
            sidebar.innerHTML = '';
            groupIds.forEach(groupId => {
                const group = groups[groupId];
                const button = document.createElement('button');
                button.className = 'testimonial-group-btn';
                button.innerHTML = `
                    <span class="group-icon">${group.icon || '📁'}</span>
                    <span class="group-name">${group.name || groupId}</span>
                    <span class="group-count">${group.videoIds?.length || 0}</span>
                `;
                button.onclick = () => { if (window.selectGroup) window.selectGroup(groupId); };
                sidebar.appendChild(button);
            });
            
            return originalRenderGroups();
        };
        console.log('✅ Temporary fix for renderGroups applied');
        
        // Trigger it
        window.renderGroups();
    }
    
    // FIX updateGroupDropdown  
    if (window.updateGroupDropdown) {
        const originalUpdate = window.updateGroupDropdown;
        window.updateGroupDropdown = function() {
            console.log('🔧 TEMP FIX: updateGroupDropdown() using unified groups');
            
            const dropdown = document.getElementById('selectGroupDropdown');
            if (!dropdown) return originalUpdate();
            
            const groups = window.testimonialData?.groups || {};
            const groupIds = Object.keys(groups);
            
            if (groupIds.length === 0) {
                console.log('⚠️ No groups found for dropdown');
                return originalUpdate();
            }
            
            // Clear and add
            while (dropdown.options.length > 1) dropdown.remove(1);
            
            groupIds.forEach(groupId => {
                const group = groups[groupId];
                const option = document.createElement('option');
                option.value = groupId;
                option.textContent = `${group.icon || '📁'} ${group.name || groupId}`;
                dropdown.appendChild(option);
            });
            
            console.log(`🔧 Updated dropdown with ${groupIds.length} groups`);
            return originalUpdate();
        };
        console.log('✅ Temporary fix for updateGroupDropdown applied');
        
        // Trigger it
        window.updateGroupDropdown();
    }
}, 1000);

// ===================================================
// 🎯 SIMPLE GROUP CREATOR (ADD TO END OF FILE)
// ===================================================

console.log('🔧 Loading Simple Group Creator...');

// 1. Show the modal (works with your existing HTML)
function showSimpleGroupCreator() {
    console.log('🎬 Opening group creator');
    
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) {
        console.error('❌ Modal not found!');
        alert('Group creator not available. Please refresh.');
        return;
    }
    
    // Show modal
    modal.style.display = 'flex';
    
    // Reset form to defaults
    const nameInput = document.getElementById('newGroupName');
    const slugInput = document.getElementById('newGroupSlug');
    const typeSelect = document.getElementById('newGroupType');
    const descInput = document.getElementById('newGroupDescription');
    const iconInput = document.getElementById('newGroupIcon');
    
    if (nameInput) nameInput.value = '';
    if (slugInput) slugInput.value = '';
    if (typeSelect) typeSelect.value = 'testimonial';
    if (descInput) descInput.value = '';
    if (iconInput) iconInput.value = '🎬';
    
    // Update trigger sections based on type
    if (typeSelect) {
        updateTriggerSections(typeSelect.value);
    }
    
    // Focus on name field
    setTimeout(() => {
        if (nameInput) nameInput.focus();
    }, 100);
    
    console.log('✅ Modal shown');
}

// 2. Create group (simple version)
function createSimpleGroup() {
    console.log('🏗️ Creating group...');
    
    // Get values
    const nameInput = document.getElementById('newGroupName');
    const slugInput = document.getElementById('newGroupSlug');
    const typeSelect = document.getElementById('newGroupType');
    const descInput = document.getElementById('newGroupDescription');
    const iconInput = document.getElementById('newGroupIcon');
    
    if (!nameInput || !typeSelect) {
        alert('Form fields missing. Please refresh.');
        return;
    }
    
    const name = nameInput.value.trim();
    const type = typeSelect.value; // "testimonial" or "informational"
    
    if (!name) {
        alert('Please enter a group name');
        nameInput.focus();
        return;
    }
    
    // Get selected triggers
    const selectedTriggers = getSelectedTriggers();
    if (selectedTriggers.length === 0) {
        if (!confirm('No triggers selected. Create group anyway?')) {
            return;
        }
    }
    
    // Create group ID
    const slug = slugInput?.value.trim() || 
                name.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
    
    const groupId = 'group_' + slug.replace(/-/g, '_');
    
    // Create group object
    const group = {
        id: groupId,
        name: name,
        type: type,
        slug: slug,
        description: descInput?.value.trim() || '',
        icon: iconInput?.value.trim() || (type === 'informational' ? '📚' : '🎬'),
        triggers: selectedTriggers,
        videos: [],
        createdAt: new Date().toISOString(),
        viewCount: 0
    };
    
    console.log('📦 Group created:', group);
    
    // Add to data structure
    if (!window.testimonialData) {
        window.testimonialData = { groups: {}, videos: {}, statistics: {} };
    }
    
    if (!window.testimonialData.groups) {
        window.testimonialData.groups = {};
    }
    
    window.testimonialData.groups[groupId] = group;
    
    // Update statistics
    if (!window.testimonialData.statistics) {
        window.testimonialData.statistics = {
            totalGroups: 0,
            totalTestimonialGroups: 0,
            totalInformationalGroups: 0
        };
    }
    
    window.testimonialData.statistics.totalGroups = 
        Object.keys(window.testimonialData.groups).length;
    
    window.testimonialData.statistics.totalTestimonialGroups = 
        Object.values(window.testimonialData.groups).filter(g => g.type === 'testimonial').length;
    
    window.testimonialData.statistics.totalInformationalGroups = 
        Object.values(window.testimonialData.groups).filter(g => g.type === 'informational').length;
    
    // Hide modal
    const modal = document.getElementById('addTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Update UI
    updateGroupSidebar();
    
    // Show success
    alert(`✅ Group "${name}" created!`);
    console.log('✅ Group saved to testimonialData');
    
    return group;
}

// 3. Get selected triggers from checkboxes
function getSelectedTriggers() {
    const selected = [];
    const checkboxes = document.querySelectorAll('.concern-checkbox:checked');
    
    checkboxes.forEach(cb => {
        if (cb.value) {
            selected.push(cb.value);
        }
    });
    
    console.log(`📋 Selected ${selected.length} triggers:`, selected);
    return selected;
}

// 4. Update trigger sections when type changes
function updateTriggerSections(type) {
    console.log(`🔄 Updating triggers for type: ${type}`);
    
    // Show/hide trigger sections
    const testimonialSection = document.getElementById('testimonialTriggersCheckboxes');
    const infoSection = document.getElementById('informationalTriggersCheckboxes');
    
    if (testimonialSection) {
        testimonialSection.style.display = type === 'testimonial' ? 'block' : 'none';
    }
    
    if (infoSection) {
        infoSection.style.display = type === 'informational' ? 'block' : 'none';
    }
    
    // Also update icon
    const iconInput = document.getElementById('newGroupIcon');
    if (iconInput) {
        iconInput.value = type === 'informational' ? '📚' : '🎬';
    }
}

// 5. Update sidebar with groups
function updateGroupSidebar() {
    console.log('📋 Updating group sidebar...');
    
    // Find sidebar container
    const sidebar = document.querySelector('.sidebar-groups, .groups-list, [data-groups-container]') ||
                   document.getElementById('groupsContainer');
    
    if (!sidebar) {
        console.log('ℹ️ No sidebar found for groups');
        return;
    }
    
    // Clear existing
    sidebar.innerHTML = '';
    
    // Add groups
    if (window.testimonialData && window.testimonialData.groups) {
        const groups = Object.values(window.testimonialData.groups);
        
        if (groups.length === 0) {
            sidebar.innerHTML = '<p class="empty">No groups yet</p>';
            return;
        }
        
        groups.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.className = 'group-item';
            groupEl.innerHTML = `
                <div class="group-icon">${group.icon || '📁'}</div>
                <div class="group-info">
                    <strong>${group.name}</strong>
                    <small>${group.type === 'testimonial' ? '🎬 Testimonial' : '📚 Informational'}</small>
                </div>
                <div class="group-stats">
                    <span>${group.videos?.length || 0} videos</span>
                </div>
            `;
            
            sidebar.appendChild(groupEl);
        });
        
        console.log(`✅ Added ${groups.length} groups to sidebar`);
    }
}

// 6. Fix all "Create Group" buttons
function fixCreateGroupButtons() {
    console.log('🔧 Fixing Create Group buttons...');
    
    // Method 1: Find by onclick attribute
    const buttons = document.querySelectorAll('button, a, .btn');
    
    buttons.forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        const text = btn.textContent.trim();
        
        // Fix if it calls addNewTestimonialGroup() directly
        if (onclick.includes('addNewTestimonialGroup()') || 
            (text.includes('Create Group') && onclick === '')) {
            
            console.log('🔨 Fixing button:', text);
            
            // Replace with our simple function
            btn.setAttribute('onclick', 'showSimpleGroupCreator()');
            
            // Also add event listener
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showSimpleGroupCreator();
            }, true);
        }
    });
    
    // Method 2: Add a backup button if none exists
    setTimeout(() => {
        const hasCreateButton = Array.from(buttons).some(btn => 
            btn.textContent.includes('Create Group')
        );
        
        if (!hasCreateButton) {
            console.log('➕ Adding backup Create Group button');
            
            const backupBtn = document.createElement('button');
            backupBtn.id = 'backupCreateGroupBtn';
            backupBtn.className = 'btn btn-primary';
            backupBtn.innerHTML = '🎬 Create Video Group';
            backupBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            `;
            
            backupBtn.addEventListener('click', showSimpleGroupCreator);
            document.body.appendChild(backupBtn);
        }
    }, 2000);
}

function setupCheckboxListenersForModal() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (!modal) {
        console.log('❌ Modal not found in setup');
        return;
    }
    
    console.log('🔧 Setting up checkbox listeners...');
    
    const checkboxes = modal.querySelectorAll('input.concern-checkbox');
    const preview = document.getElementById('selectedTriggersPreview');
    
    if (!preview) {
        console.log('❌ selectedTriggersPreview not found');
        return;
    }
    
    console.log(`Found ${checkboxes.length} checkboxes`);
    
    // Remove old listeners and add new ones
    checkboxes.forEach(checkbox => {
        // Clone to remove existing listeners
        const newCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
        
        // ✅ CRITICAL: Add event listener that calls updateSelectedDisplay
        newCheckbox.addEventListener('change', function() {
            updateSelectedDisplay();
        });
    });
    
    // Also listen to name input
    const nameInput = modal.querySelector('#newGroupName');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            updateSelectedDisplay();
        });
        console.log('✅ Added listener to name input');
    }
    
    // ✅ CRITICAL: Initial update
    updateSelectedDisplay();
    
    console.log('✅ Checkbox listeners setup complete');
}

// 7. Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Simple Group Creator Initializing...');
    
    // Wait a bit for everything to load
    setTimeout(() => {
        // Fix buttons
        fixCreateGroupButtons();
        
        // Set up modal event listeners
        const modal = document.getElementById('addTestimonialGroupModal');
        if (modal) {
            // Close buttons
            const closeBtns = modal.querySelectorAll('.modal-close, .modal-backdrop, .btn-secondary');
            closeBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            });
            
            // Type change listener
            const typeSelect = modal.querySelector('#newGroupType');
            if (typeSelect) {
                typeSelect.addEventListener('change', function() {
                    updateTriggerSections(this.value);
                });
            }
            
            // Create button in modal
            const createBtn = modal.querySelector('.btn-primary');
            if (createBtn && createBtn.textContent.includes('Create')) {
                createBtn.setAttribute('onclick', 'createSimpleGroup()');
                createBtn.addEventListener('click', createSimpleGroup);
            }
        }
        
        // Initialize sidebar
        updateGroupSidebar();
        
        console.log('✅ Simple Group Creator Ready!');
        console.log('💡 Click any "Create Group" button or use window.showSimpleGroupCreator()');
    }, 1000);
});

// ===================================================
// 🔧 AUTOMATIC BUTTON FIXER
// ===================================================

function fixSidebarButton() {
    console.log('🔧 Looking for sidebar button...');
    
    // Method 1: Find by ID (your button)
    const sidebarBtn = document.getElementById('addTestimonialGroupBtn');
    if (sidebarBtn) {
        console.log('✅ Found sidebar button:', sidebarBtn.textContent);
        
        // Fix the onclick
        sidebarBtn.setAttribute('onclick', 'showSimpleGroupCreator()');
        
        // Also add event listener
        sidebarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Sidebar Add Video Group clicked');
            showSimpleGroupCreator();
        });
        
        // Make it look nice
        sidebarBtn.innerHTML = `
            <span class="btn-icon">🎬</span>
            <span class="btn-text">Add Video Group</span>
        `;
        
        sidebarBtn.style.cssText = `
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            justify-content: center;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        `;
        
        // Hover effect
        sidebarBtn.onmouseover = () => {
            sidebarBtn.style.transform = 'translateY(-2px)';
            sidebarBtn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        };
        sidebarBtn.onmouseout = () => {
            sidebarBtn.style.transform = 'translateY(0)';
            sidebarBtn.style.boxShadow = 'none';
        };
        
        console.log('✅ Sidebar button fixed');
    } else {
        console.log('❌ Sidebar button not found by ID');
        
        // Method 2: Search for button with "Add Video Group" text
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(btn => {
            if (btn.textContent.includes('Add Video Group')) {
                console.log('🔍 Found button by text:', btn);
                btn.setAttribute('onclick', 'showSimpleGroupCreator()');
                btn.addEventListener('click', showSimpleGroupCreator);
            }
        });
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixSidebarButton, 500);
});

// ===================================================
// 🚨 CRITICAL: EXPORT ESSENTIAL FUNCTIONS TO WINDOW
// ===================================================

// Make sure essential functions are globally available
if (typeof showAddTestimonialGroupModal === 'function') {
    window.showAddTestimonialGroupModal = showAddTestimonialGroupModal;
    console.log('✅ Exported showAddTestimonialGroupModal to window');
}

if (typeof addNewTestimonialGroup === 'function') {
    window.addNewTestimonialGroup = addNewTestimonialGroup;
    console.log('✅ Exported addNewTestimonialGroup to window');
}

if (typeof clearGroupForm === 'function') {
    window.clearGroupForm = clearGroupForm;
    console.log('✅ Exported clearGroupForm to window');
}

// Also fix GroupCreator error
if (typeof GroupCreator === 'undefined') {
    console.log('🔧 Creating missing GroupCreator...');
    window.GroupCreator = class GroupCreator {
        constructor() {
            console.log('🔧 GroupCreator instance created');
        }
        
        show() {
            console.log('🎬 GroupCreator.show() called');
            if (typeof showAddTestimonialGroupModal === 'function') {
                return showAddTestimonialGroupModal();
            } else if (typeof clearGroupForm === 'function') {
                return clearGroupForm();
            } else {
                console.error('❌ No group creator function available');
                return false;
            }
        }
        
        hide() {
            console.log('👋 GroupCreator.hide() called');
            if (typeof hideAddTestimonialGroupModal === 'function') {
                return hideAddTestimonialGroupModal();
            }
            return false;
        }
    };
    console.log('✅ GroupCreator defined and added to window');
}

// 8. Make functions globally available
window.showSimpleGroupCreator = showSimpleGroupCreator;
window.createSimpleGroup = createSimpleGroup;
window.updateGroupSidebar = updateGroupSidebar;

console.log('✅ Simple Group Creator functions loaded');

// ===================================================
// EXPORT FUNCTIONS TO WINDOW OBJECT
// ===================================================
window.showTestimonialOverlay = showTestimonialOverlay;
window.hideTestimonialOverlay = hideTestimonialOverlay; // ADD THIS LINE
window.updateGroupDropdown = updateGroupDropdown; // ADD THIS LINE
window.selectGroup = selectGroup;
window.showAddTestimonialGroupModal = showAddTestimonialGroupModal;
window.hideAddTestimonialGroupModal = hideAddTestimonialGroupModal;
window.addVideoTestimonial = addVideoTestimonial;
window.addTextTestimonial = addTextTestimonial;
window.playTestimonialVideo = playTestimonialVideo;
window.hideAllTestimonialsModal = hideAllTestimonialsModal;
window.hideVideoPlayerModal = hideVideoPlayerModal;
window.saveAllData = saveAllData;
window.downloadJSFile = downloadJSFile;
window.loadSampleData = loadSampleData;
window.copyCode = copyCode;
window.showTestimonialsForGroup = showTestimonialsForGroup;