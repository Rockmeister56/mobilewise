// ===================================================
// 🎬 MOBILE-WISE AI TESTIMONIALS DATA
// Centralized testimonial content for all clients
// ===================================================

window.testimonialData = {
    
    // ===================================================
    // VIDEO TESTIMONIALS (Bruce's Avatar Videos)
    // ===================================================
    videos: {
        skeptical: {
            url: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4",
            title: "Skeptical, Then Exceeded Expectations",
            duration: 12000
        },
        speed: {
            url: "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4",
            title: "Surprised by the Speed of the Sale",
            duration: 12000
        }
    },
    
    // ===================================================
    // TEXT TESTIMONIALS BY CONCERN TYPE
    // ===================================================
    concerns: {
        price: {
            title: 'See What Others Say About Value',
            icon: '💰',
            videoType: 'skeptical', // Links to video above
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
                },
                { 
                    text: "The results justified the cost ten times over.", 
                    author: "Mike T.",
                    videoType: "skeptical"
                }
            ]
        },
        
        time: {
            title: 'Hear From Busy Professionals',
            icon: '⏰',
            videoType: 'speed',
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
                },
                { 
                    text: "Fit perfectly into my packed schedule.", 
                    author: "Lisa K.",
                    videoType: "speed"
                }
            ]
        },
        
        trust: {
            title: 'Real Client Experiences',
            icon: '🤝',
            videoType: 'skeptical',
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
                },
                { 
                    text: "Couldn't be happier with the outcome. Wish I'd done this sooner.", 
                    author: "Robert C.",
                    videoType: "skeptical"
                }
            ]
        },
        
        general: {
            title: 'What Our Clients Say',
            icon: '⭐',
            videoType: 'skeptical',
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
                },
                { 
                    text: "Results speak for themselves. Very satisfied.", 
                    author: "Daniel P.",
                    videoType: "skeptical"
                }
            ]
        }
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

console.log('✅ Testimonials Data Loaded:', Object.keys(window.testimonialData.videos).length, 'videos,', Object.keys(window.testimonialData.concerns).length, 'concern types');