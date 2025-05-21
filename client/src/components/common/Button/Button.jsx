import styles from './Button.module.css';

const Button = ({
  type = 'button',
  onClick,
  className,
  children
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
