/**
 * Modal pour ajouter un nouvel avis sur un lieu
 */

import {
  Modal,
  StyleSheet,
  View,
  Alert,
  ToastAndroid,
  Pressable,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { TextInput, Button, Text, HelperText, Icon } from "react-native-paper";

import { ThemeContext } from "../../themeContext";
import { getUser } from "../../helpers/localStorage";
import { postNewAvis } from "../../helpers/request";

const testJSON = require("../../../testData.json");

export default function ModalNewAvis({ visible, lieu, onClose }) {
  const [rating, setRating] = useState("");
  const [ratingError, setRatingError] = useState(false);
  const [avis, setAvis] = useState("");
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
   * Gestion de la note de l'avis ( < 5 )
   */
  function handleRatingChange(note) {
    note = parseInt(note);
    if (note >= 0 && note <= 5) {
      setRating(note.toString());
      setRatingError(false);
    } else {
      setRating("");
      setRatingError(true);
    }
  }

  function handleChangeAvis(text) {
    setAvis(text);
  }

  function handleSubmitAvis() {
    if (!avis || !rating) {
      ToastAndroid.show("Avis incomplet !", ToastAndroid.LONG);
      Alert.alert(
        "Avis incomplet",
        "Il vous manque :\n\n" +
          (!avis ? "- l'avis\n" : "") +
          (!rating ? "- la note" : "")
      );
      return;
    }
    const request = {
      lieu_id: lieu.id,
      lieu_nom: lieu.nom,
      texte: avis,
      note: parseInt(rating),
      photo: null,
      utilisateur: userName,
    };
    /*
    fetch("http://localhost:3000/nouvel-avis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });*/
    postNewAvis(request);
    // provisoirement, on sauvegarde dans le JSON en attente d'un serveur fonctionnel
    // testJSON[lieu.id].avis.push(request);
    ToastAndroid.show("Avis ajouté avec succès", ToastAndroid.SHORT);
    onClose();
  }

  function handlePermissionGalerie() {}

  return (
    <Modal
      style={themeStyles.modalView}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={themeStyles.centeredView}>
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
          <Text style={themeStyles.modalText} variant="displayLarge">
            {lieu.nom} : nouvel avis
          </Text>
          <TextInput
            label={"Rédiger votre avis"}
            multiline={true}
            onChangeText={handleChangeAvis}
            mode="outlined"
            textColor={theme === "light" ? "black" : "white"}
            activeOutlineColor={theme === "light" ? "cornflowerblue" : "coral"}
            outlineStyle={{
              backgroundColor: "transparent",
              borderColor: theme === "light" ? "cornflowerblue" : "coral",
            }}
            style={{
              backgroundColor: theme === "light" ? "transparent" : "black",
              width: "100%",
              marginTop: "5%",
            }}
            right={
              <TextInput.Icon
                icon="pencil"
                color={theme === "light" ? "darkgray" : "lightgray"}
              />
            }
          />
          <TextInput
            inputMode="numeric"
            mode="outlined"
            label="Note sur 5"
            onChangeText={handleRatingChange}
            value={rating}
            maxLength={1}
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
            right={
              <TextInput.Icon
                icon="map-marker-star"
                color={theme === "light" ? "darkgray" : "lightgray"}
              />
            }
            error={ratingError}
          />
          <HelperText type="error" visible={ratingError}>
            La note doit être comprise entre 0 et 5
          </HelperText>
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
          <Button
            style={themeStyles.buttonValidate}
            textColor="white"
            mode="elevated"
            icon="check"
            buttonColor="cornflowerblue"
            onPress={handleSubmitAvis}
          >
            Valider
          </Button>
        </View>
      </View>
    </Modal>
  );
}

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
      backgroundColor: "coral",
      marginEnd: 20,
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
      height: 60,
      margin: 15,
      borderWidth: 1,
      color: theme === "light" ? "black" : "white",
      borderColor: theme === "light" ? "black" : "white",
      padding: 10,
      fontSize: 20,
    },
  });
