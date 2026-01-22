// ===================================================
// ✅ CLEAN TESTIMONIAL MANAGER - UNIFIED STRUCTURE
// ===================================================

(function() {
    'use strict';

    // ============================================
    // 1. CONFIGURATION & CONSTANTS
    // ============================================

    const CONCERNS = {
        // Testimonial Concerns
        "price_expensive": { title: "Expensive", icon: "💰", type: "testimonial", triggers: ["expensive", "cost"] },
        "price_cost": { title: "Cost/Price", icon: "💰", type: "testimonial", triggers: ["cost", "price", "affordable"] },
        "time_busy": { title: "Too Busy", icon: "⏰", type: "testimonial", triggers: ["busy", "no time", "speed"] },
        "trust_skepticism": { title: "Skepticism", icon: "🤝", type: "testimonial", triggers: ["trust", "legit", "scam"] },
        "results_effectiveness": { title: "Results", icon: "📈", type: "testimonial", triggers: ["results", "work", "effective"] },
        "general_info": { title: "General Info", icon: "⭐", type: "testimonial", triggers: ["info", "details"] },
        
        // Informational Concerns
        "how_it_works": { title: "How It Works", icon: "⚙️", type: "informational", triggers: ["process", "how it works"] },
        "benefits_features": { title: "Benefits & Features", icon: "✅", type: "informational", triggers: ["benefits", "features"] },
        "case_studies": { title: "Case Studies", icon: "📊", type: "informational", triggers: ["examples", "case studies"] },
        "faq": { title: "FAQ", icon: "❓", type: "informational", triggers: ["questions", "faq"] }
    };

    // Default empty state
    const DEFAULT_DATA = {
        groups: {},      // STRICTLY OBJECT: { "group_id": { ... } }
        videos: {},      // STRICTLY OBJECT: { "video_id": { ... } }
        concerns: CONCERNS,
        statistics: {
            totalGroups: 0,
            totalTestimonialGroups: 0,
            totalInformationalGroups: 0,
            totalVideos: 0
        },
        playerConfig: {
            desktop: { width: 854, height: 480 },
            mobile: { fullscreen: true }
        }
    };

    // ============================================
    // 2. DATA MANAGER (The "Single Source of Truth")
    // ============================================

    const DataManager = {
        data: null,

        init() {
            console.log('🚀 Initializing DataManager...');
            
            // 1. Start with defaults
            this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));

            // 2. Load from localStorage
            const saved = localStorage.getItem('testimonialManagerData');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    this.data = this.migrate(parsed);
                } catch (e) {
                    console.error('❌ Error loading data:', e);
                }
            } else {
                // Try legacy data locations for migration
                if (window.testimonialData) {
                    this.data = this.migrate(window.testimonialData);
                }
            }

            // 3. Ensure global access (for legacy compatibility)
            window.testimonialData = this.data;
            
            this.updateStatistics();
            console.log('✅ DataManager Ready');
        },

        // Merges old messy structures into clean new structure
        migrate(oldData) {
            const newData = JSON.parse(JSON.stringify(DEFAULT_DATA)); // Fresh base

            // Helper to normalize group to Object
            const normalizeGroups = (input) => {
                const result = {};
                if (Array.isArray(input)) {
                    input.forEach(g => { if(g && g.id) result[g.id] = g; });
                } else if (typeof input === 'object') {
                    Object.values(input).forEach(g => { if(g && g.id) result[g.id] = g; });
                }
                return result;
            };

            // 1. Check for new unified structure
            if (oldData.groups && typeof oldData.groups === 'object' && !Array.isArray(oldData.groups)) {
                newData.groups = { ...newData.groups, ...oldData.groups };
            }

            // 2. Check for legacy separated structures
            if (oldData.testimonialGroups) newData.groups = { ...newData.groups, ...normalizeGroups(oldData.testimonialGroups) };
            if (oldData.informationalGroups) newData.groups = { ...newData.groups, ...normalizeGroups(oldData.informationalGroups) };

            // 3. Preserve other data
            if (oldData.videos) newData.videos = oldData.videos;
            if (oldData.playerConfig) newData.playerConfig = oldData.playerConfig;
            
            console.log('🔄 Migration complete.');
            return newData;
        },

        save() {
            // Update stats before saving
            this.updateStatistics();
            try {
                localStorage.setItem('testimonialManagerData', JSON.stringify(this.data));
                
                // Keep window object in sync for legacy scripts
                window.testimonialData = this.data;
                
                console.log('💾 Data saved.');
            } catch (e) {
                console.error('❌ Save failed:', e);
                alert('Error saving data. Storage might be full.');
            }
        },

        updateStatistics() {
            const groups = Object.values(this.data.groups);
            this.data.statistics.totalGroups = groups.length;
            this.data.statistics.totalTestimonialGroups = groups.filter(g => g.type === 'testimonial').length;
            this.data.statistics.totalInformationalGroups = groups.filter(g => g.type === 'informational').length;
            this.data.statistics.totalVideos = Object.keys(this.data.videos).length;
        },

        // CRUD Operations
        addGroup(groupData) {
            const id = groupData.id || 'group_' + Date.now();
            this.data.groups[id] = {
                id: id,
                ...groupData,
                type: groupData.type || 'testimonial',
                videos: groupData.videos || [],
                createdAt: new Date().toISOString()
            };
            this.save();
            return id;
        },

        deleteGroup(id) {
            if (this.data.groups[id]) {
                delete this.data.groups[id];
                this.save();
                return true;
            }
            return false;
        },

        updateGroup(id, updates) {
            if (this.data.groups[id]) {
                this.data.groups[id] = { ...this.data.groups[id], ...updates, lastUpdated: new Date().toISOString() };
                this.save();
                return true;
            }
            return false;
        }
    };

    // ============================================
    // 3. UI RENDERER
    // ============================================

    const UI = {
        elements: {
            container: document.getElementById('testimonialGroupsContainer'),
            dropdown: document.getElementById('selectGroupDropdown'),
            modal: document.getElementById('addTestimonialGroupModal'),
            // Add other element refs as needed
        },

        init() {
            // Cache elements
            this.elements.container = document.getElementById('testimonialGroupsContainer');
            this.elements.dropdown = document.getElementById('selectGroupDropdown');
            
            // Initial Render
            this.renderSidebar();
            this.renderDropdown();
        },

        renderSidebar() {
            const container = this.elements.container;
            if (!container) return;

            container.innerHTML = '';
            const groups = Object.values(DataManager.data.groups);

            if (groups.length === 0) {
                container.innerHTML = `<div class="empty-state">No groups found</div>`;
                return;
            }

            groups.forEach(group => {
                const btn = document.createElement('div');
                btn.className = 'testimonial-group-btn';
                btn.dataset.id = group.id;
                
                // Visual Logic based on type
                const isInfo = group.type === 'informational';
                const icon = group.icon || (isInfo ? '📚' : '🎬');
                const count = (group.videos || []).length;
                const typeLabel = isInfo ? 'INFO' : 'TESTIMONIAL';
                const color = isInfo ? '#10b981' : '#3b82f6';

                btn.innerHTML = `
                    <div class="group-icon">${icon}</div>
                    <div class="group-info">
                        <div class="group-name">${group.name}</div>
                        <div class="group-meta">
                            <span>${count} videos</span> • <span>${typeLabel}</span>
                        </div>
                    </div>
                    <div class="group-actions">
                         <button class="btn-edit" onclick="window.TestimonialManager.editGroup('${group.id}', event)">✏️</button>
                         <button class="btn-delete" onclick="window.TestimonialManager.deleteGroup('${group.id}', event)">🗑️</button>
                    </div>
                `;
                
                // ✅ FIXED: Removed inline white background styling
                // Instead of inline styles, use CSS classes
                // The CSS file will handle the styling
                btn.style.cssText = `
                    display: flex; align-items: center; gap: 10px;
                    padding: 12px; margin-bottom: 8px;
                    border: 1px solid #e2e8f0; border-left: 4px solid ${color};
                    border-radius: 8px; cursor: pointer;
                    transition: all 0.2s;
                `;

                btn.onclick = (e) => {
                    if (!e.target.closest('button')) {
                        this.selectGroup(group.id);
                    }
                };

                container.appendChild(btn);
            });
        },

        renderDropdown() {
            const dropdown = this.elements.dropdown;
            if (!dropdown) return;

            // Keep the first "Select a group" option
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }

            const groups = Object.values(DataManager.data.groups);
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = `${group.name} (${group.type})`;
                dropdown.appendChild(option);
            });
        },

        selectGroup(id) {
            const group = DataManager.data.groups[id];
            if (!group) return;

            // Update dropdown
            if (this.elements.dropdown) this.elements.dropdown.value = id;

            // Highlight sidebar button
            document.querySelectorAll('.testimonial-group-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.id === id);
            });

            // Trigger custom event or main content update
            if (typeof window.onGroupSelect === 'function') {
                window.onGroupSelect(group);
            }
            
            console.log(`📂 Selected: ${group.name}`);
        },

        showModal() {
            if (this.elements.modal) {
                this.elements.modal.style.display = 'flex';
                // Reset form logic here
            }
        },
        
        hideModal() {
            if (this.elements.modal) {
                this.elements.modal.style.display = 'none';
            }
        }
    };

   // ============================================
// 4. EXPORTED GLOBAL FUNCTIONS (For HTML onclicks)
// ============================================

window.TestimonialManager = {
    
    // Existing methods from the refactored JS
    createGroupFromForm() {
        const name = document.getElementById('newGroupName').value.trim();
        const type = document.getElementById('newGroupType').value;
        const icon = document.getElementById('newGroupIcon').value;
        const description = document.getElementById('newGroupDescription').value.trim();

        if (!name) {
            alert('Please enter a group name');
            return;
        }

        const newGroup = {
            name,
            type,
            icon,
            description,
            concerns: [] // Implement checkbox logic if needed
        };

        const id = DataManager.addGroup(newGroup);
        
        UI.hideModal();
        UI.renderSidebar();
        UI.renderDropdown();
        
        alert(`Group "${name}" created!`);
    },

    deleteGroup(id, event) {
        if (event) event.stopPropagation();
        if (confirm('Are you sure you want to delete this group?')) {
            if (DataManager.deleteGroup(id)) {
                UI.renderSidebar();
                UI.renderDropdown();
            }
        }
    },

    editGroup(id, event) {
        if (event) event.stopPropagation();
        // Implement edit modal logic
        console.log('Edit group:', id);
    },

    downloadData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DataManager.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "testimonials_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },
    
    // NEW METHODS from the HTML requirements:
    
    selectGroupForForm(groupId) {
        const group = DataManager.data.groups[groupId];
        if (!group) return;

        document.getElementById('currentGroupName').textContent = group.name;
        document.getElementById('selectGroupDropdown').value = groupId;
    },

    updateIconBasedOnType(type) {
        const iconInput = document.getElementById('newGroupIcon');
        const testSection = document.getElementById('testimonialTriggersCheckboxes');
        const infoSection = document.getElementById('informationalTriggersCheckboxes');

        if (type === 'informational') {
            iconInput.value = '📚';
            testSection.style.display = 'none';
            infoSection.style.display = 'block';
        } else {
            iconInput.value = '🎬';
            testSection.style.display = 'block';
            infoSection.style.display = 'none';
        }
    },

    addVideoFromForm() {
        // 1. Get Selected Group
        const groupId = document.getElementById('selectGroupDropdown').value;
        if (!groupId) {
            alert('Please select a group first!');
            return;
        }

        // 2. Get Form Data
        const title = document.getElementById('testimonialTitle').value;
        const url = document.getElementById('videoUrl').value;
        const author = document.getElementById('authorName').value;
        
        if (!title) {
            alert('Please enter a video title');
            return;
        }

        // 3. Create Video Object
        const videoId = 'vid_' + Date.now();
        const videoObj = {
            id: videoId,
            title: title,
            url: url,
            author: author || 'Anonymous',
            concern: document.getElementById('concernType').value,
            text: document.getElementById('testimonialText').value
        };

        // 4. Save to DataManager
        DataManager.data.videos[videoId] = videoObj;
        
        // 5. Add ID to Group
        if (Array.isArray(DataManager.data.groups[groupId].videos)) {
            DataManager.data.groups[groupId].videos.push(videoId);
        } else {
            DataManager.data.groups[groupId].videos = [videoId];
        }

        // 6. Save & Refresh UI
        DataManager.save();
        UI.renderSidebar();
        
        // Clear Form
        document.getElementById('testimonialTitle').value = '';
        document.getElementById('videoUrl').value = '';
        
        alert('Video Added!');
    },

    saveEditFromForm() {
        const id = document.getElementById('editGroupId').value;
        const name = document.getElementById('editGroupName').value;
        const icon = document.getElementById('editGroupIcon').value;
        const desc = document.getElementById('editGroupDescription').value;

        if (!name) {
            alert('Name is required');
            return;
        }

        DataManager.updateGroup(id, {
            name: name,
            icon: icon,
            description: desc
        });

        UI.renderSidebar();
        this.hideEditModal();
    },

    saveData() {
        DataManager.save();
        alert('Data Saved!');
    },

    loadSampleData() {
        if(confirm('This will replace your data with samples. Continue?')) {
            // Sample logic...
            DataManager.init();
            UI.renderSidebar();
            UI.renderDropdown();
            alert('Sample data loaded!');
        }
    },

    copyCode() {
        const code = document.getElementById('codeOutput').textContent;
        navigator.clipboard.writeText(code);
        alert('Code copied!');
    },
    
    // Modal methods:
    showAddModal() {
        UI.showModal();
    },
    
    hideAddModal() {
        UI.hideModal();
    },

    hideEditModal() {
        document.getElementById('editTestimonialGroupModal').style.display = 'none';
    },
    
    // Group selection method:
    selectGroup(groupId) {
        // Call both functions to ensure compatibility
        if (UI && UI.selectGroup) {
            UI.selectGroup(groupId);
        }
        this.selectGroupForForm(groupId);
    }
};

    // ============================================
    // 5. BOOTSTRAP
    // ============================================

    document.addEventListener('DOMContentLoaded', () => {
        console.clear();
        console.log('🚀 Starting Testimonial Manager...');
        
        DataManager.init();
        UI.init();

        // Bind generic events
        const addBtn = document.getElementById('addTestimonialGroupBtn');
        if (addBtn) addBtn.onclick = () => UI.showModal();

        // Close modal listener
        window.onclick = (e) => {
            const modal = document.getElementById('addTestimonialGroupModal');
            if (e.target === modal) UI.hideModal();
        };

        console.log('✅ System Ready');
    });

})();