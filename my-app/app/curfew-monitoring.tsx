import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface CurfewRule {
  id: string;
  childName: string;
  dayOfWeek: string;
  curfewTime: string;
  enabled: boolean;
  autoAlert: boolean;
}

interface TimeAwayRecord {
  id: string;
  childName: string;
  leftHome: string;
  returnedHome: string | null;
  duration: string;
  status: 'away' | 'returned' | 'overdue';
  currentLocation?: string;
}

export default function CurfewMonitoringScreen() {
  const [curfewRules, setCurfewRules] = useState<CurfewRule[]>([
    { id: '1', childName: 'Emma', dayOfWeek: 'Weekdays', curfewTime: '8:00 PM', enabled: true, autoAlert: true },
    { id: '2', childName: 'Emma', dayOfWeek: 'Weekends', curfewTime: '10:00 PM', enabled: true, autoAlert: true },
    { id: '3', childName: 'Liam', dayOfWeek: 'Weekdays', curfewTime: '7:30 PM', enabled: true, autoAlert: true },
  ]);

  const [timeAwayRecords, setTimeAwayRecords] = useState<TimeAwayRecord[]>([
    {
      id: '1',
      childName: 'Emma',
      leftHome: '3:45 PM',
      returnedHome: null,
      duration: '2h 30m',
      status: 'away',
      currentLocation: 'Friend\'s House'
    },
    {
      id: '2',
      childName: 'Liam',
      leftHome: '4:15 PM',
      returnedHome: '6:00 PM',
      duration: '1h 45m',
      status: 'returned',
    },
    {
      id: '3',
      childName: 'Emma',
      leftHome: 'Yesterday 3:30 PM',
      returnedHome: 'Yesterday 7:45 PM',
      duration: '4h 15m',
      status: 'returned',
    },
  ]);

  const [todayStats, setTodayStats] = useState({
    totalTimeAway: '4h 15m',
    timesLeftHome: 3,
    averageTimeAway: '1h 25m',
    longestAbsence: '2h 30m',
  });

  const toggleCurfewRule = (id: string) => {
    setCurfewRules(curfewRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const toggleAutoAlert = (id: string) => {
    setCurfewRules(curfewRules.map(rule => 
      rule.id === id ? { ...rule, autoAlert: !rule.autoAlert } : rule
    ));
  };

  const handleAddCurfew = () => {
    Alert.alert('Add Curfew Rule', 'Feature to add new curfew rules coming soon!');
  };

  const handleEditCurfew = (rule: CurfewRule) => {
    Alert.alert(
      'Edit Curfew',
      `Modify curfew for ${rule.childName} on ${rule.dayOfWeek}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit Time', onPress: () => Alert.alert('Success', 'Time picker coming soon!') },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteCurfew(rule.id) },
      ]
    );
  };

  const handleDeleteCurfew = (id: string) => {
    setCurfewRules(curfewRules.filter(rule => rule.id !== id));
    Alert.alert('Deleted', 'Curfew rule removed successfully');
  };

  const handleViewLocation = (childName: string) => {
    Alert.alert(
      'Current Location',
      `${childName} is currently at Friend's House\n123 Oak Street\n\nWould you like to get directions?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Get Directions', onPress: () => Alert.alert('Opening Maps...') },
      ]
    );
  };

  const handleSendReminder = (childName: string) => {
    Alert.alert(
      'Send Reminder',
      `Send "Time to Come Home" notification to ${childName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => Alert.alert('Sent!', `Reminder sent to ${childName}`) 
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'away': return '#F59E0B';
      case 'returned': return '#10B981';
      case 'overdue': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'away': return 'time-outline';
      case 'returned': return 'checkmark-circle';
      case 'overdue': return 'warning';
      default: return 'information-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#A78BFA" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Curfew & Time Away</Text>
            <Text style={styles.subtitle}>Monitor time away from home</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Today's Statistics */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="analytics" size={24} color="#A78BFA" />
            <Text style={styles.cardTitle}>Today's Activity</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={28} color="#F59E0B" />
              <Text style={styles.statValue}>{todayStats.totalTimeAway}</Text>
              <Text style={styles.statLabel}>Total Time Away</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="exit-outline" size={28} color="#3B82F6" />
              <Text style={styles.statValue}>{todayStats.timesLeftHome}</Text>
              <Text style={styles.statLabel}>Times Left Home</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="speedometer-outline" size={28} color="#10B981" />
              <Text style={styles.statValue}>{todayStats.averageTimeAway}</Text>
              <Text style={styles.statLabel}>Average Duration</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="trending-up-outline" size={28} color="#8B5CF6" />
              <Text style={styles.statValue}>{todayStats.longestAbsence}</Text>
              <Text style={styles.statLabel}>Longest Absence</Text>
            </View>
          </View>
        </View>

        {/* Current Status */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="person-pin-circle" size={24} color="#F59E0B" />
            <Text style={styles.cardTitle}>Current Status</Text>
          </View>

          {timeAwayRecords.filter(record => record.status === 'away').map((record) => (
            <View key={record.id} style={styles.currentStatusItem}>
              <View style={styles.statusLeft}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(record.status) }]} />
                <View style={styles.statusInfo}>
                  <Text style={styles.childNameLarge}>{record.childName}</Text>
                  <Text style={styles.statusDetails}>
                    Left at {record.leftHome} • Away for {record.duration}
                  </Text>
                  {record.currentLocation && (
                    <View style={styles.locationBadge}>
                      <Ionicons name="location" size={12} color="#3B82F6" />
                      <Text style={styles.locationText}>{record.currentLocation}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.statusActions}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => handleViewLocation(record.childName)}
                >
                  <Ionicons name="navigate" size={20} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => handleSendReminder(record.childName)}
                >
                  <Ionicons name="notifications" size={20} color="#F59E0B" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Curfew Rules */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="schedule" size={24} color="#8B5CF6" />
              <Text style={styles.cardTitle}>Curfew Rules</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCurfew}>
              <Ionicons name="add" size={24} color="#A78BFA" />
            </TouchableOpacity>
          </View>

          <View style={styles.curfewList}>
            {curfewRules.map((rule) => (
              <TouchableOpacity 
                key={rule.id} 
                style={styles.curfewItem}
                onPress={() => handleEditCurfew(rule)}
              >
                <View style={styles.curfewLeft}>
                  <View style={styles.curfewIcon}>
                    <MaterialIcons name="child-care" size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.curfewInfo}>
                    <Text style={styles.curfewChild}>{rule.childName}</Text>
                    <Text style={styles.curfewDetails}>
                      {rule.dayOfWeek} • {rule.curfewTime}
                    </Text>
                    {rule.autoAlert && (
                      <View style={styles.alertBadge}>
                        <Ionicons name="notifications" size={10} color="#10B981" />
                        <Text style={styles.alertBadgeText}>Auto Alert</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Switch
                  value={rule.enabled}
                  onValueChange={() => toggleCurfewRule(rule.id)}
                  trackColor={{ false: '#374151', true: '#10B981' }}
                  thumbColor={rule.enabled ? '#fff' : '#D1D5DB'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Away History */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="history" size={24} color="#3B82F6" />
            <Text style={styles.cardTitle}>Recent Activity</Text>
          </View>

          <View style={styles.historyList}>
            {timeAwayRecords.map((record) => (
              <View key={record.id} style={styles.historyItem}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(record.status) }
                ]}>
                  <Ionicons 
                    name={getStatusIcon(record.status) as any} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </View>

                <View style={styles.historyInfo}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyChild}>{record.childName}</Text>
                    <Text style={styles.historyDuration}>{record.duration}</Text>
                  </View>
                  <Text style={styles.historyTime}>
                    Left: {record.leftHome}
                  </Text>
                  {record.returnedHome && (
                    <Text style={styles.historyTime}>
                      Returned: {record.returnedHome}
                    </Text>
                  )}
                  {record.currentLocation && (
                    <Text style={styles.historyLocation}>
                      📍 {record.currentLocation}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#7C3AED' }]}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <Text style={styles.quickActionText}>Send Reminder</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#3B82F6' }]}>
              <Ionicons name="location-outline" size={24} color="white" />
              <Text style={styles.quickActionText}>View Locations</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#10B981' }]}>
              <Ionicons name="stats-chart-outline" size={24} color="white" />
              <Text style={styles.quickActionText}>View Report</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickAction, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="settings-outline" size={24} color="white" />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={24} color="#FCD34D" />
            <Text style={styles.tipsTitle}>Monitoring Tips</Text>
          </View>
          <Text style={styles.tipText}>• Set different curfews for weekdays and weekends</Text>
          <Text style={styles.tipText}>• Enable auto-alerts to get notified before curfew</Text>
          <Text style={styles.tipText}>• Review weekly patterns to identify routine changes</Text>
          <Text style={styles.tipText}>• Use geofencing for automatic home detection</Text>
          <Text style={styles.tipText}>• Communicate curfew rules clearly with children</Text>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#16213E',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#A78BFA',
    marginTop: 4,
    fontWeight: '500',
  },
  placeholder: {
    width: 44,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F1419',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
  currentStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1419',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  childNameLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusDetails: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 12,
    color: '#93C5FD',
    marginLeft: 4,
    fontWeight: '600',
  },
  statusActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F0F23',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  curfewList: {
    gap: 12,
  },
  curfewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1419',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  curfewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  curfewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  curfewInfo: {
    flex: 1,
  },
  curfewChild: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  curfewDetails: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 6,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  alertBadgeText: {
    fontSize: 10,
    color: '#6EE7B7',
    marginLeft: 4,
    fontWeight: '700',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#0F1419',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyChild: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyDuration: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A78BFA',
  },
  historyTime: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 2,
  },
  historyLocation: {
    fontSize: 13,
    color: '#60A5FA',
    marginTop: 4,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  tipsCard: {
    backgroundColor: '#451A03',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FCD34D',
    marginLeft: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#FDE68A',
    marginBottom: 8,
    fontWeight: '500',
    lineHeight: 20,
  },
});
