import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../theme';

interface HeaderProps {
  onSearchPress: () => void;
  onCartPress: () => void;
  onUserPress: () => void;
  onAddProductPress?: () => void;
  onScanBarcodePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSearchPress,
  onCartPress,
  onUserPress,
  onAddProductPress,
  onScanBarcodePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Top section with logo and user actions */}
      <View style={styles.topSection}>
        <View style={styles.logoSection}>
          <Image 
            source={require('../assets/images/spark-icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logo}>Walmart</Text>
        </View>
        
        <View style={styles.topActions}>
          {onAddProductPress && (
            <TouchableOpacity style={styles.iconButton} onPress={onAddProductPress}>
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.iconButton} onPress={onUserPress}>
            <Ionicons name="person-outline" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={onCartPress}>
            <Ionicons name="cart-outline" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location section */}
      <View style={styles.locationSection}>
        <Ionicons name="location-outline" size={16} color={theme.colors.white} />
        <Text style={styles.locationText}>Deliver to</Text>
        <Text style={styles.locationAddress}>Home - 12345</Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.white} />
      </View>

      {/* Search section */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.searchContainer} onPress={onSearchPress}>
            <Ionicons name="search" size={20} color={theme.colors.gray500} style={styles.searchIcon} />
            <Text style={styles.searchPlaceholder}>Search Walmart</Text>
            <TouchableOpacity style={styles.voiceButton}>
              <Ionicons name="mic-outline" size={20} color={theme.colors.gray500} />
            </TouchableOpacity>
          </TouchableOpacity>
          
          {onScanBarcodePress && (
            <TouchableOpacity style={styles.scanButton} onPress={onScanBarcodePress}>
              <Ionicons name="barcode-outline" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingTop: 50, // Account for status bar
    paddingBottom: theme.spacing.m,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.s,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing.s,
    marginLeft: theme.spacing.s,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.white,
    marginLeft: theme.spacing.xs,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.white,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.s,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadii.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  scanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: theme.spacing.s,
    padding: theme.spacing.s,
    borderRadius: theme.borderRadii.m,
  },
  searchIcon: {
    marginRight: theme.spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.gray500,
    paddingVertical: 12,
  },
  voiceButton: {
    padding: theme.spacing.xs,
  },
});

export default Header;
