/**
 * MOBILE-WISE AI FORMVISER
 * Communication Relay Center - ENHANCED VERSION
 * 
 * Uses existing Action Center styling but adds avatar introduction
 * Preserves original Action Center for AI-triggered calls
 * 
 * Created: 2025-10-31 - ENHANCEMENT VERSION
 */

(function() {
    'use strict';

    // Single button configuration
    const BUTTON_CONFIG = {
        id: 'comm-relay-center-btn',
        text: '🚀 Communication Relay Center',
        gradient: 'linear-gradient(135deg, #667eea 0%, #0e27b5ff 100%)',
        avatarVideoUrl: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1762980653076.mp4'
    };

    let buttonContainer = null;
    let isInitialized = false;

    /**
     * Initialize single button system
     */
    function initializeCommRelayButton() {
        if (isInitialized) return;

        // Find button container
        buttonContainer = document.querySelector('.quick-questions') || 
                         document.getElementById('action-buttons-dynamic') ||
                         document.getElementById('quick-buttons-container');

        if (!buttonContainer) {
            console.warn('Button container not found - will retry');
            setTimeout(initializeCommRelayButton, 1000);
            return;
        }

        // Add ID for easier targeting
        if (!buttonContainer.id) {
            buttonContainer.id = 'comm-relay-button-container';
        }

        // Add CSS styles
        addButtonStyles();

        // Render the single button
        renderCommRelayButton();

        isInitialized = true;
        console.log('✅ Communication Relay Center Button initialized');
    }

   function addButtonStyles() {
    if (document.getElementById('comm-relay-button-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'comm-relay-button-styles';
    styleSheet.textContent = `
        /* Single button container - FULL WIDTH */
        #comm-relay-button-container {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center;
            align-items: center;
            padding: 12px 10px;
            width: 100%;
            position: relative !important;
            min-height: 60px !important;
        }

        /* COMMUNICATION RELAY CENTER BUTTON - CONDENSED WITH INTENSE GLOW */
        .comm-relay-btn {
            padding: 14px 20px !important;
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.15) 0%, 
                rgba(255, 255, 255, 0.25) 50%,
                rgba(255, 255, 255, 0.15) 100%) !important;
            color: white !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 20px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            width: 100% !important;
            max-width: 450px !important;
            text-align: center;
            transition: all 0.3s ease !important;
            position: relative !important;
            text-transform: uppercase !important;
            letter-spacing: 0.8px !important;
            backdrop-filter: blur(15px) !important;
            box-shadow: 
                0 6px 25px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.15),
                0 0 20px rgba(34, 197, 94, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            overflow: hidden !important;
        }

        /* Hover effects with INTENSE green glow */
        .comm-relay-btn:hover {
            background: linear-gradient(135deg, 
                rgba(34, 197, 94, 0.4) 0%, 
                rgba(34, 197, 94, 0.6) 50%,
                rgba(34, 197, 94, 0.4) 100%) !important;
            border-color: rgba(34, 197, 94, 0.8) !important;
            transform: translateY(-2px) !important;
            box-shadow: 
                0 10px 35px rgba(34, 197, 94, 0.5),
                0 0 30px rgba(34, 197, 94, 0.4),
                0 0 40px rgba(34, 197, 94, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
        }

        /* Active state with even more glow */
        .comm-relay-btn:active {
            transform: translateY(0) !important;
            box-shadow: 
                0 8px 30px rgba(34, 197, 94, 0.6),
                0 0 25px rgba(34, 197, 94, 0.5),
                0 0 35px rgba(34, 197, 94, 0.4) !important;
        }

        /* Strong pulse animation */
        .comm-relay-btn {
            animation: intense-pulse 3s ease-in-out infinite;
        }

        @keyframes intense-pulse {
            0%, 100% { 
                box-shadow: 
                    0 6px 25px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.15),
                    0 0 20px rgba(34, 197, 94, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            }
            50% { 
                box-shadow: 
                    0 6px 25px rgba(0, 0, 0, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.2),
                    0 0 30px rgba(34, 197, 94, 0.5),
                    0 0 40px rgba(34, 197, 94, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
            }
        }

        /* SPEAK NOW BANNER OVERLAY POSITIONING */
        #speak-sequence-button {
            position: absolute !important;
            top: 12px !important;
            left: 10px !important;
            width: calc(100% - 20px) !important;
            height: calc(100% - 24px) !important;
            z-index: 1000 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            .comm-relay-btn {
                padding: 12px 18px !important;
                font-size: 13px !important;
                max-width: 100% !important;
                border-radius: 18px !important;
                letter-spacing: 0.6px !important;
            }
            
            #comm-relay-button-container {
                padding: 10px 8px;
                min-height: 55px !important;
            }
            
            #speak-sequence-button {
                top: 10px !important;
                left: 8px !important;
                width: calc(100% - 16px) !important;
                height: calc(100% - 20px) !important;
            }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
            .comm-relay-btn {
                padding: 10px 15px !important;
                font-size: 12px !important;
                letter-spacing: 0.5px !important;
            }
        }
    `;

    document.head.appendChild(styleSheet);
}

    function renderCommRelayButton() {
    if (!buttonContainer) return;

    // Clear container
    buttonContainer.innerHTML = '';

    // Create the condensed button with emojis
    const button = document.createElement('button');
    button.id = BUTTON_CONFIG.id;
    button.className = 'comm-relay-btn';
    button.textContent = '⚡ Communication-Relay-Center 📞 📅 🚨 🚀';
    
    // Attach click handler
    button.onclick = openCommRelayCenter;
    
    buttonContainer.appendChild(button);
    console.log('🚀 CONDENSED Communication Relay Center button rendered');
}

    /**
     * OPEN COMMUNICATION RELAY CENTER
     * With enhanced avatar introduction
     */
    function openCommRelayCenter() {
        console.log('🚀 Opening ENHANCED Communication Relay Center...');
        
        // 🛑 STOP ALL VOICE ACTIVITY
        if (typeof stopAllSpeech === 'function') stopAllSpeech();
        if (typeof stopListening === 'function') stopListening();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        
        // 🎯 SHOW AVATAR INTRODUCTION FIRST
        showAvatarIntroduction();
    }

    /**
     * SHOW AVATAR INTRODUCTION FOR RELAY CENTER
     */
    function showAvatarIntroduction() {
        console.log('🎬 Playing avatar introduction for Relay Center');
        
        // Create video overlay
        const videoOverlay = document.createElement('div');
        videoOverlay.id = 'avatar-video-overlay';
        videoOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            flex-direction: column;
        `;
        
        // Video element
        const video = document.createElement('video');
        video.src = BUTTON_CONFIG.avatarVideoUrl;
        video.controls = false;
        video.autoplay = true;
        video.muted = false;
        video.style.cssText = `
            max-width: 90%;
            max-height: 70%;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        `;
        
        // Title for Relay Center
        const title = document.createElement('div');
        title.textContent = '🚀 Communication Relay Center';
        title.style.cssText = `
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Skip to Relay Center';
        closeBtn.style.cssText = `
            margin-top: 20px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #0e27b5ff 100%);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        `;
        closeBtn.onclick = () => {
            document.body.removeChild(videoOverlay);
            showEnhancedActionCenter(); // Skip to enhanced center
        };
        
        // Auto-open enhanced center when video ends
        video.onended = () => {
            document.body.removeChild(videoOverlay);
            showEnhancedActionCenter();
        };
        
        videoOverlay.appendChild(title);
        videoOverlay.appendChild(video);
        videoOverlay.appendChild(closeBtn);
        document.body.appendChild(videoOverlay);
        
        // 🎤 OPTIONAL: VOICE INTRODUCTION
        setTimeout(() => {
            if (typeof speakText === 'function') {
                speakText("Welcome to the Communication Relay Center. You're now connected directly to Bruce for personalized consultation.");
            }
        }, 1000);
    }

    /**
     * SHOW ENHANCED ACTION CENTER
     * Uses the original Action Center but with Relay Center branding
     */
    function showEnhancedActionCenter() {
        console.log('🎯 Showing Enhanced Action Center with Relay Center branding');
        
        // 🎯 USE THE ORIGINAL ACTION CENTER BUT WITH ENHANCED MESSAGING
        if (typeof window.showCommunicationActionCenter === 'function') {
            
            // Add a special header message first
            const enhancedMessage = "🚀 You're connected to the Communication Relay Center - Direct line to Bruce";
            
            if (window.addAIMessage) {
                window.addAIMessage(enhancedMessage);
            }
            
            // Wait a moment then show the original Action Center
            setTimeout(() => {
                window.showCommunicationActionCenter();
                
                // Optional: Add a small visual indicator that this is the Relay Center version
                const actionCenter = document.getElementById('communication-action-center');
                if (actionCenter) {
                    const relayBadge = document.createElement('div');
                    relayBadge.style.cssText = `
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        background: linear-gradient(135deg, #667eea 0%, #0e27b5ff 100%);
                        color: white;
                        padding: 5px 12px;
                        border-radius: 15px;
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 1;
                        box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
                    `;
                    relayBadge.textContent = 'RELAY CENTER';
                    actionCenter.style.position = 'relative';
                    actionCenter.appendChild(relayBadge);
                }
            }, 500);
            
        } else {
            console.error('❌ Original Action Center not found - falling back');
            // Fallback to basic contact info
            alert('🚀 Communication Relay Center\n\nDirect connection to Bruce:\n📞 856-304-1035\n✉️ bizboost.expert@gmail.com');
        }
    }

    // Export functions globally
    window.openCommRelayCenter = openCommRelayCenter;
    window.initializeCommRelayButton = initializeCommRelayButton;
    window.showEnhancedActionCenter = showEnhancedActionCenter;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCommRelayButton);
    } else {
        setTimeout(initializeCommRelayButton, 500);
    }

    console.log('✅ Enhanced Communication Relay Center System loaded');
})();