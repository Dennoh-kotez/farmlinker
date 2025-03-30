import React from 'react';
import { StyleSheet, View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { Title, Text, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { colors } from '../utils/theme';

const features = [
  {
    title: 'Direct Marketplace',
    description: 'Connect directly with local farmers and buy fresh produce',
    icon: 'storefront-outline',
  },
  {
    title: 'Local Delivery',
    description: 'Get your orders delivered to your location across Kenya',
    icon: 'car-outline',
  },
  {
    title: 'M-Pesa Payments',
    description: 'Pay securely using Kenya\'s popular mobile payment system',
    icon: 'wallet-outline',
  },
  {
    title: 'Quality Control',
    description: 'Browse verified farmers with quality produce',
    icon: 'shield-checkmark-outline',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <ImageBackground 
        source={require('../assets/farmbg.png')} 
        style={styles.heroBg}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay}>
          <View style={styles.heroContent}>
            <Title style={styles.heroTitle}>Welcome to FarmLinker</Title>
            <Text style={styles.heroSubtitle}>
              Connecting Kenyan farmers with buyers for fresher produce and better prices
            </Text>
            
            <Button
              mode="contained"
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Products');
              }}
              style={styles.heroButton}
            >
              Browse Products
            </Button>
          </View>
        </View>
      </ImageBackground>
      
      {/* Features Section */}
      <View style={styles.sectionContainer}>
        <Title style={styles.sectionTitle}>Why Choose FarmLinker?</Title>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <Card.Content style={styles.featureContent}>
                <Ionicons 
                  name={feature.icon as any} 
                  size={36} 
                  color={colors.primary} 
                  style={styles.featureIcon} 
                />
                <Title style={styles.featureTitle}>{feature.title}</Title>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>
      
      {/* How It Works Section */}
      <View style={[styles.sectionContainer, styles.howItWorksContainer]}>
        <Title style={styles.sectionTitle}>How It Works</Title>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Browse Products</Text>
            <Text style={styles.stepDescription}>
              Explore a wide variety of locally grown fresh produce from verified farmers across Kenya
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Place Order</Text>
            <Text style={styles.stepDescription}>
              Select the items you want and add them to your cart, then checkout with your delivery details
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pay via M-Pesa</Text>
            <Text style={styles.stepDescription}>
              Use Kenya's popular mobile payment system to securely pay for your order
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Receive Fresh Produce</Text>
            <Text style={styles.stepDescription}>
              Get your order delivered to your location across Kenya, fresh from the farm
            </Text>
          </View>
        </View>
      </View>
      
      {/* Testimonials Section */}
      <View style={styles.sectionContainer}>
        <Title style={styles.sectionTitle}>What Our Users Say</Title>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsScroll}>
          <Card style={styles.testimonialCard}>
            <Card.Content>
              <View style={styles.testimonialHeader}>
                <Avatar.Icon icon="account" size={40} style={styles.testimonialAvatar} />
                <View>
                  <Text style={styles.testimonialName}>John M.</Text>
                  <Text style={styles.testimonialLocation}>Nakuru County</Text>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "As a farmer, I've increased my market reach and get better prices for my produce. The platform is easy to use even for non-tech savvy people."
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.testimonialCard}>
            <Card.Content>
              <View style={styles.testimonialHeader}>
                <Avatar.Icon icon="account" size={40} style={styles.testimonialAvatar} />
                <View>
                  <Text style={styles.testimonialName}>Sarah K.</Text>
                  <Text style={styles.testimonialLocation}>Nairobi County</Text>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "I love getting fresh produce directly from farmers. The quality is amazing and the M-Pesa integration makes payments so convenient."
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.testimonialCard}>
            <Card.Content>
              <View style={styles.testimonialHeader}>
                <Avatar.Icon icon="account" size={40} style={styles.testimonialAvatar} />
                <View>
                  <Text style={styles.testimonialName}>Daniel O.</Text>
                  <Text style={styles.testimonialLocation}>Kisumu County</Text>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "The app works even when my internet connection is poor. I can browse products offline and place orders when I'm back online."
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
      
      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        <Title style={styles.ctaTitle}>Ready to Get Started?</Title>
        <Text style={styles.ctaText}>
          Join FarmLinker today and enjoy fresh farm produce delivered to your doorstep
        </Text>
        
        <Button
          mode="contained"
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Products');
          }}
          style={styles.ctaButton}
        >
          Browse Products Now
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
  heroBg: {
    height: 300,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    minWidth: 180,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  featureContent: {
    alignItems: 'center',
    padding: 10,
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  howItWorksContainer: {
    backgroundColor: colors.primaryLight,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 4,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  testimonialsScroll: {
    marginTop: 10,
  },
  testimonialCard: {
    width: 280,
    marginRight: 16,
    elevation: 2,
    borderRadius: 8,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    backgroundColor: colors.primary,
    marginRight: 10,
  },
  testimonialName: {
    fontWeight: '600',
    fontSize: 16,
  },
  testimonialLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  testimonialText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textPrimary,
  },
  ctaContainer: {
    padding: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: 'white',
  },
});

export default HomeScreen;