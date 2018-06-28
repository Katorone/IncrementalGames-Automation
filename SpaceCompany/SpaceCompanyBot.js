Bot = {};
Bot.version = "1.0 - Alpha";
Bot.enabled = false;

// Util: Add an event listener
Bot.addEventListener = function(target, event, callback) {
    if (target.addEventListener) {
        target.addEventListener(event, callback, false);
    } else if (target.attachEvent) {
        target.attachEvent("on"+event, callback);
    } else {
        target['on'+event] = callback;
    }
};

// Storage for the buy methods
// We'll be able to click these later to buy the item.
Bot.buyMethods = {};
Bot.buyMethods.buildings = {};
Bot.buyMethods.tech = {};
Bot.buyMethods.

// Create event listeners to the different 
Bot.addHooks = function() {
    // Store the gain buttons
    
	// Hook the buy buttons
    var amount = [1, 10, 100, 10000, 1, 10, 100, 10000];
    var suff = ["_buy", "_buy_10", "_buy_100", "_buy_max", "_destroy", "_destroy_10", "_destroy_100", "_destroy_max"];
    // Loop through the buildings
    for (var id in Game.builings.entries) {
        var htmlId = Game.buildings.entries[id].htmlId;
        // Create the buy & destroy event listeners
        for (var i = 0; i < suff.length; i++) {
            var node = document.getElementById(htmlId + suff[i]);
            var funct = function () {Bot.registerChanges(['buildings', 'id'])};      
            Bot.addEventListener(node, "click", funct);
            // Store the node so we have something to click later
            this.buyMethods.buildings[id] = node;
        }
    }
    // Hook the tech buttons

    // Hook the wonder buttons

    // Hook the solCenter buttons
}


// Add methods to the Game object
Bot.addMethods = function() {
    // RESOURCE methods
    var Obj = Game.resources
    // Method that checks if a resource is available
    Obj.resourceExists = function(res) {
        return res in this.entries && this.entries[res].unlocked
    }
    // Method that checks if a storage is full
    Obj.isFullStorage = function(res) {
        if (!this.resourceExists(res)) {return false;}
        return this.entries[res].current >= this.entries[res].capacity
    }
    // Method that returns an array of all filled resources
    Obj.listFilledStorage = function() {
        return Object.keys(this.entries).filter(isFullStorage)
    }
    // Method that returns the EMC coefficient of a material
    Obj.resourceEMCcoef = function(res) {
        if (!this.resourceExists(res)) {return 0;}
        return 1; // FIX WHEN EMC VALUES ARE ADDED
    }
    // Method that returns the SAFE production of a material
    Obj.ps = function(res) {

    }

    // BUILDING methods
    var Obj = Game.buildings
    // Method that calculates the RoI of a single building
}

// Registers changes when an event is called
// This registry is later used to recalculate
// data where needed, without being influenced
// by the order in which the events are called.
Bot.registeredChanges = {};
Bot.registeredChanges.buildings = [];
Bot.registeredChanges.tech = [];
Bot.registerChanges = function(change) {
    var category = change[0];
    var item = change[1];
    var changeList = this.registeredChanges[category]
    if (!contains(changeList, item)) { changeList.push(item); }
}



Bot.reserveItem = function(machine, machineObj) {
    if (typeof machine == 'undefined') {
        scReserved = {};
        scReserved.item = "";
        scReserved.name = "";
        scReserved.cost = {};
        scReserved.input = {};
        scReserved.override = false;
    } else if (scReserved.item == "") {
        scReserved.item = machine;
        scReserved.name = machineObj.name;
        scReserved.cost = machineObj.cost;
        scReserved.input = machineObj.input;
    }
}



Bot.normalLoop = setInterval(function() {
    // Check registeredChanges for items needing updating
    
}, 2000); //Check two seconds.

// Initialize the bot after the page has done loading.
Bot.init = function() {
    // Check if the main page is unhidden
    var init = setInterval(function() {
        // Wait till the loadScreen gets hidden
        var node = document.getElementById("loadScreen");
        if (node && node.className == "hidden") {
            setTimeout(function() {
                // Clear the interval
                clearInterval(init);
                // Add the hooks
                Bot.addHooks();
                Bot.addMethods();
                // Start the Bot loop
                Bot.enabled = true;
                console.log("Space Company Bot, version: "+Bot.version+" -Loaded.");
            }, 2000); //Wait 2 seconds after load
        }
    }, 1000); //Check every second.
}








//
//	Settings
//
// Console debugging?
const scDebug = false;
// Only simulate purchases?
const scSimulate = false;
// Display notification popups?
const scDoNotify = true;


// Add logNav at the end of the navbar containing the last x log messages.
function botCreateLogNav() {}







//
//	Utility functions
//
// Utility : do debug output
function scLog(text) {
    if (scDebug) {console.log(text);}
}
// Utility : do notification popups
function scNotify(text) {
	if (scDoNotify) {Game.notifyInfo("Automation",text);}
}
// Utility : returns an array of all unlocked resources
function scUnlockedResources() {
	var array = [];
	Object.keys(Game.resources.entries).forEach(resource) {
		//if (Game.resources.entries[resource].unlocked === true) { array.push(resource); }
	}
	//return array;
	return Object.keys(Game.resources.entries); // NEED FIX
}
// Utility : returns the gainNum of a resource
function scGainNum (resource) {
	return Game.resources.entries[resource].gainNum
}
// Utility : returns an array of all unlocked machines
function scUnlockedMachines() {

}


