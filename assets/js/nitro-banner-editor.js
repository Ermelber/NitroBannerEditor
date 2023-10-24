let xmlDoc;
let bannerElement;
let xmlFileName;

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById('file-input');

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        xmlFileName = file.name;

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const xmlText = e.target.result;

                // Now you can parse the XML using DOMParser or other methods
                parseXML(xmlText);
            };

            reader.readAsText(file);
        }
    });

    function parseXML(xmlText) {
        const parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        bannerElement = xmlDoc.querySelector("Banner").querySelector("Banner");

        populateBannerGameNameInputElements();
    }

    function populateBannerGameNameInputElements() {
        const inputElements = document.getElementsByClassName("banner-gamename");
        const gameNameElements = bannerElement.getElementsByTagName("GameName");

        for (var i = 0; i < inputElements.length; i++) {
            inputElements[i].value = decodeFromBase64UTF16LE(gameNameElements[i].innerHTML);
        }
    }
});

function saveXml() {
    function saveBannerGameNameFromInputElements() {
        const inputElements = document.getElementsByClassName("banner-gamename");
        const gameNameElements = bannerElement.getElementsByTagName("GameName");

        for (var i = 0; i < inputElements.length; i++) {
            gameNameElements[i].innerHTML = encodeToBase64UTF16LE(inputElements[i].value);
        }
    }

    saveBannerGameNameFromInputElements();

    // Serialize the XML document back to a string
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);

    // Create a Blob from the XML string
    const blob = new Blob([xmlString], { type: 'text/xml' });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = xmlFileName; // Specify the filename

    // Trigger a click event on the link to prompt a download
    a.click();

    // Clean up by revoking the URL
    window.URL.revokeObjectURL(url);
}

// Encode a string to Base64 UTF-16LE
function encodeToBase64UTF16LE(inputString) {
    // Convert the string to a Uint8Array with UTF-16LE encoding
    const encoder = new TextEncoder('utf-16le');
    const data = encoder.encode(inputString);
    
    // Convert the Uint8Array to a Base64-encoded string
    const base64String = btoa(String.fromCharCode(...data));
    
    return base64String;
  }
  
  // Decode a Base64 UTF-16LE string to a regular string
  function decodeFromBase64UTF16LE(base64String) {
    // Decode the Base64 string to a binary string
    const binaryString = atob(base64String);
    
    // Convert the binary string to a Uint8Array
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    
    // Decode the Uint8Array to a string with UTF-16LE encoding
    const decoder = new TextDecoder('utf-16le');
    const decodedString = decoder.decode(uint8Array);
    
    return decodedString;
  }