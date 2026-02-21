import React, { useEffect, useRef } from 'react';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../pathways/typing';

const BG = require('../gallery/launch_bg.png');
const BIRD = require('../gallery/onb_bird.png');

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LaunchGateScreen() {
  const navigation = useNavigation<Nav>();
  const { width, height } = useWindowDimensions();

  const isSmall = height <= 700 || width <= 360;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const appear = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    appear.start();

    const timer = setTimeout(() => {

      navigation.reset({
        index: 0,
        routes: [{ name: 'FirstSteps' }],
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
      appear.stop();
    };
  }, [navigation, opacity, scale, translateY]);

  const birdSize = isSmall
    ? Math.min(width * 0.50, 220)
    : Math.min(width * 0.60, 320);

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <View style={styles.centerWrap}>
          <Animated.View
            style={[
              styles.birdWrap,
              {
                width: birdSize,
                height: birdSize,
                opacity,
                transform: [{ translateY }, { scale }],
              },
            ]}
          >
            <Image
              source={BIRD}
              style={styles.bird}
              resizeMode="contain"
              fadeDuration={Platform.OS === 'android' ? 0 : undefined}
            />
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  bg: {
    flex: 1,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  birdWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bird: {
    width: '100%',
    height: '100%',
  },
});