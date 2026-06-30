import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

const STORAGE_KEY = 'mysubscription';

export default function AddNew() {
    const [serviceName, setServiceName] = useState('');
    const [planName, setPlanName] = useState('');
    const [price, setPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [memo, setMemo] = useState('');

    const handleSave = async () => {
        if (serviceName === '') {
            Alert.alert('Please add your subscription details');
            return;
        }

        const newItem = {
            id: Date.now().toString(),
            serviceName: serviceName,
            planName: planName,
            price: Number(price) || 0,
            startDate: startDate,
            memo: memo
        };

        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            const existing = json !== null ? JSON.parse(json) : [];
            const updated = [];
            for (let i = 0; i < existing.length; i++) {
                updated.push(existing[i]);
            }
            updated.push(newItem);

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save subscription');
        }
    }


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.container}>
                <Text style={styles.label}>Service: </Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Netflix"
                    value={serviceName}
                    onChangeText={setServiceName}
                    placeholderTextColor="#888888"
                />

                <Text style={styles.label}>Plan: </Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Basic Plan"
                    value={planName}
                    onChangeText={setPlanName}
                    placeholderTextColor="#888888"
                />

                <Text style={styles.label}>Price: </Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 9.99"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholderTextColor="#888888"
                />

                <Text style={styles.label}>Start Date: </Text>
                <TextInput
                    style={styles.input}
                    placeholder="YY/MM/DD"
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholderTextColor="#888888"
                />

                <Text style={styles.label}>Memo: </Text>
                <TextInput
                    style={styles.textArea}
                    placeholder=""
                    value={memo}
                    onChangeText={setMemo}
                    multiline={true}
                    numberOfLines={5}
                    maxLength={500}
                    placeholderTextColor="#888888"
                />

                <TouchableOpacity style={styles.btn} onPress={handleSave}>
                    <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#ffffff',
        padding: 12,
        marginBottom: 12
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 6
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start",
        textAlignVertical: 'top', // Crucial for Android alignment
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        fontSize: 12,
        backgroundColor: '#fff',
        marginBottom: 30
    },
    btn: {
        backgroundColor: '#30aa2e',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20
    },
})