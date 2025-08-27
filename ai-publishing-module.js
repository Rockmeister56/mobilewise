// ===========================================
// SUPABASE VIDEO STORAGE INTEGRATION
// ===========================================

const SUPABASE_CONFIG = {
    url: 'https://odetjszursuaxpapfwcy.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZXRqc3p1cnN1YXhwYXBmd2N5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgzNzk2MiwiZXhwIjoyMDY3NDEzOTYyfQ.QSb6ZfVE4kgHScpfdvYco2mgsW_vU8fnT6eiOnD6NQ8',
    bucketName: 'interview-videos'
};

const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);


// ===========================================
// AI PUBLISHING MODULE - MOBILE-WISE AI FORMVISER
// YouTube + Google Business Profile Integration
// ===========================================

// Add to your AIPublishingModule
const AIPublishingModule = {

    
    // Module Configuration
    config: {
        publishingOptions: {
            youtube: {
                enabled: true,
                title: 'Upload to YouTube',
                description: 'Publish videos to your YouTube channel'
            },
            googleBusiness: {
                enabled: true,
                title: 'Post to Google Business',
                description: 'Share as testimonials on Google Business Profile'
            },
            transcription: {
                enabled: true,
                title: 'Generate Transcriptions',
                description: 'AI-powered speech-to-text for all videos'
            }
        }
    },

    // Publishing State
    publishingState: {
        videos: [],
        selectedOptions: new Set(),
        isPublishing: false,
        progress: 0,
        transcriptions: new Map()
    },

    // Initialize Publishing Module
    init: function() {
        console.log('🚀 Initializing AI Publishing Module...');
        this.loadStoredVideos();
        this.showPublishingInterface();
        console.log('✅ AI Publishing Module Ready!');
    },

    // Load Videos from Interview Module
    loadStoredVideos: function() {
        console.log('📹 Loading recorded videos...');
        
        // Get videos from AIHostedInterviewsModule if available
        if (window.AIHostedInterviewsModule && window.AIHostedInterviewsModule.audioState) {
            const interviewModule = window.AIHostedInterviewsModule;
            
            // Collect all recorded videos (this would need to be enhanced to store multiple videos)
            if (interviewModule.audioState.currentRecording) {
                this.publishingState.videos.push({
                    id: 1,
                    questionIndex: interviewModule.audioState.currentRecording.questionIndex,
                    blob: interviewModule.audioState.currentRecording.blob,
                    url: interviewModule.audioState.currentRecording.url,
                    timestamp: interviewModule.audioState.currentRecording.timestamp,
                    question: interviewModule.currentQuestions[interviewModule.audioState.currentRecording.questionIndex]
                });
            }
        }
        
        // Demo videos for testing (remove when real videos are available)
        if (this.publishingState.videos.length === 0) {
            this.publishingState.videos = [
                {
                   id: 1,
        questionIndex: 0,
        question: "Why did you choose NCI in the first place?",
        duration: "0:45",
        status: "ready"
    },
    {
        id: 2,
        questionIndex: 1,
        question: "Did NCI exceed your expectations and how so?",
        duration: "1:12",
        status: "ready"
    },
    {
        id: 3,
        questionIndex: 2,
        question: "Would you recommend NCI to other CPA's?",
        duration: "0:38",
        status: "ready"
    },
    {
        id: 4,
        questionIndex: 3,
        question: "How likely are you to use NCI services again?",
        duration: "0:52",
        status: "ready"
    }
];
                
        }
        
        console.log(`📺 Loaded ${this.publishingState.videos.length} videos for publishing`);
    },

    // Show Publishing Interface
    showPublishingInterface: function() {
        console.log('🎬 Displaying Publishing Interface...');
        
        const moduleContainer = document.querySelector('.ai-publishing-interface');
        if (!moduleContainer) return;

        const publishingHTML = this.generatePublishingHTML();
        
        moduleContainer.style.transition = 'opacity 0.3s ease';
        moduleContainer.style.opacity = '0';
        
        setTimeout(() => {
            moduleContainer.innerHTML = publishingHTML;
            this.bindPublishingListeners();
            moduleContainer.style.opacity = '1';
            
            console.log('✅ Publishing interface loaded!');
        }, 300);
    },

    // Generate Publishing Interface HTML
    generatePublishingHTML: function() {
        const videos = this.publishingState.videos;
        
        let publishingHTML = `
            <div class="interface-header">
                <h2>Publishing Hub</h2>
                <p>Upload & Share Your Interview Videos</p>
            </div>

            <div class="video-grid">
        `;

        // Video previews
        videos.forEach((video, index) => {
            publishingHTML += `
                <div class="video-preview-card" data-video-id="${video.id}">
                    <div class="video-thumbnail">
                        <div class="play-icon">▶</div>
                        <div class="video-duration">${video.duration || '0:30'}</div>
                    </div>
                    <div class="video-info">
                        <div class="question-preview">Q${index + 1}: ${video.question.substring(0, 30)}...</div>
                        <div class="video-status status-${video.status || 'ready'}">${video.status || 'Ready'}</div>
                    </div>
                </div>
            `;
        });

        publishingHTML += `
            </div>

            <div class="publishing-options">
    <h3>Publishing Options</h3>
    <div class="option-list">
        <label class="publish-option">
            <input type="checkbox" id="youtubeOption" checked>
            <div class="option-info">
                <div class="option-title">📺 Upload to YouTube</div>
                <div class="option-desc">Publish videos to your YouTube channel</div>
            </div>
        </label>

        <label class="publish-option">
            <input type="checkbox" id="googleBusinessOption" checked>
            <div class="option-info">
                <div class="option-title">🌟 Post to Google Business Profile</div>
                <div class="option-desc">Share as testimonials (auto-transcribed)</div>
            </div>
        </label>
    </div>
</div>

            <div class="publishing-controls">
                <button class="back-btn" id="backToInterviews">← Back</button>
                <button class="publish-btn" id="startPublishing">🚀 Publish All Videos</button>
            </div>

            <div class="progress-area" id="progressArea" style="display: none;">
                <div class="progress-header">Publishing Progress</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="progress-status" id="progressStatus">Preparing upload...</div>
            </div>
        `;

        return publishingHTML;
    },

    // Bind Publishing Event Listeners
    bindPublishingListeners: function() {
        // Back to interviews button
        const backBtn = document.getElementById('backToInterviews');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToInterviews());
        }

        // Publish button
        const publishBtn = document.getElementById('startPublishing');
        if (publishBtn) {
            publishBtn.addEventListener('click', () => this.startPublishing());
        }

        // Video preview cards
        const videoCards = document.querySelectorAll('.video-preview-card');
        videoCards.forEach(card => {
            card.addEventListener('click', (e) => this.previewVideo(e));
        });

        // Publishing options
        const checkboxes = document.querySelectorAll('.publish-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.updatePublishingOptions(e));
        });
    },

    // Update Publishing Options
    updatePublishingOptions: function(e) {
        const optionId = e.target.id;
        const isChecked = e.target.checked;
        
        if (isChecked) {
            this.publishingState.selectedOptions.add(optionId);
        } else {
            this.publishingState.selectedOptions.delete(optionId);
        }
        
        console.log('📋 Updated publishing options:', Array.from(this.publishingState.selectedOptions));
    },

    // Preview Video
    previewVideo: function(e) {
        const videoId = e.currentTarget.getAttribute('data-video-id');
        const video = this.publishingState.videos.find(v => v.id == videoId);
        
        console.log('🎬 Previewing video:', video.question);
        
        // Here you would show a video preview modal or expand the card
        // For now, just highlight the selected card
        document.querySelectorAll('.video-preview-card').forEach(card => {
            card.classList.remove('selected');
        });
        e.currentTarget.classList.add('selected');
    },

    // NEW: Upload video to Supabase
uploadVideoToSupabase: async function(videoBlob, questionIndex, questionText) {
    console.log(`📤 Uploading video ${questionIndex + 1} to Supabase...`);
    
    try {
        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `interview_q${questionIndex + 1}_${timestamp}.webm`;
        
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from(SUPABASE_CONFIG.bucketName)
            .upload(fileName, videoBlob, {
                contentType: 'video/webm',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(SUPABASE_CONFIG.bucketName)
            .getPublicUrl(fileName);

        console.log(`✅ Video uploaded: ${urlData.publicUrl}`);

        return {
            success: true,
            fileName: fileName,
            publicUrl: urlData.publicUrl,
            size: videoBlob.size
        };

    } catch (error) {
        console.error('❌ Supabase upload failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
},

// UPDATED: Modify your existing uploadToYouTube function
uploadToYouTube: async function() {
    console.log('📺 Starting YouTube upload process...');
    
    for (let i = 0; i < this.publishingState.videos.length; i++) {
        const video = this.publishingState.videos[i];
        
        this.updateProgress(30 + (i * 20), `📺 Processing video ${i + 1}...`);
        
        // First upload to Supabase for staging
        if (video.blob) {
            const supabaseResult = await this.uploadVideoToSupabase(
                video.blob, 
                video.questionIndex, 
                video.question
            );
            
            if (supabaseResult.success) {
                video.supabaseUrl = supabaseResult.publicUrl;
                console.log(`✅ Video ${i + 1} staged in Supabase: ${supabaseResult.publicUrl}`);
            } else {
                console.warn(`⚠️ Supabase upload failed for video ${i + 1}: ${supabaseResult.error}`);
                // Continue without Supabase (fallback)
            }
        }
        
        // Simulate YouTube upload (replace with real YouTube API later)
        await this.delay(1000);
        
        const youtubeUrl = `https://youtube.com/watch?v=mock_${video.id}_${Date.now()}`;
        video.youtubeUrl = youtubeUrl;
        
        console.log(`✅ Video ${i + 1} "uploaded" to YouTube: ${youtubeUrl}`);
    }
    
    this.updateProgress(70, '✅ All videos processed through Supabase and YouTube');
},

    // Start Publishing Process
    startPublishing: async function() {
        console.log('🚀 Starting publishing process...');
        
        if (this.publishingState.isPublishing) {
            console.log('⚠️ Publishing already in progress');
            return;
        }

        const selectedOptions = this.publishingState.selectedOptions;
        if (selectedOptions.size === 0) {
            alert('Please select at least one publishing option.');
            return;
        }

        this.publishingState.isPublishing = true;
        this.showProgressArea();

       try {
    // Auto-generate transcriptions for Google Business (always runs in background)
    await this.generateTranscriptions();

    // Step 1: Upload to YouTube (if selected)
    if (selectedOptions.has('youtubeOption')) {
        await this.uploadToYouTube();
    }

    // Step 2: Post to Google Business (if selected) - uses auto-transcriptions
    if (selectedOptions.has('googleBusinessOption')) {
        await this.postToGoogleBusiness();
    }

    // Complete
    this.updateProgress(100, '✅ Publishing complete! All videos published successfully.');
    
    setTimeout(() => {
        this.showPublishingResults();
    }, 2000);

        } catch (error) {
            console.error('❌ Publishing failed:', error);
            this.updateProgress(0, '❌ Publishing failed. Please try again.');
        } finally {
            this.publishingState.isPublishing = false;
        }
    },

    // Show Progress Area
    showProgressArea: function() {
        const progressArea = document.getElementById('progressArea');
        const publishBtn = document.getElementById('startPublishing');
        
        if (progressArea) {
            progressArea.style.display = 'block';
        }
        
        if (publishBtn) {
            publishBtn.disabled = true;
            publishBtn.textContent = 'Publishing...';
        }
    },

    // Update Progress
    updateProgress: function(percentage, status) {
        const progressFill = document.getElementById('progressFill');
        const progressStatus = document.getElementById('progressStatus');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressStatus) {
            progressStatus.textContent = status;
        }
        
        this.publishingState.progress = percentage;
        console.log(`📊 Progress: ${percentage}% - ${status}`);
    },

    // Generate Transcriptions
    generateTranscriptions: async function() {
        console.log('📝 Generating transcriptions...');
        this.updateProgress(10, '📝 Generating AI transcriptions...');
        
        for (let i = 0; i < this.publishingState.videos.length; i++) {
            const video = this.publishingState.videos[i];
            
            this.updateProgress(10 + (i * 20), `📝 Transcribing video ${i + 1}...`);
            
            // Simulate transcription process (replace with real API call)
            await this.delay(1500);
            
            const mockTranscription = this.generateMockTranscription(video.question);
            this.publishingState.transcriptions.set(video.id, mockTranscription);
            
            console.log(`✅ Transcription complete for video ${i + 1}`);
        }
        
        this.updateProgress(30, '✅ All transcriptions generated');
    },

    // Generate Mock Transcription (replace with real transcription API)
    generateMockTranscription: function(question) {
        const mockResponses = [
            "I chose NCI because of their excellent reputation in the accounting industry and their comprehensive service offerings that perfectly matched my practice needs.",
            "NCI absolutely exceeded my expectations. Their support team was incredibly responsive and their technology solutions streamlined my entire workflow.",
            "I would definitely recommend NCI to other CPAs. The value they provide and the professional growth opportunities are unmatched in the industry."
        ];
        
        return mockResponses[Math.floor(Math.random() * mockResponses.length)];
    },

    // Upload to YouTube
    uploadToYouTube: async function() {
        console.log('📺 Uploading to YouTube...');
        
        for (let i = 0; i < this.publishingState.videos.length; i++) {
            const video = this.publishingState.videos[i];
            
            this.updateProgress(30 + (i * 25), `📺 Uploading video ${i + 1} to YouTube...`);
            
            // Simulate YouTube upload (replace with real YouTube API)
            await this.delay(2000);
            
            const youtubeUrl = `https://youtube.com/watch?v=mock_${video.id}_${Date.now()}`;
            video.youtubeUrl = youtubeUrl;
            
            console.log(`✅ Video ${i + 1} uploaded to YouTube: ${youtubeUrl}`);
        }
        
        this.updateProgress(55, '✅ All videos uploaded to YouTube');
    },

     // NEW: Upload video to Supabase
    uploadVideoToSupabase: async function(videoBlob, questionIndex, questionText) {
        console.log(`📤 Uploading video ${questionIndex + 1} to Supabase...`);
        
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const fileName = `interview_q${questionIndex + 1}_${timestamp}.webm`;
            
            // Upload to Supabase storage
            const { data, error } = await supabase.storage
                .from(SUPABASE_CONFIG.bucketName)
                .upload(fileName, videoBlob, {
                    contentType: 'video/webm',
                    upsert: false
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(SUPABASE_CONFIG.bucketName)
                .getPublicUrl(fileName);

            console.log(`✅ Video uploaded: ${urlData.publicUrl}`);

            // Store metadata in database (optional)
            await this.storeVideoMetadata({
                fileName: fileName,
                publicUrl: urlData.publicUrl,
                questionIndex: questionIndex,
                questionText: questionText,
                uploadedAt: new Date().toISOString(),
                fileSize: videoBlob.size
            });

            return {
                success: true,
                fileName: fileName,
                publicUrl: urlData.publicUrl,
                size: videoBlob.size
            };

        } catch (error) {
            console.error('❌ Supabase upload failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // NEW: Store video metadata
    storeVideoMetadata: async function(metadata) {
        try {
            const { data, error } = await supabase
                .from('interview_videos')
                .insert([metadata]);

            if (error) {
                console.warn('⚠️ Metadata storage failed:', error);
                // Don't fail the whole process for metadata issues
            } else {
                console.log('📝 Video metadata stored');
            }
        } catch (error) {
            console.warn('⚠️ Metadata storage error:', error);
        }
    },

    // UPDATED: Integration with existing upload flow
    uploadToYouTube: async function() {
        console.log('📺 Starting YouTube upload process...');
        
        for (let i = 0; i < this.publishingState.videos.length; i++) {
            const video = this.publishingState.videos[i];
            
            this.updateProgress(30 + (i * 25), `📺 Processing video ${i + 1}...`);
            
            // First upload to Supabase for processing
            if (video.blob) {
                const supabaseResult = await this.uploadVideoToSupabase(
                    video.blob, 
                    video.questionIndex, 
                    video.question
                );
                
                if (supabaseResult.success) {
                    video.supabaseUrl = supabaseResult.publicUrl;
                    console.log(`✅ Video ${i + 1} staged in Supabase`);
                } else {
                    throw new Error(`Supabase upload failed: ${supabaseResult.error}`);
                }
            }
            
            // Simulate YouTube upload (replace with real YouTube API later)
            await this.delay(1500);
            
            const youtubeUrl = `https://youtube.com/watch?v=mock_${video.id}_${Date.now()}`;
            video.youtubeUrl = youtubeUrl;
            
            console.log(`✅ Video ${i + 1} uploaded to YouTube: ${youtubeUrl}`);
        }
        
        this.updateProgress(55, '✅ All videos uploaded to YouTube');
    },

    // Post to Google Business Profile
    postToGoogleBusiness: async function() {
        console.log('🌟 Posting to Google Business Profile...');
        
        for (let i = 0; i < this.publishingState.videos.length; i++) {
            const video = this.publishingState.videos[i];
            const transcription = this.publishingState.transcriptions.get(video.id);
            
            this.updateProgress(55 + (i * 25), `🌟 Posting video ${i + 1} to Google Business...`);
            
            // Simulate Google Business API call
            await this.delay(1500);
            
            const businessPost = {
                text: transcription || `Customer testimonial: ${video.question}`,
                media: video.youtubeUrl ? [{ videoUrl: video.youtubeUrl }] : [],
                callToAction: 'Learn More'
            };
            
            // Here you would make the actual API call to Google Business Profile
            console.log('📤 Google Business Post:', businessPost);
            
            video.googleBusinessPosted = true;
        }
        
        this.updateProgress(80, '✅ All posts shared on Google Business Profile');
    },

    // Show Publishing Results
    showPublishingResults: function() {
        let resultsHTML = `
            <div class="interface-header">
                <h2>✅ Publishing Complete!</h2>
                <p>All videos have been successfully published</p>
            </div>

            <div class="results-summary">
                <div class="result-stat">
                    <div class="stat-number">${this.publishingState.videos.length}</div>
                    <div class="stat-label">Videos Published</div>
                </div>
                
                <div class="result-stat">
                    <div class="stat-number">${this.publishingState.transcriptions.size}</div>
                    <div class="stat-label">Transcriptions</div>
                </div>
                
                <div class="result-stat">
                    <div class="stat-number">${this.publishingState.selectedOptions.size}</div>
                    <div class="stat-label">Platforms</div>
                </div>
            </div>

            <div class="published-links">
                <h3>📺 YouTube Videos</h3>
                <div class="link-list">
        `;

        this.publishingState.videos.forEach((video, index) => {
            if (video.youtubeUrl) {
                resultsHTML += `
                    <div class="published-link">
                        <span>Q${index + 1}: ${video.question.substring(0, 25)}...</span>
                        <a href="${video.youtubeUrl}" target="_blank">View</a>
                    </div>
                `;
            }
        });

        resultsHTML += `
                </div>
            </div>

            <div class="final-actions">
                <button class="back-btn" id="backToInterviews">← New Session</button>
                <button class="share-btn" id="shareResults">📤 Share Results</button>
            </div>
        `;

        const moduleContainer = document.querySelector('.ai-publishing-interface');
        if (moduleContainer) {
            moduleContainer.innerHTML = resultsHTML;
            
            // Bind final action listeners
            document.getElementById('backToInterviews').addEventListener('click', () => this.backToInterviews());
            document.getElementById('shareResults').addEventListener('click', () => this.shareResults());
        }
    },

    // Share Results
    shareResults: function() {
        console.log('📤 Sharing publishing results...');
        
        let shareText = `🎯 Mobile-Wise AI Formviser Results:\n\n`;
        shareText += `✅ Published ${this.publishingState.videos.length} videos\n`;
        shareText += `📝 Generated ${this.publishingState.transcriptions.size} transcriptions\n`;
        shareText += `🚀 Shared across ${this.publishingState.selectedOptions.size} platforms\n\n`;
        
        this.publishingState.videos.forEach((video, index) => {
            if (video.youtubeUrl) {
                shareText += `Q${index + 1}: ${video.youtubeUrl}\n`;
            }
        });

        // Copy to clipboard or show share options
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('📋 Results copied to clipboard!');
            });
        } else {
            alert(`📤 Share these results:\n\n${shareText}`);
        }
    },

    // Back to Interviews
    backToInterviews: function() {
        console.log('🔙 Returning to interview selection...');
        
        // Reset publishing state
        this.publishingState.isPublishing = false;
        this.publishingState.progress = 0;
        this.publishingState.selectedOptions.clear();
        
        // Reload the page or reinitialize the interview module
        window.location.href = 'ai-hosted-interviews.html';
    },

    // Utility function for delays
    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AIPublishingModule.init();
});

// Make module globally available
window.AIPublishingModule = AIPublishingModule;
