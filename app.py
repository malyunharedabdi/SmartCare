from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os

# ---------- App init ----------
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'hospital-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret')

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# ---------- Models ----------
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, patient
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    patient = db.relationship('Patient', backref='user', uselist=False)

    def set_password(self, pw):
        self.password_hash = generate_password_hash(pw)
    def check_password(self, pw):
        return check_password_hash(self.password_hash, pw)
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active
        }

class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, default=30)
    gender = db.Column(db.String(10), default='Other')
    phone = db.Column(db.String(20), default='')
    email = db.Column(db.String(120), unique=True)
    address = db.Column(db.Text, default='')
    medical_history = db.Column(db.Text, default='')
    blood_group = db.Column(db.String(5), default='')
    emergency_contact = db.Column(db.String(20), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    appointments = db.relationship('Appointment', backref='patient', lazy=True)
    bills = db.relationship('Billing', backref='patient', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'medical_history': self.medical_history,
            'blood_group': self.blood_group,
            'emergency_contact': self.emergency_contact
        }

class Doctor(db.Model):
    __tablename__ = 'doctors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    department = db.Column(db.String(100), default='')
    qualification = db.Column(db.String(200), default='')
    experience = db.Column(db.Integer, default=0)
    consultation_fee = db.Column(db.Float, default=0.0)
    available_days = db.Column(db.String(200), default='')
    timings = db.Column(db.String(100), default='')
    max_patients_per_day = db.Column(db.Integer, default=20)
    status = db.Column(db.String(20), default='active')

    appointments = db.relationship('Appointment', backref='doctor', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'specialization': self.specialization,
            'email': self.email,
            'phone': self.phone,
            'department': self.department,
            'qualification': self.qualification,
            'experience': self.experience,
            'consultation_fee': self.consultation_fee,
            'available_days': self.available_days,
            'timings': self.timings,
            'max_patients_per_day': self.max_patients_per_day,
            'status': self.status
        }

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default='scheduled')
    symptoms = db.Column(db.Text, default='')
    diagnosis = db.Column(db.Text, default='')
    prescription = db.Column(db.Text, default='')
    notes = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'patient_name': self.patient.name if self.patient else None,
            'doctor_name': self.doctor.name if self.doctor else None,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time.strftime('%H:%M') if self.time else None,
            'status': self.status,
            'symptoms': self.symptoms,
            'diagnosis': self.diagnosis,
            'prescription': self.prescription,
            'notes': self.notes
        }

class Billing(db.Model):
    __tablename__ = 'billing'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))
    amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(20), default='pending')
    payment_method = db.Column(db.String(50), default='')
    payment_date = db.Column(db.DateTime)
    bill_date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text, default='')
    invoice_number = db.Column(db.String(50), unique=True)
    tax_amount = db.Column(db.Float, default=0.0)
    discount = db.Column(db.Float, default=0.0)
    total_amount = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'patient_name': self.patient.name if self.patient else None,
            'appointment_id': self.appointment_id,
            'amount': self.amount,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'bill_date': self.bill_date.isoformat() if self.bill_date else None,
            'description': self.description,
            'invoice_number': self.invoice_number,
            'tax_amount': self.tax_amount,
            'discount': self.discount,
            'total_amount': self.total_amount
        }

# ---------- Routes ----------
# Helper to get current patient from token (if role is patient)
def get_current_patient():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if user and user.patient:
        return user.patient
    return None

# --- Auth ---
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        role = data.get('role', 'patient')
        user = User(username=data['username'], email=data['email'], role=role)
        user.set_password(data['password'])
        db.session.add(user)
        db.session.flush()

        patient = None
        if role == 'patient':
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

        token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role, 'username': user.username},
            expires_delta=timedelta(hours=24)
        )
        return jsonify({
            'access_token': token,
            'user': user.to_dict(),
            'patient': patient.to_dict() if patient else None
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        if not user.is_active:
            return jsonify({'error': 'Account deactivated'}), 401

        token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role, 'username': user.username},
            expires_delta=timedelta(hours=24)
        )
        return jsonify({'access_token': token, 'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        result = {'user': user.to_dict()}
        if user.patient:
            result['patient'] = user.patient.to_dict()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- Patients ---
@app.route('/api/patients', methods=['GET'])
@jwt_required()
def get_patients():
    search = request.args.get('search', '')
    if search:
        patients = Patient.query.filter(
            Patient.name.contains(search) | Patient.email.contains(search) | Patient.phone.contains(search)
        ).all()
    else:
        patients = Patient.query.all()
    return jsonify([p.to_dict() for p in patients])

@app.route('/api/patients/<int:id>', methods=['GET'])
@jwt_required()
def get_patient(id):
    p = Patient.query.get_or_404(id)
    return jsonify(p.to_dict())

# --- Doctors ---
@app.route('/api/doctors', methods=['GET'])
@jwt_required()
def get_doctors():
    search = request.args.get('search', '')
    if search:
        docs = Doctor.query.filter(Doctor.name.contains(search) | Doctor.specialization.contains(search)).all()
    else:
        docs = Doctor.query.all()
    return jsonify([d.to_dict() for d in docs])

# --- Appointments ---
@app.route('/api/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    # If patient, return only their appointments
    claims = get_jwt_identity()
    user = User.query.get(int(claims))
    if user.role == 'patient' and user.patient:
        appts = Appointment.query.filter_by(patient_id=user.patient.id).order_by(Appointment.date.desc()).all()
    else:
        appts = Appointment.query.order_by(Appointment.date.desc()).all()
    return jsonify([a.to_dict() for a in appts])

@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    claims = get_jwt_identity()
    user = User.query.get(int(claims))
    patient = None
    if user.role == 'patient':
        patient = user.patient
        if not patient:
            return jsonify({'error': 'Patient record not found'}), 400
    else:
        # admin can specify patient_id
        patient = Patient.query.get(data.get('patient_id'))
        if not patient:
            return jsonify({'error': 'Patient not found'}), 400

    doctor = Doctor.query.get(data['doctor_id'])
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404

    appt_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    appt_time = datetime.strptime(data['time'], '%H:%M').time()

    existing = Appointment.query.filter_by(doctor_id=doctor.id, date=appt_date, time=appt_time, status='scheduled').first()
    if existing:
        return jsonify({'error': 'Slot already booked'}), 400

    appt = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        date=appt_date,
        time=appt_time,
        symptoms=data.get('symptoms', ''),
        notes=data.get('notes', ''),
        status='scheduled'
    )
    db.session.add(appt)
    db.session.commit()
    return jsonify({'message': 'Appointment booked', 'appointment': appt.to_dict()}), 201

@app.route('/api/appointments/<int:id>/reschedule', methods=['PUT'])
@jwt_required()
def reschedule(id):
    appt = Appointment.query.get_or_404(id)
    data = request.get_json()
    new_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    new_time = datetime.strptime(data['time'], '%H:%M').time()
    appt.date = new_date
    appt.time = new_time
    appt.status = 'scheduled'
    db.session.commit()
    return jsonify({'message': 'Rescheduled', 'appointment': appt.to_dict()})

@app.route('/api/appointments/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(id):
    appt = Appointment.query.get_or_404(id)
    db.session.delete(appt)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

# ---------- Seed data ----------
def seed():
    with app.app_context():
        db.create_all()
        if User.query.count() > 0:
            return
        # Admin
        admin = User(username='admin', email='admin@smartcare.so', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        # Patient user + patient record
        patient_user = User(username='patient1', email='patient@smartcare.so', role='patient')
        patient_user.set_password('patient123')
        db.session.add(patient_user)
        db.session.flush()
        pt = Patient(user_id=patient_user.id, name='Ayaan Ali', age=30, gender='Female', phone='+252 61 234 5678', email='patient@smartcare.so')
        db.session.add(pt)
        # Doctors
        d1 = Doctor(name='Dr. Ayaan Ali', specialization='Cardiologist', email='d1@example.com', phone='+252 61 111 0001')
        d2 = Doctor(name='Dr. Mohamed Hassan', specialization='Neurologist', email='d2@example.com', phone='+252 61 111 0002')
        d3 = Doctor(name='Dr. Fatima Nur', specialization='Pediatrician', email='d3@example.com', phone='+252 61 111 0003')
        db.session.add_all([d1, d2, d3])
        db.session.commit()

if __name__ == '__main__':
    seed()
    app.run(debug=True, port=5000)
