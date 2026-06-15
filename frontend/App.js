import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import SplashScreen from './src/screens/SplashScreen.js';
import LoginScreen from './src/screens/LoginScreen.js';
import DashboardScreen from './src/screens/DashboardScreen.js'; 
import QuizScreen from './src/screens/QuizScreen.js'; // ✨ ૧. નવી QuizScreen ફાઇલ અહીં ઇમ્પોર્ટ કરી
import { SettingsProvider } from './src/context/SettingsContext';
import LiveVitalsScreen from './src/screens/LiveVitalsScreen'; 

axios.defaults.withCredentials = true;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  // 📥 ક્વિઝના પેરામીટર્સ (જેમ કે Anatomy કે Organs કેટેગરી) સાચવવા માટેનું સ્ટેટ
  const [quizParams, setQuizParams] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('auth');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const renderScreen = () => {
    if (currentScreen === 'splash') return <SplashScreen />;
    
    if (currentScreen === 'auth') {
      return <LoginScreen onLoginSuccess={() => setCurrentScreen('dashboard')} />;
    }
    
    // 🖥️ Dashboard Screen લોડ કરતી વખતે કસ્ટમ નેવિગેશન પ્રોપ પાસ કરી
    if (currentScreen === 'dashboard') {
      return (
        <DashboardScreen 
          onLogout={() => setCurrentScreen('auth')} 
          navigation={{
            navigate: (screenName, params) => {
              if (screenName === 'Quiz') {
                setQuizParams(params || {}); // ડેટા સ્ટોર કર્યો
                setCurrentScreen('quiz');    // ક્વિઝ સ્ક્રીન પર રીડાયરેક્ટ કર્યું
              }
            }
          }}
        />
      );
    }

    // 🧠 ૨. નવી Quiz Screen નું કસ્ટમ હેન્ડલર એડ કર્યું
    if (currentScreen === 'quiz') {
      return (
        <QuizScreen 
          route={{ params: quizParams }} // ડેશબોર્ડમાંથી આવેલો ડેટા મોકલ્યો
          navigation={{
            goBack: () => setCurrentScreen('dashboard'), // પાછા જવા માટે
            navigate: (screenName) => {
              if (screenName === 'Dashboard') setCurrentScreen('dashboard');
            }
          }}
        />
      );
    }

    return null;
  };

  return (
    <SettingsProvider>
      {renderScreen()}
    </SettingsProvider>
  );
}