import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; 

type BirdId = 'duck' | 'pelican' | 'heron' | 'hummingbird' | 'owl' | 'falcon' | 'woodpecker' | 'eagle';
const BIRD_IDS: BirdId[] = ['duck', 'pelican', 'heron', 'hummingbird', 'owl', 'falcon', 'woodpecker', 'eagle'];

const BIRD_DIRECTIONS: Record<BirdId, 1 | -1> = {
  owl: 1, heron: 1, duck: 1, pelican: 1, woodpecker: 1,
  hummingbird: -1, falcon: -1, eagle: -1,
};

type FlyingBird = {
  key: string;
  id: BirdId;
  x: Animated.Value;
  y: Animated.Value;
  size: number;
  animX: Animated.CompositeAnimation;
};

const BG = require('../gallery/launch_bg.png');
const GUIDE = require('../gallery/onb_guide_2.png');
const BIRD_IMGS: Record<BirdId, any> = {
  duck: require('../gallery/game_duck.png'),
  pelican: require('../gallery/game_pelican.png'),
  heron: require('../gallery/game_heron.png'),
  hummingbird: require('../gallery/game_hummingbird.png'),
  owl: require('../gallery/game_owl.png'),
  falcon: require('../gallery/game_falcon.png'),
  woodpecker: require('../gallery/game_woodpecker.png'),
  eagle: require('../gallery/game_eagle.png'),
};

export default function MiniGameScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [phase, setPhase] = useState<'intro' | 'play' | 'pause' | 'win' | 'lose'>('intro');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [targetId, setTargetId] = useState<BirdId>('owl');
  const [flying, setFlying] = useState<FlyingBird[]>([]);

  const phaseRef = useRef(phase);
  const flyingRef = useRef<FlyingBird[]>([]);
  const timerRef = useRef<any>(null);
  const spawnCounter = useRef(0);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const fullCleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    flyingRef.current.forEach(b => b.animX.stop());
    flyingRef.current = [];
    setFlying([]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setPhase('intro');
      setScore(0);
      setLives(3);
      setSecondsLeft(180);

      return () => {
        fullCleanup();
      };
    }, [fullCleanup])
  );

  const removeBird = useCallback((key: string) => {
    flyingRef.current = flyingRef.current.filter(b => b.key !== key);
    setFlying([...flyingRef.current]);
    if (phaseRef.current === 'play' && flyingRef.current.length < 4) {
      spawnBird();
    }
  }, []);

  const spawnBird = useCallback(() => {
    if (phaseRef.current !== 'play') return;
    if (flyingRef.current.length >= 6) return;

    const id = BIRD_IDS[Math.floor(Math.random() * BIRD_IDS.length)];
    const dir = BIRD_DIRECTIONS[id];
    const size = height <= 680 ? 60 : 75;

    const startX = dir === 1 ? -size - 50 : width + 50;
    const endX = dir === 1 ? width + 100 : -size - 100;
    
    const minY = insets.top + 100;
    const maxY = height - insets.bottom - 150;
    const startY = minY + Math.random() * (maxY - minY);

    const xVal = new Animated.Value(startX);
    const yVal = new Animated.Value(startY);
    const key = `bird_${Date.now()}_${spawnCounter.current++}`;

    const animX = Animated.timing(xVal, {
      toValue: endX,
      duration: 3000 + Math.random() * 2500,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const bird: FlyingBird = { key, id, x: xVal, y: yVal, size, animX };
    flyingRef.current = [...flyingRef.current, bird];
    setFlying([...flyingRef.current]);

    animX.start(({ finished }) => {
      if (finished) removeBird(key);
    });
  }, [width, height, insets, removeBird]);

  const handlePressBird = (bird: FlyingBird) => {
    if (phaseRef.current !== 'play') return;
    if (Platform.OS === 'android') Vibration.vibrate(35);

    if (bird.id === targetId) {
      setScore(s => s + 1);
    } else {
      setLives(l => {
        const next = l - 1;
        if (next <= 0) {
          setPhase('lose');
          fullCleanup();
          return 0;
        }
        return next;
      });
    }
    bird.animX.stop();
    removeBird(bird.key);
  };

  const startGame = useCallback(() => {
    fullCleanup();
    setScore(0);
    setLives(3);
    setSecondsLeft(180);
    setTargetId(BIRD_IDS[Math.floor(Math.random() * BIRD_IDS.length)]);
    setPhase('play');

    for (let i = 0; i < 4; i++) {
      setTimeout(spawnBird, i * 600);
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          setPhase('win');
          fullCleanup();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [fullCleanup, spawnBird]);

  const mmss = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={st.container}>
      <Image source={BG} style={StyleSheet.absoluteFill} />

      {phase === 'play' && (
        <>
          <View style={[st.header, { paddingTop: insets.top + 10 }]}>
            <Pressable onPress={() => { setPhase('pause'); if(timerRef.current) clearInterval(timerRef.current); }} style={st.pauseBtn}>
              <Text style={st.pauseIcon}>||</Text>
            </Pressable>
            <Text style={st.lives}>{'❤'.repeat(lives)}</Text>
            <View style={st.timerBadge}><Text style={st.timerTxt}>{mmss(secondsLeft)}</Text></View>
          </View>

          <View style={st.targetRow}>
            <View style={st.targetBadge}>
              <Image source={BIRD_IMGS[targetId]} style={st.img} />
            </View>
            <View>
              <Text style={st.targetHint}>TARGET BIRD:</Text>
              <Text style={st.targetName}>{targetId.toUpperCase()}</Text>
            </View>
          </View>

          {flying.map(b => (
            <Animated.View
              key={b.key}
              style={[
                st.birdWrap,
                {
                  width: b.size,
                  height: b.size,
                  transform: [{ translateX: b.x }, { translateY: b.y }],
                },
              ]}
            >
              <Pressable onPress={() => handlePressBird(b)} style={st.img}>
                <Image source={BIRD_IMGS[b.id]} style={st.img} />
              </Pressable>
            </Animated.View>
          ))}

          <Text style={[st.score, { bottom: insets.bottom + 30 }]}>SCORE: {score}</Text>
        </>
      )}

      {phase !== 'play' && (
        <View style={st.overlay}>
          <View style={st.card}>
            {phase === 'intro' && <Image source={GUIDE} style={st.guideImg} />}
            <Text style={st.title}>
              {phase === 'intro' ? 'PHOTO HUNT' : phase === 'pause' ? 'PAUSED' : phase === 'win' ? 'WINNER!' : 'GAME OVER'}
            </Text>
            
            {phase !== 'intro' && <Text style={st.resScore}>Score: {score}</Text>}

            <Pressable style={st.btn} onPress={startGame}>
              <Text style={st.btnTxt}>{phase === 'intro' ? 'START HUNT' : 'TRY AGAIN'}</Text>
            </Pressable>

            {phase === 'pause' && (
              <Pressable style={st.btnGhost} onPress={() => setPhase('intro')}>
                <Text style={st.btnGhostTxt}>BACK TO MENU</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', zIndex: 100 },
  pauseBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  pauseIcon: { color: '#fff', fontWeight: 'bold' },
  lives: { color: '#FF4444', fontSize: 22, fontWeight: 'bold' },
  timerBadge: { backgroundColor: '#FF8A00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
  timerTxt: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  targetRow: { position: 'absolute', top: 120, left: 20, flexDirection: 'row', alignItems: 'center', zIndex: 50 },
  targetBadge: { width: 60, height: 60, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 15, padding: 8, borderWidth: 2, borderColor: '#fff' },
  targetHint: { color: 'rgba(255,255,255,0.7)', marginLeft: 12, fontWeight: 'bold', fontSize: 10 },
  targetName: { color: '#FF8A00', marginLeft: 12, fontWeight: '900', fontSize: 16 },
  birdWrap: { position: 'absolute', zIndex: 10 },
  img: { width: '100%', height: '100%', resizeMode: 'contain' },
  score: { position: 'absolute', right: 20, color: '#fff', fontSize: 22, fontWeight: '900', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 12 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.24)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  card: { width: '85%', maxWidth: 350, backgroundColor: '#0A235F', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  guideImg: { width: 180, height: 120, resizeMode: 'contain', marginBottom: 10 },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', marginVertical: 20, textAlign: 'center' },
  resScore: { color: '#FF8A00', fontSize: 24, fontWeight: 'bold', marginBottom: 25 },
  btn: { backgroundColor: '#FF8A00', width: '100%', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  btnTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  btnGhost: { marginTop: 15, width: '100%', height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  btnGhostTxt: { color: '#fff', fontWeight: 'bold' },
});