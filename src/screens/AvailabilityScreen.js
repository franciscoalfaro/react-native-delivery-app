import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAPI } from '../context/APIContext';

const AvailabilityScreen = () => {
  const { user, updateDeliveryAvailability } = useAPI();
  const [localStatus, setLocalStatus] = useState(user?.status || false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Mapeo de estados booleanos a configuraciones visuales
  const statusConfig = {
    true: {
      label: 'Disponible',
      icon: 'check-circle',
      color: '#4CAF50',
      bgColor: '#E8F5E9'
    },
    false: {
      label: 'No Disponible',
      icon: 'cancel',
      color: '#F44336',
      bgColor: '#FFEBEE'
    }
  };

  const handleConfirm = async () => {
    if (localStatus === user?.status) return;
    
    try {
      setIsUpdating(true);
      await updateDeliveryAvailability(user._id, localStatus);
      Alert.alert('Éxito', 'Estado actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hola, {user.name}</Text>
        
        <View style={styles.currentStatusContainer}>
          <Text style={styles.sectionTitle}>Estado Actual:</Text>
          <View style={[styles.statusBadge, { 
            backgroundColor: statusConfig[user.status.toString()]?.bgColor 
          }]}>
            <Icon
              name={statusConfig[user.status.toString()]?.icon}
              size={24}
              color={statusConfig[user.status.toString()]?.color}
            />
            <Text style={[styles.statusText, { 
              color: statusConfig[user.status.toString()]?.color 
            }]}>
              {statusConfig[user.status.toString()]?.label}
            </Text>
          </View>
        </View>

        <View style={styles.statusSelectorContainer}>
          <Text style={styles.sectionTitle}>Seleccionar Nuevo Estado:</Text>
          
          {Object.entries(statusConfig).map(([key, config]) => {
            const booleanValue = key === 'true';
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.statusButton,
                  { 
                    backgroundColor: localStatus === booleanValue 
                      ? config.bgColor 
                      : '#FFFFFF50' 
                  }
                ]}
                onPress={() => setLocalStatus(booleanValue)}
                disabled={isUpdating}
              >
                <Icon name={config.icon} size={28} color={config.color} />
                <Text style={[styles.statusLabel, { color: config.color }]}>
                  {config.label}
                </Text>
                {localStatus === booleanValue && (
                  <Icon 
                    name="check" 
                    size={20} 
                    color={config.color} 
                    style={styles.checkIcon} 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (localStatus === user.status || isUpdating) && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={localStatus === user.status || isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Icon name="update" size={24} color="white" />
              <Text style={styles.confirmButtonText}>Confirmar Cambio</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
    fontWeight: '600',
  },
  currentStatusContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    gap: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusSelectorContainer: {
    marginBottom: 30,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    gap: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF30',
    position: 'relative',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    position: 'absolute',
    right: 15,
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    borderRadius: 15,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 'auto',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default AvailabilityScreen;