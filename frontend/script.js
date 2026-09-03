/* =========================================================
   J.A.R.V.I.S. — STABLE REPLACEMENT SCRIPT
   Chat + Send Button + Enter Key + Voice Input
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------------------------
    // GET ELEMENTS
    // ---------------------------------------------------------

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");

    const voiceButton = document.getElementById("voiceButton");
    const voiceStatus = document.getElementById("voiceStatus");

    // ---------------------------------------------------------
    // SAFETY CHECK
    // ---------------------------------------------------------

    if (!chat || !input || !send) {
        console.error("J.A.R.V.I.S.: Required elements not found.");
        return;
    }

    console.log("J.A.R.V.I.S.: Script loaded successfully.");

    // ---------------------------------------------------------
    // ADD MESSAGE
    // ---------------------------------------------------------

    function addMessage(sender, text, type) {

        const message = document.createElement("div");

        message.className = "message " + (type || "");

        message.textContent = sender + ": " + text;

        chat.appendChild(message);

        chat.scrollTop = chat.scrollHeight;

        return message;
    }

    // ---------------------------------------------------------
    // JARVIS RESPONSE
    // ---------------------------------------------------------

    function getJarvisReply(text) {

        const command = text.toLowerCase().trim();

        if (
            command === "hello" ||
            command === "hi" ||
            command.includes("hello jarvis") ||
            command.includes("hi jarvis")
        ) {
            return "Hello, Boss. Systems are online. How may I assist you?";
        }

        if (
            command.includes("how are you") ||
            command.includes("how are things")
        ) {
            return "All systems are functioning normally, Boss.";
        }

        if (
            command.includes("who are you") ||
            command.includes("what are you")
        ) {
            return "I am J.A.R.V.I.S., your personal digital assistant.";
        }

        if (
            command.includes("time")
        ) {
            return "The current time is " +
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                }) + ".";
        }

        if (
            command.includes("date") ||
            command.includes("today")
        ) {
            return "Today is " +
                new Date().toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) + ".";
        }

        if (
            command.includes("thank")
        ) {
            return "You're welcome, Boss.";
        }

        if (
            command.includes("good morning")
        ) {
            return "Good morning, Boss. J.A.R.V.I.S. is ready.";
        }

        if (
            command.includes("good night")
        ) {
            return "Good night, Boss. Systems will remain ready.";
        }

        if (
            command.includes("status") ||
            command.includes("system status")
        ) {
            return "All local J.A.R.V.I.S. systems are operational.";
        }

        if (
            command.includes("help")
        ) {
            return "You can ask me about the time, date, system status, or simply say hello.";
        }

        return "I received your message, Boss. Online AI connection is not configured yet.";
    }

    // ---------------------------------------------------------
    // SEND MESSAGE
    // ---------------------------------------------------------

    function sendMessage() {

        const text = input.value.trim();

        if (!text) {
            return;
        }

        // Show user message
        addMessage("YOU", text, "user");

        // Clear input
        input.value = "";

        // Disable temporarily
        send.disabled = true;

        // Processing message
        const processing = addMessage(
            "J.A.R.V.I.S.",
            "Processing...",
            "ai"
        );

        // Small response delay
        setTimeout(() => {

            const reply = getJarvisReply(text);

            processing.textContent =
                "J.A.R.V.I.S.: " + reply;

            chat.scrollTop = chat.scrollHeight;

            send.disabled = false;

            input.focus();

            // Optional voice response
            speak(reply);

        }, 600);
    }

    // ---------------------------------------------------------
    // SEND BUTTON
    // ---------------------------------------------------------

    send.addEventListener("click", (event) => {

        event.preventDefault();

        sendMessage();

    });

    // ---------------------------------------------------------
    // ENTER KEY
    // ---------------------------------------------------------

    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    });

    // ---------------------------------------------------------
    // VOICE OUTPUT
    // ---------------------------------------------------------

    function speak(text) {

        if (!("speechSynthesis" in window)) {
            return;
        }

        try {

            window.speechSynthesis.cancel();

            const speech = new SpeechSynthesisUtterance(text);

            speech.rate = 1;
            speech.pitch = 1;
            speech.volume = 1;

            window.speechSynthesis.speak(speech);

        } catch (error) {

            console.log("Voice output unavailable:", error);

        }
    }

    // ---------------------------------------------------------
    // VOICE INPUT
    // ---------------------------------------------------------

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (voiceButton && SpeechRecognition) {

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        voiceButton.addEventListener("click", () => {

            try {

                recognition.start();

                if (voiceStatus) {
                    voiceStatus.textContent = "Listening...";
                }

            } catch (error) {

                console.log("Voice already active.");

            }

        });

        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;

            input.value = transcript;

            if (voiceStatus) {
                voiceStatus.textContent = "Voice received";
            }

            sendMessage();

        };

        recognition.onerror = (event) => {

            console.log("Voice error:", event.error);

            if (voiceStatus) {
                voiceStatus.textContent = "Voice unavailable";
            }

        };

        recognition.onend = () => {

            if (voiceStatus) {
                voiceStatus.textContent = "Ready";
            }

        };

    } else if (voiceButton) {

        voiceButton.addEventListener("click", () => {

            if (voiceStatus) {
                voiceStatus.textContent =
                    "Voice recognition is not supported.";
            }

        });

    }

    // ---------------------------------------------------------
    // INITIAL MESSAGE
    // ---------------------------------------------------------

    if (chat.children.length === 0) {

        addMessage(
            "J.A.R.V.I.S.",
            "Systems online. How may I assist you, Boss?",
            "ai"
        );

    }

    // ---------------------------------------------------------
    // FOCUS INPUT
    // ---------------------------------------------------------

    input.focus();

});
