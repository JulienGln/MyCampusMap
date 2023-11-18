import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  SegmentedButtons,
  TextInput,
  Button,
  Avatar,
  Icon,
} from "react-native-paper";

import {
  getAppTheme,
  setAppTheme,
  getUser,
  setUser,
} from "../../helpers/localStorage";
import { ThemeContext } from "../../themeContext";

export default function ParameterView({ navigation }) {
  const [isSwitchThemeEnabled, setSwitchThemeEnabled] = useState(false);
  const [userName, setUserName] = useState(
    String(getUser.name) === null ? "" : ""
  );
  const [previousUserName, setPreviousUserName] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
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
    userButton: { marginTop: 10 },
  });

  async function communicationServer() {
    // doc : https://reactnative.dev/docs/network
    //var url = "http://192.168.1.23:3000/data"; // adresse IP de l'ordinateur qui fait tourner le serveur
    // var url = "https://jsonplaceholder.typicode.com/posts"; // https://raw.githubusercontent.com/JulienGln/juliengln.github.io/main/data/data.json
    //var url = "https://juliengln.github.io/data/krooteQuiz.json";
    var url = "http://192.168.1.23:3001/lieux";

    try {
      console.log("Avant la requête fetch");
      const response = await axios.get(url);

      if (!response) {
        console.error("Erreur HTTP", response.status);
      } else {
        console.log("Réponse OK, en attente de la conversion en JSON");
        const data = response.data;
        console.log("Données récupérées avec succès :", data);
        return data;
      }
    } catch (error) {
      console.error("Erreur fonction fetch", error.message);
    }
  }

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://juliengln.github.io/data/krooteQuiz.json"
        ); //axios.get("http://192.168.1.23:3000/lieux");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      /*const result = await communicationServer();
      setData(result);*/
    };

    fetchData();

    const fetchUser = async () => {
      const fetchedUser = await getUser();
      setUserName(fetchedUser.name);
      setPreviousUserName(fetchedUser.name);
    };
    fetchUser();
  }, []);

  navigation.setOptions({
    headerRight: () => (
      <Avatar.Text
        label={userName.charAt(0).toLocaleUpperCase()}
        color="white"
        style={{
          width: 60,
          height: 60,
          backgroundColor: theme === "light" ? "cornflowerblue" : "coral",
          borderRadius: 0,
        }}
      />
    ),
  });

  function toggleTheme() {
    setSwitchThemeEnabled(!isSwitchThemeEnabled);
    setAppTheme(theme === "light" ? "dark" : "light");
    setTheme(theme === "light" ? "dark" : "light");
  }

  // Fonction pour créer un délai (sleep)
  const sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));
  async function handleChangeUserName() {
    setButtonLoading(true);
    await sleep(800);
    setUser({ name: userName });
    setPreviousUserName(userName);
    setButtonLoading(false);
  }

  return (
    <View style={styles.container}>
      {buttonLoading ? (
        <ActivityIndicator />
      ) : (
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          {previousUserName}
        </Text>
      )}
      <Text style={styles.text}>
        <Icon
          source={Platform.OS !== "android" ? "apple-ios" : "android"}
          color={theme === "light" ? "black" : "white"}
          size={48}
        />
      </Text>
      <Text style={styles.text}>Version : {Platform.Version}</Text>
      <Text style={styles.text}>
        Thème : {theme.toLocaleUpperCase() === "LIGHT" ? "CLAIR" : "SOMBRE"}
      </Text>

      {/*{theme === "dark" && (
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
      )}*/}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
        }}
      >
        <SegmentedButtons
          value={theme}
          onValueChange={toggleTheme}
          buttons={[
            {
              value: "dark",
              label: "Sombre",
              icon: "weather-night",
              checkedColor: "black",
              style: {
                backgroundColor: theme === "dark" ? "coral" : "white",
              },
            },
            {
              value: "light",
              label: "Clair",
              icon: "white-balance-sunny",
              uncheckedColor: "white",
              checkedColor: "white",
              style: {
                backgroundColor: theme === "light" ? "cornflowerblue" : "black",
              },
            },
          ]}
        />
      </View>

      <TextInput
        mode="outlined"
        label={"Nom d'utilisateur"}
        value={userName !== "" ? userName : ""}
        onChangeText={(text) => {
          setUserName(text);
        }}
        textColor={theme === "light" ? "black" : "white"}
        activeOutlineColor={theme === "light" ? "cornflowerblue" : "coral"}
        outlineStyle={{
          backgroundColor: "transparent",
          borderColor: theme === "light" ? "cornflowerblue" : "coral",
        }}
        style={{
          backgroundColor: theme === "light" ? "transparent" : "black",
          marginTop: "5%",
        }}
      />
      {userName !== previousUserName && (
        <Button
          style={styles.userButton}
          mode="elevated"
          icon="check"
          dark
          loading={buttonLoading}
          disabled={userName === previousUserName}
          buttonColor={theme === "light" ? "cornflowerblue" : "coral"}
          onPress={handleChangeUserName}
        >
          Valider
        </Button>
      )}

      {/*
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
          */}
    </View>
  );
}
