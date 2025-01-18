let isActive = false;

document.getElementById("toggleCaptions").addEventListener("click", () => {
    const languageSelect = document.getElementById("language");
    const selectedLanguage = languageSelect.value || "en-US";
    const toggleButton = document.getElementById("toggleCaptions");
    const status = document.getElementById("status");

    if (toggleButton.textContent === "Start Captions") {
        // Start captions
        chrome.runtime.sendMessage({ command: "startCapture", language: selectedLanguage }, (response) => {
            console.log(response.status);
        });
        toggleButton.textContent = "Stop Captions";
        status.textContent = "Status: On";
    } else {
        // Stop captions
        chrome.runtime.sendMessage({ command: "stopCapture" }, (response) => {
            console.log(response.status);
        });
        toggleButton.textContent = "Start Captions";
        status.textContent = "Status: Off";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.getElementById("language");
    const toggleButton = document.getElementById("toggleCaptions");
    const status = document.getElementById("status");

    // Load the state from storage
    chrome.storage.local.get(["isActive", "selectedLanguage"], (data) => {
        isActive = data.isActive || false;
        const savedLanguage = data.selectedLanguage;

        if (savedLanguage) {
            languageSelect.value = savedLanguage;
        }

        updateUI();
    });

    // Save language when changed
    languageSelect.addEventListener("change", () => {
        const selectedLanguage = languageSelect.value;
        chrome.storage.local.set({ selectedLanguage });
        console.log("Language saved:", selectedLanguage);
    });

    // Handle Start/Stop Captions
    toggleButton.addEventListener("click", () => {
        const selectedLanguage = languageSelect.value;

        if (!isActive) {
            if (!selectedLanguage) {
                alert("Please select a language to start captions.");
                return;
            }

            chrome.runtime.sendMessage({ command: "start", language: selectedLanguage }, (response) => {
                console.log(response.status);
            });
            isActive = true;
        } else {
            chrome.runtime.sendMessage({ command: "stop" }, (response) => {
                console.log(response.status);
            });
            isActive = false;
        }

        // Save active state
        chrome.storage.local.set({ isActive });
        updateUI();
    });

    function updateUI() {
        if (isActive) {
            toggleButton.textContent = "Stop Captions";
            status.textContent = "Status: On";
        } else {
            toggleButton.textContent = "Start Captions";
            status.textContent = "Status: Off";
        }
    }

    const statusMessage = document.getElementById("tabStatusMessage");

    // Test tab accessibility
    chrome.runtime.sendMessage({ command: "testTabAccessibility" }, (response) => {
        if (response.accessible) {
            statusMessage.textContent = "The active tab is accessible.";
            statusMessage.style.color = "green";
        } else {
            statusMessage.textContent = `The active tab is not accessible`;
            statusMessage.style.color = "red";
        }
    });
});
