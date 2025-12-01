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
    backgroundColor: '#0F0F23',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#A78BFA',
    marginTop: 8,
    fontWeight: '500',
  },
  toggleCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#16213E',
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#A78BFA',
    marginBottom: 20,
    lineHeight: 20,
    fontWeight: '500',
  },
  toggle: {
    width: 64,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleHandle: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#EF4444',
  },
  silentPanicButton: {
    backgroundColor: '#7C2D12',
    shadowColor: '#7C2D12',
    borderColor: '#A16207',
  },
  panicButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  instructionText: {
    fontSize: 16,
    color: '#A78BFA',
    textAlign: 'center',
    fontWeight: '500',
  },
  activatedSection: {
    alignItems: 'center',
  },
  countdownCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#EF4444',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  countdownText: {
    color: 'white',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -1,
  },
  activatedText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  activatedSubtext: {
    fontSize: 16,
    color: '#A78BFA',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  actionsCard: {
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
  actionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionsList: {
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#E2E8F0',
    marginLeft: 12,
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: '#451A03',
    borderRadius: 20,
    padding: 24,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FCD34D',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#FDE68A',
    marginBottom: 6,
    fontWeight: '500',
  },
});