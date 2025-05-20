import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddButton = ({ onClick, label = 'Thêm mới' }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{
        backgroundColor: '#1976d2',
        '&:hover': {
          backgroundColor: '#1565c0',
        },
        borderRadius: '4px',
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease-in-out',
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}
    >
      {label}
    </Button>
  );
};

export default AddButton; 