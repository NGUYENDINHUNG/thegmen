import sendEmail from "#util/email.util.js";
import {
  orderConfirmationEmail,
  orderCancellationEmail,
} from "#constants/emailTemplates.js";

export const sendOrderConfirmationEmail = async (order) => {
  try {
    await sendEmail(
      order.userId.email,
      `Xác nhận đơn hàng #${order.orderCode}`,
      orderConfirmationEmail(order)
    );
    return true;
  } catch (error) {
    console.log("Error sending order confirmation email:", error);
    return false;
  }
};

export const sendOrderCancellationEmail = async (order) => {
  try {
    // Kiểm tra đầy đủ thông tin
    if (!order || !order.userId || !order.userId.email) {
      console.log(
        "Missing order information or user email for cancellation email"
      );
      return false;
    }

    await sendEmail(
      order.userId.email,
      `Thông báo hủy đơn hàng #${order.orderCode}`,
      orderCancellationEmail(order)
    );
    return true;
  } catch (error) {
    console.error("Error sending order cancellation email:", error);
    return false;
  }
};
