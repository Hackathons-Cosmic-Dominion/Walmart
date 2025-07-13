import { Ionicons } from '@expo/vector-icons';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CartItem from '../components/CartItem';
import { useCartStore } from '../store/cartStore';
import theme from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function CartScreen() {
  const { items, getTotalPrice, getTotalSavings, clearCart } = useCartStore();
  const insets = useSafeAreaInsets();

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleCheckout = () => {
    // Navigate to checkout screen
    console.log('Checkout pressed');
  };

  const handleContinueShopping = () => {
    // Navigate back to home screen
    console.log('Continue shopping pressed');
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <CartItem item={item} />
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some items to get started
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(getTotalPrice())}</Text>
        </View>
        
        {getTotalSavings() > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You Save</Text>
            <Text style={styles.savingsValue}>-{formatPrice(getTotalSavings())}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(getTotalPrice())}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    padding: theme.spacing.s,
  },
  clearButtonText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  cartList: {
    flex: 1,
    padding: theme.spacing.m,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  summary: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.m,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  checkoutButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    marginTop: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  continueButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: 28,
    height: 28,
  },
}); 