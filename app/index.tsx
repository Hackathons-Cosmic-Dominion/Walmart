import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { CategoryFilter } from '../components/CategoryFilter';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory, products } from '../products';
import theme from '../theme';


export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const router = useRouter();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const filtered = getProductsByCategory(category);
    setFilteredProducts(filtered);
  };

  const handleSearchPress = () => {
    // Navigate to search screen
    router.push('/search');
  };

  const handleCartPress = () => {
    // Navigate to cart screen
    console.log('Cart pressed');
  };

  const handleUserPress = () => {
    // Navigate to user profile screen
    console.log('User pressed');
  };

  const handleProductPress = (productId: string) => {
    // Navigate to product detail screen
    router.push(`/product/${productId}`);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productContainer}>
      <ProductCard
        product={item}
        onPress={() => handleProductPress(item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onSearchPress={handleSearchPress}
        onCartPress={handleCartPress}
        onUserPress={handleUserPress}
      />
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  productList: {
    padding: theme.spacing.m,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});
