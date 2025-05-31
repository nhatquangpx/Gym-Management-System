const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendNewPasswordEmail = async (to, newPassword) => {
  const subject = "Mật khẩu mới của bạn";
  const html = `
    <p>Xin chào,</p>
    <p>Đây là mật khẩu mới được tạo cho tài khoản của bạn:</p>
    <h3>${newPassword}</h3>
    <p>Vui lòng đăng nhập bằng mật khẩu này và đổi lại mật khẩu sau khi đăng nhập để đảm bảo an toàn.</p>
    <p>Trân trọng,</p>
    <p>Đội ngũ hỗ trợ của bạn</p>
  `;
  return sendEmail(to, subject, html);
};

const sendReceiptEmail = async (to, orderDetails) => {
  const subject = `Biên lai thanh toán - Đơn hàng #${orderDetails.orderId || 'Không xác định'}`;
  const html = `
    <p>Xin chào,</p>
    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Dưới đây là chi tiết đơn hàng của bạn:</p>
    <ul>
      ${orderDetails.items.map(item => `<li>${item.name}: ${item.quantity} x ${item.price} = ${item.total}</li>`).join('')}
    </ul>
    <p>Tổng cộng: <strong>${orderDetails.totalAmount}</strong></p>
    <p>Phương thức thanh toán: ${orderDetails.paymentMethod || 'Không xác định'}</p>
    <p>Ngày thanh toán: ${orderDetails.paymentDate || new Date().toLocaleDateString()}</p>
    <p>Trân trọng,</p>
    <p>Đội ngũ của bạn</p>
  `;
  return sendEmail(to, subject, html);
};

const sendMaintenanceNotificationEmail = async (equipmentName, issueDetails, recipientEmail) => {
  const subject = `Thông báo bảo trì thiết bị: ${equipmentName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f8cff;">Thông báo bảo trì thiết bị</h2>
      <p>Kính gửi Trung tâm bảo trì,</p>
      <p>Chúng tôi cần sự hỗ trợ của quý trung tâm để bảo trì thiết bị sau:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #333; margin-top: 0;">${equipmentName}</h3>
        <p style="margin-bottom: 0;"><strong>Chi tiết sự cố:</strong></p>
        <p style="margin-top: 5px;">${issueDetails}</p>
      </div>
      <p>Vui lòng sắp xếp thời gian đến kiểm tra và bảo trì thiết bị trong thời gian sớm nhất.</p>
      <p>Trân trọng,</p>
      <p>Phòng Quản lý Thiết bị</p>
    </div>
  `;
  return sendEmail(recipientEmail, subject, html);
};

const sendBulkMaintenanceNotificationEmail = async (equipments, recipientEmail) => {
  const subject = `Thông báo bảo trì nhiều thiết bị`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f8cff;">Thông báo bảo trì nhiều thiết bị</h2>
      <p>Kính gửi Trung tâm bảo trì,</p>
      <p>Chúng tôi cần sự hỗ trợ của quý trung tâm để bảo trì các thiết bị sau:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        ${equipments.map(eq => `
          <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
            <h3 style="color: #333; margin-top: 0;">${eq.name}</h3>
            <p style="margin-bottom: 5px;"><strong>Chi tiết sự cố:</strong></p>
            <p style="margin-top: 5px;">${eq.issueDetails || 'Không có mô tả chi tiết'}</p>
          </div>
        `).join('')}
      </div>
      <p>Vui lòng sắp xếp thời gian đến kiểm tra và bảo trì các thiết bị trong thời gian sớm nhất.</p>
      <p>Trân trọng,</p>
      <p>Phòng Quản lý Thiết bị</p>
    </div>
  `;
  return sendEmail(recipientEmail, subject, html);
};

module.exports = {
  sendEmail,
  sendNewPasswordEmail,
  sendReceiptEmail,
  sendMaintenanceNotificationEmail,
  sendBulkMaintenanceNotificationEmail,
};