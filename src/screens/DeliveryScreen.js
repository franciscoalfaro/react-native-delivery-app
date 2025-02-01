import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAPI } from '../context/APIContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const DeliveryScreen = () => {
  const { orders } = useAPI();
  const pendingOrders = orders.filter(order => order.status === 'pending');

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Icon name="cube" size={20} color="#059669" />
        <Text style={styles.orderId}>Orden #${item.id}</Text>
        <View style={[styles.statusPill, { backgroundColor: '#05966920' }]}>
          <Text style={[styles.statusText, { color: '#059669' }]}>Pendiente</Text>
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

      <TouchableOpacity 
        style={styles.acceptButton}
        onPress={() => console.log('Pedido aceptado', item.id)}
      >
        <Icon name="check-circle" size={20} color="white" />
        <Text style={styles.buttonText}>Aceptar Pedido</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#059669', '#6ee7b7']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Icon name="truck" size={28} color="white" />
            <Text style={styles.title}>Órdenes Pendientes</Text>
            <Text style={styles.subtitle}>{pendingOrders.length} pedidos por asignar</Text>
          </View>

          {/* Orders List */}
          {pendingOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="check-circle" size={50} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyStateText}>¡Todo bajo control!</Text>
              <Text style={styles.emptyStateSubtext}>No hay pedidos pendientes</Text>
            </View>
          ) : (
            <FlatList
              data={pendingOrders}
              keyExtractor={item => item.id}
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
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
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
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    color: '#333',
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 25,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
  acceptButton: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
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