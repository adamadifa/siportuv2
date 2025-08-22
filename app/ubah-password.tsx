import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { changePassword } from '../constants/api';
import BottomNavigation from './BottomNavigation';

export default function UbahPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!form.current_password.trim()) {
      newErrors.current_password = 'Password saat ini wajib diisi';
    }

    if (!form.new_password.trim()) {
      newErrors.new_password = 'Password baru wajib diisi';
    } else if (form.new_password.length < 6) {
      newErrors.new_password = 'Password baru minimal 6 karakter';
    }

    if (!form.new_password_confirmation.trim()) {
      newErrors.new_password_confirmation = 'Konfirmasi password wajib diisi';
    } else if (form.new_password !== form.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Token tidak ditemukan');
        return;
      }

      const data = await changePassword(token, form);

      Alert.alert(
        'Berhasil',
        'Password berhasil diubah',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error changing password:', error);
      Alert.alert('Error', error.message || 'Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* Fixed Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color="#18492b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ubah Password</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Scrollable Content */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <View style={styles.iconContainer}>
                  <Feather name="lock" size={24} color="#388e3c" />
                </View>
                <Text style={styles.formTitle}>Ubah Password</Text>
                <Text style={styles.formSubtitle}>
                  Masukkan password saat ini dan password baru Anda
                </Text>
              </View>

              {/* Current Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password Saat Ini</Text>
                <View style={[styles.inputContainer, errors.current_password && styles.inputError]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan password saat ini"
                    placeholderTextColor="#999"
                    secureTextEntry={!showCurrentPassword}
                    value={form.current_password}
                    onChangeText={(value) => handleChange('current_password', value)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Feather 
                      name={showCurrentPassword ? 'eye' : 'eye-off'} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.current_password && (
                  <Text style={styles.errorText}>{errors.current_password}</Text>
                )}
              </View>

              {/* New Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password Baru</Text>
                <View style={[styles.inputContainer, errors.new_password && styles.inputError]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan password baru"
                    placeholderTextColor="#999"
                    secureTextEntry={!showNewPassword}
                    value={form.new_password}
                    onChangeText={(value) => handleChange('new_password', value)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Feather 
                      name={showNewPassword ? 'eye' : 'eye-off'} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.new_password && (
                  <Text style={styles.errorText}>{errors.new_password}</Text>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Konfirmasi Password Baru</Text>
                <View style={[styles.inputContainer, errors.new_password_confirmation && styles.inputError]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Konfirmasi password baru"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPassword}
                    value={form.new_password_confirmation}
                    onChangeText={(value) => handleChange('new_password_confirmation', value)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Feather 
                      name={showConfirmPassword ? 'eye' : 'eye-off'} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.new_password_confirmation && (
                  <Text style={styles.errorText}>{errors.new_password_confirmation}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Feather name="check" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Ubah Password</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Feather name="info" size={20} color="#1976d2" />
                <Text style={styles.infoTitle}>Tips Password Aman</Text>
              </View>
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>Minimal 6 karakter</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>Kombinasikan huruf besar dan kecil</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>Tambahkan angka dan simbol</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoBullet}>•</Text>
                  <Text style={styles.infoText}>Jangan gunakan informasi pribadi</Text>
                </View>
              </View>
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
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 1000,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18492b',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6f3ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18492b',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18492b',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#e53935',
    backgroundColor: '#fff5f5',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#18492b',
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#e53935',
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#388e3c',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#388e3c',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 80,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginLeft: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoBullet: {
    fontSize: 16,
    color: '#1976d2',
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
