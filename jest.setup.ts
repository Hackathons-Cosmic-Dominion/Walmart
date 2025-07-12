import '@testing-library/react-native/extend-expect';

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: () => '/',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native-reanimated', () => {
  try {
    const Reanimated = jest.requireActual('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return Reanimated;
  } catch {
    return {
      default: {
        call: () => {},
        createAnimatedComponent: jest.fn(),
        configureProps: jest.fn(),
        addWhitelistedNativeProps: jest.fn(),
        addWhitelistedUIProps: jest.fn(),
      },
      Value: jest.fn(),
      Clock: jest.fn(),
      timing: jest.fn(),
      spring: jest.fn(),
      decay: jest.fn(),
      sequence: jest.fn(),
      parallel: jest.fn(),
      delay: jest.fn(),
      loop: jest.fn(),
      cond: jest.fn(),
      clockRunning: jest.fn(),
      stopClock: jest.fn(),
      startClock: jest.fn(),
      set: jest.fn(),
      block: jest.fn(),
      and: jest.fn(),
      or: jest.fn(),
      not: jest.fn(),
      eq: jest.fn(),
      neq: jest.fn(),
      lessThan: jest.fn(),
      greaterThan: jest.fn(),
      lessOrEq: jest.fn(),
      greaterOrEq: jest.fn(),
      add: jest.fn(),
      sub: jest.fn(),
      multiply: jest.fn(),
      divide: jest.fn(),
      pow: jest.fn(),
      modulo: jest.fn(),
      abs: jest.fn(),
      min: jest.fn(),
      max: jest.fn(),
      round: jest.fn(),
      floor: jest.fn(),
      ceil: jest.fn(),
      sqrt: jest.fn(),
      log: jest.fn(),
      sin: jest.fn(),
      cos: jest.fn(),
      tan: jest.fn(),
      asin: jest.fn(),
      acos: jest.fn(),
      atan: jest.fn(),
      exp: jest.fn(),
    };
  }
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaConsumer: ({ children }: { children: (inset: any) => React.ReactNode }) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});
