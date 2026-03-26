/*
 * MD快速排版 (Markdown Here Wang)
 * Copyright (c) 2026 词元why (wangyi123456)
 * Portions Copyright (c) 2015 Adam Pritchard (original Markdown Here)
 * MIT License: https://opensource.org/licenses/MIT
 */

"use strict";
/* jshint browser:true, sub:true */
/* global OptionsStore:false, chrome:false, marked:false, markdownHere:false, Utils:false,
   MdhHtmlToText:false */

/*
 * Main script file for the options page.
 * Redesigned for clean, minimal Chinese UI.
 */

let cssEdit, cssSyntaxEdit, cssSyntaxSelect, rawMarkdownIframe, savedMsg,
    mathEnable, mathEdit, forgotToRenderCheckEnabled, headerAnchorsEnabled,
    gfmLineBreaksEnabled;
let loaded = false;
let currentTheme = 'gentle';

function onLoad() {
  // Set up our control references.
  cssEdit = document.getElementById('css-edit');
  cssSyntaxEdit = document.getElementById('css-syntax-edit');
  cssSyntaxSelect = document.getElementById('css-syntax-select');
  rawMarkdownIframe = document.getElementById('rendered-markdown');
  savedMsg = document.getElementById('saved-msg');
  mathEnable = document.getElementById('math-enable');
  mathEdit = document.getElementById('math-edit');
  forgotToRenderCheckEnabled = document.getElementById('forgot-to-render-check-enabled');
  headerAnchorsEnabled = document.getElementById('header-anchors-enabled');
  gfmLineBreaksEnabled = document.getElementById('gfm-line-breaks-enabled');

  rawMarkdownIframe.addEventListener('load', () => renderMarkdown());
  rawMarkdownIframe.src = Utils.getLocalURL('/common/options-iframe.html');

  forgotToRenderCheckEnabled.addEventListener('click', handleForgotToRenderChange, false);

  document.getElementById('extensions-shortcut-link').addEventListener('click', function(event) {
    event.preventDefault();
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });

  // Update the hotkey/shortcut value
  chrome.commands.getAll().then(commands => {
    const shortcut = commands[0].shortcut;
    if (!shortcut) {
      document.querySelector('.hotkey-current-error').style.display = '';
      document.querySelectorAll('.hotkey-error-hide').forEach(el => el.style.display = 'none');
    }
    else {
      document.querySelectorAll('.hotkey-current').forEach(el => el.textContent = shortcut);
    }
  });

  // Listen for runtime messages from the background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'button-click') {
      markdownToggle();
    }
    return false;
  });

  // Theme card click handlers
  document.querySelectorAll('.theme-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var theme = this.dataset.theme;
      selectTheme(theme);
    });
  });

  // Syntax highlighting styles
  Utils.getLocalFile(
    Utils.getLocalURL('/common/highlightjs/styles/styles.json'),
    'json',
    function(syntaxStyles) {
      for (var name in syntaxStyles) {
        cssSyntaxSelect.options.add(new Option(name, syntaxStyles[name]));
      }
      cssSyntaxSelect.options.add(new Option('当前使用中', ''));
      cssSyntaxSelect.selectedIndex = cssSyntaxSelect.options.length - 1;
      cssSyntaxSelect.addEventListener('change', cssSyntaxSelectChange);
    });

  // Restore previously set options
  var optionsGetSuccessful = false;
  OptionsStore.get(function(prefs) {
    cssEdit.value = prefs['main-css'];
    cssSyntaxEdit.value = prefs['syntax-css'];

    mathEnable.checked = prefs['math-enabled'];
    mathEdit.value = prefs['math-value'];

    forgotToRenderCheckEnabled.checked = prefs['forgot-to-render-check-enabled-2'];
    headerAnchorsEnabled.checked = prefs['header-anchors-enabled'];
    gfmLineBreaksEnabled.checked = prefs['gfm-line-breaks-enabled'];

  // Restore saved theme selection
    currentTheme = prefs['main-css-theme'] || 'gentle';
    highlightThemeCard(currentTheme);

    setInterval(checkChange, 100);
    optionsGetSuccessful = true;
  });

  // Check if test file exists
  fetch('./test/index.html')
    .then(response => {
      if (!response.ok) {
        document.getElementById('tests-link').style.display = 'none';
      } else {
        return response.text();
      }
    })
    .catch(err => {
      document.getElementById('tests-link').style.display = 'none';
    });

  setTimeout(function() {
    if (!optionsGetSuccessful) {
      alert('加载选项失败，请重试。');
      window.close();
    }
  }, 500);

  loaded = true;
}
document.addEventListener('DOMContentLoaded', onLoad, false);


// Highlight the active theme card
function highlightThemeCard(theme) {
  document.querySelectorAll('.theme-card').forEach(function(card) {
    card.classList.remove('active');
  });
  var activeCard = document.getElementById('theme-' + theme);
  if (activeCard) {
    activeCard.classList.add('active');
  }
  currentTheme = theme;
}

// Select a theme - load its CSS and highlight the card
function selectTheme(theme) {
  var themeMap = {
    'gentle': '/common/styles/style-gentle.css',
    'formal': '/common/styles/style-formal.css',
    'tech': '/common/styles/style-tech.css'
  };
  var themePath = themeMap[theme];
  if (!themePath) return;

  Utils.getLocalFile(
    themePath,
    'text',
    function(css) {
      cssEdit.value = css;
      highlightThemeCard(theme);
    });
}


// Change detection and auto-save
var lastOptions = '';
var lastChangeTime = null;
var firstSave = true;
function checkChange() {
  var newOptions =
        cssEdit.value + cssSyntaxEdit.value +
        mathEnable.checked + mathEdit.value +
        forgotToRenderCheckEnabled.checked + headerAnchorsEnabled.checked +
        gfmLineBreaksEnabled.checked + currentTheme;

  if (newOptions !== lastOptions) {
    lastOptions = newOptions;
    lastChangeTime = new Date();
  }
  else {
    if (lastChangeTime && (new Date() - lastChangeTime) > 400) {
      lastChangeTime = null;

      OptionsStore.set(
        {
          'main-css': cssEdit.value,
          'syntax-css': cssSyntaxEdit.value,
          'math-enabled': mathEnable.checked,
          'math-value': mathEdit.value,
          'forgot-to-render-check-enabled-2': forgotToRenderCheckEnabled.checked,
          'header-anchors-enabled': headerAnchorsEnabled.checked,
          'gfm-line-breaks-enabled': gfmLineBreaksEnabled.checked,
          'main-css-theme': currentTheme
        },
        function() {
          updateMarkdownRender();

          if (!firstSave) {
            savedMsg.classList.add('showing');
            setTimeout(function() {
              savedMsg.classList.remove('showing');
            }, 2000);
          }
          firstSave = false;
        });
    }
  }
}

// Rendering helpers (stolen from contentscript.js)
function requestMarkdownConversion(elem, range, callback) {
  var mdhHtmlToText = new MdhHtmlToText.MdhHtmlToText(elem, range);
  Utils.makeRequestToPrivilegedScript(
    document,
    { action: 'render', mdText: mdhHtmlToText.get() },
    function(response) {
      var renderedMarkdown = mdhHtmlToText.postprocess(response.html);
      callback(renderedMarkdown, response.css);
    });
}

function renderMarkdown(postRenderCallback) {
  if (rawMarkdownIframe.contentDocument.querySelector('.markdown-here-wrapper')) {
    if (postRenderCallback) postRenderCallback();
    return;
  }
  markdownHere(rawMarkdownIframe.contentDocument, requestMarkdownConversionInterceptor);
  function requestMarkdownConversionInterceptor(elem, range, callback) {
    function callbackInterceptor() {
      callback.apply(null, arguments);
      if (postRenderCallback) postRenderCallback();
    }
    requestMarkdownConversion(elem, range, callbackInterceptor);
  }
}

function updateMarkdownRender() {
  if (!rawMarkdownIframe.contentDocument.querySelector('.markdown-here-wrapper')) {
    return;
  }
  rawMarkdownIframe.style.visibility = 'hidden';
  markdownHere(rawMarkdownIframe.contentDocument, requestMarkdownConversion);
  renderMarkdown(function() {
    rawMarkdownIframe.style.visibility = 'visible';
  });
}

function markdownToggle() {
  markdownHere(rawMarkdownIframe.contentDocument, requestMarkdownConversion);
}
document.querySelector('#markdown-toggle-button').addEventListener('click', markdownToggle, false);

// Reset the main CSS to current theme default
function resetCssEdit() {
  selectTheme(currentTheme);
}
document.getElementById('reset-button').addEventListener('click', resetCssEdit, false);

// Syntax highlighting combo-box
function cssSyntaxSelectChange() {
  var selected = cssSyntaxSelect.options[cssSyntaxSelect.selectedIndex].value;
  if (!selected) return;

  if (!cssSyntaxSelect.options[cssSyntaxSelect.options.length-1].value) {
    cssSyntaxSelect.options.length -= 1;
  }

  Utils.getLocalFile(
    Utils.getLocalURL('/common/highlightjs/styles/'+selected),
    'text',
    css => {
      cssSyntaxEdit.value = css;
    });
}

// Reset math template
function resetMathEdit() {
  mathEdit.value = OptionsStore.defaults['math-value'];
}
document.getElementById('math-reset-button').addEventListener('click', resetMathEdit, false);

// Handle forgot-to-render checkbox changes
async function handleForgotToRenderChange(event) {
  const origins = ['https://mail.google.com/'];
  if (event.target.checked) {
    const granted = await ContentPermissions.requestPermission(origins);
    if (!granted) {
      forgotToRenderCheckEnabled.checked = false;
    }
  } else {
    const removed = await ContentPermissions.removePermissions(origins);
    if (!removed) {
      console.error('Failed to remove permissions');
    }
  }
}
