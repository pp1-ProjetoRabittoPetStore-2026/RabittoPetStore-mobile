import { useLogin } from '@/services/modules/auth/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, LogIn, Mail } from 'lucide-react-native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LoginFormData, loginSchema } from './schema/login.schema';

export default function LoginScreen() {
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data); // Chama o hook do TanStack Query
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Rabitto</Text>

      {/* Campo E-mail */}
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

      {/* Campo Senha */}
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
              secureTextEntry
            />
          )}
        />
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
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 5,
  },
});
