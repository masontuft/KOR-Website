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
  borderRadius: 10,
  padding: '1.25rem',
  width: '100%',
  maxWidth: 560,
  boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
};

export const modalTitleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
};

export const modalHeaderStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.15rem',
  fontWeight: 650,
  color: '#1f2937',
};

export const closeIconButtonStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  color: '#374151',
  borderRadius: 8,
  width: 34,
  height: 34,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

export const tabsContainerStyle: React.CSSProperties = {
  display: 'flex',
  marginTop: '0.9rem',
  borderBottom: '1px solid #eef0f3',
};

export const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  border: 'none',
  background: 'transparent',
  padding: '0.65rem 0.9rem',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: active ? 650 : 550,
  color: active ? '#111827' : '#6b7280',
  borderBottom: active ? '2px solid #3B82F6' : '2px solid transparent',
  marginBottom: -1,
});

export const tabPanelStyle: React.CSSProperties = {
  paddingTop: '1rem',
};

export const modalSubtextStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: '0.9rem',
  fontSize: '0.9rem',
  color: '#4b5563',
  lineHeight: 1.4,
};

export const infoNoticeStyle: React.CSSProperties = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #e5e7eb',
  color: '#374151',
  padding: '0.6rem 0.75rem',
  borderRadius: 8,
  fontSize: '0.85rem',
  marginBottom: '0.75rem',
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
  padding: '0.65rem 0.25rem',
  borderBottom: '1px solid #f1f5f9',
  gap: '0.75rem',
};

export const userListInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginRight: '0.25rem',
  minWidth: 0,
  flex: '1 1 auto',
};

export const userListNameRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  minWidth: 0,
};

export const userListNameStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 600,
  color: '#111827',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const adminBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  border: '1px solid #dbeafe',
  backgroundColor: '#eff6ff',
  color: '#1d4ed8',
  padding: '0.15rem 0.45rem',
  borderRadius: 999,
  fontSize: '0.75rem',
  fontWeight: 650,
  flex: '0 0 auto',
};

export const userListEmailStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#666',
};

export const deleteButtonStyle = (disabled: boolean): React.CSSProperties => ({
  border: '1px solid #fee2e2',
  backgroundColor: disabled ? '#f9fafb' : '#ffffff',
  color: disabled ? '#9ca3af' : '#dc2626',
  borderRadius: 10,
  width: 36,
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'not-allowed' : 'pointer',
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
  color: '#6b7280',
};

// Admin settings tab styles

export const adminListContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxHeight: 320,
  overflowY: 'auto',
  paddingRight: 2,
};

export const adminListItemStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '18px 1fr auto',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.65rem 0.75rem',
  border: '1px solid #eef0f3',
  borderRadius: 10,
  cursor: 'pointer',
  userSelect: 'none',
};

export const adminRadioStyle: React.CSSProperties = {
  width: 16,
  height: 16,
};

export const adminRowRightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
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
