/* 
    Titre: ShuttleMatch - Script Principal
    Description: Script JavaScript pour l'application web ShuttleMatch. Gère la logique de l'interface utilisateur, les événements et les données des matchs.
    Auteur: NAYERI POOR Ali
    GitHub: https://github.com/Alialloz
*/

var listeJoueurs = [];

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



// Assignation des joueurs aux terrains en fonction de leur nombre
function assignPlayersToCourts(players) {
    let courts = {
        court1: [],
        court2: [],
        court3: []
    };

    // Tant qu'il y a des joueurs non assignés
    while (players.length > 0) {
        if (players.length >= 6) {
            // Si assez de joueurs pour 3 matchs 2v2
            courts.court1.push(...players.splice(0, 4));
            courts.court2.push(...players.splice(0, 4));
            courts.court3.push(...players.splice(0, 2));
        }else if (players.length === 5) {
            // Un match 2v2 et un match 2v1
            courts.court1.push(...players.splice(0, 2));
            courts.court2.push(...players.splice(0, 3));
        } else if (players.length === 4) {
            // Deux matchs 2v2
            courts.court1.push(...players.splice(0, 2));
            courts.court2.push(...players.splice(0, 2));
        } else if (players.length === 3) {
            // Un match 2v1
            courts.court1.push(...players.splice(0, 2));
            courts.court3.push(players.splice(0, 1)[0]);
        } else if (players.length === 2) {
            // Un match 1v1
            courts.court1.push(...players.splice(0, 2));
        } else {
            // Un joueur seul (pas idéal, mais assigné)
            courts.court1.push(players.splice(0, 1)[0]);
        }
    }

    return courts;
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

// Affiche la liste des prochains matchs
function displayNextMatches(players) {
    if (players.length === 0) {
        const matchList = document.querySelector('.match-list');
        matchList.innerHTML = '<li>Pas de futurs matchs</li>';
    } else {
        shuffleArray(players);
        listeJoueurs = [...players];
        let courts = assignPlayersToCourts(players);

        const matchList = document.querySelector('.match-list');
        matchList.innerHTML = '';

        let matchesExist = false;

        for (const [courtId, courtPlayers] of Object.entries(courts)) {
            if (courtPlayers.length > 0) {
                matchesExist = true;

                // Diviser les joueurs en deux équipes
                let team1 = courtPlayers.slice(0, Math.ceil(courtPlayers.length / 2));
                let team2 = courtPlayers.slice(Math.ceil(courtPlayers.length / 2));

                // Créer une description du match
                let matchDescription = `${team1.join(', ')} vs ${team2.join(', ')}`;

                // Créer un élément de liste pour le match
                const listItem = document.createElement('li');
                listItem.textContent = matchDescription + ` (Terrain ${courtId.charAt(courtId.length - 1)})`;
                matchList.appendChild(listItem);
            }
        }

        // Si aucun match n'est programmé, affichez le message
        if (!matchesExist) {
            matchList.innerHTML = '<li>Pas de futurs matchs</li>';
        }
    }
}


// Gestionnaire de clic pour le bouton "Jouer prochain match"
document.getElementById("playNextMatch").addEventListener("click", function() {
    // Récupérer les matchs actuels en attente
    let listeDup = [...listeJoueurs];
    let listeDup2 = [...listeJoueurs];

    let courts = assignPlayersToCourts(listeDup);

    // Afficher ces matchs sur les terrains
    displayCourts(courts);
    displayNextMatches(listeDup2);
});
