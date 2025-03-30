import React, { useState } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Title, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { colors } from '../utils/theme';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(values.email, values.password);
      
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
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
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/farmbg.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Title style={styles.appName}>FarmLinker</Title>
          <Text style={styles.tagline}>Connect with farmers in Kenya</Text>
        </View>

        <View style={styles.formContainer}>
          <Title style={styles.title}>Login</Title>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }) => (
              <View>
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
                
                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  disabled={isLoading || !isValid}
                  style={styles.button}
                >
                  Login
                </Button>
              </View>
            )}
          </Formik>
          
          <View style={styles.registerContainer}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Register');
              }}
            >
              <Text style={styles.registerLink}>Register</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 12,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
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
  button: {
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;