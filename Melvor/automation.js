// ==UserScript==
// @name         Melvor Idle automation
// @namespace    Melvor
// @version      0.09.2
// @description  Aleviates some of the micro management
// @author       Katorone
// @match        https://melvoridle.com/
// @include      https://melvoridle.com/*
// @grant        none
// ==/UserScript==

// FARMING
// Use the highest tier of seeds first?
const bot_farming_use_highest = true;



'use strict';
(function() {

  function lootContainer() {
    // Get the loot container
    let loot_container = document.getElementById("combat-loot-container");
    // Get loot
    if (loot_container) {
      let buttons = loot_container.querySelectorAll('button');
      if (buttons && buttons.length > 0) {
        buttons[0].click();
      }
    }
  }

  function bot_getBankCount(id) {
    for (let i = 0; i < bank.length; i++) {
      if (bank[i].id === id) {
        return bank[i].qty;
      }
    }
    return 0;
  }

  function bot_findSeed(col) {
    // Loop through available seeds
    for (let i = 0; i < col.length; i++) {
      let id = col[i].itemID;
      let skill = skillLevel[CONSTANTS.skill.Farming];
      let level = col[i].level;
      let mastery = farmingMastery[items[id].masteryID].mastery;
      // Skill too low
      if (skill < level) { continue; }
      // If mastery is 99, don't use the seed.
      if (mastery >= 99) { continue; }
      // 3 or more seeds in the bank?
      if (bot_getBankCount(id) < items[id].seedsRequired) { continue; }
      // Pick the first seed that matches the requirements
      return id;
    }
    return -1;
  }

  function bot_pickSeed(area, patch) {
    if (farmingAreas[area].patches[patch].type === "Allotment") {
      return bot_findSeed(bot_seedsList);
    } else if (farmingAreas[area].patches[patch].type === "Tree") {
      return bot_findSeed(bot_treeList);
    }
    return -1;
  }

  function bot_addCompost(area, patch) {
    let required_compost = (100 - farmingAreas[area].patches[patch].compost)/20;
    if(required_compost > 0) {
      let count = bot_getBankCount(CONSTANTS.item.Compost);
      if (count < required_compost) {
        let to_buy = required_compost - count;
        // try to buy compost - Do we have the gold?
        if (gp >= (items[CONSTANTS.item.Compost].buysFor * to_buy)) {
          buyCompost(to_buy);
        }
      }
      if (count >= required_compost) {
        // Apply compost
        addCompost(area, patch, required_compost);
      }
    }
  }

  function bot_plantField(area, patch, seed) {
    selectedPatch = [area, patch];
    selectedSeed = seed;
    plantSeed();
  }

  function tendFields() {
    for (let area = 0; area < farmingAreas.length; area++) {
      // Check if we have the level for this area
      if (farmingAreas[area].level > skillLevel[CONSTANTS.skill.Farming]) {
        continue;
      }
      for (let patch = 0; patch < farmingAreas[area].patches.length; patch++) {
        // There's a seed planted
        if (farmingAreas[area].patches[patch].seedID != 0) {
          if (farmingAreas[area].patches[patch].hasGrown) {
            harvestSeed(area, patch);
          }
        // No seed planted
        } else {
          // Check available seeds
          let seed = bot_pickSeed(area, patch);
          if (seed === -1) {continue;}
          // Do we need to buy compost?
          if (farmingMastery[items[seed].masteryID].mastery < 50) {
            bot_addCompost(area, patch);
          }
          bot_plantField(area, patch, seed);
        }
      }
    }
  }

  var bot_seedsList = [];
  var bot_treeList = [];

  setTimeout(function() {
    notifyPlayer(11, "Automation started.");
    loadSeeds();
    bot_seedsList = [...allotmentSeeds];
    bot_treeList = [...treeSeeds];
    if (bot_farming_use_highest) {
      bot_seedsList.reverse();
      bot_treeList.reverse();
    }
    var mediumLoop = setInterval(function() {
      lootContainer();
      tendFields();
    }, 1000)
  }, 10000);
})();
