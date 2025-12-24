// =============================================================================
// 🚀 MOBILEWISE VOICE ENGINE - PHASE 1 (COMPATIBLE VERSION)
// =============================================================================
// 🎯 ENHANCES existing addUserMessage, doesn't replace it
// =============================================================================

console.log('🎤 MOBILEWISE VOICE ENGINE LOADING - Phase 1 (Compatible)');

// =============================================================================
// 🔄 ENHANCE EXISTING addUserMessage FUNCTION
// =============================================================================

// Save the original addUserMessage function if it exists
const originalAddUserMessage = window.addUserMessage;

/**
 * 🎯 ENHANCED addUserMessage - MAIN ENTRY POINT
 * All 5 existing handlers will still work, but now route through our AI
 */
window.addUserMessage = async function(userText) {
    console.log('🎤 ENHANCED addUserMessage called:', userText.substring(0, 30));
    
    // 🚨 STEP 0: Call original function first (preserves existing UI)
    if (originalAddUserMessage && typeof originalAddUserMessage === 'function') {
        console.log('🔄 Calling original addUserMessage for UI');
        originalAddUserMessage(userText);
    } else {
        console.log('💬 Fallback: Showing user message');
        // Minimal fallback UI
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message user-message';
            msgDiv.textContent = userText;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // 🚨 STEP 1: Check for system interruptions
    if (checkSystemInterruptions(userText)) {
        console.log('🛑 System interruption handled - stopping AI processing');
        return; // Don't process with AI
    }
    
    // 🧠 STEP 2: Process with AI Brain (async - doesn't block UI)
    console.log('🧠 Getting AI response...');
    
    // Small delay to let UI update first
    setTimeout(async () => {
        try {
            const aiResponse = await getAIResponse(userText);
            
            if (aiResponse) {
                console.log('✅ AI Response ready:', aiResponse.substring(0, 50) + '...');
                
                // 🤖 STEP 3: Show AI response in chat
                addAIMessageToChat(aiResponse);
                
                // 🎤 STEP 4: Speak it out loud
                speakAIResponse(aiResponse);
            } else {
                console.warn('⚠️ AI returned empty response');
            }
        } catch (error) {
            console.error('❌ AI Error:', error);
            // Fallback response
            const fallback = "I'm having trouble processing that. Could you try again?";
            addAIMessageToChat(fallback);
            speakAIResponse(fallback);
        }
    }, 300); // Small delay for better UX
};

// =============================================================================
// 🚨 SYSTEM INTERRUPTION CHECKS (Same as before)
// =============================================================================
function checkSystemInterruptions(userText) {
    const lowerText = userText.toLowerCase();
    
    // 1. Testimonial mode
    if (window.isInTestimonialMode) {
        console.log('🎯 In testimonial mode - skipping AI processing');
        return true;
    }
    
    // 2. Lead capture mode
    if (window.isInLeadCapture) {
        console.log('🎯 In lead capture mode');
        if (window.processLeadResponse) {
            window.processLeadResponse(userText);
        }
        return true;
    }
    
    return false;
}

// =============================================================================
// 🤖 ADD AI MESSAGE TO CHAT
// =============================================================================
function addAIMessageToChat(text) {
    console.log('🤖 Adding AI message to chat:', text.substring(0, 30));
    
    // Try to use existing addAIMessage function
    if (typeof window.addAIMessage === 'function') {
        window.addAIMessage(text);
        return;
    }
    
    // Fallback UI
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        const msgContainer = document.createElement('div');
        msgContainer.className = 'message ai-message';
        
        const avatar = document.createElement('img');
        avatar.src = 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1764374269507_avatar%20right.png';
        avatar.alt = 'AI Assistant';
        avatar.className = 'ai-avatar';
        
        const messageText = document.createElement('div');
        messageText.textContent = text;
        
        msgContainer.appendChild(avatar);
        msgContainer.appendChild(messageText);
        chatMessages.appendChild(msgContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// =============================================================================
// 🎤 SPEECH SYSTEM INTEGRATION (Same as before)
// =============================================================================
function speakAIResponse(text) {
    // Try ElevenLabs first
    if (window.speakWithElevenLabs) {
        console.log('🔊 Using ElevenLabs TTS');
        window.speakWithElevenLabs(text);
        return;
    }
    
    // Fallback to browser TTS
    if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
        console.log('🔊 Using browser TTS (fallback)');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
        return;
    }
    
    console.warn('⚠️ No TTS system available');
}

// =============================================================================
// 🎯 COMPATIBILITY CHECK
// =============================================================================
console.log('✅ VOICE ENGINE LOADED - Enhanced addUserMessage');
console.log('✅ 5 existing handlers will still work');
console.log('✅ AI responses will be added after user messages');
console.log('👉 Test sequence:');
console.log('   1. User says "rock"');
console.log('   2. Original addUserMessage shows it in chat');
console.log('   3. Our AI processes it');
console.log('   4. AI response appears in chat');
console.log('   5. AI response is spoken');