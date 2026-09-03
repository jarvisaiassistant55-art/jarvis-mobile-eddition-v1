"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");

    const voiceStatus = document.getElementById("voiceStatus");
    const memoryStatus = document.getElementById("memoryStatus");
    const chatState = document.getElementById("chatState");

    let unlocked = false;


    /* ================================
       MEMORY
       ================================ */

    let memories = [];

    try {
        memories = JSON.parse(
            localStorage.getItem("jarvis_memories") || "[]"
        );
    } catch (error) {
        memories = [];
    }


    function saveMemory(text) {

        memories.push({
            text: text,
            date: new Date().toLocaleString()
        });

        localStorage.setItem(
            "jarvis_memories",
            JSON.stringify(memories)
        );
    }


    function getMemories() {
        return memories;
    }


    /* ================================
       CHAT
       ================================ */

    function addMessage(sender, text, type) {

        const message = document.createElement("div");

        message.className = "message " + type;

        const title = document.createElement("strong");
        title.textContent = sender + ": ";

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


    /* ================================
       UNLOCK
       ================================ */

    function unlockSystem() {

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

        jarvis(
            "Voice and memory systems unlocked, Boss."
        );
    }


    /* ================================
       LOCK
       ================================ */

    function lockSystem() {

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

        jarvis(
            "Voice and memory systems locked."
        );
    }


    /* ================================
       SHOW MEMORY
       ================================ */

    function showMemories() {

        if (memories.length === 0) {

            jarvis(
                "My memory database is currently empty."
            );

            return;
        }


        jarvis(
            "I remember " +
            memories.length +
            " item" +
            (memories.length === 1 ? "" : "s") +
            ", Boss."
        );


        memories.forEach(function (memory, index) {

            addMessage(
                "MEMORY " + (index + 1),
                memory.text,
                "ai"
            );

        });
    }


    /* ================================
       CLEAR MEMORY
       ================================ */

    function clearMemories() {

        memories = [];

        localStorage.removeItem(
            "jarvis_memories"
        );

        jarvis(
            "Memory database cleared, Boss."
        );
    }


    /* ================================
       FIND MEMORY
       ================================ */

    function searchMemory(keyword) {

        const results = memories.filter(function (memory) {

            return memory.text
                .toLowerCase()
                .includes(keyword.toLowerCase());

        });


        if (results.length === 0) {

            jarvis(
                "I couldn't find that in my memory."
            );

            return;
        }


        results.forEach(function (memory) {

            addMessage(
                "MEMORY",
                memory.text,
                "ai"
            );

        });
    }


    /* ================================
       COMMAND PROCESSOR
       ================================ */

    function processCommand(command) {

        const text = command.toLowerCase().trim();


        /* ==============================
           UNLOCK
           ============================== */

        if (
            text === "unlock" ||
            text === "unlock jarvis" ||
            text === "activate jarvis" ||
            text === "wake jarvis"
        ) {

            unlockSystem();

            return;
        }


        /* ==============================
           LOCK
           ============================== */

        if (
            text === "lock" ||
            text === "lock jarvis" ||
            text === "lock system"
        ) {

            lockSystem();

            return;
        }


        /* ==============================
           LOCK CHECK
           ============================== */

        if (!unlocked) {

            jarvis(
                'System locked. Type "unlock jarvis" to activate me.'
            );

            return;
        }


        /* ==============================
           HELLO
           ============================== */

        if (
            text === "hello" ||
            text === "hi" ||
            text === "hey"
        ) {

            jarvis(
                "Hello Boss. All systems are operational."
            );

            return;
        }


        /* ==============================
           WHO ARE YOU
           ============================== */

        if (
            text.includes("who are you") ||
            text.includes("what are you")
        ) {

            jarvis(
                "I am J.A.R.V.I.S., your mobile assistant."
            );

            return;
        }


        /* ==============================
           HOW ARE YOU
           ============================== */

        if (text.includes("how are you")) {

            jarvis(
                "All systems are operating normally, Boss."
            );

            return;
        }


        /* ==============================
           TIME
           ============================== */

        if (
            text === "time" ||
            text.includes("what time")
        ) {

            jarvis(
                "The current time is " +
                new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                }) +
                "."
            );

            return;
        }


        /* ==============================
           DATE
           ============================== */

        if (
            text === "date" ||
            text.includes("today")
        ) {

            jarvis(
                "Today is " +
                new Date().toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) +
                "."
            );

            return;
        }


        /* ==============================
           STATUS
           ============================== */

        if (text.includes("status")) {

            jarvis(
                "AI Core ONLINE. Network ONLINE. " +
                "Voice UNLOCKED. Memory UNLOCKED."
            );

            return;
        }


        /* ==============================
           REMEMBER
           ============================== */

        if (
            text.startsWith("remember ")
        ) {

            const memory = command
                .substring(9)
                .trim();

            if (!memory) {

                jarvis(
                    "What would you like me to remember?"
                );

                return;
            }

            saveMemory(memory);

            jarvis(
                "Got it, Boss. I'll remember that."
            );

            return;
        }


        /* ==============================
           FAVOURITE COLOUR
           ============================== */

        if (
            text.includes("my favourite colour is") ||
            text.includes("my favorite color is")
        ) {

            let value = command
                .replace(
                    /my favourite colour is/i,
                    ""
                )
                .replace(
                    /my favorite color is/i,
                    ""
                )
                .trim();

            saveMemory(
                "Favourite colour: " + value
            );

            jarvis(
                "Got it, Boss. I'll remember that your favourite colour is " +
                value +
                "."
            );

            return;
        }


                /* ==============================
           NAME
           ============================== */

        if (
            text.startsWith("my name is ")
        ) {

            const name = command
                .substring(11)
                .trim();

            if (!name) {

                jarvis(
                    "Please tell me your name."
                );

                return;
            }

            saveMemory(
                "Name: " + name
            );

            jarvis(
                "Got it. I'll remember your name."
            );

            return;
        }


        /* ==============================
           LIKES
           ============================== */

        if (
            text.startsWith("i like ")
        ) {

            const thing = command
                .substring(7)
                .trim();

            if (!thing) {

                jarvis(
                    "Tell me what you like."
                );

                return;
            }

            saveMemory(
                "Likes: " + thing
            );

            jarvis(
                "I'll remember that you like " +
                thing +
                "."
            );

            return;
        }


        /* ==============================
           SHOW MEMORY
           ============================== */

        if (
            text === "memory" ||
            text === "memories" ||
            text === "show memory" ||
            text === "show memories" ||
            text === "show my memories"
        ) {

            showMemories();

            return;
        }


        /* ==============================
           MEMORY COUNT
           ============================== */

        if (
            text === "memory count" ||
            text.includes("how many memories")
        ) {

            jarvis(
                "I currently have " +
                memories.length +
                " stored memories."
            );

            return;
        }


        /* ==============================
           FIND MEMORY
           ============================== */

        if (
            text.startsWith("find memory ")
        ) {

            const keyword = command
                .substring(12)
                .trim();

            if (!keyword) {

                jarvis(
                    "Tell me what memory you want me to find."
                );

                return;
            }

            searchMemory(keyword);

            return;
        }


        /* ==============================
           CLEAR MEMORY
           ============================== */

        if (
            text === "clear memory" ||
            text === "clear memories" ||
            text === "delete memories"
        ) {

            clearMemories();

            return;
        }


        /* ==============================
           HELP
           ============================== */

        if (
            text === "help" ||
            text === "commands"
        ) {

            jarvis(
                "Available commands: hello, time, date, status, " +
                "remember something, my favourite colour is..., " +
                "my name is..., I like..., show my memories, " +
                "find memory..., clear memories, and lock."
            );

            return;
        }


        /* ==============================
           THANKS
           ============================== */

        if (
            text.includes("thank you") ||
            text.includes("thanks")
        ) {

            jarvis(
                "You're welcome, Boss."
            );

            return;
        }


        /* ==============================
           UNKNOWN COMMAND
           ============================== */

        jarvis(
            "I received your message, Boss. " +
            "I don't have a specific response for that command yet."
        );
    }


    /* ================================
       SEND BUTTON
       ================================ */

    send.addEventListener("click", function () {

        const text = input.value.trim();

        if (!text) {
            return;
        }

        userMessage(text);

        input.value = "";

        if (chatState) {
            chatState.textContent = "PROCESSING";
        }

        setTimeout(function () {

            processCommand(text);

            if (chatState) {
                chatState.textContent =
                    unlocked ? "READY" : "LOCKED";
            }

        }, 200);
    });


    /* ================================
       ENTER KEY
       ================================ */

    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            send.click();
        }
    });


    /* ================================
       INITIAL STATUS
       ================================ */

    if (aiStatus) {

        aiStatus.textContent = "● ONLINE";
        aiStatus.className = "on";
    }


    if (networkStatus) {

        networkStatus.textContent = "● ONLINE";
        networkStatus.className = "on";
    }


    /* ================================
       STARTUP
       ================================ */

    lockSystem();


    setTimeout(function () {

        jarvis(
            'Systems online. Type "unlock jarvis" to begin.'
        );

    }, 300);


    console.log(
        "J.A.R.V.I.S. TEXT + MEMORY ENGINE ONLINE"
    );

});
