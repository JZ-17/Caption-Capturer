const enableToggle = document.getElementById("enableToggle");
const status = document.getElementById("status");

// Load initial state
chrome.storage.local.get("enabled", (data) => {
    const isEnabled = data.enabled || false;
    enableToggle.checked = isEnabled;
    status.textContent = `Status: ${isEnabled ? "Enabled" : "Disabled"}`;
});

// Update state when toggled
enableToggle.addEventListener("change", () => {
    const isEnabled = enableToggle.checked;
    chrome.storage.local.set({ enabled: isEnabled }, () => {
        status.textContent = `Status: ${isEnabled ? "Enabled" : "Disabled"}`;
        chrome.runtime.sendMessage({ command: isEnabled ? "enable" : "disable" });
    });
});