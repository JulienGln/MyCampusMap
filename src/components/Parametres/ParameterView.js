import { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
  Dimensions,
} from "react-native";

import { getAppTheme, setAppTheme } from "../../helpers/localStorage";
import { ThemeContext } from "../../themeContext";

export default function ParameterView() {
  const [isSwitchThemeEnabled, setSwitchThemeEnabled] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? "white" : "black", // gestion du thème de l'OS pour affichage cohérent
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: {
      flex: 1,
    },
    text: {
      color: theme === "light" ? "black" : "white",
    },
  });

  async function communicationServer() {
    // doc : https://reactnative.dev/docs/network
    //var url = "http://192.168.1.23:3000/data"; // adresse IP de l'ordinateur qui fait tourner le serveur
    // var url = "https://jsonplaceholder.typicode.com/posts"; // https://raw.githubusercontent.com/JulienGln/juliengln.github.io/main/data/data.json
    var url = "https://juliengln.github.io/data/krooteQuiz.json";

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

  function toggleTheme() {
    setSwitchThemeEnabled(!isSwitchThemeEnabled);
    setAppTheme(theme === "light" ? "dark" : "light");
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>OS : {Platform.OS.toLocaleUpperCase()}</Text>
      <Text style={styles.text}>Version : {Platform.Version}</Text>
      <Text style={styles.text}>
        Thème : {theme.toLocaleUpperCase() === "LIGHT" ? "CLAIR" : "SOMBRE"}
        {"\n"}
        <Switch
          style={{ alignItems: "center", justifyContent: "center" }}
          onValueChange={toggleTheme}
          value={isSwitchThemeEnabled}
        ></Switch>
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
        }}
      >
        {theme === "dark" && (
          <TouchableOpacity onPress={toggleTheme}>
            <Image
              source={require("../../assets/light_mode.png")}
              style={{ width: 120, height: 120, margin: 10 }}
            />
          </TouchableOpacity>
        )}
        {theme === "light" && (
          <TouchableOpacity onPress={toggleTheme}>
            <Image
              source={require("../../assets/dark_mode.png")}
              style={{ width: 120, height: 120, margin: 10, borderRadius: 100 }}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {data ? (
          <Text style={styles.text}> JSON : {JSON.stringify(data)}</Text>
        ) : (
          <Text style={styles.text}>
            JSON :
            <ActivityIndicator size="large" />
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
