import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PublicScreen from './src/screens/PublicScreen';
import DeliveryScreen from './src/screens/DeliveryScreen';
import AdminScreen from './src/screens/AdminScreen';
import LoginScreen from './src/screens/LoginScreen';
import AssignOrderScreen from './src/screens/AssignOrderScreen';
import { APIProvider } from './src/context/APIContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <APIProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Public" component={PublicScreen} />
          <Stack.Screen name="Delivery" component={DeliveryScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="AssignOrder" component={AssignOrderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </APIProvider>
  );
}
