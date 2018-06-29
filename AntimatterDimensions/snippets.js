// Calculates the total cost of a dyson ring
var cost = {};
var mats = ["titanium", "gold", "silicon", "meteorite", "ice"];
var basecost = {"titanium": 300000, "gold": 100000, "silicon": 200000, "meteorite": 1000, "ice": 100000}
mats.forEach(m => cost[m] = 0);
Object.keys(basecost).forEach(function(m) {
	for (var i = 0; i < 50; i++) {
		cost[m] += Math.floor(basecost[m] * Math.pow(1.02,i));
	}		
})

// Calculates the total cost of a dyson swarm
var cost = {};
var mats = ["titanium", "gold", "silicon", "meteorite", "ice"];
var basecost = {"titanium": 300000, "gold": 100000, "silicon": 200000, "meteorite": 1000, "ice": 100000}
mats.forEach(m => cost[m] = 0);
Object.keys(basecost).forEach(function(m) {
	for (var i = 0; i < 100; i++) {
		cost[m] += Math.floor(basecost[m] * Math.pow(1.02,i));
	}		
})

// Calculates the total cost of a dyson sphere
var cost = {};
var mats = ["titanium", "gold", "silicon", "meteorite", "ice"];
var basecost = {"titanium": 300000, "gold": 100000, "silicon": 200000, "meteorite": 1000, "ice": 100000}
mats.forEach(m => cost[m] = 0);
Object.keys(basecost).forEach(function(m) {
	for (var i = 0; i < 250; i++) {
		cost[m] += Math.floor(basecost[m] * Math.pow(1.02,i));
	}		
})

// Corrects the internal variables after using a script to buy storages using internal functions
for (res in Game.resources.entries) {if (Game.resources.entries[res].baseCapacity == 50) {window[res+"NextStorage"] = window[res+"Storage"]*2;}}

// Buys storage by simulating a click on the 'buy storage' button every 5 seconds
var storageLoop = setInterval(function() {var nodes = document.querySelectorAll('tr[id$=StorageUpgrade]:not(.hidden)');nodes.forEach(function(res) {var node = res.querySelector('button[onclick*=Storage]:not(.hidden)').click();})}, 5000);

