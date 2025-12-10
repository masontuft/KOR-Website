# Data Converter Module

A reusable utility module for converting API response data with integer boolean values (0/1) to proper TypeScript booleans.

## Problem

Your API/JSON files store boolean values as integers (1 for true, 0 for false), but your TypeScript interfaces expect proper boolean types. This module bridges that gap.

## Usage

### Quick Start

```typescript
import { convertApiResponse, convertShopUsers, convertBike } from './modules/dataConverter';

// Option 1: Convert entire API response (automatically detects structure)
const response = await fetch('/api/shop-users').then(r => r.json());
const convertedResponse = convertApiResponse(response);

// Option 2: Convert just the users array
const users = convertShopUsers(response.users);

// Option 3: Convert a single bike
const bike = convertBike(rawBike);
```

### Available Functions

#### `convertApiResponse(apiResponse)`
**Best for:** Full API responses that may contain users, bikes, or part_data

Automatically detects and converts:
- `users[]` arrays
- `bikes[]` arrays  
- `part_data` objects

```typescript
// Before
{
  "users": [{
    "bikes": [{
      "part_data": {
        "sealant_show": 1,
        "dropper_show": 0
      }
    }]
  }]
}

// After
{
  "users": [{
    "bikes": [{
      "part_data": {
        "sealant_show": true,
        "dropper_show": false
      }
    }]
  }]
}
```

#### `convertShopUsers(users)`
**Best for:** When you only have the users array

```typescript
const rawUsers = fakeData.users;
const convertedUsers = convertShopUsers(rawUsers);
```

#### `convertBike(bike)`
**Best for:** Converting individual bike objects

```typescript
const bikes = response.bikes.map(convertBike);
```

#### `convertPartData(partData)`
**Best for:** Converting just the part_data object

```typescript
const partData = convertPartData(rawPartData);
```

#### `toBool(value)`
**Best for:** Converting individual values

```typescript
const isVisible = toBool(1); // true
const isHidden = toBool(0); // false
const alreadyBool = toBool(true); // true
```

### Boolean Fields Converted

The following fields are automatically converted from 0/1 to boolean:

- `sealant_show`
- `rear_suspension_show`
- `dropper_show`
- `front_fork_show`
- `AXS_show`
- `brake_pad_show` / `brake_pads_show`
- `brake_bleed_show`
- `brake_rotor_show` / `brake_rotors_show`

### Integration Examples

#### In React Components (Development Mode)

```typescript
import fakeData from './fakeShopUsers.json';
import { convertShopUsers } from './modules/dataConverter';

const Component = () => {
  useEffect(() => {
    const users = convertShopUsers(fakeData.users);
    setUsers(users);
  }, []);
};
```

#### In API Calls (Production)

```typescript
import { convertApiResponse } from './modules/dataConverter';

const fetchUsers = async () => {
  const response = await fetch('/api/users').then(r => r.json());
  const converted = convertApiResponse(response);
  return converted.users;
};
```

#### Custom Boolean Fields

If you need to convert additional fields not in the default list:

```typescript
import { convertBooleanFields } from './modules/dataConverter';

const customFields = ['my_custom_flag', 'another_bool'];
const converted = convertBooleanFields(myObject, customFields);
```

## Type Safety

All functions are TypeScript generics that preserve your original types while converting the boolean fields:

```typescript
interface MyUser {
  name: string;
  bikes: MyBike[];
}

const users: MyUser[] = convertShopUsers(rawUsers);
// Type is preserved as MyUser[]
```

## Notes

- Handles edge cases: strings ('1', 'true'), numbers (0, 1), and existing booleans
- Non-destructive: creates new objects, doesn't mutate originals
- Null-safe: only converts fields that exist in the object
- Works with both mock JSON files and live API responses
