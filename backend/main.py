from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import random
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 数据库初始化
def init_db():
    conn = sqlite3.connect('words.db')
    cursor = conn.cursor()
    
    # 创建单词表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            english TEXT NOT NULL,
            chinese TEXT NOT NULL,
            level INTEGER NOT NULL
        )
    ''')
    
    # 插入剑桥少儿英语1-2级别单词示例
    sample_words = [
        ("cat", "猫", 1),
        ("dog", "狗", 1),
        ("book", "书", 1),
        ("pen", "钢笔", 1),
        ("red", "红色", 1),
        ("blue", "蓝色", 1),
        ("apple", "苹果", 1),
        ("ball", "球", 1),
        ("car", "汽车", 1),
        ("duck", "鸭子", 1),
        ("egg", "鸡蛋", 1),
        ("fish", "鱼", 1),
        ("goat", "山羊", 1),
        ("hat", "帽子", 1),
        ("ice", "冰", 1),
        ("jump", "跳", 1),
        ("kite", "风筝", 1),
        ("lion", "狮子", 1),
        ("mouse", "老鼠", 1),
        ("nest", "鸟巢", 1),
        ("orange", "橙色", 1),
        ("pig", "猪", 1),
        ("queen", "女王", 1),
        ("rabbit", "兔子", 1),
        ("sun", "太阳", 1),
        ("tree", "树", 1),
        ("umbrella", "雨伞", 1),
        ("van", "面包车", 1),
        ("water", "水", 1),
        ("yellow", "黄色", 1),
        ("zebra", "斑马", 1),
        ("ant", "蚂蚁", 1),
        ("bear", "熊", 1),
        ("cow", "母牛", 1),
        ("door", "门", 1),
        ("ear", "耳朵", 1),
        ("foot", "脚", 1),
        ("gift", "礼物", 1),
        ("house", "房子", 1),
        ("insect", "昆虫", 1),
        ("jacket", "夹克", 1),
        ("key", "钥匙", 1),
        ("leg", "腿", 1),
        ("monkey", "猴子", 1),
        ("nose", "鼻子", 1),
        ("owl", "猫头鹰", 1),
        ("pencil", "铅笔", 1),
        ("quiet", "安静的", 1),
        ("river", "河流", 1),
        ("snake", "蛇", 1),
        ("toy", "玩具", 1),
        ("window", "窗户", 1),
        ("box", "盒子", 1),
        ("cake", "蛋糕", 1),
        ("desk", "桌子", 1),
        ("eye", "眼睛", 1),
        ("flower", "花", 1),
        ("grass", "草", 1),
        ("hand", "手", 1),
        ("island", "岛屿", 1),
        ("jelly", "果冻", 1),
        ("knee", "膝盖", 1),
        ("leaf", "叶子", 1),
        ("moon", "月亮", 1),
        ("nut", "坚果", 1),
        ("ocean", "海洋", 1),
        ("pot", "锅", 1),
        ("rain", "雨", 1),
        ("star", "星星", 1),
        ("train", "火车", 1),
        ("under", "在...下面", 1),
        ("vest", "背心", 1),
        ("watch", "手表", 1),
        ("young", "年轻的", 1)
    ]
    
    # 检查是否已有数据
    cursor.execute("SELECT COUNT(*) FROM words")
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.executemany("INSERT INTO words (english, chinese, level) VALUES (?, ?, ?)", sample_words)
        conn.commit()
    
    conn.close()

# 初始化数据库
init_db()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应限制为具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Word(BaseModel):
    id: int
    english: str
    chinese: str
    level: int

class WordRequest(BaseModel):
    level: Optional[int] = None

@app.get("/")
def read_root():
    return {"message": "剑桥少儿英语拼写练习API"}

@app.get("/words/random", response_model=Word)
def get_random_word(level: Optional[int] = None):
    conn = sqlite3.connect('words.db')
    cursor = conn.cursor()
    
    if level:
        cursor.execute("SELECT id, english, chinese, level FROM words WHERE level = ? ORDER BY RANDOM() LIMIT 1", (level,))
    else:
        cursor.execute("SELECT id, english, chinese, level FROM words ORDER BY RANDOM() LIMIT 1")
    
    word_data = cursor.fetchone()
    conn.close()
    
    if word_data:
        return Word(
            id=word_data[0],
            english=word_data[1],
            chinese=word_data[2],
            level=word_data[3]
        )
    else:
        raise HTTPException(status_code=404, detail="No words found")

@app.post("/words/check")
def check_spelling(user_input: str, correct_answer: str):
    result = {
        "correct": user_input.lower() == correct_answer.lower(),
        "feedback": []
    }
    
    # 检查每个字符
    max_len = max(len(user_input), len(correct_answer))
    for i in range(max_len):
        if i < len(user_input) and i < len(correct_answer):
            is_correct = user_input[i].lower() == correct_answer[i].lower()
            result["feedback"].append({
                "position": i,
                "user_char": user_input[i] if i < len(user_input) else "",
                "correct_char": correct_answer[i] if i < len(correct_answer) else "",
                "is_correct": is_correct
            })
        elif i < len(user_input):  # 用户输入多了
            result["feedback"].append({
                "position": i,
                "user_char": user_input[i],
                "correct_char": "",
                "is_correct": False
            })
        else:  # 用户输入少了
            result["feedback"].append({
                "position": i,
                "user_char": "",
                "correct_char": correct_answer[i],
                "is_correct": False
            })
    
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)