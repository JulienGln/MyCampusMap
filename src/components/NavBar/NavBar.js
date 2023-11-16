// npm install @react-navigation/bottom-tabs
// npm install @react-navigation/native
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // doc : https://reactnavigation.org/docs/tab-based-navigation/
import { useNavigation } from "@react-navigation/native";
import MainMap from "../MapView/MainMap";
import ParameterView from "../Parametres/ParameterView";
// https://icons.expo.fyi/Index pour choix des icones
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

import { Text, Image, Pressable } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../themeContext";

const Tab = createBottomTabNavigator();

/* Pour le focus sur l'icone
options={({ route }) => ({
          tabBarLabel: ({ focused }) =>
            focused ? <Text>Paramètres</Text> : <Text></Text>,
        })}
      */

// polices par défaut : https://infinitbility.com/react-native-font-family-list/#supported-fonts-for-android-with-a-code-example

export default function NavBar() {
  const { theme } = useContext(ThemeContext); // récupération du thème de l'app
  const navigation = useNavigation(); // Ajout de useNavigation

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme === "light" ? "cornflowerblue" : "coral", // cornflowerblue ou tomato
        tabBarInactiveTintColor: theme === "light" ? "darkgray" : "lightgray", //gray
        headerStyle: {
          backgroundColor: theme === "light" ? "aliceblue" : "navy",
        },
        headerTintColor: theme === "light" ? "black" : "white",
        tabBarActiveBackgroundColor: theme === "light" ? "aliceblue" : "navy",
        tabBarInactiveBackgroundColor: theme === "light" ? "aliceblue" : "navy",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 28,
          fontFamily: "sans-serif-light",
          color: theme === "light" ? "cornflowerblue" : "coral",
        },
      }}
    >
      <Tab.Screen
        name="Cartographie"
        component={MainMap}
        options={{
          tabBarLabel: "Carte",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marker-alt" size={size} color={color} />
          ),
          headerLeft: () => (
            <Image
              style={{ width: 60, height: 60, borderRadius: 100 }}
              source={require("../../assets/mycampusmap_logoV2_no_background.png")}
            />
          ),
        }}
      />
      {/*<Tab.Screen
        name="Accueil"
        component={MainMap}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
          headerLeft: () => (
              <Image
                style={{ width: 60, height: 60, borderRadius: 100 }}
                source={require("../../assets/mycampusmap_logoV2_no_background.png")}
              />
          ),
        }}
      />*/}
      <Tab.Screen
        name="Paramètres"
        component={ParameterView}
        options={{
          tabBarLabel: "Paramètres" /*({ focused }) =>
            focused ? (
              <Text
                style={{
                  color: theme === "light" ? "cornflowerblue" : "coral",
                  fontSize: 11,
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Paramètres
              </Text>
            ) : (
              ""
            ),*/,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="settings-sharp"
              size={size}
              color={color}
              /*style={
                focused
                  ? {
                      backgroundColor:
                        theme === "light" ? "cornflowerblue" : "coral",
                      paddingEnd: 15,
                      paddingStart: 15,
                      color: "aliceblue",
                      borderRadius: 50,
                    }
                  : {}
              }*/
            />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => {
                navigation.navigate("Cartographie"); // Redirection vers l'onglet "Cartographie"
              }}
            >
              <Image
                style={{ width: 60, height: 60, borderRadius: 100 }}
                source={require("../../assets/mycampusmap_logoV2_no_background.png")}
              />
            </Pressable>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
