import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const API_URL = 'http://127.0.0.1:8000/api'; 
axios.defaults.withCredentials = true;

export default function LoginScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
      const response = await axios.post(`${API_URL}/google-login`, {
        token: credentialResponse.credential
      });
      
      if (response.status === 200) {
        onLoginSuccess(); // આનાથી ડેશબોર્ડ દેખાશે
      }
    } catch (error) {
      console.error("Google Error:", error.response?.data || error.message);
      Alert.alert('Error', 'Google login failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) {
        return Alert.alert('Error', 'Please fill all fields');
    }

    setLoading(true);
    try {
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
        const endpoint = isSignUp ? '/register' : '/login';
        const payload = isSignUp ? { name, email, password } : { email, password };
        
        await axios.post(`${API_URL}${endpoint}`, payload);
        
        onLoginSuccess(); // સક્સેસ થયા પછી ડેશબોર્ડ પર જશે
    } catch (e) { 
        const errorMsg = e.response?.data?.message || 'Authentication failed.';
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
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#666" value={name} onChangeText={setName} />
        )}
        <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#666" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#666" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.authButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#0b0b0b" /> : <Text style={styles.authButtonText}>{isSignUp ? 'SIGN UP' : 'LOG IN'}</Text>}
        </TouchableOpacity>

        {!isSignUp && (
          <View style={{ marginTop: 20 }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => Alert.alert('Error', 'Google login failed')} useOneTap={false} />
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
  authButton: { width: '100%', maxWidth: 360, height: 52, backgroundColor: '#00ffcc', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  authButtonText: { color: '#0b0b0b', fontSize: 16, fontWeight: 'bold' },
  switchText: { color: '#888888', fontSize: 14 },
});