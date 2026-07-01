import { useLogin } from '@/services/modules/auth/queries';
import { useAuth } from '@/shared/hooks';
import { getApiErrorMessage } from '@/shared/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LoginFormData, loginSchema } from './schema/login.schema';

const rabittoLogo = require('@/assets/images/rabitto-logo.png');

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: async ({ accessToken, refreshToken }) => {
        await signIn(accessToken, refreshToken);
      },
    });
  };

  return (
    <View style={styles.container}>
      <Image source={rabittoLogo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Bem-vindo ao Rabitto</Text>

      {error && (
        <View style={styles.serverErrorBox}>
          <Text style={styles.serverErrorText}>
            {getApiErrorMessage(error, 'Não foi possível entrar. Tente novamente.')}
          </Text>
        </View>
      )}

      {}
      <View style={styles.inputContainer}>
        <Mail color="#666" size={20} style={styles.icon} />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
      </View>
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      {}
      <View style={styles.inputContainer}>
        <Lock color="#666" size={20} style={styles.icon} />
        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={!showPassword}
            />
          )}
        />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
          {showPassword ? (
            <EyeOff color="#666" size={20} />
          ) : (
            <Eye color="#666" size={20} />
          )}
        </TouchableOpacity>
      </View>
      {errors.senha && (
        <Text style={styles.errorText}>{errors.senha.message}</Text>
      )}

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Text style={styles.buttonText}>Entrar</Text>
            <LogIn color="#FFF" size={20} />
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.buttonRegister}>Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  logo: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16 },
  button: {
    backgroundColor: '#FF6B6B',
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  buttonRegister: {
    color: '#000',
    fontSize: 12,
    fontWeight: '200',
    marginTop: 15,
    textAlign: 'right',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 5,
  },
  serverErrorBox: {
    backgroundColor: '#FDECEA',
    borderWidth: 1,
    borderColor: '#F5C6CB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  serverErrorText: { color: '#C0392B', fontSize: 14 },
});
