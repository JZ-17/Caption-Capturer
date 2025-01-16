chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
        console.log(`Tab ID: ${tab.id}, URL: ${tab.url || "undefined"}`);
        if (!tab.url) {
            console.warn(`Tab ID ${tab.id} has no URL. Possible system or restricted page.`);
        }
    });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
        const activeTab = tabs[0];

        // Skip restricted or undefined URLs
        if (!activeTab.url || activeTab.url.startsWith("chrome://") || activeTab.url.startsWith("https://chrome.google.com")) {
            console.error("Cannot inject content script into this tab:", activeTab.url);
            return;
        }

        // Proceed with injecting content script and sending messages
        chrome.scripting.executeScript(
            {
                target: { tabId: activeTab.id },
                files: ["content.js"],
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error("Error injecting content script:", chrome.runtime.lastError.message);
                } else {
                    console.log("Content script injected successfully.");
                }
            }
        );
    } else {
        console.error("No active tab found.");
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "start" || message.command === "stop") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const activeTab = tabs[0];

                // Ensure content script is injected
                chrome.scripting.executeScript(
                    {
                        target: { tabId: activeTab.id },
                        files: ["content.js"],
                    },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error injecting content script:", chrome.runtime.lastError.message);
                            sendResponse({ status: "error", error: chrome.runtime.lastError.message });
                            return;
                        }

                        // Send the command to the content script
                        chrome.tabs.sendMessage(activeTab.id, {
                            command: message.command === "start" ? "startCapture" : "stopCapture",
                            language: message.language,
                        }, (response) => {
                            console.log("Message sent to content script:", response);
                            sendResponse(response);
                        });
                    }
                );
            } else {
                console.error("No active tab found.");
                sendResponse({ status: "error", error: "No active tab found." });
            }
        });

        return true;
    }
});
