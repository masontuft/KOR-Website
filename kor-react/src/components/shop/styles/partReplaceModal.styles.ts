// Styles for the Part Replace / Add Mileage modal.
// Plain style objects — same pattern as userManagementModal.styles.ts.

export const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

export const contentStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: 10,
  padding: '1.5rem',
  width: '90%',
  maxWidth: 400,
  boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
  position: 'relative',
};

export const titleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.75rem',
};

export const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#1f2937',
};

export const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6b7280',
  padding: 4,
  borderRadius: 6,
};

export const wornTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.95rem',
  color: '#4b5563',
  marginBottom: '0.25rem',
};

export const dateTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.85rem',
  color: '#9ca3af',
  marginBottom: '1rem',
};

export const questionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.95rem',
  color: '#374151',
  fontWeight: 500,
  marginBottom: '0.75rem',
};

export const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '1rem',
};

export const primaryButtonStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  borderRadius: 6,
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
  backgroundColor: '#3B82F6',
  color: '#ffffff',
  fontWeight: 600,
};

export const secondaryButtonStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  borderRadius: 6,
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
  backgroundColor: '#f0f0f0',
  color: '#333333',
  fontWeight: 500,
};

export const dangerButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  backgroundColor: '#FF1744',
};

export const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid #e5e7eb',
  marginBottom: '0.75rem',
};

export const addButtonStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: 6,
  padding: '0.5rem 1rem',
  fontSize: '0.9rem',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  color: '#374151',
  fontWeight: 500,
};

export const errorStyle: React.CSSProperties = {
  backgroundColor: '#ffe6e6',
  color: '#c0392b',
  padding: '0.5rem 0.75rem',
  borderRadius: 4,
  fontSize: '0.85rem',
  marginBottom: '0.75rem',
};

export const successContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1rem',
  gap: '0.5rem',
};

export const successTextStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#16a34a',
};

export const disabledButtonStyle = (base: React.CSSProperties): React.CSSProperties => ({
  ...base,
  opacity: 0.6,
  cursor: 'not-allowed',
});
