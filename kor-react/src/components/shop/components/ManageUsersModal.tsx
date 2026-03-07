import React, { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Trash2, X, Shield } from 'lucide-react';
import {
  ShopUser,
  fetchShopUsers,
  getShopHead,
  removeUserShop,
  setUserHead,
  getApiConfig
} from '../services/shopMaintenanceApi';
import {
  getAdminUserId,
  setAdminUserId as saveAdminUserId
} from '../utils/familyPlanAdmin';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {
  modalOverlayStyle,
  modalContentStyle,
  modalTitleRowStyle,
  modalHeaderStyle,
  closeIconButtonStyle,
  tabsContainerStyle,
  tabButtonStyle,
  tabPanelStyle,
  modalSubtextStyle,
  userListContainerStyle,
  userListItemStyle,
  userListInfoStyle,
  userListNameRowStyle,
  userListNameStyle,
  userListEmailStyle,
  adminBadgeStyle,
  deleteButtonStyle,
  adminListContainerStyle,
  adminListItemStyle,
  adminRadioStyle,
  adminRowRightStyle,
  infoNoticeStyle,
  modalFooterStyle,
  adminFooterStyle,
  modalButtonStyle,
  errorMessageStyle,
  emptyStateStyle,
  unsavedChangesBadgeStyle,
  adminInnerStyle
} from '../styles/userManagementModal.styles';

interface ManageUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted?: () => void;
}

type ManageUsersTab = 'family' | 'admin';

const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  isOpen,
  onClose,
  onUserDeleted
}) => {
  const { user: auth0User } = useAuth0();

  const [activeTab, setActiveTab] = useState<ManageUsersTab>('family');
  const [users, setUsers] = useState<ShopUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ShopUser | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);

  // Tracks the currently selected admin in the UI and persists to sessionStorage.
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  // Tracks the last successfully saved admin ID to detect changes.
  const [savedAdminId, setSavedAdminId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = getApiConfig();
      const [fetchedUsers, serverAdminId] = await Promise.all([
        fetchShopUsers(config),
        getShopHead(config).then(head => (head != null ? head.strava_user_id : null)).catch(() => null)
      ]);
      setUsers(fetchedUsers);

      // Server admin takes priority; fall back to whatever is in sessionStorage.
      const adminId = serverAdminId ?? getAdminUserId();
      setSelectedAdminId(adminId);
      setSavedAdminId(adminId);

      if (serverAdminId != null) {
        saveAdminUserId(serverAdminId);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('family');
      loadUsers();
    }
  }, [isOpen, loadUsers]);

  const handleDeleteClick = (user: ShopUser) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    setError(null);
    try {
      const config = getApiConfig();
      await removeUserShop(config, selectedUser.strava_user_id);

      // Remove user from local state
      setUsers(prev => prev.filter(u => u.strava_user_id !== selectedUser.strava_user_id));

      // If the deleted user was selected as admin, clear the selection.
      setSelectedAdminId(prev => (prev === selectedUser.strava_user_id ? null : prev));

      // Close confirmation modal
      setShowConfirmModal(false);
      setSelectedUser(null);

      // Notify parent component
      onUserDeleted?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete user';
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

  /**
   * Saves the selected admin to the backend API.
   * Updates savedAdminId state on success.
   */
  const handleSaveAdmin = async () => {
    if (selectedAdminId == null) {
      setError('Please select a user to set as admin');
      return;
    }

    setIsSavingAdmin(true);
    setError(null);

    try {
      const config = getApiConfig();
      await setUserHead(config, selectedAdminId);

      // Mark this selection as saved
      setSavedAdminId(selectedAdminId);

      // Persist to sessionStorage and notify listeners
      saveAdminUserId(selectedAdminId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save admin selection';
      setError(errorMessage);
    } finally {
      setIsSavingAdmin(false);
    }
  };


  if (!isOpen) return null;

  const getUserDisplayName = (user: ShopUser): string => {
    const fullName = `${user.first_name} ${user.last_name}`.trim();
    return fullName || user.email;
  };

  const auth0Email = typeof auth0User?.email === 'string' ? auth0User.email : null;

  const isCurrentUser = (member: ShopUser): boolean => {
    if (!auth0Email) return false;
    return member.email?.toLowerCase() === auth0Email.toLowerCase();
  };

  const getUserDisplayNameWithYou = (member: ShopUser): string => {
    const base = getUserDisplayName(member);
    return selectedAdminId === member.strava_user_id && isCurrentUser(member)
      ? `${base} (You)`
      : base;
  };

  const selectedAdminUser =
    selectedAdminId == null
      ? null
      : (users.find(u => u.strava_user_id === selectedAdminId) ?? null);

  const selectedAdminDisplayName = selectedAdminUser
    ? getUserDisplayNameWithYou(selectedAdminUser)
    : null;

  // Check if there are unsaved changes
  const hasUnsavedChanges = selectedAdminId !== savedAdminId;

  const unsavedChangesBadge = hasUnsavedChanges ? (
    <span style={unsavedChangesBadgeStyle}>(Unsaved changes)</span>
  ) : null;

  return (
    <>
      <div style={modalOverlayStyle} onClick={onClose}>
        <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
          <div style={modalTitleRowStyle}>
            <h3 style={modalHeaderStyle}>Manage Users</h3>
            <button
              type='button'
              onClick={onClose}
              style={closeIconButtonStyle}
              aria-label='Close'
              title='Close'
            >
              <X size={18} />
            </button>
          </div>

          <div style={tabsContainerStyle}>
            <button
              type='button'
              onClick={() => setActiveTab('family')}
              style={tabButtonStyle(activeTab === 'family')}
            >
              Family Members
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('admin')}
              style={tabButtonStyle(activeTab === 'admin')}
            >
              Admin Settings
            </button>
          </div>

          {error && <div style={errorMessageStyle}>{error}</div>}

          {activeTab === 'family' ? (
            <div style={tabPanelStyle}>
              <p style={modalSubtextStyle}>
                Remove members from your family plan.
              </p>

              <div style={userListContainerStyle}>
                {loading ? (
                  <div style={emptyStateStyle}>Loading users...</div>
                ) : users.length === 0 ? (
                  <div style={emptyStateStyle}>No family members found</div>
                ) : (
                  users.map(user => (
                    <div key={user.strava_user_id} style={userListItemStyle}>
                      <div style={userListInfoStyle}>
                        <div style={userListNameRowStyle}>
                          <div style={userListNameStyle}>
                            {getUserDisplayNameWithYou(user)}
                          </div>
                          {selectedAdminId === user.strava_user_id && (
                            <span style={adminBadgeStyle}>
                              <Shield size={14} /> Admin
                            </span>
                          )}
                        </div>
                        <div style={userListEmailStyle}>{user.email}</div>
                      </div>
                      <button
                        type='button'
                        style={deleteButtonStyle(isDeleting)}
                        onClick={() => handleDeleteClick(user)}
                        disabled={isDeleting}
                        aria-label={`Remove ${getUserDisplayName(user)}`}
                        title='Remove'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div style={tabPanelStyle}>
              <p style={modalSubtextStyle}>
                Choose one family member to be the admin of the family plan.
              </p>

              {selectedAdminUser ? (
                <div style={infoNoticeStyle}>
                  Current admin: <strong>{selectedAdminDisplayName}</strong>
                  {unsavedChangesBadge}
                </div>
              ) : (
                <div style={infoNoticeStyle}>
                  No admin selected
                  {unsavedChangesBadge}
                </div>
              )}

              <div style={adminListContainerStyle}>
                {loading ? (
                  <div style={emptyStateStyle}>Loading users...</div>
                ) : users.length === 0 ? (
                  <div style={emptyStateStyle}>No family members found</div>
                ) : (
                  users.map(user => (
                    <label key={user.strava_user_id} style={adminListItemStyle}>
                      <input
                        type='radio'
                        name='family-plan-admin'
                        checked={selectedAdminId === user.strava_user_id}
                        onChange={() => setSelectedAdminId(user.strava_user_id)}
                        style={adminRadioStyle}
                      />
                      <div style={adminInnerStyle}>
                        <div style={userListNameStyle}>{getUserDisplayNameWithYou(user)}</div>
                        <div style={userListEmailStyle}>{user.email}</div>
                      </div>
                      <div style={adminRowRightStyle}>
                        {selectedAdminId === user.strava_user_id && (
                          <span style={adminBadgeStyle}>
                            <Shield size={14} /> Admin
                          </span>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>

              <div style={adminFooterStyle}>
                <button
                  type='button'
                  style={modalButtonStyle('secondary')}
                  onClick={onClose}
                  disabled={isSavingAdmin}
                >
                  Close
                </button>
                <button
                  type='button'
                  style={{
                    ...modalButtonStyle('primary'),
                    opacity: !hasUnsavedChanges || isSavingAdmin ? 0.6 : 1
                  }}
                  onClick={handleSaveAdmin}
                  disabled={!hasUnsavedChanges || isSavingAdmin}
                  title='Save admin selection'
                >
                  {isSavingAdmin ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div style={modalFooterStyle}>
              <button type='button' style={modalButtonStyle('secondary')} onClick={onClose}>
                Close
              </button>
            </div>
          )}
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
