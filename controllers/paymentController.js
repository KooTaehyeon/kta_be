import Payment from '../models/Payment';
import confirmPayment from '../services/paymentsService';

async function confirmPaymentController(req, res, next) {
  const confirmResponse = await confirmPayment(req.body);

  return res.json({ data: confirmResponse });
}

async function savePaymentInfoController(req, res, next) {
  try {
    const { orderId, userId, productId, orderName, amount, paymentMethod, approvedAt } = req.body;

    if (!orderId || !userId || !productId || !orderName || !paymentMethod || !approvedAt) {
      return res.status(400).json({ error: "필수 필드가 누락되었습니다." });
    }

    const newPayment = await Payment.create({
      order_id: orderId,
      user_id: userId,
      product_id: productId,
      order_name: orderName,
      amount,
      payment_method: paymentMethod,
      approved_at: approvedAt,
    });

    return res.json({ data: newPayment });
  } catch (error) {
    next(error);
  }
}

async function getPaymentsController(req, res, next) {
  try {
    const payments = await Payment.findAll();
    return res.json({ data: payments });
  } catch (error) {
    next(error);
  }
}

export { confirmPaymentController, savePaymentInfoController, getPaymentsController };