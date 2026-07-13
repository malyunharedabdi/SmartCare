import os

basedir = os.path.abspath(os.path.dirname(__file__))
database_dir = os.path.join(basedir, 'database')
os.makedirs(database_dir, exist_ok=True)   # ensure directory exists

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hospital-management-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(database_dir, 'hospital.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
