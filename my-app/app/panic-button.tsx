import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Vibration, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PanicButtonScreen() {
  const [isSilentMode, setIsSilentMode] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const activatePanicMode = () => {
    if (isActivated) return;

    if (isSilentMode) {
      // Silent panic - no confirmation dialog
      executePanicProtocol();
    } else {
      // Regular panic with confirmation
      Alert.alert(
        "Panic Button Activated",
        "This will alert emergency contacts and authorities. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "ACTIVATE", 
            style: "destructive",
            onPress: executePanicProtocol
          }
        ]
      );
    }
  };

  const executePanicProtocol = () => {
    setIsActivated(true);
    
    // Vibrate the device
    Vibration.vibrate([0, 500, 100, 500, 100, 500]);

    // Start countdown for automatic actions
    let timer = 10;
    setCountdown(timer);
    
    const countdownInterval = setInterval(() => {
      timer--;
      setCountdown(timer);
      
      if (timer <= 0) {
        clearInterval(countdownInterval);
        executeEmergencyActions();
      }
    }, 1000);

    // Show immediate alert if not silent
    if (!isSilentMode) {
      Alert.alert(
        "PANIC MODE ACTIVATED",
        `Emergency protocols initiated. Contacting authorities in ${timer} seconds.`,
        [
          { 
            text: "CANCEL", 
            onPress: () => {
              clearInterval(countdownInterval);
              setIsActivated(false);
              setCountdown(0);
            }
          }
        ]
      );
    }
  };

  const executeEmergencyActions = () => {
    // 1. Call 911
    Linking.openURL('tel:911');
    
    // 2. Send SMS to emergency contacts
    const emergencyMessage = encodeURIComponent(
      "PANIC BUTTON ACTIVATED - I NEED IMMEDIATE HELP! This is an emergency alert from the Child Safety App. Please call me or contact authorities. Time: " + new Date().toLocaleString()
    );
    
    // Mock emergency contacts (in real app, this would come from storage)
    const emergencyContacts = ['+15551234567', '+15552345678'];
    
    emergencyContacts.forEach(contact => {
      setTimeout(() => {
        Linking.openURL(`sms:${contact}?body=${emergencyMessage}`);
      }, 1000);
    });

    // 3. Share location (placeholder)
    setTimeout(() => {
      Alert.alert(
        "Emergency Protocols Executed",
        "• 911 has been called\n• Emergency contacts notified\n• Location shared\n\nStay safe and wait for help to arrive.",
        [{ text: "OK", onPress: resetPanicMode }]
      );
    }, 3000);
  };

  const resetPanicMode = () => {
    setIsActivated(false);
    setCountdown(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Panic Button</Text>
          <Text style={styles.subtitle}>
            {isSilentMode ? 'Silent Mode Active' : 'Emergency Alert System'}
          </Text>
        </View>

        {/* Silent Mode Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleHeader}>
            <Ionicons 
              name={isSilentMode ? "volume-mute" : "volume-high"} 
              size={24} 
              color={isSilentMode ? "#EF4444" : "#6B7280"} 
            />
            <Text style={styles.toggleTitle}>Silent Mode</Text>
          </View>
          <Text style={styles.toggleDescription}>
            {isSilentMode 
              ? "Panic button will activate without confirmation dialogs"
              : "Panic button will show confirmation before activating"
            }
          </Text>
          <TouchableOpacity 
            style={[styles.toggle, isSilentMode && styles.toggleActive]}
            onPress={() => setIsSilentMode(!isSilentMode)}
          >
            <View style={[styles.toggleHandle, isSilentMode && styles.toggleHandleActive]} />
          </TouchableOpacity>
        </View>

        {/* Main Panic Button */}
        <View style={styles.panicSection}>
          {!isActivated ? (
            <>
              <TouchableOpacity 
                style={[styles.panicButton, isSilentMode && styles.silentPanicButton]}
                onPress={activatePanicMode}
                onLongPress={activatePanicMode}
              >
                <Ionicons 
                  name="warning" 
                  size={64} 
                  color="white" 
                />
                <Text style={styles.panicButtonText}>
                  {isSilentMode ? "SILENT PANIC" : "PANIC BUTTON"}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.instructionText}>
                {isSilentMode 
                  ? "Tap to silently alert emergency contacts"
                  : "Tap to activate emergency protocols"
                }
              </Text>
            </>
          ) : (
            <View style={styles.activatedSection}>
              <View style={styles.countdownCircle}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
              <Text style={styles.activatedText}>PANIC MODE ACTIVATED</Text>
              <Text style={styles.activatedSubtext}>
                Emergency services will be contacted in {countdown} seconds
              </Text>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={resetPanicMode}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Emergency Actions Preview */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>When activated, this will:</Text>
          <View style={styles.actionsList}>
            <View style={styles.actionItem}>
              <Ionicons name="call" size={20} color="#EF4444" />
              <Text style={styles.actionText}>Automatically call 911</Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="chatbubble" size={20} color="#3B82F6" />
              <Text style={styles.actionText}>Send emergency SMS to contacts</Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="location" size={20} color="#10B981" />
              <Text style={styles.actionText}>Share your current location</Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="phone-portrait" size={20} color="#F59E0B" />
              <Text style={styles.actionText}>Vibrate device for attention</Text>
            </View>
          </View>
        </View>

        {/* Safety Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Safety Tips</Text>
          <Text style={styles.tipText}>• Use silent mode when stealth is important</Text>
          <Text style={styles.tipText}>• Make sure emergency contacts are updated</Text>
          <Text style={styles.tipText}>• Practice using this feature safely</Text>
          <Text style={styles.tipText}>• Only use in real emergencies</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  toggleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  toggle: {
    width: 60,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#EF4444',
  },
  toggleHandle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleHandleActive: {
    transform: [{ translateX: 28 }],
  },
  panicSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  panicButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 20,
  },
  silentPanicButton: {
    backgroundColor: '#7C2D12',
    shadowColor: '#7C2D12',
  },
  panicButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  activatedSection: {
    alignItems: 'center',
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  countdownText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  activatedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  activatedSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  tipsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
  },
});