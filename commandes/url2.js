const { zokou } = require("../framework/zokou");
const axios = require("axios");

// Define a command for uploading files to Catbox
zokou({
  nomCom: "url2", // Command name
  categorie: "Conversion", // Command category
  reaction: "🌐", // Emoji reaction for the command
  desc: "Téléverse une image, vidéo ou sticker vers Catbox et obtient l'URL.", // Command description
  alias: ["up"] // Alternative command name
}, async (origineMessage, zk, commandeOptions) => {

  const { repondre, msgRepondu } = commandeOptions;

  // Check if the message contains an attachment (image, video, sticker)
  const attachment = msgRepondu.attachments[0];

  // If there is no attachment, respond with a message
  if (!attachment) {
    return repondre("Veuillez fournir une image, vidéo ou sticker.");
  }

  // Extract the URL of the attachment
  const fileUrl = attachment.url;

  try {
    // Sending a POST request to Catbox to upload the file
    const response = await axios.post("https://catbox.moe/user/api.php", {
      fileToUpload: fileUrl,
      reqtype: "urlupload"
    });

    // Get the uploaded image URL from the response
    const uploadedImageUrl = response.data;

    // Respond with the URL of the uploaded file
    repondre(`Voici l'URL de votre fichier téléversé : ${uploadedImageUrl}`);

  } catch (error) {
    // Log any errors that occur during the upload
    console.error("Erreur lors du téléversement du fichier :", error);
    repondre("Échec du téléversement du fichier. Veuillez réessayer.");
  }
});
