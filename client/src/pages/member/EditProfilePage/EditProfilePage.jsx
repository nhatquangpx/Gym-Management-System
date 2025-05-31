import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogin } from '../../../redux/slices/authSlice';
import styles from './EditProfilePage.module.css';
import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import InputField from '../../../components/common/InputField/InputField';
import Button from '../../../components/common/Button/Button';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    job: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile khi tải trang
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const memberId = user?._id || user?.id || JSON.parse(localStorage.getItem('user'))?._id;
          if (!memberId) return;
          const res = await fetch(`http://localhost:8001/api/members/info/${memberId}`, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          const data = await res.json();
          if (data.success) {
            setFormData({
              fullName: data.data.name || '',
              email: data.data.email || '',
              phone: data.data.phone || '',
              gender: data.data.memberInfo.gender || '',
              dateOfBirth: data.data.memberInfo.dateOfBirth ? new Date(data.data.memberInfo.dateOfBirth).toISOString().split('T')[0] : '',
              address: data.data.memberInfo.address || '',
              job: data.data.memberInfo.job || '',
            });
          }
        } catch (error) {
          // Có thể show thông báo lỗi ở đây nếu muốn
        }
      };
      fetchProfile();
    }
  }, [user, isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
      isValid = false;
    }
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;
    if (validateForm()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const memberId = user?._id || user?.id || JSON.parse(localStorage.getItem('user'))?._id;
        const res = await fetch(`http://localhost:8001/api/members/info/update/${memberId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            name: formData.fullName,
            phone: formData.phone,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address,
            job: formData.job,
          })
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setLogin({
            user: { ...user, ...data.data },
            token: token
          }));
          setSuccessMessage('Cập nhật thông tin thành công!');
          setIsEditing(false);
        } else {
          setErrors({ form: data.message || 'Cập nhật thất bại!' });
        }
      } catch (err) {
        setErrors({ form: 'Lỗi khi cập nhật thông tin!' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = async () => {
    setIsEditing(false);
    try {
      const token = localStorage.getItem('token');
      const memberId = user?._id || user?.id || JSON.parse(localStorage.getItem('user'))?._id;
      if (!memberId) return;
      const res = await fetch(`http://localhost:8001/api/members/info/${memberId}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.json();
      if (data.success) {
        setFormData({
          fullName: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          gender: data.data.memberInfo.gender || '',
          dateOfBirth: data.data.memberInfo.dateOfBirth ? new Date(data.data.memberInfo.dateOfBirth).toISOString().split('T')[0] : '',
          address: data.data.memberInfo.address || '',
          job: data.data.memberInfo.job || '',
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    let timeoutId;
    if (successMessage) {
      timeoutId = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [successMessage]);

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.profileContainer}>
          <div className={styles.header}>
            <h1>Thông Tin Cá Nhân</h1>
            <p>Cập nhật thông tin của bạn để chúng tôi phục vụ tốt hơn.</p>
          </div>

          {/* Hiển thị thông báo ở đây, ngoài điều kiện isEditing */}
          {errors.form && <p className={styles.errorMessage}>{errors.form}</p>}
          {successMessage && (
            <p className={styles.successMessage}>
              {successMessage}
            </p>
          )}

          {!isEditing ? (
            // Hiển thị thông tin và nút Thay đổi khi không ở chế độ chỉnh sửa
            <>
              <div className={styles.formGrid}>
                <InputField
                  id="fullName" label="Họ và tên" type="text"
                  name="fullName"
                  value={formData.fullName}
                  disabled={true}
                />
                <InputField
                  id="email"
                  label="Email (Thông tin này không thể chỉnh sửa)"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
                <InputField
                  id="phone" label="Số điện thoại" type="tel"
                  name="phone"
                  value={formData.phone}
                  disabled={true}
                />
                <div className={styles.formGroup}>
                  <label htmlFor="gender" className={styles.label}>Giới tính</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    className={styles.selectInput}
                    disabled={true}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <InputField
                  id="dateOfBirth" label="Ngày sinh" type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  disabled={true}
                />
                <InputField
                  id="address" label="Địa chỉ" type="text"
                  name="address"
                  value={formData.address}
                  disabled={true}
                />
                <InputField
                  id="job" label="Công việc" type="text"
                  name="job"
                  value={formData.job}
                  disabled={true}
                />
              </div>
              <div className={styles.buttonGroup}>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setSuccessMessage(''); // Reset message khi bắt đầu chỉnh sửa
                  }}
                >
                  Thay đổi thông tin
                </Button>
              </div>
            </>
          ) : (
            // Form chỉnh sửa khi ở chế độ editing
            <form className={styles.profileForm} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <InputField
                  id="fullName" label="Họ và tên" type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                />
                <InputField
                  id="email"
                  label="Email (Thông tin này không thể chỉnh sửa)"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
                <InputField
                  id="phone" label="Số điện thoại" type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
                <div className={styles.formGroup}>
                  <label htmlFor="gender" className={styles.label}>Giới tính</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={styles.selectInput}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <InputField
                  id="dateOfBirth" label="Ngày sinh" type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                <InputField
                  id="address" label="Địa chỉ" type="text"
                  name="address"
                  placeholder="Ví dụ: 123 Đường ABC, Quận XYZ, TP. Hà Nội"
                  value={formData.address}
                  onChange={handleChange}
                />
                <InputField
                  id="job" label="Công việc" type="text"
                  name="job"
                  placeholder="Ví dụ: Sinh viên, Nhân viên văn phòng"
                  value={formData.job}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.buttonGroup}>
                <Button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </Button>
                <Button 
                  type="button" 
                  className={styles.backButton}
                  onClick={handleCancelEdit}
                >
                  Hủy
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfilePage;