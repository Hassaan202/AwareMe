import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime
import json

DATABASE = "app.db"

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def populate_initial_lessons(db):
    """Populate lessons table with initial safety lessons"""
    # Check if lessons already exist
    count = db.execute("SELECT COUNT(*) as cnt FROM lessons").fetchone()
    if count[0] > 0:
        return  # Already populated

    # Lesson 1: Good Touch, Bad Touch
    lesson1_id = "lesson-1"
    db.execute(
        "INSERT OR IGNORE INTO lessons (id, title, description, content, created_at) VALUES (?, ?, ?, ?, ?)",
        (
            lesson1_id,
            "Good Touch, Bad Touch 🤗",
            "Learn about safe and unsafe touches",
            """**What is Good Touch?**
- Hugs from people you trust 🤗
- High-fives with friends ✋
- Doctor checkups with parents present 👨‍⚕️

**What is Bad Touch?**
- Touches that make you uncomfortable 😟
- Someone touching private areas 🚫
- Being forced to touch someone

**Remember:**
- Your body belongs to YOU! 💪
- Say NO to uncomfortable touches
- Tell a trusted adult immediately""",
            datetime.utcnow().isoformat()
        )
    )

    # Questions for Lesson 1
    db.execute(
        "INSERT OR IGNORE INTO questions (id, lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)",
        ("q1-1", lesson1_id, "Which is a good touch?",
         json.dumps(["A hug from mom", "Someone touching private parts", "Being forced to kiss someone"]),
         0, "Hugs from trusted family members are good touches! 🤗")
    )
    db.execute(
        "INSERT OR IGNORE INTO questions (id, lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)",
        ("q1-2", lesson1_id, "What should you do if someone makes you uncomfortable?",
         json.dumps(["Keep it a secret", "Tell a trusted adult", "Do nothing"]),
         1, "Always tell a trusted adult! It's never your fault. 💙")
    )

    # Lesson 2: My Body, My Rules
    lesson2_id = "lesson-2"
    db.execute(
        "INSERT OR IGNORE INTO lessons (id, title, description, content, created_at) VALUES (?, ?, ?, ?, ?)",
        (
            lesson2_id,
            "My Body, My Rules 💪",
            "Understanding body autonomy and consent",
            """**Your Body Belongs to You!**
- You decide who can touch you
- You can say NO at any time 🛑
- Even to family and friends

**Private Parts:**
- Parts covered by swimsuit 👙
- Only you, parents, or doctors (with parents) can see
- Tell an adult if someone asks to see or touch

**It's Never Your Fault:**
- If something bad happens, it's NOT your fault
- You can always tell someone
- Adults will help you 🌟""",
            datetime.utcnow().isoformat()
        )
    )

    # Questions for Lesson 2
    db.execute(
        "INSERT OR IGNORE INTO questions (id, lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)",
        ("q2-1", lesson2_id, "Can you say NO to anyone touching you?",
         json.dumps(["No, must obey adults", "Yes, always!", "Only to strangers"]),
         1, "YES! You can say NO to anyone, even family. Your body, your choice! 💪")
    )

    # Lesson 3: Trusted Adults
    lesson3_id = "lesson-3"
    db.execute(
        "INSERT OR IGNORE INTO lessons (id, title, description, content, created_at) VALUES (?, ?, ?, ?, ?)",
        (
            lesson3_id,
            "Trusted Adults 👨‍👩‍👧",
            "Who to talk to when you need help",
            """**Who are Trusted Adults?**
- Parents or guardians 👨‍👩‍👧
- Teachers 👩‍🏫
- School counselors
- Police officers 👮
- Close family members

**When to Tell Them:**
- Someone makes you uncomfortable
- You see something wrong
- You have a secret that feels bad
- You need help

**No Secrets Policy:**
- Good surprises (birthday party) = OK 🎉
- Bad secrets (someone hurting you) = TELL! 🚨""",
            datetime.utcnow().isoformat()
        )
    )

    # Questions for Lesson 3
    db.execute(
        "INSERT OR IGNORE INTO questions (id, lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)",
        ("q3-1", lesson3_id, "What should you do with a bad secret?",
         json.dumps(["Keep it forever", "Tell a trusted adult", "Tell other kids"]),
         1, "Always tell a trusted adult about bad secrets! They will help you. 💙")
    )

def init_db():
    with get_db() as db:
        # Users table
        db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                password_hash TEXT,
                role TEXT,
                name TEXT,
                age INTEGER
            )
        """)

        # Parent-Child relationships
        db.execute("""
            CREATE TABLE IF NOT EXISTS parent_child_links (
                id TEXT PRIMARY KEY,
                parent_id TEXT,
                child_id TEXT,
                created_at TEXT,
                FOREIGN KEY (parent_id) REFERENCES users(id),
                FOREIGN KEY (child_id) REFERENCES users(id)
            )
        """)

        # Emergency alerts
        db.execute("""
            CREATE TABLE IF NOT EXISTS emergency_alerts (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                message TEXT,
                location TEXT,
                created_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        # Chat history
        db.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                message TEXT,
                response TEXT,
                distress_detected INTEGER,
                created_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        # Lessons table
        db.execute("""
            CREATE TABLE IF NOT EXISTS lessons (
                id TEXT PRIMARY KEY,
                title TEXT,
                description TEXT,
                content TEXT,
                created_at TEXT
            )
        """)

        # Questions table
        db.execute("""
            CREATE TABLE IF NOT EXISTS questions (
                id TEXT PRIMARY KEY,
                lesson_id TEXT,
                question TEXT,
                options TEXT,
                correct_answer INTEGER,
                explanation TEXT,
                FOREIGN KEY (lesson_id) REFERENCES lessons(id)
            )
        """)

        # Student progress table
        db.execute("""
            CREATE TABLE IF NOT EXISTS student_progress (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                lesson_id TEXT,
                score INTEGER,
                total_questions INTEGER,
                passed INTEGER,
                completed_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (lesson_id) REFERENCES lessons(id)
            )
        """)

        # Populate lessons with initial data
        populate_initial_lessons(db)



# USER CRUD
def create_user(email, password_hash, role, name, age=None):
    with get_db() as db:
        user_id = str(uuid.uuid4())
        db.execute(
            "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, email, password_hash, role, name, age)
        )
        return user_id

def get_user_by_email(email):
    with get_db() as db:
        return db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

def get_user_by_id(user_id):
    with get_db() as db:
        return db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

# PARENT-CHILD LINKS
def link_parent_child(parent_id, child_id):
    with get_db() as db:
        link_id = str(uuid.uuid4())
        db.execute(
            "INSERT INTO parent_child_links VALUES (?, ?, ?, ?)",
            (link_id, parent_id, child_id, datetime.utcnow().isoformat())
        )
        return link_id

def get_parent_of_child(child_id):
    with get_db() as db:
        result = db.execute(
            "SELECT parent_id FROM parent_child_links WHERE child_id = ?",
            (child_id,)
        ).fetchone()
        return result['parent_id'] if result else None

def get_children_of_parent(parent_id):
    with get_db() as db:
        return db.execute(
            """SELECT u.* FROM users u 
               JOIN parent_child_links pcl ON u.id = pcl.child_id 
               WHERE pcl.parent_id = ?""",
            (parent_id,)
        ).fetchall()

# EMERGENCY ALERTS
def create_emergency_alert(user_id, message, location=None):
    with get_db() as db:
        alert_id = str(uuid.uuid4())
        db.execute(
            "INSERT INTO emergency_alerts VALUES (?, ?, ?, ?, ?)",
            (alert_id, user_id, message, location, datetime.utcnow().isoformat())
        )
        return alert_id

def get_alerts_for_parent(parent_id):
    with get_db() as db:
        return db.execute(
            """SELECT ea.* FROM emergency_alerts ea
               JOIN parent_child_links pcl ON ea.user_id = pcl.child_id
               WHERE pcl.parent_id = ?
               ORDER BY ea.created_at DESC""",
            (parent_id,)
        ).fetchall()

# CHAT HISTORY
def save_chat_message(user_id, message, response, distress_detected=False):
    with get_db() as db:
        chat_id = str(uuid.uuid4())
        db.execute(
            "INSERT INTO chat_history VALUES (?, ?, ?, ?, ?, ?)",
            (chat_id, user_id, message, response, int(distress_detected),
             datetime.utcnow().isoformat())
        )
        return chat_id

# LESSONS
def create_lesson(title, description, content):
    with get_db() as db:
        lesson_id = str(uuid.uuid4())
        db.execute(
            "INSERT INTO lessons VALUES (?, ?, ?, ?, ?)",
            (lesson_id, title, description, content, datetime.utcnow().isoformat())
        )
        return lesson_id

def get_lesson_by_id(lesson_id):
    with get_db() as db:
        return db.execute("SELECT * FROM lessons WHERE id = ?", (lesson_id,)).fetchone()

def get_all_lessons():
    with get_db() as db:
        return db.execute("SELECT * FROM lessons").fetchall()

# QUESTIONS
def create_question(lesson_id, question, options, correct_answer, explanation=""):
    with get_db() as db:
        question_id = str(uuid.uuid4())
        db.execute(
            "INSERT INTO questions VALUES (?, ?, ?, ?, ?, ?)",
            (question_id, lesson_id, question, options, correct_answer, explanation)
        )
        return question_id

def get_question_by_id(question_id):
    with get_db() as db:
        return db.execute("SELECT * FROM questions WHERE id = ?", (question_id,)).fetchone()

def get_questions_by_lesson(lesson_id):
    with get_db() as db:
        return db.execute("SELECT * FROM questions WHERE lesson_id = ?", (lesson_id,)).fetchall()

# STUDENT PROGRESS
def track_student_progress(user_id, lesson_id, score, total_questions, passed):
    with get_db() as db:
        progress_id = str(uuid.uuid4())
        db.execute(
            "INSERT INTO student_progress VALUES (?, ?, ?, ?, ?, ?, ?)",
            (progress_id, user_id, lesson_id, score, total_questions, int(passed), datetime.utcnow().isoformat())
        )
        return progress_id

def get_student_progress(user_id, lesson_id):
    with get_db() as db:
        return db.execute(
            "SELECT * FROM student_progress WHERE user_id = ? AND lesson_id = ?",
            (user_id, lesson_id)
        ).fetchone()

def get_progress_by_user(user_id):
    with get_db() as db:
        return db.execute(
            """SELECT sp.*, l.title, l.description FROM student_progress sp
               JOIN lessons l ON sp.lesson_id = l.id
               WHERE sp.user_id = ?""",
            (user_id,)
        ).fetchall()


if __name__ == '__main__':
    init_db()