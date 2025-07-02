import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// Props: activeTab (string), onTabPress (function)
const tabs = [
  {
    key: 'home',
    icon: (color: string) => <Feather name="home" size={27} color={color} />,
  },
  {
    key: 'search',
    icon: (color: string) => <Feather name="search" size={27} color={color} />,
  },
  {
    key: 'add',
    icon: (color: string) => <Feather name="plus-square" size={29} color={color} />,
  },
  {
    key: 'tagihan',
    icon: (color: string) => <MaterialCommunityIcons name="file-document-outline" size={27} color={color} />,
  },
  {
    key: 'profil',
    icon: (color: string) => <Feather name="user" size={27} color={color} />,
  },
];

import { useRouter } from 'expo-router';

const BottomNavigation = ({ activeTab, onTabPress }: {
  activeTab: string,
  onTabPress?: (tabKey: string) => void,
}) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={() => {
              if (onTabPress) {
                onTabPress(tab.key);
              } else {
                // Default routing logic
                if (tab.key === 'home') {
                  router.push('/home');
                } else if (tab.key === 'tagihan') {
                  router.push('/tagihan');
                } else if (tab.key === 'profil') {
                  // router.push('/profil');
                } else {
                  alert('Navigasi ke halaman "' + tab.key + '" belum diimplementasikan.');
                }
              }
            }}
          >
            {tab.icon(isActive ? '#388e3c' : '#888')}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 56,
    paddingBottom: Platform.OS === 'ios' ? 18 : 0,
    borderTopWidth: 0.7,
    borderTopColor: '#ececec',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
});

export default BottomNavigation;
