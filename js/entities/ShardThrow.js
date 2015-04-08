game.ShardThrow = me.Entity.extend({
	init: function(x, y, settings, facing) {
		this._super(me.Entity, "init", [x, y, {
			image: "shard",
			width: 48,
			height: 48,
			spritewidth: "48",
			spriteheight: "48",

			getShape: function() {
				return (new me.Rect(0, 0, 48, 48)).toPolygon();
				// this shows the hight of the bases
			}
		}]);
		this.alwaysUpdate = true;
		this.body.setVelocity(8, 0);
		this.attack = game.data.ability1*3;
		this.type = "shard";
		this.facing = facing;
	},

	update: function(delta) {
		if(this.facing === "right") {
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}
		else {
			this.body.vel.x -= this.body.accel.x * me.timer.tick;	
		}
		me.collision.check(this, true, this.collideHandler.bind(this), true);

		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	collideHandler: function(response) {
		if (response.b.type==='EnemyBase' || response.b.type==='EnemyCreep') {
			response.b.loseHealth(this.attack);
			me.game.world.removeChild(this);
			//noticed that if you killed a creep with the ice shard you didn't
			//get gold so I added this so you get gold on ALL creep kills
			if(response.b.health < game.data.ability1) {
				//adds one gold for a creep kill
				game.data.gold += 5;
				console.log("Current gold: " + game.data.gold);
			}
		}
	}
});