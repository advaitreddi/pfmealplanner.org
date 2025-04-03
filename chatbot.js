document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");

    if (userInput && sendButton) {
        // Enter key event
        userInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") sendMessage();
        });

        // Button click event
        sendButton.addEventListener("click", sendMessage);
    } else {
        console.error("❌ Elements not found! Make sure `user-input` and `send-btn` exist.");
    }
});

// ✅ Toggle Chatbot Visibility
function toggleChat() {
    document.getElementById("chat-container").classList.toggle("hidden");
}

// ✅ Send Message to Chatbot
async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userText = inputField.value.trim();
    if (!userText) return;

    displayMessage(userText, "user");
    inputField.value = "";

    // ✅ Typing Indicator
    const chatBox = document.getElementById("chat-box");
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("chat-message", "bot-message", "typing");
    typingIndicator.innerText = "Typing...";
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    // ✅ Send API Request
    sendMessageToAPI(userText, (botReply) => {
        typingIndicator.remove();
        displayMessage(botReply, "bot");
    });
}

// ✅ API Request Function (Shared for Chat & Meal Planner)
async function sendMessageToAPI(userText, callback) {
    try {
        const apiKey = "AIzaSyDOV5p-crFPOfufuevVpcKrdzS4TwevaKw";  // 🚨 Replace with a valid key
        const model = "gemini-1.5-flash";
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

        console.log("🚀 Sending request to API:", apiUrl);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: userText }] }] })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("✅ API Response:", data);

        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";
        callback(botReply);
    } catch (error) {
        console.error("🚨 API Request Failed:", error);
        callback("⚠️ API Error! Please check the console.");
    }
}

// ✅ Display Messages in Chatbox
function displayMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);

    // ✅ Ensure scrolling works properly
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
}
// ✅ Typing Effect for Messages
function typeMessage(text, element, speed = 20) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ✅ Updated displayMessage() with Typing Animation
function displayMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");

    if (sender === "bot") {
        const textSpan = document.createElement("span");
        messageDiv.appendChild(textSpan);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        typeMessage(message, textSpan);
    } else {
        messageDiv.innerText = message;
        chatBox.appendChild(messageDiv);
    }

    // ✅ Ensure scrolling works properly
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
}
// ✅ Generate Meal Plan (Uses Chatbot API)
function generateMealPlan(prompt, callback) {
    sendMessageToAPI(prompt, callback);
}