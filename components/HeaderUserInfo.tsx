// components/HeaderUserInfo.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, Text } from 'react-native-paper';

export default function HeaderUserInfo() {
  return (
    <View style={styles.header}>
      <Avatar.Icon size={48} icon="account" />
      <View style={{ flex: 1 }}>
        <Text variant="titleMedium">Olá, Isael 👋</Text>
        <Text variant="bodySmall">Último acesso hoje às 14:32</Text>
      </View>
      <IconButton icon="bell-outline" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
});
