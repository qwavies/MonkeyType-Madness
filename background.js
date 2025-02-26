const MONKEYTYPE_URL = "https://monkeytype.com/"

function openMonkeyType() {
    // Query for the default new tab that Chrome opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const currentTab = tabs[0];
        // Check if it's a new tab (about:blank or Chrome's new tab page)
        if (currentTab.url === "about:blank" || currentTab.url.includes("chrome://newtab")) {
          // Update the existing tab instead of creating a new one
          chrome.tabs.update(currentTab.id, { url: MONKEYTYPE_URL });
        } else {
          // If it's not a new tab, create a new one
          chrome.tabs.create({ url: MONKEYTYPE_URL });
        }
      } else {
        // Fallback if no active tab is found
        chrome.tabs.create({ url: MONKEYTYPE_URL });
      }
    });
  }

chrome.runtime.onStartup.addListener(() => {
  openMonkeyType();
});

chrome.runtime.onInstalled.addListener(() => {
  openMonkeyType();
});