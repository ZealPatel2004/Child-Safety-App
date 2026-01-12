import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Ionicons name="alert-circle" size={36} color="#4F8EF7" style={styles.icon} />
          <Text style={styles.title}>Emergency Alerts</Text>
          <Text style={styles.description}>
            Instantly notify guardians and authorities in case of danger or emergencies.
          </Text>
        </View>
        <View style={styles.card}>
          <MaterialCommunityIcons name="map-marker-radius" size={36} color="#4F8EF7" style={styles.icon} />
          <Text style={styles.title}>Safe Locations</Text>
          <Text style={styles.description}>
            Find and navigate to nearby safe zones, police stations, and hospitals quickly.
          </Text>
        </View>
        <View style={styles.card}>
          <FontAwesome5 name="user-shield" size={36} color="#4F8EF7" style={styles.icon} />
          <Text style={styles.title}>Guardian Monitoring</Text>
          <Text style={styles.description}>
            Allow trusted guardians to monitor your location and receive safety updates.
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 24,
    marginVertical: 10,
    width: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: '#ccc',
    fontSize: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4F8EF7',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
