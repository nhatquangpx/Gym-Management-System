import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button/Button';

const orders = [
  { id: 1, customer: 'Nguyễn Văn A', package: 'Gói 1 tháng', total: '500.000đ', status: 'Đã thanh toán' },
  { id: 2, customer: 'Trần Thị B', package: 'Gói 3 tháng', total: '1.200.000đ', status: 'Chờ thanh toán' },
  { id: 3, customer: 'Lê Văn C', package: 'Gói 6 tháng', total: '2.000.000đ', status: 'Đã hủy' },
];

export default function ViewOrder() {
  const { id } = useParams();
  const order = orders.find(o => o.id === Number(id));
  if (!order) return <div className="text-white p-6">Không tìm thấy đơn hàng.</div>;
  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h1>
      <div className="bg-[#232323] rounded-lg shadow p-6 max-w-lg mx-auto">
        <div className="mb-4"><b>Khách hàng:</b> {order.customer}</div>
        <div className="mb-4"><b>Gói tập:</b> {order.package}</div>
        <div className="mb-4"><b>Tổng tiền:</b> {order.total}</div>
        <div className="mb-4"><b>Trạng thái:</b> {order.status}</div>
        <Link to="/orders"><Button>Quay lại</Button></Link>
      </div>
    </div>
  );
} 