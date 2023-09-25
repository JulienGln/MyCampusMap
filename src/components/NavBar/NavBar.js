// npm install @react-navigation/bottom-tabs
// npm install @react-navigation/native
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainMap from "../MapView/MainMap";
import ParameterView from "../Parametres/ParameterView";

const Tab = createBottomTabNavigator();

export default function NavBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Carte"
        component={MainMap}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => (focused ? "Carte" : ""),
        })}
      />
      <Tab.Screen
        name="Accueil"
        component={MainMap}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => (focused ? "Accueil" : ""),
        })}
      />
      <Tab.Screen
        name="Paramètres"
        component={ParameterView}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => (focused ? "Paramètres" : ""),
        })}
      />
    </Tab.Navigator>
  );
}
