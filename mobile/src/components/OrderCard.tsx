import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Card, Title, Text, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Order } from '../utils/types';
import { colors } from '../utils/theme';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

const statusColors = {
  pending: { bg: '#FFF3CD', text: '#856404' },
  processing: { bg: '#D1ECF1', text: '#0C5460' },
  shipped: { bg: '#D4EDDA', text: '#155724' },
  delivered: { bg: '#C3E6CB', text: '#155724' },
  cancelled: { bg: '#F8D7DA', text: '#721C24' },
};

const OrderCard = ({ order, onPress }: OrderCardProps) => {
  const navigation = useNavigation();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // @ts-ignore - Navigation typing is complex
      navigation.navigate('OrderDetail', { orderId: order.id });
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const getStatusStyle = (status: string) => {
    const lowerStatus = status.toLowerCase();
    return statusColors[lowerStatus as keyof typeof statusColors] || { bg: colors.divider, text: colors.textSecondary };
  };
  
  const statusStyle = getStatusStyle(order.status);
  
  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.orderNumber}>Order #{order.id}</Title>
            <Chip 
              style={[styles.statusChip, { backgroundColor: statusStyle.bg }]}
              textStyle={[styles.statusText, { color: statusStyle.text }]}
            >
              {order.status.toUpperCase()}
            </Chip>
          </View>
          
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{formatDate(order.createdAt)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total:</Text>
              <Text style={styles.detailValue}>KES {order.total.toLocaleString()}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <Text style={styles.detailValue}>{order.paymentMethod}</Text>
            </View>
            
            {order.mpesaReference && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>M-Pesa Ref:</Text>
                <Text style={styles.detailValue}>{order.mpesaReference}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.itemsCount}>
              {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}
            </Text>
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
  content: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusChip: {
    height: 24,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  details: {
    marginVertical: 6,
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    flex: 2,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  itemsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default OrderCard;