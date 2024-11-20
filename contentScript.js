const originalFetch = window.fetch;

window.fetch = async (...args) => {
    console.log("Fetch detected:", args[0]); // Jede Fetch-Anfrage loggen

    if (args[0].includes("GeoPhotoService")) {
        console.log("GeoPhotoService request detected:", args[0]);

        try {
            const response = await originalFetch(...args);
            if (!response.ok) {
                console.error("GeoPhotoService request failed:", response.status);
                return response;
            }

            const clonedResponse = await response.clone().json();
            console.log("GeoPhotoService response:", clonedResponse);

            // Extrahiere Koordinaten
            let lat, long;
            try {
                lat = clonedResponse[1][0][5][0][1][0][2];
                long = clonedResponse[1][0][5][0][1][0][3];
                console.log("Extracted coordinates:", lat, long);
            } catch (err) {
                console.error("Error extracting coordinates:", err);
                return response;
            }

            if (lat && long) {
                console.log("Sending coordinates to popup...");
                chrome.runtime.sendMessage({ lat, long }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError);
                    } else {
                        console.log("Message sent successfully!");
                    }
                });
            }

            return response;
        } catch (err) {
            console.error("Error processing GeoPhotoService request:", err);
        }
    }

    return originalFetch(...args);
};
