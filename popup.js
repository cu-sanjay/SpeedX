// Popup controller
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const speedValue = $('#speedValue');
  const speedSlider = $('#speedSlider');
  const presetBtns = $$('.preset-btn');
  const videoCount = $('#videoCount');

  let speed = 1.0;

  // Non-linear slider mapping for better UX at low speeds
  // 0-0.5 slider → 0.0625-1, 0.5-1 slider → 1-20
  function sliderToSpeed(val) {
    val = parseFloat(val);
    const max = 20, min = 0.0625;
    // Use exponential mapping
    return min * Math.pow(max / min, val / 20);
  }

  function speedToSlider(spd) {
    const max = 20, min = 0.0625;
    return 20 * Math.log(spd / min) / Math.log(max / min);
  }

  function updateUI(spd) {
    speed = Math.max(0.0625, Math.min(20, Math.round(spd * 100) / 100));
    speedValue.textContent = speed.toFixed(2);
    speedSlider.value = speedToSlider(speed);

    // Hot color when > 2x
    speedValue.classList.toggle('hot', speed > 2);

    // Active preset
    presetBtns.forEach((btn) => {
      btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
    });
  }

  function sendSpeed(spd) {
    updateUI(spd);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'SET_SPEED', speed }).catch(() => {});
      }
    });
    chrome.storage.local.set({ speed });
  }

  // Slider
  speedSlider.addEventListener('input', (e) => {
    sendSpeed(sliderToSpeed(e.target.value));
  });

  // Presets
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sendSpeed(parseFloat(btn.dataset.speed));
    });
  });

  // Fine control
  $('#decBig').addEventListener('click', () => sendSpeed(speed - 1));
  $('#decSmall').addEventListener('click', () => sendSpeed(speed - 0.1));
  $('#incSmall').addEventListener('click', () => sendSpeed(speed + 0.1));
  $('#incBig').addEventListener('click', () => sendSpeed(speed + 1));
  $('#resetBtn').addEventListener('click', () => sendSpeed(1));

  // Load current speed
  chrome.storage.local.get(['speed'], (data) => {
    updateUI(data.speed || 1);
  });

  // Get video count from active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => document.querySelectorAll('video').length
      }).then((results) => {
        const count = results?.[0]?.result || 0;
        videoCount.textContent = count + (count === 1 ? ' video' : ' videos');
      }).catch(() => {
        videoCount.textContent = '—';
      });
    }
  });
})();
