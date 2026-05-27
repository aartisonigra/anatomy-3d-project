import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import SplashScreen from './src/screens/SplashScreen.js';
import LoginScreen from './src/screens/LoginScreen.js';
import DashboardScreen from './src/screens/DashboardScreen.js'; 

axios.defaults.withCredentials = true;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('auth');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (currentScreen === 'splash') return <SplashScreen />;
  if (currentScreen === 'auth') {
    return <LoginScreen onLoginSuccess={() => setCurrentScreen('dashboard')} />;
  }
  
  return <DashboardScreen onLogout={() => setCurrentScreen('auth')} />;
}