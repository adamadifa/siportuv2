import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const lottieFiles = [
  require('@/assets/lottie/welcome.json'),
  require('@/assets/lottie/tagihan.json'),
  require('@/assets/lottie/presensi.json'),
];

const steps = [
  {
    title: 'Selamat Datang',
    description: 'Terima kasih telah menggunakan SIPORTU! Aplikasi modern untuk Memonitoring Santri',
  },
  {
    title: 'Fitur Tagihan',
    description: 'Pantau dan kelola semua tagihan akademik  dengan mudah dan transparan.',
  },
  {
    title: 'Fitur Presensi',
    description: 'Pantau kehadiran santri secara realtime dan akurat. ',
  },
];

interface IntroductionScreenProps {
  onFinish: () => void;
}

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Console log when intro screen mounts
  React.useEffect(() => {
    console.log('📖 INTRODUCTION SCREEN: Component mounted and rendered');
    return () => {
      console.log('📖 INTRODUCTION SCREEN: Component unmounted');
    };
  }, []);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      flatListRef.current?.scrollToIndex({ index: step + 1 });
    } else {
      // Immediately call onFinish without any delay
      onFinish();
    }
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.slide}>

      {/* Step Welcome: tampilkan logo saja, step lain: Lottie */}
      <View style={styles.lottieWrapper}>
        {index === 0 ? (
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 120, height: 120, resizeMode: 'contain' }}
          />
        ) : (
          <LottieView
            source={lottieFiles[index]}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#fff", "#e8f5e9", "#c8e6c9"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <FlatList
        ref={flatListRef}
        data={steps}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        extraData={step}
      />
      <View style={styles.dotsContainer}>
        {steps.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, step === idx && styles.dotActive]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={handleNext}>
        <Feather name="arrow-right" size={28} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    overflow: 'visible',
  },

  lottieWrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
    zIndex: 1,
  },
  lottie: {
    width: 210,
    height: 210,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 18,
    textAlign: 'center',
  },
  desc: {
    fontSize: 18,
    color: '#388E3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#388E3C',
    marginHorizontal: 5,
    opacity: 0.4,
  },
  dotActive: {
    opacity: 1,
    backgroundColor: '#fff',
  },
  iconButton: {
    backgroundColor: '#43A047',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#388E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
});

export default IntroductionScreen;
