chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.caption) {
        updateCaptionOverlay(message.caption);
    }
});

function updateCaptionOverlay(caption) {
    let overlay = document.getElementById("caption-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "caption-overlay";
        overlay.style.position = "fixed";
        overlay.style.bottom = "10px";
        overlay.style.left = "10px";
        overlay.style.padding = "10px";
        overlay.style.backgroundColor = "black";
        overlay.style.color = "white";
        overlay.style.fontSize = "18px";
        overlay.style.zIndex = "9999";
        document.body.appendChild(overlay);
    }
    overlay.textContent = caption;
}
