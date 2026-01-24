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

            // 3. Ensure global access
            window.testimonialData = this.data;
            
            this.updateStatistics();
            console.log('✅ DataManager Ready');
        },

        migrate(oldData) {
            const newData = JSON.parse(JSON.stringify(DEFAULT_DATA)); 
            const normalizeGroups = (input) => {
                const result = {};
                if (Array.isArray(input)) {
                    input.forEach(g => { if(g && g.id) result[g.id] = g; });
                } else if (typeof input === 'object') {
                    Object.values(input).forEach(g => { if(g && g.id) result[g.id] = g; });
                }
                return result;
            };

            if (oldData.groups && typeof oldData.groups === 'object' && !Array.isArray(oldData.groups)) {
                newData.groups = { ...newData.groups, ...oldData.groups };
            }
            if (oldData.testimonialGroups) newData.groups = { ...newData.groups, ...normalizeGroups(oldData.testimonialGroups) };
            if (oldData.informationalGroups) newData.groups = { ...newData.groups, ...normalizeGroups(oldData.informationalGroups) };
            
            if (oldData.videos) newData.videos = oldData.videos;
            if (oldData.playerConfig) newData.playerConfig = oldData.playerConfig;
            
            console.log('🔄 Migration complete.');
            return newData;
        },

        save() {
            this.updateStatistics();
            try {
                localStorage.setItem('testimonialManagerData', JSON.stringify(this.data));
                window.testimonialData = this.data;
                console.log('💾 Data saved.');
            } catch (e) {
                console.error('❌ Save failed:', e);
            }
        },

        updateStatistics() {
            const groups = Object.values(this.data.groups);
            this.data.statistics.totalGroups = groups.length;
            this.data.statistics.totalTestimonialGroups = groups.filter(g => g.type === 'testimonial').length;
            this.data.statistics.totalInformationalGroups = groups.filter(g => g.type === 'informational').length;
            this.data.statistics.totalVideos = Object.keys(this.data.videos).length;
        },

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
        // ✅ UPDATED EXPORT LOGIC
        // ==========================================

        exportToLegacyFormat() {
            console.log('Converting to Legacy Format...');
            
            // 1. Clean Concerns (Remove 'triggers' key which is internal only)
            const cleanedConcerns = {};
            Object.keys(this.data.concerns).forEach(key => {
                const { triggers, ...rest } = this.data.concerns[key];
                cleanedConcerns[key] = rest;
            });

            const legacyData = {
                concerns: cleanedConcerns,
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
                    desktop: { width: 854, height: 480, top: "50%", left: "50%", borderRadius: "12px" },
                    mobile: { fullscreen: true },
                    overlay: { background: "rgba(0, 0, 0, 0.5)" },
                    resumeMessage: "I'm sure you can appreciate what our clients have to say. Let's get back on track."
                },
                __version: "3.0-dual-system-clean",
                __generated: new Date().toISOString()
            };
            
            // 2. Convert Groups
            Object.values(this.data.groups || {}).forEach(group => {
                const slug = group.slug || group.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                if (group.type === 'informational') {
                    legacyData.informationalGroups[group.id] = {
                        id: group.id, type: 'informational', name: group.name, slug,
                        icon: group.icon || '📚', description: group.description || '',
                        concerns: group.concerns || [], videos: [], createdAt: group.createdAt || new Date().toISOString(), viewCount: 0
                    };
                    
                    (group.videos || []).forEach(videoId => {
                        const video = this.data.videos[videoId];
                        if (video) {
                            legacyData.informationalGroups[group.id].videos.push({
                                id: video.id || videoId, title: video.title, concernType: video.concern,
                                videoUrl: video.url, author: video.author || 'System',
                                description: video.text, addedAt: video.createdAt || new Date().toISOString(), views: 0
                            });
                            legacyData.statistics.totalInformationalVideos++;
                            legacyData.statistics.totalVideos++;
                        }
                    });
                    legacyData.statistics.totalInformationalGroups++;
                    
                } else {
                    legacyData.testimonialGroups[group.id] = {
                        id: group.id, type: 'testimonial', name: group.name, slug,
                        icon: group.icon || '📈', description: group.description || '',
                        concerns: group.concerns || [], testimonials: [], createdAt: group.createdAt || new Date().toISOString(), viewCount: 0
                    };
                    
                    (group.videos || []).forEach(videoId => {
                        const video = this.data.videos[videoId];
                        if (video) {
                            legacyData.testimonialGroups[group.id].testimonials.push({
                                id: video.id || videoId, title: video.title, concernType: video.concern,
                                videoUrl: video.url, author: video.author, text: video.text,
                                addedAt: video.createdAt || new Date().toISOString(), views: 0
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
            const stats = legacyData.statistics;
            
            return `// ===================================================
// 🎬 DUAL VIDEO SYSTEM DATA - CLEANED
// ===================================================

window.testimonialData = ${JSON.stringify(legacyData, null, 4)};

window.testimonialData.getVideo = function(vidId) {
    for (const gId in this.testimonialGroups) {
        const g = this.testimonialGroups[gId];
        if (g.testimonials) { const f = g.testimonials.find(t => t.id === vidId); if (f) return {...f, groupName: g.name, groupType: 'testimonial'}; }
    }
    for (const gId in this.informationalGroups) {
        const g = this.informationalGroups[gId];
        if (g.videos) { const f = g.videos.find(v => v.id === vidId); if (f) return {...f, groupName: g.name, groupType: 'informational'}; }
    }
    return null;
};

window.testimonialData.getConcernTestimonials = function(k) {
    const r = [];
    if (!this.testimonialGroups) return r;
    for (const [gId, g] of Object.entries(this.testimonialGroups)) {
        if (g.concerns?.includes(k) && g.testimonials) {
            r.push(...g.testimonials.map(t => ({...t, groupName: g.name, groupIcon: g.icon, groupType: 'testimonial'})));
        }
    }
    return r;
};

window.testimonialData.getConcernVideos = function(k) {
    const r = [];
    if (!this.informationalGroups) return r;
    for (const [gId, g] of Object.entries(this.informationalGroups)) {
        if (g.concerns?.includes(k) && g.videos) {
            r.push(...g.videos.map(v => ({...v, groupName: g.name, groupIcon: g.icon, groupType: 'informational'})));
        }
    }
    return r;
};

console.log('✅ Dual System Data Loaded:');`;
        },
        
        downloadTestimonialsJS() {
            // Update screen BEFORE downloading
            updateCodeOutput(); 
            
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
            alert('✅ Exported testimonials-data.js!');
        }
    };

       // ============================================
    // ✅ SCREEN UPDATER
    // ============================================
    
    function updateCodeOutput() {
        const codeOutput = document.getElementById('codeOutput');
        
        // Check if element exists
        if (!codeOutput) {
            console.warn("⚠️ Could not find #codeOutput element.");
            return;
        }

        // Check if DataManager is ready
        if (!DataManager || !DataManager.createFileContent) {
            codeOutput.textContent = "// Waiting for DataManager to initialize...";
            return;
        }
        
        // ✅ FIX: Force the textarea to wrap and stay contained
        codeOutput.style.whiteSpace = 'pre-wrap';
        codeOutput.style.wordWrap = 'break-word';
        codeOutput.style.width = '100%';
        codeOutput.style.maxWidth = '100%';
        codeOutput.style.boxSizing = 'border-box';
        
        // Get the converted string and put it in the box
        codeOutput.textContent = DataManager.createFileContent();
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

            // ✅ ADD THIS LINE:
        window.TestimonialManager.updateStatisticsUI();
            
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
                    border: 1px solid #006effff; border-left: 4px solid ${color};
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
// 4. EXPORTED GLOBAL FUNCTIONS
// ============================================

window.TestimonialManager = {

        resetSystem() {
        if(confirm('WARNING: This will clear all local data and reload the page. Continue?')) {
            localStorage.clear();
            location.reload(); // Forces a fresh page load
        }
    },
    
    // 1. Dynamic Checkboxes
    generateCheckboxes(type, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = ''; 
        
        // FIX: Force container to flex and wrap
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '8px';
        
        Object.entries(CONCERNS).forEach(([key, data]) => {
            if (data.type === type) {
                const label = document.createElement('label');
                label.className = 'concern-checkbox-item';
                label.style.display = 'inline-flex';
                label.style.alignItems = 'center';
                label.style.margin = '0'; 
                label.style.padding = '5px 12px';
                label.style.border = '1px solid #ddd';
                label.style.borderRadius = '20px';
                label.style.cursor = 'pointer';
                label.style.userSelect = 'none';
                label.style.fontSize = '14px';

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.className = 'concern-checkbox';
                input.value = key;
                input.style.marginRight = '8px';

                label.appendChild(input);
                label.appendChild(document.createTextNode(`${data.icon} ${data.title}`));
                
                container.appendChild(label);
            }
        });
        
        this.initCheckboxListeners();
    },

    // 2. Get Selected Concerns
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

    // 3. Checkbox Listeners
    initCheckboxListeners() {
        const checkboxes = document.querySelectorAll('.concern-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox.hasAttribute('data-listener')) return;
            checkbox.setAttribute('data-listener', 'true');
            checkbox.addEventListener('change', function() {
                const label = this.closest('label');
                if (label) {
                    if (this.checked) {
                        label.style.background = '#00a08bff';
                        label.style.color = '#fff';
                    } else {
                        label.style.background = '';
                        label.style.color = '';
                    }
                }
            });
        });
    },

    // 4. Add Video (Clean & Complete)
    addVideoFromForm() {
        const groupId = document.getElementById('selectGroupDropdown').value;
        if (!groupId) { alert('Please select a group first!'); return; }

        const title = document.getElementById('testimonialTitle').value;
        const url = document.getElementById('videoUrl').value;
        const author = document.getElementById('authorName').value;
        
        if (!title) { alert('Please enter a video title'); return; }

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
        updateCodeOutput();
        window.TestimonialManager.updateStatisticsUI(); // Update stats
        
        document.getElementById('testimonialTitle').value = '';
        document.getElementById('videoUrl').value = '';
        alert('Video Added!');
    },

    // 5. Test URL
    testVideoUrl() {
        const url = document.getElementById('videoUrl').value.trim();
        
        if (!url) {
            alert('Please paste a URL first!');
            return;
        }

        const videoPlayer = document.getElementById('testimonialVideoPlayer');
        const videoModal = document.getElementById('videoPlayerModal');
        const titleEl = document.getElementById('videoPlayerTitle');
        const infoEl = document.getElementById('videoPlayerInfo');

        if (!videoPlayer || !videoModal) {
            alert('Error: Video Player Modal not found in HTML. Please ensure you added "Video Player Overlay" HTML.');
            return;
        }

        videoPlayer.src = url;
        videoPlayer.load();

        if (titleEl) titleEl.textContent = 'Testing URL...';
        if (infoEl) {
            infoEl.innerHTML = `
                <div class="video-info-item"><strong>Status:</strong> Testing Playback</div>
                <div class="video-info-item"><strong>URL:</strong> ${url}</div>
            `;
        }

        videoModal.style.display = 'flex';

        setTimeout(() => {
            videoPlayer.play().catch(e => {
                console.warn('Playback failed (possibly invalid link):', e);
                alert('Could not play video. Check URL and browser console.');
            });
        }, 500);
    },

    // 6. Create Group
    createGroupFromForm() {
        const name = document.getElementById('newGroupName').value.trim();
        const type = document.getElementById('newGroupType').value;
        const icon = document.getElementById('newGroupIcon').value;
        const description = document.getElementById('newGroupDescription').value.trim();

        if (!name) {
            alert('Please enter a group name');
            return;
        }

        const concerns = this.getSelectedConcerns(type, 'add');

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
        updateCodeOutput();
        window.TestimonialManager.updateStatisticsUI();
        
        alert(`Group "${name}" created!`);
    },

    // 7. Delete Group
    deleteGroup(id, event) {
        if (event) event.stopPropagation();
        if (confirm('Are you sure you want to delete this group?')) {
            if (DataManager.deleteGroup(id)) {
                UI.renderSidebar();
                UI.renderDropdown();
                updateCodeOutput();
                window.TestimonialManager.updateStatisticsUI();
            }
        }
    },

    // 8. Edit Group
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
                this.generateCheckboxes('informational', 'editInformationalTriggersCheckboxes');
            } else {
                if (testSection) testSection.style.display = 'block';
                if (infoSection) infoSection.style.display = 'none';
                this.generateCheckboxes('testimonial', 'editTestimonialTriggersCheckboxes');
            }

            if (group.concerns && Array.isArray(group.concerns)) {
                group.concerns.forEach(concernId => {
                    const checkbox = document.querySelector(`#editTestimonialTriggersCheckboxes input[value="${concernId}"], #editInformationalTriggersCheckboxes input[value="${concernId}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }, 100);
    },

    // 9. Update Icon
    updateIconBasedOnType(type) {
        const iconInput = document.getElementById('newGroupIcon');
        const testSection = document.getElementById('testimonialTriggersCheckboxes');
        const infoSection = document.getElementById('informationalTriggersCheckboxes');

        if (type === 'informational') {
            iconInput.value = '📚';
            if (testSection) testSection.style.display = 'none';
            if (infoSection) infoSection.style.display = 'block';
            this.generateCheckboxes('informational', 'informationalTriggersCheckboxes');
        } else {
            iconInput.value = '🎬';
            if (testSection) testSection.style.display = 'block';
            if (infoSection) infoSection.style.display = 'none';
            this.generateCheckboxes('testimonial', 'testimonialTriggersCheckboxes');
        }
    },
    
    populateConcernCheckboxes(type, formType) {
        const prefix = formType === 'edit' ? 'edit_' : '';
        const typeLower = type === 'informational' ? 'informational' : 'testimonial';
        const containerId = `${prefix}${typeLower}TriggersCheckboxes`;
        this.generateCheckboxes(type, containerId);
    },

    // 10. Save Edit
    saveEditFromForm() {
        const id = document.getElementById('editGroupId').value;
        const name = document.getElementById('editGroupName').value;
        const icon = document.getElementById('editGroupIcon').value;
        const desc = document.getElementById('editGroupDescription').value;
        
        const group = DataManager.data.groups[id];
        const type = group ? group.type : 'testimonial';

        if (!name) { alert('Name is required'); return; }

        const concerns = this.getSelectedConcerns(type, 'edit');

        DataManager.updateGroup(id, {
            name: name,
            icon: icon,
            description: desc,
            concerns: concerns
        });

        UI.renderSidebar();
        this.hideEditModal();
        updateCodeOutput();
        window.TestimonialManager.updateStatisticsUI();
    },

    // 11. Save Data
    saveData() {
        DataManager.save();
        updateCodeOutput();
        window.TestimonialManager.updateStatisticsUI();
        alert('Data Saved!');
    },

    // 12. Copy Code
    copyCode() {
        const code = document.getElementById('codeOutput').textContent;
        navigator.clipboard.writeText(code).then(() => alert('Code copied!'));
    },
    
    // 13. Show Add Modal
    showAddModal() {
        UI.showModal();
        setTimeout(() => {
            this.updateIconBasedOnType('testimonial');
            this.initCheckboxListeners();
        }, 50);
    },
    
    // 14. Hide Modals
    hideAddModal() { UI.hideModal(); },
    
    hideEditModal() {
        const modal = document.getElementById('editTestimonialGroupModal');
        if (modal) modal.style.display = 'none';
    },
    
    selectGroup(groupId) {
        if (UI && UI.selectGroup) UI.selectGroup(groupId);
    },

    // 15. Clean Statistics Updater
    updateStatisticsUI() {
        const groups = DataManager.data.groups || {};
        const videos = DataManager.data.videos || {};

        const totalGroups = Object.keys(groups).length;
        const totalVideos = Object.keys(videos).length;

        let totalViews = 0;
        Object.values(videos).forEach(v => {
            if (v.views && typeof v.views === 'number') {
                totalViews += v.views;
            }
        });

        const elGroups = document.getElementById('statTotalGroups');
        const elVideos = document.getElementById('statTotalVideos');
        const elViews = document.getElementById('statTotalViews');

        if (elGroups) elGroups.textContent = totalGroups;
        if (elVideos) elVideos.textContent = totalVideos;
        if (elViews) elViews.textContent = totalViews;
    },
    
    // 16. View Group Overlay
    viewGroup(groupId) {
        const group = DataManager.data.groups[groupId];
        if (!group) return;

        UI.selectGroup(groupId);

        const videoList = [];
        if (group.videos && Array.isArray(group.videos)) {
            group.videos.forEach(vidId => {
                if (DataManager.data.videos[vidId]) {
                    videoList.push(DataManager.data.videos[vidId]);
                }
            });
        }

        const container = document.getElementById('allTestimonialsContent');
        if (!container) {
            console.warn("⚠️ allTestimonialsContent div not found in HTML.");
            return;
        }

        if (videoList.length === 0) {
            container.innerHTML = `
                <div class="empty-testimonials">
                    <div class="empty-icon">🎬</div>
                    <h3>No videos yet</h3>
                    <p>Add videos to this group to see them here</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="testimonials-grid">
                    ${videoList.map(video => this.createVideoCard(video)).join('')}
                </div>
            `;
        }

        const modal = document.getElementById('allTestimonialsModal');
        if (modal) {
            modal.style.display = 'flex';
        }
        
        const countDisplay = document.getElementById('totalTestimonialsCount');
        if (countDisplay) countDisplay.textContent = videoList.length;
    },

    createVideoCard(video) {
        const concernType = video.concern || 'general';
        
        const concernIcons = {
            'price': '💰', 'time': '⏰', 'trust': '🤝', 'results': '📈', 'general': '⭐',
            'how_it_works': '⚙️', 'benefits_features': '✅', 'case_studies': '📊', 'faq': '❓'
        };
        
        const concernLabels = {
            'price': 'Price Concern', 'time': 'Time/Speed', 'trust': 'Trust', 'results': 'Results', 'general': 'General',
            'how_it_works': 'How It Works', 'benefits_features': 'Benefits', 'case_studies': 'Case Studies', 'faq': 'FAQ'
        };

        const icon = concernIcons[concernType] || '⭐';
        const label = concernLabels[concernType] || 'Testimonial';

        return `
            <div class="testimonial-card" onclick="window.TestimonialManager.playVideo('${video.id}')">
                <div class="testimonial-card-header">
                    <span class="testimonial-concern-icon">${icon}</span>
                    <span class="testimonial-concern-label">${label}</span>
                </div>
                <div class="testimonial-card-body">
                    <h4 class="testimonial-title">${video.title || 'Untitled'}</h4>
                    <p class="testimonial-author">👤 ${video.author || 'Anonymous'}</p>
                    ${video.text ? `<p class="testimonial-text">${video.text}</p>` : ''}
                </div>
                <div class="testimonial-card-footer">
                    <button class="btn btn-primary btn-play">
                        <span class="btn-icon">▶️</span>
                        Play Video
                    </button>
                    <span class="testimonial-views">👁️ ${video.views || 0} views</span>
                </div>
            </div>
        `;
    },

    playVideo(videoId) {
        let video = null;
        let group = null;

        for (const [gId, gData] of Object.entries(DataManager.data.groups)) {
            if (gData.videos && gData.videos.includes(videoId)) {
                video = DataManager.data.videos[videoId];
                group = gData;
                break;
            }
        }

        if (!video) {
            console.error('❌ Video not found:', videoId);
            alert('Video not found in database.');
            return;
        }

        if (typeof video.views === 'number') {
            video.views++;
        } else {
            video.views = 1;
        }
        
        if (group) {
            group.viewCount = (group.viewCount || 0) + 1;
        }

        DataManager.save();
        UI.renderSidebar(); 
        window.TestimonialManager.updateStatisticsUI();

        const videoPlayer = document.getElementById('testimonialVideoPlayer');
        const videoModal = document.getElementById('videoPlayerModal');
        const titleEl = document.getElementById('videoPlayerTitle');
        const infoEl = document.getElementById('videoPlayerInfo');
        
        if (!videoPlayer || !videoModal) {
            alert('Video player elements not found in HTML.');
            return;
        }

        videoPlayer.src = video.url;
        videoPlayer.load();

        if (titleEl) titleEl.textContent = video.title;
        if (infoEl) {
            infoEl.innerHTML = `
                <div class="video-info-item"><strong>Author:</strong> ${video.author || 'Unknown'}</div>
                <div class="video-info-item"><strong>Concern:</strong> ${video.concern || 'General'}</div>
                ${video.text ? `<div class="video-info-item"><strong>Text:</strong> ${video.text}</div>` : ''}
                ${group ? `<div class="video-info-item"><strong>Group:</strong> ${group.name}</div>` : ''}
            `;
        }

        const listModal = document.getElementById('allTestimonialsModal');
        if (listModal) listModal.style.display = 'none';

        videoModal.style.display = 'flex';

        setTimeout(() => {
            videoPlayer.play().catch(e => console.log('Autoplay blocked:', e));
        }, 500);
    },

    closeVideoPlayer() {
        const videoPlayer = document.getElementById('testimonialVideoPlayer');
        const videoModal = document.getElementById('videoPlayerModal');
        
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = "";
        }
        if (videoModal) {
            videoModal.style.display = 'none';
        }
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