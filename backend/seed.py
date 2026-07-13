import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from models.user import User
from models.patient import Patient
from models.doctor import Doctor
from models.appointment import Appointment
from models.billing import Billing
from datetime import datetime, timedelta

def seed():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        # ---- USERS ----
        admin = User(username='admin', email='admin@smartcare.so', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)

        patient_user = User(username='patient1', email='patient@smartcare.so', role='patient')
        patient_user.set_password('patient123')
        db.session.add(patient_user)

        db.session.flush()  # get IDs

        # ---- PATIENTS (linked to users) ----
        patients = []
        pt1 = Patient(
            user_id=patient_user.id,
            name='Ayaan Ali',
            age=30,
            gender='Female',
            phone='+252 61 234 5678',
            email='patient@smartcare.so'
        )
        db.session.add(pt1)
        patients.append(pt1)

        # A second patient (not linked to a user for testing)
        pt2 = Patient(
            name='Mohamed Hassan',
            age=45,
            gender='Male',
            phone='+252 61 987 6543',
            email='mohamed@example.com'
        )
        db.session.add(pt2)
        patients.append(pt2)

        db.session.flush()

        # ---- DOCTORS ----
        doctors = []
        doctors_data = [
            {'name':'Dr. Ayaan Ali','specialization':'Cardiologist','email':'ayaan.doctor@example.com','phone':'+252 61 111 0001'},
            {'name':'Dr. Mohamed Hassan','specialization':'Neurologist','email':'mohamed.doctor@example.com','phone':'+252 61 111 0002'},
            {'name':'Dr. Fatima Nur','specialization':'Pediatrician','email':'fatima.doctor@example.com','phone':'+252 61 111 0003'},
        ]
        for d in doctors_data:
            doc = Doctor(**d)
            db.session.add(doc)
            doctors.append(doc)
        db.session.flush()

        # ---- APPOINTMENTS ----
        apt1 = Appointment(
            patient_id=patients[0].id,
            doctor_id=doctors[0].id,
            date=datetime.now().date() + timedelta(days=2),
            time=datetime.strptime('10:00','%H:%M').time(),
            status='scheduled',
            symptoms='Headache'
        )
        db.session.add(apt1)
        db.session.flush()

        # ---- BILLING ----
        bill1 = Billing(
            patient_id=patients[0].id,
            appointment_id=apt1.id,
            amount=150.00,
            total_amount=150.00,
            invoice_number='INV-20250101-0001',
            description='Consultation'
        )
        db.session.add(bill1)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed()