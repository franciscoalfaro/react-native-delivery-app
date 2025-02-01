import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [delivery, setDeliverys] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_URL = Constants.expoConfig.extra.API_URL;
  console.log(API_URL)

  useEffect(() => {
    axios.get(`${API_URL}/orders`)
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  useEffect(() => {
    setDeliverys([
      { id: '1', status: 'active', name: 'francisco' },
      { id: '2', status: 'active', name: 'gaston' },
    ]);

    setOrders([
      { id: '1', status: 'pending', customerName: 'francisco', address: 'huechuraba', deliveryTime: '16:15' },
      { id: '2', status: 'pending', customerName: 'gaston', address: 'huechuraba', deliveryTime: '16:20' },
    ]);
    
  }, []);

  const assignOrder = (orderId, deliveryId) => {
    console.log('asignado a ', orderId, deliveryId)
    axios.post(`${API_URL}/assign-order`, { orderId, deliveryId })
      .then(response => {
        console.log('Order assigned successfully:', response.data);
        // Optionally, update the orders state to reflect the change
      })
      .catch(error => console.error('Error assigning order:', error));
  };

  const AddDelivery = (name, surname) => {
    axios.post(`${API_URL}/adddelivery`, { name, surname })
      .then(response => {setUser(response.data)})
      .catch(error => console.error('Error assigning order:', error));
  };


  const Login = async (email, password) => {
    console.log(email, password);
    try {
      const response = await fetch(`${API_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      console.log(response)
  
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Respuesta:', data);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  

  return (
    <APIContext.Provider value={{ orders, delivery, assignOrder, AddDelivery, Login, isAuthenticated,setIsAuthenticated, }}>
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext);
