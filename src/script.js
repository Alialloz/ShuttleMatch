let joueurs = [];
let matches = [];
let matchActuel = 0;

function initialiserJoueurs() {
    const numPlayers = document.getElementById('numPlayers').value;
    joueurs = [];
    const joueursInputs = document.getElementById('joueursInputs');
    joueursInputs.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        joueursInputs.innerHTML += 'Joueur ' + (i + 1) + ': <input type="text" id="joueur' + i + '"><br>';
    }
}

function genererCombinations(numPlayers) {
    let allPairs = [];
    for (let i = 0; i < numPlayers; i++) {
        for (let j = i + 1; j < numPlayers; j++) {
            allPairs.push([i, j]);
        }
    }

    while (allPairs.length > 0) {
        let match = [];
        let pair = allPairs.shift(); // Prendre la première paire
        match.push(pair);
        let secondPair = allPairs.find(p => !p.includes(pair[0]) && !p.includes(pair[1]));
        if (secondPair) {
            match.push(secondPair);
            allPairs = allPairs.filter(p => p !== secondPair);
        }
        matches.push(match);
    }
}

function genererMatch() {
    if (matchActuel >= matches.length) {
        alert('Tous les matchs ont été générés!');
        return;
    }

    const match = matches[matchActuel];
    afficherMatch(match, 'terrain1', 'terrain2');
    matchActuel++;
}

function afficherMatch(match, idTerrain1, idTerrain2) {
    const terrain1 = document.getElementById(idTerrain1);
    const terrain2 = document.getElementById(idTerrain2);

    terrain1.innerHTML = 'Joueur: ' + joueurs[match[0][0]] + ' vs Joueur: ' + joueurs[match[0][1]];
    if (match.length > 1) {
        terrain2.innerHTML = 'Joueur: ' + joueurs[match[1][0]] + ' vs Joueur: ' + joueurs[match[1][1]];
    } else {
        terrain2.innerHTML = 'Pas de match sur ce terrain';
    }
}

document.getElementById('numPlayers').addEventListener('change', () => {
    matchActuel = 0;
    matches = [];
});
