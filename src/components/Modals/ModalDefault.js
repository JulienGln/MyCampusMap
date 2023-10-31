import { useState, useEffect, useContext } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  Text,
  FlatList,
  Image,
} from "react-native";

import { ThemeContext } from "../../themeContext";

const testJSON = require("../../../testData.json");

// dictionnaire qui associe le type d'un bâtiment à un vrai nom
const nomLieux = {
  Restaurant: "Restaurant",
  Parking: "Parking",
  batiment_scolaire: "Bâtiment scolaire",
  Sante: "Santé",
  logement_crous: "Logement CROUSSE",
};

// dictionnaire qui associe le type d'un bâtiment à une couleur
const markerColors = {
  Restaurant: "coral",
  Parking: "steelblue",
  batiment_scolaire: "fuchsia",
  Sante: "green",
  logement_crous: "gold",
};
/**
 * Modal qui s'affiche lorsqu'on clique sur un marqueur déjà existant (description du bâtiment, avis, photos...)
 */
export default function ModalDefault({ visible, markerId, onClose }) {
  const [data, setData] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(0);
  const [weatherData, setWeatherData] = useState(null);

  const { theme } = useContext(ThemeContext); // récupération du thème de l'app
  const themeStyles = styles(theme); // appel de la fonction pour la feuille de style suivant le thème

  /**
   * Récupère l'avis d'un point par son id
   * @returns - le json d'un avis sur le marqueur
   */
  async function getMarkerById(markerId) {
    // utiliser express pour aller chercher le json
    // doc : https://reactnative.dev/docs/network
    //var url = "http://192.168.1.23:3000/data/" + markerId; // adresse IP de l'ordinateur qui fait tourner le serveur
    var url = "https://jsonplaceholder.typicode.com/posts";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Erreur HTTP", response.status);
      } else {
        const data = await response.json();
        return data[markerId].title;
      }
    } catch (error) {
      console.error("Erreur fonction fetch", error);
    }
  }

  // récupération des données du marqueur
  useEffect(() => {
    /*const fetchData = async () => {
      const result = await getMarkerById(1); // id du marqueur
      setData(result);
    };

    fetchData();*/
    setData(testJSON);
    setCurrentMarker(testJSON[markerId]);

    fetch(
      `https://api.open-meteo.com/v1/meteofrance?latitude=${testJSON[markerId].coordonnees.latitude}&longitude=${testJSON[markerId].coordonnees.longitude}&current_weather=true`
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data.current_weather));
  }, []);

  function avisItem({ item }) {
    if (item && item.test) {
      return (
        <View style={{ marginRight: 20 }}>
          <Text style={themeStyles.avisUserName}>Gudule</Text>
          <Text
            style={{ fontStyle: "italic", color: "gold", fontWeight: "bold" }}
          >
            5/5
          </Text>
          <Text style={[themeStyles.modalText, { fontWeight: "bold" }]}>
            {item.test}
          </Text>
        </View>
      );
    } else return null;
  }

  return (
    <Modal
      style={themeStyles.modalView}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={[
          themeStyles.centeredView,
          {
            backgroundColor: markerColors[testJSON[markerId].type],
          },
        ]}
      >
        <View style={themeStyles.modalView}>
          <Text style={themeStyles.modalTitleText}>
            {testJSON[markerId].nom}
          </Text>
          <Text
            style={[
              themeStyles.modalText,
              {
                color: markerColors[testJSON[markerId].type],
                fontWeight: "bold",
              },
            ]}
          >
            {nomLieux[testJSON[markerId].type]}
          </Text>

          {/*testJSON[markerId].avis.map((avis, index) => (
            <Text key={index} style={styles.modalText}>
              {avis.test}
            </Text>
          ))*/}
          <FlatList
            data={testJSON[markerId]?.avis}
            renderItem={avisItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
          />

          <Image
            source={{
              uri: "https://media.giphy.com/media/XcujzilpaiGEWFV16n/giphy.gif",
            }}
            // source={require("../../assets/mycampusmap_logoV2.jpg")}
            style={{ width: 200, height: 200, borderRadius: 20, margin: 10 }}
          />

          {weatherData && (
            <View style={themeStyles.weatherView}>
              {/*<Text>Météo : {JSON.stringify(weatherData)}</Text>*/}
              <Text style={themeStyles.weatherText}>
                {weatherData.is_day ? "Jour" : "Nuit"}
              </Text>
              <Text style={themeStyles.weatherText}>
                Date :{" "}
                {new Date(weatherData.time).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text style={themeStyles.weatherText}>
                Température : {weatherData.temperature} °C
              </Text>
              <Text style={themeStyles.weatherText}>
                Vent : {weatherData.windspeed} km/h ({weatherData.winddirection}
                °)
              </Text>
            </View>
          )}

          <Pressable
            style={[themeStyles.button, themeStyles.buttonClose]}
            onPress={onClose}
          >
            <Text style={themeStyles.textStyle}>Masquer le modal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// styles devient une fonction qui prend le thème en paramètre
const styles = (theme) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: theme === "light" ? "white" : "black",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "coral",
      marginTop: 10,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      color: theme === "light" ? "black" : "white",
      textAlign: "center",
      fontSize: 20,
    },
    modalTitleText: {
      fontWeight: "bold",
      fontSize: 30,
      color: theme === "light" ? "black" : "white",
      marginBottom: 20,
      textAlign: "center",
    },
    weatherView: {
      textAlign: "center",
    },
    weatherText: {
      color: theme === "light" ? "black" : "white",
      fontWeight: "bold",
    },
    avisUserName: {
      fontStyle: "italic",
      fontWeight: "bold",
      color: theme === "light" ? "black" : "white",
    },
  });
