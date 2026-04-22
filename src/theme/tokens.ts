export const palette = {
  // Primary - Corporate Blue
  navy: '#0F172A',
  navyLight: '#1E293B',
  blue: '#2563EB',
  blueDim: '#1D4ED8',
  blueLight: '#3B82F6',
  blueMuted: '#60A5FA',

  // Accent
  teal: '#0D9488',
  tealLight: '#14B8A6',

  // Status Colors
  green: '#10B981',
  greenLight: '#34D399',
  amber: '#F59E0B',
  amberLight: '#FBBF24',
  red: '#EF4444',
  redLight: '#F87171',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  black: '#020617',
} as const;

export const darkColors = {
  background: palette.navy,
  backgroundAlt: '#0C1222',
  surface: palette.navyLight,
  surfaceElevated: '#263349',
  muted: palette.gray800,
  border: palette.gray700,
  borderSubtle: '#2D3D53',

  text: palette.gray50,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  textInverse: palette.navy,

  primary: palette.blue,
  primaryDim: palette.blueDim,
  primaryGlow: palette.blueLight,
  primaryMuted: palette.blueMuted,

  accent: palette.teal,
  accentLight: palette.tealLight,

  success: palette.green,
  successLight: palette.greenLight,
  info: palette.blueLight,
  warning: palette.amber,
  warningLight: palette.amberLight,
  danger: palette.red,
  dangerLight: palette.redLight,

  sentimentPositive: palette.green,
  sentimentNegative: palette.red,
  sentimentNeutral: palette.amber,

  chart1: palette.blue,
  chart2: palette.teal,
  chart3: palette.green,
  chart4: palette.amber,
  chart5: palette.red,

  tabBarBackground: '#0A0F1C',
  tabBarBorder: palette.gray800,
  tabBarActive: palette.blue,
  tabBarInactive: palette.gray500,

  cardGlass: 'rgba(30, 41, 59, 0.8)',
  overlay: 'rgba(0, 0, 0, 0.7)',

  inputBackground: palette.navyLight,
  statusBarStyle: 'light' as const,
};

export const lightColors = {
  background: palette.white,
  backgroundAlt: palette.gray50,
  surface: palette.gray50,
  surfaceElevated: palette.white,
  muted: palette.gray100,
  border: palette.gray200,
  borderSubtle: palette.gray100,

  text: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray500,
  textInverse: palette.white,

  primary: palette.blue,
  primaryDim: palette.blueDim,
  primaryGlow: palette.blueLight,
  primaryMuted: palette.blueMuted,

  accent: palette.teal,
  accentLight: palette.tealLight,

  success: palette.green,
  successLight: palette.greenLight,
  info: palette.blueLight,
  warning: palette.amber,
  warningLight: palette.amberLight,
  danger: palette.red,
  dangerLight: palette.redLight,

  sentimentPositive: palette.green,
  sentimentNegative: palette.red,
  sentimentNeutral: palette.amber,

  chart1: palette.blue,
  chart2: palette.teal,
  chart3: palette.green,
  chart4: palette.amber,
  chart5: palette.red,

  tabBarBackground: palette.white,
  tabBarBorder: palette.gray200,
  tabBarActive: palette.blue,
  tabBarInactive: palette.gray400,

  cardGlass: 'rgba(255, 255, 255, 0.9)',
  overlay: 'rgba(15, 23, 42, 0.4)',

  inputBackground: palette.gray100,
  statusBarStyle: 'dark' as const,
};

export type ThemeColors = {
  [K in keyof typeof darkColors]: string;
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: palette.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
} as const;
