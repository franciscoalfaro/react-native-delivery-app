import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { APIProvider } from './src/context/APIContext';
import MainNavigator from './src/components/MainNavigator';


export default function App() {
  return (
    <APIProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </APIProvider>
  );
}