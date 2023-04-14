// ==UserScript==
// @name         Dot Win Keyword Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter out posts on dotwins based on title keywords
// @author       BubbleBursts
// @match        https://*.win/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==


function filterChildrenByKeyword(keywords) {
    // Get the main content div element
    const mainContent = document.querySelector('div.main-content');

    // Callback
    var callbackFn = (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!node.querySelector) {
              return
          }
          // Check if the node is an immediate child of the main content div
          if (node.parentNode === mainContent) {
              // Check if the node contains a div with class "top" and matching keyword
              const topDiv = node.querySelector('div.top a');
              if (topDiv && keywords.some(keyword => topDiv.textContent.match(keyword))) {
                    // Remove the node if it matches the keyword
                    console.log("Removing", topDiv.textContent)
                    node.remove();
              }
          }
        });
      });
    }

    // Create a MutationObserver to detect changes in the main content div
    const observer = new MutationObserver(callbackFn)

    const mutationRecord = { type: 'childList', addedNodes: mainContent.childNodes};
    callbackFn([mutationRecord]);

    // Observe changes to the main content div
  observer.observe(mainContent, { childList: true });
}

(function() {
    'use strict';
    // Trigger on page load
    var keywordList = [/general.*at/i, "IMPEACHABLE", "Boomerang", "Hannity"]

    // Your code here...
    filterChildrenByKeyword(keywordList)
})();

