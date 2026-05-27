import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Animated, StatusBar } from 'react-native';

export default function SplashScreen() {
  const scaleValue = useRef(new Animated.Value(0)).current; 
  const opacityValue = useRef(new Animated.Value(0)).current; 
  
  // બેકગ્રાઉન્ડના લાઈવ બ્લર એનિમેશન માટે એનિમેટેડ વેલ્યુ (શરૂઆતમાં 0 = એકદમ ક્લિયર)
  const blurValue = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    // લોગોનું ઝૂમ અને ટેક્સ્ટનું ફેડ-ઈન એનિમેશન તરત શરૂ થશે
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,          
        tension: 15,
        friction: 6,
        useNativeDriver: false, 
      }),
      Animated.timing(opacityValue, {
        toValue: 1,          
        duration: 1000,      
        useNativeDriver: false, 
      })
    ]).start();

    // સિનેમેટિક ઇફેક્ટ: ૧.૫ સેકન્ડ પછી પાછળનું બેકગ્રાઉન્ડ ધીમેથી બ્લર થવાનું શરૂ થશે
    Animated.timing(blurValue, {
      toValue: 8,            // બ્લરનું પરફેક્ટ પ્રમાણ
      duration: 1200,        // ૧.૨ સેકન્ડ સુધી સ્મૂધલી બ્લર થશે
      delay: 1500,           // ૧.૫ સેકન્ડનો હોલ્ડ પીરિયડ
      useNativeDriver: false,
    }).start();

  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0b0b" />
      
      {/* ૧. એનિમેટેડ બેકગ્રાઉન્ડ ઇમેજ: લોગો વાળી સેમ લોકલ ઈમેજ આખા બેકગ્રાઉન્ડમાં સેટ કરી છે */}
      <Animated.Image
        source={require('../../assets/splash-logo1.png')} // એ જ સેમ ઈમેજ બેકગ્રાઉન્ડમાં
        style={[StyleSheet.absoluteFillObject, styles.backgroundImage]}
        blurRadius={blurValue} // અહીં ડાયનેમિક બ્લર એનિમેશન થશે
        resizeMode="cover"
      />

      {/* ફ્રન્ટએન્ડ કન્ટેન્ટ લેયર (ઓવરલે) */}
      <View style={styles.overlay}>
        
        {/* ૨. સેન્ટર ઈમેજ લોગો: ચોરસ પ્રીમિયમ બોક્સમાં તમારો લોકલ ફોટો */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleValue }] }]}>
          <Animated.Image 
            source={require('../../assets/splash-logo1.png')} 
            style={styles.logoImage}
            resizeMode="cover"
          />
        </Animated.View>
        
        {/* ૩. એપનું નામ અને સબટાઈટલ */}
        <Animated.Text style={[styles.title, { opacity: opacityValue }]}>
          ANATOMY LEARNING
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, { opacity: opacityValue }]}>
          Interactive 3D Experience
        </Animated.Text>
        
        {/* ૪. પ્રોગ્રેસ ઇન્ડિકેટર અને લોડિંગ ટેક્સ્ટ */}
        <ActivityIndicator size="small" color="#00ffcc" style={{ marginTop: 30 }} />
        <Animated.Text style={[styles.loadingText, { opacity: opacityValue }]}>
          Loading 3D assets...
        </Animated.Text>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  backgroundImage: {
    width: '100%',
    height: '100vh',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 11, 11, 0.62)', // પાછળની ઈમેજ પર મસ્ત ડાર્ક સિનેમેટિક લુક આપશે
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 28, // ઈમેજ મુજબના વળાંક વાળા ખુણા 
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0px 10px 30px rgba(0,0,0,0.6)', // પ્રીમિયમ શેડો ઇફેક્ટ
    marginBottom: 15,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2.5,
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#00ffcc', // નિયોન ગ્રીન/તેલ થીમ કલર
    marginTop: 5,
    letterSpacing: 1,
    fontWeight: '500',
  },
  loadingText: {
    color: '#aaaaaa',
    fontSize: 11,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});