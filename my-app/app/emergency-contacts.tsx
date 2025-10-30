import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Linking, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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
              }, index * 2000); // 2 second delay between calls
            });
          },
          style: 'destructive'
        }
      ]
    );
  };

  const shareLocation = () => {
    Alert.alert(
      'Share Location',
      'This feature will share your current location with all emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => {
            // In a real app, this would get actual location and send it
            const message = "EMERGENCY: I need help! Here is my location: [Location will be shared automatically] - Child Safety App";
            contacts.forEach(contact => {
              Linking.openURL(`sms:${contact.phone}?body=${encodeURIComponent(message)}`);
            });
          }
        }
      ]
    );
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    };

    setContacts([...contacts, contact]);
    setNewContact({
      name: '',
      phone: '',
      relationship: '',
      isPrimary: false,
      isAvailable24h: false
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Emergency contact added successfully!');
  };

  const deleteContact = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setContacts(contacts.filter(c => c.id !== id))
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Contacts</Text>
          <Text style={styles.subtitle}>Quick access to people who can help you</Text>
        </View>

        {/* Emergency Actions */}
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
              style={[styles.emergencyButton, { backgroundColor: '#F97316' }]}
              onPress={shareLocation}
            >
              <Ionicons name="location" size={24} color="white" />
              <Text style={styles.emergencyButtonText}>Share Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Contacts */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Primary Contacts</Text>
          <Text style={styles.cardSubtitle}>These contacts will be called first in emergencies</Text>
          
          {contacts.filter(c => c.isPrimary).map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <View style={styles.contactHeader}>
                  <Text style={styles.contactName}>{contact.name}</Text>
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
                <Text style={styles.contactDetails}>{contact.relationship} • {contact.phone}</Text>
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

        {/* Other Contacts */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Other Emergency Contacts</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          {contacts.filter(c => !c.isPrimary).map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <View style={styles.contactHeader}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  {contact.isAvailable24h && (
                    <View style={[styles.badge, { backgroundColor: '#10B981' }]}>
                      <Text style={styles.badgeText}>24/7</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.contactDetails}>{contact.relationship} • {contact.phone}</Text>
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

        {/* Safety Tips */}
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

      {/* Add Contact Modal */}
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
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  emergencyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    color: '#1F2937',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  contactDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
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
    color: '#374151',
  },
  addContactButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addContactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});