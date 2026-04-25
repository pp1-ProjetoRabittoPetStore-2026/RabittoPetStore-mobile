import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import { X, Calendar, Clock, Scissors } from 'lucide-react-native';

import { useServicos, useHorariosDisponiveis, useCreateAgendamento } from '@/services/modules/agendamento/queries';
import { Servico } from '@/shared/types/agendamento';
import { useRouter } from 'expo-router';

interface AgendarModalProps {
    visible: boolean;
    onClose: () => void;
    petId: number;
    petNome: string;
}

const today = new Date();
const pad = (n: number) => String(n).padStart(2, '0');
const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

const isValidDate = (val: string) => /^\d{4}-\d{2}-\d{2}$/.test(val);

export function AgendarModal({ visible, onClose, petId, petNome }: AgendarModalProps) {
    const router = useRouter();
    const [date, setDate] = useState(todayStr);
    const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const { data: servicos, isLoading: loadingServicos } = useServicos();


    const {
        data: horariosDisponiveis,
        isLoading: loadingHorarios,
        isFetching: fetchingHorarios,
    } = useHorariosDisponiveis(
        isValidDate(date) ? date : '',
        selectedServico?.id ?? null
    );

    const { mutate: criarAgendamento, isPending } = useCreateAgendamento();

    // Reset selected time whenever service or date changes
    const handleServicoSelect = (s: Servico) => {
        setSelectedServico(s);
        setSelectedTime(null);
    };

    const handleDateChange = (val: string) => {
        setDate(val);
        setSelectedTime(null);
    };

    const handleAgendar = () => {
        if (!selectedServico) {
            Alert.alert('Atenção', 'Selecione um serviço.');
            return;
        }
        if (!isValidDate(date)) {
            Alert.alert('Atenção', 'Data inválida. Use o formato AAAA-MM-DD.');
            return;
        }
        if (!selectedTime) {
            Alert.alert('Atenção', 'Selecione um horário disponível.');
            return;
        }

        criarAgendamento(
            {
                dataHora: `${date}T${selectedTime}:00`,
                pet: { id: petId },
                servico: { id: selectedServico.id },
            },
            {
                onSuccess: () => {
                    Alert.alert('Sucesso! 🐾', `Agendamento de ${petNome} confirmado para ${date} às ${selectedTime}!`);
                    setSelectedTime(null);
                    onClose();
                    router.push(`/pets-details/${petId}`)
                },
                onError: (error: any) => {
                    const msg =
                        error?.response?.data ??
                        'Não foi possível realizar o agendamento.';
                    Alert.alert('Erro no Agendamento', String(msg));
                },
            }
        );
    };

    const showTimePicker = isValidDate(date) && selectedServico != null;
    const loadingSlots = showTimePicker && (loadingHorarios || fetchingHorarios);
    const noSlotsAvailable =
        showTimePicker &&
        !loadingSlots &&
        horariosDisponiveis != null &&
        horariosDisponiveis.length === 0;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Agendar Serviço</Text>
                            <Text style={styles.subtitle}>Pet: {petNome}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={22} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* ── STEP 1: Serviço ── */}
                        <SectionLabel text="1. Serviço" />
                        {loadingServicos ? (
                            <ActivityIndicator color="#FF6B6B" style={{ marginVertical: 16 }} />
                        ) : (
                            <View style={styles.servicosGrid}>
                                {servicos?.map((s) => (
                                    <TouchableOpacity
                                        key={s.id}
                                        style={[
                                            styles.servicoCard,
                                            selectedServico?.id === s.id && styles.servicoCardSelected,
                                        ]}
                                        onPress={() => handleServicoSelect(s)}
                                    >
                                        <Scissors
                                            size={20}
                                            color={selectedServico?.id === s.id ? '#FFF' : '#FF6B6B'}
                                        />
                                        <Text
                                            style={[
                                                styles.servicoNome,
                                                selectedServico?.id === s.id && styles.textOnRed,
                                            ]}
                                        >
                                            {s.nome}
                                        </Text>
                                        {s.preco != null && (
                                            <Text
                                                style={[
                                                    styles.servicoPreco,
                                                    selectedServico?.id === s.id && styles.servicoPrecoSelected,
                                                ]}
                                            >
                                                R$ {s.preco.toFixed(2)}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* ── STEP 2: Data ── */}
                        <SectionLabel text="2. Data (AAAA-MM-DD)" />
                        <View style={styles.inputRow}>
                            <Calendar size={20} color="#FF6B6B" />
                            <TextInput
                                style={styles.textInput}
                                value={date}
                                onChangeText={handleDateChange}
                                placeholder="2025-12-31"
                                placeholderTextColor="#CCC"
                                keyboardType="numeric"
                                maxLength={10}
                            />
                        </View>

                        {/* ── STEP 3: Horário disponível ── */}
                        <SectionLabel text="3. Horário Disponível" />

                        {!selectedServico && (
                            <Text style={styles.hint}>Selecione um serviço para ver os horários disponíveis.</Text>
                        )}

                        {!isValidDate(date) && selectedServico && (
                            <Text style={styles.hint}>Insira uma data válida para ver os horários disponíveis.</Text>
                        )}

                        {loadingSlots && (
                            <ActivityIndicator color="#FF6B6B" style={{ marginVertical: 16 }} />
                        )}

                        {noSlotsAvailable && (
                            <View style={styles.emptySlots}>
                                <Clock size={22} color="#CCC" />
                                <Text style={styles.emptySlotsText}>
                                    Nenhum horário disponível nesta data.{'\n'}Tente outro dia.
                                </Text>
                            </View>
                        )}

                        {showTimePicker && !loadingSlots && (horariosDisponiveis?.length ?? 0) > 0 && (
                            <View style={styles.slotsGrid}>
                                {horariosDisponiveis!.map((slot) => (
                                    <TouchableOpacity
                                        key={slot}
                                        style={[
                                            styles.slotChip,
                                            selectedTime === slot && styles.slotChipSelected,
                                        ]}
                                        onPress={() => setSelectedTime(slot)}
                                    >
                                        <Text
                                            style={[
                                                styles.slotText,
                                                selectedTime === slot && styles.textOnRed,
                                            ]}
                                        >
                                            {slot}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    {/* Confirm */}
                    <TouchableOpacity
                        style={[styles.confirmBtn, isPending && { opacity: 0.7 }]}
                        onPress={handleAgendar}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.confirmText}>Confirmar Agendamento</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function SectionLabel({ text }: { text: string }) {
    return <Text style={styles.sectionLabel}>{text}</Text>;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FDFDFD',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 28,
        paddingBottom: 40,
        maxHeight: '92%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: { fontSize: 22, fontWeight: 'bold', color: '#222' },
    subtitle: { fontSize: 14, color: '#888', marginTop: 2 },
    closeBtn: { padding: 8, backgroundColor: '#F0F0F0', borderRadius: 10 },

    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
        marginTop: 22,
    },

    // Serviços
    servicosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    servicoCard: {
        width: '47%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#EFEFEF',
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    servicoCardSelected: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' },
    servicoNome: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
    servicoPreco: { fontSize: 13, color: '#888' },
    servicoPrecoSelected: { color: 'rgba(255,255,255,0.85)' },

    // Date input
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        paddingHorizontal: 18,
        paddingVertical: 6,
    },
    textInput: { flex: 1, height: 44, fontSize: 16, color: '#333' },

    // Time slots
    slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    slotChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#EFEFEF',
        minWidth: 72,
        alignItems: 'center',
    },
    slotChipSelected: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' },
    slotText: { fontSize: 15, fontWeight: '600', color: '#444' },

    // Shared
    textOnRed: { color: '#FFF' },
    hint: { fontSize: 13, color: '#AAAAAA', marginTop: 4, lineHeight: 18 },
    emptySlots: { alignItems: 'center', paddingVertical: 20, gap: 8 },
    emptySlotsText: { fontSize: 14, color: '#BBBBBB', textAlign: 'center', lineHeight: 20 },

    // Footer button
    confirmBtn: {
        backgroundColor: '#FF6B6B',
        height: 56,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
    },
    confirmText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
});
