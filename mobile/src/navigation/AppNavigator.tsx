import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import BuyerDashboardScreen from '../screens/BuyerDashboardScreen';
import SellerDashboardScreen from '../screens/SellerDashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Buyer Tab Navigator
const BuyerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'BuyerHome') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Products') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
    })}
  >
    <Tab.Screen 
      name="BuyerHome" 
      component={BuyerDashboardScreen}
      options={{ title: 'Home' }}
    />
    <Tab.Screen name="Products" component={ProductsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Seller Tab Navigator
const SellerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'SellerHome') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'SellerProducts') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
    })}
  >
    <Tab.Screen 
      name="SellerHome" 
      component={SellerDashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <Tab.Screen 
      name="SellerProducts" 
      component={ProductsScreen}
      options={{ title: 'My Products' }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main Navigator
const AppNavigator = () => {
  const { user, isAuthenticated, isSeller } = useAuth();

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        // Auth Screens
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{ headerShown: false }}
        />
      ) : (
        // App Screens
        <>
          {isSeller ? (
            <Stack.Screen 
              name="SellerTabs" 
              component={SellerTabNavigator} 
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen 
              name="BuyerTabs" 
              component={BuyerTabNavigator} 
              options={{ headerShown: false }}
            />
          )}
          
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen}
            options={{ 
              title: 'Product Details',
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: '#fff',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;