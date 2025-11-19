from app import app, db, User, Language, Module, Lesson, Exercise, Game, GameTask
from flask import request, jsonify
import jwt

# --- Helper: JWT Auth ---
def get_jwt_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or len(auth_header.split(" ")) != 2:
        return None, jsonify(error="Authentication token is missing"), 401
    token = auth_header.split(" ")[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        current_user = User.query.filter_by(id=data['user_id']).first()
        if not current_user or current_user.role != 'admin':
            return None, jsonify(error="Access denied: admin only"), 403
        return current_user, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify(error="Token has expired"), 401
    except jwt.InvalidTokenError:
        return None, jsonify(error="Invalid token"), 401


# --- USERS MANAGEMENT ---
@app.route('/api/users', methods=['GET'])
def get_all_users():
    current_user, err_resp, code = get_jwt_user()
    if err_resp:
        return err_resp, code

    users = User.query.all()
    return jsonify(users=[{"id": u.id, "email": u.email, "role": u.role} for u in users]), 200


# --- COURSES MANAGEMENT ---
@app.route('/api/languages', methods=['GET'])
def get_languages():
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    langs = Language.query.all()
    return jsonify([{"id": l.id, "name": l.name, "description": l.description, "image_url": l.image_url} for l in langs]), 200

@app.route('/api/modules/<int:language_id>', methods=['GET'])
def get_modules(language_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    modules = Module.query.filter_by(language_id=language_id).order_by(Module.order).all()
    return jsonify([{"id": m.id, "title": m.title, "description": m.description, "order": m.order} for m in modules]), 200

@app.route('/api/lessons/<int:module_id>', methods=['GET'])
def get_lessons(module_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    lessons = Lesson.query.filter_by(module_id=module_id).order_by(Lesson.order).all()
    return jsonify([{"id": l.id, "title": l.title, "lesson_type": l.lesson_type, "content": l.content} for l in lessons]), 200

@app.route('/api/exercises/<int:lesson_id>', methods=['GET'])
def get_exercises(lesson_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    exercises = Exercise.query.filter_by(lesson_id=lesson_id).all()
    return jsonify([{
        "id": e.id,
        "exercise_type": e.exercise_type,
        "question": e.question,
        "options": e.options,
        "answer": e.answer
    } for e in exercises]), 200

# --- EXERCISES CRUD ---
@app.route('/api/exercises', methods=['POST'])
def create_exercise():
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    data = request.get_json()
    lesson_id = data.get('lesson_id')
    question = data.get('question')
    options = data.get('options')
    answer = data.get('answer')
    exercise_type = data.get('exercise_type', 'multiple_choice')
    if not lesson_id or not question or not answer or options is None:
        return jsonify(error="Missing required fields"), 400
    exercise = Exercise(
        lesson_id=lesson_id,
        question=question,
        options=options,
        answer=answer,
        exercise_type=exercise_type
    )
    db.session.add(exercise)
    db.session.commit()
    return jsonify({
        "id": exercise.id,
        "lesson_id": exercise.lesson_id,
        "question": exercise.question,
        "options": exercise.options,
        "answer": exercise.answer,
        "exercise_type": exercise.exercise_type
    }), 201

@app.route('/api/exercises/<int:exercise_id>', methods=['PUT'])
def edit_exercise(exercise_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    exercise = Exercise.query.get(exercise_id)
    if not exercise: return jsonify(error="Exercise not found"), 404
    data = request.get_json()
    exercise.question = data.get('question', exercise.question)
    exercise.options = data.get('options', exercise.options)
    exercise.answer = data.get('answer', exercise.answer)
    exercise.exercise_type = data.get('exercise_type', exercise.exercise_type)
    db.session.commit()
    return jsonify({"message": "Exercise updated"}), 200

@app.route('/api/exercises/<int:exercise_id>', methods=['DELETE'])
def delete_exercise(exercise_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    exercise = Exercise.query.get(exercise_id)
    if not exercise: return jsonify(error="Exercise not found"), 404
    db.session.delete(exercise)
    db.session.commit()
    return jsonify({"message": "Exercise deleted"}), 200

# --- GAMES MANAGEMENT ---
@app.route('/api/admin/games', methods=['GET'])
def get_all_games():
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    games = Game.query.all()
    return jsonify([{
        "id": g.id,
        "game_id": g.game_id,
        "title": g.title,
        "description": g.description,
        "difficulty": g.difficulty,
        "xp_reward": g.xp_reward
    } for g in games]), 200

@app.route('/api/admin/games', methods=['POST'])
def create_game():
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    data = request.get_json()
    game_id = data.get('game_id')
    title = data.get('title')
    description = data.get('description', '')
    difficulty = data.get('difficulty', 'Easy')
    xp_reward = data.get('xp_reward', 50)
    if not game_id or not title:
        return jsonify(error="Missing required fields"), 400
    if Game.query.filter_by(game_id=game_id).first():
        return jsonify(error="Game with this ID already exists"), 409
    game = Game(
        game_id=game_id,
        title=title,
        description=description,
        difficulty=difficulty,
        xp_reward=xp_reward
    )
    db.session.add(game)
    db.session.commit()
    return jsonify({
        "id": game.id,
        "game_id": game.game_id,
        "title": game.title,
        "description": game.description,
        "difficulty": game.difficulty,
        "xp_reward": game.xp_reward
    }), 201

@app.route('/api/admin/games/<int:game_id>/tasks', methods=['GET'])
def get_game_tasks_admin(game_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    game = Game.query.get(game_id)
    if not game: return jsonify(error="Game not found"), 404
    tasks = GameTask.query.filter_by(game_id=game_id).order_by(GameTask.order).all()
    return jsonify([{
        "id": t.id,
        "game_id": t.game_id,
        "task_type": t.task_type,
        "language": t.language,
        "task_data": t.task_data,
        "order": t.order,
        "xp_reward": t.xp_reward
    } for t in tasks]), 200

@app.route('/api/admin/games/<int:game_id>/tasks', methods=['POST'])
def create_game_task(game_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    game = Game.query.get(game_id)
    if not game: return jsonify(error="Game not found"), 404
    data = request.get_json()
    task_type = data.get('task_type')
    task_data = data.get('task_data')
    language = data.get('language', 'javascript')
    order = data.get('order', 0)
    xp_reward = data.get('xp_reward', 50)
    if not task_type or not task_data:
        return jsonify(error="Missing required fields"), 400
    task = GameTask(
        game_id=game_id,
        task_type=task_type,
        language=language,
        task_data=task_data,
        order=order,
        xp_reward=xp_reward
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({
        "id": task.id,
        "game_id": task.game_id,
        "task_type": task.task_type,
        "language": task.language,
        "task_data": task.task_data,
        "order": task.order,
        "xp_reward": task.xp_reward
    }), 201

@app.route('/api/admin/games/<int:game_id>/tasks/<int:task_id>', methods=['PUT'])
def update_game_task(game_id, task_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    task = GameTask.query.filter_by(id=task_id, game_id=game_id).first()
    if not task: return jsonify(error="Task not found"), 404
    data = request.get_json()
    if 'task_type' in data: task.task_type = data['task_type']
    if 'language' in data: task.language = data['language']
    if 'task_data' in data: task.task_data = data['task_data']
    if 'order' in data: task.order = data['order']
    if 'xp_reward' in data: task.xp_reward = data['xp_reward']
    db.session.commit()
    return jsonify({"message": "Task updated"}), 200

@app.route('/api/admin/games/<int:game_id>/tasks/<int:task_id>', methods=['DELETE'])
def delete_game_task(game_id, task_id):
    current_user, err_resp, code = get_jwt_user()
    if err_resp: return err_resp, code
    task = GameTask.query.filter_by(id=task_id, game_id=game_id).first()
    if not task: return jsonify(error="Task not found"), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200
