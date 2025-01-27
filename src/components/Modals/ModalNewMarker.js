import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  Alert,
  ToastAndroid,
  Image,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

// > npm install @react-native-picker/picker
import { Picker } from "@react-native-picker/picker";
import { postLieu, getLastId } from "../../helpers/request";
import { saveDataInJSON } from "../../helpers/localJSONstorage";
import { getUser } from "../../helpers/localStorage";

import { ThemeContext } from "../../themeContext";

const testJSON = require("../../../testData.json");

/**
 * Modal de création d'un marqueur
 */

/**
 * La gestion de la visibilité et la fermeture du modal est réglée dans le composant MainMap.js
 */
export default function ModalNewMarker({
  visible,
  coords,
  onClose,
  onCancel,
  createMarker,
}) {
  const [inputTextHeight, setInputTextHeight] = useState(40); // init hauteur à 40
  const [buildingTitle, setBuildingTitle] = useState("");
  const [rating, setRating] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [avis, setAvis] = useState("");
  const [imageUri, setImageUri] = useState(null); // l'URI de l'image de l'avis
  const [userName, setUserName] = useState("");

  const { theme } = useContext(ThemeContext); // récupération du thème de l'app
  const themeStyles = styles(theme); // appel de la fonction pour la feuille de style suivant le thème

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      setUserName(fetchedUser.name);
    };
    fetchUser();
  }, []);

  /**
   * Mettre à jour la hauteur en fonction du nombre de lignes de texte + ajouter l'avis
   */
  function autoGrow(text) {
    setInputTextHeight(
      text.length > 0
        ? Math.max(inputTextHeight, text.split("\n").length * 100)
        : 40 // init hauteur à 40
    );
    setAvis(text);
  }

  function handleChangeTitle(text) {
    setBuildingTitle(text);
  }

  /**
   * Gestion de la note de l'avis ( < 5 )
   */
  function handleRatingChange(note) {
    note = parseInt(note);
    note >= 0 && note <= 5 ? setRating(note.toString()) : setRating("");
  }

  async function handlePermissionGalerie() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  /**
   * Quand on appuie sur "Terminer", ajout de l'avis en base
   */
  async function handleSubmitAvis() {
    if (!avis || !buildingTitle || !rating) {
      ToastAndroid.show("Avis incomplet !", ToastAndroid.LONG);
      Alert.alert(
        "Avis incomplet",
        "Il vous manque :\n\n" +
          (!avis ? "- l'avis\n" : "") +
          (!buildingTitle ? "- le nom du lieu\n" : "") +
          (!rating ? "- la note" : "")
      );
      return;
    }
    Alert.alert(
      "Votre avis est le suivant :",
      "Nom du bâtiment : " +
        buildingTitle +
        "\nNote : " +
        rating +
        "\nType de bâtiment : " +
        buildingType +
        "\nAvis : " +
        avis +
        JSON.stringify(coords)
    );

    // dictionnaire qui associe le type d'un bâtiment à une couleur
    const markerColors = {
      Restaurant: "coral",
      Parking: "steelblue",
      batiment_scolaire: "fuchsia",
      Sante: "green",
      logement_crous: "gold",
    };
    createMarker(coords, markerColors[buildingType]); // fonction de MainMap

    var lastId = await getLastId();

    // ajoute le lieu à la base de données
    postLieu({
      id: lastId + 1,
      nom: buildingTitle,
      typeBatiment: buildingType,
      longitude: coords.longitude,
      latitude: coords.latitude,
      avis: [
        {
          lieu_id: lastId + 1,
          lieu_nom: buildingTitle,
          texte: avis,
          note: parseInt(rating),
          photo: null,
          utilisateur: userName,
        },
      ],
    });

    // sauvegarde dans un JSON de test
    saveDataInJSON({
      id: testJSON.length,
      nom: buildingTitle,
      typeBatiment: buildingType,
      longitude: coords.longitude,
      latitude: coords.latitude,
      //coordonnees: coords,
      avis: [
        {
          lieu_id: testJSON.length,
          lieu_nom: buildingTitle,
          texte: avis,
          note: parseInt(rating),
          photo: null,
          utilisateur: userName,
        },
      ],
    });

    onClose(); // fonction de MainMap
  }

  return (
    <Modal
      style={themeStyles.modalView}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView>
        <View style={themeStyles.centeredView}>
          <View style={themeStyles.modalView}>
            <Text style={themeStyles.modalText}>Nouveau marqueur</Text>
            <TextInput
              style={themeStyles.input}
              label="Nom du lieu"
              placeholderTextColor={"coral"}
              mode="outlined"
              value={buildingTitle}
              onChangeText={handleChangeTitle}
              textColor={theme === "light" ? "black" : "white"}
              activeOutlineColor={
                theme === "light" ? "cornflowerblue" : "coral"
              }
              outlineStyle={{
                backgroundColor: "transparent",
                borderColor: theme === "light" ? "cornflowerblue" : "coral",
              }}
              right={
                <TextInput.Icon
                  icon="office-building-marker"
                  color={theme === "light" ? "darkgray" : "lightgray"}
                />
              }
            />
            <TextInput
              style={themeStyles.input}
              inputMode="numeric"
              label="Note sur 5"
              placeholderTextColor={"coral"}
              onChangeText={handleRatingChange}
              value={rating}
              maxLength={1}
              mode="outlined"
              textColor={theme === "light" ? "black" : "white"}
              activeOutlineColor={
                theme === "light" ? "cornflowerblue" : "coral"
              }
              outlineStyle={{
                backgroundColor: "transparent",
                borderColor: theme === "light" ? "cornflowerblue" : "coral",
              }}
              right={
                <TextInput.Icon
                  icon="map-marker-star"
                  color={theme === "light" ? "darkgray" : "lightgray"}
                />
              }
            />
            <TextInput
              style={[themeStyles.input, { height: inputTextHeight }]}
              multiline={true}
              label="Rédiger un avis"
              placeholderTextColor={"coral"}
              onChangeText={autoGrow}
              mode="outlined"
              textColor={theme === "light" ? "black" : "white"}
              activeOutlineColor={
                theme === "light" ? "cornflowerblue" : "coral"
              }
              outlineStyle={{
                backgroundColor: "transparent",
                borderColor: theme === "light" ? "cornflowerblue" : "coral",
              }}
              right={
                <TextInput.Icon
                  icon="pencil"
                  color={theme === "light" ? "darkgray" : "lightgray"}
                />
              }
            />

            <Picker
              style={themeStyles.picker}
              selectedValue={buildingType}
              onValueChange={(itemValue, itemIndex) => {
                setBuildingType(itemValue);
              }}
              prompt="Choisissez le type de bâtiment"
              mode="dialog" // ou "dropdown"
            >
              <Picker.Item label="Restaurant" value="Restaurant" />
              <Picker.Item label="Parking" value="Parking" />
              <Picker.Item
                label="Bâtiment scolaire"
                value="batiment_scolaire"
              />
              <Picker.Item label="Santé" value="Sante" />
              <Picker.Item label="Logement CROUS" value="logement_crous" />
            </Picker>

            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                style={{ width: 200, height: 200, borderRadius: 5 }}
              />
            )}

            <Button
              style={themeStyles.buttonValidate}
              textColor="white"
              mode="elevated"
              icon="camera-image"
              buttonColor="cornflowerblue"
              onPress={handlePermissionGalerie}
            >
              Ajouter une photo
            </Button>

            {/** boutons annuler - terminer modal */}
            <View style={themeStyles.buttonGroup}>
              <Button
                style={themeStyles.buttonClose}
                textColor="white"
                mode="elevated"
                icon="close"
                buttonColor="coral"
                onPress={onCancel}
              >
                Annuler
              </Button>

              <Button
                style={themeStyles.buttonValidate}
                textColor="white"
                mode="elevated"
                icon="check"
                buttonColor="cornflowerblue"
                onPress={handleSubmitAvis}
              >
                Terminer
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
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
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 15,
      elevation: 2,
    },
    buttonValidate: {
      //backgroundColor: "cornflowerblue",
      marginTop: 10,
    },
    buttonClose: {
      //backgroundColor: "coral",
      marginTop: 10,
      marginEnd: 10,
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 5,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 20,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      color: theme === "light" ? "black" : "white",
      fontWeight: "bold",
      fontSize: 22,
    },
    input: {
      /*height: 60,
      margin: 15,
      borderWidth: 1,
      color: theme === "light" ? "black" : "white",
      borderColor: theme === "light" ? "black" : "white",
      padding: 10,
      fontSize: 20,*/
      backgroundColor: theme === "light" ? "transparent" : "black",
      width: "100%",
      marginTop: "5%",
    },
    picker: {
      height: 50,
      width: 200,
      borderWidth: 1,
      backgroundColor: theme === "light" ? "lightgrey" : "darkgrey",
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 10,
    },
  });
