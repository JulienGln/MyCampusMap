import { useState, useEffect, useContext } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ToastAndroid,
} from "react-native";
import {
  Card,
  Icon,
  Button,
  Avatar,
  ActivityIndicator,
} from "react-native-paper";

import { ThemeContext } from "../../themeContext";
import ModalNewAvis from "./ModalNewAvis";
import { getUser } from "../../helpers/localStorage";
import { getAllLieux, getLieuById } from "../../helpers/request";

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
  const [data, setData] = useState(testJSON[0]);
  const [currentMarker, setCurrentMarker] = useState(0);
  const [modalNewAvisVisible, setModalNewAvisVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedAvis, setSelectedAvis] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { theme } = useContext(ThemeContext); // récupération du thème de l'app
  const themeStyles = styles(theme); // appel de la fonction pour la feuille de style suivant le thème

  /**
   * Récupère l'avis d'un point par son id
   */
  async function getMarkerById(markerId) {
    try {
      const donnees = await getLieuById(markerId);
      setData(donnees);
      setIsLoading(false);
    } catch (error) {}
  }

  function calculNoteMoyenne() {
    var moy = 0;
    data.avis.forEach((elt) => {
      moy += parseInt(elt.note);
    });
    return (moy / data.avis.length).toFixed(2);
  }

  /**
   * Appelée quand on veut supprimer un de ses avis
   */
  function onDeleteAvis(texte, utilisateur) {
    var avis = data.avis;
    avis.forEach((item, index) => {
      if (item.texte === texte && item.utilisateur === utilisateur) {
        setSelectedAvis(index);
        avis.splice(index, 1);
        ToastAndroid.show("Avis supprimé avec succès !", ToastAndroid.SHORT);
        //onClose();
      }
    });
  }

  // récupération des données du marqueur
  useEffect(() => {
    /*const fetchData = async () => {
      const result = await getMarkerById(1); // id du marqueur
      setData(result);
    };

    fetchData();*/
    //setData(testJSON[markerId]?.avis); //testJSON);
    getMarkerById(markerId);
    //setCurrentMarker(data);
    setCurrentMarker(testJSON[markerId]);

    const fetchUser = async () => {
      const fetchedUser = await getUser();
      setUserName(fetchedUser.name);
    };
    fetchUser();
  }, []);

  function avisItem({ item }) {
    if (item && item.texte) {
      return (
        <Card
          style={themeStyles.card}
          mode={theme === "light" ? "elevated" : "outlined"}
        >
          <Card.Title
            title={item.utilisateur}
            titleStyle={themeStyles.cardTitle}
            left={(props) => (
              <Avatar.Text
                {...props}
                style={{
                  backgroundColor:
                    theme === "light" ? "cornflowerblue" : "coral",
                }}
                color="white"
                label={item.utilisateur.charAt(0).toLocaleUpperCase()}
              />
            )}
          />
          {userName === item.utilisateur && (
            <Pressable
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                zIndex: 1, // Assure que la croix est au-dessus du contenu du modal
              }}
              onPress={() => onDeleteAvis(item.texte, item.utilisateur)}
            >
              <Icon
                source="close"
                size={24}
                color={theme === "light" ? "crimson" : "red"}
              />
            </Pressable>
          )}

          <Card.Content>
            <Text
              style={{ fontStyle: "italic", color: "gold", fontWeight: "bold" }}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Icon
                  key={i}
                  source={"star"}
                  size={14}
                  color={
                    i < item.note
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
            <Text
              style={[
                themeStyles.modalText,
                { fontWeight: "bold", textAlign: "auto" },
              ]}
            >
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
    setModalNewAvisVisible(true);
    //onClose();
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
            <Icon
              source="close"
              size={36}
              color={theme === "light" ? "black" : "white"}
            />
          </Pressable>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={theme === "light" ? "cornflowerblue" : "coral"}
            />
          ) : (
            <>
              <Text style={themeStyles.modalTitleText}>{data.nom}</Text>
              <Text style={themeStyles.modalText}>
                <Icon source="star-settings" color="gold" size={24} />
                {" " + calculNoteMoyenne()}
              </Text>
              <Text
                style={[
                  themeStyles.modalText,
                  {
                    color: markerColors[data.typeBatiment],
                    fontWeight: "bold",
                  },
                ]}
              >
                {nomLieux[data.typeBatiment]}
              </Text>

              {/*testJSON[markerId].avis.map((avis, index) => (
            <Text key={index} style={styles.modalText}>
              {avis.test}
            </Text>
          ))*/}
              <FlatList
                data={data?.avis}
                renderItem={avisItem}
                keyExtractor={(item, index) => index.toString()}
                extraData={selectedAvis}
                horizontal
              />

              {/* <Image
            source={{
              uri: "https://media.giphy.com/media/XcujzilpaiGEWFV16n/giphy.gif",
            }}
            // source={require("../../assets/mycampusmap_logoV2.jpg")}
            style={{ width: 200, height: 200, borderRadius: 20, margin: 10 }}
          /> */}

              <ModalNewAvis
                visible={modalNewAvisVisible}
                lieu={data}
                onClose={() => setModalNewAvisVisible(false)}
                onCancel={() => {
                  setModalNewAvisVisible(false);
                }}
              />

              <Button
                style={[themeStyles.buttonOpen]}
                textColor="white"
                mode="elevated"
                icon="pencil-plus-outline"
                buttonColor="cornflowerblue"
                onPress={handleAddAvis}
              >
                Ajouter un avis
              </Button>
            </>
          )}
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
      //backgroundColor: "cornflowerblue",
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
      margin: 20,
      height: 200,
      //width: 200,
      flex: 1,
      backgroundColor: theme === "light" ? "aliceblue" : "navy",
    },
    cardTitle: {
      color: theme === "light" ? "black" : "white",
      marginEnd: 50,
    },
  });
