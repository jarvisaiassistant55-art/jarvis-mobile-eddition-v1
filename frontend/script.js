// Target UI Elements
const memoryStatus = document.getElementById('memory-status');
const chatOutput = document.getElementById('chat-output');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Function to handle unlocking memory state
function unlockMemory() {
    if (memoryStatus) {
        memoryStatus.innerText = '• UNLOCKED';
        memoryStatus.style.color = '#00ffcc'; // Active glow cyan/green
        memoryStatus.classList.remove('state-locked');
        memoryStatus.classList.add('state-active');
    }
    
    appendMessage('J.A.R.V.I.S: Memory core unlocked. Historical context & persistent storage active.');
}

// Function to append messages to the communication window
function appendMessage(text) {
    const msgElement = document.createElement('p');
    msgElement.className = 'jarvis-msg';
    msgElement.innerText = text;
    chatOutput.appendChild(msgElement);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Process user commands
function processCommand(text) {
    const query = text.trim().toLowerCase();
    
    if (query === 'memory unlock' || query === 'unlock memory') {
        unlockMemory();
    } else {
        appendMessage(`User: ${text}`);
    }
}

// Event Listeners
sendBtn.addEventListener('click', () => {
    if (userInput.value) {
        processCommand(userInput.value);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && userInput.value) {
        processCommand(userInput.value);
        userInput.value = '';
    }
});
