import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import ButtonComponent from "../../components/features/admin/Button/Button";

const ViewPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`/api/packages/${id}`);
        setPkg(response.data);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError(err.response?.data?.message || 'Không thể tải thông tin gói tập. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
        <div className="text-center">Không tìm thấy gói tập</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Chi tiết gói tập</h1>

      <Paper className="bg-[var(--admin-sidebar)] p-6 max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Tên gói</h2>
            <p>{pkg.name}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
            <p>{pkg.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Giá</h2>
            <p>{new Intl.NumberFormat('vi-VN').format(pkg.price)}{pkg.period}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Loại gói</h2>
            <p>{pkg.type}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Thời hạn</h2>
            <p>{pkg.duration} ngày</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Tính năng</h2>
            <ul className="list-disc list-inside">
              {pkg.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Link to={`/admin/packages/edit/${id}`}>
            <ButtonComponent color="primary">Chỉnh sửa</ButtonComponent>
          </Link>
          <Link to="/admin/packages">
            <ButtonComponent color="secondary">Quay lại</ButtonComponent>
          </Link>
        </div>
      </Paper>
    </div>
  );
};

export default ViewPackage; 