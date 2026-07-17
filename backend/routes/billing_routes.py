from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from models.billing import Billing
from models.patient import Patient
from models.user import User
from app import db
from datetime import datetime
import io
import random
import string
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

billing_bp = Blueprint('billing', __name__)

def _current_user():
    """Look up the logged-in User row from the JWT identity (the user id)."""
    return User.query.get(int(get_jwt_identity()))

@billing_bp.route('/bills', methods=['GET'])
@jwt_required()
def get_bills():
    try:
        claims = get_jwt()
        patient_id = request.args.get('patient_id')
        status = request.args.get('status')

        query = Billing.query

        if claims.get('role') == 'patient':
            user = _current_user()
            if not user or not user.patient:
                return jsonify([]), 200
            query = query.filter_by(patient_id=user.patient.id)

        if patient_id:
            query = query.filter_by(patient_id=patient_id)
        if status:
            query = query.filter_by(payment_status=status)

        bills = query.order_by(Billing.bill_date.desc()).all()
        return jsonify([b.to_dict() for b in bills]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@billing_bp.route('/bills', methods=['POST'])
@jwt_required()
def create_bill():
    try:
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json()

        invoice_number = f"INV-{datetime.now().strftime('%Y%m%d')}-{Billing.query.count() + 1:04d}"

        amount = float(data['amount'])
        tax_rate = 0.18
        tax_amount = amount * tax_rate
        discount = float(data.get('discount', 0))
        total_amount = amount + tax_amount - discount

        bill = Billing(
            patient_id=data['patient_id'],
            appointment_id=data.get('appointment_id'),
            amount=amount,
            payment_status='pending',
            payment_method=data.get('payment_method'),
            description=data.get('description'),
            invoice_number=invoice_number,
            tax_amount=tax_amount,
            discount=discount,
            total_amount=total_amount
        )

        db.session.add(bill)
        db.session.commit()

        return jsonify({'message': 'Bill generated', 'bill': bill.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def _generate_transaction_id(method):
    """Build a fake but plausible-looking transaction reference per payment channel."""
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    prefixes = {
        'mpesa': ''.join(random.choices(string.ascii_uppercase, k=2)) + ''.join(random.choices(string.digits, k=6)),
        'card': f'CARD-{suffix}',
        'paypal': f'PP-{suffix}',
        'bank_transfer': f'BNK-{suffix}',
        'cash': f'CSH-{suffix}',
    }
    return prefixes.get(method, f'TXN-{suffix}')


@billing_bp.route('/bills/<int:id>/pay', methods=['PUT'])
@jwt_required()
def process_payment(id):
    try:
        claims = get_jwt()
        bill = Billing.query.get_or_404(id)
        data = request.get_json() or {}

        # Patients may only pay their own bills; admins can record payment on anyone's bill.
        if claims.get('role') == 'patient':
            user = _current_user()
            if not user or not user.patient or bill.patient_id != user.patient.id:
                return jsonify({'error': 'Unauthorized'}), 403

        if bill.payment_status == 'paid':
            return jsonify({'error': 'This bill has already been paid'}), 400

        method = data.get('payment_method', 'cash')
        payer_reference = data.get('payer_reference')

        # Simulated gateway: card/mpesa/paypal have a small realistic chance of
        # a "declined" outcome so the flow isn't a rubber-stamp success every time.
        if method in ('card', 'mpesa', 'paypal') and not data.get('force_success'):
            if random.random() < 0.08:
                return jsonify({
                    'error': 'Payment declined by the simulated gateway. Please try again.',
                    'simulated': True
                }), 402

        bill.payment_status = 'paid'
        bill.payment_method = method
        bill.payment_date = datetime.utcnow()
        bill.transaction_id = _generate_transaction_id(method)
        if payer_reference:
            bill.payer_reference = payer_reference

        db.session.commit()

        return jsonify({'message': 'Payment processed', 'bill': bill.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@billing_bp.route('/bills/<int:id>/receipt', methods=['GET'])
@jwt_required()
def generate_receipt(id):
    try:
        bill = Billing.query.get_or_404(id)
        patient = Patient.query.get(bill.patient_id)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()

        title = Paragraph(f"Payment Receipt - {bill.invoice_number}", styles['Title'])
        elements.append(title)

        data = [
            ['Patient Name:', patient.name if patient else 'N/A'],
            ['Invoice Number:', bill.invoice_number],
            ['Bill Date:', bill.bill_date.strftime('%Y-%m-%d %H:%M') if bill.bill_date else 'N/A'],
            ['Payment Date:', bill.payment_date.strftime('%Y-%m-%d %H:%M') if bill.payment_date else 'N/A'],
            ['Payment Method:', bill.payment_method or 'N/A'],
            ['Amount:', f"${bill.amount:.2f}"],
            ['Tax (18%):', f"${bill.tax_amount:.2f}"],
            ['Discount:', f"${bill.discount:.2f}"],
            ['Total Amount:', f"${bill.total_amount:.2f}"],
            ['Status:', bill.payment_status.upper()]
        ]

        table = Table(data, colWidths=[150, 300])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        elements.append(table)
        doc.build(elements)
        buffer.seek(0)

        response = make_response(buffer.getvalue())
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'attachment; filename=receipt_{bill.invoice_number}.pdf'
        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 500
