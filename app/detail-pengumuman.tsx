import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { fetchDetailPengumuman } from '../constants/api';

const { width } = Dimensions.get('window');

// Skeleton Component
const Skeleton = ({ width: skeletonWidth, height, style }: { width: number | string; height: number; style?: any }) => (
    <View
        style={[
            {
                width: skeletonWidth,
                height,
                backgroundColor: '#e1e9ee',
                borderRadius: 4,
            },
            style,
        ]}
    />
);

// Skeleton Card Component
const SkeletonCard = () => (
    <View style={styles.skeletonCard}>
        <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="95%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="85%" height={16} style={{ marginBottom: 20 }} />
        <View style={styles.skeletonInfoContainer}>
            <Skeleton width="45%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="40%" height={16} />
        </View>
    </View>
);

export default function DetailPengumumanScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [pengumuman, setPengumuman] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) {
                setError('ID pengumuman tidak ditemukan');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await fetchDetailPengumuman(parseInt(id));
                console.log('HASIL DETAIL PENGUMUMAN:', data);

                if (data.success && data.data) {
                    setPengumuman(data.data);
                } else {
                    setError('Data pengumuman tidak ditemukan');
                }
            } catch (err: any) {
                setError(err.message || 'Gagal mengambil detail pengumuman');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const getCategoryColor = (kategori: string) => {
        switch (kategori) {
            case 'keuangan':
                return { bg: '#e3f2fd', text: '#1976d2', icon: '#1976d2' };
            case 'akademik':
                return { bg: '#fffde7', text: '#f57c00', icon: '#f57c00' };
            case 'liburan':
                return { bg: '#fff3e0', text: '#ff6f00', icon: '#ff6f00' };
            default:
                return { bg: '#e0e0e0', text: '#666', icon: '#666' };
        }
    };

    const getCategoryIcon = (kategori: string) => {
        switch (kategori) {
            case 'keuangan':
                return 'dollar-sign';
            case 'akademik':
                return 'book';
            case 'liburan':
                return 'calendar';
            default:
                return 'bell';
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <SkeletonCard />
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <View style={styles.errorIconContainer}>
                    <Feather name="alert-circle" size={64} color="#e53935" />
                </View>
                <Text style={styles.errorTitle}>Oops! Terjadi Kesalahan</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.retryButtonText}>Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!pengumuman) {
        return (
            <View style={styles.errorContainer}>
                <View style={styles.errorIconContainer}>
                    <Feather name="file-text" size={64} color="#888" />
                </View>
                <Text style={styles.errorTitle}>Pengumuman Tidak Ditemukan</Text>
                <Text style={styles.errorText}>Pengumuman yang Anda cari tidak dapat ditemukan atau telah dihapus.</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.retryButtonText}>Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const categoryColors = getCategoryColor(pengumuman.kategori);
    const categoryIcon = getCategoryIcon(pengumuman.kategori);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.heroBackground} />
                        <View style={styles.heroContent}>
                            {/* Back Button */}
                            <TouchableOpacity
                                style={styles.backButtonHero}
                                onPress={() => router.back()}
                            >
                                <Feather name="arrow-left" size={24} color="#fff" />
                            </TouchableOpacity>

                            <View style={styles.categoryIconContainer}>
                                <Feather name={categoryIcon as any} size={24} color={categoryColors.icon} />
                            </View>
                            <Text style={styles.heroTitle}>{pengumuman.judul}</Text>
                            <View style={[
                                styles.categoryBadge,
                                { backgroundColor: categoryColors.bg }
                            ]}>
                                <Feather name={categoryIcon as any} size={14} color={categoryColors.text} style={{ marginRight: 6 }} />
                                <Text style={[styles.categoryText, { color: categoryColors.text }]}>
                                    {pengumuman.kategori}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Card Pengumuman */}
                    <View style={styles.card}>
                        {/* Konten */}
                        <View style={styles.contentContainer}>
                            <View style={styles.contentHeader}>
                                <Feather name="file-text" size={20} color="#18492b" />
                                <Text style={styles.contentTitle}>Isi Pengumuman</Text>
                            </View>
                            <Text style={styles.contentText}>{pengumuman.isi}</Text>
                        </View>

                        {/* Informasi Tambahan */}
                        <View style={styles.infoContainer}>
                            <View style={styles.infoHeader}>
                                <Feather name="info" size={18} color="#18492b" />
                                <Text style={styles.infoTitle}>Informasi Detail</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <View style={styles.infoIconContainer}>
                                    <Feather name="calendar" size={16} color="#666" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Tanggal</Text>
                                    <Text style={styles.infoValue}>{pengumuman.tanggal}</Text>
                                </View>
                            </View>
                            <View style={styles.infoItem}>
                                <View style={styles.infoIconContainer}>
                                    <Feather name="tag" size={16} color="#666" />
                                </View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Kategori</Text>
                                    <Text style={styles.infoValue}>{pengumuman.kategori}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    safeArea: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 32,
    },
    errorIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#18492b',
        marginBottom: 12,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#388e3c',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#388e3c',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    // Hero Section
    heroSection: {
        position: 'relative',
        height: 200,
        marginBottom: 16,
    },
    heroBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#388e3c',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    heroContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    categoryIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 32,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    // Card
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },

    // Content
    contentContainer: {
        marginBottom: 24,
    },
    contentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#18492b',
        marginLeft: 12,
    },
    contentText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 26,
        textAlign: 'justify',
    },
    // Info
    infoContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 20,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#18492b',
        marginLeft: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        color: '#18492b',
        fontWeight: '500',
    },
    // Skeleton
    skeletonCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    skeletonInfoContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 20,
    },
    backButtonHero: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
});
