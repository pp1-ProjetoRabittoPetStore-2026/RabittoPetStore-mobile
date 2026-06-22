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
import { X, Calendar, Clock, Scissors, Check } from 'lucide-react-native';

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
    const [selectedServicos, setSelectedServicos] = useState<Servico[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const { data: servicos, isLoading: loadingServicos } = useServicos();

    const selectedIds = selectedServicos.map((s) => s.id);

    const {
        data: horariosDisponiveis,
        isLoading: loadingHorarios,
        isFetching: fetchingHorarios,
    } = useHorariosDisponiveis(
        isValidDate(date) ? date : '',
        selectedIds
    );

    const { mutate: criarAgendamento, isPending } = useCreateAgendamento();

    // Toggle service selection (multi-select)
    const handleServicoToggle = (s: Servico) => {
        setSelectedServicos((prev) => {
            const exists = prev.some((sel) => sel.id === s.id);
            if (exists) {
                return prev.filter((sel) => sel.id !== s.id);
            }
            return [...prev, s];
        });
        setSelectedTime(null);
    };

    const handleDateChange = (val: string) => {
        setDate(val);
        setSelectedTime(null);
    };

    const totalPreco = selectedServicos.reduce((sum, s) => sum + (s.preco ?? 0), 0);

    const handleAgendar = () => {
        if (selectedServicos.length === 0) {
            Alert.alert('Atenção', 'Selecione ao menos um serviço.');
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
                servicos: selectedServicos.map((s) => ({ id: s.id })),
            },
            {
                onSuccess: () => {
                    const nomes = selectedServicos.map((s) => s.nome).join(', ');
                    Alert.alert('Sucesso! 🐾', `Agendamento de ${petNome} confirmado para ${date} às ${selectedTime}!\nServiços: ${nomes}`);
                    setSelectedTime(null);
                    setSelectedServicos([]);
                    onClose();
                    router.push(`/pets-details/${petId}`);
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

    const showTimePicker = isValidDate(date) && selectedServicos.length > 0;
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
                            <Text style={styles.title}>Agendar Serviços</Text>
                            <Text style={styles.subtitle}>Pet: {petNome}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={22} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* ── STEP 1: Serviços (multi-select) ── */}
                        <SectionLabel text="1. Serviços (selecione um ou mais)" />
                        {loadingServicos ? (
                            <ActivityIndicator color="#FF6B6B" style={{ marginVertical: 16 }} />
                        ) : (
                            <View style={styles.servicosGrid}>
                                {servicos?.map((s) => {
                                    const isSelected = selectedServicos.some((sel) => sel.id === s.id);
                                    return (
                                        <TouchableOpacity
                                            key={s.id}
                                            style={[
                                                styles.servicoCard,
                                                isSelected && styles.servicoCardSelected,
                                            ]}
                                            onPress={() => handleServicoToggle(s)}
                                        >
                                            {isSelected ? (
                                                <Check size={20} color="#FFF" />
                                            ) : (
                                                <Scissors size={20} color="#FF6B6B" />
                                            )}
                                            <Text
                                                style={[
                                                    styles.servicoNome,
                                                    isSelected && styles.textOnRed,
                                                ]}
                                            >
                                                {s.nome}
                                            </Text>
                                            {s.preco != null && (
                                                <Text
                                                    style={[
                                                        styles.servicoPreco,
                                                        isSelected && styles.servicoPrecoSelected,
                                                    ]}
                                                >
                                                    R$ {s.preco.toFixed(2)}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}

                        {/* ── Summary: selected services ── */}
                        {selectedServicos.length > 0 && (
                            <View style={styles.summaryBox}>
                                <Text style={styles.summaryTitle}>
                                    {selectedServicos.length} serviço{selectedServicos.length > 1 ? 's' : ''} selecionado{selectedServicos.length > 1 ? 's' : ''}
                                </Text>
                                {selectedServicos.map((s) => (
                                    <Text key={s.id} style={styles.summaryItem}>
                                        • {s.nome}{s.preco != null ? ` — R$ ${s.preco.toFixed(2)}` : ''}
                                    </Text>
                                ))}
                                <View style={styles.summaryDivider} />
                                <Text style={styles.summaryTotal}>
                                    Total: R$ {totalPreco.toFixed(2)}
                                </Text>
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

                        {selectedServicos.length === 0 && (
                            <Text style={styles.hint}>Selecione ao menos um serviço para ver os horários disponíveis.</Text>
                        )}

                        {!isValidDate(date) && selectedServicos.length > 0 && (
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

    // Summary box
    summaryBox: {
        backgroundColor: '#FFF5F5',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FFD4D4',
        padding: 16,
        marginTop: 16,
    },
    summaryTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FF6B6B',
        marginBottom: 8,
    },
    summaryItem: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#FFD4D4',
        marginVertical: 10,
    },
    summaryTotal: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FF6B6B',
    },

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
