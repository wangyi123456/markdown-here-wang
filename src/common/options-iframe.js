/*
 * MD快速排版 (Markdown Here Wang)
 * Copyright (c) 2026 词元why (wangyi123456)
 * Portions Copyright (c) 2015 Adam Pritchard (original Markdown Here)
 * MIT License: https://opensource.org/licenses/MIT
 */

function onLoad() {
  // The body of the iframe needs to have a (collapsed) selection range for
  // MD快速排版 to work (simulating focus/cursor).
  const range = document.createRange();
  range.setStart(document.body, 0);
  const sel = document.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  const demoMarkdown = Utils.getMessage('options_page__preview_markdown');
  Utils.saferSetInnerHTML(document.body, demoMarkdown);
}
document.addEventListener('DOMContentLoaded', onLoad, false);
