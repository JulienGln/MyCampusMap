import { StyleSheet, Appearance } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

/**** import des composants : */
import NavBar from "./src/components/NavBar/NavBar";

// lancer l'app :
// > npx expo login
// > npx expo start
// (en local) : > npx expo start --localhost --android
// documentation : https://docs.expo.dev/

// caméra  : https://docs.expo.dev/versions/latest/sdk/camera/

export default function App() {
  const colorScheme = Appearance.getColorScheme(); // mode sombre ou light de l'OS
  // theme={{ dark: colorScheme === "dark" }}
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
