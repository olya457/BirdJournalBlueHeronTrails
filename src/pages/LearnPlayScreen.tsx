import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ScrollView,
  Share,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BIRD_READS, QUIZ_QUESTIONS } from '../data/learnPlayData';

const BG = require('../gallery/launch_bg.png');
const ONB_BIRD = require('../gallery/onb_bird.png');

type Tab = 'quiz' | 'reads';
type Screen = 'home' | 'readDetail' | 'quizQuestion' | 'quizDone';

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function formatTime(sec: number) {
  const s = Math.max(0, sec);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function LearnPlayScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isSmall = width < 380 || height < 700;
  const padX = isSmall ? 14 : 18;

  const [tab, setTab] = useState<Tab>('quiz');
  const [screen, setScreen] = useState<Screen>('home');
  const [activeReadId, setActiveReadId] = useState<string | null>(null);

  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const [paused, setPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(20);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeRead = useMemo(
    () => BIRD_READS.find((x) => x.id === activeReadId) || null,
    [activeReadId]
  );

  const appear = useRef(new Animated.Value(0)).current;

  const runAppear = useCallback(() => {
    appear.stopAnimation();
    appear.setValue(0);
    Animated.timing(appear, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [appear]);

  useEffect(() => {
    runAppear();
  }, [runAppear, screen, tab, activeReadId, qIndex]);

  const aOpacity = appear.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const aShift = appear.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (startFrom: number) => {
      stopTimer();
      setSecondsLeft(startFrom);
      timerRef.current = setInterval(() => {
        setSecondsLeft((v) => v - 1);
      }, 1000);
    },
    [stopTimer]
  );

  useFocusEffect(
    useCallback(() => {
      stopTimer();
      setTab('quiz');
      setScreen('home');
      setActiveReadId(null);
      setQIndex(0);
      setScore(0);
      setPicked(null);
      setPaused(false);
      setSecondsLeft(20);

      return () => {
        stopTimer();
      };
    }, [stopTimer])
  );

  const goNextQuestion = useCallback(
    (correct: boolean) => {
      const nextScore = correct ? score + 1 : score;
      const nextIndex = qIndex + 1;

      if (nextIndex >= QUIZ_QUESTIONS.length) {
        setScore(nextScore);
        setScreen('quizDone');
        stopTimer();
        return;
      }

      setScore(nextScore);
      setQIndex(nextIndex);
      setPicked(null);
      setPaused(false);
      startTimer(20);
    },
    [qIndex, score, startTimer, stopTimer]
  );

  useEffect(() => {
    if (screen !== 'quizQuestion') return;
    if (paused) return;

    if (secondsLeft <= 0) {
      stopTimer();
      goNextQuestion(false);
    }
  }, [secondsLeft, screen, paused, stopTimer, goNextQuestion]);

  const openRead = (id: string) => {
    setActiveReadId(id);
    setScreen('readDetail');
  };

  const shareRead = async () => {
    if (!activeRead) return;
    try {
      await Share.share({ message: `${activeRead.title}\n\n${activeRead.body}` });
    } catch {}
  };

  const startQuiz = () => {
    setScore(0);
    setQIndex(0);
    setPicked(null);
    setPaused(false);
    setSecondsLeft(20);
    setScreen('quizQuestion');
    startTimer(20);
  };

  const goHome = () => {
    stopTimer();
    setPaused(false);
    setPicked(null);
    setScreen('home');
  };

  const pickAnswer = (i: number) => {
    if (picked !== null || paused) return;
    setPicked(i);
    const q = QUIZ_QUESTIONS[qIndex];
    const correct = i === q.correctIndex;
    setTimeout(() => {
      goNextQuestion(correct);
    }, 520);
  };

  const Header = ({ canBack, onBack }: { canBack: boolean; onBack?: () => void }) => {
    return (
      <View style={{ paddingTop: insets.top + (isSmall ? 8 : 10) }}>
        <View style={[s.headerRow, { paddingHorizontal: padX }]}>
          <Pressable onPress={onBack} disabled={!canBack} style={[s.backBtn, !canBack && { opacity: 0 }]}>
            <Text style={s.backText}>‹</Text>
          </Pressable>
          <Text style={[s.headerTitle, { fontSize: isSmall ? 18 : 22 }]}>Learn &amp; Play</Text>
          <View style={{ width: isSmall ? 40 : 50 }} />
        </View>
      </View>
    );
  };

  const Segmented = () => {
    return (
      <View style={{ paddingHorizontal: padX, marginTop: isSmall ? 10 : 14 }}>
        <View style={[s.segment, { height: isSmall ? 40 : 46, padding: isSmall ? 4 : 6 }]}>
          <Pressable onPress={() => setTab('quiz')} style={[s.segmentBtn, tab === 'quiz' && s.segmentBtnOn]}>
            <Text style={[s.segmentText, tab === 'quiz' && s.segmentTextOn, { fontSize: isSmall ? 14 : 16 }]}>Quiz Trails</Text>
          </Pressable>
          <Pressable onPress={() => setTab('reads')} style={[s.segmentBtn, tab === 'reads' && s.segmentBtnOn]}>
            <Text style={[s.segmentText, tab === 'reads' && s.segmentTextOn, { fontSize: isSmall ? 14 : 16 }]}>Bird Reads</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const QuizHero = () => {
    const cardW = width - padX * 2;
    const imgBox = clamp(Math.round(cardW * (isSmall ? 0.45 : 0.5)), 140, 250);
    return (
      <Animated.View style={{ opacity: aOpacity, transform: [{ translateY: aShift }] }}>
        <View style={{ paddingHorizontal: padX, marginTop: isSmall ? 10 : 16 }}>
          <View style={[s.heroCard, { padding: isSmall ? 14 : 18 }]}>
            <Image source={ONB_BIRD} style={{ width: imgBox, height: imgBox }} resizeMode="contain" />
            <Text style={[s.heroTitle, { fontSize: isSmall ? 22 : 28, marginTop: isSmall ? 8 : 14 }]}>Quiz Trails</Text>
            <Text style={[s.heroSub, { fontSize: isSmall ? 13 : 15, lineHeight: isSmall ? 17 : 20 }]}>
              Step into a quick knowledge trail through birds. Short rounds, clear answers, calm pace.
            </Text>
            <Pressable onPress={startQuiz} style={({ pressed }) => [s.heroBtn, { height: isSmall ? 54 : 62 }, pressed && { opacity: 0.9 }]}>
              <Text style={[s.heroBtnText, { fontSize: isSmall ? 20 : 24 }]}>Start</Text>
            </Pressable>
            <Text style={[s.heroMeta, { fontSize: isSmall ? 11 : 13 }]}>{`${QUIZ_QUESTIONS.length} questions`}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const ReadsList = () => {
    return (
      <Animated.View style={{ flex: 1, opacity: aOpacity, transform: [{ translateY: aShift }] }}>
        <FlatList
          data={BIRD_READS}
          keyExtractor={(it) => it.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: padX,
            paddingTop: isSmall ? 10 : 16,
            paddingBottom: insets.bottom + (isSmall ? 98 : 102), 
          }}
          renderItem={({ item }) => (
            <Pressable onPress={() => openRead(item.id)} style={({ pressed }) => [s.readCard, pressed && { opacity: 0.92 }]}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[s.readTitle, { fontSize: isSmall ? 14 : 16 }]}>{item.title}</Text>
                <Text style={[s.readSub, { fontSize: isSmall ? 12 : 13 }]}>{item.subtitle}</Text>
              </View>
              <View style={[s.starBtn, isSmall && { width: 30, height: 30, borderRadius: 15 }]}>
                <Text style={[s.starText, isSmall && { fontSize: 14 }]}>★</Text>
              </View>
            </Pressable>
          )}
        />
      </Animated.View>
    );
  };

  const ReadDetail = () => {
    if (!activeRead) return null;
    return (
      <Animated.View style={{ flex: 1, opacity: aOpacity, transform: [{ translateY: aShift }] }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: padX,
            paddingTop: isSmall ? 10 : 16,
            paddingBottom: insets.bottom + (isSmall ? 98 : 102),
          }}
        >
          <View style={[s.detailCard, { padding: isSmall ? 14 : 18 }]}>
            <Text style={[s.detailTitle, { fontSize: isSmall ? 18 : 22 }]}>{activeRead.title}</Text>
            <Text style={[s.detailBody, { fontSize: isSmall ? 13 : 15, lineHeight: isSmall ? 18 : 21 }]}>{activeRead.body}</Text>
            <Pressable onPress={shareRead} style={({ pressed }) => [s.shareBtn, { height: isSmall ? 48 : 54 }, pressed && { opacity: 0.9 }]}>
              <Text style={[s.shareText, { fontSize: isSmall ? 15 : 17 }]}>Share</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  const QuizQuestion = () => {
    const q = QUIZ_QUESTIONS[qIndex];
    return (
      <Animated.View style={{ flex: 1, opacity: aOpacity, transform: [{ translateY: aShift }] }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: padX,
            paddingBottom: insets.bottom + (isSmall ? 94 : 100),
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          <View style={[s.quizInfoRow, { marginBottom: isSmall ? 10 : 16 }]}>
            <Pressable
              onPress={() => {
                if (paused) { startTimer(secondsLeft); setPaused(false); }
                else { stopTimer(); setPaused(true); }
              }}
              style={[s.pauseBtn, isSmall && { width: 40, height: 40 }]}
            >
              <Text style={[s.pauseText, isSmall && { fontSize: 16 }]}>Ⅱ</Text>
            </Pressable>
            <Text style={[s.quizInfoText, { fontSize: isSmall ? 16 : 19 }]}>{`${qIndex + 1} / ${QUIZ_QUESTIONS.length}`}</Text>
            <View style={[s.timerPill, isSmall && { height: 40, paddingHorizontal: 12 }]}>
              <Text style={[s.timerText, { fontSize: isSmall ? 14 : 17 }]}>{formatTime(secondsLeft)}</Text>
            </View>
          </View>
          <View style={[s.questionCard, isSmall && { padding: 12 }]}>
            <Text style={[s.questionText, { fontSize: isSmall ? 16 : 19 }]}>{q.question}</Text>
          </View>
          <View style={{ height: isSmall ? 10 : 16 }} />
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            let bg = 'rgba(8,20,60,0.45)';
            if (picked !== null) {
              if (i === q.correctIndex) bg = 'rgba(30,160,60,0.85)';
              else if (i === picked) bg = 'rgba(160,25,25,0.88)';
            }
            return (
              <Pressable key={i} onPress={() => pickAnswer(i)} style={[s.optionRow, { backgroundColor: bg, paddingVertical: isSmall ? 10 : 14 }]}>
                <View style={[s.letterCircle, isSmall && { width: 34, height: 34 }]}>
                  <Text style={[s.letterText, isSmall && { fontSize: 16 }]}>{letter}</Text>
                </View>
                <Text style={[s.optionText, { fontSize: isSmall ? 16 : 19 }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {paused && (
          <View style={s.pauseOverlay}>
            <View style={s.pauseCard}>
              <Text style={s.pauseTitle}>Quiz paused</Text>
              <Pressable onPress={() => { setPaused(false); startTimer(secondsLeft); }} style={s.pauseResumeBtn}>
                <Text style={s.pauseResumeText}>Resume</Text>
              </Pressable>
              <Pressable onPress={goHome} style={s.pauseExitBtn}>
                <Text style={s.pauseExitText}>End Quiz</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  const QuizDone = () => (
    <Animated.View style={{ flex: 1, opacity: aOpacity, transform: [{ translateY: aShift }] }}>
      <View style={[s.doneWrap, { paddingBottom: insets.bottom + 100 }]}>
        <View style={s.doneCard}>
          <Image source={ONB_BIRD} style={{ width: 160, height: 160 }} resizeMode="contain" />
          <Text style={s.doneTitle}>Quiz complete</Text>
          <Text style={s.doneMeta}>{`Score: [${score}] / ${QUIZ_QUESTIONS.length}`}</Text>
          <Pressable onPress={goHome} style={s.doneBtn}><Text style={s.doneBtnText}>Home</Text></Pressable>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={s.root}>
      <Image source={BG} style={s.bg} resizeMode="cover" />
      <View style={s.dark} />
      {screen === 'home' && (
        <><Header canBack={false} /><Segmented />{tab === 'quiz' ? <QuizHero /> : <ReadsList />}</>
      )}
      {screen === 'readDetail' && <><Header canBack onBack={() => setScreen('home')} /><ReadDetail /></>}
      {screen === 'quizQuestion' && <><Header canBack onBack={goHome} /><QuizQuestion /></>}
      {screen === 'quizDone' && <><Header canBack onBack={goHome} /><QuizDone /></>}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { ...StyleSheet.absoluteFillObject },
  dark: { ...StyleSheet.absoluteFillObject, backgroundColor: '#071021', opacity: 0.22 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(8,20,60,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  headerTitle: { flex: 1, color: '#fff', fontWeight: '900' },
  segment: { borderRadius: 999, backgroundColor: 'rgba(8,20,60,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', flexDirection: 'row', gap: 8 },
  segmentBtn: { flex: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  segmentBtnOn: { backgroundColor: '#FF8A00' },
  segmentText: { color: 'rgba(255,255,255,0.75)', fontWeight: '900' },
  segmentTextOn: { color: '#08143C' },
  heroCard: { borderRadius: 24, backgroundColor: 'rgba(10,35,95,0.58)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', alignItems: 'center' },
  heroTitle: { color: '#fff', fontWeight: '900' },
  heroSub: { marginTop: 10, color: 'rgba(255,255,255,0.72)', textAlign: 'center' },
  heroBtn: { marginTop: 16, alignSelf: 'stretch', borderRadius: 999, backgroundColor: '#FF8A00', alignItems: 'center', justifyContent: 'center' },
  heroBtnText: { color: '#08143C', fontWeight: '900' },
  heroMeta: { marginTop: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '800' },
  readCard: { marginBottom: 12, borderRadius: 18, backgroundColor: 'rgba(10,35,95,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', padding: 14, flexDirection: 'row', alignItems: 'center' },
  readTitle: { color: '#fff', fontWeight: '900' },
  readSub: { marginTop: 8, color: 'rgba(255,255,255,0.68)' },
  starBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FF8A00', alignItems: 'center', justifyContent: 'center' },
  starText: { color: '#08143C', fontWeight: '900' },
  detailCard: { borderRadius: 22, backgroundColor: 'rgba(10,35,95,0.58)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  detailTitle: { color: '#fff', fontWeight: '900' },
  detailBody: { marginTop: 12, color: 'rgba(255,255,255,0.86)' },
  shareBtn: { marginTop: 16, borderRadius: 999, backgroundColor: '#FF8A00', alignItems: 'center', justifyContent: 'center' },
  shareText: { color: '#08143C', fontWeight: '900' },
  quizInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pauseBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(8,20,60,0.45)', alignItems: 'center', justifyContent: 'center' },
  pauseText: { color: '#fff', fontWeight: '900' },
  quizInfoText: { flex: 1, color: '#fff', fontWeight: '900' },
  timerPill: { height: 48, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#FF8A00', alignItems: 'center', justifyContent: 'center' },
  timerText: { color: '#08143C', fontWeight: '900' },
  questionCard: { borderRadius: 18, backgroundColor: 'rgba(10,35,95,0.58)', padding: 16 },
  questionText: { color: '#fff', fontWeight: '900' },
  optionRow: { marginBottom: 12, borderRadius: 18, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  letterCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FF8A00', alignItems: 'center', justifyContent: 'center' },
  letterText: { color: '#08143C', fontWeight: '900' },
  optionText: { color: '#fff', fontWeight: '900', flex: 1 },
  pauseOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  pauseCard: { width: '85%', borderRadius: 22, backgroundColor: '#152C7F', padding: 20 },
  pauseTitle: { color: '#fff', fontWeight: '900', fontSize: 20, textAlign: 'center' },
  pauseResumeBtn: { marginTop: 20, height: 50, borderRadius: 25, backgroundColor: '#2ED06A', alignItems: 'center', justifyContent: 'center' },
  pauseResumeText: { color: '#000', fontWeight: '900' },
  pauseExitBtn: { marginTop: 12, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pauseExitText: { color: '#fff', fontWeight: '900' },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  doneCard: { width: '100%', borderRadius: 24, backgroundColor: 'rgba(10,35,95,0.58)', padding: 20, alignItems: 'center' },
  doneTitle: { color: '#fff', fontWeight: '900', fontSize: 22, marginTop: 15 },
  doneMeta: { color: '#FF8A00', fontWeight: '800', marginTop: 5 },
  doneBtn: { marginTop: 20, height: 55, alignSelf: 'stretch', borderRadius: 999, backgroundColor: '#FF8A00', alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { color: '#08143C', fontWeight: '900' },
});