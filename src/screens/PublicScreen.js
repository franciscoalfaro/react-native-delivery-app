import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform ,ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const PublicScreen = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Simulación de datos de seguimiento
  const mockTrackingData = {
    deliveryLocation: {
      latitude: -33.4489,
      longitude: -70.6693,
    },
    status: 'En camino',
  };

  const handleTrackOrder = () => {
    if (!orderNumber) {
      setErrorMessage('Por favor, ingresa un número de orden');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Simular una solicitud de seguimiento
    setTimeout(() => {
      setIsLoading(false);
      setTrackingData(mockTrackingData);
    }, 1500);
  };

  const handleRateDelivery = (selectedRating) => {
    setRating(selectedRating);
    // Aquí podrías enviar la calificación a tu backend
    console.log('Calificación enviada:', selectedRating);
  };

  return (
    <LinearGradient colors={['#059669', '#6ee7b7']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Título */}
          <Text style={styles.title}>Rastrea tu Pedido</Text>

          {/* Campo de entrada para el número de orden */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Número de orden"
              placeholderTextColor="#999"
              value={orderNumber}
              onChangeText={setOrderNumber}
              keyboardType="numeric"
            />
          </View>

          {/* Botón de rastrear */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleTrackOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Rastrear Pedido</Text>
            )}
          </TouchableOpacity>

          {/* Mensaje de error */}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Icon name="exclamation-circle" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Mapa y detalles de seguimiento */}
          {trackingData && (
            <>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: trackingData.deliveryLocation.latitude,
                    longitude: trackingData.deliveryLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={trackingData.deliveryLocation}
                    title="Ubicación del Repartidor"
                  />
                </MapView>
              </View>

              <Text style={styles.statusText}>
                Estado: {trackingData.status}
              </Text>

              {/* Calificación de la entrega */}
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Califica la entrega:</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRateDelivery(star)}
                    >
                      <Icon
                        name={star <= rating ? 'star' : 'star-o'}
                        size={30}
                        color={star <= rating ? '#f59e0b' : '#ffff'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  input: {
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#764ba2',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    marginLeft: 5,
  },
  mapContainer: {
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
});

export default PublicScreen;