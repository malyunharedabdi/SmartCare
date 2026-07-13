from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db          # <-- use the db instance from app.py directly
from models.user import User
from models.patient import Patient
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Check existing username/email
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        # Create user
        user = User(
            username=data['username'],
            email=data['email'],
            role=data.get('role', 'patient')
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.flush()   # get user.id

        patient = None
        if user.role == 'patient':
            patient = Patient(
                user_id=user.id,
                name=data.get('name', data['username']),
                age=data.get('age', 30),
                gender=data.get('gender', 'Other'),
                phone=data.get('phone', ''),
                email=data['email'],
                address=data.get('address', ''),
                medical_history=data.get('medical_history', ''),
                blood_group=data.get('blood_group', ''),
                emergency_contact=data.get('emergency_contact', '')
            )
            db.session.add(patient)

        db.session.commit()

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role, 'username': user.username},
            expires_delta=timedelta(hours=24)
        )

        return jsonify({
            'access_token': access_token,
            'user': user.to_dict(),
            'patient': patient.to_dict() if patient else None
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        if not user.is_active:
            return jsonify({'error': 'Account deactivated'}), 401

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role, 'username': user.username},
            expires_delta=timedelta(hours=24)
        )
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'error': 'User not found'}), 404

        profile = {'user': user.to_dict()}
        if user.patient:
            profile['patient'] = user.patient.to_dict()
        return jsonify(profile), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500