import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Platform } from 'react-native';


const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://127.0.0.1:8000/api' 
  : 'http://10.0.2.2:8000/api'; 

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [profileName, setProfileName] = useState('');
  const [themeMode, setThemeMode] = useState('dark');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);

  // 📥 Initializer Effect
  useEffect(() => {
    // 💡 નોંધ: config/cors.php માં supports_credentials => false હોવાથી અહીં simple get request મોકલવી
    axios.get(`${API_BASE_URL}/settings`)
      .then(response => {
        const data = response.data;
        if (data) {
          setProfileName(data.profileName || '');
          setThemeMode(data.themeMode || 'dark');
          setAutoRotate(data.autoRotate === true || data.autoRotate === 1 || data.autoRotate === 'true');
          setShowLabels(data.showLabels === true || data.showLabels === 1 || data.showLabels === 'true');
        }
      })
      .catch(error => {
        // આ એરર હવે સોલ્વ થઈ જશે
        console.error("Failed to fetch initial configuration profiles from backend repository:", error);
      });
  }, []);

  // 📤 Synchronization Handler
  const saveSettingsToBackend = async () => {
    setIsSaving(true); 
    try {
      const response = await axios.post(`${API_BASE_URL}/settings/save`, {
        profileName,
        themeMode,
        autoRotate,
        showLabels
      });

      if (response.data && response.data.success) {
        // વેબ પર Alert.alert કામ ન કરે તો સાદું alert વાપરવું
        if (Platform.OS === 'web') {
          alert(response.data.message || "System configurations updated successfully.");
        } else {
          Alert.alert("Success", response.data.message || "System configurations updated successfully.");
        }
      }
    } catch (error) {
      console.error("Operational exception triggered while writing settings data to backend:", error);
      if (Platform.OS === 'web') {
        alert("Could not commit system state updates to backend database.");
      } else {
        Alert.alert("Synchronization Error", "Could not commit system state updates to backend database.");
      }
    } finally {
      setIsSaving(false); 
    }
  };

  return (
    <SettingsContext.Provider value={{
      profileName, setProfileName,
      themeMode, setThemeMode,
      autoRotate, setAutoRotate,
      showLabels, setShowLabels,
      isSaving,
      saveSettingsToBackend
    }}>
      {children}
    </SettingsContext.Provider>
  );
};