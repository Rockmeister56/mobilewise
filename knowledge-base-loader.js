// ===================================================
// 🧠 MOBILE-WISE AI KNOWLEDGE BASE LOADER V2.0
// Empire-Ready: Industry + Client Architecture
// ===================================================

class KnowledgeBaseLoader {
    constructor() {
        this.industryKB = null;
        this.clientKB = null;
        this.currentIndustry = 'cpa-practice-sales';
        this.currentClient = 'new-clients-inc';
        this.isLoaded = false;
        
        console.log('🧠 Mobile-Wise Knowledge Base System V2.0 initialized');
    }
    
    // ===================================================
    // 📥 LOAD BOTH KNOWLEDGE BASES
    // ===================================================
    async loadKnowledgeBases(industryName = null, clientName = null) {
        try {
            const industry = industryName || this.currentIndustry;
            const client = clientName || this.currentClient;
            
            console.log(`📥 Loading Industry KB: ${industry}`);
            console.log(`📥 Loading Client KB: ${client}`);
            
            // Load industry KB (generic)
            const industryResponse = await fetch(`/knowledge-bases/${industry}.json`);
            if (!industryResponse.ok) {
                throw new Error(`Industry KB not found: ${industry}`);
            }
            this.industryKB = await industryResponse.json();
            console.log(`✅ Industry KB loaded: ${this.industryKB.questions?.length || 0} questions`);
            
            // Load client KB (specific)
            const clientResponse = await fetch(`/client-specific/${client}.json`);
            if (!clientResponse.ok) {
                throw new Error(`Client KB not found: ${client}`);
            }
            this.clientKB = await clientResponse.json();
            console.log(`✅ Client KB loaded: ${this.clientKB.client_specific_questions?.length || 0} client questions`);
            
            this.isLoaded = true;
            console.log('🚀 Knowledge Base System V2.0 ready!');
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to load knowledge bases:', error);
            this.isLoaded = false;
            return false;
        }
    }
    
    // ===================================================
    // 🎯 GET RESPONSE WITH PRIORITY SYSTEM
    // ===================================================
    async getResponse(userInput, conversationState = 'initial') {
        if (!this.isLoaded) {
            console.warn('⚠️ Knowledge bases not loaded yet, loading now...');
            await this.loadKnowledgeBases();
        }
        
        const input = userInput.toLowerCase().trim();
        console.log('🔍 Searching for:', input);
        
        // ===================================================
        // PRIORITY 1: CLIENT-SPECIFIC QUESTIONS (HIGHEST)
        // ===================================================
        if (this.clientKB && this.clientKB.client_specific_questions) {
            const clientMatch = this.findBestMatch(input, this.clientKB.client_specific_questions);
            if (clientMatch) {
                console.log('✅ CLIENT-SPECIFIC match found:', clientMatch.id);
                return this.buildResponse(clientMatch, 'client-specific');
            }
        }
        
        // ===================================================
        // PRIORITY 2: INDUSTRY QUESTIONS (MEDIUM)
        // ===================================================
        if (this.industryKB && this.industryKB.questions) {
            const industryMatch = this.findBestMatch(input, this.industryKB.questions);
            if (industryMatch) {
                console.log('✅ INDUSTRY match found:', industryMatch.id);
                return this.buildResponse(industryMatch, 'industry');
            }
        }
        
        // ===================================================
        // PRIORITY 3: FALLBACK (LOWEST)
        // ===================================================
        console.log('⚠️ No specific match - using fallback');
        return this.buildFallbackResponse();
    }
    
    // ===================================================
    // 🔍 FIND BEST MATCHING QUESTION
    // ===================================================
    findBestMatch(input, questions) {
        let bestMatch = null;
        let highestScore = 0;
        
        for (const question of questions) {
            let score = 0;
            
            // Check triggers (exact phrases)
            if (question.triggers) {
                for (const trigger of question.triggers) {
                    if (input.includes(trigger.toLowerCase())) {
                        score += 10;
                    }
                }
            }
            
            // Check keywords (individual words)
            if (question.keywords) {
                for (const keyword of question.keywords) {
                    if (input.includes(keyword.toLowerCase())) {
                        score += 3;
                    }
                }
            }
            
            // Priority boost for client-specific
            if (question.priority === 'high') {
                score += 5;
            }
            
            if (score > highestScore) {
                highestScore = score;
                bestMatch = question;
            }
        }
        
        // Require minimum score
        if (highestScore >= 3) {
            console.log(`🎯 Match score: ${highestScore} for question: ${bestMatch.id}`);
            return bestMatch;
        }
        
        return null;
    }
    
    // ===================================================
    // 🏗️ BUILD RESPONSE OBJECT
    // ===================================================
    buildResponse(question, source) {
        const response = {
            response: question.response,
            source: source,
            questionId: question.id,
            category: question.category || 'general'
        };
        
        // ===================================================
        // BANNER TRIGGER LOGIC (Client-specific mapping)
        // ===================================================
        if (source === 'client-specific' && question.triggerBanner) {
            // Client already specified exact banner
            response.triggerBanner = question.triggerBanner;
            console.log(`🎨 Client banner: ${question.triggerBanner}`);
            
        } else if (source === 'industry' && question.triggerAction) {
            // Industry specified action, map to client banner
            const clientBanner = this.clientKB?.banner_triggers?.[question.triggerAction];
            if (clientBanner) {
                response.triggerBanner = clientBanner;
                console.log(`🎨 Industry action "${question.triggerAction}" → Client banner "${clientBanner}"`);
            }
        }
        
        // ===================================================
        // TESTIMONIAL TRIGGER LOGIC
        // ===================================================
        if (question.triggerTestimonial) {
            // Direct testimonial specified
            response.triggerTestimonial = question.triggerTestimonial;
            console.log(`🎙️ Testimonial: ${question.triggerTestimonial}`);
            
        } else if (question.testimonial_trigger && question.category) {
            // Map category to testimonial
            const testimonialKey = `${question.category}_${question.testimonial_type || 'general'}`;
            const testimonialMapping = this.clientKB?.testimonial_triggers?.[testimonialKey];
            if (testimonialMapping) {
                response.triggerTestimonial = testimonialMapping;
                console.log(`🎙️ Category "${testimonialKey}" → Testimonial "${testimonialMapping}"`);
            }
        }
        
        // State changes
        if (question.newState) {
            response.newState = question.newState;
        }
        
        return response;
    }
    
    // ===================================================
    // 🛡️ FALLBACK RESPONSE
    // ===================================================
    buildFallbackResponse() {
        const clientName = this.clientKB?.company_info?.owner || 'our specialist';
        const phone = this.clientKB?.company_info?.phone || '';
        
        return {
            response: this.clientKB?.fallback_response || 
                     `That's a great question! ${clientName} would be happy to help you personally. Would you like to schedule a consultation?`,
            source: 'fallback',
            questionId: 'fallback',
            triggerBanner: 'avatar',
            category: 'general'
        };
    }
    
    // ===================================================
    // 🔄 SWITCH INDUSTRY/CLIENT (FOR CLONING)
    // ===================================================
    async switchIndustry(industryName) {
        console.log(`🔄 Switching to industry: ${industryName}`);
        this.currentIndustry = industryName;
        return await this.loadKnowledgeBases(industryName, this.currentClient);
    }
    
    async switchClient(clientName) {
        console.log(`🔄 Switching to client: ${clientName}`);
        this.currentClient = clientName;
        return await this.loadKnowledgeBases(this.currentIndustry, clientName);
    }
    
    // ===================================================
    // 📊 GET CLIENT INFO (FOR DYNAMIC RESPONSES)
    // ===================================================
    getClientInfo() {
        return this.clientKB?.company_info || {};
    }
    
    getClientCredentials() {
        return this.clientKB?.credentials || {};
    }
    
    getClosingTemplate(type = 'general_help', topic = 'your question') {
        const template = this.clientKB?.closing_templates?.[type] || 
                        "Is there anything else I can help you with?";
        return template.replace('{topic}', topic);
    }
}

// ===================================================
// 🚀 AUTO-INITIALIZE ON PAGE LOAD
// ===================================================
window.knowledgeBaseLoader = new KnowledgeBaseLoader();

// Auto-load on page ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await window.knowledgeBaseLoader.loadKnowledgeBases();
    });
} else {
    window.knowledgeBaseLoader.loadKnowledgeBases();
}

console.log('🧠 Mobile-Wise Knowledge Base Loader V2.0 System loaded!');
console.log('🎯 Commands: switchIndustry(name), switchClient(name), getClientInfo()');
