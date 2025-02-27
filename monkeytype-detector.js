console.log("successfully found monkeytype page");
console.log("executing extra logic");

let challengeCompletedLocally = false;

function findWPM() {
    console.log("Starting observation for results");
  
    const observer = new MutationObserver((mutationsList) => {
      if (challengeCompletedLocally) {
        observer.disconnect();
        return;
      }
  
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          let indicator = document.querySelector('.stats');
          if (indicator && window.getComputedStyle(indicator).display !== 'none') {
            console.log("Found result indicator:", indicator);
  
            const nearbyElements = indicator.querySelectorAll('*');
            for (const elem of nearbyElements) {
              const text = elem.textContent;
  
              if (text && text.toLowerCase().includes('wpm')) {
                console.log("Found WPM-related element:", elem);
                console.log("Content:", text);
  
                const numberMatch = text.match(/(\d+(\.\d+)?)/);
                if (numberMatch) {
                  const wpm = parseFloat(numberMatch[1]);
                  console.log("Possible WPM value:", wpm);
  
                  markChallengeCompleted(wpm);
                  observer.disconnect();
                  return; 
                }
              }
            }
          }
        }
      }
    });
  
    // Observe changes in the HTML (or a more specific container if possible)
    observer.observe(document.body, {
      attributes: true
    });
  }
  

function markChallengeCompleted(wpm) {
  if (challengeCompletedLocally) return; 
  
  console.log("Challenge completed with WPM:", wpm);
  challengeCompletedLocally = true;
  
  // Notify background script
  chrome.runtime.sendMessage({
    action: 'challengeCompleted',
    wpm: wpm
  }, response => {
    console.log("Background script response:", response);
  });
}

// Start monitoring when the page loads
window.addEventListener('load', () => {
  console.log("Page loaded");
    findWPM();
});