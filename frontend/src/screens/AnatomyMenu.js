import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export default function AnatomyMenu({
  isAnatomyOpen,
  setIsAnatomyOpen,
  setIsOrgansOpen,
  activeCategory,
  setActiveCategory,
  selectedModelTitle,
  setSelectedModelTitle,
  humanSystems,
}) {
  return (
    <View style={styles.dropdownContainer}>
      {/* મુખ્ય એનાટોમી મેનુ બટન */}
      <TouchableOpacity
        style={[
          styles.menuItem, 
          activeCategory === 'Anatomy' && styles.menuItemActive
        ]}
        onPress={() => {
          setIsAnatomyOpen(!isAnatomyOpen);
          setIsOrgansOpen(false); // ઓર્ગન્સનું ડ્રોપડાઉન બંધ કરી દેશે
          setActiveCategory('Anatomy'); // એક્ટિવ કેટેગરી સેટ કરશે
          setSelectedModelTitle(null); // સ્પેસિફિક મોડેલ ફિલ્ટર રીસેટ કરશે
        }}
      >
        <View style={styles.dropdownHeader}>
          <Text style={activeCategory === 'Anatomy' ? styles.menuTextActive : styles.menuText}>
            🦴 Anatomy (Bones)
          </Text>
          <Text style={[styles.arrowIcon, activeCategory === 'Anatomy' && { color: '#00f0ff' }]}>
            {isAnatomyOpen ? '▼' : '▶'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* સબમેનુ લિસ્ટ - જ્યારે ડ્રોપડાઉન ઓપન હોય */}
      {isAnatomyOpen && (
        <View style={styles.submenu}>
          {humanSystems
            .filter((m) => m.category === 'Anatomy') // બધી એનાટોમી આઇટમ્સ ફિલ્ટર કરશે
            .map((boneModel) => {
              const isSelected = selectedModelTitle === boneModel.title;
              return (
                <TouchableOpacity
                  key={boneModel.id}
                  style={[
                    styles.submenuItem,
                    isSelected && styles.submenuItemActive
                  ]}
                  onPress={() => {
                    setSelectedModelTitle(boneModel.title);
                    setActiveCategory('Anatomy'); // સેફ્ટી માટે કેટેગરી પણ લોક રાખશે
                  }}
                >
                  <Text
                    style={[
                      styles.submenuText,
                      isSelected && { color: '#00f0ff', fontWeight: '700' },
                    ]}
                  >
                    💀 {boneModel.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      )}
    </View>
  );
}

// ============================================
// 🔥 પ્રીમિયમ સાઇડબાર અને હોવર ઇફેક્ટ સ્ટાઇલ્સ
// ============================================
const styles = StyleSheet.create({
  dropdownContainer: { 
    width: '100%',
    marginBottom: 5 
  },
  dropdownHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%' 
  },
  menuItem: { 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    borderRadius: 8, 
    marginBottom: 5, 
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          backgroundColor: '#16161a',
          borderColor: '#1f1f23'
        }
      }
    })
  },
  menuItemActive: { 
    backgroundColor: '#1c1c24', 
    borderWidth: 1, 
    borderColor: '#00f0ff',
    ...Platform.select({
      web: {
        boxShadow: '0 0 10px rgba(0, 240, 255, 0.15)'
      }
    })
  },
  menuTextActive: { 
    color: '#00f0ff', 
    fontWeight: '600', 
    fontSize: 15 
  },
  menuText: { 
    color: '#8e8e93', 
    fontSize: 15, 
    fontWeight: '500' 
  },
  arrowIcon: { 
    color: '#636366', 
    fontSize: 10 
  },
  
  // સબમેનુ બોક્સ સ્ટાઇલ
  submenu: { 
    backgroundColor: '#121215', 
    borderRadius: 8, 
    paddingLeft: 10, 
    paddingVertical: 5, 
    marginBottom: 10, 
    borderLeftWidth: 2, 
    borderColor: '#00f0ff',
    marginLeft: 5
  },
  submenuItem: { 
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 2,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#16161a',
        }
      }
    })
  },
  submenuItemActive: {
    backgroundColor: 'rgba(0, 240, 255, 0.05)'
  },
  submenuText: { 
    color: '#8e8e93', 
    fontSize: 13,
    fontWeight: '500'
  },
});