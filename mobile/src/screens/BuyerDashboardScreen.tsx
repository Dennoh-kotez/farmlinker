import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { Title, Text, Card, Avatar, ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useQuery } from 'react-query';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { getProducts, getOrders, getCart } from '../api/apiService';
import { Product, Order, Cart } from '../utils/types';
import { colors } from '../utils/theme';
import ProductCard from '../components/ProductCard';
import OrderCard from '../components/OrderCard';

const BuyerDashboardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useQuery<Product[]>('products', getProducts);

  const {
    data: orders,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery<Order[]>(
    ['buyerOrders', user?.id],
    getOrders,
    {
      enabled: !!user,
      select: (data) => data.filter(order => order.buyerId === user?.id)
    }
  );

  const { 
    data: cart,
    isLoading: isLoadingCart,
    error: cartError,
    refetch: refetchCart
  } = useQuery<Cart>(
    ['cart', user?.id],
    () => getCart(),
    {
      enabled: !!user
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchProducts(), refetchOrders(), refetchCart()]);
    setRefreshing(false);
  };

  const recentOrders = orders?.slice(0, 3) || [];
  const featuredProducts = products?.slice(0, 6) || [];
  const cartItemsCount = cart?.items?.length || 0;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Title style={styles.welcomeText}>Welcome, {user?.name}!</Title>
          <Text style={styles.subtitle}>Find fresh produce from Kenyan farmers</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Products');
            }}
          >
            <Ionicons name="search-outline" size={20} color="white" />
            <Text style={styles.actionText}>Browse</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Cart');
            }}
          >
            <View style={styles.cartIconContainer}>
              <Ionicons name="cart-outline" size={20} color="white" />
              {cartItemsCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.actionText}>Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Orders');
            }}
          >
            <Ionicons name="receipt-outline" size={20} color="white" />
            <Text style={styles.actionText}>Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Products */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Featured Products</Title>
            <PaperButton 
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Products');
              }}
              uppercase={false}
            >
              View All
            </PaperButton>
          </View>

          {isLoadingProducts ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : productsError ? (
            <Text style={styles.errorText}>Failed to load products</Text>
          ) : featuredProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {featuredProducts.map(product => (
                <TouchableOpacity 
                  key={product.id}
                  style={styles.productCardContainer}
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate('ProductDetail', { productId: product.id });
                  }}
                >
                  <ProductCard 
                    product={product} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products available</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Categories */}
      <Card style={styles.section}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Categories</Title>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Poultry'].map((category) => (
              <TouchableOpacity 
                key={category}
                style={styles.categoryCard}
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('Products', { category });
                }}
              >
                <Ionicons 
                  name={
                    category === 'Vegetables' ? 'leaf-outline' :
                    category === 'Fruits' ? 'nutrition-outline' :
                    category === 'Grains' ? 'flower-outline' :
                    category === 'Dairy' ? 'water-outline' :
                    category === 'Meat' ? 'restaurant-outline' :
                    'egg-outline'
                  } 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Recent Orders */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Orders</Title>
            <PaperButton 
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Orders');
              }}
              uppercase={false}
            >
              View All
            </PaperButton>
          </View>

          {isLoadingOrders ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : ordersError ? (
            <Text style={styles.errorText}>Failed to load orders</Text>
          ) : recentOrders.length > 0 ? (
            <View>
              {recentOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate('OrderDetail', { orderId: order.id });
                  }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders yet</Text>
              <PaperButton 
                mode="contained"
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('Products');
                }}
                style={styles.shopButton}
              >
                Shop Now
              </PaperButton>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Farmers Near You */}
      <Card style={styles.section}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Farmers Near You</Title>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.farmersContainer}
          >
            {['Nairobi County', 'Kiambu County', 'Nakuru County', 'Machakos County'].map((county, index) => (
              <Card key={county} style={styles.farmerCard}>
                <Card.Content style={styles.farmerCardContent}>
                  <Avatar.Icon size={50} icon="account" style={styles.farmerAvatar} />
                  <Text style={styles.farmerName}>Farmer {index + 1}</Text>
                  <Text style={styles.farmerLocation}>{county}</Text>
                  <PaperButton 
                    mode="outlined" 
                    style={styles.viewButton}
                    onPress={() => {
                      // @ts-ignore
                      navigation.navigate('Products', { location: county });
                    }}
                  >
                    View Products
                  </PaperButton>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.primary,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    width: '30%',
  },
  actionText: {
    color: 'white',
    marginTop: 4,
    fontSize: 12,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryCard: {
    width: 90,
    height: 90,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  farmersContainer: {
    marginTop: 8,
  },
  farmerCard: {
    width: 160,
    marginRight: 12,
    marginBottom: 8,
  },
  farmerCardContent: {
    alignItems: 'center',
    padding: 10,
  },
  farmerAvatar: {
    backgroundColor: colors.primary,
    marginBottom: 8,
  },
  farmerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  farmerLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  viewButton: {
    marginTop: 8,
    height: 30,
    width: '100%',
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    padding: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: 12,
  },
  shopButton: {
    marginTop: 8,
  },
});

export default BuyerDashboardScreen;