import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  Text,
  TextInput,
} from "react-native";
/**
 * Modal de création d'un marqueur
 */

/**
 * La gestion de la visibilité et la fermeture du modal est réglée dans le composant MainMap.js
 */
export default function ModalNewMarker({ visible, onClose }) {
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
            maxLength={1}
          />
          <TextInput
            style={styles.input}
            multiline={true}
            placeholder="Rédiger un avis"
            placeholderTextColor={"coral"}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Terminer</Text>
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
    shadowOpacity: 0.5,
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
    backgroundColor: "coral", // "cornflowerblue"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
