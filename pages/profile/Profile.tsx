import { useMyProfile, useUpdateMyProfile } from '@/services/modules/user/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail, Phone, Save, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
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
import { ProfileFormData, profileSchema } from './schema/profile.schema';

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading } = useMyProfile();
  const { mutate: updateProfile, isPending } = useUpdateMyProfile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nome: '', email: '', telefone: '', senha: '' },
  });

  useEffect(() => {
    if (profile) {
      reset({
        nome: profile.nome ?? '',
        email: profile.email ?? '',
        telefone: profile.telefone ?? '',
        senha: '',
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    // Não envia senha vazia (mantém a atual)
    const payload = { ...data };
    if (!payload.senha) {
      delete payload.senha;
    }
    updateProfile(payload, {
      onSuccess: () => Alert.alert('Perfil atualizado', 'Seus dados foram salvos.'),
      onError: () =>
        Alert.alert('Erro', 'Não foi possível atualizar seu perfil. Tente novamente.'),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={styles.subtitle}>Veja e atualize seus dados pessoais</Text>

        <Field
          label="Nome"
          name="nome"
          control={control}
          error={errors.nome?.message}
          icon={<User color="#666" size={20} />}
          placeholder="Seu nome completo"
        />
        <Field
          label="E-mail"
          name="email"
          control={control}
          error={errors.email?.message}
          icon={<Mail color="#666" size={20} />}
          placeholder="exemplo@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Field
          label="Telefone"
          name="telefone"
          control={control}
          error={errors.telefone?.message}
          icon={<Phone color="#666" size={20} />}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
        />
        <Field
          label="Nova senha (opcional)"
          name="senha"
          control={control}
          error={errors.senha?.message}
          icon={<Lock color="#666" size={20} />}
          placeholder="Deixe vazio para manter"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, isPending && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>Salvar Alterações</Text>
              <Save color="#FFF" size={20} style={{ marginLeft: 10 }} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, name, control, error, icon, ...rest }: any) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <View style={styles.icon}>{icon}</View>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              {...rest}
            />
          )}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#F8F9FA',
    flexGrow: 1,
    justifyContent: 'center',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#E74C3C', fontSize: 12, marginTop: 5, marginLeft: 5 },
});
