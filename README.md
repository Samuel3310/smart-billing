# Recurly Mobile App

Recurly is a mobile subscription tracking app built with Expo, React Native, Expo Router, NativeWind, and Clerk. It helps users review subscription spending, see upcoming renewals, inspect subscription details, and test secure authentication flows.

The project currently includes a polished authenticated app shell, email and password authentication, sign-up verification, sign-in MFA support, bottom tab navigation, a dashboard with subscription data, expandable subscription cards, and an account settings page with user profile details and logout.

## Table Of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screens](#screens)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [Styling](#styling)
- [Data Model](#data-model)
- [Development Notes](#development-notes)
- [Roadmap](#roadmap)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Recurly is designed as a personal subscription management experience. The home screen summarizes the user's balance/spend, highlights upcoming renewals, and displays all subscriptions in a scannable list. Each subscription card can expand to reveal billing, payment, category, start date, renewal date, and status information.

The app uses Clerk for authentication and Expo Router for file-based routing. Authenticated routes are protected at the tab layout level, so signed-out users are redirected back to the sign-in flow. The settings screen uses Clerk user data to display the current account profile and gives users a logout button for retesting authentication.

## Features

- Email and password sign up with Clerk.
- Email verification code flow during account creation.
- Email and password sign in with Clerk.
- MFA email code handling when Clerk requires client trust.
- Protected tab routes for authenticated users only.
- Logout from the settings screen.
- Account profile card with avatar, name, and email.
- Account metadata card with Clerk account ID and joined date.
- Home dashboard with balance and upcoming renewal summary.
- Upcoming subscriptions carousel.
- Expandable subscription cards with billing details.
- Custom bottom tab bar with icon-only navigation.
- NativeWind component classes for consistent UI styling.
- Plus Jakarta Sans font family loaded through Expo Font.
- Typed Expo Router routes enabled.
- TypeScript definitions for tabs, subscriptions, cards, and list components.

## Tech Stack

| Category        | Technology                                 |
| --------------- | ------------------------------------------ |
| Framework       | Expo SDK 54                                |
| UI Runtime      | React Native 0.81                          |
| Routing         | Expo Router                                |
| Auth            | Clerk Expo SDK                             |
| Styling         | NativeWind, Tailwind CSS, React Native CSS |
| Language        | TypeScript                                 |
| Fonts           | Plus Jakarta Sans                          |
| Date Formatting | Day.js                                     |
| Navigation      | React Navigation bottom tabs               |
| Secure Storage  | Expo Secure Store                          |

## Screens

### Authentication

- `app/(auth)/sign-in.tsx`
- `app/(auth)/sign-up.tsx`

The authentication screens support:

- Form validation for email and password.
- Clerk sign-in and sign-up flows.
- Email verification during sign-up.
- MFA email code verification during sign-in when required.
- Redirects away from auth screens when the user is already signed in.

### Home

- `app/(tabs)/index.tsx`

The home screen includes:

- User header.
- Balance card.
- Upcoming subscriptions list.
- All subscriptions list.
- Expandable cards for subscription details.

### Subscriptions

- `app/(tabs)/subscriptions.tsx`

This tab is currently scaffolded as a placeholder for a full subscriptions view.

### Insights

- `app/(tabs)/insights.tsx`

This tab is currently scaffolded as a placeholder for analytics, charts, or subscription insights.

### Settings

- `app/(tabs)/settings.tsx`

The settings screen includes:

- Current user's avatar.
- Current user's name.
- Current user's email address.
- Clerk account ID.
- Account creation date.
- Logout button.

## Project Structure

```text
.
├── app
│   ├── (auth)
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── insights.tsx
│   │   ├── settings.tsx
│   │   └── subscriptions.tsx
│   ├── subscriptions
│   │   └── [id].tsx
│   ├── _layout.tsx
│   └── onboarding.tsx
├── assets
│   ├── fonts
│   ├── icons
│   └── images
├── components
│   ├── AuthLoading.tsx
│   ├── ListHeading.tsx
│   ├── SubscriptionCard.tsx
│   ├── UpcomingSubscription.tsx
│   └── UpcomingSubscriptionCard.tsx
├── constants
│   ├── data.ts
│   ├── icons.ts
│   ├── image.ts
│   └── theme.ts
├── lib
│   └── utils.ts
├── global.css
├── type.d.ts
├── app.json
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Expo CLI support through `npx expo`
- Expo Go, Android Studio, Xcode, or a development build depending on your target platform
- A Clerk application with an Expo-compatible publishable key

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd mobile_appl
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

Start the development server:

```bash
npm start
```

Then choose your target:

- Press `a` for Android.
- Press `i` for iOS.
- Press `w` for web.
- Scan the QR code with Expo Go if your environment supports it.

## Environment Variables

| Variable                            | Required | Description                                                         |
| ----------------------------------- | -------- | ------------------------------------------------------------------- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes      | Clerk publishable key used by `ClerkProvider` in `app/_layout.tsx`. |

The root layout will throw an error if `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing.

## Available Scripts

| Script          | Command                           | Description                                                |
| --------------- | --------------------------------- | ---------------------------------------------------------- |
| `start`         | `expo start`                      | Starts the Expo development server.                        |
| `android`       | `expo start --android`            | Starts Expo and opens the Android target.                  |
| `ios`           | `expo start --ios`                | Starts Expo and opens the iOS target.                      |
| `web`           | `expo start --web`                | Starts Expo for web.                                       |
| `lint`          | `expo lint`                       | Runs Expo's linting setup.                                 |
| `reset-project` | `node ./scripts/reset-project.js` | Resets the starter project structure if the script exists. |

You can also run TypeScript checks manually:

```bash
npx tsc --noEmit
```

## Authentication

Authentication is powered by Clerk.

The Clerk provider is configured in:

```text
app/_layout.tsx
```

The app uses:

- `ClerkProvider` for auth context.
- `tokenCache` from `@clerk/expo/token-cache`.
- `useAuth` for route protection and signed-in checks.
- `useSignIn` for sign-in.
- `useSignUp` for account creation.
- `useClerk` for logout.
- `useUser` for settings profile data.

Protected tab navigation is handled in:

```text
app/(tabs)/_layout.tsx
```

If Clerk is still loading, the app renders `AuthLoading`. If the user is not signed in, it redirects to:

```text
/(auth)/sign-in
```

## Styling

The app uses NativeWind and Tailwind-style utility classes for React Native styling.

Global theme tokens and reusable component classes live in:

```text
global.css
```

The theme includes:

- Background, foreground, card, muted, primary, accent, success, destructive, and subscription colors.
- App spacing scale.
- Plus Jakarta Sans font mappings.
- Component classes for auth screens, tab icons, subscription cards, modal layouts, category chips, and settings cards.

The visual direction is warm, clean, and product-focused, with a light cream background, dark primary text, and orange accent actions.

## Data Model

Demo data currently lives in:

```text
constants/data.ts
```

The main data collections are:

- `tabs`
- `HOME_USER`
- `HOME_BALANCE`
- `UPCOMING_SUBSCRIPTIONS`
- `HOME_SUBSCRIPTIONS`

Global TypeScript interfaces are defined in:

```text
type.d.ts
```

Important interfaces include:

- `AppTab`
- `Subscription`
- `SubscriptionCardProps`
- `UpcomingSubscription`
- `UpcomingSubscriptionCardProps`
- `ListHeadingProps`

## Development Notes

- The app uses file-based routing through Expo Router.
- The tab bar is generated from `constants/data.ts`.
- The app currently stores subscription examples as local constants.
- Clerk handles user authentication and session persistence.
- `expo-secure-store` is configured for token storage.
- The settings screen is useful for testing the complete sign-out and sign-in cycle.
- Some screens are intentionally scaffolded and ready for additional functionality.

## Roadmap

Potential next steps:

- Add a complete Subscriptions screen with filtering and search.
- Add subscription creation and editing flows.
- Add persistent storage or a backend API.
- Replace demo subscription data with user-specific data.
- Add charts to the Insights screen.
- Add push notifications for upcoming renewals.
- Add recurring billing reminders.
- Add category summaries and monthly spend trends.
- Add account preferences in Settings.
- Add subscription detail routes under `app/subscriptions/[id].tsx`.
- Add unit tests for formatting utilities.
- Add component tests for auth and subscription cards.
- Add screenshots or a demo GIF to this README.

## Troubleshooting

### Missing Clerk Key

If the app fails with:

```text
Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file
```

Create a `.env` file and add your Clerk publishable key:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Auth Redirects Back To Sign In

Confirm that:

- The Clerk key is valid.
- Your Clerk application allows the auth method you are testing.
- The user completed email verification when signing up.
- The Expo app restarted after adding environment variables.

### NativeWind Styles Do Not Update

Try restarting Expo with cache clearing:

```bash
npx expo start -c
```

### TypeScript Route Errors

This project enables typed routes in `app.json`. If routes are renamed, restart the TypeScript server or Expo development server so generated route types can refresh.

## Contributing

Contributions are welcome. A good contribution flow is:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run TypeScript checks.
5. Run linting.
6. Open a pull request with a clear description.

Recommended checks:

```bash
npx tsc --noEmit
npm run lint
```

## License

No license has been added yet. Add a license file before publishing or distributing this project publicly.
