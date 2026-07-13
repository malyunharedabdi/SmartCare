from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.appointment import Appointment
from models.doctor import Doctor
from app import db
from datetime import datetime

appointment_bp = Blueprint('appointments', __name__)

@appointment_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    try:
        claims = get_jwt()
        patient_id = request.args.get('patient_id')
        doctor_id = request.args.get('doctor_id')
        status = request.args.get('status')

        query = Appointment.query

        # If patient role, only show their own appointments
        if claims.get('role') == 'patient':
            query = query.filter_by(patient_id=claims.get('user_id'))

        if patient_id:
            query = query.filter_by(patient_id=patient_id)
        if doctor_id:
            query = query.filter_by(doctor_id=doctor_id)
        if status:
            query = query.filter_by(status=status)

        appointments = query.order_by(Appointment.date.desc()).all()
        return jsonify([a.to_dict() for a in appointments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointment_bp.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    try:
        data = request.get_json()
        claims = get_jwt()

        doctor = Doctor.query.get(data['doctor_id'])
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404

        appointment_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        appointment_time = datetime.strptime(data['time'], '%H:%M').time()

        existing = Appointment.query.filter_by(
            doctor_id=data['doctor_id'],
            date=appointment_date,
            time=appointment_time,
            status='scheduled'
        ).first()
        if existing:
            return jsonify({'error': 'This time slot is already booked'}), 400

        appointment = Appointment(
            patient_id=claims.get('user_id') if claims.get('role') == 'patient' else data.get('patient_id'),
            doctor_id=data['doctor_id'],
            date=appointment_date,
            time=appointment_time,
            symptoms=data.get('symptoms'),
            notes=data.get('notes'),
            status='scheduled'
        )
        db.session.add(appointment)
        db.session.commit()

        return jsonify({'message': 'Appointment booked', 'appointment': appointment.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointment_bp.route('/appointments/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_status(id):
    try:
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ['scheduled', 'completed', 'cancelled']:
            return jsonify({'error': 'Invalid status'}), 400

        appointment.status = new_status
        db.session.commit()

        return jsonify({'message': 'Status updated', 'appointment': appointment.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointment_bp.route('/appointments/<int:id>/reschedule', methods=['PUT'])
@jwt_required()
def reschedule(id):
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()

        new_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        new_time = datetime.strptime(data['time'], '%H:%M').time()

        existing = Appointment.query.filter_by(
            doctor_id=appointment.doctor_id,
            date=new_date,
            time=new_time,
            status='scheduled'
        ).first()
        if existing and existing.id != id:
            return jsonify({'error': 'This time slot is already booked'}), 400

        appointment.date = new_date
        appointment.time = new_time
        appointment.status = 'scheduled'
        db.session.commit()

        return jsonify({'message': 'Appointment rescheduled', 'appointment': appointment.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointment_bp.route('/appointments/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(id):
    try:
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        appointment = Appointment.query.get_or_404(id)
        db.session.delete(appointment)
        db.session.commit()

        return jsonify({'message': 'Appointment deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
