import React, { useState, useEffect, useRef, useContext } from 'react'; 
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, TextInput, ActivityIndicator } from 'react-native';

import AnatomyMenu from './AnatomyMenu';
import OrgansMenu from './OrgansMenu';
import { SettingsContext } from '../context/SettingsContext'; // Global Context Import

let WebView;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

// Static Array for 3D Models Data
const humanSystems = [
  { id: 1, title: 'Respiratory (Lungs)', category: 'Organs', source: require('../3d-models-backup/lungs.glb'), desc: 'Lungs exchange oxygen and carbon dioxide. Analyzed for underlying pathologies like Asthma, Pneumonia, and chronic COPD complications.', medicalFocus: 'Gas Exchange Efficiency, Tidal Volume, Alveoli Surface Area', status: 'NORMAL', telemetry: 'RR: 16 bpm | SpO2: 98%', metadata: 'GLB | 14.2k polys' },
  { id: 2, title: 'Cardiovascular (Heart)', category: 'Organs', source: require('../3d-models-backup/jantung.glb'), desc: 'Central muscular organ pumping blood. Monitored for Myocardial Infarction, Arrhythmia, and Congenital Valve conditions.', medicalFocus: 'Stroke Volume, Coronary Blood Flow, Systolic Metric', status: 'ANOMALY', telemetry: 'BPM: 104 | Flow: 5.2 L/m', metadata: 'GLB | 22.1k polys' }, 
  { id: 3, title: 'Abdomen Anatomy', category: 'Anatomy', source: require('../3d-models-backup/abdomen_anatomy.glb'), desc: 'Comprehensive skeletal structure of the midsection protecting core visceral organs.', medicalFocus: 'Lumbar Spine Alignment, Costal Margin Structural Integrity', status: 'NORMAL', telemetry: 'Alignment: Optimal', metadata: 'GLB | 35.0k polys' }, 
  { id: 4, title: 'Circulatory System', category: 'Systems', source: require('../3d-models-backup/coeur_et_vaissaaux.glb'), desc: 'Network of blood vessels routing oxygenated and deoxygenated blood through the body.', medicalFocus: 'Arterial Pressure, Vascular Resistance, Capillary Exchange Rate', status: 'SCANNING', telemetry: 'SYS/DIA: 120/80 mmHg', metadata: 'GLB | 18.7k polys' }, 
  { id: 5, title: 'Skeletal System', category: 'Systems', source: require('../3d-models-backup/anatomical_scan_test.glb'), desc: 'Complete framework of bones providing structural posture, leverage, and bone marrow synthesis.', medicalFocus: 'Overall Bone Density, Calcium Homeostasis, Joint Articulation', status: 'NORMAL', telemetry: 'Density: 1.2 g/cm²', metadata: 'GLB | 42.1k polys' },
  { id: 6, title: 'Muscular System', category: 'Systems', source: require('../3d-models-backup/visible_interactive_human_-_exploding_skull.glb'), desc: 'Skeletal muscle fibers facilitating kinetic movement, thermal homeostasis, and balance.', medicalFocus: 'Myofibril Hypertrophy, Tendon Insertion Tensile Strength', status: 'NORMAL', telemetry: 'Mass Index: 38.4%', metadata: 'GLB | 51.3k polys' },
  { id: 7, title: 'Ears Study', category: 'Anatomy', source: require('../3d-models-backup/Bones/ears_study.glb'), desc: 'Detailed analysis of the auditory ossicles (Malleus, Incus, Stapes) within the temporal bone area.', medicalFocus: 'Acoustic Conduction Waveform, Vestibular Balance Metrics', status: 'NORMAL', telemetry: 'Conduction: 100%', metadata: 'GLB | 12.8k polys' },
  { id: 8, title: 'Wax Model Group 6', category: 'Anatomy', source: require('../3d-models-backup/Bones/group_6_wax_2.glb'), desc: 'Histological structure representing micro-bone configurations and marrow cavities.', medicalFocus: 'Trabecular Bone Architecture, Haversian System Interlink', status: 'SCANNING', telemetry: 'Mapping Micro-cavities', metadata: 'GLB | 28.4k polys' },
  { id: 9, title: 'Human Skull', category: 'Anatomy', source: require('../3d-models-backup/Bones/human_skull.glb'), desc: 'Cranial and facial bones protecting the cerebral cortex and supporting facial sensory systems.', medicalFocus: 'Cranial Sutures Fusion, Mandibular Fossa Trauma Risk', status: 'NORMAL', telemetry: 'Suture Fuse: Stable', metadata: 'GLB | 33.1k polys' },
  { id: 10, title: 'Left Upper Limb', category: 'Anatomy', source: require('../3d-models-backup/Bones/left_upper_limb.glb'), desc: 'Skeletal layout of the Humerus, Radius, and Ulna including articular cartilage mappings.', medicalFocus: 'Glenohumeral Joint Articulation, Fracture Fracture Velocity', status: 'ANOMALY', telemetry: 'Micro-fracture Risk: Low', metadata: 'GLB | 19.5k polys' },
  { id: 11, title: 'Mandible CT Scan', category: 'Anatomy', source: require('../3d-models-backup/Bones/mandible_ct.glb'), desc: 'High-definition rendering of the lower jawbone detailing dental sockets and alveolar nerve channels.', medicalFocus: 'Temporomandibular Joint (TMJ) Stress, Bone Resorption State', status: 'NORMAL', telemetry: 'TMJ Stress: Normal', metadata: 'GLB | 24.0k polys' },
  { id: 12, title: 'Right Central Rib', category: 'Anatomy', source: require('../3d-models-backup/Bones/right_central_rib.glb'), desc: 'Elastic arched bony rod protecting the thoracic cavity and assisting in respiration kinetics.', medicalFocus: 'Costal Cartilage Elasticity, Intercostal Nerve Space Margin', status: 'NORMAL', telemetry: 'Elasticity Index: 0.88', metadata: 'GLB | 11.2k polys' },
  { id: 13, title: 'Right Foot CT', category: 'Anatomy', source: require('../3d-models-backup/Bones/right_foot_ct.glb'), desc: 'Complex alignment of Tarsals, Metatarsals, and Phalanges optimized for weight distribution.', medicalFocus: 'Plantar Arch Angle, Calcaneal Stress Load Indices', status: 'NORMAL', telemetry: 'Arch Angle: 142°', metadata: 'GLB | 29.7k polys' },
  { id: 14, title: 'Skull Right Side', category: 'Anatomy', source: require('../3d-models-backup/Bones/skull_right_side.glb'), desc: 'Lateral sagittal viewport of the cranium isolating parietal, temporal, and sphenoid zones.', medicalFocus: 'Zygomatic Arch Integrity, Auditory Meatus Alignment', status: 'NORMAL', telemetry: 'Meatus Align: 100%', metadata: 'GLB | 22.4k polys' },
  { id: 15, title: 'Thoracic Abdomen', category: 'Anatomy', source: require('../3d-models-backup/Bones/thoracic_abdomen.glb'), desc: 'The combined protective cage of ribs, sternum, and vertebrae housing critical cardiovascular systems.', medicalFocus: 'Spinal Curvature Alignment, Sternal Angle Integrity', status: 'ANOMALY', telemetry: 'Curvature Deviation: 3°', metadata: 'GLB | 41.6k polys' },
  { id: 16, title: 'Tomographic Scan', category: 'Anatomy', source: require('../3d-models-backup/Bones/tomographic_scan.glb'), desc: 'Cross-sectional density scan layer mapping cortical bone layers and medullary spaces.', medicalFocus: 'Hounsfield Units Metric, Cortical Thickness Profile', status: 'SCANNING', telemetry: 'HU Range: +400 to +1000', metadata: 'GLB | 31.0k polys' },
  { id: 17, title: 'Uwf5 Ulna Bone', category: 'Anatomy', source: require('../3d-models-backup/Bones/uwf5_ulna.glb'), desc: 'Medial forearm long bone detailing the olecranon process and articulation joints.', medicalFocus: 'Trochlear Notch Surface Friction, Styloid Process Integrity', status: 'NORMAL', telemetry: 'Surface Friction: Low', metadata: 'GLB | 14.5k polys' },
  { id: 18, title: 'Beating Heart', category: 'Organs', source: require('../3d-models-backup/Organs/beating-heart.glb'), desc: 'Dynamic cardiovascular loop illustrating real-time atrial and ventricular contraction cycles.', medicalFocus: 'Ejection Fraction, Sinuatrial Node Conduction Path', status: 'NORMAL', telemetry: 'EF: 62% | Sinus Rhythm', metadata: 'GLB | 38.2k polys' },
  { id: 19, title: 'Ecorche Anatomy Study', category: 'Organs', source: require('../3d-models-backup/Organs/ecorche_-_anatomy_study.glb'), desc: 'Superficial muscular and deep tissue organ alignment layout for positional accuracy analysis.', medicalFocus: 'Myological Tissue Depth, Subcutaneous Vascular Mapping', status: 'NORMAL', telemetry: 'Tissue Depth: Uniform', metadata: 'GLB | 44.1k polys' },
  { id: 20, title: 'Excretory System', category: 'Organs', source: require('../3d-models-backup/Organs/excretory_system.glb'), desc: 'Renal layout including Kidneys, Ureters, and Bladder structures filtering cellular toxins.', medicalFocus: 'Glomerular Filtration Rate (GFR), Nephron Function Retention', status: 'NORMAL', telemetry: 'GFR: 95 mL/min/1.73m²', metadata: 'GLB | 26.8k polys' },
  { id: 21, title: 'Human Liver', category: 'Organs', source: require('../3d-models-backup/Organs/human_liver.glb'), desc: 'Metabolic hub processing glycogen storage, plasma protein synthesis, and bile detoxification.', medicalFocus: 'Hepatic Portal Vein Pressure, Cirrhosis Fibrosis Scoring', status: 'NORMAL', telemetry: 'Portal Pressure: 8 mmHg', metadata: 'GLB | 23.5k polys' },
  { id: 22, title: 'Male Full Body Ecorche', category: 'Organs', source: require('../3d-models-backup/Organs/male_full_body_ecorche.glb'), desc: 'Integrated visual model displaying interaction of superficial organs and muscular partitions.', medicalFocus: 'Visceral Displacements, Somatotype Structural Biometrics', status: 'NORMAL', telemetry: 'Symmetric Profile Active', metadata: 'GLB | 59.4k polys' },
  { id: 23, title: 'Realistic Human Heart', category: 'Organs', source: require('../3d-models-backup/Organs/realistic_human_heart.glb'), desc: 'Photorealistic high-fidelity soft tissue cardiovascular model detailing coronary arteries.', medicalFocus: 'Aortic Valve Diameter, Left Ventricular Wall Thickening', status: 'NORMAL', telemetry: 'Aortic Valve: 2.1 cm', metadata: 'GLB | 34.0k polys' },
  { id: 24, title: 'Respiratory System', category: 'Organs', source: require('../3d-models-backup/Organs/respiratory_system.glb'), desc: 'Complete pulmonary tract from Trachea down to Bronchioles and Diaphragm dynamics.', medicalFocus: 'Pulmonary Compliance Rating, Airway Resistance Factors', status: 'NORMAL', telemetry: 'Compliance: Excellent', metadata: 'GLB | 29.1k polys' },
  { id: 25, title: 'Small and Large Intestine', category: 'Organs', source: require('../3d-models-backup/Organs/small_and_large_intestine.glb'), desc: 'Gastrointestinal absorption tracts handling micronutrient filtration and waste processing.', medicalFocus: 'Mucosal Surface Area Villi, Peristalsis Kinetic Velocity', status: 'NORMAL', telemetry: 'Peristalsis Rate: Normal', metadata: 'GLB | 32.4k polys' },
  { id: 26, title: 'Stomach Model', category: 'Organs', source: require('../3d-models-backup/Organs/stomach.glb'), desc: 'J-shaped digestive organ detailing the rugae folds, gastric fluid synthesis, and pyloric valves.', medicalFocus: 'Gastric Acid pH Regulation, Sphincter Patency Rating', status: 'NORMAL', telemetry: 'Gastric pH: 1.8', metadata: 'GLB | 18.2k polys' },
];

export default function DashboardScreen({ navigation, onLogout }) {
  const settings = useContext(SettingsContext);

  if (!settings) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B1020', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00f0ff" />
      </View>
    );
  }

  const { 
    profileName, setProfileName,
    themeMode, setThemeMode,
    autoRotate, setAutoRotate, 
    enableShadows, setEnableShadows,
    isSaving, saveSettingsToBackend 
  } = settings;

  const [activeCategory, setActiveCategory] = useState('All');
  const [isAnatomyOpen, setIsAnatomyOpen] = useState(false);
  const [isOrgansOpen, setIsOrgansOpen] = useState(false);
  const [collections, setCollections] = useState([1, 2, 5]); 
  const [isCollectionsActive, setIsCollectionsActive] = useState(false); 
  const [isSettingsActive, setIsSettingsActive] = useState(false); 
  const [fullScreenModel, setFullScreenModel] = useState(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedModelTitle, setSelectedModelTitle] = useState(null);

  const [tempProfileName, setTempProfileName] = useState(profileName);
  const iframeRef = useRef(null); 

  useEffect(() => {
    if (isSettingsActive) {
      setTempProfileName(profileName);
    }
  }, [isSettingsActive, profileName]);

  const toggleCollection = (id) => {
    setCollections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getModelUri = (source) => {
    if (typeof source === 'string') return source;
    if (typeof source === 'number' && Image.resolveAssetSource) {
      return Image.resolveAssetSource(source).uri;
    }
    return '';
  };

  const filteredModels = humanSystems.filter((model) => {
    if (isCollectionsActive) return collections.includes(model.id);
    if (selectedModelTitle) return model.title === selectedModelTitle;
    if (activeCategory !== 'All') return model.category === activeCategory;
    return true;
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput('');

    setTimeout(() => {
      const aiReply = { id: Date.now() + 1, sender: 'ai', text: `Analyzing telemetry data for request: "${chatInput}"` };
      setChatMessages((prev) => [...prev, aiReply]);
      if (isVoiceActive) speakMedicalText(aiReply.text);
    }, 1000);
  };

  const speakMedicalText = (text) => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoice = () => {
    const nextState = !isVoiceActive;
    setIsVoiceActive(nextState);
    if (nextState) {
      speakMedicalText(`Voice stream online. Showing diagnostics for ${fullScreenModel?.title}.`);
    } else {
      if (Platform.OS === 'web' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (fullScreenModel) {
      const isAnatomy = fullScreenModel.category === 'Anatomy';
      const welcomeText = isAnatomy 
        ? `Hello ${profileName}! AnatomyAI Skeletal System initiated for ${fullScreenModel.title}.`
        : `Hello ${profileName}! AnatomyAI Soft-Tissue telemetry ready for ${fullScreenModel.title}.`;
      setChatMessages([{ id: 1, sender: 'ai', text: welcomeText }]);
      if (isVoiceActive) speakMedicalText(welcomeText + " " + fullScreenModel.desc);
    }
  }, [fullScreenModel]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (event) => {
        if (event.data && event.data.type === 'CAPTURE_DONE') {
          const link = document.createElement('a');
          link.download = `AnatomyAI-${fullScreenModel?.title || 'Capture'}.png`;
          link.href = event.data.dataUrl;
          link.click();
        }
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [fullScreenModel]);

  const triggerIframeAction = (action) => {
    if (Platform.OS === 'web' && iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(action, '*');
    }
  };

  const renderModelHtml = (modelUri, title) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
        <style>
          body { margin: 0; padding: 0; background-color: #0B1020; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
          model-viewer { width: 100%; height: 100%; --poster-color: transparent; }
        </style>
      </head>
      <body>
        <model-viewer id="main-viewer" src="${modelUri}" alt="${title}" ${autoRotate ? 'auto-rotate' : ''} camera-controls shadow-intensity="${enableShadows ? '1.5' : '0'}" preserve-drawing-buffer></model-viewer>
        <script>
          const viewer = document.getElementById('main-viewer');
          window.parent.postMessage({type: 'VIEWER_READY'}, '*');
          window.addEventListener('message', (event) => {
            if(!viewer) return;
            if(event.data === 'zoom-in') { viewer.fieldOfView = (Math.max(12, viewer.getFieldOfView() - 10)) + 'deg'; }
            if(event.data === 'zoom-out') { viewer.fieldOfView = (Math.min(85, viewer.getFieldOfView() + 10)) + 'deg'; }
            if(event.data === 'reset') { viewer.fieldOfView = 'auto'; viewer.cameraOrbit = 'unset'; }
            if(event.data === 'capture') { window.parent.postMessage({type: 'CAPTURE_DONE', dataUrl: viewer.toDataURL('image/png')}, '*'); }
          });
        </script>
      </body>
    </html>
  `;

  // 🌟 FULL SCREEN VIEW MODE
  if (fullScreenModel) {
    const modelUri = getModelUri(fullScreenModel.source);
    return (
      <View style={styles.fullScreenContainer}>
        {/* LEFT 3D VIEWPORT */}
        <View style={styles.leftViewerArea}>
          <TouchableOpacity style={styles.backButton} onPress={() => setFullScreenModel(null)}>
            <Text style={styles.backButtonText}>⬅ Back to Terminal</Text>
          </TouchableOpacity>
          
          <View style={styles.fullScreenModelBox}>
            {Platform.OS === 'web' ? (
              <iframe 
                ref={iframeRef}
                srcDoc={renderModelHtml(modelUri, fullScreenModel.title)} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title={fullScreenModel.title} 
              />
            ) : (
              WebView && <WebView originWhitelist={['*']} source={{ html: renderModelHtml(modelUri, fullScreenModel.title) }} style={styles.webview} />
            )}
          </View>

          {/* FLOATING ACTION CONTROLS */}
          <View style={styles.floatingControlsContainer}>
            <TouchableOpacity style={styles.floatingBtn} onPress={() => triggerIframeAction('zoom-in')}>
              <Text style={styles.floatingBtnIcon}>➕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn} onPress={() => triggerIframeAction('zoom-out')}>
              <Text style={styles.floatingBtnIcon}>➖</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn} onPress={() => triggerIframeAction('reset')}>
              <Text style={styles.floatingBtnIcon}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn} onPress={() => triggerIframeAction('capture')}>
              <Text style={styles.floatingBtnIcon}>📸</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.floatingBtn, isVoiceActive && styles.floatingBtnVoiceActive]} onPress={toggleVoice}>
              <Text style={styles.floatingBtnIcon}>🎙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RIGHT MEDICAL DIAGNOSTICS PANEL */}
        <View style={styles.rightInfoPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{fullScreenModel.title}</Text>
            <Text style={[styles.panelTag, { color: '#00f0ff' }]}>{fullScreenModel.category.toUpperCase()}</Text>
          </View>

          {/* 🎯 ૧. ફૂલ સ્ક્રીન મોડલ માટેનું નવું QUIZ BUTTON */}
          <TouchableOpacity 
            style={styles.quizLaunchBtn} 
            onPress={() => navigation.navigate('Quiz', { targetSystem: fullScreenModel.title })}
          >
            <Text style={styles.quizLaunchBtnText}>🎯 Start Live Quiz</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={styles.infoContentBox}>
              <Text style={styles.infoSectionTitle}>Clinical Overview</Text>
              <Text style={styles.infoBodyText}>{fullScreenModel.desc}</Text>
            </View>

            <View style={styles.infoContentBox}>
              <Text style={styles.infoSectionTitle}>Medical Focus Points</Text>
              <Text style={styles.infoBodyText}>{fullScreenModel.medicalFocus}</Text>
            </View>

            {/* AI CHAT */}
            <View style={styles.panelAiSection}>
              <Text style={styles.infoSectionTitle}>AnatomyAI Copilot</Text>
              <View style={styles.panelAiChat}>
                {chatMessages.map((msg) => (
                  <View key={msg.id} style={[styles.msgBubble, msg.sender === 'user' ? styles.msgUser : styles.msgAi]}>
                    <Text style={styles.msgText}>{msg.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* CHAT INPUT */}
          <View style={styles.panelInputBox}>
            <TextInput 
              style={styles.panelTextInput} 
              placeholder="Ask Copilot for diagnostics..." 
              placeholderTextColor="#727282"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity style={styles.panelSendBtn} onPress={handleSendMessage}>
              <Text style={{ color: '#0B1020', fontWeight: '900' }}>➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // 🌟 STANDARD DASHBOARD VIEW
  return (
    <View style={styles.container}>
      {/* SIDEBAR NAVIGATION */}
      <View style={styles.sidebar}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.logo}>Anatomy<Text style={{color: '#00f0ff'}}>AI</Text></Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, activeCategory === 'All' && !selectedModelTitle && !isCollectionsActive && !isSettingsActive && styles.menuItemActive]}
            onPress={() => { setActiveCategory('All'); setSelectedModelTitle(null); setIsCollectionsActive(false); setIsSettingsActive(false); }}
          >
            <Text style={activeCategory === 'All' && !selectedModelTitle && !isCollectionsActive && !isSettingsActive ? styles.menuTextActive : styles.menuText}>🖥️ Terminal Dashboard</Text>
          </TouchableOpacity>

          <AnatomyMenu 
            isAnatomyOpen={isAnatomyOpen} setIsAnatomyOpen={setIsAnatomyOpen} setIsOrgansOpen={setIsOrgansOpen}
            activeCategory={isCollectionsActive || isSettingsActive ? '' : activeCategory} setActiveCategory={(cat) => { setActiveCategory(cat); setIsCollectionsActive(false); setIsSettingsActive(false); }}
            selectedModelTitle={selectedModelTitle} setSelectedModelTitle={setSelectedModelTitle} humanSystems={humanSystems}
          />

          <OrgansMenu 
            isOrgansOpen={isOrgansOpen} setIsOrgansOpen={setIsOrgansOpen} setIsAnatomyOpen={setIsAnatomyOpen}
            activeCategory={isCollectionsActive || isSettingsActive ? '' : activeCategory} setActiveCategory={(cat) => { setActiveCategory(cat); setIsCollectionsActive(false); setIsSettingsActive(false); }}
            selectedModelTitle={selectedModelTitle} setSelectedModelTitle={setSelectedModelTitle} humanSystems={humanSystems}
          />

          <TouchableOpacity style={[styles.menuItem, isCollectionsActive && styles.menuItemActive]} onPress={() => { setIsCollectionsActive(true); setSelectedModelTitle(null); setIsSettingsActive(false); }}>
            <Text style={isCollectionsActive ? styles.menuTextActive : styles.menuText}>📂 Core Collections ({collections.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, isSettingsActive && styles.menuItemActive, {marginTop: 5}]} onPress={() => { setIsSettingsActive(true); setIsCollectionsActive(false); setSelectedModelTitle(null); }}>
            <Text style={isSettingsActive ? styles.menuTextActive : styles.menuText}>⚙️ Settings Config</Text>
          </TouchableOpacity>

          {/* 🧠 ૨. સાઇડબાર મેનૂ માટેનું નવું QUIZ BUTTON */}
          <TouchableOpacity 
            style={[styles.menuItem, { marginTop: 15, backgroundColor: 'rgba(0, 240, 255, 0.05)', borderWidth: 1, borderColor: '#00f0ff' }]} 
            onPress={() => navigation.navigate('Quiz', { targetSystem: activeCategory })}
          >
            <Text style={[styles.menuText, { color: '#00f0ff', fontWeight: 'bold' }]}>✍️ Take Module Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* DYNAMIC CONTENT SPACE */}
      <ScrollView style={styles.mainDashboard} showsVerticalScrollIndicator={false}>
        <View style={styles.navbar}>
          <Text style={styles.navText}>🌐 Analytics Matrix: <Text style={{color: '#fff'}}>{isSettingsActive ? 'Settings Panel' : isCollectionsActive ? 'Core Collections' : activeCategory}</Text></Text>
          <View style={styles.profileBadge}><Text style={styles.profileText}>{profileName}</Text></View>
        </View>

        {isSettingsActive ? (
          <View style={styles.settingsContainer}>
            <Text style={styles.settingsHeader}>System Configuration Panel</Text>
            <Text style={styles.settingsSubheader}>Manage 3D graphics rendering, profile credentials, and terminal state.</Text>
            
            {/* Operator Profile Card */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsSectionTitle}>👤 Operator Profile</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Profile Name</Text>
                <TextInput 
                  style={styles.settingsInput}
                  value={tempProfileName}
                  onChangeText={setTempProfileName}
                  placeholder="Enter profile name"
                  placeholderTextColor="#727282"
                />
                <TouchableOpacity 
                  style={styles.saveProfileBtn} 
                  onPress={() => {
                    setProfileName(tempProfileName);
                    saveSettingsToBackend(); 
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#00f0ff" />
                  ) : (
                    <Text style={styles.saveProfileBtnText}>💾 Save Profile Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* 3D Graphics Control Card */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsSectionTitle}>🛠️ 3D Graphics Engine Settings</Text>
              
              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.toggleLabel}>Auto-Rotate Models</Text>
                  <Text style={styles.toggleDesc}>Enable continuous 360° rotation of anatomical models.</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.toggleBtn, autoRotate && styles.toggleBtnActive]} 
                  onPress={() => setAutoRotate(!autoRotate)}
                >
                  <Text style={[styles.toggleBtnText, autoRotate && {color: '#00f0ff'}]}>{autoRotate ? 'ENABLED' : 'DISABLED'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.toggleLabel}>High-Fidelity Shadows</Text>
                  <Text style={styles.toggleDesc}>Render realistic shadows for better depth perception.</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.toggleBtn, enableShadows && styles.toggleBtnActive]} 
                  onPress={() => setEnableShadows(!enableShadows)}
                >
                  <Text style={[styles.toggleBtnText, enableShadows && {color: '#00f0ff'}]}>{enableShadows ? 'ENABLED' : 'DISABLED'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* System Actions Card */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsSectionTitle}>⚙️ Core System Actions</Text>
              <View style={styles.toggleRow}>
                <View>
                  <Text style={styles.toggleLabel}>Terminal Theme</Text>
                  <Text style={styles.toggleDesc}>Switch between light and high-contrast dark matrix modes.</Text>
                </View>
                <View style={styles.themeBtnGroup}>
                  <TouchableOpacity 
                    style={[styles.themeBtn, themeMode === 'dark' && styles.themeBtnActive]} 
                    onPress={() => setThemeMode('dark')}
                  >
                    <Text style={[styles.themeBtnText, themeMode === 'dark' && {color: '#00f0ff'}]}>Dark Matrix</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.themeBtn, themeMode === 'light' && styles.themeBtnActive]} 
                    onPress={() => setThemeMode('light')}
                  >
                    <Text style={[styles.themeBtnText, themeMode === 'light' && {color: '#00f0ff'}]}>Light Mode</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                <Text style={styles.logoutBtnText}>⚠️ Disconnect Session (Logout)</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredModels.map((system) => {
              const modelUri = getModelUri(system.source);
              const isFavorited = collections.includes(system.id);
              const statusColor = system.status === 'NORMAL' ? '#00e676' : system.status === 'ANOMALY' ? '#ff3d00' : '#ffea00';

              return (
                <View key={system.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{system.title}</Text>
                    <View style={[styles.statusBadge, { borderColor: statusColor + '44' }]}>
                      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                      <Text style={[styles.statusText, { color: statusColor }]}>{system.status}</Text>
                    </View>
                  </View>

                  <View style={styles.modelDisplayArea}>
                    {Platform.OS === 'web' ? (
                      <iframe srcDoc={renderModelHtml(modelUri, system.title)} style={{ width: '100%', height: '100%', border: 'none' }} title={system.title} />
                    ) : (
                      WebView && <WebView originWhitelist={['*']} source={{ html: renderModelHtml(modelUri, system.title) }} style={styles.webview} />
                    )}
                  </View>

                  <View style={styles.telemetryStrip}>
                    <Text style={styles.telemetryText}>📊 {system.telemetry}</Text>
                    <Text style={styles.metadataText}>⚡ {system.metadata}</Text>
                  </View>
                  
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardTag}>{system.category.toUpperCase()}</Text>
                    <View style={styles.actionRow}>
                      <TouchableOpacity 
                        style={[styles.collectBtn, isFavorited && styles.collectBtnActive]} 
                        onPress={() => toggleCollection(system.id)}
                      >
                        <Text style={[styles.collectBtnText, isFavorited && { color: '#ffb703' }]}>
                          {isFavorited ? '★' : '☆'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.footerBtn} onPress={() => setFullScreenModel(system)}>
                        <Text style={styles.footerBtnText}>Open 3D View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
            {isCollectionsActive && filteredModels.length === 0 && (
              <Text style={{color: '#727282', fontSize: 15, width: '100%', textAlign: 'center', marginTop: 40}}>No models in your collection yet. Tap '☆' on any card to add!</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// 🎨 3D TERMINAL UI DESIGN SYSTEM (RECONSTRUCTED)
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#0B1020' },
  sidebar: { width: 270, backgroundColor: '#0F131C', padding: 25, borderRightWidth: 1, borderColor: '#1E2633' },
  logo: { fontSize: 24, color: '#fff', fontWeight: '900', marginBottom: 40, letterSpacing: 0.8 },
  menuItem: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, marginBottom: 10 },
  menuItemActive: { backgroundColor: 'rgba(0, 240, 255, 0.08)', borderWidth: 1, borderColor: '#00f0ff' },
  menuText: { color: '#727282', fontSize: 15, fontWeight: '500' },
  menuTextActive: { color: '#00f0ff', fontWeight: '700' },
  mainDashboard: { flex: 1, padding: 40, backgroundColor: '#0B1020' },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35, borderBottomWidth: 1, borderColor: '#1E2633', paddingBottom: 20 },
  navText: { color: '#727282', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  profileBadge: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1E293B', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  profileText: { color: '#00f0ff', fontSize: 12, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 25 },
  card: { width: '31%', backgroundColor: '#0F131C', borderWidth: 1, borderColor: '#1E2633', borderRadius: 6, padding: 18, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '800', flex: 1, marginRight: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  modelDisplayArea: { height: 180, backgroundColor: '#070A0F', borderRadius: 4, overflow: 'hidden', marginBottom: 15 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  telemetryStrip: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#1E2633', paddingVertical: 10, marginBottom: 15 },
  telemetryText: { color: '#E7B800', fontSize: 11, fontWeight: '600' },
  metadataText: { color: '#A4A5G8', fontSize: 10, fontWeight: '700' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTag: { color: '#A4A5G8', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  collectBtn: { width: 32, height: 32, borderWidth: 1, borderColor: '#1E2633', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  collectBtnActive: { borderColor: '#ffb703' },
  collectBtnText: { color: '#A4A5G8', fontSize: 16, fontWeight: '700' },
  footerBtn: { backgroundColor: '#1E2633', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 4 },
  footerBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Settings Style Mockup
  settingsContainer: { maxWidth: 800 },
  settingsHeader: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 4 },
  settingsSubheader: { color: '#727282', fontSize: 13, marginBottom: 25 },
  settingsCard: { backgroundColor: '#0F131C', borderStyle: 'solid', borderWidth: 1, borderColor: '#1E2633', borderRadius: 6, padding: 20, marginBottom: 20 },
  settingsSectionTitle: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 20 },
  inputGroup: { gap: 8 },
  inputLabel: { color: '#727282', fontSize: 12, fontWeight: '600' },
  settingsInput: { height: 42, backgroundColor: '#070A0F', borderWidth: 1, borderColor: '#1E2633', borderRadius: 4, paddingHorizontal: 14, color: '#fff', fontSize: 14, marginBottom: 5 },
  saveProfileBtn: { height: 40, borderRadius: 4, borderWidth: 1, borderColor: '#00f0ff', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveProfileBtnText: { color: '#00f0ff', fontSize: 12, fontWeight: '700' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  toggleLabel: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 3 },
  toggleDesc: { color: '#727282', fontSize: 11, maxWidth: 450, lineHeight: 15 },
  toggleBtn: { borderStyle: 'solid', borderWidth: 1, borderColor: '#1E2633', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 4, minWidth: 85, alignItems: 'center' },
  toggleBtnActive: { borderColor: '#00f0ff' },
  toggleBtnText: { color: '#727282', fontSize: 11, fontWeight: '700' },
  themeBtnGroup: { flexDirection: 'row', gap: 8 },
  themeBtn: { borderWidth: 1, borderColor: '#1E2633', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  themeBtnActive: { borderColor: '#00f0ff' },
  themeBtnText: { color: '#727282', fontSize: 11, fontWeight: '700' },
  logoutBtn: { borderWidth: 1, borderColor: '#5A1E1E', backgroundColor: '#2A1414', paddingVertical: 12, borderRadius: 4, alignItems: 'center', marginTop: 10 },
  logoutBtnText: { color: '#FF5C5C', fontSize: 13, fontWeight: '700' },

  // Full Screen Viewport Styles
  fullScreenContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#0B1020' },
  leftViewerArea: { flex: 1, position: 'relative' },
  backButton: { position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(15, 19, 28, 0.85)', borderWidth: 1, borderColor: '#1E2633', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 4, zIndex: 10 },
  backButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  fullScreenModelBox: { flex: 1, backgroundColor: '#0B1020' },
  floatingControlsContainer: { position: 'absolute', bottom: 20, left: 20, flexDirection: 'row', gap: 10, zIndex: 10 },
  floatingBtn: { backgroundColor: '#0F131C', borderColor: '#1E2633', borderWidth: 1, width: 40, height: 40, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  floatingBtnVoiceActive: { borderColor: '#00f0ff', backgroundColor: 'rgba(0, 240, 255, 0.1)' },
  floatingBtnIcon: { fontSize: 16 },
  rightInfoPanel: { width: 360, backgroundColor: '#0F131C', borderLeftWidth: 1, borderColor: '#1E2633', padding: 20 },
  panelHeader: { borderBottomWidth: 1, borderColor: '#1E2633', paddingBottom: 15, marginBottom: 20 },
  panelTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 5 },
  panelTag: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  infoContentBox: { backgroundColor: '#070A0F', borderWidth: 1, borderColor: '#1E2633', borderRadius: 4, padding: 14, marginBottom: 15 },
  infoSectionTitle: { color: '#E7B800', fontSize: 12, fontWeight: '800', letterSpacing: 0.3, marginBottom: 5 },
  infoBodyText: { color: '#fff', fontSize: 13, lineHeight: 18 },
  panelAiSection: { marginBottom: 15 },
  panelAiChat: { borderWidth: 1, borderColor: '#1E2633', borderRadius: 4, padding: 12, minHeight: 120, gap: 10 },
  msgBubble: { padding: 10, borderRadius: 4, maxWidth: '85%' },
  msgUser: { backgroundColor: '#1E2633', alignSelf: 'flex-end' },
  msgAi: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1e293b', alignSelf: 'flex-start' },
  msgText: { color: '#fff', fontSize: 12, lineHeight: 16 },
  panelInputBox: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderColor: '#1E2633', paddingTop: 15, marginTop: 10 },
  panelTextInput: { flex: 1, height: 38, backgroundColor: '#070A0F', borderWidth: 1, borderColor: '#1E2633', borderRadius: 4, paddingHorizontal: 12, color: '#fff', fontSize: 13 },
  panelSendBtn: { backgroundColor: '#00f0ff', width: 38, height: 38, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  
  // ✨ નવું ક્વિઝ બટન સ્ટાઇલ
  quizLaunchBtn: { backgroundColor: '#00f0ff', paddingVertical: 12, borderRadius: 4, alignItems: 'center', marginBottom: 15 },
  quizLaunchBtnText: { color: '#0B1020', fontSize: 14, fontWeight: '900' }
});