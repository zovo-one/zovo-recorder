# Chrome Web Store permission justifications

- **`<all_urls>` host access** — lets the content script mount the recorder popup, drawing toolbar, webcam bubble, countdown, and region selector on the page the user chooses to record. The extension does not run a remote analytics or advertising payload, and capture starts only after a user action and Chrome's capture-surface prompt.
- **`activeTab` and `scripting`** — activate or recover the recorder controls on the current page after the user clicks the toolbar button.
- **`tabs`** — identify the active capture tab and create privacy-trimmed chapter markers when the user switches tabs during an active recording.
- **`tabCapture` and `system.display`** — obtain the Chrome-selected tab/window/display media streams and enumerate displays for correct region handling.
- **`storage` and `unlimitedStorage`** — preserve settings plus local recording chunks and recovery state for longer captures.
- **`downloads`** — save the user's exported recording, GIF, chapters, annotations, or diagnostic bundle.
- **`power`** — keep the device awake while an active recording is in progress.

The store build does not request `identity`, OAuth, cookies, browsing history, bookmarks, or remote-code permissions.
