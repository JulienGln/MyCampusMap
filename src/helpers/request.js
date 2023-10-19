/**
 * Fichier avec les requêtes serveurs
 */

/**
 * Requête méthode POST
 */
export async function postLieu(data) {
  try {
    const response = await fetch("https://example.com/profile", {
      method: "POST", // ou 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getLieu() {
  try {
    const response = await fetch("https://example.com/profile", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

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
