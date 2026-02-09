// widget-launcher.js - For client websites
// Save this as: https://your-mobilewise-ai-server.com/js/widget-launcher.js

(function() {
    'use strict';
    
    class MobileWiseAIWidget {
        constructor(config) {
            this.config = {
                clientId: 'default-client',
                buttonColor: '#4361ee',
                buttonPosition: 'bottom-right',
                autoLoad: true,
                ...config
            };
            
            this.modal = null;
            this.iframe = null;
            this.initialized = false;
            
            if (this.config.autoLoad) {
                this.init();
            }
        }
        
        init() {
            if (this.initialized) return;
            
            // Add Font Awesome if not present
            this.addFontAwesome();
            
            // Create the floating button
            this.createButton();
            
            // Add styles
            this.addStyles();
            
            this.initialized = true;
            console.log('🚀 MobileWise AI Widget Initialized');
        }
        
        addFontAwesome() {
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                document.head.appendChild(link);
            }
        }
        
        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #mw-ai-widget-button {
                    position: fixed;
                    bottom: 100px;
                    right: 0;
                    background: ${this.config.buttonColor};
                    color: white;
                    padding: 14px 22px 14px 28px;
                    border-radius: 30px 0 0 30px;
                    cursor: pointer;
                    box-shadow: -4px 4px 25px rgba(0,0,0,0.3);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transform: translateX(calc(100% - 55px));
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                    font-weight: 600;
                    font-size: 15px;
                    border: none;
                    user-select: none;
                }
                
                #mw-ai-widget-button:hover {
                    transform: translateX(0);
                    padding-right: 35px;
                    box-shadow: -6px 6px 35px rgba(0,0,0,0.4);
                }
                
                #mw-ai-widget-button .mw-ai-icon {
                    font-size: 20px;
                    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
                }
                
                #mw-ai-widget-button .mw-ai-text {
                    opacity: 0;
                    transition: opacity 0.3s 0.1s;
                    white-space: nowrap;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                
                #mw-ai-widget-button:hover .mw-ai-text {
                    opacity: 1;
                }
                
                #mw-ai-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.92);
                    z-index: 10000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    animation: mw-fadeIn 0.3s ease;
                }
                
                @keyframes mw-fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                #mw-ai-iframe {
                    width: 95%;
                    height: 90%;
                    border: none;
                    border-radius: 20px;
                    box-shadow: 0 25px 70px rgba(0,0,0,0.6);
                    animation: mw-slideUp 0.4s ease;
                }
                
                @keyframes mw-slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                #mw-ai-close {
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    background: #f44336;
                    color: white;
                    border: none;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    font-size: 22px;
                    cursor: pointer;
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
                }
                
                #mw-ai-close:hover {
                    background: #d32f2f;
                    transform: rotate(90deg) scale(1.1);
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    #mw-ai-widget-button {
                        bottom: 80px;
                        transform: translateX(calc(100% - 50px));
                        padding: 12px 18px 12px 24px;
                        font-size: 14px;
                    }
                    
                    #mw-ai-iframe {
                        width: 98%;
                        height: 95%;
                        border-radius: 15px;
                    }
                    
                    #mw-ai-close {
                        top: 15px;
                        right: 15px;
                        width: 40px;
                        height: 40px;
                    }
                }
                
                /* Video container for triggered content */
                .mw-ai-video-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 25px;
                    border-radius: 20px;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.4);
                    z-index: 9998;
                    max-width: 850px;
                    width: 90%;
                    animation: mw-scaleIn 0.4s ease;
                }
                
                @keyframes mw-scaleIn {
                    from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                
                .mw-ai-video-container h3 {
                    margin: 0 0 20px 0;
                    color: #333;
                    font-size: 22px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .mw-ai-video-container video {
                    width: 100%;
                    border-radius: 12px;
                    display: block;
                }
                
                .mw-ai-video-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #f44336;
                    color: white;
                    border: none;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
        }
        
        createButton() {
            const button = document.createElement('button');
            button.id = 'mw-ai-widget-button';
            button.innerHTML = `
                <span class="mw-ai-icon">🤖</span>
                <span class="mw-ai-text">AI Guide Assist</span>
            `;
            
            button.addEventListener('click', () => this.openControlPanel());
            
            // Add to page after a delay for better UX
            setTimeout(() => {
                document.body.appendChild(button);
            }, 1000);
        }
        
        openControlPanel() {
            if (this.modal) return;
            
            // Create modal
            this.modal = document.createElement('div');
            this.modal.id = 'mw-ai-modal';
            
            // Create iframe
            this.iframe = document.createElement('iframe');
            this.iframe.id = 'mw-ai-iframe';
            this.iframe.src = `https://your-mobilewise-ai-server.com/ai-control-panel.html?client=${this.config.clientId}`;
            
            // Create close button
            const closeBtn = document.createElement('button');
            closeBtn.id = 'mw-ai-close';
            closeBtn.innerHTML = '✕';
            closeBtn.addEventListener('click', () => this.closeControlPanel());
            
            // Assemble modal
            this.modal.appendChild(closeBtn);
            this.modal.appendChild(this.iframe);
            document.body.appendChild(this.modal);
            
            // Listen for module triggers
            window.addEventListener('message', this.handleMessage.bind(this));
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        
        closeControlPanel() {
            if (this.modal) {
                document.body.removeChild(this.modal);
                this.modal = null;
                this.iframe = null;
                
                // Re-enable body scroll
                document.body.style.overflow = '';
                
                // Remove message listener
                window.removeEventListener('message', this.handleMessage.bind(this));
            }
        }
        
        handleMessage(event) {
            // Security check - verify origin if needed
            // if (event.origin !== 'https://your-mobilewise-ai-server.com') return;
            
            const data = event.data;
            
            switch(data.type) {
                case 'MODULE_TRIGGERED':
                    console.log('🎬 Module triggered:', data.module);
                    this.closeControlPanel();
                    this.showVideoOnSite(data.videoUrl, data.module);
                    break;
                    
                case 'CONTROL_PANEL_READY':
                    console.log('✅ Control panel ready for client:', data.clientId);
                    break;
            }
        }
        
        showVideoOnSite(videoUrl, module) {
            // Remove existing video container
            const existing = document.querySelector('.mw-ai-video-container');
            if (existing) existing.remove();
            
            // Create new video container
            const container = document.createElement('div');
            container.className = 'mw-ai-video-container';
            
            const moduleNames = {
                'results': 'Results Gallery',
                'success': 'Success Stories', 
                'calculator': 'ROI Calculator'
            };
            
            container.innerHTML = `
                <h3>
                    <i class="fas fa-video"></i>
                    ${moduleNames[module] || 'AI-Guided Testimonial'}
                </h3>
                <button class="mw-ai-video-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                <video src="${videoUrl}" controls autoplay>
                    Your browser does not support the video tag.
                </video>
                <p style="margin-top: 15px; color: #666; font-size: 14px; text-align: center;">
                    <i class="fas fa-info-circle"></i>
                    Triggered by AI conversation
                </p>
            `;
            
            document.body.appendChild(container);
            
            // Auto-remove after 2 minutes
            setTimeout(() => {
                if (container.parentElement) {
                    container.remove();
                }
            }, 120000);
        }
    }
    
    // Auto-initialize if config is provided
    if (window.MobileWiseAIConfig) {
        window.MobileWiseAI = new MobileWiseAIWidget(window.MobileWiseAIConfig);
    }
    
    // Global access
    window.MobileWiseAIWidget = MobileWiseAIWidget;
    
    console.log('📦 MobileWise AI Widget Loaded');
})();