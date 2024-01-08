function createPlayerInputs() {
    var playerCount = document.getElementById("playerCount").value;
    var playerNamesContainer = document.getElementById("playerNames");
    playerNamesContainer.innerHTML = "";

    for (var i = 0; i < playerCount; i++) {
        playerNamesContainer.innerHTML += '<div class="player-name-input"><label for="player' + i + '"> Joueur ' + (i + 1) + ':</label><input type="text" id="player' + i + '"></div>';
    }
}
