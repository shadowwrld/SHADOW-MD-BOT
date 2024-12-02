"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");

zokou({ nomCom: "test", reaction: "🧒", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Commande saisie !!!");

    const z = '🌍ʙᴏᴛ ɪs ᴏɴʟɪɴᴇ🌍 🙏 \n\n' +
              "ʟᴇ ʙᴏᴛ ᴛʀᴀᴠᴀɪʟʟᴇ ᴀᴄᴛᴜᴇʟʟᴇᴍᴇɴᴛ à ᴜɴᴇ ʙᴏɴɴᴇ ᴠɪᴛᴇssᴇ ⚡";

    const d = '                                                                           𝑯𝒆𝒂𝒍𝒕𝒉 𝒔𝒕𝒂𝒕𝒖𝒔✨';

    const varmess = z + d;

    const mp4 = 'https://telegra.ph/file/ce58cf8c538b1496fda33.mp4';

    await zk.sendMessage(dest, { video: { url: mp4 }, caption: varmess });

    // Uncomment the line below if you need to log "montest"
    // console.log("montest");
});

console.log("mon test");
