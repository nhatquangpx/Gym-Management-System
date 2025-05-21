import styles from './Button.module.css';

export default function Button({ children, onClick, type = 'button', className = '', color = '' }) {
  const buttonClass = color ? `${styles.button} ${styles[color]} ${className}` : `${styles.button} ${className}`;
  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
} 