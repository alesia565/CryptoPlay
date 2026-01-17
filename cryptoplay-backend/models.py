from werkzeug.security import generate_password_hash, check_password_hash
from db import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    cpx_balance = db.Column(db.Float, default=1000)

    bitcoin = db.Column(db.Float, default=0.0)
    ethereum = db.Column(db.Float, default=0.0)
    dogecoin = db.Column(db.Float, default=0.0)
    trumpcoin = db.Column(db.Float, default=0.0)
    cardano = db.Column(db.Float, default=0.0)
    binancecoin = db.Column(db.Float, default=0.0)
    ripple = db.Column(db.Float, default=0.0)
    solana = db.Column(db.Float, default=0.0)
    polkadot = db.Column(db.Float, default=0.0)
    polygon = db.Column(db.Float, default=0.0)
    litecoin = db.Column(db.Float, default=0.0)
    bitcoin_cash = db.Column(db.Float, default=0.0)
    chainlink = db.Column(db.Float, default=0.0)
    stellar = db.Column(db.Float, default=0.0)
    uniswap = db.Column(db.Float, default=0.0)
    avalanche = db.Column(db.Float, default=0.0)
    algorand = db.Column(db.Float, default=0.0)
    vechain = db.Column(db.Float, default=0.0)
    filecoin = db.Column(db.Float, default=0.0)
    tron = db.Column(db.Float, default=0.0)
    eos = db.Column(db.Float, default=0.0)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)