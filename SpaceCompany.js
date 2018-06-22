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
// Utility : Calculate resources we can spend
// 'machine' is optional, when a machine name is provided that's in scReserved
// the actual amount of resources is returned
unsafeWindow.scInStorage = function(material, machine) {
	if (!contains(unlockedResources, material)) {return 0;}
	var inStorage = getResource(material);
	if (!scReserved.override && scReserved.item != machine && (material in scReserved.cost)) {
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
	// After solCenter is available, create an energy buffer
	if (material == "energy" && contains(resourcesUnlocked, "solCenter")) {
		ps = ps - scResources.energy.maxStorage()/1000;
	} else if (!scReserved.override && (scReserved.item != machine) && (material in scReserved.input)) {
		ps -= scReserved.input[material]();
	}
	if (ps == 0) {ps = 0.0000000001;} else {ps = parseInt(ps);}
	return ps;
}
// Update the title nav bar to mention the reserved machine
function scUpdateNavBar(machine) {
	var node = document.getElementById('scReserved');
	var text = "Goal: "+machine
	if (node) {
		node.innerText = text;
	} else {
		node = document.querySelector('div.navbar-header');
		node.insertAdjacentHTML('beforeend', '<span id="scReserved" class="navbar-brand text-muted small">'+text+'</span>');
	}
}

//
//	Core
//
// Try to buy a machine
function scBuyMachine(machine) {
	// Can we afford buying the machine
	if (!scAffordableMachine(machine)) {return false;}
	// Can we supply the machine?
	if (!scSupplyableMachine(machine)) {return false;}
	// Buy the machine
	if (!scSimulate) {
		var count = scMachines[machine].count();
		scMachines[machine].buy();
		if (count < scMachines[machine].count()) {
			var mat = Object.keys(scMachines[machine].output)[0];
			scLog("-- Bought machine: "+scMachines[machine].name+" ("+capitalize(mat)+": "+scMachines[machine].output[mat]()+")");
			scNotify("Bought machine: "+scMachines[machine].name+" ("+capitalize(mat)+": "+scMachines[machine].output[mat]()+")");
			return true;
		}
	}
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
		res => scPs(res, machine) < scMachines[machine].input[res]()
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
// Find the machine with the best RoI.
function scSortRoiMachine(resource) {
	var result = [];
    result = scResources[resource].machines.sort(function(a, b) {
    	return scMachines[a].output[resource]() / scCalcEmcValue(a) <
    	       scMachines[b].output[resource]() / scCalcEmcValue(b)
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
	if (resource == "science" || resource == "rocketFuel") {return true;}
	// handle energy & plasma
	if (resource == "energy" || resource == "plasma") {
		var bat = scSortRoiMachine(resource).filter(scRemoveNonBatteries);
		if (bat.length > 0) { return scBuyMachine(bat[0]); }
		return true;
	}
	if (!(resource in scStorage)) {return true;}
	// handle the rest
	if (!scSimulate &&
    	Object.keys(scStorage[resource].cost).every(
    		mat => scInStorage(mat, scReserved.item) >= scStorage[resource].cost[mat]()
    	)) {
        scStorage[resource].buy();
        scNotify("Bought storage for "+capitalize(resource));
        scLog("-- Bought 5storage for "+capitalize(resource));
        return true;
    }
    return false;
}
// Find the highest amount needed of a resource to fill a goal
// filter is optional, returns an object {'material': amount} of all matches
// science can only be gotten through the filter.
function scFindHighestGoalExpense(filter) {
	var needed = {};
	var cost = 0;
	scReserved.override = true;
	Object.keys(scGoals).forEach(project => Object.keys(scGoals[project]).forEach(goal => Object.keys(scGoals[project][goal].cost).forEach(function(material) {
		// Apply filter
		if (contains(unlockedResources, material) && 
			(typeof filter == 'undefined' || material == filter) && 
			(material != 'science' && filter != 'science')) {
			// Examine the costs
			cost = scGoals[project][goal].cost[material]();
			// Don't add the material:
			// If inStorage > cost, storage is full, storage can be filled in 1 minute
			if (!(material in needed) || needed[material]<cost) {
				if ((scResources[material].inStorage()+scResources[material].ps()*60) < scResources[material].maxStorage()) {
					needed[material] = cost;
				}
			}
		}
	})))
	scReserved.override = false;
	return needed;
}
// Fetches the highest resources needed to buy a goal
// Then translates this to a list of machines
function scFindHighestGoalExpenseMachines() {
	var needed = {};
	var cost = 0;
	needed = scFindHighestGoalExpense();
	// replace the array with an array of the best machines to buy
	var machines = {};
	Object.keys(needed).forEach(function(resource) {
		machines[scSortRoiMachine(resource)[0]] = needed[resource];
	})
	// sort highest to lowest
	machines = Object.keys(machines).sort(function(a, b) { return machines[a] < machines[b] })
	return machines;
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
	if (contains(tabsUnlocked, "solarSystemTab") === true) {
		if (rocketLaunched === false) {
			scGoals.solar = {};
			scGoals.solar.rocket = {};
			// Build a rocket?
			if (rocket === 0) {
				scGoals.solar.rocket.cost = {metal: Function("return 1200;"), gem: Function("return 900;"), oil: Function("return 1000;")};
				scGoals.solar.rocket.buy = Function("getRocket();");
			} else {
				// try to launch the rocket
				scGoals.solar.rocket.cost = {rocketFuel: Function("return 20;")};
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
				scGoals.wonders[wonderId].cost = {};
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
			scGoals.solCenter[techpane.id].cost = {};
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
	if (ring == 0 || ring < swarm*2 || ring > 100) {
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
	if (ring != 0 && swarm <= 2*ring || ring > 50) {
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
	if (sphere <= Game.interstellar.stars.systemsConquered && swarm >= 20) {
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
				if (scResources.plasma.inStorage() >= 1000 ||
					scResources.energy.inStorage() < 1000*gainNum ||
					scResources.hydrogen.inStorage() < 10*gainNum ||
					scResources.plasma.ps()>1) {doClick = false;}
			} else if (res == "meteorite") {
				if (scResources.plasma.inStorage() < 3*gainNum ||
					scResources.meteorite.inStorage() >= 10000 ||
					contains(resourcesUnlocked, "meteoriteEMC")) {doClick = false;}
			} else if (contains(["charcoal","energy","rocketFuel","science"], res)) {
				doClick = false;
			}
			if (doClick && !scSimulate) {gainResource(res);}
		}
	});
}

// Do EM Conversion
function doEMconversion() {
	if (contains(resourcesUnlocked, "solCenter")) {
		if (contains(resourcesUnlocked, "emcPage")) {
			// sort unlockedFilteredResources on inStorage
			unlockedFilteredResources = unlockedFilteredResources.sort(function(a, b) {
				return scResources[a].inStorage() - scResources[b].inStorage();
			})
			// convert energy to the resources in lowest reserve
			if (!scSimulate) {
				if (!('energy' in scReserved.cost)) {convertEnergy(unlockedFilteredResources[0])};
				scLog("-- Converted energy to "+unlockedFilteredResources[0]);
			}
		}
		if (contains(resourcesUnlocked, "meteoriteEMC")) {
			if (!scSimulate) {
				if (!('plasma' in scReserved.cost)) {convertPlasma('meteorite')};
				scLog("-- Converted plasma to meteorite");
			}
		}
	}
}
// Solve towards goals
function doGoals() {
	scReserved = {};
	scReserved.item = "";
	scReserved.name = "";
	scReserved.cost = {};
	scReserved.input = {};
	scReserved.override = false;
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
	if (Object.keys(scGoals).some(
		project => Object.keys(scGoals[project]).some(function(goal) {
			var item = scGoals[project][goal];
			if (Object.keys(item.cost).every(function(res) {
				if (!contains(unlockedResources, res) || res == "science" || res == "rocketFuel") {return false;}
				// Do we need to buy storage?
				if (scInStorage(res, scReserved.item) >= scResources[res].maxStorage()) {
					scBuyStorage(res);
				// Can the item be bought in 15 minutes or less of production?
				} else if (scInStorage(res, scReserved.item)+(scPs(res, scReserved.item)*900) >= item.cost[res]()) {
					return true;
				}
				return false;
			})) {
				scReserved.item = goal;
				scReserved.name = goal;
				scReserved.cost = scGoals[project][goal].cost;
				if ("input" in scGoals[project][goal]) {
					scReserved.input = scGoals[project][goal].input;
				}
				scUpdateNavBar(scReserved.name);
				return true;
			} else {return false;}
		})
	)) { return true; }
}
// Try to buy a goal
function buyGoal(item, goal) {
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
	// Clear scDisarded
	scDiscarded = [];
	// Find the best machines for most needed resources to complete goals
	var needed = [];
	// needed = scFindHighestGoalExpenseMachines();
	needed = scFindHighestGoalExpenseMachines();
	//console.log("Needed for goals: "+needed)
	// If there are no goals, buy an extra machine for achievements
	if (needed.length == 0) {needed = [scFindLowestMachineAmount()];}
	//console.log("Needed Crumbs: "+needed)
	// Try to find a path to buy the found machines
	scCrumbs = [];
	// We want to buy the cheapest research in 15 minutes time
	// Unless the cheapest research is less than 10,000 (early game)
	var cheapest = 0; cheapest = Infinity;
	if ('tech' in scGoals) {
		Object.keys(scGoals.tech).forEach(function(project) {
			if (scGoals.tech[project].cost.science() < cheapest) {
				cheapest = scGoals.tech[project].cost.science()
			}
		})
		if ((cheapest < 10000 && scResources.science.ps() * 60 < cheapest) ||
			scResources.science.ps() * 900 < cheapest) {
			needed.unshift(scSortRoiMachine('science')[0]);
		}
	}
	// If energy is lower than 0.0002 of max (excl reserve), increase energy
	if (contains(unlockedResources, 'energy')) {
		var limit = scResources.energy.maxStorage()/5000;
		if (scResources.energy.ps() < limit) {
			needed = [scSortRoiMachine('energy').filter(scRemoveBatteries)[0]];
		}
	}
	// Try to buy stuff.
	//console.log("Need to buy: "+needed)
	if (needed.some(machine => followBreadcrumbs(machine))) {return true;}
	return false;
}
var scCrumbs = [];
// Follow the crumbs
function followBreadcrumbs(machine) {
	if (contains(scDiscarded, machine)) {return false;}
	if (machine.length == 0) {return false;}
	// Try to buy the machine
	scCrumbs.push(machine);
	// Override the reserved check for these procedures, only if it's not a scGoal
	if (contains(unlockedMachines, scReserved.item)) {scReserved.override = true;}
	if (scBuyMachine(machine)) {return true;}
	// The machine couldn't be bought.
	// Blacklist the resources required to buy & supply this machine.
	if (scReserved.item == "") {
		scReserved.item = machine;
		scReserved.name = scMachines[machine].name;
		scReserved.cost = scMachines[machine].cost;
		scReserved.input = scMachines[machine].input;
		scUpdateNavBar(scReserved.name);
	}
	var needed = [];
	// Do we need more supply to buy the machine?
	var storage = [];
	if (!scSupplyableMachine(machine)) {
		// We need to increase one of the supplied materials
		needed = needed.concat(Object.keys(scMachines[machine].input).filter(function(mat) {
			// Ignore this material if storage is full, buy storage instead
			if (scInStorage(mat, scReserved.item) >= scResources[mat].maxStorage()) {storage.push(mat) ; return false;}
			if (scMachines[machine].input[mat]() > scResources[mat].ps()) {return true;}
			return false;
		}))
	}
	// Do we need more resources to buy the machine?
	if (!scAffordableMachine(machine)) {
		// If we can't reach the goal in 60 seconds, buy more production
		needed = needed.concat(Object.keys(scMachines[machine].cost).filter(function(mat) {
			// Ignore this material if storage is full, buy storage instead
			if (scInStorage(mat, scReserved.item) >= scResources[mat].maxStorage()) {storage.push(mat) ; return false;}
			if ((scMachines[machine].cost[mat]() > scResources[mat].inStorage()+(scResources[mat].ps()*60))) {return true;}
			return false;
		}))
	}
	// Buy the storage we need
	if (storage.length > 0) {
		// remove doubles
		storage = storage.filter(function(elem, index, self) {
    		return index === self.indexOf(elem);
    	})
    	if (storage.some(mat => scBuyStorage(mat))) {return true;}
	}
	scReserved.override = false;
	// Add the current examined machine to scDiscarded to avoid a recheck
	scDiscarded.push(machine);
	// Translate the needed resources to machines
	var machines = [];
	needed.forEach(function(resource) {
		var tmp = scSortRoiMachine(resource)
		machines = machines.concat(tmp.filter(function(machine) {
			// Machine is the best we can buy
			if (machine == tmp[0]) { return true; }
			// Machine produces energy
			if (resource == 'energy') { return true; }
			// Machine is needed to supply an energy producer
			if (contains(scEnergyInput, resource)) { return true; }
			// Resource's output is less than 1ps
			if (scResources[resource].ps() < 1) { return true; }
			// Machine doesn't use energy as input
			if (!('energy' in scMachines[machine].input)) { return true; }
			return false;
		}))
	})
	// Remove batteries & discarded from the list
	machines = machines.filter(scRemoveBatteries).filter(m => !contains(scDiscarded, m))
	// remove doubles
	needed = needed.filter(function(elem, index, self) {
    	return index === self.indexOf(elem);
	})
	//console.log("crumbs: "+ scCrumbs);
	//console.log("Needed machines: "+needed);
	//console.log("Discarded: "+scDiscarded);
	//console.log("Check machines: "+machines)
	// Try to increase these resources
	return machines.some(need => followBreadcrumbs(need));
}





unsafeWindow.unlockedResources = [];
unsafeWindow.unlockedFilteredResources = [];
unsafeWindow.unlockedMachines = [];
unsafeWindow.unlockedPlanets = [];
unsafeWindow.scEnergyInput = [];
unsafeWindow.scReserved = {};
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
    	doGoals();
    	// Try to buy machines to complete goals
    	// - Prioritizes buying energy suppliers
    	// - Tries to buy research to complete the cheapest in 15 minutes
    	// - Loops through goals & tries to buy machines
    	// - Tries to buy supporting machines for supply or resource gain
    	generateBreadcrumbs();
    }, 2000); //Check two seconds.

    // Slow loop
    var slowLoop = setInterval(function() {
    	// Force rebuild data.
    	scUnlocks = -1;
    	doEMconversion();
    }, 60000); //Check every minute.

}, 5000); // Wait 5 seconds after loading the page to start the script.
