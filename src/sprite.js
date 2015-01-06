define('sprite', function (require, exports, module) {
    var tools = require('./tools');
    var Sprite = function(options){
        this._initSprite(options);
    };
    Sprite.prototype = {
        _initSprite: function(options){
            tools.EventEmitter.call(this);
            this.options = tools.mix({
                image: null,
                spriteWidth: -1,
                spriteHeight: -1,
                offsetX: 0,
                offsetY: 0,
                canvas: null,
                interval: 100,
                stageWidth: -1,
                stageHeight: -1,
                frames: 3,
                direction: 'normal',
                autoplay: true,
                //zero is infinity
                iterationCount: 0,
                //两次动画之间的间隔
                separate: 0,
                //规定动画源的布局方式, horizontal, vertical, [column, row]
                sourceLayout: 'horizontal'
            }, options);
            //初始化场景尺寸
            var canvasDom = $(this.options.canvas).get(0);
            if(this.options.stageHeight < 0 || this.options.stageWidth < 0){
                this.options.stageWidth = canvasDom.width;
                this.options.stageHeight = canvasDom.height;
            }else{
                canvasDom.width = this.options.stageWidth;
                canvasDom.height = this.options.stageHeight;
            }

            if(this.options.direction == 'normal'){
                this.update = this.normalTick;
            }else{
                this.update = this.inverseTick;
            }
                        
            this.tick = 0;
            this.context = canvasDom.getContext('2d');
            this.iterationCount = 0;

            var self = this;
            if(! (this.options.image instanceof Image)){
                var url = this.options.image;
                this.options.image = new Image();
                this.options.image.src = url;
                this.options.image.onload = function(){
                    self.options.autoplay && self.start();
                }
            }else{
                self.options.autoplay && self.start();
            }

            this.on('loopend', function(e){
                if(self.options.separate > 0){
                    self.pause();
                    setTimeout(function(){
                        self.start();
                    }, self.options.separate);
                }
            });
        },

        start: function(){
            var self = this;
            this.render(this.tick);
            this.timer = setInterval(function(){
                self.render(self.tick);
                if(!self.update()){
                    self.pause();
                }
            }, this.options.interval);
        },

        goto: function(tick){
            this.tick = tick;
            this.render(tick);
        },

        pause: function(){
            clearInterval(this.timer);
        },

        update: function(){},
        normalTick: function(){
            if(this.tick < this.options.frames - 1)
                this.tick++;
            else{
                this.emit('loopend', {});
                this.iterationCount++;
                this.tick = 0;
            }

            if(this.options.iterationCount > 0 && this.iterationCount >= this.options.iterationCount){
                return false;
            }else{
                return true;
            }
        },
        inverseTick: function(){
            if(this.isInverse){
                if(this.tick > 0)
                    this.tick--;
                else{
                    this.iterationCount++;
                    this.emit('loopend', {});
                    this.isInverse = false;
                    this.tick ++;
                }
            }else{
                if(this.tick < this.options.frames - 1){
                    this.tick++;
                }else{
                    this.iterationCount++;
                    this.emit('loopend', {});
                    this.isInverse = true;
                    this.tick--;
                }
            }
            if(this.options.iterationCount > 0 && this.iterationCount >= this.options.iterationCount){
                return false;
            }else{
                return true;
            }
        },
        render: function(tick){
            
            var imgpos = this.getImagePos(tick);
            this.context.clearRect(0, 0, this.options.stageWidth, this.options.stageHeight);
            this.context.drawImage(
                this.options.image, 
                imgpos.x,
                imgpos.y, 
                this.options.spriteWidth, this.options.spriteHeight, 
                0, 0, 
                this.options.stageWidth, this.options.stageHeight
            );
        },
        getImagePos: function(tick){
            var opt = this.options;
            if(opt.sourceLayout instanceof Array && opt.sourceLayout.length == 2){
                //advance
                var x = tick % opt.sourceLayout[0];
                var y = parseInt((tick) / opt.sourceLayout[0]);
                return {
                    x: x * (opt.spriteWidth + opt.offsetX),
                    y: y * (opt.spriteHeight + opt.offsetY)
                }
            }else{
                //simple
                switch(this.options.sourceLayout){
                    case 'horizontal':
                        return {
                            x: (opt.spriteWidth + opt.offsetX) * tick,
                            y: 0
                        }
                    break;
                    case 'vertical':
                        return {
                            x: 0,
                            y: tick * (opt.spriteHeight + opt.offsetY)
                        }
                    break;
                }
            }
        }
    };
    tools.extend(Sprite, tools.EventEmitter);
    module.exports = Sprite;
});