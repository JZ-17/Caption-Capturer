let mediaStream = null; // System audio stream
let recorder = null; // Media recorder for audio chunks
let isActive = false; // Tracks whether transcription is active

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "start") {
        console.log("Starting audio capture...");
        startAudioCapture(message.language).then((result) => {
            if (result.success) {
                isActive = true;
                sendResponse({ status: "ok" });
            } else {
                console.error("Audio capture failed:", result.error);
                sendResponse({ status: "error", error: result.error });
            }
        });
        return true; // Keeps the sendResponse channel open
    } else if (message.command === "stop") {
        console.log("Stopping audio capture...");
        stopAudioCapture();
        isActive = false;
        sendResponse({ status: "ok" });
    }
});

// Start capturing audio
async function startAudioCapture(language) {
    try {
        // Request access to the system audio routed through BlackHole or Loopback
        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                deviceId: "default", 
            },
        });

        console.log("Audio capture started.");

        // Create a MediaRecorder to handle audio chunks
        recorder = new MediaRecorder(mediaStream);
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                sendAudioToBackend(event.data, language); // call sendAudioToBackend function
            }
        };

        recorder.start(1000);
        return { success: true };
    } catch (error) {
        console.error("Error capturing audio:", error);
        return { success: false, error: error.message };
    }
}

// Stop capturing audio
function stopAudioCapture() {
    if (recorder) {
        recorder.stop();
        console.log("Recorder stopped.");
        recorder = null;
    }

    if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        console.log("Media stream stopped.");
        mediaStream = null;
    }
}

// Send audio to the backend for transcription/translation
async function sendAudioToBackend(audioBlob, language) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    formData.append("language", language);

    try {
        console.log("Sending audio to backend...");
        const response = await fetch("http://localhost:5000/translate", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Translation received:", data.translation);

        // Send the translation to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { caption: data.translation });
            } else {
                console.error("No active tab to send translation.");
            }
        });
    } catch (error) {
        console.error("Error sending audio to backend:", error);
    }
}