import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useAPI } from '../context/APIContext';

const DeliveryScreen = () => {
  const { orders } = useAPI();
  const pendingOrders = orders.filter(order => order.status === 'pending');

  return (
    <View>
      <Text>Órdenes Pendientes</Text>
      <FlatList
        data={pendingOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>Orden: {item.id}</Text>
            <Button title="Aceptar" onPress={() => console.log('Pedido aceptado', item.id)} />
          </View>
        )}
      />
    </View>
  );
};