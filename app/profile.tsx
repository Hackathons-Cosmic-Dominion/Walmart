import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '../store/userStore';
import theme from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading, login, logout, updatePreferences } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (email && password) {
      await login(email, password);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>My Account</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.loginContainer}>
            <Ionicons name="person-circle-outline" size={80} color={theme.colors.primary} />
            <Text style={styles.loginTitle}>Sign in to your account</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.createAccountButton}>
              <Text style={styles.createAccountButtonText}>Create an Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={theme.colors.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Purchases</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="receipt-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Purchase History</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="archive-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>My Items</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Wallet</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="card-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="gift-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Gift Cards</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings & Preferences</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="location-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Address Book</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Push Notifications</Text>
            <Switch
              value={user?.preferences.notifications}
              onValueChange={() => updatePreferences({ notifications: !user?.preferences.notifications })}
              trackColor={{ false: theme.colors.gray300, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
          <View style={styles.menuItem}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuText}>Email Updates</Text>
            <Switch
              value={user?.preferences.emailUpdates}
              onValueChange={() => updatePreferences({ emailUpdates: !user?.preferences.emailUpdates })}
              trackColor={{ false: theme.colors.gray300, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray100,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  loginContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    width: '100%',
    marginBottom: theme.spacing.m,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadii.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    fontSize: 16,
    color: theme.colors.text,
  },
  loginButton: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.round,
    alignItems: 'center',
    marginTop: theme.spacing.l,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: '100%',
    marginVertical: theme.spacing.xl,
  },
  createAccountButton: {
    width: '100%',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.round,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  createAccountButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.m,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.m,
  },
  logoutButton: {
    margin: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  logoutButtonText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 