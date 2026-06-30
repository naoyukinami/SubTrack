import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STORAGE_KEY = "mysubscription";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        setSubscriptions(json !== null ? JSON.parse(json) : []);
        setLoading(false);
      };
      loadData();
    }, [])
  );


  const goToAdd = () => {
    router.push('/addNew');
  };

  const handleDetail = (item) => {
    router.push({
      pathname: "/details",
      params: {
        id: item.id
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.load}>
        <Text>Loading...</Text>
      </View>
    );
  }

  let total = 0;
  for (let i = 0; i < subscriptions.length; i++) {
    total += subscriptions[i].price;
  }

  return (

    <View style={styles.container}>
      <Text style={styles.title}>My Subscriptions:</Text>

      <Text style={styles.total}>
        Monthly Total:
        <Text style={styles.price}> ${total.toFixed(2)}</Text>
        </Text>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleDetail(item)}>
            <Text style={styles.cardTitle}>{item.serviceName}</Text>
            <Text style={styles.cardSub}>Plan: {item.planName}</Text>
            <Text style={styles.cardSub}>Price: ${item.price}</Text>
            <Text style={styles.cardSub}>Start Date: {item.startDate} </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No subscription yet</Text>
        }
      />

      <TouchableOpacity style={styles.btn} onPress={goToAdd}>
        <Text style={styles.btnText}>Add new</Text>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  load: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 250,
    color: '#999999',
  },
  total: {
    fontSize: 28,
    fontWeight: 500,
    marginBottom: 15
  },
  price: {
    fontWeight: 'bold'
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  cardSub: {
    fontSize: 18,
    color: '#494949',
  },
  btn: {
    backgroundColor: '#eba925',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 24
  },
})
