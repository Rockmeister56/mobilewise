// ===================================================
// 🎬 MOBILE-WISE AI TESTIMONIALS DATA
// Complete working version with AI + Video integration
// ===================================================

window.testimonialData = {

    // ===================================================
    // VIDEO URLS (CRITICAL - FROM TESTIMONIAL PLAYER)
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
    // UNIVERSAL CONCERNS (WITH VIDEO TYPE MAPPING)
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
                'not sure if i can trust',
                'trust issues',
                'can i trust',
                'is this trustworthy',
                'skeptical'
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
        
        results: {
            title: 'See The Results Others Got',
            icon: '📈',
            videoType: 'convinced',  // CHANGED from 'results' to match videoUrls
            phrases: [
                'does it work',
                'effective',
                'results',
                'outcomes',
                'success',
                'improvement'
            ],
            reviews: [
                {
                    text: "Exceeded all our expectations. Results were better than promised.",
                    author: "Michael T.",
                    videoType: "convinced"
                },
                {
                    text: "We saw a 40% improvement in just 30 days. Incredible results.",
                    author: "Jennifer K.",
                    videoType: "convinced"
                },
                {
                    text: "The outcomes were transformative for our business.",
                    author: "Robert P.",
                    videoType: "convinced"
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
        if (this.industries[industrySlug]) {
            return {
                industry: this.industries[industrySlug].name,
                icon: this.industries[industrySlug].icon,
                concerns: {
                    ...this.industries[industrySlug].concerns,
                    ...this.concerns
                }
            };
        }
        
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
        
        if (this.concerns) {
            for (const [concernKey, concernData] of Object.entries(this.concerns)) {
                if (!concernData.reviews || concernData.reviews.length === 0) {
                    continue;
                }
                
                // Check phrases
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
                
                // Check keywords as fallback
                const keywords = {
                    trust: ['trust', 'skeptical', 'believe', 'reliable', 'scam', 'doubt'],
                    results: ['result', 'work', 'effective', 'outcome', 'success', 'improve'],
                    price: ['expensive', 'cost', 'price', 'budget', 'afford', 'value'],
                    time: ['time', 'long', 'quick', 'fast', 'speed', 'minutes'],
                    general: ['unsure', 'fence', 'convince', 'decide', 'mixed']
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
    // VIDEO PLAYER INTEGRATION FUNCTIONS
    // ===================================================
    playTestimonialVideo: function(videoType) {
        console.log('🎬 Getting video for type:', videoType);
        
        // Validate videoType
        if (!videoType || typeof videoType !== 'string') {
            console.warn('⚠️ Invalid videoType, using skeptical');
            videoType = 'skeptical';
        }
        
        // Check if video type exists
        if (!this.videoUrls || !this.videoUrls[videoType]) {
            console.warn(`⚠️ No video URL for "${videoType}", available types:`, Object.keys(this.videoUrls || {}));
            
            // Try fallback types
            const fallbackOrder = ['skeptical', 'speed', 'convinced', 'excited'];
            for (const fallback of fallbackOrder) {
                if (this.videoUrls && this.videoUrls[fallback]) {
                    console.log(`   Using fallback: ${fallback}`);
                    videoType = fallback;
                    break;
                }
            }
        }
        
        const videoUrl = this.videoUrls?.[videoType];
        const duration = this.videoDurations?.[videoType];
        
        if (!videoUrl) {
            console.error('❌ No video URL available at all!');
            return null;
        }
        
        return {
            url: videoUrl,
            duration: duration || 20000,
            type: videoType,
            success: true
        };
    },
    
    getCompleteTestimonial: function(userMessage) {
        console.log('🔍 Finding complete testimonial for:', userMessage);
        
        // Get AI result
        const aiResult = this.findRelevantTestimonial(userMessage);
        if (!aiResult) {
            console.log('❌ No AI result');
            return null;
        }
        
        console.log('✅ AI found:', aiResult.concern, 'videoType:', aiResult.videoType);
        
        // Get video
        const videoData = this.playTestimonialVideo(aiResult.videoType);
        
        if (!videoData) {
            console.error('❌ No video data');
            return null;
        }
        
        // Return complete package
        return {
            ...aiResult,
            video: videoData,
            timestamp: new Date().toISOString(),
            status: 'complete'
        };
    },

    // ===================================================
    // VIDEO PLAYER CONFIGURATION
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
    // INITIALIZATION
    // ===================================================
    currentIndustry: null,
    
    __loadedFromFile: true,
    __version: "5.0-complete-" + new Date().toISOString().split('T')[0]
};
// ===================================================
// END OF window.testimonialData OBJECT
// ===================================================

console.log('✅ Testimonials Data Loaded:', Object.keys(window.testimonialData.concerns).length, 'concern types');
console.log('✅ Video URLs loaded:', Object.keys(window.testimonialData.videoUrls).length);
console.log('✅ AI Functions: findRelevantTestimonial, playTestimonialVideo, getCompleteTestimonial');
console.log('🎉 System ready! Connect to testimonial-player.js using getCompleteTestimonial()');