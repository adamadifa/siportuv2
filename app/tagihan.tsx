import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { fetchBiayaByNoPendaftaran, fetchDataUnitBySiswa, fetchSiswaById } from '../constants/api';
import BottomNavigation from './BottomNavigation';
// Utility: Format number to Rupiah (e.g., 10000 -> 10.000)
export function formatRupiah(angka: number | string): string {
    if (angka === null || angka === undefined) return '0';
    const number = typeof angka === 'string' ? parseInt(angka, 10) : angka;
    return number.toLocaleString('id-ID');
}

import { Skeleton } from 'moti/skeleton';

export const MyProfileSkeleton = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
            {/* Avatar bulat */}
            <View style={{ marginRight: 15 }}>
                <Skeleton width={52} height={52} radius={26} colors={["#eee", "#f5f5f5"]} />
            </View>
            {/* Info Siswa */}
            <View style={{ flex: 1 }}>
                {/* Nama */}
                <View style={{ marginBottom: 8 }}>
                    <Skeleton width={140} height={18} radius={8} colors={["#eee", "#f5f5f5"]} />
                </View>
                {/* Badge row */}
                <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={60} height={16} radius={8} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={60} height={16} radius={8} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <Skeleton width={60} height={16} radius={8} colors={["#eee", "#f5f5f5"]} />
                </View>
                {/* Info row 1 */}
                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={80} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <Skeleton width={80} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                </View>
                {/* Info row 2 */}
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={60} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <Skeleton width={60} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                </View>
            </View>
        </View>
    );
};

// Skeleton for bill list loading state

export const BillListSkeleton = ({ count = 3 }) => (
    <>
        {Array.from({ length: count }).map((_, idx) => (
            <View key={idx} style={styles.billCard}>
                {/* Top Row: Kode dan Badge */}
                <View style={styles.billCardTopRow}>
                    <Skeleton width={80} height={14} radius={6} colors={["#eee", "#f5f5f5"]} />
                    <View style={styles.badgeKategoriModern}>
                        <Skeleton width={60} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                    </View>
                </View>
                {/* Total Row */}
                <View style={styles.billTotalRow}>
                    <View style={{ flex: 1 }} />
                    <Skeleton width={100} height={18} radius={8} colors={["#eee", "#f5f5f5"]} />
                </View>
                {/* Potongan */}
                <View style={styles.billRowModern}>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={20} height={16} radius={8} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={60} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <Skeleton width={80} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                </View>
                {/* Mutasi */}
                <View style={styles.billRowModern}>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={20} height={16} radius={8} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={60} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <Skeleton width={80} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                </View>
                {/* Bayar */}
                <View style={styles.billRowModern}>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={20} height={16} radius={8} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <View style={{ marginRight: 8 }}>
                        <Skeleton width={60} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                    </View>
                    <Skeleton width={80} height={14} radius={7} colors={["#eee", "#f5f5f5"]} />
                </View>
            </View>
        ))}
    </>
);


const TagihanScreen = () => {
    // State untuk bottom navigation
    const [activeTabNav, setActiveTabNav] = useState('tagihan');
    // State untuk modal nota pembayaran
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [tab, setTab] = useState<'detail' | 'pembayaran'>('detail');
    // State untuk filter unit/jenjang
    const [unitList, setUnitList] = useState<any[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [activeSiswa, setActiveSiswa] = useState<any>(null);
    const [biayaList, setBiayaList] = useState<any[]>([]);
    const [loadingBiaya, setLoadingBiaya] = useState(true);
    const { id_siswa } = useLocalSearchParams();




    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token || !id_siswa) return;
                const data = await fetchDataUnitBySiswa(token, String(id_siswa));
                setUnitList(data);
                if (data.length > 0) setSelectedUnit(data[0].no_pendaftaran);
            } catch (err) {
                setUnitList([]);
            }
        };
        fetchUnits();
        console.log('Selected Unit:', selectedUnit);
    }, [id_siswa, selectedUnit]);


    useEffect(() => {
        const fetchSiswa = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token || !id_siswa) return;
                const data = await fetchSiswaById(token, String(id_siswa));
                setActiveSiswa(data);
            } catch (err) {
                setActiveSiswa(null);
            }
        };
        fetchSiswa();
    }, [id_siswa]);

    useEffect(() => {
        const fetchBiaya = async () => {
            setLoadingBiaya(true);
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token || !selectedUnit) {
                    setLoadingBiaya(false);
                    return;
                }
                const data = await fetchBiayaByNoPendaftaran(token, selectedUnit);
                setBiayaList(data);
            } catch (err) {
                setBiayaList([]);
            } finally {
                setLoadingBiaya(false);
            }
        };
        fetchBiaya();
        // console.log('Biaya List:', biayaList);
    }, [selectedUnit]);




    // Filter tagihan sesuai unit jika diperlukan, contoh:
    // const tagihanFiltered = tagihanListDummy.filter(t => t.kode_unit === selectedUnit);


    // State modal SPP
    const [showSppModal, setShowSppModal] = useState(false);

    // Dummy breakdown SPP per bulan
    const sppDetailList = [
        { bulan: 'Agustus 2024', jatuhTempo: '10-08-2024', tagihan: 250000, bayar: 0 },
        { bulan: 'September 2024', jatuhTempo: '10-09-2024', tagihan: 250000, bayar: 0 },
        { bulan: 'Oktober 2024', jatuhTempo: '10-10-2024', tagihan: 250000, bayar: 0 },
        { bulan: 'November 2024', jatuhTempo: '10-11-2024', tagihan: 250000, bayar: 0 },
        { bulan: 'Desember 2024', jatuhTempo: '10-12-2024', tagihan: 250000, bayar: 0 },
        { bulan: 'Januari 2025', jatuhTempo: '10-01-2025', tagihan: 250000, bayar: 0 },
        { bulan: 'Februari 2025', jatuhTempo: '10-02-2025', tagihan: 250000, bayar: 0 },
        { bulan: 'Maret 2025', jatuhTempo: '10-03-2025', tagihan: 250000, bayar: 0 },
        { bulan: 'April 2025', jatuhTempo: '10-04-2025', tagihan: 250000, bayar: 0 },
        { bulan: 'Mei 2025', jatuhTempo: '10-05-2025', tagihan: 250000, bayar: 0 },
        { bulan: 'Juni 2025', jatuhTempo: '10-06-2025', tagihan: 250000, bayar: 0 },
        { bulan: 'Juli 2025', jatuhTempo: '10-07-2025', tagihan: 250000, bayar: 0 },
    ];
    const totalSpp = sppDetailList.reduce((sum, cur) => sum + cur.tagihan, 0);

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>

                    {/* Header Profil */}
                    <View style={styles.profileCardGreen}>
                        {/* Ornamen dekoratif sudut kiri atas */}
                        <View style={styles.profileOrnamentTopLeft} />
                        {/* Ornamen dekoratif sudut kanan bawah */}
                        <View style={styles.profileOrnamentBottomRight} />
                        {/* Avatar bulat dengan border putih */}
                        <View style={styles.profileAvatarWrap}>
                            <View style={styles.profileAvatarGradientGreen}>
                                <Feather name="user" size={32} color="#fff" />
                            </View>
                        </View>
                        {!activeSiswa ? (
                            <MyProfileSkeleton />

                        ) :

                            (
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.profileNameFancyGreen}>{activeSiswa.nama_lengkap}</Text>
                                    <View style={styles.profileBadgeRow}>
                                        <View style={[styles.profileBadge, { backgroundColor: '#d1e7dd' }]}>
                                            <Feather name="hash" size={13} color="#14532d" />
                                            <Text style={styles.profileBadgeTextGreen}> {activeSiswa.id_siswa}</Text>
                                        </View>
                                        <View style={[styles.profileBadge, { backgroundColor: '#e3f2fd' }]}>
                                            <Feather name="users" size={13} color="#1976d2" />
                                            <Text style={styles.profileBadgeTextGreen}> {activeSiswa.nama_unit}</Text>
                                        </View>
                                        <View style={[styles.profileBadge, { backgroundColor: '#fffde7' }]}>
                                            <Feather name="calendar" size={13} color="#fbc02d" />
                                            <Text style={styles.profileBadgeTextGreen}> {activeSiswa.tahun_masuk}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.profileInfoRow}>
                                        <Feather name="map-pin" size={13} color="#fff" />
                                        <Text style={styles.profileInfoFancyGreen}> {activeSiswa.nama_kota}</Text>
                                        <Feather name="calendar" size={13} color="#fff" style={{ marginLeft: 8 }} />
                                        <Text style={styles.profileInfoFancyGreen}> {activeSiswa.tanggal_lahir}</Text>
                                    </View>
                                    <View style={styles.profileInfoRow}>
                                        <Feather name="user" size={13} color="#fff" />
                                        <Text style={styles.profileInfoFancyGreen}> {activeSiswa.gender == 'L' ? 'Laki-laki' : 'Perempuan'}</Text>
                                        {/* <Feather name="key" size={13} color="#fff" style={{ marginLeft: 8 }} />
                                <Text style={styles.profileInfoFancyGreen}> {activeSiswa.reg}</Text> */}
                                    </View>
                                </View>)}
                    </View>
                    {/* Tab Switch */}
                    <View style={styles.tabGroupModern}>
                        <TouchableOpacity onPress={() => setTab('detail')} style={[styles.tabBtnModern, tab === 'detail' && styles.tabBtnModernActive]}>
                            <Text style={[styles.tabBtnTextModern, tab === 'detail' && styles.tabBtnTextModernActive]}>Detail Biaya</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setTab('pembayaran')} style={[styles.tabBtnModern, tab === 'pembayaran' && styles.tabBtnModernActive]}>
                            <Text style={[styles.tabBtnTextModern, tab === 'pembayaran' && styles.tabBtnTextModernActive]}>Pembayaran</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Dropdown Jenjang/Unit */}
                    <View style={styles.filterRowNoLabel}>
                        <View style={styles.dropdownPickerFull}>
                            <Picker
                                selectedValue={selectedUnit}
                                onValueChange={(value) => {
                                    setSelectedUnit(value);
                                    console.log('Selected Unit:', value);
                                }}
                                style={styles.pickerSelectModern}
                                dropdownIconColor="#14532d"
                                itemStyle={{ color: '#222', fontSize: 15, fontWeight: '600' }}>
                                {unitList.map((u) => (
                                    <Picker.Item label={u.nama_unit} value={u.no_pendaftaran} key={u.no_pendaftaran} color="#222" />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
                    {/* Daftar Tagihan */}
                    {tab === 'detail' ? (
                        loadingBiaya ? (
                            <BillListSkeleton count={3} />
                        ) : (
                            biayaList.map((item, idx) => (
                                item.kode_jenis_biaya === 'B07' ? (
                                    <TouchableOpacity key={idx} style={styles.billCard} onPress={() => setShowSppModal(true)} activeOpacity={0.7}>
                                        <View style={styles.billCardTopRow}>
                                            <Text style={styles.billCode}>Kode: {item.kode_jenis_biaya} {item.tahun_ajaran}</Text>
                                            <View style={styles.badgeKategoriModern}>
                                                <MaterialCommunityIcons name="label-outline" size={14} color="#14532d" style={{ marginRight: 4 }} />
                                                <Text style={styles.badgeKategoriTextModern}>{item.jenis_biaya}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.billTotalRow}>
                                            <View style={{ flex: 1 }} />
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>

                                                <Text style={styles.billTotalModern}>Rp {formatRupiah(item.jumlah || 0)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.billRowModern}>
                                            <MaterialCommunityIcons name="ticket-percent" size={16} color="#e53935" style={{ marginRight: 8 }} />
                                            <Text style={styles.billLabelModern}>Potongan</Text>
                                            <Text style={[styles.billValueModern, { color: '#e53935' }]}>Rp {formatRupiah(item.jumlah_potongan)}</Text>
                                        </View>
                                        <View style={styles.billRowModern}>
                                            <MaterialCommunityIcons name="swap-horizontal" size={16} color="#e53935" style={{ marginRight: 8 }} />
                                            <Text style={styles.billLabelModern}>Mutasi</Text>
                                            <Text style={[styles.billValueModern, { color: '#e53935' }]}>Rp {formatRupiah(item.jumlah_mutasi)}</Text>
                                        </View>
                                        <View style={styles.billRowModern}>
                                            <Feather name="check-circle" size={16} color="#14532d" style={{ marginRight: 8 }} />
                                            <Text style={styles.billLabelModern}>Bayar</Text>
                                            <Text style={[styles.billValueModern, { color: '#14532d' }]}>Rp {formatRupiah(item.jmlbayar)}</Text>
                                        </View>

                                        <View style={styles.billRowModern}>
                                            <Feather name="check-circle" size={16} color="#14532d" style={{ marginRight: 8 }} />
                                            <Text style={styles.billLabelModern}>Bayar</Text>
                                            <Text style={[styles.billValueModern, { color: '#14532d' }]}>Rp {formatRupiah(item.jmlbayar)}</Text>
                                        </View>
                                        {/* <View style={styles.billRowModern}>
                                        <Feather name="alert-circle" size={16} color="#e53935" style={{ marginRight: 8 }} />
                                        <Text style={styles.billLabelModern}>Sisa Tagihan</Text>
                                        <Text style={[styles.billValueModern, { color: '#e53935' }]}>Rp {item.sisa.toLocaleString('id-ID')}</Text>
                                    </View> */}
                                    </TouchableOpacity>
                                ) : (
                                    <View key={idx} style={styles.billCard}>
                                        <View style={styles.billCardTopRow}>
                                            <Text style={styles.billCode}>Kode: {item.kode_jenis_biaya} {item.tahun_ajaran}</Text>
                                            <View style={styles.badgeKategoriModern}>
                                                <MaterialCommunityIcons name="label-outline" size={14} color="#14532d" style={{ marginRight: 4 }} />
                                                <Text style={styles.badgeKategoriTextModern}>{item.jenis_biaya}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.billTotalRow}>
                                            <View style={{ flex: 1 }} />
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                <Text style={styles.billTotalModern}>Rp {formatRupiah(item.jumlah)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.billRowModern}>
                                            <MaterialCommunityIcons name="ticket-percent" size={16} color="#e53935" style={{ marginRight: 8 }} />
                                            <Text style={styles.billLabelModern}>Potongan</Text>
                                            <Text style={[styles.billValueModern, { color: '#e53935' }]}>Rp {formatRupiah(item.jumlah_potongan)}</Text>
                                        </View>
                                        <View style={styles.billRowModern}>
                                            <MaterialCommunityIcons name="swap-horizontal" size={16} color="#e53935" style={{ marginRight: 8 }} />
                                            <Text style={styles.billLabelModern}>Mutasi</Text>
                                            <Text style={[styles.billValueModern, { color: '#e53935' }]}>Rp {formatRupiah(item.jumlah_mutasi)}</Text>
                                        </View>
                                        <View style={styles.billRowModern}>
                                            <Feather name="check-circle" size={16} color="#14532d" style={{ marginRight: 8 }} />
                                            <Text style={styles.billLabelModern}>Bayar</Text>
                                            <Text style={[styles.billValueModern, { color: '#14532d' }]}>Rp {formatRupiah(item.jmlbayar)}</Text>
                                        </View>
                                        {/* <View style={styles.billRowModern}>
                                        <Feather name="alert-circle" size={16} color="#e53935" style={{ marginRight: 8 }} />
                                        <Text style={styles.billLabelModern}>Sisa Tagihan</Text>
                                        <Text style={[styles.billValueModern, { color: '#e53935' }]}>Rp {item.sisa.toLocaleString('id-ID')}</Text>
                                    </View> */}
                                    </View>
                                )
                            ))
                        )
                    ) : (
                        // Daftar pembayaran
                        <>
                            {[
                                {
                                    no: '250600001',
                                    tanggal: '18 Juni 2025',
                                    jumlah: 400000,
                                    keterangan: 'SPP Juli',
                                    petugas: 'Adam Abdi Al Ala',
                                },
                                // Tambahkan data pembayaran lain jika perlu
                            ].map((item, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.paymentCard}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setSelectedPayment(item);
                                        setShowPaymentModal(true);
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <Text style={{ color: '#888', fontSize: 13 }}>{item.no}</Text>
                                        <Text style={{ color: '#888', fontSize: 13 }}>{item.tanggal}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                        <Text style={styles.paymentLabel}>Jumlah</Text>
                                        <Text style={styles.paymentValue}>Rp {item.jumlah.toLocaleString('id-ID')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                        <Text style={styles.paymentLabel}>Keterangan</Text>
                                        <Text style={styles.paymentValueDark}>{item.keterangan}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.paymentLabel}>Petugas</Text>
                                        <Text style={styles.paymentValueDarkBold}>{item.petugas}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {/* Modal Nota Pembayaran */}
                            {/*
                        Pastikan sudah install package QR code:
                        npm install react-native-qrcode-svg
                        */}
                            <Modal
                                visible={showPaymentModal}
                                animationType="slide"
                                transparent
                                onRequestClose={() => setShowPaymentModal(false)}
                            >
                                <View style={styles.paymentReceiptModal}>
                                    <View style={styles.paymentReceiptCard}>
                                        {/* Logo & Judul */}
                                        <View style={styles.paymentReceiptCenter}>
                                            <Image source={require('../assets/images/logo.png')} style={styles.paymentReceiptLogo} resizeMode="contain" />
                                            <Text style={styles.paymentReceiptSchool}>SDIT Cendekia Islami</Text>
                                            <Text style={styles.paymentReceiptAddress}>Jl. Pendidikan No. 123, Kota Edukasi</Text>
                                            <Text style={styles.paymentReceiptTitle}>Nota Pembayaran</Text>
                                        </View>
                                        <View style={styles.paymentReceiptDashed} />
                                        {selectedPayment && (
                                            <>
                                                <View style={styles.paymentReceiptRowJustify}>
                                                    <Text style={styles.paymentReceiptLabel}>No. Transaksi</Text>
                                                    <Text style={styles.paymentReceiptValueRight}>{selectedPayment.no}</Text>
                                                </View>
                                                <View style={styles.paymentReceiptRowJustify}>
                                                    <Text style={styles.paymentReceiptLabel}>Tanggal</Text>
                                                    <Text style={styles.paymentReceiptValueRight}>{selectedPayment.tanggal}</Text>
                                                </View>
                                                <View style={styles.paymentReceiptRowJustify}>
                                                    <Text style={styles.paymentReceiptLabel}>Jumlah</Text>
                                                    <Text style={[styles.paymentReceiptValueRight, { color: '#14532d', fontWeight: 'bold', fontSize: 16 }]}>Rp {selectedPayment.jumlah.toLocaleString('id-ID')}</Text>
                                                </View>
                                                <View style={styles.paymentReceiptRowJustify}>
                                                    <Text style={styles.paymentReceiptLabel}>Keterangan</Text>
                                                    <Text style={styles.paymentReceiptValueRight}>{selectedPayment.keterangan}</Text>
                                                </View>
                                                <View style={styles.paymentReceiptRowJustify}>
                                                    <Text style={styles.paymentReceiptLabel}>Petugas</Text>
                                                    <Text style={styles.paymentReceiptValueRight}>{selectedPayment.petugas}</Text>
                                                </View>
                                                <View style={styles.paymentReceiptDashed} />
                                                <View style={styles.paymentReceiptCenter}>
                                                    {/* @ts-ignore */}
                                                    <QRCode
                                                        value={selectedPayment.no}
                                                        size={90}
                                                        color="#236c30"
                                                        backgroundColor="#fff"

                                                    />
                                                    <Text style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Scan kode transaksi</Text>
                                                </View>
                                            </>
                                        )}
                                        <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={styles.paymentReceiptCloseBtn}>
                                            <Feather name="x" size={22} color="#222" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </>
                    )}
                    {/* Summary Total Tagihan hanya di tab Detail Biaya */}
                    {tab === 'detail' && (
                        <View style={styles.summaryCardGreen}>
                            {/* Ornamen dekoratif sudut kiri atas */}
                            <View style={[styles.summaryOrnament, { top: -24, left: -24, width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff2' }]} />
                            {/* Ornamen dekoratif sudut kanan bawah */}
                            <View style={[styles.summaryOrnament, { bottom: -24, right: -24, width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff1' }]} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>Total Tagihan</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#ffe082' }}>Rp 5.000.000</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>Total Bayar</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#fffde7' }}>Rp 2.500.000</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>Sisa Bayar</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#ffcdd2' }}>Rp 2.500.000</Text>
                            </View>
                        </View>
                    )}
                    {/* Modal Detail SPP */}
                    <Modal
                        visible={showSppModal}
                        animationType="slide"
                        transparent
                        onRequestClose={() => setShowSppModal(false)}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 18, width: '92%', maxWidth: 420, elevation: 5 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#236c30' }}>Detail SPP 2024/2025</Text>
                                    <TouchableOpacity onPress={() => setShowSppModal(false)}>
                                        <Feather name="x" size={24} color="#222" />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={{ maxHeight: 500 }} showsVerticalScrollIndicator={false}>
                                    {sppDetailList.map((item: { bulan: string, jatuhTempo: string, tagihan: number, bayar: number }, idx: number) => (
                                        <View key={idx} style={{ backgroundColor: '#d1e7dd', borderRadius: 14, padding: 12, marginBottom: 10 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#236c30' }}>{item.bulan}</Text>
                                                <Text style={{ fontSize: 12, color: '#888' }}>Jatuh Tempo: {item.jatuhTempo}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                                <Text style={{ color: '#236c30' }}>Tagihan</Text>
                                                <Text style={{ color: '#236c30', fontWeight: 'bold' }}>Rp {item.tagihan.toLocaleString('id-ID')}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                                <Text style={{ color: '#236c30' }}>Bayar</Text>
                                                <Text style={{ color: '#1976d2' }}>Rp {item.bayar.toLocaleString('id-ID')}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ color: '#236c30' }}>Sisa</Text>
                                                <Text style={{ color: '#e53935', fontWeight: 'bold' }}>Rp {(item.tagihan - item.bayar).toLocaleString('id-ID')}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, backgroundColor: '#236c30', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>TOTAL</Text>
                                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>Rp {totalSpp.toLocaleString('id-ID')}</Text>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </SafeAreaView >
            <BottomNavigation activeTab="tagihan" />
        </View >
    );
};

const styles = StyleSheet.create({
    paymentReceiptSchool: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#236c30',
        textAlign: 'center',
        marginTop: 4,
    },
    paymentReceiptAddress: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
        marginBottom: 4,
    },
    paymentReceiptRowJustify: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7,
        paddingHorizontal: 2,
    },
    paymentReceiptValueRight: {
        color: '#222',
        fontSize: 15,
        textAlign: 'right',
        fontWeight: '500',
        maxWidth: 160,
    },
    paymentReceiptLogo: {
        width: 64,
        height: 64,
        marginBottom: 4,
        alignSelf: 'center',
    },
    paymentReceiptDashed: {
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#bbb',
        marginVertical: 10,
    },
    paymentReceiptCenter: {
        alignItems: 'center',
        marginBottom: 7,
    },
    paymentReceiptQR: {
        marginTop: 8,
        marginBottom: 0,
        alignSelf: 'center',
    },
    paymentReceiptModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentReceiptCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 22,
        minWidth: 310,
        maxWidth: 360,
        width: '90%',
        elevation: 6,
        shadowColor: '#222',
        shadowOpacity: 0.10,
        shadowRadius: 14,
    },
    paymentReceiptTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#236c30',
        textAlign: 'center',
        flex: 1,
    },
    paymentReceiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    paymentReceiptLabel: {
        color: '#888',
        fontSize: 15,
        minWidth: 110,
    },
    paymentReceiptValue: {
        color: '#222',
        fontSize: 15,
        textAlign: 'right',
        flex: 1,
    },
    paymentReceiptCloseBtn: {
        marginLeft: 10,
        padding: 4,
    },
    paymentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        marginBottom: 6,
        shadowColor: '#14532d',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    paymentLabel: {
        color: '#888',
        fontSize: 14,
        minWidth: 72,
    },
    paymentValue: {
        color: '#14532d',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
    },
    paymentValueDark: {
        color: '#222',
        fontSize: 15,
        marginLeft: 8,
    },
    paymentValueDarkBold: {
        color: '#222',
        fontSize: 15,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    summaryCardGreen: {
        backgroundColor: '#14532d',
        borderRadius: 18,
        padding: 18,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#14532d',
        shadowOpacity: 0.09,
        shadowRadius: 10,
        elevation: 3,
        position: 'relative',
        overflow: 'hidden',
    },
    summaryOrnament: {
        position: 'absolute',
        zIndex: 0,
    },
    profileCardGreen: {
        backgroundColor: '#14532d',
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        paddingVertical: 30,
        marginBottom: 10,
        marginTop: 30,
        shadowColor: '#14532d',
        shadowOpacity: 0.13,
        shadowRadius: 14,
        elevation: 5,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        gap: 5,
    },
    profileOrnamentTopLeft: {
        position: 'absolute',
        top: -30,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff2',
        zIndex: 0,
    },
    profileOrnamentBottomRight: {
        position: 'absolute',
        bottom: -30,
        right: -30,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#fff1',
        zIndex: 0,
    },
    profileAvatarGradientGreen: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#e6f3ea',
        zIndex: 1,
    },
    profileNameFancyGreen: {
        fontWeight: 'bold',
        fontSize: 19,
        color: '#fff',
        marginBottom: 5,
        letterSpacing: 0.1,
        zIndex: 1,
    },
    profileBadgeTextGreen: {
        fontSize: 13,
        fontWeight: '600',
        color: '#14532d',
    },
    profileInfoFancyGreen: {
        color: '#fff',
        fontSize: 13,
        marginRight: 8,
        zIndex: 1,
    },
    profileAvatarWrap: {
        marginRight: 16,
    },
    profileAvatarGradient: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: 'linear-gradient(135deg,#e6f3ea,#e3f2fd)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#14532d',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    profileNameFancy: {
        fontWeight: 'bold',
        fontSize: 19,
        color: '#222',
        marginBottom: 5,
        letterSpacing: 0.1,
    },
    profileBadgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 6,
        alignItems: 'center',
    },
    profileBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 4,
    },
    profileBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#14532d',
    },
    profileInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        gap: 3,
    },
    profileInfoFancy: {
        color: '#555',
        fontSize: 13,
        marginRight: 8,
    },
    tabGroupModern: {
        flexDirection: 'row',
        backgroundColor: '#388e3c',
        borderRadius: 16,
        padding: 4,
        marginBottom: 5,
        marginTop: 5,
        shadowColor: '#14532d',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    tabBtnModern: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#14532d',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
        transitionDuration: '200ms',
    },
    tabBtnModernActive: {
        backgroundColor: '#14532d',
        shadowOpacity: 0.10,
        elevation: 2,
    },
    tabBtnTextModern: {
        color: '#14532d',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
        letterSpacing: 0.1,
        transitionDuration: '200ms',
    },
    tabBtnTextModernActive: {
        color: '#fff',
    },
    filterRowNoLabel: {
        marginBottom: 22,
        marginTop: 10,
    },
    dropdownPickerFull: {
        borderWidth: 0,
        borderRadius: 14,
        backgroundColor: '#f1f7f4',
        width: '100%',
        height: 42,
        justifyContent: 'center',
        shadowColor: '#14532d',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
        paddingHorizontal: 4,
    },
    pickerSelectModern: {
        width: '100%',
        color: '#222',
        fontSize: 15,
        fontWeight: '600',
        backgroundColor: 'transparent',
        padding: 10,
    },
    billCard: {
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 20,
        marginBottom: 10,
        shadowColor: '#14532d',
        shadowOpacity: 0.09,
        shadowRadius: 10,
        elevation: 3,
    },
    billCardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    billTotalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    billTotalModern: {
        fontWeight: 'bold',
        color: '#14532d',
        fontSize: 22,
        letterSpacing: 0.1,
    },
    billCode: {
        fontWeight: '600',
        color: '#6a7c7b',
        fontSize: 14,
        marginBottom: 0,
        letterSpacing: 0.1,
    },
    badgeKategoriModern: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d1e7dd',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 3,
        marginLeft: 8,
        shadowColor: '#14532d',
        shadowOpacity: 0.07,
        shadowRadius: 3,
        elevation: 1,
    },
    badgeKategoriTextModern: {
        color: '#14532d',
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 0.2,
    },
    billRowModern: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
        paddingLeft: 3,
    },
    billLabelModern: {
        color: '#666',
        fontSize: 14,
        flex: 1,
        marginLeft: 2,
    },
    billValueModern: {
        fontWeight: '600',
        fontSize: 14,
        minWidth: 92,
        textAlign: 'right',
        marginLeft: 10,
    },
});

export default TagihanScreen;