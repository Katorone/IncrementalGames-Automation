// ==UserScript==
// @name         Antimatter Dimensions
// @namespace    AD
// @version      0.1 alpha
// @description  To infinity and beyond!
// @author       u/Katorone
// @match        https://ivark.github.io/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var click = setInterval(function() {
    	// Progress
        var node = document.querySelector('button[id="tickSpeedMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="eightMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="seventhMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="sixthMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="fifthMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="fourthMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="thirdMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="secondMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="firstMax"]:not(.unavailablebtn)')
        if (node) {node.click();}
 		//resets
        node = document.querySelector('button[id="secondSoftReset"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button[id="softReset"]:not(.unavailablebtn)')
        if (node) {node.click();}
        node = document.querySelector('button#bigcrunch[style*="inline-block"]')
        if (node) {node.click();}
    }, 100);
})();