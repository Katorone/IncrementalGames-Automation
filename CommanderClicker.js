// ==UserScript==
// @name         Commander Clicker
// @namespace    CommanderClicker
// @version      0.1 alpha
// @description  To war!
// @author       u/Katorone
// @match        https://prosoc.github.io/CommanderClicker/
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==


// You can set the slider to whatever amount you like.
// The scripts tries to buy the last unit/upgrades first.
// Best result with limited testing seems to be the slider at Buy Max
// The script stops buying units at 1000


// Upgrade Commander for offline play?
const UpgradeCommander = true;
// Automatically promote/prestige?
// Enabling this will also overload the confirmation window
const AutoPromote = true;
// AutoPromote when (gained boxes > (current boxes * AutoPromoteMult))
const AutoPromoteMult = 10;

if (AutoPromote) {
    unsafeWindow._confirm = window.alert;
    unsafeWindow.confirm = function (msg) {
        return true;
    }
}


(function() {
    // Click
    var checkReady = setInterval(function() {
        Click();
    }, 100);
    // Do Orders
    var checkReady2 = setInterval(function() {
        if (!OrderActive) {
            var highestCoinId = 0;
            var highestCoinAmount = 0;
            for (var i = 0; i < currentOrders.length; i++) {
                if (currentOrders[i].BonusType == "coin" && currentOrders[i].BonusAmount > highestCoinAmount) {
                    highestCoinId = i;
                    highestCoinAmount = currentOrders[i].BonusAmount;
                }
            }
            ChoseOrder(highestCoinId);
        }
    }, 1000);
    // Buy Upgrades
    var checkReady3 = setInterval(function() {
        for (var i = Upgrades.length-1; i >= 0; i--) {
            if (document.getElementById("Upgrade"+i).className == "Upgrade" &&
                document.getElementById("Upgr"+i).style.color ==  "rgb(110, 255, 134)") {
                BuyUpgrade(i);
            }
        }
    }, 5000);
    // Buy Units
    var checkReady4 = setInterval(function() {
        for (var i = UnitNames.length-1; i >= 0 ; i--) {
            if (document.getElementById("U"+i).className == "UnitA" &&
                document.getElementById("UnitCost"+i).style.color ==  "rgb(110, 255, 134)" &&
                units[i].num < 1000) {
                BuyUnit(i);
            }
        }
    }, 10000);
    // Upgrade Commander
    var checkReady5 = setInterval(function() {
        if (UpgradeCommander &&
            document.getElementById("CommanderCurrentCost").style.color ==  "rgb(110, 255, 134)") {
            c.upgrade();
        }
    }, 10000);
    // Do Promotion
    var checkReady6 = setInterval(function() {
        if (AutoPromote && CalcSupplyBoxGain()>supplyBoxes*AutoPromoteMult) {
            Promote();
        }
    }, 10000);
})();

