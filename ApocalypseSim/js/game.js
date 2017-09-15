//Add attachment system to weapons
//Allow attachments and modifications to be made in cdf
//Scavenge for crafting materials eg. metal plate, plastic, rubber, ceramic, cloth, glass, wood, nails, screws
//cdf will function as a farm and a "home"
/**
*	Define non-native functions
**/
var trueResult;
function addText(){
	var newElement3=document.createElement('p');
	newElement3.class="speakable";
	newElement3.innerHTML="";
	for(var i = 0; i < arguments.length; i++){
		newElement3.innerHTML+=">"+arguments[i]+"<br>";
	}
	$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
}
function addMessage(id){
	if(!document.getElementById(id)){
		var newElement3=document.createElement('p');
		newElement3.innerHTML="";
		for(var i = 1; i < arguments.length; i++){
			newElement3.innerHTML+=">"+arguments[i]+"<br>";
		}
		newElement3.class='speakable';
		newElement3.id=id;
		document.getElementById('message_room99').parentElement.appendChild(newElement3);
	}
}
/**
*	ADD EVENT MESSAGES HERE VVVVVVVVVVV
*	addMessage("id","message to add");
*	Another argument after id is the second line
**/



/**
*	ADD EVENT MESSAGES HERE ^^^^^^^^^^
**/
var $parent = document.createElement("div")
    $gif = document.createElement("img")
   ,$favicon = document.createElement("link")

// Required for CORS
$gif.crossOrigin = "anonymous"

$gif.src = "images/favicon2.gif"

$favicon.rel = "icon"

// JS Fiddle always displays the result in an <iframe>,
// so we have to add the favicon to the parent window
window.parent.document.head.appendChild($favicon)

// libgif.js requires the GIF <img> tag to have a parent
$parent.appendChild($gif)

var supergif = new SuperGif({gif: $gif})
   ,$canvas

supergif.load(()=> {
  $canvas = supergif.get_canvas()
  updateFavicon()
})

function updateFavicon() {
  $favicon.href = $canvas.toDataURL()
  window.requestAnimationFrame(updateFavicon)
}
var seeded = false;
var lcg = function() {
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
  // m is basically chosen to be large (as it is the max period)
  // and for its relationships to a and c
  var m = 4294967296,
    // a - 1 should be divisible by m's prime factors
    a = 1664525,
    // c and m should be co-prime
    c = 1013904223,
    seed, z;
  return {
    setSeed : function(val) {
      // pick a random seed if val is undefined or null
      // the >>> 0 casts the seed to an unsigned 32-bit integer
      z = seed = (val == null ? Math.random() * m : val) >>> 0;
    },
    getSeed : function() {
      return seed;
    },
    rand : function() {
      // define the recurrence relationship
      z = (a * z + c) % m;
      // return a float in [0, 1)
      // if z = m then z / m = 0 therefore (z % m) / m < 1 always
      return z / m;
    }
  };
};
function randomSeed(seed) {
  lcg.setSeed(seed);
  seeded = true;
}
function random(min, max) {

  var rand;

  if (seeded) {
    rand  = lcg.rand();
  } else {
    rand = Math.random();
  }

  if (arguments.length === 0) {
    return rand;
  } else
  if (arguments.length === 1) {
    return rand * min;
  } else {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max-min) + min;
  }
}
function constrain(e,t,n){
	return e>n?n:e<t?t:e
}
function randomPName(obj) {
    var keys = Object.keys(obj)
    return keys[ keys.length * Math.random() << 0];
}
/**
*	Define non-native functions
**/
var currentUser;
var farmGuiOpen=false;
var Class;
var currentXP=0;
var playerLevel=5;
var xpNeeded=Math.floor(29+(1/Math.pow(4,-(playerLevel*0.1))));
var skillPoints=0;
var hunger = 100;
var maxHunger=100;
var MaxedHealth;
var CurrentHealth;
//New inventory and weapon system
var overEncumberedItem=false;
var overEncumberedArmor=false;
var irish=0;
var tPara=0;
var fourI=0;
var rngA = function(n) {
	var resA = Math.round(Math.random() * n);
	var resB = Math.round(Math.random() * n);
	var resC = Math.round((resA / 2) + (resB / 2));
	return resC;
};
//Creating armor
var createDefense=function(){
	var def={};
	if(arguments.length>1){
		for(var i=0;i<arguments.length;i++){
			def[arguments[i][0]]=arguments[i][1];
		}
	}else{
		for(var i=0;i<arguments[0].length;i++){
			if(def[arguments[0][i][0]]!==arguments[0][i][0]){
				def[arguments[0][i][0]]=arguments[0][i][1];
			}else{
				def[arguments[0][i][0]]+=arguments[0][i][1];
			}
		}
	}
	return def;
};
var Armor=function(slot,material,attributes,defense,value,name){
	this.slot=slot;
	this.material=material;
	this.attributes=attributes;
	this.defense=defense;
	this.value=value;
	for(var i in this.defense){
		this.value+=Math.floor(this.defense[i]*10)*5;
	}
	if(this.attributes.includes("Warm")){
		this.value+=15;
	}
	if(this.attributes.includes("Insulated")){
		this.value+=20;
	}
	if(this.attributes.includes("Healing")){
		this.value+=30;
	}
	this.name=name;
	this.empty=false;
	if(this.name=="None"){
		this.empty=true;
	}
};
var defenseList=[
	"rad",
	"all",
	"cold",
	"bllt",
	"fire",
	"exp",
];
var materialList=[
	"cloth",
	"leather",
	"metal",
	"tech",
];
var attributesList=[
	"Warm",
	"Healing",
	"Insulated",
];
var armorNames=[
	"Basic",
	"Raider",
	"Advanced",
	"Warrior",
];
var armorTypes=[
	"helmet",
	"chest",
	"boots",
	"pants",
];
function randomDef(){
	var defense=[];
	for(var i=0;i<defenseList.length;i++){
		var newDef=defenseList[i];
		var defRes=constrain(Math.floor(random(-0.4,0.4)*100)/100,0,1);
		defense.push([newDef,defRes]);
	}
	for(var i=0;i<defenseList.length;i++){
		if(defense[i][0]=="all"){
			defense[i][1]=defense[i][1]/4;
		}
	}
	return defense
}
function randomArmor(){
	var defense=randomDef();
	var material=[];
	for(var i=0;i<1+rngA(materialList.length-1);i++){
		var newMat=materialList[rngA(materialList.length-1)];
		if(!material.includes(newMat)){
			material.push(newMat);
		}
	}
	var attributes=[];
	for(var i=0;i<1+rngA(attributesList.length-1);i++){
		var newAtt=attributesList[rngA(attributesList.length-1)];
		if(!attributes.includes(newAtt)){
			attributes.push(newAtt);
		}
	}
	var type=armorTypes[rngA(armorTypes.length-1)];
	var name=armorNames[rngA(armorNames.length-1)];
	var newType;
	switch(type){
		case "helmet":
			newType="Helmet";
			break;
		case "chest":
			newType="Chestpiece";
			break;
		case "pants":
			newType="Pants";
			break;
		case "boots":
			newType="Boots";
			break;
		
	}
	var newMatName=material;
	if(material.includes("tech")&&material.includes("cloth")&&!material.includes("leather")&&!material.includes("metal")){
		newMatName="Clothtech";
		//Cloth and Tech
	}else if(material.includes("tech")&&material.includes("cloth")&&!material.includes("leather")&&material.includes("metal")){
		newMatName="Metal Clothtech";
		//Metal Cloth and Tech
	}else if(!material.includes("tech")&&material.includes("cloth")&&material.includes("leather")&&!material.includes("metal")){
		newMatName="Cloth-Leather";
		//Cloth and Leather
	}else if(!material.includes("tech")&&material.includes("cloth")&&material.includes("leather")&&material.includes("metal")){
		newMatName="Metal Cloth-Leather";
		//Cloth and Metal and Leather
	}else if(material.includes("tech")&&!material.includes("cloth")&&material.includes("leather")&&!material.includes("metal")){
		newMatName="TechLeather";
		//Tech and Leather
	}else if(material.includes("tech")&&material.includes("cloth")&&material.includes("leather")&&material.includes("metal")){
		newMatName="Everything but the kitchen sink";
		//Tech, Leather, Cloth, Metal
	}else if(material.includes("tech")&&!material.includes("cloth")&&!material.includes("leather")&&material.includes("metal")){
		newMatName="Scientific";
		//Tech, Metal
	}else if(!material.includes("tech")&&!material.includes("cloth")&&material.includes("leather")&&material.includes("metal")){
		newMatName="Metal-Leather";
		//Leather, Metal
	}else if(!material.includes("tech")&&material.includes("cloth")&&!material.includes("leather")&&material.includes("metal")){
		newMatName="Metal-Cloth";
		//Cloth, Metal
	}else if(material.includes("tech")&&material.includes("cloth")&&material.includes("leather")&&!material.includes("metal")){
		newMatName="Cloth TechLeather";
		//Cloth, Leather, Tech
	}else if(material.includes("tech")&&!material.includes("cloth")&&material.includes("leather")&&material.includes("metal")){
		newMatName="Metal TechLeather";
		//Cloth, Leather, Tech
	}else if(material.includes("tech")&&!material.includes("cloth")&&!material.includes("leather")&&!material.includes("metal")){
		newMatName="Tech";
		//Tech
	}else if(!material.includes("tech")&&material.includes("cloth")&&!material.includes("leather")&&!material.includes("metal")){
		newMatName="Cloth";
		//Cloth
	}else if(!material.includes("tech")&&!material.includes("cloth")&&material.includes("leather")&&!material.includes("metal")){
		newMatName="Leather";
		//Leather
	}else if(!material.includes("tech")&&!material.includes("cloth")&&!material.includes("leather")&&material.includes("metal")){
		newMatName="Metal";
		//Metal
	}
	var newName = name + " " + newMatName + " " + newType;
	return new Armor(type,material,attributes,createDefense(defense),Math.floor(random(30,80)),newName);
}
var noHelmet=new Armor('helmet',['none'],['none'],createDefense(["all",0],["rad",0],["cold",0],["bllt",0],["fire",0],["exp",0]),0,"None");
var noChest=new Armor('chest',['none'],['none'],createDefense(["all",0],["rad",0],["cold",0],["bllt",0],["fire",0],["exp",0]),0,"None");
var noPants=new Armor('pants',['none'],['none'],createDefense(["all",0],["rad",0],["cold",0],["bllt",0],["fire",0],["exp",0]),0,"None");
var noBoots=new Armor('boots',['none'],['none'],createDefense(["all",0],["rad",0],["cold",0],["bllt",0],["fire",0],["exp",0]),0,"None");
var vaultArmorHat=new Armor('helmet',['cloth'],['Warm'],createDefense(["rad",0.05],["all",0],["cold",0.02],["fire",0.01],["bllt",0.02],["exp",0]),30,"Vault 42 Hat");
var vaultArmorChest=new Armor('chest',['cloth'],['Warm'],createDefense(["rad",0.05],["all",0],["cold",0.02],["fire",0.01],["bllt",0.02],["exp",0]),30,"Vault 42 Shirt");
var vaultArmorPants=new Armor('pants',['cloth'],['Warm'],createDefense(["rad",0.05],["all",0],["cold",0.02],["fire",0.01],["bllt",0.02],["exp",0]),30,"Vault 42 Pants");
var vaultArmorBoots=new Armor('boots',['cloth'],['Warm'],createDefense(["rad",0.05],["all",0],["cold",0.02],["fire",0.01],["bllt",0.02],["exp",0]),30,"Vault 42 Boots");
var equippedArmor={
	helmet:noHelmet,
	chest:noChest,
	pants:noPants,
	boots:noBoots,
};
var armorInventory={
	helmet:[
		noHelmet,
	],
	chest:[
		noChest,
	],
	pants:[
		noPants,
	],
	boots:[
		noBoots,
	],
	capacity:40,
};
for(var i=0;i<39;i++){
	armorInventory["helmet"].push(noHelmet);
	armorInventory["chest"].push(noChest);
	armorInventory["pants"].push(noPants);
	armorInventory["boots"].push(noBoots);
}
function equipArmor(index){
	var slot=index.split("e")[0];
	var id=index.split("e")[1];
	if(slot == "a"){
		if(armorInventory["helmet"][id]){
			if(!armorInventory["helmet"][id].empty){
				equippedArmor.helmet=armorInventory["helmet"][id];
			}
		}
	}else if(slot == "b"){
		if(armorInventory["chest"][id]){
			if(!armorInventory["chest"][id].empty){
				equippedArmor.chest=armorInventory["chest"][id];
			}
		}
	}else if(slot == "c"){
		if(armorInventory["pants"][id]){
			if(!armorInventory["pants"][id].empty){
				equippedArmor.pants=armorInventory["pants"][id];
			}
		}
	}else if(slot == "d"){
		if(armorInventory["boots"][id]){
			if(!armorInventory["boots"][id].empty){
				equippedArmor.boots=armorInventory["boots"][id];
			}
		}
	}
}
function addArmor(armor,debug){
	this.debug=debug||false;
	var firstEmpty=0;
	var stahp = false;
	for(var i = 1; i < armorInventory.capacity; i++){
		if(!stahp){
			if(armorInventory[armor.slot][i].empty){
				firstEmpty=i;
				stahp=true;
			}
		}
	}
	armorInventory[armor.slot][firstEmpty]=armor;
}
function removeArmor(index){
	var slot=index.split("e")[0];
	var id=index.split("e")[1];
	if(id !== "0" || id !== 0){
		if(slot == "a"){
			if(armorInventory["helmet"][id]){
				if(!armorInventory["helmet"][id].empty){
					if(equippedArmor.helmet==armorInventory["helmet"][id]){
						equippedArmor.helmet=armorInventory["helmet"][0];
					}
					armorInventory["helmet"][id]=armorInventory["helmet"][0];
				}
			}
		}else if(slot == "b"){
			if(armorInventory["chest"][id]){
				if(!armorInventory["chest"][id].empty){
					if(equippedArmor.chest==armorInventory["chest"][id]){
						equippedArmor.chest=armorInventory["chest"][0];
					}
					armorInventory["chest"][id]=armorInventory["chest"][0];
				}
			}
		}else if(slot == "c"){
			if(armorInventory["pants"][id]){
				if(!armorInventory["pants"][id].empty){
					if(equippedArmor.pants==armorInventory["pants"][id]){
						equippedArmor.pants=armorInventory["pants"][0];
					}
					armorInventory["pants"][id]=armorInventory["pants"][0];
				}
			}
		}else if(slot == "d"){
			if(armorInventory["boots"][id]){
				if(!armorInventory["boots"][id].empty){
					if(equippedArmor.boots==armorInventory["boots"][id]){
						equippedArmor.boots=armorInventory["boots"][0];
					}
					armorInventory["boots"][id]=armorInventory["boots"][0];
				}
			}
		}
	}
}
addArmor(vaultArmorHat);
addArmor(vaultArmorChest);
addArmor(vaultArmorPants);
addArmor(vaultArmorBoots);
/**
*	Identify what armor user is wearing
**/
var playerRes={};
function checkArmor(){
	//Attributes
	for(var res in playerRes){
		playerRes[res]=0;
	}
	for(var slot in equippedArmor){
		if(equippedArmor[slot].attributes.includes("Healing")){
			CurrentHealth+=4;
		}
		for(var res in equippedArmor[slot].defense){
			playerRes[res]+=equippedArmor[slot].defense[res]
		}
	}
	if(CurrentHealth>MaxedHealth){
		CurrentHealth=MaxedHealth;
	}
}
function calcRes(defense){
	var retRes={};
	for(var res in defense){
		retRes[res]=0;
	}
	for(var res in defense){
		retRes[res]+=defense[res]
	}
	return retRes
}
function calculateDamage(incoming,resistance){
	this.damageType=incoming.damageType;
	this.damage=incoming.damage;
	this.received=0;
	this.resistance=resistance;
	for(var i in resistance){
		this.received+=(this.damage/this.damageType.length);
		if(this.damageType.includes(i)){
			this.received-=this.damage*(constrain(this.resistance[i],0,0.4));
		}
	}
	if(this.resistance.all>0){
		this.receieved-=this.damage*(constrain(this.resistance.all,0,0.4));
	}
	return this.received
}
/**
*	Identify what armor user is wearing
**/


/**
* Metal types: aluminum, steel, brass, copper
* Metal states: plate, casing, rod, wire
* Common materials: paper, rubber, *plastic, string, cloth
* Other materials: gunpowder, nails, screws
* *plastic comes in casing form
**/
var materialInventory={
	//Plate section
	aluminum_plate:{
		amount:0,
		name:"Aluminum plate",
		craftable:true,
		craftOutput:3,
		material:{
			aluminum:2,
		},
	},
	steel_plate:{
		amount:0,
		name:"Steel plate",
		craftable:true,
		craftOutput:3,
		material:{
			steel:2,
		},
	},
	brass_plate:{
		amount:0,
		name:"Brass plate",
		craftable:true,
		craftOutput:3,
		material:{
			brass:2,
		},
	},
	copper_plate:{
		amount:0,
		name:"Copper plate",
		craftable:true,
		craftOutput:3,
		material:{
			copper:2,
		},
	},
	//Casing section
	aluminum_casing:{
		amount:0,
		name:"Aluminum casing",
		craftable:true,
		craftOutput:2,
		material:{
			aluminum_plate:1,
		},
	},
	steel_casing:{
		amount:0,
		name:"Steel casing",
		craftable:true,
		craftOutput:2,
		material:{
			steel_plate:1,
		},
	},
	brass_casing:{
		amount:0,
		name:"Brass casing",
		craftable:true,
		craftOutput:2,
		material:{
			brass_plate:1,
		},
	},
	copper_casing:{
		amount:0,
		name:"Copper casing",
		craftable:true,
		craftOutput:2,
		material:{
			copper_plate:1,
		},
	},
	plastic_casing:{
		amount:0,
		name:"Plastic casing",
		craftable:true,
		craftOutput:2,
		material:{
			plastic:1,
		},
	},
	//Rod section
	aluminum_rod:{
		amount:0,
		name:"Aluminum rod",
		craftable:true,
		craftOutput:1,
		material:{
			aluminum:2,
		},
	},
	steel_rod:{
		amount:0,
		name:"Steel rod",
		craftable:true,
		craftOutput:1,
		material:{
			steel:2,
		},
	},
	brass_rod:{
		amount:0,
		name:"Brass rod",
		craftable:true,
		craftOutput:1,
		material:{
			brass:2,
		},
	},
	copper_rod:{
		amount:0,
		name:"Copper rod",
		craftable:true,
		craftOutput:1,
		material:{
			copper:2,
		},
	},
	//Wire section
	aluminum_wire:{
		amount:0,
		name:"Aluminum wire",
		craftable:true,
		craftOutput:3,
		material:{
			aluminum:1,
		},
	},
	steel_wire:{
		amount:0,
		name:"Steel wire",
		craftable:true,
		craftOutput:3,
		material:{
			steel:1,
		},
	},
	brass_wire:{
		amount:0,
		name:"Brass wire",
		craftable:true,
		craftOutput:3,
		material:{
			brass:1,
		},
	},
	copper_wire:{
		amount:0,
		name:"Copper wire",
		craftable:true,
		craftOutput:3,
		material:{
			copper:1,
		},
	},
	//Metal
	aluminum:{
		amount:0,
		name:"Aluminum",
	},
	steel:{
		amount:0,
		name:"Steel",
	},
	brass:{
		amount:0,
		name:"Brass",
	},
	copper:{
		amount:0,
		name:"Copper",
	},
	//Common materials
	paper:{
		amount:0,
		name:"Paper",
		craftable:true,
		craftOutput:8,
		material:{
			wood:1,
		},
	},
	stick:{
		amount:0,
		name:"Stick",
		craftable:true,
		craftOutput:2,
		material:{
			wood:1,
		},
	},
	rubber:{
		amount:0,
		name:"Rubber",
	},
	plastic:{
		amount:0,
		name:"Plastic",
	},
	string:{
		amount:0,
		name:"String",
	},
	cloth:{
		amount:0,
		name:"Cloth",
	},
	ceramic:{
		amount:0,
		name:"Ceramic",
	},
	wood:{
		amount:0,
		name:"Wood",
	},
	glass:{
		amount:0,
		name:"Glass",
	},
	//Other materials
	gunpowder:{
		amount:0,
		name:"Gunpowder",
	},
	nails:{
		amount:0,
		name:"Nails",
	},
	screws:{
		amount:0,
		name:"Screws",
	},
};
/**
* Scavenge for crafting materials eg. metal plate, plastic, rubber, ceramic, cloth, glass, wood, nails, screws
**/
//cdf = cross-dimensional farm
//Add plants: harvested, timeToGrow in ticks, chance to drop more than 1 seed
//1 tick = moving 1 tile
var cdf={
	plants:{
		
	},
	tier:0,
	plantLimit:3,
};

var ammoTypes={
	pistol:0,
	nuke:0,
	smg:0,
	shotgun:0,
};
var ammo={
	pistol:{
		name:"Pistol",
		craftable:true,
		amount:0,
		material:{
			gunpowder:5,
			brass_casing:5,
		},
		craftOutput:5,
	},
	nuke:{
		name:"Nuke",
		craftable:true,
		amount:0,
		material:{
			gunpowder:20,
			steel_plate:4,
		},
		craftOutput:1,
	},
	smg:{
		name:"Smg",
		craftable:true,
		amount:0,
		material:{
			gunpowder:4,
			brass_casing:8,
		},
		craftOutput:8,
	},
	shotgun:{
		name:"Shotgun",
		craftable:true,
		amount:0,
		material:{
			gunpowder:6,
			plastic_casing:4,
			aluminum_plate:4,
			nails:8,
		},
		craftOutput:4,
	},
};
var foodStuff={
	potato:{
		dictName:"potato",
		hungerRestored:8,
		amount:2,
		name:"Potato",
		plantable:true,
		seeds:1,
		borderColor:'SaddleBrown',
		color:'beige',
		chanceToDrop:{
			one:80,
			two:30,
			three:10,
		},
		chanceToFind:{
			one:50,
			two:30,
			three:10,
		},
		timeToGrow:5,
		sellPrice:10,
		buyPrice:20,
		craftable:false,
	},
	tomato:{
		dictName:"tomato",
		hungerRestored:2,
		amount:1,
		name:"Tomato",
		plantable:true,
		seeds:0,
		borderColor:'FireBrick',
		color:'IndianRed',
		chanceToDrop:{
			one:80,
			two:60,
			three:50,
		},
		chanceToFind:{
			one:80,
			two:40,
			three:20,
		},
		timeToGrow:3,
		sellPrice:5,
		buyPrice:10,
		craftable:false,
	},
	corn:{
		dictName:"corn",
		hungerRestored:4,
		amount:0,
		name:"Corn",
		plantable:true,
		seeds:1,
		borderColor:'Lime',
		color:'Cornsilk',
		chanceToDrop:{
			one:80,
			two:60,
			three:50,
		},
		chanceToFind:{
			one:80,
			two:50,
			three:30,
		},
		timeToGrow:3,
		sellPrice:8,
		buyPrice:15,
		craftable:false,
	},
	cabbage:{
		dictName:"cabbage",
		hungerRestored:10,
		amount:1,
		name:"Cabbage",
		borderColor:'LawnGreen',
		color:'Chartreuse',
		plantable:true,
		seeds:1,
		chanceToDrop:{
			one:70,
			two:30,
			three:10,
		},
		chanceToFind:{
			one:40,
			two:30,
			three:10,
		},
		timeToGrow:6,
		sellPrice:13,
		buyPrice:20,
		craftable:false,
	},
	genericFrozenMeal:{
		dictName:"genericFrozenMeal",
		hungerRestored:16,
		amount:0,
		name:"Chef Manardee",
		plantable:false,
		chanceToFind:{
			one:30,
			two:20,
			three:10,
		},
		sellPrice:20,
		buyPrice:30,
		craftable:false,
	},
	cabbage_tomato_stew:{
		dictName:"cabbage_tomato_stew",
		abbr:"cts",
		hungerRestored:24,
		amount:0,
		name:"Cabbage Tomato stew",
		plantable:false,
		chanceToFind:{
			one:0,
			two:0,
			three:0,
		},
		sellPrice:15,
		buyPrice:30,
		craftable:true,
		material:{
			cabbage:3,
			tomato:3,
		},
		craftOutput:1,
	},
};
/**
* Object to create attachments: topRail, grip, barrel, gunStock
* ATTACHMENTAREA
**/
var attachmentInventory={
	red_dot_sight:{
		slot:"topRail",
		dictName:"red_dot_sight",
		name:"Red Dot sight",
		type:"any",
		amount:0,
		effect:{
			accuracy:0,
			damage:0,
		},
		craftable:true,
		material:{
			glass:2,
			steel_plate:1,
			steel_casing:1,
			screws:4,
		},
		craftOutput:1,
	},
	rubber_grip:{
		slot:"grip",
		dictName:"rubber_grip",
		name:"Rubber grip",
		type:"any",
		amount:0,
		effect:{
			accuracy:0,
			damage:0,
		},
		craftable:true,
		material:{
			rubber:3,
			aluminum_plate:2,
			screws:4,
		},
		craftOutput:1,
	},
	silencer:{
		slot:"barrel",
		dictName:"silencer",
		name:"Silencer",
		type:"any",
		amount:0,
		effect:{
			accuracy:0,
			damage:0,
		},
		craftable:true,
		material:{
			steel_casing:2,
			cloth:4,
			screws:4,
		},
		craftOutput:1,
	},
	extended_stock:{
		slot:"gunStock",
		dictName:"extended_stock",
		name:"Extended Stock",
		type:"any",
		amount:0,
		effect:{
			accuracy:0,
			damage:0,
		},
		craftable:true,
		material:{
			rubber:2,
			steel_rod:2,
			brass_plate:2,
			screws:4,
		},
		craftOutput:1,
	},
};
/**
*  Give attachments attributes such as increased accuracy
**/

function addAttach(att){
	attachmentInventory[att].amount++;
}
function remAttach(att){
	attachmentInventory[att].amount--;
}
function deequipAttach(weapNum,slot){
	var validSlot=false;
	var newSlot="";
	switch(slot.toLowerCase()){
		case "toprail" || "top" || "top rail":
			validSlot=true;
			newSlot="topRail";
			break;
		case "grip":
			validSlot=true;
			newSlot="grip";
			break;
		case "gunstock" || "gun stock" || "stock":
			validSlot=true;
			newSlot="gunStock";
			break;
		case "barrel":
			validSlot=true;
			newSlot="barrel";
			break;
	}
	if(validSlot){
		if(playerInventory[weapNum].attachments[newSlot].canAdd && playerInventory[weapNum].attachments[newSlot].att.tier !== "stock"){
			var attName = playerInventory[weapNum].attachments[newSlot].att.name;
			attachmentInventory[playerInventory[weapNum].attachments[newSlot].att.dictName].amount++;
			playerInventory[weapNum].attachments[newSlot].att={
				tier:"stock",
				name:playerInventory[weapNum].name+" "+playerInventory[weapNum].attachments[newSlot].slotName,
				empty:false,
			}
			return {name:attName,success:true,msg:"Removed "+attName+" from "+playerInventory[weapNum].name+"."}
		}else{
			return {name:false,success:false,msg:"Attachment slot of "+playerInventory[weapNum].name+" is either stock, or unmodifiable."}
		}
	}else{
		return {name:false,success:false,msg:"Invalid slot."}
	}
}
function equipAttach(weapNum,attName){
	if(attachmentInventory[attName]){
		if(!playerInventory[weapNum].empty){
			if(playerInventory[weapNum].attachments[attachmentInventory[attName].slot].canAdd && attachmentInventory[attName].amount>0){
				var newSlot=attachmentInventory[attName].slot;
				playerInventory[weapNum].attachments[newSlot].att=attachmentInventory[attName];
				attachmentInventory[attName].amount--;
				return {name:attName,success:true,msg:"Equipped "+attachmentInventory[attName].name+" to "+playerInventory[weapNum].name+"."}
			}else{
				if(attachmentInventory[attName].amount < 1){
					return {name:attName,success:false,msg:"Could not equip "+attachmentInventory[attName].name+" to "+playerInventory[weapNum].name+", because you don't have any."}
				}else if(!playerInventory[weapNum].attachments[attachmentInventory[attName].slot].canAdd){
					return {name:attName,success:false,msg:"Could not equip "+attachmentInventory[attName].name+" to "+playerInventory[weapNum].name+", because the "+playerInventory[weapNum].attachments[attName].slotName+" is not modifiable."}
				}else{
					return {name:attName,success:false,msg:"Could not equip "+attachmentInventory[attName].name+" to "+playerInventory[weapNum].name+" for unknown reasons."}
				}
			}
		}else{
			return {name:attName,success:false,msg:"You do not have a weapon with an id of "+weapNum+"."}
		}
	}else{
		return {name:attName,success:false,msg:attName.replace("_"," ")+" is not a valid attachment."}
	}
}


function craft(parentObj,recipe){
	var parentObj = parentObj.toLowerCase();
	var recipe = recipe.toLowerCase();
	var pObj = {};
	switch(parentObj){
		case "ammo":
			pObj=ammo;
			break;
		case "food":
			pObj=foodStuff;
			break;
		case "material":
			pObj=materialInventory;
			break;
		case "attachment":
			pObj=attachmentInventory;
			break;
	}
	for(var i in pObj[recipe].material){
		if(parentObj == "food"){
			if(pObj[recipe].material.amount>foodStuff[i].amount){
				return false;
			}
		}
		if(parentObj == "ammo"){
			if(pObj[recipe].material.amount>materialInventory[i].amount){
				return false;
			}
		}
		if(parentObj == "material"){
			if(pObj[recipe].material.amount>materialInventory[i].amount){
				return false;
			}
		}
		if(parentObj == "attachment"){
			if(pObj[recipe].material.amount>materialInventory[i].amount){
				return false;
			}
		}
	}
	for(var mat in pObj[recipe].material){
		if(parentObj == "food"){
			foodStuff[mat].amount-=pObj[recipe].material[mat];
		}
		if(parentObj == "ammo"){
			materialInventory[mat].amount-=pObj[recipe].material[mat];
		}
		if(parentObj == "material"){
			materialInventory[mat].amount-=pObj[recipe].material[mat];
		}
		if(parentObj == "attachment"){
			materialInventory[mat].amount-=pObj[recipe].material[mat];
		}
	}
	pObj[recipe].amount+=pObj[recipe].craftOutput;
	return {amount:pObj[recipe].craftOutput,name:pObj[recipe].name};
}
var tick=function(n){
	if(hunger>0){
		hunger-=n;
	}
	var cdfPlantLength=0;
	for(var i in cdf.plants){
		cdfPlantLength++;
	}
	for(var i in cdf.plants){
		if(cdfPlantLength>0){
			if(cdf.plants[i].planted && cdf.plants[i].ticks < cdf.plants[i].timeToGrow){
				cdf.plants[i].ticks++;
			}
		}
	}
	if(hunger<maxHunger*(0.15-(tPara*0.01))){
		CurrentHealth--;
	}
	if(hunger>(maxHunger*(0.8-(tPara*0.05)))&&CurrentHealth<MaxedHealth && !(CurrentHealth+5 > MaxedHealth)){
		CurrentHealth+=5;
	}
	if(hunger<0){
		hunger=0;
	}
	checkArmor();
};
//Move from room -5 hunger
//Scavenge -8 hunger and 2 ticks
//Perk to add, explosive exploitation
//Luck o' the Irish, find 7% more caps, tier 2: 20% more likely to find potato
var perkTree={
	strength:{
		banePerk:{
			tier1:{
				description:"Strongman: Tier 1",
				title:"Melee attacks deal 20% more damage.",
				name:"Strongman",
				id:"strongMan",
				has:false,
				levelReq: 4,
				req:3,
			},
			tier2:{
				description:"Strongman: Tier 2",
				title:"Melee attacks deal 40% more damage.",
				name:"Strongman",
				id:"strongMan",
				has:false,
				levelReq: 7,
				req:5,
			},
		},
		
	},
	perception:{
		fourEyes:{
			tier1:{
				description:"Four-Eyes: Tier 1",
				title:"Able to search an area twice.",
				name:"Four-Eyes",
				id:"fourI",
				has:false,
				levelReq: 4,
				req:3,
			},
			tier2:{
				description:"Four-Eyes: Tier 2",
				title:"Able to search an area thrice.",
				name:"Four-Eyes",
				id:"fourI",
				has:false,
				levelReq: 5,
				req:4,
			},
			tier3:{
				description:"Four-Eyes: Tier 3",
				title:"Able to search an area 4 times.",
				name:"Four-Eyes",
				id:"fourI",
				has:false,
				levelReq: 7,
				req:6,
			},
			tier4:{
				description:"Four-Eyes: Tier 4",
				title:"Able to search an area 5 times.",
				name:"Four-Eyes",
				id:"fourI",
				has:false,
				levelReq: 9,
				req:8,
			},
			tier5:{
				description:"Four-Eyes: Tier 5",
				title:"Able to search an area 6 times.",
				name:"Four-Eyes",
				id:"fourI",
				has:false,
				levelReq: 11,
				req:10,
			},
		},
		
	},
	endurance:{
		timParadox:{
			tier1:{
				description:"The Tim Paradox: Tier 1",
				title:"Increases max hunger by 15 points.",
				name:"The Tim Paradox",
				id:"tPar",
				has:false,
				levelReq: 4,
				req:3,
			},
			tier2:{
				description:"The Tim Paradox: Tier 2",
				title:"Increases max hunger by 30 points.",
				name:"The Tim Paradox",
				id:"tPar",
				has:false,
				levelReq: 6,
				req:5,
			},
			tier3:{
				description:"The Tim Paradox: Tier 3",
				title:"Increases max hunger by 55 points.",
				name:"The Tim Paradox",
				id:"tPar",
				has:false,
				levelReq: 7,
				req:8,
			},
		},
		swampMan:{
			tier1:{
				description:"Swamp Man: Tier 1",
				title:"Become 20% more resistant to radiation.",
				name:"Swamp Man",
				id:"sMan",
				has:false,
				levelReq: 5,
				req:7,
			},
			tier2:{
				description:"Swamp Man: Tier 2",
				title:"Become 50% more resistant to radiation.",
				name:"Swamp Man",
				id:"sMan",
				has:false,
				levelReq: 6,
				req:8,
			},
		},
	},
	charisma:{
		silverTounge:{
			tier1:{
				description:"Silver Tounge: Tier 1",
				title:"Buy and sell prices are better.",
				name:"Silver Tounge",
				id:"slickTalker",
				has:false,
				levelReq: 4,
				req:3,
			},
		},
	},
	intelligence:{
		allA:{
			tier1:{
				description:"All A's: Tier 1",
				title:"Studying rewards 10% more XP.",
				name:"All A's",
				id:"aStudent",
				has:false,
				levelReq: 4,
				req:3,
			},
		},
		
	},
	agility:{
		triggerFinger:{
			tier1:{
				description:"Trigger Finger: Tier 1",
				title:"Fire twice instead of once when attacking.",
				name:"Trigger Finger",
				id:"trigF",
				has:false,
				levelReq: 4,
				req:3,
			},
		},
		
	},
	luck:{
		luckIrish:{
			tier1:{
				description:"Luck o' The Irish: Tier 1",
				title:"Find 20% more caps, and find items more often.",
				name:"Luck o' The Irish",
				id:"lIrish",
				has:false,
				levelReq: 6,
				req:5,
			},
			tier2:{
				description:"Luck o' The Irish: Tier 2",
				title:"Find 50% more caps, and find items more often.",
				name:"Luck o' The Irish",
				id:"lIrish",
				has:false,
				levelReq: 10,
				req:6,
			},
		},
		
	},
};
var checkPerk=function(statName,perkName,tierNum){
	var ret = perkTree[statName][perkName]["tier"+tierNum];
	return ret;
};
var strongM=0;
setInterval(function(){
	irish=0;
	fourI=0;
	tPara=0;
	strongM=0;
	for(var i in perkTree["luck"]["luckIrish"]){
		if(checkPerk("luck","luckIrish",i.split("tier")[1]).has){
			irish++;
		}
	}
	for(var i in perkTree["perception"]["fourEyes"]){
		if(checkPerk("perception","fourEyes",i.split("tier")[1]).has){
			fourI++;
		}
	}
	for(var i in perkTree["endurance"]["timParadox"]){
		if(checkPerk("endurance","timParadox",i.split("tier")[1]).has){
			tPara++;
		}
	}
	for(var i in perkTree["strength"]["banePerk"]){
		if(checkPerk("strength","banePerk",i.split("tier")[1]).has){
			strongM++;
		}
	}
	var totalItems=0;
	for(var i=0;i<playerInventory.capacity;i++){
		if(!playerInventory[i].empty){
			totalItems++;
		}
	}
	var totalArmor=0;
	for(var j in armorInventory){
		for(var i=0;i<armorInventory.capacity;i++){
			if(j!=="capacity"){
				if(!armorInventory[j][i].empty){
					totalArmor++;
				}
			}
		}
	}
	if(totalItems>=playerInventory.capacity){
		overEncumberedItem=true;
	}else{
		overEncumberedItem=false;
	}
	if(totalArmor>=armorInventory.capacity){
		overEncumberedArmor=true;
	}else{
		overEncumberedArmor=false;
	}
	var tExtra=0;
	var tExtra2=0;
	if(tPara>1){
		tExtra=15;
	}
	if(tPara>2){
		tExtra2=40;
	}
	maxHunger=100+(tPara*15)+tExtra+tExtra2;
},20);
var clickedButton=false;
var clickButton=function(){
	clickedButton=true;
};
var closePrompt = function(){
	document.body.style.pointerEvents="auto";
	document.getElementById('overlay').parentNode.removeChild(document.getElementById('overlay'));
};
var changeUserInfo = function(){
	changeVis(document.getElementById('userInformation'));
};
var setOnClick=function(){
	
	document.getElementById('signOutBtn').addEventListener('click',signout);
	document.getElementById('userButton').addEventListener('click',changeUserInfo);
};
var customPrompt = function(prom,okFunc,exitFunc){
	exitFunc=exitFunc || "";
	okFunc=okFunc || "";
	if(document.getElementById('overlay')===null){
		var myPrompt=document.createElement('div');
		var overlay=document.createElement('div');
		var exitBtn=document.createElement('button');
		exitBtn.innerHTML="X";
		var okBtn=document.createElement('button');
		okBtn.innerHTML="Ok";
		exitBtn.id="exitBtn";
		okBtn.id="okBtn";
		exitBtn.style="border-style:none; top: 5px; right: 5px; background-color: inherit; position: inherit";
		okBtn.style="border-style: ridge; border-radius: 10px; border-color: black; bottom: 5px; right: 50%; background-color: inherit; position: inherit";
		prom.style.position="inherit";
		prom.style.backgroundColor="inherit";
		overlay.id="overlay";
		overlay.style="z-index: 99999; background-color: rgba(0,0,0,0.6); top: 0; right: 0; left: 0; bottom: 0; pointer-events: painted; position: absolute;";
		myPrompt.style="z-index: 100000; pointer-events: auto; position: inherit; border-radius: 10px; border-style: ridge; border-color: black; background-color: ghostwhite; left: 40%; right: 40%; top: 20%; bottom:55%";
		myPrompt.id='myPrompt';
		myPrompt.appendChild(exitBtn);
		if(prom.style.left===""){
			prom.style.left="5px";
		}
		if(prom.style.top===""){
			prom.style.top="5px";
		}
		myPrompt.appendChild(prom);
		myPrompt.appendChild(okBtn);
		overlay.appendChild(myPrompt);
		document.body.insertBefore(overlay,document.body.childNodes[0]);
		document.getElementById('exitBtn').setAttribute('onClick','closePrompt();'+exitFunc);
		document.getElementById('okBtn').setAttribute('onClick','closePrompt();'+okFunc);
		document.body.pointerEvents="none";
	}
};
var changeVis=function(a){
	if(a.style.visibility==="hidden"){
		a.style.visibility="visible";
	}else{
		a.style.visibility="hidden";
	}
};
var signout=function(){
	firebase.auth().signOut().then(function() {
		var newDiv=document.createElement('div');
		newDiv.style="color: black; left: 40%; right: 40%; top: 20%; bottom: 60%;";
		newDiv.innerHTML="Signed Out.";
		changeVis(document.getElementById('userInformation'));
		customPrompt(newDiv,"closePage();","closePage();");
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in.
			}else{
				closePage();
			}
		});
	}, function(error) {
		var newDiv=document.createElement('div');
		newDiv.style="color: black; left: 40%; right: 40%; top: 20%; bottom: 60%;";
		newDiv.innerHTML="Sign Out Error:\n"+error;
		customPrompt(newDiv);
	});
};
var userDiv;
var userIcon;
var userInfo1;
var userInfo2;
var signOutButton;
var userButton;
var userImg;
firebase.auth().onAuthStateChanged(function(user) {
	if(user){
		currentUser = firebase.auth().currentUser;
		userDiv = document.createElement('div');
		userDiv.id="userInformation";
		userDiv.style="position: absolute; width: 300px; height: 200px; border-style: ridge; border-radius: 15px; border-color: black; background-color: rgb(200,200,200); color: black; right: 60px; bottom: 100px; z-index:10000; visibility: hidden;";
		userIcon = document.createElement('img');
		userInfo1 = document.createElement('p');
		userInfo2 = document.createElement('p');
		signOutButton = document.createElement('button');
		signOutButton.id="signOutBtn";
		signOutButton.style = "position: inherit; right: 10px; bottom: 10px; width: 65px; height: 30px; border-radius: 4px; border-style: ridge; border-color: black; color: black;";
		signOutButton.innerHTML="Sign out";
		userInfo1.class="userInfo";
		userInfo2.class="userInfo";
		userIcon.class="userIcon";
		userInfo1.innerHTML="Name: "+currentUser.displayName;
		userInfo2.innerHTML="Email: "+currentUser.email;
		userInfo1.style="position: absolute; left: 10px; top: 150px; font-size: 12px; color: black;";
		userInfo2.style="position: absolute; left: 10px; top: 165px; font-size: 12px; color: black;";
		userIcon.src=currentUser.photoURL;
		userIcon.style="position: inherit; right: 7px; top: 5px; width: 120px; height: 120px; border-radius: 60px;";
		userDiv.appendChild(signOutButton);
		userDiv.appendChild(userInfo1);
		userDiv.appendChild(userInfo2);
		userDiv.appendChild(userIcon);
		document.body.appendChild(userDiv);
		userButton = document.createElement('button');
		userImg = document.createElement('img')
		userImg.src = currentUser.photoURL;
		userImg.style = "border-style: none; position: absolute; z-index: 9999; top: 0; left: 0; width: 100%; height: 100%; border-radius: 20px;";
		userButton.appendChild(userImg);
		userButton.id = "userButton";
		userButton.style = "border-style: none; position: absolute; z-index: 9999; right: 60px; bottom: 60px; width: 40px; height: 40px; border-radius: 20px;";
		document.body.appendChild(userButton);
		setOnClick();
	}else{
		firebase.auth().getRedirectResult().then(function(result) {
		var user = result.user;
		var credential = result.credential;
		if(user===null){
			var providerChoice=prompt("What is your form of login?\nGoogle\nGithub\nEmail\nTwitter\nFacebook\nIf you are signing out, click cancel.","");
			var provider;
			if(providerChoice.toLowerCase()==="google"){
				provider = new firebase.auth.GoogleAuthProvider();
			}else if(providerChoice.toLowerCase()==="github"){
				provider = new firebase.auth.GithubAuthProvider();
			}else if(providerChoice.toLowerCase()==="email"){
				provider = new firebase.auth.EmailAuthProvider();
			}else if(providerChoice.toLowerCase()==="twitter"){
				provider = new firebase.auth.TwitterAuthProvider();
			}else if(providerChoice.toLowerCase()==="facebook"){
				provider = new firebase.auth.FacebookAuthProvider();
			}
			firebase.auth().signInWithRedirect(provider);
		}else{
			trueResult = result;
			currentUser = firebase.auth().currentUser;
			userDiv = document.createElement('div');
			userDiv.id="userInformation";
			userDiv.style="position: absolute; width: 300px; height: 200px; border-style: ridge; border-radius: 15px; border-color: black; background-color: rgb(200,200,200); color: black; right: 60px; bottom: 100px; z-index:10000; visibility: hidden;";
			userIcon = document.createElement('img');
			userInfo1 = document.createElement('p');
			userInfo2 = document.createElement('p');
			signOutButton = document.createElement('button');
			signOutButton.id="signOutBtn";
			signOutButton.style = "position: inherit; right: 10px; bottom: 10px; width: 65px; height: 30px; border-radius: 4px; border-style: ridge; border-color: black; color: black;";
			signOutButton.innerHTML="Sign out";
			userInfo1.class="userInfo";
			userInfo2.class="userInfo";
			userIcon.class="userIcon";
			userInfo1.innerHTML="Name: "+currentUser.displayName;
			userInfo2.innerHTML="Email: "+currentUser.email;
			userInfo1.style="position: absolute; left: 10px; top: 150px; font-size: 12px; color: black;";
			userInfo2.style="position: absolute; left: 10px; top: 165px; font-size: 12px; color: black;";
			userIcon.src=currentUser.photoURL;
			userIcon.style="position: inherit; right: 7px; top: 5px; width: 120px; height: 120px; border-radius: 60px;";
			userDiv.appendChild(signOutButton);
			userDiv.appendChild(userInfo1);
			userDiv.appendChild(userInfo2);
			userDiv.appendChild(userIcon);
			document.body.appendChild(userDiv);
			userButton = document.createElement('button');
			userImg = document.createElement('img')
			userImg.src = currentUser.photoURL;
			userImg.style = "border-style: none; position: absolute; z-index: 9999; top: 0; left: 0; width: 100%; height: 100%; border-radius: 20px;";
			userButton.appendChild(userImg);
			userButton.id = "userButton";
			userButton.style = "border-style: none; position: absolute; z-index: 9999; right: 60px; bottom: 60px; width: 40px; height: 40px; border-radius: 20px;";
			document.body.appendChild(userButton);
			setOnClick();
		}
		}, function(error) {
			// The provider's account email, can be used in case of
			// auth/account-exists-with-different-credential to fetch the providers
			// linked to the email:
			var email = error.email;
			// The provider's credential:
			var credential = error.credential;
			// In case of auth/account-exists-with-different-credential error,
			// you can fetch the providers using this:

		});
	}
});
var loadedData;
var getData=function(dataToGet){
	if(firebase.auth().currentUser!==undefined && firebase.auth().currentUser!==null){
		firebase.database().ref('/users/' + firebase.auth().currentUser.uid).once('value').then(
			function(snapshot){
				loadedData = snapshot.val()[dataToGet.toString()];
			}
		);
	}
};
var dataRecieved;
var getPlayername=function(idOfPlayer){
	if(firebase.auth().currentUser!==undefined && firebase.auth().currentUser!==null){
		firebase.database().ref('/users/' + idOfPlayer + '/gamedata/playerName').once('value').then(
			function(snapshot){
				dataRecieved = snapshot.val();
			}
		);
	}
	return dataRecieved;
};

			var globalXY={};
			firebase.database().ref('deathMessages').once('value').then(
				function(snapshot){
					globalXY = snapshot.val();
				}
			);
var enableCombat=true;
var checkStorage=function(){
	getData("gamedata");
     if(loadedData!==undefined){
          return true;
     }else{
          return false;
     }
};
checkStorage();
var speaking = new p5.Speech();
speaking.setLang('en-US');
speaking.setVoice("Google UK English Male");
speaking.setVolume(2);
speaking.setPitch(0.8);
speaking.setRate(0.8);
speaking.interrupt = true;
var currentSpeak = "";
for (var i = 0; i < document.getElementById('console').childElementCount; i++) {
    if (document.getElementById('console').children[i].id !== "place_holder") {
        if (document.getElementById('console').children[i].childElementCount > 0) {
            for (var j = 0; j < document.getElementById('console').children[i].childElementCount; j++) {
                if (document.getElementById('console').children[i].children[j].id !== "assignPoints") {
                    document.getElementById('console').children[i].children[j].className += " speakable";
                }
            }
        } else {
            document.getElementById('console').children[i].className += " speakable";
        }
    }
}
var chooseBackground=document.createElement('select');
chooseBackground.id="backgroundSelection";
var doctor=document.createElement('option');
var soldier=document.createElement('option');
var vendor=document.createElement('option');
var mayor=document.createElement('option');
doctor.value="Doctor";
doctor.innerHTML="Doctor";
doctor.title="Before the bombs dropped, you were a doctor at a local hospital.\nHealing items are more efficient.";
soldier.value="Soldier";
soldier.innerHTML="Soldier";
soldier.title="You are a soldier that survived when the bombs dropped.\nAssault rifles do additional damage.";
vendor.value="Vendor";
vendor.innerHTML="Vendor";
vendor.title="You use to be the owner of a local business.\nItems cost less and sell for more.";
mayor.value="Mayor";
mayor.innerHTML="Mayor";
mayor.title="When the bombs dropped you were calming down the local residents.\nYou have a higher charisma and are more persuasive.";
var availableClasses=[doctor,soldier,vendor,mayor];
for(var i=0;i<availableClasses.length;i++){
	chooseBackground.appendChild(availableClasses[i]);
}
document.getElementById('assignPoints').appendChild(chooseBackground);
var statButton=document.createElement('button');
var bre=document.createElement('br');
document.getElementById('assignPoints').appendChild(bre);
statButton.setAttribute('onclick','clickButton();');
statButton.innerHTML="Select Class";
document.getElementById('assignPoints').appendChild(statButton);
if(!document.getElementById('message_room98')){
	var cdfMessage=document.createElement('p');
	cdfMessage.innerHTML=">Welcome to the Cross-Dimensional Farm<br>>Here, you can grow crops.<br>>To open the farm, type 'farm open'.";
	cdfMessage.class='speakable';
	cdfMessage.id='message_room98';
	document.getElementById('message_room99').parentElement.appendChild(cdfMessage);
}
var divLength;
if (currentSpeak === "") {
    divLength = document.getElementById('console').childElementCount - 1;
} else {
    divLength = document.getElementById('console').childElementCount;
}
var checkChange = function() {
    speaking.setVoice("Google UK English Male");
    var localChange = false;
    if (document.getElementById('console').childElementCount > divLength) {
        localChange = true;
    } else {
        localChange = false;
    }
    if (document.getElementById('console').childElementCount > divLength) {
        divLength = document.getElementById('console').childElementCount;
        if (currentSpeak === "") {
            //currentSpeak = document.getElementsByClassName('speakable')[2].innerHTML.replace(/<br>/g, "").replace(/<\/br>/g, "").replace(/[><\]\[]/g, "").replace(/&gt;/g, "");
        } else {
            //currentSpeak = document.getElementsByClassName('speakable')[0].innerHTML.replace(/<br>/g, "").replace(/<\/br>/g, "").replace(/[><\]\[]/g, "").replace(/&gt;/g, "");
        }
    }
    if (localChange) {
        //speaking.speak(currentSpeak);
    } else {
    }
};
//Rooms Check
var playerInventory = {
	capacity:8,
};
for(var i=0;i<50;i++){
	playerInventory[i]={empty:true};
}
var currentCaps = 10;
var canTrade = false;
var startMSG = document.getElementById('area_vault');
var playerName = '';
startMSG.innerHTML = '>' + playerName + ' messed up this time, the overseer walked in on ' + playerName + ' sleeping with his daughter.\nThat salty old bastard is kicking ' + playerName + ' out into the wasteland to be. As ' + playerName + ' approached\nthe vault door. A dim beam of light from a crack in ceiling reveals a a wooden stick\non the floor next to a note with the name ' + playerName + ' on it...';
window.onkeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
    if (e.keyCode == 8 && e.target == document.body) {
        e.preventDefault();
    }
    if (e.keyCode == 17 && e.target == document.body) {
        e.preventDefault();
    }
    if (e.keyCode == 18 && e.target == document.body) {
        e.preventDefault();
    }
    if (e.keyCode == 93 && e.target == document.body) {
        e.preventDefault();
    }
    if (e.keyCode == 91 && e.target == document.body) {
        e.preventDefault();
    }
};
var done = 0;
{
    var roomChecky = function() {
        var zxc = [0, 0, 0, 0, 0, 0];
        for (var i = 0; i < area.length; i++) {
            for (var j = 0; j < area[i].length; j++) {
                for (var c = 0; c < zxc.length; c++) {
                    if (area[i][j][0] === c) {
                        zxc[c] += 1;
                    }
                }
            }
        }
        for (var g = 0; g < zxc.length; g++) {
            zxc[g] = g + 1 + ": " + zxc[g];
        }
        for (var b = 0; b < zxc.length; b++) {
            console.log(zxc[b]);
        }
    };
}
var j = 0;
var n = 4;
var prefix;
var item;
var updatingSPEC = true;
var stopCounting = false;
// Been to Variables
var beentoarea_vault = true;
// Current starting room
var currentroom = "area_vault";
//Game Winning Item Variables 
var titaniumKey = false; {
    Array.prototype.sortOn = function(key) {
        this.sort(function(a, b) {
            if (a[key] < b[key]) {
                return -1;
            } else if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        });
    };
    var effectList = ["Incendiary", "Normal", "Cryo", "Normal", "Radiant", "Normal", "Blinding", "Normal"];

    var fistBase = {
        type: "Melee",
        defName: "Fist",
	attachments:{
		topRail:{
			slotName:"top rail",
			canAdd:false,
			att:{
				tier:"stock",
				
			},
		},
		grip:{
			slotName:"grip",
			canAdd:false,
			att:{
				tier:"stock",
				
			},
		},
		barrel:{
			slotName:"barrel",
			canAdd:false,
			att:{
				tier:"stock",
				
			},
		},
		gunStock:{
			slotName:"stock",
			canAdd:false,
			att:{
				tier:"stock",
				
			},
		},
	},
        value: 5,
        damage: 10,
	damageType:["mel"],
        reloadSpeed: 1,
        magCap: 12,
        ammoType: "none",
    };
    var pistolBase = {
        type: "Pistol",
        defName: "9MM Pistol",
	attachments:{
		topRail:{
			slotName:"top rail",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		grip:{
			slotName:"grip",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		barrel:{
			slotName:"barrel",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		gunStock:{
			slotName:"stock",
			canAdd:false,
			att:{
				tier:"stock",
				
			},
		},
	},
        value: 15,
        damage: 30,
	damageType:["bllt"],
        reloadSpeed: 1,
        magCap: 12,
        ammoType: "pistol",
    };
    var shotgunBase = {
        type: "Shotgun",
        defName: "Shotgun",
	attachments:{
		topRail:{
			slotName:"top rail",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		grip:{
			slotName:"grip",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		barrel:{
			slotName:"barrel",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		gunStock:{
			slotName:"stock",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
	},
        value: 35,
        damage: 25,
	damageType:["bllt"],
        reloadSpeed: 0.8,
        magCap: 6,
        ammoType: "shotgun",
    };
    var smgBase = {
        type: "SMG",
        defName: "SMG",
	attachments:{
		topRail:{
			slotName:"top rail",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		grip:{
			slotName:"grip",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		barrel:{
			slotName:"barrel",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		gunStock:{
			slotName:"stock",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
	},
        value: 20,
        damage: 10,
	damageType:["bllt"],
        reloadSpeed: 1.2,
        magCap: 32,
        ammoType: "smg",
    };
    var nukeBase = {
        type: "Nuke",
        defName: "Nuke Launcher",
	attachments:{
		topRail:{
			slotName:"top rail",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		grip:{
			slotName:"grip",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		barrel:{
			slotName:"barrel",
			canAdd:true,
			att:{
				tier:"stock",
				
			},
		},
		gunStock:{
			slotName:"stock",
			canAdd:false,
			att:{
				tier:"stock",
				
			},
		},
	},
        value: 70,
        damage: 100,
	damageType:["exp"],
        reloadSpeed: 0.5,
        magCap: 1,
        ammoType: "nuke",
    };
    var weapNameType = [
        [pistolBase, "9MM Pistol"],
        [nukeBase, "Nuke Launcher"],
        [pistolBase, "9MM Pistol"],
        [smgBase, "SMG"],
        [pistolBase, "9MM Pistol"],
        [smgBase, "SMG"],
        [pistolBase, "9MM Pistol"],
        [shotgunBase, "Shotgun"],
        [pistolBase, "9MM Pistol"],
        [shotgunBase, "Shotgun"],
        [pistolBase, "9MM Pistol"],
        [fistBase, "Fist"]
    ];
    var shopEffectList = ["Incendiary", "Cryo", "Radiant", "Blinding", "Normal"];
    var shopWeapNameType = [
        [nukeBase, "Nuke Launcher"],
        [smgBase, "SMG"],
        [pistolBase, "9MM Pistol"],
        [shotgunBase, "Shotgun"],
        [fistBase, "Fist"]
    ];
    var weap = function(baseWeap, effect, name, id) {
        this.id = id;
        this.baseWeap = baseWeap;
        this.name = name || this.baseWeap.defName;
        this.effect = effect === "Normal" ? "Normal" : effect;
	
        this.value = this.baseWeap.value;
        this.damage = this.baseWeap.damage;
	this.damageType = this.baseWeap.damageType;
        this.type = this.baseWeap.type;
	this.attachments=this.baseWeap.attachments;
	for(var i in this.attachments){
		if(this.attachments[i].canAdd){
			if(this.attachments[i].att.tier=="stock"){
				this.attachments[i].att={
					tier:"stock",
					name:this.name+" "+this.attachments[i].slotName,
					empty:false,
				};
			}
		}else{
			this.attachments[i].att={
				tier:"none",
				name:"none",
				empty:true,
			};
		}
	}
        this.magCap = this.baseWeap.magCap;
        this.ammoType = this.baseWeap.ammoType;
        if (this.effect !== "Normal") {
            this.name = this.effect + " " + this.name;
            switch (this.effect) {
                case "Incendiary":
                    this.damage = this.damage * 1.4;
                    this.value += 40;
			this.damageType.push("fire");
                    break;
                case "Cryo":
                    this.damage = this.damage * 1.3;
			    this.damageType.push("cold");
                    this.value += 30;
                    break;
                case "Radiant":
                    this.damage = this.damage * 1.2;
			    this.damageType.push("rad");
                    this.value += 20;
                    break;
                case "Blinding":
                    this.damage = this.damage + (this.damage * 0.1);
                    this.value += 10;
                    break;
            }
        }
    };
    var weapList = [];
    var randomWeapEffect = function() {
        var b = effectList.length - 1;
        var a = effectList[Math.round(Math.random() * b)];
        return a;
    };
    var giveRandomWeap = function() {
        var l = weapNameType[Math.round(Math.random() * (weapNameType.length - 2))];
        var k = new weap(l[0], randomWeapEffect(), l[1], weapList.length);
        return k;
    };
}














//[End] Game Winning Item Variables

{
    var Sharp_Wooden_Stick = 0;
    var note1 = false;
    var items = [
        //[Name] [ID] [AmountOwned] [Value] [Damage] [Type]
        ["Nothing", 0, 0, 0, 1, "Melee"],
        ["9MM Pistol", 1, 0, 50, 2, "Gun"],
        ["Shotgun", 2, 0, 75, 3, "Gun"],
        ["Stick", 3, 0, 20, 1.5, "Melee"],
        ["SMG", 4, 0, 60, 3, "Gun"],
        ["Nuke launcher", 5, 0, 100, 6, "Gun"],
        ["Thingy", 6, 0, 10, 1.75, "Melee"],
        ["Bandage", 7, 1, 40, 0]
    ];
}
//Items/Equip
{
    var equipItem = new weap(fistBase, "Normal", "Fists", -1);
    playerInventory[49]=equipItem;
	playerInventory[49].empty=false;
    var equippedWeapon;
    // Action/Perk Variables
    var MeleeDmg;
    var curDmg;
    var HealAmount;
    var StimDropRate;
    var numStim;
}
//Area tiles and RNG
{
	//Defined the shopkeepers inventory
	var shopInventory=[];
    	var shopArmor=[];
    var playerX;
    var playerY;
    var rSpawn = rngA(100);
    var merchSpawn = rngA(100);
    var cdfSpawn = rngA(100);
	while(cdfSpawn==merchSpawn||cdfSpawn==rSpawn||rSpawn==merchSpawn){
		rSpawn = rngA(100);
		merchSpawn = rngA(100);
		cdfSpawn = rngA(100);
	}
    var fixArea = [];
    var area = [];
    var counter = 0;
    for (var yy = 0; yy < 10; yy++) {
        for (var xx = 0; xx < 10; xx++) {
            counter++;
            var roomGen = {
		    0:0,
		    searched:0,
	    };
		if (counter == rSpawn) {
			roomGen[0]=100;
		} else if (counter == merchSpawn) {
			roomGen[0]=99;
		} else if (counter == cdfSpawn) {
			roomGen[0]=98;
		} else {
			roomGen[0]=rngA(4);
		}
            	fixArea.push(roomGen);
        }
        area.push(fixArea);
        fixArea = [];
    }
for(var ii=0;ii<rngA(20);ii++){
	shopInventory.push(giveRandomWeap());
}
for(var ii=0;ii<rngA(10);ii++){
	shopArmor.push(randomArmor());
}
var createNewArea=function(){
	area=[];
	shopInventory=[];
	shopArmor=[];
    var merchSpawn = rngA(100);
    var cdfSpawn = rngA(100);
	while(cdfSpawn==merchSpawn){
		merchSpawn = rngA(100);
		cdfSpawn = rngA(100);
	}
    	var fixArea = [];
    	var counter = 0;
	for (var yy = 0; yy < 10; yy++) {
		for (var xx = 0; xx < 10; xx++) {
			counter++;
			var roomGen = {
				0:0,
				searched:0,
			};
			//Create an object of a random length for the shopkeepers inventory
			if (counter == rSpawn) {
				roomGen[0]=100;
			} else if (counter == merchSpawn) {
				roomGen[0]=99;
			} else if (counter == cdfSpawn) {
				roomGen[0]=98;
			} else {
				roomGen[0]=rngA(4);
			}
			fixArea.push(roomGen);
		}
		area.push(fixArea);
		fixArea = [];
	}
	for(var ii=0;ii<rngA(20);ii++){
		shopInventory.push(giveRandomWeap());
	}
	for(var ii=0;ii<rngA(10);ii++){
		shopArmor.push(randomArmor());
	}
};
    /*
for(var y=0; y<area.length;y++){
	for(var x=0; x<area[y].length;x++){
		for(var i=1; i<4;i++){
			if(area[y][x][1][0][0]==area[y][x][1][4-i][0]){
				area[y][x][1][0][1]+=1;
				area[y][x][1][4-i][1]=0;
				area[y][x][1][4-i][0]=0;
			}
			if(area[y][x][1][1][0]==area[y][x][1][4-i][0]){
				area[y][x][1][1][1]+=1;
				area[y][x][1][4-i][1]=0;
				area[y][x][1][4-i][0]=0;
			}
			if(area[y][x][1][2][0]==area[y][x][1][4-i][0]){
				area[y][x][1][2][1]+=1;
				area[y][x][1][4-i][1]=0;
				area[y][x][1][4-i][0]=0;
			}
			if(area[y][x][1][3][0]==area[y][x][1][4-i][0]){
				area[y][x][1][3][1]+=1;
				area[y][x][1][4-i][1]=0;
				area[y][x][1][4-i][0]=0;
			}
		}
	}
}
*/
    for (var y = 0; y < area.length; y++) {
        for (var x = 0; x < area[y].length; x++) {
            if (area[y][x][0] === 100) {
                playerX = x;
                playerY = y;
            }
        }
    }


}
//Enemy Stat Boosts
{
    var smart = [
        "Smart ",
        0, [],
        0,
        8,
        2,
    ];
    var agile = [
        "Agile ",
        0, [],
        10,
        10,
        3,
    ];
    var tough = [
        "Tough ",
        40, [],
        0,
        15,
        5,
    ];


    var enBoosts = [
        smart,
        agile,
        tough,
    ];
    var legendary = [
        "Legendary ",
        50, [],
        20,
        50,
        20,
    ];
}
//Enemy List
{
    var turn = 1;
    var goon = [
        "Goon", //Name
        45, //HP
        giveRandomWeap(), //Item
        85, //Chance to hit
        10, //XP
        10, //Damage
    ];
    var savage = [
        "Savage", //Name
        55, //HP
        giveRandomWeap(), //Item
        85, //Chance to hit
        10, //XP
        10, //Damage
    ];
    var psycho = [
        "Psycho", //Name
        65, //HP
        giveRandomWeap(), //Item
        85, //Chance to hit
        10, //XP
        10, //Damage
    ];
    var enList = [
	goon,
	savage,
	psycho,
    ];

    function Enemy() {
        var enStatBoost = enBoosts[rngA(enBoosts.length - 1)];
        var rndEnemy = enList[rngA(enList.length - 1)];
        var boostPrcnt = rngA(100);
        var retEnemy = [];
        for (var i = 0; i < enList[0].length; i++) {
            if (boostPrcnt < 25) {
                if (i === 2) {
                    retEnemy[2] = giveRandomWeap();
                } else if (i !== 5) {
                    retEnemy[i] = enStatBoost[i] + rndEnemy[i];
                } else if (i === 5) {
                    retEnemy[5] = enStatBoost[5] + rndEnemy[5] + retEnemy[2].damage;
                }
            } else if (boostPrcnt > 30) {
                if (i === 2) {
                    retEnemy[2] = giveRandomWeap();
                } else if (i !== 5) {
                    retEnemy[i] = rndEnemy[i];
                } else if (i === 5) {
                    retEnemy[5] = rndEnemy[5] + retEnemy[2].damage;
                }
            } else if (boostPrcnt >= 25 && boostPrcnt <= 30) {
                if (i === 2) {
                    retEnemy[2] = giveRandomWeap();
                } else if (i !== 5) {
                    retEnemy[i] = legendary[i] + rndEnemy[i];
                } else if (i === 5) {
                    retEnemy[5] = legendary[5] + rndEnemy[5] + retEnemy[2].damage;
                }
            }
		
        }
	retEnemy.defense=createDefense(randomDef());
        return retEnemy;
    };
    // End Enemy List
}
var encounteredEnemy;
var enterBattle = 0;

function encounter() {
    var enc = rngA(100);
    if (enc < 25) {
        encounteredEnemy = Enemy();
        enterBattle = 1;
    }
    if (enc >= 25 && enc <= 100) {
        enterBattle = 0;
    }
    if (enterBattle == 1) {
	var newElement=document.createElement('p');
	    newElement.class="speakable";
	    newElement.innerHTML=">"+"You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5];
	    $(newElement).insertAfter("#place_holder").hide().fadeIn(1000);
        //alert("You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5]);
        //console.log("You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5]);
    }
};
//Items
{
    var item1;
    var item2;
    var item3;
    var item4;
    var item5;
    var item6;
    var item7;
    //End Items
}
//SPECIAL Variables
var BaseS = document.getElementById('baseS');
var BaseP = document.getElementById('baseP');
var BaseE = document.getElementById('baseE');
var BaseC = document.getElementById('baseC');
var BaseI = document.getElementById('baseI');
var BaseA = document.getElementById('baseA');
var BaseL = document.getElementById('baseL');
var BaseDD = document.getElementById('baseD');
var totalP;
var htmTP = document.getElementById("totalP");
var hideIt = document.getElementById("assignPoints");


//For calling upon  stats @ start game

function startSPECIAL() {
    BaseS = document.getElementById('baseS');
    BaseP = document.getElementById('baseP');
    BaseE = document.getElementById('baseE');
    BaseC = document.getElementById('baseC');
    BaseI = document.getElementById('baseI');
    BaseA = document.getElementById('baseA');
    BaseL = document.getElementById('baseL');
    BaseDD = document.getElementById('baseD');
};
//Are you SPECIAL?
{
    var defenceStat = 0;
    setInterval(function() {
        if (updatingSPEC == true) {
            BaseS = document.getElementById('baseS');
            BaseP = document.getElementById('baseP');
            BaseE = document.getElementById('baseE');
            BaseC = document.getElementById('baseC');
            BaseI = document.getElementById('baseI');
            BaseA = document.getElementById('baseA');
            BaseL = document.getElementById('baseL');
            BaseDD = document.getElementById('baseD');
            defenceStat = Math.floor(((BaseS.valueAsNumber / 1.5) + (BaseE.valueAsNumber / 2)) * 5);
            document.getElementById('baseD').innerHTML = "Defence:" + defenceStat.toString();
            BaseS.min = 1;
            BaseP.min = 1;
            BaseE.min = 1;
            BaseC.min = 1;
            BaseI.min = 1;
            BaseA.min = 1;
            BaseL.min = 1;
            totalP = 28 - (BaseS.valueAsNumber + BaseP.valueAsNumber + BaseE.valueAsNumber + BaseC.valueAsNumber + BaseI.valueAsNumber + BaseA.valueAsNumber + BaseL.valueAsNumber);
            if (BaseS.value == "") {
                BaseS.value = 1;
            }
            if (BaseP.value == "") {
                BaseP.value = 1;
            }
            if (BaseE.value == "") {
                BaseE.value = 1;
            }
            if (BaseC.value == "") {
                BaseC.value = 1;
            }
            if (BaseI.value == "") {
                BaseI.value = 1;
            }
            if (BaseA.value == "") {
                BaseA.value = 1;
            }
            if (BaseL.value == "") {
                BaseL.value = 1;
            }
            //S valueAsNumber fix
            if (BaseS.valueAsNumber < 0) {
                BaseS.value = 1;
            }
            if (BaseP.valueAsNumber < 0) {
                BaseP.value = 1;
            }
            if (BaseE.valueAsNumber < 0) {
                BaseE.value = 1;
            }
            if (BaseC.valueAsNumber < 0) {
                BaseC.value = 1;
            }
            if (BaseI.valueAsNumber < 0) {
                BaseI.value = 1;
            }
            if (BaseA.valueAsNumber < 0) {
                BaseA.value = 1;
            }
            if (BaseL.valueAsNumber < 0) {
                BaseL.value = 1;
            }
            //Over powering fix
            if (BaseS.valueAsNumber > totalP - 1) {
                BaseS.max = totalP;
            }
            if (BaseP.valueAsNumber > totalP - 1) {
                BaseP.max = totalP;
            }
            if (BaseE.valueAsNumber > totalP - 1) {
                BaseE.max = totalP;
            }
            if (BaseC.valueAsNumber > totalP - 1) {
                BaseC.max = totalP;
            }
            if (BaseI.valueAsNumber > totalP - 1) {
                BaseI.max = totalP;
            }
            if (BaseA.valueAsNumber > totalP - 1) {
                BaseA.max = totalP;
            }
            if (BaseL.valueAsNumber > totalP - 1) {
                BaseL.max = totalP;
            }
            //
            if (BaseS.valueAsNumber > 10) {
                BaseS.valueAsNumber = 1;
            }
            if (BaseP.valueAsNumber > 10) {
                BaseP.valueAsNumber = 1;
            }
            if (BaseE.valueAsNumber > 10) {
                BaseE.valueAsNumber = 1;
            }
            if (BaseC.valueAsNumber > 10) {
                BaseC.valueAsNumber = 1;
            }
            if (BaseI.valueAsNumber > 10) {
                BaseI.valueAsNumber = 1;
            }
            if (BaseA.valueAsNumber > 10) {
                BaseA.valueAsNumber = 1;
            }
            if (BaseL.valueAsNumber > 10) {
                BaseL.valueAsNumber = 1;
            }
            BaseS.max = 10;
            BaseP.max = 10;
            BaseE.max = 10;
            BaseC.max = 10;
            BaseI.max = 10;
            BaseA.max = 10;
            BaseL.max = 10;
            htmTP.innerHTML = totalP;

            if (totalP < 0) {
                BaseS.valueAsNumber = 1;
                BaseP.valueAsNumber = 1;
                BaseE.valueAsNumber = 1;
                BaseC.valueAsNumber = 1;
                BaseI.valueAsNumber = 1;
                BaseA.valueAsNumber = 1;
                BaseL.valueAsNumber = 1;
            }
            if (totalP === 0 && clickedButton) {
		Class=document.getElementById('backgroundSelection').value;
                updatingSPEC = false;
            }
        } else {
            hideIt.hidden = true;
        }
    }, 10);
}
//Game Machinecs
{
    setInterval(function() {
        equippedWeapon = equipItem;
    }, 10);
    CurrentHealth = 100;
    setInterval(function() {
        curDmg = equippedWeapon.damage;
	    if(Class==="Doctor"){
		HealAmount = Math.round(((BaseI.valueAsNumber * 5) + 20)*1.4);
	    }else{
        	HealAmount = ((BaseI.valueAsNumber * 5) + 20);
	    }
        StimDropRate = ((BaseL.valueAsNumber / 5) + 1) * 10;
        MaxedHealth = ((BaseE.valueAsNumber * 10) + 100);
        var headledMessage = document.getElementById("useBandage");
        headledMessage.innerHTML = "> Bandage used " + HealAmount + " HP healed.";
    }, 10);
}
//Stat Changes During game
{



    var htmSA = document.getElementsByClassName("htmS");
    var htmPA = document.getElementsByClassName("htmP");
    var htmEA = document.getElementsByClassName("htmE");
    var htmCA = document.getElementsByClassName("htmC");
    var htmIA = document.getElementsByClassName("htmI");
    var htmAA = document.getElementsByClassName("htmA");
    var htmLA = document.getElementsByClassName("htmL");
    var htmDA = document.getElementsByClassName("htmD");
    var htmCurrentHealth = document.getElementsByClassName("htmHealth");
    var htmCaps = document.getElementsByClassName("playerCaps");

    function updateStats() {
        defenceStat = Math.floor(((BaseS.valueAsNumber / 1.5) + (BaseE.valueAsNumber / 2)) * 5);
        for (var i = 0; i < htmSA.length; i++) {
            htmSA[i].innerHTML = "Strength:.............." + BaseS.value;
            htmPA[i].innerHTML = "Perception:............" + BaseP.value;
            htmEA[i].innerHTML = "Endurance:............." + BaseE.value;
            htmCA[i].innerHTML = "Charisma:.............." + BaseC.value;
            htmIA[i].innerHTML = "Intelligence:.........." + BaseI.value;
            htmAA[i].innerHTML = "Agility:..............." + BaseA.value;
            htmLA[i].innerHTML = "Luck:.................." + BaseL.value;
            htmDA[i].innerHTML = "Defence:..............." + defenceStat.toString();
            htmCurrentHealth[i].innerHTML = "Current Health:........" + CurrentHealth + "/" + MaxedHealth;
            htmCaps[i].innerHTML = "Shekels................" + currentCaps;
            htmTP.innerHTML = totalP;
        }
    };
    //End ingame stat changes
}
//Notes on enemies
{

    //Enemy Tiers
    //String[1] LowEnemies = {"Feral Goon","Savage","Psycho","Rabid Stag","Rookie Hitman"};
    //var LowEnemyMaxHealth = 25;
    //var LowEnemyMaxDmg = 7; 
    //String[2] MidEnemies = {"Irradiated Stag","Irradiated Bear","Amateur Hitman"};
    //var MidEnemyMaxHealth = 50;
    //var MidEnemyMaxDmg =  15; 
    //String[3] HighEnemies = {"Human Hunter","Alpha Wolf","Alpha Stag","Alpha Bear","Professional Hitman"};
    //var HighEnemyMaxHealth = 100;
    //var HighEnemyMaxDmg = 25; 

    //end notes
}
setInterval(function(){
	var isDead=false;
	if(enterBattle==1){
		if(turn===-1){
			if(encounteredEnemy[1]>0){
				var tempBRNG=rngA(100);
				if(tempBRNG>(30+(BaseA.valueAsNumber*2)+(floor(BaseL.valueAsNumber*1.5)))){	//You get attacked
					var damageTaken=calculateDamage(encounteredEnemy[2],playerRes);
					if(damageTaken<0){
						damageTaken=0;
					}
					CurrentHealth-=damageTaken;
					var newElement2=document.createElement('p');
					newElement2.class="speakable";
					newElement2.innerHTML=">"+"You were hit by the "+encounteredEnemy[0]+" with a "+encounteredEnemy[2].name+" for "+damageTaken+" damage.";
					$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
				}else{
					var newElement2=document.createElement('p');
					newElement2.class="speakable";
					newElement2.innerHTML=">"+encounteredEnemy[0]+" missed.";
					$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
				}
			}else{
				var newElement2=document.createElement('p');
				newElement2.class="speakable";
				newElement2.innerHTML=">You killed the "+encounteredEnemy[0]+".";
				$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
				currentXP+=encounteredEnemy[4];
				if(!overEncumberedItem){
					addWeapon(encounteredEnemy[2]);
				}
				enterBattle=0;
				turn=1;
			}
			if(CurrentHealth<0&&!isDead){
				var lastwords=prompt("YOU DIED!\nAny final words?","");
				var thisUser=firebase.auth().currentUser.uid;
				firebase.database().ref('deathMessages/'+thisUser+'/'+playerY+'/'+playerX).set({
					deathText:lastwords.toString()
				});
				closePage();
			}
			turn*=-1;
		}else{
			if(CurrentHealth<0&&!isDead){
				var lastwords=prompt("YOU DIED!\nAny final words?","");
				var thisUser=firebase.auth().currentUser.uid;
				firebase.database().ref('deathMessages/'+thisUser+'/'+playerY+'/'+playerX).set({
					deathText:lastwords.toString()
				});
				closePage();
			}	
		}
	}else{
		if(CurrentHealth<0&&!isDead){
			var lastwords=prompt("YOU DIED!\nAny final words?","");
			var thisUser=firebase.auth().currentUser.uid;
				firebase.database().ref('deathMessages/'+thisUser+'/'+playerY+'/'+playerX).set({
					deathText:lastwords.toString()
				});
			closePage();
		}
	}
},10);

    //"You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5]
    /** 
     * Reserved for combat
     **/

setInterval(function() {
    $('blink').each(function() {
        $(this).css('visibility', $(this).css('visibility') === 'hidden' ? '' : 'hidden')
    });
}, 250);

function updateText() {
    var inText = document.getElementById("command_line").value;
    var dispText = document.getElementById("dispText");
    var blinking = document.getElementById("blinking").innerHTML;
    dispText.innerHTML = blinking + inText;
}; { //Room Message
    function room() {
        canTrade = false;
        if (area[playerY][playerX][0] == 99) {
            canTrade = true;
            $("#message_room99").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
        } else if (area[playerY][playerX][0] == 98) {
            $("#message_room98").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
        } else if (area[playerY][playerX][0] == 5) {
            $("#message_vaultReturn").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
        } else {
            $("#message_room"+(area[playerY][playerX][0]+1)).clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
        }
    };
}
var inventory = document.getElementById('messageInventory');

function checkItem() {
	if(area[playerY][playerX].searched<1+fourI && (!overEncumberedItem || !overEncumberedArmor)){
		tick(2);
		this.foundSomething=false;
		this.foundItems=[];
		this.foundCaps=false;
		this.capsFound=0;
		this.armorFound=[];
		this.foundArmor=false;
		this.ammoFound=clone(ammoTypes);
		this.foundAmmo=false;
		this.foundMat=false
		this.matFound=[];
		for(var i = 0; i < rngA(4+irish); i++){
			if(rngA(100)<30+(irish*5)){
				if(!overEncumberedItem){
					var disItem=giveRandomWeap();
					this.foundItems.push(disItem);
					addWeapon(disItem);
				}
			}
		}
		for(var i = 0; i < rngA(4+irish); i++){
			if(rngA(100)<25+(irish*5)){
				if(!overEncumberedArmor){
					var newArmor=randomArmor();
					addArmor(newArmor);
					this.foundSomething=true;
					this.foundArmor=true;
					this.armorFound.push(newArmor);
				}
			}
		}
		for(var i = 0; i < rngA(4+irish); i++){
			if(rngA(100)<35+(irish*5)){
				var newAmmo = randomPName(ammoTypes);
				var j=rngA(20)+1;
				ammo[newAmmo].amount+=j;
				this.ammoFound[newAmmo]=j;
				this.foundAmmo=true;
				this.foundSomething=true;
			}
		}
		for(var i = 0; i < rngA(4+irish); i++){
			if(rngA(100)<30+(irish*5)){
				var newMat = randomPName(materialInventory);
				var j=rngA(3)+1;
				materialInventory[newMat].amount+=j;
				this.matFound[newMat]=j;
				this.foundMat=true;
				this.foundSomething=true;
			}
		}
		for(var i = 0; i < rngA(2+irish);i++){
			if(rngA(100)<20+(irish*5)){
				var irishMod = 0;
				if(irish==1){
					irishMod=0.2;
				}else if(irish==2){
					irishMod=0.5;
				}
				this.capsFound+=Math.floor((rngA(30)+1)*(1+(irishMod)));
				this.foundCaps=true;
			}
		}
		if(this.foundItems.length>0 || this.foundCaps){
			this.foundSomething=true;
		}
		if(!this.foundSomething){
			$("#message_nothing").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
			area[playerY][playerX].searched++;
			return;
		}else{
			if(this.foundItems.length>0){
				var newElement2=document.createElement('p');
				newElement2.class="speakable";
				var itemsFound="";
				for(var i = 0;i<this.foundItems.length;i++){
					if(this.foundItems.length == 1){
						itemsFound+=this.foundItems[i].name;
					}else if(i == this.foundItems.length-1){
						itemsFound+=this.foundItems[i].name;
					}else{
						itemsFound+=this.foundItems[i].name+" and ";
					}
				}
				newElement2.innerHTML=">You found "+itemsFound+".";
				$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
			}
			if(this.armorFound.length>0){
				var newElement2=document.createElement('p');
				newElement2.class="speakable";
				var armorString="";
				for(var i = 0;i<this.armorFound.length;i++){
					if(this.armorFound.length==1){
						armorString+=this.armorFound[i].name;
					}else if(i == this.armorFound.length-1){
						armorString+=this.armorFound[i].name;
					}else{
						armorString+=this.armorFound[i].name+" and ";
					}
				}
				newElement2.innerHTML=">You found "+armorString+".";
				$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
			}
			if(this.foundAmmo){
				var newElement2=document.createElement('p');
				newElement2.class="speakable";
				var ammoString="";
				var ammoCount=0;
				var ammoC=0;
				for(var i in this.ammoFound){
					if(this.ammoFound[i]>0){
						ammoCount++;
					}
				}
				for(var i in this.ammoFound){
					if(this.ammoFound[i]>0){
						if(ammoCount == 1){
							ammoString+=this.ammoFound[i]+" "+i+" ammo";
							console.log("a".ammoC);
						}else if(ammoC == ammoCount-1){
							ammoString+=this.ammoFound[i]+" "+i+" ammo";
							console.log("b",ammoC);
						}else{
							ammoString+=+this.ammoFound[i]+" "+i+" ammo and ";
						}
						ammoC++;
					}
				}
				newElement2.innerHTML=">You found "+ammoString+".";
				$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
			}
			if(this.foundMat){
				var newElement2=document.createElement('p');
				newElement2.class="speakable";
				var matString="";
				var matCount=0;
				var matC=0;
				for(var i in this.matFound){
					if(this.matFound[i]>0){
						matCount++;
					}
				}
				for(var i in this.matFound){
					if(this.matFound[i]>0){
						if(matCount == 1){
							matString+=this.matFound[i]+" "+materialInventory[i].name;
						}else if(matC == matCount-1){
							matString+=this.matFound[i]+" "+materialInventory[i].name;
						}else{
							matString+=+this.matFound[i]+" "+materialInventory[i].name+" and ";
						}
						matC++;
					}
				}
				newElement2.innerHTML=">You found "+matString+".";
				$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
			}
			if(this.foundCaps){
				var newElement2=document.createElement('p');
				currentCaps+=this.capsFound;
				newElement2.class="speakable";
				newElement2.innerHTML=">You found "+this.capsFound+" Shekels.";
				$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
			}
		}
		area[playerY][playerX].searched++;
	}else{
		if(overEncumberedItem && overEncumberedArmor){
			var newElement2=document.createElement('p');
			newElement2.class="speakable";
			newElement2.innerHTML=">You are unable to hold any more weapons or armor, drop a few or sell them.";
			$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
		}else if(overEncumberedItem && (area[playerY][playerX].searched<1+fourI)){
			var newElement2=document.createElement('p');
			newElement2.class="speakable";
			newElement2.innerHTML=">You are unable to hold any more weapons, drop a few or sell them.";
			$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
		}else if(overEncumberedArmor && (area[playerY][playerX].searched<1+fourI)){
			var newElement2=document.createElement('p');
			newElement2.class="speakable";
			newElement2.innerHTML=">You are unable to hold any more armor, drop a few or sell them.";
			$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
		}else if(!(area[playerY][playerX].searched<1+fourI)){
			var newElement2=document.createElement('p');
			newElement2.class="speakable";
			newElement2.innerHTML=">There is nothing else to be found here.";
			$(newElement2).insertAfter("#place_holder").hide().fadeIn(1000);
		}
	}
};
var itemBefore = "";
var itemAfter = "";
//area[playerY][playerX][1][i][0]

function updateInventory() {
    itemBefore = "";
    itemAfter = "";
    for (var i = 0; i < playerInventory.capacity; i++) {
	    if(!playerInventory[i].empty){
        	itemBefore = "ID: "+i+" || Name: "+playerInventory[i].name + " || Damage: " + playerInventory[i].damage + " || Value: " + playerInventory[i].value + " Shekels"+"<br>";
		for(var j in playerInventory[i].attachments){
			if(playerInventory[i].attachments[j].canAdd){
				itemBefore +=">\t\tSlot: "+playerInventory[i].attachments[j].slotName+"<br>";
				itemBefore +=">\t\t\tName: "+playerInventory[i].attachments[j].att.name+"<br>";
			}
		}
        	itemAfter = itemAfter + itemBefore;
	    }
        inventory.innerHTML = itemAfter;
    }
};
function jonAndAndrewArePicky(direction,boi){
	var movement={
		left:["left","w","west"],
		right:["right","e","east"],
		up:["up","n","north"],
		down:["down","s","south"],
		any:["down","s","south","up","n","north","right","e","east","left","w","west"],
	};
	var direction=direction||"left";
	var pref=boi||"n";
	if(movement[direction].includes(pref)){
		return true;
	}else{
		return false;
	}
}
var sayMyName = document.getElementById('dispName'); { //Inputs and Commands

    setInterval(updateText(), 10);
    setInterval(updateStats(), 10);
    setInterval(updateInventory(), 10);

    function dispInv() {
        updateInventory();
        document.getElementById('messageInventory').innerHTML = itemAfter;
        $("#messageInventory").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
    };

    function dispStats() {
        updateStats();
        $("#display_stats").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
    };
    var newInput;
    var i = 0;

    var prefixList = ["equip", "inventory", "use", "look", "go", "help", "take", "stats", "read", "done", "buy", "sell", "attack", "burst", "farm"];
    var prefixList2 = ["note", "stick", "north", "west", "east", "south", "left", "right", "up", "down", "around", "bandage", "2", "3", "4", "5", "6", "help", "open"];
    var prefixInputCheck = function() {
        this.check = true;
        for (var i = 0; i < prefixList.length; i++) {
            if (prefix.toLowerCase() === prefixList[i] && this.check === true) {
                this.check = false;
            }
        }
        if (this.check === true) {
            return true;
        } else {
            return false;
        }
    };
    var itemInputCheck = function() {
        this.check = true;
        for (var i = 0; i < prefixList2.length; i++) {
            if (item.toLowerCase() === prefixList2[i] && this.check === true) {
                this.check = false;
            }
        }
        if (this.check === true) {
            return true;
        } else {
            return false;
        }
    };
    var weapInputCheck = function() {
        if(parseInt(item)>playerInventory.capacity){
		return false;
	}else{
		return true;
	}
    };
    var checkData=function(){
        var appendedConfirmText="";
        var savedData=function(){getData("gamedata");return loadedData};
        for(var storageLength in savedData){
            if(storageLength=="playerName"||storageLength=="stats"||storageLength=="inventory"||storageLength=="currentCaps"){
                if(storageLength=="inventory"){
                    for(var invLength = 0; invLength < savedData.inventory.length; invLength++){
                        appendedConfirmText+="\n"+savedData[storageLength][invLength][1]+" "+savedData[storageLength][invLength][0].name+": "+savedData[storageLength][invLength][0].value+" shekels";
                    }
                }else if(storageLength=="stats"){
                    for(var statLength in savedData[storageLength]){
                        appendedConfirmText+="\n"+statLength+": "+savedData[storageLength][statLength];
                    }
                }else{
                    appendedConfirmText+="\n"+storageLength+": "+savedData[storageLength];
                }
            }
        }
        return appendedConfirmText;
    };
    var saveGame=function(){
        if(checkStorage()){
            if(confirm("Overwrite current game data?"+checkData())){
                var gameData={};
		gameData.area=area;
		gameData.playerX=playerX;
		gameData.playerY=playerY;
		gameData.playerInventory=playerInventory;
		gameData.currentCaps=currentCaps;
		gameData.playerName=playerName;
		gameData.textHistory=document.getElementById('console').innerHTML;
		gameData.stats={};
		gameData.stats.Strength=BaseS.valueAsNumber;
		gameData.stats.Perception=BaseP.valueAsNumber;
		gameData.stats.Endurance=BaseE.valueAsNumber;
		gameData.stats.Charisma=BaseC.valueAsNumber;
		gameData.stats.Intelligence=BaseI.valueAsNumber;
		gameData.stats.Agility=BaseA.valueAsNumber;
		gameData.stats.Luck=BaseL.valueAsNumber;
		gameData.foodStuff=foodStuff;
		gameData.cdf=cdf;
		gameData.perkTree=perkTree;
		gameData.ammo=ammo;
		gameData.harvestList=harvestList;
		gameData.hunger=hunger;
		gameData.playerLevel=playerLevel;
		gameData.currentXP=currentXP;
		gameData.xpNeeded=xpNeeded;
		gameData.equippedWeapon=equippedWeapon;
		gameData.equipItem=equipItem;
		gameData.skillPoints=skillPoints;
		gameData.totalP=totalP;
		gameData.CurrentHealth=CurrentHealth;
		gameData.Class=Class;
		gameData.equippedArmor=equippedArmor;
		gameData.armorInventory=armorInventory;
		gameData.materialInventory=materialInventory;
		gameData.attachmentInventory=attachmentInventory;
		gameData.maxHunger=maxHunger;
		firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
			gamedata: gameData
		});
            }
        }else{
            var gameData={};
		gameData.area=area;
		gameData.playerX=playerX;
		gameData.playerY=playerY;
		gameData.playerInventory=playerInventory;
		gameData.currentCaps=currentCaps;
		gameData.playerName=playerName;
		gameData.textHistory=document.getElementById('console').innerHTML;
		gameData.foodStuff=foodStuff;
		gameData.cdf=cdf;
		gameData.perkTree=perkTree;
		gameData.ammo=ammo;
		gameData.harvestList=harvestList;
		gameData.playerLevel=playerLevel;
		gameData.currentXP=currentXP;
		gameData.xpNeeded=xpNeeded;
		gameData.hunger=hunger;
		gameData.equippedWeapon=equippedWeapon;
		gameData.equipItem=equipItem;
		gameData.skillPoints=skillPoints;
		gameData.stats={};
		gameData.stats.Strength=BaseS.valueAsNumber;
		gameData.stats.Perception=BaseP.valueAsNumber;
		gameData.stats.Endurance=BaseE.valueAsNumber;
		gameData.stats.Charisma=BaseC.valueAsNumber;
		gameData.stats.Intelligence=BaseI.valueAsNumber;
		gameData.stats.Agility=BaseA.valueAsNumber;
		gameData.stats.Luck=BaseL.valueAsNumber;
		gameData.totalP=totalP;
		gameData.CurrentHealth=CurrentHealth;
		gameData.Class=Class;
		gameData.equippedArmor=equippedArmor;
		gameData.armorInventory=armorInventory;
		gameData.materialInventory=materialInventory;
		gameData.attachmentInventory=attachmentInventory;
		gameData.maxHunger=maxHunger;
		firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
			gamedata: gameData
		});
        }
    };
    var loadGame=function(){
        if(checkStorage()){
		getData("gamedata");
            var loadData=loadedData;
		updatingSPEC=false;
		area=loadData.area;
		playerX=loadData.playerX;
		playerY=loadData.playerY;
		playerInventory=loadData.playerInventory;
		currentCaps=loadData.currentCaps;
		playerName=loadData.playerName;
		BaseS.value=loadData.stats.Strength;
		BaseP.value=loadData.stats.Perception;
		BaseE.value=loadData.stats.Endurance;
		BaseC.value=loadData.stats.Charisma;
		BaseI.value=loadData.stats.Intelligence;
		BaseA.value=loadData.stats.Agility;
		BaseL.value=loadData.stats.Luck;
		CurrentHealth=loadData.CurrentHealth;
		jQuery.extend(foodStuff,loadData.foodStuff);
		cdf=loadData.cdf;
		jQuery.extend(perkTree,loadData.perkTree);
		hunger=loadData.hunger;
		jQuery.extend(ammo,loadData.ammo);
		harvestList=loadData.harvestList;
		playerLevel=loadData.playerLevel;
		currentXP=loadData.currentXP;
		xpNeeded=loadData.xpNeeded;
		equippedWeapon=loadData.equippedWeapon;
		equipItem=loadData.equipItem;
		Class=loadData.Class;
		skillPoints=loadData.skillPoints;
		setMaxCrops(loadData.cdf.plantLimit);
		done=1;
		document.getElementById('command_line').value=loadData.playerName;
		$("form").submit();
		document.getElementById('console').innerHTML=loadData.textHistory;
		BaseS.value=loadData.stats.Strength;
		BaseP.value=loadData.stats.Perception;
		BaseE.value=loadData.stats.Endurance;
		BaseC.value=loadData.stats.Charisma;
		BaseI.value=loadData.stats.Intelligence;
		BaseA.value=loadData.stats.Agility;
		BaseL.value=loadData.stats.Luck;
		Class=loadData.Class;
		equippedArmor=loadData.equippedArmor;
		armorInventory=loadData.armorInventory;
		materialInventory=loadData.materialInventory;
		attachmentInventory=loadData.attachmentInventory;
		maxHunger=loadData.maxHunger;
        }else{
            alert("No save data available.");
        }
    };
    var removeGameData=function(){
        if(checkStorage()){
            if(confirm("Are you sure you want to delete you save data?"+checkData())){
                firebase.database().ref('/users/' + firebase.auth().currentUser.uid+"/gamedata").remove();
                alert('Save data deleted.');
            }
        }else{
            alert("No save data available.");
        }
    };
    /**
     * Reserved for combat
    **/
    if(enableCombat){
        eval("var inCombat=function(){}");
    }
    //"You encountered a " + encounteredEnemy[0] + ". Stats: Health: " + encounteredEnemy[1] + ", Item: " + encounteredEnemy[2].name + ", Chance to hit: " + encounteredEnemy[3] + ", XP: " + encounteredEnemy[4] + ", Damage: " + encounteredEnemy[5]
    /** 
     * Reserved for combat
     **/
    $(document).ready(function() {
        $("#console").hide().fadeIn(1000);
        $("form").submit(function() {
            sellCheck = false;
            stopCounting = false;
            j = 0;
            var i = 0;
            var input = newInput;
            for (var i = 0; i < input.length; i++) {
                if (input.substr(i, 1) == " " && stopCounting == false) {
                    j = i;
                    stopCounting = true;
                } else {
                    if (input.substr(i, 1) !== " " && stopCounting == false) {
                        j += 1;
                    }
                }
            }
            prefix = input.substr(0, j);
            item = input.substr(j + 1, input.length);
            if (done !== 1) {
                playerName = input;
                startMSG.innerHTML = '>' + playerName + ' messed up this time, the overseer walked in on ' + playerName + ' sleeping with his daughter.\n' + 'That salty old ******* is kicking ' + playerName + ' out into the wasteland to be. As ' + playerName + ' approached\n' + 'the vault door. A dim beam of light from a crack in ceiling reveals a a wooden stick\n' + 'on the floor next to a note with the name ' + playerName + ' on it...';
                document.getElementById('start').hidden = false;
                sayMyName.innerHTML += playerName;
                done = 1;
            } else {
                if (prefix.toLowerCase() == "help") {
                    $("#message_help").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                }
                if (prefix.toLowerCase() == "read") {
                    if (item.toLowerCase() == "note" && note1 == true) {
                        $("#message_readnote1").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                    }
                }
                if (prefix.toLowerCase() == "look") {
                    if (item.toLowerCase() == "around") {
                        checkItem();
			/*
			for(var i in globalXY){
				var deathRNG=rngA(Object.keys(globalXY[i]).length);
				if(deathRNG===rngA(Object.keys(globalXY[playerY][playerX]).length)){
					if(globalXY[playerY][playerX][i].deathText!==undefined){
						var checkDeadPlayer=function(){
							if(getPlayername(i)!=="undefined" && getPlayername(i)!=="null" && getPlayername(i)!==undefined && getPlayername(i)!==null){
								return true;
							}else{
								return false;
							}
						};
						setInterval(function(){
							getPlayername(i);
						},10,checkDeadPlayer());
						if(checkDeadPlayer()){
							var newElement4=document.createElement('p');
							newElement4.class="speakable";
							newElement4.innerHTML=">"+getPlayername(i)+": "+globalXY[playerY][playerX][i].deathText+".";
							$(newElement4).insertAfter("#place_holder").hide().fadeIn(1000);
						}
					}else{
						var newElement4=document.createElement('p');
						newElement4.class="speakable";
						newElement4.innerHTML=">No signs of other players.";
						$(newElement4).insertAfter("#place_holder").hide().fadeIn(1000);
					}
				}
			}
			*/
                    }
                }
                if (prefix.toLowerCase() == "take") {
                    if (item.toLowerCase() == "note" && area[playerY][playerX][0] === 100 && note1 == false) {
                        note1 = true;
                        $("#message_takenote1").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                    }
                    if (item.toLowerCase() == "") {
                        $("#message_take").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                    }
                }
                if (prefix.toLowerCase() == "inventory") {
                    dispInv();
                }
                if(enterBattle==0){
                    if (prefix.toLowerCase() == "go" || jonAndAndrewArePicky("any",prefix.toLowerCase())) {
                        if (playerY !== 0) {
                            if (item.toLowerCase() == "north" || item.toLowerCase() == "up" || (jonAndAndrewArePicky("up",prefix.toLowerCase()))) {
                                playerY -= 1;
                                room();
				tick(5);
                                if(area[playerY][playerX][0] !== 99 && area[playerY][playerX][0] !== 98){
                                    encounter();
                                }
                            }
                        }else{
                            if (item.toLowerCase() == "north" || item.toLowerCase() == "up" || (jonAndAndrewArePicky("up",prefix.toLowerCase()))) {
				createNewArea();
                                playerY = 9;
                                room();
				tick(5);
                                if(area[playerY][playerX][0] !== 99 && area[playerY][playerX][0] !== 98){
                                    encounter();
                                }
                            }
			}
                        if (playerY !== 9) {
                            if (item.toLowerCase() == "south" || item.toLowerCase() == "down" || (jonAndAndrewArePicky("down",prefix.toLowerCase()))) {
                                playerY += 1;
                                room();
				tick(5);
                                if(area[playerY][playerX][0] !== 99 && area[playerY][playerX][0] !== 98){
                                    encounter();
                                }
                            }
                        }else{
                            if (item.toLowerCase() == "south" || item.toLowerCase() == "down" || (jonAndAndrewArePicky("down",prefix.toLowerCase()))) {
				createNewArea();
                                playerY = 0;
                                room();
				tick(5);
                                if(area[playerY][playerX][0] !== 99 && area[playerY][playerX][0] !== 98){
                                    encounter();
                                }
                            }
			}
                        if (playerX !== 9) {
                            if (item.toLowerCase() == "east" || item.toLowerCase() == "right" || (jonAndAndrewArePicky("right",prefix.toLowerCase()))) {
                                playerX += 1;
                                room();
				tick(5);
                                if(area[playerY][playerX][0] !== 99 && area[playerY][playerX][0] !== 98){
                                    encounter();
                                }
                            }
                        }else{
                            if (item.toLowerCase() == "east" || item.toLowerCase() == "right" || (jonAndAndrewArePicky("right",prefix.toLowerCase()))) {
				createNewArea();
                                playerX = 0;
                                room();
				tick(5);
                                if(area[playerY][playerX][0] !== 99 && area[playerY][playerX][0] !== 98){
                                    encounter();
                                }
                            }
			}
                        if (playerX !== 0) {
                            if (item.toLowerCase() == "west" || item.toLowerCase() == "left" || (jonAndAndrewArePicky("left",prefix.toLowerCase()))) {
                                playerX -= 1;
                                room();
				tick(5);
                                if(area[playerY][playerX][0] !== 99 && area[playerY][playerX][0] !== 98){
                                    encounter();
                                }
                            }
                        }else{
                            if (item.toLowerCase() == "west" || item.toLowerCase() == "left" || (jonAndAndrewArePicky("left",prefix.toLowerCase()))) {
				createNewArea();
                                playerX = 9;
                                room();
				tick(5);
                                if(area[playerY][playerX][0] !== 99 && area[playerY][playerX][0] !== 98){
                                    encounter();
                                }
                            }
			}
                    }
                }else{
                    if(prefix.toLowerCase() == "flee" && turn !== -1){
                        if(item.toLowerCase() == ""){
                            var tempRNG=rngA(100);
                            if(tempRNG>(70-(BaseA.value*4))){
                                enterBattle=0;
                                turn=1;
				var newElement3=document.createElement('p');
			    	newElement3.class="speakable";
	    			newElement3.innerHTML=">You successfully fled.";
	    			$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
                            }else{
				var newElement3=document.createElement('p');
			    	newElement3.class="speakable";
	    			newElement3.innerHTML=">You failed to flee.";
	    			$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
                                turn*=-1;
                            }
                        }
                    }
                    if(prefix.toLowerCase() == "attack" && turn !== -1){
			if(item.toLowerCase() == ""){
				if(equippedWeapon.type !== "Melee"){
					if(ammo[equippedWeapon.ammoType].amount>0){
						var tempRNG=rngA(100);
						if(tempRNG<=encounteredEnemy[3]+BaseL.valueAsNumber){
							ammo[equippedWeapon.ammoType].amount--;
							var newElement3=document.createElement('p');
							newElement3.class="speakable";
							if(Class == "Soldier"){
								var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
								newElement3.innerHTML=">You hit the "+encounteredEnemy[0]+" for "+(newDamage*1.5)+" damage.";
							}else{
								var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
								newElement3.innerHTML=">You hit the "+encounteredEnemy[0]+" for "+newDamage+" damage.";
							}
							if(equippedWeapon.damage===undefined){
								if(Class==="Soldier"){
									var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
									encounteredEnemy[1]-=Math.round(newDamage*1.5);
								}else{
									var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
									encounteredEnemy[1]-=newDamage;
								}
							}else{
								if(Class==="Soldier"){
									var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
									encounteredEnemy[1]-=Math.round(newDamage*1.5);
								}else{
									var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
									encounteredEnemy[1]-=newDamage;
								}
							}
							$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
							turn*=-1;
						}else{
							var newElement3=document.createElement('p');
							newElement3.class="speakable";
							newElement3.innerHTML=">You missed the "+encounteredEnemy[0]+".";
							$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
							turn*=-1;
						}

					}else{
						var newElement3=document.createElement('p');
						newElement3.class="speakable";
						newElement3.innerHTML=">You ran out of "+equippedWeapon.ammoType+" ammo.";
						$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
					}
				}else{
					var tempRNG=rngA(100);
					if(tempRNG<=encounteredEnemy[3]+BaseL.valueAsNumber){
						var newElement3=document.createElement('p');
						newElement3.class="speakable";
						var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
						newElement3.innerHTML=">You hit the "+encounteredEnemy[0]+" for "+Math.round(newDamage*(1+(strongM/5)))+" damage.";
						encounteredEnemy[1]-=Math.round(newDamage*(1+(strongM/5)));
						$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
						turn*=-1;
					}else{
						var newElement3=document.createElement('p');
						newElement3.class="speakable";
						newElement3.innerHTML=">You missed the "+encounteredEnemy[0]+".";
						$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
						turn*=-1;
					}
				}
			}
                    }
			
                    if(prefix.toLowerCase() == "burst" && turn !== -1){
			    if(equippedWeapon.type.toLowerCase() == "smg"){
                        	if(item.toLowerCase() == "2" || item.toLowerCase() == "3" || item.toLowerCase() == "4" || item.toLowerCase() == "5" || item.toLowerCase() == "6"){
					for(var smgLoop=0;smgLoop<parseInt(item.toLowerCase());smgLoop++){
						if(ammo[equippedWeapon.ammoType].amount>0){
							ammo[equippedWeapon.ammoType].amount--;
							var tempRNG=rngA(100);
							if(tempRNG<=(encounteredEnemy[3]+BaseL.valueAsNumber)-(parseInt(item.toLowerCase())*2)){
								var newElement3=document.createElement('p');
								newElement3.class="speakable";
								if(Class == "Soldier"){
									var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
									newElement3.innerHTML=">You hit the "+encounteredEnemy[0]+" for "+(Math.round(newDamage*1.5))+" damage.";
									encounteredEnemy[1]-=Math.round(newDamage*1.5);
								}else{
									var newDamage=calculateDamage(equippedWeapon,calcRes(encounteredEnemy.defense));
									newElement3.innerHTML=">You hit the "+encounteredEnemy[0]+" for "+newDamage+" damage.";
									encounteredEnemy[1]-=newDamage;
								}
								$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
							}else{
								var newElement3=document.createElement('p');
								newElement3.class="speakable";
								newElement3.innerHTML=">You missed the "+encounteredEnemy[0]+".";
								$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
							}
						}else{
							var newElement3=document.createElement('p');
							newElement3.class="speakable";
							newElement3.innerHTML=">You ran out of "+equippedWeapon.ammoType+" ammo.";
							$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
						}
					}
                                	turn*=-1;
                        	}
		    	}else{
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML=">Equipped weapon is not an SMG.";
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
		    	}
		}
			if (prefix.toLowerCase() == "use" && turn !== -1) {
			    if (item.toLowerCase() == "bandage" && items[7][2] > 0) {
				items[7][2] -= 1;
				$("#useBandage").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
				CurrentHealth = constrain(CurrentHealth+HealAmount,0,MaxedHealth);
				turn*=-1;
			    }
			}
			//Label for EQUIPITEM
			if (prefix.toLowerCase() == "equip" && turn !== -1) {
				if(parseInt(item)<playerInventory.capacity){
			    		for (var i = 0; i < playerInventory.capacity; i++) {
						if (parseInt(item.toLowerCase()) == i) {
							var newElement3=document.createElement('p');
							newElement3.class="speakable";
							newElement3.innerHTML=">You equipped the "+playerInventory[i].name+".";
							$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
						    	equipItem = playerInventory[i];
							turn*=-1;
						}
					}
				}else{
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					newElement3.innerHTML=">Your inventory is not that big.";
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}
			}
                }
                if (prefix.toLowerCase() == "stats") {
                    if (item.toLowerCase() == "") {
                        dispStats();
                    }
                }
                if (prefix.toLowerCase() == "done" && updatingSPEC == true) {
                    if (item.toLowerCase() == "") {
                        $("#display_stats").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                        $("#display_statsDone").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                        updatingSPEC = false;
                    }
                }
		var checkFood=function(itemName){
			var foundFood=false;
			var foodName="";
			for(var foods in foodStuff){
				if(itemName.toLowerCase()==foodStuff[foods].name.toLowerCase() || itemName.toLowerCase()==foodStuff[foods].abbr.toLowerCase()){
					foundFood=true;
					foodName=foods;
				}else if(!foundFood){
					foundFood=false;
				}
			}
			if(foundFood){
				return {found:true,foodName:foodName,};
			}else{
				return {found:false};
			}
		};
		if(prefix.toLowerCase()=="eat"){
			if(checkFood(item).found){
				if(foodStuff[checkFood(item).foodName].amount>0){
					hunger+=foodStuff[checkFood(item).foodName].hungerRestored;
					foodStuff[checkFood(item).foodName].amount-=1;
				}else{
					
					//Does not have any of that food
				}
				//recover 
			}
		}
		if(prefix.toLowerCase() == "scavenge"){
			if(item.toLowerCase() == ""){
				var foundItems={};
				var totalRewards=0;
				for(var foodType in foodStuff){
					var foodQuant=0;
					for(var foundQuantity in foodStuff[foodType].chanceToFind){
						var chanceToFind=foodStuff[foodType].chanceToFind[foundQuantity];
						var rngFound=rngA(100);
						if(rngFound<chanceToFind){
							foodStuff[foodType].amount++;
							foodQuant++;
						}
					}
					if(foodQuant>0){
						totalRewards++;
						foundItems[foodType]={name:foodStuff[foodType].name,amount:foodQuant}
					}
				}
				var rewardString="";
				var foundAnything=true;
				for(var reward in foundItems){
					switch(totalRewards){
						case 0:
							foundAnything=false;
						break;
						case 1:
							rewardString=foundItems[reward].amount+" "+foundItems[reward].name+".";
						break;
						case 2:
							rewardString+=(" and "+foundItems[reward].amount+" "+foundItems[reward].name);
						break;
						default:
							rewardString+=foundItems[reward].amount+" "+foundItems[reward].name+", ";
						break;
					}
				}
				if(foundAnything){
					if(totalRewards==2){
						rewardString=rewardString.replace(" and ","");
						var newElement4=document.createElement('p');
						newElement4.class="speakable";
						newElement4.innerHTML=">You found "+rewardString+".";
						$(newElement4).insertAfter("#place_holder").hide().fadeIn(1000);
					}else if(totalRewards==1){
						var newElement4=document.createElement('p');
						newElement4.class="speakable";
						newElement4.innerHTML=">You found "+rewardString;
						$(newElement4).insertAfter("#place_holder").hide().fadeIn(1000);
					}else{
						rewardString=rewardString.substr(0,rewardString.length-2)+".";
						var newElement4=document.createElement('p');
						newElement4.class="speakable";
						newElement4.innerHTML=">You found "+rewardString;
						$(newElement4).insertAfter("#place_holder").hide().fadeIn(1000);
					}
				}else{
					var newElement4=document.createElement('p');
					newElement4.class="speakable";
					newElement4.innerHTML=">You couldn't find anything.";
					$(newElement4).insertAfter("#place_holder").hide().fadeIn(1000);
				}
				tick(8);
			}
		}
		if(area[playerY][playerX][0]==98){
			if(prefix.toLowerCase() == "farm"){
				if(item.toLowerCase() == "help"){
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					newElement3.innerHTML=">Type farm open to get started.";
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}else if(item.toLowerCase() == "open"){
					farmGuiOpen=true;
				}
			}
		}
		if (prefix.toLowerCase() == "equip" && enterBattle == 0) {
			if(parseInt(item)<playerInventory.capacity){
				for (var i = 0; i < playerInventory.capacity; i++) {
					if (parseInt(item.toLowerCase()) == i) {
						var newElement3=document.createElement('p');
						newElement3.class="speakable";
						newElement3.innerHTML=">You equipped the "+playerInventory[i].name+".";
						$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
						equipItem = playerInventory[i];
					}
				}
			}else{
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML=">Your inventory is not that big.";
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}
		}
		if(prefix.toLowerCase() == "food") {
			var cmd=item.split(" ")[0];
			if(cmd == "inventory"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML+=">----------------<br>";
				for(var i in foodStuff){
					if(foodStuff[i].craftable || foodStuff[i].amount>0){
						newElement3.innerHTML+=">"+foodStuff[i].name+"<br>>\t\tAmount: "+foodStuff[i].amount+"<br>>\t\tHunger restored: "+foodStuff[i].hungerRestored;
						if(foodStuff[i].abbr){
							newElement3.innerHTML+="<br>>\t\tAbbreviation: "+foodStuff[i].abbr;
						}
						if(foodStuff[i].craftable){
							newElement3.innerHTML+="<br>>\t\tIngredients:<br>";
							for(var j in foodStuff[i].material){
								var matName=foodStuff[j].name;
								newElement3.innerHTML+=">\t\t\t\t"+matName+": "+foodStuff[i].material[j]+".<br>";
							}
						}else{
							newElement3.innerHTML+="<br>";	
						}
						newElement3.innerHTML+=">----------------<br>";
					}
				}
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}
		}
		if(prefix.toLowerCase() == "shop" && enterBattle == 0 && canTrade){
			var cmd=item.split(" ")[0];
			if(cmd == "inspect"){
				var id=item.split(" ")[1];
				var dispArmor=shopArmor[id];
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				var dispAttr="";
				var dispMat="";
				var dispDef="";
				for(var i = 0; i < dispArmor.attributes.length;i++){
					dispAttr+=">\t"+dispArmor.attributes[i]+"<br>";
				}
				for(var i = 0; i < dispArmor.material.length;i++){
					dispMat+=">\t"+dispArmor.material[i]+"<br>";
				}
				for(var i in dispArmor.defense){
					if(dispArmor.defense[i] == 0){
						if(i == "rad"){
							dispDef+=">\tRadiation: None<br>";
						}
						if(i == "all"){
							dispDef+=">\tAll: None<br>";
						}
						if(i == "cold"){
							dispDef+=">\tFreezing: None<br>";
						}
						if(i == "fire"){
							dispDef+=">\tFire: None<br>";
						}
						if(i == "bllt"){
							dispDef+=">\tBullets: None<br>";
						}
						if(i == "exp"){
							dispDef+=">\tExplosives: None<br>";
						}
						if(i == "mel"){
							dispDef+=">\tMelee: None<br>";
						}
					}else{
						if(i == "rad"){
							dispDef+=">\tRadiation: "+(dispArmor.defense[i]*100)+"%<br>";
						}
						if(i == "all"){
							dispDef+=">\tAll: "+(dispArmor.defense[i]*100)+"%<br>";
						}
						if(i == "cold"){
							dispDef+=">\tFreezing: "+(dispArmor.defense[i]*100)+"%<br>";
						}
						if(i == "fire"){
							dispDef+=">\tFire: "+(dispArmor.defense[i]*100)+"%<br>";
						}
						if(i == "bllt"){
							dispDef+=">\tBullets: "+(dispArmor.defense[i]*100)+"%<br>";
						}
						if(i == "exp"){
							dispDef+=">\tExplosives: "+(dispArmor.defense[i]*100)+"%<br>";
						}
						if(i == "mel"){
							dispDef+=">\tMelee: "+(dispArmor.defense[i]*100)+"%<br>";
						}
					}
				}
				newElement3.innerHTML=">"+shopArmor[id].name+"<br>>Defenses:..<br>"+dispDef+">Attributes:..<br>"+dispAttr+">Material:..<br>"+dispMat+">Value: "+dispArmor.value+" Shekels";
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}else if(cmd=="inventory"){
				var ctg = item.toLowerCase().split(" ")[1];
				if(ctg == "armor"){
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					newElement3.innerHTML=">Helmets......<br>";
					for(var i=0;i<shopArmor.length;i++){
						if(shopArmor[i].slot=="helmet"){
							newElement3.innerHTML+=">"+i+": "+shopArmor[i].name+" || Value: "+shopArmor[i].value+".<br>";
						}
					}
					newElement3.innerHTML+=">Chestpiece......<br>";
					for(var i=0;i<shopArmor.length;i++){
						if(shopArmor[i].slot=="chest"){
							newElement3.innerHTML+=">"+i+": "+shopArmor[i].name+" || Value: "+shopArmor[i].value+".<br>";
						}
					}
					newElement3.innerHTML+=">Pants......<br>";
					for(var i=0;i<shopArmor.length;i++){
						if(shopArmor[i].slot=="pants"){
							newElement3.innerHTML+=">"+i+": "+shopArmor[i].name+" || Value: "+shopArmor[i].value+".<br>";
						}
					}
					newElement3.innerHTML+=">Boots......<br>";
					for(var i=0;i<shopArmor.length;i++){
						if(shopArmor[i].slot=="boots"){
							newElement3.innerHTML+=">"+i+": "+shopArmor[i].name+" || Value: "+shopArmor[i].value+".<br>";
						}
					}
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}else if(ctg == "weapons"){
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					newElement3.innerHTML="";
					for (var i = 0; i < shopInventory.length; i++) {
						newElement3.innerHTML+=">"+i+":<br>>\tName: "+shopInventory[i].name + "<br>>\tDamage: " + shopInventory[i].damage + "<br>>\tPrice: " + shopInventory[i].value + " Shekels"+"<br>";
					}
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}else if(ctg == "food"){
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					newElement3.innerHTML=">----------------<br>";
					for(var i in foodStuff){
						if(foodStuff[i].craftable || foodStuff[i].amount>0){
							newElement3.innerHTML+=">"+foodStuff[i].name+"<br>>\t\tPrice: "+foodStuff[i].buyPrice;
							if(foodStuff[i].abbr){
								newElement3.innerHTML+="<br>>\t\tAbbreviation: "+foodStuff[i].abbr;
							}
							newElement3.innerHTML+=">----------------<br>";
						}
					}
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}
			}
		}
		    //AMMOCHECK
		if(prefix.toLowerCase() == "ammo") {
			var cmd=item.split(" ")[0];
			if(cmd == "check"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML+=">----------------<br>";
				for(var i in ammo){
					newElement3.innerHTML+=">"+i+" ammo:<br>>\t\tAmount: "+ammo[i].amount+".<br>>\t\tMaterials:<br>";
					for(var j in ammo[i].material){
						var matName=materialInventory[j].name;
						newElement3.innerHTML+=">\t\t\t\t"+matName+": "+ammo[i].material[j]+".<br>";
					}
					newElement3.innerHTML+=">----------------<br>";
				}
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}
			
		}
		if(prefix.toLowerCase() == "material") {
			var cmd=item.split(" ")[0];
			if(cmd == "inventory"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML+=">----------------<br>";
				for(var i in materialInventory){
					if(materialInventory[i].craftable || materialInventory[i].amount>0){
						newElement3.innerHTML+=">"+materialInventory[i].name+":<br>>\t\tAmount: "+materialInventory[i].amount+".";
						if(materialInventory[i].craftable){
							newElement3.innerHTML+="<br>>\t\tMaterials:<br>";
							for(var j in materialInventory[i].material){
								var matName=materialInventory[j].name;
								newElement3.innerHTML+=">\t\t\t\t"+matName+": "+materialInventory[i].material[j]+".<br>";
							}
						}else{
							newElement3.innerHTML+="<br>";	
						}
						newElement3.innerHTML+=">----------------<br>";
					}
				}
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}
			
		}
		if(prefix.toLowerCase() == "attachment") {
			var cmd=item.split(" ")[0];
			if(cmd == "inventory"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML+=">----------------<br>";
				for(var i in attachmentInventory){
					if(attachmentInventory[i].craftable || attachmentInventory[i].amount>0){
						newElement3.innerHTML+=">"+attachmentInventory[i].name+":<br>>\t\tSlot: "+attachmentInventory[i].slot+"<br>>\t\tAmount: "+attachmentInventory[i].amount+".";
						if(attachmentInventory[i].craftable){
							newElement3.innerHTML+="<br>>\t\tMaterials:<br>";
							for(var j in attachmentInventory[i].material){
								var matName=materialInventory[j].name;
								newElement3.innerHTML+=">\t\t\t\t"+matName+": "+attachmentInventory[i].material[j]+".<br>";
							}
						}else{
							newElement3.innerHTML+="<br>";	
						}
						newElement3.innerHTML+=">----------------<br>";
					}
				}
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}else if(cmd == "equip"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				var attachmentToAdd="";
				var weaponNumber=item.split(" ")[1];
				if(item.split(" ").length>0){
					if(item.split(" ").length>2){
						for(var i=2;i<item.split(" ").length-1;i++){
							attachmentToAdd += item.split(" ")[i]+"_";
						}
						attachmentToAdd += item.split(" ")[item.split(" ").length-1];
					}else{
						attachmentToAdd = item.split(" ")[1];
					}
				}
				var attResponse=equipAttach(parseInt(weaponNumber),attachmentToAdd.toLowerCase());
				console.log(attResponse);
				newElement3.innerHTML+=">"+attResponse.msg;
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}else if(cmd == "remove"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				var slotRemove="";
				var weaponNumber=item.split(" ")[1];
				if(item.split(" ").length>0){
					if(item.split(" ").length>2){
						for(var i=2;i<item.split(" ").length-1;i++){
							slotRemove += item.split(" ")[i]+" ";
						}
						slotRemove += item.split(" ")[item.split(" ").length-1];
					}else{
						slotRemove = item.split(" ")[2];
					}
				}
				var attResponse=deequipAttach(parseInt(weaponNumber),slotRemove);
				console.log(attResponse);
				newElement3.innerHTML+=">"+attResponse.msg;
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}else if(cmd == "help"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML=">Valid commands: equip, remove<br>>\tequip [Weapon ID] [Attachment Name]<br>>\t\t[Weapon ID] - ID of weapon to put attachment on.<br>>\t\t[Attachment Name] - Name of the attachment.<br>>\tremove [Weapon ID] [Slot Name]<br>>\t\t[Weapon ID] - ID of weapon.<br>>\t\t[Slot Name] - Slot to remove attachment from.<br>>\t\t\tValid slots: topRail, gunStock, barrel, grip.";
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}
			
		}
		
		if(prefix.toLowerCase() == "craft") {
			var ctg=item.split(" ")[0];
			if(ctg == "food" || ctg == "ammo" || ctg == "material" || ctg == "attachment"){
				var itemToCraft="";
				if(item.split(" ").length>0){
					if(item.split(" ").length>2){
						for(var i=1;i<item.split(" ").length-1;i++){
							itemToCraft += item.split(" ")[i]+"_";
						}
						itemToCraft += item.split(" ")[item.split(" ").length-1];
					}else{
						itemToCraft = item.split(" ")[1];
					}
					var cat = {};
					var craftCat={};
					switch(ctg){
						case "food":
							cat = foodStuff;
							craftCat=foodStuff;
							break;
						case "ammo":
							cat = ammo;
							craftCat=materialInventory;
							break;
						case "material":
							cat = materialInventory;
							craftCat=materialInventory;
							break;
						case "attachment":
							cat = attachmentInventory;
							craftCat=materialInventory;
							break;
					}
					for(var i in cat){
						if(cat[i].abbr){
							if(cat[i].abbr == itemToCraft){
								itemToCraft=i;
							}
						}
					}
					var andrewBrokeMyCrafting=false;
					for(var i in cat){
						if(cat[i].craftable){
							for(var j in cat[i].materials){
								if(craftCat[j].amount<cat[i].materials[j]){
									andrewBrokeMyCrafting=true;
								}
							}
						}
					}
					if(!andrewBrokeMyCrafting){
						if(cat[itemToCraft]){
							if(cat[itemToCraft].craftable){
								var craftedItem = craft(ctg,itemToCraft);
								if(craftedItem){
									console.log("Crafted",ctg,itemToCraft,cat[itemToCraft]);
									var newElement3=document.createElement('p');
									newElement3.class="speakable";
									newElement3.innerHTML+=">Crafted "+craftedItem.amount+" "+craftedItem.name+".";
									$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
								}else{
									console.log("Not enough materials",ctg,itemToCraft,cat[itemToCraft]);
									var newElement3=document.createElement('p');
									newElement3.class="speakable";
									newElement3.innerHTML+=">Not enough materials.";
									$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
								}
							}else{
								console.log("Not craftable",ctg,itemToCraft,cat[itemToCraft]);
								var newElement3=document.createElement('p');
								newElement3.class="speakable";
								newElement3.innerHTML+=">Item is not craftable.";
								$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
							}
						}else{
							console.log("Invalid",ctg,itemToCraft,cat[itemToCraft]);
							var newElement3=document.createElement('p');
							newElement3.class="speakable";
							newElement3.innerHTML+=">Invalid item";
							$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
						}
					}else{
						var newElement3=document.createElement('p');
						newElement3.class="speakable";
						newElement3.innerHTML+=">Not enough materials.";
						$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
					}
				}else{
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					newElement3.innerHTML+=">Specify an item to craft.";
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}
			}else if(ctg == "help"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML+=">Valid catagories:<br>>\t\tfood<br>>\t\tammo<br>>\t\tmaterial";
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}else{
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML+=">Invalid catagory";
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}
			
		}
		if(prefix.toLowerCase() == "armor" && enterBattle == 0) {
			var cmd=item.split(" ")[0];
			if(cmd == "equip"){
				if(item.split(" ")[1].includes("e")){
					equipArmor(item.split(" ")[1]);
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					var slot;
					switch(item.split(" ")[1].split("e")[0]){
						case "a":
							slot="helmet";
							break;
						case "b":
							slot="chest";
							break;
						case "c":
							slot="pants";
							break;
						case "d":
							slot="boots";
							break;
					}
					if(armorInventory[slot][item.split(" ")[1].split("e")[1]].name !== "None"){
						newElement3.innerHTML=">You equipped the "+armorInventory[slot][item.split(" ")[1].split("e")[1]].name+".";
					}else{
						newElement3.innerHTML=">You removed your "+slot+".";
					}
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}
			}else if(cmd == "inspect"){
				var slot;
				if(item.split(" ")[1].includes("e")){
					switch(item.split(" ")[1].split("e")[0]){
						case "a":
							slot="helmet";
							break;
						case "b":
							slot="chest";
							break;
						case "c":
							slot="pants";
							break;
						case "d":
							slot="boots";
							break;
					}
					var id=item.split(" ")[1].split("e")[1];
					var dispArmor=armorInventory[slot][id];
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					var dispAttr="";
					var dispMat="";
					var dispDef="";
					for(var i = 0; i < dispArmor.attributes.length;i++){
						dispAttr+=">\t"+dispArmor.attributes[i]+"<br>";
					}
					for(var i = 0; i < dispArmor.material.length;i++){
						dispMat+=">\t"+dispArmor.material[i]+"<br>";
					}
					for(var i in dispArmor.defense){
						if(dispArmor.defense[i] == 0){
							if(i == "rad"){
								dispDef+=">\tRadiation: None<br>";
							}
							if(i == "all"){
								dispDef+=">\tAll: None<br>";
							}
							if(i == "cold"){
								dispDef+=">\tFreezing: None<br>";
							}
							if(i == "fire"){
								dispDef+=">\tFire: None<br>";
							}
							if(i == "bllt"){
								dispDef+=">\tBullets: None<br>";
							}
							if(i == "exp"){
								dispDef+=">\tExplosives: None<br>";
							}
							if(i == "mel"){
								dispDef+=">\tMelee: None<br>";
							}
						}else{
							if(i == "rad"){
								dispDef+=">\tRadiation: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "all"){
								dispDef+=">\tAll: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "cold"){
								dispDef+=">\tFreezing: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "fire"){
								dispDef+=">\tFire: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "bllt"){
								dispDef+=">\tBullets: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "exp"){
								dispDef+=">\tExplosives: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "mel"){
								dispDef+=">\tMelee: "+(dispArmor.defense[i]*100)+"%<br>";
							}
						}
					}
					newElement3.innerHTML=">"+armorInventory[slot][id].name+"<br>>Defenses:..<br>"+dispDef+">Attributes:..<br>"+dispAttr+">Material:..<br>"+dispMat+">Value: "+dispArmor.value+" Shekels";
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}
			}else if(cmd == "help"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML=">Type armor [cmd] to access armors.<br>>Valid commands:<br>>help - Display this.<br>>equip [id] - equip the armor piece<br>>\t\t\[id]: a/b/c/d+e+id<br>>\t\ta:Helmet, b:Chestpiece, c:Pants, d:Boots<br>>inventory - Check your armor inventory.<br>>inspect [id] - Inspect the stats of an armor piece.<br>>\t\t[id] has the same structure as equip.<br>>equipped - Check your currently equipped armor.";
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}else if(cmd == "inventory"){
				var newElement3=document.createElement('p');
				newElement3.class="speakable";
				newElement3.innerHTML=">Helmets......<br>";
				for(var i=0;i<armorInventory["helmet"].length;i++){
					if(!armorInventory["helmet"][i].empty||i==0||i=="0"){
						newElement3.innerHTML+=">"+i+": "+armorInventory["helmet"][i].name+".<br>";
					}
				}
				newElement3.innerHTML+=">Chestpiece......<br>";
				for(var i=0;i<armorInventory["chest"].length;i++){
					if(!armorInventory["chest"][i].empty||i==0||i=="0"){
						newElement3.innerHTML+=">"+i+": "+armorInventory["chest"][i].name+".<br>";
					}
				}
				newElement3.innerHTML+=">Pants......<br>";
				for(var i=0;i<armorInventory["pants"].length;i++){
					if(!armorInventory["pants"][i].empty||i==0||i=="0"){
						newElement3.innerHTML+=">"+i+": "+armorInventory["pants"][i].name+".<br>";
					}
				}
				newElement3.innerHTML+=">Boots......<br>";
				for(var i=0;i<armorInventory["boots"].length;i++){
					if(!armorInventory["boots"][i].empty||i==0||i=="0"){
						newElement3.innerHTML+=">"+i+": "+armorInventory["boots"][i].name+".<br>";
					}
				}
				$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
			}else if(cmd == "equipped"){
				for(var slot in equippedArmor){
					var newElement3=document.createElement('p');
					var dispArmor=equippedArmor[slot];
					var newElement3=document.createElement('p');
					newElement3.class="speakable";
					var dispAttr="";
					var dispMat="";
					var dispDef="";
					for(var i = 0; i < dispArmor.attributes.length;i++){
						dispAttr+=">\t"+dispArmor.attributes[i]+"<br>";
					}
					for(var i = 0; i < dispArmor.material.length;i++){
						dispMat+=">\t"+dispArmor.material[i]+"<br>";
					}
					for(var i in dispArmor.defense){
						if(dispArmor.defense[i] == 0){
							if(i == "rad"){
								dispDef+=">\tRadiation: None<br>";
							}
							if(i == "all"){
								dispDef+=">\tAll: None<br>";
							}
							if(i == "cold"){
								dispDef+=">\tFreezing: None<br>";
							}
							if(i == "fire"){
								dispDef+=">\tFire: None<br>";
							}
								if(i == "bllt"){
								dispDef+=">\tBullets: None<br>";
							}
							if(i == "exp"){
								dispDef+=">\tExplosives: None<br>";
							}
							if(i == "mel"){
								dispDef+=">\tMelee: None<br>";
							}
						}else{
							if(i == "rad"){
								dispDef+=">\tRadiation: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "all"){
								dispDef+=">\tAll: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "cold"){
								dispDef+=">\tFreezing: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "fire"){
								dispDef+=">\tFire: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "bllt"){
								dispDef+=">\tBullets: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "exp"){
								dispDef+=">\tExplosives: "+(dispArmor.defense[i]*100)+"%<br>";
							}
							if(i == "mel"){
								dispDef+=">\tMelee: "+(dispArmor.defense[i]*100)+"%<br>";
							}
						}
					}
					newElement3.innerHTML=">"+equippedArmor[slot].name+"<br>>Defenses:..<br>"+dispDef+">Attributes:..<br>"+dispAttr+">Material:..<br>"+dispMat+">Value: "+dispArmor.value+" Shekels";
					$(newElement3).insertAfter("#place_holder").hide().fadeIn(1000);
				}
			}
		}
                if (input !== "done" && input !== "attack" && input !== "burst" && input !== "stats" && input !== "help" && prefixInputCheck() !== true && itemInputCheck() !== true && weapInputCheck() !== true) {
                    watList.push($("#message_wat").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000));
                }
                if (prefix.toLowerCase() == "done" && updatingSPEC == false) {
                    $("#2late").clone(true).removeAttr("id").attr('class', 'speakable').insertAfter("#place_holder").hide().fadeIn(1000);
                }
            }
            $("#command_line").val("");
            checkChange();
        });
    });
}
