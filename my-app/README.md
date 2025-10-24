# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

# Child Safety App - React Native Frontend

## Overview
I've created a beautiful and functional React Native frontend for your child safety mobile app using Expo, NativeWind (Tailwind CSS), and modern UI components.

## Features Built

### 🏠 Home Screen (`app/(tabs)/index.tsx`)
- **Emergency Call 911 Button** - Large red button for immediate emergency calls
- **Call NCMEC Button** - Direct contact to National Center for Missing & Exploited Children
- **Quick Actions Section** with:
  - Add Child Profile
  - Safety Locations
  - Report Suspicious Activity
- **TraffickCam Information** - Educational content about the app's purpose

### 👶 Add Child Screen (`app/(tabs)/explore.tsx`)
- **Child Profile Form** with:
  - Photo upload placeholder
  - Name and age (required fields)
  - Physical description
  - Emergency contact information
- **Safety Features Toggle** for:
  - Location tracking
  - Emergency alerts
  - Authority sharing
- **Security Notice** explaining data protection

## Technology Stack

### Core Framework
- **React Native** with Expo Router for navigation
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native) for styling

### Dependencies Installed
- `nativewind` - Tailwind CSS for React Native
- `tailwindcss` - CSS framework
- `react-native-svg` - SVG support
- `expo-linking` - For phone calls and external links
- `expo-call` - Phone functionality

### Styling & Design
- **Modern UI** with rounded corners, shadows, and gradients
- **Color Scheme**: 
  - Emergency red (#FF3B30)
  - Safety blue (#007AFF)  
  - Professional grays
- **Responsive Design** with proper spacing and typography
- **Icon Integration** using Expo Vector Icons (Ionicons, MaterialIcons)

## Configuration Files Created/Updated

### `tailwind.config.js`
- Configured with NativeWind preset
- Custom color palette for emergency/safety theme
- Content paths for app and components

### `metro.config.js`
- NativeWind integration with Metro bundler
- CSS input configuration

### `babel.config.js`
- NativeWind babel plugin configuration
- Expo preset integration

### `app.json`
- Updated app name to "Child Safety App"
- Added necessary permissions for phone calls, location, camera
- Configured for both iOS and Android

## Key Components

### `components/emergency-button.tsx`
Reusable emergency button component with:
- Customizable colors and icons
- Confirmation alerts before calling
- Accessibility features

## Firebase Integration Ready
The app is structured to easily integrate with Firebase for:
- User authentication
- Child profile storage
- Location tracking
- Push notifications
- Emergency contact management

## Next Steps for Backend Integration

1. **Firebase Setup**:
   ```bash
   npm install firebase @react-native-firebase/app @react-native-firebase/firestore
   ```

2. **Authentication**: 
   - Add login/signup screens
   - Secure user data

3. **Database Structure**:
   ```
   users/{userId}/
     - profile: { name, email, phone }
     - children: [{ name, age, description, photo, emergencyContact }]
     - locations: [{ lat, lng, timestamp }]
   ```

4. **Additional Features**:
   - Real-time location sharing
   - Push notifications for emergencies
   - Photo upload to Firebase Storage
   - Offline data synchronization

## Security Features Implemented
- Form validation
- Confirmation dialogs for emergency calls
- Privacy notices
- Secure local storage preparation

## Mobile-First Design
- Touch-friendly button sizes
- Proper spacing for mobile interaction
- Safe area handling for different device sizes
- Accessibility considerations

The frontend is now ready for testing and backend integration. The design matches the professional look from your sample images while providing all the core functionality needed for a child safety application.

## Running the App
```bash
cd my-app
npm install
npm run start
```

Then scan the QR code with Expo Go app on your mobile device to test the interface!

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
