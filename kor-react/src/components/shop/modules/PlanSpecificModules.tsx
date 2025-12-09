import React from 'react';
import FamilyPlanModules from './FamilyPlanModules';
import WelcomeHeader from '../sections/WelcomeHeader';
import PlanFeaturesBanner from '../sections/PlanFeaturesBanner';
import GettingStartedSection from '../sections/GettingStartedSection';
import QRCodeSection from '../sections/QRCodeSection';
import ShopInfoCards from '../sections/ShopInfoCards';
import FamilyPlanUsage from '../sections/FamilyPlanUsage';
import PlanFeaturesDisplay from '../sections/PlanFeaturesDisplay';
import ShopUsersAndBikes from '../ShopUsersAndBikes';
import SendNotificationsPanel from '../SendNotificationsPanel';
import SubscriptionDetails from '../../subscription/SubscriptionDetails';
import { DashboardSectionProps, CustomerUsageProps } from '../types';

import ShopMaintenanceView from '../ShopMaintenanceView';
import FamilyPlanQRCodeSection from '../sections/FamilyPlanQRCode';

interface PlanSpecificModulesProps
  extends DashboardSectionProps,
    CustomerUsageProps {
  planType: string;
  params: any; // For accessing URL params
}

const PlanSpecificModules: React.FC<PlanSpecificModulesProps> = ({
  shopUser,
  planFeatures,
  planType,
  customerCount,
  customerCountLoading,
  customerCountError,
  params
}) => {
  const normalizedPlanType = planType.toLowerCase();

  const renderModulesForPlan = () => {
    switch (normalizedPlanType) {
      case 'basic':
        return (
          <>
            {/* Header - always shown */}
            <WelcomeHeader shopUser={shopUser} planFeatures={planFeatures} />

            {/* Plan banner for basic */}
            <PlanFeaturesBanner
              shopUser={shopUser}
              planFeatures={planFeatures}
            />

            {/* Getting started - important for basic users */}
            <GettingStartedSection
              shopUser={shopUser}
              planFeatures={planFeatures}
            />

            {/* QR Code - basic users need this */}
            <QRCodeSection
              shopUser={shopUser}
              planFeatures={planFeatures}
              customerLabel='Customer'
              title='Customer QR Code'
              description='Seamless customer onboarding for your bike shop!'
              instructionText='For your customers:'
            />

            {/* Users & Bikes */}
            <div style={{ marginTop: '2rem' }}>
              <ShopUsersAndBikes
                accentColor={planFeatures?.color || '#667eea'}
              />
            </div>

            {/* Shop info cards */}
            <ShopInfoCards
              shopUser={shopUser}
              planFeatures={planFeatures}
              customerCount={customerCount}
              customerCountLoading={customerCountLoading}
              customerCountError={customerCountError}
            />

            {/* Subscription details */}
            <div style={{ marginTop: '2rem' }}>
              <SubscriptionDetails
                subscriptionId={shopUser?.subscription?.subId}
                onError={error =>
                  console.error('Subscription Details Error:', error)
                }
                onLoading={loading =>
                  console.log('Subscription Details Loading:', loading)
                }
              />
            </div>

            {/* Plan features */}
            <PlanFeaturesDisplay
              shopUser={shopUser}
              planFeatures={planFeatures}
            />

            {/* No notifications for basic */}
          </>
        );

      case 'family':
        return (
          <>
            {/* Header */}
            <WelcomeHeader shopUser={shopUser} planFeatures={planFeatures} />

            {/* Family plan specific modules*/}
            <FamilyPlanModules
              shopUser={shopUser}
              planFeatures={planFeatures}
            />
            <div style={{ marginTop: '2rem' }}>
              <ShopMaintenanceView
                accentColor={planFeatures?.color || '#667eea'}
              />
            </div>

            {/* QR Code for family plans - different wording */}
            <FamilyPlanQRCodeSection
              shopUser={shopUser}
              planFeatures={planFeatures}
            ></FamilyPlanQRCodeSection>
            {/* Family plan usage - full width, no shop info */}
            <FamilyPlanUsage
              shopUser={shopUser}
              planFeatures={planFeatures}
              customerCount={customerCount}
              customerCountLoading={customerCountLoading}
              customerCountError={customerCountError}
            />

            {/* Subscription details */}
            <div style={{ marginTop: '2rem' }}>
              <SubscriptionDetails
                subscriptionId={shopUser?.subscription?.subId}
                onError={error =>
                  console.error('Subscription Details Error:', error)
                }
                onLoading={loading =>
                  console.log('Subscription Details Loading:', loading)
                }
              />
            </div>
          </>
        );

      case 'premium':
        return (
          <>
            {/* Header */}
            <WelcomeHeader shopUser={shopUser} planFeatures={planFeatures} />

            {/* Plan banner */}
            <PlanFeaturesBanner
              shopUser={shopUser}
              planFeatures={planFeatures}
            />

            {/* Getting started */}
            <GettingStartedSection
              shopUser={shopUser}
              planFeatures={planFeatures}
            />

            {/* QR Code */}
            <QRCodeSection
              shopUser={shopUser}
              planFeatures={planFeatures}
              customerLabel='Customer'
              title='Customer QR Code'
              description='Seamless customer onboarding for your bike shop!'
              instructionText='For your customers:'
            />

            {/* Users & Bikes */}
            <div style={{ marginTop: '2rem' }}>
              <ShopUsersAndBikes
                accentColor={planFeatures?.color || '#667eea'}
              />
            </div>

            {/* Notifications - premium feature */}
            <div style={{ marginTop: '2rem' }}>
              <SendNotificationsPanel />
            </div>

            {/* Shop info cards */}
            <ShopInfoCards
              shopUser={shopUser}
              planFeatures={planFeatures}
              customerCount={customerCount}
              customerCountLoading={customerCountLoading}
              customerCountError={customerCountError}
            />

            {/* Subscription details */}
            <div style={{ marginTop: '2rem' }}>
              <SubscriptionDetails
                subscriptionId={shopUser?.subscription?.subId}
                onError={error =>
                  console.error('Subscription Details Error:', error)
                }
                onLoading={loading =>
                  console.log('Subscription Details Loading:', loading)
                }
              />
            </div>

            {/* Plan features */}
            <PlanFeaturesDisplay
              shopUser={shopUser}
              planFeatures={planFeatures}
            />
          </>
        );

      case 'pro':
        return (
          <>
            {/* Header */}
            <WelcomeHeader shopUser={shopUser} planFeatures={planFeatures} />

            {/* Plan banner */}
            <PlanFeaturesBanner
              shopUser={shopUser}
              planFeatures={planFeatures}
            />

            {/* Getting started */}
            <GettingStartedSection
              shopUser={shopUser}
              planFeatures={planFeatures}
            />

            {/* QR Code */}
            <QRCodeSection
              shopUser={shopUser}
              planFeatures={planFeatures}
              customerLabel='Customer'
              title='Customer QR Code'
              description='Seamless customer onboarding for your bike shop!'
              instructionText='For your customers:'
            />

            {/* Users & Bikes */}
            <div style={{ marginTop: '2rem' }}>
              <ShopUsersAndBikes
                accentColor={planFeatures?.color || '#667eea'}
              />
            </div>

            {/* Notifications - pro feature */}
            <div style={{ marginTop: '2rem' }}>
              <SendNotificationsPanel />
            </div>

            {/* Shop info cards */}
            <ShopInfoCards
              shopUser={shopUser}
              planFeatures={planFeatures}
              customerCount={customerCount}
              customerCountLoading={customerCountLoading}
              customerCountError={customerCountError}
            />

            {/* Subscription details */}
            <div style={{ marginTop: '2rem' }}>
              <SubscriptionDetails
                subscriptionId={shopUser?.subscription?.subId}
                onError={error =>
                  console.error('Subscription Details Error:', error)
                }
                onLoading={loading =>
                  console.log('Subscription Details Loading:', loading)
                }
              />
            </div>

            {/* Plan features */}
            <PlanFeaturesDisplay
              shopUser={shopUser}
              planFeatures={planFeatures}
            />
          </>
        );

      default:
        // Fallback to basic plan
        return (
          <>
            <WelcomeHeader shopUser={shopUser} planFeatures={planFeatures} />
            <GettingStartedSection
              shopUser={shopUser}
              planFeatures={planFeatures}
            />
            <ShopInfoCards
              shopUser={shopUser}
              planFeatures={planFeatures}
              customerCount={customerCount}
              customerCountLoading={customerCountLoading}
              customerCountError={customerCountError}
            />
          </>
        );
    }
  };

  return <>{renderModulesForPlan()}</>;
};

export default PlanSpecificModules;
