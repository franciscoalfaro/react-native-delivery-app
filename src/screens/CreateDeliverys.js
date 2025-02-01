import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const CreateDeliverys = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameDelivery, setNameDelivery] = useState('');
  const [surnameDelivery, setSurnameDelivery] = useState('');
  const [location, setLocation] = useState({
    latitude: 19.432608,
    longitude: -99.133209,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleCreateDelivery = async () => {
    if (!nameDelivery || !surnameDelivery) return;
    
    setIsLoading(true);
    try {
      // Aquí iría tu llamada a la API
      // await AddDelivery(nameDelivery, surnameDelivery, location);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNameDelivery('');
        setSurnameDelivery('');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#059669', '#6ee7b7']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Icon name="user-plus" size={28} color="white" />
            <Text style={styles.title}>Nuevo Repartidor</Text>
            <Text style={styles.subtitle}>Registra nuevos repartidores en el sistema</Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="user-o" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#999"
                value={nameDelivery}
                onChangeText={setNameDelivery}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="address-card-o" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#999"
                value={surnameDelivery}
                onChangeText={setSurnameDelivery}
              />
            </View>



            {/* Mensajes de validación */}
            {(!nameDelivery || !surnameDelivery) && (
              <Text style={styles.errorText}>
                <Icon name="exclamation-circle" /> Completa todos los campos
              </Text>
            )}
          </View>

          {/* Botón de acción */}
          <TouchableOpacity 
            style={[styles.createButton, (!nameDelivery || !surnameDelivery) && styles.disabledButton]}
            onPress={handleCreateDelivery}
            disabled={!nameDelivery || !surnameDelivery || isLoading}
          >
            <LinearGradient
              colors={(!nameDelivery || !surnameDelivery) ? ['#f0f4ff', '#f0f4ff'] : ['#ffffff', '#f0f4ff']}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#3b82f6" />
              ) : (
                <>
                  <Icon 
                    name={success ? 'check-circle' : 'user-plus'} 
                    size={24} 
                    color={success ? '#10b981' : '#3b82f6'} 
                  />
                  <Text style={styles.buttonText}>
                    {success ? '¡Registrado!' : 'Crear Repartidor'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 40,
  },

  createButton: {
    borderRadius: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 15,
  },
  buttonText: {
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
});

export default CreateDeliverys;