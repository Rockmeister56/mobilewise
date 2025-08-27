// ===========================================
// AI HOSTED INTERVIEWS MODULE - NAVIGATION
// Mobile-Wise AI Formviser
// ===========================================

const AIHostedInterviewsModule = {
    
    // Module Configuration
    config: {
        interviewTypes: {
            'video-review': {
                title: 'AI Hosted Video Review',
                subtitle: 'AI Interview Questions',
                questions: [
    'Why did you choose NCI in the first place?',
    'Did NCI exceed your expectations and how so?', 
    'Would you recommend NCI to other CPA\'s?',
    'How likely are you to use NCI services again?'
]
            },
            'sell-practice': {
                title: 'Sell My Practice FAST',
                subtitle: 'Business Qualification Interview',
                questions: [
                    'How much are you looking to get for your practice?',
                    'What type of clients do you primarily serve?',
                    'What is your timeline for selling?'
                ]
            },
            'buy-practice': {
                title: 'Qualify to Buy a Practice',
                subtitle: 'Purchase Qualification Interview', 
                questions: [
                    'What type of practice are you looking for?',
                    'What is your budget range?',
                    'What is your timeline for purchase?'
                ]
            }
        }
    },

    // ===========================================
// PHASE 3: AI INTERVIEW DIRECTOR SYSTEM
// ===========================================

// Audio & Recording state
audioState: {
    introAudio: null,
    speechSynthesis: null,
    isPlaying: false,
    mediaRecorder: null,
    recordedChunks: [],
    currentRecording: null
},

// Add this RIGHT AFTER audioState
cameraState: {
    stream: null,
    mediaRecorder: null,
    recordedChunks: [],
    isRecording: false,
    currentQuestionIndex: null
},

// Audio URLs
audioUrls: {
    introAudio: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/audio-intros/ai_intro_1756153568088.mp3',
    questionGraphic: 'https://odetjszursuaxpapfwcy.supabase.co/storage/v1/object/public/form-assets/logos/logo_5f42f026-051a-42c7-833d-375fcac74252_1756094970337_graphic3.PNG'
},

// Initialize Audio System
initializeAudioSystem: function() {
    console.log('🎙️ Initializing AI audio system...');
    
    // Preload intro audio
    this.audioState.introAudio = new Audio(this.audioUrls.introAudio);
    this.audioState.introAudio.preload = 'auto';
    
    // Test speech synthesis
    if ('speechSynthesis' in window) {
        console.log('✅ Text-to-speech available');
    } else {
        console.warn('⚠️ Text-to-speech not supported');
    }
},

// Play Welcome Audio
playWelcomeAudio: async function() {
    console.log('🎵 Playing welcome audio...');
    
    try {
        this.audioState.isPlaying = true;
        await this.audioState.introAudio.play();
        
        
        this.audioState.introAudio.onended = () => {
            this.audioState.isPlaying = false;
            this.showAudioStatus('✅ Ready for questions! Click START to begin.');
            setTimeout(() => {
    const statusEl = document.querySelector('.audio-status');
    if (statusEl && statusEl.textContent.includes('Click START')) {
        statusEl.style.transition = 'opacity 0.5s ease';
        statusEl.style.opacity = '0';
        setTimeout(() => statusEl.remove(), 500);
        console.log('🎯 START message cleared for question display');
    }
}, 3000); // Fade out after 3 seconds instead of 5
        };
        
    } catch (error) {
        console.error('❌ Audio playback failed:', error);
        // this.showAudioStatus('⚠️ Audio unavailable - Ready for questions!');
    }
},

// Show Audio Status
showAudioStatus: function(message) {
    const videoPreview = document.querySelector('.video-preview-area .preview-placeholder');
    if (videoPreview) {
        // Create or update status overlay
        let statusOverlay = videoPreview.querySelector('.audio-status');
        if (!statusOverlay) {
            statusOverlay = document.createElement('div');
            statusOverlay.className = 'audio-status';
            statusOverlay.style.cssText = `
                position: absolute;
                bottom: 10px;
                left: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: #00ff88;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                text-align: center;
                z-index: 10;
                border: 1px solid #00ff88;
            `;
            videoPreview.appendChild(statusOverlay);
        }
        statusOverlay.textContent = message;
        
        // Auto-hide after 5 seconds for non-ready messages
        if (!message.includes('Ready')) {
            setTimeout(() => {
                if (statusOverlay) statusOverlay.remove();
            }, 5000);
        }
    }
},

// ==============================================
// EMPIRE VOICE SYSTEM - BULLETPROOF VERSION 2.0
// ==============================================
speakQuestion: async function(questionText) {
    console.log('🎯 AI speaking question with EMPIRE VOICE SYSTEM 2.0:', questionText);
    
    // PREVENT DOUBLE EXECUTION - BULLETPROOF LOCK
    if (window.voiceSystemBusy) {
        console.log('🛡️ BLOCKED: Voice system already busy');
        return;
    }
    
    window.voiceSystemBusy = true;
    
    return new Promise((resolve) => {
        if ('speechSynthesis' in window) {
            
            // FUNCTION TO SPEAK ONCE VOICES ARE LOADED
            const speakWithVoice = () => {
                // DOUBLE-CHECK: Prevent multiple executions
                if (window.speechAlreadyStarted) {
                    console.log('🛡️ BLOCKED: Speech already started');
                    return;
                }
                window.speechAlreadyStarted = true;
                
                const utterance = new SpeechSynthesisUtterance(questionText);
                
                // GET LOADED VOICES
                const voices = speechSynthesis.getVoices();
                console.log('🎙️ Available voices loaded:', voices.length);
                
                // ==============================================
                // UPGRADED VOICE SELECTION - CHROME & EDGE PREMIUM
                // ==============================================
                const preferredVoices = [
                    // CHROME PREMIUM VOICES (Google's Neural Voices)
                    'Google US English Female',                      // TOP Chrome voice
                    'Chrome OS US English Female',                   // Chrome OS premium
                    'Google UK English Female',                      // British accent premium
                    'Chrome OS UK English Female',                   // Chrome OS British
                    
                    // EDGE PREMIUM VOICES (Microsoft Neural Voices)  
                    'Microsoft Eva - English (United States)',       // BEST Edge voice
                    'Microsoft Aria - English (United States)',      // Professional Edge
                    'Microsoft Jenny - English (United States)',     // Natural Edge voice
                    'Microsoft Michelle - English (United States)',  // Warm Edge voice
                    'Microsoft Hazel - English (Great Britain)',     // British Edge voice
                    
                    // PREMIUM DESKTOP VOICES
                    'Microsoft Zira Desktop - English (United States)', // Enhanced Zira
                    'Samantha',                                       // macOS premium
                    'Alex',                                           // macOS natural
                    
                    // FALLBACK VOICES (Still better than basic)
                    'Microsoft Zira - English (United States)',      // Standard Zira
                    'Microsoft David - English (United States)'      // Male fallback
                ];

                let selectedVoice = null;
                
                console.log('🎯 Searching for PREMIUM voices from', preferredVoices.length, 'options...');

                // Try preferred voices in priority order
                for (let i = 0; i < preferredVoices.length; i++) {
                    const voiceName = preferredVoices[i];
                    
                    // Try exact match first
                    selectedVoice = voices.find(voice => voice.name === voiceName);
                    
                    // Try partial match if exact fails
                    if (!selectedVoice) {
                        selectedVoice = voices.find(voice => voice.name.includes(voiceName));
                    }
                    
                    // Try loose match for Google voices
                    if (!selectedVoice && voiceName.includes('Google')) {
                        selectedVoice = voices.find(voice => 
                            voice.name.toLowerCase().includes('google') && 
                            voice.name.toLowerCase().includes('female')
                        );
                    }
                    
                    if (selectedVoice) {
                        console.log(`✅ PREMIUM VOICE FOUND (Priority ${i+1}):`, selectedVoice.name);
                        console.log(`🎭 Voice Details: ${selectedVoice.lang} | Local: ${selectedVoice.localService}`);
                        break;
                    }
                }

                // Enhanced fallback search for any premium female voice
                if (!selectedVoice) {
                    console.log('🔍 Searching for ANY premium female voice...');
                    
                    const femaleKeywords = ['eva', 'aria', 'jenny', 'michelle', 'hazel', 'female', 'samantha'];
                    
                    for (const keyword of femaleKeywords) {
                        selectedVoice = voices.find(voice =>
                            voice.lang.startsWith('en') &&
                            voice.name.toLowerCase().includes(keyword)
                        );
                        if (selectedVoice) {
                            console.log('🎭 Found premium female voice via keyword search:', selectedVoice.name);
                            break;
                        }
                    }
                }

                // Final fallback - best English voice available
                if (!selectedVoice) {
                    console.log('🚨 Using emergency fallback - any English voice...');
                    selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
                    if (selectedVoice) {
                        console.log('🆘 Emergency voice selected:', selectedVoice.name);
                    }
                }

                // Apply the selected voice with OPTIMIZED SETTINGS
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                    
                    // OPTIMIZE VOICE SETTINGS BASED ON VOICE TYPE
                    if (selectedVoice.name.includes('Google')) {
                        // Google voices work best with these settings
                        utterance.rate = 1.0;
                        utterance.pitch = 1.1;
                        utterance.volume = 1.0;
                        console.log('🎛️ Applied Google voice optimizations');
                    } else if (selectedVoice.name.includes('Eva') || selectedVoice.name.includes('Aria')) {
                        // Microsoft neural voices - premium settings
                        utterance.rate = 0.95;
                        utterance.pitch = 1.15;
                        utterance.volume = 0.9;
                        console.log('🎛️ Applied Microsoft Neural voice optimizations');
                    } else if (selectedVoice.name.includes('Jenny') || selectedVoice.name.includes('Michelle')) {
                        // Other Microsoft premium voices
                        utterance.rate = 1.0;
                        utterance.pitch = 1.12;
                        utterance.volume = 0.92;
                        console.log('🎛️ Applied Microsoft Premium voice optimizations');
                    } else if (selectedVoice.name.includes('Zira')) {
                        // Standard Zira - boost settings for better sound
                        utterance.rate = 0.9;
                        utterance.pitch = 1.2;
                        utterance.volume = 0.95;
                        console.log('🎛️ Applied enhanced Zira optimizations');
                    } else {
                        // Default premium settings
                        utterance.rate = 1.0;
                        utterance.pitch = 1.1;
                        utterance.volume = 0.95;
                        console.log('🎛️ Applied standard premium optimizations');
                    }
                    
                    console.log('🎤 FINAL SELECTION:', selectedVoice.name, '| Language:', selectedVoice.lang);
                    console.log('🎚️ Voice Settings: Rate=' + utterance.rate + ', Pitch=' + utterance.pitch + ', Volume=' + utterance.volume);
                    
                } else {
                    console.log('⚠️ NO SUITABLE VOICE FOUND - Using system default');
                    console.log('📝 Available voices were:', voices.map(v => `${v.name} (${v.lang})`));
                    
                    // Default settings for system voice
                    utterance.rate = 1.0;
                    utterance.pitch = 1.1;
                    utterance.volume = 0.9;
                }
                
                utterance.onend = () => {
                    console.log('✅ Question spoken - ready for camera transition');
                     const questionBox = document.querySelector('.question-graphic, [class*="question"]');
    if (questionBox) questionBox.style.display = 'none';
   // Remove question graphic - user can now see camera and click STOP
AIHostedInterviewsModule.removeQuestionGraphic();
console.log('✅ Question spoken - user can now interact with camera');
                    window.voiceSystemBusy = false;
                    window.speechAlreadyStarted = false;
                    resolve();
                };
                
                utterance.onerror = (error) => {
                    console.error('❌ Speech synthesis failed:', error);
                    window.voiceSystemBusy = false;
                    window.speechAlreadyStarted = false;
                    resolve();
                };
                
                // CLEAR ANY EXISTING SPEECH FIRST
                speechSynthesis.cancel();
                
                // START SPEAKING
                speechSynthesis.speak(utterance);
            };
            
            // CHECK IF VOICES ARE ALREADY LOADED
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                console.log('🎙️ Voices already loaded - proceeding immediately');
                speakWithVoice();
            } else {
                console.log('⏳ Waiting for voices to load...');
                
                // BULLETPROOF VOICE LOADING - NO MORE DOUBLE EXECUTION
                let voicesLoaded = false;
                
                // WAIT FOR VOICES TO LOAD
                speechSynthesis.onvoiceschanged = () => {
                    if (!voicesLoaded) {
                        voicesLoaded = true;
                        console.log('🔄 Voices loaded event fired');
                        speechSynthesis.onvoiceschanged = null; // Remove listener
                        speakWithVoice();
                    }
                };
                
                // FALLBACK TIMER - ONLY IF EVENT DOESN'T FIRE
                setTimeout(() => {
                    if (!voicesLoaded) {
                        voicesLoaded = true;
                        console.log('⏰ Timeout fallback - checking voices again');
                        const fallbackVoices = speechSynthesis.getVoices();
                        if (fallbackVoices.length > 0) {
                            speakWithVoice();
                        } else {
                            console.log('❌ No voices available after timeout');
                            window.voiceSystemBusy = false;
                            window.speechAlreadyStarted = false;
                            resolve();
                        }
                    }
                }, 1000);
            }
            
        } else {
            console.log('⚠️ Speech synthesis not supported');
            window.voiceSystemBusy = false;
            resolve();
        }
    });
},

// Show Question Graphic
showQuestionGraphic: function(questionText) {
    const videoPreview = document.querySelector('.video-preview-area .preview-placeholder');
    if (!videoPreview) return;
    
    // Create question overlay
    const questionOverlay = document.createElement('div');
    questionOverlay.className = 'question-overlay';
    questionOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('${this.audioUrls.questionGraphic}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5;
        border-radius: 8px;
    `;
    
    // Add question text
    const questionTextDiv = document.createElement('div');
    questionTextDiv.style.cssText = `
        background: rgba(0, 0, 0, 0.8);
        color: #ffffff;
        padding: 20px 30px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        max-width: 80%;
        border: 2px solid #00ff88;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    `;
    questionTextDiv.textContent = questionText;
    
    questionOverlay.appendChild(questionTextDiv);
    videoPreview.appendChild(questionOverlay);
    
    console.log('📺 Question graphic displayed');
},

// Remove Question Graphic
removeQuestionGraphic: function() {
    const questionOverlay = document.querySelector('.question-overlay');
    if (questionOverlay) {
        questionOverlay.remove();
        console.log('📺 Question graphic removed');
    }
},

// Start Recording with AI Question
startAIRecording: async function(questionIndex) {
    const question = this.currentQuestions[questionIndex];
    console.log('🎬 Starting AI-hosted recording for question:', question);
    
    // SAFETY CHECK
    if (!this.cameraState || !this.cameraState.stream) {
        console.error('❌ No camera stream available');
        throw new Error('No camera stream available');
    }
    
    try {
        // 1. Show question graphic immediately
        this.showQuestionGraphic(question);
        
        // 2. Start video recording
        const stream = this.cameraState.stream;
        this.audioState.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });
        
        this.audioState.recordedChunks = [];
        
        this.audioState.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.audioState.recordedChunks.push(event.data);
            }
        };
        
        this.audioState.mediaRecorder.onstop = () => {
            this.processRecording(questionIndex);
        };
        
        // 3. Start recording
        this.audioState.mediaRecorder.start();
        console.log('🔴 Video recording started');
        
        // 4. AI speaks the question (5-8 seconds)
        await this.speakQuestion(question);
        
        return true;
        
    } catch (error) {
        console.error('❌ Recording failed:', error);
        this.removeQuestionGraphic();
        return false;
    }
},

// Stop Recording
stopAIRecording: function() {
    console.log('⏹️ Stopping AI recording...');
    
    if (this.audioState.mediaRecorder && this.audioState.mediaRecorder.state === 'recording') {
        this.audioState.mediaRecorder.stop();
    }
    
    this.removeQuestionGraphic();
    // this.showAudioStatus('💾 Processing your video...');
},

// Process Completed Recording
processRecording: function(questionIndex) {
    console.log('🎞️ Processing completed recording...');
    
    const blob = new Blob(this.audioState.recordedChunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);
    
    // Store the recording
    this.audioState.currentRecording = {
        questionIndex: questionIndex,
        blob: blob,
        url: videoUrl,
        timestamp: Date.now()
    };
    
    console.log('✅ Recording processed and ready');
    this.showAudioStatus('✅ Recording complete! Video saved successfully.');
    
    // Auto-hide status after 3 seconds
    setTimeout(() => {
        const statusEl = document.querySelector('.audio-status');
        if (statusEl) statusEl.remove();
    }, 3000);
},

    // Current state tracking
    currentState: 'selection', // selection, questions, recording
    selectedType: null,
    currentQuestions: [],

    // Initialize Module
    init: function() {
        console.log('🚀 Initializing AI Hosted Interviews Module...');
        this.bindEventListeners();
        console.log('✅ AI Hosted Interviews Module Ready!');
    },

    // Initialize Camera Access
    initializeCamera: async function() {
        console.log('📹 Initializing camera access...');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: true
            });
            
            this.cameraState.stream = stream;
            this.displayVideoPreview(stream);
            console.log('✅ Camera access granted!');
            return true;
            
        } catch (error) {
            console.error('❌ Camera access denied:', error);
            this.handleCameraError(error);
            return false;
        }
    },

    // Display Live Video Preview
    displayVideoPreview: function(stream) {
        const videoPreview = document.querySelector('.video-preview-area .preview-placeholder');
        
        if (videoPreview) {
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            videoElement.style.borderRadius = '8px';
            
            videoPreview.innerHTML = '';
            videoPreview.appendChild(videoElement);
            console.log('🎬 Live video preview active!');
        }
    },

    // Handle Camera Errors
    handleCameraError: function(error) {
        const videoPreview = document.querySelector('.video-preview-area .preview-placeholder');
        
        let errorMessage = '';
        if (error.name === 'NotAllowedError') {
            errorMessage = '📹 Camera access denied. Please allow camera permissions and refresh.';
        } else if (error.name === 'NotFoundError') {
            errorMessage = '📹 No camera found. Please connect a camera and refresh.';
        } else {
            errorMessage = '📹 Camera error. Please check your camera settings.';
        }
        
        if (videoPreview) {
            videoPreview.innerHTML = `
                <div style="color: #ff4757; text-align: center; padding: 20px;">
                    <p>${errorMessage}</p>
                    <button onclick="AIHostedInterviewsModule.initializeCamera()" 
                            style="margin-top: 10px; padding: 8px 16px; background: #00d4ff; 
                                   color: #000; border: none; border-radius: 4px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            `;
        }
    },

    // Bind Event Listeners
    bindEventListeners: function() {
        // Selection buttons
        const selectionBtns = document.querySelectorAll('.selection-btn');
        selectionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSelectionClick(e));
        });
    },

    // Handle Selection Button Click
    // Replace the handleSelectionClick function with this:
handleSelectionClick: function(e) {
    const button = e.currentTarget;
    const interviewType = button.getAttribute('data-type');
    
    console.log(`📹 Selected interview type: ${interviewType}`);
    
    // Store selection
    this.selectedType = interviewType;
    this.currentQuestions = this.config.interviewTypes[interviewType].questions;
    
    // Immediate transition - NO status message on button screen
    this.transitionToQuestions();
},

    // Show Status Message
    showStatusMessage: function(message) {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.querySelector('p').textContent = message;
            statusEl.style.display = 'block';
        }
    },

    // Transition to Questions Screen - FIXED VERSION
transitionToQuestions: async function() {
    console.log('🎯 Transitioning to questions screen...');
    
    const moduleContainer = document.querySelector('.ai-interviews-interface');
    if (!moduleContainer) return;

    const questionsHTML = this.generateQuestionsHTML();
    
    moduleContainer.style.transition = 'opacity 0.3s ease';
    moduleContainer.style.opacity = '0';
    
    setTimeout(async () => {
        moduleContainer.innerHTML = questionsHTML;
        this.bindQuestionListeners();
        moduleContainer.style.opacity = '1';
        this.currentState = 'questions';

        // Initialize camera and audio systems
        await this.initializeCamera();
        this.initializeAudioSystem();  // ADD THIS LINE!
        
        // Play welcome audio after camera is ready
        setTimeout(() => {
            this.playWelcomeAudio();
        }, 1000);
        
        console.log('✅ Questions screen loaded with AI director!');
    }, 300);
},

    // Generate Questions HTML
    generateQuestionsHTML: function() {
        const interviewData = this.config.interviewTypes[this.selectedType];
        
        let questionsHTML = `
            <div class="video-preview-area">
                <div class="preview-placeholder">
                    <p>Video preview will appear here</p>
                </div>
            </div>
            
            <div class="interface-header">
                <h2>${interviewData.title}</h2>
                <p>${interviewData.subtitle}</p>
            </div>
            
            <div class="questions-container">
        `;
        
        // Add each question with START button
        interviewData.questions.forEach((question, index) => {
            questionsHTML += `
                <div class="question-row">
                    <div class="question-number">START</div>
                    <div class="question-text" id="questionText${index}">${question}</div>
                </div>
            `;
        });
        
        questionsHTML += `
            </div>
            
            <div class="control-buttons">
                <button class="back-btn" id="backToSelection">← Back to Selection</button>
                <button class="done-btn" id="allDone">All Done!</button>
            </div>
        `;
        
        return questionsHTML;
    },

    // Bind Question Screen Event Listeners  
    bindQuestionListeners: function() {
        // START button functionality
        const startBtns = document.querySelectorAll('.question-number');
        startBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.handleQuestionStart(index));
        });
        
        // Back button
        const backBtn = document.getElementById('backToSelection');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToSelection());
        }
        
        // Done button  
        const doneBtn = document.getElementById('allDone');
        if (doneBtn) {
            doneBtn.addEventListener('click', () => handleAllDone());
        }
    },

// Handle Question Start - WORKING VERSION
handleQuestionStart: async function(questionIndex) {
    const question = this.currentQuestions[questionIndex];
    const startBtn = document.querySelectorAll('.question-number')[questionIndex];
    const questionTextEl = document.getElementById(`questionText${questionIndex}`);
    
    console.log(`🎬 Button clicked for question ${questionIndex + 1}: ${startBtn.textContent}`);
    
    if (startBtn.textContent === 'START') {
        // START RECORDING
        // this.showAudioStatus(''); // DISABLED - was creating empty box
    startBtn.textContent = 'STOP';
        startBtn.textContent = 'STOP';
        startBtn.className = 'question-number stop-state';
        
        // Show BIG STOP button immediately (fallback)
        if (questionTextEl) {
            questionTextEl.innerHTML = `
                <button style="
                    background-color: #ff4757;
                    color: white;
                    border: 2px solid #ff4757;
                    border-radius: 8px;
                    padding: 15px 30px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    text-align: center;
                " onclick="AIHostedInterviewsModule.handleQuestionStart(${questionIndex})">
                    🔴 CLICK TO STOP RECORDING
                </button>
            `;
        }
        
        // Try to start AI recording (if it fails, STOP button still works)
        if (this.cameraState && this.cameraState.stream) {
            try {
                await this.startAIRecording(questionIndex);
                console.log('✅ AI recording started');
            } catch (error) {
                console.error('⚠️ AI recording failed, but STOP button still works:', error);
            }
        } else {
            console.warn('⚠️ No camera stream - STOP button works but no recording');
        }
        
    } else if (startBtn.textContent === 'STOP') {
        // STOP RECORDING
        if (this.stopAIRecording) {
            this.stopAIRecording();
        }
        
        startBtn.textContent = 'REDO';
        startBtn.className = 'question-number redo-state';
        
        // Show completed status
        if (questionTextEl) {
            questionTextEl.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                ">
                    <span style="
                        color: #2ed573; 
                        font-weight: bold; 
                        font-size: 16px;
                        text-align: center;
                    ">✅ COMPLETED</span>
                </div>
            `;
        }
        
    } else if (startBtn.textContent === 'REDO') {
        // REDO - Reset everything
        startBtn.textContent = 'START';
        startBtn.className = 'question-number start-state';
        
        // Clear any existing recording
        if (this.audioState && this.audioState.currentRecording) {
            URL.revokeObjectURL(this.audioState.currentRecording.url);
            this.audioState.currentRecording = null;
        }
        
        // Reset question text
        if (questionTextEl) {
            questionTextEl.textContent = this.currentQuestions[questionIndex];
            questionTextEl.style.color = '#ffffff';
        }
        
        console.log('🔄 Question reset for redo');
    }
},

    // Handle Stop Recording (placeholder)
    handleStopRecording: function(questionIndex) {
        const questionTextEl = document.getElementById(`questionText${questionIndex}`);
        
        console.log(`⏹️ Stopping recording for question ${questionIndex + 1}`);
        
        // Reset question text
        if (questionTextEl) {
            questionTextEl.textContent = this.currentQuestions[questionIndex];
            questionTextEl.style.color = '#ffffff';
            questionTextEl.style.cursor = 'default';
        }
        
        // Placeholder for video processing
        alert(`Recording stopped and saved as: "Business Name Review ${questionIndex + 1}.mp4"`);
    },

    // Back to Selection Screen
    backToSelection: function() {
        console.log('🔙 Returning to selection screen...');
        
        // Reset state
        this.currentState = 'selection';
        this.selectedType = null;
        this.currentQuestions = [];
        
        // Reload page to reset to original state
        location.reload();
    },
}

// MOBILE-WISE AI FORMVISER - PUBLISHING BRIDGE
function handleAllDone() {
    showLoadingTransition();
    
    setTimeout(() => {
        // Get videos from the module instance safely
        const videos = AIHostedInterviewsModule.recordedVideos || [];
        const session = AIHostedInterviewsModule.currentSession || {};
        
        console.log('🎬 Videos to store:', videos.length);
        console.log('📋 Session data:', session);
        
        // Store session data
        localStorage.setItem('recordedVideos', JSON.stringify(videos));
        localStorage.setItem('interviewSession', JSON.stringify(session));
        
        // Navigate to publishing module
        window.location.href = '/publishing-module.html';
    }, 1500);
}

function showLoadingTransition() {
    // Create celebration overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'publishing-celebration-overlay';
    loadingOverlay.innerHTML = `
        <div class="celebration-content">
            <div class="confetti-container" id="confettiContainer"></div>
            <div class="celebration-message">
                <div class="spinner"></div>
                <h2>🎉 CONGRATULATIONS! 🎉</h2>
                <h3>🚀 Your Videos Are Being Published!</h3>
                <p>Transitioning to Mobile-Wise AI Publishing Center</p>
                <div class="success-checkmark">✅</div>
            </div>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    // Trigger confetti animation
    createConfetti();
}

// CONFETTI MAGIC! 🎊
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(confetti);
        }, i * 20);
    }
}
// Initialize when DOM is loaded - ESSENTIAL FOR MODULE STARTUP
document.addEventListener('DOMContentLoaded', function() {
    AIHostedInterviewsModule.init();
    
});