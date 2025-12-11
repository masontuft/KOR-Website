import React from 'react';
import {
  modalOverlayStyle,
  confirmModalContentStyle,
  confirmModalHeaderStyle,
  confirmModalTextStyle,
  confirmModalFooterStyle,
  confirmButtonStyle,
} from '../styles/userManagementModal.styles';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  isDeleting
}) => {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle} onClick={onCancel}>
      <div style={confirmModalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={confirmModalHeaderStyle}>Confirm Deletion</h3>
        <p style={confirmModalTextStyle}>
          Are you sure you want to remove <strong>{userName}</strong> from your family plan? This action cannot be undone.
        </p>

        <div style={confirmModalFooterStyle}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={confirmButtonStyle('cancel', isDeleting)}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={confirmButtonStyle('danger', isDeleting)}
          >
            {isDeleting ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
