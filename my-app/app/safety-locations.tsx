import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface SafeLocation {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire' | 'school' | 'community' | 'custom';
  address: string;
  phone?: string;
  distance?: number;
  isOpen24h?: boolean;
}

export default function SafetyLocationsScreen() {
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([]);
  const [loading, setLoading] = useState(false);

  const mockSafeLocations: SafeLocation[] = [
    {
      id: '1',
      name: 'Metro Police Station',
      type: 'police',
      address: '123 Main Street, Downtown',
      phone: '911',
      distance: 0.5,
      isOpen24h: true
    },
    {
      id: '2',
      name: 'City General Hospital',
      type: 'hospital',
      address: '456 Health Ave, Medical District',
      phone: '555-0123',
      distance: 1.2,
      isOpen24h: true
    },
    {
      id: '3',
      name: 'Central Fire Department',
      type: 'fire',
      address: '789 Fire Lane, Safety Zone',
      phone: '911',
      distance: 0.8,
      isOpen24h: true
    },
    {
      id: '4',
      name: 'Lincoln Elementary School',
      type: 'school',
      address: '321 School Road, Education District',
      phone: '555-0456',
      distance: 0.3,
      isOpen24h: false
    },
    {
      id: '5',
      name: 'Community Center',
      type: 'community',
      address: '654 Community Blvd, Neighborhood',
      phone: '555-0789',
      distance: 0.7,
      isOpen24h: false
    }
  ];

  // Initialize mock data
  React.useEffect(() => {
    setSafeLocations(mockSafeLocations);
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      // For now, show a placeholder message
      Alert.alert(
        'Location Feature',
        'Location services will be enabled in the next update. For now, showing nearby safe places based on common locations.',
        [{ text: 'OK' }]
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Unable to get your current location.');
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'police': return { name: 'shield-checkmark', color: '#3B82F6' };
      case 'hospital': return { name: 'medical', color: '#EF4444' };
      case 'fire': return { name: 'flame', color: '#F59E0B' };
      case 'school': return { name: 'school', color: '#10B981' };
      case 'community': return { name: 'people', color: '#8B5CF6' };
      default: return { name: 'location', color: '#6B7280' };
    }
  };

  const callLocation = (phone: string, name: string) => {
    Alert.alert(
      'Call Location',
      `Do you want to call ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${phone}`) }
      ]
    );
  };

  const getDirections = (address: string, name: string) => {
    Alert.alert(
      'Get Directions',
      `Open directions to ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Maps', 
          onPress: () => {
            const encodedAddress = encodeURIComponent(address);
            Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
          }
        }
      ]
    );
  };

  const addCustomLocation = () => {
    Alert.alert(
      'Add Custom Location',
      'This feature will allow you to add your own trusted safe locations like family homes, trusted businesses, or meeting points.',
      [{ text: 'OK' }]
    );
  };

  const shareLocation = () => {
    Alert.alert(
      'Share Your Location',
      'This feature will allow you to share your current location with trusted contacts in case of emergency.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Safety Locations</Text>
          <Text style={styles.subtitle}>Find nearby safe places and emergency services</Text>
        </View>

        {/* Emergency Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emergency Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
              onPress={() => callLocation('911', 'Emergency Services')}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text style={styles.actionButtonText}>Call 911</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
              onPress={shareLocation}
            >
              <Ionicons name="share" size={20} color="white" />
              <Text style={styles.actionButtonText}>Share Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Location */}
        <View style={styles.card}>
          <View style={styles.locationHeader}>
            <Text style={styles.cardTitle}>Your Location</Text>
            <TouchableOpacity onPress={getCurrentLocation} disabled={loading}>
              <Ionicons 
                name="refresh" 
                size={24} 
                color={loading ? "#9CA3AF" : "#3B82F6"} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.currentLocationBox}>
            <MaterialIcons name="my-location" size={24} color="#10B981" />
            <Text style={styles.currentLocationText}>
              Location services will be enabled soon. Showing nearby safe places.
            </Text>
          </View>
        </View>

        {/* Safe Locations List */}
        <View style={styles.card}>
          <View style={styles.locationHeader}>
            <Text style={styles.cardTitle}>Nearby Safe Places</Text>
            <TouchableOpacity onPress={addCustomLocation}>
              <Ionicons name="add" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationsList}>
            {safeLocations.map((location) => {
              const icon = getLocationIcon(location.type);
              return (
                <View key={location.id} style={styles.locationItem}>
                  <View style={styles.locationInfo}>
                    <View style={styles.locationHeader}>
                      <Ionicons name={icon.name as any} size={24} color={icon.color} />
                      <View style={styles.locationDetails}>
                        <Text style={styles.locationName}>{location.name}</Text>
                        <Text style={styles.locationType}>
                          {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                          {location.isOpen24h && ' • Open 24/7'}
                        </Text>
                      </View>
                      {location.distance && (
                        <Text style={styles.distance}>{location.distance} mi</Text>
                      )}
                    </View>
                    <Text style={styles.address}>{location.address}</Text>
                  </View>
                  
                  <View style={styles.locationActions}>
                    {location.phone && (
                      <TouchableOpacity 
                        style={styles.smallButton}
                        onPress={() => callLocation(location.phone!, location.name)}
                      >
                        <Ionicons name="call" size={16} color="#3B82F6" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={styles.smallButton}
                      onPress={() => getDirections(location.address, location.name)}
                    >
                      <Ionicons name="navigate" size={16} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Safety Tips */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tip}>
              <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
              <Text style={styles.tipText}>Always tell someone where you're going</Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="phone" size={20} color="#F59E0B" />
              <Text style={styles.tipText}>Keep emergency contacts easily accessible</Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="group" size={20} color="#F59E0B" />
              <Text style={styles.tipText}>Stay in well-lit, populated areas</Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="speed" size={20} color="#F59E0B" />
              <Text style={styles.tipText}>Trust your instincts and leave if something feels wrong</Text>
            </View>
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
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currentLocationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  currentLocationText: {
    color: '#166534',
    fontSize: 14,
    flex: 1,
  },
  locationsList: {
    gap: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  locationInfo: {
    flex: 1,
  },
  locationDetails: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationType: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginLeft: 36,
  },
  distance: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  locationActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  smallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsList: {
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});