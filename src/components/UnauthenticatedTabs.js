import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoginScreen from '../screens/LoginScreen';
import PublicScreen from '../screens/PublicScreen';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

const UnauthenticatedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Login') {
            iconName = 'sign-in';
          } else if (route.name === 'Buscar Orden') {
            iconName = 'search';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#ff5733', '#ff914d']} 
            start={{ x: 0, y: 1 }} // Inicio del gradiente (izquierda)
            end={{ x: 0, y: 0 }} // Fin del gradiente (derecha)
            style={{ flex: 1}} // Bordes redondeados
          />
        ),
        // Estilos personalizados
        tabBarStyle: {
          //height: 80, // Altura de la barra
          ///paddingBottom: 10, // Espaciado inferior
          //paddingTop: 10, // Espaciado superior
          shadowColor: '#000', // Sombra
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10, // Sombra en Android
          overflow: 'hidden', // Para que el gradiente no se salga de los bordes
        },
        tabBarActiveTintColor: '#ffffff', // Color activo (blanco)
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)', // Color inactivo (blanco semitransparente)
        tabBarLabelStyle: {
          fontSize: 12, // Tamaño de la fuente
          fontWeight: 'bold', // Negrita
          marginBottom: 5, // Espaciado inferior del texto
        },
        tabBarIconStyle: {
          marginBottom: -5, // Ajustar posición del ícono
        },
        tabBarItemStyle: {
          borderRadius: 10, // Bordes redondeados para cada ítem
          marginHorizontal: 5, // Espaciado horizontal entre ítems
        },
        headerShown: false, // Ocultar el header
      })}
    >
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Buscar Orden" component={PublicScreen} />
    </Tab.Navigator>
  );
};

export default UnauthenticatedTabs;