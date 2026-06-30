import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STORAGE_KEY = "mysubscription";

export default function Details() {
    const params = useLocalSearchParams();
    const id = params.id;

    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const json = await AsyncStorage.getItem(STORAGE_KEY);

            let list = [];
            if (json !== null) {
                list = JSON.parse(json);
            }

            let found = null;
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    found = list[i];
                }
            }

            setSubscription(found);
        };

        loadData();
    }, [id]);

    const deleteSubscription = async () => {
        //get all data (subscriptions)
        const json = await AsyncStorage.getItem(STORAGE_KEY);

        let list = [];
        if (json !== null) {
            list = JSON.parse(json);
        }

        //put data except deleting into array
        let updatedList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].id !== id) {
                updatedList.push(list[i]);
            }
        }

        //new list
        let updatedJson = await JSON.stringify(updatedList);
        await AsyncStorage.setItem(STORAGE_KEY, updatedJson);

        router.back();
    }

    const handleDelete = () => {
        Alert.alert(
            "Delete subscription",
            "Are you sure you want to delete this subscription?",
            [
                { text: "Cancel" },
                { text: "Delete", onPress: deleteSubscription },
            ]
        );
    };

    if (subscription === null) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Service: <Text style={styles.value}>{subscription.serviceName}</Text>
            </Text>


            <Text style={styles.label}>
                Plan: <Text style={styles.value}>{subscription.planName}</Text>
            </Text>


            <Text style={styles.label}>
                Price: <Text style={styles.value}>${subscription.price}</Text>
            </Text>


            <Text style={styles.label}>
                Start Date: <Text style={styles.value}>{subscription.startDate}</Text>
            </Text>


            <Text style={styles.label}>
                Memo: <Text style={styles.value}>{subscription.memo}</Text>
            </Text>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#888888",
        marginTop: 12,
    },
    value: {
        fontSize: 26,
        color: '#000000'
    },
    deleteBtn: {
        backgroundColor: "#dc2626",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 60,
    },
    deleteBtnText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 18,
    },
});