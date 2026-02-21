import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../pathways/typing';

type Props = NativeStackScreenProps<RootStackParamList, 'FirstSteps'>;

const BG = require('../gallery/launch_bg.png');
const HERO_BIRD = require('../gallery/onb_bird.png');
const HERO_GUIDE_1 = require('../gallery/onb_guide_1.png');
const HERO_GUIDE_2 = require('../gallery/onb_guide_2.png');

type Step = {
  key: string;
  hero: any;
  title: string;
  body: string;
  cta: string;
  showSkip: boolean;
  heroKind: 'bird' | 'guide';
};

export default function FirstStepsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isSmall = height <= 700;

  const steps: Step[] = useMemo(
    () => [
      {
        key: 'birds',
        hero: HERO_BIRD,
        heroKind: 'bird',
        title: 'Explore Birds,\nAnytime',
        body:
          'Browse a growing bird library with clear species cards, key traits, and quick facts.\nOpen any profile to learn how to recognize birds by shape, habitat, and behavior.',
        cta: 'Continue',
        showSkip: true,
      },
      {
        key: 'journal',
        hero: HERO_GUIDE_1,
        heroKind: 'guide',
        title: 'Log Your Sightings',
        body:
          'Save your own encounters in a personal journal.\nAdd photos, notes, and an optional map pin so every moment stays organized — from quick park visits to big trips.',
        cta: 'Continue',
        showSkip: true,
      },
      {
        key: 'play',
        hero: HERO_GUIDE_2,
        heroKind: 'guide',
        title: 'Learn Through Play',
        body:
          'Test your knowledge with fresh quizzes and discover new details with every question.\nThen jump into Photo Hunt and capture the right birds before your shot runs out.',
        cta: 'Explore',
        showSkip: false,
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  const pageOpacity = useRef(new Animated.Value(1)).current;
  const pageShift = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(1)).current;
  const heroScale = useRef(new Animated.Value(1)).current;

  const bottomPad = insets.bottom + 50;

  const cardWidth = Math.min(width - 36, 420);
  const cardRadius = 26;

  const step = steps[index];
  const BASE_SHIFT_X = 30;
  const heroDims = useMemo(() => {
    if (step.heroKind === 'guide') {
      const h = Math.round(height * (isSmall ? 0.48 : 0.52));
      const w = Math.round(Math.min(width * 0.72, h * 0.72));
      return {
        w: Math.max(240, Math.min(w, 420)),
        h: Math.max(320, Math.min(h, 520)),
      };
    }
    const s = Math.round(Math.min(width, height) * (isSmall ? 0.46 : 0.52));
    const size = Math.max(240, Math.min(s, 460));
    return { w: size, h: size };
  }, [width, height, isSmall, step.heroKind]);
  const birdExtraShift = useMemo(() => {
    if (step.heroKind !== 'bird') return 0;
    return isSmall ? -Math.round(width * 0.10) : -Math.round(width * 0.08);
  }, [step.heroKind, width, isSmall]);

  const heroShiftX = BASE_SHIFT_X + birdExtraShift;

  const heroTopPad = insets.top + (isSmall ? 8 : 14);

  const runSwapAnimation = (dir: 1 | -1, nextIndex: number) => {
    Animated.parallel([
      Animated.timing(pageOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(pageShift, {
        toValue: -dir * 14,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(heroOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(heroScale, {
        toValue: 0.965,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex(nextIndex);

      pageShift.setValue(dir * 16);

      Animated.parallel([
        Animated.timing(pageOpacity, {
          toValue: 1,
          duration: 230,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pageShift, {
          toValue: 0,
          duration: 230,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(heroScale, {
          toValue: 1,
          damping: 14,
          stiffness: 170,
          mass: 0.7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const goNext = () => {
    if (index >= steps.length - 1) {
      navigation.replace('Dock');
      return;
    }
    runSwapAnimation(1, index + 1);
  };

  const goSkip = () => navigation.replace('Dock');

  return (
    <View style={s.root}>
      <ImageBackground source={BG} resizeMode="cover" style={s.bg}>
        <View style={s.overlay} />

        <View style={[s.heroArea, { paddingTop: heroTopPad }]}>
          <Animated.View
            style={[
              s.heroWrap,
              {
                opacity: heroOpacity,
                transform: [{ translateX: heroShiftX }, { scale: heroScale }],
              },
            ]}
          >
            <Image
              source={step.hero}
              style={{ width: heroDims.w, height: heroDims.h }}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <View style={[s.cardZone, { paddingBottom: bottomPad }]}>
          <Animated.View
            style={[
              s.card,
              {
                width: cardWidth,
                borderRadius: cardRadius,
                opacity: pageOpacity,
                transform: [{ translateY: pageShift }],
              },
            ]}
          >
            <Text style={[s.title, isSmall && { fontSize: 20, lineHeight: 24 }]}>{step.title}</Text>
            <Text style={[s.body, isSmall && { fontSize: 11, lineHeight: 15 }]}>{step.body}</Text>

            <View style={s.dotsRow}>
              {steps.map((st, i) => {
                const active = i === index;
                return (
                  <View
                    key={st.key}
                    style={[s.dot, active ? s.dotActive : s.dotIdle, active && { width: 18 }]}
                  />
                );
              })}
            </View>

            <View style={s.actionsRow}>
              <Pressable
                onPress={goSkip}
                disabled={!step.showSkip}
                style={({ pressed }) => [
                  s.skipBtn,
                  !step.showSkip && { opacity: 0 },
                  pressed && step.showSkip && { opacity: 0.7 },
                ]}
              >
                <Text style={s.skipText}>Skip</Text>
              </Pressable>

              <Pressable
                onPress={goNext}
                style={({ pressed }) => [s.ctaBtn, pressed && { transform: [{ scale: 0.98 }] }]}
              >
                <Text style={s.ctaText}>{step.cta}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#071021',
    opacity: 0.16,
  },

  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  heroWrap: { alignItems: 'center', justifyContent: 'center' },

  cardZone: { alignItems: 'center', justifyContent: 'flex-end' },
  card: {
    backgroundColor: '#0A2B86',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    marginHorizontal: 18,
  },

  title: { color: '#FFF', fontSize: 22, lineHeight: 26, fontWeight: '900', textAlign: 'center' },
  body: { marginTop: 10, color: 'rgba(255,255,255,0.88)', fontSize: 12, lineHeight: 16, textAlign: 'center' },

  dotsRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'center', gap: 7 },
  dot: { height: 6, borderRadius: 99 },
  dotIdle: { width: 6, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: '#FF8A00' },

  actionsRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skipBtn: { paddingVertical: 10, paddingHorizontal: 10 },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700' },

  ctaBtn: {
    flex: 1,
    marginLeft: 10,
    height: 46,
    borderRadius: 999,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#FFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.6 },
});
