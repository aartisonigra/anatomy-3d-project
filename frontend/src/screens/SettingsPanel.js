import React, { useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SettingsContext } from '../context/SettingsContext';

export default function SettingsPanel() {
  // Consume the global settings state from SettingsContext
  const settings = useContext(SettingsContext);

  // Fallback: Show a full-screen loading spinner if the context isn't ready or initialized yet
  if (!settings) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0E14', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00f0ff" />
      </View>
    );
  }

  // Destructure states and handler functions from the settings context
  const { 
    profileName, setProfileName,
    themeMode, setThemeMode,
    autoRotate, setAutoRotate, 
    showLabels, setShowLabels,
    isSaving, saveSettingsToBackend 
  } = settings;

  // 🎨 Dynamic Theme Engine: Switches color values seamlessly based on themeMode state
  const currentTheme = themeMode === 'dark' ? {
    bg: '#0B0E14',
    cardBg: '#0F131C',
    borderColor: '#1E2633',
    textColor: '#FFFFFF',
    subTextColor: '#7E8B9B',
    accent: '#00f0ff',
    inputBg: '#070A0F',
    logoutBg: '#2A1414',
    logoutBorder: '#5A1E1E',
    logoutText: '#FF5C5C'
  } : {
    bg: '#F4F6F9',
    cardBg: '#FFFFFF',
    borderColor: '#CBD5E1',
    textColor: '#0F172A',
    subTextColor: '#64748B',
    accent: '#0284C7',
    inputBg: '#E2E8F0',
    logoutBg: '#FEE2E2',
    logoutBorder: '#FCA5A5',
    logoutText: '#EF4444'
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: currentTheme.bg }} 
      contentContainerStyle={[styles.settingsWrapper, { backgroundColor: currentTheme.bg, flexGrow: 1 }]}
    >
      {/* Header Titles */}
      <Text style={[styles.settingsMainTitle, { color: currentTheme.textColor }]}>System Configuration Panel</Text>
      <Text style={[styles.subHeaderDesc, { color: currentTheme.subTextColor }]}>
        Manage 3D graphics rendering, profile credentials, and terminal state.
      </Text>
      
      {/* 👤 SECTION 1: OPERATOR PROFILE CARD */}
      <View style={[styles.settingGlassCard, { backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }]}>
        <Text style={[styles.settingSectionHeader, { color: currentTheme.textColor }]}>👤 Operator Profile</Text>
        
        <Text style={[styles.inputLabelText, { color: currentTheme.subTextColor }]}>Profile Name</Text>
        <TextInput 
          style={[styles.settingsInput, { backgroundColor: currentTheme.inputBg, color: currentTheme.textColor, borderColor: currentTheme.borderColor }]} 
          value={profileName} 
          onChangeText={setProfileName} 
          placeholder="Enter Profile Name"
          placeholderTextColor={themeMode === 'dark' ? '#4A5568' : '#94A3B8'}
        />
      </View>

      {/* 🛠️ SECTION 2: 3D GRAPHICS ENGINE SETTINGS CARD */}
      <View style={[styles.settingGlassCard, { backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }]}>
        <Text style={[styles.settingSectionHeader, { color: currentTheme.textColor }]}>🛠️ 3D Graphics Engine Settings</Text>
        
        {/* Toggle Option: Auto-Rotate Models */}
        <View style={styles.settingRowWithDesc}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.settingRowTitle, { color: currentTheme.textColor }]}>Auto-Rotate Models</Text>
            <Text style={[styles.settingRowDesc, { color: currentTheme.subTextColor }]}>Enable continuous 360° rotation of anatomical models.</Text>
          </View>
          <TouchableOpacity 
            style={[styles.statusBadge, { borderColor: autoRotate ? currentTheme.accent : currentTheme.borderColor, backgroundColor: autoRotate ? `${currentTheme.accent}15` : 'transparent' }]}
            onPress={() => setAutoRotate(!autoRotate)}
          >
            <Text style={{ color: autoRotate ? currentTheme.accent : currentTheme.subTextColor, fontWeight: '800', fontSize: 11 }}>
              {autoRotate ? 'ENABLED' : 'DISABLED'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toggle Option: High-Fidelity Shadows */}
        <View style={styles.settingRowWithDesc}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.settingRowTitle, { color: currentTheme.textColor }]}>High-Fidelity Shadows</Text>
            <Text style={[styles.settingRowDesc, { color: currentTheme.subTextColor }]}>Render realistic shadows for better depth perception.</Text>
          </View>
          <TouchableOpacity 
            style={[styles.statusBadge, { borderColor: showLabels ? currentTheme.accent : currentTheme.borderColor, backgroundColor: showLabels ? `${currentTheme.accent}15` : 'transparent' }]}
            onPress={() => setShowLabels(!showLabels)}
          >
            <Text style={{ color: showLabels ? currentTheme.accent : currentTheme.subTextColor, fontWeight: '800', fontSize: 11 }}>
              {showLabels ? 'ENABLED' : 'DISABLED'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ⚙️ SECTION 3: CORE SYSTEM ACTIONS & MASTER CONTROLS */}
      <View style={[styles.settingGlassCard, { backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }]}>
        <Text style={[styles.settingSectionHeader, { color: currentTheme.textColor }]}>⚙️ Core System Actions</Text>
        
        {/* Interactive Mode Picker: Switches between Light Mode and Dark Matrix */}
        <View style={styles.settingRowWithDesc}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.settingRowTitle, { color: currentTheme.textColor }]}>Terminal Theme</Text>
            <Text style={[styles.settingRowDesc, { color: currentTheme.subTextColor }]}>Switch between light and high-contrast dark matrix modes.</Text>
          </View>
          <View style={styles.themeToggleGroup}>
            {/* Dark Matrix Selector Button */}
            <TouchableOpacity 
              style={[styles.themeTabButton, { marginRight: 5, backgroundColor: themeMode === 'dark' ? `${currentTheme.accent}15` : 'transparent' }, themeMode === 'dark' ? { borderColor: currentTheme.accent } : { borderColor: currentTheme.borderColor }]} 
              onPress={() => setThemeMode('dark')}
            >
              <Text style={{ color: themeMode === 'dark' ? currentTheme.accent : currentTheme.subTextColor, fontSize: 11, fontWeight: '800' }}>Dark Matrix</Text>
            </TouchableOpacity>
            
            {/* Light Mode Selector Button */}
            <TouchableOpacity 
              style={[styles.themeTabButton, { backgroundColor: themeMode === 'light' ? `${currentTheme.accent}15` : 'transparent' }, themeMode === 'light' ? { borderColor: currentTheme.accent } : { borderColor: currentTheme.borderColor }]} 
              onPress={() => setThemeMode('light')}
            >
              <Text style={{ color: themeMode === 'light' ? currentTheme.accent : currentTheme.subTextColor, fontSize: 11, fontWeight: '800' }}>Light Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 💾 MASTER SAVE BUTTON: Triggers API call to push local state directly to Laravel Backend */}
        <TouchableOpacity 
          style={[styles.profileSaveButton, { borderColor: currentTheme.accent, marginBottom: 15 }]} 
          onPress={saveSettingsToBackend}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={currentTheme.accent} />
          ) : (
            <Text style={[styles.profileSaveText, { color: currentTheme.accent }]}>💾 Save All Configurations</Text>
          )}
        </TouchableOpacity>

        {/* Danger Zone: Session Terminate / Logout Button */}
        <TouchableOpacity style={[styles.disconnectButton, { backgroundColor: currentTheme.logoutBg, borderColor: currentTheme.logoutBorder }]}>
          <Text style={[styles.disconnectText, { color: currentTheme.logoutText }]}>⚠️ Disconnect Session (Logout)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// 📐 Local Component Stylesheet
const styles = StyleSheet.create({
  settingsWrapper: { padding: 16, paddingBottom: 60 },
  settingsMainTitle: { fontSize: 24, fontWeight: '900', marginTop: 15, marginBottom: 4 },
  subHeaderDesc: { fontSize: 13, marginBottom: 25, fontWeight: '500' },
  settingGlassCard: { borderWidth: 1, borderRadius: 6, padding: 18, marginBottom: 20 },
  settingSectionHeader: { fontSize: 14, fontWeight: '800', marginBottom: 20, letterSpacing: 0.3 },
  inputLabelText: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  settingsInput: { height: 42, borderRadius: 4, borderWidth: 1, paddingHorizontal: 12, marginBottom: 5, fontSize: 14 },
  profileSaveButton: { height: 44, borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  profileSaveText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  settingRowWithDesc: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  settingRowTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  settingRowDesc: { fontSize: 11, lineHeight: 15 },
  statusBadge: { borderWidth: 1, borderRadius: 4, paddingVertical: 6, paddingHorizontal: 14, minWidth: 85, alignItems: 'center' },
  themeToggleGroup: { flexDirection: 'row' },
  themeTabButton: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderRadius: 4, alignItems: 'center' },
  disconnectButton: { borderWidth: 1, borderRadius: 4, paddingVertical: 12, alignItems: 'center', marginTop: 5 },
  disconnectText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 }
});