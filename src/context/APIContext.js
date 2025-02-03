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
  const [user, setUser] = useState(null);
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

  // Solo cargar datos cuando esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchDeliverys();
    }
  }, [isAuthenticated]);

  // Listar ordenes
  const fetchOrders = useCallback(async () => {
    const token = await SecureStore.getItemAsync('authToken');
    try {
      const response = await fetch(`${API_URL}order/list`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        cache: "no-store",
      });
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [API_URL]);

  // Obtener repartidores
  const fetchDeliverys = useCallback(async () => {
    const token = await SecureStore.getItemAsync('authToken');
    try {
      const response = await fetch(`${API_URL}delivery/list`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        cache: "no-store",
      });
      const data = await response.json();
      setDeliverys(data);
    } catch (error) {
      console.error('Error fetching deliverys:', error);
    }
  }, [API_URL]);

  // Asignar orden
  const assignOrder = useCallback(async (orderId, deliveryId) => {
    const token = await SecureStore.getItemAsync('authToken');
    try {
      if (!orderId || !deliveryId) {
        throw new Error('Email y contraseña son requeridos');
      }
      setIsLoading(true);

      const response = await fetch(`${API_URL}order/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ orderId, deliveryId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        fetchDeliverys();
        fetchOrders();
      }
      return data;
    } catch (error) {
      console.error('Error assigning order:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, fetchOrders, fetchDeliverys]);

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}`);
      }

      const data = await response.json();

      if (data.user.token) {
        await SecureStore.setItemAsync('authToken', data.user.token);
        setIsAuthenticated(true);
        setUser(data.user);
      }
      return data;
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
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        console.log("No hay token almacenado");
        return;
      }

      const response = await fetch(`${API_URL}user/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}`);
      }

      await SecureStore.deleteItemAsync('authToken');
      setIsAuthenticated(false);
      setUser(null);
      setOrders([]);
      setDeliverys([]);
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <APIContext.Provider value={{
      orders,
      delivery,
      isAuthenticated,
      isLoading,
      assignOrder,
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
