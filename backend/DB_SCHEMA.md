# Database Schema

### Tables

1. **users**
   - id (primary key)
   - email (unique)
   - password_hash
   - role (parent/child)
   - name
   - age
   - created_at

2. **parent_child_links**
   - parent_id (foreign key)
   - child_id (foreign key)
   - linked_at

3. **lessons**
   - id (primary key)
   - title
   - description
   - content (markdown)
   - created_at

4. **questions**
   - id (primary key)
   - lesson_id (foreign key)
   - question (markdown)
   - options (JSON array)
   - correct_answer (index)
   - explanation

5. **student_progress**
   - id (primary key)
   - user_id (foreign key)
   - lesson_id (foreign key)
   - score
   - total_questions
   - passed (boolean)
   - completed_at

6. **chat_history**
   - id (primary key)
   - user_id (foreign key)
   - message
   - response
   - distress_detected (boolean)
   - timestamp

7. **emergency_alerts**
   - id (primary key)
   - user_id (foreign key)
   - message
   - location
   - status
   - created_at

---