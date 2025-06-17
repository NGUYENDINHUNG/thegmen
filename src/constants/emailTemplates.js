export const orderConfirmationEmail = (order) => {
  return `
      <h2>Xác nhận đơn hàng #${order.orderCode}</h2>
      <p>Xin chào ${order.userId.name},</p>
      <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Dưới đây là chi tiết đơn hàng của bạn:</p>
      
      <h3>Thông tin đơn hàng:</h3>
      <ul>
        <li>Mã đơn hàng: ${order.orderCode}</li>
        <li>Ngày đặt: ${order.createdAt.toLocaleString("vi-VN")}</li>
        <li>Địa chỉ giao hàng: ${order.shippingAddress.address}</li>
        <li>Phương thức thanh toán: ${order.paymentMethod}</li>
      </ul>
  
      <h3>Chi tiết sản phẩm:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Sản phẩm</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Giá</th>
        </tr>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">
              ${item.name}
              ${
                item.variant
                  ? `<br/>(${item.variant.color} - ${item.variant.size})`
                  : ""
              }
            </td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.quantity
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.price.toLocaleString(
              "vi-VN"
            )}đ</td>
          </tr>
        `
          )
          .join("")}
      </table>
  
      <h3>Tổng thanh toán:</h3>
      <ul>
        <li>Tổng tiền hàng: ${order.originalTotal?.toLocaleString(
          "vi-VN"
        )}đ</li>
        ${
          order.voucherDiscount > 0
            ? `<li>Giảm giá: ${order.voucherDiscount.toLocaleString(
                "vi-VN"
              )}đ</li>`
            : ""
        }
        <li>Thành tiền: ${order.totalAmount.toLocaleString("vi-VN")}đ</li>
      </ul>
  
      <p>Chúng tôi sẽ sớm xử lý đơn hàng của bạn. Bạn có thể theo dõi trạng thái đơn hàng trong tài khoản của mình.</p>
      <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
      
      <p>Trân trọng,<br/>Đội ngũ cửa hàng</p>
    `;
};

export const orderCancellationEmail = (order) => {
  return `
      <h2>Thông báo hủy đơn hàng #${order.orderCode}</h2>
      <p>Xin chào ${order.userId.name},</p>
      <p>Đơn hàng #${order.orderCode} của bạn đã được hủy thành công.</p>
      
      <h3>Chi tiết đơn hàng đã hủy:</h3>
      <ul>
        <li>Mã đơn hàng: ${order.orderCode}</li>
        <li>Ngày đặt: ${order.createdAt.toLocaleString("vi-VN")}</li>
        <li>Địa chỉ giao hàng: ${order.shippingAddress.address}</li>
        <li>Phương thức thanh toán: ${order.paymentMethod}</li>
      </ul>
  
      <h3>Các sản phẩm trong đơn hàng:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Sản phẩm</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Giá</th>
        </tr>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">
              ${item.name}
              ${
                item.variant
                  ? `<br/>(${item.variant.color} - ${item.variant.size})`
                  : ""
              }
            </td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.quantity
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.price.toLocaleString(
              "vi-VN"
            )}đ</td>
          </tr>
        `
          )
          .join("")}
      </table>
  
      <h3>Tổng thanh toán:</h3>
      <ul>
        <li>Tổng tiền hàng: ${order.originalTotal?.toLocaleString(
          "vi-VN"
        )}đ</li>
        ${
          order.voucherDiscount > 0
            ? `<li>Giảm giá: ${order.voucherDiscount.toLocaleString(
                "vi-VN"
              )}đ</li>`
            : ""
        }
        <li>Thành tiền: ${order.totalAmount.toLocaleString("vi-VN")}đ</li>
      </ul>
  
      <p>Nếu bạn muốn đặt lại đơn hàng hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.</p>
      
      <p>Trân trọng,<br/>Đội ngũ cửa hàng</p>
    `;
};
