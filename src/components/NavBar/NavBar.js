// npm install @react-navigation/bottom-tabs
// npm install @react-navigation/native
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainMap from "../MapView/MainMap";
import ParameterView from "../Parametres/ParameterView";

const Tab = createBottomTabNavigator();

export default function NavBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Carte" component={MainMap} />
      <Tab.Screen name="Accueil" component={MainMap} />
      <Tab.Screen name="Paramètres" component={ParameterView} />
    </Tab.Navigator>
  );
}
