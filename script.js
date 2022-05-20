const gameBoard = (() => {
    let elements = new Array(9)
    for(let i = 0; i < elements.length; i++) {
        elements[i] = ''
    }

    const resetBoard = () => {
        for(let i = 0; i < elements.length; i++) {
            elements[i] = ''
        }
        let modal = document.getElementById('modal')
        modal.remove()
        displayController.refreshBoard()
    }

    const getElements = () => elements
    const setElementAtIndex = (elem, index) => {
        if(elements.length <= index) {
            throw 'Index out of bounds.'
        }
        if(elements[index] == ''){
            elements[index] = elem
            Game.order == 1 ? Game.order++ : Game.order--
            displayController.refreshBoard()
            Game.checkIfSomebodyWon()
        } else {
            return
        }
    }
    return {getElements, setElementAtIndex, resetBoard}
})()

const Player = (name, symbol) => {
    return {name, symbol}
}

const Game = (() => {
    let order = 1
    let somebodyWon = false

    const setListeners = () => {
        for(let i = 0; i < 9; i++) {
            let square = document.getElementById(`${i}`)
            square.addEventListener('click', () => gameBoard.setElementAtIndex(Game.order == 1 ? 'X' : 'O', i))
        }
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
               somebodyWon = true
               return
           }
        }
        for(let i = 0; i < 7; i+=3) {
            if((elemArray[i] == elemArray[i + 1]) && (elemArray[i] == elemArray[i + 2]) && elemArray[i] != '') {
                displayController.showWinner(elemArray[i])
                somebodyWon = true
                return
            }
        }

        let j = 4

        if((elemArray[j] == elemArray[j - 4]) && (elemArray[j] == elemArray[j + 4]) && elemArray[j] != '') {
            displayController.showWinner(elemArray[j])
            somebodyWon = true
            return
        }
        if((elemArray[j] == elemArray[j - 2]) && (elemArray[j] == elemArray[j + 2]) && elemArray[j] != '') {
            displayController.showWinner(elemArray[j])
            somebodyWon = true
            return
        }
        if(!elemArray.includes('')) {
            displayController.showTie()
            somebodyWon = true
            return
        }
    }

    return {createPlayers, setListeners, order, checkIfSomebodyWon}
})()

const displayController = (() => {
    const refreshBoard = () => {
        let elements = gameBoard.getElements()
        for(let i = 0; i < elements.length; i++) {
            let square = document.getElementById(`${i}`)
            square.textContent = elements[i]
        }
    }

    const displayNames = () => {
        let player1Div = document.getElementById('player1')
        let player2Div = document.getElementById('player2')
        player1Div.textContent = player1.name
        player2Div.textContent = player2.name 
    }

    const showWinner = (symbol) => {
        let winner 
        if(symbol == 'X') {
            winner = 'Player 1'
        } else {
            winner = 'Player 2'
        }
        createModal(winner)
        
    }

    const showTie = () => {
       createModal('tie')
    }

    const createModal = (winner) => {
        let modal = document.createElement('div')
        modal.setAttribute('id', 'modal')
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
        replayButton.addEventListener('click', gameBoard.resetBoard)
        let closeButton = document.createElement('button')
        closeButton.textContent = 'X'
        closeButton.addEventListener('click', () => modal.remove())
        closeButton.classList.add('close-btn')
        modal.insertBefore(closeButton, modal.firstChild)
    }

    return {refreshBoard, displayNames, showTie, showWinner}
})()

Game.setListeners()
let player1 = Game.createPlayers(1)
let player2 = Game.createPlayers(2)
displayController.displayNames()

