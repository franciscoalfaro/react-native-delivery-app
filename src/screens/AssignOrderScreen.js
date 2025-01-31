import React, { useState } from 'react';
import { View, Text, TextInput, Button, Picker } from 'react-native';

const AssignOrderScreen = () => {
  const [orderId, setOrderId] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const deliveryPeople = ['Repartidor 1', 'Repartidor 2']; // Simulación

  return (
    <View>
      <Text>Asignar Pedido</Text>
      <TextInput placeholder="Número de orden" value={orderId} onChangeText={setOrderId} />
      <Picker selectedValue={selectedDelivery} onValueChange={setSelectedDelivery}>
        {deliveryPeople.map(delivery => (
          <Picker.Item key={delivery} label={delivery} value={delivery} />
        ))}
      </Picker>
      <Button title="Asignar" onPress={() => console.log('Pedido asignado', orderId, selectedDelivery)} />
    </View>
  );
};

export default AssignOrderScreen;