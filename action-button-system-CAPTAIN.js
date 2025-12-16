/**
 * MOBILE-WISE AI FORMVISER
 * Communication Center - ENHANCED VERSION
 * 
 * Uses existing Action Center styling but adds avatar introduction
 * Preserves original Action Center for AI-triggered calls
 * 
 * Created: 2025-10-31 - ENHANCEMENT VERSION
 * 
 */

console.log('✅ Enhanced Communication Center System loaded');

// Single button configuration - ADD THIS
const BUTTON_CONFIG = {
    id: 'comm-relay-center-btn',
    text: 'COMMUNICATION-RELAY-CENTER',  // Text only - emojis added via CSS
    gradient: 'linear-gradient(135deg, #667eea 0%, #0e27b5ff 100%)',
    avatarVideoUrl: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1763021413143.mp4'
};

let buttonContainer = null;
let isInitialized = false;
let isActionCenterVisible = false;
let actionCenterTimeout = null;

(function() {
    'use strict';

    let buttonContainer = null;
    let isInitialized = false;

    // Global flag to prevent Speak Now banner
window.disableSpeakNowBanner = false;

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
        console.log('✅ Communication Center Button initialized');
    }

 function triggerLeadActionCenter() {
    console.log('🚀 Triggering Lead Action Center (Silent Version)...');
    
    // 🚫 CRITICAL: Prevent Speak Now banner
    window.disableSpeakNowBanner = true;
    
    // 🎯 WAIT for AI to finish speaking BEFORE showing Action Center
    const checkSpeechCompletion = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
            clearInterval(checkSpeechCompletion);
            console.log('✅ AI finished speaking - now showing Action Center');
            showSilentCommunicationRelayCenter();
        }
    }, 500); // Check every 500ms
    
    // Safety timeout - show after 5 seconds max
    setTimeout(() => {
        clearInterval(checkSpeechCompletion);
        showSilentCommunicationRelayCenter();
        console.log('✅ Safety timeout - showing Action Center');
    }, 5000);
    
    // Re-enable Speak Now banner after reasonable time
    setTimeout(() => {
        window.disableSpeakNowBanner = false;
        console.log('✅ Speak Now banner re-enabled');
    }, 30000);
}

// ADD THIS SIMPLE FUNCTION - COPY OF EXISTING BUT WITH DIFFERENT VIDEO
function showSilentCommunicationRelayCenter() {
    console.log('🎯 Creating SILENT Communication Center...');
    
    const actionCenter = document.createElement('div');
    actionCenter.id = 'communication-relay-center-silent';
    
    // USE THE EXACT SAME HTML BUT WITH DIFFERENT VIDEO URL
    actionCenter.innerHTML = `
        <div style="[SAME BEAUTIFUL STYLING]">
            <!-- Header with SILENT AVATAR VIDEO -->
            <div style="[SAME HEADER STYLING]">
                <video autoplay muted playsinline style="[SAME VIDEO STYLING]">
                    <!-- 🎯 DIFFERENT VIDEO FOR SILENT VERSION -->
                    <source src="YOUR_SILENT_AVATAR_VIDEO_URL_HERE" type="video/mp4">
                </video>
                [SAME TITLE AND SUBTITLE]
            </div>
            [SAME BEAUTIFUL BUTTON GRID]
        </div>
    `;
    
    // SAME CONTAINER LOGIC
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(actionCenter);
        setTimeout(() => {
            actionCenter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    console.log('✅ SILENT Communication Center displayed');
}

// Export globally so lead system can call it
window.triggerLeadActionCenter = triggerLeadActionCenter;

/**
 * SHOW SILENT Communication Center
 * Same beautiful UI but with silent avatar video
 */
function showSilentCommunicationRelayCenter() {
    console.log('🎯 Creating SILENT Communication Center...');
    
    const actionCenter = document.createElement('div');
    actionCenter.id = 'communication-relay-center-silent';
    
    // USE THE EXACT SAME HTML BUT WITH SILENT AVATAR VIDEO
    actionCenter.innerHTML = `
        <div style="
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                        url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1762038349654_action-bg.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px 25px 30px 25px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: white;
            font-family: 'Segoe UI', system-ui, sans-serif;
            max-width: 750px;
            min-height: 450px;
        ">
            <!-- Header with SILENT Avatar Video -->
            <div style="display: flex; align-items: center; margin-bottom: 25px; gap: 15px; margin-top: 5px;">
                <video autoplay muted playsinline style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                    <!-- 🎯 SILENT AVATAR VIDEO -->
                    <source src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1762224530592.mp4" type="video/mp4">
                </video>
                <div>
                    <h3 style="margin: 0 0 5px 0; font-size: 22px; font-weight: 600; color: white;">Communication Center</h3>
                    <p style="margin: 0; opacity: 0.8; font-size: 13px; font-weight: 300; letter-spacing: 0.5px;">AI Assisted Comm Support to Bruce</p>
                </div>
            </div>

            <!-- EXACT SAME BEAUTIFUL BUTTON GRID -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                <!-- Request-A-Call -->
                <button onclick="handleActionButton('click-to-call')" style="display: flex; align-items: center; gap: 12px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease; backdrop-filter: blur(10px); width: 100%; height: 84px; min-width: 295px;" onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 24px;">📞</span></div>
                    <span style="flex: 1;">Request-A-Call</span>
                </button>

                <!-- URGENT CALL -->
                <button onclick="handleActionButton('urgent-call')" style="display: flex; align-items: center; gap: 12px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease; backdrop-filter: blur(10px); width: 100%; height: 84px; min-width: 295px;" onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px;">🚨</div>
                    <span style="flex: 1;">URGENT CALL</span>
                </button>

                <!-- BOOK Consultation -->
                <button onclick="handleActionButton('free-consultation')" style="display: flex; align-items: center; gap: 12px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease; backdrop-filter: blur(10px); width: 100%; height: 84px; min-width: 295px;" onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 24px;">📅</span></div>
                    <span style="flex: 1;">BOOK Consultation</span>
                </button>

                <!-- Pre-Qualifier -->
                <button onclick="handleActionButton('pre-qualifier')" style="display: flex; align-items: center; gap: 12px; background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 18px 15px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 17px; text-align: left; transition: all 0.3s ease; backdrop-filter: blur(10px); width: 100%; height: 84px; min-width: 295px;" onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 24px;">✅</span></div>
                    <span style="flex: 1;">Pre-Qualification</span>
                </button>
            </div>

            <!-- Skip for Now -->
            <button onclick="handleActionButton('skip')" style="display: flex; align-items: center; gap: 10px; background: rgba(0, 0, 0, 0.6); color: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); padding: 15px 20px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: 500; transition: all 0.3s ease; width: 100%; justify-content: center; margin-top: 5px;" onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.color='white';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.color='rgba(255, 255, 255, 0.8)';">
                <div style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 16px;">⏭️</span></div>
                <span>Skip for Now</span>
            </button>
        </div>
    `;
    
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(actionCenter);
        setTimeout(() => {
            actionCenter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    console.log('✅ SILENT Communication Center displayed');
}

// Export globally
window.showSilentCommunicationRelayCenter = showSilentCommunicationRelayCenter;
    /**
 * SHOW Communication Center - CLONED VERSION
 * Same layout as Action Center but with YOUR video avatar
 */
function showCommunicationRelayCenter() {
    const actionCenter = document.createElement('div');
    actionCenter.id = 'communication-relay-center'; // Different ID
    actionCenter.innerHTML = `
        <div style="
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                        url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1762038349654_action-bg.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px 25px 30px 25px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: white;
            font-family: 'Segoe UI', system-ui, sans-serif;
            max-width: 750px;
            min-height: 450px;
        ">
            <!-- Header with YOUR Video Avatar -->
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                gap: 15px;
                margin-top: 5px;
            ">
                <!-- YOUR VIDEO AVATAR WITH AUDIO -->
                <video autoplay muted playsinline style="
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
">
    <source src="${BUTTON_CONFIG.avatarVideoUrl}" type="video/mp4">
</video>
                <div>
                    <h3 style="
                        margin: 0 0 5px 0;
                        font-size: 22px;
                        font-weight: 600;
                        color: white;
                    ">Communication Center</h3>
                    <p style="
                        margin: 0;
                        opacity: 0.8;
                        font-size: 13px;
                        font-weight: 300;
                        letter-spacing: 0.5px;
                    ">AI Assisted Comm Support</p>
                </div>
            </div>

            <!-- SAME 2x2 Grid Layout as Original -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                <!-- Request-A-Call -->
                <button onclick="handleRelayCenterAction('click-to-call')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">📞</span>
                    </div>
                    <span style="flex: 1;">Request-A-Call</span>
                </button>

                <!-- ... REST OF THE ORIGINAL ACTION CENTER BUTTONS ... -->
            </div>
        </div>
    `;
    
    // Same container logic as original
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(actionCenter);
        setTimeout(() => {
            actionCenter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    console.log('✅ Communication Center displayed with YOUR avatar');
}

   function addButtonStyles() {
    if (document.getElementById('comm-relay-button-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'comm-relay-button-styles';
    styleSheet.textContent = `
        /* Single button container - FULL WIDTH TO EDGES */
        #comm-relay-button-container {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center;
            align-items: center;
            padding: 15px 5px !important;  /* Reduced side padding */
            width: 100% !important;
            position: relative !important;
            min-height: 65px !important;
            box-sizing: border-box !important;
        }

        /* Communication Center BUTTON - FULL WIDTH, LARGER TEXT & EMOJIS */
        .comm-relay-btn {
            padding: 16px 15px !important;  /* More vertical padding */
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.15) 0%, 
                rgba(255, 255, 255, 0.25) 50%,
                rgba(255, 255, 255, 0.15) 100%) !important;
            color: white !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 20px !important;
            cursor: pointer !important;
            font-size: 17px !important;  /* Larger text */
            font-weight: 700 !important;
            width: 100% !important;
            max-width: none !important;  /* Remove max-width constraint */
            text-align: center;
            transition: all 0.3s ease !important;
            position: relative !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            backdrop-filter: blur(15px) !important;
            box-shadow: 
                0 6px 25px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.15),
                0 0 20px rgba(34, 197, 94, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            margin: 0 !important;  /* Remove any margins */
        }

        /* Make emojis 30% larger */
        .comm-relay-btn {
            font-family: 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif !important;
        }

        .comm-relay-btn::before {
            content: "⚡";
            font-size: 1.3em !important;  /* 30% larger emojis */
            margin-right: 8px;
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

        /* SPEAK NOW BANNER OVERLAY POSITIONING - FULL WIDTH */
        #speak-sequence-button {
            position: absolute !important;
            top: 12px !important;
            left: 5px !important;
            width: calc(100% - 10px) !important;  /* Full width minus small padding */
            height: calc(100% - 30px) !important;
            z-index: 1000 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            .comm-relay-btn {
                padding: 14px 12px !important;
                font-size: 16px !important;  /* Still larger on mobile */
                border-radius: 18px !important;
                letter-spacing: 0.8px !important;
            }
            
            #comm-relay-button-container {
                padding: 12px 3px !important;  /* Even less side padding on mobile */
                min-height: 60px !important;
            }
            
            #speak-sequence-button {
                top: 12px !important;
                left: 3px !important;
                width: calc(100% - 6px) !important;
                height: calc(100% - 24px) !important;
            }

            /* Smaller emojis on very small screens */
            .comm-relay-btn::before,
            .comm-relay-btn::after {
                font-size: 1.2em !important;
            }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
            .comm-relay-btn {
                padding: 12px 10px !important;
                font-size: 15px !important;
                letter-spacing: 0.6px !important;
            }
            
            .comm-relay-btn::before,
            .comm-relay-btn::after {
                font-size: 1.1em !important;
            }
        }
/* ============ CORRECTED MOBILE STYLING ============ */
@media (max-width: 768px) {
    #communication-relay-center,
    #communication-relay-center-silent {
        max-width: 100% !important;
        padding: 10px 10px !important;
        margin: 15px 0 !important;
        min-height: auto !important;
        border-radius: 15px !important;
        width: 140% !important; /* Much wider - almost full width */
        margin-left: 0% !important;
        margin-right: auto !important;
    }

    /* Fix header - avatar at top, no forced spacing */
    #communication-relay-center > div > div:first-child,
    #communication-relay-center-silent > div > div:first-child {
        display: flex !important;
        align-items: flex-start !important; /* Avatar at top */
        text-align: left !important;
        gap: 12px !important;
        margin-bottom: 20px !important;
        margin-top: 0 !important;
    }
        #communication-relay-center > div,
#communication-relay-center-silent > div {
    padding-top: 10px !important; /* Reduce top padding */
    padding-bottom: 25px !important; /* Reduce bottom padding */
}

    #communication-relay-center > div > div:first-child,
#communication-relay-center-silent > div > div:first-child {
    min-height: auto !important;
    height: auto !important;
    margin-bottom: 5px !important; /* Reduce space below header */
    padding: 5px 0 !important; /* Reduce internal padding */
}
        /* Target the button grid directly */
#communication-relay-center .button-grid,
#communication-relay-center-silent .button-grid,
#communication-relay-center > div > div:nth-of-type(2),
#communication-relay-center-silent > div > div:nth-of-type(2) {
    margin-top: 15px !important;
}

    #communication-relay-center video,
    #communication-relay-center-silent video {
        width: 80px !important; /* Smaller avatar */
        height: 30px !important;
        margin-top: -20 !important; /* No top margin pushing down */
        flex-shrink: 0 !important;
    }

    #communication-relay-center h3,
    #communication-relay-center-silent h3 {
        font-size: 16px !important;
        margin: 0 0 2px 0 !important; /* Minimal spacing */
        line-height: 1.1 !important;
        padding-top: 2px !important; /* Small top padding instead of margin */
    }

    #communication-relay-center p,
    #communication-relay-center-silent p {
        font-size: 11px !important;
        margin: 0 !important;
        line-height: 1.1 !important;
    }

    /* Slimmer buttons - 30% height reduction */
    #communication-relay-center button,
    #communication-relay-center-silent button {
        height: 65px !important; /* 30% slimmer (was 84px) */
        min-width: auto !important;
        padding: 8px 10px !important;
        font-size: 14px !important;
        margin: 0 !important;
    }

    /* Single column layout */
    #communication-relay-center > div > div:nth-child(2),
    #communication-relay-center-silent > div > div:nth-child(2) {
        grid-template-columns: 1fr !important;
        gap: 8px !important;
    }

    /* Smaller emojis in buttons */
    #communication-relay-center button div,
    #communication-relay-center-silent button div {
        width: 25px !important;
        height: 25px !important;
    }

    #communication-relay-center button div span,
    #communication-relay-center-silent button div span {
        font-size: 18px !important;
    }

    /* Slimmer skip button */
    #communication-relay-center > div > button:last-child,
    #communication-relay-center-silent > div > button:last-child {
        height: 45px !important;
        padding: 8px 15px !important;
        font-size: 13px !important;
        margin-top: 8px !important;
    }
}

/* Extra small devices */
@media (max-width: 480px) {
    #communication-relay-center,
    #communication-relay-center-silent {
        width: 99% !important; /* Almost full width */
        padding: 12px 10px !important;
    }

    #communication-relay-center video,
    #communication-relay-center-silent video {
        width: 40px !important;
        height: 40px !important;
    }

    #communication-relay-center h3,
    #communication-relay-center-silent h3 {
        font-size: 15px !important;
    }

    #communication-relay-center button,
    #communication-relay-center-silent button {
        height: 50px !important; /* Even slimmer */
        padding: 6px 10px !important;
        font-size: 13px !important;
    }
}
        
    `;

    document.head.appendChild(styleSheet);
}

   function renderCommRelayButton() {
    if (!buttonContainer) return;

    // Clear container
    buttonContainer.innerHTML = '';

    // Create the full-width button with larger text
    const button = document.createElement('button');
    button.id = BUTTON_CONFIG.id;
    button.className = 'comm-relay-btn';
    button.textContent = 'COMMUNICATION-CENTER';  // Text only - emojis added via CSS
    
    // Attach click handler
    button.onclick = openCommRelayCenter;
    
    buttonContainer.appendChild(button);
    console.log('🚀 FULL-WIDTH Communication Center button rendered');
}

    /**
     * OPEN Communication Center
     * With enhanced avatar introduction
     */
   function openCommRelayCenter() {
    console.log('🚀 Opening Communication Center (CLONED VERSION)...');
    
    // Stop voice activity
    if (typeof stopAllSpeech === 'function') stopAllSpeech();
    if (typeof stopListening === 'function') stopListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    //if (typeof speakText === 'function') {
    // speakText("Welcome to the Communication Center. Please click how you want to connect and I'll be there to help.");
     //}
    
    // 🎯 GO DIRECTLY TO ENHANCED ACTION CENTER
    showCommunicationRelayCenter();
    
    // Re-enable Speak Now banner after a reasonable time
    setTimeout(() => {
        window.disableSpeakNowBanner = false;
        console.log('✅ Speak Now banner re-enabled');
    }, 30000);
}

function playRelayCenterIntroduction() {
    // This function can just call openCommRelayCenter now
    openCommRelayCenter();
}

/**
 * SHOW Communication Center - CLONED VERSION
 * Same as original Action Center but with your video avatar
 */
function showCommunicationRelayCenter() {
    console.log('🎯 Creating Communication Center (CLONED VERSION)...');
    
    // Create the same structure as original but with your video
    const actionCenter = document.createElement('div');
    actionCenter.id = 'communication-relay-center';
    
    // Use the EXACT same HTML as the original, just change:
    // 1. The video source to your avatar
    // 2. The title to "Communication Center"
    actionCenter.innerHTML = `
        <div style="
            background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)),
                        url('https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1762038349654_action-bg.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px 25px 30px 25px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: white;
            font-family: 'Segoe UI', system-ui, sans-serif;
            max-width: 750px;
            min-height: 450px;
        ">
            <!-- Header with YOUR Video Avatar -->
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 25px;
                gap: 15px;
                margin-top: 5px;
            ">
                <video autoplay muted playsinline style="
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
">
    <source src="${BUTTON_CONFIG.avatarVideoUrl}" type="video/mp4">
</video>
                <div>
                    <h3 style="
                        margin: 0 0 5px 0;
                        font-size: 22px;
                        font-weight: 600;
                        color: white;
                    ">Communication Center</h3>
                    <p style="
                        margin: 0;
                        opacity: 0.8;
                        font-size: 13px;
                        font-weight: 300;
                        letter-spacing: 0.5px;
                    ">AI Assisted Comm Support</p>
                </div>
            </div>

            <!-- EXACT SAME 2x2 Grid Layout with ALL 4 buttons -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                <!-- Request-A-Call -->
                <button onclick="handleActionButton('click-to-call')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">📞</span>
                    </div>
                    <span style="flex: 1;">Request-A-Call</span>
                </button>

                <!-- URGENT CALL -->
                <button onclick="handleActionButton('urgent-call')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="font-size: 28px;">🚨</div>
                    <span style="flex: 1;">URGENT CALL</span>
                </button>

                <!-- BOOK Consultation -->
                <button onclick="handleActionButton('free-consultation')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">📅</span>
                    </div>
                    <span style="flex: 1;">BOOK Consultation</span>
                </button>

                <!-- Pre-Qualifier -->
                <button onclick="handleActionButton('pre-qualifier')" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 18px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 17px;
                    text-align: left;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    width: 100%;
                    height: 84px;
                    min-width: 295px;
                " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(0)';">
                    <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">✅</span>
                    </div>
                    <span style="flex: 1;">Pre-Qualification</span>
                </button>
            </div>

            <!-- Skip for Now - Full Width -->
            <button onclick="handleActionButton('skip')" style="
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 15px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.3s ease;
                width: 100%;
                justify-content: center;
                margin-top: 5px;
            " onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.color='white';" onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.color='rgba(255, 255, 255, 0.8)';">
                <div style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 16px;">⏭️</span>
                </div>
                <span>Skip for Now</span>
            </button>
        </div>
    `;
    
    const chatContainer = document.getElementById('chatMessages') || document.querySelector('.chat-messages');
    if (chatContainer) {
        chatContainer.appendChild(actionCenter);
        setTimeout(() => {
            actionCenter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    console.log('✅ Communication Center displayed with YOUR avatar and ALL buttons');
}

// Make sure to export it
window.showCommunicationRelayCenter = showCommunicationRelayCenter;

function openCommRelayCenter() {
    console.log('🚀 Opening Communication Center (CLONED VERSION)...');
    
    // 🚫 CRITICAL: Set flag to prevent Speak Now banner
    window.disableSpeakNowBanner = true;
    
    // 🛑 STOP ALL VOICE ACTIVITY
    if (typeof stopAllSpeech === 'function') stopAllSpeech();
    if (typeof stopListening === 'function') stopListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    // ❌ REMOVE THIS VOICE LINE (so your video audio can play)
    if (typeof speakText === 'function') {
    speakText("Welcome to the Communication Center. Please click how you want to connect and I'll be there to help.");
    }
    
    // 🎯 GO DIRECTLY TO Communication Center
    showCommunicationRelayCenter();
    
    // Re-enable Speak Now banner after a reasonable time
    setTimeout(() => {
        window.disableSpeakNowBanner = false;
        console.log('✅ Speak Now banner re-enabled');
    }, 30000);
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
        title.textContent = '🚀 Communication Center';
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
        
    }

   /**
 * SHOW ENHANCED ACTION CENTER
 * Uses the original Action Center but with Relay Center branding
 * PREVENTS Speak Now banner from appearing
 */
function showEnhancedActionCenter() {
    console.log('🎯 Showing Enhanced Action Center with Relay Center branding');
    
    // 🚫 CRITICAL: Set flag to prevent Speak Now banner
    window.disableSpeakNowBanner = true;
    
    // 🎯 USE THE ORIGINAL ACTION CENTER BUT WITH ENHANCED MESSAGING
    if (typeof window.showCommunicationActionCenter === 'function') {
        
        // Add a special header message first
        const enhancedMessage = "🚀 You're connected to the Communication Center - Direct line to Bruce";
        
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
        alert('🚀 Communication Center\n\nAI Assisted Comm Support to Bruce:\n📞 856-304-1035\n✉️ bizboost.expert@gmail.com');
    }
}

    // Export functions globally
    window.openCommRelayCenter = openCommRelayCenter;
    window.initializeCommRelayButton = initializeCommRelayButton;
    window.showEnhancedActionCenter = showEnhancedActionCenter;
    window.handleActionCenterCompletion = handleActionCenterCompletion; // 🆕 NEW
    window.playRelayCenterIntroduction = playRelayCenterIntroduction;   // 🆕 NEW

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCommRelayButton);
    } else {
        setTimeout(initializeCommRelayButton, 500);
    }

    console.log('✅ Enhanced Communication Center System loaded');
})();