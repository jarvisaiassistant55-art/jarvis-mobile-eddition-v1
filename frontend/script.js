/* =========================================================
   J.A.R.V.I.S. — MOBILE EDITION
   STABLE SCRIPT
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

    /* =====================================================
       SAFETY CHECK
       ===================================================== */

    if (!chat || !input || !send) {
        console.error("J.A.R.V.I.S.: Required UI elements not found.");
        return;
    }

    /* =====================================================
       ADD MESSAGE
       ===================================================== */

    function addMessage(text, type = "ai") {

        const message = document.createElement("div");

        message.className = "msg " + type;

        message.textContent = text;

        chat.appendChild(message);

        chat.scrollTop = chat.scrollHeight;

        return message;
    }

    /* =====================================================
       J.A.R.V.I.S. RESPONSE
       ===================================================== */

    function getResponse(text) {

        const command = text.toLowerCase().trim();

        if (
            command === "hello" ||
            command === "hi" ||
            command.includes("hey jarvis")
        ) {
            return "Hello, Boss. Systems are online.";
        }

        if (
            command.includes("how are you")
        ) {
            return "All systems are operating normally, Boss.";
        }

        if (
            command.includes("who are you")
        ) {
            return "I am J.A.R.V.I.S., your personal digital assistant.";
        }

        if (
            command.includes("status")
        ) {
            return "All primary systems are online. Core operating normally.";
        }

        if (
            command.includes("time")
        ) {
            return "The current time is " +
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                });
        }

        if (
            command.includes("date")
        ) {
            return "Today's date is " +
                new Date().toLocaleDateString();
        }

        if (
            command.includes("remember")
        ) {
            saveMemory(text);
            return "Memory stored successfully, Boss.";
        }

        if (
            command.includes("memory")
        ) {
            return getMemory();
        }

        if (
            command === "clear"
            ||
            command === "clear chat"
        ) {
            chat.innerHTML = "";
            return "Communication log cleared.";
        }

        return "I received your command, Boss. Online AI connection is not configured yet.";
    }

    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    function sendMessage() {

        const text = input.value.trim();

        if (!text) {
            return;
        }

        addMessage("YOU: " + text, "user");

        input.value = "";

        chatState.textContent = "PROCESSING";

        const processing = addMessage(
            "J.A.R.V.I.S: Processing...",
            "ai"
        );

        send.disabled = true;

        setTimeout(() => {

            processing.textContent =
                "J.A.R.V.I.S: " + getResponse(text);

            chatState.textContent = "READY";

            send.disabled = false;

            input.focus();

        }, 700);
    }

    /* =====================================================
       SEND BUTTON
       ===================================================== */

    send.addEventListener("click", sendMessage);

    /* =====================================================
       ENTER KEY
       ===================================================== */

    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();
        }
    });

    /* =====================================================
       MEMORY SYSTEM
       ===================================================== */

    function saveMemory(text) {

        let memories =
            JSON.parse(
                localStorage.getItem("jarvisMemories") || "[]"
            );

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

        const memories =
            JSON.parse(
                localStorage.getItem("jarvisMemories") || "[]"
            );

        if (memories.length === 0) {
            return "No memories stored yet, Boss.";
        }

        return "I have " +
            memories.length +
            " stored memor" +
            (memories.length === 1 ? "y." : "ies.");
    }

    /* =====================================================
       VOICE SYSTEM
       ===================================================== */

    let recognition = null;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (SpeechRecognition) {

        recognition = new SpeechRecognition();

        recognition.lang = "en-IN";

        recognition.continuous = false;

        recognition.interimResults = false;

        recognition.onstart = () => {

            if (voiceStatus) {
                voiceStatus.textContent = "● LISTENING";
                voiceStatus.className = "on";
            }

            if (voiceHead) {
                voiceHead.textContent = "LISTENING...";
            }

            chatState.textContent = "VOICE";
        };

        recognition.onresult = (event) => {

            const spokenText =
                event.results[0][0].transcript;

            input.value = spokenText;

            sendMessage();
        };

        recognition.onerror = (event) => {

            console.error(
                "Voice error:",
                event.error
            );

            if (voiceStatus) {
                voiceStatus.textContent = "○ ERROR";
                voiceStatus.className = "off";
            }

            if (voiceHead) {
                voiceHead.textContent = "VOICE ERROR";
            }

            chatState.textContent = "READY";
        };

        recognition.onend = () => {

            if (voiceStatus) {
                voiceStatus.textContent = "● READY";
                voiceStatus.className = "on";
            }

            if (voiceHead) {
                voiceHead.textContent = "VOICE SYSTEM";
            }

            chatState.textContent = "READY";
        };

        if (voiceButton) {

            voiceButton.addEventListener("click", () => {

                try {
                    recognition.start();
                } catch (error) {
                    console.log(
                        "Voice recognition already running."
                    );
                }
            });
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

            voiceButton.addEventListener("click", () => {

                addMessage(
                    "J.A.R.V.I.S: Voice recognition is not supported by this browser.",
                    "ai"
                );

            });
        }
    }

    /* =====================================================
       INITIAL STATUS
       ===================================================== */

    if (memoryStatus) {

        const memories =
            JSON.parse(
                localStorage.getItem("jarvisMemories") || "[]"
            );

        if (memories.length > 0) {

            memoryStatus.textContent = "● ACTIVE";
            memoryStatus.className = "on";
        }
    }

    /* =====================================================
       STARTUP MESSAGE
       ===================================================== */

    setTimeout(() => {

        addMessage(
            "J.A.R.V.I.S: Systems online. How may I assist you, Boss?",
            "ai"
        );

    }, 500);

});
