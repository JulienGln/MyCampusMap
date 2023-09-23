import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

/**** import des composants : */
import NavBar from "./src/components/NavBar/NavBar";

// lancer l'app :
// > npx expo login
// > npx expo start
// (en local) : > npx expo start --localhost --android
// documentation : https://docs.expo.dev/

export default function App() {
  return (
    <NavigationContainer>
      <NavBar />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
