import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useAPI } from '../context/APIContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const DeliveryScreen = () => {
  const { user, updateOrderStatus, orders, myorders } = useAPI();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);

  console.log(filteredOrders)


  const loadData = () => {
    try {
      setLoading(true);
      setError(null);

      // Utilizamos orders o myorders según el rol del usuario
      let ordersToUse = user.role === 'admin' ? orders : myorders;

      // Filtrar según sea necesario
      const filtered = user.role === 'admin' 
        ? ordersToUse.filter(order => order.status === 'pending')
        : ordersToUse.filter(order => order.deliveryId === user.id && order.status !== 'delivered');
        
      setFilteredOrders(filtered);
    } catch (err) {
      setError(err.message || 'Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [user, orders, myorders]) // Añadimos orders y myorders en las dependencias
  );
  const getStatusDetails = (status) => {
    switch(status) {
      case 'pending':
        return { bg: '#05966920', color: '#059669', text: 'Pendiente' };
      case 'assigned':
        return { bg: '#3b82f620', color: '#3b82f6', text: 'Asignado' };
      case 'out_for_delivery':
        return { bg: '#f59e0b20', color: '#f59e0b', text: 'En camino' };
      case 'delivered':
        return { bg: '#10b98120', color: '#10b981', text: 'Entregado' };
      default:
        return { bg: '#05966920', color: '#059669', text: 'Pendiente' };
    }
  };

  const handleAssignOrder = (order) => {
    navigation.navigate('AssignOrder', { orderId: order._id });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadData(); // Recargar datos después de actualizar
      
      if(newStatus === 'delivered') {
        Alert.alert('Éxito', 'Entrega confirmada exitosamente');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Error al actualizar el estado');
    }
  };

  const confirmDelivery = (orderId) => {
    Alert.alert(
      'Confirmar Entrega',
      '¿Estás seguro de marcar esta orden como entregada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => handleStatusChange(orderId, 'delivered') }
      ]
    );
  };

  const renderOrderItem = ({ item }) => {
    const status = getStatusDetails(item.status);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Icon name="cube" size={20} color={status.color} />
          <Text style={styles.orderNumber}>Orden #{item.orderNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon name="user" size={16} color="#666" />
          <Text style={styles.detailText}>{item.customerName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="map-marker" size={16} color="#666" />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="clock-o" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.deliveryTime).toLocaleDateString()}
          </Text>
        </View>

        {user.role === 'admin' && item.status === 'pending' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
            onPress={() => handleAssignOrder(item)}
          >
            <Icon name="user-plus" size={20} color="white" />
            <Text style={styles.buttonText}>Asignar Repartidor</Text>
          </TouchableOpacity>
        )}

        {user.role === 'delivery' && item.status === 'assigned' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
            onPress={() => handleStatusChange(item._id, 'out_for_delivery')}
          >
            <Icon name="road" size={20} color="white" />
            <Text style={styles.buttonText}>Iniciar Entrega</Text>
          </TouchableOpacity>
        )}

        {user.role === 'delivery' && item.status === 'out_for_delivery' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10b981' }]}
            onPress={() => confirmDelivery(item._id)}
          >
            <Icon name="check-circle" size={20} color="white" />
            <Text style={styles.buttonText}>Confirmar Entrega</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="exclamation-triangle" size={40} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (filteredOrders.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="check-circle" size={50} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyStateText}>¡Todo bajo control!</Text>
          <Text style={styles.emptyStateSubtext}>No hay pedidos pendientes</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Icon 
              name={user.role === 'admin' ? "list-alt" : "truck"} 
              size={28} 
              color="white" 
            />
            <Text style={styles.title}>
              {user.role === 'admin' 
                ? 'Gestión de Pedidos' 
                : 'Mis Entregas'}
            </Text>
            <Text style={styles.subtitle}>
              {filteredOrders.length} pedidos {user.role === 'admin' ? 'por asignar' : 'activos'}
            </Text>
          </View>

          {renderContent()}
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
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
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    color: '#333',
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyStateText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
  },
  emptyStateSubtext: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 30,
  },
});

export default DeliveryScreen;