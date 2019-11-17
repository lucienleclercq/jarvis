const fs = require("fs");
import{test}from './fonction/teste'
const Discord = require("discord.js");
let guerrier = JSON.parse(fs.readFileSync("./memoire/guerrier.json", "utf8"));
let personne = JSON.parse(fs.readFileSync("./memoire/personne.json", "utf8"));
let mlien = JSON.parse(fs.readFileSync("./memoire/lien.json", "utf8"));
const bot = new Discord.Client();
const prog = 0;
const maxinventaire = 9;
var now = new Date();
var jour = now.getDate();
console.log(`${jour}`);
test();

bot.on("ready", () => {
  var i;
  
      if (!mlien['lientama'])
    {
        mlien['lientama'] = {
            nblien:0,
            nblienboss:0,
            lien:[],
            lienboss:[],
        }
    }
    // for (i = 0;i < 31 ; i ++)
    // {
    //     if (i < 10)
    //     {
    //      mlien['lientama'].lienboss[i] = lienfaille(i);
    //      mlien['lientama'].nblienboss ++;
    //     }
    //     else
    //     { mlien['lientama'].lien[i-10] = lienfaille(i);mlien['lientama'].nblien ++}
    // }
  if (!guerrier["val"]) {
    guerrier["val"] = {
      nb: 0,
      nom: [],
      maitre: [],
      nbattaque: 0,
      nbbosse: 0,
      nbmaitre: 0,
      etatportaille: 0,
      tempsportail: Math.floor(Math.random() * 3000) + 600, 
      inventaire:[["lagepotion"],["sucette"],["hotdog"],["nouriture"],["boisson"],["zap"],["pasteque"],["potion"],["omelette"]],
    };
  } else guerrier = maj(guerrier);

  if (!personne["val"]) {
    personne["val"] = {
      nb: 0,
      nom: []
    };
  } else personne = majpersonne(personne);

  fs.writeFile("./memoire/guerrier.json", JSON.stringify(guerrier), err => {
    if (err) console.error(err);
  });
  fs.writeFile("./memoire/personne.json", JSON.stringify(personne), err => {
    if (err) console.error(err);
  });
  fs.writeFile("./memoire/lien.json", JSON.stringify(mlien), err => {
    if (err) console.error(err);
  });
  console.log("go go go !!!!");
});
function orloge() {
  let general = bot.channels.find("name", "le_complexe_des_astronaute");
  let salonguerrier = bot.channels.find("name", "the_guardian-s_war");
  var i;
  var temp;
  if (guerrier["val"]) {
    for (i = 0; i < guerrier["val"].nb; i++) {
      var nom = `${guerrier["val"].nom[i]}`;
      var nivaux = guerrier[nom].niveaux + 1;
      var maitre = guerrier[nom].maitre;

      if (
        (guerrier[nom].niveaux + 1) * 5 * (guerrier[nom].niveaux + 1) * 5 -
          guerrier[nom].xp <
        0
      ) {
        temp =
          guerrier[nom].xp;
          (guerrier[nom].niveaux + 1) * 5 * (guerrier[nom].niveaux + 1) * 5;
        guerrier[nom].niveaux++;
        guerrier[nom].xp = temp;
        bot.channels.get(salonguerrier.id).sendEmbed({
          fields: [
            {
              name: "LEVEL UP",
              value: `${nom} a attein le niveaux ${guerrier[nom].niveaux}`
            }
          ]
        });
      }
      let nommaitre = bot.users.find("username", `${guerrier[nom].maitre}`);
      if (guerrier[nom].lieux == 0) {
        if (guerrier[nom].vie < 1000 * nivaux * 2) 
        {
          guerrier[nom].vie++;
          
        }
        if (guerrier[nom].cout >= 216000) {
          personne[maitre].credit -= 6;
          bot.users
            .get(nommaitre.id)
            .sendCode("asciidoc", `tu a payer l'infirmerie`);
          guerrier[nom].cout = 0;
        } else guerrier[nom].cout++;
        if (guerrier[nom].vie == 2000 && guerrier[nom].niveaux == 0)
        {
          guerrier[nom].niveaux++;
          bot.channels.get(salonguerrier.id).send(`${nom} a eclot `);
          afficherguerrier(nom, guerrier);
        } 
      } else if (guerrier[nom].lieux == 2 || guerrier[nom].lieux == 1 || guerrier[nom].lieux == 6) {
        guerrier = retirerfaim(1, guerrier, nom);
        guerrier = retirersoif(1, guerrier, nom);
        if (guerrier[nom].lieux == 1) guerrier[nom].xp++;
      } else if (guerrier[nom].lieux == 3) {
        if (guerrier[nom].faim < 10000 * (nivaux + 1)) guerrier[nom].faim++;
        if (guerrier[nom].soif < 10000 * (nivaux + 1)) guerrier[nom].soif++;
        if (guerrier[nom].cout >= 216000) {
          personne[maitre].credit -= 4;
          bot.users
            .get(nommaitre.id)
            .sendCode("asciidoc", `tu a payer la cantine`);
          guerrier[nom].cout = 0;
        } else guerrier[nom].cout++;
      }
      if (guerrier[nom].xp)
        if (guerrier[nom].faim <= 0) {
          guerrier = retirervie(1, guerrier, nom);
        }
      if (guerrier[nom].soif <= 0) {
        guerrier = retirervie(1, guerrier, nom);
      }
      if (
        guerrier[nom].vie <= 0 &&
        (guerrier[nom].lieux != 4 || guerrier[nom].lieux != 5)
      ) {
        guerrier = transfere(4, guerrier, nom, 0);
        guerrier[nom].vie = 0;
      }
      if (guerrier[nom].lieux == 4 || guerrier[nom].lieux == 5) {
        guerrier[nom].delay++;
      }
      if (guerrier[nom].delay == 216000) {
        guerrier = transfere(5, guerrier, nom, 0);
      }
      if (guerrier[nom].delay == 432000) {
        if (guerrier["val"].nb > 1) {
          var i;
          while (nom != guerrier["val"].nom[i]) {
            i++;
          }
          for (i; i < guerrier["val"].nb - 1; i++) {
            guerrier["val"].nom[i] = guerrier["val"].nom[i + 1];
          }
          guerrier["val"].nb--;
        } else {
          guerrier["val"].nb--;
        }
        delete guerrier[nom];
      }
    }
  }
  /* gestion personne */
  var nom;
  if (personne["val"]) {
    for (i = 0; i < personne["val"].nb; i++) {
      nom = personne["val"].nom[i];
      let nompersonne = bot.users.find("username", `${nom}`);
      //tuto the war
      if (personne[nom].thewar == 1) {
        personne[nom].thewar = 2;
        bot.users
          .get(nompersonne.id)
          .sendCode(
            "asciidoc",
            "parfait nous pouvons maintenant commencer votre formation\n toute la formation est a réaliser dans le salon privé"
          );
        bot.users
          .get(nompersonne.id)
          .sendCode(
            "asciidoc",
            "Commençons par cree votre classe vous avez le choix entre assasin/mage/paladin/archer (pour choisir il sufit d envoyer le nom de la classe voulue)"
          );
      } else if (personne[nom].thewar == 3) {
        bot.users
          .get(nompersonne.id)
          .sendCode(
            "asciidoc",
            'maintenant vous pouvais invoquer votre premier guerrier pour cela envoyer "cree guerrier" suivie du nom puis d un lien d image pui un deuxieme lien d image qui corespondra a son evolution'
          );
        personne[nom].thewar = 4;
      } else if (personne[nom].thewar == 5) {
        bot.users
          .get(nompersonne.id)
          .sendCode(
            "asciidoc",
            'vous éte maintenant presque pret il vous faut maintenant connaitre les commande pour pouvoir participer au combat pour cela taper "help war" dans le salon dedier pour avoir la liste des commande disponible'
          );
        bot.users
          .get(nompersonne.id)
          .sendCode(
            "asciidoc",
            "voila votre formation est terminer bonne chance et puice le sort vous etre favorable"
          );
        personne[nom].thewar = 6;
      }
      //level up
      if (
        (personne[nom].niveaux + 1) * 5 * (personne[nom].niveaux + 1) * 5 -
          personne[nom].xp <
        0
      ) {
        temp =
          personne[nom].xp -
          (personne[nom].niveaux + 1) * 5 * (personne[nom].niveaux + 1) * 5;
        personne[nom].niveaux++;
        personne[nom].xp = temp;
        bot.channels.get(general.id).sendEmbed({
          fields: [
            {
              name: "LEVEL",
              value: `${nom} a attein le niveaux ${personne[nom].niveaux}`
            },
            {
              name: "level suivant",
              value: `${(personne[nom].niveaux + 1) *
                5 *
                (personne[nom].niveaux + 1) *
                5 -
                personne[nom].xp}`
            }
          ],
          image: {
            height: 30,
            width: 30,
            url: `${personne[nom].avatarURL}`
          }
        });
      }
    }
  }
  // gestion portail
  if (guerrier["val"]) {
    var niveauxmax = 0;
    var niveaux = 0;
    for (i = 0; i < guerrier["val"].nb; i++) {
      var nom = `${guerrier["val"].nom[i]}`;
      if (guerrier[nom].niveaux > niveauxmax)
        niveauxmax = guerrier[nom].niveaux;
    }
    if (guerrier["val"].tempsportail > 0 && guerrier["val"].nb > 0 ) {
      if (niveauxmax > 0)guerrier["val"].tempsportail--;
    } else if (guerrier["val"].etatportaille == 1 && guerrier["val"].nb > 0) {

      niveauxmax++;
      var niveaumin = niveauxmax;
      for (i = 0; i < guerrier["val"].nb; i++) {
        var nom = `${guerrier["val"].nom[i]}`;
        if (guerrier[nom].niveaux < niveaumin)
          niveaumin = guerrier[nom].niveaux;
      }
      bot.channels.get(salonguerrier.id).sendEmbed({
        fields: [
          {
            name: "ATTENTION",
            value: `le portail c'est ouvert `
          },
          {
            name: "level",
            value: `${niveaux}`
          }
        ],
        image: {
          height: 30,
          wigh: 30,
          url:
            "https://lh3.googleusercontent.com/-j09cTmhiNws/W8gw3lqJLeI/AAAAAAAAAf4/6LYKChg3tjYdz7sQicZjqgos3d6cLsk1wCJoC/w530-h298-n-rw/gplus9066141391053623441.png"
        }
      });
      niveaux =
        Math.floor(Math.random() * (niveauxmax - niveaumin)) + niveaumin;
      for (i = 0; i < niveaux; i++) {
        if (niveaux == 0) niveaux = 1;
        if (!guerrier[i]) {
          var nivauxattaque =
            Math.floor(Math.random() * (niveauxmax - niveaumin)) + niveaumin;
          guerrier[i] = {
            niveaux: nivauxattaque,
            vie: 500 * nivauxattaque,
            lien: mlien["lientama"].lien[Math.floor(Math.random() * mlien["lientama"].nblien)],
            type: type(), 
            tempsattaque : Math.floor(Math.random()*60),
          };
          afficherenemi(guerrier[i]);
          guerrier["val"].nbattaque++;
        }
      }
      if (!guerrier[niveaux]) {
        guerrier[niveaux] = {
          niveaux: niveaux,
          vie: 1000 * niveaux * 2,
          lien:
            mlien["lientama"].lienboss[
              Math.floor(Math.random() * mlien["lientama"].nblienboss)
            ],
          type: type(),
          tempsattaque : Math.floor(Math.random()*60),
        };
        guerrier["val"].nbbosse++;

      }

      

      guerrier["val"].etatportaille++;
    } else if (guerrier["val"].nb > 0 && guerrier["val"].etatportaille < 2) {
      bot.channels
        .get(salonguerrier.id)
        .sendCode("asciidoc", "le portail est en train de s'ouvrir (5min)");
      guerrier["val"].etatportaille++;
      guerrier["val"].tempsportail = 300;
    }
  }
  // gestion attaque
  for (i = 0; i < guerrier["val"].nb; i++) {
    var nom = `${guerrier["val"].nom[i]}`;
    if ( guerrier[nom].lieux == 6)
  {
    var nivaux = guerrier[nom].niveaux + 1;
    var dega;
    if (guerrier["val"].etatportaille == 2) {
      if ( fin(guerrier) != true)
      {
        if (guerrier[nom].tempattaque <= 0)
        {var cible = choixcible(guerrier);
        dega = degacible(guerrier,nom,cible,salonguerrier,20);
        guerrier[cible].vie -= dega;
        bot.channels.get(salonguerrier.id).sendCode('asciidoc',`${nom} attaque l'attaquant n° ${cible} et fait ${dega} dega`); 
        if (guerrier[cible].vie <= 0)
        {
          bot.channels.get(salonguerrier.id).sendCode('asciidoc',`l'attaquant n°${cible} est mort`); 
          delete guerrier[cible];
        }
        guerrier[nom].tempattaque = Math.floor(Math.random()*30);
        }
        else 
        {
          guerrier[nom].tempattaque --;
        }
        if ( fin(guerrier) == true)
        {
          var j;
        for (j = 0; j < guerrier["val"].nbbosse; j++) {
        var imageguerrier;
        if (guerrier[guerrier["val"].nbattaque+j].niveaux >= 0) {
          imageguerrier = guerrier[guerrier["val"].nbattaque+j].lien.lien;
        } else if (guerrier[guerrier["val"].nbattaque+j-1].niveaux >= 10) {
          imageguerrier = guerrier[guerrier["val"].nbattaque+j].lien.evo;
        }
        afficherenemi(guerrier[guerrier["val"].nbattaque+j]);
      }
        }
      }
      else 
      {
        if (guerrier[nom].tempattaque <= 0)
        {
          var dega;
          dega = degacible(guerrier, nom ,guerrier["val"].nbattaque +guerrier["val"].nbbosse-1, salonguerrier,10);
          guerrier[guerrier["val"].nbattaque +guerrier["val"].nbbosse-1].vie -= dega;
          bot.channels.get(salonguerrier.id).sendCode('asciidoc',`${nom} attaque le bosse et fait ${dega} dega`); 
          guerrier[nom].tempattaque = Math.floor(Math.random()*30);
          if (guerrier[guerrier["val"].nbattaque +guerrier["val"].nbbosse-1].vie <= 0)
          {
            bot.channels.get(salonguerrier.id).sendCode('asciidoc',`le bosse est mort est mort`); 
            delete guerrier[guerrier["val"].nbattaque +guerrier["val"].nbbosse-1];
            guerrier["val"].nbattaque = 0;
            guerrier["val"].nbbosse = 0;
            guerrier["val"].etatportaille = 0;
            bot.channels.get(salonguerrier.id).sendEmbed({
              title : 'le portail c est refermer bien jouer  :cartwheel::trumpet::tada::trumpet::cartwheel:',
              image: {
                width: 30,
                height: 30,
                url: `https://lh3.googleusercontent.com/-Xzp-uGI47pU/W8gwpDoHZnI/AAAAAAAAAf4/6pXLs7eWXUY3KdcghMSsvEKzYjwgOUH8wCJoC/w530-h298-n-rw/gplus1423934598260745512.png`,
              }
            });
            guerrier['val'].tempsportail = Math.floor(Math.random()*7200)+3600;
          }
        }
        else 
        {
          guerrier[nom].tempattaque--;
        }
      }
    }
    }}
    for (i = 0 ; i < guerrier['val'].nbattaque+guerrier['val'].nbbosse-1 ; i ++)
    {
      if (fin(guerrier) != true)
      {
        if (guerrier[i] && i < guerrier['val'].nbattaque)
        {
          if (guerrier[i].tempsattaque == 0)
          {var cible = choixcibleattaque(guerrier);
            if (cible !=  'vide')
            {
          var dega = degacible(guerrier,i,cible,salonguerrier,30);
          bot.channels.get(salonguerrier.id).sendCode("asciidoc",`l'attaquant n°${i} attaque ${cible} et fait ${dega} dega`);
          guerrier[i].tempsattaque = Math.floor(Math.random()*60);
          guerrier[cible].vie -= dega;
            }
            else 
          {
            guerrier[i].tempsattaque = Math.floor(Math.random()*60);
          }
            
          }
          else 
          {
            guerrier[i].tempsattaque --;  
          }
        }
      }
      else 
      {
        if (guerrier[guerrier['val'].nbattaque+guerrier['val'].nbbosse-1].tempsattaque <= 0)
        {var cible = choixcibleattaque(guerrier);
          if (cible !=  'vide')
          {
        var dega = degacible(guerrier,guerrier['val'].nbattaque+guerrier['val'].nbbosse-1,cible,salonguerrier,10);
        dega *= 2 ; 
        bot.channels.get(salonguerrier.id).sendCode("asciidoc",`le bosse attaque ${cible} et fait ${dega} dega`);
        guerrier[guerrier['val'].nbattaque+guerrier['val'].nbbosse-1].tempsattaque = Math.floor(Math.random()*200);
          }
          else 
        {
          guerrier[guerrier['val'].nbattaque+guerrier['val'].nbbosse-1].tempsattaque = Math.floor(Math.random()*200);
        }
          
        }
        else 
        {
          guerrier[guerrier['val'].nbattaque+guerrier['val'].nbbosse-1].tempsattaque --;  
        }
      }
      
    }


  fs.writeFile("./memoire/guerrier.json", JSON.stringify(guerrier), err => {
    if (err) console.error(err);
  });
  fs.writeFile("./memoire/personne.json", JSON.stringify(personne), err => {
    if (err) console.error(err);
  });
}
setInterval(orloge, 1000);
/* function guerrier  */
function type() {
  var a = Math.floor(Math.random() * 9);
  if (a == 0) {
    return ":ocean:";
  } else if (a == 1) {
    return ":fire:";
  } else if (a == 2) {
    return ":earth_asia:";
  } else if (a == 3) {
    return ":volcano:";
  } else if (a == 4) {
    return ":cloud:";
  } else if (a == 5) {
    return ":hourglass_flowing_sand:";
  } else if (a == 6) {
    return ":cloud_tornado:";
  } else if (a == 7) {
    return ":zap:";
  } else if (a == 8) {
    return ":skull_crossbones:";
  } else return " ";
  //eau feux terre lave vapeur sable vent foudre poison
}
function maj(guerrier) {
  // var i, j;
  // for (i = 0; i < guerrier["val"].nbmaitre; i++) {
  //   if (guerrier[guerrier["val"].maitre[i]]) {

  //     if (guerrier[guerrier["val"].maitre[i]].buf == null)
  //     {

  //     }
  // }
  // for (i = 0; i < guerrier["val"].nb; i++) {
  //   if (guerrier[guerrier['val'].nom[i]])
  //   {
      
  //   }

  // }
  // }
  return guerrier;
}
function majpersonne(personne) {
  var i;
  for (i = 0; i < personne["val"].nb; i++) {
    if (!personne[personne["val"].nom[i]].date)
    {
      
    }
  }

  return personne;
}
function donner(guerrier, item, nom, message) {
  var maitre = guerrier[nom].maitre;
  if (item == "largepotion") {
    if (guerrier[maitre].inventaire[0] > 0) {
      guerrier[maitre].largepotion--;
      guerrier[nom].vie += 1000;
    } else
      message.channel.sendCode("asciidoc", "vous n'avez pas de largepotion");
  } else if (item == "sucette") {
    if (guerrier[maitre].inventaire[1] > 0) {
      guerrier[maitre].sucette--;
      guerrier[nom].xp += 10;
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de sucette");
  } else if (item == "hotdog") {
    if (guerrier[maitre].inventaire[2] > 0) {
      guerrier[maitre].hotdog--;
      guerrier[nom].faim += 500;
      guerrier[nom].soif -= 100;
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de sucette");
  } else if (item == "nouriture") {
    if (guerrier[maitre].inventaire[3] > 0) {
      guerrier[maitre].nouriture--;
      guerrier[nom].faim += 1000;
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de nouriture");
  } else if (item == "boisson") {
    if (guerrier[maitre].inventaire[4] > 0) {
      guerrier[maitre].boisson--;
      guerrier[nom].soif += 1000;
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de boisson");
  } else if (item == "zap") {
    if (guerrier[maitre].inventaire[5] == 4) {
      guerrier[maitre].zap--;
      guerrier[nom].lieux = 0;
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de zap");
  } else if (item == "pasteque") {
    if (guerrier[maitre].inventaire[6] > 0) {
      guerrier[maitre].pasteque--;
      guerrier[nom].soif += 500;
      guerrier[nom].faim += 200;
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de pasteque");
  } else if (item == "potion") {
    if (guerrier[maitre].inventaire[7] > 0) {
      guerrier[maitre].potion--;
      guerrier[nom].vie += 500;
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de potion");
  } else if (item == "omelette") {
    if (guerrier[maitre].inventaire[8] > 0) {
      guerrier[maitre].omelette--;
      guerrier[nom].soif += 100;
      guerrier[nom].faim += 300;
    } else message.channel.sendCode("asciidoc", "vous n'avez pas d'omelette");
  }
  return guerrier;
}
function convlieux(lieuxstring, tamasalon) {
  var lieux;
  if (lieuxstring == "pied") {
    lieux = 2;
  } else if (lieuxstring == "dojo") {
    lieux = 1;
  } else if (lieuxstring == "infirmerie") {
    lieux = 0;
  } else if (lieuxstring == "cantine") {
    lieux = 3;
    
  }else if (lieuxstring == "portail") {
    lieux = 6;
  } else {
    // bot.channels.get(tamasalon.id).sendCode("asciidoc", "lieux invalide");
  }
  return lieux;
} 
function transfere(lieuxstring, guerrier, nom) {
  let tamasalon = bot.channels.find("name", "the_guardian-s_war");
  var lieux;
  lieux = convlieux(lieuxstring, tamasalon);
  // 0 infirmerie 1 dojo 2 pied 3 cantine 4 morgue 5 cimetiere
  if (lieux < 7 && lieux >= 0) {
    if (guerrier[nom].classe != 0 && guerrier[nom].type != 0) {
      guerrier[nom].lieux = lieux;
      if (guerrier[nom].lieux == lieux) {
        if (lieux == 0)
          bot.channels
            .get(tamasalon.id)
            .sendCode("asciidoc", `${nom} a prit l'amblance :ambulance:`);
        else if (lieux == 1)
          bot.channels
            .get(tamasalon.id)
            .sendCode("asciidoc", `${nom} est entrer dans le dojo`);
        else if (lieux == 2)
          bot.channels
            .get(tamasalon.id)
            .sendCode("asciidoc", `${nom} est a vos pied`);
        else if (lieux == 3)
          bot.channels
            .get(tamasalon.id)
            .sendCode("asciidoc", `${nom} est entrer dans la cantine`);
        else if (lieux == 4)
          bot.channels
            .get(tamasalon.id)
            .sendCode("asciidoc", `${nom} est a la morgue`);
        else if (lieux == 5)
          bot.channels
            .get(tamasalon.id)
            .sendCode(
              "asciidoc",
              `${nom} est definitivement mort de cause létal`
            );
            else if (lieux == 6)
          bot.channels
            .get(tamasalon.id)
            .sendCode(
              "asciidoc",
              `${nom} est poster en premier ligne`
            );
        afficherguerrier(nom, guerrier);
      } else bot.channels.get(tamasalon.id).sendCode("asciidoc", `echec`);

      if (guerrier[nom].lieux == 4 || guerrier[nom].lieux == 5) {
        bot.channels
          .get(tamasalon.id)
          .sendCode(
            "asciidoc",
            `${nom} est mort il ne peut donc pas changer de lieux cono`
          );
      }
    }
    if (guerrier[nom].classe == 0)
      bot.channels
        .get(tamasalon.id)
        .sendCode(
          "asciidoc",
          `${nom} n'a pas de classe il lui faut une classe avant de quitter l'infirmerie pour la premier fois \help`
        );
    if (guerrier[nom].type == 0)
      bot.channels
        .get(tamasalon.id)
        .sendCode(
          "asciidoc",
          `${nom} n'a pas de type il lui faut un type avant de quitter l'infirmerie pour la premier fois`
        );
  }
  return guerrier;
}
function retirerfaim(nb, guerrier, nom) {
  let nommaitre = bot.users.find("username", `${guerrier[nom].maitre}`);
  if (
    guerrier[nom].faim > 0 &&
    guerrier[nom].lieux != 4 &&
    guerrier[nom].lieux != 5
  )
    guerrier[nom].faim -= nb;
  if (guerrier[nom].faim == 1)
    bot.users.get(nommaitre.id).sendCode("asciidoc", `${nom} meurt de faim`);
  if (guerrier[nom].faim == 500)
    bot.users.get(nommaitre.id).sendCode("asciidoc", `${nom} a faim`);
  return guerrier;
}
function retirersoif(nb, guerrier, nom) {
  let nommaitre = bot.users.find("username", `${guerrier[nom].maitre}`);
  if (
    guerrier[nom].soif > 0 &&
    guerrier[nom].lieux != 4 &&
    guerrier[nom].lieux != 5
  )
    guerrier[nom].soif -= nb;
  if (guerrier[nom].soif == 1)
    bot.users.get(nommaitre.id).sendCode("asciidoc", `${nom} meurt de soif`);
  if (guerrier[nom].soif == 500)
    bot.users.get(nommaitre.id).sendCode("asciidoc", `${nom} a soif`);
  return guerrier;
}
function retirervie(nb, guerrier, nom) {
  let nommaitre = bot.users.find("username", `${guerrier[nom].maitre}`);
  if (guerrier[nom].vie > 0) guerrier[nom].vie -= nb;
  if (
    guerrier[nom].vie <= 0 &&
    guerrier[nom].lieux != 4 &&
    guerrier[nom].lieux != 5
  ) {
    guerrier[nom].vie = 0;
    guerrier[nom].lieux = 4;
    bot.users.get(nommaitre.id).sendCode("asciidoc", `${nom} est mort`);
  }
  if (
    guerrier[nom].vie <= 0 &&
    guerrier[nom].lieux != 0 &&
    guerrier[nom].lieux != 4 &&
    guerrier[nom].lieux != 5
  ) {
    guerrier[nom].lieux = 0;
    bot.users
      .get(nommaitre.id)
      .sendCode("asciidoc", `${nom} a etait transferé a l'infirmerie`);
  }
  return guerrier;
}
function ajoutervie(nb, guerrier, nom) {
  guerrier[nom].vie += nb;
  if (guerrier[nom].vie <= 0) guerrier[nom].lieux = 4;
  return guerrier;
}
function creeguerrier(maitre, lien, evolution) {
  var guerrier = {
    type: type(),
    objet:[],
    vie: 100,
    xp: 0,
    niveaux: 0,
    faim: 50,
    soif: 50,
    lieux: 0,
    delay: 0,
    cout: 0,
    sex: Math.floor(Math.random() * 2) + 1,
    recherche: 0,
    maitre: maitre,
    evolution: evolution,
    lien: lien,
    tempattaque: 0,
    buf : {
      type : 0,
      temps : 0,
    },
    maluse : {
      type : 0, 
      temps : 0,
    }
  };
  guerrier.objet[0] = Math.floor(Math.random() * 5)+2; 
  return guerrier;
}
function creemaitre(personne) {
  var maitre = {
    inventaire: [],
    classe: 0,
    url:
      "http://www.holidogtimes.com/fr/wp-content/uploads/sites/2/2017/08/chiens-meme-droles-4.jpg?2e4e73&2e4e73",
    vie: 2000, 
    buf : {
      type : 0,
      temps : 0,
    },
    maluse : {
      type : 0,
      temps :0,
    },
    niveaux: 0,
    pouvoir: [],
  };
  var j;
  for (j = 0; j < maxinventaire; j++) {
      maitre.inventaire[j] = 0;
  }
  return maitre;
}
function couleur(type)
{
  if (type == ":ocean:") {
    return 0x00AEFF;
  } else if (type == ":fire:") {
    return ;
  } else if (type == ":earth_asia:") {
    return 0x008608;
  } else if (type == ":volcano:") {
    return 0xEB0002;
  } else if (type == ":cloud:") {
    return 0xFFFFFF;
  } else if (type == ":hourglass_flowing_sand:") {
    return 0xFFFF00;
  } else if (type == ":cloud_tornado:") {
    return 0x8F8F8F;
  } else if (type == ":zap:") {
    return 0xD8FF00;
  } else if (type == ":skull_crossbones:") {
    return 0x155500;
  }
}
function afficherguerrier(nom, guerrier) {
  var rich = new Discord.RichEmbed();
  let tamasalon = bot.channels.find("name", "the_guardian-s_war");
  if (!guerrier[nom]) {
    bot.channels
      .get(tamasalon.id)
      .sendCode("asciidoc", "se guerrier n'existe pas");
    return;
  }
  rich.setColor(couleur(guerrier[nom].type));
  rich.setTitle(`${nom}`);
  if( guerrier[nom].vie > 0) rich.addField("vie", `${guerrier[nom].vie}`, true);
  else rich.addField("vie", 0, true); 
  if (guerrier[nom].faim > 0)rich.addField("faim",`${guerrier[nom].faim}`, true);
  else rich.addField("faim", 0, true);
  if (guerrier[nom].soif > 0)rich.addField("soif", `${guerrier[nom].soif}`, true); 
  else rich.addField("soif", 0, true);
  if (guerrier[nom].niveaux == 0) {
    rich.setThumbnail(
      "https://us.123rf.com/450wm/hulinska1yevheniia/hulinska1yevheniia1209/hulinska1yevheniia120900016/15526710-bande-dessin-e-d-oeufs-et-de-l-isolement-sur-un-fond-blanc.jpg?ver=6");
  } else if (
    guerrier[nom].vie > 0 &&
    guerrier[nom].niveaux < 10 &&
    guerrier[nom].niveaux != 0
  ) {
    rich.setThumbnail(`${guerrier[nom].lien}`);
  } else if (guerrier[nom].vie > 0 && guerrier[nom].niveaux >= 10) {
    rich.setThumbnail(`${guerrier[nom].evolution}`);
  } else if (guerrier[nom].vie <= 0) {
    if (guerrier[nom].morgue == 1) {
      rich.setThumbnail("http://upload.wikimedia.org/wikipedia/commons/8/82/Tombe_poilu.jpg");
    } else {
      rich.setThumbnail("http://upload.wikimedia.org/wikipedia/commons/8/82/Tombe_poilu.jpg");
    }
  }
  rich.addField("type", `${guerrier[nom].type}`, true);
  if (guerrier[nom].sex == 1) {
    rich.addField("sexe",":man_dancing:",true);
  } else if (guerrier[nom].sex == 2) {
    rich.addField("sexe",":dancer:",true);
  }

  if (guerrier[nom].lieux == 0) {
    rich.addField("lieux",":thermometer:",true);
  } else if (guerrier[nom].lieux == 1) {
    rich.addField("lieux",":martial_arts_uniform: ",true);
  } else if (guerrier[nom].lieux == 2) {
    rich.addField("lieux",":walking:",true);
  } else if (guerrier[nom].lieux == 3) {
    rich.addField("lieux",":fork_knife_plate:",true);
  } else if (guerrier[nom].lieux == 4 || guerrier[nom].lieux == 5) {
    rich.addField("lieux",":skull_crossbones:",true);
  }  else if (guerrier[nom].lieux == 6) {
    rich.addField("lieux","  :crossed_swords: ",true);
  }

  for (var i = 1; i < guerrier[nom].objet[0]; i ++)
  {
    if (guerrier[nom].objet[i] == 1) {
      rich.addField(`objet ${i}`,":helmet_with_cross: ",true);
    } else if (guerrier[nom].objet[i] == 2) {
      rich.addField(`objet ${i}`,":mans_shoe:",true);
    } else if (guerrier[nom].objet[i] == 3) {
      rich.addField(`objet ${i}`,":dark_sunglasses:",true);
    } else {
      rich.addField(`objet ${i}`,":negative_squared_cross_mark: ",true);
    }
  }
  bot.channels.get(tamasalon.id).sendEmbed(rich);
}

function donner(guerrier, item, nom, message) {
  if (!guerrier[nom]) {
    message.channel.sendCode("asciidoc", "se guerrier n existe pas");
    return guerrier;
  }
  var maitre = message.author.username;
  if (!guerrier[maitre]) {
    message.channel.sendCode(
      "asciidoc",
      "vous n' ete pas encore enregistrer dans le jeux"
    );
    return guerrier;
  }
  if (item == "largepotion") {
    if (guerrier[maitre].inventaire[0] > 0) {
      guerrier[maitre].inventaire[0]--;
      guerrier[nom].vie += 1000;
      message.channel.sendCode("asciidoc", `${nom} a recue 1000 pv`);
    } else
      message.channel.sendCode("asciidoc", "vous n'avez pas de largepotion");
  } else if (item == "sucette") {
    if (guerrier[maitre].inventaire[1] > 0) {
      guerrier[maitre].inventaire[1]--;
      guerrier[nom].xp += 10;
      message.channel.sendCode("asciidoc", `${nom} a recue 10 xp`);
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de sucette");
  } else if (item == "hotdog") {
    if (guerrier[maitre].inventaire[2] > 0) {
      guerrier[maitre].inventaire[2]--;
      guerrier[nom].faim += 1000;
      guerrier[maitre].soif -= 500;
      message.channel.sendCode(
        "asciidoc",
        `${nom} a recue 1000 faim et 500 soif`
      );
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de hotdog");
  } else if (item == "nouriture") {
    if (guerrier[maitre].inventaire[3] > 0) {
      guerrier[maitre].inventaire[3]--;
      guerrier[nom].faim += 10000;
      message.channel.sendCode(
        "asciidoc",
        `${nom} c'est enpifrer et a recue 10000 faim`
      );
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de nouriture");
  } else if (item == "boisson") {
    if (guerrier[maitre].inventaire[4] > 0) {
      guerrier[maitre].inventaire[4]--;
      guerrier[nom].soif += 10000;
      message.channel.sendCode(
        "asciidoc",
        `${nom}c'est presque noyer dans son verre et a recu 10000 soif`
      );
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de boisson");
  } else if (item == "zap") {
    if (guerrier[maitre].inventaire[5] > 0) {
      if (guerrier[nom].lieux != 5) {
        guerrier[maitre].inventaire[5]--;
        guerrier[nom].lieux = 0;
        guerrier[nom].delay = 0;
        message.channel.sendCode("asciidoc", `${nom} a etait résusiter `);
      } else
        message.channel.sendCode(
          "asciidoc",
          "se guerrier et definitivement mort"
        );
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de zap");
  } else if (item == "pasteque") {
    if (guerrier[maitre].inventaire[6] > 0) {
      guerrier[maitre].inventaire[6]--;
      guerrier[nom].soif += 1000;
      guerrier[nom].faim += 250;
      message.channel.sendCode(
        "asciidoc",
        `${nom} a recue 1000 soif et 250 faim`
      );
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de pasteque");
  } else if (item == "potion") {
    if (guerrier[maitre].inventaire[7] > 0) {
      guerrier[maitre].inventaire[7]--;
      guerrier[nom].vie += 500;
      message.channel.sendCode("asciidoc", `${nom} a recue 500 pv`);
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de potion");
  } else if (item == "omelette") {
    if (guerrier[maitre].inventaire[8] > 0) {
      guerrier[maitre].inventaire[8]--;
      guerrier[nom].faim += 1000;
      guerrier[nom].soif += 250;
      message.channel.sendCode(
        "asciidoc",
        `${nom} a recue 1000 faim et 250 soif`
      );
    } else message.channel.sendCode("asciidoc", "vous n'avez pas de omelette");
  } else message.channel.sendCode("asciidoc", "objet invalide");
  return guerrier;
}
function choixclass(message) {
  if (message.content == "mage") {
    return 1;
  } else if (message.content == "assassin") {
    return 2;
  } else if (message.content == "paladin") {
    return 3;
  } else if (message.content == "archer") {
    return 4;
  }
  //  else if (message.content == "necromentien")
  //   {
  //     return 5; 
  //   }
  return 0;
}
function afficherenemi( attaque)
{
  let tamasalon = bot.channels.find("name", "the_guardian-s_war");
  var imageguerrier;
  if (attaque.niveaux <= 9) {
    imageguerrier = attaque.lien.lien;
  } else if (attaque.niveaux >= 10) {
    imageguerrier = attaque.lien.evo;
  }
  var rich = new Discord.RichEmbed; 
   rich.setColor(couleur(attaque.type));
  rich.addField("vie",attaque.vie);
  rich.addField("niveaux",attaque.niveaux);
  rich.addField("type",attaque.type);
  rich.setImage(imageguerrier);
  bot.channels.get(tamasalon.id).sendEmbed(rich);
}
function afficherattaque( guerrier) {
  let tamasalon = bot.channels.find("name", "the_guardian-s_war");
  var i;
  if (guerrier["val"].etatportaille == 2) {
    if (fin(guerrier) == false) {
      for (i = 0; i < guerrier["val"].nbattaque; i++) {
        if (guerrier[i]) {
          afficherenemi(guerrier[i]);
        }
      }
    } else if (fin(guerrier) == true) {
      for (i = 0; i < guerrier["val"].nbbosse; i++) {
        afficherenemi(guerrier[guerrier["val"].nbbosse + guerrier["val"].nbattaque - 1 + i]);
      }
    }
  } else {

    bot.channels.get(tamasalon.id).sendCode("asciidoc","il n y a pas d attaque en cour");
  }
}
function fin(guerrier) {
  var i;
  for (i = 0; i < guerrier["val"].nbattaque; i++) {
    if (guerrier[i]) return false;
  }
  return true;
}
function choixcibleattaque(guerrier){
   var fin = 0;
  var i = Math.floor(Math.random() * guerrier["val"].nb);
  while ((guerrier[guerrier['val'].nom[i]].lieux != 6 )&& (fin <= guerrier['val'].nb*100 )) {
    i = Math.floor(Math.random() * guerrier["val"].nb);
    fin ++;
    console.log(fin);
  }
  if(fin >= guerrier['val'].nb*100 )
  {
    return 'vide';
  }
  else 
  {
    return guerrier['val'].nom[i];
  }
}
function choixcible(guerrier) {
  var i = Math.floor(Math.random() * guerrier["val"].nbattaque);
  while (!guerrier[i]) {
    i = Math.floor(Math.random() * guerrier["val"].nbattaque);
  }
  return i;
}
function pointfaible(type){
  if (type == ":ocean:")
  {
    return ':earth_asia:';
  }
  else if (type == ":fire:")
  {
    return ':cloud:';
  }
  else if (type == ":earth_asia:")
  {
    return ':fire:';
  }
  else if (type == ":volcano:")
  {
    return ':ocean:';
  }
  else if (type == ":cloud:")
  {
    return ':cloud_tornado:';
  }
  else if (type == ":hourglass_flowing_sand:")
  {
    return ':cloud_tornado:';
  }
  else if (type == ":zap:")
  {
    return ':earth_asia:';
  }
}
function degacible(guerrier,nom,cible,salonguerrier,miss) {
  var dega = 0;
  if (cible != 'vide')
  {dega = 250 * guerrier[nom].niveaux;
    var type  = guerrier[nom].type; 
  var typecible = guerrier[cible].type; 
  if (type  == pointfaible(typecible))
  {
    dega  *= 2;
    bot.channels.get(salonguerrier.id).sendCode('asciidoc','bonus point faible (dega * 2)'); 
  }
  if (Math.floor(Math.random()*100) < miss){
    dega = 0;
    bot.channels.get(salonguerrier.id).sendCode('asciidoc',"miss");
  }
  if (guerrier[nom].maitre)
  {
    for (var i = 1 ; i < guerrier[nom].objet[0];i++)
  {
    if (guerrier[nom].objet[i] == 1)
    {
      dega * 2;
      bot.channels.get(salonguerrier.id).sendCode('asciidoc','bonus lunette (dega * 2)'); 
    }}
  }
  }
  return dega;
}
function inventaire(guerrier,author){
  var inventaireReff  = guerrier["val"].inventaire;
  var inventaire= guerrier[author.username].inventaire;
  var i , n = 0; 
  var inv = new Discord.RichEmbed();
  inv.setTitle(`inventaire de ${author.username}`);
  inv.setThumbnail(author.avatarURL);
  
  if (guerrier[author.username].classe == 1)inv.setColor(0x0006FF);
  else if (guerrier[author.username].classe == 2)inv.setColor(0x383838);
  else if (guerrier[author.username].classe == 3)inv.setColor(0xFFFF00);
  else if (guerrier[author.username].classe == 4)inv.setColor(0x00A327);
  else if (guerrier[author.username].classe == 5)inv.setColor(0x000101);
  else inv.setColor(0x383838);
  for (i = 0; i < maxinventaire ; i ++)
  {
    if (inventaire[i] != null)
    {
      if (inventaire[i] > 0)
      {
        inv.addField(`${inventaireReff[i]} : `, `${inventaire[i]}`,true);
        n++;
      }
    }
  }
  if (n == 0)
  {
    var rend =  Math.floor(Math.random() * 2)
    if  (rend== 0){inv.addField("vide",":middle_finger: cono");}
    else if (rend == 1){inv.addField("vide",":face_palm: "); }
    else if (rend == 2){inv.addField("vide",":expressionless: "); }
  }
  return inv; 
}
function pouvoir(message,guerrier){
  var numpou = message.content.split(' ').slice(2,3);
  var choix = message.content.split(' ').slice(3, 4);
  var classe = guerrier[message.author.username].classe;
  var pouvoir = {
    dega : 0,
    temps : 0,
    niveaux:0,
    element:0,
    etendut :0,
    buf : {
      type : 0,
      temps : 0,
    },
    maluse : {
      type : 0,
      temps : 0,
    }
  }
  if (classe == 1)
  {
    if (numpou == 1)
    {
      if (choix > 0 && choix <= 8)
      {
        pouvoir.element = choix; 
        pouvoir.dega = 500;
        guerrier[message.author.username].pouvoir[0]= pouvoir;
        message.channel.sendCode("asciidoc",`vous avez choisi magi elementaire comme pouvoir 1`);
        return guerrier;
      }
    }
    else if (numpou == 2 || numpou == 3)
    {
      if (choix > 0 && choix <=8)
      {
        pouvoir.element = choix;
        pouvoir.dega = 750; 
        guerrier[message.author.username].pouvoir[numpou-1] = pouvoir; 
        message.channel.sendCode("asciidoc",`vous avez choisi defence elementaire comme pouvoir${numpou}`);
        return guerrier;
      }
    }
    else if (numpou == 4)
    {
      if (choix == 1)
      {
         pouvoir.maluse.temps = 10; 
         pouvoir.maluse.type = 1; 
         guerrier[message.author.username].pouvoir[3] = pouvoir;
         message.channel.sendCode("asciidoc","vous avez choisi stun comme ultim");
         return guerrier;
      }
      else if (choix == 2)
      {
        pouvoir.buf.type = 2;
        guerrier[message.author.username].pouvoir[3] = pouvoir;
        message.channel.sendCode("asciidoc","vous avez choisi heal comme ultim");
        return guerrier;
      }
    }
  }
  else
  {
    message.channel.sendCode("asciidoc","vous n'avez pas de classe");
  }
  return guerrier;
}
/*function gestion personne*/
function creepersonne(personne, nom, info) {
  var newpersonne = {
    credit: 50,
    musique: [],
    nbmusique: 0,
    avatarURL: `${info.avatarURL}`,
    thewar: 0,
    date: jour
  };
  personne["val"].nom[personne["val"].nb] = nom;
  personne["val"].nb++;
  return newpersonne;
}
bot.on("message", message => {
  if (message.author.username != "mrjack"&&message.author.username !="Naruko")return;
  if (message.author.bot) return;
  let general = bot.channels.find("name", "le_complexe_des_astronaute");
  let salonguerrier = bot.channels.find("name", "the_guardian-s_war");
  var nom = message.author.username;
  /* gestion personne*/

  if (!personne[nom]) {
    personne[nom] = creepersonne(personne, nom, message.author);
    message.author.sendCode("asciidoc", "bienvenue sur le serveur si tu veux savoire se que je peut faire tu peut m envoyer /info pour savoir les commande");
  }
  if (personne[nom].date != jour && message.content == "bonjour")
  {
    personne[nom].date = jour;
    personne[nom].credit += 10;
    message.channel.sendCode("asciidoc",`connection journalier: ${nom} a gagner 10 credit`);
  }
  if (message.author.avatarURL != personne[nom].avatarURL)
    personne[nom].avatarURL = message.author.avatarURL;
  if (message.content == "profil") {
      var rich = new Discord.RichEmbed; 
      rich.setTitle(`profil de ${nom}`); 
      rich.setImage(message.author.avatarURL);
      rich.addField("richesse : ", `${personne[nom].credit} credit`);
      if (personne[nom].thewar > 0)
      {
        if (personne[nom].thewar < 6)
        {
          rich.addField('implication dans la guerre :','dans le tuto\n');
        }
        else
        {
          var nbitem = 0;
          for (var i = 0; i <= 8 ; i ++)
          {
            nbitem += guerrier[nom].inventaire[i];
          }
          rich.addField('implication dans la guerre : ',`dans le chapitre : ${personne[nom].thewar-5}\nvie : ${guerrier[nom].vie}\nniveaux : ${guerrier[nom].niveaux}\npossede ${nbitem} item`);
        }
      }
      else 
      {
        rich.addField('implication dans la guerre :','neutre\n');
      }
      message.channel.sendEmbed(rich);
  }


  /*guerrier */
  if (message.channel.type == "dm") {
    if (message.content == "/info")
    {
      message.channel.sendCode("asciidoc", "profil pour montrer ton profil\n/jeux pour avoir les info sur les jeux\ntout les commende contenant un '/' doivent etre envoyer en PRIVER");
    }
    if (message.content == "/jeux")
    {
      message.channel.sendCode("asciidoc", "pour commencer le jeux 'the gardian's wars' envoi 'the beginning of the war' a jarvis en PRIVER \nc'est tout pour le moment d'autre jeux sont a venir");
    }
    else if (message.content == "the beginning of the war" &&personne[nom].thewar == 0) {
      message.channel.sendCode(
        "asciidoc",
        `Il y a des milliers d'années de cela une guerre faisais rage entre les démons et les gardiens sur la planète Galifré `
      );
      message.channel.sendEmbed({
        image: {
          height: 30,
          width: 30,
          url:
            "https://i.skyrock.net/6333/79516333/pics/3162405166_1_8_c5ON6qLN.jpg"
        }
      }),
        message.channel.sendCode(
          "asciidoc",
          `Jusqu'au jour ou un maitre mage réussi à repoussé les démons a travers un portail placé a l’intérieur du ‘temple of the devil’, malheureusement il y laissa sa vie`
        );
      message.channel.sendEmbed({
        image: {
          height: 30,
          width: 30,
          url: "http://gameplay.tips/uploads/posts/2016-11/1480016099_ds3.jpg"
        }
      });
      message.channel.sendCode(
        "asciidoc",
        " Quelques années après sa mort les démons ont trouvé le moyen d’activer le portail pour rejoindre notre planète."
      );
      message.channel.sendEmbed({
        image: {
          width: 30,
          height: 30,
          url:
            "https://lh3.googleusercontent.com/-j09cTmhiNws/W8gw3lqJLeI/AAAAAAAAAf4/6LYKChg3tjYdz7sQicZjqgos3d6cLsk1wCJoC/w530-h298-n-rw/gplus9066141391053623441.png"
        }
      });
      message.channel.sendCode(
        "asciidoc",
        `Depuis ce jour les 'gardiens' se sont Installés prêt du portail pour empêcher les ennemies d’envahir Galifré. `
      );
      message.channel.sendEmbed({
        image: {
          width: 30,
          height: 30,
          url:
            "https://i.pinimg.com/originals/47/91/c1/4791c1edf46459b361a2b42f36c91a55.jpg"
        }
      });
      message.channel.sendCode(
        "asciidoc",
        'Votre mission si vous l’acceptez, est d’empêcher les démons de quitter le temple et ainsi protéger le village et la planète (pour accepter taper "accepter")'
      );
    } else if (message.content == "accepter" && personne[nom].thewar == 0) {
      if (!guerrier[nom]) {
        guerrier[nom] = creemaitre();
        guerrier["val"].maitre[guerrier["val"].nbmaitre] = nom;
        guerrier["val"].nbmaitre++;
        personne[nom].thewar = 1;
        if (!guerrier[nom]) {
          message.channel.sendCode(
            "asciidoc",
            "echec de la creation de votre inventaire 🤜👌"
          );
        } else {
          message.channel.sendCode(
            "asciidoc",
            "votre inventaire a etait cree 🎒"
          );
        }
      }
    } else if (
      (message.content == "mage" ||
        message.content == "assassin" ||
        message.content == "paladin" ||
        message.content == "archer" ||
        message.content == "necromentien") &&
      personne[nom].thewar == 2
    ) {
      if (choixclass(message) != 0)guerrier[nom].classe = choixclass(message);
      if (guerrier[nom].classe == 0 || !guerrier[nom].classe)message.channel.send("echec"); 
      else personne[nom].thewar = 3;
    } else if (message.content.startsWith("cree guerrier")) {
      var newguerrier = message.content.split(" ").slice(2, 3);

      if (!guerrier[newguerrier] && personne[nom].thewar == 4) {
        var lien = message.content.split(" ").slice(3, 4);
        var evo = message.content.split(" ").slice(4, 5);
        guerrier[newguerrier] = creeguerrier(nom, lien, evo);
        guerrier["val"].nom[guerrier["val"].nb] = newguerrier;
        guerrier["val"].nb++;
        personne[nom].thewar = 5;
        if (!guerrier[newguerrier]) {
          message.channel.sendCode(
            "asciidoc",
            "echec le guerrier n a pas etait cree 🖕"
          );
        } else {
          message.channel.sendCode(
            "asciidoc",
            "le rituel a etait effectuer avec succes 🙌🙌🙌🙌🙌🙌 votre guerrier est en incubation et va eclore d'ici peux"
          );
          afficherguerrier(newguerrier, guerrier);
        }
      } else if (guerrier[newguerrier]) {
        message.channel.sendCode("asciidoc", "ce guerrier existe deja");
      } else if (personne[nom].thewar != 4) {
        message.channel.sendCode(
          "asciidoc",
          "vous ne pouvais pas invoquer un guerrier "
        );
      }
    }
  }
  if (message.channel.name == "the_guardian-s_war") {
    if (message.content == "/help war") {
      if (Math.floor(Math.random() * 100) < 50) {
        message.channel.sendCode("asciidoc", "🖕 demerde toi 🖕");
      } else {
        message.channel.sendCode(
          "asciidoc",
          "'Gafficher' suivie du nom du guerrier\n\nnom du guerrier suivie de 'Ggo' suivie du lieux \n        infirmerie pour les soins \n        dojo pour l'xp\n        cantine pour nourrir\n        pied pour combatre pret de soi\n        portail pour défendre le portail\n\n'Gdonner ' 'nom de l'item' suivie du nom du guerrier\n\ninventaire affiche votre inventaire"
        );
      }
    } else if (message.content.startsWith("afficher")) {
      if (message.content.split(" ").slice(1, 2) == "portail") {
        var etat;
        var lien;

        if (guerrier["val"].etatportaille == 0) {
          etat = "fermer";
          lien =
            "https://lh3.googleusercontent.com/-Xzp-uGI47pU/W8gwpDoHZnI/AAAAAAAAAf4/6pXLs7eWXUY3KdcghMSsvEKzYjwgOUH8wCJoC/w530-h298-n-rw/gplus1423934598260745512.png";
        } else if (guerrier["val"].etatportaille == 1) {
          etat = "fermer";
          lien =
            "https://lh3.googleusercontent.com/-Xzp-uGI47pU/W8gwpDoHZnI/AAAAAAAAAf4/6pXLs7eWXUY3KdcghMSsvEKzYjwgOUH8wCJoC/w530-h298-n-rw/gplus1423934598260745512.png";
        } else if (guerrier["val"].etatportaille == 2) {
          etat = "ouvert";
          lien =
            "https://lh3.googleusercontent.com/-j09cTmhiNws/W8gw3lqJLeI/AAAAAAAAAf4/6LYKChg3tjYdz7sQicZjqgos3d6cLsk1wCJoC/w530-h298-n-rw/gplus9066141391053623441.png";
        }
        message.channel.sendEmbed({
          title: `${etat}`,
          image: {
            width: 30,
            height: 30,
            url: `${lien}`
          }
        });
      } else if (message.content.split(" ").slice(1, 2) == "attaque") {
        afficherattaque(guerrier);
      } 
    }
    else if (message.content.startsWith("Gafficher")){
      var nomguerrier = message.content.split(" ").splice(1, 2);
      afficherguerrier(nomguerrier, guerrier);
    }
    else if (message.content.split(" ").slice(1, 2) == "Ggo") {
      var lieux = message.content.split(" ").slice(2, 3);
      var guerriernom = message.content.split(" ").slice(0, 1);
      if (!guerrier[guerriernom]) {
        message.channel.sendCode("asciidoc", "ce tama n existe pas");
      } else {
        guerrier = transfere(lieux, guerrier, guerriernom);
      }
    } else if (message.content.startsWith("donner")) {
      guerrier = donner(
        guerrier,
        message.content.split(" ").slice(1, 2),
        message.content.split(" ").slice(3, 4),
        message
      );
    } else if (message.content == "inventaire") {
      message.channel.sendEmbed(inventaire(guerrier,message.author));
    } else if (message.content.startsWith("choisir pouvoir")){
      guerrier = pouvoir(message,guerrier);
    }
  }

  fs.writeFile("./memoire/guerrier.json", JSON.stringify(guerrier), err => {
    if (err) console.error(err);
  });
  fs.writeFile("./memoire/personne.json", JSON.stringify(personne), err => {
    if (err) console.error(err);
  });
});

bot.login("Mjg2OTMyNjg0NDQ4NTk1OTkw.C5n8WA.e2Z4xGWJJHs4_vOoxvTQJQ7KoVU");
