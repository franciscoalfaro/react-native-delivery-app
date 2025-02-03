import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAPI } from '../context/APIContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const AssignOrderScreen = ({route}) => {

  const [orderId, setOrderId] = useState([]);
  const { delivery, assignOrder } = useAPI();
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();

  const { item, orderNumber } = route.params;

  useEffect(() => {
    if (item) {
      setOrderId(item);
    }
  }, [item]);

  const listDelivery = delivery.map(deliver => ({ id: deliver._id, name: deliver.name }));

  const handleAssignOrder = async () => {
    if (!orderId || !selectedDelivery) return;
  
    setIsLoading(true);
    try {
      await assignOrder(orderId, selectedDelivery);
      navigation.navigate('Authenticated');
      setSuccess(true);
      
      // Mostrar mensaje de orden asignada con Alert
      Alert.alert('Éxito', 'La orden fue asignada correctamente');
      
      setTimeout(() => setSuccess(false), 2000);
      setOrderId('');
      setSelectedDelivery('');
    } catch (error) {
      // Mostrar mensaje de error en caso de fallo
      Alert.alert('Error', 'Hubo un problema al asignar la orden');
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
          {/* Header */}
          <View style={styles.header}>
            <Icon name="tasks" size={28} color="white" />
            <Text style={styles.title}>Asignar Pedidos</Text>
            <Text style={styles.subtitle}>Asigna órdenes a tus repartidores</Text>
            <Text style={styles.subtitle}>Pedido #{orderNumber}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Order ID Input */}
            <View style={[styles.inputContainer,  { display: 'none' }]}>
              <Icon name="hashtag" size={20} color="#666" style={styles.icon} />
              <TextInput style={styles.input} editable={false} placeholder="Número de orden" placeholderTextColor="#999" value={orderId} onChangeText={setOrderId} keyboardType="alphanumeric" />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="hashtag" size={20} color="#666" style={styles.icon} />
              <TextInput style={styles.input} editable={false} placeholder="Número de orden" placeholderTextColor="#999" value={orderNumber} keyboardType="alphanumeric" />
            </View>

            {/* Delivery Picker */}
            <View style={styles.pickerContainer}>
              <Icon name="user" size={20} color="#666" style={styles.icon} />
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedDelivery || ''}  // Fallback to an empty string if selectedDelivery is null
                  onValueChange={setSelectedDelivery}
                  style={styles.picker}
                  dropdownIconColor="#666"
                  mode="dropdown" // Modo dropdown para iOS
                >
                  <Picker.Item label="Selecciona un repartidor" value={delivery.id}/>
                  {listDelivery.map(delivery => (
                    <Picker.Item
                      key={delivery.id}  // Ensure the id is a string if it's not already
                      label={delivery.name}
                      value={delivery.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Validation Messages */}
            {(!orderId || !selectedDelivery) && (
              <Text style={styles.errorText}>
                <Icon name="exclamation-circle" /> Completa todos los campos
              </Text>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.button, (!orderId || !selectedDelivery) && styles.disabledButton]}
              onPress={handleAssignOrder}
              disabled={!orderId || !selectedDelivery || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Icon name="paper-plane" size={20} color="white" />
                  <Text style={styles.buttonText}>
                    {success ? '¡Asignado!' : 'Asignar Pedido'}
                  </Text>
                  {success && <Icon name="check" size={20} color="white" style={styles.successIcon} />}
                </>
              )}
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    padding: 25,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 5,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
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
    borderBottomColor: '#ddd',
    marginBottom: 25,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 25,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 16,
  },
  pickerWrapper: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: '#a78bfa',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
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
  successIcon: {
    marginLeft: 10,
  },
});

export default AssignOrderScreen;
