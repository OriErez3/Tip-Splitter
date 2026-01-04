import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import receiptService from '../../services/receiptService';
import ReceiptCard from './ReceiptCard';
import Navbar from '../common/Navbar';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const data = await receiptService.getMyReceipts();
      setReceipts(data);
    } catch (err) {
      setError('Failed to load receipts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteReceipt = async (receiptId) => {
    try {
      await receiptService.deleteReceipt(receiptId);
      // Remove from local state to update UI immediately
      setReceipts(receipts.filter(r => r._id !== receiptId));
    } catch (err) {
      setError('Failed to delete receipt');
      console.error(err);
    }
  };

  const handleEditReceipt = (receiptId) => {
    navigate(`/edit-receipt/${receiptId}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Receipts</h1>
          <button
            className={styles.createBtn}
            onClick={() => navigate('/create-receipt')}
          >
            + Create New Receipt
          </button>
        </div>

        {loading && <div className={styles.loading}>Loading receipts...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && receipts.length === 0 && (
          <div className={styles.empty}>
            <p>No receipts yet!</p>
            <p>Click "Create New Receipt" to get started.</p>
          </div>
        )}

        {!loading && !error && receipts.length > 0 && (
          <div className={styles.grid}>
            {receipts.map((receipt) => (
              <ReceiptCard key={receipt._id} receipt={receipt} onDelete={handleDeleteReceipt}  onEdit={handleEditReceipt}/>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
