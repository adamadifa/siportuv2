import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function IndexScreen() {
    const router = useRouter();
    const hasNavigated = useRef(false);

    useEffect(() => {
        console.log('🎯 INDEX SCREEN: Component mounted, checking auth...');

        // Prevent multiple navigation calls
        if (hasNavigated.current) {
            console.log('🎯 INDEX SCREEN: Already navigated, skipping...');
            return;
        }

        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                // Mark as navigated before navigation
                hasNavigated.current = true;

                if (token) {
                    console.log('🎯 INDEX SCREEN: Token found, redirecting to home');
                    router.replace('/home');
                } else {
                    console.log('🎯 INDEX SCREEN: No token, redirecting to login');
                    router.replace('/login');
                }
            } catch (error) {
                console.log('🎯 INDEX SCREEN: Error checking auth, defaulting to login');
                hasNavigated.current = true;
                router.replace('/login');
            }
        };

        // Add small delay to prevent race conditions
        const timer = setTimeout(checkAuth, 50);
        return () => clearTimeout(timer);
    }, []);

    // Return null since this is just a redirect component
    return null;
}
