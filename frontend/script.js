"use strict";

alert("JARVIS SCRIPT IS WORKING");

document.addEventListener("DOMContentLoaded", function () {

    const chat = document.getElementById("chat");
    const input = document.getElementById("msg");
    const send = document.getElementById("send");

    if (!chat || !input || !send) {
        alert("JARVIS HTML ELEMENTS NOT FOUND");
        return;
    }

    send.addEventListener("click", function () {

        const text = input.value.trim();

        if (!text) {
            alert("TYPE SOMETHING FIRST");
            return;
        }

        const user = document.createElement("div");
        user.className = "message user";
        user.textContent = "YOU: " + text;

        chat.appendChild(user);

        const reply = document.createElement("div");
        reply.className = "message ai";
        reply.textContent = "J.A.R.V.I.S.: I am working, Boss.";

        chat.appendChild(reply);

        input.value = "";

        chat.scrollTop = chat.scrollHeight;
    });

});
