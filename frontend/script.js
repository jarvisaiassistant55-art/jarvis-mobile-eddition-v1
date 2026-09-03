document.addEventListener("DOMContentLoaded", function () {

    const sendButton = document.getElementById("send");
    const messageInput = document.getElementById("msg");
    const chatBox = document.getElementById("chat");

    if (!sendButton || !messageInput || !chatBox) {
        alert("ERROR: JARVIS HTML IDs NOT FOUND");
        return;
    }

    sendButton.onclick = function () {

        const message = messageInput.value.trim();

        if (message === "") {
            return;
        }

        const userMessage = document.createElement("div");

        userMessage.className = "message user";

        userMessage.textContent =
            "YOU: " + message;

        chatBox.appendChild(userMessage);

        const jarvisMessage = document.createElement("div");

        jarvisMessage.className = "message ai";

        jarvisMessage.textContent =
            "J.A.R.V.I.S.: Systems online, Boss. I received your message.";

        chatBox.appendChild(jarvisMessage);

        messageInput.value = "";

        chatBox.scrollTop = chatBox.scrollHeight;
    };

    messageInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendButton.click();
        }
    });

});
