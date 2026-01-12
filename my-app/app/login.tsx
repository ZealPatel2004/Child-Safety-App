

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { auth } from '../firebaseService';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setLoading(false);
      Alert.alert('Success', 'Logged in successfully!');
      router.replace('/(tabs)');
    } catch (error) {
      setLoading(false);
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') message = 'No user found with this email.';
      else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.appTitle}>Child Safety App</Text>
        <Text style={styles.subtitle}>Reach Your Safety Summit</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome Back</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>📧</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password? Email <Text style={styles.link}>support@sfriends.com</Text> to reset your password</Text>
      </View>
      <Text style={styles.orText}>Or continue with</Text>
      <TouchableOpacity onPress={() => router.replace('/signup')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#19213A',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'left',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232B45',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  inputIcon: {
    fontSize: 18,
    color: '#3B82F6',
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotText: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 2,
    textAlign: 'center',
  },
  link: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  orText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 8,
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 16,
  },
});
