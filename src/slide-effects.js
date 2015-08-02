define('slide-effects', function(require, exports, module){

	var BaseEffect = function(){
		this._initBaseEffect();
	};

	BaseEffect.prototype = {
		_initBaseEffect: function(){
			this.isAnimating = false;
		},

		initUI: function(){},

		relayout: function(){},

		next: function(current, next, callback){
			current.css({left: 0}).show().animate({left: 0-current.width()});
			next.css({left: next.width()}).show().animate({left: 0}, function(){
				callback && callback();
				// self.isAnimating = false;
			});	
		},

		prev: function(current , prev, callback){
			current.css({left: 0}).show().animate({left: current.width()});
            prev.css({left: 0-prev.width()}).show().animate({left: 0}, function(){
            	callback && callback();
                // self.isAnimating = false;
            });
		},

		show: function(){}
	};

	var VerticalEffect = function(){
		this._initBaseEffect();
	};

	VerticalEffect.prototype = {
		_initBaseEffect: function(){
			this.isAnimating = false;
		},

		initUI: function(){},

		relayout: function(){},

		next: function(current, next, callback){
			current.css({top: 0}).show().animate({top: 0-current.height()});
			next.css({top: next.height()}).show().animate({top: 0}, function(){
				callback && callback();
				// self.isAnimating = false;
			});	
		},

		prev: function(current , prev, callback){
			current.css({top: 0}).show().animate({top: current.height()});
            prev.css({top: 0 - prev.height()}).show().animate({top: 0}, function(){
            	callback && callback();
                // self.isAnimating = false;
            });
		},

		show: function(){}
	};

	var FadeEffect = function(){
		this._initFadeEffect();
	};

	FadeEffect.prototype = {
		_initFadeEffect: function(){
			this.isAnimating = false;
		},

		initUI: function(){},

		relayout: function(){},

		next: function(current, next, callback){
			current.css({left: 0, zIndex: 100}).show().fadeOut('slow');
			next.css({left: 0, zIndex: 99}).hide().fadeIn('slow', function(){
				callback && callback();
				// self.isAnimating = false;
			});	
		},

		prev: function(current , prev, callback){
			current.css({left: 0, zIndex: 100}).show().fadeOut('slow');
            prev.css({left: 0, zIndex: 99}).hide().fadeIn('slow', function(){
            	callback && callback();
                // self.isAnimating = false;
            });
		},

		show: function(){}
	};


	exports.BaseEffect = BaseEffect;
	exports.FadeEffect = FadeEffect;
	exports.VerticalEffect = VerticalEffect;

});