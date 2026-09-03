"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       J.A.R.V.I.S. — MOBILE VOICE EDITION
       MATCHED TO YOUR CURRENT INDEX.HTML
       ===================================================== */

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");

    const voiceButton = document.getElementById("voiceButton");
    const voiceStatus = document.getElementById("voiceStatus");
    const voiceHead = document.getElementById("voiceHead");

    const memoryStatus = document.getElementById("memoryStatus");
    const aiStatus = document.getElementById("aiStatus");
    const networkStatus = document.getElementById("networkStatus");
    const chatState = document.getElementById("chatState");

    /* =====================================================
       SAFETY CHECK
       ===================================================== */

    if (!chat || !input || !send) {
        console.error("J.A.R.V.I.S.: Chat elements not found.");
        return;
    }

    /* =====================================================
       MESSAGE DISPLAY
       ===================================================== */

    function addMessage(sender, text, type = "") {

        const message = document.createElement("div");

        message.className = "jarvis-message";

        if (type) {
            message.classList.add(type);
        }

        message.textContent = sender + ": " + text;

        chat.appendChild(message);

        chat.scrollTop = chat.scrollHeight;
    }

    /* =====================================================
       JARVIS SPEAK
       ===================================================== */

    function speak(text) {

        if (!("speechSynthesis" in window)) {
            console.log("Speech synthesis unavailable.");
            return;
        }

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);

        speech.lang = "en-IN";
        speech.rate = 0.9;
        speech.pitch = 0.9;
        speech.volume = 1;

        speech.onstart = () => {

            if (voiceStatus) {
                voiceStatus.textContent = "● SPEAKING";
                voiceStatus.className = "on";
            }

            if (voiceHead) {
                voiceHead.textContent = "J.A.R.V.I.S. SPEAKING";
            }
        };

        speech.onend = () => {

            if (voiceStatus) {
                voiceStatus.textContent = "● READY";
                voiceStatus.className = "on";
            }

            if (voiceHead) {
                voiceHead.textContent = "VOICE SYSTEM";
            }
        };

        speech.onerror = () => {

            if (voiceStatus) {
                voiceStatus.textContent = "○ VOICE ERROR";
                voiceStatus.className = "off";
            }
        };

        window.speechSynthesis.speak(speech);
    }

    /* =====================================================
       JARVIS RESPONSE
       ===================================================== */

    function jarvisReply(command) {

        const text = command.toLowerCase().trim();

        let response = "";

        /* HELLO */

        if (
            text === "hello" ||
            text === "hi" ||
            text === "hey"
        ) {

            response =
                "Good morning, Boss. All systems are online. How may I assist you?";
        }

        /* HOW ARE YOU */

        else if (text.includes("how are you")) {

            response =
                "All systems are functioning normally, Boss.";
        }

        /* WHO ARE YOU */

        else if (
            text.includes("who are you") ||
            text.includes("what are you")
        ) {

            response =
                "I am J.A.R.V.I.S., your personal artificial intelligence assistant.";
        }

        /* TIME */

        else if (text.includes("time")) {

            const now = new Date();

            const time = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            response =
                "The current time is " + time + ", Boss.";
        }

        /* DATE */

        else if (
            text.includes("date") ||
            text.includes("today")
        ) {

            const now = new Date();

            const date = now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            response =
                "Today is " + date + ", Boss.";
        }

        /* MEMORY UNLOCK */

        else if (
            text === "memory unlock" ||
            text === "unlock memory"
        ) {

            if (memoryStatus) {

                memoryStatus.textContent = "● UNLOCKED";
                memoryStatus.className = "on";
            }

            response =
                "Memory core unlocked. Historical context and persistent storage are active.";
        }

        /* MEMORY STATUS */

        else if (
            text.includes("memory status") ||
            text === "memory"
        ) {

            if (memoryStatus) {

                memoryStatus.textContent = "● UNLOCKED";
                memoryStatus.className = "on";
            }

            response =
                "Memory core is operational, Boss.";
        }

        /* STATUS */

        else if (
            text.includes("system status") ||
            text === "status"
        ) {

            response =
                "All primary systems are online. AI core and network are operational.";
        }

        /* THANK YOU */

        else if (
            text.includes("thank you") ||
            text.includes("thanks")
        ) {

            response =
                "You're welcome, Boss.";
        }

        /* GOODBYE */

        else if (
            text === "bye" ||
            text.includes("goodbye")
        ) {

            response =
                "Standing by, Boss.";
        }

        /* DEFAULT */

        else {

            response =
                "Command received, Boss. I heard: " + command;
        }

        addMessage("J.A.R.V.I.S.", response, "ai");

        speak(response);
    }

    /* =====================================================
       PROCESS COMMAND
       ===================================================== */

    function processCommand(command) {

        const text = command.trim();

        if (!text) return;

        addMessage("YOU", text, "user");

        input.value = "";

        if (chatState) {
            chatState.textContent = "PROCESSING";
        }

        setTimeout(() => {

            jarvisReply(text);

            if (chatState) {
                chatState.textContent = "READY";
            }

        }, 300);
    }

    /* =====================================================
       SEND BUTTON
       ===================================================== */

    send.addEventListener("click", () => {

        processCommand(input.value);
    });

    /* =====================================================
       ENTER KEY
       ===================================================== */

    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            processCommand(input.value);
        }
    });

    /* =====================================================
       SPEECH RECOGNITION
       ===================================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    let recognition = null;
    let listening = false;

    if (!SpeechRecognition) {

        if (voiceStatus) {
            voiceStatus.textContent = "○ NOT SUPPORTED";
            voiceStatus.className = "off";
        }

        if (voiceHead) {
            voiceHead.textContent =
                "VOICE NOT SUPPORTED BY BROWSER";
        }

        console.warn(
            "J.A.R.V.I.S.: Speech recognition is not supported."
        );

    } else {

        recognition = new SpeechRecognition();

        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        /* ---------------------------------------------
           VOICE BUTTON
           --------------------------------------------- */

        voiceButton.addEventListener("click", () => {

            if (listening) {

                recognition.stop();

                return;
            }

            /* Stop JARVIS speaking */

            if ("speechSynthesis" in window) {
                speechSynthesis.cancel();
            }

            try {

                recognition.start();

            } catch (error) {

                console.log(
                    "Recognition start:",
                    error
                );
            }
        });

        /* ---------------------------------------------
           LISTENING START
           --------------------------------------------- */

        recognition.onstart = () => {

            listening = true;

            voiceButton.classList.add("active");

            voiceButton.innerHTML =
                "🔴 <span>LISTENING</span>";

            if (voiceStatus) {
                voiceStatus.textContent =
                    "● LISTENING";
                voiceStatus.className = "on";
            }

            if (voiceHead) {
                voiceHead.textContent =
                    "LISTENING FOR COMMAND";
            }

            if (chatState) {
                chatState.textContent =
                    "LISTENING";
            }
        };

        /* ---------------------------------------------
           SPEECH RESULT
           --------------------------------------------- */

        recognition.onresult = (event) => {

            const result =
                event.results[0][0].transcript;

            if (!result) return;

            input.value = result;

            processCommand(result);
        };

        /* ---------------------------------------------
           LISTENING END
           --------------------------------------------- */

        recognition.onend = () => {

            listening = false;

            voiceButton.classList.remove("active");

            voiceButton.innerHTML =
                "🎙️ <span>VOICE</span>";

            if (voiceStatus) {
                voiceStatus.textContent =
                    "● READY";
                voiceStatus.className = "on";
            }

            if (voiceHead) {
                voiceHead.textContent =
                    "VOICE SYSTEM";
            }

            if (chatState) {
                chatState.textContent =
                    "READY";
            }
        };

        /* ---------------------------------------------
           VOICE ERROR
           --------------------------------------------- */

        recognition.onerror = (event) => {

            listening = false;

            voiceButton.classList.remove("active");

            voiceButton.innerHTML =
                "🎙️ <span>VOICE</span>";

            console.error(
                "J.A.R.V.I.S. voice error:",
                event.error
            );

            if (event.error === "not-allowed") {

                if (voiceStatus) {
                    voiceStatus.textContent =
                        "○ MIC PERMISSION";
                    voiceStatus.className = "off";
                }

                if (voiceHead) {
                    voiceHead.textContent =
                        "ALLOW MICROPHONE ACCESS";
                }

            } else if (event.error === "no-speech") {

                if (voiceStatus) {
                    voiceStatus.textContent =
                        "○ NO SPEECH";
                    voiceStatus.className = "off";
                }

            } else {

                if (voiceStatus) {
                    voiceStatus.textContent =
                        "○ VOICE ERROR";
                    voiceStatus.className = "off";
                }
            }
        };
    }

    /* =====================================================
       INITIAL STATUS
       ===================================================== */

    if (aiStatus) {
        aiStatus.textContent = "● ONLINE";
        aiStatus.className = "on";
    }

    if (networkStatus) {
        networkStatus.textContent = "● ONLINE";
        networkStatus.className = "on";
    }

    if (voiceStatus && SpeechRecognition) {
        voiceStatus.textContent = "● READY";
        voiceStatus.className = "on";
    }

    /* =====================================================
       STARTUP MESSAGE
       ===================================================== */

    addMessage(
        "J.A.R.V.I.S.",
        "Voice interface initialized. Systems ready, Boss.",
        "ai"
    );

});
