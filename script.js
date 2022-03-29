const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
    [0, 1, 2], //horizontal
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], //vertical
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], //diagonal
    [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const modalBody = document.getElementById("modalBody");
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
var playerXScore = document.getElementById('player1score');
var playerOScore = document.getElementById('player2score');
var drawScore = document.getElementById('drawscore');
var totalScore = document.getElementById('totalscore');
var player1Name = document.getElementById('player1name');
var player2Name = document.getElementById('player2name');
var inputone = document.getElementById('playerxname');
var inputtwo = document.getElementById('playeroname');

let circleTurn

var playerXScore = 0;
var playerOScore = 0;
var drawScore = 0;
var totalScore = 0;

form.addEventListener('submit', function(event) {
    event.preventDefault();

    var playerxname = document.getElementById('playerxname').value;
    var playeroname = document.getElementById('playeroname').value;
    // console.log(playerXName, playerOName);

    localStorage.setItem('player1name', playerxname);
    localStorage.setItem('player2name', playeroname);

    document.getElementById("player1name").innerHTML = playerxname + ' X';
    document.getElementById("player2name").innerHTML = playeroname + ' O';

    // $('#submitBtn').click(function(event) {
    //     event.preventDefault();
    $('#myModal').modal('hide');
    // });
    startGame()

});


inputone.oninvalid = function(event) {
    event.target.setCustomValidity('Username should only contain alphanumeric and special characters such as _ and @');
}
inputone.oninput = function(event) {
    event.target.setCustomValidity('');
}

inputtwo.oninvalid = function(event) {
    event.target.setCustomValidity('Username should only contain alphanumeric and special characters such as _ and @');
}
inputtwo.oninput = function(event) {
    event.target.setCustomValidity('');
}

window.onload = (event) => {
    if (localStorage.getItem('player1name') && localStorage.getItem('player2name')) {
        var playerXName = localStorage.getItem('player1name');
        var playerOName = localStorage.getItem('player2name');

        document.getElementById("player1name").innerHTML = playerXName + ' X';
        document.getElementById("player2name").innerHTML = playerOName + ' O';

        var p1s = localStorage.getItem('player1score');
        var p2s = localStorage.getItem('player2score');
        var ds = localStorage.getItem('drawscore');
        var ts = localStorage.getItem('totalscore');
        // console.log(playerName, playerOName)

        if (!localStorage.getItem('player1score')) {
            document.getElementById("player1score").innerHTML = 0;
        } else if (!localStorage.getItem('player2score')) {
            document.getElementById("player2score").innerHTML = 0;
        } else if (!localStorage.getItem('drawscore')) {
            document.getElementById("drawscore").innerHTML = 0;
        } else if (!localStorage.getItem('totalscore')) {
            document.getElementById("totalscore").innerHTML = 0;
        }

        document.getElementById("player1score").innerHTML = p1s;
        document.getElementById("player2score").innerHTML = p2s;
        document.getElementById("drawscore").innerHTML = ds;
        document.getElementById("totalscore").innerHTML = ts;

        startGame();
    } else {
        var myModal = new bootstrap.Modal(document.getElementById('myModal'), {});
        myModal.show();
        startGame();
    }
}

restartButton.addEventListener('click', startGame)

function startGame() {
    circleTurn = false
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
}

function handleClick(e) {
    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)) {
        endGame(false)
        playerScore(currentClass);
    } else if (isDraw()) {
        endGame(true)
        playerScore();
    } else {
        swapTurns()
        setBoardHoverClass()
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = "It's a draw!"
    } else {
        if (localStorage.getItem('player1name') && localStorage.getItem('player2name')) {
            var playerXName = localStorage.getItem('player1name');
            var playerOName = localStorage.getItem('player2name');
            // winningMessageTextElement.innerText = `${circleTurn ? "Player O" : "Player X"} Wins!`
            winningMessageTextElement.innerText = `${circleTurn ? `${playerOName}` : `${playerXName}`} Wins!`
        } else {
            winningMessageTextElement.innerText = `${circleTurn ? "Player O" : "Player X"} Wins!`
        }
    }
    winningMessageElement.classList.add('show')
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

function swapTurns() {
    circleTurn = !circleTurn
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
    } else {
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function playerScore() {
    if (checkWin(X_CLASS)) {
        var playerXName = localStorage.getItem('player1name');
        var ps1 = localStorage.getItem('player1score');
        parseInt(ps1);
        ps1++;
        // playerXScore++;
        
        document.getElementById('player1score').innerHTML = ps1;
        localStorage.setItem('player1score', ps1);

        scorehistory()


    } else if (checkWin(CIRCLE_CLASS)) {
        var playerOName = localStorage.getItem('player2name');
        var ps2 = localStorage.getItem('player2score');
        parseInt(ps2);
        ps2++;
        document.getElementById('player2score').innerHTML = ps2;
        localStorage.setItem('player2score', ps2);

        scorehistory()

    } else {
        var ds1 = localStorage.getItem('drawscore');
        parseInt(ds1);
        ds1++;
        document.getElementById('drawscore').innerHTML = ds1;
        localStorage.setItem('drawscore', ds1);

        scorehistory()
    }

    var ts1 = localStorage.getItem('totalscore');
    parseInt(ts1);
    ts1++;
    document.getElementById('totalscore').innerHTML = ts1;
    localStorage.setItem('totalscore', ts1);

}

function scorehistory() {
    if (checkWin(X_CLASS)) {
        var playerXName = localStorage.getItem('player1name');
        //take user date
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        var results = playerXName + " won ";

        //create array of objects having properties as result and datetimedata
        var obj = [{
            datetimedata: dateTime,
            result: results
        }];

        //push datetimedata to local storage
        if (localStorage.getItem("obj") !== null) {
            obj.push(...JSON.parse(localStorage.getItem("obj")))
        }
        localStorage.setItem('obj', JSON.stringify(obj));


    } else if (checkWin(CIRCLE_CLASS)) {
        var playerOName = localStorage.getItem('player2name');
        //take user date
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        var results = playerOName + " won ";
        //create array of objects having properties as result and datetimedata
        var obj = [{
            datetimedata: dateTime,
            result: results
        }];

        //push datetimedata to local storage
        if (localStorage.getItem("obj") !== null) {
            obj.push(...JSON.parse(localStorage.getItem("obj")))
        }
        localStorage.setItem('obj', JSON.stringify(obj));
    } else {
        //take user date
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        var results = "It was a draw ";

        //create array of objects having properties as result and datetimedata
        var obj = [{
            datetimedata: dateTime,
            result: results
        }];

        //push datetimedata to local storage
        if (localStorage.getItem("obj") !== null) {
            obj.push(...JSON.parse(localStorage.getItem("obj")))
        }
        localStorage.setItem('obj', JSON.stringify(obj));
    }
}
data = JSON.parse(localStorage.getItem("obj"));
//get datetimedata array from local storage

function myRender(data, type, row, meta) {
    return moment(data, "YYYYMMDD hh:mm:ss").fromNow();
}

$(document).ready(function () {
    $('#scorehis').DataTable({
        // "order": [[0, "desc"]],
        "ordering": false,
        "paging": false,
        "searching": false,
        data: data,
        columns: [{
            title: "Played on",
            data: "datetimedata"

        }, {
            title: "Game Result",
            data: "result"
        }],
        columnDefs: [{
            targets: [0], render: myRender
        }]

    });
});

var dateTimeData = data.map(function (obj) {
    var ti = moment(obj.datetimedata, "YYYYMMDD hh:mm:ss").fromNow();
    return ti;
});

console.log(dateTimeData);

function reloadTable() {
    dt = $('#scorehis').DataTable();
    dt.clear().rows.add([{ datetimedata: "2022-3-30 16:39:39", result: "Vrushali won" }]).draw();
}