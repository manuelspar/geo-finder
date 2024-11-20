console.log("Popup script loaded.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in popup:", message);

    if (!message || !message.lat || !message.long) {
        console.error("Invalid message received:", message);
        document.getElementById("coordinates").innerText = "Invalid data received.";
        return;
    }

    const { lat, long } = message;
    document.getElementById("coordinates").innerText = `Latitude: ${lat}, Longitude: ${long}`;
});
