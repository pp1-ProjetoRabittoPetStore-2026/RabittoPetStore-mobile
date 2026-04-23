import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dog, Cat, Calendar, Info, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { PetFormData, petSchema } from './schema/pet.schema';
import { useCreatePet } from '@/services/modules/pets/queries';

type PetFormInput = z.input<typeof petSchema>;

export default function RegisterPet() {
  const router = useRouter();
  const { mutate: createPet, isPending } = useCreatePet();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormInput, any, PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: { nome: '', especie: '', raca: '', idade: '' },
  });

  const onSubmit = (data: PetFormData) => {
    createPet(data, {
      onSuccess: () => {
        Alert.alert('Sucesso!', `${data.nome} foi cadastrado.`);
        router.replace('/(tabs)');
      },
      onError: (error) => {
        Alert.alert('Erro', 'Não foi possível cadastrar o pet.');
        console.error(error);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Novo Pet 🐾</Text>
        <Text style={styles.subtitle}>Cadastre os dados do seu amiguinho</Text>

        {/* Nome */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Nome do Pet</Text>
          <View style={styles.inputContainer}>
            <Info color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Rex"
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

        {/* Espécie */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Espécie</Text>
          <View style={styles.inputContainer}>
            <Cat color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="especie"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Cachorro"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          {errors.especie && (
            <Text style={styles.errorText}>{errors.especie.message}</Text>
          )}
        </View>

        {/* Raça */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Raça</Text>
          <View style={styles.inputContainer}>
            <Dog color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="raca"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Golden Retriever"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          {errors.raca && (
            <Text style={styles.errorText}>{errors.raca.message}</Text>
          )}
        </View>

        {/* Idade */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Idade (Anos)</Text>
          <View style={styles.inputContainer}>
            <Calendar color="#666" size={20} style={styles.icon} />
            <Controller
              control={control}
              name="idade"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={String(value)}
                />
              )}
            />
          </View>
          {errors.idade && (
            <Text style={styles.errorText}>{errors.idade.message}</Text>
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
              <Text style={styles.buttonText}>Cadastrar Pet</Text>
              <Save color="#FFF" size={20} style={{ marginLeft: 10 }} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: '#FFF', flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 30 },
  subtitle: { fontSize: 16, color: '#777', marginBottom: 25 },
  inputWrapper: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    paddingHorizontal: 15,
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
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#E74C3C', fontSize: 12, marginTop: 5, marginLeft: 5 },
});
