define('slider', function(require, exports, module){
	var tools = require('./tools');
    var effects = new require('./slide-effects');
	var Slider = function(options){
        this._initSlider(options);
    };

    Slider.prototype = {
        _initSlider: function(options){
            tools.EventEmitter.call(this);
            this.options = tools.mix({
                container: '',
                wrapper: '',
                items: '',
                prevBtn: '',
                nextBtn: '',
                pagination: '',
                loop: false,
                autoplay: false,
                autoplayInterval: 3000,
                effect: 'BaseEffect'
            }, options);
            this.panel = $(this.options.container);
            this.prevBtn = this.panel.find(this.options.prevBtn);
            this.nextBtn = this.panel.find(this.options.nextBtn);
            this.pointer = 0;
            this.total = this.panel.find(this.options.items).length;
            this.width = this.panel.width();
            this.height = this.panel.height();
            this.isAnimating = false;
            this.initUI();
            this.initEvents();
            this.emit('show', {pointer: 0});
            this.timer = null;

            this.effect = new effects[this.options.effect];

            var self = this;
            if(this.options.autoplay){
                this.play();
                this.panel.hover(function(){
                    self.pause();
                }, function(){
                    self.play();
                });
            }
        },


        play: function(){
            var self = this;
            if(this.timer){
                clearInterval(this.timer);
            }
            this.timer = setInterval(function(){
                self.next();
            }, this.options.autoplayInterval);

            
        },

        pause: function(){
            clearInterval(this.timer);
            this.timer = null;
        },

        initUI: function(){
        	this.panel.find(this.options.items).width(this.width).height(this.height).css({position: 'absolute', top:0}).hide();
        	this.panel.find(this.options.items).eq(0).show();

            this.prevBtn.addClass('disable');
            this.nextBtn.removeClass('disable');

            if(this.total == 1){
                this.prevBtn.addClass('disable');
                this.nextBtn.addClass('disable');
            }

            if(this.options.pagination !== ''){
                this.initPagination();
            }
        },

        relayout: function(){
            this.width = this.panel.width();
            this.height = this.panel.height();
            this.panel.find(this.options.items).width(this.width).height(this.height);
        },

        initPagination: function(){
            this.pagination = this.panel.find(this.options.pagination);
            for(var i = 0; i < this.total; i++){
                var span = tools.$c('span', null, 'pagination-item');
                span.index = i;
                this.pagination.append(span);
            }
            this.paginationItems = this.pagination.find('span');
        },

        initEvents: function(){
        	var self = this;
        	self.panel.find(this.options.nextBtn).click(function(){
        		self.next();
        	});
        	self.panel.find(this.options.prevBtn).click(function(){
        		self.prev();
        	});
            if(this.options.pagination !== ''){
                self.on('show', function(e){
                    self.paginationItems.removeClass('active').eq(e.pointer).addClass('active');
                });
                self.pagination.click(function(e){
                    var index = e.target.index;
                    if($(e.target).hasClass('pagination-item')){
                        self.show(index);
                    }
                });
            }
        },

        next: function(){
            if(this.isAnimating){
                return;
            }
            var self = this;
            this.prevBtn.removeClass('disable');
            this.nextBtn.removeClass('disable');
            var nextId = this.pointer + 1;
            if(self.pointer >= self.total - 1){
                if(!this.options.loop){
                    return;
                }

                nextId = 0;
            }
            var itemSelector = this.options.items;
            var current = this.panel.find(itemSelector).eq(this.pointer);
            var next = this.panel.find(itemSelector).eq(nextId);

            this.isAnimating = true;

            this.effect.next(current, next, function(){
                self.isAnimating = false;
            });

            this.pointer = nextId;

            if(!this.options.loop && self.pointer >= self.total - 1){
                this.nextBtn.addClass('disable');
            }
            this.emit('show', {pointer: this.pointer});
        },
        prev: function(){
            if(this.isAnimating){
                return;
            }
			var self = this;
            this.prevBtn.removeClass('disable');
            this.nextBtn.removeClass('disable');
            var prevId = this.pointer - 1;
            if(self.pointer <= 0){
                if(!this.options.loop){
                    return;
                }

                prevId = this.total - 1;
            }
            var itemSelector = this.options.items;
            var current = this.panel.find(itemSelector).eq(this.pointer);
            var prev = this.panel.find(itemSelector).eq(prevId);

            this.isAnimating = true;

            this.effect.prev(current, prev, function(){
                self.isAnimating = false;
            });

            this.pointer = prevId;
            if(!this.options.loop && self.pointer <= 0){
                this.prevBtn.addClass('disable');
            }
            this.emit('show', {pointer: this.pointer});
        },

        show: function(pointer, noanimation){
            var self = this;
            if(self.isAnimating){
                return;
            }
            if(pointer < 0 ||pointer >= this.total || pointer == this.pointer){
                // console.log('illegal pointer');
                return;
            }
            var itemSelector = this.options.items;
            var current = this.panel.find(itemSelector).eq(this.pointer);
            var target = this.panel.find(itemSelector).eq(pointer);
            if(noanimation){
                if(pointer > this.pointer){ //next
                    current.css({left: 0-this.width});
                    target.css({left: 0}).show();
                }else{ //prev
                    current.css({left: this.width});
                    target.css({left: 0}).show();
                }
            }else{
                self.isAnimating = true;
                if(pointer > this.pointer){ //next
                    this.effect.next(current, target, function(){
                        self.isAnimating = false;
                    });
                }else{ //prev
                    this.effect.prev(current, target, function(){
                        self.isAnimating = false;
                    });
                }    
            }
            
            this.pointer = pointer;

            this.prevBtn.removeClass('disable');
            this.nextBtn.removeClass('disable');

            if(self.pointer >= self.total - 1){
                this.nextBtn.addClass('disable');
            }

            if(self.pointer <= 0){
                this.prevBtn.addClass('disable');
            }

            this.emit('show', {pointer: this.pointer});
        }
    };
    tools.extend(Slider, tools.EventEmitter);	

    var slider = function(options){
		var containers = $(options.container);
        var s = []
		containers.each(function(index){
			var newOptions = tools.mix(options, {container: this});
			s.push(new Slider(newOptions));
		});
        return s;
	};

    module.exports = slider;
});