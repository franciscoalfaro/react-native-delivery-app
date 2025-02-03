import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useAPI } from '../context/APIContext';

const ProfileScreen = () => {
  const { user, Logout,changePassword } = useAPI(); // Asume que tienes un objeto "user" en tu contexto
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Todos los campos son requeridos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Aquí iría la lógica para cambiar la contraseña
      await changePassword(currentPassword, newPassword);
      setSuccessMessage('Contraseña cambiada con éxito');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage(error.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Icon name="user-circle" size={80} color="white" />
            {user ? (
              <>
                <Text style={styles.userName}>{user.name } {user.surname}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>{user.role}</Text>
              </>
            ) : (
              <Text style={styles.userEmail}>Cargando...</Text>
            )}
          </View>

          {/* Formulario para cambiar contraseña */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña actual"
                placeholderTextColor="#999"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar nueva contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {errorMessage && (
              <View style={styles.errorContainer}>
                <Icon name="exclamation-circle" size={16} color="#dc2626" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {successMessage && (
              <View style={styles.successContainer}>
                <Icon name="check-circle" size={16} color="#059669" />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Cambiar Contraseña</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Botón de Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={Logout}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 15,

  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  userRole: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#764ba2',
    
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  errorText: {
    color: '#dc2626',
    marginLeft: 5,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
  },
  successText: {
    color: '#059669',
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;