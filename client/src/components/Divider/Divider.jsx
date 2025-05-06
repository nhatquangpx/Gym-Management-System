import styles from './Divider.module.css';

const Divider = ({ text }) => {
  return (
    <div className={styles.divider}>
      <span>{text}</span>
    </div>
  );
};

export default Divider;