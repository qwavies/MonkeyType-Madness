chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed, setting up challenge");
    chrome.storage.session.set({ 
      challengeCompleted: false,
      challengeStarted: true
    });
  });
  
  chrome.runtime.onStartup.addListener(() => {
  console.log("Browser started, resetting challenge for new session");
  chrome.storage.session.set({ 
    challengeCompleted: false,
    challengeStarted: true
  });
});

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      if (tab.url.includes('monkeytype.com') || 
          tab.url.startsWith('chrome://') || 
          tab.url.startsWith('chrome-extension://')) {
            return;
          }
      
      chrome.storage.session.get(['challengeCompleted'], (result) => {
        if (result.challengeCompleted !== true) {
          console.log("Redirecting tab to MonkeyType:", tabId);
          chrome.tabs.update(tabId, { url: 'https://monkeytype.com/' });
        }
      });
    }
  });
  
  chrome.tabs.onCreated.addListener((tab) => {
    chrome.storage.local.get(['challengeCompleted'], (result) => {
      console.log("New tab created, challenge status:", result.challengeCompleted);
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    
    if (message.action === 'challengeCompleted') {
      console.log("Challenge completed message received, WPM:", message.wpm);
      
      chrome.storage.local.set({ challengeCompleted: true }, () => {
        console.log("Challenge marked as completed in storage");
        
        chrome.tabs.create({ 
          url: 'congratulations.html' 
        });
        
        sendResponse({ status: 'success' });
      });
    }
    
    return true;
  });