import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from "../../components/features/admin/Button/Button";
import axios from '../../utils/axiosConfig';

export default function ViewEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/employees/${id}`);
      setEmployee(response.data.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('Không thể tải thông tin nhân viên');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-[var(--admin-text)]">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return <div className="text-[var(--admin-text)] p-6">Không tìm thấy nhân viên.</div>;
  }

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thông tin nhân viên</h1>
      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto">
        <div className="mb-4"><b>Tên:</b> {employee.name}</div>
        <div className="mb-4"><b>Email:</b> {employee.email}</div>
        <div className="mb-4"><b>Chức vụ:</b> {employee.employeeInfo?.position || 'Nhân viên'}</div>
        <div className="mb-4"><b>Số điện thoại:</b> {employee.phone}</div>
        <div className="mb-4"><b>Lương:</b> {employee.employeeInfo?.salary ? `${employee.employeeInfo.salary.toLocaleString()} VND` : 'Chưa cập nhật'}</div>
        <div className="mb-4"><b>Ca làm việc:</b> {employee.employeeInfo?.shiftSchedule || 'Chưa cập nhật'}</div>
        <div className="mb-4"><b>Đánh giá:</b> {employee.employeeInfo?.performanceRating || 'Chưa có'}</div>
        <div className="mb-4"><b>Trạng thái:</b> {employee.isActive ? 'Đang làm việc' : 'Nghỉ việc'}</div>
        <Link to="/admin/employees"><Button color="secondary">Quay lại</Button></Link>
      </div>
    </div>
  );
}