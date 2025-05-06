import { useState } from 'react';
import styles from './InputField.module.css';

// Thêm prop 'required'
const InputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  required // Thêm prop này
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`${styles.formGroup} ${error ? styles.error : ''} ${focused ? styles.focused : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {/* Hiển thị dấu sao nếu required là true */}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={id}
        name={id} // Đảm bảo có name để handleChange hoạt động đúng
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required} // Thêm thuộc tính required cho HTML validation (tùy chọn)
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;