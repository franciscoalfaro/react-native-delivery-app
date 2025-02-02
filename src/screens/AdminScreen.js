import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useAPI } from '../context/APIContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const AdminScreen = ({ navigation }) => {
  const { delivery } = useAPI();
  const listDelivery = delivery.filter(deliver => deliver.activo === true);
  console.log(listDelivery)

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const renderDeliveryItem = ({ item }) => (
    <View style={styles.deliveryCard}>
      <View style={styles.cardHeader}>
        <Icon name="user" size={24} color="#3b82f6" />
        <Text style={styles.deliveryName}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#3b82f620' }]}>
          <Text style={[styles.statusText, { color: '#3b82f6' }]}>Activo</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="check-circle" size={16} color="#059669" />
          <Text style={styles.statText}>{item.completedDeliveries} entregas</Text>
        </View>
        
        <View style={styles.statItem}>
          <Icon name="star" size={16} color="#f59e0b" />
          <Text style={styles.statText}>{item.rating}/5.0</Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Icon name="users" size={28} color="white" />
          <Text style={styles.title}>Gestión de Repartidores</Text>
          <Text style={styles.subtitle}>
            {listDelivery.length} repartidores activos
          </Text>
        </View>

        {/* Delivery List */}
        {listDelivery.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="exclamation-circle" size={50} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyStateText}>No hay repartidores activos</Text>
            <Text style={styles.emptyStateSubtext}>Crea nuevos repartidores para comenzar</Text>
          </View>
        ) : (
          <FlatList
            data={listDelivery}
            keyExtractor={item => item._id}
            renderItem={renderDeliveryItem}
            scrollEnabled={true}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleNavigation('Create')}
          >
            <Icon name="user-plus" size={20} color="white" />
            <Text style={styles.buttonText}>Nuevo Repartidor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleNavigation('Delivery')}
          >
            <Icon name="truck" size={20} color="white" />
            <Text style={styles.buttonText}>Repartos Activos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.accentButton]}
            onPress={() => handleNavigation('AssignOrder')}
          >
            <Icon name="list-alt" size={20} color="white" />
            <Text style={styles.buttonText}>Gestión de Órdenes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 5,
  },
  deliveryCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  deliveryName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    color: '#1e293b',
  },
  statusBadge: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 14,
  },
  actionsContainer: {
    marginTop: 25,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#ff5722',
  },
  secondaryButton: {
    backgroundColor: '#2d9cdb',
  },
  accentButton: {
    backgroundColor: '#ffb703',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginVertical: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  emptyStateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 10,
  },
});

export default AdminScreen;