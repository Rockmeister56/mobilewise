// ===================================================
// 🚀 CONVERSATION ENGINE - ZERO LATENCY EDITION
// ===================================================
// Handles all conversation logic with INSTANT response times
// No async calls, no fetch delays - pure JavaScript speed
// Target: <10ms response time
// Date: October 15, 2025
// Captain: Mobile-Wise AI Empire
// ===================================================

class ConversationEngine {
    constructor() {
        this.knowledgeBase = window.knowledgeBaseData;
        this.currentState = 'initial';
        
        if (!this.knowledgeBase) {
            console.error('❌ knowledgeBaseData not found! Load data.js first.');
            return;
        }
        
        console.log('🚀 Conversation Engine Ready - Zero latency mode!');
    }
    
    // ===================================================
    // 🎯 MAIN RESPONSE HANDLER - INSTANT
    // ===================================================
    getResponse(userInput, firstName = '') {
        const userText = userInput.toLowerCase().trim();
        const startTime = performance.now();
        
        console.log(`⚡ Processing: "${userInput}" in state: ${this.currentState}`);
        
        // 1️⃣ CHECK OBJECTIONS (if applicable)
        if (this.shouldCheckObjections()) {
            const objection = this.checkObjection(userText, firstName);
            if (objection) {
                const endTime = performance.now();
                console.log(`✅ Objection response in ${(endTime - startTime).toFixed(2)}ms`);
                return objection;
            }
        }
        
        // 2️⃣ HANDLE CURRENT STATE
        const stateResponse = this.handleState(userText, userInput, firstName);
        if (stateResponse) {
            const endTime = performance.now();
            console.log(`✅ Response generated in ${(endTime - startTime).toFixed(2)}ms`);
            return stateResponse;
        }
        
        // 3️⃣ CHECK GENERAL QUESTIONS
        const generalResponse = this.checkGeneralQuestions(userText, firstName);
        if (generalResponse) {
            const endTime = performance.now();
            console.log(`✅ General question in ${(endTime - startTime).toFixed(2)}ms`);
            return generalResponse;
        }
        
        // 4️⃣ FALLBACK
        const fallback = this.getFallback(firstName);
        const endTime = performance.now();
        console.log(`✅ Fallback in ${(endTime - startTime).toFixed(2)}ms`);
        return fallback;
    }
    
    // ===================================================
    // 🎯 STATE HANDLERS
    // ===================================================
    handleState(userText, originalInput, firstName) {
        const state = this.knowledgeBase.conversation_states[this.currentState];
        if (!state) return null;
        
        // STATE: INITIAL
        if (this.currentState === 'initial') {
            // Check if we need to ask for name first
            if (!firstName) {
                // Check for business intent keywords
                const hasBusinessIntent = this.hasBusinessKeywords(userText);
                
                if (!hasBusinessIntent) {
                    return {
                        response: state.triggers.name_request.response,
                        newState: 'getting_first_name',
                        source: 'initial_state'
                    };
                }
            }
            
            // Check intents
            for (const [intent, trigger] of Object.entries(state.triggers)) {
                if (intent === 'name_request') continue;
                
                if (this.hasKeywords(userText, trigger.keywords)) {
                    const response = firstName ? 
                        this.replacePlaceholders(trigger.response_with_name, firstName) : 
                        trigger.response;
                    
                    this.currentState = trigger.next_state;
                    return {
                        response: response,
                        newState: trigger.next_state,
                        triggerBanner: trigger.trigger_banner,
                        source: 'intent_detection',
                        intent: intent
                    };
                }
            }
            
            // No intent detected
            const fallback = firstName ?
                `${firstName}, I'm here to help with CPA firm transactions - buying, selling, and practice valuations. What brings you here today?` :
                "Hi there! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. What brings you here today?";
            
            return {
                response: fallback,
                newState: 'initial',
                source: 'initial_fallback'
            };
        }
        
        // STATE: GETTING_FIRST_NAME
        if (this.currentState === 'getting_first_name') {
            const name = this.extractFirstName(originalInput);
            
            if (name) {
                const response = this.replacePlaceholders(
                    state.response_success,
                    name
                );
                
                this.currentState = state.next_state;
                return {
                    response: response,
                    newState: state.next_state,
                    source: 'name_captured',
                    extractedData: { firstName: name }
                };
            } else {
                return {
                    response: state.response_retry,
                    newState: this.currentState,
                    source: 'name_retry'
                };
            }
        }
        
        // STATES: ASKING FOR CONSULTATION (yes/no handlers)
        if (this.currentState.includes('asking_') && this.currentState.includes('_consultation')) {
            // Check for YES
            if (state.yes_triggers && state.yes_triggers.some(trigger => userText.includes(trigger))) {
                return {
                    response: "",
                    newState: this.currentState,
                    action: state.yes_action,
                    source: 'consultation_yes'
                };
            }
            
            // Check for NO
            if (state.no_triggers && state.no_triggers.some(trigger => userText.includes(trigger))) {
                const response = firstName ?
                    this.replacePlaceholders(state.no_response_with_name, firstName) :
                    state.no_response;
                
                this.currentState = state.no_next_state;
                return {
                    response: response,
                    newState: state.no_next_state,
                    triggerBanner: state.no_trigger_banner,
                    source: 'consultation_no'
                };
            }
            
            // Unclear - clarify
            const clarify = firstName ?
                this.replacePlaceholders(state.clarify_response_with_name, firstName) :
                state.clarify_response;
            
            return {
                response: clarify,
                newState: this.currentState,
                source: 'consultation_clarify'
            };
        }
        
        // STATES: DATA COLLECTION (extract numbers/revenue)
        if (state.action) {
            let extractedData = {};
            let response = state.response || state.response_no_name;
            
            // Extract data based on action type
            if (state.action === 'extract_number') {
                const number = this.extractNumber(originalInput);
                extractedData.number = number;
                response = response.replace('{number}', number);
            }
            
            if (state.action === 'extract_revenue') {
                const revenue = this.extractRevenue(originalInput);
                extractedData.revenue = revenue;
                response = response.replace('{revenue}', revenue);
            }
            
            if (state.action === 'extract_budget') {
                const budget = this.extractBudget(originalInput);
                extractedData.budget = budget;
                response = response.replace('{budget}', budget);
            }
            
            if (state.action === 'extract_years') {
                const years = this.extractYears(originalInput);
                extractedData.years = years;
                response = response.replace('{years}', years);
            }
            
            // Use personalized response if available
            if (firstName && state.response) {
                response = this.replacePlaceholders(state.response, firstName);
            } else if (firstName && state.response_with_name) {
                response = this.replacePlaceholders(state.response_with_name, firstName);
            }
            
            // Replace extracted data placeholders
            for (const [key, value] of Object.entries(extractedData)) {
                response = response.replace(`{${key}}`, value);
            }
            
            this.currentState = state.next_state;
            return {
                response: response,
                newState: state.next_state,
                triggerBanner: state.trigger_banner,
                extractedData: extractedData,
                source: 'data_extraction'
            };
        }
        
        // STATES: ASKING_IF_MORE_HELP (final state)
        if (this.currentState === 'asking_if_more_help') {
            // Check for NO
            if (state.no_triggers && state.no_triggers.some(trigger => userText.includes(trigger))) {
                const response = firstName ?
                    this.replacePlaceholders(state.no_response_with_name, firstName) :
                    state.no_response;
                
                this.currentState = state.no_next_state;
                return {
                    response: response,
                    newState: state.no_next_state,
                    triggerBanner: state.no_trigger_banner,
                    source: 'more_help_no'
                };
            }
            
            // Assume YES
            const response = firstName ?
                this.replacePlaceholders(state.yes_response_with_name, firstName) :
                state.yes_response;
            
            this.currentState = state.yes_next_state;
            return {
                response: response,
                newState: state.yes_next_state,
                source: 'more_help_yes'
            };
        }
        
        // DEFAULT: Use basic response from state
        if (state.response || state.response_with_name) {
            const response = firstName && state.response_with_name ?
                this.replacePlaceholders(state.response_with_name, firstName) :
                state.response || state.response_with_name;
            
            this.currentState = state.next_state || this.currentState;
            return {
                response: response,
                newState: state.next_state || this.currentState,
                triggerBanner: state.trigger_banner,
                source: 'state_default'
            };
        }
        
        return null;
    }
    
    // ===================================================
    // 🚨 OBJECTION DETECTION
    // ===================================================
    shouldCheckObjections() {
        const objectionStates = [
            'selling_motivation_question',
            'buying_timeline_question',
            'valuation_years_question',
            'initial'
        ];
        return objectionStates.includes(this.currentState);
    }
    
    checkObjection(userText, firstName) {
        const objections = this.knowledgeBase.objection_handling?.objections || [];
        
        for (const objection of objections) {
            if (this.hasKeywords(userText, objection.keywords)) {
                const response = firstName ?
                    this.replacePlaceholders(objection.response_with_name, firstName) :
                    objection.response;
                
                console.log(`🎬 Objection detected: ${objection.type} → ${objection.testimonialOffer}`);
                
                return {
                    response: response,
                    response_with_name: objection.response_with_name,
                    testimonialOffer: objection.testimonialOffer,
                    no_response: objection.no_response,
                    no_response_with_name: objection.no_response_with_name,
                    no_action: objection.no_action,
                    type: objection.type,
                    newState: null,
                    source: 'objection_handler'
                };
            }
        }
        
        return null;
    }
    
    // ===================================================
    // 💡 GENERAL QUESTIONS
    // ===================================================
    checkGeneralQuestions(userText, firstName) {
        const questions = this.knowledgeBase.general_questions || [];
        
        for (const question of questions) {
            // Check triggers (exact phrase matching)
            if (question.triggers) {
                for (const trigger of question.triggers) {
                    if (userText.includes(trigger.toLowerCase())) {
                        const response = this.replacePlaceholders(question.response, firstName);
                        return {
                            response: response,
                            questionId: question.id,
                            triggerAction: question.triggerAction,
                            triggerTestimonial: question.triggerTestimonial,
                            category: question.category,
                            source: 'general_questions'
                        };
                    }
                }
            }
            
            // Check keywords (must match multiple)
            if (question.keywords) {
                const matchCount = question.keywords.filter(keyword => 
                    userText.includes(keyword.toLowerCase())
                ).length;
                
                if (matchCount >= 2) {
                    const response = this.replacePlaceholders(question.response, firstName);
                    return {
                        response: response,
                        questionId: question.id,
                        triggerAction: question.triggerAction,
                        triggerTestimonial: question.triggerTestimonial,
                        category: question.category,
                        source: 'general_questions'
                    };
                }
            }
        }
        
        return null;
    }
    
    // ===================================================
    // 🔧 HELPER METHODS
    // ===================================================
    hasBusinessKeywords(text) {
        const businessKeywords = ['buy', 'sell', 'value', 'worth', 'purchase', 'acquire', 'valuation'];
        return businessKeywords.some(keyword => text.includes(keyword));
    }
    
    hasKeywords(text, keywords) {
        if (!keywords || keywords.length === 0) return false;
        return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    }
    
    extractFirstName(input) {
        const words = input.trim().split(' ');
        const name = words[0].replace(/[^a-zA-Z]/g, '');
        
        if (name.length > 1 && name.length < 20) {
            return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }
        
        return null;
    }
    
    extractNumber(input) {
        const match = input.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
        return match ? match[0] : 'that many';
    }
    
    extractRevenue(input) {
        const match = input.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
        if (match) {
            const num = parseInt(match[0].replace(/,/g, ''));
            if (num >= 1000000) {
                return `$${(num / 1000000).toFixed(1)}M`;
            } else if (num >= 1000) {
                return `$${(num / 1000).toFixed(0)}K`;
            } else {
                return `$${match[0]}`;
            }
        }
        return 'that kind of revenue';
    }
    
    extractBudget(input) {
        const match = input.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);
        if (match) {
            const num = parseInt(match[0].replace(/,/g, ''));
            if (num >= 1000000) {
                return `$${(num / 1000000).toFixed(1)}M`;
            } else if (num >= 1000) {
                return `$${(num / 1000).toFixed(0)}K`;
            } else {
                return `$${match[0]}`;
            }
        }
        return 'that range';
    }
    
    extractYears(input) {
        const match = input.match(/(\d+)/);
        return match ? match[0] : 'that many';
    }
    
    replacePlaceholders(text, firstName) {
        if (!text) return text;
        return text.replace(/\{firstName\}/g, firstName || '');
    }
    
    getFallback(firstName) {
        const fallback = this.knowledgeBase.fallback_responses;
        
        if (!fallback) {
            return {
                response: "That's a great question! Would you like to schedule a consultation?",
                source: 'hardcoded_fallback'
            };
        }
        
        const response = firstName ?
            this.replacePlaceholders(fallback.no_match_with_name, firstName) :
            fallback.no_match;
        
        return {
            response: response,
            source: 'kb_fallback'
        };
    }
    
    // ===================================================
    // 🎯 STATE MANAGEMENT
    // ===================================================
    setState(newState) {
        console.log(`🔄 State change: ${this.currentState} → ${newState}`);
        this.currentState = newState;
    }
    
    getState() {
        return this.currentState;
    }
    
    resetState() {
        this.currentState = 'initial';
        console.log('🔄 State reset to initial');
    }
}

// ===================================================
// 🚀 INSTANT INITIALIZATION
// ===================================================
window.conversationEngine = new ConversationEngine();
console.log('✅ Conversation Engine v2.0 - READY FOR ACTION!');
console.log('🎯 Current state:', window.conversationEngine.getState());
