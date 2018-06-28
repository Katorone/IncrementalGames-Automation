// ==UserScript==
// @name         Space Company automation
// @namespace    SpaceCompany
// @version      0 alpha
// @description  Taking over the universe, one machine at a time.
// @author       u/Katorone
// @match        https://sparticle999.github.io/SpaceCompany/
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

// Inspired by: https://gist.github.com/Dimelsondroid/f5c2ba0233192a8a92c134dc78f367a6

// Output debug messages to the console?
unsafeWindow.scDebug = false;
// Only announce what we're doing, not actually do it?
unsafeWindow.scSimulate = false;
// Some machines require input to keep working (energy, charcoal)
// Only spend the excess production of these inputs if storage can be
// filled in x seconds.
unsafeWindow.scReserve = 300;





// Metal
var scResources = {};
scResources.metal = {};
scResources.metal.ps = function() {return metalps;};
scResources.metal.inStorage = function() {return getResource("metal");};
scResources.metal.maxStorage = function() {return getStorage("metal");};
scResources.metal.buyStorage = upgradeMetalStorage;
scResources.metal.EMC = function() {return metalEmcVal;};
scResources.metal.Machines = {};
scResources.metal.Machines.T1 = {};
scResources.metal.Machines.T1.enabled = function() {return true;};
scResources.metal.Machines.T1.name = 'miner';
scResources.metal.Machines.T1.count = function() {return miner;};
scResources.metal.Machines.T1.buyFunct = getMiner;
scResources.metal.Machines.T1.input = {'energy': function() {return 0;}};
scResources.metal.Machines.T1.output = function() {return minerOutput;};
scResources.metal.Machines.T1.mats = {'wood': function() {return minerWoodCost;}, 'metal': function() {return minerMetalCost;}};
scResources.metal.Machines.T2 = {};
scResources.metal.Machines.T2.enabled = function() {return Game.tech.isPurchased("unlockMachines");};
scResources.metal.Machines.T2.name = 'heavyDrill';
scResources.metal.Machines.T2.count = function() {return heavyDrill;};
scResources.metal.Machines.T2.buyFunct = getHeavyDrill;
scResources.metal.Machines.T2.input = {'energy': function() {return heavyDrillEnergyInput;}};
scResources.metal.Machines.T2.output = function() {return heavyDrillOutput;};
scResources.metal.Machines.T2.mats = {'oil': function() {return heavyDrillOilCost;}, 'gem': function() {return heavyDrillGemCost;}, 'metal': function() {return heavyDrillMetalCost;}};
scResources.metal.Machines.T3 = {};
scResources.metal.Machines.T3.enabled = function() {return contains(activated, "tech");};
scResources.metal.Machines.T3.name = 'gigaDrill';
scResources.metal.Machines.T3.count = function() {return gigaDrill;};
scResources.metal.Machines.T3.buyFunct = getGigaDrill;
scResources.metal.Machines.T3.input = {'energy': function() {return gigaDrillEnergyInput;}};
scResources.metal.Machines.T3.output = function() {return gigaDrillOutput;};
scResources.metal.Machines.T3.mats = {'silicon': function() {return gigaDrillSiliconCost;}, 'gem': function() {return gigaDrillGemCost;}, 'lunarite': function() {return gigaDrillLunariteCost;}};
scResources.metal.Machines.T4 = {};
scResources.metal.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.metal.Machines.T4.name = 'quantumDrill';
scResources.metal.Machines.T4.count = function() {return quantumDrill;};
scResources.metal.Machines.T4.buyFunct = getQuantumDrill;
scResources.metal.Machines.T4.input = {'energy': function() {return quantumDrillEnergyInput;}};
scResources.metal.Machines.T4.output = function() {return quantumDrillOutput;};
scResources.metal.Machines.T4.mats = {'meteorite': function() {return quantumDrillMeteoriteCost;}, 'gold': function() {return quantumDrillGoldCost;}, 'lunarite': function() {return quantumDrillLunariteCost;}};
scResources.metal.Machines.T5 = {};
scResources.metal.Machines.T5.enabled = function() {return false;};
scResources.metal.Machines.T5.name = 'multiDrill';
scResources.metal.Machines.T5.count = function() {return multiDrill;};
scResources.metal.Machines.T5.buyFunct = getMultiDrill;
scResources.metal.Machines.T5.input = {'energy': function() {return multiDrillEnergyInput;}};
scResources.metal.Machines.T5.output = function() {return multiDrillOutput;};
scResources.metal.Machines.T5.mats = {'titanium': function() {return multiDrillTitaniumCost;}, 'gold': function() {return multiDrillGoldCost;}, 'oil': function() {return multiDrillOilCost;}};
// Gem
scResources.gem = {};
scResources.gem.ps = function() {return gemps;};
scResources.gem.inStorage = function() {return getResource("gem");};
scResources.gem.maxStorage = function() {return getStorage("gem");};
scResources.gem.buyStorage = upgradeGemStorage;
scResources.gem.EMC = function() {return gemEmcVal;};
scResources.gem.Machines = {};
scResources.gem.Machines.T1 = {};
scResources.gem.Machines.T1.enabled = function() {return true;};
scResources.gem.Machines.T1.name = 'gemMiner';
scResources.gem.Machines.T1.count = function() {return gemMiner;};
scResources.gem.Machines.T1.buyFunct = getGemMiner;
scResources.gem.Machines.T1.input = {'energy': function() {return 0;}};
scResources.gem.Machines.T1.output = function() {return gemMinerOutput;};
scResources.gem.Machines.T1.mats = {'gem': function() {return gemMinerGemCost;}, 'metal': function() {return gemMinerMetalCost;}};
scResources.gem.Machines.T2 = {};
scResources.gem.Machines.T2.enabled = function() {return Game.tech.isPurchased("unlockMachines");};
scResources.gem.Machines.T2.name = 'advancedDrill';
scResources.gem.Machines.T2.count = function() {return advancedDrill;};
scResources.gem.Machines.T2.buyFunct = getAdvancedDrill;
scResources.gem.Machines.T2.input = {'energy': function() {return advancedDrillEnergyInput;}};
scResources.gem.Machines.T2.output = function() {return advancedDrillOutput;};
scResources.gem.Machines.T2.mats = {'oil': function() {return advancedDrillOilCost;}, 'gem': function() {return advancedDrillGemCost;}, 'metal': function() {return advancedDrillMetalCost;}};
scResources.gem.Machines.T3 = {};
scResources.gem.Machines.T3.enabled = function() {return contains(activated, "tech");};
scResources.gem.Machines.T3.name = 'diamondDrill';
scResources.gem.Machines.T3.count = function() {return diamondDrill;};
scResources.gem.Machines.T3.buyFunct = getDiamondDrill;
scResources.gem.Machines.T3.input = {'energy': function() {return diamondDrillEnergyInput;}};
scResources.gem.Machines.T3.output = function() {return diamondDrillOutput;};
scResources.gem.Machines.T3.mats = {'silicon': function() {return diamondDrillSiliconCost;}, 'gem': function() {return diamondDrillGemCost;}, 'lunarite': function() {return diamondDrillLunariteCost;}};
scResources.gem.Machines.T4 = {};
scResources.gem.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.gem.Machines.T4.name = 'carbyneDrill';
scResources.gem.Machines.T4.count = function() {return carbyneDrill;};
scResources.gem.Machines.T4.buyFunct = getCarbyneDrill;
scResources.gem.Machines.T4.input = {'energy': function() {return carbyneDrillEnergyInput;}};
scResources.gem.Machines.T4.output = function() {return carbyneDrillOutput;};
scResources.gem.Machines.T4.mats = {'meteorite': function() {return carbyneDrillMeteoriteCost;}, 'gem': function() {return carbyneDrillGemCost;}, 'lunarite': function() {return carbyneDrillLunariteCost;}};
scResources.gem.Machines.T5 = {};
scResources.gem.Machines.T5.enabled = function() {return false;};
scResources.gem.Machines.T5.name = 'diamondChamber';
scResources.gem.Machines.T5.count = function() {return diamondChamber;};
scResources.gem.Machines.T5.buyFunct = getDiamondChamber;
scResources.gem.Machines.T5.input = {'energy': function() {return diamondChamberEnergyInput;}};
scResources.gem.Machines.T5.output = function() {return diamondChamberOutput;};
scResources.gem.Machines.T5.mats = {'uranium': function() {return diamondChamberUraniumCost;}, 'charcoal': function() {return diamondChamberCharcoalCost;}, 'meteorite': function() {return diamondChamberMeteoriteCost;}};
// Wood
scResources.wood = {};
scResources.wood.ps = function() {return woodps;};
scResources.wood.inStorage = function() {return getResource("wood");};
scResources.wood.maxStorage = function() {return getStorage("wood");};
scResources.wood.buyStorage = upgradeWoodStorage;
scResources.wood.EMC = function() {return woodEmcVal;};
scResources.wood.Machines = {};
scResources.wood.Machines.T1 = {};
scResources.wood.Machines.T1.enabled = function() {return true;};
scResources.wood.Machines.T1.name = 'woodcutter';
scResources.wood.Machines.T1.count = function() {return woodcutter;};
scResources.wood.Machines.T1.buyFunct = getWoodcutter;
scResources.wood.Machines.T1.input = {'energy': function() {return 0;}};
scResources.wood.Machines.T1.output = function() {return woodcutterOutput;};
scResources.wood.Machines.T1.mats = {'wood': function() {return woodcutterWoodCost;}, 'metal': function() {return woodcutterMetalCost;}};
scResources.wood.Machines.T2 = {};
scResources.wood.Machines.T2.enabled = function() {return Game.tech.isPurchased("unlockMachines");};
scResources.wood.Machines.T2.name = 'laserCutter';
scResources.wood.Machines.T2.count = function() {return laserCutter;};
scResources.wood.Machines.T2.buyFunct = getLaserCutter;
scResources.wood.Machines.T2.input = {'energy': function() {return laserCutterEnergyInput;}};
scResources.wood.Machines.T2.output = function() {return laserCutterOutput;};
scResources.wood.Machines.T2.mats = {'oil': function() {return laserCutterOilCost;}, 'gem': function() {return laserCutterGemCost;}, 'metal': function() {return laserCutterMetalCost;}};
scResources.wood.Machines.T3 = {};
scResources.wood.Machines.T3.enabled = function() {return contains(activated, "tech");};
scResources.wood.Machines.T3.name = 'deforester';
scResources.wood.Machines.T3.count = function() {return deforester;};
scResources.wood.Machines.T3.buyFunct = getDeforester;
scResources.wood.Machines.T3.input = {'energy': function() {return deforesterEnergyInput;}};
scResources.wood.Machines.T3.output = function() {return deforesterOutput;};
scResources.wood.Machines.T3.mats = {'lunarite': function() {return deforesterLunariteCost;}, 'titanium': function() {return deforesterTitaniumCost;}, 'silicon': function() {return deforesterSiliconCost;}};
scResources.wood.Machines.T4 = {};
scResources.wood.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.wood.Machines.T4.name = 'infuser';
scResources.wood.Machines.T4.count = function() {return infuser;};
scResources.wood.Machines.T4.buyFunct = getInfuser;
scResources.wood.Machines.T4.input = {'energy': function() {return infuserEnergyInput;}};
scResources.wood.Machines.T4.output = function() {return infuserOutput;};
scResources.wood.Machines.T4.mats = {'lunarite': function() {return infuserLunariteCost;}, 'oil': function() {return infuserOilCost;}, 'meteorite': function() {return infuserMeteoriteCost;}};
scResources.wood.Machines.T5 = {};
scResources.wood.Machines.T5.enabled = function() {return false;};
scResources.wood.Machines.T5.name = 'forest';
scResources.wood.Machines.T5.count = function() {return forest;};
scResources.wood.Machines.T5.buyFunct = getForest;
scResources.wood.Machines.T5.input = {'energy': function() {return forestEnergyInput;}};
scResources.wood.Machines.T5.output = function() {return forestOutput;};
scResources.wood.Machines.T5.mats = {'metal': function() {return forestMetalCost;}, 'gem': function() {return forestGemCost;}, 'hydrogen': function() {return forestHydrogenCost;}};
// Oil
scResources.oil = {};
scResources.oil.ps = function() {return oilps;};
scResources.oil.inStorage = function() {return getResource("oil");};
scResources.oil.maxStorage = function() {return getStorage("oil");};
scResources.oil.buyStorage = upgradeOilStorage;
scResources.oil.EMC = function() {return oilEmcVal;};
scResources.oil.Machines = {};
scResources.oil.Machines.T1 = {};
scResources.oil.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "oilNav");};
scResources.oil.Machines.T1.name = 'pump';
scResources.oil.Machines.T1.count = function() {return pump;};
scResources.oil.Machines.T1.buyFunct = getPump;
scResources.oil.Machines.T1.input = {'energy': function() {return 0;}};
scResources.oil.Machines.T1.output = function() {return pumpOutput;};
scResources.oil.Machines.T1.mats = {'metal': function() {return pumpMetalCost;}, 'gem': function() {return pumpGemCost;}};
scResources.oil.Machines.T2 = {};
scResources.oil.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "oilNav") && Game.tech.isPurchased("unlockMachines");};
scResources.oil.Machines.T2.name = 'pumpjack';
scResources.oil.Machines.T2.count = function() {return pumpjack;};
scResources.oil.Machines.T2.buyFunct = getPumpjack;
scResources.oil.Machines.T2.input = {'energy': function() {return pumpjackEnergyInput;}};
scResources.oil.Machines.T2.output = function() {return pumpjackOutput;};
scResources.oil.Machines.T2.mats = {'oil': function() {return pumpjackOilCost;}, 'gem': function() {return pumpjackGemCost;}, 'metal': function() {return pumpjackMetalCost;}};
scResources.oil.Machines.T3 = {};
scResources.oil.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "oilNav") && contains(activated, "tech");};
scResources.oil.Machines.T3.name = 'oilField';
scResources.oil.Machines.T3.count = function() {return oilField;};
scResources.oil.Machines.T3.buyFunct = getOilField;
scResources.oil.Machines.T3.input = {'energy': function() {return oilFieldEnergyInput;}};
scResources.oil.Machines.T3.output = function() {return oilFieldOutput;};
scResources.oil.Machines.T3.mats = {'silicon': function() {return oilFieldSiliconCost;}, 'titanium': function() {return oilFieldTitaniumCost;}, 'lunarite': function() {return oilFieldLunariteCost;}};
scResources.oil.Machines.T4 = {};
scResources.oil.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "oilNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.oil.Machines.T4.name = 'oilRig';
scResources.oil.Machines.T4.count = function() {return oilRig;};
scResources.oil.Machines.T4.buyFunct = getOilRig;
scResources.oil.Machines.T4.input = {'energy': function() {return oilRigEnergyInput;}};
scResources.oil.Machines.T4.output = function() {return oilRigOutput;};
scResources.oil.Machines.T4.mats = {'meteorite': function() {return oilRigMeteoriteCost;}, 'titanium': function() {return oilRigTitaniumCost;}, 'lunarite': function() {return oilRigLunariteCost;}};
scResources.oil.Machines.T5 = {};
scResources.oil.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "oilNav") && false;};
scResources.oil.Machines.T5.name = 'fossilator';
scResources.oil.Machines.T5.count = function() {return fossilator;};
scResources.oil.Machines.T5.buyFunct = getFossilator;
scResources.oil.Machines.T5.input = {'energy': function() {return fossilatorEnergyInput;}};
scResources.oil.Machines.T5.output = function() {return fossilatorOutput;};
scResources.oil.Machines.T5.mats = {'uranium': function() {return fossilatorUraniumCost;}, 'charcoal': function() {return fossilatorCharcoalCost;}, 'lava': function() {return fossilatorLavaCost;}};

scResources.charcoal = {};
scResources.charcoal.ps = function() {return charcoalps;};
scResources.charcoal.inStorage = function() {return getResource("charcoal");};
scResources.charcoal.maxStorage = function() {return getStorage("charcoal");};
scResources.charcoal.buyStorage = upgradeCharcoalStorage;
scResources.charcoal.EMC = function() {return charcoalEmcVal;};
scResources.charcoal.Machines = {};
scResources.charcoal.Machines.T1 = {};
scResources.charcoal.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "charcoalNav");};
scResources.charcoal.Machines.T1.name = 'woodburner';
scResources.charcoal.Machines.T1.count = function() {return woodburner;};
scResources.charcoal.Machines.T1.buyFunct = getWoodburner;
scResources.charcoal.Machines.T1.input = {'wood': function() {return woodburnerWoodInput;}};
scResources.charcoal.Machines.T1.output = function() {return woodburnerOutput;};
scResources.charcoal.Machines.T1.mats = {'wood': function() {return woodburnerWoodCost;}, 'metal': function() {return woodburnerMetalCost;}};
scResources.charcoal.Machines.T2 = {};
scResources.charcoal.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "charcoalNav") && Game.tech.isPurchased("unlockMachines");};
scResources.charcoal.Machines.T2.name = 'furnace';
scResources.charcoal.Machines.T2.count = function() {return furnace;};
scResources.charcoal.Machines.T2.buyFunct = getFurnace;
scResources.charcoal.Machines.T2.input = {'energy': function() {return furnaceEnergyInput;}, 'wood': function() {return furnaceWoodInput;}};
scResources.charcoal.Machines.T2.output = function() {return furnaceOutput;};
scResources.charcoal.Machines.T2.mats = {'wood': function() {return furnaceWoodCost;}, 'oil': function() {return furnaceOilCost;}, 'metal': function() {return furnaceMetalCost;}};
scResources.charcoal.Machines.T3 = {};
scResources.charcoal.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "charcoalNav") && contains(activated, "tech");};
scResources.charcoal.Machines.T3.name = 'kiln';
scResources.charcoal.Machines.T3.count = function() {return kiln;};
scResources.charcoal.Machines.T3.buyFunct = getKiln;
scResources.charcoal.Machines.T3.input = {'energy': function() {return kilnEnergyInput;}, 'wood': function() {return kilnWoodInput;}};
scResources.charcoal.Machines.T3.output = function() {return kilnOutput;};
scResources.charcoal.Machines.T3.mats = {'silicon': function() {return kilnSiliconCost;}, 'gem': function() {return kilnGemCost;}, 'lunarite': function() {return kilnLunariteCost;}};
scResources.charcoal.Machines.T4 = {};
scResources.charcoal.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "charcoalNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.charcoal.Machines.T4.name = 'fryer';
scResources.charcoal.Machines.T4.count = function() {return fryer;};
scResources.charcoal.Machines.T4.buyFunct = getFryer;
scResources.charcoal.Machines.T4.input = {'energy': function() {return fryerEnergyInput;}, 'wood': function() {return fryerWoodInput;}};
scResources.charcoal.Machines.T4.output = function() {return fryerOutput;};
scResources.charcoal.Machines.T4.mats = {'meteorite': function() {return fryerMeteoriteCost;}, 'lava': function() {return fryerLavaCost;}, 'lunarite': function() {return fryerLunariteCost;}};
scResources.charcoal.Machines.T5 = {};
scResources.charcoal.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "charcoalNav") && false;};
scResources.charcoal.Machines.T5.name = 'microPollutor';
scResources.charcoal.Machines.T5.count = function() {return microPollutor;};
scResources.charcoal.Machines.T5.buyFunct = getMicroPollutor;
scResources.charcoal.Machines.T5.input = {'energy': function() {return microPollutorEnergyInput;}, 'wood': function() {return microPollutorWoodCost;}};
scResources.charcoal.Machines.T5.output = function() {return microPollutorOutput;};
scResources.charcoal.Machines.T5.mats = {'metal': function() {return microPollutorMetalCost;}, 'wood': function() {return microPollutorWoodCost;}, 'lava': function() {return microPollutorLavaCost;}};

scResources.silicon = {};
scResources.silicon.ps = function() {return siliconps;};
scResources.silicon.inStorage = function() {return getResource("silicon");};
scResources.silicon.maxStorage = function() {return getStorage("silicon");};
scResources.silicon.buyStorage = upgradeSiliconStorage;
scResources.silicon.EMC = function() {return siliconEmcVal;};
scResources.silicon.Machines = {};
scResources.silicon.Machines.T1 = {};
scResources.silicon.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "siliconNav");};
scResources.silicon.Machines.T1.name = 'blowtorch';
scResources.silicon.Machines.T1.count = function() {return blowtorch;};
scResources.silicon.Machines.T1.buyFunct = getBlowtorch;
scResources.silicon.Machines.T1.input = {'energy': function() {return 0;}};
scResources.silicon.Machines.T1.output = function() {return blowtorchOutput;};
scResources.silicon.Machines.T1.mats = {'lunarite': function() {return blowtorchLunariteCost;}, 'titanium': function() {return blowtorchTitaniumCost;}};
scResources.silicon.Machines.T2 = {};
scResources.silicon.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "siliconNav") && Game.tech.isPurchased("unlockMachines");};
scResources.silicon.Machines.T2.name = 'scorcher';
scResources.silicon.Machines.T2.count = function() {return scorcher;};
scResources.silicon.Machines.T2.buyFunct = getScorcher;
scResources.silicon.Machines.T2.input = {'energy': function() {return scorcherEnergyInput;}};
scResources.silicon.Machines.T2.output = function() {return scorcherOutput;};
scResources.silicon.Machines.T2.mats = {'oil': function() {return scorcherOilCost;}, 'gem': function() {return scorcherGemCost;}, 'lunarite': function() {return scorcherLunariteCost;}};
scResources.silicon.Machines.T3 = {};
scResources.silicon.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "siliconNav") && contains(activated, "tech");};
scResources.silicon.Machines.T3.name = 'annihilator';
scResources.silicon.Machines.T3.count = function() {return annihilator;};
scResources.silicon.Machines.T3.buyFunct = getAnnihilator;
scResources.silicon.Machines.T3.input = {'energy': function() {return annihilatorEnergyInput;}};
scResources.silicon.Machines.T3.output = function() {return annihilatorOutput;};
scResources.silicon.Machines.T3.mats = {'lunarite': function() {return annihilatorLunariteCost;}, 'gem': function() {return annihilatorGemCost;}, 'silver': function() {return annihilatorSilverCost;}};
scResources.silicon.Machines.T4 = {};
scResources.silicon.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "siliconNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.silicon.Machines.T4.name = 'desert';
scResources.silicon.Machines.T4.count = function() {return desert;};
scResources.silicon.Machines.T4.buyFunct = getDesert;
scResources.silicon.Machines.T4.input = {'energy': function() {return desertEnergyInput;}};
scResources.silicon.Machines.T4.output = function() {return desertOutput;};
scResources.silicon.Machines.T4.mats = {'lunarite': function() {return desertLunariteCost;}, 'silicon': function() {return desertSiliconCost;}, 'meteorite': function() {return desertMeteoriteCost;}};
scResources.silicon.Machines.T5 = {};
scResources.silicon.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "siliconNav") && false;};
scResources.silicon.Machines.T5.name = 'tardis';
scResources.silicon.Machines.T5.count = function() {return tardis;};
scResources.silicon.Machines.T5.buyFunct = getTardis;
scResources.silicon.Machines.T5.input = {'energy': function() {return tardisEnergyInput;}};
scResources.silicon.Machines.T5.output = function() {return tardisOutput;};
scResources.silicon.Machines.T5.mats = {'titanium': function() {return tardisTitaniumCost;}, 'silicon': function() {return tardisSiliconCost;}, 'meteorite': function() {return tardisMeteoriteCost;}};

scResources.lunarite = {};
scResources.lunarite.ps = function() {return lunariteps;};
scResources.lunarite.inStorage = function() {return getResource("lunarite");};
scResources.lunarite.maxStorage = function() {return getStorage("lunarite");};
scResources.lunarite.buyStorage = upgradeLunariteStorage;
scResources.lunarite.EMC = function() {return lunariteEmcVal;};
scResources.lunarite.Machines = {};
scResources.lunarite.Machines.T1 = {};
scResources.lunarite.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "lunariteNav");};
scResources.lunarite.Machines.T1.name = 'moonWorker';
scResources.lunarite.Machines.T1.count = function() {return moonWorker;};
scResources.lunarite.Machines.T1.buyFunct = getMoonWorker;
scResources.lunarite.Machines.T1.input = {'energy': function() {return 0;}};
scResources.lunarite.Machines.T1.output = function() {return moonWorkerOutput;};
scResources.lunarite.Machines.T1.mats = {'gem': function() {return moonWorkerGemCost;}};
scResources.lunarite.Machines.T2 = {};
scResources.lunarite.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "lunariteNav") && Game.tech.isPurchased("unlockMachines");};
scResources.lunarite.Machines.T2.name = 'moonDrill';
scResources.lunarite.Machines.T2.count = function() {return moonDrill;};
scResources.lunarite.Machines.T2.buyFunct = getMoonDrill;
scResources.lunarite.Machines.T2.input = {'energy': function() {return moonDrillEnergyInput;}};
scResources.lunarite.Machines.T2.output = function() {return moonDrillOutput;};
scResources.lunarite.Machines.T2.mats = {'oil': function() {return moonDrillOilCost;}, 'gem': function() {return moonDrillGemCost;}, 'metal': function() {return moonDrillMetalCost;}};
scResources.lunarite.Machines.T3 = {};
scResources.lunarite.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "lunariteNav") && contains(activated, "tech");};
scResources.lunarite.Machines.T3.name = 'moonQuarry';
scResources.lunarite.Machines.T3.count = function() {return moonQuarry;};
scResources.lunarite.Machines.T3.buyFunct = getMoonQuarry;
scResources.lunarite.Machines.T3.input = {'energy': function() {return moonQuarryEnergyInput;}};
scResources.lunarite.Machines.T3.output = function() {return moonQuarryOutput;};
scResources.lunarite.Machines.T3.mats = {'silicon': function() {return moonQuarrySiliconCost;}, 'gem': function() {return moonQuarryGemCost;}, 'lunarite': function() {return moonQuarryLunariteCost;}};
scResources.lunarite.Machines.T4 = {};
scResources.lunarite.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "lunariteNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.lunarite.Machines.T4.name = 'planetExcavator';
scResources.lunarite.Machines.T4.count = function() {return planetExcavator;};
scResources.lunarite.Machines.T4.buyFunct = getPlanetExcavator;
scResources.lunarite.Machines.T4.input = {'energy': function() {return planetExcavatorEnergyInput;}};
scResources.lunarite.Machines.T4.output = function() {return planetExcavatorOutput;};
scResources.lunarite.Machines.T4.mats = {'meteorite': function() {return planetExcavatorMeteoriteCost;}, 'ice': function() {return planetExcavatorIceCost;}, 'titanium': function() {return planetExcavatorTitaniumCost;}};
scResources.lunarite.Machines.T5 = {};
scResources.lunarite.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "lunariteNav") && false;};
scResources.lunarite.Machines.T5.name = 'cloner';
scResources.lunarite.Machines.T5.count = function() {return cloner;};
scResources.lunarite.Machines.T5.buyFunct = getCloner;
scResources.lunarite.Machines.T5.input = {'energy': function() {return clonerEnergyInput;}};
scResources.lunarite.Machines.T5.output = function() {return clonerOutput;};
scResources.lunarite.Machines.T5.mats = {'titanium': function() {return clonerTitaniumCost;}, 'gold': function() {return clonerGoldCost;}, 'methane': function() {return clonerMethaneCost;}};

scResources.methane = {};
scResources.methane.ps = function() {return methaneps;};
scResources.methane.inStorage = function() {return getResource("methane");};
scResources.methane.maxStorage = function() {return getStorage("methane");};
scResources.methane.buyStorage = upgradeMethaneStorage;
scResources.methane.EMC = function() {return methaneEmcVal;};
scResources.methane.Machines = {};
scResources.methane.Machines.T1 = {};
scResources.methane.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "methaneNav");};
scResources.methane.Machines.T1.name = 'vacuum';
scResources.methane.Machines.T1.count = function() {return vacuum;};
scResources.methane.Machines.T1.buyFunct = getVacuum;
scResources.methane.Machines.T1.input = {'energy': function() {return 0;}};
scResources.methane.Machines.T1.output = function() {return vacuumOutput;};
scResources.methane.Machines.T1.mats = {'gem': function() {return vacuumGemCost;}, 'lunarite': function() {return vacuumLunariteCost;}};
scResources.methane.Machines.T2 = {};
scResources.methane.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "methaneNav") && Game.tech.isPurchased("unlockMachines");};
scResources.methane.Machines.T2.name = 'suctionExcavator';
scResources.methane.Machines.T2.count = function() {return suctionExcavator;};
scResources.methane.Machines.T2.buyFunct = getSuctionExcavator;
scResources.methane.Machines.T2.input = {'energy': function() {return suctionExcavatorEnergyInput;}};
scResources.methane.Machines.T2.output = function() {return suctionExcavatorOutput;};
scResources.methane.Machines.T2.mats = {'oil': function() {return suctionExcavatorOilCost;}, 'gem': function() {return suctionExcavatorGemCost;}, 'lunarite': function() {return suctionExcavatorLunariteCost;}};
scResources.methane.Machines.T3 = {};
scResources.methane.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "methaneNav") && contains(activated, "tech");};
scResources.methane.Machines.T3.name = 'spaceCow';
scResources.methane.Machines.T3.count = function() {return spaceCow;};
scResources.methane.Machines.T3.buyFunct = getSpaceCow;
scResources.methane.Machines.T3.input = {'energy': function() {return spaceCowEnergyInput;}};
scResources.methane.Machines.T3.output = function() {return spaceCowOutput;};
scResources.methane.Machines.T3.mats = {'silicon': function() {return spaceCowSiliconCost;}, 'titanium': function() {return spaceCowTitaniumCost;}, 'lunarite': function() {return spaceCowLunariteCost;}};
scResources.methane.Machines.T4 = {};
scResources.methane.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "methaneNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.methane.Machines.T4.name = 'vent';
scResources.methane.Machines.T4.count = function() {return vent;};
scResources.methane.Machines.T4.buyFunct = getVent;
scResources.methane.Machines.T4.input = {'energy': function() {return ventEnergyInput;}};
scResources.methane.Machines.T4.output = function() {return ventOutput;};
scResources.methane.Machines.T4.mats = {'meteorite': function() {return ventMeteoriteCost;}, 'helium': function() {return ventHeliumCost;}, 'lunarite': function() {return ventLunariteCost;}};
scResources.methane.Machines.T5 = {};
scResources.methane.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "methaneNav") && false;};
scResources.methane.Machines.T5.name = 'interCow';
scResources.methane.Machines.T5.count = function() {return interCow;};
scResources.methane.Machines.T5.buyFunct = getInterCow;
scResources.methane.Machines.T5.input = {'energy': function() {return interCowEnergyInput;}};
scResources.methane.Machines.T5.output = function() {return interCowOutput;};
scResources.methane.Machines.T5.mats = {'lunarite': function() {return interCowLunariteCost;}, 'gold': function() {return interCowGoldCost;}, 'hydrogen': function() {return interCowHydrogenCost;}};

scResources.titanium = {};
scResources.titanium.ps = function() {return titaniumps;};
scResources.titanium.inStorage = function() {return getResource("titanium");};
scResources.titanium.maxStorage = function() {return getStorage("titanium");};
scResources.titanium.buyStorage = upgradeTitaniumStorage;
scResources.titanium.EMC = function() {return titaniumEmcVal;};
scResources.titanium.Machines = {};
scResources.titanium.Machines.T1 = {};
scResources.titanium.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "titaniumNav");};
scResources.titanium.Machines.T1.name = 'explorer';
scResources.titanium.Machines.T1.count = function() {return explorer;};
scResources.titanium.Machines.T1.buyFunct = getExplorer;
scResources.titanium.Machines.T1.input = {'energy': function() {return 0;}};
scResources.titanium.Machines.T1.output = function() {return explorerOutput;};
scResources.titanium.Machines.T1.mats = {'gem': function() {return explorerGemCost;}};
scResources.titanium.Machines.T2 = {};
scResources.titanium.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "titaniumNav") && Game.tech.isPurchased("unlockMachines");};
scResources.titanium.Machines.T2.name = 'lunariteDrill';
scResources.titanium.Machines.T2.count = function() {return lunariteDrill;};
scResources.titanium.Machines.T2.buyFunct = getLunariteDrill;
scResources.titanium.Machines.T2.input = {'energy': function() {return lunariteDrillEnergyInput;}};
scResources.titanium.Machines.T2.output = function() {return lunariteDrillOutput;};
scResources.titanium.Machines.T2.mats = {'oil': function() {return lunariteDrillOilCost;}, 'gem': function() {return lunariteDrillGemCost;}, 'lunarite': function() {return lunariteDrillLunariteCost;}};
scResources.titanium.Machines.T3 = {};
scResources.titanium.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "titaniumNav") && contains(activated, "tech");};
scResources.titanium.Machines.T3.name = 'pentaDrill';
scResources.titanium.Machines.T3.count = function() {return pentaDrill;};
scResources.titanium.Machines.T3.buyFunct = getPentaDrill;
scResources.titanium.Machines.T3.input = {'energy': function() {return pentaDrillEnergyInput;}};
scResources.titanium.Machines.T3.output = function() {return pentaDrillOutput;};
scResources.titanium.Machines.T3.mats = {'silicon': function() {return pentaDrillSiliconCost;}, 'gem': function() {return pentaDrillGemCost;}, 'lunarite': function() {return pentaDrillLunariteCost;}};
scResources.titanium.Machines.T4 = {};
scResources.titanium.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "titaniumNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.titanium.Machines.T4.name = 'titanDrill';
scResources.titanium.Machines.T4.count = function() {return titanDrill;};
scResources.titanium.Machines.T4.buyFunct = getTitanDrill;
scResources.titanium.Machines.T4.input = {'energy': function() {return titanDrillEnergyInput;}};
scResources.titanium.Machines.T4.output = function() {return titanDrillOutput;};
scResources.titanium.Machines.T4.mats = {'lunarite': function() {return titanDrillLunariteCost;}, 'gold': function() {return titanDrillGoldCost;}, 'meteorite': function() {return titanDrillMeteoriteCost;}};
scResources.titanium.Machines.T5 = {};
scResources.titanium.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "titaniumNav") && false;};
scResources.titanium.Machines.T5.name = 'club';
scResources.titanium.Machines.T5.count = function() {return club;};
scResources.titanium.Machines.T5.buyFunct = getClub;
scResources.titanium.Machines.T5.input = {'energy': function() {return clubEnergyInput;}};
scResources.titanium.Machines.T5.output = function() {return clubOutput;};
scResources.titanium.Machines.T5.mats = {'uranium': function() {return clubUraniumCost;}, 'wood': function() {return clubWoodCost;}, 'helium': function() {return clubHeliumCost;}};

scResources.gold = {};
scResources.gold.ps = function() {return goldps;};
scResources.gold.inStorage = function() {return getResource("gold");};
scResources.gold.maxStorage = function() {return getStorage("gold");};
scResources.gold.buyStorage = upgradeGoldStorage;
scResources.gold.EMC = function() {return goldEmcVal;};
scResources.gold.Machines = {};
scResources.gold.Machines.T1 = {};
scResources.gold.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "goldNav");};
scResources.gold.Machines.T1.name = 'droid';
scResources.gold.Machines.T1.count = function() {return droid;};
scResources.gold.Machines.T1.buyFunct = getDroid;
scResources.gold.Machines.T1.input = {'energy': function() {return 0;}};
scResources.gold.Machines.T1.output = function() {return droidOutput;};
scResources.gold.Machines.T1.mats = {'methane': function() {return droidMethaneCost;}, 'lunarite': function() {return droidLunariteCost;}};
scResources.gold.Machines.T2 = {};
scResources.gold.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "goldNav") && Game.tech.isPurchased("unlockMachines");};
scResources.gold.Machines.T2.name = 'destroyer';
scResources.gold.Machines.T2.count = function() {return destroyer;};
scResources.gold.Machines.T2.buyFunct = getDestroyer;
scResources.gold.Machines.T2.input = {'energy': function() {return destroyerEnergyInput;}};
scResources.gold.Machines.T2.output = function() {return destroyerOutput;};
scResources.gold.Machines.T2.mats = {'oil': function() {return destroyerOilCost;}, 'gem': function() {return destroyerGemCost;}, 'lunarite': function() {return destroyerLunariteCost;}};
scResources.gold.Machines.T3 = {};
scResources.gold.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "goldNav") && contains(activated, "tech");};
scResources.gold.Machines.T3.name = 'deathStar';
scResources.gold.Machines.T3.count = function() {return deathStar;};
scResources.gold.Machines.T3.buyFunct = getDeathStar;
scResources.gold.Machines.T3.input = {'energy': function() {return deathStarEnergyInput;}};
scResources.gold.Machines.T3.output = function() {return deathStarOutput;};
scResources.gold.Machines.T3.mats = {'silicon': function() {return deathStarSiliconCost;}, 'silver': function() {return deathStarSilverCost;}, 'lunarite': function() {return deathStarLunariteCost;}};
scResources.gold.Machines.T4 = {};
scResources.gold.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "goldNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.gold.Machines.T4.name = 'actuator';
scResources.gold.Machines.T4.count = function() {return actuator;};
scResources.gold.Machines.T4.buyFunct = getActuator;
scResources.gold.Machines.T4.input = {'energy': function() {return actuatorEnergyInput;}};
scResources.gold.Machines.T4.output = function() {return actuatorOutput;};
scResources.gold.Machines.T4.mats = {'meteorite': function() {return actuatorMeteoriteCost;}, 'helium': function() {return actuatorHeliumCost;}, 'lunarite': function() {return actuatorLunariteCost;}};
scResources.gold.Machines.T5 = {};
scResources.gold.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "goldNav") && false;};
scResources.gold.Machines.T5.name = 'philosopher';
scResources.gold.Machines.T5.count = function() {return philosopher;};
scResources.gold.Machines.T5.buyFunct = getPhilosopher;
scResources.gold.Machines.T5.input = {'energy': function() {return philosopherEnergyInput;}};
scResources.gold.Machines.T5.output = function() {return philosopherOutput;};
scResources.gold.Machines.T5.mats = {'metal': function() {return philosopherMetalCost;}, 'silver': function() {return philosopherSilverCost;}, 'meteorite': function() {return philosopherMeteoriteCost;}};

scResources.silver = {};
scResources.silver.ps = function() {return silverps;};
scResources.silver.inStorage = function() {return getResource("silver");};
scResources.silver.maxStorage = function() {return getStorage("silver");};
scResources.silver.buyStorage = upgradeSilverStorage;
scResources.silver.EMC = function() {return silverEmcVal;};
scResources.silver.Machines = {};
scResources.silver.Machines.T1 = {};
scResources.silver.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "silverNav");};
scResources.silver.Machines.T1.name = 'scout';
scResources.silver.Machines.T1.count = function() {return scout;};
scResources.silver.Machines.T1.buyFunct = getScout;
scResources.silver.Machines.T1.input = {'energy': function() {return 0;}};
scResources.silver.Machines.T1.output = function() {return scoutOutput;};
scResources.silver.Machines.T1.mats = {'titanium': function() {return scoutTitaniumCost;}, 'lunarite': function() {return scoutLunariteCost;}};
scResources.silver.Machines.T2 = {};
scResources.silver.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "silverNav") && Game.tech.isPurchased("unlockMachines");};
scResources.silver.Machines.T2.name = 'spaceLaser';
scResources.silver.Machines.T2.count = function() {return spaceLaser;};
scResources.silver.Machines.T2.buyFunct = getSpaceLaser;
scResources.silver.Machines.T2.input = {'energy': function() {return spaceLaserEnergyInput;}};
scResources.silver.Machines.T2.output = function() {return spaceLaserOutput;};
scResources.silver.Machines.T2.mats = {'oil': function() {return spaceLaserOilCost;}, 'gem': function() {return spaceLaserGemCost;}, 'lunarite': function() {return spaceLaserLunariteCost;}};
scResources.silver.Machines.T3 = {};
scResources.silver.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "silverNav") && contains(activated, "tech");};
scResources.silver.Machines.T3.name = 'bertha';
scResources.silver.Machines.T3.count = function() {return bertha;};
scResources.silver.Machines.T3.buyFunct = getBertha;
scResources.silver.Machines.T3.input = {'energy': function() {return berthaEnergyInput;}};
scResources.silver.Machines.T3.output = function() {return berthaOutput;};
scResources.silver.Machines.T3.mats = {'silicon': function() {return berthaSiliconCost;}, 'titanium': function() {return berthaTitaniumCost;}, 'lunarite': function() {return berthaLunariteCost;}};
scResources.silver.Machines.T4 = {};
scResources.silver.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "silverNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.silver.Machines.T4.name = 'cannon';
scResources.silver.Machines.T4.count = function() {return cannon;};
scResources.silver.Machines.T4.buyFunct = getCannon;
scResources.silver.Machines.T4.input = {'energy': function() {return cannonEnergyInput;}};
scResources.silver.Machines.T4.output = function() {return cannonOutput;};
scResources.silver.Machines.T4.mats = {'meteorite': function() {return cannonMeteoriteCost;}, 'oil': function() {return cannonOilCost;}, 'lunarite': function() {return cannonLunariteCost;}};
scResources.silver.Machines.T5 = {};
scResources.silver.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "silverNav") && false;};
scResources.silver.Machines.T5.name = 'werewolf';
scResources.silver.Machines.T5.count = function() {return werewolf;};
scResources.silver.Machines.T5.buyFunct = getWerewolf;
scResources.silver.Machines.T5.input = {'energy': function() {return werewolfEnergyInput;}};
scResources.silver.Machines.T5.output = function() {return werewolfOutput;};
scResources.silver.Machines.T5.mats = {'uranium': function() {return werewolfUraniumCost;}, 'gem': function() {return werewolfGemCost;}, 'methane': function() {return werewolfMethaneCost;}};

scResources.uranium = {};
scResources.uranium.ps = function() {return uraniumps;};
scResources.uranium.inStorage = function() {return getResource("uranium");};
scResources.uranium.maxStorage = function() {return getStorage("uranium");};
scResources.uranium.buyStorage = upgradeUraniumStorage;
scResources.uranium.EMC = function() {return uraniumEmcVal;};
scResources.uranium.Machines = {};
scResources.uranium.Machines.T1 = {};
scResources.uranium.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "uraniumNav");};
scResources.uranium.Machines.T1.name = 'grinder';
scResources.uranium.Machines.T1.count = function() {return grinder;};
scResources.uranium.Machines.T1.buyFunct = getGrinder;
scResources.uranium.Machines.T1.input = {'energy': function() {return 0;}};
scResources.uranium.Machines.T1.output = function() {return grinderOutput;};
scResources.uranium.Machines.T1.mats = {'titanium': function() {return grinderTitaniumCost;}, 'lunarite': function() {return grinderLunariteCost;}, 'gold': function() {return grinderGoldCost;}};
scResources.uranium.Machines.T2 = {};
scResources.uranium.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "uraniumNav") && Game.tech.isPurchased("unlockMachines");};
scResources.uranium.Machines.T2.name = 'cubic';
scResources.uranium.Machines.T2.count = function() {return cubic;};
scResources.uranium.Machines.T2.buyFunct = getCubic;
scResources.uranium.Machines.T2.input = {'energy': function() {return cubicEnergyInput;}};
scResources.uranium.Machines.T2.output = function() {return cubicOutput;};
scResources.uranium.Machines.T2.mats = {'uranium': function() {return cubicUraniumCost;}, 'lunarite': function() {return cubicLunariteCost;}, 'oil': function() {return cubicOilCost;}};
scResources.uranium.Machines.T3 = {};
scResources.uranium.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "uraniumNav") && contains(activated, "tech");};
scResources.uranium.Machines.T3.name = 'enricher';
scResources.uranium.Machines.T3.count = function() {return enricher;};
scResources.uranium.Machines.T3.buyFunct = getEnricher;
scResources.uranium.Machines.T3.input = {'energy': function() {return enricherEnergyInput;}};
scResources.uranium.Machines.T3.output = function() {return enricherOutput;};
scResources.uranium.Machines.T3.mats = {'silicon': function() {return enricherSiliconCost;}, 'titanium': function() {return enricherTitaniumCost;}, 'lunarite': function() {return enricherLunariteCost;}};
scResources.uranium.Machines.T4 = {};
scResources.uranium.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "uraniumNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.uranium.Machines.T4.name = 'recycler';
scResources.uranium.Machines.T4.count = function() {return recycler;};
scResources.uranium.Machines.T4.buyFunct = getRecycler;
scResources.uranium.Machines.T4.input = {'energy': function() {return recyclerEnergyInput;}};
scResources.uranium.Machines.T4.output = function() {return recyclerOutput;};
scResources.uranium.Machines.T4.mats = {'meteorite': function() {return recyclerMeteoriteCost;}, 'methane': function() {return recyclerMethaneCost;}, 'lunarite': function() {return recyclerLunariteCost;}};
scResources.uranium.Machines.T5 = {};
scResources.uranium.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "uraniumNav") && false;};
scResources.uranium.Machines.T5.name = 'planetNuke';
scResources.uranium.Machines.T5.count = function() {return planetNuke;};
scResources.uranium.Machines.T5.buyFunct = getPlanetNuke;
scResources.uranium.Machines.T5.input = {'energy': function() {return planetNukeEnergyInput;}};
scResources.uranium.Machines.T5.output = function() {return planetNukeOutput;};
scResources.uranium.Machines.T5.mats = {'titanium': function() {return planetNukeTitaniumCost;}, 'silicon': function() {return planetNukeSiliconCost;}, 'ice': function() {return planetNukeIceCost;}};

scResources.lava = {};
scResources.lava.ps = function() {return lavaps;};
scResources.lava.inStorage = function() {return getResource("lava");};
scResources.lava.maxStorage = function() {return getStorage("lava");};
scResources.lava.buyStorage = upgradeLavaStorage;
scResources.lava.EMC = function() {return lavaEmcVal;};
scResources.lava.Machines = {};
scResources.lava.Machines.T1 = {};
scResources.lava.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "lavaNav");};
scResources.lava.Machines.T1.name = 'crucible';
scResources.lava.Machines.T1.count = function() {return crucible;};
scResources.lava.Machines.T1.buyFunct = getCrucible;
scResources.lava.Machines.T1.input = {'energy': function() {return 0;}};
scResources.lava.Machines.T1.output = function() {return crucibleOutput;};
scResources.lava.Machines.T1.mats = {'gem': function() {return crucibleGemCost;}, 'lunarite': function() {return crucibleLunariteCost;}};
scResources.lava.Machines.T2 = {};
scResources.lava.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "lavaNav") && Game.tech.isPurchased("unlockMachines");};
scResources.lava.Machines.T2.name = 'extractor';
scResources.lava.Machines.T2.count = function() {return extractor;};
scResources.lava.Machines.T2.buyFunct = getExtractor;
scResources.lava.Machines.T2.input = {'energy': function() {return extractorEnergyInput;}};
scResources.lava.Machines.T2.output = function() {return extractorOutput;};
scResources.lava.Machines.T2.mats = {'silicon': function() {return extractorSiliconCost;}, 'titanium': function() {return extractorTitaniumCost;}, 'lunarite': function() {return extractorLunariteCost;}};
scResources.lava.Machines.T3 = {};
scResources.lava.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "lavaNav") && contains(activated, "tech");};
scResources.lava.Machines.T3.name = 'extruder';
scResources.lava.Machines.T3.count = function() {return extruder;};
scResources.lava.Machines.T3.buyFunct = getExtruder;
scResources.lava.Machines.T3.input = {'energy': function() {return extruderEnergyInput;}};
scResources.lava.Machines.T3.output = function() {return extruderOutput;};
scResources.lava.Machines.T3.mats = {'silicon': function() {return extruderSiliconCost;}, 'titanium': function() {return extruderTitaniumCost;}, 'lunarite': function() {return extruderLunariteCost;}};
scResources.lava.Machines.T4 = {};
scResources.lava.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "lavaNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.lava.Machines.T4.name = 'veluptuator';
scResources.lava.Machines.T4.count = function() {return veluptuator;};
scResources.lava.Machines.T4.buyFunct = getVeluptuator;
scResources.lava.Machines.T4.input = {'energy': function() {return veluptuatorEnergyInput;}};
scResources.lava.Machines.T4.output = function() {return veluptuatorOutput;};
scResources.lava.Machines.T4.mats = {'meteorite': function() {return veluptuatorMeteoriteCost;}, 'gold': function() {return veluptuatorGoldCost;}, 'lunarite': function() {return veluptuatorLunariteCost;}};
scResources.lava.Machines.T5 = {};
scResources.lava.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "lavaNav") && false;};
scResources.lava.Machines.T5.name = 'condensator';
scResources.lava.Machines.T5.count = function() {return condensator;};
scResources.lava.Machines.T5.buyFunct = getCondensator;
scResources.lava.Machines.T5.input = {'energy': function() {return condensatorEnergyInput;}};
scResources.lava.Machines.T5.output = function() {return condensatorOutput;};
scResources.lava.Machines.T5.mats = {'lunarite': function() {return condensatorLunariteCost;}, 'gem': function() {return condensatorGemCost;}, 'ice': function() {return condensatorIceCost;}};

scResources.helium = {};
scResources.helium.ps = function() {return heliumps;};
scResources.helium.inStorage = function() {return getResource("helium");};
scResources.helium.maxStorage = function() {return getStorage("helium");};
scResources.helium.buyStorage = upgradeHeliumStorage;
scResources.helium.EMC = function() {return heliumEmcVal;};
scResources.helium.Machines = {};
scResources.helium.Machines.T1 = {};
scResources.helium.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "heliumNav");};
scResources.helium.Machines.T1.name = 'drone';
scResources.helium.Machines.T1.count = function() {return drone;};
scResources.helium.Machines.T1.buyFunct = getDrone;
scResources.helium.Machines.T1.input = {'energy': function() {return 0;}};
scResources.helium.Machines.T1.output = function() {return droneOutput;};
scResources.helium.Machines.T1.mats = {'silicon': function() {return droneSiliconCost;}, 'lunarite': function() {return droneLunariteCost;}};
scResources.helium.Machines.T2 = {};
scResources.helium.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "heliumNav") && Game.tech.isPurchased("unlockMachines");};
scResources.helium.Machines.T2.name = 'tanker';
scResources.helium.Machines.T2.count = function() {return tanker;};
scResources.helium.Machines.T2.buyFunct = getTanker;
scResources.helium.Machines.T2.input = {'energy': function() {return tankerEnergyInput;}};
scResources.helium.Machines.T2.output = function() {return tankerOutput;};
scResources.helium.Machines.T2.mats = {'silicon': function() {return tankerSiliconCost;}, 'titanium': function() {return tankerTitaniumCost;}, 'lunarite': function() {return tankerLunariteCost;}};
scResources.helium.Machines.T3 = {};
scResources.helium.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "heliumNav") && contains(activated, "tech");};
scResources.helium.Machines.T3.name = 'compressor';
scResources.helium.Machines.T3.count = function() {return compressor;};
scResources.helium.Machines.T3.buyFunct = getCompressor;
scResources.helium.Machines.T3.input = {'energy': function() {return compressorEnergyInput;}};
scResources.helium.Machines.T3.output = function() {return compressorOutput;};
scResources.helium.Machines.T3.mats = {'silicon': function() {return compressorSiliconCost;}, 'titanium': function() {return compressorTitaniumCost;}, 'lunarite': function() {return compressorLunariteCost;}};
scResources.helium.Machines.T4 = {};
scResources.helium.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "heliumNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.helium.Machines.T4.name = 'skimmer';
scResources.helium.Machines.T4.count = function() {return skimmer;};
scResources.helium.Machines.T4.buyFunct = getSkimmer;
scResources.helium.Machines.T4.input = {'energy': function() {return skimmerEnergyInput;}};
scResources.helium.Machines.T4.output = function() {return skimmerOutput;};
scResources.helium.Machines.T4.mats = {'meteorite': function() {return skimmerMeteoriteCost;}, 'titanium': function() {return skimmerTitaniumCost;}, 'lunarite': function() {return skimmerLunariteCost;}};
scResources.helium.Machines.T5 = {};
scResources.helium.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "heliumNav") && false;};
scResources.helium.Machines.T5.name = 'cage';
scResources.helium.Machines.T5.count = function() {return cage;};
scResources.helium.Machines.T5.buyFunct = getCage;
scResources.helium.Machines.T5.input = {'energy': function() {return cageEnergyInput;}};
scResources.helium.Machines.T5.output = function() {return cageOutput;};
scResources.helium.Machines.T5.mats = {'lunarite': function() {return cageLunariteCost;}, 'silicon': function() {return cageSiliconCost;}, 'meteorite': function() {return cageMeteoriteCost;}};

scResources.hydrogen = {};
scResources.hydrogen.ps = function() {return hydrogenps;};
scResources.hydrogen.inStorage = function() {return getResource("hydrogen");};
scResources.hydrogen.maxStorage = function() {return getStorage("hydrogen");};
scResources.hydrogen.buyStorage = upgradeHydrogenStorage;
scResources.hydrogen.EMC = function() {return hydrogenEmcVal;};
scResources.hydrogen.Machines = {};
scResources.hydrogen.Machines.T1 = {};
scResources.hydrogen.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "hydrogenNav");};
scResources.hydrogen.Machines.T1.name = 'collector';
scResources.hydrogen.Machines.T1.count = function() {return collector;};
scResources.hydrogen.Machines.T1.buyFunct = getCollector;
scResources.hydrogen.Machines.T1.input = {'energy': function() {return 0;}};
scResources.hydrogen.Machines.T1.output = function() {return collectorOutput;};
scResources.hydrogen.Machines.T1.mats = {'titanium': function() {return collectorTitaniumCost;}, 'lunarite': function() {return collectorLunariteCost;}};
scResources.hydrogen.Machines.T2 = {};
scResources.hydrogen.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "hydrogenNav") && Game.tech.isPurchased("unlockMachines");};
scResources.hydrogen.Machines.T2.name = 'magnet';
scResources.hydrogen.Machines.T2.count = function() {return magnet;};
scResources.hydrogen.Machines.T2.buyFunct = getMagnet;
scResources.hydrogen.Machines.T2.input = {'energy': function() {return magnetEnergyInput;}};
scResources.hydrogen.Machines.T2.output = function() {return magnetOutput;};
scResources.hydrogen.Machines.T2.mats = {'gold': function() {return magnetGoldCost;}, 'titanium': function() {return magnetTitaniumCost;}, 'lunarite': function() {return magnetLunariteCost;}};
scResources.hydrogen.Machines.T3 = {};
scResources.hydrogen.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "hydrogenNav") && contains(activated, "tech");};
scResources.hydrogen.Machines.T3.name = 'eCell';
scResources.hydrogen.Machines.T3.count = function() {return eCell;};
scResources.hydrogen.Machines.T3.buyFunct = getECell;
scResources.hydrogen.Machines.T3.input = {'energy': function() {return eCellEnergyInput;}};
scResources.hydrogen.Machines.T3.output = function() {return eCellOutput;};
scResources.hydrogen.Machines.T3.mats = {'gold': function() {return eCellGoldCost;}, 'silicon': function() {return eCellSiliconCost;}, 'silver': function() {return eCellSilverCost;}};
scResources.hydrogen.Machines.T4 = {};
scResources.hydrogen.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "hydrogenNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.hydrogen.Machines.T4.name = 'hindenburg';
scResources.hydrogen.Machines.T4.count = function() {return hindenburg;};
scResources.hydrogen.Machines.T4.buyFunct = getHindenburg;
scResources.hydrogen.Machines.T4.input = {'energy': function() {return hindenburgEnergyInput;}};
scResources.hydrogen.Machines.T4.output = function() {return hindenburgOutput;};
scResources.hydrogen.Machines.T4.mats = {'meteorite': function() {return hindenburgMeteoriteCost;}, 'methane': function() {return hindenburgMethaneCost;}, 'lunarite': function() {return hindenburgLunariteCost;}};
scResources.hydrogen.Machines.T5 = {};
scResources.hydrogen.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "hydrogenNav") && false;};
scResources.hydrogen.Machines.T5.name = 'harvester';
scResources.hydrogen.Machines.T5.count = function() {return harvester;};
scResources.hydrogen.Machines.T5.buyFunct = getHarvester;
scResources.hydrogen.Machines.T5.input = {'energy': function() {return harvesterEnergyInput;}};
scResources.hydrogen.Machines.T5.output = function() {return harvesterOutput;};
scResources.hydrogen.Machines.T5.mats = {'lunarite': function() {return harvesterLunariteCost;}, 'wood': function() {return harvesterWoodCost;}, 'oil': function() {return harvesterOilCost;}};

scResources.ice = {};
scResources.ice.ps = function() {return iceps;};
scResources.ice.inStorage = function() {return getResource("ice");};
scResources.ice.maxStorage = function() {return getStorage("ice");};
scResources.ice.buyStorage = upgradeIceStorage;
scResources.ice.EMC = function() {return iceEmcVal;};
scResources.ice.Machines = {};
scResources.ice.Machines.T1 = {};
scResources.ice.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "iceNav");};
scResources.ice.Machines.T1.name = 'icePick';
scResources.ice.Machines.T1.count = function() {return icePick;};
scResources.ice.Machines.T1.buyFunct = getIcePick;
scResources.ice.Machines.T1.input = {'energy': function() {return 0;}};
scResources.ice.Machines.T1.output = function() {return icePickOutput;};
scResources.ice.Machines.T1.mats = {'gem': function() {return icePickGemCost;}, 'lunarite': function() {return icePickLunariteCost;}};
scResources.ice.Machines.T2 = {};
scResources.ice.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "iceNav") && Game.tech.isPurchased("unlockMachines");};
scResources.ice.Machines.T2.name = 'iceDrill';
scResources.ice.Machines.T2.count = function() {return iceDrill;};
scResources.ice.Machines.T2.buyFunct = getIceDrill;
scResources.ice.Machines.T2.input = {'energy': function() {return iceDrillEnergyInput;}};
scResources.ice.Machines.T2.output = function() {return iceDrillOutput;};
scResources.ice.Machines.T2.mats = {'silicon': function() {return iceDrillSiliconCost;}, 'titanium': function() {return iceDrillTitaniumCost;}, 'lunarite': function() {return iceDrillLunariteCost;}};
scResources.ice.Machines.T3 = {};
scResources.ice.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "iceNav") && contains(activated, "tech");};
scResources.ice.Machines.T3.name = 'freezer';
scResources.ice.Machines.T3.count = function() {return freezer;};
scResources.ice.Machines.T3.buyFunct = getFreezer;
scResources.ice.Machines.T3.input = {'energy': function() {return freezerEnergyInput;}};
scResources.ice.Machines.T3.output = function() {return freezerOutput;};
scResources.ice.Machines.T3.mats = {'silicon': function() {return freezerSiliconCost;}, 'titanium': function() {return freezerTitaniumCost;}, 'lunarite': function() {return freezerLunariteCost;}};
scResources.ice.Machines.T4 = {};
scResources.ice.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "iceNav") && contains(resourcesUnlocked, "wonderFloor2Nav");};
scResources.ice.Machines.T4.name = 'mrFreeze';
scResources.ice.Machines.T4.count = function() {return mrFreeze;};
scResources.ice.Machines.T4.buyFunct = getMrFreeze;
scResources.ice.Machines.T4.input = {'energy': function() {return mrFreezeEnergyInput;}};
scResources.ice.Machines.T4.output = function() {return mrFreezeOutput;};
scResources.ice.Machines.T4.mats = {'meteorite': function() {return mrFreezeMeteoriteCost;}, 'helium': function() {return mrFreezeHeliumCost;}, 'wood': function() {return mrFreezeWoodCost;}};
scResources.ice.Machines.T5 = {};
scResources.ice.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "iceNav") && false;};
scResources.ice.Machines.T5.name = 'overexchange';
scResources.ice.Machines.T5.count = function() {return overexchange;};
scResources.ice.Machines.T5.buyFunct = getOverexchange;
scResources.ice.Machines.T5.input = {'energy': function() {return overexchangeEnergyInput;}};
scResources.ice.Machines.T5.output = function() {return overexchangeOutput;};
scResources.ice.Machines.T5.mats = {'metal': function() {return overexchangeMetalCost;}, 'silver': function() {return overexchangeSilverCost;}, 'helium': function() {return overexchangeHeliumCost;}};

scResources.meteorite = {};
scResources.meteorite.ps = function() {return meteoriteps;};
scResources.meteorite.inStorage = function() {return getResource("meteorite");};
scResources.meteorite.maxStorage = function() {return getStorage("meteorite");};
scResources.meteorite.buyStorage = upgradeMeteoriteStorage;
scResources.meteorite.EMC = function() {return meteoriteEmcVal;};
scResources.meteorite.Machines = {};
scResources.meteorite.Machines.T1 = {};
scResources.meteorite.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "meteoriteNav");};
scResources.meteorite.Machines.T1.name = 'printer';
scResources.meteorite.Machines.T1.count = function() {return printer;};
scResources.meteorite.Machines.T1.buyFunct = getPrinter;
scResources.meteorite.Machines.T1.input = {'energy': function() {return printerPlasmaInput;}};
scResources.meteorite.Machines.T1.output = function() {return printerOutput;};
scResources.meteorite.Machines.T1.mats = {'lunarite': function() {return printerLunariteCost;}, 'silicon': function() {return printerSiliconCost;}};
scResources.meteorite.Machines.T2 = {};
scResources.meteorite.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "meteoriteNav") && false;};
scResources.meteorite.Machines.T2.name = 'web';
scResources.meteorite.Machines.T2.count = function() {return web;};
scResources.meteorite.Machines.T2.buyFunct = getWeb;
scResources.meteorite.Machines.T2.input = {'plasma': function() {return webPlasmaInput;}};
scResources.meteorite.Machines.T2.output = function() {return webOutput;};
scResources.meteorite.Machines.T2.mats = {'lunarite': function() {return webLunariteCost;}, 'uranium': function() {return webUraniumCost;}, 'silicon': function() {return webSiliconCost;}};
scResources.meteorite.Machines.T3 = {};
scResources.meteorite.Machines.T3.enabled = function() {return false;};
scResources.meteorite.Machines.T3.name = 'smasher';
scResources.meteorite.Machines.T3.count = function() {return smasher;};
scResources.meteorite.Machines.T3.buyFunct = getSmasher;
scResources.meteorite.Machines.T3.input = {'plasma': function() {return smasherPlasmaInput;}};
scResources.meteorite.Machines.T3.output = function() {return smasherOutput;};
scResources.meteorite.Machines.T3.mats = {'silicon': function() {return smasherSiliconCost;}, 'silver': function() {return smasherSilverCost;}, 'gem': function() {return smasherGemCost;}};
scResources.meteorite.Machines.T4 = {};
scResources.meteorite.Machines.T4.enabled = function() {return false;};
scResources.meteorite.Machines.T4.name = 'nebulous';
scResources.meteorite.Machines.T4.count = function() {return nebulous;};
scResources.meteorite.Machines.T4.buyFunct = getNebulous;
scResources.meteorite.Machines.T4.input = {'plasma': function() {return nebulousPlasmaInput;}};
scResources.meteorite.Machines.T4.output = function() {return nebulousOutput;};
scResources.meteorite.Machines.T4.mats = {'lunarite': function() {return nebulousLunariteCost;}, 'lava': function() {return nebulousLavaCost;}, 'gold': function() {return nebulousGoldCost;}};

// Energy
scResources.energy = {};
scResources.energy.ps = function() {return energyps;};
scResources.energy.inStorage = function() {return getResource("energy");};
scResources.energy.maxStorage = function() {return getStorage("energy");};
scResources.energy.buyStorage = scPurchaseBatteries;
scResources.energy.EMC = function() {return 1;};
scResources.energy.Machines = {};
// Charcoal Engine
scResources.energy.Machines.T1 = {};
scResources.energy.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "charcoalNav");};
scResources.energy.Machines.T1.name = 'charcoalEngine';
scResources.energy.Machines.T1.count = function() {return charcoalEngine;};
scResources.energy.Machines.T1.buyFunct = getCharcoalEngine;
scResources.energy.Machines.T1.input = {'charcoal': function() {return charcoalEngineCharcoalInput;}};
scResources.energy.Machines.T1.output = function() {return charcoalEngineOutput;};
scResources.energy.Machines.T1.mats = {'metal': function() {return charcoalEngineMetalCost;}, 'gem': function() {return charcoalEngineGemCost;}};
// Solar Panel
scResources.energy.Machines.T2 = {};
scResources.energy.Machines.T2.enabled = function() {return Game.tech.isPurchased('unlockSolar');};
scResources.energy.Machines.T2.name = 'solarPanel';
scResources.energy.Machines.T2.count = function() {return solarPanel;};
scResources.energy.Machines.T2.buyFunct = getSolarPanel;
scResources.energy.Machines.T2.input = {'energy': function() {return 0;}};
scResources.energy.Machines.T2.output = function() {return solarPanelOutput;};
scResources.energy.Machines.T2.mats = {'metal': function() {return solarPanelMetalCost;}, 'gem': function() {return solarPanelGemCost;}};
// Methane Power
scResources.energy.Machines.T3 = {};
scResources.energy.Machines.T3.enabled = function() {return contains(resourcesUnlocked, "methanePower");};
scResources.energy.Machines.T3.name = 'methaneStation';
scResources.energy.Machines.T3.count = function() {return methaneStation;};
scResources.energy.Machines.T3.buyFunct = getMethaneStation;
scResources.energy.Machines.T3.input = {'methane': function() {return methaneStationMethaneInput;}};
scResources.energy.Machines.T3.output = function() {return methaneStationOutput;};
scResources.energy.Machines.T3.mats = {'lunarite': function() {return methaneStationLunariteCost;}, 'titanium': function() {return methaneStationTitaniumCost;}};
// Nuclear Power
scResources.energy.Machines.T4 = {};
scResources.energy.Machines.T4.enabled = function() {return contains(resourcesUnlocked, "nuclearPower");};
scResources.energy.Machines.T4.name = 'nuclearStation';
scResources.energy.Machines.T4.count = function() {return nuclearStation;};
scResources.energy.Machines.T4.buyFunct = getNuclearStation;
scResources.energy.Machines.T4.input = {'uranium': function() {return nuclearStationUraniumInput;}};
scResources.energy.Machines.T4.output = function() {return nuclearStationOutput;};
scResources.energy.Machines.T4.mats = {'lunarite': function() {return nuclearStationLunariteCost;}, 'titanium': function() {return nuclearStationTitaniumCost;}};
// Lava Power
scResources.energy.Machines.T5 = {};
scResources.energy.Machines.T5.enabled = function() {return contains(resourcesUnlocked, "energeticWonderNav");};
scResources.energy.Machines.T5.name = 'magmatic';
scResources.energy.Machines.T5.count = function() {return magmatic;};
scResources.energy.Machines.T5.buyFunct = getMagmatic;
scResources.energy.Machines.T5.input = {'lava': function() {return magmaticLavaInput;}};
scResources.energy.Machines.T5.output = function() {return magmaticOutput;};
scResources.energy.Machines.T5.mats = {'lunarite': function() {return magmaticLunariteCost;}, 'gem': function() {return magmaticGemCost;}, 'silver': function() {return magmaticSilverCost;}};
// Fusion Power
scResources.energy.Machines.T6 = {};
scResources.energy.Machines.T6.enabled = function() {return contains(resourcesUnlocked, "fusionPower");};
scResources.energy.Machines.T6.name = 'fusionReactor';
scResources.energy.Machines.T6.count = function() {return fusionReactor;};
scResources.energy.Machines.T6.buyFunct = getFusionReactor;
scResources.energy.Machines.T6.input = {'hydrogen': function() {return fusionReactorHydrogenInput;}, 'helium': function() {return fusionReactorHeliumInput;}};
scResources.energy.Machines.T6.output = function() {return fusionReactorOutput;};
scResources.energy.Machines.T6.mats = {'lunarite': function() {return fusionReactorLunariteCost;}, 'titanium': function() {return fusionReactorTitaniumCost;}, 'silicon': function() {return fusionReactorSiliconCost;}};
// Plasma
scResources.plasma = {};
scResources.plasma.ps = function() {return plasmaps;};
scResources.plasma.inStorage = function() {return getResource("plasma");};
scResources.plasma.maxStorage = function() {return getStorage("plasma");};
scResources.plasma.buyStorage = scPurchasePlasmaStorage;
scResources.plasma.EMC = function() {return 1000;};
scResources.plasma.Machines = {};
scResources.plasma.Machines.T1 = {};
scResources.plasma.Machines.T1.enabled = function() {return contains(resourcesUnlocked, "plasmaNav");};
scResources.plasma.Machines.T1.name = 'heater';
scResources.plasma.Machines.T1.count = function() {return heater;};
scResources.plasma.Machines.T1.buyFunct = getHeater;
scResources.plasma.Machines.T1.input = {'energy': function() {return heaterEnergyInput;}, 'hydrogen': function() {return heaterHydrogenInput;}};
scResources.plasma.Machines.T1.output = function() {return heaterOutput;};
scResources.plasma.Machines.T1.mats = {'lunarite': function() {return heaterLunariteCost;}, 'gem': function() {return heaterGemCost;}, 'silicon': function() {return heaterSiliconCost;}};
scResources.plasma.Machines.T2 = {};
scResources.plasma.Machines.T2.enabled = function() {return contains(resourcesUnlocked, "plasmaTier2");};
scResources.plasma.Machines.T2.name = 'plasmatic';
scResources.plasma.Machines.T2.count = function() {return plasmatic;};
scResources.plasma.Machines.T2.buyFunct = getPlasmatic;
scResources.plasma.Machines.T2.input = {'energy': function() {return plasmaticEnergyInput;}, 'helium': function() {return plasmaticHeliumInput;}};
scResources.plasma.Machines.T2.output = function() {return plasmaticOutput;};
scResources.plasma.Machines.T2.mats = {'lunarite': function() {return plasmaticLunariteCost;}, 'silicon': function() {return plasmaticSiliconCost;}, 'meteorite': function() {return plasmaticMeteoriteCost;}};
// Science
scResources.science = {};
scResources.science.ps = function() {return scienceps;};
scResources.science.inStorage = function() {return getResource("science");};
scResources.science.maxStorage = function() {return getResource("science")*2;}; //simulate
scResources.science.buyStorage = function() {return false;};
scResources.science.Machines = {};
scResources.science.Machines.T1 = {};
scResources.science.Machines.T1.enabled = function() {return contains(tabsUnlocked, "researchTab");};
scResources.science.Machines.T1.name = 'lab';
scResources.science.Machines.T1.count = function() {return lab;};
scResources.science.Machines.T1.buyFunct = getLab;
scResources.science.Machines.T1.input = {'energy': function() {return 0;}};
scResources.science.Machines.T1.output = function() {return labOutput;};
scResources.science.Machines.T1.mats = {'wood': function() {return labWoodCost;}, 'gem': function() {return labGemCost;}, 'metal': function() {return labMetalCost;}};
scResources.science.Machines.T2 = {};
scResources.science.Machines.T2.enabled = function() {return Game.tech.isPurchased('unlockLabT2');};
scResources.science.Machines.T2.name = 'labT2';
scResources.science.Machines.T2.count = function() {return labT2;};
scResources.science.Machines.T2.buyFunct = getLabT2;
scResources.science.Machines.T2.input = {'energy': function() {return 0;}};
scResources.science.Machines.T2.output = function() {return labT2Output;};
scResources.science.Machines.T2.mats = {'metal': function() {return labT2MetalCost;}, 'gem': function() {return labT2GemCost;}, 'wood': function() {return labT2WoodCost;}};
scResources.science.Machines.T3 = {};
scResources.science.Machines.T3.enabled = function() {return Game.tech.isPurchased('unlockLabT3');};
scResources.science.Machines.T3.name = 'labT3';
scResources.science.Machines.T3.count = function() {return labT3;};
scResources.science.Machines.T3.buyFunct = getLabT3;
scResources.science.Machines.T3.input = {'energy': function() {return 0;}};
scResources.science.Machines.T3.output = function() {return labT3Output;};
scResources.science.Machines.T3.mats = {'metal': function() {return labT3MetalCost;}, 'gem': function() {return labT3GemCost;}, 'wood': function() {return labT3WoodCost;}};
scResources.science.Machines.T4 = {};
scResources.science.Machines.T4.enabled = function() {return Game.tech.isPurchased('unlockLabT4');};
scResources.science.Machines.T4.name = 'labT4';
scResources.science.Machines.T4.count = function() {return labT4;};
scResources.science.Machines.T4.buyFunct = getLabT4;
scResources.science.Machines.T4.input = {'energy': function() {return 0;}};
scResources.science.Machines.T4.output = function() {return labT4Output;};
scResources.science.Machines.T4.mats = {'metal': function() {return labT4MetalCost;}, 'gem': function() {return labT4GemCost;}, 'wood': function() {return labT4WoodCost;}};
scResources.science.Machines.T5 = {};
scResources.science.Machines.T5.enabled = function() {return Game.tech.isPurchased('unlockLabT5');};
scResources.science.Machines.T5.name = 'labT5';
scResources.science.Machines.T5.count = function() {return labT5;};
scResources.science.Machines.T5.buyFunct = getLabT5;
scResources.science.Machines.T5.input = {'energy': function() {return 0;}};
scResources.science.Machines.T5.output = function() {return labT5Output;};
scResources.science.Machines.T5.mats = {'metal': function() {return labT5MetalCost;}, 'gem': function() {return labT5GemCost;}, 'wood': function() {return labT5WoodCost;}};
// Rocket Fuel
scResources.rocketfuel = {};
scResources.rocketfuel.ps = function() {return rocketFuelps;};
scResources.rocketfuel.inStorage = function() {return getResource("rocketFuel");};
scResources.rocketfuel.maxStorage = function() {return getResource("rocketFuel")*2;}; //simulate
scResources.rocketfuel.buyStorage = function() {return false;};
scResources.rocketfuel.Machines = {};
scResources.rocketfuel.Machines.T1 = {};
scResources.rocketfuel.Machines.T1.enabled = function() {return contains(tabsUnlocked, "solarSystemTab");};
scResources.rocketfuel.Machines.T1.name = 'Chemical Plant';
scResources.rocketfuel.Machines.T1.count = function() {return chemicalPlant;};
scResources.rocketfuel.Machines.T1.buyFunct = getChemicalPlant;
scResources.rocketfuel.Machines.T1.input = {'oil': function() {return chemicalPlantOilInput;}, 'charcoal': function() {return chemicalPlantCharcoalInput;}};
scResources.rocketfuel.Machines.T1.output = function() {return chemicalPlantOutput*chemicalBoost;};
scResources.rocketfuel.Machines.T1.mats = {'metal': function() {return chemicalPlantMetalCost;}, 'gem': function() {return chemicalPlantGemCost;}, 'oil': function() {return chemicalPlantOilCost;}};
scResources.rocketfuel.Machines.T2 = {};
scResources.rocketfuel.Machines.T2.enabled = function() {return Game.tech.isPurchased('unlockRocketFuelT2');};
scResources.rocketfuel.Machines.T2.name = 'Oxidisation Plant';
scResources.rocketfuel.Machines.T2.count = function() {return oxidisation;};
scResources.rocketfuel.Machines.T2.buyFunct = getOxidisation;
scResources.rocketfuel.Machines.T2.input = {'oil': function() {return oxidisationOilInput;}, 'charcoal': function() {return oxidisationCharcoalInput;}};
scResources.rocketfuel.Machines.T2.output = function() {return oxidisationOutput;};
scResources.rocketfuel.Machines.T2.mats = {'titanium': function() {return hydrazineTitaniumCost;}, 'silicon': function() {return hydrazineSiliconCost;}, 'gold': function() {return hydrazineGoldCost;}};
scResources.rocketfuel.Machines.T3 = {};
scResources.rocketfuel.Machines.T3.enabled = function() {return Game.tech.isPurchased('unlockRocketFuelT3');};
scResources.rocketfuel.Machines.T3.name = 'Hydrazine Plant';
scResources.rocketfuel.Machines.T3.count = function() {return hydrazine;};
scResources.rocketfuel.Machines.T3.buyFunct = getHydrazine;
scResources.rocketfuel.Machines.T3.input = {'methane': function() {return hydrazineMethaneInput;}};
scResources.rocketfuel.Machines.T3.output = function() {return hydrazineOutput;};
scResources.rocketfuel.Machines.T3.mats = {'titanium': function() {return hydrazineTitaniumCost;}, 'silicon': function() {return hydrazineSiliconCost;}, 'gold': function() {return hydrazineGoldCost;}};

// Batteries
var scBatteries = {};
scBatteries.T1 = {};
scBatteries.T1.enabled = function() {return contains(resourcesUnlocked, "batteries");};
scBatteries.T1.name = 'battery';
scBatteries.T1.count = function() {return battery;};
scBatteries.T1.buyFunct = getBattery;
scBatteries.T1.output = function() {return 50000*scStorageCoeff();};
scBatteries.T1.mats = {'metal': function() {return batteryMetalCost;}, 'gem': function() {return batteryGemCost;}, 'lunarite': function() {return batteryLunariteCost;}};
scBatteries.T2 = {};
scBatteries.T2.enabled = function() {return contains(resourcesUnlocked, "batteriesT2");};
scBatteries.T2.name = 'batteryT2';
scBatteries.T2.count = function() {return batteryT2;};
scBatteries.T2.buyFunct = getBatteryT2;
scBatteries.T2.output = function() {return 500000*scStorageCoeff();};
scBatteries.T2.mats = {'metal': function() {return batteryT2MetalCost;}, 'gem': function() {return batteryT2GemCost;}, 'lunarite': function() {return batteryT2LunariteCost;}};
scBatteries.T3 = {};
scBatteries.T3.enabled = function() {return contains(resourcesUnlocked, "batteriesT3");};
scBatteries.T3.name = 'batteryT3';
scBatteries.T3.count = function() {return batteryT3;};
scBatteries.T3.buyFunct = getBatteryT3;
scBatteries.T3.output = function() {return 5000000*scStorageCoeff();};
scBatteries.T3.mats = {'metal': function() {return batteryT3MetalCost;}, 'gem': function() {return batteryT3GemCost;}, 'lunarite': function() {return batteryT3LunariteCost;}};
scBatteries.T4 = {};
scBatteries.T4.enabled = function() {return contains(resourcesUnlocked, "batteriesT4");};
scBatteries.T4.name = 'batteryT4';
scBatteries.T4.count = function() {return batteryT4;};
scBatteries.T4.buyFunct = getBatteryT4;
scBatteries.T4.output = function() {return 50000000*scStorageCoeff();};
scBatteries.T4.mats = {'metal': function() {return batteryT4MetalCost;}, 'gem': function() {return batteryT4GemCost;}, 'lunarite': function() {return batteryT4LunariteCost;}};
scBatteries.T5 = {};
scBatteries.T5.enabled = function() {return contains(resourcesUnlocked, "batteriesT5");};
scBatteries.T5.name = 'batteryT5';
scBatteries.T5.count = function() {return batteryT5;};
scBatteries.T5.buyFunct = getBatteryT5;
scBatteries.T5.output = function() {return 500000000*scStorageCoeff();};
scBatteries.T5.mats = {'metal': function() {return batteryT5MetalCost;}, 'gem': function() {return batteryT5GemCost;}, 'lunarite': function() {return batteryT5LunariteCost;}};


// Utility : returns the energy storage coefficient
function scStorageCoeff() {
    if (contains(resourcesUnlocked, "batteries")) {
        return ((Game.tech.entries.batteryEfficiencyResearch.current/100)+1);
    } else {
        return 1;
    }
}
// Utility : remove an element from an array
function scRemoveItem(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
        return true;
    }
    return false;
}
// Utility : do debug output
function scLog(text) {
    if (scDebug) {console.log(text);}
}
// Order all resources from most needed to least.
// Return the first item so we can try to buy it.
function scGetNeededMaterial() {
    // Sort the materials on % storage filled * production/sec
    mats = Object.keys(scResources).sort(function(a, b) {
        return (scResources[a].inStorage() / scResources[a].maxStorage())*scResources[a].ps() - (scResources[b].inStorage() / scResources[b].maxStorage())*scResources[b].ps();
    });
    // remove energy & science from the list.  We buy these seperately
    scRemoveItem(mats,'energy');
    scRemoveItem(mats,'sciene');
    return mats;
}
// Utility : returns an object to keep count of used materials.
function scResourceList() {
    var blacklist = ['energy', 'rocketfuel', 'science'];
    rl = {};
    Object.keys(scResources).forEach(function(mat) {
        rl[mat] = 0;
    });
    return rl;
}
// Utility: Calculates the EMC value needed, equivalent to buy a machine
// obj = scResources.MATERIAL.Machines.TIER.mats
function scCalcEmcValue(obj) {
    emc = 0;
    Object.keys(obj).forEach(function(mat) {
        emc += scResources[mat].EMC() * obj[mat]();
    });
    return emc;
}
// Utility: Returns an object of all needed resources to produce rocket fuel.
function scRocketFuelInput() {
    // Collect the inputs of all rocketfuel plants
    var rfinput = {};
    Object.keys(scResources.rocketfuel.Machines).forEach(function(tier) {
        Object.keys(scResources.rocketfuel.Machines[tier].input).forEach(function(mat) {
            // storing the material & amount, in case we need it for rate limiting
            rate = scResources.rocketfuel.Machines[tier].input[mat]() * scResources.rocketfuel.Machines[tier].count();
            if (rate > 0) { 
                if (typeof rfinput[mat] === 'undefined') { rfinput[mat] = 0; }
                rfinput[mat] += scResources.rocketfuel.Machines[tier].input[mat]() * rate;
                scLog("FuelLoop: Added "+mat+" to the object with a rate of "+rfinput[mat]);
            }
        });
    });
    return rfinput;
}

// Click the gain button, if needed.
// We won't click if production > 50ps
function scClickForResources(mat) {
    scRemoveItem(scClickCheck, mat);
    // If T1 is enabled, click is as well.
    if (scResources[mat].Machines.T1.enabled() && // If T1 is enabled, then the click button is too
        scResources[mat].ps() < 50 && // If production is over 50/s, we don't really need to click.
        Math.ceil(scResources[mat].inStorage()) < Math.floor(scResources[mat].maxStorage()) // storage full?
    ) {
        // Can we supply the click (T1 machine equivalent input) ?
        if (mat == 'plasma') {
            canSupply = (function() {return (scResources.energy.inStorage()/scResources.energy.maxStorage())>0.1;}());
        } else {
            canSupply = (function() {return scGetSupplyableMachines([[scResources[mat].Machines.T1], 'storage']).length>0;}());
        }
        if (canSupply) {
            gainResource(mat);
            scLog("GainResources - Clicked: "+mat);            
        }
    }
}
// Try to buy any machine we can, regardless of prod/cost.
// Maybe multiple tiers if we can afford it.
function scIncreaseResourcesMulti(mat) {
    return scBuyMachines(scGetSupplyableMachines(scGetAffordableMachines(scGetUnlockedMachines(scResources[mat].Machines, mat))));
}
// Try to buy machines, but calculate the purchase with best RoI
function scIncreaseResourcesSingle(mat) {
    scRemoveItem(scRes, mat);
    return scBuyMachines(scGetBestRoiMachine(scGetSupplyableMachines(scGetAffordableMachines(scGetUnlockedMachines(scResources[mat].Machines, mat)))));
//    return scBuyMachines(scGetSupplyableMachines(scGetAffordableMachines(scGetUnlockedMachines(mat))));
}
// Do we need more batteries?
function scPurchaseBatteries() {
    // We'll buy batteries when we can fill our storage in Reserve seconds
    if (contains(resourcesUnlocked, "batteries")) {
        scLog("-- Trying to buy a battery: Production: "+energyps+" - Storage: "+getStorage('energy')+" - After "+scReserve+" seconds: "+energyps*scReserve);
        if (energyps*scReserve > getStorage('energy')*0.9) {
            return scBuyMachines(scGetBestRoiMachine(scGetAffordableMachines(scGetUnlockedMachines(scBatteries, 'battery'))));
        }
    }
}
// Do we need more plasma storage?
function scPurchasePlasmaStorage() {

}
// Do energy-material conversion
function scDoEnergyToMaterial() {

}
// Do plasma-material conversion
function scDoPlasmaToMaterial() {

}
// Find all the tiers of the machines that are unlocked.
// obj = scResources.energy.Machines
function scGetUnlockedMachines(obj, mat) {
    unlocked = [];
    Object.keys(obj).forEach(function(tier) {
        if (obj[tier].enabled()) {
            unlocked.push(obj[tier]);
            scLog("-- "+obj[tier].name+" is enabled: "+obj[tier].enabled()+"  Added "+tier+" to unlocked array.");
        }
    });
    return [unlocked, mat]; // [[scResources.MATERIAL.machines.TIER1, MATERIAL], [scResources.MATERIAL.machines.TIER2, MATERIAL],...]
}
// Find the machine with the best RoI.
// Takes input from scGetUnlockedMachines
function scGetBestRoiMachine(array) {
    best = [];
    unlocked = array[0];
    mat = array[1];
    bestscore = 0;
    for (i = 0; i<unlocked.length; i++) {
        obj = unlocked[i];
        score = obj.output()/scCalcEmcValue(obj.mats);
        scLog("Examined RoI of: "+obj.name+" - Score: "+score);
        if (bestscore<score) { bestscore = score; best = [obj]; }
    }
    if (best.length > 0) { scLog("-- Best RoI: "+best[0].name+" - Score: "+bestscore); }
    return [best, mat]; // [scResources.MATERIAL.machines.TIER1, MATERIAL]
}

// Find all the affordable machines from the array of objects
// Takes input from scGetUnlockedMachines or scGetBestRoiMachine
function scGetAffordableMachines(array) {
    affordable = [];
    unlocked = array[0];
    material = array[1];
    rl = scResourceList();
    for (i = 0; i<unlocked.length; i++) {
        obj = unlocked[i];
        isAffordable = true;
        scLog("-- Checking material costs for "+obj.name);
        Object.keys(obj.mats).forEach(function(mat) {
            scLog("Material: "+mat+" - Needed: "+obj.mats[mat]()+" - Reserved: "+rl[mat]+" - InStorage: "+scResources[mat].inStorage()+" - MaxStorage: "+scResources[mat].maxStorage());
            if (rl[mat]+obj.mats[mat]() > scResources[mat].inStorage()) {
                isAffordable = false;
            }
            // Try to buy storage for this resource
            if (rl[mat]+obj.mats[mat]() > scResources[mat].maxStorage()) {
                scBuyStorage(mat);
            }
        });
        if (isAffordable) {
            affordable.push(obj);
            Object.keys(obj.mats).forEach(function(mat) { rl[mat] += obj.mats[mat](); });
        }
    }
    return [affordable, material]; // [[scResources.MATERIAL.machines.TIER1, MATERIAL], [scResources.MATERIAL.machines.TIER2, MATERIAL],...]
}
// Find all the supplyable machines from the list of buyable machines.
// Takes input from scGetAffordableMachines
function scGetSupplyableMachines(array) {
    supplyable = [];
    affordable = array[0];
    material = array[1];
    rl = scResourceList();
    // if we're creating an energy producer, allow it more resources
    if (material == 'energy') {res = scReserve*2;} else {res = scReserve;}
    for (i = 0; i<affordable.length; i++) {
        obj = affordable[i];
        isSupplyable = true;
        scLog("-- Checking input for "+obj.name);
        Object.keys(obj.input).forEach(function(input) {
            // Input can be spent when maxstorage can still be filled in RESERVE seconds or cost is 0.
            scLog("Input: "+input+" - ps: "+Math.floor(scResources[input].ps())+" Reserved: "+rl[input]+" - needed: "+obj.input[input]()+" - Resources after "+res+"s: "+Math.floor(scResources[input].ps()*scReserve));
            if (obj.input[input]() > 0 && Math.floor((scResources[input].ps() - rl[input] - obj.input[input]())*res) < scResources[input].maxStorage()) {
                isSupplyable = false;
                // Seems production of this resource is relatively low.
                // Add this resource to the front of the scRes array
                if (typeof scRes !== "undefined" && scRemoveItem(scRes,input)) {scRes.unshift(input);}
            }
        });
        if (isSupplyable) {
            supplyable.push(obj);
            Object.keys(obj.mats).forEach(function(input) { rl[input] += scResources[input].ps(); });        
        }
    }
    return [supplyable, material];
}
// Buy the machines we can
function scBuyMachines(array) {
    buyable = array[0];         //scBatteries.T1
    material = array[1];        //batteries
    for (i = 0; i<buyable.length; i++) {
        obj = buyable[i];
        if (!scSimulate) {
            obj.buyFunct();
            Game.notifyInfo("Automation - Machine","Bought "+material+" producer: "+obj.name);
            return true;
        }
        scLog("-- Bought "+material+" producer: "+obj.name);
    }
    return false;
}
// Try to buy storage
function scBuyStorage(resource) {
    scLog("-- Checking if we need to buy storage for: "+resource);
    scRemoveItem(scStorageCheck, resource);
    // Only buy storage when we can fill the current storage in scReserve seconds.
    if (Game.tech.isPurchased('unlockStorage') && Math.floor(scResources[resource].ps()*scReserve)>=scResources[resource].maxStorage()) {
        oldStorage = scResources[resource].maxStorage();
        if (!scSimulate) {
            scResources[resource].buyStorage();
            if (scResources[resource].maxStorage() > oldStorage) {
                Game.notifyInfo("Automation - Storage","Bought storage for "+resource);
                scLog("-- Bought 5storage for "+resource);
                return true;
            }
        }
        return false;
    }
}



setTimeout(function() {

    // Do resourceclicks
    var scClickLoop = setInterval(function() {
        scClickCheck = scGetNeededMaterial();
        while (scClickCheck.length > 0) {
            scLog("Trying to click for: "+scClickCheck[0]);
            scClickForResources(scClickCheck[0]);
        }
    }, 100); // 10x/second

    // Toggle rocketfuel
    var scFuelLoop = setInterval(function() {
        // An array of all materials needed.
        mats = Object.keys(scRocketFuelInput());
        // Check if all resources have sufficient reserves in storage
        var toggle = false;
        toggle = mats.every(
            mat => ( rocketFuelToggled === false && scResources[mat].inStorage() > scResources[mat].maxStorage()*0.95 )
        );
        if (toggle) {
            toggleRocketFuel();
            scLog("-- Toggling rocket fuel. Changing state: "+rocketFuelToggled+"=>"+!rocketFuelToggled+" - Sufficient storage present.");
        }
        toggle = mats.some(
            mat => ( rocketFuelToggled === true && scResources[mat].inStorage() < scResources[mat].maxStorage()*0.25 )
        );
        if (toggle) {
            toggleRocketFuel();
            scLog("-- Toggling rocket fuel. Changing state: "+rocketFuelToggled+"=>"+!rocketFuelToggled+" - Not sufficient storage present.");
        }
    }, 1000); //Check every second.


    // Main Loop
    var scMainLoop = setInterval(function() {
        scRes = scGetNeededMaterial();
        scStorageCheck = scGetNeededMaterial();
        // Energy & supporting machines.
        scLog("Buying machines to increase: energy");
        scIncreaseResourcesMulti('energy');
        // Do Science
        scLog("Buying machines to increase: science");
        scIncreaseResourcesMulti('science');
        // Loop through what's left of scRes and try to buy what we can.
        boughtSomething = false;
        while (boughtSomething === false && scRes.length > 0) {
            scLog("Buying machines to increase: "+scRes[0]);
            boughtSomething = scIncreaseResourcesSingle(scRes[0]);
        }
        // Get batteries?
        scLog("Buying batteries... Maybe.");
        scPurchaseBatteries();
        // Check plasmastorage

        // See if we need to expand storage.
        while (scStorageCheck.length > 0) {
            scLog("Buying storage to increase: "+scStorageCheck[0]);
            scBuyStorage(scStorageCheck[0]);
        }

        // do emc

    }, 5000); // Once every 5 seconds should be fine.
}, 5000); // Wait 5 seconds after loading the page to start the script.
b