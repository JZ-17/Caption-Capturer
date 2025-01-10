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

        Object.assign(overlay.style, {
            position: "fixed",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            fontSize: "20px",
            borderRadius: "8px",
            textAlign: "center",
            zIndex: "9999",
            fontFamily: "'Arial', sans-serif",
            lineHeight: "1.6",
            maxWidth: "80%",
            wordWrap: "break-word",
        });

        document.body.appendChild(overlay);
    }

    overlay.textContent = caption;

    if (overlay.hideTimeout) {
        clearTimeout(overlay.hideTimeout);
    }
    overlay.hideTimeout = setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.parentElement.removeChild(overlay);
            }
        }, 500);
    }, 5000);
}