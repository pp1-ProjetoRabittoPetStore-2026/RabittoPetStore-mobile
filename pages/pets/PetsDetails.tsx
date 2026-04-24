import React, { useState, useEffect } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Pencil,
    Trash2,
    X,
    Check,
    Dog,
    Cat,
    Calendar,
    Info
} from 'lucide-react-native';

import { useDeletePet, usePetById, useUpdatePet } from '@/services/modules/pets/queries';
import { petSchema, PetFormData } from './schema/pet.schema';

type PetFormInput = z.input<typeof petSchema>;

export default function PetDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    // Queries e Mutations
    const { data: pet, isLoading } = usePetById(id);
    const { mutate: updatePet, isPending: isUpdating } = useUpdatePet();
    const { mutate: deletePet } = useDeletePet();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PetFormInput, any, PetFormData>({
        resolver: zodResolver(petSchema),
    });

    useEffect(() => {
        if (pet) {
            reset({
                nome: pet.nome || '',
                especie: pet.especie || '',
                raca: pet.raca || '',
                porte: (pet.porte as PetFormInput['porte']) || 'médio',
                idade: String(pet.idade || ''),
            });
        }
    }, [pet, isEditing, reset]);

    const onUpdate = (data: PetFormData) => {
        updatePet(
            { id, updatedPet: data },
            {
                onSuccess: () => {
                    Alert.alert('Sucesso', 'Dados atualizados!');
                    setIsEditing(false);
                },
            }
        );
    };

    const handleDelete = () => {
        Alert.alert('Excluir Pet', `Tem certeza que deseja excluir ${pet?.nome}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => {
                    deletePet(id, {
                        onSuccess: () => {
                            router.replace('/(tabs)');
                        },
                    });
                },
            },
        ]);
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
                {/* Header de Ações */}
                <View style={styles.header}>
                    <Text style={styles.title}>{isEditing ? 'Editar Pet' : pet?.nome}</Text>
                    <View style={styles.actionButtons}>
                        {!isEditing ? (
                            <>
                                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconBtn}>
                                    <Pencil size={22} color="#444" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
                                    <Trash2 size={22} color="#E74C3C" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.iconBtn}>
                                <X size={24} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Formulário / Detalhes */}
                <View style={styles.card}>
                    <Field
                        label="Nome"
                        name="nome"
                        control={control}
                        isEditing={isEditing}
                        value={pet?.nome}
                        error={errors.nome?.message}
                        icon={<Info size={20} color="#666" />}
                    />

                    <Field
                        label="Espécie"
                        name="especie"
                        control={control}
                        isEditing={isEditing}
                        value={pet?.especie}
                        error={errors.especie?.message}
                        icon={<Cat size={20} color="#666" />}
                    />

                    <Field
                        label="Raça"
                        name="raca"
                        control={control}
                        isEditing={isEditing}
                        value={pet?.raca}
                        error={errors.raca?.message}
                        icon={<Dog size={20} color="#666" />}
                    />

                    <Field
                        label="Idade"
                        name="idade"
                        control={control}
                        isEditing={isEditing}
                        value={`${pet?.idade} anos`}
                        error={errors.idade?.message}
                        keyboardType="numeric"
                        icon={<Calendar size={20} color="#666" />}
                    />
                </View>

                {isEditing && (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSubmit(onUpdate)}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                                <Check size={20} color="#FFF" style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function Field({ label, name, control, isEditing, value, error, icon, ...rest }: any) {
    return (
        <View style={styles.fieldWrapper}>
            <Text style={styles.label}>{label}</Text>
            {isEditing ? (
                <View>
                    <View style={styles.inputContainer}>
                        {icon}
                        <Controller
                            control={control}
                            name={name}
                            render={({ field: { onChange, value: fieldValue } }) => (
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={String(fieldValue || '')}
                                    {...rest}
                                />
                            )}
                        />
                    </View>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            ) : (
                <View style={styles.viewModeContainer}>
                    {icon}
                    <Text style={styles.viewValue}>{value}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 25, backgroundColor: '#FDFDFD', flexGrow: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    actionButtons: { flexDirection: 'row', gap: 15 },
    iconBtn: { padding: 8, backgroundColor: '#F0F0F0', borderRadius: 10 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    fieldWrapper: { marginBottom: 20 },
    label: { fontSize: 13, color: '#999', fontWeight: '600', marginBottom: 5, textTransform: 'uppercase' },
    viewModeContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
    viewValue: { fontSize: 18, color: '#444', fontWeight: '500' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        paddingHorizontal: 15,
    },
    input: { flex: 1, height: 45, fontSize: 16, marginLeft: 10 },
    saveButton: {
        backgroundColor: '#27AE60',
        height: 55,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    errorText: { color: '#E74C3C', fontSize: 12, marginTop: 5 },
});