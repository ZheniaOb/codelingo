import os
from datetime import datetime, timedelta, timezone 
import jwt 
import bcrypt 
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# --- 1. CONFIGURATION ---
print("Starting backend...")
load_dotenv() 

app = Flask(__name__)

CORS(app) 

db_url = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SECRET_KEY'] = 'my_super_secret_key_123' # JWT Secret Key

db = SQLAlchemy(app)
print("Connecting to database...")

# --- 2. DATABASE MODELS (SQLAlchemy) ---
class User(db.Model):
    __tablename__ = 'users' 
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')

    # Relationship to track lesson progress
    lessons_completed = db.relationship('UserLessonProgress', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

print("User model defined.")

# --- COURSE MODELS (Languages, Modules, Lessons, Exercises) ---

class Language(db.Model):
    """
    A programming language (Python, Java, etc.)
    """
    __tablename__ = 'languages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False) # "Python"
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True) # /img/logos/python.png
    
    modules = db.relationship('Module', backref='language', lazy=True, cascade="all, delete-orphan")

class Module(db.Model):
    """
    A Theme or Module of a course ("THEME 1: VARIABLES...")
    """
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False) # "THEME 1..."
    description = db.Column(db.Text, nullable=True)
    order = db.Column(db.Integer, nullable=False) # For sorting (1, 2, 3...)
    
    language_id = db.Column(db.Integer, db.ForeignKey('languages.id'), nullable=False)
    lessons = db.relationship('Lesson', backref='module', lazy=True, cascade="all, delete-orphan")

class Lesson(db.Model):
    """
    A specific lesson ("Lesson 1: Integers (int)")
    """
    __tablename__ = 'lessons'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    lesson_type = db.Column(db.String(20), nullable=False, default='theory') # 'theory', 'quiz', 'code'
    order = db.Column(db.Integer, nullable=False) # For sorting (1, 2, 3...)
    
    # Field to store the lesson text (theory)
    content = db.Column(db.Text, nullable=True) 
    
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    exercises = db.relationship('Exercise', backref='lesson', lazy=True, cascade="all, delete-orphan")

class Exercise(db.Model):
    """
    An exercise or Test ("What will 10 // 3 output?")
    SIMPLE VERSION: No AI, just multiple choice or exact answer.
    """
    __tablename__ = 'exercises'
    id = db.Column(db.Integer, primary_key=True)
    exercise_type = db.Column(db.String(20), nullable=False) # 'multiple_choice', 'fill_in_blank'
    question = db.Column(db.Text, nullable=False) # Question text
    
    # Answer options (for 'multiple_choice')
    options = db.Column(db.JSON, nullable=True) # e.g., {"a": "print()", "b": "log()"}
    
    # The correct answer
    answer = db.Column(db.Text, nullable=False) # e.g., "a" or "%"
    
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)

class UserLessonProgress(db.Model):
    """
    Join table for tracking progress (User <-> Lesson)
    """
    __tablename__ = 'user_lesson_progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    __table_args__ = (db.UniqueConstraint('user_id', 'lesson_id', name='_user_lesson_uc'),)


print("All course models defined.")

# --- 3. API ROUTES (Endpoints) ---

# REGISTRATION
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Validation
    if not email or not password:
        return jsonify(error="Email and password are required"), 400
    if User.query.filter_by(email=email).first():
        return jsonify(error="This email is already registered"), 409

    # Create user
    new_user = User(email=email)
    new_user.set_password(password)

    # NEW ROLE LOGIC: Check for secret admin code
    secret_code = data.get('secret_code') 

    if secret_code == 'MY_ADMIN_SECRET': # Change this secret
        new_user.role = 'admin'
        print(f"User {email} registered as ADMIN (with code).")
    else:
        new_user.role = 'user'
        print(f"User {email} registered as 'user'.")

    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(message="User successfully registered", role=new_user.role), 201

# LOGIN
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify(error="Invalid email or password"), 401
    
    # Create JWT token (PyJWT)
    token = jwt.encode({
        'user_id': user.id,
        'role': user.role, 
        'exp': datetime.now(timezone.utc) + timedelta(hours=24) # Token validity
    }, app.config['SECRET_KEY'], algorithm="HS256")

    print(f"Login successful: {email}, Role: {user.role}")
    return jsonify(access_token=token, role=user.role), 200

# GET USER DATA (Protected route: /api/me)
@app.route('/api/me', methods=['GET'])
def get_user_data():
    token = None
    
    # 1. Get token from 'Authorization: Bearer [token]' header
    if 'Authorization' in request.headers:
        token = request.headers['Authorization'].split(" ")[1]

    if not token:
        return jsonify(error="Authentication token is missing"), 401

    try:
        # 2. Decode the token (verifies validity and expiry)
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        
        # 3. Fetch user data from the database using ID from the token
        current_user = User.query.filter_by(id=data['user_id']).first()
        
        if not current_user:
            return jsonify(error="User not found"), 404

        # 4. Return user data (without password hash)
        return jsonify(
            id=current_user.id,
            email=current_user.email,
            role=current_user.role
        ), 200

    except jwt.ExpiredSignatureError:
        return jsonify(error="Token has expired"), 401
    except jwt.InvalidTokenError:
        return jsonify(error="Invalid token"), 401

# --- 4. RUN ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Creates tables if they don't exist
    
    # Run the Flask server
    app.run(debug=True, port=5001)