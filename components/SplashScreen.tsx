import { Image } from 'expo-image';
import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const AnimatedLogo = () => {
  // Bouncing logo
  const bounce = React.useRef(new Animated.Value(0)).current;

  // Ripple animation (multiple ripples)
  const ripple1 = React.useRef(new Animated.Value(0)).current;
  const ripple2 = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Bouncing logo (up-down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -20,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ripple 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(ripple1, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(ripple1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
    // Ripple 2 (delayed)
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ripple2, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(ripple2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 700);
  }, [bounce, ripple1, ripple2]);

  // Ripple style interpolation
  const rippleStyle = (ripple: Animated.Value) => ({
    position: 'absolute' as const,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.13)',
    top: -20,
    left: -20,
    transform: [
      { scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.4] }) },
    ],
    opacity: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={rippleStyle(ripple1)} />
      <Animated.View style={rippleStyle(ripple2)} />
      <Animated.View
        style={{
          transform: [
            { translateY: bounce },
          ],
        }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logoImage}
            contentFit="contain"
          />
        </View>
      </Animated.View>

    </View>
  );
};

const SplashScreen = () => {
  // Console log when splash screen mounts
  React.useEffect(() => {
    console.log('💦 SPLASH SCREEN: Component mounted and rendered');
    return () => {
      console.log('💦 SPLASH SCREEN: Component unmounted');
    };
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B5E20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

});

export default SplashScreen;
