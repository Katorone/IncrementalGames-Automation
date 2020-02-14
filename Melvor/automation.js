// ==UserScript==
// @name         Melvor Idle automation
// @namespace    Melvor
// @version      0.12
// @description  Aleviates some of the micro management
// @author       Katorone
// @match        https://melvoridle.com/
// @include      https://melvoridle.com/*
// @grant        none
// ==/UserScript==

//
// Options - Feel free to change these.
//

// BANK
// How much money to keep on reserve?
// Aim for at least 4.000.000 when also buying bank slots
const bot_reserveGold = 10000000;
// Sell Bobby's pocket automatically?
const bot_sellGoldBags = true;
// Buy new Bank slots when needed?
// Careful with this setting, this can drain your money fast in early game.
const bot_buyBankSlots = true;

// COMBAT
// Auto loot Enable?
const bot_autoLoot_enabled = true;

// Opening containers automatically will display a popup.
// The script tries to close this popup automatically, but this might
// interrupt other actions you're doing in the bank.
// Sadly there's no real way around this.

// Open bird nests automatically?
const bot_farming_openBirdNests = true;
// Open herb bags automatically?
const bot_farming_openHerbBags = true;


// FARMING
// Enable?
const bot_autoFarm_enabled = true;
// Use the highest tier of seeds first?
const bot_farming_use_highest = true;
// Auto buy new allotments?
const bot_farming_autoBuyAllotments = true;


// MINING
// Gem glove Enable?
const bot_buyGemGlove_enabled = true;
// Amount of uses to keep in reserve?
// Have this larger than 2000.
const bot_gemGloveUses = 60000;


//
// Code - You probably won't need to change anything here.
//   If you need to, feel free to poke me on the Melvor Discord.
//

'use strict';
(function() {

// GENERAL
  function bot_getBankCount(id) {
    for (let i = 0; i < bank.length; i++) {
      if (bank[i].id === id) {
        return bank[i].qty;
      }
    }
    return 0;
  }

  // Adds an item to the sell list, or merges if it's already queued.
  function bot_addSellList(id, amount) {
    for (let i = 0; i < bot_sellList.length; i++) {
      if (bot_sellList[i][0] === id) {
        bot_sellList[i][1] += amount;
        return;
      }
    }
    bot_sellList.push([id, amount]);
  }

  // Try to sell gems, but keep an equal amount of each in the bank.
  function bot_sellGems(target_gold) {
    // Create an easy to navigate structure
    let bank_gems = [];
    let to_sell = {};
    let value = 0;
    for (let i = 0; i < bot_gemList.length; i++) {
      let id = bot_gemList[i];
      let amount = bot_getBankCount(id);
      bank_gems.push([id, amount, items[id].sellsFor]);
      to_sell[id] = {};
      to_sell[id].amount = 0;
      value = value + (amount * items[id].sellsFor);
    }
    // If selling all gems doesn't match target_gold, stop.
    if (value < target_gold) {return;}

    let sell_value = 0;
    // Add gems to sell until the target gold is reached
    while (sell_value < target_gold) {
      // Sort bank_gems on amount
      bank_gems.sort(function(a,b) {return a[1] < b[1];})
      // Sell 1 gem each itteration
      bank_gems[0][1]--;
      sell_value = sell_value + bank_gems[0][2];
      bot_addSellList(bank_gems[0][0], 1)
    }
  }

// COMBAT
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

// FARMING
  function bot_findSeed(col) {
    // Current farming skill
    let skill = skillLevel[CONSTANTS.skill.Farming];
    // Loop through available seeds
    for (let i = 0; i < col.length; i++) {
      // Item id of the seed
      let id = col[i].itemID;
      // Required level to use the seed
      let level = col[i].level;
      // Current mastery of the seed
      let mastery = 0;
      if (farmingMastery.includes(items[id].masteryID)) {
        mastery = farmingMastery[items[id].masteryID].mastery;
      }
      // Skill too low
      if (skill < level) { continue; }
      // If mastery is 99, don't use the seed.
      if (mastery >= 99) { continue; }
      // Enough seeds in the bank to plant once?
      if (bot_getBankCount(id) < items[id].seedsRequired) { continue; }
      // Pick the first seed that matches the requirements
      return id;
    }
    return -1;
  }

  function bot_pickSeed(area, patch) {
    if (newFarmingAreas[area].areaName === "Allotments") {
      return bot_findSeed(bot_seedsList);
    } else if (newFarmingAreas[area].areaName === "Herbs") {
      return bot_findSeed(bot_herbsList);
    } else if (newFarmingAreas[area].areaName === "Trees") {
      return bot_findSeed(bot_treeList);
    }
    return -1;
  }

  function bot_addCompost(area, patch) {
    let required_compost = (100 - newFarmingAreas[area].patches[patch].compost)/20;
    if (required_compost > 0) {
      let count = bot_getBankCount(CONSTANTS.item.Compost);
      if (count < required_compost) {
        let to_buy = required_compost - count;
        // try to buy compost - Do we have the gold?
        if (gp >= (items[CONSTANTS.item.Compost].buysFor * to_buy)) {
          buyCompost(to_buy);
          // We want to stop the loop if we bought compost.
          return true;
        }
      }
      if (count >= required_compost) {
        // Apply compost
        addCompost(area, patch, required_compost);
        // We want to stop the loop when compost is applied.
        return true;
      }
      return false;
    }
  }

  function bot_plantField(area, patch, seed) {
    selectedPatch = [area, patch];
    selectedSeed = seed;
    plantSeed();
  }

  function tendFields() {
    for (let area = 0; area < newFarmingAreas.length; area++) {
      for (let patch = 0; patch < newFarmingAreas[area].patches.length; patch++) {
        // If the patch isn't unlocked, try to unlock it.
        if (newFarmingAreas[area].patches[patch].unlocked === false) {
          // Auto buy if this option is enabled
          if (bot_farming_autoBuyAllotments === true && 
              gp >= newFarmingAreas[area].patches[patch].cost && 
              skillLevel[CONSTANTS.skill.Farming] >= newFarmingAreas[area].patches[patch].level
          ) {
            unlockPlot(area, patch);
            // Stop the script so the game can update.
            return true;
          }
          // Following patches would be locked, so break out of this loop.
          break;
        }
        // There's a seed planted
        if (newFarmingAreas[area].patches[patch].seedID != 0) {
          if (newFarmingAreas[area].patches[patch].hasGrown) {
            harvestSeed(area, patch);
          }
        // No seed planted
        } else {
          // Check available seeds
          let seed = bot_pickSeed(area, patch);
          // Can't find a seed, proceed to the next area
          if (seed === -1) {break;}
          // Do we need to buy compost?
          if (farmingMastery[items[seed].masteryID].mastery < 50) {
            let composted = bot_addCompost(area, patch);
            // check if the area actually got composted
            if (composted) {
              return true;
            }
          }
          bot_plantField(area, patch, seed);
        }
      }
    }
  }

// MINING
  function bot_checkGloves() {
    // Are we mining? - Do this check to avoid spending saved gp
    if (!isMining) {return;}
    // Is the gem glove equipped? - Same reason
    if (!glovesTracker[CONSTANTS.shop.gloves.Gems].isActive) {return;}
    // How many uses left?
    let uses_left = glovesTracker[CONSTANTS.shop.gloves.Gems].remainingActions;
    let to_buy = Math.ceil((bot_gemGloveUses - uses_left)/2000)
    // Quit if we don't need more gloves.
    if (to_buy <= 0) {return;}
    let price = glovesCost[CONSTANTS.shop.gloves.Gems];
    // Buy one if we can afford it
    if (gp >= price) {
      buyGloves(CONSTANTS.shop.gloves.Gems);
      return;
    }
    // Do we need to sell gems?
    if (gp < price) {
      bot_sellGems(price - gp);
    }
  }

  var bot_sellList = [];
  var bot_seedsList = [];
  var bot_herbsList = [];
  var bot_treeList = [];
  var bot_gemList = [128, 129, 130, 131, 132];
  const bot_birdsNest = 119;
  const bot_herbsBag = 620;
  const bot_goldBag = 482;

  // Delay 10 seconds to allow the game to load.
  setTimeout(function() {

    notifyPlayer(11, "Automation started.");

    // Set up the farming data
    if (bot_autoFarm_enabled) {
      loadSeeds();
      bot_seedsList = [...allotmentSeeds];
      bot_herbsList = [...herbSeeds];
      bot_treeList = [...treeSeeds];
      if (bot_farming_use_highest) {
        bot_seedsList.reverse();
        bot_herbsList.reverse();
        bot_treeList.reverse();
      }
    }
    // Do actions every second.
    var mediumLoop = setInterval(function() {
      // Pick up loot, if enabled.
      if (bot_autoLoot_enabled) {
        lootContainer();
      }
      // Harvest & replant farms, if enabled.
      if (bot_autoFarm_enabled) {
        tendFields();
      }
      // Does anything need selling?
      let sell = bot_sellList.shift();
      if (sell) {
        sellItem(getBankId(sell[0]), sell[1]);
      }
    }, 1000)

    // Do actions every minute.
    var slowLoop = setInterval(function() {
      // Try buying a bank slot
      if (bot_buyBankSlots === true && 
          bank.length >= (baseBankMax + bankMax)) {
        let cost = Math.min(newNewBankUpgradeCost.level_to_gp(currentBankUpgrade+1), 4000000);
        // Buy if we have enough gold.
        if (gp >= cost) {
          upgradeBank();
          // Stop script to let the game update.
          return true;
        }
      }
      // Sell Bobbys pocket
      if (bot_sellGoldBags === true) {
        let c = bot_getBankCount(bot_goldBag);
        if (c > 0) {bot_addSellList(bot_goldBag, c);}
      }
      // Open bird nests
      if (bot_farming_openBirdNests === true) {
        let c = bot_getBankCount(bot_birdsNest);
        if (c > 0) {
          openBankItem(getBankId(bot_birdsNest), bot_birdsNest, true)
          // Close the popup
          setTimeout(function() {
            document.getElementsByClassName("swal2-confirm")[0].click();
          }, 100);
        }
      }
      // Open herb sacks
      if (bot_farming_openHerbBags === true) {
        let c = bot_getBankCount(bot_herbsBag);
        if (c > 0) {
          openBankItem(getBankId(bot_herbsBag), bot_herbsBag, true)
          // Close the popup
          setTimeout(function() {
            document.getElementsByClassName("swal2-confirm")[0].click();
          }, 100);
        }
      }
      // Make sure our money reserves are replenished
      if (gp < bot_reserveGold) {
        bot_sellGems(bot_reserveGold - gp);
      }
      // One gem glove lasts at least 750 seconds.
      if (bot_buyGemGlove_enabled) {
        bot_checkGloves();
      }
    }, 60000)

  }, 10000);
})();
