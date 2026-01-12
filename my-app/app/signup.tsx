
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { auth } from '../firebaseService';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Error', 'You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setLoading(false);
      Alert.alert('Success', 'Account created! Please log in.');
      router.replace('/login');
    } catch (error) {
      setLoading(false);
      let message = 'Sign up failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') message = 'Email already in use.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      else if (error.message) message += `\n${error.message}`;
      Alert.alert('Error', message);
      console.log('Sign up error:', error);
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
        <Text style={styles.cardTitle}>Create Account</Text>
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
        <View style={styles.inputRow}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)} style={styles.checkbox}>
            {agreeTerms && <View style={styles.checked} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            I agree to the <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
        </TouchableOpacity>
      </View>
      <Text style={styles.orText}>Or continue with</Text>
      <TouchableOpacity onPress={() => router.replace('/login')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#232B45',
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap',
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
