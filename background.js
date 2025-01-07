let isActive = false; // Keeps track of whether the extension is active
let audioStream = null; // Stores the audio stream when capturing starts

// Listen and toggle the start and stoppage of audio recordings
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.command === "toggle") {
        // Toggles the state of the extension
        if (!isActive) {
            isActive = true;
            audioStream = await startCapturingAudio(); // Calls the startCapturingAudio function
            sendResponse({ status: "On" });
        } else {
            isActive = false; 
            stopCapturingAudio(); 
            sendResponse({ status: "Off" });
        }
    }
});

// Start capturing audio from the active tab
async function startCapturingAudio() {
    try {
        const stream = await chrome.tabCapture.capture({
            audio: true, 
            video: false
        });
        console.log("Audio capture started."); 
        processAudioStream(stream); // Calls processAudioStream to handle the audio stream
        return stream; 
    } catch (error) {
        console.error("Error capturing audio:", error);
        return null;
    }
}

// Stop capturing audio from the active tab
function stopCapturingAudio() {
    if (audioStream) {
        const tracks = audioStream.getTracks();
        tracks.forEach((track) => track.stop());
        console.log("Audio capture stopped.");
    }
}

// Function processes the audio stream by recording chunks and sending them to the backend
function processAudioStream(stream) {
    const recorder = new MediaRecorder(stream); // Create a MediaRecorder to handle the stream
    recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
            await sendAudioToBackend(event.data); // call sendAudioToBackend function
        }
    };

    recorder.start(1000);
}

// Sends audio blob to Flask backend for transcription
async function sendAudioToBackend(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    try {
        // Send a POST request to the Flask backend
        const response = await fetch("http://localhost:5000/transcribe", {
            method: "POST",
            body: formData
        });

        // Parse the response as JSON
        const data = await response.json();
        console.log("Caption:", data.transcription);


        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { caption: data.transcription });
        });
    } catch (error) {
        console.error("Error sending audio to backend:", error);
    }
}