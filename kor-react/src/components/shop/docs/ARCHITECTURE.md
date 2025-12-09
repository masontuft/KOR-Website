# Shop Component Architecture

## 📁 Folder Structure

```
shop/
├── hooks/                      # Custom React hooks
│   ├── usePlanFeatures.ts
│   └── useShopMaintenance.ts   # ⭐ NEW - Manages all shop maintenance logic
├── services/                   # API communication
│   └── shopMaintenanceApi.ts   # ⭐ NEW - API calls for maintenance data
├── types/                      # TypeScript interfaces
│   ├── index.ts                # Existing types (ShopUser, PlanFeatures, etc.)
│   └── shopUsersAndBikes.types.ts  # ⭐ NEW - Maintenance-specific types
├── utils/                      # Helper functions
│   └── shopHelpers.ts          # ⭐ NEW - Formatting & utility functions
├── modules/                    # Business logic modules
│   └── dataConverter.ts        # Converts API data format
├── sections/                   # Reusable section components
├── WearBar/                    # Bike wear visualization components
└── ShopUsersandBikesMock.tsx   # Main component (to be refactored)
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
Each file has ONE responsibility:
- **Types**: Data structures only
- **Services**: API calls only
- **Hooks**: State management only
- **Utils**: Pure functions only
- **Components**: Rendering only

### 2. **Single Responsibility Principle**
Each function/component does ONE thing well.

### 3. **DRY (Don't Repeat Yourself)**
Reusable code is extracted into shared modules.

### 4. **Custom Hooks Pattern**
Business logic lives in hooks, not components.

## 🔄 Data Flow

```
API → Service → Hook → Component
     ↓           ↓        ↓
  fetch()    useState()  render()
```

1. **Service** makes API call
2. **Hook** manages state
3. **Component** renders UI

## 📝 Key Files

### `/types/shopUsersAndBikes.types.ts`
- `MaintenanceUser` - User with bikes
- `MaintenanceBike` - Bike with parts and service data
- `BikeState` - UI state for bike expansion
- `PartData` - Detailed part information
- `ServicePeriods` - Service interval data

### `/services/shopMaintenanceApi.ts`
- `fetchShopMaintenanceReports()` - Gets all users and bikes
- `getApiConfig()` - Centralized config management

### `/hooks/useShopMaintenance.ts`
- Fetches data on mount
- Manages expand/collapse state
- Handles search filtering
- Provides refresh functionality

### `/utils/shopHelpers.ts`
- `formatTimeAgo()` - Formats dates
- `getStatusColor()` - Status badge colors
- `getFullName()` - Name formatting
- `createBadgeBackground()` - Color utilities

## 🚀 Next Step

Refactor `ShopUsersandBikesMock.tsx` to use these modules:

```tsx
// Instead of 500 lines of mixed logic...
const ShopUsersAndBikes = () => {
  // Just use the hook!
  const {
    users,
    bikesByUser,
    loading,
    error,
    search,
    setSearch,
    toggleExpand,
    toggleAllBikes,
  } = useShopMaintenance();

  // Now just focus on rendering...
  return <div>...</div>;
};
```

## 🧪 Benefits

1. **Testable** - Each piece can be tested independently
2. **Maintainable** - Easy to find and fix code
3. **Reusable** - Functions/hooks can be used elsewhere
4. **Readable** - Clear structure and naming
5. **Scalable** - Easy to add new features
