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
app.config['SECRET_KEY'] = 'my_super_secret_key_123'  # JWT Secret Key

db = SQLAlchemy(app)
print("Connecting to database...")

# --- 2. DATABASE MODELS ---

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')
    lessons_completed = db.relationship('UserLessonProgress', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

class Language(db.Model):
    __tablename__ = 'languages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    modules = db.relationship('Module', backref='language', lazy=True, cascade="all, delete-orphan")

class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    order = db.Column(db.Integer, nullable=False)
    language_id = db.Column(db.Integer, db.ForeignKey('languages.id'), nullable=False)
    lessons = db.relationship('Lesson', backref='module', lazy=True, cascade="all, delete-orphan")

class Lesson(db.Model):
    __tablename__ = 'lessons'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    lesson_type = db.Column(db.String(20), nullable=False, default='theory')
    order = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=True)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=False)
    exercises = db.relationship('Exercise', backref='lesson', lazy=True, cascade="all, delete-orphan")

class Exercise(db.Model):
    __tablename__ = 'exercises'
    id = db.Column(db.Integer, primary_key=True)
    exercise_type = db.Column(db.String(20), nullable=False)
    question = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=True)
    answer = db.Column(db.Text, nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)

class UserLessonProgress(db.Model):
    __tablename__ = 'user_lesson_progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    __table_args__ = (db.UniqueConstraint('user_id', 'lesson_id', name='_user_lesson_uc'),)

class Game(db.Model):
    __tablename__ = 'games'
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.String(50), unique=True, nullable=False)  # memory-code, refactor-rush, etc.
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    difficulty = db.Column(db.String(20), nullable=False, default='Easy')
    xp_reward = db.Column(db.Integer, nullable=False, default=50)
    tasks = db.relationship('GameTask', backref='game', lazy=True, cascade="all, delete-orphan")

class GameTask(db.Model):
    __tablename__ = 'game_tasks'
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    task_type = db.Column(db.String(50), nullable=False)  # memory_code, refactor, variable_hunt, bug_infection
    language = db.Column(db.String(50), nullable=False, default='javascript')  # python, javascript, java, htmlcss
    # For memory-code: code snippet to memorize
    # For refactor-rush: bad code and correct answer
    # For variable-hunt: code with variables and correct variable
    # For bug-infection: code with bugs and correct fixes
    task_data = db.Column(db.JSON, nullable=False)  # Flexible JSON structure for different game types
    order = db.Column(db.Integer, nullable=False, default=0)
    xp_reward = db.Column(db.Integer, nullable=False, default=50)

print("All course models defined.")

# --- 3. AUTHENTICATION ENDPOINTS ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify(error="Email and password are required"), 400
    if User.query.filter_by(email=email).first():
        return jsonify(error="This email is already registered"), 409

    new_user = User(email=email)
    new_user.set_password(password)
    secret_code = data.get('secret_code')
    new_user.role = 'admin' if secret_code == 'MY_ADMIN_SECRET' else 'user'

    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="User successfully registered", role=new_user.role), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify(error="Invalid email or password"), 401

    token = jwt.encode({
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify(access_token=token, role=user.role), 200

@app.route('/api/me', methods=['GET'])
def get_user_data():
    auth_header = request.headers.get('Authorization')
    if not auth_header or len(auth_header.split(" ")) != 2:
        return jsonify(error="Authentication token is missing"), 401
    token = auth_header.split(" ")[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        current_user = User.query.filter_by(id=data['user_id']).first()
        if not current_user:
            return jsonify(error="User not found"), 404
        return jsonify(id=current_user.id, email=current_user.email, role=current_user.role), 200
    except jwt.ExpiredSignatureError:
        return jsonify(error="Token has expired"), 401
    except jwt.InvalidTokenError:
        return jsonify(error="Invalid token"), 401

# --- 4. GAMES ENDPOINTS ---

@app.route('/api/games', methods=['GET'])
def get_games():
    """Get all available games"""
    games = Game.query.all()
    return jsonify([{
        "id": g.id,
        "game_id": g.game_id,
        "title": g.title,
        "description": g.description,
        "difficulty": g.difficulty,
        "xp_reward": g.xp_reward
    } for g in games]), 200

@app.route('/api/games/<string:game_id>/tasks', methods=['GET'])
def get_game_tasks(game_id):
    """Get tasks for a specific game"""
    game = Game.query.filter_by(game_id=game_id).first()
    if not game:
        return jsonify(error="Game not found"), 404
    
    # Get language from query parameter (optional)
    language = request.args.get('language')
    query = GameTask.query.filter_by(game_id=game.id)
    if language:
        query = query.filter_by(language=language)
    
    tasks = query.order_by(GameTask.order).all()
    return jsonify([{
        "id": t.id,
        "task_type": t.task_type,
        "language": t.language,
        "task_data": t.task_data,
        "order": t.order,
        "xp_reward": t.xp_reward
    } for t in tasks]), 200

@app.route('/api/games/<string:game_id>/tasks/random', methods=['GET'])
def get_random_game_task(game_id):
    """Get a random task for a specific game"""
    import random
    game = Game.query.filter_by(game_id=game_id).first()
    if not game:
        return jsonify(error="Game not found"), 404
    
    # Get language from query parameter
    language = request.args.get('language', 'javascript')
    
    tasks = GameTask.query.filter_by(game_id=game.id, language=language).all()
    if not tasks:
        return jsonify(error=f"No tasks available for this game in {language}"), 404
    
    task = random.choice(tasks)
    return jsonify({
        "id": task.id,
        "task_type": task.task_type,
        "language": task.language,
        "task_data": task.task_data,
        "order": task.order,
        "xp_reward": task.xp_reward
    }), 200

# --- 5. RUN SERVER ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Import admin endpoints
    from admin import *
    app.run(debug=True, port=5001)
