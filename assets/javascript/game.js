$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyBGpS0HkvjevQ1EAm-D5-tM16hKJtGHnHc",
        authDomain: "rock-paper-scisso.firebaseapp.com",
        databaseURL: "https://rock-paper-scisso.firebaseio.com",
        projectId: "rock-paper-scisso",
        storageBucket: "rock-paper-scisso.appspot.com",
        messagingSenderId: "1023291345456",
        appId: "1:1023291345456:web:1b970f64f4f44529"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    var myGlobal = {
        players: 0,
        player1: false,
        player2: false,
        player1Choice: "",
        player2Choice: "",
        player1Chosen: false,
        player2Chosen: false,
        player1Wins: 0,
        player2Wins: 0,
        player1Losses: 0,
        player2Losses: 0,
        assignedRole: "not a player",
        waitingForOpponent: false,
        rpsShot: false
    };

    function startGame() {
        $("#start-div").addClass("d-none");

        $("#wait-div").empty().addClass("d-none");

        $("#game-div").removeClass("d-none");

        $("#chat-div").removeClass("d-none");

        $(".push").removeClass("d-none");
    };

    function getHype(x) {
        $("#wait-div").empty();

        var countDownText = $("<h2>");

        if (x === 4) {
            countDownText.text("Rock...");
        }

        else if (x === 3) {
            countDownText.text("Paper...")

            if (myGlobal.assignedRole === "Player 1") {
                myGlobal.player1Chosen = false;
            }

            else {
                myGlobal.player2Chosen = false;
            };

            setToGlobal();

            myGlobal.rpsShot = false;
        }

        else if (x === 2) {
            countDownText.text("Scissors...")
        }

        else {
            countDownText.text("Shoot!")
        };

        countDownText.addClass("my-5 py-4");

        $("#wait-div").append(countDownText);
    };

    function setToGlobal() {
        database.ref().update({
            player1: myGlobal.player1,
            player2: myGlobal.player2,
            player1Choice: myGlobal.player1Choice,
            player2Choice: myGlobal.player2Choice,
            player1Chosen: myGlobal.player1Chosen,
            player2Chosen: myGlobal.player2Chosen,
            player1Wins: myGlobal.player1Wins,
            player2Wins: myGlobal.player2Wins,
            player1Losses: myGlobal.player1Losses,
            player2Losses: myGlobal.player2Losses,
            players: myGlobal.players
        });
    };

    function getReady() {
        var countDown = 5;

        var countTimer = setInterval(function () {
            countDown--;

            if (countDown > 0) {
                getHype(countDown);
            }

            else if (countDown === 0) {
                clearInterval(countTimer);
                startGame();
            };
        }, 1000);
    };

    function greetPlayer(x) {
        $("#start-div").addClass("d-none");

        $("#wait-div").empty().removeClass("d-none");

        var letsStartText = $("<h2>");

        letsStartText.text("Welcome to the game, Player " + x + "!").addClass("mt-5 pt-5");

        $("#wait-div").append(letsStartText);

        setTimeout(getReady, 1000);
    };

    function itsATie() {
        $("#wait-div").empty().removeClass("d-none");

        var tieText = $("<h2>");

        tieText.text("It's a tie!").addClass("my-5 py-5");

        $("#wait-div").append(tieText);

        setTimeout(getReady, 1000);
    }

    function youWin() {
        $("#wait-div").empty().removeClass("d-none");

        var winText = $("<h2>");

        var wins = $("<h2>");

        var losses = $("<h2>");

        if (myGlobal.assignedRole === "Player 1") {
            winText.text(myGlobal.player1Choice + " beats " + myGlobal.player2Choice.toLowerCase() + "! You win!").addClass("mt-4");

            wins.text("Wins: " + myGlobal.player1Wins);

            losses.text("Losses: " + myGlobal.player1Losses);
        }

        else {
            winText.text(myGlobal.player2Choice + " beats " + myGlobal.player1Choice.toLowerCase() + "! You win!").addClass("mt-4");

            wins.text("Wins: " + myGlobal.player2Wins);

            losses.text("Losses: " + myGlobal.player2Losses);
        };

        $("#wait-div").append(winText, "<br />", wins, "<br />", losses);

        setTimeout(getReady, 2000);
    };

    function youLose() {
        $("#wait-div").empty().removeClass("d-none");

        var loseText = $("<h2>");

        var wins = $("<h2>");

        var losses = $("<h2>");

        if (myGlobal.assignedRole === "Player 1") {
            loseText.text(myGlobal.player2Choice + " beats " + myGlobal.player1Choice.toLowerCase() + ". You lose.").addClass("mt-4");

            wins.text("Wins: " + myGlobal.player1Wins);

            losses.text("Losses: " + myGlobal.player1Losses);
        }

        else {
            loseText.text(myGlobal.player1Choice + " beats " + myGlobal.player2Choice.toLowerCase() + ". You lose.").addClass("mt-4");

            wins.text("Wins: " + myGlobal.player2Wins);

            losses.text("Losses: " + myGlobal.player2Losses);
        };

        $("#wait-div").append(loseText, "<br />", wins, "<br />", losses);

        setTimeout(getReady, 2000);
    };

    function rpsShoot() {
        if (!myGlobal.rpsShot) {
            myGlobal.rpsShot = true;

            $("#game-div").addClass("d-none");

            if (myGlobal.player1Choice === myGlobal.player2Choice) {
                itsATie();
            }

            else if (((myGlobal.player1Choice === "Rock") && (myGlobal.player2Choice === "Scissors")) || ((myGlobal.player1Choice === "Paper") && (myGlobal.player2Choice === "Rock")) || ((myGlobal.player1Choice === "Scissors") && (myGlobal.player2Choice === "Paper"))) {
                if (myGlobal.assignedRole === "Player 1") {
                    myGlobal.player1Wins++;

                    database.ref().update({ player1Wins: myGlobal.player1Wins });

                    youWin();
                }

                else {
                    myGlobal.player2Losses++;

                    database.ref().update({ player2Losses: myGlobal.player2Losses });

                    youLose();
                };
            }

            else {
                if (myGlobal.assignedRole === "Player 2") {
                    myGlobal.player2Wins++;

                    database.ref().update({ player2Wins: myGlobal.player2Wins });

                    youWin();
                }

                else {
                    myGlobal.player1Losses++;

                    database.ref().update({ player1Losses: myGlobal.player1Losses });

                    youLose();
                };
            };
        };
    };

    function choiceMade() {
        if ((myGlobal.player1Chosen) && (myGlobal.player2Chosen)) {
            rpsShoot();
        }

        else {
            $("#game-div").addClass("d-none");

            var waitText = $("<h2>");

            waitText.text("Waiting on opponent's choice...")

            var waitGif = $("<img>");

            waitGif.attr("src", "assets/images/loader.gif");

            $("#wait-div").removeClass("d-none").append(waitGif, waitText);
        };
    };

    database.ref().on("value", function (snapshot) {
        myGlobal.players = snapshot.val().players;

        myGlobal.player1 = snapshot.val().player1;

        myGlobal.player2 = snapshot.val().player2;

        myGlobal.player1Choice = snapshot.val().player1Choice;

        myGlobal.player2Choice = snapshot.val().player2Choice;

        myGlobal.player1Chosen = snapshot.val().player1Chosen;

        myGlobal.player2Chosen = snapshot.val().player2Chosen;

        myGlobal.player1Wins = snapshot.val().player1Wins;

        myGlobal.player2Wins = snapshot.val().player2Wins;

        myGlobal.player1Losses = snapshot.val().player1Losses;

        myGlobal.player2Losses = snapshot.val().player2Losses;

        if ((myGlobal.waitingForOpponent) && ((myGlobal.player1) && (myGlobal.player2))) {
            myGlobal.waitingForOpponent = false;

            getReady();
        };

        if ((myGlobal.player1Chosen) && (myGlobal.player2Chosen)) {
            rpsShoot();
        };
    });

    $(window).on("unload", function () {
        if (myGlobal.assignedRole === "Player 1") {
            myGlobal.players--;

            myGlobal.player1 = false;

            myGlobal.player1Choice = "";

            myGlobal.player1Chosen = false;

            myGlobal.player1Wins = 0;

            myGlobal.player1Losses = 0;

            setToGlobal();

            database.ref().child("chatMessages").remove();
        }

        else if (myGlobal.assignedRole === "Player 2") {
            myGlobal.players--;

            myGlobal.player2 = false;

            myGlobal.player2Choice = "";

            myGlobal.player2Chosen = false;

            myGlobal.player2Wins = 0;

            myGlobal.player2Losses = 0;

            setToGlobal();

            database.ref().child("chatMessages").remove();
        };
    });

    $("#start-button").on("click", function (event) {
        if ((myGlobal.players === 0) && (!myGlobal.player1)) {
            myGlobal.assignedRole = "Player 1";

            myGlobal.player1 = true;

            myGlobal.players++;

            setToGlobal();

            myGlobal.waitingForOpponent = true;

            $("#start-div").addClass("d-none");

            var greetingText = $("<h2>");

            greetingText.text("Welcome to the game, Player 1!").addClass("mb-0 mt-5 pt-5");

            var waitText = $("<h2>");

            waitText.text("Waiting for opponent...").addClass("mb-5 pb-5");

            var loaderGif = $("<img>");

            loaderGif.attr("src", "assets/images/loader.gif");

            $("#wait-div").removeClass("d-none").append(greetingText, loaderGif, waitText);
        }

        else if ((myGlobal.players === 1) && (!myGlobal.player2)) {
            myGlobal.assignedRole = "Player 2";

            myGlobal.player2 = true;

            myGlobal.players++;

            setToGlobal();

            greetPlayer("2");
        }

        else if ((myGlobal.players) === 1 && (!myGlobal.player1)) {
            myGlobal.assignedRole = "Player 1";

            myGlobal.player1 = true;

            myGlobal.players++;

            setToGlobal();

            greetPlayer("1");
        }

        else {
            $("#cant-play-modal").modal("show");
        };
    });

    $("#rock-button").on("click", function () {
        if (myGlobal.assignedRole === "Player 1") {
            myGlobal.player1Choice = "Rock";
            myGlobal.player1Chosen = true;
            setToGlobal();
            choiceMade();
        }

        else if (myGlobal.assignedRole === "Player 2") {
            myGlobal.player2Choice = "Rock";
            myGlobal.player2Chosen = true;
            setToGlobal();
            choiceMade();
        };
    });

    $("#paper-button").on("click", function () {
        if (myGlobal.assignedRole === "Player 1") {
            myGlobal.player1Choice = "Paper";
            myGlobal.player1Chosen = true;
            setToGlobal();
            choiceMade();
        }

        else if (myGlobal.assignedRole === "Player 2") {
            myGlobal.player2Choice = "Paper";
            myGlobal.player2Chosen = true;
            setToGlobal();
            choiceMade();
        };
    });

    $("#scissors-button").on("click", function () {
        if (myGlobal.assignedRole === "Player 1") {
            myGlobal.player1Choice = "Scissors";
            myGlobal.player1Chosen = true;
            setToGlobal();
            choiceMade();
        }

        else if (myGlobal.assignedRole === "Player 2") {
            myGlobal.player2Choice = "Scissors";
            myGlobal.player2Chosen = true;
            setToGlobal();
            choiceMade();
        };
    });

    database.ref().child("chatMessages").limitToLast(10).on("child_added", function (snapshot) {
        var returnedData = snapshot.val();

        var userID = returnedData.userID;

        var messageText = returnedData.messageText;

        if (userID && messageText) {
            var messageElement = $("<p>");

            messageElement.text(userID + ": " + messageText).addClass("mx-2");

            $("#chat-area").append(messageElement);

            $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
        };
    });

    $("#submit-message").on("click", function (event) {
        event.preventDefault();

        if ((myGlobal.assignedRole === "Player 1") || (myGlobal.assignedRole === "Player 2")) {
            var newMessage = {
                userID: myGlobal.assignedRole,
                messageText: $("#add-message").val().trim()
            };

            database.ref().child("chatMessages").push(newMessage);

            document.getElementById("add-message").value = "";
        };
    });

    $("#add-message").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#submit-message").click();
        };
    });
});