import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AddChildScreen() {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childDescription, setChildDescription] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [childPhoto, setChildPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    // Show action sheet for camera or gallery
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

  const handleSaveChild = () => {
    if (!childName || !childAge) {
      Alert.alert('Error', 'Please fill in at least the name and age');
      return;
    }
    
    Alert.alert(
      'Success',
      `Child profile for ${childName} has been saved successfully!`,
      [{ text: 'OK', onPress: () => clearForm() }]
    );
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Add Child Profile
          </Text>
          <Text style={styles.subtitle}>
            Keep your child's information safe
          </Text>
        </View>

        {/* Child Avatar Section */}
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

        {/* Child Information Form */}
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
            </View>
          </View>
        </View>

        {/* Safety Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety Features</Text>
          
          <View style={styles.safetySection}>
            <TouchableOpacity style={styles.safetyItem}>
              <View style={styles.safetyContent}>
                <MaterialIcons name="location-on" size={24} color="#EF4444" />
                <Text style={styles.safetyText}>Enable Location Tracking</Text>
              </View>
              <View style={styles.toggleOn}>
                <View style={styles.toggleIndicator} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.safetyItem}>
              <View style={styles.safetyContent}>
                <MaterialIcons name="notifications" size={24} color="#F59E0B" />
                <Text style={styles.safetyText}>Emergency Alerts</Text>
              </View>
              <View style={styles.toggleOn}>
                <View style={styles.toggleIndicator} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.safetyItem}>
              <View style={styles.safetyContent}>
                <MaterialIcons name="share" size={24} color="#10B981" />
                <Text style={styles.safetyText}>Share with Authorities</Text>
              </View>
              <View style={styles.toggleOff}>
                <View style={styles.toggleIndicatorOff} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={handleSaveChild}
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

        {/* Important Notice */}
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
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 128,
    height: 128,
    backgroundColor: '#DBEAFE',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  photoButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  photoButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 64,
  },
  formSection: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#1F2937',
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  safetySection: {
    gap: 12,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  safetyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyText: {
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 12,
  },
  toggleOn: {
    width: 48,
    height: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    justifyContent: 'center',
    paddingRight: 2,
  },
  toggleOff: {
    width: 48,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    justifyContent: 'center',
    paddingLeft: 2,
  },
  toggleIndicator: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  toggleIndicatorOff: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    marginBottom: 32,
    gap: 16,
  },
  saveButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  clearButton: {
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
  },
  clearButtonText: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  noticeCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
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
    color: '#92400E',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  noticeBody: {
    color: '#B45309',
    fontSize: 14,
    lineHeight: 20,
  },
});
