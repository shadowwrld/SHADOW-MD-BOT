"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { zokou } = require("../framework/zokou");

zokou({ nomCom: "test", reaction: "🧒", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Commande saisie !!!");

    const z = '*🌍𝑩𝒐𝒕 𝒊𝒔 𝒐𝒏𝒍𝒊𝒏𝒆🌍* 🙏 \n\n' +
              "𝑻𝒉𝒆 𝒃𝒐𝒕 𝒊𝒔 𝒄𝒖𝒓𝒓𝒆𝒏𝒕𝒍𝒚 𝒘𝒐𝒓𝒌𝒊𝒏𝒈 𝒐𝒏 𝒂 𝒈𝒐𝒐𝒅 𝒔𝒑𝒆𝒆𝒅😉👍";

    const d = '                                                                           𝑯𝒆𝒂𝒍𝒕𝒉 𝒔𝒕𝒂𝒕𝒖𝒔✨';

    const varmess = z + d;

    const mp4 = 'https://telegra.ph/file/ce58cf8c538b1496fda33.mp4';

    await zk.sendMessage(dest, { video: { url: mp4 }, caption: varmess });

    // Uncomment the line below if you need to log "montest"
    // console.log("montest");
});

console.log("mon test");
