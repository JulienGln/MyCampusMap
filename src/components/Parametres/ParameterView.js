import { Text, View, Platform, Appearance, StyleSheet } from "react-native";

export default function ParameterView() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>OS : {Platform.OS.toLocaleUpperCase()}</Text>
      <Text style={styles.text}>Version : {Platform.Version}</Text>
      <Text style={styles.text}>
        Thème (par défaut) : {Appearance.getColorScheme().toLocaleUpperCase()}
      </Text>
    </View>
  );
}

const colorTheme = Appearance.getColorScheme() === "light" ? "white" : "black"; // gestion du thème de l'OS pour affichage cohérent
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTheme,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colorTheme === "white" ? "black" : "white",
  },
});
