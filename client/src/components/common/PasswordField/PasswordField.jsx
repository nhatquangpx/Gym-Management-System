import { useState } from 'react';
import styles from './PasswordField.module.css';

// Thêm prop 'required'
const PasswordField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  required // Thêm prop này
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${styles.formGroup} ${error ? styles.error : ''} ${focused ? styles.focused : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {/* Hiển thị dấu sao nếu required là true */}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.passwordInput}>
        <input
          id={id}
          name={id} // Đảm bảo có name
          type={showPassword ? 'text' : 'password'}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required} // Thêm thuộc tính required cho HTML validation (tùy chọn)
        />
        <span 
          className={styles.togglePassword} 
          onClick={togglePasswordVisibility}
        >
          <i className="material-icons">
            {showPassword ? 'visibility' : 'visibility_off'}
          </i>
        </span>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default PasswordField;
