import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime

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
