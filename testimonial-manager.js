// ===================================================
// TESTIMONIAL MANAGER JS - GROUPS SYSTEM
// ===================================================

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

// NEW: Auto-update checkboxes based on group type
function updateConcernCheckboxesForGroupType(groupType) {
    console.log('🔄 Updating concern checkboxes for:', groupType);
    
    const testimonialSection = document.getElementById('testimonialTriggers');
    const informationalSection = document.getElementById('informationalTriggers');
    
    if (!testimonialSection || !informationalSection) return;
    
    if (groupType === 'informational') {
        testimonialSection.style.display = 'none';
        informationalSection.style.display = 'block';
    } else {
        testimonialSection.style.display = 'block';
        informationalSection.style.display = 'none';
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

function updateGroupType(value) {
    console.log('🎯 updateGroupType called with:', value);
    
    const newGroupIcon = document.getElementById('newGroupIcon');
    const testimonialTriggers = document.getElementById('testimonialTriggers');
    const informationalTriggers = document.getElementById('informationalTriggers');
    
    if (!newGroupIcon || !testimonialTriggers || !informationalTriggers) {
        console.error('❌ Required elements not found');
        return;
    }
    
    // Set icon based on type - FIXED LOGIC!
    if (value === '3' || value === 'informational') {
        console.log('🔄 Switching to INFORMATIONAL');
        newGroupIcon.value = '📚';
        testimonialTriggers.style.display = 'none';   // HIDE testimonial
        informationalTriggers.style.display = 'block'; // SHOW informational
    } else {
        console.log('🔄 Switching to TESTIMONIAL');
        newGroupIcon.value = '🎬';
        testimonialTriggers.style.display = 'block';  // SHOW testimonial
        informationalTriggers.style.display = 'none';  // HIDE informational
    }
    
    // Debug: Verify
    console.log('Testimonial display:', testimonialTriggers.style.display);
    console.log('Informational display:', informationalTriggers.style.display);
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
        populateTriggersSections();
        
        // Set up dropdown listener
        const typeSelect = document.getElementById('newGroupType');
        if (typeSelect) {
            typeSelect.addEventListener('change', function() {
                updateGroupType(this.value);
            });
        }
    }, 500);
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
    
    // Group Type Selector Change
    const groupTypeSelect = document.getElementById('group-type-selector');
    if (groupTypeSelect) {
        groupTypeSelect.addEventListener('change', function() {
            console.log('🔄 Group type changed to:', this.value);
            if (typeof updateConcernCheckboxesForGroupType === 'function') {
                updateConcernCheckboxesForGroupType(this.value);
            }
            
            // Auto-update icon based on type
            const iconInput = document.getElementById('group-icon-input');
            if (iconInput) {
                iconInput.value = this.value === 'informational' ? '📚' : '⭐';
            }
        });
        console.log('✅ Added listener for group-type-selector');
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
    
    // Reset inputs
    const inputs = [
        'group-name-input',
        'group-slug-input',
        'group-icon-input',
        'group-description-input'
    ];
    
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
    
    // Reset selectors to defaults
    const typeSelect = document.getElementById('group-type-selector');
    if (typeSelect) typeSelect.value = 'testimonial';
    
    const concernSelect = document.getElementById('group-concern-selector');
    if (concernSelect) concernSelect.value = 'general_info';
    
    // Uncheck all concern checkboxes
    document.querySelectorAll('.concern-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    // Update checkbox display
    updateConcernCheckboxesForGroupType('testimonial');
    
    // Set default icon
    const iconInput = document.getElementById('group-icon-input');
    if (iconInput) iconInput.value = '⭐';
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
    
    const concerns = {
        'price': '💰 See What Others Say About Value',
        'time': '⏰ Hear From Busy Professionals',
        'trust': '🤝 Real Client Experiences',
        'general': '⭐ What Our Clients Say',
        'results': '📈 See The Results Others Got'
    };
    
    container.innerHTML = '';
    
    for (const [key, label] of Object.entries(concerns)) {
        const checkboxId = `concern_${key}`;
        const html = `
            <div class="concern-checkbox-item">
                <input type="checkbox" 
                       id="${checkboxId}" 
                       class="concern-checkbox" 
                       value="${key}">
                <label for="${checkboxId}" class="concern-checkbox-label">
                    ${label}
                </label>
            </div>
        `;
        container.innerHTML += html;
    }
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