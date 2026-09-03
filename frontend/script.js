
/* =========================================================
   J.A.R.V.I.S. — VOICE + CHAT + MEMORY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       UI ELEMENTS
       ===================================================== */

    const memoryStatus = document.getElementById("memory-status");
    const chatOutput = document.getElementById("chat-output");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    if (!chatOutput || !userInput || !sendBtn) {
        console.error("J.A.R.V.I.S.: Required UI elements not found.");
        return;
    }

    /* =====================================================
       VOICE SUPPORT
       ===================================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    let recognition = null;
    let isListening = false;

    /* Create microphone button if HTML doesn't already have one */
    let voiceBtn = document.getElementById("voice-btn");

    if (!voiceBtn) {
        voiceBtn = document.createElement("button");
        voiceBtn.id = "voice-btn";
        voiceBtn.type = "button";
        voiceBtn.innerText = "🎤";
        voiceBtn.title = "Talk to J.A.R.V.I.S.";

        sendBtn.parentNode.insertBefore(
            voiceBtn,
            sendBtn.nextSibling
        );
    }

    /* Create voice status */
    let voiceStatus = document.getElementById("voice-status");

    if (!voiceStatus) {
        voiceStatus = document.createElement("span");
        voiceStatus.id = "voice-status";
        voiceStatus.innerText = "Voice Ready";
        voiceStatus.style.marginLeft = "8px";
        voiceStatus.style.fontSize = "12px";

        voiceBtn.parentNode.appendChild(voiceStatus);
    }

    /* =====================================================
       TEXT TO SPEECH
       ===================================================== */

    function speak(text) {

        if (!("speechSynthesis" in window)) {
            console.warn("Speech synthesis is not supported.");
            return;
        }

        window.speechSynthesis.cancel();

        const cleanText = text
            .replace(/^J\.A\.R\.V\.I\.S:\s*/i, "")
            .replace(/^User:\s*/i, "")
            .trim();

        if (!cleanText) return;

        const speech = new SpeechSynthesisUtterance(cleanText);

        speech.lang = "en-IN";
        speech.rate = 0.95;
        speech.pitch = 0.9;
        speech.volume = 1;

        speech.onstart = () => {
            voiceStatus.innerText = "🔊 Speaking...";
        };

        speech.onend = () => {
            voiceStatus.innerText = "Voice Ready";
        };

        speech.onerror = () => {
            voiceStatus.innerText = "Voice Ready";
        };

        window.speechSynthesis.speak(speech);
    }

    /* =====================================================
       APPEND MESSAGE
       ===================================================== */

    function appendMessage(text, speakMessage = false) {

        const msgElement = document.createElement("p");

        msgElement.className = "jarvis-msg";
        msgElement.innerText = text;

        chatOutput.appendChild(msgElement);

        chatOutput.scrollTop = chatOutput.scrollHeight;

        if (speakMessage) {
            speak(text);
        }
    }

    /* =====================================================
       MEMORY UNLOCK
       ===================================================== */

    function unlockMemory() {

        if (memoryStatus) {

            memoryStatus.innerText = "• UNLOCKED";

            memoryStatus.style.color = "#00ffcc";

            memoryStatus.classList.remove("state-locked");

            memoryStatus.classList.add("state-active");
        }

        const response =
            "J.A.R.V.I.S: Memory core unlocked. Historical context and persistent storage active.";

        appendMessage(response, true);
    }

    /* =====================================================
       JARVIS RESPONSE
       ===================================================== */

    function getJarvisResponse(text) {

        const query = text.trim().toLowerCase();

        if (
            query === "memory unlock" ||
            query === "unlock memory"
        ) {
            unlockMemory();
            return;
        }

        let response;

        if (
            query === "hello" ||
            query === "hi" ||
            query === "hey"
        ) {
            response =
                "J.A.R.V.I.S: Good morning, Boss. Systems are online. How may I assist you?";
        }

        else if (
            query.includes("how are you")
        ) {
            response =
                "J.A.R.V.I.S: All systems are functioning normally, Boss.";
        }

        else if (
            query.includes("who are you")
        ) {
            response =
                "J.A.R.V.I.S: I am your J.A.R.V.I.S. interface, ready to assist you.";
        }

        else if (
            query.includes("time")
        ) {
            const time = new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

            response =
                `J.A.R.V.I.S: The current time is ${time}.`;
        }

        else if (
            query.includes("date")
        ) {
            const date = new Date().toLocaleDateString(
                [],
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

            response =
                `J.A.R.V.I.S: Today is ${date}.`;
        }

        else {
            response =
                `J.A.R.V.I.S: I received your command: "${text}".`;
        }

        appendMessage(response, true);
    }

    /* =====================================================
       PROCESS COMMAND
       ===================================================== */

    function processCommand(text) {

        const command = text.trim();

        if (!command) return;

        appendMessage(`User: ${command}`);

        getJarvisResponse(command);
    }

    /* =====================================================
       SEND BUTTON
       ===================================================== */

    sendBtn.addEventListener("click", () => {

        const text = userInput.value.trim();

        if (!text) return;

        processCommand(text);

        userInput.value = "";
    });

    /* =====================================================
       ENTER KEY
       ===================================================== */

    userInput.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            const text = userInput.value.trim();

            if (!text) return;

            processCommand(text);

            userInput.value = "";
        }
    });

    /* =====================================================
       SPEECH RECOGNITION
       ===================================================== */

    if (!SpeechRecognition) {

        voiceBtn.disabled = true;

        voiceBtn.innerText = "🎤❌";

        voiceStatus.innerText =
            "Speech recognition unavailable";

        console.warn(
            "J.A.R.V.I.S.: Speech recognition is not supported by this browser."
        );

    } else {

        recognition = new SpeechRecognition();

        recognition.lang = "en-IN";

        recognition.continuous = false;

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;

        /* -----------------------------------------------
           MICROPHONE START
           ----------------------------------------------- */

        voiceBtn.addEventListener("click", () => {

            if (isListening) {

                recognition.stop();

                return;
            }

            try {

                window.speechSynthesis.cancel();

                recognition.start();

            } catch (error) {

                console.error(
                    "Microphone start error:",
                    error
                );
            }
        });

        /* -----------------------------------------------
           LISTENING STARTED
           ----------------------------------------------- */

        recognition.onstart = () => {

            isListening = true;

            voiceBtn.innerText = "🔴";

            voiceStatus.innerText =
                "🎤 Listening...";

        };

        /* -----------------------------------------------
           SPEECH RESULT
           ----------------------------------------------- */

        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;

            if (!transcript) return;

            userInput.value = transcript;

            processCommand(transcript);

            userInput.value = "";
        };

        /* -----------------------------------------------
           LISTENING ENDED
           ----------------------------------------------- */

        recognition.onend = () => {

            isListening = false;

            voiceBtn.innerText = "🎤";

            voiceStatus.innerText =
                "Voice Ready";
        };

        /* -----------------------------------------------
           ERROR
           ----------------------------------------------- */

        recognition.onerror = (event) => {

            isListening = false;

            voiceBtn.innerText = "🎤";

            console.error(
                "Speech recognition error:",
                event.error
            );

            if (event.error === "not-allowed") {

                voiceStatus.innerText =
                    "Microphone permission denied";

            } else if (event.error === "no-speech") {

                voiceStatus.innerText =
                    "No speech detected";

            } else {

                voiceStatus.innerText =
                    "Voice error";
            }
        };
    }

    /* =====================================================
       INITIAL JARVIS MESSAGE
       ===================================================== */

    appendMessage(
        "J.A.R.V.I.S: Voice interface initialized. Say something, Boss."
    );

});
