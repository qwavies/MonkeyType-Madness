const MONKEYTYPE_URL = "https://monkeytype.com/"

function openMonkeyType() {
    chrome.tabs.create({ url: MONKEYTYPE_URL })
}

chrome.runtime.onStartup.addListener(() => {
  openMonkeyType();
});

chrome.runtime.onInstalled.addListener(() => {
  openMonkeyType();
});