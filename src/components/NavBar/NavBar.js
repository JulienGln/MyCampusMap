// npm install @react-navigation/bottom-tabs
// npm install @react-navigation/native
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainMap from "../MapView/MainMap";
import ParameterView from "../Parametres/ParameterView";
import { Text } from "react-native";

const Tab = createBottomTabNavigator();

export default function NavBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Carte" component={MainMap} />
      <Tab.Screen name="Accueil" component={MainMap} />
      <Tab.Screen
        name="Paramètres"
        component={ParameterView}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) =>
            focused ? <Text>Paramètres</Text> : <Text></Text>,
        })}
      />
    </Tab.Navigator>
  );
}
