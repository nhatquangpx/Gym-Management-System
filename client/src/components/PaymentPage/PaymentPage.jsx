import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './PaymentPage.module.css';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '', cardName: '', expiryDate: '', cvv: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.state && location.state.package) {
      setPaymentData(location.state);
    } else {
      navigate('/register/package');
    }
  }, [location, navigate]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({}); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Số thẻ là bắt buộc';
        isValid = false;
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Số thẻ không hợp lệ';
        isValid = false;
      }
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Tên chủ thẻ là bắt buộc';
        isValid = false;
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Ngày hết hạn là bắt buộc';
        isValid = false;
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Định dạng MM/YY không hợp lệ';
        isValid = false;
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV là bắt buộc';
        isValid = false;
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV không hợp lệ';
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Thanh toán thành công:', {
        paymentMethod,
        formData,
        package: paymentData.package
      });
      navigate('/login'); 
    }
  };

  if (!paymentData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
        <h2>Thanh Toán</h2>
        <p>Hoàn tất thanh toán gói tập</p>
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
      </div>

      <div className={styles.paymentMethods}>
        <h3>Phương thức thanh toán</h3>
        <div className={styles.methodOptions}>
                <div 
            className={`${styles.methodOption} ${paymentMethod === 'card' ? styles.selected : ''}`}
            onClick={() => handlePaymentMethodChange('card')}
          >
            <i className="material-icons">credit_card</i>
                  <span>Thẻ</span>
          </div>
                <div 
            className={`${styles.methodOption} ${paymentMethod === 'banking' ? styles.selected : ''}`}
            onClick={() => handlePaymentMethodChange('banking')}
          >
            <i className="material-icons">account_balance</i>
                  <span>Banking</span>
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
            <form className={styles.paymentForm} onSubmit={handleSubmit}>
              {paymentMethod === 'card' && (
                <div className={styles.cardForm}>
                  <h4>Thông tin thẻ</h4>
                <InputField
                    id="cardNumber" label="Số thẻ" type="text"
                    placeholder="1234 5678 9012 3456" value={formData.cardNumber}
                    onChange={handleChange} error={errors.cardNumber} required={true}
                  />
                  <InputField
                    id="cardName" label="Tên chủ thẻ" type="text"
                    placeholder="NGUYEN VAN A" value={formData.cardName}
                    onChange={handleChange} error={errors.cardName} required={true}
                  />
                  <div className={styles.cardRow}>
                    <div className={styles.cardField}>
                      <InputField
                        id="expiryDate" label="Ngày hết hạn" type="text"
                        placeholder="MM/YY" value={formData.expiryDate}
                        onChange={handleChange} error={errors.expiryDate} required={true}
                />
              </div>
                    <div className={styles.cardField}>
                      <InputField
                        id="cvv" label="CVV" type="text"
                        placeholder="123" value={formData.cvv}
                        onChange={handleChange} error={errors.cvv} required={true}
                      />
          </div>
            </div>
              </div>
              )}

              {paymentMethod === 'banking' && (
                <div className={styles.bankingInfo}>
                  <h4>Quét mã QR hoặc chuyển khoản</h4>
                  <div className={styles.qrCode}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="QR Code" />
            </div>
                  <div className={styles.bankingDetails}>
                    <div className={styles.bankingRow}>
                      <span className={styles.bankingLabel}>Ngân hàng:</span>
                      <span className={styles.bankingValue}>Vietcombank</span>
          </div>
                    <div className={styles.bankingRow}>
                      <span className={styles.bankingLabel}>Số tài khoản:</span>
                      <span className={styles.bankingValue}>1234567890</span>
                    </div>
                    <div className={styles.bankingRow}>
                      <span className={styles.bankingLabel}>Chủ tài khoản:</span>
                        <span className={styles.bankingValue}>GYMPRO CENTER</span>
                    </div>
                    <div className={styles.bankingRow}>
                      <span className={styles.bankingLabel}>Nội dung CK:</span>
                        <span className={styles.bankingValue}>GYMPRO {paymentData.account?.email || 'USER'}</span>
                    </div>
                  </div>
                </div>
        )}

              {paymentMethod === 'momo' && (
                <div className={styles.momoInfo}>
                  <h4>Quét mã MoMo</h4>
                  <div className={styles.qrCode}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="QR Code" />
                  </div>
                  <p className={styles.momoInstruction}>
                    Sử dụng ứng dụng MoMo để quét mã hoặc chuyển đến SĐT <strong>0987654321</strong> (GYMPRO CENTER)
                  </p>
                </div>
              )}
              <Button 
          type="submit"
          className={styles.payButton}
        >
                Thanh toán {paymentData.package.price}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
