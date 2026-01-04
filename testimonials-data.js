// ===================================================
// 🎬 MOBILE-WISE AI TESTIMONIALS DATA
// Centralized testimonial content for all clients
// ===================================================

window.testimonialData = {
    
    // ===================================================
    // UNIVERSAL CONCERNS (Fallback for all industries)
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
                'budget constraints',
                'expensive for what you get',
                'can find cheaper elsewhere'
            ],
            reviews: [
                { 
                    text: "Worth every penny. The ROI was visible within the first month.", 
                    author: "John D.",
                    videoType: "skeptical"
                },
                { 
                    text: "Best investment we made this year. Price seemed high at first but value is clear.", 
                    author: "Sarah M.",
                    videoType: "skeptical"
                }
            ]
        },
        
        time: {
            title: 'Hear From Busy Professionals',
            icon: '⏰',
            videoType: 'speed',
            phrases: [
                'takes too long',
                'time-consuming process',
                'don\'t have time for this',
                'lengthy setup',
                'slow service',
                'delayed implementation'
            ],
            reviews: [
                { 
                    text: "Process was incredibly quick. Done in minutes, not hours.", 
                    author: "Emily R.",
                    videoType: "speed"
                },
                { 
                    text: "As a busy executive, I appreciated how streamlined everything was.", 
                    author: "David L.",
                    videoType: "speed"
                }
            ]
        },
        
        trust: {
            title: 'Real Client Experiences',
            icon: '🤝',
            videoType: 'skeptical',
            phrases: [
                'don\'t trust this',
                'scam warning',
                'not reliable',
                'questionable reputation',
                'heard bad things',
                'too good to be true',
                'not sure if i can trust', // ADDED: Better matching
                'trust issues', // ADDED: Better matching
                'can i trust', // ADDED: Better matching
                'is this trustworthy', // ADDED: Better matching
                'skeptical' // ADDED: Better matching
            ],
            reviews: [
                { 
                    text: "Results exceeded my expectations. They delivered exactly what they promised.", 
                    author: "Tom B.",
                    videoType: "skeptical"
                },
                { 
                    text: "I was skeptical at first, but they proved me wrong in the best way.", 
                    author: "Jessica W.",
                    videoType: "skeptical"
                }
            ]
        },
        
        general: {
            title: 'What Our Clients Say',
            icon: '⭐',
            videoType: 'skeptical',
            phrases: [
                'mixed reviews',
                'uncertain about this',
                'on the fence',
                'need convincing',
                'not sure about this'
            ],
            reviews: [
                { 
                    text: "Professional service exceeded expectations.", 
                    author: "Christopher N.",
                    videoType: "skeptical"
                },
                { 
                    text: "Highly recommend to anyone considering this.", 
                    author: "Amanda G.",
                    videoType: "skeptical"
                }
            ]
        },
        
        // ADDED: Missing "results" concern
        results: {
            title: 'See The Results Others Got',
            icon: '📈',
            videoType: 'results',
            phrases: [
                'does it work',
                'effective',
                'results',
                'outcomes',
                'success', // ADDED: Better matching
                'improvement' // ADDED: Better matching
            ],
            reviews: [  // ADDED: Was missing reviews array
                {
                    text: "Exceeded all our expectations. Results were better than promised.",
                    author: "Michael T.",
                    videoType: "results"
                },
                {
                    text: "We saw a 40% improvement in just 30 days. Incredible results.",
                    author: "Jennifer K.",
                    videoType: "results"
                },
                {
                    text: "The outcomes were transformative for our business.",
                    author: "Robert P.",
                    videoType: "results"
                }
            ]
        }
    },

    // ===================================================
    // INDUSTRY-SPECIFIC TESTIMONIALS (EMPTY - ADD YOUR OWN)
    // ===================================================
    industries: {},
    
    // ===================================================
    // INDUSTRY KEYWORDS FOR AUTO-DETECTION
    // ===================================================
    industryKeywords: {},
    
    // ===================================================
    // VIDEOS LIBRARY
    // ===================================================
    videos: {},

    // ===================================================
    // HELPER FUNCTIONS
    // ===================================================
    getIndustryTestimonials: function(industrySlug) {
        // Return industry-specific testimonials if available
        if (this.industries[industrySlug]) {
            return {
                industry: this.industries[industrySlug].name,
                icon: this.industries[industrySlug].icon,
                concerns: {
                    ...this.industries[industrySlug].concerns,
                    ...this.concerns // Merge with universal concerns
                }
            };
        }
        
        // Fallback to universal concerns for unknown industries
        return {
            industry: 'General Business',
            icon: '🏢',
            concerns: this.concerns
        };
    },

    getAllIndustries: function() {
        const industries = [];
        for (const [slug, data] of Object.entries(this.industries)) {
            industries.push({
                slug: slug,
                name: data.name,
                icon: data.icon
            });
        }
        // Add "General Business" option
        industries.unshift({
            slug: 'general',
            name: 'General Business',
            icon: '🏢'
        });
        return industries;
    },
    
    getIndustry: function(slug) {
        return this.industries[slug] || null;
    },

    // ===================================================
    // 🎯 AI INTEGRATION - FIND MATCHING TESTIMONIALS
    // ===================================================
    findRelevantTestimonial: function(userMessage) {
        console.log('🎯 AI Matching for:', userMessage.substring(0, 50));
        
        const message = userMessage.toLowerCase();
        
        // 1. First check exact phrase matches
        if (this.concerns) {
            for (const [concernKey, concernData] of Object.entries(this.concerns)) {
                // Skip concerns with no reviews
                if (!concernData.reviews || concernData.reviews.length === 0) {
                    continue;
                }
                
                // Check each phrase
                if (concernData.phrases && Array.isArray(concernData.phrases)) {
                    for (const phrase of concernData.phrases) {
                        if (phrase && message.includes(phrase.toLowerCase())) {
                            console.log('✅ Matched phrase:', phrase, 'in', concernData.title);
                            
                            const randomReview = concernData.reviews[Math.floor(Math.random() * concernData.reviews.length)];
                            return {
                                type: 'universal',
                                concern: concernData.title,
                                review: randomReview.text,
                                author: randomReview.author,
                                icon: concernData.icon,
                                videoType: concernData.videoType
                            };
                        }
                    }
                }
                
                // 2. Also check for keyword matches (SMARTER MATCHING)
                const keywords = {
                    trust: ['trust', 'skeptical', 'believe', 'reliable', 'scam', 'doubt', 'confidence'],
                    results: ['result', 'work', 'effective', 'outcome', 'success', 'improve', 'achievement'],
                    price: ['expensive', 'cost', 'price', 'budget', 'afford', 'value', 'money'],
                    time: ['time', 'long', 'quick', 'fast', 'speed', 'minutes', 'hours', 'duration'],
                    general: ['unsure', 'fence', 'convince', 'decide', 'mixed', 'certain', 'opinion']
                };
                
                if (keywords[concernKey]) {
                    for (const keyword of keywords[concernKey]) {
                        if (message.includes(keyword)) {
                            console.log('✅ Matched keyword:', keyword, 'for', concernKey);
                            
                            const randomReview = concernData.reviews[Math.floor(Math.random() * concernData.reviews.length)];
                            return {
                                type: 'universal',
                                concern: concernData.title,
                                review: randomReview.text,
                                author: randomReview.author,
                                icon: concernData.icon,
                                videoType: concernData.videoType
                            };
                        }
                    }
                }
            }
        }
        
        console.log('❌ No testimonial match found');
        return null;
    },

    // ===================================================
    // VIDEO PLAYER CONFIGURATION
    // ===================================================
    playerConfig: {
        desktop: {
            width: 854,  // Updated to 16:9
            height: 480, // Updated to 16:9  
            top: '50%',
            left: '50%',
            borderRadius: '12px'
        },
        mobile: {
            fullscreen: true
        },
        overlay: {
            background: 'rgba(0, 0, 0, 0.5)' // 50% black
        },
        resumeMessage: "I'm sure you can appreciate what our clients have to say. So let's get back on track with helping you sell your practice. Would you like a free consultation with Bruce that can analyze your particular situation?"
    },
    
    // ===================================================
    // METADATA
    // ===================================================
    __loadedFromFile: true,
    __version: "4.0-ai-enhanced-" + new Date().toISOString().split('T')[0]
};
// ===================================================
// END OF window.testimonialData OBJECT
// ===================================================

console.log('✅ Testimonials Data Loaded:', Object.keys(window.testimonialData.concerns).length, 'concern types');
console.log('✅ Industries Loaded:', Object.keys(window.testimonialData.industries).length, 'industry types');