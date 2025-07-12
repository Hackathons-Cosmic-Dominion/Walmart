import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start all animations
    const animations = Animated.parallel([
      // Fade in the main content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale animation for logo
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Slide up animation for text
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      // Rotation animation for spark icon
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ),
      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        delay: 500,
        useNativeDriver: false,
      }),
    ]);

    animations.start();

    // Auto complete loading after 3 seconds
    const timer = setTimeout(() => {
      onLoadingComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideAnim, rotateAnim, progressAnim, onLoadingComplete]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated Spark Icon */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.sparkIconContainer,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <Image
              source={require('../assets/images/spark-icon.png')}
              style={styles.sparkIcon}
              resizeMode="contain"
            />
          </Animated.View>
          
          {/* Main Logo */}
          <Image
            source={require('../assets/images/spark-icon.png')}
            style={styles.mainLogo}
            resizeMode="contain"
          />
        </View>

        {/* App Name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.appName}>Walmart</Text>
          <Text style={styles.tagline}>Save Money. Live Better.</Text>
        </Animated.View>

        {/* Loading Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.loadingTextContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.loadingText}>Loading your shopping experience...</Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Floating particles effect */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: fadeAnim,
              },
            ]}
          />
        ))}
      </View>
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
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 2,
    position: 'relative',
  },
  sparkIconContainer: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    zIndex: 1,
  },
  sparkIcon: {
    width: 40,
    height: 40,
    tintColor: theme.colors.secondaryYellow,
  },
  mainLogo: {
    width: 120,
    height: 120,
    tintColor: theme.colors.white,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 3,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '300',
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.m,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.secondaryYellow,
    borderRadius: 2,
  },
  loadingTextContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '300',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: theme.colors.white,
    borderRadius: 2,
    opacity: 0.3,
  },
});

export default LoadingScreen;
