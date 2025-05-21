import { useState, useRef } from 'react';
import styles from './ReceiptUploader.module.css';
import Button from '../../../common/Button/Button';

const ReceiptUploader = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file is image
    if (!file.type.match('image.*')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.uploaderContainer}>
      <h4>Tải lên hóa đơn thanh toán</h4>
      
      <input 
        type="file"
        ref={fileInputRef}
        className={styles.fileInput} 
        accept="image/*"
        onChange={handleFileSelect}
      />

      {!preview ? (
        <div className={styles.dropzone} onClick={handleButtonClick}>
          <i className="material-icons">cloud_upload</i>
          <p>Nhấn để chọn ảnh</p>
          <span>JPG, PNG (tối đa 5MB)</span>
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Receipt preview" className={styles.previewImage} />
          <div className={styles.previewActions}>
            <button 
              className={styles.removeButton} 
              onClick={handleRemove}
              type="button"
            >
              <i className="material-icons">delete</i>
            </button>
          </div>
        </div>
      )}

      {selectedFile && (
        <Button 
          className={styles.uploadButton}
          onClick={handleUpload}
        >
          Xác nhận và tải lên
        </Button>
      )}
    </div>
  );
};

export default ReceiptUploader;

