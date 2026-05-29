import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';

// 🚨 REACT NATIVE NETWORK CONFIGURATION:
// For Android Emulator: Use 'http://10.0.2.2:8000/api'
// For Physical Device / Real Phone: Use your local machine's IP Address (e.g., 'http://192.168.1.5:8000/api')
const API_BASE_URL = 'http://10.0.2.2:8000/api'; 

// Initialize the global Context object for state consumption across the application
export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Global React States initialized with default fallbacks
  const [profileName, setProfileName] = useState('');
  const [themeMode, setThemeMode] = useState('dark');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true); // Maps directly to 'High-Fidelity Shadows' inside the Panel UI
  const [isSaving, setIsSaving] = useState(false);

  // 📥 Initializer Effect: Syncs local states with backend database entries on component mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/settings`)
      .then(response => {
        const data = response.data;
        if (data) {
          setProfileName(data.profileName || '');
          setThemeMode(data.themeMode || 'dark');
          
          // Data Normalization: Force backend values (like integer 0/1 or strings) into absolute Booleans
          setAutoRotate(data.autoRotate === true || data.autoRotate === 1 || data.autoRotate === 'true');
          setShowLabels(data.showLabels === true || data.showLabels === 1 || data.showLabels === 'true');
        }
      })
      .catch(error => {
        console.error("Failed to fetch initial configuration profiles from backend repository:", error);
      });
  }, []);

  // 📤 Synchronization Handler: Commits the exact current state snapshot back into the database
  const saveSettingsToBackend = async () => {
    setIsSaving(true); // Activates the activity indicator loading spinner
    try {
      const response = await axios.post(`${API_BASE_URL}/settings/save`, {
        profileName,
        themeMode,
        autoRotate,
        showLabels
      });

      // Show alert callback if operational payload saved successfully
      if (response.data && response.data.success) {
        Alert.alert("Success", response.data.message || "System configurations updated successfully.");
      }
    } catch (error) {
      console.error("Operational exception triggered while writing settings data to backend:", error);
      Alert.alert("Synchronization Error", "Could not commit system state updates to backend database.");
    } finally {
      setIsSaving(false); // Dismantles loading spinner animation state
    }
  };

  return (
    // Distribute state mappings and method handles down the virtual DOM tree
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