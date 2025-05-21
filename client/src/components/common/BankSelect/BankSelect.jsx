import { useState } from 'react';
import styles from './BankSelect.module.css';
import { banks } from '../../utils/bankData';

const BankSelect = ({ selectedBank, onBankSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleBankSelect = (bank) => {
    onBankSelect(bank);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.bankSelectContainer}>
      <div 
        className={styles.bankSelectHeader}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedBank ? (
          <div className={styles.selectedBank}>
            <img 
              src={selectedBank.logo} 
              alt={selectedBank.name} 
              className={styles.bankLogo} 
            />
            <span>{selectedBank.name}</span>
          </div>
        ) : (
          <span>Chọn ngân hàng</span>
        )}
        <i className="material-icons">{isDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
      </div>

      {isDropdownOpen && (
        <div className={styles.bankDropdown}>
          {banks.map(bank => (
            <div 
              key={bank.id}
              className={`${styles.bankOption} ${selectedBank?.id === bank.id ? styles.selected : ''}`}
              onClick={() => handleBankSelect(bank)}
            >
              <img 
                src={bank.logo} 
                alt={bank.name} 
                className={styles.bankLogo} 
              />
              <span>{bank.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankSelect;
