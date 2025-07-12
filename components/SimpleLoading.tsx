import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import theme from '../theme';

interface SimpleLoadingProps {
  onLoadingComplete?: () => void;
}

const SimpleLoading: React.FC<SimpleLoadingProps> = ({ onLoadingComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Simple fade and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto complete after 2 seconds
    const timer = setTimeout(() => {
      onLoadingComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onLoadingComplete]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <Image
          source={require('../../assets/images/spark-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* App Name */}
        <Text style={styles.appName}>Walmart</Text>
        <Text style={styles.tagline}>Save Money. Live Better.</Text>
        
        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.white} 
            style={styles.spinner}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: theme.colors.white,
    marginBottom: theme.spacing.xl,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  tagline: {
    fontSize: 14,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: theme.spacing.xl * 2,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: theme.spacing.m,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.white,
    opacity: 0.7,
  },
});

export default SimpleLoading;
