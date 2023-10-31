// npm install @react-navigation/bottom-tabs
// npm install @react-navigation/native
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // doc : https://reactnavigation.org/docs/tab-based-navigation/
import MainMap from "../MapView/MainMap";
import ParameterView from "../Parametres/ParameterView";
// https://icons.expo.fyi/Index pour choix des icones
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

import { Text } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../themeContext";

const Tab = createBottomTabNavigator();

/* Pour le focus sur l'icone
options={({ route }) => ({
          tabBarLabel: ({ focused }) =>
            focused ? <Text>Paramètres</Text> : <Text></Text>,
        })}
      */

export default function NavBar() {
  const { theme } = useContext(ThemeContext); // récupération du thème de l'app

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
        }}
      />
      <Tab.Screen
        name="Accueil"
        component={MainMap}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Paramètres"
        component={ParameterView}
        options={{
          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text style={{ color: theme === "light" ? "black" : "white" }}>
                Paramètres
              </Text>
            ) : (
              ""
            ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
