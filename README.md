# SpeedX : Universal Video Speedup Extension

A professional, high-performance Chrome extension for controlling video playback speed on any website. Works on YouTube, Netflix, Coursera, Udemy, Vimeo, Facebook, and any HTML5 video player.


<p align="center">
  <img src="https://github.com/user-attachments/assets/7d96f03c-9942-4bc7-aedd-b6ffca8e3a21" width="550" alt="VideoSpeed Poster">
</p>

## Features

* **Universal Video Support** Works on YouTube, Netflix, Coursera, Udemy, Vimeo, Facebook, and any HTML5 video
* **Wide Speed Range** 0.25x to 20x playback speed
* **Keyboard Shortcuts** Quick speed adjustment with plus and minus keys and number presets
* **Floating Overlay**
* **Persistent State**
* **No Permissions Abuse** Only uses necessary permissions for video detection and control

## Installation

### Manual Installation

1. Clone or download this extension folder
2. Open Chrome and go to extensions settings
3. Enable Developer mode
4. Click Load unpacked
5. Select the extension folder
6. The extension will appear in your Chrome toolbar

### Package as ZIP

1. Zip all extension files
2. Install via Load unpacked in Chrome extensions page

## Usage

### Quick Start

1. Visit any video website
2. Look for the floating overlay in the top-right corner of videos
3. Click speed buttons or use keyboard shortcuts

### Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| + or = | Increase speed by 0.25x |
| - | Decrease speed by 0.25x |
| 0 | Reset to 1.0x |
| 1 | Set to 1.0x |
| 2 | Set to 2.0x |
| 3 | Set to 1.5x |
| 4 | Set to 4.0x |
| 5 | Set to 2.5x |
| 6 | Set to 3.0x |
| 7 | Set to 4.5x |
| 8 | Set to 8.0x |

### Popup Interface

Click the extension icon to open the popup with:

* **Quick presets** 1.0x, 1.5x, 2.0x, 4.0x, 8.0x, 16.0x
* **Custom slider** Fine-tune any speed between 0.25x and 20.0x
* **Keyboard shortcuts toggle** Enable or disable keyboard controls
* **Persistent settings** All preferences are automatically saved

## Technical Architecture

### Core Logic

* **Content Script** Runs in isolated context, safe from page scripts
* **Injector Script** Runs in page context to access all video elements
* **Message Bridge** Two-way communication via window messaging
* **Speed Controller** Optimized debouncing and caching for performance
* **Service Worker** Manages settings and state persistence via storage API

### Video Detection

The extension detects videos through multiple methods:

* **Native HTML5** Video elements
* **Platform-Specific** Deep integration for major streaming platforms
* **Dynamic Detection** Mutation observers detect newly added videos
* **Re-detection** Periodic scanning for dynamic content

### Performance Optimizations

* **Debouncing** 50ms delay prevents rapid video element updates
* **Caching** Stores speed values with LRU eviction
* **Memory Limits** Automatic cleanup of expired cache entries
* **Zero Animation** Immediate feedback for professional use

## Settings

All settings are stored in local storage:

* **Default Speed** Starting speed for new videos
* **Keyboard Shortcuts** Enable or disable global hotkeys
* **Overlay Opacity** Visual opacity of the control panel
* **Overlay Position** Custom placement of the control overlay

## Compatibility

* **Chrome** Version 90 and above
* **Platforms** YouTube, Netflix, Coursera, Udemy, Vimeo, Facebook, and custom HTML5 players

## Troubleshooting

### Overlay not appearing

1. Refresh the page
2. Check if JavaScript is enabled
3. Verify the extension is enabled in settings

### Speed changes not working

1. Clear the cache or reinstall the extension
2. Check the console for error messages
3. Try on a different video platform
4. Disable other extensions that might interfere

### Performance issues

1. Close other extensions
2. Clear browser cache
3. Restart Chrome

## Limitations

* **Cross-origin iframes** Cannot control videos in restricted frames due to security
* **DRM content** Some streaming services may prevent speed changes
* **Desktop apps** Chrome extensions do not function in standalone desktop applications

## Future Enhancements

* Reverse speed playback
* Video subtitle controls
* Playlist speed management
* Sync speed across multiple tabs
* Handle Lives/M3U8 Players (*)

> **SpeedX v1.0.0**
