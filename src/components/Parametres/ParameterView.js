import { useState, useEffect } from "react";
import {
  Text,
  View,
  Platform,
  Appearance,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function ParameterView() {
  async function communicationServer() {
    // doc : https://reactnative.dev/docs/network
    //var url = "http://192.168.1.23:3000/data"; // adresse IP de l'ordinateur qui fait tourner le serveur
    var url = "https://jsonplaceholder.typicode.com/posts";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Erreur HTTP", response.status);
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Erreur fonction fetch", error);
    }
  }

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await communicationServer();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>OS : {Platform.OS.toLocaleUpperCase()}</Text>
      <Text style={styles.text}>Version : {Platform.Version}</Text>
      <Text style={styles.text}>
        Thème (par défaut) : {Appearance.getColorScheme().toLocaleUpperCase()}
      </Text>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}> JSON : {JSON.stringify(data)}</Text>
      </ScrollView>
    </View>
  );
}

const colorTheme = Appearance.getColorScheme() === "light" ? "white" : "black"; // gestion du thème de l'OS pour affichage cohérent
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTheme,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  text: {
    color: colorTheme === "white" ? "black" : "white",
  },
});
