// ============================================================================
// NCI AI VOICE CHAT - STEP 1 FOUNDATION
// ============================================================================

// Voice System Variables
let recognition = null;
let isVoiceChatMode = false;
let isListening = false;

// Accounting Knowledge Base
const accountingKnowledge = {
    "tax prep": "We offer comprehensive tax preparation services for individuals and businesses. Our expert team handles everything from simple returns to complex tax situations.",
    "bookkeeping": "Our professional bookkeeping services help you maintain accurate financial records year-round. We handle accounts payable, receivable, and monthly statements.",
    "business": "We provide strategic business consulting to help you grow your accounting practice. This includes business planning, financial analysis, and cash flow management.",
    "growth": "Our practice development program has helped thousands of accountants build successful, profitable practices using proven marketing systems and client acquisition strategies."
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    console.log('🚀 NCI AI Voice Chat - Foundation Loaded');
});

// ============================================================================
// SPEECH RECOGNITION SETUP
// ============================================================================

function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.trim();
            console.log('🎤 Speech recognized:', transcript);
            handleVoiceInput(transcript);
        };

        recognition.onstart = function() {
            isListening = true;
            document.getElementById('voiceIndicator').classList.remove('hidden');
            document.getElementById('micBtn').classList.add('recording');
            console.log('🎤 Voice recognition started');
        };

        recognition.onend = function() {
            isListening = false;
            document.getElementById('voiceIndicator').classList.add('hidden');
            document.getElementById('micBtn').classList.remove('recording');
            console.log('🎤 Voice recognition ended');
        };

        recognition.onerror = function(event) {
            console.log('Speech recognition error:', event.error);
            isListening = false;
            document.getElementById('voiceIndicator').classList.add('hidden');
            document.getElementById('micBtn').classList.remove('recording');
        };
    } else {
        console.log('Speech recognition not supported');
    }
}

// ============================================================================
// MAIN INTERFACE FUNCTIONS
// ============================================================================

function openAIChat() {
    document.getElementById('aiOverlay').classList.remove('hidden');
    document.getElementById('aiActivateBtn').style.display = 'none';
    isVoiceChatMode = true;
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 100);
    
    console.log('🚀 AI Chat opened');
}

function closeAIChat() {
    document.getElementById('aiOverlay').classList.add('hidden');
    document.getElementById('aiActivateBtn').style.display = 'block';
    isVoiceChatMode = false;
    
    // Stop any ongoing voice recognition
    if (isListening && recognition) {
        recognition.stop();
    }
    
    console.log('🚀 AI Chat closed');
}

// ============================================================================
// VOICE FUNCTIONS
// ============================================================================

function toggleVoice() {
    if (!recognition) {
        addAIMessage("Sorry, voice recognition isn't supported in your browser. Please type your question instead.");
        return;
    }

    if (isListening) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (error) {
            console.log('Recognition start error:', error);
            addAIMessage("Please try again in a moment.");
        }
    }
}

function handleVoiceInput(transcript) {
    addUserMessage(transcript);
    
    setTimeout(() => {
        const response = generateResponse(transcript);
        addAIMessage(response);
        speakMessage(response);
    }, 500);
}

// ============================================================================
// CHAT FUNCTIONS
// ============================================================================

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
        
        setTimeout(() => {
            const response = generateResponse(message);
            addAIMessage(response);
        }, 500);
    }
}

function askTopic(topic) {
    const message = `Tell me about ${topic}`;
    addUserMessage(message);
    
    setTimeout(() => {
        const response = generateResponse(topic.toLowerCase());
        addAIMessage(response);
        if (isVoiceChatMode) {
            speakMessage(response);
        }
    }, 500);
}

function addUserMessage(message) {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.innerHTML += `
        <div class="user-message">
            <div class="message-bubble">${message}</div>
        </div>
    `;
    scrollToBottom();
}

function addAIMessage(message) {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.innerHTML += `
        <div class="ai-message">
            <img src="https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/avatars/avatar_1754861585921_AI%20assist%20left2.png" class="message-avatar" alt="AI">
            <div class="message-bubble">${message}</div>
        </div>
    `;
    scrollToBottom();
}

function scrollToBottom() {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ============================================================================
// AI RESPONSE GENERATION
// ============================================================================

function generateResponse(input) {
    const lowerInput = input.toLowerCase();
    
    // Check knowledge base
    for (const [key, value] of Object.entries(accountingKnowledge)) {
        if (lowerInput.includes(key)) {
            return value;
        }
    }
    
    // Default responses based on keywords
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        return "Hello! I'm here to help with your accounting needs. What would you like to know about our services?";
    }
    
    if (lowerInput.includes('help')) {
        return "I can help you with tax preparation, bookkeeping, business consulting, and practice growth. What interests you most?";
    }
    
    if (lowerInput.includes('appointment') || lowerInput.includes('schedule')) {
        return "I'd be happy to help you schedule a consultation! Let me connect you with our scheduling system.";
    }
    
    return "That's a great question! I specialize in accounting services including tax prep, bookkeeping, business consulting, and practice growth. Could you be more specific about what you'd like to know?";
}

// ============================================================================
// TEXT-TO-SPEECH
// ============================================================================

function speakMessage(message) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to use a female voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') ||
            voice.name.includes('Victoria') ||
            voice.name.includes('Karen')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// Initialize voices
window.addEventListener('load', function() {
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
    }
});

// Close overlay when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.id === 'aiOverlay') {
        closeAIChat();
    }
});

console.log('🚀 NCI AI Voice Chat - Foundation Ready!');