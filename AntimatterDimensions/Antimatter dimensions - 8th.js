// ==UserScript==
// @name         Antimatter Dimensions
// @namespace    AD
// @version      0.1 alpha
// @description  To infinity and beyond!
// @author       u/Katorone
// @match        https://ivark.github.io/
// @grant        none
// ==/UserScript==

'use strict';

// Set notation to engineering

var gain = {};
gain.tickSpeed = 2; //hack
gain.firstMax = 3;
gain.secondMax = 4;
gain.thirdMax = 5;
gain.fourthMax = 6;
gain.fifthMax = 8;
gain.sixthMax = 10;
gain.seventhMax = 12;
gain.eightMax = 15;

var base = {};
base.tickSpeed = "";
base.firstMax = "100";
base.secondMax = "1e3";
base.thirdMax = "1e5";
base.fourthMax = "1e7";
base.fifthMax = "1e18"; //hack
base.sixthMax = "1e14";
base.seventhMax = "1e19";
base.eightMax = "1e25";

var dimShift = {}
dimShift.fourthMax = '11 Fourth Dimensions'
dimShift.fifthMax = '11 Fifth Dimensions'
dimShift.sixthMax = '11 Sixth Dimensions'
dimShift.seventhMax = '11 Seventh Dimensions'


var current = {};

var tiers = ["eightMax", "seventhMax", "sixthMax", "fifthMax", "fourthMax", "thirdMax", "secondMax", "firstMax", "tickSpeed"];

// Check if a value is an integer
function isInt(val) {
    return parseInt(val) === val;
}
// Get the index of the last space in a string
function lastIndex(text, char) {
    for (var i = text.length-1; i>0; i--) {
        if (text.charAt(i) == char) { return i; }
    }
    return 0
}
// Get the entire last word in a string
function lastWord(text) {
    return text.substring(lastIndex(text, " ")+1, text.length)
}
// Get the last exponent in a string
function lastExp(text) {
    return text.substring(lastIndex(text, "e")+1, text.length)
}
// Get the text of a button
function buttonText(tier) {
    var node = document.querySelector('button[id="'+tier+'"]:not(.unavailablebtn)')
    if (node) {
        return node.textContent;
    } else {
        return false;
    }
}
// Click a button
function clickButton(tier) {
    var node = document.querySelector('button[id="'+tier+'"]:not(.unavailablebtn)')
    if (node) {node.click();}
}
// Get the current costs of all buttons
function currentCosts() {
    Object.keys(base).forEach(function(id) {
        var node = document.querySelector('button[id="'+id+'"]');
        if (node) {
            current[id] = parseInt(lastExp(node.textContent));
        }
    })
}
// Is the tier safe to buy?
function safeBuy(text, tier) {
    // Always buy the base.
    // It's more efficient to buy one at a time, 
    // maybe I'll fix that later
    if (lastWord(text) == base[tier]) {
        return true;
    } else if (tier in dimShift && 
              document.getElementById('resetLabel').textContent.indexOf(dimShift[tier])!==-1) {
        return true;
    // We can always buy 8th and 6th dimensions
    } else if (tier == 'eightMax' || tier == 'sixthMax') {
        return true;
    // Check if the future cost would go over another one
    } else {
        // Current exponent
        var currentExp = parseInt(lastExp(text));
        // Exponent after buying
        var newExp = currentExp + gain[tier];
        // If any of the current prices are equal or lower than
        // the future price, don't buy.
        var buyTier = true;
        Object.keys(current).forEach(function(ctier) {
            // If we're not checking the tier we want to buy, and we're not checking against the sixth tier
            if (ctier != tier && ctier != 'sixthMax' && 
            // and the purchase would put us >= the amount of another tier (unless we're already over it)
               (newExp >= current[ctier] && currentExp < current[ctier])) {
                // Then don't buy.
                buyTier = false;
            }
        })
        return buyTier;
    }
}




var click = setInterval(function() {

    // Refresh the current costs
    currentCosts();
    // Loop through the tiers and check what we can buy
    tiers.forEach(function(tier) {
        var text = buttonText(tier);
        if (text && safeBuy(text, tier)) {
            clickButton(tier);
        }
    })

	//resets
    var node = document.querySelector('button[id="secondSoftReset"]:not(.unavailablebtn)')
    if (node) {node.click();}
    node = document.querySelector('button[id="softReset"]:not(.unavailablebtn)')
    if (node) {node.click();}
    node = document.querySelector('button#bigcrunch[style*="inline-block"]')
    if (node) {node.click();}
}, 1000);
