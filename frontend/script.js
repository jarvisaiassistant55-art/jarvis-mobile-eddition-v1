"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");
    const chatState = document.getElementById("chatState");
    const voiceButton = document.getElementById("voiceButton");
    const voiceStatus = document.getElementById("voiceStatus");
    const voiceHead = document.getElementById("voiceHead");
    const memoryStatus = document.getElementById("memoryStatus");

    /* =========================================
       CHECK UI
       ========================================= */

    if (!chat || !input || !send) {
        console.error("J.A.R.V.I.S.: Required elements missing.");
        return;
    }

    /* =========================================
       MESSAGE
       ========================================= */

    function addMessage(text, type = "ai") {

        const message = document.createElement("div");

        message.className = "message " + type;
        message.textContent = text;

        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;

        return message;
    }

    /* =========================================
       MEMORY
       ========================================= */

    function getMemories() {

        try {
            return JSON.parse(
                localStorage.getItem("jarvisMemories") || "[]"
            );
        } catch {
            return [];
        }
    }

    function saveMemory(text) {

        const memories = getMemories();

        memories.push({
            text: text,
            time: new Date().toLocaleString()
        });

        localStorage.setItem(
            "jarvisMemories",
            JSON.stringify(memories)
        );

        if (memoryStatus) {
            memoryStatus.textContent = "● ACTIVE";
            memoryStatus.className = "on";
        }
    }

    function showMemories() {

        const memories = getMemories();

        if (memories.length === 0) {
            return "No memories stored yet, Boss.";
        }

        return "I currently have " +
            memories.length +
            " memory" +
            (memories.length === 1 ? "." : "ies.") +
            " Say 'show memories' to display them.";
    }

    /* =========================================
       COMMAND ENGINE
       ========================================= */

    function getResponse(text) {

        const command = text.toLowerCase().trim();

        if (
            command === "hello" ||
            command === "hi" ||
            command === "hey" ||
            command.includes("hello jarvis") ||
            command.includes("hey jarvis")
        ) {
            return "Hello, Boss. Systems are online.";
        }

        if (command.includes("how are you")) {
            return "All systems are operating normally, Boss.";
        }

        if (
            command.includes("who are you") ||
            command.includes("what are you")
        ) {
            return "I am J.A.R.V.I.S., your personal digital assistant.";
        }

        if (
            command === "status" ||
            command.includes("system status")
        ) {
            return "All primary systems are online. Core operating normally.";
        }

        if (command.includes("time")) {

            return "The current time is " +
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                }) +
                ", Boss.";
        }

        if (command.includes("date")) {

            return "Today's date is " +
                new Date().toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) +
                ", Boss.";
        }

        /* REMEMBER SOMETHING */

        if (command.startsWith("remember")) {

            const memory = text
                .replace(/^remember/i, "")
                .trim();

            if (!memory) {
                return "Tell me what you want me to remember, Boss.";
            }

            saveMemory(memory);

            return "Understood, Boss. I have stored that in memory.";
        }

        /* MEMORY */

        if (
            command === "memory" ||
            command === "memories"
        ) {
            return showMemories();
        }

        /* SHOW MEMORIES */

        if (
            command.includes("show memories") ||
            command.includes("show my memories") ||
            command.includes("list memories")
        ) {

            const memories = getMemories();

            if (memories.length === 0) {
                return "No memories stored yet, Boss.";
            }

            setTimeout(() => {

                memories.forEach((memory, index) => {

                    addMessage(
                        `${index + 1}. ${memory.text}`,
                        "ai"
                    );

                });

            }, 100);

            return "Displaying your stored memories, Boss.";
        }

        /* CLEAR CHAT */

        if (
            command === "clear" ||
            command === "clear chat"
        ) {

            chat.innerHTML = "";

            return "Communication log cleared.";
        }

        /* HELP */

        if (
            command === "help" ||
            command === "commands"
        ) {
            return "Try: hello, status, time, date, remember, memory, show memories, or clear chat.";
        }

        /* THANKS */

        if (
            command.includes("thank")
        ) {
            return "You're welcome, Boss.";
        }

        /* BYE */

        if (
            command === "bye" ||
            command.includes("goodbye")
        ) {
            return "Standing by, Boss.";
        }

        /* DEFAULT */

        return "Command received, Boss. Local J.A.R.V.I.S. systems are ready.";
    }

    /* =========================================
       SEND
       ========================================= */

    function sendMessage() {

        const text = input.value.trim();

        if (!text) {
            return;
        }

        addMessage(
            "YOU: " + text,
            "user"
        );

        input.value = "";

        if (chatState) {
            chatState.textContent = "PROCESSING";
        }

        send.disabled = true;

        const processing = addMessage(
            "J.A.R.V.I.S: Processing...",
            "ai"
        );

        setTimeout(() => {

            const response = getResponse(text);

            processing.textContent =
                "J.A.R.V.I.S: " + response;

            if (chatState) {
                chatState.textContent = "READY";
            }

            send.disabled = false;
            input.focus();

        }, 600);
    }

    /* =========================================
       SEND BUTTON
       ========================================= */

    send.addEventListener(
        "click",
        sendMessage
    );

    /* =========================================
       ENTER
       ========================================= */

    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();
            }
        }
    );

    /* =========================================
       VOICE INPUT
       ========================================= */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    let recognition = null;
    let listening = false;

    if (SpeechRecognition && voiceButton) {

        recognition = new SpeechRecognition();

        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {

            listening = true;

            if (voiceStatus) {
                voiceStatus.textContent = "● LISTENING";
                voiceStatus.className = "on";
            }

            if (voiceHead) {
                voiceHead.textContent = "LISTENING...";
            }

            if (chatState) {
                chatState.textContent = "VOICE";
            }
        };

        recognition.onresult = event => {

            const text =
                event.results[0][0].transcript;

            input.value = text;

            sendMessage();
        };

        recognition.onerror = event => {

            console.error(
                "Voice error:",
                event.error
            );

            listening = false;

            if (voiceStatus) {
                voiceStatus.textContent = "○ ERROR";
                voiceStatus.className = "off";
            }

            if (voiceHead) {
                voiceHead.textContent = "VOICE ERROR";
            }
        };

        recognition.onend = () => {

            listening = false;

            if (voiceStatus) {
                voiceStatus.textContent = "● READY";
                voiceStatus.className = "on";
            }

            if (voiceHead) {
                voiceHead.textContent = "VOICE SYSTEM";
            }

            if (chatState) {
                chatState.textContent = "READY";
            }
        };

        voiceButton.addEventListener(
            "click",
            () => {

                if (listening) {
                    recognition.stop();
                    return;
                }

                try {
                    recognition.start();
                } catch (error) {
                    console.log(error);
                }
            }
        );

        if (voiceStatus) {
            voiceStatus.textContent = "● READY";
            voiceStatus.className = "on";
        }

    } else {

        if (voiceStatus) {
            voiceStatus.textContent = "○ UNSUPPORTED";
            voiceStatus.className = "off";
        }

        if (voiceHead) {
            voiceHead.textContent = "VOICE NOT SUPPORTED";
        }
    }

    /* =========================================
       MEMORY STATUS
       ========================================= */

    if (getMemories().length > 0 && memoryStatus) {

        memoryStatus.textContent = "● ACTIVE";
        memoryStatus.className = "on";
    }

    /* =========================================
       STARTUP
       ========================================= */

    addMessage(
        "J.A.R.V.I.S: Hello, Boss. Systems are online.",
        "ai"
    );

});
