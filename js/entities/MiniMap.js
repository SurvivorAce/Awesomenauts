game.MiniMap = me.Entity.extend ({
	init: function(x, y, settings){
		this._super(me.Entity, "init", [x, y, {
			image: "minimap",
			width: 842,
			height: 254,
			spritewidth: "842",
			spriteheight: "254",
			getShape: function() {
				return(new me.Rect (0, 0, 842, 254)).toPolygon();
			}
		}]);
		this.floating = true;

	}
});