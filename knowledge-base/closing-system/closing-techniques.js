// ===========================================
// MOBILE-WISE AI CLOSING TECHNIQUES SYSTEM
// Universal Closing Engine for All Industries
// ===========================================

const closingTechniques = {
    // URGENCY BUILDERS
    urgencyBuilders: [
        "The market is the hottest it's been in years",
        "Other opportunities like this are moving within 30 days", 
        "Every day you wait could mean money left on the table",
        "Timing is everything in this market",
        "This window of opportunity won't stay open forever",
        "Other people are already taking action on similar opportunities"
    ],
    
    // SOCIAL PROOF BUILDERS
    socialProof: [
        "We've helped over 1000 clients achieve their goals",
        "Our clients consistently get better results than going alone",
        "Last month, we exceeded expectations for 95% of our clients", 
        "Successful people work with specialists - just like you're doing now",
        "Our track record speaks for itself",
        "Smart business owners invest in expert guidance"
    ],
    
    // RISK REVERSALS
    riskReversals: [
        "This consultation is completely free and confidential",
        "No obligation - just expert insights into your situation",
        "We only succeed when you succeed",
        "Even if you don't work with us, you'll have valuable information",
        "What do you have to lose by getting expert advice?",
        "The worst that happens is you learn something valuable"
    ],
    
    // APPOINTMENT CLOSERS
    appointmentClosers: [
        "Are mornings or afternoons better for you?",
        "Would Tuesday or Wednesday work better?", 
        "Is today or tomorrow more convenient?",
        "Should Bruce call your office line or cell phone?",
        "What's the best number to reach you at?",
        "When's the most convenient time for a brief call?"
    ],
    
    // CTA TEMPLATES BY ACTION TYPE
    ctaTemplates: {
        consultation: "Let's schedule a brief consultation to discuss your specific situation. When would be convenient for a quick call?",
        valuation: "Let's get you a FREE assessment of your situation. When would be the best time for our expert to call you?",
        information: "I can have Bruce send you detailed information about this right away. What's the best email address?",
        callback: "Bruce can answer all your questions personally. Should he call you today or tomorrow?"
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = closingTechniques;
} else if (typeof window !== 'undefined') {
    window.closingTechniques = closingTechniques;
}