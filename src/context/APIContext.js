import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [delivery, setDeliverys] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState([])

  const API_URL = Constants.expoConfig.extra.API_URL;

  // Verificar autenticación al iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
      }
    };
    checkAuth();
  }, []);

  // Obtener órdenes
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [API_URL]);

  // Obtener repartidores
  const fetchDeliverys = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/deliverys`);
      setDeliverys(response.data);
    } catch (error) {
      console.error('Error fetching deliverys:', error);
    }
  }, [API_URL]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchOrders();
    fetchDeliverys();
  }, [fetchOrders, fetchDeliverys]);

  // Asignar orden
  const assignOrder = async (orderId, deliveryId) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/assign-order`, { orderId, deliveryId });
      console.log('Order assigned successfully:', response.data);
      await fetchOrders(); // Actualizar lista de órdenes
    } catch (error) {
      console.error('Error assigning order:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar repartidor
  const AddDelivery = async (name, surname) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/adddelivery`, { name, surname });
      await fetchDeliverys(); // Actualizar lista de repartidores
      return response.data;
    } catch (error) {
      console.error('Error adding delivery:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const Login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });   
      const data = await response.json();


      if (data.token) {
        await SecureStore.setItemAsync('authToken', data.token);
        setIsAuthenticated(true);
                // Opcional: Guardar datos del usuario en el estado o contexto
        setUser(data.user);
      }
      return response.data;
    } catch (error) {
      await SecureStore.deleteItemAsync('authToken');
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const Logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  //update user password

  return (
    <APIContext.Provider value={{
      orders,
      delivery,
      isAuthenticated,
      isLoading,
      assignOrder,
      AddDelivery,
      Login,
      Logout,
      fetchOrders,
      fetchDeliverys,
      user
    }}>
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext);