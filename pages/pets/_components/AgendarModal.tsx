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
    Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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
const toDateStr = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
const todayStr = toDateStr(today);

const isValidDate = (val: string) => /^\d{2}-\d{2}-\d{4}$/.test(val);

export function AgendarModal({ visible, onClose, petId, petNome }: AgendarModalProps) {
    const router = useRouter();
    const [dateObj, setDateObj] = useState(today);
    const [date, setDate] = useState(todayStr);
    const [showDatePicker, setShowDatePicker] = useState(false);
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

    const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (event.type === 'dismissed' || !selected) return;
        setDateObj(selected);
        setDate(toDateStr(selected));
        setSelectedTime(null);
    };

    const totalPreco = selectedServicos.reduce((sum, s) => sum + (s.preco ?? 0), 0);

    const handleAgendar = () => {
        if (selectedServicos.length === 0) {
            Alert.alert('Atenção', 'Selecione ao menos um serviço.');
            return;
        }
        if (!isValidDate(date)) {
            Alert.alert('Atenção', 'Data inválida. Use o formato DD-MM-AAAA.');
            return;
        }
        if (!selectedTime) {
            Alert.alert('Atenção', 'Selecione um horário disponível.');
            return;
        }

        const [dd, mm, yyyy] = date.split('-');
        criarAgendamento(
            {
                dataHora: `${yyyy}-${mm}-${dd}T${selectedTime}:00`,
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
    const hasSlots = (horariosDisponiveis?.length ?? 0) > 0;
    const noSlotsAvailable =
        showTimePicker &&
        !loadingSlots &&
        hasSlots &&
        horariosDisponiveis!.every((slot) => !slot.disponivel);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    {}
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

                        {}
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

                        {}
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

                        {}
                        <SectionLabel text="2. Data" />
                        <TouchableOpacity
                            style={styles.inputRow}
                            onPress={() => setShowDatePicker(true)}
                            activeOpacity={0.7}
                        >
                            <Calendar size={20} color="#FF6B6B" />
                            <Text style={styles.dateText}>{date}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dateObj}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                minimumDate={today}
                                onChange={handleDateChange}
                            />
                        )}
                        {Platform.OS === 'ios' && showDatePicker && (
                            <TouchableOpacity
                                style={styles.doneBtn}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.doneBtnText}>Confirmar Data</Text>
                            </TouchableOpacity>
                        )}

                        {}
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

                        {showTimePicker && !loadingSlots && hasSlots && (
                            <View style={styles.slotsGrid}>
                                {horariosDisponiveis!.map((slot) => {
                                    const isSelected = selectedTime === slot.hora;
                                    const isDisabled = !slot.disponivel;
                                    return (
                                        <TouchableOpacity
                                            key={slot.hora}
                                            style={[
                                                styles.slotChip,
                                                isSelected && styles.slotChipSelected,
                                                isDisabled && styles.slotChipDisabled,
                                            ]}
                                            onPress={() => setSelectedTime(slot.hora)}
                                            disabled={isDisabled}
                                        >
                                            <Text
                                                style={[
                                                    styles.slotText,
                                                    isSelected && styles.textOnRed,
                                                    isDisabled && styles.slotTextDisabled,
                                                ]}
                                            >
                                                {slot.hora}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </ScrollView>

                    {}
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
    dateText: { flex: 1, height: 44, fontSize: 16, color: '#333', lineHeight: 44 },
    doneBtn: {
        alignSelf: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 8,
    },
    doneBtnText: { color: '#FF6B6B', fontWeight: '700', fontSize: 14 },

    

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
    slotChipDisabled: { backgroundColor: '#F2F2F2', borderColor: '#EAEAEA', opacity: 0.55 },
    slotText: { fontSize: 15, fontWeight: '600', color: '#444' },
    slotTextDisabled: { color: '#B5B5B5', textDecorationLine: 'line-through' },

    

    textOnRed: { color: '#FFF' },
    hint: { fontSize: 13, color: '#AAAAAA', marginTop: 4, lineHeight: 18 },
    emptySlots: { alignItems: 'center', paddingVertical: 20, gap: 8 },
    emptySlotsText: { fontSize: 14, color: '#BBBBBB', textAlign: 'center', lineHeight: 20 },

    

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
