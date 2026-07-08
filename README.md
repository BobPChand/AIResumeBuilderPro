# AI Resume Builder Pro

AI-powered resume and cover letter builder, tailored to any job description. Built with React Native / Expo for iOS & Android.

## Features
- ATS-optimized resume generation (GPT-4o powered)
- Personalized cover letter generation with tone selection
- One-time profile setup, reused for every application
- Generation history with copy-to-clipboard
- 7-day free trial, then CA$14.99/month or CA$119.99/year

## Setup
```
npm install
npx expo start
```

## Build for stores
```
npm install -g eas-cli
eas login
eas build --platform android   # Google Play
eas build --platform ios       # App Store (requires Apple Developer account)
```

## Backend
Powered by Base44: https://superagent-02ccfade.base44.app/functions/resumeGenerate

## Payments
Stripe subscriptions (web/Android). iOS uses RevenueCat for App Store compliance — see `src/screens/PaywallScreen.js` for setup notes before submission.
