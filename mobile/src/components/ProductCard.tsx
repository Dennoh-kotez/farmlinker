import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../utils/types';
import { colors } from '../utils/theme';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // @ts-ignore - Navigation typing is complex
      navigation.navigate('ProductDetail', { productId: product.id });
    }
  };
  
  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Cover 
          source={{ uri: product.imageUrl || 'https://via.placeholder.com/300x200' }} 
          style={styles.image}
        />
        <Card.Content style={styles.content}>
          <Title numberOfLines={1} style={styles.title}>{product.name}</Title>
          <Paragraph numberOfLines={2} style={styles.description}>{product.description}</Paragraph>
          
          <View style={styles.details}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>KES {product.price.toLocaleString()}</Text>
              <Text style={styles.unit}>/ {product.unit}</Text>
            </View>
            
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.location}>{product.location}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Available:</Text>
              <Text style={styles.quantity}>{product.quantity} {product.unit}</Text>
            </View>
            
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{product.category}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    elevation: 2,
    borderRadius: 10,
  },
  image: {
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  unit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quantity: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryContainer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  category: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default ProductCard;