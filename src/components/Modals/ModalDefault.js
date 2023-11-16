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
import { Card, Icon } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemeContext } from "../../themeContext";

const testJSON = require("../../../testData.json");

// dictionnaire qui associe le type d'un bâtiment à un vrai nom
const nomLieux = {
  Restaurant: "Restaurant",
  Parking: "Parking",
  batiment_scolaire: "Bâtiment scolaire",
  Sante: "Santé",
  logement_crous: "Logement CROUS",
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
  }, []);

  function avisItem({ item }) {
    if (item && item.texte) {
      var noteExemple = Math.floor(Math.random() * 6);
      return (
        <Card
          style={themeStyles.card}
          mode={theme === "light" ? "elevated" : "outlined"}
        >
          <Card.Title title="Avis" titleStyle={themeStyles.cardTitle} />
          <Card.Content>
            <Text style={themeStyles.avisUserName}>Gudule</Text>
            <Text
              style={{ fontStyle: "italic", color: "gold", fontWeight: "bold" }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Icon
                  key={i}
                  source={"star"}
                  size={14}
                  color={
                    i < noteExemple
                      ? "gold"
                      : theme === "light"
                      ? "darkgray"
                      : "lightgray"
                  }
                  style={{
                    fontStyle: "italic",
                    color: "gold",
                    fontWeight: "bold",
                  }}
                />
              ))}
            </Text>
            <Text style={[themeStyles.modalText, { fontWeight: "bold" }]}>
              {item.texte}
            </Text>
          </Card.Content>
        </Card>
      );
    } else return null;
  }

  /**
   * Ajout d'un avis au lieu
   */
  function handleAddAvis() {
    onClose();
  }

  return (
    <Modal
      style={themeStyles.modalView}
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[themeStyles.centeredView]}>
        <View style={themeStyles.modalView}>
          <Pressable
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 1, // Assure que la croix est au-dessus du contenu du modal
            }}
            onPress={onClose}
          >
            <MaterialCommunityIcons
              name="window-close"
              size={48}
              color={theme === "light" ? "black" : "white"}
            />
          </Pressable>
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
          />

          {/* <Image
            source={{
              uri: "https://media.giphy.com/media/XcujzilpaiGEWFV16n/giphy.gif",
            }}
            // source={require("../../assets/mycampusmap_logoV2.jpg")}
            style={{ width: 200, height: 200, borderRadius: 20, margin: 10 }}
          /> */}

          <Pressable
            style={[themeStyles.button, themeStyles.buttonOpen]}
            onPress={handleAddAvis}
          >
            <Text style={themeStyles.textStyle}>Ajouter un avis</Text>
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
      width: "90%",
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
      backgroundColor: "cornflowerblue",
      marginTop: 10,
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
    avisUserName: {
      fontStyle: "italic",
      fontWeight: "bold",
      color: theme === "light" ? "black" : "white",
    },
    card: {
      marginRight: 20,
      height: 200,
      width: 200,
      backgroundColor: theme === "light" ? "aliceblue" : "navy",
    },
    cardTitle: {
      color: theme === "light" ? "black" : "white",
    },
  });
