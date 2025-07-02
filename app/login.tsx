import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Text as RNText, TouchableOpacity as RNTouchableOpacity, View as RNView } from 'react-native';
import Toast from 'react-native-toast-message';
import { LOGIN_ENDPOINT } from '../constants/api';

import type { BaseToastProps } from 'react-native-toast-message';

const toastConfig = {
  error: ({ text1, text2, onPress, ...rest }: BaseToastProps) => (
    <RNView
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff0ee',
        borderWidth: 2,
        borderColor: '#e53935',
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginHorizontal: 12,
        marginTop: 18,
        shadowColor: '#e53935',
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 3,
        minHeight: 64,
      }}
    >
      <Feather name="x-circle" size={32} color="#e53935" style={{ marginRight: 18, marginTop: 2 }} />
      <RNView style={{ flex: 1, paddingRight: 10 }}>
        <RNText style={{ fontWeight: 'bold', color: '#222', fontSize: 16, marginBottom: 2 }}>{text1}</RNText>
        {!!text2 && (
          <RNText style={{ color: '#444', fontSize: 15, lineHeight: 21 }}>
            {text2}
          </RNText>
        )}
      </RNView>
      <RNTouchableOpacity onPress={onPress || (() => Toast.hide())} style={{ marginLeft: 8, marginTop: 2 }}>
        <Feather name="x" size={22} color="#bdbdbd" />
      </RNTouchableOpacity>
    </RNView>
  ),
  success: ({ text1, text2, onPress, ...rest }: BaseToastProps) => (
    <RNView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderLeftWidth: 6,
        borderLeftColor: '#43a047',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 12,
        marginTop: 14,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Feather name="check-circle" size={28} color="#43a047" style={{ marginRight: 14 }} />
      <RNView style={{ flex: 1 }}>
        <RNText style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: 16 }}>{text1}</RNText>
        {!!text2 && <RNText style={{ color: '#444', fontSize: 14 }}>{text2}</RNText>}
      </RNView>
      <RNTouchableOpacity onPress={onPress || (() => Toast.hide())} style={{ marginLeft: 8 }}>
        <Feather name="x" size={20} color="#aaa" />
      </RNTouchableOpacity>
    </RNView>
  ),
  info: ({ text1, text2, onPress, ...rest }: BaseToastProps) => (
    <RNView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderLeftWidth: 6,
        borderLeftColor: '#1976d2',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 12,
        marginTop: 14,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Feather name="info" size={28} color="#1976d2" style={{ marginRight: 14 }} />
      <RNView style={{ flex: 1 }}>
        <RNText style={{ fontWeight: 'bold', color: '#1976d2', fontSize: 16 }}>{text1}</RNText>
        {!!text2 && <RNText style={{ color: '#444', fontSize: 14 }}>{text2}</RNText>}
      </RNView>
      <RNTouchableOpacity onPress={onPress || (() => Toast.hide())} style={{ marginLeft: 8 }}>
        <Feather name="x" size={20} color="#aaa" />
      </RNTouchableOpacity>
    </RNView>
  ),
  warning: ({ text1, text2, onPress, ...rest }: BaseToastProps) => (
    <RNView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderLeftWidth: 6,
        borderLeftColor: '#fbc02d',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 12,
        marginTop: 14,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Feather name="alert-circle" size={28} color="#fbc02d" style={{ marginRight: 14 }} />
      <RNView style={{ flex: 1 }}>
        <RNText style={{ fontWeight: 'bold', color: '#b8860b', fontSize: 16 }}>{text1}</RNText>
        {!!text2 && <RNText style={{ color: '#444', fontSize: 14 }}>{text2}</RNText>}
      </RNView>
      <RNTouchableOpacity onPress={onPress || (() => Toast.hide())} style={{ marginLeft: 8 }}>
        <Feather name="x" size={20} color="#aaa" />
      </RNTouchableOpacity>
    </RNView>
  ),
};

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setFieldError({});
    let valid = true;
    let newFieldError: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newFieldError.email = 'Email wajib diisi';
      valid = false;
    }
    if (!password) {
      newFieldError.password = 'Password wajib diisi';
      valid = false;
    }
    setFieldError(newFieldError);
    if (!valid) return;
    setLoading(true);
    try {
      console.log('[LOGIN] Fetching:', LOGIN_ENDPOINT);
      console.log('[LOGIN] Request body:', { email, password });
      const response = await axios.post(LOGIN_ENDPOINT, { email, password }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      if (data.success) {
        await AsyncStorage.setItem('token', response.data.data.token);
        // Simpan data user ke AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        // Navigasi ke halaman utama (tabs)
        router.replace('/home');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login gagal',
          text2: data.message || 'Email atau password salah',
        });
        setError(data.message || 'Login gagal');
      }
    } catch (e: any) {
      console.log('[LOGIN] Fetch error:', e);
      Toast.show({
        type: 'error',
        text1: 'Terjadi kesalahan jaringan',
        text2: e.response?.data?.message || 'Cek koneksi internet Anda',
      });
      setError(e.response?.data?.message || 'Terjadi kesalahan jaringan');
      console.log(e.response?.data?.message || 'Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>SiPortu</Text>
      <Text style={styles.subtitle}>Login orang tua siswa</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={[styles.input, email.trim() && !fieldError.email ? { borderColor: '#43a047' } : fieldError.email ? { borderColor: '#e53935' } : null]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={v => {
            setEmail(v);
            if (fieldError.email && v.trim()) {
              setFieldError(prev => ({ ...prev, email: undefined }));
            }
          }}
        />
        {!!fieldError.email && (
          <Text style={styles.fieldError}>{fieldError.email}</Text>
        )}
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={[styles.input, password && !fieldError.password ? { borderColor: '#43a047' } : fieldError.password ? { borderColor: '#e53935' } : null]}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={v => {
            setPassword(v);
            if (fieldError.password && v) {
              setFieldError(prev => ({ ...prev, password: undefined }));
            }
          }}
        />
        <Pressable style={styles.eyeIcon} onPress={() => setShowPassword(v => !v)}>
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#888" />
        </Pressable>
        {!!fieldError.password && (
          <Text style={styles.fieldError}>{fieldError.password}</Text>
        )}
      </View>

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>
      <View style={styles.bottomTextWrapper}>
        <Text style={styles.bottomText}>Belum punya akun? </Text>
        <TouchableOpacity onPress={() => router.replace('/register')}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
      <Toast config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  logoWrapper: {
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 16,
    marginBottom: 16,
    marginTop: 24,
    shadowColor: '#388E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5C54',
    marginBottom: 28,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222',
    paddingRight: 40, // For eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -10,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#18492b',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
    shadowColor: '#18492b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  bottomTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  bottomText: {
    fontSize: 15,
    color: '#444',
  },
  registerText: {
    fontSize: 15,
    color: '#1B5E20',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  fieldError: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 4,
    marginBottom: 2,
  },
});
