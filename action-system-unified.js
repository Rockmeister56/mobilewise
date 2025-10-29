// ================================
// ACTION SYSTEM UNIFIED - CORPORATE DESIGN
// Communication Action Center with royal blue buttons and avatar
// ================================

console.log('🎯 ACTION SYSTEM UNIFIED - Loading (CORPORATE DESIGN)...');

// ================================
// EMAILJS CONFIGURATION
// ================================
const EMAILJS_CONFIG = {
    serviceId: 'service_xnh3j5g',
    templateId: 'template_j3bjrwd',
    publicKey: 'z-_Kn4DwSmXCRtRuN'
};

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('✅ EmailJS initialized with public key');
})();

// ================================
// FORM VALIDATION
// ================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

// ================================
// EMAILJS SENDING FUNCTION
// ================================
function sendEmailJS(formData) {
    console.log('📧 Preparing to send email via EmailJS...');
    console.log('Form data:', formData);

    const templateParams = {
        from_name: formData.name || 'Not provided',
        from_email: formData.email || 'Not provided',
        phone: formData.phone || 'Not provided',
        message: formData.message || 'No message provided',
        action_type: formData.actionType || 'General Inquiry',
        timestamp: new Date().toLocaleString()
    };

    console.log('Template params:', templateParams);

    return emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
    ).then(function(response) {
        console.log('✅ EmailJS SUCCESS!', response.status, response.text);
        return response;
    }).catch(function(error) {
        console.error('❌ EmailJS FAILED:', error);
        throw error;
    });
}

// ================================
// LEAD CAPTURE SYSTEM
// ================================
window.capturedLeadData = {
    name: '',
    email: '',
    phone: '',
    intent: '',
    timestamp: null
};

function captureLeadData(data) {
    console.log('📝 Capturing lead data:', data);
    
    if (data.name) window.capturedLeadData.name = data.name;
    if (data.email) window.capturedLeadData.email = data.email;
    if (data.phone) window.capturedLeadData.phone = data.phone;
    if (data.intent) window.capturedLeadData.intent = data.intent;
    
    window.capturedLeadData.timestamp = new Date().toISOString();
    
    console.log('✅ Lead data captured:', window.capturedLeadData);
    return window.capturedLeadData;
}

// ================================
// SMART BUTTON SYSTEM
// ================================
function showSmartButtons(type) {
    console.log('🔘 Showing smart buttons:', type);
    
    let buttonsHTML = '';
    
    switch(type) {
        case 'sell':
            buttonsHTML = `
                <div class="smart-buttons-container">
                    <button class="smart-button" onclick="handleSmartButton('schedule-valuation')">
                        📊 Schedule Free Valuation
                    </button>
                    <button class="smart-button" onclick="handleSmartButton('download-guide')">
                        📘 Download Seller's Guide
                    </button>
                    <button class="smart-button" onclick="handleSmartButton('speak-specialist')">
                        💬 Speak with Specialist
                    </button>
                </div>
            `;
            break;
        case 'buy':
            buttonsHTML = `
                <div class="smart-buttons-container">
                    <button class="smart-button" onclick="handleSmartButton('view-listings')">
                        🏢 View Available Practices
                    </button>
                    <button class="smart-button" onclick="handleSmartButton('financing-info')">
                        💰 Financing Information
                    </button>
                    <button class="smart-button" onclick="handleSmartButton('buyer-consultation')">
                        📞 Buyer Consultation
                    </button>
                </div>
            `;
            break;
        case 'evaluate':
            buttonsHTML = `
                <div class="smart-buttons-container">
                    <button class="smart-button" onclick="handleSmartButton('instant-estimate')">
                        ⚡ Instant Estimate
                    </button>
                    <button class="smart-button" onclick="handleSmartButton('detailed-analysis')">
                        📊 Detailed Analysis
                    </button>
                    <button class="smart-button" onclick="handleSmartButton('market-trends')">
                        📈 Market Trends
                    </button>
                </div>
            `;
            break;
    }
    
    // Add to chat (assuming there's a function to add system messages)
    if (window.addSystemMessage) {
        window.addSystemMessage(buttonsHTML);
    }
}

function handleSmartButton(action) {
    console.log('🎯 Smart button clicked:', action);
    
    // Hide buttons after click
    const buttonsContainer = document.querySelector('.smart-buttons-container');
    if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
    }
    
    // Handle the action
    switch(action) {
        case 'schedule-valuation':
            showCommunicationActionCenter('valuation');
            break;
        case 'download-guide':
            showCommunicationActionCenter('guide');
            break;
        case 'speak-specialist':
            showCommunicationActionCenter('consultation');
            break;
        case 'view-listings':
            window.open('https://newclientsinc.com/practices', '_blank');
            break;
        case 'financing-info':
            showCommunicationActionCenter('financing');
            break;
        case 'buyer-consultation':
            showCommunicationActionCenter('consultation');
            break;
        case 'instant-estimate':
            showCommunicationActionCenter('valuation');
            break;
        case 'detailed-analysis':
            showCommunicationActionCenter('analysis');
            break;
        case 'market-trends':
            window.open('https://newclientsinc.com/market-insights', '_blank');
            break;
    }
}

// ================================
// COMMUNICATION ACTION CENTER - CORPORATE DESIGN
// ================================
function showCommunicationActionCenter(context = 'consultation') {
    console.log('🎯 Showing Communication Action Center (CORPORATE) - Context:', context);
    
    // Check if already exists
    if (document.getElementById('communication-action-center')) {
        console.log('⚠️ Action Center already exists');
        return;
    }
    
    // Find chat messages container
    const chatContainer = document.getElementById('chatMessages') || 
                         document.querySelector('.chat-messages') || 
                         document.querySelector('#messages') ||
                         document.querySelector('.messages-container');
    
    if (!chatContainer) {
        console.error('❌ Could not find chat container');
        return;
    }
    
    // Create Action Center container (NO OVERLAY - INLINE)
    const actionCenter = document.createElement('div');
    actionCenter.id = 'communication-action-center';
    actionCenter.className = 'action-center-inline';
    
    // Create frosted glass container with corporate royal blue buttons
    actionCenter.innerHTML = `
        <div class="frosted-container" style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 30px;
            margin: 20px auto;
            max-width: 650px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
        ">
            <!-- Header with Avatar -->
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 24px;
            ">
                <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1755209453856_avatar%20right.png" 
                     alt="Assistant Avatar" 
                     style="
                         width: 60px;
                         height: 60px;
                         border-radius: 50%;
                         margin-right: 16px;
                         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                     ">
                <h3 style="
                    color: #2c3e50;
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                ">Communication Action Center</h3>
            </div>
            
            <!-- Action Buttons Grid -->
            <div class="action-buttons-grid" style="
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            ">
                <!-- 1. Click-to-Call -->
                <button class="action-btn royal-blue-btn" onclick="handleActionButton('click-to-call')" style="
                    background: #4169e1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 20px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
                    text-align: center;
                ">
                    Click-to-Call
                </button>
                
                <!-- 2. URGENT CALL -->
                <button class="action-btn royal-blue-btn" onclick="handleActionButton('urgent-call')" style="
                    background: #4169e1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 20px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
                    text-align: center;
                ">
                    URGENT CALL
                </button>
                
                <!-- 3. FREE Consultation -->
                <button class="action-btn royal-blue-btn" onclick="handleActionButton('free-consultation')" style="
                    background: #4169e1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 20px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
                    text-align: center;
                ">
                    FREE Consultation
                </button>
                
                <!-- 4. FREE BOOK -->
                <button class="action-btn royal-blue-btn" onclick="handleActionButton('free-book')" style="
                    background: #4169e1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 20px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
                    text-align: center;
                ">
                    FREE BOOK
                </button>
                
                <!-- 5. Pre Qualification -->
                <button class="action-btn royal-blue-btn" onclick="handleActionButton('pre-qualification')" style="
                    background: #4169e1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 20px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(65, 105, 225, 0.3);
                    text-align: center;
                ">
                    Pre Qualification
                </button>
                
                <!-- 6. Skip for Now -->
                <button class="action-btn skip-btn" onclick="handleActionButton('skip')" style="
                    background: #95a5a6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 20px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(149, 165, 166, 0.3);
                    text-align: center;
                ">
                    Skip for Now
                </button>
            </div>
        </div>
    `;
    
    // Add hover effects via style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .action-center-inline {
            width: 100%;
            animation: slideInFromBottom 0.4s ease-out;
        }
        
        @keyframes slideInFromBottom {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .royal-blue-btn:hover {
            background: #3557c7 !important;
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 25px rgba(65, 105, 225, 0.4) !important;
        }
        
        .royal-blue-btn:active {
            transform: translateY(-1px) scale(0.98);
        }
        
        .skip-btn:hover {
            background: #7f8c8d !important;
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 25px rgba(149, 165, 166, 0.4) !important;
        }
        
        .skip-btn:active {
            transform: translateY(-1px) scale(0.98);
        }
    `;
    document.head.appendChild(styleElement);
    
    // Append to chat messages container
    chatContainer.appendChild(actionCenter);
    
    // Scroll to show the Action Center
    setTimeout(() => {
        actionCenter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    console.log('✅ Communication Action Center displayed inline (CORPORATE DESIGN)');
}

function hideCommunicationActionCenter() {
    const actionCenter = document.getElementById('communication-action-center');
    if (actionCenter) {
        actionCenter.style.animation = 'slideOutToBottom 0.3s ease-in';
        setTimeout(() => {
            actionCenter.remove();
            console.log('✅ Communication Action Center removed');
        }, 300);
    }
}

// ================================
// ACTION BUTTON HANDLERS
// ================================
function handleActionButton(action) {
    console.log('🎯 Action button clicked:', action);
    
    // Capture the action type
    window.capturedLeadData.actionType = action;
    
    switch(action) {
        case 'click-to-call':
            showContactForm('Click-to-Call Request', 'click-to-call');
            break;
        case 'urgent-call':
            showContactForm('URGENT CALL Request', 'urgent-call');
            break;
        case 'free-consultation':
            showContactForm('Schedule Free Consultation', 'free-consultation');
            break;
        case 'free-book':
            showContactForm('Send Me The Free Book', 'free-book');
            break;
        case 'pre-qualification':
            showContactForm('Pre-Qualification Request', 'pre-qualification');
            break;
        case 'skip':
            hideCommunicationActionCenter();
            console.log('User chose to skip');
            // Continue conversation
            if (window.addSystemMessage) {
                window.addSystemMessage("No problem! Feel free to ask me anything else about your practice.");
            }
            break;
    }
}

// ================================
// CONTACT FORM SYSTEM
// ================================
function showContactForm(title, actionType) {
    console.log('📝 Showing contact form:', title, actionType);
    
    // Hide Action Center
    hideCommunicationActionCenter();
    
    // Create form overlay
    const formOverlay = document.createElement('div');
    formOverlay.id = 'contact-form-overlay';
    formOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    formOverlay.innerHTML = `
        <div class="contact-form-container" style="
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.4s ease;
        ">
            <h2 style="margin-bottom: 10px; color: #2c3e50;">${title}</h2>
            <p style="color: #7f8c8d; margin-bottom: 30px; font-size: 14px;">We'll get back to you right away!</p>
            
            <form id="quick-contact-form">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600;">
                        Name *
                    </label>
                    <input type="text" id="form-name" required style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e0e0e0;
                        border-radius: 8px;
                        font-size: 16px;
                        transition: border-color 0.3s;
                    " value="${window.capturedLeadData.name || ''}">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600;">
                        Email *
                    </label>
                    <input type="email" id="form-email" required style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e0e0e0;
                        border-radius: 8px;
                        font-size: 16px;
                        transition: border-color 0.3s;
                    " value="${window.capturedLeadData.email || ''}">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600;">
                        Phone *
                    </label>
                    <input type="tel" id="form-phone" required style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e0e0e0;
                        border-radius: 8px;
                        font-size: 16px;
                        transition: border-color 0.3s;
                    " value="${window.capturedLeadData.phone || ''}">
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600;">
                        Message (Optional)
                    </label>
                    <textarea id="form-message" rows="4" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e0e0e0;
                        border-radius: 8px;
                        font-size: 16px;
                        resize: vertical;
                        transition: border-color 0.3s;
                    "></textarea>
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <button type="submit" style="
                        flex: 1;
                        background: #4169e1;
                        color: white;
                        border: none;
                        padding: 14px 24px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">
                        Submit
                    </button>
                    <button type="button" onclick="closeContactForm()" style="
                        flex: 0.3;
                        background: #e0e0e0;
                        color: #2c3e50;
                        border: none;
                        padding: 14px 24px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(formOverlay);
    
    // Add form submit handler
    document.getElementById('quick-contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit(actionType);
    });
    
    // Focus first empty field
    setTimeout(() => {
        if (!window.capturedLeadData.name) {
            document.getElementById('form-name').focus();
        } else if (!window.capturedLeadData.email) {
            document.getElementById('form-email').focus();
        } else if (!window.capturedLeadData.phone) {
            document.getElementById('form-phone').focus();
        }
    }, 100);
}

function closeContactForm() {
    const overlay = document.getElementById('contact-form-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }
}

function handleFormSubmit(actionType) {
    console.log('📤 Handling form submit for:', actionType);
    
    // Get form values
    const formData = {
        name: document.getElementById('form-name').value.trim(),
        email: document.getElementById('form-email').value.trim(),
        phone: document.getElementById('form-phone').value.trim(),
        message: document.getElementById('form-message').value.trim(),
        actionType: actionType,
        intent: window.capturedLeadData.intent || 'Not specified'
    };
    
    // Validate
    if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (!validateEmail(formData.email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    if (!validatePhone(formData.phone)) {
        alert('Please enter a valid phone number');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#quick-contact-form button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Send via EmailJS
    sendEmailJS(formData)
        .then(function(response) {
            console.log('✅ Email sent successfully!');
            
            // Update captured lead data
            captureLeadData(formData);
            
            // Close form
            closeContactForm();
            
            // Show success banner
            if (window.showUniversalBanner) {
                window.showUniversalBanner('emailSent');
            }
            
            // Add success message to chat
            if (window.addSystemMessage) {
                window.addSystemMessage("Perfect! I've sent your information to Bruce. Someone will reach out to you shortly!");
            }
        })
        .catch(function(error) {
            console.error('❌ Email send failed:', error);
            alert('Sorry, there was an error sending your message. Please try again or call us directly at (800) 625-1196');
            submitBtn.textContent = 'Submit';
            submitBtn.disabled = false;
        });
}

// ================================
// GLOBAL FUNCTIONS
// ================================
window.showCommunicationActionCenter = showCommunicationActionCenter;
window.hideCommunicationActionCenter = hideCommunicationActionCenter;
window.handleActionButton = handleActionButton;
window.showSmartButtons = showSmartButtons;
window.handleSmartButton = handleSmartButton;
window.captureLeadData = captureLeadData;
window.sendEmailJS = sendEmailJS;
window.closeContactForm = closeContactForm;

console.log('✅ ACTION SYSTEM UNIFIED - Loaded successfully (CORPORATE DESIGN)');
