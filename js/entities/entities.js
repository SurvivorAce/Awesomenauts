game.PlayerEntity = me.Entity.extend({
	init: function(x, y, settings) {
		this.setSuper(x, y);
		this.setPlayerTimers();
		this.setAttributes();
		this.type = "PlayerEntity";
		this.setFlags();
		
 		
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.addAnimation();

		this.renderable.setCurrentAnimation("idle");

	},

	setSuper: function(x, y) {
		this._super(me.Entity, 'init', [x, y, {
			image: "player",
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function() {
				return(new me.Rect (0, 0, 64, 64)).toPolygon();
			}	
		}]);
	},

	setPlayerTimers: function() {
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastShard = this.now;
		this.lastAttack = new Date().getDate(); 

	},

	setAttributes: function() {
		this.health = game.data.playerHealth;
		//Sets current position
		this.body.setVelocity(game.data.playerMoveSpeed, 20);		
		this.attack = game.data.playerAttack;		
	},

	setFlags: function() {
		//*Keeps track of which direction your character is going
		this.facing = "right";
		this.dead = false;
		this.attacking = false;
	},

	addAnimation: function() {
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [143, 144, 145, 146, 147, 148, 149, 150, 151], 80);
		this.renderable.addAnimation("attack", [247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259], 50);
	},

	update: function(delta) {
		this.now = new Date().getTime();
		this.dead = this.checkifDead();
		this.checkKeyPressesAndMove();
		this.checkAbilityKeys();
		this.setAnimation();
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta);
		this._super(me.Entity, "update", [delta]);
		return true;
	},

	checkifDead: function() {
		if (this.health <= 0) {
			return true;
		}
		return false;
	},

	checkKeyPressesAndMove: function() {
		if(me.input.isKeyPressed("right")){
			this.moveRight();
		}
		else if(me.input.isKeyPressed("left")){
			this.moveLeft();
		}
		else{
			this.body.vel.x = 0;
		}		

		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
			this.jump();
		}

		this. attacking = me.input.isKeyPressed("attack");
	},

	moveRight: function() {
		//Adds to the position of my x by the velocity defined above in 
		//setVelocity() and multiplying it by me.timer.tick 
		//me.timer.tick makes movement look smooth*/
		this.body.vel.x += this.body.accel.x * me.timer.tick;
		this.facing = "right";
		this.flipX(false);
	},

	moveLeft: function() {
		this.facing = "left";
		this.body.vel.x -= this.body.accel.x * me.timer.tick;
		this.flipX(true);
	},

	jump: function() {
		this.body.jumping = true;
		this.body.vel.y -= this.body.accel.y * me.timer.tick;		
	},

	checkAbilityKeys: function() {
		if(me.input.isKeyPressed("skill1")) {
			this.iceShard();
		}
		else if(me.input.isKeyPressed("skill2")) {
			//this.asIncrease();
		}
		else if(me.input.isKeyPressed("skill3 ")) {
			//this.moreGold();
		}		
	},

	iceShard: function() {
		if((this.now-this.lastShard) >= game.data.shardTimer*1000 && game.data.ability1 >= 0) {
			this.lastShard = this.now;
			var shard = me.pool.pull("shard", this.pos.x, this.pos.y, {}, this.facing);
			me.game.world.addChild(shard, 10);
		}
	},

	setAnimation: function() {
		if(this.attacking){
			if(!this.renderable.isCurrentAnimation("attack")){
				//Sets the current animation to attack and once that is over
				//goes back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//Makes it so that the next time we start this sequence we begin
				//from the first animation, not wherever we left off when we
				//switched to another animation
				this.renderable.setAnimationFrame();
			}
		}				

		else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
			if(!this.renderable.isCurrentAnimation("walk")){
				this.renderable.setCurrentAnimation("walk");
			}
		}
		else if(!this.renderable.isCurrentAnimation("attack")){
			this.renderable.setCurrentAnimation("idle");
		}
	},

	loseHealth: function(damage) {
		this.health = this.health - damage;
	},

	collideHandler: function(response) {
		if (response.b.type==='EnemyBaseEntity') {
			this.collideWithEnemyBase(response);
		}
		else if(response.b.type==='EnemyCreep') {
			this.collideWithEnemyCreep(response);
		}
	},

	collideWithEnemyBase: function(response) {
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;

			if(ydif<-40 && xdif< 70 && xdif>-35){
				this.body.falling = false;
				this.body.vel.y = -1;
			}
			else if(xdif>-35 && this.facing==='right' && (xdif<0)){
				this.body.vel.x = 0;
			}
			else if(xdif<70 && this.facing==='left' && (xdif>0)){
				this.body.vel.x = 0;
			}
			if(this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
				this.lastHit = this.now;
				response.b.loseHealth(game.data.playerAttack);
			}
	},

	collideWithEnemyCreep: function(response) {
		var xdif = this.pos.x - response.b.pos.x;
		var ydif = this.pos.y - response.b.pos.y;

		this.stopMovement(xdif);

		if (this.checkAttack(xdif, ydif)) {
			this.hitCreep(response);	
		};
	},

	stopMovement: function(xdif) {
		if(xdif>0) {
			if(this.facing==="right"){
				this.body.vel.x = 0;
			}
		}
		else {
			if(this.facing==="left"){
				this.body.vel.x = 0;
			}
		}		
	},

	checkAttack: function(xdif, ydif) {
		if (this.renderable.isCurrentAnimation('attack') && this.now-this.lastHit >= game.data.playerAttackTimer && (Math.abs(ydif<=40) && 
			((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right")
			)){
			this.lastHit = this.now;
			//if the creeps health is less than our attack, execute code in if statement
			return true;
		}		
		return false;
	},

	hitCreep: function(response) {
	
		if(response.b.health <= game.data.playerAttack) {
			//adds one gold for a creep kill
			game.data.gold += 1;
			console.log("Current gold: " + game.data.gold);
		}

		response.b.loseHealth(game.data.playerAttack1);				
	}

});



