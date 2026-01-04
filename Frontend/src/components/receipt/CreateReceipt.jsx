import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import receiptService from '../../services/receiptService';
import ParticipantInput from './ParticipantInput';
import Navbar from '../common/Navbar';
import styles from './CreateReceipt.module.css';

const CreateReceipt = () => {
  const navigate = useNavigate();
  const { id } = useParams();  
  const isEditMode = !!id;
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [appetizerSubtotal, setAppetizerSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);
  const [participants, setParticipants] = useState([
    { name: '', mealSubtotal: 0, includeApps: true }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadReceipt();
    }
  }, [id]);

    const loadReceipt = async () => {
    try {
      setLoading(true);
      const receipts = await receiptService.getMyReceipts();
      const receipt = receipts.find(r => r._id === id);
      
      if (receipt) {
        setTitle(receipt.title);
        setDate(new Date(receipt.date).toISOString().split('T')[0]);
        setAppetizerSubtotal(receipt.appetizerSubtotal || 0);
        setTax(receipt.tax);
        setTip(receipt.tip);
        setParticipants(receipt.participants);
      } else {
        setError('Receipt not found');
      }
    } catch (err) {
      setError('Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };
  
  const handleParticipantChange = (index, updatedParticipant) => {
    const newParticipants = [...participants];
    newParticipants[index] = updatedParticipant;
    setParticipants(newParticipants);
  };

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: '', mealSubtotal: 0, includeApps: true }]);
  };

  const handleRemoveParticipant = (index) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    const mealTotal = participants.reduce((sum, p) => sum + (parseFloat(p.mealSubtotal) || 0), 0);
    const total = mealTotal + parseFloat(appetizerSubtotal || 0) + parseFloat(tax || 0) + parseFloat(tip || 0);
    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a receipt title');
      return;
    }

    if (participants.length === 0) {
      setError('At least one participant is required');
      return;
    }

    for (const participant of participants) {
      if (!participant.name.trim()) {
        setError('All participants must have a name');
        return;
      }
      if (participant.mealSubtotal < 0) {
        setError('Meal costs must be positive numbers');
        return;
      }
    }

    if (parseFloat(appetizerSubtotal) < 0 || parseFloat(tax) < 0 || parseFloat(tip) < 0) {
      setError('Appetizers, tax, and tip must be positive numbers');
      return;
    }

    setLoading(true);

    try {
      const receiptData = {
        title,
        date,
        appetizerSubtotal: parseFloat(appetizerSubtotal) || 0,
        tax: parseFloat(tax) || 0,
        tip: parseFloat(tip) || 0,
        participants: participants.map(p => ({
          name: p.name,
          mealSubtotal: parseFloat(p.mealSubtotal) || 0,
          includeApps: p.includeApps
        }))
      };
      if (isEditMode) {
        await receiptService.updateReceipt(id, receiptData);
      } else {
        await receiptService.createReceipt(receiptData);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} receipt`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{isEditMode ? 'Edit Receipt' : 'Create New Receipt'}</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Receipt Details</h2>

            <div className={styles.formGroup}>
              <label htmlFor="title">Receipt Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Dinner at Restaurant"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Participants</h2>
            {participants.map((participant, index) => (
              <ParticipantInput
                key={index}
                participant={participant}
                index={index}
                onChange={handleParticipantChange}
                onRemove={handleRemoveParticipant}
              />
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAddParticipant}
              disabled={loading}
            >
              + Add Participant
            </button>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Additional Costs</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="appetizers">Appetizers Subtotal</label>
                <input
                  type="number"
                  id="appetizers"
                  value={appetizerSubtotal}
                  onChange={(e) => setAppetizerSubtotal(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tax">Tax</label>
                <input
                  type="number"
                  id="tax"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tip">Tip</label>
                <input
                  type="number"
                  id="tip"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className={styles.totalSection}>
            <h3>Estimated Total: ${calculateTotal()}</h3>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Receipt' : 'Create Receipt')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateReceipt;
