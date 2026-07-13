from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from routes.auth_routes import auth_bp
    from routes.patient_routes import patient_bp
    from routes.doctor_routes import doctor_bp
    from routes.appointment_routes import appointment_bp
    from routes.billing_routes import billing_bp

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(patient_bp, url_prefix='/api')
    app.register_blueprint(doctor_bp, url_prefix='/api')
    app.register_blueprint(appointment_bp, url_prefix='/api')
    app.register_blueprint(billing_bp, url_prefix='/api')

    with app.app_context():
        # make sure your models are imported here so create_all() sees them
        from models import patient, doctor, appointment, billing  # adjust to your actual model module names
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)