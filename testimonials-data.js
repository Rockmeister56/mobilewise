// ===================================================
// 🎬 TESTIMONIALS DATA - COMPLETELY CLEAN TEMPLATE
// ===================================================
// This is a completely clean template with NO references to any existing videos
// ===================================================

window.testimonialData = {
    // ===================================================
    // 1. VIDEO URLS - PLACEHOLDERS ONLY
    // ===================================================
    videoUrls: {
        // THESE ARE EMPTY PLACEHOLDERS - Replace with your own video URLs
        // These represent different facial expression types, not actual testimonials
        skeptical: '',
        speed: '', 
        convinced: '',
        excited: ''
    },
    
    videoDurations: {
        // Placeholder durations (in milliseconds)
        skeptical: 20000,
        speed: 20000, 
        convinced: 20000,
        excited: 20000
    },
    
    // ===================================================
    // 2. CONCERNS TEMPLATE
    // ===================================================
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
    // 3. TESTIMONIAL GROUPS (COMPLETELY EMPTY)
    // ===================================================
    testimonialGroups: {
        // EMPTY - Will be populated through your interface
    },
    
    // ===================================================
    // 4. STATISTICS (ALL ZERO)
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
        console.log('🔍 Finding testimonial for:', userMessage.substring(0, 50));
        
        // No testimonials exist yet
        return this.getFallbackTestimonial();
    },
    
    formatTestimonialResponse: function(testimonial, group) {
        // This will be used when you add testimonials
        const concernData = this.concerns[testimonial.concernType] || { title: 'Customer Feedback', icon: '⭐', videoType: 'skeptical' };
        
        return {
            concern: concernData.title,
            review: testimonial.text || testimonial.title,
            author: testimonial.author || 'Satisfied Customer',
            icon: concernData.icon,
            videoType: concernData.videoType,
            video: {
                url: testimonial.videoUrl || this.videoUrls[concernData.videoType] || '',
                duration: this.videoDurations[concernData.videoType] || 20000
            },
            group: group ? group.name : 'General',
            timestamp: testimonial.addedAt || new Date().toISOString()
        };
    },
    
    getFallbackTestimonial: function() {
        return {
            concern: "Customer Satisfaction",
            review: "Add your testimonials through the management interface.",
            author: "Your Future Client",
            icon: "⭐",
            videoType: "skeptical",
            video: {
                url: '', // EMPTY - no video
                duration: 20000
            },
            group: "General",
            timestamp: new Date().toISOString()
        };
    },
    
    // ===================================================
    // 7. PLAYER INTEGRATION FUNCTIONS
    // ===================================================
    getConcernTestimonials: function(concernKey) {
        return []; // Empty - no testimonials yet
    },
    
    getAvailableConcerns: function() {
        const concerns = [];
        for (const [key, data] of Object.entries(this.concerns)) {
            concerns.push({
                key: key,
                title: data.title,
                icon: data.icon,
                videoType: data.videoType
            });
        }
        return concerns;
    },
    
    playTestimonialVideo: function(videoType) {
        return {
            url: '', // EMPTY - no video
            duration: 20000,
            type: videoType,
            success: false,
            message: "No video URL configured"
        };
    },
    
    // ===================================================
    // 8. METADATA
    // ===================================================
    __version: "3.0-completely-clean",
    __generated: new Date().toISOString(),
    __notes: "COMPLETELY CLEAN - No video URLs, no testimonials, no groups"
};

// ===================================================
// INITIALIZATION
// ===================================================
console.log('✅ COMPLETELY CLEAN Testimonials Template Loaded');
console.log('📁 testimonialGroups: EMPTY');
console.log('🎬 Video URLs: EMPTY PLACEHOLDERS');
console.log('📊 Statistics: 0 groups, 0 videos, 0 views');
console.log('💾 Add your video URLs and testimonials through the interface');

if (typeof window !== 'undefined') {
    window.testimonialData = window.testimonialData;
}