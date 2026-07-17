from app import db
from datetime import datetime

class Billing(db.Model):
    __tablename__ = 'billing'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))
    amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(20), default='pending')
    payment_method = db.Column(db.String(50))
    payment_date = db.Column(db.DateTime)
    bill_date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text)
    invoice_number = db.Column(db.String(50), unique=True)
    tax_amount = db.Column(db.Float, default=0.0)
    discount = db.Column(db.Float, default=0.0)
    total_amount = db.Column(db.Float, nullable=False)
    transaction_id = db.Column(db.String(50))
    payer_reference = db.Column(db.String(120))

    appointment = db.relationship('Appointment', backref='bills')

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
            'total_amount': self.total_amount,
            'transaction_id': self.transaction_id,
            'payer_reference': self.payer_reference
        }
