from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.patient import Patient
from app import db

patient_bp = Blueprint('patients', __name__)

@patient_bp.route('/patients', methods=['GET'])
@jwt_required()
def get_patients():
    """Get all patients with optional search"""
    try:
        search = request.args.get('search', '')
        if search:
            patients = Patient.query.filter(
                db.or_(
                    Patient.name.ilike(f'%{search}%'),
                    Patient.phone.ilike(f'%{search}%'),
                    Patient.email.ilike(f'%{search}%')
                )
            ).all()
        else:
            patients = Patient.query.all()
        return jsonify([p.to_dict() for p in patients]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patient_bp.route('/patients/<int:id>', methods=['GET'])
@jwt_required()
def get_patient(id):
    """Get a single patient"""
    try:
        patient = Patient.query.get_or_404(id)
        return jsonify(patient.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patient_bp.route('/patients', methods=['POST'])
@jwt_required()
def create_patient():
    """Create a new patient"""
    try:
        data = request.get_json()
        patient = Patient(
            name=data['name'],
            age=data['age'],
            gender=data['gender'],
            phone=data.get('phone') or '',
            email=data.get('email') or None,
            address=data.get('address'),
            medical_history=data.get('medical_history'),
            blood_group=data.get('blood_group'),
            emergency_contact=data.get('emergency_contact')
        )
        db.session.add(patient)
        db.session.commit()
        return jsonify({'message': 'Patient created', 'patient': patient.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patient_bp.route('/patients/<int:id>', methods=['PUT'])
@jwt_required()
def update_patient(id):
    """Update patient details"""
    try:
        patient = Patient.query.get_or_404(id)
        data = request.get_json()
        patient.name = data.get('name', patient.name)
        patient.age = data.get('age', patient.age)
        patient.gender = data.get('gender', patient.gender)
        patient.phone = data.get('phone', patient.phone)
        patient.email = (data.get('email') or None) if 'email' in data else patient.email
        patient.address = data.get('address', patient.address)
        patient.medical_history = data.get('medical_history', patient.medical_history)
        patient.blood_group = data.get('blood_group', patient.blood_group)
        patient.emergency_contact = data.get('emergency_contact', patient.emergency_contact)
        db.session.commit()
        return jsonify({'message': 'Patient updated', 'patient': patient.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patient_bp.route('/patients/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_patient(id):
    """Delete a patient"""
    try:
        patient = Patient.query.get_or_404(id)
        db.session.delete(patient)
        db.session.commit()
        return jsonify({'message': 'Patient deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
