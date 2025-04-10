// Game state
const gameState = {
    players: [],
    secrets: {},
    currentPlayerIndex: 0,
    round: 1,
    guessedSecrets: {},
    gameLog: [],
    impostor: null,
    commonSecret: null,
    impostorSecret: null
};

// Game configuration
const gameConfig = {
    gameConfig: {
        minPlayers: 4,
        maxPlayers: 8,
        maxRounds: 10,
        maxSecretLength: 30
    },
    exampleSecrets: {
        oggetti: [
            "cucchiaio",
            "orologio",
            "libro",
            "telefono",
            "bottiglia",
            "chiave",
            "occhiali",
            "portafoglio"
        ],
        luoghi: [
            "spiaggia",
            "montagna",
            "cucina",
            "biblioteca",
            "cinema",
            "scuola",
            "parco",
            "ristorante"
        ],
        attività: [
            "nuotare",
            "leggere",
            "cucinare",
            "dormire",
            "cantare",
            "ballare",
            "scrivere",
            "disegnare"
        ],
        concetti: [
            "amore",
            "tempo",
            "pace",
            "gioia",
            "paura",
            "speranza",
            "libertà",
            "sogno"
        ]
    },
    suggestedQuestions: {
        categoria: [
            "È qualcosa che si usa quotidianamente?",
            "È qualcosa che si può trovare in casa?",
            "È qualcosa che si può mangiare?",
            "È qualcosa che si può indossare?",
            "È qualcosa che si può comprare in un negozio?",
            "È qualcosa che si può trovare in natura?",
            "È qualcosa che si può usare per comunicare?",
            "È qualcosa che si può usare per viaggiare?"
        ],
        caratteristiche: [
            "È qualcosa di grande o piccolo?",
            "È qualcosa di duro o morbido?",
            "È qualcosa di leggero o pesante?",
            "È qualcosa di caldo o freddo?",
            "È qualcosa di vecchio o nuovo?",
            "È qualcosa di costoso o economico?",
            "È qualcosa di raro o comune?",
            "È qualcosa di utile o decorativo?"
        ],
        uso: [
            "Lo usi spesso?",
            "Lo usi principalmente di giorno o di notte?",
            "Lo usi principalmente in casa o fuori?",
            "Lo usi principalmente da solo o con altri?",
            "Lo usi principalmente per lavoro o per svago?",
            "Lo usi principalmente in estate o in inverno?",
            "Lo usi principalmente al mattino o alla sera?",
            "Lo usi principalmente in città o in campagna?"
        ]
    },
    suggestedAnswers: {
        frequenza: [
            "A volte lo uso, ma non tutti i giorni",
            "Lo uso abbastanza spesso",
            "Raramente lo uso",
            "Lo uso solo in occasioni speciali",
            "Lo uso quasi ogni giorno",
            "Lo uso solo quando necessario",
            "Lo uso più spesso di quanto pensi",
            "Lo uso meno spesso di quanto pensi"
        ],
        luogo: [
            "Potresti trovarlo in casa, ma non sempre",
            "Di solito si trova all'esterno",
            "Si può trovare sia dentro che fuori",
            "È più comune trovarlo in un luogo specifico",
            "Non è facile trovarlo ovunque",
            "Si può trovare in molti posti diversi",
            "È più facile trovarlo in alcuni posti che in altri",
            "Non è sempre facile trovarlo"
        ],
        caratteristiche: [
            "Non è esattamente come lo descrivi",
            "Hai ragione in parte",
            "Non è proprio così",
            "Ci sei vicino, ma non del tutto",
            "La tua descrizione è parzialmente corretta",
            "Non è esattamente quello che pensi",
            "La tua idea non è completamente sbagliata",
            "C'è qualcosa di vero in quello che dici"
        ]
    },
    gameMessages: {
        errors: {
            emptyName: "Inserisci un nome per il giocatore.",
            duplicateName: "Questo nome è già stato utilizzato.",
            minPlayers: "Sono necessari almeno 4 giocatori per iniziare.",
            maxPlayers: "Il numero massimo di giocatori è 8.",
            emptySecret: "Inserisci un segreto.",
            longSecret: "Il segreto non può superare i 30 caratteri.",
            emptyQuestion: "Inserisci una domanda.",
            emptyGuess: "Inserisci il tuo indovinello."
        },
        success: {
            correctGuess: "Hai indovinato il segreto di {player}! Il segreto era: \"{secret}\"",
            nextPlayer: "Passa il dispositivo a {player}.",
            gameStart: "Il gioco è iniziato!",
            roundStart: "Inizia il round {round}!"
        }
    }
};

// DOM Elements
let gameSections = {};
let elements = {};

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game sections
    gameSections = {
        setup: document.getElementById('game-setup'),
        gameplay: document.getElementById('gameplay'),
        gameOver: document.getElementById('game-over')
    };

    // Initialize elements
    elements = {
        playerName: document.getElementById('player-name'),
        addPlayerBtn: document.getElementById('add-player-btn'),
        playerList: document.getElementById('player-list'),
        startGameBtn: document.getElementById('start-game-btn'),
        roundNumber: document.getElementById('round-number'),
        activePlayer: document.getElementById('active-player'),
        playerToAsk: document.getElementById('player-to-ask'),
        questionText: document.getElementById('question-text'),
        askQuestionBtn: document.getElementById('ask-question-btn'),
        playerToGuess: document.getElementById('player-to-guess'),
        guessText: document.getElementById('guess-text'),
        makeGuessBtn: document.getElementById('make-guess-btn'),
        gameLog: document.getElementById('game-log'),
        results: document.getElementById('results'),
        newGameBtn: document.getElementById('new-game-btn'),
        responseModal: document.getElementById('response-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalMessage: document.getElementById('modal-message'),
        modalBtn: document.getElementById('modal-btn'),
        closeModal: document.querySelector('.close-modal')
    };

    // Verify all required elements are present
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Elemento mancante: ${key}`);
            return;
        }
    }

    for (const [key, section] of Object.entries(gameSections)) {
        if (!section) {
            console.error(`Sezione mancante: ${key}`);
            return;
        }
    }

    // Add event listeners
    elements.addPlayerBtn.addEventListener('click', addPlayer);
    elements.playerName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    elements.startGameBtn.addEventListener('click', startGame);
    elements.askQuestionBtn.addEventListener('click', askQuestion);
    elements.makeGuessBtn.addEventListener('click', makeGuess);
    elements.newGameBtn.addEventListener('click', resetGame);
    elements.modalBtn.addEventListener('click', closeModal);
    elements.closeModal.addEventListener('click', closeModal);

    // Show initial section
    showSection(gameSections.setup);
});

// Functions
function addPlayer() {
    const playerName = elements.playerName.value.trim();
    
    if (playerName === '') {
        showModal('Errore', gameConfig.gameMessages.errors.emptyName);
        return;
    }
    
    if (gameState.players.includes(playerName)) {
        showModal('Errore', gameConfig.gameMessages.errors.duplicateName);
        return;
    }
    
    if (gameState.players.length >= gameConfig.gameConfig.maxPlayers) {
        showModal('Errore', gameConfig.gameMessages.errors.maxPlayers);
        return;
    }
    
    gameState.players.push(playerName);
    elements.playerName.value = '';
    
    updatePlayerList();
    updateStartButton();
}

function updatePlayerList() {
    elements.playerList.innerHTML = '';
    
    gameState.players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        
        const playerNameSpan = document.createElement('span');
        playerNameSpan.textContent = player;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Rimuovi';
        removeBtn.addEventListener('click', () => removePlayer(player));
        
        playerItem.appendChild(playerNameSpan);
        playerItem.appendChild(removeBtn);
        elements.playerList.appendChild(playerItem);
    });
    
    updatePlayerSelects();
}

function removePlayer(playerName) {
    gameState.players = gameState.players.filter(p => p !== playerName);
    updatePlayerList();
    updateStartButton();
}

function updateStartButton() {
    elements.startGameBtn.disabled = gameState.players.length < gameConfig.gameConfig.minPlayers;
}

function updatePlayerSelects() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Clear existing options
    elements.playerToAsk.innerHTML = '';
    elements.playerToGuess.innerHTML = '';
    
    // Add options for all players except current
    gameState.players.forEach(player => {
        if (player !== currentPlayer) {
            const optionAsk = document.createElement('option');
            optionAsk.value = player;
            optionAsk.textContent = player;
            elements.playerToAsk.appendChild(optionAsk);
            
            const optionGuess = document.createElement('option');
            optionGuess.value = player;
            optionGuess.textContent = player;
            elements.playerToGuess.appendChild(optionGuess);
        }
    });
}

function startGame() {
    // Select random category and secrets
    const categories = Object.keys(gameConfig.exampleSecrets);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const secrets = gameConfig.exampleSecrets[category];
    
    // Select two different secrets
    const secretIndex1 = Math.floor(Math.random() * secrets.length);
    let secretIndex2;
    do {
        secretIndex2 = Math.floor(Math.random() * secrets.length);
    } while (secretIndex2 === secretIndex1);
    
    // Assign secrets
    gameState.commonSecret = secrets[secretIndex1];
    gameState.impostorSecret = secrets[secretIndex2];
    
    // Select random impostor
    gameState.impostor = gameState.players[Math.floor(Math.random() * gameState.players.length)];
    
    // Assign secrets to players
    gameState.players.forEach(player => {
        gameState.secrets[player] = player === gameState.impostor ? gameState.impostorSecret : gameState.commonSecret;
    });
    
    // Start with first player
    gameState.currentPlayerIndex = 0;
    
    // Show "Pass device" message to first player
    showModal(
        'Passa il dispositivo',
        `Passa il dispositivo a ${gameState.players[gameState.currentPlayerIndex]}`,
        showSecretToPlayer
    );
}

function showSecretToPlayer() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isImpostor = currentPlayer === gameState.impostor;
    
    showModal(
        'Il tuo segreto',
        `Ciao ${currentPlayer}!
        Il tuo segreto è: "${isImpostor ? gameState.impostorSecret : gameState.commonSecret}"
        Ricorda: tutti i giocatori hanno lo stesso segreto. Cerca di non farti scoprire!`,
        () => {
            // Move to next player or start game
            gameState.currentPlayerIndex++;
            if (gameState.currentPlayerIndex < gameState.players.length) {
                showModal(
                    'Passa il dispositivo',
                    `Passa il dispositivo a ${gameState.players[gameState.currentPlayerIndex]}`,
                    showSecretToPlayer
                );
            } else {
                // All players have seen their secrets, start the game
                gameState.currentPlayerIndex = 0;
                showSection(gameSections.gameplay);
                updateGameplayUI();
                showModal(
                    'Inizio Gioco',
                    'Tutti hanno visto i loro segreti! Il gioco può iniziare!'
                );
            }
        }
    );
}

function confirmSecret() {
    const secret = elements.secretText.value.trim();
    
    if (secret === '') {
        showModal('Errore', gameConfig.gameMessages.errors.emptySecret);
        return;
    }
    
    if (secret.length > gameConfig.gameConfig.maxSecretLength) {
        showModal('Errore', gameConfig.gameMessages.errors.longSecret);
        return;
    }
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    gameState.secrets[currentPlayer] = secret;
    
    gameState.currentPlayerIndex++;
    
    if (gameState.currentPlayerIndex < gameState.players.length) {
        const nextPlayer = gameState.players[gameState.currentPlayerIndex];
        showModal('Prossimo Giocatore', gameConfig.gameMessages.success.nextPlayer.replace('{player}', nextPlayer));
    } else {
        startGame();
    }
}

function updateGameplayUI() {
    if (!elements.gameplay) {
        console.error('La sezione di gameplay non è stata inizializzata');
        return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isImpostor = currentPlayer === gameState.impostor;
    
    elements.roundNumber.textContent = gameState.round;
    elements.activePlayer.textContent = currentPlayer;
    
    // Show the current player's secret
    const secretDisplay = document.createElement('div');
    secretDisplay.className = 'secret-display';
    secretDisplay.innerHTML = `
        <h3>Il tuo segreto è:</h3>
        <p class="secret-text">${isImpostor ? gameState.impostorSecret : gameState.commonSecret}</p>
        <p class="secret-hint">Ricorda: tutti i giocatori hanno lo stesso segreto!</p>
    `;
    
    // Remove any existing secret display
    const existingSecret = document.querySelector('.secret-display');
    if (existingSecret) {
        existingSecret.remove();
    }
    
    // Add the new secret display at the top of the gameplay section
    const firstChild = elements.gameplay.firstChild;
    if (firstChild) {
        elements.gameplay.insertBefore(secretDisplay, firstChild);
    } else {
        elements.gameplay.appendChild(secretDisplay);
    }
    
    updatePlayerSelects();
    updateGameLog();
}

function askQuestion() {
    const targetPlayer = elements.playerToAsk.value;
    const question = elements.questionText.value.trim();
    
    if (question === '') {
        showModal('Errore', gameConfig.gameMessages.errors.emptyQuestion);
        return;
    }
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Log the question
    addToGameLog({
        type: 'question',
        from: currentPlayer,
        to: targetPlayer,
        text: question
    });
    
    // Show modal for answer
    showModal('Rispondi alla Domanda', 
        `${targetPlayer}, fornisci una risposta vaga a: "${question}"`, 
        () => {
            // After answer is provided, move to next player
            nextTurn();
        }
    );
    
    elements.questionText.value = '';
}

function makeGuess() {
    const targetPlayer = elements.playerToGuess.value;
    const guess = elements.guessText.value.trim();
    
    if (guess === '') {
        showModal('Errore', gameConfig.gameMessages.errors.emptyGuess);
        return;
    }
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const actualSecret = gameState.secrets[targetPlayer];
    const isCorrect = guess.toLowerCase() === actualSecret.toLowerCase();
    
    // Add to guessed secrets
    if (!gameState.guessedSecrets[targetPlayer]) {
        gameState.guessedSecrets[targetPlayer] = [];
    }
    
    gameState.guessedSecrets[targetPlayer].push({
        guesser: currentPlayer,
        guess: guess,
        isCorrect: isCorrect
    });
    
    // Log the guess
    addToGameLog({
        type: 'guess',
        from: currentPlayer,
        to: targetPlayer,
        text: guess,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        if (targetPlayer === gameState.impostor) {
            showModal('Vittoria!', `Hai scoperto l'impostore! ${targetPlayer} aveva il segreto: "${actualSecret}"`);
        } else {
            showModal('Corretto!', `Hai indovinato il segreto di ${targetPlayer}!`);
        }
    } else {
        showModal('Sbagliato', 'Il tuo indovinello non è corretto. Continua a provare!');
    }
    
    elements.guessText.value = '';
    
    // Check if game is over
    checkGameOver();
    
    // Next turn
    nextTurn();
}

function nextTurn() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // If we've gone through all players, increment the round
    if (gameState.currentPlayerIndex === 0) {
        gameState.round++;
        if (gameState.round <= gameConfig.gameConfig.maxRounds) {
            showModal('Nuovo Round', gameConfig.gameMessages.success.roundStart.replace('{round}', gameState.round));
        }
    }
    
    updateGameplayUI();
}

function addToGameLog(entry) {
    gameState.gameLog.push(entry);
    updateGameLog();
}

function updateGameLog() {
    elements.gameLog.innerHTML = '';
    
    gameState.gameLog.slice().reverse().forEach(entry => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        if (entry.type === 'question') {
            logEntry.innerHTML = `
                <span class="log-question">
                    ${entry.from} ha chiesto a ${entry.to}: "${entry.text}"
                </span>
            `;
        } else if (entry.type === 'answer') {
            logEntry.innerHTML = `
                <span class="log-answer">
                    ${entry.from} ha risposto: "${entry.text}"
                </span>
            `;
        } else if (entry.type === 'guess') {
            let resultClass = entry.isCorrect ? 'log-correct' : 'log-incorrect';
            let resultText = entry.isCorrect ? 'Corretto!' : 'Sbagliato';
            
            logEntry.innerHTML = `
                <span class="log-guess">
                    ${entry.from} ha indovinato il segreto di ${entry.to}: "${entry.text}" - 
                    <span class="${resultClass}">${resultText}</span>
                </span>
            `;
        }
        
        elements.gameLog.appendChild(logEntry);
    });
}

function checkGameOver() {
    let gameOver = false;
    let winner = null;
    
    // Check if impostor was discovered
    for (const player in gameState.guessedSecrets) {
        const guesses = gameState.guessedSecrets[player];
        if (guesses.some(g => g.isCorrect && player === gameState.impostor)) {
            gameOver = true;
            winner = 'crewmates';
            break;
        }
    }
    
    // End game after max rounds
    if (gameState.round > gameConfig.gameConfig.maxRounds) {
        gameOver = true;
        winner = 'impostor';
    }
    
    if (gameOver) {
        endGame(winner);
    }
}

function endGame(winner) {
    showSection(gameSections.gameOver);
    displayResults(winner);
}

function displayResults(winner) {
    elements.results.innerHTML = '';
    
    const resultHeader = document.createElement('h2');
    if (winner === 'crewmates') {
        resultHeader.textContent = 'I Crewmates hanno vinto!';
    } else {
        resultHeader.textContent = 'L\'Impostore ha vinto!';
    }
    elements.results.appendChild(resultHeader);
    
    const impostorInfo = document.createElement('div');
    impostorInfo.className = 'impostor-info';
    impostorInfo.innerHTML = `
        <h3>L'impostore era: ${gameState.impostor}</h3>
        <p>Segreto dell'impostore: "${gameState.impostorSecret}"</p>
        <p>Segreto dei crewmates: "${gameState.commonSecret}"</p>
    `;
    elements.results.appendChild(impostorInfo);
    
    gameState.players.forEach(player => {
        const playerResult = document.createElement('div');
        playerResult.className = 'player-result';
        
        if (player === gameState.impostor) {
            playerResult.classList.add('impostor');
        }
        
        playerResult.innerHTML = `
            <h4>${player}</h4>
            <p>Ruolo: ${player === gameState.impostor ? 'Impostore' : 'Crewmate'}</p>
            <p>Segreto: "${player === gameState.impostor ? gameState.impostorSecret : gameState.commonSecret}"</p>
        `;
        
        elements.results.appendChild(playerResult);
    });
}

function resetGame() {
    // Reset game state
    gameState.secrets = {};
    gameState.currentPlayerIndex = 0;
    gameState.round = 1;
    gameState.guessedSecrets = {};
    gameState.gameLog = [];
    
    // Show setup screen
    showSection(gameSections.setup);
}

function showSection(section) {
    // Hide all sections
    for (const key in gameSections) {
        gameSections[key].classList.remove('active');
    }
    
    // Show the requested section
    section.classList.add('active');
}

function showModal(title, message, callback) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.responseModal.style.display = 'block';
    
    if (callback) {
        elements.modalBtn.onclick = () => {
            closeModal();
            callback();
        };
    } else {
        elements.modalBtn.onclick = closeModal;
    }
}

function closeModal() {
    elements.responseModal.style.display = 'none';
} 