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
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [appetizerSubtotal, setAppetizerSubtotal] = useState('');
  const [tax, setTax] = useState('');
  const [tip, setTip] = useState('');
  const [participants, setParticipants] = useState([
    { name: '', mealSubtotal: '', includeApps: true }
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
        setParticipants(receipt.participants);

        // Convert stored tax rate back to dollar amount for display
        const mealTotal = receipt.participants.reduce((sum, p) => sum + (p.mealSubtotal || 0), 0);
        const subtotal = mealTotal + (receipt.appetizerSubtotal || 0);
        setTax(subtotal > 0 ? (receipt.tax * subtotal).toFixed(2) : 0);

        // Convert stored tip rate back to percentage for display
        setTip(receipt.tip > 0 ? (receipt.tip * 100).toFixed(2) : 0);
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
    setParticipants([...participants, { name: '', mealSubtotal: '', includeApps: true }]);
  };

  const handleRemoveParticipant = (index) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    const mealTotal = participants.reduce((sum, p) => sum + (parseFloat(p.mealSubtotal) || 0), 0);
    const subtotal = mealTotal + parseFloat(appetizerSubtotal || 0);
    const taxAmount = parseFloat(tax || 0);
    const tipPercentage = parseFloat(tip || 0) / 100;
    const tipAmount = subtotal * tipPercentage;
    const total = subtotal + taxAmount + tipAmount;
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
      // Calculate subtotal for tax rate calculation
      const mealTotal = participants.reduce((sum, p) => sum + (parseFloat(p.mealSubtotal) || 0), 0);
      const subtotal = mealTotal + (parseFloat(appetizerSubtotal) || 0);

      // Calculate tax rate from absolute tax amount
      const taxAmount = parseFloat(tax) || 0;
      const taxRate = subtotal > 0 ? taxAmount / subtotal : 0;

      // Convert tip percentage to decimal rate
      const tipPercentage = parseFloat(tip) || 0;
      const tipRate = tipPercentage / 100;

      const receiptData = {
        title,
        date,
        appetizerSubtotal: parseFloat(appetizerSubtotal) || 0,
        tax: taxRate,  // Store as rate (e.g., 0.08875)
        tip: tipRate,  // Store as rate (e.g., 0.20)
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
                <label htmlFor="tax">Tax (Total $)</label>
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
                <label htmlFor="tip">Tip (%)</label>
                <input
                  type="number"
                  id="tip"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  placeholder="20"
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
