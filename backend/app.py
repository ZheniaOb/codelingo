import os
from datetime import datetime, timedelta, timezone # Added timezone
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
CORS(app) # Allow requests from the React app

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

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

print("User model defined.")

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
        'exp': datetime.now(timezone.utc) + timedelta(hours=24) # Fixed DeprecationWarning
    }, app.config['SECRET_KEY'], algorithm="HS256")

    print(f"Login successful: {email}, Role: {user.role}")
    return jsonify(access_token=token, role=user.role), 200

# --- 4. RUN ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Creates tables if they don't exist
    
    # Run the Flask server
    app.run(debug=True, port=5001)
