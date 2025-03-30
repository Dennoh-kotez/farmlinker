import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Title, Text, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../contexts/AuthContext';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { colors } from '../utils/theme';
import { kenyanCounties } from '../utils/constants';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().oneOf(['buyer', 'seller'], 'Invalid role').required('Role is required'),
  county: Yup.string().when('role', {
    is: 'seller',
    then: Yup.string().required('County is required for sellers'),
  }),
  mpesaNumber: Yup.string()
    .matches(/^(07|01)[0-9]{8}$/, 'Invalid M-Pesa number. Format: 07XXXXXXXX or 01XXXXXXXX')
    .required('M-Pesa number is required'),
});

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  county: string;
  mpesaNumber: string;
}

const RegisterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { register } = useAuth();

  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = values;
      
      const success = await register(userData);
      
      if (!success) {
        setError('Registration failed. Email might already be in use.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Title style={styles.title}>Create Account</Title>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: 'buyer',
              county: '',
              mpesaNumber: '',
            }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isValid,
              setFieldValue,
            }) => (
              <View>
                <TextInput
                  label="Full Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  error={touched.name && errors.name ? errors.name : ''}
                  autoCapitalize="words"
                />
                
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  error={touched.email && errors.email ? errors.email : ''}
                  keyboardType="email-address"
                />
                
                <TextInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  error={touched.password && errors.password ? errors.password : ''}
                  secureTextEntry
                />
                
                <TextInput
                  label="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}
                  secureTextEntry
                />
                
                <TextInput
                  label="M-Pesa Phone Number"
                  value={values.mpesaNumber}
                  onChangeText={handleChange('mpesaNumber')}
                  error={touched.mpesaNumber && errors.mpesaNumber ? errors.mpesaNumber : ''}
                  keyboardType="phone-pad"
                />
                
                <View style={styles.roleContainer}>
                  <Text style={styles.roleLabel}>I am a:</Text>
                  <RadioButton.Group
                    onValueChange={(value) => setFieldValue('role', value)}
                    value={values.role}
                  >
                    <View style={styles.radioRow}>
                      <RadioButton.Item
                        label="Buyer"
                        value="buyer"
                        color={colors.primary}
                        style={styles.radioButton}
                      />
                      <RadioButton.Item
                        label="Seller (Farmer)"
                        value="seller"
                        color={colors.primary}
                        style={styles.radioButton}
                      />
                    </View>
                  </RadioButton.Group>
                </View>
                
                {values.role === 'seller' && (
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>County:</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={values.county}
                        onValueChange={(value) => setFieldValue('county', value)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Select County..." value="" />
                        {kenyanCounties.map((county) => (
                          <Picker.Item key={county} label={county} value={county} />
                        ))}
                      </Picker>
                    </View>
                    {touched.county && errors.county ? (
                      <Text style={styles.pickerError}>{errors.county}</Text>
                    ) : null}
                  </View>
                )}
                
                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  disabled={isLoading || !isValid}
                  style={styles.button}
                >
                  Register
                </Button>
              </View>
            )}
          </Formik>
          
          <View style={styles.loginContainer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  roleLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButton: {
    flex: 1,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  pickerLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 4,
    marginBottom: 4,
  },
  picker: {
    height: 50,
  },
  pickerError: {
    fontSize: 14,
    color: colors.error,
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;