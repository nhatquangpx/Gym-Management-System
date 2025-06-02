import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

export default function ViewWorkout() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/schedules/member-usage/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setMember(data.member);
          setUsageHistory(data.history || []);
        } else {
          console.error('Error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching member history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberHistory();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!member) return <div className="p-6">Không tìm thấy thông tin hội viên</div>;

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Lịch sử sử dụng dịch vụ</h1>
        <Link
          to="/staff/service-history"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
        >
          <FaArrowLeft /> Quay lại
        </Link>
      </div>

      <Paper className="p-6 mb-6" sx={{ background: 'var(--admin-sidebar)' }}>
        <Typography variant="h6" className="mb-4">Thông tin hội viên</Typography>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="subtitle2" color="textSecondary">Họ tên</Typography>
            <Typography>{member.name}</Typography>
          </div>
          <div>
            <Typography variant="subtitle2" color="textSecondary">Tổng số buổi đã sử dụng</Typography>
            <Typography>{usageHistory.length} buổi</Typography>
          </div>
        </div>
      </Paper>

      <Paper sx={{ background: 'var(--admin-sidebar)', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày sử dụng</TableCell>
                <TableCell>Giờ check-in</TableCell>
                <TableCell>Giờ check-out</TableCell>
                <TableCell>Thời gian sử dụng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usageHistory.map((session, index) => {
                // Parse time strings into Date objects
                const checkInTime = new Date(`${session.date.split('T')[0]}T${session.timeStart}`);
                const checkOutTime = new Date(`${session.date.split('T')[0]}T${session.timeEnd}`);
                const durationMinutes = Math.round((checkOutTime - checkInTime) / (1000 * 60));

                return (
                  <TableRow key={index}>
                    <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                    <TableCell>{session.timeStart}</TableCell>
                    <TableCell>{session.timeEnd}</TableCell>
                    <TableCell>
                      {`${durationMinutes} phút`}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
} 