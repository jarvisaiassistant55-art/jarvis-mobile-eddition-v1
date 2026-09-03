"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");

    const voiceButton = document.getElementById("voiceButton");
    const voiceStatus = document.getElementById("voiceStatus");
    const memoryStatus = document.getElementById("memoryStatus");
    const chatState = document.getElementById("chatState");
    const voiceHead = document.getElementById("voiceHead");

    let unlocked = false;
    let listening = false;
    let recognition = null;

    /* =====================================================
       MEMORY
       ===================================================== */

    let memories = JSON.parse(
        localStorage.getItem("jarvis_memories") || "[]"
    );

    function saveMemories() {
        localStorage.setItem(
            "jarvis_memories",
            JSON.stringify(memories)
        );
    }

    function addMemory(text) {
        memories.push({
            text: text,
            time: new Date().toLocaleString()
        });

        saveMemories();
    }

    function showMemories() {

        if (memories.length === 0) {
            jarvis("Memory database is empty, Boss.");
            return;
        }

        jarvis("I found " + memories.length + " stored memories.");

        memories.forEach((memory, index) => {

            addMessage(
                "MEMORY " + (index + 1),
                memory.text + " — " + memory.time,
                "ai"
            );

        });
    }

    function clearMemories() {

        memories = [];

        saveMemories();

        jarvis("Memory database cleared.");
    }


    /* =====================================================
       CHAT
       ===================================================== */

    function addMessage(sender, text, type) {

        const message = document.createElement("div");

        message.className = "message " + type;

        const title = document.createElement("strong");
        title.textContent = sender;

        const content = document.createElement("span");
        content.textContent = text;

        message.appendChild(title);
        message.appendChild(content);

        chat.appendChild(message);

        chat.scrollTop = chat.scrollHeight;
    }

    function jarvis(text) {
        addMessage("J.A.R.V.I.S.", text, "ai");
    }

    function userMessage(text) {
        addMessage("YOU", text, "user");
    }


    /* =====================================================
       LOCK / UNLOCK
       ===================================================== */

    function unlockJarvis() {

        unlocked = true;

        if (voiceStatus) {
            voiceStatus.textContent = "● UNLOCKED";
            voiceStatus.className = "on";
        }

        if (memoryStatus) {
            memoryStatus.textContent = "● UNLOCKED";
            memoryStatus.className = "on";
        }

        if (chatState) {
            chatState.textContent = "READY";
        }

        if (voiceHead) {
            voiceHead.textContent = "VOICE + MEMORY READY";
        }

        jarvis(
            "Voice and memory systems unlocked, Boss."
        );
    }


    function lockJarvis() {

        unlocked = false;

        if (voiceStatus) {
            voiceStatus.textContent = "○ LOCKED";
            voiceStatus.className = "off";
        }

        if (memoryStatus) {
            memoryStatus.textContent = "○ LOCKED";
            memoryStatus.className = "off";
        }

        if (chatState) {
            chatState.textContent = "LOCKED";
        }

        if (voiceHead) {
            voiceHead.textContent = "VOICE + MEMORY LOCKED";
        }

        jarvis("Voice and memory systems locked.");
    }


    /* =====================================================
       REPLY ENGINE
       ===================================================== */

    function getReply(text) {

        const t = text.toLowerCase().trim();


        if (t === "hello" || t === "hi" || t === "hey") {
            return "Good to hear from you, Boss. All systems are operational.";
        }


        if (
            t.includes("who are you") ||
            t.includes("what are you")
        ) {
            return "I am J.A.R.V.I.S., your mobile assistant interface.";
        }


        if (t.includes("how are you")) {
            return "All systems are operating normally, Boss.";
        }


        /* TIME */

        if (
            t === "time" ||
            t.includes("what time")
        ) {

            return "The current time is " +
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                }) + ".";
        }


        /* DATE */

        if (
            t === "date" ||
            t.includes("what date") ||
            t.includes("today date")
        ) {

            return "Today is " +
                new Date().toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) + ".";
        }


        /* STATUS */

        if (t.includes("status")) {

            return "AI core online. Network online. Voice " +
                (unlocked ? "unlocked" : "locked") +
                ". Memory " +
                (unlocked ? "unlocked" : "locked") +
                ".";
        }


        /* SAVE MEMORY */

        if (
            t.startsWith("remember ") ||
            t.startsWith("remember that ")
        ) {

            let memory = text
                .replace(/^remember that /i, "")
                .replace(/^remember /i, "")
                .trim();

            if (!memory) {
                return "Tell me what you want me to remember.";
            }

            addMemory(memory);

            return "Memory saved, Boss.";
        }


        /* SHOW MEMORY */

        if (
            t.includes("show my memories") ||
            t.includes("show memories") ||
            t === "memory" ||
            t === "memories"
        ) {

            showMemories();

            return null;
        }


        /* MEMORY COUNT */

        if (
            t.includes("how many memories") ||
            t.includes("memory count")
        ) {

            return "I currently have " +
                memories.length +
                " stored memories.";
        }


        /* CLEAR MEMORY */

        if (
            t.includes("clear memories") ||
            t.includes("delete memories") ||
            t.includes("erase memories")
        ) {

            clearMemories();

            return null;
        }


        /* LOCK */

        if (
            t === "lock" ||
            t.includes("lock jarvis") ||
            t.includes("lock system")
        ) {

            setTimeout(lockJarvis, 100);

            return "Locking voice and memory systems.";
        }


        /* HELP */

        if (
            t === "help" ||
            t.includes("what can you do")
        ) {

            return "I can respond to commands, tell you the time and date, store local memories, show memories, and control the voice interface.";
        }


        if (
            t.includes("thank you") ||
            t.includes("thanks")
        ) {

            return "You're welcome, Boss.";
        }


        return "Command received, Boss. My local assistant engine does not have an answer for that yet.";
    }


    /* =====================================================
       SEND
       ===================================================== */

    function sendMessage() {

        const text = input.value.trim();

        if (!text) return;

        userMessage(text);

        input.value = "";


        /* LOCKED */

        if (!unlocked) {

            const lower = text.toLowerCase();

            if (
                lower.includes("jarvis") &&
                (
                    lower.includes("unlock") ||
                    lower.includes("activate") ||
                    lower.includes("wake")
                )
            ) {

                unlockJarvis();
                return;
            }

            jarvis(
                'Systems locked. Press VOICE and say "Jarvis" to unlock voice and memory.'
            );

            return;
        }


        if (chatState) {
            chatState.textContent = "PROCESSING";
        }


        const reply = getReply(text);


        if (reply === null) {
            if (chatState) {
                chatState.textContent = "READY";
            }
            return;
        }


        setTimeout(() => {

            jarvis(reply);

            if (chatState) {
                chatState.textContent = "READY";
            }

        }, 350);
    }


    send.addEventListener("click", sendMessage);


    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();
        }
    });


    /* =====================================================
       VOICE
       ===================================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (SpeechRecognition) {

        recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";


        recognition.onstart = () => {

            listening = true;

            if (chatState) {
                chatState.textContent = "LISTENING";
            }

            if (voiceHead) {
                voiceHead.textContent = "LISTENING...";
            }

            if (voiceButton) {
                voiceButton.classList.add("active");
            }
        };


        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript
                    .toLowerCase()
                    .trim();

            console.log("Heard:", transcript);


            /* UNLOCK */

            if (
                transcript.includes("jarvis") ||
                transcript.includes("hey jarvis") ||
                transcript.includes("okay jarvis")
            ) {

                if (!unlocked) {

                    unlockJarvis();

                } else {

                    jarvis("I'm listening, Boss.");
                }

                return;
            }


            /* COMMAND */

            if (unlocked) {

                input.value = transcript;

                sendMessage();

            } else {

                jarvis(
                    'Please say "Jarvis" to unlock the system.'
                );
            }
        };


        recognition.onend = () => {

            listening = false;

            if (voiceButton) {
                voiceButton.classList.remove("active");
            }

            if (voiceHead) {
                voiceHead.textContent =
                    unlocked
                        ? "VOICE + MEMORY READY"
                        : "VOICE + MEMORY LOCKED";
            }

            if (chatState) {
                chatState.textContent =
                    unlocked ? "READY" : "LOCKED";
            }
        };


        recognition.onerror = (event) => {

            console.log(
                "Voice error:",
                event.error
            );

            listening = false;

            if (voiceButton) {
                voiceButton.classList.remove("active");
            }

            if (voiceHead) {

                if (event.error === "not-allowed") {
                    voiceHead.textContent =
                        "ALLOW MICROPHONE ACCESS";
                } else {
                    voiceHead.textContent =
                        "VOICE ERROR";
                }
            }
        };


        if (voiceButton) {

            voiceButton.addEventListener("click", async () => {

                if (listening) {

                    try {
                        recognition.stop();
                    } catch (e) {}

                    return;
                }


                try {

                    if (
                        navigator.mediaDevices &&
                        navigator.mediaDevices.getUserMedia
                    ) {

                        const stream =
                            await navigator.mediaDevices.getUserMedia({
                                audio: true
                            });

                        stream.getTracks().forEach(
                            track => track.stop()
                        );
                    }

                } catch (error) {

                    jarvis(
                        "Microphone permission is required. Please allow microphone access."
                    );

                    if (voiceHead) {
                        voiceHead.textContent =
                            "MICROPHONE REQUIRED";
                    }

                    return;
                }


                try {

                    recognition.start();

                } catch (error) {

                    console.log(error);
                }
            });
        }

    } else {

        if (voiceHead) {
            voiceHead.textContent =
                "VOICE NOT SUPPORTED";
        }

        jarvis(
            "Voice recognition is not supported by this browser."
        );
    }


    /* =====================================================
       STARTUP
       ===================================================== */

    if (aiStatus) {
        aiStatus.textContent = "● ONLINE";
        aiStatus.className = "on";
    }

    if (networkStatus) {
        networkStatus.textContent = "● ONLINE";
        networkStatus.className = "on";
    }

    lockJarvis();

    setTimeout(() => {

        jarvis(
            'Systems online. Voice and memory locked. Press VOICE and say "Jarvis" to unlock.'
        );

    }, 300);

    console.log(
        "J.A.R.V.I.S. — Voice + Memory system loaded."
    );

});
