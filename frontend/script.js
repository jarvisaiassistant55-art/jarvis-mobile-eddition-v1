<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>J.A.R.V.I.S.</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    background: #05090d;
    color: #8eeeff;
    font-family: Arial, sans-serif;
}

.app {
    min-height: 100vh;
    padding: 20px 16px;
}

h1 {
    text-align: center;
    letter-spacing: 5px;
}

.chat {
    height: 300px;
    margin-top: 25px;
    padding: 15px;
    border: 1px solid #2bdcff;
    overflow-y: auto;
    background: #020b0f;
}

.message {
    margin-bottom: 12px;
}

.user {
    color: white;
}

.ai {
    color: #65eaff;
}

.input-area {
    display: flex;
    gap: 8px;
    margin-top: 12px;
}

#msg {
    flex: 1;
    height: 45px;
    padding: 10px;
    background: #07151b;
    border: 1px solid #2bdcff;
    color: white;
    outline: none;
}

#send {
    width: 80px;
    background: #08232b;
    border: 1px solid #2bdcff;
    color: #65eaff;
}

#voiceButton {
    width: 100%;
    height: 45px;
    margin-top: 10px;
    background: #08232b;
    border: 1px solid #2bdcff;
    color: #65eaff;
}
</style>
</head>

<body>

<div class="app">

    <h1>J.A.R.V.I.S.</h1>

    <div id="chat" class="chat">
        <div class="message ai">
            J.A.R.V.I.S.: Systems online, Boss.
        </div>
    </div>

    <div class="input-area">

        <input
            id="msg"
            type="text"
            placeholder="Ask J.A.R.V.I.S..."
        >

        <button id="send" type="button">
            SEND
        </button>

    </div>

    <button id="voiceButton" type="button">
        🎙️ VOICE
    </button>

</div>

<script>

document.addEventListener("DOMContentLoaded", function () {

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");
    const voiceButton = document.getElementById("voiceButton");

    /* =========================
       SEND
       ========================= */

    function sendMessage() {

        const text = input.value.trim();

        if (!text) {
            return;
        }

        const userMessage =
            document.createElement("div");

        userMessage.className =
            "message user";

        userMessage.textContent =
            "YOU: " + text;

        chat.appendChild(userMessage);

        const reply =
            document.createElement("div");

        reply.className =
            "message ai";

        reply.textContent =
            "J.A.R.V.I.S.: I heard you, Boss. Systems are working.";

        chat.appendChild(reply);

        input.value = "";

        chat.scrollTop = chat.scrollHeight;

        /* Speak */

        if ("speechSynthesis" in window) {

            speechSynthesis.cancel();

            const speech =
                new SpeechSynthesisUtterance(
                    "I heard you, Boss. Systems are working."
                );

            speech.lang = "en-IN";

            speechSynthesis.speak(speech);
        }
    }

    send.addEventListener(
        "click",
        sendMessage
    );

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();
            }
        }
    );

    /* =========================
       VOICE INPUT
       ========================= */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        voiceButton.textContent =
            "🎙️ VOICE NOT SUPPORTED";

        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceButton.onclick = function () {

        try {
            recognition.start();
            voiceButton.textContent =
                "🔴 LISTENING...";
        } catch (error) {
            console.log(error);
        }
    };

    recognition.onresult = function (event) {

        const text =
            event.results[0][0].transcript;

        input.value = text;

        sendMessage();
    };

    recognition.onend = function () {

        voiceButton.textContent =
            "🎙️ VOICE";
    };

    recognition.onerror = function (event) {

        console.log(
            "Voice error:",
            event.error
        );

        voiceButton.textContent =
            "🎙️ VOICE";
    };

});

</script>

</body>
</html>
