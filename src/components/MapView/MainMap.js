import React, { useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps"; // > npm install react-native-maps
// doc : https://github.com/react-native-maps/react-native-maps/tree/master#component-api
import { StyleSheet, View, Alert, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
//import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions"; // > npm install react-native-permissions

export default function MainMap() {
  const [markers, setMarkers] = useState([]); // tableau de Markers
  const mapRef = useRef(null); // référence à la carte

  const initialRegion = {
    latitude: 45.6417615,
    longitude: 5.8698961,
    latitudeDelta: 0.005, // Plus c'est proche de 0, plus c'est zoomé
    longitudeDelta: 0.005, // Plus c'est proche de 0, plus c'est zoomé
  };

  /**
   * Appelée lors d'un appui sur la carte
   */
  function handlePress(event) {
    Alert.alert(
      "Fonctionnalité", // Titre de l'alerte
      "Un appui long réinitialisera le zoom et la position par défaut.", // Message de l'alerte
      [{ text: "OK" }],
      { cancelable: true } // L'alerte peut être annulée en cliquant en dehors de la boîte de dialogue
    );

    setMarkers([...markers, { coordinate: event.nativeEvent.coordinate }]);
  }

  function removeAllMarkers() {
    setMarkers([]);
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handlePress}
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
});

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
