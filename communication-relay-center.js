/**
 * MOBILE-WISE AI FORMVISER
 * Communication Relay Center - SINGLE BUTTON SYSTEM
 * 
 * Cleaned up: Only ONE button that opens Communication Relay Center
 * With video avatar introduction for direct connections
 * 
 * Created: 2025-10-31 - COMPLETE OVERHAUL
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

    /**
     * Add button CSS styles
     */
    function addButtonStyles() {
        if (document.getElementById('comm-relay-button-styles')) return;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'comm-relay-button-styles';
        styleSheet.textContent = `
            /* Single button container */
            #comm-relay-button-container {
                display: flex !important;
                justify-content: center;
                align-items: center;
                padding: 10px;
            }

            /* Communication Relay Center Button */
            .comm-relay-btn {
                padding: 16px 32px;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                color: white;
                background: linear-gradient(135deg, #667eea 0%, #0e27b5ff 100%);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                text-align: center;
                min-width: 250px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .comm-relay-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
                background: linear-gradient(135deg, #5a6fd8 0%, #0a1f9a 100%);
            }

            .comm-relay-btn:active {
                transform: translateY(-1px);
            }

            /* Blink animation for attention */
            @keyframes relayPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
                50% { transform: scale(1.05); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.7); }
            }

            .comm-relay-btn.pulse {
                animation: relayPulse 2s ease-in-out infinite;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .comm-relay-btn {
                    padding: 14px 24px;
                    font-size: 14px;
                    min-width: 220px;
                    border-radius: 22px;
                }
                
                #comm-relay-button-container {
                    padding: 8px;
                }
            }
        `;

        document.head.appendChild(styleSheet);
    }

    /**
     * Render the single Communication Relay Center button
     */
    function renderCommRelayButton() {
        if (!buttonContainer) return;

        // Clear container
        buttonContainer.innerHTML = '';

        // Create the single button
        const button = document.createElement('button');
        button.id = BUTTON_CONFIG.id;
        button.className = 'comm-relay-btn pulse'; // Starts with pulse animation
        button.textContent = BUTTON_CONFIG.text;
        button.style.background = BUTTON_CONFIG.gradient;
        
        // Attach click handler
        button.onclick = openCommRelayCenter;
        
        buttonContainer.appendChild(button);
        console.log('🚀 Communication Relay Center button rendered');
    }

    /**
     * OPEN COMMUNICATION RELAY CENTER
     * With video avatar introduction
     */
    function openCommRelayCenter() {
        console.log('🚀 Opening Communication Relay Center...');
        
        // 🛑 STOP ALL VOICE ACTIVITY
        if (typeof stopAllSpeech === 'function') stopAllSpeech();
        if (typeof stopListening === 'function') stopListening();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        
        // 🎯 SHOW VIDEO AVATAR INTRODUCTION
        showAvatarIntroduction();
        
        // 🎤 OPTIONAL: VOICE INTRODUCTION
        setTimeout(() => {
            if (typeof speakText === 'function') {
                speakText("Welcome to the Communication Relay Center. Let me connect you directly with Bruce for a personalized consultation.");
            }
        }, 1000);
        
        // 📞 OPEN ACTION CENTER AFTER AVATAR
        setTimeout(() => {
            openActionCenterWithConfig();
        }, 3000); // Wait for avatar to finish
    }

    /**
     * SHOW VIDEO AVATAR INTRODUCTION
     */
    function showAvatarIntroduction() {
        console.log('🎬 Playing avatar introduction video');
        
        // Create video overlay
        const videoOverlay = document.createElement('div');
        videoOverlay.id = 'avatar-video-overlay';
        videoOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            flex-direction: column;
        `;
        
        // Create video element
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
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Skip Introduction';
        closeBtn.style.cssText = `
            margin-top: 20px;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        `;
        closeBtn.onclick = () => {
            document.body.removeChild(videoOverlay);
            openActionCenterWithConfig(); // Open immediately if skipped
        };
        
        // Auto-remove when video ends
        video.onended = () => {
            document.body.removeChild(videoOverlay);
            openActionCenterWithConfig();
        };
        
        videoOverlay.appendChild(video);
        videoOverlay.appendChild(closeBtn);
        document.body.appendChild(videoOverlay);
    }

    /**
     * OPEN ACTION CENTER WITH PRE-CONFIGURED SETTINGS
     */
    function openActionCenterWithConfig() {
        const config = {
            title: 'Communication Relay Center',
            description: 'You\'re now connected to Bruce, founder and CEO of NCI. Choose how you\'d like to proceed:',
            highlight: 'Direct line to decision maker - no gatekeepers',
            preferredMethod: 'phone',
            fields: ['name', 'email', 'phone', 'message'],
            messagePlaceholder: 'Briefly describe what you\'d like to discuss with Bruce...'
        };
        
        // 🎯 OPEN COMMUNICATION ACTION CENTER
        if (typeof window.openCommunicationActionCenter === 'function') {
            window.openCommunicationActionCenter(config);
        } else if (typeof window.showUniversalBanner === 'function') {
            // Fallback to appointment banner
            window.showUniversalBanner('setAppointment');
        } else {
            // Ultimate fallback
            alert('🚀 Communication Relay Center\n\nReady to connect with Bruce?\nCall: (555) 123-4567');
        }
    }

    // Export functions globally
    window.openCommRelayCenter = openCommRelayCenter;
    window.initializeCommRelayButton = initializeCommRelayButton;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCommRelayButton);
    } else {
        setTimeout(initializeCommRelayButton, 500);
    }

    console.log('✅ Communication Relay Center System loaded');
})();