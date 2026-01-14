// ===================================================
// TESTIMONIAL MANAGER JS - GROUPS SYSTEM
// ===================================================

// Global variables
let currentSelectedGroupId = null;
let testimonialData = window.testimonialData || {};

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
// DATA INITIALIZATION
// ===================================================
// ===================================================
// DATA INITIALIZATION (ENHANCED)
// ===================================================
function initializeTestimonialData() {
    console.log('🚀 Initializing enhanced testimonial data...');
    
    // Use ENHANCED_CONCERNS if available, otherwise fallback
    if (window.ENHANCED_CONCERNS) {
        testimonialData.concerns = ENHANCED_CONCERNS;
        console.log('✅ Using ENHANCED_CONCERNS data');
    } else {
        // Fallback to basic concerns
        testimonialData.concerns = {
            price_expensive: { title: 'Expensive', icon: '💰', videoType: 'skeptical', type: 'testimonial' },
            price_cost: { title: 'Cost/Price', icon: '💰', videoType: 'skeptical', type: 'testimonial' },
            time_busy: { title: 'Too Busy', icon: '⏰', videoType: 'speed', type: 'testimonial' },
            // ... add other enhanced concerns
        };
        console.log('⚠️ Using fallback concerns (ENHANCED_CONCERNS not found)');
    }
    
    // Ensure unified groups structure (not separate testimonialGroups/informationalGroups)
    if (!testimonialData.groups) {
        testimonialData.groups = {}; // UNIFIED GROUPS
    }
    
    if (!testimonialData.videos) {
        testimonialData.videos = {}; // UNIFIED VIDEOS
    }
    
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
    }
    
    // Load from localStorage if available
    const savedData = localStorage.getItem('testimonialManagerData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            
            // Handle migration from old structure to new
            if (parsedData.testimonialGroups || parsedData.informationalGroups) {
                console.log('🔄 Migrating from old structure to unified groups...');
                testimonialData.groups = migrateToUnifiedGroups(parsedData);
            } else if (parsedData.groups) {
                testimonialData.groups = parsedData.groups;
            }
            
            if (parsedData.videos) {
                testimonialData.videos = parsedData.videos;
            }
            
            if (parsedData.statistics) {
                testimonialData.statistics = parsedData.statistics;
            }
            
            console.log('📂 Loaded enhanced data from localStorage');
        } catch (e) {
            console.error('❌ Error loading from localStorage:', e);
        }
    }
    
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
    
    const group = window.testimonialData.testimonialGroups[groupId];
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

// ===================================================
// 🎯 ENHANCED GROUP CREATION FUNCTION
// Combines your existing logic with enhanced concerns system
// ===================================================
function addNewTestimonialGroup() {
    console.log('🎯 Creating ENHANCED testimonial group...');
    
    // 1. GET FORM VALUES (keep your existing IDs)
    const groupName = document.getElementById('newGroupName').value.trim();
    const groupSlug = document.getElementById('newGroupSlug').value.trim();
    const videoType = document.getElementById('newGroupType').value; // 'testimonial' or 'informational'
    const groupIcon = document.getElementById('newGroupIcon').value;
    const groupDescription = document.getElementById('newGroupDescription').value.trim();
    
    // 2. VALIDATION (keep your existing)
    if (!groupName) {
        showNotification('❌ Please enter a group name', 'error');
        return;
    }
    
    if (!groupSlug) {
        showNotification('❌ Please enter a group slug/ID', 'error');
        return;
    }
    
    if (!['testimonial', 'informational'].includes(videoType)) {
        showNotification('❌ Please select a valid video type', 'error');
        return;
    }
    
    // 3. 🆕 ENHANCED: Get selected concerns using new system
    const selectedConcerns = [];
    
    // Determine which section is active
    const activeSectionId = videoType === 'testimonial' ? 'testimonialTriggers' : 'informationalTriggers';
    const activeSection = document.getElementById(activeSectionId);
    
    if (activeSection) {
        // Get checked checkboxes from active section
        const activeCheckboxes = activeSection.querySelectorAll('.concern-checkbox:checked');
        
        activeCheckboxes.forEach(checkbox => {
            selectedConcerns.push(checkbox.value);
        });
        
        console.log(`🔍 Selected ${selectedConcerns.length} concerns from ${activeSectionId}`);
    } else {
        // Fallback: Use all checkboxes
        const allCheckboxes = document.querySelectorAll('.concern-checkbox:checked');
        allCheckboxes.forEach(checkbox => {
            selectedConcerns.push(checkbox.value);
        });
        console.log('⚠️ Using fallback concern selection');
    }
    
    if (selectedConcerns.length === 0) {
        showNotification('❌ Please select at least one trigger phrase', 'error');
        return;
    }
    
    // 4. CREATE GROUP OBJECT (enhanced structure)
    const newGroup = {
        id: groupSlug,
        name: groupName, // 🆕 Changed from 'title' to 'name' for consistency
        slug: groupSlug,
        type: videoType,
        icon: groupIcon || (videoType === 'informational' ? '📚' : '⭐'),
        description: groupDescription,
        primaryConcern: selectedConcerns[0], // 🆕 First selected is primary
        concerns: selectedConcerns, // 🆕 Uses enhanced keys (price_expensive, time_busy, etc.)
        videoIds: [], // 🆕 Will hold video IDs added to this group
        createdAt: new Date().toISOString(),
        viewCount: 0,
        lastUpdated: new Date().toISOString() // 🆕 Track updates
    };
    
    console.log('📝 New group created:', newGroup);
    
    // 5. 🆕 ENHANCED: Save to UNIFIED groups structure
    // Ensure unified structure exists
    if (!window.testimonialData.groups) {
        window.testimonialData.groups = {};
        
        // 🆕 Migrate existing data if present
        if (window.testimonialData.testimonialGroups || window.testimonialData.informationalGroups) {
            console.log('🔄 Migrating to unified groups structure...');
            
            // Migrate testimonial groups
            if (window.testimonialData.testimonialGroups) {
                Object.entries(window.testimonialData.testimonialGroups).forEach(([id, group]) => {
                    window.testimonialData.groups[id] = {
                        ...group,
                        type: group.type || 'testimonial',
                        videoIds: group.videoIds || []
                    };
                });
            }
            
            // Migrate informational groups  
            if (window.testimonialData.informationalGroups) {
                Object.entries(window.testimonialData.informationalGroups).forEach(([id, group]) => {
                    window.testimonialData.groups[id] = {
                        ...group,
                        type: group.type || 'informational',
                        videoIds: group.videoIds || []
                    };
                });
            }
        }
    }
    
    // Check if group already exists
    if (window.testimonialData.groups[groupSlug]) {
        showNotification('❌ Group with this ID already exists', 'error');
        return;
    }
    
    // Save to unified groups
    window.testimonialData.groups[groupSlug] = newGroup;
    
    // 6. 🆕 ENHANCED: Update statistics for unified system
    if (!window.testimonialData.statistics) {
        window.testimonialData.statistics = {
            totalGroups: 0,
            totalTestimonialGroups: 0,
            totalInformationalGroups: 0,
            totalVideos: 0,
            totalTestimonials: 0,
            totalInformationalVideos: 0,
            totalViews: 0
        };
    }
    
    // Update counts
    window.testimonialData.statistics.totalGroups = Object.keys(window.testimonialData.groups).length;
    
    if (videoType === 'testimonial') {
        window.testimonialData.statistics.totalTestimonialGroups++;
    } else {
        window.testimonialData.statistics.totalInformationalGroups++;
    }
    
    console.log(`📊 Statistics updated: ${window.testimonialData.statistics.totalGroups} total groups`);
    
    // 7. Save data (keep your existing logic)
    if (window.saveTestimonialData) {
        window.saveTestimonialData();
        console.log('💾 Saved testimonial data');
    } else if (window.saveAllData) {
        window.saveAllData();
        console.log('💾 Saved all data');
    }
    
    // 8. Clear form
    document.getElementById('newGroupName').value = '';
    document.getElementById('newGroupSlug').value = '';
    document.getElementById('newGroupDescription').value = '';
    
    // 🆕 Clear concern checkboxes
    document.querySelectorAll('.concern-checkbox:checked').forEach(cb => {
        cb.checked = false;
    });
    
    // 9. Update UI (keep your existing with enhancements)
    console.log('🔄 Updating UI...');
    
    // Try your existing render functions in order
    if (typeof renderGroups === 'function') {
        renderGroups();
        console.log('✅ Called renderGroups()');
    } else if (typeof refreshGroupUI === 'function') {
        refreshGroupUI();
        console.log('✅ Called refreshGroupUI()');
    } else if (typeof updateGroupRendering === 'function') {
        updateGroupRendering();
        console.log('✅ Called updateGroupRendering()');
    } else {
        console.log('⚠️ No standard render function found');
        
        // Manual UI update
        setTimeout(() => {
            if (window.addTypeBadgesToGroups) {
                window.addTypeBadgesToGroups();
            }
            
            if (window.updateGroupDropdown) {
                window.updateGroupDropdown();
            }
            
            // 🆕 Enhanced: Update group dropdown with new group
            const groupSelect = document.getElementById('groupSelect');
            if (groupSelect) {
                // Add option if not exists
                if (!Array.from(groupSelect.options).some(opt => opt.value === groupSlug)) {
                    const option = document.createElement('option');
                    option.value = groupSlug;
                    option.textContent = `${groupIcon} ${groupName} (${videoType})`;
                    groupSelect.appendChild(option);
                }
                
                // Select the new group
                groupSelect.value = groupSlug;
            }
            
            console.log('✅ Manually updated UI');
        }, 500);
    }
    
    // 10. Close modal and show success
    hideAddTestimonialGroupModal();
    showNotification(`✅ ${videoType === 'testimonial' ? 'Testimonial' : 'Informational'} group "${groupName}" created!`);
    
    // 11. 🆕 ENHANCED: Auto-select this group in video manager dropdown
    setTimeout(() => {
        const groupSelect = document.getElementById('groupSelect');
        if (groupSelect) {
            groupSelect.value = groupSlug;
            
            // Update selected group info display
            const selectedGroupInfo = document.getElementById('selectedGroupInfo');
            if (selectedGroupInfo) {
                selectedGroupInfo.innerHTML = `
                    Adding to: <strong>${groupName}</strong> 
                    <span class="video-type-indicator video-type-${videoType}">
                        ${videoType === 'informational' ? '📚 Informational' : '🎬 Testimonial'}
                    </span>
                `;
            }
            
            console.log(`✅ Auto-selected group: ${groupSlug}`);
        }
        
        // 🆕 Trigger concern checkboxes update
        if (window.updateConcernCheckboxesForGroupType) {
            updateConcernCheckboxesForGroupType(videoType);
        }
    }, 300);
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
    
    // 3. Get groups - ONLY from testimonialGroups
    const groups = window.testimonialData?.testimonialGroups;
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
        videoCount: group.testimonials?.length || 0
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
    console.log('🔄 Updating group dropdown with ALL groups...');
    
    const dropdown = document.getElementById('selectGroupDropdown');
    if (!dropdown) return;
    
    const currentValue = dropdown.value;
    
    // Clear except first option
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    const allGroups = [];
    
    // Add testimonial groups
    if (window.testimonialData?.testimonialGroups) {
        Object.entries(window.testimonialData.testimonialGroups).forEach(([id, group]) => {
            allGroups.push({
                id: id,
                title: group.title || id,
                type: group.type || 'testimonial'
            });
        });
    }
    
    // Add informational groups
    if (window.testimonialData?.informationalGroups) {
        Object.entries(window.testimonialData.informationalGroups).forEach(([id, group]) => {
            allGroups.push({
                id: id,
                title: group.title || id,
                type: group.type || 'informational'
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

// CORRECTED renderGroups() - Shows BOTH types in sidebar
function renderGroups() {
    console.log('🎨 Rendering ALL groups to sidebar...');
    
    const sidebar = document.getElementById('testimonialGroupsContainer');
    if (!sidebar) {
        console.error('❌ Sidebar container not found!');
        return;
    }
    
    // Clear existing group buttons
    const existingGroups = sidebar.querySelectorAll('.testimonial-group-btn');
    existingGroups.forEach(group => group.remove());
    
    // Get ALL groups from both collections
    const allGroups = [];
    
    // 1. Get testimonial groups
    if (window.testimonialData?.testimonialGroups) {
        Object.entries(window.testimonialData.testimonialGroups).forEach(([id, group]) => {
            allGroups.push({
                id: id,
                title: group.title || id,
                icon: group.icon || '📁',
                type: 'testimonial',
                description: group.description || '',
                videoCount: group.testimonials?.length || 0
            });
        });
    }
    
    // 2. Get informational groups
    if (window.testimonialData?.informationalGroups) {
        Object.entries(window.testimonialData.informationalGroups).forEach(([id, group]) => {
            allGroups.push({
                id: id,
                title: group.title || id,
                icon: group.icon || '📁',
                type: 'informational',
                description: group.description || '',
                videoCount: group.videos?.length || 0
            });
        });
    }
    
    console.log(`📊 Total groups to render: ${allGroups.length}`);
    
    if (allGroups.length === 0) {
        const noGroupsMessage = document.getElementById('noGroupsMessage');
        if (noGroupsMessage) noGroupsMessage.style.display = 'block';
        return;
    }
    
    // Hide empty state message
    const noGroupsMessage = document.getElementById('noGroupsMessage');
    if (noGroupsMessage) noGroupsMessage.style.display = 'none';
    
    // Sort alphabetically
    allGroups.sort((a, b) => a.title.localeCompare(b.title));
    
    // Render each group
    allGroups.forEach(group => {
        const button = document.createElement('button');
        button.className = 'testimonial-group-btn';
        button.setAttribute('onclick', `selectGroup('${group.id}')`);
        button.setAttribute('title', group.description || group.title);
        
        // Create badge HTML
        const badgeIcon = group.type === 'informational' ? '📚' : '🎬';
        const badgeClass = group.type === 'informational' ? 'informational' : 'testimonial';
        const badgeTitle = group.type === 'informational' ? 'Informational Videos' : 'Testimonial Videos';
        
        button.innerHTML = `
            <span class="group-icon">${group.icon}</span>
            <span class="group-title">
                ${group.title}
                <span class="type-badge ${badgeClass}" style="margin-left: 25px;">
                    ${badgeIcon}
                </span>
            </span>
            <span class="group-count">${group.videoCount}</span>
        `;
        
        sidebar.appendChild(button);
    });
    
    console.log(`✅ Rendered ${allGroups.length} groups in sidebar`);
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
        
        localStorage.setItem('testimonialManagerData', JSON.stringify(dataToSave));
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
    
    codeOutput.textContent = `// ===================================================\n` +
                             `// 🎬 TESTIMONIALS DATA - GENERATED\n` +
                             `// Generated: ${new Date().toLocaleString()}\n` +
                             `// Total Groups: ${formattedData.statistics?.totalGroups || 0}\n` +
                             `// Total Videos: ${formattedData.statistics?.totalVideos || 0}\n` +
                             `// ===================================================\n\n` +
                             `window.testimonialData = ${jsonString};\n\n` +
                             `console.log('✅ Testimonials Data Loaded:', \n` +
                             `  Object.keys(window.testimonialData.testimonialGroups).length, 'groups');\n` +
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

function hideAllTestimonialsModal() {
    const modal = document.getElementById('allTestimonialsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Export to window
window.hideAllTestimonialsModal = hideAllTestimonialsModal;

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