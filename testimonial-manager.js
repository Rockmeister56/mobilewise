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
        },

        // ==========================================
        // ✅ EXPORT LOGIC (New -> Old)
        // ==========================================

        exportToLegacyFormat() {
            const legacyData = {
                concerns: this.data.concerns || {},
                testimonialGroups: {},
                informationalGroups: {},
                statistics: {
                    totalTestimonialGroups: 0,
                    totalInformationalGroups: 0,
                    totalTestimonials: 0,
                    totalInformationalVideos: 0,
                    totalVideos: 0
                },
                playerConfig: this.data.playerConfig || {
                    desktop: { width: 854, height: 480 },
                    mobile: { fullscreen: true }
                },
                __version: "3.0-exported",
                __generated: new Date().toISOString()
            };
            
            // Convert unified groups to legacy split groups
            Object.values(this.data.groups || {}).forEach(group => {
                if (group.type === 'informational') {
                    legacyData.informationalGroups[group.id] = {
                        id: group.id,
                        type: 'informational',
                        name: group.name,
                        icon: group.icon || '📚',
                        description: group.description || '',
                        concerns: group.concerns || [],
                        videos: [],
                        createdAt: group.createdAt || new Date().toISOString(),
                        viewCount: 0
                    };
                    
                    (group.videos || []).forEach(videoId => {
                        const video = this.data.videos[videoId];
                        if (video) {
                            legacyData.informationalGroups[group.id].videos.push({
                                id: video.id || videoId,
                                title: video.title,
                                concernType: video.concern,
                                videoUrl: video.url,
                                author: video.author,
                                description: video.text,
                                addedAt: video.createdAt || new Date().toISOString(),
                                views: 0
                            });
                            legacyData.statistics.totalInformationalVideos++;
                            legacyData.statistics.totalVideos++;
                        }
                    });
                    
                    legacyData.statistics.totalInformationalGroups++;
                    
                } else {
                    legacyData.testimonialGroups[group.id] = {
                        id: group.id,
                        type: 'testimonial',
                        name: group.name,
                        icon: group.icon || '🎬',
                        description: group.description || '',
                        concerns: group.concerns || [],
                        testimonials: [],
                        createdAt: group.createdAt || new Date().toISOString(),
                        viewCount: 0
                    };
                    
                    (group.videos || []).forEach(videoId => {
                        const video = this.data.videos[videoId];
                        if (video) {
                            legacyData.testimonialGroups[group.id].testimonials.push({
                                id: video.id || videoId,
                                title: video.title,
                                concernType: video.concern,
                                videoUrl: video.url,
                                author: video.author,
                                text: video.text,
                                addedAt: video.createdAt || new Date().toISOString(),
                                views: 0
                            });
                            legacyData.statistics.totalTestimonials++;
                            legacyData.statistics.totalVideos++;
                        }
                    });
                    
                    legacyData.statistics.totalTestimonialGroups++;
                }
            });
            
            return legacyData;
        },
        
        createFileContent() {
            const legacyData = this.exportToLegacyFormat();
            
            return `// ===================================================
// 🎬 DUAL VIDEO SYSTEM DATA - CLEANED
// Generated from Testimonial Manager
// Export Date: ${new Date().toLocaleDateString()}
// ===================================================

window.testimonialData = ${JSON.stringify(legacyData, null, 4)};

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

window.testimonialData.getVideo = function(videoId) {
    for (const groupId in this.testimonialGroups) {
        const group = this.testimonialGroups[groupId];
        if (group.testimonials) {
            const found = group.testimonials.find(t => t.id === videoId);
            if (found) return { ...found, groupName: group.name, groupType: 'testimonial' };
        }
    }
    
    for (const groupId in this.informationalGroups) {
        const group = this.informationalGroups[groupId];
        if (group.videos) {
            const found = group.videos.find(v => v.id === videoId);
            if (found) return { ...found, groupName: group.name, groupType: 'informational' };
        }
    }
    
    return null;
};

window.testimonialData.getConcernTestimonials = function(concernKey) {
    const results = [];
    if (!this.testimonialGroups) return results;
    
    for (const [groupId, group] of Object.entries(this.testimonialGroups)) {
        if (group.concerns && group.concerns.includes(concernKey)) {
            if (group.testimonials) {
                results.push(...group.testimonials.map(t => ({
                    ...t,
                    groupName: group.name,
                    groupIcon: group.icon,
                    groupType: 'testimonial'
                })));
            }
        }
    }
    return results;
};

window.testimonialData.getConcernVideos = function(concernKey) {
    const results = [];
    if (!this.informationalGroups) return results;
    
    for (const [groupId, group] of Object.entries(this.informationalGroups)) {
        if (group.concerns && group.concerns.includes(concernKey)) {
            if (group.videos) {
                results.push(...group.videos.map(v => ({
                    ...v,
                    groupName: group.name,
                    groupIcon: group.icon,
                    groupType: 'informational'
                })));
            }
        }
    }
    return results;
};

console.log('✅ Dual System Data Loaded:');
console.log('   ⭐ Testimonial Groups:', window.testimonialData.statistics.totalTestimonialGroups);
console.log('   📚 Informational Groups:', window.testimonialData.statistics.totalInformationalGroups);
console.log('   🎬 Total Videos:', window.testimonialData.statistics.totalVideos);`;
        },
        
        downloadTestimonialsJS() {
            const jsContent = this.createFileContent();
            const blob = new Blob([jsContent], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'testimonials-data.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('✅ testimonials-data.js file downloaded!');
            return true;
        }
    };

    // ============================================
    // ✅ NEW: DISPLAY UPDATER
    // ============================================
    
    // This function updates the text area on screen with the converted code
    function updateCodeOutput() {
        const codeOutput = document.getElementById('codeOutput');
        if (!codeOutput) return;
        
        // Get the exact string that would be downloaded
        const codeContent = DataManager.createFileContent();
        codeOutput.textContent = codeContent;
    }

    // ============================================
    // 3. UI RENDERER
    // ============================================

    const UI = {
        elements: {
            container: document.getElementById('testimonialGroupsContainer'),
            dropdown: document.getElementById('selectGroupDropdown'),
            modal: document.getElementById('addTestimonialGroupModal'),
        },

        init() {
            // Cache elements
            this.elements.container = document.getElementById('testimonialGroupsContainer');
            this.elements.dropdown = document.getElementById('selectGroupDropdown');
            
            // Initial Render
            this.renderSidebar();
            this.renderDropdown();
            
            // ✅ CRITICAL: Update code box on load
            updateCodeOutput();
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

            if (this.elements.dropdown) this.elements.dropdown.value = id;

            document.querySelectorAll('.testimonial-group-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.id === id);
            });

            if (typeof window.onGroupSelect === 'function') {
                window.onGroupSelect(group);
            }
            
            console.log(`📂 Selected: ${group.name}`);
        },

        showModal() {
            if (this.elements.modal) {
                this.elements.modal.style.display = 'flex';
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
    
    createGroupFromForm() {
        const name = document.getElementById('newGroupName').value.trim();
        const type = document.getElementById('newGroupType').value;
        const icon = document.getElementById('newGroupIcon').value;
        const description = document.getElementById('newGroupDescription').value.trim();

        if (!name) {
            alert('Please enter a group name');
            return;
        }

        // Get selected concerns
        const concerns = this.getSelectedConcerns(type);

        const newGroup = {
            name,
            type,
            icon,
            description,
            concerns: concerns
        };

        const id = DataManager.addGroup(newGroup);
        
        UI.hideModal();
        UI.renderSidebar();
        UI.renderDropdown();
        
        // ✅ UPDATE CODE OUTPUT
        updateCodeOutput();
        
        alert(`Group "${name}" created!`);
    },

    deleteGroup(id, event) {
        if (event) event.stopPropagation();
        if (confirm('Are you sure you want to delete this group?')) {
            if (DataManager.deleteGroup(id)) {
                UI.renderSidebar();
                UI.renderDropdown();
                // ✅ UPDATE CODE OUTPUT
                updateCodeOutput();
            }
        }
    },

    editGroup(id, event) {
        if (event) event.stopPropagation();
        
        const group = DataManager.data.groups[id];
        if (!group) return;
        
        const modal = document.getElementById('editTestimonialGroupModal');
        if (!modal) return;
        
        document.getElementById('editGroupId').value = group.id;
        document.getElementById('editGroupName').value = group.name || '';
        document.getElementById('editGroupIcon').value = group.icon || '';
        document.getElementById('editGroupDescription').value = group.description || '';
        
        modal.style.display = 'flex';
        
        setTimeout(() => {
            const testSection = document.getElementById('editTestimonialTriggersCheckboxes');
            const infoSection = document.getElementById('editInformationalTriggersCheckboxes');
            
            if (group.type === 'informational') {
                if (testSection) testSection.style.display = 'none';
                if (infoSection) infoSection.style.display = 'block';
                this.populateConcernCheckboxes(group.type, 'edit');
            } else {
                if (testSection) testSection.style.display = 'block';
                if (infoSection) infoSection.style.display = 'none';
                this.populateConcernCheckboxes(group.type, 'edit');
            }

            // Check previously selected concerns
            if (group.concerns && Array.isArray(group.concerns)) {
                group.concerns.forEach(concernId => {
                    const checkbox = document.getElementById(`edit_concern_${concernId}`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }, 100);
    },

    downloadData() {
        // Download JSON (Backup)
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DataManager.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "testimonials_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },
    
    // ✅ NEW: Download the actual JS file
    downloadJSFile() {
        DataManager.downloadTestimonialsJS();
    },

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
            if (testSection) testSection.style.display = 'none';
            if (infoSection) infoSection.style.display = 'block';
        } else {
            iconInput.value = '🎬';
            if (testSection) testSection.style.display = 'block';
            if (infoSection) infoSection.style.display = 'none';
        }
        
        this.populateConcernCheckboxes(type, 'add');
    },
    
    populateConcernCheckboxes(type, formType = 'add') {
        if (formType === 'add') {
            const testSection = document.getElementById('testimonialTriggersCheckboxes');
            const infoSection = document.getElementById('informationalTriggersCheckboxes');
            
            if (type === 'informational') {
                if (testSection) testSection.style.display = 'none';
                if (infoSection) infoSection.style.display = 'block';
            } else {
                if (testSection) testSection.style.display = 'block';
                if (infoSection) infoSection.style.display = 'none';
            }
        }
    },

    initCheckboxListeners() {
        const checkboxes = document.querySelectorAll('.concern-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox.hasAttribute('data-initialized')) return;
            checkbox.setAttribute('data-initialized', 'true');
            checkbox.addEventListener('change', function() {
                const label = this.closest('label.concern-checkbox-item');
                if (label) {
                    if (this.checked) {
                        label.style.background = '#00a08bff';
                        label.style.borderRadius = '4px';
                        label.style.padding = '4px 8px';
                    } else {
                        label.style.background = '';
                        label.style.borderRadius = '';
                        label.style.padding = '';
                    }
                }
            });
        });
    },
    
    getSelectedConcerns(type, formType = 'add') {
        const prefix = formType === 'edit' ? 'edit_' : '';
        const section = type === 'informational' 
            ? document.getElementById(`${prefix}informationalTriggersCheckboxes`)
            : document.getElementById(`${prefix}testimonialTriggersCheckboxes`);
        
        const selected = [];
        if (section) {
            const checkboxes = section.querySelectorAll('.concern-checkbox:checked');
            checkboxes.forEach(cb => selected.push(cb.value));
        }
        return selected;
    },

    addVideoFromForm() {
        const groupId = document.getElementById('selectGroupDropdown').value;
        if (!groupId) {
            alert('Please select a group first!');
            return;
        }

        const title = document.getElementById('testimonialTitle').value;
        const url = document.getElementById('videoUrl').value;
        const author = document.getElementById('authorName').value;
        
        if (!title) {
            alert('Please enter a video title');
            return;
        }

        const videoId = 'vid_' + Date.now();
        const videoObj = {
            id: videoId,
            title: title,
            url: url,
            author: author || 'Anonymous',
            concern: document.getElementById('concernType').value,
            text: document.getElementById('testimonialText').value
        };

        DataManager.data.videos[videoId] = videoObj;
        
        if (Array.isArray(DataManager.data.groups[groupId].videos)) {
            DataManager.data.groups[groupId].videos.push(videoId);
        } else {
            DataManager.data.groups[groupId].videos = [videoId];
        }

        DataManager.save();
        UI.renderSidebar();
        
        // ✅ UPDATE CODE OUTPUT
        updateCodeOutput();
        
        document.getElementById('testimonialTitle').value = '';
        document.getElementById('videoUrl').value = '';
        
        alert('Video Added!');
    },

    saveEditFromForm() {
        const id = document.getElementById('editGroupId').value;
        const name = document.getElementById('editGroupName').value;
        const icon = document.getElementById('editGroupIcon').value;
        const desc = document.getElementById('editGroupDescription').value;
        const type = document.getElementById('editGroupType') ? document.getElementById('editGroupType').value : 'testimonial';

        if (!name) {
            alert('Name is required');
            return;
        }

        const concerns = this.getSelectedConcerns(type, 'edit');

        DataManager.updateGroup(id, {
            name: name,
            icon: icon,
            description: desc,
            concerns: concerns
        });

        UI.renderSidebar();
        this.hideEditModal();
        
        // ✅ UPDATE CODE OUTPUT
        updateCodeOutput();
    },

    saveData() {
        DataManager.save();
        updateCodeOutput();
        alert('Data Saved!');
    },

    copyCode() {
        const code = document.getElementById('codeOutput').textContent;
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
    },
    
    showAddModal() {
        UI.showModal();
        setTimeout(() => { this.initCheckboxListeners(); }, 50);
    },
    
    hideAddModal() {
        UI.hideModal();
    },

    hideEditModal() {
        const modal = document.getElementById('editTestimonialGroupModal');
        if (modal) modal.style.display = 'none';
    },
    
    selectGroup(groupId) {
        if (UI && UI.selectGroup) UI.selectGroup(groupId);
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
    
    const addBtn = document.getElementById('addTestimonialGroupBtn');
    if (addBtn) addBtn.onclick = () => {
        window.TestimonialManager.showAddModal();
    };
    
    window.onclick = (e) => {
        const modal = document.getElementById('addTestimonialGroupModal');
        if (e.target === modal) UI.hideModal();
        
        const editModal = document.getElementById('editTestimonialGroupModal');
        if (e.target === editModal) window.TestimonialManager.hideEditModal();
    };
    
    console.log('✅ System Ready');
});

})();