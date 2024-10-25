<p align="center">
 <img alt="wasi" height="300" src="https://i.imgur.com/Rj3JuBi.jpeg">


  <h1 align="center">𝐒𝐇𝐀𝐃𝐎𝐖 𝐌𝐔𝐋𝐓𝐈 𝐃𝐄𝐕𝐈𝐂𝐄 </h1>
 </a>
 <div align="center">
 <img src="https://spogit.vercel.app/api?theme=dark&rainbow=true&scan=true" alt="Widget with the current Spotify song"  />
</div>

</p>
<p align="center">
<a href="https://github.com/ShadowWrld"><img title="Author" src="https://img.shields.io/badge/Shadow-Wrld-black?style=for-the-badge&logo=Github"></a> <a href="https://wa.me/2250701557807"><img title="Author" src="https://img.shields.io/badge/CHAT US-black?style=for-the-badge&logo=whatsapp"></a>
<p/>
<p align="center">
<a href="https://github.com/ShadowWrld?tab=followers"><img title="Followers" src="https://img.shields.io/github/followers/ShadowWrld?label=Followers&style=social"></a>
</p></a>                     

   
   <h1 align="center"



***



***
</a></p>
- <a href="https://zokoupairingcode-ykvl.onrender.com/"><img title="GET SESSION OPT 1" src="https://img.shields.io/badge/GET SESSION OPT 1-h?color=pink&style=for-the-badge&logo=bmw" width="220" height="38.45"/></a></p>

***

- <a href="https://shadow-session-id-generator-1.onrender.com"><img title="GET SESSION OPT 2" src="https://img.shields.io/badge/GET SESSION OPT 2-h?color=red&style=for-the-badge&logo=bmw" width="220" height="38.45"/></a></p>



***

- <a href="https://dashboard.heroku.com/new?button-url=https://github.com/ShadowWrld/SHADOW-MD-BOT&template=https://github.com/ShadowWrld/SHADOW-MD-BOT"><img title="Deploy On Render" src="https://img.shields.io/badge/DEPLOY ON HEROKU-h?color=yellow&style=for-the-badge&logo=heroku" width="220" height="38.45"/></a></p>


***

- <a href="https://render.com"><img title="Deploy On Render" src="https://img.shields.io/badge/DEPLOY ON RENDER-h?color=blue&style=for-the-badge&logo=render" width="220" height="38.45"/></a></p>

***

- <a href="https://uptimerobot.com"><img title="Run it on uptime" src="https://img.shields.io/badge/RUN ON UPTIME-h?color=green&style=for-the-badge&logo=bmw" width="220" height="38.45"/></a></p>

***

- <a href="https://github.com/ShadowWrld"><img title="Deploy On Render" src="https://img.shields.io/badge/DEV INFORMATION-h?color=grey&style=for-the-badge&logo=github" width="220" height="38.45"/></a></p>


***

</p>
   
##


## Support 🧧 🧧 🧧 🧧
> HOW TO REACH THE OWNER? 
 
   
   <a href="https://wa.me/2250701557807">
    <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  </a>&nbsp;&nbsp;
   <a

    ## Ask any thing

</p>
  
## STEPS TO DEPLOY YOUR BOT


> 1, Star the repo up there then click Here To  [`FORK`](https://github.com/ShadowWrld/SHADOW-MD-BOT/fork)

> 2, TAP ON GET SESSIONS


> 3, CONNECT TO WHATSAPP WITH PAIRING CODE OR QR


> 4, TAP DEPLOY.., AND DEPLOY IT ON HEROKU...

</p>

## DEPLOIEMENT SUR RENDER

> 1. Si vous n'avez pas de compte **Render**, cliquez [**Ici**](https://dashboard.render.com) pour vous inscrire.
> 2. Créez un nouveau web service.
> 3. Choisissez **Public Git Repository**.
> 4. Dans le champ , Entrez `https://gitlab.com/bankai421341/senbonzakura.git`
> 5. Cliquez sur **Connect**.
> 6. Sélectionnez le **Free Plan** si vous ne voulez pas payer.
> 7. Dans la section **Environemment Variable**, cliquez sur **Add From .env** et copiez le contenu suivant :

     ```env
     PREFIXE=*
     LECTURE_AUTO_STATUS=oui
     TELECHARGER_AUTO_STATUS=oui
     NOM_BOT=Zokou-MD
     LIENS_MENU=https://wallpapercave.com/uwp/uwp3943464.jpeg
     PM_PERMIT=non
     MODE_PUBLIC=oui
     ETAT=1
     SESSION_ID=zokk
     NOM_OWNER=Djalega++
     NUMERO_OWNER=22891733300
     WARN_COUNT=3
     STARTING_BOT_MESSAGE=oui
     ANTI_VUE_UNIQUE=oui
     PM_CHATBOT=non
     DATABASE_URL=postgresql://zokouvf_user:rAzO0xc7jeW5fN2Ts912VpnNyc7dCCWj@dpg-cs9kumi3esus739h5neg-a.oregon-postgres.render.com/zokouvf
     ANTI_COMMAND_SPAM=non
      ```

> 8. Cliquez sur **Add env** pour enregistrer, puis  odifiez selon vos besoins. N'oubliez pas d'entrer votre Session ID.
> 9. Cliquez sur **Deploy Service** et Profitez-en !

</p>

## **Déploiement GitHub**
       
> 1. **Fork Le REPO**.
> 2. Modifiez le fichier `exemple_de_set.env` en `set.env` et ajoutez-y votre **Session_ID**.
> 3. Créez un nouveau fichier `.github/workflows/deploy.yml` et mettez-y ce contenu :

```yml
name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  schedule:
    - cron: '0 */4 * * *'

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: |
        npm install -g pm2
        npm install

    - name: Start application with timeout
      run: |
        timeout 14520s npm run zokou

```







</p>

## Contributions

> Les contributions à Shadow sont les bienvenues ! Si vous avez des idées pour de nouvelles fonctionnalités, des améliorations ou des corrections de bogues, n'hésitez pas à ouvrir une issue ou à soumettre une demande de pull.
## THANKS TO [GOD]
                
## Licence

> Le Bot WhatsApp *SHADOW-MD* est publié sous la [Licence MIT](https://opensource.org/licenses/MIT).

> Profitez des fonctionnalités variées du Bot WhatsApp *SHADOW-MD* pour améliorer vos conversations et rendre votre expérience WhatsApp plus intéressante !


## Developpeur :
 
  [**🌹⃝⃞⃟𝚂𝙷𝙰𝙳𝙾𝚆𝄟✮͢≛⃝𝚆𝚁𝙻𝙳⃝⃞⃟🌹**](https://github.com/carlydopeboii/SHADOW-MD-BOT/)
