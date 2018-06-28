// ==UserScript==
// @name         Monolith Clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://monolith.greenpixel.ca/
// @grant        none
// ==/UserScript==


(function() {
    var checkReady = setInterval(function() {

        // Cheat a bit
        evoPoints =+ 999999999999999;

        if (damageCalcNoBonus() > 20000000) {
            destroyMonolith();
        }

        // click the egg
        damageClick("clicky");
        // click warcry
        if (document.getElementById('warcry')) {
            clickWarcry();
        }
        // click critical
        if (document.getElementById('critical')) {
            clickCritical();
        }
        // click breakthrough
        if (document.getElementById('breakthrough')) {
            clickBreakthrough();
        }

        var doBuyToon = 1;
        // UPGRADES : save for the next upgrade if we have 50% of the evo points saved.
        // Swords
        unlockedSwords = [unlockedSword_01_a, unlockedSword_02_a, unlockedSword_02_b, unlockedSword_03_a, unlockedSword_03_b, unlockedSword_04_a, unlockedSword_04_b, unlockedSword_05_a, unlockedSword_05_b, unlockedSword_06_a, unlockedSword_06_b, unlockedSword_07_a, unlockedSword_07_b];
        boughtSwords = [boughtSword_01_a, boughtSword_02_a, boughtSword_02_b, boughtSword_03_a, boughtSword_03_b, boughtSword_04_a, boughtSword_04_b, boughtSword_05_a, boughtSword_05_b, boughtSword_06_a, boughtSword_06_b, boughtSword_07_a, boughtSword_07_b];
        priceSwords = [priceSword_01_a, priceSword_02_a, priceSword_02_b, priceSword_03_a, priceSword_03_b, priceSword_04_a, priceSword_04_b, priceSword_05_a, priceSword_05_b, priceSword_06_a, priceSword_06_b, priceSword_07_a, priceSword_07_b];
        swordsFuncts = [upgradeSword_01_a, upgradeSword_02_a, upgradeSword_02_b, upgradeSword_03_a, upgradeSword_03_b, upgradeSword_04_a, upgradeSword_04_b, upgradeSword_05_a, upgradeSword_05_b, upgradeSword_06_a, upgradeSword_06_b, upgradeSword_07_a, upgradeSword_07_b];
        for (var i = 0, len = unlockedSwords.length; i<len; i++) {
            if (boughtSwords[i] === 0 && unlockedSwords[i] === 1 && Math.floor(evoPoints) > Math.floor(priceSwords[i]/2)) {
                doBuyToon = 0;
                if (Math.floor(evoPoints) >= priceSwords[i]) {
                    swordsFuncts[i]();
                    console.log("bought: Sword upgrade");
                }
            }
        }

        // Monolith upgrades
        unlockedMonolith = [unlockedMonolith_01_a, unlockedMonolith_01_b, unlockedMonolith_01_c, unlockedMonolith_01_d, unlockedMonolith_02_a, unlockedMonolith_02_b, unlockedMonolith_02_c, unlockedMonolith_03_a, unlockedMonolith_03_b, unlockedMonolith_03_c, unlockedMonolith_03_d, unlockedMonolith_03_e, unlockedMonolith_04_a, unlockedMonolith_04_b, unlockedMonolith_04_c, unlockedMonolith_04_d, unlockedMonolith_05_a, unlockedMonolith_05_b, unlockedMonolith_05_c, unlockedMonolith_05_d, unlockedMonolith_05_e, unlockedMonolith_06_a, unlockedMonolith_06_b, unlockedMonolith_06_c, unlockedMonolith_06_d, unlockedMonolith_06_e, unlockedMonolith_07_a, unlockedMonolith_07_b, unlockedMonolith_07_c, unlockedMonolith_07_d];
        boughtMonolith = [boughtMonolith_01_a, boughtMonolith_01_b, boughtMonolith_01_c, boughtMonolith_01_d, boughtMonolith_02_a, boughtMonolith_02_b, boughtMonolith_02_c, boughtMonolith_03_a, boughtMonolith_03_b, boughtMonolith_03_c, boughtMonolith_03_d, boughtMonolith_03_e, boughtMonolith_04_a, boughtMonolith_04_b, boughtMonolith_04_c, boughtMonolith_04_d, boughtMonolith_05_a, boughtMonolith_05_b, boughtMonolith_05_c, boughtMonolith_05_d, boughtMonolith_05_e, boughtMonolith_06_a, boughtMonolith_06_b, boughtMonolith_06_c, boughtMonolith_06_d, boughtMonolith_06_e, boughtMonolith_07_a, boughtMonolith_07_b, boughtMonolith_07_c, boughtMonolith_07_d];
        priceMonolith = [priceMonolith_01_a, priceMonolith_01_b, priceMonolith_01_c, priceMonolith_01_d, priceMonolith_02_a, priceMonolith_02_b, priceMonolith_02_c, priceMonolith_03_a, priceMonolith_03_b, priceMonolith_03_c, priceMonolith_03_d, priceMonolith_03_e, priceMonolith_04_a, priceMonolith_04_b, priceMonolith_04_c, priceMonolith_04_d, priceMonolith_05_a, priceMonolith_05_b, priceMonolith_05_c, priceMonolith_05_d, priceMonolith_05_e, priceMonolith_06_a, priceMonolith_06_b, priceMonolith_06_c, priceMonolith_06_d, priceMonolith_06_e, priceMonolith_07_a, priceMonolith_07_b, priceMonolith_07_c, priceMonolith_07_d];
        upgradeMonolith = [upgradeMonolith_01_a, upgradeMonolith_01_b, upgradeMonolith_01_c, upgradeMonolith_01_d, upgradeMonolith_02_a, upgradeMonolith_02_b, upgradeMonolith_02_c, upgradeMonolith_03_a, upgradeMonolith_03_b, upgradeMonolith_03_c, upgradeMonolith_03_d, upgradeMonolith_03_e, upgradeMonolith_04_a, upgradeMonolith_04_b, upgradeMonolith_04_c, upgradeMonolith_04_d, upgradeMonolith_05_a, upgradeMonolith_05_b, upgradeMonolith_05_c, upgradeMonolith_05_d, upgradeMonolith_05_e, upgradeMonolith_06_a, upgradeMonolith_06_b, upgradeMonolith_06_c, upgradeMonolith_06_d, upgradeMonolith_06_e, upgradeMonolith_07_a, upgradeMonolith_07_b, upgradeMonolith_07_c, upgradeMonolith_07_d];
        for (var i = 0, len = unlockedMonolith.length; i<len; i++) {
            if (boughtMonolith[i] === 0 && unlockedMonolith[i] === 1 && Math.floor(evoPoints) > Math.floor(priceMonolith[i]/2)) {
                doBuyToon = 0;
                if (Math.floor(evoPoints) >= priceMonolith[i]) {
                    upgradeMonolith[i]();
                    console.log("bought: Monolith Upgrade");
                }
            }
        }

        // Siege upgrades
        unlockedSieges = [unlockedSiege_04_a, unlockedSiege_05_a, unlockedSiege_06_a, unlockedSiege_06_b, unlockedSiege_07_a, unlockedSiege_07_b];
        boughtSieges = [boughtSiege_04_a, boughtSiege_05_a, boughtSiege_06_a, boughtSiege_06_b, boughtSiege_07_a, boughtSiege_07_b];
        priceSieges = [priceSiege_04_a, priceSiege_05_a, priceSiege_06_a, priceSiege_06_b, priceSiege_07_a, priceSiege_07_b];
        upgradeSieges = [upgradeSiege_04_a, upgradeSiege_05_a, upgradeSiege_06_a, upgradeSiege_06_b, upgradeSiege_07_a, upgradeSiege_07_b];
        for (var i = 0, len = unlockedSieges.length; i<len; i++) {
            if (boughtSieges[i] === 0 && unlockedSieges[i] === 1 && Math.floor(evoPoints) > Math.floor(priceSieges[i]/2)) {
                doBuyToon = 0;
                if (Math.floor(evoPoints) >= priceSieges[i]) {
                    upgradeSieges[i]();
                    console.log("bought: Siege Upgrade");
                }
            }
        }

        // Only one upgrade for aircraft
        if (boughtAircraft_07_a === 0 && unlockedAircraft_07_a === 1 && Math.floor(evoPoints) > Math.floor(priceAircraft_07_a/2)) {
            doBuyToon = 0;
            if (Math.floor(evoPoints) >= priceAircraft_07_a) {
                upgradeAircraft_07_a();
                console.log("bought: Aircraft Upgrade");
            }
        }


        // Barracks upgrades
        unlockedBarracks = [unlockedBarracks_02_a, unlockedBarracks_02_b, unlockedBarracks_03_a, unlockedBarracks_03_b, unlockedBarracks_03_c, unlockedBarracks_04_a, unlockedBarracks_04_b, unlockedBarracks_04_c, unlockedBarracks_04_d, unlockedBarracks_05_a, unlockedBarracks_05_b, unlockedBarracks_05_c, unlockedBarracks_05_d, unlockedBarracks_06_a, unlockedBarracks_06_b, unlockedBarracks_07_a, unlockedBarracks_07_b, unlockedBarracks_07_c];
        boughtBarracks = [boughtBarracks_02_a, boughtBarracks_02_b, boughtBarracks_03_a, boughtBarracks_03_b, boughtBarracks_03_c, boughtBarracks_04_a, boughtBarracks_04_b, boughtBarracks_04_c, boughtBarracks_04_d, boughtBarracks_05_a, boughtBarracks_05_b, boughtBarracks_05_c, boughtBarracks_05_d, boughtBarracks_06_a, boughtBarracks_06_b, boughtBarracks_07_a, boughtBarracks_07_b, boughtBarracks_07_c];
        priceBarracks = [priceBarracks_02_a, priceBarracks_02_b, priceBarracks_03_a, priceBarracks_03_b, priceBarracks_03_c, priceBarracks_04_a, priceBarracks_04_b, priceBarracks_04_c, priceBarracks_04_d, priceBarracks_05_a, priceBarracks_05_b, priceBarracks_05_c, priceBarracks_05_d, priceBarracks_06_a, priceBarracks_06_b, priceBarracks_07_a, priceBarracks_07_b, priceBarracks_07_c];
        upgradeBarracks = [upgradeBarracks_02_a, upgradeBarracks_02_b, upgradeBarracks_03_a, upgradeBarracks_03_b, upgradeBarracks_03_c, upgradeBarracks_04_a, upgradeBarracks_04_b, upgradeBarracks_04_c, upgradeBarracks_04_d, upgradeBarracks_05_a, upgradeBarracks_05_b, upgradeBarracks_05_c, upgradeBarracks_05_d, upgradeBarracks_06_a, upgradeBarracks_06_b, upgradeBarracks_07_a, upgradeBarracks_07_b, upgradeBarracks_07_c];
        for (var i = 0, len = unlockedBarracks.length; i<len; i++) {
            if (boughtBarracks[i] === 0 && unlockedBarracks[i] === 1 && Math.floor(evoPoints) > Math.floor(priceBarracks[i]/2)) {
                doBuyToon = 0;
                if (Math.floor(evoPoints) >= priceBarracks[i]) {
                    upgradeBarracks[i]();
                    console.log("bought: Barracks Upgrade");
                }
            }
        }

        // If there are less than 10 Melee units, we're buying Melee
        if (ownedMelee < 1) {
            if(Math.floor(evoPoints) >= costMelee){
                buyMelee("clicky");
                console.log("bought: Melee Unit");
            }
        }

        // The Scholar is a special case since it does EPS directly
        // We're taking the Scholar as a base to avoid special situations in the loop
        var costBestToon = costScholar;
        var bestCostEPS = (powerScholar*EPSMultiplier)/costBestToon;
        bestToon = buyScholar;
        toonLogText = "Scholar Unit";

        // Find the cheapest dps/attacker and buy it
        ownedToon = [ownedMelee, ownedRanged, ownedMounted, ownedSiege, ownedAircraft];
        buyToon = [buyMelee, buyRanged, buyMounted, buySiege, buyAircraft];
        unlockToon = [1, army002Unlocked, army003Unlocked, army004Unlocked, army005Unlocked];
        baseDpsToon = [powerMelee, powerRanged, powerMounted, powerSiege, powerAircraft];
        costToon = [costMelee, costRanged, costMounted, costSiege, costAircraft];
        toonLogTexts = ["Melee Unit", "Ranged Unit", "Mounted Unit", "Siege Unit", "Aircraft Unit"];
        for (var i = 0, len = ownedToon.length; i<len; i++) {
            // Check if the toon is unlocked
            if (unlockToon[i]) {
                // EPS of this toon:
                toonEPS = (baseDpsToon[i]*DPSMultiplier)/damageToEvo;
                // Cost of the toon we can buy
                toonCost = costToon[i];
                // EPS per unit of cost of this toon.
                epsPerCost = toonEPS/toonCost;
                // Higher EPS per cost is better
                if (epsPerCost > bestCostEPS) {
                    bestToon = buyToon[i];
                    bestCostEPS = epsPerCost;
                    costBestToon = toonCost;
                    toonLogText = toonLogTexts[i];
                    //console.log("New best Toon! - " + toonLogText + " - Cost: " + costBestToon + "Dmg: " + toonEPS + " - eps/c: " + epsPerCost);
                }
            }
        }
        if(doBuyToon == 1 && Math.floor(evoPoints) >= costBestToon){
            bestToon("clicky");
            console.log("bought: " + toonLogText);
        }

    }, 500);
})();
