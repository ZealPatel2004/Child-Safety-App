import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDeXquQdgx9jH1sGrEt2ts5xXi5wQC4ek",
  authDomain: "mobile-child-safety-app.firebaseapp.com",
  projectId: "mobile-child-safety-app",
  storageBucket: "mobile-child-safety-app.firebasestorage.app",
  messagingSenderId: "334981707888",
  appId: "1:334981707888:web:5b428692ea50e93e475cb",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export default app;
