import { DefaultTheme } from 'react-native-paper';

// Define app colors
export const colors = {
  primary: '#4CAF50', // Green - primary brand color
  primaryDark: '#388E3C', // Darker shade of primary
  primaryLight: '#C8E6C9', // Lighter shade of primary
  accent: '#FF9800', // Orange - accent color
  background: '#FFFFFF', // White background
  surface: '#FFFFFF', // Surface color for cards, sheets
  text: '#212121', // Primary text color
  textSecondary: '#757575', // Secondary text color
  error: '#B00020', // Error color
  disabled: '#BDBDBD', // Disabled state color
  placeholder: '#9E9E9E', // Placeholder text color
  backdrop: 'rgba(0, 0, 0, 0.5)', // Backdrop for modals
  border: '#E0E0E0', // Border color
  divider: '#EEEEEE', // Divider color
  success: '#4CAF50', // Success state color
  warning: '#FF9800', // Warning state color
  info: '#2196F3', // Info state color
  white: '#FFFFFF', // White
  black: '#000000', // Black
  transparent: 'transparent',
  
  // Status colors for orders and products
  statusPending: '#FFC107', // Yellow - pending status
  statusConfirmed: '#2196F3', // Blue - confirmed status
  statusProcessing: '#673AB7', // Purple - processing status
  statusShipping: '#FF5722', // Deep Orange - shipping status
  statusDelivered: '#4CAF50', // Green - delivered status
  statusCancelled: '#F44336', // Red - cancelled status
  
  // Additional colors for variety in the UI
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  darkGray: '#9E9E9E',
};

// Create app theme based on react-native-paper
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: colors.backdrop,
    notification: colors.accent,
  },
  fonts: {
    ...DefaultTheme.fonts,
    // Can customize fonts here if needed
  },
  roundness: 8, // Border radius for components
  // Additional theme properties
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  // Shadow styles for different elevations
  shadows: {
    small: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};