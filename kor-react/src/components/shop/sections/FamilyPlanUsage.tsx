import React from 'react';
import { DashboardSectionProps, CustomerUsageProps } from '../types';

interface FamilyPlanUsageProps
  extends DashboardSectionProps,
    CustomerUsageProps {}

const FamilyPlanUsage: React.FC<FamilyPlanUsageProps> = ({
  planFeatures,
  customerCount,
  customerCountLoading,
  customerCountError
}) => {
  return (
    <div
      style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* CENTERED HEADING */}
        <h3
          style={{
            marginTop: 0,
            color: '#333',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          📊 Plan Usage
        </h3>

        <div style={{ lineHeight: 1.6 }}>
          <div style={{ marginBottom: '1rem' }}>
            {/* LABELS ABOVE BAR */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
                maxWidth: '700px', // matches bar width
                width: '100%',
                margin: '0 auto'
              }}
            >
              <strong>Family Members</strong>

              <span>
                {customerCountLoading ? 'Loading…' : (customerCount ?? 0)} /{' '}
                {planFeatures?.maxCustomers === -1
                  ? '∞'
                  : planFeatures?.maxCustomers}
              </span>
            </div>

            {/* PROGRESS BAR */}
            {planFeatures?.maxCustomers !== -1 && (
              <div
                style={{
                  maxWidth: '700px',
                  width: '100%',
                  margin: '0 auto'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#e9ecef',
                    height: '18px',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: planFeatures?.color || '#007bff',
                      height: '100%',
                      width: `${
                        planFeatures?.maxCustomers &&
                        planFeatures.maxCustomers > 0
                          ? Math.min(
                              100,
                              Math.round(
                                ((customerCount ?? 0) /
                                  planFeatures.maxCustomers) *
                                  100
                              )
                            )
                          : 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {customerCountError && (
              <p
                style={{
                  color: '#e74c3c',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }}
              >
                Error loading family members: {customerCountError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyPlanUsage;
