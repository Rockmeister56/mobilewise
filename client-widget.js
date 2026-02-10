// File: /js/client-widget.js
// Mortgage AI Widget - Phantom Page Implementation
// Embed this on client websites

(function() {
    'use strict';
    
    console.log('🚀 Loading Mortgage AI Trigger Widget...');
    
    class MortgageAITriggerWidget {
        constructor(config = {}) {
            // Default configuration
            this.defaultConfig = {
                clientId: 'default-client',
                buttonText: '🤖 AI Mortgage Guide',
                buttonColor: '#4361ee',
                buttonPosition: 'bottom-right',
                serverUrl: 'https://your-server.com',
                controlPanelUrl: '/trigger-control-system.html',
                enableAnalytics: true,
                debug: false
            };
            
            // Merge user config
            this.config = { ...this.defaultConfig, ...config };
            
            // State
            this.isOpen = false;
            this.controlPanel = null;
            this.modal = null;
            this.iframe = null;
            
            // Initialize
            this.init();
        }
        
        init() {
            // Add global styles
            this.addStyles();
            
            // Create floating button
            this.createButton();
            
            // Setup message listener
            this.setupMessageListener();
            
            // Log initialization
            this.log('Widget initialized', this.config);
        }
        
        log(...args) {
            if (this.config.debug) {
                console.log('[MortgageAI]', ...args);
            }
        }
        
        addStyles() {
            // Check if styles already added
            if (document.getElementById('mortgage-ai-widget-styles')) {
                return;
            }
            
            const style = document.createElement('style');
            style.id = 'mortgage-ai-widget-styles';
            
            // Determine button position
            let positionCss = '';
            switch(this.config.buttonPosition) {
                case 'bottom-left':
                    positionCss = 'left: 30px; right: auto;';
                    break;
                case 'top-right':
                    positionCss = 'top: 30px; bottom: auto;';
                    break;
                case 'top-left':
                    positionCss = 'top: 30px; bottom: auto; left: 30px; right: auto;';
                    break;
                case 'bottom-right':
                default:
                    positionCss = 'right: 30px; left: auto;';
            }
            
            style.textContent = `
                /* Main Button */
                #mortgage-ai-button {
                    position: fixed;
                    ${positionCss}
                    bottom: 30px;
                    background: ${this.config.buttonColor};
                    color: white;
                    padding: 15px 25px;
                    border-radius: 30px;
                    cursor: pointer;
                    box-shadow: 0 5px 25px rgba(0,0,0,0.3);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-weight: 600;
                    font-size: 16px;
                    border: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: translateY(0);
                }
                
                #mortgage-ai-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 35px rgba(0,0,0,0.4);
                }
                
                #mortgage-ai-button:active {
                    transform: translateY(-1px);
                }
                
                #mortgage-ai-button.pulse {
                    animation: mortgage-ai-pulse 2s infinite;
                }
                
                @keyframes mortgage-ai-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(67, 97, 238, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
                }
                
                /* Modal Overlay */
                .mortgage-ai-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 100000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    animation: mortgage-ai-fade-in 0.3s ease-out forwards;
                }
                
                @keyframes mortgage-ai-fade-in {
                    to { opacity: 1; }
                }
                
                /* Modal Content */
                .mortgage-ai-modal-content {
                    width: 95%;
                    height: 90%;
                    max-width: 1400px;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                }
                
                /* Close Button */
                .mortgage-ai-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 100001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }
                
                .mortgage-ai-close:hover {
                    background: #c0392b;
                    transform: rotate(90deg);
                }
                
                /* Iframe */
                .mortgage-ai-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                
                /* Loading State */
                .mortgage-ai-loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #4361ee;
                    font-size: 18px;
                }
                
                /* Module Container (on client site) */
                .mortgage-ai-module-container {
                    transition: all 0.5s ease;
                    margin: 30px 0;
                }
                
                .mortgage-ai-module-highlight {
                    animation: mortgage-ai-highlight 2s ease;
                }
                
                @keyframes mortgage-ai-highlight {
                    0% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
                    50% { box-shadow: 0 0 30px 10px rgba(67, 97, 238, 0.3); }
                    100% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
                }
                
                /* Mobile Responsive */
                @media (max-width: 768px) {
                    #mortgage-ai-button {
                        padding: 12px 20px;
                        font-size: 14px;
                        bottom: 20px;
                        right: 20px;
                    }
                    
                    .mortgage-ai-modal-content {
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                    }
                    
                    .mortgage-ai-close {
                        top: 10px;
                        right: 10px;
                        width: 35px;
                        height: 35px;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        createButton() {
            // Remove existing button if any
            const existingButton = document.getElementById('mortgage-ai-button');
            if (existingButton) {
                existingButton.remove();
            }
            
            // Create button
            const button = document.createElement('button');
            button.id = 'mortgage-ai-button';
            button.innerHTML = `
                <span style="font-size: 20px;">🤖</span>
                <span>${this.config.buttonText}</span>
            `;
            
            // Add click event
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openControlPanel();
            });
            
            // Add to page after a short delay (better UX)
            setTimeout(() => {
                document.body.appendChild(button);
                this.log('Button added to page');
                
                // Add pulse animation after 5 seconds
                setTimeout(() => {
                    button.classList.add('pulse');
                    setTimeout(() => button.classList.remove('pulse'), 5000);
                }, 5000);
            }, 1000);
        }
        
        openControlPanel() {
            if (this.isOpen) return;
            
            this.log('Opening control panel...');
            this.isOpen = true;
            
            // Create modal overlay
            this.modal = document.createElement('div');
            this.modal.className = 'mortgage-ai-modal';
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'mortgage-ai-modal-content';
            
            // Create close button
            const closeButton = document.createElement('button');
            closeButton.className = 'mortgage-ai-close';
            closeButton.innerHTML = '×';
            closeButton.addEventListener('click', () => this.closeControlPanel());
            
            // Create loading indicator
            const loading = document.createElement('div');
            loading.className = 'mortgage-ai-loading';
            loading.innerHTML = 'Loading AI Assistant...';
            
            // Create iframe
            this.iframe = document.createElement('iframe');
            this.iframe.className = 'mortgage-ai-iframe';
            
            // Build URL for phantom page
            const params = new URLSearchParams({
                client: this.config.clientId,
                source: window.location.hostname,
                return_url: window.location.href,
                timestamp: Date.now()
            });
            
            const phantomPageUrl = `${this.config.serverUrl}${this.config.controlPanelUrl}?${params.toString()}`;
            this.iframe.src = phantomPageUrl;
            
            // Add loading indicator while iframe loads
            this.iframe.onload = () => {
                loading.style.display = 'none';
                this.log('Phantom page loaded');
                
                // Track analytics
                if (this.config.enableAnalytics) {
                    this.trackEvent('control_panel_opened');
                }
            };
            
            // Assemble modal
            modalContent.appendChild(closeButton);
            modalContent.appendChild(loading);
            modalContent.appendChild(this.iframe);
            this.modal.appendChild(modalContent);
            document.body.appendChild(this.modal);
            
            // Close on ESC key
            this.escHandler = (e) => {
                if (e.key === 'Escape') this.closeControlPanel();
            };
            document.addEventListener('keydown', this.escHandler);
            
            // Close on overlay click
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeControlPanel();
            });
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        
        closeControlPanel() {
            if (!this.isOpen) return;
            
            this.log('Closing control panel');
            this.isOpen = false;
            
            // Remove event listeners
            document.removeEventListener('keydown', this.escHandler);
            
            // Fade out modal
            if (this.modal) {
                this.modal.style.opacity = '0';
                this.modal.style.transition = 'opacity 0.3s';
                
                setTimeout(() => {
                    if (this.modal && this.modal.parentNode) {
                        this.modal.parentNode.removeChild(this.modal);
                    }
                    this.modal = null;
                    this.iframe = null;
                    
                    // Restore body scroll
                    document.body.style.overflow = '';
                }, 300);
            }
            
            // Track analytics
            if (this.config.enableAnalytics) {
                this.trackEvent('control_panel_closed');
            }
        }
        
        setupMessageListener() {
            // Listen for messages from phantom page
            window.addEventListener('message', (event) => {
                // Validate origin (for security)
                const allowedOrigins = [
                    this.config.serverUrl,
                    'http://localhost',
                    'http://127.0.0.1'
                ];
                
                if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) {
                    this.log('Message from unauthorized origin:', event.origin);
                    return;
                }
                
                const data = event.data;
                this.log('Received message:', data);
                
                switch(data.type) {
                    case 'TRIGGER_MODULE':
                        this.handleModuleTrigger(data);
                        break;
                        
                    case 'CLOSE_PANEL':
                        this.closeControlPanel();
                        break;
                        
                    case 'ANALYTICS_EVENT':
                        this.trackEvent(data.eventName, data.properties);
                        break;
                        
                    case 'DEBUG_INFO':
                        if (this.config.debug) {
                            console.log('[Phantom Page Debug]', data.message);
                        }
                        break;
                }
            });
        }
        
        handleModuleTrigger(data) {
            this.log('Handling module trigger:', data);
            
            // Close the control panel
            this.closeControlPanel();
            
            // Create or find module container
            let container = document.getElementById('mortgage-ai-modules');
            if (!container) {
                container = document.createElement('div');
                container.id = 'mortgage-ai-modules';
                container.className = 'mortgage-ai-module-container';
                
                // Insert after main content or before footer
                const mainContent = document.querySelector('main') || 
                                   document.querySelector('.content') || 
                                   document.body;
                
                if (mainContent) {
                    mainContent.appendChild(container);
                } else {
                    document.body.appendChild(container);
                }
            }
            
            // Show the triggered module
            this.showModule(data.module, data, container);
            
            // Scroll to module
            setTimeout(() => {
                container.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add highlight animation
                container.classList.add('mortgage-ai-module-highlight');
                setTimeout(() => {
                    container.classList.remove('mortgage-ai-module-highlight');
                }, 2000);
            }, 100);
            
            // Track analytics
            if (this.config.enableAnalytics) {
                this.trackEvent('module_triggered', {
                    module: data.module,
                    phrase: data.phrase || '',
                    timestamp: data.timestamp
                });
            }
        }
        
        showModule(moduleType, data, container) {
            this.log('Showing module:', moduleType);
            
            // Clear container
            container.innerHTML = '';
            
            // Based on module type, show different content
            let moduleHTML = '';
            
            switch(moduleType) {
                case 'results':
                    moduleHTML = `
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 15px; margin: 20px 0;">
                            <div style="max-width: 1200px; margin: 0 auto;">
                                <h2 style="margin-top: 0; font-size: 2.5em;">🎯 VERIFIED RESULTS GALLERY</h2>
                                <p style="font-size: 1.2em; opacity: 0.9;">AI-triggered based on conversation about "${data.phrase || 'mortgage results'}"</p>
                                
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px;">
                                    <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px;">
                                        <h3 style="color: #4ade80;">📈 312% Increase</h3>
                                        <p>Qualified mortgage applications increased from 15 to 47 per month</p>
                                    </div>
                                    
                                    <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px;">
                                        <h3 style="color: #4ade80;">💰 45% Higher Approval Rate</h3>
                                        <p>AI-assisted applications see significantly higher approval rates</p>
                                    </div>
                                    
                                    <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px;">
                                        <h3 style="color: #4ade80;">⏱️ 68% Faster Processing</h3>
                                        <p>Applications processed in 72 hours vs. industry average 15 days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'testimonials':
                    moduleHTML = `
                        <div style="background: #f8fafc; border: 2px solid #e2e8f0; padding: 40px; border-radius: 15px; margin: 20px 0;">
                            <h2 style="color: #1e293b;">💬 CLIENT TESTIMONIALS</h2>
                            <p style="color: #64748b;">Triggered by AI conversation about customer experiences</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px; margin-top: 30px;">
                                <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <div style="width: 50px; height: 50px; background: #4ade80; border-radius: 50%; margin-right: 15px;"></div>
                                        <div>
                                            <strong>Sarah M.</strong>
                                            <div style="color: #fbbf24;">★★★★★</div>
                                        </div>
                                    </div>
                                    <p>"The AI mortgage guide helped me secure a 3.2% rate when others offered 4.5%. Absolutely incredible!"</p>
                                </div>
                                
                                <div style="background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <div style="width: 50px; height: 50px; background: #60a5fa; border-radius: 50%; margin-right: 15px;"></div>
                                        <div>
                                            <strong>James R.</strong>
                                            <div style="color: #fbbf24;">★★★★★</div>
                                        </div>
                                    </div>
                                    <p>"As a first-time homebuyer, the AI assistant explained everything in plain English. Got approved in 48 hours!"</p>
                                </div>
                            </div>
                        </div>
                    `;
                    break;
                    
                default:
                    moduleHTML = `
                        <div style="background: #10b981; color: white; padding: 30px; border-radius: 10px; text-align: center;">
                            <h2 style="margin-top: 0;">✅ AI CONVERSATION COMPLETE</h2>
                            <p>Based on your conversation, relevant content has been displayed below.</p>
                            <p><small>Triggered: ${new Date(data.timestamp).toLocaleTimeString()}</small></p>
                        </div>
                    `;
            }
            
            container.innerHTML = moduleHTML;
        }
        
        trackEvent(eventName, properties = {}) {
            if (!this.config.enableAnalytics) return;
            
            const eventData = {
                event: eventName,
                client_id: this.config.clientId,
                timestamp: Date.now(),
                url: window.location.href,
                ...properties
            };
            
            // Log to console in debug mode
            if (this.config.debug) {
                console.log('[Analytics]', eventData);
            }
            
            // Send to your analytics endpoint
            // fetch(`${this.config.serverUrl}/api/analytics`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(eventData)
            // }).catch(err => this.log('Analytics error:', err));
        }
        
        // Public methods
        open() {
            this.openControlPanel();
        }
        
        close() {
            this.closeControlPanel();
        }
        
        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            // Recreate button with new config
            this.createButton();
        }
    }
    
    // Auto-initialize for mortgage sites
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    
    const mortgageKeywords = ['mortgage', 'loan', 'lender', 'homebuyer', 'refinance'];
    const shouldAutoInit = mortgageKeywords.some(keyword => 
        hostname.includes(keyword) || pathname.includes(keyword)
    ) || hostname.includes('mortgage-assist-demo');
    
    if (shouldAutoInit) {
        // Auto-initialize with default config
        window.MortgageAI = new MortgageAITriggerWidget({
            clientId: 'mortgage-assist-demo',
            buttonText: '🤖 AI Mortgage Assistant',
            buttonColor: '#10b981',
            debug: true
        });
        
        console.log('🏠 Mortgage AI Widget auto-initialized');
    }
    
    // Export to global scope
    window.MortgageAITriggerWidget = MortgageAITriggerWidget;
    
    // Auto-initialize with data attributes
    document.addEventListener('DOMContentLoaded', () => {
        const scriptElement = document.querySelector('script[data-mortgage-ai]');
        if (scriptElement) {
            const config = {
                clientId: scriptElement.getAttribute('data-client-id') || 'default',
                buttonText: scriptElement.getAttribute('data-button-text') || '🤖 AI Mortgage Guide',
                buttonColor: scriptElement.getAttribute('data-button-color') || '#4361ee',
                serverUrl: scriptElement.getAttribute('data-server-url') || 'https://your-server.com'
            };
            
            window.MortgageAI = new MortgageAITriggerWidget(config);
        }
    });
    
})();