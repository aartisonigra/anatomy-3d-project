import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

export default function LiveVitalsScreen({ navigation }) {
  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLiveVitals = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/live-vitals');
      const result = await res.json();
      
      if (result.status === 'success') {
        setVitals(result.data);
        setError(false);
      }
    } catch (err) {
      console.error("Network connection failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveVitals();
    const timer = setInterval(fetchLiveVitals, 2000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ffcc" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Establishing Connection...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
     
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation && navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← BACK TO LAB</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>🫁 Anatomy AI: Live Lab</Text>
          <View style={styles.liveBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <Text style={styles.subHeading}>REAL-TIME BODY SIMULATION DATA</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Unable to connect to backend server. Check XAMPP and Laravel server status.</Text>
          </View>
        )}

        <View style={styles.dashboard}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>HEART RATE</Text>
            <Text style={styles.cardValue}>
              {vitals?.heart_rate || '--'} <Text style={styles.unit}>BPM</Text>
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>OXYGEN (SPO2)</Text>
            <Text style={styles.cardValue}>
              {vitals?.spo2 || '--'}<Text style={styles.unit}>%</Text>
            </Text>
          </View>

          <View style={styles.cardFull}>
            <View>
              <Text style={styles.cardTitle}>BLOOD PRESSURE</Text>
              <Text style={styles.cardValue}>
                {vitals?.bp_sys || '--'}/{vitals?.bp_dia || '--'} <Text style={styles.unit}>mmHg</Text>
              </Text>
            </View>
          </View>

          <View style={styles.cardFull}>
            <View>
              <Text style={styles.cardTitle}>BODY TEMPERATURE</Text>
              <Text style={styles.cardValue}>
                {vitals?.body_temp || '--'} <Text style={styles.unit}>°C</Text>
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>Status: {error ? 'OFFLINE' : 'NORMAL'} | Sync: {vitals?.timestamp || 'N/A'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e14', paddingHorizontal: 20 },
  center: { flex: 1, backgroundColor: '#0a0e14', justifyContent: 'center', alignItems: 'center' },
  backButton: { marginTop: 45, marginBottom: 15 },
  backButtonText: { color: '#00ffcc', fontWeight: 'bold', fontSize: 12 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  liveBadge: { backgroundColor: '#1a2c21', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 5 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00ffcc' },
  liveText: { color: '#00ffcc', fontSize: 9, fontWeight: 'bold' },
  subHeading: { fontSize: 11, color: '#8b949e', marginBottom: 25, letterSpacing: 1, marginTop: 5 },
  dashboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#161b22', width: '48%', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#30363d' },
  cardFull: { backgroundColor: '#161b22', width: '100%', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#30363d' },
  cardTitle: { fontSize: 10, color: '#8b949e', letterSpacing: 1, marginBottom: 5 },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  unit: { fontSize: 12, color: '#00ffcc', fontWeight: 'normal' },
  errorBox: { backgroundColor: '#2a1a1a', padding: 10, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#4a2020' },
  errorText: { color: '#ff6b6b', fontSize: 12, textAlign: 'center' },
  footer: { color: '#484f58', textAlign: 'center', marginVertical: 20, fontSize: 10 }
});