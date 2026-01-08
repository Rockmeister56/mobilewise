// ===================================================
// 🎬 TESTIMONIALS DATA - GROUPS SYSTEM TEMPLATE
// ===================================================
// This is a clean template for the testimonial groups system
// Add groups and testimonials through the management interface
// ===================================================

window.testimonialData = {
    // ===================================================
    // 1. VIDEO URLS (CRITICAL FOR VIDEO PLAYER)
    // ===================================================
    videoUrls: {
        skeptical: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4',
        speed: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4',
        convinced: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1763530566773.mp4',
        excited: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1763531028258.mp4'
    },
    
    videoDurations: {
        skeptical: 22000,
        speed: 18000, 
        convinced: 25000,
        excited: 20000
    },
    
    // ===================================================
    // 2. CONCERNS TEMPLATE (FOR REFERENCE ONLY)
    // ===================================================
    // These are examples - groups will reference these concern types
    concerns: {
        price: {
            title: 'Price Concerns',
            icon: '💰',
            videoType: 'skeptical'
        },
        time: {
            title: 'Time/Speed',
            icon: '⏰',
            videoType: 'speed'
        },
        trust: {
            title: 'Trust/Reliability',
            icon: '🤝',
            videoType: 'skeptical'
        },
        results: {
            title: 'Results/Effectiveness',
            icon: '📈',
            videoType: 'convinced'
        },
        general: {
            title: 'General Feedback',
            icon: '⭐',
            videoType: 'skeptical'
        }
    },
    
    // ===================================================
    // 3. TESTIMONIAL GROUPS (EMPTY - WILL BE POPULATED)
    // ===================================================
    testimonialGroups: {
        // Groups will be added here through the interface
        // Structure for each group:
        /*
        "group_id": {
            id: "group_id",
            name: "Group Name",
            slug: "group-slug",
            icon: "📁",
            description: "Description here",
            concerns: ["price", "trust"], // References to concern types
            testimonials: [
                {
                    id: "testimonial_id",
                    title: "Testimonial Title",
                    concernType: "price",
                    videoUrl: "https://...",
                    author: "John D.",
                    text: "Testimonial text...",
                    addedAt: "2026-01-08T...",
                    views: 0
                }
            ],
            createdAt: "2026-01-08T...",
            viewCount: 0
        }
        */
    },
    
    // ===================================================
    // 4. STATISTICS
    // ===================================================
    statistics: {
        totalGroups: 0,
        totalVideos: 0,
        totalViews: 0
    },
    
    // ===================================================
    // 5. VIDEO PLAYER CONFIGURATION
    // ===================================================
    playerConfig: {
        desktop: {
            width: 854,
            height: 480,
            top: '50%',
            left: '50%',
            borderRadius: '12px'
        },
        mobile: {
            fullscreen: true
        },
        overlay: {
            background: 'rgba(0, 0, 0, 0.5)'
        },
        resumeMessage: "I'm sure you can appreciate what our clients have to say. So let's get back on track with helping you sell your practice. Would you like a free consultation with Bruce that can analyze your particular situation?"
    },
    
    // ===================================================
    // 6. HELPER FUNCTIONS
    // ===================================================
    getCompleteTestimonial: function(userMessage) {
        // Simplified version for backward compatibility
        console.log('🔍 Finding testimonial for:', userMessage.substring(0, 50));
        
        const message = userMessage.toLowerCase();
        
        // Check if we have any testimonials
        if (!this.testimonialGroups || Object.keys(this.testimonialGroups).length === 0) {
            return this.getFallbackTestimonial();
        }
        
        // Search through all testimonials in all groups
        for (const [groupId, group] of Object.entries(this.testimonialGroups)) {
            if (!group.testimonials || group.testimonials.length === 0) continue;
            
            for (const testimonial of group.testimonials) {
                // Simple keyword matching (can be enhanced)
                const searchText = (testimonial.title + ' ' + testimonial.text + ' ' + testimonial.concernType).toLowerCase();
                
                // Check for common concern keywords
                const concernKeywords = {
                    price: ['expensive', 'cost', 'price', 'budget', 'value', 'afford'],
                    time: ['time', 'quick', 'fast', 'speed', 'minutes', 'hours'],
                    trust: ['trust', 'reliable', 'skeptical', 'believe', 'scam', 'doubt'],
                    results: ['result', 'work', 'effective', 'success', 'improve', 'outcome']
                };
                
                // Check if message contains any concern keywords that match this testimonial
                const concernType = testimonial.concernType;
                if (concernKeywords[concernType]) {
                    for (const keyword of concernKeywords[concernType]) {
                        if (message.includes(keyword)) {
                            console.log('✅ Matched keyword:', keyword, 'for concern:', concernType);
                            return this.formatTestimonialResponse(testimonial, group);
                        }
                    }
                }
                
                // Check if testimonial text contains words from user message
                const userWords = message.split(' ');
                for (const word of userWords) {
                    if (word.length > 3 && searchText.includes(word)) {
                        console.log('✅ Matched word:', word);
                        return this.formatTestimonialResponse(testimonial, group);
                    }
                }
            }
        }
        
        // Fallback to first available testimonial
        return this.getFallbackTestimonial();
    },
    
    formatTestimonialResponse: function(testimonial, group) {
        const concernData = this.concerns[testimonial.concernType] || { title: 'Customer Feedback', icon: '⭐', videoType: 'skeptical' };
        
        return {
            concern: concernData.title,
            review: testimonial.text || testimonial.title,
            author: testimonial.author || 'Satisfied Customer',
            icon: concernData.icon,
            videoType: concernData.videoType,
            video: {
                url: testimonial.videoUrl || this.videoUrls[concernData.videoType] || this.videoUrls.skeptical,
                duration: this.videoDurations[concernData.videoType] || 20000
            },
            group: group.name,
            timestamp: testimonial.addedAt || new Date().toISOString()
        };
    },
    
    getFallbackTestimonial: function() {
        // Return a generic fallback testimonial
        return {
            concern: "Customer Satisfaction",
            review: "Our clients have been consistently satisfied with our services.",
            author: "Happy Customer",
            icon: "⭐",
            videoType: "skeptical",
            video: {
                url: this.videoUrls.skeptical,
                duration: this.videoDurations.skeptical
            },
            group: "General",
            timestamp: new Date().toISOString()
        };
    },
    
    playTestimonialVideo: function(videoType) {
        // Simple video player function for backward compatibility
        const videoUrl = this.videoUrls[videoType] || this.videoUrls.skeptical;
        const duration = this.videoDurations[videoType] || 20000;
        
        return {
            url: videoUrl,
            duration: duration,
            type: videoType,
            success: true
        };
    },
    
    // ===================================================
    // 7. METADATA
    // ===================================================
    __version: "3.0-groups-template",
    __generated: new Date().toISOString(),
    __notes: "Clean template for testimonial groups system"
};

// ===================================================
// INITIALIZATION
// ===================================================
console.log('🎬 Testimonials Data Template Loaded');
console.log('📁 Available video types:', Object.keys(window.testimonialData.videoUrls));
console.log('💡 Add groups and testimonials through the management interface');
console.log('💾 This file will be updated when you click "Download JS File"');

// Make sure the data is available globally
if (typeof window !== 'undefined') {
    window.testimonialData = window.testimonialData;
}