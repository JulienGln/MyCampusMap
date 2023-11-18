/**
 * Fichier avec les requêtes serveurs
 */

/**
 * Récupère tous les lieux et leurs avis
 */
export async function getAllLieux() {
  try {
    const response = await fetch("http://localhost:3000/lieux");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Requête méthode POST
 */
/*export async function postLieu(data) {
  try {
    const response = await fetch(
      "http://127.0.0.1:3000/data/create_lieu", //"mongodb://127.0.0.1:27017/MyCampusMap/data/create_lieu",
      {
        method: "POST", // ou 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    console.log(data);
    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getAllLieu() {
  try {
    const response = await fetch(
      "mongodb://127.0.0.1:27017/MyCampusMap/data/get_all_lieu",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}*/
