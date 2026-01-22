// ===================================================
// TESTIMONIAL MANAGER JS - GROUPS SYSTEM
// ===================================================

// ============================================
// 🚨 CRITICAL - DATA STRUCTURE UNIFICATION
// ============================================

// 1. First, preserve any existing data from testimonials.js
if (window.testimonialData && window.testimonialData.testimonialGroups) {
    console.log('🔗 Found existing testimonials.js data structure');
    
    // Convert OLD structure to NEW structure
    const convertedGroups = {};
    
    // Convert testimonialGroups
    if (window.testimonialData.testimonialGroups) {
        Object.values(window.testimonialData.testimonialGroups).forEach(group => {
            convertedGroups[group.id] = {
                ...group,
                type: 'testimonial',
                videos: group.testimonials ? group.testimonials.map(t => t.id) : []
            };
        });
    }
    
    // Convert informationalGroups  
    if (window.testimonialData.informationalGroups) {
        Object.values(window.testimonialData.informationalGroups).forEach(group => {
            convertedGroups[group.id] = {
                ...group,
                type: 'informational',
                videos: group.videos ? group.videos.map(v => v.id) : []
            };
        });
    }
    
    // Update the data structure
    window.testimonialData = {
        groups: convertedGroups,
        videos: window.testimonialData.videos || {},
        concerns: window.testimonialData.concerns || {},
        statistics: window.testimonialData.statistics || {},
        playerConfig: window.testimonialData.playerConfig || {}
    };
    
    console.log(`✅ Converted ${Object.keys(convertedGroups).length} groups to new structure`);
}

// 2. Ensure backward compatibility functions
window.testimonialData.getConcernTestimonials = function(concernKey) {
    const results = [];
    
    for (const [groupId, group] of Object.entries(this.groups || {})) {
        if (group.concerns && group.concerns.includes(concernKey) && group.type === 'testimonial') {
            if (group.videos) {
                group.videos.forEach(videoId => {
                    const video = this.videos[videoId];
                    if (video) {
                        results.push({
                            ...video,
                            groupId: group.id,
                            groupName: group.name,
                            groupIcon: group.icon
                        });
                    }
                });
            }
        }
    }
    
    return results;
};

// 3. Sync function to keep both structures in sync
window.syncTestimonialStructures = function() {
    console.log('🔄 Syncing data structures...');
    
    if (!window.testimonialData) return;
    
    // Create OLD structure for testimonials.js compatibility
    const testimonialGroups = {};
    const informationalGroups = {};
    
    Object.values(window.testimonialData.groups || {}).forEach(group => {
        if (group.type === 'testimonial') {
            testimonialGroups[group.id] = {
                id: group.id,
                name: group.name,
                type: group.type,
                concerns: group.concerns || [],
                testimonials: (group.videos || []).map(videoId => {
                    const video = window.testimonialData.videos[videoId];
                    return video ? { ...video } : null;
                }).filter(Boolean),
                icon: group.icon || '⭐',
                description: group.description || '',
                created: group.created || new Date().toISOString()
            };
        } else if (group.type === 'informational') {
            informationalGroups[group.id] = {
                id: group.id,
                name: group.name,
                type: group.type,
                concerns: group.concerns || [],
                videos: (group.videos || []).map(videoId => {
                    const video = window.testimonialData.videos[videoId];
                    return video ? { ...video } : null;
                }).filter(Boolean),
                icon: group.icon || '📚',
                description: group.description || '',
                created: group.created || new Date().toISOString()
            };
        }
    });
    
    // Add old structure properties for compatibility
    window.testimonialData.testimonialGroups = testimonialGroups;
    window.testimonialData.informationalGroups = informationalGroups;
    
    console.log(`✅ Synced: ${Object.keys(testimonialGroups).length} testimonial groups, ${Object.keys(informationalGroups).length} informational groups`);
    return true;
};

// 4. Auto-sync on save
const originalSaveTestimonialData = window.saveTestimonialData;
if (originalSaveTestimonialData) {
    window.saveTestimonialData = function() {
        console.log('💾 Saving with structure sync...');
        window.syncTestimonialStructures();
        return originalSaveTestimonialData();
    };
}

/*
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.syncTestimonialStructures();
    }, 500);
});
*/

// ============================================
// 🚨 BACKWARD COMPATIBILITY LAYER
// ============================================

// Ensure the data structure exists
if (!window.testimonialData) {
    window.testimonialData = {};
}

// If using new structure (groups), convert to old structure temporarily
if (window.testimonialData.groups && !window.testimonialData.testimonialGroups) {
    console.log('🔄 Converting manager structure for testimonials.js...');
    
    const testimonialGroups = {};
    const informationalGroups = {};
    
    Object.values(window.testimonialData.groups).forEach(group => {
        if (group.type === 'testimonial') {
            testimonialGroups[group.id] = {
                id: group.id,
                name: group.name,
                concerns: group.concerns || [],
                testimonials: (group.videos || []).map(videoId => {
                    const video = window.testimonialData.videos[videoId];
                    return video ? { ...video } : null;
                }).filter(Boolean),
                icon: group.icon || '⭐'
            };
        } else if (group.type === 'informational') {
            informationalGroups[group.id] = {
                id: group.id,
                name: group.name,
                concerns: group.concerns || [],
                videos: (group.videos || []).map(videoId => {
                    const video = window.testimonialData.videos[videoId];
                    return video ? { ...video } : null;
                }).filter(Boolean),
                icon: group.icon || '📚'
            };
        }
    });
    
    // Set the old structure
    window.testimonialData.testimonialGroups = testimonialGroups;
    window.testimonialData.informationalGroups = informationalGroups;
    
    console.log(`✅ Converted ${Object.keys(testimonialGroups).length} testimonial groups`);
}

// ============================================
// 🛡️ DATA PRESERVATION - PREVENT DATA LOSS
// ============================================

// Save existing data BEFORE anything else runs
const existingTestimonialData = window.testimonialData;

// Ensure testimonialData always exists and preserves existing data
if (!window.testimonialData) {
    window.testimonialData = {};
}

// NEVER overwrite these properties if they already exist
const criticalProperties = ['groups', 'testimonialGroups', 'informationalGroups', 'videos'];

criticalProperties.forEach(prop => {
    if (existingTestimonialData && existingTestimonialData[prop] && !window.testimonialData[prop]) {
        window.testimonialData[prop] = existingTestimonialData[prop];
        console.log(`🛡️ Preserved existing ${prop} from previous load`);
    }
});

// Ensure arrays/objects exist
if (!window.testimonialData.groups) window.testimonialData.groups = [];
if (!window.testimonialData.testimonialGroups) window.testimonialData.testimonialGroups = {};
if (!window.testimonialData.informationalGroups) window.testimonialData.informationalGroups = {};
if (!window.testimonialData.videos) window.testimonialData.videos = {};

console.log(`📊 Data preserved: ${window.testimonialData.groups.length} groups, ${Object.keys(window.testimonialData.testimonialGroups).length} testimonial groups`);

// Global variables
let currentSelectedGroupId = null;
let testimonialData = window.testimonialData || {};


// Function to create proper button HTML
// ============================================
// 🎯 CRITICAL FIX: PROPER GROUP BUTTON RENDERER
// ============================================

window.createGroupButtonHTML = function(group) {
    if (!group) return '';
    
    const icon = group.type === 'informational' ? '📚' : '🎬';
    const videoCount = group.videos ? group.videos.length : 0;
    const type = group.type || 'testimonial';
    const groupName = group.name || 'Unnamed Group';
    
    return `
        <div class="group-button" 
             data-group-id="${group.id}" 
             onclick="selectGroup('${group.id}')"
             style="
                 display: flex !important;
                 align-items: center !important;
                 gap: 10px !important;
                 padding: 12px 15px !important;
                 background: white !important;
                 border: 1px solid #e1e5e9 !important;
                 border-radius: 8px !important;
                 cursor: pointer !important;
                 transition: all 0.2s ease !important;
                 text-align: left !important;
                 width: 100% !important;
                 margin-bottom: 8px !important;
                 box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
                 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
             "
             onmouseover="this.style.background='#f8f9fa'"
             onmouseout="this.style.background='white'">
            <span style="
                font-size: 20px !important;
                width: 24px !important;
                text-align: center !important;
                flex-shrink: 0 !important;
            ">${icon}</span>
            <div style="
                flex: 1 !important;
                min-width: 0 !important;
                overflow: hidden !important;
            ">
                <div style="
                    font-weight: 600 !important;
                    color: #1f2937 !important;
                    font-size: 14px !important;
                    line-height: 1.3 !important;
                    margin-bottom: 2px !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                ">${groupName.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                <div style="
                    font-size: 12px !important;
                    color: #6b7280 !important;
                    line-height: 1.2 !important;
                ">
                    ${videoCount} video${videoCount !== 1 ? 's' : ''}
                    <span style="margin: 0 4px">•</span>
                    ${type}
                </div>
            </div>
        </div>
    `;
};

// Function to force-fix broken buttons
window.fixBrokenGroupButtons = function() {
    console.log('🔧 Fixing broken group buttons...');
    
    // Find the sidebar container
    const sidebar = document.querySelector('#groups-sidebar, .groups-sidebar, .sidebar, [id*="sidebar"]');
    if (!sidebar) {
        console.log('❌ Sidebar not found');
        return;
    }
    
    // Check if we have groups
    if (!window.testimonialData || !window.testimonialData.groups) {
        console.log('📭 No groups data');
        return;
    }
    
    const groups = Object.values(window.testimonialData.groups);
    if (groups.length === 0) {
        console.log('📭 No groups to render');
        return;
    }
    
    console.log(`📊 Found ${groups.length} groups to render`);
    
    // Create all buttons HTML
    let buttonsHTML = '';
    groups.forEach(group => {
        buttonsHTML += window.createGroupButtonHTML(group);
    });
    
    // Wrap in container
    const containerHTML = `<div class="group-list" style="display: flex; flex-direction: column; gap: 8px; padding: 10px;">${buttonsHTML}</div>`;
    
    // Find where to put it
    const existingList = sidebar.querySelector('.group-list, [class*="list"]');
    
    if (existingList) {
        // Replace existing list
        existingList.innerHTML = containerHTML;
        console.log('✅ Replaced existing group list');
    } else {
        // Look for "SELECT A GROUP" text
        const walker = document.createTreeWalker(sidebar, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('SELECT A GROUP')) {
                // Insert after this text
                const parent = node.parentNode;
                const div = document.createElement('div');
                div.innerHTML = containerHTML;
                
                if (parent.nextSibling) {
                    parent.parentNode.insertBefore(div, parent.nextSibling);
                } else {
                    parent.parentNode.appendChild(div);
                }
                console.log('✅ Inserted group buttons after "SELECT A GROUP"');
                return;
            }
        }
        
        // If not found, just append to sidebar
        sidebar.innerHTML += containerHTML;
        console.log('✅ Appended group buttons to sidebar');
    }
};

// Patch the existing render function
if (window.renderTestimonialGroups) {
    const originalRender = window.renderTestimonialGroups;
    window.renderTestimonialGroups = function() {
        console.log('🔄 Patched renderTestimonialGroups called');
        const result = originalRender.apply(this, arguments);
        
        // Fix buttons after original render
        setTimeout(window.fixBrokenGroupButtons, 100);
        
        return result;
    };
    console.log('✅ Patched renderTestimonialGroups');
}

// Auto-fix on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        console.log('🚀 Auto-fixing group buttons...');
        window.fixBrokenGroupButtons();
        
        // Also fix every 2 seconds in case of updates
        setInterval(function() {
            const brokenButtons = document.querySelectorAll('.group-name, .group-info');
            if (brokenButtons.length > 0) {
                console.log(`🔄 Found ${brokenButtons.length} broken buttons, fixing...`);
                window.fixBrokenGroupButtons();
            }
        }, 2000);
    }, 1500);
});

// ===================================================
// 🛡️ COMPATIBILITY LAYER FOR ENHANCED CONCERNS SYSTEM
// Added: [Today's Date]
// ===================================================

// 1. ENHANCED CONCERNS DEFINITION (12 concerns)
window.ENHANCED_CONCERNS = {
    // Testimonial Concerns
    "price_cost": {
        "title": "Price & Cost",
        "icon": "💰",
        "type": "testimonial",
        "triggers": ["expensive", "cost", "price", "affordable", "worth it"],
        "description": "Concerns about pricing and value"
    },
    "time_speed": {
        "title": "Time & Speed", 
        "icon": "⏰",
        "type": "testimonial",
        "triggers": ["fast", "quick", "time", "speed", "efficient"],
        "description": "Concerns about implementation time and speed"
    },
    "trust_legitimacy": {
        "title": "Trust & Legitimacy",
        "icon": "🤝",
        "type": "testimonial", 
        "triggers": ["trust", "legit", "scam", "real", "reliable"],
        "description": "Concerns about trust and legitimacy"
    },
    "results_effectiveness": {
        "title": "Results & Effectiveness",
        "icon": "📈",
        "type": "testimonial",
        "triggers": ["results", "work", "effective", "outcomes", "proof"],
        "description": "Concerns about results and effectiveness"
    },
    "general_info": {
        "title": "General Information",
        "icon": "⭐",
        "type": "testimonial",
        "triggers": ["info", "details", "explain", "how", "what"],
        "description": "General questions and information"
    },
    
    // Informational Concerns
    "how_it_works": {
        "title": "How It Works",
        "icon": "⚙️",
        "type": "informational",
        "triggers": ["process", "work", "steps", "method", "approach"],
        "description": "Explanation of the process"
    },
    "benefits_features": {
        "title": "Benefits & Features",
        "icon": "✅",
        "type": "informational",
        "triggers": ["benefits", "features", "advantages", "pros", "what you get"],
        "description": "Benefits and key features"
    },
    "case_studies": {
        "title": "Case Studies",
        "icon": "📊",
        "type": "informational",
        "triggers": ["examples", "case studies", "stories", "results"],
        "description": "Real examples and case studies"
    },
    "faq": {
        "title": "FAQ",
        "icon": "❓",
        "type": "informational",
        "triggers": ["questions", "faq", "common", "answers", "doubts"],
        "description": "Frequently asked questions"
    },
    "comparison": {
        "title": "Comparison",
        "icon": "⚖️",
        "type": "informational",
        "triggers": ["vs", "compare", "alternative", "difference"],
        "description": "Comparisons with alternatives"
    },
    "setup_process": {
        "title": "Setup & Process",
        "icon": "🛠️",
        "type": "informational",
        "triggers": ["setup", "install", "get started", "onboarding"],
        "description": "Setup and implementation process"
    },
    "pricing_plans": {
        "title": "Pricing & Plans",
        "icon": "💳",
        "type": "informational",
        "triggers": ["pricing", "plans", "packages", "tiers", "cost"],
        "description": "Detailed pricing information"
    }
};

// Save groups to localStorage
function saveGroupsToStorage() {
    if (window.testimonialData && window.testimonialData.groups) {
        localStorage.setItem('testimonialGroups', JSON.stringify(window.testimonialData.groups));
        console.log('💾 Saved groups to localStorage');
    }
}

// Load groups from localStorage on page load
function loadGroupsFromStorage() {
    const savedGroups = localStorage.getItem('testimonialGroups');
    if (savedGroups) {
        try {
            const groups = JSON.parse(savedGroups);
            if (window.testimonialData) {
                window.testimonialData.groups = groups;
                console.log('📂 Loaded groups from localStorage:', Object.keys(groups).length);
                
                // Update UI
                if (window.renderTestimonialGroups) {
                    setTimeout(() => window.renderTestimonialGroups(), 100);
                }
            }
        } catch (e) {
            console.error('Error loading groups:', e);
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', loadGroupsFromStorage);

// Also save whenever groups change
const originalGroups = window.testimonialData?.groups;
if (originalGroups) {
    // Proxy the groups object to auto-save on changes
    window.testimonialData.groups = new Proxy(originalGroups, {
        set(target, property, value) {
            target[property] = value;
            saveGroupsToStorage();
            return true;
        },
        deleteProperty(target, property) {
            delete target[property];
            saveGroupsToStorage();
            return true;
        }
    });
}

// Add delete buttons to all groups
function addDeleteButtonsToGroups() {
    const groupButtons = document.querySelectorAll('.group-button, [data-group-id]');
    
    groupButtons.forEach(button => {
        // Check if delete button already exists
        if (button.querySelector('.group-delete-btn')) return;
        
        const groupId = button.dataset.groupId;
        if (!groupId) return;
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'group-delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.title = 'Delete this group';
        
        deleteBtn.onclick = function(e) {
            e.stopPropagation(); // Don't trigger group selection
            
            if (confirm('Are you sure you want to delete this group?')) {
                // Remove from data
                if (window.testimonialData?.groups?.[groupId]) {
                    delete window.testimonialData.groups[groupId];
                    console.log('🗑️ Deleted group:', groupId);
                    
                    // Save to storage
                    saveGroupsToStorage();
                    
                    // Update UI
                    if (window.renderTestimonialGroups) {
                        window.renderTestimonialGroups();
                    }
                }
            }
        };
        
        button.style.position = 'relative'; // Ensure positioning works
        button.appendChild(deleteBtn);
    });
}

// Run after groups are rendered
const originalRender = window.renderTestimonialGroups;
if (originalRender) {
    window.renderTestimonialGroups = function() {
        const result = originalRender.apply(this, arguments);
        // Add delete buttons after rendering
        setTimeout(addDeleteButtonsToGroups, 50);
        return result;
    };
}

// Also run periodically to catch any new buttons
setInterval(addDeleteButtonsToGroups, 1000);

// Add this to your testimonial-manager.js or a separate patch file
function enhanceGroupButtons() {
    // Find all group buttons
    const groupButtons = document.querySelectorAll('.group-button, [data-group-id]');
    
    groupButtons.forEach(button => {
        // Skip if already enhanced
        if (button.classList.contains('enhanced')) return;
        
        // Get group type from data or content
        let groupType = button.dataset.type;
        if (!groupType) {
            const text = button.textContent || '';
            groupType = text.includes('informational') ? 'informational' : 'testimonial';
        }
        
        // Add badge if not present
        if (!button.querySelector('.group-type-badge')) {
            const badge = document.createElement('span');
            badge.className = 'group-type-badge';
            badge.textContent = groupType === 'informational' ? 'INFO' : 'TESTIMONIAL';
            button.appendChild(badge);
        }
        
        // Make sure delete button is visible
        const deleteBtn = button.querySelector('.group-delete-btn, .delete-group-btn');
        if (deleteBtn) {
            deleteBtn.style.cssText = `
                position: absolute !important;
                right: 12px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                background: #EF4444 !important;
                color: white !important;
                border: none !important;
                border-radius: 6px !important;
                padding: 6px 12px !important;
                font-size: 12px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                z-index: 10 !important;
                opacity: 0.8 !important;
                transition: opacity 0.2s !important;
            `;
        }
        
        // Mark as enhanced
        button.classList.add('enhanced');
    });
}

// Run on page load and whenever buttons change
document.addEventListener('DOMContentLoaded', enhanceGroupButtons);
setInterval(enhanceGroupButtons, 1000); // Keep checking for new buttons

// 2. COMPATIBILITY FUNCTION
function ensureCompatibleStructure(existingData) {
    console.log('🔄 Checking data compatibility...');
    
    if (!existingData) {
        console.log('✅ No existing data, using new structure');
        return {
            concerns: window.ENHANCED_CONCERNS,
            testimonialGroups: {},
            informationalGroups: {},
            statistics: {
                totalTestimonialGroups: 0,
                totalInformationalGroups: 0,
                totalTestimonials: 0,
                totalInformationalVideos: 0
            }
        };
    }
    
    // If data already has the new structure we're using, return as-is
    if (existingData.testimonialGroups !== undefined || existingData.informationalGroups !== undefined) {
        console.log('✅ Data already in new structure (testimonialGroups/informationalGroups)');
        
        // Ensure concerns include ENHANCED_CONCERNS
        existingData.concerns = {
            ...window.ENHANCED_CONCERNS,
            ...existingData.concerns
        };
        
        return existingData;
    }
    
    // Check if this is OLD format (has .groups with mixed types)
    const hasOldGroups = existingData.groups && Object.keys(existingData.groups).length > 0;
    
    if (!hasOldGroups) {
        console.log('✅ Data is already in expected format');
        
        // Still ensure concerns are updated
        existingData.concerns = {
            ...window.ENHANCED_CONCERNS,
            ...existingData.concerns
        };
        
        return existingData;
    }
    
    console.log('🔄 Converting from unified groups structure to separate structure...');
    
    // Convert from unified .groups to separate .testimonialGroups/.informationalGroups
    const convertedData = {
        ...existingData,
        concerns: {
            ...window.ENHANCED_CONCERNS,
            ...existingData.concerns
        },
        testimonialGroups: {},
        informationalGroups: {},
        statistics: existingData.statistics || {
            totalTestimonialGroups: 0,
            totalInformationalGroups: 0,
            totalTestimonials: 0,
            totalInformationalVideos: 0
        }
    };
    
    // Move groups to appropriate structures
    Object.values(existingData.groups || {}).forEach(group => {
        if (group.type === 'informational') {
            convertedData.informationalGroups[group.id] = {
                ...group,
                videos: group.videoIds || group.videos || []
            };
            delete convertedData.informationalGroups[group.id].videoIds;
            
            // Update stats
            convertedData.statistics.totalInformationalGroups++;
            convertedData.statistics.totalInformationalVideos += (group.videos?.length || 0);
        } else {
            convertedData.testimonialGroups[group.id] = {
                ...group,
                testimonials: group.videoIds || group.testimonials || []
            };
            delete convertedData.testimonialGroups[group.id].videoIds;
            
            // Update stats
            convertedData.statistics.totalTestimonialGroups++;
            convertedData.statistics.totalTestimonials += (group.testimonials?.length || 0);
        }
    });
    
    // Remove old .groups structure
    delete convertedData.groups;
    
    console.log(`✅ Converted: ${Object.keys(existingData.groups || {}).length} unified groups → ${Object.keys(convertedData.testimonialGroups).length} testimonial + ${Object.keys(convertedData.informationalGroups).length} informational`);
    
    return convertedData;
}

// 3. CONCERN TYPE ENSURER
function ensureConcernTypes() {
    console.log('🔧 Ensuring concern types...');
    
    if (!window.testimonialData?.concerns) return;
    
    Object.values(window.testimonialData.concerns).forEach(concern => {
        // Add 'type' property if missing
        if (!concern.type) {
            concern.type = concern.isInformational ? 'informational' : 'testimonial';
        }
    });
    
    console.log('✅ Concern types updated');
}

// 4. TRIGGER CONTAINER FIX
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

// 5. INTEGRATE WITH MANAGER'S initializeTestimonialData()
const originalInitializeTestimonialData = window.initializeTestimonialData;
window.initializeTestimonialData = function() {
    console.log('🚀 Initializing with compatibility layer...');
    
    // First, apply compatibility fix
    if (window.testimonialData) {
        window.testimonialData = ensureCompatibleStructure(window.testimonialData);
    }
    
    // Ensure concern types
    ensureConcernTypes();
    
    // Then run the original initialization
    if (typeof originalInitializeTestimonialData === 'function') {
        return originalInitializeTestimonialData();
    }
    
    // Fallback if original doesn't exist
    console.log('⚠️ Using compatibility layer fallback initialization');
    
    return window.testimonialData;
};

console.log('✅ Compatibility layer loaded');

// ===================================================
// 🎯 SIMPLE GROUPS MONITOR (NO BLOCKING)
// ===================================================

console.log('🔍 Groups monitor active');

// Just log when groups change, never block
let lastGroupsCount = 0;

if (window.testimonialData) {
    // Simple property to track changes
    const groups = window.testimonialData.groups = window.testimonialData.groups || {};
    lastGroupsCount = Object.keys(groups).length;
    
    console.log(`   Starting with ${lastGroupsCount} groups`);
    
    // Optional: Monitor changes (just for debugging)
    setInterval(() => {
        const currentCount = Object.keys(window.testimonialData.groups || {}).length;
        if (currentCount !== lastGroupsCount) {
            console.log(`📊 Groups changed: ${lastGroupsCount} → ${currentCount}`);
            lastGroupsCount = currentCount;
        }
    }, 3000);
}

// ===================================================
// 🚑 EMERGENCY FUNCTION RESTORATION
// ===================================================

// Restore missing functions that the manager needs
setTimeout(() => {
    console.log('🔧 Checking for missing manager functions...');
    
    // List of essential functions the manager UI needs
    const essentialFunctions = [
        'setupEventListeners',
        'clearGroupForm', 
        'showAddTestimonialGroupModal',
        'createTestimonialGroup',
        'updateGroupType',
        'updateTriggerSections'
    ];
    
    let restoredCount = 0;
    essentialFunctions.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            console.log(`   ⚠️ ${funcName} is missing, creating placeholder`);
            
            // Create safe placeholder function
            window[funcName] = function() {
                console.warn(`⚠️ ${funcName}() called but not fully implemented`);
                console.log('   This function was restored by surgical fix');
                return null;
            };
            
            restoredCount++;
        }
    });
    
    if (restoredCount > 0) {
        console.log(`✅ Restored ${restoredCount} missing functions`);
    } else {
        console.log('✅ All essential functions present');
    }
}, 500);

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

function populateConcernsCheckboxes(groupType = null) {
    console.log(`🎯 Filtering concerns for: ${groupType || 'all'}`);
    
    const container = document.getElementById('concernsCheckboxContainer');
    if (!container) {
        console.log('📭 Container not found - modal might be closed');
        return;
    }
    
    const items = container.querySelectorAll('.concern-checkbox-item');
    console.log(`Found ${items.length} concern items`);
    
    // If no group type specified or type is 'all', show everything
    if (!groupType || groupType === 'all' || groupType === 'testimonial') {
        // Default to showing all (for testimonial type)
        items.forEach(item => item.style.display = 'block');
        console.log('✅ Showing all concerns');
        return;
    }
    
    // For informational type, show only informational concerns
    if (groupType === 'informational') {
        let visibleCount = 0;
        
        items.forEach(item => {
            const checkbox = item.querySelector('.concern-checkbox');
            if (!checkbox) {
                item.style.display = 'none';
                return;
            }
            
            const concernId = checkbox.id || checkbox.value || '';
            
            // Informational concerns (based on your checkbox IDs)
            const isInformational = concernId.includes('general_') || 
                                   concernId.includes('process_') ||
                                   concernId.includes('info_') ||
                                   concernId.includes('explain_');
            
            if (isInformational) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        console.log(`✅ Showing ${visibleCount} informational concerns`);
    }
}

// Initialize modal when shown
function initGroupCreationModal() {
    console.log('🎯 Initializing group creation modal...');
    
    // Set default type
    const typeSelect = document.getElementById('newGroupType');
    if (typeSelect) {
        updateGroupType(typeSelect.value);
    }
    
    // Populate concerns
    populateConcernsCheckboxes();
    
    // Clear form
    document.getElementById('newGroupName').value = '';
    document.getElementById('newGroupSlug').value = '';
    document.getElementById('newGroupDescription').value = '';
    
    // Uncheck all checkboxes
    document.querySelectorAll('.concern-checkbox').forEach(cb => {
        cb.checked = false;
    });
}

// Hook into existing show function
const originalShowModal = window.showAddTestimonialGroupModal;
if (originalShowModal) {
    window.showAddTestimonialGroupModal = function() {
        originalShowModal();
        setTimeout(initGroupCreationModal, 50); // Wait for modal to be visible
    };
}

// Also run on page load to pre-populate
setTimeout(populateConcernsCheckboxes, 2000);

// ADD THESE TWO FUNCTIONS AT THE VERY TOP OF THE FILE
// (before any other code)

function updateGroupType(type) {
    console.log(`🎯 updateGroupType called with: ${type}`);
    
    // FIXED: Only check for newGroupIcon
    const newGroupIcon = document.getElementById('newGroupIcon');
    
    if (!newGroupIcon) {
        console.error('❌ newGroupIcon element not found');
        return;
    }
    
    // Set icon based on type - FIXED LOGIC!
    if (type === 'testimonial') {
        newGroupIcon.value = '📁'; // Default testimonial icon
        console.log('🎬 Set icon to testimonial default');
    } else {
        newGroupIcon.value = '📚'; // Default informational icon  
        console.log('📚 Set icon to informational default');
    }
    
    // FIXED: testimonialTriggers and informationalTriggers don't exist anymore
    // Concerns are now handled by updateGroupConcernsCheckboxes function

    // Update concerns checkboxes based on group type
if (typeof populateConcernsCheckboxes === 'function') {
    populateConcernsCheckboxes();  // Call the ENHANCED version
} else {
    console.warn('populateConcernsCheckboxes not found');
}
    
    console.log(`✅ updateGroupType completed for: ${type}`);
}

// Also update your clearGroupForm function to handle these checkboxes
function clearGroupForm() {
    console.log('🧹 Clearing group form');
    
    // Clear inputs
    const inputs = ['newGroupName', 'newGroupIcon', 'newGroupConcern', 'newGroupTags'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    // SET TYPE DEFAULT
    const typeSelect = document.getElementById('newGroupType');
    if (typeSelect) {
        typeSelect.value = 'testimonial'; // This should match your dropdown
    }
    
    // Set icon default
    if (document.getElementById('newGroupIcon')) {
        document.getElementById('newGroupIcon').value = '🎬';
    }
    
    // Clear checkboxes
    document.querySelectorAll('#testimonialTriggers input[type="checkbox"], #informationalTriggers input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // IMPORTANT: This should show testimonial, hide informational
    updateGroupType('testimonial');
}

// Add this to initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // Populate triggers sections
        if (typeof populateConcernsCheckboxes === 'function') {
    populateConcernsCheckboxes('testimonial'); // Use default or appropriate type
}
        
        // Set up dropdown listener
        const typeSelect = document.getElementById('newGroupType');
        if (typeSelect) {
            typeSelect.addEventListener('change', function() {
                updateGroupType(this.value);
            });
        }
    }, 500);
});

// ============================================
// 🗑️ DELETE GROUP FUNCTION
// ============================================

function deleteTestimonialGroup(groupId) {
    console.log(`🗑️ Deleting group: ${groupId}`);
    
    if (!window.testimonialData || !window.testimonialData.groups) {
        console.error('❌ No groups data found');
        return false;
    }
    
    if (!window.testimonialData.groups[groupId]) {
        console.error(`❌ Group ${groupId} not found`);
        return false;
    }
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete group "${window.testimonialData.groups[groupId].name}"?`)) {
        return false;
    }
    
    // Delete the group
    delete window.testimonialData.groups[groupId];
    
    // Update statistics
    if (window.testimonialData.statistics) {
        window.testimonialData.statistics.totalGroups = Object.keys(window.testimonialData.groups).length;
    }
    
    console.log(`✅ Group ${groupId} deleted`);
    
    // Update UI
    if (typeof renderTestimonialGroups === 'function') {
        renderTestimonialGroups();
    }
    if (typeof updateStatistics === 'function') {
        updateStatistics();
    }
    if (typeof updateGroupDropdown === 'function') {
        updateGroupDropdown();
    }
    
    // Auto-save
    if (typeof saveTestimonialData === 'function') {
        saveTestimonialData();
    }
    
    return true;
}

// ============================================
// ➕ ADD VIDEO TO GROUP FUNCTION
// ============================================

function addVideoToGroup(groupId, videoId) {
    console.log(`➕ Adding video ${videoId} to group ${groupId}`);
    
    if (!window.testimonialData) {
        console.error('❌ No testimonialData found');
        return false;
    }
    
    const group = window.testimonialData.groups ? window.testimonialData.groups[groupId] : null;
    if (!group) {
        console.error(`❌ Group ${groupId} not found`);
        return false;
    }
    
    // Initialize videos array if needed
    if (!Array.isArray(group.videos)) {
        group.videos = [];
    }
    
    // Check if video already in group
    if (group.videos.includes(videoId)) {
        console.log(`ℹ️ Video ${videoId} already in group`);
        return false;
    }
    
    // Add video to group
    group.videos.push(videoId);
    
    console.log(`✅ Video ${videoId} added to group ${groupId}`);
    
    // Update UI
    if (typeof renderTestimonialGroups === 'function') {
        renderTestimonialGroups();
    }
    
    // Auto-save
    if (typeof saveTestimonialData === 'function') {
        saveTestimonialData();
    }
    
    return true;
}

// ============================================
// ➖ REMOVE VIDEO FROM GROUP FUNCTION
// ============================================

function removeVideoFromGroup(groupId, videoId) {
    console.log(`➖ Removing video ${videoId} from group ${groupId}`);
    
    if (!window.testimonialData) {
        console.error('❌ No testimonialData found');
        return false;
    }
    
    const group = window.testimonialData.groups ? window.testimonialData.groups[groupId] : null;
    if (!group) {
        console.error(`❌ Group ${groupId} not found`);
        return false;
    }
    
    // Check if group has videos array
    if (!Array.isArray(group.videos)) {
        console.error(`❌ Group ${groupId} has no videos array`);
        return false;
    }
    
    // Find video index
    const videoIndex = group.videos.indexOf(videoId);
    if (videoIndex === -1) {
        console.error(`❌ Video ${videoId} not found in group`);
        return false;
    }
    
    // Remove video
    group.videos.splice(videoIndex, 1);
    
    console.log(`✅ Video ${videoId} removed from group ${groupId}`);
    
    // Update UI
    if (typeof renderTestimonialGroups === 'function') {
        renderTestimonialGroups();
    }
    
    // Auto-save
    if (typeof saveTestimonialData === 'function') {
        saveTestimonialData();
    }
    
    return true;
}

// ============================================
// 🛠️ FIX DATA STRUCTURE CONFLICTS
// ============================================

function fixDataStructureConflicts() {
    console.log('🛠️ Fixing data structure conflicts...');
    
    if (!window.testimonialData) return;
    
    const data = window.testimonialData;
    
    // 1. Ensure groups is an OBJECT (not array)
    if (Array.isArray(data.groups)) {
        console.log('🔄 Converting groups array to object...');
        const groupsObj = {};
        data.groups.forEach(group => {
            if (group && group.id) {
                groupsObj[group.id] = group;
            }
        });
        data.groups = groupsObj;
    }
    
    // 2. Remove old conflicting structures
    if (data.testimonialGroups) {
        console.log('🧹 Removing testimonialGroups (old structure)...');
        
        // Merge any remaining groups from old structure
        Object.entries(data.testimonialGroups).forEach(([id, group]) => {
            if (!data.groups[id]) {
                data.groups[id] = {
                    ...group,
                    type: 'testimonial'
                };
            }
        });
        
        delete data.testimonialGroups;
    }
    
    if (data.informationalGroups) {
        console.log('🧹 Removing informationalGroups (old structure)...');
        
        // Merge any remaining groups from old structure
        Object.entries(data.informationalGroups).forEach(([id, group]) => {
            if (!data.groups[id]) {
                data.groups[id] = {
                    ...group,
                    type: 'informational'
                };
            }
        });
        
        delete data.informationalGroups;
    }
    
    // 3. Ensure videos exists
    if (!data.videos) {
        data.videos = {};
    }
    
    // 4. Update statistics
    if (data.statistics) {
        data.statistics.totalGroups = Object.keys(data.groups || {}).length;
        data.statistics.totalVideos = Object.keys(data.videos || {}).length;
    }
    
    console.log('✅ Data structure fixed');
    console.log(`   Groups: ${Object.keys(data.groups || {}).length}`);
    console.log(`   Structure: ${JSON.stringify(Object.keys(data))}`);
}

// Run fix on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixDataStructureConflicts, 500);
});

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
    
    // ============================================
    // 2. YOUR EXISTING LISTENERS (Keep these)
    // ============================================
    
    // Add Group Button
    const addGroupBtn = document.getElementById('addTestimonialGroupBtn');
    if (addGroupBtn) {
        addGroupBtn.addEventListener('click', function() {
            if (typeof resetGroupForm === 'function') {
                resetGroupForm();
            }
            showAddTestimonialGroupModal();
        });
        console.log('✅ Added listener for addTestimonialGroupBtn');
    }
    
    // Group Type Selector Change - FIXED!
const groupTypeSelect = document.getElementById('newGroupType'); // ← CHANGED THIS LINE!
if (groupTypeSelect) {
    groupTypeSelect.addEventListener('change', function() {
        console.log('🔄 Group type changed to:', this.value);
        
        // Call the function that exists
        if (typeof populateConcernsCheckboxes === 'function') {
            populateConcernsCheckboxes(this.value); // ✅ This function exists!
        }
        
        // Auto-update icon based on type
        const iconInput = document.getElementById('newGroupIcon');
        if (iconInput) {
            iconInput.value = this.value === 'informational' ? '📚' : '🎬';
        }
    });
    console.log('✅ Added listener for newGroupType');
}
    
    // Continue with all your existing listeners...
    // [Keep all your existing code from line 7 to the end]
    
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

// NEW: Reset group form when opening modal
function resetGroupForm() {
    console.log('🔄 Resetting group form...');
    
    // Clear form fields
    const groupName = document.getElementById('newGroupName');
    const groupSlug = document.getElementById('newGroupSlug');
    const groupIcon = document.getElementById('newGroupIcon');
    const groupType = document.getElementById('newGroupType');
    const groupDescription = document.getElementById('newGroupDescription');
    
    if (groupName) groupName.value = '';
    if (groupSlug) groupSlug.value = '';
    if (groupIcon) groupIcon.value = '🎬';
    if (groupType) groupType.value = 'testimonial';
    if (groupDescription) groupDescription.value = '';
    
    // Uncheck all concern checkboxes
    const checkboxes = document.querySelectorAll('.concern-checkbox');
    checkboxes.forEach(cb => {
        if (cb.checked) cb.checked = false;
    });
    
    // 🔥 FIXED: Call the CORRECT function
    if (typeof populateConcernsCheckboxes === 'function') {
        populateConcernsCheckboxes('testimonial');
    } else {
        console.warn('⚠️ populateConcernsCheckboxes function not found');
    }
    
    // Clear selected triggers preview
    const preview = document.getElementById('selectedTriggersPreview');
    if (preview) {
        preview.innerHTML = '<p class="no-triggers-message">No triggers selected yet</p>';
    }
    
    console.log('✅ Form reset complete');
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

// ===================================================
// GROUP MANAGEMENT
// ===================================================
function showAddTestimonialGroupModal() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('newGroupName').focus();
        
        // Populate concern checkboxes
        populateConcernCheckboxes();
    }
}

function hideAddTestimonialGroupModal() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Clear form
        document.getElementById('newGroupName').value = '';
        document.getElementById('newGroupSlug').value = '';
        document.getElementById('newGroupIcon').value = '📁';
        document.getElementById('newGroupDescription').value = '';
        
        // Clear checkboxes
        const checkboxes = document.querySelectorAll('.concern-checkbox');
        checkboxes.forEach(cb => cb.checked = false);
    }
}

function populateConcernCheckboxes() {
    const container = document.getElementById('concernsCheckboxContainer');
    if (!container) return;
    
    // 12 CONCERNS - 6 for testimonials, 6 for informational
    const concerns = {
        // Testimonial concerns (social proof, objections)
        'price_expensive': '💰 Expensive (expensive, too much)',
        'price_cost': '💰 Cost/Price (cost, price, how much)',
        'price_affordability': '💰 Affordability (afford, worth it, budget)',
        'time_busy': '⏰ Too Busy (busy, no time, overwhelmed)',
        'time_speed': '⏰ Speed/Timing (time, when, long, fast)',
        'trust_skepticism': '🤝 Skepticism (skeptical, not sure, doubt)',
        'trust_legitimacy': '🤝 Legitimacy (scam, real, trust, believe)',
        'results_effectiveness': '📈 Effectiveness (work, results, effective)',
        'results_worry': '📈 Worry/Concern (worried, concerned, afraid)',
        
        // Informational concerns (educational, process)
        'general_info': '⭐ General Information (information, explain)',
        'general_demo': '⭐ Demo Request (show me, demonstrate, demo)',
        'process_explanation': '🔄 Process Explanation (how it works, process)'
    };
    
    // Clear container
    container.innerHTML = '';
    
    // Create checkboxes
    Object.entries(concerns).forEach(([key, label]) => {
        const checkboxId = `concern_${key}`;
        
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'concern-checkbox-item';
        checkboxItem.innerHTML = `
            <input type="checkbox" 
                   id="${checkboxId}" 
                   class="concern-checkbox" 
                   value="${key}">
            <label for="${checkboxId}" class="concern-checkbox-label">
                ${label}
            </label>
        `;
        
        container.appendChild(checkboxItem);
    });
    
    console.log(`✅ Populated ${Object.keys(concerns).length} concern checkboxes`);
}

function createTestimonialGroup() {
    // Get form values
    const name = document.getElementById('newGroupName').value.trim();
    const slug = document.getElementById('newGroupSlug').value.trim();
    const icon = document.getElementById('newGroupIcon').value.trim() || '📁';
    const description = document.getElementById('newGroupDescription').value.trim();
    
    // Validation
    if (!name) {
        showError('Please enter a group name');
        return;
    }
    
    if (!slug) {
        showError('Please enter a group slug (URL-friendly name)');
        return;
    }
    
    // Get selected concerns
    const selectedConcerns = [];
    const checkboxes = document.querySelectorAll('.concern-checkbox:checked');
    checkboxes.forEach(cb => {
        selectedConcerns.push(cb.value);
    });
    
    // Create group ID
    const groupId = 'group_' + slug.replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    
    // Create new group object
    const newGroup = {
        id: groupId,
        name: name,
        slug: slug,
        icon: icon,
        description: description,
        concerns: selectedConcerns,
        testimonials: [],
        createdAt: new Date().toISOString(),
        viewCount: 0
    };
    
    // Add to data structure
    testimonialData.testimonialGroups[groupId] = newGroup;
    
    // Update statistics
    updateStatistics();
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update ALL UI components
    updateGroupsDisplay();
    updateGroupDropdown();
    selectGroup(groupId); // Auto-select the new group
    
    // Close modal and show success
    hideAddTestimonialGroupModal();
    showSuccess(`✅ Group "${name}" created successfully!`);
    
    console.log('Created new group:', newGroup);
}

// NEW FUNCTION: UPDATE GROUP DROPDOWN
function updateGroupDropdown() {
    const dropdown = document.getElementById('selectGroupDropdown');
    if (!dropdown) return;
    
    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    if (!window.testimonialData || !window.testimonialData.testimonialGroups) {
        return;
    }
    
    // Sort groups: Informational first, then Testimonial
    const groups = Object.entries(window.testimonialData.testimonialGroups);
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
        
        option.textContent = `${typeBadge} ${group.title || groupId}${typeText}`;
        option.title = group.description || `Type: ${videoType} videos`;
        
        // Add data attribute for type
        option.setAttribute('data-type', videoType);
        
        dropdown.appendChild(option);
    });
    
    console.log(`✅ Updated dropdown with ${groups.length} groups`);
}

function renderTestimonialGroups() {
    console.log('🔄 Rendering testimonial groups sidebar...');
    
    const container = document.getElementById('testimonialGroupsContainer');
    if (!container) {
        console.error('❌ testimonialGroupsContainer not found');
        return;
    }
    
    // 🔥 FIXED: Handle multiple possible data structures
    let groupsArray = []; // For rendering
    let groupsObject = {}; // For reference
    
    // Check ALL possible data locations
    if (window.testimonialData) {
        // Try unified groups first - ALWAYS KEEP AS OBJECT
        if (window.testimonialData.groups) {
            if (Array.isArray(window.testimonialData.groups)) {
                console.warn('⚠️ WARNING: groups is array, converting to object temporarily');
                
                // Convert array to object for processing
                const tempObject = {};
                window.testimonialData.groups.forEach((group, index) => {
                    if (group && group.id) {
                        tempObject[group.id] = group;
                    } else if (group) {
                        tempObject['temp-' + index] = { ...group, id: 'temp-' + index };
                    }
                });
                
                groupsObject = tempObject;
                groupsArray = window.testimonialData.groups;
                
                console.log(`📊 Using groups array (converted to object): ${groupsArray.length} items`);
                
                // 🚨 CRITICAL: Convert back to object in memory
                setTimeout(() => {
                    if (window.testimonialData && Array.isArray(window.testimonialData.groups)) {
                        console.log('🔄 Auto-fixing: Converting groups array to object in memory');
                        window.testimonialData.groups = groupsObject;
                    }
                }, 100);
                
            } else if (typeof window.testimonialData.groups === 'object') {
                // ✅ CORRECT: groups is already an object
                groupsObject = window.testimonialData.groups;
                groupsArray = Object.values(groupsObject); // Only for rendering
                
                console.log(`📊 Using groups object: ${Object.keys(groupsObject).length} groups`);
                // DO NOT convert window.testimonialData.groups to array!
            }
        }
        
        // Also check testimonialGroups if needed (backward compatibility)
        if (groupsArray.length === 0 && window.testimonialData.testimonialGroups) {
            if (Array.isArray(window.testimonialData.testimonialGroups)) {
                groupsArray = window.testimonialData.testimonialGroups;
                console.log(`📊 Using testimonialGroups array: ${groupsArray.length} items`);
            } else if (typeof window.testimonialData.testimonialGroups === 'object') {
                // Convert but warn about old structure
                groupsArray = Object.values(window.testimonialData.testimonialGroups);
                console.log(`📊 Converted testimonialGroups object to array: ${groupsArray.length} items`);
                console.warn('⚠️ Using old testimonialGroups structure. Consider migrating to unified groups.');
            }
        }
    }
    
    // If still no groups, show empty state
    if (!groupsArray || groupsArray.length === 0) {
        console.log('📭 No groups to display');
        container.innerHTML = `
            <div id="noGroupsMessage" class="empty-state">
                <div class="empty-icon">📂</div>
                <div class="empty-title">No groups yet</div>
                <div class="empty-subtitle">Create your first testimonial group</div>
            </div>
        `;
        return;
    }
    
    console.log(`✅ Will render ${groupsArray.length} groups`);
    
    // Clear container
    container.innerHTML = '';
    
    // Render each group
    groupsArray.forEach(group => {
        // Ensure group has required properties
        const groupId = group.id || group.slug || 'unknown-' + Date.now();
        const groupName = group.name || 'Unnamed Group';
        const groupIcon = group.icon || '🎬';
        const groupType = group.type || 'testimonial';
        const videoCount = Array.isArray(group.videos) ? group.videos.length : 
                         (group.testimonials ? group.testimonials.length : 0); // Handle both structures
        
        const groupElement = document.createElement('div');
        groupElement.className = 'testimonial-group-item';
        groupElement.dataset.groupId = groupId;
        
        // Add visual indicator if this was converted from array
        const conversionIndicator = Array.isArray(window.testimonialData?.groups) ? '🔄 ' : '';
        
        groupElement.innerHTML = `
            <div class="group-icon">${groupIcon}</div>
            <div class="group-info">
                <div class="group-name">${conversionIndicator}${groupName}</div>
                <div class="group-meta">
                    <span class="group-videos">${videoCount} video${videoCount !== 1 ? 's' : ''}</span>
                    <span class="group-type">${groupType}</span>
                </div>
            </div>
            <div class="group-actions">
                <button class="btn-icon" onclick="editTestimonialGroup('${groupId}')" title="Edit">
                    ✏️
                </button>
                <button class="btn-icon" onclick="deleteTestimonialGroup('${groupId}')" title="Delete">
                    🗑️
                </button>
            </div>
        `;
        
        // Add click handler
        groupElement.addEventListener('click', function(e) {
            if (!e.target.closest('.group-actions')) {
                console.log(`📁 Selecting group: ${groupName} (${groupId})`);
                
                // Find the actual group in our object if possible
                let actualGroup = group;
                if (groupsObject[groupId]) {
                    actualGroup = groupsObject[groupId];
                }
                
                selectGroup(groupId, true, 'sidebar');
                
                // Highlight selected group
                document.querySelectorAll('.testimonial-group-item').forEach(item => {
                    item.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
        
        container.appendChild(groupElement);
    });
    
    console.log(`✅ Rendered ${groupsArray.length} groups in sidebar`);
    
    // 🚨 CRITICAL: Ensure data structure stays correct
    if (window.testimonialData && Array.isArray(window.testimonialData.groups) && groupsObject && Object.keys(groupsObject).length > 0) {
        console.log('🔄 Post-render: Ensuring groups remains as object');
        
        // Defer this to avoid recursion
        setTimeout(() => {
            if (window.testimonialData && Array.isArray(window.testimonialData.groups)) {
                window.testimonialData.groups = groupsObject;
                console.log('✅ Fixed: groups is now object structure');
                
                // Auto-save if needed
                if (typeof autoSaveTestimonialData === 'function') {
                    setTimeout(autoSaveTestimonialData, 500);
                }
            }
        }, 1000);
    }
    
    return groupsArray.length; // Return count for monitoring
}

// Helper to ensure groups is always object
function ensureGroupsIsObject() {
    if (window.testimonialData) {
        if (Array.isArray(window.testimonialData.groups)) {
            console.warn('🔄 ensureGroupsIsObject: Converting array to object');
            const groupsArray = window.testimonialData.groups;
            const groupsObject = {};
            
            groupsArray.forEach((group, index) => {
                if (group && group.id) {
                    groupsObject[group.id] = group;
                } else if (group) {
                    groupsObject['ensure-' + index] = { ...group, id: 'ensure-' + index };
                }
            });
            
            window.testimonialData.groups = groupsObject;
            console.log(`✅ Converted ${groupsArray.length} groups to object`);
            return true;
        }
    }
    return false;
}

// CHANGE TO (simple):
function monitorDataStructure() {
    console.log('✅ Clean monitoring active');
    // Don't auto-fix, just log
    setInterval(() => {
        if (window.testimonialData) {
            const isArray = Array.isArray(window.testimonialData.groups);
            if (isArray) {
                console.warn('⚠️ MONITOR: groups is array (but not auto-fixing)');
            }
        }
    }, 10000); // Check every 10 seconds, not 3
}

// Start monitoring on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(monitorDataStructure, 2000);
});

// ===================================================
// UI UPDATES
// ===================================================
function loadAndDisplayData() {
    updateGroupsDisplay();
    updateGroupDropdown(); // NEW LINE - Initialize dropdown
    updateStatisticsDisplay();
}

function cleanupDuplicates() {
    console.log('🧹 ONE-TIME CLEANUP - FIXING WHITE BUTTON ISSUE');
    
    // 1. First, find and remove any existing group buttons
    const container = document.getElementById('testimonialGroupsContainer');
    if (container) {
        // Remove ALL existing buttons
        container.innerHTML = '';
        console.log('✅ Cleared all existing buttons');
    }
    
    // 2. Remove the success indicator if it exists (this is the bottom purple button)
    const existingIndicators = document.querySelectorAll('[style*="position: fixed"][style*="bottom: 10px"][style*="left: 10px"]');
    existingIndicators.forEach(indicator => indicator.remove());
    console.log('✅ Removed bottom purple indicator');
    
    // 3. Wait a moment for any re-rendering to complete
    setTimeout(() => {
        // 4. Check if we still have the wrong white button (in the sidebar or elsewhere)
        const sidebar = document.querySelector('.sidebar, [class*="sidebar"], [class*="Sidebar"]');
        if (sidebar) {
            // Look for white buttons in the sidebar
            const whiteButtons = sidebar.querySelectorAll('button, .button, [class*="button"], [class*="Button"]');
            whiteButtons.forEach(button => {
                // Check if it looks like a group button
                const buttonText = button.textContent || button.innerText;
                if (buttonText.includes('videos') || buttonText.includes('group') || 
                    button.hasAttribute('data-group-id')) {
                    
                    // Remove it if it's white or has wrong styling
                    const bgColor = window.getComputedStyle(button).backgroundColor;
                    if (bgColor.includes('255, 255, 255') || bgColor === 'white' || 
                        bgColor === 'rgb(255, 255, 255)') {
                        button.remove();
                        console.log('✅ Removed white button from sidebar');
                    }
                }
            });
        }
        
        // 5. If we have group data, create ONE proper purple button
        if (window.testimonialData && window.testimonialData.groups && container) {
            const groups = Object.values(window.testimonialData.groups);
            if (groups.length > 0) {
                const group = groups[0];
                
                const button = document.createElement('div');
                button.className = 'group-button clean-button';
                button.dataset.groupId = group.id;
                
                const icon = group.type === 'informational' ? '📚' : '🎬';
                const videoCount = group.videos ? group.videos.length : 0;
                
                button.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                        <span style="font-size: 22px; width: 30px; text-align: center;">${icon}</span>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-weight: 700; color: white; font-size: 15px; margin-bottom: 4px;">
                                ${group.name} ✅
                            </div>
                            <div style="font-size: 12px; color: rgba(255,255,255,0.9);">
                                ${videoCount} videos • CLEAN
                            </div>
                        </div>
                    </div>
                `;
                
                // PURPLE styling - only one color
                button.style.cssText = `
                    display: flex !important;
                    align-items: center !important;
                    padding: 14px 16px !important;
                    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%) !important;
                    color: white !important;
                    border: 2px solid white !important;
                    border-radius: 12px !important;
                    cursor: pointer !important;
                    margin-bottom: 12px !important;
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4) !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    width: 100% !important;
                `;
                
                container.appendChild(button);
                console.log('✅ Created single CLEAN purple button');
            }
        }
        
        console.log('✅ Cleanup complete - white button should be gone');
    }, 100); // Small delay to ensure rendering is complete
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
    
    // 🎯 FIXED: Check ALL group locations
let group = null;
let foundIn = '';

// 1. First check unified groups (primary location)
if (window.testimonialData?.groups?.[groupId]) {
    group = window.testimonialData.groups[groupId];
    foundIn = 'unified groups';
}
// 2. Check testimonialGroups (backward compatibility)
else if (window.testimonialData?.testimonialGroups?.[groupId]) {
    group = window.testimonialData.testimonialGroups[groupId];
    foundIn = 'testimonialGroups';
}
// 3. Check informationalGroups (backward compatibility)
else if (window.testimonialData?.informationalGroups?.[groupId]) {
    group = window.testimonialData.informationalGroups[groupId];
    foundIn = 'informationalGroups';
}

if (!group) {
    console.error('❌ Group not found:', groupId);
    console.error('   Checked locations: groups, testimonialGroups, informationalGroups');
    return;
}

console.log(`✅ Found group in ${foundIn}: ${group.name || groupId}`);
    
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
        
        mainContent.innerHTML = `
            <div class="content-header">
                <h2>
                    <span class="group-icon">${group.icon || '📁'}</span>
                    ${group.title || groupId}
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
        console.log('   Group:', group.title || groupId);
        console.log('   Type:', group.type || 'testimonial');
        
        // Update manager header if it exists
        const managerHeader = document.querySelector('.manager-header, .selected-group-header');
        if (managerHeader) {
            managerHeader.innerHTML = `
                <h3>${group.icon || '📁'} ${group.title || groupId}</h3>
                <p class="text-muted">${group.description || 'Ready to add testimonials'}</p>
            `;
        }
    } else {
        console.log('⚠️ mainContent element not found, skipping UI update');
        // 🆕 CRITICAL: Don't trigger any modals here!
    }
    
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
        return; // STOP HERE - don't show modal!
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

// Add this helper function to get all video triggers for debugging
function getAllVideoTriggers() {
    const triggers = [];
    
    // Get testimonial triggers from existing system
    if (window.testimonialData && window.testimonialData.testimonialGroups) {
        Object.values(window.testimonialData.testimonialGroups).forEach(group => {
            if (group.testimonials) {
                group.testimonials.forEach(testimonial => {
                    if (testimonial.concernType) triggers.push(testimonial.concernType);
                    if (testimonial.tags) triggers.push(...testimonial.tags);
                });
            }
            if (group.videos) {
                group.videos.forEach(video => {
                    if (video.tags) triggers.push(...video.tags);
                });
            }
        });
    }
    
    return [...new Set(triggers)]; // Remove duplicates
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

// ============================================
// 🎯 PERMANENT FIX FOR GROUP BUTTON DISPLAY
// ============================================
// Fixes group buttons to show names instead of IDs
// Add this AFTER your existing group rendering code
// ============================================

(function() {
    'use strict';
    
    console.log('🎯 Loading Group Button Display Fix...');
    
    // 1. MAIN FIX FUNCTION
    function fixGroupButtonDisplay() {
        const groupList = document.querySelector('#testimonialGroupsContainer, .group-list, .sidebar-groups, .groups-container');
        
        if (!groupList) return;
        
        const groupButtons = groupList.querySelectorAll('.testimonial-group-btn, .group-btn');
        
        groupButtons.forEach(btn => {
            // Get current HTML and extract ID if present
            const currentHTML = btn.innerHTML;
            const idMatch = currentHTML.match(/group_[a-zA-Z0-9_]+/);
            
            if (idMatch) {
                const groupId = idMatch[0];
                let groupName = null;
                let groupType = 'testimonial';
                
                // Look for group in testimonialData
                if (window.testimonialData) {
                    if (window.testimonialData.testimonialGroups && window.testimonialData.testimonialGroups[groupId]) {
                        groupName = window.testimonialData.testimonialGroups[groupId].name;
                        groupType = 'testimonial';
                    } else if (window.testimonialData.informationalGroups && window.testimonialData.informationalGroups[groupId]) {
                        groupName = window.testimonialData.informationalGroups[groupId].name;
                        groupType = 'informational';
                    }
                }
                
                if (groupName) {
                    // Create proper HTML structure
                    const icon = groupType === 'informational' ? '📚' : '📁';
                    const typeIcon = groupType === 'informational' ? '📚' : '🎬';
                    
                    btn.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.2em;">${icon}</span>
                            <span style="flex-grow: 1; font-weight: 500;">${groupName}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span style="font-size: 0.9em;">${typeIcon}</span>
                            <span style="font-size: 0.9em;">0</span>
                        </div>
                    `;
                    
                    // Set data attributes
                    btn.setAttribute('data-group-id', groupId);
                    btn.setAttribute('data-group-type', groupType);
                    
                    // Apply correct styling
                    const bgColor = groupType === 'informational' 
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                    
                    btn.style.cssText = `
                        background: ${bgColor};
                        color: white;
                        border: none;
                        border-radius: 10px;
                        padding: 12px 15px;
                        margin-bottom: 8px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        position: relative;
                        width: 100%;
                    `;
                    
                    // Add hover effects
                    btn.onmouseenter = () => {
                        btn.style.transform = 'translateY(-2px)';
                        btn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
                    };
                    
                    btn.onmouseleave = () => {
                        btn.style.transform = 'translateY(0)';
                        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    };
                }
            }
        });
    }
    
    // 2. WRAP EXISTING RENDERING FUNCTIONS
    function wrapRenderingFunctions() {
        const functionNames = ['renderGroups', 'updateGroupsDisplay', 'loadGroups'];
        
        functionNames.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                const originalFunc = window[funcName];
                window[funcName] = function(...args) {
                    // Call original function
                    const result = originalFunc.apply(this, args);
                    
                    // Fix buttons after rendering
                    setTimeout(fixGroupButtonDisplay, 100);
                    
                    return result;
                };
            }
        });
    }
    
    // 3. INITIAL SETUP
    function initGroupButtonFix() {
        // Wrap existing rendering functions
        wrapRenderingFunctions();
        
        // Run initial fix
        setTimeout(fixGroupButtonDisplay, 500);
        
        // Set up mutation observer for dynamic changes
        const groupObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const isGroupButton = node.classList && 
                                (node.classList.contains('testimonial-group-btn') || 
                                 node.classList.contains('group-btn'));
                            
                            const containsGroupButton = node.querySelector && 
                                node.querySelector('.testimonial-group-btn, .group-btn');
                            
                            if (isGroupButton || containsGroupButton) {
                                setTimeout(fixGroupButtonDisplay, 50);
                            }
                        }
                    });
                }
            });
        });
        
        // Find and observe group container
        const container = document.querySelector('#testimonialGroupsContainer, .group-list, .sidebar-groups');
        if (container) {
            groupObserver.observe(container, {
                childList: true,
                subtree: true
            });
        }
        
        console.log('✅ Group Button Display Fix loaded');
    }
    
    // 4. WAIT FOR PAGE TO LOAD AND INITIALIZE
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGroupButtonFix);
    } else {
        initGroupButtonFix();
    }
    
    // 5. EXPOSE FOR DEBUGGING (optional)
    window.fixGroupButtons = fixGroupButtonDisplay;
    
})();

function addNewTestimonialGroup() {
    console.log('➕ Creating new testimonial group...');
    
    // Get form values
    const name = document.getElementById('newGroupName').value.trim();
    let slug = document.getElementById('newGroupSlug').value.trim();
    const icon = document.getElementById('newGroupIcon').value.trim();
    const type = document.getElementById('newGroupType').value;
    const description = document.getElementById('newGroupDescription').value.trim();
    
    // Validate
    if (!name) {
        showNotification('❌ Please enter a group name', 'error');
        return;
    }
    
    // Auto-generate slug if empty
    if (!slug) {
        slug = name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('newGroupSlug').value = slug;
    }
    
    // Get selected concerns
    const selectedConcerns = [];
    const checkboxes = document.querySelectorAll('.concern-checkbox:checked');
    checkboxes.forEach(cb => {
        selectedConcerns.push(cb.value);
    });
    
    // Create group ID
    const groupId = slug;
    
    // Create complete group object
    const newGroup = {
        id: groupId,
        name: name,
        slug: slug,
        icon: icon || (type === 'informational' ? '📚' : '🎬'),
        type: type || 'testimonial',
        description: description || '',
        triggers: selectedConcerns,
        videos: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        viewCount: 0
    };
    
    console.log('📦 New group:', newGroup);
    
    // Ensure proper data structure
    if (!window.testimonialData) {
        window.testimonialData = { groups: [] };
    }
    
    if (!Array.isArray(window.testimonialData.groups)) {
        if (typeof window.testimonialData.groups === 'object') {
            window.testimonialData.groups = Object.values(window.testimonialData.groups);
            console.log('🔄 Converted groups object to array');
        } else {
            window.testimonialData.groups = [];
        }
    }
    
    // Check if group already exists
    const exists = window.testimonialData.groups.find(g => g.slug === slug);
    if (exists) {
        showNotification(`❌ Group "${slug}" already exists`, 'error');
        return;
    }
    
    // Add to array
    window.testimonialData.groups.push(newGroup);
    console.log(`✅ Group added. Total: ${window.testimonialData.groups.length}`);
    
    // 🔄 COMPATIBILITY: Also save to old structure
    if (!window.testimonialData.testimonialGroups) {
        window.testimonialData.testimonialGroups = {};
    }
    if (!window.testimonialData.informationalGroups) {
        window.testimonialData.informationalGroups = {};
    }
    
    if (type === 'testimonial') {
        window.testimonialData.testimonialGroups[groupId] = newGroup;
    } else {
        window.testimonialData.informationalGroups[groupId] = newGroup;
    }
    
    // Save data
    if (typeof saveAllData === 'function') {
        saveAllData();
    } else {
        localStorage.setItem('testimonialData', JSON.stringify(window.testimonialData));
    }
    
    // Update UI
    updateGroupDropdown();
    renderTestimonialGroups(); // 🔥 CRITICAL - updates sidebar!
    updateStatistics();
    
    // Close modal
    hideAddTestimonialGroupModal();
    
    // Show success
    showNotification(`✅ "${name}" group created!`);
    
    // Update code output
    if (typeof updateCodeOutput === 'function') {
        updateCodeOutput();
    }
    
    // Select the new group
    setTimeout(() => {
        selectGroup(slug, false, 'manager');
    }, 100);
    
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
    
    // Update data structure
    window.testimonialData.testimonialGroups[groupId || newGroupId] = groupData;
    
    // Update UI
    updateGroupDropdown();
    
    // Show appropriate message
    const typeText = videoType === 'informational' ? 'Informational video' : 'Testimonial';
    showNotification(`✅ ${typeText} group ${groupId ? 'updated' : 'created'} successfully`);
}

// Function to add type badges to all groups in sidebar
function addTypeBadgesToGroups() {
    const groupElements = document.querySelectorAll('.testimonial-group-btn, [id*="group-btn"]');
    
    groupElements.forEach(element => {
        // Extract group ID
        const onclickAttr = element.getAttribute('onclick');
        const match = onclickAttr?.match(/selectGroup\('([^']+)'/);
        const groupId = match ? match[1] : null;
        
        if (!groupId || !window.testimonialData?.testimonialGroups?.[groupId]) return;
        
        const group = window.testimonialData.testimonialGroups[groupId];
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

// Call this after any data changes
function refreshGroupUI() {
    updateGroupDropdown();
    addTypeBadgesToGroups();
}

// Function to delete a group
function deleteGroup(groupId) {
    if (!groupId || !window.testimonialData?.testimonialGroups?.[groupId]) {
        console.error('❌ Cannot delete: Group not found');
        return;
    }
    
    const group = window.testimonialData.testimonialGroups[groupId];
    const videoType = group.type || 'testimonial';
    const videoCount = (videoType === 'informational' ? group.videos : group.testimonials)?.length || 0;
    
    const confirmation = confirm(`🗑️ DELETE "${group.title || groupId}" GROUP?\n\n` +
                               `Type: ${videoType === 'informational' ? 'Informational Videos' : 'Testimonial Videos'}\n` +
                               `Videos: ${videoCount}\n\n` +
                               `This will permanently delete the group and all ${videoCount} videos inside it.\n` +
                               `This action cannot be undone!`);
    
    if (!confirmation) return;
    
    console.log(`🗑️ Deleting ${videoType} group "${groupId}" with ${videoCount} videos`);
    
    // Remove from data structure
    delete window.testimonialData.testimonialGroups[groupId];
    
    // Clear selection if this was the selected group
    if (window.selectedGroupId === groupId) {
        window.selectedGroupId = null;
    }
    
    // Update UI
    updateGroupDropdown();
    selectGroup(null); // Clear the main content
    
    // If you have a sidebar render function, update it too
    if (typeof renderGroups === 'function') {
        renderGroups();
    }
    
    // Save changes
    saveAllData();
    
    // Show notification
    showNotification(`✅ ${videoType === 'informational' ? 'Informational' : 'Testimonial'} group deleted successfully`, 'success');
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
    
    // 3. Get groups - FROM NEW v3.0 STRUCTURE
    const testimonialGroups = window.testimonialData?.testimonialGroups || {};
    const informationalGroups = window.testimonialData?.informationalGroups || {};
    const groups = {...testimonialGroups, ...informationalGroups};
    
    console.log(`📊 Found ${Object.keys(groups).length} groups to render`);
    
    if (Object.keys(groups).length === 0) {
        console.log('📭 No groups data found');
        // Show empty state message if it exists
        const noGroupsMessage = document.getElementById('noGroupsMessage');
        if (noGroupsMessage) noGroupsMessage.style.display = 'block';
        return;
    }
    
    // 4. Create buttons for each group
    Object.values(groups).forEach(group => {
        const btn = document.createElement('button');
        btn.className = 'testimonial-group-btn';
        btn.setAttribute('data-group-id', group.id);
        
        // Determine icon and color based on type
        const isTestimonial = group.type === 'testimonial';
        const typeColor = isTestimonial ? '#3b82f6' : '#10b981';
        const typeIcon = isTestimonial ? '🎬' : '📚';
        
        btn.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span>${group.icon || '📁'}</span>
                    <span style="font-weight: bold;">${group.name}</span>
                </div>
                <span style="background: ${typeColor}; 
                      color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px;">
                    ${typeIcon}
                </span>
            </div>
        `;
        
        btn.style.cssText = `
            display: block; width: 100%; padding: 10px; margin: 5px 0;
            background: white; border: 2px solid ${typeColor}; border-radius: 6px;
            cursor: pointer; text-align: left;
            transition: all 0.2s ease;
        `;
        
        // Add hover effect
        btn.onmouseenter = () => {
            btn.style.transform = 'translateX(5px)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        };
        
        btn.onmouseleave = () => {
            btn.style.transform = 'translateX(0)';
            btn.style.boxShadow = 'none';
        };
        
        // Click handler
        btn.onclick = () => {
            console.log(`🎯 Group selected: ${group.name} (${group.id})`);
            if (window.selectGroup) {
                window.selectGroup(group.id);
            }
        };
        
        sidebar.appendChild(btn);
    });
    
    console.log(`✅ Rendered ${Object.keys(groups).length} groups in sidebar`);
    
    // 5. Update dropdown if function exists
    if (typeof updateGroupDropdown === 'function') {
        updateGroupDropdown();
    }
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

// Add this to your testimonial-manager.js
function addTypeBadgesToGroups() {
    console.log('🎯 Adding video type badges...');
    
    // WAIT for data to be loaded
    if (!window.testimonialManagerData && !window.testimonialData) {
        console.log('⏳ Data not loaded yet, will retry...');
        setTimeout(addTypeBadgesToGroups, 500); // Retry in 500ms
        return;
    }
    
    const groupButtons = document.querySelectorAll('.testimonial-group-btn');
    
    groupButtons.forEach(groupBtn => {
        // Get group ID
        const onclickAttr = groupBtn.getAttribute('onclick');
        const groupIdMatch = onclickAttr?.match(/selectGroup\('([^']+)'/);
        const groupId = groupIdMatch ? groupIdMatch[1] : null;
        
        // Check BOTH data sources
        if (!groupId) return;
        
        // Try testimonialManagerData first, then testimonialData
        let group = null;
        if (window.testimonialManagerData?.testimonialGroups?.[groupId]) {
            group = window.testimonialManagerData.testimonialGroups[groupId];
        } else if (window.testimonialData?.testimonialGroups?.[groupId]) {
            group = window.testimonialData.testimonialGroups[groupId];
        }
        
        if (!group) {
            console.log(`⚠️ Group ${groupId} not found in any data source`);
            return;
        }
        
        const videoType = group.type || 'testimonial'; // Default to testimonial
        
        // Check if badge already exists
        if (groupBtn.querySelector('.type-badge')) return;
        
        // Create badge element
        const badge = document.createElement('div');
        badge.className = `type-badge ${videoType}`;
        badge.textContent = videoType === 'informational' ? '📚 Info' : '🎬 Testimonial';
        
        // Add to button
        groupBtn.appendChild(badge);
        
        console.log(`✅ Added ${videoType} badge to "${group.title || groupId}"`);
    });
    
    console.log(`✅ Processed ${groupButtons.length} group buttons`);
}

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
    console.log('📊 Updating statistics...');
    
    try {
        // Get the data safely
        const data = window.testimonialData || testimonialData;
        
        if (!data) {
            console.warn('⚠️ No testimonialData found for statistics');
            return;
        }
        
        // Ensure groups and videos exist
        const groups = data.groups || {};
        const videos = data.videos || {};
        
        // Count groups by type safely
        let testimonialGroups = 0;
        let informationalGroups = 0;
        
        if (groups && typeof groups === 'object') {
            // Use Object.values() which is safer than Object.entries()
            Object.values(groups).forEach(group => {
                if (group && group.type === 'informational') {
                    informationalGroups++;
                } else {
                    testimonialGroups++;
                }
            });
        }
        
        // Count total videos
        const totalVideos = Object.keys(videos).length;
        
        // Count videos in groups
        let videosInGroups = 0;
        if (groups && typeof groups === 'object') {
            Object.values(groups).forEach(group => {
                if (group && Array.isArray(group.videos)) {
                    videosInGroups += group.videos.length;
                }
            });
        }
        
        // Update statistics object
        if (!data.statistics) {
            data.statistics = {};
        }
        
        data.statistics.totalGroups = Object.keys(groups).length;
        data.statistics.totalTestimonialGroups = testimonialGroups;
        data.statistics.totalInformationalGroups = informationalGroups;
        data.statistics.totalVideos = totalVideos;
        data.statistics.videosInGroups = videosInGroups;
        
        // Update the UI if elements exist
        setTimeout(() => {
            // Update total groups
            const totalGroupsEl = document.getElementById('totalGroups');
            if (totalGroupsEl) {
                totalGroupsEl.textContent = data.statistics.totalGroups;
            }
            
            // Update testimonial groups
            const testimonialGroupsEl = document.getElementById('testimonialGroups');
            if (testimonialGroupsEl) {
                testimonialGroupsEl.textContent = data.statistics.totalTestimonialGroups;
            }
            
            // Update informational groups
            const informationalGroupsEl = document.getElementById('informationalGroups');
            if (informationalGroupsEl) {
                informationalGroupsEl.textContent = data.statistics.totalInformationalGroups;
            }
            
            // Update total videos
            const totalVideosEl = document.getElementById('totalVideos');
            if (totalVideosEl) {
                totalVideosEl.textContent = data.statistics.totalVideos;
            }
            
            // Update videos in groups
            const videosInGroupsEl = document.getElementById('videosInGroups');
            if (videosInGroupsEl) {
                videosInGroupsEl.textContent = data.statistics.videosInGroups;
            }
            
            console.log('✅ Statistics updated:', {
                totalGroups: data.statistics.totalGroups,
                testimonialGroups: data.statistics.totalTestimonialGroups,
                informationalGroups: data.statistics.totalInformationalGroups,
                totalVideos: data.statistics.totalVideos,
                videosInGroups: data.statistics.videosInGroups
            });
        }, 100);
        
    } catch (error) {
        console.error('❌ Error updating statistics:', error);
        console.error('Error details:', error.message);
    }
}

function updateStatisticsDisplay() {
    const stats = document.getElementById('statisticsDisplay');
    if (!stats) return;
    
    const testimonialGroups = Object.keys(window.testimonialData.testimonialGroups || {}).length;
    const informationalGroups = Object.keys(window.testimonialData.informationalGroups || {}).length;
    const totalTestimonials = Object.values(window.testimonialData.testimonialGroups || {}).reduce((sum, group) => sum + (group.testimonials?.length || 0), 0);
    const totalInfoVideos = Object.values(window.testimonialData.informationalGroups || {}).reduce((sum, group) => sum + (group.videos?.length || 0), 0);
    
    stats.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Testimonial Groups:</span>
            <span class="stat-value">${testimonialGroups}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Informational Groups:</span>
            <span class="stat-value">${informationalGroups}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Testimonials:</span>
            <span class="stat-value">${totalTestimonials}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Informational Videos:</span>
            <span class="stat-value">${totalInfoVideos}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Videos:</span>
            <span class="stat-value">${totalTestimonials + totalInfoVideos}</span>
        </div>
    `;
}

function saveTestimonialChanges() {
    console.log('💾 Saving testimonial changes...');
    
    try {
        // Get current form data
        const groupId = document.getElementById('editGroupId').value;
        const name = document.getElementById('editGroupName').value;
        const icon = document.getElementById('editGroupIcon').value;
        const description = document.getElementById('editGroupDescription').value;
        const type = document.getElementById('editGroupType').value;
        
        // Get selected concerns
        const concernCheckboxes = document.querySelectorAll('#editConcernsContainer input[type="checkbox"]:checked');
        const concerns = Array.from(concernCheckboxes).map(cb => cb.value);
        
        if (!groupId || !name) {
            alert('Group ID and Name are required');
            return;
        }
        
        // Update the group
        if (type === 'testimonial') {
            if (window.testimonialData.testimonialGroups[groupId]) {
                window.testimonialData.testimonialGroups[groupId].name = name;
                window.testimonialData.testimonialGroups[groupId].icon = icon;
                window.testimonialData.testimonialGroups[groupId].description = description;
                window.testimonialData.testimonialGroups[groupId].concerns = concerns;
                
                console.log('✅ Testimonial group updated:', groupId);
            }
        } else if (type === 'informational') {
            if (window.testimonialData.informationalGroups[groupId]) {
                window.testimonialData.informationalGroups[groupId].name = name;
                window.testimonialData.informationalGroups[groupId].icon = icon;
                window.testimonialData.informationalGroups[groupId].description = description;
                window.testimonialData.informationalGroups[groupId].concerns = concerns;
                
                console.log('✅ Informational group updated:', groupId);
            }
        }
        
        // Update display
        updateGroupsDisplay();
        updateCodeOutput();
        updateStatisticsDisplay();
        
        // Auto-save
        if (typeof autoSaveChanges === 'function') {
            autoSaveChanges();
        }
        
        // Close modal
        const modal = document.getElementById('editGroupModal');
        if (modal) modal.style.display = 'none';
        
        showSuccess('✅ Group saved successfully!');
        
    } catch (error) {
        console.error('❌ Error saving changes:', error);
        showError('Failed to save group: ' + error.message);
    }
}

function saveToLocalStorage() {
    try {
        console.log('💾 saveToLocalStorage: Saving complete data...');
        
        if (!window.testimonialData) {
            console.error('❌ No testimonialData to save!');
            return;
        }
        
        // ✅ INITIALIZE structures (but don't overwrite existing data!)
        if (!window.testimonialData.groups) window.testimonialData.groups = {};
        if (!window.testimonialData.testimonialGroups) window.testimonialData.testimonialGroups = {};
        if (!window.testimonialData.informationalGroups) window.testimonialData.informationalGroups = {};
        if (!window.testimonialData.concerns) window.testimonialData.concerns = {};
        
        // ✅ CRITICAL FIX: Build NEW groups object FIRST
        const newGroupsObject = {};
        
        // Add testimonial groups
        Object.values(window.testimonialData.testimonialGroups).forEach(group => {
            newGroupsObject[group.id] = group;
        });
        
        // Add informational groups  
        Object.values(window.testimonialData.informationalGroups).forEach(group => {
            newGroupsObject[group.id] = group;
        });
        
        // ✅ Assign the COMPLETE object (not empty!)
        window.testimonialData.groups = newGroupsObject;
        
        // ✅ Update statistics
        if (!window.testimonialData.statistics) {
            window.testimonialData.statistics = {};
        }
        
        window.testimonialData.statistics.totalTestimonialGroups = Object.keys(window.testimonialData.testimonialGroups).length;
        window.testimonialData.statistics.totalInformationalGroups = Object.keys(window.testimonialData.informationalGroups).length;
        window.testimonialData.statistics.totalGroups = Object.keys(newGroupsObject).length;
        
        // Calculate video counts
        const totalTestimonials = Object.values(window.testimonialData.testimonialGroups).reduce((sum, group) => 
            sum + (group.testimonials?.length || 0), 0);
        const totalInfoVideos = Object.values(window.testimonialData.informationalGroups).reduce((sum, group) => 
            sum + (group.videos?.length || 0), 0);
        
        window.testimonialData.statistics.totalTestimonials = totalTestimonials;
        window.testimonialData.statistics.totalInformationalVideos = totalInfoVideos;
        window.testimonialData.statistics.totalVideos = totalTestimonials + totalInfoVideos;
        
        // ✅ Save to localStorage
        localStorage.setItem('testimonialData', JSON.stringify(window.testimonialData));
        
        console.log('✅ CORRECT data saved to localStorage');
        console.log(`   📊 Total Groups: ${window.testimonialData.statistics.totalGroups}`);
        console.log(`   🎬 Testimonial Groups: ${window.testimonialData.statistics.totalTestimonialGroups}`);
        console.log(`   📚 Informational Groups: ${window.testimonialData.statistics.totalInformationalGroups}`);
        console.log(`   🎬 Total Videos: ${window.testimonialData.statistics.totalVideos}`);
        
    } catch (e) {
        console.error('❌ Error saving to localStorage:', e);
    }
}

function saveAllData() {
    console.log('💾 saveAllData: Starting save process...');
    saveToLocalStorage();
    // REMOVE the showSuccess call to prevent double banners
    // showSuccess('✅ All data saved successfully!');
}

// ===================================================
// CODE GENERATOR & DOWNLOAD - V3.0
// ===================================================
function updateCodeOutput() {
    const codeOutput = document.getElementById('codeOutput');
    if (!codeOutput) return;
    
    // Get current data
    const currentData = window.testimonialData;
    
    // Create CLEAN v3.0 structure (NO duplication)
    const formattedData = {
        videoUrls: currentData.videoUrls || {},
        videoDurations: currentData.videoDurations || {},
        
        // ⭐ TESTIMONIALS ONLY
        testimonialGroups: currentData.testimonialGroups || {},
        
        // 📚 INFORMATIONAL VIDEOS ONLY
        informationalGroups: currentData.informationalGroups || {},
        
        statistics: {
            totalTestimonialGroups: Object.keys(currentData.testimonialGroups || {}).length,
            totalInformationalGroups: Object.keys(currentData.informationalGroups || {}).length,
            totalTestimonials: Object.values(currentData.testimonialGroups || {}).reduce((sum, group) => sum + (group.testimonials?.length || 0), 0),
            totalInformationalVideos: Object.values(currentData.informationalGroups || {}).reduce((sum, group) => sum + (group.videos?.length || 0), 0),
            totalGroups: Object.keys(currentData.testimonialGroups || {}).length + Object.keys(currentData.informationalGroups || {}).length,
            totalVideos: Object.values(currentData.testimonialGroups || {}).reduce((sum, group) => sum + (group.testimonials?.length || 0), 0) + 
                         Object.values(currentData.informationalGroups || {}).reduce((sum, group) => sum + (group.videos?.length || 0), 0)
        },
        
        playerConfig: currentData.playerConfig || {
            desktop: {
                width: 854,
                height: 480,
                top: "50%",
                left: "50%",
                borderRadius: "12px"
            },
            mobile: {
                fullscreen: true
            },
            overlay: {
                background: "rgba(0, 0, 0, 0.5)"
            },
            resumeMessage: "I'm sure you can appreciate what our clients have to say. So let's get back on track with helping you sell your practice. Would you like a free consultation with Bruce that can analyze your particular situation?"
        },
        
        __version: "3.0-dual-system",
        __generated: new Date().toISOString(),
        __notes: "Separated testimonials (social proof) from informational videos (educational)"
    };
    
    const jsonString = JSON.stringify(formattedData, null, 2);
    
    codeOutput.textContent = `// ===================================================\n` +
                             `// 🎬 DUAL VIDEO SYSTEM DATA - v3.0\n` +
                             `// Generated: ${new Date().toLocaleString()}\n` +
                             `// Testimonial Groups: ${formattedData.statistics.totalTestimonialGroups}\n` +
                             `// Informational Groups: ${formattedData.statistics.totalInformationalGroups}\n` +
                             `// Total Videos: ${formattedData.statistics.totalVideos}\n` +
                             `// ===================================================\n\n` +
                             `window.testimonialData = ${jsonString};\n\n` +
                             `console.log('✅ DUAL VIDEO SYSTEM LOADED:');\n` +
                             `console.log('   ⭐ Testimonial Groups:', window.testimonialData.statistics.totalTestimonialGroups);\n` +
                             `console.log('   📚 Informational Groups:', window.testimonialData.statistics.totalInformationalGroups);\n` +
                             `console.log('   🎬 Total Videos:', window.testimonialData.statistics.totalVideos);`;
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
    console.log('🔄 Exporting testimonial data...');
    
    // Get the ACTUAL data from manager
    const sourceData = window.testimonialData || {};
    
    // 🚨 CRITICAL: Convert NEW structure (groups) to OLD structure (testimonialGroups/informationalGroups)
    const testimonialGroups = {};
    const informationalGroups = {};
    const videos = {};
    
    // Process all groups from NEW structure
    Object.values(sourceData.groups || {}).forEach(group => {
        if (group && group.id) {
            if (group.type === 'informational') {
                // Informational group
                informationalGroups[group.id] = {
                    id: group.id,
                    name: group.name || group.id,
                    type: 'informational',
                    concerns: group.concerns || [],
                    videos: group.videos || [],  // Video IDs array
                    icon: group.icon || '📚',
                    description: group.description || '',
                    created: group.created || new Date().toISOString()
                };
                
                // Add informational videos
                (group.videos || []).forEach(videoId => {
                    if (sourceData.videos && sourceData.videos[videoId]) {
                        videos[videoId] = sourceData.videos[videoId];
                    }
                });
            } else {
                // Testimonial group
                testimonialGroups[group.id] = {
                    id: group.id,
                    name: group.name || group.id,
                    type: 'testimonial',
                    concerns: group.concerns || [],
                    testimonials: (group.videos || []).map(videoId => {
                        // Convert video IDs to testimonial objects
                        if (sourceData.videos && sourceData.videos[videoId]) {
                            return {
                                id: videoId,
                                title: sourceData.videos[videoId].title || `Video ${videoId}`,
                                url: sourceData.videos[videoId].url || '',
                                description: sourceData.videos[videoId].description || '',
                                duration: sourceData.videos[videoId].duration || 0
                            };
                        }
                        return { id: videoId, title: `Video ${videoId}`, url: '' };
                    }),
                    icon: group.icon || '⭐',
                    description: group.description || '',
                    created: group.created || new Date().toISOString()
                };
                
                // Add testimonial videos
                (group.videos || []).forEach(videoId => {
                    if (sourceData.videos && sourceData.videos[videoId]) {
                        videos[videoId] = sourceData.videos[videoId];
                    }
                });
            }
        }
    });
    
    // Create export data in OLD structure (for testimonials-data.js)
    const exportData = {
        // Video URLs and durations (template)
        videoUrls: sourceData.videoUrls || {
            "skeptical": "", "speed": "", "convinced": "", "excited": ""
        },
        videoDurations: sourceData.videoDurations || {
            "skeptical": 20000, "speed": 20000, "convinced": 20000, "excited": 20000
        },
        
        // Concerns - use ENHANCED_CONCERNS if available
        concerns: sourceData.concerns || window.ENHANCED_CONCERNS || {
            "price_expensive": { title: "Expensive", icon: "💰", videoType: "skeptical" },
            "price_cost": { title: "Cost/Price", icon: "💰", videoType: "skeptical" },
            "price_affordability": { title: "Affordability", icon: "💰", videoType: "skeptical" },
            "time_busy": { title: "Too Busy", icon: "⏰", videoType: "speed" },
            "time_speed": { title: "Speed/Timing", icon: "⏰", videoType: "speed" }
        },
        
        // 🚨 CONVERTED DATA: OLD structure
        testimonialGroups: testimonialGroups,
        informationalGroups: informationalGroups,
        
        // All videos
        videos: videos,
        
        // Statistics
        statistics: {
            totalTestimonialGroups: Object.keys(testimonialGroups).length,
            totalInformationalGroups: Object.keys(informationalGroups).length,
            totalTestimonials: Object.values(testimonialGroups).reduce((sum, group) => 
                sum + (group.testimonials?.length || 0), 0),
            totalInformationalVideos: Object.values(informationalGroups).reduce((sum, group) => 
                sum + (group.videos?.length || 0), 0),
            totalVideos: Object.keys(videos).length
        },
        
        // Player config
        playerConfig: sourceData.playerConfig || {
            desktop: { width: 854, height: 480, top: "50%", left: "50%", borderRadius: "12px" },
            mobile: { fullscreen: true },
            overlay: { background: "rgba(0, 0, 0, 0.5)" },
            resumeMessage: "I'm sure you can appreciate what our clients have to say..."
        },
        
        // Metadata
        __version: "3.0-dual-system-exported",
        __generated: new Date().toISOString(),
        __exportedFrom: "testimonial-manager",
        __notes: "Exported from manager - NEW groups structure converted to OLD structure"
    };
    
    // Create the file content
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Add helper functions
    const helperFunctions = `

// ===================================================
// 🎯 CONCERN-BASED VIDEO RETRIEVAL
// ===================================================

// Get testimonials for a specific concern
window.testimonialData.getConcernTestimonials = function(concernKey) {
    const results = [];
    
    // Search testimonial groups
    for (const [groupId, group] of Object.entries(this.testimonialGroups || {})) {
        if (group.concerns && group.concerns.includes(concernKey)) {
            if (group.testimonials) {
                results.push(...group.testimonials.map(t => ({
                    ...t,
                    groupId: group.id,
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
    for (const [key, data] of Object.entries(this.concerns || {})) {
        concerns.push({
            key: key,
            title: data.title || key,
            icon: data.icon || '🎬',
            videoType: data.videoType || 'skeptical',
            description: data.description || ''
        });
    }
    return concerns;
};

// Auto-save trigger for manager
window.testimonialData.triggerAutoSave = function() {
    console.log('🔔 Auto-save triggered');
    // This would trigger save in manager if connected
    return true;
};

console.log('✅ Testimonials data loaded from exported file');
console.log('   Testimonial Groups:', window.testimonialData.statistics.totalTestimonialGroups);
console.log('   Informational Groups:', window.testimonialData.statistics.totalInformationalGroups);
console.log('   Total Videos:', window.testimonialData.statistics.totalVideos);`;
    
    // Complete file
    const fullCode = `// ===================================================
// 🎬 DUAL VIDEO SYSTEM DATA - EXPORTED FROM MANAGER
// Generated: ${new Date().toLocaleDateString()}
// Export Time: ${new Date().toLocaleTimeString()}
// ===================================================

window.testimonialData = ${jsonData};${helperFunctions}`;
    
    // Download
    const blob = new Blob([fullCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testimonials-data-exported.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ File exported successfully!');
    console.log(`   Testimonial Groups: ${Object.keys(testimonialGroups).length}`);
    console.log(`   Informational Groups: ${Object.keys(informationalGroups).length}`);
    console.log(`   Total Videos: ${Object.keys(videos).length}`);
    
    // Show success
    showSuccess('✅ JS file exported! Ready to replace testimonials-data.js');
    
    return exportData;
}

// ============================================
// 🧪 TEST THE EXPORT
// ============================================

window.testExportConversion = function() {
    console.log('🧪 Testing export conversion...');
    
    // Create test data in NEW structure
    const testGroupId = 'export-test-' + Date.now();
    
    window.testimonialData = window.testimonialData || {};
    window.testimonialData.groups = window.testimonialData.groups || {};
    window.testimonialData.videos = window.testimonialData.videos || {};
    
    // Add a test group (NEW structure)
    window.testimonialData.groups[testGroupId] = {
        id: testGroupId,
        name: 'Export Test Group',
        type: 'testimonial',
        concerns: ['price_cost', 'time_speed'],
        videos: ['export-vid-1', 'export-vid-2'],
        created: new Date().toISOString()
    };
    
    // Add test videos
    window.testimonialData.videos['export-vid-1'] = {
        id: 'export-vid-1',
        title: 'Export Test Video 1',
        url: 'https://example.com/test1.mp4',
        duration: 120
    };
    
    window.testimonialData.videos['export-vid-2'] = {
        id: 'export-vid-2',
        title: 'Export Test Video 2',
        url: 'https://example.com/test2.mp4',
        duration: 180
    };
    
    console.log('Created test data in NEW structure:');
    console.log(`   Groups: ${Object.keys(window.testimonialData.groups).length}`);
    console.log(`   Videos: ${Object.keys(window.testimonialData.videos).length}`);
    
    // Test the export
    const exportedData = downloadJSFile();
    
    console.log('\nExport result:');
    console.log(`   Testimonial Groups: ${Object.keys(exportedData.testimonialGroups || {}).length}`);
    console.log(`   Informational Groups: ${Object.keys(exportedData.informationalGroups || {}).length}`);
    console.log(`   Total Videos in export: ${Object.keys(exportedData.videos || {}).length}`);
    
    // Check conversion
    const hasTestGroup = exportedData.testimonialGroups[testGroupId] !== undefined;
    console.log(`   Test group converted? ${hasTestGroup ? '✅ YES' : '❌ NO'}`);
    
    if (hasTestGroup) {
        const group = exportedData.testimonialGroups[testGroupId];
        console.log(`   Group has ${group.testimonials?.length || 0} testimonials`);
    }
    
    return exportedData;
};

// ===================================================
// 🛠️ CLEANUP FUNCTIONS (ADD TO YOUR MANAGER)
// ===================================================

function safeCleanupDuplicateGroups() {
    console.log('🛡️ SAFE Cleanup - preserving data');
    
    if (!window.testimonialData) {
        console.log('❌ No testimonialData');
        return;
    }
    
    // 1. Backup current groups from OLD structure before deleting
    const oldGroups = window.testimonialData.groups || {};
    const old_Groups = window.testimonialData._groups || {};
    
    console.log(`📊 Found in old structure: ${Object.keys(oldGroups).length} groups`);
    console.log(`📊 Found in _groups: ${Object.keys(old_Groups).length} groups`);
    
    // 2. Migrate OLD → NEW structure FIRST (preserve data!)
    let migratedCount = 0;
    
    Object.values(oldGroups).forEach(group => {
        if (group.type === 'testimonial') {
            if (!window.testimonialData.testimonialGroups) {
                window.testimonialData.testimonialGroups = {};
            }
            if (!window.testimonialData.testimonialGroups[group.id]) {
                window.testimonialData.testimonialGroups[group.id] = group;
                migratedCount++;
                console.log(`   ✅ Migrated testimonial: "${group.name}"`);
            }
        } else if (group.type === 'informational') {
            if (!window.testimonialData.informationalGroups) {
                window.testimonialData.informationalGroups = {};
            }
            if (!window.testimonialData.informationalGroups[group.id]) {
                window.testimonialData.informationalGroups[group.id] = group;
                migratedCount++;
                console.log(`   ✅ Migrated informational: "${group.name}"`);
            }
        }
    });
    
    // Also check _groups
    Object.values(old_Groups).forEach(group => {
        if (group.type === 'testimonial' && !window.testimonialData.testimonialGroups?.[group.id]) {
            if (!window.testimonialData.testimonialGroups) {
                window.testimonialData.testimonialGroups = {};
            }
            window.testimonialData.testimonialGroups[group.id] = group;
            migratedCount++;
            console.log(`   ✅ Migrated from _groups: "${group.name}"`);
        } else if (group.type === 'informational' && !window.testimonialData.informationalGroups?.[group.id]) {
            if (!window.testimonialData.informationalGroups) {
                window.testimonialData.informationalGroups = {};
            }
            window.testimonialData.informationalGroups[group.id] = group;
            migratedCount++;
            console.log(`   ✅ Migrated from _groups: "${group.name}"`);
        }
    });
    
    console.log(`✅ Total migrated: ${migratedCount} groups to new structure`);
    
    // 3. NOW safely delete old structure (data is safely in new structure)
    if (window.testimonialData.groups && Object.keys(oldGroups).length > 0) {
        console.log('🧹 Removing old "groups" structure (data is safely migrated)');
        delete window.testimonialData.groups;
    }
    
    if (window.testimonialData._groups && Object.keys(old_Groups).length > 0) {
        console.log('🧹 Removing old "_groups" structure');
        delete window.testimonialData._groups;
    }
    
    // 4. Remove empty 'videos' property if it exists
    if (window.testimonialData.videos && Object.keys(window.testimonialData.videos).length === 0) {
        console.log('🧹 Removing empty "videos" property');
        delete window.testimonialData.videos;
    }
    
    // 5. Ensure new structure exists (but don't overwrite!)
    if (!window.testimonialData.testimonialGroups) {
        window.testimonialData.testimonialGroups = {};
        console.log('   Created empty testimonialGroups (no data lost)');
    }
    
    if (!window.testimonialData.informationalGroups) {
        window.testimonialData.informationalGroups = {};
        console.log('   Created empty informationalGroups (no data lost)');
    }
    
    console.log('🛡️ Safe cleanup complete - all data preserved!');
    console.log(`📊 Current counts:`);
    console.log(`   Testimonial Groups: ${Object.keys(window.testimonialData.testimonialGroups).length}`);
    console.log(`   Informational Groups: ${Object.keys(window.testimonialData.informationalGroups).length}`);
    
    // 6. Save and update UI
    if (typeof saveAllData === 'function') {
        saveAllData();
        console.log('💾 Data saved after cleanup');
    }
    
    if (typeof updateStatisticsDisplay === 'function') {
        updateStatisticsDisplay();
    }
    
    if (typeof renderGroups === 'function') {
        setTimeout(() => {
            renderGroups();
            console.log('🎨 UI updated with preserved groups');
        }, 500);
    }
}

function autoSaveChanges() {
    console.log('💾 Auto-saving to localStorage...');
    
    try {
           // 🚨 COMMENT THIS OUT TEMPORARILY:
    // cleanupDuplicateProperties();
        
        // Save to localStorage
        localStorage.setItem('testimonialData', JSON.stringify(window.testimonialData));
        
        console.log('✅ Auto-save complete');
        console.log('   Groups saved:', 
            Object.keys(window.testimonialData.testimonialGroups || {}).length + 
            Object.keys(window.testimonialData.informationalGroups || {}).length);
        
    } catch (error) {
        console.error('❌ Auto-save failed:', error);
    }
}

function testCreateRealGroup() {
    console.log('🎯 Creating a REAL test group...');
    
    // Create test group data
    const testGroup = {
        id: 'test_group_' + Date.now(),
        type: 'testimonial',
        name: 'Console Test Group',
        slug: 'console-test',
        icon: '🧪',
        description: 'Created via console test',
        concerns: ['general', 'results'],
        testimonials: [
            {
                id: 'test_testimonial_' + Date.now(),
                title: 'Test Video Testimonial',
                concernType: 'results',
                videoUrl: 'https://example.com/test-video.mp4',
                author: 'Test User',
                text: 'This is a test testimonial',
                addedAt: new Date().toISOString(),
                views: 0
            }
        ],
        createdAt: new Date().toISOString(),
        viewCount: 0
    };
    
    // Add to testimonialData
    if (!window.testimonialData.testimonialGroups) {
        window.testimonialData.testimonialGroups = {};
    }
    
    window.testimonialData.testimonialGroups[testGroup.id] = testGroup;
    
    console.log('✅ Group created:', testGroup.name);
    console.log('   ID:', testGroup.id);
    console.log('   Type:', testGroup.type);
    console.log('   Testimonials:', testGroup.testimonials.length);
    
    // Update UI
    if (typeof updateGroupsDisplay === 'function') {
        updateGroupsDisplay();
    }
    
    if (typeof updateCodeOutput === 'function') {
        updateCodeOutput();
    }
    
    if (typeof updateStatisticsDisplay === 'function') {
        updateStatisticsDisplay();
    }
    
    // Auto-save
    autoSaveChanges();
    
    // Check results
    console.log('\n📊 After creation:');
    console.log('   Testimonial Groups:', Object.keys(window.testimonialData.testimonialGroups).length);
    console.log('   Informational Groups:', Object.keys(window.testimonialData.informationalGroups || {}).length);
    
    return testGroup.id;
}

// Run cleanup on page load
// setTimeout(cleanupDuplicateProperties, 1000);

// KEEP ALL OTHER FUNCTIONS EXACTLY AS THEY ARE
function loadSampleData() {
    if (confirm('Load sample data? This will replace your current groups.')) {
        initializeSampleGroups();
        updateGroupsDisplay();
        updateCodeOutput();
        showSuccess('✅ Sample data loaded!');
    }
}

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

// NEW: Pre-select concerns when editing a group
function preSelectConcernsForGroup(concernKeys) {
    console.log('📝 Pre-selecting concerns:', concernKeys);
    
    // Uncheck all first
    document.querySelectorAll('.concern-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    // Check the specified ones
    concernKeys.forEach(key => {
        const checkbox = document.getElementById(`concern_${key}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
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

// Add this function to create the new container logic
function updateConcernsContainer(container, filteredConcerns, groupType) {
    console.log(`📦 Updating concerns container for ${groupType} with ${filteredConcerns.length} items`);
    
    container.innerHTML = '';
    
    filteredConcerns.forEach(([key, concern]) => {
        const checkboxId = `concern_${key}_${container.id || 'default'}`;
        
        const label = document.createElement('label');
        label.className = 'concern-checkbox-label';
        label.style.cssText = `
            display: flex;
            align-items: center;
            padding: 10px 14px;
            margin: 6px 0;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid #e9ecef;
        `;
        
        label.innerHTML = `
            <input type="checkbox" 
                   id="${checkboxId}" 
                   name="concerns" 
                   value="${key}"
                   style="margin-right: 12px; transform: scale(1.2);">
            <span style="font-size: 22px; margin-right: 12px; opacity: 0.9;">${concern.icon}</span>
            <div style="flex-grow: 1;">
                <div style="font-weight: 600; color: #1f2937;">${concern.title}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">
                    ${concern.description || 'Select this concern'}
                </div>
            </div>
        `;
        
        // Hover effects
        label.onmouseenter = () => {
            label.style.background = '#e9ecef';
            label.style.transform = 'translateX(6px)';
            label.style.borderColor = '#3b82f6';
            label.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)';
        };
        
        label.onmouseleave = () => {
            label.style.background = '#f8f9fa';
            label.style.transform = 'translateX(0)';
            label.style.borderColor = '#e9ecef';
            label.style.boxShadow = 'none';
        };
        
        container.appendChild(label);
    });
    
    console.log(`✅ Container updated with ${filteredConcerns.length} checkboxes`);
}

function hideAllTestimonialsModal() {
    const modal = document.getElementById('allTestimonialsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize and render on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing testimonial manager...');
    
    // Ensure data structure
    if (!window.testimonialData) {
        window.testimonialData = { groups: [] };
    }
    if (!Array.isArray(window.testimonialData.groups)) {
        if (typeof window.testimonialData.groups === 'object') {
            window.testimonialData.groups = Object.values(window.testimonialData.groups);
        } else {
            window.testimonialData.groups = [];
        }
    }
    
    // Initial render
    if (typeof renderTestimonialGroups === 'function') {
        renderTestimonialGroups();
    }
    
    // Initial dropdown
    if (typeof updateGroupDropdown === 'function') {
        updateGroupDropdown();
    }
    
    // Initial statistics
    if (typeof updateStatistics === 'function') {
        updateStatistics();
    }
    
    console.log(`📊 Initialized with ${window.testimonialData.groups.length} groups`);
});

// ============================================
// 💾 SAVE FUNCTION - ADD THIS TO YOUR EXISTING FILE
// ============================================

function saveTestimonialData() {
    console.log('💾 Saving testimonial manager data...');
    
    try {
        // Get current data - check multiple possible sources
        const data = window.testimonialData || window.tmData || testimonialData;
        
        if (!data) {
            console.error('❌ No testimonialData found anywhere!');
            // Create minimal structure
            window.testimonialData = {
                groups: {},
                videos: {},
                concerns: {},
                statistics: { totalGroups: 0, totalVideos: 0, totalViews: 0 }
            };
            console.log('✅ Created minimal testimonialData structure');
        }
        
        // Use the data we found or created
        const saveData = data || window.testimonialData;
        
        // 🚨 CRITICAL FIX: Ensure groups is OBJECT, not array
        let groups = saveData.groups || {};
        
        if (Array.isArray(groups)) {
            console.warn('⚠️ WARNING: groups is array, converting to object before saving');
            const groupsArray = groups;
            const groupsObject = {};
            
            groupsArray.forEach((group, index) => {
                if (group && group.id) {
                    groupsObject[group.id] = group;
                } else if (group) {
                    // Create an ID if missing
                    const groupId = 'saved-group-' + Date.now() + '-' + index;
                    groupsObject[groupId] = { 
                        ...group, 
                        id: groupId,
                        __converted: true 
                    };
                }
            });
            
            groups = groupsObject;
            console.log(`🔄 Converted ${groupsArray.length} array items to object`);
            
            // Update the original data too
            saveData.groups = groups;
            window.testimonialData.groups = groups;
        }
        // END CRITICAL FIX
        
        const videos = saveData.videos || {};
        const concerns = saveData.concerns || {};
        const statistics = saveData.statistics || { totalGroups: 0, totalVideos: 0, totalViews: 0 };
        
        // Count safely
        const totalGroups = Object.keys(groups).length;
        const totalVideos = Object.keys(videos).length;
        
        // 🚨 ADDED: Ensure proper group types count
        let testimonialGroups = 0;
        let informationalGroups = 0;
        let videosInGroups = 0;
        
        Object.values(groups).forEach(group => {
            if (group.type === 'informational') {
                informationalGroups++;
            } else {
                testimonialGroups++;
            }
            
            if (group.videos && Array.isArray(group.videos)) {
                videosInGroups += group.videos.length;
            }
        });
        
        // Create the data to save
        const dataToSave = {
            // Core data
            groups: groups, // ✅ Now guaranteed to be OBJECT
            videos: videos,
            concerns: concerns,
            statistics: {
                totalGroups: totalGroups,
                testimonialGroups: testimonialGroups,
                informationalGroups: informationalGroups,
                totalVideos: totalVideos,
                videosInGroups: videosInGroups,
                totalViews: statistics.totalViews || 0
            },
            
            // Additional data (preserve if exists)
            videoUrls: saveData.videoUrls || {},
            videoDurations: saveData.videoDurations || {},
            playerConfig: saveData.playerConfig || {},
            
            // Functions from testimonials-data.js (we can't save functions, but mark their existence)
            __hasFunctions: {
                getConcernTestimonials: typeof saveData.getConcernTestimonials === 'function',
                getAvailableConcerns: typeof saveData.getAvailableConcerns === 'function',
                triggerAutoSave: typeof saveData.triggerAutoSave === 'function'
            },
            
            // Metadata
            __version: saveData.__version || "1.0-save-fixed",
            __lastSaved: new Date().toISOString(),
            __saveTest: "comprehensive-test-" + Date.now(),
            __format: 'object' // ✅ Mark as object format to prevent future confusion
        };
        
        // Save to localStorage
        localStorage.setItem('testimonialManagerData', JSON.stringify(dataToSave, null, 2));
        
        // Update in-memory statistics
        if (saveData.statistics) {
            saveData.statistics.totalGroups = totalGroups;
            saveData.statistics.testimonialGroups = testimonialGroups;
            saveData.statistics.informationalGroups = informationalGroups;
            saveData.statistics.totalVideos = totalVideos;
            saveData.statistics.videosInGroups = videosInGroups;
        }
        
        console.log('✅ Data saved successfully!');
        console.log(`   Groups saved: ${totalGroups} (OBJECT format)`);
        console.log(`   Testimonial groups: ${testimonialGroups}`);
        console.log(`   Informational groups: ${informationalGroups}`);
        console.log(`   Videos saved: ${totalVideos}`);
        console.log(`   Videos in groups: ${videosInGroups}`);
        console.log(`   Save size: ${JSON.stringify(dataToSave).length} bytes`);
        
        // Show visual success indicator
        showSaveNotification('✅ Data saved successfully!', 'success');
        
        // Update UI after a short delay
        setTimeout(() => {
            if (typeof updateStatistics === 'function') updateStatistics();
            if (typeof renderTestimonialGroups === 'function') renderTestimonialGroups();
        }, 100);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error saving data:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        // Show error notification
        showSaveNotification(`❌ Save failed: ${error.message}`, 'error');
        
        return false;
    }
}

// Add this function to ensure proper loading
function loadTestimonialData() {
    console.log('📂 Loading testimonial data...');
    
    try {
        const saved = localStorage.getItem('testimonialManagerData');
        if (!saved) {
            console.log('📭 No saved data found');
            return false;
        }
        
        const data = JSON.parse(saved);
        
        // 🚨 CRITICAL: Ensure groups is OBJECT on load
        if (Array.isArray(data.groups)) {
            console.warn('⚠️ Loaded data has array groups, converting to object');
            const groupsArray = data.groups;
            const groupsObject = {};
            
            groupsArray.forEach((group, index) => {
                if (group && group.id) {
                    groupsObject[group.id] = group;
                } else if (group) {
                    const groupId = 'loaded-group-' + index;
                    groupsObject[groupId] = { ...group, id: groupId };
                }
            });
            
            data.groups = groupsObject;
            console.log(`🔄 Converted ${groupsArray.length} array items to object on load`);
        }
        
        // Set to window
        window.testimonialData = data;
        
        console.log(`✅ Loaded ${Object.keys(data.groups || {}).length} groups (OBJECT format)`);
        return true;
        
    } catch(e) {
        console.error('❌ Load failed:', e);
        return false;
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadTestimonialData, 100);
});

// Helper function for notifications
function showSaveNotification(message, type = 'info') {
    // Remove any existing notification
    const existing = document.getElementById('save-notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.id = 'save-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// ============================================
// 🧪 TEST THE FIXED SAVE FUNCTION
// ============================================

window.testSaveFixed = function() {
    console.log('🧪 Testing FIXED save function...');
    
    // Test 1: Basic save with minimal data
    console.log('\n1. Testing with minimal data...');
    window.testimonialData = {
        groups: {},
        videos: {},
        concerns: {},
        statistics: { totalGroups: 0, totalVideos: 0, totalViews: 0 }
    };
    
    let result = saveTestimonialData();
    console.log('Minimal save:', result ? '✅ PASS' : '❌ FAIL');
    
    // Test 2: Save with actual data
    console.log('\n2. Testing with actual data...');
    const testGroupId = 'save-test-' + Date.now();
    window.testimonialData.groups[testGroupId] = {
        id: testGroupId,
        name: 'Save Test Group',
        type: 'testimonial',
        concerns: ['price_cost'],
        videos: ['test-video-1', 'test-video-2'],
        created: new Date().toISOString()
    };
    
    window.testimonialData.videos = {
        'test-video-1': { id: 'test-video-1', title: 'Test 1', url: 'test1.mp4' },
        'test-video-2': { id: 'test-video-2', title: 'Test 2', url: 'test2.mp4' }
    };
    
    result = saveTestimonialData();
    console.log('Actual data save:', result ? '✅ PASS' : '❌ FAIL');
    
    // Test 3: Verify localStorage
    console.log('\n3. Verifying localStorage...');
    const saved = localStorage.getItem('testimonialManagerData');
    if (saved) {
        const data = JSON.parse(saved);
        console.log('✅ Data in localStorage');
        console.log(`   Groups: ${Object.keys(data.groups || {}).length}`);
        console.log(`   Videos: ${Object.keys(data.videos || {}).length}`);
        console.log(`   Has test group: ${!!data.groups[testGroupId]}`);
    } else {
        console.log('❌ No data in localStorage');
    }
    
    // Test 4: Test error handling (try to save undefined)
    console.log('\n4. Testing error handling...');
    const originalData = window.testimonialData;
    window.testimonialData = undefined;
    
    result = saveTestimonialData();
    console.log('Undefined data save handled:', result ? '✅ PASS' : '❌ FAIL (expected)');
    
    // Restore
    window.testimonialData = originalData;
    
    console.log('\n🎉 Save function test complete!');
    return true;
};

// ============================================
// 🚀 RUN THE TEST
// ============================================

console.log('✅ Fixed save function loaded. Run testSaveFixed() to test.');

// ============================================
// 🧪 TEST - Add this too
// ============================================

window.testSaveFunction = function() {
    console.log('🧪 Testing save function...');
    
    // Make sure we have data
    if (!window.testimonialData) {
        console.error('❌ No testimonialData!');
        return false;
    }
    
    // Create a test group
    const testId = 'test-' + Date.now();
    window.testimonialData.groups = window.testimonialData.groups || {};
    window.testimonialData.groups[testId] = {
        id: testId,
        name: 'Test Group ' + new Date().toLocaleTimeString(),
        type: 'testimonial',
        concerns: ['price_cost'],
        videos: [],
        created: new Date().toISOString()
    };
    
    // Save it
    const result = saveTestimonialData();
    
    if (result) {
        console.log('✅ Test passed! Data saved.');
        console.log('Check localStorage: localStorage.getItem("testimonialManagerData")');
    }
    
    return result;
};

// ============================================
// 🧹 CLEANUP FUNCTION - Add this too
// ============================================

function cleanupTestimonialData() {
    console.log('🧹 Cleaning up testimonial data...');
    
    if (!window.testimonialData) return;
    
    // Remove old conflicting structures
    delete window.testimonialData.testimonialGroups;
    delete window.testimonialData.informationalGroups;
    
    console.log('✅ Removed old conflicting structures');
    
    // Make sure we're using the new structure
    window.testimonialData.groups = window.testimonialData.groups || {};
    window.testimonialData.videos = window.testimonialData.videos || {};
    
    console.log(`📊 Current: ${Object.keys(window.testimonialData.groups).length} groups`);
}

// Run cleanup on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(cleanupTestimonialData, 1000);
});

// ============================================
// 🚨 SINGLE UNIFIED INITIALIZATION
// REPLACE ALL OTHER DOMContentLoaded LISTENERS
// ============================================

// Remove ALL existing DOMContentLoaded listeners
function cleanupDuplicateListeners() {
    console.log('🧹 Cleaning up duplicate event listeners...');
    
    // Create a clean document clone
    const cleanDoc = document.cloneNode(true);
    
    // Replace all event listeners with our single one
    document.removeEventListener('DOMContentLoaded', arguments.callee);
    
    // Remove inline onload attributes
    document.body.removeAttribute('onload');
    window.onload = null;
    
    console.log('✅ Cleaned up duplicate listeners');
}

// SINGLE MAIN INITIALIZATION FUNCTION
function initializeTestimonialManager() {
    console.log('🚀 SINGLE UNIFIED INITIALIZATION STARTING');
    
    // PHASE 1: Load Data (FIRST)
    console.log('\n📦 PHASE 1: Loading data...');
    
    try {
        const saved = localStorage.getItem('testimonialManagerData');
        if (saved) {
            const data = JSON.parse(saved);
            
            // Ensure testimonialData exists
            if (!window.testimonialData) {
                window.testimonialData = {};
            }
            
            // Load groups (preserve any existing)
            window.testimonialData.groups = {
                ...window.testimonialData.groups,
                ...(data.groups || {})
            };
            
            // Load other data
            window.testimonialData.videos = data.videos || window.testimonialData.videos || {};
            window.testimonialData.concerns = data.concerns || window.testimonialData.concerns || {};
            window.testimonialData.statistics = data.statistics || window.testimonialData.statistics || {};
            window.testimonialData.playerConfig = data.playerConfig || window.testimonialData.playerConfig || {};
            
            console.log(`✅ Loaded ${Object.keys(data.groups || {}).length} groups from storage`);
        } else {
            console.log('📭 No saved data found, starting fresh');
            
            // Initialize empty structure
            if (!window.testimonialData) window.testimonialData = {};
            if (!window.testimonialData.groups) window.testimonialData.groups = {};
            if (!window.testimonialData.videos) window.testimonialData.videos = {};
            if (!window.testimonialData.concerns) window.testimonialData.concerns = {};
        }
    } catch(e) {
        console.log('⚠️ Data load error:', e);
    }
    
    // PHASE 2: Initialize UI Components (SECOND)
    console.log('\n🎨 PHASE 2: Initializing UI...');
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        // Initialize modal triggers
        if (typeof populateConcernsCheckboxes === 'function') {
            populateConcernsCheckboxes('testimonial');
        }
        
        // Update dropdown
        if (window.updateGroupDropdown) {
            updateGroupDropdown();
        }
        
        // Update statistics
        if (window.updateStatistics) {
            updateStatistics();
        }
        
        console.log('✅ UI initialized');
        
        // PHASE 3: Render Groups (THIRD)
        console.log('\n🎯 PHASE 3: Rendering groups...');
        
        // Use the BEST available render function
        const renderFunctions = [
            'renderTestimonialGroups',
            'fixBrokenGroupButtons',
            'renderTestimonialGroupsSidebar',
            'renderGroups'
        ];
        
        let rendered = false;
        
        for (let funcName of renderFunctions) {
            if (window[funcName] && typeof window[funcName] === 'function') {
                console.log(`🔄 Calling ${funcName}...`);
                try {
                    const result = window[funcName]();
                    if (result) {
                        console.log(`✅ ${funcName} rendered successfully`);
                        rendered = true;
                        break;
                    }
                } catch(e) {
                    console.log(`❌ ${funcName} failed:`, e.message);
                }
            }
        }
        
        // If nothing worked, render directly
        if (!rendered) {
            console.log('🛠️ Falling back to direct render...');
            renderGroupsDirectly();
        }
        
        console.log('✅ INITIALIZATION COMPLETE');
        
        // PHASE 4: Set up monitoring (LAST)
        console.log('\n👁️ PHASE 4: Setting up monitoring...');
        setupRenderMonitoring();
        
    }, 300); // Short delay to ensure DOM is ready
}

// Direct render function (fallback)
function renderGroupsDirectly() {
    const container = document.getElementById('testimonialGroupsContainer');
    if (!container) {
        console.log('❌ Container not found');
        return false;
    }
    
    if (!window.testimonialData || !window.testimonialData.groups) {
        console.log('📭 No groups data');
        return false;
    }
    
    const groups = Object.values(window.testimonialData.groups);
    if (groups.length === 0) {
        console.log('📭 No groups to render');
        // Show empty state
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📂</div>
                <div class="empty-title">No groups yet</div>
                <div class="empty-subtitle">Create your first testimonial group</div>
            </div>
        `;
        return true;
    }
    
    console.log(`🎨 Direct rendering ${groups.length} groups`);
    
    // Clear container
    container.innerHTML = '';
    
    // Render each group
    groups.forEach(group => {
        const button = document.createElement('div');
        button.className = 'group-button unified-render';
        button.dataset.groupId = group.id;
        
        const icon = group.type === 'informational' ? '📚' : '🎬';
        const videoCount = group.videos ? group.videos.length : 0;
        
        button.innerHTML = `
            <div class="group-button-inner">
                <span class="group-icon">${icon}</span>
                <div class="group-info">
                    <div class="group-name">${group.name}</div>
                    <div class="group-meta">
                        <span class="video-count">${videoCount} video${videoCount !== 1 ? 's' : ''}</span>
                        <span class="group-type">${group.type}</span>
                    </div>
                </div>
                <span class="group-arrow">→</span>
            </div>
        `;
        
        // Add CSS class for styling (will be styled by CSS)
        button.classList.add('unified-button');
        
        // Click handler
        button.onclick = () => {
            console.log(`🎯 Group selected: ${group.id}`);
            if (window.selectGroup) {
                window.selectGroup(group.id);
            }
        };
        
        container.appendChild(button);
    });
    
    console.log(`✅ Direct rendered ${groups.length} groups`);
    return true;
}

// Monitor and fix rendering
function setupRenderMonitoring() {
    console.log('👁️ Setting up render monitoring...');
    
    // Check every 5 seconds if rendering is broken
    setInterval(() => {
        const container = document.getElementById('testimonialGroupsContainer');
        if (!container) return;
        
        const hasGroups = window.testimonialData && 
                         window.testimonialData.groups && 
                         Object.keys(window.testimonialData.groups).length > 0;
        
        const hasButtons = container.querySelectorAll('.group-button').length > 0;
        const hasEmptyState = container.querySelector('.empty-state');
        
        // If we have groups but no buttons (or empty state is showing)
        if (hasGroups && (!hasButtons || hasEmptyState)) {
            console.log('🔄 Monitor: Rendering broken, fixing...');
            renderGroupsDirectly();
        }
    }, 5000);
}

// Add CSS for unified buttons
function addUnifiedButtonCSS() {
    if (!document.querySelector('#unified-button-styles')) {
        const style = document.createElement('style');
        style.id = 'unified-button-styles';
        style.textContent = `
            .group-button.unified-render {
                display: flex !important;
                align-items: center !important;
                padding: 14px 16px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                border: 2px solid white !important;
                border-radius: 12px !important;
                cursor: pointer !important;
                margin-bottom: 12px !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.25) !important;
                transition: all 0.3s ease !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                width: 100% !important;
            }
            
            .group-button.unified-render:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.35);
            }
            
            .group-button-inner {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
            }
            
            .group-icon {
                font-size: 22px;
                width: 30px;
                text-align: center;
                background: rgba(255,255,255,0.2);
                border-radius: 8px;
                padding: 5px;
            }
            
            .group-info {
                flex: 1;
                min-width: 0;
            }
            
            .group-name {
                font-weight: 700;
                font-size: 15px;
                margin-bottom: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .group-meta {
                font-size: 12px;
                color: rgba(255,255,255,0.9);
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .video-count, .group-type {
                background: rgba(255,255,255,0.2);
                padding: 2px 8px;
                border-radius: 10px;
            }
            
            .group-arrow {
                font-size: 18px;
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Added unified button CSS');
    }
}

// SINGLE EVENT LISTENER - REPLACES ALL OTHERS
document.addEventListener('DOMContentLoaded', function unifiedInitialization() {
    console.log('🎯 SINGLE DOMContentLoaded LISTENER FIRED');
    
    // Clean up any duplicates
    cleanupDuplicateListeners();
    
    // Add CSS
    addUnifiedButtonCSS();
    
    // Run unified initialization
    initializeTestimonialManager();
    
    // Remove this listener after it runs
    document.removeEventListener('DOMContentLoaded', unifiedInitialization);
});

// Also run if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('📄 Waiting for DOM to load...');
} else {
    console.log('⚡ DOM already loaded, running initialization now...');
    setTimeout(() => {
        cleanupDuplicateListeners();
        addUnifiedButtonCSS();
        initializeTestimonialManager();
    }, 100);
}

console.log('✅ UNIFIED INITIALIZATION SYSTEM LOADED');

// ===================================================
// EXPORT FUNCTIONS TO WINDOW OBJECT
// ===================================================
window.showTestimonialOverlay = showTestimonialOverlay;
window.hideTestimonialOverlay = hideTestimonialOverlay; // ADD THIS LINE
window.updateGroupDropdown = updateGroupDropdown; // ADD THIS LINE
window.selectGroup = selectGroup;
window.showAddTestimonialGroupModal = showAddTestimonialGroupModal;
window.hideAddTestimonialGroupModal = hideAddTestimonialGroupModal;
window.createTestimonialGroup = createTestimonialGroup;
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