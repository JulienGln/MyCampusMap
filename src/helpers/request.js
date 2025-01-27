/**
 * Fichier avec les requêtes serveurs
 */

import axios from "axios";

/**
 * URL du ngrok qui fait "l'alias" de notre serveur local. /!\ CHANGE CONSTAMMENT
 */
const urlServeur = "https://9a63-193-48-126-240.ngrok-free.app";

/**
 * Récupère tous les lieux et leurs avis
 */
export async function getAllLieux() {
  try {
    const response = await axios.get(urlServeur + "/lieux");
    console.log("getAllLieux = " + JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Envoi un nouveau lieu (avec un avis) dans la base de données
 * @param {JSON} json les attributs d'un lieu (nom, type, etc.) et son avis (note, texte, etc.)
 * @returns un json
 */
export async function postLieu(json) {
  try {
    const response = await fetch(urlServeur + "/nouveau-lieu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Envoi un nouvel avis dans la base de données
 * @param {JSON} json les attributs de l'avis
 * @returns un json
 */
export async function postNewAvis(json) {
  try {
    const response = await fetch(urlServeur + "/nouvel-avis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la publication d'un nouvel avis :", error);
    console.error("Réponse complète :", await response.text());
  }
}

/**
 * Supprime un avis de la base de données
 * @param {string} lieu_id l'ID du lieu
 * @param {string} utilisateur le nom de l'utilisateur
 * @param {string} texte le texte de l'avis
 * @returns un json
 */
export async function deleteAvis(lieu_id, utilisateur, texte) {
  try {
    const response = await fetch(
      urlServeur + "/avis/" + lieu_id + "/" + utilisateur + "/" + texte,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la suppression d'un avis :", error);
    console.error("Réponse complète :", await response.text());
  }
}

/**
 * Récupère un lieu et ses avis par son id
 * @param {number} id l'id du lieu
 * @returns le json avec le lieu et ses avis
 */
export async function getLieuById(id) {
  try {
    const response = await axios.get(urlServeur + "/lieux/" + id);
    console.log("Lieu à l'id " + id + " = " + JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching lieu by ID:", error);
    console.error("Full response:", await response.text());
  }
}

/**
 * Cette fonction pourra servir pour l'ajout d'un nouveau lieu, en incrémentant l'id
 * @returns {number} l'ID du dernier lieu en base de données
 */
export async function getLastId() {
  try {
    const response = await axios.get(urlServeur + "/lastID");
    console.log("LastID = " + response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("Erreur dans la récupération de l'id : ", error);
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
