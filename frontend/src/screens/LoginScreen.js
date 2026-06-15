import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

// 🌐 Android Emulator માટે 10.0.2.2 બેસ્ટ છે. જો તમે એક્સ્પો વેબ વાપરતા હોવ તો localhost:8000 કરી શકો.
const BASE_URL = 'http://127.0.0.1:8000'; 
const API_URL = `${BASE_URL}/api`; 

// Axios Global Configuration
axios.defaults.withCredentials = true;

export default function LoginScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔴 Google Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // ઓથેન્ટિકેશન પહેલાં CSRF પ્રોટેક્શન ટોકન મેળવો
      await axios.get(`${BASE_URL}/sanctum/csrf-cookie`);
      
      const response = await axios.post(`${API_URL}/google-login`, {
        token: credentialResponse.credential
      });
      
      if (response.status === 200 || response.status === 201) {
        onLoginSuccess(); // ડેશબોર્ડ ઓપન થશે
      }
    } catch (error) {
      console.error("Google Login Error Details:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'Google login failed. Please try again.';
      Alert.alert('Google Auth Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Email & Password Login / Signup Handler
  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) {
        return Alert.alert('Validation Error', 'Please fill all fields');
    }

    setLoading(true);
    try {
        // CSRF કૂકી સેટ કરો
        await axios.get(`${BASE_URL}/sanctum/csrf-cookie`);
        
        const endpoint = isSignUp ? '/register' : '/login';
        const payload = isSignUp ? { name, email, password } : { email, password };
        
        const response = await axios.post(`${API_URL}${endpoint}`, payload);
        
        if (response.status === 200 || response.status === 201) {
          onLoginSuccess(); // સક્સેસ થયા પછી ડેશબોર્ડ પર રીડાયરેક્ટ કરશે
        }
    } catch (e) { 
        console.error("Auth Error Details:", e.response?.data || e.message);
        const errorMsg = e.response?.data?.message || 'Authentication failed. Please check credentials.';
        Alert.alert('Error', errorMsg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="462618100575-cnjubgie71uu4f6u12bvip1dva16fq3q.apps.googleusercontent.com">
      <View style={styles.authContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.authTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>

        {isSignUp && (
          <TextInput 
            style={styles.input} 
            placeholder="Full Name" 
            placeholderTextColor="#666" 
            value={name} 
            onChangeText={setName} 
          />
        )}
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          placeholderTextColor="#666" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#666" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />

        <TouchableOpacity style={styles.authButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#0b0b0b" />
          ) : (
            <Text style={styles.authButtonText}>{isSignUp ? 'SIGN UP' : 'LOG IN'}</Text>
          )}
        </TouchableOpacity>

        {/* માત્ર લોગીન સ્ક્રીન પર જ ગુગલ બટન બતાવવું */}
        {!isSignUp && (
          <View style={styles.googleButtonWrapper}>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={() => Alert.alert('Error', 'Google login initialization failed')} 
              useOneTap={false}
              theme="filled_blue"
              shape="rectangular"
            />
          </View>
        )}

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 25 }}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={{ color: '#00ffcc', fontWeight: 'bold' }}>{isSignUp ? 'Log In' : 'Sign Up'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </GoogleOAuthProvider>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  authTitle: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginBottom: 30 },
  input: { width: '100%', maxWidth: 360, height: 52, backgroundColor: '#1e1e1e', borderRadius: 10, paddingHorizontal: 16, color: '#ffffff', marginBottom: 16, borderWidth: 1, borderColor: '#2d2d2d' },
  authButton: { width: '100%', maxWidth: 360, height: 52, backgroundColor: '#00ffcc', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  authButtonText: { color: '#0b0b0b', fontSize: 16, fontWeight: 'bold' },
  googleButtonWrapper: { marginTop: 20, width: '100%', maxWidth: 360, alignItems: 'center' },
  switchText: { color: '#888888', fontSize: 14 },
});