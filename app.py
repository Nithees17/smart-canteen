from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os

app = Flask(__name__, static_folder='.')

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    login_id = data.get('id')
    password = data.get('password')
    role = data.get('role')

    conn = get_db_connection()
    if role == 'admin':
        user = conn.execute('SELECT * FROM users WHERE staff_id = ? AND password = ? AND role = ?',
                           (login_id, password, role)).fetchone()
    else:
        user = conn.execute('SELECT * FROM users WHERE roll_no = ? AND password = ? AND role = ?',
                           (login_id, password, role)).fetchone()
    conn.close()

    if user:
        return jsonify({
            'status': 'success',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'role': user['role']
            }
        })
    return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    roll_no = data.get('rollNo')
    password = data.get('password')

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (name, roll_no, password, role) VALUES (?, ?, ?, ?)',
                       (name, roll_no, password, 'student'))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return jsonify({
            'status': 'success',
            'user': {
                'id': user_id,
                'name': name,
                'role': 'student'
            }
        })
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'status': 'error', 'message': 'Roll number already registered'}), 400

if __name__ == '__main__':
    # Initialize DB if not exists
    if not os.path.exists('database.db'):
        from database import init_db
        init_db()
    
    app.run(debug=True, port=5000)
