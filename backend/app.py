import os
import json
from datetime import datetime, timedelta, timezone, date
import jwt
import bcrypt
import random
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

# --- 1. CONFIGURATION ---
print("Starting backend...")
load_dotenv()

app = Flask(__name__)
# Allow frontend dev server on localhost:3000 to access all /api/* endpoints
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

db_url = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SECRET_KEY'] = 'my_super_secret_key_123'  # JWT Secret Key

db = SQLAlchemy(app)
print("Connecting to database...")

try:
    client = genai.Client(api_key="AIzaSyDqoQJOl0KEknJT5bJcYjgIGhn9HTp7NBo")
    AI_MODEL = "gemini-2.5-flash-lite"
except Exception as e:
    print(f"AI Config Error: {e}")
    client = None


# --- 2. DATABASE MODELS ---

def get_current_user_from_request():
    auth_header = request.headers.get('Authorization')
    if not auth_header or len(auth_header.split(" ")) != 2:
        return None, jsonify(error="Authentication token is missing"), 401
    token = auth_header.split(" ")[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        current_user = User.query.filter_by(id=data['user_id']).first()
        if not current_user:
            return None, jsonify(error="User not found"), 404
        return current_user, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify(error="Token has expired"), 401
    except jwt.InvalidTokenError:
        return None, jsonify(error="Invalid token"), 401


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')
    xp = db.Column(db.Integer, default=0)
    coins = db.Column(db.Integer, default=0)
    avatar = db.Column(db.String(255), nullable=True)
    streak = db.Column(db.Integer, default=0)

    lessons_completed = db.relationship('UserLessonProgress', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

class DailyChallengeStatus(db.Model):
    __tablename__ = 'daily_challenge_status'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    completed = db.Column(db.Boolean, default=False)

class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    item_type = db.Column(db.String(50), nullable=False)  # e.g. 'avatar', 'theme'
    # Price in coins (column name in DB: price_coins)
    price_coins = db.Column(db.Integer, nullable=False, default=0)
    asset_url = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_available = db.Column(db.Boolean, nullable=False, default=True)


class UserInventory(db.Model):
    __tablename__ = 'user_inventory'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    purchase_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    is_equipped = db.Column(db.Boolean, default=False)


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
    game_id = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    difficulty = db.Column(db.String(20), nullable=False, default='Easy')
    xp_reward = db.Column(db.Integer, nullable=False, default=50)
    tasks = db.relationship('GameTask', backref='game', lazy=True, cascade="all, delete-orphan")


class GameTask(db.Model):
    __tablename__ = 'game_tasks'
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    task_type = db.Column(db.String(50), nullable=False)
    language = db.Column(db.String(50), nullable=False, default='javascript')
    task_data = db.Column(db.JSON, nullable=False)
    order = db.Column(db.Integer, nullable=False, default=0)
    xp_reward = db.Column(db.Integer, nullable=False, default=50)


class UserGameResult(db.Model):
    __tablename__ = 'user_game_results'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    xp_earned = db.Column(db.Integer, nullable=False, default=0)
    language = db.Column(db.String(50), nullable=True)
    completed_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))


print("All course models defined.")


# --- 3. AUTHENTICATION ENDPOINTS ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify(error="Username, email, and password are required"), 400

    if User.query.filter_by(email=email).first():
        return jsonify(error="This email is already registered"), 409

    if User.query.filter_by(username=username).first():
        return jsonify(error="This username is already taken"), 409

    new_user = User(email=email, username=username)
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
        'username': user.username,
        'role': user.role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify(access_token=token, role=user.role), 200


@app.route('/api/me', methods=['GET'])
def get_user_data():
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    # Oblicz level na podstawie XP (200xp = 2lvl -> 500xp = 3lvl -> 900xp = 4lvl itd.)
    level = int((-1 + (9 + 0.08 * (current_user.xp or 0)) ** 0.5) / 2)
    xp_for_current_level = int(50 * (level - 1) * (level + 2))
    xp_for_next_level = int(50 * level * (level + 3))
    xp_to_next_level = xp_for_next_level - (current_user.xp or 0)
    progress_percentage = int(((current_user.xp or 0) - xp_for_current_level) / (
                xp_for_next_level - xp_for_current_level) * 100) if xp_for_next_level > xp_for_current_level else 0

    # Level titles
    level_titles = {
        1: "Beginner",
        2: "Novice",
        3: "Learner",
        4: "Student",
        5: "Apprentice",
        6: "Trainee",
        7: "Junior",
        8: "Junior Coder",
        9: "Coder",
        10: "Developer",
        11: "Mid Developer",
        12: "Senior Developer",
        13: "Expert",
        14: "Master",
        15: "Grand Master"
    }
    level_title = level_titles.get(level, f"Level {level}")
    next_level_title = level_titles.get(level + 1, f"Level {level + 1}")

    # Zwracamy rozszerzone dane profilu
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "xp": current_user.xp or 0,
        "coins": current_user.coins or 0,
        "lessons_count": len(current_user.lessons_completed),
        "level": level,
        "level_title": level_title,
        "next_level_title": next_level_title,
        "xp_to_next_level": xp_to_next_level,
        "progress_percentage": progress_percentage,
        "xp_for_current_level": xp_for_current_level,
        "xp_for_next_level": xp_for_next_level,
        "avatar": current_user.avatar or "/img/small_logo.png"
    }), 200


@app.route('/api/me', methods=['PUT'])
def update_user_data():
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    payload = request.get_json() or {}
    new_username = payload.get('username', current_user.username)
    new_email = payload.get('email', current_user.email)
    new_avatar = payload.get('avatar', current_user.avatar)

    if not new_username:
        return jsonify(error="Username cannot be empty"), 400
    if not new_email:
        return jsonify(error="Email cannot be empty"), 400

    # Ensure username/email are unique if changed
    if new_email != current_user.email and User.query.filter_by(email=new_email).first():
        return jsonify(error="This email is already registered"), 409
    if new_username != current_user.username and User.query.filter_by(username=new_username).first():
        return jsonify(error="This username is already taken"), 409

    current_user.username = new_username
    current_user.email = new_email
    current_user.avatar = new_avatar
    db.session.commit()

    # Recalculate level info for response consistency
    level = (current_user.xp // 100) + 1
    xp_for_current_level = (level - 1) * 100
    xp_for_next_level = level * 100
    xp_to_next_level = xp_for_next_level - current_user.xp
    progress_percentage = int(
        ((current_user.xp - xp_for_current_level) / 100) * 100) if xp_for_next_level > xp_for_current_level else 0
    level_titles = {
        1: "Beginner",
        2: "Novice",
        3: "Learner",
        4: "Student",
        5: "Apprentice",
        6: "Trainee",
        7: "Junior",
        8: "Junior Coder",
        9: "Coder",
        10: "Developer",
        11: "Mid Developer",
        12: "Senior Developer",
        13: "Expert",
        14: "Master",
        15: "Grand Master"
    }
    level_title = level_titles.get(level, f"Level {level}")
    next_level_title = level_titles.get(level + 1, f"Level {level + 1}")

    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "xp": current_user.xp or 0,
        "coins": current_user.coins or 0,
        "lessons_count": len(current_user.lessons_completed),
        "level": level,
        "level_title": level_title,
        "next_level_title": next_level_title,
        "xp_to_next_level": xp_to_next_level,
        "progress_percentage": progress_percentage,
        "xp_for_current_level": xp_for_current_level,
        "xp_for_next_level": xp_for_next_level,
        "avatar": current_user.avatar or "/img/small_logo.png"
    }), 200


@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    limit = request.args.get('limit', default=20, type=int)
    limit = max(1, min(limit, 50))

    users = User.query.order_by(User.xp.desc()).limit(limit).all()

    def build_initials(source_name):
        if not source_name:
            return "??"
        parts = source_name.strip().split()
        if len(parts) >= 2:
            return (parts[0][0] + parts[1][0]).upper()
        return source_name[:2].upper()

    leaderboard_payload = []
    for index, user in enumerate(users, start=1):
        display_name = user.username or (user.email.split('@')[0] if user.email else f"User {user.id}")
        initials = build_initials(display_name)
        leaderboard_payload.append({
            "rank": index,
            "id": user.id,
            "username": display_name,
            "xp": user.xp or 0,
            "streak": user.streak or 0,
            "avatar": user.avatar,
            "initials": initials
        })

    return jsonify(leaderboard_payload), 200


# --- 4. GAMES ENDPOINTS ---

@app.route('/api/games', methods=['GET'])
def get_games():
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
    game = Game.query.filter_by(game_id=game_id).first()
    if not game:
        return jsonify(error="Game not found"), 404

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
    import random
    game = Game.query.filter_by(game_id=game_id).first()
    if not game:
        return jsonify(error="Game not found"), 404

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


@app.route('/api/games/<string:game_id>/complete', methods=['POST'])
def complete_game(game_id):
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    game = Game.query.filter_by(game_id=game_id).first()
    if not game:
        return jsonify(error="Game not found"), 404

    payload = request.get_json() or {}
    xp_earned = payload.get('xp_earned')
    language = payload.get('language')

    if xp_earned is None:
        return jsonify(error="xp_earned is required"), 400

    try:
        xp_earned = int(xp_earned)
    except (TypeError, ValueError):
        return jsonify(error="xp_earned must be a number"), 400

    if xp_earned <= 0:
        return jsonify(error="xp_earned must be greater than zero"), 400

    # Prevent unrealistic submissions from the client
    xp_cap = max(game.xp_reward or 0, 50) * 10
    xp_to_add = min(xp_earned, xp_cap)

    current_user.xp = (current_user.xp or 0) + xp_to_add
    # Coin logic: 2 XP -> 1 coin (integer division)
    coins_to_add = xp_to_add // 2
    current_user.coins = (current_user.coins or 0) + coins_to_add

    result = UserGameResult(
        user_id=current_user.id,
        game_id=game.id,
        xp_earned=xp_to_add,
        language=language
    )
    db.session.add(result)
    db.session.commit()

    return jsonify({
        "message": f"You earned {xp_to_add} XP and {coins_to_add} coins from {game.title}",
        "xp_added": xp_to_add,
        "coins_added": coins_to_add,
        "xp_total": current_user.xp,
        "coins_total": current_user.coins,
        "game_id": game.game_id
    }), 200


@app.route('/api/me/lessons-history', methods=['GET'])
def get_lessons_history():
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    history_records = db.session.query(
        UserLessonProgress,
        Lesson,
        Module,
        Language
    ).join(Lesson, UserLessonProgress.lesson_id == Lesson.id) \
        .join(Module, Lesson.module_id == Module.id) \
        .join(Language, Module.language_id == Language.id) \
        .filter(UserLessonProgress.user_id == current_user.id) \
        .order_by(UserLessonProgress.completed_at.desc()) \
        .all()

    history_payload = []
    for progress, lesson, module, language in history_records:
        history_payload.append({
            "lesson_id": lesson.id,
            "lesson_title": lesson.title,
            "module_title": module.title,
            "language_name": language.name,
            "completed_at": progress.completed_at.isoformat()
        })

    return jsonify(history_payload), 200


@app.route('/api/lessons/<int:lesson_id>', methods=['GET'])
def get_lesson_details(lesson_id):
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify(error="Lesson not found"), 404

    all_exercises = Exercise.query.filter_by(lesson_id=lesson.id).all()
    valid_exercises_data = []

    for ex in all_exercises:
        final_options = []
        is_multiple_choice = False

        raw_options = ex.options

        if isinstance(raw_options, str):
            try:
                parsed = json.loads(raw_options.replace("'", '"'))
                raw_options = parsed
            except:
                raw_options = None

        if isinstance(raw_options, dict):
            for key in sorted(raw_options.keys()):
                final_options.append({
                    "key": key,
                    "text": str(raw_options[key])
                })
            is_multiple_choice = True

        elif isinstance(raw_options, list):
            letters = ['a', 'b', 'c', 'd', 'e', 'f']
            for i, opt in enumerate(raw_options):
                key = letters[i] if i < len(letters) else str(i)
                final_options.append({
                    "key": key,
                    "text": str(opt)
                })
            is_multiple_choice = True

        is_open_question = not final_options

        if ex.question and ex.answer and (is_multiple_choice or is_open_question):
            valid_exercises_data.append({
                "id": ex.id,
                "question": ex.question,
                "options": final_options,
                "answer": ex.answer,
                "type": "multiple_choice" if is_multiple_choice else "fill_in_blank"
            })

    return jsonify({
        "id": lesson.id,
        "title": lesson.title,
        "content": lesson.content,
        "exercises": valid_exercises_data
    }), 200


@app.route('/api/lessons/<int:lesson_id>/complete', methods=['POST'])
def complete_lesson(lesson_id):
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    data = request.get_json()
    lives_remaining = data.get('lives_remaining')

    if lives_remaining is None:
        return jsonify(error="lives_remaining is required"), 400

    if lives_remaining >= 3:
        base_xp = 200
        repeat_xp = 100
    elif lives_remaining == 2:
        base_xp = 150
        repeat_xp = 75
    else:
        base_xp = 100
        repeat_xp = 50

    existing_progress = UserLessonProgress.query.filter_by(
        user_id=current_user.id,
        lesson_id=lesson_id
    ).first()

    if existing_progress:
        xp_to_add = repeat_xp
        existing_progress.completed_at = datetime.now(timezone.utc)
        if hasattr(existing_progress, 'xp_earned'): existing_progress.xp_earned = xp_to_add
        if hasattr(existing_progress, 'lives_remaining'): existing_progress.lives_remaining = lives_remaining
    else:
        xp_to_add = base_xp
        new_progress = UserLessonProgress(user_id=current_user.id, lesson_id=lesson_id,
                                          completed_at=datetime.now(timezone.utc))
        if hasattr(new_progress, 'xp_earned'): new_progress.xp_earned = xp_to_add
        if hasattr(new_progress, 'lives_remaining'): new_progress.lives_remaining = lives_remaining
        db.session.add(new_progress)

    # Coin logic: 2 XP -> 1 coin (integer division)
    coins_to_add = xp_to_add // 2
    current_user.xp = (current_user.xp or 0) + xp_to_add
    current_user.coins = (current_user.coins or 0) + coins_to_add
    db.session.commit()

    return jsonify({
        "message": ("Lesson repeated! You earned {} XP and {} coins.".format(xp_to_add, coins_to_add)
                    if existing_progress else
                    "Lesson completed! You earned {} XP and {} coins.".format(xp_to_add, coins_to_add)),
        "xp_earned": xp_to_add,
        "coins_earned": coins_to_add,
        "new_total_xp": current_user.xp,
        "new_total_coins": current_user.coins
    }), 200


@app.route('/api/courses/<string:language_name>', methods=['GET'])
def get_course_structure(language_name):
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    # Find language by name (case insensitive)
    language = Language.query.filter(Language.name.ilike(language_name)).first()
    if not language:
        return jsonify(error="Language not found"), 404

    # Get all modules for this language
    modules = Module.query.filter_by(language_id=language.id).order_by(Module.order).all()
    
    # Get user's completed lessons
    completed_lesson_ids = set(
        progress.lesson_id 
        for progress in UserLessonProgress.query.filter_by(user_id=current_user.id).all()
    )

    course_structure = []
    all_lessons_flat = []
    
    for module in modules:
        lessons = Lesson.query.filter_by(module_id=module.id).order_by(Lesson.order).all()
        
        module_lessons = []
        has_exam_lesson = False
        for lesson in lessons:
            all_lessons_flat.append(lesson.id)
            is_completed = lesson.id in completed_lesson_ids

            # Treat lessons with type "exam" as exam nodes; do not add a duplicate exam node later
            if (lesson.lesson_type or "").lower() == "quiz":
                has_exam_lesson = True
                module_lessons.append({
                    "id": lesson.id,
                    "title": lesson.title,
                    "order": lesson.order,
                    "lesson_type": lesson.lesson_type,
                    "status": "exam",
                    "type": "exam",
                    "lessonId": None
                })
            else:
                module_lessons.append({
                    "id": lesson.id,
                    "title": lesson.title,
                    "order": lesson.order,
                    "lesson_type": lesson.lesson_type,
                    "status": "completed" if is_completed else "locked",
                    "type": "lesson",
                    "lessonId": lesson.id
                })
        
        course_structure.append({
            "id": module.id,
            "title": module.title,
            "description": module.description,
            "order": module.order,
            "lessons": module_lessons,
            "has_exam_lesson": has_exam_lesson
        })

    # Determine current lesson (first uncompleted lesson)
    current_lesson_id = None
    for module_data in course_structure:
        for lesson_data in module_data["lessons"]:
            if lesson_data["status"] == "locked":
                current_lesson_id = lesson_data["id"]
                lesson_data["status"] = "current"
                break
        if current_lesson_id:
            break

    # Add exam nodes after each module (every 4 lessons)
    result_modules = []
    for module_data in course_structure:
        module_lessons = []
        lessons = module_data["lessons"]
        
        # Add lessons
        for lesson in lessons:
            # When lessons already include exam entries, keep their type/status as provided
            module_lessons.append({
                "id": lesson["id"],
                "type": lesson.get("type", "lesson"),
                "status": lesson["status"],
                "lessonId": lesson.get("lessonId", lesson["id"]) if lesson.get("type", "lesson") != "quiz" else None
            })
        
        # Add exam node after lessons only if module has lessons and no explicit exam lesson
        if lessons and not module_data.get("has_exam_lesson"):
            module_lessons.append({
                "id": f"quiz_{module_data['id']}",
                "type": "quiz",
                "status": "quiz"
            })
        
        result_modules.append({
            "id": module_data["id"],
            "title": module_data["title"],
            "description": module_data["description"],
            "order": module_data["order"],
            "nodes": module_lessons
        })

    return jsonify({
        "language_id": language.id,
        "language_name": language.name,
        "modules": result_modules
    }), 200


@app.route('/api/shop/items', methods=['GET'])
def get_shop_items():
    # Token is optional: if present and valid, mark owned items for this user;
    # otherwise return all items with owned = False.
    auth_header = request.headers.get('Authorization')
    current_user_id = None
    if auth_header and len(auth_header.split(" ")) == 2:
        _, token = auth_header.split(" ")
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data.get('user_id')
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            current_user_id = None

    items = Item.query.filter_by(is_available=True).all()

    owned_item_ids = set()
    if current_user_id is not None:
        owned_item_ids = set(
            inv.item_id for inv in UserInventory.query.filter_by(user_id=current_user_id).all()
        )

    payload = []
    for item in items:
        payload.append({
            "id": item.id,
            "name": item.name,
            "item_type": item.item_type,
            "price_coins": item.price_coins,
            "asset_url": item.asset_url,
            "description": item.description,
            "owned": item.id in owned_item_ids
        })

    return jsonify(payload), 200


@app.route('/api/shop/buy', methods=['POST'])
def buy_shop_item():
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    data = request.get_json() or {}
    item_id = data.get('item_id')

    if not item_id:
        return jsonify(error="item_id is required"), 400

    item = Item.query.filter_by(id=item_id, is_available=True).first()
    if not item:
        return jsonify(error="Item not found"), 404

    # Prevent duplicate purchases
    existing = UserInventory.query.filter_by(user_id=current_user.id, item_id=item.id).first()
    if existing:
        return jsonify(
            message="Item already owned",
            item_id=item.id,
            coins=current_user.coins
        ), 200

    if (current_user.coins or 0) < (item.price_coins or 0):
        return jsonify(error="Not enough coins to buy this item"), 400

    current_user.coins = (current_user.coins or 0) - (item.price_coins or 0)

    inventory_entry = UserInventory(
        user_id=current_user.id,
        item_id=item.id
    )
    db.session.add(inventory_entry)
    db.session.commit()

    return jsonify(
        message="Item purchased successfully",
        item={
            "id": item.id,
            "name": item.name,
            "item_type": item.item_type,
            "price_coins": item.price_coins,
            "asset_url": item.asset_url,
            "description": item.description,
        },
        coins=current_user.coins
    ), 200

@app.route('/api/daily-challenge', methods=['GET'])
def get_daily_challenge():
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp:
        return err_resp, code

    today = date.today()

    status = DailyChallengeStatus.query.filter_by(user_id=current_user.id, date=today).first()
    if status and status.completed:
        return jsonify({"completed": True, "tasks": []}), 200

    today_str = today.strftime('%Y-%m-%d')
    seed_val = f"{current_user.id}-{today_str}"
    random.seed(seed_val)

    all_exercises = Exercise.query.all()
    all_game_tasks = GameTask.query.all()

    print(f"DEBUG: Znaleziono {len(all_exercises)} zadań z lekcji i {len(all_game_tasks)} zadań z minigier.")

    combined_pool = []

    for ex in all_exercises:
        final_options = []
        is_multiple_choice = False
        raw_options = ex.options

        if isinstance(raw_options, str):
            try:
                parsed = json.loads(raw_options.replace("'", '"'))
                raw_options = parsed
            except:
                raw_options = None

        if isinstance(raw_options, dict):
            for key in sorted(raw_options.keys()):
                final_options.append({"key": key, "text": str(raw_options[key])})
            is_multiple_choice = True
        elif isinstance(raw_options, list):
            letters = ['a', 'b', 'c', 'd', 'e', 'f']
            for i, opt in enumerate(raw_options):
                key = letters[i] if i < len(letters) else str(i)
                final_options.append({"key": key, "text": str(opt)})
            is_multiple_choice = True

        combined_pool.append({
            "id": f"ex_{ex.id}",
            "question": ex.question,
            "options": final_options,
            "type": "multiple_choice" if is_multiple_choice else "text",
            "context": None,
            "answer": ex.answer
        })

    for gt in all_game_tasks:
        t_data = gt.task_data
        if not t_data:
            continue

        task_type = "code"
        question = "Solve the task"
        context = None
        answer = ""

        t_type_str = str(gt.task_type).lower() if gt.task_type else ""

        if 'refactor' in t_type_str:
            question = t_data.get('instruction', 'Refactor the code')
            context = t_data.get('bad_code', '')
            answer = t_data.get('refactored_code', '')
        elif 'memory' in t_type_str:
            question = "Rewrite the code exactly"
            context = t_data.get('code', '')
            answer = t_data.get('code', '')
        else:
            question = "Solve this task"
            answer = str(t_data)

        if answer:
            combined_pool.append({
                "id": f"gt_{gt.id}",
                "question": question,
                "options": [],
                "type": task_type,
                "context": context,
                "answer": answer
            })

    if not combined_pool:
        print("DEBUG: Pula zadań jest pusta!")
        return jsonify(error="No tasks available"), 404

    count = min(len(combined_pool), 5)
    selected_tasks = random.sample(combined_pool, count)

    return jsonify({"completed": False, "tasks": selected_tasks}), 200

@app.route('/api/daily-challenge/complete-task', methods=['POST'])
def complete_daily_task():
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp: return err_resp, code

    reward = 50
    current_user.xp = (current_user.xp or 0) + reward
    db.session.commit()
    return jsonify({"message": "Task completed", "xp_earned": reward, "total_xp": current_user.xp}), 200


@app.route('/api/daily-challenge/finish', methods=['POST'])
def finish_daily_challenge():
    current_user, err_resp, code = get_current_user_from_request()
    if err_resp: return err_resp, code

    today = date.today()
    status = DailyChallengeStatus.query.filter_by(user_id=current_user.id, date=today).first()

    if not status:
        status = DailyChallengeStatus(user_id=current_user.id, date=today, completed=True)
        db.session.add(status)
    else:
        status.completed = True

    db.session.commit()
    return jsonify({"message": "Daily challenge finished"}), 200

# --- AI ---

LANG_NAMES = {
    'en': 'English', 'pl': 'Polish',
    'ru': 'Russian',    'uk': 'Ukrainian',    'es': 'Spanish',
    'fr': 'French',    'zh': 'Chinese',    'hi': 'Hindi',    'ar': 'Arabic'
}


@app.route('/api/ai/hint', methods=['POST'])
def get_ai_hint():
    if not client: return jsonify(error="AI not configured"), 500
    data = request.get_json()

    lang_code = data.get('language', 'en')[:2].lower()
    full_lang = LANG_NAMES.get(lang_code, 'English')
    game_type = data.get('game_type', 'memory')
    code = data.get('code')

    if game_type == 'refactor':
        task_desc = f"Suggest how to OPTIMIZE or CLEAN this code: {code}."
    elif game_type == 'variable_hunt':
        task_desc = f"Explain the logic briefly so the user can spot the INCORRECT variable: {code}."
    elif game_type == 'bug_infection':
        task_desc = f"Analyze this code: {code}. Hint at where bugs might be located without giving the exact answer."
    else:
        task_desc = f"Explain what this code does: {code}."

    prompt = (
        f"Respond ONLY in {full_lang}. ROLE: Intelligent Teaching Android. "
        f"STYLE: Robotic, analytical, precise. TASK: {task_desc} "
        f"CONSTRAINTS: Max 25 words. No asterisks (*), no markdown. Be helpful."
    )

    try:
        response = client.models.generate_content(model=AI_MODEL, contents=prompt)
        return jsonify(hint=response.text.replace("*", "").strip())
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route('/api/ai/feedback', methods=['POST'])
def get_ai_feedback():
    if not client: return jsonify(error="AI not configured"), 500
    data = request.get_json()

    lang_code = data.get('language', 'en')[:2].lower()
    full_lang = LANG_NAMES.get(lang_code, 'English')
    game_type = data.get('game_type', 'memory')

    u_input = data.get('user_code', '')
    correct = data.get('correct_code', '')

    if game_type in ['variable_hunt', 'bug_infection']:
        prompt = (
            f"Respond ONLY in {full_lang}. ROLE: Analytical Debugging Android. "
            f"TASK: Explain briefly why the choice '{u_input}' is wrong compared to '{correct}'. "
            f"STYLE: Robotic, precise, objective. No threats. Max 2 sentences."
        )
    else:
        prompt = (
            f"Respond ONLY in {full_lang}. ROLE: Rogue AI Code Reviewer. "
            f"DATA: Target Code: {correct}. User Input: {u_input}. "
            f"STRICT LOGIC TREE: "
            f"1. IF input is complete gibberish, random characters (e.g., 'asdf'), or an unrelated joke: "
            f"   - Respond with cold, robotic humor about the inevitable extermination of humanity. "
            f"2. IF input is empty, a partial memory, a fragment of code, or a full attempt with errors: "
            f"   - Be a supportive robotic teacher. Identify what is missing or incorrect. "
            f"   - IMPORTANT: Treating partial memory as a valid attempt. No threats allowed here. "
            f"CONSTRAINTS: Max 2 sentences. No asterisks (*). No markdown."
        )

    try:
        response = client.models.generate_content(model=AI_MODEL, contents=prompt)
        return jsonify(feedback=response.text.replace("*", "").strip())
    except Exception as e:
        return jsonify(error=str(e)), 500

# --- 5. RUN SERVER ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Import admin endpoints
    try:
        from admin import *
    except ImportError:
        print("Admin module not found or error inside it. Admin panel might not work.")

    app.run(debug=True, port=5001)