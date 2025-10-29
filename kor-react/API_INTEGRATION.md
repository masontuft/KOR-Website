# KOR API Integration Documentation

This document explains how the React app integrates with the KOR Express backend API to provide dynamic, real-time dashboard content.

## Overview

The React app now connects to the KOR backend API (`https://jmrcycling.com:3001`) to fetch live shop data, customer information, and enable real-time notifications. This creates a fully functional shop management dashboard.

## API Service Architecture

## Core API Service
**Location:** `src/services/korAPI.ts`#

The `KORAPIService` class provides a clean interface to all backend endpoints:

```typescript
import { korAPI } from '../services/korAPI';

// Get shop data by Auth0 user ID
const shopData = await korAPI.loginShop(user.sub, user.email);

// Get customers for a shop
const customers = await korAPI.getShopUsers(shop.shop_token);

// Send notifications to customers
await korAPI.sendPushNotifications(shopName, shopToken, message);
```

### Available API Endpoints

#### Shop Authentication
- `POST /loginShop` - Authenticate shop using Auth0 sub ID
- Returns: Shop info (name, code, plan, token)

#### Customer Management
- `POST /getShopUsers` - Get all customers for a shop
- Returns: Customer list with activity status and last login

#### Notifications
- `POST /sendPushNotifications` - Send push notifications to customers
- `GET /getDailyReport` - Get pending service notifications

#### Admin Functions
- `GET /getShops` - Get all shops (admin only)
- `POST /changeShopPassword` - Update shop password
- `POST /changeShopPhone` - Update shop phone number

## Dashboard Components

### Standard Dashboard
**Location:** `src/components/shop/ShopDashboard.tsx`
- Parameter-based customization
- Static content with legacy URL parameter support
- Fallback when API is unavailable

### Enhanced Dashboard
**Location:** `src/components/shop/ShopDashboardEnhanced.tsx`
- Full API integration with real-time data
- Live customer management
- Notification sending capability
- Service reporting dashboard

## Integration Features

### Real-Time Customer Data
```typescript
// Customer information displayed live from database
const customers = await korAPI.getShopUsers(shopToken);

// Shows:
- Customer names and emails
- Last login dates
- Activity status (active/inactive/pending)
- Total customer count
```

### Live Notification System
```typescript
// Send notifications to all shop customers
await korAPI.sendPushNotifications(
  "Downtown Cycles",
  "shop_token_123",
  "Your bike service is due!"
);
```

### Service Reporting
```typescript
// Get pending services and notifications
const report = await korAPI.getDailyReport(shopToken);

// Shows:
- Pending service reminders
- Customer service dates
- Service types and notes
```

## URL Parameter Integration

The system supports both API data and legacy URL parameters for maximum compatibility:

### Parameter Priority
1. **API Data** (if available and user authenticated)
2. **URL Parameters** (fallback for compatibility)
3. **Default Values** (basic shop setup)

### Supported Parameters
```
?sub_id=123456&invoice_id=789012&plan_type=Premium&shop_name=Elite%20Cycles&shop_code=EC01
```

### Example Usage
```typescript
// API data takes priority
const shopInfo = dashboardData.shopInfo || {
  shop_name: params.shop_name || 'Your Bike Shop',
  shop_code: params.shop_code || 'SHOP001',
  plan_type: params.plan_type || 'Basic',
  shop_token: 'fallback-token'
};
```

## Testing the Integration

### Test URLs

**Enhanced Dashboard with API:**
```
http://localhost:3000/demo/enhanced-dashboard
```

**Standard Dashboard with Parameters:**
```
http://localhost:3000/shop/dashboard?sub_id=123&invoice_id=456&plan_type=Premium&shop_name=Test%20Cycles&shop_code=TC01
```

### Testing Flow
1. **Login with Auth0** - Authenticate user
2. **API Data Loading** - Fetch shop info from backend
3. **Customer Data** - Display real customer list
4. **Send Notifications** - Test push notification system
5. **Service Reports** - View pending maintenance alerts

### Development Features
- **API Status Indicators** - Shows which APIs loaded successfully
- **Error Handling** - Graceful degradation to parameter-based display
- **Refresh Button** - Reload data from API
- **Debug Panel** - View API response status (development only)

## Environment Configuration

### Required Environment Variables
```bash
# API Configuration
REACT_APP_API_BASE_URL=https://jmrcycling.com:3001
REACT_APP_API_AUTH_TOKEN=1893784827439273928203838

# Auth0 Configuration (existing)
REACT_APP_AUTH0_DOMAIN=dev-oseu3r74.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=BIiXW01dEohpU5qLM6FTEbBUYDVFUo7v
```

### API Response Examples

**Shop Login Response:**
```json
{
  "message": "success",
  "plan_type": [{
    "shop_name": "Downtown Cycles",
    "shop_code": "DC01",
    "plan_type": "Premium",
    "shop_token": "abc123xyz789"
  }]
}
```

**Customer List Response:**
```json
{
  "message": "success",
  "shop_name": "Downtown Cycles",
  "user_count": 25,
  "users": [
    {
      "strava_user_id": "12345",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "last_login": "2024-01-15T10:30:00Z",
      "shop_activity": "active"
    }
  ]
}
```

## Error Handling

The system includes comprehensive error handling:

### API Failures
- **Graceful Degradation:** Falls back to parameter-based display
- **User Feedback:** Shows loading states and error messages
- **Retry Mechanism:** Refresh button to retry failed API calls

### Authentication Errors
- **Auth0 Integration:** Seamless login flow
- **Token Management:** Automatic token handling
- **Fallback Display:** Parameter-based shop info when API unavailable

### Network Issues
- **Connection Timeouts:** Handled with user-friendly messages
- **CORS Issues:** Proper headers and error handling
- **Rate Limiting:** Graceful handling of API limits

## Production Considerations

### Security
- **API Tokens:** Store in environment variables
- **HTTPS Only:** Enforce secure connections
- **CORS Configuration:** Proper origin restrictions

### Performance
- **Caching Strategy:** Consider API response caching
- **Lazy Loading:** Load customer data on demand
- **Error Boundaries:** Prevent crashes from API failures

### Monitoring
- **API Health Checks:** Monitor backend availability
- **Error Logging:** Track API failures and user issues
- **Performance Metrics:** Monitor load times and response rates

## Future Enhancements

### Planned Features
- **Real-time Updates:** WebSocket integration for live data
- **Advanced Analytics:** Customer behavior tracking
- **Bulk Operations:** Mass customer management
- **API Rate Limiting:** Handle high-volume usage
- **Offline Mode:** Cache data for offline access

### Integration Opportunities
- **Mobile App Sync:** Share data with KOR mobile app
- **Third-party APIs:** Integrate with external services
- **Webhook Support:** Real-time event notifications
- **Export Features:** Download customer and service data

This integration transforms the React app from a static parameter-based interface into a fully functional, real-time shop management system connected to the actual KOR backend infrastructure.
