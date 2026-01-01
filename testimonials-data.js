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
    industries: {
        // ======================
        // FINANCIAL SERVICES
        // ======================
        'mortgage-lending': {
            name: 'Mortgage & Lending',
            icon: '🏠',
            concerns: {
                'rate-anxiety': {
                    title: 'Worried About Interest Rates?',
                    icon: '📈',
                    videoType: 'rate-anxiety',
                    phrases: [
                        'rates are too high',
                        'waiting for rates to drop',
                        'afraid of locking in wrong rate',
                        'timing the market',
                        'missed better rates earlier'
                    ],
                    reviews: [
                        { text: "They helped me lock in at the perfect time. Saved me $300/month!", author: "James R.", videoType: "rate-anxiety" },
                        { text: "I was paralyzed by rate fears until they walked me through the data.", author: "Maria S.", videoType: "rate-anxiety" }
                    ]
                },
                'paperwork-frustration': {
                    title: 'Paperwork Overwhelm',
                    icon: '😫',
                    videoType: 'mortgage-forms-pain',
                    phrases: [
                        'too much paperwork',
                        'complicated application',
                        'document overload',
                        'financial disclosure stressful',
                        'forms never end'
                    ],
                    reviews: [
                        { text: "They made the paperwork process surprisingly simple and fast.", author: "Robert K.", videoType: "mortgage-forms-pain" },
                        { text: "Digital docs made everything so much easier than expected.", author: "Lisa T.", videoType: "mortgage-forms-pain" }
                    ]
                }
            }
        },

        'personal-injury': {
            name: 'Personal Injury Law',
            icon: '⚖️',
            concerns: {
                'cost-worries': {
                    title: 'Can I Afford a Lawyer?',
                    icon: '💸',
                    videoType: 'skeptical',
                    phrases: [
                        'lawyers are too expensive',
                        'can\'t afford legal fees',
                        'what if I lose and owe money',
                        'upfront costs scary',
                        'contingency confusing'
                    ],
                    reviews: [
                        { text: "No money upfront. They only get paid when I get paid.", author: "Carrie M.", videoType: "skeptical" },
                        { text: "Their contingency fee structure made it risk-free for me.", author: "Kevin T.", videoType: "skeptical" }
                    ]
                },
                'outcome-uncertainty': {
                    title: 'Will I Actually Win?',
                    icon: '❓',
                    videoType: 'skeptical',
                    phrases: [
                        'not sure if I have a case',
                        'what if I don\'t win anything',
                        'case might be too small',
                        'insurance might not pay',
                        'is it worth pursuing'
                    ],
                    reviews: [
                        { text: "They gave me honest assessment from day one - no false promises.", author: "Richard H.", videoType: "skeptical" },
                        { text: "Won my case when I thought I had no chance.", author: "Patricia D.", videoType: "skeptical" }
                    ]
                }
            }
        },

        'real-estate': {
            name: 'Real Estate',
            icon: '🏡',
            concerns: {
                'market-timing': {
                    title: 'Market Timing Fears',
                    icon: '📅',
                    videoType: 'skeptical',
                    phrases: [
                        'buying at market peak',
                        'prices might drop soon',
                        'wrong time to sell',
                        'waiting for market to improve',
                        'bubble concerns'
                    ],
                    reviews: [
                        { text: "Their market analysis showed it was the perfect time to buy for my situation.", author: "Thomas R.", videoType: "skeptical" },
                        { text: "Sold at peak price while others were waiting.", author: "Laura K.", videoType: "skeptical" }
                    ]
                }
            }
        },

        'dentistry': {
            name: 'Dentistry',
            icon: '🦷',
            concerns: {
                'pain-fears': {
                    title: 'Fear of Dental Pain',
                    icon: '😬',
                    videoType: 'skeptical',
                    phrases: [
                        'dentist visits painful',
                        'needle phobia',
                        'drill sounds scary',
                        'past traumatic experiences',
                        'avoiding dentist due to fear'
                    ],
                    reviews: [
                        { text: "Most pain-free dental experience I've ever had. Seriously.", author: "Karen W.", videoType: "skeptical" },
                        { text: "Sedation options made my root canal actually comfortable.", author: "David F.", videoType: "skeptical" }
                    ]
                }
            }
        },

        'plastic-surgery': {
            name: 'Plastic Surgery',
            icon: '👨‍⚕️',
            concerns: {
                'safety-fears': {
                    title: 'Surgery Safety Concerns',
                    icon: '⚠️',
                    videoType: 'skeptical',
                    phrases: [
                        'surgery too risky',
                        'anesthesia complications',
                        'botched procedure fears',
                        'recovery horror stories',
                        'scarring concerns'
                    ],
                    reviews: [
                        { text: "Board certified and impeccable safety record. Felt completely secure.", author: "Amanda L.", videoType: "skeptical" },
                        { text: "Their before/after gallery of real patients convinced me of their skill.", author: "Robert C.", videoType: "skeptical" }
                    ]
                }
            }
        }
    },

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
