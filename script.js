// ============================================================================
// NCI AI VOICE ASSISTANT - COMPLETE REVOLUTIONARY SYSTEM
// ============================================================================

// Global Variables
let recognition = null;
let isVoiceActive = false;
let isListening = false;
let mediaRecorder = null;
let recordedChunks = [];
let userStream = null;
let currentInterviewStep = 0;
let interviewData = {};
let isInterviewMode = false;

// Interview Questions for "Send Message" feature
const interviewQuestions = [
    "Hi! I'd like to gather some information to help you better. What's your name?",
    "Great! What's the name of your accounting practice or business?",
    "Perfect! What's the best phone number to reach you?",
    "What's the best time of day to contact you?",
    "Finally, what specific accounting services are you most interested in?"
];

// Accounting Knowledge Base - Enhanced
const accountingKnowledge = {
    "tax preparation": "We offer comprehensive tax preparation services for individuals and businesses. Our expert team handles everything from simple returns to complex tax situations, ensuring you maximize deductions and stay compliant with current tax laws.",
    "tax prep": "We offer comprehensive tax preparation services for individuals and businesses. Our expert team handles everything from simple returns to complex tax situations, ensuring you maximize deductions and stay compliant with current tax laws.",
    "bookkeeping": "Our professional bookkeeping services help you maintain accurate financial records year-round. We handle accounts payable, accounts receivable, bank reconciliations, monthly financial statements, and provide you with clear insights into your business performance.",
    "business consulting": "We provide strategic business consulting to help you grow your accounting practice. This includes business planning, financial analysis, cash flow management, marketing strategies, and proven practice development methods.",
    "practice development": "Our practice development program has helped thousands of accountants build successful, profitable practices. We provide comprehensive marketing systems, client acquisition strategies, and proven methods that have helped practices grow from startup to multi-million dollar operations.",
    "practice growth": "We specialize in helping accounting practices grow systematically. Our methods include proven marketing systems, client retention strategies, pricing optimization, and operational improvements that typically result in significant revenue increases within the first year.",
    "client acquisition": "We have perfected client acquisition systems specifically for accounting firms. Our proven methods help you attract ideal clients consistently, with many of our clients doubling or tripling their client base within 12-18 months.",
    "pricing": "Our services are customized based on your specific needs and goals. We offer everything from basic consultation to comprehensive practice development programs. Investment levels vary, but our clients typically see ROI within 3-6 months. Would you like to schedule a consultation to discuss pricing for your situation?",
    "testimonials": "We have an incredible track record with over 30 years of documented success stories! Our clients have grown their practices from startup to millions in revenue. You can see many of our video testimonials on our website showing real results from real accountants who've transformed their practices using our systems."
};

// Enhanced Conversation Flows
const conversationFlows = {
    greeting: [
        "Hello! I'm your AI assistant for New Clients Inc. We specialize in helping accounting professionals grow their practices. What brings you here today?",
        "Hi there! I'm here to help you learn about our accounting practice development services. We've helped thousands of accountants build successful practices. How can I assist you?",
        "Welcome! I can help you with information about tax services, bookkeeping, business consulting, or our proven practice development systems. What interests you most?"
    ],
    taxPrep: [
        "Excellent choice! Are you looking for personal tax preparation services, business tax planning, or perhaps interested in adding tax services to your practice?",
        "Tax preparation is one of our core strengths. Are you seeking services for yourself, or are you an accountant looking to enhance your tax preparation capabilities?"
    ],
    bookkeeping: [
        "Great! Are you looking for bookkeeping services for your own business, or are you an accountant wanting to improve your bookkeeping service offerings?",
        "Bookkeeping is essential for business success. What type of business are you working with, and what are your biggest bookkeeping challenges?"
    ],
    consulting: [
        "Wonderful! Business consulting is where we really shine. Are you starting a new practice, looking to grow an existing business, or facing specific challenges you need help with?",
        "That's our specialty! What's your biggest business challenge right now? Growing revenue, getting more clients, or improving operations?"
    ],
    practiceGrowth: [
        "That's exactly what we do best! Our practice development systems have helped accountants grow from zero to millions. What's your current annual revenue, and where would you like to be?",
        "Practice growth is our passion! We've developed proven systems over 30+ years. What's holding your practice back from the growth you want?"
    ]
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    initializeEventListeners();
    console.log('🚀 NCI AI Voice Assistant Initialized');
});

// ============================================================================
// SPEECH RECOGNITION SETUP - Enhanced
// ============================================================================

function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.trim();
            console.log('🎤 Speech recognized:', transcript);
            
            if (isInterviewMode) {
                handleInterviewResponse(transcript);
            } else {
                handleVoiceInput(transcript);
            }
        };

        recognition.onstart = function() {
            isListening = true;
            updateVoiceStatus('Listening... speak now');
            document.getElementById('micButton').classList.add('recording');
        };

        recognition.onend = function() {
            isListening = false;
            updateVoiceStatus('Click microphone to speak');
            document.getElementById('micButton').classList.remove('recording');
        };

        recognition.onerror = function(event) {
            console.log('Speech recognition error:', event.error);
            updateVoiceStatus('Speech recognition error. Please try again.');
            isListening = false;
            document.getElementById('micButton').classList.remove('recording');
        };
    } else {
        console.log('Speech recognition not supported');
        updateVoiceStatus('Speech recognition not supported in this browser');
    }
}

// ============================================================================
// MAIN INTERFACE FUNCTIONS
// ============================================================================

function openAIVoiceBot() {
    document.getElementById('modalBackdrop').classList.remove('hidden');
    document.getElementById('aiVoiceBotModal').classList.remove('hidden');
    document.getElementById('aiChatButton').style.display = 'none';
    
    // Clear any existing messages and add fresh welcome
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    addMessage("Hello! I'm your AI assistant for New Clients Inc. We've been helping accounting professionals build successful practices for over 30 years. I can assist you with information about our services, answer questions, or help you get started. How can I help you today?", 'ai');
    
    // Auto-speak welcome if voice is active
    if (isVoiceActive) {
        speakMessage("Hello! I'm your AI assistant for New Clients Inc. How can I help you today?");
    }
}

function closeAIVoiceBot() {
    document.getElementById('modalBackdrop').classList.add('hidden');
    document.getElementById('aiVoiceBotModal').classList.add('hidden');
    document.getElementById('aiChatButton').style.display = 'flex';
    
    // Stop any ongoing voice recognition
    if (isListening && recognition) {
        recognition.stop();
    }
    
    // Reset voice mode
    isVoiceActive = false;
}

// ============================================================================
// MENU FUNCTIONS - Enhanced
// ============================================================================

function activateAIVoice() {
    isVoiceActive = true;
    addMessage("🎤 Voice mode activated! I can now hear and respond to your questions. You can speak naturally - I'll understand and provide helpful information about our accounting services.", 'ai');
    
    // Auto-start listening
    setTimeout(() => {
        if (!isListening) {
            toggleVoiceInput();
        }
    }, 1000);
    
    speakMessage("Voice mode is now active. What would you like to know about our accounting practice development services?");
}

function setAppointment() {
    addMessage("I'd be happy to help you schedule a consultation! Our appointments are typically 30-45 minutes where we'll discuss your practice goals and how our systems can help you achieve them.", 'ai');
    
    // Start voice interview for appointment
    setTimeout(() => {
        startAppointmentInterview();
    }, 1000);
    
    speakMessage("Let me gather some information to schedule your appointment. I'll ask you a few quick questions.");
}

function requestCall() {
    addMessage("Perfect! I'll help you request a callback from one of our practice development specialists. They'll be able to discuss your specific situation and how we can help.", 'ai');
    
    // Start voice interview for callback
    setTimeout(() => {
        startCallbackInterview();
    }, 1000);
    
    speakMessage("I'll need some basic information for the callback. Let me ask you a few questions.");
}

function sendMessage() {
    addMessage("🎤 Opening voice interview mode! I'll ask you some questions to gather information. This is much more natural than filling out forms - just speak your answers.", 'ai');
    
    // Open the voice interview modal
    showVoiceInterviewModal();
    
    speakMessage("I'm opening our voice interview system. This allows us to have a natural conversation to gather the information we need.");
}

function startVideoReview() {
    addMessage("🎥 Fantastic! I'd love to capture your experience with New Clients Inc. Video testimonials help other accounting professionals learn about our services and results.", 'ai');
    showVideoModal();
    speakMessage("I'm opening the video testimonial interface. We'll have a brief conversation about your experience with our services.");
}

// ============================================================================
// SHORTCUT BUTTON FUNCTIONS - Your Design
// ============================================================================

function quickTopic(topic) {
    addMessage(`Tell me about ${topic}`, 'user');
    
    let response = "";
    
    switch(topic) {
        case 'Tax Prep':
            response = "Our tax preparation services are comprehensive and designed for both individual accountants and firms looking to enhance their tax capabilities. We provide training, systems, and ongoing support to help you deliver exceptional tax services to your clients. Many of our clients have significantly increased their revenue by improving their tax service offerings.";
            break;
        case 'Bookkeeping':
            response = "We help accounting professionals systemize their bookkeeping services for maximum efficiency and profitability. Our proven methods help you standardize processes, price appropriately, and deliver consistent value to clients. This often becomes a foundation for steady monthly recurring revenue.";
            break;
        case 'Business Consulting':
            response = "Business consulting is where many accountants can command premium fees. We teach you how to transition from being just a 'numbers person' to becoming a trusted business advisor. Our clients often double or triple their hourly rates by adding strategic consulting services.";
            break;
        case 'Practice Growth':
            response = "This is our specialty! Our practice development systems have helped thousands of accountants grow from startup to multi-million dollar practices. We provide proven marketing systems, client acquisition methods, and operational improvements. Most clients see significant growth within 6-12 months.";
            break;
    }
    
    setTimeout(() => {
        addMessage(response, 'ai');
        if (isVoiceActive) {
            speakMessage(response);
        }
    }, 500);
}

// ============================================================================
// VOICE INTERVIEW SYSTEM - Revolutionary Feature
// ============================================================================

function showVoiceInterviewModal() {
    document.getElementById('voiceInterviewModal').classList.remove('hidden');
    currentInterviewStep = 0;
    interviewData = {};
    updateInterviewProgress();
}

function closeVoiceInterview() {
    document.getElementById('voiceInterviewModal').classList.add('hidden');
    isInterviewMode = false;
    currentInterviewStep = 0;
}

function startVoiceInterview() {
    isInterviewMode = true;
    document.getElementById('startInterview').classList.add('hidden');
    document.getElementById('stopInterview').classList.remove('hidden');
    
    updateInterviewStatus("Interview started - I'll ask you questions one at a time");
    askNextInterviewQuestion();
}

function stopVoiceInterview() {
    isInterviewMode = false;
    document.getElementById('startInterview').classList.remove('hidden');
    document.getElementById('stopInterview').classList.add('hidden');
    
    updateInterviewStatus("Interview completed! Thank you for the information.");
    
    // Process collected data
    processInterviewData();
    
    setTimeout(() => {
        closeVoiceInterview();
    }, 2000);
}

function askNextInterviewQuestion() {
    if (currentInterviewStep < interviewQuestions.length) {
        const question = interviewQuestions[currentInterviewStep];
        document.getElementById('currentQuestion').textContent = question;
        updateInterviewStatus(`Question ${currentInterviewStep + 1} of ${interviewQuestions.length}`);
        
        // Speak the question
        speakMessage(question);
        
        // Start listening for response
        setTimeout(() => {
            if (recognition && !isListening) {
                recognition.start();
            }
        }, 2000);
        
    } else {
        // Interview complete
        stopVoiceInterview();
    }
}

function handleInterviewResponse(response) {
    // Store the response
    const questionKey = `question_${currentInterviewStep}`;
    interviewData[questionKey] = {
        question: interviewQuestions[currentInterviewStep],
        answer: response
    };
    
    // Provide intelligent assistance if needed
    if (needsAssistance(response, currentInterviewStep)) {
        provideAssistance(currentInterviewStep, response);
        return; // Don't move to next question yet
    }
    
    // Acknowledge the response
    const acknowledgments = [
        "Got it, thank you!",
        "Perfect, I have that recorded.",
        "Excellent, moving on.",
        "Great, that's helpful.",
        "Thank you for that information."
    ];
    
    const randomAck = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
    speakMessage(randomAck);
    
    // Move to next question
    currentInterviewStep++;
    updateInterviewProgress();
    
    setTimeout(() => {
        askNextInterviewQuestion();
    }, 2000);
}

function needsAssistance(response, step) {
    const lowerResponse = response.toLowerCase();
    
    // Check for uncertainty indicators
    const uncertaintyWords = ['not sure', 'don\'t know', 'maybe', 'i guess', 'um', 'uh', 'not really sure'];
    
    return uncertaintyWords.some(word => lowerResponse.includes(word));
}

function provideAssistance(step, response) {
    let assistanceMessage = "";
    
    switch(step) {
        case 0: // Name question
            assistanceMessage = "No problem! Just tell me what you'd like me to call you - it can be your first name or whatever you prefer.";
            break;
        case 1: // Business name
            assistanceMessage = "That's okay! You can tell me if you're a sole proprietor, the name of your firm, or just say 'individual' if you're looking for personal services.";
            break;
        case 2: // Phone number
            assistanceMessage = "I understand. You can provide any number where we can reach you - mobile, office, or even just tell me the best way to contact you.";
            break;
        case 3: // Best time
            assistanceMessage = "No worries! You could say something like 'mornings', 'afternoons', 'weekdays', or any time that generally works for you.";
            break;
        case 4: // Services
            assistanceMessage = "That's perfectly fine! You might be interested in tax preparation, bookkeeping, growing your practice, or just learning about what we offer. What sounds most relevant to you?";
            break;
    }
    
    speakMessage(assistanceMessage);
    
    // Restart listening for this question
    setTimeout(() => {
        if (recognition && !isListening) {
            recognition.start();
        }
    }, 3000);
}

function updateInterviewProgress() {
    const progress = (currentInterviewStep / interviewQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `${currentInterviewStep}/${interviewQuestions.length} questions`;
}

function updateInterviewStatus(status) {
    document.getElementById('interviewStatus').textContent = status;
}

function processInterviewData() {
    console.log('Interview data collected:', interviewData);
    
    // Create summary message
    let summary = "Here's what I gathered from our conversation:\n\n";
    Object.values(interviewData).forEach((item, index) => {
        summary += `${index + 1}. ${item.question}\nAnswer: "${item.answer}"\n\n`;
    });
    
    addMessage("✅ Interview completed! I've gathered all the information we need. Someone from our team will reach out to you soon with next steps.", 'ai');
    
    // Here you would typically send the data to your server
    // sendInterviewDataToServer(interviewData);
}

// ============================================================================
// APPOINTMENT & CALLBACK INTERVIEWS
// ============================================================================

function startAppointmentInterview() {
    const appointmentQuestions = [
        "What's your name?",
        "What's your business or practice name?",
        "What's the best phone number to reach you?",
        "What days of the week work best for you?",
        "What time of day do you prefer for appointments?",
        "What's your main goal for our consultation?"
    ];
    
    // Use the same interview system but with appointment-specific questions
    currentInterviewStep = 0;
    interviewData = {};
    isInterviewMode = true;
    
    // Override questions temporarily
    const originalQuestions = [...interviewQuestions];
    interviewQuestions.length = 0;
    interviewQuestions.push(...appointmentQuestions);
    
    askNextInterviewQuestion();
    
    // Restore original questions when done
    setTimeout(() => {
        interviewQuestions.length = 0;
        interviewQuestions.push(...originalQuestions);
    }, appointmentQuestions.length * 15000);
}

function startCallbackInterview() {
    const callbackQuestions = [
        "What's your name?",
        "What's the best phone number for the callback?",
        "When would be the best time to call you?",
        "What would you like to discuss on the call?",
        "How soon would you like someone to call you back?"
    ];
    
    // Similar to appointment interview
    currentInterviewStep = 0;
    interviewData = {};
    isInterviewMode = true;
    
    const originalQuestions = [...interviewQuestions];
    interviewQuestions.length = 0;
    interviewQuestions.push(...callbackQuestions);
    
    askNextInterviewQuestion();
    
    setTimeout(() => {
        interviewQuestions.length = 0;
        interviewQuestions.push(...originalQuestions);
    }, callbackQuestions.length * 15000);
}

// ============================================================================
// VOICE PROCESSING - Enhanced
// ============================================================================

function toggleVoiceInput() {
    if (!recognition) {
        updateVoiceStatus('Speech recognition not available');
        return;
    }

    if (isListening) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (error) {
            console.log('Recognition start error:', error);
            updateVoiceStatus('Please try again');
        }
    }
}

function handleVoiceInput(transcript) {
    addMessage(transcript, 'user');
    updateVoiceStatus('Processing your message...');
    
    setTimeout(() => {
        handleUserMessage(transcript);
        updateVoiceStatus('Click microphone to speak');
    }, 500);
}

function updateVoiceStatus(status) {
    const statusElement = document.getElementById('voiceStatus');
    if (statusElement) {
        statusElement.textContent = status;
    }
}

// ============================================================================
// MESSAGE PROCESSING - Enhanced Intelligence
// ============================================================================

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        setTimeout(() => {
            handleUserMessage(message);
        }, 500);
    }
}

function handleUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = "";
    let foundMatch = false;

    // Check for specific keywords in accounting knowledge base
    for (const [key, value] of Object.entries(accountingKnowledge)) {
        if (lowerMessage.includes(key)) {
            response = value;
            foundMatch = true;
            break;
        }
    }

    // Enhanced conversational responses
    if (!foundMatch) {
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = getRandomResponse(conversationFlows.greeting);
        } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
            response = "I'm here to help! I can provide information about our tax preparation services, bookkeeping solutions, business consulting, or our proven practice development systems. I can also help you schedule a consultation or request a callback. What specific area interests you most?";
        } else if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
            response = "I'd be happy to help you schedule a consultation! Our appointments are typically 30-45 minutes where we discuss your practice goals and show you exactly how our systems can help. Let me gather some information to set this up for you.";
            setTimeout(() => startAppointmentInterview(), 1000);
        } else if (lowerMessage.includes('call') || lowerMessage.includes('phone') || lowerMessage.includes('callback')) {
            response = "Perfect! I can arrange for one of our practice development specialists to call you back. They'll be able to discuss your specific situation and answer any detailed questions you have.";
            setTimeout(() => startCallbackInterview(), 1000);
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('investment')) {
            response = "Great question! Our investment levels vary based on your specific needs and goals. We have solutions ranging from basic consultations to comprehensive practice development programs. Most clients see ROI within 3-6 months. The best way to get accurate pricing is through a brief consultation where we can understand your situation. Would you like me to set that up?";
        } else if (lowerMessage.includes('results') || lowerMessage.includes('success') || lowerMessage.includes('growth')) {
            response = "Our results speak for themselves! We've helped thousands of accountants grow their practices significantly. Many of our clients double or triple their revenue within 18 months. We have documented case studies showing practices growing from $50K to over $1M in annual revenue. Would you like to see some specific testimonials or schedule a call to discuss how this applies to your situation?";
        } else if (lowerMessage.includes('testimonial') || lowerMessage.includes('review') || lowerMessage.includes('feedback')) {
            response = "We'd love to capture your experience! Our video testimonial system makes it easy - I can guide you through a brief interview about your results with our services. This helps other accounting professionals learn about what we do. Would you like to record a testimonial?";
            setTimeout(() => startVideoReview(), 1000);
        } else {
            response = "That's an excellent question! I want to make sure I give you the most accurate and helpful information. Would you like me to connect you with one of our specialists who can provide detailed answers, or would you prefer to schedule a consultation where you can get comprehensive information about your specific situation?";
        }
    }

    addMessage(response, 'ai');
    
    // Speak the response if voice mode is active
    if (isVoiceActive) {
        speakMessage(response);
    }
}

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function addMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================================================
// TEXT-TO-SPEECH - Premium Quality
// ============================================================================

async function speakMessage(message) {
    const ELEVENLABS_API_KEY = 'sk_4f5c9b8a7e6d3c2b1a9f8e7d6c5b4a3f2e1d9c8b'; // Replace with your key
    const VOICE_ID = 'zGjIP4SZlMnY9m93k97r'; // Hope voice ID
    
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: message,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });
        
        if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            audio.onended = () => URL.revokeObjectURL(audioUrl);
            await audio.play();
        } else {
            fallbackSpeech(message);
        }
    } catch (error) {
        console.log('ElevenLabs error, using fallback:', error);
        fallbackSpeech(message);
    }
}

function fallbackSpeech(message) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Woman') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Victoria')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// ============================================================================
// VIDEO TESTIMONIAL FUNCTIONS - Enhanced
// ============================================================================

function showVideoModal() {
    document.getElementById('videoTestimonialModal').classList.remove('hidden');
    initializeVideoCapture();
}

function closeVideoModal() {
    document.getElementById('videoTestimonialModal').classList.add('hidden');
    stopVideoCapture();
}

async function initializeVideoCapture() {
    try {
        userStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });
        
        const videoElement = document.getElementById('userVideo');
        videoElement.srcObject = userStream;
        
        updateRecordingStatus('Camera ready - Click Start Recording to begin testimonial');
        
    } catch (error) {
        console.log('Video capture error:', error);
        updateRecordingStatus('Camera access denied. Please check permissions and try again.');
    }
}

function stopVideoCapture() {
    if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
        userStream = null;
    }
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

function startRecording() {
    if (!userStream) {
        updateRecordingStatus('Please allow camera access first');
        return;
    }
    
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(userStream);
    
    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    
    mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        console.log('Video testimonial recorded:', url);
        updateRecordingStatus('Testimonial recorded successfully! Thank you for sharing your experience.');
        
        addMessage("🎥 Thank you for recording your testimonial! Your video has been captured successfully and will help other accounting professionals learn about our services.", 'ai');
    };
    
    mediaRecorder.start();
    updateRecordingStatus('Recording testimonial... I\'ll guide you through some questions.');
    
    document.getElementById('startRecording').classList.add('hidden');
    document.getElementById('stopRecording').classList.remove('hidden');
    
    // Start AI testimonial interview
    setTimeout(() => {
        startTestimonialInterview();
    }, 2000);
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('startRecording').classList.remove('hidden');
        document.getElementById('stopRecording').classList.add('hidden');
    }
}

function startTestimonialInterview() {
    const testimonialQuestions = [
        "Thank you for taking time to share your experience! First, could you tell me your name and your business?",
        "What initially brought you to New Clients Inc?",
        "What was your biggest challenge before working with us?",
        "What specific results have you seen since implementing our systems?",
        "What would you tell another accountant who's considering our services?"
    ];
    
    let currentQuestion = 0;
    
    function askNextTestimonialQuestion() {
        if (currentQuestion < testimonialQuestions.length) {
            const question = testimonialQuestions[currentQuestion];
            updateRecordingStatus(`Question ${currentQuestion + 1}: ${question}`);
            speakMessage(question);
            currentQuestion++;
            
            // Wait for answer and move to next question
            setTimeout(askNextTestimonialQuestion, 20000); // 20 seconds per question
        } else {
            updateRecordingStatus('Testimonial interview complete! Thank you so much for sharing.');
            speakMessage("That was perfect! Thank you so much for sharing your experience with New Clients Inc.");
            
            setTimeout(() => {
                stopRecording();
            }, 4000);
        }
    }
    
    askNextTestimonialQuestion();
}

function updateRecordingStatus(status) {
    const statusElement = document.getElementById('recordingStatus');
    if (statusElement) {
        statusElement.textContent = status;
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function initializeEventListeners() {
    // Enter key in chat input
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Video recording buttons
    document.getElementById('startRecording').addEventListener('click', startRecording);
    document.getElementById('stopRecording').addEventListener('click', stopRecording);
    
    // Close modals when clicking backdrop
    document.getElementById('modalBackdrop').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAIVoiceBot();
        }
    });
}

// Initialize voices for speech synthesis
window.addEventListener('load', function() {
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
    }
});

console.log('🚀 NCI AI Voice Assistant - Revolutionary System Loaded!');