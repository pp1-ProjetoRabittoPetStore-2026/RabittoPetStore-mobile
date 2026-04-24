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

import { useServicos, useCreateAgendamento } from '@/services/modules/agendamento/queries';
import { Servico } from '@/shared/types/agendamento';

interface AgendarModalProps {
    visible: boolean;
    onClose: () => void;
    petId: number;
    petNome: string;
}

export function AgendarModal({ visible, onClose, petId, petNome }: AgendarModalProps) {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');

    const [date, setDate] = useState(
        `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
    );
    const [time, setTime] = useState('09:00');
    const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

    const { data: servicos, isLoading: loadingServicos } = useServicos();
    const { mutate: criarAgendamento, isPending } = useCreateAgendamento();

    const isValidDate = (val: string) => /^\d{4}-\d{2}-\d{2}$/.test(val);
    const isValidTime = (val: string) => /^\d{2}:\d{2}$/.test(val);

    const handleAgendar = () => {
        if (!selectedServico) {
            Alert.alert('Atenção', 'Por favor, selecione um serviço.');
            return;
        }
        if (!isValidDate(date)) {
            Alert.alert('Atenção', 'Data inválida. Use o formato AAAA-MM-DD.');
            return;
        }
        if (!isValidTime(time)) {
            Alert.alert('Atenção', 'Horário inválido. Use o formato HH:MM.');
            return;
        }

        const dataHora = `${date}T${time}:00`;

        criarAgendamento(
            {
                dataHora,
                pet: { id: petId },
                servico: { id: selectedServico.id },
            },
            {
                onSuccess: () => {
                    Alert.alert('Sucesso! 🐾', `Agendamento de ${petNome} confirmado!`);
                    onClose();
                },
                onError: (error: any) => {
                    const msg =
                        error?.response?.data ??
                        'Não foi possível realizar o agendamento. Verifique os dados e tente novamente.';
                    Alert.alert('Erro no Agendamento', String(msg));
                },
            }
        );
    };

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
                        {/* Data */}
                        <Text style={styles.sectionLabel}>Data (AAAA-MM-DD)</Text>
                        <View style={styles.inputRow}>
                            <Calendar size={20} color="#FF6B6B" />
                            <TextInput
                                style={styles.textInput}
                                value={date}
                                onChangeText={setDate}
                                placeholder="2025-12-31"
                                placeholderTextColor="#CCC"
                                keyboardType="numeric"
                                maxLength={10}
                            />
                        </View>

                        {/* Hora */}
                        <Text style={styles.sectionLabel}>Horário (HH:MM)</Text>
                        <View style={styles.inputRow}>
                            <Clock size={20} color="#FF6B6B" />
                            <TextInput
                                style={styles.textInput}
                                value={time}
                                onChangeText={setTime}
                                placeholder="09:00"
                                placeholderTextColor="#CCC"
                                keyboardType="numeric"
                                maxLength={5}
                            />
                        </View>
                        <Text style={styles.hint}>
                            Atendimento das 09:00 às 17:00 • Consultas: intervalos de 30 min • Banhos: hora cheia
                        </Text>

                        {/* Serviços */}
                        <Text style={styles.sectionLabel}>Serviço</Text>
                        {loadingServicos ? (
                            <ActivityIndicator color="#FF6B6B" style={{ marginVertical: 20 }} />
                        ) : (
                            <View style={styles.servicosGrid}>
                                {servicos?.map((s) => (
                                    <TouchableOpacity
                                        key={s.id}
                                        style={[
                                            styles.servicoCard,
                                            selectedServico?.id === s.id && styles.servicoCardSelected,
                                        ]}
                                        onPress={() => setSelectedServico(s)}
                                    >
                                        <Scissors
                                            size={20}
                                            color={selectedServico?.id === s.id ? '#FFF' : '#FF6B6B'}
                                        />
                                        <Text
                                            style={[
                                                styles.servicoNome,
                                                selectedServico?.id === s.id && styles.servicoNomeSelected,
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
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: { fontSize: 22, fontWeight: 'bold', color: '#222' },
    subtitle: { fontSize: 14, color: '#888', marginTop: 2 },
    closeBtn: {
        padding: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
        marginTop: 20,
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
    textInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: '#333',
    },
    hint: { fontSize: 12, color: '#AAAAAA', marginTop: 8, marginLeft: 2, lineHeight: 17 },
    servicosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
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
    servicoCardSelected: {
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
    },
    servicoNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    servicoNomeSelected: { color: '#FFF' },
    servicoPreco: { fontSize: 13, color: '#888' },
    servicoPrecoSelected: { color: 'rgba(255,255,255,0.85)' },
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
