import { registerOrangtua } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { CustomToast } from '../components/CustomToast';

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: '',
    email: '',
    nik: '',
    password: '',
    konfirmasi: '',
  });
  const [fieldError, setFieldError] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Console log when register screen mounts
  useEffect(() => {
    console.log('📝 REGISTER SCREEN: Component mounted and rendered');
    return () => {
      console.log('📝 REGISTER SCREEN: Component unmounted');
    };
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    // realtime: hapus error jika sudah valid
    setFieldError(prev => {
      const next = { ...prev };
      if (value && prev[key]) delete next[key];
      if (key === 'konfirmasi' && form.password && value === form.password) delete next['konfirmasi'];
      return next;
    });
  };

  const handleRegister = async () => {
    setFieldError({});
    let valid = true;
    let newFieldError: { [key: string]: string } = {};

    // Validasi NIK minimal 16 karakter
    if (!form.nik || form.nik.length < 16) {
      newFieldError.nik = 'NIK minimal 16 karakter';
      valid = false;
    }
    // Validasi password minimal 6 karakter
    if (!form.password || form.password.length < 6) {
      newFieldError.password = 'Password minimal 6 karakter';
      valid = false;
    }

    if (!form.nama.trim()) { newFieldError.nama = 'Nama wajib diisi'; valid = false; }
    if (!form.email.trim()) { newFieldError.email = 'Email wajib diisi'; valid = false; }
    if (!form.nik.trim()) { newFieldError.nik = 'NIK wajib diisi'; valid = false; }
    if (!form.password) { newFieldError.password = 'Password wajib diisi'; valid = false; }
    if (!form.konfirmasi) { newFieldError.konfirmasi = 'Konfirmasi password wajib diisi'; valid = false; }
    if (form.password && form.konfirmasi && form.password !== form.konfirmasi) {
      newFieldError.konfirmasi = 'Konfirmasi password tidak cocok';
      valid = false;
    }
    setFieldError(newFieldError);
    if (!valid) return;
    setLoading(true);
    // Panggil API registerOrangtua
    registerOrangtua({
      name: form.nama,
      email: form.email,
      password: form.password,
      password_confirmation: form.konfirmasi,
      nik: form.nik,
    })
      .then(async (res: any) => {
        console.log('Register response:', res);
        Toast.show({
          type: 'success',
          text1: 'Registrasi Berhasil',
          text2: res.message || 'Akun berhasil dibuat',
        });
        if (res.token) {
          try {
            await AsyncStorage.setItem('token', res.token);
          } catch (e) {
            Toast.show({ type: 'error', text1: 'Gagal menyimpan token' });
          }
        }
        setTimeout(() => {
          router.replace('/login');
          setLoading(false);
        }, 1200);
      })
      .catch((err: any) => {
        console.log('Register error:', err);
        Toast.show({
          type: 'error',
          text1: 'Registrasi Gagal',
          text2: err.message || 'Gagal membuat akun',
        });
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrapper}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>SiPortu</Text>
        <Text style={styles.subtitle}>Daftar akun baru untuk orang tua siswa</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Nama Lengkap"
            placeholderTextColor="#999"
            style={[styles.input, form.nama.trim() && !fieldError.nama ? { borderColor: '#43a047' } : fieldError.nama ? { borderColor: '#e53935' } : null]}
            value={form.nama}
            onChangeText={v => handleChange('nama', v)}
          />
          {!!fieldError.nama && <Text style={styles.fieldError}>{fieldError.nama}</Text>}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={[styles.input, form.email.trim() && !fieldError.email ? { borderColor: '#43a047' } : fieldError.email ? { borderColor: '#e53935' } : null]}
            keyboardType="email-address"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
          />
          {!!fieldError.email && <Text style={styles.fieldError}>{fieldError.email}</Text>}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="NIK"
            placeholderTextColor="#999"
            style={[styles.input, form.nik.trim() && !fieldError.nik ? { borderColor: '#43a047' } : fieldError.nik ? { borderColor: '#e53935' } : null]}
            keyboardType="numeric"
            value={form.nik}
            onChangeText={v => handleChange('nik', v)}
          />
          {!!fieldError.nik && <Text style={styles.fieldError}>{fieldError.nik}</Text>}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={[styles.input, form.password && !fieldError.password ? { borderColor: '#43a047' } : fieldError.password ? { borderColor: '#e53935' } : null]}
            secureTextEntry
            value={form.password}
            onChangeText={v => handleChange('password', v)}
          />
          {!!fieldError.password && <Text style={styles.fieldError}>{fieldError.password}</Text>}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Konfirmasi Password"
            placeholderTextColor="#999"
            style={[styles.input, form.konfirmasi && !fieldError.konfirmasi ? { borderColor: '#43a047' } : fieldError.konfirmasi ? { borderColor: '#e53935' } : null]}
            secureTextEntry
            value={form.konfirmasi}
            onChangeText={v => handleChange('konfirmasi', v)}
          />
          {!!fieldError.konfirmasi && <Text style={styles.fieldError}>{fieldError.konfirmasi}</Text>}
        </View>
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Daftar'}</Text>
        </TouchableOpacity>
        <View style={styles.bottomTextWrapper}>
          <Text style={styles.bottomText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.registerText}>Login di sini</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast config={{
        success: (props: BaseToastProps) => <CustomToast {...props} type="success" />,
        error: (props: BaseToastProps) => <CustomToast {...props} type="error" />,
        info: (props: BaseToastProps) => <CustomToast {...props} type="info" />,
        warning: (props: BaseToastProps) => <CustomToast {...props} type="warning" />,
      }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
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
    color: '#18492b',
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
