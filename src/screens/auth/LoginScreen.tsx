import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Pressable, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeIn, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, TrendingUp, BarChart2, Globe, Shield } from 'lucide-react-native';
import { useTheme, spacing, palette, radius, shadows } from '@/theme';
import { typePresets, fontFamily } from '@/theme/typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { useAuthStore } from '@/store/authStore';
import { requestPasswordReset } from '@/services/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type AuthMode = 'signin' | 'signup';

const { width } = Dimensions.get('window');

export function LoginScreen({ navigation }: Props) {
  const { colors, isDark } = useTheme();
  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@newsflash.ai');
  const [password, setPassword] = useState('demo123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const passwordToggle = useMemo(() => (
    <Pressable
      onPress={() => setShowPassword((current) => !current)}
      accessibilityRole="button"
      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {showPassword ? (
        <EyeOff size={18} color={colors.textTertiary} strokeWidth={2} />
      ) : (
        <Eye size={18} color={colors.textTertiary} strokeWidth={2} />
      )}
    </Pressable>
  ), [colors.textTertiary, showPassword]);

  const confirmPasswordToggle = useMemo(() => (
    <Pressable
      onPress={() => setShowConfirmPassword((current) => !current)}
      accessibilityRole="button"
      accessibilityLabel={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {showConfirmPassword ? (
        <EyeOff size={18} color={colors.textTertiary} strokeWidth={2} />
      ) : (
        <Eye size={18} color={colors.textTertiary} strokeWidth={2} />
      )}
    </Pressable>
  ), [colors.textTertiary, showConfirmPassword]);

  const handleModeChange = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
  }, []);

  const handleAuth = useCallback(async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError(mode === 'signup' ? 'Complete the required account fields to continue.' : 'Please enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Add your full name to create the account.');
        return;
      }

      if (password.length < 6) {
        setError('Use at least 6 characters for the account password.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Password confirmation does not match.');
        return;
      }
    }

    setError('');
    setNotice('');

    try {
      if (mode === 'signup') {
        navigation.navigate('SignupOnboarding', {
          name: name.trim(),
          email: trimmedEmail,
          password,
          rememberSession,
        });
        return;
      }

      const result = await signIn(trimmedEmail, password, rememberSession);
      if (result.needsTenantSelect) {
        navigation.navigate('TenantSelect');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
  }, [confirmPassword, email, mode, name, navigation, password, rememberSession, signIn]);

  const handleForgotPassword = useCallback(async () => {
    if (!email.trim()) {
      setError('Enter your email first, then request a reset link.');
      return;
    }

    setError('');
    setNotice('');

    try {
      await requestPasswordReset(email.trim());
      setNotice(`Password reset instructions sent to ${email.trim()}.`);
    } catch (err: any) {
      setError(err.message || 'Unable to send reset instructions right now.');
    }
  }, [email]);

  const features = [
    { icon: TrendingUp, label: 'Real-time Market Data' },
    { icon: BarChart2, label: 'Advanced Analytics' },
    { icon: Globe, label: 'Global Coverage' },
    { icon: Shield, label: 'Enterprise Security' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Background gradient */}
      <LinearGradient
        colors={isDark 
          ? [colors.background, palette.navyLight, colors.background]
          : [colors.background, palette.gray50, colors.background]
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative elements */}
      <View style={[styles.decorCircle, styles.decorCircle1, { backgroundColor: palette.blue + '08' }]} />
      <View style={[styles.decorCircle, styles.decorCircle2, { backgroundColor: palette.teal + '06' }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: palette.blue }]}>
              <TrendingUp size={28} color={palette.white} strokeWidth={2.5} />
            </View>
            <Text style={[styles.brandName, { color: colors.text }]}>NewsFlash</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              Market Intelligence Platform
            </Text>
          </Animated.View>

          {/* Features Row */}
          <Animated.View entering={FadeIn.delay(300).duration(500)} style={styles.featuresRow}>
            {features.map((feature, index) => (
              <View key={feature.label} style={styles.featureItem}>
                <feature.icon size={16} color={colors.primary} strokeWidth={2} />
                <Text style={[styles.featureLabel, { color: colors.textSecondary }]}>
                  {feature.label}
                </Text>
              </View>
            ))}
          </Animated.View>

          {/* Card Container */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify().damping(18)}
            style={[
              styles.card, 
              { 
                backgroundColor: isDark ? colors.surface : colors.surfaceElevated,
                borderColor: colors.border,
              },
              !isDark && shadows.card,
            ]}
          >
            {/* Mode Toggle */}
            <View style={[styles.modeToggle, { backgroundColor: colors.muted }]}>
              <Pressable
                style={[
                  styles.modeButton,
                  mode === 'signin' && { backgroundColor: colors.primary },
                ]}
                onPress={() => handleModeChange('signin')}
              >
                <Text style={[
                  styles.modeButtonText,
                  { color: mode === 'signin' ? palette.white : colors.textSecondary },
                ]}>
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modeButton,
                  mode === 'signup' && { backgroundColor: colors.primary },
                ]}
                onPress={() => handleModeChange('signup')}
              >
                <Text style={[
                  styles.modeButtonText,
                  { color: mode === 'signup' ? palette.white : colors.textSecondary },
                ]}>
                  Sign Up
                </Text>
              </Pressable>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {mode === 'signup' && (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                />
              )}

              <Input
                label="Email Address"
                placeholder="you@company.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete={mode === 'signin' ? 'password' : 'new-password'}
                rightIcon={passwordToggle}
              />

              {mode === 'signup' && (
                <Input
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                  rightIcon={confirmPasswordToggle}
                />
              )}

              {/* Remember Session */}
              <View style={[styles.rememberRow, { borderColor: colors.border }]}>
                <View style={styles.rememberContent}>
                  <Text style={[typePresets.label, { color: colors.text }]}>
                    Remember me
                  </Text>
                  <Text style={[typePresets.bodySm, { color: colors.textTertiary }]}>
                    Stay signed in on this device
                  </Text>
                </View>
                <Toggle value={rememberSession} onValueChange={setRememberSession} />
              </View>

              {/* Error/Notice Messages */}
              {error ? (
                <View style={[styles.messageBox, { backgroundColor: colors.danger + '12' }]}>
                  <Text style={[typePresets.bodySm, { color: colors.danger }]}>
                    {error}
                  </Text>
                </View>
              ) : null}

              {notice ? (
                <View style={[styles.messageBox, { backgroundColor: colors.primary + '12' }]}>
                  <Text style={[typePresets.bodySm, { color: colors.primary }]}>
                    {notice}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                label={mode === 'signin' ? 'Sign In' : 'Create Account'}
                onPress={handleAuth}
                loading={isLoading}
                fullWidth
                size="lg"
              />
              
              {mode === 'signin' && (
                <Pressable 
                  onPress={handleForgotPassword} 
                  style={({ pressed }) => [styles.forgotLink, pressed && styles.pressed]}
                >
                  <Text style={[typePresets.label, { color: colors.primary }]}>
                    Forgot password?
                  </Text>
                </Pressable>
              )}
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.footer}>
            <Text style={[typePresets.bodySm, { color: colors.textTertiary }]}>
              Trusted by leading financial institutions worldwide
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  decorCircle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.3,
    right: -width * 0.3,
  },
  decorCircle2: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: -width * 0.2,
    left: -width * 0.2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandName: {
    fontFamily: fontFamily.sansBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xxs,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureLabel: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    lineHeight: 14,
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: spacing.xxs,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  modeButtonText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
  },
  form: {
    gap: spacing.xs,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    marginTop: spacing.sm,
  },
  rememberContent: {
    flex: 1,
    gap: spacing.xxs,
  },
  messageBox: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  actions: {
    marginTop: spacing.lg,
  },
  forgotLink: {
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  footer: {
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
