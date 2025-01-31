// src/screens/LoginScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Pantalla de Inicio de Sesión</Text>
      <Button title="Ingresar" onPress={() => navigation.navigate('Admin')} />
    </View>
  );
};

export default LoginScreen;