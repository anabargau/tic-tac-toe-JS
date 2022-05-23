const gameBoard = (() => {
    let elements = new Array(9)
    for(let i = 0; i < elements.length; i++) {
        elements[i] = ''
    }

    const resetBoard = () => {
        for(let i = 0; i < elements.length; i++) {
            elements[i] = ''
        }
        let modal = document.getElementById('win-modal')
        modal.remove()
        displayController.refreshBoard()
        displayController.displayScores(player1, player2)
    }

    const getElements = () => elements

    const setElementAtIndex = (elem, index) => {
        if(elements.length <= index) {
            throw 'Index out of bounds.'
        }
        if(Game.players == 2){
            if(elements[index] == ''){
                elements[index] = elem
                Game.order == 1 ? Game.order++ : Game.order--
                displayController.refreshBoard()
                Game.checkIfSomebodyWon()
            } else {
                return
            }
        } else {
            if(Game.order == 1) {
                if(elements[index] == ''){
                    elements[index] = elem
                    displayController.refreshBoard()
                    if(Game.checkIfSomebodyWon()){
                        return
                    }
                    Game.order++
                    let idx = Game.makeComputerMove()
                    elements[idx] = 'O'  
                    Game.order--   
                    setTimeout(displayController.refreshBoard, 800)
                    setTimeout(Game.checkIfSomebodyWon, 1000)
                } else {
                    return
                }
            }
        }
    }
    return {getElements, setElementAtIndex, resetBoard}

})()

const Player = (name, symbol) => {
    let score = 0
    return {name, symbol, score}
}

const Game = (() => {
    let order = 1
    let players

    const getRandom = (array) => {
        return array[Math.floor((Math.random()*array.length))]
     }

    const makeComputerMove = () => {
        let elements = gameBoard.getElements()
        let computerMove = getRandom(gameBoard.getElements())
        while(computerMove != '') {
            computerMove = getRandom(gameBoard.getElements())
        }
        return elements.indexOf(computerMove)
    }

    const setListeners = () => {
        for(let i = 0; i < 9; i++) {
            let square = document.getElementById(`${i}`)
            square.addEventListener('click', () => gameBoard.setElementAtIndex(Game.order == 1 ? 'X' : 'O', i))
        }
    }

    const chooseNumOfPlayers = () => {
        let num = prompt('Choose how many players will play the game: 1 or 2.')
        while(!['1', '2'].includes(num)) {
            num = prompt('Please write "1" or "2".')
        }
        return num
    }

    const getPlayerName = (order) => {
        let playerName = prompt(`Insert player ${order} name`)
        while(playerName == '') {
            prompt(`Insert player ${order} name`)
        }
        return playerName
    }

    const createPlayers = (order) => {
        let player
        let playerName = getPlayerName(order)
        if(order == 1) {
            player = Player(playerName, 'X')
        } else {
            player = Player(playerName, 'O')
        }
        return player
    }

    const checkIfSomebodyWon = () => {
        let elemArray = gameBoard.getElements()
        for(let i = 0; i < 3; i++) {
           if(elemArray[i] == elemArray[i + 3] && elemArray[i] == elemArray[i + 6] && elemArray[i] != '') {
               displayController.showWinner(elemArray[i])
               return true
           }
        }
        for(let i = 0; i < 7; i+=3) {
            if((elemArray[i] == elemArray[i + 1]) && (elemArray[i] == elemArray[i + 2]) && elemArray[i] != '') {
                displayController.showWinner(elemArray[i])
                return true
            }
        }

        let j = 4

        if((elemArray[j] == elemArray[j - 4]) && (elemArray[j] == elemArray[j + 4]) && elemArray[j] != '') {
            displayController.showWinner(elemArray[j])
            return true
        }
        if((elemArray[j] == elemArray[j - 2]) && (elemArray[j] == elemArray[j + 2]) && elemArray[j] != '') {
            displayController.showWinner(elemArray[j])
            return true
        }
        if(!elemArray.includes('')) {
            displayController.showTie()
            return true
        }
    }

    return {createPlayers, setListeners, order, checkIfSomebodyWon, chooseNumOfPlayers, players, makeComputerMove}
})()

const displayController = (() => {
    const refreshBoard = () => {
        let elements = gameBoard.getElements()
        for(let i = 0; i < elements.length; i++) {
            let square = document.getElementById(`${i}`)
            square.textContent = elements[i]
        }
    }

    const displayNames = (player1, player2) => {
        let player1Div = document.getElementById('player1-name')
        let player2Div = document.getElementById('player2-name')
        player1Div.textContent = player1.name
        player2Div.textContent = player2.name 
    }

    const showWinner = (symbol) => {
        let winner 
        if(symbol == 'X') {
            winner = 'Player 1'
            Game.order = 1
            player1.score++
        } else {
            if(Game.players == 2){
                winner = 'Player 2'
            } else {
                winner = 'Computer'
            }
            Game.order = 2
            player2.score++
        }
        createModal(winner)
        
    }

    const showTie = () => {
       createModal('tie')
    }

    const createModal = (winner) => {
        let modal = document.createElement('div')
        modal.setAttribute('id', 'win-modal')
        let body = document.getElementById('body')
        body.appendChild(modal)
        let modalText = document.createElement('div')
        modal.appendChild(modalText)
        modalText.classList.add('modal-text')
        if(winner == 'tie') {
            modalText.textContent = 'It\'s a tie. Nobody won!'
        } else {
            modalText.textContent = `${winner} is the winner!`
        } 
        let replayButton = document.createElement('button')
        modal.appendChild(replayButton)
        replayButton.classList.add('replay')
        replayButton.textContent = 'Replay'
        replayButton.addEventListener('click', () => gameBoard.resetBoard())
        let closeButton = document.createElement('button')
        closeButton.textContent = 'X'
        closeButton.addEventListener('click', () => modal.remove())
        closeButton.classList.add('close-btn')
        modal.insertBefore(closeButton, modal.firstChild)
    }

    const displayScores = (player1, player2) => {
        let player1Score = document.getElementById('player1-score')
        let player2Score = document.getElementById('player2-score')
        player1Score.textContent = `Score: ${player1.score}`
        player2Score.textContent = `Score: ${player2.score}`
    }

    return {refreshBoard, displayNames, showTie, showWinner, displayScores}
})()

Game.setListeners()
numOfPlayers = Game.chooseNumOfPlayers()
if(numOfPlayers == '2'){
    var player1 = Game.createPlayers(1)
    var player2 = Game.createPlayers(2)
    Game.players = 2
    displayController.displayNames(player1, player2)
    displayController.displayScores(player1, player2)
} else {
    var player1 = Game.createPlayers(1)
    var player2 = Player('Computer', 'O')
    Game.players = 1
    displayController.displayNames(player1, player2)
    displayController.displayScores(player1, player2)
}

