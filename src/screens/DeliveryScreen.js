import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useAPI } from '../context/APIContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const DeliveryScreen = () => {
  const { orders, user, updateOrderStatus } = useAPI();
  const navigation = useNavigation();
  console.log('delivery Screen', orders);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#05966920', color: '#059669', text: 'Pendiente' };
      case 'out_for_delivery':
        return { bg: '#3b82f620', color: '#3b82f6', text: 'En camino' };
      case 'delivered':
        return { bg: '#10b98120', color: '#10b981', text: 'Entregado' };
      default:
        return { bg: '#05966920', color: '#059669', text: 'Pendiente' };
    }
  };

  const handleAssignDelivery = async (item, orderNumber) => {
    try {
      navigation.navigate('AssignOrder', { item, orderNumber });
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al asignar el pedido');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      if (newStatus === 'delivered') {
        Alert.alert('Entrega Confirmada', 'El pedido ha sido marcado como entregado');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al actualizar el estado');
    }
  };

  const confirmDelivery = (orderId) => {
    Alert.alert(
      'Confirmar Entrega',
      '¿Estás seguro que deseas marcar este pedido como entregado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => handleStatusUpdate(orderId, 'delivered') }
      ]
    );
  };

  if (!user) {
    return (
      <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </LinearGradient>
    );
  }

  const filteredOrders = user.role === 'admin'
    ? orders.filter(order => order.status === 'pending') // Admin solo ve pedidos pendientes
    : orders.filter(order => order.deliveryId === user.id && order.status !== 'delivered'); // Delivery solo ve pedidos asignados y no entregados

  const headerConfig = {
    admin: {
      title: 'Gestión de Pedidos',
      subtitle: `${filteredOrders.length} pedidos por asignar`,
      icon: 'users'
    },
    delivery: {
      title: 'Mis Entregas',
      subtitle: `${filteredOrders.length} pedidos asignados`,
      icon: 'truck'
    }
  };

  const renderOrderItem = ({ item }) => {
    const status = getStatusDetails(item.status);

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Icon name="cube" size={20} color={status.color} />
          <Text style={styles.orderId}>Orden #{item.orderNumber}</Text>
          <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
          </View>
        </View>

        <View style={styles.orderDetailRow}>
          <Icon name="user" size={16} color="#666" style={styles.detailIcon} />
          <Text style={styles.detailText}>{item.customerName}</Text>
        </View>

        <View style={styles.orderDetailRow}>
          <Icon name="map-marker" size={16} color="#666" style={styles.detailIcon} />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>

        <View style={styles.orderDetailRow}>
          <Icon name="clock-o" size={16} color="#666" style={styles.detailIcon} />
          <Text style={styles.detailText}>{item.deliveryTime}</Text>
        </View>

        {user.role === 'admin' && item.status === 'pending' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#059669' }]} onPress={() => handleAssignDelivery(item, item.orderNumber)}>
            <Icon name="user-plus" size={20} color="white" />
            <Text style={styles.buttonText}>Asignar Repartidor</Text>
          </TouchableOpacity>
        )}

        {user.role === 'delivery' && item.status === 'assigned' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
            onPress={() => handleStatusUpdate(item.id, 'out_for_delivery')}
          >
            <Icon name="check-circle" size={20} color="white" />
            <Text style={styles.buttonText}>Iniciar Entrega</Text>
          </TouchableOpacity>
        )}

        {user.role === 'delivery' && item.status === 'out_for_delivery' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
            onPress={() => confirmDelivery(item.id)}
          >
            <Icon name="check-square-o" size={20} color="white" />
            <Text style={styles.buttonText}>Confirmar Entrega</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Icon name={headerConfig[user.role].icon} size={28} color="white" />
            <Text style={styles.title}>{headerConfig[user.role].title}</Text>
            <Text style={styles.subtitle}>{headerConfig[user.role].subtitle}</Text>
          </View>

          {filteredOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="check-circle" size={50} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyStateText}>¡Todo bajo control!</Text>
              <Text style={styles.emptyStateSubtext}>No hay pedidos pendientes</Text>
            </View>
          ) : (
            <FlatList
              data={filteredOrders}
              keyExtractor={(item) => item._id.toString()} 
              renderItem={renderOrderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 25 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40, paddingVertical: 15, marginTop: 20 },
  title: { fontSize: 26, fontWeight: '700', color: 'white', marginTop: 10 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  orderCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  orderHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 15 },
  orderId: { fontSize: 18, fontWeight: '600', marginLeft: 10, flex: 1, color: '#333' },
  statusPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: '700' },
  orderDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailIcon: { width: 25 },
  detailText: { color: '#666', fontSize: 14 },
  actionButton: { flexDirection: 'row', borderRadius: 12, padding: 15, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  buttonText: { color: 'white', fontWeight: '600', marginLeft: 10, fontSize: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  emptyStateText: { color: 'white', fontSize: 22, fontWeight: '600', marginTop: 20 },
  emptyStateSubtext: { color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  listContent: { paddingBottom: 30 }
});

export default DeliveryScreen;
