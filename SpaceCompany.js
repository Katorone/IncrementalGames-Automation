// ==UserScript==
// @name         Space Company automation
// @namespace    SpaceCompany
// @version      0.1 alpha
// @description  Taking over the universe, one machine at a time.
// @author       me
// @match        https://sparticle999.github.io/SpaceCompany/
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

// Inspired by: https://gist.github.com/Dimelsondroid/f5c2ba0233192a8a92c134dc78f367a6

"use strict";


//
//	Settings
//
// Console debugging?
const scDebug = false;
// Only simulate purchases?
const scSimulate = false;
// Display notification popups?
const scDoNotify = true;


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
// Utility : Capitalize a string
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// Utility : Decapitalize a string
function decapitalize(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
// Utility : Variable exists?
function varExists(string) {
	if (string in unsafeWindow) {return true;} else {return false;}
}
// Find the first capital character in a string
function findCapital(string) {
	for (var i = 0; i < string.length; i++) {
		if (string.charAt(i).toUpperCase() === string.charAt(i)) { return i; }
	}
	return -1;
}
// Utility : check resourcesUnlocked for changes
var scUnlocks = -1;
function unlocksChanged() {
	if (resourcesUnlocked.length != scUnlocks) {
		scUnlocks = resourcesUnlocked.length;
		return true;
	} else {
		return false;
	}
}
// Utility : set ScReserved
function scReserveItem(machine, machineObj) {
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
// Utility : Calculate resources we can spend
// 'machine' is optional, when a machine name is provided that's in scReserved
// the actual amount of resources is returned
unsafeWindow.scInStorage = function(material, machine) {
	if (!contains(unlockedResources, material)) {return 0;}
	var inStorage = getResource(material);
	if (scReserved.item != "" && !scReserved.override && scReserved.item != machine && (material in scReserved.cost)) {
		inStorage -= scReserved.cost[material]();
	}
	if (inStorage == 0) {inStorage = 0.0000000001;}
	return inStorage;
}
// Utility : Calculate resource production we can spend
// 'machine' is optional, when a machine name is provided that's in scReserved
// the actual amount of production is returned
unsafeWindow.scPs = function(material, machine) {
	if (!contains(unlockedResources, material)) {return 0;}
	var ps = Function("return "+material+"ps;")();
	// Create an energy buffer, 10% of all energy produced
	// After a dyson sphere has been built, this is replaced by 10%
	// of all dyson stuff. Energy is important for EMC
	if (material == "energy") {
		ps -= scCalcEnergyReserve();
	} else if (scReserved.item != "" && !scReserved.override &&
			  (scReserved.item != machine) && (material in scReserved.input)) {
		ps -= scReserved.input[material]();
	}
	return parseInt(ps);
}
// Calculates the energy we should keep in reserve
unsafeWindow.scCalcEnergyReserve = function() {
	var min = 0;
	if (sphere>0) {
		min = 100000*sphere + 2500*swarm + 500*ring;
	} else {
		scResources.energy.machines.forEach(function(machine) {
			min += (scMachines[machine].count() * scMachines[machine].output.energy() * 0.05);
		})
	}
	return min;
}
// Update the title nav bar to mention the reserved machine
function scUpdateNavBar(machine) {
	var node = document.getElementById('scReserved');
	var text = "Goal: "+machine
	if (node) {
		node.innerText = text;
		node.title = scCrumbs.join(", ");
	} else {
		node = document.querySelector('div.navbar-header');
		node.insertAdjacentHTML('beforeend', '<span id="scReserved" class="navbar-brand text-muted small">'+text+'</span>');
	}
	if (contains(unlockedResources, 'energy')) {
		var node = document.getElementById("energyNav");
		if (node) {node.title = "Energy Production: "+parseInt(scResources.energy.ps()+scCalcEnergyReserve())+" - Buffer: "+parseInt(scCalcEnergyReserve())+" - Usable: "+parseInt(scResources.energy.ps());}
	}
}
// Lists all costs to complete all goals.
// Then sorts them from high to low, returns an array of materials
// filterCompleted = true, will discount the current storage level of these materials
function scSortGoalCosts(filterCompleted) {
	var resources = {};
	scReserved.override = true;
	Object.keys(scGoals).forEach(project => Object.keys(scGoals[project]).forEach(goal => Object.keys(scGoals[project][goal].cost).forEach(function(material) {
		// Make sure we can produce this material already
		if (contains(unlockedResources, material)) {
			// Examine the costs
			var cost = 0;
			if (filterCompleted) { cost = Math.max(0, scGoals[project][goal].cost[material]() - scResources[material].inStorage()); }
			// Examine production
			var ps = scResources[material].ps();
			if (ps == 0) { cost = Infinity; } else { cost = cost/ps; }
			// Add the material to the list
			if (!(material in resources) || resources[material]<cost) { resources[material] = cost; }
		}
	})))
	scReserved.override = false;
	// sort highest to lowest
	var needed = []
	needed = Object.keys(resources).sort(function(a, b) { return resources[a] < resources[b] })
	return needed;
}
// Filter Method - Filters a list of resources on full storage
function scFilterFullResource(resource) {
	if (scInStorage(resource, scReserved.item) >= scResources[resource].maxStorage()) {
		return false;
	}
	return true;
}
// Translates an array of resources into an array of best machines
// Best being the machine with highest RoI
function scResources2BestMachines(needed) {
	var cost = 0;
	var machines = [];
	needed.forEach(function(resource) {
		var roi = scBestRoiMachines(resource);
		machines = machines.concat(roi[0]);
	})
	return machines;
}


//
//	Core
//
// Try to buy a machine
function scBuyMachine(machine) {
	// Can we afford buying the machine
	if (contains(unlockedMachines, scReserved) && scReserved.item == machine) {scReserved.override = true;}
	if (!scAffordableMachine(machine)) {return false;}
	// Can we supply the machine?
	if (!scSupplyableMachine(machine)) {return false;}
	// Buy the machine
	if (!scSimulate) {
		var count = scMachines[machine].count();
		scMachines[machine].buy();
		if (count < scMachines[machine].count()) {
			scReserved.override = false;
			var mat = Object.keys(scMachines[machine].output)[0];
			if (contains(unlockedMachines, scReserved.item) && machine == scReserved.item) {scReserveItem();}
			scLog("-- Bought machine: "+scMachines[machine].name+" ("+capitalize(mat)+": "+scMachines[machine].output[mat]()+")");
			scNotify("Bought machine: "+scMachines[machine].name+" ("+capitalize(mat)+": "+scMachines[machine].output[mat]()+")");
			return true;
		}
	}
	scReserved.override = false;
	return false;
}
// Do we have enough resources stored to buy?
function scAffordableMachine(machine) {
	return !Object.keys(scMachines[machine].cost).some(
		res => scInStorage(res, machine) < scMachines[machine].cost[res]()
	);
}
// Do we have enough production to supply?
function scSupplyableMachine(machine) {
	return !Object.keys(scMachines[machine].input).some(
		res => scPs(res, machine) <= scMachines[machine].input[res]()
	);
}
// Filter to remove batteries/PSU from an array of machines
function scRemoveBatteries(machine) {
	return Object.keys(scMachines[machine].output).every(
		res => scMachines[machine].output[res]() > 0
	)
}
// Filter to only keep batteries/PSU from an array of machines
function scRemoveNonBatteries(machine) {
	return Object.keys(scMachines[machine].output).every(
		res => scMachines[machine].output[res]() == 0
	)
}
// Finds all machines producing resource, and returns an ordered
// array from best to worst to buy
function scBestRoiMachines(resource) {
	var result = [];
	result = scResources[resource].machines;
    result = result.sort(function(a, b) {
    	return (scMachines[a].output[resource]() / scCalcEmcValue(a)) <
    	       (scMachines[b].output[resource]() / scCalcEmcValue(b))
    })
    return result;
}

// Calculate the EMC value of machine costs
function scCalcEmcValue(machine) {
    var emc = 0;
    Object.keys(scMachines[machine].cost).forEach(function(mat) {
        emc += scResources[mat].EmcVal() * scMachines[machine].cost[mat]();
    });
    return emc;
}

// Try to buy storage
function scBuyStorage(resource) {
    scLog("-- Checking if we can buy storage for: "+resource);
	if (scSimulate) {return false;}
	if (resource == "science" || resource == "rocketFuel") {return true;}
	// handle energy & plasma
	if (resource == "energy" || resource == "plasma") {
		var bat = scBestRoiMachines(resource).filter(scRemoveNonBatteries);
		bat = bat[0];
		// If we have no batteries yet, avoid locks.
		if (!bat) { return true; }
		if (scBuyMachine(bat)) {
			if (scReserved.item == "Storage") { scReserveItem(); }
			return true;
		}
		return false;
	}
	if (!(resource in scStorage)) {return true;}
	// handle the rest
	if (Object.keys(scStorage[resource].cost).every(
    		mat => scInStorage(mat, scReserved.item) >= scStorage[resource].cost[mat]()
    	)) {
		// We can buy storage
        scStorage[resource].buy();
        if (scReserved.item == "Storage") { scReserveItem(); }
        scNotify("Bought storage for "+capitalize(resource));
        scLog("-- Bought 5storage for "+capitalize(resource));
        return true;
    }
    return false;
}

function scFindLowestMachineAmount() {
	var needed = {};
	for (var machine of unlockedMachines) {
		var count = scMachines[machine].count();
		// Get the highest achievement amount
		var max = Game.achievementsCategoryData.producers.brackets[Game.achievementsCategoryData.producers.brackets.length-1]
		if (count < max) { needed[machine] = count; }
	}
	// sort lowest to highest
	needed = Object.keys(needed).sort(function(a, b) { return needed[a] > needed[b] })
	return needed[0];
}
// Convert energy/plasma into materials
function scEmConversion(resource, notify) {
	if (contains(resourcesUnlocked, "solCenter")) {
		if (contains(resourcesUnlocked, "emcPage") && 
			contains(unlockedFilteredResources, resource) && 
		    scResources.energy.inStorage() > (scResources.energy.maxStorage()/2)) {
			emcAmount = Math.min((scResources.energy.inStorage()*0.9)/scResources[resource].EmcVal(),
					 			  scResources[resource].maxStorage() - scResources[resource].inStorage()
								)
			emcAmount = parseInt(emcAmount);
			if (!scSimulate && emcAmount) {
				convertEnergy(resource, notify);
				scLog("-- Converted energy to "+resource);
				return true;
			}				
		}
		if (contains(resourcesUnlocked, "meteoriteEMC") && resource == 'meteorite') {
			emcAmount = Math.min((scResources.plasma.inStorage()-10000)/scResources.meteorite.EmcVal(),
								 scResources.meteorite.maxStorage() - scResources.meteorite.inStorage()
								)
			emcAmount = parseInt(emcAmount);
			if (!scSimulate && emcAmount) {
				convertPlasma('meteorite', false)
				scLog("-- Converted plasma to meteorite");
				return true;
			}
		}
	}
	return false;
}
//
//	Data Collection
//
// Build unlocked resources
function buildUnlockedResources() {
	unlockedResources = [];
	unlockedFilteredResources = [];
	var elements = document.getElementById('resources').querySelectorAll('tr[id$="Nav"]:not(.hidden)');
	// loop through elements, get the id "resourceNav"
	elements.forEach(function(el) {
		// el.id = metalNav
		var id = el.id.substring(0, el.id.length-3);
		unlockedResources.push(id);
		if (contains(["energy", "plasma", "meteorite", "science", "rocketFuel"], id) === false) {
			unlockedFilteredResources.push(id);
		}
		buildResourcesObject(id);
		scLog("-DATA- Discovered: "+id);
	});
}
// Fill the scResources object for material
function buildResourcesObject(material) {
	scResources[material] = {};
	scResources[material].machines = [];
	scResources[material].ps = Function("return scPs('"+material+"');");
	scResources[material].inStorage = Function("return scInStorage('"+material+"');");
	scResources[material].maxStorage = Function("return getStorage('"+material+"');");
	scResources[material].EmcVal = Function("return "+material+"EmcVal;");
}
// Build storage cost object
function buildStorageCosts(resource) {
	scResources[resource].storageCost = {};
	// Examine possible costs - oilStorageCost ; oilStorageMetalCost
	var varname = resource + "StorageCost";
	if (varExists(varname)) {
		scResources[resource].storageCost[resource] = Function("return "+varname+";");
	}
	unlockedResources.forEach(function(res) {
		varname = resource + "Storage"+capitalize(res) + 'Cost';
		if (varExists(varname)) {
			scResources[resource].storageCost[res] = Function("return "+varname+";");
		}
	})
}
// Build unlocked machines
function buildUnlockedMachines() {
	unlockedResources.forEach(function(res) {
		// Examine <div id="resourceTab"
		var machines = document.getElementById(res + 'Tab').querySelectorAll('tr:not(.hidden)>td>h3>span');
		machines.forEach(function(machine) {
			// machine.id = miner ; heavyDrill
			var id = machine.id;
			unlockedMachines.push(id);
			scMachines[id] = {};
			var n = machine.previousSibling.textContent.trim();
			scMachines[id].name = n.substring(0,n.length-1);
			scMachines[id].count = Function("return "+id+";");
			scResources[res].machines.push(id);
			scMachines[id].output = {};
			scMachines[id].buy = Function("return get"+capitalize(id)+"();");
			if (varExists(id+"Output")) {
				scMachines[id].output[res] = Function("return "+id+"Output;");
			} else {
				scMachines[id].output[res] = Function("return 0;");
			}
			buildMachineCosts(id);
			scLog("-DATA- Discovered "+id+", a machine for "+res);
		});
	});
	// Loop through all energy producers and create a list of their input
	scEnergyInput = [];
	if (contains(unlockedResources, 'energy')) {
		scResources.energy.machines.forEach(function(machine) {
			Object.keys(scMachines[machine].input).forEach(function(input) {
				scEnergyInput.push(input);
			})
		})
	}
	scLog("-DATA- Finished populating scResources");
}
// Build machine cost object
function buildMachineCosts(machine) {
	scMachines[machine].cost = {};
	scMachines[machine].input = {};
	unlockedResources.forEach(function(res) {
		// Examine possible costs - minerMetalCost
		var varname = machine + capitalize(res) + 'Cost'
		if (varExists(varname)) {
			scMachines[machine].cost[res] = Function("return "+varname+";");
		}
		// Examine possible inputs - woodburnerWoodInput
		varname = machine + capitalize(res) + 'Input'
		if (varExists(varname)) {
			scMachines[machine].input[res] = Function("return "+varname+";");
		}
	});
}
// Build object to manage storage
function buildUnlockedStorage () {
	if (!Game.tech.isPurchased('unlockStorage')) {return false;}
	var special = ["energy", "plasma", "science", "rocketFuel"];
	// Filter out special cases
	resources = unlockedResources.filter(
		res => !contains(special, res)
	)
	if (resources.length == 0) {return false;}
	// Add some hardcoded multipliers
	var hc = {
		"uranium": ["lunarite", 2.5],
		"oil": ["metal", 2.5],
		"gem": ["metal", 2.5],
		"charcoal": ["metal", 2.5],
		"wood": ["metal", 2.5],
		"lunarite": ["metal", 1/4],
		"methane": ["lunarite", 2.5],
		"titanium": ["gold", 2.5],
		"gold": ["lunarite", 2.5],
		"silver": ["lunarite", 2.5],
		"silicon": ["lunarite", 2.5],
		"lava": ["lunarite", 2.5],
		"hydrogen": ["lunarite", 2.5],
		"helium": ["lunarite", 2.5],
		"ice": ["lunarite", 2.5],
		"meteorite": ["lunarite", 1/4]
	}
	// Loop through the materials
	resources.forEach(function(res) {
		scStorage[res] = {};
		if (document.getElementById(res + "StorageCost")||false) {
			// Add costs
			scStorage[res].cost = {};
			scStorage[res].input = {};
			scStorage[res].name = capitalize(res)+" Storage";
			scStorage[res].cost[res] = Function("return "+scResources[res].maxStorage()*storagePrice+";");
			resources.forEach(function(res2) {
				if (document.getElementById(res + "Storage" + capitalize(res2) + "Cost")||false) {
					var cost = scResources[res].maxStorage()*storagePrice
					if (res in hc && contains(hc[res], res2)) {cost /= hc[res][1];}
					scStorage[res].cost[res2] = Function("return "+cost+";");
				}
			})
			// Add buyfunct
			scStorage[res].buy = Function("return upgrade"+capitalize(res)+"Storage();");
		}
	})
}

//
//	Goal Collection
//
// Research - researchTab
function buildResearchGoals() {
	scLog("-GOALS- Populating Science Goals.");
	// get active research
	var scienceGoals = document.getElementById('techTable').querySelectorAll('tr[id]:not(.hidden)');
	// Create the container object
	if (scienceGoals.length > 0) {scGoals.tech = {};}
	scienceGoals.forEach(function(scienceGoal) {
		// scienceGoal.id = unlockPSU ; efficiencyResearch
		var id = scienceGoal.id;
		scGoals.tech[id] = {};
		scGoals.tech[id].name = id;
		scGoals.tech[id].count = Function("return Game.tech.getTechData('"+id+"').current");
		scGoals.tech[id].cost = {"science": Function("return getCost(Game.tech.getTechData('"+id+"').cost.science, Game.tech.getTechData('"+id+"').current);")};
		scGoals.tech[id].buy = Function("return purchaseTech('"+id+"');");
		scLog("-GOALS- Added science goal: "+id);
	});
	scLog("-GOALS- Finished populating Science Goals");
}

// Solar System - solarSystemTab
function buildSolarSystemGoals() {
	scLog("-GOALS- Populating Solar System Goals.");
	if (contains(tabsUnlocked, "solarSystemTab")) {
		if (rocketLaunched === false) {
			scGoals.solar = {};
			scGoals.solar.rocket = {};
			// Build a rocket?
			if (rocket === 0) {
				scGoals.solar.rocket.name = "Build a rocket."
				scGoals.solar.rocket.cost = {metal: Function("return 1200;"), gem: Function("return 900;"), oil: Function("return 1000;")};
				scGoals.solar.rocket.input = {};
				scGoals.solar.rocket.buy = Function("getRocket();");
			} else {
				// try to launch the rocket
				scGoals.solar.rocket.name = "Launch a rocket."
				scGoals.solar.rocket.cost = {rocketFuel: Function("return 20;")};
				scGoals.solar.rocket.input = {};
				scGoals.solar.rocket.buy = Function("return launchRocket();");
			}
		} else {
			// explore planets
			buildUnlockedPlanets();
			// create the container object
			if (unlockedPlanets.length > 0) { scGoals.solar = {}; }
			unlockedPlanets.forEach(function(planet) {
				// moonRocketFuelCost.textContent*1
				scGoals.solar[planet] = {};
				scGoals.solar[planet].name = "Explore "+planet;
				scGoals.solar[planet].input = {};
				scGoals.solar[planet].cost = {rocketFuel: Function("return "+unsafeWindow[planet+"RocketFuelCost"].textContent*1+";")};
				scGoals.solar[planet].buy = Function("return explore('"+capitalize(planet)+"');");
			})
		}
	}
	scLog("-GOALS- Finished populating Solar System Goals.");
}
function buildUnlockedPlanets() {
	unlockedPlanets = [];
	var planets = document.getElementById('solarSystem').querySelectorAll('tr[id^="explore"]:not(.hidden)');
	// loop through elements, get the id "resourceNav"
	planets.forEach(function(el) {
		// el.id = exploreMoon
		var wid = decapitalize(el.id.substring(7, el.id.length));
		unlockedPlanets.push(wid);
		scLog("-DATA- Discovered planet: "+wid);
	});
}

// Wonders - wonderTab
function buildWonderGoals() {
	// All available wonders pages
	var wonders = document.getElementById('wonder').querySelectorAll('tr[href]:not(.hidden)');
	if (wonders.length == 0) {return false;}
	scGoals.wonders = {};
	// Loop through available wonders
	wonders.forEach(function(wonder) {
		// href = #preciousWonderTab , #communicationsWonderTab
		var href = wonder.attributes.href.textContent;
		href = href.substring(1, href.length);
		// Check available pages for unlockable wonders
		wonder = document.getElementById(href).querySelectorAll('hide:not(.hidden)');
		// Ignore of the page is hidden
		if (wonder.length > 0) {
			wonder.forEach(function(w) {
				var wonderId = w.id;
				scGoals.wonders[wonderId] = {};
				scGoals.wonders[wonderId].name = wonderId;
				scGoals.wonders[wonderId].cost = {};
				scGoals.wonders[wonderId].input = {};
				// Extract the variables for the material costs
				var costs = w.querySelectorAll('span')
				if (costs.length > 0) {
					costs.forEach(function(cost) {
						// variable name of resource
						var costVar = cost.id;
						// Material
						var mat = costVar;
						// Extract resource needed
						var words = ["Cost", "Activate", "Wonder"]
						words.forEach(function(word) { mat = mat.replace(word,''); })
						mat = decapitalize(mat.substring(findCapital(mat), mat.length));
						// Bring it together
						scGoals.wonders[wonderId].cost[mat] = Function("return "+costVar+";");
					})
				}
				// Extract the buy function
				var buyButton = w.querySelector('button');
				scGoals.wonders[wonderId].buy = Function("return "+buyButton.attributes.onclick.textContent+";");
			})
		}; // Else: no result, or more than one buy/activate segment per page
	})
}
// Sol Center - solCenterTopTab
function buildSolCenterGoals() {
	var node = document.querySelector('li[id=solCenterTopTab]:not(.hidden)');
	if (!node) {return false;}
	scGoals.solCenter = {};
	document.getElementById("solCenterPage").querySelectorAll('div[id$="Research"]').forEach(function(techpane) {
		// techpane.id = unlockPlasmaResearch ; unlockEmcResearch
		var divs = techpane.querySelectorAll('tr[id^="research"]:not(.hidden)');
		if (divs.length > 0) {
			// unlock research
			scGoals.solCenter[techpane.id] = {};
			scGoals.solCenter[techpane.id].name = techpane.id;
			scGoals.solCenter[techpane.id].cost = {};
			scGoals.solCenter[techpane.id].input = {};
			divs.forEach(function(techcost) {
				// techcost.id = researchEmc
				techcost.querySelectorAll('span[id]').forEach(function(costspan) {
					// costspan.id = unlockEmcResearchEnergyCost
					var mat = costspan.id.substring(techpane.id.length, costspan.id.length-4);
					var cst = costspan.innerText.replace(',','')*1;
					scGoals.solCenter[techpane.id].cost[decapitalize(mat)] = Function("return "+ cst +";");
				})
				scGoals.solCenter[techpane.id].buy = Function("return "+techpane.id+"();");
			})
		}
	})
	// Add dyson stuff
	node = document.getElementById("solCenterPage").querySelector('tr[id$="dysonPage"]:not(.hidden)');
	if (!node) {return false;}
	var mats = ["titanium", "gold", "silicon", "meteorite", "ice"];
	var basecost = {"titanium": 300000, "gold": 100000, "silicon": 200000, "meteorite": 1000, "ice": 100000}
	var cost = {};
	// Calculate the cost of a ring (50 segments)
	// The goal is to build 2x the amount of rings than swarms
	// Don't bother when meteorite is less than 24ps
	if ((ring == 0 || ring < swarm*2 || ring > 100) && scResources.meteorite.ps() >= 24) {
		mats.forEach(m => cost[m] = 0);
		Object.keys(basecost).forEach(function(m) {
			for (var i = 0; i < 50; i++) {
				cost[m] += Math.floor(basecost[m] * Math.pow(1.02,i));
			}		
		})
		cost['rocketFuel'] = 50000;
		unlockedMachines.push('dysonRing');
		scResources.energy.machines.push('dysonRing');
		scMachines.dysonRing = {};
		scMachines.dysonRing.name = "Dyson Ring";
		scMachines.dysonRing.count = Function("return "+ring+";");
		scMachines.dysonRing.output = {'energy': Function('return 5000;')};
		scMachines.dysonRing.input = {};
		scMachines.dysonRing.cost = {};
		Object.keys(cost).forEach(m => scMachines.dysonRing.cost[m] = Function("return "+cost[m]+";"))
		scMachines.dysonRing.buy = Function('return buildRing();');
	}
	// Calculate the cost of a swarm (100 segments)
	// Only enable the swarm when the amount of rings is at least 2*swarms
	if ((ring != 0 && swarm <= 2*ring || ring > 50) && scResources.meteorite.ps() >= 50) {
		cost = {};
		mats.forEach(m => cost[m] = 0);
		Object.keys(basecost).forEach(function(m) {
			for (var i = 0; i < 100; i++) {
				cost[m] += Math.floor(basecost[m] * Math.pow(1.02,i));
			}		
		})
		cost['rocketFuel'] = 250000;
		unlockedMachines.push('dysonSwarm');
		scResources.energy.machines.push('dysonSwarm');
		scMachines.dysonSwarm = {};
		scMachines.dysonSwarm.name = "Dyson Swarm";
		scMachines.dysonSwarm.count = Function("return "+swarm+";");
		scMachines.dysonSwarm.output = {'energy': Function('return 25000;')};
		scMachines.dysonSwarm.input = {};
		scMachines.dysonSwarm.cost = {};
		Object.keys(cost).forEach(m => scMachines.dysonSwarm.cost[m] = Function("return "+cost[m]+";"))
		scMachines.dysonSwarm.buy = Function('return buildSwarm();');
	}
	// Calculate the cost of a sphere (250 segments)
	// Only enable when we have 10 swarms
	if ((sphere <= Game.interstellar.stars.systemsConquered && swarm >= 20) && scResources.meteorite.ps() >= 100) {
		cost = {};
		mats.forEach(m => cost[m] = 0);
		Object.keys(basecost).forEach(function(m) {
			for (var i = 0; i < 250; i++) {
				cost[m] += Math.floor(basecost[m] * Math.pow(1.02,i));
			}		
		})
		cost['rocketFuel'] = 1000000;
		unlockedMachines.push('dysonSphere');
		scResources.energy.machines.push('dysonSphere');
		scMachines.dysonSphere = {};
		scMachines.dysonSphere.name = "Dyson Sphere";
		scMachines.dysonSphere.count = Function("return "+sphere+";");
		scMachines.dysonSphere.output = {'energy': Function('return 1000000;')};
		scMachines.dysonSphere.input = {};
		scMachines.dysonSphere.cost = {};
		Object.keys(cost).forEach(m => scMachines.dysonSphere.cost[m] = Function("return "+cost[m]+";"))
		scMachines.dysonSphere.buy = Function('return buildSphere();');
	}
}

// machineTopTab
// interstellarTab
// stargazeTab

//
//	Work towards goals
//
// Click for resources
function clickResources() {
	unlockedResources.forEach(function(res) {
		// Don't click if ps > (gainNum * 100)
		if (scResources[res].ps() < (gainNum*100)) {
			var doClick = true;
			if (res == "plasma") {
				// Click plasma if we have
				//  - More than 1000 energy
				//  - More than 10 hydrogen
				//  - It doesn't bring us under 20k energy
				//  - Plasma per second is lower than 1, unless energy is full
				if (scResources.energy.inStorage() < 1000*gainNum ||
					scResources.hydrogen.inStorage() < 10*gainNum ||
					scResources.energy.inStorage() < 20000 + 1000*gainNum ||
					(scResources.plasma.ps()>=1 &&
					 scResources.energy.inStorage() < (scResources.energy.maxStorage()*0.95))
				   ) {doClick = false;}
			} else if (res == "meteorite") {
				if (contains(resourcesUnlocked, "meteoriteEMC") ||
					scResources.plasma.inStorage() < 3*gainNum ||
					scResources.plasma.inStorage() < 10000 ||
					scResources.meteorite.inStorage() >= 10000) {doClick = false;}
			} else if (contains(["charcoal","energy","rocketFuel","science"], res)) {
				doClick = false;
			}
			if (doClick && !scSimulate) {gainResource(res);}
		}
	});
}

// Do EM Conversion
function doEMconversion() {
	var unsorted = {}; var sorted = []; var needed = "";
	unlockedFilteredResources.forEach(
		res => unsorted[res] = (scResources[res].maxStorage()-scResources[res].inStorage())/scPs(res, scReserved.item)
	)
	sorted = Object.keys(unsorted).sort(function(a, b) {
		return (unsorted[a] < unsorted[b])
	})
	var needed = sorted[0];
	// convert energy to the slowest/least productive resource
	scEmConversion(needed, true);
	// Try meteorite as well
	scEmConversion('meteorite', true);
}
// Solve towards goals
function doGoals() {
	// Try to buy a goal
	if (Object.keys(scGoals).some(
		project => Object.keys(scGoals[project]).some(function(goal) {
			var item = scGoals[project][goal];
			return Object.keys(item.cost).every(function(res) {
				if (!contains(unlockedResources, res)) {return false;}
				return scInStorage(res, scReserved.item) >= item.cost[res]()
			}) && buyGoal(item, goal)
		})
	)) { return true; }
	// No goal bought, check if maxStorage can complete a goal in a reasonable time (15min)
	Object.keys(scGoals).some(
		// Loop through the goals in a project (tab)
		project => Object.keys(scGoals[project]).some(function(goal) {
			var item = scGoals[project][goal];
			// Loop through the costs of each goal
			if (Object.keys(item.cost).every(function(res) {
				// Get rid of unknown resources, also science & rocketfuel which don't have storage
				if (!contains(unlockedResources, res) || res == "science" || res == "rocketFuel") {return false;}
				// Do we need to buy storage?
				if (scResources[res].inStorage() >= scResources[res].maxStorage() && 
					scResources[res].inStorage() < item.cost[res]()) {
					if (!scBuyStorage(res)) {
						// Couldn't buy storage, reserve the resources of the storage we need
						scReserveItem();
						scReserveItem("Storage", scStorage[res]);
					}
				// Can the item be bought in 15 minutes or less of production?
				} else if (scResources[res].inStorage()+(scResources[res].ps()*900) >= item.cost[res]() &&
					       item.cost[res]() <= scResources[res].maxStorage()) { return true; }
				return false;
			})) {
				scReserveItem();
				scReserveItem(goal, scGoals[project][goal])
				return true;
			} else {return false;}
		})
	)
	return false;
}
// Try to buy a goal
function buyGoal(item, goal) {
	// Reset the reserved item after it's been bought.
	if (scReserved.item == goal) { scReserveItem(); }
	if (!scSimulate) {
		scLog("-Goal- bought: "+goal);
		scNotify("-Goal- bought: "+goal);
		item.buy();
	}
	scForceRecheck = true;
	return true;
}
// Create a path for the highest needed resource.
function generateBreadcrumbs() {
	// Clear scDiscarded
	scDiscarded = [];
	// Get a list of most needed resources to buy a goal
	var needed = [];
	needed = needed.concat(scSortGoalCosts(true).filter(scFilterFullResource));
	// Find the best machines for most needed resources to complete Goals
	// Remove science, add it to the end
	if (contains(needed, 'science')) {
		needed = needed.filter(res => res != 'science');
		needed.push('science');
	}
	// If meteorite or plasma is needed, put them in front
	if (contains(needed, 'meteorite')) { needed.unshift('meteorite'); }
	if (contains(needed, 'plasma')) { needed.unshift('plasma'); }
	var machines = [];
	machines = machines.concat(scResources2BestMachines(needed));
	// If there are no goals, buy an extra machine for achievements
	if (machines.length === 0) {machines.push(scFindLowestMachineAmount())}
	// Record the path to buy the found machines
	scCrumbs = [];
	// Keep 10% of energy produced in reserve
	// This energy can be used up, the reserve is there to more easily
	// buy machines that produce energy generation resources
	if (contains(unlockedResources, 'energy')) {
		// scCalcEnergyReserve returns 5% of production
		if (scResources.energy.ps() < Math.max(10, scCalcEnergyReserve())) {
			machines = scBestRoiMachines('energy').filter(scRemoveBatteries);
		}
	}
	// For all machines, check if we can already supply them
	// prepend producers to the list of machines if not.
	//console.log("Need to buy: "+machines)
	var newmachines = [];
	machines.forEach(function(machine) {
		Object.keys(scMachines[machine].input).forEach(function(input) {
			if (scResources[input].ps() < scMachines[machine].input[input]()) {
				newmachines.push(scBestRoiMachines(input)[0]);
			}
		})
		newmachines.push(machine);
	})
	machines = newmachines;
	if (contains(unlockedMachines, scReserved.item)) {
		machines.unshift(scReserved.item);
	}
	// Remove doubles
	machines = machines.filter(function(elem, index, self) { return index === self.indexOf(elem); })
	// Try to buy stuff.
	//console.log("Need to buy: "+machines)
	//console.log("----------------------");
	scReserved.topLevel = machines;
	if (machines.some(machine => followBreadcrumbs(machine, 0))) { return true; }
	if (unlockedResources.some(function(resource) {
		if (scResources[resource].inStorage() >= scResources[resource].maxStorage()) {
			return scBuyStorage(resource);
		} else { return false; }
	})) { return true; }
	return false;
}

unsafeWindow.scCrumbs = [];
// Follow the crumbs
function followBreadcrumbs(machine, level) {
	if (contains(scDiscarded, machine)) {return false;}
	if (machine.length == 0) {return false;}
	// Blacklist the resources required to buy & supply this machine.
	scReserveItem(machine, scMachines[machine]);
	scReserved.override = false;
	// Try to buy the machine
	scCrumbs.push(machine+" ("+level+")");
	// Do we ignore the scReserved for our next purchase?
	var output = Object.keys(scMachines[machine].output)[0];
	var ps = scResources[output].ps();
	if (contains(unlockedMachines, scReserved.item)) {
		// machine output is input for reserved and is needed to supply it
		if (output in scReserved.input && ps <= scReserved.input[output]()) {
			scReserved.override = true;
		// machine output is cost for reserved machine. And new ps would be > +1%
		} else if (output in scReserved.cost && ps/(ps+scMachines[machine].output[output]()) >= 0.001) {
			scReserved.override = true;
		// machine output is an energy input, or is science or energy
		} else if (contains(scEnergyInput, output) || output == 'science' || output == 'energy') {
			scReserved.override = true;
		}
	}
	// Try to buy the machine
	//console.log("Trying to buy: "+machine+" - Reserve overridden: "+scReserved.override);
	if (scBuyMachine(machine)) {scReserved.override = false; return true;}
	scReserved.override = false;
	var needed = [];
	// Do we need more supply to buy the machine?
	var storage = [];
	if (!scSupplyableMachine(machine)) {
		// We need to increase one of the supplied materials
		needed = needed.concat(Object.keys(scMachines[machine].input).filter(function(mat) {
			// if input.ps >= resource.ps, add to needed (have at least 1ps reserve)
			if (scMachines[machine].input[mat]() >= parseInt(scResources[mat].ps())) {return true;}
			// Ignore this material if storage is full, buy storage instead
			if (scInStorage(mat, scReserved.item) >= scResources[mat].maxStorage()) {storage.push(mat)}
			return false;
		}))
	}
	// Do we need more resources to buy the machine?
	if (!scAffordableMachine(machine)) {
		// Create a list of all needed resources and only handle the most needed one
		var costs = Object.keys(scMachines[machine].cost);
		costs = costs.sort(function(a, b) {
			return (scMachines[machine].cost[a]() - scInStorage(a, scReserved.item))/scPs(a, scReserved.item) <
			       (scMachines[machine].cost[b]() - scInStorage(b, scReserved.item))/scPs(b, scReserved.item)
		})
		scEmConversion(costs[0], true)
		needed.push(costs[0]);
		// Do we need storage?
		costs.forEach(function(mat) {
			if (scInStorage(mat, scReserved.item) >= scResources[mat].maxStorage()) {storage.push(mat)}
		})
	}
	// Buy the storage we need
	if (storage.length > 0) {
		// remove doubles
		storage = storage.filter(function(elem, index, self) {
    		return index === self.indexOf(elem);
    	})
    	if (storage.some(mat => scBuyStorage(mat))) {return true;}
	}
	// Add the current examined machine to scDiscarded to avoid a recheck
	scDiscarded.push(machine);
	// Translate the needed resources to machines
	var machines = [];
	//console.log("needed: "+needed)
	needed.forEach(function(resource) {
		var tmp = scBestRoiMachines(resource)
		machines = machines.concat(tmp.filter(function(machine) {
			// Machine is already in the toplevel
			if (contains(scReserved.topLevel, machine)) { return false; }
			// Machine is the best we can buy
			if (machine == tmp[0]) { return true; }
			// Machine produces energy
			if (resource == 'energy') { return true; }
			// Machine produces plasma while plasma < 10ps
			//if (resource == 'plasma' && scResources.plasma.ps() < 10) { return true; }
			// Machine is needed to supply an energy producer
			if (contains(scEnergyInput, resource)) { return true; }
			// Resource's output is less than 1ps
			if (scResources[resource].ps() < 1) { return true; }
			// Machine doesn't use energy as input
			if (!('energy' in scMachines[machine].input)) {return true;}
			// If production of resource would increase with more than 0.1%
			if (resource in scReserved.cost && scResources[resource].ps()/(scResources[resource].ps()+scMachines[machine].output[resource]()) >= 0.001 &&
			// and it takes longer than 120 seconds to reach the cost
				scResources[resource].ps()*120 < scReserved.cost[resource]()) {return true;}
			scDiscarded.push(tmp[0]);
			return false;
			// Remove batteries & discarded from the list
		}).filter(scRemoveBatteries).filter(m => !contains(scDiscarded, m)))
	})
	// remove doubles
	needed = needed.filter(function(elem, index, self) {
    	return index === self.indexOf(elem);
	})
	//console.log("crumbs: "+ scCrumbs);
	//console.log("Needed resources: "+needed);
	//console.log("Discarded: "+scDiscarded);
	//console.log("Check machines: "+machines)
	// Try to increase these resources
	return machines.some(need => followBreadcrumbs(need, level+1));
}





unsafeWindow.unlockedResources = [];
unsafeWindow.unlockedFilteredResources = [];
unsafeWindow.unlockedMachines = [];
unsafeWindow.unlockedPlanets = [];
unsafeWindow.scEnergyInput = [];
unsafeWindow.scReserved = {};
scReserveItem();
unsafeWindow.scDiscarded = [];
unsafeWindow.scEnergyInput = [];
unsafeWindow.scResources = {};
unsafeWindow.scMachines = {};
unsafeWindow.scGoals = {};
var scForceRecheck = true;
unsafeWindow.scStorage = {};
function scResetVars() {
	unlockedResources = [];
	unlockedFilteredResources = [];
	unlockedMachines = [];
	unlockedPlanets = [];
	scResources = {};
	scMachines = {};
	scGoals = {};
	scForceRecheck = false;
	scStorage = {};
}

function scBuildData() {
	if (unlocksChanged() || scForceRecheck) {
		scResetVars();
    	buildUnlockedResources();
    	if (tabsUnlocked.includes("researchTab")) {
    		scLog("-DATA- Adding science.");
    		unlockedResources.push('science');
			scResources.science = {};
			scResources.science.machines = [];
			scResources.science.ps = Function("return scPs('science');");
			scResources.science.inStorage = Function("return scInStorage('science');");
			scResources.science.maxStorage = Function("return parseInt(getResource('science'))+1000;");
			scResources.science.EmcVal = Function("return 1;");
    		buildResearchGoals();
    	}
    	if (tabsUnlocked.includes("solarSystemTab")) {
    		scLog("-DATA- Adding Solar System.");
    		unlockedResources.push('rocketFuel');
			scResources.rocketFuel = {};
			scResources.rocketFuel.machines = [];
			scResources.rocketFuel.ps = Function("return scPs('rocketFuel');");
			scResources.rocketFuel.inStorage = Function("return getResource('rocketFuel');");
			scResources.rocketFuel.maxStorage = Function("return parseInt(getResource('rocketFuel')*2)+1;");
			scResources.rocketFuel.EmcVal = Function("return 1;");
			buildSolarSystemGoals();
    	}
    	buildUnlockedMachines();
    	buildUnlockedStorage();
    	if (tabsUnlocked.includes("wonderTab")) { buildWonderGoals(); }
    	if (contains(resourcesUnlocked, "solCenter")) { buildSolCenterGoals(); }
    }
}



setTimeout(function() {
	// Fast loop
	var fastLoop = setInterval(function() {
    	// Clicks resources if ps < 100
    	// Stops clicking plasma if ps > 1 
    	// Stops clicking meteorite after EMCconversion
		clickResources();
	}, 100); //Check every .1 second.

    // Medium loop
    var mediumLoop = setInterval(function() {
    	// Rebuild data if needed
    	scBuildData();
    	// Try to buy a goal
    	if (doGoals()) {scUpdateNavBar(scReserved.name); return true;}
    	// Try to buy machines to complete goals
    	// - Prioritizes buying energy suppliers
    	// - Tries to buy research to complete the cheapest in 15 minutes
    	// - Loops through goals & tries to buy machines
    	// - Tries to buy supporting machines for supply or resource gain
    	if (generateBreadcrumbs()) {scUpdateNavBar(scReserved.name); return true;}
    	scUpdateNavBar(scReserved.name);
    }, 2000); //Check two seconds.

    // Slow loop
    var slowLoop = setInterval(function() {
    	// Force rebuild data.
    	scForceRecheck = true;
    	doEMconversion();
    }, 60000); //Check every minute.

}, 5000); // Wait 5 seconds after loading the page to start the script.
