let isActive = false; // Track the toggle state

document.getElementById("toggleCaptions").addEventListener("click", () => {
    const button = document.getElementById("toggleCaptions");
    const status = document.getElementById("status");
    const language = document.getElementById("language").value;

    if (!isActive) {
        // Start Captions
        chrome.runtime.sendMessage({ command: "start", language });
        button.textContent = "Stop Captions";
        status.textContent = "Status: On";
    } else {
        // Stop Captions
        chrome.runtime.sendMessage({ command: "stop" });
        button.textContent = "Start Captions";
        status.textContent = "Status: Off";
    }

    isActive = !isActive;
});
