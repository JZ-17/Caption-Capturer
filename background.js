// Check to see if tabs are able to be accessed
//chrome.tabs.query({}, (tabs) => {
    //tabs.forEach((tab) => {
        //console.log(`Tab ID: ${tab.id}, URL: ${tab.url || "undefined"}`);
        //if (!tab.url) {
            //console.warn(`Tab ID ${tab.id} has no URL. Possible system or restricted page.`);
        //}
    //});
//});

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
    if (message.command === "startCapture" || message.command === "stopCapture") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                sendResponse({ status: "error", error: "No active tab found." });
                return;
            }

            const activeTab = tabs[0];

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

                    // Send start/stop message to the content script
                    chrome.tabs.sendMessage(
                        activeTab.id,
                        { command: message.command, language: message.language },
                        (response) => {
                            console.log("Message sent to content script:", response);
                            sendResponse(response);
                        }
                    );
                }
            );
        });

        return true; // Keep the message channel open for asynchronous sendResponse
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "testTabAccessibility") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                return sendResponse({ accessible: false, reason: "No active tab found." });
            }

            const activeTab = tabs[0];

            chrome.scripting.executeScript(
                {
                    target: { tabId: activeTab.id },
                    func: () => true, // A simple script that always returns true
                },
                () => {
                    if (chrome.runtime.lastError) {
                        sendResponse({
                            accessible: false,
                            reason: chrome.runtime.lastError.message,
                        });
                    } else {
                        sendResponse({
                            accessible: true,
                            reason: "Tab is accessible.",
                        });
                    }
                }
            );
        });

        return true; // Keep the response channel open
    }
});
