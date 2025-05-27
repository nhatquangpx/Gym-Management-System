import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PaymentReturnPage.module.css';

const PaymentReturn = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
  const [debug, setDebug] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
    // Log debug info when component loads
  console.log('PaymentReturn component loaded');
  console.log('Current URL search params:', location.search);  // Function to detect payment context and set appropriate success message
  const detectPaymentContext = async (txnRef) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // No token, assume new registration
        setMessage('Thanh toán thành công! Tài khoản của bạn đã được kích hoạt.');
        return;
      }

      // Try to get the order information first using the new endpoint
      try {
        const orderResponse = await fetch(`http://localhost:8001/api/orders/by-txnref/${txnRef}`);

        if (orderResponse.ok) {
          const orderResult = await orderResponse.json();
          const orderData = orderResult.data;
          
          if (orderData && orderData.userId) {
            const user = orderData.userId;
            
            // Check if user had existing membership before this order
            if (user.memberInfo && user.memberInfo.membershipStart) {
              const membershipStart = new Date(user.memberInfo.membershipStart);
              const orderDate = new Date(orderData.createdAt);
              
              // If membership started significantly before this order (more than 1 hour), 
              // it's an existing member purchasing additional package
              const oneHourInMs = 60 * 60 * 1000;
              if (membershipStart.getTime() < orderDate.getTime() - oneHourInMs) {
                setMessage('Thanh toán thành công! Gói tập đã được mua thành công.');
                return;
              }
            }
            
            // Check user role - if already a member, it's a package purchase
            if (user.role === 'member') {
              setMessage('Thanh toán thành công! Gói tập đã được mua thành công.');
              return;
            }
          }
          
          // If we can't determine from order data, assume new registration
          setMessage('Thanh toán thành công! Tài khoản của bạn đã được kích hoạt.');
          return;
        }
      } catch (orderError) {
        console.log('Could not fetch order details, trying alternative method:', orderError);
      }

      // Fallback: Check user profile to determine context
      try {
        const userResponse = await fetch('http://localhost:8001/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const user = userData.user || userData;
          
          // If user is already a member with existing membership, it's a package purchase
          if (user.role === 'member' && user.memberInfo && user.memberInfo.membershipStart) {
            const membershipStart = new Date(user.memberInfo.membershipStart);
            const now = new Date();
            const timeSinceActivation = now.getTime() - membershipStart.getTime();
            const oneHourInMs = 60 * 60 * 1000;
            
            // If membership was activated more than 1 hour ago, it's likely an existing member
            if (timeSinceActivation > oneHourInMs) {
              setMessage('Thanh toán thành công! Gói tập đã được mua thành công.');
              return;
            }
          }
        }
      } catch (userError) {
        console.log('Could not fetch user profile:', userError);
      }

      // Default to new registration message if we can't determine context
      setMessage('Thanh toán thành công! Tài khoản của bạn đã được kích hoạt.');
      
    } catch (error) {
      console.error('Error detecting payment context:', error);
      // Fallback message if error occurs
      setMessage('Thanh toán thành công!');
    }
  };

useEffect(() => {
    // Trích xuất query parameters từ URL
    const queryParams = new URLSearchParams(location.search);
    const allParams = {};
    
    // Lưu tất cả params vào object để gửi lại cho server
    queryParams.forEach((value, key) => {
      allParams[key] = value;
    });
    
    // Display all parameters for debugging
    console.log('Payment return parameters:', allParams);
    
    // Most important parameters from VNPAY
    if (allParams.vnp_ResponseCode) {
      console.log(`Payment response code: ${allParams.vnp_ResponseCode} (${allParams.vnp_ResponseCode === '00' ? 'Success' : 'Failed'})`);
    }
    if (allParams.vnp_TxnRef) {
      console.log(`Transaction reference: ${allParams.vnp_TxnRef}`);
    }
      const processPaymentResult = async () => {
      try {
        console.log('Processing payment return with query:', location.search);
        
        // Chuyển từ việc dùng API server sang direct URL
        // Do có vấn đề về CORS, hãy chuyển hướng người dùng trực tiếp về trang thành công
        // thay vì gọi API
        
        const queryParams = new URLSearchParams(location.search);
        const responseCode = queryParams.get('vnp_ResponseCode');
        const txnRef = queryParams.get('vnp_TxnRef');
          // Kiểm tra xem thanh toán có thành công không dựa trên mã response
        if (responseCode === '00') {
          console.log('Payment successful based on response code');
          setStatus('success');
          
          // Detect payment context: new registration vs existing member purchase
          await detectPaymentContext(txnRef);
          
          // Tự động chuyển hướng sau 3 giây
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          console.log('Payment failed based on response code:', responseCode);
          setStatus('failed');
          setMessage('Thanh toán không thành công. Vui lòng thử lại.');
          
          // Tự động chuyển hướng sau 3 giây
          setTimeout(() => {
            navigate('/payment');
          }, 3000);
        }
          // Để giải quyết lỗi CORS, chúng ta sẽ thực hiện thêm một request riêng biệt
        // để kích hoạt tài khoản nếu chưa được kích hoạt
        
        // Lấy token từ localStorage nếu có
        const token = localStorage.getItem('authToken');
          if (token && responseCode === '00') {
          // Gọi API kích hoạt tài khoản
          try {
            const activateResponse = await fetch('http://localhost:8001/api/registration/activate-after-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ 
                txnRef: txnRef,
                responseCode: responseCode
              })
            });
            
            if (activateResponse.ok) {
              console.log('User account activated successfully');
            } else {
              console.warn('Failed to activate account, but payment was successful');
            }
          } catch (activateError) {
            console.error('Error activating account:', activateError);
          }
        }} catch (error) {
        console.error('Lỗi xử lý kết quả thanh toán:', error);
        setStatus('error');
        setMessage('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.');
        setDebug(error.toString());
        
        // Log detailed error information
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          query: location.search
        });
        
        // Hiển thị thông tin thanh toán để người dùng có thể tham khảo
        const queryParams = new URLSearchParams(location.search);
        const paymentDetails = {
          responseCode: queryParams.get('vnp_ResponseCode'),
          amount: queryParams.get('vnp_Amount'),
          orderInfo: queryParams.get('vnp_OrderInfo'),
          transactionNo: queryParams.get('vnp_TransactionNo'),
          txnRef: queryParams.get('vnp_TxnRef')
        };
        setPaymentInfo(paymentDetails);
        
        // Chuyển về trang thanh toán sau 5 giây
        setTimeout(() => {
          navigate('/payment');
        }, 5000);
      }
    };
    
    processPaymentResult();
  }, [location, navigate]);

  return (
    <div className={styles.paymentReturnContainer}>
      <div className={styles.statusCard}>
        <div className={`${styles.statusIcon} ${styles[status]}`}>
          {status === 'loading' && <div className={styles.loader}></div>}
          {status === 'success' && <span className={styles.successIcon}>✓</span>}
          {status === 'failed' && <span className={styles.failedIcon}>✗</span>}
          {status === 'error' && <span className={styles.errorIcon}>!</span>}
        </div>
        
        <h2 className={styles.statusTitle}>
          {status === 'loading' && 'Đang xác thực thanh toán'}
          {status === 'success' && 'Thanh toán thành công'}
          {status === 'failed' && 'Thanh toán thất bại'}
          {status === 'error' && 'Lỗi xử lý'}
        </h2>
        
        <p className={styles.statusMessage}>{message}</p>
          <div className={styles.redirectMessage}>
          {status === 'success' && <p>Đang chuyển đến trang hồ sơ thành viên...</p>}
          {status === 'failed' && <p>Đang quay lại trang thanh toán...</p>}
          {status === 'error' && <p>Đang quay lại trang thanh toán...</p>}
        </div>
          {/* Payment info section */}
        {status === 'error' && Object.keys(paymentInfo).length > 0 && (
          <div className={styles.paymentInfoSection}>
            <hr />
            <h4>Thông tin thanh toán:</h4>
            <ul className={styles.paymentDetailsList}>
              <li><strong>Mã phản hồi:</strong> {paymentInfo.responseCode}</li>
              <li><strong>Số tiền:</strong> {paymentInfo.amount ? (parseInt(paymentInfo.amount) / 100).toLocaleString('vi-VN') + 'đ' : 'N/A'}</li>
              <li><strong>Mã giao dịch:</strong> {paymentInfo.transactionNo || 'N/A'}</li>
              <li><strong>Mã tham chiếu:</strong> {paymentInfo.txnRef || 'N/A'}</li>
            </ul>
            <p className={styles.supportNote}>Vui lòng lưu lại thông tin này và liên hệ hỗ trợ nếu cần thiết.</p>
          </div>
        )}
        
        {/* Debug section - only visible in development */}
        {process.env.NODE_ENV !== 'production' && debug && (
          <div className={styles.debugInfo}>
            <hr />
            <h4>Debug Info:</h4>
            <pre>{debug}</pre>
          </div>
        )}
          {/* Navigation fallback button */}
        {(status === 'success' || status === 'error' || status === 'failed') && (
          <div className={styles.navigationButtons}>
            {status === 'success' ? (
              <button 
                className={styles.navButton} 
                onClick={() => navigate('/')}
              >
                Đi đến trang hồ sơ
              </button>
            ) : (
              <button 
                className={styles.navButton}
                onClick={() => navigate('/payment')}
              >
                Quay lại trang thanh toán
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
