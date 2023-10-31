/**
 * Fichier pour accéder au stockage local du téléphone (préférences partagées)
 * stockage clé => valeur
 */

// > npm install @react-native-async-storage/async-storage
// doc : https://react-native-async-storage.github.io/async-storage/docs/usage

import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_APP_THEME = "@AppTheme";
const KEY_APP_USER = "@User";

/**
 *
 * @returns {String} - le thème de l'app (dark ou white)
 */
export async function getAppTheme() {
  try {
    const theme = await AsyncStorage.getItem(KEY_APP_THEME);
    return theme === null ? Appearance.getColorScheme().toString() : theme;
  } catch (error) {
    console.error(error);
  }
  // au cas où
  return Appearance.getColorScheme().toString();
}

/**
 *
 * @param {String} theme : dark ou light
 */
export async function setAppTheme(theme) {
  try {
    await AsyncStorage.setItem(KEY_APP_THEME, theme); // KEY_APP_THEME est une clé unique qui stocke le thème de l'app
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @returns {JSON} - le JSON correspondant à l'utilisateur
 */
export async function getUser() {
  try {
    const jsonUser = await AsyncStorage.getItem(KEY_APP_USER);
    return jsonUser != null ? JSON.parse(jsonUser) : null;
  } catch (error) {
    console.error(error);
  }
  // au cas où
  return null;
}

/**
 *
 * @param {JSON} user
 * @returns
 */
export async function setUser(user) {
  try {
    const jsonUser = JSON.stringify(user);
    await AsyncStorage.setItem(KEY_APP_USER, jsonUser);
  } catch (error) {
    console.error(error);
  }
}
