// =============================================================================
// 🎯 TESTIMONIAL TRIGGER BRIDGE
// =============================================================================
// Connects MobileWise AI Core to your existing testimonial modules
// =============================================================================

console.log('🎯 Loading Testimonial Trigger Bridge...');

// =============================================================================
// 🎯 1. TESTIMONIAL TRIGGER MANAGER
// =============================================================================

class TestimonialTriggerManager {
    constructor() {
        this.active = false;
        this.currentConcern = null;
        this.testimonialSystemLoaded = false;
        this.init();
    }
    
    init() {
        console.log('🎯 Initializing Testimonial Trigger Manager');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Check if your testimonial system is already loaded
        this.checkTestimonialSystem();
        
        // Override or enhance the handleConcernWithTestimonial function
        this.enhanceTriggerSystem();
        
        // Add test buttons for manual triggering (debug only)
        this.addTestTriggers();
        
        console.log('✅ Testimonial Trigger Manager ready');
    }
    
    // =========================================================================
    // 🎯 2. CHECK FOR EXISTING TESTIMONIAL SYSTEM
    // =========================================================================
    
    checkTestimonialSystem() {
        // Look for your existing testimonial system
        const testimonialFunctions = [
            'handleConcernWithTestimonial',
            'showTestimonialSplashScreen',
            'showUniversalBanner',
            'testimonialData'
        ];
        
        let foundCount = 0;
        testimonialFunctions.forEach(funcName => {
            if (window[funcName]) {
                console.log(`✅ Found testimonial function: ${funcName}`);
                foundCount++;
            }
        });
        
        if (foundCount > 0) {
            this.testimonialSystemLoaded = true;
            console.log(`✅ Testimonial system loaded (${foundCount}/${testimonialFunctions.length} functions found)`);
        } else {
            console.warn('⚠️ No testimonial system found - triggers will be simulated');
        }
    }
    
    // =========================================================================
    // 🎯 3. ENHANCE THE TRIGGER SYSTEM
    // =========================================================================
    
    enhanceTriggerSystem() {
        // Save original function if it exists
        const originalHandleConcern = window.handleConcernWithTestimonial;
        
        // Create enhanced version
        window.handleConcernWithTestimonial = function(userText) {
            console.log(`🎯 ENHANCED handleConcernWithTestimonial called: "${userText}"`);
            
            // Log the trigger
            logTestimonialTrigger(userText);
            
            // Call original function if it exists
            if (originalHandleConcern && typeof originalHandleConcern === 'function') {
                console.log('✅ Calling original testimonial handler');
                return originalHandleConcern(userText);
            }
            
            // If no original function, simulate it
            console.log('⚠️ No original testimonial handler - simulating');
            simulateTestimonialTrigger(userText);
            
            return true;
        };
        
        console.log('✅ Enhanced handleConcernWithTestimonial installed');
    }
    
    // =========================================================================
    // 🎯 4. TRIGGER LOGGING SYSTEM
    // =========================================================================
    
    logTestimonialTrigger(userText) {
        const triggerData = {
            timestamp: new Date().toISOString(),
            userText: userText,
            concernType: this.detectConcernType(userText),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.log('📝 Testimonial Trigger Log:', triggerData);
        
        // Store in session for debugging
        sessionStorage.setItem('lastTestimonialTrigger', JSON.stringify(triggerData));
        
        // Send to analytics if you have it
        if (window.gtag) {
            gtag('event', 'testimonial_trigger', {
                'event_category': 'engagement',
                'event_label': triggerData.concernType,
                'value': 1
            });
        }
    }
    
    detectConcernType(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('expensive') || lowerText.includes('cost') || lowerText.includes('price')) {
            return 'price';
        }
        if (lowerText.includes('time') || lowerText.includes('busy')) {
            return 'time';
        }
        if (lowerText.includes('trust') || lowerText.includes('believe') || lowerText.includes('skeptical')) {
            return 'trust';
        }
        if (lowerText.includes('work') || lowerText.includes('results')) {
            return 'effectiveness';
        }
        return 'general';
    }
    
    // =========================================================================
    // 🎯 5. SIMULATED TRIGGER (FOR TESTING)
    // =========================================================================
    
    simulateTestimonialTrigger(userText) {
        console.log('🎬 SIMULATING testimonial trigger for:', userText);
        
        // Create a visible indicator that testimonials would play
        const indicator = document.createElement('div');
        indicator.id = 'testimonial-trigger-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 99999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        indicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">🎬</div>
                <div>
                    <strong>Testimonial Triggered!</strong>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">
                        Concern: "${userText.substring(0, 50)}..."
                    </div>
                </div>
            </div>
            <button onclick="this.parentElement.remove()" 
                    style="position: absolute; top: 5px; right: 5px; background: none; border: none; color: white; cursor: pointer; font-size: 20px;">
                ×
            </button>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(indicator);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (indicator.parentElement) {
                indicator.remove();
            }
        }, 5000);
    }
    
    // =========================================================================
    // 🎯 6. TEST BUTTONS (DEBUG ONLY - REMOVE IN PRODUCTION)
    // =========================================================================
    
    addTestTriggers() {
        // Only add if debug mode or localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const testPanel = document.createElement('div');
            testPanel.id = 'testimonial-test-panel';
            testPanel.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: white;
                border: 2px solid #667eea;
                border-radius: 10px;
                padding: 15px;
                z-index: 99998;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
                max-width: 300px;
            `;
            
            testPanel.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold; color: #667eea;">
                    🎯 Testimonial Triggers
                </div>
                <div style="display: grid; gap: 5px;">
                    <button onclick="triggerTestConcern('price')" style="padding: 8px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        💰 Price Concern
                    </button>
                    <button onclick="triggerTestConcern('time')" style="padding: 8px; background: #4ecdc4; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ⏰ Time Concern
                    </button>
                    <button onclick="triggerTestConcern('trust')" style="padding: 8px; background: #45b7d1; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        🔒 Trust Concern
                    </button>
                    <button onclick="triggerTestConcern('general')" style="padding: 8px; background: #96ceb4; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ❓ General Concern
                    </button>
                </div>
                <div style="font-size: 11px; color: #666; margin-top: 10px;">
                    Debug panel - remove in production
                </div>
            `;
            
            document.body.appendChild(testPanel);
            
            // Add test function to window
            window.triggerTestConcern = (type) => {
                const concerns = {
                    price: "I'm worried about the cost",
                    time: "I don't have time for this",
                    trust: "Can I really trust this?",
                    general: "Will this work for me?"
                };
                
                if (window.handleConcernWithTestimonial) {
                    window.handleConcernWithTestimonial(concerns[type]);
                } else {
                    console.log('Test concern:', concerns[type]);
                }
            };
        }
    }
    
    // =========================================================================
    // 🎯 7. DIRECT TRIGGER FUNCTION (USE THIS TO MANUALLY TRIGGER)
    // =========================================================================
    
    triggerTestimonials(userText, options = {}) {
        console.log('🎯 Manual testimonial trigger:', userText);
        
        // Store concern type
        this.currentConcern = this.detectConcernType(userText);
        
        // Set global flag
        window.testimonialActive = true;
        
        // If handleConcernWithTestimonial exists, use it
        if (window.handleConcernWithTestimonial) {
            return window.handleConcernWithTestimonial(userText);
        }
        
        // Fallback: simulate
        this.simulateTestimonialTrigger(userText);
        
        return true;
    }
}

// =============================================================================
// 🎯 8. INSTANTIATE THE TRIGGER MANAGER
// =============================================================================

// Create global instance
window.testimonialTriggerManager = new TestimonialTriggerManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.testimonialTriggerManager;
}

console.log('✅ Testimonial Trigger Bridge loaded');
console.log('🎯 Usage:');
console.log('  1. Call window.handleConcernWithTestimonial(userMessage)');
console.log('  2. Or use window.testimonialTriggerManager.triggerTestimonials(userMessage)');
console.log('  3. Test with: triggerTestConcern("price") (debug mode only)');