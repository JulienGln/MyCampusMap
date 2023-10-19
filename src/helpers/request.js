/**
 * Fichier avec les requêtes serveurs
 */

/**
 * Requête méthode POST
 */
export async function postLieu(data) {
  try {
    const response = await fetch(
      "mongodb://localhost/MyCampusMap/data/create_lieu",
      {
        method: "POST", // ou 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getAllLieu() {
  try {
    const response = await fetch(
      "mongodb://localhost/MyCampusMap/data/get_all_lieu",
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
}
