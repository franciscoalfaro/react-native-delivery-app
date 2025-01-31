import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const API_URL = Constants.expoConfig.extra.API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/orders`)
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  return (
    <APIContext.Provider value={{ orders }}>
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext);
