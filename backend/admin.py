from app import app, db, User, Language, Module, Lesson, Exercise
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
    if err_resp: return err_resp, code
    users = User.query.all()
    return jsonify([{"id": u.id, "email": u.email, "role": u.role} for u in users]), 200

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
