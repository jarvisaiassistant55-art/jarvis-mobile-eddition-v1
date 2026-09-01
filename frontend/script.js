/* =========================================================
   J.A.R.V.I.S. — MOBILE EDITION
   COMPLETE STABLE SCRIPT
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");

    const voiceButton = document.getElementById("voiceButton");
    const voiceStatus = document.getElementById("voiceStatus");
    const memoryStatus = document.getElementById("memoryStatus");
    const chatState = document.getElementById("chatState");
    const voiceHead = document.getElementById("voiceHead");

    if (!chat || !input || !send) {
        console.error("J.A.R.V.I.S.: UI elements missing.");
        return;
    }

    /* =====================================================
       MESSAGE SYSTEM
       ===================================================== */

    function addMessage(text, type = "ai") {

        const message = document.createElement("div");

        message.className = "message " + type;

        message.textContent = text;

        chat.appendChild(message);

        chat.scrollTop = chat.scrollHeight;

        return message;
    }

    /* =====================================================
       MEMORY
       ===================================================== */

    function loadMemories() {

        try {
            return JSON.parse(
                localStorage.getItem("jarvisMemories") || "[]"
            );
        } catch (error) {
            console.error("Memory load error:", error);
            return [];
        }
    }

    function saveMemory(text) {

        const memories = loadMemories();

        memories.push({
            text: text,
            date: new Date().toLocaleString()
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

    function getMemory() {

        const memories = loadMemories();

        if (memories.length === 0) {
            return "No memories stored yet, Boss.";
        }

        let response =
            "I have " +
            memories.length +
            " stored memor" +
            (memories.length === 1 ? "y." : "ies.");

        return response;
    }

    function showMemories() {

        const memories = loadMemories();

        if (memories.length === 0) {
            addMessage(
                "J.A.R.V.I.S: No memories stored yet, Boss.",
                "ai"
            );
            return;
        }

        addMessage(
            "J.A.R.V.I.S: Here are your stored memories:",
            "ai"
        );

        memories.forEach((memory, index) => {

            addMessage(
                `${index + 1}. ${memory.text}`,
                "ai"
            );

        });
    }

    /* =====================================================
       LOCAL COMMAND ENGINE
       ===================================================== */

    function getResponse(text) {

        const command = text.toLowerCase().trim();

        /* GREETING */

        if (
            command === "hello" ||
            command === "hi" ||
            command === "hey" ||
            command.includes("hello jarvis") ||
            command.includes("hey jarvis")
        ) {
            return "Hello, Boss. Systems are online.";
        }

        /* HOW ARE YOU */

        if (command.includes("how are you")) {
            return "All systems are operating normally, Boss.";
        }

        /* IDENTITY */

        if (
            command.includes("who are you") ||
            command.includes("what are you")
        ) {
            return "I am J.A.R.V.I.S., your personal digital assistant.";
        }

        /* STATUS */

        if (
            command === "status" ||
            command.includes("system status")
        ) {
            return "All primary systems are online. Core operating normally.";
        }

        /* TIME */

        if (command.includes("time")) {

            const time =
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                });

            return "The current time is " + time + ", Boss.";
        }

        /* DATE */

        if (command.includes("date")) {

            const date =
                new Date().toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

            return "Today's date is " + date + ", Boss.";
        }

        /* REMEMBER */

        if (command.startsWith("remember")) {

            let memory = text
                .replace(/^remember\s*/i, "")
                .trim();

            if (!memory) {
                return "What would you like me to remember, Boss?";
            }

            saveMemory(memory);

            return "Memory stored successfully, Boss.";
        }

        /* MEMORY COUNT */

        if (
            command === "memory" ||
            command === "memories" ||
            command.includes("how many memories")
        ) {
            return getMemory();
        }

        /* SHOW MEMORIES */

        if (
            command.includes("show memories") ||
            command.includes("show my memories") ||
            command.includes("list memories")
        ) {
            setTimeout(showMemories, 100);
            return "Displaying stored memories, Boss.";
        }

        /* CLEAR CHAT */

        if (
            command === "clear" ||
            command === "clear chat"
        ) {

            chat.innerHTML = "";

            return "Communication log cleared, Boss.";
        }

        /* HELP */

        if (
            command === "help" ||
            command === "commands"
        ) {
            return "Available commands include: hello, status, time, date, remember, memory, show memories, and clear chat.";
        }

        /* THANK YOU */

        if (
            command.includes("thank you") ||
            command.includes("thanks")
        ) {
            return "You're welcome, Boss.";
        }

        /* GOODBYE */

        if (
            command === "bye" ||
            command.includes("goodbye")
        ) {
            return "Standing by, Boss.";
        }

        /* DEFAULT */

        return "Command received, Boss. My local systems are ready, but an online AI provider still needs to be connected.";
    }

    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    function sendMessage() {

        const text = input.value.trim();

        if (!text || send.disabled) {
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

            speak(response);

        }, 500);
    }

    /* =====================================================
       SEND BUTTON
       ===================================================== */

    send.addEventListener(
        "click",
        sendMessage
    );

    /* =====================================================
       ENTER KEY
       ===================================================== */

    input.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();
            }
        }
    );

    /* =====================================================
       VOICE OUTPUT
       ===================================================== */

    function speak(text) {

        if (!("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.lang = "en-IN";
        speech.rate = 0.95;
        speech.pitch = 1.0;
        speech.volume = 1.0;

        window.speechSynthesis.speak(speech);
    }

    /* =====================================================
       VOICE INPUT
       ===================================================== */

    let recognition = null;
    let listening = false;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (SpeechRecognition) {

        recognition = new SpeechRecognition();

        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

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

        recognition.onresult = (event) => {

            const spokenText =
                event.results[0][0].transcript;

            input.value = spokenText;

            setTimeout(() => {
                sendMessage();
            }, 150);
        };

        recognition.onerror = (event) => {

            console.error(
                "J.A.R.V.I.S. voice error:",
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

            if (chatState) {
                chatState.textContent = "READY";
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

        if (voiceButton) {

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
                        console.log(
                            "Voice recognition could not start:",
                            error
                        );
                    }
                }
            );
        }

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
            voiceHead.textContent =
                "VOICE NOT SUPPORTED";
        }

        if (voiceButton) {

            voiceButton.addEventListener(
                "click",
                () => {

                    addMessage(
                        "J.A.R.V.I.S: Voice recognition is not supported by this browser.",
                        "ai"
                    );

                }
            );
        }
    }

    /* =====================================================
       INITIAL MEMORY STATUS
       ===================================================== */

    if (loadMemories().length > 0) {

        if (memoryStatus) {
            memoryStatus.textContent = "● ACTIVE";
            memoryStatus.className = "on";
        }
    }

    /* =====================================================
       STARTUP
       ===================================================== */

    setTimeout(() => {

        addMessage(
            "J.A.R.V.I.S: Hello, Boss. Systems are online.",
            "ai"
        );

    }, 300);

});
