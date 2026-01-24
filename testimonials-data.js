// ===================================================
// 🎬 DUAL VIDEO SYSTEM DATA - CLEANED
// Compatible with Testimonial Manager v3.0
// ===================================================

window.testimonialData = {
    // ============================================
    // 1. CONCERNS (Matches Manager Keys)
    // ============================================
    "concerns": {
        // Testimonial Concerns
        "price_expensive": { 
            "title": "Expensive", 
            "icon": "💰", 
            "type": "testimonial" 
        },
        "price_cost": { 
            "title": "Cost/Price", 
            "icon": "💰", 
            "type": "testimonial" 
        },
        "time_busy": { 
            "title": "Too Busy", 
            "icon": "⏰", 
            "type": "testimonial" 
        },
        "time_speed": { 
            "title": "Speed/Timing", 
            "icon": "⏰", 
            "type": "testimonial" 
        },
        "trust_skepticism": { 
            "title": "Skepticism", 
            "icon": "🤝", 
            "type": "testimonial" 
        },
        "trust_legitimacy": { 
            "title": "Legitimacy", 
            "icon": "🤝", 
            "type": "testimonial" 
        },
        "results_effectiveness": { 
            "title": "Results/Effectiveness", 
            "icon": "📈", 
            "type": "testimonial" 
        },
        "general_info": { 
            "title": "General Information", 
            "icon": "⭐", 
            "type": "testimonial" 
        },

        // Informational Concerns
        "how_it_works": { 
            "title": "How It Works", 
            "icon": "⚙️", 
            "type": "informational" 
        },
        "benefits_features": { 
            "title": "Benefits & Features", 
            "icon": "✅", 
            "type": "informational" 
        },
        "case_studies": { 
            "title": "Case Studies", 
            "icon": "📊", 
            "type": "informational" 
        },
        "results": { 
            "title": "Results", 
            "icon": "❓", 
            "type": "informational" 
        },
        "setup_process": { 
            "title": "Setup & Process", 
            "icon": "🛠️", 
            "type": "informational" 
        }
    },

    // ============================================
    // 2. TESTIMONIAL GROUPS (Social Proof)
    // Uses "testimonials" array inside
    // ============================================
    "testimonialGroups": {
        "group_conversion_boost": {
            "id": "group_conversion_boost",
            "type": "testimonial",
            "name": "PPC Conversion Boost",
            "slug": "conversion-boost",
            "icon": "📈",
            "description": "AI smart voice chat increases average conversion 300% for professional organizations.",
            "concerns": ["time_busy", "trust_skepticism", "general_info", "results_effectiveness"],
            "testimonials": [
                {
                    "id": "testimonial_01",
                    "title": "312% conversion increase from a form",
                    "concernType": "results_effectiveness",
                    "videoUrl": "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/sign/video-testimonials/legal-personal-injury.mp4?token=...",
                    "author": "Ted Johnson, Esq",
                    "text": "The AI handled objections before they even asked them.",
                    "addedAt": "2024-01-08T19:58:24.439Z",
                    "views": 11
                }
            ],
            "createdAt": "2024-01-08T19:49:47.532Z",
            "viewCount": 11
        }
    },

    // ============================================
    // 3. INFORMATIONAL GROUPS (Educational)
    // Uses "videos" array inside
    // ============================================
    "informationalGroups": {
        "group_how_it_works": {
            "id": "group_how_it_works",
            "type": "informational",
            "name": "How It Works",
            "slug": "how-it-works",
            "icon": "📚",
            "description": "Explainer videos teaching how the system operates.",
            "concerns": ["how_it_works", "benefits_features"],
            "videos": [
                {
                    "id": "info_300_conversions",
                    "title": "300% More Conversions",
                    "concernType": "results_effectiveness",
                    "videoUrl": "", // Populated by Manager
                    "author": "System Explanation",
                    "description": "How AI transforms your conversion rates overnight.",
                    "addedAt": "2024-01-12T00:00:00.000Z",
                    "views": 0
                },
                {
                    "id": "info_pre_qualified",
                    "title": "Pre-Qualified Hot Leads",
                    "concernType": "general_info",
                    "videoUrl": "",
                    "author": "System Explanation",
                    "description": "Stop wasting time on tire-kickers.",
                    "addedAt": "2024-01-12T00:00:00.000Z",
                    "views": 0
                }
            ],
            "createdAt": "2024-01-12T00:00:00.000Z",
            "viewCount": 0
        }
    },

    // ============================================
    // 4. STATISTICS
    // ============================================
    "statistics": {
        "totalTestimonialGroups": 1,
        "totalInformationalGroups": 1,
        "totalTestimonials": 1,
        "totalInformationalVideos": 2,
        "totalVideos": 3 // Grand Total
    },

    // ============================================
    // 5. PLAYER CONFIGURATION
    // ============================================
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
        "resumeMessage": "I'm sure you can appreciate what our clients have to say. Let's get back on track."
    },

    // Metadata
    "__version": "3.0-dual-system-clean",
    "__generated": new Date().toISOString(),
    "__notes": "Pure data structure. Logic moved to System/UI layer."
};

// ===================================================
// UTILITY FUNCTIONS (Data Retrieval Only)
// ===================================================

/**
 * Find a specific video regardless of whether it's testimonial or informational
 * @param {string} videoId - The ID of the video
 * @returns {object|null} - The video object or null
 */
window.testimonialData.getVideo = function(videoId) {
    // 1. Check Testimonial Groups
    for (const groupId in this.testimonialGroups) {
        const group = this.testimonialGroups[groupId];
        if (group.testimonials) {
            const found = group.testimonials.find(t => t.id === videoId);
            if (found) {
                return { ...found, groupName: group.name, groupType: 'testimonial' };
            }
        }
    }

    // 2. Check Informational Groups
    for (const groupId in this.informationalGroups) {
        const group = this.informationalGroups[groupId];
        if (group.videos) {
            const found = group.videos.find(v => v.id === videoId);
            if (found) {
                return { ...found, groupName: group.name, groupType: 'informational' };
            }
        }
    }

    return null;
};

/**
 * Get all testimonials for a specific concern (Social Proof only)
 * @param {string} concernKey - The concern ID (e.g., 'price_expensive')
 * @returns {array} - List of matching testimonials
 */
window.testimonialData.getConcernTestimonials = function(concernKey) {
    const results = [];
    
    if (!this.testimonialGroups) return results;
    
    for (const [groupId, group] of Object.entries(this.testimonialGroups)) {
        // Check if group has this concern trigger
        if (group.concerns && group.concerns.includes(concernKey)) {
            if (group.testimonials) {
                results.push(...group.testimonials.map(t => ({
                    ...t,
                    groupName: group.name,
                    groupIcon: group.icon,
                    groupType: 'testimonial' // Explicitly type it
                })));
            }
        }
    }
    
    return results;
};

/**
 * Get all informational videos for a specific concern
 * @param {string} concernKey - The concern ID
 * @returns {array} - List of matching informational videos
 */
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
console.log('   🎬 Total Videos:', window.testimonialData.statistics.totalVideos);