/*
 * MD快速排版 (Markdown Here Wang)
 * Copyright (c) 2026 词元why (wangyi123456)
 * Portions Copyright (c) 2015 Adam Pritchard (original Markdown Here)
 * MIT License: https://opensource.org/licenses/MIT
 */

document.addEventListener('DOMContentLoaded', function() {
  mocha
    // I'm not sure what introduces the global "schemaTypes", but it's not
    // MD快速排版 and it causes an error on one of my Chrome instances.
    .globals([ 'schemaTypes' ]) // acceptable globals
    .run();
});
