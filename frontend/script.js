"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const chat = document.getElementById("chat");
    const msg = document.getElementById("msg");
    const send = document.getElementById("send");
    const chatState = document.getElementById("chatState");
    const voiceButton = document.getElementById("voiceButton");
    const voiceStatus = document.getElementById("voiceStatus");

    // CHECK HTML ELEMENTS
    console.log("JARVIS STARTING...");
    console.log("chat:", chat);
    console.log("msg:", msg);
    console.log("send:", send);

    if (!chat || !msg || !send) {
        alert("J.A.R.V.I.S. ERROR: Chat elements not found.");
        return;
    }

    // ADD MESSAGE
    function addMessage(name, text, className) {

        const div = document.createElement("div");

        div.className = className || "message";

        div.textContent = name + ": " + text;

        chat.appendChild(div);

        chat.scrollTop = chat.scrollHeight;
    }

    // JARVIS REPLY
    function reply(text) {

        const t = text.toLowerCase();

        if (t.includes("hello") || t === "hi") {
            return "Hello, Boss. J.A.R.V.I.S. is online.";
        }

        if (t.includes("how are you")) {
            return "All systems are operating normally, Boss.";
        }

        if (t.includes("who are you")) {
            return "I am J.A.R.V.I.S., your personal AI assistant.";
        }

        if (t.includes("time")) {
            return "The current time is " +
                new Date().toLocaleTimeString();
        }

        if (t.includes("date")) {
            return "Today's date is " +
                new Date().toLocaleDateString();
        }

        if (t.includes("status")) {
            return "AI Core ONLINE. Network ONLINE. J.A.R.V.I.S. ready.";
        }

        if (t.includes("help")) {
            return "I am ready, Boss. Try asking for the time, date, or system status.";
        }

        return "Command received, Boss. Online AI is not connected yet.";
    }

    // SEND FUNCTION
    function sendMessage() {

        const text = msg.value.trim();

        if (text === "") {
            return;
        }

        addMessage("YOU", text, "user");

        msg.value = "";

        if (chatState) {
            chatState.textContent = "PROCESSING";
        }

        setTimeout(function () {

            const answer = reply(text);

            addMessage("J.A.R.V.I.S.", answer, "ai");

            if (chatState) {
                chatState.textContent = "READY";
            }

        }, 500);
    }

    // SEND BUTTON
    send.onclick = function () {
        sendMessage();
    };

    // ENTER KEY
    msg.onkeydown = function (event) {

        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }

    };

    // VOICE
    if (voiceButton) {

        voiceButton.onclick = function () {

            const Recognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;

            if (!Recognition) {

                if (voiceStatus) {
                    voiceStatus.textContent = "NOT SUPPORTED";
                }

                return;
            }

            const recognition = new Recognition();

            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.interimResults = false;

            if (voiceStatus) {
                voiceStatus.textContent = "● LISTENING";
            }

            recognition.start();

            recognition.onresult = function (event) {

                const text =
                    event.results[0][0].transcript;

                msg.value = text;

                if (voiceStatus) {
                    voiceStatus.textContent = "● ONLINE";
                }

                sendMessage();
            };

            recognition.onerror = function () {

                if (voiceStatus) {
                    voiceStatus.textContent = "○ LOCKED";
                }

            };

            recognition.onend = function () {

                if (voiceStatus) {
                    voiceStatus.textContent = "○ READY";
                }

            };
        };
    }

    // STARTUP MESSAGE
    addMessage(
        "J.A.R.V.I.S.",
        "Systems online. How may I assist you, Boss?",
        "ai"
    );

    msg.focus();

});
