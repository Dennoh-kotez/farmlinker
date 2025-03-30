import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Title, Text, Card, Divider, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { getProductById, updateCart } from '../api/apiService';
import Button from '../components/Button';
import { Product } from '../utils/types';
import { colors } from '../utils/theme';

type ParamList = {
  ProductDetail: {
    productId: number;
  };
};

const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'ProductDetail'>>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { productId } = route.params;
  
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useQuery<Product>(
    ['product', productId],
    () => getProductById(productId)
  );
  
  const addToCartMutation = useMutation(
    (cartItem: any) => updateCart([cartItem]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
        Alert.alert('Success', 'Product added to cart');
      },
      onError: () => {
        Alert.alert('Error', 'Failed to add product to cart');
      },
    }
  );
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
      price: product.price,
    });
  };
  
  const incrementQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }
  
  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorText}>Failed to load product details</Text>
        <Button 
          mode="outlined" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: product.imageUrl || 'https://via.placeholder.com/500x300' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Title style={styles.title}>{product.name}</Title>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>KES {product.price.toLocaleString()}</Text>
            <Text style={styles.unit}>/ {product.unit}</Text>
          </View>
        </View>
        
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>{product.location}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="cube-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  Available: {product.quantity} {product.unit}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>Seller: {product.sellerName}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>Category: {product.category}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Divider style={styles.divider} />
        
        <Title style={styles.sectionTitle}>Description</Title>
        <Text style={styles.description}>{product.description}</Text>
        
        <Divider style={styles.divider} />
        
        <Title style={styles.sectionTitle}>Quantity</Title>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
            onPress={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Ionicons name="remove" size={20} color={quantity <= 1 ? colors.divider : colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={[styles.quantityButton, quantity >= product.quantity && styles.disabledButton]}
            onPress={incrementQuantity}
            disabled={quantity >= product.quantity}
          >
            <Ionicons name="add" size={20} color={quantity >= product.quantity ? colors.divider : colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>
            KES {(product.price * quantity).toLocaleString()}
          </Text>
        </View>
        
        <Button
          mode="contained"
          onPress={handleAddToCart}
          loading={addToCartMutation.isLoading}
          disabled={addToCartMutation.isLoading}
          style={styles.addToCartButton}
        >
          Add to Cart
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  unit: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    borderColor: colors.divider,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  addToCartButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: colors.error,
  },
  backButton: {
    minWidth: 120,
  },
});

export default ProductDetailScreen;