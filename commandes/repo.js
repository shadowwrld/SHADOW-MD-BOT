"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "repo", catégorie:"Général", reaction: "🌏", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
  const githubRepo = 'https://api.github.com/repos/ShadowWrld/SHADOW-MD-BOT';
  const img = 'https://telegra.ph/file/c9c0af94510158016f7c6.jpg';

  try {
    const response = await fetch(githubRepo);
    const data = await response.json();

    if (data) {
      const repoInfo = {
        stars: data.stargazers_count,
        forks: data.forks_count,
        lastUpdate: data.updated_at,
        owner: data.owner.login,
      };

      const releaseDate = new Date(data.created_at).toLocaleDateString('en-GB');
      const lastUpdateDate = new Date(data.updated_at).toLocaleDateString('en-GB');

      const gitdata = `salut 👋 
ᴠᴏɪᴄɪ sʜᴀᴅᴏᴡ-ᴍᴅ.\n ᴛᴜ ᴅᴇᴘʟᴏʏᴇʀ ᴀ ᴘᴀʀᴛɪʀ ᴅᴜ ʀᴇᴘᴏ, sᴇssɪᴏɴ_ɪᴅ  ' https://habot.000webhostapp.com/ '

╭───────────────────━┈⊷
│🗼 ʀᴇᴘᴏsɪᴛᴏʀʏ: ${data.html_url}
│✨ sᴛᴀʀs: ${repoInfo.stars}
│🧧 ғᴏʀᴋs: ${repoInfo.forks}
│📅 ʀᴇʟᴇᴀsᴇ ᴅᴀᴛᴇ: ${releaseDate}
│🕐 ᴜᴘᴅᴀᴛᴇ ᴏɴ: ${repoInfo.lastUpdate}
│👨‍💻 ᴏᴡɴᴇʀ: sʜᴀᴅᴏᴡ-ᴡʀʟᴅ
╰───────────────────━┈⊷
╭───────────────────━┈⊷
  ᴍᴀᴅᴇ ᴡɪᴛʜ sʜᴀᴅᴏᴡ-ᴡʀʟᴅ`;
╰───────────────────━┈⊷
      await zk.sendMessage(dest, { image: { url: img }, caption: gitdata });
    } else {
      console.log("Could not fetch data");
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
});
