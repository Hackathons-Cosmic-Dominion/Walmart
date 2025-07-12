// Simple theme object without @shopify/restyle dependency
const palette = {
  // Walmart Blue
  primaryBlue: '#0071DC',
  primaryBlueDark: '#0056B3',
  primaryBlueLight: '#4A90E2',
  
  // Secondary colors
  secondaryYellow: '#FFC220',
  secondaryOrange: '#FF6B35',
  
  // Grays
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

const theme = {
  colors: {
    ...palette,
    primary: palette.primaryBlue,
    primaryDark: palette.primaryBlueDark,
    primaryLight: palette.primaryBlueLight,
    secondary: palette.secondaryYellow,
    background: palette.white,
    surface: palette.white,
    text: palette.gray900,
    textSecondary: palette.gray600,
    textTertiary: palette.gray400,
    border: palette.gray200,
    divider: palette.gray100,
    card: palette.gray100,
    placeholder: palette.gray400,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },
  textVariants: {
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'text',
    },
    header2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'text',
    },
    header3: {
      fontSize: 20,
      fontWeight: '600',
      color: 'text',
    },
    body: {
      fontSize: 16,
      color: 'text',
    },
    bodySmall: {
      fontSize: 14,
      color: 'textSecondary',
    },
    caption: {
      fontSize: 12,
      color: 'textTertiary',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'primary',
    },
    priceSmall: {
      fontSize: 14,
      fontWeight: '600',
      color: 'primary',
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
};

export type Theme = typeof theme;
export default theme; 