import { useState } from 'react';
import split from '../../utils/split';
import styles from './ReceiptCard.module.css';

const ReceiptCard = ({ receipt, onDelete, onEdit }) => {
  const [expandedPerson, setExpandedPerson] = useState(null);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      await onDelete(receipt._id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const calculateTotal = () => {
    // Calculate subtotal (meals + appetizers)
    const subtotal = receipt.participants.reduce((sum, p) => sum + p.mealSubtotal, 0) + (receipt.appetizerSubtotal || 0);

    // Tax and tip are now stored as rates, so multiply by subtotal
    const taxAmount = subtotal * (receipt.tax || 0);
    const tipAmount = subtotal * (receipt.tip || 0);

    const total = subtotal + taxAmount + tipAmount;
    return total.toFixed(2);
  };

  // Calculate split details - tax and tip are already rates in the database
  const splitDetails = receipt.participants && receipt.participants.length > 0
    ? split(receipt.participants, receipt.appetizerSubtotal || 0, receipt.tax || 0, receipt.tip || 0)
    : [];

  const togglePerson = (index) => {
    setExpandedPerson(expandedPerson === index ? null : index);
  };

  const handleEdit = () => {
    onEdit(receipt._id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{receipt.title}</h3>
          <p className={styles.date}>{formatDate(receipt.date)}</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.total}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>${calculateTotal()}</span>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.editBtn}
              onClick={handleEdit}
              title="Edit receipt">
              ✏️
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              title="Delete receipt">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.participants}>
        {splitDetails.map((person, index) => (
          <div key={index} className={styles.personContainer}>
            <div
              className={styles.personRow}
              onClick={() => togglePerson(index)}
            >
              <span className={styles.personName}>{person.name}</span>
              <span className={styles.personAmount}>${person.total.toFixed(2)}</span>
            </div>

            {expandedPerson === index && (
              <div className={styles.breakdown}>
                <div className={styles.breakdownRow}>
                  <span>Meal Subtotal</span>
                  <span>${person.mealSubtotal.toFixed(2)}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Appetizer Share</span>
                  <span>${person.appetizerShare.toFixed(2)}</span>
                </div>
                <div className={styles.breakdownDivider}></div>
                <div className={styles.breakdownRow}>
                  <span>Subtotal</span>
                  <span>${person.preTaxpreTipSubtotal.toFixed(2)}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Tax</span>
                  <span>${person.tax.toFixed(2)}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Tip</span>
                  <span>${person.tip.toFixed(2)}</span>
                </div>
                <div className={styles.breakdownDivider}></div>
                <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
                  <span>Total</span>
                  <span>${person.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiptCard;
