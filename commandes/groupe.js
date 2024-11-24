const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { ajouterOuMettreAJourJid, mettreAJourAction, verifierEtatJid } = require("../bdd/antilien");
const { atbajouterOuMettreAJourJid, atbverifierEtatJid, atbmettreAJourAction } = require("../bdd/antibot");
const { search, download } = require("aptoide-scraper");
const axios = require('axios');
const fs = require("fs-extra");
const { recupevents } = require('../bdd/welcome');
const { exec } = require("child_process");

// Command for tagging members in a group
zokou({ nomCom: "appel", categorie: "Groupe", reaction: "📣" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

    if (!verifGroupe) { repondre("✋🏿 ✋🏿 cette commande est réservée aux groupes ❌"); return; }

    const mess = arg && arg.length > 0 ? arg.join(' ') : 'Aucun Message';
    let membresGroupe = verifGroupe ? await infosGroupe.participants : "";

    let tag = `
╭─────────────━┈⊷
│🍷 𝐒𝐇𝐀𝐃𝐎𝐖 𝐌𝐃 𝐓𝐀𝐆 🍷
╰─────────────━┈⊷
│👥 Group : ${nomGroupe}
│👤 Hey😀 : ${nomAuteurMessage}
│📜 Message : ${mess}
╰─────────────━┈⊷
`;

    const emoji = ['🍷', '👀', '😮‍💨', '❌', '🕸️', '😇', '⚙️', '🍑', '🎊', '😡', '🙏🏿', '✨', '$', '😟', '🥵', '🐅'];
    const random = Math.floor(Math.random() * emoji.length);

    for (const membre of membresGroupe) {
        tag += `${emoji[random]} @${membre.id.split("@")[0]}\n`;
    }

    if (verifAdmin || superUser) {
        zk.sendMessage(dest, { text: tag, mentions: membresGroupe.map(i => i.id) }, { quoted: ms });
    } else {
        repondre('Commande réservée aux admins');
    }
});

// Command for sending group link
zokou({ nomCom: "lien", categorie: "Groupe", reaction: "🙋" }, async (dest, zk, commandeOptions) => {
    const { repondre, nomGroupe, nomAuteurMessage, verifGroupe } = commandeOptions;
    if (!verifGroupe) { repondre("Wait bro, tu veux le lien de mon DM?"); return; };

    const link = await zk.groupInviteCode(dest);
    const lien = `https://chat.whatsapp.com/${link}`;

    const mess = `Salut ${nomAuteurMessage}, voici le lien du groupe ${nomGroupe}\nLien : ${lien}`;
    repondre(mess);
});

// Command to promote a member to admin
zokou({ nomCom: "nommer", categorie: "Groupe", reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
    let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
    if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }

    const met = await zk.groupMetadata(dest);

    if (await recupevents(dest, 'antipromote') == 'oui' && (met.author !== auteurMessage)) {
        repondre('Vous n\'avez pas le droit de nommer des participants car l\'antipromote est actif'); return;
    };

    const verifMember = (user) => {
        for (const m of membresGroupe) {
            if (m.id === user) {
                return true;
            }
        }
        return false;
    };

    const memberAdmin = (membresGroupe) => {
        let admin = [];
        for (const m of membresGroupe) {
            if (m.admin == null) continue;
            admin.push(m.id);
        }
        return admin;
    };

    const adminList = verifGroupe ? memberAdmin(membresGroupe) : '';
    const admin = verifGroupe ? adminList.includes(auteurMsgRepondu) : false;
    const membre = verifMember(auteurMsgRepondu);
    const autAdmin = verifGroupe ? adminList.includes(auteurMessage) : false;
    const zkad = verifGroupe ? adminList.includes(idBot) : false;

    try {
        if (autAdmin || superUser) {
            if (msgRepondu) {
                if (zkad) {
                    if (membre) {
                        if (!admin) {
                            const txt = `🎊🎊🎊 @${auteurMsgRepondu.split("@")[0]} est monté(e) en grade.\nIl/elle a été nommé(e) administrateur du groupe.`;
                            await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "promote");
                            zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
                        } else {
                            return repondre("Ce membre est déjà administrateur du groupe.");
                        }
                    } else {
                        return repondre("Cet utilisateur ne fait pas partie du groupe.");
                    }
                } else {
                    return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe.");
                }
            } else {
                repondre("Veuillez taguer le membre à nommer.");
            }
        } else {
            return repondre("Désolé, je ne peux pas effectuer cette action car vous n'êtes pas administrateur du groupe.");
        }
    } catch (e) {
        repondre("Oups " + e);
    }
});

// Command to demote a member from admin
zokou({ nomCom: "demettre", categorie: "Groupe", reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, auteurMessage, superUser, idBot } = commandeOptions;
    let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
    if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }

    const met = await zk.groupMetadata(dest);

    if (await recupevents(dest, 'antidemote') == 'oui' && (met.author !== auteurMessage)) {
        repondre('Vous n\'avez pas le droit de démériter des participants car l\'antidemote est actif'); return;
    };

    const verifMember = (user) => {
        for (const m of membresGroupe) {
            if (m.id === user) {
                return true;
            }
        }
        return false;
    };

    const memberAdmin = (membresGroupe) => {
        let admin = [];
        for (const m of membresGroupe) {
            if (m.admin == null) continue;
            admin.push(m.id);
        }
        return admin;
    };

    const adminList = verifGroupe ? memberAdmin(membresGroupe) : '';
    const admin = verifGroupe ? adminList.includes(auteurMsgRepondu) : false;
    const membre = verifMember(auteurMsgRepondu);
    const autAdmin = verifGroupe ? adminList.includes(auteurMessage) : false;
    const zkad = verifGroupe ? adminList.includes(idBot) : false;

    try {
        if (autAdmin || superUser) {
            if (msgRepondu) {
                if (zkad) {
                    if (membre) {
                        if (!admin) {
                            return repondre("Ce membre n'est pas un administrateur du groupe.");
                        } else {
                            const txt = `@${auteurMsgRepondu.split("@")[0]} a été démis de ses fonctions d'administrateur du groupe.`;
                            await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");
                            zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
                        }
                    } else {
                        return repondre("Cet utilisateur ne fait pas partie du groupe.");
                    }
                } else {
                    return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe.");
                }
            } else {
                repondre("Veuillez taguer le membre à démettre.");
            }
        } else {
            return repondre("Désolé, je ne peux pas effectuer cette action car vous n'êtes pas administrateur du groupe.");
        }
    } catch (e) {
        repondre("Oups " + e);
    }
});

// Command for adding a member
zokou({ nomCom: "ajouter", categorie: 'Groupe', reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
    let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
    if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }

    const participants = await zk.groupMetadata(dest);
    const isImAdmin = await isAdmin(participants, message.client.user.jid);
    if (!isImAdmin) return await message.send("Je ne suis pas admin.");
    
    const match = msgRepondu?.extendedTextMessage?.contextInfo?.participant || message.reply_message.jid;
    if (!match) return await message.send('Example : add 2250545065189');

    const res = await zk.groupParticipantsUpdate(dest, [match], "add");
    if (res == '403') return await message.send('Failed, Invite sent');
    else if (res && res != '200') return await message.send(res, { quoted: message.data });
});

// Command for removing a member
zokou({ nomCom: "retirer", categorie: "Groupe", reaction: "👨🏿‍💼" }, async (dest, zk, commandeOptions) => {
    let { repondre, msgRepondu, infosGroupe, auteurMsgRepondu, verifGroupe, nomAuteurMessage, auteurMessage, superUser, idBot } = commandeOptions;
    let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
    if (!verifGroupe) { return repondre("Pour les groupes uniquement"); }

    const verifMember = (user) => {
        for (const m of membresGroupe) {
            if (m.id === user) {
                return true;
            }
        }
        return false;
    };

    const memberAdmin = (membresGroupe) => {
        let admin = [];
        for (const m of membresGroupe) {
            if (m.admin == null) continue;
            admin.push(m.id);
        }
        return admin;
    };

    const adminList = verifGroupe ? memberAdmin(membresGroupe) : '';
    const admin = verifGroupe ? adminList.includes(auteurMsgRepondu) : false;
    const membre = verifMember(auteurMsgRepondu);
    const autAdmin = verifGroupe ? adminList.includes(auteurMessage) : false;
    const zkad = verifGroupe ? adminList.includes(idBot) : false;

    try {
        if (autAdmin || superUser) {
            if (msgRepondu) {
                if (zkad) {
                    if (membre) {
                        if (!admin) {
                            const txt = `@${auteurMsgRepondu.split("@")[0]} a été retiré du groupe.`;
                            await zk.groupParticipantsUpdate(dest, [auteurMsgRepondu], "remove");
                            zk.sendMessage(dest, { text: txt, mentions: [auteurMsgRepondu] });
                        } else {
                            repondre("Ce membre ne peut pas être retiré car il est un administrateur du groupe.");
                        }
                    } else {
                        return repondre("Cet utilisateur ne fait pas partie du groupe.");
                    }
                } else {
                    return repondre("Désolé, je ne peux pas effectuer cette action car je ne suis pas administrateur du groupe.");
                }
            } else {
                repondre("Veuillez taguer le membre à retirer.");
            }
        } else {
            return repondre("Désolé, je ne peux pas effectuer cette action car vous n'êtes pas administrateur du groupe.");
        }
    } catch (e) {
        repondre("Oups " + e);
    }
});

// Command to delete a message
zokou({ nomCom: "supp", categorie: "Groupe", reaction: "🧹" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, verifGroupe, auteurMsgRepondu, idBot, msgRepondu, verifAdmin, superUser } = commandeOptions;

    if (!msgRepondu) {
        repondre("Veuillez mentionner le message à supprimer");
        return;
    }

    if (superUser && auteurMsgRepondu === idBot) {
        const key = {
            remoteJid: dest,
            fromMe: true,
            id: ms.message.extendedTextMessage.contextInfo.stanzaId,
        };
        await zk.sendMessage(dest, { delete: key });
        return;
    }

    if (verifGroupe) {
        if (verifAdmin || superUser) {
            try {
                const key = {
                    remoteJid: dest,
                    id: ms.message.extendedTextMessage.contextInfo.stanzaId,
                    fromMe: false,
                    participant: ms.message.extendedTextMessage.contextInfo.participant
                };
                await zk.sendMessage(dest, { delete: key });
                return;
            } catch (e) {
                repondre("J'ai besoin des droits d'administration");
            }
        } else {
            repondre("Désolé, vous n'êtes pas administrateur du groupe.");
        }
    }
});

// Command to get group information
zokou({ nomCom: "info", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, verifGroupe, mybotpic } = commandeOptions;
    if (!verifGroupe) { repondre("Commande réservée au groupe uniquement"); return; }

    try {
        let ppgroup = await zk.profilePictureUrl(dest, 'image');
    } catch {
        ppgroup = mybotpic();
    }

    const info = await zk.groupMetadata(dest);
    const mess = {
        image: { url: ppgroup },
        caption: `*━━━━『Info du groupe』━━━━*\n\n*🎐Nom:* ${info.subject}\n\n*🔩ID du Groupe:* ${dest}\n\n*🔍Desc:* \n\n${info.desc}`
    };

    zk.sendMessage(dest, mess, { quoted: ms });
});

// Command to manage anti-link settings
zokou({ nomCom: "antilien", categorie: "Groupe", reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;

    if (!verifGroupe) {
        return repondre("Uniquement pour les groupes");
    }

    if (superUser || verifAdmin) {
        const enetatoui = await verifierEtatJid(dest);
        try {
            if (!arg || !arg[0] || arg === ' ') {
                repondre("antilien oui pour activer l'antilien\nantilien non pour désactiver l'antilien\nantilien action/retirer pour retirer directement sans préavis\nantilien action/warn pour donner des avertissements\nantilien action/supp pour supprimer uniquement le lien sans sanctionner\n\nNotez que par défaut l'antilien est réglé sur supp");
                return;
            }

            if (arg[0] === 'oui') {
                if (enetatoui) {
                    repondre("l'antilien est déjà activé pour ce groupe");
                } else {
                    await ajouterOuMettreAJourJid(dest, "oui");
                    repondre("l'antilien est activé avec succès");
                }
            } else if (arg[0] === "non") {
                if (enetatoui) {
                    await ajouterOuMettreAJourJid(dest, "non");
                    repondre("L'antilien a été désactivé avec succès");
                } else {
                    repondre("l'antilien n'est pas activé pour ce groupe");
                }
            } else if (arg.join('').split("/")[0] === 'action') {
                let action = (arg.join('').split("/")[1]).toLowerCase();
                if (['retirer', 'warn', 'supp'].includes(action)) {
                    await mettreAJourAction(dest, action);
                    repondre(`l'action de l'antilien a été actualisée sur ${action}`);
                } else {
                    repondre('Les seules actions sont *warn*, *supp* et *retirer*');
                }
            } else {
                repondre("*antilien oui* pour activer l'antilien\n*antilien non* pour désactiver l'antilien\n*antilien action/retirer* pour retirer directement sans préavis\n*antilien action/warn* pour donner des avertissements\n*antilien action/supp* pour supprimer uniquement le lien sans sanctionner\n\nNotez que par défaut l'antilien est réglé sur supp");
            }
        } catch (error) {
            repondre(error);
        }
    } else {
        repondre('Vous n\'avez pas le droit à cette commande');
    }
});

// Command to manage anti-bot settings
zokou({ nomCom: "antibot", categorie: "Groupe", reaction: "🔗" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, verifGroupe, superUser, verifAdmin } = commandeOptions;

    if (!verifGroupe) {
        return repondre("Uniquement pour les groupes");
    }

    if (superUser || verifAdmin) {
        const enetatoui = await atbverifierEtatJid(dest);
        try {
            if (!arg || !arg[0] || arg === ' ') {
                repondre("antibot oui pour activer l'antibot\nantibot non pour désactiver l'antibot\nantibot action/retirer pour retirer directement sans préavis\nantibot action/warn pour donner des avertissements\nantibot action/supp pour supprimer uniquement le message du bot sans sanctionner\n\nNotez que par défaut l'antibot est réglé sur supp");
                return;
            }

            if (arg[0] === 'oui') {
                if (enetatoui) {
                    repondre("l'antibot est déjà activé pour ce groupe");
                } else {
                    await atbajouterOuMettreAJourJid(dest, "oui");
                    repondre("l'antibot est activé avec succès");
                }
            } else if (arg[0] === "non") {
                if (enetatoui) {
                    await atbajouterOuMettreAJourJid(dest, "non");
                    repondre("L'antibot a été désactivé avec succès");
                } else {
                    repondre("l'antibot n'est pas activé pour ce groupe");
                }
            } else if (arg.join('').split("/")[0] === 'action') {
                let action = (arg.join('').split("/")[1]).toLowerCase();
                if (['retirer', 'warn', 'supp'].includes(action)) {
                    await atbmettreAJourAction(dest, action);
                    repondre(`l'action de l'antibot a été actualisée sur ${action}`);
                } else {
                    repondre('Les seules actions sont *warn*, *supp* et *retirer*');
                }
            } else {
                repondre("*antibot oui* pour activer l'antibot\n*antibot non* pour désactiver l'antibot\n*antibot action/retirer* pour retirer directement sans préavis\n*antibot action/warn* pour donner des avertissements\n*antibot action/supp* pour supprimer uniquement le message du bot sans sanctionner\n\nNotez que par défaut l'antibot est réglé sur supp");
            }
        } catch (error) {
            repondre(error);
        }
    } else {
        repondre('Vous n\'avez pas le droit à cette commande');
    }
});

// Command to manage group settings (open/close)
zokou({ nomCom: "groupe", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe, verifAdmin, superUser, arg } = commandeOptions;

    if (!verifGroupe) { repondre("Commande réservée au groupe uniquement"); return; }
    if (superUser || verifAdmin) {
        if (!arg[0]) { repondre('Consigne :\n\nTaper groupe ouvrir ou fermer'); return; }
        const option = arg.join(' ');
        switch (option) {
            case "ouvrir":
                await zk.groupSettingUpdate(dest, 'not_announcement');
                repondre('Groupe Ouvert');
                break;
            case "fermer":
                await zk.groupSettingUpdate(dest, 'announcement');
                repondre('Groupe fermé avec succès');
                break;
            default: repondre("N'inventez pas d'option idiote svp");
        }
    } else {
        repondre('Vous n\'avez pas le droit à cette commande');
    }
});

// Command to leave the group
zokou({ nomCom: "bye", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
    const { repondre, verifGroupe, superUser } = commandeOptions;
    if (!verifGroupe) { repondre("Commande réservée au groupe uniquement"); return; }
    if (!superUser) {
        repondre("Commande réservée au propriétaire du bot");
        return;
    }
    repondre('Sayonnara');
    await zk.groupLeave(dest);
});

// Command to rename the group
zokou({ nomCom: "gnom", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        repondre("Commande réservée aux administrateurs du groupe");
        return;
    }
    if (!arg[0]) {
        repondre("Veuillez entrer le nom du groupe svp");
        return;
    }
    const nom = arg.join(' ');
    await zk.groupUpdateSubject(dest, nom);
    repondre(`Nom du groupe actualisé : *${nom}*`);
});

// Command to update group description
zokou({ nomCom: "gdesc", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        repondre("Commande réservée aux administrateurs du groupe");
        return;
    }
    if (!arg[0]) {
        repondre("Veuillez entrer la description du groupe svp");
        return;
    }
    const nom = arg.join(' ');
    await zk.groupUpdateDescription(dest, nom);
    repondre(`Description du groupe actualisée : *${nom}*`);
});

// Command to update group profile picture
zokou({ nomCom: "gpp", categorie: "Groupe" }, async (dest, zk, commandeOptions) => {
    const { repondre, msgRepondu, verifAdmin } = commandeOptions;

    if (!verifAdmin) {
        repondre("Commande réservée aux administrateurs du groupe");
        return;
    }
    if (msgRepondu.imageMessage) {
        const pp = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        await zk.updateProfilePicture(dest, { url: pp })
            .then(() => {
                zk.sendMessage(dest, { text: "Group PFP changed" });
                fs.unlinkSync(pp);
            })
            .catch(err => zk.sendMessage(dest, { text: err }));
    } else {
        repondre('Veuillez mentionner une image svp');
    }
});

// Command for APK search and download
zokou({ nomCom: "apk", reaction: "✨", categorie: "Recherche" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;

    try {
        const appName = arg.join(' ');
        if (!appName) {
            return repondre("Entrer le nom de l'application à rechercher");
        }

        const searchResults = await search(appName);

        if (searchResults.length === 0) {
            return repondre("*Application non existante, veuillez entrer un autre nom*");
        }

        const appData = await download(searchResults[0].id);
        const fileSize = parseInt(appData.size);

        if (fileSize > 300) {
            return repondre("Le fichier dépasse 300 Mo, impossible de le télécharger.");
        }

        const downloadLink = appData.dllink;
        const captionText =
            "『 *Hacking-Md App* 』\n\n*Nom :* " + appData.name +
            "\n*Id :* " + appData["package"] +
            "\n*Dernière MAJ :* " + appData.lastup +
            "\n*Taille :* " + appData.size +
            "\n";

        const apkFileName = (appData?.["name"] || "Downloader") + ".apk";
        const filePath = apkFileName;

        const response = await axios.get(downloadLink, { responseType: "stream" });
        const fileWriter = fs.createWriteStream(filePath);
        response.data.pipe(fileWriter);

        await new Promise((resolve, reject) => {
            fileWriter.on('finish', resolve);
            fileWriter.on("error", reject);
        });

        const documentMessage = {
            'document': fs.readFileSync(filePath),
            'mimetype': 'application/vnd.android.package-archive',
            'fileName': apkFileName
        };

        // Utilisation d'une seule méthode sendMessage pour envoyer l'image et le document
        zk.sendMessage(dest, { image: { url: appData.icon }, caption: captionText }, { quoted: ms });
        zk.sendMessage(dest, documentMessage, { quoted: ms });

        // Supprimer le fichier après envoi
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error('Erreur lors du traitement de la commande apk:', error);
        repondre("Erreur lors du traitement de la commande apk");
    }
});

// Automute command
const cron = require('../bdd/cron');
zokou({ nomCom: 'automute', categorie: 'Groupe' }, async (dest, zk, commandeOptions) => {
    const { arg, ms, repondre, verifAdmin, superUser } = commandeOptions;

    if (!verifAdmin) { repondre('Vous n\'êtes pas administrateur du groupe'); return; }

    const group_cron = await cron.getCronById(dest);
    if (!arg || arg.length === 0) {
        let state;
        if (group_cron == null || group_cron.mute_at == null) {
            state = "Aucune heure réglée pour l'automute.";
        } else {
            state = `Le groupe se fermera à ${(group_cron.mute_at).split(':')[0]}H ${(group_cron.mute_at).split(':')[1]}`;
        }
        const msg = `*Etat :* ${state}\nConsigne : Pour activer l'automute, ajoutez après la commande la minute et l'heure séparées par ':'\nExemple: automute 9:30\nPour supprimer l'automute utilisez la commande automute supp`;
        repondre(msg);
        return;
    } else {
        const texte = arg.join(' ');
        if (texte.toLowerCase() === `supp`) {
            if (group_cron == null) {
                repondre('Aucun chronométrage actif');
            } else {
                await cron.delCron(dest);
                repondre("L'automute a été supprimé ; redémarrage pour appliquer les changements").then(() => {
                    exec("pm2 restart all");
                });
            }
        } else if (texte.includes(':')) {
            await cron.addCron(dest, "mute_at", texte);
            repondre(`Établissement d'un automute pour ${texte} ; redémarrage pour appliquer les changements`).then(() => {
                exec("pm2 restart all");
            });
        } else {
            repondre('Veuillez entrer une heure valide avec l\'heure et la minute séparées par :');
        }
    }
});

// Autounmute command
zokou({ nomCom: 'autounmute', categorie: 'Groupe' }, async (dest, zk, commandeOptions) => {
    const { arg, ms, repondre, verifAdmin, superUser } = commandeOptions;

    if (!verifAdmin) { repondre('Vous n\'êtes pas administrateur du groupe'); return; }

    const group_cron = await cron.getCronById(dest);
    if (!arg || arg.length === 0) {
        let state;
        if (group_cron == null || group_cron.unmute_at == null) {
            state = "Aucune heure réglée pour l'autounmute.";
        } else {
            state = `Le groupe s'ouvrira à ${(group_cron.unmute_at).split(':')[0]}H ${(group_cron.unmute_at).split(':')[1]}`;
        }
        const msg = `*État :* ${state}\nConsigne : Pour activer l'autounmute, ajoutez après la commande la minute et l'heure séparées par ':'\nExemple: autounmute 7:30\nPour supprimer l'autounmute utilisez la commande autounmute supp`;
        repondre(msg);
        return;
    } else {
        const texte = arg.join(' ');
        if (texte.toLowerCase() === `supp`) {
            if (group_cron == null) {
                repondre('Aucun chronométrage actif');
            } else {
                await cron.delCron(dest);
                repondre("L'autounmute a été supprimé ; redémarrage pour appliquer les changements").then(() => {
                    exec("pm2 restart all");
                });
            }
        } else if (texte.includes(':')) {
            await cron.addCron(dest, "unmute_at", texte);
            repondre(`Établissement d'un autounmute pour ${texte} ; redémarrage pour appliquer les changements`).then(() => {
                exec("pm2 restart all");
            });
        } else {
            repondre('Veuillez entrer une heure valide avec l\'heure et la minute séparées par :');
        }
    }
});

// Command to kick members based on country code
zokou({ nomCom: 'fkick', categorie: 'Groupe' }, async (dest, zk, commandeOptions) => {
    const { arg, ms, repondre, verifAdmin, superUser, verifZokouAdmin } = commandeOptions;

    if (verifAdmin || superUser) {
        if (!verifZokouAdmin) { repondre('Vous avez besoin des droits d\'administration pour effectuer cette commande'); return; }

        if (!arg || arg.length === 0) { repondre('Veuillez entrer l\'indicatif du pays dont les membres seront retirés'); return; }

        let metadata = await zk.groupMetadata(dest);
        let participants = metadata.participants;

        for (let i = 0; i < participants.length; i++) {
            if (participants[i].id.startsWith(arg[0]) && participants[i].admin === null) {
                await zk.groupParticipantsUpdate(dest, [participants[i].id], "remove");
            }
        }
    } else {
        repondre('Désolé, vous n\'êtes pas administrateur du groupe.');
    }
});

// Command to manage NSFW content
zokou({ nomCom: 'nsfw', categorie: 'Groupe' }, async (dest, zk, commandeOptions) => {
    const { arg, ms, repondre, verifAdmin, superUser } = commandeOptions;

    if (!verifAdmin) { repondre('Désolé, vous ne pouvez pas autoriser les contenus NSFW sans être administrateur du groupe'); return; }

    let hbd = require('../bdd/hentai');
    let isHentaiGroupe = await hbd.checkFromHentaiList(dest);

    if (arg[0] === 'on') {
        if (isHentaiGroupe) { repondre('Les NSFW sont déjà actifs pour ce groupe'); return; };
        await hbd.addToHentaiList(dest);
        repondre('Les NSFW sont désormais actifs pour ce groupe');
    } else if (arg[0] === 'off') {
        if (!isHentaiGroupe) { repondre('Les NSFW sont déjà désactivés pour ce groupe'); return; };
        await hbd.removeFromHentaiList(dest);
        repondre('Les NSFW sont désormais désactivés pour ce groupe');
    } else {
        repondre('Vous devez mettre "on" ou "off"');
    }
});
