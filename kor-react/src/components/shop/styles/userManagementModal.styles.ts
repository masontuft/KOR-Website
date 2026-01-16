// Styles for the family plan user management modal and confirm delete modal
// Kept in plain objects for easy reuse and maintainability.

export const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

export const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: 8,
  padding: '1.5rem',
  width: '100%',
  maxWidth: 520,
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
};

export const modalHeaderStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: '0.25rem',
  fontSize: '1.2rem',
  fontWeight: 600,
  color: '#222',
};

export const modalSubtextStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: '1rem',
  fontSize: '0.9rem',
  color: '#555',
};

export const userListContainerStyle: React.CSSProperties = {
  maxHeight: 320,
  overflowY: 'auto',
  marginTop: '0.5rem',
  marginBottom: '1rem',
};

export const userListItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 0.25rem',
  borderBottom: '1px solid #f1f1f1',
};

export const userListInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginRight: '0.75rem',
};

export const userListNameStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 500,
  color: '#222',
};

export const userListEmailStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#666',
};

export const deleteButtonStyle = (disabled: boolean): React.CSSProperties => ({
  border: 'none',
  backgroundColor: disabled ? '#f5b7b1' : '#e74c3c',
  color: '#ffffff',
  borderRadius: '50%',
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '0.9rem',
  lineHeight: 1,
});

export const modalFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '0.75rem',
};

export const modalButtonStyle = (
  variant: 'primary' | 'secondary',
): React.CSSProperties => ({
  border: 'none',
  borderRadius: 6,
  padding: '0.5rem 1.1rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
  backgroundColor: variant === 'primary' ? '#3B82F6' : '#e0e0e0',
  color: variant === 'primary' ? '#ffffff' : '#333333',
  marginLeft: '0.5rem',
});

export const errorMessageStyle: React.CSSProperties = {
  backgroundColor: '#ffe6e6',
  color: '#c0392b',
  padding: '0.5rem 0.75rem',
  borderRadius: 4,
  fontSize: '0.85rem',
  marginBottom: '0.75rem',
};

export const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '1rem 0.5rem',
  fontSize: '0.9rem',
  color: '#777',
};

// Confirm delete modal specific styles

export const confirmModalContentStyle: React.CSSProperties = {
  ...modalContentStyle,
  maxWidth: 460,
};

export const confirmModalHeaderStyle: React.CSSProperties = {
  ...modalHeaderStyle,
  marginBottom: '0.75rem',
};

export const confirmModalTextStyle: React.CSSProperties = {
  ...modalSubtextStyle,
  marginBottom: '1.25rem',
};

export const confirmModalFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.5rem',
};

export const confirmButtonStyle = (
  variant: 'cancel' | 'danger',
  disabled: boolean,
): React.CSSProperties => ({
  border: 'none',
  borderRadius: 6,
  padding: '0.5rem 1.1rem',
  fontSize: '0.9rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor:
    variant === 'danger'
      ? disabled
        ? '#f5b7b1'
        : '#e74c3c'
      : '#e0e0e0',
  color: variant === 'danger' ? '#ffffff' : '#333333',
});
