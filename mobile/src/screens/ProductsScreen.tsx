import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, TextInput as RNTextInput } from 'react-native';
import { Searchbar, Title, Chip, Text } from 'react-native-paper';
import { useQuery } from 'react-query';
import { Ionicons } from '@expo/vector-icons';
import { getProducts } from '../api/apiService';
import ProductCard from '../components/ProductCard';
import { Product } from '../utils/types';
import { colors } from '../utils/theme';

const categories = [
  'All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Poultry', 'Other'
];

const ProductsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { data: products, isLoading, error } = useQuery<Product[]>('products', getProducts);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item}
            onPress={() => handleCategorySelect(item)}
            style={[
              styles.categoryChip,
              selectedCategory === item ? styles.selectedCategoryChip : null
            ]}
            textStyle={selectedCategory === item ? styles.selectedCategoryText : null}
          >
            {item}
          </Chip>
        )}
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>Failed to load products</Text>
        </View>
      ) : (
        <>
          {filteredProducts && filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ProductCard product={item} />}
              contentContainerStyle={styles.productsContainer}
              numColumns={1}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  searchBar: {
    marginBottom: 10,
    elevation: 2,
  },
  categoriesContainer: {
    paddingVertical: 10,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary,
  },
  selectedCategoryText: {
    color: 'white',
  },
  productsContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default ProductsScreen;