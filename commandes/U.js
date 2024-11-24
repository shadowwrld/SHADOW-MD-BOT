const { zokou } = require("../framework/zokou");
const axios = require("axios");

/**
 * Command to upload an image to Catbox and get the URL.
 */
zokou({
  nomCom: "url4",
  categorie: "SHADOW",
  reaction: "🌐",
  desc: "Téléverse une image vers Catbox et obtient l'URL",
  alias: ["up"]
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, msgRepondu, arg, repondre, nomAuteurMessage } = commandeOptions;

  // Validate input URL
  if (!arg[0]) {
    return repondre("Veuillez fournir une URL d'image.");
  }

  const imageUrl = arg[0];

  try {
    // Upload the image URL to Catbox
    const response = await axios.post("https://catbox.moe/user/api.php", {
      fileToUpload: imageUrl,
      reqtype: "urlupload"
    });

    // Get the uploaded image URL from the response
    const uploadedImageUrl = response.data;

    // Respond with the uploaded image URL
    repondre(`Voici l'URL de votre image téléversée : ${uploadedImageUrl}`);
  } catch (error) {
    // Log the error and respond with a failure message
    console.error("Erreur lors du téléversement de l'image :", error);
    repondre("Échec du téléversement de l'image. Veuillez réessayer.");
  }
});
