import styles from './Button.module.css';

export default function Button({ children, onClick, type = 'button', className = '' }) {
  return (
    <button type={type} className={`${styles.button} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
} 