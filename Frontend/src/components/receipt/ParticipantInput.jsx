import styles from './ParticipantInput.module.css';

const ParticipantInput = ({ participant, index, onChange, onRemove }) => {
  const handleChange = (field, value) => {
    onChange(index, {
      ...participant,
      [field]: value
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor={`name-${index}`}>Name</label>
          <input
            type="text"
            id={`name-${index}`}
            value={participant.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`mealSubtotal-${index}`}>Meal Cost</label>
          <input
            type="number"
            id={`mealSubtotal-${index}`}
            value={participant.mealSubtotal}
            onChange={(e) => handleChange('mealSubtotal', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className={styles.checkboxGroup}>
          <label htmlFor={`includeApps-${index}`}>
            <input
              type="checkbox"
              id={`includeApps-${index}`}
              checked={participant.includeApps}
              onChange={(e) => handleChange('includeApps', e.target.checked)}
            />
            Include in appetizers
          </label>
        </div>

        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => onRemove(index)}
          title="Remove participant"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ParticipantInput;
