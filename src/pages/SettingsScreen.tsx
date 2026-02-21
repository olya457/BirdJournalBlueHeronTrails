import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Switch, Share, Vibration, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG = require('../gallery/launch_bg.png');

const ICON_BELL = require('../gallery/ic_bell.png');
const ICON_SHARE = require('../gallery/ic_share.png');

const KEY_VIBRATION = '@prefs_vibration_enabled';
const KEY_NOTIFICATIONS = '@prefs_notifications_enabled';

function vibPulse() {
  if (Platform.OS === 'ios') Vibration.vibrate();
  else Vibration.vibrate([0, 20, 40, 20]);
}

export default function SettingsScreen() {
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const vib = await AsyncStorage.getItem(KEY_VIBRATION);
        if (vib !== null) setVibrationEnabled(vib === '1');

        const noti = await AsyncStorage.getItem(KEY_NOTIFICATIONS);
        if (noti !== null) setNotificationsEnabled(noti === '1');
      } catch {}
    })();
  }, []);

  const setVibration = useCallback(async (value: boolean) => {
    setVibrationEnabled(value);
    try {
      await AsyncStorage.setItem(KEY_VIBRATION, value ? '1' : '0');
    } catch {}
    if (value) vibPulse();
  }, []);

  const setNotifications = useCallback(
    async (value: boolean) => {
      setNotificationsEnabled(value);
      try {
        await AsyncStorage.setItem(KEY_NOTIFICATIONS, value ? '1' : '0');
      } catch {}
      if (vibrationEnabled) vibPulse();
    },
    [vibrationEnabled]
  );

  const onShareApp = useCallback(async () => {
    if (vibrationEnabled) vibPulse();
    try {
      await Share.share({ message: 'Bird Journal — try it!' });
    } catch {}
  }, [vibrationEnabled]);

  const onResetAllData = useCallback(() => {
    if (vibrationEnabled) vibPulse();

    Alert.alert(
      'Reset all data?',
      'This will permanently remove all saved notes and settings on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();

              setVibrationEnabled(true);
              setNotificationsEnabled(true);

              await AsyncStorage.setItem(KEY_VIBRATION, '1');
              await AsyncStorage.setItem(KEY_NOTIFICATIONS, '1');

              vibPulse();
              Alert.alert('Done', 'All data has been reset.');
            } catch {
              Alert.alert('Error', 'Could not reset data.');
            }
          },
        },
      ]
    );
  }, [vibrationEnabled]);

  return (
    <View style={s.root}>
      <Image source={BG} style={s.bg} resizeMode="cover" />
      <View style={s.dark} />

      <View style={s.content}>
        <Text style={s.title}>Settings</Text>

        <View style={s.card}>
          <View style={s.left}>
            <View style={s.iconCircle}>
              <Image source={ICON_BELL} style={s.icon} resizeMode="contain" />
            </View>
            <Text style={s.cardText}>Notifications</Text>
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={setNotifications}
            trackColor={{ false: 'rgba(255,255,255,0.22)', true: '#FF8A00' }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={s.card}>
          <View style={s.left}>
            <View style={s.iconCircle}>
              <Image source={ICON_BELL} style={s.icon} resizeMode="contain" />
            </View>
            <Text style={s.cardText}>Vibration</Text>
          </View>

          <Switch
            value={vibrationEnabled}
            onValueChange={setVibration}
            trackColor={{ false: 'rgba(255,255,255,0.22)', true: '#FF8A00' }}
            thumbColor="#ffffff"
          />
        </View>

        <Pressable onPress={onShareApp} style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]}>
          <View style={s.left}>
            <View style={s.iconCircle}>
              <Image source={ICON_SHARE} style={s.icon} resizeMode="contain" />
            </View>
            <Text style={s.cardText}>Share the App</Text>
          </View>
        </Pressable>

        <Pressable onPress={onResetAllData} style={({ pressed }) => [s.cardDanger, pressed && { opacity: 0.92 }]}>
          <View style={s.left}>
            <View style={s.iconCircleDanger}>
              <Text style={s.dangerMark}>!</Text>
            </View>
            <Text style={s.cardText}>Reset All Data</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  dark: { ...StyleSheet.absoluteFillObject, backgroundColor: '#071021', opacity: 0.22 },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 74,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  card: {
    height: 66,
    borderRadius: 22,
    backgroundColor: 'rgba(8,20,60,0.70)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardDanger: {
    height: 66,
    borderRadius: 22,
    backgroundColor: 'rgba(60,10,18,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  left: { flexDirection: 'row', alignItems: 'center' },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconCircleDanger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  dangerMark: { color: '#08143C', fontWeight: '900', fontSize: 18, marginTop: -1 },

  icon: { width: 18, height: 18, tintColor: '#071021' },

  cardText: { color: '#fff', fontWeight: '900', fontSize: 18 },
});