/*
    Titre: ShuttleMatch - Script Principal
    Description: Script JavaScript pour l'application web ShuttleMatch. Gère la logique de l'interface utilisateur, les événements et les données des matchs.
    Auteur: NAYERI POOR Ali
    GitHub: https://github.com/Alialloz
*/

// Déclaration des variables globales
var listeJoueurs = [];
var listeMatch2v2 = [];
var listeMatch1v1 = [];

var joueursTerrains1 = [];
var joueursTerrains2 = [];
var joueursTerrains3 = [];

var nombreDeJoueurs = 0;
var nombreDeTerrains = 0;

var courts = [];
var test = 0 ;
var iterationMatch = 0;

// Crée des champs de saisie pour entrer les noms des joueurs
function createPlayerInputs() {
     // Lire le nombre de joueurs depuis l'input
     nombreDeJoueurs = parseInt(document.getElementById("playerCount").value);
     // Lire le nombre de terrains depuis l'input
     nombreDeTerrains = parseInt(document.getElementById("courtCount").value);
     console.log(nombreDeJoueurs, nombreDeTerrains)
    var playerCount = document.getElementById("playerCount").value;
    var playerNamesContainer = document.getElementById("playerNames");
    playerNamesContainer.innerHTML = "";

    for (var i = 0; i < playerCount; i++) {
        playerNamesContainer.innerHTML += '<div class="player-name-input"><label for="player' + i + '"> Joueur ' + (i + 1) + ':</label><input type="text" id="player' + i + '"></div>';
    }
    playerNamesContainer.innerHTML += '<button onclick="collectPlayerNames()">Soumettre les noms</button>';

}
// Enleve les champs de saisie pour l'entrée des joueurs
function removePlayerInputForm() {
    var playerNamesContainer = document.getElementById("playerNames");
    playerNamesContainer.innerHTML = ""; // Effacer le contenu du conteneur
}
// Collecte et traite les noms des joueurs soumis
function collectPlayerNames() {
    var playerCount = document.getElementById("playerCount").value;
    var playerNames = [];
    for (var i = 0; i < playerCount; i++) {
        var playerName = document.getElementById("player" + i).value;
        if (playerName !== '') {
            playerNames.push(playerName);
        }
    }
    // Créer une copie du tableau pour l'assignation des terrains
    let playersForAssignment = [...playerNames];
    listeJoueurs = [...playerNames];

    genererMatch(listeJoueurs, nombreDeTerrains);
    lancerProchainsMatchs();

    courts = [joueursTerrains1,joueursTerrains2,joueursTerrains3];

    console.log("Premier court  : " + courts);
    

    console.log("Toutes les combinaisons possibles :");
    console.log("1v1:");
    console.log(listeMatch1v1);
    console.log("2v2:");
    console.log(listeMatch2v2);


    // Afficher les joueurs sur les terrains
    while (test==0){
        try {
            displayCourts(courts);
            test=1;
          } catch(error){
            shuffleArray(listeMatch1v1);
            shuffleArray(listeMatch2v2);
            console.log('errrrrrr1');
        }
    }
    test=0; 
    displayCourts(courts);
    // Enleve les inputs des noms de joueurs
    removePlayerInputForm();
}

function displayCourts(courts) {
    // Itérer sur chaque terrain
    courts.forEach((players, courtIndex) => {
        // Identifier le terrain dans le DOM par son indice
        const courtId = `court${courtIndex + 1}`;
        const courtElement = document.getElementById(courtId);

        // Vérifier si le terrain a été trouvé
        if (courtElement) {
            if (players.length > 0) {
                // Nettoyer le contenu actuel et ajouter l'en-tête du terrain
                courtElement.innerHTML = `<h2>Terrain ${courtIndex + 1}</h2><div class="net"></div>`;

                // Créer des éléments pour les côtés du terrain
                const side1 = document.createElement('div');
                side1.className = 'side';
                const side2 = document.createElement('div');
                side2.className = 'side';

                players.forEach((player, index) => {
                    // Créer un conteneur pour le joueur et l'image
                    const playerDiv = document.createElement('div');
                    playerDiv.className = 'player';

                    // Choisir l'image en fonction de la position du joueur
                    const playerImage = document.createElement('img');
                    playerImage.src = index % 2 === 0 ? './images/tennisman.png' : './images/tennisman.png';
                    playerImage.alt = 'Photo de ' + player;
                    playerDiv.appendChild(playerImage);

                    // Ajouter le nom du joueur
                    const playerName = document.createElement('span');
                    playerName.textContent = player;
                    playerDiv.appendChild(playerName);

                    // Répartir les joueurs sur les deux côtés du terrain
                    if (players.length == 2){
                        if (index == 1) {
                            side2.appendChild(playerDiv);
                        } else {
                            side1.appendChild(playerDiv);
                        }
                    } else {
                        if (index < 2 ) {
                            side1.appendChild(playerDiv);
                        } else {
                            side2.appendChild(playerDiv);
                        }
                    }
                });

                // Ajouter les côtés au terrain
                courtElement.insertBefore(side1, courtElement.childNodes[1]); // Avant le filet
                courtElement.appendChild(side2);
            } else {
                // Si pas de joueurs, nettoyer le contenu du terrain
                courtElement.innerHTML = '';
            }
        }
    });
}

//Implementation pour le bouton 'Jouer prochain match'
function jouer() {
    let compteur = 0;
    while (test==0){
        
        try {
            shuffleArray(listeMatch1v1);
            shuffleArray(listeMatch2v2);
            lancerProchainsMatchs();
            courts = [joueursTerrains1,joueursTerrains2,joueursTerrains3];
            displayCourts(courts);
            test=1;
          } catch(error){
            shuffleArray(listeMatch1v1);
            shuffleArray(listeMatch2v2);
            console.log('errrrrrr2');
            console.log('terrain 1   apr err '+ joueursTerrains1 );
            if(compteur < 1){
                restaurerTerrains();
            }
            console.log('Liste match  apr err '+ listeMatch2v2 );
        }
    }
    test=0; 
    console.log('Le bouton a été cliqué !');
}
function restaurerTerrains() {
    if (Array.isArray(joueursTerrains1)) {
        if (joueursTerrains1.length === 2) {
            listeMatch1v1.push(joueursTerrains1);
        } else if (joueursTerrains1.length === 4) {
            listeMatch2v2.push(joueursTerrains1);
        }
    }

    if (Array.isArray(joueursTerrains2)) {
        if (joueursTerrains2.length === 2) {
            listeMatch1v1.push(joueursTerrains2);
        } else if (joueursTerrains2.length === 4) {
            listeMatch2v2.push(joueursTerrains2);
        }
    }

    if (Array.isArray(joueursTerrains3)) {
        if (joueursTerrains3.length === 2) {
            listeMatch1v1.push(joueursTerrains3);
        } else if (joueursTerrains3.length === 4) {
            listeMatch2v2.push(joueursTerrains3);
        }
    }
}

function generateMatchCombinations(playerNames) {
    const combinations = [];
    const numPlayers = playerNames.length;

    if (numPlayers % 2 !== 0) {
        playerNames.push(null);
    }

    const playersPerRound = numPlayers / 2;

    for (let i = 0; i < numPlayers - 1; i++) {
        const roundCombos = [];

        for (let j = 0; j < playersPerRound; j++) {
            const player1 = playerNames[j];
            const player2 = playerNames[numPlayers - 1 - j];

            if (player1 && player2) {
                roundCombos.push([player1, player2]);
            }
        }

        combinations.push(roundCombos);

        const firstPlayer = playerNames.splice(1, 0, playerNames.pop());
    }

    return combinations;
}



// Assignation des match en fonction du nombre de joueurs et du nombre de terrain.
function genererMatch2(players, nombreDeTerrains) {
    let nbJoueurs = players.length;
    let listePly = players; 
    let combinaisonss = generateMatchCombinations(listePly);
    let indice = 0; 
    while(indice<combinaisonss.length){
        if (nombreDeTerrains == 1){
            if(nbJoueurs >= 4){
                // Generer liste match 2v2 avec liste players
                for(var i= 0; i < x.length; i=i+2)
                {
                    listeMatch2v2.push(combinaisonss[indice][i].concat(combinaisonss[indice][i]));
                }   
            }else {
                // Generer liste match 1v1 avec liste players
                for(var i= 0; i < x.length; i=i+1)
                {
                    listeMatch1v1.push(combinaisonss[indice][i]);
                }   
            }
    
        }else if (nombreDeTerrains == 2){
            if(nbJoueurs >= 8){
                // Generer liste match 2v2 avec liste players pour le terrain 1 et 2
                for(var i= 0; i < x.length; i=i+2)
                {
                    listeMatch2v2.push(combinaisonss[indice][i].concat(combinaisonss[indice][i]));
                }   
            }else if (nbJoueurs >= 6){
                // Generer liste match 2v2 avec liste players pour le terrain 1 et liste match 1v1 pour le terrain 2
                listeMatch2v2.push(combinaisonss[indice][0].concat(combinaisonss[indice][1]));
                listeMatch1v1.push(combinaisonss[indice][2]);
            }else if (nbJoueurs >= 4){
                // Generer liste match 1v1 avec liste players pour le terrain 1 et 2
                for(var i= 0; i < x.length; i=i+1)
                {
                    listeMatch1v1.push(combinaisonss[indice][i]);
                }   
            }else {
                // Generer un message d'erreur : joueurs insuffisants pour 2 terrains, pour 2 terrains il vous faut au moins 4 joueurs
            }
        }else if (nombreDeTerrains == 3){
            if(nbJoueurs == 12){
                // Generer liste match 2v2 avec liste players pour le terrain 1, 2 et 3
                for(var i= 0; i < x.length; i=i+2)
                {
                    listeMatch2v2.push(combinaisonss[indice][i].concat(combinaisonss[indice][i]));
                }   
            }else if (nbJoueurs >= 10){
                // Generer liste match 2v2 avec liste players pour le terrain 1 et 2 liste match 1v1 pour le terrain 3
                listeMatch2v2.push(combinaisonss[indice][0].concat(combinaisonss[indice][1]));
                listeMatch2v2.push(combinaisonss[indice][2].concat(combinaisonss[indice][3]));
                listeMatch1v1.push(combinaisonss[indice][4]);
            }else if (nbJoueurs >= 8){
                // Generer liste match 2v2 avec liste players pour le terrain 1 et  une liste match 1v1 pour le terrain 2 et 3
                listeMatch2v2.push(combinaisonss[indice][0].concat(combinaisonss[indice][1]));
                listeMatch1v1.push(combinaisonss[indice][2]);
                listeMatch1v1.push(combinaisonss[indice][3]);
            }else if (nbJoueurs >= 6){
                // Generer liste match 1v1 avec liste players pour le terrain 1 2 et 3
                for(var i= 0; i < x.length; i=i+1)
                {
                    listeMatch1v1.push(combinaisonss[indice][i]);
                }   
            }else {
                // Generer un message d'erreur : joueurs insuffisants pour 2 terrains, pour 3 terrains il vous faut au moins 6 joueurs
            }
        }

        indice++;
    }
    if (nombreDeTerrains == 1){
        if(nbJoueurs >= 4){
            // Generer liste match 2v2 avec liste players
            listeMatch2v2 = genererListeMatch2v2(players);
        }else {
            // Generer liste match 1v1 avec liste players
            listeMatch1v1 = genererListeMatch1v1(players);
        }

    }else if (nombreDeTerrains == 2){
        if(nbJoueurs >= 8){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et 2
            listeMatch2v2 = genererListeMatch2v2(players);
        }else if (nbJoueurs >= 6){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et liste match 1v1 pour le terrain 2
            listeMatch2v2 = genererListeMatch2v2(players);
            listeMatch1v1 = genererListeMatch1v1(players);
        }else if (nbJoueurs >= 4){
            // Generer liste match 1v1 avec liste players pour le terrain 1 et 2
            listeMatch1v1 = genererListeMatch1v1(players);
        }else {
            // Generer un message d'erreur : joueurs insuffisants pour 2 terrains, pour 2 terrains il vous faut au moins 4 joueurs
        }
    }else if (nombreDeTerrains == 3){
        if(nbJoueurs == 12){
            // Generer liste match 2v2 avec liste players pour le terrain 1, 2 et 3
            listeMatch2v2 = genererListeMatch2v2(players);
        }else if (nbJoueurs >= 10){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et 2 liste match 1v1 pour le terrain 3
            listeMatch2v2 = genererListeMatch2v2(players);
            listeMatch1v1 = genererListeMatch1v1(players);
        }else if (nbJoueurs >= 8){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et  une liste match 1v1 pour le terrain 2 et 3
            listeMatch2v2 = genererListeMatch2v2(players);
            listeMatch1v1 = genererListeMatch1v1(players);
        }else if (nbJoueurs >= 6){
            // Generer liste match 1v1 avec liste players pour le terrain 1 2 et 3
            listeMatch1v1 = genererListeMatch1v1(players);
        }else {
            // Generer un message d'erreur : joueurs insuffisants pour 2 terrains, pour 3 terrains il vous faut au moins 6 joueurs
        }
    }
}
// Assignation des match en fonction du nombre de joueurs et du nombre de terrain.
function genererMatch(players, nombreDeTerrains) {
    let nbJoueurs = players.length;

    if (nombreDeTerrains == 1){
        if(nbJoueurs >= 4){
            // Generer liste match 2v2 avec liste players
            listeMatch2v2 = genererListeMatch2v2(players);
        }else {
            // Generer liste match 1v1 avec liste players
            listeMatch1v1 = genererListeMatch1v1(players);
        }

    }else if (nombreDeTerrains == 2){
        if(nbJoueurs >= 8){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et 2
            listeMatch2v2 = genererListeMatch2v2(players);
        }else if (nbJoueurs >= 6){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et liste match 1v1 pour le terrain 2
            listeMatch2v2 = genererListeMatch2v2(players);
            listeMatch1v1 = genererListeMatch1v1(players);
        }else if (nbJoueurs >= 4){
            // Generer liste match 1v1 avec liste players pour le terrain 1 et 2
            listeMatch1v1 = genererListeMatch1v1(players);
        }else {
            // Generer un message d'erreur : joueurs insuffisants pour 2 terrains, pour 2 terrains il vous faut au moins 4 joueurs
        }
    }else if (nombreDeTerrains == 3){
        if(nbJoueurs == 12){
            // Generer liste match 2v2 avec liste players pour le terrain 1, 2 et 3
            listeMatch2v2 = genererListeMatch2v2(players);
        }else if (nbJoueurs >= 10){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et 2 liste match 1v1 pour le terrain 3
            listeMatch2v2 = genererListeMatch2v2(players);
            listeMatch1v1 = genererListeMatch1v1(players);
        }else if (nbJoueurs >= 8){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et  une liste match 1v1 pour le terrain 2 et 3
            listeMatch2v2 = genererListeMatch2v2(players);
            listeMatch1v1 = genererListeMatch1v1(players);
        }else if (nbJoueurs >= 6){
            // Generer liste match 1v1 avec liste players pour le terrain 1 2 et 3
            listeMatch1v1 = genererListeMatch1v1(players);
        }else {
            // Generer un message d'erreur : joueurs insuffisants pour 2 terrains, pour 3 terrains il vous faut au moins 6 joueurs
        }
    }
}
/**
 * Je te commente un peu plus en detail cette fonction pour que tu puisse bien la comprendre
 * Cherche la première liste dans 'listeMatch' qui ne contient aucun élément présent dans 'listeJoueursOccupes'.
 *
 * @param {Array<Array<string>>} listeMatch - Une liste de listes, où chaque sous-liste contient des chaînes de caractères.
 * @param {Array<string>} listeJoueursOccupes - Une liste de chaînes de caractères représentant des joueurs occupés.
 * @return {number} L'indice de la première liste de 'listeMatch' ne contenant aucun élément de 'listeJoueursOccupes',
 *                  ou -1 si aucune liste ne correspond à ce critère.
 */
function notIncluded(listeMatch, listeJoueursOccupes) {
    for (let i = 0; i < listeMatch.length; i++) {
        let match = listeMatch[i];
        let matchInclutJoueurOccupe = match.some(joueur => listeJoueursOccupes.includes(joueur));
        if (!matchInclutJoueurOccupe) {
            return i;
        }
    }
    return -1; // Retourne -1 si aucune liste ne répond aux critères
}
function lancerProchainsMatchs(){
    let nbJoueurs = listeJoueurs.length;
    let joueursOccupes = [];
    joueursTerrains1 = [];
    joueursTerrains2 = [];
    joueursTerrains3 = [];

    console.log('Liste match  '+ listeMatch2v2 );
    if (nombreDeTerrains == 1){
        if(nbJoueurs >= 4){
            // Generer liste match 2v2 avec liste players
            if (listeMatch2v2.length > 0) {
                joueursTerrains1 = listeMatch2v2.shift();
            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }
        }else {
            // Generer liste match 1v1 avec liste players
            if (listeMatch1v1.length > 0) {
                joueursTerrains1 = listeMatch1v1.shift();
            } else {
                afficherMessageFin("Aucun match 1v1 disponible");
            }
        }

    }else if (nombreDeTerrains == 2){
        if(nbJoueurs >= 8){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et 2
            if (listeMatch2v2.length > 0) {
                joueursTerrains1 = listeMatch2v2.shift();
                joueursOccupes = joueursTerrains1 ;
            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }

            if (listeMatch2v2.length > 0) {
                joueursTerrains2 = listeMatch2v2[(notIncluded(listeMatch2v2,joueursOccupes))];
                listeMatch2v2.splice((notIncluded(listeMatch2v2,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains2);
            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }


        }else if (nbJoueurs >= 6){
          // Generer liste match 2v2 avec liste players pour le terrain 1 et  une liste match 1v1 pour le terrain 2 et 3
          if (listeMatch2v2.length > 0) {
              joueursTerrains1 = listeMatch2v2.shift();
            //   if (iterationMatch == 0){
            //     joueursTerrains1 = listeMatch2v2[0];
            //   }
              joueursOccupes = joueursTerrains1 ;

              joueursTerrains2 = listeMatch1v1[(notIncluded(listeMatch1v1,joueursOccupes))];
              listeMatch1v1.splice((notIncluded(listeMatch1v1,joueursOccupes)), 1);
              listeMatch1v1.push(joueursTerrains2);
              joueursOccupes = joueursOccupes.concat(joueursTerrains2);
          } else {
              afficherMessageFin("Aucun match 2v2 disponible");
          }
         
        }else if (nbJoueurs >= 4){
            // Generer liste match 1v1 avec liste players pour le terrain 1 et 2
            if (listeMatch1v1.length > 0) {
                joueursTerrains1 = listeMatch1v1.shift();
                joueursOccupes = joueursTerrains1 ;
            } else {
                afficherMessageFin("Aucun match 1v1 disponible");
            }
            if (listeMatch1v1.length > 0) {
                joueursTerrains2 = listeMatch1v1[(notIncluded(listeMatch1v1,joueursOccupes))];
                listeMatch1v1.splice((notIncluded(listeMatch1v1,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains2);
            } else {
                afficherMessageFin("Aucun match 1v1 disponible");
            }

        }else {
            afficherMessageErreur("Nombre de terrains non supporté");
        }
    }else if (nombreDeTerrains == 3){
        if(nbJoueurs == 12){
            // Genere liste match 2v2 avec liste players pour le terrain 1, 2 et 3
            if (listeMatch2v2.length > 0) {
                joueursTerrains1 = listeMatch2v2.shift();
                joueursOccupes = joueursTerrains1 ;
            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }
            console.log('Joueurs oqp 1 : ' + joueursOccupes);
            if (listeMatch2v2.length > 0) {
                joueursTerrains2 = listeMatch2v2[(notIncluded(listeMatch2v2,joueursOccupes))];
                listeMatch2v2.splice((notIncluded(listeMatch2v2,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains2);
            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }
            console.log('Joueurs oqp 2  : ' + joueursOccupes);

            if (listeMatch2v2.length > 0) {
                joueursTerrains3 = listeMatch2v2[(notIncluded(listeMatch2v2,joueursOccupes))];
                listeMatch2v2.splice((notIncluded(listeMatch2v2,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains3);
            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }
        }else if (nbJoueurs >= 10){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et 2 liste match 1v1 pour le terrain 3
            let fini = false;

            if (listeMatch2v2.length > 0) {
                if (listeMatch2v2.length == 0) {
                    console.log('FINIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
                }
                joueursTerrains1 = listeMatch2v2.shift();
                joueursOccupes = joueursTerrains1 ;
            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }
            if (listeMatch2v2.length > 0) {
                joueursTerrains2 = listeMatch2v2[(notIncluded(listeMatch2v2,joueursOccupes))];
                listeMatch2v2.splice((notIncluded(listeMatch2v2,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains2);
                joueursTerrains3 = listeMatch1v1[(notIncluded(listeMatch1v1,joueursOccupes))];
                listeMatch1v1.splice((notIncluded(listeMatch1v1,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains3);
                listeMatch1v1.push(joueursTerrains3);

            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }
           
        }else if (nbJoueurs >= 8){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et  une liste match 1v1 pour le terrain 2 et 3
            let fini = false;
            if (listeMatch2v2.length > 0) {
                joueursTerrains1 = listeMatch2v2.shift();
                joueursOccupes = joueursTerrains1 ;
            } else {
                afficherMessageFin("Aucun match 2v2 disponible");
            }
            if (listeMatch1v1.length > 0) {
                joueursTerrains2 = listeMatch1v1[(notIncluded(listeMatch1v1,joueursOccupes))];
                listeMatch1v1.splice((notIncluded(listeMatch1v1,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains2);
            } else {
                afficherMessageFin("Aucun match disponible");
            }
            if (listeMatch1v1.length > 0) {
                joueursTerrains3 = listeMatch1v1[(notIncluded(listeMatch1v1,joueursOccupes))];
                listeMatch1v1.splice((notIncluded(listeMatch1v1,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains3);
            } else {
                afficherMessageFin("Aucun match disponible");
            }
        }else if (nbJoueurs >= 6){
            // Generer liste match 1v1 avec liste players pour le terrain 1 2 et 3
            if (listeMatch1v1.length > 0) {
                joueursTerrains1 = listeMatch1v1.shift();
                joueursOccupes = joueursTerrains1 ;
            } else {
                afficherMessageFin("Aucun match disponible");
            }
            if (listeMatch1v1.length > 0) {
                joueursTerrains2 = listeMatch1v1[(notIncluded(listeMatch1v1,joueursOccupes))];
                listeMatch1v1.splice((notIncluded(listeMatch1v1,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains2);
            } else {
                afficherMessageFin("Aucun match disponible");
            }
            if (listeMatch1v1.length > 0) {
                joueursTerrains3 = listeMatch1v1[(notIncluded(listeMatch1v1,joueursOccupes))];
                listeMatch1v1.splice((notIncluded(listeMatch1v1,joueursOccupes)), 1);
                joueursOccupes = joueursOccupes.concat(joueursTerrains3);
            } else {
                afficherMessageFin("Aucun match disponible");
            }
        }else {
            afficherMessageErreur("Nombre de terrains non supporté");
        }
    }
    console.log("console log"+joueursOccupes)
    console.log("Joueurs Terrain 1: "+joueursTerrains1)
    console.log("Joueurs Terrain 2: "+joueursTerrains2)
    console.log("Joueurs Terrain 3: "+joueursTerrains3)
    console.log("len terrain 2 "+joueursTerrains1[0])

    iterationMatch ++ ;

}
function getCombinations(arr, size) {
    let results = [];

    function combine(arr, temp, start) {
        if (temp.length === size) {
            results.push(temp.slice());
            return;
        }
        for (let i = start; i < arr.length; i++) {
            temp.push(arr[i]);
            combine(arr, temp, i + 1);
            temp.pop();
        }
    }

    combine(arr, [], 0);
    return results;
}
// Genere une liste de match 2v2 sans répétitions de matchs
// Un match est représenté par une liste des 4 joueurs participant au match, les 2 premiers de cette liste font partie de l'équipe 1 et les 2 derniers de cette liste font partie de l'équipe 2
function genererListeMatch2v2(liste) {
    let combinaisons = [];
    let pairesDejaJouees = new Set();

    for (let i = 0; i < liste.length; i++) {
        for (let j = i + 1; j < liste.length; j++) {
            let equipeA = [liste[i], liste[j]].sort().join("-");

            for (let k = 0; k < liste.length; k++) {
                if (k == i || k == j) continue;
                for (let l = k + 1; l < liste.length; l++) {
                    if (l == i || l == j) continue;
                    
                    let equipeB = [liste[k], liste[l]].sort().join("-");
                    if (!pairesDejaJouees.has(equipeA) && !pairesDejaJouees.has(equipeB)) {
                        combinaisons.push([liste[i], liste[j], liste[k], liste[l]]);
                        pairesDejaJouees.add(equipeA);
                        pairesDejaJouees.add(equipeB);
                    }
                }
            }
        }
    }
    return combinaisons;
}
// Genere une liste de match 1v1 sans répétitions de matchs
// Un match est représenté par une liste de 2 joueurs participant au match, le premier fait partie de l'équipe 1 et le deuxieme fait partie de l'équipe 2
function genererListeMatch1v1(liste) {
    let combinaisons = [];
    for (let i = 0; i < liste.length; i++) {
        for (let j = i + 1; j < liste.length; j++) {
            combinaisons.push([liste[i], liste[j]]);
        }
    }
    return combinaisons;
}
// Mélange aléatoirement un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Choisir un élément aléatoire avant l'élément courant
        let j = Math.floor(Math.random() * (i + 1));

        // Échanger l'élément courant avec l'élément aléatoire choisi
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}
function afficherMessageFin(message) {
    console.log(message);
    // Relancer l'index après 10 secondes
    // setTimeout(function() {
    //     location.reload();
    // }, 10000);
}
function afficherMessageErreur(message) {
    console.log(message);
    // Autres actions pour gérer l'erreur
}
