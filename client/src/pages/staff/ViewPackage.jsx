import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  FitnessCenter as FitnessIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import axios from "axios";
import ButtonComponent from "../../components/features/admin/Button/Button";

const ViewPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`/api/packages/${id}`);
        setPackageData(response.data);
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

  if (!packageData) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
        <div className="text-center">Không tìm thấy gói tập</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">{packageData.name}</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Mô tả</h2>
            <p className="text-[var(--admin-text)]">{packageData.description}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-1">Giá</h2>
            <p className="text-[var(--admin-text)]">{packageData.price.toLocaleString('vi-VN')} VNĐ {packageData.period}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-1">Loại gói</h2>
            <p className="text-[var(--admin-text)]">{packageData.type}</p>
          </div>

          <div>
            <h2 className="font-semibold mb-1">Thời hạn</h2>
            <p className="text-[var(--admin-text)]">{packageData.duration} ngày</p>
          </div>

          {packageData.features && packageData.features.length > 0 && (
            <div>
              <h2 className="font-semibold mb-1">Tính năng</h2>
              <ul className="list-disc list-inside text-[var(--admin-text)]">
                {packageData.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Link to={`/staff/packages/edit/${id}`}>
              <ButtonComponent color="primary">Chỉnh sửa</ButtonComponent>
            </Link>
            <Link to="/staff/packages">
              <ButtonComponent color="secondary">Quay lại</ButtonComponent>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPackage; 