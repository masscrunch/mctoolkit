(function(){


var SwipeNode = function(node){
        this._initSwipeNode(node);

    };

    SwipeNode.prototype = {
        _initSwipeNode: function (node) {
            EventEmitter.call(this);
            this.touchInfo = {
                startX: null,
                startY: null,
                endX: null,
                endY: null,
                diffX: null,
                diffY: null
            };

            this.startTime = 0;
            this.endTime = 0;
            var self = this;
            node.addEventListener('touchstart', function(e){
                var touch = e.touches[0];
                self.touchInfo.startX = touch.clientX;
                self.touchInfo.startY = touch.clientY;
                self.startTime = new Date().getTime();
            }, false);
            node.addEventListener('touchmove', function(e){
                var touch = e.changedTouches[0];

                self.touchInfo.endX = touch.clientX;
                self.touchInfo.endY = touch.clientY;

                var diffX = touch.clientX - self.touchInfo.startX;
                var diffY = touch.clientY - self.touchInfo.startY;

                self.emit('swipemove', mix(self.touchInfo, {
                    diffX: diffX,
                    diffY: diffY
                }));
            }, false);
            node.addEventListener('touchend', function (e) {
                self.endTime = new Date().getTime();
                if(self.endTime - self.startTime > 900){
                    return;
                }
                var touch = e.changedTouches[0];
                self.touchInfo.endX = touch.clientX;
                self.touchInfo.endY = touch.clientY;
                var diffX = self.touchInfo.diffX = self.touchInfo.endX - self.touchInfo.startX;
                var diffY = self.touchInfo.diffY = self.touchInfo.endY - self.touchInfo.startY;
                if(Math.abs(diffX) > 10 || Math.abs(diffY) > 10){
                    self.emit('swipe', mix({}, self.touchInfo));
                }
                if(Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)){
                    if(diffX > 0){
                        self.emit('swiperight', mix({}, self.touchInfo));
                    }else{
                        self.emit('swipeleft', mix({}, self.touchInfo));
                    }
                }
                if(Math.abs(diffY) > 10 && Math.abs(diffY) > Math.abs(diffX)){
                    if(diffY > 0){
                        self.emit('swipedown', mix({}, self.touchInfo));
                    }else{
                        self.emit('swipeup', mix({}, self.touchInfo));
                    }
                }
            }, false);
        }


    };
    extend(SwipeNode, EventEmitter);
    var Swipe = function(selector){
        this._initSwipe(selector);
    };
    Swipe.prototype = {
        _initSwipe: function (selector) {
            EventEmitter.call(this);
            this.events = ['swipe', 'swiperight', 'swipeleft', 'swipeup', 'swipedown', 'swipemove'];
            var self = this;
            var nodes = document.querySelectorAll(selector);
            for(var i = 0, len = nodes.length; i < len; i++){
                var sn = new SwipeNode(nodes[i]);

                this.bindEvents(sn);
            }

        },

        bindEvents: function(sn){
            var self = this;
            for(var i = 0, len = this.events.length; i < len; i++){
                self.bindEvent(sn, this.events[i]);
            }
        },

        bindEvent: function(sn, event){
            var self = this;
            sn.on(event, function (e) {
                self.emit(event, e);
            });
        }
    };
    extend(Swipe, EventEmitter);
    window.swipe = function(selector){
        return new Swipe(selector);
    };

})();
