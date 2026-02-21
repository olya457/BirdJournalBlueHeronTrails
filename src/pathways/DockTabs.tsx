import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, StyleSheet, Platform, Dimensions } from 'react-native';

import type { DockTabParamList } from './typing';

import BirdVaultScreen from '../pages/BirdVaultScreen';
import TrailJournalScreen from '../pages/TrailJournalScreen';
import LearnPlayScreen from '../pages/LearnPlayScreen';
import MiniGameScreen from '../pages/MiniGameScreen';
import SettingsScreen from '../pages/SettingsScreen';

const { width } = Dimensions.get('window');
const IS_SMALL_SCREEN = width < 375;
const IC_VAULT = require('../gallery/tab_vault.png');
const IC_TRAIL = require('../gallery/tab_trail.png');
const IC_LEARN = require('../gallery/tab_learn.png');
const IC_MINI = require('../gallery/tab_mini.png');
const IC_SETUP = require('../gallery/tab_setup.png');

const Tab = createBottomTabNavigator<DockTabParamList>();

function TabIcon({ focused, source }: { focused: boolean; source: any }) {
  return (
    <View style={s.iconWrap}>
      <View style={[s.activeBg, focused && s.activeBgOn]} />
      <Image source={source} style={[s.icon, focused && s.iconOn]} resizeMode="contain" />
    </View>
  );
}

export default function DockTabs() {
  const tabBottom =
    Platform.OS === 'android'
      ? (IS_SMALL_SCREEN ? 12 : 70) - 20 
      : (IS_SMALL_SCREEN ? 12 : 16);    

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: IS_SMALL_SCREEN ? 10 : 16,
          right: IS_SMALL_SCREEN ? 10 : 16,
          bottom: tabBottom,

          height: IS_SMALL_SCREEN ? 68 : 74,
          borderTopWidth: 0,
          borderRadius: IS_SMALL_SCREEN ? 18 : 22,
          backgroundColor: '#152C7F',
          paddingTop: 0,

          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 8 },
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tab.Screen
        name="BirdVault"
        component={BirdVaultScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={IC_VAULT} /> }}
      />

      <Tab.Screen
        name="TrailJournal"
        component={TrailJournalScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={IC_TRAIL} /> }}
      />

      <Tab.Screen
        name="LearnPlay"
        component={LearnPlayScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={IC_LEARN} /> }}
      />

      <Tab.Screen
        name="MiniGame"
        component={MiniGameScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={IC_MINI} /> }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={IC_SETUP} /> }}
      />
    </Tab.Navigator>
  );
}

const s = StyleSheet.create({
  iconWrap: {
    width: IS_SMALL_SCREEN ? 44 : 54,
    height: IS_SMALL_SCREEN ? 40 : 44,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: 15 }],
  },
  activeBg: {
    position: 'absolute',
    width: IS_SMALL_SCREEN ? 40 : 46,
    height: IS_SMALL_SCREEN ? 34 : 38,
    borderRadius: IS_SMALL_SCREEN ? 10 : 14,
    backgroundColor: 'transparent',
  },
  activeBgOn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  icon: {
    width: IS_SMALL_SCREEN ? 20 : 22,
    height: IS_SMALL_SCREEN ? 20 : 22,
    opacity: 0.85,
  },
  iconOn: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
});