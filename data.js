// ===================================================
// 🎯 KNOWLEDGE BASE DATA - PRE-LOADED FOR ZERO LATENCY
// ===================================================
// This file contains all conversation data as a JavaScript object
// NO async loading, NO fetch delays - INSTANT ACCESS
// Date: October 15, 2025
// Captain: Mobile-Wise AI Empire
// ===================================================

window.knowledgeBaseData = {
  "industry_name": "CPA Practice Sales & Acquisitions",
  "industry_type": "accounting_practice_brokerage",
  "version": "2.0",
  "client_name": "New Clients, Inc. / Bruce Clark",
  "greeting": {
    "initial": "Hi there! I'm Boatimia your personal AI Voice assistant, may I get your first name please?",
    "with_name": "Great to meet you {firstName}! What brings you here today - looking to buy, sell, or get a practice valuation?"
  },
  "conversation_states": {
    "initial": {
      "state_id": "initial",
      "description": "First interaction - capture name or detect intent",
      "triggers": {
        "name_request": {
          "keywords": [],
          "response": "Before we dive in, what's your first name?",
          "next_state": "getting_first_name",
          "condition": "!leadData.firstName && no business keywords"
        },
        "buy_intent": {
          "keywords": [
            "buy",
            "buying",
            "purchase",
            "acquire"
          ],
          "response": "Excellent! Bruce has exclusive off-market opportunities available. What's your budget range?",
          "response_with_name": "Excellent, {firstName}! Bruce has exclusive off-market deals available. What's your budget range?",
          "next_state": "buying_budget_question",
          "trigger_banner": "freeBookWithConsultation"
        },
        "sell_intent": {
          "keywords": [
            "sell",
            "selling"
          ],
          "response": "Great! Selling is a big decision. How many clients are you currently serving?",
          "response_with_name": "Wow {firstName}! That's a huge decision. How many clients are you serving?",
          "next_state": "selling_size_question",
          "trigger_banner": "freeBookWithConsultation"
        },
        "value_intent": {
          "keywords": [
            "value",
            "worth",
            "valuation",
            "evaluate"
          ],
          "response": "Happy to help with a valuation! Most owners are surprised at their practice's value. What's your approximate annual revenue?",
          "response_with_name": "{firstName}, I'd be happy to help! Most owners are shocked at their practice's actual value. What's your approximate annual revenue?",
          "next_state": "valuation_revenue_question",
          "trigger_banner": "freeBookWithConsultation"
        }
      }
    },
    "getting_first_name": {
      "state_id": "getting_first_name",
      "description": "Capture and store user's first name",
      "response_success": "Great to meet you {firstName}! Now, what brings you here - buy, sell, or valuation?",
      "response_retry": "I didn't catch your name. Could you tell me your first name?",
      "next_state": "initial",
      "action": "extract_first_name"
    },
    "selling_size_question": {
      "state_id": "selling_size_question",
      "description": "Ask about client count",
      "response": "Incredible! {number} clients - that's fantastic! With that client base, what's your approximate annual revenue?",
      "response_no_name": "Wow! {number} clients - impressive! What's your annual revenue range?",
      "next_state": "selling_revenue_question",
      "action": "extract_number"
    },
    "selling_revenue_question": {
      "state_id": "selling_revenue_question",
      "description": "Ask about revenue",
      "response": "Excellent! {revenue} in revenue - you've built something valuable. What's driving your decision to sell? Retirement, new opportunities, or something else?",
      "response_no_name": "Excellent! {revenue} - solid practice! What's driving your decision to sell?",
      "next_state": "selling_motivation_question",
      "action": "extract_revenue"
    },
    "selling_motivation_question": {
      "state_id": "selling_motivation_question",
      "description": "Understand motivation and check for objections",
      "objection_check": true,
      "objection_response": "Great question, {firstName}! Let me show you what one of our recent clients said about that...",
      "objection_response_no_name": "Great question! Let me show you what a recent client said...",
      "objection_testimonial": "skeptical",
      "response": "Thank you for sharing! Based on your client base and revenue, Bruce can help you get top dollar. The market is strong right now. Would you like a FREE consultation with Bruce?",
      "response_with_name": "Thanks {firstName}! Based on everything you've told me, Bruce can get you top dollar. Market's on fire. Ready for a FREE consultation?",
      "next_state": "asking_selling_consultation",
      "trigger_banner": "freeBookWithConsultation"
    },
    "asking_selling_consultation": {
      "state_id": "asking_selling_consultation",
      "description": "Close for consultation",
      "yes_triggers": [
        "yes",
        "sure",
        "okay",
        "definitely",
        "absolutely"
      ],
      "no_triggers": [
        "no",
        "not now",
        "maybe later"
      ],
      "yes_action": "start_lead_capture",
      "no_response": "No problem! The offer stands whenever you're ready. Anything else about selling?",
      "no_response_with_name": "No problem {firstName}! Offer stands. Anything else about selling?",
      "no_next_state": "initial",
      "no_trigger_banner": "smartButton",
      "clarify_response": "Just to clarify - would you like Bruce to call you for a free consultation? Yes or no?",
      "clarify_response_with_name": "{firstName}, want Bruce to call you for free consultation? Yes or no?"
    },
    "buying_budget_question": {
      "state_id": "buying_budget_question",
      "description": "Ask about budget range",
      "response": "Great! {budget} opens up excellent opportunities. Looking specifically for CPA practice, or would accounting work too?",
      "response_with_name": "Great {firstName}! {budget} - nice opportunities in that range. CPA practice specifically, or general accounting?",
      "next_state": "buying_type_question",
      "action": "extract_budget"
    },
    "buying_type_question": {
      "state_id": "buying_type_question",
      "description": "Ask about practice type preference",
      "response": "Perfect! That gives us more options. How soon are you looking to complete a purchase?",
      "response_with_name": "Perfect {firstName}! More options to work with. How soon for purchase?",
      "next_state": "buying_timeline_question"
    },
    "buying_timeline_question": {
      "state_id": "buying_timeline_question",
      "description": "Ask about timeline",
      "response": "Excellent! Bruce has exclusive off-market opportunities you can't find online. Based on your criteria, he has perfect matches. Want to see them?",
      "response_with_name": "Excellent {firstName}! Bruce has exclusive off-market deals - not advertised anywhere. Perfect matches for your criteria. Want to see?",
      "next_state": "asking_buying_consultation",
      "trigger_banner": "freeBookWithConsultation"
    },
    "asking_buying_consultation": {
      "state_id": "asking_buying_consultation",
      "description": "Close for showing practices",
      "yes_triggers": [
        "yes",
        "sure",
        "okay",
        "definitely",
        "absolutely"
      ],
      "no_triggers": [
        "no",
        "not now",
        "maybe later"
      ],
      "yes_action": "start_lead_capture",
      "no_response": "That's fine! When ready, let me know. These opportunities move fast. Anything else about buying?",
      "no_response_with_name": "Fine {firstName}! Just let me know when ready. Opportunities don't last long. Anything else?",
      "no_next_state": "initial",
      "no_trigger_banner": "smartButton",
      "clarify_response": "Would you like Bruce to show you available practices? Yes or no?",
      "clarify_response_with_name": "{firstName}, want Bruce to show you available practices? Yes or no?"
    },
    "valuation_revenue_question": {
      "state_id": "valuation_revenue_question",
      "description": "Ask about revenue for valuation",
      "response": "Thank you! {revenue} - solid! How many years have you been in practice? Longevity really impacts valuation.",
      "response_with_name": "Thanks {firstName}! {revenue} - solid! How many years in practice? Longevity impacts value.",
      "next_state": "valuation_years_question",
      "action": "extract_revenue"
    },
    "valuation_years_question": {
      "state_id": "valuation_years_question",
      "description": "Ask about years in practice",
      "response": "Perfect! {years} years - well-established! Bruce can provide a comprehensive FREE valuation. You might be surprised at the value. Want to schedule it?",
      "response_with_name": "Perfect {firstName}! {years} years - incredibly well-established! Bruce can provide FREE valuation. Might surprise you. Ready to schedule?",
      "next_state": "asking_valuation_consultation",
      "trigger_banner": "freeBookWithConsultation",
      "action": "extract_years"
    },
    "asking_valuation_consultation": {
      "state_id": "asking_valuation_consultation",
      "description": "Close for valuation consultation",
      "yes_triggers": [
        "yes",
        "sure",
        "okay",
        "definitely",
        "absolutely"
      ],
      "no_triggers": [
        "no",
        "not now",
        "maybe later"
      ],
      "yes_action": "start_lead_capture",
      "no_response": "No worries! Offer stands whenever you're ready. Anything else about valuations?",
      "no_response_with_name": "No worries {firstName}! Offer stands. Anything else about valuations?",
      "no_next_state": "initial",
      "no_trigger_banner": "smartButton",
      "clarify_response": "Would you like Bruce to provide a free valuation? Yes or no?",
      "clarify_response_with_name": "{firstName}, want Bruce to provide free valuation? Yes or no?"
    },
    "asking_if_more_help": {
      "state_id": "asking_if_more_help",
      "description": "Check if user needs more help before ending",
      "no_triggers": [
        "no",
        "nothing",
        "done",
        "that's all",
        "nope",
        "thanks"
      ],
      "yes_response": "Absolutely! What else about buying, selling, or valuing practices?",
      "yes_response_with_name": "Absolutely {firstName}! What else would you like to know?",
      "yes_next_state": "initial",
      "no_response": "Thank you so much for visiting! Have a wonderful day! \ud83c\udf1f",
      "no_response_with_name": "Thank you {firstName}! It's been great talking with you. Have a wonderful day! \ud83c\udf1f",
      "no_next_state": "ended",
      "no_trigger_banner": "thankYou"
    }
  },
  "objection_handling": {
    "description": "Detect objections and trigger testimonials",
    "objections": [
      {
        "type": "timeline_concern",
        "keywords": [
          "how long",
          "time",
          "timeline",
          "duration",
          "when",
          "fast",
          "quick"
        ],
        "testimonial": "speed",
        "response": "Great question! Let me show you what a recent client said about the speed of their sale...",
        "response_with_name": "Great question {firstName}! Let me show you what happened with a recent client..."
      },
      {
        "type": "trust_concern",
        "keywords": [
          "guarantee",
          "sure",
          "trust",
          "promise",
          "really",
          "certain",
          "proof"
        ],
        "testimonial": "skeptical",
        "response": "I understand! Let me show you what a client who was skeptical said after working with Bruce...",
        "response_with_name": "{firstName}, I understand! Let me show you what a skeptical client said after working with Bruce..."
      },
      {
        "type": "value_concern",
        "keywords": [
          "worth",
          "value",
          "price",
          "fair",
          "market",
          "competitive"
        ],
        "testimonial": "skeptical",
        "response": "That's important! Let me show you what a client said about the value they got...",
        "response_with_name": "{firstName}, that's important! Let me show you what a client said about their value..."
      }
    ]
  },
  "testimonials": {
    "skeptical": {
      "id": "skeptical",
      "title": "Skeptical, Then Exceeded Expectations",
      "video_url": "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982717330.mp4",
      "duration": 12000,
      "trigger_contexts": [
        "trust",
        "value",
        "credibility",
        "guarantee"
      ]
    },
    "speed": {
      "id": "speed",
      "title": "Surprised by the Speed of the Sale",
      "video_url": "https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/video-avatars/video_avatar_1759982877040.mp4",
      "duration": 12000,
      "trigger_contexts": [
        "timeline",
        "how long",
        "fast",
        "quick"
      ]
    }
  },
  "general_questions": [
    {
      "id": "selling_timeline",
      "triggers": [
        "how long to sell",
        "time to sell",
        "sell timeline",
        "selling duration",
        "how fast can I sell"
      ],
      "keywords": [
        "sell",
        "time",
        "how long",
        "duration",
        "timeline",
        "fast"
      ],
      "response": "Most practices sell within 2-6 months. Strong financials and good client retention? Even faster. Want to discuss your situation?",
      "category": "selling",
      "triggerAction": "request_selling_consultation",
      "triggerTestimonial": "speed"
    },
    {
      "id": "buying_timeline",
      "triggers": [
        "how long to buy",
        "time to buy",
        "buying timeline",
        "purchase duration"
      ],
      "keywords": [
        "buy",
        "purchase",
        "time",
        "how long",
        "acquire"
      ],
      "response": "Most buyers find and close within 2-6 months. Pre-approved financing speeds things up. Want to hear about available practices?",
      "category": "buying",
      "triggerAction": "request_buying_consultation"
    },
    {
      "id": "practice_valuation",
      "triggers": [
        "what is my practice worth",
        "practice value",
        "how much is it worth",
        "valuation",
        "appraisal"
      ],
      "keywords": [
        "worth",
        "value",
        "price",
        "valuation",
        "appraisal",
        "how much"
      ],
      "response": "Most CPA practices sell for 100-150% of annual billing. Multiple depends on profit margins, client retention, and growth. Want a professional valuation?",
      "category": "valuation",
      "triggerAction": "request_valuation"
    },
    {
      "id": "practice_pricing",
      "triggers": [
        "how much does a practice cost",
        "practice price",
        "cost to buy"
      ],
      "keywords": [
        "cost",
        "price",
        "buy",
        "purchase",
        "how much",
        "afford"
      ],
      "response": "Typically 100-150% of annual billing, around 125% average. Example: $500K billing = ~$625K price. What's your budget range?",
      "category": "buying",
      "triggerAction": "request_buying_consultation"
    },
    {
      "id": "financing_options",
      "triggers": [
        "financing",
        "loan",
        "funding",
        "can I finance",
        "money"
      ],
      "keywords": [
        "financing",
        "loan",
        "money",
        "funding",
        "bank",
        "finance"
      ],
      "response": "Financing available for qualified buyers - typically 70-90% of purchase price. Good credit and cash flow needed. Some sellers offer financing. Want details?",
      "category": "buying",
      "triggerAction": "request_financing_consultation"
    },
    {
      "id": "sale_guarantees",
      "triggers": [
        "guarantee",
        "protection",
        "refund",
        "what if clients leave"
      ],
      "keywords": [
        "guarantee",
        "protection",
        "refund",
        "assurance",
        "risk",
        "clients leave"
      ],
      "response": "Most sales include client retention guarantees - typically one year. If collected fees don't meet agreement, you may get refund/adjustment. Want details?",
      "category": "buying",
      "triggerAction": "request_guarantee_details",
      "triggerTestimonial": "skeptical"
    },
    {
      "id": "seller_fees",
      "triggers": [
        "what do you charge",
        "commission",
        "fees",
        "cost to sell"
      ],
      "keywords": [
        "charge",
        "commission",
        "fee",
        "cost",
        "price",
        "how much"
      ],
      "response": "Commission structures vary by transaction size - typically 10-15%. Some flat fees for smaller practices. Want to discuss your specific practice?",
      "category": "selling",
      "triggerAction": "request_fee_consultation"
    },
    {
      "id": "confidentiality",
      "triggers": [
        "confidential",
        "secret",
        "discreet",
        "privacy",
        "who will know"
      ],
      "keywords": [
        "confidential",
        "secret",
        "discreet",
        "privacy",
        "anonymous"
      ],
      "response": "Confidentiality is critical. We use NDAs, anonymous listings, controlled disclosure. Clients/staff don't know until you're ready. Want to discuss our process?",
      "category": "general",
      "triggerAction": "request_confidentiality_consultation"
    },
    {
      "id": "what_services",
      "triggers": [
        "what do you do",
        "services",
        "how can you help",
        "what help"
      ],
      "keywords": [
        "what",
        "do",
        "services",
        "help",
        "offer"
      ],
      "response": "We handle: practice sales, buyer matching, valuations, succession planning, transaction support. Marketing, screening, negotiations, closing - all covered. How can we help?",
      "category": "general",
      "triggerAction": "request_services_consultation"
    },
    {
      "id": "due_diligence",
      "triggers": [
        "due diligence",
        "what documents",
        "paperwork",
        "information needed"
      ],
      "keywords": [
        "due diligence",
        "documents",
        "paperwork",
        "information",
        "need",
        "required"
      ],
      "response": "Typical due diligence: 3 years tax returns, financials, client lists with revenue, fee structures, staff info. We help prepare everything. Want to know what you'll need?",
      "category": "general",
      "triggerAction": "request_due_diligence_help"
    }
  ],
  "fallback_responses": {
    "no_match": "That's a great question! A specialist can provide detailed information. Would you like to schedule a consultation?",
    "no_match_with_name": "{firstName}, that's a great question! Let me connect you with our team. Ready for a consultation?",
    "conversation_ended": "Thank you for visiting! Have a great day.",
    "conversation_ended_with_name": "Thank you {firstName}! Have a great day."
  },
  "lead_capture_triggers": [
    "consultation",
    "call me",
    "speak to someone",
    "more information",
    "contact",
    "schedule",
    "interested",
    "yes"
  ]
};

console.log('✅ Knowledge Base Data loaded - Zero latency mode!');
console.log('📊 KB Stats:', {
    conversationStates: Object.keys(window.knowledgeBaseData.conversation_states).length,
    generalQuestions: window.knowledgeBaseData.general_questions.length,
    testimonials: Object.keys(window.knowledgeBaseData.testimonials).length
});
