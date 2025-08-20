// ===========================================
// CALL-TO-ACTION GENERATOR ENGINE  
// Combines Knowledge + Closing Techniques
// ===========================================

class CTAGenerator {
    constructor(knowledgeBase, closingTechniques, objectionHandlers) {
        this.knowledge = knowledgeBase;
        this.closing = closingTechniques;
        this.objections = objectionHandlers;
    }
    
    // MAIN RESPONSE GENERATOR
    generateClosingResponse(topic, userMessage) {
        // Get base knowledge response
        const baseResponse = this.findKnowledgeResponse(topic, userMessage);
        
        // Select closing elements
        const urgency = this.getRandomElement(this.closing.urgencyBuilders);
        const cta = this.generateSmartCTA(topic, userMessage);
        const social = this.getRandomElement(this.closing.socialProof);
        const risk = this.getRandomElement(this.closing.riskReversals);
        
        // Build complete closing sequence
        const fullResponse = `${baseResponse}\n\n${urgency}. ${cta}\n\n${social}. ${risk}`;
        
        return {
            message: fullResponse,
            action: this.determineAction(topic),
            nextSteps: this.getNextSteps(topic)
        };
    }
    
    // SMART CTA GENERATION
    generateSmartCTA(topic, userMessage) {
        const msg = userMessage.toLowerCase();
        
        if (msg.includes('sell') || msg.includes('value') || msg.includes('worth')) {
            return "Let's get you a FREE confidential valuation of your practice right now. Should Bruce call you today or tomorrow?";
        }
        
        if (msg.includes('buy') || msg.includes('purchase') || msg.includes('financing')) {
            return "Ready to find your perfect practice? Let's schedule 30 minutes to discuss your criteria and see what's available. When works best for you?";
        }
        
        if (msg.includes('retirement') || msg.includes('exit')) {
            return "Let's create your retirement roadmap today! Bruce will show you exactly how to maximize your practice value and time your exit perfectly. Are you available for a 20-minute call this week?";
        }
        
        // Default CTA
        return "Let Bruce answer all your questions in a brief consultation. When would be convenient - morning or afternoon?";
    }
    
    // OBJECTION HANDLING
    handleObjection(objection) {
        const objLower = objection.toLowerCase();
        
        // Find matching objection handler
        for (let key in this.objections) {
            if (objLower.includes(key)) {
                const handler = this.objections[key];
                return `${handler.response}\n\n${handler.reclose}`;
            }
        }
        
        // Default objection response
        return "I understand your concern. Every situation is unique, which is why Bruce offers a personalized consultation. Let's discuss your specific situation so he can address your exact needs. When would work for a brief call?";
    }
    
    // UTILITY FUNCTIONS
    findKnowledgeResponse(topic, userMessage) {
        const msg = userMessage.toLowerCase();
        
        // Search through knowledge base
        for (let category in this.knowledge) {
            if (typeof this.knowledge[category] === 'object') {
                for (let key in this.knowledge[category]) {
                    if (msg.includes(key) || msg.includes(topic)) {
                        return this.knowledge[category][key];
                    }
                }
            }
        }
        
        // Default response
        return "Great question! Bruce specializes in helping accounting professionals with exactly these types of situations. With over 35 years of experience and 1000+ successful transactions, he can provide the expert guidance you need.";
    }
    
    determineAction(topic) {
        if (topic.includes('sell') || topic.includes('value')) return 'schedule_valuation';
        if (topic.includes('buy') || topic.includes('purchase')) return 'buyer_consultation';
        if (topic.includes('financing')) return 'financing_consultation';
        return 'general_consultation';
    }
    
    getNextSteps(topic) {
        const steps = {
            'schedule_valuation': [
                "Bruce will call with your confidential valuation",
                "He'll explain current market conditions", 
                "You'll understand your options and timeline"
            ],
            'buyer_consultation': [
                "Bruce will discuss your ideal practice criteria",
                "He'll show available practices matching your goals",
                "You'll understand financing options and next steps"
            ],
            'general_consultation': [
                "Bruce will assess your specific situation",
                "He'll provide expert recommendations",
                "You'll have a clear path forward"
            ]
        };
        
        return steps[this.determineAction(topic)] || steps['general_consultation'];
    }
    
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CTAGenerator;
} else if (typeof window !== 'undefined') {
    window.CTAGenerator = CTAGenerator;
}