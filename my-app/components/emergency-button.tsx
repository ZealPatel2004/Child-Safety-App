import React from 'react';
import { TouchableOpacity, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

interface EmergencyButtonProps {
  title: string;
  subtitle?: string;
  phoneNumber: string;
  backgroundColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  title,
  subtitle,
  phoneNumber,
  backgroundColor,
  iconName,
  iconSize = 32,
}) => {
  const handlePress = () => {
    Alert.alert(
      "Emergency Call",
      `Are you sure you want to call ${title}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL(`tel:${phoneNumber}`) }
      ]
    );
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className={`rounded-2xl p-6 mb-6 shadow-lg`}
      style={{ backgroundColor, elevation: 4 }}
    >
      <View className="flex-row items-center justify-center">
        <Ionicons name={iconName} size={iconSize} color="white" />
        <Text className="text-white text-2xl font-bold ml-3">{title}</Text>
      </View>
      {subtitle && (
        <Text className="text-white text-center mt-2 opacity-90">
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
};