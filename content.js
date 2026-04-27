// Content script — injected into every frame
// Detects all <video> elements (including dynamically added) and controls playback rate

(function () {
  'use strict';

  if (window.__velocityInjected) return;
  window.__velocityInjected = true;

  let currentSpeed = 1.0;
  let showOverlay = true;
  let keyboardEnabled = true;
  let overlayTimeout = null;
  let overlay = null;

  // Load saved settings
  chrome.storage.local.get(['speed', 'showOverlay', 'keyboardEnabled'], (data) => {
    if (data.speed) currentSpeed = data.speed;
    if (data.showOverlay !== undefined) showOverlay = data.showOverlay;
    if (data.keyboardEnabled !== undefined) keyboardEnabled = data.keyboardEnabled;
    applyToAll();
  });

  function applyToAll() {
    const videos = document.querySelectorAll('video');
    videos.forEach((v) => {
      try { v.playbackRate = currentSpeed; } catch (e) {}
    });
  }

  function setSpeed(speed) {
    currentSpeed = Math.round(speed * 100) / 100;
    currentSpeed = Math.max(0.0625, Math.min(20, currentSpeed));
    applyToAll();
    if (showOverlay) flashOverlay();
    chrome.storage.local.set({ speed: currentSpeed });
  }

  // Overlay
  function flashOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = '__velocity-overlay';
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '16px',
        left: '16px',
        zIndex: '2147483647',
        background: 'rgba(0,0,0,0.82)',
        color: '#e0e0e0',
        fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
        fontSize: '13px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        padding: '6px 12px',
        borderRadius: '3px',
        border: '1px solid rgba(255,255,255,0.08)',
        pointerEvents: 'none',
        transition: 'opacity 0.15s ease',
        opacity: '0',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      });
      document.documentElement.appendChild(overlay);
    }

    overlay.textContent = currentSpeed + 'x';
    overlay.style.opacity = '1';

    clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(() => {
      if (overlay) overlay.style.opacity = '0';
    }, 800);
  }

  // MutationObserver to catch dynamically added videos (SPA, lazy load, iframes)
  const observer = new MutationObserver((mutations) => {
    let found = false;
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeName === 'VIDEO') { found = true; break; }
        if (n.querySelectorAll) {
          if (n.querySelectorAll('video').length) { found = true; break; }
        }
      }
      if (found) break;
    }
    if (found) {
      requestAnimationFrame(applyToAll);
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Also intercept playbackRate being reset by the page
  const origDesc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
  if (origDesc && origDesc.set) {
    Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
      get: origDesc.get,
      set(val) {
        // Allow our speed to override
        origDesc.set.call(this, currentSpeed);
      },
      configurable: true
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!keyboardEnabled) return;
    // Don't trigger in input fields
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;

    // Shift+> speed up, Shift+< slow down, Shift+? reset
    if (e.key === '>' || e.key === '.') {
      e.preventDefault();
      setSpeed(currentSpeed + 0.25);
    } else if (e.key === '<' || e.key === ',') {
      e.preventDefault();
      setSpeed(currentSpeed - 0.25);
    } else if (e.key === '?' || e.key === '/') {
      e.preventDefault();
      setSpeed(1.0);
    }
  });

  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SET_SPEED') {
      setSpeed(msg.speed);
    } else if (msg.type === 'GET_STATE') {
      // respond with current state
      return { speed: currentSpeed, videos: document.querySelectorAll('video').length };
    } else if (msg.type === 'UPDATE_SETTINGS') {
      if (msg.showOverlay !== undefined) showOverlay = msg.showOverlay;
      if (msg.keyboardEnabled !== undefined) keyboardEnabled = msg.keyboardEnabled;
    }
  });

  // Initial apply with slight delay for slow-loading pages
  setTimeout(applyToAll, 500);
  setTimeout(applyToAll, 2000);
})();
