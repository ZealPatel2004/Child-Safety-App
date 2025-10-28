import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';

export default function HomeScreen() {
  const handleCall911 = () => {
    Alert.alert(
      "Emergency Call",
      "Are you sure you want to call 911?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL('tel:911') }
      ]
    );
  };

  const handleCallNCMEC = () => {
    Alert.alert(
      "Call NCMEC",
      "Call National Center for Missing & Exploited Children?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL('tel:1-800-843-5678') }
      ]
    );
  };

  const navigateToAddChild = () => {
    router.push('/(tabs)/explore');
  };

  const handleSafetyLocations = () => {
    // Navigate to safety locations screen
    router.push('/safety-locations');
  };

  const handleReportActivity = () => {
    Alert.alert(
      "Report Suspicious Activity",
      "This feature will allow you to report suspicious activity to authorities. Would you like to call the police?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call Police", onPress: () => Linking.openURL('tel:911') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Child Safety
          </Text>
          <Text style={styles.subtitle}>
            Emergency & Safety Resources
          </Text>
        </View>

        {/* Emergency Call 911 Button */}
        <TouchableOpacity 
          onPress={handleCall911}
          style={styles.emergencyButton}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="call" size={32} color="white" />
            <Text style={styles.emergencyButtonText}>Call 911</Text>
          </View>
          <Text style={styles.emergencySubtext}>
            Emergency Services
          </Text>
        </TouchableOpacity>

        {/* Place a Call to NCMEC */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Place a Call to National Center for Missing & Exploited Children
          </Text>
          
          <TouchableOpacity 
            onPress={handleCallNCMEC}
            style={styles.ncmecButton}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="call" size={24} color="white" />
              <Text style={styles.buttonText}>Call NCMEC</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          <View style={styles.actionsList}>
            <TouchableOpacity style={styles.actionItem} onPress={navigateToAddChild}>
              <MaterialIcons name="child-care" size={28} color="#4F46E5" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Add Child Profile</Text>
                <Text style={styles.actionSubtitle}>Manage child information</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleSafetyLocations}>
              <MaterialIcons name="location-on" size={28} color="#EF4444" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Safety Locations</Text>
                <Text style={styles.actionSubtitle}>Find nearby safe places</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleReportActivity}>
              <MaterialIcons name="report" size={28} color="#F59E0B" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Report Suspicious Activity</Text>
                <Text style={styles.actionSubtitle}>Help keep children safe</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* TraffickCam Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About TraffickCam</Text>
          <Text style={styles.infoText}>
            TraffickCam is a mobile app that allows users to upload images of their hotel rooms during stay while traveling.
          </Text>
          <Text style={styles.infoText}>
            The purpose is to create a database of hotel room images that investigators can efficiently search to find other images taken in the same location.
          </Text>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>Available on iOS and Android</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  emergencySubtext: {
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  ncmecButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  actionsList: {
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  actionContent: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  infoTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  infoBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
