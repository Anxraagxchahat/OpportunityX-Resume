from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.models import Payment, PaymentHistory
from app.repositories.base_repository import BaseRepository

class PaymentRepository(BaseRepository[Payment]):
    def __init__(self, db: Session):
        super().__init__(Payment, db)

    def get_by_order_id(self, order_id: str) -> Optional[Payment]:
        return self.db.query(Payment).filter(Payment.order_id == order_id).first()

    def create_order(
        self,
        order_id: str,
        user_id: str,
        pack_id: str,
        amount: float,
        credits: int,
        cf_order_id: Optional[str] = None,
        payment_session_id: Optional[str] = None
    ) -> Payment:
        payment = Payment(
            order_id=order_id,
            user_id=user_id,
            pack_id=pack_id,
            amount=amount,
            credits=credits,
            status="PENDING",
            cf_order_id=cf_order_id,
            payment_session_id=payment_session_id
        )
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def update_status(self, order_id: str, status: str, cf_payment_id: Optional[str] = None) -> Optional[Payment]:
        payment = self.get_by_order_id(order_id)
        if payment:
            payment.status = status
            history = PaymentHistory(
                order_id=order_id,
                user_id=payment.user_id,
                amount=payment.amount,
                provider="cashfree",
                cf_payment_id=cf_payment_id,
                status=status
            )
            self.db.add(history)
            self.db.commit()
            self.db.refresh(payment)
        return payment

    def get_user_payments(self, user_id: str) -> List[Payment]:
        return (
            self.db.query(Payment)
            .filter(Payment.user_id == user_id)
            .order_by(Payment.created_at.desc())
            .all()
        )
