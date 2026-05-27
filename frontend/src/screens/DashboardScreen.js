import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, TextInput } from 'react-native';

let WebView;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

export default function DashboardScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Sidebar Dropdown States
  const [isAnatomyOpen, setIsAnatomyOpen] = useState(false);
  const [isOrgansOpen, setIsOrgansOpen] = useState(false);

  // AI Assistant ની સ્ટેટ્સ
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello Aarti! I am your Anatomy AI Assistant. Ask me anything about the loaded systems or organs!' }
  ]);

  // 📂 તારા બંને ફોલ્ડર્સ (Bones અને Organs) ની તમામ ફાઇલો સાથેનો નવો માસ્ટર ડેટા
  const humanSystems = [
    // 🟢 મેઇન / રૂટ ફોલ્ડરના જૂના મોડેલ્સ
    { id: 1, title: 'Respiratory (Lungs)', category: 'Organs', source: require('../3d-models/lungs.glb') },
    { id: 2, title: 'Cardiovascular (Heart)', category: 'Organs', source: require('../3d-models/jantung.glb') }, 
    { id: 3, title: 'Abdomen Anatomy', category: 'Anatomy', source: require('../3d-models/abdomen_anatomy.glb') }, 
    { id: 4, title: 'Circulatory System', category: 'Systems', source: require('../3d-models/coeur_et_vaissaaux.glb') }, 
    { id: 5, title: 'Skeletal System', category: 'Systems', source: require('../3d-models/anatomical_scan_test.glb') },
    { id: 6, title: 'Muscular System', category: 'Systems', source: require('../3d-models/visible_interactive_human_-_exploding_skull.glb') },
    
    // 🦴 image_226431.png માંથી ઉમેરેલા Bones ફોલ્ડરના મોડેલ્સ
    { id: 7, title: 'Ears Study', category: 'Anatomy', source: require('../3d-models/Bones/ears_study.glb') },
    { id: 8, title: 'Wax Model Group 6', category: 'Anatomy', source: require('../3d-models/Bones/group_6_wax_2.glb') },
    { id: 9, title: 'Human Skull', category: 'Anatomy', source: require('../3d-models/Bones/human_skull.glb') },
    { id: 10, title: 'Left Upper Limb', category: 'Anatomy', source: require('../3d-models/Bones/left_upper_limb.glb') },
    { id: 11, title: 'Mandible CT Scan', category: 'Anatomy', source: require('../3d-models/Bones/mandible_ct.glb') },
    { id: 12, title: 'Right Central Rib', category: 'Anatomy', source: require('../3d-models/Bones/right_central_rib.glb') },
    { id: 13, title: 'Right Foot CT', category: 'Anatomy', source: require('../3d-models/Bones/right_foot_ct.glb') },
    { id: 14, title: 'Skull Right Side', category: 'Anatomy', source: require('../3d-models/Bones/skull_right_side.glb') },
    { id: 15, title: 'Thoracic Abdomen', category: 'Anatomy', source: require('../3d-models/Bones/thoracic_abdomen.glb') },
    { id: 16, title: 'Tomographic Scan', category: 'Anatomy', source: require('../3d-models/Bones/tomographic_scan.glb') },
    { id: 17, title: 'Uwf5 Ulna Bone', category: 'Anatomy', source: require('../3d-models/Bones/uwf5_ulna.glb') },

    // 🫀 image_23b684.png માંથી ઉમેરેલા Organs ફોલ્ડરના નવા મોડેલ્સ
    { id: 18, title: 'Beating Heart', category: 'Organs', source: require('../3d-models/Organs/beating-heart.glb') },
    { id: 19, title: 'Ecorche Anatomy Study', category: 'Organs', source: require('../3d-models/Organs/ecorche_-_anatomy_study.glb') },
    { id: 20, title: 'Excretory System', category: 'Organs', source: require('../3d-models/Organs/excretory_system.glb') },
    { id: 21, title: 'Human Liver', category: 'Organs', source: require('../3d-models/Organs/human_liver.glb') },
    { id: 22, title: 'Male Full Body Ecorche', category: 'Organs', source: require('../3d-models/Organs/male_full_body_ecorche.glb') },
    { id: 23, title: 'Realistic Human Heart', category: 'Organs', source: require('../3d-models/Organs/realistic_human_heart.glb') },
    { id: 24, title: 'Respiratory System', category: 'Organs', source: require('../3d-models/Organs/respiratory_system.glb') },
    { id: 25, title: 'Small and Large Intestine', category: 'Organs', source: require('../3d-models/Organs/small_and_large_intestine.glb') },
    { id: 26, title: 'Stomach Model', category: 'Organs', source: require('../3d-models/Organs/stomach.glb') },
  ];

  // ⚡ ફિલ્ટર અને સિંગલ મોડેલ ફોકસ માટેનું કેન્દ્રિય લોજિક
  const [selectedModelTitle, setSelectedModelTitle] = useState(null);

  const filteredModels = humanSystems.filter(model => {
    if (selectedModelTitle) {
      return model.title === selectedModelTitle;
    }
    return activeCategory === 'All' ? true : model.category === activeCategory;
  });

  // Laravel Backend સાથે ચેટબોક્સ મેસેજિંગ લોજિક
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      
      const aiReply = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: data.reply || "I couldn't fetch data from the medical AI server." 
      };
      setChatMessages(prev => [...prev, aiReply]);
    } catch (error) {
      console.log("Laravel Connection Error:", error);
      setChatMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: "⚠️ Connection Error: Cannot connect to Laravel Server!" 
      }]);
    }
  };

  const renderModelHtml = (modelUri, title) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
        <style>
          body { margin: 0; padding: 0; background-color: #121214; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; overflow: hidden; font-family: sans-serif; }
          model-viewer { width: 100%; height: 88%; }
          h3 { color: #a1a1aa; margin: 5px 0 0 0; font-size: 13px; font-weight: 500; text-align: center; letter-spacing: 0.5px; }
        </style>
      </head>
      <body>
        ${modelUri ? `<model-viewer src="${modelUri}" alt="${title}" auto-rotate camera-controls shadow-intensity="1"></model-viewer>` : `<div style="color: #ef4444; font-size: 13px;">Model Loading Error</div>`}
        <h3>${title}</h3>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Sidebar Navigation */}
      <View style={styles.sidebar}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.logo}>Anatomy<Text style={{color: '#00f0ff'}}>AI</Text></Text>
            
            {/* ૧. Dashboard Button */}
            <TouchableOpacity 
              style={[styles.menuItem, activeCategory === 'All' && !selectedModelTitle && styles.menuItemActive]}
              onPress={() => {
                setActiveCategory('All');
                setSelectedModelTitle(null);
              }}
            >
              <Text style={activeCategory === 'All' && !selectedModelTitle ? styles.menuTextActive : styles.menuText}>🟢 Dashboard</Text>
            </TouchableOpacity>

            {/* ૨. Anatomy Dropdown (Bones) */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={[styles.menuItem, activeCategory === 'Anatomy' && styles.menuItemActive]} 
                onPress={() => {
                  setIsAnatomyOpen(!isAnatomyOpen);
                  setIsOrgansOpen(false); // બીજું ડ્રોપડાઉન બંધ કરી દેશે
                  setActiveCategory('Anatomy');
                  setSelectedModelTitle(null);
                }}
              >
                <View style={styles.dropdownHeader}>
                  <Text style={activeCategory === 'Anatomy' ? styles.menuTextActive : styles.menuText}>🦴 Anatomy (Bones)</Text>
                  <Text style={styles.arrowIcon}>{isAnatomyOpen ? '▼' : '▶'}</Text>
                </View>
              </TouchableOpacity>
              
              {isAnatomyOpen && (
                <View style={styles.submenu}>
                  {humanSystems.filter(m => m.category === 'Anatomy' && m.id >= 7).map((boneModel) => (
                    <TouchableOpacity 
                      key={boneModel.id} 
                      style={styles.submenuItem} 
                      onPress={() => setSelectedModelTitle(boneModel.title)}
                    >
                      <Text style={[styles.submenuText, selectedModelTitle === boneModel.title && { color: '#00f0ff', fontWeight: 'bold' }]}>
                        💀 {boneModel.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* ૩. Pathology / Organs Dropdown */}
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={[styles.menuItem, activeCategory === 'Organs' && styles.menuItemActive]}
                onPress={() => {
                  setIsOrgansOpen(!isOrgansOpen);
                  setIsAnatomyOpen(false); // પહેલું ડ્રોપડાઉન બંધ કરી દેશે
                  setActiveCategory('Organs');
                  setSelectedModelTitle(null);
                }}
              >
                <View style={styles.dropdownHeader}>
                  <Text style={activeCategory === 'Organs' ? styles.menuTextActive : styles.menuText}>🫀 Pathology / Organs</Text>
                  <Text style={styles.arrowIcon}>{isOrgansOpen ? '▼' : '▶'}</Text>
                </View>
              </TouchableOpacity>

              {isOrgansOpen && (
                <View style={styles.submenu}>
                  {humanSystems.filter(m => m.category === 'Organs' && m.id >= 18).map((organModel) => (
                    <TouchableOpacity 
                      key={organModel.id} 
                      style={styles.submenuItem} 
                      onPress={() => setSelectedModelTitle(organModel.title)}
                    >
                      <Text style={[styles.submenuText, selectedModelTitle === organModel.title && { color: '#00f0ff', fontWeight: 'bold' }]}>
                        ❤️ {organModel.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* ૪. Collections */}
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>📚 Collections</Text>
            </TouchableOpacity>

            {/* ૫. Settings */}
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>⚙️ Settings</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.versionText}>v2.5 AI Beta</Text>
        </ScrollView>
      </View>

      {/* Main Content Workspace */}
      <ScrollView style={styles.mainDashboard} showsVerticalScrollIndicator={false}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <Text style={styles.navText}>🔍 Active Workspace: {selectedModelTitle ? `Focus / ${selectedModelTitle}` : activeCategory}</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileText}>Aarti Sonigra (Student)</Text>
          </View>
        </View>

        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>MEDICAL WORKSPACE ACTIVE</Text>
          </View>
          <Text style={styles.bannerText}>
            {selectedModelTitle ? selectedModelTitle : "Interactive Human Anatomy"}
          </Text>
          <Text style={styles.subBannerText}>
            {selectedModelTitle ? "Displaying targeted anatomical 3D structure rendering under WebGL core metrics." : "Explore high-fidelity 3D biological models with real-time rotation controls and AI diagnostics."}
          </Text>
        </View>

        {/* Dynamic Category Tabs */}
        <View style={styles.tabContainer}>
          {['All', 'Organs', 'Systems', 'Anatomy'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.tabButton, activeCategory === cat && !selectedModelTitle && styles.tabButtonActive]}
              onPress={() => {
                setActiveCategory(cat);
                setSelectedModelTitle(null);
              }}
            >
              <Text style={[styles.tabButtonText, activeCategory === cat && !selectedModelTitle && styles.tabButtonTextActive]}>
                {cat} ({cat === 'All' ? humanSystems.length : humanSystems.filter(m => m.category === cat).length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Human Systems Grid */}
{/* Human Systems Grid */}
<View style={styles.grid}>
  {filteredModels.map((system) => {
    let modelUri = '';
    // તારું existing URI લોજિક
    try {
      if (system.source) {
        if (typeof system.source === 'string') {
          modelUri = system.source;
        } else {
          const asset = Image.resolveAssetSource(system.source);
          modelUri = asset ? asset.uri : '';
        }
      }
    } catch (error) { console.log(error); }

    return (
      <View key={system.id} style={[styles.card, selectedModelTitle ? { width: '100%', height: 500 } : null]}>
        
        {/* ૧. TOP NAVBAR (કાર્ડની અંદર) */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{system.title}</Text>
          {selectedModelTitle && (
            <TouchableOpacity onPress={() => setSelectedModelTitle(null)}>
              <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>✕ Close</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ૨. 3D HUMAN MODEL (વચ્ચેનો ભાગ) */}
        <View style={styles.modelDisplayArea}>
          {Platform.OS === 'web' ? (
            <iframe srcDoc={renderModelHtml(modelUri, system.title)} style={{ width: '100%', height: '100%', border: 'none' }} title={system.title} />
          ) : (
            WebView && <WebView originWhitelist={['*']} source={{ html: renderModelHtml(modelUri, system.title) }} style={styles.webview} javaScriptEnabled={true} domStorageEnabled={true} />
          )}
        </View>

        {/* ૩. BOTTOM INFO PANEL / CONTROLS */}
        <View style={styles.cardFooter}>
          <Text style={styles.cardTag}>{system.category.toUpperCase()}</Text>
          <TouchableOpacity style={styles.footerBtn}>
            <Text style={styles.footerBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  })}
</View>

        {/* Bottom Diagnostics Section */}
        <View style={styles.bottomSection}>
          <View style={styles.activityBox}>
            <Text style={styles.sectionTitle}>📈 System Diagnostics</Text>
            <Text style={styles.bodyText}>• GPU Acceleration: Active</Text>
            <Text style={styles.bodyText}>• Total Loaded Modules: {humanSystems.length} 3D Assets</Text>
          </View>
          
          <View style={styles.actionBox}>
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.btnText}>Launch Assessment Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.actionBtnAI]} 
              onPress={() => setIsChatOpen(true)}
            >
              <Text style={styles.btnTextAI}>Open AI Assistant</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* AI Assistant Chat Window */}
      {isChatOpen ? (
        <View style={styles.chatWindow}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatHeaderTitle}>🤖 Anatomy AI Assistant</Text>
            <TouchableOpacity onPress={() => setIsChatOpen(false)}>
              <Text style={styles.closeChatBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.chatMessageArea} contentContainerStyle={{ paddingBottom: 10 }}>
            {chatMessages.map((msg) => (
              <View key={msg.id} style={[styles.msgBubble, msg.sender === 'user' ? styles.msgUser : styles.msgAi]}>
                <Text style={styles.msgText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <TextInput 
              style={styles.chatTextInput} 
              placeholder="Ask anything..." 
              placeholderTextColor="#636366"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Text style={styles.sendBtnText}>➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.floatingChatIcon} onPress={() => setIsChatOpen(true)}>
          <Text style={styles.chatIconText}>🤖 AI</Text>
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#0a0a0c', position: 'relative' },
  sidebar: { width: 260, backgroundColor: '#121215', padding: 25, borderRightWidth: 1, borderColor: '#1f1f23' },
  logo: { fontSize: 22, color: '#fff', fontWeight: '800', marginBottom: 40, letterSpacing: 0.5 },
  menuItem: { paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10, width: '100%' },
  menuItemActive: { backgroundColor: '#1c1c24', borderWidth: 1, borderColor: '#00f0ff' },
  menuTextActive: { color: '#00f0ff', fontWeight: '600', fontSize: 15 },
  menuText: { color: '#8e8e93', fontSize: 15, fontWeight: '500' },
  versionText: { color: '#3a3a43', fontSize: 12, fontWeight: '500', textAlign: 'center', marginTop: 20 },
  
  dropdownContainer: { width: '100%' },
  dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  arrowIcon: { color: '#636366', fontSize: 10 },
  submenu: { backgroundColor: '#16161a', borderRadius: 8, paddingLeft: 15, paddingVertical: 5, marginBottom: 10, borderLeftWidth: 2, borderColor: '#00f0ff' },
  submenuItem: { paddingVertical: 8 },
  submenuText: { color: '#8e8e93', fontSize: 13 },

  mainDashboard: { flex: 1, padding: 35 },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  navText: { color: '#636366', fontSize: 14 },
  profileBadge: { backgroundColor: '#1c1c24', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#2a2a35' },
  profileText: { color: '#00f0ff', fontSize: 13, fontWeight: '600' },
  welcomeBanner: { backgroundColor: '#121215', borderRadius: 16, padding: 30, marginBottom: 30, borderWidth: 1, borderColor: '#1f1f23' },
  bannerBadge: { backgroundColor: 'rgba(0, 240, 255, 0.1)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 12 },
  bannerBadgeText: { color: '#00f0ff', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  bannerText: { fontSize: 28, fontWeight: '800', color: '#ffffff' },
  subBannerText: { fontSize: 14, color: '#8e8e93', marginTop: 6, lineHeight: 20 },
  tabContainer: { flexDirection: 'row', gap: 10, marginBottom: 25, borderBottomWidth: 1, borderColor: '#1f1f23', paddingBottom: 12 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#121215', borderWidth: 1, borderColor: '#1f1f23' },
  tabButtonActive: { backgroundColor: '#00f0ff', borderColor: '#00f0ff' },
  tabButtonText: { color: '#8e8e93', fontSize: 13, fontWeight: '600' },
  tabButtonTextActive: { color: '#000000' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginBottom: 30 },
  
  // ✅ અપડેટેડ કાર્ડ સ્ટાઇલ
  card: { width: '31.5%', height: 380, backgroundColor: '#121215', borderRadius: 14, borderWidth: 1, borderColor: '#1f1f23', overflow: 'hidden', flexDirection: 'column' },
  cardHeader: { height: 45, backgroundColor: '#16161a', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderBottomWidth: 1, borderColor: '#1f1f23' },
  cardTitle: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  cardTag: { color: '#8e8e93', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardDot: { color: '#34c759', fontSize: 10, fontWeight: '700' },
  modelDisplayArea: { flex: 1, backgroundColor: '#0a0a0c' },
  cardFooter: { height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderTopWidth: 1, borderColor: '#1f1f23' },
  footerBtn: { backgroundColor: '#1c1c24', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  footerBtnText: { color: '#00f0ff', fontSize: 12, fontWeight: '600' },
  webview: { flex: 1, backgroundColor: 'transparent' },

  bottomSection: { flexDirection: 'row', gap: 24 },
  activityBox: { flex: 2, minHeight: 170, backgroundColor: '#121215', borderRadius: 14, padding: 24, borderWidth: 1, borderColor: '#1f1f23' },
  actionBox: { flex: 1, minHeight: 170, backgroundColor: '#121215', borderRadius: 14, padding: 24, borderWidth: 1, borderColor: '#1f1f23', justifyContent: 'space-between' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  bodyText: { color: '#8e8e93', fontSize: 13, marginBottom: 6 },
  actionBtn: { padding: 12, backgroundColor: '#00f0ff', borderRadius: 8, alignItems: 'center' },
  btnText: { fontWeight: '700', color: '#000', fontSize: 13 },
  actionBtnAI: { marginTop: 10, backgroundColor: '#1c1c24', borderWidth: 1, borderColor: '#00f0ff' },
  btnTextAI: { fontWeight: '700', color: '#00f0ff', fontSize: 13 },
  
  floatingChatIcon: { position: 'absolute', bottom: 35, right: 35, width: 65, height: 65, backgroundColor: '#121215', borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00f0ff' },
  chatIconText: { color: '#00f0ff', fontWeight: '800', fontSize: 16 },
  onlineIndicator: { position: 'absolute', top: 3, right: 5, width: 12, height: 12, backgroundColor: '#34c759', borderRadius: 6, borderWidth: 2, borderColor: '#121215' },
  chatWindow: { position: 'absolute', bottom: 35, right: 35, width: 380, height: 500, backgroundColor: '#121215', borderRadius: 16, borderWidth: 1, borderColor: '#2a2a35', overflow: 'hidden' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#1c1c24', borderBottomWidth: 1, borderColor: '#2a2a35' },
  chatHeaderTitle: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  closeChatBtn: { color: '#8e8e93', fontSize: 16, fontWeight: '600', paddingHorizontal: 5 },
  chatMessageArea: { flex: 1, padding: 16 },
  msgBubble: { padding: 12, borderRadius: 12, marginBottom: 10, maxWidth: '85%' },
  msgAi: { backgroundColor: '#1c1c24', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  msgUser: { backgroundColor: '#00f0ff', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  msgText: { color: '#ffffff', fontSize: 13, lineHeight: 18 },
  chatInputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#16161a', borderTopWidth: 1, borderColor: '#1f1f23', alignItems: 'center' },
  chatTextInput: { flex: 1, height: 40, backgroundColor: '#121215', borderRadius: 8, paddingHorizontal: 12, color: '#ffffff', fontSize: 13, borderWidth: 1, borderColor: '#2a2a35' },
  sendBtn: { marginLeft: 10, width: 40, height: 40, backgroundColor: '#00f0ff', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  sendBtnText: { color: '#000000', fontWeight: 'bold', fontSize: 16 }
});