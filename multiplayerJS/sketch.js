var globals, tmp, allBullets, messaging, messages, _app, globalUsers, users, keys, mouse, buttons, tempPlatforms, platforms, f, fp, fps, framerate, framess, bullet_sound, bullet_hit, rocket_sound, rocket_explode, state, dbug, gravity, bg, player, test, testPlat, testPlat2, Tau, enemyBullet, minigunBullet, defaultBullet, rocketBullet, p1c, setBG, backToMenu, backToMenu2, backToMenu3, playGame, helpBtn, testDrop, bgR, bgG, bgB, bgrP1Btn, bgrP5Btn, bgrP10Btn, bgrM1Btn, bgrM5Btn, bgrM10Btn, bggP1Btn, bggP5Btn, bggP10Btn, bggM1Btn, bggM5Btn, bggM10Btn, bgbP1Btn, bgbP5Btn, bgbP10Btn, bgbM1Btn, bgbM5Btn, bgbM10Btn;
//Sin angle / hyp = Y
//Cos angle / hyp = X
function checkForFix(){
	for(var i = 0; i < document.getElementsByTagName('div').length; i++){
		if(document.getElementsByTagName('div')[i].getAttribute('ng-controller') === 'myCtrl'){
			return true
		}
	}
	return false
}
function sendMessageToDatabase(message){
	var messageDB = firebase.database().ref('arcade/messaging');
	var messageDBIds = firebase.database().ref('arcade/messageIds');
	var theKey = messageDB.push().key;
	console.log(message);
	if(currentUser){
		var theTime = Date.now();
		var messageData = {
			timestamp: theTime,
			timestampUTC: new Date(theTime).toGMTString(),
			msg: message.value,
			from: currentUser.uid,
			username: currentUser.displayName || (currentUser.providerData[0].displayName || currentUser.providerData[0].uid)
		};
		if(!message.value.includes("script") && message.value.length > 0){
			messageDB.child('message_'+theKey).set(messageData);
			messageDBIds.child(theKey).set(theKey);
		}
	}else{
		alert("You are not logged in.");
	}
	message.value="";
}
firebase.database().ref('arcade/platforms').on('value',function(data){
	if(Platform){
		platforms = [];
		tempPlatforms = Object.values(data.val()).filter(function(ent){
			return ent.width && ent.height && ent.x && ent.y
		});
		for(var i = 0; i < tempPlatforms.length; i++){
			var tempP = tempPlatforms[i];
			platforms[i] = new Platform(tempP.x, tempP.y, tempP.width, tempP.height);
		}
	}
});
firebase.database().ref('arcade/messageIds').on('value',function(data){
	tmp = {};	
	for(var i in data.val()){
		firebase.database().ref('arcade/messaging/message_'+i).once('value', function(snapshot){
			tmp[(''+snapshot.key).replace('message_','')]=snapshot.val();
		});
	}
	//Sort messages by time
});
setInterval(function(){
	if(tmp){
		messaging = Object.values(tmp);
		messaging.sort(function(a,b){
			if(a.timestamp>b.timestamp){
				return 1
			}else if(a.timestamp<b.timestamp){
				return -1
			}
			a.timestamp--;
			return 0
		});
		messaging.forEach(function(e){
			e.timestampUTC=(new Date(e.timestamp)).toLocaleString();
		});
	}
},75);
firebase.database().ref('arcade/users').on('value',function(data){
	users = {};
	if(currentUser){
		firebase.database().ref('arcade/users/'+currentUser.uid).onDisconnect().update({
			online: false
		});
		var newusers = Object.values(data.val()).filter(function(ent){
			return ( (ent.id !== currentUser.uid) && (ent.online) )
		});
		for(var tempUser = 0; tempUser < newusers.length; tempUser++){
			users[newusers[tempUser].id] = newusers[tempUser];
		}
	}else{
		var newusers = Object.values(data.val()).filter(function(ent){
			return ( ent.online )
		});
		for(var tempUser = 0; tempUser < newusers.length; tempUser++){
			users[newusers[tempUser].id] = newusers[tempUser];
		}
	}
	/*
	if(_app){
		if(Object.values(users).length > 0){
			if(checkForFix()){
				_app.controller('myCtrl',function($scope){
					if(users){
						$scope.UsersOnline = users;
					}
				});
			}
		}
	}
	*/
});
function playSound(theSound){
  if(theSound.isLoaded()){
  	theSound.play();
	}
}
function fpsScript(){
    if (f === 0){
        fp = millis();
    }
    f += 1;
    if (f === 5){
        fps = millis();
        framess = (fps - fp)/1000;
        framerate = round(f*(1/framess));
        f = 0;
    }
} // FPS script
function getSound(name){
	return loadSound("https://cdn.rawgit.com/timoman7/KASounds2/master/"+name+".mp3");
}


function Option(txt, func){
    this.txt = txt;
    this.func = func;
}
function Button(x,y,width,height,txt,belongsTo,func){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.txt=txt;
    this.func=func;
    this.belongsTo=belongsTo;
    this.pressed=false;
    this.hover = false;
    this.instReleased=false;
    this.style={
        borderColor:color(0,0,0),
        textColor:color(0,0,0),
        hoverColor:color(135,135,135),
        defaultColor:color(120,120,120),
        clickColor:color(180, 180, 180),
    };
    this.currentColor=this.style.defaultColor;
    this.onHover=function(){
        if(state === this.belongsTo){
            if( mouseX < this.x + (this.width/2) &&
                mouseX > this.x - (this.width/2) &&
                mouseY < this.y + (this.height/2) &&
                mouseY > this.y - (this.height/2)){
                this.hover = true;
            }else{
                this.hover = false;
            }
        }
    };
    this.onRelease=function(){
        if(state === this.belongsTo){
            if(this.hover){
                this.func();
                this.instReleased=false;
            }
        }
    };
    this.onClick=function(){
        if(state === this.belongsTo){
            if( this.hover){
                if(!mouse.left && this.pressed){
                    this.pressed = false;
                }
                if(mouse.left && !this.pressed){
                    this.pressed=true;
                    this.instReleased=true;
                }
            }
        }
    };
    this.update=function(){
        if(state === this.belongsTo){
            this.onHover();
            if(this.pressed){
                this.currentColor=lerpColor(this.currentColor,this.style.clickColor,0.1);
            }else if(this.hover){
                this.currentColor=lerpColor(this.currentColor,this.style.hoverColor,0.1);
            }else{
                this.currentColor=lerpColor(this.currentColor,this.style.defaultColor,0.1);
            }
        }
        if(!mouse.left && this.pressed){
            this.pressed = false;
        }
    };
    this.draw= function() {
        if(state === this.belongsTo){
            stroke(this.style.borderColor);
            fill(this.currentColor);
            rectMode(CENTER);
            rect(this.x,this.y,this.width,this.height,5);
            fill(this.style.textColor);
            textAlign(CENTER,CENTER);
            text(this.txt,this.x,this.y);
        }
        rectMode(CORNER);
        textAlign(LEFT,BASELINE);
    };
    buttons.push(this);
}
function Dropdown(x,y,width,height,txt,belongsTo,options){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.txt=txt;
    this.belongsTo=belongsTo;
    this.pressed=false;
    this.hover = false;
    this.instReleased=false;
    this.instReleasedObj=[];
    this.options=options;
    this.open = false;
    this.style={
        borderColor:color(0,0,0),
        textColor:color(0,0,0),
        hoverColor:color(135,135,135),
        defaultColor:color(120,120,120),
        clickColor:color(180, 180, 180),
    };
    this.optionsAtt=[];
    this.currentColor=this.style.defaultColor;
    for(var i = 0; i < this.options.length; i++){
        this.optionsAtt.push({
          currentColor:this.currentColor,
          style:this.style,pressed:false,
          hover:false,
          pos:createVector(this.x,this.y)
        });
        this.instReleasedObj.push(false);
    }
    this.onHover=function(){
        if(state === this.belongsTo){
            if( mouseX < this.x + (this.width/2) &&
                mouseX > this.x - (this.width/2) &&
                mouseY < this.y + (this.height/2) &&
                mouseY > this.y - (this.height/2)){
                this.hover = true;
            }else{
                this.hover = false;
            }
            for(var i = 0; i < this.optionsAtt.length; i++){
                var opt = this.optionsAtt[i];
                if( mouseX < opt.pos.x + (this.width/2) &&
                    mouseX > opt.pos.x - (this.width/2) &&
                    mouseY < opt.pos.y + (this.height/2) &&
                    mouseY > opt.pos.y - (this.height/2)){
                    this.optionsAtt[i].hover = true;
                }else{
                    this.optionsAtt[i].hover = false;
                }
            }
        }
    };
    this.onRelease=function(){
        if(state === this.belongsTo){
            if(this.hover){
                this.open = !this.open;
                if(!this.open){
                    for(var i = 0; i < this.options.length; i++){
                        this.optionsAtt[i].pos.y = this.y;
                    }
                }
                this.instReleased=false;
            }
            if(this.open){
                for(var i = 0; i < this.optionsAtt.length; i++){
                    var opt = this.optionsAtt[i];
                    if(opt.hover && !this.hover){
                        this.options[i].func();
                        this.instReleasedObj[i]=false;
                    }
                }
            }
        }
    };
    this.onClick=function(){
        if(state === this.belongsTo){
            if( this.hover){
                if(!mouse.left && this.pressed){
                    this.pressed = false;
                }
                if(mouse.left && !this.pressed){
                    this.pressed=true;
                    this.instReleased=true;
                }
            }
            for(var i = 0; i < this.optionsAtt.length; i++){
                var opt = this.optionsAtt[i];
                if( opt.hover && 
                opt.pos.y > this.y + (this.height/2) ){
                    if(!mouse.left && opt.pressed){
                        this.optionsAtt[i].pressed = false;
                    }
                    if(mouse.left && !opt.pressed){
                        this.optionsAtt[i].pressed=true;
                        this.instReleasedObj[i]=true;
                    }
                }
            }
        }
    };
    this.update=function(){
        if(state === this.belongsTo){
            this.onHover();
            if(this.pressed){
                this.currentColor=lerpColor(this.currentColor,this.style.clickColor,0.1);
            }else if(this.hover){
                this.currentColor=lerpColor(this.currentColor,this.style.hoverColor,0.1);
            }else{
                this.currentColor=lerpColor(this.currentColor,this.style.defaultColor,0.1);
            }
            for(var i = 0; i < this.optionsAtt.length; i++){
                if(this.optionsAtt[i].pressed){
                    this.optionsAtt[i].currentColor=lerpColor(this.optionsAtt[i].currentColor,this.style.clickColor,0.1);
                }else if(this.optionsAtt[i].hover){
                    this.optionsAtt[i].currentColor=lerpColor(this.optionsAtt[i].currentColor,this.style.hoverColor,0.1);
                }else{
                    this.optionsAtt[i].currentColor=lerpColor(this.optionsAtt[i].currentColor,this.style.defaultColor,0.1);
                }
            }
        }
        if(!mouse.left && this.pressed){
            this.pressed = false;
        }
        for(var i = 0; i < this.optionsAtt.length; i++){
            if(!mouse.left && this.optionsAtt[i].pressed){
                this.optionsAtt[i].pressed = false;
            }
        }
    };
    this.draw= function() {
        if(state === this.belongsTo){
            this.menuHeight = 0;
            if(this.open){
                var lastOpt = this.optionsAtt[this.optionsAtt.length-1];
                this.menuHeight=(lastOpt.pos.y-this.y)+this.height;
                fill(this.style.defaultColor);
                stroke(this.style.borderColor);
                rectMode(CORNER);
                rect(this.x-(this.width/2),this.y-(this.height/2),this.width,this.menuHeight+2,5);
                for(var i = 0; i < this.options.length; i++){
                    
                    this.optionsAtt[i].pos.y = lerp(this.optionsAtt[i].pos.y,this.y+((i+1)*(this.height)),0.1);
                    noStroke();
                    fill(this.optionsAtt[i].currentColor);
                    rectMode(CENTER);
                    rect(this.optionsAtt[i].pos.x,this.optionsAtt[i].pos.y,this.width-1,this.height,5);
                    fill(this.style.textColor);
                    textAlign(CENTER,CENTER);
                    text(this.options[i].txt,this.optionsAtt[i].pos.x,this.optionsAtt[i].pos.y);
                }
                for(var i = 0; i < this.options.length; i++){
                    if(i !== this.options.length-1){
                        var opt = this.optionsAtt[i];
                        stroke(this.style.borderColor);
                        line(opt.pos.x-this.width/2,
                        opt.pos.y+this.height/2,
                        opt.pos.x+this.width/2,
                        opt.pos.y+this.height/2);
                    }
                }
            }
            if(!this.open){
                stroke(this.style.borderColor);
                fill(this.currentColor);
                rectMode(CENTER);
                rect(this.x,this.y,this.width,this.height,5);
            }else{
                noStroke();
                fill(this.currentColor);
                rectMode(CENTER);
                rect(this.x,this.y+1,this.width-1,this.height,5);
                stroke(this.style.borderColor);
                line(this.x-this.width/2,
                this.y+this.height/2,
                this.x+this.width/2,
                this.y+this.height/2);
            }
            fill(this.style.textColor);
            textAlign(CENTER,CENTER);
            text(this.txt,this.x,this.y);
            
        }
        rectMode(CORNER);
        textAlign(LEFT,BASELINE);
    };
    buttons.push(this);
}

//Bullets

function Platform(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.pos = createVector(this.x,this.y);
    this.orientation = "horizontal";
    if(this.width>=this.height){
        this.left = {
            pos: createVector(this.x-(this.width/2),this.y),
            width: this.height,
            height: this.height,
        };
        this.right = {
            pos: createVector(this.x+(this.width/2),this.y),
            width: this.height,
            height: this.height,
        };
        this.orientation = "horizontal";
    }else{
        this.top = {
            pos: createVector(this.x-(this.width/2),this.y),
            width: this.width,
            height: this.width,
        };
        this.bottom = {
            pos: createVector(this.x+(this.width/2),this.y),
            width: this.width,
            height: this.width,
        };
        this.orientation = "vertical";
    }
    this.update = function(){
        if(this.width>=this.height){
            this.left = {
                pos: createVector(this.x-(this.width/2),this.y),
                width: this.height,
                height: this.height,
            };
            this.right = {
                pos: createVector(this.x+(this.width/2),this.y),
                width: this.height,
                height: this.height,
            };
            this.orientation = "horizontal";
        }else{
            this.top = {
                pos: createVector(this.x,this.y-(this.height/2)),
                width: this.width,
                height: this.width,
            };
            this.bottom = {
                pos: createVector(this.x,this.y+(this.height/2)),
                width: this.width,
                height: this.width,
            };
            this.orientation = "vertical";
        }
    };
    this.draw = function() {
        rectMode(CENTER);
        fill(100,200,100,50);
        if(this.orientation === "horizontal"){
            ellipse(this.left.pos.x,this.left.pos.y,this.left.width,this.left.height);
            ellipse(this.right.pos.x,this.right.pos.y,this.right.width,this.right.height);
            noStroke();
            rect(this.pos.x,this.pos.y,this.width,this.height);
            stroke(150);
            line(this.pos.x-(this.width/2),this.pos.y-(this.height/2),this.pos.x+(this.width/2),this.pos.y-(this.height/2));
            line(this.pos.x-(this.width/2),this.pos.y+(this.height/2),this.pos.x+(this.width/2),this.pos.y+(this.height/2));
        }else if(this.orientation === "vertical"){
            ellipse(this.top.pos.x,this.top.pos.y,this.top.width,this.top.height);
            ellipse(this.bottom.pos.x,this.bottom.pos.y,this.bottom.width,this.bottom.height);
            noStroke();
            rect(this.pos.x,this.pos.y,this.width,this.height);
            stroke(150);
            line(this.pos.x-(this.width/2),this.pos.y-(this.height/2),this.pos.x-(this.width/2),this.pos.y+(this.height/2));
            line(this.pos.x+(this.width/2),this.pos.y-(this.height/2),this.pos.x+(this.width/2),this.pos.y+(this.height/2));
        }
    };
}
function blastForce(bullet,hit){
    this.proj = bullet;
    this.bullet = this.proj.bullet;
    this.hit = hit;
    this.hyp=dist(this.proj.pos.x,this.proj.pos.y,this.hit.pos.x,this.hit.pos.y);
    this.angle = atan2(this.hit.pos.y-this.proj.pos.y,this.hit.pos.x-this.proj.pos.x);
    this.fireY = sin((this.angle))*this.hyp;
    this.fireX = cos((this.angle))*this.hyp;
    if(this.fireX>0){
        this.fireX = map(this.fireX,0,this.bullet.radius,this.bullet.radius,0);
    }else if(this.fireX<0){
        this.fireX = map(this.fireX,0,-this.bullet.radius,-this.bullet.radius,0);
    }
    if(this.fireY>0){
        this.fireY = map(this.fireY,0,this.bullet.radius,this.bullet.radius,0);
    }else if(this.fireY<0){
        this.fireY = map(this.fireY,0,-this.bullet.radius,-this.bullet.radius,0);
    }
    this.fireX=map(this.fireX,0,this.hyp,0,this.bullet.force);
    this.fireY=map(this.fireY,0,this.hyp,0,this.bullet.force);
    this.force = createVector(this.fireX,this.fireY);
    this.force.normalize();
    this.force.mult(this.bullet.force);
    return this.force;
}
function Projectile(target,bulletName,chumber,id){
    this.id=id;
	this.bulletName = bulletName;
    this.bullet=allBullets[this.bulletName];
    this.speed=this.bullet.speed;
    this.damage=this.bullet.damage;
    this.type=this.bullet.type;
    this.target=target;
    var targetX=this.target.x;
    var targetY=this.target.y;
    this.pos=createVector(chumber.pos.x,chumber.pos.y);
    this.hyp=dist(this.pos.x,this.pos.y,targetX,targetY);
    this.accuracy=this.bullet.accuracy;
    this.invAccuracy=map(this.accuracy,100,0,0,100);
    this.radDif=random(-3*PI,3*PI);
    this.fullAngle=map(this.invAccuracy,0,100,0,this.radDif);
    this.angleDif = this.fullAngle;
    this.angle = atan2(targetY-this.pos.y,targetX-this.pos.x)+this.angleDif;
    this.fireY = sin((this.angle))*this.hyp;
    this.fireX = cos((this.angle))*this.hyp;
    this.fireX=map(this.fireX,0,this.hyp,0,this.speed);
    this.fireY=map(this.fireY,0,this.hyp,0,this.speed);
    this.fireVel = createVector(this.fireX,this.fireY);
    this.destroy=function(){
        for(var i = 0; i < chumber.Projectiles.length; i++){
            if(this.id === chumber.Projectiles[i].id){
                chumber.Projectiles.splice(i,1);
            }
        }
    };
    this.explode=function(){
        noStroke();
        fill(255,0,0,10);
        if(arguments.length>0){
            this.impact = arguments[0];
        }
        for(var j = 0; j <globals.length; j++){
            ellipse(this.pos.x,this.pos.y,this.bullet.radius*2,this.bullet.radius*2);
            var potential = globals[j];
            var d2 = dist(this.pos.x,this.pos.y,potential.pos.x,potential.pos.y);
            var force = blastForce(this,potential);
            
            if( d2 < this.bullet.radius + potential.radius ){
                
                potential.applyForce(force);
                //println(force);
                if(arguments.length>0){
                    if(potential.id !== this.impact.id){
                        potential.hit(this);
                    }
                }else{
                    potential.hit(this);
                }
            }
        }
    };
    this.checkHit=function(){
        for(var i = 0; i < globals.length; i++){
            var impact = globals[i];
            if(chumber.id !== impact.id){
                var d = dist(this.pos.x,this.pos.y,impact.pos.x,impact.pos.y);
                if(d < impact.radius){
                    if(this.bullet.type === "rocket"){
                        this.explode(impact);
                    }else{
                        var force = blastForce(this,impact);
                        impact.applyForce(force);
                    }
                    impact.hit(this);
                    playSound(this.bullet.hit_sound);
                    this.destroy();
                }
            }
        }
        for(var i = 0; i < platforms.length; i++){
            var plat = platforms[i];
            if(plat.orientation === "horizontal"){
                var dl=dist(this.pos.x,this.pos.y,plat.left.pos.x,plat.left.pos.y);
                var dr=dist(this.pos.x,this.pos.y,plat.right.pos.x,plat.right.pos.y);
                if(dl < plat.left.height/2){
                    this.explode();
                    playSound(this.bullet.hit_sound);
                    this.destroy();
                }else if(dr < plat.right.height/2){
                    this.explode();
                    playSound(this.bullet.hit_sound);
                    this.destroy();
                }
                
            }else if(plat.orientation === "vertical"){
                var dt=dist(this.pos.x,this.pos.y,plat.top.pos.x,plat.top.pos.y);
                var db=dist(this.pos.x,this.pos.y,plat.bottom.pos.x,plat.bottom.pos.y);
                if(dt < plat.top.width/2){
                    this.explode();
                    playSound(this.bullet.hit_sound);
                    this.destroy();
                }else if(db < plat.bottom.width/2){
                    this.explode();
                    playSound(this.bullet.hit_sound);
                    this.destroy();
                }
                
            }
            if( this.pos.x > plat.pos.x - (plat.width/2)&&
                this.pos.x < plat.pos.x + (plat.width/2)&&
                this.pos.y > plat.pos.y - (plat.height/2)&&
                this.pos.y < plat.pos.y + (plat.height/2)){
                    this.explode();
                    playSound(this.bullet.hit_sound);
                    this.destroy();
            }
        }
        if(this.pos.x>width||this.pos.x<0||this.pos.y>height||this.pos.y<0){
            if(this.bullet.type === "rocket"){
                this.explode();
            }
            playSound(this.bullet.hit_sound);
            this.destroy();
        }
    };
    playSound(this.bullet.fire_sound);
    this.update=function(){
        this.pos.x+=(this.fireVel.x);
        this.pos.y+=(this.fireVel.y);
        this.checkHit();
    };
    this.draw= function() {
        rectMode(CENTER);
        push();
        translate(this.pos.x,this.pos.y);
        rotate(this.angle);
        stroke(0);
        strokeWeight(1.2);
        noFill();
        ellipse(15,0,10,10);
        rect(7.5,0,15,10);
        if(this.type === "normal"){
            fill(255);
        }else if(this.type === "rocket"){
            fill(255, 0, 0);
        }else{
            fill(0);
        }
        noStroke();
        rect(7.5,0,15,10);
        ellipse(15,0,10,10);
        pop();
        rectMode(CORNER);
    };
}
function Gun(x,y,bullet,radius,range,maxHP,name){
    var nameCount = 0;
    var potentialName = name || "gun";
    for(var i = 0; i < globals.length; i++){
        if(globals[i].id === name || globals[i].id === potentialName){
            nameCount++;
            potentialName = name + "" +nameCount;
        }
    }
    if(nameCount>0){
        this.id = potentialName;
    }else{
        this.id = name;
    }
    this.maxHP=maxHP || 100;
    this.HP=this.maxHP;
    this.pos=createVector(x,y);
    this.range=range;
    this.radius=radius;
    this.x=x;
    this.y=y;
	this.bulletName = bullet;
    this.bullet=allBullets[this.bulletName];
    this.fired=[];
    this.fired[allBullets[this.bulletName].name]=false;
    this.fireDelay=[];
    this.fireDelay[this.bullet.name]=0;
    this.Projectiles = [];
    this.bullets=[];
    this.aim=function(targetX,targetY){
        this.target=createVector(targetX, targetY);
        this.hyp=dist(this.pos.x,this.pos.y,targetX,targetY);
        this.angle = atan2(targetY-this.pos.y,targetX-this.pos.x);
        this.fireY = sin((this.angle))*this.hyp;
        this.fireX = cos((this.angle))*this.hyp;
        this.fireX=map(this.fireX,0,this.hyp,0,this.radius/2);
        this.fireY=map(this.fireY,0,this.hyp,0,this.radius/2);
    };
    this.hit=function(attack){
        this.HP-=attack.damage;
    };
    this.fire=function(){
        if(!this.fired[this.bullet.name]){
            this.Projectiles.push(new Projectile(
                this.target,
                this.bulletName,
                this,
                frameCount
            ));
            this.fired[this.bullet.name]=true;
            this.fireDelay[this.bullet.name]=this.bullet.rate;
        }
    };
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.applyForce=function(force){
        this.acc.add(force);
        this.vel.add(this.acc);
        this.acc = createVector(0,0);
    };
    this.moveAround=function(fx,fy){
        this.applyForce(createVector(fx,fy));
    };
    
    this.collide=function(orient){
        if(orient === "h"){
            this.applyForce(createVector(-gravity.x,0));
            this.vel.x*= -0.85;
        }else if(orient === "v"){
            this.applyForce(createVector(0,-gravity.y));
            this.vel.y*= -0.85;
        }else if(orient === "a"){
            this.bounce = arguments[1];
            this.hyp=dist(this.bounce.pos.x,this.bounce.pos.y,this.pos.x,this.pos.y);
            this.angle = atan2(this.pos.y-this.bounce.pos.y,this.pos.x-this.bounce.pos.x);
            this.fireX = cos((this.angle))*this.hyp;
            this.fireY = sin((this.angle))*this.hyp;
            this.fireX = map(this.fireX,-this.hyp,this.hyp,-1,1);
            this.fireY = map(this.fireY,-this.hyp,this.hyp,-1,1);
            this.repel = createVector(this.fireX,this.fireY);
            this.tempVel = createVector(-this.vel.x,-this.vel.y);
            this.tempVel.mult(createVector(0.85,0.85));
            this.repel.mult(this.tempVel);
            this.applyForce(this.repel);
        }
    };
    this.checkCollisions=function(){
        this.colliding={
            left:false,right:false,top:false,bottom:false};
        for(var i = 0; i < platforms.length; i++){
            var plat = platforms[i];
            if(plat.orientation === "horizontal"){
                if(
                    this.pos.x+(this.radius/2) > 
                    plat.pos.x - (plat.width/2)&&
                    this.pos.x-(this.radius/2) < 
                    plat.pos.x + (plat.width/2)
                    ){
                        if(
                        this.pos.y - (this.radius/2) <
                        plat.pos.y + (plat.height/2) &&
                        this.pos.y - (this.radius/2) >
                        plat.pos.y - (plat.height/2)
                        ){
                            this.colliding.top = true;
                            this.collide("v");
                        }else if(
                        this.pos.y + (this.radius/2) >
                        plat.pos.y - (plat.height/2) &&
                        this.pos.y + (this.radius/2) <
                        plat.pos.y + (plat.height/2)
                        ){
                            this.colliding.bottom = true;
                            this.collide("v");
                        }
                }
                var r = ((plat.height)/2)+((this.radius/2));
                if(dist(this.pos.x,this.pos.y,plat.left.pos.x,plat.left.pos.y)<r &&
                this.pos.x < plat.left.pos.x){
                    strokeWeight(1);
                    fill(255);
                    ellipse(this.pos.x,this.pos.y,r,r);
                    this.collide("a",plat.left);
                }
                if(dist(this.pos.x,this.pos.y,plat.right.pos.x,plat.right.pos.y)<r){
                    strokeWeight(1);
                    fill(255);
                    ellipse(this.pos.x,this.pos.y,r,r);
                    this.collide("a",plat.right);
                }
            }else if(plat.orientation === "vertical"){
                if(
                    this.pos.y+(this.radius/2) > 
                    plat.pos.y - (plat.height/2)&&
                    this.pos.y-(this.radius/2) < 
                    plat.pos.y + (plat.height/2)
                    
                    ){
                        if(
                        this.pos.x + (this.radius/2) >
                        plat.pos.x - (plat.width/2) &&
                        this.pos.x + (this.radius/2) <
                        plat.pos.x + (plat.width/2)
                        ){
                            this.colliding.right = true;
                            this.collide("h");
                        }else if(
                        this.pos.x - (this.radius/2) <
                        plat.pos.x + (plat.height/2) &&
                        this.pos.x - (this.radius/2) >
                        plat.pos.x - (plat.height/2)
                        ){
                            this.colliding.left = true;
                            this.collide("h");
                        }
                }
                if(dist(this.pos.x,this.pos.y,plat.top.pos.x,plat.top.pos.y)<(plat.width/2)+((this.radius+1)/2)){
                    this.collide("a",plat.top);
                }
                if(dist(this.pos.x,this.pos.y,plat.bottom.pos.x,plat.bottom.pos.y)<(plat.width/2)+((this.radius+1)/2)){
                    this.collide("a",plat.bottom);
                }
            }
        }
        if(this.vel.x+this.pos.x+(this.radius/2) > width){
            this.colliding.right = true;
            this.collide("h");
        }
        if(this.vel.x+this.pos.x-(this.radius/2) < 0){
            this.colliding.left = true;
            this.collide("h");
        }
        if(this.vel.y+this.pos.y+(this.radius/2) > height){
            this.colliding.bottom = true;
            this.collide("v");
        }
        if(this.vel.y+this.pos.y-(this.radius/2) < 0){
            this.colliding.top = true;
            this.collide("v");
        }
    };
    this.update=function(){
        this.applyForce(gravity);
        if(!this.bullets.includes(this.bullet)){
            this.bullets.push(this.bullet);
        }
        this.checkCollisions();
        if(this.vel.x+this.pos.x+(this.radius/2) > width || this.vel.x+this.pos.x-(this.radius/2) < 0){
            this.applyForce(createVector(-gravity.x,0));
            this.vel.x*= -0.85;
        }
        if(this.vel.y+this.pos.y+(this.radius/2) > height || this.vel.y+this.pos.y-(this.radius/2) < 0){
            this.applyForce(createVector(0,-gravity.y));
            this.vel.y*= -0.85;
        }
        if(this.vel.x > 0.2 || this.vel.x < -0.2){
            this.vel.x=lerp(this.vel.x,0,0.05);
        }else{
            this.vel.x=0;
        }
        if(this.vel.y > 0.2 || this.vel.y < -0.2){
            this.vel.y=lerp(this.vel.y,0,0.05);
        }else{
            this.vel.y=0;
        }
        this.pos.add(this.vel);
        if(this.fired[this.bullet.name]){
            this.fireDelay[this.bullet.name]--;
            if(this.fireDelay[this.bullet.name]<=0){
                
                this.fired[this.bullet.name]=false;
            }
        }
        for(var i = 0; i < this.Projectiles.length; i++){
            this.Projectiles[i].update();
        }
        if(this.HP<=0){
            for(var i = 0; i < globals.length; i++){
                if(globals[i].id === this.id){
                    globals.splice(i,1);
                }
            }
        }
    };
    this.draw= function() {
        fill(255);
        strokeWeight(1);
        stroke(0);
        ellipse(this.pos.x,this.pos.y,this.radius,this.radius);
        fill(255,0,0,100);
        noStroke();
        ellipse(this.pos.x,this.pos.y,this.range*2,this.range*2);
        if(this.fireX && this.fireY){
            stroke(0);
            line(this.pos.x,this.pos.y,this.pos.x+this.fireX,this.pos.y+this.fireY);
        }
        for(var i = 0; i < this.Projectiles.length; i++){
            this.Projectiles[i].draw();
        }
        fill(255);
        stroke(0);
        rect(this.pos.x-this.radius,this.pos.y-this.radius,40,5);
        fill(map(this.fireDelay[this.bullet.name],this.bullet.rate,0,255,0),map(this.fireDelay[this.bullet.name],this.bullet.rate,0,0,255),0);
        noStroke();
        rect(this.pos.x-this.radius,this.pos.y-this.radius,map(this.fireDelay[this.bullet.name],this.bullet.rate,0,0,40),5);
        fill(0);
        text(this.HP+"/"+this.maxHP,this.pos.x-this.radius,this.pos.y-22);
    };
    globals.push(this);
}
function findClosest(origin){
    var closest=10000;
    var closestObj;
    for(var i =0; i < globals.length; i++){
        var target = globals[i];
        if(target !== origin){
            if(dist(target.pos.x,target.pos.y,origin.pos.x,origin.pos.y)<closest){
                closest = dist(target.pos.x,target.pos.y,origin.pos.x,origin.pos.y);
                closestObj = target;
            }
        }
    }
    if(closestObj){
        return closestObj;
    }
}
function Entity(x,y,radius,name,maxHP,bullet,isPlayer,mainPlayer){
    var nameCount = 0;
    var potentialName = name;
    for(var i = 0; i < globals.length; i++){
        if(globals[i].id === name || globals[i].id === potentialName){
            nameCount++;
            potentialName = name + "" +nameCount;
        }
    }
    if(nameCount>0){
        this.id = potentialName;
    }else{
        this.id = name;
    }
	this.bulletName = bullet || "defaultBullet";
    this.bullet=allBullets[this.bulletName];
    this.bullets=[];
    this.radius=radius;
    this.pos = createVector(x,y);
    this.maxHP=maxHP;
    this.HP=this.maxHP;
    this.hasControls=false;
    this.Projectiles=[];
    this.fired=[];
    this.fired[allBullets[this.bulletName].name]=false;
    this.fireDelay=[];
    this.fireDelay[this.bullet.name]=0;
    this.crosshair=createVector(mouseX,mouseY);
	this.isPlayer = isPlayer || false;
	this.mainPlayer = mainPlayer || false;
	this.online = false;
    this.colliding={
    left:false,
    top:false,
    right:false,
    bottom:false,
    };
	this.leftClick=false;
    this.canJump = false;
    this.jumpCount = 0;
    this.maxJumps = 1;
    this.jumpForce = createVector(0,-10);
    this.setControls=function(controls){
        this.controls=controls;
        this.hasControls=true;
	this.isPlayer = true;
	this.mainPlayer = true;
    };
    this.hit=function(attack){
        this.HP-=attack.damage;
    };
    this.aim=function(targetX,targetY){
        this.target=createVector(targetX, targetY);
        this.hyp=dist(this.pos.x,this.pos.y,targetX,targetY);
        this.angle = atan2(targetY-this.pos.y,targetX-this.pos.x);
        this.fireY = sin((this.angle))*this.hyp;
        this.fireX = cos((this.angle))*this.hyp;
        this.fireX=map(this.fireX,0,this.hyp,0,this.radius/2);
        this.fireY=map(this.fireY,0,this.hyp,0,this.radius/2);
    };

    this.fire=function(){
        if(!this.fired[this.bullet.name]){
            this.Projectiles.push(new Projectile(
                this.target,
                this.bulletName,
                this,
                frameCount
            ));
            this.fired[this.bullet.name]=true;
            this.fireDelay[this.bullet.name]=this.bullet.rate;
        }
    };
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.applyForce=function(force){
        this.acc.add(force);
        this.vel.add(this.acc);
        this.acc = createVector(0,0);
    };
    this.checkJump=function(){
        if(this.jumpCount >= this.maxJumps){
            this.canJump = false;
            if(this.colliding.bottom){
                this.jumpCount=0;
                this.canJump = true;
            }
        }else{
            this.canJump = true;
        }
    };
    this.jump=function(){
        this.applyForce(this.jumpForce);
        this.jumpCount++;
    };
    this.collide=function(orient){
        if(orient === "h"){
            this.applyForce(createVector(-gravity.x,0));
            this.vel.x*= -0.85;
        }else if(orient === "v"){
            this.applyForce(createVector(0,-gravity.y*1.15));
            this.vel.y*= -0.85;
        }else if(orient === "a"){
           this.bounce = arguments[1];
          	this.collisionPointX = ((this.pos.x * this.bounce.height) + (this.bounce.pos.x * this.radius)) / (this.radius + this.bounce.height);
		this.collisionPointY = ((this.pos.y * this.bounce.height) + (this.bounce.pos.y * this.radius)) / (this.radius + this.bounce.height);
          	// this.hyp=dist(this.bounce.pos.x,this.bounce.pos.y,this.pos.x,this.pos.y);
          	// this.angle = atan2(this.pos.y-this.bounce.pos.y,this.pos.x-this.bounce.pos.x);
          	// this.fireX = cos((this.angle))*this.hyp;
          	// this.fireY = sin((this.angle))*this.hyp;
          	// this.fireX = map(this.fireX,-this.hyp,this.hyp,-1,1);
          	// this.fireY = map(this.fireY,-this.hyp,this.hyp,-1,1);
          	// this.repel = createVector(this.fireX,this.fireY);
          	this.repel = createVector(this.collisionPointX,this.collisionPointY);
          	this.repel.sub(this.pos);
          	this.repel.mult(-1);
          	this.repel.normalize();
          	this.tempVel = createVector(this.vel.x,this.vel.y);
            this.applyForce(this.repel);
        }
    };
    this.checkCollisions=function(){
	    if(this.isPlayer && this.mainPlayer && currentUser){
		this.online = true;
	}else{
		this.online = false;
	}
        this.colliding={
            left:false,right:false,top:false,bottom:false};
        for(var i = 0; i < platforms.length; i++){
            var plat = platforms[i];
            if(plat.orientation === "horizontal"){
                if(
                    this.pos.x+(this.radius/2) > 
                    plat.pos.x - (plat.width/2)&&
                    this.pos.x-(this.radius/2) < 
                    plat.pos.x + (plat.width/2)
                    ){
                        if(
                        this.pos.y - (this.radius/2) <
                        plat.pos.y + (plat.height/2) &&
                        this.pos.y - (this.radius/2) >
                        plat.pos.y - (plat.height/2)
                        ){
                            this.colliding.top = true;
                            this.collide("v");
                        }else if(
                        this.pos.y + (this.radius/2) >
                        plat.pos.y - (plat.height/2) &&
                        this.pos.y + (this.radius/2) <
                        plat.pos.y + (plat.height/2)
                        ){
                            this.colliding.bottom = true;
                            this.collide("v");
                        }
                }
              	if(this.pos.y + ((this.radius-(this.radius/3))/2)> plat.pos.y - (plat.height/2) &&
                   this.pos.y < plat.pos.y &&
                   this.pos.x > plat.pos.x - (plat.width/2) &&
                   this.pos.x < plat.pos.x + (plat.width/2)){
                  var pushForce = createVector(0,-dist(this.pos.x,this.pos.y + (this.radius/2),this.pos.x,plat.pos.y - (plat.height/2)));
                  this.applyForce(pushForce);
                	//top
                }else if(this.pos.y > plat.pos.y &&
                   this.pos.y - ((this.radius-(this.radius/3))/2) < plat.pos.y + (plat.height/2) &&
                   this.pos.x > plat.pos.x - (plat.width/2) &&
                   this.pos.x < plat.pos.x + (plat.width/2)){
                  var pushForce = createVector(0,dist(this.pos.x,this.pos.y - (this.radius/2),this.pos.x,plat.pos.y + (plat.height/2)));
                  this.applyForce(pushForce);
                	//bottom
                }
                var r = ((plat.height)/2)+((this.radius/2));
                if(dist(this.pos.x,this.pos.y,plat.left.pos.x,plat.left.pos.y)<r &&
                this.pos.x < plat.left.pos.x){
                    strokeWeight(1);
                    fill(255);
                    ellipse(this.pos.x,this.pos.y,r,r);
                    this.collide("a",plat.left);
                }
                if(dist(this.pos.x,this.pos.y,plat.right.pos.x,plat.right.pos.y)<r){
                    strokeWeight(1);
                    fill(255);
                    ellipse(this.pos.x,this.pos.y,r,r);
                    this.collide("a",plat.right);
                }
            }else if(plat.orientation === "vertical"){
                if(
                    this.pos.y+(this.radius/2) > 
                    plat.pos.y - (plat.height/2)&&
                    this.pos.y-(this.radius/2) < 
                    plat.pos.y + (plat.height/2)
                    
                    ){
                        if(
                        this.pos.x + (this.radius/2) >
                        plat.pos.x - (plat.width/2) &&
                        this.pos.x + (this.radius/2) <
                        plat.pos.x + (plat.width/2)
                        ){
                            this.colliding.right = true;
                            this.collide("h");
                        }else if(
                        this.pos.x - (this.radius/2) <
                        plat.pos.x + (plat.height/2) &&
                        this.pos.x - (this.radius/2) >
                        plat.pos.x - (plat.height/2)
                        ){
                            this.colliding.left = true;
                            this.collide("h");
                        }
                }
              	if(this.pos.y > plat.pos.y - (plat.height/2) &&
                   this.pos.y < plat.pos.y + (plat.height/2) &&
                   this.pos.x + ((this.radius-(this.radius/3))/2) > plat.pos.x - (plat.width/2) &&
                   this.pos.x < plat.pos.x){
                  var pushForce = createVector(-dist(this.pos.x + (this.radius/2),this.pos.y,plat.pos.x - (plat.width/2),this.pos.y),0);
                  this.applyForce(pushForce);
                	//left
                }else if(this.pos.y > plat.pos.y - (plat.height/2) &&
                   this.pos.y < plat.pos.y + (plat.height/2) &&
                   this.pos.x > plat.pos.x&&
                   this.pos.x - ((this.radius-(this.radius/3))/2) < plat.pos.x + (plat.width/2)){
                  var pushForce = createVector(dist(this.pos.x - (this.radius/2),this.pos.y,plat.pos.x + (plat.width/2),this.pos.y),0);
                  this.applyForce(pushForce);
                	//right
                }
                if(dist(this.pos.x,this.pos.y,plat.top.pos.x,plat.top.pos.y)<(plat.width/2)+((this.radius+1)/2)){
                    this.collide("a",plat.top);
                }
                if(dist(this.pos.x,this.pos.y,plat.bottom.pos.x,plat.bottom.pos.y)<(plat.width/2)+((this.radius+1)/2)){
                    this.collide("a",plat.bottom);
                }
            }
        }
        if(this.vel.x+this.pos.x+(this.radius/2) > width){
            this.colliding.right = true;
            this.collide("h");
        }
        if(this.vel.x+this.pos.x-(this.radius/2) < 0){
            this.colliding.left = true;
            this.collide("h");
        }
        if(this.vel.y+this.pos.y+(this.radius/2) > height){
            this.colliding.bottom = true;
            this.collide("v");
        }
        if(this.vel.y+this.pos.y-(this.radius/2) < 0){
            this.colliding.top = true;
            this.collide("v");
        }
    };
	this.updateDatabase=function(){
		if(currentUser){
			var tempProjectiles=[];
			for(var i = 0; i < this.Projectiles.length; i++){
				var tp = this.Projectiles[i];
				tempProjectiles.push({
					pos:{
						x:tp.pos.x,
						y:tp.pos.y,
						z:tp.pos.z
					},
					angle:tp.angle,
					angleDif:tp.angleDif,
					bulletName:tp.bulletName,
					damage:tp.damage,
					fireVel:{
						x:tp.fireVel.x,
						y:tp.fireVel.y,
						z:tp.fireVel.z,
					},
					fireX:tp.fireX,
					fireY:tp.fireY,
					fullAngle:tp.fullAngle,
					hyp:tp.hyp,
					id:tp.id,
					invAccuracy:tp.invAccuracy,
					radDif:tp.radDif,
					speed:tp.speed,
					target:{
						x:tp.target.x,
						y:tp.target.y,
						z:tp.target.z
					},
					type:tp.type
				});
			}
			firebase.database().ref("arcade/users/"+currentUser.uid).set({
				HP:this.HP,
				online:true,
				Projectiles:tempProjectiles,
				acc:{
					x:this.acc.x,
					y:this.acc.y,
					z:this.acc.z,
				},
				angle:this.angle,
				bulletName:this.bulletName,
				canJump:this.canJump,
				colliding:this.colliding,
				crosshair:{
					x:this.crosshair.x,
					y:this.crosshair.y,
					z:this.crosshair.z,
				},
				fired:this.fired,
				fireDelay:this.fireDelay,
				fireX:this.fireX,
				fireY:this.fireY,
				fired:this.fired,
				hasControls:this.hasControls,
				isPlayer:this.isPlayer,
				leftClick:this.leftClick,
				mainPlayer:false,
				hyp:this.hyp,
				id:currentUser.uid,
				jumpCount:this.jumpCount,
				jumpForce:{
					x:this.jumpForce.x,
					y:this.jumpForce.y,
					z:this.jumpForce.z,
				},
				maxHP:this.maxHP,
				maxJumps:this.maxJumps,
				pos:{
					x:this.pos.x,
					y:this.pos.y,
					z:this.pos.z,
				},
				radius:this.radius,
				target:{
					x:this.target.x,
					y:this.target.y,
					z:this.target.z,
				},
				userName:currentUser.displayName || (currentUser.providerData[0].displayName || currentUser.providerData[0].uid),
				vel:{
					x:this.vel.x,
					y:this.vel.y,
					z:this.vel.z,
				}
			});
		}
	}
    this.update=function(){
	this.applyForce(gravity);
	if(!this.bullets.includes(this.bullet)){
	    this.bullets.push(this.bullet);
	    this.fired[this.bullet.name]=false;
	    this.fireDelay[this.bullet.name]=0;
	}
	this.checkJump();
	// if(this.hasControls){
	//     println(this.jumpCount+"/"+this.maxJumps+", "+this.canJump);
	// }
	this.checkCollisions();
	if(this.vel.x > 0.2 || this.vel.x < -0.2){
	    this.vel.x=lerp(this.vel.x,0,0.05);
	}else{
	    this.vel.x=0;
	}
	if(this.vel.y > 0.2 || this.vel.y < -0.2){
	    this.vel.y=lerp(this.vel.y,0,0.05);
	}else{
	    this.vel.y=0;
	}
	if(this.fired[this.bullet.name]){
	    this.fireDelay[this.bullet.name]--;
	    if(this.fireDelay[this.bullet.name]<=0){

		this.fired[this.bullet.name]=false;
	    }
	}
	if(this.hasControls && this.mainPlayer && this.controls){
		this.leftClick = mouse.left;
	    this.aim(this.crosshair.x,this.crosshair.y);
	    for(var control in this.controls){
		if(this.controls[control].isKey){
		    if(keys[this.controls[control].name]){
			if(this.controls[control].a === 0){
			    this.controls[control].func();
			}else if(this.controls[control].a===1){
			    this.controls[control].func(this);
			}
		    }
		}else if(this.controls[control].isMouse){
		    if(mouse[this.controls[control].name]){
			if(this.controls[control].a === 0){
			    this.controls[control].func();
			}else if(this.controls[control].a===1){
			    this.controls[control].func(this);
			}
		    }
		}
	    }
	}
	if(this.leftClick){
		this.fire();
	}
	this.pos.add(this.vel);
        for(var i = 0; i < this.Projectiles.length; i++){
		if(this.Projectiles[i]){
            		this.Projectiles[i].update();
		}
        }
	if(this.isPlayer && this.mainPlayer){
		this.updateDatabase();
	}
        if(this.HP<=0){
            for(var i = 0; i < globals.length; i++){
                if(globals[i].id === this.id){
                    globals.splice(i,1);
                }
            }
        }
    };
    this.draw= function(){
        stroke(0);
        strokeWeight(1);
        fill(255);
        ellipse(this.pos.x,this.pos.y,this.radius,this.radius);
        if(this.hasControls){
            if(this.fireX && this.fireY){
                stroke(0);
                line(this.pos.x,this.pos.y,this.pos.x+this.fireX,this.pos.y+this.fireY);
            }
            noFill();
            stroke(0,0,255,140);
            strokeWeight(2);
            line(this.crosshair.x+4,this.crosshair.y,this.crosshair.x+10,this.crosshair.y);
            line(this.crosshair.x-4,this.crosshair.y,this.crosshair.x-10,this.crosshair.y);
            line(this.crosshair.x,this.crosshair.y+4,this.crosshair.x,this.crosshair.y+10);
            line(this.crosshair.x,this.crosshair.y-4,this.crosshair.x,this.crosshair.y-10);
            
        }
        for(var i = 0; i < this.Projectiles.length; i++){
		if(this.Projectiles[i]){
			this.Projectiles[i].draw();
		}
        }
        fill(255);
        stroke(0);
        rect(this.pos.x-this.radius,this.pos.y-this.radius,40,5);
        fill(map(this.fireDelay[this.bullet.name],this.bullet.rate,0,255,0),map(this.fireDelay[this.bullet.name],this.bullet.rate,0,0,255),0);
        noStroke();
        rect(this.pos.x-this.radius,this.pos.y-this.radius,map(this.fireDelay[this.bullet.name],this.bullet.rate,0,0,40),5);
        fill(0);
        text(this.HP+"/"+this.maxHP,this.pos.x-this.radius,this.pos.y-22);
	if(this.userName){
		text(this.userName,this.pos.x-this.radius,this.pos.y-42);
	}
        if(this.hasControls){
            fill(0);
            text(this.bullet.name,this.pos.x-this.radius,this.pos.y+this.radius);
        }
    };
    globals.push(this);
}




function keyPressed(){
    keys[keyCode]=true;
	if(keys[103]){
		player.pos = createVector(mouseX,mouseY); // Teleport
	}
}
function keyReleased(){
    keys[keyCode]=false;
}
function mousePressed(e){
	if(e.target){
		if(e.target.tagName === "CANVAS"){
		    mouse[mouseButton]=true;
		    for(var i = 0; i < buttons.length; i++){
			buttons[i].onClick();
		    }
		}
	}
}
function mouseReleased(){
    mouse[mouseButton]=false;
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i].instReleasedObj){
            for(var j = 0; j < buttons[i].instReleasedObj.length; j++){
                if(buttons[i].instReleasedObj[j]){
                    buttons[i].onRelease();
                }
            }
        }
        if(buttons[i].instReleased){
            buttons[i].onRelease();
        }
    
    }
}
//Mouse & Key Events
//SETUP FUNCTION
function setup(){
  createCanvas(1000,500);
	//_app = angular.module('Panel',[]);
	frameRate(60);
  colorMode(RGB);
  angleMode(DEGREES);
Math.Tau=Math.PI*2;
Tau=Math.Tau;
globals = [];
keys=[];
mouse=[];
	mouse.left = false;
buttons = [];
platforms = [];
f = 0;
fp = 0;
fps = 0;
framerate = 0;
framess = 0;
	
bullet_sound = getSound("rpg/hit-splat");
bullet_hit = getSound("rpg/hit-whack");
rocket_sound = getSound("retro/thruster-short");
rocket_explode = getSound("retro/boom2");

//Starting stuff
state="game";
dbug = false;
bg = color(200);
gravity = createVector(0,1);
allBullets={
enemyBullet:{
    speed:8,
    damage:0,
    rate:300000,
    name:"pistol",
    type:"normal",
    accuracy:75,
    force:2,
    fire_sound:bullet_sound,
    hit_sound:bullet_hit,
},
minigunBullet:{
    speed:15,
    damage:1,
    rate:3,
    name:"minigun",
    type:"normal",
    accuracy:30,
    force:0.5,
    fire_sound:bullet_sound,
    hit_sound:bullet_hit,
},
defaultBullet:{
    speed:10,
    damage:5,
    rate:15,
    name:"pistol",
    type:"normal",
    accuracy:70,
    force:2,
    fire_sound:bullet_sound,
    hit_sound:bullet_hit,
},
rocketBullet:{
    speed:10,
    damage:10,
    rate:100,
    name:"rocket",
    type:"rocket",
    accuracy:90,
    force:20,
    radius:125,
    fire_sound:rocket_sound,
    hit_sound:rocket_explode,
}};
  //Bullets
  // Gun creation
// x, y, bullet name, radius, detection range, maxHP, name
test = new Gun(200,200,"enemyBullet",20,100,100,"gun");
if(currentUser){
	firebase.database().ref("arcade/users").once('value').then(function(data){
		if(data.child(currentUser.uid).exists()){
			var data2 = data.child(currentUser.uid).val();
			player = new Entity(
				data2.pos.x,		//X Position
				data2.pos.y,		//Y Position
				data2.radius,		//Radius of body
				currentUser.uid,	//ID of user
				data2.maxHP,		//Max Health
				data2.bulletName,	//Name of bullet
				true,			//Is a player: Most likely
				true			//Is main player: NO
			);
			player.HP=data2.HP;
			player.bulletName = data2.bulletName;
			player.bullet=allBullets[data2.bulletName];
			player.canJump=data2.canJump;
			player.crosshair = createVector(data2.crosshair.x,data2.crosshair.y,data2.crosshair.z);
			player.fired=data2.fired;
			player.fireDelay=data2.fireDelay;
			player.isPlayer=true;
			player.leftClick=data2.leftClick;
			player.mainPlayer=true;
			player.id = data2.id;
			player.jumpCount=data2.jumpCount;
			player.jumpForce = createVector(data2.jumpForce.x,data2.jumpForce.y,data2.jumpForce.z);
			player.maxHP=data2.maxHP;
			player.maxJumps=data2.maxJumps;
			player.pos = createVector(data2.pos.x,data2.pos.y,data2.pos.z);
			player.radius=data2.radius;
		}else{
			player = new Entity(random(0,width),random(0,height),20,currentUser.uid,100,"minigunBullet", true, true);
		}
	});
}else{
	player = new Entity(random(0,width),random(0,height),20,"player",100,"minigunBullet", true, true);
}

for(var i = 0; i < 2; i++){
new Entity(random(0,width),random(0,height),20,"target",20);
}
playGame = new Button(width/2,height/3,100,32,"Play","menu",function(){state = "game";});
helpBtn = new Button(width/2,height/2.5,100,32,"Controls","menu",function(){state = "help";});
testDrop = new Dropdown(width/2,(height/2.5)+helpBtn.height/2+(dist(0,playGame.y+playGame.height,0,helpBtn.y-helpBtn.height)),100,32,"Options","menu",[
    new Option("Set background",function(){
        state="background";
    }),
    new Option("Debug Mode\n"+((""+dbug).toUpperCase()),function(){
        dbug = !dbug;
        this.txt = "Debug Mode\n"+((""+dbug).toUpperCase());
    }),
]);

bgR=red(bg);
bgG=green(bg);
bgB=blue(bg);

bgrP1Btn = new Button(((width/2)-52),(height/5),50,28,"Red\n+1","background",function(){
    bgR = constrain(bgR+1,0,255);
});
bgrP5Btn = new Button(((width/2)-52)+52,(height/5),50,28,"Red\n+5","background",function(){
    bgR = constrain(bgR+5,0,255);
});
bgrP10Btn = new Button(((width/2)-52)+104,(height/5),50,28,"Red\n+10","background",function(){
    bgR = constrain(bgR+10,0,255);
});
bgrM1Btn = new Button(((width/2)-52),(height/5)+30,50,28,"Red\n-1","background",function(){
    bgR = constrain(bgR-1,0,255);
});
bgrM5Btn = new Button(((width/2)-52)+52,(height/5)+30,50,28,"Red\n-5","background",function(){
    bgR = constrain(bgR-5,0,255);
});
bgrM10Btn = new Button(((width/2)-52)+104,(height/5)+30,50,28,"Red\n-10","background",function(){
    bgR = constrain(bgR-10,0,255);
});
//Red BG Control


bggP1Btn = new Button(((width/2)-52),(height/5)+60,50,28,"Green\n+1","background",function(){
    bgG = constrain(bgG+1,0,255);
});
bggP5Btn = new Button(((width/2)-52)+52,(height/5)+60,50,28,"Green\n+5","background",function(){
    bgG = constrain(bgG+5,0,255);
});
bggP10Btn = new Button(((width/2)-52)+104,(height/5)+60,50,28,"Green\n+10","background",function(){
    bgG = constrain(bgG+10,0,255);
});
bggM1Btn = new Button(((width/2)-52),(height/5)+90,50,28,"Green\n-1","background",function(){
    bgG = constrain(bgG-1,0,255);
});
bggM5Btn = new Button(((width/2)-52)+52,(height/5)+90,50,28,"Green\n-5","background",function(){
    bgG = constrain(bgG-5,0,255);
});
bggM10Btn = new Button(((width/2)-52)+104,(height/5)+90,50,28,"Green\n-10","background",function(){
    bgG = constrain(bgG-10,0,255);
});
//Green BG Control

bgbP1Btn = new Button(((width/2)-52),(height/5)+120,50,28,"Blue\n+1","background",function(){
    bgB = constrain(bgB+1,0,255);
});
bgbP5Btn = new Button(((width/2)-52)+52,(height/5)+120,50,28,"Blue\n+5","background",function(){
    bgB = constrain(bgB+5,0,255);
});
bgbP10Btn = new Button(((width/2)-52)+104,(height/5)+120,50,28,"Blue\n+10","background",function(){
    bgB = constrain(bgB+10,0,255);
});
bgbM1Btn = new Button(((width/2)-52),(height/5)+150,50,28,"Blue\n-1","background",function(){
    bgB = constrain(bgB-1,0,255);
});
bgbM5Btn = new Button(((width/2)-52)+52,(height/5)+150,50,28,"Blue\n-5","background",function(){
    bgB = constrain(bgB-5,0,255);
});
bgbM10Btn = new Button(((width/2)-52)+104,(height/5)+150,50,28,"Blue\n-10","background",function(){
    bgB = constrain(bgB-10,0,255);
});
//Blue BG Control
setBG = new Button(((width/2)),(height/5)+180,50,28,"Apply","background",function(){
    bg = color(bgR,bgG,bgB);
});
//Background Control

backToMenu = new Button(50,16,100,32,"<- Menu","game",function(){state = "menu";});
backToMenu2 = new Button(50,16,100,32,"<- Menu","help",function(){state = "menu";});
backToMenu3 = new Button(50,16,100,32,"<- Menu","background",function(){state = "menu";});
//Create UI
p1c = {
    goLeft:{
        name:65,
        isKey:true,
        isMouse:false,
        a:1,
        func:function(ent){
            if(ent.vel.x > -3.4 &&
                !ent.colliding.left){
                ent.applyForce(createVector(-0.6,0));
            }
        },
    },
    goRight:{
        name:68,
        isKey:true,
        isMouse:false,
        a:1,
        func:function(ent){
            if( ent.vel.x < 3.4 &&
                !ent.colliding.right){
                ent.applyForce(createVector(0.6,0));
            }
        },
    },
    goUp:{
        name:87,
        isKey:true,
        isMouse:false,
        a:1,
        func:function(ent){
            if(ent.vel.y > -3.4 && !ent.colliding.top){
                if(ent.canJump){
                    ent.jump();
                }
            }
        },
    },
    goDown:{
        name:83,
        isKey:true,
        isMouse:false,
        a:1,
        func:function(ent){
            if( ent.vel.y < 3.4 &&
                !ent.colliding.bottom){
                ent.applyForce(createVector(0,0.6));
            }
        },
    },
    fire:{
        name:32,
        isKey:true,
        isMouse:false,
        a:1,
        func:function(ent){
            ent.leftClick = true;
        },
    },
    fireMouse:{
        name:'left',
        isKey:false,
        isMouse:true,
        a:1,
        func:function(ent){
            ent.leftClick = true;
        },
    },
    setGun_minigun:{
        name:49,
        isKey:true,
        isMouse:false,
        a:1,
        func:function(ent){
		ent.bulletName="minigunBullet";
            ent.bullet=allBullets["minigunBullet"];
        },
    },
    setGun_pistol:{
        name:50,
        isKey:true,
        isMouse:false,
        a:1,
        func:function(ent){
		ent.bulletName="defaultBullet";
            ent.bullet=allBullets["defaultBullet"];
        },
    },
    setGun_rocket:{
        name:51,
        isKey:true,
        isMouse:false,
        a:1,
        func:function(ent){
		ent.bulletName="rocketBullet";
            ent.bullet=allBullets["rocketBullet"];
        },
    },
};//P1 Controls
	
player.setControls(p1c);
}
function mouseMoved(){
	if(player){
		player.crosshair.x=mouseX;
		player.crosshair.y=mouseY;
	}
}
function mouseDragged(){
	if(player){
		player.crosshair.x=mouseX;
		player.crosshair.y=mouseY;
	}
}
function menu(){

}//Menu
function game(){
    if(frameCount%round(random(50,70))===0){
        test.moveAround(random(-5,5),random(-5,5));
    }
    var closest=findClosest(test);
    if(closest){
        if(dist(closest.pos.x,closest.pos.y,test.pos.x,test.pos.y)<
        (test.range+(closest.radius/2))){
            test.aim(closest.pos.x,closest.pos.y);
            //if(frameCount%(test.speed+round(random(0,4)*15))===0){
            if(frameCount%1===0){
                test.fire();
            }
        }
    }
    for(var i = 0; i < globals.length;i++){
        if(globals[i]){
            globals[i].update();
        }
        if(globals[i]){
            globals[i].draw();
        }
    }
    for(var i = 0; i < platforms.length; i++){
        if(platforms[i]){
            platforms[i].update();
        }
        if(platforms[i]){
            platforms[i].draw();
        }
    }
}//Game
function help(){
    textAlign(CENTER,CENTER);
    fill(0);
    textSize(18);
    text("    Num Row 1 - Select Minigun\nNum Row 2 - Select Pistol\n  Num Row 3 - Select Rocket\nW - Crosshair Up      \nA - Crosshair Left   \nS - Crosshair Down\nD - Crosshair Right \nSpacebar - Shoot      \nUp Arrow - Move Up\nLeft Arrow - Move Left\nDown Arrow - Move Down\nRight Arrow - Move Right",width/2,height/2);
    textAlign(LEFT, BASELINE);
    textSize(12);
}//Help
function bckground(){
    stroke(0);
    strokeWeight(2);
    fill(bgR,bgG,bgB);
    ellipse(width/2,(height/5)+240,70,70);
    strokeWeight(1);
    rectMode(CENTER);
    fill(255);
    rect((width/2)-80,(height/5)+240,70,50);
    rectMode(CORNER);
    textAlign(CENTER,CENTER);
    fill(0);
    text("Red: "+bgR+"\nGreen: "+bgG+"\nBlue: "+bgB,(width/2)-80,(height/5)+240);
    textAlign(LEFT,BASELINE);
}//Background
//globals.filter(function(ent){return ent.id.includes("target")})
function checkPlayers(){
	if(currentUser){
		if(users){
			//Go through global and check if any ids in users are not present
			//If an id is not present, create a new entity
			var tempGlobals = globals.filter(function(ent){
				var toReturn = false;
				for(var i in users){
					//if ent.id === i, it means globals contains that user
					//if not, globals does not contain the user, and needs to add it
					if(ent.id === i){
						toReturn = true;
					}
				}
				return toReturn
			});
 			var missingUsers = Object.values(users).filter(function(ent){
				var toReturn = true;
				for(var i = 0; i < tempGlobals.length; i++){
					if(tempGlobals[i].id === ent.id){
						toReturn = false;
					}
				}
				return toReturn;
 			});
			for(var i = 0; i < missingUsers.length; i++){
				var userToAdd = missingUsers[i].id;
				var NotGoingToWork = new Entity(
					users[userToAdd].pos.x,		//X Position
					users[userToAdd].pos.y,		//Y Position
					users[userToAdd].radius,	//Radius of body
					users[userToAdd].id,		//ID of user
					users[userToAdd].maxHP,		//Max Health
					users[userToAdd].bulletName,	//Name of bullet
					users[userToAdd].isPlayer,	//Is a player: Most likely
					users[userToAdd].mainPlayer	//Is main player: NO
				);
				firebase.database().ref("arcade/users/"+userToAdd).on('value',function(data){
					if(users[userToAdd].isPlayer && !NotGoingToWork.mainPlayer){
						var data2 = data.val();
						NotGoingToWork.HP=data2.HP;
						var FixingProj = data2.Projectiles || [];
						var NewProj = FixingProj;
						NotGoingToWork.acc=createVector(data2.acc.x,data2.acc.y,data2.acc.z);
						NotGoingToWork.angle=data2.angle;
						NotGoingToWork.bulletName = data2.bulletName;
						NotGoingToWork.bullet=allBullets[data2.bulletName];
						NotGoingToWork.canJump=data2.canJump;
						NotGoingToWork.colliding=data2.colliding;
						NotGoingToWork.crosshair = createVector(data2.crosshair.x,data2.crosshair.y,data2.crosshair.z);
						NotGoingToWork.fired=data2.fired;
						NotGoingToWork.fireDelay=data2.fireDelay;
						NotGoingToWork.fireX=data2.fireX;
						NotGoingToWork.fireY=data2.fireY;
						NotGoingToWork.hasControls=data2.hasControls;
						NotGoingToWork.isPlayer=data2.isPlayer;
						NotGoingToWork.leftClick=data2.leftClick;
						NotGoingToWork.mainPlayer=false;
						NotGoingToWork.hyp=data2.hyp;
						NotGoingToWork.id = data2.id;
						NotGoingToWork.jumpCount=data2.jumpCount;
						NotGoingToWork.jumpForce = createVector(data2.jumpForce.x,data2.jumpForce.y,data2.jumpForce.z);
						NotGoingToWork.maxHP=data2.maxHP;
						NotGoingToWork.maxJumps=data2.maxJumps;
						NotGoingToWork.pos = createVector(data2.pos.x,data2.pos.y,data2.pos.z);
						NotGoingToWork.radius=data2.radius;
						NotGoingToWork.target = createVector(data2.target.x,data2.target.y,data2.target.z);
						if(data2.userName){
							NotGoingToWork.userName = data2.userName;
						}
						NotGoingToWork.vel = createVector(data2.vel.x,data2.vel.y,data2.vel.z);
// 						if(NotGoingToWork.fired[NotGoingToWork.bullet.name]){
// 							NotGoingToWork.fire();
// 						}
					}
				});
			}
		}
	}
}
function draw(){
    try{
	if(player){
		if(currentUser){
			player.id = currentUser.uid;
			player.userName = currentUser.displayName || (currentUser.providerData[0].displayName || currentUser.providerData[0].uid);
		}
		if(!globals.includes(player)){
			player.HP = 100;
			player.pos.x = random(0, width);
			player.pos.y = random(0, height);
			globals.push(player);
		}
	}
        background(bg);
        fpsScript();
        fill(255);
        text(framerate,20,20);
        if(state === "menu"){
            
        }else if(state === "game"){
		if(frameCount%20 === 0){
			checkPlayers();
		}
		game();
        }else if(state === "help"){
            help();
        }else if(state === "background"){
            bckground();
        }
        for(var i = 0; i < buttons.length; i++){
            buttons[i].update();
            buttons[i].draw();
        }
    }catch(err){
        console.error(err);
    }
}
