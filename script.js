// App State
let currentState = {
    mode: null, // 'chapter', 'mini', 'full'
    chapterName: null,
    testNumber: null,
    questions: [],
    currentQuestion: 0,
    answers: {},
    startTime: null,
    timeLeft: 0,
    timer: null,
    isPaused: false,
    progress: {
        testsTaken: 0,
        bestScore: 0,
        averageScore: 0,
        weakChapters: []
    }
};

// Initialize App
function initApp() {
    loadProgress();
    updateCountdown();
    showRandomSlogan();
    loadChapters();
    showHome();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
}

// Toggle section visibility
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = event.currentTarget;
    const icon = button.querySelector('i');
    
    if (section.classList.contains('show')) {
        section.classList.remove('show');
        icon.className = 'fas fa-chevron-down';
    } else {
        section.classList.add('show');
        icon.className = 'fas fa-chevron-up';
    }
}

// Load chapters to home page
function loadChapters() {
    loadPeeyushamChapters();
    loadGrammarTopics();
}

// Load Peeyusham chapters
function loadPeeyushamChapters() {
    const container = document.getElementById('peeyushamChapters');
    if (!container) return;
    
    let html = '<div class="chapter-cards">';
    
    for (const [chapterName, chapterData] of Object.entries(appData.peeyushamChapters)) {
        const totalQuestions = chapterData.questions.length;
        const testCount = Math.ceil(totalQuestions / 15);
        
        html += `
            <div class="chapter-card glass">
                <div class="chapter-name">${chapterName}</div>
                <div class="chapter-desc">${chapterData.description}</div>
                <div class="chapter-stats">
                    <span><i class="far fa-question-circle"></i> ${totalQuestions} प्रश्न</span>
                    <span><i class="fas fa-layer-group"></i> ${testCount} टेस्ट</span>
                </div>
                <div class="test-sections">
        `;
        
        // Create test sections
        for (let i = 0; i < testCount; i++) {
            const start = i * 15;
            const end = Math.min(start + 15, totalQuestions);
            const testQuestions = chapterData.questions.slice(start, end);
            
            html += `
                <div class="test-section">
                    <div class="test-header">
                        <h4>टेस्ट ${i + 1}</h4>
                        <div class="test-stats">
                            <span><i class="far fa-question-circle"></i> ${testQuestions.length} प्रश्न</span>
                            <span><i class="far fa-clock"></i> 15 मिनट</span>
                        </div>
                    </div>
                    <button class="btn btn-accent start-test-btn" onclick="startChapterTest('${chapterName}', ${i})">
                        <i class="fas fa-play"></i> टेस्ट शुरू करें
                    </button>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Load grammar topics
function loadGrammarTopics() {
    const container = document.getElementById('grammarChapters');
    if (!container) return;
    
    let html = '<div class="chapter-cards">';
    
    for (const [topicName, topicData] of Object.entries(appData.grammarTopics)) {
        const totalQuestions = topicData.questions.length;
        const testCount = Math.ceil(totalQuestions / 15);
        
        html += `
            <div class="chapter-card glass">
                <div class="chapter-name">${topicName}</div>
                <div class="chapter-desc">${topicData.description}</div>
                <div class="chapter-stats">
                    <span><i class="far fa-question-circle"></i> ${totalQuestions} प्रश्न</span>
                    <span><i class="fas fa-layer-group"></i> ${testCount} टेस्ट</span>
                </div>
                <div class="test-sections">
        `;
        
        // Create test sections
        for (let i = 0; i < testCount; i++) {
            const start = i * 15;
            const end = Math.min(start + 15, totalQuestions);
            const testQuestions = topicData.questions.slice(start, end);
            
            html += `
                <div class="test-section">
                    <div class="test-header">
                        <h4>टेस्ट ${i + 1}</h4>
                        <div class="test-stats">
                            <span><i class="far fa-question-circle"></i> ${testQuestions.length} प्रश्न</span>
                            <span><i class="far fa-clock"></i> 15 मिनट</span>
                        </div>
                    </div>
                    <button class="btn btn-accent start-test-btn" onclick="startGrammarTest('${topicName}', ${i})">
                        <i class="fas fa-play"></i> टेस्ट शुरू करें
                    </button>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Start chapter test
function startChapterTest(chapterName, testIndex) {
    const chapterData = appData.peeyushamChapters[chapterName];
    if (!chapterData) return;
    
    const start = testIndex * 15;
    const end = Math.min(start + 15, chapterData.questions.length);
    const testQuestions = chapterData.questions.slice(start, end);
    
    // Add chapter info to each question for tracking
    const questionsWithChapter = testQuestions.map(q => ({
        ...q,
        chapterName: chapterName,
        chapterType: 'peeyusham'
    }));
    
    currentState.mode = 'chapter';
    currentState.chapterName = chapterName;
    currentState.testNumber = testIndex + 1;
    currentState.questions = questionsWithChapter;
    
    startTest('अध्यायवार टेस्ट', chapterName, testIndex + 1, 15);
}

// Start grammar test
function startGrammarTest(topicName, testIndex) {
    const topicData = appData.grammarTopics[topicName];
    if (!topicData) return;
    
    const start = testIndex * 15;
    const end = Math.min(start + 15, topicData.questions.length);
    const testQuestions = topicData.questions.slice(start, end);
    
    // Add chapter info to each question for tracking
    const questionsWithChapter = testQuestions.map(q => ({
        ...q,
        chapterName: topicName,
        chapterType: 'grammar'
    }));
    
    currentState.mode = 'grammar';
    currentState.chapterName = topicName;
    currentState.testNumber = testIndex + 1;
    currentState.questions = questionsWithChapter;
    
    startTest('व्याकरण टेस्ट', topicName, testIndex + 1, 15);
}

// Start mini mock test
function startMiniMock() {
    // Collect all questions with chapter info
    let allQuestions = [];
    
    // Add peeyusham questions with chapter info
    for (const [chapterName, chapterData] of Object.entries(appData.peeyushamChapters)) {
        const questionsWithChapter = chapterData.questions.map(q => ({
            ...q,
            chapterName: chapterName,
            chapterType: 'peeyusham'
        }));
        allQuestions = allQuestions.concat(questionsWithChapter);
    }
    
    // Add grammar questions with topic info
    for (const [topicName, topicData] of Object.entries(appData.grammarTopics)) {
        const questionsWithTopic = topicData.questions.map(q => ({
            ...q,
            chapterName: topicName,
            chapterType: 'grammar'
        }));
        allQuestions = allQuestions.concat(questionsWithTopic);
    }
    
    // Shuffle and take 15 questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    currentState.questions = shuffled.slice(0, 15);
    currentState.mode = 'mini';
    
    startTest('मिनी मॉक टेस्ट', null, null, 10);
}

// Start full mock test
function startFullMock() {
    // Collect all questions with chapter info
    let allQuestions = [];
    
    // Add peeyusham questions with chapter info
    for (const [chapterName, chapterData] of Object.entries(appData.peeyushamChapters)) {
        const questionsWithChapter = chapterData.questions.map(q => ({
            ...q,
            chapterName: chapterName,
            chapterType: 'peeyusham'
        }));
        allQuestions = allQuestions.concat(questionsWithChapter);
    }
    
    // Add grammar questions with topic info
    for (const [topicName, topicData] of Object.entries(appData.grammarTopics)) {
        const questionsWithTopic = topicData.questions.map(q => ({
            ...q,
            chapterName: topicName,
            chapterType: 'grammar'
        }));
        allQuestions = allQuestions.concat(questionsWithTopic);
    }
    
    // Shuffle and take 50 questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    currentState.questions = shuffled.slice(0, 50);
    currentState.mode = 'full';
    
    startTest('फुल मॉक टेस्ट', null, null, 60);
}

// Start test
function startTest(testName, chapterName, testNumber, minutes) {
    // Reset state
    currentState.currentQuestion = 0;
    currentState.answers = {};
    currentState.startTime = new Date();
    currentState.timeLeft = minutes * 60;
    currentState.isPaused = false;
    
    // Update UI
    document.getElementById('currentModeTitle').textContent = testName;
    document.getElementById('progressText').textContent = `प्रश्न 1/${currentState.questions.length}`;
    
    if (chapterName && testNumber) {
        document.getElementById('currentChapter').textContent = `${chapterName} - टेस्ट ${testNumber}`;
        document.getElementById('currentChapter').style.display = 'block';
    } else {
        document.getElementById('currentChapter').style.display = 'none';
    }
    
    // Update timer display
    updateTimerDisplay();
    
    // Show test screen
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('resultContainer').style.display = 'none';
    
    // Load first question
    loadQuestion();
    createNavigation();
    
    // Start timer
    startTimer();
}

// Load current question
function loadQuestion() {
    const question = currentState.questions[currentState.currentQuestion];
    if (!question) return;
    
    document.getElementById('questionText').textContent = question.question;
    
    // Set question type
    const questionType = question.chapterType === 'grammar' ? 'व्याकरण' : 'पाठ्यपुस्तक';
    document.getElementById('questionType').textContent = questionType;
    
    // Set chapter name
    document.getElementById('questionChapter').textContent = question.chapterName;
    
    // Update progress
    document.getElementById('progressText').textContent = 
        `प्रश्न ${currentState.currentQuestion + 1}/${currentState.questions.length}`;
    
    // Load options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    const labels = ['क', 'ख', 'ग', 'घ'];
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (currentState.answers[currentState.currentQuestion] === index) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <div class="option-label">${labels[index]}</div>
            <div class="option-text">${option}</div>
        `;
        
        optionDiv.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation highlight
    updateNavigation();
}

// Select option
function selectOption(optionIndex) {
    currentState.answers[currentState.currentQuestion] = optionIndex;
    loadQuestion(); // Reload to show selection
    
    // Auto move to next question after 0.5 seconds
    setTimeout(() => {
        if (currentState.currentQuestion < currentState.questions.length - 1) {
            nextQuestion();
        }
    }, 500);
}

// Clear answer
function clearAnswer() {
    delete currentState.answers[currentState.currentQuestion];
    loadQuestion();
}

// Previous question
function prevQuestion() {
    if (currentState.currentQuestion > 0) {
        currentState.currentQuestion--;
        loadQuestion();
    }
}

// Next question
function nextQuestion() {
    if (currentState.currentQuestion < currentState.questions.length - 1) {
        currentState.currentQuestion++;
        loadQuestion();
    }
}

// Create question navigation
function createNavigation() {
    const container = document.getElementById('questionNavigation');
    container.innerHTML = '';
    
    currentState.questions.forEach((_, index) => {
        const btn = document.createElement('div');
        btn.className = 'question-nav-btn';
        btn.textContent = index + 1;
        btn.onclick = () => {
            currentState.currentQuestion = index;
            loadQuestion();
        };
        container.appendChild(btn);
    });
    
    updateNavigation();
}

// Update navigation highlights
function updateNavigation() {
    const buttons = document.querySelectorAll('.question-nav-btn');
    buttons.forEach((btn, index) => {
        btn.classList.remove('current', 'attempted');
        
        if (index === currentState.currentQuestion) {
            btn.classList.add('current');
        }
        
        if (currentState.answers[index] !== undefined) {
            btn.classList.add('attempted');
        } else {
            btn.classList.add('unattempted');
        }
    });
}

// Start timer
function startTimer() {
    if (currentState.timer) {
        clearInterval(currentState.timer);
    }
    
    currentState.timer = setInterval(() => {
        if (!currentState.isPaused) {
            currentState.timeLeft--;
            updateTimerDisplay();
            
            if (currentState.timeLeft <= 0) {
                clearInterval(currentState.timer);
                submitTest();
            }
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(currentState.timeLeft / 60);
    const seconds = currentState.timeLeft % 60;
    const timerEl = document.getElementById('timer');
    
    timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color when time is low
    if (currentState.timeLeft < 60) {
        timerEl.style.color = 'var(--danger-color)';
    } else if (currentState.timeLeft < 300) {
        timerEl.style.color = 'var(--warning-color)';
    } else {
        timerEl.style.color = 'var(--secondary-color)';
    }
    
    // Pause effect
    if (currentState.isPaused) {
        timerEl.classList.add('paused');
    } else {
        timerEl.classList.remove('paused');
    }
}

// Toggle pause
function togglePause() {
    currentState.isPaused = !currentState.isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (currentState.isPaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> जारी रखें';
        pauseBtn.classList.remove('btn-warning');
        pauseBtn.classList.add('btn-accent');
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> रोकें';
        pauseBtn.classList.remove('btn-accent');
        pauseBtn.classList.add('btn-warning');
    }
}

// Submit test - UPDATED FOR CHAPTER-WISE PERFORMANCE
function submitTest() {
    if (currentState.timer) {
        clearInterval(currentState.timer);
    }
    
    // Calculate results and chapter-wise performance
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    
    // Object to store chapter-wise performance
    const chapterPerformance = {};
    
    currentState.questions.forEach((question, index) => {
        const userAnswer = currentState.answers[index];
        const chapterName = question.chapterName;
        
        // Initialize chapter performance if not exists
        if (!chapterPerformance[chapterName]) {
            chapterPerformance[chapterName] = {
                total: 0,
                correct: 0,
                wrong: 0,
                skipped: 0
            };
        }
        
        // Update chapter performance
        chapterPerformance[chapterName].total++;
        
        if (userAnswer === undefined) {
            skipped++;
            chapterPerformance[chapterName].skipped++;
        } else if (userAnswer === question.answer) {
            correct++;
            chapterPerformance[chapterName].correct++;
        } else {
            wrong++;
            chapterPerformance[chapterName].wrong++;
        }
    });
    
    // Calculate time taken
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - currentState.startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    // Update result display
    document.getElementById('finalScore').textContent = `${correct}/${currentState.questions.length}`;
    document.getElementById('correctAnswers').textContent = correct;
    document.getElementById('wrongAnswers').textContent = wrong;
    document.getElementById('skippedAnswers').textContent = skipped;
    document.getElementById('timeTaken').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Display chapter-wise performance
    displayChapterPerformance(chapterPerformance);
    
    // Update progress
    updateProgress(correct, currentState.questions.length, chapterPerformance);
    
    // Show result screen
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
}

// Display chapter-wise performance
function displayChapterPerformance(chapterPerformance) {
    const chapterAnalysis = document.getElementById('chapterAnalysis');
    chapterAnalysis.innerHTML = '';
    
    // Sort chapters by accuracy (highest first)
    const sortedChapters = Object.entries(chapterPerformance).sort((a, b) => {
        const accuracyA = a[1].correct / a[1].total;
        const accuracyB = b[1].correct / b[1].total;
        return accuracyB - accuracyA;
    });
    
    if (sortedChapters.length === 0) {
        chapterAnalysis.innerHTML = '<div class="text-center">कोई अध्यायवार डेटा उपलब्ध नहीं है</div>';
        return;
    }
    
    sortedChapters.forEach(([chapterName, performance]) => {
        const accuracy = performance.total > 0 ? (performance.correct / performance.total) * 100 : 0;
        const isWeak = accuracy < 60;
        
        const chapterItem = document.createElement('div');
        chapterItem.className = `chapter-item ${isWeak ? 'weak-chapter' : ''}`;
        chapterItem.innerHTML = `
            <div>
                <strong>${chapterName}</strong>
                <div style="font-size: 0.8rem; color: #666;">
                    सही: ${performance.correct} | गलत: ${performance.wrong} | छोड़े: ${performance.skipped}
                </div>
            </div>
            <div>
                <strong>${Math.round(accuracy)}%</strong>
                <div style="font-size: 0.8rem; color: #666;">
                    ${performance.correct}/${performance.total}
                </div>
            </div>
        `;
        
        chapterAnalysis.appendChild(chapterItem);
    });
}

// Update progress with chapter performance
function updateProgress(correct, total, chapterPerformance) {
    const score = (correct / total) * 100;
    
    // Update basic progress stats
    currentState.progress.testsTaken++;
    currentState.progress.averageScore = 
        ((currentState.progress.averageScore * (currentState.progress.testsTaken - 1)) + score) / currentState.progress.testsTaken;
    
    if (score > currentState.progress.bestScore) {
        currentState.progress.bestScore = score;
    }
    
    // Update weak chapters
    for (const [chapterName, performance] of Object.entries(chapterPerformance)) {
        const accuracy = (performance.correct / performance.total) * 100;
        
        if (accuracy < 60) {
            // Check if chapter is already in weak chapters
            if (!currentState.progress.weakChapters.includes(chapterName)) {
                currentState.progress.weakChapters.push(chapterName);
            }
        } else {
            // Remove from weak chapters if accuracy improved
            const index = currentState.progress.weakChapters.indexOf(chapterName);
            if (index > -1) {
                currentState.progress.weakChapters.splice(index, 1);
            }
        }
    }
    
    saveProgress();
}

// Retake test
function retakeTest() {
    if (currentState.mode === 'chapter') {
        startChapterTest(currentState.chapterName, currentState.testNumber - 1);
    } else if (currentState.mode === 'grammar') {
        startGrammarTest(currentState.chapterName, currentState.testNumber - 1);
    } else if (currentState.mode === 'mini') {
        startMiniMock();
    } else if (currentState.mode === 'full') {
        startFullMock();
    }
}

// Go to home
function goToHome() {
    showHome();
}

// Show home screen
function showHome() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'none';
    showRandomSlogan();
}

// Update countdown
function updateCountdown() {
    const examDate = new Date('2026-02-17');
    const now = new Date();
    const diff = examDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
    }
}

// Show random slogan
function showRandomSlogan() {
    const randomIndex = Math.floor(Math.random() * appData.slogans.length);
    document.getElementById('randomSlogan').textContent = appData.slogans[randomIndex];
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('sanskritProgress', JSON.stringify(currentState.progress));
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('sanskritProgress');
    if (saved) {
        currentState.progress = JSON.parse(saved);
    }
}

// Initialize app when page loads
window.onload = initApp;
