import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import React, { useState } from "react";
/**
 * Modal de création d'un marqueur
 */

/**
 * La gestion de la visibilité et la fermeture du modal est réglée dans le composant MainMap.js
 */
export default function ModalNewMarker({ visible, onClose }) {
  const [inputTextHeight, setInputTextHeight] = React.useState(40); // init hauteur à 40
  const [rating, setRating] = React.useState("");

  /**
   * Mettre à jour la hauteur en fonction du nombre de lignes de texte
   */
  function autoGrow(text) {
    setInputTextHeight(
      Math.max(inputTextHeight, text.split("\n").length * 100)
    );
  }

  /**
   * Gestion de la note de l'avis ( < 5 )
   */
  function handleRatingChange(note) {
    note = parseInt(note);
    note >= 0 && note <= 5 ? setRating(note.toString()) : setRating("");
  }

  return (
    <Modal
      style={styles.modalView}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Nouveau marqueur</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom du lieu"
            placeholderTextColor={"coral"}
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
          <Text style={{ fontWeight: "bold" }}>
            Pour le type de batiment : {">"} npm install
            @react-native-picker/picker
          </Text>

          {/** boutons annuler - terminer modal */}
          <View style={styles.buttonGroup}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Annuler</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.buttonValidate]}>
              <Text style={styles.textStyle}>Terminer</Text>
            </Pressable>
          </View>
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
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonValidate: {
    backgroundColor: "cornflowerblue",
  },
  buttonClose: {
    backgroundColor: "coral",
    marginRight: 10,
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
