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
    Info,
    CalendarPlus,
    ClipboardList,
    Scissors,
    Clock,
} from 'lucide-react-native';
import { AgendarModal } from './_components/AgendarModal';

import { useDeletePet, usePetById, useUpdatePet } from '@/services/modules/pets/queries';
import { useAgendamentosByPet } from '@/services/modules/agendamento/queries';
import { petSchema, PetFormData } from './schema/pet.schema';

type PetFormInput = z.input<typeof petSchema>;

export default function PetDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isAgendarVisible, setIsAgendarVisible] = useState(false);

    // Queries e Mutations
    const { data: pet, isLoading } = usePetById(id);
    const { mutate: updatePet, isPending: isUpdating } = useUpdatePet();
    const { mutate: deletePet } = useDeletePet();
    const { data: agendamentos, isLoading: loadingAgendamentos } = useAgendamentosByPet(pet?.id);

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

                {isEditing ? (
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
                ) : (
                    <TouchableOpacity
                        style={styles.agendarButton}
                        onPress={() => setIsAgendarVisible(true)}
                    >
                        <CalendarPlus size={22} color="#FFF" />
                        <Text style={styles.agendarButtonText}>Agendar Serviço</Text>
                    </TouchableOpacity>
                )}

                {pet?.id != null && (
                    <AgendarModal
                        visible={isAgendarVisible}
                        onClose={() => setIsAgendarVisible(false)}
                        petId={pet.id}
                        petNome={pet.nome}
                    />
                )}

                {/* ── Serviços Agendados ── */}
                {!isEditing && (
                    <>
                        <View style={styles.scheduledHeader}>
                            <ClipboardList size={20} color="#555" />
                            <Text style={styles.scheduledTitle}>Serviços Agendados</Text>
                        </View>

                        {loadingAgendamentos ? (
                            <ActivityIndicator color="#FF6B6B" style={{ marginVertical: 12 }} />
                        ) : !agendamentos || agendamentos.length === 0 ? (
                            <View style={styles.emptyScheduled}>
                                <Calendar size={30} color="#DDD" />
                                <Text style={styles.emptyScheduledText}>Nenhum agendamento encontrado.</Text>
                            </View>
                        ) : (
                            agendamentos.map((a) => {
                                const dt = new Date(a.dataHora);
                                const dateStr = dt.toLocaleDateString('pt-BR', {
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                });
                                const timeStr = dt.toLocaleTimeString('pt-BR', {
                                    hour: '2-digit', minute: '2-digit',
                                });
                                return (
                                    <View key={a.id} style={styles.agendamentoCard}>
                                        <View style={styles.agendamentoIconBox}>
                                            <Scissors size={18} color="#FF6B6B" />
                                        </View>
                                        <View style={styles.agendamentoInfo}>
                                            <Text style={styles.agendamentoServico}>{a.servico.nome}</Text>
                                            <View style={styles.agendamentoMeta}>
                                                <Calendar size={13} color="#AAA" />
                                                <Text style={styles.agendamentoMetaText}>{dateStr}</Text>
                                                <Clock size={13} color="#AAA" />
                                                <Text style={styles.agendamentoMetaText}>{timeStr}</Text>
                                            </View>
                                        </View>
                                        {a.servico.preco != null && (
                                            <Text style={styles.agendamentoPreco}>
                                                R$ {a.servico.preco.toFixed(2)}
                                            </Text>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </>
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
    agendarButton: {
        backgroundColor: '#FF6B6B',
        height: 55,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 24,
    },
    agendarButtonText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
    errorText: { color: '#E74C3C', fontSize: 12, marginTop: 5 },

    // Scheduled services section
    scheduledHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 32,
        marginBottom: 14,
    },
    scheduledTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
    emptyScheduled: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 10,
    },
    emptyScheduledText: { fontSize: 14, color: '#BBBBBB' },
    agendamentoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
        gap: 12,
    },
    agendamentoIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFF0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    agendamentoInfo: { flex: 1 },
    agendamentoServico: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
    agendamentoMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    agendamentoMetaText: { fontSize: 12, color: '#AAA' },
    agendamentoPreco: { fontSize: 14, fontWeight: '700', color: '#FF6B6B' },
});