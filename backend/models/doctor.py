from app import db
from datetime import datetime

class Doctor(db.Model):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    department = db.Column(db.String(100))
    qualification = db.Column(db.String(200))
    experience = db.Column(db.Integer)
    consultation_fee = db.Column(db.Float, default=0.0)
    available_days = db.Column(db.String(200))
    timings = db.Column(db.String(100))
    max_patients_per_day = db.Column(db.Integer, default=20)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
