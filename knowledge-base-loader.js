// ===================================================
// 🧠 KNOWLEDGE BASE LOADER - PRIORITY SYSTEM
// ===================================================
class KnowledgeBaseLoader {
    constructor() {
        this.industryKB = null;
        this.clientKB = null;
        this.currentIndustry = null;
        this.currentClient = null;
        console.log('🧠 Knowledge Base Loader initialized');
    }

    // Load both industry and client knowledge bases
    async loadKnowledgeBases(industry, client) {
        console.log(`📥 Loading knowledge bases: ${industry} + ${client}`);
        
        try {
            // Load industry knowledge base
            const industryResponse = await fetch(`/knowledge-bases/${industry}.json`);
            if (industryResponse.ok) {
                this.industryKB = await industryResponse.json();
                console.log(`✅ Industry KB loaded: ${industry}`);
            } else {
                console.warn(`⚠️ Industry KB not found: ${industry}`);
            }

            // Load client-specific knowledge base
            const clientResponse = await fetch(`/client-specific/${client}.json`);
            if (clientResponse.ok) {
                this.clientKB = await clientResponse.json();
                console.log(`✅ Client KB loaded: ${client}`);
            } else {
                console.warn(`⚠️ Client KB not found: ${client}`);
            }

            this.currentIndustry = industry;
            this.currentClient = client;

            return {
                industryLoaded: !!this.industryKB,
                clientLoaded: !!this.clientKB
            };

        } catch (error) {
            console.error('❌ Error loading knowledge bases:', error);
            return {
                industryLoaded: false,
                clientLoaded: false,
                error: error.message
            };
        }
    }

    // Get response with priority system
    async getResponse(userInput, conversationState = 'initial') {
        console.log('🧠 Processing:', userInput);

        // Handle first name collection
        if (conversationState === 'getting_first_name') {
            return this.handleNameCollection(userInput);
        }

        // Initial greeting
        if (conversationState === 'initial') {
            return {
                response: this.clientKB?.defaultGreeting || "Hi! What's your first name?",
                newState: 'getting_first_name',
                triggerBanner: null
            };
        }

        const input = userInput.toLowerCase();

        // PRIORITY 1: Check CLIENT-SPECIFIC knowledge first
        if (this.clientKB && this.clientKB.questions) {
            const clientMatch = this.findBestMatch(input, this.clientKB.questions);
            if (clientMatch && clientMatch.score > 2) {
                console.log('✅ CLIENT-SPECIFIC match found:', clientMatch.question.id);
                return this.formatResponse(clientMatch.question, 'client');
            }
        }

        // PRIORITY 2: Check INDUSTRY knowledge
        if (this.industryKB && this.industryKB.questions) {
            const industryMatch = this.findBestMatch(input, this.industryKB.questions);
            if (industryMatch && industryMatch.score > 2) {
                console.log('✅ INDUSTRY match found:', industryMatch.question.id);
                return this.formatResponse(industryMatch.question, 'industry');
            }
        }

        // PRIORITY 3: Fallback
        console.log('⚠️ No match found - using fallback');
        return this.getFallbackResponse();
    }

    // Find best matching question
    findBestMatch(input, questions) {
        let bestMatch = null;
        let highestScore = 0;

        for (const question of questions) {
            let score = 0;

            // Check patterns (highest weight)
            if (question.patterns) {
                for (const pattern of question.patterns) {
                    if (input.includes(pattern.toLowerCase())) {
                        score += 3;
                    }
                }
            }

            // Check keywords (medium weight)
            if (question.keywords) {
                for (const keyword of question.keywords) {
                    if (input.includes(keyword.toLowerCase())) {
                        score += 1;
                    }
                }
            }

            // Priority boost for client-specific
            if (question.priority === 'high') {
                score += 1;
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = question;
            }
        }

        return bestMatch ? { question: bestMatch, score: highestScore } : null;
    }

    // Format response with personalization
    formatResponse(question, source) {
        let response = question.response;

        // Personalize with first name if available
        const firstName = window.leadData?.firstName || '';
        if (firstName) {
            // Add name to response naturally
            response = response.replace(/^(Excellent|Perfect|Great|That's fantastic)!/, `$1 ${firstName}!`);
        }

        return {
            response: response,
            newState: 'conversational',
            followUp: question.followUp || null,
            triggerBanner: question.triggerBanner || null,
            triggerTestimonial: question.triggerTestimonial || null,
            source: source,
            questionId: question.id
        };
    }

    // Handle name collection
    handleNameCollection(userInput) {
        const words = userInput.trim().split(' ');
        const extractedName = words[0].replace(/[^a-zA-Z]/g, '');
        
        if (extractedName.length > 0) {
            const firstName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
            
            // Store in window.leadData
            if (!window.leadData) {
                window.leadData = {};
            }
            window.leadData.firstName = firstName;

            return {
                response: `Great to meet you ${firstName}! How can I help you today - are you looking to buy a practice, sell your practice, or get a practice valuation?`,
                newState: 'conversational',
                triggerBanner: null
            };
        } else {
            return {
                response: "I didn't catch your name. What should I call you?",
                newState: 'getting_first_name',
                triggerBanner: null
            };
        }
    }

    // Fallback response
    getFallbackResponse() {
        const firstName = window.leadData?.firstName || '';
        const response = firstName 
            ? `${firstName}, that's a great question! Let me connect you with our expert who can provide detailed information about that. Would you like to schedule a FREE consultation?`
            : "That's a great question! Let me connect you with our expert who can provide detailed information. Would you like to schedule a consultation?";

        return {
            response: response,
            newState: 'conversational',
            triggerBanner: 'consultation',
            source: 'fallback'
        };
    }

    // Get system status
    getStatus() {
        return {
            industryLoaded: !!this.industryKB,
            clientLoaded: !!this.clientKB,
            currentIndustry: this.currentIndustry,
            currentClient: this.currentClient,
            industryQuestions: this.industryKB?.questions?.length || 0,
            clientQuestions: this.clientKB?.questions?.length || 0
        };
    }
}

// Initialize global loader
window.knowledgeBaseLoader = new KnowledgeBaseLoader();

// Auto-load knowledge bases on page load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Auto-loading knowledge bases...');
    
    // Load New Clients Inc + CPA Practice Sales
    const result = await window.knowledgeBaseLoader.loadKnowledgeBases(
        'cpa-practice-sales',
        'new-clients-inc'
    );
    
    if (result.industryLoaded && result.clientLoaded) {
        console.log('✅ Knowledge Base System ready!');
        console.log('📊 Status:', window.knowledgeBaseLoader.getStatus());
    } else {
        console.warn('⚠️ Some knowledge bases failed to load:', result);
    }
});

console.log('🧠 Knowledge Base Loader System loaded!');
