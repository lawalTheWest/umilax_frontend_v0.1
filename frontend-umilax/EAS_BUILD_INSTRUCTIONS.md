Expo EAS Android build instructions

This file explains how to build the Expo-managed React Native app for Android as an APK or AAB using either Expo's EAS cloud build service or a local machine.

Preparation
- Ensure you have an Expo account (https://expo.dev) if you plan to use EAS cloud builds.
- If you plan to build locally, install Android SDK, Java JDK, and configure ANDROID_HOME and PATH accordingly.
- The backend is hosted on Render at https://umilax.onrender.com. Ensure this is the correct production API URL.

1) EAS (recommended - cloud build)
- Install EAS CLI: npm install -g eas-cli
- Login to Expo: eas login (use the Expo account credentials)
- Initialize EAS in the project (first time): eas build:configure
- Add/confirm credentials when prompted. EAS can manage keystores for you.
- Run the build:
  eas build --platform android --profile production
- When finished, EAS will provide a download URL for the APK/AAB.

Notes:
- If you want the app to use a different backend (e.g., staging), update `app.json` -> `expo.extra.API_URL` before building or set runtime config.
- For CI automation, set EXPO_TOKEN and other credentials in your CI environment.

2) Local build (requires Android toolchain)
- Install Android Studio and SDK, and ensure `adb` and `gradle` are available in PATH.
- Build the native Android project (if using Expo prebuild):
  expo prebuild
  cd android
  ./gradlew assembleRelease
- The APK will be under android/app/build/outputs/apk/release/

Troubleshooting
- If the app cannot reach the backend, confirm `API_URL` in `app.json` or the environment configuration used by the app.
- For EAS credential issues, follow Expo docs to either let EAS manage credentials or provide your own keystore.

Contact
If you'd like, I can run the EAS cloud build for you — provide an Expo account email and confirm you want the build done in the cloud. I won't request or store passwords; you can provide an EXPO_TOKEN instead (more secure).
