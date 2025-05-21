import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PaymentPage.module.css';
import Button from '../../../components/common/Button/Button';
import ReceiptUploader from '../../../components/features/member/ReceiptUploader/ReceiptUploader';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();  
  const [paymentData, setPaymentData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [receiptFile, setReceiptFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [connectionTested, setConnectionTested] = useState(false);

  // Hàm kiểm tra kết nối API
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const response = await fetch('http://localhost:8001/api/test-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testData: 'API connection test',
          timestamp: new Date().toISOString()
        }),
      });
      
      const data = await response.json();
      console.log('API connection test result:', data);
      setConnectionTested(true);
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  };  useEffect(() => {
    console.log('Location state:', location.state);
    
    // Thử lấy dữ liệu từ location state - hỗ trợ cả cấu trúc dữ liệu cũ và mới
    if (location.state && (location.state.package || location.state.order || location.state.trainer)) {
      console.log('Payment data from location:', location.state);
      setPaymentData(location.state);
    } else {
      // Nếu không có trong location state, thử lấy từ sessionStorage
      console.log('No payment data found in location state, trying sessionStorage');
      const savedData = sessionStorage.getItem('paymentData');
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('Retrieved payment data from sessionStorage:', parsedData);
          
          // Kiểm tra cấu trúc dữ liệu mới (từ quy trình đăng ký mới)
          if (parsedData?.user?.id && parsedData?.order) {
            console.log('Using new registration data structure');
            setPaymentData(parsedData);
            return;
          }
          // Kiểm tra cấu trúc dữ liệu cũ
          else if (parsedData?.package && parsedData?.account) {
            console.log('Using old registration data structure');
            setPaymentData(parsedData);
            return;
          } else {
            console.error('Retrieved data is invalid:', parsedData);
          }
        } catch (err) {
          console.error('Error parsing saved payment data:', err);
        }
      }
      
      // Nếu không có dữ liệu hợp lệ, chuyển về trang chọn gói
      console.error('No valid payment data found');
      alert('Không tìm thấy thông tin thanh toán. Vui lòng chọn gói tập lại.');
      navigate('/register/package');
    }
  }, [location, navigate]);
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({}); 
  };  const validateForm = () => {
    // No validation needed for the card payment method
    // as we're redirecting directly to VNPay
    return true;
  };
  
  // Hàm trích xuất thông tin từ cấu trúc dữ liệu
  const extractPaymentInfo = () => {
    // Cấu trúc dữ liệu cũ
    if (paymentData?.account) {
      return {
        userId: paymentData.account?._id || paymentData.account?.email,
        packageId: paymentData.package?._id || paymentData.package?.id,
        packageName: paymentData.package?.name,
        price: paymentData.package?.price,
        email: paymentData.account?.email
      };
    } 
    // Cấu trúc dữ liệu mới
    else if (paymentData?.user) {
      return {
        userId: paymentData.user?.id,
        packageId: paymentData.order?.packageId || paymentData.package?.id,
        orderId: paymentData.order?.orderId,
        packageName: paymentData.package?.name,
        price: paymentData.package?.price || paymentData.order?.amount,
        email: paymentData.user?.email
      };
    }
    
    return null;
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trích xuất thông tin thanh toán từ cấu trúc dữ liệu
    const paymentInfo = extractPaymentInfo();
    console.log('Extracted payment info:', paymentInfo);
    
    // Kiểm tra dữ liệu thanh toán
    if (!paymentInfo || !paymentInfo.userId || !paymentInfo.packageId) {
      alert('Thiếu thông tin thanh toán cần thiết. Vui lòng thử lại.');
      console.error('Missing payment data:', paymentData);
      navigate('/register/package');
      return;
    }
    
    if (validateForm()) {
      setLoading(true);
      setStatusMessage('Đang xử lý thanh toán...');
      
      try {
        // Log dữ liệu thanh toán để debug
        console.log('Processing payment with data:', {
          method: paymentMethod,
          ...paymentInfo
        });if (paymentMethod === 'card') {          // Handle card payment through VNPAY
          console.log('Full payment data:', paymentData);
          
          // Xử lý dữ liệu thanh toán từ cấu trúc dữ liệu mới hoặc cũ
          const payloadData = {};
          
          if (paymentData?.user && paymentData?.order?.orderId) {
            // Cấu trúc mới từ quy trình đăng ký mới
            console.log('Using new registration data structure');
            payloadData.userId = paymentData.user.id;
            payloadData.packageId = paymentData.order.packageId || paymentData.package.id;
            payloadData.orderId = paymentData.order.orderId;
          } else {
            // Cấu trúc cũ
            console.log('Using old registration data structure');
            payloadData.userId = paymentData?.account?._id || paymentData?.account?.email;
            payloadData.packageId = paymentData?.package?._id || paymentData?.package?.id;
          }
          
          console.log('Extracted payment identifiers:', payloadData);
          
          // Kiểm tra dữ liệu trước khi gửi yêu cầu
          if (!payloadData.userId || !payloadData.packageId) {
            console.error('Missing required payment data!', paymentData);
            alert('Thiếu thông tin thanh toán cần thiết. Vui lòng thử lại.');
            navigate('/register/package');
            return;
          }
          
          console.log('Final VNPAY payload:', payloadData);
          
          const response = await fetch('http://localhost:8001/api/payment/vnpay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payloadData),
          });
          
          // Kiểm tra status code
          console.log('VNPAY response status:', response.status);
          if (!response.ok) {
            const errorText = await response.text();
            console.error('VNPAY error response:', errorText);
            alert(`Lỗi khi kết nối đến cổng thanh toán: ${response.status} ${response.statusText}`);
            setLoading(false);
            setStatusMessage('');
            return;
          }
          
          const data = await response.json();
          
          if (data.paymentUrl) {
            setStatusMessage('Chuyển hướng đến cổng thanh toán VNPay...');
            window.location.href = data.paymentUrl;
          } else {
            setLoading(false);
            setStatusMessage('');
            console.error('Payment creation failed:', data);
            alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
          }        } else if (paymentMethod === 'momo' && !orderCreated) {
          // Nếu đã có orderId từ quy trình đăng ký mới
          if (paymentInfo.orderId) {
            // Chỉ cần hiển thị thông tin đơn hàng
            setOrderCreated(true);
            setOrderDetails({
              orderId: paymentInfo.orderId,
              amount: paymentInfo.price,
              status: 'pending',
              packageName: paymentInfo.packageName
            });
            setLoading(false);
            setStatusMessage('Đơn hàng đã được tạo thành công!');
          } else {
            // Tạo đơn hàng mới qua API
            const response = await fetch('http://localhost:8001/api/orders/manual', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: paymentInfo.userId,
                packageId: paymentInfo.packageId,
                paymentMethod: paymentMethod,
                amount: parseFloat(paymentInfo.price.replace(/[^\d.]/g, '')) || 0,
                orderInfo: `${paymentInfo.email || 'Guest'} - ${paymentInfo.packageName}`,
                bankId: null
              }),
            });
            
            const data = await response.json();
            
            setLoading(false);
            
            if (data.success) {
              setStatusMessage('Đơn hàng đã được tạo thành công!');
              setOrderCreated(true);
              setOrderDetails(data.order);
            } else {
              setStatusMessage('');
              console.error('Order creation failed:', data);
              alert(`Có lỗi xảy ra khi tạo đơn hàng: ${data.message || 'Vui lòng thử lại.'}`);
            }
          }
        } else if (paymentMethod === 'momo' && orderCreated) {
          // Handle receipt upload
          if (!receiptFile) {
            setLoading(false);
            setStatusMessage('');
            alert('Vui lòng tải lên ảnh hóa đơn để tiếp tục.');
            return;
          }

          // Create form data for file upload
          const formData = new FormData();
          formData.append('receipt', receiptFile);
          formData.append('orderId', orderDetails.orderId);
          
          // Upload receipt
          const response = await fetch('/api/orders/upload-receipt', {
            method: 'POST',
            body: formData,
          });
          
          const data = await response.json();
          setLoading(false);
          
          if (data.success) {
            setStatusMessage('Hóa đơn đã được tải lên thành công!');
            alert('Cảm ơn bạn đã hoàn tất thanh toán! Đơn hàng của bạn sẽ được xác nhận trong thời gian sớm nhất.');
            navigate('/login');
          } else {
            setStatusMessage('');
            console.error('Receipt upload failed:', data);
            alert(`Có lỗi xảy ra khi tải lên hóa đơn: ${data.message || 'Vui lòng thử lại.'}`);
          }
        }
      } catch (error) {
        setLoading(false);
        setStatusMessage('');
        console.error('Payment error:', error);
        alert('Có lỗi xảy ra khi kết nối với máy chủ. Vui lòng thử lại sau.');
      }
    }
  };

  if (!paymentData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>        <div className={styles.header}>
        <h2>Thanh Toán</h2>
        <p>Hoàn tất thanh toán để kích hoạt tài khoản và gói tập</p>
        <div className={styles.mandatoryNote}>
          <i className="material-icons">info</i>
          <span>Thanh toán là bắt buộc để kích hoạt tài khoản của bạn</span>
        </div>
      </div>

        <div className={styles.paymentLayout}>
          <div className={styles.infoSection}>
            <div className={styles.packageSummary}>
              <h3>Thông tin gói tập</h3>
              <div className={styles.packageDetails}>
                <div className={styles.packageInfo}>
            <span className={styles.packageName}>{paymentData.package.name}</span>
            <span className={styles.packageType}>{paymentData.package.type}</span>
          </div>
                <span className={styles.packagePrice}>{paymentData.package.price}{paymentData.package.period}</span>
        </div>
      </div>      <div className={styles.paymentMethods}>
        <h3>Phương thức thanh toán</h3>
        <div className={styles.methodOptions}>
                <div 
            className={`${styles.methodOption} ${paymentMethod === 'card' ? styles.selected : ''}`}
            onClick={() => handlePaymentMethodChange('card')}
          >
            <i className="material-icons">credit_card</i>
                  <span>VNPay</span>
          </div>
                <div 
            className={`${styles.methodOption} ${paymentMethod === 'momo' ? styles.selected : ''}`}
            onClick={() => handlePaymentMethodChange('momo')}
          >
            <i className="material-icons">smartphone</i>
                  <span>MoMo</span>
          </div>
        </div>
      </div>
              </div>

          <div className={styles.formSection}>
            <form className={styles.paymentForm} onSubmit={handleSubmit}>              {paymentMethod === 'card' && (
                <div className={styles.vnpayInfo}>
                  <h4>Thanh toán qua VNPay</h4>
                  <div className={styles.vnpayDescription}>
                    <i className="material-icons">credit_card</i>
                    <p>Thanh toán an toàn qua cổng VNPay với thẻ ATM, Visa, MasterCard, JCB...</p>
                  </div>
                  <div className={styles.securePayment}>
                    <i className="material-icons">security</i>
                    <span>Bảo mật thông tin & Giao dịch an toàn</span>
                  </div>
                </div>
              )}{paymentMethod === 'momo' && !orderCreated && (
                <div className={styles.momoInfo}>
                  <h4>Quét mã MoMo</h4>
                  <div className={styles.qrCode}>
                    <img 
                      src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=2|99|0987654321|GYMFLEX CENTER||0|0|${parseInt(paymentData.package.price) || 0}|${encodeURIComponent(`GYMFLEX ${paymentData.account?.email || 'USER'}`)}|transfer_myqr&choe=UTF-8`} 
                      alt="MoMo QR Code" 
                    />
                  </div>
                  <p className={styles.momoInstruction}>
                    Sử dụng ứng dụng MoMo để quét mã hoặc chuyển đến SĐT <strong>0987654321</strong> (GYMFLEX CENTER)
                  </p>
                </div>
              )}

              {paymentMethod === 'momo' && orderCreated && (
                <div className={styles.orderConfirmation}>
                  <div className={styles.orderSuccessMessage}>
                    <i className="material-icons success-icon">check_circle</i>
                    <h3>Đơn hàng đã được tạo thành công!</h3>
                    <p>Mã đơn hàng: {orderDetails?.orderId}</p>
                    <p>Vui lòng hoàn tất thanh toán để kích hoạt gói tập.</p>
                  </div>

                  <ReceiptUploader onUpload={(file) => setReceiptFile(file)} />
                </div>
              )}{statusMessage && (
                <div className={styles.statusMessage}>
                  {statusMessage}
                </div>
              )}              <Button 
                type="submit"
                className={styles.payButton}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 
                  (paymentMethod === 'momo' && orderCreated) ? 
                    'Xác nhận đã thanh toán' : 
                    paymentMethod === 'card' ?
                    `Thanh toán qua VNPay (${paymentData.package.price})` :
                    `Thanh toán ${paymentData.package.price}`
                }
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
