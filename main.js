const historyURL = "http://localhost:3000/game_histories"
const playerURL = "http://localhost:3000/players"
const tournamentURL = "http://localhost:3000/tournaments"
const playerName = document.querySelector("#name")
const p1score = document.querySelector("#player-one-score")
const p2score = document.querySelector("#player-two-score")
const p1add = document.querySelector("#player-one-increment")
const p2add = document.querySelector("#player-two-increment")
const winningScore = document.querySelector("#winning-score")
const winScore = document.querySelector("#win-score")
const setWinScoreDiv = document.querySelector("#set-win-score")
const winner = document.querySelector("#winner")
const playerOne = document.querySelector("#player-one")
const playerTwo = document.querySelector("#player-two")
const editP1 = document.querySelector("#edit-player-1")
const editP2 = document.querySelector("#edit-player-2")
const page = document.querySelector("#container")
const intro = document.querySelector("#intro-screen")
const title = document.createElement("h1")
title.setAttribute("id", "title")
title.textContent = "ScoreIt!"
let player1Score = 0
let player2Score = 0
let scoreToWin = 0
let winPlayer = ""
let losePlayer = ""
p1score.textContent = player1Score
p2score.textContent = player2Score

function fetchGetGames() {
  fetch(historyURL)
    .then(responseToJson)
    .then(getData)
    .catch(catchError)
}

function fetchGetPlayers() {
  fetch(playerURL)
    .then(responseToJson)
    .then(getPlayers)
    .catch(catchError)
}

function fetchGetPlayersList() {
  fetch(playerURL)
    .then(responseToJson)
    .then(listPlayers)
    .catch(catchError)
}

function fetchPost(url, body) {
  fetch(url, postMethod(body))
    .then(responseToJson)
    .then(result)
    .catch(catchError)
}

function fetchEdit(url, id, body) {
  fetch(url + "/" + id, editMethod(body))
    .then(responseToJson)
    .then(result)
    .catch(catchError)
}

function fetchDelete(url, id) {
  fetch(url + "/" + id, {method: "DELETE"})
    .catch(catchError)
}

function editMethod(body) {
  return {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

function editPlayer(id, player, wins, losses) {
  const body = {
    id: `${id}`,
    name: `${player}`,
    wins: `${wins}`,
    losses: `${losses}`
  }
  fetchEdit(playerURL, id, body)
}

function listGameHistory() {
  while (page.hasChildNodes()) {
    page.removeChild(page.firstChild);
  }
  page.appendChild(title)
  fetchGetGames();
  newGame();
}

function listPlayersOut(data) {
  while (page.hasChildNodes()) {
    page.removeChild(page.firstChild);
  }
  page.appendChild(title)
  playerUl = document.createElement("ul")
  playerUl.setAttribute("id", "players")
  page.appendChild(playerUl)
  addPlayerToList(data)
  newGame();
}

function getData(data) {
  gameUl = document.createElement("ul")
  gameUl.setAttribute("id", "games")
  page.appendChild(gameUl)
  data.forEach(function(game) {
    gameLi = document.createElement("li")
    gameLi.setAttribute("id", game.id)
    gameLi.textContent = `${game.player_one}: ${game.p_one_score} - ${game.player_two}: ${game.p_two_score}`
    gameUl.appendChild(gameLi)
    deleteButton(historyURL, gameLi.id)
    gameLi.appendChild(delButton)
  })
}

function deleteEntry(url, id) {
  deleteEntryFromView(id);
  fetchDelete(url, id);
}

function postMethod(body) {
  return {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

function postWinner() {
  const body = {
    player_one: `${playerOne.textContent}`,
    player_two: `${playerTwo.textContent}`,
    p_one_score: `${player1Score}`,
    p_two_score: `${player2Score}`
  }
  fetchPost(historyURL, body)
}

function postPlayer(player, wins, losses) {
  const body = {
    name: `${player}`,
    wins: `${wins}`,
    losses: `${losses}`
  }
  fetchPost(playerURL, body)
}

function createPlayer(player, wins, losses) {
  if (player !== "Player One") {
    if (player !== "Player Two") {
      postPlayer(player, wins, losses)
    }
  }
}

function addP1Score() {
  disablePlayerButtons();
  player1Score ++
  p1score.textContent = player1Score
  if (player1Score === parseInt(scoreToWin)) {
    playerWin(`${playerOne.textContent}`, `${playerTwo.textContent}`)
  }
}

function addP2Score() {
  disablePlayerButtons();
  player2Score ++
  p2score.textContent = player2Score
  if (player2Score === parseInt(scoreToWin)) {
    playerWin(`${playerTwo.textContent}`, `${playerOne.textContent}`)
  }
}

function playerWin(winner, loser) {
  winPlayer = winner;
  losePlayer = loser;
  disableAddButtons();
  declareWinner(winner);
  fetchGetPlayers();
  postWinner();
}

function playerLoss(player) {}

function declareWinner(player) {
  while (page.hasChildNodes()) {
      page.removeChild(page.firstChild);
  }
  winnerMessage(player);
  newGame();
}

function getPlayers(data) {
  playerData(data);
}

function listPlayers(data) {
  gamePlayersButton(data);
}

function playerData(data) {
  data.forEach(function(player) {
    let id = player.id
    let name = player.name
    let wins = parseInt(player.wins)
    let losses = player.losses
    console.log(winPlayer)
    console.log(losePlayer)
    if (winPlayer === name) {
      wins ++
      editPlayer(id, name, wins, losses)
    } else if (losePlayer === name) {
      losses ++
      editPlayer(id, name, wins, losses)
    }
  })
}

function addPlayerToList(data) {
  let allPlayers = []
  data.forEach(function(player) {
    if (!allPlayers.includes(player.name)) {
      playerLi = document.createElement("li")
      playerLi.setAttribute("id", player.id)
      playerLi.textContent = `${player.name} - ${player.wins}W / ${player.losses}L`
      playerUl.appendChild(playerLi)
      deleteButton(playerURL, playerLi.id)
      playerLi.appendChild(delButton)
      allPlayers.push(player.name)
    } else (fetchDelete(playerURL, player.id))
  })
}

function newGame() {
  newGameButton = document.createElement("button")
  newGameButton.setAttribute("id", "new-game")
  newGameButton.textContent = "New Game"
  page.appendChild(newGameButton)
  newGameButton.addEventListener("click", reset)
}

function winnerMessage(player) {
  nameWinner = document.createElement("h1")
  nameWinner.setAttribute("id", "name-winner")
  nameWinner.textContent = `${player} is the winner!`
  page.appendChild(nameWinner);
}

function setWinScore(event) {
  event.preventDefault();
  if (parseInt(winScore.value) >= 1) {
    scoreToWin = winScore.value
    totalScore = document.createElement("h2")
    totalScore.textContent = `Points to win: ${scoreToWin}`
    setWinScoreDiv.removeChild(winningScore)
    setWinScoreDiv.appendChild(totalScore)
    enableButtons()
  } else window.alert("Please enter a positive number")
}

function disableAddButtons() {
  p1add.disabled = true;
  p2add.disabled = true;
}

function disablePlayerButtons() {
  editP1.disabled = true;
  editP2.disabled = true;
}

function enableButtons() {
  p1add.disabled = false;
  p2add.disabled = false;
  editP1.disabled = false;
  editP2.disabled = false;
}

function deleteButton(url, id) {
  delButton = document.createElement("button")
  delButton.textContent = "Delete Entry"
  delButton.addEventListener("click", function(){deleteEntry(url, id)})
}

function deleteEntryFromView(id) {
  entries = document.querySelectorAll("li")
  toDelete = document.getElementById(id)
  toDelete.parentNode.removeChild(toDelete)
}

function editP1Name() {
  editP1.onclick = nameEdit(playerOne)
}

function editP2Name() {
  editP2.onclick = nameEdit(playerTwo)
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function nameEdit(player) {
  createPlayerForm(player)
  playerEditForm.addEventListener("submit", function(event){
    fetchGetPlayers();
    event.preventDefault();
    changePlayer(player)
    createPlayer(player.textContent, 0, 0);
    hidePlayerForm()
  })
}

function createPlayerForm(player) {
  playerEdit = document.createElement("div");
  playerEdit.setAttribute("id", "player-edit");
  playerEdit.textContent = "New Player Name:";
  playerEditForm = document.createElement("form");
  editFormText = document.createElement("input");
  editFormText.setAttribute("type", "text");
  submitEditForm = document.createElement("input");
  submitEditForm.setAttribute("type", "submit");
  page.appendChild(playerEdit);
  playerEdit.appendChild(playerEditForm);
  playerEditForm.appendChild(editFormText);
  playerEditForm.appendChild(submitEditForm);
  editFormText.focus();
}

function changePlayer(player) {
  player.textContent = editFormText.value
}

function hidePlayerForm() {
  page.removeChild(playerEdit)
}

function reset() {
  location.reload(true);
}

function responseToJson(response) {
  return response.json();
}

function result(result) {
  return result;
}

function catchError(error) {
  console.error(error)
}

function gameHistoryButton() {
  historyButton = document.createElement("button");
  historyButton.setAttribute("id", "history-button");
  historyButton.textContent = "Game History";
  page.appendChild(historyButton);
  historyButton.addEventListener("click", listGameHistory);
}

function gamePlayersButton(data) {
  playerButton = document.createElement("button");
  playerButton.setAttribute("id", "player-button");
  playerButton.textContent = "List of Players";
  page.appendChild(playerButton);
  playerButton.addEventListener("click", function(){
    listPlayersOut(data)
  })
}

function runSingleGame() {
  page.style = "display:contents"
  intro.style = "display:none"
  disableAddButtons();
  disablePlayerButtons();
  fetchGetPlayersList();
  editP1.addEventListener("click", editP1Name);
  editP2.addEventListener("click", editP2Name);
  p1add.addEventListener("click", addP1Score);
  p2add.addEventListener("click", addP2Score);
  winningScore.addEventListener("submit", setWinScore);
  winScore.focus();
  gameHistoryButton();
}

function runTournament() {
  intro.style = "display:none"
  tourneyDiv = document.createElement("div")
  tourneyDiv.setAttribute("id", "under-construction")
  document.body.appendChild(tourneyDiv)
  tourneyDiv.appendChild(title)
  underConstruction = document.createElement("h1")
  underConstruction.textContent = "This page is under construction"
  tourneyDiv.appendChild(underConstruction)
  backToMain = document.createElement("button")
  backToMain.setAttribute("id", "back-to-main")
  backToMain.textContent = "Back to Main Menu"
  tourneyDiv.appendChild(backToMain)
  backToMain.addEventListener("click", backToIntro)
}

function backToIntro() {
  page.style = "display:none"
  tourneyDiv.style = "display:none";
  intro.style = "display:contents";
  runIntro();
}

function runIntro() {
  page.style = "display:none"
  intro.append(title)
  singleGame = document.createElement("button");
  tournament = document.createElement("button");
  singleGame.setAttribute("id", "single-game")
  tournament.setAttribute("id", "tournament")
  singleGame.textContent = "Single Game";
  tournament.textContent = "Tournament";
  intro.append(singleGame, tournament)
  singleGame.addEventListener("click", runSingleGame);
  tournament.addEventListener("click", runTournament);
}

function runApp() {
  runIntro();
}

runApp();
