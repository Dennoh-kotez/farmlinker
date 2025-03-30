import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { colors } from '../utils/theme';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  style?: any;
  labelStyle?: any;
  loading?: boolean;
  disabled?: boolean;
  uppercase?: boolean;
  children: React.ReactNode;
}

const Button = ({
  mode = 'contained',
  onPress,
  style,
  labelStyle,
  loading = false,
  disabled = false,
  uppercase = false,
  children,
}: ButtonProps) => (
  <PaperButton
    mode={mode}
    onPress={onPress}
    style={[styles.button, style]}
    labelStyle={[styles.label, labelStyle]}
    loading={loading}
    disabled={disabled}
    uppercase={uppercase}
  >
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;