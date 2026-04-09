        
        let currentWord = null;
        let userInput = [];
        let stats = { count: 0, correct: 0 };
        let learnedWords = new Set(); // 已学习的单词
        let currentTab = 'learned'; // 当前选中的tab
        let selectedLevels = ['starters', 'movers', 'flyers']; // 选中的级别，默认全选
        
        // 按级别顺序出题的相关变量
        let currentLevelIndex = 0; // 当前级别索引
        let levelWordPools = {}; // 每个级别的单词池
        let currentLevelWords = []; // 当前级别待出题的单词
        
        // 初始化级别单词池
        function initLevelPools() {
            levelWordPools = {
                'starters': [],
                'movers': [],
                'flyers': []
            };
            
            // 将单词按级别分类
            wordBank.forEach(word => {
                const level = word.level || 'flyers';
                if (levelWordPools[level]) {
                    levelWordPools[level].push(word);
                }
            });
            
            // 打乱每个级别内的顺序
            for (let level in levelWordPools) {
                levelWordPools[level] = shuffleArray(levelWordPools[level]);
            }
            
            // 重置当前级别索引
            currentLevelIndex = 0;
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
            initLevelPools(); // 初始化级别单词池
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
            
            // 删除和提交按钮已经在HTML中单独一行了
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
            
            // 加载已学习的单词
            const savedWords = localStorage.getItem('learnedWords');
            if (savedWords) {
                try {
                    learnedWords = new Set(JSON.parse(savedWords));
                } catch (e) {
                    learnedWords = new Set();
                }
            }
        }
        
        // 保存统计
        function saveStats() {
            localStorage.setItem('spellingStats', JSON.stringify(stats));
            localStorage.setItem('learnedWords', JSON.stringify([...learnedWords]));
        }
        
        // 更新统计显示
        function updateStats() {
            document.getElementById('count').textContent = stats.count;
            const acc = stats.count > 0 ? Math.round((stats.correct / stats.count) * 100) : 0;
            document.getElementById('accuracy').textContent = acc + '%';
        }
        
        // 新单词
        function newWord() {
            // 如果还没有初始化单词池，先初始化
            if (!levelWordPools.starters || levelWordPools.starters.length === 0) {
                initLevelPools();
            }
            
            // 获取选中的级别列表（按顺序）
            const activeLevels = selectedLevels.filter(level => 
                levelWordPools[level] && levelWordPools[level].length > 0
            );
            
            if (activeLevels.length === 0) {
                alert('请至少选择一个级别！');
                return;
            }
            
            // 找到当前应该出题的级别（优先从starters开始）
            let targetLevel = null;
            
            // 按级别顺序查找：starters -> movers -> flyers
            const levelPriority = ['starters', 'movers', 'flyers'];
            
            for (let level of levelPriority) {
                // 只考虑选中的级别
                if (activeLevels.includes(level)) {
                    // 如果这个级别还有单词，就选这个级别
                    if (levelWordPools[level] && levelWordPools[level].length > 0) {
                        targetLevel = level;
                        break; // 找到第一个有单词的级别就停止
                    }
                }
            }
            
            if (!targetLevel) {
                alert('所有单词都练习完了！');
                return;
            }
            
            // 从目标级别中取出一个单词（从末尾取出，保证随机性）
            currentWord = levelWordPools[targetLevel].pop();
            
            userInput = [];
            
            document.getElementById('chinese-word').textContent = currentWord.chinese;
            document.getElementById('message').style.display = 'none';
            
            // 隐藏上一个单词的结果和按钮
            hideWordResult();
            hideNextButton();
            
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
        
        // 更新级别选择
        function updateLevelSelection() {
            const starters = document.getElementById('check-starters').checked;
            const movers = document.getElementById('check-movers').checked;
            const flyers = document.getElementById('check-flyers').checked;
            
            selectedLevels = [];
            if (starters) selectedLevels.push('starters');
            if (movers) selectedLevels.push('movers');
            if (flyers) selectedLevels.push('flyers');
            
            // 至少保留一个
            if (selectedLevels.length === 0) {
                alert('请至少选择一个级别！');
                // 恢复最后一个取消的选择
                event.target.checked = true;
                selectedLevels = [event.target.id.replace('check-', '')];
            }
            
            // 重新初始化级别单词池
            initLevelPools();
            
            // 根据选中的级别重新获取单词
            newWord();
        }
        
        // 创建字母框
        function createLetterBoxes() {
            const area = document.getElementById('spelling-area');
            area.innerHTML = '';
            
            for (let i = 0; i < currentWord.english.length; i++) {
                // 创建容器，包含字母框和正确字母显示区
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
                container.style.margin = '5px';
                
                // 创建字母框
                const box = document.createElement('div');
                box.className = 'letter-box';
                box.id = 'letter-' + i;
                container.appendChild(box);
                
                // 创建正确字母显示区（在字母框外面）
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
                showMessage('请填写所有字母！', 'error');
                return;
            }
            
            const userAnswer = userInput.join('').toLowerCase();
            const correctAnswer = currentWord.english.toLowerCase();
            
            stats.count++;
            
            // 记录已学习的单词
            learnedWords.add(currentWord.english.toLowerCase());
            
            if (userAnswer === correctAnswer) {
                stats.correct++;
                showMessage('🎉 太棒了！完全正确！', 'success');
                highlightLetters(true);
            } else {
                showMessage('😅 再试试吧！', 'error');
                highlightLetters(false);
            }
            
            // 显示完整单词和解释
            showWordResult();
            
            // 显示"下一个单词"按钮
            showNextButton();
            
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
                    box.textContent = userLetter; // 保持用户输入的字母（小写）
                    // 在字母框外面显示正确的字母（小写），大小和输入字母一样
                    correctLetterDiv.textContent = correctLetter;
                    correctLetterDiv.style.display = 'block';
                }
            }
        }
        
        // 显示消息
        function showMessage(text, type) {
            const msg = document.getElementById('message');
            // 清空之前的内容
            msg.innerHTML = '';
            
            // 创建文本节点
            const textNode = document.createTextNode(text);
            msg.appendChild(textNode);
            
            msg.className = 'message ' + type;
            msg.style.display = 'block';
        }
        
        // 显示完整单词和解释
        function showWordResult() {
            const wordResult = document.getElementById('word-result');
            const correctWord = document.getElementById('correct-word');
            const wordExplanation = document.getElementById('word-explanation');
            
            correctWord.textContent = currentWord.english.toLowerCase();
            wordExplanation.textContent = currentWord.chinese;
            wordResult.style.display = 'block';
        }
        
        // 隐藏完整单词和解释
        function hideWordResult() {
            const wordResult = document.getElementById('word-result');
            wordResult.style.display = 'none';
        }
        
        // 显示"下一个单词"按钮
        function showNextButton() {
            // 移除已存在的按钮
            const existingBtn = document.getElementById('next-word-btn');
            if (existingBtn) {
                existingBtn.remove();
            }
            
            // 创建按钮
            const btn = document.createElement('button');
            btn.id = 'next-word-btn';
            btn.className = 'next-word-btn';
            btn.textContent = '下一个单词 →';
            btn.onclick = goToNextWord;
            
            // 将按钮添加到message内部
            const msg = document.getElementById('message');
            msg.appendChild(btn);
        }
        
        // 隐藏"下一个单词"按钮
        function hideNextButton() {
            const btn = document.getElementById('next-word-btn');
            if (btn) {
                btn.remove();
            }
        }
        
        // 跳转到下一个单词
        function goToNextWord() {
            hideWordResult();
            hideNextButton();
            hideMessage();
            newWord();
        }
        
        // 隐藏消息
        function hideMessage() {
            const msg = document.getElementById('message');
            msg.style.display = 'none';
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
            
            // 更新tab按钮样式
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // 重新渲染单词列表
            renderWordList();
        }
        
        // 渲染单词列表
        function renderWordList() {
            const wordList = document.getElementById('word-list');
            wordList.innerHTML = '';
            
            let words = [];
            
            // 根据选中的级别过滤
            const filteredBank = wordBank.filter(word => 
                selectedLevels.includes(word.level || 'flyers')
            );
            
            if (currentTab === 'learned') {
                words = filteredBank.filter(word => learnedWords.has(word.english.toLowerCase()));
                if (words.length === 0) {
                    wordList.innerHTML = '<div class="empty-message">还没有学习任何单词</div>';
                    return;
                }
            } else {
                words = filteredBank.filter(word => !learnedWords.has(word.english.toLowerCase()));
                if (words.length === 0) {
                    wordList.innerHTML = '<div class="empty-message">所有单词都已学习完成！🎉</div>';
                    return;
                }
            }
            
            // 按level分组
            const levelNames = {
                'starters': 'Pre A1 Starters',
                'movers': 'A1 Movers',
                'flyers': 'A2 Flyers'
            };
            
            const levelOrder = ['starters', 'movers', 'flyers'];
            
            levelOrder.forEach(level => {
                // 只显示选中的级别
                if (!selectedLevels.includes(level)) return;
                
                const levelWords = words.filter(word => (word.level || 'flyers') === level);
                
                if (levelWords.length === 0) return; // 该级别没有单词则跳过
                
                // 创建level section
                const section = document.createElement('div');
                section.className = 'level-section';
                
                // level标题
                const header = document.createElement('div');
                header.className = `level-header ${level}`;
                header.innerHTML = `${levelNames[level]}<span class="level-count">(${levelWords.length}个)</span>`;
                section.appendChild(header);
                
                // 创建单词网格容器
                const grid = document.createElement('div');
                grid.className = 'words-grid';
                
                // 该级别的单词列表
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
            if (e.target === this) {
                hideRecord();
            }
        });
        
        // 点击设置弹窗外部关闭
        document.getElementById('settings-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                hideSettings();
            }
        });
        
        // 启动应用
        init();
