import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
// Pastikan TouchableOpacity sudah di-import

import {
  ActivityIndicator, Dimensions, Image,
  SafeAreaView, ScrollView, StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';
import AnnouncementCard from '../components/AnnouncementCard';

import { fetchDataSiswa } from '../constants/api';

// Hapus siswaDummy, akan diganti dengan state

const menuDummy = [
  { icon: 'credit-card', label: 'Tagihan', color: '#388e3c' },
  { icon: 'check-square', label: 'Presensi', color: '#1976d2' },
  { icon: 'dollar-sign', label: 'Tabungan', color: '#fbc02d' },
  { icon: 'book', label: 'Raport', color: '#8d5fd3' },
  { icon: 'bar-chart', label: 'Laporan', color: '#e53935' },
  { icon: 'bell', label: 'Pengumuman', color: '#388e3c' },
];

const pengumumanDummy = [
  {
    id: 1,
    judul: 'Pembayaran UKT',
    isi: 'Segera lakukan pembayaran UKT semester ganjil.',
    tanggal: '26 Jun 2025',
    kategori: 'keuangan',
    lokasi: 'Bank Syariah Mandiri, Kampus Pusat',
  },
  {
    id: 2,
    judul: 'Jadwal Ujian',
    isi: 'Ujian akhir semester akan dimulai minggu depan.',
    tanggal: '27 Jun 2025',
    kategori: 'akademik',
    lokasi: 'Gedung Serbaguna Lt 2',
  },
  {
    id: 3,
    judul: 'Libur Akhir Semester',
    tanggal: '25 Juni 2025',
    isi: 'Sekolah libur mulai 26 Juni hingga 10 Juli 2025. Selamat berlibur!',
    kategori: 'liburan',
    lokasi: 'Seluruh sekolah',
  },
  {
    id: 4,
    judul: 'Pengambilan Raport',
    tanggal: '18 Juni 2025',
    isi: 'Pengambilan raport dilakukan pada tanggal 27 Juni 2025 di ruang kelas masing-masing.',
    kategori: 'akademik',
    lokasi: 'Ruang kelas masing-masing',
  },
];

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [activeTabNav, setActiveTabNav] = useState('home');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // State untuk data siswa, loading, dan error
  const [siswa, setSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  React.useEffect(() => {
    const fetchSiswa = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token tidak ditemukan');
        // Log token user yang sedang login
        console.log('User token:', token);
        // Ambil data user dari AsyncStorage
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          setUserInfo(JSON.parse(userStr));
        }
        const data = await fetchDataSiswa(token);
        //console.log('HASIL DATA SISWA:', data);
        setSiswa(data);
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data siswa');
      } finally {
        setLoading(false);
      }
    };
    fetchSiswa();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Image source={require('../assets/images/logo.png')} style={styles.logoSmall} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.welcome}>Assalamualaikum,</Text>
              <Text style={styles.parentName}>
                Bapak / Ibu {userInfo ? userInfo.name : ''}
              </Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('user');
                router.replace('/login');
              }}
              style={{ padding: 8, marginLeft: 8 }}
              accessibilityLabel="Logout"
            >
              <Feather name="log-out" size={24} color="#e53935" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Panel Siswa */}
            {loading ? (
              <ActivityIndicator size="large" color="#388e3c" style={{ marginTop: 30 }} />
            ) : error ? (
              <Text style={{ color: 'red', margin: 20, textAlign: 'center' }}>{error}</Text>
            ) : siswa.length === 0 ? (
              <Text style={{ color: '#888', margin: 20, textAlign: 'center' }}>Tidak ada data siswa.</Text>
            ) : (
              <>
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 20, }}
                  contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 0, minHeight: 0 }}
                  onMomentumScrollEnd={e => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                    setActiveIndex(idx);
                  }}
                >

                  {siswa.map((s, idx) => (
                    <View style={[siswa.length === 1 ? styles.siswaPanelSingle : styles.siswaPanelMulti, styles.siswaPanel]} key={s.id_siswa ? `siswa-${s.id_siswa}` : `idx-${idx}`}>
                      {/* Ornamen lingkaran besar kanan bawah */}
                      <View style={styles.ornamenCircle} pointerEvents="none" />
                      {/* Ornamen gradient kiri atas */}
                      <View style={styles.ornamenGradient} pointerEvents="none" />
                      <View style={styles.siswaHeaderRow}>
                        <View style={styles.inisialCircle}>
                          <Text style={styles.inisialText}>{s.nama_lengkap ? s.nama_lengkap.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() : '-'}</Text>
                        </View>
                        <TouchableOpacity style={styles.arrowBtn}>
                          <Feather name="chevron-right" size={20} color="#fff" style={{ opacity: 0.7 }} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.siswaNama}>{s.nama_lengkap || '-'}</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <View style={{ backgroundColor: 'rgb(255, 187, 0)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>ID: {s.id_siswa || '-'}</Text>
                        </View>
                        <View style={{ backgroundColor: 'rgb(255, 187, 0)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>Kelas: {s.nama_kelas || '-'}</Text>
                        </View>
                        <View style={{ backgroundColor: 'rgb(255, 187, 0)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>Unit: {s.nama_unit || '-'}</Text>
                        </View>
                      </View>
                      <View style={styles.presensiBox}>
                        <Text style={styles.presensiTitle}>Presensi Hari Ini</Text>
                        <View style={{ flexDirection: 'row', marginTop: 2 }}>
                          <Text style={styles.presensiLabel}>Masuk:
                            <Text style={styles.presensiVal}>08:00</Text>
                          </Text>
                          <Text style={[styles.presensiLabel, { marginLeft: 18 }]}>
                            Pulang: <Text style={[styles.presensiVal, { color: '#fbc02d' }]}>17:00</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                {/* Grid Menu */}
                <View style={styles.menuGrid}>
                  {menuDummy.map((m, idx) => (
                    <TouchableOpacity
                      style={styles.menuItem}
                      key={idx}
                      activeOpacity={0.8}
                      onPress={() => {
                        console.log('ACTIVE INDEX:', activeIndex);
                        console.log('ACTIVE SISWA:', siswa[activeIndex].id_siswa);
                        if (m.label === 'Tagihan') {
                          const siswaAktif = siswa[activeIndex];
                          router.push({ pathname: '/tagihan', params: { id_siswa: siswaAktif.id_siswa } });
                        }
                        // Tambahkan navigasi lain jika perlu
                      }}
                    >
                      <View style={[styles.menuIconCircle, { backgroundColor: m.color + '22' }]}>
                        <Feather name={m.icon as any} size={28} color={m.color} />
                      </View>
                      <Text style={styles.menuLabel}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Section Pengumuman */}
                <View style={[styles.sectionPengumuman, { justifyContent: 'space-between' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#e6f3ea', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Feather name="bell" size={20} color="#388e3c" />
                    </View>
                    <Text style={[styles.pengumumanTitle, { color: '#14532d', fontWeight: 'bold', fontSize: 17, letterSpacing: 0.2 }]}>Pengumuman</Text>
                  </View>
                  <TouchableOpacity style={{ paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8, alignSelf: 'center' }} activeOpacity={0.7}>
                    <Text style={{ color: '#388e3c', fontWeight: 'bold', fontSize: 13 }}>Lihat Semua</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginHorizontal: 18, marginTop: 0, position: 'relative', paddingLeft: 0 }}>
                  {/* Timeline vertical line */}

                  {pengumumanDummy.map((item, idx) => {
                    const [tgl, bln] = item.tanggal.split(' ');
                    // Badge warna
                    let categoryColor = '#e0e0e0';
                    if (item.kategori === 'keuangan') categoryColor = '#e3f2fd';
                    else if (item.kategori === 'akademik') categoryColor = '#fffde7';
                    return (
                      <View key={item.id} style={{ marginBottom: 10 }}>
                        <AnnouncementCard
                          date={tgl}
                          month={bln}
                          time="08.00"
                          title={item.judul}
                          location={item.lokasi || 'Lokasi acara belum ditentukan'}
                          category={item.kategori}
                          categoryColor={categoryColor}
                          content={item.isi}
                        />
                      </View>
                    );
                  })}
                </View>
              </>
            )}

          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  pengumumanSection: {
    marginTop: 28,
    marginHorizontal: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pengumumanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18492b',
    marginBottom: 8,
  },
  pengumumanKosong: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
  },
  pengumumanItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  pengumumanJudul: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 2,
  },
  pengumumanTanggal: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  pengumumanIsi: {
    fontSize: 14,
    color: '#444',
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 0,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  logoSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  welcome: {
    fontSize: 15,
    color: '#18492b',
    marginBottom: 0,
  },
  parentName: {
    fontSize: 18,
    color: '#18492b',
    fontWeight: 'bold',
    marginTop: -2,
  },
  siswaPanel: {
    backgroundColor: '#14532d',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 11,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    minHeight: 140,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  siswaPanelSingle: {
    width: width - 20,
  },

  siswaPanelMulti: {
    width: width - 40,
  },
  ornamenCircle: {
    position: 'absolute',
    right: -50,
    bottom: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ornamenGradient: {
    position: 'absolute',
    left: -40,
    top: -40,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(56, 142, 60, 0.13)',
  },
  siswaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inisialCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6f3ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inisialText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#14532d',
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#18492b',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  siswaNama: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#fff',
    marginTop: 10,
  },
  siswaKelas: {
    color: '#e0e0e0',
    fontSize: 15,
    marginBottom: 2,
  },
  presensiBox: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  presensiTitle: {
    color: '#e0e0e0',
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 13,
  },
  presensiLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  presensiVal: {
    color: '#fff',
    fontWeight: 'bold',
  },
  swiperDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#388e3c',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  menuItem: {
    width: '29%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#388e3c',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f1f3',
    padding: 2,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f3ea',
    marginBottom: 4,
    shadowColor: '#388e3c',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuLabel: {
    fontSize: 13,
    color: '#18492b',
    fontWeight: 'bold',
    marginTop: 1,
  },
  sectionPengumuman: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 0,

  },
  pengumumanIcon: {
    fontSize: 22,
    marginRight: 10,
    color: '#388e3c',
  },

});
