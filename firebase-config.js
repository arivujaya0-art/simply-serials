// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Register a Web App and paste its config values below.
// These are public client configuration values, NOT admin credentials.
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("YOUR_");
