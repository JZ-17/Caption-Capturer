let isEnabled = false;

// Load initial state
chrome.storage.local.get("enabled", (data) => {
    isEnabled = data.enabled || false;
    if (isEnabled) {
        startExtension();
    }
});

// Listen for enable/disable messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "enable") {
        isEnabled = true;
        startExtension();
        sendResponse({ status: "Enabled" });
    } else if (message.command === "disable") {
        isEnabled = false;
        stopExtension();
        sendResponse({ status: "Disabled" });
    }
});

// Start the extension functionality
function startExtension() {
    console.log("Extension Enabled - Capturing Audio...");
    chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
        if (stream) {
            console.log("Audio capture started:", stream);
            // Add logic to process the audio stream
        } else {
            console.error("Failed to capture audio:", chrome.runtime.lastError);
        }
    });
}

// Stop the extension functionality
function stopExtension() {
    console.log("Extension Disabled - Stopping Audio Capture...");
    // Add logic to stop audio processing (e.g., stop streams)
}
