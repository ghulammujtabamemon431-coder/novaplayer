import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../HomeScreen';
import PlayerScreen from '../PlayerScreen.jsx/PlayerScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Nova Player' }} />
        <Stack.Screen name="Player" component={PlayerScreen} options={{ title: 'Player' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
