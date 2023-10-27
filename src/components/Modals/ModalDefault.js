import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  Image,
} from "react-native";

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

  return (
    <Modal
      style={styles.modalView}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.centeredView,
          {
            backgroundColor: markerColors[testJSON[markerId].type],
          },
        ]}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitleText}>{testJSON[markerId].nom}</Text>
          <Text
            style={[
              styles.modalText,
              { color: markerColors[testJSON[markerId].type] },
            ]}
          >
            {nomLieux[testJSON[markerId].type]}
          </Text>
          {testJSON[markerId].avis.map((avis, index) => (
            <Text key={index} style={styles.modalText}>
              {avis.test}
            </Text>
          ))}

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Masquer le modal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  modalTitleText: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
  },
});
