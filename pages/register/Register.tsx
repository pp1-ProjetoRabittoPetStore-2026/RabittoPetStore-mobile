import { useCreateTutor } from '@/services/modules/user/queries';
import { getApiErrorMessage, maskTelefone } from '@/shared/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RegisterFormData, registerSchema } from './schema/register.schema';

export default function RegisterScreen() {
  const router = useRouter();
  const { mutate: register, isPending } = useCreateTutor();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = ({ confirmarSenha: _confirmarSenha, ...data }: RegisterFormData) => {
    register(data, {
      onSuccess: () => {
        Alert.alert('Conta criada!', 'Seu cadastro foi realizado com sucesso.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: (error) => {
        Alert.alert(
          'Erro ao cadastrar',
          getApiErrorMessage(error, 'Não foi possível criar sua conta. Tente novamente.'),
        );
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botão Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Cadastre-se para cuidar dos seus pets
        </Text>

        {/* Campo Nome */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Nome</Text>
          <View
            style={[styles.inputContainer, errors.nome && styles.inputError]}
          >
            <User color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          {errors.nome && (
            <Text style={styles.errorText}>{errors.nome.message}</Text>
          )}
        </View>

        {/* Campo E-mail */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>E-mail</Text>
          <View
            style={[styles.inputContainer, errors.email && styles.inputError]}
          >
            <Mail color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="exemplo@email.com"
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
        </View>

        {/* Campo Telefone */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Telefone</Text>
          <View
            style={[
              styles.inputContainer,
              errors.telefone && styles.inputError,
            ]}
          >
            <Phone color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="telefone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="(00) 00000-0000"
                  onBlur={onBlur}
                  onChangeText={(t) => onChange(maskTelefone(t))}
                  value={value}
                  keyboardType="phone-pad"
                />
              )}
            />
          </View>
          {errors.telefone && (
            <Text style={styles.errorText}>{errors.telefone.message}</Text>
          )}
        </View>

        {/* Campo Senha */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Senha</Text>
          <View
            style={[styles.inputContainer, errors.senha && styles.inputError]}
          >
            <Lock color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="senha"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
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
        </View>

        {/* Campo Confirmar Senha */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <View
            style={[
              styles.inputContainer,
              errors.confirmarSenha && styles.inputError,
            ]}
          >
            <Lock color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="confirmarSenha"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Repita a senha"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showConfirmPassword}
                />
              )}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? (
                <EyeOff color="#666" size={20} />
              ) : (
                <Eye color="#666" size={20} />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmarSenha && (
            <Text style={styles.errorText}>{errors.confirmarSenha.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, isPending && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>Cadastrar Tutor</Text>
              <UserPlus color="#FFF" size={20} style={{ marginLeft: 10 }} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#F8F9FA',
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 40 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  inputWrapper: { marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
  },
  inputError: { borderColor: '#E74C3C' },
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
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#E74C3C', fontSize: 12, marginTop: 5, marginLeft: 5 },
});
