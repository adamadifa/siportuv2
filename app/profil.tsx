import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import BottomNavigation from './BottomNavigation';

export default function ProfilScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('👤 PROFIL SCREEN: Component mounted and rendered');

    const loadUserInfo = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          setUserInfo(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();

    return () => {
      console.log('👤 PROFIL SCREEN: Component unmounted');
    };
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ActivityIndicator size="large" color="#388e3c" style={{ flex: 1 }} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* Header dengan background hijau */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/home')}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profil</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Feather name="user" size={40} color="#388e3c" />
                </View>
              </View>
              <Text style={styles.profileName}>
                {userInfo?.name || 'Nama Pengguna'}
              </Text>
              <Text style={styles.profileEmail}>
                {userInfo?.email || 'email@example.com'}
              </Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Feather name="user" size={20} color="#388e3c" />
                </View>
                <Text style={styles.menuText}>Edit Profil</Text>
                <Feather name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/ubah-password')}>
                <View style={styles.menuIcon}>
                  <Feather name="lock" size={20} color="#388e3c" />
                </View>
                <Text style={styles.menuText}>Ubah Password</Text>
                <Feather name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Feather name="bell" size={20} color="#388e3c" />
                </View>
                <Text style={styles.menuText}>Notifikasi</Text>
                <Feather name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Feather name="help-circle" size={20} color="#388e3c" />
                </View>
                <Text style={styles.menuText}>Bantuan</Text>
                <Feather name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Feather name="info" size={20} color="#388e3c" />
                </View>
                <Text style={styles.menuText}>Tentang Aplikasi</Text>
                <Feather name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <View style={styles.logoutSection}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Feather name="log-out" size={20} color="#e53935" />
                <Text style={styles.logoutText}>Keluar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <BottomNavigation activeTab="profil" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#14532d', // Background hijau untuk status bar area
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50, // Extra padding untuk status bar
    backgroundColor: '#14532d', // Background hijau seperti card siswa
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Warna putih untuk kontras dengan background hijau
    flex: 1,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f3ea',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#388e3c',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18492b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f3ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#18492b',
    fontWeight: '500',
  },
  logoutSection: {
    marginHorizontal: 16,
    marginBottom: 80, // Space for bottom navigation
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    color: '#e53935',
    fontWeight: '600',
    marginLeft: 8,
  },
});
