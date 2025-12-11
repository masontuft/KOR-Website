import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../types/shopUsersAndBikes.types';
import { fetchShopUsers, removeUserFromShop, getApiConfig } from '../services/shopMaintenanceApi';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {
  modalOverlayStyle,
  modalContentStyle,
  modalHeaderStyle,
  modalSubtextStyle,
  userListContainerStyle,
  userListItemStyle,
  userListInfoStyle,
  userListNameStyle,
  userListEmailStyle,
  deleteButtonStyle,
  modalFooterStyle,
  modalButtonStyle,
  errorMessageStyle,
  emptyStateStyle,
} from '../styles/userManagementModal.styles';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted?: () => void;
}

const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  isOpen,
  onClose,
  onUserDeleted
}) => {
  const [users, setUsers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<FamilyMember | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = getApiConfig();
      const fetchedUsers = await fetchShopUsers(config);
      
      // Transform users to FamilyMember format
      const familyMembers: FamilyMember[] = fetchedUsers.map((user: any) => ({
        id: user.strava_user_id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        strava_user_id: user.strava_user_id,
      }));
      
      setUsers(familyMembers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: FamilyMember) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    setError(null);
    try {
      const config = getApiConfig();
      await removeUserFromShop(config, selectedUser.id);
      
      // Remove user from local state
      setUsers(users.filter(u => u.id !== selectedUser.id));
      
      // Close confirmation modal
      setShowConfirmModal(false);
      setSelectedUser(null);
      
      // Notify parent component
      onUserDeleted?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      setShowConfirmModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setShowConfirmModal(false);
      setSelectedUser(null);
    }
  };

  if (!isOpen) return null;

  const getUserDisplayName = (user: FamilyMember): string => {
    const fullName = `${user.first_name} ${user.last_name}`.trim();
    return fullName || user.email;
  };

  return (
    <>
      <div style={modalOverlayStyle} onClick={onClose}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={modalHeaderStyle}>Manage Family Members</h3>
          <p style={modalSubtextStyle}>
            Click the ✕ button next to a member's name to remove them from your family plan.
          </p>

          {error && (
            <div style={errorMessageStyle}>
              {error}
            </div>
          )}

          <div style={userListContainerStyle}>
            {loading ? (
              <div style={emptyStateStyle}>Loading users...</div>
            ) : users.length === 0 ? (
              <div style={emptyStateStyle}>No family members found</div>
            ) : (
              users.map((user) => (
                <div key={user.id} style={userListItemStyle}>
                  <div style={userListInfoStyle}>
                    <div style={userListNameStyle}>{getUserDisplayName(user)}</div>
                    <div style={userListEmailStyle}>{user.email}</div>
                  </div>
                  <button
                    style={deleteButtonStyle(isDeleting)}
                    onClick={() => handleDeleteClick(user)}
                    disabled={isDeleting}
                    title="Remove user"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={modalFooterStyle}>
            <button
              style={modalButtonStyle('secondary')}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showConfirmModal}
        userName={selectedUser ? getUserDisplayName(selectedUser) : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ManageUsersModal;
