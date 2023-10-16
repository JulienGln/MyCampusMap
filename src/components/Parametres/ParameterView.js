import { useState, useEffect } from "react";
import {
  Text,
  View,
  Platform,
  Appearance,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
} from "react-native";

export default function ParameterView() {
  const [isSwitchThemeEnabled, setSwitchThemeEnabled] = useState(false);
  const [theme, setTheme] = useState(Appearance.getColorScheme().toString()); // thème par défaut de l'OS

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? "white" : "black", // gestion du thème de l'OS pour affichage cohérent
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: {
      flex: 1,
    },
    text: {
      color: theme === "light" ? "black" : "white",
    },
  });

  async function communicationServer() {
    // doc : https://reactnative.dev/docs/network
    //var url = "http://192.168.1.23:3000/data"; // adresse IP de l'ordinateur qui fait tourner le serveur
    // var url = "https://jsonplaceholder.typicode.com/posts"; // https://raw.githubusercontent.com/JulienGln/juliengln.github.io/main/data/data.json
    var url = "https://juliengln.github.io/data/krooteQuiz.json";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Erreur HTTP", response.status);
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Erreur fonction fetch", error);
    }
  }

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await communicationServer();
      setData(result);
    };

    fetchData();
  }, []);

  function toggleTheme() {
    setSwitchThemeEnabled(!isSwitchThemeEnabled);
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>OS : {Platform.OS.toLocaleUpperCase()}</Text>
      <Text style={styles.text}>Version : {Platform.Version}</Text>
      <Text style={styles.text}>
        Thème (par défaut) : {theme.toLocaleUpperCase()}
        {"\n"}
        <Switch
          style={{ alignItems: "center", justifyContent: "center" }}
          onValueChange={toggleTheme}
          value={isSwitchThemeEnabled}
        ></Switch>
      </Text>
      <ScrollView style={styles.scrollView}>
        {data ? (
          <Text style={styles.text}> JSON : {JSON.stringify(data)}</Text>
        ) : (
          <Text style={styles.text}>
            JSON :
            <ActivityIndicator size="large" />
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

/** 
Pour appliquer le choix du mode sombre aux autres composants dans React Native, vous pouvez utiliser le `Context` de React. Le `Context` fournit un moyen de passer des données à travers l'arborescence du composant sans avoir à passer les props manuellement à chaque niveau.

Voici un exemple de la façon dont vous pouvez le faire :

1. Créez un `DarkModeContext` :

```jsx
import React from 'react';

export const DarkModeContext = React.createContext();
```

2. Utilisez ce contexte dans votre composant principal (généralement `App.js`) pour stocker l'état du mode sombre :

```jsx
import { DarkModeContext } from './DarkModeContext';

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {Vos autres composants vont ici }
      </DarkModeContext.Provider>
      );
    }
    
    export default App;
    ```
    
    3. Ensuite, dans votre `ParameterView.js`, vous pouvez utiliser `setDarkMode` pour changer l'état lorsque l'utilisateur bascule le switch :
    
    ```jsx
    import { DarkModeContext } from './DarkModeContext';
    
    function ParameterView() {
      const { setDarkMode } = React.useContext(DarkModeContext);
    
      const handleSwitchChange = (value) => {
        setDarkMode(value);
      };
    
      return (
        <Switch onValueChange={handleSwitchChange} />
      );
    }
    
    export default ParameterView;
    ```
    
    4. Enfin, dans n'importe quel autre composant où vous voulez utiliser le mode sombre, vous pouvez accéder à `darkMode` à partir du contexte et l'utiliser pour déterminer vos styles :
    
    ```jsx
    import { DarkModeContext } from './DarkModeContext';
    
    function SomeOtherComponent() {
      const { darkMode } = React.useContext(DarkModeContext);
    
      const textStyle = darkMode ? styles.darkText : styles.lightText;
    
      return (
        <Text style={textStyle}>Hello, world!</Text>
      );
    }
    
    const styles = StyleSheet.create({
      lightText: {
        color: 'black',
      },
      darkText: {
        color: 'white',
      },
    });
    
    export default SomeOtherComponent;
    ```
    
    Dans cet exemple, `SomeOtherComponent` utilise la valeur de `darkMode` pour déterminer sa couleur de texte. Vous pouvez adapter ce code à vos besoins spécifiques. J'espère que cela vous aide ! N'hésitez pas si vous avez d'autres questions.
*/
