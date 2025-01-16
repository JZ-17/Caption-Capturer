let recognition = null;

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

        // Update the overlay with the transcriptions
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


// Update the captions overlay
function updateOverlay(text, isFinal) {
    let overlay = document.getElementById("speech-overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "speech-overlay";
        Object.assign(overlay.style, {
            position: "fixed",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "20px",
            zIndex: "9999",
            textAlign: "center",
        });
        document.body.appendChild(overlay);
    }

    overlay.textContent = text;

    if (isFinal) {
        setTimeout(() => {
            overlay.remove();
        }, 3000);
    }
}
