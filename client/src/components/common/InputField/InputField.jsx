import { useState } from 'react';
import styles from './InputField.module.css';

// Thêm prop 'disabled'
const InputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled // Thêm dòng này
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`${styles.formGroup} ${error ? styles.error : ''} ${focused ? styles.focused : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        readOnly={disabled} // Sử dụng readOnly thay cho disabled
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;