import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from "../../components/features/admin/Button/Button";

export default function ViewPackage() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch package');
        }
        const data = await response.json();
        setPkg(data);
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackage();
  }, [id]);

  if (loading) return <div className="text-[var(--admin-text)] p-6">Đang tải...</div>;
  if (!pkg) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy gói tập.</div>;
  
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thông tin gói tập</h1>
      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto">
        <div className="mb-4"><b>Tên gói:</b> {pkg.name}</div>
        <div className="mb-4"><b>Giá:</b> {pkg.price}</div>
        <div className="mb-4"><b>Trạng thái:</b> {pkg.status}</div>
        <div className="flex gap-3">
          <Link to={`/admin/packages/edit/${id}`}><Button color="primary">Chỉnh sửa</Button></Link>
          <Link to="/admin/packages"><Button color="secondary">Quay lại</Button></Link>
        </div>
      </div>
    </div>
  );
} 