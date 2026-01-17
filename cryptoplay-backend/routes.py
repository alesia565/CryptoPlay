from flask import Blueprint, request, jsonify, session
from models import User
from db import db

routes = Blueprint('routes', __name__)

@routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Usuario ya existe"}), 409

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"mensaje": "Usuario creado"}), 201


@routes.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return jsonify({"mensaje": "Usa POST para login"}), 200

    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()

    if not user or not user.check_password(data.get('password')):
        return jsonify({"error": "Credenciales inválidas"}), 401

    session['email'] = user.email
    return jsonify({"mensaje": "Login correcto", "cpx": user.cpx_balance})