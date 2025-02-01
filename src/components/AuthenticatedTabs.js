import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import AdminScreen from '../screens/AdminScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import AssignOrderScreen from '../screens/AssignOrderScreen';
import CreateDeliverys from '../screens/CreateDeliverys';
import { useAPI } from '../context/APIContext';
import ProfileScreen from '../screens/ProfileScreen';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

const AuthenticatedTabs = () => {
  const { Logout, user } = useAPI();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Delivery') {
            iconName = 'truck';
          } else if (route.name === 'AssignOrder') {
            iconName = 'list-alt';
          } else if (route.name === 'Create') {
            iconName = 'user-plus';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Logout') {
            iconName = 'sign-out';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#059669', '#6ee7b7']} // Gradiente azul
            start={{ x: 0, y: 1 }} // Inicio del gradiente (izquierda)
            end={{ x: 0, y: 0 }} // Fin del gradiente (derecha)
            style={{ flex: 1}} // Bordes redondeados
          />
        ),
        tabBarStyle: {
          height: 80, // Altura de la barra
          paddingBottom: 10, // Espaciado inferior
          paddingTop: 10, // Espaciado superior
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
        headerShown: false,
      })}
    >
      {/* Opciones para admin */}
      {user?.role === 'admin' && (
        <>
          <Tab.Screen name="Inicio" component={AdminScreen} />
          <Tab.Screen name="Delivery" component={DeliveryScreen} />
          <Tab.Screen name="AssignOrder" component={AssignOrderScreen} />
          <Tab.Screen name="Create" component={CreateDeliverys} />
        </>
      )}

      {/* Opciones para delivery */}
      {user?.role === 'delivery' && (
        <>
          <Tab.Screen name="Delivery" component={DeliveryScreen} />
        </>
      )}

      {/* Opciones comunes para ambos roles */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen
        name="Logout"
        component={AdminScreen} // Puedes usar cualquier componente aquí
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Evita la navegación
            Logout(); // Ejecuta el logout
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default AuthenticatedTabs;