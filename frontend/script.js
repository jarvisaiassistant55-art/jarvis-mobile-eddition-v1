"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");

    if (!chat || !input || !send) {
        alert("J.A.R.V.I.S. ERROR: HTML elements not found.");
        return;
    }

    function addMessage(text, type) {
        const message = document.createElement("div");

        message.className = "message " + type;
        message.textContent = text;

        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;

        return message;
    }

    function reply(text) {

        const command = text.toLowerCase();

        if (command.includes("hello") || command.includes("hi")) {
            return "Hello, Boss. Systems are online.";
        }

        if (command.includes("how are you")) {
            return "All systems are operating normally, Boss.";
        }

        if (command.includes("who are you")) {
            return "I am J.A.R.V.I.S., your personal digital assistant.";
        }

        if (command.includes("status")) {
            return "All systems are online. Core operating normally.";
        }

        if (command.includes("time")) {
            return "The current time is " +
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                }) + ".";
        }

        if (command.includes("date")) {
            return "Today's date is " +
                new Date().toLocaleDateString() + ".";
        }

        if (command.includes("thank")) {
            return "You're welcome, Boss.";
        }

        return "Command received, Boss. I am ready.";
    }

    function sendMessage() {

        const text = input.value.trim();

        if (text === "") {
            return;
        }

        addMessage("YOU: " + text, "user");

        input.value = "";

        const processing = addMessage(
            "J.A.R.V.I.S: Processing...",
            "ai"
        );

        const chatState =
            document.getElementById("chatState");

        if (chatState) {
            chatState.textContent = "PROCESSING";
        }

        setTimeout(function () {

            processing.textContent =
                "J.A.R.V.I.S: " + reply(text);

            if (chatState) {
                chatState.textContent = "READY";
            }

        }, 500);
    }

    send.addEventListener("click", sendMessage);

    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }

    });

    addMessage(
        "J.A.R.V.I.S: Hello, Boss. Systems are online.",
        "ai"
    );

});
