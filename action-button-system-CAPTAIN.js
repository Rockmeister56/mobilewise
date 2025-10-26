/**
 * MOBILE-WISE AI FORMVISER
 * Action Button System - CAPTAIN'S EDITION
 * 
 * Integrated with Captain's existing button structure
 * Dynamic 3-mode button system with blink animation
 * Modes: Quick Questions, Call-to-Action, Reviews (Testimonials)
 * 
 * Created: 2025-10-24
 */

(function() {
    'use strict';

    // Button mode definitions
    const BUTTON_MODES = {
        'quick': {
            buttons: [
                { id: 'q1', text: 'Practice Valuation', action: 'askQuickQuestion', param: 'How much is my practice worth?' },
                { id: 'q2', text: 'Selling Options', action: 'askQuickQuestion', param: 'I want to sell my practice' },
                { id: 'q3', text: 'Buying Options', action: 'askQuickQuestion', param: 'I want to buy a practice' }
            ],
            gradient: 'linear-gradient(135deg, #667eea 0%, #0e27b5ff 100%)' // Blue
        },
        'cta': {
            buttons: [
                { id: 'cta1', text: 'Free Book + Call', action: 'openLink', param: 'https://mobile-wise.com/book-consultation' },
                { id: 'cta2', text: 'Smart Button Demo', action: 'openLink', param: 'https://mobile-wise.com/smart-button' },
                { id: 'cta3', text: 'Free Guide', action: 'openLink', param: 'https://mobile-wise.com/practice-valuation-guide' }
            ],
            gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' // Green
        },
        'reviews': {
            buttons: [
                { id: 'r1', text: 'Review 1', action: 'showBanner', param: 'testimonialSelector' },
                { id: 'r2', text: 'Review 2', action: 'showBanner', param: 'testimonialSelector' },
                { id: 'r3', text: 'Review 3', action: 'showBanner', param: 'testimonialSelector' }
            ],
            gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' // Purple
        }
    };

    // Current mode
    let currentMode = 'quick';
    let buttonContainer = null;
    let isInitialized = false;

    /**
     * Initialize button system
     */
    function initializeButtonSystem() {
        if (isInitialized) return;

        // Find button container - targeting Captain's .quick-questions div
        buttonContainer = document.querySelector('.quick-questions') || 
                         document.getElementById('action-buttons-dynamic') ||
                         document.getElementById('quick-buttons-container');

        if (!buttonContainer) {
            console.warn('Action button container not found - will retry');
            setTimeout(initializeButtonSystem, 1000);
            return;
        }

        // Add ID for easier targeting
        if (!buttonContainer.id) {
            buttonContainer.id = 'action-buttons-dynamic';
        }

        // Add CSS styles
        addButtonStyles();

        // Render initial mode
        renderButtons(currentMode);

        isInitialized = true;
        console.log('✅ Action Button System initialized (Captain\'s Edition)');
    }

    /**
     * Add button CSS styles
     */
    function addButtonStyles() {
        if (document.getElementById('action-button-styles-captain')) return;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'action-button-styles-captain';
        styleSheet.textContent = `
            /* Override/enhance existing .quick-btn styles */
            .quick-questions {
                display: flex !important;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }

            /* Dynamic action buttons - match Captain's existing style but add gradients */
            .action-button-dynamic {
                padding: 12px 20px;
                border: none;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                color: white;
                flex: 1;
                min-width: 120px;
                max-width: 180px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                text-align: center;
            }

            .action-button-dynamic:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.25);
            }

            .action-button-dynamic:active {
                transform: translateY(0);
            }

            /* Blink animation - 2 complete blinks in 1.5 seconds */
            @keyframes buttonBlink {
                0%, 100% { opacity: 1; transform: scale(1); }
                25% { opacity: 0.3; transform: scale(0.95); }
                50% { opacity: 1; transform: scale(1); }
                75% { opacity: 0.3; transform: scale(0.95); }
            }

            .action-button-dynamic.blink {
                animation: buttonBlink 1.5s ease-in-out;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .quick-questions {
                    gap: 8px;
                }

                .action-button-dynamic {
                    padding: 10px 16px;
                    font-size: 13px;
                    min-width: 100px;
                    max-width: none;
                }
            }
        `;

        document.head.appendChild(styleSheet);
    }

    /**
     * Render buttons for specified mode
     */
    function renderButtons(mode) {
        if (!buttonContainer) return;

        const config = BUTTON_MODES[mode];
        if (!config) {
            console.warn(`Unknown button mode: ${mode}`);
            return;
        }

        // Clear container
        buttonContainer.innerHTML = '';

        // Create buttons
        config.buttons.forEach(buttonDef => {
            const button = document.createElement('button');
            button.id = buttonDef.id;
            button.className = 'action-button-dynamic quick-btn';
            button.textContent = buttonDef.text;
            
            // Apply gradient background
            button.style.background = config.gradient;
            
            // Attach click handler based on button mode
            if (mode === 'cta') {
                // CTA buttons route to handleCTAButtonClick
                button.onclick = () => {
                    console.log(`🎯 CTA Button clicked: ${buttonDef.action}`);
                    if (typeof window.handleCTAButtonClick === 'function') {
                        window.handleCTAButtonClick(buttonDef.action);
                    } else {
                        console.error('❌ handleCTAButtonClick function not found');
                    }
                };
            } else {
                // Quick buttons route to askQuickQuestion
                button.onclick = () => {
                    console.log(`🎯 Quick Button clicked: ${buttonDef.param}`);
                    if (typeof window.askQuickQuestion === 'function') {
                        window.askQuickQuestion(buttonDef.param);
                    } else {
                        console.error('❌ askQuickQuestion function not found');
                    }
                };
            }
            
            buttonContainer.appendChild(button);
        });

        console.log(`🔄 Buttons rendered in ${mode} mode`);
    }

    /**
     * Handle button click based on action type
     */
    function handleButtonClick(action, param) {
        console.log(`🎯 Button clicked: ${action}(${param})`);

        switch(action) {
            case 'askQuickQuestion':
                if (typeof window.askQuickQuestion === 'function') {
                    window.askQuickQuestion(param);
                } else {
                    console.warn('askQuickQuestion function not found');
                }
                break;

            case 'openLink':
                if (param) {
                    window.open(param, '_blank');
                }
                break;

            case 'showBanner':
                if (typeof window.showUniversalBanner === 'function') {
                    window.showUniversalBanner(param);
                } else {
                    console.warn('showUniversalBanner function not found');
                }
                break;

            default:
                console.warn(`Unknown action: ${action}`);
        }
    }

    /**
     * Switch to a different button mode with blink animation
     */
    function switchActionButtonMode(newMode) {
        if (newMode === currentMode) {
            console.log(`Already in ${currentMode} mode`);
            return;
        }

        if (!BUTTON_MODES[newMode]) {
            console.warn(`Unknown button mode: ${newMode}`);
            return;
        }

        console.log(`🔄 Switching buttons: ${currentMode} → ${newMode}`);

        // Add blink animation to current buttons
        const currentButtons = buttonContainer.querySelectorAll('.action-button-dynamic');
        currentButtons.forEach(btn => btn.classList.add('blink'));

        // Switch mode after animation starts (300ms into 1.5s animation)
        setTimeout(() => {
            currentMode = newMode;
            renderButtons(newMode);
        }, 300);
    }

    /**
     * Get current button mode
     */
    function getCurrentMode() {
        return currentMode;
    }

    /**
     * Force re-render (useful after DOM changes)
     */
    function refreshButtons() {
        if (buttonContainer) {
            renderButtons(currentMode);
        } else {
            initializeButtonSystem();
        }
    }

    // Export functions globally
    window.switchActionButtonMode = switchActionButtonMode;
    window.getCurrentMode = getCurrentMode;
    window.refreshActionButtons = refreshButtons;
    window.initializeButtonSystem = initializeButtonSystem;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeButtonSystem);
    } else {
        // DOM already loaded, but wait a bit for other scripts
        setTimeout(initializeButtonSystem, 500);
    }

    console.log('✅ Action Button System loaded (Captain\'s Edition)');
})();
