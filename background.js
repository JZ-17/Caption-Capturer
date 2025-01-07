let recorder = null;
let stream = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "start") {
        startCapturingAudio(message.language);
    } else if (message.command === "stop") {
        stopCapturingAudio();
    }
});

// Start capturing audio
async function startCapturingAudio(language) {
    try {
        stream = await chrome.tabCapture.capture({ audio: true, video: false });
        console.log("Audio capture started.");

        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
                const formData = new FormData();
                formData.append("audio", event.data, "audio.wav");
                formData.append("language", language);

                try {
                    const response = await fetch("http://localhost:5000/translate", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error(`Backend returned error: ${response.statusText}`);
                    }

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

// Stop capturing audio
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

// Handle tab or window changes
chrome.tabs.onRemoved.addListener(() => {
    stopCapturingAudio();
});

chrome.windows.onRemoved.addListener(() => {
    stopCapturingAudio();
});

