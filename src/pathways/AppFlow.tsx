import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './typing';

import LaunchGateScreen from '../pages/LaunchGateScreen';
import FirstStepsScreen from '../pages/FirstStepsScreen';
import DockTabs from './DockTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppFlow() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LaunchGate"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="LaunchGate" component={LaunchGateScreen} />
        <Stack.Screen name="FirstSteps" component={FirstStepsScreen} />
        <Stack.Screen name="Dock" component={DockTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
