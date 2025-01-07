document.getElementById("toggle").addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "toggle" }, (response) => {
        document.getElementById("status").textContent = `Status: ${response.status}`;
    });
});