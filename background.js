// Background service worker
// Handles storage defaults and messaging between popup ↔ content

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    speed: 1.0,
    rememberSpeed: true,
    showOverlay: true,
    keyboardEnabled: true
  });
});

// Relay speed changes to all tabs
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SET_SPEED') {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, msg).catch(() => {});
        }
      }
    });
    if (msg.remember) {
      chrome.storage.local.set({ speed: msg.speed });
    }
    sendResponse({ ok: true });
  }
  return true;
});
