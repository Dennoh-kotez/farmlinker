import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Title, Text, Card, Avatar, ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useQuery } from 'react-query';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { getProductsBySeller, getOrders } from '../api/apiService';
import { Product, Order } from '../utils/types';
import { colors } from '../utils/theme';
import OrderCard from '../components/OrderCard';

const SellerDashboardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useQuery<Product[]>(
    ['sellerProducts', user?.id],
    () => getProductsBySeller(user!.id),
    {
      enabled: !!user,
    }
  );

  const {
    data: orders,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery<Order[]>('orders', getOrders, {
    select: (data) => data.filter(order => 
      order.items.some(item => 
        products?.some(product => product.id === item.productId)
      )
    ),
    enabled: !!products
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchProducts(), refetchOrders()]);
    setRefreshing(false);
  };

  const pendingOrders = orders?.filter(order => order.status === 'pending') || [];
  const recentOrders = orders?.slice(0, 5) || [];

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
          <Title style={styles.welcomeText}>Welcome back, {user?.name}!</Title>
          <Text style={styles.subtitle}>Seller Dashboard</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsLabel}>Products</Text>
            {isLoadingProducts ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statsValue}>{products?.length || 0}</Text>
            )}
            <Ionicons name="cube-outline" size={24} color={colors.primary} style={styles.statsIcon} />
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsLabel}>Pending Orders</Text>
            {isLoadingOrders ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statsValue}>{pendingOrders.length}</Text>
            )}
            <Ionicons name="time-outline" size={24} color={colors.warning} style={styles.statsIcon} />
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsLabel}>Total Sales</Text>
            {isLoadingOrders ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statsValue}>
                KES {(orders?.reduce((total, order) => {
                  return total + order.items.reduce((itemTotal, item) => {
                    const orderProduct = products?.find(p => p.id === item.productId);
                    if (orderProduct && orderProduct.sellerId === user?.id) {
                      return itemTotal + (item.price * item.quantity);
                    }
                    return itemTotal;
                  }, 0);
                }, 0) || 0).toLocaleString()}
              </Text>
            )}
            <Ionicons name="cash-outline" size={24} color={colors.success} style={styles.statsIcon} />
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('SellerProducts');
              }}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('SellerProducts');
              }}
            >
              <Ionicons name="list-outline" size={24} color={colors.primary} />
              <Text style={styles.actionText}>Manage Products</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('SellerOrders');
              }}
            >
              <Ionicons name="receipt-outline" size={24} color={colors.primary} />
              <Text style={styles.actionText}>Manage Orders</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Products */}
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Your Products</Title>
            <PaperButton 
              onPress={() => {
                // @ts-ignore
                navigation.navigate('SellerProducts');
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
          ) : products && products.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {products.slice(0, 5).map(product => (
                <Card key={product.id} style={styles.productCard}>
                  <Card.Cover 
                    source={{ uri: product.imageUrl || 'https://via.placeholder.com/300x200' }} 
                    style={styles.productImage}
                  />
                  <Card.Content>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>KES {product.price.toLocaleString()}</Text>
                    <View style={styles.productStock}>
                      <Ionicons name="cube-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.productStockText}>
                        {product.quantity} {product.unit} available
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products added yet</Text>
              <PaperButton 
                mode="contained" 
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('SellerProducts');
                }}
                style={styles.addButton}
              >
                Add Your First Product
              </PaperButton>
            </View>
          )}
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
                navigation.navigate('SellerOrders');
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
              <Text style={styles.emptyText}>No orders received yet</Text>
            </View>
          )}
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
    marginBottom: 8,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: -30,
  },
  statsCard: {
    width: '30%',
    elevation: 4,
    backgroundColor: 'white',
  },
  statsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statsIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  actionsCard: {
    margin: 16,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    width: '30%',
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  productCard: {
    width: 150,
    marginRight: 12,
    marginBottom: 8,
  },
  productImage: {
    height: 100,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  productStock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  productStockText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
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
  addButton: {
    marginTop: 8,
  },
});

export default SellerDashboardScreen;