// (function(){
    let width;
    let height;
    let FRAME=0;
    function constrain(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
    function map(val, in_min, in_max, out_min, out_max) {
        return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    function random() {
        switch(arguments.length){
            default:
            case 0:
                return Math.random();
            case 1:
                return Math.random() * arguments[0];
            case 2:
                return map(Math.random(),0,1,arguments[0],arguments[1]);
        }
    }
    function background() {
        let context = arguments[0];
        let color;
        switch(arguments.length) {
            case 2:
                color = `rgba(${arguments[1]},${arguments[1]},${arguments[1]},255)`;
                break;
            case 3:
                color = `rgba(${arguments[1]},${arguments[1]},${arguments[1]},${arguments[2]})`;
                break;
            case 5:
                color = `rgba(${arguments[1]},${arguments[2]},${arguments[3]},${arguments[4]})`;
                break;
        }
        context.fillStyle=color;
        context.fillRect(0,0,width,height);
    }
    
    function fill() {
        let context = arguments[0];
        let color;
        switch(arguments.length) {
            case 2:
                color = `rgba(${arguments[1]},${arguments[1]},${arguments[1]},255)`;
                break;
            case 3:
                color = `rgba(${arguments[1]},${arguments[1]},${arguments[1]},${arguments[2]})`;
                break;
            case 5:
                color = `rgba(${arguments[1]},${arguments[2]},${arguments[3]},${arguments[4]})`;
                break;
        }
        context.fillStyle=color;
    }
    function stroke() {
        let context = arguments[0];
        let color;
        switch(arguments.length) {
            case 2:
                color = `rgba(${arguments[1]},${arguments[1]},${arguments[1]},255)`;
                break;
            case 3:
                color = `rgba(${arguments[1]},${arguments[1]},${arguments[1]},${arguments[2]})`;
                break;
            case 5:
                color = `rgba(${arguments[1]},${arguments[2]},${arguments[3]},${arguments[4]})`;
                break;
        }
        context.strokeStyle=color;
    }
    function noStroke(context) {
        context.strokeStyle="rgba(0,0,0,0)";
    }
    function lerp(v0, v1, t) {
        return v0*(1-t)+v1*t;
    }
    function dist(x1,x2,y1,y2) {
        return Math.sqrt(Math.pow((x1-x2),2)+Math.pow(y1-y2,2));
    }
    function line(context, x1, y1, x2, y2) {
        context.moveTo(x1, y1);
        context.lineTo(x2-x1, y2-y1);
    }
    function ellipse(context, x, y, r1, r2) {
        context.ellipse(x, y, r1, r2, 0, 0, 0);
    }
    var canvas = document.querySelector("#canvasBG");
    var cxt = canvas.getContext('2d');
    stroke(cxt,0);
    fill(cxt,255,0,0);
    var darkMode = false;
    var particleCount = 150;
    var particles = [];
    var maxProximityToDraw = 50;
    var maxLife = 10;
    function Particle(x, y, lifetime, id) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.vel = {
            x:random(-0.5,0.5),
            y:random(-0.5,0.5)
        };
        this.lifetime = lifetime;
        this.life = 0;
        this.particleOpacity = constrain(Math.abs(Math.sin(map(this.life,0,this.lifetime,0,90)*2) *255)*2,0,255);
        this.updateOpacity = function() {
            this.particleOpacity = constrain(Math.abs(Math.sin(map(this.life,0,this.lifetime,0,90)*2) *255)*2,0,255);
        };
        this.destroy = function() {
            var rX = random(0, width);
            var rY = random(0, height);
            var rLife = random(0, maxLife * 60);
            particles[this.id] = new Particle(rX,rY,rLife,this.id);
        };
        this.draw = function() {
            noStroke(cxt);
            fill(cxt,0,0,0,this.particleOpacity);
            ellipse(cxt,this.x, this.y, 4, 4);
        };
        this.update = function() {
            if(this.life >= this.lifetime) {
                this.life = 0;
                this.destroy();
            }
            this.life++;
            this.updateOpacity();
            this.x += this.vel.x;
            this.y += this.vel.y;
        };
    }
    function drawLines() {
        var particlesChecked = [];
        for(var i = 0; i < particles.length; i++){
            particlesChecked[i] = [];
            var particle1 = particles[i];
            for(var j = particles.length - 1; j >= 0 && j !== i; j--) {
                particlesChecked[i].push(j);
                var particle2 = particles[j];
                var pDist = dist(particle1.x, particle1.y, particle2.x, particle2.y);
                if(pDist < maxProximityToDraw) {
                    var o = lerp(particle1.particleOpacity, particle2.particleOpacity, 0.5) * map(pDist / maxProximityToDraw, 0, 1, 1, 0);
                    stroke(cxt, 255, 125, 0, o);
                    line(cxt, particle1.x, particle1.y, particle2.x, particle2.y);
                }
            }
        }
    };
    function setup() {
        for(var i = 0; i < particleCount; i++){
            var rX = random(0, width);
            var rY = random(0, height);
            var rLife = random(60 * maxLife);
            particles.push(new Particle(rX, rY, rLife, i));
        }
    };
    function draw() {
        background(cxt, darkMode?0:255);
        for(var i = 0; i < particles.length; i++) {
            particles[i].update();
            if(!darkMode){
                particles[i].draw();
            }
        }
        drawLines();
    };

    setup();
    function loop(FRAME){
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        draw();
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
// })();