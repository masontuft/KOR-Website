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

type ModalState = 'idle' | 'loading' | 'success' | 'error';
type SuccessAction = 'replaced' | 'mileage_added' | null;

const PartReplaceModal: React.FC<PartReplaceModalProps> = ({
  isOpen,
  onClose,
  part,
  onSuccess,
}) => {
  const [modalState, setModalState] = useState<ModalState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successAction, setSuccessAction] = useState<SuccessAction>(null);

  useEffect(() => {
    if (isOpen) {
      setModalState('idle');
      setErrorMessage('');
      setSuccessAction(null);
    }
  }, [isOpen]);

  if (!part || !isOpen) return null;

  const chainLike = isChainLike(part.label);
  const loading = modalState === 'loading';
  const formattedDate = formatReplacedDate(part.lastReplacedDate);
  const addLabel = part.unit === 'hours'
    ? `Add ${ADD_HOURS_AMOUNT} Hours`
    : `Add ${ADD_MILES_AMOUNT} Miles`;

  const handleSuccess = (action: SuccessAction) => {
    setSuccessAction(action);
    setModalState('success');
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const handleError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : 'Something went wrong';
    setErrorMessage(msg);
    setModalState('error');
  };

  const handleReplace = async (brokenWorn: 'worn_out' | 'broke') => {
    setModalState('loading');
    setErrorMessage('');
    try {
      const { baseUrl } = getApiConfig();
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
        brokenWorn,
        extraBody,
      });
      handleSuccess('replaced');
    } catch (err) {
      handleError(err);
    }
  };

  const handleAddMileage = async () => {
    setModalState('loading');
    setErrorMessage('');
    try {
      const { baseUrl } = getApiConfig();
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
    } catch (err) {
      handleError(err);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setModalState('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        {/* Success state */}
        {modalState === 'success' ? (
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
