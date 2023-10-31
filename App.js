import { StyleSheet, Appearance } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";

/**** import des composants : */
import NavBar from "./src/components/NavBar/NavBar";
import { ThemeContext } from "./src/themeContext";
import { getAppTheme } from "./src/helpers/localStorage";

// lancer l'app :
// > npx expo login
// > npx expo start
// (en local) : > npx expo start --localhost --android
// (avec tunnel (Wi-Fi)) : > npx expo start --tunnel
// documentation : https://docs.expo.dev/

// caméra  : https://docs.expo.dev/versions/latest/sdk/camera/
// couleurs : https://reactnative.dev/docs/colors#color-keywords

export default function App() {
  const [theme, setTheme] = useState(Appearance.getColorScheme().toString()); // mode sombre ou light de l'OS

  useEffect(() => {
    const fetchTheme = async () => {
      const fetchedTheme = await getAppTheme();
      setTheme(fetchedTheme);
    };

    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <NavigationContainer>
        <NavBar />
      </NavigationContainer>
    </ThemeContext.Provider>
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
