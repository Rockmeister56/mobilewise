// ===================================================
// TESTIMONIAL MANAGER JS - CLEAN START
// ===================================================

// Global variables
let currentSelectedGroupId = null;
let testimonialData = window.testimonialData || {};

// ===================================================
// INITIALIZATION - NO SAMPLE GROUPS
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Testimonial Manager Initializing...');
    
    // Initialize EMPTY data structure
    initializeTestimonialData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load and display data
    loadAndDisplayData();
    
    // Update code output
    updateCodeOutput();
    
    console.log('✅ Testimonial Manager Ready - No sample groups');
});

// ===================================================
// DATA INITIALIZATION - EMPTY
// ===================================================
function initializeTestimonialData() {
    // Ensure testimonialData has the right structure
    if (!testimonialData.testimonialGroups) {
        testimonialData.testimonialGroups = {}; // EMPTY
    }
    
    if (!testimonialData.statistics) {
        testimonialData.statistics = {
            totalGroups: 0,
            totalVideos: 0,
            totalViews: 0
        };
    }
    
    // Ensure concerns exist (for the form dropdown)
    if (!testimonialData.concerns) {
        testimonialData.concerns = {
            price: { title: 'Price Concerns', icon: '💰', videoType: 'skeptical' },
            time: { title: 'Time/Speed', icon: '⏰', videoType: 'speed' },
            trust: { title: 'Trust/Reliability', icon: '🤝', videoType: 'skeptical' },
            results: { title: 'Results/Effectiveness', icon: '📈', videoType: 'convinced' },
            general: { title: 'General Feedback', icon: '⭐', videoType: 'skeptical' }
        };
    }
    
    // Load from localStorage if available
    const savedData = localStorage.getItem('testimonialManagerData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            testimonialData.testimonialGroups = parsedData.testimonialGroups || {};
            testimonialData.statistics = parsedData.statistics || testimonialData.statistics;
            console.log('📂 Loaded data from localStorage');
        } catch (e) {
            console.error('❌ Error loading from localStorage:', e);
        }
    }
    
    // NO SAMPLE GROUPS - Start fresh
}

// ===================================================
// FIXED: GROUP CREATION WITH DROPDOWN UPDATE
// ===================================================
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

// ===================================================
// NEW: UPDATE GROUP DROPDOWN FUNCTION
// ===================================================
function updateGroupDropdown() {
    const dropdown = document.getElementById('selectGroupDropdown');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">-- Select a Group to Add Testimonials --</option>';
    
    if (!testimonialData.testimonialGroups || Object.keys(testimonialData.testimonialGroups).length === 0) {
        dropdown.innerHTML = '<option value="">No groups yet - Create one first</option>';
        return;
    }
    
    // Add all groups to dropdown
    for (const [groupId, group] of Object.entries(testimonialData.testimonialGroups)) {
        const option = document.createElement('option');
        option.value = groupId;
        option.textContent = `${group.icon || '📁'} ${group.name}`;
        
        // Select if this is the current group
        if (groupId === currentSelectedGroupId) {
            option.selected = true;
        }
        
        dropdown.appendChild(option);
    }
}

// ===================================================
// UPDATED: SELECT GROUP FUNCTION
// ===================================================
function selectGroup(groupId) {
    if (!testimonialData.testimonialGroups[groupId]) {
        showError('Group not found');
        return;
    }
    
    currentSelectedGroupId = groupId;
    const group = testimonialData.testimonialGroups[groupId];
    
    // Update ALL UI components
    updateGroupsDisplay();
    updateCurrentGroupDisplay(group);
    updateGroupDropdown(); // Update dropdown selection
    
    console.log('Selected group:', group.name);
    showSuccess(`📂 Selected: ${group.name}`);
}

// ===================================================
// UPDATED: ADD TESTIMONIAL FUNCTIONS
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

// ===================================================
// UPDATED: LOAD AND DISPLAY DATA
// ===================================================
function loadAndDisplayData() {
    updateGroupsDisplay();
    updateGroupDropdown(); // ADD THIS LINE
    updateStatisticsDisplay();
}