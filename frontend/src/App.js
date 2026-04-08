import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SpellingPractice = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 获取随机单词
  const fetchRandomWord = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/words/random');
      const word = response.data;
      setCurrentWord(word);
      setUserInput(Array(word.english.length).fill(''));
      setResult(null);
    } catch (error) {
      console.error('获取单词失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取第一个单词
  useEffect(() => {
    fetchRandomWord();
  }, []);

  // 处理字母点击
  const handleLetterClick = (letter) => {
    if (result) return; // 如果已经提交结果，则不允许继续输入
    
    // 找到第一个空的位置
    const firstEmptyIndex = userInput.findIndex(char => char === '');
    if (firstEmptyIndex !== -1) {
      const newUserInput = [...userInput];
      newUserInput[firstEmptyIndex] = letter;
      setUserInput(newUserInput);
    }
  };

  // 删除最后一个输入的字母
  const handleDelete = () => {
    if (result) return;
    
    // 从后往前找第一个非空位置
    for (let i = userInput.length - 1; i >= 0; i--) {
      if (userInput[i] !== '') {
        const newUserInput = [...userInput];
        newUserInput[i] = '';
        setUserInput(newUserInput);
        break;
      }
    }
  };

  // 提交拼写结果
  const handleSubmit = async () => {
    if (userInput.some(char => char === '')) {
      alert('请完成所有字母的拼写！');
      return;
    }

    const inputString = userInput.join('');
    try {
      const response = await axios.post('http://localhost:8000/words/check', {
        user_input: inputString,
        correct_answer: currentWord.english
      });
      
      setResult(response.data);
    } catch (error) {
      console.error('检查拼写失败:', error);
    }
  };

  // 重置练习
  const handleReset = () => {
    fetchRandomWord();
  };

  // 渲染字母键盘
  const renderKeyboard = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    return (
      <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-2 mt-6 px-2">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            disabled={result !== null}
            className={`keyboard-key ${result ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {letter}
          </button>
        ))}
        <button
          onClick={handleDelete}
          disabled={result !== null}
          className={`keyboard-key bg-gradient-to-b from #f5a623 to #f7941d border-[#c97615] col-span-2 ${result ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ← 删除
        </button>
        <button
          onClick={handleSubmit}
          disabled={result !== null || userInput.some(char => char === '')}
          className={`keyboard-key bg-gradient-to-b from #7ed321 to #4a90e2 border-[#3a7bb9] col-span-3 ${result || userInput.some(char => char === '') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ✓ 提交
        </button>
      </div>
    );
  };

  // 渲染拼写框
  const renderSpellingBoxes = () => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-full overflow-x-auto pb-2">
        {userInput.map((char, index) => {
          let boxClass = "spell-box ";
          
          if (result) {
            // 如果已有结果，根据结果设置样式
            const feedback = result.feedback[index];
            if (feedback && !feedback.is_correct) {
              boxClass += "incorrect";
            } else if (feedback && feedback.is_correct) {
              boxClass += "correct";
            }
          }
          
          return (
            <div key={index} className={boxClass}>
              {char}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染反馈信息
  const renderFeedback = () => {
    if (!result) return null;
    
    return (
      <div className="mt-6 p-4 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-dashed border-yellow-300">
        <div className={`text-2xl font-bold text-center mb-4 ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
          {result.correct ? '🎉 太棒了！完全正确！' : '😅 有几个字母需要改正：'}
        </div>
        
        {!result.correct && (
          <div className="space-y-2">
            <div className="font-bold text-lg text-center text-blue-700">正确答案: {currentWord.english}</div>
            <div className="font-semibold text-center">拼写分析:</div>
            <ul className="list-disc pl-5 mt-3">
              {result.feedback.map((item, index) => (
                <li key={index} className={`font-medium ${item.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                  第{index + 1}位: 
                  {item.is_correct 
                    ? ` "${item.user_char}" ✓ 正确!` 
                    : ` "${item.user_char || '空'}" → "${item.correct_char}" ×`}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          onClick={handleReset}
          className="mt-4 w-full py-4 cartoon-btn text-xl font-bold"
        >
          🎉 下一个单词
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-4 px-2">
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-blue-100 to-purple-100 rounded-3xl shadow-2xl p-4 sm:p-6 border-8 border-yellow-300">
        <div className="text-center mb-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
            🐻 剑桥少儿英语拼写乐园
          </h1>
          <p className="text-lg sm:text-xl text-blue-700 font-medium">快乐学英语，轻松练拼写！</p>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-bounce text-6xl">🔤</div>
            <p className="mt-4 text-xl text-purple-700 font-bold">魔法单词正在飞来...</p>
          </div>
        ) : (
          currentWord && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full px-6 py-2 mb-4 border-4 border-yellow-400">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-800">
                    📝 请拼写: <span className="text-blue-700">{currentWord.chinese}</span>
                  </h2>
                </div>
                
                {/* 拼写框 */}
                {renderSpellingBoxes()}
              </div>
              
              {/* 字母键盘 */}
              {renderKeyboard()}
              
              {/* 结果反馈 */}
              {renderFeedback()}
            </div>
          )
        )}
        
        <div className="text-center mt-6 text-purple-600 font-medium">
          Made with ❤️ for kids learning English
        </div>
      </div>
    </div>
  );
};

export default SpellingPractice;