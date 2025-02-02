import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthenticatedTabs from './AuthenticatedTabs';
import { useAPI } from '../context/APIContext';
import UnauthenticatedTabs from './UnauthenticatedTabs';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { isAuthenticated, setIsAuthenticated } = useAPI();

  const handleLogout = async () => {
    setIsAuthenticated(false);
    await SecureStore.deleteItemAsync('authToken');

    // Aquí deberías agregar la lógica para limpiar el token de autenticación
  };

  useEffect(() => {
    //handleLogout();
  }, []);
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
        <Stack.Screen
          name="Authenticated"
          component={AuthenticatedTabs}
          options={{
            headerShown: false,
          }}
        />
      ) : (

        <Stack.Screen name="Unauthenticated" component={UnauthenticatedTabs}
          options={{
            headerShown: false,
          }} />

      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;