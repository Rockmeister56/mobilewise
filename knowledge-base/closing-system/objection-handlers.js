// ===========================================
// OBJECTION HANDLING SYSTEM
// Universal Objection Responses + Reclosing
// ===========================================

const objectionHandlers = {
    "cost": {
        response: "I understand cost is a concern. Here's the reality: NOT getting expert help typically costs far more. People who go alone often get 20-30% less than optimal results.",
        reclose: "The consultation is free, and you'll learn exactly what your options are. Even if you decide to go alone, you'll have professional insights. What do you have to lose by talking for 15 minutes?"
    },
    
    "think about it": {
        response: "Absolutely! This is a major decision. But here's what I've learned: the more information you have, the better you can think it through.",
        reclose: "Let Bruce give you the complete picture in a brief consultation. Then you'll have all the facts to make the right decision. Are you available for 20 minutes this week?"
    },
    
    "not ready": {
        response: "Perfect timing to start planning! Most successful outcomes begin with education and preparation months before taking action.",
        reclose: "Bruce can help you create a timeline and strategy that maximizes your results when you ARE ready. Shouldn't you know what your options are? When works better - morning or afternoon?"
    },
    
    "shop around": {
        response: "Smart approach! You should definitely compare your options. Most people find that specialists with deep expertise deliver better results than generalists.",
        reclose: "Why not start with the best? Our consultation will give you a benchmark to compare others against. Plus, it's free. When can we schedule 20 minutes?"
    },
    
    "too busy": {
        response: "I completely understand - successful people are always busy! That's exactly why working with experts saves you time and gets better results.",
        reclose: "This is just 15-20 minutes that could save you months of work and potentially thousands of dollars. When's your least busy time of day?"
    },
    
    "need spouse approval": {
        response: "That makes perfect sense - major decisions should be discussed together. Most successful couples gather information first, then make decisions together.",
        reclose: "Why don't you get the facts from Bruce, then you'll have something concrete to discuss? Are you available for a brief call before or after work hours?"
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = objectionHandlers;
} else if (typeof window !== 'undefined') {
    window.objectionHandlers = objectionHandlers;
}