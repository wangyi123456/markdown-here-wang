/*
 * MD快速排版 (Markdown Here Wang)
 * Copyright (c) 2026 词元why (wangyi123456)
 * Portions Copyright (c) 2015 Adam Pritchard (original Markdown Here)
 * MIT License: https://opensource.org/licenses/MIT
 */

"use strict";
/*global chrome:false, OptionsStore:false, Utils:false */

/*
 * Handles the upgrade notification popup behavior
 */

function onLoad() {
  // Get the previous version from storage using OptionsStore
  OptionsStore.get(function(options) {
    const prevVersion = options['last-version'] || '';

    // Get localized messages
    const upgradeText = Utils.getMessage('upgrade_notification_text');
    const changesTitle = Utils.getMessage('upgrade_notification_changes_tooltip');
    const dismissTitle = Utils.getMessage('upgrade_notification_dismiss_tooltip');

    // Update text content
    document.getElementById('upgrade-notification-text').textContent = upgradeText;
    document.getElementById('upgrade-notification-link').title = changesTitle;
    document.getElementById('upgrade-notification-close').title = dismissTitle;

    // Handle link click - open options page with previous version
    document.getElementById('upgrade-notification-link').addEventListener('click', function(e) {
      e.preventDefault();
      const optionsUrl = Utils.getLocalURL('/common/options.html');
      const urlWithParam = optionsUrl + '?prevVer=' + encodeURIComponent(prevVersion);

      // Open options page in new tab
      chrome.tabs.create({ url: urlWithParam }, function() {
        // Clear the popup and restore normal action behavior
        clearUpgradeNotification();
      });
    });

    // Handle close button click
    document.getElementById('upgrade-notification-close').addEventListener('click', function(e) {
      e.preventDefault();
      clearUpgradeNotification();
    });
  });
}
document.addEventListener('DOMContentLoaded', onLoad, false);

function clearUpgradeNotification() {
  // Clear the popup setting to restore normal click behavior
  chrome.action.setPopup({ popup: '' }, function() {
    // Close the popup
    window.close();
  });
}
