/**
 * NCI AI VOICE BOT - JAVASCRIPT FUNCTIONALITY
 * Professional Template System
 * 
 * This file contains all the interactive functionality
 * for the NCI AI Voice Bot template system.
 */

// ===========================================
// GLOBAL VARIABLES AND CONFIGURATION
// ===========================================

const VoiceBot = {
    // Configuration
    config: {
        voiceEnabled: false,
        currentSlide: 'voice-chat',
        mobileBreakpoint: 768,
        avatarVideoPlayed: false,
        
        // Client Customization Variables
        clientName: 'New Clients Inc',
        primaryColor: '#2196F3',
        secondaryColor: '#4CAF50',
        
        // API Endpoints (to be configured per client)
        apiEndpoints: {
            vapi: 'https://na-vg-edge.moeaymandev.workers.dev',
            twilio: '+1 949 881 6456',
            workspace: 'vg_RBYIuhZPlUniit68ypYz'
        }
    },

    // DOM Elements
    elements: {
        hamburger: null,
        sidebar: null,
        mainArea: null,
        slideContent: null,
        menuItems: null,
        avatarVideo: null,
        staticAvatar: null
    },

    // Initialize the voice bot
    init() {
        console.log('🚀 NCI Voice Bot Initializing...');
        this.cacheDOMElements();
        this.bindEvents();
        this.setupResponsive();
        this.setupAvatarVideo();
        this.loadSlide('voice-chat');
        console.log('✅ NCI Voice Bot Ready!');
    },

    // Cache DOM elements for performance
    cacheDOMElements() {
        this.elements.hamburger = document.getElementById('hamburger');
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.mainArea = document.getElementById('mainArea');
        this.elements.slideContent = document.getElementById('slideContent');
        this.elements.menuItems = document.querySelectorAll('.menu-item');
        this.elements.avatarVideo = document.getElementById('avatarVideo');
        this.elements.staticAvatar = document.getElementById('staticAvatar');
    }
};

// ===========================================
// AVATAR VIDEO FUNCTIONALITY
// ===========================================

VoiceBot.setupAvatarVideo = function() {
    if (this.elements.avatarVideo) {
        // Play video on load
        this.elements.avatarVideo.play().catch(error => {
            console.log('Auto-play blocked, showing static avatar');
            this.showStaticAvatar();
        });

        // Handle video end
        this.elements.avatarVideo.addEventListener('ended', () => {
            this.showStaticAvatar();
        });

        // Handle video error
        this.elements.avatarVideo.addEventListener('error', () => {
            console.log('Video error, showing static avatar');
            this.showStaticAvatar();
        });
    }
};

// Global function for video onended (called from HTML)
function showStaticAvatar() {
    VoiceBot.showStaticAvatar();
}

VoiceBot.showStaticAvatar = function() {
    if (this.elements.avatarVideo && this.elements.staticAvatar) {
        this.elements.avatarVideo.style.display = 'none';
        this.elements.staticAvatar.style.display = 'block';
        this.config.avatarVideoPlayed = true;
        console.log('👤 Switched to static avatar');
    }
};

// ===========================================
// EVENT BINDING AND HANDLERS
// ===========================================

VoiceBot.bindEvents = function() {
    // Hamburger menu toggle
    if (this.elements.hamburger) {
        this.elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Menu item clicks
    this.elements.menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const slideType = item.dataset.slide;
            this.loadSlide(slideType);
            this.setActiveMenuItem(item);
            this.closeMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!this.elements.sidebar.contains(e.target) && 
            !this.elements.hamburger.contains(e.target)) {
            this.closeMobileMenu();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
};

// ===========================================
// MOBILE MENU FUNCTIONALITY
// ===========================================

VoiceBot.toggleMobileMenu = function() {
    this.elements.sidebar.classList.toggle('active');
    this.elements.hamburger.classList.toggle('active');
};

VoiceBot.closeMobileMenu = function() {
    this.elements.sidebar.classList.remove('active');
    this.elements.hamburger.classList.remove('active');
};

VoiceBot.openMobileMenu = function() {
    this.elements.sidebar.classList.add('active');
    this.elements.hamburger.classList.add('active');
};

// ===========================================
// SLIDE MANAGEMENT SYSTEM
// ===========================================

VoiceBot.loadSlide = function(slideType) {
    console.log(`📄 Loading slide: ${slideType}`);
    this.config.currentSlide = slideType;
    
    // Add fade out effect
    this.elements.slideContent.style.opacity = '0';
    
    setTimeout(() => {
        // Generate slide content based on type
        const slideHTML = this.generateSlideContent(slideType);
        this.elements.slideContent.innerHTML = slideHTML;
        
        // Add fade in effect
        this.elements.slideContent.style.opacity = '1';
        
        // Bind new event listeners for the loaded slide
        this.bindSlideEvents(slideType);
        
    }, 200);
};

VoiceBot.generateSlideContent = function(slideType) {
    const slides = {
        'voice-chat': this.generateVoiceChatSlide(),
        'request-call': this.generateRequestCallSlide(),
        'send-message': this.generateSendMessageSlide(),
        'leave-review': this.generateLeaveReviewSlide()
    };
    
    return slides[slideType] || slides['voice-chat'];
};

VoiceBot.generateVoiceChatSlide = function() {
    return `
        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1755253677674_slide1-graphic.PNG" 
             alt="Voice Activation" 
             class="slide-graphic glow">
        
        <button class="activate-mic-btn pulse" id="activateMicBtn" onclick="VoiceBot.activateMicrophone()">
            🎤 ACTIVATE MIC HERE
        </button>
        
        <p class="instruction-text">
            Click the microphone to start<br>
            your AI voice conversation
        </p>
    `;
};

VoiceBot.generateRequestCallSlide = function() {
    return `
        <div style="text-align: center; width: 100%;">
            <h2 style="color: white; margin-bottom: 30px; font-size: 24px;">📞 Request a Call</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; max-width: 400px; margin: 0 auto;">
                <form id="requestCallForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="text" placeholder="Your Name" required 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <input type="tel" placeholder="Phone # to Call" required 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <input type="text" placeholder="Best time to call?" 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <button type="submit" 
                            style="background: linear-gradient(45deg, #2196F3, #4CAF50); color: white; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                        REQUEST A CALL
                    </button>
                </form>
            </div>
        </div>
    `;
};

VoiceBot.generateSendMessageSlide = function() {
    return `
        <div style="text-align: center; width: 100%;">
            <h2 style="color: white; margin-bottom: 30px; font-size: 24px;">💬 Send Message</h2>
            <div style="display: flex; flex-direction: column; gap: 20px; max-width: 400px; margin: 0 auto;">
                <button onclick="VoiceBot.selectMessageType('general')" 
                        style="background: linear-gradient(45deg, #2196F3, #1976D2); color: white; border: none; padding: 20px; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.3s ease;">
                    📝 Select for General Messages
                </button>
                <button onclick="VoiceBot.selectMessageType('business')" 
                        style="background: linear-gradient(45deg, #4CAF50, #388E3C); color: white; border: none; padding: 20px; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.3s ease;">
                    💼 Select for Business Interview
                </button>
            </div>
        </div>
    `;
};

VoiceBot.generateLeaveReviewSlide = function() {
    return `
        <div style="text-align: center; width: 100%;">
            <h2 style="color: white; margin-bottom: 30px; font-size: 24px;">⭐ Leave a Review</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; max-width: 450px; margin: 0 auto;">
                <p style="color: white; margin-bottom: 20px; font-size: 16px;">Share your experience with our services</p>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button onclick="VoiceBot.startVideoReview(1)" 
                            style="background: #2196F3; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                        📹 Q-1 START
                    </button>
                    <p style="color: #ccc; font-size: 14px; margin: 0;">What business challenges were you facing?</p>
                    
                    <button onclick="VoiceBot.stopRecording()" 
                            style="background: #f44336; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                        ⏹️ STOP
                    </button>
                    
                    <button onclick="VoiceBot.finishReview()" 
                            style="background: #4CAF50; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                        ✅ All Done!
                    </button>
                </div>
            </div>
        </div>
    `;
};

// ===========================================
// MENU MANAGEMENT
// ===========================================

VoiceBot.setActiveMenuItem = function(activeItem) {
    // Remove active class from all items
    this.elements.menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected item
    activeItem.classList.add('active');
};

// ===========================================
// VOICE FUNCTIONALITY (PLACEHOLDER FOR NOW)
// ===========================================

VoiceBot.activateMicrophone = function() {
    console.log('🎤 Microphone clicked - Playing avatar video with audio');
    
    // Show and play avatar video with audio
    const video = this.elements.avatarVideo;
    const staticAvatar = this.elements.staticAvatar;
    
    if (video) {
        // Hide static avatar, show video
        staticAvatar.style.display = 'none';
        video.style.display = 'block';
        
        // Play with audio (user clicked, so browsers allow it)
        video.muted = false;
        video.currentTime = 0; // Start from beginning
        
        video.play()
            .then(() => {
                console.log('🔊 Avatar speaking with audio!');
                // TODO: Add voice recognition here after video ends
            })
            .catch(error => {
                console.log('Video playback failed:', error);
                // Fallback to static avatar
                this.showStaticAvatar();
            });
    }
};

// ===========================================
// FORM HANDLING
// ===========================================

VoiceBot.bindSlideEvents = function(slideType) {
    switch (slideType) {
        case 'request-call':
            const callForm = document.getElementById('requestCallForm');
            if (callForm) {
                callForm.addEventListener('submit', (e) => this.handleCallRequest(e));
            }
            break;
    }
};

VoiceBot.handleCallRequest = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('📞 Call request submitted:', data);
    
    // TODO: Integration with VAPI/Twilio
    alert('Call request submitted! We will contact you soon.');
    
    // Reset form
    e.target.reset();
};

VoiceBot.selectMessageType = function(type) {
    console.log('💬 Message type selected:', type);
    
    if (type === 'general') {
        this.loadGeneralMessageForm();
    } else if (type === 'business') {
        this.loadBusinessInterviewForm();
    }
};

VoiceBot.loadGeneralMessageForm = function() {
    const content = `
        <div style="text-align: center; width: 100%;">
            <h2 style="color: white; margin-bottom: 30px; font-size: 24px;">📝 General Message</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; max-width: 450px; margin: 0 auto;">
                <form id="generalMessageForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <textarea placeholder="Share your thoughts, questions, or feedback..." required 
                              style="padding: 15px; border: none; border-radius: 8px; font-size: 14px; resize: vertical; min-height: 120px; font-family: inherit;"></textarea>
                    <input type="text" placeholder="Your Name" required 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <input type="email" placeholder="Your email address" required 
                           style="padding: 12px; border: none; border-radius: 8px; font-size: 16px;">
                    <button type="submit" 
                            style="background: linear-gradient(45deg, #4CAF50, #388E3C); color: white; border: none; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px;">
                        SEND MESSAGE
                    </button>
                </form>
            </div>
        </div>
    `;
    
    this.elements.slideContent.innerHTML = content;
    
    // Bind form submission
    setTimeout(() => {
        const form = document.getElementById('generalMessageForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleGeneralMessage(e));
        }
    }, 100);
};

VoiceBot.loadBusinessInterviewForm = function() {
    // Business interview functionality
    alert('Business interview functionality will be added in next phase!');
};

VoiceBot.handleGeneralMessage = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('📧 General message submitted:', data);
    alert('Message sent successfully! We will get back to you soon.');
    
    e.target.reset();
};

// ===========================================
// VIDEO TESTIMONIAL FUNCTIONALITY
// ===========================================

VoiceBot.startVideoReview = function(questionNumber) {
    console.log(`📹 Starting video review for question ${questionNumber}`);
    alert(`Starting video recording for question ${questionNumber}. (Video functionality will be implemented in next phase)`);
};

VoiceBot.stopRecording = function() {
    console.log('⏹️ Stopping video recording');
    alert('Video recording stopped.');
};

VoiceBot.finishReview = function() {
    console.log('✅ Finishing video review');
    alert('Thank you for your review! Your videos will be processed shortly.');
};

function testAvatarVideo() {
    console.log('Testing avatar video...');
    const video = document.getElementById('avatarVideo');
    const img = document.getElementById('staticAvatar');
    
    if (video && img) {
        img.style.display = 'none';
        video.style.display = 'block';
        video.play();
        console.log('Video should be playing now');
    } else {
        console.log('Elements not found!', {video, img});
    }
}

// ===========================================
// RESPONSIVE AND UTILITY FUNCTIONS
// ===========================================

VoiceBot.setupResponsive = function() {
    // Handle window resize
    window.addEventListener('resize', () => {
        this.handleResize();
    });
    
    // Initial responsive setup
    this.handleResize();
};

VoiceBot.handleResize = function() {
    const width = window.innerWidth;
    
    if (width <= this.config.mobileBreakpoint) {
        // Mobile mode
        this.closeMobileMenu();
    } else {
        // Desktop mode
        this.elements.sidebar.classList.remove('active');
        this.elements.hamburger.classList.remove('active');
    }
};

VoiceBot.handleKeyboardShortcuts = function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        this.closeMobileMenu();
    }
};

// ===========================================
// CLIENT CUSTOMIZATION FUNCTIONS
// ===========================================

VoiceBot.customizeForClient = function(clientConfig) {
    // Update client-specific configuration
    if (clientConfig.name) this.config.clientName = clientConfig.name;
    if (clientConfig.primaryColor) this.config.primaryColor = clientConfig.primaryColor;
    if (clientConfig.secondaryColor) this.config.secondaryColor = clientConfig.secondaryColor;
    if (clientConfig.logo) this.updateLogo(clientConfig.logo);
    if (clientConfig.avatar) this.updateAvatar(clientConfig.avatar);
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--primary-color', this.config.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', this.config.secondaryColor);
    
    console.log('🎨 Client customization applied:', clientConfig);
};

// ===========================================
// AVATAR AUDIO HANDLING
// ===========================================

VoiceBot.enableAudioAndReplay = function() {
    const video = this.elements.avatarVideo;
    if (video && video.muted) {
        video.muted = false;
        video.currentTime = 0; // Restart from beginning
        video.play()
            .then(() => {
                console.log('🔊 Audio enabled - video replaying with sound');
            })
            .catch(error => {
                console.log('Audio playback failed:', error);
                video.muted = true; // Fallback to muted
            });
    }
};

// Global function for HTML onclick
function enableAudioAndReplay() {
    VoiceBot.enableAudioAndReplay();
}

VoiceBot.updateLogo = function(logoUrl) {
    const logo = document.querySelector('.nci-logo');
    if (logo) {
        logo.src = logoUrl;
    }
};

VoiceBot.updateAvatar = function(avatarUrl) {
    const avatar = document.querySelector('.avatar-img');
    if (avatar) {
        avatar.src = avatarUrl;
    }
};

// ===========================================
// INITIALIZATION
// ===========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    VoiceBot.init();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', VoiceBot.init.bind(VoiceBot));
} else {
    VoiceBot.init();
}

// Export for global access (if needed)
window.VoiceBot = VoiceBot;

console.log('📁 NCI Voice Bot JavaScript Loaded Successfully!');