/* 
    Titre: ShuttleMatch - Script Principal
    Description: Script JavaScript pour l'application web ShuttleMatch. Gère la logique de l'interface utilisateur, les événements et les données des matchs.
    Auteur: NAYERI POOR Ali
    GitHub: https://github.com/Alialloz
*/

var listeJoueurs = [];
var listeMatch2v2 = [];
var listeMatch1v1 = [];



// Crée des champs de saisie pour entrer les noms des joueurs
function createPlayerInputs() {
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

    // Assigner les joueurs aux terrains
    let courts = assignPlayersToCourts(playersForAssignment);
    // Enleve les inputs des noms de joueurs
    removePlayerInputForm();
    // Afficher les joueurs sur les terrains
    displayCourts(courts);

    // Afficher les matchs en attente avec la liste originale
    displayNextMatches(playerNames);
}

// Affiche les joueurs sur les terrains
function displayCourts(courts) {
    // Itérer sur chaque terrain et mettre à jour l'affichage
    for (const [courtId, players] of Object.entries(courts)) {
        // Trouver le conteneur du terrain dans le DOM
        const courtElement = document.getElementById(courtId);

        // Vérifier si le terrain a été trouvé
        if (courtElement) {
            // Nettoyer le contenu actuel
            courtElement.innerHTML = `<h2>${courtId.charAt(0).toUpperCase() + courtId.slice(1)}</h2><div class="net"></div>`;

            // Créer des éléments pour les joueurs
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
                playerImage.src = index % 2 === 0 ? './images/joueur1.png' : './images/joueur2.png'; 
                playerImage.alt = 'Photo de ' + player; 
                playerDiv.appendChild(playerImage);

                // Ajouter le nom du joueur
                const playerName = document.createElement('span');
                playerName.textContent = player;
                playerDiv.appendChild(playerName);

                // Répartir les joueurs sur les deux côtés du terrain
                if (index % 2 === 0) {
                    side1.appendChild(playerDiv);
                } else {
                    side2.appendChild(playerDiv);
                }
            });

            // Ajouter les côtés au terrain
            courtElement.insertBefore(side1, courtElement.childNodes[1]); // Avant le filet
            courtElement.appendChild(side2);
        }
    }
}



// Assignation des match en fonction du nombre de joueurs et du nombre de terrain. 
function genererMatch(players, nbTerrains) {
    let nbJoueurs = players.length;
  
    if (nbTerrains == 1){
        if(nbJoueurs >= 4){
            // Generer liste match 2v2 avec liste players
            listeMatch2v2 = genererListeMatch2v2(players);
        }else {
            // Generer liste match 1v1 avec liste players
            listeMatch1v1 = genererListeMatch1v1(players);
        }

    }else if (nbTerrains == 2){
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
    }else if (nbTerrains == 3){
        if(nbJoueurs == 12){
            // Generer liste match 2v2 avec liste players pour le terrain 1, 2 et 3
            listeMatch2v2 = genererListeMatch2v2(players);
        }else if (nbJoueurs >= 10){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et 2 liste match 1v1 pour le terrain 3
            listeMatch2v2 = genererListeMatch2v2(players);
            listeMatch1v1 = genererListeMatch1v1(players);
        }else if (nbJoueurs >= 8){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et  2
            listeMatch2v2 = genererListeMatch2v2(players);
        }else if (nbJoueurs >= 6){
            // Generer liste match 2v2 avec liste players pour le terrain 1 et liste match 1v1 pour le terrain 2
            listeMatch2v2 = genererListeMatch2v2(players);
            listeMatch1v1 = genererListeMatch1v1(players);
        }else {
            // Generer un message d'erreur : joueurs insuffisants pour 2 terrains, pour 3 terrains il vous faut au moins 6 joueurs
        }
    }

    let listesMatchs = {
        listeMatch2v2,
        listeMatch1v1
    };
}

// Genere une liste de match 2v2 sans répétitions de matchs 
// Un match est représenté par une liste des 4 joueurs participant au match, les 2 premiers de cette liste font partie de l'équipe 1 et les 2 derniers de cette liste font partie de l'équipe 2
function genererListeMatch2v2(listeJoueurs) {
}
// Genere une liste de match 1v1 sans répétitions de matchs 
// Un match est représenté par une liste de 2 joueurs participant au match, le premier fait partie de l'équipe 1 et le deuxieme fait partie de l'équipe 2
function genererListeMatch1v1(listeJoueurs) {
}

// Mélange aléatoirement un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Générer un index aléatoire inférieur à i
        const j = Math.floor(Math.random() * (i + 1));

        // Échanger les éléments array[i] et array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
}


