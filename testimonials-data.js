// MINIMAL CLEAN testimonials-data.js
// Upload this to Netlify

window.testimonialData = {
    // Core data structures (all empty)
    industries: {},
    industryKeywords: {},
    videos: {},
    
    // Universal concerns (minimal set)
    concerns: {
        price: {
            title: 'Price Concerns',
            icon: '💰',
            videoType: 'skeptical',
            phrases: ['expensive', 'cost', 'price', 'budget']
        },
        time: {
            title: 'Time Concerns', 
            icon: '⏰',
            videoType: 'speed',
            phrases: ['takes too long', 'slow', 'time', 'waiting']
        }
    },
    
    // Player config
    playerConfig: {
        autoPlay: false,
        loop: true,
        controls: true
    },
    
    // Metadata
    __loadedFromFile: true,
    __version: "clean-" + new Date().toISOString().split('T')[0]
};

// Add helper methods
window.testimonialData.getAllIndustries = function() {
    return Object.keys(this.industries || {});
};

window.testimonialData.getIndustry = function(slug) {
    return this.industries?.[slug] || null;
};