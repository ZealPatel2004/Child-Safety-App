

function WelcomeCard({ onContinue }: { onContinue: () => void }) {
  return (
    <View style={welcomeStyles.cardContainer}>
      <View style={welcomeStyles.iconCircle}>
        <Ionicons name="rocket" size={48} color="#fff" />
      </View>
      <Text style={welcomeStyles.welcomeTitle}>Welcome to Apple Games</Text>
      <View style={welcomeStyles.featureRow}>
        <Ionicons name="star" size={24} color="#F87171" style={welcomeStyles.featureIcon} />
        <View style={welcomeStyles.featureTextBlock}>
          <Text style={welcomeStyles.featureTitle}>See What’s New, Just for You</Text>
          <Text style={welcomeStyles.featureDesc}>Explore what is happening in your games and what to play next.</Text>
        </View>
      </View>
      <View style={welcomeStyles.featureRow}>
        <Ionicons name="people" size={24} color="#F87171" style={welcomeStyles.featureIcon} />
        <View style={welcomeStyles.featureTextBlock}>
          <Text style={welcomeStyles.featureTitle}>Play and Compete With Friends</Text>
          <Text style={welcomeStyles.featureDesc}>Challenge friends, see what they are playing and play together.</Text>
        </View>
      </View>
      <View style={welcomeStyles.featureRow}>
        <Ionicons name="apps" size={24} color="#F87171" style={welcomeStyles.featureIcon} />
        <View style={welcomeStyles.featureTextBlock}>
          <Text style={welcomeStyles.featureTitle}>All Your Games in One Place</Text>
          <Text style={welcomeStyles.featureDesc}>Access your full game library from the App Store and Apple Arcade.</Text>
        </View>
      </View>
      <View style={welcomeStyles.infoRow}>
        <Ionicons name="people" size={18} color="#F87171" style={{ marginRight: 6 }} />
        <Text style={welcomeStyles.infoText}>
          Your gameplay information, including what you play and your game activity, is used to improve Game Center. Your nickname, avatar, Arcade subscription status, scores, and other activity information you choose to share are visible to Game Center users. <Text style={welcomeStyles.infoLink}>See how your data is managed…</Text>
        </Text>
      </View>
      <TouchableOpacity style={welcomeStyles.continueButton} onPress={onContinue}>
        <Text style={welcomeStyles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const welcomeStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#232325',
    borderRadius: 32,
    padding: 28,
    margin: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  iconCircle: {
    backgroundColor: '#F87171',
    borderRadius: 20,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  welcomeTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 18,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
  },
  featureIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  featureTextBlock: {
    flex: 1,
  },
  featureTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  featureDesc: {
    color: '#D1D5DB',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 18,
    width: '100%',
  },
  infoText: {
    color: '#A1A1AA',
    fontSize: 11,
    flex: 1,
  },
  infoLink: {
    color: '#F87171',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#F87171',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
  // ...existing code...
import React, { useState } from 'react';
import { addChildProfile } from '../../addChildProfile';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AddChildScreen() {
    const handleAddChild = async () => {
      if (!childName?.trim()) return alert("Please enter the child's full name");
      if (!childAge || isNaN(Number(childAge))) return alert("Please enter a valid age");

      try {
        await addChildProfile({
          fullName: childName,
          age: Number(childAge),
          physicalDescription: childDescription,
          emergencyContactPhone: emergencyContact,
          features: {
            locationTrackingEnabled,
            emergencyAlertsEnabled,
            shareWithAuthorities,
          },
        });

        alert("Child profile saved!");
        // optional: clear form or navigate
      } catch (e: any) {
        alert(e?.message ?? "Failed to save child profile");
      }
    };
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childDescription, setChildDescription] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [childPhoto, setChildPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setChildPhoto(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setChildPhoto(result.assets[0].uri);
    }
  };

  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);
  const [shareWithAuthorities, setShareWithAuthorities] = useState(false);

  const handleSaveChild = async () => {
    if (!childName || !childAge) {
      Alert.alert('Error', 'Please fill in at least the name and age');
      return;
    }
    try {
      const id = await addChildProfile({
        fullName: childName,
        age: Number(childAge),
        physicalDescription: childDescription,
        emergencyContactPhone: emergencyContact,
        features: {
          locationTrackingEnabled,
          emergencyAlertsEnabled,
          shareWithAuthorities,
        },
      });
      Alert.alert(
        'Success',
        `Child profile for ${childName} has been saved successfully!`,
        [{ text: 'OK', onPress: () => clearForm() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save child profile');
    }
  };

  const clearForm = () => {
    setChildName('');
    setChildAge('');
    setChildDescription('');
    setEmergencyContact('');
    setChildPhoto(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={styles.header}>
          <Text style={styles.title}>
            Add Child Profile
          </Text>
          <Text style={styles.subtitle}>
            Keep your child's information safe
          </Text>
        </View>


        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              {childPhoto ? (
                <Image source={{ uri: childPhoto }} style={styles.photoImage} />
              ) : (
                <MaterialIcons name="child-care" size={60} color="#3B82F6" />
              )}
            </View>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonText}>
                {childPhoto ? 'Change Photo' : 'Add Photo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Child Information</Text>
          
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                value={childName}
                onChangeText={setChildName}
                placeholder="Enter child's full name"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                value={childAge}
                onChangeText={setChildAge}
                placeholder="Enter age"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Physical Description</Text>
              <TextInput
                value={childDescription}
                onChangeText={setChildDescription}
                placeholder="Height, weight, hair color, eye color, etc."
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Emergency Contact</Text>
              <TextInput
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="Emergency contact phone number"
                keyboardType="phone-pad"
                style={styles.input}
              />
              <View style={styles.addContactIconRow}>
                <TouchableOpacity style={styles.addContactButton}>
                  <Ionicons name="add" size={28} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety Features</Text>
          
          <View style={styles.safetySection}>
            <TouchableOpacity style={styles.safetyItem}>
              <View style={styles.safetyContent}>
                <MaterialIcons name="location-on" size={24} color="#EF4444" />
                <Text style={styles.safetyText}>Enable Location Tracking</Text>
                <View style={[styles.toggleOn, styles.toggleContainer]}>
                  <View style={styles.toggleIndicator} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.safetyItem}>
              <View style={styles.safetyContent}>
                <MaterialIcons name="notifications" size={24} color="#F59E0B" />
                <Text style={styles.safetyText}>Emergency Alerts</Text>
                <View style={[styles.toggleOn, styles.toggleContainer]}>
                  <View style={styles.toggleIndicator} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.safetyItem}>
              <View style={styles.safetyContent}>
                <MaterialIcons name="share" size={24} color="#10B981" />
                <Text style={styles.safetyText}>Share with Authorities</Text>
                <View style={[styles.toggleOff, styles.toggleContainer]}>
                  <View style={styles.toggleIndicatorOff} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={handleAddChild}
            style={styles.saveButton}
          >
            <View style={styles.buttonContent}>
              <MaterialIcons name="child-care" size={24} color="white" />
              <Text style={styles.saveButtonText}>Add Child</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={clearForm}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear Form</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.noticeCard}>
          <View style={styles.noticeContent}>
            <MaterialIcons name="warning" size={24} color="#F59E0B" />
            <View style={styles.noticeText}>
              <Text style={styles.noticeTitle}>Important Notice</Text>
              <Text style={styles.noticeBody}>
                This information is stored securely on your device and can be shared with authorities in case of emergency. Keep this information updated for maximum safety.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
      addContactIconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
      },
    emergencyContactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    addContactButton: {
      marginLeft: 8,
      backgroundColor: '#E0E7FF',
      borderRadius: 16,
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
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
    marginBottom: 30,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 140,
    height: 140,
    backgroundColor: '#3730A3',
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#5B21B6',
    shadowColor: '#3730A3',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  photoButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#7C3AED',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  photoButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    color: '#E2E8F0',
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#0F1419',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    height: 100,
  },
  safetySection: {
    gap: 16,
  },
  // ...existing code...
  safetyItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  safetyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  safetyText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  toggleOn: {
    width: 52,
    height: 28,
    backgroundColor: '#10B981',
    borderRadius: 14,
    justifyContent: 'center',
    paddingRight: 2,
  },
  toggleContainer: {
    minWidth: 56,
    alignItems: 'flex-end',
    marginLeft: 12,
    paddingRight: 2,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleOff: {
    width: 52,
    height: 28,
    backgroundColor: '#374151',
    borderRadius: 14,
    justifyContent: 'center',
    paddingLeft: 2,
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleIndicatorOff: {
    width: 24,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    marginBottom: 32,
    gap: 16,
  },
  saveButton: {
    backgroundColor: '#DC2626',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  clearButton: {
    backgroundColor: '#374151',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  clearButtonText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  noticeCard: {
    backgroundColor: '#451A03',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 18,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#F59E0B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeText: {
    marginLeft: 12,
    flex: 1,
  },
  noticeTitle: {
    color: '#FCD34D',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  noticeBody: {
    color: '#FDE68A',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
