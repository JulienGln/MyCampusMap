const testJSON = require("../../testData.json");

/**
 * Sauvegarde les données dans le JSON de test testData.json
 * @param {JSON} info - les données à sauvegarder
 */
export function saveDataInJSON(info) {
  testJSON.push(info);
  // Lire le fichier JSON existant
  /*let infoJSON = JSON.stringify(info);

  // Écrire dans le fichier
  fs.writeFile("../../testData.json", infoJSON, "utf8", function (err) {
    if (err) throw err;
    console.log("Les données ont été ajoutées au fichier JSON existant !");
  });*/
  /*fs.readFile("monFichier.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      // Convertir la chaîne en objet JSON
      let obj = JSON.parse(data);

      // Ajouter de nouvelles données
      obj.push({
        nom: "Cafetaria",
        type: "Restaurant",
        coordonnees: {
          longitude: 5.8681425824761,
          latitude: 45.642587381216,
        },
        avis: [
          {
            test: "miam",
          },
        ],
      });

      // Convertir l'objet JSON en chaîne
      let json = JSON.stringify(obj);

      // Écrire dans le fichier
      fs.writeFile("monFichier.json", json, "utf8", function (err) {
        if (err) throw err;
        console.log("Les données ont été ajoutées au fichier JSON existant !");
      });
    }
  });*/
}
