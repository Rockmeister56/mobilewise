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

// ===========================================
// ELEVENLABS CONFIGURATION - TEMPORARILY DISABLED
// ===========================================
// const ELEVENLABS_API_KEY = 'sk_9e7fa2741be74e8cc4af95744fe078712c1e8201cdcada93';
// const VOICE_ID = 'zGjIP4SZlMnY9m93k97r';

// CHAT SYSTEM VARIABLES - ADD THESE TOO
let recognition = null;
let isListening = false;
let isVoiceChatMode = false;
let currentAudio = null; // ← ADD THIS NEW LINE FOR STOP FUNCTIONALITY

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
        // Force avatar video to be ready for click
if (this.elements.avatarVideo) {
    this.elements.avatarVideo.style.display = 'block';
    this.elements.avatarVideo.style.cursor = 'pointer';
    this.elements.avatarVideo.muted = true; // Helps with autoplay policies
    this.elements.avatarVideo.load(); // Preload the video
}
    }
};

// ===========================================
// AVATAR VIDEO FUNCTIONALITY - COMPLETE FIX
// ===========================================

VoiceBot.setupAvatarVideo = function() {
    if (this.elements.avatarVideo) {
        // Try to play video on load
        this.elements.avatarVideo.play().catch(error => {
            console.log('Auto-play blocked - video ready for user interaction');
            // DON'T show static avatar yet - wait for user to click!
        });

        // ONLY show static avatar when video actually ends after playing
        this.elements.avatarVideo.addEventListener('ended', () => {
            console.log('Video actually finished playing');
            showStaticAvatar();
        });

        // Handle video error
        this.elements.avatarVideo.addEventListener('error', () => {
            console.log('Video error - showing static avatar');
            showStaticAvatar();
        });
    }
};

// UPDATED GLOBAL FUNCTION WITH YOUR STATIC AVATAR
function showStaticAvatar() {
    console.log('Video ended - switching to static avatar');
    const avatarVideo = document.getElementById('avatarVideo');
    let staticAvatar = document.getElementById('staticAvatar');
    
    if (avatarVideo) {
        // Hide the video
        avatarVideo.style.display = 'none';
        
        // UPDATE THE EXISTING STATIC AVATAR WITH YOUR NEW IMAGE
        if (staticAvatar) {
            // Update the existing static avatar with your new image URL
            staticAvatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1756268994103_avatar%20%20black%20screen2.png';
            staticAvatar.style.display = 'block';
            staticAvatar.style.width = '120px';
            staticAvatar.style.height = 'auto';
            staticAvatar.style.cursor = 'pointer';
            
            console.log('✅ Updated existing static avatar with new image');
        } else {
            // CREATE NEW STATIC AVATAR if it doesn't exist
            staticAvatar = document.createElement('img');
            staticAvatar.id = 'staticAvatar';
            staticAvatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1756268994103_avatar%20%20black%20screen2.png';
            staticAvatar.alt = 'AI Assistant';
            staticAvatar.style.width = '120px';
            staticAvatar.style.height = 'auto';
            staticAvatar.style.cursor = 'pointer';
            staticAvatar.style.display = 'block';
            
            // Add it to the same parent as the video
            avatarVideo.parentNode.appendChild(staticAvatar);
            
            console.log('✅ Created new static avatar');
        }
        
        // Add click handler to restart video
        staticAvatar.onclick = function() {
            staticAvatar.style.display = 'none';
            avatarVideo.style.display = 'block';
            avatarVideo.currentTime = 0;
            avatarVideo.play();
        };
        
        console.log('📐 Static avatar dimensions:', staticAvatar.offsetWidth, 'x', staticAvatar.offsetHeight);
    }
}

// ALSO ADD THIS METHOD TO VOICEBOT OBJECT
VoiceBot.showStaticAvatar = function() {
    showStaticAvatar(); // Calls the global function
};

// Comment out these lines that force static avatar:
// if (this.elements.avatarVideo && this.elements.staticAvatar) {
//     this.elements.avatarVideo.style.display = 'none';
//     this.elements.staticAvatar.style.display = 'block';
//     this.isAvatarVideoPlayed = true;
//     console.log('🔄 Switched to static avatar');
// }

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
        
        // 🚀 FIXED: If AI Voice Chat, load chat slide
        if (slideType === 'voice-chat') {
            this.loadSlide('chat-interface');
        } else {
            this.loadSlide(slideType);
        }
        
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
        
        // 🚀 ONLY initialize for voice-chat or chat-interface
        if (slideType === 'voice-chat' || slideType === 'chat-interface') {
            // Don't call initializeChatSlide - let HTML handle the welcome message
            console.log('✅ Chat slide loaded with built-in welcome message');
        }
        
    }, 200);
};

VoiceBot.generateSlideContent = function(slideType) {
    const slides = {
        'voice-chat': this.generateVoiceChatSlide(), // ← FIXED - Now refresh goes to home screen
        'chat-interface': this.generateChatSlide(), // Chat functionality
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
             class="slide-graphic glow"
             onclick="VoiceBot.activateVoice()"
             style="cursor: pointer;">
        
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
// CHAT INTERFACE SLIDE - ADD THIS ENTIRE SECTION
// ===========================================
VoiceBot.generateChatSlide = function() {
    return `
        <div class="voice-chat-container">
            <!-- Chat Header -->
            <div class="voice-chat-header" id="voiceChatHeaderTitle">
                🎤 NCI Business AI Assistant
            </div>

            <!-- Quick Topic Buttons -->
            <div class="voice-quick-buttons">
                <button class="voice-quick-btn" onclick="VoiceBot.askQuickQuestion('How can you help grow my business?')">📈 Business Growth</button>
                <button class="voice-quick-btn" onclick="VoiceBot.askQuickQuestion('What marketing services do you offer?')">🎯 Marketing Services</button>
                <button class="voice-quick-btn" onclick="VoiceBot.askQuickQuestion('Do you handle bookkeeping and taxes?')">📊 Accounting Services</button>
                <button class="voice-quick-btn" onclick="VoiceBot.askQuickQuestion('What are your pricing packages?')">💰 Pricing</button>
            </div>

            <!-- Voice Banner - "AI is listening..." -->
            <div class="voice-banner" id="voiceBanner" style="display: none;">
                🎤 AI is listening... What can I help you with?
            </div>

            <!-- Voice Visualizer Container -->
            <div id="voiceVisualizerContainer" class="voice-container" style="display: none;">
                <div id="staticListeningText" class="listening-text">
                    🎤 Microphone Active - How can we help your business?
                </div>
                <canvas id="voiceWaveform" class="waveform-canvas" width="400" height="40"></canvas>
            </div>

            <!-- Chat Messages Area -->
            <div class="voice-chat-messages" id="voiceChatMessages">
                <!-- Initial AI Message -->
                <div class="voice-message voice-ai-message">
                    <div class="voice-message-bubble">
                        <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png" class="voice-ai-avatar">
                        <div>Hi! I'm your business expert ready to help with accounting and marketing! You can type questions or click the microphone to speak with me! What would you like to know about growing your business? 🎤</div>
                    </div>
                </div>
            </div>

            <!-- Audio Mode Controls -->
            <div class="voice-audio-controls" id="voiceAudioControls" style="display: none;">
                <button class="voice-audio-off-btn" id="voiceAudioOffBtn" onclick="VoiceChatModule.switchToTextMode();">
                    🔇 Audio Off
                </button>
            </div>

            <!-- Text Mode Controls -->
            <div class="voice-text-controls" id="voiceTextControls" style="display: none;">
                <div class="voice-text-input-row">
                    <input type="text" id="voiceTextInput" class="voice-text-input" placeholder="Type your message..." onkeypress="if(event.key==='Enter') VoiceChatModule.sendTextMessage()">
                    <button class="voice-send-btn" onclick="VoiceChatModule.sendTextMessage()">Send</button>
                </div>
                <button class="voice-reinitiate-audio-btn" onclick="VoiceChatModule.switchToAudioMode()">🎤 Reinitiate Audio</button>
            </div>

            <!-- Speed Controls Container -->
            <div class="voice-controls-container">
                <div class="voice-speed-controls">
                    <button onclick="VoiceChatModule.adjustVoiceSpeed('slower')" class="voice-speed-btn">
                        🐌 Slower
                    </button>
                    <span id="voiceSpeedDisplay" class="voice-speed-display">Normal</span>
                    <button onclick="VoiceChatModule.adjustVoiceSpeed('faster')" class="voice-speed-btn">
                        🚀 Faster
                    </button>
                </div>
            </div>
        </div>
    `;
};


// ===========================================
// AUTO-WELCOME MESSAGE - ADD THIS FUNCTION
// ===========================================
VoiceBot.initializeChatSlide = function() {
    console.log('🎤 Initializing chat slide...');
    // Temporarily disable auto-welcome to fix duplicate issue
    // The welcome message will come from HTML for now
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
    console.log('🎤 Microphone activation - functionality to be added');
    alert('Voice functionality will be added in the next phase!');
};

// ===========================================
// VOICE ACTIVATION FUNCTIONALITY
// ===========================================

// UPDATE THIS FUNCTION IN YOUR EXISTING script.js:

VoiceBot.activateVoice = function() {
    console.log('🎤 Voice activation clicked!');
    
    const avatarVideo = document.getElementById('avatarVideo');
    if (avatarVideo) {
        // Make sure static avatar is hidden first
        const staticAvatar = document.getElementById('staticAvatar');
        if (staticAvatar) {
            staticAvatar.style.display = 'none';
        }
        
        // Show and play the video
        avatarVideo.style.display = 'block';
        avatarVideo.style.visibility = 'visible';
        avatarVideo.currentTime = 0;
        avatarVideo.muted = false;
        avatarVideo.play().then(() => {
            console.log('✅ Avatar video playing with sound!');
            
            // 🚀 AFTER VIDEO STARTS, LOAD THE CHAT INTERFACE
            setTimeout(() => {
                console.log('🎯 Loading chat interface...');
                this.loadSlide('chat-interface');
                
                // Initialize voice chat module
                if (typeof initializeVoiceChat === 'function') {
                    console.log('🎤 Initializing Voice Chat Module...');
                    initializeVoiceChat();
                }
            }, 2000); // Wait 2 seconds for video to play
            
        }).catch(error => {
            console.log('❌ Avatar play failed:', error);
            // Load chat anyway if video fails
            this.loadSlide('chat-interface');
        });
    } else {
        // No video found, go straight to chat
        console.log('🎯 No avatar video, loading chat directly...');
        this.loadSlide('chat-interface');
    }
    
    // Enable voice in config
    this.config.voiceEnabled = true;
};

VoiceBot.initializeVAPI = function() {
    console.log('🔌 Initializing VAPI connection...');
    
    // Placeholder for VAPI integration
    // This is where you'll add your VAPI connection code
    alert('Voice activation successful! (VAPI integration ready to be added)');
    
    // Update UI to show voice is active
    this.updateVoiceStatus(true);
};

VoiceBot.updateVoiceStatus = function(active) {
    const instruction = document.querySelector('.instruction-text');
    if (instruction && active) {
        instruction.innerHTML = 'Voice activated! 🎤<br>Listening for your input...';
        instruction.style.color = '#4CAF50';
    }
};

VoiceBot.playAvatar = function() {
    console.log('🎤 Microphone clicked - Playing avatar video');
    
    const avatarVideo = document.getElementById('avatarVideo');
    if (avatarVideo) {
        avatarVideo.currentTime = 0; // Start from beginning
        avatarVideo.play().then(() => {
            console.log('✅ Avatar video playing');
        }).catch(error => {
            console.log('❌ Video play error:', error);
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

// ===========================================
// CHAT FUNCTIONALITY - ADD ALL THESE FUNCTIONS
// ===========================================

VoiceBot.sendChatMessage = function() {
    console.log('🗨️ sendChatMessage called');
    const input = document.getElementById('userChatInput');
    if (!input) {
        console.log('❌ Input not found');
        return;
    }
    
    const message = input.value.trim();
    if (!message) {
        console.log('❌ No message to send');
        return;
    }
    
    console.log('✅ Adding user message:', message);
    this.addUserMessage(message);
    input.value = '';
    
    setTimeout(() => {
        const response = this.getAIResponse(message);
        console.log('✅ Adding AI response:', response);
        this.addAIMessage(response);
        this.speakResponse(response);
    }, 800);
};

VoiceBot.toggleVoiceChat = function() {
    console.log('🎤 toggleVoiceChat called');
    const indicator = document.getElementById('voiceIndicator');
    const micButton = document.getElementById('voiceChatButton');
    
    if (!isListening) {
        // Start listening
        isListening = true;
        console.log('🎤 Voice listening started...');
        
        // Show voice indicator banner
        if (indicator) {
            indicator.style.display = 'block';
            indicator.innerHTML = '🎤 Listening... (speak now)';
            console.log('✅ Voice indicator shown');
        } else {
            console.log('❌ Voice indicator not found');
        }
        
        // Change button color to show it's active
        if (micButton) {
            micButton.style.background = '#f44336';
        }
        
        // Auto-stop after 5 seconds
        setTimeout(() => {
            if (isListening) {
                this.stopVoiceChat();
            }
        }, 5000);
        
    } else {
        this.stopVoiceChat();
    }
};

VoiceBot.addAIMessage = function(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.insertAdjacentHTML('beforeend', `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754810337622_AI%20assist%20head%20left.png" 
                     style="width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;">
                <div style="
                    background: #e8f5e8; padding: 12px 16px; border-radius: 15px 15px 15px 5px;
                    max-width: 75%; font-size: 14px; line-height: 1.4; word-wrap: break-word;
                ">${message}</div>
            </div>
        </div>
    `);
    this.scrollChatToBottom();
};

VoiceBot.askQuickQuestion = function(question) {
    this.addUserMessage(question);
    setTimeout(() => {
        const response = this.getAIResponse(question);
        this.addAIMessage(response);
        this.speakResponse(response);
    }, 800);
};

VoiceBot.getAIResponse = function(message) {
    const msg = message.toLowerCase();
    
    const responses = {
        "credit score": "Credit requirements: Conventional (620+), FHA (580+), VA (no minimum), USDA (640+). Higher scores get better rates!",
        "loan types": "Main types: Conventional (3% down, 620+ credit), FHA (3.5% down, 580+ credit), VA (0% down for veterans), USDA (0% down, rural areas).",
        "down payment": "Down payments range from 0-20%. FHA needs 3.5%, conventional starts at 3%, VA and USDA can be 0%.",
        "interest rates": "Current rates for 30-year fixed mortgages start around 6.25%. Rates depend on your credit score and down payment.",
        "hello": "Hello! How can I help with your mortgage questions today?",
        "hi": "Hi there! What mortgage questions can I answer for you?"
    };
    
    for (const [key, value] of Object.entries(responses)) {
        if (msg.includes(key)) {
            return value;
        }
    }
    
    return "Great question! I can help with credit scores, loan types, down payments, interest rates, and more. Try asking about any of these topics!";
};

VoiceBot.speakResponse = function(message) {
    // Simple browser speech for now
    if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        currentAudio = utterance; // Store for stop functionality
        
        // Show stop button while speaking
        const stopBtn = document.getElementById('stopAudioButton');
        if (stopBtn) stopBtn.style.display = 'block';
        
        utterance.onend = () => {
            currentAudio = null;
            if (stopBtn) stopBtn.style.display = 'none';
        };
        
        window.speechSynthesis.speak(utterance);
    }
};

VoiceBot.stopSpeaking = function() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    currentAudio = null;
    
    const stopBtn = document.getElementById('stopAudioButton');
    if (stopBtn) stopBtn.style.display = 'none';
};

VoiceBot.scrollChatToBottom = function() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
};

// ===========================================
// IMPROVED VOICE FUNCTIONALITY - REPLACE EXISTING
// ===========================================
VoiceBot.toggleVoiceChat = function() {
    const indicator = document.getElementById('voiceIndicator');
    const micButton = document.getElementById('voiceChatButton');
    const micImg = document.getElementById('micIcon');
    
    if (!isListening) {
        // Start listening
        isListening = true;
        console.log('🎤 Voice listening started...');
        
        // Show voice indicator banner
        if (indicator) {
            indicator.style.display = 'block';
            indicator.innerHTML = '🎤 Listening... (speak now)';
        }
        
        // Change mic button to red/recording state
        if (micButton) {
            micButton.style.background = '#f44336';
            micButton.title = 'Click to stop listening';
        }
        if (micImg) {
            micImg.style.filter = 'brightness(0) saturate(100%) invert(100%)'; // Make white
        }
        
        // Auto-stop after 5 seconds (you can adjust this)
        setTimeout(() => {
            if (isListening) {
                this.stopVoiceChat();
            }
        }, 5000);
        
    } else {
        this.stopVoiceChat();
    }
};

VoiceBot.stopVoiceChat = function() {
    isListening = false;
    console.log('🎤 Voice listening stopped.');
    
    const indicator = document.getElementById('voiceIndicator');
    const micButton = document.getElementById('voiceChatButton');
    const micImg = document.getElementById('micIcon');
    
    // Hide voice indicator banner
    if (indicator) {
        indicator.style.display = 'none';
    }
    
    // Reset mic button to normal state
    if (micButton) {
        micButton.style.background = 'none';
        micButton.title = 'Click to speak';
    }
    if (micImg) {
        micImg.style.filter = 'none'; // Reset to normal
    }
};

// Export for global access (if needed)
window.VoiceBot = VoiceBot;

console.log('📁 NCI Voice Bot JavaScript Loaded Successfully!');