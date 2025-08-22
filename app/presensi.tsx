import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import BottomNavigation from './BottomNavigation';

// Data dummy presensi (lebih banyak data untuk testing)
const dummyPresensiData = [
  {
    id: 1,
    tanggal: '2025-01-15',
    hari: 'Senin',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 2,
    tanggal: '2025-01-16',
    hari: 'Selasa',
    jam_masuk: '07:45',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Terlambat 15 menit'
  },
  {
    id: 3,
    tanggal: '2025-01-17',
    hari: 'Rabu',
    jam_masuk: '07:25',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 4,
    tanggal: '2025-01-18',
    hari: 'Kamis',
    jam_masuk: '08:00',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Terlambat 30 menit'
  },
  {
    id: 5,
    tanggal: '2025-01-19',
    hari: 'Jumat',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 6,
    tanggal: '2025-01-20',
    hari: 'Senin',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'sakit',
    keterangan: 'Sakit flu'
  },
  {
    id: 7,
    tanggal: '2025-01-21',
    hari: 'Selasa',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 8,
    tanggal: '2025-01-22',
    hari: 'Rabu',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'izin',
    keterangan: 'Izin keluarga'
  },
  {
    id: 9,
    tanggal: '2025-01-23',
    hari: 'Kamis',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 10,
    tanggal: '2025-01-24',
    hari: 'Jumat',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 11,
    tanggal: '2025-01-27',
    hari: 'Senin',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 12,
    tanggal: '2025-01-28',
    hari: 'Selasa',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'alpha',
    keterangan: 'Tidak ada keterangan'
  },
  {
    id: 13,
    tanggal: '2025-01-29',
    hari: 'Rabu',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 14,
    tanggal: '2025-01-30',
    hari: 'Kamis',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  },
  {
    id: 15,
    tanggal: '2025-01-31',
    hari: 'Jumat',
    jam_masuk: '07:30',
    jam_keluar: '15:30',
    status: 'hadir',
    keterangan: 'Tepat waktu'
  }
];

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function PresensiScreen() {
  const router = useRouter();
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredData, setFilteredData] = useState(dummyPresensiData);

  // Generate year options (2025 to current year)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2025; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  const yearOptions = generateYearOptions();

  useEffect(() => {
    applyFilter();
  }, [selectedMonth, selectedYear]);

  const applyFilter = () => {
    const filtered = dummyPresensiData.filter(item => {
      const itemDate = new Date(item.tanggal);
      return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
    });
    setFilteredData(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir':
        return '#388e3c';
      case 'terlambat':
        return '#f57c00';
      case 'sakit':
        return '#1976d2';
      case 'izin':
        return '#7b1fa2';
      case 'alpha':
        return '#d32f2f';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hadir':
        return 'Hadir';
      case 'terlambat':
        return 'Terlambat';
      case 'sakit':
        return 'Sakit';
      case 'izin':
        return 'Izin';
      case 'alpha':
        return 'Alpha';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir':
        return 'check-circle';
      case 'terlambat':
        return 'clock';
      case 'sakit':
        return 'heart';
      case 'izin':
        return 'user-check';
      case 'alpha':
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  const calculateRecap = () => {
    const recap = {
      hadir: 0,
      terlambat: 0,
      sakit: 0,
      izin: 0,
      alpha: 0,
      total: 0
    };

    filteredData.forEach(item => {
      recap[item.status as keyof typeof recap]++;
      recap.total++;
    });

    return recap;
  };

  const recap = calculateRecap();

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
            <Text style={styles.headerTitle}>Presensi</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Filter Section */}
          <View style={styles.filterCard}>
            <Text style={styles.filterTitle}>Filter Periode</Text>
            
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowMonthPicker(true)}
              >
                <Feather name="calendar" size={20} color="#388e3c" />
                <Text style={styles.filterButtonText}>{months[selectedMonth]}</Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowYearPicker(true)}
              >
                <Feather name="calendar" size={20} color="#388e3c" />
                <Text style={styles.filterButtonText}>{selectedYear}</Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recap Section */}
          <View style={styles.recapCard}>
            <Text style={styles.recapTitle}>Rekap Presensi</Text>
            <View style={styles.recapGrid}>
              <View style={[styles.recapItem, { backgroundColor: '#388e3c20' }]}>
                <Feather name="check-circle" size={24} color="#388e3c" />
                <Text style={[styles.recapNumber, { color: '#388e3c' }]}>{recap.hadir}</Text>
                <Text style={styles.recapLabel}>Hadir</Text>
              </View>
              
              <View style={[styles.recapItem, { backgroundColor: '#f57c0020' }]}>
                <Feather name="clock" size={24} color="#f57c00" />
                <Text style={[styles.recapNumber, { color: '#f57c00' }]}>{recap.terlambat}</Text>
                <Text style={styles.recapLabel}>Terlambat</Text>
              </View>
              
              <View style={[styles.recapItem, { backgroundColor: '#1976d220' }]}>
                <Feather name="heart" size={24} color="#1976d2" />
                <Text style={[styles.recapNumber, { color: '#1976d2' }]}>{recap.sakit}</Text>
                <Text style={styles.recapLabel}>Sakit</Text>
              </View>
              
              <View style={[styles.recapItem, { backgroundColor: '#7b1fa220' }]}>
                <Feather name="user-check" size={24} color="#7b1fa2" />
                <Text style={[styles.recapNumber, { color: '#7b1fa2' }]}>{recap.izin}</Text>
                <Text style={styles.recapLabel}>Izin</Text>
              </View>
              
              <View style={[styles.recapItem, { backgroundColor: '#d32f2f20' }]}>
                <Feather name="x-circle" size={24} color="#d32f2f" />
                <Text style={[styles.recapNumber, { color: '#d32f2f' }]}>{recap.alpha}</Text>
                <Text style={styles.recapLabel}>Alpha</Text>
              </View>
              
              <View style={[styles.recapItem, { backgroundColor: '#18492b20' }]}>
                <Feather name="bar-chart-2" size={24} color="#18492b" />
                <Text style={[styles.recapNumber, { color: '#18492b' }]}>{recap.total}</Text>
                <Text style={styles.recapLabel}>Total</Text>
              </View>
            </View>
          </View>

          {/* Data Section */}
          <View style={styles.dataSection}>
            <View style={styles.dataHeader}>
              <Text style={styles.dataTitle}>Data Presensi</Text>
              <Text style={styles.dataCount}>{filteredData.length} data</Text>
            </View>
            
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {filteredData.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="calendar" size={64} color="#ccc" />
                  <Text style={styles.emptyTitle}>Tidak Ada Data</Text>
                  <Text style={styles.emptySubtitle}>
                    Tidak ada data presensi untuk periode yang dipilih
                  </Text>
                </View>
              ) : (
                filteredData.map((item) => (
                  <View key={item.id} style={styles.presensiCard}>
                    <View style={styles.presensiHeader}>
                      <View style={styles.dateInfo}>
                        <Text style={styles.dayText}>{item.hari}</Text>
                        <Text style={styles.dateText}>{item.tanggal}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <Feather name={getStatusIcon(item.status) as any} size={14} color={getStatusColor(item.status)} />
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                          {getStatusText(item.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.presensiDetails}>
                      <View style={styles.timeInfo}>
                        <View style={styles.timeItem}>
                          <Feather name="clock" size={16} color="#388e3c" />
                          <Text style={styles.timeLabel}>Masuk</Text>
                          <Text style={styles.timeValue}>{item.jam_masuk}</Text>
                        </View>
                        <View style={styles.timeItem}>
                          <Feather name="clock" size={16} color="#e53935" />
                          <Text style={styles.timeLabel}>Keluar</Text>
                          <Text style={styles.timeValue}>{item.jam_keluar}</Text>
                        </View>
                      </View>

                      <View style={styles.keteranganContainer}>
                        <Feather name="info" size={16} color="#666" />
                        <Text style={styles.keteranganText}>{item.keterangan}</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
        <BottomNavigation activeTab="home" />
      </SafeAreaView>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Bulan</Text>
              <TouchableOpacity
                onPress={() => setShowMonthPicker(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.pickerOption}
                  onPress={() => {
                    setSelectedMonth(index);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{month}</Text>
                  {selectedMonth === index && (
                    <Feather name="check" size={20} color="#388e3c" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Tahun</Text>
              <TouchableOpacity
                onPress={() => setShowYearPicker(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {yearOptions.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={styles.pickerOption}
                  onPress={() => {
                    setSelectedYear(year);
                    setShowYearPicker(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{year}</Text>
                  {selectedYear === year && (
                    <Feather name="check" size={20} color="#388e3c" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  filterCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18492b',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fafafa',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18492b',
    flex: 1,
    marginLeft: 8,
  },
  recapCard: {
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
  recapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18492b',
    marginBottom: 16,
  },
  recapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recapItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  recapNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  recapLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dataSection: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18492b',
  },
  dataCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  presensiCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  presensiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateInfo: {
    flex: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#18492b',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  presensiDetails: {
    gap: 12,
  },
  timeInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18492b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  keteranganContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  keteranganText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18492b',
  },
  closeButton: {
    padding: 4,
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#18492b',
  },
});
