/**
 * Fichier avec les requêtes serveurs
 */

import axios from "axios";

/**
 * URL du ngrok qui fait "l'alias" de notre serveur local. /!\ CHANGE CONSTAMMENT
 */
const urlServeur =
  "https://d056-2a01-cb15-814f-5400-7df1-17a7-dcdb-5ba0.ngrok-free.app";

/**
 * Récupère tous les lieux et leurs avis
 */
export async function getAllLieux() {
  try {
    const response = await fetch(urlServeur + "/lieux");
    const data = await response.json();
    return data;
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
 * Récupère un lieu et ses avis par son id
 * @param {number} id l'id du lieu
 * @returns le json avec le lieu et ses avis
 */
export async function getLieuById(id) {
  try {
    const response = await fetch(urlServeur + "/lieux/" + id);
    const data = await response.json();
    return data;
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
    //const data = await response.json();
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
