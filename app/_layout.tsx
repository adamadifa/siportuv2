import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';

import IntroductionScreen from '@/components/IntroductionScreen';
import React from 'react';
import SplashScreen from './SplashScreen';

// Prevent the native splash screen from auto-hiding
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [showSplash, setShowSplash] = React.useState(true);
  const [showIntro, setShowIntro] = React.useState(true);
  const [hasFinishedIntro, setHasFinishedIntro] = React.useState(false);
  const navigationRef = React.useRef<any>(null);
  const isInitializedRef = React.useRef(false);

  React.useEffect(() => {
    if (loaded && !isInitializedRef.current) {
      isInitializedRef.current = true;

      // Immediately hide native splash screen to show our custom one
      ExpoSplashScreen.hideAsync().then(() => {
        console.log('🎬 LAYOUT: Native splash hidden, showing custom splash');
      });

      // Check if we've already finished splash screen and intro
      Promise.all([
        AsyncStorage.getItem('splashFinished'),
        AsyncStorage.getItem('introFinished')
      ]).then(([splashFinished, introFinished]) => {
        if (splashFinished === 'true' && introFinished === 'true') {
          console.log('🎬 LAYOUT: Splash and intro already finished, checking auth directly');
          setShowSplash(false);
          setShowIntro(false);
          setHasFinishedIntro(true);
          // Check auth immediately and navigate directly to avoid index.tsx
          setTimeout(async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (token) {
                console.log('🎯 LAYOUT: Token found, going directly to home');
                router.replace('/home');
              } else {
                console.log('🎯 LAYOUT: No token, going directly to login');
                router.replace('/login');
              }
            } catch (error) {
              console.log('🎯 LAYOUT: Error checking token, defaulting to login');
              router.replace('/login');
            }
          }, 100);
        } else if (splashFinished === 'true') {
          console.log('🎬 LAYOUT: Splash finished but intro not finished, showing intro');
          setShowSplash(false);
          setShowIntro(true);
        } else {
          // First time, show custom splash screen
          console.log('🎬 LAYOUT: First time, showing custom splash screen');
          const timer = setTimeout(async () => {
            console.log('🎬 LAYOUT: Custom splash screen finished, showing intro');
            await AsyncStorage.setItem('splashFinished', 'true');
            setShowSplash(false);
            // Don't set hasFinishedIntro yet, let intro handle it
          }, 2000);
          return () => clearTimeout(timer);
        }
      });
    }
  }, [loaded]);

  // Handle introduction finish
  const handleIntroFinish = async () => {
    console.log('🎬 INTRO FINISH: Starting intro finish process...');

    // Mark intro as finished and hide intro screen
    await AsyncStorage.setItem('introFinished', 'true');
    setShowIntro(false);
    setHasFinishedIntro(true);

    // Check token immediately and navigate directly
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        console.log('🎯 INTRO FINISH: Token found, going directly to home');
        router.replace('/home');
      } else {
        console.log('🎯 INTRO FINISH: No token, going directly to login');
        router.replace('/login');
      }
    } catch (error) {
      console.log('🎯 INTRO FINISH: Error checking token, defaulting to login');
      router.replace('/login');
    }
  };

  // Pre-load login and home screens to avoid delay
  React.useEffect(() => {
    if (loaded && !showSplash && showIntro) {
      // Pre-warm the router during intro screen
      router.prefetch('/login');
      router.prefetch('/home');
      console.log('🚀 LAYOUT: Pre-loading login and home screens');
    }
  }, [loaded, showSplash, showIntro]);

  if (!loaded) {
    // Async font loading only occurs in development.
    // Keep showing nothing until fonts are loaded and native splash is hidden
    return null;
  }

  console.log('🔄 LAYOUT STATE:', { showSplash, showIntro, hasFinishedIntro, loaded });

  if (showSplash) {
    console.log('🎬 LAYOUT: Rendering Custom Splash Screen');
    return <SplashScreen />;
  }

  if (showIntro && !hasFinishedIntro) {
    console.log('🎯 LAYOUT: Rendering Introduction Screen');
    return <IntroductionScreen onFinish={handleIntroFinish} />;
  }

  console.log('🚀 LAYOUT: Rendering Main App (Stack Navigation)');

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="tagihan" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="profil" options={{ headerShown: false }} />
          <Stack.Screen name="ubah-password" options={{ headerShown: false }} />
          <Stack.Screen name="presensi" options={{ headerShown: false }} />
          <Stack.Screen name="profil-siswa" options={{ headerShown: false }} />
          <Stack.Screen name="detail-pengumuman" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
