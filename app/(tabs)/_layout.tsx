import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Layout } from '@/constants/Layout';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#1e90ff', // Ícones ativos em azul
        // // tabBarInactiveTintColor: '#87cefa', // Ícones inativos em azul claro
        // tabBarBackground: () => (
        //   <TabBarBackground style={styles.tabBarBackground} />
        // ),
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#ffffff', // Tab bar branca
          borderTopWidth: 0,
          // borderRadius: 20, // Bordas arredondadas
          // marginHorizontal: 10, // Margem para não encostar nas bordas
          // marginBottom: 10, // Margem inferior para flutuar
          height: 70, // Altura da tab bar
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5, // Sombra para Android
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tag.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Compras',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.circle" color={color} />,
        }}
      />


      <Tabs.Screen
        name="dispensa"
        options={{
          title: 'Dispensa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="refrigerator" color={color} />,
        }}
      />

  

    <Tabs.Screen
        name="consultas"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />,
        }}
      />

    </Tabs>
  );

  
}


const styles = StyleSheet.create({
  tabBarBackground: {
    backgroundColor: '#ffffff', // Fundo branco para a tab bar
    borderRadius: 20,
  },
  centralButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff', // Fundo branco para o botão central
    justifyContent: 'center',
    alignItems: 'center',
    top: -10, // Levanta o botão para se destacar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});


