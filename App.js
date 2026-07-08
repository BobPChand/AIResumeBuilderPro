import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from 'react-native-vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ResumeBuilderScreen from './src/screens/ResumeBuilderScreen';
import CoverLetterScreen from './src/screens/CoverLetterScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import PaywallScreen from './src/screens/PaywallScreen';

const Tab = createBottomTabNavigator();

const THEME_COLOR = '#1E6FD9';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
              else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
              else if (route.name === 'Resume') iconName = focused ? 'document-text' : 'document-text-outline';
              else if (route.name === 'Cover Letter') iconName = focused ? 'mail' : 'mail-outline';
              else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
              else if (route.name === 'Upgrade') iconName = focused ? 'rocket' : 'rocket-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: THEME_COLOR,
            tabBarInactiveTintColor: '#999',
            tabBarStyle: { paddingBottom: 5, height: 60 },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Resume" component={ResumeBuilderScreen} />
          <Tab.Screen name="Cover Letter" component={CoverLetterScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Upgrade" component={PaywallScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
