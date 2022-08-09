const Players = (name) => {
    return {
        name,
        greet() {
            consol.log('hello there ', name);
        }
    }
}

const GameBoard = (() => {
    const tiles = document.querySelectorAll('.tiles');
    const PLAYER_X = Players('X');
    const PLAYER_O = Players('O');
    let turn = PLAYER_X.name;

    const boardState = Array(tiles.length);
    boardState.fill(null);

    //Elements
    const strike = document.getElementById('strike');
    const gameInfo = document.getElementById('game-info');
    const gameWinner = document.getElementById('game-winner');
    const btnPlayAgain = document.getElementById('play-again');

    btnPlayAgain.addEventListener('click',refreshGame);
    // sounds
    const clickSound = new Audio('Sounds/click.wav');
    const gameOverAudio = new Audio('Sounds/gameover.wav');

    const startGame = () => {
        tiles.forEach((tile) => tile.addEventListener('click', tileClick));

        function tileClick (event) {
            if ( gameInfo.classList.contains('visible') ) {
                return;
            }

            const tile = event.target; //targeting the current event
            const tileNumber = tile.dataset.index; //getting index of tile from dataset defined in html

            if (tile.textContent !== "") {
                return; //if there is no existing content on tile, exit
            }

            if ( turn===PLAYER_X.name ) {
                tile.textContent = PLAYER_X.name;
                boardState[tileNumber-1] = PLAYER_X.name; //adding in array and -1 because array index start from zero while dataset defined from 1
                turn = PLAYER_O.name; // change the player
            } else {
                tile.textContent = PLAYER_O.name;
                boardState[tileNumber-1] = PLAYER_O.name; //adding in array and -1 because array index start from zero while dataset defined from 1
                turn = PLAYER_X.name;
            }

            clickSound.play(); //playing sound on each click
            setHoverText(); //add hover state
            checkWinner();
        }

    }

    //add hover functionality
    function setHoverText() {
        //remove existing hovers
        tiles.forEach(e => {
            e.classList.remove('x-hover');
            e.classList.remove('o-hover');
        })

        //extracting the X and O values 
        const hoverClass = `${turn.toLowerCase()}-hover`; 

        tiles.forEach(e => {
            if (e.textContent === "") {
                e.classList.add(hoverClass);
            }
        })
    }
    
    const winningCombination = [
        //rows
        {combo: [1,2,3], strikeClass: 'strike-row-1'},
        {combo: [4,5,6], strikeClass: 'strike-row-2'},
        {combo: [7,8,9], strikeClass: 'strike-row-3'},
        //columns
        {combo: [1,4,7], strikeClass: 'strike-col-1'},
        {combo: [2,5,8], strikeClass: 'strike-col-2'},
        {combo: [3,6,9], strikeClass: 'strike-col-3'},
        //diagonal
        {combo: [1,5,9], strikeClass: 'strike-diag-1'},
        {combo: [3,5,7], strikeClass: 'strike-diag-2'}
    ]

    function checkWinner() {
        //check for winner
        for (const winningCombo of winningCombination) {
            const combo = winningCombo.combo;
            const strikeClass = winningCombo.strikeClass;

            const tileVal1 = boardState[combo[0]-1];
            const tileVal2 = boardState[combo[1]-1];
            const tileVal3 = boardState[combo[2]-1];

            if (tileVal1 !== null && tileVal1 === tileVal2 && tileVal1 === tileVal3) {
                strike.classList.add(strikeClass);
                gameOver(tileVal1);
                gameOverAudio.play();
                return; //stop code going further, winner decided so return (fixes bug)
            }
        }   
        
        //check for draw
        const drawState = boardState.every((tile) => tile !== null);
        if (drawState) {
            gameOver(null);
        }     
    }

    

    function gameOver(winnerText) {
        let text = 'Draw!';

        if (winnerText !== null) {
            text = `Player ${winnerText} winner!`
        }

        //adding game information style visible
        gameInfo.className = 'visible'; 
        gameWinner.textContent = text;
    }

    function refreshGame() {
        strike.className = 'strike';
        gameInfo.className = 'hidden';
        boardState.fill(null);
        tiles.forEach(tile => tile.textContent="");
        turn = PLAYER_X.name;
        setHoverText();
    }

    return { 
        startGame:startGame
    }
})();



GameBoard.startGame();