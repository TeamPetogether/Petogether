// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainScreen from './screens/MainScreen';
import DailyScreen from './screens/DailyScreen';
import DayScreen from './screens/DayScreen';
import WalkScreen from './screens/WalkScreen';
import WalkDayScreen from './screens/WalkDayScreen';
import BreedSelectScreen from './screens/BreedSelectScreen';
import CheckHistoryScreen from './screens/CheckHistoryScreen';
const Stack = createNativeStackNavigator(); 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Daily" component={DailyScreen} />
        <Stack.Screen name="Day" component={DayScreen} />
        <Stack.Screen name="Walk" component={WalkScreen} />
        <Stack.Screen name="WalkDay" component={WalkDayScreen} />
        <Stack.Screen name="BreedSelect" component={BreedSelectScreen} />
        <Stack.Screen name="CheckHistory" component={CheckHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}