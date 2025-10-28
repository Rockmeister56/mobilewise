// ===================================================
// 🎨 MOBILE-WISE AI COMMUNICATION ACTION CENTER
// Dynamic button system - builds buttons in JavaScript
// Matches testimonial system architecture
// ===================================================

(function() {
    'use strict';

    console.log('🚀 Communication Action Center - Loading...');

    // ===================================================
    // 📋 BUTTON CONFIGURATIONS
    // ===================================================
    const ACTION_BUTTONS = [
        {
            id: 'request-call',
            title: 'Request a Call',
            description: 'Receive a call within 5 minutes',
            icon: '📞',
            urgent: false
        },
        {
            id: 'free-consultation',
            title: 'Get a Free Consultation',
            description: 'Complete consultation booking with expert advisor',
            icon: '💼',
            urgent: false
        },
        {
            id: 'urgent-call',
            title: '🚨 Get an Immediate Call',
            description: 'Priority response - Call back within 2 minutes',
            icon: '🚨',
            urgent: true
        },
        {
            id: 'pre-qualify',
            title: 'Get Pre-Qualified',
            description: 'Quick qualification - Answer 3 few simple questions',
            icon: '✅',
            urgent: false
        },
        {
            id: 'free-book',
            title: 'Free Book: Get 7 Secrets',
            description: 'Download your free guide for selling your practice',
            icon: '📚',
            urgent: false
        }
    ];

    // ===================================================
    // 🎨 CREATE ACTION CENTER HTML
    // ===================================================
    function createActionCenterHTML() {
        // Create buttons HTML
        const buttonsHTML = ACTION_BUTTONS.map(button => `
            <div class="action-button${button.urgent ? ' urgent' : ''}" onclick="handleActionButtonClick('${button.id}')">
                <div class="button-content">
                    <div class="button-title">${button.title}</div>
                    <div class="button-description">${button.description}</div>
                </div>
                <div class="button-icon">${button.icon}</div>
            </div>
        `).join('');

        // Complete action center HTML
        const actionCenterHTML = `
            <div id="communication-action-center" class="frosted-container" style="
                margin: 20px auto;
                max-width: 700px;
            ">
                <h2 class="action-center-title">Communication Action Center</h2>
                <div class="buttons-container">
                    ${buttonsHTML}
                </div>
            </div>
        `;

        return actionCenterHTML;
    }

    // ===================================================
    // 📍 INJECT ACTION CENTER INTO PAGE
    // ===================================================
    function injectActionCenter() {
        console.log('📍 Injecting Communication Action Center...');

        // Find target container (inside main chat container, before closing)
        const targetContainer = document.querySelector('.container');
        
        if (!targetContainer) {
            console.error('❌ Target container not found');
            return false;
        }

        // Create wrapper div
        const actionCenterWrapper = document.createElement('div');
        actionCenterWrapper.innerHTML = createActionCenterHTML();

        // Append to container
        targetContainer.appendChild(actionCenterWrapper.firstElementChild);

        console.log('✅ Communication Action Center injected successfully');
        return true;
    }

    // ===================================================
    // 🎯 HANDLE BUTTON CLICKS
    // ===================================================
    window.handleActionButtonClick = function(actionId) {
        console.log(`🎯 Action button clicked: ${actionId}`);

        // Check if showActionSplash function exists
        if (typeof window.showActionSplash === 'function') {
            window.showActionSplash(actionId);
        } else {
            console.warn('⚠️ showActionSplash function not found. Make sure action-splash-system.js is loaded.');
            alert(`Action button clicked: ${actionId}\n\nNote: action-splash-system.js needs to be loaded for full functionality.`);
        }
    };

    // ===================================================
    // 🚀 INITIALIZE ON PAGE LOAD
    // ===================================================
    function initializeActionCenter() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(injectActionCenter, 500); // Small delay to ensure chat is ready
            });
        } else {
            // DOM already loaded
            setTimeout(injectActionCenter, 500);
        }
    }

    // Start initialization
    initializeActionCenter();

    console.log('✅ Communication Action Center System Loaded');

})();
