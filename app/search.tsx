import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../products';
import theme from '../theme';

const popularSearches = [
  'Milk',
  'Eggs',
  'Bread',
  'Bananas',
  'Chicken',
  'Apples',
  'Cereal',
  'Coffee',
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setIsSearching(true);
      const results = searchProducts(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleProductPress = (productId: string) => {
    // Navigate to product detail screen
    console.log('Product pressed:', productId);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands, and categories"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {searchQuery.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.popularTitle}>Popular Searches</Text>
          <View style={styles.popularContainer}>
            {popularSearches.map((item) => (
              <TouchableOpacity key={item} style={styles.popularItem} onPress={() => handleSearch(item)}>
                <Text style={styles.popularText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : searchResults.length === 0 && isSearching ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching with different keywords
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
        />
      )}
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
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.s,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadii.round,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },
  cameraButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.s,
  },
  resultsList: {
    padding: theme.spacing.m,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    padding: theme.spacing.m,
  },
  popularTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  popularContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popularItem: {
    backgroundColor: theme.colors.gray100,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadii.round,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  popularText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});