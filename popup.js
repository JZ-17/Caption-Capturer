document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.getElementById("language");
    const toggleButton = document.getElementById("toggleCaptions");
    const statusText = document.getElementById("status");

    let isActive = false; // Tracks whether captions are active

    // Restore state on popup load
    chrome.storage.local.get(["isActive", "selectedLanguage"], (result) => {
        isActive = result.isActive || false;
        const selectedLanguage = result.selectedLanguage || "";

        if (selectedLanguage) {
            languageSelect.value = selectedLanguage;
        }

        updateUI(isActive);
    });

    toggleButton.addEventListener("click", () => {
        const language = languageSelect.value;

        if (!language) {
            alert("Please select a language before starting captions.");
            return;
        }

        if (!isActive) {
            // Start Captions
            chrome.runtime.sendMessage({ command: "start", language }, (response) => {
                if (response?.status === "ok") {
                    isActive = true;
                    saveState(isActive, language);
                    updateUI(true);
                } else {
                    alert("An error occurred: " + response.error);
                }
            });
        } else {
            // Stop Captions
            chrome.runtime.sendMessage({ command: "stop" }, (response) => {
                if (response?.status === "ok") {
                    isActive = false;
                    saveState(isActive, null);
                    updateUI(false);
                }
            });
        }
    });

    function updateUI(active) {
        toggleButton.textContent = active ? "Stop Captions" : "Start Captions";
        statusText.textContent = `Status: ${active ? "On" : "Off"}`;
        statusText.className = active ? "status-on" : "status-off";
    }

    function saveState(active, language) {
        chrome.storage.local.set({ isActive: active, selectedLanguage: language });
    }
});