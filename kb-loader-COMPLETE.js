// ===================================================
// 🧠 KNOWLEDGE BASE LOADER - COMPLETE v2.0
// Handles conversation state, data extraction, testimonials
// ===================================================

class KnowledgeBaseLoader {
    constructor() {
        this.knowledgeBase = null;
        this.conversationStates = {};
        this.objectionHandlers = [];
        this.testimonials = {};
        this.generalQuestions = [];
        this.isLoaded = false;
        
        console.log('🧠 KB Loader v2.0 initialized');
    }
    
    // ===================================================
    // 📥 LOAD KNOWLEDGE BASE FROM JSON
    // ===================================================
    async loadKnowledgeBase(jsonPath) {
        try {
            console.log(`📥 Loading KB from: ${jsonPath}`);
            
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.knowledgeBase = await response.json();
            
            // Parse conversation states
            this.conversationStates = this.knowledgeBase.conversation_states || {};
            
            // Parse objection handlers
            if (this.knowledgeBase.objection_handling?.objections) {
                this.objectionHandlers = this.knowledgeBase.objection_handling.objections;
            }
            
            // Parse testimonials
            this.testimonials = this.knowledgeBase.testimonials || {};
            
            // Parse general questions
            this.generalQuestions = this.knowledgeBase.general_questions || [];
            
            this.isLoaded = true;
            
            console.log('✅ KB Loaded:', {
                conversationStates: Object.keys(this.conversationStates).length,
                objectionHandlers: this.objectionHandlers.length,
                testimonials: Object.keys(this.testimonials).length,
                generalQuestions: this.generalQuestions.length
            });
            
            return true;
            
        } catch (error) {
            console.error('❌ KB Load Failed:', error);
            this.isLoaded = false;
            return false;
        }
    }
    
    // ===================================================
    // 🎯 MAIN RESPONSE HANDLER
    // ===================================================
    async getResponse(userInput, currentState = 'initial') {
        if (!this.isLoaded) {
            console.log('⚠️ KB not loaded, using fallback');
            return this.getFallbackResponse();
        }
        
        const userText = userInput.toLowerCase().trim();
        const firstName = window.leadData?.firstName || '';
        
        console.log('🧠 KB Processing:', { userInput, currentState, firstName });
        
        // ===================================================
        // 1️⃣ CHECK FOR OBJECTIONS FIRST (in relevant states)
        // ===================================================
        if (this.shouldCheckObjections(currentState)) {
            const objectionResult = this.checkForObjection(userText, firstName);
            if (objectionResult) {
                console.log('🎯 Objection detected!');
                return objectionResult;
            }
        }
        
        // ===================================================
        // 2️⃣ HANDLE CURRENT CONVERSATION STATE
        // ===================================================
        if (this.conversationStates[currentState]) {
            const stateResult = await this.handleConversationState(
                currentState, 
                userText, 
                userInput,
                firstName
            );
            
            if (stateResult) {
                return stateResult;
            }
        }
        
        // ===================================================
        // 3️⃣ CHECK GENERAL QUESTIONS (fallback)
        // ===================================================
        const generalResult = this.searchGeneralQuestions(userText, firstName);
        if (generalResult) {
            console.log('💡 General question matched');
            return generalResult;
        }
        
        // ===================================================
        // 4️⃣ ULTIMATE FALLBACK
        // ===================================================
        console.log('🔄 Using fallback response');
        return this.getFallbackResponse(firstName);
    }
    
    // ===================================================
    // 🎯 HANDLE CONVERSATION STATE LOGIC
    // ===================================================
    async handleConversationState(currentState, userText, originalInput, firstName) {
        const state = this.conversationStates[currentState];
        
        console.log(`🎯 Processing state: ${currentState}`);
        
        // ===================================================
        // STATE: INITIAL (Name capture or intent detection)
        // ===================================================
        if (currentState === 'initial') {
            // Check if we need to ask for name first
            if (!firstName) {
                // Check for business intent keywords
                const hasBusinessIntent = this.hasBusinessKeywords(userText);
                
                if (!hasBusinessIntent) {
                    // Ask for name
                    return {
                        response: state.triggers.name_request.response,
                        newState: 'getting_first_name',
                        source: 'conversation_state'
                    };
                }
            }
            
            // Check for buy/sell/value intent
            for (const [key, trigger] of Object.entries(state.triggers)) {
                if (key === 'name_request') continue;
                
                if (this.matchesKeywords(userText, trigger.keywords)) {
                    const response = firstName ? 
                        this.replacePlaceholders(trigger.response_with_name, firstName) :
                        trigger.response;
                    
                    return {
                        response: response,
                        newState: trigger.next_state,
                        triggerBanner: trigger.trigger_banner,
                        source: 'conversation_state',
                        intent: key
                    };
                }
            }
            
            // No intent detected - generic response
            const fallback = firstName ?
                `${firstName}, I'm here to help with CPA firm transactions - buying, selling, and practice valuations. What brings you here today?` :
                "Hi there! I'm here to help with CPA firm transactions - buying, selling, and practice valuations. What brings you here today?";
            
            return {
                response: fallback,
                newState: 'initial',
                source: 'conversation_state'
            };
        }
        
        // ===================================================
        // STATE: GETTING_FIRST_NAME
        // ===================================================
        if (currentState === 'getting_first_name') {
            const extractedName = this.extractFirstName(originalInput);
            
            if (extractedName) {
                // Store name
                if (window.leadData) {
                    window.leadData.firstName = extractedName;
                }
                
                const response = this.replacePlaceholders(
                    state.response_success, 
                    extractedName
                );
                
                return {
                    response: response,
                    newState: state.next_state,
                    source: 'conversation_state',
                    extractedData: { firstName: extractedName }
                };
            } else {
                // Retry
                return {
                    response: state.response_retry,
                    newState: currentState, // Stay in same state
                    source: 'conversation_state'
                };
            }
        }
        
        // ===================================================
        // STATES: ASKING FOR CONSULTATION (yes/no handlers)
        // ===================================================
        if (currentState.includes('asking_') && currentState.includes('_consultation')) {
            // Check for YES
            if (state.yes_triggers && state.yes_triggers.some(trigger => userText.includes(trigger))) {
                return {
                    response: "", // Empty - will trigger lead capture
                    newState: currentState,
                    action: state.yes_action,
                    source: 'conversation_state'
                };
            }
            
            // Check for NO
            if (state.no_triggers && state.no_triggers.some(trigger => userText.includes(trigger))) {
                const response = firstName ?
                    this.replacePlaceholders(state.no_response_with_name, firstName) :
                    state.no_response;
                
                return {
                    response: response,
                    newState: state.no_next_state,
                    triggerBanner: state.no_trigger_banner,
                    source: 'conversation_state'
                };
            }
            
            // Unclear - clarify
            const clarify = firstName ?
                this.replacePlaceholders(state.clarify_response_with_name, firstName) :
                state.clarify_response;
            
            return {
                response: clarify,
                newState: currentState, // Stay in same state
                source: 'conversation_state'
            };
        }
        
        // ===================================================
        // STATES: DATA COLLECTION (extract numbers/revenue)
        // ===================================================
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
            
            return {
                response: response,
                newState: state.next_state,
                triggerBanner: state.trigger_banner,
                extractedData: extractedData,
                source: 'conversation_state'
            };
        }
        
        // ===================================================
        // STATES: ASKING_IF_MORE_HELP (final state)
        // ===================================================
        if (currentState === 'asking_if_more_help') {
            // Check for NO
            if (state.no_triggers && state.no_triggers.some(trigger => userText.includes(trigger))) {
                const response = firstName ?
                    this.replacePlaceholders(state.no_response_with_name, firstName) :
                    state.no_response;
                
                return {
                    response: response,
                    newState: state.no_next_state,
                    triggerBanner: state.no_trigger_banner,
                    source: 'conversation_state'
                };
            }
            
            // Assume YES - more help needed
            const response = firstName ?
                this.replacePlaceholders(state.yes_response_with_name, firstName) :
                state.yes_response;
            
            return {
                response: response,
                newState: state.yes_next_state,
                source: 'conversation_state'
            };
        }
        
        // ===================================================
        // DEFAULT: Use basic response from state
        // ===================================================
        if (state.response || state.response_with_name) {
            const response = firstName && state.response_with_name ?
                this.replacePlaceholders(state.response_with_name, firstName) :
                state.response || state.response_with_name;
            
            return {
                response: response,
                newState: state.next_state || currentState,
                triggerBanner: state.trigger_banner,
                source: 'conversation_state'
            };
        }
        
        return null;
    }
    
    // ===================================================
    // 🚨 OBJECTION DETECTION & TESTIMONIAL TRIGGERING
    // ===================================================
    shouldCheckObjections(state) {
        // Only check objections in certain states
        const objectionStates = [
            'selling_motivation_question',
            'buying_timeline_question',
            'valuation_years_question',
            'initial'
        ];
        
        return objectionStates.includes(state);
    }
    
    checkForObjection(userText, firstName) {
        for (const objection of this.objectionHandlers) {
            if (this.matchesKeywords(userText, objection.keywords)) {
                const response = firstName ?
                    this.replacePlaceholders(objection.response_with_name, firstName) :
                    objection.response;
                
                console.log(`🎬 Objection detected: ${objection.type} → ${objection.testimonial}`);
                
                return {
                    response: response,
                    triggerTestimonial: objection.testimonial,
                    newState: null, // Stay in current state
                    source: 'objection_handler',
                    objectionType: objection.type
                };
            }
        }
        
        return null;
    }
    
    // ===================================================
    // 💡 GENERAL QUESTIONS SEARCH
    // ===================================================
    searchGeneralQuestions(userText, firstName) {
        for (const question of this.generalQuestions) {
            // Check triggers (exact phrase matching)
            if (question.triggers) {
                for (const trigger of question.triggers) {
                    if (userText.includes(trigger.toLowerCase())) {
                        return this.buildGeneralQuestionResponse(question, firstName);
                    }
                }
            }
            
            // Check keywords (must match multiple)
            if (question.keywords) {
                const matchCount = question.keywords.filter(keyword => 
                    userText.includes(keyword.toLowerCase())
                ).length;
                
                if (matchCount >= 2) {
                    return this.buildGeneralQuestionResponse(question, firstName);
                }
            }
        }
        
        return null;
    }
    
    buildGeneralQuestionResponse(question, firstName) {
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
    
    // ===================================================
    // 🔍 DATA EXTRACTION UTILITIES
    // ===================================================
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
    
    // ===================================================
    // 🔧 HELPER UTILITIES
    // ===================================================
    hasBusinessKeywords(text) {
        const businessKeywords = ['buy', 'sell', 'value', 'worth', 'purchase', 'acquire', 'valuation'];
        return businessKeywords.some(keyword => text.includes(keyword));
    }
    
    matchesKeywords(text, keywords) {
        if (!keywords || keywords.length === 0) return false;
        return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    }
    
    replacePlaceholders(text, firstName) {
        if (!text) return text;
        return text.replace(/\{firstName\}/g, firstName || '');
    }
    
    getFallbackResponse(firstName) {
        const fallback = this.knowledgeBase?.fallback_responses;
        
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
            source: 'fallback'
        };
    }
    
    // ===================================================
    // 📊 DEBUG UTILITIES
    // ===================================================
    getStatus() {
        return {
            isLoaded: this.isLoaded,
            conversationStates: Object.keys(this.conversationStates).length,
            objectionHandlers: this.objectionHandlers.length,
            testimonials: Object.keys(this.testimonials).length,
            generalQuestions: this.generalQuestions.length
        };
    }
}

// ===================================================
// 🚀 INITIALIZE & EXPORT
// ===================================================
window.knowledgeBaseLoader = new KnowledgeBaseLoader();

// Auto-load KB on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Auto-loading Knowledge Base...');
    
    // Try to load CPA practice sales KB
    const loaded = await window.knowledgeBaseLoader.loadKnowledgeBase('cpa-practice-sales-COMPLETE.json');
    
    if (loaded) {
        console.log('✅ KB Auto-load successful');
        console.log('📊 KB Status:', window.knowledgeBaseLoader.getStatus());
    } else {
        console.log('⚠️ KB Auto-load failed - will use fallback responses');
    }
});

console.log('✅ KB Loader v2.0 ready');
