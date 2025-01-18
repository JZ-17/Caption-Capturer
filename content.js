// Start speech recognition
function startRecognition(language = "en-US") {
    if (!("webkitSpeechRecognition" in window)) {
        console.error("Web Speech API is not supported in this browser.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
        console.log("Speech recognition started.");
    };

    recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        console.log("Interim Transcript:", interimTranscript);
        console.log("Final Transcript:", finalTranscript);

        // Update the overlay with the transcriptions and understand this portion later
        updateOverlay(interimTranscript || finalTranscript, !!finalTranscript);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        console.log("Speech recognition ended.");
    };

    recognition.start();
}

// Stop speech recognition
function stopRecognition() {
    if (recognition) {
        recognition.stop();
        console.log("Speech recognition stopped.");
        recognition = null;
    }
    clearOverlay()
}

// Clears Overlay
function clearOverlay() {
    const overlay = document.getElementById("speech-overlay");
    if (overlay) {
        overlay.remove(); // Remove the overlay element
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "startCapture") {
        console.log("Starting speech recognition...");
        startRecognition(message.language);
        sendResponse({ status: "Speech recognition started" });
    } else if (message.command === "stopCapture") {
        console.log("Stopping speech recognition...");
        stopRecognition();
        sendResponse({ status: "Speech recognition stopped" });
    } else {
        console.warn("Unknown command received:", message.command);
        sendResponse({ status: "error", error: "Unknown command" });
    }
});

let overlayTimeout = null; // Global timeout reference

function updateOverlay(text, language) {
    let overlay = document.getElementById("speech-overlay");

    // Create the overlay if it doesn't exist
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "speech-overlay";
        Object.assign(overlay.style, {
            position: "fixed",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "20px",
            zIndex: "9999",
            textAlign: "center",
            maxWidth: "90%",
            whiteSpace: "pre-line", // Allow line breaks
        });
        document.body.appendChild(overlay);
    }

    if (!overlay.textBuffer) {
        overlay.textBuffer = [];
    }

    // Group text by language type
    if (["zh-CN", "zh-TW", "ja"].includes(language)) {
        const characters = text.split("");
        for (let i = 0; i < characters.length; i += 10) {
            overlay.textBuffer.push(characters.slice(i, i + 10).join(""));
        }
    } else {
        const words = text.split(/\s+/);
        for (let i = 0; i < words.length; i += 8) {
            overlay.textBuffer.push(words.slice(i, i + 8).join(" "));
        }
    }

    // Ensure only the last 2 lines remain
    overlay.textBuffer = overlay.textBuffer.slice(-1);

    // Update the overlay content with the buffer
    overlay.textContent = overlay.textBuffer.join("\n");

    // Reset the overlay timeout
    resetOverlayTimeout();
}

// Function to remove the overlay after 3 seconds of inactivity
function resetOverlayTimeout() {
    clearTimeout(overlayTimeout); 
    overlayTimeout = setTimeout(() => {
        const overlay = document.getElementById("speech-overlay");
        if (overlay) {
            overlay.remove();
        }
    }, 3000); 
}
