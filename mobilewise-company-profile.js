// =============================================================================
// 🏢 MOBILEWISE COMPANY PROFILE - EXTERNAL CONFIG FILE
// =============================================================================
// 🎯 Each company gets THEIR OWN VERSION of this file
// 🔍 Future: Auto-generated from website scan + dashboard
// =============================================================================

window.MOBILEWISE_COMPANY = {
    
    // =========================================================================
    // 🏢 COMPANY IDENTITY (Auto-scanned from website)
    // =========================================================================
    identity: {
        companyName: "",           // From <title> or <h1>
        website: "",               // Current domain
        contactPhone: "",          // From "tel:" links
        contactEmail: "",          // From "mailto:" links
        location: "",              // From address in footer
        industry: "",              // Detected from content
        logoUrl: ""                // From favicon or logo image
    },
    
    // =========================================================================
    // 👤 FOUNDER/LEADERSHIP (From "About Us" page)
    // =========================================================================
    leadership: {
        founderName: "",           // "Brett Duncan"
        founderTitle: "",          // "The ROI Revolutionary"  
        founderBio: "",            // From biography section
        founderQuote: "",          // Notable quote
        teamSize: "",              // "10+ team members"
        yearsInBusiness: ""        // "Founded in 2020"
    },
    
    // =========================================================================
    // 🎯 MISSION & VALUES (From homepage/mission statement)
    // =========================================================================
    philosophy: {
        missionStatement: "",      // "We help businesses..."
        coreValues: [],            // ["Integrity", "Innovation", "Results"]
        uniqueProposition: "",     // What makes them different
        customerPromise: ""        // Guarantee or promise
    },
    
    // =========================================================================
    // 📊 PROVEN RESULTS (From case studies/testimonials)
    // =========================================================================
    results: {
        caseStudies: [],           // Client success stories
        testimonials: [],          // Customer quotes
        statistics: [],            // "Increased X by Y%"
        awards: [],                // Industry awards
        clientLogos: []            // Trusted client logos
    },
    
    // =========================================================================
// 🎁 OFFERS & SERVICES (From services/pricing pages)
// =========================================================================
offers: {
    primaryService: "",                            // Main offering
    freeOffer: "FREE AI Business Analysis",        // ✅ FIXED: Remove empty quotes and comma
    demoOffer: "15-minute demo",                   // ✅ FIXED: Remove empty quotes  
    entryLevel: "",                                // Lowest tier
    premiumService: ""                             // Highest tier
},

// =========================================================================
// 🎯 INDUSTRY-SPECIFIC CONTENT (Auto-detected)
// =========================================================================
industryContext: {
    targetAudience: "SMB owners, Marketing Directors",  // ✅ FIXED: Remove empty quotes
    commonPainPoints: [],                               // Industry-specific challenges
    competitors: [],                                    // Key competitors
    marketPosition: ""                                  // "Premium", "Value", "Innovator"
}  // ✅ FIXED: Ensure closing brace is here
};

// =============================================================================
// 🛠️ HELPER: LOAD COMPANY PROFILE
// =============================================================================
function loadCompanyProfile() {
    console.log('🏢 Loading company profile...');
    
    // Default to MobileWise if no custom profile
    if (!window.MOBILEWISE_COMPANY.identity.companyName) {
        console.log('⚠️ No custom profile - using MobileWise defaults');
        applyMobileWiseDefaults();
    }
    
    console.log('✅ Company profile loaded:', 
                window.MOBILEWISE_COMPANY.identity.companyName || 'MobileWise AI');
}

function applyMobileWiseDefaults() {
    window.MOBILEWISE_COMPANY = {
        identity: {
            companyName: "MobileWise AI",
            website: "mobilewiseai.com",
            industry: "AI Solutions"
        },
        leadership: {
            founderName: "Brett Duncan",
            founderTitle: "The ROI Revolutionary",
            founderBio: "25 years of marketing experience",
            founderQuote: "Good enough is the enemy of holy shit"
        },
        philosophy: {
            missionStatement: "We're not another chatbot - we're your unfair advantage",
            uniqueProposition: "25 years of weapons-grade marketing IQ built into AI"
        },
        offers: {
            freeOffer: "FREE AI Business Analysis (value: $2,500)",
            demoOffer: "15-minute demo of our deal-closing AI"
        }
    };
}

// Auto-load on startup
setTimeout(loadCompanyProfile, 100);