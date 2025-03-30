import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as PaperInput } from 'react-native-paper';
import { colors } from '../utils/theme';

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  mode?: 'flat' | 'outlined';
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

const TextInput = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  mode = 'outlined',
  multiline = false,
  numberOfLines = 1,
  style,
}: TextInputProps) => (
  <View style={[styles.container, style]}>
    <PaperInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      mode={mode}
      multiline={multiline}
      numberOfLines={numberOfLines}
      error={!!error}
      style={styles.input}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  error: {
    fontSize: 14,
    color: colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default TextInput;