import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { replacePart, addMileage } from '../services/partReplaceApi';
import { getApiConfig } from '../services/shopMaintenanceApi';
import { formatReplacedDate, isChainLike, ADD_MILES_AMOUNT, ADD_HOURS_AMOUNT } from './wearUtils';
import {
  overlayStyle,
  contentStyle,
  titleRowStyle,
  titleStyle,
  closeButtonStyle,
  wornTextStyle,
  dateTextStyle,
  questionStyle,
  buttonRowStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  dangerButtonStyle,
  dividerStyle,
  addButtonStyle,
  errorStyle,
  successContainerStyle,
  successTextStyle,
  disabledButtonStyle,
} from '../styles/partReplaceModal.styles';

export interface PartEntry {
  label: string;
  wearPercent: number;
  bikeName: string;
  ownerName: string;
  ownerId: number;
  icon: string;
  usedAmount: number;
  periodAmount: number;
  lastReplacedDate: string | null;
  bikeId: string | number;
  unit: 'miles' | 'hours';
  partType: string;
  replaceEndpoint: string;
  usedBodyKey: string;
}

interface PartReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  part: PartEntry | null;
  onSuccess: () => void;
}

type ModalState = 'idle' | 'confirming' | 'loading' | 'success' | 'error';
type SuccessAction = 'replaced' | 'mileage_added' | null;
type PendingAction =
  | { type: 'replace'; brokenWorn: 'worn_out' | 'broke' }
  | { type: 'addMileage' }
  | null;

const PartReplaceModal: React.FC<PartReplaceModalProps> = ({
  isOpen,
  onClose,
  part,
  onSuccess,
}) => {
  const [modalState, setModalState] = useState<ModalState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successAction, setSuccessAction] = useState<SuccessAction>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    if (isOpen) {
      setModalState('idle');
      setErrorMessage('');
      setSuccessAction(null);
      setPendingAction(null);
    }
  }, [isOpen]);


  if (!part || !isOpen) return null;

  const chainLike = isChainLike(part.label);
  const loading = modalState === 'loading';

  const confirmMessage = pendingAction?.type === 'addMileage'
    ? `Are you sure you want to add ${part.unit === 'hours' ? `${ADD_HOURS_AMOUNT} hours` : `${ADD_MILES_AMOUNT} miles`}?`
    : `Are you sure you want to replace this part?`;
  const formattedDate = formatReplacedDate(part.lastReplacedDate);
  const addLabel = part.unit === 'hours'
    ? `Add ${ADD_HOURS_AMOUNT} Hours`
    : `Add ${ADD_MILES_AMOUNT} Miles`;

  const handleSuccess = (action: SuccessAction) => {
    setSuccessAction(action);
    setModalState('success');
    onSuccess();
  };

  const handleError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : 'Something went wrong';
    setErrorMessage(msg);
    setModalState('error');
  };

  const handleReplace = (brokenWorn: 'worn_out' | 'broke') => {
    setPendingAction({ type: 'replace', brokenWorn });
    setModalState('confirming');
  };

  const handleAddMileage = () => {
    setPendingAction({ type: 'addMileage' });
    setModalState('confirming');
  };

  const handleCancelConfirm = () => {
    setPendingAction(null);
    setModalState('idle');
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setModalState('loading');
    setErrorMessage('');
    try {
      const { baseUrl } = getApiConfig();
      if (pendingAction.type === 'replace') {
        const extraBody: Record<string, string> | undefined =
          part.partType === 'sealant'
            ? { sealant_hour_marker: String(Math.floor(Date.now() / 1000 / 60 / 60)) }
            : undefined;
        await replacePart({
          baseUrl,
          stravaUserId: part.ownerId,
          stravaWearBikeId: part.bikeId,
          bikeName: part.bikeName,
          replaceEndpoint: part.replaceEndpoint,
          usedBodyKey: part.usedBodyKey,
          partType: part.partType,
          usedAmount: part.usedAmount,
          brokenWorn: pendingAction.brokenWorn,
          extraBody,
        });
        handleSuccess('replaced');
      } else {
        await addMileage({
          baseUrl,
          stravaUserId: part.ownerId,
          bikeId: part.bikeId,
          bikeName: part.bikeName,
          partType: part.partType,
          usedBodyKey: part.usedBodyKey,
          unit: part.unit,
        });
        handleSuccess('mileage_added');
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleClose = () => {
    if (loading || modalState === 'confirming') return;
    setModalState('idle');
    setErrorMessage('');
    setPendingAction(null);
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        {/* Confirmation state */}
        {modalState === 'confirming' ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ ...questionStyle, fontSize: '1rem', marginBottom: '1.25rem' }}>
              {confirmMessage}
            </p>
            <div style={buttonRowStyle}>
              <button style={primaryButtonStyle} onClick={handleConfirm}>
                Yes
              </button>
              <button style={secondaryButtonStyle} onClick={handleCancelConfirm}>
                Cancel
              </button>
            </div>
          </div>
        ) : modalState === 'success' ? (
          <div style={successContainerStyle}>
            <CheckCircle size={36} color="#16a34a" />
            <p style={successTextStyle}>
              {successAction === 'mileage_added'
                ? part.unit === 'hours'
                  ? `${ADD_HOURS_AMOUNT} hours added!`
                  : `${ADD_MILES_AMOUNT} miles added!`
                : 'Part replaced!'}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={titleRowStyle}>
              <h2 style={titleStyle}>{part.label}</h2>
              <button style={closeButtonStyle} onClick={handleClose} disabled={loading}>
                <X size={18} />
              </button>
            </div>

            {/* Wear info */}
            <p style={wornTextStyle}>
              Worn: {part.usedAmount.toLocaleString()} out of {part.periodAmount.toLocaleString()} {part.unit}
            </p>
            {formattedDate && (
              <p style={dateTextStyle}>Last replaced {formattedDate}</p>
            )}

            {/* Error */}
            {modalState === 'error' && (
              <div style={errorStyle}>{errorMessage}</div>
            )}

            {/* Action buttons */}
            {chainLike ? (
              <>
                <p style={questionStyle}>How did the {part.label.toLowerCase()} reach replacement time?</p>
                <div style={buttonRowStyle}>
                  <button
                    style={loading ? disabledButtonStyle(primaryButtonStyle) : primaryButtonStyle}
                    onClick={() => handleReplace('worn_out')}
                    disabled={loading}
                  >
                    Worn Out
                  </button>
                  <button
                    style={loading ? disabledButtonStyle(dangerButtonStyle) : dangerButtonStyle}
                    onClick={() => handleReplace('broke')}
                    disabled={loading}
                  >
                    Broke
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={questionStyle}>Do you need to replace it?</p>
                <div style={buttonRowStyle}>
                  <button
                    style={loading ? disabledButtonStyle(primaryButtonStyle) : primaryButtonStyle}
                    onClick={() => handleReplace('worn_out')}
                    disabled={loading}
                  >
                    Yes
                  </button>
                  <button
                    style={loading ? disabledButtonStyle(secondaryButtonStyle) : secondaryButtonStyle}
                    onClick={handleClose}
                    disabled={loading}
                  >
                    No
                  </button>
                </div>
              </>
            )}

            {/* Add mileage section */}
            <div style={dividerStyle} />
            <button
              style={loading ? disabledButtonStyle(addButtonStyle) : addButtonStyle}
              onClick={handleAddMileage}
              disabled={loading}
            >
              {loading ? 'Working…' : addLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PartReplaceModal;
