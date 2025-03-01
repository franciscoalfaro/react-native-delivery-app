import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [myorders, setMyOrders] = useState([]);
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
      fetchMyOrders();
      fetchDeliverys();
    }
  }, [isAuthenticated]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const token = await SecureStore.getItemAsync('authToken');

    if (!token) {
      console.error("No hay token disponible. El usuario debe iniciar sesión nuevamente.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}user/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ password: newPassword, currentPassword: currentPassword }), // 🔹 Se envía el nuevo password
        cache: "no-store",
      });

      const data = await response.json();

      if (data.status === 'success') {
        console.log(data.status)
        console.log("Contraseña cambiada exitosamente");
        // 🔹 Puedes agregar aquí una notificación o cerrar sesión si es necesario
      } else {
        console.error("Error al cambiar contraseña:", data?.message || "Error desconocido");
      }

    } catch (error) {
      console.error('Error cambiando la contraseña:', error);
    }

  }, [API_URL]);



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

  // Listar ordenes
  const fetchMyOrders = useCallback(async () => {
    const token = await SecureStore.getItemAsync('authToken');
    try {
      const response = await fetch(`${API_URL}order/mylist`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        cache: "no-store",
      });
      console.log('my orders',data)
      const data = await response.json();
      console.log(data)
      setMyOrders(data.orders);
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
        console.log("No hay token almacenado, cerrando sesión localmente.");
        setIsAuthenticated(false);
        setUser(null);
        setOrders([]);
        setDeliverys([]);
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
        // Si la sesión ya está expirada, borra el token localmente sin mostrar error
        const errorData = await response.json().catch(() => null);
        if (response.status === 401) { // 401 -> No autorizado (sesión expirada)
          console.log("Token expirado, cerrando sesión localmente.");
        } else {
          throw new Error(errorData?.message || `Error ${response.status}`);
        }
      }

      // Borra el token y actualiza el estado
      await SecureStore.deleteItemAsync('authToken');
      setIsAuthenticated(false);
      setUser(null);
      setOrders([]);
      setDeliverys([]);
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };

  const createOrder = useCallback(async (formData) => {
    const token = await SecureStore.getItemAsync('authToken');

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}order/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ formData }),
      });

      const data = await response.json();
      console.log(data.order)
      if (data.status === 'success') {
        fetchDeliverys();
        fetchOrders();
      }
      return data;



    } catch (error) {
      console.error('Error at create order:', error);
      throw error;
    }



  }, [API_URL, fetchOrders])



  const updateDeliveryAvailability = useCallback(async (activo) => {
    const token = await SecureStore.getItemAsync('authToken');

    if (!token) {
      console.error("No hay token disponible. El usuario debe iniciar sesión nuevamente.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}user/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ activo }), // 🔹 Se envía el nuevo password
        cache: "no-store",
      });

      const data = await response.json();

      if (data.status === 'success') {
        console.log(data.status)
        console.log("estado actualizado de forma correcta");
        // 🔹 Puedes agregar aquí una notificación o cerrar sesión si es necesario
      } else {
        console.error("Error al cambiar estado:", data?.message || "Error desconocido");
      }

    } catch (error) {
      console.error('Error cambiando el estado:', error);
    }

  }, [API_URL,fetchDeliverys]);


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
      fetchMyOrders,
      fetchDeliverys,
      changePassword,
      createOrder,
      myorders,
      user,
      updateDeliveryAvailability
    }}>
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext);
