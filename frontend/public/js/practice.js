let currentWord = null;
        let userInput = [];
        let stats = { count: 0, correct: 0 };
        let learnedWords = new Set(); // 已掌握的单词
        let wrongWords = new Set(); // 错词本
        let currentTab = 'learned'; // 当前选中的tab
        let selectedLevels = ['starters', 'movers', 'flyers']; // 选中的级别
        let practiceMode = 'normal'; // 练习模式：normal 或 wrong
        let isAnswerSubmitted = false; // 是否已提交答案
        
        // 按级别顺序出题的相关变量
        let currentLevelIndex = 0;
        let levelWordPools = {};
        let wrongWordPool = []; // 错词复习模式的单词池
        
        // 初始化级别单词池
        function initLevelPools() {
            levelWordPools = {
                'starters': [],
                'movers': [],
                'flyers': []
            };
            
            wordBank.forEach(word => {
                const level = word.level || 'flyers';
                if (levelWordPools[level]) {
                    levelWordPools[level].push(word);
                }
            });
            
            for (let level in levelWordPools) {
                levelWordPools[level] = shuffleArray(levelWordPools[level]);
            }
            
            currentLevelIndex = 0;
        }
        
        // 初始化错词单词池
        function initWrongWordPool() {
            wrongWordPool = wordBank.filter(word => 
                wrongWords.has(word.english.toLowerCase())
            );
            wrongWordPool = shuffleArray(wrongWordPool);
        }
        
        // 打乱数组顺序
        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }
        
        // 初始化
        function init() {
            createKeyboard();
            loadStats();
            initLevelPools();
            initWrongWordPool();
            updateModeIndicator();
            newWord();
        }
        
        // 创建键盘
        function createKeyboard() {
            const keyboard = document.getElementById('keyboard');
            const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
            
            letters.forEach(letter => {
                const key = document.createElement('button');
                key.className = 'key';
                key.textContent = letter;
                key.onclick = () => addLetter(letter);
                keyboard.appendChild(key);
            });
        }
        
        // 加载统计
        function loadStats() {
            const saved = localStorage.getItem('spellingStats');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    stats = {
                        count: parsed.count || 0,
                        correct: parsed.correct || 0
                    };
                } catch (e) {
                    stats = { count: 0, correct: 0 };
                }
            }
            updateStats();
            
            const savedLearned = localStorage.getItem('learnedWords');
            if (savedLearned) {
                try {
                    learnedWords = new Set(JSON.parse(savedLearned));
                } catch (e) {
                    learnedWords = new Set();
                }
            }
            
            const savedWrong = localStorage.getItem('wrongWords');
            if (savedWrong) {
                try {
                    wrongWords = new Set(JSON.parse(savedWrong));
                } catch (e) {
                    wrongWords = new Set();
                }
            }
        }
        
        // 保存统计
        function saveStats() {
            localStorage.setItem('spellingStats', JSON.stringify(stats));
            localStorage.setItem('learnedWords', JSON.stringify([...learnedWords]));
            localStorage.setItem('wrongWords', JSON.stringify([...wrongWords]));
        }
        
        // 更新统计显示
        function updateStats() {
            document.getElementById('count').textContent = stats.count;
            const acc = stats.count > 0 ? Math.round((stats.correct / stats.count) * 100) : 0;
            document.getElementById('accuracy').textContent = acc + '%';
        }
        
        // 更新模式指示器
        function updateModeIndicator() {
            const title = document.querySelector('h1');
            if (practiceMode === 'wrong') {
                title.textContent = '错词复习模式';
                title.style.color = '#f44336';
            } else {
                title.textContent = '剑桥少儿英语拼写乐园';
                title.style.color = '#333';
            }
        }
        
        // 新单词
        function newWord() {
            isAnswerSubmitted = false; // 重置提交状态
            
            if (practiceMode === 'wrong') {
                if (wrongWordPool.length === 0) {
                    initWrongWordPool();
                }
                
                if (wrongWordPool.length === 0) {
                    alert('错词本空了！所有错词都已掌握！');
                    practiceMode = 'normal';
                    document.getElementById('mode-normal').checked = true;
                    updateModeIndicator();
                    initLevelPools();
                    newWord();
                    return;
                }
                
                currentWord = wrongWordPool.pop();
            } else {
                if (!levelWordPools.starters || levelWordPools.starters.length === 0) {
                    initLevelPools();
                }
                
                const activeLevels = selectedLevels.filter(level => 
                    levelWordPools[level] && levelWordPools[level].length > 0
                );
                
                if (activeLevels.length === 0) {
                    alert('请至少选择一个级别！');
                    return;
                }
                
                let targetLevel = null;
                const levelPriority = ['starters', 'movers', 'flyers'];
                
                for (let level of levelPriority) {
                    if (activeLevels.includes(level)) {
                        if (levelWordPools[level] && levelWordPools[level].length > 0) {
                            targetLevel = level;
                            break;
                        }
                    }
                }
                
                if (!targetLevel) {
                    alert('所有单词都练习完了！');
                    return;
                }
                
                currentWord = levelWordPools[targetLevel].pop();
            }
            
            userInput = [];
            document.getElementById('chinese-word').textContent = currentWord.chinese;
            hideResult();
            createLetterBoxes();
        }
        
        // 显示设置弹窗
        function showSettings() {
            document.getElementById('settings-modal').classList.add('show');
        }
        
        // 隐藏设置弹窗
        function hideSettings() {
            document.getElementById('settings-modal').classList.remove('show');
        }
        
        // 更新练习模式
        function updatePracticeMode() {
            const normal = document.getElementById('mode-normal').checked;
            practiceMode = normal ? 'normal' : 'wrong';
            
            updateModeIndicator();
            
            if (practiceMode === 'wrong') {
                initWrongWordPool();
            } else {
                initLevelPools();
            }
            
            newWord();
        }
        
        // 更新级别选择
        function updateLevelSelection() {
            const starters = document.getElementById('check-starters').checked;
            const movers = document.getElementById('check-movers').checked;
            const flyers = document.getElementById('check-flyers').checked;
            
            selectedLevels = [];
            if (starters) selectedLevels.push('starters');
            if (movers) selectedLevels.push('movers');
            if (flyers) selectedLevels.push('flyers');
            
            if (selectedLevels.length === 0) {
                alert('请至少选择一个级别！');
                event.target.checked = true;
                selectedLevels = [event.target.id.replace('check-', '')];
            }
            
            initLevelPools();
            newWord();
        }
        
        // 创建字母框
        function createLetterBoxes() {
            const area = document.getElementById('spelling-area');
            area.innerHTML = '';
            
            for (let i = 0; i < currentWord.english.length; i++) {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
                container.style.margin = '5px';
                
                const box = document.createElement('div');
                box.className = 'letter-box';
                box.id = 'letter-' + i;
                container.appendChild(box);
                
                const correctLetterDiv = document.createElement('div');
                correctLetterDiv.className = 'correct-letter-below';
                correctLetterDiv.id = 'correct-letter-' + i;
                container.appendChild(correctLetterDiv);
                
                area.appendChild(container);
            }
        }
        
        // 添加字母
        function addLetter(letter) {
            if (userInput.length < currentWord.english.length) {
                const lowerLetter = letter.toLowerCase();
                userInput.push(lowerLetter);
                const box = document.getElementById('letter-' + (userInput.length - 1));
                box.textContent = lowerLetter;
            }
        }
        
        // 删除字母
        function deleteLetter() {
            if (userInput.length > 0) {
                const box = document.getElementById('letter-' + (userInput.length - 1));
                box.textContent = '';
                box.className = 'letter-box';
                document.getElementById('correct-letter-' + (userInput.length - 1)).style.display = 'none';
                userInput.pop();
            }
        }
        
        // 提交答案
        function submitAnswer() {
            if (userInput.length !== currentWord.english.length) {
                // 不显示提示，直接忽略
                return;
            }
            
            const userAnswer = userInput.join('').toLowerCase();
            const correctAnswer = currentWord.english.toLowerCase();
            
            stats.count++;
            isAnswerSubmitted = true;
            
            const resultArea = document.getElementById('result-area');
            const resultWord = document.getElementById('correct-word');
            
            resultWord.textContent = correctAnswer + ' - ' + currentWord.chinese;
            
            if (userAnswer === correctAnswer) {
                stats.correct++;
                resultArea.className = 'result-area success';
                highlightLetters(true);
                learnedWords.add(correctAnswer);
                wrongWords.delete(correctAnswer);
            } else {
                resultArea.className = 'result-area error';
                highlightLetters(false);
                wrongWords.add(correctAnswer);
                learnedWords.delete(correctAnswer);
            }
            
            resultArea.style.display = 'flex';
            updateStats();
            saveStats();
        }
        
        // 高亮字母
        function highlightLetters(correct) {
            for (let i = 0; i < userInput.length; i++) {
                const box = document.getElementById('letter-' + i);
                const correctLetterDiv = document.getElementById('correct-letter-' + i);
                const userLetter = userInput[i].toLowerCase();
                const correctLetter = currentWord.english[i].toLowerCase();
                
                if (userLetter === correctLetter) {
                    box.className = 'letter-box correct';
                    box.textContent = userLetter;
                    correctLetterDiv.style.display = 'none';
                } else {
                    box.className = 'letter-box incorrect';
                    box.textContent = userLetter;
                    correctLetterDiv.textContent = correctLetter;
                    correctLetterDiv.style.display = 'block';
                }
            }
        }
        
        // 隐藏结果区域
        function hideResult() {
            document.getElementById('result-area').style.display = 'none';
        }
        
        // 跳转到下一个单词
        function goToNextWord() {
            hideResult();
            newWord();
        }
        
        // 显示学习记录弹窗
        function showRecord() {
            document.getElementById('record-modal').classList.add('show');
            renderWordList();
        }
        
        // 隐藏学习记录弹窗
        function hideRecord() {
            document.getElementById('record-modal').classList.remove('show');
        }
        
        // 切换tab
        function switchTab(tab) {
            currentTab = tab;
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            renderWordList();
        }
        
        // 渲染单词列表
        function renderWordList() {
            const wordList = document.getElementById('word-list');
            wordList.innerHTML = '';
            
            let words = [];
            const filteredBank = wordBank.filter(word => 
                selectedLevels.includes(word.level || 'flyers')
            );
            
            if (currentTab === 'learned') {
                words = filteredBank.filter(word => learnedWords.has(word.english.toLowerCase()));
                if (words.length === 0) {
                    wordList.innerHTML = '<div class="empty-message">还没有掌握任何单词</div>';
                    return;
                }
            } else if (currentTab === 'wrong') {
                words = filteredBank.filter(word => wrongWords.has(word.english.toLowerCase()));
                if (words.length === 0) {
                    wordList.innerHTML = '<div class="empty-message">错词本为空，太棒了！</div>';
                    return;
                }
            } else {
                words = filteredBank.filter(word => 
                    !learnedWords.has(word.english.toLowerCase()) && 
                    !wrongWords.has(word.english.toLowerCase())
                );
                if (words.length === 0) {
                    wordList.innerHTML = '<div class="empty-message">所有单词都已练习完成！</div>';
                    return;
                }
            }
            
            const levelNames = {
                'starters': 'Pre A1 Starters',
                'movers': 'A1 Movers',
                'flyers': 'A2 Flyers'
            };
            
            const levelOrder = ['starters', 'movers', 'flyers'];
            
            levelOrder.forEach(level => {
                if (!selectedLevels.includes(level)) return;
                
                const levelWords = words.filter(word => (word.level || 'flyers') === level);
                if (levelWords.length === 0) return;
                
                const section = document.createElement('div');
                section.className = 'level-section';
                
                const header = document.createElement('div');
                header.className = `level-header ${level}`;
                header.innerHTML = `${levelNames[level]}<span class="level-count">(${levelWords.length}个)</span>`;
                section.appendChild(header);
                
                const grid = document.createElement('div');
                grid.className = 'words-grid';
                
                levelWords.forEach(word => {
                    const item = document.createElement('div');
                    item.className = 'word-item';
                    item.innerHTML = `
                        <span class="english">${word.english}</span>
                        <span class="chinese">${word.chinese}</span>
                    `;
                    grid.appendChild(item);
                });
                
                section.appendChild(grid);
                wordList.appendChild(section);
            });
        }
        
        // 点击弹窗外部关闭
        document.getElementById('record-modal').addEventListener('click', function(e) {
            if (e.target === this) hideRecord();
        });
        
        document.getElementById('settings-modal').addEventListener('click', function(e) {
            if (e.target === this) hideSettings();
        });
        
        // 物理键盘支持
        document.addEventListener('keydown', function(e) {
            // 弹窗打开时，ESC 关闭弹窗
            if (document.getElementById('settings-modal').classList.contains('show') ||
                document.getElementById('record-modal').classList.contains('show')) {
                if (e.key === 'Escape') {
                    hideSettings();
                    hideRecord();
                }
                return;
            }
            
            // 已提交答案后，按 Enter 或 Space 进入下一个单词
            if (isAnswerSubmitted) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToNextWord();
                }
                return;
            }
            
            // a-z 输入字母
            if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                e.preventDefault();
                addLetter(e.key);
            }
            
            // Backspace 删除
            if (e.key === 'Backspace') {
                e.preventDefault();
                deleteLetter();
            }
            
            // Enter 提交
            if (e.key === 'Enter') {
                e.preventDefault();
                submitAnswer();
            }
        });
        
        // 启动应用
        init();