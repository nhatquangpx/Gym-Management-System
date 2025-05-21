import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button/Button';

const packages = [
  { id: 1, name: 'Gói 1 tháng', price: '500.000đ', status: 'Đang mở bán' },
  { id: 2, name: 'Gói 3 tháng', price: '1.200.000đ', status: 'Đang mở bán' },
  { id: 3, name: 'Gói 6 tháng', price: '2.000.000đ', status: 'Tạm dừng' },
];

export default function ViewPackage() {
  const { id } = useParams();
  const pkg = packages.find(p => p.id === Number(id));
  if (!pkg) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy gói tập.</div>;
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thông tin gói tập</h1>
      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto">
        <div className="mb-4"><b>Tên gói:</b> {pkg.name}</div>
        <div className="mb-4"><b>Giá:</b> {pkg.price}</div>
        <div className="mb-4"><b>Trạng thái:</b> {pkg.status}</div>
        <Link to="/admin/packages"><Button color="secondary">Quay lại</Button></Link>
      </div>
    </div>
  );
} 