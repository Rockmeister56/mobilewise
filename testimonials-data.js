// ===================================================
// 🎬 MOBILE-WISE AI TESTIMONIALS DATA
// Centralized testimonial content for all clients
// ===================================================

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
                'too good to be true'
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
        }
    },

    // ===================================================
    // INDUSTRY-SPECIFIC TESTIMONIALS (NEW SECTION)
    // ===================================================
    industries: {},

    // ===================================================
    // HELPER FUNCTIONS (NEW)
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
    }
};

console.log('✅ Testimonials Data Loaded:', Object.keys(window.testimonialData.concerns).length, 'concern types');
console.log('✅ Industries Loaded:', Object.keys(window.testimonialData.industries).length, 'industry types');
