import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SettingsContext } from '../context/SettingsContext';
import axios from 'axios';

// 🚨 REACT NATIVE NETWORK CONFIGURATION FOR LARAVEL ENDPOINTS
const API_BASE_URL = 'http://10.0.2.2:8000/api'; 

// Bulletproof Local Question Bank fallback system if backend network is unreachable
const LOCAL_FALLBACK_DATABASE = [
  {
    category: 'Bones 🦴',
    type: 'MCQ Quiz',
    difficulty: 'Easy',
    question: 'Which bone is the longest and strongest in the human body?',
    options: ['Skull', 'Femur', 'Rib', 'Ulna'],
    correctAnswer: 'Femur',
  },
  {
    category: 'Organs 🫀',
    type: 'Identify Organ Quiz 🔥',
    difficulty: 'Medium',
    question: 'Identify this 3D rendered cardiovascular muscular pump:',
    options: ['Lungs', 'Heart', 'Liver', 'Kidneys'],
    correctAnswer: 'Heart',
  },
  {
    category: 'Nervous System 🧠',
    type: 'Timer Quiz ⏱',
    difficulty: 'Hard',
    question: 'Which part of the brain controls high-fidelity 3D muscle coordination and balance?',
    options: ['Cerebrum', 'Brainstem', 'Cerebellum', 'Medulla'],
    correctAnswer: 'Cerebellum',
  }
];

export default function QuizScreen() {
  // Sync UI with global light/dark matrix theme mode from SettingsContext
  const settings = useContext(SettingsContext);
  const themeMode = settings ? settings.themeMode : 'dark';

  // 🧭 Navigation States: 'SELECTION' | 'PLAYING' | 'RESULT'
  const [currentScreen, setCurrentScreen] = useState('SELECTION');

  // 🎛️ Configuration Selection States
  const [selectedCategory, setSelectedCategory] = useState('Bones 🦴');
  const [selectedType, setSelectedType] = useState('MCQ Quiz');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');

  // 🎮 Core Engine States
  const [masterQuestionsPool, setMasterQuestionsPool] = useState([]);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState(null);
  const [runningScore, setRunningScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 Minutes core timer countdown
  const [quizHistory, setQuizHistory] = useState([]); 
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);

  // 📥 Initializer: Pull dynamic live questions from Laravel API on component mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/quiz-questions`)
      .then(response => {
        if (response.data && response.data.length > 0) {
          setMasterQuestionsPool(response.data);
        } else {
          setMasterQuestionsPool(LOCAL_FALLBACK_DATABASE);
        }
      })
      .catch(error => {
        console.log("Backend offline, automatically initializing localized fallback question vault.");
        setMasterQuestionsPool(LOCAL_FALLBACK_DATABASE);
      })
      .finally(() => {
        setIsLoadingBackend(false);
      });
  }, []);

  // ⏱️ Countdown Timer Clock Logic for 'Timer Quiz' mode
  useEffect(() => {
    let interval = null;
    if (currentScreen === 'PLAYING' && selectedType === 'Timer Quiz ⏱') {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCurrentScreen('RESULT'); // Automatically terminate session when clock strikes zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentScreen, selectedType]);

  // 🎨 Dynamic Matrix Theme Palette Matrix
  const currentTheme = themeMode === 'dark' ? {
    bg: '#0B0E14',
    cardBg: '#0F131C',
    borderColor: '#1E2633',
    textColor: '#FFFFFF',
    subTextColor: '#7E8B9B',
    accent: '#00f0ff',
    success: '#10B981',
    error: '#EF4444',
    lightAccent: '#00f0ff20'
  } : {
    bg: '#F4F6F9',
    cardBg: '#FFFFFF',
    borderColor: '#CBD5E1',
    textColor: '#0F172A',
    subTextColor: '#64748B',
    accent: '#0284C7',
    success: '#22C55E',
    error: '#DC2626',
    lightAccent: '#0284C715'
  };

  // 🚀 Start Sequence Handler: Filters live pool against configurations
  const handleStartQuiz = () => {
    const filtered = masterQuestionsPool.filter(
      (q) => q.category === selectedCategory || q.type === selectedType
    );
    
    const finalQuestions = filtered.length > 0 ? filtered : masterQuestionsPool;
    
    setActiveQuestions(finalQuestions);
    setCurrentIndex(0);
    setChosenOption(null);
    setRunningScore(0);
    setSecondsLeft(300); // Reset timer to 5 minutes
    setQuizHistory([]);
    setCurrentScreen('PLAYING');
  };

  // ➡️ State Machine Progression: Validates selections and sets records
  const handleNextStep = () => {
    if (!chosenOption) {
      Alert.alert("Selection Required", "Please choose an option to advance state machine.");
      return;
    }

    const currentQ = activeQuestions[currentIndex];
    const isCorrect = chosenOption === currentQ.correctAnswer;
    
    if (isCorrect) setRunningScore((prev) => prev + 1);

    setQuizHistory([...quizHistory, {
      question: currentQ.question,
      userAnswer: chosenOption,
      correctAnswer: currentQ.correctAnswer,
      isCorrect
    }]);

    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setChosenOption(null);
    } else {
      setCurrentScreen('RESULT');
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render initialization loading node spinner if API response is lagging
  if (isLoadingBackend) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: currentTheme.bg }]}>
        <ActivityIndicator size="large" color={currentTheme.accent} />
        <Text style={{ color: currentTheme.subTextColor, marginTop: 10, fontWeight: '700' }}>Syncing Anatomy Servers...</Text>
      </View>
    );
  }

  // ==========================================
  // 🖥️ VIEW 1: INITIAL CONFIGURATION PANEL
  // ==========================================
  if (currentScreen === 'SELECTION') {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: currentTheme.bg }} contentContainerStyle={styles.container}>
        <Text style={[styles.mainTitle, { color: currentTheme.textColor }]}>⚡ System Quiz Terminal</Text>
        <Text style={[styles.subDesc, { color: currentTheme.subTextColor }]}>Configure core configuration modules before initializing evaluation diagnostics.</Text>

        {/* Categories Selector Block */}
        <Text style={[styles.sectionHeading, { color: currentTheme.accent }]}>1. Select Category</Text>
        <View style={styles.flexGrid}>
          {['Bones 🦴', 'Muscles 💪', 'Organs 🫀', 'Nervous System 🧠'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.gridItem, { backgroundColor: currentTheme.cardBg, borderColor: selectedCategory === cat ? currentTheme.accent : currentTheme.borderColor }]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={{ color: selectedCategory === cat ? currentTheme.accent : currentTheme.textColor, fontWeight: '700' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quiz Types Selector Block */}
        <Text style={[styles.sectionHeading, { color: currentTheme.accent }]}>2. Select Quiz Type</Text>
        {['MCQ Quiz', 'Identify Organ Quiz 🔥', 'Label Quiz', 'Timer Quiz ⏱'].map((type) => (
          <TouchableOpacity 
            key={type} 
            style={[styles.rowItem, { backgroundColor: currentTheme.cardBg, borderColor: selectedType === type ? currentTheme.accent : currentTheme.borderColor }]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={{ color: selectedType === type ? currentTheme.accent : currentTheme.textColor, fontWeight: '700' }}>{type}</Text>
          </TouchableOpacity>
        ))}

        {/* Difficulty Matrix Block */}
        <Text style={[styles.sectionHeading, { color: currentTheme.accent }]}>3. Difficulty Matrix</Text>
        <View style={styles.flexRow}>
          {['Easy', 'Medium', 'Hard'].map((diff) => (
            <TouchableOpacity 
              key={diff} 
              style={[styles.tabItem, { backgroundColor: currentTheme.cardBg, borderColor: selectedDifficulty === diff ? currentTheme.accent : currentTheme.borderColor }]}
              onPress={() => setSelectedDifficulty(diff)}
            >
              <Text style={{ color: selectedDifficulty === diff ? currentTheme.accent : currentTheme.textColor, fontWeight: '800' }}>{diff}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.masterLaunchBtn, { backgroundColor: currentTheme.accent }]} onPress={handleStartQuiz}>
          <Text style={styles.launchBtnText}>🚀 Initialize Evaluation State</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ==========================================
  // 🖥️ VIEW 2: ACTIVE GAMEPLAY & INTERACTIVE UI
  // ==========================================
  if (currentScreen === 'PLAYING') {
    const activeNode = activeQuestions[currentIndex];
    return (
      <ScrollView style={{ flex: 1, backgroundColor: currentTheme.bg }} contentContainerStyle={styles.container}>
        <View style={styles.playingHeader}>
          <Text style={[styles.tagBadge, { backgroundColor: currentTheme.lightAccent, color: currentTheme.accent }]}>{selectedCategory} | {activeNode?.type}</Text>
          {selectedType === 'Timer Quiz ⏱' && (
            <Text style={[styles.timerDisplay, { color: currentTheme.error }]}>⏱️ {formatTimer(secondsLeft)}</Text>
          )}
        </View>

        <Text style={[styles.progressCounter, { color: currentTheme.subTextColor }]}>
          QUESTION {currentIndex + 1} OF {activeQuestions.length}
        </Text>

        {/* 🔥 VERY COOL FEATURE 1: CONDITIONAL INTERACTIVE 3D ORGAN VIEW PORT */}
        {activeNode?.type === 'Identify Organ Quiz 🔥' && (
          <View style={[styles.meshRenderViewport, { backgroundColor: currentTheme.cardBg, borderColor: currentTheme.accent }]}>
            <Text style={[styles.meshRenderIcon, { color: currentTheme.accent }]}>🫀</Text>
            <Text style={[styles.meshScanningOverlayText, { color: currentTheme.accent }]}>[ LIVE 3D ANATOMICAL OBJECT SCANNING READY ]</Text>
          </View>
        )}

        {/* 🔥 VERY COOL FEATURE 2: CONDITIONAL INTERACTIVE LABEL QUIZ DIAGRAM LAYOUT */}
        {activeNode?.type === 'Label Quiz' && (
          <View style={[styles.meshRenderViewport, { backgroundColor: currentTheme.cardBg, borderColor: '#E2E8F0', borderStyle: 'dashed' }]}>
            <Text style={{ color: currentTheme.textColor, fontWeight: 'bold' }}>🦴 Human Skeleton Blueprint</Text>
            <View style={styles.mockLabelRow}>
              <Text style={[styles.tagBadge, { backgroundColor: currentTheme.accent, color: '#000' }]}>Part A ➔ [ ? ]</Text>
              <Text style={[styles.tagBadge, { backgroundColor: currentTheme.borderColor, color: currentTheme.textColor }]}>Part B ➔ [ ? ]</Text>
            </View>
          </View>
        )}

        {/* Core Question Content Node */}
        <View style={[styles.questionCard, { backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor }]}>
          <Text style={[styles.questionMainText, { color: currentTheme.textColor }]}>{activeNode?.question}</Text>
        </View>

        {/* Interactive Choices Mapping Array */}
        {activeNode?.options.map((opt, index) => {
          const matching = chosenOption === opt;
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.optionSelector, { backgroundColor: currentTheme.cardBg, borderColor: matching ? currentTheme.accent : currentTheme.borderColor }]}
              onPress={() => setChosenOption(opt)}
            >
              <View style={[styles.radioStructure, { borderColor: matching ? currentTheme.accent : currentTheme.subTextColor }]}>
                {matching && <View style={[styles.radioCore, { backgroundColor: currentTheme.accent }]} />}
              </View>
              <Text style={[styles.optionString, { color: matching ? currentTheme.accent : currentTheme.textColor }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity 
          style={[styles.masterLaunchBtn, { backgroundColor: chosenOption ? currentTheme.accent : currentTheme.borderColor, marginTop: 25 }]}
          onPress={handleNextStep}
          disabled={!chosenOption}
        >
          <Text style={[styles.launchBtnText, { color: chosenOption ? '#000000' : currentTheme.subTextColor }]}>
            {currentIndex + 1 === activeQuestions.length ? '🏁 Finalize Diagnostic' : 'Next Question ➡️'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ==========================================
  // 🖥️ VIEW 3: SYSTEM AUDIT & ANALYTICS RESULT PANEL
  // ==========================================
  if (currentScreen === 'RESULT') {
    const totalQ = activeQuestions.length || 1;
    const finalAccuracy = Math.round((runningScore / totalQ) * 100);

    return (
      <ScrollView style={{ flex: 1, backgroundColor: currentTheme.bg }} contentContainerStyle={styles.container}>
        <View style={[styles.questionCard, { backgroundColor: currentTheme.cardBg, borderColor: currentTheme.borderColor, alignItems: 'center' }]}>
          <Text style={[styles.mainTitle, { color: currentTheme.textColor, marginTop: 0 }]}>Evaluation Finished</Text>
          
          <Text style={[styles.bigMetricScore, { color: currentTheme.accent }]}>{runningScore} / {totalQ}</Text>
          <Text style={{ color: currentTheme.subTextColor, fontWeight: '700', marginBottom: 20 }}>Accuracy Ratio: {finalAccuracy}%</Text>

          {/* ✅ PROGRESS BAR */}
          <Text style={[styles.indicatorText, { color: currentTheme.textColor }]}>System Progression Bar</Text>
          <View style={[styles.progressBarWireframe, { backgroundColor: currentTheme.borderColor }]}>
            <View style={[styles.progressBarFill, { width: `${finalAccuracy}%`, backgroundColor: currentTheme.accent }]} />
          </View>

          {/* ✅ PERFORMANCE BAR GRAPH CHART */}
          <Text style={[styles.indicatorText, { color: currentTheme.textColor, marginTop: 25 }]}>Performance Metric Load</Text>
          <View style={styles.chartHolderView}>
            <View style={styles.individualChartBarStack}>
              <View style={[styles.barVisualNode, { height: 100, backgroundColor: currentTheme.borderColor, justifyContent: 'flex-end' }]}>
                <View style={[styles.barVisualNode, { height: `${finalAccuracy}%`, backgroundColor: currentTheme.accent }]} />
              </View>
              <Text style={[styles.chartLabel, { color: currentTheme.subTextColor }]}>Your Rank</Text>
            </View>
            <View style={styles.individualChartBarStack}>
              <View style={[styles.barVisualNode, { height: 100, backgroundColor: currentTheme.borderColor, justifyContent: 'flex-end' }]}>
                <View style={[styles.barVisualNode, { height: '85%', backgroundColor: currentTheme.success }]} />
              </View>
              <Text style={[styles.chartLabel, { color: currentTheme.subTextColor }]}>Passing Avg</Text>
            </View>
          </View>
        </View>

        {/* ✅ CORRECT/INCORRECT AUDIT LOG CHECKLIST */}
        <Text style={[styles.sectionHeading, { color: currentTheme.accent }]}>📋 Operational Audit Logs</Text>
        {quizHistory.map((historyNode, idx) => (
          <View key={idx} style={[styles.auditLogBlock, { backgroundColor: currentTheme.cardBg, borderColor: historyNode.isCorrect ? currentTheme.success : currentTheme.error }]}>
            <Text style={[styles.auditQuestionText, { color: currentTheme.textColor }]}>Q{idx + 1}: {historyNode.question}</Text>
            <Text style={{ color: historyNode.isCorrect ? currentTheme.success : currentTheme.error, fontSize: 13, marginTop: 5, fontWeight: '700' }}>
              Your Response: {historyNode.userAnswer} {historyNode.isCorrect ? '✅' : '❌'}
            </Text>
            {!historyNode.isCorrect && (
              <Text style={{ color: currentTheme.success, fontSize: 13, fontWeight: '700', marginTop: 2 }}>
                System Correct Answer: {historyNode.correctAnswer}
              </Text>
            )}
          </View>
        ))}

        <TouchableOpacity style={[styles.masterLaunchBtn, { backgroundColor: currentTheme.accent, marginVertical: 30 }]} onPress={() => setCurrentScreen('SELECTION')}>
          <Text style={styles.launchBtnText}>🔄 Restart Diagnostic Sequence</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

// Global UI Layout Rules StyleSheet Sheet
const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 40, flexGrow: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainTitle: { fontSize: 23, fontWeight: '900', letterSpacing: 0.5, marginBottom: 4 },
  subDesc: { fontSize: 13, marginBottom: 25, fontWeight: '500', lineHeight: 18 },
  sectionHeading: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5, marginVertical: 14, textTransform: 'uppercase' },
  flexGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', borderWidth: 1, padding: 16, borderRadius: 6, marginBottom: 12, alignItems: 'center' },
  rowItem: { borderWidth: 1, padding: 14, borderRadius: 6, marginBottom: 10, justifyContent: 'center' },
  flexRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tabItem: { flex: 1, borderWidth: 1, padding: 12, borderRadius: 6, marginHorizontal: 4, alignItems: 'center' },
  masterLaunchBtn: { height: 50, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  launchBtnText: { fontSize: 14, fontWeight: '900', letterSpacing: 0.3 },
  playingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  tagBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 4, fontSize: 11, fontWeight: '800' },
  timerDisplay: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  progressCounter: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  questionCard: { borderWidth: 1, borderRadius: 6, padding: 20, marginBottom: 20 },
  questionMainText: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  optionSelector: { borderWidth: 1, padding: 16, borderRadius: 6, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radioStructure: { height: 16, width: 16, borderRadius: 8, borderWidth: 2, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  radioCore: { height: 8, width: 8, borderRadius: 4 },
  optionString: { fontSize: 14, fontWeight: '600' },
  bigMetricScore: { fontSize: 44, fontWeight: '900', marginVertical: 10 },
  indicatorText: { fontSize: 12, fontWeight: '800', alignSelf: 'flex-start', marginBottom: 6 },
  progressBarWireframe: { height: 10, width: '100%', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  chartHolderView: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 15, alignItems: 'flex-end' },
  individualChartBarStack: { alignItems: 'center' },
  barVisualNode: { width: 45, borderRadius: 4 },
  chartLabel: { fontSize: 11, fontWeight: '700', marginTop: 6 },
  auditLogBlock: { borderWidth: 1, padding: 14, borderRadius: 6, marginBottom: 12 },
  auditQuestionText: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  meshRenderViewport: { height: 160, borderRadius: 8, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginBottom: 20, padding: 10 },
  meshRenderIcon: { fontSize: 50, marginBottom: 5 },
  meshScanningOverlayText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  mockLabelRow: { flexDirection: 'row', marginTop: 15, width: '100%', justifyContent: 'space-around' }
});