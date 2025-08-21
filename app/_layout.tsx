import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import IntroductionScreen from '@/components/IntroductionScreen';
import React from 'react';
import SplashScreen from './SplashScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [showSplash, setShowSplash] = React.useState(true);
  const [showIntro, setShowIntro] = React.useState(true);
  const navigationRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  // Pre-load login screen to avoid delay
  React.useEffect(() => {
    if (!showSplash && !showIntro) {
      // Pre-warm the router
      router.prefetch('/login');
    }
  }, [showSplash, showIntro]);

  // Handle introduction finish
  const handleIntroFinish = async () => {
    // Immediately hide intro screen and navigate
    setShowIntro(false);
    router.push('/login');

    // Check token in background without blocking navigation
    setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          router.replace('/home');
        }
      } catch (error) {
        console.log('Error checking token:', error);
      }
    }, 100);
  };

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showIntro) {
    return <IntroductionScreen onFinish={handleIntroFinish} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="tagihan" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail-pengumuman" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
