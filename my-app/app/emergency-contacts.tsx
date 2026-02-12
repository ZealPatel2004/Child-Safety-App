import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Linking, TextInput, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, setDoc } from 'firebase/firestore';
import app from '../firebaseConfig'; 

const formatTimestamp = (value: Date | null) => {
  if (!value) {
    return 'Never';
  }
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  const year = value.getFullYear();
  let hours = value.getHours();
  const minutes = `${value.getMinutes()}`.padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${month}/${day}/${year} ${hours}:${minutes} ${suffix}`;
};

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  isAvailable24h: boolean;
}

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Mom - Sarah Johnson',
      phone: '+1 (555) 123-4567',
      relationship: 'Mother',
      isPrimary: true,
      isAvailable24h: true
    },
    {
      id: '2',
      name: 'Dad - Michael Johnson',
      phone: '+1 (555) 234-5678',
      relationship: 'Father',
      isPrimary: true,
      isAvailable24h: true
    },
    {
      id: '3',
      name: 'Grandma - Betty Johnson',
      phone: '+1 (555) 345-6789',
      relationship: 'Grandmother',
      isPrimary: false,
      isAvailable24h: false
    },
    {
      id: '4',
      name: 'Uncle Tom',
      phone: '+1 (555) 456-7890',
      relationship: 'Uncle',
      isPrimary: false,
      isAvailable24h: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false,
    isAvailable24h: false
  });
  const [addMode, setAddMode] = useState<'primary' | 'other'>('other');
  const [lastSharedAt, setLastSharedAt] = useState<Date | null>(null);
  const [isSharingActive, setIsSharingActive] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const uid = "vTwT83nEaWgUkESyAFpC0sBIkM33"; 
  const db = getFirestore(app);
  const lastSharedLabel = React.useMemo(() => formatTimestamp(lastSharedAt), [lastSharedAt]);

  
  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        const q = query(collection(db, 'contacts'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        const loadedContacts = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || '',
            phone: data.phone || '',
            relationship: data.relationship || '',
            isPrimary: data.isPrimary || false,
            isAvailable24h: data.isAvailable24h || false,
          };
        });
        setContacts(loadedContacts);
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const callContact = (contact: EmergencyContact) => {
    Alert.alert(
      'Call Emergency Contact',
      `Do you want to call ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => Linking.openURL(`tel:${contact.phone}`),
          style: 'default'
        }
      ]
    );
  };

  const sendMessage = (contact: EmergencyContact) => {
    Alert.alert(
      'Send Emergency Message',
      `Send "I need help! Please call me." to ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send SMS', 
          onPress: () => Linking.openURL(`sms:${contact.phone}?body=I need help! Please call me. This is an emergency message from the Child Safety App.`),
          style: 'default'
        }
      ]
    );
  };

  const callAllPrimary = () => {
    const primaryContacts = contacts.filter(c => c.isPrimary);
    if (primaryContacts.length === 0) {
      Alert.alert('No Primary Contacts', 'Please add primary emergency contacts first.');
      return;
    }

    Alert.alert(
      'Call All Primary Contacts',
      `This will call all ${primaryContacts.length} primary contacts. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call All', 
          onPress: () => {
            primaryContacts.forEach((contact, index) => {
              setTimeout(() => {
                Linking.openURL(`tel:${contact.phone}`);
              }, index * 2000);
            });
          },
          style: 'destructive'
        }
      ]
    );
  };

  const shareLocation = async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    setShareError(null);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const message = 'Location permission is required to share your location.';
        setShareError(message);
        setIsSharingActive(false);
        Alert.alert('Permission Denied', message);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      const message = `EMERGENCY: I need help! Here is my location: ${mapsUrl} - Child Safety App`;

      contacts.filter(c => c.isPrimary).forEach(contact => {
        Linking.openURL(`sms:${contact.phone}?body=${encodeURIComponent(message)}`);
      });

      await setDoc(doc(db, 'shared_locations', uid), {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });

      setIsSharingActive(true);
      setLastSharedAt(new Date());
      setShareError(null);
    } catch (error) {
      console.error('Error sharing location:', error);
      setIsSharingActive(false);
      const fallbackMessage = 'Failed to share location. Please try again.';
      setShareError(fallbackMessage);
      Alert.alert('Error', 'Failed to share location to backend.');
    } finally {
      setIsRefreshing(false);
    }
  };
  const addContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    
    let isPrimary = newContact.isPrimary;
    
    if (
      newContact.isPrimary === false &&
      
      
      true
    ) {
      isPrimary = false;
    }

    const contact = {
      name: newContact.name || '',
      phone: newContact.phone || '',
      relationship: newContact.relationship || '',
      isPrimary: typeof isPrimary === 'boolean' ? isPrimary : false,
      isAvailable24h: typeof newContact.isAvailable24h === 'boolean' ? newContact.isAvailable24h : false,
      uid: uid || '',
    };

    try {
      const docRef = await addDoc(collection(db, 'contacts'), contact);
      setContacts([...contacts, { ...contact, id: docRef.id }]);
      setNewContact({
        name: '',
        phone: '',
        relationship: '',
        isPrimary: false,
        isAvailable24h: false
      });
      setShowAddModal(false);
      Alert.alert('Success', 'Emergency contact added successfully!');
    } catch (error) {
      console.error('Add contact error:', error);
      const errMsg = (error && (error as any).message) ? (error as any).message : 'Unknown error';
      Alert.alert('Error', 'Failed to add contact: ' + errMsg);
    }
  };

  const deleteContact = async (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'contacts', id));
              setContacts(contacts.filter(c => c.id !== id));
            } catch (error) {
              console.error('Delete contact error:', error);
              const errMsg = (error && (error as any).message) ? (error as any).message : 'Unknown error';
              Alert.alert('Error', 'Failed to delete contact: ' + errMsg);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Contacts</Text>
          <Text style={styles.subtitle}>Quick access to people who can help you</Text>
        </View>

        {shareError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="warning" size={20} color="#FBBF24" />
            <Text style={styles.errorText}>{shareError}</Text>
            <TouchableOpacity style={styles.errorDismiss} onPress={() => setShareError(null)}>
              <Ionicons name="close" size={18} color="#FBBF24" />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.statusHeaderRow}>
            <Text style={styles.cardTitle}>Location Sharing</Text>
            <View style={[styles.statusPill, isSharingActive ? styles.statusPillOn : styles.statusPillOff]}>
              <View style={[styles.statusDot, isSharingActive ? styles.statusDotOn : styles.statusDotOff]} />
              <Text style={styles.statusLabel}>{isSharingActive ? 'On' : 'Off'}</Text>
            </View>
          </View>
          <View style={styles.statusDetailsRow}>
            <Ionicons name="time-outline" size={18} color="#A78BFA" />
            <Text style={styles.statusDetailsText}>Last update: {lastSharedLabel}</Text>
          </View>
          <TouchableOpacity
            style={[styles.refreshButton, isRefreshing && styles.refreshButtonDisabled]}
            onPress={shareLocation}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
            )}
            <Text style={styles.refreshButtonText}>{isRefreshing ? 'Updating...' : 'Manual Refresh'}</Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emergency Actions</Text>
          <View style={styles.emergencyActions}>
            <TouchableOpacity 
              style={[styles.emergencyButton, { backgroundColor: '#EF4444' }]}
              onPress={callAllPrimary}
            >
              <Ionicons name="call" size={24} color="white" />
              <Text style={styles.emergencyButtonText}>Call All Primary</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.emergencyButton,
                { backgroundColor: '#F97316' },
                isRefreshing && styles.emergencyButtonDisabled,
              ]}
              onPress={shareLocation}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="location" size={24} color="white" />
              )}
              <Text style={styles.emergencyButtonText}>{isRefreshing ? 'Sending...' : 'Share Location'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={styles.card}>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Primary Contacts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setNewContact({
                  name: '',
                  phone: '',
                  relationship: '',
                  isPrimary: true,
                  isAvailable24h: false,
                });
                setAddMode('primary');
                setShowAddModal(true);
              }}
            >
              <Ionicons name="add" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardSubtitle}>
            These contacts will be called first in emergencies
          </Text>

          
          {contacts.filter(c => c.isPrimary).length === 0 ? (
            <Text style={{ color: '#94A3B8', marginTop: 8 }}>
              No primary contacts yet. Tap + to add one.
            </Text>
          ) : (
            contacts.filter(c => c.isPrimary).map((contact) => (
              <View key={contact.id} style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.contactName}>
                      {contact.name}
                      {contact.relationship ? (
                        <Text style={{ color: '#A78BFA', fontWeight: '400', fontSize: 15 }}>
                          {' '}({contact.relationship})
                        </Text>
                      ) : null}
                    </Text>
                    <View style={styles.badges}>
                      {contact.isAvailable24h && (
                        <View style={[styles.badge, { backgroundColor: '#10B981' }]}> 
                          <Text style={styles.badgeText}>24/7</Text>
                        </View>
                      )}
                      <View style={[styles.badge, { backgroundColor: '#3B82F6' }]}> 
                        <Text style={styles.badgeText}>PRIMARY</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.contactDetails}>{contact.phone}</Text>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                    onPress={() => callContact(contact)}
                  >
                    <Ionicons name="call" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                    onPress={() => sendMessage(contact)}
                  >
                    <Ionicons name="chatbubble" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => deleteContact(contact.id)}
                  >
                    <Ionicons name="trash" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Other Emergency Contacts</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                setNewContact({
                  name: '',
                  phone: '',
                  relationship: '',
                  isPrimary: false,
                  isAvailable24h: false,
                });
                setAddMode('other');
                setShowAddModal(true);
              }}
            >
              <Ionicons name="add" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          {contacts.filter(c => !c.isPrimary).map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <View style={styles.contactHeader}>
                  <Text style={styles.contactName}>
                    {contact.name}{contact.relationship ? ` (${contact.relationship})` : ''}
                  </Text>
                  {contact.isAvailable24h && (
                    <View style={[styles.badge, { backgroundColor: '#10B981' }]}>
                      <Text style={styles.badgeText}>24/7</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.contactDetails}>{contact.phone}</Text>
              </View>
              
              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                  onPress={() => callContact(contact)}
                >
                  <Ionicons name="call" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                  onPress={() => sendMessage(contact)}
                >
                  <Ionicons name="chatbubble" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                  onPress={() => deleteContact(contact.id)}
                >
                  <Ionicons name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emergency Contact Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tip}>
              <MaterialIcons name="phone" size={20} color="#3B82F6" />
              <Text style={styles.tipText}>Make sure your emergency contacts know they're listed</Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="update" size={20} color="#3B82F6" />
              <Text style={styles.tipText}>Keep contact information updated regularly</Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="people" size={20} color="#3B82F6" />
              <Text style={styles.tipText}>Have at least 2-3 emergency contacts available</Text>
            </View>
            <View style={styles.tip}>
              <MaterialIcons name="schedule" size={20} color="#3B82F6" />
              <Text style={styles.tipText}>Know which contacts are available 24/7</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                value={newContact.name}
                onChangeText={(text) => setNewContact({...newContact, name: text})}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 123-4567"
                value={newContact.phone}
                onChangeText={(text) => setNewContact({...newContact, phone: text})}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Relationship *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Mother, Father, Guardian, Teacher"
                value={newContact.relationship}
                onChangeText={(text) => setNewContact({...newContact, relationship: text})}
              />
            </View>

            <View style={styles.checkboxGroup}>

              {addMode === 'primary' && (
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setNewContact({...newContact, isPrimary: !newContact.isPrimary})}
                >
                  <Ionicons 
                    name={newContact.isPrimary ? "checkbox" : "square-outline"} 
                    size={24} 
                    color="#3B82F6" 
                  />
                  <Text style={styles.checkboxLabel}>Make this a primary contact</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setNewContact({...newContact, isAvailable24h: !newContact.isAvailable24h})}
              >
                <Ionicons 
                  name={newContact.isAvailable24h ? "checkbox" : "square-outline"} 
                  size={24} 
                  color="#3B82F6" 
                />
                <Text style={styles.checkboxLabel}>Available 24/7</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addContactButton} onPress={addContact}>
              <Text style={styles.addContactButtonText}>Add Emergency Contact</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#A78BFA',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#16213E',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#A78BFA',
    marginBottom: 20,
    fontWeight: '500',
  },
  emergencyActions: {
    flexDirection: 'row',
    gap: 16,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F1419',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  contactDetails: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F1419',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  tipsList: {
    gap: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#1A1A2E',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#0F1419',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  checkboxGroup: {
    marginBottom: 32,
    gap: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  addContactButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  addContactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  statusPillOn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  statusPillOff: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotOn: {
    backgroundColor: '#10B981',
  },
  statusDotOff: {
    backgroundColor: '#EF4444',
  },
  statusLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  statusDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statusDetailsText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#312E81',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: '#FECACA',
    fontSize: 13,
    fontWeight: '600',
  },
  errorDismiss: {
    padding: 4,
  },
  emergencyButtonDisabled: {
    opacity: 0.6,
  },
});