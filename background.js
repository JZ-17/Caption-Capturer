let recorder = null; // Used to record audio
let stream = null;   // Used to represent that the audio is being captured

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "start") {
        startCapturingAudio(message.language); // Call startCapturingAudio with the selected language
    } else if (message.command === "stop") {
        stopCapturingAudio();
    }
});

// Start capturing audio and send it to the backend for translation
async function startCapturingAudio(language) {
    try {
        stream = await chrome.tabCapture.capture({ audio: true, video: false }); // Use tabCapture API to capture audio
        console.log("Audio capture started.");

        recorder = new MediaRecorder(stream); // Create a new MediaRecorder instance
        recorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
                const formData = new FormData(); // Create a new FormData instance
                formData.append("audio", event.data, "audio.wav");
                formData.append("language", language);

                try {
                    const response = await fetch("http://localhost:5000/translate", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await response.json();
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { caption: data.translation });
                    });
                } catch (error) {
                    console.error("Error sending audio to backend:", error);
                }
            }
        };

        recorder.start(1000);
    } catch (error) {
        console.error("Error capturing audio:", error);
    }
}


function stopCapturingAudio() {
    if (recorder) {
        recorder.stop();
        console.log("Recorder stopped.");
        recorder = null;
    }

    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        console.log("Audio stream stopped.");
        stream = null;
    }
}
