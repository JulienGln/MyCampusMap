import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  Text,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";

// > npm install @react-native-picker/picker
import { Picker } from "@react-native-picker/picker";

/**
 * Modal de création d'un marqueur
 */

/**
 * La gestion de la visibilité et la fermeture du modal est réglée dans le composant MainMap.js
 */
export default function ModalNewMarker({ visible, coords, onClose }) {
  const [inputTextHeight, setInputTextHeight] = useState(40); // init hauteur à 40
  const [buildingTitle, setBuildingTitle] = useState("");
  const [rating, setRating] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [avis, setAvis] = useState("");
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

  /**
   * Quand on appuie sur "Terminer", ajout de l'avis en base
   */
  function handleSubmitAvis() {
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
  }

  return (
    <Modal
      style={styles.modalView}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nouveau marqueur</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du lieu"
              placeholderTextColor={"coral"}
              value={buildingTitle}
              onChangeText={handleChangeTitle}
            />
            <TextInput
              style={styles.input}
              inputMode="numeric"
              placeholder="Note sur 5"
              placeholderTextColor={"coral"}
              onChangeText={handleRatingChange}
              value={rating}
              maxLength={1}
            />
            <TextInput
              style={[styles.input, { height: inputTextHeight }]}
              multiline={true}
              placeholder="Rédiger un avis"
              placeholderTextColor={"coral"}
              onChangeText={autoGrow}
            />

            <Picker
              style={styles.picker}
              selectedValue={buildingType}
              onValueChange={(itemValue, itemIndex) => {
                setBuildingType(itemValue);
              }}
              prompt="Choisissez le type de bâtiment"
              mode="dialog" // ou "dropdown"
            >
              <Picker.Item label="Restaurant" value="restaurant" />
              <Picker.Item label="Parking" value="parking" />
              <Picker.Item
                label="Bâtiment générique (template C++)"
                value="batiment_generique"
              />
            </Picker>

            <Text style={{ fontWeight: "bold" }}>
              Manque l'ajout d'une photo
            </Text>

            {/** boutons annuler - terminer modal */}
            <View style={styles.buttonGroup}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={onClose}
              >
                <Text style={styles.textStyle}>Annuler</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonValidate]}
                onPress={handleSubmitAvis}
              >
                <Text style={styles.textStyle}>Terminer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: "cornflowerblue",
    marginStart: 20,
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
    fontWeight: "bold",
    fontSize: 22,
  },
  input: {
    height: 60,
    margin: 15,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
  },
  picker: {
    height: 50,
    width: 200,
    borderWidth: 1,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
