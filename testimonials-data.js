// 🧹 CLEAN TESTIMONIALS DATA FILE
// Upload this to Netlify to replace the existing one

window.testimonialData = {
    // ===================================================
    // UNIVERSAL CONCERNS
    // ===================================================
    concerns: {
        price: {
            title: 'See What Others Say About Value',
            icon: '💰',
            videoType: 'skeptical',
            phrases: [
                'too expensive',
                'high cost',
                'not worth the price',
                'budget constraints'
            ]
        },
        time: {
            title: 'See How Others Saved Time',
            icon: '⏰',
            videoType: 'speed',
            phrases: [
                'takes too long',
                'time consuming',
                'lengthy process',
                'waste of time'
            ]
        },
        trust: {
            title: 'See Why Others Trusted Us',
            icon: '🤝',
            videoType: 'skeptical',
            phrases: [
                'not trustworthy',
                'scam',
                'doubtful',
                'skeptical'
            ]
        },
        results: {
            title: 'See The Results Others Got',
            icon: '📈',
            videoType: 'results',
            phrases: [
                'does it work',
                'effective',
                'results',
                'outcomes'
            ]
        }
    },
    
    // ===================================================
    // INDUSTRIES (EMPTY - Add your own)
    // ===================================================
    industries: {},
    
    // ===================================================
    // KEYWORDS FOR AUTO-DETECTION
    // ===================================================
    industryKeywords: {},
    
    // ===================================================
    // ALL VIDEOS
    // ===================================================
    videos: {},
    
    // ===================================================
    // PLAYER CONFIGURATION
    // ===================================================
    playerConfig: {
        autoPlay: false,
        loop: true,
        controls: true,
        muted: false,
        preload: 'auto',
        responsive: true
    },
    
    // ===================================================
    // METADATA
    // ===================================================
    __loadedFromFile: true,
    __version: "3.0-clean"
};