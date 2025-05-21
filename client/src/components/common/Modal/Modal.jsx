import styles from './Modal.module.css';
import Button from '../Button/Button';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalIcon}>
          <i className="material-icons">how_to_reg</i>
        </div>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalButtons}>
          <Button 
            onClick={onConfirm}
            className={styles.confirmButton}
          >
            Đăng nhập ngay
          </Button>
          <Button 
            onClick={onClose}
            className={styles.cancelButton}
          >
            Để sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

