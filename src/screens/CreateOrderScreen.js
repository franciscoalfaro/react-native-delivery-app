import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAPI } from '../context/APIContext';
import { useNavigation } from '@react-navigation/native';

const CreateOrderScreen = () => {
  const { createOrder } = useAPI();
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    address: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{8,15}$/;

    if (!formData.orderNumber) newErrors.orderNumber = 'Número de orden requerido';
    if (!formData.customerName) newErrors.customerName = 'Nombre del cliente requerido';
    if (!formData.address) newErrors.address = 'Dirección requerida';
    if (!formData.email) {
      newErrors.email = 'Email requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone) {
      newErrors.phone = 'Teléfono requerido';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Teléfono inválido (8-15 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createOrder(formData);

      Alert.alert('Éxito', 'Orden creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

      setFormData({  // Reset form
        orderNumber: '',
        customerName: '',
        address: '',
        email: '',
        phone: ''
      });

    } catch (error) {
      Alert.alert('Error', error.message || 'Error al crear la orden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Nueva Orden</Text>

          <View style={styles.inputContainer}>
            <Icon name="confirmation-number" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Número de Orden"
              placeholderTextColor="#999"
              value={formData.orderNumber}
              onChangeText={(text) => setFormData({ ...formData, orderNumber: text })}
            />
          </View>
          {errors.orderNumber && <Text style={styles.errorText}>{errors.orderNumber}</Text>}

          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre del Cliente"
              placeholderTextColor="#999"
              value={formData.customerName}
              onChangeText={(text) => setFormData({ ...formData, customerName: text })}
            />
          </View>
          {errors.customerName && <Text style={styles.errorText}>{errors.customerName}</Text>}

          <View style={styles.inputContainer}>
            <Icon name="location-on" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              placeholderTextColor="#999"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              multiline
            />
          </View>
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Icon name="add-circle" size={24} color="white" />
                <Text style={styles.buttonText}>Crear Orden</Text>

              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress= {() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="white" />
            <Text style={styles.buttonText}>Volver al Inicio</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 25,
  },
  backButton: {
    backgroundColor: '#6b7280', // Color diferente para el botón de volver
    marginTop: 10, // Espacio entre los botones
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#ffebee',
    fontSize: 14,
    marginBottom: 15,
    marginLeft: 10,
  },
});

export default CreateOrderScreen;