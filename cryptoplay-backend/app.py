from flask import Flask, jsonify
from flask_cors import CORS
from flask_session import Session

from db import db

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = 'clave_secreta_segura'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Suerte09@localhost:5432/cryptoplay'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
Session(app)

from models import User
with app.app_context():
    db.create_all()

from routes import routes
from stripe_routes import stripe_routes

app.register_blueprint(routes)
app.register_blueprint(stripe_routes)

@app.route('/')
def home():
    return jsonify({"mensaje": "Backend CryptoPlay OK"})

if __name__ == '__main__':
    app.run(debug=True)