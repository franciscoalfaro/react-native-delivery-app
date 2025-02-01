import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAPI } from './src/context/APIContext';
import { Button } from 'react-native';
import PublicScreen from './src/screens/PublicScreen';
import DeliveryScreen from './src/screens/DeliveryScreen';
import AdminScreen from './src/screens/AdminScreen';
import LoginScreen from './src/screens/LoginScreen';
import AssignOrderScreen from './src/screens/AssignOrderScreen';
import { APIProvider } from './src/context/APIContext';
import CreateDeliverys from './src/screens/CreateDeliverys';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { isAuthenticated, setIsAuthenticated } = useAPI();

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Aquí deberías agregar la lógica para limpiar el token de autenticación
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Delivery"
            component={DeliveryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AssignOrder"
            component={AssignOrderScreen}
            options={{ headerShown: false}}
          />
          <Stack.Screen
            name="Create"
            component={CreateDeliverys}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Public"
            component={PublicScreen}
            options={{ title: 'Página Pública' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <APIProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </APIProvider>
  );
}