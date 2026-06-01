# ExpenseSplitApp — Project Context

## Overview

**ExpenseSplitApp** is a React Native (v0.83.1) mobile application for splitting expenses among groups of people. It is written in TypeScript and targets both Android and iOS.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native | 0.83.1 |
| Language | TypeScript | ^5.8.3 |
| State Management | Redux Toolkit | ^2.12.0 |
| HTTP Client | Axios | ^1.16.1 |
| Navigation | React Navigation | ^7.x |
| Secure Storage | react-native-keychain | ^10.0.0 |
| Animations | react-native-reanimated | ^4.3.1 |
| Gestures | react-native-gesture-handler | ^2.30.0 |
| Environment Variables | react-native-dotenv | ^3.4.11 |

---

## Project Structure

```
ExpenseSplitApp/
├── App.tsx                                   # Root — ErrorBoundary, Provider, AppContent startup gate
├── babel.config.js                           # Babel config with react-native-dotenv plugin
├── tsconfig.json                             # TypeScript config
├── context.md                                # This file
├── android/
│   ├── build.gradle                          # NDK 27.1.12297006, compileSdk 36
│   └── local.properties                      # cmake.dir=/opt/homebrew, sdk.dir
└── src/
    ├── .env                                  # API_BASE_URL, API_TIMEOUT, APP_ENV
    ├── config/
    │   ├── constants.ts                      # STORAGE_KEYS, API_ENDPOINTS, APP_NAME
    │   └── env.ts                            # Reads + validates .env vars, exports ENV object
    ├── types/
    │   ├── api.ts                            # Domain types: User, Expense, Group, Contact, ApiError
    │   └── env.d.ts                          # TypeScript declarations for @env virtual module
    ├── theme/
    │   ├── colors.ts                         # All color tokens (primary, danger, surface, etc.)
    │   ├── spacing.ts                        # xs/sm/md/lg/xl/xxl scale (4–48px)
    │   ├── typography.ts                     # h1–h3, body, caption, label text styles
    │   └── index.ts                          # Barrel export: colors, spacing, typography
    ├── utils/
    │   ├── currency.ts                       # formatCurrency (INR), splitAmount
    │   ├── date.ts                           # formatDate, todayISO, isToday
    │   ├── validation.ts                     # isValidEmail, isValidPhone, isNonEmpty, isMinLength, isValidAmount
    │   └── index.ts                          # Barrel export for all utils
    ├── components/
    │   ├── ErrorBoundary.tsx                 # Class component — catches crashes, shows Try Again
    │   └── ui/
    │       ├── Button.tsx                    # Variants: primary/secondary/danger/outline, loading state
    │       ├── Input.tsx                     # Label + focus border + error message
    │       ├── Screen.tsx                    # SafeAreaView + KeyboardAvoidingView + optional ScrollView
    │       └── index.ts                      # Barrel export: Button, Input, Screen
    ├── hooks/
    │   ├── useAppStartup.ts                  # Dispatches restoreAuthThunk, returns { isReady }
    │   └── index.ts                          # Barrel export: useAppStartup
    ├── store/
    │   ├── index.ts                          # configureStore — exports store, RootState, AppDispatch
    │   └── hooks.ts                          # useAppDispatch, useAppSelector (typed wrappers)
    ├── services/
    │   ├── index.ts                          # Barrel export: apiClient, tokenService
    │   ├── api/
    │   │   └── client.ts                     # Axios instance — Bearer token interceptor, 401 auto-signout
    │   └── security/
    │       └── tokenService.ts               # Keychain save/get/remove (iOS Keychain + Android Keystore)
    ├── navigation/
    │   ├── types.ts                          # All typed ParamLists + screen prop types
    │   ├── RootNavigator.tsx                 # Reads isSignedIn → AuthNavigator or AppNavigator
    │   ├── AuthNavigator.tsx                 # NativeStack: Splash → Login → Register → ForgotPassword
    │   └── AppNavigator.tsx                  # DrawerNavigator wrapping BottomTabNavigator
    └── features/
        ├── auth/
        │   ├── screens/
        │   │   ├── SplashScreen.tsx          # 800ms timer → navigation.replace('Login')
        │   │   ├── LoginScreen.tsx           # dispatches signIn (demo) / loginThunk (production)
        │   │   ├── RegisterScreen.tsx        # dispatches signUp (demo) / registerThunk (production)
        │   │   └── ForgotPasswordScreen.tsx  # UI only — authService.forgotPassword not yet wired
        │   ├── services/
        │   │   └── authService.ts            # login, register, logout, forgotPassword, resetPassword, getProfile, updateProfile
        │   └── store/
        │       └── authSlice.ts              # user, token, isSignedIn, loading, error + 5 thunks
        ├── expenses/
        │   ├── services/
        │   │   └── expenseService.ts         # getAll, getById, getByGroup, create, update, delete, settle
        │   └── store/
        │       └── expensesSlice.ts          # expenses[], loading, error + 6 thunks
        ├── groups/
        │   ├── services/
        │   │   └── groupService.ts           # getAll, getById, create, update, delete, addMember, removeMember
        │   └── store/
        │       └── groupsSlice.ts            # groups[], selectedGroupId, loading, error + 6 thunks
        ├── contacts/
        │   ├── screens/
        │   │   └── ContactsScreen.tsx        # Placeholder — contacts list not yet implemented
        │   ├── services/
        │   │   └── contactService.ts         # getAll, getById, create, update, remove, search
        │   └── store/
        │       └── contactsSlice.ts          # contacts[], loading, error + 5 thunks
        ├── home/
        │   └── screens/
        │       └── HomeScreen.tsx            # Placeholder — expense summary not yet implemented
        ├── profile/
        │   └── screens/
        │       └── ProfileScreen.tsx         # Shows user name/email, dispatches logoutThunk
        └── about/
            └── screens/
                └── AboutScreen.tsx           # Static — reads APP_NAME from constants
```

---

## Environment Variables

File: `src/.env`

```env
API_BASE_URL=https://api.expensesplit.com/v1
API_TIMEOUT=15000
APP_ENV=development
```

All vars are validated at startup in `src/config/env.ts` — app throws with a clear message if any are missing.

Accessed anywhere in the app via:
```ts
import { API_BASE_URL, API_TIMEOUT } from '@env';
// or via the validated wrapper:
import { ENV } from '../config/env';
ENV.API_BASE_URL   // string
ENV.API_TIMEOUT    // number (already parsed)
ENV.IS_DEV         // boolean
```

TypeScript declarations live in `src/types/env.d.ts`.

---

## Redux Store

### Store Shape

```ts
{
  auth: {
    user: { id, name, email } | null,
    token: string | null,          // JWT from API — also persisted in Keychain
    isSignedIn: boolean,           // drives RootNavigator (Auth vs App screens)
    loading: boolean,
    error: string | null,
  },
  expenses: {
    expenses: Expense[],
    loading: boolean,
    error: string | null,
  },
  groups: {
    groups: Group[],
    selectedGroupId: string | null,
    loading: boolean,
    error: string | null,
  },
  contacts: {
    contacts: Contact[],
    loading: boolean,
    error: string | null,
  },
}
```

### Typed Hooks

```ts
// Always use these instead of raw useDispatch / useSelector
import { useAppDispatch, useAppSelector } from '../store/hooks';
```

### Domain Types — `src/types/api.ts`

```ts
type User    = { id: string; name: string; email: string }
type Expense = { id, title, amount, paidBy, splitAmong: string[], groupId?, date, category, settled: boolean }
type Group   = { id, name, members: string[], createdAt }
type Contact = { id, name, email?, phone? }
type ApiError = { message, code?, statusCode? }
```

---

## Auth Slice — Thunks (`src/features/auth/store/authSlice.ts`)

| Thunk | Trigger | Side Effect |
|---|---|---|
| `loginThunk(payload)` | Login form submit | API login → save token to Keychain → hydrate Redux |
| `registerThunk(payload)` | Register form submit | API register → save token to Keychain → hydrate Redux |
| `logoutThunk()` | Sign out button | API logout → remove token from Keychain → clear Redux |
| `restoreAuthThunk()` | App cold start | Read token from Keychain → validate via `/auth/me` → hydrate Redux |
| `getProfileThunk()` | Profile screen load | GET `/auth/me` → update user in Redux |

### Auth Sync Actions

| Action | Effect |
|---|---|
| `signIn(user)` | Sets user + isSignedIn = true (used for demo) |
| `signOut()` | Clears user, token, isSignedIn (called by 401 interceptor) |
| `signUp(user)` | Sets user + isSignedIn = true (used for demo) |
| `updateUser(partial)` | Merges partial data into existing user |
| `clearError()` | Resets error to null |

---

## Expenses Slice — Thunks (`src/features/expenses/store/expensesSlice.ts`)

| Thunk | API Call |
|---|---|
| `fetchExpensesThunk()` | `GET /expenses` |
| `fetchGroupExpensesThunk(groupId)` | `GET /groups/:id/expenses` |
| `createExpenseThunk(payload)` | `POST /expenses` |
| `updateExpenseThunk({ id, payload })` | `PUT /expenses/:id` |
| `deleteExpenseThunk(id)` | `DELETE /expenses/:id` |
| `settleExpenseThunk(id)` | `PATCH /expenses/:id/settle` |

---

## Groups Slice — Thunks (`src/features/groups/store/groupsSlice.ts`)

| Thunk | API Call |
|---|---|
| `fetchGroupsThunk()` | `GET /groups` |
| `createGroupThunk(payload)` | `POST /groups` |
| `updateGroupThunk({ id, payload })` | `PUT /groups/:id` |
| `deleteGroupThunk(id)` | `DELETE /groups/:id` |
| `addMemberThunk({ groupId, memberId })` | `POST /groups/:id/members` |
| `removeMemberThunk({ groupId, memberId })` | `DELETE /groups/:id/members/:memberId` |

---

## Contacts Slice — Thunks (`src/features/contacts/store/contactsSlice.ts`)

| Thunk | API Call |
|---|---|
| `fetchContactsThunk()` | `GET /contacts` |
| `createContactThunk(payload)` | `POST /contacts` |
| `updateContactThunk({ id, payload })` | `PUT /contacts/:id` |
| `deleteContactThunk(id)` | `DELETE /contacts/:id` |
| `searchContactsThunk(query)` | `GET /contacts/search?q=query` — **replaces** contacts array with results |

---

## API Client (`src/services/api/client.ts`)

- Base URL and timeout come from `ENV.API_BASE_URL` / `ENV.API_TIMEOUT` (validated at startup)
- **Request interceptor** — attaches `Authorization: Bearer <token>` from `store.getState().auth.token` (synchronous, no disk I/O per request)
- **Response interceptor** — on `401 Unauthorized`, dispatches `signOut()` to clear Redux → RootNavigator shows AuthNavigator automatically

---

## Token / Keychain Security (`src/services/security/tokenService.ts`)

| Platform | Storage | Access Policy |
|---|---|---|
| iOS | iOS Keychain | `WHEN_UNLOCKED_THIS_DEVICE_ONLY` — never backed up to iCloud, inaccessible when locked |
| Android | Android Keystore | `SECURITY_LEVEL.SECURE_SOFTWARE` — Keystore-backed AES encryption |

```
Service key: com.expensesplitapp.authToken
```

### Token Lifecycle

```
Login / Register
  └─ API returns { user, token }
  └─ tokenService.save(token)       ← stored in Keychain / Keystore
  └─ Redux state.auth.token = token

App cold start
  └─ useAppStartup → restoreAuthThunk()
  └─ tokenService.get()             ← read from Keychain
  └─ authService.getProfile()       ← validates token with server (/auth/me)
  └─ Redux hydrated, RootNavigator shows AppNavigator

Every API request
  └─ interceptor reads store.getState().auth.token  (fast, synchronous)
  └─ Authorization: Bearer <token>

401 Response
  └─ interceptor dispatches signOut()
  └─ Redux cleared, RootNavigator switches to AuthNavigator

Logout
  └─ logoutThunk → authService.logout()
  └─ tokenService.remove()          ← erased from Keychain / Keystore
  └─ Redux cleared
```

---

## Navigation Structure

```
RootNavigator  (reads isSignedIn from Redux)
│
├── isSignedIn = false → AuthNavigator (NativeStack)
│     ├── SplashScreen      (auto-replaces to Login after 800ms)
│     ├── LoginScreen
│     ├── RegisterScreen
│     └── ForgotPasswordScreen
│
└── isSignedIn = true → AppNavigator (DrawerNavigator)
      ├── HomeTabs (BottomTabNavigator)
      │     ├── HomeTab     → HomeScreen
      │     ├── ContactsTab → ContactsScreen
      │     └── ProfileTab  → ProfileScreen
      ├── About    → AboutScreen
      ├── Contacts → ContactsScreen
      └── Profile  → ProfileScreen
```

All screen prop types (navigation + route) are defined in `src/navigation/types.ts`.

---

## App Startup Flow

```
App.tsx
  └─ <ErrorBoundary>          ← catches any crash, shows Try Again screen
  └─ <Provider store={store}> ← makes Redux available to all children
  └─ <SafeAreaProvider>       ← handles notch / home indicator safe areas
  └─ <AppContent>
        └─ useAppStartup()
              └─ dispatch(restoreAuthThunk())
                    └─ tokenService.get()       ← Keychain read
                    └─ authService.getProfile() ← API /auth/me validate
                    └─ Redux hydrated
              └─ isReady = true
        └─ isReady = false → <ActivityIndicator />   (spinner)
        └─ isReady = true  → <RootNavigator />       (real app)
```

---

## UI Components (`src/components/ui/`)

### Button
Props: `title`, `onPress`, `variant` (primary/secondary/danger/outline), `loading`, `disabled`, `style`, `textStyle`
- `loading=true` shows ActivityIndicator and disables the button
- `disabled=true` sets opacity to 0.5

### Input
Props: all standard `TextInput` props + `label?`, `error?`, `containerStyle?`
- Border turns `primary` color on focus
- Border turns `danger` color + shows error message when `error` prop is set

### Screen
Props: `children`, `scroll?` (default false), `padded?` (default true), `style?`
- Always wraps in `SafeAreaView` + `KeyboardAvoidingView`
- `scroll=true` uses `ScrollView` instead of plain `View`
- iOS keyboard behavior: `padding`; Android: `undefined` (native handles it)

---

## Theme Tokens

### Colors (`src/theme/colors.ts`)
```ts
primary:       '#4F46E5'   // indigo — buttons, focus borders
secondary:     '#10B981'   // green
danger:        '#EF4444'   // red — errors, delete, sign out
background:    '#F9FAFB'   // page background
surface:       '#FFFFFF'   // cards, inputs
text:          '#111827'   // main text
textSecondary: '#6B7280'   // captions, subtitles
settled:       '#D1FAE5'   // green tint for settled expenses
unsettled:     '#FEE2E2'   // red tint for unsettled expenses
```

### Spacing (`src/theme/spacing.ts`)
```ts
xs: 4 | sm: 8 | md: 16 | lg: 24 | xl: 32 | xxl: 48
```

### Typography (`src/theme/typography.ts`)
```ts
h1: 32px/700 | h2: 24px/600 | h3: 20px/600
body: 16px/400 | caption: 12px/400 | label: 14px/500
```

---

## Utility Functions (`src/utils/`)

```ts
// currency.ts
formatCurrency(1500)          // → "₹1,500.00" (en-IN, INR)
splitAmount(1500, 3)          // → 500.00

// date.ts
formatDate('2026-05-30')      // → "30 May 2026"
todayISO()                    // → "2026-05-30"
isToday('2026-05-30')         // → true

// validation.ts
isValidEmail('a@b.com')       // → true
isValidPhone('+91 9876543210') // → true
isNonEmpty('  ')              // → false (trims whitespace)
isMinLength('hi', 5)          // → false
isValidAmount(0)              // → false (must be > 0)
```

---

## API Endpoints (`src/config/constants.ts`)

```ts
AUTH:     LOGIN, REGISTER, LOGOUT, FORGOT_PASSWORD, RESET_PASSWORD, ME
EXPENSES: BASE, BY_ID(id), BY_GROUP(groupId), SETTLE(id)
GROUPS:   BASE, BY_ID(id), MEMBERS(groupId), MEMBER_BY_ID(groupId, memberId)
CONTACTS: BASE, BY_ID(id), SEARCH
```

---

## Android Build Configuration

```
NDK Version:  27.1.12297006
CMake:        4.3.2 (Homebrew) — configured via android/local.properties
Build Tools:  36.0.0
compileSdk:   36
targetSdk:    36
minSdk:       24
```

`android/local.properties`:
```
sdk.dir=/Users/shubhamkeshari/Library/Android/sdk
cmake.dir=/opt/homebrew
```

---

## Usage Patterns

### Dispatch an async API action from any screen

```ts
const dispatch = useAppDispatch();

dispatch(createExpenseThunk({
  title: 'Dinner',
  amount: 500,
  paidBy: 'user-id',
  splitAmong: ['user-id', 'friend-id'],
  date: '2026-05-30',
  category: 'Food',
}));
```

### Read from Redux

```ts
const expenses = useAppSelector(s => s.expenses.expenses);
const loading  = useAppSelector(s => s.expenses.loading);
const user     = useAppSelector(s => s.auth.user);
```

### Add a new environment variable

1. Add to `src/.env`: `MY_VAR=value`
2. Declare in `src/types/env.d.ts`: `export const MY_VAR: string;`
3. Add to `src/config/env.ts` under the `ENV` object with `required()`
4. Import via: `import { ENV } from '../config/env';`

---

## Key Files Quick Reference

| File | Purpose |
|---|---|
| `App.tsx` | Root — ErrorBoundary, Provider, SafeAreaProvider, startup spinner gate |
| `src/hooks/useAppStartup.ts` | Session restore on cold start, returns `{ isReady }` |
| `src/store/index.ts` | Redux store — configureStore with all 4 reducers |
| `src/store/hooks.ts` | `useAppDispatch`, `useAppSelector` typed wrappers |
| `src/features/auth/store/authSlice.ts` | Auth state + 5 thunks + 5 sync actions |
| `src/services/api/client.ts` | Axios instance — Bearer token interceptor + 401 auto-signout |
| `src/services/security/tokenService.ts` | Keychain read/write/delete (iOS + Android) |
| `src/features/auth/services/authService.ts` | All auth API calls |
| `src/navigation/RootNavigator.tsx` | Auth/App navigator switch driven by Redux isSignedIn |
| `src/navigation/AppNavigator.tsx` | DrawerNavigator wrapping BottomTabNavigator |
| `src/navigation/AuthNavigator.tsx` | NativeStack for unauthenticated screens |
| `src/navigation/types.ts` | All TypeScript types for navigation params + screen props |
| `src/config/constants.ts` | STORAGE_KEYS, API_ENDPOINTS, APP_NAME |
| `src/config/env.ts` | Validated ENV object from .env |
| `src/types/api.ts` | Central domain types: User, Expense, Group, Contact |
| `src/types/env.d.ts` | TypeScript declarations for `@env` virtual module |
| `src/components/ui/` | Button, Input, Screen reusable components |
| `src/theme/` | colors, spacing, typography tokens |
| `src/utils/` | currency, date, validation helpers |
| `android/local.properties` | Android SDK and CMake paths |
