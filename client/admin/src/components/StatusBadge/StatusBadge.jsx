import styles from './StatusBadge.module.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function StatusBadge({ status }) {
  let badgeClass = styles.default;
  let icon = <FiberManualRecordIcon style={{ fontSize: 16, opacity: 0.6 }} />;
  if (status === 'Đang hoạt động' || status === 'Đang làm việc' || status === 'Đang mở bán') {
    badgeClass = styles.active;
    icon = <CheckCircleIcon style={{ color: '#e53935', fontSize: 18 }} />;
  }
  if (status === 'Tạm dừng' || status === 'Nghỉ việc') {
    badgeClass = styles.pause;
    icon = <PauseCircleIcon style={{ color: '#fbc02d', fontSize: 18 }} />;
  }
  if (status === 'Đã thanh toán') {
    badgeClass = styles.success;
    icon = <CheckCircleIcon style={{ color: '#43a047', fontSize: 18 }} />;
  }
  if (status === 'Chờ thanh toán') {
    badgeClass = styles.warning;
    icon = <WarningIcon style={{ color: '#fbc02d', fontSize: 18 }} />;
  }
  if (status === 'Đã hủy') {
    badgeClass = styles.error;
    icon = <ErrorIcon style={{ color: '#b71c1c', fontSize: 18 }} />;
  }
  return <span className={`${styles.badge} ${badgeClass}`}>{icon} {status}</span>;
} 