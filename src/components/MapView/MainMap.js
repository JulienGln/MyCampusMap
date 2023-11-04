import React, { useRef, useState, useEffect, useContext } from "react";
import MapView, { Marker, Polygon } from "react-native-maps"; // > npm install react-native-maps
// doc : https://github.com/react-native-maps/react-native-maps/tree/master#component-api
// customiser le style sa map : https://mapstyle.withgoogle.com/
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  ToastAndroid,
  Appearance,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
  Pressable,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import ModalNewMarker from "../Modals/ModalNewMarker";
import ModalDefault from "../Modals/ModalDefault";

import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
//import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions"; // > npm install react-native-permissions

import { ThemeContext } from "../../themeContext";

const testJSON = require("../../../testData.json");

export default function MainMap() {
  const [markers, setMarkers] = useState([]); // tableau de Markers
  const mapRef = useRef(null); // référence à la carte
  const [modalNewMarkerVisible, setModalNewMarkerVisible] = useState(false); // modal de création d'un avis
  const [modalMarkerVisible, setModalMarkerVisible] = useState(false); // modal de vue des avis et du batiment
  const [markerCoords, setMarkerCoords] = useState({}); // les coordonnées du dernier marqueur créé
  const [markerColor, setMarkerColor] = useState("green");
  const [data, setData] = useState(testJSON);
  const [currentIdMarker, setCurrentIdMarker] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [commune, setCommune] = useState(null);
  const { theme } = useContext(ThemeContext); // récupération du thème de l'app

  const initialRegion = {
    latitude: 45.6417615,
    longitude: 5.8698961,
    latitudeDelta: 0.004, // Plus c'est proche de 0, plus c'est zoomé
    longitudeDelta: 0.004, // Plus c'est proche de 0, plus c'est zoomé
  };

  /**
   * Appelée lors d'un appui long sur la carte
   */
  function handleMapPress(event) {
    ToastAndroid.show(
      "Un appui long ajoutera un point sur la carte.",
      ToastAndroid.LONG
    );

    setMarkerCoords(event.nativeEvent.coordinate); // mettre un appel à fct async + await qui set les coords si le modal s'ouvre trop vite
    setModalNewMarkerVisible(true);
    // ajout du marqueur à la fin du tableau de marqueurs
    //setMarkers([...markers, { coordinate: event.nativeEvent.coordinate }]);
  }

  /**
   * fonction qui ajoute un marqueur au tableau des marqueurs si on appuie sur "Terminer" dans le modal
   */
  function createMarker(coords, color) {
    setMarkerColor(color); // en fonction du type de bâtiment, le marqueur change de couleur
    setMarkers([
      ...markers,
      { coordinate: coords, description: markers.length.toString() },
    ]);
  }
  /**
   * Appelée lors d'un appui sur un marqueur
   */
  function handleMarkerPress() {}

  function handleGetData() {
    setData(testJSON);

    //Alert.alert("test (" + data.length + ")", JSON.stringify(data));

    const markerColors = {
      Restaurant: "coral",
      Parking: "steelblue",
      batiment_scolaire: "fuchsia",
      Sante: "green",
      logement_crous: "gold",
    };

    const newMarkers = data.map((lieu, index) => ({
      coordinate: {
        latitude: parseFloat(lieu.coordonnees.latitude),
        longitude: parseFloat(lieu.coordonnees.longitude),
      },
      pinColor: markerColors[lieu.type],
      description: index.toString(), // la description est l'index du lieu dans le tableau qui est dans le JSON
    }));

    setMarkers(newMarkers);
  }

  function removeAllMarkers() {
    setMarkers([]);
  }

  function clickHandler() {
    //function to handle click on floating Action Button
    ToastAndroid.show("Retour sur le campus !", ToastAndroid.SHORT);
    mapRef.current.animateToRegion(initialRegion, 2000);
    removeAllMarkers();
  }

  useEffect(() => {
    handleGetData();
    fetch(
      `https://api.open-meteo.com/v1/meteofrance?latitude=${initialRegion.latitude}&longitude=${initialRegion.longitude}&current_weather=true`
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data.current_weather));
    fetch(
      `https://geo.api.gouv.fr/communes?lat=${initialRegion.latitude}&lon=${initialRegion.longitude}`
    )
      .then((response) => response.json())
      .then((data) => setCommune(data[0]));
  }, []);

  return (
    <View style={styles.container}>
      <ModalNewMarker
        visible={modalNewMarkerVisible}
        coords={markerCoords}
        onClose={() => setModalNewMarkerVisible(false)}
        onCancel={() => {
          // si on appuie sur le bouton "Annuler" du modal
          setModalNewMarkerVisible(false);
          //markers.pop(); // on enlève le dernier marqueur ajouté
        }}
        createMarker={createMarker}
      />

      {
        <ModalDefault
          visible={modalMarkerVisible}
          markerId={currentIdMarker}
          onClose={() => setModalMarkerVisible(false)}
        />
      }

      {/* <Button title="text" style={styles.button} onPress={clickHandler}>
        <FontAwesome5 name="crosshairs" size={24} color={"white"} />
      </Button> */}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={theme === "light" ? mapStyle : nightMapStyle}
        //minZoomLevel={17}
        onLongPress={handleMapPress} // Un appui long ajoutera un point sur la carte.
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            pinColor={marker.pinColor ? marker.pinColor : markerColor}
            draggable
            tappable
            description={index.toString()}
            onPress={() => {
              setCurrentIdMarker(parseInt(index));
              setModalMarkerVisible(true);
              /*Alert.alert(
                "Point " + (index + 1),
                "Coordonnées : \n\n- Latitude : " +
                  marker.coordinate.latitude +
                  "\n- Longitude : " +
                  marker.coordinate.longitude +
                  "\n\n(à mettre dans un component modal pour afficher avis etc.)\nIndex dans JSON : " +
                  marker.description,
                [{ text: "OK" }],
                { cancelable: true } // L'alerte peut être annulée en cliquant en dehors de la boîte de dialogue
              );*/
            }}
            coordinate={marker.coordinate}
          />
        ))}
      </MapView>

      {/* encart météo */}
      {weatherData && (
        <View
          style={{
            textAlign: "center",
            alignItems: "center",
            //backgroundColor: theme === "light" ? "white" : "black",
            position: "absolute", // centrer en haut, (top, left et right)
            top: 0,
            left: 0,
            right: 0,
            borderRadius: 30,
            marginTop: 10,
            marginLeft: 30,
            marginRight: 30,
            opacity: 0.4,
          }}
          onTouchStart={() => {
            ToastAndroid.show(
              "Météo générée à l'aide de l'API Open-Meteo.com",
              ToastAndroid.SHORT
            );
          }}
        >
          {/*<Text>Météo : {JSON.stringify(weatherData)}</Text>*/}
          <Text
            style={{
              color: theme === "light" ? "black" : "white",
              fontWeight: "bold",
            }}
          >
            <Feather
              name={weatherData.is_day ? "sun" : "moon"}
              size={24}
              color={theme === "light" ? "black" : "white"}
            />
            <Text>{weatherData.is_day ? " Jour" : " Nuit"}</Text>
          </Text>
          {commune && (
            <Text
              style={{
                color: theme === "light" ? "black" : "white",
                fontWeight: "bold",
              }}
            >
              <Feather
                name="map-pin"
                size={22}
                color={theme === "light" ? "black" : "white"}
              />{" "}
              {commune.nom + ` (${commune.codesPostaux[0]})`}
            </Text>
          )}
          <Text
            style={{
              color: theme === "light" ? "black" : "white",
              fontWeight: "bold",
            }}
          >
            <Feather
              name="calendar"
              size={24}
              color={theme === "light" ? "black" : "white"}
            />
            {"  "}
            {new Date(weatherData.time).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text
            style={{
              color: theme === "light" ? "black" : "white",
              fontWeight: "bold",
            }}
          >
            <FontAwesome5
              name="temperature-high"
              size={24}
              color={theme === "light" ? "black" : "white"}
            />
            {"  "}
            {weatherData.temperature} °C
          </Text>
          <Text
            style={{
              color: theme === "light" ? "black" : "white",
              fontWeight: "bold",
            }}
          >
            <FontAwesome5
              name="wind"
              size={24}
              color={theme === "light" ? "black" : "white"}
            />
            {"  "}
            {weatherData.windspeed} km/h ({weatherData.winddirection}
            °)
          </Text>
        </View>
      )}

      {/* bouton pour recentrer */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={clickHandler}
      >
        {/*<FontAwesome5
          name="map-marked-alt"
          size={32}
          color={"cornflowerblue"}
          />*/}
        <Image
          source={require("../../assets/relocalisation.png")}
          style={{
            width: 55,
            height: 55,
            borderRadius: 500,
            borderWidth: 1,
            borderColor: theme === "light" ? "black" : "lightgray",
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: theme === "light" ? "white" : "navy",
            padding: 30,
            marginTop: -11,
          }}
        />
      </TouchableOpacity>

      <StatusBar style={theme === "light" ? "dark" : "light"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    //flex: 1,
    width: "100%",
    height: "100%",
    //position: "absolute",
    //top: 0,
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
    position: "absolute",
    bottom: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "white", //"#bbbbbb",
    padding: 10,
    borderRadius: 50,
    borderColor: "black",
    borderWidth: 1,
    width: 60,
    height: 60,

    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5,

    marginBottom: Dimensions.get("window").height * 0.02, // pourcentage de la hauteur de l'écran
    marginRight: Dimensions.get("window").width * 0.05, // pourcentage de la largeur de l'écran
    //position: "flex",
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
    featureType: "poi", // point of interest
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
        visibility: "off", // on masque les icônes fournies par Maps par défaut
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

const nightMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8ec3b9",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1a3646",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#64779e",
      },
    ],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 100,
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
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#283d6a",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels",
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
        color: "#6f9ba5",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3C7680",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#304a7d",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#2c6675",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#255763",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#b0d5ce",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#283d6a",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#3a4762",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#0e1626",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#4e6d70",
      },
    ],
  },
];

/*
<Polygon
          coordinates={[
            { latitude: 45.63933261, longitude: 5.8757640793 },
            { latitude: 45.6448980714, longitude: 5.875166617 },
            { latitude: 45.647111397, longitude: 5.8722651377 },
            { latitude: 45.646742476, longitude: 5.8659518882 },
            { latitude: 45.646063459, longitude: 5.8645899966 },
            { latitude: 45.642945077, longitude: 5.8641957119 },
            { latitude: 45.640666187, longitude: 5.8656276762 },
            { latitude: 45.63956726, longitude: 5.8705257251 },
          ]}
          strokeColor="#000" // Le contour du polygone
          fillColor="rgba(255,0,255,0.1)" // La couleur de remplissage du polygone
          strokeWidth={1}
          tappable={true}
          onPress={() => {
            Alert.alert("Campus", "Cette zone délimite le campus de l'USMB");
          }}
        />
*/

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
