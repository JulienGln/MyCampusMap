import React, { useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps"; // > npm install react-native-maps
// doc : https://github.com/react-native-maps/react-native-maps/tree/master#component-api
// customiser le style sa map : https://mapstyle.withgoogle.com/
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Text,
  ToastAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
//import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions"; // > npm install react-native-permissions

export default function MainMap() {
  const [markers, setMarkers] = useState([]); // tableau de Markers
  const mapRef = useRef(null); // référence à la carte
  const [modalVisible, setModalVisible] = useState(false); // modal de vue des avis et du batiment

  const initialRegion = {
    latitude: 45.6417615,
    longitude: 5.8698961,
    latitudeDelta: 0.005, // Plus c'est proche de 0, plus c'est zoomé
    longitudeDelta: 0.005, // Plus c'est proche de 0, plus c'est zoomé
  };

  /**
   * Appelée lors d'un appui sur la carte
   */
  function handleMapPress(event) {
    ToastAndroid.show(
      "Un appui long réinitialisera le zoom, la position par défaut et les marqueurs.",
      ToastAndroid.LONG
    );
    /*Alert.alert(
      "Fonctionnalité", // Titre de l'alerte
      "Un appui long réinitialisera le zoom, la position par défaut et les marqueurs.", // Message de l'alerte
      [{ text: "OK" }],
      { cancelable: true } // L'alerte peut être annulée en cliquant en dehors de la boîte de dialogue
    );*/

    setMarkers([...markers, { coordinate: event.nativeEvent.coordinate }]);
  }

  function removeAllMarkers() {
    setMarkers([]);
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      ></Modal>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        onPress={handleMapPress}
        onLongPress={() => {
          mapRef.current.animateToRegion(initialRegion, 2000);
          removeAllMarkers();
        }} // Un appui long réinitialisera le zoom et la position par défaut.
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            pinColor="green"
            draggable
            tappable
            description={"à faire" + index}
            onPress={() => {
              Alert.alert(
                "Point " + (index + 1),
                "Coordonnées : \n\n- Latitude : " +
                  marker.coordinate.latitude +
                  "\n- Longitude : " +
                  marker.coordinate.longitude +
                  "\n\n(à mettre dans un component modal pour afficher avis etc.)",
                [{ text: "OK" }],
                { cancelable: true }
              );
            }}
            coordinate={marker.coordinate}
          />
        ))}
      </MapView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
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
});

// JSON obtenu en modifiant le style de la map sur le site : https://mapstyle.withgoogle.com/
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [
      {
        weight: 8,
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: -100,
      },
      {
        weight: 8,
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c",
      },
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a5b076",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b9d3c2",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];

/*const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            "This feature is not available (on this device / in this context)"
          );
          break;
        case RESULTS.DENIED:
          console.log(
            "The permission has not been requested / is denied but requestable"
          );
          break;
        case RESULTS.GRANTED:
          console.log("The permission is granted");
          setIsPermissionGranted(true);
          break;
        case RESULTS.BLOCKED:
          console.log("The permission is denied and not requestable anymore");
          break;
      }
    })
    .catch((error) => {
      // …
    });*/
