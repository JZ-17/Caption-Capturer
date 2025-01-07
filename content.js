chrome.runtime.onMessage.addListener((message) => {
    if (message.caption) {
        updateOverlay(message.caption);
    }
});

function updateOverlay(caption) {
    let overlay = document.getElementById("caption-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "caption-overlay";
        overlay.style.position = "fixed"; // Fixed position for consistent placement
        overlay.style.bottom = "10%"; // Adjusted placement similar to Netflix
        overlay.style.left = "50%"; // Center the text horizontally
        overlay.style.transform = "translateX(-50%)"; // Center adjustment
        overlay.style.padding = "10px 20px"; // Padding around the text
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Semi-transparent black background
        overlay.style.color = "white"; // White text color
        overlay.style.borderRadius = "8px"; // Rounded corners
        overlay.style.fontSize = "22px"; // Larger font size
        overlay.style.textAlign = "center"; // Center-align text
        overlay.style.zIndex = "9999"; // Ensure it appears above other elements
        overlay.style.fontFamily = "Arial, Helvetica, sans-serif"; // Netflix-style font
        overlay.style.lineHeight = "1.4"; // Slightly larger line spacing
        document.body.appendChild(overlay);
    }
    overlay.textContent = caption;
}

