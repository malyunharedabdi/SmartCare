from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.doctor import Doctor
from app import db

doctor_bp = Blueprint('doctors', __name__)

@doctor_bp.route('/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    """Get all doctors with optional search"""
    try:
        search = request.args.get('search', '')
        if search:
            doctors = Doctor.query.filter(
                db.or_(
                    Doctor.name.ilike(f'%{search}%'),
                    Doctor.specialization.ilike(f'%{search}%'),
                    Doctor.department.ilike(f'%{search}%')
                )
            ).all()
        else:
            doctors = Doctor.query.all()
        return jsonify([d.to_dict() for d in doctors]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@doctor_bp.route('/doctors/<int:id>', methods=['GET'])
@jwt_required()
def get_doctor(id):
    """Get a single doctor"""
    try:
        doctor = Doctor.query.get_or_404(id)
        return jsonify(doctor.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@doctor_bp.route('/doctors', methods=['POST'])
@jwt_required()
def create_doctor():
    """Create a new doctor"""
    try:
        data = request.get_json()
        doctor = Doctor(
            name=data['name'],
            specialization=data['specialization'],
            email=data['email'],
            phone=data['phone'],
            department=data.get('department'),
            qualification=data.get('qualification'),
            experience=data.get('experience'),
            consultation_fee=data.get('consultation_fee', 0.0),
            available_days=data.get('available_days'),
            timings=data.get('timings'),
            max_patients_per_day=data.get('max_patients_per_day', 20)
        )
        db.session.add(doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor created', 'doctor': doctor.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@doctor_bp.route('/doctors/<int:id>', methods=['PUT'])
@jwt_required()
def update_doctor(id):
    """Update doctor details"""
    try:
        doctor = Doctor.query.get_or_404(id)
        data = request.get_json()
        doctor.name = data.get('name', doctor.name)
        doctor.specialization = data.get('specialization', doctor.specialization)
        doctor.email = data.get('email', doctor.email)
        doctor.phone = data.get('phone', doctor.phone)
        doctor.department = data.get('department', doctor.department)
        doctor.qualification = data.get('qualification', doctor.qualification)
        doctor.experience = data.get('experience', doctor.experience)
        doctor.consultation_fee = data.get('consultation_fee', doctor.consultation_fee)
        doctor.available_days = data.get('available_days', doctor.available_days)
        doctor.timings = data.get('timings', doctor.timings)
        doctor.max_patients_per_day = data.get('max_patients_per_day', doctor.max_patients_per_day)
        doctor.status = data.get('status', doctor.status)
        db.session.commit()
        return jsonify({'message': 'Doctor updated', 'doctor': doctor.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@doctor_bp.route('/doctors/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_doctor(id):
    """Delete a doctor"""
    try:
        doctor = Doctor.query.get_or_404(id)
        db.session.delete(doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500