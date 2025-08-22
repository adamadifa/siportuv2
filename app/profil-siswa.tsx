import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { fetchSiswaById } from '../constants/api';
import BottomNavigation from './BottomNavigation';

interface SiswaData {
  id_siswa: string;
  nama_lengkap: string; // Ubah dari nama_siswa ke nama_lengkap
  nis: string;
  nisn: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  agama?: string; // Opsional karena tidak ada di response
  alamat: string;
  no_hp_orang_tua?: string; // Ubah dari no_hp ke no_hp_orang_tua
  nama_ayah: string;
  nama_ibu: string;
  pekerjaan_ayah: string;
  pekerjaan_ibu: string;
  no_pendaftaran: string;
  tahun_masuk: string;
  nama_kelas?: string; // Ubah dari kelas ke nama_kelas
  nama_unit?: string; // Tambahkan nama_unit
  status_siswa?: string; // Opsional karena tidak ada di response
  // Tambahan field dari response API
  anak_ke?: string;
  jumlah_saudara?: string;
  nik_ayah?: string;
  nik_ibu?: string;
  no_kk?: string;
  pendidikan_ayah?: string;
  pendidikan_ibu?: string;
  tingkat?: string;
  tahun_ajaran?: string;
}

export default function ProfilSiswaScreen() {
  const router = useRouter();
  const { id_siswa } = useLocalSearchParams<{ id_siswa: string }>();
  const [siswaData, setSiswaData] = useState<SiswaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 PROFIL SISWA: useEffect triggered');
    console.log('🔍 PROFIL SISWA: id_siswa =', id_siswa);
    if (id_siswa) {
      fetchSiswaData();
    } else {
      console.log('❌ PROFIL SISWA: id_siswa is null or undefined');
    }
  }, [id_siswa]);

  const fetchSiswaData = async () => {
    try {
      console.log('🔄 PROFIL SISWA: Starting fetchSiswaData');
      console.log('🔄 PROFIL SISWA: id_siswa =', id_siswa);
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      console.log('🔄 PROFIL SISWA: token =', token ? 'Token found' : 'Token not found');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      console.log('🔄 PROFIL SISWA: Calling fetchSiswaById with token and id_siswa:', id_siswa);
      const response = await fetchSiswaById(token, id_siswa);
      console.log('🔄 PROFIL SISWA: API Response =', response);
      console.log('🔄 PROFIL SISWA: Response type =', typeof response);
      console.log('🔄 PROFIL SISWA: Response length =', response ? response.length : 'response is null/undefined');
      
      // Perbaikan: Handle response object tunggal, bukan array
      if (response && typeof response === 'object') {
        console.log('✅ PROFIL SISWA: Data found, setting siswaData');
        console.log('✅ PROFIL SISWA: Response object =', response);
        setSiswaData(response);
      } else {
        console.log('❌ PROFIL SISWA: No data found in response');
        setError('Data siswa tidak ditemukan');
      }
    } catch (err: any) {
      console.log('❌ PROFIL SISWA: Error occurred =', err);
      console.log('❌ PROFIL SISWA: Error message =', err.message);
      setError(err.message || 'Gagal mengambil data siswa');
      Alert.alert('Error', err.message || 'Gagal mengambil data siswa');
    } finally {
      console.log('🔄 PROFIL SISWA: Setting loading to false');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
        return '#388e3c';
      case 'nonaktif':
        return '#d32f2f';
      case 'lulus':
        return '#1976d2';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
        return 'Aktif';
      case 'nonaktif':
        return 'Nonaktif';
      case 'lulus':
        return 'Lulus';
      default:
        return status || 'Tidak diketahui';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={styles.loadingText}>Memuat data siswa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="dark" />
        <Feather name="alert-circle" size={64} color="#d32f2f" />
        <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSiswaData}>
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!siswaData) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="dark" />
        <Feather name="user-x" size={64} color="#666" />
        <Text style={styles.errorTitle}>Data Tidak Ditemukan</Text>
        <Text style={styles.errorText}>Data siswa tidak ditemukan</Text>
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>Profil Siswa</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {/* Profile Header Card */}
            <View style={styles.profileHeaderCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Feather name="user" size={48} color="#fff" />
                </View>
              </View>
              <Text style={styles.studentName}>{siswaData.nama_lengkap}</Text>
              <Text style={styles.studentNIS}>NIS: {siswaData.nis}</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#388e3c20' }]}>
                <Text style={[styles.statusText, { color: '#388e3c' }]}>
                  {siswaData.nama_unit} - Kelas {siswaData.nama_kelas}
                </Text>
              </View>
            </View>

            {/* Personal Information */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather name="user" size={20} color="#388e3c" />
                <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
              </View>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>NISN</Text>
                  <Text style={styles.infoValue}>{siswaData.nisn || '-'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Jenis Kelamin</Text>
                  <Text style={styles.infoValue}>{siswaData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tempat Lahir</Text>
                  <Text style={styles.infoValue}>{siswaData.tempat_lahir || '-'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tanggal Lahir</Text>
                  <Text style={styles.infoValue}>{formatDate(siswaData.tanggal_lahir)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Anak Ke</Text>
                  <Text style={styles.infoValue}>{siswaData.anak_ke || '-'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Jumlah Saudara</Text>
                  <Text style={styles.infoValue}>{siswaData.jumlah_saudara || '-'}</Text>
                </View>
              </View>

              <View style={styles.addressSection}>
                <Text style={styles.infoLabel}>Alamat</Text>
                <Text style={styles.infoValue}>{siswaData.alamat || '-'}</Text>
                <Text style={styles.infoLabel}>No. HP Orang Tua</Text>
                <Text style={styles.infoValue}>{siswaData.no_hp_orang_tua || '-'}</Text>
              </View>
            </View>

            {/* Academic Information */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather name="book" size={20} color="#1976d2" />
                <Text style={styles.sectionTitle}>Informasi Akademik</Text>
              </View>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>No. Pendaftaran</Text>
                  <Text style={styles.infoValue}>{siswaData.no_pendaftaran || '-'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tahun Masuk</Text>
                  <Text style={styles.infoValue}>{siswaData.tahun_masuk || '-'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tahun Ajaran</Text>
                  <Text style={styles.infoValue}>{siswaData.tahun_ajaran || '-'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Tingkat</Text>
                  <Text style={styles.infoValue}>{siswaData.tingkat || '-'}</Text>
                </View>
              </View>
            </View>

            {/* Parent Information */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather name="users" size={20} color="#7b1fa2" />
                <Text style={styles.sectionTitle}>Informasi Orang Tua</Text>
              </View>
              
              <View style={styles.parentSection}>
                <View style={styles.parentCard}>
                  <Text style={styles.parentTitle}>Ayah</Text>
                  <Text style={styles.parentName}>{siswaData.nama_ayah || '-'}</Text>
                  <Text style={styles.parentJob}>{siswaData.pekerjaan_ayah || '-'}</Text>
                  <Text style={styles.parentDetail}>NIK: {siswaData.nik_ayah || '-'}</Text>
                  <Text style={styles.parentDetail}>Pendidikan: {siswaData.pendidikan_ayah || '-'}</Text>
                </View>
                
                <View style={styles.parentCard}>
                  <Text style={styles.parentTitle}>Ibu</Text>
                  <Text style={styles.parentName}>{siswaData.nama_ibu || '-'}</Text>
                  <Text style={styles.parentJob}>{siswaData.pekerjaan_ibu || '-'}</Text>
                  <Text style={styles.parentDetail}>NIK: {siswaData.nik_ibu || '-'}</Text>
                  <Text style={styles.parentDetail}>Pendidikan: {siswaData.pendidikan_ibu || '-'}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <BottomNavigation activeTab="home" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18492b',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#388e3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profileHeaderCard: {
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
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#18492b',
    marginBottom: 4,
    textAlign: 'center',
  },
  studentNIS: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18492b',
    marginLeft: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#18492b',
    fontWeight: '600',
  },
  addressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  parentSection: {
    flexDirection: 'row',
    gap: 16,
  },
  parentCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  parentTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  parentName: {
    fontSize: 16,
    color: '#18492b',
    fontWeight: '600',
    marginBottom: 4,
  },
  parentJob: {
    fontSize: 14,
    color: '#666',
  },
  parentDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
